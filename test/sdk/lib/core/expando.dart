// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

part of dart.core;

/**
 * An [Expando] allows adding new properties to objects.
 *
 * Does not work on numbers, strings, booleans or null.
 *
 * An `Expando` does not hold on to the added property value after an object
 * becomes inacessible.
 *
 * Since you can always create a new number that is identical to an existing
 * number, it means that an expando property on a number could never be
 * released. To avoid this, expando properties cannot be added to numbers.
 * The same argument applies to strings, booleans and null, which also have
 * literals that evaluate to identical values when they occur more than once.
 *
 * There is no restriction on other classes, even for compile time constant
 * objects. Be careful if adding expando properties to compile time constants,
 * since they will stay alive forever.
 */
class Expando<T> {

  /**
   * The name of the this [Expando] as passed to the constructor. If
   * no name was passed to the constructor, the name is [:null:].
   */
  final String name;

  @patch
  Expando([String name]) : this.name = name;

  /**
   * Expando toString method override.
   */
  String toString() => "Expando:$name";

  @patch
  T operator[](Object object) {
    var values = Primitives.getProperty(object, _EXPANDO_PROPERTY_NAME);
    return (values == null) ? null : Primitives.getProperty(values, _getKey());
  }

  @patch
  void operator[]=(Object object, T value) {
    var values = Primitives.getProperty(object, _EXPANDO_PROPERTY_NAME);
    if (values == null) {
      values = new Object();
      Primitives.setProperty(object, _EXPANDO_PROPERTY_NAME, values);
    }
    Primitives.setProperty(values, _getKey(), value);
  }

}
