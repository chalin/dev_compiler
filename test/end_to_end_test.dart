/// Tests that run the checker end-to-end using the file system, but with a mock
/// SDK.
library ddc.test.end_to_end;

import 'dart:io';
import 'package:ddc/devc.dart' show compile;
import 'package:ddc/src/checker/dart_sdk.dart' show mockSdkSources;
import 'package:ddc/src/checker/resolver.dart' show TypeResolver;
import 'package:ddc/src/options.dart';
import 'package:ddc/src/report.dart';
import 'package:path/path.dart' as path;
import 'package:unittest/unittest.dart';

main() {
  var mockSdk = new TypeResolver.fromMock(mockSdkSources);

  var testDir = path.absolute(path.dirname(Platform.script.path));

  _check(testfile) {
    compile('$testDir/$testfile.dart', mockSdk, new CompilerOptions(),
        new LogReporter());
  }

  test('checker runs correctly (end-to-end)', () {
    _check('samples/funwithtypes');
  });

  test('checker accepts files with imports', () {
    _check('samples/import_test');
  });

  test('checker tests function types', () {
    // TODO(vsm): Check for correct down casts.
    _check('samples/function_type_test');
  });

  test('checker tests runtime checks', () {
    // TODO(sigmund,vsm): Check output for invalid checks.
    _check('samples/runtimetypechecktest');
  });

  test('checker tests return values', () {
    // TODO(vsm): Check for conversions.
    _check('samples/return_test');
  });
}
