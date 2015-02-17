part of dart.core;

abstract class String implements Comparable<String>, Pattern {
  @patch factory String.fromCharCodes(Iterable<int> charCodes,
      [int start = 0, int end]) {
    if (charCodes is! JSArray) {
      return ((__x36) => DDC$RT.cast(__x36, dynamic, String, "CastGeneral",
          """line 99, column 15 of dart:core/string.dart: """, __x36 is String,
          true))(_stringFromIterable(charCodes, start, end));
    }
    List list = DDC$RT.cast(charCodes, DDC$RT.type((Iterable<int> _) {}),
        DDC$RT.type((List<dynamic> _) {}), "CastGeneral",
        """line 102, column 18 of dart:core/string.dart: """,
        charCodes is List<dynamic>, true);
    int len = list.length;
    if (start < 0 || start > len) {
      throw new RangeError.range(start, 0, len);
    }
    if (end == null) {
      end = len;
    } else if (end < start || end > len) {
      throw new RangeError.range(end, start, len);
    }
    if (start > 0 || end < len) {
      list = list.sublist(start, end);
    }
    return ((__x37) => DDC$RT.cast(__x37, dynamic, String, "CastGeneral",
        """line 116, column 13 of dart:core/string.dart: """, __x37 is String,
        true))(Primitives.stringFromCharCodes(list));
  }
  @patch factory String.fromCharCode(int charCode) {
    return ((__x38) => DDC$RT.cast(__x38, dynamic, String, "CastGeneral",
        """line 121, column 13 of dart:core/string.dart: """, __x38 is String,
        true))(Primitives.stringFromCharCode(charCode));
  }
  @patch factory String.fromEnvironment(String name, {String defaultValue}) {
    throw new UnsupportedError(
        'String.fromEnvironment can only be used as a const constructor');
  }
  String operator [](int index);
  int codeUnitAt(int index);
  int get length;
  int get hashCode;
  bool operator ==(Object other);
  bool endsWith(String other);
  bool startsWith(Pattern pattern, [int index = 0]);
  int indexOf(Pattern pattern, [int start]);
  int lastIndexOf(Pattern pattern, [int start]);
  bool get isEmpty;
  bool get isNotEmpty;
  String operator +(String other);
  String substring(int startIndex, [int endIndex]);
  String trim();
  String trimLeft();
  String trimRight();
  String operator *(int times);
  String padLeft(int width, [String padding = ' ']);
  String padRight(int width, [String padding = ' ']);
  bool contains(Pattern other, [int startIndex = 0]);
  String replaceFirst(Pattern from, String to, [int startIndex = 0]);
  String replaceAll(Pattern from, String replace);
  String replaceAllMapped(Pattern from, String replace(Match match));
  List<String> split(Pattern pattern);
  String splitMapJoin(Pattern pattern,
      {String onMatch(Match match), String onNonMatch(String nonMatch)});
  List<int> get codeUnits;
  Runes get runes;
  String toLowerCase();
  String toUpperCase();
}
class Runes extends IterableBase<int> {
  final String string;
  Runes(this.string);
  RuneIterator get iterator => new RuneIterator(string);
  int get last {
    if (string.length == 0) {
      throw new StateError('No elements.');
    }
    int length = string.length;
    int code = string.codeUnitAt(length - 1);
    if (_isTrailSurrogate(code) && string.length > 1) {
      int previousCode = string.codeUnitAt(length - 2);
      if (_isLeadSurrogate(previousCode)) {
        return _combineSurrogatePair(previousCode, code);
      }
    }
    return code;
  }
}
bool _isLeadSurrogate(int code) => (code & 0xFC00) == 0xD800;
bool _isTrailSurrogate(int code) => (code & 0xFC00) == 0xDC00;
int _combineSurrogatePair(int start, int end) {
  return 0x10000 + ((start & 0x3FF) << 10) + (end & 0x3FF);
}
class RuneIterator implements BidirectionalIterator<int> {
  final String string;
  int _position;
  int _nextPosition;
  num _currentCodePoint;
  RuneIterator(String string)
      : this.string = string,
        _position = 0,
        _nextPosition = 0;
  RuneIterator.at(String string, int index)
      : string = string,
        _position = index,
        _nextPosition = index {
    RangeError.checkValueInInterval(index, 0, string.length);
    _checkSplitSurrogate(index);
  }
  void _checkSplitSurrogate(int index) {
    if (index > 0 &&
        index < string.length &&
        _isLeadSurrogate(string.codeUnitAt(index - 1)) &&
        _isTrailSurrogate(string.codeUnitAt(index))) {
      throw new ArgumentError('Index inside surrogate pair: $index');
    }
  }
  int get rawIndex => ((__x39) => DDC$RT.cast(__x39, dynamic, int,
      "CastGeneral", """line 645, column 24 of dart:core/string.dart: """,
      __x39 is int, true))((_position != _nextPosition) ? _position : null);
  void set rawIndex(int rawIndex) {
    RangeError.checkValidIndex(rawIndex, string, "rawIndex");
    reset(rawIndex);
    moveNext();
  }
  void reset([int rawIndex = 0]) {
    RangeError.checkValueInInterval(rawIndex, 0, string.length, "rawIndex");
    _checkSplitSurrogate(rawIndex);
    _position = _nextPosition = rawIndex;
    _currentCodePoint = null;
  }
  int get current => DDC$RT.cast(_currentCodePoint, num, int, "CastGeneral",
      """line 682, column 23 of dart:core/string.dart: """,
      _currentCodePoint is int, true);
  int get currentSize => _nextPosition - _position;
  String get currentAsString {
    if (_position == _nextPosition) return null;
    if (_position + 1 == _nextPosition) return string[_position];
    return string.substring(_position, _nextPosition);
  }
  bool moveNext() {
    _position = _nextPosition;
    if (_position == string.length) {
      _currentCodePoint = null;
      return false;
    }
    int codeUnit = string.codeUnitAt(_position);
    int nextPosition = _position + 1;
    if (_isLeadSurrogate(codeUnit) && nextPosition < string.length) {
      int nextCodeUnit = string.codeUnitAt(nextPosition);
      if (_isTrailSurrogate(nextCodeUnit)) {
        _nextPosition = nextPosition + 1;
        _currentCodePoint = _combineSurrogatePair(codeUnit, nextCodeUnit);
        return true;
      }
    }
    _nextPosition = nextPosition;
    _currentCodePoint = codeUnit;
    return true;
  }
  bool movePrevious() {
    _nextPosition = _position;
    if (_position == 0) {
      _currentCodePoint = null;
      return false;
    }
    int position = _position - 1;
    int codeUnit = string.codeUnitAt(position);
    if (_isTrailSurrogate(codeUnit) && position > 0) {
      int prevCodeUnit = string.codeUnitAt(position - 1);
      if (_isLeadSurrogate(prevCodeUnit)) {
        _position = position - 1;
        _currentCodePoint = _combineSurrogatePair(prevCodeUnit, codeUnit);
        return true;
      }
    }
    _position = position;
    _currentCodePoint = codeUnit;
    return true;
  }
}
