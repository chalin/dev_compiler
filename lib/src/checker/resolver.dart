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
import 'package:ddc/src/utils.dart';
import 'dart_sdk.dart';
import 'multi_package_resolver.dart';

final _log = new logger.Logger('ddc.src.resolver');
// TODO(sigmund): make into a proper flag
const _useMultipackage =
    const bool.fromEnvironment('use_multi_package', defaultValue: false);

/// Encapsulates a resolver from the analyzer package.
class TypeResolver {
  final InternalAnalysisContext context;

  final Map<Uri, Source> _sources = <Uri, Source>{};

  TypeResolver(DartUriResolver sdkResolver,
      {List otherResolvers, bool inferFromOverrides: true})
      : context = _initContext(inferFromOverrides) {
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
InternalAnalysisContext _initContext(bool inferFromOverrides) {
  var options = new AnalysisOptionsImpl()..cacheSize = 512;
  InternalAnalysisContext res = AnalysisEngine.instance.createAnalysisContext();
  res.analysisOptions = options;
  res.resolverVisitorFactory = RestrictedResolverVisitor.constructor;
  if (inferFromOverrides) {
    res.typeResolverVisitorFactory = RestrictedTypeResolverVisitor.constructor;
  }
  return res;
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
}

/// Overrides the default [StaticTypeAnalyzer] to adjust rules that are stricter
/// in the restricted type system and to infer types for untyped local
/// variables.
class RestrictedStaticTypeAnalyzer extends StaticTypeAnalyzer {
  final DartType _bottomType;
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
    if (node.element is! LocalVariableElement) return;
    Expression initializer = node.initializer;
    if (initializer == null) return;

    var declaredType = (node.parent as VariableDeclarationList).type;
    if (declaredType != null) return;
    VariableElementImpl element = node.element;
    if (element.type != dynamicType) return;
    var type = getStaticType(initializer);
    if (type == _bottomType) return;
    element.type = type;
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

class RestrictedTypeResolverVisitor extends TypeResolverVisitor {
  RestrictedTypeResolverVisitor(
      Library library, Source source, TypeProvider typeProvider)
      : super.con1(library, source, typeProvider);

  static TypeResolverVisitor constructor(
      Library library, Source source, TypeProvider typeProvider) =>
      new RestrictedTypeResolverVisitor(library, source, typeProvider);

  @override
  Object visitVariableDeclaration(VariableDeclaration node) {
    var res = super.visitVariableDeclaration(node);

    var element = node.element;
    VariableDeclarationList parent = node.parent;
    // only infer types if it was left blank
    if (!element.type.isDynamic || parent.type != null) return res;

    // const fields and top-levels will be inferred from the initializer value
    // somewhere else.
    if (parent.isConst) return res;

    // For fields, we can infer the type if it was just ommited from the
    // superclass.
    if (node.element is FieldElement) {
      // Infer final fields that hide/shadow a field/getter from a parent class
      // or interface.
      var getter = element.getter;
      var type = searchTypeFor(element.enclosingElement.type, getter);
      if (type != null && !type.returnType.isDynamic) {
        element.type = type.returnType;
        getter.returnType = type.returnType;
      }
    }
    return res;
  }

  @override
  Object visitMethodDeclaration(MethodDeclaration node) {
    var res = super.visitMethodDeclaration(node);
    var element = node.element;
    if ((element is MethodElement || element is PropertyAccessorElement) &&
        element.returnType.isDynamic &&
        node.returnType == null) {
      var type = searchTypeFor(element.enclosingElement.type, element);
      if (type != null && !type.returnType.isDynamic) {
        element.returnType = type.returnType;
      }
    }
    return res;
  }
}
