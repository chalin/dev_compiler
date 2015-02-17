var collection;
(function (collection) {
  'use strict';
  let LinkedHashSetIterator$ = dart.generic(function(E) {
    class LinkedHashSetIterator {
      constructor(_set, _modifications) {
        this._set = _set;
        this._modifications = _modifications;
        this._cell = null;
        this._current = dart.as(null, E);
        this._cell = dart.as(dart.dload(this._set, "_first"), LinkedHashSetCell);
      }
      get current() { return this._current; }
      moveNext() {
        if (this._modifications !== dart.dload(this._set, "_modifications")) {
          throw new core.ConcurrentModificationError(this._set);
        } else if (this._cell === null) {
          this._current = dart.as(null, E);
          return false;
        } else {
          this._current = dart.as(this._cell._element, E);
          this._cell = this._cell._next;
          return true;
        }
      }
    }
    return LinkedHashSetIterator;
  });
  let LinkedHashSetIterator = LinkedHashSetIterator$(dynamic);

  class LinkedHashSetCell {
    constructor(_element) {
      this._element = _element;
      this._next = null;
      this._previous = null;
    }
  }

  let _LinkedCustomHashSet$ = dart.generic(function(E) {
    class _LinkedCustomHashSet extends _LinkedHashSet$(E) {
      constructor(_equality, _hasher, validKey) {
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey !== null) ? validKey : ((x) => dart.is(x, E));
        super();
      }
      _newSet() { return new _LinkedCustomHashSet(this._equality, this._hasher, this._validKey); }
      _findBucketIndex(bucket, element) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), LinkedHashSetCell);
          if (this._equality(dart.as(cell._element, E), dart.as(element, E))) return i;
        }
        return -1;
      }
      _computeHashCode(element) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', this._hasher(dart.as(element, E))), core.int);
      }
      add(element) { return super._add(element); }
      contains(object) {
        if (!this._validKey(object)) return false;
        return super._contains(object);
      }
      lookup(object) {
        if (!this._validKey(object)) return dart.as(null, E);
        return super._lookup(object);
      }
      remove(object) {
        if (!this._validKey(object)) return false;
        return super._remove(object);
      }
      containsAll(elements) {
        for (let element of elements) {
          if (!this._validKey(element) || !this.contains(element)) return false;
        }
        return true;
      }
      removeAll(elements) {
        for (let element of elements) {
          if (this._validKey(element)) {
            super._remove(element);
          }
        }
      }
    }
    return _LinkedCustomHashSet;
  });
  let _LinkedCustomHashSet = _LinkedCustomHashSet$(dynamic);

  let _LinkedIdentityHashSet$ = dart.generic(function(E) {
    class _LinkedIdentityHashSet extends _LinkedHashSet$(E) {
      _newSet() { return new _LinkedIdentityHashSet(); }
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', core.identityHashCode(key)), core.int);
      }
      _findBucketIndex(bucket, element) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), LinkedHashSetCell);
          if (core.identical(cell._element, element)) return i;
        }
        return -1;
      }
    }
    return _LinkedIdentityHashSet;
  });
  let _LinkedIdentityHashSet = _LinkedIdentityHashSet$(dynamic);

  let _LinkedHashSet$ = dart.generic(function(E) {
    class _LinkedHashSet extends _HashSetBase$(E) {
      constructor() {
        this._length = 0;
        this._strings = null;
        this._nums = null;
        this._rest = null;
        this._first = null;
        this._last = null;
        this._modifications = 0;
        super();
      }
      _newSet() { return new _LinkedHashSet(); }
      _unsupported(operation) {
        throw `LinkedHashSet: unsupported ${operation}`;
      }
      get iterator() {
        return dart.as(new LinkedHashSetIterator(this, this._modifications), core.Iterator$(E));
      }
      get length() { return this._length; }
      get isEmpty() { return this._length === 0; }
      get isNotEmpty() { return !this.isEmpty; }
      contains(object) {
        if (_isStringElement(object)) {
          let strings = this._strings;
          if (strings === null) return false;
          let cell = dart.as(_getTableEntry(strings, object), LinkedHashSetCell);
          return cell !== null;
        } else if (_isNumericElement(object)) {
          let nums = this._nums;
          if (nums === null) return false;
          let cell = dart.as(_getTableEntry(nums, object), LinkedHashSetCell);
          return cell !== null;
        } else {
          return this._contains(object);
        }
      }
      _contains(object) {
        let rest = this._rest;
        if (rest === null) return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
      }
      lookup(object) {
        if (_isStringElement(object) || _isNumericElement(object)) {
          return dart.as(this.contains(object) ? object : null, E);
        } else {
          return this._lookup(object);
        }
      }
      _lookup(object) {
        let rest = this._rest;
        if (rest === null) return dart.as(null, E);
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return dart.as(null, E);
        return dart.as(dart.dload(bucket.get(index), "_element"), E);
      }
      forEach(action) {
        let cell = this._first;
        let modifications = this._modifications;
        while (cell !== null) {
          action(dart.as(cell._element, E));
          if (modifications !== this._modifications) {
            throw new core.ConcurrentModificationError(this);
          }
          cell = cell._next;
        }
      }
      get first() {
        if (this._first === null) throw new core.StateError("No elements");
        return dart.as(this._first._element, E);
      }
      get last() {
        if (this._last === null) throw new core.StateError("No elements");
        return dart.as(this._last._element, E);
      }
      add(element) {
        if (_isStringElement(element)) {
          let strings = this._strings;
          if (strings === null) this._strings = strings = _newHashTable();
          return this._addHashTableEntry(strings, element);
        } else if (_isNumericElement(element)) {
          let nums = this._nums;
          if (nums === null) this._nums = nums = _newHashTable();
          return this._addHashTableEntry(nums, element);
        } else {
          return this._add(element);
        }
      }
      _add(element) {
        let rest = this._rest;
        if (rest === null) this._rest = rest = _newHashTable();
        let hash = this._computeHashCode(element);
        let bucket = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', rest, hash);
        if (bucket === null) {
          let cell = this._newLinkedCell(element);
          _setTableEntry(rest, hash, dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '[#]', cell));
        } else {
          let index = this._findBucketIndex(bucket, element);
          if (index >= 0) return false;
          let cell = this._newLinkedCell(element);
          dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#.push(#)', bucket, cell);
        }
        return true;
      }
      remove(object) {
        if (_isStringElement(object)) {
          return this._removeHashTableEntry(this._strings, object);
        } else if (_isNumericElement(object)) {
          return this._removeHashTableEntry(this._nums, object);
        } else {
          return this._remove(object);
        }
      }
      _remove(object) {
        let rest = this._rest;
        if (rest === null) return false;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return false;
        let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#.splice(#, 1)[0]', bucket, index), LinkedHashSetCell);
        this._unlinkCell(cell);
        return true;
      }
      removeWhere(test) {
        this._filterWhere(test, true);
      }
      retainWhere(test) {
        this._filterWhere(test, false);
      }
      _filterWhere(test, removeMatching) {
        let cell = this._first;
        while (cell !== null) {
          let element = dart.as(cell._element, E);
          let next = cell._next;
          let modifications = this._modifications;
          let shouldRemove = (removeMatching === test(element));
          if (modifications !== this._modifications) {
            throw new core.ConcurrentModificationError(this);
          }
          if (shouldRemove) this.remove(element);
          cell = next;
        }
      }
      clear() {
        if (this._length > 0) {
          this._strings = this._nums = this._rest = this._first = this._last = null;
          this._length = 0;
          this._modified();
        }
      }
      _addHashTableEntry(table, element) {
        let cell = dart.as(_getTableEntry(table, element), LinkedHashSetCell);
        if (cell !== null) return false;
        _setTableEntry(table, element, this._newLinkedCell(element));
        return true;
      }
      _removeHashTableEntry(table, element) {
        if (table === null) return false;
        let cell = dart.as(_getTableEntry(table, element), LinkedHashSetCell);
        if (cell === null) return false;
        this._unlinkCell(cell);
        _deleteTableEntry(table, element);
        return true;
      }
      _modified() {
        this._modifications = (this._modifications + 1) & 67108863;
      }
      _newLinkedCell(element) {
        let cell = new LinkedHashSetCell(element);
        if (this._first === null) {
          this._first = this._last = cell;
        } else {
          let last = this._last;
          cell._previous = last;
          this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
      }
      _unlinkCell(cell) {
        let previous = cell._previous;
        let next = cell._next;
        if (previous === null) {
          dart.assert(dart.equals(cell, this._first));
          this._first = next;
        } else {
          previous._next = next;
        }
        if (next === null) {
          dart.assert(dart.equals(cell, this._last));
          this._last = previous;
        } else {
          next._previous = previous;
        }
        this._length--;
        this._modified();
      }
      static _isStringElement(element) {
        return typeof element == "string" && !dart.equals(element, '__proto__');
      }
      static _isNumericElement(element) {
        return core.bool.&&(dart.is(element, core.num), dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '(# & 0x3ffffff) === #', element, element));
      }
      _computeHashCode(element) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', dart.dload(element, "hashCode")), core.int);
      }
      static _getTableEntry(table, key) {
        return dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, key);
      }
      static _setTableEntry(table, key, value) {
        dart.assert(value !== null);
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', table, key, value);
      }
      static _deleteTableEntry(table, key) {
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', 'delete #[#]', table, key);
      }
      _getBucket(table, element) {
        let hash = this._computeHashCode(element);
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, hash), core.List);
      }
      _findBucketIndex(bucket, element) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), LinkedHashSetCell);
          if (dart.equals(cell._element, element)) return i;
        }
        return -1;
      }
      static _newHashTable() {
        let table = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.create(null)');
        let temporaryKey = '<non-identifier-key>';
        _setTableEntry(table, temporaryKey, table);
        _deleteTableEntry(table, temporaryKey);
        return table;
      }
    }
    return _LinkedHashSet;
  });
  let _LinkedHashSet = _LinkedHashSet$(dynamic);

  let HashSetIterator$ = dart.generic(function(E) {
    class HashSetIterator {
      constructor(_set, _elements) {
        this._set = _set;
        this._elements = _elements;
        this._offset = 0;
        this._current = dart.as(null, E);
      }
      get current() { return this._current; }
      moveNext() {
        let elements = this._elements;
        let offset = this._offset;
        if (dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '# !== #', elements, dart.dload(this._set, "_elements"))) {
          throw new core.ConcurrentModificationError(this._set);
        } else if (offset['>='](dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', elements))) {
          this._current = dart.as(null, E);
          return false;
        } else {
          this._current = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', elements, offset), E);
          this._offset = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#', offset + 1), core.int);
          return true;
        }
      }
    }
    return HashSetIterator;
  });
  let HashSetIterator = HashSetIterator$(dynamic);

  let _CustomHashSet$ = dart.generic(function(E) {
    class _CustomHashSet extends _HashSet$(E) {
      constructor(_equality, _hasher, validKey) {
        this._equality = _equality;
        this._hasher = _hasher;
        this._validKey = (validKey !== null) ? validKey : ((x) => dart.is(x, E));
        super();
      }
      _newSet() { return new _CustomHashSet(this._equality, this._hasher, this._validKey); }
      _findBucketIndex(bucket, element) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          if (this._equality(dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), E), dart.as(element, E))) return i;
        }
        return -1;
      }
      _computeHashCode(element) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', this._hasher(dart.as(element, E))), core.int);
      }
      add(object) { return super._add(object); }
      contains(object) {
        if (!this._validKey(object)) return false;
        return super._contains(object);
      }
      lookup(object) {
        if (!this._validKey(object)) return dart.as(null, E);
        return super._lookup(object);
      }
      remove(object) {
        if (!this._validKey(object)) return false;
        return super._remove(object);
      }
    }
    return _CustomHashSet;
  });
  let _CustomHashSet = _CustomHashSet$(dynamic);

  let _IdentityHashSet$ = dart.generic(function(E) {
    class _IdentityHashSet extends _HashSet$(E) {
      _newSet() { return new _IdentityHashSet(); }
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', core.identityHashCode(key)), core.int);
      }
      _findBucketIndex(bucket, element) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          if (core.identical(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), element)) return i;
        }
        return -1;
      }
    }
    return _IdentityHashSet;
  });
  let _IdentityHashSet = _IdentityHashSet$(dynamic);

  let _HashSet$ = dart.generic(function(E) {
    class _HashSet extends _HashSetBase$(E) {
      constructor() {
        this._length = 0;
        this._strings = null;
        this._nums = null;
        this._rest = null;
        this._elements = null;
        super();
      }
      _newSet() { return new _HashSet(); }
      get iterator() {
        return new HashSetIterator(this, this._computeElements());
      }
      get length() { return this._length; }
      get isEmpty() { return this._length === 0; }
      get isNotEmpty() { return !this.isEmpty; }
      contains(object) {
        if (_isStringElement(object)) {
          let strings = this._strings;
          return (strings === null) ? false : _hasTableEntry(strings, object);
        } else if (_isNumericElement(object)) {
          let nums = this._nums;
          return (nums === null) ? false : _hasTableEntry(nums, object);
        } else {
          return this._contains(object);
        }
      }
      _contains(object) {
        let rest = this._rest;
        if (rest === null) return false;
        let bucket = this._getBucket(rest, object);
        return this._findBucketIndex(bucket, object) >= 0;
      }
      lookup(object) {
        if (_isStringElement(object) || _isNumericElement(object)) {
          return dart.as(this.contains(object) ? object : null, E);
        }
        return this._lookup(object);
      }
      _lookup(object) {
        let rest = this._rest;
        if (rest === null) return dart.as(null, E);
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return dart.as(null, E);
        return dart.as(bucket.get(index), E);
      }
      add(element) {
        if (_isStringElement(element)) {
          let strings = this._strings;
          if (strings === null) this._strings = strings = _newHashTable();
          return this._addHashTableEntry(strings, element);
        } else if (_isNumericElement(element)) {
          let nums = this._nums;
          if (nums === null) this._nums = nums = _newHashTable();
          return this._addHashTableEntry(nums, element);
        } else {
          return this._add(element);
        }
      }
      _add(element) {
        let rest = this._rest;
        if (rest === null) this._rest = rest = _newHashTable();
        let hash = this._computeHashCode(element);
        let bucket = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', rest, hash);
        if (bucket === null) {
          _setTableEntry(rest, hash, dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '[#]', element));
        } else {
          let index = this._findBucketIndex(bucket, element);
          if (index >= 0) return false;
          dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#.push(#)', bucket, element);
        }
        this._length++;
        this._elements = null;
        return true;
      }
      addAll(objects) {
        for (let each of objects) {
          this.add(each);
        }
      }
      remove(object) {
        if (_isStringElement(object)) {
          return this._removeHashTableEntry(this._strings, object);
        } else if (_isNumericElement(object)) {
          return this._removeHashTableEntry(this._nums, object);
        } else {
          return this._remove(object);
        }
      }
      _remove(object) {
        let rest = this._rest;
        if (rest === null) return false;
        let bucket = this._getBucket(rest, object);
        let index = this._findBucketIndex(bucket, object);
        if (index < 0) return false;
        this._length--;
        this._elements = null;
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#.splice(#, 1)', bucket, index);
        return true;
      }
      clear() {
        if (this._length > 0) {
          this._strings = this._nums = this._rest = this._elements = null;
          this._length = 0;
        }
      }
      _computeElements() {
        if (this._elements !== null) return this._elements;
        let result = new core.List(this._length);
        let index = 0;
        let strings = this._strings;
        if (strings !== null) {
          let names = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.getOwnPropertyNames(#)', strings);
          let entries = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', names), core.int);
          for (let i = 0; i < entries; i++) {
            let element = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'String', '#[#]', names, i), core.String);
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', result, index, element);
            index++;
          }
        }
        let nums = this._nums;
        if (nums !== null) {
          let names = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.getOwnPropertyNames(#)', nums);
          let entries = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', names), core.int);
          for (let i = 0; i < entries; i++) {
            let element = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'num', '+#[#]', names, i), core.num);
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', result, index, element);
            index++;
          }
        }
        let rest = this._rest;
        if (rest !== null) {
          let names = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.getOwnPropertyNames(#)', rest);
          let entries = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', names), core.int);
          for (let i = 0; i < entries; i++) {
            let entry = dart.dinvokef(/* Unimplemented unknown name */JS, 'String', '#[#]', names, i);
            let bucket = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', rest, entry);
            let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
            for (let i = 0; i < length; i++) {
              dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #[#]', result, index, bucket, i);
              index++;
            }
          }
        }
        dart.assert(index === this._length);
        return this._elements = result;
      }
      _addHashTableEntry(table, element) {
        if (_hasTableEntry(table, element)) return false;
        _setTableEntry(table, element, 0);
        this._length++;
        this._elements = null;
        return true;
      }
      _removeHashTableEntry(table, element) {
        if (table !== null && _hasTableEntry(table, element)) {
          _deleteTableEntry(table, element);
          this._length--;
          this._elements = null;
          return true;
        } else {
          return false;
        }
      }
      static _isStringElement(element) {
        return typeof element == "string" && !dart.equals(element, '__proto__');
      }
      static _isNumericElement(element) {
        return core.bool.&&(dart.is(element, core.num), dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '(# & 0x3ffffff) === #', element, element));
      }
      _computeHashCode(element) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', dart.dload(element, "hashCode")), core.int);
      }
      static _hasTableEntry(table, key) {
        let entry = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, key);
        return entry !== null;
      }
      static _setTableEntry(table, key, value) {
        dart.assert(value !== null);
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', table, key, value);
      }
      static _deleteTableEntry(table, key) {
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', 'delete #[#]', table, key);
      }
      _getBucket(table, element) {
        let hash = this._computeHashCode(element);
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, hash), core.List);
      }
      _findBucketIndex(bucket, element) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          if (dart.equals(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), element)) return i;
        }
        return -1;
      }
      static _newHashTable() {
        let table = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.create(null)');
        let temporaryKey = '<non-identifier-key>';
        _setTableEntry(table, temporaryKey, table);
        _deleteTableEntry(table, temporaryKey);
        return table;
      }
    }
    return _HashSet;
  });
  let _HashSet = _HashSet$(dynamic);

  let LinkedHashMapKeyIterator$ = dart.generic(function(E) {
    class LinkedHashMapKeyIterator {
      constructor(_map, _modifications) {
        this._map = _map;
        this._modifications = _modifications;
        this._cell = null;
        this._current = dart.as(null, E);
        this._cell = dart.as(dart.dload(this._map, "_first"), LinkedHashMapCell);
      }
      get current() { return this._current; }
      moveNext() {
        if (this._modifications !== dart.dload(this._map, "_modifications")) {
          throw new core.ConcurrentModificationError(this._map);
        } else if (this._cell === null) {
          this._current = dart.as(null, E);
          return false;
        } else {
          this._current = dart.as(this._cell._key, E);
          this._cell = this._cell._next;
          return true;
        }
      }
    }
    return LinkedHashMapKeyIterator;
  });
  let LinkedHashMapKeyIterator = LinkedHashMapKeyIterator$(dynamic);

  let LinkedHashMapKeyIterable$ = dart.generic(function(E) {
    class LinkedHashMapKeyIterable extends IterableBase$(E) {
      constructor(_map) {
        this._map = _map;
        super();
      }
      get length() { return dart.as(dart.dload(this._map, "_length"), core.int); }
      get isEmpty() { return dart.equals(dart.dload(this._map, "_length"), 0); }
      get iterator() {
        return new LinkedHashMapKeyIterator(this._map, dart.dload(this._map, "_modifications"));
      }
      contains(element) {
        return dart.as(dart.dinvoke(this._map, "containsKey", element), core.bool);
      }
      forEach(f) {
        let cell = dart.as(dart.dload(this._map, "_first"), LinkedHashMapCell);
        let modifications = dart.as(dart.dload(this._map, "_modifications"), core.int);
        while (cell !== null) {
          f(dart.as(cell._key, E));
          if (modifications !== dart.dload(this._map, "_modifications")) {
            throw new core.ConcurrentModificationError(this._map);
          }
          cell = cell._next;
        }
      }
    }
    return LinkedHashMapKeyIterable;
  });
  let LinkedHashMapKeyIterable = LinkedHashMapKeyIterable$(dynamic);

  class LinkedHashMapCell {
    constructor(_key, _value) {
      this._key = _key;
      this._value = _value;
      this._next = null;
      this._previous = null;
    }
  }

  let _LinkedCustomHashMap$ = dart.generic(function(K, V) {
    class _LinkedCustomHashMap extends _LinkedHashMap$(K, V) {
      constructor(_equals, _hashCode, validKey) {
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey !== null) ? validKey : ((v) => dart.is(v, K));
        super();
      }
      get(key) {
        if (!this._validKey(key)) return dart.as(null, V);
        return super._get(key);
      }
      set(key, value) {
        super._set(key, value);
      }
      containsKey(key) {
        if (!this._validKey(key)) return false;
        return super._containsKey(key);
      }
      remove(key) {
        if (!this._validKey(key)) return dart.as(null, V);
        return super._remove(key);
      }
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', this._hashCode(dart.as(key, K))), core.int);
      }
      _findBucketIndex(bucket, key) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), LinkedHashMapCell);
          if (this._equals(dart.as(cell._key, K), dart.as(key, K))) return i;
        }
        return -1;
      }
    }
    return _LinkedCustomHashMap;
  });
  let _LinkedCustomHashMap = _LinkedCustomHashMap$(dynamic, dynamic);

  let _LinkedIdentityHashMap$ = dart.generic(function(K, V) {
    class _LinkedIdentityHashMap extends _LinkedHashMap$(K, V) {
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', core.identityHashCode(key)), core.int);
      }
      _findBucketIndex(bucket, key) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), LinkedHashMapCell);
          if (core.identical(cell._key, key)) return i;
        }
        return -1;
      }
    }
    return _LinkedIdentityHashMap;
  });
  let _LinkedIdentityHashMap = _LinkedIdentityHashMap$(dynamic, dynamic);

  let _LinkedHashMap$ = dart.generic(function(K, V) {
    class _LinkedHashMap {
      constructor() {
        this._length = 0;
        this._strings = null;
        this._nums = null;
        this._rest = null;
        this._first = null;
        this._last = null;
        this._modifications = 0;
      }
      get length() { return this._length; }
      get isEmpty() { return this._length === 0; }
      get isNotEmpty() { return !this.isEmpty; }
      get keys() {
        return new LinkedHashMapKeyIterable(this);
      }
      get values() {
        return new _internal.MappedIterable(this.keys, ((each) => this.get(each)).bind(this));
      }
      containsKey(key) {
        if (_isStringKey(key)) {
          let strings = this._strings;
          if (strings === null) return false;
          let cell = dart.as(_getTableEntry(strings, key), LinkedHashMapCell);
          return cell !== null;
        } else if (_isNumericKey(key)) {
          let nums = this._nums;
          if (nums === null) return false;
          let cell = dart.as(_getTableEntry(nums, key), LinkedHashMapCell);
          return cell !== null;
        } else {
          return this._containsKey(key);
        }
      }
      _containsKey(key) {
        let rest = this._rest;
        if (rest === null) return false;
        let bucket = this._getBucket(rest, key);
        return this._findBucketIndex(bucket, key) >= 0;
      }
      containsValue(value) {
        return this.keys.any(((each) => dart.equals(this.get(each), value)).bind(this));
      }
      addAll(other) {
        other.forEach(((key, value) => {
          this.set(key, value);
        }).bind(this));
      }
      get(key) {
        if (_isStringKey(key)) {
          let strings = this._strings;
          if (strings === null) return dart.as(null, V);
          let cell = dart.as(_getTableEntry(strings, key), LinkedHashMapCell);
          return dart.as((cell === null) ? null : cell._value, V);
        } else if (_isNumericKey(key)) {
          let nums = this._nums;
          if (nums === null) return dart.as(null, V);
          let cell = dart.as(_getTableEntry(nums, key), LinkedHashMapCell);
          return dart.as((cell === null) ? null : cell._value, V);
        } else {
          return this._get(key);
        }
      }
      _get(key) {
        let rest = this._rest;
        if (rest === null) return dart.as(null, V);
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        if (index < 0) return dart.as(null, V);
        let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, index), LinkedHashMapCell);
        return dart.as(cell._value, V);
      }
      set(key, value) {
        if (_isStringKey(key)) {
          let strings = this._strings;
          if (strings === null) this._strings = strings = _newHashTable();
          this._addHashTableEntry(strings, key, value);
        } else if (_isNumericKey(key)) {
          let nums = this._nums;
          if (nums === null) this._nums = nums = _newHashTable();
          this._addHashTableEntry(nums, key, value);
        } else {
          this._set(key, value);
        }
      }
      _set(key, value) {
        let rest = this._rest;
        if (rest === null) this._rest = rest = _newHashTable();
        let hash = this._computeHashCode(key);
        let bucket = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', rest, hash);
        if (bucket === null) {
          let cell = this._newLinkedCell(key, value);
          _setTableEntry(rest, hash, dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '[#]', cell));
        } else {
          let index = this._findBucketIndex(bucket, key);
          if (index >= 0) {
            let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, index), LinkedHashMapCell);
            cell._value = value;
          } else {
            let cell = this._newLinkedCell(key, value);
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#.push(#)', bucket, cell);
          }
        }
      }
      putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key)) return this.get(key);
        let value = ifAbsent();
        this.set(key, value);
        return value;
      }
      remove(key) {
        if (_isStringKey(key)) {
          return this._removeHashTableEntry(this._strings, key);
        } else if (_isNumericKey(key)) {
          return this._removeHashTableEntry(this._nums, key);
        } else {
          return this._remove(key);
        }
      }
      _remove(key) {
        let rest = this._rest;
        if (rest === null) return dart.as(null, V);
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        if (index < 0) return dart.as(null, V);
        let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#.splice(#, 1)[0]', bucket, index), LinkedHashMapCell);
        this._unlinkCell(cell);
        return dart.as(cell._value, V);
      }
      clear() {
        if (this._length > 0) {
          this._strings = this._nums = this._rest = this._first = this._last = null;
          this._length = 0;
          this._modified();
        }
      }
      forEach(action) {
        let cell = this._first;
        let modifications = this._modifications;
        while (cell !== null) {
          action(dart.as(cell._key, K), dart.as(cell._value, V));
          if (modifications !== this._modifications) {
            throw new core.ConcurrentModificationError(this);
          }
          cell = cell._next;
        }
      }
      _addHashTableEntry(table, key, value) {
        let cell = dart.as(_getTableEntry(table, key), LinkedHashMapCell);
        if (cell === null) {
          _setTableEntry(table, key, this._newLinkedCell(key, value));
        } else {
          cell._value = value;
        }
      }
      _removeHashTableEntry(table, key) {
        if (table === null) return dart.as(null, V);
        let cell = dart.as(_getTableEntry(table, key), LinkedHashMapCell);
        if (cell === null) return dart.as(null, V);
        this._unlinkCell(cell);
        _deleteTableEntry(table, key);
        return dart.as(cell._value, V);
      }
      _modified() {
        this._modifications = (this._modifications + 1) & 67108863;
      }
      _newLinkedCell(key, value) {
        let cell = new LinkedHashMapCell(key, value);
        if (this._first === null) {
          this._first = this._last = cell;
        } else {
          let last = this._last;
          cell._previous = last;
          this._last = last._next = cell;
        }
        this._length++;
        this._modified();
        return cell;
      }
      _unlinkCell(cell) {
        let previous = cell._previous;
        let next = cell._next;
        if (previous === null) {
          dart.assert(dart.equals(cell, this._first));
          this._first = next;
        } else {
          previous._next = next;
        }
        if (next === null) {
          dart.assert(dart.equals(cell, this._last));
          this._last = previous;
        } else {
          next._previous = previous;
        }
        this._length--;
        this._modified();
      }
      static _isStringKey(key) {
        return typeof key == "string" && !dart.equals(key, '__proto__');
      }
      static _isNumericKey(key) {
        return core.bool.&&(dart.is(key, core.num), dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '(# & 0x3ffffff) === #', key, key));
      }
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', dart.dload(key, "hashCode")), core.int);
      }
      static _getTableEntry(table, key) {
        return dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, key);
      }
      static _setTableEntry(table, key, value) {
        dart.assert(value !== null);
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', table, key, value);
      }
      static _deleteTableEntry(table, key) {
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', 'delete #[#]', table, key);
      }
      _getBucket(table, key) {
        let hash = this._computeHashCode(key);
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, hash), core.List);
      }
      _findBucketIndex(bucket, key) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i++) {
          let cell = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), LinkedHashMapCell);
          if (dart.equals(cell._key, key)) return i;
        }
        return -1;
      }
      static _newHashTable() {
        let table = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.create(null)');
        let temporaryKey = '<non-identifier-key>';
        _setTableEntry(table, temporaryKey, table);
        _deleteTableEntry(table, temporaryKey);
        return table;
      }
      toString() { return Maps.mapToString(this); }
    }
    return _LinkedHashMap;
  });
  let _LinkedHashMap = _LinkedHashMap$(dynamic, dynamic);

  let HashMapKeyIterator$ = dart.generic(function(E) {
    class HashMapKeyIterator {
      constructor(_map, _keys) {
        this._map = _map;
        this._keys = _keys;
        this._offset = 0;
        this._current = dart.as(null, E);
      }
      get current() { return this._current; }
      moveNext() {
        let keys = this._keys;
        let offset = this._offset;
        if (dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '# !== #', keys, dart.dload(this._map, "_keys"))) {
          throw new core.ConcurrentModificationError(this._map);
        } else if (offset['>='](dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', keys))) {
          this._current = dart.as(null, E);
          return false;
        } else {
          this._current = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', keys, offset), E);
          this._offset = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#', offset + 1), core.int);
          return true;
        }
      }
    }
    return HashMapKeyIterator;
  });
  let HashMapKeyIterator = HashMapKeyIterator$(dynamic);

  let HashMapKeyIterable$ = dart.generic(function(E) {
    class HashMapKeyIterable extends IterableBase$(E) {
      constructor(_map) {
        this._map = _map;
        super();
      }
      get length() { return dart.as(dart.dload(this._map, "_length"), core.int); }
      get isEmpty() { return dart.equals(dart.dload(this._map, "_length"), 0); }
      get iterator() {
        return new HashMapKeyIterator(this._map, dart.dinvoke(this._map, "_computeKeys"));
      }
      contains(element) {
        return dart.as(dart.dinvoke(this._map, "containsKey", element), core.bool);
      }
      forEach(f) {
        let keys = dart.as(dart.dinvoke(this._map, "_computeKeys"), core.List);
        for (let i = 0, length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', keys), core.int); i < length; i++) {
          f(dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', keys, i), E));
          if (dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '# !== #', keys, dart.dload(this._map, "_keys"))) {
            throw new core.ConcurrentModificationError(this._map);
          }
        }
      }
    }
    return HashMapKeyIterable;
  });
  let HashMapKeyIterable = HashMapKeyIterable$(dynamic);

  let _CustomHashMap$ = dart.generic(function(K, V) {
    class _CustomHashMap extends _HashMap$(K, V) {
      constructor(_equals, _hashCode, validKey) {
        this._equals = _equals;
        this._hashCode = _hashCode;
        this._validKey = (validKey !== null) ? validKey : ((v) => dart.is(v, K));
        super();
      }
      get(key) {
        if (!this._validKey(key)) return dart.as(null, V);
        return super._get(key);
      }
      set(key, value) {
        super._set(key, value);
      }
      containsKey(key) {
        if (!this._validKey(key)) return false;
        return super._containsKey(key);
      }
      remove(key) {
        if (!this._validKey(key)) return dart.as(null, V);
        return super._remove(key);
      }
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', this._hashCode(dart.as(key, K))), core.int);
      }
      _findBucketIndex(bucket, key) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i = 2) {
          if (this._equals(dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), K), dart.as(key, K))) return i;
        }
        return -1;
      }
      toString() { return Maps.mapToString(this); }
    }
    return _CustomHashMap;
  });
  let _CustomHashMap = _CustomHashMap$(dynamic, dynamic);

  let _IdentityHashMap$ = dart.generic(function(K, V) {
    class _IdentityHashMap extends _HashMap$(K, V) {
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', core.identityHashCode(key)), core.int);
      }
      _findBucketIndex(bucket, key) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i = 2) {
          if (core.identical(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), key)) return i;
        }
        return -1;
      }
    }
    return _IdentityHashMap;
  });
  let _IdentityHashMap = _IdentityHashMap$(dynamic, dynamic);

  let _HashMap$ = dart.generic(function(K, V) {
    class _HashMap {
      constructor() {
        this._length = 0;
        this._strings = null;
        this._nums = null;
        this._rest = null;
        this._keys = null;
      }
      get length() { return this._length; }
      get isEmpty() { return this._length === 0; }
      get isNotEmpty() { return !this.isEmpty; }
      get keys() {
        return new HashMapKeyIterable(this);
      }
      get values() {
        return new _internal.MappedIterable(this.keys, ((each) => this.get(each)).bind(this));
      }
      containsKey(key) {
        if (_isStringKey(key)) {
          let strings = this._strings;
          return (strings === null) ? false : _hasTableEntry(strings, key);
        } else if (_isNumericKey(key)) {
          let nums = this._nums;
          return (nums === null) ? false : _hasTableEntry(nums, key);
        } else {
          return this._containsKey(key);
        }
      }
      _containsKey(key) {
        let rest = this._rest;
        if (rest === null) return false;
        let bucket = this._getBucket(rest, key);
        return this._findBucketIndex(bucket, key) >= 0;
      }
      containsValue(value) {
        return this._computeKeys().any(((each) => dart.equals(this.get(each), value)).bind(this));
      }
      addAll(other) {
        other.forEach(((key, value) => {
          this.set(key, value);
        }).bind(this));
      }
      get(key) {
        if (_isStringKey(key)) {
          let strings = this._strings;
          return dart.as((strings === null) ? null : _getTableEntry(strings, key), V);
        } else if (_isNumericKey(key)) {
          let nums = this._nums;
          return dart.as((nums === null) ? null : _getTableEntry(nums, key), V);
        } else {
          return this._get(key);
        }
      }
      _get(key) {
        let rest = this._rest;
        if (rest === null) return dart.as(null, V);
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        return dart.as((index < 0) ? null : dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, index + 1), V);
      }
      set(key, value) {
        if (_isStringKey(key)) {
          let strings = this._strings;
          if (strings === null) this._strings = strings = _newHashTable();
          this._addHashTableEntry(strings, key, value);
        } else if (_isNumericKey(key)) {
          let nums = this._nums;
          if (nums === null) this._nums = nums = _newHashTable();
          this._addHashTableEntry(nums, key, value);
        } else {
          this._set(key, value);
        }
      }
      _set(key, value) {
        let rest = this._rest;
        if (rest === null) this._rest = rest = _newHashTable();
        let hash = this._computeHashCode(key);
        let bucket = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', rest, hash);
        if (bucket === null) {
          _setTableEntry(rest, hash, dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '[#, #]', key, value));
          this._length++;
          this._keys = null;
        } else {
          let index = this._findBucketIndex(bucket, key);
          if (index >= 0) {
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', bucket, index + 1, value);
          } else {
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#.push(#, #)', bucket, key, value);
            this._length++;
            this._keys = null;
          }
        }
      }
      putIfAbsent(key, ifAbsent) {
        if (this.containsKey(key)) return this.get(key);
        let value = ifAbsent();
        this.set(key, value);
        return value;
      }
      remove(key) {
        if (_isStringKey(key)) {
          return this._removeHashTableEntry(this._strings, key);
        } else if (_isNumericKey(key)) {
          return this._removeHashTableEntry(this._nums, key);
        } else {
          return this._remove(key);
        }
      }
      _remove(key) {
        let rest = this._rest;
        if (rest === null) return dart.as(null, V);
        let bucket = this._getBucket(rest, key);
        let index = this._findBucketIndex(bucket, key);
        if (index < 0) return dart.as(null, V);
        this._length--;
        this._keys = null;
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#.splice(#, 2)[1]', bucket, index), V);
      }
      clear() {
        if (this._length > 0) {
          this._strings = this._nums = this._rest = this._keys = null;
          this._length = 0;
        }
      }
      forEach(action) {
        let keys = this._computeKeys();
        for (let i = 0, length = keys.length; i < length; i++) {
          let key = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', keys, i);
          action(dart.as(key, K), this.get(key));
          if (dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '# !== #', keys, this._keys)) {
            throw new core.ConcurrentModificationError(this);
          }
        }
      }
      _computeKeys() {
        if (this._keys !== null) return this._keys;
        let result = new core.List(this._length);
        let index = 0;
        let strings = this._strings;
        if (strings !== null) {
          let names = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.getOwnPropertyNames(#)', strings);
          let entries = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', names), core.int);
          for (let i = 0; i < entries; i++) {
            let key = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'String', '#[#]', names, i), core.String);
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', result, index, key);
            index++;
          }
        }
        let nums = this._nums;
        if (nums !== null) {
          let names = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.getOwnPropertyNames(#)', nums);
          let entries = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', names), core.int);
          for (let i = 0; i < entries; i++) {
            let key = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'num', '+#[#]', names, i), core.num);
            dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', result, index, key);
            index++;
          }
        }
        let rest = this._rest;
        if (rest !== null) {
          let names = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.getOwnPropertyNames(#)', rest);
          let entries = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', names), core.int);
          for (let i = 0; i < entries; i++) {
            let key = dart.dinvokef(/* Unimplemented unknown name */JS, 'String', '#[#]', names, i);
            let bucket = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', rest, key);
            let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
            for (let i = 0; i < length; i = 2) {
              let key = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i);
              dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', result, index, key);
              index++;
            }
          }
        }
        dart.assert(index === this._length);
        return this._keys = result;
      }
      _addHashTableEntry(table, key, value) {
        if (!_hasTableEntry(table, key)) {
          this._length++;
          this._keys = null;
        }
        _setTableEntry(table, key, value);
      }
      _removeHashTableEntry(table, key) {
        if (table !== null && _hasTableEntry(table, key)) {
          let value = dart.as(_getTableEntry(table, key), V);
          _deleteTableEntry(table, key);
          this._length--;
          this._keys = null;
          return value;
        } else {
          return dart.as(null, V);
        }
      }
      static _isStringKey(key) {
        return typeof key == "string" && !dart.equals(key, '__proto__');
      }
      static _isNumericKey(key) {
        return core.bool.&&(dart.is(key, core.num), dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '(# & 0x3ffffff) === #', key, key));
      }
      _computeHashCode(key) {
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '# & 0x3ffffff', dart.dload(key, "hashCode")), core.int);
      }
      static _hasTableEntry(table, key) {
        let entry = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, key);
        return entry !== null;
      }
      static _getTableEntry(table, key) {
        let entry = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, key);
        return dart.dinvokef(/* Unimplemented unknown name */JS, 'bool', '# === #', entry, table) ? null : entry;
      }
      static _setTableEntry(table, key, value) {
        if (value === null) {
          dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', table, key, table);
        } else {
          dart.dinvokef(/* Unimplemented unknown name */JS, 'void', '#[#] = #', table, key, value);
        }
      }
      static _deleteTableEntry(table, key) {
        dart.dinvokef(/* Unimplemented unknown name */JS, 'void', 'delete #[#]', table, key);
      }
      _getBucket(table, key) {
        let hash = this._computeHashCode(key);
        return dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', table, hash), core.List);
      }
      _findBucketIndex(bucket, key) {
        if (bucket === null) return -1;
        let length = dart.as(dart.dinvokef(/* Unimplemented unknown name */JS, 'int', '#.length', bucket), core.int);
        for (let i = 0; i < length; i = 2) {
          if (dart.equals(dart.dinvokef(/* Unimplemented unknown name */JS, 'var', '#[#]', bucket, i), key)) return i;
        }
        return -1;
      }
      static _newHashTable() {
        let table = dart.dinvokef(/* Unimplemented unknown name */JS, 'var', 'Object.create(null)');
        let temporaryKey = '<non-identifier-key>';
        _setTableEntry(table, temporaryKey, table);
        _deleteTableEntry(table, temporaryKey);
        return table;
      }
    }
    return _HashMap;
  });
  let _HashMap = _HashMap$(dynamic, dynamic);

  let UnmodifiableListView$ = dart.generic(function(E) {
    class UnmodifiableListView extends _internal.UnmodifiableListBase$(E) {
      constructor(source) {
        this._source = source;
        super();
      }
      get length() { return this._source.length; }
      get(index) { return this._source.elementAt(index); }
    }
    return UnmodifiableListView;
  });
  let UnmodifiableListView = UnmodifiableListView$(dynamic);

  // Function _defaultEquals: (dynamic, dynamic) → bool
  function _defaultEquals(a, b) { return dart.equals(a, b); }

  // Function _defaultHashCode: (dynamic) → int
  function _defaultHashCode(a) { return dart.as(dart.dload(a, "hashCode"), core.int); }

  let HashMap$ = dart.generic(function(K, V) {
    class HashMap {
      constructor(opt$) {
        let equals = opt$.equals === undefined ? null : opt$.equals;
        let hashCode = opt$.hashCode === undefined ? null : opt$.hashCode;
        let isValidKey = opt$.isValidKey === undefined ? null : opt$.isValidKey;
        if (isValidKey === null) {
          if (hashCode === null) {
            if (equals === null) {
              return new _HashMap();
            }
            hashCode = _defaultHashCode;
          } else {
            if (core.identical(core.identityHashCode, hashCode) && core.identical(core.identical, equals)) {
              return new _IdentityHashMap();
            }
            if (equals === null) {
              equals = _defaultEquals;
            }
          }
        } else {
          if (hashCode === null) {
            hashCode = _defaultHashCode;
          }
          if (equals === null) {
            equals = _defaultEquals;
          }
        }
        return new _CustomHashMap(equals, hashCode, isValidKey);
      }
      /*constructor*/ identity() {
        return new _IdentityHashMap();
      }
      /*constructor*/ from(other) {
        let result = new HashMap();
        other.forEach((k, v) => {
          result.set(k, dart.as(v, V));
        });
        return result;
      }
      /*constructor*/ fromIterable(iterable, opt$) {
        let key = opt$.key === undefined ? null : opt$.key;
        let value = opt$.value === undefined ? null : opt$.value;
        let map = new HashMap();
        Maps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
      }
      /*constructor*/ fromIterables(keys, values) {
        let map = new HashMap();
        Maps._fillMapWithIterables(map, keys, values);
        return map;
      }
    }
    dart.defineNamedConstructor(HashMap, "identity");
    dart.defineNamedConstructor(HashMap, "from");
    dart.defineNamedConstructor(HashMap, "fromIterable");
    dart.defineNamedConstructor(HashMap, "fromIterables");
    return HashMap;
  });
  let HashMap = HashMap$(dynamic, dynamic);

  let _HashSetBase$ = dart.generic(function(E) {
    class _HashSetBase extends SetBase$(E) {
      difference(other) {
        let result = this._newSet();
        for (let element of this) {
          if (!other.contains(element)) result.add(dart.as(element, E));
        }
        return result;
      }
      intersection(other) {
        let result = this._newSet();
        for (let element of this) {
          if (other.contains(element)) result.add(dart.as(element, E));
        }
        return result;
      }
      toSet() { return ((_) => {
        _.addAll(this);
        return _;
      }).bind(this)(this._newSet()); }
    }
    return _HashSetBase;
  });
  let _HashSetBase = _HashSetBase$(dynamic);

  let HashSet$ = dart.generic(function(E) {
    class HashSet {
      constructor(opt$) {
        let equals = opt$.equals === undefined ? null : opt$.equals;
        let hashCode = opt$.hashCode === undefined ? null : opt$.hashCode;
        let isValidKey = opt$.isValidKey === undefined ? null : opt$.isValidKey;
        if (isValidKey === null) {
          if (hashCode === null) {
            if (equals === null) {
              return new _HashSet();
            }
            hashCode = _defaultHashCode;
          } else {
            if (core.identical(core.identityHashCode, hashCode) && core.identical(core.identical, equals)) {
              return new _IdentityHashSet();
            }
            if (equals === null) {
              equals = _defaultEquals;
            }
          }
        } else {
          if (hashCode === null) {
            hashCode = _defaultHashCode;
          }
          if (equals === null) {
            equals = _defaultEquals;
          }
        }
        return new _CustomHashSet(equals, hashCode, isValidKey);
      }
      /*constructor*/ identity() {
        return new _IdentityHashSet();
      }
      /*constructor*/ from(elements) {
        let result = new HashSet();
        for (let e of elements) result.add(e);
        return result;
      }
    }
    dart.defineNamedConstructor(HashSet, "identity");
    dart.defineNamedConstructor(HashSet, "from");
    return HashSet;
  });
  let HashSet = HashSet$(dynamic);

  let IterableMixin$ = dart.generic(function(E) {
    class IterableMixin {
      map(f) { return new _internal.MappedIterable(this, f); }
      where(f) { return new _internal.WhereIterable(this, f); }
      expand(f) { return new _internal.ExpandIterable(this, f); }
      contains(element) {
        for (let e of this) {
          if (dart.equals(e, element)) return true;
        }
        return false;
      }
      forEach(f) {
        for (let element of this) f(element);
      }
      reduce(combine) {
        let iterator = this.iterator;
        if (!iterator.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        let value = iterator.current;
        while (iterator.moveNext()) {
          value = combine(value, iterator.current);
        }
        return value;
      }
      fold(initialValue, combine) {
        let value = initialValue;
        for (let element of this) value = combine(value, element);
        return value;
      }
      every(f) {
        for (let element of this) {
          if (!f(element)) return false;
        }
        return true;
      }
      join(separator) {
        if (separator === undefined) separator = "";
        let iterator = this.iterator;
        if (!iterator.moveNext()) return "";
        let buffer = new core.StringBuffer();
        if (separator === null || dart.equals(separator, "")) {
          do {
            buffer.write(`${iterator.current}`);
          }
          while (iterator.moveNext());
        } else {
          buffer.write(`${iterator.current}`);
          while (iterator.moveNext()) {
            buffer.write(separator);
            buffer.write(`${iterator.current}`);
          }
        }
        return buffer.toString();
      }
      any(f) {
        for (let element of this) {
          if (f(element)) return true;
        }
        return false;
      }
      toList(opt$) {
        let growable = opt$.growable === undefined ? true : opt$.growable;
        return new core.List.from(this, {growable: growable})
      }
      toSet() { return new core.Set.from(this); }
      get length() {
        dart.assert(!dart.is(this, _internal.EfficientLength));
        let count = 0;
        let it = this.iterator;
        while (it.moveNext()) {
          count++;
        }
        return count;
      }
      get isEmpty() { return !this.iterator.moveNext(); }
      get isNotEmpty() { return !this.isEmpty; }
      take(n) {
        return new _internal.TakeIterable(this, n);
      }
      takeWhile(test) {
        return new _internal.TakeWhileIterable(this, test);
      }
      skip(n) {
        return new _internal.SkipIterable(this, n);
      }
      skipWhile(test) {
        return new _internal.SkipWhileIterable(this, test);
      }
      get first() {
        let it = this.iterator;
        if (!it.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        return dart.as(it.current, E);
      }
      get last() {
        let it = this.iterator;
        if (!it.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        let result = null;
        do {
          result = dart.as(it.current, E);
        }
        while (it.moveNext());
        return result;
      }
      get single() {
        let it = this.iterator;
        if (!it.moveNext()) throw _internal.IterableElementError.noElement();
        let result = dart.as(it.current, E);
        if (it.moveNext()) throw _internal.IterableElementError.tooMany();
        return result;
      }
      firstWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        for (let element of this) {
          if (test(element)) return element;
        }
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      lastWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        let result = dart.as(null, E);
        let foundMatching = false;
        for (let element of this) {
          if (test(element)) {
            result = element;
            foundMatching = true;
          }
        }
        if (foundMatching) return result;
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      singleWhere(test) {
        let result = dart.as(null, E);
        let foundMatching = false;
        for (let element of this) {
          if (test(element)) {
            if (foundMatching) {
              throw _internal.IterableElementError.tooMany();
            }
            result = element;
            foundMatching = true;
          }
        }
        if (foundMatching) return result;
        throw _internal.IterableElementError.noElement();
      }
      elementAt(index) {
        if (!(typeof index == "number")) throw new core.ArgumentError.notNull("index");
        core.RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
          if (index === elementIndex) return element;
          elementIndex++;
        }
        throw new core.RangeError.index(index, this, "index", null, elementIndex);
      }
      toString() { return IterableBase.iterableToShortString(this, '(', ')'); }
    }
    return IterableMixin;
  });
  let IterableMixin = IterableMixin$(dynamic);

  let IterableBase$ = dart.generic(function(E) {
    class IterableBase {
      constructor() {
      }
      map(f) { return new _internal.MappedIterable(this, f); }
      where(f) { return new _internal.WhereIterable(this, f); }
      expand(f) { return new _internal.ExpandIterable(this, f); }
      contains(element) {
        for (let e of this) {
          if (dart.equals(e, element)) return true;
        }
        return false;
      }
      forEach(f) {
        for (let element of this) f(element);
      }
      reduce(combine) {
        let iterator = this.iterator;
        if (!iterator.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        let value = iterator.current;
        while (iterator.moveNext()) {
          value = combine(value, iterator.current);
        }
        return value;
      }
      fold(initialValue, combine) {
        let value = initialValue;
        for (let element of this) value = combine(value, element);
        return value;
      }
      every(f) {
        for (let element of this) {
          if (!f(element)) return false;
        }
        return true;
      }
      join(separator) {
        if (separator === undefined) separator = "";
        let iterator = this.iterator;
        if (!iterator.moveNext()) return "";
        let buffer = new core.StringBuffer();
        if (separator === null || dart.equals(separator, "")) {
          do {
            buffer.write(`${iterator.current}`);
          }
          while (iterator.moveNext());
        } else {
          buffer.write(`${iterator.current}`);
          while (iterator.moveNext()) {
            buffer.write(separator);
            buffer.write(`${iterator.current}`);
          }
        }
        return buffer.toString();
      }
      any(f) {
        for (let element of this) {
          if (f(element)) return true;
        }
        return false;
      }
      toList(opt$) {
        let growable = opt$.growable === undefined ? true : opt$.growable;
        return new core.List.from(this, {growable: growable})
      }
      toSet() { return new core.Set.from(this); }
      get length() {
        dart.assert(!dart.is(this, _internal.EfficientLength));
        let count = 0;
        let it = this.iterator;
        while (it.moveNext()) {
          count++;
        }
        return count;
      }
      get isEmpty() { return !this.iterator.moveNext(); }
      get isNotEmpty() { return !this.isEmpty; }
      take(n) {
        return new _internal.TakeIterable(this, n);
      }
      takeWhile(test) {
        return new _internal.TakeWhileIterable(this, test);
      }
      skip(n) {
        return new _internal.SkipIterable(this, n);
      }
      skipWhile(test) {
        return new _internal.SkipWhileIterable(this, test);
      }
      get first() {
        let it = this.iterator;
        if (!it.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        return dart.as(it.current, E);
      }
      get last() {
        let it = this.iterator;
        if (!it.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        let result = null;
        do {
          result = dart.as(it.current, E);
        }
        while (it.moveNext());
        return result;
      }
      get single() {
        let it = this.iterator;
        if (!it.moveNext()) throw _internal.IterableElementError.noElement();
        let result = dart.as(it.current, E);
        if (it.moveNext()) throw _internal.IterableElementError.tooMany();
        return result;
      }
      firstWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        for (let element of this) {
          if (test(element)) return element;
        }
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      lastWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        let result = dart.as(null, E);
        let foundMatching = false;
        for (let element of this) {
          if (test(element)) {
            result = element;
            foundMatching = true;
          }
        }
        if (foundMatching) return result;
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      singleWhere(test) {
        let result = dart.as(null, E);
        let foundMatching = false;
        for (let element of this) {
          if (test(element)) {
            if (foundMatching) {
              throw _internal.IterableElementError.tooMany();
            }
            result = element;
            foundMatching = true;
          }
        }
        if (foundMatching) return result;
        throw _internal.IterableElementError.noElement();
      }
      elementAt(index) {
        if (!(typeof index == "number")) throw new core.ArgumentError.notNull("index");
        core.RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
          if (index === elementIndex) return element;
          elementIndex++;
        }
        throw new core.RangeError.index(index, this, "index", null, elementIndex);
      }
      toString() { return iterableToShortString(this, '(', ')'); }
      static iterableToShortString(iterable, leftDelimiter, rightDelimiter) {
        if (leftDelimiter === undefined) leftDelimiter = '(';
        if (rightDelimiter === undefined) rightDelimiter = ')';
        if (_isToStringVisiting(iterable)) {
          if (dart.equals(leftDelimiter, "(") && dart.equals(rightDelimiter, ")")) {
            return "(...)";
          }
          return `${leftDelimiter}...${rightDelimiter}`;
        }
        let parts = new List.from([]);
        _toStringVisiting.add(iterable);
        try {
          _iterablePartsToStrings(iterable, parts);
        }
        finally {
          dart.assert(core.identical(_toStringVisiting.last, iterable));
          _toStringVisiting.removeLast();
        }
        return (((_) => {
          _.writeAll(parts, ", ");
          _.write(rightDelimiter);
          return _;
        }).bind(this)(new core.StringBuffer(leftDelimiter))).toString();
      }
      static iterableToFullString(iterable, leftDelimiter, rightDelimiter) {
        if (leftDelimiter === undefined) leftDelimiter = '(';
        if (rightDelimiter === undefined) rightDelimiter = ')';
        if (_isToStringVisiting(iterable)) {
          return `${leftDelimiter}...${rightDelimiter}`;
        }
        let buffer = new core.StringBuffer(leftDelimiter);
        _toStringVisiting.add(iterable);
        try {
          buffer.writeAll(iterable, ", ");
        }
        finally {
          dart.assert(core.identical(_toStringVisiting.last, iterable));
          _toStringVisiting.removeLast();
        }
        buffer.write(rightDelimiter);
        return buffer.toString();
      }
      static _isToStringVisiting(o) {
        for (let i = 0; i < _toStringVisiting.length; i++) {
          if (core.identical(o, _toStringVisiting.get(i))) return true;
        }
        return false;
      }
      static _iterablePartsToStrings(iterable, parts) {
        let LENGTH_LIMIT = 80;
        let HEAD_COUNT = 3;
        let TAIL_COUNT = 2;
        let MAX_COUNT = 100;
        let OVERHEAD = 2;
        let ELLIPSIS_SIZE = 3;
        let length = 0;
        let count = 0;
        let it = iterable.iterator;
        while (length < LENGTH_LIMIT || count < HEAD_COUNT) {
          if (!it.moveNext()) return;
          let next = `${it.current}`;
          parts.add(next);
          length = next.length + OVERHEAD;
          count++;
        }
        let penultimateString = null;
        let ultimateString = null;
        let penultimate = null;
        let ultimate = null;
        if (!it.moveNext()) {
          if (count <= HEAD_COUNT + TAIL_COUNT) return;
          ultimateString = dart.as(parts.removeLast(), core.String);
          penultimateString = dart.as(parts.removeLast(), core.String);
        } else {
          penultimate = it.current;
          count++;
          if (!it.moveNext()) {
            if (count <= HEAD_COUNT + 1) {
              parts.add(`${penultimate}`);
              return;
            }
            ultimateString = `${penultimate}`;
            penultimateString = dart.as(parts.removeLast(), core.String);
            length = ultimateString.length + OVERHEAD;
          } else {
            ultimate = it.current;
            count++;
            dart.assert(count < MAX_COUNT);
            while (it.moveNext()) {
              penultimate = ultimate;
              ultimate = it.current;
              count++;
              if (count > MAX_COUNT) {
                while (length > LENGTH_LIMIT - ELLIPSIS_SIZE - OVERHEAD && count > HEAD_COUNT) {
                  length = dart.as(dart.dbinary(dart.dload(parts.removeLast(), "length"), "+", OVERHEAD), core.int);
                  count--;
                }
                parts.add("...");
                return;
              }
            }
            penultimateString = `${penultimate}`;
            ultimateString = `${ultimate}`;
            length = ultimateString.length + penultimateString.length + 2 * OVERHEAD;
          }
        }
        let elision = null;
        if (count > parts.length + TAIL_COUNT) {
          elision = "...";
          length = ELLIPSIS_SIZE + OVERHEAD;
        }
        while (length > LENGTH_LIMIT && parts.length > HEAD_COUNT) {
          length = dart.as(dart.dbinary(dart.dload(parts.removeLast(), "length"), "+", OVERHEAD), core.int);
          if (elision === null) {
            elision = "...";
            length = ELLIPSIS_SIZE + OVERHEAD;
          }
        }
        if (elision !== null) {
          parts.add(elision);
        }
        parts.add(penultimateString);
        parts.add(ultimateString);
      }
    }
    dart.defineLazyProperties(IterableBase, {
      get _toStringVisiting() { return new List.from([]) },
    });
    return IterableBase;
  });
  let IterableBase = IterableBase$(dynamic);

  let HasNextIterator$ = dart.generic(function(E) {
    class HasNextIterator {
      constructor(_iterator) {
        this._iterator = _iterator;
        this._state = _NOT_MOVED_YET;
      }
      get hasNext() {
        if (this._state === _NOT_MOVED_YET) this._move();
        return this._state === _HAS_NEXT_AND_NEXT_IN_CURRENT;
      }
      next() {
        if (!this.hasNext) throw new core.StateError("No more elements");
        dart.assert(this._state === _HAS_NEXT_AND_NEXT_IN_CURRENT);
        let result = dart.as(this._iterator.current, E);
        this._move();
        return result;
      }
      _move() {
        if (this._iterator.moveNext()) {
          this._state = _HAS_NEXT_AND_NEXT_IN_CURRENT;
        } else {
          this._state = _NO_NEXT;
        }
      }
    }
    HasNextIterator._HAS_NEXT_AND_NEXT_IN_CURRENT = 0;
    HasNextIterator._NO_NEXT = 1;
    HasNextIterator._NOT_MOVED_YET = 2;
    return HasNextIterator;
  });
  let HasNextIterator = HasNextIterator$(dynamic);

  let LinkedHashMap$ = dart.generic(function(K, V) {
    class LinkedHashMap {
      constructor(opt$) {
        let equals = opt$.equals === undefined ? null : opt$.equals;
        let hashCode = opt$.hashCode === undefined ? null : opt$.hashCode;
        let isValidKey = opt$.isValidKey === undefined ? null : opt$.isValidKey;
        if (isValidKey === null) {
          if (hashCode === null) {
            if (equals === null) {
              return new _LinkedHashMap();
            }
            hashCode = _defaultHashCode;
          } else {
            if (core.identical(core.identityHashCode, hashCode) && core.identical(core.identical, equals)) {
              return new _LinkedIdentityHashMap();
            }
            if (equals === null) {
              equals = _defaultEquals;
            }
          }
        } else {
          if (hashCode === null) {
            hashCode = _defaultHashCode;
          }
          if (equals === null) {
            equals = _defaultEquals;
          }
        }
        return new _LinkedCustomHashMap(equals, hashCode, isValidKey);
      }
      /*constructor*/ identity() {
        return new _LinkedIdentityHashMap();
      }
      /*constructor*/ from(other) {
        let result = new LinkedHashMap();
        other.forEach((k, v) => {
          result.set(k, dart.as(v, V));
        });
        return result;
      }
      /*constructor*/ fromIterable(iterable, opt$) {
        let key = opt$.key === undefined ? null : opt$.key;
        let value = opt$.value === undefined ? null : opt$.value;
        let map = new LinkedHashMap();
        Maps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
      }
      /*constructor*/ fromIterables(keys, values) {
        let map = new LinkedHashMap();
        Maps._fillMapWithIterables(map, keys, values);
        return map;
      }
    }
    dart.defineNamedConstructor(LinkedHashMap, "identity");
    dart.defineNamedConstructor(LinkedHashMap, "from");
    dart.defineNamedConstructor(LinkedHashMap, "fromIterable");
    dart.defineNamedConstructor(LinkedHashMap, "fromIterables");
    return LinkedHashMap;
  });
  let LinkedHashMap = LinkedHashMap$(dynamic, dynamic);

  let LinkedHashSet$ = dart.generic(function(E) {
    class LinkedHashSet {
      constructor(opt$) {
        let equals = opt$.equals === undefined ? null : opt$.equals;
        let hashCode = opt$.hashCode === undefined ? null : opt$.hashCode;
        let isValidKey = opt$.isValidKey === undefined ? null : opt$.isValidKey;
        if (isValidKey === null) {
          if (hashCode === null) {
            if (equals === null) {
              return new _LinkedHashSet();
            }
            hashCode = _defaultHashCode;
          } else {
            if (core.identical(core.identityHashCode, hashCode) && core.identical(core.identical, equals)) {
              return new _LinkedIdentityHashSet();
            }
            if (equals === null) {
              equals = _defaultEquals;
            }
          }
        } else {
          if (hashCode === null) {
            hashCode = _defaultHashCode;
          }
          if (equals === null) {
            equals = _defaultEquals;
          }
        }
        return new _LinkedCustomHashSet(equals, hashCode, isValidKey);
      }
      /*constructor*/ identity() {
        return new _LinkedIdentityHashSet();
      }
      /*constructor*/ from(elements) {
        let result = new LinkedHashSet();
        for (let element of elements) {
          result.add(element);
        }
        return result;
      }
    }
    dart.defineNamedConstructor(LinkedHashSet, "identity");
    dart.defineNamedConstructor(LinkedHashSet, "from");
    return LinkedHashSet;
  });
  let LinkedHashSet = LinkedHashSet$(dynamic);

  let LinkedList$ = dart.generic(function(E) {
    class LinkedList extends IterableBase$(E) {
      constructor() {
        this._modificationCount = 0;
        this._length = 0;
        this._next = null;
        this._previous = null;
        super();
        this._next = this._previous = this;
      }
      addFirst(entry) {
        this._insertAfter(this, entry);
      }
      add(entry) {
        this._insertAfter(this._previous, entry);
      }
      addAll(entries) {
        entries.forEach(((entry) => this._insertAfter(this._previous, dart.as(entry, E))).bind(this));
      }
      remove(entry) {
        if (!dart.equals(entry._list, this)) return false;
        this._unlink(entry);
        return true;
      }
      get iterator() { return new _LinkedListIterator(this); }
      get length() { return this._length; }
      clear() {
        this._modificationCount++;
        let next = this._next;
        while (!core.identical(next, this)) {
          let entry = dart.as(next, E);
          next = entry._next;
          entry._next = entry._previous = entry._list = null;
        }
        this._next = this._previous = this;
        this._length = 0;
      }
      get first() {
        if (core.identical(this._next, this)) {
          throw new core.StateError('No such element');
        }
        return dart.as(this._next, E);
      }
      get last() {
        if (core.identical(this._previous, this)) {
          throw new core.StateError('No such element');
        }
        return dart.as(this._previous, E);
      }
      get single() {
        if (core.identical(this._previous, this)) {
          throw new core.StateError('No such element');
        }
        if (!core.identical(this._previous, this._next)) {
          throw new core.StateError('Too many elements');
        }
        return dart.as(this._next, E);
      }
      forEach(action) {
        let modificationCount = this._modificationCount;
        let current = this._next;
        while (!core.identical(current, this)) {
          action(dart.as(current, E));
          if (modificationCount !== this._modificationCount) {
            throw new core.ConcurrentModificationError(this);
          }
          current = current._next;
        }
      }
      get isEmpty() { return this._length === 0; }
      _insertAfter(entry, newEntry) {
        if (newEntry.list !== null) {
          throw new core.StateError('LinkedListEntry is already in a LinkedList');
        }
        this._modificationCount++;
        newEntry._list = this;
        let predecessor = entry;
        let successor = entry._next;
        successor._previous = newEntry;
        newEntry._previous = predecessor;
        newEntry._next = successor;
        predecessor._next = newEntry;
        this._length++;
      }
      _unlink(entry) {
        this._modificationCount++;
        entry._next._previous = entry._previous;
        entry._previous._next = entry._next;
        this._length--;
        entry._list = entry._next = entry._previous = null;
      }
    }
    return LinkedList;
  });
  let LinkedList = LinkedList$(dynamic);

  let _LinkedListIterator$ = dart.generic(function(E) {
    class _LinkedListIterator {
      constructor(list) {
        this._list = list;
        this._modificationCount = list._modificationCount;
        this._next = list._next;
        this._current = null;
      }
      get current() { return this._current; }
      moveNext() {
        if (core.identical(this._next, this._list)) {
          this._current = null;
          return false;
        }
        if (this._modificationCount !== this._list._modificationCount) {
          throw new core.ConcurrentModificationError(this);
        }
        this._current = dart.as(this._next, E);
        this._next = this._next._next;
        return true;
      }
    }
    return _LinkedListIterator;
  });
  let _LinkedListIterator = _LinkedListIterator$(dynamic);

  class _LinkedListLink {
    constructor() {
      this._next = null;
      this._previous = null;
      super();
    }
  }

  let LinkedListEntry$ = dart.generic(function(E) {
    class LinkedListEntry {
      constructor() {
        this._list = null;
        this._next = null;
        this._previous = null;
        super();
      }
      get list() { return this._list; }
      unlink() {
        this._list._unlink(this);
      }
      get next() {
        if (core.identical(this._next, this._list)) return null;
        let result = dart.as(this._next, E);
        return result;
      }
      get previous() {
        if (core.identical(this._previous, this._list)) return null;
        return dart.as(this._previous, E);
      }
      insertAfter(entry) {
        this._list._insertAfter(this, entry);
      }
      insertBefore(entry) {
        this._list._insertAfter(this._previous, entry);
      }
    }
    return LinkedListEntry;
  });
  let LinkedListEntry = LinkedListEntry$(dynamic);

  let ListBase$ = dart.generic(function(E) {
    class ListBase extends dart.mixin(core.Object, ListMixin$(E)) {
      static listToString(list) { return IterableBase.iterableToFullString(list, '[', ']'); }
    }
    return ListBase;
  });
  let ListBase = ListBase$(dynamic);

  let ListMixin$ = dart.generic(function(E) {
    class ListMixin {
      get iterator() { return new _internal.ListIterator(this); }
      elementAt(index) { return this.get(index); }
      forEach(action) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
          action(this.get(i));
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
      }
      get isEmpty() { return this.length === 0; }
      get isNotEmpty() { return !this.isEmpty; }
      get first() {
        if (this.length === 0) throw _internal.IterableElementError.noElement();
        return this.get(0);
      }
      get last() {
        if (this.length === 0) throw _internal.IterableElementError.noElement();
        return this.get(this.length - 1);
      }
      get single() {
        if (this.length === 0) throw _internal.IterableElementError.noElement();
        if (this.length > 1) throw _internal.IterableElementError.tooMany();
        return this.get(0);
      }
      contains(element) {
        let length = this.length;
        for (let i = 0; i < this.length; i++) {
          if (dart.equals(this.get(i), element)) return true;
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        return false;
      }
      every(test) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
          if (!test(this.get(i))) return false;
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        return true;
      }
      any(test) {
        let length = this.length;
        for (let i = 0; i < length; i++) {
          if (test(this.get(i))) return true;
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        return false;
      }
      firstWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        let length = this.length;
        for (let i = 0; i < length; i++) {
          let element = this.get(i);
          if (test(element)) return element;
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      lastWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        let length = this.length;
        for (let i = length - 1; i >= 0; i--) {
          let element = this.get(i);
          if (test(element)) return element;
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      singleWhere(test) {
        let length = this.length;
        let match = dart.as(null, E);
        let matchFound = false;
        for (let i = 0; i < length; i++) {
          let element = this.get(i);
          if (test(element)) {
            if (matchFound) {
              throw _internal.IterableElementError.tooMany();
            }
            matchFound = true;
            match = element;
          }
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        if (matchFound) return match;
        throw _internal.IterableElementError.noElement();
      }
      join(separator) {
        if (separator === undefined) separator = "";
        if (this.length === 0) return "";
        let buffer = new core.StringBuffer();
        buffer.writeAll(this, separator);
        return buffer.toString();
      }
      where(test) { return new _internal.WhereIterable(this, test); }
      map(f) { return new _internal.MappedListIterable(this, f); }
      expand(f) { return new _internal.ExpandIterable(this, f); }
      reduce(combine) {
        let length = this.length;
        if (length === 0) throw _internal.IterableElementError.noElement();
        let value = this.get(0);
        for (let i = 1; i < length; i++) {
          value = combine(value, this.get(i));
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        return value;
      }
      fold(initialValue, combine) {
        let value = initialValue;
        let length = this.length;
        for (let i = 0; i < length; i++) {
          value = combine(value, this.get(i));
          if (length !== this.length) {
            throw new core.ConcurrentModificationError(this);
          }
        }
        return value;
      }
      skip(count) { return new _internal.SubListIterable(this, count, null); }
      skipWhile(test) {
        return new _internal.SkipWhileIterable(this, test);
      }
      take(count) { return new _internal.SubListIterable(this, 0, count); }
      takeWhile(test) {
        return new _internal.TakeWhileIterable(this, test);
      }
      toList(opt$) {
        let growable = opt$.growable === undefined ? true : opt$.growable;
        let result = null;
        if (growable) {
          result = ((_) => {
            _.length = this.length;
            return _;
          }).bind(this)(new core.List());
        } else {
          result = new core.List(this.length);
        }
        for (let i = 0; i < this.length; i++) {
          result.set(i, this.get(i));
        }
        return result;
      }
      toSet() {
        let result = new core.Set();
        for (let i = 0; i < this.length; i++) {
          result.add(this.get(i));
        }
        return result;
      }
      add(element) {
        this.set(this.length++, element);
      }
      addAll(iterable) {
        for (let element of iterable) {
          this.set(this.length++, element);
        }
      }
      remove(element) {
        for (let i = 0; i < this.length; i++) {
          if (dart.equals(this.get(i), element)) {
            this.setRange(i, this.length - 1, this, i + 1);
            this.length = 1;
            return true;
          }
        }
        return false;
      }
      removeWhere(test) {
        _filter(this, dart.as(test, /* Unimplemented type (dynamic) → bool */), false);
      }
      retainWhere(test) {
        _filter(this, dart.as(test, /* Unimplemented type (dynamic) → bool */), true);
      }
      static _filter(source, test, retainMatching) {
        let retained = new List.from([]);
        let length = source.length;
        for (let i = 0; i < length; i++) {
          let element = source.get(i);
          if (test(element) === retainMatching) {
            retained.add(element);
          }
          if (length !== source.length) {
            throw new core.ConcurrentModificationError(source);
          }
        }
        if (retained.length !== source.length) {
          source.setRange(0, retained.length, retained);
          source.length = retained.length;
        }
      }
      clear() {
        this.length = 0;
      }
      removeLast() {
        if (this.length === 0) {
          throw _internal.IterableElementError.noElement();
        }
        let result = this.get(this.length - 1);
        this.length--;
        return result;
      }
      sort(compare) {
        if (compare === undefined) compare = null;
        if (compare === null) {
          let defaultCompare = core.Comparable.compare;
          compare = defaultCompare;
        }
        _internal.Sort.sort(this, dart.as(compare, /* Unimplemented type (dynamic, dynamic) → int */));
      }
      shuffle(random) {
        if (random === undefined) random = null;
        if (random === null) random = new math.Random();
        let length = this.length;
        while (length > 1) {
          let pos = random.nextInt(length);
          length = 1;
          let tmp = this.get(length);
          this.set(length, this.get(pos));
          this.set(pos, tmp);
        }
      }
      asMap() {
        return new _internal.ListMapView(this);
      }
      sublist(start, end) {
        if (end === undefined) end = null;
        let listLength = this.length;
        if (end === null) end = listLength;
        core.RangeError.checkValidRange(start, end, listLength);
        let length = end - start;
        let result = new core.List();
        result.length = length;
        for (let i = 0; i < length; i++) {
          result.set(i, this.get(start + i));
        }
        return result;
      }
      getRange(start, end) {
        core.RangeError.checkValidRange(start, end, this.length);
        return new _internal.SubListIterable(this, start, end);
      }
      removeRange(start, end) {
        core.RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        this.setRange(start, this.length - length, this, end);
        this.length = length;
      }
      fillRange(start, end, fill) {
        if (fill === undefined) fill = null;
        core.RangeError.checkValidRange(start, end, this.length);
        for (let i = start; i < end; i++) {
          this.set(i, fill);
        }
      }
      setRange(start, end, iterable, skipCount) {
        if (skipCount === undefined) skipCount = 0;
        core.RangeError.checkValidRange(start, end, this.length);
        let length = end - start;
        if (length === 0) return;
        core.RangeError.checkNotNegative(skipCount, "skipCount");
        let otherList = null;
        let otherStart = null;
        if (dart.is(iterable, core.List)) {
          otherList = dart.as(iterable, core.List);
          otherStart = skipCount;
        } else {
          otherList = iterable.skip(skipCount).toList({growable: false});
          otherStart = 0;
        }
        if (otherStart + length > otherList.length) {
          throw _internal.IterableElementError.tooFew();
        }
        if (otherStart < start) {
          for (let i = length - 1; i >= 0; i--) {
            this.set(start + i, dart.as(otherList.get(otherStart + i), E));
          }
        } else {
          for (let i = 0; i < length; i++) {
            this.set(start + i, dart.as(otherList.get(otherStart + i), E));
          }
        }
      }
      replaceRange(start, end, newContents) {
        core.RangeError.checkValidRange(start, end, this.length);
        if (!dart.is(newContents, _internal.EfficientLength)) {
          newContents = newContents.toList();
        }
        let removeLength = end - start;
        let insertLength = newContents.length;
        if (removeLength >= insertLength) {
          let delta = removeLength - insertLength;
          let insertEnd = start + insertLength;
          let newLength = this.length - delta;
          this.setRange(start, insertEnd, newContents);
          if (delta !== 0) {
            this.setRange(insertEnd, newLength, this, end);
            this.length = newLength;
          }
        } else {
          let delta = insertLength - removeLength;
          let newLength = this.length + delta;
          let insertEnd = start + insertLength;
          this.length = newLength;
          this.setRange(insertEnd, newLength, this, end);
          this.setRange(start, insertEnd, newContents);
        }
      }
      indexOf(element, startIndex) {
        if (startIndex === undefined) startIndex = 0;
        if (startIndex >= this.length) {
          return -1;
        }
        if (startIndex < 0) {
          startIndex = 0;
        }
        for (let i = startIndex; i < this.length; i++) {
          if (dart.equals(this.get(i), element)) {
            return i;
          }
        }
        return -1;
      }
      lastIndexOf(element, startIndex) {
        if (startIndex === undefined) startIndex = null;
        if (startIndex === null) {
          startIndex = this.length - 1;
        } else {
          if (startIndex < 0) {
            return -1;
          }
          if (startIndex >= this.length) {
            startIndex = this.length - 1;
          }
        }
        for (let i = startIndex; i >= 0; i--) {
          if (dart.equals(this.get(i), element)) {
            return i;
          }
        }
        return -1;
      }
      insert(index, element) {
        core.RangeError.checkValueInInterval(index, 0, this.length, "index");
        if (index === this.length) {
          this.add(element);
          return;
        }
        if (!(typeof index == "number")) throw new core.ArgumentError(index);
        this.length++;
        this.setRange(index + 1, this.length, this, index);
        this.set(index, element);
      }
      removeAt(index) {
        let result = this.get(index);
        this.setRange(index, this.length - 1, this, index + 1);
        this.length--;
        return result;
      }
      insertAll(index, iterable) {
        core.RangeError.checkValueInInterval(index, 0, this.length, "index");
        if (dart.is(iterable, _internal.EfficientLength)) {
          iterable = iterable.toList();
        }
        let insertionLength = iterable.length;
        this.length = insertionLength;
        this.setRange(index + insertionLength, this.length, this, index);
        this.setAll(index, iterable);
      }
      setAll(index, iterable) {
        if (dart.is(iterable, core.List)) {
          this.setRange(index, index + iterable.length, iterable);
        } else {
          for (let element of iterable) {
            this.set(index++, element);
          }
        }
      }
      get reversed() { return new _internal.ReversedListIterable(this); }
      toString() { return IterableBase.iterableToFullString(this, '[', ']'); }
    }
    return ListMixin;
  });
  let ListMixin = ListMixin$(dynamic);

  let MapBase$ = dart.generic(function(K, V) {
    class MapBase extends dart.mixin(MapMixin$(K, V)) {}

    return MapBase;
  });
  let MapBase = MapBase$(dynamic, dynamic);
  let MapMixin$ = dart.generic(function(K, V) {
    class MapMixin {
      forEach(action) {
        for (let key of this.keys) {
          action(key, this.get(key));
        }
      }
      addAll(other) {
        for (let key of other.keys) {
          this.set(key, other.get(key));
        }
      }
      containsValue(value) {
        for (let key of this.keys) {
          if (dart.equals(this.get(key), value)) return true;
        }
        return false;
      }
      putIfAbsent(key, ifAbsent) {
        if (this.keys.contains(key)) {
          return this.get(key);
        }
        return this.set(key, ifAbsent());
      }
      containsKey(key) { return this.keys.contains(key); }
      get length() { return this.keys.length; }
      get isEmpty() { return this.keys.isEmpty; }
      get isNotEmpty() { return this.keys.isNotEmpty; }
      get values() { return new _MapBaseValueIterable(this); }
      toString() { return Maps.mapToString(this); }
    }
    return MapMixin;
  });
  let MapMixin = MapMixin$(dynamic, dynamic);

  let UnmodifiableMapBase$ = dart.generic(function(K, V) {
    class UnmodifiableMapBase extends dart.mixin(_UnmodifiableMapMixin$(K, V)) {}

    return UnmodifiableMapBase;
  });
  let UnmodifiableMapBase = UnmodifiableMapBase$(dynamic, dynamic);
  let _MapBaseValueIterable$ = dart.generic(function(V) {
    class _MapBaseValueIterable extends IterableBase$(V) {
      constructor(_map) {
        this._map = _map;
        super();
      }
      get length() { return this._map.length; }
      get isEmpty() { return this._map.isEmpty; }
      get isNotEmpty() { return this._map.isNotEmpty; }
      get first() { return dart.as(this._map.get(this._map.keys.first), V); }
      get single() { return dart.as(this._map.get(this._map.keys.single), V); }
      get last() { return dart.as(this._map.get(this._map.keys.last), V); }
      get iterator() { return new _MapBaseValueIterator(this._map); }
    }
    return _MapBaseValueIterable;
  });
  let _MapBaseValueIterable = _MapBaseValueIterable$(dynamic);

  let _MapBaseValueIterator$ = dart.generic(function(V) {
    class _MapBaseValueIterator {
      constructor(map) {
        this._map = map;
        this._keys = map.keys.iterator;
        this._current = dart.as(null, V);
      }
      moveNext() {
        if (this._keys.moveNext()) {
          this._current = dart.as(this._map.get(this._keys.current), V);
          return true;
        }
        this._current = dart.as(null, V);
        return false;
      }
      get current() { return this._current; }
    }
    return _MapBaseValueIterator;
  });
  let _MapBaseValueIterator = _MapBaseValueIterator$(dynamic);

  let _UnmodifiableMapMixin$ = dart.generic(function(K, V) {
    class _UnmodifiableMapMixin {
      set(key, value) {
        throw new core.UnsupportedError("Cannot modify unmodifiable map");
      }
      addAll(other) {
        throw new core.UnsupportedError("Cannot modify unmodifiable map");
      }
      clear() {
        throw new core.UnsupportedError("Cannot modify unmodifiable map");
      }
      remove(key) {
        throw new core.UnsupportedError("Cannot modify unmodifiable map");
      }
      putIfAbsent(key, ifAbsent) {
        throw new core.UnsupportedError("Cannot modify unmodifiable map");
      }
    }
    return _UnmodifiableMapMixin;
  });
  let _UnmodifiableMapMixin = _UnmodifiableMapMixin$(dynamic, dynamic);

  let MapView$ = dart.generic(function(K, V) {
    class MapView {
      constructor(map) {
        this._map = map;
      }
      get(key) { return this._map.get(key); }
      set(key, value) {
        this._map.set(key, value);
      }
      addAll(other) {
        this._map.addAll(other);
      }
      clear() {
        this._map.clear();
      }
      putIfAbsent(key, ifAbsent) { return this._map.putIfAbsent(key, ifAbsent); }
      containsKey(key) { return this._map.containsKey(key); }
      containsValue(value) { return this._map.containsValue(value); }
      forEach(action) {
        this._map.forEach(action);
      }
      get isEmpty() { return this._map.isEmpty; }
      get isNotEmpty() { return this._map.isNotEmpty; }
      get length() { return this._map.length; }
      get keys() { return this._map.keys; }
      remove(key) { return this._map.remove(key); }
      toString() { return this._map.toString(); }
      get values() { return this._map.values; }
    }
    return MapView;
  });
  let MapView = MapView$(dynamic, dynamic);

  let UnmodifiableMapView$ = dart.generic(function(K, V) {
    class UnmodifiableMapView extends dart.mixin(_UnmodifiableMapMixin$(K, V)) {}

    return UnmodifiableMapView;
  });
  let UnmodifiableMapView = UnmodifiableMapView$(dynamic, dynamic);
  class Maps {
    static containsValue(map, value) {
      for (let v of map.values) {
        if (dart.equals(value, v)) {
          return true;
        }
      }
      return false;
    }
    static containsKey(map, key) {
      for (let k of map.keys) {
        if (dart.equals(key, k)) {
          return true;
        }
      }
      return false;
    }
    static putIfAbsent(map, key, ifAbsent) {
      if (map.containsKey(key)) {
        return map.get(key);
      }
      let v = ifAbsent();
      map.set(key, v);
      return v;
    }
    static clear(map) {
      for (let k of map.keys.toList()) {
        map.remove(k);
      }
    }
    static forEach(map, f) {
      for (let k of map.keys) {
        f(k, map.get(k));
      }
    }
    static getValues(map) {
      return map.keys.map((key) => map.get(key));
    }
    static length(map) { return map.keys.length; }
    static isEmpty(map) { return map.keys.isEmpty; }
    static isNotEmpty(map) { return map.keys.isNotEmpty; }
    static mapToString(m) {
      if (IterableBase._isToStringVisiting(m)) {
        return '{...}';
      }
      let result = new core.StringBuffer();
      try {
        IterableBase._toStringVisiting.add(m);
        result.write('{');
        let first = true;
        m.forEach(((k, v) => {
          if (!first) {
            result.write(', ');
          }
          first = false;
          result.write(k);
          result.write(': ');
          result.write(v);
        }).bind(this));
        result.write('}');
      }
      finally {
        dart.assert(core.identical(IterableBase._toStringVisiting.last, m));
        IterableBase._toStringVisiting.removeLast();
      }
      return result.toString();
    }
    static _id(x) { return x; }
    static _fillMapWithMappedIterable(map, iterable, key, value) {
      if (key === null) key = _id;
      if (value === null) value = _id;
      for (let element of iterable) {
        map.set(key(element), value(element));
      }
    }
    static _fillMapWithIterables(map, keys, values) {
      let keyIterator = keys.iterator;
      let valueIterator = values.iterator;
      let hasNextKey = keyIterator.moveNext();
      let hasNextValue = valueIterator.moveNext();
      while (hasNextKey && hasNextValue) {
        map.set(keyIterator.current, valueIterator.current);
        hasNextKey = keyIterator.moveNext();
        hasNextValue = valueIterator.moveNext();
      }
      if (hasNextKey || hasNextValue) {
        throw new core.ArgumentError("Iterables do not have same length.");
      }
    }
  }

  let Queue$ = dart.generic(function(E) {
    class Queue {
      constructor() {
        return new ListQueue();
      }
      /*constructor*/ from(elements) {
        return new ListQueue.from(elements);
      }
    }
    dart.defineNamedConstructor(Queue, "from");
    return Queue;
  });
  let Queue = Queue$(dynamic);

  let DoubleLinkedQueueEntry$ = dart.generic(function(E) {
    class DoubleLinkedQueueEntry {
      constructor(e) {
        this._element = e;
        this._previous = null;
        this._next = null;
      }
      _link(previous, next) {
        this._next = next;
        this._previous = previous;
        previous._next = this;
        next._previous = this;
      }
      append(e) {
        new DoubleLinkedQueueEntry(e)._link(this, this._next);
      }
      prepend(e) {
        new DoubleLinkedQueueEntry(e)._link(this._previous, this);
      }
      remove() {
        this._previous._next = this._next;
        this._next._previous = this._previous;
        this._next = null;
        this._previous = null;
        return this._element;
      }
      _asNonSentinelEntry() {
        return this;
      }
      previousEntry() {
        return this._previous._asNonSentinelEntry();
      }
      nextEntry() {
        return this._next._asNonSentinelEntry();
      }
      get element() {
        return this._element;
      }
      set element(e) {
        this._element = e;
      }
    }
    return DoubleLinkedQueueEntry;
  });
  let DoubleLinkedQueueEntry = DoubleLinkedQueueEntry$(dynamic);

  let _DoubleLinkedQueueEntrySentinel$ = dart.generic(function(E) {
    class _DoubleLinkedQueueEntrySentinel extends DoubleLinkedQueueEntry$(E) {
      constructor() {
        super(dart.as(null, E));
        this._link(this, this);
      }
      remove() {
        throw _internal.IterableElementError.noElement();
      }
      _asNonSentinelEntry() {
        return null;
      }
      set element(e) {
        dart.assert(false);
      }
      get element() {
        throw _internal.IterableElementError.noElement();
      }
    }
    return _DoubleLinkedQueueEntrySentinel;
  });
  let _DoubleLinkedQueueEntrySentinel = _DoubleLinkedQueueEntrySentinel$(dynamic);

  let DoubleLinkedQueue$ = dart.generic(function(E) {
    class DoubleLinkedQueue extends IterableBase$(E) {
      constructor() {
        this._sentinel = null;
        this._elementCount = 0;
        super();
        this._sentinel = new _DoubleLinkedQueueEntrySentinel();
      }
      /*constructor*/ from(elements) {
        let list = dart.as(new DoubleLinkedQueue(), Queue$(E));
        for (let e of elements) {
          list.addLast(e);
        }
        return dart.as(list, DoubleLinkedQueue$(E));
      }
      get length() { return this._elementCount; }
      addLast(value) {
        this._sentinel.prepend(value);
        this._elementCount++;
      }
      addFirst(value) {
        this._sentinel.append(value);
        this._elementCount++;
      }
      add(value) {
        this._sentinel.prepend(value);
        this._elementCount++;
      }
      addAll(iterable) {
        for (let value of iterable) {
          this._sentinel.prepend(value);
          this._elementCount++;
        }
      }
      removeLast() {
        let result = this._sentinel._previous.remove();
        this._elementCount--;
        return result;
      }
      removeFirst() {
        let result = this._sentinel._next.remove();
        this._elementCount--;
        return result;
      }
      remove(o) {
        let entry = this._sentinel._next;
        while (!core.identical(entry, this._sentinel)) {
          if (dart.equals(entry.element, o)) {
            entry.remove();
            this._elementCount--;
            return true;
          }
          entry = entry._next;
        }
        return false;
      }
      _filter(test, removeMatching) {
        let entry = this._sentinel._next;
        while (!core.identical(entry, this._sentinel)) {
          let next = entry._next;
          if (core.identical(removeMatching, test(entry.element))) {
            entry.remove();
            this._elementCount--;
          }
          entry = next;
        }
      }
      removeWhere(test) {
        this._filter(test, true);
      }
      retainWhere(test) {
        this._filter(test, false);
      }
      get first() {
        return this._sentinel._next.element;
      }
      get last() {
        return this._sentinel._previous.element;
      }
      get single() {
        if (core.identical(this._sentinel._next, this._sentinel._previous)) {
          return this._sentinel._next.element;
        }
        throw _internal.IterableElementError.tooMany();
      }
      lastEntry() {
        return this._sentinel.previousEntry();
      }
      firstEntry() {
        return this._sentinel.nextEntry();
      }
      get isEmpty() {
        return (core.identical(this._sentinel._next, this._sentinel));
      }
      clear() {
        this._sentinel._next = this._sentinel;
        this._sentinel._previous = this._sentinel;
        this._elementCount = 0;
      }
      forEachEntry(f) {
        let entry = this._sentinel._next;
        while (!core.identical(entry, this._sentinel)) {
          let nextEntry = entry._next;
          f(entry);
          entry = nextEntry;
        }
      }
      get iterator() {
        return new _DoubleLinkedQueueIterator(this._sentinel);
      }
      toString() { return IterableBase.iterableToFullString(this, '{', '}'); }
    }
    dart.defineNamedConstructor(DoubleLinkedQueue, "from");
    return DoubleLinkedQueue;
  });
  let DoubleLinkedQueue = DoubleLinkedQueue$(dynamic);

  let _DoubleLinkedQueueIterator$ = dart.generic(function(E) {
    class _DoubleLinkedQueueIterator {
      constructor(sentinel) {
        this._sentinel = sentinel;
        this._nextEntry = sentinel._next;
        this._current = dart.as(null, E);
      }
      moveNext() {
        if (!core.identical(this._nextEntry, this._sentinel)) {
          this._current = this._nextEntry._element;
          this._nextEntry = this._nextEntry._next;
          return true;
        }
        this._current = dart.as(null, E);
        this._nextEntry = this._sentinel = null;
        return false;
      }
      get current() { return this._current; }
    }
    return _DoubleLinkedQueueIterator;
  });
  let _DoubleLinkedQueueIterator = _DoubleLinkedQueueIterator$(dynamic);

  let ListQueue$ = dart.generic(function(E) {
    class ListQueue extends IterableBase$(E) {
      constructor(initialCapacity) {
        if (initialCapacity === undefined) initialCapacity = null;
        this._head = 0;
        this._tail = 0;
        this._table = null;
        this._modificationCount = 0;
        super();
        if (initialCapacity === null || initialCapacity < _INITIAL_CAPACITY) {
          initialCapacity = _INITIAL_CAPACITY;
        } else if (!_isPowerOf2(initialCapacity)) {
          initialCapacity = _nextPowerOf2(initialCapacity);
        }
        dart.assert(_isPowerOf2(initialCapacity));
        this._table = new core.List(initialCapacity);
      }
      /*constructor*/ from(elements) {
        if (dart.is(elements, core.List)) {
          let length = elements.length;
          let queue = dart.as(new ListQueue(length + 1), ListQueue$(E));
          dart.assert(queue._table.length > length);
          let sourceList = dart.as(elements, core.List);
          queue._table.setRange(0, length, dart.as(sourceList, core.Iterable$(E)), 0);
          queue._tail = length;
          return queue;
        } else {
          let capacity = _INITIAL_CAPACITY;
          if (dart.is(elements, _internal.EfficientLength)) {
            capacity = elements.length;
          }
          let result = new ListQueue(capacity);
          for (let element of elements) {
            result.addLast(element);
          }
          return result;
        }
      }
      get iterator() { return new _ListQueueIterator(this); }
      forEach(action) {
        let modificationCount = this._modificationCount;
        for (let i = this._head; i !== this._tail; i = (i + 1) & (this._table.length - 1)) {
          action(this._table.get(i));
          this._checkModification(modificationCount);
        }
      }
      get isEmpty() { return this._head === this._tail; }
      get length() { return (this._tail - this._head) & (this._table.length - 1); }
      get first() {
        if (this._head === this._tail) throw _internal.IterableElementError.noElement();
        return this._table.get(this._head);
      }
      get last() {
        if (this._head === this._tail) throw _internal.IterableElementError.noElement();
        return this._table.get((this._tail - 1) & (this._table.length - 1));
      }
      get single() {
        if (this._head === this._tail) throw _internal.IterableElementError.noElement();
        if (this.length > 1) throw _internal.IterableElementError.tooMany();
        return this._table.get(this._head);
      }
      elementAt(index) {
        core.RangeError.checkValidIndex(index, this);
        return this._table.get((this._head + index) & (this._table.length - 1));
      }
      toList(opt$) {
        let growable = opt$.growable === undefined ? true : opt$.growable;
        let list = null;
        if (growable) {
          list = ((_) => {
            _.length = this.length;
            return _;
          }).bind(this)(new core.List());
        } else {
          list = new core.List(this.length);
        }
        this._writeToList(list);
        return list;
      }
      add(element) {
        this._add(element);
      }
      addAll(elements) {
        if (dart.is(elements, core.List)) {
          let list = dart.as(elements, core.List);
          let addCount = list.length;
          let length = this.length;
          if (length + addCount >= this._table.length) {
            this._preGrow(length + addCount);
            this._table.setRange(length, length + addCount, dart.as(list, core.Iterable$(E)), 0);
            this._tail = addCount;
          } else {
            let endSpace = this._table.length - this._tail;
            if (addCount < endSpace) {
              this._table.setRange(this._tail, this._tail + addCount, dart.as(list, core.Iterable$(E)), 0);
              this._tail = addCount;
            } else {
              let preSpace = addCount - endSpace;
              this._table.setRange(this._tail, this._tail + endSpace, dart.as(list, core.Iterable$(E)), 0);
              this._table.setRange(0, preSpace, dart.as(list, core.Iterable$(E)), endSpace);
              this._tail = preSpace;
            }
          }
          this._modificationCount++;
        } else {
          for (let element of elements) this._add(element);
        }
      }
      remove(object) {
        for (let i = this._head; i !== this._tail; i = (i + 1) & (this._table.length - 1)) {
          let element = this._table.get(i);
          if (dart.equals(element, object)) {
            this._remove(i);
            this._modificationCount++;
            return true;
          }
        }
        return false;
      }
      _filterWhere(test, removeMatching) {
        let index = this._head;
        let modificationCount = this._modificationCount;
        let i = this._head;
        while (i !== this._tail) {
          let element = this._table.get(i);
          let remove = core.identical(removeMatching, test(element));
          this._checkModification(modificationCount);
          if (remove) {
            i = this._remove(i);
            modificationCount = ++this._modificationCount;
          } else {
            i = (i + 1) & (this._table.length - 1);
          }
        }
      }
      removeWhere(test) {
        this._filterWhere(test, true);
      }
      retainWhere(test) {
        this._filterWhere(test, false);
      }
      clear() {
        if (this._head !== this._tail) {
          for (let i = this._head; i !== this._tail; i = (i + 1) & (this._table.length - 1)) {
            this._table.set(i, dart.as(null, E));
          }
          this._head = this._tail = 0;
          this._modificationCount++;
        }
      }
      toString() { return IterableBase.iterableToFullString(this, "{", "}"); }
      addLast(element) {
        this._add(element);
      }
      addFirst(element) {
        this._head = (this._head - 1) & (this._table.length - 1);
        this._table.set(this._head, element);
        if (this._head === this._tail) this._grow();
        this._modificationCount++;
      }
      removeFirst() {
        if (this._head === this._tail) throw _internal.IterableElementError.noElement();
        this._modificationCount++;
        let result = this._table.get(this._head);
        this._table.set(this._head, dart.as(null, E));
        this._head = (this._head + 1) & (this._table.length - 1);
        return result;
      }
      removeLast() {
        if (this._head === this._tail) throw _internal.IterableElementError.noElement();
        this._modificationCount++;
        this._tail = (this._tail - 1) & (this._table.length - 1);
        let result = this._table.get(this._tail);
        this._table.set(this._tail, dart.as(null, E));
        return result;
      }
      static _isPowerOf2(number) { return (number & (number - 1)) === 0; }
      static _nextPowerOf2(number) {
        dart.assert(number > 0);
        number = (number << 1) - 1;
        for (;;) {
          let nextNumber = number & (number - 1);
          if (nextNumber === 0) return number;
          number = nextNumber;
        }
      }
      _checkModification(expectedModificationCount) {
        if (expectedModificationCount !== this._modificationCount) {
          throw new core.ConcurrentModificationError(this);
        }
      }
      _add(element) {
        this._table.set(this._tail, element);
        this._tail = (this._tail + 1) & (this._table.length - 1);
        if (this._head === this._tail) this._grow();
        this._modificationCount++;
      }
      _remove(offset) {
        let mask = this._table.length - 1;
        let startDistance = (offset - this._head) & mask;
        let endDistance = (this._tail - offset) & mask;
        if (startDistance < endDistance) {
          let i = offset;
          while (i !== this._head) {
            let prevOffset = (i - 1) & mask;
            this._table.set(i, this._table.get(prevOffset));
            i = prevOffset;
          }
          this._table.set(this._head, dart.as(null, E));
          this._head = (this._head + 1) & mask;
          return (offset + 1) & mask;
        } else {
          this._tail = (this._tail - 1) & mask;
          let i = offset;
          while (i !== this._tail) {
            let nextOffset = (i + 1) & mask;
            this._table.set(i, this._table.get(nextOffset));
            i = nextOffset;
          }
          this._table.set(this._tail, dart.as(null, E));
          return offset;
        }
      }
      _grow() {
        let newTable = new core.List(this._table.length * 2);
        let split = this._table.length - this._head;
        newTable.setRange(0, split, this._table, this._head);
        newTable.setRange(split, split + this._head, this._table, 0);
        this._head = 0;
        this._tail = this._table.length;
        this._table = newTable;
      }
      _writeToList(target) {
        dart.assert(target.length >= this.length);
        if (this._head <= this._tail) {
          let length = this._tail - this._head;
          target.setRange(0, length, this._table, this._head);
          return length;
        } else {
          let firstPartSize = this._table.length - this._head;
          target.setRange(0, firstPartSize, this._table, this._head);
          target.setRange(firstPartSize, firstPartSize + this._tail, this._table, 0);
          return this._tail + firstPartSize;
        }
      }
      _preGrow(newElementCount) {
        dart.assert(newElementCount >= this.length);
        newElementCount = newElementCount >> 1;
        let newCapacity = _nextPowerOf2(newElementCount);
        let newTable = new core.List(newCapacity);
        this._tail = this._writeToList(newTable);
        this._table = newTable;
        this._head = 0;
      }
    }
    dart.defineNamedConstructor(ListQueue, "from");
    ListQueue._INITIAL_CAPACITY = 8;
    return ListQueue;
  });
  let ListQueue = ListQueue$(dynamic);

  let _ListQueueIterator$ = dart.generic(function(E) {
    class _ListQueueIterator {
      constructor(queue) {
        this._queue = queue;
        this._end = queue._tail;
        this._modificationCount = queue._modificationCount;
        this._position = queue._head;
        this._current = dart.as(null, E);
      }
      get current() { return this._current; }
      moveNext() {
        this._queue._checkModification(this._modificationCount);
        if (this._position === this._end) {
          this._current = dart.as(null, E);
          return false;
        }
        this._current = dart.as(this._queue._table.get(this._position), E);
        this._position = (this._position + 1) & (this._queue._table.length - 1);
        return true;
      }
    }
    return _ListQueueIterator;
  });
  let _ListQueueIterator = _ListQueueIterator$(dynamic);

  let SetMixin$ = dart.generic(function(E) {
    class SetMixin {
      get isEmpty() { return this.length === 0; }
      get isNotEmpty() { return this.length !== 0; }
      clear() {
        this.removeAll(this.toList());
      }
      addAll(elements) {
        for (let element of elements) this.add(element);
      }
      removeAll(elements) {
        for (let element of elements) this.remove(element);
      }
      retainAll(elements) {
        let toRemove = this.toSet();
        for (let o of elements) {
          toRemove.remove(o);
        }
        this.removeAll(toRemove);
      }
      removeWhere(test) {
        let toRemove = new List.from([]);
        for (let element of this) {
          if (test(element)) toRemove.add(element);
        }
        this.removeAll(dart.as(toRemove, core.Iterable$(core.Object)));
      }
      retainWhere(test) {
        let toRemove = new List.from([]);
        for (let element of this) {
          if (!test(element)) toRemove.add(element);
        }
        this.removeAll(dart.as(toRemove, core.Iterable$(core.Object)));
      }
      containsAll(other) {
        for (let o of other) {
          if (!this.contains(o)) return false;
        }
        return true;
      }
      union(other) {
        return ((_) => {
          _.addAll(other);
          return _;
        }).bind(this)(this.toSet());
      }
      intersection(other) {
        let result = this.toSet();
        for (let element of this) {
          if (!other.contains(element)) result.remove(element);
        }
        return result;
      }
      difference(other) {
        let result = this.toSet();
        for (let element of this) {
          if (other.contains(element)) result.remove(element);
        }
        return result;
      }
      toList(opt$) {
        let growable = opt$.growable === undefined ? true : opt$.growable;
        let result = growable ? (((_) => {
          _.length = this.length;
          return _;
        }).bind(this)(new core.List())) : new core.List(this.length);
        let i = 0;
        for (let element of this) result.set(i++, element);
        return result;
      }
      map(f) { return new _internal.EfficientLengthMappedIterable(this, f); }
      get single() {
        if (this.length > 1) throw _internal.IterableElementError.tooMany();
        let it = this.iterator;
        if (!it.moveNext()) throw _internal.IterableElementError.noElement();
        let result = dart.as(it.current, E);
        return result;
      }
      toString() { return IterableBase.iterableToFullString(this, '{', '}'); }
      where(f) { return new _internal.WhereIterable(this, f); }
      expand(f) { return new _internal.ExpandIterable(this, f); }
      forEach(f) {
        for (let element of this) f(element);
      }
      reduce(combine) {
        let iterator = this.iterator;
        if (!iterator.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        let value = iterator.current;
        while (iterator.moveNext()) {
          value = combine(value, iterator.current);
        }
        return value;
      }
      fold(initialValue, combine) {
        let value = initialValue;
        for (let element of this) value = combine(value, element);
        return value;
      }
      every(f) {
        for (let element of this) {
          if (!f(element)) return false;
        }
        return true;
      }
      join(separator) {
        if (separator === undefined) separator = "";
        let iterator = this.iterator;
        if (!iterator.moveNext()) return "";
        let buffer = new core.StringBuffer();
        if (separator === null || dart.equals(separator, "")) {
          do {
            buffer.write(`${iterator.current}`);
          }
          while (iterator.moveNext());
        } else {
          buffer.write(`${iterator.current}`);
          while (iterator.moveNext()) {
            buffer.write(separator);
            buffer.write(`${iterator.current}`);
          }
        }
        return buffer.toString();
      }
      any(test) {
        for (let element of this) {
          if (test(element)) return true;
        }
        return false;
      }
      take(n) {
        return new _internal.TakeIterable(this, n);
      }
      takeWhile(test) {
        return new _internal.TakeWhileIterable(this, test);
      }
      skip(n) {
        return new _internal.SkipIterable(this, n);
      }
      skipWhile(test) {
        return new _internal.SkipWhileIterable(this, test);
      }
      get first() {
        let it = this.iterator;
        if (!it.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        return dart.as(it.current, E);
      }
      get last() {
        let it = this.iterator;
        if (!it.moveNext()) {
          throw _internal.IterableElementError.noElement();
        }
        let result = null;
        do {
          result = dart.as(it.current, E);
        }
        while (it.moveNext());
        return result;
      }
      firstWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        for (let element of this) {
          if (test(element)) return element;
        }
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      lastWhere(test, opt$) {
        let orElse = opt$.orElse === undefined ? null : opt$.orElse;
        let result = dart.as(null, E);
        let foundMatching = false;
        for (let element of this) {
          if (test(element)) {
            result = element;
            foundMatching = true;
          }
        }
        if (foundMatching) return result;
        if (orElse !== null) return orElse();
        throw _internal.IterableElementError.noElement();
      }
      singleWhere(test) {
        let result = dart.as(null, E);
        let foundMatching = false;
        for (let element of this) {
          if (test(element)) {
            if (foundMatching) {
              throw _internal.IterableElementError.tooMany();
            }
            result = element;
            foundMatching = true;
          }
        }
        if (foundMatching) return result;
        throw _internal.IterableElementError.noElement();
      }
      elementAt(index) {
        if (!(typeof index == "number")) throw new core.ArgumentError.notNull("index");
        core.RangeError.checkNotNegative(index, "index");
        let elementIndex = 0;
        for (let element of this) {
          if (index === elementIndex) return element;
          elementIndex++;
        }
        throw new core.RangeError.index(index, this, "index", null, elementIndex);
      }
    }
    return SetMixin;
  });
  let SetMixin = SetMixin$(dynamic);

  let SetBase$ = dart.generic(function(E) {
    class SetBase extends SetMixin$(E) {
      static setToString(set) { return IterableBase.iterableToFullString(set, '{', '}'); }
    }
    return SetBase;
  });
  let SetBase = SetBase$(dynamic);

  let _SplayTreeNode$ = dart.generic(function(K) {
    class _SplayTreeNode {
      constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
      }
    }
    return _SplayTreeNode;
  });
  let _SplayTreeNode = _SplayTreeNode$(dynamic);

  let _SplayTreeMapNode$ = dart.generic(function(K, V) {
    class _SplayTreeMapNode extends _SplayTreeNode$(K) {
      constructor(key, value) {
        this.value = value;
        super(key);
      }
    }
    return _SplayTreeMapNode;
  });
  let _SplayTreeMapNode = _SplayTreeMapNode$(dynamic, dynamic);

  let _SplayTree$ = dart.generic(function(K) {
    class _SplayTree {
      constructor() {
        this._dummy = new _SplayTreeNode(null);
        this._root = null;
        this._count = 0;
        this._modificationCount = 0;
        this._splayCount = 0;
        super();
      }
      _splay(key) {
        if (this._root === null) return -1;
        let left = this._dummy;
        let right = this._dummy;
        let current = this._root;
        let comp = null;
        while (true) {
          comp = this._compare(current.key, key);
          if (comp > 0) {
            if (current.left === null) break;
            comp = this._compare(current.left.key, key);
            if (comp > 0) {
              let tmp = current.left;
              current.left = tmp.right;
              tmp.right = current;
              current = tmp;
              if (current.left === null) break;
            }
            right.left = current;
            right = current;
            current = current.left;
          } else if (comp < 0) {
            if (current.right === null) break;
            comp = this._compare(current.right.key, key);
            if (comp < 0) {
              let tmp = current.right;
              current.right = tmp.left;
              tmp.left = current;
              current = tmp;
              if (current.right === null) break;
            }
            left.right = current;
            left = current;
            current = current.right;
          } else {
            break;
          }
        }
        left.right = current.left;
        right.left = current.right;
        current.left = this._dummy.right;
        current.right = this._dummy.left;
        this._root = current;
        this._dummy.right = null;
        this._dummy.left = null;
        this._splayCount++;
        return comp;
      }
      _splayMin(node) {
        let current = node;
        while (current.left !== null) {
          let left = current.left;
          current.left = left.right;
          left.right = current;
          current = left;
        }
        return dart.as(current, _SplayTreeNode$(K));
      }
      _splayMax(node) {
        let current = node;
        while (current.right !== null) {
          let right = current.right;
          current.right = right.left;
          right.left = current;
          current = right;
        }
        return dart.as(current, _SplayTreeNode$(K));
      }
      _remove(key) {
        if (this._root === null) return null;
        let comp = this._splay(key);
        if (comp !== 0) return null;
        let result = this._root;
        this._count--;
        if (this._root.left === null) {
          this._root = this._root.right;
        } else {
          let right = this._root.right;
          this._root = this._splayMax(this._root.left);
          this._root.right = right;
        }
        this._modificationCount++;
        return result;
      }
      _addNewRoot(node, comp) {
        this._count++;
        this._modificationCount++;
        if (this._root === null) {
          this._root = node;
          return;
        }
        if (comp < 0) {
          node.left = this._root;
          node.right = this._root.right;
          this._root.right = null;
        } else {
          node.right = this._root;
          node.left = this._root.left;
          this._root.left = null;
        }
        this._root = node;
      }
      get _first() {
        if (this._root === null) return null;
        this._root = this._splayMin(this._root);
        return this._root;
      }
      get _last() {
        if (this._root === null) return null;
        this._root = this._splayMax(this._root);
        return this._root;
      }
      _clear() {
        this._root = null;
        this._count = 0;
        this._modificationCount++;
      }
    }
    return _SplayTree;
  });
  let _SplayTree = _SplayTree$(dynamic);

  let _TypeTest$ = dart.generic(function(T) {
    class _TypeTest {
      test(v) { return dart.is(v, T); }
    }
    return _TypeTest;
  });
  let _TypeTest = _TypeTest$(dynamic);

  let SplayTreeMap$ = dart.generic(function(K, V) {
    class SplayTreeMap extends _SplayTree$(K) {
      constructor(compare, isValidKey) {
        if (compare === undefined) compare = null;
        if (isValidKey === undefined) isValidKey = null;
        this._comparator = (compare === null) ? core.Comparable.compare : compare;
        this._validKey = (isValidKey !== null) ? isValidKey : ((v) => dart.is(v, K));
        super();
      }
      /*constructor*/ from(other, compare, isValidKey) {
        if (compare === undefined) compare = null;
        if (isValidKey === undefined) isValidKey = null;
        let result = new SplayTreeMap();
        other.forEach((k, v) => {
          result.set(k, dart.as(v, V));
        });
        return result;
      }
      /*constructor*/ fromIterable(iterable, opt$) {
        let key = opt$.key === undefined ? null : opt$.key;
        let value = opt$.value === undefined ? null : opt$.value;
        let compare = opt$.compare === undefined ? null : opt$.compare;
        let isValidKey = opt$.isValidKey === undefined ? null : opt$.isValidKey;
        let map = new SplayTreeMap(compare, isValidKey);
        Maps._fillMapWithMappedIterable(map, iterable, key, value);
        return map;
      }
      /*constructor*/ fromIterables(keys, values, compare, isValidKey) {
        if (compare === undefined) compare = null;
        if (isValidKey === undefined) isValidKey = null;
        let map = new SplayTreeMap(compare, isValidKey);
        Maps._fillMapWithIterables(map, keys, values);
        return map;
      }
      _compare(key1, key2) { return this._comparator(key1, key2); }
      /*constructor*/ _internal() {
        this._comparator = null;
        this._validKey = null;
        _SplayTree$(K).call(this);
      }
      get(key) {
        if (key === null) throw new core.ArgumentError(key);
        if (!this._validKey(key)) return dart.as(null, V);
        if (this._root !== null) {
          let comp = this._splay(dart.as(key, K));
          if (comp === 0) {
            let mapRoot = dart.as(this._root, _SplayTreeMapNode);
            return dart.as(mapRoot.value, V);
          }
        }
        return dart.as(null, V);
      }
      remove(key) {
        if (!this._validKey(key)) return dart.as(null, V);
        let mapRoot = dart.as(this._remove(dart.as(key, K)), _SplayTreeMapNode);
        if (mapRoot !== null) return dart.as(mapRoot.value, V);
        return dart.as(null, V);
      }
      set(key, value) {
        if (key === null) throw new core.ArgumentError(key);
        let comp = this._splay(key);
        if (comp === 0) {
          let mapRoot = dart.as(this._root, _SplayTreeMapNode);
          mapRoot.value = value;
          return;
        }
        this._addNewRoot(dart.as(new _SplayTreeMapNode(key, value), _SplayTreeNode$(K)), comp);
      }
      putIfAbsent(key, ifAbsent) {
        if (key === null) throw new core.ArgumentError(key);
        let comp = this._splay(key);
        if (comp === 0) {
          let mapRoot = dart.as(this._root, _SplayTreeMapNode);
          return dart.as(mapRoot.value, V);
        }
        let modificationCount = this._modificationCount;
        let splayCount = this._splayCount;
        let value = ifAbsent();
        if (modificationCount !== this._modificationCount) {
          throw new core.ConcurrentModificationError(this);
        }
        if (splayCount !== this._splayCount) {
          comp = this._splay(key);
          dart.assert(comp !== 0);
        }
        this._addNewRoot(dart.as(new _SplayTreeMapNode(key, value), _SplayTreeNode$(K)), comp);
        return value;
      }
      addAll(other) {
        other.forEach(((key, value) => {
          this.set(key, value);
        }).bind(this));
      }
      get isEmpty() {
        return (this._root === null);
      }
      get isNotEmpty() { return !this.isEmpty; }
      forEach(f) {
        let nodes = new _SplayTreeNodeIterator(this);
        while (nodes.moveNext()) {
          let node = dart.as(nodes.current, _SplayTreeMapNode$(K, V));
          f(node.key, node.value);
        }
      }
      get length() {
        return this._count;
      }
      clear() {
        this._clear();
      }
      containsKey(key) {
        return this._validKey(key) && this._splay(dart.as(key, K)) === 0;
      }
      containsValue(value) {
        let found = false;
        let initialSplayCount = this._splayCount;
        // Function visit: (_SplayTreeMapNode<dynamic, dynamic>) → bool
        function visit(node) {
          while (node !== null) {
            if (dart.equals(node.value, value)) return true;
            if (initialSplayCount !== this._splayCount) {
              throw new core.ConcurrentModificationError(this);
            }
            if (node.right !== null && visit(dart.as(node.right, _SplayTreeMapNode))) return true;
            node = dart.as(node.left, _SplayTreeMapNode);
          }
          return false;
        }
        return visit(dart.as(this._root, _SplayTreeMapNode));
      }
      get keys() { return new _SplayTreeKeyIterable(this); }
      get values() { return new _SplayTreeValueIterable(this); }
      toString() {
        return Maps.mapToString(this);
      }
      firstKey() {
        if (this._root === null) return dart.as(null, K);
        return dart.as(this._first.key, K);
      }
      lastKey() {
        if (this._root === null) return dart.as(null, K);
        return dart.as(this._last.key, K);
      }
      lastKeyBefore(key) {
        if (key === null) throw new core.ArgumentError(key);
        if (this._root === null) return dart.as(null, K);
        let comp = this._splay(key);
        if (comp < 0) return this._root.key;
        let node = this._root.left;
        if (node === null) return dart.as(null, K);
        while (node.right !== null) {
          node = node.right;
        }
        return node.key;
      }
      firstKeyAfter(key) {
        if (key === null) throw new core.ArgumentError(key);
        if (this._root === null) return dart.as(null, K);
        let comp = this._splay(key);
        if (comp > 0) return this._root.key;
        let node = this._root.right;
        if (node === null) return dart.as(null, K);
        while (node.left !== null) {
          node = node.left;
        }
        return node.key;
      }
    }
    dart.defineNamedConstructor(SplayTreeMap, "from");
    dart.defineNamedConstructor(SplayTreeMap, "fromIterable");
    dart.defineNamedConstructor(SplayTreeMap, "fromIterables");
    dart.defineNamedConstructor(SplayTreeMap, "_internal");
    return SplayTreeMap;
  });
  let SplayTreeMap = SplayTreeMap$(dynamic, dynamic);

  let _SplayTreeIterator$ = dart.generic(function(T) {
    class _SplayTreeIterator {
      constructor(tree) {
        this._workList = new List.from([]);
        this._tree = tree;
        this._modificationCount = tree._modificationCount;
        this._splayCount = tree._splayCount;
        this._currentNode = null;
        this._findLeftMostDescendent(tree._root);
      }
      /*constructor*/ startAt(tree, startKey) {
        this._workList = new List.from([]);
        this._tree = tree;
        this._modificationCount = tree._modificationCount;
        this._splayCount = dart.as(null, core.int);
        this._currentNode = null;
        if (tree._root === null) return;
        let compare = tree._splay(startKey);
        this._splayCount = tree._splayCount;
        if (compare < 0) {
          this._findLeftMostDescendent(tree._root.right);
        } else {
          this._workList.add(tree._root);
        }
      }
      get current() {
        if (this._currentNode === null) return dart.as(null, T);
        return this._getValue(this._currentNode);
      }
      _findLeftMostDescendent(node) {
        while (node !== null) {
          this._workList.add(node);
          node = node.left;
        }
      }
      _rebuildWorkList(currentNode) {
        dart.assert(!this._workList.isEmpty);
        this._workList.clear();
        if (currentNode === null) {
          this._findLeftMostDescendent(this._tree._root);
        } else {
          this._tree._splay(currentNode.key);
          this._findLeftMostDescendent(this._tree._root.right);
          dart.assert(!this._workList.isEmpty);
        }
      }
      moveNext() {
        if (this._modificationCount !== this._tree._modificationCount) {
          throw new core.ConcurrentModificationError(this._tree);
        }
        if (this._workList.isEmpty) {
          this._currentNode = null;
          return false;
        }
        if (this._tree._splayCount !== this._splayCount && this._currentNode !== null) {
          this._rebuildWorkList(this._currentNode);
        }
        this._currentNode = this._workList.removeLast();
        this._findLeftMostDescendent(this._currentNode.right);
        return true;
      }
    }
    dart.defineNamedConstructor(_SplayTreeIterator, "startAt");
    return _SplayTreeIterator;
  });
  let _SplayTreeIterator = _SplayTreeIterator$(dynamic);

  let _SplayTreeKeyIterable$ = dart.generic(function(K) {
    class _SplayTreeKeyIterable extends IterableBase$(K) {
      constructor(_tree) {
        this._tree = _tree;
        super();
      }
      get length() { return this._tree._count; }
      get isEmpty() { return this._tree._count === 0; }
      get iterator() { return new _SplayTreeKeyIterator(this._tree); }
      toSet() {
        let setOrMap = this._tree;
        let set = new SplayTreeSet(setOrMap._comparator, setOrMap._validKey);
        set._count = this._tree._count;
        set._root = set._copyNode(this._tree._root);
        return set;
      }
    }
    return _SplayTreeKeyIterable;
  });
  let _SplayTreeKeyIterable = _SplayTreeKeyIterable$(dynamic);

  let _SplayTreeValueIterable$ = dart.generic(function(K, V) {
    class _SplayTreeValueIterable extends IterableBase$(V) {
      constructor(_map) {
        this._map = _map;
        super();
      }
      get length() { return this._map._count; }
      get isEmpty() { return this._map._count === 0; }
      get iterator() { return new _SplayTreeValueIterator(this._map); }
    }
    return _SplayTreeValueIterable;
  });
  let _SplayTreeValueIterable = _SplayTreeValueIterable$(dynamic, dynamic);

  let _SplayTreeKeyIterator$ = dart.generic(function(K) {
    class _SplayTreeKeyIterator extends _SplayTreeIterator$(K) {
      constructor(map) {
        super(map);
      }
      _getValue(node) { return dart.as(node.key, K); }
    }
    return _SplayTreeKeyIterator;
  });
  let _SplayTreeKeyIterator = _SplayTreeKeyIterator$(dynamic);

  let _SplayTreeValueIterator$ = dart.generic(function(K, V) {
    class _SplayTreeValueIterator extends _SplayTreeIterator$(V) {
      constructor(map) {
        super(map);
      }
      _getValue(node) { return dart.as(node.value, V); }
    }
    return _SplayTreeValueIterator;
  });
  let _SplayTreeValueIterator = _SplayTreeValueIterator$(dynamic, dynamic);

  let _SplayTreeNodeIterator$ = dart.generic(function(K) {
    class _SplayTreeNodeIterator extends _SplayTreeIterator$(_SplayTreeNode$(K)) {
      constructor(tree) {
        super(tree);
      }
      /*constructor*/ startAt(tree, startKey) {
        super.startAt(tree, startKey);
      }
      _getValue(node) { return dart.as(node, _SplayTreeNode$(K)); }
    }
    dart.defineNamedConstructor(_SplayTreeNodeIterator, "startAt");
    return _SplayTreeNodeIterator;
  });
  let _SplayTreeNodeIterator = _SplayTreeNodeIterator$(dynamic);

  let SplayTreeSet$ = dart.generic(function(E) {
    class SplayTreeSet extends dart.mixin(_SplayTree$(E), IterableMixin$(E), SetMixin$(E)) {
      constructor(compare, isValidKey) {
        if (compare === undefined) compare = null;
        if (isValidKey === undefined) isValidKey = null;
        this._comparator = (compare === null) ? core.Comparable.compare : compare;
        this._validKey = (isValidKey !== null) ? isValidKey : ((v) => dart.is(v, E));
        super();
      }
      /*constructor*/ from(elements, compare, isValidKey) {
        if (compare === undefined) compare = null;
        if (isValidKey === undefined) isValidKey = null;
        let result = new SplayTreeSet(compare, isValidKey);
        for (let element of elements) {
          result.add(element);
        }
        return result;
      }
      _compare(e1, e2) { return this._comparator(e1, e2); }
      get iterator() { return new _SplayTreeKeyIterator(this); }
      get length() { return this._count; }
      get isEmpty() { return this._root === null; }
      get isNotEmpty() { return this._root !== null; }
      get first() {
        if (this._count === 0) throw _internal.IterableElementError.noElement();
        return dart.as(this._first.key, E);
      }
      get last() {
        if (this._count === 0) throw _internal.IterableElementError.noElement();
        return dart.as(this._last.key, E);
      }
      get single() {
        if (this._count === 0) throw _internal.IterableElementError.noElement();
        if (this._count > 1) throw _internal.IterableElementError.tooMany();
        return this._root.key;
      }
      contains(object) {
        return this._validKey(object) && this._splay(dart.as(object, E)) === 0;
      }
      add(element) {
        let compare = this._splay(element);
        if (compare === 0) return false;
        this._addNewRoot(dart.as(new _SplayTreeNode(element), _SplayTreeNode$(E)), compare);
        return true;
      }
      remove(object) {
        if (!this._validKey(object)) return false;
        return this._remove(dart.as(object, E)) !== null;
      }
      addAll(elements) {
        for (let element of elements) {
          let compare = this._splay(element);
          if (compare !== 0) {
            this._addNewRoot(dart.as(new _SplayTreeNode(element), _SplayTreeNode$(E)), compare);
          }
        }
      }
      removeAll(elements) {
        for (let element of elements) {
          if (this._validKey(element)) this._remove(dart.as(element, E));
        }
      }
      retainAll(elements) {
        let retainSet = new SplayTreeSet(this._comparator, this._validKey);
        let modificationCount = this._modificationCount;
        for (let object of elements) {
          if (modificationCount !== this._modificationCount) {
            throw new core.ConcurrentModificationError(this);
          }
          if (this._validKey(object) && this._splay(dart.as(object, E)) === 0) retainSet.add(this._root.key);
        }
        if (retainSet._count !== this._count) {
          this._root = retainSet._root;
          this._count = retainSet._count;
          this._modificationCount++;
        }
      }
      lookup(object) {
        if (!this._validKey(object)) return dart.as(null, E);
        let comp = this._splay(dart.as(object, E));
        if (comp !== 0) return dart.as(null, E);
        return this._root.key;
      }
      intersection(other) {
        let result = new SplayTreeSet(this._comparator, this._validKey);
        for (let element of this) {
          if (other.contains(element)) result.add(element);
        }
        return result;
      }
      difference(other) {
        let result = new SplayTreeSet(this._comparator, this._validKey);
        for (let element of this) {
          if (!other.contains(element)) result.add(element);
        }
        return result;
      }
      union(other) {
        return ((_) => {
          _.addAll(other);
          return _;
        }).bind(this)(this._clone());
      }
      _clone() {
        let set = new SplayTreeSet(this._comparator, this._validKey);
        set._count = this._count;
        set._root = this._copyNode(this._root);
        return set;
      }
      _copyNode(node) {
        if (node === null) return null;
        return ((_) => {
          _.left = this._copyNode(node.left);
          _.right = this._copyNode(node.right);
          return _;
        }).bind(this)(new _SplayTreeNode(node.key));
      }
      clear() {
        this._clear();
      }
      toSet() { return this._clone(); }
      toString() { return IterableBase.iterableToFullString(this, '{', '}'); }
    }
    dart.defineNamedConstructor(SplayTreeSet, "from");
    return SplayTreeSet;
  });
  let SplayTreeSet = SplayTreeSet$(dynamic);

  // Exports:
  collection.LinkedHashSetIterator = LinkedHashSetIterator;
  collection.LinkedHashSetIterator$ = LinkedHashSetIterator$;
  collection.LinkedHashSetCell = LinkedHashSetCell;
  collection.HashSetIterator = HashSetIterator;
  collection.HashSetIterator$ = HashSetIterator$;
  collection.LinkedHashMapKeyIterator = LinkedHashMapKeyIterator;
  collection.LinkedHashMapKeyIterator$ = LinkedHashMapKeyIterator$;
  collection.LinkedHashMapKeyIterable = LinkedHashMapKeyIterable;
  collection.LinkedHashMapKeyIterable$ = LinkedHashMapKeyIterable$;
  collection.LinkedHashMapCell = LinkedHashMapCell;
  collection.HashMapKeyIterator = HashMapKeyIterator;
  collection.HashMapKeyIterator$ = HashMapKeyIterator$;
  collection.HashMapKeyIterable = HashMapKeyIterable;
  collection.HashMapKeyIterable$ = HashMapKeyIterable$;
  collection.UnmodifiableListView = UnmodifiableListView;
  collection.UnmodifiableListView$ = UnmodifiableListView$;
  collection.HashMap = HashMap;
  collection.HashMap$ = HashMap$;
  collection.HashSet = HashSet;
  collection.HashSet$ = HashSet$;
  collection.IterableMixin = IterableMixin;
  collection.IterableMixin$ = IterableMixin$;
  collection.IterableBase = IterableBase;
  collection.IterableBase$ = IterableBase$;
  collection.HasNextIterator = HasNextIterator;
  collection.HasNextIterator$ = HasNextIterator$;
  collection.LinkedHashMap = LinkedHashMap;
  collection.LinkedHashMap$ = LinkedHashMap$;
  collection.LinkedHashSet = LinkedHashSet;
  collection.LinkedHashSet$ = LinkedHashSet$;
  collection.LinkedList = LinkedList;
  collection.LinkedList$ = LinkedList$;
  collection.LinkedListEntry = LinkedListEntry;
  collection.LinkedListEntry$ = LinkedListEntry$;
  collection.ListBase = ListBase;
  collection.ListBase$ = ListBase$;
  collection.ListMixin = ListMixin;
  collection.ListMixin$ = ListMixin$;
  collection.MapBase$ = MapBase$;
  collection.MapBase = MapBase;
  collection.MapMixin = MapMixin;
  collection.MapMixin$ = MapMixin$;
  collection.UnmodifiableMapBase$ = UnmodifiableMapBase$;
  collection.UnmodifiableMapBase = UnmodifiableMapBase;
  collection.MapView = MapView;
  collection.MapView$ = MapView$;
  collection.UnmodifiableMapView$ = UnmodifiableMapView$;
  collection.UnmodifiableMapView = UnmodifiableMapView;
  collection.Maps = Maps;
  collection.Queue = Queue;
  collection.Queue$ = Queue$;
  collection.DoubleLinkedQueueEntry = DoubleLinkedQueueEntry;
  collection.DoubleLinkedQueueEntry$ = DoubleLinkedQueueEntry$;
  collection.DoubleLinkedQueue = DoubleLinkedQueue;
  collection.DoubleLinkedQueue$ = DoubleLinkedQueue$;
  collection.ListQueue = ListQueue;
  collection.ListQueue$ = ListQueue$;
  collection.SetMixin = SetMixin;
  collection.SetMixin$ = SetMixin$;
  collection.SetBase = SetBase;
  collection.SetBase$ = SetBase$;
  collection.SplayTreeMap = SplayTreeMap;
  collection.SplayTreeMap$ = SplayTreeMap$;
  collection.SplayTreeSet = SplayTreeSet;
  collection.SplayTreeSet$ = SplayTreeSet$;
})(collection || (collection = {}));
