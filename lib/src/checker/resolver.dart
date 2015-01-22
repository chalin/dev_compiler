/// Encapsulates how to invoke the analyzer resolver and overrides how it
/// computes types on expressions to use our restricted set of types.
library ddc.src.checker.resolver;

import 'package:analyzer/analyzer.dart';
import 'package:analyzer/src/generated/ast.dart';
import 'package:analyzer/src/generated/element.dart';
import 'package:analyzer/src/generated/engine.dart';
import 'package:analyzer/src/generated/error.dart';
import 'package:analyzer/src/generated/java_io.dart' show JavaFile;
import 'package:analyzer/src/generated/resolver.dart';
import 'package:analyzer/src/generated/sdk_io.dart' show DirectoryBasedDartSdk;
import 'package:analyzer/src/generated/source.dart' show DartUriResolver;
import 'package:analyzer/src/generated/source.dart' show Source;
import 'package:analyzer/src/generated/source_io.dart';
import 'package:logging/logging.dart' as logger;

import 'package:ddc/src/report.dart';
import 'package:ddc/src/utils.dart' show enclosingLibrary;
import 'dart_sdk.dart';
import 'multi_package_resolver.dart';

final _log = new logger.Logger('ddc.src.resolver');
// TODO(sigmund): make into a proper flag
const _useMultipackage =
    const bool.fromEnvironment('use_multi_package', defaultValue: false);

/// Encapsulates a resolver from the analyzer package.
class TypeResolver {
  final InternalAnalysisContext context = _initContext();

  final Map<Uri, Source> _sources = <Uri, Source>{};

  TypeResolver(DartUriResolver sdkResolver, [List otherResolvers]) {
    var resolvers = [sdkResolver];
    if (otherResolvers == null) {
      resolvers.add(new FileUriResolver());
      resolvers.add(_useMultipackage
          ? new MultiPackageResolver()
          : new PackageUriResolver([new JavaFile('packages/')]));
    } else {
      resolvers.addAll(otherResolvers);
    }
    context.sourceFactory = new SourceFactory(resolvers);
  }

  /// Find the corresponding [Source] for [uri].
  Source findSource(Uri uri) {
    var source = _sources[uri];
    if (source != null) return source;
    return _sources[uri] = context.sourceFactory.forUri('$uri');
  }

  /// Log any errors encountered when resolving [source] and return whether any
  /// errors were found.
  bool logErrors(Source source, CheckerReporter reporter) {
    List<AnalysisError> errors = context.getErrors(source).errors;
    bool failure = false;
    if (errors.isNotEmpty) {
      for (var error in errors) {
        var severity = error.errorCode.errorSeverity;
        var isError = severity == ErrorSeverity.ERROR;
        if (isError) failure = true;
        var level = isError ? logger.Level.SEVERE : logger.Level.WARNING;
        reporter.logAnalyzerError(
            error.message, level, error.offset, error.offset + error.length);
      }
    }
    return failure;
  }

  // TODO(jmesserly): in practice these are passed to `new TypeResolver` so
  // that makes me think these should just be named constructors, rather than
  // `new TypeResolver(TypeResolver.sdkResolverFromDir((...)) which repeats
  // the name twice.

  /// Creates a [DartUriResolver] that uses the SDK at the given [sdkPath].
  static DartUriResolver sdkResolverFromDir(String sdkPath) =>
      new DartUriResolver(new DirectoryBasedDartSdk(new JavaFile(sdkPath)));

  /// Creates a [DartUriResolver] that uses a mock 'dart:' library contents.
  static DartUriResolver sdkResolverFromMock(
      Map<String, String> mockSdkSources) {
    return new MockDartSdk(mockSdkSources, reportMissing: true).resolver;
  }
}

/// Creates an analysis context that contains our restricted typing rules.
InternalAnalysisContext _initContext() {
  var options = new AnalysisOptionsImpl()..cacheSize = 512;
  InternalAnalysisContext res = AnalysisEngine.instance.createAnalysisContext();
  return res
    ..analysisOptions = options
    ..resolverVisitorFactory = RestrictedResolverVisitor.constructor;
}

/// Overrides the default [ResolverVisitor] to comply with DDC's restricted
/// type rules. This changes how types are promoted in conditional expressions
/// and statements, and how types are computed on expressions.
class RestrictedResolverVisitor extends ResolverVisitor {
  RestrictedResolverVisitor(
      Library library, Source source, TypeProvider typeProvider) : super.con1(
          library, source, typeProvider,
          typeAnalyzerFactory: (r) => new RestrictedStaticTypeAnalyzer(r));

  static ResolverVisitor constructor(
      Library library, Source source, TypeProvider typeProvider) =>
      new RestrictedResolverVisitor(library, source, typeProvider);

  @override // removes type promotion
  void promoteTypes(Expression condition) {
    // TODO(sigmund, vsm): add this back, but use strict meaning of is checks.
  }

  @override
  Object visitCompilationUnit(CompilationUnit node) {
    // Similar to the definition in ResolverVisitor.visitCompilationUnit, but
    // changed to visit all top-level fields first, then static fields on all
    // classes, then all top-level functions, then the rest of the classes.
    overrideManager.enterScope();
    try {
      var thisLib = node.element.enclosingElement;
      RestrictedStaticTypeAnalyzer restrictedAnalyzer = typeAnalyzer;
      restrictedAnalyzer._isLibraryContainedInSingleUnit.putIfAbsent(thisLib,
          () {
        if (thisLib.units.length > 1) return false;
        for (var lib in thisLib.visibleLibraries) {
          if (lib != thisLib && lib.visibleLibraries.contains(thisLib)) {
            return false;
          }
        }
        return true;
      });

      void accept(n) {
        n.accept(this);
      }
      node.directives.forEach(accept);
      var declarations = node.declarations;

      declarations
          .where((d) => d is TopLevelVariableDeclaration)
          .forEach(accept);

      // Visit static fields before top-level methods too.
      declarations
          .where((d) => d is ClassDeclaration)
          .expand((c) => c.members)
          .where((m) => m is FieldDeclaration && m.isStatic)
          .forEach(accept);

      declarations
          .where((d) =>
              d is! TopLevelVariableDeclaration && d is! ClassDeclaration)
          .forEach(accept);

      declarations.where((d) => d is ClassDeclaration).forEach(accept);
    } finally {
      overrideManager.exitScope();
    }
    node.accept(elementResolver);
    node.accept(typeAnalyzer);
    return null;
  }

  @override
  void visitClassMembersInScope(ClassDeclaration node) {
    safelyVisit(node.documentationComment);
    node.metadata.accept(this);

    // This overrides the default way members are visited so that fields are
    // visited before method declarations.
    for (var n in node.members) {
      if (n is FieldDeclaration && !n.isStatic) n.accept(this);
    }
    for (var n in node.members) {
      if (n is! FieldDeclaration) n.accept(this);
    }
  }
}

/// Overrides the default [StaticTypeAnalyzer] to adjust rules that are stricter
/// in the restricted type system and to infer types for untyped local
/// variables.
class RestrictedStaticTypeAnalyzer extends StaticTypeAnalyzer {
  final DartType _bottomType;

  // TODO(sigmund): this needs to go away. This currently a restriction because
  // we are not overriding things early enough in the analyzer. This restriction
  // makes it safe to run the inference later, but only on libraries that are
  // contained in a single file and are not part of a cycle.
  Map<LibraryElement, bool> _isLibraryContainedInSingleUnit = {};
  RestrictedStaticTypeAnalyzer(ResolverVisitor r)
      : _bottomType = r.typeProvider.bottomType,
        super(r);

  @override // to infer type from initializers
  Object visitVariableDeclaration(VariableDeclaration node) {
    _inferType(node);
    return super.visitVariableDeclaration(node);
  }

  /// Infer the type of a variable based on the initializer's type.
  void _inferType(VariableDeclaration node) {
    var initializer = node.initializer;
    if (initializer == null) return;

    var declaredType = (node.parent as VariableDeclarationList).type;
    if (declaredType != null) return;
    var element = node.element;
    if (element.type != dynamicType) return;

    // Local variables can be inferred automatically, for top-levels and fields
    // we rule out cases that could depend on the order in which we process
    // them.
    if (element is! LocalVariableElement) {
      // Only infer types if the library is not in a cycle. Otherwise we can't
      // guarantee that we are order independent (we can't guarantee that we'll
      // visit all top-level declarations in all libraries, before we visit
      // methods in all libraries).
      var thisLib = enclosingLibrary(element);
      if (!_canBeInferredIndependently(initializer, thisLib)) return;
    }

    var type = getStaticType(initializer);
    if (type == _bottomType) return;
    element.type = type;
    if (element is PropertyInducingElement) {
      element.getter.returnType = type;
      if (!element.isFinal) element.setter.parameters[0].type = type;
    }
  }

  /// Whether we could determine the type of an [expression] in a way
  /// that doesn't depend on the order in which we infer types within a
  /// strongest connected component of libraries.
  ///
  /// This will return true if the expression consists just of literals or
  /// allocations, if it only uses symbols that come from libraries that are
  /// clearly processed before the library where this expression occurs
  /// ([thisLib]), or if it's composed of these subexpressions (excluding fields
  /// and top-levels that could've been inferred as well).
  ///
  /// The [inFieldContext] is used internally when visiting nested expressions
  /// recursively. It indicates that the subexpression will be used in the
  /// context of a field dereference.
  bool _canBeInferredIndependently(
      Expression expression, LibraryElement thisLib,
      {bool inFieldContext: false}) {
    if (!_isLibraryContainedInSingleUnit[thisLib]) return false;
    if (expression is Literal) return true;

    if (expression is InstanceCreationExpression) {
      if (!inFieldContext) return true;
      var element = expression.staticElement;
      if (element == null) {
        print('Unexpected `null` element for $expression');
        return false;
      }
      return !_sameConnectedComponent(thisLib, element);
    }
    if (expression is FunctionExpression) return true;
    if (expression is CascadeExpression) {
      return _canBeInferredIndependently(expression.target, thisLib,
          inFieldContext: inFieldContext);
    }

    if (expression is MethodInvocation) {
      return _canBeInferredIndependently(expression.target, thisLib,
          inFieldContext: true);
    }

    // Binary expressions, prefix/postfix expressions are are derived from the
    // type of the operand, which is known at this time even for classes in the
    // same library.
    if (expression is BinaryExpression) {
      return _canBeInferredIndependently(expression.leftOperand, thisLib,
          inFieldContext: false);
    }
    if (expression is PrefixExpression) {
      return _canBeInferredIndependently(expression.operand, thisLib,
          inFieldContext: false);
    }
    if (expression is PostfixExpression) {
      return _canBeInferredIndependently(expression.operand, thisLib,
          inFieldContext: false);
    }

    // Property accesses and prefix identifiers can be resolved as fields, in
    // which case, we need to choose whether or not to inferred based o
    if (expression is PropertyAccess) {
      return _canBeInferredIndependently(expression.target, thisLib,
          inFieldContext: true);
    }
    if (expression is PrefixedIdentifier) {
      return _canBeInferredIndependently(expression.identifier, thisLib,
          inFieldContext: true);
    }

    if (expression is SimpleIdentifier) {
      var element = expression.bestElement;
      if (element == null) {
        print('Unexpected `null` element for $expression');
        return false;
      }
      return !_sameConnectedComponent(thisLib, element);
    }
    return false;
  }

  /// Whether [dependency] is in the same strongest connected component of
  /// libraries as [declaration].
  bool _sameConnectedComponent(LibraryElement thisLib, Element dependency) {
    assert(dependency != null);
    var otherLib = enclosingLibrary(dependency);
    // Note: we would check here also whether
    // otherLib.visibleLibraries.contains(thisLib), however because we are not
    // inferring type on any library that belongs to a cycle or that contains
    // parts, we know that this cannot be true.
    return thisLib == otherLib;
  }

  @override // to propagate types to identifiers
  visitMethodInvocation(MethodInvocation node) {
    // TODO(sigmund): follow up with analyzer team - why is this needed?
    visitSimpleIdentifier(node.methodName);
    return super.visitMethodInvocation(node);
  }

  // Review note: no longer need to override visitFunctionExpression, this is
  // handled by the analyzer internally.
  // TODO(vsm): in visitbinaryExpression: check computeStaticReturnType result?
  // TODO(vsm): in visitConditionalExpression: check... LUB in rules?
  // TODO(vsm): in visitFunctionDeclaration: Should we ever use the expression
  // type in a (...) => expr or just the written type?

}
