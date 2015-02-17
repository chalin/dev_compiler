var math;
(function (math) {
  'use strict';
  let E = 2.718281828459045;
  let LN10 = 2.302585092994046;
  let LN2 = 0.6931471805599453;
  let LOG2E = 1.4426950408889634;
  let LOG10E = 0.4342944819032518;
  let PI = 3.141592653589793;
  let SQRT1_2 = 0.7071067811865476;
  let SQRT2 = 1.4142135623730951;
  // Function min: (num, num) → num
  function min(a, b) {
    if (!dart.is(a, core.num)) throw new core.ArgumentError(a);
    if (!dart.is(b, core.num)) throw new core.ArgumentError(b);
    if (a > b) return b;
    if (a < b) return a;
    if (typeof b == "number") {
      if (typeof a == "number") {
        if (a === 0.0) {
          return (a + b) * a * b;
        }
      }
      if (a === 0 && b.isNegative || b.isNaN) return b;
      return a;
    }
    return a;
  }

  // Function max: (num, num) → num
  function max(a, b) {
    if (!dart.is(a, core.num)) throw new core.ArgumentError(a);
    if (!dart.is(b, core.num)) throw new core.ArgumentError(b);
    if (a > b) return a;
    if (a < b) return b;
    if (typeof b == "number") {
      if (typeof a == "number") {
        if (a === 0.0) {
          return a + b;
        }
      }
      if (b.isNaN) return b;
      return a;
    }
    if (b === 0 && a.isNegative) return b;
    return a;
  }

  // Function atan2: (num, num) → double
  function atan2(a, b) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.atan2(#, #)', dart.dinvokef(/* Unimplemented unknown name */checkNum, a), dart.dinvokef(/* Unimplemented unknown name */checkNum, b)), core.double); }

  // Function pow: (num, num) → num
  function pow(x, exponent) {
    dart.dinvokef(/* Unimplemented unknown name */checkNum, x);
    dart.dinvokef(/* Unimplemented unknown name */checkNum, exponent);
    return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'num', 'Math.pow(#, #)', x, exponent), core.num);
  }

  // Function sin: (num) → double
  function sin(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.sin(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function cos: (num) → double
  function cos(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.cos(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function tan: (num) → double
  function tan(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.tan(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function acos: (num) → double
  function acos(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.acos(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function asin: (num) → double
  function asin(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.asin(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function atan: (num) → double
  function atan(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.atan(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function sqrt: (num) → double
  function sqrt(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.sqrt(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function exp: (num) → double
  function exp(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.exp(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  // Function log: (num) → double
  function log(x) { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'double', 'Math.log(#)', dart.dinvokef(/* Unimplemented unknown name */checkNum, x)), core.double); }

  class _Random {
    constructor(seed) {
      this._lo = 0;
      this._hi = 0;
      let empty_seed = 0;
      if (seed < 0) {
        empty_seed = -1;
      }
      do {
        let low = seed & _MASK32;
        seed = ((seed - low) / _POW2_32).truncate();
        let high = seed & _MASK32;
        seed = ((seed - high) / _POW2_32).truncate();
        let tmplow = low << 21;
        let tmphigh = (high << 21) | (low >> 11);
        tmplow = (~low & _MASK32) + tmplow;
        low = tmplow & _MASK32;
        high = (~high + tmphigh + (((tmplow - low) / 4294967296).truncate())) & _MASK32;
        tmphigh = high >> 24;
        tmplow = (low >> 24) | (high << 8);
        low = tmplow;
        high = tmphigh;
        tmplow = low * 265;
        low = tmplow & _MASK32;
        high = (high * 265 + ((tmplow - low) / 4294967296).truncate()) & _MASK32;
        tmphigh = high >> 14;
        tmplow = (low >> 14) | (high << 18);
        low = tmplow;
        high = tmphigh;
        tmplow = low * 21;
        low = tmplow & _MASK32;
        high = (high * 21 + ((tmplow - low) / 4294967296).truncate()) & _MASK32;
        tmphigh = high >> 28;
        tmplow = (low >> 28) | (high << 4);
        low = tmplow;
        high = tmphigh;
        tmplow = low << 31;
        tmphigh = (high << 31) | (low >> 1);
        tmplow = low;
        low = tmplow & _MASK32;
        high = (high + tmphigh + ((tmplow - low) / 4294967296).truncate()) & _MASK32;
        tmplow = this._lo * 1037;
        this._lo = tmplow & _MASK32;
        this._hi = (this._hi * 1037 + ((tmplow - this._lo) / 4294967296).truncate()) & _MASK32;
        this._lo = low;
        this._hi = high;
      }
      while (seed !== empty_seed);
      if (this._hi === 0 && this._lo === 0) {
        this._lo = 23063;
      }
      this._nextState();
      this._nextState();
      this._nextState();
      this._nextState();
    }
    _nextState() {
      let tmpHi = 4294901760 * this._lo;
      let tmpHiLo = tmpHi & _MASK32;
      let tmpHiHi = tmpHi - tmpHiLo;
      let tmpLo = 55905 * this._lo;
      let tmpLoLo = tmpLo & _MASK32;
      let tmpLoHi = tmpLo - tmpLoLo;
      let newLo = tmpLoLo + tmpHiLo + this._hi;
      this._lo = newLo & _MASK32;
      let newLoHi = newLo - this._lo;
      this._hi = (((tmpLoHi + tmpHiHi + newLoHi) / _POW2_32).truncate()) & _MASK32;
      dart.assert(this._lo < _POW2_32);
      dart.assert(this._hi < _POW2_32);
    }
    nextInt(max) {
      if (max <= 0 || max > _POW2_32) {
        throw new core.RangeError(`max must be in range 0 < max ≤ 2^32, was ${max}`);
      }
      if ((max & (max - 1)) === 0) {
        this._nextState();
        return this._lo & (max - 1);
      }
      let rnd32 = null;
      let result = null;
      do {
        this._nextState();
        rnd32 = this._lo;
        result = dart.notNull(rnd32.remainder(max));
      }
      while ((rnd32 - result + max) >= _POW2_32);
      return result;
    }
    nextDouble() {
      this._nextState();
      let bits26 = this._lo & ((1 << 26) - 1);
      this._nextState();
      let bits27 = this._lo & ((1 << 27) - 1);
      return (bits26 * _POW2_27_D + bits27) / _POW2_53_D;
    }
    nextBool() {
      this._nextState();
      return (this._lo & 1) === 0;
    }
  }
  _Random._POW2_53_D = 1.0 * (9007199254740992);
  _Random._POW2_27_D = 1.0 * (1 << 27);
  _Random._MASK32 = 4294967295;

  class _JSRandom {
    constructor() {
    }
    nextInt(max) {
      if (max <= 0 || max > _POW2_32) {
        throw new core.RangeError(`max must be in range 0 < max ≤ 2^32, was ${max}`);
      }
      return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, "int", "(Math.random() * #) >>> 0", max), core.int);
    }
    nextDouble() { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, "double", "Math.random()"), core.double); }
    nextBool() { return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, "bool", "Math.random() < 0.5"), core.bool); }
  }

  let _POW2_32 = 4294967296;
  class _JenkinsSmiHash {
    static combine(hash, value) {
      hash = 536870911 & (hash + value);
      hash = 536870911 & (hash + ((524287 & hash) << 10));
      return hash ^ (hash >> 6);
    }
    static finish(hash) {
      hash = 536870911 & (hash + ((67108863 & hash) << 3));
      hash = hash ^ (hash >> 11);
      return 536870911 & (hash + ((16383 & hash) << 15));
    }
    static hash2(a, b) { return finish(combine(combine(0, dart.as(a, core.int)), dart.as(b, core.int))); }
    static hash4(a, b, c, d) { return finish(combine(combine(combine(combine(0, dart.as(a, core.int)), dart.as(b, core.int)), dart.as(c, core.int)), dart.as(d, core.int))); }
  }

  let Point$ = dart.generic(function(T) {
    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      toString() { return `Point(${this.x}, ${this.y})`; }
      ['=='](other) {
        if (!dart.is(other, Point)) return false;
        return dart.equals(this.x, dart.dload(other, "x")) && dart.equals(this.y, dart.dload(other, "y"));
      }
      get hashCode() { return _JenkinsSmiHash.hash2(this.x.hashCode, this.y.hashCode); }
      ['+'](other) {
        return new Point(this.x['+'](other.x), this.y['+'](other.y));
      }
      ['-'](other) {
        return new Point(this.x['-'](other.x), this.y['-'](other.y));
      }
      ['*'](factor) {
        return new Point(this.x['*'](factor), this.y['*'](factor));
      }
      get magnitude() { return sqrt(this.x['*'](this.x) + this.y['*'](this.y)); }
      distanceTo(other) {
        let dx = this.x['-'](other.x);
        let dy = this.y['-'](other.y);
        return sqrt(dx * dx + dy * dy);
      }
      squaredDistanceTo(other) {
        let dx = this.x['-'](other.x);
        let dy = this.y['-'](other.y);
        return dart.as(dx * dx + dy * dy, T);
      }
    }
    return Point;
  });
  let Point = Point$(dynamic);

  class Random {
    constructor(seed) {
      if (seed === undefined) seed = null;
      return (seed === null) ? new _JSRandom() : new _Random(seed);
    }
  }

  let _RectangleBase$ = dart.generic(function(T) {
    class _RectangleBase {
      constructor() {
      }
      get right() { return dart.as(this.left['+'](this.width), T); }
      get bottom() { return dart.as(this.top['+'](this.height), T); }
      toString() {
        return `Rectangle (${this.left}, ${this.top}) ${this.width} x ${this.height}`;
      }
      ['=='](other) {
        if (!dart.is(other, Rectangle)) return false;
        return dart.equals(this.left, dart.dload(other, "left")) && dart.equals(this.top, dart.dload(other, "top")) && dart.equals(this.right, dart.dload(other, "right")) && dart.equals(this.bottom, dart.dload(other, "bottom"));
      }
      get hashCode() { return _JenkinsSmiHash.hash4(this.left.hashCode, this.top.hashCode, this.right.hashCode, this.bottom.hashCode); }
      intersection(other) {
        let x0 = max(this.left, other.left);
        let x1 = min(this.left['+'](this.width), other.left['+'](other.width));
        if (x0 <= x1) {
          let y0 = max(this.top, other.top);
          let y1 = min(this.top['+'](this.height), other.top['+'](other.height));
          if (y0 <= y1) {
            return new Rectangle(x0, y0, x1 - x0, y1 - y0);
          }
        }
        return null;
      }
      intersects(other) {
        return (this.left['<='](other.left + other.width) && other.left <= this.left['+'](this.width) && this.top['<='](other.top + other.height) && other.top <= this.top['+'](this.height));
      }
      boundingBox(other) {
        let right = max(this.left['+'](this.width), other.left['+'](other.width));
        let bottom = max(this.top['+'](this.height), other.top['+'](other.height));
        let left = min(this.left, other.left);
        let top = min(this.top, other.top);
        return new Rectangle(left, top, right - left, bottom - top);
      }
      containsRectangle(another) {
        return this.left['<='](another.left) && this.left['+'](this.width) >= another.left + another.width && this.top['<='](another.top) && this.top['+'](this.height) >= another.top + another.height;
      }
      containsPoint(another) {
        return core.num['>='](another.x, this.left) && another.x <= this.left['+'](this.width) && core.num['>='](another.y, this.top) && another.y <= this.top['+'](this.height);
      }
      get topLeft() { return new Point(this.left, this.top); }
      get topRight() { return new Point(this.left['+'](this.width), this.top); }
      get bottomRight() { return new Point(this.left['+'](this.width), this.top['+'](this.height)); }
      get bottomLeft() { return new Point(this.left, this.top['+'](this.height)); }
    }
    return _RectangleBase;
  });
  let _RectangleBase = _RectangleBase$(dynamic);

  let Rectangle$ = dart.generic(function(T) {
    class Rectangle extends _RectangleBase$(T) {
      constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = (width['<'](0)) ? /* Unimplemented postfix operator: -width */ * 0 : width;
        this.height = (height['<'](0)) ? /* Unimplemented postfix operator: -height */ * 0 : height;
        super();
      }
      /*constructor*/ fromPoints(a, b) {
        let left = dart.as(min(a.x, b.x), T);
        let width = dart.as(core.num['-'](max(a.x, b.x), left), T);
        let top = dart.as(min(a.y, b.y), T);
        let height = dart.as(core.num['-'](max(a.y, b.y), top), T);
        return new Rectangle(left, top, width, height);
      }
    }
    dart.defineNamedConstructor(Rectangle, "fromPoints");
    return Rectangle;
  });
  let Rectangle = Rectangle$(dynamic);

  let MutableRectangle$ = dart.generic(function(T) {
    class MutableRectangle extends _RectangleBase$(T) {
      constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this._width = (width['<'](0)) ? _clampToZero(width) : width;
        this._height = (height['<'](0)) ? _clampToZero(height) : height;
        super();
      }
      /*constructor*/ fromPoints(a, b) {
        let left = dart.as(min(a.x, b.x), T);
        let width = dart.as(core.num['-'](max(a.x, b.x), left), T);
        let top = dart.as(min(a.y, b.y), T);
        let height = dart.as(core.num['-'](max(a.y, b.y), top), T);
        return new MutableRectangle(left, top, width, height);
      }
      get width() { return this._width; }
      set width(width) {
        if (width['<'](0)) width = dart.as(_clampToZero(width), T);
        this._width = width;
      }
      get height() { return this._height; }
      set height(height) {
        if (height['<'](0)) height = dart.as(_clampToZero(height), T);
        this._height = height;
      }
    }
    dart.defineNamedConstructor(MutableRectangle, "fromPoints");
    return MutableRectangle;
  });
  let MutableRectangle = MutableRectangle$(dynamic);

  // Function _clampToZero: (num) → num
  function _clampToZero(value) {
    dart.assert(value < 0);
    return -value * 0;
  }

  // Exports:
  math.E = E;
  math.LN10 = LN10;
  math.LN2 = LN2;
  math.LOG2E = LOG2E;
  math.LOG10E = LOG10E;
  math.PI = PI;
  math.SQRT1_2 = SQRT1_2;
  math.SQRT2 = SQRT2;
  math.min = min;
  math.max = max;
  math.atan2 = atan2;
  math.pow = pow;
  math.sin = sin;
  math.cos = cos;
  math.tan = tan;
  math.acos = acos;
  math.asin = asin;
  math.atan = atan;
  math.sqrt = sqrt;
  math.exp = exp;
  math.log = log;
  math.Point = Point;
  math.Point$ = Point$;
  math.Random = Random;
  math.Rectangle = Rectangle;
  math.Rectangle$ = Rectangle$;
  math.MutableRectangle = MutableRectangle;
  math.MutableRectangle$ = MutableRectangle$;
})(math || (math = {}));
