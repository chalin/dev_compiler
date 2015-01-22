/// Tests for type inference.
library ddc.test.inferred_type_test;

import 'package:unittest/compact_vm_config.dart';
import 'package:unittest/unittest.dart';

import 'package:ddc/src/testing.dart';

main() {
  useCompactVMConfiguration();
  test('infer type on var', () {
    // Error also expected when declared type is `int`.
    testChecker({
      '/main.dart': '''
      test1() {
        int x = 3;
        x = /*severe:StaticTypeError*/"hi";
      }
    '''
    });

    // If inferred type is `int`, error is also reported
    testChecker({
      '/main.dart': '''
      test2() {
        var x = 3;
        x = /*severe:StaticTypeError*/"hi";
      }
    '''
    });
  });

  test('do not infer type on dynamic', () {
    testChecker({
      '/main.dart': '''
      test() {
        dynamic x = 3;
        x = "hi";
      }
    '''
    });
  });

  test('do not infer type when initializer is null', () {
    testChecker({
      '/main.dart': '''
      test() {
        var x = null;
        x = "hi";
        x = 3;
      }
    '''
    });
  });

  test('infer type on var from field', () {
    testChecker({
      '/main.dart': '''
      class A {
        int x;

        test1() {
          var a = x;
          a = /*severe:StaticTypeError*/"hi";
          a = 3;
          var b = y;
          b = /*severe:StaticTypeError*/"hi";
          b = 4;
          var c = z;
          c = /*severe:StaticTypeError*/"hi";
          c = 4;
        }

        int y; // field def after use
        final z = 42; // should infer `int`
      }
    '''
    });
  });

  test('infer type on var from top-level', () {
    testChecker({
      '/main.dart': '''
      int x;

      test1() {
        var a = x;
        a = /*severe:StaticTypeError*/"hi";
        a = 3;
        var b = y;
        b = /*severe:StaticTypeError*/"hi";
        b = 4;
        var c = z;
        c = /*severe:StaticTypeError*/"hi";
        c = 4;
      }

      int y; // field def after use
      final z = 42; // should infer `int`
    '''
    });
  });

  test('do not infer from variables in same lib (order independence)', () {
    testChecker({
      '/main.dart': '''
          var x = 2;
          var y = x;

          test1() {
            x = /*severe:StaticTypeError*/"hi";
            y = "hi";
          }
    '''
    });

    testChecker({
      '/main.dart': '''
          class A {
            static var x = 2;
            static var y = A.x;
          }

          test1() {
            A.x = /*severe:StaticTypeError*/"hi";
            A.y = "hi";
          }
    '''
    });
  });

  test('ok to infer from variables in non-cycle libs', () {
    testChecker({
      '/a.dart': '''
          var x = 2;
      ''',
      '/main.dart': '''
          import 'a.dart';
          var y = x;

          test1() {
            x = /*severe:StaticTypeError*/"hi";
            y = /*severe:StaticTypeError*/"hi";
          }
    '''
    });

    testChecker({
      '/a.dart': '''
          class A { static var x = 2; }
      ''',
      '/main.dart': '''
          import 'a.dart';
          class B { static var y = A.x; }

          test1() {
            A.x = /*severe:StaticTypeError*/"hi";
            B.y = /*severe:StaticTypeError*/"hi";
          }
    '''
    });
  });

  test('do not infer from variables in cycle libs', () {
    testChecker({
      '/a.dart': '''
          import 'main.dart';
          var x = 2;
      ''',
      '/main.dart': '''
          import 'a.dart';
          var y = x;

          test1() {
            int t;
            t = /*info:DownCast*/x;
            t = /*info:DownCast*/y;
          }
    '''
    });

    testChecker({
      '/a.dart': '''
          import 'main.dart';
          class A { static var x = 2; }
      ''',
      '/main.dart': '''
          import 'a.dart';
          class B { static var y = A.x; }

          test1() {
            int t;
            t = /*info:DownCast*/A.x;
            t = /*info:DownCast*/A.y;
          }
    '''
    });
  });

  test('infer from also static and instance fields', () {
    testChecker({
      '/a.dart': '''
          import 'b.dart';
          class A {
            static final a1 = B.b1;
            final a2 = new B().b2;
          }
      ''',
      '/b.dart': '''
          class B {
            static final b1 = 1;
            final b2 = 1;
          }
      ''',
      '/c.dart': '''
          import "main.dart"; // creates a cycle

          class C {
            static final c1 = 1;
            final c2 = 1;
          }
      ''',
      '/e.dart': '''
          part "e2.dart";

          class E {
            static final e1 = 1;
            final e2 = 1;
          }
      ''',
      '/e2.dart': '',
      '/f.dart': '''
          part "f2.dart";
      ''',
      '/e2.dart': '''
          class F {
            static final f1 = 1;
            final f2 = 1;
          }
      ''',
      '/main.dart': '''
          import "a.dart";
          import "c.dart";
          import "e.dart";

          class D {
            static final d1 = A.a1 + 1;
            static final d2 = C.c1 + 1;
            final d3 = new A().a2;
            final d4 = new C().c2;
          }

          test1() {
            int x;
            // inference in A works, it's not in a cycle
            x = A.a1;
            x = new A().a2;

            // inference here or in c.dart is disabled because of the cycle
            x = /*info:DownCast*/C.c1;
            x = /*info:DownCast*/D.d1;
            x = /*info:DownCast*/D.d2;
            x = /*info:DownCast*/new C().c2;
            x = /*info:DownCast*/new D().d3;
            x = /*info:DownCast*/new D().d4;


            // inference in e.dart and f.dart is disabled because they contains
            // parts
            x = /*info:DownCast*/E.e1;
            x = /*info:DownCast*/new E().e2;
            x = /*info:DownCast*/F.f1;
            x = /*info:DownCast*/new F().f2;
          }
    '''
    });
  });

  test('infer from complex expressions if the outer-most value is precise', () {
    testChecker({
      '/main.dart': '''
        class A { int x; B operator+(other) {} }
        class B extends A { B(ignore); }
        var a = new A();
        // Note: it doesn't matter that some of these refer to 'x'.
        var b = new B(x);       // allocations
        var c1 = [x];           // list literals
        var c2 = const [];
        var d = {'a': 'b'};     // map literals
        var e = new A()..x = 3; // cascades
        var f = 2 + 3;          // binary expressions are OK if the left operand
                                // is from a library in a different strongest
                                // conected component.
        var g = -3;
        var h = new A() + 3;
        var i = - new A();

        test1() {
          a = /*severe:StaticTypeError*/"hi";
          a = new B(3);
          b = /*severe:StaticTypeError*/"hi";
          b = new B(3);
          c1 = [];
          c1 = /*severe:StaticTypeError*/{};
          c2 = [];
          c2 = /*severe:StaticTypeError*/{};
          d = {};
          d = /*severe:StaticTypeError*/3;
          e = new A();
          e = /*severe:StaticTypeError*/{};
          f = 3;
          f = /*severe:StaticTypeError*/false;
          g = 1;
          g = /*severe:StaticTypeError*/false;
          h = /*severe:StaticTypeError*/false;
          h = new B();
          i = false;
        }
    '''
    });
  });

  test('do not infer if complex expressions read possibly inferred field', () {
    testChecker({
      '/a.dart': '''
        class A {
          var x = 3;
        }
      ''',
      '/main.dart': '''
        import 'a.dart';
        class B {
          var y = 3;
        }
        final t1 = new A();
        final t2 = new A().x;
        final t3 = new B();
        final t4 = new B().y;

        test1() {
          int i;
          A a;
          B b;
          a = t1;
          i = t2;
          b = t3;
          i = /*info:DownCast*/t4;
        }
    '''
    });
  });

  test('infer types on loop indices', () {
    // foreach loop
    testChecker({
      '/main.dart': '''
      class Foo {
        int bar = 42;
      }

      test() {
        var l = List<Foo>();
        for (var x in list) {
          String y = /*info:DownCast should be severe:StaticTypeError*/x;
        }
      }
      '''
    });

    // for loop, with inference
    testChecker({
      '/main.dart': '''
      test() {
        for (var i = 0; i < 10; i++) {
          int j = i + 1;
        }
      }
      '''
    });
  });

  test('propagate inference to field in class', () {
    testChecker({
      '/main.dart': '''
      class A {
        int x = 2;
      }

      test() {
        var a = new A();
        A b = a;                      // doesn't require down cast
        print(a.x);     // doesn't require dynamic invoke
        print(a.x + 2); // ok to use in bigger expression
      }
    '''
    });

    // Same code with dynamic yields warnings
    testChecker({
      '/main.dart': '''
      class A {
        int x = 2;
      }

      test() {
        dynamic a = new A();
        A b = /*info:DownCast*/a;
        print(/*warning:DynamicInvoke*/a.x);
        print((/*warning:DynamicInvoke*/a.x) + 2);
      }
    '''
    });
  });

  test('propagate inference transitively ', () {
    testChecker({
      '/main.dart': '''
      class A {
        int x = 2;
      }

      test5() {
        var a1 = new A();
        a1.x = /*severe:StaticTypeError*/"hi";

        A a2 = new A();
        a2.x = /*severe:StaticTypeError*/"hi";
      }
    '''
    });

    testChecker({
      '/main.dart': '''
      class A {
        int x = 42;
      }

      class B {
        A a = new A();
      }

      class C {
        B b = new B();
      }

      class D {
        C c = new C();
      }

      void main() {
        var d1 = new D();
        print(d1.c.b.a.x);

        D d2 = new D();
        print(d2.c.b.a.x);
      }
    '''
    });
  });
}
