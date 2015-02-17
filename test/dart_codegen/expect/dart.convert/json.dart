part of dart.convert;

class JsonUnsupportedObjectError extends Error {
  final unsupportedObject;
  final cause;
  JsonUnsupportedObjectError(this.unsupportedObject, {this.cause});
  String toString() {
    if (cause != null) {
      return "Converting object to an encodable object failed.";
    } else {
      return "Converting object did not return an encodable object.";
    }
  }
}
class JsonCyclicError extends JsonUnsupportedObjectError {
  JsonCyclicError(Object object) : super(object);
  String toString() => "Cyclic error in JSON stringify";
}
const JsonCodec JSON = const JsonCodec();
typedef _Reviver(var key, var value);
typedef _ToEncodable(var o);
class JsonCodec extends Codec<Object, String> {
  final _Reviver _reviver;
  final _ToEncodable _toEncodable;
  const JsonCodec({reviver(var key, var value), toEncodable(var object)})
      : _reviver = reviver,
        _toEncodable = toEncodable;
  JsonCodec.withReviver(reviver(var key, var value)) : this(reviver: reviver);
  dynamic decode(String source, {reviver(var key, var value)}) {
    if (reviver == null) reviver = _reviver;
    if (reviver == null) return decoder.convert(source);
    return new JsonDecoder(reviver).convert(source);
  }
  String encode(Object value, {toEncodable(var object)}) {
    if (toEncodable == null) toEncodable = _toEncodable;
    if (toEncodable == null) return encoder.convert(value);
    return new JsonEncoder(toEncodable).convert(value);
  }
  JsonEncoder get encoder {
    if (_toEncodable == null) return const JsonEncoder();
    return new JsonEncoder(_toEncodable);
  }
  JsonDecoder get decoder {
    if (_reviver == null) return const JsonDecoder();
    return new JsonDecoder(_reviver);
  }
}
class JsonEncoder extends Converter<Object, String> {
  final String indent;
  final Function _toEncodable;
  const JsonEncoder([Object toEncodable(Object nonSerializable)])
      : this.indent = null,
        this._toEncodable = toEncodable;
  const JsonEncoder.withIndent(this.indent,
      [Object toEncodable(Object nonSerializable)])
      : this._toEncodable = toEncodable;
  String convert(Object object) => _JsonStringStringifier.stringify(object,
      DDC$RT.cast(_toEncodable, Function, __t7, "CastGeneral",
          """line 243, column 48 of dart:convert/json.dart: """,
          _toEncodable is __t7, false), indent);
  ChunkedConversionSink<Object> startChunkedConversion(Sink<String> sink) {
    if (sink is! StringConversionSink) {
      sink = new StringConversionSink.from(sink);
    } else if (sink is _Utf8EncoderSink) {
      return new _JsonUtf8EncoderSink(sink._sink, _toEncodable,
          JsonUtf8Encoder._utf8Encode(indent),
          JsonUtf8Encoder.DEFAULT_BUFFER_SIZE);
    }
    return new _JsonEncoderSink(sink, _toEncodable, indent);
  }
  Stream<String> bind(Stream<Object> stream) => ((__x9) => DDC$RT.cast(__x9,
      DDC$RT.type((DDC$dartDOTasync$.Stream<dynamic> _) {}),
      DDC$RT.type((DDC$dartDOTasync$.Stream<String> _) {}), "CastDynamic",
      """line 266, column 49 of dart:convert/json.dart: """,
      __x9 is DDC$dartDOTasync$.Stream<String>, false))(super.bind(stream));
  Converter<Object, dynamic> fuse(Converter<String, dynamic> other) {
    if (other is Utf8Encoder) {
      return new JsonUtf8Encoder(indent, _toEncodable);
    }
    return super.fuse(other);
  }
}
class JsonUtf8Encoder extends Converter<Object, List<int>> {
  static const int DEFAULT_BUFFER_SIZE = 256;
  final List<int> _indent;
  final Function _toEncodable;
  final int _bufferSize;
  JsonUtf8Encoder([String indent, toEncodable(Object object),
      int bufferSize = DEFAULT_BUFFER_SIZE])
      : _indent = _utf8Encode(indent),
        _toEncodable = toEncodable,
        _bufferSize = bufferSize;
  static List<int> _utf8Encode(String string) {
    if (string == null) return null;
    if (string.isEmpty) return new Uint8List(0);
    checkAscii: {
      for (int i = 0; i < string.length; i++) {
        if (string.codeUnitAt(i) >= 0x80) break checkAscii;
      }
      return string.codeUnits;
    }
    return UTF8.encode(string);
  }
  List<int> convert(Object object) {
    List<List<int>> bytes = ((__x10) => DDC$RT.cast(__x10,
        DDC$RT.type((List<dynamic> _) {}), DDC$RT.type((List<List<int>> _) {}),
        "CastLiteral", """line 338, column 29 of dart:convert/json.dart: """,
        __x10 is List<List<int>>, false))([]);
    void addChunk(Uint8List chunk, int start, int end) {
      if (start > 0 || end < chunk.length) {
        int length = end - start;
        chunk = new Uint8List.view(
            chunk.buffer, chunk.offsetInBytes + start, length);
      }
      bytes.add(chunk);
    }
    _JsonUtf8Stringifier.stringify(object, _indent, DDC$RT.cast(_toEncodable,
        Function, __t11, "CastGeneral",
        """line 352, column 36 of dart:convert/json.dart: """,
        _toEncodable is __t11, false), _bufferSize, addChunk);
    if (bytes.length == 1) return bytes[0];
    int length = 0;
    for (int i = 0; i < bytes.length; i++) {
      length += bytes[i].length;
    }
    Uint8List result = new Uint8List(length);
    for (int i = 0, offset = 0; i < bytes.length; i++) {
      var byteList = bytes[i];
      int end = offset + byteList.length;
      result.setRange(offset, end, byteList);
      offset = end;
    }
    return result;
  }
  ChunkedConversionSink<Object> startChunkedConversion(Sink<List<int>> sink) {
    ByteConversionSink byteSink;
    if (sink is ByteConversionSink) {
      byteSink = DDC$RT.cast(sink, DDC$RT.type((Sink<List<int>> _) {}),
          ByteConversionSink, "CastGeneral",
          """line 381, column 18 of dart:convert/json.dart: """,
          sink is ByteConversionSink, true);
    } else {
      byteSink = new ByteConversionSink.from(sink);
    }
    return new _JsonUtf8EncoderSink(
        byteSink, _toEncodable, _indent, _bufferSize);
  }
  Stream<List<int>> bind(Stream<Object> stream) {
    return ((__x13) => DDC$RT.cast(__x13,
        DDC$RT.type((DDC$dartDOTasync$.Stream<dynamic> _) {}),
        DDC$RT.type((DDC$dartDOTasync$.Stream<List<int>> _) {}), "CastDynamic",
        """line 391, column 12 of dart:convert/json.dart: """,
        __x13 is DDC$dartDOTasync$.Stream<List<int>>,
        false))(super.bind(stream));
  }
  Converter<Object, dynamic> fuse(Converter<List<int>, dynamic> other) {
    return super.fuse(other);
  }
}
class _JsonEncoderSink extends ChunkedConversionSink<Object> {
  final String _indent;
  final Function _toEncodable;
  final StringConversionSink _sink;
  bool _isDone = false;
  _JsonEncoderSink(this._sink, this._toEncodable, this._indent);
  void add(Object o) {
    if (_isDone) {
      throw new StateError("Only one call to add allowed");
    }
    _isDone = true;
    ClosableStringSink stringSink = _sink.asStringSink();
    _JsonStringStringifier.printOn(o, stringSink, DDC$RT.cast(_toEncodable,
        Function, __t7, "CastGeneral",
        """line 425, column 51 of dart:convert/json.dart: """,
        _toEncodable is __t7, false), _indent);
    stringSink.close();
  }
  void close() {}
}
class _JsonUtf8EncoderSink extends ChunkedConversionSink<Object> {
  final ByteConversionSink _sink;
  final List<int> _indent;
  final Function _toEncodable;
  final int _bufferSize;
  bool _isDone = false;
  _JsonUtf8EncoderSink(
      this._sink, this._toEncodable, this._indent, this._bufferSize);
  void _addChunk(Uint8List chunk, int start, int end) {
    _sink.addSlice(chunk, start, end, false);
  }
  void add(Object object) {
    if (_isDone) {
      throw new StateError("Only one call to add allowed");
    }
    _isDone = true;
    _JsonUtf8Stringifier.stringify(object, _indent, DDC$RT.cast(_toEncodable,
        Function, __t11, "CastGeneral",
        """line 455, column 53 of dart:convert/json.dart: """,
        _toEncodable is __t11, false), _bufferSize, _addChunk);
    _sink.close();
  }
  void close() {
    if (!_isDone) {
      _isDone = true;
      _sink.close();
    }
  }
}
class JsonDecoder extends Converter<String, Object> {
  final _Reviver _reviver;
  const JsonDecoder([reviver(var key, var value)]) : this._reviver = reviver;
  dynamic convert(String input) => _parseJson(input, _reviver);
  @patch StringConversionSink startChunkedConversion(Sink<Object> sink) {
    return new _JsonDecoderSink(_reviver, sink);
  }
  Stream<Object> bind(Stream<String> stream) => ((__x14) => DDC$RT.cast(__x14,
      DDC$RT.type((DDC$dartDOTasync$.Stream<dynamic> _) {}),
      DDC$RT.type((DDC$dartDOTasync$.Stream<Object> _) {}), "CastDynamic",
      """line 504, column 49 of dart:convert/json.dart: """,
      __x14 is DDC$dartDOTasync$.Stream<Object>, false))(super.bind(stream));
}
@patch _parseJson(String source, reviver(key, value)) {
  if (source is! String) throw new ArgumentError(source);
  var parsed;
  try {
    parsed = JS('=Object|JSExtendableArray|Null|bool|num|String',
        'JSON.parse(#)', source);
  } catch (e) {
    throw new FormatException(JS('String', 'String(#)', e));
  }
  if (reviver == null) {
    return _convertJsonToDartLazy(parsed);
  } else {
    return _convertJsonToDart(parsed, reviver);
  }
}
Object _defaultToEncodable(object) => object.toJson();
abstract class _JsonStringifier {
  static const int BACKSPACE = 0x08;
  static const int TAB = 0x09;
  static const int NEWLINE = 0x0a;
  static const int CARRIAGE_RETURN = 0x0d;
  static const int FORM_FEED = 0x0c;
  static const int QUOTE = 0x22;
  static const int CHAR_0 = 0x30;
  static const int BACKSLASH = 0x5c;
  static const int CHAR_b = 0x62;
  static const int CHAR_f = 0x66;
  static const int CHAR_n = 0x6e;
  static const int CHAR_r = 0x72;
  static const int CHAR_t = 0x74;
  static const int CHAR_u = 0x75;
  final List _seen = new List();
  final Function _toEncodable;
  _JsonStringifier(Object _toEncodable(Object o))
      : _toEncodable = (_toEncodable != null)
          ? _toEncodable
          : _defaultToEncodable;
  void writeString(String characters);
  void writeStringSlice(String characters, int start, int end);
  void writeCharCode(int charCode);
  void writeNumber(num number);
  static int hexDigit(int x) => x < 10 ? 48 + x : 87 + x;
  void writeStringContent(String s) {
    int offset = 0;
    final int length = s.length;
    for (int i = 0; i < length; i++) {
      int charCode = s.codeUnitAt(i);
      if (charCode > BACKSLASH) continue;
      if (charCode < 32) {
        if (i > offset) writeStringSlice(s, offset, i);
        offset = i + 1;
        writeCharCode(BACKSLASH);
        switch (charCode) {
          case BACKSPACE:
            writeCharCode(CHAR_b);
            break;
          case TAB:
            writeCharCode(CHAR_t);
            break;
          case NEWLINE:
            writeCharCode(CHAR_n);
            break;
          case FORM_FEED:
            writeCharCode(CHAR_f);
            break;
          case CARRIAGE_RETURN:
            writeCharCode(CHAR_r);
            break;
          default:
            writeCharCode(CHAR_u);
            writeCharCode(CHAR_0);
            writeCharCode(CHAR_0);
            writeCharCode(hexDigit((charCode >> 4) & 0xf));
            writeCharCode(hexDigit(charCode & 0xf));
            break;
        }
      } else if (charCode == QUOTE || charCode == BACKSLASH) {
        if (i > offset) writeStringSlice(s, offset, i);
        offset = i + 1;
        writeCharCode(BACKSLASH);
        writeCharCode(charCode);
      }
    }
    if (offset == 0) {
      writeString(s);
    } else if (offset < length) {
      writeStringSlice(s, offset, length);
    }
  }
  void _checkCycle(object) {
    for (int i = 0; i < _seen.length; i++) {
      if (identical(object, _seen[i])) {
        throw new JsonCyclicError(object);
      }
    }
    _seen.add(object);
  }
  void _removeSeen(object) {
    assert(!_seen.isEmpty);
    assert(identical(_seen.last, object));
    _seen.removeLast();
  }
  void writeObject(object) {
    if (writeJsonValue(object)) return;
    _checkCycle(object);
    try {
      var customJson = _toEncodable(object);
      if (!writeJsonValue(customJson)) {
        throw new JsonUnsupportedObjectError(object);
      }
      _removeSeen(object);
    } catch (e) {
      throw new JsonUnsupportedObjectError(object, cause: e);
    }
  }
  bool writeJsonValue(object) {
    if (object is num) {
      if (!object.isFinite) return false;
      writeNumber(DDC$RT.cast(object, dynamic, num, "CastGeneral",
          """line 704, column 19 of dart:convert/json.dart: """, object is num,
          true));
      return true;
    } else if (identical(object, true)) {
      writeString('true');
      return true;
    } else if (identical(object, false)) {
      writeString('false');
      return true;
    } else if (object == null) {
      writeString('null');
      return true;
    } else if (object is String) {
      writeString('"');
      writeStringContent(DDC$RT.cast(object, dynamic, String, "CastGeneral",
          """line 717, column 26 of dart:convert/json.dart: """,
          object is String, true));
      writeString('"');
      return true;
    } else if (object is List) {
      _checkCycle(object);
      writeList(DDC$RT.cast(object, dynamic, DDC$RT.type((List<dynamic> _) {}),
          "CastGeneral", """line 722, column 17 of dart:convert/json.dart: """,
          object is List<dynamic>, true));
      _removeSeen(object);
      return true;
    } else if (object is Map) {
      _checkCycle(object);
      writeMap(DDC$RT.cast(object, dynamic,
          DDC$RT.type((Map<String, Object> _) {}), "CastGeneral",
          """line 727, column 16 of dart:convert/json.dart: """,
          object is Map<String, Object>, false));
      _removeSeen(object);
      return true;
    } else {
      return false;
    }
  }
  void writeList(List list) {
    writeString('[');
    if (list.length > 0) {
      writeObject(list[0]);
      for (int i = 1; i < list.length; i++) {
        writeString(',');
        writeObject(list[i]);
      }
    }
    writeString(']');
  }
  void writeMap(Map<String, Object> map) {
    writeString('{');
    String separator = '"';
    map.forEach((String key, value) {
      writeString(separator);
      separator = ',"';
      writeStringContent(key);
      writeString('":');
      writeObject(value);
    });
    writeString('}');
  }
}
abstract class _JsonPrettyPrintMixin implements _JsonStringifier {
  int _indentLevel = 0;
  void writeIndentation(indentLevel);
  void writeList(List list) {
    if (list.isEmpty) {
      writeString('[]');
    } else {
      writeString('[\n');
      _indentLevel++;
      writeIndentation(_indentLevel);
      writeObject(list[0]);
      for (int i = 1; i < list.length; i++) {
        writeString(',\n');
        writeIndentation(_indentLevel);
        writeObject(list[i]);
      }
      writeString('\n');
      _indentLevel--;
      writeIndentation(_indentLevel);
      writeString(']');
    }
  }
  void writeMap(Map map) {
    if (map.isEmpty) {
      writeString('{}');
    } else {
      writeString('{\n');
      _indentLevel++;
      bool first = true;
      map.forEach(((__x23) => DDC$RT.wrap(
          (dynamic f(String __u15, Object __u16)) {
        dynamic c(String x0, Object x1) => f(DDC$RT.cast(x0, dynamic, String,
            "CastParam", """line 804, column 19 of dart:convert/json.dart: """,
            x0 is String, true), x1);
        return f == null ? null : c;
      }, __x23, __t20, __t17, "WrapLiteral",
          """line 804, column 19 of dart:convert/json.dart: """,
          __x23 is __t17))((String key, Object value) {
        if (!first) {
          writeString(",\n");
        }
        writeIndentation(_indentLevel);
        writeString('"');
        writeStringContent(key);
        writeString('": ');
        writeObject(value);
        first = false;
      }));
      writeString('\n');
      _indentLevel--;
      writeIndentation(_indentLevel);
      writeString('}');
    }
  }
}
class _JsonStringStringifier extends _JsonStringifier {
  final StringSink _sink;
  _JsonStringStringifier(this._sink, _toEncodable) : super(DDC$RT.cast(
          _toEncodable, dynamic, __t24, "CastGeneral",
          """line 829, column 60 of dart:convert/json.dart: """,
          _toEncodable is __t24, false));
  static String stringify(object, toEncodable(object), String indent) {
    StringBuffer output = new StringBuffer();
    printOn(object, output, toEncodable, indent);
    return output.toString();
  }
  static void printOn(
      object, StringSink output, toEncodable(object), String indent) {
    var stringifier;
    if (indent == null) {
      stringifier = new _JsonStringStringifier(output, toEncodable);
    } else {
      stringifier =
          new _JsonStringStringifierPretty(output, toEncodable, indent);
    }
    stringifier.writeObject(object);
  }
  void writeNumber(num number) {
    _sink.write(number.toString());
  }
  void writeString(String string) {
    _sink.write(string);
  }
  void writeStringSlice(String string, int start, int end) {
    _sink.write(string.substring(start, end));
  }
  void writeCharCode(int charCode) {
    _sink.writeCharCode(charCode);
  }
}
class _JsonStringStringifierPretty extends _JsonStringStringifier
    with _JsonPrettyPrintMixin {
  final String _indent;
  _JsonStringStringifierPretty(
      StringSink sink, Function toEncodable, this._indent)
      : super(sink, toEncodable);
  void writeIndentation(int count) {
    for (int i = 0; i < count; i++) writeString(_indent);
  }
}
class _JsonUtf8Stringifier extends _JsonStringifier {
  final int bufferSize;
  final Function addChunk;
  Uint8List buffer;
  int index = 0;
  _JsonUtf8Stringifier(toEncodable, int bufferSize, this.addChunk)
      : super(DDC$RT.cast(toEncodable, dynamic, __t24, "CastGeneral",
          """line 905, column 15 of dart:convert/json.dart: """,
          toEncodable is __t24, false)),
        this.bufferSize = bufferSize,
        buffer = new Uint8List(bufferSize);
  static void stringify(Object object, List<int> indent,
      toEncodableFunction(Object o), int bufferSize,
      void addChunk(Uint8List chunk, int start, int end)) {
    _JsonUtf8Stringifier stringifier;
    if (indent != null) {
      stringifier = new _JsonUtf8StringifierPretty(
          toEncodableFunction, indent, bufferSize, addChunk);
    } else {
      stringifier =
          new _JsonUtf8Stringifier(toEncodableFunction, bufferSize, addChunk);
    }
    stringifier.writeObject(object);
    stringifier.flush();
  }
  void flush() {
    if (index > 0) {
      addChunk(buffer, 0, index);
    }
    buffer = null;
    index = 0;
  }
  void writeNumber(num number) {
    writeAsciiString(number.toString());
  }
  void writeAsciiString(String string) {
    for (int i = 0; i < string.length; i++) {
      int char = string.codeUnitAt(i);
      assert(char <= 0x7f);
      writeByte(char);
    }
  }
  void writeString(String string) {
    writeStringSlice(string, 0, string.length);
  }
  void writeStringSlice(String string, int start, int end) {
    for (int i = start; i < end; i++) {
      int char = string.codeUnitAt(i);
      if (char <= 0x7f) {
        writeByte(char);
      } else {
        if ((char & 0xFC00) == 0xD800 && i + 1 < end) {
          int nextChar = string.codeUnitAt(i + 1);
          if ((nextChar & 0xFC00) == 0xDC00) {
            char = 0x10000 + ((char & 0x3ff) << 10) + (nextChar & 0x3ff);
            writeFourByteCharCode(char);
            i++;
            continue;
          }
        }
        writeMultiByteCharCode(char);
      }
    }
  }
  void writeCharCode(int charCode) {
    if (charCode <= 0x7f) {
      writeByte(charCode);
      return;
    }
    writeMultiByteCharCode(charCode);
  }
  void writeMultiByteCharCode(int charCode) {
    if (charCode <= 0x7ff) {
      writeByte(0xC0 | (charCode >> 6));
      writeByte(0x80 | (charCode & 0x3f));
      return;
    }
    if (charCode <= 0xffff) {
      writeByte(0xE0 | (charCode >> 12));
      writeByte(0x80 | ((charCode >> 6) & 0x3f));
      writeByte(0x80 | (charCode & 0x3f));
      return;
    }
    writeFourByteCharCode(charCode);
  }
  void writeFourByteCharCode(int charCode) {
    assert(charCode <= 0x10ffff);
    writeByte(0xF0 | (charCode >> 18));
    writeByte(0x80 | ((charCode >> 12) & 0x3f));
    writeByte(0x80 | ((charCode >> 6) & 0x3f));
    writeByte(0x80 | (charCode & 0x3f));
  }
  void writeByte(int byte) {
    assert(byte <= 0xff);
    if (index == buffer.length) {
      addChunk(buffer, 0, index);
      buffer = new Uint8List(bufferSize);
      index = 0;
    }
    buffer[index++] = byte;
  }
}
class _JsonUtf8StringifierPretty extends _JsonUtf8Stringifier
    with _JsonPrettyPrintMixin {
  final List<int> indent;
  _JsonUtf8StringifierPretty(
      toEncodableFunction, this.indent, bufferSize, addChunk)
      : super(toEncodableFunction, DDC$RT.cast(bufferSize, dynamic, int,
          "CastGeneral", """line 1043, column 36 of dart:convert/json.dart: """,
          bufferSize is int, true), DDC$RT.cast(addChunk, dynamic, Function,
          "CastGeneral", """line 1043, column 48 of dart:convert/json.dart: """,
          addChunk is Function, true));
  void writeIndentation(int count) {
    List<int> indent = this.indent;
    int indentLength = indent.length;
    if (indentLength == 1) {
      int char = indent[0];
      while (count > 0) {
        writeByte(char);
        count -= 1;
      }
      return;
    }
    while (count > 0) {
      count--;
      int end = index + indentLength;
      if (end <= buffer.length) {
        buffer.setRange(index, end, indent);
        index = end;
      } else {
        for (int i = 0; i < indentLength; i++) {
          writeByte(indent[i]);
        }
      }
    }
  }
}
typedef dynamic __t7(dynamic __u8);
typedef dynamic __t11(Object __u12);
typedef void __t17(dynamic __u18, dynamic __u19);
typedef dynamic __t20(String __u21, Object __u22);
typedef Object __t24(Object __u25);
