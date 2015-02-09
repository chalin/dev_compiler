#!/usr/bin/env dart

/// Command line tool to merge the SDK libraries and our patch files.
/// This is currently designed as an offline tool, but we could automate it.
library ddc.tool.patch_sdk;

import 'dart:io';
import 'dart:math' as math;

import 'package:analyzer/analyzer.dart';
import 'package:path/path.dart' as path;

import 'sdk/lib/_internal/libraries.dart' as sdk;

void main(List<String> argv) {
  var toolDir = path.relative(path.dirname(Platform.script.path));
  var sdkIn = path.join(toolDir, 'sdk', 'lib');
  var patchIn = path.join(toolDir, 'js_patch');
  var sdkOut = path.join(path.dirname(toolDir), 'test', 'sdk', 'lib');

  if (argv.isNotEmpty) {
    print('Usage: ${path.relative(Platform.script.path)}\n');
    print('input SDK directory: $sdkIn');
    print('input patch directory: $patchIn');
    print('output SDK directory: $sdkOut');
    exit(1);
  }

  // Copy libraries.dart itself
  _writeSync(path.join(sdkOut, '_internal', 'libraries.dart'),
      new File(path.join(sdkIn, '_internal', 'libraries.dart'))
          .readAsStringSync());

  // Enumerate core libraries and apply patches
  for (var library in sdk.LIBRARIES.values) {
    var libraryPath = path.join(sdkIn, library.path);
    var libraryFile = new File(libraryPath);
    if (libraryFile.existsSync()) {
      var contents = <String>[];
      var paths = <String>[];
      var libraryContents = libraryFile.readAsStringSync();
      paths.add(libraryPath);
      contents.add(libraryContents);
      for (var part in parseDirectives(libraryContents).directives) {
        if (part is PartDirective) {
          paths.add(path.join(path.dirname(libraryPath), part.uri.stringValue));
          contents.add(new File(paths.last).readAsStringSync());
        }
      }

      var patchPath = path.join(patchIn, library.dart2jsPatchPath
          .replaceAll('_internal/compiler/js_lib/', ''));
      var patchContents = new File(patchPath).readAsStringSync();

      contents = _patchLibrary(contents, patchContents);
      for (var i = 0; i < paths.length; i++) {
        var outPath = path.join(sdkOut, path.relative(paths[i], from: sdkIn));
        _writeSync(outPath, contents[i]);
      }
    }
  }
}

/// Writes a file, creating the directory if needed.
void _writeSync(String filePath, String contents) {
  print('Writing $filePath');

  var outDir = new Directory(path.dirname(filePath));
  if (!outDir.existsSync()) outDir.createSync(recursive: true);

  new File(filePath).writeAsStringSync(contents);
}

/// Merges dart:* library code with code from *_patch.dart file.
///
/// Takes a list of the library's parts contents, with the main library contents
/// first in the list, and the contents of the patch file.
///
/// The result will have `@patch` implementations merged into the correct place
/// (e.g. the class or top-level function declaration) and all other
/// declarations introduced by the patch will be placed into the main library
/// file.
///
/// This is purely a syntactic transformation. Unlike dart2js patch files, there
/// is no semantic meaning given to the *_patch files, and they do not magically
/// get their own library scope, etc.
///
/// Editorializing: the dart2js approach requires a Dart front end such as
/// package:analyzer to semantically model a feature beyond what is specified
/// in the Dart language. Since this feature is only for the convenience of
/// writing the dart:* libraries, and not a tool given to Dart developers, it
/// seems like a non-ideal situation. Instead we keep the preprocessing simple.
List<String> _patchLibrary(List<String> partsContents, String patchContents) {
  var results = <String>[];

  // Parse the patch first. We'll need to extract bits of this as we go through
  // the other files.
  var patchUnit = parseCompilationUnit(patchContents);
  var patchInfo = (new PatchFinder()..visitCompilationUnit(patchUnit)).patches;

  // Process the library file.
  var libraryContents = partsContents.first;
  var libraryUnit = parseCompilationUnit(libraryContents);
  var libraryEdits = new TextEditTransaction(libraryContents);
  libraryUnit.accept(new PatchApplier(libraryEdits, patchInfo, patchContents));
  _mergeUnpatched(libraryEdits, libraryUnit, patchUnit, patchContents);
  results.add(libraryEdits.commit());

  // Process parts.
  for (var partContents in partsContents.skip(1)) {
    var partEdits = new TextEditTransaction(partContents);
    var partUnit = parseCompilationUnit(partContents);
    partUnit.accept(new PatchApplier(partEdits, patchInfo, patchContents));
    results.add(partEdits.commit());
  }
  return results;
}


/// Merges directives and declarations that are not `@patch` into the library.
void _mergeUnpatched(TextEditTransaction edits, CompilationUnit lib,
    CompilationUnit patchUnit, String patchContents) {

  // Merge directives from the patch
  // TODO(jmesserly): remove duplicates
  var directivePos = lib.directives.last.end;
  for (var directive in patchUnit.directives.reversed) {
    var uri = directive.uri.stringValue;
    // TODO(jmesserly): figure out what to do about these
    if (uri.startsWith('dart:_') && uri != 'dart:_internal') continue;
    var code = patchContents.substring(directive.offset, directive.end);
    edits.edit(directivePos, directivePos, '\n' + code);
  }

  // Merge declarations from the patch
  var declarationPos = edits.original.length;
  for (var declaration in patchUnit.declarations.reversed) {
    if (_isPatch(declaration)) continue;
    var code = patchContents.substring(declaration.offset, declaration.end);
    edits.edit(declarationPos, declarationPos, '\n' + code);
  }
}

/// Merge `@patch` declarations into `external` declarations.
class PatchApplier extends RecursiveAstVisitor {
  final TextEditTransaction edits;
  final Map<String, Declaration> patches;
  final String patchCode;

  PatchApplier(this.edits, this.patches, this.patchCode);

  @override visitFunctionDeclaration(FunctionDeclaration node) {
    _maybePatch(node);
    return super.visitFunctionDeclaration(node);
  }
  @override visitMethodDeclaration(MethodDeclaration node) {
    _maybePatch(node);
    return super.visitMethodDeclaration(node);
  }
  @override visitConstructorDeclaration(ConstructorDeclaration node) {
    _maybePatch(node);
    return super.visitConstructorDeclaration(node);
  }

  void _maybePatch(AstNode node) {
    var externalKeyword = (node as dynamic).externalKeyword;
    if (externalKeyword == null) return;

    var name = _qualifiedName(node);
    var patchNode = patches[name];
    if (patchNode == null) throw 'patch not found for $name: $node';

    var code = patchCode.substring(patchNode.offset, patchNode.end);

    // For some node like static fields, the node's offset doesn't include
    // static fields.
    var begin = math.min(node.offset, externalKeyword.offset);
    edits.edit(begin, node.end, code);
  }
}

class PatchFinder extends RecursiveAstVisitor {
  final Map patches = <String, Declaration>{};

  @override visitFunctionDeclaration(FunctionDeclaration node) {
    _maybeStorePatch(node);
    return super.visitFunctionDeclaration(node);
  }
  @override visitMethodDeclaration(MethodDeclaration node) {
    _maybeStorePatch(node);
    return super.visitMethodDeclaration(node);
  }
  @override visitConstructorDeclaration(ConstructorDeclaration node) {
    _maybeStorePatch(node);
    return super.visitConstructorDeclaration(node);
  }

  void _maybeStorePatch(Declaration node) {
    if (!_isPatch(node)) return;

    var parent = node.parent;
    if (parent is ClassDeclaration) {
      if (!_isPatch(parent)) throw 'class $parent is not a patch but $node is';
    }

    patches[_qualifiedName(node)] = node;
  }
}

String _qualifiedName(Declaration node) {
  assert(node is MethodDeclaration || node is FunctionDeclaration ||
      node is ConstructorDeclaration);

  var parent = node.parent;
  var className = '';
  if (parent is ClassDeclaration) {
    className = parent.name.name + '.';
  }
  var name = (node as dynamic).name;
  return className + (name != null ? name.name : '');
}

bool _isPatch(AnnotatedNode node) => node.metadata.any(_isPatchAnnotation);

bool _isPatchAnnotation(Annotation m) =>
    m.name.name == 'patch' && m.constructorName == null && m.arguments == null;


/// Editable text transaction.
///
/// Applies a series of edits using original location
/// information, and composes them into the edited string.
// TODO(jmesserly): copy+pasted from package:source_maps/refactor.dart
// TextEditTransaction. Since my original implementation of that class it's
// become dependent on source_maps stuff which we don't care about here.
class TextEditTransaction {
  final String original;
  final _edits = <_TextEdit>[];

  /// Creates a new transaction.
  TextEditTransaction(this.original);

  bool get hasEdits => _edits.length > 0;

  /// Edit the original text, replacing text on the range [begin] and [end]
  /// with the [replacement]. [replacement] can be either a string or a
  /// [NestedPrinter].
  void edit(int begin, int end, replacement) {
    _edits.add(new _TextEdit(begin, end, replacement));
  }

  /// Applies all pending [edit]s and returns a [NestedPrinter] containing the
  /// rewritten string and source map information. [filename] is given to the
  /// underlying printer to indicate the name of the generated file that will
  /// contains the source map information.
  ///
  /// Throws [UnsupportedError] if the edits were overlapping. If no edits were
  /// made, the printer simply contains the original string.
  String commit() {
    var sb = new StringBuffer();
    if (_edits.length == 0) return original;

    // Sort edits by start location.
    _edits.sort();

    int consumed = 0;
    for (var edit in _edits) {
      if (consumed > edit.begin) {
        sb = new StringBuffer();
        sb..write('overlapping edits. Insert at offset ')
          ..write(edit.begin)
          ..write(' but have consumed ')
          ..write(consumed)
          ..write(' input characters. List of edits:');
        for (var e in _edits) sb..write('\n    ')..write(e);
        throw new UnsupportedError(sb.toString());
      }

      // Add characters from the original string between this edit and the last
      // one, if any.
      var betweenEdits = original.substring(consumed, edit.begin);
      sb..write(betweenEdits)..write(edit.replace);
      consumed = edit.end;
    }

    // Add any text from the end of the original string that was not replaced.
    sb.write(original.substring(consumed));
    return sb.toString();
  }
}

class _TextEdit implements Comparable<_TextEdit> {
  final int begin;
  final int end;

  /// The replacement used by the edit, can be a string or a [NestedPrinter].
  final replace;

  _TextEdit(this.begin, this.end, this.replace);

  int get length => end - begin;

  String toString() => '(Edit @ $begin,$end: "$replace")';

  int compareTo(_TextEdit other) {
    int diff = begin - other.begin;
    if (diff != 0) return diff;
    return end - other.end;
  }
}
