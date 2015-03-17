var async;
(function(exports) {
  'use strict';
  // Function _invokeErrorHandler: (Function, Object, StackTrace) → dynamic
  function _invokeErrorHandler(errorHandler, error, stackTrace) {
    if (dart.is(errorHandler, ZoneBinaryCallback)) {
      return dart.dinvokef(errorHandler, error, stackTrace);
    } else {
      return dart.dinvokef(errorHandler, error);
    }
  }
  // Function _registerErrorHandler: (Function, Zone) → Function
  function _registerErrorHandler(errorHandler, zone) {
    if (dart.is(errorHandler, ZoneBinaryCallback)) {
      return zone.registerBinaryCallback(errorHandler);
    } else {
      return zone.registerUnaryCallback(dart.as(errorHandler, dart.throw_("Unimplemented type (dynamic) → dynamic")));
    }
  }
  let _getBestStackTrace = Symbol('_getBestStackTrace');
  class _UncaughtAsyncError extends AsyncError {
    _UncaughtAsyncError(error, stackTrace) {
      super.AsyncError(error, _getBestStackTrace(error, stackTrace));
    }
    static [_getBestStackTrace](error, stackTrace) {
      if (stackTrace !== null)
        return stackTrace;
      if (dart.is(error, core.Error)) {
        return dart.as(dart.dload(error, 'stackTrace'), core.StackTrace);
      }
      return null;
    }
    toString() {
      let result = `Uncaught Error: ${this.error}`;
      if (this.stackTrace !== null) {
        result = `\nStack Trace:\n${this.stackTrace}`;
      }
      return result;
    }
  }
  let _BroadcastStream$ = dart.generic(function(T) {
    class _BroadcastStream extends _ControllerStream$(T) {
      _BroadcastStream(controller) {
        super._ControllerStream(dart.as(controller, _StreamControllerLifecycle$(T)));
      }
      get isBroadcast() {
        return true;
      }
    }
    return _BroadcastStream;
  });
  let _BroadcastStream = _BroadcastStream$(dart.dynamic);
  let _next = Symbol('_next');
  let _previous = Symbol('_previous');
  class _BroadcastSubscriptionLink extends core.Object {
    _BroadcastSubscriptionLink() {
      this[_next] = null;
      this[_previous] = null;
    }
  }
  let _eventState = Symbol('_eventState');
  let _controller = Symbol('_controller');
  let _expectsEvent = Symbol('_expectsEvent');
  let _toggleEventId = Symbol('_toggleEventId');
  let _isFiring = Symbol('_isFiring');
  let _setRemoveAfterFiring = Symbol('_setRemoveAfterFiring');
  let _removeAfterFiring = Symbol('_removeAfterFiring');
  let _onPause = Symbol('_onPause');
  let _onResume = Symbol('_onResume');
  let _BroadcastSubscription$ = dart.generic(function(T) {
    class _BroadcastSubscription extends _ControllerSubscription$(T) {
      _BroadcastSubscription(controller, onData, onError, onDone, cancelOnError) {
        this[_eventState] = null;
        this[_next] = null;
        this[_previous] = null;
        super._ControllerSubscription(dart.as(controller, _StreamControllerLifecycle$(T)), onData, onError, onDone, cancelOnError);
        this[_next] = this[_previous] = this;
      }
      get [_controller]() {
        return dart.as(super[_controller], _BroadcastStreamController);
      }
      [_expectsEvent](eventId) {
        return (dart.notNull(this[_eventState]) & dart.notNull(_BroadcastSubscription._STATE_EVENT_ID)) === eventId;
      }
      [_toggleEventId]() {
        this[_eventState] = _BroadcastSubscription._STATE_EVENT_ID;
      }
      get [_isFiring]() {
        return (dart.notNull(this[_eventState]) & dart.notNull(_BroadcastSubscription._STATE_FIRING)) !== 0;
      }
      [_setRemoveAfterFiring]() {
        dart.assert(this[_isFiring]);
        this[_eventState] = _BroadcastSubscription._STATE_REMOVE_AFTER_FIRING;
      }
      get [_removeAfterFiring]() {
        return (dart.notNull(this[_eventState]) & dart.notNull(_BroadcastSubscription._STATE_REMOVE_AFTER_FIRING)) !== 0;
      }
      [_onPause]() {}
      [_onResume]() {}
    }
    _BroadcastSubscription._STATE_EVENT_ID = 1;
    _BroadcastSubscription._STATE_FIRING = 2;
    _BroadcastSubscription._STATE_REMOVE_AFTER_FIRING = 4;
    return _BroadcastSubscription;
  });
  let _BroadcastSubscription = _BroadcastSubscription$(dart.dynamic);
  let _onListen = Symbol('_onListen');
  let _onCancel = Symbol('_onCancel');
  let _state = Symbol('_state');
  let _addStreamState = Symbol('_addStreamState');
  let _doneFuture = Symbol('_doneFuture');
  let _isEmpty = Symbol('_isEmpty');
  let _hasOneListener = Symbol('_hasOneListener');
  let _isAddingStream = Symbol('_isAddingStream');
  let _mayAddEvent = Symbol('_mayAddEvent');
  let _ensureDoneFuture = Symbol('_ensureDoneFuture');
  let _addListener = Symbol('_addListener');
  let _removeListener = Symbol('_removeListener');
  let _subscribe = Symbol('_subscribe');
  let _recordCancel = Symbol('_recordCancel');
  let _callOnCancel = Symbol('_callOnCancel');
  let _recordPause = Symbol('_recordPause');
  let _recordResume = Symbol('_recordResume');
  let _addEventError = Symbol('_addEventError');
  let _sendData = Symbol('_sendData');
  let _sendError = Symbol('_sendError');
  let _sendDone = Symbol('_sendDone');
  let _add = Symbol('_add');
  let _addError = Symbol('_addError');
  let _close = Symbol('_close');
  let _forEachListener = Symbol('_forEachListener');
  let _STATE_FIRING = Symbol('_STATE_FIRING');
  let _mayComplete = Symbol('_mayComplete');
  let _BroadcastStreamController$ = dart.generic(function(T) {
    class _BroadcastStreamController extends core.Object {
      _BroadcastStreamController($_onListen, $_onCancel) {
        this[_onListen] = $_onListen;
        this[_onCancel] = $_onCancel;
        this[_state] = _BroadcastStreamController._STATE_INITIAL;
        this[_next] = null;
        this[_previous] = null;
        this[_addStreamState] = null;
        this[_doneFuture] = null;
        this[_next] = this[_previous] = this;
      }
      get stream() {
        return new _BroadcastStream(this);
      }
      get sink() {
        return new _StreamSinkWrapper(this);
      }
      get isClosed() {
        return (dart.notNull(this[_state]) & dart.notNull(_BroadcastStreamController._STATE_CLOSED)) !== 0;
      }
      get isPaused() {
        return false;
      }
      get hasListener() {
        return !dart.notNull(this[_isEmpty]);
      }
      get [_hasOneListener]() {
        dart.assert(!dart.notNull(this[_isEmpty]));
        return core.identical(this[_next][_next], this);
      }
      get [_isFiring]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BroadcastStreamController._STATE_FIRING)) !== 0;
      }
      get [_isAddingStream]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BroadcastStreamController._STATE_ADDSTREAM)) !== 0;
      }
      get [_mayAddEvent]() {
        return dart.notNull(this[_state]) < dart.notNull(_BroadcastStreamController._STATE_CLOSED);
      }
      [_ensureDoneFuture]() {
        if (this[_doneFuture] !== null)
          return this[_doneFuture];
        return this[_doneFuture] = new _Future();
      }
      get [_isEmpty]() {
        return core.identical(this[_next], this);
      }
      [_addListener](subscription) {
        dart.assert(core.identical(subscription[_next], subscription));
        subscription[_previous] = this[_previous];
        subscription[_next] = this;
        this[_previous][_next] = subscription;
        this[_previous] = subscription;
        subscription[_eventState] = dart.notNull(this[_state]) & dart.notNull(_BroadcastStreamController._STATE_EVENT_ID);
      }
      [_removeListener](subscription) {
        dart.assert(core.identical(subscription[_controller], this));
        dart.assert(!dart.notNull(core.identical(subscription[_next], subscription)));
        let previous = subscription[_previous];
        let next = subscription[_next];
        previous[_next] = next;
        next[_previous] = previous;
        subscription[_next] = subscription[_previous] = subscription;
      }
      [_subscribe](onData, onError, onDone, cancelOnError) {
        if (this.isClosed) {
          if (onDone === null)
            onDone = _nullDoneHandler;
          return new _DoneStreamSubscription(onDone);
        }
        let subscription = new _BroadcastSubscription(this, onData, onError, onDone, cancelOnError);
        this[_addListener](dart.as(subscription, _BroadcastSubscription$(T)));
        if (core.identical(this[_next], this[_previous])) {
          _runGuarded(this[_onListen]);
        }
        return dart.as(subscription, StreamSubscription$(T));
      }
      [_recordCancel](subscription) {
        if (core.identical(subscription[_next], subscription))
          return null;
        dart.assert(!dart.notNull(core.identical(subscription[_next], subscription)));
        if (subscription[_isFiring]) {
          subscription._setRemoveAfterFiring();
        } else {
          dart.assert(!dart.notNull(core.identical(subscription[_next], subscription)));
          this[_removeListener](subscription);
          if (!dart.notNull(this[_isFiring]) && dart.notNull(this[_isEmpty])) {
            this[_callOnCancel]();
          }
        }
        return null;
      }
      [_recordPause](subscription) {}
      [_recordResume](subscription) {}
      [_addEventError]() {
        if (this.isClosed) {
          return new core.StateError("Cannot add new events after calling close");
        }
        dart.assert(this[_isAddingStream]);
        return new core.StateError("Cannot add new events while doing an addStream");
      }
      add(data) {
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_addEventError]();
        this[_sendData](data);
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        error = _nonNullError(error);
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_addEventError]();
        let replacement = Zone.current.errorCallback(error, stackTrace);
        if (replacement !== null) {
          error = _nonNullError(replacement.error);
          stackTrace = replacement.stackTrace;
        }
        this[_sendError](error, stackTrace);
      }
      close() {
        if (this.isClosed) {
          dart.assert(this[_doneFuture] !== null);
          return this[_doneFuture];
        }
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_addEventError]();
        this[_state] = _BroadcastStreamController._STATE_CLOSED;
        let doneFuture = this[_ensureDoneFuture]();
        this[_sendDone]();
        return doneFuture;
      }
      get done() {
        return this[_ensureDoneFuture]();
      }
      addStream(stream, opt$) {
        let cancelOnError = opt$.cancelOnError === void 0 ? true : opt$.cancelOnError;
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_addEventError]();
        this[_state] = _BroadcastStreamController._STATE_ADDSTREAM;
        this[_addStreamState] = dart.as(new _AddStreamState(this, stream, cancelOnError), _AddStreamState$(T));
        return this[_addStreamState].addStreamFuture;
      }
      [_add](data) {
        this[_sendData](data);
      }
      [_addError](error, stackTrace) {
        this[_sendError](error, stackTrace);
      }
      [_close]() {
        dart.assert(this[_isAddingStream]);
        let addState = this[_addStreamState];
        this[_addStreamState] = null;
        this[_state] = ~dart.notNull(_BroadcastStreamController._STATE_ADDSTREAM);
        addState.complete();
      }
      [_forEachListener](action) {
        if (this[_isFiring]) {
          throw new core.StateError("Cannot fire new event. Controller is already firing an event");
        }
        if (this[_isEmpty])
          return;
        let id = dart.notNull(this[_state]) & dart.notNull(_BroadcastStreamController._STATE_EVENT_ID);
        this[_state] = dart.notNull(_BroadcastStreamController._STATE_EVENT_ID) | dart.notNull(_BroadcastStreamController._STATE_FIRING);
        let link = this[_next];
        while (!dart.notNull(core.identical(link, this))) {
          let subscription = dart.as(link, _BroadcastSubscription$(T));
          if (subscription._expectsEvent(id)) {
            subscription[_eventState] = _BroadcastSubscription[_STATE_FIRING];
            action(subscription);
            subscription._toggleEventId();
            link = subscription[_next];
            if (subscription[_removeAfterFiring]) {
              this[_removeListener](subscription);
            }
            subscription[_eventState] = ~dart.notNull(_BroadcastSubscription[_STATE_FIRING]);
          } else {
            link = subscription[_next];
          }
        }
        this[_state] = ~dart.notNull(_BroadcastStreamController._STATE_FIRING);
        if (this[_isEmpty]) {
          this[_callOnCancel]();
        }
      }
      [_callOnCancel]() {
        dart.assert(this[_isEmpty]);
        if (dart.notNull(this.isClosed) && dart.notNull(this[_doneFuture][_mayComplete])) {
          this[_doneFuture]._asyncComplete(null);
        }
        _runGuarded(this[_onCancel]);
      }
    }
    _BroadcastStreamController._STATE_INITIAL = 0;
    _BroadcastStreamController._STATE_EVENT_ID = 1;
    _BroadcastStreamController._STATE_FIRING = 2;
    _BroadcastStreamController._STATE_CLOSED = 4;
    _BroadcastStreamController._STATE_ADDSTREAM = 8;
    return _BroadcastStreamController;
  });
  let _BroadcastStreamController = _BroadcastStreamController$(dart.dynamic);
  let _SyncBroadcastStreamController$ = dart.generic(function(T) {
    class _SyncBroadcastStreamController extends _BroadcastStreamController$(T) {
      _SyncBroadcastStreamController(onListen, onCancel) {
        super._BroadcastStreamController(onListen, onCancel);
      }
      [_sendData](data) {
        if (this[_isEmpty])
          return;
        if (this[_hasOneListener]) {
          this[_state] = _BroadcastStreamController[_STATE_FIRING];
          let subscription = dart.as(this[_next], _BroadcastSubscription);
          subscription._add(data);
          this[_state] = ~dart.notNull(_BroadcastStreamController[_STATE_FIRING]);
          if (this[_isEmpty]) {
            this[_callOnCancel]();
          }
          return;
        }
        this[_forEachListener](((subscription) => {
          subscription._add(data);
        }).bind(this));
      }
      [_sendError](error, stackTrace) {
        if (this[_isEmpty])
          return;
        this[_forEachListener](((subscription) => {
          subscription._addError(error, stackTrace);
        }).bind(this));
      }
      [_sendDone]() {
        if (!dart.notNull(this[_isEmpty])) {
          this[_forEachListener](dart.as(((subscription) => {
            subscription._close();
          }).bind(this), dart.throw_("Unimplemented type (_BufferingStreamSubscription<T>) → void")));
        } else {
          dart.assert(this[_doneFuture] !== null);
          dart.assert(this[_doneFuture][_mayComplete]);
          this[_doneFuture]._asyncComplete(null);
        }
      }
    }
    return _SyncBroadcastStreamController;
  });
  let _SyncBroadcastStreamController = _SyncBroadcastStreamController$(dart.dynamic);
  let _AsyncBroadcastStreamController$ = dart.generic(function(T) {
    class _AsyncBroadcastStreamController extends _BroadcastStreamController$(T) {
      _AsyncBroadcastStreamController(onListen, onCancel) {
        super._BroadcastStreamController(onListen, onCancel);
      }
      [_sendData](data) {
        for (let link = this[_next]; !dart.notNull(core.identical(link, this)); link = link[_next]) {
          let subscription = dart.as(link, _BroadcastSubscription$(T));
          subscription._addPending(new _DelayedData(data));
        }
      }
      [_sendError](error, stackTrace) {
        for (let link = this[_next]; !dart.notNull(core.identical(link, this)); link = link[_next]) {
          let subscription = dart.as(link, _BroadcastSubscription$(T));
          subscription._addPending(new _DelayedError(error, stackTrace));
        }
      }
      [_sendDone]() {
        if (!dart.notNull(this[_isEmpty])) {
          for (let link = this[_next]; !dart.notNull(core.identical(link, this)); link = link[_next]) {
            let subscription = dart.as(link, _BroadcastSubscription$(T));
            subscription._addPending(new _DelayedDone());
          }
        } else {
          dart.assert(this[_doneFuture] !== null);
          dart.assert(this[_doneFuture][_mayComplete]);
          this[_doneFuture]._asyncComplete(null);
        }
      }
    }
    return _AsyncBroadcastStreamController;
  });
  let _AsyncBroadcastStreamController = _AsyncBroadcastStreamController$(dart.dynamic);
  let _pending = Symbol('_pending');
  let _hasPending = Symbol('_hasPending');
  let _addPendingEvent = Symbol('_addPendingEvent');
  let _STATE_CLOSED = Symbol('_STATE_CLOSED');
  let _AsBroadcastStreamController$ = dart.generic(function(T) {
    class _AsBroadcastStreamController extends _SyncBroadcastStreamController$(T) {
      _AsBroadcastStreamController(onListen, onCancel) {
        this[_pending] = null;
        super._SyncBroadcastStreamController(onListen, onCancel);
      }
      get [_hasPending]() {
        return dart.notNull(this[_pending] !== null) && !dart.notNull(this[_pending].isEmpty);
      }
      [_addPendingEvent](event) {
        if (this[_pending] === null) {
          this[_pending] = new _StreamImplEvents();
        }
        this[_pending].add(event);
      }
      add(data) {
        if (!dart.notNull(this.isClosed) && dart.notNull(this[_isFiring])) {
          this[_addPendingEvent](new _DelayedData(data));
          return;
        }
        super.add(data);
        while (this[_hasPending]) {
          this[_pending].handleNext(this);
        }
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        if (!dart.notNull(this.isClosed) && dart.notNull(this[_isFiring])) {
          this[_addPendingEvent](new _DelayedError(error, stackTrace));
          return;
        }
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_addEventError]();
        this[_sendError](error, stackTrace);
        while (this[_hasPending]) {
          this[_pending].handleNext(this);
        }
      }
      close() {
        if (!dart.notNull(this.isClosed) && dart.notNull(this[_isFiring])) {
          this[_addPendingEvent](new _DelayedDone());
          this[_state] = _BroadcastStreamController[_STATE_CLOSED];
          return super.done;
        }
        let result = super.close();
        dart.assert(!dart.notNull(this[_hasPending]));
        return result;
      }
      [_callOnCancel]() {
        if (this[_hasPending]) {
          this[_pending].clear();
          this[_pending] = null;
        }
        super._callOnCancel();
      }
    }
    return _AsBroadcastStreamController;
  });
  let _AsBroadcastStreamController = _AsBroadcastStreamController$(dart.dynamic);
  let _pauseCount = Symbol('_pauseCount');
  let _resume = Symbol('_resume');
  let _DoneSubscription$ = dart.generic(function(T) {
    class _DoneSubscription extends core.Object {
      _DoneSubscription() {
        this[_pauseCount] = 0;
      }
      onData(handleData) {}
      onError(handleError) {}
      onDone(handleDone) {}
      pause(resumeSignal) {
        if (resumeSignal === void 0)
          resumeSignal = null;
        if (resumeSignal !== null)
          resumeSignal.then(this[_resume]);
        this[_pauseCount] = dart.notNull(this[_pauseCount]) + 1;
      }
      resume() {
        this[_resume](null);
      }
      [_resume](_) {
        if (dart.notNull(this[_pauseCount]) > 0)
          this[_pauseCount] = dart.notNull(this[_pauseCount]) - 1;
      }
      cancel() {
        return new _Future.immediate(null);
      }
      get isPaused() {
        return dart.notNull(this[_pauseCount]) > 0;
      }
      asFuture(value) {
        if (value === void 0)
          value = null;
        return new _Future();
      }
    }
    return _DoneSubscription;
  });
  let _DoneSubscription = _DoneSubscription$(dart.dynamic);
  class DeferredLibrary extends core.Object {
    DeferredLibrary(libraryName, opt$) {
      let uri = opt$.uri === void 0 ? null : opt$.uri;
      this.libraryName = libraryName;
      this.uri = uri;
    }
    load() {
      throw 'DeferredLibrary not supported. ' + 'please use the `import "lib.dart" deferred as lib` syntax.';
    }
  }
  let _s = Symbol('_s');
  class DeferredLoadException extends core.Object {
    DeferredLoadException($_s) {
      this[_s] = $_s;
    }
    toString() {
      return `DeferredLoadException: '${this[_s]}'`;
    }
  }
  let _completeError = Symbol('_completeError');
  let Future$ = dart.generic(function(T) {
    class Future extends core.Object {
      Future(computation) {
        let result = new _Future();
        Timer.run((() => {
          try {
            result._complete(computation());
          } catch (e) {
            let s = dart.stackTrace(e);
            _completeWithErrorCallback(result, e, s);
          }

        }).bind(this));
        return dart.as(result, Future$(T));
      }
      Future$microtask(computation) {
        let result = new _Future();
        scheduleMicrotask((() => {
          try {
            result._complete(computation());
          } catch (e) {
            let s = dart.stackTrace(e);
            _completeWithErrorCallback(result, e, s);
          }

        }).bind(this));
        return dart.as(result, Future$(T));
      }
      Future$sync(computation) {
        try {
          let result = computation();
          return new Future.value(result);
        } catch (error) {
          let stackTrace = dart.stackTrace(error);
          return new Future.error(error, stackTrace);
        }

      }
      Future$value(value) {
        if (value === void 0)
          value = null;
        return new _Future.immediate(value);
      }
      Future$error(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        error = _nonNullError(error);
        if (!dart.notNull(core.identical(Zone.current, _ROOT_ZONE))) {
          let replacement = Zone.current.errorCallback(error, stackTrace);
          if (replacement !== null) {
            error = _nonNullError(replacement.error);
            stackTrace = replacement.stackTrace;
          }
        }
        return new _Future.immediateError(error, stackTrace);
      }
      Future$delayed(duration, computation) {
        if (computation === void 0)
          computation = null;
        let result = new _Future();
        new Timer(duration, (() => {
          try {
            result._complete(computation === null ? null : computation());
          } catch (e) {
            let s = dart.stackTrace(e);
            _completeWithErrorCallback(result, e, s);
          }

        }).bind(this));
        return dart.as(result, Future$(T));
      }
      static wait(futures, opt$) {
        let eagerError = opt$.eagerError === void 0 ? false : opt$.eagerError;
        let cleanUp = opt$.cleanUp === void 0 ? null : opt$.cleanUp;
        let result = new _Future();
        let values = null;
        let remaining = 0;
        let error = null;
        let stackTrace = null;
        // Function handleError: (dynamic, dynamic) → void
        function handleError(theError, theStackTrace) {
          remaining = dart.notNull(remaining) - 1;
          if (values !== null) {
            if (cleanUp !== null) {
              for (let value of values) {
                if (value !== null) {
                  new Future.sync(() => {
                    cleanUp(value);
                  });
                }
              }
            }
            values = null;
            if (remaining === 0 || dart.notNull(eagerError)) {
              result._completeError(theError, dart.as(theStackTrace, core.StackTrace));
            } else {
              error = theError;
              stackTrace = dart.as(theStackTrace, core.StackTrace);
            }
          } else if (remaining === 0 && !dart.notNull(eagerError)) {
            result._completeError(error, stackTrace);
          }
        }
        for (let future of futures) {
          let pos = (($tmp) => remaining = dart.notNull($tmp) + 1, $tmp)(remaining);
          future.then(dart.as(((value) => {
            remaining = dart.notNull(remaining) - 1;
            if (values !== null) {
              values.set(pos, value);
              if (remaining === 0) {
                result._completeWithValue(values);
              }
            } else {
              if (dart.notNull(cleanUp !== null) && dart.notNull(value !== null)) {
                new Future.sync(() => {
                  cleanUp(value);
                });
              }
              if (remaining === 0 && !dart.notNull(eagerError)) {
                result._completeError(error, stackTrace);
              }
            }
          }).bind(this), dart.throw_("Unimplemented type (dynamic) → dynamic")), {onError: handleError});
        }
        if (remaining === 0) {
          return dart.as(new Future.value(/* Unimplemented const */new List.from([])), Future$(core.List));
        }
        values = new core.List(remaining);
        return result;
      }
      static forEach(input, f) {
        let iterator = input.iterator;
        return doWhile((() => {
          if (!dart.notNull(iterator.moveNext()))
            return false;
          return new Future.sync((() => f(iterator.current)).bind(this)).then((_) => true);
        }).bind(this));
      }
      static doWhile(f) {
        let doneSignal = new _Future();
        let nextIteration = null;
        nextIteration = Zone.current.bindUnaryCallback(dart.as(((keepGoing) => {
          if (keepGoing) {
            new Future.sync(f).then(dart.as(nextIteration, dart.throw_("Unimplemented type (dynamic) → dynamic")), {onError: doneSignal[_completeError]});
          } else {
            doneSignal._complete(null);
          }
        }).bind(this), dart.throw_("Unimplemented type (dynamic) → dynamic")), {runGuarded: true});
        dart.dinvokef(nextIteration, true);
        return doneSignal;
      }
    }
    dart.defineNamedConstructor(Future, 'microtask');
    dart.defineNamedConstructor(Future, 'sync');
    dart.defineNamedConstructor(Future, 'value');
    dart.defineNamedConstructor(Future, 'error');
    dart.defineNamedConstructor(Future, 'delayed');
    dart.defineLazyProperties(Future, {
      get _nullFuture() {
        return dart.as(new Future.value(null), _Future);
      }
    });
    return Future;
  });
  let Future = Future$(dart.dynamic);
  class TimeoutException extends core.Object {
    TimeoutException(message, duration) {
      if (duration === void 0)
        duration = null;
      this.message = message;
      this.duration = duration;
    }
    toString() {
      let result = "TimeoutException";
      if (this.duration !== null)
        result = `TimeoutException after ${this.duration}`;
      if (this.message !== null)
        result = `${result}: ${this.message}`;
      return result;
    }
  }
  let Completer$ = dart.generic(function(T) {
    class Completer extends core.Object {
      Completer() {
        return new _AsyncCompleter();
      }
      Completer$sync() {
        return new _SyncCompleter();
      }
    }
    dart.defineNamedConstructor(Completer, 'sync');
    return Completer;
  });
  let Completer = Completer$(dart.dynamic);
  // Function _completeWithErrorCallback: (_Future<dynamic>, dynamic, dynamic) → void
  function _completeWithErrorCallback(result, error, stackTrace) {
    let replacement = Zone.current.errorCallback(error, dart.as(stackTrace, core.StackTrace));
    if (replacement !== null) {
      error = _nonNullError(replacement.error);
      stackTrace = replacement.stackTrace;
    }
    result._completeError(error, dart.as(stackTrace, core.StackTrace));
  }
  // Function _nonNullError: (Object) → Object
  function _nonNullError(error) {
    return error !== null ? error : new core.NullThrownError();
  }
  let _Completer$ = dart.generic(function(T) {
    class _Completer extends core.Object {
      _Completer() {
        this.future = new _Future();
      }
      completeError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        error = _nonNullError(error);
        if (!dart.notNull(this.future[_mayComplete]))
          throw new core.StateError("Future already completed");
        let replacement = Zone.current.errorCallback(error, stackTrace);
        if (replacement !== null) {
          error = _nonNullError(replacement.error);
          stackTrace = replacement.stackTrace;
        }
        this[_completeError](error, stackTrace);
      }
      get isCompleted() {
        return !dart.notNull(this.future[_mayComplete]);
      }
    }
    return _Completer;
  });
  let _Completer = _Completer$(dart.dynamic);
  let _AsyncCompleter$ = dart.generic(function(T) {
    class _AsyncCompleter extends _Completer$(T) {
      complete(value) {
        if (value === void 0)
          value = null;
        if (!dart.notNull(this.future[_mayComplete]))
          throw new core.StateError("Future already completed");
        this.future._asyncComplete(value);
      }
      [_completeError](error, stackTrace) {
        this.future._asyncCompleteError(error, stackTrace);
      }
    }
    return _AsyncCompleter;
  });
  let _AsyncCompleter = _AsyncCompleter$(dart.dynamic);
  let _SyncCompleter$ = dart.generic(function(T) {
    class _SyncCompleter extends _Completer$(T) {
      complete(value) {
        if (value === void 0)
          value = null;
        if (!dart.notNull(this.future[_mayComplete]))
          throw new core.StateError("Future already completed");
        this.future._complete(value);
      }
      [_completeError](error, stackTrace) {
        this.future._completeError(error, stackTrace);
      }
    }
    return _SyncCompleter;
  });
  let _SyncCompleter = _SyncCompleter$(dart.dynamic);
  let _nextListener = Symbol('_nextListener');
  let _zone = Symbol('_zone');
  let _onValue = Symbol('_onValue');
  let _onError = Symbol('_onError');
  let _errorTest = Symbol('_errorTest');
  let _whenCompleteAction = Symbol('_whenCompleteAction');
  class _FutureListener extends core.Object {
    _FutureListener$then(result, onValue, errorCallback) {
      this.result = result;
      this.callback = onValue;
      this.errorCallback = errorCallback;
      this.state = errorCallback === null ? _FutureListener.STATE_THEN : _FutureListener.STATE_THEN_ONERROR;
      this[_nextListener] = null;
    }
    _FutureListener$catchError(result, errorCallback, test) {
      this.result = result;
      this.errorCallback = errorCallback;
      this.callback = test;
      this.state = test === null ? _FutureListener.STATE_CATCHERROR : _FutureListener.STATE_CATCHERROR_TEST;
      this[_nextListener] = null;
    }
    _FutureListener$whenComplete(result, onComplete) {
      this.result = result;
      this.callback = onComplete;
      this.errorCallback = null;
      this.state = _FutureListener.STATE_WHENCOMPLETE;
      this[_nextListener] = null;
    }
    _FutureListener$chain(result) {
      this.result = result;
      this.callback = null;
      this.errorCallback = null;
      this.state = _FutureListener.STATE_CHAIN;
      this[_nextListener] = null;
    }
    get [_zone]() {
      return this.result[_zone];
    }
    get handlesValue() {
      return (dart.notNull(this.state) & dart.notNull(_FutureListener.MASK_VALUE)) !== 0;
    }
    get handlesError() {
      return (dart.notNull(this.state) & dart.notNull(_FutureListener.MASK_ERROR)) !== 0;
    }
    get hasErrorTest() {
      return this.state === _FutureListener.STATE_CATCHERROR_TEST;
    }
    get handlesComplete() {
      return this.state === _FutureListener.STATE_WHENCOMPLETE;
    }
    get [_onValue]() {
      dart.assert(this.handlesValue);
      return dart.as(this.callback, _FutureOnValue);
    }
    get [_onError]() {
      return this.errorCallback;
    }
    get [_errorTest]() {
      dart.assert(this.hasErrorTest);
      return dart.as(this.callback, _FutureErrorTest);
    }
    get [_whenCompleteAction]() {
      dart.assert(this.handlesComplete);
      return dart.as(this.callback, _FutureAction);
    }
  }
  dart.defineNamedConstructor(_FutureListener, 'then');
  dart.defineNamedConstructor(_FutureListener, 'catchError');
  dart.defineNamedConstructor(_FutureListener, 'whenComplete');
  dart.defineNamedConstructor(_FutureListener, 'chain');
  _FutureListener.MASK_VALUE = 1;
  _FutureListener.MASK_ERROR = 2;
  _FutureListener.MASK_TEST_ERROR = 4;
  _FutureListener.MASK_WHENCOMPLETE = 8;
  _FutureListener.STATE_CHAIN = 0;
  _FutureListener.STATE_THEN = _FutureListener.MASK_VALUE;
  _FutureListener.STATE_THEN_ONERROR = dart.notNull(_FutureListener.MASK_VALUE) | dart.notNull(_FutureListener.MASK_ERROR);
  _FutureListener.STATE_CATCHERROR = _FutureListener.MASK_ERROR;
  _FutureListener.STATE_CATCHERROR_TEST = dart.notNull(_FutureListener.MASK_ERROR) | dart.notNull(_FutureListener.MASK_TEST_ERROR);
  _FutureListener.STATE_WHENCOMPLETE = _FutureListener.MASK_WHENCOMPLETE;
  let _resultOrListeners = Symbol('_resultOrListeners');
  let _asyncComplete = Symbol('_asyncComplete');
  let _asyncCompleteError = Symbol('_asyncCompleteError');
  let _isChained = Symbol('_isChained');
  let _isComplete = Symbol('_isComplete');
  let _hasValue = Symbol('_hasValue');
  let _hasError = Symbol('_hasError');
  let _markPendingCompletion = Symbol('_markPendingCompletion');
  let _value = Symbol('_value');
  let _error = Symbol('_error');
  let _setValue = Symbol('_setValue');
  let _setErrorObject = Symbol('_setErrorObject');
  let _setError = Symbol('_setError');
  let _removeListeners = Symbol('_removeListeners');
  let _chainForeignFuture = Symbol('_chainForeignFuture');
  let _chainCoreFuture = Symbol('_chainCoreFuture');
  let _complete = Symbol('_complete');
  let _completeWithValue = Symbol('_completeWithValue');
  let _propagateToListeners = Symbol('_propagateToListeners');
  let _Future$ = dart.generic(function(T) {
    class _Future extends core.Object {
      _Future() {
        this[_zone] = Zone.current;
        this[_state] = _Future._INCOMPLETE;
        this[_resultOrListeners] = null;
      }
      _Future$immediate(value) {
        this[_zone] = Zone.current;
        this[_state] = _Future._INCOMPLETE;
        this[_resultOrListeners] = null;
        this[_asyncComplete](value);
      }
      _Future$immediateError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        this[_zone] = Zone.current;
        this[_state] = _Future._INCOMPLETE;
        this[_resultOrListeners] = null;
        this[_asyncCompleteError](error, stackTrace);
      }
      get [_mayComplete]() {
        return this[_state] === _Future._INCOMPLETE;
      }
      get [_isChained]() {
        return this[_state] === _Future._CHAINED;
      }
      get [_isComplete]() {
        return dart.notNull(this[_state]) >= dart.notNull(_Future._VALUE);
      }
      get [_hasValue]() {
        return this[_state] === _Future._VALUE;
      }
      get [_hasError]() {
        return this[_state] === _Future._ERROR;
      }
      set [_isChained](value) {
        if (value) {
          dart.assert(!dart.notNull(this[_isComplete]));
          this[_state] = _Future._CHAINED;
        } else {
          dart.assert(this[_isChained]);
          this[_state] = _Future._INCOMPLETE;
        }
      }
      then(f, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let result = new _Future();
        if (!dart.notNull(core.identical(result[_zone], _ROOT_ZONE))) {
          f = result[_zone].registerUnaryCallback(dart.as(f, dart.throw_("Unimplemented type (dynamic) → dynamic")));
          if (onError !== null) {
            onError = _registerErrorHandler(onError, result[_zone]);
          }
        }
        this[_addListener](new _FutureListener.then(result, dart.as(f, _FutureOnValue), onError));
        return result;
      }
      catchError(onError, opt$) {
        let test = opt$.test === void 0 ? null : opt$.test;
        let result = new _Future();
        if (!dart.notNull(core.identical(result[_zone], _ROOT_ZONE))) {
          onError = _registerErrorHandler(onError, result[_zone]);
          if (test !== null)
            test = dart.as(result[_zone].registerUnaryCallback(test), dart.throw_("Unimplemented type (dynamic) → bool"));
        }
        this[_addListener](new _FutureListener.catchError(result, onError, test));
        return result;
      }
      whenComplete(action) {
        let result = new _Future();
        if (!dart.notNull(core.identical(result[_zone], _ROOT_ZONE))) {
          action = result[_zone].registerCallback(action);
        }
        this[_addListener](new _FutureListener.whenComplete(result, action));
        return dart.as(result, Future$(T));
      }
      asStream() {
        return dart.as(new Stream.fromFuture(this), Stream$(T));
      }
      [_markPendingCompletion]() {
        if (!dart.notNull(this[_mayComplete]))
          throw new core.StateError("Future already completed");
        this[_state] = _Future._PENDING_COMPLETE;
      }
      get [_value]() {
        dart.assert(dart.notNull(this[_isComplete]) && dart.notNull(this[_hasValue]));
        return dart.as(this[_resultOrListeners], T);
      }
      get [_error]() {
        dart.assert(dart.notNull(this[_isComplete]) && dart.notNull(this[_hasError]));
        return dart.as(this[_resultOrListeners], AsyncError);
      }
      [_setValue](value) {
        dart.assert(!dart.notNull(this[_isComplete]));
        this[_state] = _Future._VALUE;
        this[_resultOrListeners] = value;
      }
      [_setErrorObject](error) {
        dart.assert(!dart.notNull(this[_isComplete]));
        this[_state] = _Future._ERROR;
        this[_resultOrListeners] = error;
      }
      [_setError](error, stackTrace) {
        this[_setErrorObject](new AsyncError(error, stackTrace));
      }
      [_addListener](listener) {
        dart.assert(listener[_nextListener] === null);
        if (this[_isComplete]) {
          this[_zone].scheduleMicrotask((() => {
            _propagateToListeners(this, listener);
          }).bind(this));
        } else {
          listener[_nextListener] = dart.as(this[_resultOrListeners], _FutureListener);
          this[_resultOrListeners] = listener;
        }
      }
      [_removeListeners]() {
        dart.assert(!dart.notNull(this[_isComplete]));
        let current = dart.as(this[_resultOrListeners], _FutureListener);
        this[_resultOrListeners] = null;
        let prev = null;
        while (current !== null) {
          let next = current[_nextListener];
          current[_nextListener] = prev;
          prev = current;
          current = next;
        }
        return prev;
      }
      static [_chainForeignFuture](source, target) {
        dart.assert(!dart.notNull(target[_isComplete]));
        dart.assert(!dart.is(source, _Future));
        target[_isChained] = true;
        source.then(((value) => {
          dart.assert(target[_isChained]);
          target._completeWithValue(value);
        }).bind(this), {onError: ((error, stackTrace) => {
            if (stackTrace === void 0)
              stackTrace = null;
            dart.assert(target[_isChained]);
            target._completeError(error, dart.as(stackTrace, core.StackTrace));
          }).bind(this)});
      }
      static [_chainCoreFuture](source, target) {
        dart.assert(!dart.notNull(target[_isComplete]));
        dart.assert(dart.is(source, _Future));
        target[_isChained] = true;
        let listener = new _FutureListener.chain(target);
        if (source[_isComplete]) {
          _propagateToListeners(source, listener);
        } else {
          source._addListener(listener);
        }
      }
      [_complete](value) {
        dart.assert(!dart.notNull(this[_isComplete]));
        if (dart.is(value, Future)) {
          if (dart.is(value, _Future)) {
            _chainCoreFuture(dart.as(value, _Future), this);
          } else {
            _chainForeignFuture(dart.as(value, Future), this);
          }
        } else {
          let listeners = this[_removeListeners]();
          this[_setValue](dart.as(value, T));
          _propagateToListeners(this, listeners);
        }
      }
      [_completeWithValue](value) {
        dart.assert(!dart.notNull(this[_isComplete]));
        dart.assert(!dart.is(value, Future));
        let listeners = this[_removeListeners]();
        this[_setValue](dart.as(value, T));
        _propagateToListeners(this, listeners);
      }
      [_completeError](error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        dart.assert(!dart.notNull(this[_isComplete]));
        let listeners = this[_removeListeners]();
        this[_setError](error, stackTrace);
        _propagateToListeners(this, listeners);
      }
      [_asyncComplete](value) {
        dart.assert(!dart.notNull(this[_isComplete]));
        if (value === null) {
        } else if (dart.is(value, Future)) {
          let typedFuture = dart.as(value, Future$(T));
          if (dart.is(typedFuture, _Future)) {
            let coreFuture = dart.as(typedFuture, _Future$(T));
            if (dart.notNull(coreFuture[_isComplete]) && dart.notNull(coreFuture[_hasError])) {
              this[_markPendingCompletion]();
              this[_zone].scheduleMicrotask((() => {
                _chainCoreFuture(coreFuture, this);
              }).bind(this));
            } else {
              _chainCoreFuture(coreFuture, this);
            }
          } else {
            _chainForeignFuture(typedFuture, this);
          }
          return;
        } else {
          let typedValue = dart.as(value, T);
        }
        this[_markPendingCompletion]();
        this[_zone].scheduleMicrotask((() => {
          this[_completeWithValue](value);
        }).bind(this));
      }
      [_asyncCompleteError](error, stackTrace) {
        dart.assert(!dart.notNull(this[_isComplete]));
        this[_markPendingCompletion]();
        this[_zone].scheduleMicrotask((() => {
          this[_completeError](error, stackTrace);
        }).bind(this));
      }
      static [_propagateToListeners](source, listeners) {
        while (true) {
          dart.assert(source[_isComplete]);
          let hasError = source[_hasError];
          if (listeners === null) {
            if (hasError) {
              let asyncError = source[_error];
              source[_zone].handleUncaughtError(asyncError.error, asyncError.stackTrace);
            }
            return;
          }
          while (listeners[_nextListener] !== null) {
            let listener = listeners;
            listeners = listener[_nextListener];
            listener[_nextListener] = null;
            _propagateToListeners(source, listener);
          }
          let listener = listeners;
          let listenerHasValue = true;
          let sourceValue = hasError ? null : source[_value];
          let listenerValueOrError = sourceValue;
          let isPropagationAborted = false;
          if (dart.notNull(hasError) || dart.notNull(listener.handlesValue) || dart.notNull(listener.handlesComplete)) {
            let zone = listener[_zone];
            if (dart.notNull(hasError) && !dart.notNull(source[_zone].inSameErrorZone(zone))) {
              let asyncError = source[_error];
              source[_zone].handleUncaughtError(asyncError.error, asyncError.stackTrace);
              return;
            }
            let oldZone = null;
            if (!dart.notNull(core.identical(Zone.current, zone))) {
              oldZone = Zone._enter(zone);
            }
            // Function handleValueCallback: () → bool
            function handleValueCallback() {
              try {
                listenerValueOrError = zone.runUnary(listener[_onValue], sourceValue);
                return true;
              } catch (e) {
                let s = dart.stackTrace(e);
                listenerValueOrError = new AsyncError(e, s);
                return false;
              }

            }
            // Function handleError: () → void
            function handleError() {
              let asyncError = source[_error];
              let matchesTest = true;
              if (listener.hasErrorTest) {
                let test = listener[_errorTest];
                try {
                  matchesTest = dart.as(zone.runUnary(test, asyncError.error), core.bool);
                } catch (e) {
                  let s = dart.stackTrace(e);
                  listenerValueOrError = core.identical(asyncError.error, e) ? asyncError : new AsyncError(e, s);
                  listenerHasValue = false;
                  return;
                }

              }
              let errorCallback = listener[_onError];
              if (dart.notNull(matchesTest) && dart.notNull(errorCallback !== null)) {
                try {
                  if (dart.is(errorCallback, ZoneBinaryCallback)) {
                    listenerValueOrError = zone.runBinary(errorCallback, asyncError.error, asyncError.stackTrace);
                  } else {
                    listenerValueOrError = zone.runUnary(dart.as(errorCallback, dart.throw_("Unimplemented type (dynamic) → dynamic")), asyncError.error);
                  }
                } catch (e) {
                  let s = dart.stackTrace(e);
                  listenerValueOrError = core.identical(asyncError.error, e) ? asyncError : new AsyncError(e, s);
                  listenerHasValue = false;
                  return;
                }

                listenerHasValue = true;
              } else {
                listenerValueOrError = asyncError;
                listenerHasValue = false;
              }
            }
            // Function handleWhenCompleteCallback: () → void
            function handleWhenCompleteCallback() {
              let completeResult = null;
              try {
                completeResult = zone.run(listener[_whenCompleteAction]);
              } catch (e) {
                let s = dart.stackTrace(e);
                if (dart.notNull(hasError) && dart.notNull(core.identical(source[_error].error, e))) {
                  listenerValueOrError = source[_error];
                } else {
                  listenerValueOrError = new AsyncError(e, s);
                }
                listenerHasValue = false;
                return;
              }

              if (dart.is(completeResult, Future)) {
                let result = listener.result;
                result[_isChained] = true;
                isPropagationAborted = true;
                dart.dinvoke(completeResult, 'then', (ignored) => {
                  _propagateToListeners(source, new _FutureListener.chain(result));
                }, {
                  onError: (error, stackTrace) => {
                    if (stackTrace === void 0)
                      stackTrace = null;
                    if (!dart.is(completeResult, _Future)) {
                      completeResult = new _Future();
                      dart.dinvoke(completeResult, '_setError', error, stackTrace);
                    }
                    _propagateToListeners(dart.as(completeResult, _Future), new _FutureListener.chain(result));
                  }
                });
              }
            }
            if (!dart.notNull(hasError)) {
              if (listener.handlesValue) {
                listenerHasValue = handleValueCallback();
              }
            } else {
              handleError();
            }
            if (listener.handlesComplete) {
              handleWhenCompleteCallback();
            }
            if (oldZone !== null)
              Zone._leave(oldZone);
            if (isPropagationAborted)
              return;
            if (dart.notNull(listenerHasValue) && !dart.notNull(core.identical(sourceValue, listenerValueOrError)) && dart.notNull(dart.is(listenerValueOrError, Future))) {
              let chainSource = dart.as(listenerValueOrError, Future);
              let result = listener.result;
              if (dart.is(chainSource, _Future)) {
                if (chainSource[_isComplete]) {
                  result[_isChained] = true;
                  source = chainSource;
                  listeners = new _FutureListener.chain(result);
                  continue;
                } else {
                  _chainCoreFuture(chainSource, result);
                }
              } else {
                _chainForeignFuture(chainSource, result);
              }
              return;
            }
          }
          let result = listener.result;
          listeners = result._removeListeners();
          if (listenerHasValue) {
            result._setValue(listenerValueOrError);
          } else {
            let asyncError = dart.as(listenerValueOrError, AsyncError);
            result._setErrorObject(asyncError);
          }
          source = result;
        }
      }
      timeout(timeLimit, opt$) {
        let onTimeout = opt$.onTimeout === void 0 ? null : opt$.onTimeout;
        if (this[_isComplete])
          return new _Future.immediate(this);
        let result = new _Future();
        let timer = null;
        if (onTimeout === null) {
          timer = new Timer(timeLimit, (() => {
            result._completeError(new TimeoutException("Future not completed", timeLimit));
          }).bind(this));
        } else {
          let zone = Zone.current;
          onTimeout = zone.registerCallback(onTimeout);
          timer = new Timer(timeLimit, (() => {
            try {
              result._complete(zone.run(onTimeout));
            } catch (e) {
              let s = dart.stackTrace(e);
              result._completeError(e, s);
            }

          }).bind(this));
        }
        this.then(((v) => {
          if (timer.isActive) {
            timer.cancel();
            result._completeWithValue(v);
          }
        }).bind(this), {onError: ((e, s) => {
            if (timer.isActive) {
              timer.cancel();
              result._completeError(e, dart.as(s, core.StackTrace));
            }
          }).bind(this)});
        return result;
      }
    }
    dart.defineNamedConstructor(_Future, 'immediate');
    dart.defineNamedConstructor(_Future, 'immediateError');
    _Future._INCOMPLETE = 0;
    _Future._PENDING_COMPLETE = 1;
    _Future._CHAINED = 2;
    _Future._VALUE = 4;
    _Future._ERROR = 8;
    return _Future;
  });
  let _Future = _Future$(dart.dynamic);
  class _AsyncCallbackEntry extends core.Object {
    _AsyncCallbackEntry(callback) {
      this.callback = callback;
      this.next = null;
    }
  }
  exports._nextCallback = null;
  exports._lastCallback = null;
  exports._lastPriorityCallback = null;
  exports._isInCallbackLoop = false;
  // Function _asyncRunCallbackLoop: () → void
  function _asyncRunCallbackLoop() {
    while (exports._nextCallback !== null) {
      exports._lastPriorityCallback = null;
      let entry = exports._nextCallback;
      exports._nextCallback = entry.next;
      if (exports._nextCallback === null)
        exports._lastCallback = null;
      entry.callback();
    }
  }
  // Function _asyncRunCallback: () → void
  function _asyncRunCallback() {
    exports._isInCallbackLoop = true;
    try {
      _asyncRunCallbackLoop();
    } finally {
      exports._lastPriorityCallback = null;
      exports._isInCallbackLoop = false;
      if (exports._nextCallback !== null)
        _AsyncRun._scheduleImmediate(_asyncRunCallback);
    }
  }
  // Function _scheduleAsyncCallback: (dynamic) → void
  function _scheduleAsyncCallback(callback) {
    if (exports._nextCallback === null) {
      exports._nextCallback = exports._lastCallback = new _AsyncCallbackEntry(dart.as(callback, _AsyncCallback));
      if (!dart.notNull(exports._isInCallbackLoop)) {
        _AsyncRun._scheduleImmediate(_asyncRunCallback);
      }
    } else {
      let newEntry = new _AsyncCallbackEntry(dart.as(callback, _AsyncCallback));
      exports._lastCallback.next = newEntry;
      exports._lastCallback = newEntry;
    }
  }
  // Function _schedulePriorityAsyncCallback: (dynamic) → void
  function _schedulePriorityAsyncCallback(callback) {
    let entry = new _AsyncCallbackEntry(dart.as(callback, _AsyncCallback));
    if (exports._nextCallback === null) {
      _scheduleAsyncCallback(callback);
      exports._lastPriorityCallback = exports._lastCallback;
    } else if (exports._lastPriorityCallback === null) {
      entry.next = exports._nextCallback;
      exports._nextCallback = exports._lastPriorityCallback = entry;
    } else {
      entry.next = exports._lastPriorityCallback.next;
      exports._lastPriorityCallback.next = entry;
      exports._lastPriorityCallback = entry;
      if (entry.next === null) {
        exports._lastCallback = entry;
      }
    }
  }
  // Function scheduleMicrotask: (() → void) → void
  function scheduleMicrotask(callback) {
    if (core.identical(_ROOT_ZONE, Zone.current)) {
      _rootScheduleMicrotask(null, null, dart.as(_ROOT_ZONE, Zone), callback);
      return;
    }
    Zone.current.scheduleMicrotask(Zone.current.bindCallback(callback, {runGuarded: true}));
  }
  let _scheduleImmediate = Symbol('_scheduleImmediate');
  let _initializeScheduleImmediate = Symbol('_initializeScheduleImmediate');
  let _scheduleImmediateJsOverride = Symbol('_scheduleImmediateJsOverride');
  let _scheduleImmediateWithSetImmediate = Symbol('_scheduleImmediateWithSetImmediate');
  let _scheduleImmediateWithTimer = Symbol('_scheduleImmediateWithTimer');
  class _AsyncRun extends core.Object {
    static [_scheduleImmediate](callback) {
      dart.dinvokef(scheduleImmediateClosure, callback);
    }
    static [_initializeScheduleImmediate]() {
      _js_helper.requiresPreamble();
      if (self.scheduleImmediate !== null) {
        return _scheduleImmediateJsOverride;
      }
      if (dart.notNull(self.MutationObserver !== null) && dart.notNull(self.document !== null)) {
        let div = self.document.createElement("div");
        let span = self.document.createElement("span");
        let storedCallback = null;
        // Function internalCallback: (dynamic) → dynamic
        function internalCallback(_) {
          _isolate_helper.leaveJsAsync();
          let f = storedCallback;
          storedCallback = null;
          dart.dinvokef(f);
        }
        ;
        let observer = new self.MutationObserver(_js_helper.convertDartClosureToJS(internalCallback, 1));
        observer.observe(div, {childList: true});
        return (callback) => {
          dart.assert(storedCallback === null);
          _isolate_helper.enterJsAsync();
          storedCallback = callback;
          div.firstChild ? div.removeChild(span) : div.appendChild(span);
        };
      } else if (self.setImmediate !== null) {
        return _scheduleImmediateWithSetImmediate;
      }
      return _scheduleImmediateWithTimer;
    }
    static [_scheduleImmediateJsOverride](callback) {
      // Function internalCallback: () → dynamic
      function internalCallback() {
        _isolate_helper.leaveJsAsync();
        callback();
      }
      ;
      _isolate_helper.enterJsAsync();
      self.scheduleImmediate(_js_helper.convertDartClosureToJS(internalCallback, 0));
    }
    static [_scheduleImmediateWithSetImmediate](callback) {
      // Function internalCallback: () → dynamic
      function internalCallback() {
        _isolate_helper.leaveJsAsync();
        callback();
      }
      ;
      _isolate_helper.enterJsAsync();
      self.setImmediate(_js_helper.convertDartClosureToJS(internalCallback, 0));
    }
    static [_scheduleImmediateWithTimer](callback) {
      Timer._createTimer(core.Duration.ZERO, callback);
    }
  }
  dart.defineLazyProperties(_AsyncRun, {
    get scheduleImmediateClosure() {
      return _initializeScheduleImmediate();
    }
  });
  let _sink = Symbol('_sink');
  let Stream$ = dart.generic(function(T) {
    class Stream extends core.Object {
      Stream() {
      }
      Stream$fromFuture(future) {
        let controller = dart.as(new StreamController({sync: true}), _StreamController$(T));
        future.then(((value) => {
          controller._add(dart.as(value, T));
          controller._closeUnchecked();
        }).bind(this), {onError: ((error, stackTrace) => {
            controller._addError(error, dart.as(stackTrace, core.StackTrace));
            controller._closeUnchecked();
          }).bind(this)});
        return controller.stream;
      }
      Stream$fromIterable(data) {
        return new _GeneratedStreamImpl(() => new _IterablePendingEvents(data));
      }
      Stream$periodic(period, computation) {
        if (computation === void 0)
          computation = null;
        if (computation === null)
          computation = (i) => null;
        let timer = null;
        let computationCount = 0;
        let controller = null;
        let watch = new core.Stopwatch();
        // Function sendEvent: () → void
        function sendEvent() {
          watch.reset();
          let data = computation((($tmp) => computationCount = dart.notNull($tmp) + 1, $tmp)(computationCount));
          controller.add(data);
        }
        // Function startPeriodicTimer: () → void
        function startPeriodicTimer() {
          dart.assert(timer === null);
          timer = new Timer.periodic(period, (timer) => {
            sendEvent();
          });
        }
        controller = new StreamController({sync: true, onListen: (() => {
            watch.start();
            startPeriodicTimer();
          }).bind(this), onPause: (() => {
            timer.cancel();
            timer = null;
            watch.stop();
          }).bind(this), onResume: (() => {
            dart.assert(timer === null);
            let elapsed = watch.elapsed;
            watch.start();
            timer = new Timer(period['-'](elapsed), () => {
              timer = null;
              startPeriodicTimer();
              sendEvent();
            });
          }).bind(this), onCancel: (() => {
            if (timer !== null)
              timer.cancel();
            timer = null;
          }).bind(this)});
        return controller.stream;
      }
      Stream$eventTransformed(source, mapSink) {
        return dart.as(new _BoundSinkStream(source, dart.as(mapSink, _SinkMapper)), Stream$(T));
      }
      get isBroadcast() {
        return false;
      }
      asBroadcastStream(opt$) {
        let onListen = opt$.onListen === void 0 ? null : opt$.onListen;
        let onCancel = opt$.onCancel === void 0 ? null : opt$.onCancel;
        return new _AsBroadcastStream(this, dart.as(onListen, dart.throw_("Unimplemented type (StreamSubscription<dynamic>) → void")), dart.as(onCancel, dart.throw_("Unimplemented type (StreamSubscription<dynamic>) → void")));
      }
      where(test) {
        return new _WhereStream(this, test);
      }
      map(convert) {
        return new _MapStream(this, convert);
      }
      asyncMap(convert) {
        let controller = null;
        let subscription = null;
        // Function onListen: () → void
        function onListen() {
          let add = controller.add;
          dart.assert(dart.notNull(dart.is(controller, _StreamController)) || dart.notNull(dart.is(controller, _BroadcastStreamController)));
          let eventSink = controller;
          let addError = eventSink[_addError];
          subscription = this.listen(((event) => {
            let newValue = null;
            try {
              newValue = convert(event);
            } catch (e) {
              let s = dart.stackTrace(e);
              controller.addError(e, s);
              return;
            }

            if (dart.is(newValue, Future)) {
              subscription.pause();
              dart.dinvoke(dart.dinvoke(newValue, 'then', add, {onError: addError}), 'whenComplete', subscription.resume);
            } else {
              controller.add(newValue);
            }
          }).bind(this), {onError: dart.as(addError, core.Function), onDone: controller.close});
        }
        if (this.isBroadcast) {
          controller = new StreamController.broadcast({onListen: onListen, onCancel: (() => {
              subscription.cancel();
            }).bind(this), sync: true});
        } else {
          controller = new StreamController({onListen: onListen, onPause: (() => {
              subscription.pause();
            }).bind(this), onResume: (() => {
              subscription.resume();
            }).bind(this), onCancel: (() => {
              subscription.cancel();
            }).bind(this), sync: true});
        }
        return controller.stream;
      }
      asyncExpand(convert) {
        let controller = null;
        let subscription = null;
        // Function onListen: () → void
        function onListen() {
          dart.assert(dart.notNull(dart.is(controller, _StreamController)) || dart.notNull(dart.is(controller, _BroadcastStreamController)));
          let eventSink = controller;
          subscription = this.listen(((event) => {
            let newStream = null;
            try {
              newStream = convert(event);
            } catch (e) {
              let s = dart.stackTrace(e);
              controller.addError(e, s);
              return;
            }

            if (newStream !== null) {
              subscription.pause();
              controller.addStream(newStream).whenComplete(subscription.resume);
            }
          }).bind(this), {onError: dart.as(eventSink[_addError], core.Function), onDone: controller.close});
        }
        if (this.isBroadcast) {
          controller = new StreamController.broadcast({onListen: onListen, onCancel: (() => {
              subscription.cancel();
            }).bind(this), sync: true});
        } else {
          controller = new StreamController({onListen: onListen, onPause: (() => {
              subscription.pause();
            }).bind(this), onResume: (() => {
              subscription.resume();
            }).bind(this), onCancel: (() => {
              subscription.cancel();
            }).bind(this), sync: true});
        }
        return controller.stream;
      }
      handleError(onError, opt$) {
        let test = opt$.test === void 0 ? null : opt$.test;
        return new _HandleErrorStream(this, onError, test);
      }
      expand(convert) {
        return new _ExpandStream(this, convert);
      }
      pipe(streamConsumer) {
        return streamConsumer.addStream(this).then(((_) => streamConsumer.close()).bind(this));
      }
      transform(streamTransformer) {
        return streamTransformer.bind(this);
      }
      reduce(combine) {
        let result = new _Future();
        let seenFirst = false;
        let value = null;
        let subscription = null;
        subscription = this.listen((element) => {
          if (seenFirst) {
            _runUserCode(() => combine(value, element), dart.as((newValue) => {
              value = newValue;
            }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, result), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
          } else {
            value = element;
            seenFirst = true;
          }
        }, {onError: result[_completeError], onDone: (() => {
            if (!dart.notNull(seenFirst)) {
              try {
                throw _internal.IterableElementError.noElement();
              } catch (e) {
                let s = dart.stackTrace(e);
                _completeWithErrorCallback(result, e, s);
              }

            } else {
              result._complete(value);
            }
          }).bind(this), cancelOnError: true});
        return result;
      }
      fold(initialValue, combine) {
        let result = new _Future();
        let value = initialValue;
        let subscription = null;
        subscription = this.listen((element) => {
          _runUserCode(() => combine(value, element), (newValue) => {
            value = newValue;
          }, dart.as(_cancelAndErrorClosure(subscription, result), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: ((e, st) => {
            result._completeError(e, dart.as(st, core.StackTrace));
          }).bind(this), onDone: (() => {
            result._complete(value);
          }).bind(this), cancelOnError: true});
        return result;
      }
      join(separator) {
        if (separator === void 0)
          separator = "";
        let result = new _Future();
        let buffer = new core.StringBuffer();
        let subscription = null;
        let first = true;
        subscription = this.listen(((element) => {
          if (!dart.notNull(first)) {
            buffer.write(separator);
          }
          first = false;
          try {
            buffer.write(element);
          } catch (e) {
            let s = dart.stackTrace(e);
            _cancelAndErrorWithReplacement(subscription, result, e, s);
          }

        }).bind(this), {onError: ((e) => {
            result._completeError(e);
          }).bind(this), onDone: (() => {
            result._complete(buffer.toString());
          }).bind(this), cancelOnError: true});
        return result;
      }
      contains(needle) {
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((element) => {
          _runUserCode(() => dart.equals(element, needle), dart.as((isMatch) => {
            if (isMatch) {
              _cancelAndValue(subscription, future, true);
            }
          }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            future._complete(false);
          }).bind(this), cancelOnError: true});
        return future;
      }
      forEach(action) {
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((element) => {
          _runUserCode(() => action(element), (_) => {
          }, dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            future._complete(null);
          }).bind(this), cancelOnError: true});
        return future;
      }
      every(test) {
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((element) => {
          _runUserCode(() => test(element), dart.as((isMatch) => {
            if (!dart.notNull(isMatch)) {
              _cancelAndValue(subscription, future, false);
            }
          }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            future._complete(true);
          }).bind(this), cancelOnError: true});
        return future;
      }
      any(test) {
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((element) => {
          _runUserCode(() => test(element), dart.as((isMatch) => {
            if (isMatch) {
              _cancelAndValue(subscription, future, true);
            }
          }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            future._complete(false);
          }).bind(this), cancelOnError: true});
        return future;
      }
      get length() {
        let future = new _Future();
        let count = 0;
        this.listen((_) => {
          count = dart.notNull(count) + 1;
        }, {onError: future[_completeError], onDone: (() => {
            future._complete(count);
          }).bind(this), cancelOnError: true});
        return future;
      }
      get isEmpty() {
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((_) => {
          _cancelAndValue(subscription, future, false);
        }, {onError: future[_completeError], onDone: (() => {
            future._complete(true);
          }).bind(this), cancelOnError: true});
        return future;
      }
      toList() {
        let result = new List.from([]);
        let future = new _Future();
        this.listen(((data) => {
          result.add(data);
        }).bind(this), {onError: future[_completeError], onDone: (() => {
            future._complete(result);
          }).bind(this), cancelOnError: true});
        return future;
      }
      toSet() {
        let result = new core.Set();
        let future = new _Future();
        this.listen(((data) => {
          result.add(data);
        }).bind(this), {onError: future[_completeError], onDone: (() => {
            future._complete(result);
          }).bind(this), cancelOnError: true});
        return future;
      }
      drain(futureValue) {
        if (futureValue === void 0)
          futureValue = null;
        return this.listen(null, {cancelOnError: true}).asFuture(futureValue);
      }
      take(count) {
        return dart.as(new _TakeStream(this, count), Stream$(T));
      }
      takeWhile(test) {
        return dart.as(new _TakeWhileStream(this, dart.as(test, dart.throw_("Unimplemented type (dynamic) → bool"))), Stream$(T));
      }
      skip(count) {
        return dart.as(new _SkipStream(this, count), Stream$(T));
      }
      skipWhile(test) {
        return dart.as(new _SkipWhileStream(this, dart.as(test, dart.throw_("Unimplemented type (dynamic) → bool"))), Stream$(T));
      }
      distinct(equals) {
        if (equals === void 0)
          equals = null;
        return dart.as(new _DistinctStream(this, dart.as(equals, dart.throw_("Unimplemented type (dynamic, dynamic) → bool"))), Stream$(T));
      }
      get first() {
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((value) => {
          _cancelAndValue(subscription, future, value);
        }, {
          onError: future[_completeError],
          onDone: () => {
            try {
              throw _internal.IterableElementError.noElement();
            } catch (e) {
              let s = dart.stackTrace(e);
              _completeWithErrorCallback(future, e, s);
            }

          },
          cancelOnError: true
        });
        return future;
      }
      get last() {
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription = null;
        subscription = this.listen((value) => {
          foundResult = true;
          result = value;
        }, {onError: future[_completeError], onDone: (() => {
            if (foundResult) {
              future._complete(result);
              return;
            }
            try {
              throw _internal.IterableElementError.noElement();
            } catch (e) {
              let s = dart.stackTrace(e);
              _completeWithErrorCallback(future, e, s);
            }

          }).bind(this), cancelOnError: true});
        return future;
      }
      get single() {
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription = null;
        subscription = this.listen((value) => {
          if (foundResult) {
            try {
              throw _internal.IterableElementError.tooMany();
            } catch (e) {
              let s = dart.stackTrace(e);
              _cancelAndErrorWithReplacement(subscription, future, e, s);
            }

            return;
          }
          foundResult = true;
          result = value;
        }, {onError: future[_completeError], onDone: (() => {
            if (foundResult) {
              future._complete(result);
              return;
            }
            try {
              throw _internal.IterableElementError.noElement();
            } catch (e) {
              let s = dart.stackTrace(e);
              _completeWithErrorCallback(future, e, s);
            }

          }).bind(this), cancelOnError: true});
        return future;
      }
      firstWhere(test, opt$) {
        let defaultValue = opt$.defaultValue === void 0 ? null : opt$.defaultValue;
        let future = new _Future();
        let subscription = null;
        subscription = this.listen((value) => {
          _runUserCode(() => test(value), dart.as((isMatch) => {
            if (isMatch) {
              _cancelAndValue(subscription, future, value);
            }
          }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            if (defaultValue !== null) {
              _runUserCode(defaultValue, future[_complete], future[_completeError]);
              return;
            }
            try {
              throw _internal.IterableElementError.noElement();
            } catch (e) {
              let s = dart.stackTrace(e);
              _completeWithErrorCallback(future, e, s);
            }

          }).bind(this), cancelOnError: true});
        return future;
      }
      lastWhere(test, opt$) {
        let defaultValue = opt$.defaultValue === void 0 ? null : opt$.defaultValue;
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription = null;
        subscription = this.listen((value) => {
          _runUserCode(() => true === test(value), dart.as((isMatch) => {
            if (isMatch) {
              foundResult = true;
              result = value;
            }
          }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            if (foundResult) {
              future._complete(result);
              return;
            }
            if (defaultValue !== null) {
              _runUserCode(defaultValue, future[_complete], future[_completeError]);
              return;
            }
            try {
              throw _internal.IterableElementError.noElement();
            } catch (e) {
              let s = dart.stackTrace(e);
              _completeWithErrorCallback(future, e, s);
            }

          }).bind(this), cancelOnError: true});
        return future;
      }
      singleWhere(test) {
        let future = new _Future();
        let result = null;
        let foundResult = false;
        let subscription = null;
        subscription = this.listen((value) => {
          _runUserCode(() => true === test(value), dart.as((isMatch) => {
            if (isMatch) {
              if (foundResult) {
                try {
                  throw _internal.IterableElementError.tooMany();
                } catch (e) {
                  let s = dart.stackTrace(e);
                  _cancelAndErrorWithReplacement(subscription, future, e, s);
                }

                return;
              }
              foundResult = true;
              result = value;
            }
          }, dart.throw_("Unimplemented type (dynamic) → dynamic")), dart.as(_cancelAndErrorClosure(subscription, future), dart.throw_("Unimplemented type (dynamic, StackTrace) → dynamic")));
        }, {onError: future[_completeError], onDone: (() => {
            if (foundResult) {
              future._complete(result);
              return;
            }
            try {
              throw _internal.IterableElementError.noElement();
            } catch (e) {
              let s = dart.stackTrace(e);
              _completeWithErrorCallback(future, e, s);
            }

          }).bind(this), cancelOnError: true});
        return future;
      }
      elementAt(index) {
        if (dart.notNull(!(typeof index == number)) || dart.notNull(index) < 0)
          throw new core.ArgumentError(index);
        let future = new _Future();
        let subscription = null;
        let elementIndex = 0;
        subscription = this.listen((value) => {
          if (index === elementIndex) {
            _cancelAndValue(subscription, future, value);
            return;
          }
          elementIndex = 1;
        }, {onError: future[_completeError], onDone: (() => {
            future._completeError(new core.RangeError.index(index, this, "index", null, elementIndex));
          }).bind(this), cancelOnError: true});
        return future;
      }
      timeout(timeLimit, opt$) {
        let onTimeout = opt$.onTimeout === void 0 ? null : opt$.onTimeout;
        let controller = null;
        let subscription = null;
        let timer = null;
        let zone = null;
        let timeout = null;
        // Function onData: (T) → void
        function onData(event) {
          timer.cancel();
          controller.add(event);
          timer = zone.createTimer(timeLimit, dart.as(timeout, dart.throw_("Unimplemented type () → void")));
        }
        // Function onError: (dynamic, StackTrace) → void
        function onError(error, stackTrace) {
          timer.cancel();
          dart.assert(dart.notNull(dart.is(controller, _StreamController)) || dart.notNull(dart.is(controller, _BroadcastStreamController)));
          let eventSink = controller;
          dart.dinvoke(eventSink, '_addError', error, stackTrace);
          timer = zone.createTimer(timeLimit, dart.as(timeout, dart.throw_("Unimplemented type () → void")));
        }
        // Function onDone: () → void
        function onDone() {
          timer.cancel();
          controller.close();
        }
        // Function onListen: () → void
        function onListen() {
          zone = Zone.current;
          if (onTimeout === null) {
            timeout = (() => {
              controller.addError(new TimeoutException("No stream event", timeLimit), null);
            }).bind(this);
          } else {
            onTimeout = zone.registerUnaryCallback(dart.as(onTimeout, dart.throw_("Unimplemented type (dynamic) → dynamic")));
            let wrapper = new _ControllerEventSinkWrapper(null);
            timeout = (() => {
              wrapper[_sink] = controller;
              zone.runUnaryGuarded(dart.as(onTimeout, dart.throw_("Unimplemented type (dynamic) → dynamic")), wrapper);
              wrapper[_sink] = null;
            }).bind(this);
          }
          subscription = this.listen(onData, {onError: onError, onDone: onDone});
          timer = zone.createTimer(timeLimit, dart.as(timeout, dart.throw_("Unimplemented type () → void")));
        }
        // Function onCancel: () → Future<dynamic>
        function onCancel() {
          timer.cancel();
          let result = subscription.cancel();
          subscription = null;
          return result;
        }
        controller = this.isBroadcast ? new _SyncBroadcastStreamController(onListen, onCancel) : new _SyncStreamController(onListen, (() => {
          timer.cancel();
          subscription.pause();
        }).bind(this), (() => {
          subscription.resume();
          timer = zone.createTimer(timeLimit, dart.as(timeout, dart.throw_("Unimplemented type () → void")));
        }).bind(this), onCancel);
        return controller.stream;
      }
    }
    dart.defineNamedConstructor(Stream, 'fromFuture');
    dart.defineNamedConstructor(Stream, 'fromIterable');
    dart.defineNamedConstructor(Stream, 'periodic');
    dart.defineNamedConstructor(Stream, 'eventTransformed');
    return Stream;
  });
  let Stream = Stream$(dart.dynamic);
  let StreamSubscription$ = dart.generic(function(T) {
    class StreamSubscription extends core.Object {
    }
    return StreamSubscription;
  });
  let StreamSubscription = StreamSubscription$(dart.dynamic);
  let EventSink$ = dart.generic(function(T) {
    class EventSink extends core.Object {
    }
    return EventSink;
  });
  let EventSink = EventSink$(dart.dynamic);
  let _stream = Symbol('_stream');
  let StreamView$ = dart.generic(function(T) {
    class StreamView extends Stream$(T) {
      StreamView($_stream) {
        this[_stream] = $_stream;
        super.Stream();
      }
      get isBroadcast() {
        return this[_stream].isBroadcast;
      }
      asBroadcastStream(opt$) {
        let onListen = opt$.onListen === void 0 ? null : opt$.onListen;
        let onCancel = opt$.onCancel === void 0 ? null : opt$.onCancel;
        return this[_stream].asBroadcastStream({onListen: onListen, onCancel: onCancel});
      }
      listen(onData, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let onDone = opt$.onDone === void 0 ? null : opt$.onDone;
        let cancelOnError = opt$.cancelOnError === void 0 ? null : opt$.cancelOnError;
        return this[_stream].listen(onData, {onError: onError, onDone: onDone, cancelOnError: cancelOnError});
      }
    }
    return StreamView;
  });
  let StreamView = StreamView$(dart.dynamic);
  let StreamConsumer$ = dart.generic(function(S) {
    class StreamConsumer extends core.Object {
    }
    return StreamConsumer;
  });
  let StreamConsumer = StreamConsumer$(dart.dynamic);
  let StreamSink$ = dart.generic(function(S) {
    class StreamSink extends core.Object {
    }
    return StreamSink;
  });
  let StreamSink = StreamSink$(dart.dynamic);
  let StreamTransformer$ = dart.generic(function(S, T) {
    class StreamTransformer extends core.Object {
      StreamTransformer(transformer) {
        return new _StreamSubscriptionTransformer(transformer);
      }
      StreamTransformer$fromHandlers(opt$) {
        return new _StreamHandlerTransformer(opt$);
      }
    }
    dart.defineNamedConstructor(StreamTransformer, 'fromHandlers');
    return StreamTransformer;
  });
  let StreamTransformer = StreamTransformer$(dart.dynamic, dart.dynamic);
  let StreamIterator$ = dart.generic(function(T) {
    class StreamIterator extends core.Object {
      StreamIterator(stream) {
        return new _StreamIteratorImpl(stream);
      }
    }
    return StreamIterator;
  });
  let StreamIterator = StreamIterator$(dart.dynamic);
  let _ControllerEventSinkWrapper$ = dart.generic(function(T) {
    class _ControllerEventSinkWrapper extends core.Object {
      _ControllerEventSinkWrapper($_sink) {
        this[_sink] = $_sink;
      }
      add(data) {
        this[_sink].add(data);
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        this[_sink].addError(error, stackTrace);
      }
      close() {
        this[_sink].close();
      }
    }
    return _ControllerEventSinkWrapper;
  });
  let _ControllerEventSinkWrapper = _ControllerEventSinkWrapper$(dart.dynamic);
  let StreamController$ = dart.generic(function(T) {
    class StreamController extends core.Object {
      StreamController(opt$) {
        let onListen = opt$.onListen === void 0 ? null : opt$.onListen;
        let onPause = opt$.onPause === void 0 ? null : opt$.onPause;
        let onResume = opt$.onResume === void 0 ? null : opt$.onResume;
        let onCancel = opt$.onCancel === void 0 ? null : opt$.onCancel;
        let sync = opt$.sync === void 0 ? false : opt$.sync;
        if (dart.notNull(onListen === null) && dart.notNull(onPause === null) && dart.notNull(onResume === null) && dart.notNull(onCancel === null)) {
          return dart.as(sync ? new _NoCallbackSyncStreamController() : new _NoCallbackAsyncStreamController(), StreamController$(T));
        }
        return sync ? new _SyncStreamController(onListen, onPause, onResume, onCancel) : new _AsyncStreamController(onListen, onPause, onResume, onCancel);
      }
      StreamController$broadcast(opt$) {
        let onListen = opt$.onListen === void 0 ? null : opt$.onListen;
        let onCancel = opt$.onCancel === void 0 ? null : opt$.onCancel;
        let sync = opt$.sync === void 0 ? false : opt$.sync;
        return sync ? new _SyncBroadcastStreamController(onListen, onCancel) : new _AsyncBroadcastStreamController(onListen, onCancel);
      }
    }
    dart.defineNamedConstructor(StreamController, 'broadcast');
    return StreamController;
  });
  let StreamController = StreamController$(dart.dynamic);
  let _StreamControllerLifecycle$ = dart.generic(function(T) {
    class _StreamControllerLifecycle extends core.Object {
      [_recordPause](subscription) {}
      [_recordResume](subscription) {}
      [_recordCancel](subscription) {
        return null;
      }
    }
    return _StreamControllerLifecycle;
  });
  let _StreamControllerLifecycle = _StreamControllerLifecycle$(dart.dynamic);
  let _varData = Symbol('_varData');
  let _isCanceled = Symbol('_isCanceled');
  let _isInitialState = Symbol('_isInitialState');
  let _subscription = Symbol('_subscription');
  let _isInputPaused = Symbol('_isInputPaused');
  let _pendingEvents = Symbol('_pendingEvents');
  let _ensurePendingEvents = Symbol('_ensurePendingEvents');
  let _badEventState = Symbol('_badEventState');
  let _nullFuture = Symbol('_nullFuture');
  let _closeUnchecked = Symbol('_closeUnchecked');
  let _StreamController$ = dart.generic(function(T) {
    class _StreamController extends core.Object {
      _StreamController() {
        this[_varData] = null;
        this[_state] = _StreamController._STATE_INITIAL;
        this[_doneFuture] = null;
      }
      get stream() {
        return dart.as(new _ControllerStream(this), Stream$(T));
      }
      get sink() {
        return new _StreamSinkWrapper(this);
      }
      get [_isCanceled]() {
        return (dart.notNull(this[_state]) & dart.notNull(_StreamController._STATE_CANCELED)) !== 0;
      }
      get hasListener() {
        return (dart.notNull(this[_state]) & dart.notNull(_StreamController._STATE_SUBSCRIBED)) !== 0;
      }
      get [_isInitialState]() {
        return (dart.notNull(this[_state]) & dart.notNull(_StreamController._STATE_SUBSCRIPTION_MASK)) === _StreamController._STATE_INITIAL;
      }
      get isClosed() {
        return (dart.notNull(this[_state]) & dart.notNull(_StreamController._STATE_CLOSED)) !== 0;
      }
      get isPaused() {
        return this.hasListener ? this[_subscription][_isInputPaused] : !dart.notNull(this[_isCanceled]);
      }
      get [_isAddingStream]() {
        return (dart.notNull(this[_state]) & dart.notNull(_StreamController._STATE_ADDSTREAM)) !== 0;
      }
      get [_mayAddEvent]() {
        return dart.notNull(this[_state]) < dart.notNull(_StreamController._STATE_CLOSED);
      }
      get [_pendingEvents]() {
        dart.assert(this[_isInitialState]);
        if (!dart.notNull(this[_isAddingStream])) {
          return dart.as(this[_varData], _PendingEvents);
        }
        let state = dart.as(this[_varData], _StreamControllerAddStreamState);
        return dart.as(state.varData, _PendingEvents);
      }
      [_ensurePendingEvents]() {
        dart.assert(this[_isInitialState]);
        if (!dart.notNull(this[_isAddingStream])) {
          if (this[_varData] === null)
            this[_varData] = new _StreamImplEvents();
          return dart.as(this[_varData], _StreamImplEvents);
        }
        let state = dart.as(this[_varData], _StreamControllerAddStreamState);
        if (state.varData === null)
          state.varData = new _StreamImplEvents();
        return dart.as(state.varData, _StreamImplEvents);
      }
      get [_subscription]() {
        dart.assert(this.hasListener);
        if (this[_isAddingStream]) {
          let addState = dart.as(this[_varData], _StreamControllerAddStreamState);
          return dart.as(addState.varData, _ControllerSubscription);
        }
        return dart.as(this[_varData], _ControllerSubscription);
      }
      [_badEventState]() {
        if (this.isClosed) {
          return new core.StateError("Cannot add event after closing");
        }
        dart.assert(this[_isAddingStream]);
        return new core.StateError("Cannot add event while adding a stream");
      }
      addStream(source, opt$) {
        let cancelOnError = opt$.cancelOnError === void 0 ? true : opt$.cancelOnError;
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_badEventState]();
        if (this[_isCanceled])
          return new _Future.immediate(null);
        let addState = new _StreamControllerAddStreamState(this, this[_varData], source, cancelOnError);
        this[_varData] = addState;
        this[_state] = _StreamController._STATE_ADDSTREAM;
        return addState.addStreamFuture;
      }
      get done() {
        return this[_ensureDoneFuture]();
      }
      [_ensureDoneFuture]() {
        if (this[_doneFuture] === null) {
          this[_doneFuture] = this[_isCanceled] ? Future[_nullFuture] : new _Future();
        }
        return this[_doneFuture];
      }
      add(value) {
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_badEventState]();
        this[_add](value);
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        error = _nonNullError(error);
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_badEventState]();
        let replacement = Zone.current.errorCallback(error, stackTrace);
        if (replacement !== null) {
          error = _nonNullError(replacement.error);
          stackTrace = replacement.stackTrace;
        }
        this[_addError](error, stackTrace);
      }
      close() {
        if (this.isClosed) {
          return this[_ensureDoneFuture]();
        }
        if (!dart.notNull(this[_mayAddEvent]))
          throw this[_badEventState]();
        this[_closeUnchecked]();
        return this[_ensureDoneFuture]();
      }
      [_closeUnchecked]() {
        this[_state] = _StreamController._STATE_CLOSED;
        if (this.hasListener) {
          this[_sendDone]();
        } else if (this[_isInitialState]) {
          this[_ensurePendingEvents]().add(new _DelayedDone());
        }
      }
      [_add](value) {
        if (this.hasListener) {
          this[_sendData](value);
        } else if (this[_isInitialState]) {
          this[_ensurePendingEvents]().add(new _DelayedData(value));
        }
      }
      [_addError](error, stackTrace) {
        if (this.hasListener) {
          this[_sendError](error, stackTrace);
        } else if (this[_isInitialState]) {
          this[_ensurePendingEvents]().add(new _DelayedError(error, stackTrace));
        }
      }
      [_close]() {
        dart.assert(this[_isAddingStream]);
        let addState = dart.as(this[_varData], _StreamControllerAddStreamState);
        this[_varData] = addState.varData;
        this[_state] = ~dart.notNull(_StreamController._STATE_ADDSTREAM);
        addState.complete();
      }
      [_subscribe](onData, onError, onDone, cancelOnError) {
        if (!dart.notNull(this[_isInitialState])) {
          throw new core.StateError("Stream has already been listened to.");
        }
        let subscription = new _ControllerSubscription(this, dart.as(onData, dart.throw_("Unimplemented type (dynamic) → void")), onError, onDone, cancelOnError);
        let pendingEvents = this[_pendingEvents];
        this[_state] = _StreamController._STATE_SUBSCRIBED;
        if (this[_isAddingStream]) {
          let addState = dart.as(this[_varData], _StreamControllerAddStreamState);
          addState.varData = subscription;
          addState.resume();
        } else {
          this[_varData] = subscription;
        }
        subscription._setPendingEvents(pendingEvents);
        subscription._guardCallback((() => {
          _runGuarded(this[_onListen]);
        }).bind(this));
        return dart.as(subscription, StreamSubscription$(T));
      }
      [_recordCancel](subscription) {
        let result = null;
        if (this[_isAddingStream]) {
          let addState = dart.as(this[_varData], _StreamControllerAddStreamState);
          result = addState.cancel();
        }
        this[_varData] = null;
        this[_state] = dart.notNull(this[_state]) & ~(dart.notNull(_StreamController._STATE_SUBSCRIBED) | dart.notNull(_StreamController._STATE_ADDSTREAM)) | dart.notNull(_StreamController._STATE_CANCELED);
        if (this[_onCancel] !== null) {
          if (result === null) {
            try {
              result = dart.as(this[_onCancel](), Future);
            } catch (e) {
              let s = dart.stackTrace(e);
              result = ((_) => {
                _._asyncCompleteError(e, s);
                return _;
              }).bind(this)(new _Future());
            }

          } else {
            result = result.whenComplete(this[_onCancel]);
          }
        }
        // Function complete: () → void
        function complete() {
          if (dart.notNull(this[_doneFuture] !== null) && dart.notNull(this[_doneFuture][_mayComplete])) {
            this[_doneFuture]._asyncComplete(null);
          }
        }
        if (result !== null) {
          result = result.whenComplete(complete);
        } else {
          complete();
        }
        return result;
      }
      [_recordPause](subscription) {
        if (this[_isAddingStream]) {
          let addState = dart.as(this[_varData], _StreamControllerAddStreamState);
          addState.pause();
        }
        _runGuarded(this[_onPause]);
      }
      [_recordResume](subscription) {
        if (this[_isAddingStream]) {
          let addState = dart.as(this[_varData], _StreamControllerAddStreamState);
          addState.resume();
        }
        _runGuarded(this[_onResume]);
      }
    }
    _StreamController._STATE_INITIAL = 0;
    _StreamController._STATE_SUBSCRIBED = 1;
    _StreamController._STATE_CANCELED = 2;
    _StreamController._STATE_SUBSCRIPTION_MASK = 3;
    _StreamController._STATE_CLOSED = 4;
    _StreamController._STATE_ADDSTREAM = 8;
    return _StreamController;
  });
  let _StreamController = _StreamController$(dart.dynamic);
  let _SyncStreamControllerDispatch$ = dart.generic(function(T) {
    class _SyncStreamControllerDispatch extends core.Object {
      [_sendData](data) {
        this[_subscription]._add(data);
      }
      [_sendError](error, stackTrace) {
        this[_subscription]._addError(error, stackTrace);
      }
      [_sendDone]() {
        this[_subscription]._close();
      }
    }
    return _SyncStreamControllerDispatch;
  });
  let _SyncStreamControllerDispatch = _SyncStreamControllerDispatch$(dart.dynamic);
  let _AsyncStreamControllerDispatch$ = dart.generic(function(T) {
    class _AsyncStreamControllerDispatch extends core.Object {
      [_sendData](data) {
        this[_subscription]._addPending(new _DelayedData(data));
      }
      [_sendError](error, stackTrace) {
        this[_subscription]._addPending(new _DelayedError(error, stackTrace));
      }
      [_sendDone]() {
        this[_subscription]._addPending(new _DelayedDone());
      }
    }
    return _AsyncStreamControllerDispatch;
  });
  let _AsyncStreamControllerDispatch = _AsyncStreamControllerDispatch$(dart.dynamic);
  let _AsyncStreamController$ = dart.generic(function(T) {
    class _AsyncStreamController extends dart.mixin(_StreamController$(T), _AsyncStreamControllerDispatch$(T)) {
      _AsyncStreamController($_onListen, $_onPause, $_onResume, $_onCancel) {
        this[_onListen] = $_onListen;
        this[_onPause] = $_onPause;
        this[_onResume] = $_onResume;
        this[_onCancel] = $_onCancel;
        super._StreamController();
      }
    }
    return _AsyncStreamController;
  });
  let _AsyncStreamController = _AsyncStreamController$(dart.dynamic);
  let _SyncStreamController$ = dart.generic(function(T) {
    class _SyncStreamController extends dart.mixin(_StreamController$(T), _SyncStreamControllerDispatch$(T)) {
      _SyncStreamController($_onListen, $_onPause, $_onResume, $_onCancel) {
        this[_onListen] = $_onListen;
        this[_onPause] = $_onPause;
        this[_onResume] = $_onResume;
        this[_onCancel] = $_onCancel;
        super._StreamController();
      }
    }
    return _SyncStreamController;
  });
  let _SyncStreamController = _SyncStreamController$(dart.dynamic);
  class _NoCallbacks extends core.Object {
    get [_onListen]() {
      return null;
    }
    get [_onPause]() {
      return null;
    }
    get [_onResume]() {
      return null;
    }
    get [_onCancel]() {
      return null;
    }
  }
  class _NoCallbackAsyncStreamController extends dart.mixin(_AsyncStreamControllerDispatch, _NoCallbacks) {
  }
  class _NoCallbackSyncStreamController extends dart.mixin(_SyncStreamControllerDispatch, _NoCallbacks) {
  }
  // Function _runGuarded: (() → dynamic) → Future<dynamic>
  function _runGuarded(notificationHandler) {
    if (notificationHandler === null)
      return null;
    try {
      let result = notificationHandler();
      if (dart.is(result, Future))
        return dart.as(result, Future);
      return null;
    } catch (e) {
      let s = dart.stackTrace(e);
      Zone.current.handleUncaughtError(e, s);
    }

  }
  let _createSubscription = Symbol('_createSubscription');
  let _ControllerStream$ = dart.generic(function(T) {
    class _ControllerStream extends _StreamImpl$(T) {
      _ControllerStream($_controller) {
        this[_controller] = $_controller;
        super._StreamImpl();
      }
      [_createSubscription](onData, onError, onDone, cancelOnError) {
        return this[_controller]._subscribe(onData, onError, onDone, cancelOnError);
      }
      get hashCode() {
        return dart.notNull(this[_controller].hashCode) ^ 892482866;
      }
      ['=='](other) {
        if (core.identical(this, other))
          return true;
        if (!dart.is(other, _ControllerStream))
          return false;
        let otherStream = dart.as(other, _ControllerStream);
        return core.identical(otherStream[_controller], this[_controller]);
      }
    }
    return _ControllerStream;
  });
  let _ControllerStream = _ControllerStream$(dart.dynamic);
  let _ControllerSubscription$ = dart.generic(function(T) {
    class _ControllerSubscription extends _BufferingStreamSubscription$(T) {
      _ControllerSubscription($_controller, onData, onError, onDone, cancelOnError) {
        this[_controller] = $_controller;
        super._BufferingStreamSubscription(onData, onError, onDone, cancelOnError);
      }
      [_onCancel]() {
        return this[_controller]._recordCancel(this);
      }
      [_onPause]() {
        this[_controller]._recordPause(this);
      }
      [_onResume]() {
        this[_controller]._recordResume(this);
      }
    }
    return _ControllerSubscription;
  });
  let _ControllerSubscription = _ControllerSubscription$(dart.dynamic);
  let _target = Symbol('_target');
  let _StreamSinkWrapper$ = dart.generic(function(T) {
    class _StreamSinkWrapper extends core.Object {
      _StreamSinkWrapper($_target) {
        this[_target] = $_target;
      }
      add(data) {
        this[_target].add(data);
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        this[_target].addError(error, stackTrace);
      }
      close() {
        return this[_target].close();
      }
      addStream(source, opt$) {
        let cancelOnError = opt$.cancelOnError === void 0 ? true : opt$.cancelOnError;
        return this[_target].addStream(source, {cancelOnError: cancelOnError});
      }
      get done() {
        return this[_target].done;
      }
    }
    return _StreamSinkWrapper;
  });
  let _StreamSinkWrapper = _StreamSinkWrapper$(dart.dynamic);
  let _AddStreamState$ = dart.generic(function(T) {
    class _AddStreamState extends core.Object {
      _AddStreamState(controller, source, cancelOnError) {
        this.addStreamFuture = new _Future();
        this.addSubscription = source.listen(dart.as(controller[_add], dart.throw_("Unimplemented type (dynamic) → void")), {onError: dart.as(cancelOnError ? makeErrorHandler(controller) : controller[_addError], core.Function), onDone: controller[_close], cancelOnError: cancelOnError});
      }
      static makeErrorHandler(controller) {
        return ((e, s) => {
          controller._addError(e, s);
          controller._close();
        }).bind(this);
      }
      pause() {
        this.addSubscription.pause();
      }
      resume() {
        this.addSubscription.resume();
      }
      cancel() {
        let cancel = this.addSubscription.cancel();
        if (cancel === null) {
          this.addStreamFuture._asyncComplete(null);
          return null;
        }
        return cancel.whenComplete((() => {
          this.addStreamFuture._asyncComplete(null);
        }).bind(this));
      }
      complete() {
        this.addStreamFuture._asyncComplete(null);
      }
    }
    return _AddStreamState;
  });
  let _AddStreamState = _AddStreamState$(dart.dynamic);
  let _StreamControllerAddStreamState$ = dart.generic(function(T) {
    class _StreamControllerAddStreamState extends _AddStreamState$(T) {
      _StreamControllerAddStreamState(controller, varData, source, cancelOnError) {
        this.varData = varData;
        super._AddStreamState(dart.as(controller, _EventSink$(T)), source, cancelOnError);
        if (controller.isPaused) {
          this.addSubscription.pause();
        }
      }
    }
    return _StreamControllerAddStreamState;
  });
  let _StreamControllerAddStreamState = _StreamControllerAddStreamState$(dart.dynamic);
  let _EventSink$ = dart.generic(function(T) {
    class _EventSink extends core.Object {
    }
    return _EventSink;
  });
  let _EventSink = _EventSink$(dart.dynamic);
  let _EventDispatch$ = dart.generic(function(T) {
    class _EventDispatch extends core.Object {
    }
    return _EventDispatch;
  });
  let _EventDispatch = _EventDispatch$(dart.dynamic);
  let _onData = Symbol('_onData');
  let _onDone = Symbol('_onDone');
  let _cancelFuture = Symbol('_cancelFuture');
  let _setPendingEvents = Symbol('_setPendingEvents');
  let _extractPending = Symbol('_extractPending');
  let _isPaused = Symbol('_isPaused');
  let _inCallback = Symbol('_inCallback');
  let _guardCallback = Symbol('_guardCallback');
  let _decrementPauseCount = Symbol('_decrementPauseCount');
  let _mayResumeInput = Symbol('_mayResumeInput');
  let _cancel = Symbol('_cancel');
  let _isClosed = Symbol('_isClosed');
  let _waitsForCancel = Symbol('_waitsForCancel');
  let _canFire = Symbol('_canFire');
  let _cancelOnError = Symbol('_cancelOnError');
  let _incrementPauseCount = Symbol('_incrementPauseCount');
  let _addPending = Symbol('_addPending');
  let _checkState = Symbol('_checkState');
  let _BufferingStreamSubscription$ = dart.generic(function(T) {
    class _BufferingStreamSubscription extends core.Object {
      _BufferingStreamSubscription(onData, onError, onDone, cancelOnError) {
        this[_zone] = Zone.current;
        this[_state] = cancelOnError ? _BufferingStreamSubscription._STATE_CANCEL_ON_ERROR : 0;
        this[_onData] = null;
        this[_onError] = null;
        this[_onDone] = null;
        this[_cancelFuture] = null;
        this[_pending] = null;
        this.onData(onData);
        this.onError(onError);
        this.onDone(onDone);
      }
      [_setPendingEvents](pendingEvents) {
        dart.assert(this[_pending] === null);
        if (pendingEvents === null)
          return;
        this[_pending] = pendingEvents;
        if (!dart.notNull(pendingEvents.isEmpty)) {
          this[_state] = _BufferingStreamSubscription._STATE_HAS_PENDING;
          this[_pending].schedule(this);
        }
      }
      [_extractPending]() {
        dart.assert(this[_isCanceled]);
        let events = this[_pending];
        this[_pending] = null;
        return events;
      }
      onData(handleData) {
        if (handleData === null)
          handleData = _nullDataHandler;
        this[_onData] = this[_zone].registerUnaryCallback(dart.as(handleData, dart.throw_("Unimplemented type (dynamic) → dynamic")));
      }
      onError(handleError) {
        if (handleError === null)
          handleError = _nullErrorHandler;
        this[_onError] = _registerErrorHandler(handleError, this[_zone]);
      }
      onDone(handleDone) {
        if (handleDone === null)
          handleDone = _nullDoneHandler;
        this[_onDone] = this[_zone].registerCallback(handleDone);
      }
      pause(resumeSignal) {
        if (resumeSignal === void 0)
          resumeSignal = null;
        if (this[_isCanceled])
          return;
        let wasPaused = this[_isPaused];
        let wasInputPaused = this[_isInputPaused];
        this[_state] = dart.notNull(this[_state]) + dart.notNull(_BufferingStreamSubscription._STATE_PAUSE_COUNT) | dart.notNull(_BufferingStreamSubscription._STATE_INPUT_PAUSED);
        if (resumeSignal !== null)
          resumeSignal.whenComplete(this.resume);
        if (!dart.notNull(wasPaused) && dart.notNull(this[_pending] !== null))
          this[_pending].cancelSchedule();
        if (!dart.notNull(wasInputPaused) && !dart.notNull(this[_inCallback]))
          this[_guardCallback](this[_onPause]);
      }
      resume() {
        if (this[_isCanceled])
          return;
        if (this[_isPaused]) {
          this[_decrementPauseCount]();
          if (!dart.notNull(this[_isPaused])) {
            if (dart.notNull(this[_hasPending]) && !dart.notNull(this[_pending].isEmpty)) {
              this[_pending].schedule(this);
            } else {
              dart.assert(this[_mayResumeInput]);
              this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_INPUT_PAUSED);
              if (!dart.notNull(this[_inCallback]))
                this[_guardCallback](this[_onResume]);
            }
          }
        }
      }
      cancel() {
        this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL);
        if (this[_isCanceled])
          return this[_cancelFuture];
        this[_cancel]();
        return this[_cancelFuture];
      }
      asFuture(futureValue) {
        if (futureValue === void 0)
          futureValue = null;
        let result = new _Future();
        this[_onDone] = (() => {
          result._complete(futureValue);
        }).bind(this);
        this[_onError] = ((error, stackTrace) => {
          this.cancel();
          result._completeError(error, dart.as(stackTrace, core.StackTrace));
        }).bind(this);
        return result;
      }
      get [_isInputPaused]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_INPUT_PAUSED)) !== 0;
      }
      get [_isClosed]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_CLOSED)) !== 0;
      }
      get [_isCanceled]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_CANCELED)) !== 0;
      }
      get [_waitsForCancel]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL)) !== 0;
      }
      get [_inCallback]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK)) !== 0;
      }
      get [_hasPending]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_HAS_PENDING)) !== 0;
      }
      get [_isPaused]() {
        return dart.notNull(this[_state]) >= dart.notNull(_BufferingStreamSubscription._STATE_PAUSE_COUNT);
      }
      get [_canFire]() {
        return dart.notNull(this[_state]) < dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
      }
      get [_mayResumeInput]() {
        return !dart.notNull(this[_isPaused]) && (dart.notNull(this[_pending] === null) || dart.notNull(this[_pending].isEmpty));
      }
      get [_cancelOnError]() {
        return (dart.notNull(this[_state]) & dart.notNull(_BufferingStreamSubscription._STATE_CANCEL_ON_ERROR)) !== 0;
      }
      get isPaused() {
        return this[_isPaused];
      }
      [_cancel]() {
        this[_state] = _BufferingStreamSubscription._STATE_CANCELED;
        if (this[_hasPending]) {
          this[_pending].cancelSchedule();
        }
        if (!dart.notNull(this[_inCallback]))
          this[_pending] = null;
        this[_cancelFuture] = this[_onCancel]();
      }
      [_incrementPauseCount]() {
        this[_state] = dart.notNull(this[_state]) + dart.notNull(_BufferingStreamSubscription._STATE_PAUSE_COUNT) | dart.notNull(_BufferingStreamSubscription._STATE_INPUT_PAUSED);
      }
      [_decrementPauseCount]() {
        dart.assert(this[_isPaused]);
        this[_state] = _BufferingStreamSubscription._STATE_PAUSE_COUNT;
      }
      [_add](data) {
        dart.assert(!dart.notNull(this[_isClosed]));
        if (this[_isCanceled])
          return;
        if (this[_canFire]) {
          this[_sendData](data);
        } else {
          this[_addPending](new _DelayedData(data));
        }
      }
      [_addError](error, stackTrace) {
        if (this[_isCanceled])
          return;
        if (this[_canFire]) {
          this[_sendError](error, stackTrace);
        } else {
          this[_addPending](new _DelayedError(error, stackTrace));
        }
      }
      [_close]() {
        dart.assert(!dart.notNull(this[_isClosed]));
        if (this[_isCanceled])
          return;
        this[_state] = _BufferingStreamSubscription._STATE_CLOSED;
        if (this[_canFire]) {
          this[_sendDone]();
        } else {
          this[_addPending](new _DelayedDone());
        }
      }
      [_onPause]() {
        dart.assert(this[_isInputPaused]);
      }
      [_onResume]() {
        dart.assert(!dart.notNull(this[_isInputPaused]));
      }
      [_onCancel]() {
        dart.assert(this[_isCanceled]);
        return null;
      }
      [_addPending](event) {
        let pending = dart.as(this[_pending], _StreamImplEvents);
        if (this[_pending] === null)
          pending = this[_pending] = new _StreamImplEvents();
        pending.add(event);
        if (!dart.notNull(this[_hasPending])) {
          this[_state] = _BufferingStreamSubscription._STATE_HAS_PENDING;
          if (!dart.notNull(this[_isPaused])) {
            this[_pending].schedule(this);
          }
        }
      }
      [_sendData](data) {
        dart.assert(!dart.notNull(this[_isCanceled]));
        dart.assert(!dart.notNull(this[_isPaused]));
        dart.assert(!dart.notNull(this[_inCallback]));
        let wasInputPaused = this[_isInputPaused];
        this[_state] = _BufferingStreamSubscription._STATE_IN_CALLBACK;
        this[_zone].runUnaryGuarded(dart.as(this[_onData], dart.throw_("Unimplemented type (dynamic) → dynamic")), data);
        this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
        this[_checkState](wasInputPaused);
      }
      [_sendError](error, stackTrace) {
        dart.assert(!dart.notNull(this[_isCanceled]));
        dart.assert(!dart.notNull(this[_isPaused]));
        dart.assert(!dart.notNull(this[_inCallback]));
        let wasInputPaused = this[_isInputPaused];
        // Function sendError: () → void
        function sendError() {
          if (dart.notNull(this[_isCanceled]) && !dart.notNull(this[_waitsForCancel]))
            return;
          this[_state] = _BufferingStreamSubscription._STATE_IN_CALLBACK;
          if (dart.is(this[_onError], ZoneBinaryCallback)) {
            this[_zone].runBinaryGuarded(dart.as(this[_onError], dart.throw_("Unimplemented type (dynamic, dynamic) → dynamic")), error, stackTrace);
          } else {
            this[_zone].runUnaryGuarded(dart.as(this[_onError], dart.throw_("Unimplemented type (dynamic) → dynamic")), error);
          }
          this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
        }
        if (this[_cancelOnError]) {
          this[_state] = _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
          this[_cancel]();
          if (dart.is(this[_cancelFuture], Future)) {
            this[_cancelFuture].whenComplete(sendError);
          } else {
            sendError();
          }
        } else {
          sendError();
          this[_checkState](wasInputPaused);
        }
      }
      [_sendDone]() {
        dart.assert(!dart.notNull(this[_isCanceled]));
        dart.assert(!dart.notNull(this[_isPaused]));
        dart.assert(!dart.notNull(this[_inCallback]));
        // Function sendDone: () → void
        function sendDone() {
          if (!dart.notNull(this[_waitsForCancel]))
            return;
          this[_state] = dart.notNull(_BufferingStreamSubscription._STATE_CANCELED) | dart.notNull(_BufferingStreamSubscription._STATE_CLOSED) | dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
          this[_zone].runGuarded(this[_onDone]);
          this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
        }
        this[_cancel]();
        this[_state] = _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL;
        if (dart.is(this[_cancelFuture], Future)) {
          this[_cancelFuture].whenComplete(sendDone);
        } else {
          sendDone();
        }
      }
      [_guardCallback](callback) {
        dart.assert(!dart.notNull(this[_inCallback]));
        let wasInputPaused = this[_isInputPaused];
        this[_state] = _BufferingStreamSubscription._STATE_IN_CALLBACK;
        dart.dinvokef(callback);
        this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
        this[_checkState](wasInputPaused);
      }
      [_checkState](wasInputPaused) {
        dart.assert(!dart.notNull(this[_inCallback]));
        if (dart.notNull(this[_hasPending]) && dart.notNull(this[_pending].isEmpty)) {
          this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_HAS_PENDING);
          if (dart.notNull(this[_isInputPaused]) && dart.notNull(this[_mayResumeInput])) {
            this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_INPUT_PAUSED);
          }
        }
        while (true) {
          if (this[_isCanceled]) {
            this[_pending] = null;
            return;
          }
          let isInputPaused = this[_isInputPaused];
          if (wasInputPaused === isInputPaused)
            break;
          this[_state] = _BufferingStreamSubscription._STATE_IN_CALLBACK;
          if (isInputPaused) {
            this[_onPause]();
          } else {
            this[_onResume]();
          }
          this[_state] = ~dart.notNull(_BufferingStreamSubscription._STATE_IN_CALLBACK);
          wasInputPaused = isInputPaused;
        }
        if (dart.notNull(this[_hasPending]) && !dart.notNull(this[_isPaused])) {
          this[_pending].schedule(this);
        }
      }
    }
    _BufferingStreamSubscription._STATE_CANCEL_ON_ERROR = 1;
    _BufferingStreamSubscription._STATE_CLOSED = 2;
    _BufferingStreamSubscription._STATE_INPUT_PAUSED = 4;
    _BufferingStreamSubscription._STATE_CANCELED = 8;
    _BufferingStreamSubscription._STATE_WAIT_FOR_CANCEL = 16;
    _BufferingStreamSubscription._STATE_IN_CALLBACK = 32;
    _BufferingStreamSubscription._STATE_HAS_PENDING = 64;
    _BufferingStreamSubscription._STATE_PAUSE_COUNT = 128;
    _BufferingStreamSubscription._STATE_PAUSE_COUNT_SHIFT = 7;
    return _BufferingStreamSubscription;
  });
  let _BufferingStreamSubscription = _BufferingStreamSubscription$(dart.dynamic);
  let _StreamImpl$ = dart.generic(function(T) {
    class _StreamImpl extends Stream$(T) {
      listen(onData, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let onDone = opt$.onDone === void 0 ? null : opt$.onDone;
        let cancelOnError = opt$.cancelOnError === void 0 ? null : opt$.cancelOnError;
        cancelOnError = core.identical(true, cancelOnError);
        let subscription = this[_createSubscription](onData, onError, onDone, cancelOnError);
        this[_onListen](subscription);
        return dart.as(subscription, StreamSubscription$(T));
      }
      [_createSubscription](onData, onError, onDone, cancelOnError) {
        return new _BufferingStreamSubscription(onData, onError, onDone, cancelOnError);
      }
      [_onListen](subscription) {}
    }
    return _StreamImpl;
  });
  let _StreamImpl = _StreamImpl$(dart.dynamic);
  let _isUsed = Symbol('_isUsed');
  let _GeneratedStreamImpl$ = dart.generic(function(T) {
    class _GeneratedStreamImpl extends _StreamImpl$(T) {
      _GeneratedStreamImpl($_pending) {
        this[_pending] = $_pending;
        this[_isUsed] = false;
        super._StreamImpl();
      }
      [_createSubscription](onData, onError, onDone, cancelOnError) {
        if (this[_isUsed])
          throw new core.StateError("Stream has already been listened to.");
        this[_isUsed] = true;
        return ((_) => {
          _._setPendingEvents(this[_pending]());
          return _;
        }).bind(this)(new _BufferingStreamSubscription(dart.as(onData, dart.throw_("Unimplemented type (dynamic) → void")), onError, onDone, cancelOnError));
      }
    }
    return _GeneratedStreamImpl;
  });
  let _GeneratedStreamImpl = _GeneratedStreamImpl$(dart.dynamic);
  let _iterator = Symbol('_iterator');
  let _IterablePendingEvents$ = dart.generic(function(T) {
    class _IterablePendingEvents extends _PendingEvents {
      _IterablePendingEvents(data) {
        this[_iterator] = data.iterator;
        super._PendingEvents();
      }
      get isEmpty() {
        return this[_iterator] === null;
      }
      handleNext(dispatch) {
        if (this[_iterator] === null) {
          throw new core.StateError("No events pending.");
        }
        let isDone = null;
        try {
          isDone = !dart.notNull(this[_iterator].moveNext());
        } catch (e) {
          let s = dart.stackTrace(e);
          this[_iterator] = null;
          dispatch._sendError(e, s);
          return;
        }

        if (!dart.notNull(isDone)) {
          dispatch._sendData(this[_iterator].current);
        } else {
          this[_iterator] = null;
          dispatch._sendDone();
        }
      }
      clear() {
        if (this.isScheduled)
          this.cancelSchedule();
        this[_iterator] = null;
      }
    }
    return _IterablePendingEvents;
  });
  let _IterablePendingEvents = _IterablePendingEvents$(dart.dynamic);
  // Function _nullDataHandler: (dynamic) → void
  function _nullDataHandler(value) {
  }
  // Function _nullErrorHandler: (dynamic, [StackTrace]) → void
  function _nullErrorHandler(error, stackTrace) {
    if (stackTrace === void 0)
      stackTrace = null;
    Zone.current.handleUncaughtError(error, stackTrace);
  }
  // Function _nullDoneHandler: () → void
  function _nullDoneHandler() {
  }
  class _DelayedEvent extends core.Object {
    _DelayedEvent() {
      this.next = null;
    }
  }
  let _DelayedData$ = dart.generic(function(T) {
    class _DelayedData extends _DelayedEvent {
      _DelayedData(value) {
        this.value = value;
        super._DelayedEvent();
      }
      perform(dispatch) {
        dispatch._sendData(this.value);
      }
    }
    return _DelayedData;
  });
  let _DelayedData = _DelayedData$(dart.dynamic);
  class _DelayedError extends _DelayedEvent {
    _DelayedError(error, stackTrace) {
      this.error = error;
      this.stackTrace = stackTrace;
      super._DelayedEvent();
    }
    perform(dispatch) {
      dispatch._sendError(this.error, this.stackTrace);
    }
  }
  class _DelayedDone extends core.Object {
    _DelayedDone() {
    }
    perform(dispatch) {
      dispatch._sendDone();
    }
    get next() {
      return null;
    }
    set next(_) {
      throw new core.StateError("No events after a done.");
    }
  }
  let _eventScheduled = Symbol('_eventScheduled');
  class _PendingEvents extends core.Object {
    _PendingEvents() {
      this[_state] = _PendingEvents._STATE_UNSCHEDULED;
    }
    get isScheduled() {
      return this[_state] === _PendingEvents._STATE_SCHEDULED;
    }
    get [_eventScheduled]() {
      return dart.notNull(this[_state]) >= dart.notNull(_PendingEvents._STATE_SCHEDULED);
    }
    schedule(dispatch) {
      if (this.isScheduled)
        return;
      dart.assert(!dart.notNull(this.isEmpty));
      if (this[_eventScheduled]) {
        dart.assert(this[_state] === _PendingEvents._STATE_CANCELED);
        this[_state] = _PendingEvents._STATE_SCHEDULED;
        return;
      }
      scheduleMicrotask((() => {
        let oldState = this[_state];
        this[_state] = _PendingEvents._STATE_UNSCHEDULED;
        if (oldState === _PendingEvents._STATE_CANCELED)
          return;
        this.handleNext(dispatch);
      }).bind(this));
      this[_state] = _PendingEvents._STATE_SCHEDULED;
    }
    cancelSchedule() {
      if (this.isScheduled)
        this[_state] = _PendingEvents._STATE_CANCELED;
    }
  }
  _PendingEvents._STATE_UNSCHEDULED = 0;
  _PendingEvents._STATE_SCHEDULED = 1;
  _PendingEvents._STATE_CANCELED = 3;
  class _StreamImplEvents extends _PendingEvents {
    _StreamImplEvents() {
      this.firstPendingEvent = null;
      this.lastPendingEvent = null;
      super._PendingEvents();
    }
    get isEmpty() {
      return this.lastPendingEvent === null;
    }
    add(event) {
      if (this.lastPendingEvent === null) {
        this.firstPendingEvent = this.lastPendingEvent = event;
      } else {
        this.lastPendingEvent = this.lastPendingEvent.next = event;
      }
    }
    handleNext(dispatch) {
      dart.assert(!dart.notNull(this.isScheduled));
      let event = this.firstPendingEvent;
      this.firstPendingEvent = event.next;
      if (this.firstPendingEvent === null) {
        this.lastPendingEvent = null;
      }
      event.perform(dispatch);
    }
    clear() {
      if (this.isScheduled)
        this.cancelSchedule();
      this.firstPendingEvent = this.lastPendingEvent = null;
    }
  }
  let _unlink = Symbol('_unlink');
  let _insertBefore = Symbol('_insertBefore');
  class _BroadcastLinkedList extends core.Object {
    _BroadcastLinkedList() {
      this[_next] = null;
      this[_previous] = null;
    }
    [_unlink]() {
      this[_previous][_next] = this[_next];
      this[_next][_previous] = this[_previous];
      this[_next] = this[_previous] = this;
    }
    [_insertBefore](newNext) {
      let newPrevious = newNext[_previous];
      newPrevious[_next] = this;
      newNext[_previous] = this[_previous];
      this[_previous][_next] = newNext;
      this[_previous] = newPrevious;
    }
  }
  let _schedule = Symbol('_schedule');
  let _isSent = Symbol('_isSent');
  let _isScheduled = Symbol('_isScheduled');
  let _DoneStreamSubscription$ = dart.generic(function(T) {
    class _DoneStreamSubscription extends core.Object {
      _DoneStreamSubscription($_onDone) {
        this[_onDone] = $_onDone;
        this[_zone] = Zone.current;
        this[_state] = 0;
        this[_schedule]();
      }
      get [_isSent]() {
        return (dart.notNull(this[_state]) & dart.notNull(_DoneStreamSubscription._DONE_SENT)) !== 0;
      }
      get [_isScheduled]() {
        return (dart.notNull(this[_state]) & dart.notNull(_DoneStreamSubscription._SCHEDULED)) !== 0;
      }
      get isPaused() {
        return dart.notNull(this[_state]) >= dart.notNull(_DoneStreamSubscription._PAUSED);
      }
      [_schedule]() {
        if (this[_isScheduled])
          return;
        this[_zone].scheduleMicrotask(this[_sendDone]);
        this[_state] = _DoneStreamSubscription._SCHEDULED;
      }
      onData(handleData) {}
      onError(handleError) {}
      onDone(handleDone) {
        this[_onDone] = handleDone;
      }
      pause(resumeSignal) {
        if (resumeSignal === void 0)
          resumeSignal = null;
        this[_state] = _DoneStreamSubscription._PAUSED;
        if (resumeSignal !== null)
          resumeSignal.whenComplete(this.resume);
      }
      resume() {
        if (this.isPaused) {
          this[_state] = _DoneStreamSubscription._PAUSED;
          if (!dart.notNull(this.isPaused) && !dart.notNull(this[_isSent])) {
            this[_schedule]();
          }
        }
      }
      cancel() {
        return null;
      }
      asFuture(futureValue) {
        if (futureValue === void 0)
          futureValue = null;
        let result = new _Future();
        this[_onDone] = (() => {
          result._completeWithValue(null);
        }).bind(this);
        return result;
      }
      [_sendDone]() {
        this[_state] = ~dart.notNull(_DoneStreamSubscription._SCHEDULED);
        if (this.isPaused)
          return;
        this[_state] = _DoneStreamSubscription._DONE_SENT;
        if (this[_onDone] !== null)
          this[_zone].runGuarded(this[_onDone]);
      }
    }
    _DoneStreamSubscription._DONE_SENT = 1;
    _DoneStreamSubscription._SCHEDULED = 2;
    _DoneStreamSubscription._PAUSED = 4;
    return _DoneStreamSubscription;
  });
  let _DoneStreamSubscription = _DoneStreamSubscription$(dart.dynamic);
  let _source = Symbol('_source');
  let _onListenHandler = Symbol('_onListenHandler');
  let _onCancelHandler = Symbol('_onCancelHandler');
  let _cancelSubscription = Symbol('_cancelSubscription');
  let _pauseSubscription = Symbol('_pauseSubscription');
  let _resumeSubscription = Symbol('_resumeSubscription');
  let _isSubscriptionPaused = Symbol('_isSubscriptionPaused');
  let _AsBroadcastStream$ = dart.generic(function(T) {
    class _AsBroadcastStream extends Stream$(T) {
      _AsBroadcastStream($_source, onListenHandler, onCancelHandler) {
        this[_source] = $_source;
        this[_onListenHandler] = Zone.current.registerUnaryCallback(dart.as(onListenHandler, dart.throw_("Unimplemented type (dynamic) → dynamic")));
        this[_onCancelHandler] = Zone.current.registerUnaryCallback(dart.as(onCancelHandler, dart.throw_("Unimplemented type (dynamic) → dynamic")));
        this[_zone] = Zone.current;
        this[_controller] = null;
        this[_subscription] = null;
        super.Stream();
        this[_controller] = new _AsBroadcastStreamController(this[_onListen], this[_onCancel]);
      }
      get isBroadcast() {
        return true;
      }
      listen(onData, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let onDone = opt$.onDone === void 0 ? null : opt$.onDone;
        let cancelOnError = opt$.cancelOnError === void 0 ? null : opt$.cancelOnError;
        if (dart.notNull(this[_controller] === null) || dart.notNull(this[_controller].isClosed)) {
          return new _DoneStreamSubscription(onDone);
        }
        if (this[_subscription] === null) {
          this[_subscription] = this[_source].listen(this[_controller].add, {onError: this[_controller].addError, onDone: this[_controller].close});
        }
        cancelOnError = core.identical(true, cancelOnError);
        return this[_controller]._subscribe(onData, onError, onDone, cancelOnError);
      }
      [_onCancel]() {
        let shutdown = dart.notNull(this[_controller] === null) || dart.notNull(this[_controller].isClosed);
        if (this[_onCancelHandler] !== null) {
          this[_zone].runUnary(dart.as(this[_onCancelHandler], dart.throw_("Unimplemented type (dynamic) → dynamic")), new _BroadcastSubscriptionWrapper(this));
        }
        if (shutdown) {
          if (this[_subscription] !== null) {
            this[_subscription].cancel();
            this[_subscription] = null;
          }
        }
      }
      [_onListen]() {
        if (this[_onListenHandler] !== null) {
          this[_zone].runUnary(dart.as(this[_onListenHandler], dart.throw_("Unimplemented type (dynamic) → dynamic")), new _BroadcastSubscriptionWrapper(this));
        }
      }
      [_cancelSubscription]() {
        if (this[_subscription] === null)
          return;
        let subscription = this[_subscription];
        this[_subscription] = null;
        this[_controller] = null;
        subscription.cancel();
      }
      [_pauseSubscription](resumeSignal) {
        if (this[_subscription] === null)
          return;
        this[_subscription].pause(resumeSignal);
      }
      [_resumeSubscription]() {
        if (this[_subscription] === null)
          return;
        this[_subscription].resume();
      }
      get [_isSubscriptionPaused]() {
        if (this[_subscription] === null)
          return false;
        return this[_subscription].isPaused;
      }
    }
    return _AsBroadcastStream;
  });
  let _AsBroadcastStream = _AsBroadcastStream$(dart.dynamic);
  let _BroadcastSubscriptionWrapper$ = dart.generic(function(T) {
    class _BroadcastSubscriptionWrapper extends core.Object {
      _BroadcastSubscriptionWrapper($_stream) {
        this[_stream] = $_stream;
      }
      onData(handleData) {
        throw new core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
      }
      onError(handleError) {
        throw new core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
      }
      onDone(handleDone) {
        throw new core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
      }
      pause(resumeSignal) {
        if (resumeSignal === void 0)
          resumeSignal = null;
        this[_stream]._pauseSubscription(resumeSignal);
      }
      resume() {
        this[_stream]._resumeSubscription();
      }
      cancel() {
        this[_stream]._cancelSubscription();
        return null;
      }
      get isPaused() {
        return this[_stream][_isSubscriptionPaused];
      }
      asFuture(futureValue) {
        if (futureValue === void 0)
          futureValue = null;
        throw new core.UnsupportedError("Cannot change handlers of asBroadcastStream source subscription.");
      }
    }
    return _BroadcastSubscriptionWrapper;
  });
  let _BroadcastSubscriptionWrapper = _BroadcastSubscriptionWrapper$(dart.dynamic);
  let _current = Symbol('_current');
  let _futureOrPrefetch = Symbol('_futureOrPrefetch');
  let _clear = Symbol('_clear');
  let _StreamIteratorImpl$ = dart.generic(function(T) {
    class _StreamIteratorImpl extends core.Object {
      _StreamIteratorImpl(stream) {
        this[_subscription] = null;
        this[_current] = null;
        this[_futureOrPrefetch] = null;
        this[_state] = _StreamIteratorImpl._STATE_FOUND;
        this[_subscription] = stream.listen(this[_onData], {onError: this[_onError], onDone: this[_onDone], cancelOnError: true});
      }
      get current() {
        return this[_current];
      }
      moveNext() {
        if (this[_state] === _StreamIteratorImpl._STATE_DONE) {
          return new _Future.immediate(false);
        }
        if (this[_state] === _StreamIteratorImpl._STATE_MOVING) {
          throw new core.StateError("Already waiting for next.");
        }
        if (this[_state] === _StreamIteratorImpl._STATE_FOUND) {
          this[_state] = _StreamIteratorImpl._STATE_MOVING;
          this[_current] = null;
          this[_futureOrPrefetch] = new _Future();
          return dart.as(this[_futureOrPrefetch], Future$(core.bool));
        } else {
          dart.assert(dart.notNull(this[_state]) >= dart.notNull(_StreamIteratorImpl._STATE_EXTRA_DATA));
          switch (this[_state]) {
            case _StreamIteratorImpl._STATE_EXTRA_DATA:
              this[_state] = _StreamIteratorImpl._STATE_FOUND;
              this[_current] = dart.as(this[_futureOrPrefetch], T);
              this[_futureOrPrefetch] = null;
              this[_subscription].resume();
              return new _Future.immediate(true);
            case _StreamIteratorImpl._STATE_EXTRA_ERROR:
              let prefetch = dart.as(this[_futureOrPrefetch], AsyncError);
              this[_clear]();
              return new _Future.immediateError(prefetch.error, prefetch.stackTrace);
            case _StreamIteratorImpl._STATE_EXTRA_DONE:
              this[_clear]();
              return new _Future.immediate(false);
          }
        }
      }
      [_clear]() {
        this[_subscription] = null;
        this[_futureOrPrefetch] = null;
        this[_current] = null;
        this[_state] = _StreamIteratorImpl._STATE_DONE;
      }
      cancel() {
        let subscription = this[_subscription];
        if (this[_state] === _StreamIteratorImpl._STATE_MOVING) {
          let hasNext = dart.as(this[_futureOrPrefetch], _Future$(core.bool));
          this[_clear]();
          hasNext._complete(false);
        } else {
          this[_clear]();
        }
        return subscription.cancel();
      }
      [_onData](data) {
        if (this[_state] === _StreamIteratorImpl._STATE_MOVING) {
          this[_current] = data;
          let hasNext = dart.as(this[_futureOrPrefetch], _Future$(core.bool));
          this[_futureOrPrefetch] = null;
          this[_state] = _StreamIteratorImpl._STATE_FOUND;
          hasNext._complete(true);
          return;
        }
        this[_subscription].pause();
        dart.assert(this[_futureOrPrefetch] === null);
        this[_futureOrPrefetch] = data;
        this[_state] = _StreamIteratorImpl._STATE_EXTRA_DATA;
      }
      [_onError](error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        if (this[_state] === _StreamIteratorImpl._STATE_MOVING) {
          let hasNext = dart.as(this[_futureOrPrefetch], _Future$(core.bool));
          this[_clear]();
          hasNext._completeError(error, stackTrace);
          return;
        }
        this[_subscription].pause();
        dart.assert(this[_futureOrPrefetch] === null);
        this[_futureOrPrefetch] = new AsyncError(error, stackTrace);
        this[_state] = _StreamIteratorImpl._STATE_EXTRA_ERROR;
      }
      [_onDone]() {
        if (this[_state] === _StreamIteratorImpl._STATE_MOVING) {
          let hasNext = dart.as(this[_futureOrPrefetch], _Future$(core.bool));
          this[_clear]();
          hasNext._complete(false);
          return;
        }
        this[_subscription].pause();
        this[_futureOrPrefetch] = null;
        this[_state] = _StreamIteratorImpl._STATE_EXTRA_DONE;
      }
    }
    _StreamIteratorImpl._STATE_FOUND = 0;
    _StreamIteratorImpl._STATE_DONE = 1;
    _StreamIteratorImpl._STATE_MOVING = 2;
    _StreamIteratorImpl._STATE_EXTRA_DATA = 3;
    _StreamIteratorImpl._STATE_EXTRA_ERROR = 4;
    _StreamIteratorImpl._STATE_EXTRA_DONE = 5;
    return _StreamIteratorImpl;
  });
  let _StreamIteratorImpl = _StreamIteratorImpl$(dart.dynamic);
  // Function _runUserCode: (() → dynamic, (dynamic) → dynamic, (dynamic, StackTrace) → dynamic) → dynamic
  function _runUserCode(userCode, onSuccess, onError) {
    try {
      onSuccess(userCode());
    } catch (e) {
      let s = dart.stackTrace(e);
      let replacement = Zone.current.errorCallback(e, s);
      if (replacement === null) {
        onError(e, s);
      } else {
        let error = _nonNullError(replacement.error);
        let stackTrace = replacement.stackTrace;
        onError(error, stackTrace);
      }
    }

  }
  // Function _cancelAndError: (StreamSubscription<dynamic>, _Future<dynamic>, dynamic, StackTrace) → void
  function _cancelAndError(subscription, future, error, stackTrace) {
    let cancelFuture = subscription.cancel();
    if (dart.is(cancelFuture, Future)) {
      cancelFuture.whenComplete(() => future._completeError(error, stackTrace));
    } else {
      future._completeError(error, stackTrace);
    }
  }
  // Function _cancelAndErrorWithReplacement: (StreamSubscription<dynamic>, _Future<dynamic>, dynamic, StackTrace) → void
  function _cancelAndErrorWithReplacement(subscription, future, error, stackTrace) {
    let replacement = Zone.current.errorCallback(error, stackTrace);
    if (replacement !== null) {
      error = _nonNullError(replacement.error);
      stackTrace = replacement.stackTrace;
    }
    _cancelAndError(subscription, future, error, stackTrace);
  }
  // Function _cancelAndErrorClosure: (StreamSubscription<dynamic>, _Future<dynamic>) → dynamic
  function _cancelAndErrorClosure(subscription, future) {
    return (error, stackTrace) => _cancelAndError(subscription, future, error, stackTrace);
  }
  // Function _cancelAndValue: (StreamSubscription<dynamic>, _Future<dynamic>, dynamic) → void
  function _cancelAndValue(subscription, future, value) {
    let cancelFuture = subscription.cancel();
    if (dart.is(cancelFuture, Future)) {
      cancelFuture.whenComplete(() => future._complete(value));
    } else {
      future._complete(value);
    }
  }
  let _handleData = Symbol('_handleData');
  let _handleError = Symbol('_handleError');
  let _handleDone = Symbol('_handleDone');
  let _ForwardingStream$ = dart.generic(function(S, T) {
    class _ForwardingStream extends Stream$(T) {
      _ForwardingStream($_source) {
        this[_source] = $_source;
        super.Stream();
      }
      get isBroadcast() {
        return this[_source].isBroadcast;
      }
      listen(onData, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let onDone = opt$.onDone === void 0 ? null : opt$.onDone;
        let cancelOnError = opt$.cancelOnError === void 0 ? null : opt$.cancelOnError;
        cancelOnError = core.identical(true, cancelOnError);
        return this[_createSubscription](onData, onError, onDone, cancelOnError);
      }
      [_createSubscription](onData, onError, onDone, cancelOnError) {
        return new _ForwardingStreamSubscription(this, onData, onError, onDone, cancelOnError);
      }
      [_handleData](data, sink) {
        let outputData = data;
        sink._add(outputData);
      }
      [_handleError](error, stackTrace, sink) {
        sink._addError(error, stackTrace);
      }
      [_handleDone](sink) {
        sink._close();
      }
    }
    return _ForwardingStream;
  });
  let _ForwardingStream = _ForwardingStream$(dart.dynamic, dart.dynamic);
  let _ForwardingStreamSubscription$ = dart.generic(function(S, T) {
    class _ForwardingStreamSubscription extends _BufferingStreamSubscription$(T) {
      _ForwardingStreamSubscription($_stream, onData, onError, onDone, cancelOnError) {
        this[_stream] = $_stream;
        this[_subscription] = null;
        super._BufferingStreamSubscription(onData, onError, onDone, cancelOnError);
        this[_subscription] = this[_stream][_source].listen(this[_handleData], {onError: this[_handleError], onDone: this[_handleDone]});
      }
      [_add](data) {
        if (this[_isClosed])
          return;
        super._add(data);
      }
      [_addError](error, stackTrace) {
        if (this[_isClosed])
          return;
        super._addError(error, stackTrace);
      }
      [_onPause]() {
        if (this[_subscription] === null)
          return;
        this[_subscription].pause();
      }
      [_onResume]() {
        if (this[_subscription] === null)
          return;
        this[_subscription].resume();
      }
      [_onCancel]() {
        if (this[_subscription] !== null) {
          let subscription = this[_subscription];
          this[_subscription] = null;
          subscription.cancel();
        }
        return null;
      }
      [_handleData](data) {
        this[_stream]._handleData(data, this);
      }
      [_handleError](error, stackTrace) {
        this[_stream]._handleError(error, stackTrace, this);
      }
      [_handleDone]() {
        this[_stream]._handleDone(this);
      }
    }
    return _ForwardingStreamSubscription;
  });
  let _ForwardingStreamSubscription = _ForwardingStreamSubscription$(dart.dynamic, dart.dynamic);
  // Function _addErrorWithReplacement: (_EventSink<dynamic>, dynamic, dynamic) → void
  function _addErrorWithReplacement(sink, error, stackTrace) {
    let replacement = Zone.current.errorCallback(error, dart.as(stackTrace, core.StackTrace));
    if (replacement !== null) {
      error = _nonNullError(replacement.error);
      stackTrace = replacement.stackTrace;
    }
    sink._addError(error, dart.as(stackTrace, core.StackTrace));
  }
  let _test = Symbol('_test');
  let _WhereStream$ = dart.generic(function(T) {
    class _WhereStream extends _ForwardingStream$(T, T) {
      _WhereStream(source, test) {
        this[_test] = test;
        super._ForwardingStream(source);
      }
      [_handleData](inputEvent, sink) {
        let satisfies = null;
        try {
          satisfies = this[_test](inputEvent);
        } catch (e) {
          let s = dart.stackTrace(e);
          _addErrorWithReplacement(sink, e, s);
          return;
        }

        if (satisfies) {
          sink._add(inputEvent);
        }
      }
    }
    return _WhereStream;
  });
  let _WhereStream = _WhereStream$(dart.dynamic);
  let _transform = Symbol('_transform');
  let _MapStream$ = dart.generic(function(S, T) {
    class _MapStream extends _ForwardingStream$(S, T) {
      _MapStream(source, transform) {
        this[_transform] = dart.as(transform, _Transformation);
        super._ForwardingStream(source);
      }
      [_handleData](inputEvent, sink) {
        let outputEvent = null;
        try {
          outputEvent = dart.as(this[_transform](inputEvent), T);
        } catch (e) {
          let s = dart.stackTrace(e);
          _addErrorWithReplacement(sink, e, s);
          return;
        }

        sink._add(outputEvent);
      }
    }
    return _MapStream;
  });
  let _MapStream = _MapStream$(dart.dynamic, dart.dynamic);
  let _expand = Symbol('_expand');
  let _ExpandStream$ = dart.generic(function(S, T) {
    class _ExpandStream extends _ForwardingStream$(S, T) {
      _ExpandStream(source, expand) {
        this[_expand] = expand;
        super._ForwardingStream(source);
      }
      [_handleData](inputEvent, sink) {
        try {
          for (let value of this[_expand](inputEvent)) {
            sink._add(value);
          }
        } catch (e) {
          let s = dart.stackTrace(e);
          _addErrorWithReplacement(sink, e, s);
        }

      }
    }
    return _ExpandStream;
  });
  let _ExpandStream = _ExpandStream$(dart.dynamic, dart.dynamic);
  let _HandleErrorStream$ = dart.generic(function(T) {
    class _HandleErrorStream extends _ForwardingStream$(T, T) {
      _HandleErrorStream(source, onError, test) {
        this[_transform] = onError;
        this[_test] = test;
        super._ForwardingStream(source);
      }
      [_handleError](error, stackTrace, sink) {
        let matches = true;
        if (this[_test] !== null) {
          try {
            matches = this[_test](error);
          } catch (e) {
            let s = dart.stackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            return;
          }

        }
        if (matches) {
          try {
            _invokeErrorHandler(this[_transform], error, stackTrace);
          } catch (e) {
            let s = dart.stackTrace(e);
            if (core.identical(e, error)) {
              sink._addError(error, stackTrace);
            } else {
              _addErrorWithReplacement(sink, e, s);
            }
            return;
          }

        } else {
          sink._addError(error, stackTrace);
        }
      }
    }
    return _HandleErrorStream;
  });
  let _HandleErrorStream = _HandleErrorStream$(dart.dynamic);
  let _remaining = Symbol('_remaining');
  let _TakeStream$ = dart.generic(function(T) {
    class _TakeStream extends _ForwardingStream$(T, T) {
      _TakeStream(source, count) {
        this[_remaining] = count;
        super._ForwardingStream(source);
        if (!(typeof count == number))
          throw new core.ArgumentError(count);
      }
      [_handleData](inputEvent, sink) {
        if (dart.notNull(this[_remaining]) > 0) {
          sink._add(inputEvent);
          this[_remaining] = 1;
          if (this[_remaining] === 0) {
            sink._close();
          }
        }
      }
    }
    return _TakeStream;
  });
  let _TakeStream = _TakeStream$(dart.dynamic);
  let _TakeWhileStream$ = dart.generic(function(T) {
    class _TakeWhileStream extends _ForwardingStream$(T, T) {
      _TakeWhileStream(source, test) {
        this[_test] = test;
        super._ForwardingStream(source);
      }
      [_handleData](inputEvent, sink) {
        let satisfies = null;
        try {
          satisfies = this[_test](inputEvent);
        } catch (e) {
          let s = dart.stackTrace(e);
          _addErrorWithReplacement(sink, e, s);
          sink._close();
          return;
        }

        if (satisfies) {
          sink._add(inputEvent);
        } else {
          sink._close();
        }
      }
    }
    return _TakeWhileStream;
  });
  let _TakeWhileStream = _TakeWhileStream$(dart.dynamic);
  let _SkipStream$ = dart.generic(function(T) {
    class _SkipStream extends _ForwardingStream$(T, T) {
      _SkipStream(source, count) {
        this[_remaining] = count;
        super._ForwardingStream(source);
        if (dart.notNull(!(typeof count == number)) || dart.notNull(count) < 0)
          throw new core.ArgumentError(count);
      }
      [_handleData](inputEvent, sink) {
        if (dart.notNull(this[_remaining]) > 0) {
          this[_remaining] = dart.notNull(this[_remaining]) - 1;
          return;
        }
        sink._add(inputEvent);
      }
    }
    return _SkipStream;
  });
  let _SkipStream = _SkipStream$(dart.dynamic);
  let _hasFailed = Symbol('_hasFailed');
  let _SkipWhileStream$ = dart.generic(function(T) {
    class _SkipWhileStream extends _ForwardingStream$(T, T) {
      _SkipWhileStream(source, test) {
        this[_test] = test;
        this[_hasFailed] = false;
        super._ForwardingStream(source);
      }
      [_handleData](inputEvent, sink) {
        if (this[_hasFailed]) {
          sink._add(inputEvent);
          return;
        }
        let satisfies = null;
        try {
          satisfies = this[_test](inputEvent);
        } catch (e) {
          let s = dart.stackTrace(e);
          _addErrorWithReplacement(sink, e, s);
          this[_hasFailed] = true;
          return;
        }

        if (!dart.notNull(satisfies)) {
          this[_hasFailed] = true;
          sink._add(inputEvent);
        }
      }
    }
    return _SkipWhileStream;
  });
  let _SkipWhileStream = _SkipWhileStream$(dart.dynamic);
  let _equals = Symbol('_equals');
  let _DistinctStream$ = dart.generic(function(T) {
    class _DistinctStream extends _ForwardingStream$(T, T) {
      _DistinctStream(source, equals) {
        this[_previous] = _SENTINEL;
        this[_equals] = equals;
        super._ForwardingStream(source);
      }
      [_handleData](inputEvent, sink) {
        if (core.identical(this[_previous], _SENTINEL)) {
          this[_previous] = inputEvent;
          return sink._add(inputEvent);
        } else {
          let isEqual = null;
          try {
            if (this[_equals] === null) {
              isEqual = dart.equals(this[_previous], inputEvent);
            } else {
              isEqual = this[_equals](dart.as(this[_previous], T), inputEvent);
            }
          } catch (e) {
            let s = dart.stackTrace(e);
            _addErrorWithReplacement(sink, e, s);
            return null;
          }

          if (!dart.notNull(isEqual)) {
            sink._add(inputEvent);
            this[_previous] = inputEvent;
          }
        }
      }
    }
    dart.defineLazyProperties(_DistinctStream, {
      get _SENTINEL() {
        return new core.Object();
      },
      set _SENTINEL(_) {}
    });
    return _DistinctStream;
  });
  let _DistinctStream = _DistinctStream$(dart.dynamic);
  let _EventSinkWrapper$ = dart.generic(function(T) {
    class _EventSinkWrapper extends core.Object {
      _EventSinkWrapper($_sink) {
        this[_sink] = $_sink;
      }
      add(data) {
        this[_sink]._add(data);
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        this[_sink]._addError(error, stackTrace);
      }
      close() {
        this[_sink]._close();
      }
    }
    return _EventSinkWrapper;
  });
  let _EventSinkWrapper = _EventSinkWrapper$(dart.dynamic);
  let _transformerSink = Symbol('_transformerSink');
  let _isSubscribed = Symbol('_isSubscribed');
  let _SinkTransformerStreamSubscription$ = dart.generic(function(S, T) {
    class _SinkTransformerStreamSubscription extends _BufferingStreamSubscription$(T) {
      _SinkTransformerStreamSubscription(source, mapper, onData, onError, onDone, cancelOnError) {
        this[_transformerSink] = null;
        this[_subscription] = null;
        super._BufferingStreamSubscription(onData, onError, onDone, cancelOnError);
        let eventSink = new _EventSinkWrapper(this);
        this[_transformerSink] = mapper(eventSink);
        this[_subscription] = source.listen(this[_handleData], {onError: this[_handleError], onDone: this[_handleDone]});
      }
      get [_isSubscribed]() {
        return this[_subscription] !== null;
      }
      [_add](data) {
        if (this[_isClosed]) {
          throw new core.StateError("Stream is already closed");
        }
        super._add(data);
      }
      [_addError](error, stackTrace) {
        if (this[_isClosed]) {
          throw new core.StateError("Stream is already closed");
        }
        super._addError(error, stackTrace);
      }
      [_close]() {
        if (this[_isClosed]) {
          throw new core.StateError("Stream is already closed");
        }
        super._close();
      }
      [_onPause]() {
        if (this[_isSubscribed])
          this[_subscription].pause();
      }
      [_onResume]() {
        if (this[_isSubscribed])
          this[_subscription].resume();
      }
      [_onCancel]() {
        if (this[_isSubscribed]) {
          let subscription = this[_subscription];
          this[_subscription] = null;
          subscription.cancel();
        }
        return null;
      }
      [_handleData](data) {
        try {
          this[_transformerSink].add(data);
        } catch (e) {
          let s = dart.stackTrace(e);
          this[_addError](e, s);
        }

      }
      [_handleError](error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        try {
          this[_transformerSink].addError(error, dart.as(stackTrace, core.StackTrace));
        } catch (e) {
          let s = dart.stackTrace(e);
          if (core.identical(e, error)) {
            this[_addError](error, dart.as(stackTrace, core.StackTrace));
          } else {
            this[_addError](e, s);
          }
        }

      }
      [_handleDone]() {
        try {
          this[_subscription] = null;
          this[_transformerSink].close();
        } catch (e) {
          let s = dart.stackTrace(e);
          this[_addError](e, s);
        }

      }
    }
    return _SinkTransformerStreamSubscription;
  });
  let _SinkTransformerStreamSubscription = _SinkTransformerStreamSubscription$(dart.dynamic, dart.dynamic);
  let _sinkMapper = Symbol('_sinkMapper');
  let _StreamSinkTransformer$ = dart.generic(function(S, T) {
    class _StreamSinkTransformer extends core.Object {
      _StreamSinkTransformer($_sinkMapper) {
        this[_sinkMapper] = $_sinkMapper;
      }
      bind(stream) {
        return new _BoundSinkStream(stream, this[_sinkMapper]);
      }
    }
    return _StreamSinkTransformer;
  });
  let _StreamSinkTransformer = _StreamSinkTransformer$(dart.dynamic, dart.dynamic);
  let _BoundSinkStream$ = dart.generic(function(S, T) {
    class _BoundSinkStream extends Stream$(T) {
      get isBroadcast() {
        return this[_stream].isBroadcast;
      }
      _BoundSinkStream($_stream, $_sinkMapper) {
        this[_stream] = $_stream;
        this[_sinkMapper] = $_sinkMapper;
        super.Stream();
      }
      listen(onData, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let onDone = opt$.onDone === void 0 ? null : opt$.onDone;
        let cancelOnError = opt$.cancelOnError === void 0 ? null : opt$.cancelOnError;
        cancelOnError = core.identical(true, cancelOnError);
        let subscription = dart.as(new _SinkTransformerStreamSubscription(this[_stream], dart.as(this[_sinkMapper], _SinkMapper), dart.as(onData, dart.throw_("Unimplemented type (dynamic) → void")), onError, onDone, cancelOnError), StreamSubscription$(T));
        return subscription;
      }
    }
    return _BoundSinkStream;
  });
  let _BoundSinkStream = _BoundSinkStream$(dart.dynamic, dart.dynamic);
  let _HandlerEventSink$ = dart.generic(function(S, T) {
    class _HandlerEventSink extends core.Object {
      _HandlerEventSink($_handleData, $_handleError, $_handleDone, $_sink) {
        this[_handleData] = $_handleData;
        this[_handleError] = $_handleError;
        this[_handleDone] = $_handleDone;
        this[_sink] = $_sink;
      }
      add(data) {
        return this[_handleData](data, this[_sink]);
      }
      addError(error, stackTrace) {
        if (stackTrace === void 0)
          stackTrace = null;
        return this[_handleError](error, stackTrace, this[_sink]);
      }
      close() {
        return this[_handleDone](this[_sink]);
      }
    }
    return _HandlerEventSink;
  });
  let _HandlerEventSink = _HandlerEventSink$(dart.dynamic, dart.dynamic);
  let _defaultHandleData = Symbol('_defaultHandleData');
  let _defaultHandleError = Symbol('_defaultHandleError');
  let _defaultHandleDone = Symbol('_defaultHandleDone');
  let _StreamHandlerTransformer$ = dart.generic(function(S, T) {
    class _StreamHandlerTransformer extends _StreamSinkTransformer$(S, T) {
      _StreamHandlerTransformer(opt$) {
        let handleData = opt$.handleData === void 0 ? null : opt$.handleData;
        let handleError = opt$.handleError === void 0 ? null : opt$.handleError;
        let handleDone = opt$.handleDone === void 0 ? null : opt$.handleDone;
        super._StreamSinkTransformer(dart.as((outputSink) => {
          if (handleData === null)
            handleData = _defaultHandleData;
          if (handleError === null)
            handleError = _defaultHandleError;
          if (handleDone === null)
            handleDone = _defaultHandleDone;
          return new _HandlerEventSink(handleData, handleError, handleDone, outputSink);
        }, _SinkMapper));
      }
      bind(stream) {
        return super.bind(stream);
      }
      static [_defaultHandleData](data, sink) {
        sink.add(data);
      }
      static [_defaultHandleError](error, stackTrace, sink) {
        sink.addError(error);
      }
      static [_defaultHandleDone](sink) {
        sink.close();
      }
    }
    return _StreamHandlerTransformer;
  });
  let _StreamHandlerTransformer = _StreamHandlerTransformer$(dart.dynamic, dart.dynamic);
  let _transformer = Symbol('_transformer');
  let _StreamSubscriptionTransformer$ = dart.generic(function(S, T) {
    class _StreamSubscriptionTransformer extends core.Object {
      _StreamSubscriptionTransformer($_transformer) {
        this[_transformer] = $_transformer;
      }
      bind(stream) {
        return new _BoundSubscriptionStream(stream, this[_transformer]);
      }
    }
    return _StreamSubscriptionTransformer;
  });
  let _StreamSubscriptionTransformer = _StreamSubscriptionTransformer$(dart.dynamic, dart.dynamic);
  let _BoundSubscriptionStream$ = dart.generic(function(S, T) {
    class _BoundSubscriptionStream extends Stream$(T) {
      _BoundSubscriptionStream($_stream, $_transformer) {
        this[_stream] = $_stream;
        this[_transformer] = $_transformer;
        super.Stream();
      }
      listen(onData, opt$) {
        let onError = opt$.onError === void 0 ? null : opt$.onError;
        let onDone = opt$.onDone === void 0 ? null : opt$.onDone;
        let cancelOnError = opt$.cancelOnError === void 0 ? null : opt$.cancelOnError;
        cancelOnError = core.identical(true, cancelOnError);
        let result = this[_transformer](this[_stream], cancelOnError);
        result.onData(onData);
        result.onError(onError);
        result.onDone(onDone);
        return result;
      }
    }
    return _BoundSubscriptionStream;
  });
  let _BoundSubscriptionStream = _BoundSubscriptionStream$(dart.dynamic, dart.dynamic);
  let _createTimer = Symbol('_createTimer');
  let _createPeriodicTimer = Symbol('_createPeriodicTimer');
  class Timer extends core.Object {
    Timer(duration, callback) {
      if (dart.equals(Zone.current, Zone.ROOT)) {
        return Zone.current.createTimer(duration, callback);
      }
      return Zone.current.createTimer(duration, Zone.current.bindCallback(callback, {runGuarded: true}));
    }
    Timer$periodic(duration, callback) {
      if (dart.equals(Zone.current, Zone.ROOT)) {
        return Zone.current.createPeriodicTimer(duration, callback);
      }
      return Zone.current.createPeriodicTimer(duration, Zone.current.bindUnaryCallback(dart.as(callback, dart.throw_("Unimplemented type (dynamic) → dynamic")), {runGuarded: true}));
    }
    static run(callback) {
      new Timer(core.Duration.ZERO, callback);
    }
    static [_createTimer](duration, callback) {
      let milliseconds = duration.inMilliseconds;
      if (dart.notNull(milliseconds) < 0)
        milliseconds = 0;
      return new _isolate_helper.TimerImpl(milliseconds, callback);
    }
    static [_createPeriodicTimer](duration, callback) {
      let milliseconds = duration.inMilliseconds;
      if (dart.notNull(milliseconds) < 0)
        milliseconds = 0;
      return new _isolate_helper.TimerImpl.periodic(milliseconds, callback);
    }
  }
  dart.defineNamedConstructor(Timer, 'periodic');
  class AsyncError extends core.Object {
    AsyncError(error, stackTrace) {
      this.error = error;
      this.stackTrace = stackTrace;
    }
    toString() {
      return dart.as(dart.dinvoke(this.error, 'toString'), core.String);
    }
  }
  class _ZoneFunction extends core.Object {
    _ZoneFunction(zone, function) {
      this.zone = zone;
      this['function'] = function;
    }
  }
  class ZoneSpecification extends core.Object {
    ZoneSpecification(opt$) {
      return new _ZoneSpecification(opt$);
    }
    ZoneSpecification$from(other, opt$) {
      let handleUncaughtError = opt$.handleUncaughtError === void 0 ? null : opt$.handleUncaughtError;
      let run = opt$.run === void 0 ? null : opt$.run;
      let runUnary = opt$.runUnary === void 0 ? null : opt$.runUnary;
      let runBinary = opt$.runBinary === void 0 ? null : opt$.runBinary;
      let registerCallback = opt$.registerCallback === void 0 ? null : opt$.registerCallback;
      let registerUnaryCallback = opt$.registerUnaryCallback === void 0 ? null : opt$.registerUnaryCallback;
      let registerBinaryCallback = opt$.registerBinaryCallback === void 0 ? null : opt$.registerBinaryCallback;
      let errorCallback = opt$.errorCallback === void 0 ? null : opt$.errorCallback;
      let scheduleMicrotask = opt$.scheduleMicrotask === void 0 ? null : opt$.scheduleMicrotask;
      let createTimer = opt$.createTimer === void 0 ? null : opt$.createTimer;
      let createPeriodicTimer = opt$.createPeriodicTimer === void 0 ? null : opt$.createPeriodicTimer;
      let print = opt$.print === void 0 ? null : opt$.print;
      let fork = opt$.fork === void 0 ? null : opt$.fork;
      return new ZoneSpecification({handleUncaughtError: dart.as(handleUncaughtError !== null ? handleUncaughtError : other.handleUncaughtError, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, dynamic, StackTrace) → dynamic")), run: dart.as(run !== null ? run : other.run, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, () → dynamic) → dynamic")), runUnary: dart.as(runUnary !== null ? runUnary : other.runUnary, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, (dynamic) → dynamic, dynamic) → dynamic")), runBinary: dart.as(runBinary !== null ? runBinary : other.runBinary, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, (dynamic, dynamic) → dynamic, dynamic, dynamic) → dynamic")), registerCallback: dart.as(registerCallback !== null ? registerCallback : other.registerCallback, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, () → dynamic) → ZoneCallback")), registerUnaryCallback: dart.as(registerUnaryCallback !== null ? registerUnaryCallback : other.registerUnaryCallback, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, (dynamic) → dynamic) → ZoneUnaryCallback")), registerBinaryCallback: dart.as(registerBinaryCallback !== null ? registerBinaryCallback : other.registerBinaryCallback, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, (dynamic, dynamic) → dynamic) → ZoneBinaryCallback")), errorCallback: dart.as(errorCallback !== null ? errorCallback : other.errorCallback, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, Object, StackTrace) → AsyncError")), scheduleMicrotask: dart.as(scheduleMicrotask !== null ? scheduleMicrotask : other.scheduleMicrotask, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, () → dynamic) → void")), createTimer: dart.as(createTimer !== null ? createTimer : other.createTimer, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, Duration, () → void) → Timer")), createPeriodicTimer: dart.as(createPeriodicTimer !== null ? createPeriodicTimer : other.createPeriodicTimer, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, Duration, (Timer) → void) → Timer")), print: dart.as(print !== null ? print : other.print, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, String) → void")), fork: dart.as(fork !== null ? fork : other.fork, dart.throw_("Unimplemented type (Zone, ZoneDelegate, Zone, ZoneSpecification, Map<dynamic, dynamic>) → Zone"))});
    }
  }
  dart.defineNamedConstructor(ZoneSpecification, 'from');
  class _ZoneSpecification extends core.Object {
    _ZoneSpecification(opt$) {
      let handleUncaughtError = opt$.handleUncaughtError === void 0 ? null : opt$.handleUncaughtError;
      let run = opt$.run === void 0 ? null : opt$.run;
      let runUnary = opt$.runUnary === void 0 ? null : opt$.runUnary;
      let runBinary = opt$.runBinary === void 0 ? null : opt$.runBinary;
      let registerCallback = opt$.registerCallback === void 0 ? null : opt$.registerCallback;
      let registerUnaryCallback = opt$.registerUnaryCallback === void 0 ? null : opt$.registerUnaryCallback;
      let registerBinaryCallback = opt$.registerBinaryCallback === void 0 ? null : opt$.registerBinaryCallback;
      let errorCallback = opt$.errorCallback === void 0 ? null : opt$.errorCallback;
      let scheduleMicrotask = opt$.scheduleMicrotask === void 0 ? null : opt$.scheduleMicrotask;
      let createTimer = opt$.createTimer === void 0 ? null : opt$.createTimer;
      let createPeriodicTimer = opt$.createPeriodicTimer === void 0 ? null : opt$.createPeriodicTimer;
      let print = opt$.print === void 0 ? null : opt$.print;
      let fork = opt$.fork === void 0 ? null : opt$.fork;
      this.handleUncaughtError = handleUncaughtError;
      this.run = run;
      this.runUnary = runUnary;
      this.runBinary = runBinary;
      this.registerCallback = registerCallback;
      this.registerUnaryCallback = registerUnaryCallback;
      this.registerBinaryCallback = registerBinaryCallback;
      this.errorCallback = errorCallback;
      this.scheduleMicrotask = scheduleMicrotask;
      this.createTimer = createTimer;
      this.createPeriodicTimer = createPeriodicTimer;
      this.print = print;
      this.fork = fork;
    }
  }
  class ZoneDelegate extends core.Object {
  }
  let _enter = Symbol('_enter');
  let _leave = Symbol('_leave');
  class Zone extends core.Object {
    Zone$_() {
    }
    static get current() {
      return _current;
    }
    static [_enter](zone) {
      dart.assert(zone !== null);
      dart.assert(!dart.notNull(core.identical(zone, _current)));
      let previous = _current;
      _current = zone;
      return previous;
    }
    static [_leave](previous) {
      dart.assert(previous !== null);
      Zone[_current] = previous;
    }
  }
  dart.defineNamedConstructor(Zone, '_');
  Zone.ROOT = dart.as(_ROOT_ZONE, Zone);
  Zone._current = dart.as(_ROOT_ZONE, Zone);
  let _delegate = Symbol('_delegate');
  // Function _parentDelegate: (_Zone) → ZoneDelegate
  function _parentDelegate(zone) {
    if (zone.parent === null)
      return null;
    return zone.parent[_delegate];
  }
  let _delegationTarget = Symbol('_delegationTarget');
  let _handleUncaughtError = Symbol('_handleUncaughtError');
  let _run = Symbol('_run');
  let _runUnary = Symbol('_runUnary');
  let _runBinary = Symbol('_runBinary');
  let _registerCallback = Symbol('_registerCallback');
  let _registerUnaryCallback = Symbol('_registerUnaryCallback');
  let _registerBinaryCallback = Symbol('_registerBinaryCallback');
  let _errorCallback = Symbol('_errorCallback');
  let _scheduleMicrotask = Symbol('_scheduleMicrotask');
  let _print = Symbol('_print');
  let _fork = Symbol('_fork');
  class _ZoneDelegate extends core.Object {
    _ZoneDelegate($_delegationTarget) {
      this[_delegationTarget] = $_delegationTarget;
    }
    handleUncaughtError(zone, error, stackTrace) {
      let implementation = this[_delegationTarget][_handleUncaughtError];
      let implZone = implementation.zone;
      return dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, error, stackTrace);
    }
    run(zone, f) {
      let implementation = this[_delegationTarget][_run];
      let implZone = implementation.zone;
      return dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f);
    }
    runUnary(zone, f, arg) {
      let implementation = this[_delegationTarget][_runUnary];
      let implZone = implementation.zone;
      return dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f, arg);
    }
    runBinary(zone, f, arg1, arg2) {
      let implementation = this[_delegationTarget][_runBinary];
      let implZone = implementation.zone;
      return dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f, arg1, arg2);
    }
    registerCallback(zone, f) {
      let implementation = this[_delegationTarget][_registerCallback];
      let implZone = implementation.zone;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f), ZoneCallback);
    }
    registerUnaryCallback(zone, f) {
      let implementation = this[_delegationTarget][_registerUnaryCallback];
      let implZone = implementation.zone;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f), ZoneUnaryCallback);
    }
    registerBinaryCallback(zone, f) {
      let implementation = this[_delegationTarget][_registerBinaryCallback];
      let implZone = implementation.zone;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f), ZoneBinaryCallback);
    }
    errorCallback(zone, error, stackTrace) {
      let implementation = this[_delegationTarget][_errorCallback];
      let implZone = implementation.zone;
      if (core.identical(implZone, _ROOT_ZONE))
        return null;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, error, stackTrace), AsyncError);
    }
    scheduleMicrotask(zone, f) {
      let implementation = this[_delegationTarget][_scheduleMicrotask];
      let implZone = implementation.zone;
      dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, f);
    }
    createTimer(zone, duration, f) {
      let implementation = this[_delegationTarget][_createTimer];
      let implZone = implementation.zone;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, duration, f), Timer);
    }
    createPeriodicTimer(zone, period, f) {
      let implementation = this[_delegationTarget][_createPeriodicTimer];
      let implZone = implementation.zone;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, period, f), Timer);
    }
    print(zone, line) {
      let implementation = this[_delegationTarget][_print];
      let implZone = implementation.zone;
      dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, line);
    }
    fork(zone, specification, zoneValues) {
      let implementation = this[_delegationTarget][_fork];
      let implZone = implementation.zone;
      return dart.as(dart.dinvokef(implementation['function'], implZone, _parentDelegate(implZone), zone, specification, zoneValues), Zone);
    }
  }
  class _Zone extends core.Object {
    _Zone() {
    }
    inSameErrorZone(otherZone) {
      return dart.notNull(core.identical(this, otherZone)) || dart.notNull(core.identical(this.errorZone, otherZone.errorZone));
    }
  }
  let _delegateCache = Symbol('_delegateCache');
  let _map = Symbol('_map');
  class _CustomZone extends _Zone {
    get [_delegate]() {
      if (this[_delegateCache] !== null)
        return this[_delegateCache];
      this[_delegateCache] = new _ZoneDelegate(this);
      return this[_delegateCache];
    }
    _CustomZone(parent, specification, $_map) {
      this.parent = parent;
      this[_map] = $_map;
      this[_runUnary] = null;
      this[_run] = null;
      this[_runBinary] = null;
      this[_registerCallback] = null;
      this[_registerUnaryCallback] = null;
      this[_registerBinaryCallback] = null;
      this[_errorCallback] = null;
      this[_scheduleMicrotask] = null;
      this[_createTimer] = null;
      this[_createPeriodicTimer] = null;
      this[_print] = null;
      this[_fork] = null;
      this[_handleUncaughtError] = null;
      this[_delegateCache] = null;
      super._Zone();
      this[_run] = specification.run !== null ? new _ZoneFunction(this, specification.run) : this.parent[_run];
      this[_runUnary] = specification.runUnary !== null ? new _ZoneFunction(this, specification.runUnary) : this.parent[_runUnary];
      this[_runBinary] = specification.runBinary !== null ? new _ZoneFunction(this, specification.runBinary) : this.parent[_runBinary];
      this[_registerCallback] = specification.registerCallback !== null ? new _ZoneFunction(this, specification.registerCallback) : this.parent[_registerCallback];
      this[_registerUnaryCallback] = specification.registerUnaryCallback !== null ? new _ZoneFunction(this, specification.registerUnaryCallback) : this.parent[_registerUnaryCallback];
      this[_registerBinaryCallback] = specification.registerBinaryCallback !== null ? new _ZoneFunction(this, specification.registerBinaryCallback) : this.parent[_registerBinaryCallback];
      this[_errorCallback] = specification.errorCallback !== null ? new _ZoneFunction(this, specification.errorCallback) : this.parent[_errorCallback];
      this[_scheduleMicrotask] = specification.scheduleMicrotask !== null ? new _ZoneFunction(this, specification.scheduleMicrotask) : this.parent[_scheduleMicrotask];
      this[_createTimer] = specification.createTimer !== null ? new _ZoneFunction(this, specification.createTimer) : this.parent[_createTimer];
      this[_createPeriodicTimer] = specification.createPeriodicTimer !== null ? new _ZoneFunction(this, specification.createPeriodicTimer) : this.parent[_createPeriodicTimer];
      this[_print] = specification.print !== null ? new _ZoneFunction(this, specification.print) : this.parent[_print];
      this[_fork] = specification.fork !== null ? new _ZoneFunction(this, specification.fork) : this.parent[_fork];
      this[_handleUncaughtError] = specification.handleUncaughtError !== null ? new _ZoneFunction(this, specification.handleUncaughtError) : this.parent[_handleUncaughtError];
    }
    get errorZone() {
      return this[_handleUncaughtError].zone;
    }
    runGuarded(f) {
      try {
        return this.run(f);
      } catch (e) {
        let s = dart.stackTrace(e);
        return this.handleUncaughtError(e, s);
      }

    }
    runUnaryGuarded(f, arg) {
      try {
        return this.runUnary(f, arg);
      } catch (e) {
        let s = dart.stackTrace(e);
        return this.handleUncaughtError(e, s);
      }

    }
    runBinaryGuarded(f, arg1, arg2) {
      try {
        return this.runBinary(f, arg1, arg2);
      } catch (e) {
        let s = dart.stackTrace(e);
        return this.handleUncaughtError(e, s);
      }

    }
    bindCallback(f, opt$) {
      let runGuarded = opt$.runGuarded === void 0 ? true : opt$.runGuarded;
      let registered = this.registerCallback(f);
      if (runGuarded) {
        return (() => this.runGuarded(registered)).bind(this);
      } else {
        return (() => this.run(registered)).bind(this);
      }
    }
    bindUnaryCallback(f, opt$) {
      let runGuarded = opt$.runGuarded === void 0 ? true : opt$.runGuarded;
      let registered = this.registerUnaryCallback(f);
      if (runGuarded) {
        return ((arg) => this.runUnaryGuarded(registered, arg)).bind(this);
      } else {
        return ((arg) => this.runUnary(registered, arg)).bind(this);
      }
    }
    bindBinaryCallback(f, opt$) {
      let runGuarded = opt$.runGuarded === void 0 ? true : opt$.runGuarded;
      let registered = this.registerBinaryCallback(f);
      if (runGuarded) {
        return ((arg1, arg2) => this.runBinaryGuarded(registered, arg1, arg2)).bind(this);
      } else {
        return ((arg1, arg2) => this.runBinary(registered, arg1, arg2)).bind(this);
      }
    }
    get(key) {
      let result = this[_map].get(key);
      if (dart.notNull(result !== null) || dart.notNull(this[_map].containsKey(key)))
        return result;
      if (this.parent !== null) {
        let value = this.parent.get(key);
        if (value !== null) {
          this[_map].set(key, value);
        }
        return value;
      }
      dart.assert(dart.equals(this, _ROOT_ZONE));
      return null;
    }
    handleUncaughtError(error, stackTrace) {
      let implementation = this[_handleUncaughtError];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, error, stackTrace);
    }
    fork(opt$) {
      let specification = opt$.specification === void 0 ? null : opt$.specification;
      let zoneValues = opt$.zoneValues === void 0 ? null : opt$.zoneValues;
      let implementation = this[_fork];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.as(dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, specification, zoneValues), Zone);
    }
    run(f) {
      let implementation = this[_run];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f);
    }
    runUnary(f, arg) {
      let implementation = this[_runUnary];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f, arg);
    }
    runBinary(f, arg1, arg2) {
      let implementation = this[_runBinary];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f, arg1, arg2);
    }
    registerCallback(f) {
      let implementation = this[_registerCallback];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.as(dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f), ZoneCallback);
    }
    registerUnaryCallback(f) {
      let implementation = this[_registerUnaryCallback];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.as(dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f), ZoneUnaryCallback);
    }
    registerBinaryCallback(f) {
      let implementation = this[_registerBinaryCallback];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.as(dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f), ZoneBinaryCallback);
    }
    errorCallback(error, stackTrace) {
      let implementation = this[_errorCallback];
      dart.assert(implementation !== null);
      let implementationZone = implementation.zone;
      if (core.identical(implementationZone, _ROOT_ZONE))
        return null;
      let parentDelegate = _parentDelegate(dart.as(implementationZone, _Zone));
      return dart.as(dart.dinvokef(implementation['function'], implementationZone, parentDelegate, this, error, stackTrace), AsyncError);
    }
    scheduleMicrotask(f) {
      let implementation = this[_scheduleMicrotask];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, f);
    }
    createTimer(duration, f) {
      let implementation = this[_createTimer];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.as(dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, duration, f), Timer);
    }
    createPeriodicTimer(duration, f) {
      let implementation = this[_createPeriodicTimer];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.as(dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, duration, f), Timer);
    }
    print(line) {
      let implementation = this[_print];
      dart.assert(implementation !== null);
      let parentDelegate = _parentDelegate(implementation.zone);
      return dart.dinvokef(implementation['function'], implementation.zone, parentDelegate, this, line);
    }
  }
  // Function _rootHandleUncaughtError: (Zone, ZoneDelegate, Zone, dynamic, StackTrace) → void
  function _rootHandleUncaughtError(self, parent, zone, error, stackTrace) {
    _schedulePriorityAsyncCallback(() => {
      throw new _UncaughtAsyncError(error, stackTrace);
    });
  }
  // Function _rootRun: (Zone, ZoneDelegate, Zone, () → dynamic) → dynamic
  function _rootRun(self, parent, zone, f) {
    if (dart.equals(Zone[_current], zone))
      return f();
    let old = Zone._enter(zone);
    try {
      return f();
    } finally {
      Zone._leave(old);
    }
  }
  // Function _rootRunUnary: (Zone, ZoneDelegate, Zone, (dynamic) → dynamic, dynamic) → dynamic
  function _rootRunUnary(self, parent, zone, f, arg) {
    if (dart.equals(Zone[_current], zone))
      return f(arg);
    let old = Zone._enter(zone);
    try {
      return f(arg);
    } finally {
      Zone._leave(old);
    }
  }
  // Function _rootRunBinary: (Zone, ZoneDelegate, Zone, (dynamic, dynamic) → dynamic, dynamic, dynamic) → dynamic
  function _rootRunBinary(self, parent, zone, f, arg1, arg2) {
    if (dart.equals(Zone[_current], zone))
      return f(arg1, arg2);
    let old = Zone._enter(zone);
    try {
      return f(arg1, arg2);
    } finally {
      Zone._leave(old);
    }
  }
  // Function _rootRegisterCallback: (Zone, ZoneDelegate, Zone, () → dynamic) → ZoneCallback
  function _rootRegisterCallback(self, parent, zone, f) {
    return f;
  }
  // Function _rootRegisterUnaryCallback: (Zone, ZoneDelegate, Zone, (dynamic) → dynamic) → ZoneUnaryCallback
  function _rootRegisterUnaryCallback(self, parent, zone, f) {
    return f;
  }
  // Function _rootRegisterBinaryCallback: (Zone, ZoneDelegate, Zone, (dynamic, dynamic) → dynamic) → ZoneBinaryCallback
  function _rootRegisterBinaryCallback(self, parent, zone, f) {
    return f;
  }
  // Function _rootErrorCallback: (Zone, ZoneDelegate, Zone, Object, StackTrace) → AsyncError
  function _rootErrorCallback(self, parent, zone, error, stackTrace) {
    return null;
  }
  // Function _rootScheduleMicrotask: (Zone, ZoneDelegate, Zone, () → dynamic) → void
  function _rootScheduleMicrotask(self, parent, zone, f) {
    if (!dart.notNull(core.identical(_ROOT_ZONE, zone))) {
      let hasErrorHandler = dart.dunary('!', dart.dinvoke(_ROOT_ZONE, 'inSameErrorZone', zone));
      f = zone.bindCallback(f, {runGuarded: hasErrorHandler});
    }
    _scheduleAsyncCallback(f);
  }
  // Function _rootCreateTimer: (Zone, ZoneDelegate, Zone, Duration, () → void) → Timer
  function _rootCreateTimer(self, parent, zone, duration, callback) {
    if (!dart.notNull(core.identical(_ROOT_ZONE, zone))) {
      callback = zone.bindCallback(callback);
    }
    return Timer._createTimer(duration, callback);
  }
  // Function _rootCreatePeriodicTimer: (Zone, ZoneDelegate, Zone, Duration, (Timer) → void) → Timer
  function _rootCreatePeriodicTimer(self, parent, zone, duration, callback) {
    if (!dart.notNull(core.identical(_ROOT_ZONE, zone))) {
      callback = zone.bindUnaryCallback(dart.as(callback, dart.throw_("Unimplemented type (dynamic) → dynamic")));
    }
    return Timer._createPeriodicTimer(duration, callback);
  }
  // Function _rootPrint: (Zone, ZoneDelegate, Zone, String) → void
  function _rootPrint(self, parent, zone, line) {
    _internal.printToConsole(line);
  }
  // Function _printToZone: (String) → void
  function _printToZone(line) {
    Zone.current.print(line);
  }
  // Function _rootFork: (Zone, ZoneDelegate, Zone, ZoneSpecification, Map<dynamic, dynamic>) → Zone
  function _rootFork(self, parent, zone, specification, zoneValues) {
    _internal.printToZone = _printToZone;
    if (specification === null) {
      specification = new ZoneSpecification();
    } else if (!dart.is(specification, _ZoneSpecification)) {
      throw new core.ArgumentError("ZoneSpecifications must be instantiated" + " with the provided constructor.");
    }
    let valueMap = null;
    if (zoneValues === null) {
      if (dart.is(zone, _Zone)) {
        valueMap = zone[_map];
      } else {
        valueMap = new collection.HashMap();
      }
    } else {
      valueMap = new collection.HashMap.from(zoneValues);
    }
    return new _CustomZone(dart.as(zone, _Zone), specification, valueMap);
  }
  class _RootZoneSpecification extends core.Object {
    get handleUncaughtError() {
      return _rootHandleUncaughtError;
    }
    get run() {
      return _rootRun;
    }
    get runUnary() {
      return _rootRunUnary;
    }
    get runBinary() {
      return _rootRunBinary;
    }
    get registerCallback() {
      return _rootRegisterCallback;
    }
    get registerUnaryCallback() {
      return _rootRegisterUnaryCallback;
    }
    get registerBinaryCallback() {
      return _rootRegisterBinaryCallback;
    }
    get errorCallback() {
      return _rootErrorCallback;
    }
    get scheduleMicrotask() {
      return _rootScheduleMicrotask;
    }
    get createTimer() {
      return _rootCreateTimer;
    }
    get createPeriodicTimer() {
      return _rootCreatePeriodicTimer;
    }
    get print() {
      return _rootPrint;
    }
    get fork() {
      return _rootFork;
    }
  }
  class _RootZone extends _Zone {
    _RootZone() {
      super._Zone();
    }
    get [_run]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootRun);
    }
    get [_runUnary]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootRunUnary);
    }
    get [_runBinary]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootRunBinary);
    }
    get [_registerCallback]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootRegisterCallback);
    }
    get [_registerUnaryCallback]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootRegisterUnaryCallback);
    }
    get [_registerBinaryCallback]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootRegisterBinaryCallback);
    }
    get [_errorCallback]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootErrorCallback);
    }
    get [_scheduleMicrotask]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootScheduleMicrotask);
    }
    get [_createTimer]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootCreateTimer);
    }
    get [_createPeriodicTimer]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootCreatePeriodicTimer);
    }
    get [_print]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootPrint);
    }
    get [_fork]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootFork);
    }
    get [_handleUncaughtError]() {
      return new _ZoneFunction(dart.as(_ROOT_ZONE, _Zone), _rootHandleUncaughtError);
    }
    get parent() {
      return null;
    }
    get [_map]() {
      return _rootMap;
    }
    get [_delegate]() {
      if (_rootDelegate !== null)
        return _rootDelegate;
      return _rootDelegate = new _ZoneDelegate(this);
    }
    get errorZone() {
      return this;
    }
    runGuarded(f) {
      try {
        if (core.identical(_ROOT_ZONE, Zone[_current])) {
          return f();
        }
        return _rootRun(null, null, this, f);
      } catch (e) {
        let s = dart.stackTrace(e);
        return this.handleUncaughtError(e, s);
      }

    }
    runUnaryGuarded(f, arg) {
      try {
        if (core.identical(_ROOT_ZONE, Zone[_current])) {
          return f(arg);
        }
        return _rootRunUnary(null, null, this, f, arg);
      } catch (e) {
        let s = dart.stackTrace(e);
        return this.handleUncaughtError(e, s);
      }

    }
    runBinaryGuarded(f, arg1, arg2) {
      try {
        if (core.identical(_ROOT_ZONE, Zone[_current])) {
          return f(arg1, arg2);
        }
        return _rootRunBinary(null, null, this, f, arg1, arg2);
      } catch (e) {
        let s = dart.stackTrace(e);
        return this.handleUncaughtError(e, s);
      }

    }
    bindCallback(f, opt$) {
      let runGuarded = opt$.runGuarded === void 0 ? true : opt$.runGuarded;
      if (runGuarded) {
        return (() => this.runGuarded(f)).bind(this);
      } else {
        return (() => this.run(f)).bind(this);
      }
    }
    bindUnaryCallback(f, opt$) {
      let runGuarded = opt$.runGuarded === void 0 ? true : opt$.runGuarded;
      if (runGuarded) {
        return ((arg) => this.runUnaryGuarded(f, arg)).bind(this);
      } else {
        return ((arg) => this.runUnary(f, arg)).bind(this);
      }
    }
    bindBinaryCallback(f, opt$) {
      let runGuarded = opt$.runGuarded === void 0 ? true : opt$.runGuarded;
      if (runGuarded) {
        return ((arg1, arg2) => this.runBinaryGuarded(f, arg1, arg2)).bind(this);
      } else {
        return ((arg1, arg2) => this.runBinary(f, arg1, arg2)).bind(this);
      }
    }
    get(key) {
      return null;
    }
    handleUncaughtError(error, stackTrace) {
      return _rootHandleUncaughtError(null, null, this, error, stackTrace);
    }
    fork(opt$) {
      let specification = opt$.specification === void 0 ? null : opt$.specification;
      let zoneValues = opt$.zoneValues === void 0 ? null : opt$.zoneValues;
      return _rootFork(null, null, this, specification, zoneValues);
    }
    run(f) {
      if (core.identical(Zone[_current], _ROOT_ZONE))
        return f();
      return _rootRun(null, null, this, f);
    }
    runUnary(f, arg) {
      if (core.identical(Zone[_current], _ROOT_ZONE))
        return f(arg);
      return _rootRunUnary(null, null, this, f, arg);
    }
    runBinary(f, arg1, arg2) {
      if (core.identical(Zone[_current], _ROOT_ZONE))
        return f(arg1, arg2);
      return _rootRunBinary(null, null, this, f, arg1, arg2);
    }
    registerCallback(f) {
      return f;
    }
    registerUnaryCallback(f) {
      return f;
    }
    registerBinaryCallback(f) {
      return f;
    }
    errorCallback(error, stackTrace) {
      return null;
    }
    scheduleMicrotask(f) {
      _rootScheduleMicrotask(null, null, this, f);
    }
    createTimer(duration, f) {
      return Timer._createTimer(duration, f);
    }
    createPeriodicTimer(duration, f) {
      return Timer._createPeriodicTimer(duration, f);
    }
    print(line) {
      _internal.printToConsole(line);
    }
  }
  _RootZone._rootDelegate = null;
  dart.defineLazyProperties(_RootZone, {
    get _rootMap() {
      return new collection.HashMap();
    },
    set _rootMap(_) {}
  });
  let _ROOT_ZONE = new _RootZone();
  // Function runZoned: (() → dynamic, {zoneValues: Map<dynamic, dynamic>, zoneSpecification: ZoneSpecification, onError: Function}) → dynamic
  function runZoned(body, opt$) {
    let zoneValues = opt$.zoneValues === void 0 ? null : opt$.zoneValues;
    let zoneSpecification = opt$.zoneSpecification === void 0 ? null : opt$.zoneSpecification;
    let onError = opt$.onError === void 0 ? null : opt$.onError;
    let errorHandler = null;
    if (onError !== null) {
      errorHandler = (self, parent, zone, error, stackTrace) => {
        try {
          if (dart.is(onError, ZoneBinaryCallback)) {
            return self.parent.runBinary(onError, error, stackTrace);
          }
          return self.parent.runUnary(dart.as(onError, dart.throw_("Unimplemented type (dynamic) → dynamic")), error);
        } catch (e) {
          let s = dart.stackTrace(e);
          if (core.identical(e, error)) {
            return parent.handleUncaughtError(zone, error, stackTrace);
          } else {
            return parent.handleUncaughtError(zone, e, s);
          }
        }

      };
    }
    if (zoneSpecification === null) {
      zoneSpecification = new ZoneSpecification({handleUncaughtError: errorHandler});
    } else if (errorHandler !== null) {
      zoneSpecification = new ZoneSpecification.from(zoneSpecification, {handleUncaughtError: errorHandler});
    }
    let zone = Zone.current.fork({specification: zoneSpecification, zoneValues: zoneValues});
    if (onError !== null) {
      return zone.runGuarded(body);
    } else {
      return zone.run(body);
    }
  }
  dart.copyProperties(exports, {
    get _hasDocument() {
      return dart.equals(typeof document, 'object');
    }
  });
  // Exports:
  exports.DeferredLibrary = DeferredLibrary;
  exports.DeferredLoadException = DeferredLoadException;
  exports.Future = Future;
  exports.Future$ = Future$;
  exports.TimeoutException = TimeoutException;
  exports.Completer = Completer;
  exports.Completer$ = Completer$;
  exports.scheduleMicrotask = scheduleMicrotask;
  exports.Stream = Stream;
  exports.Stream$ = Stream$;
  exports.StreamSubscription = StreamSubscription;
  exports.StreamSubscription$ = StreamSubscription$;
  exports.EventSink = EventSink;
  exports.EventSink$ = EventSink$;
  exports.StreamView = StreamView;
  exports.StreamView$ = StreamView$;
  exports.StreamConsumer = StreamConsumer;
  exports.StreamConsumer$ = StreamConsumer$;
  exports.StreamSink = StreamSink;
  exports.StreamSink$ = StreamSink$;
  exports.StreamTransformer = StreamTransformer;
  exports.StreamTransformer$ = StreamTransformer$;
  exports.StreamIterator = StreamIterator;
  exports.StreamIterator$ = StreamIterator$;
  exports.StreamController = StreamController;
  exports.StreamController$ = StreamController$;
  exports.Timer = Timer;
  exports.AsyncError = AsyncError;
  exports.ZoneSpecification = ZoneSpecification;
  exports.ZoneDelegate = ZoneDelegate;
  exports.Zone = Zone;
  exports.runZoned = runZoned;
})(async || (async = {}));