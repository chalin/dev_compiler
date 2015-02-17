part of dart.async;

typedef dynamic ZoneCallback();
typedef dynamic ZoneUnaryCallback(arg);
typedef dynamic ZoneBinaryCallback(arg1, arg2);
typedef dynamic HandleUncaughtErrorHandler(
    Zone self, ZoneDelegate parent, Zone zone, error, StackTrace stackTrace);
typedef dynamic RunHandler(Zone self, ZoneDelegate parent, Zone zone, f());
typedef dynamic RunUnaryHandler(
    Zone self, ZoneDelegate parent, Zone zone, f(arg), arg);
typedef dynamic RunBinaryHandler(
    Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2), arg1, arg2);
typedef ZoneCallback RegisterCallbackHandler(
    Zone self, ZoneDelegate parent, Zone zone, f());
typedef ZoneUnaryCallback RegisterUnaryCallbackHandler(
    Zone self, ZoneDelegate parent, Zone zone, f(arg));
typedef ZoneBinaryCallback RegisterBinaryCallbackHandler(
    Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2));
typedef AsyncError ErrorCallbackHandler(Zone self, ZoneDelegate parent,
    Zone zone, Object error, StackTrace stackTrace);
typedef void ScheduleMicrotaskHandler(
    Zone self, ZoneDelegate parent, Zone zone, f());
typedef Timer CreateTimerHandler(
    Zone self, ZoneDelegate parent, Zone zone, Duration duration, void f());
typedef Timer CreatePeriodicTimerHandler(Zone self, ZoneDelegate parent,
    Zone zone, Duration period, void f(Timer timer));
typedef void PrintHandler(
    Zone self, ZoneDelegate parent, Zone zone, String line);
typedef Zone ForkHandler(Zone self, ZoneDelegate parent, Zone zone,
    ZoneSpecification specification, Map zoneValues);
class AsyncError implements Error {
  final error;
  final StackTrace stackTrace;
  AsyncError(this.error, this.stackTrace);
  String toString() => ((__x139) => DDC$RT.cast(__x139, dynamic, String,
      "CastGeneral", """line 46, column 24 of dart:async/zone.dart: """,
      __x139 is String, true))(error.toString());
}
class _ZoneFunction {
  final _Zone zone;
  final Function function;
  const _ZoneFunction(this.zone, this.function);
}
abstract class ZoneSpecification {
  const factory ZoneSpecification({dynamic handleUncaughtError(Zone self,
          ZoneDelegate parent, Zone zone, error, StackTrace stackTrace),
      dynamic run(Zone self, ZoneDelegate parent, Zone zone, f()),
      dynamic runUnary(Zone self, ZoneDelegate parent, Zone zone, f(arg), arg),
      dynamic runBinary(
          Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2), arg1, arg2),
      ZoneCallback registerCallback(
          Zone self, ZoneDelegate parent, Zone zone, f()),
      ZoneUnaryCallback registerUnaryCallback(
          Zone self, ZoneDelegate parent, Zone zone, f(arg)),
      ZoneBinaryCallback registerBinaryCallback(
          Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2)),
      AsyncError errorCallback(Zone self, ZoneDelegate parent, Zone zone,
          Object error, StackTrace stackTrace),
      void scheduleMicrotask(Zone self, ZoneDelegate parent, Zone zone, f()),
      Timer createTimer(Zone self, ZoneDelegate parent, Zone zone,
          Duration duration, void f()), Timer createPeriodicTimer(Zone self,
          ZoneDelegate parent, Zone zone, Duration period, void f(Timer timer)),
      void print(Zone self, ZoneDelegate parent, Zone zone, String line),
      Zone fork(Zone self, ZoneDelegate parent, Zone zone,
          ZoneSpecification specification,
          Map zoneValues)}) = _ZoneSpecification;
  factory ZoneSpecification.from(ZoneSpecification other,
      {dynamic handleUncaughtError(Zone self, ZoneDelegate parent, Zone zone,
          error, StackTrace stackTrace): null,
      dynamic run(Zone self, ZoneDelegate parent, Zone zone, f()): null,
      dynamic runUnary(
          Zone self, ZoneDelegate parent, Zone zone, f(arg), arg): null,
      dynamic runBinary(Zone self, ZoneDelegate parent, Zone zone,
          f(arg1, arg2), arg1, arg2): null, ZoneCallback registerCallback(
          Zone self, ZoneDelegate parent, Zone zone, f()): null,
      ZoneUnaryCallback registerUnaryCallback(
          Zone self, ZoneDelegate parent, Zone zone, f(arg)): null,
      ZoneBinaryCallback registerBinaryCallback(
          Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2)): null,
      AsyncError errorCallback(Zone self, ZoneDelegate parent, Zone zone,
          Object error, StackTrace stackTrace), void scheduleMicrotask(
          Zone self, ZoneDelegate parent, Zone zone, f()): null,
      Timer createTimer(Zone self, ZoneDelegate parent, Zone zone,
          Duration duration, void f()): null, Timer createPeriodicTimer(
          Zone self, ZoneDelegate parent, Zone zone, Duration period,
          void f(Timer timer)): null,
      void print(Zone self, ZoneDelegate parent, Zone zone, String line): null,
      Zone fork(Zone self, ZoneDelegate parent, Zone zone,
          ZoneSpecification specification, Map zoneValues): null}) {
    return new ZoneSpecification(
        handleUncaughtError: handleUncaughtError != null
            ? handleUncaughtError
            : other.handleUncaughtError,
        run: run != null ? run : other.run,
        runUnary: runUnary != null ? runUnary : other.runUnary,
        runBinary: runBinary != null ? runBinary : other.runBinary,
        registerCallback: registerCallback != null
            ? registerCallback
            : other.registerCallback,
        registerUnaryCallback: registerUnaryCallback != null
            ? registerUnaryCallback
            : other.registerUnaryCallback,
        registerBinaryCallback: registerBinaryCallback != null
            ? registerBinaryCallback
            : other.registerBinaryCallback,
        errorCallback: errorCallback != null
            ? errorCallback
            : other.errorCallback,
        scheduleMicrotask: scheduleMicrotask != null
            ? scheduleMicrotask
            : other.scheduleMicrotask,
        createTimer: createTimer != null ? createTimer : other.createTimer,
        createPeriodicTimer: createPeriodicTimer != null
            ? createPeriodicTimer
            : other.createPeriodicTimer,
        print: print != null ? print : other.print,
        fork: fork != null ? fork : other.fork);
  }
  HandleUncaughtErrorHandler get handleUncaughtError;
  RunHandler get run;
  RunUnaryHandler get runUnary;
  RunBinaryHandler get runBinary;
  RegisterCallbackHandler get registerCallback;
  RegisterUnaryCallbackHandler get registerUnaryCallback;
  RegisterBinaryCallbackHandler get registerBinaryCallback;
  ErrorCallbackHandler get errorCallback;
  ScheduleMicrotaskHandler get scheduleMicrotask;
  CreateTimerHandler get createTimer;
  CreatePeriodicTimerHandler get createPeriodicTimer;
  PrintHandler get print;
  ForkHandler get fork;
}
class _ZoneSpecification implements ZoneSpecification {
  const _ZoneSpecification({this.handleUncaughtError: null, this.run: null,
      this.runUnary: null, this.runBinary: null, this.registerCallback: null,
      this.registerUnaryCallback: null, this.registerBinaryCallback: null,
      this.errorCallback: null, this.scheduleMicrotask: null,
      this.createTimer: null, this.createPeriodicTimer: null, this.print: null,
      this.fork: null});
  final handleUncaughtError;
  final run;
  final runUnary;
  final runBinary;
  final registerCallback;
  final registerUnaryCallback;
  final registerBinaryCallback;
  final errorCallback;
  final scheduleMicrotask;
  final createTimer;
  final createPeriodicTimer;
  final print;
  final fork;
}
abstract class ZoneDelegate {
  dynamic handleUncaughtError(Zone zone, error, StackTrace stackTrace);
  dynamic run(Zone zone, f());
  dynamic runUnary(Zone zone, f(arg), arg);
  dynamic runBinary(Zone zone, f(arg1, arg2), arg1, arg2);
  ZoneCallback registerCallback(Zone zone, f());
  ZoneUnaryCallback registerUnaryCallback(Zone zone, f(arg));
  ZoneBinaryCallback registerBinaryCallback(Zone zone, f(arg1, arg2));
  AsyncError errorCallback(Zone zone, Object error, StackTrace stackTrace);
  void scheduleMicrotask(Zone zone, f());
  Timer createTimer(Zone zone, Duration duration, void f());
  Timer createPeriodicTimer(Zone zone, Duration period, void f(Timer timer));
  void print(Zone zone, String line);
  Zone fork(Zone zone, ZoneSpecification specification, Map zoneValues);
}
abstract class Zone {
  Zone._();
  static const Zone ROOT = _ROOT_ZONE;
  static Zone _current = DDC$RT.cast(_ROOT_ZONE, dynamic, Zone, "CastGeneral",
      """line 262, column 26 of dart:async/zone.dart: """, _ROOT_ZONE is Zone,
      true);
  static Zone get current => _current;
  dynamic handleUncaughtError(error, StackTrace stackTrace);
  Zone get parent;
  Zone get errorZone;
  bool inSameErrorZone(Zone otherZone);
  Zone fork({ZoneSpecification specification, Map zoneValues});
  dynamic run(f());
  dynamic runUnary(f(arg), var arg);
  dynamic runBinary(f(arg1, arg2), var arg1, var arg2);
  dynamic runGuarded(f());
  dynamic runUnaryGuarded(f(arg), var arg);
  dynamic runBinaryGuarded(f(arg1, arg2), var arg1, var arg2);
  ZoneCallback registerCallback(callback());
  ZoneUnaryCallback registerUnaryCallback(callback(arg));
  ZoneBinaryCallback registerBinaryCallback(callback(arg1, arg2));
  ZoneCallback bindCallback(f(), {bool runGuarded: true});
  ZoneUnaryCallback bindUnaryCallback(f(arg), {bool runGuarded: true});
  ZoneBinaryCallback bindBinaryCallback(f(arg1, arg2), {bool runGuarded: true});
  AsyncError errorCallback(Object error, StackTrace stackTrace);
  void scheduleMicrotask(void f());
  Timer createTimer(Duration duration, void callback());
  Timer createPeriodicTimer(Duration period, void callback(Timer timer));
  void print(String line);
  static Zone _enter(Zone zone) {
    assert(zone != null);
    assert(!identical(zone, _current));
    Zone previous = _current;
    _current = zone;
    return previous;
  }
  static void _leave(Zone previous) {
    assert(previous != null);
    Zone._current = previous;
  }
  operator [](Object key);
}
ZoneDelegate _parentDelegate(_Zone zone) {
  if (zone.parent == null) return null;
  return zone.parent._delegate;
}
class _ZoneDelegate implements ZoneDelegate {
  final _Zone _delegationTarget;
  _ZoneDelegate(this._delegationTarget);
  dynamic handleUncaughtError(Zone zone, error, StackTrace stackTrace) {
    _ZoneFunction implementation = _delegationTarget._handleUncaughtError;
    _Zone implZone = implementation.zone;
    return (implementation.function)(
        implZone, _parentDelegate(implZone), zone, error, stackTrace);
  }
  dynamic run(Zone zone, f()) {
    _ZoneFunction implementation = _delegationTarget._run;
    _Zone implZone = implementation.zone;
    return (implementation.function)(
        implZone, _parentDelegate(implZone), zone, f);
  }
  dynamic runUnary(Zone zone, f(arg), arg) {
    _ZoneFunction implementation = _delegationTarget._runUnary;
    _Zone implZone = implementation.zone;
    return (implementation.function)(
        implZone, _parentDelegate(implZone), zone, f, arg);
  }
  dynamic runBinary(Zone zone, f(arg1, arg2), arg1, arg2) {
    _ZoneFunction implementation = _delegationTarget._runBinary;
    _Zone implZone = implementation.zone;
    return (implementation.function)(
        implZone, _parentDelegate(implZone), zone, f, arg1, arg2);
  }
  ZoneCallback registerCallback(Zone zone, f()) {
    _ZoneFunction implementation = _delegationTarget._registerCallback;
    _Zone implZone = implementation.zone;
    return ((__x141) => DDC$RT.cast(__x141, dynamic, __t140, "CastGeneral",
            """line 522, column 12 of dart:async/zone.dart: """,
            __x141 is __t140, false))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, f));
  }
  ZoneUnaryCallback registerUnaryCallback(Zone zone, f(arg)) {
    _ZoneFunction implementation = _delegationTarget._registerUnaryCallback;
    _Zone implZone = implementation.zone;
    return ((__x144) => DDC$RT.cast(__x144, dynamic, __t142, "CastGeneral",
            """line 529, column 12 of dart:async/zone.dart: """,
            __x144 is __t142, false))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, f));
  }
  ZoneBinaryCallback registerBinaryCallback(Zone zone, f(arg1, arg2)) {
    _ZoneFunction implementation = _delegationTarget._registerBinaryCallback;
    _Zone implZone = implementation.zone;
    return ((__x148) => DDC$RT.cast(__x148, dynamic, __t145, "CastGeneral",
            """line 536, column 12 of dart:async/zone.dart: """,
            __x148 is __t145, false))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, f));
  }
  AsyncError errorCallback(Zone zone, Object error, StackTrace stackTrace) {
    _ZoneFunction implementation = _delegationTarget._errorCallback;
    _Zone implZone = implementation.zone;
    if (identical(implZone, _ROOT_ZONE)) return null;
    return ((__x149) => DDC$RT.cast(__x149, dynamic, AsyncError, "CastGeneral",
            """line 544, column 12 of dart:async/zone.dart: """,
            __x149 is AsyncError, true))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, error, stackTrace));
  }
  void scheduleMicrotask(Zone zone, f()) {
    _ZoneFunction implementation = _delegationTarget._scheduleMicrotask;
    _Zone implZone = implementation.zone;
    (implementation.function)(implZone, _parentDelegate(implZone), zone, f);
  }
  Timer createTimer(Zone zone, Duration duration, void f()) {
    _ZoneFunction implementation = _delegationTarget._createTimer;
    _Zone implZone = implementation.zone;
    return ((__x150) => DDC$RT.cast(__x150, dynamic, Timer, "CastGeneral",
            """line 558, column 12 of dart:async/zone.dart: """,
            __x150 is Timer, true))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, duration, f));
  }
  Timer createPeriodicTimer(Zone zone, Duration period, void f(Timer timer)) {
    _ZoneFunction implementation = _delegationTarget._createPeriodicTimer;
    _Zone implZone = implementation.zone;
    return ((__x151) => DDC$RT.cast(__x151, dynamic, Timer, "CastGeneral",
            """line 565, column 12 of dart:async/zone.dart: """,
            __x151 is Timer, true))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, period, f));
  }
  void print(Zone zone, String line) {
    _ZoneFunction implementation = _delegationTarget._print;
    _Zone implZone = implementation.zone;
    (implementation.function)(implZone, _parentDelegate(implZone), zone, line);
  }
  Zone fork(Zone zone, ZoneSpecification specification, Map zoneValues) {
    _ZoneFunction implementation = _delegationTarget._fork;
    _Zone implZone = implementation.zone;
    return ((__x152) => DDC$RT.cast(__x152, dynamic, Zone, "CastGeneral",
            """line 580, column 12 of dart:async/zone.dart: """, __x152 is Zone,
            true))((implementation.function)(
        implZone, _parentDelegate(implZone), zone, specification, zoneValues));
  }
}
abstract class _Zone implements Zone {
  const _Zone();
  _ZoneFunction get _runUnary;
  _ZoneFunction get _run;
  _ZoneFunction get _runBinary;
  _ZoneFunction get _registerCallback;
  _ZoneFunction get _registerUnaryCallback;
  _ZoneFunction get _registerBinaryCallback;
  _ZoneFunction get _errorCallback;
  _ZoneFunction get _scheduleMicrotask;
  _ZoneFunction get _createTimer;
  _ZoneFunction get _createPeriodicTimer;
  _ZoneFunction get _print;
  _ZoneFunction get _fork;
  _ZoneFunction get _handleUncaughtError;
  _Zone get parent;
  _ZoneDelegate get _delegate;
  Map get _map;
  bool inSameErrorZone(Zone otherZone) {
    return identical(this, otherZone) ||
        identical(errorZone, otherZone.errorZone);
  }
}
class _CustomZone extends _Zone {
  _ZoneFunction _runUnary;
  _ZoneFunction _run;
  _ZoneFunction _runBinary;
  _ZoneFunction _registerCallback;
  _ZoneFunction _registerUnaryCallback;
  _ZoneFunction _registerBinaryCallback;
  _ZoneFunction _errorCallback;
  _ZoneFunction _scheduleMicrotask;
  _ZoneFunction _createTimer;
  _ZoneFunction _createPeriodicTimer;
  _ZoneFunction _print;
  _ZoneFunction _fork;
  _ZoneFunction _handleUncaughtError;
  ZoneDelegate _delegateCache;
  final _Zone parent;
  final Map _map;
  ZoneDelegate get _delegate {
    if (_delegateCache != null) return _delegateCache;
    _delegateCache = new _ZoneDelegate(this);
    return _delegateCache;
  }
  _CustomZone(this.parent, ZoneSpecification specification, this._map) {
    _run = (specification.run != null)
        ? new _ZoneFunction(this, specification.run)
        : parent._run;
    _runUnary = (specification.runUnary != null)
        ? new _ZoneFunction(this, specification.runUnary)
        : parent._runUnary;
    _runBinary = (specification.runBinary != null)
        ? new _ZoneFunction(this, specification.runBinary)
        : parent._runBinary;
    _registerCallback = (specification.registerCallback != null)
        ? new _ZoneFunction(this, specification.registerCallback)
        : parent._registerCallback;
    _registerUnaryCallback = (specification.registerUnaryCallback != null)
        ? new _ZoneFunction(this, specification.registerUnaryCallback)
        : parent._registerUnaryCallback;
    _registerBinaryCallback = (specification.registerBinaryCallback != null)
        ? new _ZoneFunction(this, specification.registerBinaryCallback)
        : parent._registerBinaryCallback;
    _errorCallback = (specification.errorCallback != null)
        ? new _ZoneFunction(this, specification.errorCallback)
        : parent._errorCallback;
    _scheduleMicrotask = (specification.scheduleMicrotask != null)
        ? new _ZoneFunction(this, specification.scheduleMicrotask)
        : parent._scheduleMicrotask;
    _createTimer = (specification.createTimer != null)
        ? new _ZoneFunction(this, specification.createTimer)
        : parent._createTimer;
    _createPeriodicTimer = (specification.createPeriodicTimer != null)
        ? new _ZoneFunction(this, specification.createPeriodicTimer)
        : parent._createPeriodicTimer;
    _print = (specification.print != null)
        ? new _ZoneFunction(this, specification.print)
        : parent._print;
    _fork = (specification.fork != null)
        ? new _ZoneFunction(this, specification.fork)
        : parent._fork;
    _handleUncaughtError = (specification.handleUncaughtError != null)
        ? new _ZoneFunction(this, specification.handleUncaughtError)
        : parent._handleUncaughtError;
  }
  Zone get errorZone => _handleUncaughtError.zone;
  dynamic runGuarded(f()) {
    try {
      return run(f);
    } catch (e, s) {
      return handleUncaughtError(e, s);
    }
  }
  dynamic runUnaryGuarded(f(arg), arg) {
    try {
      return runUnary(f, arg);
    } catch (e, s) {
      return handleUncaughtError(e, s);
    }
  }
  dynamic runBinaryGuarded(f(arg1, arg2), arg1, arg2) {
    try {
      return runBinary(f, arg1, arg2);
    } catch (e, s) {
      return handleUncaughtError(e, s);
    }
  }
  ZoneCallback bindCallback(f(), {bool runGuarded: true}) {
    ZoneCallback registered = registerCallback(f);
    if (runGuarded) {
      return () => this.runGuarded(registered);
    } else {
      return () => this.run(registered);
    }
  }
  ZoneUnaryCallback bindUnaryCallback(f(arg), {bool runGuarded: true}) {
    ZoneUnaryCallback registered = registerUnaryCallback(f);
    if (runGuarded) {
      return (arg) => this.runUnaryGuarded(registered, arg);
    } else {
      return (arg) => this.runUnary(registered, arg);
    }
  }
  ZoneBinaryCallback bindBinaryCallback(f(arg1, arg2),
      {bool runGuarded: true}) {
    ZoneBinaryCallback registered = registerBinaryCallback(f);
    if (runGuarded) {
      return (arg1, arg2) => this.runBinaryGuarded(registered, arg1, arg2);
    } else {
      return (arg1, arg2) => this.runBinary(registered, arg1, arg2);
    }
  }
  operator [](Object key) {
    var result = _map[key];
    if (result != null || _map.containsKey(key)) return result;
    if (parent != null) {
      var value = parent[key];
      if (value != null) {
        _map[key] = value;
      }
      return value;
    }
    assert(this == _ROOT_ZONE);
    return null;
  }
  dynamic handleUncaughtError(error, StackTrace stackTrace) {
    _ZoneFunction implementation = this._handleUncaughtError;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return (implementation.function)(
        implementation.zone, parentDelegate, this, error, stackTrace);
  }
  Zone fork({ZoneSpecification specification, Map zoneValues}) {
    _ZoneFunction implementation = this._fork;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return ((__x153) => DDC$RT.cast(__x153, dynamic, Zone, "CastGeneral",
            """line 787, column 12 of dart:async/zone.dart: """, __x153 is Zone,
            true))((implementation.function)(
        implementation.zone, parentDelegate, this, specification, zoneValues));
  }
  dynamic run(f()) {
    _ZoneFunction implementation = this._run;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return (implementation.function)(
        implementation.zone, parentDelegate, this, f);
  }
  dynamic runUnary(f(arg), arg) {
    _ZoneFunction implementation = this._runUnary;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return (implementation.function)(
        implementation.zone, parentDelegate, this, f, arg);
  }
  dynamic runBinary(f(arg1, arg2), arg1, arg2) {
    _ZoneFunction implementation = this._runBinary;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return (implementation.function)(
        implementation.zone, parentDelegate, this, f, arg1, arg2);
  }
  ZoneCallback registerCallback(f()) {
    _ZoneFunction implementation = this._registerCallback;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return ((__x154) => DDC$RT.cast(__x154, dynamic, __t140, "CastGeneral",
            """line 820, column 12 of dart:async/zone.dart: """,
            __x154 is __t140, false))((implementation.function)(
        implementation.zone, parentDelegate, this, f));
  }
  ZoneUnaryCallback registerUnaryCallback(f(arg)) {
    _ZoneFunction implementation = this._registerUnaryCallback;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return ((__x155) => DDC$RT.cast(__x155, dynamic, __t142, "CastGeneral",
            """line 828, column 12 of dart:async/zone.dart: """,
            __x155 is __t142, false))((implementation.function)(
        implementation.zone, parentDelegate, this, f));
  }
  ZoneBinaryCallback registerBinaryCallback(f(arg1, arg2)) {
    _ZoneFunction implementation = this._registerBinaryCallback;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return ((__x156) => DDC$RT.cast(__x156, dynamic, __t145, "CastGeneral",
            """line 836, column 12 of dart:async/zone.dart: """,
            __x156 is __t145, false))((implementation.function)(
        implementation.zone, parentDelegate, this, f));
  }
  AsyncError errorCallback(Object error, StackTrace stackTrace) {
    final _ZoneFunction implementation = this._errorCallback;
    assert(implementation != null);
    final Zone implementationZone = implementation.zone;
    if (identical(implementationZone, _ROOT_ZONE)) return null;
    final ZoneDelegate parentDelegate = _parentDelegate(DDC$RT.cast(
        implementationZone, Zone, _Zone, "CastGeneral",
        """line 845, column 57 of dart:async/zone.dart: """,
        implementationZone is _Zone, true));
    return ((__x157) => DDC$RT.cast(__x157, dynamic, AsyncError, "CastGeneral",
            """line 846, column 12 of dart:async/zone.dart: """,
            __x157 is AsyncError, true))((implementation.function)(
        implementationZone, parentDelegate, this, error, stackTrace));
  }
  void scheduleMicrotask(void f()) {
    _ZoneFunction implementation = this._scheduleMicrotask;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return (implementation.function)(
        implementation.zone, parentDelegate, this, f);
  }
  Timer createTimer(Duration duration, void f()) {
    _ZoneFunction implementation = this._createTimer;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return ((__x158) => DDC$RT.cast(__x158, dynamic, Timer, "CastGeneral",
            """line 862, column 12 of dart:async/zone.dart: """,
            __x158 is Timer, true))((implementation.function)(
        implementation.zone, parentDelegate, this, duration, f));
  }
  Timer createPeriodicTimer(Duration duration, void f(Timer timer)) {
    _ZoneFunction implementation = this._createPeriodicTimer;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return ((__x159) => DDC$RT.cast(__x159, dynamic, Timer, "CastGeneral",
            """line 870, column 12 of dart:async/zone.dart: """,
            __x159 is Timer, true))((implementation.function)(
        implementation.zone, parentDelegate, this, duration, f));
  }
  void print(String line) {
    _ZoneFunction implementation = this._print;
    assert(implementation != null);
    ZoneDelegate parentDelegate = _parentDelegate(implementation.zone);
    return (implementation.function)(
        implementation.zone, parentDelegate, this, line);
  }
}
void _rootHandleUncaughtError(
    Zone self, ZoneDelegate parent, Zone zone, error, StackTrace stackTrace) {
  _schedulePriorityAsyncCallback(() {
    throw new _UncaughtAsyncError(error, stackTrace);
  });
}
dynamic _rootRun(Zone self, ZoneDelegate parent, Zone zone, f()) {
  if (Zone._current == zone) return f();
  Zone old = Zone._enter(zone);
  try {
    return f();
  } finally {
    Zone._leave(old);
  }
}
dynamic _rootRunUnary(Zone self, ZoneDelegate parent, Zone zone, f(arg), arg) {
  if (Zone._current == zone) return f(arg);
  Zone old = Zone._enter(zone);
  try {
    return f(arg);
  } finally {
    Zone._leave(old);
  }
}
dynamic _rootRunBinary(
    Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2), arg1, arg2) {
  if (Zone._current == zone) return f(arg1, arg2);
  Zone old = Zone._enter(zone);
  try {
    return f(arg1, arg2);
  } finally {
    Zone._leave(old);
  }
}
ZoneCallback _rootRegisterCallback(
    Zone self, ZoneDelegate parent, Zone zone, f()) {
  return f;
}
ZoneUnaryCallback _rootRegisterUnaryCallback(
    Zone self, ZoneDelegate parent, Zone zone, f(arg)) {
  return f;
}
ZoneBinaryCallback _rootRegisterBinaryCallback(
    Zone self, ZoneDelegate parent, Zone zone, f(arg1, arg2)) {
  return f;
}
AsyncError _rootErrorCallback(Zone self, ZoneDelegate parent, Zone zone,
    Object error, StackTrace stackTrace) => null;
void _rootScheduleMicrotask(Zone self, ZoneDelegate parent, Zone zone, f()) {
  if (!identical(_ROOT_ZONE, zone)) {
    bool hasErrorHandler = !_ROOT_ZONE.inSameErrorZone(zone);
    f = zone.bindCallback(f, runGuarded: hasErrorHandler);
  }
  _scheduleAsyncCallback(f);
}
Timer _rootCreateTimer(Zone self, ZoneDelegate parent, Zone zone,
    Duration duration, void callback()) {
  if (!identical(_ROOT_ZONE, zone)) {
    callback = zone.bindCallback(callback);
  }
  return Timer._createTimer(duration, callback);
}
Timer _rootCreatePeriodicTimer(Zone self, ZoneDelegate parent, Zone zone,
    Duration duration, void callback(Timer timer)) {
  if (!identical(_ROOT_ZONE, zone)) {
    callback = zone.bindUnaryCallback(DDC$RT.wrap((void f(Timer __u160)) {
      void c(Timer x0) => f(DDC$RT.cast(x0, dynamic, Timer, "CastParam",
          """line 962, column 39 of dart:async/zone.dart: """, x0 is Timer,
          true));
      return f == null ? null : c;
    }, callback, __t161, __t142, "Wrap",
        """line 962, column 39 of dart:async/zone.dart: """,
        callback is __t142));
  }
  return Timer._createPeriodicTimer(duration, callback);
}
void _rootPrint(Zone self, ZoneDelegate parent, Zone zone, String line) {
  printToConsole(line);
}
void _printToZone(String line) {
  Zone.current.print(line);
}
Zone _rootFork(Zone self, ZoneDelegate parent, Zone zone,
    ZoneSpecification specification, Map zoneValues) {
  printToZone = _printToZone;
  if (specification == null) {
    specification = const ZoneSpecification();
  } else if (specification is! _ZoneSpecification) {
    throw new ArgumentError(
        "ZoneSpecifications must be instantiated" " with the provided constructor.");
  }
  Map valueMap;
  if (zoneValues == null) {
    if (zone is _Zone) {
      valueMap = DDC$RT.cast(zone._map, dynamic,
          DDC$RT.type((Map<dynamic, dynamic> _) {}), "CastGeneral",
          """line 992, column 18 of dart:async/zone.dart: """,
          zone._map is Map<dynamic, dynamic>, true);
    } else {
      valueMap = new HashMap();
    }
  } else {
    valueMap = new HashMap.from(zoneValues);
  }
  return new _CustomZone(zone, specification, valueMap);
}
class _RootZoneSpecification implements ZoneSpecification {
  HandleUncaughtErrorHandler get handleUncaughtError =>
      _rootHandleUncaughtError;
  RunHandler get run => _rootRun;
  RunUnaryHandler get runUnary => _rootRunUnary;
  RunBinaryHandler get runBinary => _rootRunBinary;
  RegisterCallbackHandler get registerCallback => _rootRegisterCallback;
  RegisterUnaryCallbackHandler get registerUnaryCallback =>
      _rootRegisterUnaryCallback;
  RegisterBinaryCallbackHandler get registerBinaryCallback =>
      _rootRegisterBinaryCallback;
  ErrorCallbackHandler get errorCallback => _rootErrorCallback;
  ScheduleMicrotaskHandler get scheduleMicrotask => _rootScheduleMicrotask;
  CreateTimerHandler get createTimer => _rootCreateTimer;
  CreatePeriodicTimerHandler get createPeriodicTimer =>
      _rootCreatePeriodicTimer;
  PrintHandler get print => _rootPrint;
  ForkHandler get fork => _rootFork;
}
class _RootZone extends _Zone {
  const _RootZone();
  _ZoneFunction get _run => const _ZoneFunction(_ROOT_ZONE, _rootRun);
  _ZoneFunction get _runUnary => const _ZoneFunction(_ROOT_ZONE, _rootRunUnary);
  _ZoneFunction get _runBinary =>
      const _ZoneFunction(_ROOT_ZONE, _rootRunBinary);
  _ZoneFunction get _registerCallback =>
      const _ZoneFunction(_ROOT_ZONE, _rootRegisterCallback);
  _ZoneFunction get _registerUnaryCallback =>
      const _ZoneFunction(_ROOT_ZONE, _rootRegisterUnaryCallback);
  _ZoneFunction get _registerBinaryCallback =>
      const _ZoneFunction(_ROOT_ZONE, _rootRegisterBinaryCallback);
  _ZoneFunction get _errorCallback =>
      const _ZoneFunction(_ROOT_ZONE, _rootErrorCallback);
  _ZoneFunction get _scheduleMicrotask =>
      const _ZoneFunction(_ROOT_ZONE, _rootScheduleMicrotask);
  _ZoneFunction get _createTimer =>
      const _ZoneFunction(_ROOT_ZONE, _rootCreateTimer);
  _ZoneFunction get _createPeriodicTimer =>
      const _ZoneFunction(_ROOT_ZONE, _rootCreatePeriodicTimer);
  _ZoneFunction get _print => const _ZoneFunction(_ROOT_ZONE, _rootPrint);
  _ZoneFunction get _fork => const _ZoneFunction(_ROOT_ZONE, _rootFork);
  _ZoneFunction get _handleUncaughtError =>
      const _ZoneFunction(_ROOT_ZONE, _rootHandleUncaughtError);
  _Zone get parent => null;
  Map get _map => _rootMap;
  static Map _rootMap = new HashMap();
  static ZoneDelegate _rootDelegate;
  ZoneDelegate get _delegate {
    if (_rootDelegate != null) return _rootDelegate;
    return _rootDelegate = new _ZoneDelegate(this);
  }
  Zone get errorZone => this;
  dynamic runGuarded(f()) {
    try {
      if (identical(_ROOT_ZONE, Zone._current)) {
        return f();
      }
      return _rootRun(null, null, this, f);
    } catch (e, s) {
      return handleUncaughtError(e, s);
    }
  }
  dynamic runUnaryGuarded(f(arg), arg) {
    try {
      if (identical(_ROOT_ZONE, Zone._current)) {
        return f(arg);
      }
      return _rootRunUnary(null, null, this, f, arg);
    } catch (e, s) {
      return handleUncaughtError(e, s);
    }
  }
  dynamic runBinaryGuarded(f(arg1, arg2), arg1, arg2) {
    try {
      if (identical(_ROOT_ZONE, Zone._current)) {
        return f(arg1, arg2);
      }
      return _rootRunBinary(null, null, this, f, arg1, arg2);
    } catch (e, s) {
      return handleUncaughtError(e, s);
    }
  }
  ZoneCallback bindCallback(f(), {bool runGuarded: true}) {
    if (runGuarded) {
      return () => this.runGuarded(f);
    } else {
      return () => this.run(f);
    }
  }
  ZoneUnaryCallback bindUnaryCallback(f(arg), {bool runGuarded: true}) {
    if (runGuarded) {
      return (arg) => this.runUnaryGuarded(f, arg);
    } else {
      return (arg) => this.runUnary(f, arg);
    }
  }
  ZoneBinaryCallback bindBinaryCallback(f(arg1, arg2),
      {bool runGuarded: true}) {
    if (runGuarded) {
      return (arg1, arg2) => this.runBinaryGuarded(f, arg1, arg2);
    } else {
      return (arg1, arg2) => this.runBinary(f, arg1, arg2);
    }
  }
  operator [](Object key) => null;
  dynamic handleUncaughtError(error, StackTrace stackTrace) {
    return _rootHandleUncaughtError(null, null, this, error, stackTrace);
  }
  Zone fork({ZoneSpecification specification, Map zoneValues}) {
    return _rootFork(null, null, this, specification, zoneValues);
  }
  dynamic run(f()) {
    if (identical(Zone._current, _ROOT_ZONE)) return f();
    return _rootRun(null, null, this, f);
  }
  dynamic runUnary(f(arg), arg) {
    if (identical(Zone._current, _ROOT_ZONE)) return f(arg);
    return _rootRunUnary(null, null, this, f, arg);
  }
  dynamic runBinary(f(arg1, arg2), arg1, arg2) {
    if (identical(Zone._current, _ROOT_ZONE)) return f(arg1, arg2);
    return _rootRunBinary(null, null, this, f, arg1, arg2);
  }
  ZoneCallback registerCallback(f()) => f;
  ZoneUnaryCallback registerUnaryCallback(f(arg)) => f;
  ZoneBinaryCallback registerBinaryCallback(f(arg1, arg2)) => f;
  AsyncError errorCallback(Object error, StackTrace stackTrace) => null;
  void scheduleMicrotask(void f()) {
    _rootScheduleMicrotask(null, null, this, f);
  }
  Timer createTimer(Duration duration, void f()) {
    return Timer._createTimer(duration, f);
  }
  Timer createPeriodicTimer(Duration duration, void f(Timer timer)) {
    return Timer._createPeriodicTimer(duration, f);
  }
  void print(String line) {
    printToConsole(line);
  }
}
const _ROOT_ZONE = const _RootZone();
dynamic runZoned(body(),
    {Map zoneValues, ZoneSpecification zoneSpecification, Function onError}) {
  HandleUncaughtErrorHandler errorHandler;
  if (onError != null) {
    errorHandler = (Zone self, ZoneDelegate parent, Zone zone, error,
        StackTrace stackTrace) {
      try {
        if (onError is ZoneBinaryCallback) {
          return self.parent.runBinary(DDC$RT.cast(onError, Function, __t145,
              "CastGeneral",
              """line 1226, column 40 of dart:async/zone.dart: """,
              onError is __t145, false), error, stackTrace);
        }
        return self.parent.runUnary(DDC$RT.cast(onError, Function, __t142,
            "CastGeneral", """line 1228, column 37 of dart:async/zone.dart: """,
            onError is __t142, false), error);
      } catch (e, s) {
        if (identical(e, error)) {
          return parent.handleUncaughtError(zone, error, stackTrace);
        } else {
          return parent.handleUncaughtError(zone, e, s);
        }
      }
    };
  }
  if (zoneSpecification == null) {
    zoneSpecification =
        new ZoneSpecification(handleUncaughtError: errorHandler);
  } else if (errorHandler != null) {
    zoneSpecification = new ZoneSpecification.from(zoneSpecification,
        handleUncaughtError: errorHandler);
  }
  Zone zone = Zone.current.fork(
      specification: zoneSpecification, zoneValues: zoneValues);
  if (onError != null) {
    return zone.runGuarded(body);
  } else {
    return zone.run(body);
  }
}
typedef dynamic __t140();
typedef dynamic __t142(dynamic __u143);
typedef dynamic __t145(dynamic __u146, dynamic __u147);
typedef void __t161(Timer __u162);
