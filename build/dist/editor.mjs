var eu = Object.defineProperty;
var Po = (n) => {
  throw TypeError(n);
};
var tu = (n, e, t) => e in n ? eu(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var bn = (n, e, t) => tu(n, typeof e != "symbol" ? e + "" : e, t), $o = (n, e, t) => e.has(n) || Po("Cannot " + t);
var fe = (n, e, t) => ($o(n, e, "read from private field"), t ? t.call(n) : e.get(n)), rr = (n, e, t) => e.has(n) ? Po("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), sr = (n, e, t, r) => ($o(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t);
function q(n) {
  this.content = n;
}
q.prototype = {
  constructor: q,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, s = r.find(n), i = r.content.slice();
    return s == -1 ? i.push(t || n, e) : (i[s + 1] = e, t && (i[s] = t)), new q(i);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new q(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new q([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new q(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), s = r.content.slice(), i = r.find(n);
    return s.splice(i == -1 ? s.length : i, 0, e, t), new q(s);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = q.from(n), n.size ? new q(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = q.from(n), n.size ? new q(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = q.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
q.from = function(n) {
  if (n instanceof q) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new q(e);
};
function Da(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let s = n.child(r), i = e.child(r);
    if (s == i) {
      t += s.nodeSize;
      continue;
    }
    if (!s.sameMarkup(i))
      return t;
    if (s.isText && s.text != i.text) {
      for (let o = 0; s.text[o] == i.text[o]; o++)
        t++;
      return t;
    }
    if (s.content.size || i.content.size) {
      let o = Da(s.content, i.content, t + 1);
      if (o != null)
        return o;
    }
    t += s.nodeSize;
  }
}
function Ia(n, e, t, r) {
  for (let s = n.childCount, i = e.childCount; ; ) {
    if (s == 0 || i == 0)
      return s == i ? null : { a: t, b: r };
    let o = n.child(--s), l = e.child(--i), a = o.nodeSize;
    if (o == l) {
      t -= a, r -= a;
      continue;
    }
    if (!o.sameMarkup(l))
      return { a: t, b: r };
    if (o.isText && o.text != l.text) {
      let c = 0, d = Math.min(o.text.length, l.text.length);
      for (; c < d && o.text[o.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (o.content.size || l.content.size) {
      let c = Ia(o.content, l.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= a, r -= a;
  }
}
class b {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, s = 0, i) {
    for (let o = 0, l = 0; l < t; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, s + l, i || null, o) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, t - d), r, s + d);
      }
      l = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, s) {
    let i = "", o = !0;
    return this.nodesBetween(e, t, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, t - a) : l.isLeaf ? s ? typeof s == "function" ? s(l) : s : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && r && (o ? o = !1 : i += r), i += c;
    }, 0), i;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, s = this.content.slice(), i = 0;
    for (t.isText && t.sameMarkup(r) && (s[s.length - 1] = t.withText(t.text + r.text), i = 1); i < e.content.length; i++)
      s.push(e.content[i]);
    return new b(s, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], s = 0;
    if (t > e)
      for (let i = 0, o = 0; o < t; i++) {
        let l = this.content[i], a = o + l.nodeSize;
        a > e && ((o < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, t - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, t - o - 1))), r.push(l), s += l.nodeSize), o = a;
      }
    return new b(r, s);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? b.empty : e == 0 && t == this.content.length ? this : new b(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let s = this.content.slice(), i = this.size + t.nodeSize - r.nodeSize;
    return s[e] = t, new b(s, i);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new b([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new b(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let s = this.content[t];
      e(s, r, t), r += s.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return Da(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Ia(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e, t = -1) {
    if (e == 0)
      return ir(0, e);
    if (e == this.size)
      return ir(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, s = 0; ; r++) {
      let i = this.child(r), o = s + i.nodeSize;
      if (o >= e)
        return o == e || t > 0 ? ir(r + 1, o) : ir(r, s);
      s = o;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return b.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new b(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return b.empty;
    let t, r = 0;
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      r += i.nodeSize, s && i.isText && e[s - 1].sameMarkup(i) ? (t || (t = e.slice(0, s)), t[t.length - 1] = i.withText(t[t.length - 1].text + i.text)) : t && t.push(i);
    }
    return new b(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return b.empty;
    if (e instanceof b)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new b([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
b.empty = new b([], 0);
const _s = { index: 0, offset: 0 };
function ir(n, e) {
  return _s.index = n, _s.offset = e, _s;
}
function vr(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!vr(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !vr(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let L = class ki {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (this.eq(i))
        return e;
      if (this.type.excludes(i.type))
        t || (t = e.slice(0, s));
      else {
        if (i.type.excludes(this.type))
          return e;
        !r && i.type.rank > this.type.rank && (t || (t = e.slice(0, s)), t.push(this), r = !0), t && t.push(i);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && vr(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return r.create(t.attrs);
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return ki.none;
    if (e instanceof ki)
      return [e];
    let t = e.slice();
    return t.sort((r, s) => r.type.rank - s.type.rank), t;
  }
};
L.none = [];
class Or extends Error {
}
class x {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = Pa(this.content, e + this.openStart, t);
    return r && new x(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new x(La(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return x.empty;
    let r = t.openStart || 0, s = t.openEnd || 0;
    if (typeof r != "number" || typeof s != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new x(b.fromJSON(e, t.content), r, s);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, s = 0;
    for (let i = e.firstChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.firstChild)
      r++;
    for (let i = e.lastChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.lastChild)
      s++;
    return new x(e, r, s);
  }
}
x.empty = new x(b.empty, 0, 0);
function La(n, e, t) {
  let { index: r, offset: s } = n.findIndex(e), i = n.maybeChild(r), { index: o, offset: l } = n.findIndex(t);
  if (s == e || i.isText) {
    if (l != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, i.copy(La(i.content, e - s - 1, t - s - 1)));
}
function Pa(n, e, t, r) {
  let { index: s, offset: i } = n.findIndex(e), o = n.maybeChild(s);
  if (i == e || o.isText)
    return n.cut(0, e).append(t).append(n.cut(e));
  let l = Pa(o.content, e - i - 1, t);
  return l && n.replaceChild(s, o.copy(l));
}
function nu(n, e, t) {
  if (t.openStart > n.depth)
    throw new Or("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Or("Inconsistent open depths");
  return $a(n, e, t, 0);
}
function $a(n, e, t, r) {
  let s = n.index(r), i = n.node(r);
  if (s == e.index(r) && r < n.depth - t.openStart) {
    let o = $a(n, e, t, r + 1);
    return i.copy(i.content.replaceChild(s, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, l = o.content;
      return vt(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = ru(t, n);
      return vt(i, za(n, o, l, e, r));
    }
  else return vt(i, Nr(n, e, r));
}
function Ba(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Or("Cannot join " + e.type.name + " onto " + n.type.name);
}
function wi(n, e, t) {
  let r = n.node(t);
  return Ba(r, e.node(t)), r;
}
function Et(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Mn(n, e, t, r) {
  let s = (e || n).node(t), i = 0, o = e ? e.index(t) : s.childCount;
  n && (i = n.index(t), n.depth > t ? i++ : n.textOffset && (Et(n.nodeAfter, r), i++));
  for (let l = i; l < o; l++)
    Et(s.child(l), r);
  e && e.depth == t && e.textOffset && Et(e.nodeBefore, r);
}
function vt(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function za(n, e, t, r, s) {
  let i = n.depth > s && wi(n, e, s + 1), o = r.depth > s && wi(t, r, s + 1), l = [];
  return Mn(null, n, s, l), i && o && e.index(s) == t.index(s) ? (Ba(i, o), Et(vt(i, za(n, e, t, r, s + 1)), l)) : (i && Et(vt(i, Nr(n, e, s + 1)), l), Mn(e, t, s, l), o && Et(vt(o, Nr(t, r, s + 1)), l)), Mn(r, null, s, l), new b(l);
}
function Nr(n, e, t) {
  let r = [];
  if (Mn(null, n, t, r), n.depth > t) {
    let s = wi(n, e, t + 1);
    Et(vt(s, Nr(n, e, t + 1)), r);
  }
  return Mn(e, null, t, r), new b(r);
}
function ru(n, e) {
  let t = e.depth - n.openStart, s = e.node(t).copy(n.content);
  for (let i = t - 1; i >= 0; i--)
    s = e.node(i).copy(b.from(s));
  return {
    start: s.resolveNoCache(n.openStart + t),
    end: s.resolveNoCache(s.content.size - n.openEnd - t)
  };
}
class Ln {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], s = e.child(t);
    return r ? e.child(t).cut(r) : s;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], s = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let i = 0; i < e; i++)
      s += r.child(i).nodeSize;
    return s;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return L.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), s = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = s, s = l;
    }
    let i = r.marks;
    for (var o = 0; o < i.length; o++)
      i[o].type.spec.inclusive === !1 && (!s || !i[o].isInSet(s.marks)) && (i = i[o--].removeFromSet(i));
    return i;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, s = e.parent.maybeChild(e.index());
    for (var i = 0; i < r.length; i++)
      r[i].type.spec.inclusive === !1 && (!s || !r[i].isInSet(s.marks)) && (r = r[i--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new Rr(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], s = 0, i = t;
    for (let o = e; ; ) {
      let { index: l, offset: a } = o.content.findIndex(i), c = i - a;
      if (r.push(o, l, s + a), !c || (o = o.child(l), o.isText))
        break;
      i = c - 1, s += a + 1;
    }
    return new Ln(t, r, i);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Bo.get(e);
    if (r)
      for (let i = 0; i < r.elts.length; i++) {
        let o = r.elts[i];
        if (o.pos == t)
          return o;
      }
    else
      Bo.set(e, r = new su());
    let s = r.elts[r.i] = Ln.resolve(e, t);
    return r.i = (r.i + 1) % iu, s;
  }
}
class su {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const iu = 12, Bo = /* @__PURE__ */ new WeakMap();
class Rr {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const ou = /* @__PURE__ */ Object.create(null);
let Ot = class xi {
  /**
  @internal
  */
  constructor(e, t, r, s = L.none) {
    this.type = e, this.attrs = t, this.marks = s, this.content = r || b.empty;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, s = 0) {
    this.content.nodesBetween(e, t, r, s, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec^leafText) will be used.
  */
  textBetween(e, t, r, s) {
    return this.content.textBetween(e, t, r, s);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && vr(this.attrs, t || e.defaultAttrs || ou) && L.sameSet(this.marks, r || L.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new xi(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new xi(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return x.empty;
    let s = this.resolve(e), i = this.resolve(t), o = r ? 0 : s.sharedDepth(t), l = s.start(o), c = s.node(o).content.cut(s.pos - l, i.pos - l);
    return new x(c, s.depth - o, i.depth - o);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return nu(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: s } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (s == e || t.isText)
        return t;
      e -= s + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let s = this.content.child(t - 1);
    return { node: s, index: t - 1, offset: r - s.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return Ln.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Ln.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let s = !1;
    return t > e && this.nodesBetween(e, t, (i) => (r.isInSet(i.marks) && (s = !0), !s)), s;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ha(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = b.empty, s = 0, i = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, s, i), l = o && o.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = s; a < i; a++)
      if (!this.type.allowsMarks(r.child(a).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, s) {
    if (s && !this.type.allowsMarks(s))
      return !1;
    let i = this.contentMatchAt(e).matchType(r), o = i && i.matchFragment(this.content, t);
    return o ? o.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise error when they do not.
  */
  check() {
    this.type.checkContent(this.content);
    let e = L.none;
    for (let t = 0; t < this.marks.length; t++)
      e = this.marks[t].addToSet(e);
    if (!L.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let s = b.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, s, r);
  }
};
Ot.prototype.text = void 0;
class Dr extends Ot {
  /**
  @internal
  */
  constructor(e, t, r, s) {
    if (super(e, t, null, s), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ha(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new Dr(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Dr(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function Ha(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class It {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new lu(e, t);
    if (r.next == null)
      return It.empty;
    let s = Fa(r);
    r.next && r.err("Unexpected trailing text");
    let i = pu(fu(s));
    return mu(i, r), i;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let s = this;
    for (let i = t; s && i < r; i++)
      s = s.matchType(e.child(i).type);
    return s;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let s = [this];
    function i(o, l) {
      let a = o.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return b.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: d, next: u } = o.next[c];
        if (!(d.isText || d.hasRequiredAttrs()) && s.indexOf(u) == -1) {
          s.push(u);
          let h = i(u, l.concat(d));
          if (h)
            return h;
        }
      }
      return null;
    }
    return i(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let s = r.shift(), i = s.match;
      if (i.matchType(e)) {
        let o = [];
        for (let l = s; l.type; l = l.via)
          o.push(l.type);
        return o.reverse();
      }
      for (let o = 0; o < i.next.length; o++) {
        let { type: l, next: a } = i.next[o];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!s.type || a.validEnd) && (r.push({ match: l.contentMatch, type: l, via: s }), t[l.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let s = 0; s < r.next.length; s++)
        e.indexOf(r.next[s].next) == -1 && t(r.next[s].next);
    }
    return t(this), e.map((r, s) => {
      let i = s + (r.validEnd ? "*" : " ") + " ";
      for (let o = 0; o < r.next.length; o++)
        i += (o ? ", " : "") + r.next[o].type.name + "->" + e.indexOf(r.next[o].next);
      return i;
    }).join(`
`);
  }
}
It.empty = new It(!0);
class lu {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function Fa(n) {
  let e = [];
  do
    e.push(au(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function au(n) {
  let e = [];
  do
    e.push(cu(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function cu(n) {
  let e = hu(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = du(n, e);
    else
      break;
  return e;
}
function zo(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function du(n, e) {
  let t = zo(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = zo(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function uu(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let s = [];
  for (let i in t) {
    let o = t[i];
    o.groups.indexOf(e) > -1 && s.push(o);
  }
  return s.length == 0 && n.err("No node type or group '" + e + "' found"), s;
}
function hu(n) {
  if (n.eat("(")) {
    let e = Fa(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = uu(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function fu(n) {
  let e = [[]];
  return s(i(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(o, l, a) {
    let c = { term: a, to: l };
    return e[o].push(c), c;
  }
  function s(o, l) {
    o.forEach((a) => a.to = l);
  }
  function i(o, l) {
    if (o.type == "choice")
      return o.exprs.reduce((a, c) => a.concat(i(c, l)), []);
    if (o.type == "seq")
      for (let a = 0; ; a++) {
        let c = i(o.exprs[a], l);
        if (a == o.exprs.length - 1)
          return c;
        s(c, l = t());
      }
    else if (o.type == "star") {
      let a = t();
      return r(l, a), s(i(o.expr, a), a), [r(a)];
    } else if (o.type == "plus") {
      let a = t();
      return s(i(o.expr, l), a), s(i(o.expr, a), a), [r(a)];
    } else {
      if (o.type == "opt")
        return [r(l)].concat(i(o.expr, l));
      if (o.type == "range") {
        let a = l;
        for (let c = 0; c < o.min; c++) {
          let d = t();
          s(i(o.expr, a), d), a = d;
        }
        if (o.max == -1)
          s(i(o.expr, a), a);
        else
          for (let c = o.min; c < o.max; c++) {
            let d = t();
            r(a, d), s(i(o.expr, a), d), a = d;
          }
        return [r(a)];
      } else {
        if (o.type == "name")
          return [r(l, void 0, o.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function Va(n, e) {
  return e - n;
}
function Ho(n, e) {
  let t = [];
  return r(e), t.sort(Va);
  function r(s) {
    let i = n[s];
    if (i.length == 1 && !i[0].term)
      return r(i[0].to);
    t.push(s);
    for (let o = 0; o < i.length; o++) {
      let { term: l, to: a } = i[o];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function pu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Ho(n, 0));
  function t(r) {
    let s = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let d = 0; d < s.length; d++)
          s[d][0] == l && (c = s[d][1]);
        Ho(n, a).forEach((d) => {
          c || s.push([l, c = []]), c.indexOf(d) == -1 && c.push(d);
        });
      });
    });
    let i = e[r.join(",")] = new It(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < s.length; o++) {
      let l = s[o][1].sort(Va);
      i.next.push({ type: s[o][0], next: e[l.join(",")] || t(l) });
    }
    return i;
  }
}
function mu(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let s = r[t], i = !s.validEnd, o = [];
    for (let l = 0; l < s.next.length; l++) {
      let { type: a, next: c } = s.next[l];
      o.push(a.name), i && !(a.isText || a.hasRequiredAttrs()) && (i = !1), r.indexOf(c) == -1 && r.push(c);
    }
    i && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function _a(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Wa(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let s = e && e[r];
    if (s === void 0) {
      let i = n[r];
      if (i.hasDefault)
        s = i.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = s;
  }
  return t;
}
function ja(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new gu(n[t]);
  return e;
}
let Fo = class Ua {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = ja(r.attrs), this.defaultAttrs = _a(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == It.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : Wa(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new Ot(this, this.computeAttrs(e), b.from(t), L.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = b.from(t), this.checkContent(t), new Ot(this, this.computeAttrs(e), t, L.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = b.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let s = this.contentMatch.matchFragment(t), i = s && s.fillBefore(b.empty, !0);
    return i ? new Ot(this, e, t.append(i), L.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : L.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((i, o) => r[i] = new Ua(i, t, o));
    let s = t.spec.topNode || "doc";
    if (!r[s])
      throw new RangeError("Schema is missing its top node type ('" + s + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let i in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
class gu {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class xs {
  /**
  @internal
  */
  constructor(e, t, r, s) {
    this.name = e, this.rank = t, this.schema = r, this.spec = s, this.attrs = ja(s.attrs), this.excluded = null;
    let i = _a(this.attrs);
    this.instance = i ? new L(this, i) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new L(this, Wa(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), s = 0;
    return e.forEach((i, o) => r[i] = new xs(i, s++, t, o)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class yu {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let s in e)
      t[s] = e[s];
    t.nodes = q.from(e.nodes), t.marks = q.from(e.marks || {}), this.nodes = Fo.compile(this.spec.nodes, this), this.marks = xs.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in this.nodes) {
      if (s in this.marks)
        throw new RangeError(s + " can not be both a node and a mark");
      let i = this.nodes[s], o = i.spec.content || "", l = i.spec.marks;
      if (i.contentMatch = r[o] || (r[o] = It.parse(o, this.nodes)), i.inlineContent = i.contentMatch.inlineContent, i.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!i.isInline || !i.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = i;
      }
      i.markSet = l == "_" ? null : l ? Vo(this, l.split(" ")) : l == "" || !i.inlineContent ? [] : null;
    }
    for (let s in this.marks) {
      let i = this.marks[s], o = i.spec.excludes;
      i.excluded = o == null ? [i] : o == "" ? [] : Vo(this, o.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, s) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Fo) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, s);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new Dr(r, r.defaultAttrs, e, L.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  Deserialize a node from its JSON representation. This method is
  bound.
  */
  nodeFromJSON(e) {
    return Ot.fromJSON(this, e);
  }
  /**
  Deserialize a mark from its JSON representation. This method is
  bound.
  */
  markFromJSON(e) {
    return L.fromJSON(this, e);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Vo(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let s = e[r], i = n.marks[s], o = i;
    if (i)
      t.push(i);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (s == "_" || a.spec.group && a.spec.group.split(" ").indexOf(s) > -1) && t.push(o = a);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function bu(n) {
  return n.tag != null;
}
function ku(n) {
  return n.style != null;
}
class nn {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((s) => {
      if (bu(s))
        this.tags.push(s);
      else if (ku(s)) {
        let i = /[^=]*/.exec(s.style)[0];
        r.indexOf(i) < 0 && r.push(i), this.styles.push(s);
      }
    }), this.normalizeLists = !this.tags.some((s) => {
      if (!/^(ul|ol)\b/.test(s.tag) || !s.node)
        return !1;
      let i = e.nodes[s.node];
      return i.contentMatch.matchType(i);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Wo(this, t, !1);
    return r.addAll(e, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Wo(this, t, !0);
    return r.addAll(e, t.from, t.to), x.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let s = r ? this.tags.indexOf(r) + 1 : 0; s < this.tags.length; s++) {
      let i = this.tags[s];
      if (Su(e, i.tag) && (i.namespace === void 0 || e.namespaceURI == i.namespace) && (!i.context || t.matchesContext(i.context))) {
        if (i.getAttrs) {
          let o = i.getAttrs(e);
          if (o === !1)
            continue;
          i.attrs = o || void 0;
        }
        return i;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, s) {
    for (let i = s ? this.styles.indexOf(s) + 1 : 0; i < this.styles.length; i++) {
      let o = this.styles[i], l = o.style;
      if (!(l.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (o.getAttrs) {
          let a = o.getAttrs(t);
          if (a === !1)
            continue;
          o.attrs = a || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(s) {
      let i = s.priority == null ? 50 : s.priority, o = 0;
      for (; o < t.length; o++) {
        let l = t[o];
        if ((l.priority == null ? 50 : l.priority) < i)
          break;
      }
      t.splice(o, 0, s);
    }
    for (let s in e.marks) {
      let i = e.marks[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = jo(o)), o.mark || o.ignore || o.clearMark || (o.mark = s);
      });
    }
    for (let s in e.nodes) {
      let i = e.nodes[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = jo(o)), o.node || o.ignore || o.mark || (o.node = s);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.ParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new nn(e, nn.schemaRules(e)));
  }
}
const Ka = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, wu = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Ja = { ol: !0, ul: !0 }, Ir = 1, Lr = 2, Tn = 4;
function _o(n, e, t) {
  return e != null ? (e ? Ir : 0) | (e === "full" ? Lr : 0) : n && n.whitespace == "pre" ? Ir | Lr : t & ~Tn;
}
class or {
  constructor(e, t, r, s, i, o, l) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = s, this.solid = i, this.options = l, this.content = [], this.activeMarks = L.none, this.stashMarks = [], this.match = o || (l & Tn ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(b.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, s;
        return (s = r.findWrapping(e.type)) ? (this.match = r, s) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Ir)) {
      let r = this.content[this.content.length - 1], s;
      if (r && r.isText && (s = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let i = r;
        r.text.length == s[0].length ? this.content.pop() : this.content[this.content.length - 1] = i.withText(i.text.slice(0, i.text.length - s[0].length));
      }
    }
    let t = b.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(b.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t]))
        return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
      let s = r[t];
      (this.type ? this.type.allowsMarkType(s.type) : Cu(s.type, e)) && !s.isInSet(this.activeMarks) && (this.activeMarks = s.addToSet(this.activeMarks), this.pendingMarks = s.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Ka.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Wo {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let s = t.topNode, i, o = _o(null, t.preserveWhitespace, 0) | (r ? Tn : 0);
    s ? i = new or(s.type, s.attrs, L.none, L.none, !0, t.topMatch || s.type.contentMatch, o) : r ? i = new or(null, null, L.none, L.none, !0, null, o) : i = new or(e.schema.topNodeType, null, L.none, L.none, !0, null, o), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e) {
    e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
  }
  withStyleRules(e, t) {
    let r = e.style;
    if (!r || !r.length)
      return t();
    let s = this.readStyles(e.style);
    if (!s)
      return;
    let [i, o] = s, l = this.top;
    for (let a = 0; a < o.length; a++)
      this.removePendingMark(o[a], l);
    for (let a = 0; a < i.length; a++)
      this.addPendingMark(i[a]);
    t();
    for (let a = 0; a < i.length; a++)
      this.removePendingMark(i[a], l);
    for (let a = 0; a < o.length; a++)
      this.addPendingMark(o[a]);
  }
  addTextNode(e) {
    let t = e.nodeValue, r = this.top;
    if (r.options & Lr || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & Ir)
        r.options & Lr ? t = t.replace(/\r\n?/g, `
`) : t = t.replace(/\r?\n|\r/g, " ");
      else if (t = t.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1) {
        let s = r.content[r.content.length - 1], i = e.previousSibling;
        (!s || i && i.nodeName == "BR" || s.isText && /[ \t\r\n\u000c]$/.test(s.text)) && (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t) {
    let r = e.nodeName.toLowerCase(), s;
    Ja.hasOwnProperty(r) && this.parser.normalizeLists && xu(e);
    let i = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, t));
    if (i ? i.ignore : wu.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!i || i.skip || i.closeParent) {
      i && i.closeParent ? this.open = Math.max(0, this.open - 1) : i && i.skip.nodeType && (e = i.skip);
      let o, l = this.top, a = this.needsBlock;
      if (Ka.hasOwnProperty(r))
        l.content.length && l.content[0].isInline && this.open && (this.open--, l = this.top), o = !0, l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), o && this.sync(l), this.needsBlock = a;
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, i, i.consuming === !1 ? s : void 0);
      });
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`));
  }
  // Called for ignored nodes
  ignoreFallback(e) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"));
  }
  // Run any style parser associated with the node's styles. Either
  // return an array of marks, or null to indicate some of the styles
  // had a rule with `ignore` set.
  readStyles(e) {
    let t = L.none, r = L.none;
    if (e.length)
      for (let s = 0; s < this.parser.matchedStyles.length; s++) {
        let i = this.parser.matchedStyles[s], o = e.getPropertyValue(i);
        if (o)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(i, o, this, l);
            if (!a)
              break;
            if (a.ignore)
              return null;
            if (a.clearMark ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((c) => {
              a.clearMark(c) && (r = c.addToSet(r));
            }) : t = this.parser.schema.marks[a.mark].create(a.attrs).addToSet(t), a.consuming === !1)
              l = a;
            else
              break;
          }
      }
    return [t, r];
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r) {
    let s, i, o;
    t.node ? (i = this.parser.schema.nodes[t.node], i.isLeaf ? this.insertNode(i.create(t.attrs)) || this.leafFallback(e) : s = this.enter(i, t.attrs || null, t.preserveWhitespace)) : (o = this.parser.schema.marks[t.mark].create(t.attrs), this.addPendingMark(o));
    let l = this.top;
    if (i && i.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a);
    }
    s && this.sync(l) && this.open--, o && this.removePendingMark(o, l);
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r) {
    let s = t || 0;
    for (let i = t ? e.childNodes[t] : e.firstChild, o = r == null ? null : e.childNodes[r]; i != o; i = i.nextSibling, ++s)
      this.findAtPoint(e, s), this.addDOM(i);
    this.findAtPoint(e, s);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e) {
    let t, r;
    for (let s = this.open; s >= 0; s--) {
      let i = this.nodes[s], o = i.findWrapping(e);
      if (o && (!t || t.length > o.length) && (t = o, r = i, !o.length) || i.solid)
        break;
    }
    if (!t)
      return !1;
    this.sync(r);
    for (let s = 0; s < t.length; s++)
      this.enterInner(t[s], null, !1);
    return !0;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let r = t.activeMarks;
      for (let s = 0; s < e.marks.length; s++)
        (!t.type || t.type.allowsMarkType(e.marks[s].type)) && (r = e.marks[s].addToSet(r));
      return t.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r) {
    let s = this.findPlace(e.create(t));
    return s && this.enterInner(e, t, !0, r), s;
  }
  // Open a node of the given type
  enterInner(e, t = null, r = !1, s) {
    this.closeExtra();
    let i = this.top;
    i.applyPending(e), i.match = i.match && i.match.matchType(e);
    let o = _o(e, s, i.options);
    i.options & Tn && i.content.length == 0 && (o |= Tn), this.nodes.push(new or(e, t, i.activeMarks, i.pendingMarks, r, null, o)), this.open++;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen);
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--)
      if (this.nodes[t] == e)
        return this.open = t, !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let s = r.length - 1; s >= 0; s--)
        e += r[s].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let s = 0; s < this.find.length; s++)
        this.find[s].pos == null && e.nodeType == 1 && e.contains(this.find[s].node) && t.compareDocumentPosition(this.find[s].node) & (r ? 2 : 4) && (this.find[s].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, s = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), i = -(r ? r.depth + 1 : 0) + (s ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= i; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let d = a > 0 || a == 0 && s ? this.nodes[a].type : r && a >= i ? r.node(a - i).type : null;
          if (!d || d.name != c && d.groups.indexOf(c) == -1)
            return !1;
          a--;
        }
      }
      return !0;
    };
    return o(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
  addPendingMark(e) {
    let t = Mu(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, t) {
    for (let r = this.open; r >= 0; r--) {
      let s = this.nodes[r];
      if (s.pendingMarks.lastIndexOf(e) > -1)
        s.pendingMarks = e.removeFromSet(s.pendingMarks);
      else {
        s.activeMarks = e.removeFromSet(s.activeMarks);
        let o = s.popFromStashMark(e);
        o && s.type && s.type.allowsMarkType(o.type) && (s.activeMarks = o.addToSet(s.activeMarks));
      }
      if (s == t)
        break;
    }
  }
}
function xu(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ja.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Su(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function jo(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Cu(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let s = t[r];
    if (!s.allowsMarkType(n))
      continue;
    let i = [], o = (l) => {
      i.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: d } = l.edge(a);
        if (c == e || i.indexOf(d) < 0 && o(d))
          return !0;
      }
    };
    if (o(s.contentMatch))
      return !0;
  }
}
function Mu(n, e) {
  for (let t = 0; t < e.length; t++)
    if (n.eq(e[t]))
      return e[t];
}
class Ie {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, t = {}, r) {
    r || (r = Ws(t).createDocumentFragment());
    let s = r, i = [];
    return e.forEach((o) => {
      if (i.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < i.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(i[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < i.length; )
          s = i.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], d = this.serializeMark(c, o.isInline, t);
          d && (i.push([c, s]), s.appendChild(d.dom), s = d.contentDOM || d.dom);
        }
      }
      s.appendChild(this.serializeNodeInner(o, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: s } = Ie.renderSpec(Ws(t), this.nodes[e.type.name](e));
    if (s) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, s);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let s = e.marks.length - 1; s >= 0; s--) {
      let i = this.serializeMark(e.marks[s], e.isInline, t);
      i && ((i.contentDOM || i.dom).appendChild(r), r = i.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let s = this.marks[e.type.name];
    return s && Ie.renderSpec(Ws(r), s(e, t));
  }
  /**
  Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
  the spec has a hole (zero) in it, `contentDOM` will point at the
  node with the hole.
  */
  static renderSpec(e, t, r = null) {
    if (typeof t == "string")
      return { dom: e.createTextNode(t) };
    if (t.nodeType != null)
      return { dom: t };
    if (t.dom && t.dom.nodeType != null)
      return t;
    let s = t[0], i = s.indexOf(" ");
    i > 0 && (r = s.slice(0, i), s = s.slice(i + 1));
    let o, l = r ? e.createElementNS(r, s) : e.createElement(s), a = t[1], c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let d in a)
        if (a[d] != null) {
          let u = d.indexOf(" ");
          u > 0 ? l.setAttributeNS(d.slice(0, u), d.slice(u + 1), a[d]) : l.setAttribute(d, a[d]);
        }
    }
    for (let d = c; d < t.length; d++) {
      let u = t[d];
      if (u === 0) {
        if (d < t.length - 1 || d > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: h, contentDOM: f } = Ie.renderSpec(e, u, r);
        if (l.appendChild(h), f) {
          if (o)
            throw new RangeError("Multiple content holes");
          o = f;
        }
      }
    }
    return { dom: l, contentDOM: o };
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Ie(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Uo(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Uo(e.marks);
  }
}
function Uo(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Ws(n) {
  return n.document || window.document;
}
const qa = 65535, Ga = Math.pow(2, 16);
function Tu(n, e) {
  return n + e * Ga;
}
function Ko(n) {
  return n & qa;
}
function Au(n) {
  return (n - (n & qa)) / Ga;
}
const Ya = 1, Xa = 2, kr = 4, Qa = 8;
class Si {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Qa) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Ya | kr)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Xa | kr)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & kr) > 0;
  }
}
class de {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && de.empty)
      return de.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Ko(e);
    if (!this.inverted)
      for (let s = 0; s < r; s++)
        t += this.ranges[s * 3 + 2] - this.ranges[s * 3 + 1];
    return this.ranges[r * 3] + t + Au(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let s = 0, i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? s : 0);
      if (a > e)
        break;
      let c = this.ranges[l + i], d = this.ranges[l + o], u = a + c;
      if (e <= u) {
        let h = c ? e == a ? -1 : e == u ? 1 : t : t, f = a + s + (h < 0 ? 0 : d);
        if (r)
          return f;
        let p = e == (t < 0 ? a : u) ? null : Tu(l / 3, e - a), m = e == a ? Xa : e == u ? Ya : kr;
        return (t < 0 ? e != a : e != u) && (m |= Qa), new Si(f, m, p);
      }
      s += d - c;
    }
    return r ? e + s : new Si(e + s, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, s = Ko(t), i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + i], d = a + c;
      if (e <= d && l == s * 3)
        return !0;
      r += this.ranges[l + o] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let s = 0, i = 0; s < this.ranges.length; s += 3) {
      let o = this.ranges[s], l = o - (this.inverted ? i : 0), a = o + (this.inverted ? 0 : i), c = this.ranges[s + t], d = this.ranges[s + r];
      e(l, l + c, a, a + d), i += d - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new de(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? de.empty : new de(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
de.empty = new de([]);
class Yt {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e = [], t, r = 0, s = e.length) {
    this.maps = e, this.mirror = t, this.from = r, this.to = s;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, t = this.maps.length) {
    return new Yt(this.maps, this.mirror, e, t);
  }
  /**
  @internal
  */
  copy() {
    return new Yt(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, t) {
    this.to = this.maps.push(e), t != null && this.setMirror(this.maps.length - 1, t);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let t = 0, r = this.maps.length; t < e.maps.length; t++) {
      let s = e.getMirror(t);
      this.appendMap(e.maps[t], s != null && s < t ? r + s : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this.maps.length + e.maps.length; t >= 0; t--) {
      let s = e.getMirror(t);
      this.appendMap(e.maps[t].invert(), s != null && s > t ? r - s - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new Yt();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this.maps[r].map(e, t);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let s = 0;
    for (let i = this.from; i < this.to; i++) {
      let o = this.maps[i], l = o.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(i);
        if (a != null && a > i && a < this.to) {
          i = a, e = this.maps[a].recover(l.recover);
          continue;
        }
      }
      s |= l.delInfo, e = l.pos;
    }
    return r ? e : new Si(e, s, null);
  }
}
const js = /* @__PURE__ */ Object.create(null);
class te {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return de.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = js[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in js)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return js[e] = t, t.prototype.jsonID = e, t;
  }
}
class V {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new V(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new V(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, s) {
    try {
      return V.ok(e.replace(t, r, s));
    } catch (i) {
      if (i instanceof Or)
        return V.fail(i.message);
      throw i;
    }
  }
}
function eo(n, e, t) {
  let r = [];
  for (let s = 0; s < n.childCount; s++) {
    let i = n.child(s);
    i.content.size && (i = i.copy(eo(i.content, e, i))), i.isInline && (i = e(i, t, s)), r.push(i);
  }
  return b.fromArray(r);
}
class st extends te {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), s = r.node(r.sharedDepth(this.to)), i = new x(eo(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), s), t.openStart, t.openEnd);
    return V.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new Le(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new st(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof st && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new st(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new st(t.from, t.to, e.markFromJSON(t.mark));
  }
}
te.jsonID("addMark", st);
class Le extends te {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new x(eo(t.content, (s) => s.mark(this.mark.removeFromSet(s.marks)), e), t.openStart, t.openEnd);
    return V.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new st(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Le(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Le && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Le(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Le(t.from, t.to, e.markFromJSON(t.mark));
  }
}
te.jsonID("removeMark", Le);
class it extends te {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return V.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return V.fromReplace(e, this.pos, this.pos + 1, new x(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let s = 0; s < t.marks.length; s++)
          if (!t.marks[s].isInSet(r))
            return new it(this.pos, t.marks[s]);
        return new it(this.pos, this.mark);
      }
    }
    return new rn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new it(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new it(t.pos, e.markFromJSON(t.mark));
  }
}
te.jsonID("addNodeMark", it);
class rn extends te {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return V.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return V.fromReplace(e, this.pos, this.pos + 1, new x(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new it(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new rn(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new rn(t.pos, e.markFromJSON(t.mark));
  }
}
te.jsonID("removeNodeMark", rn);
class _ extends te {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, s = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = s;
  }
  apply(e) {
    return this.structure && Ci(e, this.from, this.to) ? V.fail("Structure replace would overwrite content") : V.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new de([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new _(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new _(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof _) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? x.empty : new x(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new _(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? x.empty : new x(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new _(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new _(t.from, t.to, x.fromJSON(e, t.slice), !!t.structure);
  }
}
te.jsonID("replace", _);
class j extends te {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, s, i, o, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = s, this.slice = i, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (Ci(e, this.from, this.gapFrom) || Ci(e, this.gapTo, this.to)))
      return V.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return V.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? V.fromReplace(e, this.from, this.to, r) : V.fail("Content does not fit in gap");
  }
  getMap() {
    return new de([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new j(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), s = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), i = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || s < t.pos || i > r.pos ? null : new j(t.pos, r.pos, s, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new j(t.from, t.to, t.gapFrom, t.gapTo, x.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
te.jsonID("replaceAround", j);
function Ci(n, e, t) {
  let r = n.resolve(e), s = t - e, i = r.depth;
  for (; s > 0 && i > 0 && r.indexAfter(i) == r.node(i).childCount; )
    i--, s--;
  if (s > 0) {
    let o = r.node(i).maybeChild(r.indexAfter(i));
    for (; s > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, s--;
    }
  }
  return !1;
}
function Eu(n, e, t, r) {
  let s = [], i = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, d) => {
    if (!a.isInline)
      return;
    let u = a.marks;
    if (!r.isInSet(u) && d.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), f = Math.min(c + a.nodeSize, t), p = r.addToSet(u);
      for (let m = 0; m < u.length; m++)
        u[m].isInSet(p) || (o && o.to == h && o.mark.eq(u[m]) ? o.to = f : s.push(o = new Le(h, f, u[m])));
      l && l.to == h ? l.to = f : i.push(l = new st(h, f, r));
    }
  }), s.forEach((a) => n.step(a)), i.forEach((a) => n.step(a));
}
function vu(n, e, t, r) {
  let s = [], i = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    i++;
    let a = null;
    if (r instanceof xs) {
      let c = o.marks, d;
      for (; d = r.isInSet(c); )
        (a || (a = [])).push(d), c = d.removeFromSet(c);
    } else r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, t);
      for (let d = 0; d < a.length; d++) {
        let u = a[d], h;
        for (let f = 0; f < s.length; f++) {
          let p = s[f];
          p.step == i - 1 && u.eq(s[f].style) && (h = p);
        }
        h ? (h.to = c, h.step = i) : s.push({ style: u, from: Math.max(l, e), to: c, step: i });
      }
    }
  }), s.forEach((o) => n.step(new Le(o.from, o.to, o.style)));
}
function Za(n, e, t, r = t.contentMatch, s = !0) {
  let i = n.doc.nodeAt(e), o = [], l = e + 1;
  for (let a = 0; a < i.childCount; a++) {
    let c = i.child(a), d = l + c.nodeSize, u = r.matchType(c.type);
    if (!u)
      o.push(new _(l, d, x.empty));
    else {
      r = u;
      for (let h = 0; h < c.marks.length; h++)
        t.allowsMarkType(c.marks[h].type) || n.step(new Le(l, d, c.marks[h]));
      if (s && c.isText && t.whitespace != "pre") {
        let h, f = /\r?\n|\r/g, p;
        for (; h = f.exec(c.text); )
          p || (p = new x(b.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new _(l + h.index, l + h.index + h[0].length, p));
      }
    }
    l = d;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(b.empty, !0);
    n.replace(l, l, new x(a, 0, 0));
  }
  for (let a = o.length - 1; a >= 0; a--)
    n.step(o[a]);
}
function Ou(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function pn(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let s = n.$from.node(r), i = n.$from.index(r), o = n.$to.indexAfter(r);
    if (r < n.depth && s.canReplace(i, o, t))
      return r;
    if (r == 0 || s.type.spec.isolating || !Ou(s, i, o))
      break;
  }
  return null;
}
function Nu(n, e, t) {
  let { $from: r, $to: s, depth: i } = e, o = r.before(i + 1), l = s.after(i + 1), a = o, c = l, d = b.empty, u = 0;
  for (let p = i, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, d = b.from(r.node(p).copy(d)), u++) : a--;
  let h = b.empty, f = 0;
  for (let p = i, m = !1; p > t; p--)
    m || s.after(p + 1) < s.end(p) ? (m = !0, h = b.from(s.node(p).copy(h)), f++) : c++;
  n.step(new j(a, c, o, l, new x(d.append(h), u, f), d.size - u, !0));
}
function to(n, e, t = null, r = n) {
  let s = Ru(n, e), i = s && Du(r, e);
  return i ? s.map(Jo).concat({ type: e, attrs: t }).concat(i.map(Jo)) : null;
}
function Jo(n) {
  return { type: n, attrs: null };
}
function Ru(n, e) {
  let { parent: t, startIndex: r, endIndex: s } = n, i = t.contentMatchAt(r).findWrapping(e);
  if (!i)
    return null;
  let o = i.length ? i[0] : e;
  return t.canReplaceWith(r, s, o) ? i : null;
}
function Du(n, e) {
  let { parent: t, startIndex: r, endIndex: s } = n, i = t.child(r), o = e.contentMatch.findWrapping(i.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < s; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function Iu(n, e, t) {
  let r = b.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = t[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = b.from(t[o].type.create(t[o].attrs, r));
  }
  let s = e.start, i = e.end;
  n.step(new j(s, i, s, i, new x(r, 0, 0), t.length, !0));
}
function Lu(n, e, t, r, s) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let i = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, s) && Bu(n.doc, n.mapping.slice(i).map(l), r)) {
      let a = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", f = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !f ? a = !1 : !h && f && (a = !0);
      }
      a === !1 && $u(n, o, l, i), Za(n, n.mapping.slice(i).map(l, 1), r, void 0, a === null);
      let c = n.mapping.slice(i), d = c.map(l, 1), u = c.map(l + o.nodeSize, 1);
      return n.step(new j(d, u, d + 1, u - 1, new x(b.from(r.create(s, null, o.marks)), 0, 0), 1, !0)), a === !0 && Pu(n, o, l, i), !1;
    }
  });
}
function Pu(n, e, t, r) {
  e.forEach((s, i) => {
    if (s.isText) {
      let o, l = /\r?\n|\r/g;
      for (; o = l.exec(s.text); ) {
        let a = n.mapping.slice(r).map(t + 1 + i + o.index);
        n.replaceWith(a, a + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function $u(n, e, t, r) {
  e.forEach((s, i) => {
    if (s.type == s.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + i);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Bu(n, e, t) {
  let r = n.resolve(e), s = r.index();
  return r.parent.canReplaceWith(s, s + 1, t);
}
function zu(n, e, t, r, s) {
  let i = n.doc.nodeAt(e);
  if (!i)
    throw new RangeError("No node at given position");
  t || (t = i.type);
  let o = t.create(r, null, s || i.marks);
  if (i.isLeaf)
    return n.replaceWith(e, e + i.nodeSize, o);
  if (!t.validContent(i.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new j(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new x(b.from(o), 0, 0), 1, !0));
}
function Xt(n, e, t = 1, r) {
  let s = n.resolve(e), i = s.depth - t, o = r && r[r.length - 1] || s.parent;
  if (i < 0 || s.parent.type.spec.isolating || !s.parent.canReplace(s.index(), s.parent.childCount) || !o.type.validContent(s.parent.content.cutByIndex(s.index(), s.parent.childCount)))
    return !1;
  for (let c = s.depth - 1, d = t - 2; c > i; c--, d--) {
    let u = s.node(c), h = s.index(c);
    if (u.type.spec.isolating)
      return !1;
    let f = u.content.cutByIndex(h, u.childCount), p = r && r[d + 1];
    p && (f = f.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[d] || u;
    if (!u.canReplace(h + 1, u.childCount) || !m.type.validContent(f))
      return !1;
  }
  let l = s.indexAfter(i), a = r && r[0];
  return s.node(i).canReplaceWith(l, l, a ? a.type : s.node(i + 1).type);
}
function Hu(n, e, t = 1, r) {
  let s = n.doc.resolve(e), i = b.empty, o = b.empty;
  for (let l = s.depth, a = s.depth - t, c = t - 1; l > a; l--, c--) {
    i = b.from(s.node(l).copy(i));
    let d = r && r[c];
    o = b.from(d ? d.type.create(d.attrs, o) : s.node(l).copy(o));
  }
  n.step(new _(e, e, new x(i.append(o), t, t), !0));
}
function pt(n, e) {
  let t = n.resolve(e), r = t.index();
  return ec(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function ec(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function Ss(n, e, t = -1) {
  let r = n.resolve(e);
  for (let s = r.depth; ; s--) {
    let i, o, l = r.index(s);
    if (s == r.depth ? (i = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (i = r.node(s + 1), l++, o = r.node(s).maybeChild(l)) : (i = r.node(s).maybeChild(l - 1), o = r.node(s + 1)), i && !i.isTextblock && ec(i, o) && r.node(s).canReplace(l, l + 1))
      return e;
    if (s == 0)
      break;
    e = t < 0 ? r.before(s) : r.after(s);
  }
}
function Fu(n, e, t) {
  let r = new _(e - t, e + t, x.empty, !0);
  n.step(r);
}
function Vu(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let s = r.depth - 1; s >= 0; s--) {
      let i = r.index(s);
      if (r.node(s).canReplaceWith(i, i, t))
        return r.before(s + 1);
      if (i > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let s = r.depth - 1; s >= 0; s--) {
      let i = r.indexAfter(s);
      if (r.node(s).canReplaceWith(i, i, t))
        return r.after(s + 1);
      if (i < r.node(s).childCount)
        return null;
    }
  return null;
}
function tc(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let s = t.content;
  for (let i = 0; i < t.openStart; i++)
    s = s.firstChild.content;
  for (let i = 1; i <= (t.openStart == 0 && t.size ? 2 : 1); i++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), d = !1;
      if (i == 1)
        d = c.canReplace(a, a, s);
      else {
        let u = c.contentMatchAt(a).findWrapping(s.firstChild.type);
        d = u && c.canReplaceWith(a, a, u[0]);
      }
      if (d)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function Cs(n, e, t = e, r = x.empty) {
  if (e == t && !r.size)
    return null;
  let s = n.resolve(e), i = n.resolve(t);
  return nc(s, i, r) ? new _(e, t, r) : new _u(s, i, r).fit();
}
function nc(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class _u {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = b.empty;
    for (let s = 0; s <= e.depth; s++) {
      let i = e.node(s);
      this.frontier.push({
        type: i.type,
        match: i.contentMatchAt(e.indexAfter(s))
      });
    }
    for (let s = e.depth; s > 0; s--)
      this.placed = b.from(e.node(s).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, s = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!s)
      return null;
    let i = this.placed, o = r.depth, l = s.depth;
    for (; o && l && i.childCount == 1; )
      i = i.firstChild.content, o--, l--;
    let a = new x(i, o, l);
    return e > -1 ? new j(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new _(r.pos, s.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, s = this.unplaced.openEnd; r < e; r++) {
      let i = t.firstChild;
      if (t.childCount > 1 && (s = 0), i.type.spec.isolating && s <= r) {
        e = r;
        break;
      }
      t = i.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let s, i = null;
        r ? (i = Us(this.unplaced.content, r - 1).firstChild, s = i.content) : s = this.unplaced.content;
        let o = s.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], d, u = null;
          if (t == 1 && (o ? c.matchType(o.type) || (u = c.fillBefore(b.from(o), !1)) : i && a.compatibleContent(i.type)))
            return { sliceDepth: r, frontierDepth: l, parent: i, inject: u };
          if (t == 2 && o && (d = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: i, wrap: d };
          if (i && c.matchType(i.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, s = Us(e, t);
    return !s.childCount || s.firstChild.isLeaf ? !1 : (this.unplaced = new x(e, t + 1, Math.max(r, s.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, s = Us(e, t);
    if (s.childCount <= 1 && t > 0) {
      let i = e.size - t <= t + s.size;
      this.unplaced = new x(xn(e, t - 1, 1), t - 1, i ? t - 1 : r);
    } else
      this.unplaced = new x(xn(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: s, wrap: i }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (i)
      for (let m = 0; m < i.length; m++)
        this.openFrontierNode(i[m]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, d = [], { match: u, type: h } = this.frontier[t];
    if (s) {
      for (let m = 0; m < s.childCount; m++)
        d.push(s.child(m));
      u = u.matchFragment(s);
    }
    let f = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c), g = u.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || a == 0 || m.content.size) && (u = g, d.push(rc(m.mark(h.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let p = c == l.childCount;
    p || (f = -1), this.placed = Sn(this.placed, t, b.from(d)), this.frontier[t].match = u, p && f < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < f; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? x.empty : new x(xn(o.content, e - 1, 1), e - 1, f < 0 ? o.openEnd : e - 1) : new x(xn(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Ks(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, s = this.$to.after(r);
    for (; r > 1 && s == this.$to.end(--r); )
      ++s;
    return s;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: s } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Ks(e, t, s, r, i);
      if (o) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], d = Ks(e, l, c, a, !0);
          if (!d || d.childCount)
            continue e;
        }
        return { depth: t, fit: o, move: i ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = Sn(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let s = e.node(r), i = s.type.contentMatch.fillBefore(s.content, !0, e.index(r));
      this.openFrontierNode(s.type, s.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let s = this.frontier[this.depth];
    s.match = s.match.matchType(e), this.placed = Sn(this.placed, this.depth, b.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(b.empty, !0);
    t.childCount && (this.placed = Sn(this.placed, this.frontier.length, t));
  }
}
function xn(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(xn(n.firstChild.content, e - 1, t)));
}
function Sn(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Sn(n.lastChild.content, e - 1, t)));
}
function Us(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function rc(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, rc(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(b.empty, !0)))), n.copy(r);
}
function Ks(n, e, t, r, s) {
  let i = n.node(e), o = s ? n.indexAfter(e) : n.index(e);
  if (o == i.childCount && !t.compatibleContent(i.type))
    return null;
  let l = r.fillBefore(i.content, !0, o);
  return l && !Wu(t, i.content, o) ? l : null;
}
function Wu(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function ju(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Uu(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let s = n.doc.resolve(e), i = n.doc.resolve(t);
  if (nc(s, i, r))
    return n.step(new _(e, t, r));
  let o = ic(s, n.doc.resolve(t));
  o[o.length - 1] == 0 && o.pop();
  let l = -(s.depth + 1);
  o.unshift(l);
  for (let h = s.depth, f = s.pos - 1; h > 0; h--, f--) {
    let p = s.node(h).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(h) > -1 ? l = h : s.before(h) == f && o.splice(1, 0, -h);
  }
  let a = o.indexOf(l), c = [], d = r.openStart;
  for (let h = r.content, f = 0; ; f++) {
    let p = h.firstChild;
    if (c.push(p), f == r.openStart)
      break;
    h = p.content;
  }
  for (let h = d - 1; h >= 0; h--) {
    let f = c[h], p = ju(f.type);
    if (p && !f.sameMarkup(s.node(Math.abs(l) - 1)))
      d = h;
    else if (p || !f.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let f = (h + d + 1) % (r.openStart + 1), p = c[f];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + a) % o.length], y = !0;
        g < 0 && (y = !1, g = -g);
        let k = s.node(g - 1), C = s.index(g - 1);
        if (k.canReplaceWith(C, C, p.type, p.marks))
          return n.replace(s.before(g), y ? i.after(g) : t, new x(sc(r.content, 0, r.openStart, f), f, r.openEnd));
      }
  }
  let u = n.steps.length;
  for (let h = o.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > u)); h--) {
    let f = o[h];
    f < 0 || (e = s.before(f), t = i.after(f));
  }
}
function sc(n, e, t, r, s) {
  if (e < t) {
    let i = n.firstChild;
    n = n.replaceChild(0, i.copy(sc(i.content, e + 1, t, r, i)));
  }
  if (e > r) {
    let i = s.contentMatchAt(0), o = i.fillBefore(n).append(n);
    n = o.append(i.matchFragment(o).fillBefore(b.empty, !0));
  }
  return n;
}
function Ku(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let s = Vu(n.doc, e, r.type);
    s != null && (e = t = s);
  }
  n.replaceRange(e, t, new x(b.from(r), 0, 0));
}
function Ju(n, e, t) {
  let r = n.doc.resolve(e), s = n.doc.resolve(t), i = ic(r, s);
  for (let o = 0; o < i.length; o++) {
    let l = i[o], a = o == i.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), s.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), s.indexAfter(l - 1))))
      return n.delete(r.before(l), s.after(l));
  }
  for (let o = 1; o <= r.depth && o <= s.depth; o++)
    if (e - r.start(o) == r.depth - o && t > r.end(o) && s.end(o) - t != s.depth - o)
      return n.delete(r.before(o), t);
  n.delete(e, t);
}
function ic(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let s = r; s >= 0; s--) {
    let i = n.start(s);
    if (i < n.pos - (n.depth - s) || e.end(s) > e.pos + (e.depth - s) || n.node(s).type.spec.isolating || e.node(s).type.spec.isolating)
      break;
    (i == e.start(s) || s == n.depth && s == e.depth && n.parent.inlineContent && e.parent.inlineContent && s && e.start(s - 1) == i - 1) && t.push(s);
  }
  return t;
}
class Qt extends te {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return V.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in t.attrs)
      r[i] = t.attrs[i];
    r[this.attr] = this.value;
    let s = t.type.create(r, null, t.marks);
    return V.fromReplace(e, this.pos, this.pos + 1, new x(b.from(s), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return de.empty;
  }
  invert(e) {
    return new Qt(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Qt(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Qt(t.pos, t.attr, t.value);
  }
}
te.jsonID("attr", Qt);
class Pn extends te {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let s in e.attrs)
      t[s] = e.attrs[s];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return V.ok(r);
  }
  getMap() {
    return de.empty;
  }
  invert(e) {
    return new Pn(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new Pn(t.attr, t.value);
  }
}
te.jsonID("docAttr", Pn);
let sn = class extends Error {
};
sn = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
sn.prototype = Object.create(Error.prototype);
sn.prototype.constructor = sn;
sn.prototype.name = "TransformError";
class no {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Yt();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new sn(t.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, t = e, r = x.empty) {
    let s = Cs(this.doc, e, t, r);
    return s && this.step(s), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new x(b.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, x.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, t, r) {
    return Uu(this, e, t, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, t, r) {
    return Ku(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Ju(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Nu(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Fu(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return Iu(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, s = null) {
    return Lu(this, e, t, r, s), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, s) {
    return zu(this, e, t, r, s), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Qt(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Pn(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new it(e, t)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    if (!(t instanceof L)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (t = t.isInSet(r.marks), !t)
        return this;
    }
    return this.step(new rn(e, t)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, t = 1, r) {
    return Hu(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Eu(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return vu(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Za(this, e, t, r), this;
  }
}
const Js = /* @__PURE__ */ Object.create(null);
class E {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new oc(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = x.empty) {
    let r = t.content.lastChild, s = null;
    for (let l = 0; l < t.openEnd; l++)
      s = r, r = r.lastChild;
    let i = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], d = e.mapping.slice(i);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? x.empty : t), l == 0 && Yo(e, i, (r ? r.isInline : s && s.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, s = this.ranges;
    for (let i = 0; i < s.length; i++) {
      let { $from: o, $to: l } = s[i], a = e.mapping.slice(r), c = a.map(o.pos), d = a.map(l.pos);
      i ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), Yo(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let s = e.parent.inlineContent ? new A(e) : jt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (s)
      return s;
    for (let i = e.depth - 1; i >= 0; i--) {
      let o = t < 0 ? jt(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, r) : jt(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, r);
      if (o)
        return o;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Se(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return jt(e, e, 0, 0, 1) || new Se(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return jt(e, e, e.content.size, e.childCount, -1) || new Se(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Js[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in Js)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Js[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return A.between(this.$anchor, this.$head).getBookmark();
  }
}
E.prototype.visible = !0;
class oc {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let qo = !1;
function Go(n) {
  !qo && !n.parent.inlineContent && (qo = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class A extends E {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Go(e), Go(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return E.near(r);
    let s = e.resolve(t.map(this.anchor));
    return new A(s.parent.inlineContent ? s : r, r);
  }
  replace(e, t = x.empty) {
    if (super.replace(e, t), t == x.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof A && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Ms(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new A(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let s = e.resolve(t);
    return new this(s, r == t ? s : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let s = e.pos - t.pos;
    if ((!r || s) && (r = s >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let i = E.findFrom(t, r, !0) || E.findFrom(t, -r, !0);
      if (i)
        t = i.$head;
      else
        return E.near(t, r);
    }
    return e.parent.inlineContent || (s == 0 ? e = t : (e = (E.findFrom(e, -r, !0) || E.findFrom(e, r, !0)).$anchor, e.pos < t.pos != s < 0 && (e = t))), new A(e, t);
  }
}
E.jsonID("text", A);
class Ms {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Ms(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return A.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class T extends E {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: s } = t.mapResult(this.anchor), i = e.resolve(s);
    return r ? E.near(i) : new T(i);
  }
  content() {
    return new x(b.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof T && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new ro(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new T(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new T(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
T.prototype.visible = !1;
E.jsonID("node", T);
class ro {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Ms(r, r) : new ro(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && T.isSelectable(r) ? new T(t) : E.near(t);
  }
}
class Se extends E {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = x.empty) {
    if (t == x.empty) {
      e.delete(0, e.doc.content.size);
      let r = E.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new Se(e);
  }
  map(e) {
    return new Se(e);
  }
  eq(e) {
    return e instanceof Se;
  }
  getBookmark() {
    return qu;
  }
}
E.jsonID("all", Se);
const qu = {
  map() {
    return this;
  },
  resolve(n) {
    return new Se(n);
  }
};
function jt(n, e, t, r, s, i = !1) {
  if (e.inlineContent)
    return A.create(n, t);
  for (let o = r - (s > 0 ? 0 : 1); s > 0 ? o < e.childCount : o >= 0; o += s) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!i && T.isSelectable(l))
        return T.create(n, t - (s < 0 ? l.nodeSize : 0));
    } else {
      let a = jt(n, l, t + s, s < 0 ? l.childCount : 0, s, i);
      if (a)
        return a;
    }
    t += l.nodeSize * s;
  }
  return null;
}
function Yo(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let s = n.steps[r];
  if (!(s instanceof _ || s instanceof j))
    return;
  let i = n.mapping.maps[r], o;
  i.forEach((l, a, c, d) => {
    o == null && (o = d);
  }), n.setSelection(E.near(n.doc.resolve(o), t));
}
const Xo = 1, lr = 2, Qo = 4;
class Gu extends no {
  /**
  @internal
  */
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  /**
  The transaction's current selection. This defaults to the editor
  selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
  transaction, but can be overwritten with
  [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
  */
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  /**
  Update the transaction's current selection. Will determine the
  selection that the editor gets when the transaction is applied.
  */
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Xo) & ~lr, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Xo) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= lr, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return L.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  /**
  Add a mark to the set of stored marks.
  */
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Remove a mark or mark type from the set of stored marks.
  */
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Whether the stored marks were explicitly set for this transaction.
  */
  get storedMarksSet() {
    return (this.updated & lr) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~lr, this.storedMarks = null;
  }
  /**
  Update the timestamp for the transaction.
  */
  setTime(e) {
    return this.time = e, this;
  }
  /**
  Replace the current selection with the given slice.
  */
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  /**
  Replace the selection with the given node. When `inheritMarks` is
  true and the content is inline, it inherits the marks from the
  place where it is inserted.
  */
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || L.none))), r.replaceWith(this, e), this;
  }
  /**
  Delete the selection.
  */
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  /**
  Replace the given range, or the selection if no range is given,
  with a text node containing the given string.
  */
  insertText(e, t, r) {
    let s = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(s.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), r = r ?? t, !e)
        return this.deleteRange(t, r);
      let i = this.storedMarks;
      if (!i) {
        let o = this.doc.resolve(t);
        i = r == t ? o.marks() : o.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, s.text(e, i)), this.selection.empty || this.setSelection(E.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  /**
  Retrieve a metadata property for a given name or plugin.
  */
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  /**
  Returns true if this transaction doesn't contain any metadata,
  and can thus safely be extended.
  */
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  /**
  Indicate that the editor should scroll the selection into view
  when updated to the state produced by this transaction.
  */
  scrollIntoView() {
    return this.updated |= Qo, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Qo) > 0;
  }
}
function Zo(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Cn {
  constructor(e, t, r) {
    this.name = e, this.init = Zo(t.init, r), this.apply = Zo(t.apply, r);
  }
}
const Yu = [
  new Cn("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Cn("selection", {
    init(n, e) {
      return n.selection || E.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Cn("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Cn("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class qs {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Yu.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Cn(r.key, r.spec.state, r));
    });
  }
}
class qt {
  /**
  @internal
  */
  constructor(e) {
    this.config = e;
  }
  /**
  The schema of the state's document.
  */
  get schema() {
    return this.config.schema;
  }
  /**
  The plugins that are active in this state.
  */
  get plugins() {
    return this.config.plugins;
  }
  /**
  Apply the given transaction to produce a new state.
  */
  apply(e) {
    return this.applyTransaction(e).state;
  }
  /**
  @internal
  */
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let s = this.config.plugins[r];
        if (s.spec.filterTransaction && !s.spec.filterTransaction.call(s, e, this))
          return !1;
      }
    return !0;
  }
  /**
  Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
  returns the precise transactions that were applied (which might
  be influenced by the [transaction
  hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
  plugins) along with the new state.
  */
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), s = null;
    for (; ; ) {
      let i = !1;
      for (let o = 0; o < this.config.plugins.length; o++) {
        let l = this.config.plugins[o];
        if (l.spec.appendTransaction) {
          let a = s ? s[o].n : 0, c = s ? s[o].state : this, d = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (d && r.filterTransaction(d, o)) {
            if (d.setMeta("appendedTransaction", e), !s) {
              s = [];
              for (let u = 0; u < this.config.plugins.length; u++)
                s.push(u < o ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(d), r = r.applyInner(d), i = !0;
          }
          s && (s[o] = { state: r, n: t.length });
        }
      }
      if (!i)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new qt(this.config), r = this.config.fields;
    for (let s = 0; s < r.length; s++) {
      let i = r[s];
      t[i.name] = i.apply(e, this[i.name], this, t);
    }
    return t;
  }
  /**
  Start a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new Gu(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new qs(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new qt(t);
    for (let s = 0; s < t.fields.length; s++)
      r[t.fields[s].name] = t.fields[s].init(e, r);
    return r;
  }
  /**
  Create a new state based on this one, but with an adjusted set
  of active plugins. State fields that exist in both sets of
  plugins are kept unchanged. Those that no longer exist are
  dropped, and those that are new are initialized using their
  [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
  configuration object..
  */
  reconfigure(e) {
    let t = new qs(this.schema, e.plugins), r = t.fields, s = new qt(t);
    for (let i = 0; i < r.length; i++) {
      let o = r[i].name;
      s[o] = this.hasOwnProperty(o) ? this[o] : r[i].init(e, s);
    }
    return s;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let s = e[r], i = s.spec.state;
        i && i.toJSON && (t[r] = i.toJSON.call(s, this[s.key]));
      }
    return t;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let s = new qs(e.schema, e.plugins), i = new qt(s);
    return s.fields.forEach((o) => {
      if (o.name == "doc")
        i.doc = Ot.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        i.selection = E.fromJSON(i.doc, t.selection);
      else if (o.name == "storedMarks")
        t.storedMarks && (i.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let a = r[l], c = a.spec.state;
            if (a.key == o.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              i[o.name] = c.fromJSON.call(a, e, t[l], i);
              return;
            }
          }
        i[o.name] = o.init(e, i);
      }
    }), i;
  }
}
function lc(n, e, t) {
  for (let r in n) {
    let s = n[r];
    s instanceof Function ? s = s.bind(e) : r == "handleDOMEvents" && (s = lc(s, e, {})), t[r] = s;
  }
  return t;
}
class X {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && lc(e.props, this, this.props), this.key = e.key ? e.key.key : ac("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Gs = /* @__PURE__ */ Object.create(null);
function ac(n) {
  return n in Gs ? n + "$" + ++Gs[n] : (Gs[n] = 0, n + "$");
}
class ce {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = ac(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const G = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, $n = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Mi = null;
const We = function(n, e, t) {
  let r = Mi || (Mi = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, Xu = function() {
  Mi = null;
}, Lt = function(n, e, t, r) {
  return t && (el(n, e, t, r, -1) || el(n, e, t, r, 1));
}, Qu = /^(img|br|input|textarea|hr)$/i;
function el(n, e, t, r, s) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (s < 0 ? 0 : De(n))) {
      let i = n.parentNode;
      if (!i || i.nodeType != 1 || Yn(n) || Qu.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = G(n) + (s < 0 ? 0 : 1), n = i;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (s < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = s < 0 ? De(n) : 0;
    } else
      return !1;
  }
}
function De(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Zu(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = De(n);
    } else if (n.parentNode && !Yn(n))
      e = G(n), n = n.parentNode;
    else
      return null;
  }
}
function eh(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !Yn(n))
      e = G(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function th(n, e, t) {
  for (let r = e == 0, s = e == De(n); r || s; ) {
    if (n == t)
      return !0;
    let i = G(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && i == 0, s = s && i == De(n);
  }
}
function Yn(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Ts = function(n) {
  return n.focusNode && Lt(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function wt(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function nh(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function rh(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: r.offset };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: r.startOffset };
  }
}
const Pe = typeof navigator < "u" ? navigator : null, tl = typeof document < "u" ? document : null, mt = Pe && Pe.userAgent || "", Ti = /Edge\/(\d+)/.exec(mt), cc = /MSIE \d/.exec(mt), Ai = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(mt), ae = !!(cc || Ai || Ti), lt = cc ? document.documentMode : Ai ? +Ai[1] : Ti ? +Ti[1] : 0, Ce = !ae && /gecko\/(\d+)/i.test(mt);
Ce && +(/Firefox\/(\d+)/.exec(mt) || [0, 0])[1];
const Ei = !ae && /Chrome\/(\d+)/.exec(mt), ne = !!Ei, sh = Ei ? +Ei[1] : 0, re = !ae && !!Pe && /Apple Computer/.test(Pe.vendor), on = re && (/Mobile\/\w+/.test(mt) || !!Pe && Pe.maxTouchPoints > 2), ge = on || (Pe ? /Mac/.test(Pe.platform) : !1), ih = Pe ? /Win/.test(Pe.platform) : !1, we = /Android \d/.test(mt), Xn = !!tl && "webkitFontSmoothing" in tl.documentElement.style, oh = Xn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function lh(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function Fe(n, e) {
  return typeof n == "number" ? n : n[e];
}
function ah(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function nl(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, s = n.someProp("scrollMargin") || 5, i = n.dom.ownerDocument;
  for (let o = t || n.dom; o; o = $n(o)) {
    if (o.nodeType != 1)
      continue;
    let l = o, a = l == i.body, c = a ? lh(i) : ah(l), d = 0, u = 0;
    if (e.top < c.top + Fe(r, "top") ? u = -(c.top - e.top + Fe(s, "top")) : e.bottom > c.bottom - Fe(r, "bottom") && (u = e.bottom - e.top > c.bottom - c.top ? e.top + Fe(s, "top") - c.top : e.bottom - c.bottom + Fe(s, "bottom")), e.left < c.left + Fe(r, "left") ? d = -(c.left - e.left + Fe(s, "left")) : e.right > c.right - Fe(r, "right") && (d = e.right - c.right + Fe(s, "right")), d || u)
      if (a)
        i.defaultView.scrollBy(d, u);
      else {
        let h = l.scrollLeft, f = l.scrollTop;
        u && (l.scrollTop += u), d && (l.scrollLeft += d);
        let p = l.scrollLeft - h, m = l.scrollTop - f;
        e = { left: e.left - p, top: e.top - m, right: e.right - p, bottom: e.bottom - m };
      }
    if (a || /^(fixed|sticky)$/.test(getComputedStyle(o).position))
      break;
  }
}
function ch(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, s;
  for (let i = (e.left + e.right) / 2, o = t + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let l = n.root.elementFromPoint(i, o);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      r = l, s = a.top;
      break;
    }
  }
  return { refDOM: r, refTop: s, stack: dc(n.dom) };
}
function dc(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = $n(r))
    ;
  return e;
}
function dh({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  uc(t, r == 0 ? 0 : r - e);
}
function uc(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: s, left: i } = n[t];
    r.scrollTop != s + e && (r.scrollTop = s + e), r.scrollLeft != i && (r.scrollLeft = i);
  }
}
let Vt = null;
function uh(n) {
  if (n.setActive)
    return n.setActive();
  if (Vt)
    return n.focus(Vt);
  let e = dc(n);
  n.focus(Vt == null ? {
    get preventScroll() {
      return Vt = { preventScroll: !0 }, !0;
    }
  } : void 0), Vt || (Vt = !1, uc(e, 0));
}
function hc(n, e) {
  let t, r = 2e8, s, i = 0, o = e.top, l = e.top, a, c;
  for (let d = n.firstChild, u = 0; d; d = d.nextSibling, u++) {
    let h;
    if (d.nodeType == 1)
      h = d.getClientRects();
    else if (d.nodeType == 3)
      h = We(d).getClientRects();
    else
      continue;
    for (let f = 0; f < h.length; f++) {
      let p = h[f];
      if (p.top <= o && p.bottom >= l) {
        o = Math.max(p.bottom, o), l = Math.min(p.top, l);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = d, r = m, s = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, d.nodeType == 1 && m && (i = u + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else p.top > e.top && !a && p.left <= e.left && p.right >= e.left && (a = d, c = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (i = u + 1);
    }
  }
  return !t && a && (t = a, s = c, r = 0), t && t.nodeType == 3 ? hh(t, s) : !t || r && t.nodeType == 1 ? { node: n, offset: i } : hc(t, s);
}
function hh(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let i = Ge(r, 1);
    if (i.top != i.bottom && so(e, i))
      return { node: n, offset: s + (e.left >= (i.left + i.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function so(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function fh(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function ph(n, e, t) {
  let { node: r, offset: s } = hc(e, t), i = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    i = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, s, i);
}
function mh(n, e, t, r) {
  let s = -1;
  for (let i = e, o = !1; i != n.dom; ) {
    let l = n.docView.nearestDesc(i, !0);
    if (!l)
      return null;
    if (l.dom.nodeType == 1 && (l.node.isBlock && l.parent || !l.contentDOM)) {
      let a = l.dom.getBoundingClientRect();
      if (l.node.isBlock && l.parent && (!o && a.left > r.left || a.top > r.top ? s = l.posBefore : (!o && a.right < r.left || a.bottom < r.top) && (s = l.posAfter), o = !0), !l.contentDOM && s < 0 && !l.node.isText)
        return (l.node.isBlock ? r.top < (a.top + a.bottom) / 2 : r.left < (a.left + a.right) / 2) ? l.posBefore : l.posAfter;
    }
    i = l.dom.parentNode;
  }
  return s > -1 ? s : n.docView.posFromDOM(e, t, -1);
}
function fc(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let s = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), i = s; ; ) {
      let o = n.childNodes[i];
      if (o.nodeType == 1) {
        let l = o.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (so(e, c))
            return fc(o, e, c);
        }
      }
      if ((i = (i + 1) % r) == s)
        break;
    }
  return n;
}
function gh(n, e) {
  let t = n.dom.ownerDocument, r, s = 0, i = rh(t, e.left, e.top);
  i && ({ node: r, offset: s } = i);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!so(e, c) || (o = fc(n.dom, e, c), !o))
      return null;
  }
  if (re)
    for (let c = o; r && c; c = $n(c))
      c.draggable && (r = void 0);
  if (o = fh(o, e), r) {
    if (Ce && r.nodeType == 1 && (s = Math.min(s, r.childNodes.length), s < r.childNodes.length)) {
      let d = r.childNodes[s], u;
      d.nodeName == "IMG" && (u = d.getBoundingClientRect()).right <= e.left && u.bottom > e.top && s++;
    }
    let c;
    Xn && s && r.nodeType == 1 && (c = r.childNodes[s - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && s--, r == n.dom && s == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (s == 0 || r.nodeType != 1 || r.childNodes[s - 1].nodeName != "BR") && (l = mh(n, r, s, e));
  }
  l == null && (l = ph(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function rl(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Ge(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (rl(r))
      return r;
  }
  return Array.prototype.find.call(t, rl) || n.getBoundingClientRect();
}
const yh = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function pc(n, e, t) {
  let { node: r, offset: s, atom: i } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = Xn || Ce;
  if (r.nodeType == 3)
    if (o && (yh.test(r.nodeValue) || (t < 0 ? !s : s == r.nodeValue.length))) {
      let a = Ge(We(r, s, s), t);
      if (Ce && s && /\s/.test(r.nodeValue[s - 1]) && s < r.nodeValue.length) {
        let c = Ge(We(r, s - 1, s - 1), -1);
        if (c.top == a.top) {
          let d = Ge(We(r, s, s + 1), -1);
          if (d.top != a.top)
            return kn(d, d.left < c.left);
        }
      }
      return a;
    } else {
      let a = s, c = s, d = t < 0 ? 1 : -1;
      return t < 0 && !s ? (c++, d = -1) : t >= 0 && s == r.nodeValue.length ? (a--, d = 1) : t < 0 ? a-- : c++, kn(Ge(We(r, a, c), d), d < 0);
    }
  if (!n.state.doc.resolve(e - (i || 0)).parent.inlineContent) {
    if (i == null && s && (t < 0 || s == De(r))) {
      let a = r.childNodes[s - 1];
      if (a.nodeType == 1)
        return Ys(a.getBoundingClientRect(), !1);
    }
    if (i == null && s < De(r)) {
      let a = r.childNodes[s];
      if (a.nodeType == 1)
        return Ys(a.getBoundingClientRect(), !0);
    }
    return Ys(r.getBoundingClientRect(), t >= 0);
  }
  if (i == null && s && (t < 0 || s == De(r))) {
    let a = r.childNodes[s - 1], c = a.nodeType == 3 ? We(a, De(a) - (o ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return kn(Ge(c, 1), !1);
  }
  if (i == null && s < De(r)) {
    let a = r.childNodes[s];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? We(a, 0, o ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return kn(Ge(c, -1), !0);
  }
  return kn(Ge(r.nodeType == 3 ? We(r) : r, -t), t >= 0);
}
function kn(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Ys(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function mc(n, e, t) {
  let r = n.state, s = n.root.activeElement;
  r != e && n.updateState(e), s != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), s != n.dom && s && s.focus();
  }
}
function bh(n, e, t) {
  let r = e.selection, s = t == "up" ? r.$from : r.$to;
  return mc(n, e, () => {
    let { node: i } = n.docView.domFromPos(s.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(i, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        i = l.contentDOM || l.dom;
        break;
      }
      i = l.dom.parentNode;
    }
    let o = pc(n, s.pos, 1);
    for (let l = i.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = We(l, 0, l.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < a.length; c++) {
        let d = a[c];
        if (d.bottom > d.top + 1 && (t == "up" ? o.top - d.top > (d.bottom - o.top) * 2 : d.bottom - o.bottom > (o.bottom - d.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const kh = /[\u0590-\u08ac]/;
function wh(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let s = r.parentOffset, i = !s, o = s == r.parent.content.size, l = n.domSelection();
  return !kh.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? i : o : mc(n, e, () => {
    let { focusNode: a, focusOffset: c, anchorNode: d, anchorOffset: u } = n.domSelectionRange(), h = l.caretBidiLevel;
    l.modify("move", t, "character");
    let f = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !f.contains(p.nodeType == 1 ? p : p.parentNode) || a == p && c == m;
    try {
      l.collapse(d, u), a && (a != d || c != u) && l.extend && l.extend(a, c);
    } catch {
    }
    return h != null && (l.caretBidiLevel = h), g;
  });
}
let sl = null, il = null, ol = !1;
function xh(n, e, t) {
  return sl == e && il == t ? ol : (sl = e, il = t, ol = t == "up" || t == "down" ? bh(n, e, t) : wh(n, e, t));
}
const be = 0, ll = 1, St = 2, $e = 3;
class Qn {
  constructor(e, t, r, s) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = s, this.dirty = be, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  parseRule() {
    return null;
  }
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  stopEvent(e) {
    return !1;
  }
  // The size of the content represented by this desc.
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let s = this.children[t];
      if (s == e)
        return r;
      r += s.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let i, o;
        if (e == this.contentDOM)
          i = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          i = e.previousSibling;
        }
        for (; i && !((o = i.pmViewDesc) && o.parent == this); )
          i = i.previousSibling;
        return i ? this.posBeforeChild(o) + o.size : this.posAtStart;
      } else {
        let i, o;
        if (e == this.contentDOM)
          i = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          i = e.nextSibling;
        }
        for (; i && !((o = i.pmViewDesc) && o.parent == this); )
          i = i.nextSibling;
        return i ? this.posBeforeChild(o) : this.posAtEnd;
      }
    let s;
    if (e == this.dom && this.contentDOM)
      s = t > G(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      s = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let i = e; ; i = i.parentNode) {
          if (i == this.dom) {
            s = !1;
            break;
          }
          if (i.previousSibling)
            break;
        }
      if (s == null && t == e.childNodes.length)
        for (let i = e; ; i = i.parentNode) {
          if (i == this.dom) {
            s = !0;
            break;
          }
          if (i.nextSibling)
            break;
        }
    }
    return s ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, s = e; s; s = s.parentNode) {
      let i = this.getDesc(s), o;
      if (i && (!t || i.node))
        if (r && (o = i.nodeDOM) && !(o.nodeType == 1 ? o.contains(e.nodeType == 1 ? e : e.parentNode) : o == e))
          r = !1;
        else
          return i;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let s = e; s; s = s.parentNode) {
      let i = this.getDesc(s);
      if (i)
        return i.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let s = this.children[t], i = r + s.size;
      if (r == e && i != r) {
        for (; !s.border && s.children.length; )
          s = s.children[0];
        return s;
      }
      if (e < i)
        return s.descAt(e - r - s.border);
      r = i;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, s = 0;
    for (let i = 0; r < this.children.length; r++) {
      let o = this.children[r], l = i + o.size;
      if (l > e || o instanceof yc) {
        s = e - i;
        break;
      }
      i = l;
    }
    if (s)
      return this.children[r].domFromPos(s - this.children[r].border, t);
    for (let i; r && !(i = this.children[r - 1]).size && i instanceof gc && i.side >= 0; r--)
      ;
    if (t <= 0) {
      let i, o = !0;
      for (; i = r ? this.children[r - 1] : null, !(!i || i.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return i && t && o && !i.border && !i.domAtom ? i.domFromPos(i.size, t) : { node: this.contentDOM, offset: i ? G(i.dom) + 1 : 0 };
    } else {
      let i, o = !0;
      for (; i = r < this.children.length ? this.children[r] : null, !(!i || i.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return i && o && !i.border && !i.domAtom ? i.domFromPos(0, t) : { node: this.contentDOM, offset: i ? G(i.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let s = -1, i = -1;
    for (let o = r, l = 0; ; l++) {
      let a = this.children[l], c = o + a.size;
      if (s == -1 && e <= c) {
        let d = o + a.border;
        if (e >= d && t <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM))
          return a.parseRange(e, t, d);
        e = o;
        for (let u = l; u > 0; u--) {
          let h = this.children[u - 1];
          if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
            s = G(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        s == -1 && (s = 0);
      }
      if (s > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let d = l + 1; d < this.children.length; d++) {
          let u = this.children[d];
          if (u.size && u.dom.parentNode == this.contentDOM && !u.emptyChildAt(-1)) {
            i = G(u.dom);
            break;
          }
          t += u.size;
        }
        i == -1 && (i = this.contentDOM.childNodes.length);
        break;
      }
      o = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: s, toOffset: i };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, t, r, s = !1) {
    let i = Math.min(e, t), o = Math.max(e, t);
    for (let h = 0, f = 0; h < this.children.length; h++) {
      let p = this.children[h], m = f + p.size;
      if (i > f && o < m)
        return p.setSelection(e - f - p.border, t - f - p.border, r, s);
      f = m;
    }
    let l = this.domFromPos(e, e ? -1 : 1), a = t == e ? l : this.domFromPos(t, t ? -1 : 1), c = r.getSelection(), d = !1;
    if ((Ce || re) && e == t) {
      let { node: h, offset: f } = l;
      if (h.nodeType == 3) {
        if (d = !!(f && h.nodeValue[f - 1] == `
`), d && f == h.nodeValue.length)
          for (let p = h, m; p; p = p.parentNode) {
            if (m = p.nextSibling) {
              m.nodeName == "BR" && (l = a = { node: m.parentNode, offset: G(m) + 1 });
              break;
            }
            let g = p.pmViewDesc;
            if (g && g.node && g.node.isBlock)
              break;
          }
      } else {
        let p = h.childNodes[f - 1];
        d = p && (p.nodeName == "BR" || p.contentEditable == "false");
      }
    }
    if (Ce && c.focusNode && c.focusNode != a.node && c.focusNode.nodeType == 1) {
      let h = c.focusNode.childNodes[c.focusOffset];
      h && h.contentEditable == "false" && (s = !0);
    }
    if (!(s || d && re) && Lt(l.node, l.offset, c.anchorNode, c.anchorOffset) && Lt(a.node, a.offset, c.focusNode, c.focusOffset))
      return;
    let u = !1;
    if ((c.extend || e == t) && !d) {
      c.collapse(l.node, l.offset);
      try {
        e != t && c.extend(a.node, a.offset), u = !0;
      } catch {
      }
    }
    if (!u) {
      if (e > t) {
        let f = l;
        l = a, a = f;
      }
      let h = document.createRange();
      h.setEnd(a.node, a.offset), h.setStart(l.node, l.offset), c.removeAllRanges(), c.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  markDirty(e, t) {
    for (let r = 0, s = 0; s < this.children.length; s++) {
      let i = this.children[s], o = r + i.size;
      if (r == o ? e <= o && t >= r : e < o && t > r) {
        let l = r + i.border, a = o - i.border;
        if (e >= l && t <= a) {
          this.dirty = e == r || t == o ? St : ll, e == l && t == a && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = $e : i.markDirty(e - l, t - l);
          return;
        } else
          i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? St : $e;
      }
      r = o;
    }
    this.dirty = St;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? St : ll;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class gc extends Qn {
  constructor(e, t, r, s) {
    let i, o = t.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!i)
        return s;
      if (i.parent)
        return i.parent.posBeforeChild(i);
    })), !t.type.spec.raw) {
      if (o.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(o), o = l;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = t, this.widget = t, i = this;
  }
  matchesWidget(e) {
    return this.dirty == be && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Sh extends Qn {
  constructor(e, t, r, s) {
    super(e, [], t, null), this.textDOM = r, this.text = s;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class Pt extends Qn {
  constructor(e, t, r, s) {
    super(e, [], r, s), this.mark = t;
  }
  static create(e, t, r, s) {
    let i = s.nodeViews[t.type.name], o = i && i(t, s, r);
    return (!o || !o.dom) && (o = Ie.renderSpec(document, t.type.spec.toDOM(t, r))), new Pt(e, t, o.dom, o.contentDOM || o.dom);
  }
  parseRule() {
    return this.dirty & $e || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != $e && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != be) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = be;
    }
  }
  slice(e, t, r) {
    let s = Pt.create(this.parent, this.mark, !0, r), i = this.children, o = this.size;
    t < o && (i = Ni(i, t, o, r)), e > 0 && (i = Ni(i, 0, e, r));
    for (let l = 0; l < i.length; l++)
      i[l].parent = s;
    return s.children = i, s;
  }
}
class at extends Qn {
  constructor(e, t, r, s, i, o, l, a, c) {
    super(e, [], i, o), this.node = t, this.outerDeco = r, this.innerDeco = s, this.nodeDOM = l;
  }
  // By default, a node is rendered using the `toDOM` method from the
  // node type spec. But client code can use the `nodeViews` spec to
  // supply a custom node view, which can influence various aspects of
  // the way the node works.
  //
  // (Using subclassing for this was intentionally decided against,
  // since it'd require exposing a whole slew of finicky
  // implementation details to the user code that they probably will
  // never need.)
  static create(e, t, r, s, i, o) {
    let l = i.nodeViews[t.type.name], a, c = l && l(t, i, () => {
      if (!a)
        return o;
      if (a.parent)
        return a.parent.posBeforeChild(a);
    }, r, s), d = c && c.dom, u = c && c.contentDOM;
    if (t.isText) {
      if (!d)
        d = document.createTextNode(t.text);
      else if (d.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else d || ({ dom: d, contentDOM: u } = Ie.renderSpec(document, t.type.spec.toDOM(t)));
    !u && !t.isText && d.nodeName != "BR" && (d.hasAttribute("contenteditable") || (d.contentEditable = "false"), t.type.spec.draggable && (d.draggable = !0));
    let h = d;
    return d = wc(d, r, t), c ? a = new Ch(e, t, r, s, d, u || null, h, c, i, o + 1) : t.isText ? new As(e, t, r, s, d, h, i) : new at(e, t, r, s, d, u || null, h, i, o + 1);
  }
  parseRule() {
    if (this.node.type.spec.reparseInView)
      return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM)
      e.getContent = () => this.node.content;
    else if (!this.contentLost)
      e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => b.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == be && e.eq(this.node) && Oi(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  // Syncs `this.children` to match `this.node.content` and the local
  // decorations, possibly introducing nesting for marks. Then, in a
  // separate step, syncs the DOM inside `this.contentDOM` to
  // `this.children`.
  updateChildren(e, t) {
    let r = this.node.inlineContent, s = t, i = e.composing ? this.localCompositionInfo(e, t) : null, o = i && i.pos > -1 ? i : null, l = i && i.pos < 0, a = new Th(this, o && o.node, e);
    vh(this.node, this.innerDeco, (c, d, u) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e) : c.type.side >= 0 && !u && a.syncToMarks(d == this.node.childCount ? L.none : this.node.child(d).marks, r, e), a.placeWidget(c, e, s);
    }, (c, d, u, h) => {
      a.syncToMarks(c.marks, r, e);
      let f;
      a.findNodeMatch(c, d, u, h) || l && e.state.selection.from > s && e.state.selection.to < s + c.nodeSize && (f = a.findIndexWithChild(i.node)) > -1 && a.updateNodeAt(c, d, u, f, e) || a.updateNextNode(c, d, u, e, h, s) || a.addNode(c, d, u, e, s), s += c.nodeSize;
    }), a.syncToMarks([], r, e), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == St) && (o && this.protectLocalComposition(e, o), bc(this.contentDOM, this.children, e), on && Oh(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: s } = e.state.selection;
    if (!(e.state.selection instanceof A) || r < t || s > t + this.node.content.size)
      return null;
    let i = e.input.compositionNode;
    if (!i || !this.dom.contains(i.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = i.nodeValue, l = Nh(this.node.content, o, r - t, s - t);
      return l < 0 ? null : { node: i, pos: l, text: o };
    } else
      return { node: i, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: s }) {
    if (this.getDesc(t))
      return;
    let i = t;
    for (; i.parentNode != this.contentDOM; i = i.parentNode) {
      for (; i.previousSibling; )
        i.parentNode.removeChild(i.previousSibling);
      for (; i.nextSibling; )
        i.parentNode.removeChild(i.nextSibling);
      i.pmViewDesc && (i.pmViewDesc = void 0);
    }
    let o = new Sh(this, i, t, s);
    e.input.compositionNodes.push(o), this.children = Ni(this.children, r, r + s.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, s) {
    return this.dirty == $e || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, s), !0);
  }
  updateInner(e, t, r, s) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(s, this.posAtStart), this.dirty = be;
  }
  updateOuterDeco(e) {
    if (Oi(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = kc(this.dom, this.nodeDOM, vi(this.outerDeco, this.node, t), vi(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  // Mark this node as being the selected node.
  selectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.dom.draggable = !0);
  }
  // Remove selected node marking from this node.
  deselectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.dom.removeAttribute("draggable"));
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function al(n, e, t, r, s) {
  wc(r, e, n);
  let i = new at(void 0, n, e, t, r, r, r, s, 0);
  return i.contentDOM && i.updateChildren(s, 0), i;
}
class As extends at {
  constructor(e, t, r, s, i, o, l) {
    super(e, t, r, s, i, null, o, l, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, s) {
    return this.dirty == $e || this.dirty != be && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != be || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, s.trackWrites == this.nodeDOM && (s.trackWrites = null)), this.node = e, this.dirty = be, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let s = this.node.cut(e, t), i = document.createTextNode(s.text);
    return new As(this.parent, s, this.outerDeco, this.innerDeco, i, i, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = $e);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class yc extends Qn {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == be && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Ch extends at {
  constructor(e, t, r, s, i, o, l, a, c, d) {
    super(e, t, r, s, i, o, l, c, d), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, s) {
    if (this.dirty == $e)
      return !1;
    if (this.spec.update) {
      let i = this.spec.update(e, t, r);
      return i && this.updateInner(e, t, r, s), i;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, s);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, s) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r) : super.setSelection(e, t, r, s);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function bc(n, e, t) {
  let r = n.firstChild, s = !1;
  for (let i = 0; i < e.length; i++) {
    let o = e[i], l = o.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = cl(r), s = !0;
      r = r.nextSibling;
    } else
      s = !0, n.insertBefore(l, r);
    if (o instanceof Pt) {
      let a = r ? r.previousSibling : n.lastChild;
      bc(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = cl(r), s = !0;
  s && t.trackWrites == n && (t.trackWrites = null);
}
const An = function(n) {
  n && (this.nodeName = n);
};
An.prototype = /* @__PURE__ */ Object.create(null);
const Ct = [new An()];
function vi(n, e, t) {
  if (n.length == 0)
    return Ct;
  let r = t ? Ct[0] : new An(), s = [r];
  for (let i = 0; i < n.length; i++) {
    let o = n[i].type.attrs;
    if (o) {
      o.nodeName && s.push(r = new An(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && s.length == 1 && s.push(r = new An(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return s;
}
function kc(n, e, t, r) {
  if (t == Ct && r == Ct)
    return e;
  let s = e;
  for (let i = 0; i < r.length; i++) {
    let o = r[i], l = t[i];
    if (i) {
      let a;
      l && l.nodeName == o.nodeName && s != n && (a = s.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(s), l = Ct[0]), s = a;
    }
    Mh(s, l || Ct[0], o);
  }
  return s;
}
function Mh(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], s = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let i = 0; i < r.length; i++)
      s.indexOf(r[i]) == -1 && n.classList.remove(r[i]);
    for (let i = 0; i < s.length; i++)
      r.indexOf(s[i]) == -1 && n.classList.add(s[i]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, s;
      for (; s = r.exec(e.style); )
        n.style.removeProperty(s[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function wc(n, e, t) {
  return kc(n, n, Ct, vi(e, t, n.nodeType != 1));
}
function Oi(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function cl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Th {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Ah(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, t, r) {
    let s = 0, i = this.stack.length >> 1, o = Math.min(i, e.length);
    for (; s < o && (s == i - 1 ? this.top : this.stack[s + 1 << 1]).matchesMark(e[s]) && e[s].type.spec.spanning !== !1; )
      s++;
    for (; s < i; )
      this.destroyRest(), this.top.dirty = be, this.index = this.stack.pop(), this.top = this.stack.pop(), i--;
    for (; i < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1;
      for (let a = this.index; a < Math.min(this.index + 3, this.top.children.length); a++) {
        let c = this.top.children[a];
        if (c.matchesMark(e[i]) && !this.isLocked(c.dom)) {
          l = a;
          break;
        }
      }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let a = Pt.create(this.top, e[i], t, r);
        this.top.children.splice(this.index, 0, a), this.top = a, this.changed = !0;
      }
      this.index = 0, i++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, s) {
    let i = -1, o;
    if (s >= this.preMatch.index && (o = this.preMatch.matches[s - this.preMatch.index]).parent == this.top && o.matchesNode(e, t, r))
      i = this.top.children.indexOf(o, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          i = l;
          break;
        }
      }
    return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
  }
  updateNodeAt(e, t, r, s, i) {
    let o = this.top.children[s];
    return o.dirty == $e && o.dom == o.contentDOM && (o.dirty = St), o.update(e, t, r, i) ? (this.destroyBetween(this.index, s), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let s = this.index; s < this.top.children.length; s++)
            if (this.top.children[s] == r)
              return s;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, s, i, o) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof at) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != i)
          return !1;
        let d = a.dom, u, h = this.isLocked(d) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != $e && Oi(t, a.outerDeco));
        if (!h && a.update(e, t, r, s))
          return this.destroyBetween(this.index, l), a.dom != d && (this.changed = !0), this.index++, !0;
        if (!h && (u = this.recreateWrapper(a, e, t, r, s, o)))
          return this.top.children[this.index] = u, u.contentDOM && (u.dirty = St, u.updateChildren(s, o + 1), u.dirty = be), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, s, i, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content))
      return null;
    let l = at.create(this.top, t, r, s, i, o);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, s, i) {
    let o = at.create(this.top, e, t, r, s, i);
    o.contentDOM && o.updateChildren(s, i + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let s = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (s && s.matchesWidget(e) && (e == s.widget || !s.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let i = new gc(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Pt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof As) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((re || ne) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let s = new yc(this.top, [], r, null);
      t != this.top ? t.children.push(s) : t.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Ah(n, e) {
  let t = e, r = t.children.length, s = n.childCount, i = /* @__PURE__ */ new Map(), o = [];
  e: for (; s > 0; ) {
    let l;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof Pt)
          t = c, r = c.children.length;
        else {
          l = c, r--;
          break;
        }
      } else {
        if (t == e)
          break e;
        r = t.parent.children.indexOf(t), t = t.parent;
      }
    let a = l.node;
    if (a) {
      if (a != n.child(s - 1))
        break;
      --s, i.set(l, s), o.push(l);
    }
  }
  return { index: s, matched: i, matches: o.reverse() };
}
function Eh(n, e) {
  return n.type.side - e.type.side;
}
function vh(n, e, t, r) {
  let s = e.locals(n), i = 0;
  if (s.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let d = n.child(c);
      r(d, s, e.forChild(i, d), c), i += d.nodeSize;
    }
    return;
  }
  let o = 0, l = [], a = null;
  for (let c = 0; ; ) {
    let d, u;
    for (; o < s.length && s[o].to == i; ) {
      let g = s[o++];
      g.widget && (d ? (u || (u = [d])).push(g) : d = g);
    }
    if (d)
      if (u) {
        u.sort(Eh);
        for (let g = 0; g < u.length; g++)
          t(u[g], c, !!a);
      } else
        t(d, c, !!a);
    let h, f;
    if (a)
      f = -1, h = a, a = null;
    else if (c < n.childCount)
      f = c, h = n.child(c++);
    else
      break;
    for (let g = 0; g < l.length; g++)
      l[g].to <= i && l.splice(g--, 1);
    for (; o < s.length && s[o].from <= i && s[o].to > i; )
      l.push(s[o++]);
    let p = i + h.nodeSize;
    if (h.isText) {
      let g = p;
      o < s.length && s[o].from < g && (g = s[o].from);
      for (let y = 0; y < l.length; y++)
        l[y].to < g && (g = l[y].to);
      g < p && (a = h.cut(g - i), h = h.cut(0, g - i), p = g, f = -1);
    } else
      for (; o < s.length && s[o].to < p; )
        o++;
    let m = h.isInline && !h.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(h, m, e.forChild(i, h), f), i = p;
  }
}
function Oh(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Nh(n, e, t, r) {
  for (let s = 0, i = 0; s < n.childCount && i <= r; ) {
    let o = n.child(s++), l = i;
    if (i += o.nodeSize, !o.isText)
      continue;
    let a = o.text;
    for (; s < n.childCount; ) {
      let c = n.child(s++);
      if (i += c.nodeSize, !c.isText)
        break;
      a += c.text;
    }
    if (i >= t) {
      if (i >= r && a.slice(r - e.length - l, r - l) == e)
        return r - e.length;
      let c = l < r ? a.lastIndexOf(e, r - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t)
        return l + c;
      if (t == r && a.length >= r + e.length - l && a.slice(r - l, r - l + e.length) == e)
        return r;
    }
  }
  return -1;
}
function Ni(n, e, t, r, s) {
  let i = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, d = l += a.size;
    c >= t || d <= e ? i.push(a) : (c < e && i.push(a.slice(0, e - c, r)), s && (i.push(s), s = void 0), d > t && i.push(a.slice(t - c, a.size, r)));
  }
  return i;
}
function io(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let s = n.docView.nearestDesc(t.focusNode), i = s && s.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (Ts(t)) {
    for (a = l; s && !s.node; )
      s = s.parent;
    let d = s.node;
    if (s && d.isAtom && T.isSelectable(d) && s.parent && !(d.isInline && th(t.focusNode, t.focusOffset, s.dom))) {
      let u = s.posBefore;
      c = new T(o == u ? l : r.resolve(u));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0)
      return null;
    a = r.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < l.pos && !i ? 1 : -1;
    c = oo(n, a, l, d);
  }
  return c;
}
function xc(n) {
  return n.editable ? n.hasFocus() : Cc(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Ue(n, e = !1) {
  let t = n.state.selection;
  if (Sc(n, t), !!xc(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && ne) {
      let r = n.domSelectionRange(), s = n.domObserver.currentSelection;
      if (r.anchorNode && s.anchorNode && Lt(r.anchorNode, r.anchorOffset, s.anchorNode, s.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      Dh(n);
    else {
      let { anchor: r, head: s } = t, i, o;
      dl && !(t instanceof A) && (t.$from.parent.inlineContent || (i = ul(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = ul(n, t.to))), n.docView.setSelection(r, s, n.root, e), dl && (i && hl(i), o && hl(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Rh(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const dl = re || ne && sh < 63;
function ul(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), s = r < t.childNodes.length ? t.childNodes[r] : null, i = r ? t.childNodes[r - 1] : null;
  if (re && s && s.contentEditable == "false")
    return Xs(s);
  if ((!s || s.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (s)
      return Xs(s);
    if (i)
      return Xs(i);
  }
}
function Xs(n) {
  return n.contentEditable = "true", re && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function hl(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Rh(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, s = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != s) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!xc(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Dh(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, s = r.nodeName == "IMG";
  s ? t.setEnd(r.parentNode, G(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !s && !n.state.selection.visible && ae && lt <= 11 && (r.disabled = !0, r.disabled = !1);
}
function Sc(n, e) {
  if (e instanceof T) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (fl(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    fl(n);
}
function fl(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function oo(n, e, t, r) {
  return n.someProp("createSelectionBetween", (s) => s(n, e, t)) || A.between(e, t, r);
}
function pl(n) {
  return n.editable && !n.hasFocus() ? !1 : Cc(n);
}
function Cc(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Ih(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Lt(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ri(n, e) {
  let { $anchor: t, $head: r } = n.selection, s = e > 0 ? t.max(r) : t.min(r), i = s.parent.inlineContent ? s.depth ? n.doc.resolve(e > 0 ? s.after() : s.before()) : null : s;
  return i && E.findFrom(i, e);
}
function Ye(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function ml(n, e, t) {
  let r = n.state.selection;
  if (r instanceof A)
    if (t.indexOf("s") > -1) {
      let { $head: s } = r, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter;
      if (!i || i.isText || !i.isLeaf)
        return !1;
      let o = n.state.doc.resolve(s.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return Ye(n, new A(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let s = Ri(n.state, e);
        return s && s instanceof T ? Ye(n, s) : !1;
      } else if (!(ge && t.indexOf("m") > -1)) {
        let s = r.$head, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter, o;
        if (!i || i.isText)
          return !1;
        let l = e < 0 ? s.pos - i.nodeSize : s.pos;
        return i.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? T.isSelectable(i) ? Ye(n, new T(e < 0 ? n.state.doc.resolve(s.pos - i.nodeSize) : s)) : Xn ? Ye(n, new A(n.state.doc.resolve(e < 0 ? l : l + i.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof T && r.node.isInline)
      return Ye(n, new A(e > 0 ? r.$to : r.$from));
    {
      let s = Ri(n.state, e);
      return s ? Ye(n, s) : !1;
    }
  }
}
function Pr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function En(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function _t(n, e) {
  return e < 0 ? Lh(n) : Ph(n);
}
function Lh(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let s, i, o = !1;
  for (Ce && t.nodeType == 1 && r < Pr(t) && En(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (En(l, -1))
          s = t, i = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (Mc(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && En(l, -1); )
          s = t.parentNode, i = G(l), l = l.previousSibling;
        if (l)
          t = l, r = Pr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Di(n, t, r) : s && Di(n, s, i);
}
function Ph(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let s = Pr(t), i, o;
  for (; ; )
    if (r < s) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (En(l, 1))
        i = t, o = ++r;
      else
        break;
    } else {
      if (Mc(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && En(l, 1); )
          i = l.parentNode, o = G(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, s = Pr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = s = 0;
        }
      }
    }
  i && Di(n, i, o);
}
function Mc(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function $h(n, e) {
  for (; n && e == n.childNodes.length && !Yn(n); )
    e = G(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function Bh(n, e) {
  for (; n && !e && !Yn(n); )
    e = G(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Di(n, e, t) {
  if (e.nodeType != 3) {
    let i, o;
    (o = $h(e, t)) ? (e = o, t = 0) : (i = Bh(e, t)) && (e = i, t = i.nodeValue.length);
  }
  let r = n.domSelection();
  if (Ts(r)) {
    let i = document.createRange();
    i.setEnd(e, t), i.setStart(e, t), r.removeAllRanges(), r.addRange(i);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: s } = n;
  setTimeout(() => {
    n.state == s && Ue(n);
  }, 50);
}
function gl(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(ne || ih) && t.parent.inlineContent) {
    let s = n.coordsAtPos(e);
    if (e > t.start()) {
      let i = n.coordsAtPos(e - 1), o = (i.top + i.bottom) / 2;
      if (o > s.top && o < s.bottom && Math.abs(i.left - s.left) > 1)
        return i.left < s.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let i = n.coordsAtPos(e + 1), o = (i.top + i.bottom) / 2;
      if (o > s.top && o < s.bottom && Math.abs(i.left - s.left) > 1)
        return i.left > s.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function yl(n, e, t) {
  let r = n.state.selection;
  if (r instanceof A && !r.empty || t.indexOf("s") > -1 || ge && t.indexOf("m") > -1)
    return !1;
  let { $from: s, $to: i } = r;
  if (!s.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Ri(n.state, e);
    if (o && o instanceof T)
      return Ye(n, o);
  }
  if (!s.parent.inlineContent) {
    let o = e < 0 ? s : i, l = r instanceof Se ? E.near(o, e) : E.findFrom(o, e);
    return l ? Ye(n, l) : !1;
  }
  return !1;
}
function bl(n, e) {
  if (!(n.state.selection instanceof A))
    return !0;
  let { $head: t, $anchor: r, empty: s } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!s)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let i = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (i && !i.isText) {
    let o = n.state.tr;
    return e < 0 ? o.delete(t.pos - i.nodeSize, t.pos) : o.delete(t.pos, t.pos + i.nodeSize), n.dispatch(o), !0;
  }
  return !1;
}
function kl(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function zh(n) {
  if (!re || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    kl(n, r, "true"), setTimeout(() => kl(n, r, "false"), 20);
  }
  return !1;
}
function Hh(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function Fh(n, e) {
  let t = e.keyCode, r = Hh(e);
  if (t == 8 || ge && t == 72 && r == "c")
    return bl(n, -1) || _t(n, -1);
  if (t == 46 && !e.shiftKey || ge && t == 68 && r == "c")
    return bl(n, 1) || _t(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || ge && t == 66 && r == "c") {
    let s = t == 37 ? gl(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return ml(n, s, r) || _t(n, s);
  } else if (t == 39 || ge && t == 70 && r == "c") {
    let s = t == 39 ? gl(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return ml(n, s, r) || _t(n, s);
  } else {
    if (t == 38 || ge && t == 80 && r == "c")
      return yl(n, -1, r) || _t(n, -1);
    if (t == 40 || ge && t == 78 && r == "c")
      return zh(n) || yl(n, 1, r) || _t(n, 1);
    if (r == (ge ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Tc(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [], { content: r, openStart: s, openEnd: i } = e;
  for (; s > 1 && i > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    s--, i--;
    let f = r.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), r = f.content;
  }
  let o = n.someProp("clipboardSerializer") || Ie.fromSchema(n.state.schema), l = Rc(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, d, u = 0;
  for (; c && c.nodeType == 1 && (d = Nc[c.nodeName.toLowerCase()]); ) {
    for (let f = d.length - 1; f >= 0; f--) {
      let p = l.createElement(d[f]);
      for (; a.firstChild; )
        p.appendChild(a.firstChild);
      a.appendChild(p), u++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${s} ${i}${u ? ` -${u}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (f) => f(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: h, slice: e };
}
function Ac(n, e, t, r, s) {
  let i = s.parent.type.spec.code, o, l;
  if (!t && !e)
    return null;
  let a = e && (r || i || !t);
  if (a) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, i || r, n);
    }), i)
      return e ? new x(b.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : x.empty;
    let u = n.someProp("clipboardTextParser", (h) => h(e, s, r, n));
    if (u)
      l = u;
    else {
      let h = s.marks(), { schema: f } = n.state, p = Ie.fromSchema(f);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(f.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (u) => {
      t = u(t, n);
    }), o = Wh(t), Xn && jh(o);
  let c = o && o.querySelector("[data-pm-slice]"), d = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (d && d[3])
    for (let u = +d[3]; u > 0; u--) {
      let h = o.firstChild;
      for (; h && h.nodeType != 1; )
        h = h.nextSibling;
      if (!h)
        break;
      o = h;
    }
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || nn.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || d),
    context: s,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !Vh.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), d)
    l = Uh(wl(l, +d[1], +d[2]), d[4]);
  else if (l = x.maxOpen(_h(l.content, s), !0), l.openStart || l.openEnd) {
    let u = 0, h = 0;
    for (let f = l.content.firstChild; u < l.openStart && !f.type.spec.isolating; u++, f = f.firstChild)
      ;
    for (let f = l.content.lastChild; h < l.openEnd && !f.type.spec.isolating; h++, f = f.lastChild)
      ;
    l = wl(l, u, h);
  }
  return n.someProp("transformPasted", (u) => {
    l = u(l, n);
  }), l;
}
const Vh = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function _h(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let s = e.node(t).contentMatchAt(e.index(t)), i, o = [];
    if (n.forEach((l) => {
      if (!o)
        return;
      let a = s.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && i.length && vc(a, i, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Oc(o[o.length - 1], i.length));
        let d = Ec(l, a);
        o.push(d), s = s.matchType(d.type), i = a;
      }
    }), o)
      return b.from(o);
  }
  return n;
}
function Ec(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, b.from(n));
  return n;
}
function vc(n, e, t, r, s) {
  if (s < n.length && s < e.length && n[s] == e[s]) {
    let i = vc(n, e, t, r.lastChild, s + 1);
    if (i)
      return r.copy(r.content.replaceChild(r.childCount - 1, i));
    if (r.contentMatchAt(r.childCount).matchType(s == n.length - 1 ? t.type : n[s + 1]))
      return r.copy(r.content.append(b.from(Ec(t, n, s + 1))));
  }
}
function Oc(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, Oc(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(b.empty, !0);
  return n.copy(t.append(r));
}
function Ii(n, e, t, r, s, i) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return n.childCount > 1 && (i = 0), s < r - 1 && (l = Ii(l, e, t, r, s + 1, i)), s >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, i <= s).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(b.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function wl(n, e, t) {
  return e < n.openStart && (n = new x(Ii(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new x(Ii(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Nc = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
let xl = null;
function Rc() {
  return xl || (xl = document.implementation.createHTMLDocument("title"));
}
function Wh(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Rc().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), s;
  if ((s = r && Nc[r[1].toLowerCase()]) && (n = s.map((i) => "<" + i + ">").join("") + n + s.map((i) => "</" + i + ">").reverse().join("")), t.innerHTML = n, s)
    for (let i = 0; i < s.length; i++)
      t = t.querySelector(s[i]) || t;
  return t;
}
function jh(n) {
  let e = n.querySelectorAll(ne ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Uh(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: s, openStart: i, openEnd: o } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    s = b.from(a.create(r[l + 1], s)), i++, o++;
  }
  return new x(s, i, o);
}
const se = {}, ie = {}, Kh = { touchstart: !0, touchmove: !0 };
class Jh {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function qh(n) {
  for (let e in se) {
    let t = se[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Yh(n, r) && !lo(n, r) && (n.editable || !(r.type in ie)) && t(n, r);
    }, Kh[e] ? { passive: !0 } : void 0);
  }
  re && n.dom.addEventListener("input", () => null), Li(n);
}
function ot(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Gh(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Li(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => lo(n, r));
  });
}
function lo(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Yh(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Xh(n, e) {
  !lo(n, e) && se[e.type] && (n.editable || !(e.type in ie)) && se[e.type](n, e);
}
ie.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Ic(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(we && ne && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), on && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (s) => s(n, wt(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || Fh(n, t) ? t.preventDefault() : ot(n, "key");
};
ie.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
ie.keypress = (n, e) => {
  let t = e;
  if (Ic(n, t) || !t.charCode || t.ctrlKey && !t.altKey || ge && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (s) => s(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof A) || !r.$from.sameParent(r.$to)) {
    let s = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(s) && !n.someProp("handleTextInput", (i) => i(n, r.$from.pos, r.$to.pos, s)) && n.dispatch(n.state.tr.insertText(s).scrollIntoView()), t.preventDefault();
  }
};
function Es(n) {
  return { left: n.clientX, top: n.clientY };
}
function Qh(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function ao(n, e, t, r, s) {
  if (r == -1)
    return !1;
  let i = n.state.doc.resolve(r);
  for (let o = i.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > i.depth ? l(n, t, i.nodeAfter, i.before(o), s, !0) : l(n, t, i.node(o), i.before(o), s, !1)))
      return !0;
  return !1;
}
function Zt(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function Zh(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && T.isSelectable(r) ? (Zt(n, new T(t)), !0) : !1;
}
function ef(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, s;
  t instanceof T && (r = t.node);
  let i = n.state.doc.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let l = o > i.depth ? i.nodeAfter : i.node(o);
    if (T.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && i.before(t.$from.depth + 1) == t.$from.pos ? s = i.before(t.$from.depth) : s = i.before(o);
      break;
    }
  }
  return s != null ? (Zt(n, T.create(n.state.doc, s)), !0) : !1;
}
function tf(n, e, t, r, s) {
  return ao(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (i) => i(n, e, r)) || (s ? ef(n, t) : Zh(n, t));
}
function nf(n, e, t, r) {
  return ao(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (s) => s(n, e, r));
}
function rf(n, e, t, r) {
  return ao(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (s) => s(n, e, r)) || sf(n, t, r);
}
function sf(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Zt(n, A.create(r, 0, r.content.size)), !0) : !1;
  let s = r.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let o = i > s.depth ? s.nodeAfter : s.node(i), l = s.before(i);
    if (o.inlineContent)
      Zt(n, A.create(r, l + 1, l + 1 + o.content.size));
    else if (T.isSelectable(o))
      Zt(n, T.create(r, l));
    else
      continue;
    return !0;
  }
}
function co(n) {
  return $r(n);
}
const Dc = ge ? "metaKey" : "ctrlKey";
se.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = co(n), s = Date.now(), i = "singleClick";
  s - n.input.lastClick.time < 500 && Qh(t, n.input.lastClick) && !t[Dc] && (n.input.lastClick.type == "singleClick" ? i = "doubleClick" : n.input.lastClick.type == "doubleClick" && (i = "tripleClick")), n.input.lastClick = { time: s, x: t.clientX, y: t.clientY, type: i };
  let o = n.posAtCoords(Es(t));
  o && (i == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new of(n, o, t, !!r)) : (i == "doubleClick" ? nf : rf)(n, o.pos, o.inside, t) ? t.preventDefault() : ot(n, "pointer"));
};
class of {
  constructor(e, t, r, s) {
    this.view = e, this.pos = t, this.event = r, this.flushed = s, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Dc], this.allowDefault = r.shiftKey;
    let i, o;
    if (t.inside > -1)
      i = e.state.doc.nodeAt(t.inside), o = t.inside;
    else {
      let d = e.state.doc.resolve(t.pos);
      i = d.parent, o = d.depth ? d.before() : 0;
    }
    const l = s ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a && a.dom.nodeType == 1 ? a.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof T && c.from <= o && c.to > o) && (this.mightDrag = {
      node: i,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Ce && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), ot(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Ue(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Es(e))), this.updateAllowDefault(e), this.allowDefault || !t ? ot(this.view, "pointer") : tf(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    re && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    ne && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Zt(this.view, E.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : ot(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), ot(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
se.touchstart = (n) => {
  n.input.lastTouch = Date.now(), co(n), ot(n, "pointer");
};
se.touchmove = (n) => {
  n.input.lastTouch = Date.now(), ot(n, "pointer");
};
se.contextmenu = (n) => co(n);
function Ic(n, e) {
  return n.composing ? !0 : re && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const lf = we ? 5e3 : -1;
ie.compositionstart = ie.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), $r(n, !0), n.markCursor = null;
    else if ($r(n), Ce && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let s = r.focusNode, i = r.focusOffset; s && s.nodeType == 1 && i != 0; ) {
        let o = i < 0 ? s.lastChild : s.childNodes[i - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          n.domSelection().collapse(o, o.nodeValue.length);
          break;
        } else
          s = o, i = -1;
      }
    }
    n.input.composing = !0;
  }
  Lc(n, lf);
};
ie.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Lc(n, 20));
};
function Lc(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => $r(n), e));
}
function Pc(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = cf()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function af(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Zu(e.focusNode, e.focusOffset), r = eh(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let s = r.pmViewDesc, i = n.domObserver.lastChangedTextNode;
    if (t == i || r == i)
      return i;
    if (!s || !s.isText(r.nodeValue))
      return r;
    if (n.input.compositionNode == r) {
      let o = t.pmViewDesc;
      if (!(!o || !o.isText(t.nodeValue)))
        return r;
    }
  }
  return t || r;
}
function cf() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function $r(n, e = !1) {
  if (!(we && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Pc(n), e || n.docView && n.docView.dirty) {
      let t = io(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function df(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), s = document.createRange();
  s.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(s), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Bn = ae && lt < 15 || on && oh < 604;
se.copy = ie.cut = (n, e) => {
  let t = e, r = n.state.selection, s = t.type == "cut";
  if (r.empty)
    return;
  let i = Bn ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = Tc(n, o);
  i ? (t.preventDefault(), i.clearData(), i.setData("text/html", l.innerHTML), i.setData("text/plain", a)) : df(n, l), s && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function uf(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function hf(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let s = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? zn(n, r.value, null, s, e) : zn(n, r.textContent, r.innerHTML, s, e);
  }, 50);
}
function zn(n, e, t, r, s) {
  let i = Ac(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, s, i || x.empty)))
    return !0;
  if (!i)
    return !1;
  let o = uf(i), l = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(i);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function $c(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
ie.paste = (n, e) => {
  let t = e;
  if (n.composing && !we)
    return;
  let r = Bn ? null : t.clipboardData, s = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && zn(n, $c(r), r.getData("text/html"), s, t) ? t.preventDefault() : hf(n, t);
};
class Bc {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const zc = ge ? "altKey" : "ctrlKey";
se.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let s = n.state.selection, i = s.empty ? null : n.posAtCoords(Es(t)), o;
  if (!(i && i.pos >= s.from && i.pos <= (s instanceof T ? s.to - 1 : s.to))) {
    if (r && r.mightDrag)
      o = T.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let u = n.docView.nearestDesc(t.target, !0);
      u && u.node.type.spec.draggable && u != n.docView && (o = T.create(n.state.doc, u.posBefore));
    }
  }
  let l = (o || n.state.selection).content(), { dom: a, text: c, slice: d } = Tc(n, l);
  t.dataTransfer.clearData(), t.dataTransfer.setData(Bn ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Bn || t.dataTransfer.setData("text/plain", c), n.dragging = new Bc(d, !t[zc], o);
};
se.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
ie.dragover = ie.dragenter = (n, e) => e.preventDefault();
ie.drop = (n, e) => {
  let t = e, r = n.dragging;
  if (n.dragging = null, !t.dataTransfer)
    return;
  let s = n.posAtCoords(Es(t));
  if (!s)
    return;
  let i = n.state.doc.resolve(s.pos), o = r && r.slice;
  o ? n.someProp("transformPasted", (p) => {
    o = p(o, n);
  }) : o = Ac(n, $c(t.dataTransfer), Bn ? null : t.dataTransfer.getData("text/html"), !1, i);
  let l = !!(r && !t[zc]);
  if (n.someProp("handleDrop", (p) => p(n, t, o || x.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!o)
    return;
  t.preventDefault();
  let a = o ? tc(n.state.doc, i.pos, o) : i.pos;
  a == null && (a = i.pos);
  let c = n.state.tr;
  if (l) {
    let { node: p } = r;
    p ? p.replace(c) : c.deleteSelection();
  }
  let d = c.mapping.map(a), u = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, h = c.doc;
  if (u ? c.replaceRangeWith(d, d, o.content.firstChild) : c.replaceRange(d, d, o), c.doc.eq(h))
    return;
  let f = c.doc.resolve(d);
  if (u && T.isSelectable(o.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new T(f));
  else {
    let p = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, g, y, k) => p = k), c.setSelection(oo(n, f, c.doc.resolve(p)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
se.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Ue(n);
  }, 20));
};
se.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
se.beforeinput = (n, e) => {
  if (ne && we && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (i) => i(n, wt(8, "Backspace")))))
        return;
      let { $cursor: s } = n.state.selection;
      s && s.pos > 0 && n.dispatch(n.state.tr.delete(s.pos - 1, s.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in ie)
  se[n] = ie[n];
function Hn(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class Br {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Nt, this.side = this.spec.side || 0;
  }
  map(e, t, r, s) {
    let { pos: i, deleted: o } = e.mapResult(t.from + s, this.side < 0 ? -1 : 1);
    return o ? null : new le(i - r, i - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof Br && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Hn(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class ct {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Nt;
  }
  map(e, t, r, s) {
    let i = e.map(t.from + s, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + s, this.spec.inclusiveEnd ? 1 : -1) - r;
    return i >= o ? null : new le(i, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof ct && Hn(this.attrs, e.attrs) && Hn(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof ct;
  }
  destroy() {
  }
}
class uo {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Nt;
  }
  map(e, t, r, s) {
    let i = e.mapResult(t.from + s, 1);
    if (i.deleted)
      return null;
    let o = e.mapResult(t.to + s, -1);
    return o.deleted || o.pos <= i.pos ? null : new le(i.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: s } = e.content.findIndex(t.from), i;
    return s == t.from && !(i = e.child(r)).isText && s + i.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof uo && Hn(this.attrs, e.attrs) && Hn(this.spec, e.spec);
  }
  destroy() {
  }
}
class le {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  /**
  @internal
  */
  copy(e, t) {
    return new le(e, t, this.type);
  }
  /**
  @internal
  */
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  /**
  @internal
  */
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, t, r) {
    return new le(e, e, new Br(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, s) {
    return new le(e, t, new ct(r, s));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, s) {
    return new le(e, t, new uo(r, s));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof ct;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof Br;
  }
}
const Ut = [], Nt = {};
class z {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Ut, this.children = t.length ? t : Ut;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? zr(t, e, 0, Nt) : Z;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, t, r) {
    let s = [];
    return this.findInner(e ?? 0, t ?? 1e9, s, 0, r), s;
  }
  findInner(e, t, r, s, i) {
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      l.from <= t && l.to >= e && (!i || i(l.spec)) && r.push(l.copy(l.from + s, l.to + s));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < t && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, t - l, r, s + l, i);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Z || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Nt);
  }
  /**
  @internal
  */
  mapInner(e, t, r, s, i) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, s);
      a && a.type.valid(t, a) ? (o || (o = [])).push(a) : i.onRemove && i.onRemove(this.local[l].spec);
    }
    return this.children.length ? ff(this.children, o || [], e, t, r, s, i) : o ? new z(o.sort(Rt), Ut) : Z;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Z ? z.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let s, i = 0;
    e.forEach((l, a) => {
      let c = a + r, d;
      if (d = Fc(t, l, c)) {
        for (s || (s = this.children.slice()); i < s.length && s[i] < a; )
          i += 3;
        s[i] == a ? s[i + 2] = s[i + 2].addInner(l, d, c + 1) : s.splice(i, 0, a, a + l.nodeSize, zr(d, l, c + 1, Nt)), i += 3;
      }
    });
    let o = Hc(i ? Vc(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new z(o.length ? this.local.concat(o).sort(Rt) : this.local, s || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Z ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, s = this.local;
    for (let i = 0; i < r.length; i += 3) {
      let o, l = r[i] + t, a = r[i + 1] + t;
      for (let d = 0, u; d < e.length; d++)
        (u = e[d]) && u.from > l && u.to < a && (e[d] = null, (o || (o = [])).push(u));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[i + 2].removeInner(o, l + 1);
      c != Z ? r[i + 2] = c : (r.splice(i, 3), i -= 3);
    }
    if (s.length) {
      for (let i = 0, o; i < e.length; i++)
        if (o = e[i])
          for (let l = 0; l < s.length; l++)
            s[l].eq(o, t) && (s == this.local && (s = this.local.slice()), s.splice(l--, 1));
    }
    return r == this.children && s == this.local ? this : s.length || r.length ? new z(s, r) : Z;
  }
  forChild(e, t) {
    if (this == Z)
      return this;
    if (t.isLeaf)
      return z.empty;
    let r, s;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let i = e + 1, o = i + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > i && a.type instanceof ct) {
        let c = Math.max(i, a.from) - i, d = Math.min(o, a.to) - i;
        c < d && (s || (s = [])).push(a.copy(c, d));
      }
    }
    if (s) {
      let l = new z(s.sort(Rt), Ut);
      return r ? new Ze([l, r]) : l;
    }
    return r || Z;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof z) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return ho(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Z)
      return Ut;
    if (e.inlineContent || !this.local.some(ct.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof ct || t.push(this.local[r]);
    return t;
  }
}
z.empty = new z([], []);
z.removeOverlap = ho;
const Z = z.empty;
class Ze {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((s) => s.map(e, t, Nt));
    return Ze.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return z.empty;
    let r = [];
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].forChild(e, t);
      i != Z && (i instanceof Ze ? r = r.concat(i.members) : r.push(i));
    }
    return Ze.from(r);
  }
  eq(e) {
    if (!(e instanceof Ze) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].localsInner(e);
      if (i.length)
        if (!t)
          t = i;
        else {
          r && (t = t.slice(), r = !1);
          for (let o = 0; o < i.length; o++)
            t.push(i[o]);
        }
    }
    return t ? ho(r ? t : t.sort(Rt)) : Ut;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Z;
      case 1:
        return e[0];
      default:
        return new Ze(e.every((t) => t instanceof z) ? e : e.reduce((t, r) => t.concat(r instanceof z ? r : r.members), []));
    }
  }
}
function ff(n, e, t, r, s, i, o) {
  let l = n.slice();
  for (let c = 0, d = i; c < t.maps.length; c++) {
    let u = 0;
    t.maps[c].forEach((h, f, p, m) => {
      let g = m - p - (f - h);
      for (let y = 0; y < l.length; y += 3) {
        let k = l[y + 1];
        if (k < 0 || h > k + d - u)
          continue;
        let C = l[y] + d - u;
        f >= C ? l[y + 1] = h <= C ? -2 : -1 : h >= d && g && (l[y] += g, l[y + 1] += g);
      }
      u += g;
    }), d = t.maps[c].map(d, -1);
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        a = !0, l[c + 1] = -1;
        continue;
      }
      let d = t.map(n[c] + i), u = d - s;
      if (u < 0 || u >= r.content.size) {
        a = !0;
        continue;
      }
      let h = t.map(n[c + 1] + i, -1), f = h - s, { index: p, offset: m } = r.content.findIndex(u), g = r.maybeChild(p);
      if (g && m == u && m + g.nodeSize == f) {
        let y = l[c + 2].mapInner(t, g, d + 1, n[c] + i + 1, o);
        y != Z ? (l[c] = u, l[c + 1] = f, l[c + 2] = y) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = pf(l, n, e, t, s, i, o), d = zr(c, r, 0, o);
    e = d.local;
    for (let u = 0; u < l.length; u += 3)
      l[u + 1] < 0 && (l.splice(u, 3), u -= 3);
    for (let u = 0, h = 0; u < d.children.length; u += 3) {
      let f = d.children[u];
      for (; h < l.length && l[h] < f; )
        h += 3;
      l.splice(h, 0, d.children[u], d.children[u + 1], d.children[u + 2]);
    }
  }
  return new z(e.sort(Rt), l);
}
function Hc(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let s = n[r];
    t.push(new le(s.from + e, s.to + e, s.type));
  }
  return t;
}
function pf(n, e, t, r, s, i, o) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let u = a.local[d].map(r, s, c);
      u ? t.push(u) : o.onRemove && o.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3)
      l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + i + 1);
  return t;
}
function Fc(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, s = null;
  for (let i = 0, o; i < n.length; i++)
    (o = n[i]) && o.from > t && o.to < r && ((s || (s = [])).push(o), n[i] = null);
  return s;
}
function Vc(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function zr(n, e, t, r) {
  let s = [], i = !1;
  e.forEach((l, a) => {
    let c = Fc(n, l, a + t);
    if (c) {
      i = !0;
      let d = zr(c, l, t + a + 1, r);
      d != Z && s.push(a, a + l.nodeSize, d);
    }
  });
  let o = Hc(i ? Vc(n) : n, -t).sort(Rt);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || s.length ? new z(o, s) : Z;
}
function Rt(n, e) {
  return n.from - e.from || n.to - e.to;
}
function ho(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let s = t + 1; s < e.length; s++) {
        let i = e[s];
        if (i.from == r.from) {
          i.to != r.to && (e == n && (e = n.slice()), e[s] = i.copy(i.from, r.to), Sl(e, s + 1, i.copy(r.to, i.to)));
          continue;
        } else {
          i.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, i.from), Sl(e, s, r.copy(i.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Sl(n, e, t) {
  for (; e < n.length && Rt(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Qs(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Z && e.push(r);
  }), n.cursorWrapper && e.push(z.create(n.state.doc, [n.cursorWrapper.deco])), Ze.from(e);
}
const mf = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, gf = ae && lt <= 11;
class yf {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class bf {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new yf(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let s = 0; s < r.length; s++)
        this.queue.push(r[s]);
      ae && lt <= 11 && r.some((s) => s.type == "childList" && s.removedNodes.length || s.type == "characterData" && s.oldValue.length > s.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), gf && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, mf)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (pl(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Ue(this.view);
      if (ae && lt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Lt(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let i = e.focusNode; i; i = $n(i))
      t.add(i);
    for (let i = e.anchorNode; i; i = $n(i))
      if (t.has(i)) {
        r = i;
        break;
      }
    let s = r && this.view.docView.nearestDesc(r);
    if (s && s.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords())
        this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(), s = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && pl(e) && !this.ignoreSelectionChange(r), i = -1, o = -1, l = !1, a = [];
    if (e.editable)
      for (let d = 0; d < t.length; d++) {
        let u = this.registerMutation(t[d], a);
        u && (i = i < 0 ? u.from : Math.min(u.from, i), o = o < 0 ? u.to : Math.max(u.to, o), u.typeOver && (l = !0));
      }
    if (Ce && a.length) {
      let d = a.filter((u) => u.nodeName == "BR");
      if (d.length == 2) {
        let [u, h] = d;
        u.parentNode && u.parentNode.parentNode == h.parentNode ? h.remove() : u.remove();
      } else {
        let { focusNode: u } = this.currentSelection;
        for (let h of d) {
          let f = h.parentNode;
          f && f.nodeName == "LI" && (!u || xf(e, u) != f) && h.remove();
        }
      }
    }
    let c = null;
    i < 0 && s && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ts(r) && (c = io(e)) && c.eq(E.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Ue(e), this.currentSelection.set(r), e.scrollToSelection()) : (i > -1 || s) && (i > -1 && (e.docView.markDirty(i, o), kf(e)), this.handleDOMChange(i, o, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Ue(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let d = 0; d < e.addedNodes.length; d++) {
        let u = e.addedNodes[d];
        t.push(u), u.nodeType == 3 && (this.lastChangedTextNode = u);
      }
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let s = e.previousSibling, i = e.nextSibling;
      if (ae && lt <= 11 && e.addedNodes.length)
        for (let d = 0; d < e.addedNodes.length; d++) {
          let { previousSibling: u, nextSibling: h } = e.addedNodes[d];
          (!u || Array.prototype.indexOf.call(e.addedNodes, u) < 0) && (s = u), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (i = h);
        }
      let o = s && s.parentNode == e.target ? G(s) + 1 : 0, l = r.localPosFromDOM(e.target, o, -1), a = i && i.parentNode == e.target ? G(i) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
      return { from: l, to: c };
    } else return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : (this.lastChangedTextNode = e.target, {
      from: r.posAtStart,
      to: r.posAtEnd,
      // An event was generated for a text change that didn't change
      // any text. Mark the dom change to fall back to assuming the
      // selection was typed over with an identical value if it can't
      // find another change.
      typeOver: e.target.nodeValue == e.oldValue
    });
  }
}
let Cl = /* @__PURE__ */ new WeakMap(), Ml = !1;
function kf(n) {
  if (!Cl.has(n) && (Cl.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = Ce, Ml)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Ml = !0;
  }
}
function Tl(n, e) {
  let t = e.startContainer, r = e.startOffset, s = e.endContainer, i = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return Lt(o.node, o.offset, s, i) && ([t, r, s, i] = [s, i, t, r]), { anchorNode: t, anchorOffset: r, focusNode: s, focusOffset: i };
}
function wf(n, e) {
  if (e.getComposedRanges) {
    let s = e.getComposedRanges(n.root)[0];
    if (s)
      return Tl(n, s);
  }
  let t;
  function r(s) {
    s.preventDefault(), s.stopImmediatePropagation(), t = s.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? Tl(n, t) : null;
}
function xf(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function Sf(n, e, t) {
  let { node: r, fromOffset: s, toOffset: i, from: o, to: l } = n.docView.parseRange(e, t), a = n.domSelectionRange(), c, d = a.anchorNode;
  if (d && n.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (c = [{ node: d, offset: a.anchorOffset }], Ts(a) || c.push({ node: a.focusNode, offset: a.focusOffset })), ne && n.input.lastKeyCode === 8)
    for (let g = i; g > s; g--) {
      let y = r.childNodes[g - 1], k = y.pmViewDesc;
      if (y.nodeName == "BR" && !k) {
        i = g;
        break;
      }
      if (!k || k.size)
        break;
    }
  let u = n.state.doc, h = n.someProp("domParser") || nn.fromSchema(n.state.schema), f = u.resolve(o), p = null, m = h.parse(r, {
    topNode: f.parent,
    topMatch: f.parent.contentMatchAt(f.index()),
    topOpen: !0,
    from: s,
    to: i,
    preserveWhitespace: f.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: Cf,
    context: f
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: l };
}
function Cf(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (re && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || re && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Mf = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Tf(n, e, t, r, s) {
  let i = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let D = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, Ae = io(n, D);
    if (Ae && !n.state.selection.eq(Ae)) {
      if (ne && we && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (tr) => tr(n, wt(13, "Enter"))))
        return;
      let Je = n.state.tr.setSelection(Ae);
      D == "pointer" ? Je.setMeta("pointer", !0) : D == "key" && Je.scrollIntoView(), i && Je.setMeta("composition", i), n.dispatch(Je);
    }
    return;
  }
  let o = n.state.doc.resolve(e), l = o.sharedDepth(t);
  e = o.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = Sf(n, e, t), d = n.state.doc, u = d.slice(c.from, c.to), h, f;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, f = "end") : (h = n.state.selection.from, f = "start"), n.input.lastKeyCode = null;
  let p = vf(u.content, c.doc.content, c.from, h, f);
  if ((on && n.input.lastIOSEnter > Date.now() - 225 || we) && s.some((D) => D.nodeType == 1 && !Mf.test(D.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (D) => D(n, wt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof A && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let D = Al(n, n.state.doc, c.sel);
        if (D && !D.eq(n.state.selection)) {
          let Ae = n.state.tr.setSelection(D);
          i && Ae.setMeta("composition", i), n.dispatch(Ae);
        }
      }
      return;
    }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof A && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), ae && lt <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = d.resolve(p.start), k = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA, C;
  if ((on && n.input.lastIOSEnter > Date.now() - 225 && (!k || s.some((D) => D.nodeName == "DIV" || D.nodeName == "P")) || !k && m.pos < c.doc.content.size && !m.sameParent(g) && (C = E.findFrom(c.doc.resolve(m.pos + 1), 1, !0)) && C.head == g.pos) && n.someProp("handleKeyDown", (D) => D(n, wt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && Ef(d, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (D) => D(n, wt(8, "Backspace")))) {
    we && ne && n.domObserver.suppressSelectionUpdates();
    return;
  }
  ne && we && p.endB == p.start && (n.input.lastAndroidDelete = Date.now()), we && !k && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(D) {
      return D(n, wt(13, "Enter"));
    });
  }, 20));
  let R = p.start, v = p.endA, M, I, J;
  if (k) {
    if (m.pos == g.pos)
      ae && lt <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Ue(n), 20)), M = n.state.tr.delete(R, v), I = d.resolve(p.start).marksAcross(d.resolve(p.endA));
    else if (
      // Adding or removing a mark
      p.endA == p.endB && (J = Af(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    )
      M = n.state.tr, J.type == "add" ? M.addMark(R, v, J.mark) : M.removeMark(R, v, J.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let D = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (Ae) => Ae(n, R, v, D)))
        return;
      M = n.state.tr.insertText(D, R, v);
    }
  }
  if (M || (M = n.state.tr.replace(R, v, c.doc.slice(p.start - c.from, p.endB - c.from))), c.sel) {
    let D = Al(n, M.doc, c.sel);
    D && !(ne && we && n.composing && D.empty && (p.start != p.endB || n.input.lastAndroidDelete < Date.now() - 100) && (D.head == R || D.head == M.mapping.map(v) - 1) || ae && D.empty && D.head == R) && M.setSelection(D);
  }
  I && M.ensureMarks(I), i && M.setMeta("composition", i), n.dispatch(M.scrollIntoView());
}
function Al(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : oo(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Af(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, s = t, i = r, o, l, a;
  for (let d = 0; d < r.length; d++)
    s = r[d].removeFromSet(s);
  for (let d = 0; d < t.length; d++)
    i = t[d].removeFromSet(i);
  if (s.length == 1 && i.length == 0)
    l = s[0], o = "add", a = (d) => d.mark(l.addToSet(d.marks));
  else if (s.length == 0 && i.length == 1)
    l = i[0], o = "remove", a = (d) => d.mark(l.removeFromSet(d.marks));
  else
    return null;
  let c = [];
  for (let d = 0; d < e.childCount; d++)
    c.push(a(e.child(d)));
  if (b.from(c).eq(n))
    return { mark: l, type: o };
}
function Ef(n, e, t, r, s) {
  if (
    // The content must have shrunk
    t - e <= s.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    Zs(r, !0, !1) < s.pos
  )
    return !1;
  let i = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = i.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock)
    return !1;
  let o = n.resolve(Zs(i, !0, !0));
  return !o.parent.isTextblock || o.pos > t || Zs(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Zs(n, e, t) {
  let r = n.depth, s = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, s++, e = !1;
  if (t) {
    let i = n.node(r).maybeChild(n.indexAfter(r));
    for (; i && !i.isLeaf; )
      i = i.firstChild, s++;
  }
  return s;
}
function vf(n, e, t, r, s) {
  let i = n.findDiffStart(e, t);
  if (i == null)
    return null;
  let { a: o, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (s == "end") {
    let a = Math.max(0, i - Math.min(o, l));
    r -= o + a - i;
  }
  if (o < i && n.size < e.size) {
    let a = r <= i && r >= o ? i - r : 0;
    i -= a, i && i < e.size && El(e.textBetween(i - 1, i + 1)) && (i += a ? 1 : -1), l = i + (l - o), o = i;
  } else if (l < i) {
    let a = r <= i && r >= l ? i - r : 0;
    i -= a, i && i < n.size && El(n.textBetween(i - 1, i + 1)) && (i += a ? 1 : -1), o = i + (o - l), l = i;
  }
  return { start: i, endA: o, endB: l };
}
function El(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Of {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Jh(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Dl), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Nl(this), Ol(this), this.nodeViews = Rl(this), this.docView = al(this.state.doc, vl(this), Qs(this), this.dom, this), this.domObserver = new bf(this, (r, s, i, o) => Tf(this, r, s, i, o)), this.domObserver.start(), qh(this), this.updatePluginViews();
  }
  /**
  Holds `true` when a
  [composition](https://w3c.github.io/uievents/#events-compositionevents)
  is active.
  */
  get composing() {
    return this.input.composing;
  }
  /**
  The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
  */
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && Li(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Dl), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let s = this.state, i = !1, o = !1;
    e.storedMarks && this.composing && (Pc(this), o = !0), this.state = e;
    let l = s.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let f = Rl(this);
      Rf(f, this.nodeViews) && (this.nodeViews = f, i = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && Li(this), this.editable = Nl(this), Ol(this);
    let a = Qs(this), c = vl(this), d = s.plugins != e.plugins && !s.doc.eq(e.doc) ? "reset" : e.scrollToSelection > s.scrollToSelection ? "to selection" : "preserve", u = i || !this.docView.matchesNode(e.doc, c, a);
    (u || !e.selection.eq(s.selection)) && (o = !0);
    let h = d == "preserve" && o && this.dom.style.overflowAnchor == null && ch(this);
    if (o) {
      this.domObserver.stop();
      let f = u && (ae || ne) && !this.composing && !s.selection.empty && !e.selection.empty && Nf(s.selection, e.selection);
      if (u) {
        let p = ne ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = af(this)), (i || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = al(e.doc, c, a, this.dom, this)), p && !this.trackWrites && (f = !0);
      }
      f || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Ih(this)) ? Ue(this, f) : (Sc(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(s), !((r = this.dragging) === null || r === void 0) && r.node && !s.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, s), d == "reset" ? this.dom.scrollTop = 0 : d == "to selection" ? this.scrollToSelection() : h && dh(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof T) {
      let t = this.docView.domAfterPos(this.state.selection.from);
      t.nodeType == 1 && nl(this, t.getBoundingClientRect(), e);
    } else
      nl(this, this.coordsAtPos(this.state.selection.head, 1), e);
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node, s = -1;
    if (this.state.doc.nodeAt(r.from) == r.node)
      s = r.from;
    else {
      let i = r.from + (this.state.doc.content.size - t.doc.content.size);
      (i > 0 && this.state.doc.nodeAt(i)) == r.node && (s = i);
    }
    this.dragging = new Bc(e.slice, e.move, s < 0 ? void 0 : T.create(this.state.doc, s));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], s;
    if (r != null && (s = t ? t(r) : r))
      return s;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let l = this.directPlugins[o].props[e];
      if (l != null && (s = t ? t(l) : l))
        return s;
    }
    let i = this.state.plugins;
    if (i)
      for (let o = 0; o < i.length; o++) {
        let l = i[o].props[e];
        if (l != null && (s = t ? t(l) : l))
          return s;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (ae) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  /**
  Focus the editor.
  */
  focus() {
    this.domObserver.stop(), this.editable && uh(this.dom), Ue(this), this.domObserver.start();
  }
  /**
  Get the document root in which the editor exists. This will
  usually be the top-level `document`, but might be a [shadow
  DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  root if the editor is inside one.
  */
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  /**
  When an existing editor view is moved to a new document or
  shadow tree, call this to make it recompute its root.
  */
  updateRoot() {
    this._root = null;
  }
  /**
  Given a pair of viewport coordinates, return the document
  position that corresponds to them. May return null if the given
  coordinates aren't inside of the editor. When an object is
  returned, its `pos` property is the position nearest to the
  coordinates, and its `inside` property holds the position of the
  inner node that the position falls inside of, or -1 if it is at
  the top level, not in any node.
  */
  posAtCoords(e) {
    return gh(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, t = 1) {
    return pc(this, e, t);
  }
  /**
  Find the DOM position that corresponds to the given document
  position. When `side` is negative, find the position as close as
  possible to the content before the position. When positive,
  prefer positions close to the content after the position. When
  zero, prefer as shallow a position as possible.
  
  Note that you should **not** mutate the editor's internal DOM,
  only inspect it (and even that is usually not necessary).
  */
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  /**
  Find the DOM node that represents the document node after the
  given position. May return `null` when the position doesn't point
  in front of a node or if the node is inside an opaque node view.
  
  This is intended to be able to call things like
  `getBoundingClientRect` on that DOM node. Do **not** mutate the
  editor DOM directly, or add styling this way, since that will be
  immediately overriden by the editor as it redraws the node.
  */
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  /**
  Find the document position that corresponds to a given DOM
  position. (Whenever possible, it is preferable to inspect the
  document structure directly, rather than poking around in the
  DOM, but sometimes—for example when interpreting an event
  target—you don't have a choice.)
  
  The `bias` parameter can be used to influence which side of a DOM
  node to use when the position is inside a leaf node.
  */
  posAtDOM(e, t, r = -1) {
    let s = this.docView.posFromDOM(e, t, r);
    if (s == null)
      throw new RangeError("DOM position not inside the editor");
    return s;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, t) {
    return xh(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return zn(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return zn(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Gh(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Qs(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Xu());
  }
  /**
  This is true when the view has been
  [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
  used anymore).
  */
  get isDestroyed() {
    return this.docView == null;
  }
  /**
  Used for testing.
  */
  dispatchEvent(e) {
    return Xh(this, e);
  }
  /**
  Dispatch a transaction. Will call
  [`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction)
  when given, and otherwise defaults to applying the transaction to
  the current state and calling
  [`updateState`](https://prosemirror.net/docs/ref/#view.EditorView.updateState) with the result.
  This method is bound to the view instance, so that it can be
  easily passed around.
  */
  dispatch(e) {
    let t = this._props.dispatchTransaction;
    t ? t.call(this, e) : this.updateState(this.state.apply(e));
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return re && this.root.nodeType === 11 && nh(this.dom.ownerDocument) == this.dom && wf(this, e) || e;
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
function vl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [le.node(0, n.state.doc.content.size, e)];
}
function Ol(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: le.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Nl(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Nf(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Rl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let s in r)
      Object.prototype.hasOwnProperty.call(e, s) || (e[s] = r[s]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Rf(n, e) {
  let t = 0, r = 0;
  for (let s in n) {
    if (n[s] != e[s])
      return !0;
    t++;
  }
  for (let s in e)
    r++;
  return t != r;
}
function Dl(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var ut = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Hr = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Df = typeof navigator < "u" && /Mac/.test(navigator.platform), If = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Y = 0; Y < 10; Y++) ut[48 + Y] = ut[96 + Y] = String(Y);
for (var Y = 1; Y <= 24; Y++) ut[Y + 111] = "F" + Y;
for (var Y = 65; Y <= 90; Y++)
  ut[Y] = String.fromCharCode(Y + 32), Hr[Y] = String.fromCharCode(Y);
for (var ei in ut) Hr.hasOwnProperty(ei) || (Hr[ei] = ut[ei]);
function Lf(n) {
  var e = Df && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || If && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Hr : ut)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Pf = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function $f(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, s, i, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      s = !0;
    else if (/^s(hift)?$/i.test(a))
      i = !0;
    else if (/^mod$/i.test(a))
      Pf ? o = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), s && (t = "Ctrl-" + t), o && (t = "Meta-" + t), i && (t = "Shift-" + t), t;
}
function Bf(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[$f(t)] = n[t];
  return e;
}
function ti(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function zf(n) {
  return new X({ props: { handleKeyDown: fo(n) } });
}
function fo(n) {
  let e = Bf(n);
  return function(t, r) {
    let s = Lf(r), i, o = e[ti(s, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (s.length == 1 && s != " ") {
      if (r.shiftKey) {
        let l = e[ti(s, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || s.charCodeAt(0) > 127) && (i = ut[r.keyCode]) && i != s) {
        let l = e[ti(i, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
const Hf = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function _c(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Ff = (n, e, t) => {
  let r = _c(n, t);
  if (!r)
    return !1;
  let s = po(r);
  if (!s) {
    let o = r.blockRange(), l = o && pn(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let i = s.nodeBefore;
  if (!i.type.spec.isolating && Kc(n, s, e))
    return !0;
  if (r.parent.content.size == 0 && (ln(i, "end") || T.isSelectable(i))) {
    let o = Cs(n.doc, r.before(), r.after(), x.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(ln(i, "end") ? E.findFrom(l.doc.resolve(l.mapping.map(s.pos, -1)), -1) : T.create(l.doc, s.pos - i.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(n.tr.delete(s.pos - i.nodeSize, s.pos).scrollIntoView()), !0) : !1;
}, Vf = (n, e, t) => {
  let r = _c(n, t);
  if (!r)
    return !1;
  let s = po(r);
  return s ? Wc(n, s, e) : !1;
}, _f = (n, e, t) => {
  let r = jc(n, t);
  if (!r)
    return !1;
  let s = mo(r);
  return s ? Wc(n, s, e) : !1;
};
function Wc(n, e, t) {
  let r = e.nodeBefore, s = r, i = e.pos - 1;
  for (; !s.isTextblock; i--) {
    if (s.type.spec.isolating)
      return !1;
    let d = s.lastChild;
    if (!d)
      return !1;
    s = d;
  }
  let o = e.nodeAfter, l = o, a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating)
      return !1;
    let d = l.firstChild;
    if (!d)
      return !1;
    l = d;
  }
  let c = Cs(n.doc, i, a, x.empty);
  if (!c || c.from != i || c instanceof _ && c.slice.size >= a - i)
    return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(A.create(d.doc, i)), t(d.scrollIntoView());
  }
  return !0;
}
function ln(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Wf = (n, e, t) => {
  let { $head: r, empty: s } = n.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    i = po(r);
  }
  let o = i && i.nodeBefore;
  return !o || !T.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(T.create(n.doc, i.pos - o.nodeSize)).scrollIntoView()), !0);
};
function po(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function jc(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const jf = (n, e, t) => {
  let r = jc(n, t);
  if (!r)
    return !1;
  let s = mo(r);
  if (!s)
    return !1;
  let i = s.nodeAfter;
  if (Kc(n, s, e))
    return !0;
  if (r.parent.content.size == 0 && (ln(i, "start") || T.isSelectable(i))) {
    let o = Cs(n.doc, r.before(), r.after(), x.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(ln(i, "start") ? E.findFrom(l.doc.resolve(l.mapping.map(s.pos)), 1) : T.create(l.doc, l.mapping.map(s.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(n.tr.delete(s.pos, s.pos + i.nodeSize).scrollIntoView()), !0) : !1;
}, Uf = (n, e, t) => {
  let { $head: r, empty: s } = n.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    i = mo(r);
  }
  let o = i && i.nodeAfter;
  return !o || !T.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(T.create(n.doc, i.pos)).scrollIntoView()), !0);
};
function mo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const Kf = (n, e) => {
  let t = n.selection, r = t instanceof T, s;
  if (r) {
    if (t.node.isTextblock || !pt(n.doc, t.from))
      return !1;
    s = t.from;
  } else if (s = Ss(n.doc, t.from, -1), s == null)
    return !1;
  if (e) {
    let i = n.tr.join(s);
    r && i.setSelection(T.create(i.doc, s - n.doc.resolve(s).nodeBefore.nodeSize)), e(i.scrollIntoView());
  }
  return !0;
}, Jf = (n, e) => {
  let t = n.selection, r;
  if (t instanceof T) {
    if (t.node.isTextblock || !pt(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Ss(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, qf = (n, e) => {
  let { $from: t, $to: r } = n.selection, s = t.blockRange(r), i = s && pn(s);
  return i == null ? !1 : (e && e(n.tr.lift(s, i).scrollIntoView()), !0);
}, Gf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Uc(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Yf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let s = t.node(-1), i = t.indexAfter(-1), o = Uc(s.contentMatchAt(i));
  if (!o || !s.canReplaceWith(i, i, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(E.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, Xf = (n, e) => {
  let t = n.selection, { $from: r, $to: s } = t;
  if (t instanceof Se || r.parent.inlineContent || s.parent.inlineContent)
    return !1;
  let i = Uc(s.parent.contentMatchAt(s.indexAfter()));
  if (!i || !i.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && s.index() < s.parent.childCount ? r : s).pos, l = n.tr.insert(o, i.createAndFill());
    l.setSelection(A.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, Qf = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let i = t.before();
    if (Xt(n.doc, i))
      return e && e(n.tr.split(i).scrollIntoView()), !0;
  }
  let r = t.blockRange(), s = r && pn(r);
  return s == null ? !1 : (e && e(n.tr.lift(r, s).scrollIntoView()), !0);
}, Zf = (n, e) => {
  let { $from: t, to: r } = n.selection, s, i = t.sharedDepth(r);
  return i == 0 ? !1 : (s = t.before(i), e && e(n.tr.setSelection(T.create(n.doc, s))), !0);
};
function ep(n, e, t) {
  let r = e.nodeBefore, s = e.nodeAfter, i = e.index();
  return !r || !s || !r.type.compatibleContent(s.type) ? !1 : !r.content.size && e.parent.canReplace(i - 1, i) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(i, i + 1) || !(s.isTextblock || pt(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Kc(n, e, t) {
  let r = e.nodeBefore, s = e.nodeAfter, i, o;
  if (r.type.spec.isolating || s.type.spec.isolating)
    return !1;
  if (ep(n, e, t))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (i = (o = r.contentMatchAt(r.childCount)).findWrapping(s.type)) && o.matchType(i[0] || s.type).validEnd) {
    if (t) {
      let u = e.pos + s.nodeSize, h = b.empty;
      for (let m = i.length - 1; m >= 0; m--)
        h = b.from(i[m].create(null, h));
      h = b.from(r.copy(h));
      let f = n.tr.step(new j(e.pos - 1, u, e.pos, u, new x(h, 1, 0), i.length, !0)), p = u + 2 * i.length;
      pt(f.doc, p) && f.join(p), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = E.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), d = c && pn(c);
  if (d != null && d >= e.depth)
    return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && ln(s, "start", !0) && ln(r, "end")) {
    let u = r, h = [];
    for (; h.push(u), !u.isTextblock; )
      u = u.lastChild;
    let f = s, p = 1;
    for (; !f.isTextblock; f = f.firstChild)
      p++;
    if (u.canReplace(u.childCount, u.childCount, f.content)) {
      if (t) {
        let m = b.empty;
        for (let y = h.length - 1; y >= 0; y--)
          m = b.from(h[y].copy(m));
        let g = n.tr.step(new j(e.pos - h.length, e.pos + s.nodeSize, e.pos + p, e.pos + s.nodeSize - p, new x(m, h.length, 0), 0, !0));
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Jc(n) {
  return function(e, t) {
    let r = e.selection, s = n < 0 ? r.$from : r.$to, i = s.depth;
    for (; s.node(i).isInline; ) {
      if (!i)
        return !1;
      i--;
    }
    return s.node(i).isTextblock ? (t && t(e.tr.setSelection(A.create(e.doc, n < 0 ? s.start(i) : s.end(i)))), !0) : !1;
  };
}
const tp = Jc(-1), np = Jc(1);
function rp(n, e = null) {
  return function(t, r) {
    let { $from: s, $to: i } = t.selection, o = s.blockRange(i), l = o && to(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Il(n, e = null) {
  return function(t, r) {
    let s = !1;
    for (let i = 0; i < t.selection.ranges.length && !s; i++) {
      let { $from: { pos: o }, $to: { pos: l } } = t.selection.ranges[i];
      t.doc.nodesBetween(o, l, (a, c) => {
        if (s)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n)
            s = !0;
          else {
            let d = t.doc.resolve(c), u = d.index();
            s = d.parent.canReplaceWith(u, u + 1, n);
          }
      });
    }
    if (!s)
      return !1;
    if (r) {
      let i = t.tr;
      for (let o = 0; o < t.selection.ranges.length; o++) {
        let { $from: { pos: l }, $to: { pos: a } } = t.selection.ranges[o];
        i.setBlockType(l, a, n, e);
      }
      r(i.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function sp(n, e = null) {
  return function(t, r) {
    let { $from: s, $to: i } = t.selection, o = s.blockRange(i), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && s.node(o.depth - 1).type.compatibleContent(n) && o.startIndex == 0) {
      if (s.index(o.depth - 1) == 0)
        return !1;
      let d = t.doc.resolve(o.start - 2);
      a = new Rr(d, d, o.depth), o.endIndex < o.parent.childCount && (o = new Rr(s, t.doc.resolve(i.end(o.depth)), o.depth)), l = !0;
    }
    let c = to(a, n, e, o);
    return c ? (r && r(ip(t.tr, o, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function ip(n, e, t, r, s) {
  let i = b.empty;
  for (let d = t.length - 1; d >= 0; d--)
    i = b.from(t[d].type.create(t[d].attrs, i));
  n.step(new j(e.start - (r ? 2 : 0), e.end, e.start, e.end, new x(i, 0, 0), t.length, !0));
  let o = 0;
  for (let d = 0; d < t.length; d++)
    t[d].type == s && (o = d + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let d = e.startIndex, u = e.endIndex, h = !0; d < u; d++, h = !1)
    !h && Xt(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(d).nodeSize;
  return n;
}
function op(n) {
  return function(e, t) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (o) => o.childCount > 0 && o.firstChild.type == n);
    return i ? t ? r.node(i.depth - 1).type == n ? lp(e, t, n, i) : ap(e, t, i) : !0 : !1;
  };
}
function lp(n, e, t, r) {
  let s = n.tr, i = r.end, o = r.$to.end(r.depth);
  i < o && (s.step(new j(i - 1, o, i, o, new x(b.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Rr(s.doc.resolve(r.$from.pos), s.doc.resolve(o), r.depth));
  const l = pn(r);
  if (l == null)
    return !1;
  s.lift(r, l);
  let a = s.mapping.map(i, -1) - 1;
  return pt(s.doc, a) && s.join(a), e(s.scrollIntoView()), !0;
}
function ap(n, e, t) {
  let r = n.tr, s = t.parent;
  for (let f = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    f -= s.child(p).nodeSize, r.delete(f - 1, f + 1);
  let i = r.doc.resolve(t.start), o = i.nodeAfter;
  if (r.mapping.map(t.end) != t.start + i.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == s.childCount, c = i.node(-1), d = i.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, o.content.append(a ? b.empty : b.from(s))))
    return !1;
  let u = i.pos, h = u + o.nodeSize;
  return r.step(new j(u - (l ? 1 : 0), h + (a ? 1 : 0), u + 1, h - 1, new x((l ? b.empty : b.from(s.copy(b.empty))).append(a ? b.empty : b.from(s.copy(b.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function cp(n) {
  return function(e, t) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!i)
      return !1;
    let o = i.startIndex;
    if (o == 0)
      return !1;
    let l = i.parent, a = l.child(o - 1);
    if (a.type != n)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, d = b.from(c ? n.create() : null), u = new x(b.from(n.create(null, b.from(l.type.create(null, d)))), c ? 3 : 1, 0), h = i.start, f = i.end;
      t(e.tr.step(new j(h - (c ? 3 : 1), f, h, f, u, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function vs(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: s } = t, { storedMarks: i } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return r;
    },
    get doc() {
      return s;
    },
    get tr() {
      return r = t.selection, s = t.doc, i = t.storedMarks, t;
    }
  };
}
class Os {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: r } = this, { view: s } = t, { tr: i } = r, o = this.buildProps(i);
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...d) => {
      const u = a(...d)(o);
      return !i.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(i), u;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: s, state: i } = this, { view: o } = s, l = [], a = !!e, c = e || i.tr, d = () => (!a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(c), l.every((h) => h === !0)), u = {
      ...Object.fromEntries(Object.entries(r).map(([h, f]) => [h, (...m) => {
        const g = this.buildProps(c, t), y = f(...m)(g);
        return l.push(y), u;
      }])),
      run: d
    };
    return u;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, s = !1, i = e || r.tr, o = this.buildProps(i, s);
    return {
      ...Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...d) => c(...d)({ ...o, dispatch: void 0 })])),
      chain: () => this.createChain(i, s)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: s, state: i } = this, { view: o } = s, l = {
      tr: e,
      editor: s,
      view: o,
      state: vs({
        state: i,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([a, c]) => [a, (...d) => c(...d)(l)]));
      }
    };
    return l;
  }
}
class dp {
  constructor() {
    this.callbacks = {};
  }
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((s) => s.apply(this, t)), this;
  }
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((s) => s !== t) : delete this.callbacks[e]), this;
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}
function S(n, e, t) {
  return n.config[e] === void 0 && n.parent ? S(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? S(n.parent, e, t) : null
  }) : n.config[e];
}
function Ns(n) {
  const e = n.filter((s) => s.type === "extension"), t = n.filter((s) => s.type === "node"), r = n.filter((s) => s.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function qc(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = Ns(n), s = [...t, ...r], i = {
    default: null,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  };
  return n.forEach((o) => {
    const l = {
      name: o.name,
      options: o.options,
      storage: o.storage
    }, a = S(o, "addGlobalAttributes", l);
    if (!a)
      return;
    a().forEach((d) => {
      d.types.forEach((u) => {
        Object.entries(d.attributes).forEach(([h, f]) => {
          e.push({
            type: u,
            name: h,
            attribute: {
              ...i,
              ...f
            }
          });
        });
      });
    });
  }), s.forEach((o) => {
    const l = {
      name: o.name,
      options: o.options,
      storage: o.storage
    }, a = S(o, "addAttributes", l);
    if (!a)
      return;
    const c = a();
    Object.entries(c).forEach(([d, u]) => {
      const h = {
        ...i,
        ...u
      };
      typeof (h == null ? void 0 : h.default) == "function" && (h.default = h.default()), h != null && h.isRequired && (h == null ? void 0 : h.default) === void 0 && delete h.default, e.push({
        type: o.name,
        name: d,
        attribute: h
      });
    });
  }), e;
}
function K(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function $(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([s, i]) => {
      if (!r[s]) {
        r[s] = i;
        return;
      }
      if (s === "class") {
        const l = i ? i.split(" ") : [], a = r[s] ? r[s].split(" ") : [], c = l.filter((d) => !a.includes(d));
        r[s] = [...a, ...c].join(" ");
      } else s === "style" ? r[s] = [r[s], i].join("; ") : r[s] = i;
    }), r;
  }, {});
}
function Pi(n, e) {
  return e.filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => $(t, r), {});
}
function Gc(n) {
  return typeof n == "function";
}
function O(n, e = void 0, ...t) {
  return Gc(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function up(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function hp(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Ll(n, e) {
  return n.style ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const s = e.reduce((i, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : hp(t.getAttribute(o.name));
        return l == null ? i : {
          ...i,
          [o.name]: l
        };
      }, {});
      return { ...r, ...s };
    }
  };
}
function Pl(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && up(t) ? !1 : t != null)
  );
}
function fp(n, e) {
  var t;
  const r = qc(n), { nodeExtensions: s, markExtensions: i } = Ns(n), o = (t = s.find((c) => S(c, "topNode"))) === null || t === void 0 ? void 0 : t.name, l = Object.fromEntries(s.map((c) => {
    const d = r.filter((y) => y.type === c.name), u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, h = n.reduce((y, k) => {
      const C = S(k, "extendNodeSchema", u);
      return {
        ...y,
        ...C ? C(c) : {}
      };
    }, {}), f = Pl({
      ...h,
      content: O(S(c, "content", u)),
      marks: O(S(c, "marks", u)),
      group: O(S(c, "group", u)),
      inline: O(S(c, "inline", u)),
      atom: O(S(c, "atom", u)),
      selectable: O(S(c, "selectable", u)),
      draggable: O(S(c, "draggable", u)),
      code: O(S(c, "code", u)),
      defining: O(S(c, "defining", u)),
      isolating: O(S(c, "isolating", u)),
      attrs: Object.fromEntries(d.map((y) => {
        var k;
        return [y.name, { default: (k = y == null ? void 0 : y.attribute) === null || k === void 0 ? void 0 : k.default }];
      }))
    }), p = O(S(c, "parseHTML", u));
    p && (f.parseDOM = p.map((y) => Ll(y, d)));
    const m = S(c, "renderHTML", u);
    m && (f.toDOM = (y) => m({
      node: y,
      HTMLAttributes: Pi(y, d)
    }));
    const g = S(c, "renderText", u);
    return g && (f.toText = g), [c.name, f];
  })), a = Object.fromEntries(i.map((c) => {
    const d = r.filter((g) => g.type === c.name), u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, h = n.reduce((g, y) => {
      const k = S(y, "extendMarkSchema", u);
      return {
        ...g,
        ...k ? k(c) : {}
      };
    }, {}), f = Pl({
      ...h,
      inclusive: O(S(c, "inclusive", u)),
      excludes: O(S(c, "excludes", u)),
      group: O(S(c, "group", u)),
      spanning: O(S(c, "spanning", u)),
      code: O(S(c, "code", u)),
      attrs: Object.fromEntries(d.map((g) => {
        var y;
        return [g.name, { default: (y = g == null ? void 0 : g.attribute) === null || y === void 0 ? void 0 : y.default }];
      }))
    }), p = O(S(c, "parseHTML", u));
    p && (f.parseDOM = p.map((g) => Ll(g, d)));
    const m = S(c, "renderHTML", u);
    return m && (f.toDOM = (g) => m({
      mark: g,
      HTMLAttributes: Pi(g, d)
    })), [c.name, f];
  }));
  return new yu({
    topNode: o,
    nodes: l,
    marks: a
  });
}
function ni(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function $l(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
const pp = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(Math.max(0, r - e), r, (s, i, o, l) => {
    var a, c;
    const d = ((c = (a = s.type.spec).toText) === null || c === void 0 ? void 0 : c.call(a, {
      node: s,
      pos: i,
      parent: o,
      index: l
    })) || s.textContent || "%leaf%";
    t += d.slice(0, Math.max(0, r - i));
  }), t;
};
function go(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class Rs {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const mp = (n, e) => {
  if (go(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function ar(n) {
  var e;
  const { editor: t, from: r, to: s, text: i, rules: o, plugin: l } = n, { view: a } = t;
  if (a.composing)
    return !1;
  const c = a.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || !((e = c.nodeBefore || c.nodeAfter) === null || e === void 0) && e.marks.find((h) => h.type.spec.code)
  )
    return !1;
  let d = !1;
  const u = pp(c) + i;
  return o.forEach((h) => {
    if (d)
      return;
    const f = mp(u, h.find);
    if (!f)
      return;
    const p = a.state.tr, m = vs({
      state: a.state,
      transaction: p
    }), g = {
      from: r - (f[0].length - i.length),
      to: s
    }, { commands: y, chain: k, can: C } = new Os({
      editor: t,
      state: m
    });
    h.handler({
      state: m,
      range: g,
      match: f,
      commands: y,
      chain: k,
      can: C
    }) === null || !p.steps.length || (p.setMeta(l, {
      transform: p,
      from: r,
      to: s,
      text: i
    }), a.dispatch(p), d = !0);
  }), d;
}
function gp(n) {
  const { editor: e, rules: t } = n, r = new X({
    state: {
      init() {
        return null;
      },
      apply(s, i) {
        const o = s.getMeta(r);
        if (o)
          return o;
        const l = s.getMeta("applyInputRules");
        return !!l && setTimeout(() => {
          const { from: c, text: d } = l, u = c + d.length;
          ar({
            editor: e,
            from: c,
            to: u,
            text: d,
            rules: t,
            plugin: r
          });
        }), s.selectionSet || s.docChanged ? null : i;
      }
    },
    props: {
      handleTextInput(s, i, o, l) {
        return ar({
          editor: e,
          from: i,
          to: o,
          text: l,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (s) => (setTimeout(() => {
          const { $cursor: i } = s.state.selection;
          i && ar({
            editor: e,
            from: i.pos,
            to: i.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      // add support for input rules to trigger on enter
      // this is useful for example for code blocks
      handleKeyDown(s, i) {
        if (i.key !== "Enter")
          return !1;
        const { $cursor: o } = s.state.selection;
        return o ? ar({
          editor: e,
          from: o.pos,
          to: o.pos,
          text: `
`,
          rules: t,
          plugin: r
        }) : !1;
      }
    },
    // @ts-ignore
    isInputRules: !0
  });
  return r;
}
function yp(n) {
  return typeof n == "number";
}
class bp {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const kp = (n, e, t) => {
  if (go(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((s) => {
    const i = [s.text];
    return i.index = s.index, i.input = n, i.data = s.data, s.replaceWith && (s.text.includes(s.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), i.push(s.replaceWith)), i;
  }) : [];
};
function wp(n) {
  const { editor: e, state: t, from: r, to: s, rule: i, pasteEvent: o, dropEvent: l } = n, { commands: a, chain: c, can: d } = new Os({
    editor: e,
    state: t
  }), u = [];
  return t.doc.nodesBetween(r, s, (f, p) => {
    if (!f.isTextblock || f.type.spec.code)
      return;
    const m = Math.max(r, p), g = Math.min(s, p + f.content.size), y = f.textBetween(m - p, g - p, void 0, "￼");
    kp(y, i.find, o).forEach((C) => {
      if (C.index === void 0)
        return;
      const R = m + C.index + 1, v = R + C[0].length, M = {
        from: t.tr.mapping.map(R),
        to: t.tr.mapping.map(v)
      }, I = i.handler({
        state: t,
        range: M,
        match: C,
        commands: a,
        chain: c,
        can: d,
        pasteEvent: o,
        dropEvent: l
      });
      u.push(I);
    });
  }), u.every((f) => f !== null);
}
const xp = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) === null || e === void 0 || e.setData("text/html", n), t;
};
function Sp(n) {
  const { editor: e, rules: t } = n;
  let r = null, s = !1, i = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  const a = ({ state: d, from: u, to: h, rule: f, pasteEvt: p }) => {
    const m = d.tr, g = vs({
      state: d,
      transaction: m
    });
    if (!(!wp({
      editor: e,
      state: g,
      from: Math.max(u - 1, 0),
      to: h.b - 1,
      rule: f,
      pasteEvent: p,
      dropEvent: l
    }) || !m.steps.length))
      return l = typeof DragEvent < "u" ? new DragEvent("drop") : null, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, m;
  };
  return t.map((d) => new X({
    // we register a global drag handler to track the current drag source element
    view(u) {
      const h = (f) => {
        var p;
        r = !((p = u.dom.parentElement) === null || p === void 0) && p.contains(f.target) ? u.dom.parentElement : null;
      };
      return window.addEventListener("dragstart", h), {
        destroy() {
          window.removeEventListener("dragstart", h);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (u, h) => (i = r === u.dom.parentElement, l = h, !1),
        paste: (u, h) => {
          var f;
          const p = (f = h.clipboardData) === null || f === void 0 ? void 0 : f.getData("text/html");
          return o = h, s = !!(p != null && p.includes("data-pm-slice")), !1;
        }
      }
    },
    appendTransaction: (u, h, f) => {
      const p = u[0], m = p.getMeta("uiEvent") === "paste" && !s, g = p.getMeta("uiEvent") === "drop" && !i, y = p.getMeta("applyPasteRules"), k = !!y;
      if (!m && !g && !k)
        return;
      if (k) {
        const { from: v, text: M } = y, I = v + M.length, J = xp(M);
        return a({
          rule: d,
          state: f,
          from: v,
          to: { b: I },
          pasteEvt: J
        });
      }
      const C = h.doc.content.findDiffStart(f.doc.content), R = h.doc.content.findDiffEnd(f.doc.content);
      if (!(!yp(C) || !R || C === R.b))
        return a({
          rule: d,
          state: f,
          from: C,
          to: R,
          pasteEvt: o
        });
    }
  }));
}
function Cp(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return [...new Set(e)];
}
class Gt {
  constructor(e, t) {
    this.splittableMarks = [], this.editor = t, this.extensions = Gt.resolve(e), this.schema = fp(this.extensions, t), this.setupExtensions();
  }
  /**
   * Returns a flattened and sorted extension list while
   * also checking for duplicated extensions and warns the user.
   * @param extensions An array of Tiptap extensions
   * @returns An flattened and sorted array of Tiptap extensions
   */
  static resolve(e) {
    const t = Gt.sort(Gt.flatten(e)), r = Cp(t.map((s) => s.name));
    return r.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${r.map((s) => `'${s}'`).join(", ")}]. This can lead to issues.`), t;
  }
  /**
   * Create a flattened array of extensions by traversing the `addExtensions` field.
   * @param extensions An array of Tiptap extensions
   * @returns A flattened array of Tiptap extensions
   */
  static flatten(e) {
    return e.map((t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage
      }, s = S(t, "addExtensions", r);
      return s ? [t, ...this.flatten(s())] : t;
    }).flat(10);
  }
  /**
   * Sort extensions by priority.
   * @param extensions An array of Tiptap extensions
   * @returns A sorted array of Tiptap extensions by priority
   */
  static sort(e) {
    return e.sort((r, s) => {
      const i = S(r, "priority") || 100, o = S(s, "priority") || 100;
      return i > o ? -1 : i < o ? 1 : 0;
    });
  }
  /**
   * Get all commands from the extensions.
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  get commands() {
    return this.extensions.reduce((e, t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage,
        editor: this.editor,
        type: ni(t.name, this.schema)
      }, s = S(t, "addCommands", r);
      return s ? {
        ...e,
        ...s()
      } : e;
    }, {});
  }
  /**
   * Get all registered Prosemirror plugins from the extensions.
   * @returns An array of Prosemirror plugins
   */
  get plugins() {
    const { editor: e } = this, t = Gt.sort([...this.extensions].reverse()), r = [], s = [], i = t.map((o) => {
      const l = {
        name: o.name,
        options: o.options,
        storage: o.storage,
        editor: e,
        type: ni(o.name, this.schema)
      }, a = [], c = S(o, "addKeyboardShortcuts", l);
      let d = {};
      if (o.type === "mark" && o.config.exitable && (d.ArrowRight = () => ke.handleExit({ editor: e, mark: o })), c) {
        const m = Object.fromEntries(Object.entries(c()).map(([g, y]) => [g, () => y({ editor: e })]));
        d = { ...d, ...m };
      }
      const u = zf(d);
      a.push(u);
      const h = S(o, "addInputRules", l);
      $l(o, e.options.enableInputRules) && h && r.push(...h());
      const f = S(o, "addPasteRules", l);
      $l(o, e.options.enablePasteRules) && f && s.push(...f());
      const p = S(o, "addProseMirrorPlugins", l);
      if (p) {
        const m = p();
        a.push(...m);
      }
      return a;
    }).flat();
    return [
      gp({
        editor: e,
        rules: r
      }),
      ...Sp({
        editor: e,
        rules: s
      }),
      ...i
    ];
  }
  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return qc(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: e } = this, { nodeExtensions: t } = Ns(this.extensions);
    return Object.fromEntries(t.filter((r) => !!S(r, "addNodeView")).map((r) => {
      const s = this.attributes.filter((a) => a.type === r.name), i = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: e,
        type: K(r.name, this.schema)
      }, o = S(r, "addNodeView", i);
      if (!o)
        return [];
      const l = (a, c, d, u) => {
        const h = Pi(a, s);
        return o()({
          editor: e,
          node: a,
          getPos: d,
          decorations: u,
          HTMLAttributes: h,
          extension: r
        });
      };
      return [r.name, l];
    }));
  }
  /**
   * Go through all extensions, create extension storages & setup marks
   * & bind editor event listener.
   */
  setupExtensions() {
    this.extensions.forEach((e) => {
      var t;
      this.editor.extensionStorage[e.name] = e.storage;
      const r = {
        name: e.name,
        options: e.options,
        storage: e.storage,
        editor: this.editor,
        type: ni(e.name, this.schema)
      };
      e.type === "mark" && (!((t = O(S(e, "keepOnSplit", r))) !== null && t !== void 0) || t) && this.splittableMarks.push(e.name);
      const s = S(e, "onBeforeCreate", r), i = S(e, "onCreate", r), o = S(e, "onUpdate", r), l = S(e, "onSelectionUpdate", r), a = S(e, "onTransaction", r), c = S(e, "onFocus", r), d = S(e, "onBlur", r), u = S(e, "onDestroy", r);
      s && this.editor.on("beforeCreate", s), i && this.editor.on("create", i), o && this.editor.on("update", o), l && this.editor.on("selectionUpdate", l), a && this.editor.on("transaction", a), c && this.editor.on("focus", c), d && this.editor.on("blur", d), u && this.editor.on("destroy", u);
    });
  }
}
function Mp(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function ri(n) {
  return Mp(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Ds(n, e) {
  const t = { ...n };
  return ri(n) && ri(e) && Object.keys(e).forEach((r) => {
    ri(e[r]) ? r in n ? t[r] = Ds(n[r], e[r]) : Object.assign(t, { [r]: e[r] }) : Object.assign(t, { [r]: e[r] });
  }), t;
}
class he {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = O(S(this, "addOptions", {
      name: this.name
    }))), this.storage = O(S(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new he(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.parent = this.parent, t.options = Ds(this.options, e), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new he({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = O(S(t, "addOptions", {
      name: t.name
    })), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Yc(n, e, t) {
  const { from: r, to: s } = e, { blockSeparator: i = `

`, textSerializers: o = {} } = t || {};
  let l = "";
  return n.nodesBetween(r, s, (a, c, d, u) => {
    var h;
    a.isBlock && c > r && (l += i);
    const f = o == null ? void 0 : o[a.type.name];
    if (f)
      return d && (l += f({
        node: a,
        pos: c,
        parent: d,
        index: u,
        range: e
      })), !1;
    a.isText && (l += (h = a == null ? void 0 : a.text) === null || h === void 0 ? void 0 : h.slice(Math.max(r, c) - c, s - c));
  }), l;
}
function Xc(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
const Tp = he.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new X({
        key: new ce("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: s } = e, { ranges: i } = s, o = Math.min(...i.map((d) => d.$from.pos)), l = Math.max(...i.map((d) => d.$to.pos)), a = Xc(t);
            return Yc(r, { from: o, to: l }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: a
            });
          }
        }
      })
    ];
  }
}), Ap = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), Ep = (n = !1) => ({ commands: e }) => e.setContent("", n), vp = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: s } = r;
  return t && s.forEach(({ $from: i, $to: o }) => {
    n.doc.nodesBetween(i.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: d } = e, u = c.resolve(d.map(a)), h = c.resolve(d.map(a + l.nodeSize)), f = u.blockRange(h);
      if (!f)
        return;
      const p = pn(f);
      if (l.type.isTextblock) {
        const { defaultType: m } = u.parent.contentMatchAt(u.index());
        e.setNodeMarkup(f.start, m);
      }
      (p || p === 0) && e.lift(f, p);
    });
  }), !0;
}, Op = (n) => (e) => n(e), Np = () => ({ state: n, dispatch: e }) => Xf(n, e), Rp = (n, e) => ({ editor: t, tr: r }) => {
  const { state: s } = t, i = s.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, i.content), r.setSelection(new A(r.doc.resolve(o - 1))), !0;
}, Dp = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const s = n.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === r.type) {
      if (e) {
        const l = s.before(i), a = s.after(i);
        n.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Ip = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const s = K(n, t.schema), i = e.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === s) {
      if (r) {
        const a = i.before(o), c = i.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Lp = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: s } = n;
  return t && e.delete(r, s), !0;
}, Pp = () => ({ state: n, dispatch: e }) => Hf(n, e), $p = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Bp = () => ({ state: n, dispatch: e }) => Yf(n, e);
function Fr(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((s) => t.strict ? e[s] === n[s] : go(e[s]) ? e[s].test(n[s]) : e[s] === n[s]) : !0;
}
function $i(n, e, t = {}) {
  return n.find((r) => r.type === e && Fr(r.attrs, t));
}
function zp(n, e, t = {}) {
  return !!$i(n, e, t);
}
function yo(n, e, t = {}) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if (n.parentOffset === r.offset && r.offset !== 0 && (r = n.parent.childBefore(n.parentOffset)), !r.node)
    return;
  const s = $i([...r.node.marks], e, t);
  if (!s)
    return;
  let i = r.index, o = n.start() + r.offset, l = i + 1, a = o + r.node.nodeSize;
  for ($i([...r.node.marks], e, t); i > 0 && s.isInSet(n.parent.child(i - 1).marks); )
    i -= 1, o -= n.parent.child(i).nodeSize;
  for (; l < n.parent.childCount && zp([...n.parent.child(l).marks], e, t); )
    a += n.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function gt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const Hp = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  const i = gt(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: d } = l;
  if (s) {
    const u = yo(a, i, e);
    if (u && u.from <= c && u.to >= d) {
      const h = A.create(o, u.from, u.to);
      t.setSelection(h);
    }
  }
  return !0;
}, Fp = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Qc(n) {
  return n instanceof A;
}
function Mt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Zc(n, e = null) {
  if (!e)
    return null;
  const t = E.atStart(n), r = E.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const s = t.from, i = r.to;
  return e === "all" ? A.create(n, Mt(0, s, i), Mt(n.content.size, s, i)) : A.create(n, Mt(e, s, i), Mt(e, s, i));
}
function bo() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const Vp = (n = null, e = {}) => ({ editor: t, view: r, tr: s, dispatch: i }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    bo() && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (i && n === null && !Qc(t.state.selection))
    return o(), !0;
  const l = Zc(s.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return i && (a || s.setSelection(l), a && s.storedMarks && s.setStoredMarks(s.storedMarks), o()), !0;
}, _p = (n, e) => (t) => n.every((r, s) => e(r, { ...t, index: s })), Wp = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), ed = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && ed(r);
  }
  return n;
};
function Bl(n) {
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return ed(t);
}
function Vr(n, e, t) {
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const r = typeof n == "object" && n !== null, s = typeof n == "string";
  if (r)
    try {
      return Array.isArray(n) && n.length > 0 ? b.fromArray(n.map((o) => e.nodeFromJSON(o))) : e.nodeFromJSON(n);
    } catch (i) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", i), Vr("", e, t);
    }
  if (s) {
    const i = nn.fromSchema(e);
    return t.slice ? i.parseSlice(Bl(n), t.parseOptions).content : i.parse(Bl(n), t.parseOptions);
  }
  return Vr("", e, t);
}
function jp(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const s = n.steps[r];
  if (!(s instanceof _ || s instanceof j))
    return;
  const i = n.mapping.maps[r];
  let o = 0;
  i.forEach((l, a, c, d) => {
    o === 0 && (o = d);
  }), n.setSelection(E.near(n.doc.resolve(o), t));
}
const Up = (n) => n.toString().startsWith("<"), Kp = (n, e, t) => ({ tr: r, dispatch: s, editor: i }) => {
  if (s) {
    t = {
      parseOptions: {},
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    const o = Vr(e, i.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...t.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, c = !0, d = !0;
    if ((Up(o) ? o : [o]).forEach((f) => {
      f.check(), c = c ? f.isText && f.marks.length === 0 : !1, d = d ? f.isBlock : !1;
    }), l === a && d) {
      const { parent: f } = r.doc.resolve(l);
      f.isTextblock && !f.type.spec.code && !f.childCount && (l -= 1, a += 1);
    }
    let h;
    c ? (Array.isArray(e) ? h = e.map((f) => f.text || "").join("") : typeof e == "object" && e && e.text ? h = e.text : h = e, r.insertText(h, l, a)) : (h = o, r.replaceWith(l, a, h)), t.updateSelection && jp(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: l, text: h }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: l, text: h });
  }
  return !0;
}, Jp = () => ({ state: n, dispatch: e }) => Kf(n, e), qp = () => ({ state: n, dispatch: e }) => Jf(n, e), Gp = () => ({ state: n, dispatch: e }) => Ff(n, e), Yp = () => ({ state: n, dispatch: e }) => jf(n, e), Xp = () => ({ tr: n, state: e, dispatch: t }) => {
  try {
    const r = Ss(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, Qp = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ss(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Zp = () => ({ state: n, dispatch: e }) => Vf(n, e), em = () => ({ state: n, dispatch: e }) => _f(n, e);
function td() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function tm(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, s, i, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      s = !0;
    else if (/^s(hift)?$/i.test(a))
      i = !0;
    else if (/^mod$/i.test(a))
      bo() || td() ? o = !0 : s = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), s && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), i && (t = `Shift-${t}`), t;
}
const nm = (n) => ({ editor: e, view: t, tr: r, dispatch: s }) => {
  const i = tm(n).split(/-(?!$)/), o = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: i.includes("Alt"),
    ctrlKey: i.includes("Ctrl"),
    metaKey: i.includes("Meta"),
    shiftKey: i.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a == null || a.steps.forEach((c) => {
    const d = c.map(r.mapping);
    d && s && r.maybeStep(d);
  }), !0;
};
function Fn(n, e, t = {}) {
  const { from: r, to: s, empty: i } = n.selection, o = e ? K(e, n.schema) : null, l = [];
  n.doc.nodesBetween(r, s, (u, h) => {
    if (u.isText)
      return;
    const f = Math.max(r, h), p = Math.min(s, h + u.nodeSize);
    l.push({
      node: u,
      from: f,
      to: p
    });
  });
  const a = s - r, c = l.filter((u) => o ? o.name === u.node.type.name : !0).filter((u) => Fr(u.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((u, h) => u + h.to - h.from, 0) >= a;
}
const rm = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = K(n, t.schema);
  return Fn(t, s, e) ? qf(t, r) : !1;
}, sm = () => ({ state: n, dispatch: e }) => Qf(n, e), im = (n) => ({ state: e, dispatch: t }) => {
  const r = K(n, e.schema);
  return op(r)(e, t);
}, om = () => ({ state: n, dispatch: e }) => Gf(n, e);
function Is(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function zl(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, s) => (t.includes(s) || (r[s] = n[s]), r), {});
}
const lm = (n, e) => ({ tr: t, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = Is(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (i = K(n, r.schema)), l === "mark" && (o = gt(n, r.schema)), s && t.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
      i && i === c.type && t.setNodeMarkup(d, void 0, zl(c.attrs, e)), o && c.marks.length && c.marks.forEach((u) => {
        o === u.type && t.addMark(d, d + c.nodeSize, o.create(zl(u.attrs, e)));
      });
    });
  }), !0) : !1;
}, am = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), cm = () => ({ tr: n, commands: e }) => e.setTextSelection({
  from: 0,
  to: n.doc.content.size
}), dm = () => ({ state: n, dispatch: e }) => Wf(n, e), um = () => ({ state: n, dispatch: e }) => Uf(n, e), hm = () => ({ state: n, dispatch: e }) => Zf(n, e), fm = () => ({ state: n, dispatch: e }) => np(n, e), pm = () => ({ state: n, dispatch: e }) => tp(n, e);
function nd(n, e, t = {}) {
  return Vr(n, e, { slice: !1, parseOptions: t });
}
const mm = (n, e = !1, t = {}) => ({ tr: r, editor: s, dispatch: i }) => {
  const { doc: o } = r, l = nd(n, s.schema, t);
  return i && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function Ls(n, e) {
  const t = gt(e, n.schema), { from: r, to: s, empty: i } = n.selection, o = [];
  i ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, s, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function gm(n, e) {
  const t = new no(n);
  return e.forEach((r) => {
    r.steps.forEach((s) => {
      t.step(s);
    });
  }), t;
}
function ym(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function bm(n, e, t) {
  const r = [];
  return n.nodesBetween(e.from, e.to, (s, i) => {
    t(s) && r.push({
      node: s,
      pos: i
    });
  }), r;
}
function rd(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function ko(n) {
  return (e) => rd(e.$from, n);
}
function km(n, e) {
  const t = Ie.fromSchema(e).serializeFragment(n), s = document.implementation.createHTMLDocument().createElement("div");
  return s.appendChild(t), s.innerHTML;
}
function wm(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Yc(n, t, e);
}
function xm(n, e) {
  const t = K(e, n.schema), { from: r, to: s } = n.selection, i = [];
  n.doc.nodesBetween(r, s, (l) => {
    i.push(l);
  });
  const o = i.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function sd(n, e) {
  const t = Is(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? xm(n, e) : t === "mark" ? Ls(n, e) : {};
}
function Sm(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const s = e(r);
    return Object.prototype.hasOwnProperty.call(t, s) ? !1 : t[s] = !0;
  });
}
function Cm(n) {
  const e = Sm(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((i, o) => o !== r).some((i) => t.oldRange.from >= i.oldRange.from && t.oldRange.to <= i.oldRange.to && t.newRange.from >= i.newRange.from && t.newRange.to <= i.newRange.to));
}
function Mm(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((s, i) => {
    const o = [];
    if (s.ranges.length)
      s.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = t[i];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(i).map(l, -1), d = e.slice(i).map(a), u = e.invert().map(c, -1), h = e.invert().map(d);
      r.push({
        oldRange: {
          from: u,
          to: h
        },
        newRange: {
          from: c,
          to: d
        }
      });
    });
  }), Cm(r);
}
function wo(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((s) => {
    const i = t.resolve(n - 1), o = yo(i, s.type);
    o && r.push({
      mark: s,
      ...o
    });
  }) : t.nodesBetween(n, e, (s, i) => {
    !s || (s == null ? void 0 : s.nodeSize) === void 0 || r.push(...s.marks.map((o) => ({
      from: i,
      to: i + s.nodeSize,
      mark: o
    })));
  }), r;
}
function wr(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const s = n.find((i) => i.type === e && i.name === r);
    return s ? s.attribute.keepOnSplit : !1;
  }));
}
function Bi(n, e, t = {}) {
  const { empty: r, ranges: s } = n.selection, i = e ? gt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((u) => i ? i.name === u.type.name : !0).find((u) => Fr(u.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (s.forEach(({ $from: u, $to: h }) => {
    const f = u.pos, p = h.pos;
    n.doc.nodesBetween(f, p, (m, g) => {
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(f, g), k = Math.min(p, g + m.nodeSize), C = k - y;
      o += C, l.push(...m.marks.map((R) => ({
        mark: R,
        from: y,
        to: k
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((u) => i ? i.name === u.mark.type.name : !0).filter((u) => Fr(u.mark.attrs, t, { strict: !1 })).reduce((u, h) => u + h.to - h.from, 0), c = l.filter((u) => i ? u.mark.type !== i && u.mark.type.excludes(i) : !0).reduce((u, h) => u + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function Tm(n, e, t = {}) {
  if (!e)
    return Fn(n, null, t) || Bi(n, null, t);
  const r = Is(e, n.schema);
  return r === "node" ? Fn(n, e, t) : r === "mark" ? Bi(n, e, t) : !1;
}
function Hl(n, e) {
  const { nodeExtensions: t } = Ns(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const s = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, i = O(S(r, "group", s));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function Am(n) {
  var e;
  const t = (e = n.type.createAndFill()) === null || e === void 0 ? void 0 : e.toJSON(), r = n.toJSON();
  return JSON.stringify(t) === JSON.stringify(r);
}
function Em(n, e, t) {
  var r;
  const { selection: s } = e;
  let i = null;
  if (Qc(s) && (i = s.$cursor), i) {
    const l = (r = n.storedMarks) !== null && r !== void 0 ? r : i.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: o } = s;
  return o.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(l.pos, a.pos, (d, u, h) => {
      if (c)
        return !1;
      if (d.isInline) {
        const f = !h || h.type.allowsMarkType(t), p = !!t.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(t));
        c = f && p;
      }
      return !c;
    }), c;
  });
}
const vm = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  const { selection: i } = t, { empty: o, ranges: l } = i, a = gt(n, r.schema);
  if (s)
    if (o) {
      const c = Ls(r, a);
      t.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const d = c.$from.pos, u = c.$to.pos;
        r.doc.nodesBetween(d, u, (h, f) => {
          const p = Math.max(f, d), m = Math.min(f + h.nodeSize, u);
          h.marks.find((y) => y.type === a) ? h.marks.forEach((y) => {
            a === y.type && t.addMark(p, m, a.create({
              ...y.attrs,
              ...e
            }));
          }) : t.addMark(p, m, a.create(e));
        });
      });
  return Em(r, t, a);
}, Om = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), Nm = (n, e = {}) => ({ state: t, dispatch: r, chain: s }) => {
  const i = K(n, t.schema);
  return i.isTextblock ? s().command(({ commands: o }) => Il(i, e)(t) ? !0 : o.clearNodes()).command(({ state: o }) => Il(i, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Rm = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, s = Mt(n, 0, r.content.size), i = T.create(r, s);
    e.setSelection(i);
  }
  return !0;
}, Dm = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: s, to: i } = typeof n == "number" ? { from: n, to: n } : n, o = A.atStart(r).from, l = A.atEnd(r).to, a = Mt(s, o, l), c = Mt(i, o, l), d = A.create(r, a, c);
    e.setSelection(d);
  }
  return !0;
}, Im = (n) => ({ state: e, dispatch: t }) => {
  const r = K(n, e.schema);
  return cp(r)(e, t);
};
function Fl(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((s) => e == null ? void 0 : e.includes(s.type.name));
    n.tr.ensureMarks(r);
  }
}
const Lm = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: s }) => {
  const { selection: i, doc: o } = e, { $from: l, $to: a } = i, c = s.extensionManager.attributes, d = wr(c, l.node().type.name, l.node().attrs);
  if (i instanceof T && i.node.isBlock)
    return !l.parentOffset || !Xt(o, l.pos) ? !1 : (r && (n && Fl(t, s.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const u = a.parentOffset === a.parent.content.size;
    i instanceof A && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : ym(l.node(-1).contentMatchAt(l.indexAfter(-1)));
    let f = u && h ? [
      {
        type: h,
        attrs: d
      }
    ] : void 0, p = Xt(e.doc, e.mapping.map(l.pos), 1, f);
    if (!f && !p && Xt(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (p = !0, f = h ? [
      {
        type: h,
        attrs: d
      }
    ] : void 0), p && (e.split(e.mapping.map(l.pos), 1, f), h && !u && !l.parentOffset && l.parent.type !== h)) {
      const m = e.mapping.map(l.before()), g = e.doc.resolve(m);
      l.node(-1).canReplaceWith(g.index(), g.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    n && Fl(t, s.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, Pm = (n) => ({ tr: e, state: t, dispatch: r, editor: s }) => {
  var i;
  const o = K(n, t.schema), { $from: l, $to: a } = t.selection, c = t.selection.node;
  if (c && c.isBlock || l.depth < 2 || !l.sameParent(a))
    return !1;
  const d = l.node(-1);
  if (d.type !== o)
    return !1;
  const u = s.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== o || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (r) {
      let g = b.empty;
      const y = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let I = l.depth - y; I >= l.depth - 3; I -= 1)
        g = b.from(l.node(I).copy(g));
      const k = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, C = wr(u, l.node().type.name, l.node().attrs), R = ((i = o.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(C)) || void 0;
      g = g.append(b.from(o.createAndFill(null, R) || void 0));
      const v = l.before(l.depth - (y - 1));
      e.replace(v, l.after(-k), new x(g, 4 - y, 0));
      let M = -1;
      e.doc.nodesBetween(v, e.doc.content.size, (I, J) => {
        if (M > -1)
          return !1;
        I.isTextblock && I.content.size === 0 && (M = J + 1);
      }), M > -1 && e.setSelection(A.near(e.doc.resolve(M))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null, f = wr(u, d.type.name, d.attrs), p = wr(u, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const m = h ? [
    { type: o, attrs: f },
    { type: h, attrs: p }
  ] : [{ type: o, attrs: f }];
  if (!Xt(e.doc, l.pos, 2))
    return !1;
  if (r) {
    const { selection: g, storedMarks: y } = t, { splittableMarks: k } = s.extensionManager, C = y || g.$to.parentOffset && g.$from.marks();
    if (e.split(l.pos, 2, m).scrollIntoView(), !C || !r)
      return !0;
    const R = C.filter((v) => k.includes(v.type.name));
    e.ensureMarks(R);
  }
  return !0;
}, si = (n, e) => {
  const t = ko((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const s = n.doc.nodeAt(r);
  return t.node.type === (s == null ? void 0 : s.type) && pt(n.doc, t.pos) && n.join(t.pos), !0;
}, ii = (n, e) => {
  const t = ko((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const s = n.doc.nodeAt(r);
  return t.node.type === (s == null ? void 0 : s.type) && pt(n.doc, r) && n.join(r), !0;
}, $m = (n, e, t, r = {}) => ({ editor: s, tr: i, state: o, dispatch: l, chain: a, commands: c, can: d }) => {
  const { extensions: u, splittableMarks: h } = s.extensionManager, f = K(n, o.schema), p = K(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: k } = m, C = y.blockRange(k), R = g || m.$to.parentOffset && m.$from.marks();
  if (!C)
    return !1;
  const v = ko((M) => Hl(M.type.name, u))(m);
  if (C.depth >= 1 && v && C.depth - v.depth <= 1) {
    if (v.node.type === f)
      return c.liftListItem(p);
    if (Hl(v.node.type.name, u) && f.validContent(v.node.content) && l)
      return a().command(() => (i.setNodeMarkup(v.pos, f), !0)).command(() => si(i, f)).command(() => ii(i, f)).run();
  }
  return !t || !R || !l ? a().command(() => d().wrapInList(f, r) ? !0 : c.clearNodes()).wrapInList(f, r).command(() => si(i, f)).command(() => ii(i, f)).run() : a().command(() => {
    const M = d().wrapInList(f, r), I = R.filter((J) => h.includes(J.type.name));
    return i.ensureMarks(I), M ? !0 : c.clearNodes();
  }).wrapInList(f, r).command(() => si(i, f)).command(() => ii(i, f)).run();
}, Bm = (n, e = {}, t = {}) => ({ state: r, commands: s }) => {
  const { extendEmptyMarkRange: i = !1 } = t, o = gt(n, r.schema);
  return Bi(r, o, e) ? s.unsetMark(o, { extendEmptyMarkRange: i }) : s.setMark(o, e);
}, zm = (n, e, t = {}) => ({ state: r, commands: s }) => {
  const i = K(n, r.schema), o = K(e, r.schema);
  return Fn(r, i, t) ? s.setNode(o) : s.setNode(i, t);
}, Hm = (n, e = {}) => ({ state: t, commands: r }) => {
  const s = K(n, t.schema);
  return Fn(t, s, e) ? r.lift(s) : r.wrapIn(s, e);
}, Fm = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const s = t[r];
    let i;
    if (s.spec.isInputRules && (i = s.getState(n))) {
      if (e) {
        const o = n.tr, l = i.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (i.text) {
          const a = o.doc.resolve(i.from).marks();
          o.replaceWith(i.from, i.to, n.schema.text(i.text, a));
        } else
          o.delete(i.from, i.to);
      }
      return !0;
    }
  }
  return !1;
}, Vm = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: s } = t;
  return r || e && s.forEach((i) => {
    n.removeMark(i.$from.pos, i.$to.pos);
  }), !0;
}, _m = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  var i;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = gt(n, r.schema), { $from: c, empty: d, ranges: u } = l;
  if (!s)
    return !0;
  if (d && o) {
    let { from: h, to: f } = l;
    const p = (i = c.marks().find((g) => g.type === a)) === null || i === void 0 ? void 0 : i.attrs, m = yo(c, a, p);
    m && (h = m.from, f = m.to), t.removeMark(h, f, a);
  } else
    u.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, Wm = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = Is(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (i = K(n, r.schema)), l === "mark" && (o = gt(n, r.schema)), s && t.selection.ranges.forEach((a) => {
    const c = a.$from.pos, d = a.$to.pos;
    r.doc.nodesBetween(c, d, (u, h) => {
      i && i === u.type && t.setNodeMarkup(h, void 0, {
        ...u.attrs,
        ...e
      }), o && u.marks.length && u.marks.forEach((f) => {
        if (o === f.type) {
          const p = Math.max(h, c), m = Math.min(h + u.nodeSize, d);
          t.addMark(p, m, o.create({
            ...f.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, jm = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = K(n, t.schema);
  return rp(s, e)(t, r);
}, Um = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = K(n, t.schema);
  return sp(s, e)(t, r);
};
var Km = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Ap,
  clearContent: Ep,
  clearNodes: vp,
  command: Op,
  createParagraphNear: Np,
  cut: Rp,
  deleteCurrentNode: Dp,
  deleteNode: Ip,
  deleteRange: Lp,
  deleteSelection: Pp,
  enter: $p,
  exitCode: Bp,
  extendMarkRange: Hp,
  first: Fp,
  focus: Vp,
  forEach: _p,
  insertContent: Wp,
  insertContentAt: Kp,
  joinUp: Jp,
  joinDown: qp,
  joinBackward: Gp,
  joinForward: Yp,
  joinItemBackward: Xp,
  joinItemForward: Qp,
  joinTextblockBackward: Zp,
  joinTextblockForward: em,
  keyboardShortcut: nm,
  lift: rm,
  liftEmptyBlock: sm,
  liftListItem: im,
  newlineInCode: om,
  resetAttributes: lm,
  scrollIntoView: am,
  selectAll: cm,
  selectNodeBackward: dm,
  selectNodeForward: um,
  selectParentNode: hm,
  selectTextblockEnd: fm,
  selectTextblockStart: pm,
  setContent: mm,
  setMark: vm,
  setMeta: Om,
  setNode: Nm,
  setNodeSelection: Rm,
  setTextSelection: Dm,
  sinkListItem: Im,
  splitBlock: Lm,
  splitListItem: Pm,
  toggleList: $m,
  toggleMark: Bm,
  toggleNode: zm,
  toggleWrap: Hm,
  undoInputRule: Fm,
  unsetAllMarks: Vm,
  unsetMark: _m,
  updateAttributes: Wm,
  wrapIn: jm,
  wrapInList: Um
});
const Jm = he.create({
  name: "commands",
  addCommands() {
    return {
      ...Km
    };
  }
}), qm = he.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new X({
        key: new ce("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Gm = he.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new X({
        key: new ce("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
}), Ym = he.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: d, $anchor: u } = a, { pos: h, parent: f } = u, p = u.parent.isTextblock && h > 0 ? l.doc.resolve(h - 1) : u, m = p.parent.type.spec.isolating, g = u.pos - u.parentOffset, y = m && p.parent.childCount === 1 ? g === u.pos : E.atStart(c).from === h;
        return !d || !f.type.isTextblock || f.textContent.length || !y || y && u.parent.type.name === "paragraph" ? !1 : o.clearNodes();
      }),
      () => o.deleteSelection(),
      () => o.joinBackward(),
      () => o.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: o }) => [
      () => o.deleteSelection(),
      () => o.deleteCurrentNode(),
      () => o.joinForward(),
      () => o.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: o }) => [
        () => o.newlineInCode(),
        () => o.createParagraphNear(),
        () => o.liftEmptyBlock(),
        () => o.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, s = {
      ...r
    }, i = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return bo() || td() ? i : s;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new X({
        key: new ce("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((p) => p.docChanged) && !e.doc.eq(t.doc)))
            return;
          const { empty: s, from: i, to: o } = e.selection, l = E.atStart(e.doc).from, a = E.atEnd(e.doc).to;
          if (s || !(i === l && o === a) || !(t.doc.textBetween(0, t.doc.content.size, " ", " ").length === 0))
            return;
          const u = t.tr, h = vs({
            state: t,
            transaction: u
          }), { commands: f } = new Os({
            editor: this.editor,
            state: h
          });
          if (f.clearNodes(), !!u.steps.length)
            return u;
        }
      })
    ];
  }
}), Xm = he.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new X({
        key: new ce("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class xt {
  constructor(e, t, r = !1, s = null) {
    this.currentNode = null, this.actualDepth = null, this.isBlock = r, this.resolvedPos = e, this.editor = t, this.currentNode = s;
  }
  get name() {
    return this.node.type.name;
  }
  get node() {
    return this.currentNode || this.resolvedPos.node();
  }
  get element() {
    return this.editor.view.domAtPos(this.pos).node;
  }
  get depth() {
    var e;
    return (e = this.actualDepth) !== null && e !== void 0 ? e : this.resolvedPos.depth;
  }
  get pos() {
    return this.resolvedPos.pos;
  }
  get content() {
    return this.node.content;
  }
  set content(e) {
    let t = this.from, r = this.to;
    if (this.isBlock) {
      if (this.content.size === 0) {
        console.error(`You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
        return;
      }
      t = this.from + 1, r = this.to - 1;
    }
    this.editor.commands.insertContentAt({ from: t, to: r }, e);
  }
  get attributes() {
    return this.node.attrs;
  }
  get textContent() {
    return this.node.textContent;
  }
  get size() {
    return this.node.nodeSize;
  }
  get from() {
    return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
  }
  get range() {
    return {
      from: this.from,
      to: this.to
    };
  }
  get to() {
    return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + (this.node.isText ? 0 : 1);
  }
  get parent() {
    if (this.depth === 0)
      return null;
    const e = this.resolvedPos.start(this.resolvedPos.depth - 1), t = this.resolvedPos.doc.resolve(e);
    return new xt(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new xt(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new xt(e, this.editor);
  }
  get children() {
    const e = [];
    return this.node.content.forEach((t, r) => {
      const s = t.isBlock && !t.isTextblock, i = this.pos + r + 1, o = this.resolvedPos.doc.resolve(i);
      if (!s && o.depth <= this.depth)
        return;
      const l = new xt(o, this.editor, s, s ? t : null);
      s && (l.actualDepth = this.depth + 1), e.push(new xt(o, this.editor, s, s ? t : null));
    }), e;
  }
  get firstChild() {
    return this.children[0] || null;
  }
  get lastChild() {
    const e = this.children;
    return e[e.length - 1] || null;
  }
  closest(e, t = {}) {
    let r = null, s = this.parent;
    for (; s && !r; ) {
      if (s.node.type.name === e)
        if (Object.keys(t).length > 0) {
          const i = s.node.attrs, o = Object.keys(t);
          for (let l = 0; l < o.length; l += 1) {
            const a = o[l];
            if (i[a] !== t[a])
              break;
          }
        } else
          r = s;
      s = s.parent;
    }
    return r;
  }
  querySelector(e, t = {}) {
    return this.querySelectorAll(e, t, !0)[0] || null;
  }
  querySelectorAll(e, t = {}, r = !1) {
    let s = [];
    if (!this.children || this.children.length === 0)
      return s;
    const i = Object.keys(t);
    return this.children.forEach((o) => {
      r && s.length > 0 || (o.node.type.name === e && i.every((a) => t[a] === o.node.attrs[a]) && s.push(o), !(r && s.length > 0) && (s = s.concat(o.querySelectorAll(e, t, r))));
    }), s;
  }
  setAttribute(e) {
    const t = this.editor.state.selection;
    this.editor.chain().setTextSelection(this.from).updateAttributes(this.node.type.name, e).setTextSelection(t.from).run();
  }
}
const Qm = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
function Zm(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const s = document.createElement("style");
  return e && s.setAttribute("nonce", e), s.setAttribute("data-tiptap-style", ""), s.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(s), s;
}
class eg extends dp {
  constructor(e = {}) {
    super(), this.isFocused = !1, this.extensionStorage = {}, this.options = {
      element: document.createElement("div"),
      content: "",
      injectCSS: !0,
      injectNonce: void 0,
      extensions: [],
      autofocus: !1,
      editable: !0,
      editorProps: {},
      parseOptions: {},
      coreExtensionOptions: {},
      enableInputRules: !0,
      enablePasteRules: !0,
      enableCoreExtensions: !0,
      onBeforeCreate: () => null,
      onCreate: () => null,
      onUpdate: () => null,
      onSelectionUpdate: () => null,
      onTransaction: () => null,
      onFocus: () => null,
      onBlur: () => null,
      onDestroy: () => null
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.createView(), this.injectCSS(), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), window.setTimeout(() => {
      this.isDestroyed || (this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }));
    }, 0);
  }
  /**
   * Returns the editor storage.
   */
  get storage() {
    return this.extensionStorage;
  }
  /**
   * An object of all registered commands.
   */
  get commands() {
    return this.commandManager.commands;
  }
  /**
   * Create a command chain to call multiple commands at once.
   */
  chain() {
    return this.commandManager.chain();
  }
  /**
   * Check if a command or a command chain can be executed. Without executing it.
   */
  can() {
    return this.commandManager.can();
  }
  /**
   * Inject CSS styles.
   */
  injectCSS() {
    this.options.injectCSS && document && (this.css = Zm(Qm, this.options.injectNonce));
  }
  /**
   * Update editor options.
   *
   * @param options A list of options
   */
  setOptions(e = {}) {
    this.options = {
      ...this.options,
      ...e
    }, !(!this.view || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  /**
   * Update editable state of the editor.
   */
  setEditable(e, t = !0) {
    this.setOptions({ editable: e }), t && this.emit("update", { editor: this, transaction: this.state.tr });
  }
  /**
   * Returns whether the editor is editable.
   */
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  /**
   * Returns the editor state.
   */
  get state() {
    return this.view.state;
  }
  /**
   * Register a ProseMirror plugin.
   *
   * @param plugin A ProseMirror plugin
   * @param handlePlugins Control how to merge the plugin into the existing plugins.
   */
  registerPlugin(e, t) {
    const r = Gc(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], s = this.state.reconfigure({ plugins: r });
    this.view.updateState(s);
  }
  /**
   * Unregister a ProseMirror plugin.
   *
   * @param nameOrPluginKey The plugins name
   */
  unregisterPlugin(e) {
    if (this.isDestroyed)
      return;
    const t = typeof e == "string" ? `${e}$` : e.key, r = this.state.reconfigure({
      // @ts-ignore
      plugins: this.state.plugins.filter((s) => !s.key.startsWith(t))
    });
    this.view.updateState(r);
  }
  /**
   * Creates an extension manager.
   */
  createExtensionManager() {
    var e, t;
    const s = [...this.options.enableCoreExtensions ? [
      qm,
      Tp.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) === null || e === void 0 ? void 0 : e.clipboardTextSerializer) === null || t === void 0 ? void 0 : t.blockSeparator
      }),
      Jm,
      Gm,
      Ym,
      Xm
    ] : [], ...this.options.extensions].filter((i) => ["extension", "node", "mark"].includes(i == null ? void 0 : i.type));
    this.extensionManager = new Gt(s, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new Os({
      editor: this
    });
  }
  /**
   * Creates a ProseMirror schema.
   */
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  /**
   * Creates a ProseMirror view.
   */
  createView() {
    const e = nd(this.options.content, this.schema, this.options.parseOptions), t = Zc(e, this.options.autofocus);
    this.view = new Of(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: qt.create({
        doc: e,
        selection: t || void 0
      })
    });
    const r = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(r), this.createNodeViews(), this.prependClass();
    const s = this.view.dom;
    s.editor = this;
  }
  /**
   * Creates all node views.
   */
  createNodeViews() {
    this.view.setProps({
      nodeViews: this.extensionManager.nodeViews
    });
  }
  /**
   * Prepend class name to element.
   */
  prependClass() {
    this.view.dom.className = `tiptap ${this.view.dom.className}`;
  }
  captureTransaction(e) {
    this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
    const t = this.capturedTransaction;
    return this.capturedTransaction = null, t;
  }
  /**
   * The callback over which to send transactions (state updates) produced by the view.
   *
   * @param transaction An editor state transaction
   */
  dispatchTransaction(e) {
    if (this.view.isDestroyed)
      return;
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = e;
        return;
      }
      e.steps.forEach((o) => {
        var l;
        return (l = this.capturedTransaction) === null || l === void 0 ? void 0 : l.step(o);
      });
      return;
    }
    const t = this.state.apply(e), r = !this.state.selection.eq(t.selection);
    this.view.updateState(t), this.emit("transaction", {
      editor: this,
      transaction: e
    }), r && this.emit("selectionUpdate", {
      editor: this,
      transaction: e
    });
    const s = e.getMeta("focus"), i = e.getMeta("blur");
    s && this.emit("focus", {
      editor: this,
      event: s.event,
      transaction: e
    }), i && this.emit("blur", {
      editor: this,
      event: i.event,
      transaction: e
    }), !(!e.docChanged || e.getMeta("preventUpdate")) && this.emit("update", {
      editor: this,
      transaction: e
    });
  }
  /**
   * Get attributes of the currently selected node or mark.
   */
  getAttributes(e) {
    return sd(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, s = typeof e == "string" ? t : e;
    return Tm(this.state, r, s);
  }
  /**
   * Get the document as JSON.
   */
  getJSON() {
    return this.state.doc.toJSON();
  }
  /**
   * Get the document as HTML.
   */
  getHTML() {
    return km(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return wm(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...Xc(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Am(this.state.doc);
  }
  /**
   * Get the number of characters for the current document.
   *
   * @deprecated
   */
  getCharacterCount() {
    return console.warn('[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.'), this.state.doc.content.size - 2;
  }
  /**
   * Destroy the editor.
   */
  destroy() {
    this.emit("destroy"), this.view && this.view.destroy(), this.removeAllListeners();
  }
  /**
   * Check if the editor is already destroyed.
   */
  get isDestroyed() {
    var e;
    return !(!((e = this.view) === null || e === void 0) && e.docView);
  }
  $node(e, t) {
    var r;
    return ((r = this.$doc) === null || r === void 0 ? void 0 : r.querySelector(e, t)) || null;
  }
  $nodes(e, t) {
    var r;
    return ((r = this.$doc) === null || r === void 0 ? void 0 : r.querySelectorAll(e, t)) || null;
  }
  $pos(e) {
    const t = this.state.doc.resolve(e);
    return new xt(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}
function an(n) {
  return new Rs({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = O(n.getAttributes, void 0, r);
      if (s === !1 || s === null)
        return null;
      const { tr: i } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = t.from + l.indexOf(o), d = c + o.length;
        if (wo(t.from, t.to, e.doc).filter((f) => f.mark.type.excluded.find((m) => m === n.type && m !== f.mark.type)).filter((f) => f.to > c).length)
          return null;
        d < t.to && i.delete(d, t.to), c > t.from && i.delete(t.from + a, c);
        const h = t.from + a + o.length;
        i.addMark(t.from + a, h, n.type.create(s || {})), i.removeStoredMark(n.type);
      }
    }
  });
}
function tg(n) {
  return new Rs({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = O(n.getAttributes, void 0, r) || {}, { tr: i } = e, o = t.from;
      let l = t.to;
      const a = n.type.create(s);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let d = o + c;
        d > l ? d = l : l = d + r[1].length;
        const u = r[0][r[0].length - 1];
        i.insertText(u, o + r[0].length - 1), i.replaceWith(d, l, a);
      } else r[0] && i.insert(o - 1, n.type.create(s)).delete(i.mapping.map(o), i.mapping.map(l));
      i.scrollIntoView();
    }
  });
}
function zi(n) {
  return new Rs({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = e.doc.resolve(t.from), i = O(n.getAttributes, void 0, r) || {};
      if (!s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, i);
    }
  });
}
function Vn(n) {
  return new Rs({
    find: n.find,
    handler: ({ state: e, range: t, match: r, chain: s }) => {
      const i = O(n.getAttributes, void 0, r) || {}, o = e.tr.delete(t.from, t.to), a = o.doc.resolve(t.from).blockRange(), c = a && to(a, n.type, i);
      if (!c)
        return null;
      if (o.wrap(a, c), n.keepMarks && n.editor) {
        const { selection: u, storedMarks: h } = e, { splittableMarks: f } = n.editor.extensionManager, p = h || u.$to.parentOffset && u.$from.marks();
        if (p) {
          const m = p.filter((g) => f.includes(g.type.name));
          o.ensureMarks(m);
        }
      }
      if (n.keepAttributes) {
        const u = n.type.name === "bulletList" || n.type.name === "orderedList" ? "listItem" : "taskList";
        s().updateAttributes(u, i).run();
      }
      const d = o.doc.resolve(t.from - 1).nodeBefore;
      d && d.type === n.type && pt(o.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, d)) && o.join(t.from - 1);
    }
  });
}
class ke {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = O(S(this, "addOptions", {
      name: this.name
    }))), this.storage = O(S(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new ke(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = Ds(this.options, e), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new ke({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = O(S(t, "addOptions", {
      name: t.name
    })), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, s = e.state.selection.$from;
    if (s.pos === s.end()) {
      const o = s.marks();
      if (!!!o.find((c) => (c == null ? void 0 : c.type.name) === t.name))
        return !1;
      const a = o.find((c) => (c == null ? void 0 : c.type.name) === t.name);
      return a && r.removeStoredMark(a), r.insertText(" ", s.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
let Q = class Hi {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = O(S(this, "addOptions", {
      name: this.name
    }))), this.storage = O(S(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Hi(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = Ds(this.options, e), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Hi({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = O(S(t, "addOptions", {
      name: t.name
    })), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
};
function $t(n) {
  return new bp({
    find: n.find,
    handler: ({ state: e, range: t, match: r, pasteEvent: s }) => {
      const i = O(n.getAttributes, void 0, r, s);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = t.to;
      if (l) {
        const d = a.search(/\S/), u = t.from + a.indexOf(l), h = u + l.length;
        if (wo(t.from, t.to, e.doc).filter((p) => p.mark.type.excluded.find((g) => g === n.type && g !== p.mark.type)).filter((p) => p.to > u).length)
          return null;
        h < t.to && o.delete(h, t.to), u > t.from && o.delete(t.from + d, u), c = t.from + d + l.length, o.addMark(t.from + d, c, n.type.create(i || {})), o.removeStoredMark(n.type);
      }
    }
  });
}
const ng = /^\s*>\s$/, rg = Q.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: !0,
  parseHTML() {
    return [
      { tag: "blockquote" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["blockquote", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands: n }) => n.wrapIn(this.name),
      toggleBlockquote: () => ({ commands: n }) => n.toggleWrap(this.name),
      unsetBlockquote: () => ({ commands: n }) => n.lift(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
    };
  },
  addInputRules() {
    return [
      Vn({
        find: ng,
        type: this.type
      })
    ];
  }
}), sg = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, ig = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, og = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, lg = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, ag = ke.create({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b",
        getAttrs: (n) => n.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight",
        getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["strong", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBold: () => ({ commands: n }) => n.setMark(this.name),
      toggleBold: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetBold: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [
      an({
        find: sg,
        type: this.type
      }),
      an({
        find: og,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: ig,
        type: this.type
      }),
      $t({
        find: lg,
        type: this.type
      })
    ];
  }
}), cg = Q.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", $(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Vl = ke.create({
  name: "textStyle",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (n) => n.hasAttribute("style") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["span", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: n, commands: e }) => {
        const t = Ls(n, this.type);
        return Object.entries(t).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), _l = /^\s*([-+*])\s$/, dg = Q.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      { tag: "ul" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["ul", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(cg.name, this.editor.getAttributes(Vl.name)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let n = Vn({
      find: _l,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = Vn({
      find: _l,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(Vl.name),
      editor: this.editor
    })), [
      n
    ];
  }
}), ug = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/, hg = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g, fg = ke.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: !0,
  exitable: !0,
  parseHTML() {
    return [
      { tag: "code" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["code", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setCode: () => ({ commands: n }) => n.setMark(this.name),
      toggleCode: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetCode: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      an({
        find: ug,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: hg,
        type: this.type
      })
    ];
  }
}), pg = /^```([a-z]+)?[\s\n]$/, mg = /^~~~([a-z]+)?[\s\n]$/, gg = Q.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (n) => {
          var e;
          const { languageClassPrefix: t } = this.options, i = [...((e = n.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((o) => o.startsWith(t)).map((o) => o.replace(t, ""))[0];
          return i || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "pre",
      $(this.options.HTMLAttributes, e),
      [
        "code",
        {
          class: n.attrs.language ? this.options.languageClassPrefix + n.attrs.language : null
        },
        0
      ]
    ];
  },
  addCommands() {
    return {
      setCodeBlock: (n) => ({ commands: e }) => e.setNode(this.name, n),
      toggleCodeBlock: (n) => ({ commands: e }) => e.toggleNode(this.name, "paragraph", n)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      // remove code block when at start of document or code block is empty
      Backspace: () => {
        const { empty: n, $anchor: e } = this.editor.state.selection, t = e.pos === 1;
        return !n || e.parent.type.name !== this.name ? !1 : t || !e.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      // exit node on triple enter
      Enter: ({ editor: n }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: e } = n, { selection: t } = e, { $from: r, empty: s } = t;
        if (!s || r.parent.type !== this.type)
          return !1;
        const i = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !i || !o ? !1 : n.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: n }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = n, { selection: t, doc: r } = e, { $from: s, empty: i } = t;
        if (!i || s.parent.type !== this.type || !(s.parentOffset === s.parent.nodeSize - 2))
          return !1;
        const l = s.after();
        return l === void 0 || r.nodeAt(l) ? !1 : n.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      zi({
        find: pg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      zi({
        find: mg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new X({
        key: new ce("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (n, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), s = r ? JSON.parse(r) : void 0, i = s == null ? void 0 : s.mode;
            if (!t || !i)
              return !1;
            const { tr: o } = n.state;
            return n.state.selection.from === n.state.doc.nodeSize - (1 + n.state.selection.$to.depth * 2) ? o.insert(n.state.selection.from - 1, this.type.create({ language: i })) : o.replaceSelectionWith(this.type.create({ language: i })), o.setSelection(A.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(t.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), n.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), yg = Q.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function bg(n = {}) {
  return new X({
    view(e) {
      return new kg(e, n);
    }
  });
}
class kg {
  constructor(e, t) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = t.width) !== null && r !== void 0 ? r : 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((s) => {
      let i = (o) => {
        this[s](o);
      };
      return e.dom.addEventListener(s, i), { name: s, handler: i };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    this.cursorPos != null && t.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, r;
    if (t) {
      let l = e.nodeBefore, a = e.nodeAfter;
      if (l || a) {
        let c = this.editorView.nodeDOM(this.cursorPos - (l ? l.nodeSize : 0));
        if (c) {
          let d = c.getBoundingClientRect(), u = l ? d.bottom : d.top;
          l && a && (u = (u + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), r = { left: d.left, right: d.right, top: u - this.width / 2, bottom: u + this.width / 2 };
        }
      }
    }
    if (!r) {
      let l = this.editorView.coordsAtPos(this.cursorPos);
      r = { left: l.left - this.width / 2, right: l.left + this.width / 2, top: l.top, bottom: l.bottom };
    }
    let s = this.editorView.dom.offsetParent;
    this.element || (this.element = s.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
    let i, o;
    if (!s || s == document.body && getComputedStyle(s).position == "static")
      i = -pageXOffset, o = -pageYOffset;
    else {
      let l = s.getBoundingClientRect();
      i = l.left - s.scrollLeft, o = l.top - s.scrollTop;
    }
    this.element.style.left = r.left - i + "px", this.element.style.top = r.top - o + "px", this.element.style.width = r.right - r.left + "px", this.element.style.height = r.bottom - r.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), s = r && r.type.spec.disableDropCursor, i = typeof s == "function" ? s(this.editorView, t, e) : s;
    if (t && !i) {
      let o = t.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let l = tc(this.editorView.state.doc, o, this.editorView.dragging.slice);
        l != null && (o = l);
      }
      this.setCursor(o), this.scheduleRemoval(5e3);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    (e.target == this.editorView.dom || !this.editorView.dom.contains(e.relatedTarget)) && this.setCursor(null);
  }
}
const wg = he.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      bg(this.options)
    ];
  }
});
class H extends E {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return H.valid(r) ? new H(r) : E.near(r);
  }
  content() {
    return x.empty;
  }
  eq(e) {
    return e instanceof H && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new H(e.resolve(t.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new xo(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !xg(e) || !Sg(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let s = t.contentMatchAt(e.index()).defaultType;
    return s && s.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, t, r = !1) {
    e: for (; ; ) {
      if (!r && H.valid(e))
        return e;
      let s = e.pos, i = null;
      for (let o = e.depth; ; o--) {
        let l = e.node(o);
        if (t > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
          i = l.child(t > 0 ? e.indexAfter(o) : e.index(o) - 1);
          break;
        } else if (o == 0)
          return null;
        s += t;
        let a = e.doc.resolve(s);
        if (H.valid(a))
          return a;
      }
      for (; ; ) {
        let o = t > 0 ? i.firstChild : i.lastChild;
        if (!o) {
          if (i.isAtom && !i.isText && !T.isSelectable(i)) {
            e = e.doc.resolve(s + i.nodeSize * t), r = !1;
            continue e;
          }
          break;
        }
        i = o, s += t;
        let l = e.doc.resolve(s);
        if (H.valid(l))
          return l;
      }
      return null;
    }
  }
}
H.prototype.visible = !1;
H.findFrom = H.findGapCursorFrom;
E.jsonID("gapcursor", H);
class xo {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new xo(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return H.valid(t) ? new H(t) : E.near(t);
  }
}
function xg(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let s = r.child(t - 1); ; s = s.lastChild) {
      if (s.childCount == 0 && !s.inlineContent || s.isAtom || s.type.spec.isolating)
        return !0;
      if (s.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Sg(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let s = r.child(t); ; s = s.firstChild) {
      if (s.childCount == 0 && !s.inlineContent || s.isAtom || s.type.spec.isolating)
        return !0;
      if (s.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Cg() {
  return new X({
    props: {
      decorations: Eg,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && H.valid(t) ? new H(t) : null;
      },
      handleClick: Tg,
      handleKeyDown: Mg,
      handleDOMEvents: { beforeinput: Ag }
    }
  });
}
const Mg = fo({
  ArrowLeft: cr("horiz", -1),
  ArrowRight: cr("horiz", 1),
  ArrowUp: cr("vert", -1),
  ArrowDown: cr("vert", 1)
});
function cr(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, s, i) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof A) {
      if (!i.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = H.findGapCursorFrom(l, e, a);
    return c ? (s && s(r.tr.setSelection(new H(c))), !0) : !1;
  };
}
function Tg(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!H.valid(r))
    return !1;
  let s = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return s && s.inside > -1 && T.isSelectable(n.state.doc.nodeAt(s.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new H(r))), !0);
}
function Ag(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof H))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let s = b.empty;
  for (let o = r.length - 1; o >= 0; o--)
    s = b.from(r[o].createAndFill(null, s));
  let i = n.state.tr.replace(t.pos, t.pos, new x(s, 0, 0));
  return i.setSelection(A.near(i.doc.resolve(t.pos + 1))), n.dispatch(i), !1;
}
function Eg(n) {
  if (!(n.selection instanceof H))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", z.create(n.doc, [le.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const vg = he.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      Cg()
    ];
  },
  extendNodeSchema(n) {
    var e;
    const t = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      allowGapCursor: (e = O(S(n, "allowGapCursor", t))) !== null && e !== void 0 ? e : null
    };
  }
}), Og = Q.create({
  name: "hardBreak",
  addOptions() {
    return {
      keepMarks: !0,
      HTMLAttributes: {}
    };
  },
  inline: !0,
  group: "inline",
  selectable: !1,
  parseHTML() {
    return [
      { tag: "br" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["br", $(this.options.HTMLAttributes, n)];
  },
  renderText() {
    return `
`;
  },
  addCommands() {
    return {
      setHardBreak: () => ({ commands: n, chain: e, state: t, editor: r }) => n.first([
        () => n.exitCode(),
        () => n.command(() => {
          const { selection: s, storedMarks: i } = t;
          if (s.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: l } = r.extensionManager, a = i || s.$to.parentOffset && s.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: d }) => {
            if (d && a && o) {
              const u = a.filter((h) => l.includes(h.type.name));
              c.ensureMarks(u);
            }
            return !0;
          }).run();
        })
      ])
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
}), Ng = Q.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: !0,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: !1
      }
    };
  },
  parseHTML() {
    return this.options.levels.map((n) => ({
      tag: `h${n}`,
      attrs: { level: n }
    }));
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [`h${this.options.levels.includes(n.attrs.level) ? n.attrs.level : this.options.levels[0]}`, $(this.options.HTMLAttributes, e), 0];
  },
  addCommands() {
    return {
      setHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.setNode(this.name, n) : !1,
      toggleHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.toggleNode(this.name, "paragraph", n) : !1
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce((n, e) => ({
      ...n,
      [`Mod-Alt-${e}`]: () => this.editor.commands.toggleHeading({ level: e })
    }), {});
  },
  addInputRules() {
    return this.options.levels.map((n) => zi({
      find: new RegExp(`^(#{1,${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
});
var _r = 200, U = function() {
};
U.prototype.append = function(e) {
  return e.length ? (e = U.from(e), !this.length && e || e.length < _r && this.leafAppend(e) || this.length < _r && e.leafPrepend(this) || this.appendInner(e)) : this;
};
U.prototype.prepend = function(e) {
  return e.length ? U.from(e).append(this) : this;
};
U.prototype.appendInner = function(e) {
  return new Rg(this, e);
};
U.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? U.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
U.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
U.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
U.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var s = [];
  return this.forEach(function(i, o) {
    return s.push(e(i, o));
  }, t, r), s;
};
U.from = function(e) {
  return e instanceof U ? e : e && e.length ? new id(e) : U.empty;
};
var id = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(s, i) {
    return s == 0 && i == this.length ? this : new e(this.values.slice(s, i));
  }, e.prototype.getInner = function(s) {
    return this.values[s];
  }, e.prototype.forEachInner = function(s, i, o, l) {
    for (var a = i; a < o; a++)
      if (s(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(s, i, o, l) {
    for (var a = i - 1; a >= o; a--)
      if (s(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(s) {
    if (this.length + s.length <= _r)
      return new e(this.values.concat(s.flatten()));
  }, e.prototype.leafPrepend = function(s) {
    if (this.length + s.length <= _r)
      return new e(s.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(U);
U.empty = new id([]);
var Rg = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, s, i, o) {
    var l = this.left.length;
    if (s < l && this.left.forEachInner(r, s, Math.min(i, l), o) === !1 || i > l && this.right.forEachInner(r, Math.max(s - l, 0), Math.min(this.length, i) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, s, i, o) {
    var l = this.left.length;
    if (s > l && this.right.forEachInvertedInner(r, s - l, Math.max(i, l) - l, o + l) === !1 || i < l && this.left.forEachInvertedInner(r, Math.min(s, l), i, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, s) {
    if (r == 0 && s == this.length)
      return this;
    var i = this.left.length;
    return s <= i ? this.left.slice(r, s) : r >= i ? this.right.slice(r - i, s - i) : this.left.slice(r, i).append(this.right.slice(0, s - i));
  }, e.prototype.leafAppend = function(r) {
    var s = this.right.leafAppend(r);
    if (s)
      return new e(this.left, s);
  }, e.prototype.leafPrepend = function(r) {
    var s = this.left.leafPrepend(r);
    if (s)
      return new e(s, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(U);
const Dg = 500;
class xe {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let s, i;
    t && (s = this.remapping(r, this.items.length), i = s.maps.length);
    let o = e.tr, l, a, c = [], d = [];
    return this.items.forEach((u, h) => {
      if (!u.step) {
        s || (s = this.remapping(r, h + 1), i = s.maps.length), i--, d.push(u);
        return;
      }
      if (s) {
        d.push(new Ee(u.map));
        let f = u.step.map(s.slice(i)), p;
        f && o.maybeStep(f).doc && (p = o.mapping.maps[o.mapping.maps.length - 1], c.push(new Ee(p, void 0, void 0, c.length + d.length))), i--, p && s.appendMap(p, i);
      } else
        o.maybeStep(u.step);
      if (u.selection)
        return l = s ? u.selection.map(s.slice(i)) : u.selection, a = new xe(this.items.slice(0, r).append(d.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, s) {
    let i = [], o = this.eventCount, l = this.items, a = !s && l.length ? l.get(l.length - 1) : null;
    for (let d = 0; d < e.steps.length; d++) {
      let u = e.steps[d].invert(e.docs[d]), h = new Ee(e.mapping.maps[d], u, t), f;
      (f = a && a.merge(h)) && (h = f, d ? i.pop() : l = l.slice(0, l.length - 1)), i.push(h), t && (o++, t = void 0), s || (a = h);
    }
    let c = o - r.depth;
    return c > Lg && (l = Ig(l, c), o -= c), new xe(l.append(i), o);
  }
  remapping(e, t) {
    let r = new Yt();
    return this.items.forEach((s, i) => {
      let o = s.mirrorOffset != null && i - s.mirrorOffset >= e ? r.maps.length - s.mirrorOffset : void 0;
      r.appendMap(s.map, o);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new xe(this.items.append(e.map((t) => new Ee(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], s = Math.max(0, this.items.length - t), i = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, s);
    let a = t;
    this.items.forEach((h) => {
      let f = i.getMirror(--a);
      if (f == null)
        return;
      o = Math.min(o, f);
      let p = i.maps[f];
      if (h.step) {
        let m = e.steps[f].invert(e.docs[f]), g = h.selection && h.selection.map(i.slice(a + 1, f));
        g && l++, r.push(new Ee(p, m, g));
      } else
        r.push(new Ee(p));
    }, s);
    let c = [];
    for (let h = t; h < o; h++)
      c.push(new Ee(i.maps[h]));
    let d = this.items.slice(0, s).append(c).append(r), u = new xe(d, l);
    return u.emptyItemCount() > Dg && (u = u.compress(this.items.length - r.length)), u;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, s = [], i = 0;
    return this.items.forEach((o, l) => {
      if (l >= e)
        s.push(o), o.selection && i++;
      else if (o.step) {
        let a = o.step.map(t.slice(r)), c = a && a.getMap();
        if (r--, c && t.appendMap(c, r), a) {
          let d = o.selection && o.selection.map(t.slice(r));
          d && i++;
          let u = new Ee(c.invert(), a, d), h, f = s.length - 1;
          (h = s.length && s[f].merge(u)) ? s[f] = h : s.push(u);
        }
      } else o.map && r--;
    }, this.items.length, 0), new xe(U.from(s.reverse()), i);
  }
}
xe.empty = new xe(U.empty, 0);
function Ig(n, e) {
  let t;
  return n.forEach((r, s) => {
    if (r.selection && e-- == 0)
      return t = s, !1;
  }), n.slice(t);
}
class Ee {
  constructor(e, t, r, s) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = s;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new Ee(t.getMap().invert(), t, this.selection);
    }
  }
}
class Xe {
  constructor(e, t, r, s, i) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = s, this.prevComposition = i;
  }
}
const Lg = 20;
function Pg(n, e, t, r) {
  let s = t.getMeta(Dt), i;
  if (s)
    return s.historyState;
  t.getMeta(zg) && (n = new Xe(n.done, n.undone, null, 0, -1));
  let o = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (o && o.getMeta(Dt))
    return o.getMeta(Dt).redo ? new Xe(n.done.addTransform(t, void 0, r, xr(e)), n.undone, Wl(t.mapping.maps[t.steps.length - 1]), n.prevTime, n.prevComposition) : new Xe(n.done, n.undone.addTransform(t, void 0, r, xr(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), a = n.prevTime == 0 || !o && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !$g(t, n.prevRanges)), c = o ? oi(n.prevRanges, t.mapping) : Wl(t.mapping.maps[t.steps.length - 1]);
    return new Xe(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, xr(e)), xe.empty, c, t.time, l ?? n.prevComposition);
  } else return (i = t.getMeta("rebased")) ? new Xe(n.done.rebased(t, i), n.undone.rebased(t, i), oi(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new Xe(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), oi(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function $g(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, s) => {
    for (let i = 0; i < e.length; i += 2)
      r <= e[i + 1] && s >= e[i] && (t = !0);
  }), t;
}
function Wl(n) {
  let e = [];
  return n.forEach((t, r, s, i) => e.push(s, i)), e;
}
function oi(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let s = e.map(n[r], 1), i = e.map(n[r + 1], -1);
    s <= i && t.push(s, i);
  }
  return t;
}
function Bg(n, e, t) {
  let r = xr(e), s = Dt.get(e).spec.config, i = (t ? n.undone : n.done).popEvent(e, r);
  if (!i)
    return null;
  let o = i.selection.resolve(i.transform.doc), l = (t ? n.done : n.undone).addTransform(i.transform, e.selection.getBookmark(), s, r), a = new Xe(t ? l : i.remaining, t ? i.remaining : l, null, 0, -1);
  return i.transform.setSelection(o).setMeta(Dt, { redo: t, historyState: a });
}
let li = !1, jl = null;
function xr(n) {
  let e = n.plugins;
  if (jl != e) {
    li = !1, jl = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        li = !0;
        break;
      }
  }
  return li;
}
const Dt = new ce("history"), zg = new ce("closeHistory");
function Hg(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new X({
    key: Dt,
    state: {
      init() {
        return new Xe(xe.empty, xe.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return Pg(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, s = r == "historyUndo" ? ld : r == "historyRedo" ? ad : null;
          return s ? (t.preventDefault(), s(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
function od(n, e) {
  return (t, r) => {
    let s = Dt.getState(t);
    if (!s || (n ? s.undone : s.done).eventCount == 0)
      return !1;
    if (r) {
      let i = Bg(s, t, n);
      i && r(e ? i.scrollIntoView() : i);
    }
    return !0;
  };
}
const ld = od(!1, !0), ad = od(!0, !0), Fg = he.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => ld(n, e),
      redo: () => ({ state: n, dispatch: e }) => ad(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      Hg(this.options)
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
}), Vg = Q.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["hr", $(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: n, state: e }) => {
        const { $to: t } = e.selection, r = n();
        return t.parentOffset === 0 ? r.insertContentAt(Math.max(t.pos - 2, 0), { type: this.name }) : r.insertContent({ type: this.name }), r.command(({ tr: s, dispatch: i }) => {
          var o;
          if (i) {
            const { $to: l } = s.selection, a = l.end();
            if (l.nodeAfter)
              l.nodeAfter.isTextblock ? s.setSelection(A.create(s.doc, l.pos + 1)) : l.nodeAfter.isBlock ? s.setSelection(T.create(s.doc, l.pos)) : s.setSelection(A.create(s.doc, l.pos));
            else {
              const c = (o = l.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (s.insert(a, c), s.setSelection(A.create(s.doc, a + 1)));
            }
            s.scrollIntoView();
          }
          return !0;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      tg({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), _g = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, Wg = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, jg = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, Ug = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, Kg = ke.create({
  name: "italic",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "em"
      },
      {
        tag: "i",
        getAttrs: (n) => n.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=italic"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["em", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands: n }) => n.setMark(this.name),
      toggleItalic: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetItalic: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [
      an({
        find: _g,
        type: this.type
      }),
      an({
        find: jg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: Wg,
        type: this.type
      }),
      $t({
        find: Ug,
        type: this.type
      })
    ];
  }
}), Jg = Q.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", $(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), qg = Q.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", $(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Ul = ke.create({
  name: "textStyle",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (n) => n.hasAttribute("style") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["span", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: n, commands: e }) => {
        const t = Ls(n, this.type);
        return Object.entries(t).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), Kl = /^(\d+)\.\s$/, Gg = Q.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (n) => n.hasAttribute("start") ? parseInt(n.getAttribute("start") || "", 10) : 1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    const { start: e, ...t } = n;
    return e === 1 ? ["ol", $(this.options.HTMLAttributes, t), 0] : ["ol", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(qg.name, this.editor.getAttributes(Ul.name)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let n = Vn({
      find: Kl,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = Vn({
      find: Kl,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(Ul.name) }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1],
      editor: this.editor
    })), [
      n
    ];
  }
}), Yg = Q.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      { tag: "p" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["p", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands: n }) => n.setNode(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
}), Xg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, Qg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, Zg = ke.create({
  name: "strike",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "s"
      },
      {
        tag: "del"
      },
      {
        tag: "strike"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("line-through") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["s", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setStrike: () => ({ commands: n }) => n.setMark(this.name),
      toggleStrike: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetStrike: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-s": () => this.editor.commands.toggleStrike()
    };
  },
  addInputRules() {
    return [
      an({
        find: Xg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: Qg,
        type: this.type
      })
    ];
  }
}), ey = Q.create({
  name: "text",
  group: "inline"
}), cd = he.create({
  name: "starterKit",
  addExtensions() {
    var n, e, t, r, s, i, o, l, a, c, d, u, h, f, p, m, g, y;
    const k = [];
    return this.options.blockquote !== !1 && k.push(rg.configure((n = this.options) === null || n === void 0 ? void 0 : n.blockquote)), this.options.bold !== !1 && k.push(ag.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && k.push(dg.configure((t = this.options) === null || t === void 0 ? void 0 : t.bulletList)), this.options.code !== !1 && k.push(fg.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && k.push(gg.configure((s = this.options) === null || s === void 0 ? void 0 : s.codeBlock)), this.options.document !== !1 && k.push(yg.configure((i = this.options) === null || i === void 0 ? void 0 : i.document)), this.options.dropcursor !== !1 && k.push(wg.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && k.push(vg.configure((l = this.options) === null || l === void 0 ? void 0 : l.gapcursor)), this.options.hardBreak !== !1 && k.push(Og.configure((a = this.options) === null || a === void 0 ? void 0 : a.hardBreak)), this.options.heading !== !1 && k.push(Ng.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && k.push(Fg.configure((d = this.options) === null || d === void 0 ? void 0 : d.history)), this.options.horizontalRule !== !1 && k.push(Vg.configure((u = this.options) === null || u === void 0 ? void 0 : u.horizontalRule)), this.options.italic !== !1 && k.push(Kg.configure((h = this.options) === null || h === void 0 ? void 0 : h.italic)), this.options.listItem !== !1 && k.push(Jg.configure((f = this.options) === null || f === void 0 ? void 0 : f.listItem)), this.options.orderedList !== !1 && k.push(Gg.configure((p = this.options) === null || p === void 0 ? void 0 : p.orderedList)), this.options.paragraph !== !1 && k.push(Yg.configure((m = this.options) === null || m === void 0 ? void 0 : m.paragraph)), this.options.strike !== !1 && k.push(Zg.configure((g = this.options) === null || g === void 0 ? void 0 : g.strike)), this.options.text !== !1 && k.push(ey.configure((y = this.options) === null || y === void 0 ? void 0 : y.text)), k;
  }
});
let ai;
const bt = (...n) => n.join(" "), ty = (n, e) => {
  const t = document.createElement(n);
  if (e)
    for (const r of Object.keys(e))
      t.setAttribute(r, e[r]);
  return t;
}, dd = (n) => {
  const e = ny(n.name);
  customElements.get(e) || customElements.define(e, n);
}, ny = (n) => n.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (e, t) => (t ? "-" : "") + e.toLowerCase()), ry = () => {
  ai || (ai = new MutationObserver((n) => {
    for (const e of n)
      if (e.type === "childList")
        for (let t of e.addedNodes)
          t.constructor.prototype.onMount && t.constructor.prototype.onMount.apply(t);
  }), ai.observe(document, { childList: !0, subtree: !0 }));
}, sy = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", iy = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", cn = (n, e) => {
  for (const t in e)
    n[t] = e[t];
  return n;
}, Fi = "numeric", Vi = "ascii", _i = "alpha", Sr = "asciinumeric", dr = "alphanumeric", Wi = "domain", ud = "emoji", oy = "scheme", ly = "slashscheme", Jl = "whitespace";
function ay(n, e) {
  return n in e || (e[n] = []), e[n];
}
function Tt(n, e, t) {
  e[Fi] && (e[Sr] = !0, e[dr] = !0), e[Vi] && (e[Sr] = !0, e[_i] = !0), e[Sr] && (e[dr] = !0), e[_i] && (e[dr] = !0), e[dr] && (e[Wi] = !0), e[ud] && (e[Wi] = !0);
  for (const r in e) {
    const s = ay(r, t);
    s.indexOf(n) < 0 && s.push(n);
  }
}
function cy(n, e) {
  const t = {};
  for (const r in e)
    e[r].indexOf(n) >= 0 && (t[r] = !0);
  return t;
}
function oe(n) {
  n === void 0 && (n = null), this.j = {}, this.jr = [], this.jd = null, this.t = n;
}
oe.groups = {};
oe.prototype = {
  accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go(n) {
    const e = this, t = e.j[n];
    if (t)
      return t;
    for (let r = 0; r < e.jr.length; r++) {
      const s = e.jr[r][0], i = e.jr[r][1];
      if (i && s.test(n))
        return i;
    }
    return e.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has(n, e) {
    return e === void 0 && (e = !1), e ? n in this.j : !!this.go(n);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta(n, e, t, r) {
    for (let s = 0; s < n.length; s++)
      this.tt(n[s], e, t, r);
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr(n, e, t, r) {
    r = r || oe.groups;
    let s;
    return e && e.j ? s = e : (s = new oe(e), t && r && Tt(e, t, r)), this.jr.push([n, s]), s;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts(n, e, t, r) {
    let s = this;
    const i = n.length;
    if (!i)
      return s;
    for (let o = 0; o < i - 1; o++)
      s = s.tt(n[o]);
    return s.tt(n[i - 1], e, t, r);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt(n, e, t, r) {
    r = r || oe.groups;
    const s = this;
    if (e && e.j)
      return s.j[n] = e, e;
    const i = e;
    let o, l = s.go(n);
    if (l ? (o = new oe(), cn(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new oe(), i) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = cn(cy(o.t, r), t);
          Tt(i, a, r);
        } else t && Tt(i, t, r);
      o.t = i;
    }
    return s.j[n] = o, o;
  }
};
const N = (n, e, t, r, s) => n.ta(e, t, r, s), pe = (n, e, t, r, s) => n.tr(e, t, r, s), ql = (n, e, t, r, s) => n.ts(e, t, r, s), w = (n, e, t, r, s) => n.tt(e, t, r, s), Ve = "WORD", ji = "UWORD", _n = "LOCALHOST", Ui = "TLD", Ki = "UTLD", Cr = "SCHEME", Kt = "SLASH_SCHEME", So = "NUM", hd = "WS", Co = "NL", vn = "OPENBRACE", On = "CLOSEBRACE", Wr = "OPENBRACKET", jr = "CLOSEBRACKET", Ur = "OPENPAREN", Kr = "CLOSEPAREN", Jr = "OPENANGLEBRACKET", qr = "CLOSEANGLEBRACKET", Gr = "FULLWIDTHLEFTPAREN", Yr = "FULLWIDTHRIGHTPAREN", Xr = "LEFTCORNERBRACKET", Qr = "RIGHTCORNERBRACKET", Zr = "LEFTWHITECORNERBRACKET", es = "RIGHTWHITECORNERBRACKET", ts = "FULLWIDTHLESSTHAN", ns = "FULLWIDTHGREATERTHAN", rs = "AMPERSAND", ss = "APOSTROPHE", is = "ASTERISK", Qe = "AT", ls = "BACKSLASH", as = "BACKTICK", cs = "CARET", et = "COLON", Mo = "COMMA", ds = "DOLLAR", ve = "DOT", us = "EQUALS", To = "EXCLAMATION", Oe = "HYPHEN", hs = "PERCENT", fs = "PIPE", ps = "PLUS", ms = "POUND", gs = "QUERY", Ao = "QUOTE", Eo = "SEMI", Ne = "SLASH", Nn = "TILDE", ys = "UNDERSCORE", fd = "EMOJI", bs = "SYM";
var pd = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: Ve,
  UWORD: ji,
  LOCALHOST: _n,
  TLD: Ui,
  UTLD: Ki,
  SCHEME: Cr,
  SLASH_SCHEME: Kt,
  NUM: So,
  WS: hd,
  NL: Co,
  OPENBRACE: vn,
  CLOSEBRACE: On,
  OPENBRACKET: Wr,
  CLOSEBRACKET: jr,
  OPENPAREN: Ur,
  CLOSEPAREN: Kr,
  OPENANGLEBRACKET: Jr,
  CLOSEANGLEBRACKET: qr,
  FULLWIDTHLEFTPAREN: Gr,
  FULLWIDTHRIGHTPAREN: Yr,
  LEFTCORNERBRACKET: Xr,
  RIGHTCORNERBRACKET: Qr,
  LEFTWHITECORNERBRACKET: Zr,
  RIGHTWHITECORNERBRACKET: es,
  FULLWIDTHLESSTHAN: ts,
  FULLWIDTHGREATERTHAN: ns,
  AMPERSAND: rs,
  APOSTROPHE: ss,
  ASTERISK: is,
  AT: Qe,
  BACKSLASH: ls,
  BACKTICK: as,
  CARET: cs,
  COLON: et,
  COMMA: Mo,
  DOLLAR: ds,
  DOT: ve,
  EQUALS: us,
  EXCLAMATION: To,
  HYPHEN: Oe,
  PERCENT: hs,
  PIPE: fs,
  PLUS: ps,
  POUND: ms,
  QUERY: gs,
  QUOTE: Ao,
  SEMI: Eo,
  SLASH: Ne,
  TILDE: Nn,
  UNDERSCORE: ys,
  EMOJI: fd,
  SYM: bs
});
const Wt = /[a-z]/, ci = new RegExp("\\p{L}", "u"), di = new RegExp("\\p{Emoji}", "u"), ui = /\d/, Gl = /\s/, Yl = `
`, dy = "️", uy = "‍";
let ur = null, hr = null;
function hy(n) {
  n === void 0 && (n = []);
  const e = {};
  oe.groups = e;
  const t = new oe();
  ur == null && (ur = Xl(sy)), hr == null && (hr = Xl(iy)), w(t, "'", ss), w(t, "{", vn), w(t, "}", On), w(t, "[", Wr), w(t, "]", jr), w(t, "(", Ur), w(t, ")", Kr), w(t, "<", Jr), w(t, ">", qr), w(t, "（", Gr), w(t, "）", Yr), w(t, "「", Xr), w(t, "」", Qr), w(t, "『", Zr), w(t, "』", es), w(t, "＜", ts), w(t, "＞", ns), w(t, "&", rs), w(t, "*", is), w(t, "@", Qe), w(t, "`", as), w(t, "^", cs), w(t, ":", et), w(t, ",", Mo), w(t, "$", ds), w(t, ".", ve), w(t, "=", us), w(t, "!", To), w(t, "-", Oe), w(t, "%", hs), w(t, "|", fs), w(t, "+", ps), w(t, "#", ms), w(t, "?", gs), w(t, '"', Ao), w(t, "/", Ne), w(t, ";", Eo), w(t, "~", Nn), w(t, "_", ys), w(t, "\\", ls);
  const r = pe(t, ui, So, {
    [Fi]: !0
  });
  pe(r, ui, r);
  const s = pe(t, Wt, Ve, {
    [Vi]: !0
  });
  pe(s, Wt, s);
  const i = pe(t, ci, ji, {
    [_i]: !0
  });
  pe(i, Wt), pe(i, ci, i);
  const o = pe(t, Gl, hd, {
    [Jl]: !0
  });
  w(t, Yl, Co, {
    [Jl]: !0
  }), w(o, Yl), pe(o, Gl, o);
  const l = pe(t, di, fd, {
    [ud]: !0
  });
  pe(l, di, l), w(l, dy, l);
  const a = w(l, uy);
  pe(a, di, l);
  const c = [[Wt, s]], d = [[Wt, null], [ci, i]];
  for (let u = 0; u < ur.length; u++)
    qe(t, ur[u], Ui, Ve, c);
  for (let u = 0; u < hr.length; u++)
    qe(t, hr[u], Ki, ji, d);
  Tt(Ui, {
    tld: !0,
    ascii: !0
  }, e), Tt(Ki, {
    utld: !0,
    alpha: !0
  }, e), qe(t, "file", Cr, Ve, c), qe(t, "mailto", Cr, Ve, c), qe(t, "http", Kt, Ve, c), qe(t, "https", Kt, Ve, c), qe(t, "ftp", Kt, Ve, c), qe(t, "ftps", Kt, Ve, c), Tt(Cr, {
    scheme: !0,
    ascii: !0
  }, e), Tt(Kt, {
    slashscheme: !0,
    ascii: !0
  }, e), n = n.sort((u, h) => u[0] > h[0] ? 1 : -1);
  for (let u = 0; u < n.length; u++) {
    const h = n[u][0], p = n[u][1] ? {
      [oy]: !0
    } : {
      [ly]: !0
    };
    h.indexOf("-") >= 0 ? p[Wi] = !0 : Wt.test(h) ? ui.test(h) ? p[Sr] = !0 : p[Vi] = !0 : p[Fi] = !0, ql(t, h, h, p);
  }
  return ql(t, "localhost", _n, {
    ascii: !0
  }), t.jd = new oe(bs), {
    start: t,
    tokens: cn({
      groups: e
    }, pd)
  };
}
function fy(n, e) {
  const t = py(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = t.length, s = [];
  let i = 0, o = 0;
  for (; o < r; ) {
    let l = n, a = null, c = 0, d = null, u = -1, h = -1;
    for (; o < r && (a = l.go(t[o])); )
      l = a, l.accepts() ? (u = 0, h = 0, d = l) : u >= 0 && (u += t[o].length, h++), c += t[o].length, i += t[o].length, o++;
    i -= u, o -= h, c -= u, s.push({
      t: d.t,
      // token type/name
      v: e.slice(i - c, i),
      // string value
      s: i - c,
      // start index
      e: i
      // end index (excluding)
    });
  }
  return s;
}
function py(n) {
  const e = [], t = n.length;
  let r = 0;
  for (; r < t; ) {
    let s = n.charCodeAt(r), i, o = s < 55296 || s > 56319 || r + 1 === t || (i = n.charCodeAt(r + 1)) < 56320 || i > 57343 ? n[r] : n.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function qe(n, e, t, r, s) {
  let i;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    n.j[a] ? i = n.j[a] : (i = new oe(r), i.jr = s.slice(), n.j[a] = i), n = i;
  }
  return i = new oe(t), i.jr = s.slice(), n.j[e[o - 1]] = i, i;
}
function Xl(n) {
  const e = [], t = [];
  let r = 0, s = "0123456789";
  for (; r < n.length; ) {
    let i = 0;
    for (; s.indexOf(n[r + i]) >= 0; )
      i++;
    if (i > 0) {
      e.push(t.join(""));
      for (let o = parseInt(n.substring(r, r + i), 10); o > 0; o--)
        t.pop();
      r += i;
    } else
      t.push(n[r]), r++;
  }
  return e;
}
const Wn = {
  defaultProtocol: "http",
  events: null,
  format: Ql,
  formatHref: Ql,
  nl2br: !1,
  tagName: "a",
  target: null,
  rel: null,
  validate: !0,
  truncate: 1 / 0,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};
function vo(n, e) {
  e === void 0 && (e = null);
  let t = cn({}, Wn);
  n && (t = cn(t, n instanceof vo ? n.o : n));
  const r = t.ignoreTags, s = [];
  for (let i = 0; i < r.length; i++)
    s.push(r[i].toUpperCase());
  this.o = t, e && (this.defaultRender = e), this.ignoreTags = s;
}
vo.prototype = {
  o: Wn,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender(n) {
    return n;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check(n) {
    return this.get("validate", n.toString(), n);
  },
  // Private methods
  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get(n, e, t) {
    const r = e != null;
    let s = this.o[n];
    return s && (typeof s == "object" ? (s = t.t in s ? s[t.t] : Wn[n], typeof s == "function" && r && (s = s(e, t))) : typeof s == "function" && r && (s = s(e, t.t, t)), s);
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj(n, e, t) {
    let r = this.o[n];
    return typeof r == "function" && e != null && (r = r(e, t.t, t)), r;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render(n) {
    const e = n.render(this);
    return (this.get("render", null, n) || this.defaultRender)(e, n.t, n);
  }
};
function Ql(n) {
  return n;
}
function md(n, e) {
  this.t = "token", this.v = n, this.tk = e;
}
md.prototype = {
  isLink: !1,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
  */
  toHref(n) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString(n) {
    const e = this.toString(), t = n.get("truncate", e, this), r = n.get("format", e, this);
    return t && r.length > t ? r.substring(0, t) + "…" : r;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref(n) {
    return n.get("formatHref", this.toHref(n.get("defaultProtocol")), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject(n) {
    return n === void 0 && (n = Wn.defaultProtocol), {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(n),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject(n) {
    return {
      type: this.t,
      value: this.toFormattedString(n),
      isLink: this.isLink,
      href: this.toFormattedHref(n),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate(n) {
    return n.get("validate", this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render(n) {
    const e = this, t = this.toHref(n.get("defaultProtocol")), r = n.get("formatHref", t, this), s = n.get("tagName", t, e), i = this.toFormattedString(n), o = {}, l = n.get("className", t, e), a = n.get("target", t, e), c = n.get("rel", t, e), d = n.getObj("attributes", t, e), u = n.getObj("events", t, e);
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), d && cn(o, d), {
      tagName: s,
      attributes: o,
      content: i,
      eventListeners: u
    };
  }
};
function Ps(n, e) {
  class t extends md {
    constructor(s, i) {
      super(s, i), this.t = n;
    }
  }
  for (const r in e)
    t.prototype[r] = e[r];
  return t.t = n, t;
}
const Zl = Ps("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), ea = Ps("text"), my = Ps("nl"), fr = Ps("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(n) {
    return n === void 0 && (n = Wn.defaultProtocol), this.hasProtocol() ? this.v : `${n}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const n = this.tk;
    return n.length >= 2 && n[0].t !== _n && n[1].t === et;
  }
}), me = (n) => new oe(n);
function gy(n) {
  let {
    groups: e
  } = n;
  const t = e.domain.concat([rs, is, Qe, ls, as, cs, ds, us, Oe, So, hs, fs, ps, ms, Ne, bs, Nn, ys]), r = [ss, et, Mo, ve, To, gs, Ao, Eo, Jr, qr, vn, On, jr, Wr, Ur, Kr, Gr, Yr, Xr, Qr, Zr, es, ts, ns], s = [rs, ss, is, ls, as, cs, ds, us, Oe, vn, On, hs, fs, ps, ms, gs, Ne, bs, Nn, ys], i = me(), o = w(i, Nn);
  N(o, s, o), N(o, e.domain, o);
  const l = me(), a = me(), c = me();
  N(i, e.domain, l), N(i, e.scheme, a), N(i, e.slashscheme, c), N(l, s, o), N(l, e.domain, l);
  const d = w(l, Qe);
  w(o, Qe, d), w(a, Qe, d), w(c, Qe, d);
  const u = w(o, ve);
  N(u, s, o), N(u, e.domain, o);
  const h = me();
  N(d, e.domain, h), N(h, e.domain, h);
  const f = w(h, ve);
  N(f, e.domain, h);
  const p = me(Zl);
  N(f, e.tld, p), N(f, e.utld, p), w(d, _n, p);
  const m = w(h, Oe);
  N(m, e.domain, h), N(p, e.domain, h), w(p, ve, f), w(p, Oe, m);
  const g = w(p, et);
  N(g, e.numeric, Zl);
  const y = w(l, Oe), k = w(l, ve);
  N(y, e.domain, l), N(k, s, o), N(k, e.domain, l);
  const C = me(fr);
  N(k, e.tld, C), N(k, e.utld, C), N(C, e.domain, l), N(C, s, o), w(C, ve, k), w(C, Oe, y), w(C, Qe, d);
  const R = w(C, et), v = me(fr);
  N(R, e.numeric, v);
  const M = me(fr), I = me();
  N(M, t, M), N(M, r, I), N(I, t, M), N(I, r, I), w(C, Ne, M), w(v, Ne, M);
  const J = w(a, et), D = w(c, et), Ae = w(D, Ne), Je = w(Ae, Ne);
  N(a, e.domain, l), w(a, ve, k), w(a, Oe, y), N(c, e.domain, l), w(c, ve, k), w(c, Oe, y), N(J, e.domain, M), w(J, Ne, M), N(Je, e.domain, M), N(Je, t, M), w(Je, Ne, M);
  const tr = [
    [vn, On],
    // {}
    [Wr, jr],
    // []
    [Ur, Kr],
    // ()
    [Jr, qr],
    // <>
    [Gr, Yr],
    // （）
    [Xr, Qr],
    // 「」
    [Zr, es],
    // 『』
    [ts, ns]
    // ＜＞
  ];
  for (let Fs = 0; Fs < tr.length; Fs++) {
    const [Lo, Vs] = tr[Fs], nr = w(M, Lo);
    w(I, Lo, nr), w(nr, Vs, M);
    const Ft = me(fr);
    N(nr, t, Ft);
    const yn = me();
    N(nr, r), N(Ft, t, Ft), N(Ft, r, yn), N(yn, t, Ft), N(yn, r, yn), w(Ft, Vs, M), w(yn, Vs, M);
  }
  return w(i, _n, C), w(i, Co, my), {
    start: i,
    tokens: pd
  };
}
function yy(n, e, t) {
  let r = t.length, s = 0, i = [], o = [];
  for (; s < r; ) {
    let l = n, a = null, c = null, d = 0, u = null, h = -1;
    for (; s < r && !(a = l.go(t[s].t)); )
      o.push(t[s++]);
    for (; s < r && (c = a || l.go(t[s].t)); )
      a = null, l = c, l.accepts() ? (h = 0, u = l) : h >= 0 && h++, s++, d++;
    if (h < 0)
      s -= d, s < r && (o.push(t[s]), s++);
    else {
      o.length > 0 && (i.push(hi(ea, e, o)), o = []), s -= h, d -= h;
      const f = u.t, p = t.slice(s - d, s);
      i.push(hi(f, e, p));
    }
  }
  return o.length > 0 && i.push(hi(ea, e, o)), i;
}
function hi(n, e, t) {
  const r = t[0].s, s = t[t.length - 1].e, i = e.slice(r, s);
  return new n(i, t);
}
const by = typeof console < "u" && console && console.warn || (() => {
}), ky = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", B = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function wy() {
  oe.groups = {}, B.scanner = null, B.parser = null, B.tokenQueue = [], B.pluginQueue = [], B.customSchemes = [], B.initialized = !1;
}
function ta(n, e) {
  if (e === void 0 && (e = !1), B.initialized && by(`linkifyjs: already initialized - will not register custom scheme "${n}" ${ky}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(n))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  B.customSchemes.push([n, e]);
}
function xy() {
  B.scanner = hy(B.customSchemes);
  for (let n = 0; n < B.tokenQueue.length; n++)
    B.tokenQueue[n][1]({
      scanner: B.scanner
    });
  B.parser = gy(B.scanner.tokens);
  for (let n = 0; n < B.pluginQueue.length; n++)
    B.pluginQueue[n][1]({
      scanner: B.scanner,
      parser: B.parser
    });
  B.initialized = !0;
}
function gd(n) {
  return B.initialized || xy(), yy(B.parser.start, n, fy(B.scanner.start, n));
}
function yd(n, e, t) {
  if (e === void 0 && (e = null), t === void 0 && (t = null), e && typeof e == "object") {
    if (t)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    t = e, e = null;
  }
  const r = new vo(t), s = gd(n), i = [];
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    l.isLink && (!e || l.t === e) && r.check(l) && i.push(l.toFormattedObject(r));
  }
  return i;
}
function Sy(n) {
  return n.length === 1 ? n[0].isLink : n.length === 3 && n[1].isLink ? ["()", "[]"].includes(n[0].value + n[2].value) : !1;
}
function Cy(n) {
  return new X({
    key: new ce("autolink"),
    appendTransaction: (e, t, r) => {
      const s = e.some((c) => c.docChanged) && !t.doc.eq(r.doc), i = e.some((c) => c.getMeta("preventAutolink"));
      if (!s || i)
        return;
      const { tr: o } = r, l = gm(t.doc, [...e]);
      if (Mm(l).forEach(({ newRange: c }) => {
        const d = bm(r.doc, c, (f) => f.isTextblock);
        let u, h;
        if (d.length > 1 ? (u = d[0], h = r.doc.textBetween(u.pos, u.pos + u.node.nodeSize, void 0, " ")) : d.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (u = d[0], h = r.doc.textBetween(u.pos, c.to, void 0, " ")), u && h) {
          const f = h.split(" ").filter((y) => y !== "");
          if (f.length <= 0)
            return !1;
          const p = f[f.length - 1], m = u.pos + h.lastIndexOf(p);
          if (!p)
            return !1;
          const g = gd(p).map((y) => y.toObject());
          if (!Sy(g))
            return !1;
          g.filter((y) => y.isLink).map((y) => ({
            ...y,
            from: m + y.start + 1,
            to: m + y.end + 1
          })).filter((y) => r.schema.marks.code ? !r.doc.rangeHasMark(y.from, y.to, r.schema.marks.code) : !0).filter((y) => n.validate ? n.validate(y.value) : !0).forEach((y) => {
            wo(y.from, y.to, r.doc).some((k) => k.mark.type === n.type) || o.addMark(y.from, y.to, n.type.create({
              href: y.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function My(n) {
  return new X({
    key: new ce("handleClickLink"),
    props: {
      handleClick: (e, t, r) => {
        var s, i;
        if (n.whenNotEditable && e.editable || r.button !== 0)
          return !1;
        let o = r.target;
        const l = [];
        for (; o.nodeName !== "DIV"; )
          l.push(o), o = o.parentNode;
        if (!l.find((h) => h.nodeName === "A"))
          return !1;
        const a = sd(e.state, n.type.name), c = r.target, d = (s = c == null ? void 0 : c.href) !== null && s !== void 0 ? s : a.href, u = (i = c == null ? void 0 : c.target) !== null && i !== void 0 ? i : a.target;
        return c && d ? (window.open(d, u), !0) : !1;
      }
    }
  });
}
function Ty(n) {
  return new X({
    key: new ce("handlePasteLink"),
    props: {
      handlePaste: (e, t, r) => {
        const { state: s } = e, { selection: i } = s, { empty: o } = i;
        if (o)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = yd(l).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : (n.editor.commands.setMark(n.type, {
          href: a.href
        }), !0);
      }
    }
  });
}
const bd = ke.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((n) => {
      if (typeof n == "string") {
        ta(n);
        return;
      }
      ta(n.scheme, n.optionalSlashes);
    });
  },
  onDestroy() {
    wy();
  },
  inclusive() {
    return this.options.autolink;
  },
  addOptions() {
    return {
      openOnClick: !0,
      linkOnPaste: !0,
      autolink: !0,
      protocols: [],
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        class: null
      },
      validate: void 0
    };
  },
  addAttributes() {
    return {
      href: {
        default: null
      },
      target: {
        default: this.options.HTMLAttributes.target
      },
      rel: {
        default: this.options.HTMLAttributes.rel
      },
      class: {
        default: this.options.HTMLAttributes.class
      }
    };
  },
  parseHTML() {
    return [{ tag: 'a[href]:not([href *= "javascript:" i])' }];
  },
  renderHTML({ HTMLAttributes: n }) {
    var e;
    return !((e = n.href) === null || e === void 0) && e.startsWith("javascript:") ? ["a", $(this.options.HTMLAttributes, { ...n, href: "" }), 0] : ["a", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setLink: (n) => ({ chain: e }) => e().setMark(this.name, n).setMeta("preventAutolink", !0).run(),
      toggleLink: (n) => ({ chain: e }) => e().toggleMark(this.name, n, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run(),
      unsetLink: () => ({ chain: n }) => n().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
    };
  },
  addPasteRules() {
    return [
      $t({
        find: (n) => {
          const e = [];
          if (n) {
            const t = yd(n).filter((r) => r.isLink);
            t.length && t.forEach((r) => e.push({
              text: r.value,
              data: {
                href: r.href
              },
              index: r.start
            }));
          }
          return e;
        },
        type: this.type,
        getAttributes: (n) => {
          var e;
          return {
            href: (e = n.data) === null || e === void 0 ? void 0 : e.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const n = [];
    return this.options.autolink && n.push(Cy({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && n.push(My({
      type: this.type,
      whenNotEditable: this.options.openOnClick === "whenNotEditable"
    })), this.options.linkOnPaste && n.push(Ty({
      editor: this.editor,
      type: this.type
    })), n;
  }
});
var Ji, qi;
if (typeof WeakMap < "u") {
  let n = /* @__PURE__ */ new WeakMap();
  Ji = (e) => n.get(e), qi = (e, t) => (n.set(e, t), t);
} else {
  const n = [];
  let t = 0;
  Ji = (r) => {
    for (let s = 0; s < n.length; s += 2)
      if (n[s] == r)
        return n[s + 1];
  }, qi = (r, s) => (t == 10 && (t = 0), n[t++] = r, n[t++] = s);
}
var F = class {
  constructor(n, e, t, r) {
    this.width = n, this.height = e, this.map = t, this.problems = r;
  }
  // Find the dimensions of the cell at the given position.
  findCell(n) {
    for (let e = 0; e < this.map.length; e++) {
      const t = this.map[e];
      if (t != n)
        continue;
      const r = e % this.width, s = e / this.width | 0;
      let i = r + 1, o = s + 1;
      for (let l = 1; i < this.width && this.map[e + l] == t; l++)
        i++;
      for (let l = 1; o < this.height && this.map[e + this.width * l] == t; l++)
        o++;
      return { left: r, top: s, right: i, bottom: o };
    }
    throw new RangeError(`No cell with offset ${n} found`);
  }
  // Find the left side of the cell at the given position.
  colCount(n) {
    for (let e = 0; e < this.map.length; e++)
      if (this.map[e] == n)
        return e % this.width;
    throw new RangeError(`No cell with offset ${n} found`);
  }
  // Find the next cell in the given direction, starting from the cell
  // at `pos`, if any.
  nextCell(n, e, t) {
    const { left: r, right: s, top: i, bottom: o } = this.findCell(n);
    return e == "horiz" ? (t < 0 ? r == 0 : s == this.width) ? null : this.map[i * this.width + (t < 0 ? r - 1 : s)] : (t < 0 ? i == 0 : o == this.height) ? null : this.map[r + this.width * (t < 0 ? i - 1 : o)];
  }
  // Get the rectangle spanning the two given cells.
  rectBetween(n, e) {
    const {
      left: t,
      right: r,
      top: s,
      bottom: i
    } = this.findCell(n), {
      left: o,
      right: l,
      top: a,
      bottom: c
    } = this.findCell(e);
    return {
      left: Math.min(t, o),
      top: Math.min(s, a),
      right: Math.max(r, l),
      bottom: Math.max(i, c)
    };
  }
  // Return the position of all cells that have the top left corner in
  // the given rectangle.
  cellsInRect(n) {
    const e = [], t = {};
    for (let r = n.top; r < n.bottom; r++)
      for (let s = n.left; s < n.right; s++) {
        const i = r * this.width + s, o = this.map[i];
        t[o] || (t[o] = !0, !(s == n.left && s && this.map[i - 1] == o || r == n.top && r && this.map[i - this.width] == o) && e.push(o));
      }
    return e;
  }
  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  positionAt(n, e, t) {
    for (let r = 0, s = 0; ; r++) {
      const i = s + t.child(r).nodeSize;
      if (r == n) {
        let o = e + n * this.width;
        const l = (n + 1) * this.width;
        for (; o < l && this.map[o] < s; )
          o++;
        return o == l ? i - 1 : this.map[o];
      }
      s = i;
    }
  }
  // Find the table map for the given table node.
  static get(n) {
    return Ji(n) || qi(n, Ay(n));
  }
};
function Ay(n) {
  if (n.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + n.type.name);
  const e = Ey(n), t = n.childCount, r = [];
  let s = 0, i = null;
  const o = [];
  for (let c = 0, d = e * t; c < d; c++)
    r[c] = 0;
  for (let c = 0, d = 0; c < t; c++) {
    const u = n.child(c);
    d++;
    for (let p = 0; ; p++) {
      for (; s < r.length && r[s] != 0; )
        s++;
      if (p == u.childCount)
        break;
      const m = u.child(p), { colspan: g, rowspan: y, colwidth: k } = m.attrs;
      for (let C = 0; C < y; C++) {
        if (C + c >= t) {
          (i || (i = [])).push({
            type: "overlong_rowspan",
            pos: d,
            n: y - C
          });
          break;
        }
        const R = s + C * e;
        for (let v = 0; v < g; v++) {
          r[R + v] == 0 ? r[R + v] = d : (i || (i = [])).push({
            type: "collision",
            row: c,
            pos: d,
            n: g - v
          });
          const M = k && k[v];
          if (M) {
            const I = (R + v) % e * 2, J = o[I];
            J == null || J != M && o[I + 1] == 1 ? (o[I] = M, o[I + 1] = 1) : J == M && o[I + 1]++;
          }
        }
      }
      s += g, d += m.nodeSize;
    }
    const h = (c + 1) * e;
    let f = 0;
    for (; s < h; )
      r[s++] == 0 && f++;
    f && (i || (i = [])).push({ type: "missing", row: c, n: f }), d++;
  }
  const l = new F(e, t, r, i);
  let a = !1;
  for (let c = 0; !a && c < o.length; c += 2)
    o[c] != null && o[c + 1] < t && (a = !0);
  return a && vy(l, o, n), l;
}
function Ey(n) {
  let e = -1, t = !1;
  for (let r = 0; r < n.childCount; r++) {
    const s = n.child(r);
    let i = 0;
    if (t)
      for (let o = 0; o < r; o++) {
        const l = n.child(o);
        for (let a = 0; a < l.childCount; a++) {
          const c = l.child(a);
          o + c.attrs.rowspan > r && (i += c.attrs.colspan);
        }
      }
    for (let o = 0; o < s.childCount; o++) {
      const l = s.child(o);
      i += l.attrs.colspan, l.attrs.rowspan > 1 && (t = !0);
    }
    e == -1 ? e = i : e != i && (e = Math.max(e, i));
  }
  return e;
}
function vy(n, e, t) {
  n.problems || (n.problems = []);
  const r = {};
  for (let s = 0; s < n.map.length; s++) {
    const i = n.map[s];
    if (r[i])
      continue;
    r[i] = !0;
    const o = t.nodeAt(i);
    if (!o)
      throw new RangeError(`No cell with offset ${i} found`);
    let l = null;
    const a = o.attrs;
    for (let c = 0; c < a.colspan; c++) {
      const d = (s + c) % n.width, u = e[d * 2];
      u != null && (!a.colwidth || a.colwidth[c] != u) && ((l || (l = Oy(a)))[c] = u);
    }
    l && n.problems.unshift({
      type: "colwidth mismatch",
      pos: i,
      colwidth: l
    });
  }
}
function Oy(n) {
  if (n.colwidth)
    return n.colwidth.slice();
  const e = [];
  for (let t = 0; t < n.colspan; t++)
    e.push(0);
  return e;
}
function ee(n) {
  let e = n.cached.tableNodeTypes;
  if (!e) {
    e = n.cached.tableNodeTypes = {};
    for (const t in n.nodes) {
      const r = n.nodes[t], s = r.spec.tableRole;
      s && (e[s] = r);
    }
  }
  return e;
}
var tt = new ce("selectingCells");
function mn(n) {
  for (let e = n.depth - 1; e > 0; e--)
    if (n.node(e).type.spec.tableRole == "row")
      return n.node(0).resolve(n.before(e + 1));
  return null;
}
function Ny(n) {
  for (let e = n.depth; e > 0; e--) {
    const t = n.node(e).type.spec.tableRole;
    if (t === "cell" || t === "header_cell")
      return n.node(e);
  }
  return null;
}
function Te(n) {
  const e = n.selection.$head;
  for (let t = e.depth; t > 0; t--)
    if (e.node(t).type.spec.tableRole == "row")
      return !0;
  return !1;
}
function $s(n) {
  const e = n.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const t = mn(e.$head) || Ry(e.$head);
  if (t)
    return t;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function Ry(n) {
  for (let e = n.nodeAfter, t = n.pos; e; e = e.firstChild, t++) {
    const r = e.type.spec.tableRole;
    if (r == "cell" || r == "header_cell")
      return n.doc.resolve(t);
  }
  for (let e = n.nodeBefore, t = n.pos; e; e = e.lastChild, t--) {
    const r = e.type.spec.tableRole;
    if (r == "cell" || r == "header_cell")
      return n.doc.resolve(t - e.nodeSize);
  }
}
function Gi(n) {
  return n.parent.type.spec.tableRole == "row" && !!n.nodeAfter;
}
function Dy(n) {
  return n.node(0).resolve(n.pos + n.nodeAfter.nodeSize);
}
function Oo(n, e) {
  return n.depth == e.depth && n.pos >= e.start(-1) && n.pos <= e.end(-1);
}
function kd(n, e, t) {
  const r = n.node(-1), s = F.get(r), i = n.start(-1), o = s.nextCell(n.pos - i, e, t);
  return o == null ? null : n.node(0).resolve(i + o);
}
function Bt(n, e, t = 1) {
  const r = { ...n, colspan: n.colspan - t };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, t), r.colwidth.some((s) => s > 0) || (r.colwidth = null)), r;
}
function wd(n, e, t = 1) {
  const r = { ...n, colspan: n.colspan + t };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let s = 0; s < t; s++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function Iy(n, e, t) {
  const r = ee(e.type.schema).header_cell;
  for (let s = 0; s < n.height; s++)
    if (e.nodeAt(n.map[t + s * n.width]).type != r)
      return !1;
  return !0;
}
var P = class _e extends E {
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  constructor(e, t = e) {
    const r = e.node(-1), s = F.get(r), i = e.start(-1), o = s.rectBetween(
      e.pos - i,
      t.pos - i
    ), l = e.node(0), a = s.cellsInRect(o).filter((d) => d != t.pos - i);
    a.unshift(t.pos - i);
    const c = a.map((d) => {
      const u = r.nodeAt(d);
      if (!u)
        throw RangeError(`No cell with offset ${d} found`);
      const h = i + d + 1;
      return new oc(
        l.resolve(h),
        l.resolve(h + u.content.size)
      );
    });
    super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = t;
  }
  map(e, t) {
    const r = e.resolve(t.map(this.$anchorCell.pos)), s = e.resolve(t.map(this.$headCell.pos));
    if (Gi(r) && Gi(s) && Oo(r, s)) {
      const i = this.$anchorCell.node(-1) != r.node(-1);
      return i && this.isRowSelection() ? _e.rowSelection(r, s) : i && this.isColSelection() ? _e.colSelection(r, s) : new _e(r, s);
    }
    return A.between(r, s);
  }
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  content() {
    const e = this.$anchorCell.node(-1), t = F.get(e), r = this.$anchorCell.start(-1), s = t.rectBetween(
      this.$anchorCell.pos - r,
      this.$headCell.pos - r
    ), i = {}, o = [];
    for (let a = s.top; a < s.bottom; a++) {
      const c = [];
      for (let d = a * t.width + s.left, u = s.left; u < s.right; u++, d++) {
        const h = t.map[d];
        if (i[h])
          continue;
        i[h] = !0;
        const f = t.findCell(h);
        let p = e.nodeAt(h);
        if (!p)
          throw RangeError(`No cell with offset ${h} found`);
        const m = s.left - f.left, g = f.right - s.right;
        if (m > 0 || g > 0) {
          let y = p.attrs;
          if (m > 0 && (y = Bt(y, 0, m)), g > 0 && (y = Bt(
            y,
            y.colspan - g,
            g
          )), f.left < s.left) {
            if (p = p.type.createAndFill(y), !p)
              throw RangeError(
                `Could not create cell with attrs ${JSON.stringify(y)}`
              );
          } else
            p = p.type.create(y, p.content);
        }
        if (f.top < s.top || f.bottom > s.bottom) {
          const y = {
            ...p.attrs,
            rowspan: Math.min(f.bottom, s.bottom) - Math.max(f.top, s.top)
          };
          f.top < s.top ? p = p.type.createAndFill(y) : p = p.type.create(y, p.content);
        }
        c.push(p);
      }
      o.push(e.child(a).copy(b.from(c)));
    }
    const l = this.isColSelection() && this.isRowSelection() ? e : o;
    return new x(b.from(l), 1, 1);
  }
  replace(e, t = x.empty) {
    const r = e.steps.length, s = this.ranges;
    for (let o = 0; o < s.length; o++) {
      const { $from: l, $to: a } = s[o], c = e.mapping.slice(r);
      e.replace(
        c.map(l.pos),
        c.map(a.pos),
        o ? x.empty : t
      );
    }
    const i = E.findFrom(
      e.doc.resolve(e.mapping.slice(r).map(this.to)),
      -1
    );
    i && e.setSelection(i);
  }
  replaceWith(e, t) {
    this.replace(e, new x(b.from(t), 0, 0));
  }
  forEachCell(e) {
    const t = this.$anchorCell.node(-1), r = F.get(t), s = this.$anchorCell.start(-1), i = r.cellsInRect(
      r.rectBetween(
        this.$anchorCell.pos - s,
        this.$headCell.pos - s
      )
    );
    for (let o = 0; o < i.length; o++)
      e(t.nodeAt(i[o]), s + i[o]);
  }
  // True if this selection goes all the way from the top to the
  // bottom of the table.
  isColSelection() {
    const e = this.$anchorCell.index(-1), t = this.$headCell.index(-1);
    if (Math.min(e, t) > 0)
      return !1;
    const r = e + this.$anchorCell.nodeAfter.attrs.rowspan, s = t + this.$headCell.nodeAfter.attrs.rowspan;
    return Math.max(r, s) == this.$headCell.node(-1).childCount;
  }
  // Returns the smallest column selection that covers the given anchor
  // and head cell.
  static colSelection(e, t = e) {
    const r = e.node(-1), s = F.get(r), i = e.start(-1), o = s.findCell(e.pos - i), l = s.findCell(t.pos - i), a = e.node(0);
    return o.top <= l.top ? (o.top > 0 && (e = a.resolve(i + s.map[o.left])), l.bottom < s.height && (t = a.resolve(
      i + s.map[s.width * (s.height - 1) + l.right - 1]
    ))) : (l.top > 0 && (t = a.resolve(i + s.map[l.left])), o.bottom < s.height && (e = a.resolve(
      i + s.map[s.width * (s.height - 1) + o.right - 1]
    ))), new _e(e, t);
  }
  // True if this selection goes all the way from the left to the
  // right of the table.
  isRowSelection() {
    const e = this.$anchorCell.node(-1), t = F.get(e), r = this.$anchorCell.start(-1), s = t.colCount(this.$anchorCell.pos - r), i = t.colCount(this.$headCell.pos - r);
    if (Math.min(s, i) > 0)
      return !1;
    const o = s + this.$anchorCell.nodeAfter.attrs.colspan, l = i + this.$headCell.nodeAfter.attrs.colspan;
    return Math.max(o, l) == t.width;
  }
  eq(e) {
    return e instanceof _e && e.$anchorCell.pos == this.$anchorCell.pos && e.$headCell.pos == this.$headCell.pos;
  }
  // Returns the smallest row selection that covers the given anchor
  // and head cell.
  static rowSelection(e, t = e) {
    const r = e.node(-1), s = F.get(r), i = e.start(-1), o = s.findCell(e.pos - i), l = s.findCell(t.pos - i), a = e.node(0);
    return o.left <= l.left ? (o.left > 0 && (e = a.resolve(
      i + s.map[o.top * s.width]
    )), l.right < s.width && (t = a.resolve(
      i + s.map[s.width * (l.top + 1) - 1]
    ))) : (l.left > 0 && (t = a.resolve(i + s.map[l.top * s.width])), o.right < s.width && (e = a.resolve(
      i + s.map[s.width * (o.top + 1) - 1]
    ))), new _e(e, t);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(e, t) {
    return new _e(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    return new _e(e.resolve(t), e.resolve(r));
  }
  getBookmark() {
    return new Ly(this.$anchorCell.pos, this.$headCell.pos);
  }
};
P.prototype.visible = !1;
E.jsonID("cell", P);
var Ly = class xd {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new xd(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    const t = e.resolve(this.anchor), r = e.resolve(this.head);
    return t.parent.type.spec.tableRole == "row" && r.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && r.index() < r.parent.childCount && Oo(t, r) ? new P(t, r) : E.near(r, 1);
  }
};
function Py(n) {
  if (!(n.selection instanceof P))
    return null;
  const e = [];
  return n.selection.forEachCell((t, r) => {
    e.push(
      le.node(r, r + t.nodeSize, { class: "selectedCell" })
    );
  }), z.create(n.doc, e);
}
function $y({ $from: n, $to: e }) {
  if (n.pos == e.pos || n.pos < n.pos - 6)
    return !1;
  let t = n.pos, r = e.pos, s = n.depth;
  for (; s >= 0 && !(n.after(s + 1) < n.end(s)); s--, t++)
    ;
  for (let i = e.depth; i >= 0 && !(e.before(i + 1) > e.start(i)); i--, r--)
    ;
  return t == r && /row|table/.test(n.node(s).type.spec.tableRole);
}
function By({ $from: n, $to: e }) {
  let t, r;
  for (let s = n.depth; s > 0; s--) {
    const i = n.node(s);
    if (i.type.spec.tableRole === "cell" || i.type.spec.tableRole === "header_cell") {
      t = i;
      break;
    }
  }
  for (let s = e.depth; s > 0; s--) {
    const i = e.node(s);
    if (i.type.spec.tableRole === "cell" || i.type.spec.tableRole === "header_cell") {
      r = i;
      break;
    }
  }
  return t !== r && e.parentOffset === 0;
}
function zy(n, e, t) {
  const r = (e || n).selection, s = (e || n).doc;
  let i, o;
  if (r instanceof T && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      i = P.create(s, r.from);
    else if (o == "row") {
      const l = s.resolve(r.from + 1);
      i = P.rowSelection(l, l);
    } else if (!t) {
      const l = F.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      i = P.create(s, a + 1, c);
    }
  } else r instanceof A && $y(r) ? i = A.create(s, r.from) : r instanceof A && By(r) && (i = A.create(s, r.$from.start(), r.$from.end()));
  return i && (e || (e = n.tr)).setSelection(i), e;
}
var Hy = new ce("fix-tables");
function Sd(n, e, t, r) {
  const s = n.childCount, i = e.childCount;
  e:
    for (let o = 0, l = 0; o < i; o++) {
      const a = e.child(o);
      for (let c = l, d = Math.min(s, o + 3); c < d; c++)
        if (n.child(c) == a) {
          l = c + 1, t += a.nodeSize;
          continue e;
        }
      r(a, t), l < s && n.child(l).sameMarkup(a) ? Sd(n.child(l), a, t + 1, r) : a.nodesBetween(0, a.content.size, r, t + 1), t += a.nodeSize;
    }
}
function Cd(n, e) {
  let t;
  const r = (s, i) => {
    s.type.spec.tableRole == "table" && (t = Fy(n, s, i, t));
  };
  return e ? e.doc != n.doc && Sd(e.doc, n.doc, 0, r) : n.doc.descendants(r), t;
}
function Fy(n, e, t, r) {
  const s = F.get(e);
  if (!s.problems)
    return r;
  r || (r = n.tr);
  const i = [];
  for (let a = 0; a < s.height; a++)
    i.push(0);
  for (let a = 0; a < s.problems.length; a++) {
    const c = s.problems[a];
    if (c.type == "collision") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      const u = d.attrs;
      for (let h = 0; h < u.rowspan; h++)
        i[c.row + h] += c.n;
      r.setNodeMarkup(
        r.mapping.map(t + 1 + c.pos),
        null,
        Bt(u, u.colspan - c.n, c.n)
      );
    } else if (c.type == "missing")
      i[c.row] += c.n;
    else if (c.type == "overlong_rowspan") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      r.setNodeMarkup(r.mapping.map(t + 1 + c.pos), null, {
        ...d.attrs,
        rowspan: d.attrs.rowspan - c.n
      });
    } else if (c.type == "colwidth mismatch") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      r.setNodeMarkup(r.mapping.map(t + 1 + c.pos), null, {
        ...d.attrs,
        colwidth: c.colwidth
      });
    }
  }
  let o, l;
  for (let a = 0; a < i.length; a++)
    i[a] && (o == null && (o = a), l = a);
  for (let a = 0, c = t + 1; a < s.height; a++) {
    const d = e.child(a), u = c + d.nodeSize, h = i[a];
    if (h > 0) {
      let f = "cell";
      d.firstChild && (f = d.firstChild.type.spec.tableRole);
      const p = [];
      for (let g = 0; g < h; g++) {
        const y = ee(n.schema)[f].createAndFill();
        y && p.push(y);
      }
      const m = (a == 0 || o == a - 1) && l == a ? c + 1 : u - 1;
      r.insert(r.mapping.map(m), p);
    }
    c = u;
  }
  return r.setMeta(Hy, { fixTables: !0 });
}
function Vy(n) {
  if (!n.size)
    return null;
  let { content: e, openStart: t, openEnd: r } = n;
  for (; e.childCount == 1 && (t > 0 && r > 0 || e.child(0).type.spec.tableRole == "table"); )
    t--, r--, e = e.child(0).content;
  const s = e.child(0), i = s.type.spec.tableRole, o = s.type.schema, l = [];
  if (i == "row")
    for (let a = 0; a < e.childCount; a++) {
      let c = e.child(a).content;
      const d = a ? 0 : Math.max(0, t - 1), u = a < e.childCount - 1 ? 0 : Math.max(0, r - 1);
      (d || u) && (c = Yi(
        ee(o).row,
        new x(c, d, u)
      ).content), l.push(c);
    }
  else if (i == "cell" || i == "header_cell")
    l.push(
      t || r ? Yi(
        ee(o).row,
        new x(e, t, r)
      ).content : e
    );
  else
    return null;
  return _y(o, l);
}
function _y(n, e) {
  const t = [];
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    for (let o = i.childCount - 1; o >= 0; o--) {
      const { rowspan: l, colspan: a } = i.child(o).attrs;
      for (let c = s; c < s + l; c++)
        t[c] = (t[c] || 0) + a;
    }
  }
  let r = 0;
  for (let s = 0; s < t.length; s++)
    r = Math.max(r, t[s]);
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && e.push(b.empty), t[s] < r) {
      const i = ee(n).cell.createAndFill(), o = [];
      for (let l = t[s]; l < r; l++)
        o.push(i);
      e[s] = e[s].append(b.from(o));
    }
  return { height: e.length, width: r, rows: e };
}
function Yi(n, e) {
  const t = n.createAndFill();
  return new no(t).replace(0, t.content.size, e).doc;
}
function Wy({ width: n, height: e, rows: t }, r, s) {
  if (n != r) {
    const i = [], o = [];
    for (let l = 0; l < t.length; l++) {
      const a = t[l], c = [];
      for (let d = i[l] || 0, u = 0; d < r; u++) {
        let h = a.child(u % a.childCount);
        d + h.attrs.colspan > r && (h = h.type.createChecked(
          Bt(
            h.attrs,
            h.attrs.colspan,
            d + h.attrs.colspan - r
          ),
          h.content
        )), c.push(h), d += h.attrs.colspan;
        for (let f = 1; f < h.attrs.rowspan; f++)
          i[l + f] = (i[l + f] || 0) + h.attrs.colspan;
      }
      o.push(b.from(c));
    }
    t = o, n = r;
  }
  if (e != s) {
    const i = [];
    for (let o = 0, l = 0; o < s; o++, l++) {
      const a = [], c = t[l % e];
      for (let d = 0; d < c.childCount; d++) {
        let u = c.child(d);
        o + u.attrs.rowspan > s && (u = u.type.create(
          {
            ...u.attrs,
            rowspan: Math.max(1, s - u.attrs.rowspan)
          },
          u.content
        )), a.push(u);
      }
      i.push(b.from(a));
    }
    t = i, e = s;
  }
  return { width: n, height: e, rows: t };
}
function jy(n, e, t, r, s, i, o) {
  const l = n.doc.type.schema, a = ee(l);
  let c, d;
  if (s > e.width)
    for (let u = 0, h = 0; u < e.height; u++) {
      const f = t.child(u);
      h += f.nodeSize;
      const p = [];
      let m;
      f.lastChild == null || f.lastChild.type == a.cell ? m = c || (c = a.cell.createAndFill()) : m = d || (d = a.header_cell.createAndFill());
      for (let g = e.width; g < s; g++)
        p.push(m);
      n.insert(n.mapping.slice(o).map(h - 1 + r), p);
    }
  if (i > e.height) {
    const u = [];
    for (let p = 0, m = (e.height - 1) * e.width; p < Math.max(e.width, s); p++) {
      const g = p >= e.width ? !1 : t.nodeAt(e.map[m + p]).type == a.header_cell;
      u.push(
        g ? d || (d = a.header_cell.createAndFill()) : c || (c = a.cell.createAndFill())
      );
    }
    const h = a.row.create(null, b.from(u)), f = [];
    for (let p = e.height; p < i; p++)
      f.push(h);
    n.insert(n.mapping.slice(o).map(r + t.nodeSize - 2), f);
  }
  return !!(c || d);
}
function na(n, e, t, r, s, i, o, l) {
  if (o == 0 || o == e.height)
    return !1;
  let a = !1;
  for (let c = s; c < i; c++) {
    const d = o * e.width + c, u = e.map[d];
    if (e.map[d - e.width] == u) {
      a = !0;
      const h = t.nodeAt(u), { top: f, left: p } = e.findCell(u);
      n.setNodeMarkup(n.mapping.slice(l).map(u + r), null, {
        ...h.attrs,
        rowspan: o - f
      }), n.insert(
        n.mapping.slice(l).map(e.positionAt(o, p, t)),
        h.type.createAndFill({
          ...h.attrs,
          rowspan: f + h.attrs.rowspan - o
        })
      ), c += h.attrs.colspan - 1;
    }
  }
  return a;
}
function ra(n, e, t, r, s, i, o, l) {
  if (o == 0 || o == e.width)
    return !1;
  let a = !1;
  for (let c = s; c < i; c++) {
    const d = c * e.width + o, u = e.map[d];
    if (e.map[d - 1] == u) {
      a = !0;
      const h = t.nodeAt(u), f = e.colCount(u), p = n.mapping.slice(l).map(u + r);
      n.setNodeMarkup(
        p,
        null,
        Bt(
          h.attrs,
          o - f,
          h.attrs.colspan - (o - f)
        )
      ), n.insert(
        p + h.nodeSize,
        h.type.createAndFill(
          Bt(h.attrs, 0, o - f)
        )
      ), c += h.attrs.rowspan - 1;
    }
  }
  return a;
}
function sa(n, e, t, r, s) {
  let i = t ? n.doc.nodeAt(t - 1) : n.doc;
  if (!i)
    throw new Error("No table found");
  let o = F.get(i);
  const { top: l, left: a } = r, c = a + s.width, d = l + s.height, u = n.tr;
  let h = 0;
  function f() {
    if (i = t ? u.doc.nodeAt(t - 1) : u.doc, !i)
      throw new Error("No table found");
    o = F.get(i), h = u.mapping.maps.length;
  }
  jy(u, o, i, t, c, d, h) && f(), na(u, o, i, t, a, c, l, h) && f(), na(u, o, i, t, a, c, d, h) && f(), ra(u, o, i, t, l, d, a, h) && f(), ra(u, o, i, t, l, d, c, h) && f();
  for (let p = l; p < d; p++) {
    const m = o.positionAt(p, a, i), g = o.positionAt(p, c, i);
    u.replace(
      u.mapping.slice(h).map(m + t),
      u.mapping.slice(h).map(g + t),
      new x(s.rows[p - l], 0, 0)
    );
  }
  f(), u.setSelection(
    new P(
      u.doc.resolve(t + o.positionAt(l, a, i)),
      u.doc.resolve(t + o.positionAt(d - 1, c - 1, i))
    )
  ), e(u);
}
var Uy = fo({
  ArrowLeft: pr("horiz", -1),
  ArrowRight: pr("horiz", 1),
  ArrowUp: pr("vert", -1),
  ArrowDown: pr("vert", 1),
  "Shift-ArrowLeft": mr("horiz", -1),
  "Shift-ArrowRight": mr("horiz", 1),
  "Shift-ArrowUp": mr("vert", -1),
  "Shift-ArrowDown": mr("vert", 1),
  Backspace: gr,
  "Mod-Backspace": gr,
  Delete: gr,
  "Mod-Delete": gr
});
function Mr(n, e, t) {
  return t.eq(n.selection) ? !1 : (e && e(n.tr.setSelection(t).scrollIntoView()), !0);
}
function pr(n, e) {
  return (t, r, s) => {
    if (!s)
      return !1;
    const i = t.selection;
    if (i instanceof P)
      return Mr(
        t,
        r,
        E.near(i.$headCell, e)
      );
    if (n != "horiz" && !i.empty)
      return !1;
    const o = Md(s, n, e);
    if (o == null)
      return !1;
    if (n == "horiz")
      return Mr(
        t,
        r,
        E.near(t.doc.resolve(i.head + e), e)
      );
    {
      const l = t.doc.resolve(o), a = kd(l, n, e);
      let c;
      return a ? c = E.near(a, 1) : e < 0 ? c = E.near(t.doc.resolve(l.before(-1)), -1) : c = E.near(t.doc.resolve(l.after(-1)), 1), Mr(t, r, c);
    }
  };
}
function mr(n, e) {
  return (t, r, s) => {
    if (!s)
      return !1;
    const i = t.selection;
    let o;
    if (i instanceof P)
      o = i;
    else {
      const a = Md(s, n, e);
      if (a == null)
        return !1;
      o = new P(t.doc.resolve(a));
    }
    const l = kd(o.$headCell, n, e);
    return l ? Mr(
      t,
      r,
      new P(o.$anchorCell, l)
    ) : !1;
  };
}
function gr(n, e) {
  const t = n.selection;
  if (!(t instanceof P))
    return !1;
  if (e) {
    const r = n.tr, s = ee(n.schema).cell.createAndFill().content;
    t.forEachCell((i, o) => {
      i.content.eq(s) || r.replace(
        r.mapping.map(o + 1),
        r.mapping.map(o + i.nodeSize - 1),
        new x(s, 0, 0)
      );
    }), r.docChanged && e(r);
  }
  return !0;
}
function Ky(n, e) {
  const t = n.state.doc, r = mn(t.resolve(e));
  return r ? (n.dispatch(n.state.tr.setSelection(new P(r))), !0) : !1;
}
function Jy(n, e, t) {
  if (!Te(n.state))
    return !1;
  let r = Vy(t);
  const s = n.state.selection;
  if (s instanceof P) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        b.from(
          Yi(ee(n.state.schema).cell, t)
        )
      ]
    });
    const i = s.$anchorCell.node(-1), o = s.$anchorCell.start(-1), l = F.get(i).rectBetween(
      s.$anchorCell.pos - o,
      s.$headCell.pos - o
    );
    return r = Wy(r, l.right - l.left, l.bottom - l.top), sa(n.state, n.dispatch, o, l, r), !0;
  } else if (r) {
    const i = $s(n.state), o = i.start(-1);
    return sa(
      n.state,
      n.dispatch,
      o,
      F.get(i.node(-1)).findCell(i.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function qy(n, e) {
  var t;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = ia(n, e.target);
  let s;
  if (e.shiftKey && n.state.selection instanceof P)
    i(n.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (s = mn(n.state.selection.$anchor)) != null && ((t = fi(n, e)) == null ? void 0 : t.pos) != s.pos)
    i(s, e), e.preventDefault();
  else if (!r)
    return;
  function i(a, c) {
    let d = fi(n, c);
    const u = tt.getState(n.state) == null;
    if (!d || !Oo(a, d))
      if (u)
        d = a;
      else
        return;
    const h = new P(a, d);
    if (u || !n.state.selection.eq(h)) {
      const f = n.state.tr.setSelection(h);
      u && f.setMeta(tt, a.pos), n.dispatch(f);
    }
  }
  function o() {
    n.root.removeEventListener("mouseup", o), n.root.removeEventListener("dragstart", o), n.root.removeEventListener("mousemove", l), tt.getState(n.state) != null && n.dispatch(n.state.tr.setMeta(tt, -1));
  }
  function l(a) {
    const c = a, d = tt.getState(n.state);
    let u;
    if (d != null)
      u = n.state.doc.resolve(d);
    else if (ia(n, c.target) != r && (u = fi(n, e), !u))
      return o();
    u && i(u, c);
  }
  n.root.addEventListener("mouseup", o), n.root.addEventListener("dragstart", o), n.root.addEventListener("mousemove", l);
}
function Md(n, e, t) {
  if (!(n.state.selection instanceof A))
    return null;
  const { $head: r } = n.state.selection;
  for (let s = r.depth - 1; s >= 0; s--) {
    const i = r.node(s);
    if ((t < 0 ? r.index(s) : r.indexAfter(s)) != (t < 0 ? 0 : i.childCount))
      return null;
    if (i.type.spec.tableRole == "cell" || i.type.spec.tableRole == "header_cell") {
      const l = r.before(s), a = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
      return n.endOfTextblock(a) ? l : null;
    }
  }
  return null;
}
function ia(n, e) {
  for (; e && e != n.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function fi(n, e) {
  const t = n.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return t && t ? mn(n.state.doc.resolve(t.pos)) : null;
}
var Gy = class {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Xi(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, Xi(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function Xi(n, e, t, r, s, i) {
  var o;
  let l = 0, a = !0, c = e.firstChild;
  const d = n.firstChild;
  if (d) {
    for (let u = 0, h = 0; u < d.childCount; u++) {
      const { colspan: f, colwidth: p } = d.child(u).attrs;
      for (let m = 0; m < f; m++, h++) {
        const g = s == h ? i : p && p[m], y = g ? g + "px" : "";
        l += g || r, g || (a = !1), c ? (c.style.width != y && (c.style.width = y), c = c.nextSibling) : e.appendChild(document.createElement("col")).style.width = y;
      }
    }
    for (; c; ) {
      const u = c.nextSibling;
      (o = c.parentNode) == null || o.removeChild(c), c = u;
    }
    a ? (t.style.width = l + "px", t.style.minWidth = "") : (t.style.width = "", t.style.minWidth = l + "px");
  }
}
var ye = new ce(
  "tableColumnResizing"
);
function Yy({
  handleWidth: n = 5,
  cellMinWidth: e = 25,
  View: t = Gy,
  lastColumnResizable: r = !0
} = {}) {
  const s = new X({
    key: ye,
    state: {
      init(i, o) {
        return s.spec.props.nodeViews[ee(o.schema).table.name] = (l, a) => new t(l, e, a), new Xy(-1, !1);
      },
      apply(i, o) {
        return o.apply(i);
      }
    },
    props: {
      attributes: (i) => {
        const o = ye.getState(i);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (i, o) => {
          Qy(
            i,
            o,
            n,
            e,
            r
          );
        },
        mouseleave: (i) => {
          Zy(i);
        },
        mousedown: (i, o) => {
          e0(i, o, e);
        }
      },
      decorations: (i) => {
        const o = ye.getState(i);
        if (o && o.activeHandle > -1)
          return o0(i, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return s;
}
var Xy = class Tr {
  constructor(e, t) {
    this.activeHandle = e, this.dragging = t;
  }
  apply(e) {
    const t = this, r = e.getMeta(ye);
    if (r && r.setHandle != null)
      return new Tr(r.setHandle, !1);
    if (r && r.setDragging !== void 0)
      return new Tr(t.activeHandle, r.setDragging);
    if (t.activeHandle > -1 && e.docChanged) {
      let s = e.mapping.map(t.activeHandle, -1);
      return Gi(e.doc.resolve(s)) || (s = -1), new Tr(s, t.dragging);
    }
    return t;
  }
};
function Qy(n, e, t, r, s) {
  const i = ye.getState(n.state);
  if (i && !i.dragging) {
    const o = n0(e.target);
    let l = -1;
    if (o) {
      const { left: a, right: c } = o.getBoundingClientRect();
      e.clientX - a <= t ? l = oa(n, e, "left", t) : c - e.clientX <= t && (l = oa(n, e, "right", t));
    }
    if (l != i.activeHandle) {
      if (!s && l !== -1) {
        const a = n.state.doc.resolve(l), c = a.node(-1), d = F.get(c), u = a.start(-1);
        if (d.colCount(a.pos - u) + a.nodeAfter.attrs.colspan - 1 == d.width - 1)
          return;
      }
      Td(n, l);
    }
  }
}
function Zy(n) {
  const e = ye.getState(n.state);
  e && e.activeHandle > -1 && !e.dragging && Td(n, -1);
}
function e0(n, e, t) {
  var r;
  const s = (r = n.dom.ownerDocument.defaultView) != null ? r : window, i = ye.getState(n.state);
  if (!i || i.activeHandle == -1 || i.dragging)
    return !1;
  const o = n.state.doc.nodeAt(i.activeHandle), l = t0(n, i.activeHandle, o.attrs);
  n.dispatch(
    n.state.tr.setMeta(ye, {
      setDragging: { startX: e.clientX, startWidth: l }
    })
  );
  function a(d) {
    s.removeEventListener("mouseup", a), s.removeEventListener("mousemove", c);
    const u = ye.getState(n.state);
    u != null && u.dragging && (r0(
      n,
      u.activeHandle,
      la(u.dragging, d, t)
    ), n.dispatch(
      n.state.tr.setMeta(ye, { setDragging: null })
    ));
  }
  function c(d) {
    if (!d.which)
      return a(d);
    const u = ye.getState(n.state);
    if (u && u.dragging) {
      const h = la(u.dragging, d, t);
      s0(n, u.activeHandle, h, t);
    }
  }
  return s.addEventListener("mouseup", a), s.addEventListener("mousemove", c), e.preventDefault(), !0;
}
function t0(n, e, { colspan: t, colwidth: r }) {
  const s = r && r[r.length - 1];
  if (s)
    return s;
  const i = n.domAtPos(e);
  let l = i.node.childNodes[i.offset].offsetWidth, a = t;
  if (r)
    for (let c = 0; c < t; c++)
      r[c] && (l -= r[c], a--);
  return l / a;
}
function n0(n) {
  for (; n && n.nodeName != "TD" && n.nodeName != "TH"; )
    n = n.classList && n.classList.contains("ProseMirror") ? null : n.parentNode;
  return n;
}
function oa(n, e, t, r) {
  const s = t == "right" ? -r : r, i = n.posAtCoords({
    left: e.clientX + s,
    top: e.clientY
  });
  if (!i)
    return -1;
  const { pos: o } = i, l = mn(n.state.doc.resolve(o));
  if (!l)
    return -1;
  if (t == "right")
    return l.pos;
  const a = F.get(l.node(-1)), c = l.start(-1), d = a.map.indexOf(l.pos - c);
  return d % a.width == 0 ? -1 : c + a.map[d - 1];
}
function la(n, e, t) {
  const r = e.clientX - n.startX;
  return Math.max(t, n.startWidth + r);
}
function Td(n, e) {
  n.dispatch(
    n.state.tr.setMeta(ye, { setHandle: e })
  );
}
function r0(n, e, t) {
  const r = n.state.doc.resolve(e), s = r.node(-1), i = F.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, a = n.state.tr;
  for (let c = 0; c < i.height; c++) {
    const d = c * i.width + l;
    if (c && i.map[d] == i.map[d - i.width])
      continue;
    const u = i.map[d], h = s.nodeAt(u).attrs, f = h.colspan == 1 ? 0 : l - i.colCount(u);
    if (h.colwidth && h.colwidth[f] == t)
      continue;
    const p = h.colwidth ? h.colwidth.slice() : i0(h.colspan);
    p[f] = t, a.setNodeMarkup(o + u, null, { ...h, colwidth: p });
  }
  a.docChanged && n.dispatch(a);
}
function s0(n, e, t, r) {
  const s = n.state.doc.resolve(e), i = s.node(-1), o = s.start(-1), l = F.get(i).colCount(s.pos - o) + s.nodeAfter.attrs.colspan - 1;
  let a = n.domAtPos(s.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; )
    a = a.parentNode;
  a && Xi(
    i,
    a.firstChild,
    a,
    r,
    l,
    t
  );
}
function i0(n) {
  return Array(n).fill(0);
}
function o0(n, e) {
  const t = [], r = n.doc.resolve(e), s = r.node(-1);
  if (!s)
    return z.empty;
  const i = F.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let a = 0; a < i.height; a++) {
    const c = l + a * i.width - 1;
    if ((l == i.width || i.map[c] != i.map[c + 1]) && (a == 0 || i.map[c] != i.map[c - i.width])) {
      const d = i.map[c], u = o + d + s.nodeAt(d).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", t.push(le.widget(u, h));
    }
  }
  return z.create(n.doc, t);
}
function He(n) {
  const e = n.selection, t = $s(n), r = t.node(-1), s = t.start(-1), i = F.get(r);
  return { ...e instanceof P ? i.rectBetween(
    e.$anchorCell.pos - s,
    e.$headCell.pos - s
  ) : i.findCell(t.pos - s), tableStart: s, map: i, table: r };
}
function Ad(n, { map: e, tableStart: t, table: r }, s) {
  let i = s > 0 ? -1 : 0;
  Iy(e, r, s + i) && (i = s == 0 || s == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const l = o * e.width + s;
    if (s > 0 && s < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      n.setNodeMarkup(
        n.mapping.map(t + a),
        null,
        wd(c.attrs, s - e.colCount(a))
      ), o += c.attrs.rowspan - 1;
    } else {
      const a = i == null ? ee(r.type.schema).cell : r.nodeAt(e.map[l + i]).type, c = e.positionAt(o, s, r);
      n.insert(n.mapping.map(t + c), a.createAndFill());
    }
  }
  return n;
}
function l0(n, e) {
  if (!Te(n))
    return !1;
  if (e) {
    const t = He(n);
    e(Ad(n.tr, t, t.left));
  }
  return !0;
}
function a0(n, e) {
  if (!Te(n))
    return !1;
  if (e) {
    const t = He(n);
    e(Ad(n.tr, t, t.right));
  }
  return !0;
}
function c0(n, { map: e, table: t, tableStart: r }, s) {
  const i = n.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const l = o * e.width + s, a = e.map[l], c = t.nodeAt(a), d = c.attrs;
    if (s > 0 && e.map[l - 1] == a || s < e.width - 1 && e.map[l + 1] == a)
      n.setNodeMarkup(
        n.mapping.slice(i).map(r + a),
        null,
        Bt(d, s - e.colCount(a))
      );
    else {
      const u = n.mapping.slice(i).map(r + a);
      n.delete(u, u + c.nodeSize);
    }
    o += d.rowspan;
  }
}
function d0(n, e) {
  if (!Te(n))
    return !1;
  if (e) {
    const t = He(n), r = n.tr;
    if (t.left == 0 && t.right == t.map.width)
      return !1;
    for (let s = t.right - 1; c0(r, t, s), s != t.left; s--) {
      const i = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      t.table = i, t.map = F.get(i);
    }
    e(r);
  }
  return !0;
}
function u0(n, e, t) {
  var r;
  const s = ee(e.type.schema).header_cell;
  for (let i = 0; i < n.width; i++)
    if (((r = e.nodeAt(n.map[i + t * n.width])) == null ? void 0 : r.type) != s)
      return !1;
  return !0;
}
function Ed(n, { map: e, tableStart: t, table: r }, s) {
  var i;
  let o = t;
  for (let c = 0; c < s; c++)
    o += r.child(c).nodeSize;
  const l = [];
  let a = s > 0 ? -1 : 0;
  u0(e, r, s + a) && (a = s == 0 || s == e.height ? null : 0);
  for (let c = 0, d = e.width * s; c < e.width; c++, d++)
    if (s > 0 && s < e.height && e.map[d] == e.map[d - e.width]) {
      const u = e.map[d], h = r.nodeAt(u).attrs;
      n.setNodeMarkup(t + u, null, {
        ...h,
        rowspan: h.rowspan + 1
      }), c += h.colspan - 1;
    } else {
      const u = a == null ? ee(r.type.schema).cell : (i = r.nodeAt(e.map[d + a * e.width])) == null ? void 0 : i.type, h = u == null ? void 0 : u.createAndFill();
      h && l.push(h);
    }
  return n.insert(o, ee(r.type.schema).row.create(null, l)), n;
}
function h0(n, e) {
  if (!Te(n))
    return !1;
  if (e) {
    const t = He(n);
    e(Ed(n.tr, t, t.top));
  }
  return !0;
}
function f0(n, e) {
  if (!Te(n))
    return !1;
  if (e) {
    const t = He(n);
    e(Ed(n.tr, t, t.bottom));
  }
  return !0;
}
function p0(n, { map: e, table: t, tableStart: r }, s) {
  let i = 0;
  for (let c = 0; c < s; c++)
    i += t.child(c).nodeSize;
  const o = i + t.child(s).nodeSize, l = n.mapping.maps.length;
  n.delete(i + r, o + r);
  const a = /* @__PURE__ */ new Set();
  for (let c = 0, d = s * e.width; c < e.width; c++, d++) {
    const u = e.map[d];
    if (!a.has(u)) {
      if (a.add(u), s > 0 && u == e.map[d - e.width]) {
        const h = t.nodeAt(u).attrs;
        n.setNodeMarkup(n.mapping.slice(l).map(u + r), null, {
          ...h,
          rowspan: h.rowspan - 1
        }), c += h.colspan - 1;
      } else if (s < e.height && u == e.map[d + e.width]) {
        const h = t.nodeAt(u), f = h.attrs, p = h.type.create(
          { ...f, rowspan: h.attrs.rowspan - 1 },
          h.content
        ), m = e.positionAt(s + 1, c, t);
        n.insert(n.mapping.slice(l).map(r + m), p), c += f.colspan - 1;
      }
    }
  }
}
function m0(n, e) {
  if (!Te(n))
    return !1;
  if (e) {
    const t = He(n), r = n.tr;
    if (t.top == 0 && t.bottom == t.map.height)
      return !1;
    for (let s = t.bottom - 1; p0(r, t, s), s != t.top; s--) {
      const i = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      t.table = i, t.map = F.get(t.table);
    }
    e(r);
  }
  return !0;
}
function aa(n) {
  const e = n.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function g0({ width: n, height: e, map: t }, r) {
  let s = r.top * n + r.left, i = s, o = (r.bottom - 1) * n + r.left, l = s + (r.right - r.left - 1);
  for (let a = r.top; a < r.bottom; a++) {
    if (r.left > 0 && t[i] == t[i - 1] || r.right < n && t[l] == t[l + 1])
      return !0;
    i += n, l += n;
  }
  for (let a = r.left; a < r.right; a++) {
    if (r.top > 0 && t[s] == t[s - n] || r.bottom < e && t[o] == t[o + n])
      return !0;
    s++, o++;
  }
  return !1;
}
function ca(n, e) {
  const t = n.selection;
  if (!(t instanceof P) || t.$anchorCell.pos == t.$headCell.pos)
    return !1;
  const r = He(n), { map: s } = r;
  if (g0(s, r))
    return !1;
  if (e) {
    const i = n.tr, o = {};
    let l = b.empty, a, c;
    for (let d = r.top; d < r.bottom; d++)
      for (let u = r.left; u < r.right; u++) {
        const h = s.map[d * s.width + u], f = r.table.nodeAt(h);
        if (!(o[h] || !f))
          if (o[h] = !0, a == null)
            a = h, c = f;
          else {
            aa(f) || (l = l.append(f.content));
            const p = i.mapping.map(h + r.tableStart);
            i.delete(p, p + f.nodeSize);
          }
      }
    if (a == null || c == null)
      return !0;
    if (i.setNodeMarkup(a + r.tableStart, null, {
      ...wd(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), l.size) {
      const d = a + 1 + c.content.size, u = aa(c) ? a + 1 : d;
      i.replaceWith(u + r.tableStart, d + r.tableStart, l);
    }
    i.setSelection(
      new P(i.doc.resolve(a + r.tableStart))
    ), e(i);
  }
  return !0;
}
function da(n, e) {
  const t = ee(n.schema);
  return y0(({ node: r }) => t[r.type.spec.tableRole])(n, e);
}
function y0(n) {
  return (e, t) => {
    var r;
    const s = e.selection;
    let i, o;
    if (s instanceof P) {
      if (s.$anchorCell.pos != s.$headCell.pos)
        return !1;
      i = s.$anchorCell.nodeAfter, o = s.$anchorCell.pos;
    } else {
      if (i = Ny(s.$from), !i)
        return !1;
      o = (r = mn(s.$from)) == null ? void 0 : r.pos;
    }
    if (i == null || o == null || i.attrs.colspan == 1 && i.attrs.rowspan == 1)
      return !1;
    if (t) {
      let l = i.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = { ...l, rowspan: 1 }), l.colspan > 1 && (l = { ...l, colspan: 1 });
      const d = He(e), u = e.tr;
      for (let f = 0; f < d.right - d.left; f++)
        a.push(
          c ? {
            ...l,
            colwidth: c && c[f] ? [c[f]] : null
          } : l
        );
      let h;
      for (let f = d.top; f < d.bottom; f++) {
        let p = d.map.positionAt(f, d.left, d.table);
        f == d.top && (p += i.nodeSize);
        for (let m = d.left, g = 0; m < d.right; m++, g++)
          m == d.left && f == d.top || u.insert(
            h = u.mapping.map(p + d.tableStart, 1),
            n({ node: i, row: f, col: m }).createAndFill(a[g])
          );
      }
      u.setNodeMarkup(
        o,
        n({ node: i, row: d.top, col: d.left }),
        a[0]
      ), s instanceof P && u.setSelection(
        new P(
          u.doc.resolve(s.$anchorCell.pos),
          h ? u.doc.resolve(h) : void 0
        )
      ), t(u);
    }
    return !0;
  };
}
function b0(n, e) {
  return function(t, r) {
    if (!Te(t))
      return !1;
    const s = $s(t);
    if (s.nodeAfter.attrs[n] === e)
      return !1;
    if (r) {
      const i = t.tr;
      t.selection instanceof P ? t.selection.forEachCell((o, l) => {
        o.attrs[n] !== e && i.setNodeMarkup(l, null, {
          ...o.attrs,
          [n]: e
        });
      }) : i.setNodeMarkup(s.pos, null, {
        ...s.nodeAfter.attrs,
        [n]: e
      }), r(i);
    }
    return !0;
  };
}
function k0(n) {
  return function(e, t) {
    if (!Te(e))
      return !1;
    if (t) {
      const r = ee(e.schema), s = He(e), i = e.tr, o = s.map.cellsInRect(
        n == "column" ? {
          left: s.left,
          top: 0,
          right: s.right,
          bottom: s.map.height
        } : n == "row" ? {
          left: 0,
          top: s.top,
          right: s.map.width,
          bottom: s.bottom
        } : s
      ), l = o.map((a) => s.table.nodeAt(a));
      for (let a = 0; a < o.length; a++)
        l[a].type == r.header_cell && i.setNodeMarkup(
          s.tableStart + o[a],
          r.cell,
          l[a].attrs
        );
      if (i.steps.length == 0)
        for (let a = 0; a < o.length; a++)
          i.setNodeMarkup(
            s.tableStart + o[a],
            r.header_cell,
            l[a].attrs
          );
      t(i);
    }
    return !0;
  };
}
function ua(n, e, t) {
  const r = e.map.cellsInRect({
    left: 0,
    top: 0,
    right: n == "row" ? e.map.width : 1,
    bottom: n == "column" ? e.map.height : 1
  });
  for (let s = 0; s < r.length; s++) {
    const i = e.table.nodeAt(r[s]);
    if (i && i.type !== t.header_cell)
      return !1;
  }
  return !0;
}
function jn(n, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? k0(n) : function(t, r) {
    if (!Te(t))
      return !1;
    if (r) {
      const s = ee(t.schema), i = He(t), o = t.tr, l = ua("row", i, s), a = ua(
        "column",
        i,
        s
      ), d = (n === "column" ? l : n === "row" ? a : !1) ? 1 : 0, u = n == "column" ? {
        left: 0,
        top: d,
        right: 1,
        bottom: i.map.height
      } : n == "row" ? {
        left: d,
        top: 0,
        right: i.map.width,
        bottom: 1
      } : i, h = n == "column" ? a ? s.cell : s.header_cell : n == "row" ? l ? s.cell : s.header_cell : s.cell;
      i.map.cellsInRect(u).forEach((f) => {
        const p = f + i.tableStart, m = o.doc.nodeAt(p);
        m && o.setNodeMarkup(p, h, m.attrs);
      }), r(o);
    }
    return !0;
  };
}
jn("row", {
  useDeprecatedLogic: !0
});
jn("column", {
  useDeprecatedLogic: !0
});
var w0 = jn("cell", {
  useDeprecatedLogic: !0
});
function x0(n, e) {
  if (e < 0) {
    const t = n.nodeBefore;
    if (t)
      return n.pos - t.nodeSize;
    for (let r = n.index(-1) - 1, s = n.before(); r >= 0; r--) {
      const i = n.node(-1).child(r), o = i.lastChild;
      if (o)
        return s - 1 - o.nodeSize;
      s -= i.nodeSize;
    }
  } else {
    if (n.index() < n.parent.childCount - 1)
      return n.pos + n.nodeAfter.nodeSize;
    const t = n.node(-1);
    for (let r = n.indexAfter(-1), s = n.after(); r < t.childCount; r++) {
      const i = t.child(r);
      if (i.childCount)
        return s + 1;
      s += i.nodeSize;
    }
  }
  return null;
}
function ha(n) {
  return function(e, t) {
    if (!Te(e))
      return !1;
    const r = x0($s(e), n);
    if (r == null)
      return !1;
    if (t) {
      const s = e.doc.resolve(r);
      t(
        e.tr.setSelection(A.between(s, Dy(s))).scrollIntoView()
      );
    }
    return !0;
  };
}
function S0(n, e) {
  const t = n.selection.$anchor;
  for (let r = t.depth; r > 0; r--)
    if (t.node(r).type.spec.tableRole == "table")
      return e && e(
        n.tr.delete(t.before(r), t.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function C0({
  allowTableNodeSelection: n = !1
} = {}) {
  return new X({
    key: tt,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, t) {
        const r = e.getMeta(tt);
        if (r != null)
          return r == -1 ? null : r;
        if (t == null || !e.docChanged)
          return t;
        const { deleted: s, pos: i } = e.mapping.mapResult(t);
        return s ? null : i;
      }
    },
    props: {
      decorations: Py,
      handleDOMEvents: {
        mousedown: qy
      },
      createSelectionBetween(e) {
        return tt.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: Ky,
      handleKeyDown: Uy,
      handlePaste: Jy
    },
    appendTransaction(e, t, r) {
      return zy(
        r,
        Cd(r, t),
        n
      );
    }
  });
}
function fa(n, e, t, r, s, i) {
  let o = 0, l = !0, a = e.firstChild;
  const c = n.firstChild;
  for (let d = 0, u = 0; d < c.childCount; d += 1) {
    const { colspan: h, colwidth: f } = c.child(d).attrs;
    for (let p = 0; p < h; p += 1, u += 1) {
      const m = s === u ? i : f && f[p], g = m ? `${m}px` : "";
      o += m || r, m || (l = !1), a ? (a.style.width !== g && (a.style.width = g), a = a.nextSibling) : e.appendChild(document.createElement("col")).style.width = g;
    }
  }
  for (; a; ) {
    const d = a.nextSibling;
    a.parentNode.removeChild(a), a = d;
  }
  l ? (t.style.width = `${o}px`, t.style.minWidth = "") : (t.style.width = "", t.style.minWidth = `${o}px`);
}
class M0 {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), fa(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, fa(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function T0(n, e, t, r) {
  let s = 0, i = !0;
  const o = [], l = n.firstChild;
  if (!l)
    return {};
  for (let u = 0, h = 0; u < l.childCount; u += 1) {
    const { colspan: f, colwidth: p } = l.child(u).attrs;
    for (let m = 0; m < f; m += 1, h += 1) {
      const g = t === h ? r : p && p[m], y = g ? `${g}px` : "";
      s += g || e, g || (i = !1), o.push(["col", y ? { style: `width: ${y}` } : {}]);
    }
  }
  const a = i ? `${s}px` : "", c = i ? "" : `${s}px`;
  return { colgroup: ["colgroup", {}, ...o], tableWidth: a, tableMinWidth: c };
}
function pa(n, e) {
  return n.createAndFill();
}
function A0(n) {
  if (n.cached.tableNodeTypes)
    return n.cached.tableNodeTypes;
  const e = {};
  return Object.keys(n.nodes).forEach((t) => {
    const r = n.nodes[t];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), n.cached.tableNodeTypes = e, e;
}
function E0(n, e, t, r, s) {
  const i = A0(n), o = [], l = [];
  for (let c = 0; c < t; c += 1) {
    const d = pa(i.cell);
    if (d && l.push(d), r) {
      const u = pa(i.header_cell);
      u && o.push(u);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(i.row.createChecked(null, r && c === 0 ? o : l));
  return i.table.createChecked(null, a);
}
function v0(n) {
  return n instanceof P;
}
const yr = ({ editor: n }) => {
  const { selection: e } = n.state;
  if (!v0(e))
    return !1;
  let t = 0;
  const r = rd(e.ranges[0].$from, (i) => i.type.name === "table");
  return r == null || r.node.descendants((i) => {
    if (i.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(i.type.name) && (t += 1);
  }), t === e.ranges.length ? (n.commands.deleteTable(), !0) : !1;
}, vd = Q.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: M0,
      lastColumnResizable: !0,
      allowTableNodeSelection: !1
    };
  },
  content: "tableRow+",
  tableRole: "table",
  isolating: !0,
  group: "block",
  parseHTML() {
    return [{ tag: "table" }];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    const { colgroup: t, tableWidth: r, tableMinWidth: s } = T0(n, this.options.cellMinWidth);
    return [
      "table",
      $(this.options.HTMLAttributes, e, {
        style: r ? `width: ${r}` : `minWidth: ${s}`
      }),
      t,
      ["tbody", 0]
    ];
  },
  addCommands() {
    return {
      insertTable: ({ rows: n = 3, cols: e = 3, withHeaderRow: t = !0 } = {}) => ({ tr: r, dispatch: s, editor: i }) => {
        const o = E0(i.schema, n, e, t);
        if (s) {
          const l = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(A.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: n, dispatch: e }) => l0(n, e),
      addColumnAfter: () => ({ state: n, dispatch: e }) => a0(n, e),
      deleteColumn: () => ({ state: n, dispatch: e }) => d0(n, e),
      addRowBefore: () => ({ state: n, dispatch: e }) => h0(n, e),
      addRowAfter: () => ({ state: n, dispatch: e }) => f0(n, e),
      deleteRow: () => ({ state: n, dispatch: e }) => m0(n, e),
      deleteTable: () => ({ state: n, dispatch: e }) => S0(n, e),
      mergeCells: () => ({ state: n, dispatch: e }) => ca(n, e),
      splitCell: () => ({ state: n, dispatch: e }) => da(n, e),
      toggleHeaderColumn: () => ({ state: n, dispatch: e }) => jn("column")(n, e),
      toggleHeaderRow: () => ({ state: n, dispatch: e }) => jn("row")(n, e),
      toggleHeaderCell: () => ({ state: n, dispatch: e }) => w0(n, e),
      mergeOrSplit: () => ({ state: n, dispatch: e }) => ca(n, e) ? !0 : da(n, e),
      setCellAttribute: (n, e) => ({ state: t, dispatch: r }) => b0(n, e)(t, r),
      goToNextCell: () => ({ state: n, dispatch: e }) => ha(1)(n, e),
      goToPreviousCell: () => ({ state: n, dispatch: e }) => ha(-1)(n, e),
      fixTables: () => ({ state: n, dispatch: e }) => (e && Cd(n), !0),
      setCellSelection: (n) => ({ tr: e, dispatch: t }) => {
        if (t) {
          const r = P.create(e.doc, n.anchorCell, n.headCell);
          e.setSelection(r);
        }
        return !0;
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.goToNextCell() ? !0 : this.editor.can().addRowAfter() ? this.editor.chain().addRowAfter().goToNextCell().run() : !1,
      "Shift-Tab": () => this.editor.commands.goToPreviousCell(),
      Backspace: yr,
      "Mod-Backspace": yr,
      Delete: yr,
      "Mod-Delete": yr
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        Yy({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      C0({
        allowTableNodeSelection: this.options.allowTableNodeSelection
      })
    ];
  },
  extendNodeSchema(n) {
    const e = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      tableRole: O(S(n, "tableRole", e))
    };
  }
}), Od = Q.create({
  name: "tableHeader",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (n) => {
          const e = n.getAttribute("colwidth");
          return e ? [parseInt(e, 10)] : null;
        }
      }
    };
  },
  tableRole: "header_cell",
  isolating: !0,
  parseHTML() {
    return [
      { tag: "th" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["th", $(this.options.HTMLAttributes, n), 0];
  }
}), Nd = Q.create({
  name: "tableRow",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "(tableCell | tableHeader)*",
  tableRole: "row",
  parseHTML() {
    return [
      { tag: "tr" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["tr", $(this.options.HTMLAttributes, n), 0];
  }
}), Rd = Q.create({
  name: "tableCell",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (n) => {
          const e = n.getAttribute("colwidth");
          return e ? [parseInt(e, 10)] : null;
        }
      }
    };
  },
  tableRole: "cell",
  isolating: !0,
  parseHTML() {
    return [
      { tag: "td" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["td", $(this.options.HTMLAttributes, n), 0];
  }
}), Dd = ke.create({
  name: "underline",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "u"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("underline") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["u", $(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setUnderline: () => ({ commands: n }) => n.setMark(this.name),
      toggleUnderline: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetUnderline: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-U": () => this.editor.commands.toggleUnderline()
    };
  }
}), dn = {
  editor: {
    style: bt(
      "block",
      "border border-gray-100 rounded-3xl *:outline-none",
      "has-[.ProseMirror-focused]:border-black asd",
      "[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4"
    ),
    config: {
      extensions: [
        cd,
        bd.configure({
          openOnClick: !1
        }),
        vd.configure({
          resizable: !0,
          handleWidth: 10,
          lastColumnResizable: !0
        }),
        Od,
        Nd,
        Rd,
        Dd
      ],
      content: `
                <p>Hello World!</p>
            `
    }
  },
  toolbar: {
    style: bt(
      "sticky top-0 z-10 py-2 px-3",
      "flex items-center",
      "rounded-ss-3xl rounded-se-3xl",
      "bg-white"
    )
  },
  button: {
    style: bt(
      "rounded-full p-2",
      "flex justify-center items-center",
      "hover:bg-gray-50",
      "cursor-pointer"
    )
  },
  modal: {
    backdrop: {
      style: bt(
        "hidden",
        "absolute top-0 left-0",
        "h-screen w-screen",
        "bg-gray-400 bg-opacity-20",
        "flex justify-center items-center",
        "backdrop-blur-[2px]",
        "z-[9999]"
      )
    },
    dialog: {
      style: bt(
        "bg-white",
        "min-w-[350px]",
        "rounded-xl",
        "shadow-md"
      )
    }
  },
  dropdown: {
    style: bt(
      "hidden",
      "absolute top-0 left-0 z-10",
      "bg-white shadow-md shadow-gray-100",
      "border border-gray-50",
      "rounded-xl"
    ),
    item: {
      style: bt(
        "py-2 px-4 flex items-center gap-4",
        "rounded-lg",
        "hover:bg-slate-200"
      )
    }
  }
};
class ma extends HTMLElement {
  constructor(t, r, s) {
    super();
    /**
     * Reference to TipTap editor
     * 
     * @type {Editor}
     */
    bn(this, "editor");
    this.toolbar = t, this.dropdown = r, this.modal = s;
  }
  connectedCallback() {
    this.setAttribute("class", dn.editor.style);
  }
  renderedCallback() {
    console.log(this);
  }
  setEditor(t) {
    this.editor = t;
  }
  getEditor() {
    return this.editor;
  }
}
class ga extends HTMLElement {
  constructor() {
    super();
    bn(this, "groups", {});
    bn(this, "registeredButtons", {});
    ["buttonAdded", "groupRegistered", "groupUnregistered"].forEach((t) => this.addEventListener(
      t,
      this.rerender.bind(this)
    ));
  }
  connectedCallback() {
    this.setAttribute("class", dn.toolbar.style);
  }
  /**
   * Registers and adds a new button to the toolbar
   * 
   * @param button 
   * @param editor 
   */
  addButton(t, r, s) {
    if (!this.groups[t])
      throw new Error(`The group named '${t}' does not exist. Please ensure you have spelled the group name correctly or verify that a group with this name has been registered.`);
    dd(r);
    const i = this.groups[t], o = new r(
      s.getEditor(),
      Qd(),
      Zd()
    );
    i.buttons.push(o), this.dispatchEvent(new CustomEvent("buttonAdded", { detail: o }));
  }
  /**
   * Register a new group with buttons to the toolbar
   * 
   * Existing groups must be unregistered first before overwriting
   * 
   * @param name 
   * @param editor 
   * @param buttons 
   */
  registerGroup(t, r, s = []) {
    if (this.groups[t])
      throw new Error(`A group with name ${t} already exists, if this was intentional \`unregisterGroup\` first.`);
    const i = ty("pd-button-group", { id: `group-${t}`, class: "flex ms-2" });
    this.groups[t] = {
      el: i,
      buttons: []
    }, s.forEach((o) => this.addButton(t, o, r)), this.dispatchEvent(new CustomEvent("groupRegistered", { detail: this.groups[t] }));
  }
  /**
   * Removes a group from the toolbar
   * 
   * All buttons registered on this group will be deleted aswell
   * 
   * @param name 
   */
  unregisterGroup(t) {
    delete this.groups[t], this.dispatchEvent(new CustomEvent("groupUnregistered", { detail: this.groups[t] }));
  }
  /**
   * Rerenders all buttons
   * 
   * Some events requires the toolbar from rerendering, like when you add or remove a button
   */
  rerender() {
    this.replaceChildren();
    for (const [t, r] of Object.entries(this.groups))
      r.buttons.forEach((s) => {
        r.el.append(s);
      }), this.append(r.el);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rn = globalThis, ks = Rn.trustedTypes, ya = ks ? ks.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Id = "$lit$", nt = `lit$${Math.random().toFixed(9).slice(2)}$`, Ld = "?" + nt, O0 = `<${Ld}>`, zt = document, Un = () => zt.createComment(""), Kn = (n) => n === null || typeof n != "object" && typeof n != "function", Pd = Array.isArray, N0 = (n) => Pd(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", pi = `[ 	
\f\r]`, wn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ba = /-->/g, ka = />/g, kt = RegExp(`>|${pi}(?:([^\\s"'>=/]+)(${pi}*=${pi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wa = /'/g, xa = /"/g, $d = /^(?:script|style|textarea|title)$/i, R0 = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), je = R0(1), un = Symbol.for("lit-noChange"), W = Symbol.for("lit-nothing"), Sa = /* @__PURE__ */ new WeakMap(), At = zt.createTreeWalker(zt, 129);
function Bd(n, e) {
  if (!Array.isArray(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ya !== void 0 ? ya.createHTML(e) : e;
}
const D0 = (n, e) => {
  const t = n.length - 1, r = [];
  let s, i = e === 2 ? "<svg>" : "", o = wn;
  for (let l = 0; l < t; l++) {
    const a = n[l];
    let c, d, u = -1, h = 0;
    for (; h < a.length && (o.lastIndex = h, d = o.exec(a), d !== null); ) h = o.lastIndex, o === wn ? d[1] === "!--" ? o = ba : d[1] !== void 0 ? o = ka : d[2] !== void 0 ? ($d.test(d[2]) && (s = RegExp("</" + d[2], "g")), o = kt) : d[3] !== void 0 && (o = kt) : o === kt ? d[0] === ">" ? (o = s ?? wn, u = -1) : d[1] === void 0 ? u = -2 : (u = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? kt : d[3] === '"' ? xa : wa) : o === xa || o === wa ? o = kt : o === ba || o === ka ? o = wn : (o = kt, s = void 0);
    const f = o === kt && n[l + 1].startsWith("/>") ? " " : "";
    i += o === wn ? a + O0 : u >= 0 ? (r.push(c), a.slice(0, u) + Id + a.slice(u) + nt + f) : a + nt + (u === -2 ? l : f);
  }
  return [Bd(n, i + (n[t] || "<?>") + (e === 2 ? "</svg>" : "")), r];
};
class Jn {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, d] = D0(e, t);
    if (this.el = Jn.createElement(c, r), At.currentNode = this.el.content, t === 2) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = At.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(Id)) {
          const h = d[o++], f = s.getAttribute(u).split(nt), p = /([.?@])?(.*)/.exec(h);
          a.push({ type: 1, index: i, name: p[2], strings: f, ctor: p[1] === "." ? L0 : p[1] === "?" ? P0 : p[1] === "@" ? $0 : Bs }), s.removeAttribute(u);
        } else u.startsWith(nt) && (a.push({ type: 6, index: i }), s.removeAttribute(u));
        if ($d.test(s.tagName)) {
          const u = s.textContent.split(nt), h = u.length - 1;
          if (h > 0) {
            s.textContent = ks ? ks.emptyScript : "";
            for (let f = 0; f < h; f++) s.append(u[f], Un()), At.nextNode(), a.push({ type: 2, index: ++i });
            s.append(u[h], Un());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ld) a.push({ type: 2, index: i });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(nt, u + 1)) !== -1; ) a.push({ type: 7, index: i }), u += nt.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = zt.createElement("template");
    return r.innerHTML = e, r;
  }
}
function hn(n, e, t = n, r) {
  var o, l;
  if (e === un) return e;
  let s = r !== void 0 ? (o = t._$Co) == null ? void 0 : o[r] : t._$Cl;
  const i = Kn(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), i === void 0 ? s = void 0 : (s = new i(n), s._$AT(n, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = s : t._$Cl = s), s !== void 0 && (e = hn(n, s._$AS(n, e.values), s, r)), e;
}
let I0 = class {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? zt).importNode(t, !0);
    At.currentNode = s;
    let i = At.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new Zn(i, i.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (c = new B0(i, this, e)), this._$AV.push(c), a = r[++l];
      }
      o !== (a == null ? void 0 : a.index) && (i = At.nextNode(), o++);
    }
    return At.currentNode = zt, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
};
class Zn {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = W, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = hn(this, e, t), Kn(e) ? e === W || e == null || e === "" ? (this._$AH !== W && this._$AR(), this._$AH = W) : e !== this._$AH && e !== un && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : N0(e) ? this.k(e) : this._(e);
  }
  S(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.S(e));
  }
  _(e) {
    this._$AH !== W && Kn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(zt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var i;
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Jn.createElement(Bd(r.h, r.h[0]), this.options)), r);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(t);
    else {
      const o = new I0(s, this), l = o.u(this.options);
      o.p(t), this.T(l), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Sa.get(e.strings);
    return t === void 0 && Sa.set(e.strings, t = new Jn(e)), t;
  }
  k(e) {
    Pd(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const i of e) s === t.length ? t.push(r = new Zn(this.S(Un()), this.S(Un()), this, this.options)) : r = t[s], r._$AI(i), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const s = e.nextSibling;
      e.remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Bs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, i) {
    this.type = 1, this._$AH = W, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = W;
  }
  _$AI(e, t = this, r, s) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = hn(this, e, t, 0), o = !Kn(e) || e !== this._$AH && e !== un, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = i[0], a = 0; a < i.length - 1; a++) c = hn(this, l[r + a], t, a), c === un && (c = this._$AH[a]), o || (o = !Kn(c) || c !== this._$AH[a]), c === W ? e = W : e !== W && (e += (c ?? "") + i[a + 1]), this._$AH[a] = c;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === W ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class L0 extends Bs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === W ? void 0 : e;
  }
}
class P0 extends Bs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== W);
  }
}
class $0 extends Bs {
  constructor(e, t, r, s, i) {
    super(e, t, r, s, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = hn(this, e, t, 0) ?? W) === un) return;
    const r = this._$AH, s = e === W && r !== W || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== W && (r === W || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class B0 {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    hn(this, e);
  }
}
const mi = Rn.litHtmlPolyfillSupport;
mi == null || mi(Jn, Zn), (Rn.litHtmlVersions ?? (Rn.litHtmlVersions = [])).push("3.1.4");
const Dn = (n, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = s = new Zn(e.insertBefore(Un(), i), i, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
class yt extends HTMLElement {
  constructor(e, t, r) {
    super(), this.editor = e, this.dropdown = t, this.modal = r;
  }
  /**
   * Button type, `button`, `dropdown` or `modal`
   *
   * Default `button`
   */
  getType() {
    return "button";
  }
  /**
   * Used in the tooltip
   * 
   * In a `modal` also used as header title 
   *
   * @returns 
   */
  getTitle() {
    return "";
  }
  onMount() {
    this.replaceChildren(), this.setAttribute("class", dn.button.style), this.setAttribute("title", this.getTitle()), this.insertAdjacentHTML("beforeend", this.getIcon()), this.editor.on("transaction", () => this.toggleActive()), this.onClick && this.addEventListener("click", this.onClick), this.getType() === "dropdown" && this.insertAdjacentHTML("beforeend", '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>'), (this.getType() === "modal" || this.getType() === "dropdown") && this.addEventListener("click", () => this[this.getType()].toggle(this));
  }
  setActive() {
    this.classList.add("bg-gray-50");
  }
  setInactive() {
    this.classList.remove("bg-gray-50");
  }
  toggleActive() {
    return this.isActive() ? this.setActive() : this.setInactive();
  }
}
const z0 = new Event("show"), H0 = new Event("hide");
class zd extends HTMLElement {
  constructor() {
    super();
    /**
     * A reference to the element that activated the modal
     */
    bn(this, "reference");
    this.setAttribute("class", dn.modal.backdrop.style), document.addEventListener("keyup", (t) => t.code === "Escape" && this.hide());
  }
  show(t) {
    this.reference = t, this.classList.replace("hidden", "block"), this.dispatchEvent(z0), this.render();
  }
  hide() {
    this.classList.replace("block", "hidden"), this.dispatchEvent(H0);
  }
  toggle(t) {
    this.checkVisibility() ? this.hide() : this.show(t);
  }
  render() {
    if (this.reference instanceof yt) {
      const t = je`
                <div  class=${dn.modal.dialog.style}>
                    <div class="p-4 flex items-center">
                        ${this.reference.getTitle() !== "" ? je`<span class="text-xl font-bold">${this.reference.getTitle()}</span>` : ""}
                        <button @click=${() => this.hide()} class="p-2 ms-auto rounded-full bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-4">
                        ${this.reference.getTemplate()}
                    </div>
                </div>
            `;
      Dn(t, this);
    }
  }
}
const Qi = Math.min, en = Math.max, ws = Math.round, br = Math.floor, ht = (n) => ({
  x: n,
  y: n
});
function Hd(n) {
  return n.split("-")[0];
}
function F0(n) {
  return n.split("-")[1];
}
function V0(n) {
  return n === "x" ? "y" : "x";
}
function _0(n) {
  return n === "y" ? "height" : "width";
}
function Fd(n) {
  return ["top", "bottom"].includes(Hd(n)) ? "y" : "x";
}
function W0(n) {
  return V0(Fd(n));
}
function Vd(n) {
  const {
    x: e,
    y: t,
    width: r,
    height: s
  } = n;
  return {
    width: r,
    height: s,
    top: t,
    left: e,
    right: e + r,
    bottom: t + s,
    x: e,
    y: t
  };
}
function Ca(n, e, t) {
  let {
    reference: r,
    floating: s
  } = n;
  const i = Fd(e), o = W0(e), l = _0(o), a = Hd(e), c = i === "y", d = r.x + r.width / 2 - s.width / 2, u = r.y + r.height / 2 - s.height / 2, h = r[l] / 2 - s[l] / 2;
  let f;
  switch (a) {
    case "top":
      f = {
        x: d,
        y: r.y - s.height
      };
      break;
    case "bottom":
      f = {
        x: d,
        y: r.y + r.height
      };
      break;
    case "right":
      f = {
        x: r.x + r.width,
        y: u
      };
      break;
    case "left":
      f = {
        x: r.x - s.width,
        y: u
      };
      break;
    default:
      f = {
        x: r.x,
        y: r.y
      };
  }
  switch (F0(e)) {
    case "start":
      f[o] -= h * (t && c ? -1 : 1);
      break;
    case "end":
      f[o] += h * (t && c ? -1 : 1);
      break;
  }
  return f;
}
const j0 = async (n, e, t) => {
  const {
    placement: r = "bottom",
    strategy: s = "absolute",
    middleware: i = [],
    platform: o
  } = t, l = i.filter(Boolean), a = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: n,
    floating: e,
    strategy: s
  }), {
    x: d,
    y: u
  } = Ca(c, r, a), h = r, f = {}, p = 0;
  for (let m = 0; m < l.length; m++) {
    const {
      name: g,
      fn: y
    } = l[m], {
      x: k,
      y: C,
      data: R,
      reset: v
    } = await y({
      x: d,
      y: u,
      initialPlacement: r,
      placement: h,
      strategy: s,
      middlewareData: f,
      rects: c,
      platform: o,
      elements: {
        reference: n,
        floating: e
      }
    });
    d = k ?? d, u = C ?? u, f = {
      ...f,
      [g]: {
        ...f[g],
        ...R
      }
    }, v && p <= 50 && (p++, typeof v == "object" && (v.placement && (h = v.placement), v.rects && (c = v.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: s
    }) : v.rects), {
      x: d,
      y: u
    } = Ca(c, h, a)), m = -1);
  }
  return {
    x: d,
    y: u,
    placement: h,
    strategy: s,
    middlewareData: f
  };
};
function gn(n) {
  return _d(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function ue(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ke(n) {
  var e;
  return (e = (_d(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function _d(n) {
  return n instanceof Node || n instanceof ue(n).Node;
}
function Be(n) {
  return n instanceof Element || n instanceof ue(n).Element;
}
function ze(n) {
  return n instanceof HTMLElement || n instanceof ue(n).HTMLElement;
}
function Ma(n) {
  return typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof ue(n).ShadowRoot;
}
function er(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: s
  } = Me(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !["inline", "contents"].includes(s);
}
function U0(n) {
  return ["table", "td", "th"].includes(gn(n));
}
function zs(n) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
function No(n) {
  const e = Ro(), t = Me(n);
  return t.transform !== "none" || t.perspective !== "none" || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((r) => (t.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some((r) => (t.contain || "").includes(r));
}
function K0(n) {
  let e = ft(n);
  for (; ze(e) && !fn(e); ) {
    if (zs(e))
      return null;
    if (No(e))
      return e;
    e = ft(e);
  }
  return null;
}
function Ro() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function fn(n) {
  return ["html", "body", "#document"].includes(gn(n));
}
function Me(n) {
  return ue(n).getComputedStyle(n);
}
function Hs(n) {
  return Be(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function ft(n) {
  if (gn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Ma(n) && n.host || // Fallback.
    Ke(n)
  );
  return Ma(e) ? e.host : e;
}
function Wd(n) {
  const e = ft(n);
  return fn(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : ze(e) && er(e) ? e : Wd(e);
}
function qn(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const s = Wd(n), i = s === ((r = n.ownerDocument) == null ? void 0 : r.body), o = ue(s);
  return i ? e.concat(o, o.visualViewport || [], er(s) ? s : [], o.frameElement && t ? qn(o.frameElement) : []) : e.concat(s, qn(s, [], t));
}
function jd(n) {
  const e = Me(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const s = ze(n), i = s ? n.offsetWidth : t, o = s ? n.offsetHeight : r, l = ws(t) !== i || ws(r) !== o;
  return l && (t = i, r = o), {
    width: t,
    height: r,
    $: l
  };
}
function Do(n) {
  return Be(n) ? n : n.contextElement;
}
function tn(n) {
  const e = Do(n);
  if (!ze(e))
    return ht(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: s,
    $: i
  } = jd(e);
  let o = (i ? ws(t.width) : t.width) / r, l = (i ? ws(t.height) : t.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!l || !Number.isFinite(l)) && (l = 1), {
    x: o,
    y: l
  };
}
const J0 = /* @__PURE__ */ ht(0);
function Ud(n) {
  const e = ue(n);
  return !Ro() || !e.visualViewport ? J0 : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function q0(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== ue(n) ? !1 : e;
}
function Ht(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const s = n.getBoundingClientRect(), i = Do(n);
  let o = ht(1);
  e && (r ? Be(r) && (o = tn(r)) : o = tn(n));
  const l = q0(i, t, r) ? Ud(i) : ht(0);
  let a = (s.left + l.x) / o.x, c = (s.top + l.y) / o.y, d = s.width / o.x, u = s.height / o.y;
  if (i) {
    const h = ue(i), f = r && Be(r) ? ue(r) : r;
    let p = h, m = p.frameElement;
    for (; m && r && f !== p; ) {
      const g = tn(m), y = m.getBoundingClientRect(), k = Me(m), C = y.left + (m.clientLeft + parseFloat(k.paddingLeft)) * g.x, R = y.top + (m.clientTop + parseFloat(k.paddingTop)) * g.y;
      a *= g.x, c *= g.y, d *= g.x, u *= g.y, a += C, c += R, p = ue(m), m = p.frameElement;
    }
  }
  return Vd({
    width: d,
    height: u,
    x: a,
    y: c
  });
}
function G0(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: s
  } = n;
  const i = s === "fixed", o = Ke(r), l = e ? zs(e.floating) : !1;
  if (r === o || l && i)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = ht(1);
  const d = ht(0), u = ze(r);
  if ((u || !u && !i) && ((gn(r) !== "body" || er(o)) && (a = Hs(r)), ze(r))) {
    const h = Ht(r);
    c = tn(r), d.x = h.x + r.clientLeft, d.y = h.y + r.clientTop;
  }
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - a.scrollLeft * c.x + d.x,
    y: t.y * c.y - a.scrollTop * c.y + d.y
  };
}
function Y0(n) {
  return Array.from(n.getClientRects());
}
function Kd(n) {
  return Ht(Ke(n)).left + Hs(n).scrollLeft;
}
function X0(n) {
  const e = Ke(n), t = Hs(n), r = n.ownerDocument.body, s = en(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), i = en(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Kd(n);
  const l = -t.scrollTop;
  return Me(r).direction === "rtl" && (o += en(e.clientWidth, r.clientWidth) - s), {
    width: s,
    height: i,
    x: o,
    y: l
  };
}
function Q0(n, e) {
  const t = ue(n), r = Ke(n), s = t.visualViewport;
  let i = r.clientWidth, o = r.clientHeight, l = 0, a = 0;
  if (s) {
    i = s.width, o = s.height;
    const c = Ro();
    (!c || c && e === "fixed") && (l = s.offsetLeft, a = s.offsetTop);
  }
  return {
    width: i,
    height: o,
    x: l,
    y: a
  };
}
function Z0(n, e) {
  const t = Ht(n, !0, e === "fixed"), r = t.top + n.clientTop, s = t.left + n.clientLeft, i = ze(n) ? tn(n) : ht(1), o = n.clientWidth * i.x, l = n.clientHeight * i.y, a = s * i.x, c = r * i.y;
  return {
    width: o,
    height: l,
    x: a,
    y: c
  };
}
function Ta(n, e, t) {
  let r;
  if (e === "viewport")
    r = Q0(n, t);
  else if (e === "document")
    r = X0(Ke(n));
  else if (Be(e))
    r = Z0(e, t);
  else {
    const s = Ud(n);
    r = {
      ...e,
      x: e.x - s.x,
      y: e.y - s.y
    };
  }
  return Vd(r);
}
function Jd(n, e) {
  const t = ft(n);
  return t === e || !Be(t) || fn(t) ? !1 : Me(t).position === "fixed" || Jd(t, e);
}
function e1(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = qn(n, [], !1).filter((l) => Be(l) && gn(l) !== "body"), s = null;
  const i = Me(n).position === "fixed";
  let o = i ? ft(n) : n;
  for (; Be(o) && !fn(o); ) {
    const l = Me(o), a = No(o);
    !a && l.position === "fixed" && (s = null), (i ? !a && !s : !a && l.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || er(o) && !a && Jd(n, o)) ? r = r.filter((d) => d !== o) : s = l, o = ft(o);
  }
  return e.set(n, r), r;
}
function t1(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: s
  } = n;
  const o = [...t === "clippingAncestors" ? zs(e) ? [] : e1(e, this._c) : [].concat(t), r], l = o[0], a = o.reduce((c, d) => {
    const u = Ta(e, d, s);
    return c.top = en(u.top, c.top), c.right = Qi(u.right, c.right), c.bottom = Qi(u.bottom, c.bottom), c.left = en(u.left, c.left), c;
  }, Ta(e, l, s));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function n1(n) {
  const {
    width: e,
    height: t
  } = jd(n);
  return {
    width: e,
    height: t
  };
}
function r1(n, e, t) {
  const r = ze(e), s = Ke(e), i = t === "fixed", o = Ht(n, !0, i, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = ht(0);
  if (r || !r && !i)
    if ((gn(e) !== "body" || er(s)) && (l = Hs(e)), r) {
      const u = Ht(e, !0, i, e);
      a.x = u.x + e.clientLeft, a.y = u.y + e.clientTop;
    } else s && (a.x = Kd(s));
  const c = o.left + l.scrollLeft - a.x, d = o.top + l.scrollTop - a.y;
  return {
    x: c,
    y: d,
    width: o.width,
    height: o.height
  };
}
function gi(n) {
  return Me(n).position === "static";
}
function Aa(n, e) {
  return !ze(n) || Me(n).position === "fixed" ? null : e ? e(n) : n.offsetParent;
}
function qd(n, e) {
  const t = ue(n);
  if (zs(n))
    return t;
  if (!ze(n)) {
    let s = ft(n);
    for (; s && !fn(s); ) {
      if (Be(s) && !gi(s))
        return s;
      s = ft(s);
    }
    return t;
  }
  let r = Aa(n, e);
  for (; r && U0(r) && gi(r); )
    r = Aa(r, e);
  return r && fn(r) && gi(r) && !No(r) ? t : r || K0(n) || t;
}
const s1 = async function(n) {
  const e = this.getOffsetParent || qd, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: r1(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function i1(n) {
  return Me(n).direction === "rtl";
}
const o1 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: G0,
  getDocumentElement: Ke,
  getClippingRect: t1,
  getOffsetParent: qd,
  getElementRects: s1,
  getClientRects: Y0,
  getDimensions: n1,
  getScale: tn,
  isElement: Be,
  isRTL: i1
};
function l1(n, e) {
  let t = null, r;
  const s = Ke(n);
  function i() {
    var l;
    clearTimeout(r), (l = t) == null || l.disconnect(), t = null;
  }
  function o(l, a) {
    l === void 0 && (l = !1), a === void 0 && (a = 1), i();
    const {
      left: c,
      top: d,
      width: u,
      height: h
    } = n.getBoundingClientRect();
    if (l || e(), !u || !h)
      return;
    const f = br(d), p = br(s.clientWidth - (c + u)), m = br(s.clientHeight - (d + h)), g = br(c), k = {
      rootMargin: -f + "px " + -p + "px " + -m + "px " + -g + "px",
      threshold: en(0, Qi(1, a)) || 1
    };
    let C = !0;
    function R(v) {
      const M = v[0].intersectionRatio;
      if (M !== a) {
        if (!C)
          return o();
        M ? o(!1, M) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      C = !1;
    }
    try {
      t = new IntersectionObserver(R, {
        ...k,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(R, k);
    }
    t.observe(n);
  }
  return o(!0), i;
}
function a1(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: i = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: l = typeof IntersectionObserver == "function",
    animationFrame: a = !1
  } = r, c = Do(n), d = s || i ? [...c ? qn(c) : [], ...qn(e)] : [];
  d.forEach((y) => {
    s && y.addEventListener("scroll", t, {
      passive: !0
    }), i && y.addEventListener("resize", t);
  });
  const u = c && l ? l1(c, t) : null;
  let h = -1, f = null;
  o && (f = new ResizeObserver((y) => {
    let [k] = y;
    k && k.target === c && f && (f.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var C;
      (C = f) == null || C.observe(e);
    })), t();
  }), c && !a && f.observe(c), f.observe(e));
  let p, m = a ? Ht(n) : null;
  a && g();
  function g() {
    const y = Ht(n);
    m && (y.x !== m.x || y.y !== m.y || y.width !== m.width || y.height !== m.height) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    d.forEach((k) => {
      s && k.removeEventListener("scroll", t), i && k.removeEventListener("resize", t);
    }), u == null || u(), (y = f) == null || y.disconnect(), f = null, a && cancelAnimationFrame(p);
  };
}
const c1 = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), s = {
    platform: o1,
    ...t
  }, i = {
    ...s.platform,
    _c: r
  };
  return j0(n, e, {
    ...s,
    platform: i
  });
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ar = globalThis, Io = Ar.ShadowRoot && (Ar.ShadyCSS === void 0 || Ar.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Gd = Symbol(), Ea = /* @__PURE__ */ new WeakMap();
let d1 = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Gd) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Io && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ea.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ea.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const u1 = (n) => new d1(typeof n == "string" ? n : n + "", void 0, Gd), h1 = (n, e) => {
  if (Io) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = Ar.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, n.appendChild(r);
  }
}, va = Io ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return u1(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: f1, defineProperty: p1, getOwnPropertyDescriptor: m1, getOwnPropertyNames: g1, getOwnPropertySymbols: y1, getPrototypeOf: b1 } = Object, dt = globalThis, Oa = dt.trustedTypes, k1 = Oa ? Oa.emptyScript : "", yi = dt.reactiveElementPolyfillSupport, In = (n, e) => n, Zi = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? k1 : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Yd = (n, e) => !f1(n, e), Na = { attribute: !0, type: String, converter: Zi, reflect: !1, hasChanged: Yd };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), dt.litPropertyMetadata ?? (dt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class Jt extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Na) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && p1(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: i } = m1(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get() {
      return s == null ? void 0 : s.call(this);
    }, set(o) {
      const l = s == null ? void 0 : s.call(this);
      i.call(this, o), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Na;
  }
  static _$Ei() {
    if (this.hasOwnProperty(In("elementProperties"))) return;
    const e = b1(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(In("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(In("properties"))) {
      const t = this.properties, r = [...g1(t), ...y1(t)];
      for (const s of r) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, s] of t) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const s = this._$Eu(t, r);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) t.unshift(va(s));
    } else e !== void 0 && t.push(va(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return h1(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$EC(e, t) {
    var i;
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (((i = r.converter) == null ? void 0 : i.toAttribute) !== void 0 ? r.converter : Zi).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i;
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = r.getPropertyOptions(s), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((i = o.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? o.converter : Zi;
      this._$Em = s, this[s] = l.fromAttribute(t, o.type), this._$Em = null;
    }
  }
  requestUpdate(e, t, r) {
    if (e !== void 0) {
      if (r ?? (r = this.constructor.getPropertyOptions(e)), !(r.hasChanged ?? Yd)(this[e], t)) return;
      this.P(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(e, t, r) {
    this._$AL.has(e) || this._$AL.set(e, t), r.reflect === !0 && this._$Em !== e && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(e);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) o.wrapped !== !0 || this._$AL.has(i) || this[i] === void 0 || this.P(i, this[i], o);
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((s) => {
        var i;
        return (i = s.hostUpdate) == null ? void 0 : i.call(s);
      }), this.update(t)) : this._$EU();
    } catch (s) {
      throw e = !1, this._$EU(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t) => this._$EC(t, this[t]))), this._$EU();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
Jt.elementStyles = [], Jt.shadowRootOptions = { mode: "open" }, Jt[In("elementProperties")] = /* @__PURE__ */ new Map(), Jt[In("finalized")] = /* @__PURE__ */ new Map(), yi == null || yi({ ReactiveElement: Jt }), (dt.reactiveElementVersions ?? (dt.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Er extends Jt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Dn(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return un;
  }
}
var Ra;
Er._$litElement$ = !0, Er.finalized = !0, (Ra = globalThis.litElementHydrateSupport) == null || Ra.call(globalThis, { LitElement: Er });
const bi = globalThis.litElementPolyfillSupport;
bi == null || bi({ LitElement: Er });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.6");
var Re, Gn, rt;
class Xd extends HTMLElement {
  constructor() {
    super(...arguments);
    rr(this, Re);
    rr(this, Gn, "bottom-start");
    rr(this, rt);
  }
  connectedCallback() {
    this.setAttribute("class", dn.dropdown.style), document.addEventListener("keyup", (t) => t.code === "Escape" && this.hide());
  }
  disconnectCallback() {
    fe(this, rt) && fe(this, rt).call(this);
  }
  setPlacement(t) {
    sr(this, Gn, t);
  }
  getPlacement() {
    return fe(this, Gn);
  }
  getReference() {
    return fe(this, Re);
  }
  renderHTML(t) {
    Dn(t, this);
  }
  updatePosition() {
    return c1(this.getReference(), this, { placement: this.getPlacement() }).then(({ x: t, y: r }) => {
      this.style.top = `${r}px`, this.style.left = `${t}px`;
    });
  }
  async show(t) {
    sr(this, Re, t), this.classList.remove("hidden"), this.classList.add("block"), sr(this, rt, a1(
      t,
      this,
      this.updatePosition.bind(this)
    )), this.render(), document.addEventListener("click", this.onClickOutside.bind(this));
  }
  hide() {
    this.classList.remove("block"), this.classList.add("hidden"), document.removeEventListener("click", this.onClickOutside.bind(this)), fe(this, rt) && fe(this, rt).call(this);
  }
  toggle(t) {
    this.checkVisibility() ? this.hide() : this.show(t);
  }
  onClickOutside(t) {
    var r;
    this.contains(t.target) || (r = fe(this, Re)) != null && r.contains(t.target) || this.hide();
  }
  render() {
    if (fe(this, Re) instanceof yt) {
      if (Array.isArray(fe(this, Re).getTemplate())) {
        const t = je`
                <nav class="list-none flex flex-col">
                    ${fe(this, Re).getTemplate().map(
          (r) => je`
                            <li>
                                <button class="p-2 w-full rounded-lg hover:bg-gray-50" @click=${(s) => r.action(s, this)}>
                                    ${r.icon}
                                </button>
                            </li>
                        `
        )}
                </nav>
            `;
        return this.classList.add("p-1"), this.classList.add("min-w-[150px]"), Dn(t, this);
      }
      return Dn(fe(this, Re).getTemplate(), this);
    }
  }
}
Re = new WeakMap(), Gn = new WeakMap(), rt = new WeakMap();
class w1 extends yt {
  getType() {
    return "dropdown";
  }
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading"><path d="M6 12h12"/><path d="M6 20V4"/><path d="M18 20V4"/></svg>';
  }
  isActive() {
    return this.editor.isActive("heading");
  }
  getTemplate() {
    return [
      {
        title: "H2",
        icon: je`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
      },
      {
        title: "H3",
        icon: je`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
      },
      {
        title: "H4",
        icon: je`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-4"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 4 }).run();
        }
      },
      {
        title: "H5",
        icon: je`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-5"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 13v-3h4"/><path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 5 }).run();
        }
      },
      {
        title: "H6",
        icon: je`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-6"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 6 }).run();
        }
      }
    ];
  }
}
class x1 extends yt {
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bold"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>';
  }
  onClick() {
    this.editor.chain().focus().toggleBold().run();
  }
  isActive() {
    return this.editor.isActive("bold");
  }
}
class S1 extends yt {
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>';
  }
  onClick() {
    this.editor.chain().focus().toggleItalic().run();
  }
  isActive() {
    return this.editor.isActive("italic");
  }
}
class C1 extends yt {
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-underline"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>';
  }
  getTitle() {
    return "Underline";
  }
  onClick() {
    this.editor.chain().focus().toggleUnderline().run();
  }
  isActive() {
    return this.editor.isActive("underline");
  }
}
class M1 extends yt {
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>';
  }
  onClick() {
    this.editor.chain().focus().toggleStrike().run();
  }
  isActive() {
    return this.editor.isActive("strike");
  }
}
const T1 = {
  toolbar: {
    buttons: [
      [
        w1
      ],
      [
        x1,
        S1,
        C1,
        M1
      ]
    ]
  },
  tiptap: {
    extensions: [
      cd,
      bd.configure({
        openOnClick: !1
      }),
      vd.configure({
        resizable: !0,
        handleWidth: 10,
        lastColumnResizable: !0
      }),
      Od,
      Nd,
      Rd,
      Dd
    ],
    content: `
            <p>Hello Worlds!</p>
        `
  }
}, N1 = (n, e = T1) => {
  [
    ma,
    yt,
    ga,
    zd,
    Xd
  ].forEach(dd), ry();
  const r = new ga(), s = new ma(r, Qd(), Zd()), i = new eg({ ...e.tiptap, element: s });
  n.replaceWith(i.options.element), s.prepend(r), s.setEditor(i);
  for (const o in e.toolbar.buttons)
    r.registerGroup(o, s, e.toolbar.buttons[o]);
  return s;
}, Qd = () => document.querySelector("pd-dropdown") ?? document.body.appendChild(new Xd()), Zd = () => document.querySelector("pd-modal") ?? document.body.appendChild(new zd());
export {
  yt as PdButton,
  N1 as createEditor,
  T1 as defaultConfig,
  Qd as getDropdown,
  Zd as getModal
};
