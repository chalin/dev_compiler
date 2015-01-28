/// Holds a couple utility functions used at various places in the system.
library ddc.src.utils;

import 'dart:io';

import 'package:analyzer/src/generated/ast.dart'
    show ImportDirective, ExportDirective, PartDirective, CompilationUnit;
import 'package:analyzer/src/generated/engine.dart'
    show ParseDartTask, AnalysisContext;
import 'package:analyzer/src/generated/source.dart' show Source;
import 'package:analyzer/src/generated/element.dart';
import 'package:analyzer/analyzer.dart' show parseDirectives;

// Choose a canonical name for library
String libraryName(String name, Uri uri) {
  if (name != null && name != '') return name;

  // Fall back on the file name.
  var tail = uri.pathSegments.last;
  if (tail.endsWith('.dart')) tail = tail.substring(0, tail.length - 5);
  return tail;
}

// Choose a canonical name for library element
String libraryNameFromLibraryElement(LibraryElement library) {
  return libraryName(library.name, library.source.uri);
}

/// Returns all libraries transitively imported or exported from [start].
Iterable<LibraryElement> reachableLibraries(LibraryElement start) {
  var results = <LibraryElement>[];
  var seen = new Set();
  void find(LibraryElement lib) {
    if (seen.contains(lib)) return;
    seen.add(lib);
    results.add(lib);
    lib.importedLibraries.forEach(find);
    lib.exportedLibraries.forEach(find);
  }
  find(start);
  return results;
}

/// Returns all sources transitively imported or exported from [start] in
/// post-visit order. Internally this uses digest parsing to read only
/// directives from each source, that way library resolution can be done
/// bottom-up and improve performance of the analyzer internal cache.
Iterable<Source> reachableSources(Source start, AnalysisContext context) {
  var results = <Source>[];
  var seen = new Set();
  void find(Source source) {
    if (seen.contains(source)) return;
    seen.add(source);
    _importsAndExportsOf(source, context).forEach(find);
    results.add(source);
  }
  find(start);
  return results;
}

/// Returns sources that are imported or exported in [source] (parts are
/// excluded).
Iterable<Source> _importsAndExportsOf(Source source, AnalysisContext context) {
  var unit = parseDirectives(source.contents.data, name: source.fullName);
  return unit.directives
      .where((d) => d is ImportDirective || d is ExportDirective)
      .map((d) {
    var res = ParseDartTask.resolveDirective(context, source, d, null);
    if (res == null) print('error: couldn\'t resolve $d');
    return res;
  }).where((d) => d != null);
}

/// Returns sources that are included with part directives from [unit].
Iterable<Source> partsOf(CompilationUnit unit, AnalysisContext context) {
  return unit.directives.where((d) => d is PartDirective).map((d) {
    var res =
        ParseDartTask.resolveDirective(context, unit.element.source, d, null);
    if (res == null) print('error: couldn\'t resolve $d');
    return res;
  }).where((d) => d != null);
}

/// Looks up the declaration that matches [member] in [type] or its superclasses
/// and interfaces, and returns it's declared type.
// TODO(sigmund): add this to lookUp* in analyzer. The difference here is that
// we also look in interfaces in addition to superclasses.
FunctionType searchTypeFor(InterfaceType start, ExecutableElement member) {
  var getMemberTypeHelper = _memberTypeGetter(member);
  FunctionType search(InterfaceType type, bool first) {
    if (type == null) return null;
    // TODO(sigmund): lookups with generics is causing exceptions. Need to
    // investigate and create a small repro case.
    if (type.typeArguments.length > 0) return null;

    var res = null;
    if (!first) {
      res = getMemberTypeHelper(type);
      if (res != null) return res;
    }

    for (var m in type.mixins.reversed) {
      res = search(m, false);
      if (res != null) return res;
    }

    res = search(type.superclass, false);
    if (res != null) return res;

    for (var i in type.interfaces) {
      res = search(i, false);
      if (res != null) return res;
    }

    return null;
  }

  return search(start, true);
}

/// Looks up the declaration that matches [member] in [type] and returns it's
/// declared type.
FunctionType getMemberType(InterfaceType type, ExecutableElement member) =>
    _memberTypeGetter(member)(type);

typedef FunctionType _MemberTypeGetter(InterfaceType type);

_MemberTypeGetter _memberTypeGetter(ExecutableElement member) {
  String memberName = member.name;
  final isGetter = member is PropertyAccessorElement && member.isGetter;
  final isSetter = member is PropertyAccessorElement && member.isSetter;

  FunctionType f(InterfaceType type) {
    ExecutableElement baseMethod;
    if (isGetter) {
      assert(!isSetter);
      // Look for getter or field.
      baseMethod = type.getGetter(memberName);
    } else if (isSetter) {
      baseMethod = type.getSetter(memberName);
    } else {
      baseMethod = type.getMethod(memberName);
    }
    if (baseMethod == null) return null;
    return baseMethod.type;
  }
  ;
  return f;
}

/// Returns an ANSII color escape sequence corresponding to [levelName]. Colors
/// are defined for: severe, error, warning, or info. Returns null if the level
/// name is not recognized.
String colorOf(String levelName) {
  levelName = levelName.toLowerCase();
  if (levelName == 'shout' || levelName == 'severe' || levelName == 'error') {
    return _RED_COLOR;
  }
  if (levelName == 'warning') return _MAGENTA_COLOR;
  if (levelName == 'info') return _CYAN_COLOR;
  return null;
}

const String _RED_COLOR = '\u001b[31m';
const String _MAGENTA_COLOR = '\u001b[35m';
const String _CYAN_COLOR = '\u001b[36m';

class OutWriter {
  final String _path;
  final StringBuffer _sb = new StringBuffer();
  int _indent = 0;
  String _prefix = "";
  bool _needsIndent = true;

  OutWriter(this._path);

  void write(String string, [int indent = 0]) {
    if (indent < 0) inc(indent);

    var lines = string.split('\n');
    for (var i = 0, end = lines.length - 1; i < end; i++) {
      _writeln(lines[i]);
    }
    _write(lines.last);

    if (indent > 0) inc(indent);
  }

  void _writeln(String string) {
    if (_needsIndent && string.isNotEmpty) _sb.write(_prefix);
    _sb.writeln(string);
    _needsIndent = true;
  }

  void _write(String string) {
    if (_needsIndent && string.isNotEmpty) {
      _sb.write(_prefix);
      _needsIndent = false;
    }
    _sb.write(string);
  }

  void inc([int n = 2]) {
    _indent = _indent + n;
    assert(_indent >= 0);
    _prefix = "".padRight(_indent);
  }

  void dec([int n = 2]) {
    _indent = _indent - n;
    assert(_indent >= 0);
    _prefix = "".padRight(_indent);
  }

  void close() {
    new File(_path).writeAsStringSync('$_sb');
  }
}
