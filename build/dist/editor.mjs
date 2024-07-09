var nu = Object.defineProperty;
var Bo = (n) => {
  throw TypeError(n);
};
var ru = (n, e, t) => e in n ? nu(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var Re = (n, e, t) => ru(n, typeof e != "symbol" ? e + "" : e, t), zo = (n, e, t) => e.has(n) || Bo("Cannot " + t);
var me = (n, e, t) => (zo(n, e, "read from private field"), t ? t.call(n) : e.get(n)), sr = (n, e, t) => e.has(n) ? Bo("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), ir = (n, e, t, r) => (zo(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t);
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
      return or(0, e);
    if (e == this.size)
      return or(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, s = 0; ; r++) {
      let i = this.child(r), o = s + i.nodeSize;
      if (o >= e)
        return o == e || t > 0 ? or(r + 1, o) : or(r, s);
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
const Ws = { index: 0, offset: 0 };
function or(n, e) {
  return Ws.index = n, Ws.offset = e, Ws;
}
function Or(n, e) {
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
      if (!Or(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !Or(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let L = class xi {
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
    return this == e || this.type == e.type && Or(this.attrs, e.attrs);
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
      return xi.none;
    if (e instanceof xi)
      return [e];
    let t = e.slice();
    return t.sort((r, s) => r.type.rank - s.type.rank), t;
  }
};
L.none = [];
class Nr extends Error {
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
function su(n, e, t) {
  if (t.openStart > n.depth)
    throw new Nr("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Nr("Inconsistent open depths");
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
      return Nt(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = iu(t, n);
      return Nt(i, za(n, o, l, e, r));
    }
  else return Nt(i, Rr(n, e, r));
}
function Ba(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Nr("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Si(n, e, t) {
  let r = n.node(t);
  return Ba(r, e.node(t)), r;
}
function Ot(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Mn(n, e, t, r) {
  let s = (e || n).node(t), i = 0, o = e ? e.index(t) : s.childCount;
  n && (i = n.index(t), n.depth > t ? i++ : n.textOffset && (Ot(n.nodeAfter, r), i++));
  for (let l = i; l < o; l++)
    Ot(s.child(l), r);
  e && e.depth == t && e.textOffset && Ot(e.nodeBefore, r);
}
function Nt(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function za(n, e, t, r, s) {
  let i = n.depth > s && Si(n, e, s + 1), o = r.depth > s && Si(t, r, s + 1), l = [];
  return Mn(null, n, s, l), i && o && e.index(s) == t.index(s) ? (Ba(i, o), Ot(Nt(i, za(n, e, t, r, s + 1)), l)) : (i && Ot(Nt(i, Rr(n, e, s + 1)), l), Mn(e, t, s, l), o && Ot(Nt(o, Rr(t, r, s + 1)), l)), Mn(r, null, s, l), new b(l);
}
function Rr(n, e, t) {
  let r = [];
  if (Mn(null, n, t, r), n.depth > t) {
    let s = Si(n, e, t + 1);
    Ot(Nt(s, Rr(n, e, t + 1)), r);
  }
  return Mn(e, null, t, r), new b(r);
}
function iu(n, e) {
  let t = e.depth - n.openStart, s = e.node(t).copy(n.content);
  for (let i = t - 1; i >= 0; i--)
    s = e.node(i).copy(b.from(s));
  return {
    start: s.resolveNoCache(n.openStart + t),
    end: s.resolveNoCache(s.content.size - n.openEnd - t)
  };
}
class Pn {
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
        return new Dr(this, e, r);
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
    return new Pn(t, r, i);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Ho.get(e);
    if (r)
      for (let i = 0; i < r.elts.length; i++) {
        let o = r.elts[i];
        if (o.pos == t)
          return o;
      }
    else
      Ho.set(e, r = new ou());
    let s = r.elts[r.i] = Pn.resolve(e, t);
    return r.i = (r.i + 1) % lu, s;
  }
}
class ou {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const lu = 12, Ho = /* @__PURE__ */ new WeakMap();
class Dr {
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
const au = /* @__PURE__ */ Object.create(null);
let Rt = class Ci {
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
    return this.type == e && Or(this.attrs, t || e.defaultAttrs || au) && L.sameSet(this.marks, r || L.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Ci(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Ci(this.type, this.attrs, this.content, e);
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
    return su(this.resolve(e), this.resolve(t), r);
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
    return Pn.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Pn.resolve(this, e);
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
Rt.prototype.text = void 0;
class Ir extends Rt {
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
    return e == this.marks ? this : new Ir(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Ir(this.type, this.attrs, e, this.marks);
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
class Pt {
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
    let r = new cu(e, t);
    if (r.next == null)
      return Pt.empty;
    let s = Fa(r);
    r.next && r.err("Unexpected trailing text");
    let i = gu(mu(s));
    return yu(i, r), i;
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
Pt.empty = new Pt(!0);
class cu {
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
    e.push(du(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function du(n) {
  let e = [];
  do
    e.push(uu(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function uu(n) {
  let e = pu(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = hu(n, e);
    else
      break;
  return e;
}
function Fo(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function hu(n, e) {
  let t = Fo(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Fo(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function fu(n, e) {
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
function pu(n) {
  if (n.eat("(")) {
    let e = Fa(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = fu(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function mu(n) {
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
function Vo(n, e) {
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
function gu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Vo(n, 0));
  function t(r) {
    let s = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let d = 0; d < s.length; d++)
          s[d][0] == l && (c = s[d][1]);
        Vo(n, a).forEach((d) => {
          c || s.push([l, c = []]), c.indexOf(d) == -1 && c.push(d);
        });
      });
    });
    let i = e[r.join(",")] = new Pt(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < s.length; o++) {
      let l = s[o][1].sort(Va);
      i.next.push({ type: s[o][0], next: e[l.join(",")] || t(l) });
    }
    return i;
  }
}
function yu(n, e) {
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
function ja(n, e) {
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
function Wa(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new bu(n[t]);
  return e;
}
let _o = class Ua {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Wa(r.attrs), this.defaultAttrs = _a(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == Pt.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : ja(this.attrs, e);
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
    return new Rt(this, this.computeAttrs(e), b.from(t), L.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = b.from(t), this.checkContent(t), new Rt(this, this.computeAttrs(e), t, L.setFrom(r));
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
    return i ? new Rt(this, e, t.append(i), L.setFrom(r)) : null;
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
class bu {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Cs {
  /**
  @internal
  */
  constructor(e, t, r, s) {
    this.name = e, this.rank = t, this.schema = r, this.spec = s, this.attrs = Wa(s.attrs), this.excluded = null;
    let i = _a(this.attrs);
    this.instance = i ? new L(this, i) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new L(this, ja(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), s = 0;
    return e.forEach((i, o) => r[i] = new Cs(i, s++, t, o)), r;
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
class wu {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let s in e)
      t[s] = e[s];
    t.nodes = q.from(e.nodes), t.marks = q.from(e.marks || {}), this.nodes = _o.compile(this.spec.nodes, this), this.marks = Cs.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in this.nodes) {
      if (s in this.marks)
        throw new RangeError(s + " can not be both a node and a mark");
      let i = this.nodes[s], o = i.spec.content || "", l = i.spec.marks;
      if (i.contentMatch = r[o] || (r[o] = Pt.parse(o, this.nodes)), i.inlineContent = i.contentMatch.inlineContent, i.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!i.isInline || !i.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = i;
      }
      i.markSet = l == "_" ? null : l ? jo(this, l.split(" ")) : l == "" || !i.inlineContent ? [] : null;
    }
    for (let s in this.marks) {
      let i = this.marks[s], o = i.spec.excludes;
      i.excluded = o == null ? [i] : o == "" ? [] : jo(this, o.split(" "));
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
    else if (e instanceof _o) {
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
    return new Ir(r, r.defaultAttrs, e, L.setFrom(t));
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
    return Rt.fromJSON(this, e);
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
function jo(n, e) {
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
function ku(n) {
  return n.tag != null;
}
function xu(n) {
  return n.style != null;
}
class sn {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((s) => {
      if (ku(s))
        this.tags.push(s);
      else if (xu(s)) {
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
    let r = new Uo(this, t, !1);
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
    let r = new Uo(this, t, !0);
    return r.addAll(e, t.from, t.to), x.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let s = r ? this.tags.indexOf(r) + 1 : 0; s < this.tags.length; s++) {
      let i = this.tags[s];
      if (Mu(e, i.tag) && (i.namespace === void 0 || e.namespaceURI == i.namespace) && (!i.context || t.matchesContext(i.context))) {
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
        r(o = Ko(o)), o.mark || o.ignore || o.clearMark || (o.mark = s);
      });
    }
    for (let s in e.nodes) {
      let i = e.nodes[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Ko(o)), o.node || o.ignore || o.mark || (o.node = s);
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
    return e.cached.domParser || (e.cached.domParser = new sn(e, sn.schemaRules(e)));
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
}, Su = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Ja = { ol: !0, ul: !0 }, Lr = 1, Pr = 2, vn = 4;
function Wo(n, e, t) {
  return e != null ? (e ? Lr : 0) | (e === "full" ? Pr : 0) : n && n.whitespace == "pre" ? Lr | Pr : t & ~vn;
}
class lr {
  constructor(e, t, r, s, i, o, l) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = s, this.solid = i, this.options = l, this.content = [], this.activeMarks = L.none, this.stashMarks = [], this.match = o || (l & vn ? null : e.contentMatch);
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
    if (!(this.options & Lr)) {
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
      (this.type ? this.type.allowsMarkType(s.type) : vu(s.type, e)) && !s.isInSet(this.activeMarks) && (this.activeMarks = s.addToSet(this.activeMarks), this.pendingMarks = s.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Ka.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Uo {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let s = t.topNode, i, o = Wo(null, t.preserveWhitespace, 0) | (r ? vn : 0);
    s ? i = new lr(s.type, s.attrs, L.none, L.none, !0, t.topMatch || s.type.contentMatch, o) : r ? i = new lr(null, null, L.none, L.none, !0, null, o) : i = new lr(e.schema.topNodeType, null, L.none, L.none, !0, null, o), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
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
    if (r.options & Pr || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & Lr)
        r.options & Pr ? t = t.replace(/\r\n?/g, `
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
    Ja.hasOwnProperty(r) && this.parser.normalizeLists && Cu(e);
    let i = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, t));
    if (i ? i.ignore : Su.hasOwnProperty(r))
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
    let o = Wo(e, s, i.options);
    i.options & vn && i.content.length == 0 && (o |= vn), this.nodes.push(new lr(e, t, i.activeMarks, i.pendingMarks, r, null, o)), this.open++;
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
    let t = Tu(e, this.top.pendingMarks);
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
function Cu(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ja.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Mu(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Ko(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function vu(n, e) {
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
function Tu(n, e) {
  for (let t = 0; t < e.length; t++)
    if (n.eq(e[t]))
      return e[t];
}
class ze {
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
    r || (r = Us(t).createDocumentFragment());
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
    let { dom: r, contentDOM: s } = ze.renderSpec(Us(t), this.nodes[e.type.name](e));
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
    return s && ze.renderSpec(Us(r), s(e, t));
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
        let { dom: h, contentDOM: f } = ze.renderSpec(e, u, r);
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
    return e.cached.domSerializer || (e.cached.domSerializer = new ze(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Jo(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Jo(e.marks);
  }
}
function Jo(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Us(n) {
  return n.document || window.document;
}
const qa = 65535, Ga = Math.pow(2, 16);
function Au(n, e) {
  return n + e * Ga;
}
function qo(n) {
  return n & qa;
}
function Eu(n) {
  return (n - (n & qa)) / Ga;
}
const Ya = 1, Xa = 2, kr = 4, Qa = 8;
class Mi {
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
class he {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && he.empty)
      return he.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = qo(e);
    if (!this.inverted)
      for (let s = 0; s < r; s++)
        t += this.ranges[s * 3 + 2] - this.ranges[s * 3 + 1];
    return this.ranges[r * 3] + t + Eu(e);
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
        let p = e == (t < 0 ? a : u) ? null : Au(l / 3, e - a), m = e == a ? Xa : e == u ? Ya : kr;
        return (t < 0 ? e != a : e != u) && (m |= Qa), new Mi(f, m, p);
      }
      s += d - c;
    }
    return r ? e + s : new Mi(e + s, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, s = qo(t), i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
    return new he(this.ranges, !this.inverted);
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
    return e == 0 ? he.empty : new he(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
he.empty = new he([]);
class Qt {
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
    return new Qt(this.maps, this.mirror, e, t);
  }
  /**
  @internal
  */
  copy() {
    return new Qt(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
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
    let e = new Qt();
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
    return r ? e : new Mi(e, s, null);
  }
}
const Ks = /* @__PURE__ */ Object.create(null);
class te {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return he.empty;
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
    let r = Ks[t.stepType];
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
    if (e in Ks)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Ks[e] = t, t.prototype.jsonID = e, t;
  }
}
class _ {
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
    return new _(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new _(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, s) {
    try {
      return _.ok(e.replace(t, r, s));
    } catch (i) {
      if (i instanceof Nr)
        return _.fail(i.message);
      throw i;
    }
  }
}
function no(n, e, t) {
  let r = [];
  for (let s = 0; s < n.childCount; s++) {
    let i = n.child(s);
    i.content.size && (i = i.copy(no(i.content, e, i))), i.isInline && (i = e(i, t, s)), r.push(i);
  }
  return b.fromArray(r);
}
class at extends te {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), s = r.node(r.sharedDepth(this.to)), i = new x(no(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), s), t.openStart, t.openEnd);
    return _.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new He(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new at(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof at && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new at(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new at(t.from, t.to, e.markFromJSON(t.mark));
  }
}
te.jsonID("addMark", at);
class He extends te {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new x(no(t.content, (s) => s.mark(this.mark.removeFromSet(s.marks)), e), t.openStart, t.openEnd);
    return _.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new at(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new He(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof He && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new He(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new He(t.from, t.to, e.markFromJSON(t.mark));
  }
}
te.jsonID("removeMark", He);
class ct extends te {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return _.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return _.fromReplace(e, this.pos, this.pos + 1, new x(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let s = 0; s < t.marks.length; s++)
          if (!t.marks[s].isInSet(r))
            return new ct(this.pos, t.marks[s]);
        return new ct(this.pos, this.mark);
      }
    }
    return new on(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new ct(t.pos, this.mark);
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
    return new ct(t.pos, e.markFromJSON(t.mark));
  }
}
te.jsonID("addNodeMark", ct);
class on extends te {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return _.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return _.fromReplace(e, this.pos, this.pos + 1, new x(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new ct(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new on(t.pos, this.mark);
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
    return new on(t.pos, e.markFromJSON(t.mark));
  }
}
te.jsonID("removeNodeMark", on);
class j extends te {
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
    return this.structure && vi(e, this.from, this.to) ? _.fail("Structure replace would overwrite content") : _.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new he([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new j(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new j(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof j) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? x.empty : new x(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new j(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? x.empty : new x(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new j(e.from, this.to, t, this.structure);
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
    return new j(t.from, t.to, x.fromJSON(e, t.slice), !!t.structure);
  }
}
te.jsonID("replace", j);
class W extends te {
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
    if (this.structure && (vi(e, this.from, this.gapFrom) || vi(e, this.gapTo, this.to)))
      return _.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return _.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? _.fromReplace(e, this.from, this.to, r) : _.fail("Content does not fit in gap");
  }
  getMap() {
    return new he([
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
    return new W(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), s = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), i = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || s < t.pos || i > r.pos ? null : new W(t.pos, r.pos, s, i, this.slice, this.insert, this.structure);
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
    return new W(t.from, t.to, t.gapFrom, t.gapTo, x.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
te.jsonID("replaceAround", W);
function vi(n, e, t) {
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
function Ou(n, e, t, r) {
  let s = [], i = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, d) => {
    if (!a.isInline)
      return;
    let u = a.marks;
    if (!r.isInSet(u) && d.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), f = Math.min(c + a.nodeSize, t), p = r.addToSet(u);
      for (let m = 0; m < u.length; m++)
        u[m].isInSet(p) || (o && o.to == h && o.mark.eq(u[m]) ? o.to = f : s.push(o = new He(h, f, u[m])));
      l && l.to == h ? l.to = f : i.push(l = new at(h, f, r));
    }
  }), s.forEach((a) => n.step(a)), i.forEach((a) => n.step(a));
}
function Nu(n, e, t, r) {
  let s = [], i = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    i++;
    let a = null;
    if (r instanceof Cs) {
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
  }), s.forEach((o) => n.step(new He(o.from, o.to, o.style)));
}
function Za(n, e, t, r = t.contentMatch, s = !0) {
  let i = n.doc.nodeAt(e), o = [], l = e + 1;
  for (let a = 0; a < i.childCount; a++) {
    let c = i.child(a), d = l + c.nodeSize, u = r.matchType(c.type);
    if (!u)
      o.push(new j(l, d, x.empty));
    else {
      r = u;
      for (let h = 0; h < c.marks.length; h++)
        t.allowsMarkType(c.marks[h].type) || n.step(new He(l, d, c.marks[h]));
      if (s && c.isText && t.whitespace != "pre") {
        let h, f = /\r?\n|\r/g, p;
        for (; h = f.exec(c.text); )
          p || (p = new x(b.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new j(l + h.index, l + h.index + h[0].length, p));
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
function Ru(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function mn(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let s = n.$from.node(r), i = n.$from.index(r), o = n.$to.indexAfter(r);
    if (r < n.depth && s.canReplace(i, o, t))
      return r;
    if (r == 0 || s.type.spec.isolating || !Ru(s, i, o))
      break;
  }
  return null;
}
function Du(n, e, t) {
  let { $from: r, $to: s, depth: i } = e, o = r.before(i + 1), l = s.after(i + 1), a = o, c = l, d = b.empty, u = 0;
  for (let p = i, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, d = b.from(r.node(p).copy(d)), u++) : a--;
  let h = b.empty, f = 0;
  for (let p = i, m = !1; p > t; p--)
    m || s.after(p + 1) < s.end(p) ? (m = !0, h = b.from(s.node(p).copy(h)), f++) : c++;
  n.step(new W(a, c, o, l, new x(d.append(h), u, f), d.size - u, !0));
}
function ro(n, e, t = null, r = n) {
  let s = Iu(n, e), i = s && Lu(r, e);
  return i ? s.map(Go).concat({ type: e, attrs: t }).concat(i.map(Go)) : null;
}
function Go(n) {
  return { type: n, attrs: null };
}
function Iu(n, e) {
  let { parent: t, startIndex: r, endIndex: s } = n, i = t.contentMatchAt(r).findWrapping(e);
  if (!i)
    return null;
  let o = i.length ? i[0] : e;
  return t.canReplaceWith(r, s, o) ? i : null;
}
function Lu(n, e) {
  let { parent: t, startIndex: r, endIndex: s } = n, i = t.child(r), o = e.contentMatch.findWrapping(i.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < s; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function Pu(n, e, t) {
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
  n.step(new W(s, i, s, i, new x(r, 0, 0), t.length, !0));
}
function $u(n, e, t, r, s) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let i = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, s) && Hu(n.doc, n.mapping.slice(i).map(l), r)) {
      let a = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", f = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !f ? a = !1 : !h && f && (a = !0);
      }
      a === !1 && zu(n, o, l, i), Za(n, n.mapping.slice(i).map(l, 1), r, void 0, a === null);
      let c = n.mapping.slice(i), d = c.map(l, 1), u = c.map(l + o.nodeSize, 1);
      return n.step(new W(d, u, d + 1, u - 1, new x(b.from(r.create(s, null, o.marks)), 0, 0), 1, !0)), a === !0 && Bu(n, o, l, i), !1;
    }
  });
}
function Bu(n, e, t, r) {
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
function zu(n, e, t, r) {
  e.forEach((s, i) => {
    if (s.type == s.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + i);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Hu(n, e, t) {
  let r = n.resolve(e), s = r.index();
  return r.parent.canReplaceWith(s, s + 1, t);
}
function Fu(n, e, t, r, s) {
  let i = n.doc.nodeAt(e);
  if (!i)
    throw new RangeError("No node at given position");
  t || (t = i.type);
  let o = t.create(r, null, s || i.marks);
  if (i.isLeaf)
    return n.replaceWith(e, e + i.nodeSize, o);
  if (!t.validContent(i.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new W(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new x(b.from(o), 0, 0), 1, !0));
}
function Zt(n, e, t = 1, r) {
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
function Vu(n, e, t = 1, r) {
  let s = n.doc.resolve(e), i = b.empty, o = b.empty;
  for (let l = s.depth, a = s.depth - t, c = t - 1; l > a; l--, c--) {
    i = b.from(s.node(l).copy(i));
    let d = r && r[c];
    o = b.from(d ? d.type.create(d.attrs, o) : s.node(l).copy(o));
  }
  n.step(new j(e, e, new x(i.append(o), t, t), !0));
}
function bt(n, e) {
  let t = n.resolve(e), r = t.index();
  return ec(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function ec(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function Ms(n, e, t = -1) {
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
function _u(n, e, t) {
  let r = new j(e - t, e + t, x.empty, !0);
  n.step(r);
}
function ju(n, e, t) {
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
function vs(n, e, t = e, r = x.empty) {
  if (e == t && !r.size)
    return null;
  let s = n.resolve(e), i = n.resolve(t);
  return nc(s, i, r) ? new j(e, t, r) : new Wu(s, i, r).fit();
}
function nc(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Wu {
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
    return e > -1 ? new W(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new j(r.pos, s.pos, a) : null;
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
        r ? (i = Js(this.unplaced.content, r - 1).firstChild, s = i.content) : s = this.unplaced.content;
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
    let { content: e, openStart: t, openEnd: r } = this.unplaced, s = Js(e, t);
    return !s.childCount || s.firstChild.isLeaf ? !1 : (this.unplaced = new x(e, t + 1, Math.max(r, s.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, s = Js(e, t);
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
    if (!e.type.isTextblock || !qs(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, s = this.$to.after(r);
    for (; r > 1 && s == this.$to.end(--r); )
      ++s;
    return s;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: s } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = qs(e, t, s, r, i);
      if (o) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], d = qs(e, l, c, a, !0);
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
function Js(n, e) {
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
function qs(n, e, t, r, s) {
  let i = n.node(e), o = s ? n.indexAfter(e) : n.index(e);
  if (o == i.childCount && !t.compatibleContent(i.type))
    return null;
  let l = r.fillBefore(i.content, !0, o);
  return l && !Uu(t, i.content, o) ? l : null;
}
function Uu(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Ku(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Ju(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let s = n.doc.resolve(e), i = n.doc.resolve(t);
  if (nc(s, i, r))
    return n.step(new j(e, t, r));
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
    let f = c[h], p = Ku(f.type);
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
        let w = s.node(g - 1), C = s.index(g - 1);
        if (w.canReplaceWith(C, C, p.type, p.marks))
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
function qu(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let s = ju(n.doc, e, r.type);
    s != null && (e = t = s);
  }
  n.replaceRange(e, t, new x(b.from(r), 0, 0));
}
function Gu(n, e, t) {
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
class en extends te {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return _.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in t.attrs)
      r[i] = t.attrs[i];
    r[this.attr] = this.value;
    let s = t.type.create(r, null, t.marks);
    return _.fromReplace(e, this.pos, this.pos + 1, new x(b.from(s), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return he.empty;
  }
  invert(e) {
    return new en(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new en(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new en(t.pos, t.attr, t.value);
  }
}
te.jsonID("attr", en);
class $n extends te {
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
    return _.ok(r);
  }
  getMap() {
    return he.empty;
  }
  invert(e) {
    return new $n(this.attr, e.attrs[this.attr]);
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
    return new $n(t.attr, t.value);
  }
}
te.jsonID("docAttr", $n);
let ln = class extends Error {
};
ln = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
ln.prototype = Object.create(Error.prototype);
ln.prototype.constructor = ln;
ln.prototype.name = "TransformError";
class so {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Qt();
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
      throw new ln(t.failed);
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
    let s = vs(this.doc, e, t, r);
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
    return Ju(this, e, t, r), this;
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
    return qu(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Gu(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Du(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return _u(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return Pu(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, s = null) {
    return $u(this, e, t, r, s), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, s) {
    return Fu(this, e, t, r, s), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new en(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new $n(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new ct(e, t)), this;
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
    return this.step(new on(e, t)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, t = 1, r) {
    return Vu(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Ou(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return Nu(this, e, t, r), this;
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
const Gs = /* @__PURE__ */ Object.create(null);
class A {
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
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? x.empty : t), l == 0 && Qo(e, i, (r ? r.isInline : s && s.isTextblock) ? -1 : 1);
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
      i ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), Qo(e, r, t.isInline ? -1 : 1));
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
    let s = e.parent.inlineContent ? new T(e) : Kt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (s)
      return s;
    for (let i = e.depth - 1; i >= 0; i--) {
      let o = t < 0 ? Kt(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, r) : Kt(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new ve(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Kt(e, e, 0, 0, 1) || new ve(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Kt(e, e, e.content.size, e.childCount, -1) || new ve(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Gs[t.type];
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
    if (e in Gs)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Gs[e] = t, t.prototype.jsonID = e, t;
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
    return T.between(this.$anchor, this.$head).getBookmark();
  }
}
A.prototype.visible = !0;
class oc {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Yo = !1;
function Xo(n) {
  !Yo && !n.parent.inlineContent && (Yo = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class T extends A {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Xo(e), Xo(t), super(e, t);
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
      return A.near(r);
    let s = e.resolve(t.map(this.anchor));
    return new T(s.parent.inlineContent ? s : r, r);
  }
  replace(e, t = x.empty) {
    if (super.replace(e, t), t == x.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof T && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Ts(this.anchor, this.head);
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
    return new T(e.resolve(t.anchor), e.resolve(t.head));
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
      let i = A.findFrom(t, r, !0) || A.findFrom(t, -r, !0);
      if (i)
        t = i.$head;
      else
        return A.near(t, r);
    }
    return e.parent.inlineContent || (s == 0 ? e = t : (e = (A.findFrom(e, -r, !0) || A.findFrom(e, r, !0)).$anchor, e.pos < t.pos != s < 0 && (e = t))), new T(e, t);
  }
}
A.jsonID("text", T);
class Ts {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Ts(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return T.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class v extends A {
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
    return r ? A.near(i) : new v(i);
  }
  content() {
    return new x(b.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof v && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new io(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new v(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new v(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
v.prototype.visible = !1;
A.jsonID("node", v);
class io {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Ts(r, r) : new io(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && v.isSelectable(r) ? new v(t) : A.near(t);
  }
}
class ve extends A {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = x.empty) {
    if (t == x.empty) {
      e.delete(0, e.doc.content.size);
      let r = A.atStart(e.doc);
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
    return new ve(e);
  }
  map(e) {
    return new ve(e);
  }
  eq(e) {
    return e instanceof ve;
  }
  getBookmark() {
    return Yu;
  }
}
A.jsonID("all", ve);
const Yu = {
  map() {
    return this;
  },
  resolve(n) {
    return new ve(n);
  }
};
function Kt(n, e, t, r, s, i = !1) {
  if (e.inlineContent)
    return T.create(n, t);
  for (let o = r - (s > 0 ? 0 : 1); s > 0 ? o < e.childCount : o >= 0; o += s) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!i && v.isSelectable(l))
        return v.create(n, t - (s < 0 ? l.nodeSize : 0));
    } else {
      let a = Kt(n, l, t + s, s < 0 ? l.childCount : 0, s, i);
      if (a)
        return a;
    }
    t += l.nodeSize * s;
  }
  return null;
}
function Qo(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let s = n.steps[r];
  if (!(s instanceof j || s instanceof W))
    return;
  let i = n.mapping.maps[r], o;
  i.forEach((l, a, c, d) => {
    o == null && (o = d);
  }), n.setSelection(A.near(n.doc.resolve(o), t));
}
const Zo = 1, ar = 2, el = 4;
class Xu extends so {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Zo) & ~ar, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Zo) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= ar, this;
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
    return (this.updated & ar) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~ar, this.storedMarks = null;
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
      return this.replaceRangeWith(t, r, s.text(e, i)), this.selection.empty || this.setSelection(A.near(this.selection.$to)), this;
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
    return this.updated |= el, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & el) > 0;
  }
}
function tl(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Cn {
  constructor(e, t, r) {
    this.name = e, this.init = tl(t.init, r), this.apply = tl(t.apply, r);
  }
}
const Qu = [
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
      return n.selection || A.atStart(e.doc);
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
class Ys {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Qu.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Cn(r.key, r.spec.state, r));
    });
  }
}
class Yt {
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
    let t = new Yt(this.config), r = this.config.fields;
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
    return new Xu(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new Ys(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Yt(t);
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
    let t = new Ys(this.schema, e.plugins), r = t.fields, s = new Yt(t);
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
    let s = new Ys(e.schema, e.plugins), i = new Yt(s);
    return s.fields.forEach((o) => {
      if (o.name == "doc")
        i.doc = Rt.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        i.selection = A.fromJSON(i.doc, t.selection);
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
const Xs = /* @__PURE__ */ Object.create(null);
function ac(n) {
  return n in Xs ? n + "$" + ++Xs[n] : (Xs[n] = 0, n + "$");
}
class ue {
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
}, Bn = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Ti = null;
const qe = function(n, e, t) {
  let r = Ti || (Ti = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, Zu = function() {
  Ti = null;
}, $t = function(n, e, t, r) {
  return t && (nl(n, e, t, r, -1) || nl(n, e, t, r, 1));
}, eh = /^(img|br|input|textarea|hr)$/i;
function nl(n, e, t, r, s) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (s < 0 ? 0 : Be(n))) {
      let i = n.parentNode;
      if (!i || i.nodeType != 1 || Xn(n) || eh.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = G(n) + (s < 0 ? 0 : 1), n = i;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (s < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = s < 0 ? Be(n) : 0;
    } else
      return !1;
  }
}
function Be(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function th(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = Be(n);
    } else if (n.parentNode && !Xn(n))
      e = G(n), n = n.parentNode;
    else
      return null;
  }
}
function nh(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !Xn(n))
      e = G(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function rh(n, e, t) {
  for (let r = e == 0, s = e == Be(n); r || s; ) {
    if (n == t)
      return !0;
    let i = G(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && i == 0, s = s && i == Be(n);
  }
}
function Xn(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const As = function(n) {
  return n.focusNode && $t(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function St(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function sh(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function ih(n, e, t) {
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
const Fe = typeof navigator < "u" ? navigator : null, rl = typeof document < "u" ? document : null, wt = Fe && Fe.userAgent || "", Ai = /Edge\/(\d+)/.exec(wt), cc = /MSIE \d/.exec(wt), Ei = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(wt), de = !!(cc || Ei || Ai), ut = cc ? document.documentMode : Ei ? +Ei[1] : Ai ? +Ai[1] : 0, Te = !de && /gecko\/(\d+)/i.test(wt);
Te && +(/Firefox\/(\d+)/.exec(wt) || [0, 0])[1];
const Oi = !de && /Chrome\/(\d+)/.exec(wt), re = !!Oi, oh = Oi ? +Oi[1] : 0, se = !de && !!Fe && /Apple Computer/.test(Fe.vendor), an = se && (/Mobile\/\w+/.test(wt) || !!Fe && Fe.maxTouchPoints > 2), be = an || (Fe ? /Mac/.test(Fe.platform) : !1), lh = Fe ? /Win/.test(Fe.platform) : !1, Ce = /Android \d/.test(wt), Qn = !!rl && "webkitFontSmoothing" in rl.documentElement.style, ah = Qn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function ch(n) {
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
function Ue(n, e) {
  return typeof n == "number" ? n : n[e];
}
function dh(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function sl(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, s = n.someProp("scrollMargin") || 5, i = n.dom.ownerDocument;
  for (let o = t || n.dom; o; o = Bn(o)) {
    if (o.nodeType != 1)
      continue;
    let l = o, a = l == i.body, c = a ? ch(i) : dh(l), d = 0, u = 0;
    if (e.top < c.top + Ue(r, "top") ? u = -(c.top - e.top + Ue(s, "top")) : e.bottom > c.bottom - Ue(r, "bottom") && (u = e.bottom - e.top > c.bottom - c.top ? e.top + Ue(s, "top") - c.top : e.bottom - c.bottom + Ue(s, "bottom")), e.left < c.left + Ue(r, "left") ? d = -(c.left - e.left + Ue(s, "left")) : e.right > c.right - Ue(r, "right") && (d = e.right - c.right + Ue(s, "right")), d || u)
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
function uh(n) {
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
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Bn(r))
    ;
  return e;
}
function hh({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  uc(t, r == 0 ? 0 : r - e);
}
function uc(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: s, left: i } = n[t];
    r.scrollTop != s + e && (r.scrollTop = s + e), r.scrollLeft != i && (r.scrollLeft = i);
  }
}
let jt = null;
function fh(n) {
  if (n.setActive)
    return n.setActive();
  if (jt)
    return n.focus(jt);
  let e = dc(n);
  n.focus(jt == null ? {
    get preventScroll() {
      return jt = { preventScroll: !0 }, !0;
    }
  } : void 0), jt || (jt = !1, uc(e, 0));
}
function hc(n, e) {
  let t, r = 2e8, s, i = 0, o = e.top, l = e.top, a, c;
  for (let d = n.firstChild, u = 0; d; d = d.nextSibling, u++) {
    let h;
    if (d.nodeType == 1)
      h = d.getClientRects();
    else if (d.nodeType == 3)
      h = qe(d).getClientRects();
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
  return !t && a && (t = a, s = c, r = 0), t && t.nodeType == 3 ? ph(t, s) : !t || r && t.nodeType == 1 ? { node: n, offset: i } : hc(t, s);
}
function ph(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let i = Ze(r, 1);
    if (i.top != i.bottom && oo(e, i))
      return { node: n, offset: s + (e.left >= (i.left + i.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function oo(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function mh(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function gh(n, e, t) {
  let { node: r, offset: s } = hc(e, t), i = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    i = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, s, i);
}
function yh(n, e, t, r) {
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
          if (oo(e, c))
            return fc(o, e, c);
        }
      }
      if ((i = (i + 1) % r) == s)
        break;
    }
  return n;
}
function bh(n, e) {
  let t = n.dom.ownerDocument, r, s = 0, i = ih(t, e.left, e.top);
  i && ({ node: r, offset: s } = i);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!oo(e, c) || (o = fc(n.dom, e, c), !o))
      return null;
  }
  if (se)
    for (let c = o; r && c; c = Bn(c))
      c.draggable && (r = void 0);
  if (o = mh(o, e), r) {
    if (Te && r.nodeType == 1 && (s = Math.min(s, r.childNodes.length), s < r.childNodes.length)) {
      let d = r.childNodes[s], u;
      d.nodeName == "IMG" && (u = d.getBoundingClientRect()).right <= e.left && u.bottom > e.top && s++;
    }
    let c;
    Qn && s && r.nodeType == 1 && (c = r.childNodes[s - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && s--, r == n.dom && s == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (s == 0 || r.nodeType != 1 || r.childNodes[s - 1].nodeName != "BR") && (l = yh(n, r, s, e));
  }
  l == null && (l = gh(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function il(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Ze(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (il(r))
      return r;
  }
  return Array.prototype.find.call(t, il) || n.getBoundingClientRect();
}
const wh = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function pc(n, e, t) {
  let { node: r, offset: s, atom: i } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = Qn || Te;
  if (r.nodeType == 3)
    if (o && (wh.test(r.nodeValue) || (t < 0 ? !s : s == r.nodeValue.length))) {
      let a = Ze(qe(r, s, s), t);
      if (Te && s && /\s/.test(r.nodeValue[s - 1]) && s < r.nodeValue.length) {
        let c = Ze(qe(r, s - 1, s - 1), -1);
        if (c.top == a.top) {
          let d = Ze(qe(r, s, s + 1), -1);
          if (d.top != a.top)
            return wn(d, d.left < c.left);
        }
      }
      return a;
    } else {
      let a = s, c = s, d = t < 0 ? 1 : -1;
      return t < 0 && !s ? (c++, d = -1) : t >= 0 && s == r.nodeValue.length ? (a--, d = 1) : t < 0 ? a-- : c++, wn(Ze(qe(r, a, c), d), d < 0);
    }
  if (!n.state.doc.resolve(e - (i || 0)).parent.inlineContent) {
    if (i == null && s && (t < 0 || s == Be(r))) {
      let a = r.childNodes[s - 1];
      if (a.nodeType == 1)
        return Qs(a.getBoundingClientRect(), !1);
    }
    if (i == null && s < Be(r)) {
      let a = r.childNodes[s];
      if (a.nodeType == 1)
        return Qs(a.getBoundingClientRect(), !0);
    }
    return Qs(r.getBoundingClientRect(), t >= 0);
  }
  if (i == null && s && (t < 0 || s == Be(r))) {
    let a = r.childNodes[s - 1], c = a.nodeType == 3 ? qe(a, Be(a) - (o ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return wn(Ze(c, 1), !1);
  }
  if (i == null && s < Be(r)) {
    let a = r.childNodes[s];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? qe(a, 0, o ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return wn(Ze(c, -1), !0);
  }
  return wn(Ze(r.nodeType == 3 ? qe(r) : r, -t), t >= 0);
}
function wn(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Qs(n, e) {
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
function kh(n, e, t) {
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
        a = qe(l, 0, l.nodeValue.length).getClientRects();
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
const xh = /[\u0590-\u08ac]/;
function Sh(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let s = r.parentOffset, i = !s, o = s == r.parent.content.size, l = n.domSelection();
  return !xh.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? i : o : mc(n, e, () => {
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
let ol = null, ll = null, al = !1;
function Ch(n, e, t) {
  return ol == e && ll == t ? al : (ol = e, ll = t, al = t == "up" || t == "down" ? kh(n, e, t) : Sh(n, e, t));
}
const xe = 0, cl = 1, Mt = 2, Ve = 3;
class Zn {
  constructor(e, t, r, s) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = s, this.dirty = xe, r.pmViewDesc = this;
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
    if ((Te || se) && e == t) {
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
    if (Te && c.focusNode && c.focusNode != a.node && c.focusNode.nodeType == 1) {
      let h = c.focusNode.childNodes[c.focusOffset];
      h && h.contentEditable == "false" && (s = !0);
    }
    if (!(s || d && se) && $t(l.node, l.offset, c.anchorNode, c.anchorOffset) && $t(a.node, a.offset, c.focusNode, c.focusOffset))
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
          this.dirty = e == r || t == o ? Mt : cl, e == l && t == a && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Ve : i.markDirty(e - l, t - l);
          return;
        } else
          i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Mt : Ve;
      }
      r = o;
    }
    this.dirty = Mt;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? Mt : cl;
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
class gc extends Zn {
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
    return this.dirty == xe && e.type.eq(this.widget.type);
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
class Mh extends Zn {
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
class Bt extends Zn {
  constructor(e, t, r, s) {
    super(e, [], r, s), this.mark = t;
  }
  static create(e, t, r, s) {
    let i = s.nodeViews[t.type.name], o = i && i(t, s, r);
    return (!o || !o.dom) && (o = ze.renderSpec(document, t.type.spec.toDOM(t, r))), new Bt(e, t, o.dom, o.contentDOM || o.dom);
  }
  parseRule() {
    return this.dirty & Ve || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != Ve && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != xe) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = xe;
    }
  }
  slice(e, t, r) {
    let s = Bt.create(this.parent, this.mark, !0, r), i = this.children, o = this.size;
    t < o && (i = Di(i, t, o, r)), e > 0 && (i = Di(i, 0, e, r));
    for (let l = 0; l < i.length; l++)
      i[l].parent = s;
    return s.children = i, s;
  }
}
class ht extends Zn {
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
    } else d || ({ dom: d, contentDOM: u } = ze.renderSpec(document, t.type.spec.toDOM(t)));
    !u && !t.isText && d.nodeName != "BR" && (d.hasAttribute("contenteditable") || (d.contentEditable = "false"), t.type.spec.draggable && (d.draggable = !0));
    let h = d;
    return d = kc(d, r, t), c ? a = new vh(e, t, r, s, d, u || null, h, c, i, o + 1) : t.isText ? new Es(e, t, r, s, d, h, i) : new ht(e, t, r, s, d, u || null, h, i, o + 1);
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
    return this.dirty == xe && e.eq(this.node) && Ri(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, s = t, i = e.composing ? this.localCompositionInfo(e, t) : null, o = i && i.pos > -1 ? i : null, l = i && i.pos < 0, a = new Ah(this, o && o.node, e);
    Nh(this.node, this.innerDeco, (c, d, u) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e) : c.type.side >= 0 && !u && a.syncToMarks(d == this.node.childCount ? L.none : this.node.child(d).marks, r, e), a.placeWidget(c, e, s);
    }, (c, d, u, h) => {
      a.syncToMarks(c.marks, r, e);
      let f;
      a.findNodeMatch(c, d, u, h) || l && e.state.selection.from > s && e.state.selection.to < s + c.nodeSize && (f = a.findIndexWithChild(i.node)) > -1 && a.updateNodeAt(c, d, u, f, e) || a.updateNextNode(c, d, u, e, h, s) || a.addNode(c, d, u, e, s), s += c.nodeSize;
    }), a.syncToMarks([], r, e), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == Mt) && (o && this.protectLocalComposition(e, o), bc(this.contentDOM, this.children, e), an && Rh(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: s } = e.state.selection;
    if (!(e.state.selection instanceof T) || r < t || s > t + this.node.content.size)
      return null;
    let i = e.input.compositionNode;
    if (!i || !this.dom.contains(i.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = i.nodeValue, l = Dh(this.node.content, o, r - t, s - t);
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
    let o = new Mh(this, i, t, s);
    e.input.compositionNodes.push(o), this.children = Di(this.children, r, r + s.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, s) {
    return this.dirty == Ve || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, s), !0);
  }
  updateInner(e, t, r, s) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(s, this.posAtStart), this.dirty = xe;
  }
  updateOuterDeco(e) {
    if (Ri(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = wc(this.dom, this.nodeDOM, Ni(this.outerDeco, this.node, t), Ni(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function dl(n, e, t, r, s) {
  kc(r, e, n);
  let i = new ht(void 0, n, e, t, r, r, r, s, 0);
  return i.contentDOM && i.updateChildren(s, 0), i;
}
class Es extends ht {
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
    return this.dirty == Ve || this.dirty != xe && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != xe || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, s.trackWrites == this.nodeDOM && (s.trackWrites = null)), this.node = e, this.dirty = xe, !0);
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
    return new Es(this.parent, s, this.outerDeco, this.innerDeco, i, i, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Ve);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class yc extends Zn {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == xe && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class vh extends ht {
  constructor(e, t, r, s, i, o, l, a, c, d) {
    super(e, t, r, s, i, o, l, c, d), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, s) {
    if (this.dirty == Ve)
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
        r = ul(r), s = !0;
      r = r.nextSibling;
    } else
      s = !0, n.insertBefore(l, r);
    if (o instanceof Bt) {
      let a = r ? r.previousSibling : n.lastChild;
      bc(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = ul(r), s = !0;
  s && t.trackWrites == n && (t.trackWrites = null);
}
const Tn = function(n) {
  n && (this.nodeName = n);
};
Tn.prototype = /* @__PURE__ */ Object.create(null);
const vt = [new Tn()];
function Ni(n, e, t) {
  if (n.length == 0)
    return vt;
  let r = t ? vt[0] : new Tn(), s = [r];
  for (let i = 0; i < n.length; i++) {
    let o = n[i].type.attrs;
    if (o) {
      o.nodeName && s.push(r = new Tn(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && s.length == 1 && s.push(r = new Tn(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return s;
}
function wc(n, e, t, r) {
  if (t == vt && r == vt)
    return e;
  let s = e;
  for (let i = 0; i < r.length; i++) {
    let o = r[i], l = t[i];
    if (i) {
      let a;
      l && l.nodeName == o.nodeName && s != n && (a = s.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(s), l = vt[0]), s = a;
    }
    Th(s, l || vt[0], o);
  }
  return s;
}
function Th(n, e, t) {
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
function kc(n, e, t) {
  return wc(n, n, vt, Ni(e, t, n.nodeType != 1));
}
function Ri(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function ul(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Ah {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Eh(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = xe, this.index = this.stack.pop(), this.top = this.stack.pop(), i--;
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
        let a = Bt.create(this.top, e[i], t, r);
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
    return o.dirty == Ve && o.dom == o.contentDOM && (o.dirty = Mt), o.update(e, t, r, i) ? (this.destroyBetween(this.index, s), this.index++, !0) : !1;
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
      if (a instanceof ht) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != i)
          return !1;
        let d = a.dom, u, h = this.isLocked(d) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != Ve && Ri(t, a.outerDeco));
        if (!h && a.update(e, t, r, s))
          return this.destroyBetween(this.index, l), a.dom != d && (this.changed = !0), this.index++, !0;
        if (!h && (u = this.recreateWrapper(a, e, t, r, s, o)))
          return this.top.children[this.index] = u, u.contentDOM && (u.dirty = Mt, u.updateChildren(s, o + 1), u.dirty = xe), this.changed = !0, this.index++, !0;
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
    let l = ht.create(this.top, t, r, s, i, o);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, s, i) {
    let o = ht.create(this.top, e, t, r, s, i);
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
    for (; e instanceof Bt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Es) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((se || re) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
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
function Eh(n, e) {
  let t = e, r = t.children.length, s = n.childCount, i = /* @__PURE__ */ new Map(), o = [];
  e: for (; s > 0; ) {
    let l;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof Bt)
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
function Oh(n, e) {
  return n.type.side - e.type.side;
}
function Nh(n, e, t, r) {
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
        u.sort(Oh);
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
function Rh(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Dh(n, e, t, r) {
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
function Di(n, e, t, r, s) {
  let i = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, d = l += a.size;
    c >= t || d <= e ? i.push(a) : (c < e && i.push(a.slice(0, e - c, r)), s && (i.push(s), s = void 0), d > t && i.push(a.slice(t - c, a.size, r)));
  }
  return i;
}
function lo(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let s = n.docView.nearestDesc(t.focusNode), i = s && s.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (As(t)) {
    for (a = l; s && !s.node; )
      s = s.parent;
    let d = s.node;
    if (s && d.isAtom && v.isSelectable(d) && s.parent && !(d.isInline && rh(t.focusNode, t.focusOffset, s.dom))) {
      let u = s.posBefore;
      c = new v(o == u ? l : r.resolve(u));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0)
      return null;
    a = r.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < l.pos && !i ? 1 : -1;
    c = ao(n, a, l, d);
  }
  return c;
}
function xc(n) {
  return n.editable ? n.hasFocus() : Cc(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Ge(n, e = !1) {
  let t = n.state.selection;
  if (Sc(n, t), !!xc(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && re) {
      let r = n.domSelectionRange(), s = n.domObserver.currentSelection;
      if (r.anchorNode && s.anchorNode && $t(r.anchorNode, r.anchorOffset, s.anchorNode, s.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      Lh(n);
    else {
      let { anchor: r, head: s } = t, i, o;
      hl && !(t instanceof T) && (t.$from.parent.inlineContent || (i = fl(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = fl(n, t.to))), n.docView.setSelection(r, s, n.root, e), hl && (i && pl(i), o && pl(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ih(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const hl = se || re && oh < 63;
function fl(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), s = r < t.childNodes.length ? t.childNodes[r] : null, i = r ? t.childNodes[r - 1] : null;
  if (se && s && s.contentEditable == "false")
    return Zs(s);
  if ((!s || s.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (s)
      return Zs(s);
    if (i)
      return Zs(i);
  }
}
function Zs(n) {
  return n.contentEditable = "true", se && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function pl(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Ih(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, s = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != s) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!xc(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Lh(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, s = r.nodeName == "IMG";
  s ? t.setEnd(r.parentNode, G(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !s && !n.state.selection.visible && de && ut <= 11 && (r.disabled = !0, r.disabled = !1);
}
function Sc(n, e) {
  if (e instanceof v) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (ml(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    ml(n);
}
function ml(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function ao(n, e, t, r) {
  return n.someProp("createSelectionBetween", (s) => s(n, e, t)) || T.between(e, t, r);
}
function gl(n) {
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
function Ph(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return $t(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ii(n, e) {
  let { $anchor: t, $head: r } = n.selection, s = e > 0 ? t.max(r) : t.min(r), i = s.parent.inlineContent ? s.depth ? n.doc.resolve(e > 0 ? s.after() : s.before()) : null : s;
  return i && A.findFrom(i, e);
}
function et(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function yl(n, e, t) {
  let r = n.state.selection;
  if (r instanceof T)
    if (t.indexOf("s") > -1) {
      let { $head: s } = r, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter;
      if (!i || i.isText || !i.isLeaf)
        return !1;
      let o = n.state.doc.resolve(s.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return et(n, new T(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let s = Ii(n.state, e);
        return s && s instanceof v ? et(n, s) : !1;
      } else if (!(be && t.indexOf("m") > -1)) {
        let s = r.$head, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter, o;
        if (!i || i.isText)
          return !1;
        let l = e < 0 ? s.pos - i.nodeSize : s.pos;
        return i.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? v.isSelectable(i) ? et(n, new v(e < 0 ? n.state.doc.resolve(s.pos - i.nodeSize) : s)) : Qn ? et(n, new T(n.state.doc.resolve(e < 0 ? l : l + i.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof v && r.node.isInline)
      return et(n, new T(e > 0 ? r.$to : r.$from));
    {
      let s = Ii(n.state, e);
      return s ? et(n, s) : !1;
    }
  }
}
function $r(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function An(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Wt(n, e) {
  return e < 0 ? $h(n) : Bh(n);
}
function $h(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let s, i, o = !1;
  for (Te && t.nodeType == 1 && r < $r(t) && An(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (An(l, -1))
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
        for (; l && An(l, -1); )
          s = t.parentNode, i = G(l), l = l.previousSibling;
        if (l)
          t = l, r = $r(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Li(n, t, r) : s && Li(n, s, i);
}
function Bh(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let s = $r(t), i, o;
  for (; ; )
    if (r < s) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (An(l, 1))
        i = t, o = ++r;
      else
        break;
    } else {
      if (Mc(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && An(l, 1); )
          i = l.parentNode, o = G(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, s = $r(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = s = 0;
        }
      }
    }
  i && Li(n, i, o);
}
function Mc(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function zh(n, e) {
  for (; n && e == n.childNodes.length && !Xn(n); )
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
function Hh(n, e) {
  for (; n && !e && !Xn(n); )
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
function Li(n, e, t) {
  if (e.nodeType != 3) {
    let i, o;
    (o = zh(e, t)) ? (e = o, t = 0) : (i = Hh(e, t)) && (e = i, t = i.nodeValue.length);
  }
  let r = n.domSelection();
  if (As(r)) {
    let i = document.createRange();
    i.setEnd(e, t), i.setStart(e, t), r.removeAllRanges(), r.addRange(i);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: s } = n;
  setTimeout(() => {
    n.state == s && Ge(n);
  }, 50);
}
function bl(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(re || lh) && t.parent.inlineContent) {
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
function wl(n, e, t) {
  let r = n.state.selection;
  if (r instanceof T && !r.empty || t.indexOf("s") > -1 || be && t.indexOf("m") > -1)
    return !1;
  let { $from: s, $to: i } = r;
  if (!s.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Ii(n.state, e);
    if (o && o instanceof v)
      return et(n, o);
  }
  if (!s.parent.inlineContent) {
    let o = e < 0 ? s : i, l = r instanceof ve ? A.near(o, e) : A.findFrom(o, e);
    return l ? et(n, l) : !1;
  }
  return !1;
}
function kl(n, e) {
  if (!(n.state.selection instanceof T))
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
function xl(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function Fh(n) {
  if (!se || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    xl(n, r, "true"), setTimeout(() => xl(n, r, "false"), 20);
  }
  return !1;
}
function Vh(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function _h(n, e) {
  let t = e.keyCode, r = Vh(e);
  if (t == 8 || be && t == 72 && r == "c")
    return kl(n, -1) || Wt(n, -1);
  if (t == 46 && !e.shiftKey || be && t == 68 && r == "c")
    return kl(n, 1) || Wt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || be && t == 66 && r == "c") {
    let s = t == 37 ? bl(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return yl(n, s, r) || Wt(n, s);
  } else if (t == 39 || be && t == 70 && r == "c") {
    let s = t == 39 ? bl(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return yl(n, s, r) || Wt(n, s);
  } else {
    if (t == 38 || be && t == 80 && r == "c")
      return wl(n, -1, r) || Wt(n, -1);
    if (t == 40 || be && t == 78 && r == "c")
      return Fh(n) || wl(n, 1, r) || Wt(n, 1);
    if (r == (be ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function vc(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [], { content: r, openStart: s, openEnd: i } = e;
  for (; s > 1 && i > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    s--, i--;
    let f = r.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), r = f.content;
  }
  let o = n.someProp("clipboardSerializer") || ze.fromSchema(n.state.schema), l = Rc(), a = l.createElement("div");
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
function Tc(n, e, t, r, s) {
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
      let h = s.marks(), { schema: f } = n.state, p = ze.fromSchema(f);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(f.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (u) => {
      t = u(t, n);
    }), o = Uh(t), Qn && Kh(o);
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
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || sn.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || d),
    context: s,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !jh.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), d)
    l = Jh(Sl(l, +d[1], +d[2]), d[4]);
  else if (l = x.maxOpen(Wh(l.content, s), !0), l.openStart || l.openEnd) {
    let u = 0, h = 0;
    for (let f = l.content.firstChild; u < l.openStart && !f.type.spec.isolating; u++, f = f.firstChild)
      ;
    for (let f = l.content.lastChild; h < l.openEnd && !f.type.spec.isolating; h++, f = f.lastChild)
      ;
    l = Sl(l, u, h);
  }
  return n.someProp("transformPasted", (u) => {
    l = u(l, n);
  }), l;
}
const jh = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Wh(n, e) {
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
      if (c = o.length && i.length && Ec(a, i, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Oc(o[o.length - 1], i.length));
        let d = Ac(l, a);
        o.push(d), s = s.matchType(d.type), i = a;
      }
    }), o)
      return b.from(o);
  }
  return n;
}
function Ac(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, b.from(n));
  return n;
}
function Ec(n, e, t, r, s) {
  if (s < n.length && s < e.length && n[s] == e[s]) {
    let i = Ec(n, e, t, r.lastChild, s + 1);
    if (i)
      return r.copy(r.content.replaceChild(r.childCount - 1, i));
    if (r.contentMatchAt(r.childCount).matchType(s == n.length - 1 ? t.type : n[s + 1]))
      return r.copy(r.content.append(b.from(Ac(t, n, s + 1))));
  }
}
function Oc(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, Oc(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(b.empty, !0);
  return n.copy(t.append(r));
}
function Pi(n, e, t, r, s, i) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return n.childCount > 1 && (i = 0), s < r - 1 && (l = Pi(l, e, t, r, s + 1, i)), s >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, i <= s).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(b.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function Sl(n, e, t) {
  return e < n.openStart && (n = new x(Pi(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new x(Pi(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
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
let Cl = null;
function Rc() {
  return Cl || (Cl = document.implementation.createHTMLDocument("title"));
}
function Uh(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Rc().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), s;
  if ((s = r && Nc[r[1].toLowerCase()]) && (n = s.map((i) => "<" + i + ">").join("") + n + s.map((i) => "</" + i + ">").reverse().join("")), t.innerHTML = n, s)
    for (let i = 0; i < s.length; i++)
      t = t.querySelector(s[i]) || t;
  return t;
}
function Kh(n) {
  let e = n.querySelectorAll(re ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Jh(n, e) {
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
const ie = {}, oe = {}, qh = { touchstart: !0, touchmove: !0 };
class Gh {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Yh(n) {
  for (let e in ie) {
    let t = ie[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Qh(n, r) && !co(n, r) && (n.editable || !(r.type in oe)) && t(n, r);
    }, qh[e] ? { passive: !0 } : void 0);
  }
  se && n.dom.addEventListener("input", () => null), $i(n);
}
function dt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Xh(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function $i(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => co(n, r));
  });
}
function co(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Qh(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Zh(n, e) {
  !co(n, e) && ie[e.type] && (n.editable || !(e.type in oe)) && ie[e.type](n, e);
}
oe.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Ic(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Ce && re && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), an && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (s) => s(n, St(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || _h(n, t) ? t.preventDefault() : dt(n, "key");
};
oe.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
oe.keypress = (n, e) => {
  let t = e;
  if (Ic(n, t) || !t.charCode || t.ctrlKey && !t.altKey || be && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (s) => s(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof T) || !r.$from.sameParent(r.$to)) {
    let s = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(s) && !n.someProp("handleTextInput", (i) => i(n, r.$from.pos, r.$to.pos, s)) && n.dispatch(n.state.tr.insertText(s).scrollIntoView()), t.preventDefault();
  }
};
function Os(n) {
  return { left: n.clientX, top: n.clientY };
}
function ef(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function uo(n, e, t, r, s) {
  if (r == -1)
    return !1;
  let i = n.state.doc.resolve(r);
  for (let o = i.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > i.depth ? l(n, t, i.nodeAfter, i.before(o), s, !0) : l(n, t, i.node(o), i.before(o), s, !1)))
      return !0;
  return !1;
}
function tn(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function tf(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && v.isSelectable(r) ? (tn(n, new v(t)), !0) : !1;
}
function nf(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, s;
  t instanceof v && (r = t.node);
  let i = n.state.doc.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let l = o > i.depth ? i.nodeAfter : i.node(o);
    if (v.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && i.before(t.$from.depth + 1) == t.$from.pos ? s = i.before(t.$from.depth) : s = i.before(o);
      break;
    }
  }
  return s != null ? (tn(n, v.create(n.state.doc, s)), !0) : !1;
}
function rf(n, e, t, r, s) {
  return uo(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (i) => i(n, e, r)) || (s ? nf(n, t) : tf(n, t));
}
function sf(n, e, t, r) {
  return uo(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (s) => s(n, e, r));
}
function of(n, e, t, r) {
  return uo(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (s) => s(n, e, r)) || lf(n, t, r);
}
function lf(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (tn(n, T.create(r, 0, r.content.size)), !0) : !1;
  let s = r.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let o = i > s.depth ? s.nodeAfter : s.node(i), l = s.before(i);
    if (o.inlineContent)
      tn(n, T.create(r, l + 1, l + 1 + o.content.size));
    else if (v.isSelectable(o))
      tn(n, v.create(r, l));
    else
      continue;
    return !0;
  }
}
function ho(n) {
  return Br(n);
}
const Dc = be ? "metaKey" : "ctrlKey";
ie.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = ho(n), s = Date.now(), i = "singleClick";
  s - n.input.lastClick.time < 500 && ef(t, n.input.lastClick) && !t[Dc] && (n.input.lastClick.type == "singleClick" ? i = "doubleClick" : n.input.lastClick.type == "doubleClick" && (i = "tripleClick")), n.input.lastClick = { time: s, x: t.clientX, y: t.clientY, type: i };
  let o = n.posAtCoords(Os(t));
  o && (i == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new af(n, o, t, !!r)) : (i == "doubleClick" ? sf : of)(n, o.pos, o.inside, t) ? t.preventDefault() : dt(n, "pointer"));
};
class af {
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
    (r.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof v && c.from <= o && c.to > o) && (this.mightDrag = {
      node: i,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Te && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), dt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Ge(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Os(e))), this.updateAllowDefault(e), this.allowDefault || !t ? dt(this.view, "pointer") : rf(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    se && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    re && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (tn(this.view, A.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : dt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), dt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
ie.touchstart = (n) => {
  n.input.lastTouch = Date.now(), ho(n), dt(n, "pointer");
};
ie.touchmove = (n) => {
  n.input.lastTouch = Date.now(), dt(n, "pointer");
};
ie.contextmenu = (n) => ho(n);
function Ic(n, e) {
  return n.composing ? !0 : se && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const cf = Ce ? 5e3 : -1;
oe.compositionstart = oe.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), Br(n, !0), n.markCursor = null;
    else if (Br(n), Te && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  Lc(n, cf);
};
oe.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Lc(n, 20));
};
function Lc(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => Br(n), e));
}
function Pc(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = uf()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function df(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = th(e.focusNode, e.focusOffset), r = nh(e.focusNode, e.focusOffset);
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
function uf() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Br(n, e = !1) {
  if (!(Ce && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Pc(n), e || n.docView && n.docView.dirty) {
      let t = lo(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function hf(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), s = document.createRange();
  s.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(s), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const zn = de && ut < 15 || an && ah < 604;
ie.copy = oe.cut = (n, e) => {
  let t = e, r = n.state.selection, s = t.type == "cut";
  if (r.empty)
    return;
  let i = zn ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = vc(n, o);
  i ? (t.preventDefault(), i.clearData(), i.setData("text/html", l.innerHTML), i.setData("text/plain", a)) : hf(n, l), s && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function ff(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function pf(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let s = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Hn(n, r.value, null, s, e) : Hn(n, r.textContent, r.innerHTML, s, e);
  }, 50);
}
function Hn(n, e, t, r, s) {
  let i = Tc(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, s, i || x.empty)))
    return !0;
  if (!i)
    return !1;
  let o = ff(i), l = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(i);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function $c(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
oe.paste = (n, e) => {
  let t = e;
  if (n.composing && !Ce)
    return;
  let r = zn ? null : t.clipboardData, s = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Hn(n, $c(r), r.getData("text/html"), s, t) ? t.preventDefault() : pf(n, t);
};
class Bc {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const zc = be ? "altKey" : "ctrlKey";
ie.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let s = n.state.selection, i = s.empty ? null : n.posAtCoords(Os(t)), o;
  if (!(i && i.pos >= s.from && i.pos <= (s instanceof v ? s.to - 1 : s.to))) {
    if (r && r.mightDrag)
      o = v.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let u = n.docView.nearestDesc(t.target, !0);
      u && u.node.type.spec.draggable && u != n.docView && (o = v.create(n.state.doc, u.posBefore));
    }
  }
  let l = (o || n.state.selection).content(), { dom: a, text: c, slice: d } = vc(n, l);
  t.dataTransfer.clearData(), t.dataTransfer.setData(zn ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", zn || t.dataTransfer.setData("text/plain", c), n.dragging = new Bc(d, !t[zc], o);
};
ie.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
oe.dragover = oe.dragenter = (n, e) => e.preventDefault();
oe.drop = (n, e) => {
  let t = e, r = n.dragging;
  if (n.dragging = null, !t.dataTransfer)
    return;
  let s = n.posAtCoords(Os(t));
  if (!s)
    return;
  let i = n.state.doc.resolve(s.pos), o = r && r.slice;
  o ? n.someProp("transformPasted", (p) => {
    o = p(o, n);
  }) : o = Tc(n, $c(t.dataTransfer), zn ? null : t.dataTransfer.getData("text/html"), !1, i);
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
  if (u && v.isSelectable(o.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new v(f));
  else {
    let p = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, g, y, w) => p = w), c.setSelection(ao(n, f, c.doc.resolve(p)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
ie.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Ge(n);
  }, 20));
};
ie.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
ie.beforeinput = (n, e) => {
  if (re && Ce && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (i) => i(n, St(8, "Backspace")))))
        return;
      let { $cursor: s } = n.state.selection;
      s && s.pos > 0 && n.dispatch(n.state.tr.delete(s.pos - 1, s.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in oe)
  ie[n] = oe[n];
function Fn(n, e) {
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
class zr {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Dt, this.side = this.spec.side || 0;
  }
  map(e, t, r, s) {
    let { pos: i, deleted: o } = e.mapResult(t.from + s, this.side < 0 ? -1 : 1);
    return o ? null : new ce(i - r, i - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof zr && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Fn(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class ft {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Dt;
  }
  map(e, t, r, s) {
    let i = e.map(t.from + s, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + s, this.spec.inclusiveEnd ? 1 : -1) - r;
    return i >= o ? null : new ce(i, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof ft && Fn(this.attrs, e.attrs) && Fn(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof ft;
  }
  destroy() {
  }
}
class fo {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Dt;
  }
  map(e, t, r, s) {
    let i = e.mapResult(t.from + s, 1);
    if (i.deleted)
      return null;
    let o = e.mapResult(t.to + s, -1);
    return o.deleted || o.pos <= i.pos ? null : new ce(i.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: s } = e.content.findIndex(t.from), i;
    return s == t.from && !(i = e.child(r)).isText && s + i.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof fo && Fn(this.attrs, e.attrs) && Fn(this.spec, e.spec);
  }
  destroy() {
  }
}
class ce {
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
    return new ce(e, t, this.type);
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
    return new ce(e, e, new zr(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, s) {
    return new ce(e, t, new ft(r, s));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, s) {
    return new ce(e, t, new fo(r, s));
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
    return this.type instanceof ft;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof zr;
  }
}
const Jt = [], Dt = {};
class z {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Jt, this.children = t.length ? t : Jt;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? Hr(t, e, 0, Dt) : Z;
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
    return this == Z || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Dt);
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
    return this.children.length ? mf(this.children, o || [], e, t, r, s, i) : o ? new z(o.sort(It), Jt) : Z;
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
        s[i] == a ? s[i + 2] = s[i + 2].addInner(l, d, c + 1) : s.splice(i, 0, a, a + l.nodeSize, Hr(d, l, c + 1, Dt)), i += 3;
      }
    });
    let o = Hc(i ? Vc(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new z(o.length ? this.local.concat(o).sort(It) : this.local, s || this.children);
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
      if (a.from < o && a.to > i && a.type instanceof ft) {
        let c = Math.max(i, a.from) - i, d = Math.min(o, a.to) - i;
        c < d && (s || (s = [])).push(a.copy(c, d));
      }
    }
    if (s) {
      let l = new z(s.sort(It), Jt);
      return r ? new rt([l, r]) : l;
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
    return po(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Z)
      return Jt;
    if (e.inlineContent || !this.local.some(ft.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof ft || t.push(this.local[r]);
    return t;
  }
}
z.empty = new z([], []);
z.removeOverlap = po;
const Z = z.empty;
class rt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((s) => s.map(e, t, Dt));
    return rt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return z.empty;
    let r = [];
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].forChild(e, t);
      i != Z && (i instanceof rt ? r = r.concat(i.members) : r.push(i));
    }
    return rt.from(r);
  }
  eq(e) {
    if (!(e instanceof rt) || e.members.length != this.members.length)
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
    return t ? po(r ? t : t.sort(It)) : Jt;
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
        return new rt(e.every((t) => t instanceof z) ? e : e.reduce((t, r) => t.concat(r instanceof z ? r : r.members), []));
    }
  }
}
function mf(n, e, t, r, s, i, o) {
  let l = n.slice();
  for (let c = 0, d = i; c < t.maps.length; c++) {
    let u = 0;
    t.maps[c].forEach((h, f, p, m) => {
      let g = m - p - (f - h);
      for (let y = 0; y < l.length; y += 3) {
        let w = l[y + 1];
        if (w < 0 || h > w + d - u)
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
    let c = gf(l, n, e, t, s, i, o), d = Hr(c, r, 0, o);
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
  return new z(e.sort(It), l);
}
function Hc(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let s = n[r];
    t.push(new ce(s.from + e, s.to + e, s.type));
  }
  return t;
}
function gf(n, e, t, r, s, i, o) {
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
function Hr(n, e, t, r) {
  let s = [], i = !1;
  e.forEach((l, a) => {
    let c = Fc(n, l, a + t);
    if (c) {
      i = !0;
      let d = Hr(c, l, t + a + 1, r);
      d != Z && s.push(a, a + l.nodeSize, d);
    }
  });
  let o = Hc(i ? Vc(n) : n, -t).sort(It);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || s.length ? new z(o, s) : Z;
}
function It(n, e) {
  return n.from - e.from || n.to - e.to;
}
function po(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let s = t + 1; s < e.length; s++) {
        let i = e[s];
        if (i.from == r.from) {
          i.to != r.to && (e == n && (e = n.slice()), e[s] = i.copy(i.from, r.to), Ml(e, s + 1, i.copy(r.to, i.to)));
          continue;
        } else {
          i.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, i.from), Ml(e, s, r.copy(i.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Ml(n, e, t) {
  for (; e < n.length && It(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function ei(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Z && e.push(r);
  }), n.cursorWrapper && e.push(z.create(n.state.doc, [n.cursorWrapper.deco])), rt.from(e);
}
const yf = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, bf = de && ut <= 11;
class wf {
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
class kf {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new wf(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let s = 0; s < r.length; s++)
        this.queue.push(r[s]);
      de && ut <= 11 && r.some((s) => s.type == "childList" && s.removedNodes.length || s.type == "characterData" && s.oldValue.length > s.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), bf && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, yf)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (gl(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Ge(this.view);
      if (de && ut <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && $t(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let i = e.focusNode; i; i = Bn(i))
      t.add(i);
    for (let i = e.anchorNode; i; i = Bn(i))
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
    let r = e.domSelectionRange(), s = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && gl(e) && !this.ignoreSelectionChange(r), i = -1, o = -1, l = !1, a = [];
    if (e.editable)
      for (let d = 0; d < t.length; d++) {
        let u = this.registerMutation(t[d], a);
        u && (i = i < 0 ? u.from : Math.min(u.from, i), o = o < 0 ? u.to : Math.max(u.to, o), u.typeOver && (l = !0));
      }
    if (Te && a.length) {
      let d = a.filter((u) => u.nodeName == "BR");
      if (d.length == 2) {
        let [u, h] = d;
        u.parentNode && u.parentNode.parentNode == h.parentNode ? h.remove() : u.remove();
      } else {
        let { focusNode: u } = this.currentSelection;
        for (let h of d) {
          let f = h.parentNode;
          f && f.nodeName == "LI" && (!u || Cf(e, u) != f) && h.remove();
        }
      }
    }
    let c = null;
    i < 0 && s && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && As(r) && (c = lo(e)) && c.eq(A.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Ge(e), this.currentSelection.set(r), e.scrollToSelection()) : (i > -1 || s) && (i > -1 && (e.docView.markDirty(i, o), xf(e)), this.handleDOMChange(i, o, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Ge(e), this.currentSelection.set(r));
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
      if (de && ut <= 11 && e.addedNodes.length)
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
let vl = /* @__PURE__ */ new WeakMap(), Tl = !1;
function xf(n) {
  if (!vl.has(n) && (vl.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = Te, Tl)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Tl = !0;
  }
}
function Al(n, e) {
  let t = e.startContainer, r = e.startOffset, s = e.endContainer, i = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return $t(o.node, o.offset, s, i) && ([t, r, s, i] = [s, i, t, r]), { anchorNode: t, anchorOffset: r, focusNode: s, focusOffset: i };
}
function Sf(n, e) {
  if (e.getComposedRanges) {
    let s = e.getComposedRanges(n.root)[0];
    if (s)
      return Al(n, s);
  }
  let t;
  function r(s) {
    s.preventDefault(), s.stopImmediatePropagation(), t = s.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? Al(n, t) : null;
}
function Cf(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function Mf(n, e, t) {
  let { node: r, fromOffset: s, toOffset: i, from: o, to: l } = n.docView.parseRange(e, t), a = n.domSelectionRange(), c, d = a.anchorNode;
  if (d && n.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (c = [{ node: d, offset: a.anchorOffset }], As(a) || c.push({ node: a.focusNode, offset: a.focusOffset })), re && n.input.lastKeyCode === 8)
    for (let g = i; g > s; g--) {
      let y = r.childNodes[g - 1], w = y.pmViewDesc;
      if (y.nodeName == "BR" && !w) {
        i = g;
        break;
      }
      if (!w || w.size)
        break;
    }
  let u = n.state.doc, h = n.someProp("domParser") || sn.fromSchema(n.state.schema), f = u.resolve(o), p = null, m = h.parse(r, {
    topNode: f.parent,
    topMatch: f.parent.contentMatchAt(f.index()),
    topOpen: !0,
    from: s,
    to: i,
    preserveWhitespace: f.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: vf,
    context: f
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: l };
}
function vf(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (se && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || se && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Tf = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Af(n, e, t, r, s) {
  let i = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let D = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, Ne = lo(n, D);
    if (Ne && !n.state.selection.eq(Ne)) {
      if (re && Ce && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (nr) => nr(n, St(13, "Enter"))))
        return;
      let Xe = n.state.tr.setSelection(Ne);
      D == "pointer" ? Xe.setMeta("pointer", !0) : D == "key" && Xe.scrollIntoView(), i && Xe.setMeta("composition", i), n.dispatch(Xe);
    }
    return;
  }
  let o = n.state.doc.resolve(e), l = o.sharedDepth(t);
  e = o.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = Mf(n, e, t), d = n.state.doc, u = d.slice(c.from, c.to), h, f;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, f = "end") : (h = n.state.selection.from, f = "start"), n.input.lastKeyCode = null;
  let p = Nf(u.content, c.doc.content, c.from, h, f);
  if ((an && n.input.lastIOSEnter > Date.now() - 225 || Ce) && s.some((D) => D.nodeType == 1 && !Tf.test(D.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (D) => D(n, St(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof T && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let D = El(n, n.state.doc, c.sel);
        if (D && !D.eq(n.state.selection)) {
          let Ne = n.state.tr.setSelection(D);
          i && Ne.setMeta("composition", i), n.dispatch(Ne);
        }
      }
      return;
    }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof T && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), de && ut <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = d.resolve(p.start), w = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA, C;
  if ((an && n.input.lastIOSEnter > Date.now() - 225 && (!w || s.some((D) => D.nodeName == "DIV" || D.nodeName == "P")) || !w && m.pos < c.doc.content.size && !m.sameParent(g) && (C = A.findFrom(c.doc.resolve(m.pos + 1), 1, !0)) && C.head == g.pos) && n.someProp("handleKeyDown", (D) => D(n, St(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && Of(d, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (D) => D(n, St(8, "Backspace")))) {
    Ce && re && n.domObserver.suppressSelectionUpdates();
    return;
  }
  re && Ce && p.endB == p.start && (n.input.lastAndroidDelete = Date.now()), Ce && !w && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(D) {
      return D(n, St(13, "Enter"));
    });
  }, 20));
  let R = p.start, E = p.endA, M, I, J;
  if (w) {
    if (m.pos == g.pos)
      de && ut <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Ge(n), 20)), M = n.state.tr.delete(R, E), I = d.resolve(p.start).marksAcross(d.resolve(p.endA));
    else if (
      // Adding or removing a mark
      p.endA == p.endB && (J = Ef(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    )
      M = n.state.tr, J.type == "add" ? M.addMark(R, E, J.mark) : M.removeMark(R, E, J.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let D = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (Ne) => Ne(n, R, E, D)))
        return;
      M = n.state.tr.insertText(D, R, E);
    }
  }
  if (M || (M = n.state.tr.replace(R, E, c.doc.slice(p.start - c.from, p.endB - c.from))), c.sel) {
    let D = El(n, M.doc, c.sel);
    D && !(re && Ce && n.composing && D.empty && (p.start != p.endB || n.input.lastAndroidDelete < Date.now() - 100) && (D.head == R || D.head == M.mapping.map(E) - 1) || de && D.empty && D.head == R) && M.setSelection(D);
  }
  I && M.ensureMarks(I), i && M.setMeta("composition", i), n.dispatch(M.scrollIntoView());
}
function El(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : ao(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Ef(n, e) {
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
function Of(n, e, t, r, s) {
  if (
    // The content must have shrunk
    t - e <= s.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    ti(r, !0, !1) < s.pos
  )
    return !1;
  let i = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = i.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock)
    return !1;
  let o = n.resolve(ti(i, !0, !0));
  return !o.parent.isTextblock || o.pos > t || ti(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function ti(n, e, t) {
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
function Nf(n, e, t, r, s) {
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
    i -= a, i && i < e.size && Ol(e.textBetween(i - 1, i + 1)) && (i += a ? 1 : -1), l = i + (l - o), o = i;
  } else if (l < i) {
    let a = r <= i && r >= l ? i - r : 0;
    i -= a, i && i < n.size && Ol(n.textBetween(i - 1, i + 1)) && (i += a ? 1 : -1), o = i + (o - l), l = i;
  }
  return { start: i, endA: o, endB: l };
}
function Ol(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Rf {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Gh(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Ll), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Dl(this), Rl(this), this.nodeViews = Il(this), this.docView = dl(this.state.doc, Nl(this), ei(this), this.dom, this), this.domObserver = new kf(this, (r, s, i, o) => Af(this, r, s, i, o)), this.domObserver.start(), Yh(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && $i(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Ll), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
      let f = Il(this);
      If(f, this.nodeViews) && (this.nodeViews = f, i = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && $i(this), this.editable = Dl(this), Rl(this);
    let a = ei(this), c = Nl(this), d = s.plugins != e.plugins && !s.doc.eq(e.doc) ? "reset" : e.scrollToSelection > s.scrollToSelection ? "to selection" : "preserve", u = i || !this.docView.matchesNode(e.doc, c, a);
    (u || !e.selection.eq(s.selection)) && (o = !0);
    let h = d == "preserve" && o && this.dom.style.overflowAnchor == null && uh(this);
    if (o) {
      this.domObserver.stop();
      let f = u && (de || re) && !this.composing && !s.selection.empty && !e.selection.empty && Df(s.selection, e.selection);
      if (u) {
        let p = re ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = df(this)), (i || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = dl(e.doc, c, a, this.dom, this)), p && !this.trackWrites && (f = !0);
      }
      f || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Ph(this)) ? Ge(this, f) : (Sc(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(s), !((r = this.dragging) === null || r === void 0) && r.node && !s.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, s), d == "reset" ? this.dom.scrollTop = 0 : d == "to selection" ? this.scrollToSelection() : h && hh(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof v) {
      let t = this.docView.domAfterPos(this.state.selection.from);
      t.nodeType == 1 && sl(this, t.getBoundingClientRect(), e);
    } else
      sl(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new Bc(e.slice, e.move, s < 0 ? void 0 : v.create(this.state.doc, s));
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
    if (de) {
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
    this.domObserver.stop(), this.editable && fh(this.dom), Ge(this), this.domObserver.start();
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
    return bh(this, e);
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
    return Ch(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Hn(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Hn(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Xh(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ei(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Zu());
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
    return Zh(this, e);
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
    return se && this.root.nodeType === 11 && sh(this.dom.ownerDocument) == this.dom && Sf(this, e) || e;
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
function Nl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [ce.node(0, n.state.doc.content.size, e)];
}
function Rl(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: ce.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Dl(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Df(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Il(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let s in r)
      Object.prototype.hasOwnProperty.call(e, s) || (e[s] = r[s]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function If(n, e) {
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
function Ll(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var mt = {
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
}, Fr = {
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
}, Lf = typeof navigator < "u" && /Mac/.test(navigator.platform), Pf = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Y = 0; Y < 10; Y++) mt[48 + Y] = mt[96 + Y] = String(Y);
for (var Y = 1; Y <= 24; Y++) mt[Y + 111] = "F" + Y;
for (var Y = 65; Y <= 90; Y++)
  mt[Y] = String.fromCharCode(Y + 32), Fr[Y] = String.fromCharCode(Y);
for (var ni in mt) Fr.hasOwnProperty(ni) || (Fr[ni] = mt[ni]);
function $f(n) {
  var e = Lf && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Pf && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Fr : mt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Bf = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function zf(n) {
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
      Bf ? o = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), s && (t = "Ctrl-" + t), o && (t = "Meta-" + t), i && (t = "Shift-" + t), t;
}
function Hf(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[zf(t)] = n[t];
  return e;
}
function ri(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function Ff(n) {
  return new X({ props: { handleKeyDown: mo(n) } });
}
function mo(n) {
  let e = Hf(n);
  return function(t, r) {
    let s = $f(r), i, o = e[ri(s, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (s.length == 1 && s != " ") {
      if (r.shiftKey) {
        let l = e[ri(s, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || s.charCodeAt(0) > 127) && (i = mt[r.keyCode]) && i != s) {
        let l = e[ri(i, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
const Vf = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function _c(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const _f = (n, e, t) => {
  let r = _c(n, t);
  if (!r)
    return !1;
  let s = go(r);
  if (!s) {
    let o = r.blockRange(), l = o && mn(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let i = s.nodeBefore;
  if (!i.type.spec.isolating && Kc(n, s, e))
    return !0;
  if (r.parent.content.size == 0 && (cn(i, "end") || v.isSelectable(i))) {
    let o = vs(n.doc, r.before(), r.after(), x.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(cn(i, "end") ? A.findFrom(l.doc.resolve(l.mapping.map(s.pos, -1)), -1) : v.create(l.doc, s.pos - i.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(n.tr.delete(s.pos - i.nodeSize, s.pos).scrollIntoView()), !0) : !1;
}, jf = (n, e, t) => {
  let r = _c(n, t);
  if (!r)
    return !1;
  let s = go(r);
  return s ? jc(n, s, e) : !1;
}, Wf = (n, e, t) => {
  let r = Wc(n, t);
  if (!r)
    return !1;
  let s = yo(r);
  return s ? jc(n, s, e) : !1;
};
function jc(n, e, t) {
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
  let c = vs(n.doc, i, a, x.empty);
  if (!c || c.from != i || c instanceof j && c.slice.size >= a - i)
    return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(T.create(d.doc, i)), t(d.scrollIntoView());
  }
  return !0;
}
function cn(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Uf = (n, e, t) => {
  let { $head: r, empty: s } = n.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    i = go(r);
  }
  let o = i && i.nodeBefore;
  return !o || !v.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(v.create(n.doc, i.pos - o.nodeSize)).scrollIntoView()), !0);
};
function go(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Wc(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Kf = (n, e, t) => {
  let r = Wc(n, t);
  if (!r)
    return !1;
  let s = yo(r);
  if (!s)
    return !1;
  let i = s.nodeAfter;
  if (Kc(n, s, e))
    return !0;
  if (r.parent.content.size == 0 && (cn(i, "start") || v.isSelectable(i))) {
    let o = vs(n.doc, r.before(), r.after(), x.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(cn(i, "start") ? A.findFrom(l.doc.resolve(l.mapping.map(s.pos)), 1) : v.create(l.doc, l.mapping.map(s.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(n.tr.delete(s.pos, s.pos + i.nodeSize).scrollIntoView()), !0) : !1;
}, Jf = (n, e, t) => {
  let { $head: r, empty: s } = n.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    i = yo(r);
  }
  let o = i && i.nodeAfter;
  return !o || !v.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(v.create(n.doc, i.pos)).scrollIntoView()), !0);
};
function yo(n) {
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
const qf = (n, e) => {
  let t = n.selection, r = t instanceof v, s;
  if (r) {
    if (t.node.isTextblock || !bt(n.doc, t.from))
      return !1;
    s = t.from;
  } else if (s = Ms(n.doc, t.from, -1), s == null)
    return !1;
  if (e) {
    let i = n.tr.join(s);
    r && i.setSelection(v.create(i.doc, s - n.doc.resolve(s).nodeBefore.nodeSize)), e(i.scrollIntoView());
  }
  return !0;
}, Gf = (n, e) => {
  let t = n.selection, r;
  if (t instanceof v) {
    if (t.node.isTextblock || !bt(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Ms(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Yf = (n, e) => {
  let { $from: t, $to: r } = n.selection, s = t.blockRange(r), i = s && mn(s);
  return i == null ? !1 : (e && e(n.tr.lift(s, i).scrollIntoView()), !0);
}, Xf = (n, e) => {
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
const Qf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let s = t.node(-1), i = t.indexAfter(-1), o = Uc(s.contentMatchAt(i));
  if (!o || !s.canReplaceWith(i, i, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(A.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, Zf = (n, e) => {
  let t = n.selection, { $from: r, $to: s } = t;
  if (t instanceof ve || r.parent.inlineContent || s.parent.inlineContent)
    return !1;
  let i = Uc(s.parent.contentMatchAt(s.indexAfter()));
  if (!i || !i.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && s.index() < s.parent.childCount ? r : s).pos, l = n.tr.insert(o, i.createAndFill());
    l.setSelection(T.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, ep = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let i = t.before();
    if (Zt(n.doc, i))
      return e && e(n.tr.split(i).scrollIntoView()), !0;
  }
  let r = t.blockRange(), s = r && mn(r);
  return s == null ? !1 : (e && e(n.tr.lift(r, s).scrollIntoView()), !0);
}, tp = (n, e) => {
  let { $from: t, to: r } = n.selection, s, i = t.sharedDepth(r);
  return i == 0 ? !1 : (s = t.before(i), e && e(n.tr.setSelection(v.create(n.doc, s))), !0);
};
function np(n, e, t) {
  let r = e.nodeBefore, s = e.nodeAfter, i = e.index();
  return !r || !s || !r.type.compatibleContent(s.type) ? !1 : !r.content.size && e.parent.canReplace(i - 1, i) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(i, i + 1) || !(s.isTextblock || bt(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Kc(n, e, t) {
  let r = e.nodeBefore, s = e.nodeAfter, i, o;
  if (r.type.spec.isolating || s.type.spec.isolating)
    return !1;
  if (np(n, e, t))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (i = (o = r.contentMatchAt(r.childCount)).findWrapping(s.type)) && o.matchType(i[0] || s.type).validEnd) {
    if (t) {
      let u = e.pos + s.nodeSize, h = b.empty;
      for (let m = i.length - 1; m >= 0; m--)
        h = b.from(i[m].create(null, h));
      h = b.from(r.copy(h));
      let f = n.tr.step(new W(e.pos - 1, u, e.pos, u, new x(h, 1, 0), i.length, !0)), p = u + 2 * i.length;
      bt(f.doc, p) && f.join(p), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = A.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), d = c && mn(c);
  if (d != null && d >= e.depth)
    return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && cn(s, "start", !0) && cn(r, "end")) {
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
        let g = n.tr.step(new W(e.pos - h.length, e.pos + s.nodeSize, e.pos + p, e.pos + s.nodeSize - p, new x(m, h.length, 0), 0, !0));
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
    return s.node(i).isTextblock ? (t && t(e.tr.setSelection(T.create(e.doc, n < 0 ? s.start(i) : s.end(i)))), !0) : !1;
  };
}
const rp = Jc(-1), sp = Jc(1);
function ip(n, e = null) {
  return function(t, r) {
    let { $from: s, $to: i } = t.selection, o = s.blockRange(i), l = o && ro(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Pl(n, e = null) {
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
function op(n, e = null) {
  return function(t, r) {
    let { $from: s, $to: i } = t.selection, o = s.blockRange(i), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && s.node(o.depth - 1).type.compatibleContent(n) && o.startIndex == 0) {
      if (s.index(o.depth - 1) == 0)
        return !1;
      let d = t.doc.resolve(o.start - 2);
      a = new Dr(d, d, o.depth), o.endIndex < o.parent.childCount && (o = new Dr(s, t.doc.resolve(i.end(o.depth)), o.depth)), l = !0;
    }
    let c = ro(a, n, e, o);
    return c ? (r && r(lp(t.tr, o, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function lp(n, e, t, r, s) {
  let i = b.empty;
  for (let d = t.length - 1; d >= 0; d--)
    i = b.from(t[d].type.create(t[d].attrs, i));
  n.step(new W(e.start - (r ? 2 : 0), e.end, e.start, e.end, new x(i, 0, 0), t.length, !0));
  let o = 0;
  for (let d = 0; d < t.length; d++)
    t[d].type == s && (o = d + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let d = e.startIndex, u = e.endIndex, h = !0; d < u; d++, h = !1)
    !h && Zt(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(d).nodeSize;
  return n;
}
function ap(n) {
  return function(e, t) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (o) => o.childCount > 0 && o.firstChild.type == n);
    return i ? t ? r.node(i.depth - 1).type == n ? cp(e, t, n, i) : dp(e, t, i) : !0 : !1;
  };
}
function cp(n, e, t, r) {
  let s = n.tr, i = r.end, o = r.$to.end(r.depth);
  i < o && (s.step(new W(i - 1, o, i, o, new x(b.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Dr(s.doc.resolve(r.$from.pos), s.doc.resolve(o), r.depth));
  const l = mn(r);
  if (l == null)
    return !1;
  s.lift(r, l);
  let a = s.mapping.map(i, -1) - 1;
  return bt(s.doc, a) && s.join(a), e(s.scrollIntoView()), !0;
}
function dp(n, e, t) {
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
  return r.step(new W(u - (l ? 1 : 0), h + (a ? 1 : 0), u + 1, h - 1, new x((l ? b.empty : b.from(s.copy(b.empty))).append(a ? b.empty : b.from(s.copy(b.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function up(n) {
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
      t(e.tr.step(new W(h - (c ? 3 : 1), f, h, f, u, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Ns(n) {
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
class Rs {
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
      state: Ns({
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
class hp {
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
function Ds(n) {
  const e = n.filter((s) => s.type === "extension"), t = n.filter((s) => s.type === "node"), r = n.filter((s) => s.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function qc(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = Ds(n), s = [...t, ...r], i = {
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
function Bi(n, e) {
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
function fp(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function pp(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function $l(n, e) {
  return n.style ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const s = e.reduce((i, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : pp(t.getAttribute(o.name));
        return l == null ? i : {
          ...i,
          [o.name]: l
        };
      }, {});
      return { ...r, ...s };
    }
  };
}
function Bl(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && fp(t) ? !1 : t != null)
  );
}
function mp(n, e) {
  var t;
  const r = qc(n), { nodeExtensions: s, markExtensions: i } = Ds(n), o = (t = s.find((c) => S(c, "topNode"))) === null || t === void 0 ? void 0 : t.name, l = Object.fromEntries(s.map((c) => {
    const d = r.filter((y) => y.type === c.name), u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, h = n.reduce((y, w) => {
      const C = S(w, "extendNodeSchema", u);
      return {
        ...y,
        ...C ? C(c) : {}
      };
    }, {}), f = Bl({
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
        var w;
        return [y.name, { default: (w = y == null ? void 0 : y.attribute) === null || w === void 0 ? void 0 : w.default }];
      }))
    }), p = O(S(c, "parseHTML", u));
    p && (f.parseDOM = p.map((y) => $l(y, d)));
    const m = S(c, "renderHTML", u);
    m && (f.toDOM = (y) => m({
      node: y,
      HTMLAttributes: Bi(y, d)
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
      const w = S(y, "extendMarkSchema", u);
      return {
        ...g,
        ...w ? w(c) : {}
      };
    }, {}), f = Bl({
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
    p && (f.parseDOM = p.map((g) => $l(g, d)));
    const m = S(c, "renderHTML", u);
    return m && (f.toDOM = (g) => m({
      mark: g,
      HTMLAttributes: Bi(g, d)
    })), [c.name, f];
  }));
  return new wu({
    topNode: o,
    nodes: l,
    marks: a
  });
}
function si(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function zl(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
const gp = (n, e = 500) => {
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
function bo(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class Is {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const yp = (n, e) => {
  if (bo(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function cr(n) {
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
  const u = gp(c) + i;
  return o.forEach((h) => {
    if (d)
      return;
    const f = yp(u, h.find);
    if (!f)
      return;
    const p = a.state.tr, m = Ns({
      state: a.state,
      transaction: p
    }), g = {
      from: r - (f[0].length - i.length),
      to: s
    }, { commands: y, chain: w, can: C } = new Rs({
      editor: t,
      state: m
    });
    h.handler({
      state: m,
      range: g,
      match: f,
      commands: y,
      chain: w,
      can: C
    }) === null || !p.steps.length || (p.setMeta(l, {
      transform: p,
      from: r,
      to: s,
      text: i
    }), a.dispatch(p), d = !0);
  }), d;
}
function bp(n) {
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
          cr({
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
        return cr({
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
          i && cr({
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
        return o ? cr({
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
function wp(n) {
  return typeof n == "number";
}
class kp {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const xp = (n, e, t) => {
  if (bo(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((s) => {
    const i = [s.text];
    return i.index = s.index, i.input = n, i.data = s.data, s.replaceWith && (s.text.includes(s.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), i.push(s.replaceWith)), i;
  }) : [];
};
function Sp(n) {
  const { editor: e, state: t, from: r, to: s, rule: i, pasteEvent: o, dropEvent: l } = n, { commands: a, chain: c, can: d } = new Rs({
    editor: e,
    state: t
  }), u = [];
  return t.doc.nodesBetween(r, s, (f, p) => {
    if (!f.isTextblock || f.type.spec.code)
      return;
    const m = Math.max(r, p), g = Math.min(s, p + f.content.size), y = f.textBetween(m - p, g - p, void 0, "￼");
    xp(y, i.find, o).forEach((C) => {
      if (C.index === void 0)
        return;
      const R = m + C.index + 1, E = R + C[0].length, M = {
        from: t.tr.mapping.map(R),
        to: t.tr.mapping.map(E)
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
const Cp = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) === null || e === void 0 || e.setData("text/html", n), t;
};
function Mp(n) {
  const { editor: e, rules: t } = n;
  let r = null, s = !1, i = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  const a = ({ state: d, from: u, to: h, rule: f, pasteEvt: p }) => {
    const m = d.tr, g = Ns({
      state: d,
      transaction: m
    });
    if (!(!Sp({
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
      const p = u[0], m = p.getMeta("uiEvent") === "paste" && !s, g = p.getMeta("uiEvent") === "drop" && !i, y = p.getMeta("applyPasteRules"), w = !!y;
      if (!m && !g && !w)
        return;
      if (w) {
        const { from: E, text: M } = y, I = E + M.length, J = Cp(M);
        return a({
          rule: d,
          state: f,
          from: E,
          to: { b: I },
          pasteEvt: J
        });
      }
      const C = h.doc.content.findDiffStart(f.doc.content), R = h.doc.content.findDiffEnd(f.doc.content);
      if (!(!wp(C) || !R || C === R.b))
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
function vp(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return [...new Set(e)];
}
class Xt {
  constructor(e, t) {
    this.splittableMarks = [], this.editor = t, this.extensions = Xt.resolve(e), this.schema = mp(this.extensions, t), this.setupExtensions();
  }
  /**
   * Returns a flattened and sorted extension list while
   * also checking for duplicated extensions and warns the user.
   * @param extensions An array of Tiptap extensions
   * @returns An flattened and sorted array of Tiptap extensions
   */
  static resolve(e) {
    const t = Xt.sort(Xt.flatten(e)), r = vp(t.map((s) => s.name));
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
        type: si(t.name, this.schema)
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
    const { editor: e } = this, t = Xt.sort([...this.extensions].reverse()), r = [], s = [], i = t.map((o) => {
      const l = {
        name: o.name,
        options: o.options,
        storage: o.storage,
        editor: e,
        type: si(o.name, this.schema)
      }, a = [], c = S(o, "addKeyboardShortcuts", l);
      let d = {};
      if (o.type === "mark" && o.config.exitable && (d.ArrowRight = () => Se.handleExit({ editor: e, mark: o })), c) {
        const m = Object.fromEntries(Object.entries(c()).map(([g, y]) => [g, () => y({ editor: e })]));
        d = { ...d, ...m };
      }
      const u = Ff(d);
      a.push(u);
      const h = S(o, "addInputRules", l);
      zl(o, e.options.enableInputRules) && h && r.push(...h());
      const f = S(o, "addPasteRules", l);
      zl(o, e.options.enablePasteRules) && f && s.push(...f());
      const p = S(o, "addProseMirrorPlugins", l);
      if (p) {
        const m = p();
        a.push(...m);
      }
      return a;
    }).flat();
    return [
      bp({
        editor: e,
        rules: r
      }),
      ...Mp({
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
    const { editor: e } = this, { nodeExtensions: t } = Ds(this.extensions);
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
        const h = Bi(a, s);
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
        type: si(e.name, this.schema)
      };
      e.type === "mark" && (!((t = O(S(e, "keepOnSplit", r))) !== null && t !== void 0) || t) && this.splittableMarks.push(e.name);
      const s = S(e, "onBeforeCreate", r), i = S(e, "onCreate", r), o = S(e, "onUpdate", r), l = S(e, "onSelectionUpdate", r), a = S(e, "onTransaction", r), c = S(e, "onFocus", r), d = S(e, "onBlur", r), u = S(e, "onDestroy", r);
      s && this.editor.on("beforeCreate", s), i && this.editor.on("create", i), o && this.editor.on("update", o), l && this.editor.on("selectionUpdate", l), a && this.editor.on("transaction", a), c && this.editor.on("focus", c), d && this.editor.on("blur", d), u && this.editor.on("destroy", u);
    });
  }
}
function Tp(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function ii(n) {
  return Tp(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Ls(n, e) {
  const t = { ...n };
  return ii(n) && ii(e) && Object.keys(e).forEach((r) => {
    ii(e[r]) ? r in n ? t[r] = Ls(n[r], e[r]) : Object.assign(t, { [r]: e[r] }) : Object.assign(t, { [r]: e[r] });
  }), t;
}
class pe {
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
    return new pe(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.parent = this.parent, t.options = Ls(this.options, e), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new pe({ ...this.config, ...e });
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
const Ap = pe.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new X({
        key: new ue("clipboardTextSerializer"),
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
}), Ep = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), Op = (n = !1) => ({ commands: e }) => e.setContent("", n), Np = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: s } = r;
  return t && s.forEach(({ $from: i, $to: o }) => {
    n.doc.nodesBetween(i.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: d } = e, u = c.resolve(d.map(a)), h = c.resolve(d.map(a + l.nodeSize)), f = u.blockRange(h);
      if (!f)
        return;
      const p = mn(f);
      if (l.type.isTextblock) {
        const { defaultType: m } = u.parent.contentMatchAt(u.index());
        e.setNodeMarkup(f.start, m);
      }
      (p || p === 0) && e.lift(f, p);
    });
  }), !0;
}, Rp = (n) => (e) => n(e), Dp = () => ({ state: n, dispatch: e }) => Zf(n, e), Ip = (n, e) => ({ editor: t, tr: r }) => {
  const { state: s } = t, i = s.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, i.content), r.setSelection(new T(r.doc.resolve(o - 1))), !0;
}, Lp = () => ({ tr: n, dispatch: e }) => {
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
}, Pp = (n) => ({ tr: e, state: t, dispatch: r }) => {
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
}, $p = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: s } = n;
  return t && e.delete(r, s), !0;
}, Bp = () => ({ state: n, dispatch: e }) => Vf(n, e), zp = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Hp = () => ({ state: n, dispatch: e }) => Qf(n, e);
function Vr(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((s) => t.strict ? e[s] === n[s] : bo(e[s]) ? e[s].test(n[s]) : e[s] === n[s]) : !0;
}
function zi(n, e, t = {}) {
  return n.find((r) => r.type === e && Vr(r.attrs, t));
}
function Fp(n, e, t = {}) {
  return !!zi(n, e, t);
}
function wo(n, e, t = {}) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if (n.parentOffset === r.offset && r.offset !== 0 && (r = n.parent.childBefore(n.parentOffset)), !r.node)
    return;
  const s = zi([...r.node.marks], e, t);
  if (!s)
    return;
  let i = r.index, o = n.start() + r.offset, l = i + 1, a = o + r.node.nodeSize;
  for (zi([...r.node.marks], e, t); i > 0 && s.isInSet(n.parent.child(i - 1).marks); )
    i -= 1, o -= n.parent.child(i).nodeSize;
  for (; l < n.parent.childCount && Fp([...n.parent.child(l).marks], e, t); )
    a += n.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function kt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const Vp = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  const i = kt(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: d } = l;
  if (s) {
    const u = wo(a, i, e);
    if (u && u.from <= c && u.to >= d) {
      const h = T.create(o, u.from, u.to);
      t.setSelection(h);
    }
  }
  return !0;
}, _p = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Qc(n) {
  return n instanceof T;
}
function Tt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Zc(n, e = null) {
  if (!e)
    return null;
  const t = A.atStart(n), r = A.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const s = t.from, i = r.to;
  return e === "all" ? T.create(n, Tt(0, s, i), Tt(n.content.size, s, i)) : T.create(n, Tt(e, s, i), Tt(e, s, i));
}
function ko() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const jp = (n = null, e = {}) => ({ editor: t, view: r, tr: s, dispatch: i }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    ko() && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (i && n === null && !Qc(t.state.selection))
    return o(), !0;
  const l = Zc(s.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return i && (a || s.setSelection(l), a && s.storedMarks && s.setStoredMarks(s.storedMarks), o()), !0;
}, Wp = (n, e) => (t) => n.every((r, s) => e(r, { ...t, index: s })), Up = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), ed = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && ed(r);
  }
  return n;
};
function Hl(n) {
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return ed(t);
}
function _r(n, e, t) {
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
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", i), _r("", e, t);
    }
  if (s) {
    const i = sn.fromSchema(e);
    return t.slice ? i.parseSlice(Hl(n), t.parseOptions).content : i.parse(Hl(n), t.parseOptions);
  }
  return _r("", e, t);
}
function Kp(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const s = n.steps[r];
  if (!(s instanceof j || s instanceof W))
    return;
  const i = n.mapping.maps[r];
  let o = 0;
  i.forEach((l, a, c, d) => {
    o === 0 && (o = d);
  }), n.setSelection(A.near(n.doc.resolve(o), t));
}
const Jp = (n) => n.toString().startsWith("<"), qp = (n, e, t) => ({ tr: r, dispatch: s, editor: i }) => {
  if (s) {
    t = {
      parseOptions: {},
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    const o = _r(e, i.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...t.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, c = !0, d = !0;
    if ((Jp(o) ? o : [o]).forEach((f) => {
      f.check(), c = c ? f.isText && f.marks.length === 0 : !1, d = d ? f.isBlock : !1;
    }), l === a && d) {
      const { parent: f } = r.doc.resolve(l);
      f.isTextblock && !f.type.spec.code && !f.childCount && (l -= 1, a += 1);
    }
    let h;
    c ? (Array.isArray(e) ? h = e.map((f) => f.text || "").join("") : typeof e == "object" && e && e.text ? h = e.text : h = e, r.insertText(h, l, a)) : (h = o, r.replaceWith(l, a, h)), t.updateSelection && Kp(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: l, text: h }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: l, text: h });
  }
  return !0;
}, Gp = () => ({ state: n, dispatch: e }) => qf(n, e), Yp = () => ({ state: n, dispatch: e }) => Gf(n, e), Xp = () => ({ state: n, dispatch: e }) => _f(n, e), Qp = () => ({ state: n, dispatch: e }) => Kf(n, e), Zp = () => ({ tr: n, state: e, dispatch: t }) => {
  try {
    const r = Ms(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, em = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ms(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, tm = () => ({ state: n, dispatch: e }) => jf(n, e), nm = () => ({ state: n, dispatch: e }) => Wf(n, e);
function td() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function rm(n) {
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
      ko() || td() ? o = !0 : s = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), s && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), i && (t = `Shift-${t}`), t;
}
const sm = (n) => ({ editor: e, view: t, tr: r, dispatch: s }) => {
  const i = rm(n).split(/-(?!$)/), o = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
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
function Vn(n, e, t = {}) {
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
  const a = s - r, c = l.filter((u) => o ? o.name === u.node.type.name : !0).filter((u) => Vr(u.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((u, h) => u + h.to - h.from, 0) >= a;
}
const im = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = K(n, t.schema);
  return Vn(t, s, e) ? Yf(t, r) : !1;
}, om = () => ({ state: n, dispatch: e }) => ep(n, e), lm = (n) => ({ state: e, dispatch: t }) => {
  const r = K(n, e.schema);
  return ap(r)(e, t);
}, am = () => ({ state: n, dispatch: e }) => Xf(n, e);
function Ps(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Fl(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, s) => (t.includes(s) || (r[s] = n[s]), r), {});
}
const cm = (n, e) => ({ tr: t, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = Ps(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (i = K(n, r.schema)), l === "mark" && (o = kt(n, r.schema)), s && t.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
      i && i === c.type && t.setNodeMarkup(d, void 0, Fl(c.attrs, e)), o && c.marks.length && c.marks.forEach((u) => {
        o === u.type && t.addMark(d, d + c.nodeSize, o.create(Fl(u.attrs, e)));
      });
    });
  }), !0) : !1;
}, dm = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), um = () => ({ tr: n, commands: e }) => e.setTextSelection({
  from: 0,
  to: n.doc.content.size
}), hm = () => ({ state: n, dispatch: e }) => Uf(n, e), fm = () => ({ state: n, dispatch: e }) => Jf(n, e), pm = () => ({ state: n, dispatch: e }) => tp(n, e), mm = () => ({ state: n, dispatch: e }) => sp(n, e), gm = () => ({ state: n, dispatch: e }) => rp(n, e);
function nd(n, e, t = {}) {
  return _r(n, e, { slice: !1, parseOptions: t });
}
const ym = (n, e = !1, t = {}) => ({ tr: r, editor: s, dispatch: i }) => {
  const { doc: o } = r, l = nd(n, s.schema, t);
  return i && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function $s(n, e) {
  const t = kt(e, n.schema), { from: r, to: s, empty: i } = n.selection, o = [];
  i ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, s, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function bm(n, e) {
  const t = new so(n);
  return e.forEach((r) => {
    r.steps.forEach((s) => {
      t.step(s);
    });
  }), t;
}
function wm(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function km(n, e, t) {
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
function xo(n) {
  return (e) => rd(e.$from, n);
}
function xm(n, e) {
  const t = ze.fromSchema(e).serializeFragment(n), s = document.implementation.createHTMLDocument().createElement("div");
  return s.appendChild(t), s.innerHTML;
}
function Sm(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Yc(n, t, e);
}
function Cm(n, e) {
  const t = K(e, n.schema), { from: r, to: s } = n.selection, i = [];
  n.doc.nodesBetween(r, s, (l) => {
    i.push(l);
  });
  const o = i.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function sd(n, e) {
  const t = Ps(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? Cm(n, e) : t === "mark" ? $s(n, e) : {};
}
function Mm(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const s = e(r);
    return Object.prototype.hasOwnProperty.call(t, s) ? !1 : t[s] = !0;
  });
}
function vm(n) {
  const e = Mm(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((i, o) => o !== r).some((i) => t.oldRange.from >= i.oldRange.from && t.oldRange.to <= i.oldRange.to && t.newRange.from >= i.newRange.from && t.newRange.to <= i.newRange.to));
}
function Tm(n) {
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
  }), vm(r);
}
function So(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((s) => {
    const i = t.resolve(n - 1), o = wo(i, s.type);
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
function xr(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const s = n.find((i) => i.type === e && i.name === r);
    return s ? s.attribute.keepOnSplit : !1;
  }));
}
function Hi(n, e, t = {}) {
  const { empty: r, ranges: s } = n.selection, i = e ? kt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((u) => i ? i.name === u.type.name : !0).find((u) => Vr(u.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (s.forEach(({ $from: u, $to: h }) => {
    const f = u.pos, p = h.pos;
    n.doc.nodesBetween(f, p, (m, g) => {
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(f, g), w = Math.min(p, g + m.nodeSize), C = w - y;
      o += C, l.push(...m.marks.map((R) => ({
        mark: R,
        from: y,
        to: w
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((u) => i ? i.name === u.mark.type.name : !0).filter((u) => Vr(u.mark.attrs, t, { strict: !1 })).reduce((u, h) => u + h.to - h.from, 0), c = l.filter((u) => i ? u.mark.type !== i && u.mark.type.excludes(i) : !0).reduce((u, h) => u + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function Am(n, e, t = {}) {
  if (!e)
    return Vn(n, null, t) || Hi(n, null, t);
  const r = Ps(e, n.schema);
  return r === "node" ? Vn(n, e, t) : r === "mark" ? Hi(n, e, t) : !1;
}
function Vl(n, e) {
  const { nodeExtensions: t } = Ds(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const s = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, i = O(S(r, "group", s));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function Em(n) {
  var e;
  const t = (e = n.type.createAndFill()) === null || e === void 0 ? void 0 : e.toJSON(), r = n.toJSON();
  return JSON.stringify(t) === JSON.stringify(r);
}
function Om(n, e, t) {
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
const Nm = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  const { selection: i } = t, { empty: o, ranges: l } = i, a = kt(n, r.schema);
  if (s)
    if (o) {
      const c = $s(r, a);
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
  return Om(r, t, a);
}, Rm = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), Dm = (n, e = {}) => ({ state: t, dispatch: r, chain: s }) => {
  const i = K(n, t.schema);
  return i.isTextblock ? s().command(({ commands: o }) => Pl(i, e)(t) ? !0 : o.clearNodes()).command(({ state: o }) => Pl(i, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Im = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, s = Tt(n, 0, r.content.size), i = v.create(r, s);
    e.setSelection(i);
  }
  return !0;
}, Lm = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: s, to: i } = typeof n == "number" ? { from: n, to: n } : n, o = T.atStart(r).from, l = T.atEnd(r).to, a = Tt(s, o, l), c = Tt(i, o, l), d = T.create(r, a, c);
    e.setSelection(d);
  }
  return !0;
}, Pm = (n) => ({ state: e, dispatch: t }) => {
  const r = K(n, e.schema);
  return up(r)(e, t);
};
function _l(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((s) => e == null ? void 0 : e.includes(s.type.name));
    n.tr.ensureMarks(r);
  }
}
const $m = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: s }) => {
  const { selection: i, doc: o } = e, { $from: l, $to: a } = i, c = s.extensionManager.attributes, d = xr(c, l.node().type.name, l.node().attrs);
  if (i instanceof v && i.node.isBlock)
    return !l.parentOffset || !Zt(o, l.pos) ? !1 : (r && (n && _l(t, s.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const u = a.parentOffset === a.parent.content.size;
    i instanceof T && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : wm(l.node(-1).contentMatchAt(l.indexAfter(-1)));
    let f = u && h ? [
      {
        type: h,
        attrs: d
      }
    ] : void 0, p = Zt(e.doc, e.mapping.map(l.pos), 1, f);
    if (!f && !p && Zt(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (p = !0, f = h ? [
      {
        type: h,
        attrs: d
      }
    ] : void 0), p && (e.split(e.mapping.map(l.pos), 1, f), h && !u && !l.parentOffset && l.parent.type !== h)) {
      const m = e.mapping.map(l.before()), g = e.doc.resolve(m);
      l.node(-1).canReplaceWith(g.index(), g.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    n && _l(t, s.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, Bm = (n) => ({ tr: e, state: t, dispatch: r, editor: s }) => {
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
      const w = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, C = xr(u, l.node().type.name, l.node().attrs), R = ((i = o.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(C)) || void 0;
      g = g.append(b.from(o.createAndFill(null, R) || void 0));
      const E = l.before(l.depth - (y - 1));
      e.replace(E, l.after(-w), new x(g, 4 - y, 0));
      let M = -1;
      e.doc.nodesBetween(E, e.doc.content.size, (I, J) => {
        if (M > -1)
          return !1;
        I.isTextblock && I.content.size === 0 && (M = J + 1);
      }), M > -1 && e.setSelection(T.near(e.doc.resolve(M))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null, f = xr(u, d.type.name, d.attrs), p = xr(u, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const m = h ? [
    { type: o, attrs: f },
    { type: h, attrs: p }
  ] : [{ type: o, attrs: f }];
  if (!Zt(e.doc, l.pos, 2))
    return !1;
  if (r) {
    const { selection: g, storedMarks: y } = t, { splittableMarks: w } = s.extensionManager, C = y || g.$to.parentOffset && g.$from.marks();
    if (e.split(l.pos, 2, m).scrollIntoView(), !C || !r)
      return !0;
    const R = C.filter((E) => w.includes(E.type.name));
    e.ensureMarks(R);
  }
  return !0;
}, oi = (n, e) => {
  const t = xo((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const s = n.doc.nodeAt(r);
  return t.node.type === (s == null ? void 0 : s.type) && bt(n.doc, t.pos) && n.join(t.pos), !0;
}, li = (n, e) => {
  const t = xo((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const s = n.doc.nodeAt(r);
  return t.node.type === (s == null ? void 0 : s.type) && bt(n.doc, r) && n.join(r), !0;
}, zm = (n, e, t, r = {}) => ({ editor: s, tr: i, state: o, dispatch: l, chain: a, commands: c, can: d }) => {
  const { extensions: u, splittableMarks: h } = s.extensionManager, f = K(n, o.schema), p = K(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: w } = m, C = y.blockRange(w), R = g || m.$to.parentOffset && m.$from.marks();
  if (!C)
    return !1;
  const E = xo((M) => Vl(M.type.name, u))(m);
  if (C.depth >= 1 && E && C.depth - E.depth <= 1) {
    if (E.node.type === f)
      return c.liftListItem(p);
    if (Vl(E.node.type.name, u) && f.validContent(E.node.content) && l)
      return a().command(() => (i.setNodeMarkup(E.pos, f), !0)).command(() => oi(i, f)).command(() => li(i, f)).run();
  }
  return !t || !R || !l ? a().command(() => d().wrapInList(f, r) ? !0 : c.clearNodes()).wrapInList(f, r).command(() => oi(i, f)).command(() => li(i, f)).run() : a().command(() => {
    const M = d().wrapInList(f, r), I = R.filter((J) => h.includes(J.type.name));
    return i.ensureMarks(I), M ? !0 : c.clearNodes();
  }).wrapInList(f, r).command(() => oi(i, f)).command(() => li(i, f)).run();
}, Hm = (n, e = {}, t = {}) => ({ state: r, commands: s }) => {
  const { extendEmptyMarkRange: i = !1 } = t, o = kt(n, r.schema);
  return Hi(r, o, e) ? s.unsetMark(o, { extendEmptyMarkRange: i }) : s.setMark(o, e);
}, Fm = (n, e, t = {}) => ({ state: r, commands: s }) => {
  const i = K(n, r.schema), o = K(e, r.schema);
  return Vn(r, i, t) ? s.setNode(o) : s.setNode(i, t);
}, Vm = (n, e = {}) => ({ state: t, commands: r }) => {
  const s = K(n, t.schema);
  return Vn(t, s, e) ? r.lift(s) : r.wrapIn(s, e);
}, _m = () => ({ state: n, dispatch: e }) => {
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
}, jm = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: s } = t;
  return r || e && s.forEach((i) => {
    n.removeMark(i.$from.pos, i.$to.pos);
  }), !0;
}, Wm = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  var i;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = kt(n, r.schema), { $from: c, empty: d, ranges: u } = l;
  if (!s)
    return !0;
  if (d && o) {
    let { from: h, to: f } = l;
    const p = (i = c.marks().find((g) => g.type === a)) === null || i === void 0 ? void 0 : i.attrs, m = wo(c, a, p);
    m && (h = m.from, f = m.to), t.removeMark(h, f, a);
  } else
    u.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, Um = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = Ps(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (i = K(n, r.schema)), l === "mark" && (o = kt(n, r.schema)), s && t.selection.ranges.forEach((a) => {
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
}, Km = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = K(n, t.schema);
  return ip(s, e)(t, r);
}, Jm = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = K(n, t.schema);
  return op(s, e)(t, r);
};
var qm = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Ep,
  clearContent: Op,
  clearNodes: Np,
  command: Rp,
  createParagraphNear: Dp,
  cut: Ip,
  deleteCurrentNode: Lp,
  deleteNode: Pp,
  deleteRange: $p,
  deleteSelection: Bp,
  enter: zp,
  exitCode: Hp,
  extendMarkRange: Vp,
  first: _p,
  focus: jp,
  forEach: Wp,
  insertContent: Up,
  insertContentAt: qp,
  joinUp: Gp,
  joinDown: Yp,
  joinBackward: Xp,
  joinForward: Qp,
  joinItemBackward: Zp,
  joinItemForward: em,
  joinTextblockBackward: tm,
  joinTextblockForward: nm,
  keyboardShortcut: sm,
  lift: im,
  liftEmptyBlock: om,
  liftListItem: lm,
  newlineInCode: am,
  resetAttributes: cm,
  scrollIntoView: dm,
  selectAll: um,
  selectNodeBackward: hm,
  selectNodeForward: fm,
  selectParentNode: pm,
  selectTextblockEnd: mm,
  selectTextblockStart: gm,
  setContent: ym,
  setMark: Nm,
  setMeta: Rm,
  setNode: Dm,
  setNodeSelection: Im,
  setTextSelection: Lm,
  sinkListItem: Pm,
  splitBlock: $m,
  splitListItem: Bm,
  toggleList: zm,
  toggleMark: Hm,
  toggleNode: Fm,
  toggleWrap: Vm,
  undoInputRule: _m,
  unsetAllMarks: jm,
  unsetMark: Wm,
  updateAttributes: Um,
  wrapIn: Km,
  wrapInList: Jm
});
const Gm = pe.create({
  name: "commands",
  addCommands() {
    return {
      ...qm
    };
  }
}), Ym = pe.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new X({
        key: new ue("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Xm = pe.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new X({
        key: new ue("focusEvents"),
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
}), Qm = pe.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: d, $anchor: u } = a, { pos: h, parent: f } = u, p = u.parent.isTextblock && h > 0 ? l.doc.resolve(h - 1) : u, m = p.parent.type.spec.isolating, g = u.pos - u.parentOffset, y = m && p.parent.childCount === 1 ? g === u.pos : A.atStart(c).from === h;
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
    return ko() || td() ? i : s;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new X({
        key: new ue("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((p) => p.docChanged) && !e.doc.eq(t.doc)))
            return;
          const { empty: s, from: i, to: o } = e.selection, l = A.atStart(e.doc).from, a = A.atEnd(e.doc).to;
          if (s || !(i === l && o === a) || !(t.doc.textBetween(0, t.doc.content.size, " ", " ").length === 0))
            return;
          const u = t.tr, h = Ns({
            state: t,
            transaction: u
          }), { commands: f } = new Rs({
            editor: this.editor,
            state: h
          });
          if (f.clearNodes(), !!u.steps.length)
            return u;
        }
      })
    ];
  }
}), Zm = pe.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new X({
        key: new ue("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class Ct {
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
    return new Ct(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new Ct(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new Ct(e, this.editor);
  }
  get children() {
    const e = [];
    return this.node.content.forEach((t, r) => {
      const s = t.isBlock && !t.isTextblock, i = this.pos + r + 1, o = this.resolvedPos.doc.resolve(i);
      if (!s && o.depth <= this.depth)
        return;
      const l = new Ct(o, this.editor, s, s ? t : null);
      s && (l.actualDepth = this.depth + 1), e.push(new Ct(o, this.editor, s, s ? t : null));
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
const eg = `.ProseMirror {
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
function tg(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const s = document.createElement("style");
  return e && s.setAttribute("nonce", e), s.setAttribute("data-tiptap-style", ""), s.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(s), s;
}
class ng extends hp {
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
    this.options.injectCSS && document && (this.css = tg(eg, this.options.injectNonce));
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
      Ym,
      Ap.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) === null || e === void 0 ? void 0 : e.clipboardTextSerializer) === null || t === void 0 ? void 0 : t.blockSeparator
      }),
      Gm,
      Xm,
      Qm,
      Zm
    ] : [], ...this.options.extensions].filter((i) => ["extension", "node", "mark"].includes(i == null ? void 0 : i.type));
    this.extensionManager = new Xt(s, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new Rs({
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
    this.view = new Rf(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: Yt.create({
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
    return Am(this.state, r, s);
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
    return xm(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return Sm(this.state.doc, {
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
    return Em(this.state.doc);
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
    return new Ct(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}
function dn(n) {
  return new Is({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = O(n.getAttributes, void 0, r);
      if (s === !1 || s === null)
        return null;
      const { tr: i } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = t.from + l.indexOf(o), d = c + o.length;
        if (So(t.from, t.to, e.doc).filter((f) => f.mark.type.excluded.find((m) => m === n.type && m !== f.mark.type)).filter((f) => f.to > c).length)
          return null;
        d < t.to && i.delete(d, t.to), c > t.from && i.delete(t.from + a, c);
        const h = t.from + a + o.length;
        i.addMark(t.from + a, h, n.type.create(s || {})), i.removeStoredMark(n.type);
      }
    }
  });
}
function rg(n) {
  return new Is({
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
function Fi(n) {
  return new Is({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = e.doc.resolve(t.from), i = O(n.getAttributes, void 0, r) || {};
      if (!s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, i);
    }
  });
}
function _n(n) {
  return new Is({
    find: n.find,
    handler: ({ state: e, range: t, match: r, chain: s }) => {
      const i = O(n.getAttributes, void 0, r) || {}, o = e.tr.delete(t.from, t.to), a = o.doc.resolve(t.from).blockRange(), c = a && ro(a, n.type, i);
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
      d && d.type === n.type && bt(o.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, d)) && o.join(t.from - 1);
    }
  });
}
class Se {
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
    return new Se(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = Ls(this.options, e), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Se({ ...this.config, ...e });
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
let Q = class Vi {
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
    return new Vi(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = Ls(this.options, e), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Vi({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = O(S(t, "addOptions", {
      name: t.name
    })), t.storage = O(S(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
};
function zt(n) {
  return new kp({
    find: n.find,
    handler: ({ state: e, range: t, match: r, pasteEvent: s }) => {
      const i = O(n.getAttributes, void 0, r, s);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = t.to;
      if (l) {
        const d = a.search(/\S/), u = t.from + a.indexOf(l), h = u + l.length;
        if (So(t.from, t.to, e.doc).filter((p) => p.mark.type.excluded.find((g) => g === n.type && g !== p.mark.type)).filter((p) => p.to > u).length)
          return null;
        h < t.to && o.delete(h, t.to), u > t.from && o.delete(t.from + d, u), c = t.from + d + l.length, o.addMark(t.from + d, c, n.type.create(i || {})), o.removeStoredMark(n.type);
      }
    }
  });
}
const sg = /^\s*>\s$/, ig = Q.create({
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
      _n({
        find: sg,
        type: this.type
      })
    ];
  }
}), og = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, lg = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, ag = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, cg = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, dg = Se.create({
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
      dn({
        find: og,
        type: this.type
      }),
      dn({
        find: ag,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      zt({
        find: lg,
        type: this.type
      }),
      zt({
        find: cg,
        type: this.type
      })
    ];
  }
}), ug = Q.create({
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
}), jl = Se.create({
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
        const t = $s(n, this.type);
        return Object.entries(t).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), Wl = /^\s*([-+*])\s$/, hg = Q.create({
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
      toggleBulletList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(ug.name, this.editor.getAttributes(jl.name)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let n = _n({
      find: Wl,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = _n({
      find: Wl,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(jl.name),
      editor: this.editor
    })), [
      n
    ];
  }
}), fg = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/, pg = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g, mg = Se.create({
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
      dn({
        find: fg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      zt({
        find: pg,
        type: this.type
      })
    ];
  }
}), gg = /^```([a-z]+)?[\s\n]$/, yg = /^~~~([a-z]+)?[\s\n]$/, bg = Q.create({
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
      Fi({
        find: gg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      Fi({
        find: yg,
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
        key: new ue("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (n, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), s = r ? JSON.parse(r) : void 0, i = s == null ? void 0 : s.mode;
            if (!t || !i)
              return !1;
            const { tr: o } = n.state;
            return n.state.selection.from === n.state.doc.nodeSize - (1 + n.state.selection.$to.depth * 2) ? o.insert(n.state.selection.from - 1, this.type.create({ language: i })) : o.replaceSelectionWith(this.type.create({ language: i })), o.setSelection(T.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(t.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), n.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), wg = Q.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function kg(n = {}) {
  return new X({
    view(e) {
      return new xg(e, n);
    }
  });
}
class xg {
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
const Sg = pe.create({
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
      kg(this.options)
    ];
  }
});
class H extends A {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return H.valid(r) ? new H(r) : A.near(r);
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
    return new Co(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !Cg(e) || !Mg(e))
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
          if (i.isAtom && !i.isText && !v.isSelectable(i)) {
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
A.jsonID("gapcursor", H);
class Co {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new Co(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return H.valid(t) ? new H(t) : A.near(t);
  }
}
function Cg(n) {
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
function Mg(n) {
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
function vg() {
  return new X({
    props: {
      decorations: Og,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && H.valid(t) ? new H(t) : null;
      },
      handleClick: Ag,
      handleKeyDown: Tg,
      handleDOMEvents: { beforeinput: Eg }
    }
  });
}
const Tg = mo({
  ArrowLeft: dr("horiz", -1),
  ArrowRight: dr("horiz", 1),
  ArrowUp: dr("vert", -1),
  ArrowDown: dr("vert", 1)
});
function dr(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, s, i) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof T) {
      if (!i.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = H.findGapCursorFrom(l, e, a);
    return c ? (s && s(r.tr.setSelection(new H(c))), !0) : !1;
  };
}
function Ag(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!H.valid(r))
    return !1;
  let s = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return s && s.inside > -1 && v.isSelectable(n.state.doc.nodeAt(s.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new H(r))), !0);
}
function Eg(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof H))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let s = b.empty;
  for (let o = r.length - 1; o >= 0; o--)
    s = b.from(r[o].createAndFill(null, s));
  let i = n.state.tr.replace(t.pos, t.pos, new x(s, 0, 0));
  return i.setSelection(T.near(i.doc.resolve(t.pos + 1))), n.dispatch(i), !1;
}
function Og(n) {
  if (!(n.selection instanceof H))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", z.create(n.doc, [ce.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const Ng = pe.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      vg()
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
}), Rg = Q.create({
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
}), Dg = Q.create({
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
    return this.options.levels.map((n) => Fi({
      find: new RegExp(`^(#{1,${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
});
var jr = 200, U = function() {
};
U.prototype.append = function(e) {
  return e.length ? (e = U.from(e), !this.length && e || e.length < jr && this.leafAppend(e) || this.length < jr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
U.prototype.prepend = function(e) {
  return e.length ? U.from(e).append(this) : this;
};
U.prototype.appendInner = function(e) {
  return new Ig(this, e);
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
    if (this.length + s.length <= jr)
      return new e(this.values.concat(s.flatten()));
  }, e.prototype.leafPrepend = function(s) {
    if (this.length + s.length <= jr)
      return new e(s.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(U);
U.empty = new id([]);
var Ig = /* @__PURE__ */ function(n) {
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
const Lg = 500;
class Me {
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
        d.push(new De(u.map));
        let f = u.step.map(s.slice(i)), p;
        f && o.maybeStep(f).doc && (p = o.mapping.maps[o.mapping.maps.length - 1], c.push(new De(p, void 0, void 0, c.length + d.length))), i--, p && s.appendMap(p, i);
      } else
        o.maybeStep(u.step);
      if (u.selection)
        return l = s ? u.selection.map(s.slice(i)) : u.selection, a = new Me(this.items.slice(0, r).append(d.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, s) {
    let i = [], o = this.eventCount, l = this.items, a = !s && l.length ? l.get(l.length - 1) : null;
    for (let d = 0; d < e.steps.length; d++) {
      let u = e.steps[d].invert(e.docs[d]), h = new De(e.mapping.maps[d], u, t), f;
      (f = a && a.merge(h)) && (h = f, d ? i.pop() : l = l.slice(0, l.length - 1)), i.push(h), t && (o++, t = void 0), s || (a = h);
    }
    let c = o - r.depth;
    return c > $g && (l = Pg(l, c), o -= c), new Me(l.append(i), o);
  }
  remapping(e, t) {
    let r = new Qt();
    return this.items.forEach((s, i) => {
      let o = s.mirrorOffset != null && i - s.mirrorOffset >= e ? r.maps.length - s.mirrorOffset : void 0;
      r.appendMap(s.map, o);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Me(this.items.append(e.map((t) => new De(t))), this.eventCount);
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
        g && l++, r.push(new De(p, m, g));
      } else
        r.push(new De(p));
    }, s);
    let c = [];
    for (let h = t; h < o; h++)
      c.push(new De(i.maps[h]));
    let d = this.items.slice(0, s).append(c).append(r), u = new Me(d, l);
    return u.emptyItemCount() > Lg && (u = u.compress(this.items.length - r.length)), u;
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
          let u = new De(c.invert(), a, d), h, f = s.length - 1;
          (h = s.length && s[f].merge(u)) ? s[f] = h : s.push(u);
        }
      } else o.map && r--;
    }, this.items.length, 0), new Me(U.from(s.reverse()), i);
  }
}
Me.empty = new Me(U.empty, 0);
function Pg(n, e) {
  let t;
  return n.forEach((r, s) => {
    if (r.selection && e-- == 0)
      return t = s, !1;
  }), n.slice(t);
}
class De {
  constructor(e, t, r, s) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = s;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new De(t.getMap().invert(), t, this.selection);
    }
  }
}
class tt {
  constructor(e, t, r, s, i) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = s, this.prevComposition = i;
  }
}
const $g = 20;
function Bg(n, e, t, r) {
  let s = t.getMeta(Lt), i;
  if (s)
    return s.historyState;
  t.getMeta(Fg) && (n = new tt(n.done, n.undone, null, 0, -1));
  let o = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (o && o.getMeta(Lt))
    return o.getMeta(Lt).redo ? new tt(n.done.addTransform(t, void 0, r, Sr(e)), n.undone, Ul(t.mapping.maps[t.steps.length - 1]), n.prevTime, n.prevComposition) : new tt(n.done, n.undone.addTransform(t, void 0, r, Sr(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), a = n.prevTime == 0 || !o && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !zg(t, n.prevRanges)), c = o ? ai(n.prevRanges, t.mapping) : Ul(t.mapping.maps[t.steps.length - 1]);
    return new tt(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, Sr(e)), Me.empty, c, t.time, l ?? n.prevComposition);
  } else return (i = t.getMeta("rebased")) ? new tt(n.done.rebased(t, i), n.undone.rebased(t, i), ai(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new tt(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), ai(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function zg(n, e) {
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
function Ul(n) {
  let e = [];
  return n.forEach((t, r, s, i) => e.push(s, i)), e;
}
function ai(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let s = e.map(n[r], 1), i = e.map(n[r + 1], -1);
    s <= i && t.push(s, i);
  }
  return t;
}
function Hg(n, e, t) {
  let r = Sr(e), s = Lt.get(e).spec.config, i = (t ? n.undone : n.done).popEvent(e, r);
  if (!i)
    return null;
  let o = i.selection.resolve(i.transform.doc), l = (t ? n.done : n.undone).addTransform(i.transform, e.selection.getBookmark(), s, r), a = new tt(t ? l : i.remaining, t ? i.remaining : l, null, 0, -1);
  return i.transform.setSelection(o).setMeta(Lt, { redo: t, historyState: a });
}
let ci = !1, Kl = null;
function Sr(n) {
  let e = n.plugins;
  if (Kl != e) {
    ci = !1, Kl = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        ci = !0;
        break;
      }
  }
  return ci;
}
const Lt = new ue("history"), Fg = new ue("closeHistory");
function Vg(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new X({
    key: Lt,
    state: {
      init() {
        return new tt(Me.empty, Me.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return Bg(t, r, e, n);
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
    let s = Lt.getState(t);
    if (!s || (n ? s.undone : s.done).eventCount == 0)
      return !1;
    if (r) {
      let i = Hg(s, t, n);
      i && r(e ? i.scrollIntoView() : i);
    }
    return !0;
  };
}
const ld = od(!1, !0), ad = od(!0, !0), _g = pe.create({
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
      Vg(this.options)
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
}), jg = Q.create({
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
              l.nodeAfter.isTextblock ? s.setSelection(T.create(s.doc, l.pos + 1)) : l.nodeAfter.isBlock ? s.setSelection(v.create(s.doc, l.pos)) : s.setSelection(T.create(s.doc, l.pos));
            else {
              const c = (o = l.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (s.insert(a, c), s.setSelection(T.create(s.doc, a + 1)));
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
      rg({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), Wg = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, Ug = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, Kg = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, Jg = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, qg = Se.create({
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
      dn({
        find: Wg,
        type: this.type
      }),
      dn({
        find: Kg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      zt({
        find: Ug,
        type: this.type
      }),
      zt({
        find: Jg,
        type: this.type
      })
    ];
  }
}), Gg = Q.create({
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
}), Yg = Q.create({
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
}), Jl = Se.create({
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
        const t = $s(n, this.type);
        return Object.entries(t).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), ql = /^(\d+)\.\s$/, Xg = Q.create({
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
      toggleOrderedList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Yg.name, this.editor.getAttributes(Jl.name)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let n = _n({
      find: ql,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = _n({
      find: ql,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(Jl.name) }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1],
      editor: this.editor
    })), [
      n
    ];
  }
}), Qg = Q.create({
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
}), Zg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, e0 = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, t0 = Se.create({
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
      dn({
        find: Zg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      zt({
        find: e0,
        type: this.type
      })
    ];
  }
}), n0 = Q.create({
  name: "text",
  group: "inline"
}), r0 = pe.create({
  name: "starterKit",
  addExtensions() {
    var n, e, t, r, s, i, o, l, a, c, d, u, h, f, p, m, g, y;
    const w = [];
    return this.options.blockquote !== !1 && w.push(ig.configure((n = this.options) === null || n === void 0 ? void 0 : n.blockquote)), this.options.bold !== !1 && w.push(dg.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && w.push(hg.configure((t = this.options) === null || t === void 0 ? void 0 : t.bulletList)), this.options.code !== !1 && w.push(mg.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && w.push(bg.configure((s = this.options) === null || s === void 0 ? void 0 : s.codeBlock)), this.options.document !== !1 && w.push(wg.configure((i = this.options) === null || i === void 0 ? void 0 : i.document)), this.options.dropcursor !== !1 && w.push(Sg.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && w.push(Ng.configure((l = this.options) === null || l === void 0 ? void 0 : l.gapcursor)), this.options.hardBreak !== !1 && w.push(Rg.configure((a = this.options) === null || a === void 0 ? void 0 : a.hardBreak)), this.options.heading !== !1 && w.push(Dg.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && w.push(_g.configure((d = this.options) === null || d === void 0 ? void 0 : d.history)), this.options.horizontalRule !== !1 && w.push(jg.configure((u = this.options) === null || u === void 0 ? void 0 : u.horizontalRule)), this.options.italic !== !1 && w.push(qg.configure((h = this.options) === null || h === void 0 ? void 0 : h.italic)), this.options.listItem !== !1 && w.push(Gg.configure((f = this.options) === null || f === void 0 ? void 0 : f.listItem)), this.options.orderedList !== !1 && w.push(Xg.configure((p = this.options) === null || p === void 0 ? void 0 : p.orderedList)), this.options.paragraph !== !1 && w.push(Qg.configure((m = this.options) === null || m === void 0 ? void 0 : m.paragraph)), this.options.strike !== !1 && w.push(t0.configure((g = this.options) === null || g === void 0 ? void 0 : g.strike)), this.options.text !== !1 && w.push(n0.configure((y = this.options) === null || y === void 0 ? void 0 : y.text)), w;
  }
}), le = (...n) => n.join(" "), s0 = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", i0 = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", un = (n, e) => {
  for (const t in e)
    n[t] = e[t];
  return n;
}, _i = "numeric", ji = "ascii", Wi = "alpha", Cr = "asciinumeric", ur = "alphanumeric", Ui = "domain", cd = "emoji", o0 = "scheme", l0 = "slashscheme", Gl = "whitespace";
function a0(n, e) {
  return n in e || (e[n] = []), e[n];
}
function At(n, e, t) {
  e[_i] && (e[Cr] = !0, e[ur] = !0), e[ji] && (e[Cr] = !0, e[Wi] = !0), e[Cr] && (e[ur] = !0), e[Wi] && (e[ur] = !0), e[ur] && (e[Ui] = !0), e[cd] && (e[Ui] = !0);
  for (const r in e) {
    const s = a0(r, t);
    s.indexOf(n) < 0 && s.push(n);
  }
}
function c0(n, e) {
  const t = {};
  for (const r in e)
    e[r].indexOf(n) >= 0 && (t[r] = !0);
  return t;
}
function ae(n) {
  n === void 0 && (n = null), this.j = {}, this.jr = [], this.jd = null, this.t = n;
}
ae.groups = {};
ae.prototype = {
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
    r = r || ae.groups;
    let s;
    return e && e.j ? s = e : (s = new ae(e), t && r && At(e, t, r)), this.jr.push([n, s]), s;
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
    r = r || ae.groups;
    const s = this;
    if (e && e.j)
      return s.j[n] = e, e;
    const i = e;
    let o, l = s.go(n);
    if (l ? (o = new ae(), un(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new ae(), i) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = un(c0(o.t, r), t);
          At(i, a, r);
        } else t && At(i, t, r);
      o.t = i;
    }
    return s.j[n] = o, o;
  }
};
const N = (n, e, t, r, s) => n.ta(e, t, r, s), ge = (n, e, t, r, s) => n.tr(e, t, r, s), Yl = (n, e, t, r, s) => n.ts(e, t, r, s), k = (n, e, t, r, s) => n.tt(e, t, r, s), Ke = "WORD", Ki = "UWORD", jn = "LOCALHOST", Ji = "TLD", qi = "UTLD", Mr = "SCHEME", qt = "SLASH_SCHEME", Mo = "NUM", dd = "WS", vo = "NL", En = "OPENBRACE", On = "CLOSEBRACE", Wr = "OPENBRACKET", Ur = "CLOSEBRACKET", Kr = "OPENPAREN", Jr = "CLOSEPAREN", qr = "OPENANGLEBRACKET", Gr = "CLOSEANGLEBRACKET", Yr = "FULLWIDTHLEFTPAREN", Xr = "FULLWIDTHRIGHTPAREN", Qr = "LEFTCORNERBRACKET", Zr = "RIGHTCORNERBRACKET", es = "LEFTWHITECORNERBRACKET", ts = "RIGHTWHITECORNERBRACKET", ns = "FULLWIDTHLESSTHAN", rs = "FULLWIDTHGREATERTHAN", ss = "AMPERSAND", is = "APOSTROPHE", ls = "ASTERISK", nt = "AT", as = "BACKSLASH", cs = "BACKTICK", ds = "CARET", st = "COLON", To = "COMMA", us = "DOLLAR", Ie = "DOT", hs = "EQUALS", Ao = "EXCLAMATION", Le = "HYPHEN", fs = "PERCENT", ps = "PIPE", ms = "PLUS", gs = "POUND", ys = "QUERY", Eo = "QUOTE", Oo = "SEMI", Pe = "SLASH", Nn = "TILDE", bs = "UNDERSCORE", ud = "EMOJI", ws = "SYM";
var hd = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: Ke,
  UWORD: Ki,
  LOCALHOST: jn,
  TLD: Ji,
  UTLD: qi,
  SCHEME: Mr,
  SLASH_SCHEME: qt,
  NUM: Mo,
  WS: dd,
  NL: vo,
  OPENBRACE: En,
  CLOSEBRACE: On,
  OPENBRACKET: Wr,
  CLOSEBRACKET: Ur,
  OPENPAREN: Kr,
  CLOSEPAREN: Jr,
  OPENANGLEBRACKET: qr,
  CLOSEANGLEBRACKET: Gr,
  FULLWIDTHLEFTPAREN: Yr,
  FULLWIDTHRIGHTPAREN: Xr,
  LEFTCORNERBRACKET: Qr,
  RIGHTCORNERBRACKET: Zr,
  LEFTWHITECORNERBRACKET: es,
  RIGHTWHITECORNERBRACKET: ts,
  FULLWIDTHLESSTHAN: ns,
  FULLWIDTHGREATERTHAN: rs,
  AMPERSAND: ss,
  APOSTROPHE: is,
  ASTERISK: ls,
  AT: nt,
  BACKSLASH: as,
  BACKTICK: cs,
  CARET: ds,
  COLON: st,
  COMMA: To,
  DOLLAR: us,
  DOT: Ie,
  EQUALS: hs,
  EXCLAMATION: Ao,
  HYPHEN: Le,
  PERCENT: fs,
  PIPE: ps,
  PLUS: ms,
  POUND: gs,
  QUERY: ys,
  QUOTE: Eo,
  SEMI: Oo,
  SLASH: Pe,
  TILDE: Nn,
  UNDERSCORE: bs,
  EMOJI: ud,
  SYM: ws
});
const Ut = /[a-z]/, di = new RegExp("\\p{L}", "u"), ui = new RegExp("\\p{Emoji}", "u"), hi = /\d/, Xl = /\s/, Ql = `
`, d0 = "️", u0 = "‍";
let hr = null, fr = null;
function h0(n) {
  n === void 0 && (n = []);
  const e = {};
  ae.groups = e;
  const t = new ae();
  hr == null && (hr = Zl(s0)), fr == null && (fr = Zl(i0)), k(t, "'", is), k(t, "{", En), k(t, "}", On), k(t, "[", Wr), k(t, "]", Ur), k(t, "(", Kr), k(t, ")", Jr), k(t, "<", qr), k(t, ">", Gr), k(t, "（", Yr), k(t, "）", Xr), k(t, "「", Qr), k(t, "」", Zr), k(t, "『", es), k(t, "』", ts), k(t, "＜", ns), k(t, "＞", rs), k(t, "&", ss), k(t, "*", ls), k(t, "@", nt), k(t, "`", cs), k(t, "^", ds), k(t, ":", st), k(t, ",", To), k(t, "$", us), k(t, ".", Ie), k(t, "=", hs), k(t, "!", Ao), k(t, "-", Le), k(t, "%", fs), k(t, "|", ps), k(t, "+", ms), k(t, "#", gs), k(t, "?", ys), k(t, '"', Eo), k(t, "/", Pe), k(t, ";", Oo), k(t, "~", Nn), k(t, "_", bs), k(t, "\\", as);
  const r = ge(t, hi, Mo, {
    [_i]: !0
  });
  ge(r, hi, r);
  const s = ge(t, Ut, Ke, {
    [ji]: !0
  });
  ge(s, Ut, s);
  const i = ge(t, di, Ki, {
    [Wi]: !0
  });
  ge(i, Ut), ge(i, di, i);
  const o = ge(t, Xl, dd, {
    [Gl]: !0
  });
  k(t, Ql, vo, {
    [Gl]: !0
  }), k(o, Ql), ge(o, Xl, o);
  const l = ge(t, ui, ud, {
    [cd]: !0
  });
  ge(l, ui, l), k(l, d0, l);
  const a = k(l, u0);
  ge(a, ui, l);
  const c = [[Ut, s]], d = [[Ut, null], [di, i]];
  for (let u = 0; u < hr.length; u++)
    Qe(t, hr[u], Ji, Ke, c);
  for (let u = 0; u < fr.length; u++)
    Qe(t, fr[u], qi, Ki, d);
  At(Ji, {
    tld: !0,
    ascii: !0
  }, e), At(qi, {
    utld: !0,
    alpha: !0
  }, e), Qe(t, "file", Mr, Ke, c), Qe(t, "mailto", Mr, Ke, c), Qe(t, "http", qt, Ke, c), Qe(t, "https", qt, Ke, c), Qe(t, "ftp", qt, Ke, c), Qe(t, "ftps", qt, Ke, c), At(Mr, {
    scheme: !0,
    ascii: !0
  }, e), At(qt, {
    slashscheme: !0,
    ascii: !0
  }, e), n = n.sort((u, h) => u[0] > h[0] ? 1 : -1);
  for (let u = 0; u < n.length; u++) {
    const h = n[u][0], p = n[u][1] ? {
      [o0]: !0
    } : {
      [l0]: !0
    };
    h.indexOf("-") >= 0 ? p[Ui] = !0 : Ut.test(h) ? hi.test(h) ? p[Cr] = !0 : p[ji] = !0 : p[_i] = !0, Yl(t, h, h, p);
  }
  return Yl(t, "localhost", jn, {
    ascii: !0
  }), t.jd = new ae(ws), {
    start: t,
    tokens: un({
      groups: e
    }, hd)
  };
}
function f0(n, e) {
  const t = p0(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = t.length, s = [];
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
function p0(n) {
  const e = [], t = n.length;
  let r = 0;
  for (; r < t; ) {
    let s = n.charCodeAt(r), i, o = s < 55296 || s > 56319 || r + 1 === t || (i = n.charCodeAt(r + 1)) < 56320 || i > 57343 ? n[r] : n.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function Qe(n, e, t, r, s) {
  let i;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    n.j[a] ? i = n.j[a] : (i = new ae(r), i.jr = s.slice(), n.j[a] = i), n = i;
  }
  return i = new ae(t), i.jr = s.slice(), n.j[e[o - 1]] = i, i;
}
function Zl(n) {
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
  format: ea,
  formatHref: ea,
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
function No(n, e) {
  e === void 0 && (e = null);
  let t = un({}, Wn);
  n && (t = un(t, n instanceof No ? n.o : n));
  const r = t.ignoreTags, s = [];
  for (let i = 0; i < r.length; i++)
    s.push(r[i].toUpperCase());
  this.o = t, e && (this.defaultRender = e), this.ignoreTags = s;
}
No.prototype = {
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
function ea(n) {
  return n;
}
function fd(n, e) {
  this.t = "token", this.v = n, this.tk = e;
}
fd.prototype = {
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
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), d && un(o, d), {
      tagName: s,
      attributes: o,
      content: i,
      eventListeners: u
    };
  }
};
function Bs(n, e) {
  class t extends fd {
    constructor(s, i) {
      super(s, i), this.t = n;
    }
  }
  for (const r in e)
    t.prototype[r] = e[r];
  return t.t = n, t;
}
const ta = Bs("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), na = Bs("text"), m0 = Bs("nl"), pr = Bs("url", {
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
    return n.length >= 2 && n[0].t !== jn && n[1].t === st;
  }
}), ye = (n) => new ae(n);
function g0(n) {
  let {
    groups: e
  } = n;
  const t = e.domain.concat([ss, ls, nt, as, cs, ds, us, hs, Le, Mo, fs, ps, ms, gs, Pe, ws, Nn, bs]), r = [is, st, To, Ie, Ao, ys, Eo, Oo, qr, Gr, En, On, Ur, Wr, Kr, Jr, Yr, Xr, Qr, Zr, es, ts, ns, rs], s = [ss, is, ls, as, cs, ds, us, hs, Le, En, On, fs, ps, ms, gs, ys, Pe, ws, Nn, bs], i = ye(), o = k(i, Nn);
  N(o, s, o), N(o, e.domain, o);
  const l = ye(), a = ye(), c = ye();
  N(i, e.domain, l), N(i, e.scheme, a), N(i, e.slashscheme, c), N(l, s, o), N(l, e.domain, l);
  const d = k(l, nt);
  k(o, nt, d), k(a, nt, d), k(c, nt, d);
  const u = k(o, Ie);
  N(u, s, o), N(u, e.domain, o);
  const h = ye();
  N(d, e.domain, h), N(h, e.domain, h);
  const f = k(h, Ie);
  N(f, e.domain, h);
  const p = ye(ta);
  N(f, e.tld, p), N(f, e.utld, p), k(d, jn, p);
  const m = k(h, Le);
  N(m, e.domain, h), N(p, e.domain, h), k(p, Ie, f), k(p, Le, m);
  const g = k(p, st);
  N(g, e.numeric, ta);
  const y = k(l, Le), w = k(l, Ie);
  N(y, e.domain, l), N(w, s, o), N(w, e.domain, l);
  const C = ye(pr);
  N(w, e.tld, C), N(w, e.utld, C), N(C, e.domain, l), N(C, s, o), k(C, Ie, w), k(C, Le, y), k(C, nt, d);
  const R = k(C, st), E = ye(pr);
  N(R, e.numeric, E);
  const M = ye(pr), I = ye();
  N(M, t, M), N(M, r, I), N(I, t, M), N(I, r, I), k(C, Pe, M), k(E, Pe, M);
  const J = k(a, st), D = k(c, st), Ne = k(D, Pe), Xe = k(Ne, Pe);
  N(a, e.domain, l), k(a, Ie, w), k(a, Le, y), N(c, e.domain, l), k(c, Ie, w), k(c, Le, y), N(J, e.domain, M), k(J, Pe, M), N(Xe, e.domain, M), N(Xe, t, M), k(Xe, Pe, M);
  const nr = [
    [En, On],
    // {}
    [Wr, Ur],
    // []
    [Kr, Jr],
    // ()
    [qr, Gr],
    // <>
    [Yr, Xr],
    // （）
    [Qr, Zr],
    // 「」
    [es, ts],
    // 『』
    [ns, rs]
    // ＜＞
  ];
  for (let _s = 0; _s < nr.length; _s++) {
    const [$o, js] = nr[_s], rr = k(M, $o);
    k(I, $o, rr), k(rr, js, M);
    const _t = ye(pr);
    N(rr, t, _t);
    const bn = ye();
    N(rr, r), N(_t, t, _t), N(_t, r, bn), N(bn, t, _t), N(bn, r, bn), k(_t, js, M), k(bn, js, M);
  }
  return k(i, jn, C), k(i, vo, m0), {
    start: i,
    tokens: hd
  };
}
function y0(n, e, t) {
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
      o.length > 0 && (i.push(fi(na, e, o)), o = []), s -= h, d -= h;
      const f = u.t, p = t.slice(s - d, s);
      i.push(fi(f, e, p));
    }
  }
  return o.length > 0 && i.push(fi(na, e, o)), i;
}
function fi(n, e, t) {
  const r = t[0].s, s = t[t.length - 1].e, i = e.slice(r, s);
  return new n(i, t);
}
const b0 = typeof console < "u" && console && console.warn || (() => {
}), w0 = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", B = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function k0() {
  ae.groups = {}, B.scanner = null, B.parser = null, B.tokenQueue = [], B.pluginQueue = [], B.customSchemes = [], B.initialized = !1;
}
function ra(n, e) {
  if (e === void 0 && (e = !1), B.initialized && b0(`linkifyjs: already initialized - will not register custom scheme "${n}" ${w0}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(n))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  B.customSchemes.push([n, e]);
}
function x0() {
  B.scanner = h0(B.customSchemes);
  for (let n = 0; n < B.tokenQueue.length; n++)
    B.tokenQueue[n][1]({
      scanner: B.scanner
    });
  B.parser = g0(B.scanner.tokens);
  for (let n = 0; n < B.pluginQueue.length; n++)
    B.pluginQueue[n][1]({
      scanner: B.scanner,
      parser: B.parser
    });
  B.initialized = !0;
}
function pd(n) {
  return B.initialized || x0(), y0(B.parser.start, n, f0(B.scanner.start, n));
}
function md(n, e, t) {
  if (e === void 0 && (e = null), t === void 0 && (t = null), e && typeof e == "object") {
    if (t)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    t = e, e = null;
  }
  const r = new No(t), s = pd(n), i = [];
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    l.isLink && (!e || l.t === e) && r.check(l) && i.push(l.toFormattedObject(r));
  }
  return i;
}
function S0(n) {
  return n.length === 1 ? n[0].isLink : n.length === 3 && n[1].isLink ? ["()", "[]"].includes(n[0].value + n[2].value) : !1;
}
function C0(n) {
  return new X({
    key: new ue("autolink"),
    appendTransaction: (e, t, r) => {
      const s = e.some((c) => c.docChanged) && !t.doc.eq(r.doc), i = e.some((c) => c.getMeta("preventAutolink"));
      if (!s || i)
        return;
      const { tr: o } = r, l = bm(t.doc, [...e]);
      if (Tm(l).forEach(({ newRange: c }) => {
        const d = km(r.doc, c, (f) => f.isTextblock);
        let u, h;
        if (d.length > 1 ? (u = d[0], h = r.doc.textBetween(u.pos, u.pos + u.node.nodeSize, void 0, " ")) : d.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (u = d[0], h = r.doc.textBetween(u.pos, c.to, void 0, " ")), u && h) {
          const f = h.split(" ").filter((y) => y !== "");
          if (f.length <= 0)
            return !1;
          const p = f[f.length - 1], m = u.pos + h.lastIndexOf(p);
          if (!p)
            return !1;
          const g = pd(p).map((y) => y.toObject());
          if (!S0(g))
            return !1;
          g.filter((y) => y.isLink).map((y) => ({
            ...y,
            from: m + y.start + 1,
            to: m + y.end + 1
          })).filter((y) => r.schema.marks.code ? !r.doc.rangeHasMark(y.from, y.to, r.schema.marks.code) : !0).filter((y) => n.validate ? n.validate(y.value) : !0).forEach((y) => {
            So(y.from, y.to, r.doc).some((w) => w.mark.type === n.type) || o.addMark(y.from, y.to, n.type.create({
              href: y.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function M0(n) {
  return new X({
    key: new ue("handleClickLink"),
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
function v0(n) {
  return new X({
    key: new ue("handlePasteLink"),
    props: {
      handlePaste: (e, t, r) => {
        const { state: s } = e, { selection: i } = s, { empty: o } = i;
        if (o)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = md(l).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : (n.editor.commands.setMark(n.type, {
          href: a.href
        }), !0);
      }
    }
  });
}
const T0 = Se.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((n) => {
      if (typeof n == "string") {
        ra(n);
        return;
      }
      ra(n.scheme, n.optionalSlashes);
    });
  },
  onDestroy() {
    k0();
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
      zt({
        find: (n) => {
          const e = [];
          if (n) {
            const t = md(n).filter((r) => r.isLink);
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
    return this.options.autolink && n.push(C0({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && n.push(M0({
      type: this.type,
      whenNotEditable: this.options.openOnClick === "whenNotEditable"
    })), this.options.linkOnPaste && n.push(v0({
      editor: this.editor,
      type: this.type
    })), n;
  }
});
var Gi, Yi;
if (typeof WeakMap < "u") {
  let n = /* @__PURE__ */ new WeakMap();
  Gi = (e) => n.get(e), Yi = (e, t) => (n.set(e, t), t);
} else {
  const n = [];
  let t = 0;
  Gi = (r) => {
    for (let s = 0; s < n.length; s += 2)
      if (n[s] == r)
        return n[s + 1];
  }, Yi = (r, s) => (t == 10 && (t = 0), n[t++] = r, n[t++] = s);
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
    return Gi(n) || Yi(n, A0(n));
  }
};
function A0(n) {
  if (n.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + n.type.name);
  const e = E0(n), t = n.childCount, r = [];
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
      const m = u.child(p), { colspan: g, rowspan: y, colwidth: w } = m.attrs;
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
        for (let E = 0; E < g; E++) {
          r[R + E] == 0 ? r[R + E] = d : (i || (i = [])).push({
            type: "collision",
            row: c,
            pos: d,
            n: g - E
          });
          const M = w && w[E];
          if (M) {
            const I = (R + E) % e * 2, J = o[I];
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
  return a && O0(l, o, n), l;
}
function E0(n) {
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
function O0(n, e, t) {
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
      u != null && (!a.colwidth || a.colwidth[c] != u) && ((l || (l = N0(a)))[c] = u);
    }
    l && n.problems.unshift({
      type: "colwidth mismatch",
      pos: i,
      colwidth: l
    });
  }
}
function N0(n) {
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
var it = new ue("selectingCells");
function gn(n) {
  for (let e = n.depth - 1; e > 0; e--)
    if (n.node(e).type.spec.tableRole == "row")
      return n.node(0).resolve(n.before(e + 1));
  return null;
}
function R0(n) {
  for (let e = n.depth; e > 0; e--) {
    const t = n.node(e).type.spec.tableRole;
    if (t === "cell" || t === "header_cell")
      return n.node(e);
  }
  return null;
}
function Ee(n) {
  const e = n.selection.$head;
  for (let t = e.depth; t > 0; t--)
    if (e.node(t).type.spec.tableRole == "row")
      return !0;
  return !1;
}
function zs(n) {
  const e = n.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const t = gn(e.$head) || D0(e.$head);
  if (t)
    return t;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function D0(n) {
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
function Xi(n) {
  return n.parent.type.spec.tableRole == "row" && !!n.nodeAfter;
}
function I0(n) {
  return n.node(0).resolve(n.pos + n.nodeAfter.nodeSize);
}
function Ro(n, e) {
  return n.depth == e.depth && n.pos >= e.start(-1) && n.pos <= e.end(-1);
}
function gd(n, e, t) {
  const r = n.node(-1), s = F.get(r), i = n.start(-1), o = s.nextCell(n.pos - i, e, t);
  return o == null ? null : n.node(0).resolve(i + o);
}
function Ht(n, e, t = 1) {
  const r = { ...n, colspan: n.colspan - t };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, t), r.colwidth.some((s) => s > 0) || (r.colwidth = null)), r;
}
function yd(n, e, t = 1) {
  const r = { ...n, colspan: n.colspan + t };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let s = 0; s < t; s++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function L0(n, e, t) {
  const r = ee(e.type.schema).header_cell;
  for (let s = 0; s < n.height; s++)
    if (e.nodeAt(n.map[t + s * n.width]).type != r)
      return !1;
  return !0;
}
var P = class Je extends A {
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
    if (Xi(r) && Xi(s) && Ro(r, s)) {
      const i = this.$anchorCell.node(-1) != r.node(-1);
      return i && this.isRowSelection() ? Je.rowSelection(r, s) : i && this.isColSelection() ? Je.colSelection(r, s) : new Je(r, s);
    }
    return T.between(r, s);
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
          if (m > 0 && (y = Ht(y, 0, m)), g > 0 && (y = Ht(
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
    const i = A.findFrom(
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
    ))), new Je(e, t);
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
    return e instanceof Je && e.$anchorCell.pos == this.$anchorCell.pos && e.$headCell.pos == this.$headCell.pos;
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
    ))), new Je(e, t);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(e, t) {
    return new Je(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    return new Je(e.resolve(t), e.resolve(r));
  }
  getBookmark() {
    return new P0(this.$anchorCell.pos, this.$headCell.pos);
  }
};
P.prototype.visible = !1;
A.jsonID("cell", P);
var P0 = class bd {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new bd(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    const t = e.resolve(this.anchor), r = e.resolve(this.head);
    return t.parent.type.spec.tableRole == "row" && r.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && r.index() < r.parent.childCount && Ro(t, r) ? new P(t, r) : A.near(r, 1);
  }
};
function $0(n) {
  if (!(n.selection instanceof P))
    return null;
  const e = [];
  return n.selection.forEachCell((t, r) => {
    e.push(
      ce.node(r, r + t.nodeSize, { class: "selectedCell" })
    );
  }), z.create(n.doc, e);
}
function B0({ $from: n, $to: e }) {
  if (n.pos == e.pos || n.pos < n.pos - 6)
    return !1;
  let t = n.pos, r = e.pos, s = n.depth;
  for (; s >= 0 && !(n.after(s + 1) < n.end(s)); s--, t++)
    ;
  for (let i = e.depth; i >= 0 && !(e.before(i + 1) > e.start(i)); i--, r--)
    ;
  return t == r && /row|table/.test(n.node(s).type.spec.tableRole);
}
function z0({ $from: n, $to: e }) {
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
function H0(n, e, t) {
  const r = (e || n).selection, s = (e || n).doc;
  let i, o;
  if (r instanceof v && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      i = P.create(s, r.from);
    else if (o == "row") {
      const l = s.resolve(r.from + 1);
      i = P.rowSelection(l, l);
    } else if (!t) {
      const l = F.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      i = P.create(s, a + 1, c);
    }
  } else r instanceof T && B0(r) ? i = T.create(s, r.from) : r instanceof T && z0(r) && (i = T.create(s, r.$from.start(), r.$from.end()));
  return i && (e || (e = n.tr)).setSelection(i), e;
}
var F0 = new ue("fix-tables");
function wd(n, e, t, r) {
  const s = n.childCount, i = e.childCount;
  e:
    for (let o = 0, l = 0; o < i; o++) {
      const a = e.child(o);
      for (let c = l, d = Math.min(s, o + 3); c < d; c++)
        if (n.child(c) == a) {
          l = c + 1, t += a.nodeSize;
          continue e;
        }
      r(a, t), l < s && n.child(l).sameMarkup(a) ? wd(n.child(l), a, t + 1, r) : a.nodesBetween(0, a.content.size, r, t + 1), t += a.nodeSize;
    }
}
function kd(n, e) {
  let t;
  const r = (s, i) => {
    s.type.spec.tableRole == "table" && (t = V0(n, s, i, t));
  };
  return e ? e.doc != n.doc && wd(e.doc, n.doc, 0, r) : n.doc.descendants(r), t;
}
function V0(n, e, t, r) {
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
        Ht(u, u.colspan - c.n, c.n)
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
  return r.setMeta(F0, { fixTables: !0 });
}
function _0(n) {
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
      (d || u) && (c = Qi(
        ee(o).row,
        new x(c, d, u)
      ).content), l.push(c);
    }
  else if (i == "cell" || i == "header_cell")
    l.push(
      t || r ? Qi(
        ee(o).row,
        new x(e, t, r)
      ).content : e
    );
  else
    return null;
  return j0(o, l);
}
function j0(n, e) {
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
function Qi(n, e) {
  const t = n.createAndFill();
  return new so(t).replace(0, t.content.size, e).doc;
}
function W0({ width: n, height: e, rows: t }, r, s) {
  if (n != r) {
    const i = [], o = [];
    for (let l = 0; l < t.length; l++) {
      const a = t[l], c = [];
      for (let d = i[l] || 0, u = 0; d < r; u++) {
        let h = a.child(u % a.childCount);
        d + h.attrs.colspan > r && (h = h.type.createChecked(
          Ht(
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
function U0(n, e, t, r, s, i, o) {
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
function sa(n, e, t, r, s, i, o, l) {
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
function ia(n, e, t, r, s, i, o, l) {
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
        Ht(
          h.attrs,
          o - f,
          h.attrs.colspan - (o - f)
        )
      ), n.insert(
        p + h.nodeSize,
        h.type.createAndFill(
          Ht(h.attrs, 0, o - f)
        )
      ), c += h.attrs.rowspan - 1;
    }
  }
  return a;
}
function oa(n, e, t, r, s) {
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
  U0(u, o, i, t, c, d, h) && f(), sa(u, o, i, t, a, c, l, h) && f(), sa(u, o, i, t, a, c, d, h) && f(), ia(u, o, i, t, l, d, a, h) && f(), ia(u, o, i, t, l, d, c, h) && f();
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
var K0 = mo({
  ArrowLeft: mr("horiz", -1),
  ArrowRight: mr("horiz", 1),
  ArrowUp: mr("vert", -1),
  ArrowDown: mr("vert", 1),
  "Shift-ArrowLeft": gr("horiz", -1),
  "Shift-ArrowRight": gr("horiz", 1),
  "Shift-ArrowUp": gr("vert", -1),
  "Shift-ArrowDown": gr("vert", 1),
  Backspace: yr,
  "Mod-Backspace": yr,
  Delete: yr,
  "Mod-Delete": yr
});
function vr(n, e, t) {
  return t.eq(n.selection) ? !1 : (e && e(n.tr.setSelection(t).scrollIntoView()), !0);
}
function mr(n, e) {
  return (t, r, s) => {
    if (!s)
      return !1;
    const i = t.selection;
    if (i instanceof P)
      return vr(
        t,
        r,
        A.near(i.$headCell, e)
      );
    if (n != "horiz" && !i.empty)
      return !1;
    const o = xd(s, n, e);
    if (o == null)
      return !1;
    if (n == "horiz")
      return vr(
        t,
        r,
        A.near(t.doc.resolve(i.head + e), e)
      );
    {
      const l = t.doc.resolve(o), a = gd(l, n, e);
      let c;
      return a ? c = A.near(a, 1) : e < 0 ? c = A.near(t.doc.resolve(l.before(-1)), -1) : c = A.near(t.doc.resolve(l.after(-1)), 1), vr(t, r, c);
    }
  };
}
function gr(n, e) {
  return (t, r, s) => {
    if (!s)
      return !1;
    const i = t.selection;
    let o;
    if (i instanceof P)
      o = i;
    else {
      const a = xd(s, n, e);
      if (a == null)
        return !1;
      o = new P(t.doc.resolve(a));
    }
    const l = gd(o.$headCell, n, e);
    return l ? vr(
      t,
      r,
      new P(o.$anchorCell, l)
    ) : !1;
  };
}
function yr(n, e) {
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
function J0(n, e) {
  const t = n.state.doc, r = gn(t.resolve(e));
  return r ? (n.dispatch(n.state.tr.setSelection(new P(r))), !0) : !1;
}
function q0(n, e, t) {
  if (!Ee(n.state))
    return !1;
  let r = _0(t);
  const s = n.state.selection;
  if (s instanceof P) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        b.from(
          Qi(ee(n.state.schema).cell, t)
        )
      ]
    });
    const i = s.$anchorCell.node(-1), o = s.$anchorCell.start(-1), l = F.get(i).rectBetween(
      s.$anchorCell.pos - o,
      s.$headCell.pos - o
    );
    return r = W0(r, l.right - l.left, l.bottom - l.top), oa(n.state, n.dispatch, o, l, r), !0;
  } else if (r) {
    const i = zs(n.state), o = i.start(-1);
    return oa(
      n.state,
      n.dispatch,
      o,
      F.get(i.node(-1)).findCell(i.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function G0(n, e) {
  var t;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = la(n, e.target);
  let s;
  if (e.shiftKey && n.state.selection instanceof P)
    i(n.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (s = gn(n.state.selection.$anchor)) != null && ((t = pi(n, e)) == null ? void 0 : t.pos) != s.pos)
    i(s, e), e.preventDefault();
  else if (!r)
    return;
  function i(a, c) {
    let d = pi(n, c);
    const u = it.getState(n.state) == null;
    if (!d || !Ro(a, d))
      if (u)
        d = a;
      else
        return;
    const h = new P(a, d);
    if (u || !n.state.selection.eq(h)) {
      const f = n.state.tr.setSelection(h);
      u && f.setMeta(it, a.pos), n.dispatch(f);
    }
  }
  function o() {
    n.root.removeEventListener("mouseup", o), n.root.removeEventListener("dragstart", o), n.root.removeEventListener("mousemove", l), it.getState(n.state) != null && n.dispatch(n.state.tr.setMeta(it, -1));
  }
  function l(a) {
    const c = a, d = it.getState(n.state);
    let u;
    if (d != null)
      u = n.state.doc.resolve(d);
    else if (la(n, c.target) != r && (u = pi(n, e), !u))
      return o();
    u && i(u, c);
  }
  n.root.addEventListener("mouseup", o), n.root.addEventListener("dragstart", o), n.root.addEventListener("mousemove", l);
}
function xd(n, e, t) {
  if (!(n.state.selection instanceof T))
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
function la(n, e) {
  for (; e && e != n.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function pi(n, e) {
  const t = n.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return t && t ? gn(n.state.doc.resolve(t.pos)) : null;
}
var Y0 = class {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Zi(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, Zi(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function Zi(n, e, t, r, s, i) {
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
var we = new ue(
  "tableColumnResizing"
);
function X0({
  handleWidth: n = 5,
  cellMinWidth: e = 25,
  View: t = Y0,
  lastColumnResizable: r = !0
} = {}) {
  const s = new X({
    key: we,
    state: {
      init(i, o) {
        return s.spec.props.nodeViews[ee(o.schema).table.name] = (l, a) => new t(l, e, a), new Q0(-1, !1);
      },
      apply(i, o) {
        return o.apply(i);
      }
    },
    props: {
      attributes: (i) => {
        const o = we.getState(i);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (i, o) => {
          Z0(
            i,
            o,
            n,
            e,
            r
          );
        },
        mouseleave: (i) => {
          ey(i);
        },
        mousedown: (i, o) => {
          ty(i, o, e);
        }
      },
      decorations: (i) => {
        const o = we.getState(i);
        if (o && o.activeHandle > -1)
          return ly(i, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return s;
}
var Q0 = class Tr {
  constructor(e, t) {
    this.activeHandle = e, this.dragging = t;
  }
  apply(e) {
    const t = this, r = e.getMeta(we);
    if (r && r.setHandle != null)
      return new Tr(r.setHandle, !1);
    if (r && r.setDragging !== void 0)
      return new Tr(t.activeHandle, r.setDragging);
    if (t.activeHandle > -1 && e.docChanged) {
      let s = e.mapping.map(t.activeHandle, -1);
      return Xi(e.doc.resolve(s)) || (s = -1), new Tr(s, t.dragging);
    }
    return t;
  }
};
function Z0(n, e, t, r, s) {
  const i = we.getState(n.state);
  if (i && !i.dragging) {
    const o = ry(e.target);
    let l = -1;
    if (o) {
      const { left: a, right: c } = o.getBoundingClientRect();
      e.clientX - a <= t ? l = aa(n, e, "left", t) : c - e.clientX <= t && (l = aa(n, e, "right", t));
    }
    if (l != i.activeHandle) {
      if (!s && l !== -1) {
        const a = n.state.doc.resolve(l), c = a.node(-1), d = F.get(c), u = a.start(-1);
        if (d.colCount(a.pos - u) + a.nodeAfter.attrs.colspan - 1 == d.width - 1)
          return;
      }
      Sd(n, l);
    }
  }
}
function ey(n) {
  const e = we.getState(n.state);
  e && e.activeHandle > -1 && !e.dragging && Sd(n, -1);
}
function ty(n, e, t) {
  var r;
  const s = (r = n.dom.ownerDocument.defaultView) != null ? r : window, i = we.getState(n.state);
  if (!i || i.activeHandle == -1 || i.dragging)
    return !1;
  const o = n.state.doc.nodeAt(i.activeHandle), l = ny(n, i.activeHandle, o.attrs);
  n.dispatch(
    n.state.tr.setMeta(we, {
      setDragging: { startX: e.clientX, startWidth: l }
    })
  );
  function a(d) {
    s.removeEventListener("mouseup", a), s.removeEventListener("mousemove", c);
    const u = we.getState(n.state);
    u != null && u.dragging && (sy(
      n,
      u.activeHandle,
      ca(u.dragging, d, t)
    ), n.dispatch(
      n.state.tr.setMeta(we, { setDragging: null })
    ));
  }
  function c(d) {
    if (!d.which)
      return a(d);
    const u = we.getState(n.state);
    if (u && u.dragging) {
      const h = ca(u.dragging, d, t);
      iy(n, u.activeHandle, h, t);
    }
  }
  return s.addEventListener("mouseup", a), s.addEventListener("mousemove", c), e.preventDefault(), !0;
}
function ny(n, e, { colspan: t, colwidth: r }) {
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
function ry(n) {
  for (; n && n.nodeName != "TD" && n.nodeName != "TH"; )
    n = n.classList && n.classList.contains("ProseMirror") ? null : n.parentNode;
  return n;
}
function aa(n, e, t, r) {
  const s = t == "right" ? -r : r, i = n.posAtCoords({
    left: e.clientX + s,
    top: e.clientY
  });
  if (!i)
    return -1;
  const { pos: o } = i, l = gn(n.state.doc.resolve(o));
  if (!l)
    return -1;
  if (t == "right")
    return l.pos;
  const a = F.get(l.node(-1)), c = l.start(-1), d = a.map.indexOf(l.pos - c);
  return d % a.width == 0 ? -1 : c + a.map[d - 1];
}
function ca(n, e, t) {
  const r = e.clientX - n.startX;
  return Math.max(t, n.startWidth + r);
}
function Sd(n, e) {
  n.dispatch(
    n.state.tr.setMeta(we, { setHandle: e })
  );
}
function sy(n, e, t) {
  const r = n.state.doc.resolve(e), s = r.node(-1), i = F.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, a = n.state.tr;
  for (let c = 0; c < i.height; c++) {
    const d = c * i.width + l;
    if (c && i.map[d] == i.map[d - i.width])
      continue;
    const u = i.map[d], h = s.nodeAt(u).attrs, f = h.colspan == 1 ? 0 : l - i.colCount(u);
    if (h.colwidth && h.colwidth[f] == t)
      continue;
    const p = h.colwidth ? h.colwidth.slice() : oy(h.colspan);
    p[f] = t, a.setNodeMarkup(o + u, null, { ...h, colwidth: p });
  }
  a.docChanged && n.dispatch(a);
}
function iy(n, e, t, r) {
  const s = n.state.doc.resolve(e), i = s.node(-1), o = s.start(-1), l = F.get(i).colCount(s.pos - o) + s.nodeAfter.attrs.colspan - 1;
  let a = n.domAtPos(s.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; )
    a = a.parentNode;
  a && Zi(
    i,
    a.firstChild,
    a,
    r,
    l,
    t
  );
}
function oy(n) {
  return Array(n).fill(0);
}
function ly(n, e) {
  const t = [], r = n.doc.resolve(e), s = r.node(-1);
  if (!s)
    return z.empty;
  const i = F.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let a = 0; a < i.height; a++) {
    const c = l + a * i.width - 1;
    if ((l == i.width || i.map[c] != i.map[c + 1]) && (a == 0 || i.map[c] != i.map[c - i.width])) {
      const d = i.map[c], u = o + d + s.nodeAt(d).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", t.push(ce.widget(u, h));
    }
  }
  return z.create(n.doc, t);
}
function We(n) {
  const e = n.selection, t = zs(n), r = t.node(-1), s = t.start(-1), i = F.get(r);
  return { ...e instanceof P ? i.rectBetween(
    e.$anchorCell.pos - s,
    e.$headCell.pos - s
  ) : i.findCell(t.pos - s), tableStart: s, map: i, table: r };
}
function Cd(n, { map: e, tableStart: t, table: r }, s) {
  let i = s > 0 ? -1 : 0;
  L0(e, r, s + i) && (i = s == 0 || s == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const l = o * e.width + s;
    if (s > 0 && s < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      n.setNodeMarkup(
        n.mapping.map(t + a),
        null,
        yd(c.attrs, s - e.colCount(a))
      ), o += c.attrs.rowspan - 1;
    } else {
      const a = i == null ? ee(r.type.schema).cell : r.nodeAt(e.map[l + i]).type, c = e.positionAt(o, s, r);
      n.insert(n.mapping.map(t + c), a.createAndFill());
    }
  }
  return n;
}
function ay(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = We(n);
    e(Cd(n.tr, t, t.left));
  }
  return !0;
}
function cy(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = We(n);
    e(Cd(n.tr, t, t.right));
  }
  return !0;
}
function dy(n, { map: e, table: t, tableStart: r }, s) {
  const i = n.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const l = o * e.width + s, a = e.map[l], c = t.nodeAt(a), d = c.attrs;
    if (s > 0 && e.map[l - 1] == a || s < e.width - 1 && e.map[l + 1] == a)
      n.setNodeMarkup(
        n.mapping.slice(i).map(r + a),
        null,
        Ht(d, s - e.colCount(a))
      );
    else {
      const u = n.mapping.slice(i).map(r + a);
      n.delete(u, u + c.nodeSize);
    }
    o += d.rowspan;
  }
}
function uy(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = We(n), r = n.tr;
    if (t.left == 0 && t.right == t.map.width)
      return !1;
    for (let s = t.right - 1; dy(r, t, s), s != t.left; s--) {
      const i = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      t.table = i, t.map = F.get(i);
    }
    e(r);
  }
  return !0;
}
function hy(n, e, t) {
  var r;
  const s = ee(e.type.schema).header_cell;
  for (let i = 0; i < n.width; i++)
    if (((r = e.nodeAt(n.map[i + t * n.width])) == null ? void 0 : r.type) != s)
      return !1;
  return !0;
}
function Md(n, { map: e, tableStart: t, table: r }, s) {
  var i;
  let o = t;
  for (let c = 0; c < s; c++)
    o += r.child(c).nodeSize;
  const l = [];
  let a = s > 0 ? -1 : 0;
  hy(e, r, s + a) && (a = s == 0 || s == e.height ? null : 0);
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
function fy(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = We(n);
    e(Md(n.tr, t, t.top));
  }
  return !0;
}
function py(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = We(n);
    e(Md(n.tr, t, t.bottom));
  }
  return !0;
}
function my(n, { map: e, table: t, tableStart: r }, s) {
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
function gy(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = We(n), r = n.tr;
    if (t.top == 0 && t.bottom == t.map.height)
      return !1;
    for (let s = t.bottom - 1; my(r, t, s), s != t.top; s--) {
      const i = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      t.table = i, t.map = F.get(t.table);
    }
    e(r);
  }
  return !0;
}
function da(n) {
  const e = n.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function yy({ width: n, height: e, map: t }, r) {
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
function ua(n, e) {
  const t = n.selection;
  if (!(t instanceof P) || t.$anchorCell.pos == t.$headCell.pos)
    return !1;
  const r = We(n), { map: s } = r;
  if (yy(s, r))
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
            da(f) || (l = l.append(f.content));
            const p = i.mapping.map(h + r.tableStart);
            i.delete(p, p + f.nodeSize);
          }
      }
    if (a == null || c == null)
      return !0;
    if (i.setNodeMarkup(a + r.tableStart, null, {
      ...yd(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), l.size) {
      const d = a + 1 + c.content.size, u = da(c) ? a + 1 : d;
      i.replaceWith(u + r.tableStart, d + r.tableStart, l);
    }
    i.setSelection(
      new P(i.doc.resolve(a + r.tableStart))
    ), e(i);
  }
  return !0;
}
function ha(n, e) {
  const t = ee(n.schema);
  return by(({ node: r }) => t[r.type.spec.tableRole])(n, e);
}
function by(n) {
  return (e, t) => {
    var r;
    const s = e.selection;
    let i, o;
    if (s instanceof P) {
      if (s.$anchorCell.pos != s.$headCell.pos)
        return !1;
      i = s.$anchorCell.nodeAfter, o = s.$anchorCell.pos;
    } else {
      if (i = R0(s.$from), !i)
        return !1;
      o = (r = gn(s.$from)) == null ? void 0 : r.pos;
    }
    if (i == null || o == null || i.attrs.colspan == 1 && i.attrs.rowspan == 1)
      return !1;
    if (t) {
      let l = i.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = { ...l, rowspan: 1 }), l.colspan > 1 && (l = { ...l, colspan: 1 });
      const d = We(e), u = e.tr;
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
function wy(n, e) {
  return function(t, r) {
    if (!Ee(t))
      return !1;
    const s = zs(t);
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
function ky(n) {
  return function(e, t) {
    if (!Ee(e))
      return !1;
    if (t) {
      const r = ee(e.schema), s = We(e), i = e.tr, o = s.map.cellsInRect(
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
function fa(n, e, t) {
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
function Un(n, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? ky(n) : function(t, r) {
    if (!Ee(t))
      return !1;
    if (r) {
      const s = ee(t.schema), i = We(t), o = t.tr, l = fa("row", i, s), a = fa(
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
Un("row", {
  useDeprecatedLogic: !0
});
Un("column", {
  useDeprecatedLogic: !0
});
var xy = Un("cell", {
  useDeprecatedLogic: !0
});
function Sy(n, e) {
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
function pa(n) {
  return function(e, t) {
    if (!Ee(e))
      return !1;
    const r = Sy(zs(e), n);
    if (r == null)
      return !1;
    if (t) {
      const s = e.doc.resolve(r);
      t(
        e.tr.setSelection(T.between(s, I0(s))).scrollIntoView()
      );
    }
    return !0;
  };
}
function Cy(n, e) {
  const t = n.selection.$anchor;
  for (let r = t.depth; r > 0; r--)
    if (t.node(r).type.spec.tableRole == "table")
      return e && e(
        n.tr.delete(t.before(r), t.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function My({
  allowTableNodeSelection: n = !1
} = {}) {
  return new X({
    key: it,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, t) {
        const r = e.getMeta(it);
        if (r != null)
          return r == -1 ? null : r;
        if (t == null || !e.docChanged)
          return t;
        const { deleted: s, pos: i } = e.mapping.mapResult(t);
        return s ? null : i;
      }
    },
    props: {
      decorations: $0,
      handleDOMEvents: {
        mousedown: G0
      },
      createSelectionBetween(e) {
        return it.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: J0,
      handleKeyDown: K0,
      handlePaste: q0
    },
    appendTransaction(e, t, r) {
      return H0(
        r,
        kd(r, t),
        n
      );
    }
  });
}
function ma(n, e, t, r, s, i) {
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
class vy {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), ma(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, ma(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function Ty(n, e, t, r) {
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
function ga(n, e) {
  return n.createAndFill();
}
function Ay(n) {
  if (n.cached.tableNodeTypes)
    return n.cached.tableNodeTypes;
  const e = {};
  return Object.keys(n.nodes).forEach((t) => {
    const r = n.nodes[t];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), n.cached.tableNodeTypes = e, e;
}
function Ey(n, e, t, r, s) {
  const i = Ay(n), o = [], l = [];
  for (let c = 0; c < t; c += 1) {
    const d = ga(i.cell);
    if (d && l.push(d), r) {
      const u = ga(i.header_cell);
      u && o.push(u);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(i.row.createChecked(null, r && c === 0 ? o : l));
  return i.table.createChecked(null, a);
}
function Oy(n) {
  return n instanceof P;
}
const br = ({ editor: n }) => {
  const { selection: e } = n.state;
  if (!Oy(e))
    return !1;
  let t = 0;
  const r = rd(e.ranges[0].$from, (i) => i.type.name === "table");
  return r == null || r.node.descendants((i) => {
    if (i.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(i.type.name) && (t += 1);
  }), t === e.ranges.length ? (n.commands.deleteTable(), !0) : !1;
}, Ny = Q.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: vy,
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
    const { colgroup: t, tableWidth: r, tableMinWidth: s } = Ty(n, this.options.cellMinWidth);
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
        const o = Ey(i.schema, n, e, t);
        if (s) {
          const l = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(T.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: n, dispatch: e }) => ay(n, e),
      addColumnAfter: () => ({ state: n, dispatch: e }) => cy(n, e),
      deleteColumn: () => ({ state: n, dispatch: e }) => uy(n, e),
      addRowBefore: () => ({ state: n, dispatch: e }) => fy(n, e),
      addRowAfter: () => ({ state: n, dispatch: e }) => py(n, e),
      deleteRow: () => ({ state: n, dispatch: e }) => gy(n, e),
      deleteTable: () => ({ state: n, dispatch: e }) => Cy(n, e),
      mergeCells: () => ({ state: n, dispatch: e }) => ua(n, e),
      splitCell: () => ({ state: n, dispatch: e }) => ha(n, e),
      toggleHeaderColumn: () => ({ state: n, dispatch: e }) => Un("column")(n, e),
      toggleHeaderRow: () => ({ state: n, dispatch: e }) => Un("row")(n, e),
      toggleHeaderCell: () => ({ state: n, dispatch: e }) => xy(n, e),
      mergeOrSplit: () => ({ state: n, dispatch: e }) => ua(n, e) ? !0 : ha(n, e),
      setCellAttribute: (n, e) => ({ state: t, dispatch: r }) => wy(n, e)(t, r),
      goToNextCell: () => ({ state: n, dispatch: e }) => pa(1)(n, e),
      goToPreviousCell: () => ({ state: n, dispatch: e }) => pa(-1)(n, e),
      fixTables: () => ({ state: n, dispatch: e }) => (e && kd(n), !0),
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
      Backspace: br,
      "Mod-Backspace": br,
      Delete: br,
      "Mod-Delete": br
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        X0({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      My({
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
}), Ry = Q.create({
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
}), Dy = Q.create({
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
}), Iy = Q.create({
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
}), Ly = Se.create({
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
}), ne = {
  editor: {
    style: le(
      "block",
      "border border-gray-100 rounded-3xl *:outline-none",
      "has-[.ProseMirror-focused]:border-black asd",
      "[&>.ProseMirror]:px-4 [&>.ProseMirror]:py-4"
    ),
    config: {
      extensions: [
        r0,
        T0.configure({
          openOnClick: !1
        }),
        Ny.configure({
          resizable: !0,
          handleWidth: 10,
          lastColumnResizable: !0
        }),
        Ry,
        Dy,
        Iy,
        Ly
      ],
      content: `
                <p>Hello World!</p>
            `
    }
  },
  toolbar: {
    style: le(
      "sticky top-0 z-10 py-2 px-3",
      "flex items-center",
      "rounded-ss-3xl rounded-se-3xl",
      "bg-white"
    )
  },
  button: {
    style: le(
      "rounded-full p-2",
      "flex justify-center items-center",
      "hover:bg-gray-50",
      "cursor-pointer"
    )
  },
  modal: {
    backdrop: {
      style: le(
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
      style: le(
        "bg-white",
        "min-w-[350px]",
        "rounded-xl",
        "shadow-md"
      )
    }
  },
  dropdown: {
    style: le(
      "hidden",
      "absolute top-0 left-0 z-10",
      "bg-white shadow-md shadow-gray-100",
      "border border-gray-50",
      "rounded-xl"
    ),
    item: {
      style: le(
        "py-2 px-4 flex items-center gap-4",
        "rounded-lg",
        "hover:bg-slate-200"
      )
    }
  }
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ar = globalThis, Do = Ar.ShadowRoot && (Ar.ShadyCSS === void 0 || Ar.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, vd = Symbol(), ya = /* @__PURE__ */ new WeakMap();
let Py = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== vd) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Do && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = ya.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && ya.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const $y = (n) => new Py(typeof n == "string" ? n : n + "", void 0, vd), By = (n, e) => {
  if (Do) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = Ar.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, n.appendChild(r);
  }
}, ba = Do ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return $y(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zy, defineProperty: Hy, getOwnPropertyDescriptor: Fy, getOwnPropertyNames: Vy, getOwnPropertySymbols: _y, getPrototypeOf: jy } = Object, pt = globalThis, wa = pt.trustedTypes, Wy = wa ? wa.emptyScript : "", mi = pt.reactiveElementPolyfillSupport, Rn = (n, e) => n, eo = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Wy : null;
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
} }, Td = (n, e) => !zy(n, e), ka = { attribute: !0, type: String, converter: eo, reflect: !1, hasChanged: Td };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), pt.litPropertyMetadata ?? (pt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class Gt extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ka) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && Hy(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: i } = Fy(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? ka;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Rn("elementProperties"))) return;
    const e = jy(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Rn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Rn("properties"))) {
      const t = this.properties, r = [...Vy(t), ..._y(t)];
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
      for (const s of r) t.unshift(ba(s));
    } else e !== void 0 && t.push(ba(e));
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
    return By(e, this.constructor.elementStyles), e;
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
      const o = (((i = r.converter) == null ? void 0 : i.toAttribute) !== void 0 ? r.converter : eo).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i;
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = r.getPropertyOptions(s), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((i = o.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? o.converter : eo;
      this._$Em = s, this[s] = l.fromAttribute(t, o.type), this._$Em = null;
    }
  }
  requestUpdate(e, t, r) {
    if (e !== void 0) {
      if (r ?? (r = this.constructor.getPropertyOptions(e)), !(r.hasChanged ?? Td)(this[e], t)) return;
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
Gt.elementStyles = [], Gt.shadowRootOptions = { mode: "open" }, Gt[Rn("elementProperties")] = /* @__PURE__ */ new Map(), Gt[Rn("finalized")] = /* @__PURE__ */ new Map(), mi == null || mi({ ReactiveElement: Gt }), (pt.reactiveElementVersions ?? (pt.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dn = globalThis, ks = Dn.trustedTypes, xa = ks ? ks.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Ad = "$lit$", ot = `lit$${Math.random().toFixed(9).slice(2)}$`, Ed = "?" + ot, Uy = `<${Ed}>`, Ft = document, Kn = () => Ft.createComment(""), Jn = (n) => n === null || typeof n != "object" && typeof n != "function", Od = Array.isArray, Ky = (n) => Od(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", gi = `[ 	
\f\r]`, kn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Sa = /-->/g, Ca = />/g, xt = RegExp(`>|${gi}(?:([^\\s"'>=/]+)(${gi}*=${gi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ma = /'/g, va = /"/g, Nd = /^(?:script|style|textarea|title)$/i, Jy = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), ke = Jy(1), hn = Symbol.for("lit-noChange"), V = Symbol.for("lit-nothing"), Ta = /* @__PURE__ */ new WeakMap(), Et = Ft.createTreeWalker(Ft, 129);
function Rd(n, e) {
  if (!Array.isArray(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xa !== void 0 ? xa.createHTML(e) : e;
}
const qy = (n, e) => {
  const t = n.length - 1, r = [];
  let s, i = e === 2 ? "<svg>" : "", o = kn;
  for (let l = 0; l < t; l++) {
    const a = n[l];
    let c, d, u = -1, h = 0;
    for (; h < a.length && (o.lastIndex = h, d = o.exec(a), d !== null); ) h = o.lastIndex, o === kn ? d[1] === "!--" ? o = Sa : d[1] !== void 0 ? o = Ca : d[2] !== void 0 ? (Nd.test(d[2]) && (s = RegExp("</" + d[2], "g")), o = xt) : d[3] !== void 0 && (o = xt) : o === xt ? d[0] === ">" ? (o = s ?? kn, u = -1) : d[1] === void 0 ? u = -2 : (u = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? xt : d[3] === '"' ? va : Ma) : o === va || o === Ma ? o = xt : o === Sa || o === Ca ? o = kn : (o = xt, s = void 0);
    const f = o === xt && n[l + 1].startsWith("/>") ? " " : "";
    i += o === kn ? a + Uy : u >= 0 ? (r.push(c), a.slice(0, u) + Ad + a.slice(u) + ot + f) : a + ot + (u === -2 ? l : f);
  }
  return [Rd(n, i + (n[t] || "<?>") + (e === 2 ? "</svg>" : "")), r];
};
class qn {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, d] = qy(e, t);
    if (this.el = qn.createElement(c, r), Et.currentNode = this.el.content, t === 2) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = Et.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(Ad)) {
          const h = d[o++], f = s.getAttribute(u).split(ot), p = /([.?@])?(.*)/.exec(h);
          a.push({ type: 1, index: i, name: p[2], strings: f, ctor: p[1] === "." ? Yy : p[1] === "?" ? Xy : p[1] === "@" ? Qy : Hs }), s.removeAttribute(u);
        } else u.startsWith(ot) && (a.push({ type: 6, index: i }), s.removeAttribute(u));
        if (Nd.test(s.tagName)) {
          const u = s.textContent.split(ot), h = u.length - 1;
          if (h > 0) {
            s.textContent = ks ? ks.emptyScript : "";
            for (let f = 0; f < h; f++) s.append(u[f], Kn()), Et.nextNode(), a.push({ type: 2, index: ++i });
            s.append(u[h], Kn());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ed) a.push({ type: 2, index: i });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(ot, u + 1)) !== -1; ) a.push({ type: 7, index: i }), u += ot.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = Ft.createElement("template");
    return r.innerHTML = e, r;
  }
}
function fn(n, e, t = n, r) {
  var o, l;
  if (e === hn) return e;
  let s = r !== void 0 ? (o = t._$Co) == null ? void 0 : o[r] : t._$Cl;
  const i = Jn(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), i === void 0 ? s = void 0 : (s = new i(n), s._$AT(n, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = s : t._$Cl = s), s !== void 0 && (e = fn(n, s._$AS(n, e.values), s, r)), e;
}
class Gy {
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
    const { el: { content: t }, parts: r } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? Ft).importNode(t, !0);
    Et.currentNode = s;
    let i = Et.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new er(i, i.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (c = new Zy(i, this, e)), this._$AV.push(c), a = r[++l];
      }
      o !== (a == null ? void 0 : a.index) && (i = Et.nextNode(), o++);
    }
    return Et.currentNode = Ft, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class er {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = fn(this, e, t), Jn(e) ? e === V || e == null || e === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : e !== this._$AH && e !== hn && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ky(e) ? this.k(e) : this._(e);
  }
  S(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.S(e));
  }
  _(e) {
    this._$AH !== V && Jn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ft.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var i;
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = qn.createElement(Rd(r.h, r.h[0]), this.options)), r);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(t);
    else {
      const o = new Gy(s, this), l = o.u(this.options);
      o.p(t), this.T(l), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Ta.get(e.strings);
    return t === void 0 && Ta.set(e.strings, t = new qn(e)), t;
  }
  k(e) {
    Od(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const i of e) s === t.length ? t.push(r = new er(this.S(Kn()), this.S(Kn()), this, this.options)) : r = t[s], r._$AI(i), s++;
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
class Hs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, i) {
    this.type = 1, this._$AH = V, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = V;
  }
  _$AI(e, t = this, r, s) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = fn(this, e, t, 0), o = !Jn(e) || e !== this._$AH && e !== hn, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = i[0], a = 0; a < i.length - 1; a++) c = fn(this, l[r + a], t, a), c === hn && (c = this._$AH[a]), o || (o = !Jn(c) || c !== this._$AH[a]), c === V ? e = V : e !== V && (e += (c ?? "") + i[a + 1]), this._$AH[a] = c;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Yy extends Hs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === V ? void 0 : e;
  }
}
class Xy extends Hs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== V);
  }
}
class Qy extends Hs {
  constructor(e, t, r, s, i) {
    super(e, t, r, s, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = fn(this, e, t, 0) ?? V) === hn) return;
    const r = this._$AH, s = e === V && r !== V || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== V && (r === V || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Zy {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    fn(this, e);
  }
}
const yi = Dn.litHtmlPolyfillSupport;
yi == null || yi(qn, er), (Dn.litHtmlVersions ?? (Dn.litHtmlVersions = [])).push("3.1.4");
const In = (n, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = s = new er(e.insertBefore(Kn(), i), i, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Er = class extends Gt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = In(t, this.renderRoot, this.renderOptions);
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
    return hn;
  }
};
var Ra;
Er._$litElement$ = !0, Er.finalized = !0, (Ra = globalThis.litElementHydrateSupport) == null || Ra.call(globalThis, { LitElement: Er });
const bi = globalThis.litElementPolyfillSupport;
bi == null || bi({ LitElement: Er });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.6");
class Oe extends HTMLElement {
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
  /**
   * Dont call the `connectedCallback` inside a custom button
   * 
   * Use the `onMount` hook instead
   * 
   * @deprecated use `onMount` instead
   */
  connectedCallback() {
    this.setAttribute("class", ne.button.style), this.setAttribute("title", this.getTitle()), this.insertAdjacentHTML("beforeend", this.getIcon()), this.editor.on("transaction", () => this.toggleActive()), this.onClick && this.addEventListener("click", this.onClick), this.getType() === "dropdown" && this.insertAdjacentHTML("beforeend", '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>'), (this.getType() === "modal" || this.getType() === "dropdown") && this.addEventListener("click", () => this[this.getType()].toggle(this)), this.onMount && this.onMount();
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
class Dd extends Oe {
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
        icon: ke`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
      },
      {
        title: "H3",
        icon: ke`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
      },
      {
        title: "H4",
        icon: ke`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-4"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 4 }).run();
        }
      },
      {
        title: "H5",
        icon: ke`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-5"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 13v-3h4"/><path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 5 }).run();
        }
      },
      {
        title: "H6",
        icon: ke`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-6"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 6 }).run();
        }
      }
    ];
  }
}
customElements.define("pd-button-heading", Dd);
class Id extends Oe {
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
customElements.define("pd-button-bold", Id);
class Ld extends Oe {
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
customElements.define("pd-button-italic", Ld);
class Pd extends Oe {
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
customElements.define("pd-button-strike", Pd);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e1 = (n) => n.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t1 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, n1 = (n) => (...e) => ({ _$litDirective$: n, values: e });
class r1 {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, r) {
    this._$Ct = e, this._$AM = t, this._$Ci = r;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ln = (n, e) => {
  var r;
  const t = n._$AN;
  if (t === void 0) return !1;
  for (const s of t) (r = s._$AO) == null || r.call(s, e, !1), Ln(s, e);
  return !0;
}, xs = (n) => {
  let e, t;
  do {
    if ((e = n._$AM) === void 0) break;
    t = e._$AN, t.delete(n), n = e;
  } while ((t == null ? void 0 : t.size) === 0);
}, $d = (n) => {
  for (let e; e = n._$AM; n = e) {
    let t = e._$AN;
    if (t === void 0) e._$AN = t = /* @__PURE__ */ new Set();
    else if (t.has(n)) break;
    t.add(n), o1(e);
  }
};
function s1(n) {
  this._$AN !== void 0 ? (xs(this), this._$AM = n, $d(this)) : this._$AM = n;
}
function i1(n, e = !1, t = 0) {
  const r = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(r)) for (let i = t; i < r.length; i++) Ln(r[i], !1), xs(r[i]);
  else r != null && (Ln(r, !1), xs(r));
  else Ln(this, n);
}
const o1 = (n) => {
  n.type == t1.CHILD && (n._$AP ?? (n._$AP = i1), n._$AQ ?? (n._$AQ = s1));
};
class l1 extends r1 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, t, r) {
    super._$AT(e, t, r), $d(this), this.isConnected = e._$AU;
  }
  _$AO(e, t = !0) {
    var r, s;
    e !== this.isConnected && (this.isConnected = e, e ? (r = this.reconnected) == null || r.call(this) : (s = this.disconnected) == null || s.call(this)), t && (Ln(this, e), xs(this));
  }
  setValue(e) {
    if (e1(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const t = [...this._$Ct._$AH];
      t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a1 = () => new c1();
class c1 {
}
const wi = /* @__PURE__ */ new WeakMap(), d1 = n1(class extends l1 {
  render(n) {
    return V;
  }
  update(n, [e]) {
    var r;
    const t = e !== this.Y;
    return t && this.Y !== void 0 && this.rt(void 0), (t || this.lt !== this.ct) && (this.Y = e, this.ht = (r = n.options) == null ? void 0 : r.host, this.rt(this.ct = n.element)), V;
  }
  rt(n) {
    if (this.isConnected || (n = void 0), typeof this.Y == "function") {
      const e = this.ht ?? globalThis;
      let t = wi.get(e);
      t === void 0 && (t = /* @__PURE__ */ new WeakMap(), wi.set(e, t)), t.get(this.Y) !== void 0 && this.Y.call(this.ht, void 0), t.set(this.Y, n), n !== void 0 && this.Y.call(this.ht, n);
    } else this.Y.value = n;
  }
  get lt() {
    var n, e;
    return typeof this.Y == "function" ? (n = wi.get(this.ht ?? globalThis)) == null ? void 0 : n.get(this.Y) : (e = this.Y) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
class Bd extends Oe {
  constructor(t, r, s) {
    super(t, r, s);
    Re(this, "formRef", a1());
    this.modal.addEventListener("hide", () => {
      var i;
      return (i = this.formRef.value) == null ? void 0 : i.reset();
    }), this.editor.on("transaction", () => this.showDropdown());
  }
  getType() {
    return "modal";
  }
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  }
  getTitle() {
    return "Insert link";
  }
  isActive() {
    return this.editor.isActive("link");
  }
  setLink(t) {
    t.preventDefault();
    const r = new FormData(t.target), s = r.get("text"), i = r.get("url");
    this.editor.chain().focus().setLink({ href: i }).insertContent(s.trim()).focus().run(), this.modal.hide();
  }
  unsetLink() {
    this.editor.chain().focus().unsetLink().run();
  }
  getTemplate() {
    return ke`
            <form @submit=${(t) => this.setLink(t)} ${d1(this.formRef)}>
                <div class="mb-3">
                    <div class="relative">
                        <input 
                            type="text"
                            name="text"
                            class=${le(
      "pt-6 pb-2 px-6 peer",
      "w-full rounded-full",
      "border border-gray-100",
      "outline-none"
    )}
                            value=${this.textValue}
                            required
                        />
                        <label
                            class=${le(
      "absolute top-1/2 left-6",
      "-translate-y-1/2",
      "text-slate-700",
      "transition-all",
      "peer-focus:top-4 peer-focus:text-xs",
      "peer-valid:top-4 peer-valid:text-xs",
      "peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs"
    )}
                        >Text <span class="text-red-500">*</span></label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="relative">
                        <input 
                            type="text"
                            name="url"
                            class=${le(
      "pt-6 pb-2 px-6 peer",
      "w-full rounded-full",
      "border border-gray-100",
      "outline-none"
    )}
                            value=${this.urlValue}
                            required
                        />
                        <label
                            class=${le(
      "absolute top-1/2 left-6",
      "-translate-y-1/2",
      "text-slate-700",
      "transition-all",
      "peer-focus:top-4 peer-focus:text-xs",
      "peer-valid:top-4 peer-valid:text-xs",
      "peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs"
    )}
                        >URL <span class="text-red-500">*</span></label>
                    </div>
                </div>
                <div class="mb-3 flex justify-stretch gap-3">
                    <button 
                        type="button"
                        class=${le(
      "px-6 py-2",
      "w-full rounded-full",
      "bg-slate-200"
    )}
                        @click=${() => this.modal.hide()}
                    >Cancel</button>
                    <button 
                        type="submit"
                        class=${le(
      "px-6 py-2",
      "w-full rounded-full",
      "bg-blue-500 text-white"
    )}
                    >Insert</button>
                </div>
            </form>
        `;
  }
  showDropdown() {
    var r, s;
    const t = (r = document.getSelection().anchorNode) == null ? void 0 : r.parentElement;
    if (!t)
      return this.dropdown.hide();
    if (((s = t.closest("a")) == null ? void 0 : s.tagName) !== "A")
      return this.dropdown.hide();
    this.dropdown.renderHTML(ke`
            <div class="px-4 py-2 flex items-center">
                <a 
                    href=${this.urlValue} 
                    target="_blank" 
                    class=${le(
      "me-3",
      "max-w-[300px] overflow-hidden",
      "text-ellipsis text-nowrap",
      "text-sm font-medium",
      "text-blue-500 visited:text-purple-500"
    )}
                >${this.urlValue}</a>
                <button class="p-2 rounded-full hover:bg-slate-200" @click=${() => this.unsetLink()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unlink"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/></svg>
                </button>
                <button class="p-2 rounded-full hover:bg-slate-200" @click=${() => this.modal.show(this)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                </button>
            </div>    
        `), this.dropdown.show(t);
  }
  get textValue() {
    this.isActive() && this.editor.chain().focus().extendMarkRange("link").run();
    const { view: t, state: r } = this.editor, { from: s, to: i } = t.state.selection;
    return r.doc.textBetween(s, i, "");
  }
  get urlValue() {
    return this.isActive() ? this.editor.getAttributes("link").href : "";
  }
}
customElements.define("pd-button-link", Bd);
class zd extends Oe {
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>';
  }
  getTitle() {
    return "Ordered list";
  }
  onClick() {
    this.editor.chain().focus().toggleOrderedList().run();
  }
  isActive() {
    return this.editor.isActive("orderedList");
  }
}
customElements.define("pd-button-ordered-list", zd);
class Hd extends Oe {
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>';
  }
  getTitle() {
    return "Bullet list";
  }
  onClick() {
    this.editor.chain().focus().toggleBulletList().run();
  }
  isActive() {
    return this.editor.isActive("bulletList");
  }
}
customElements.define("pd-button-bullet-list", Hd);
class Fd extends Oe {
  constructor() {
    super(...arguments);
    Re(this, "button");
  }
  onMount() {
    this.editor.on("transaction", () => this.showButton()), this.button = document.createElement("button"), this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>', this.button.classList.value = "hidden absolute p-2 rounded-full hover:bg-slate-200", this.button.addEventListener("click", () => this.showDropdown()), document.body.appendChild(this.button);
  }
  getTitle() {
    return "Insert table";
  }
  getIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
  }
  onClick() {
    this.editor.chain().focus().insertTable({ cols: 2, rows: 2 }).run();
  }
  isActive() {
    return this.editor.isActive("table");
  }
  showButton() {
    var o;
    let t = (o = document.getSelection().anchorNode) == null ? void 0 : o.parentElement;
    if (t = t != null && t.closest("td") ? t.closest("td") : t != null && t.closest("th") ? t.closest("th") : null, !t) {
      this.button.classList.replace("block", "hidden");
      return;
    }
    const { top: r, left: s, width: i } = t.getBoundingClientRect();
    this.button.classList.replace("hidden", "block"), this.button.style.top = `${r + 3}px`, this.button.style.left = `${i + s - 38}px`, window.addEventListener("resize", () => {
      const { top: l, left: a, width: c } = t.getBoundingClientRect();
      this.button.style.top = `${l + 3}px`, this.button.style.left = `${c + a - 38}px`;
    });
  }
  showDropdown() {
    this.dropdown.renderHTML(ke`
            <div class="flex flex-col min-w-[250px]">
                <div class="flex flex-col p-2 border-b border-gray-100">
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().toggleHeaderRow().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toggle-right"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>
                        <span>Toggle header row</span>
                    </button>
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().toggleHeaderCell().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toggle-right"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>
                        <span>Toggle header column</span>
                    </button>
                </div>
                <div class="flex flex-col p-2 border-b border-gray-100">
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().addRowBefore().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert row above</span>
                    </button>
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().addRowAfter().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert row below</span>
                    </button>
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().deleteRow().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        <span>Delete row</span>
                    </button>
                </div>
                <div class="flex flex-col p-2">
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().addColumnBefore().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert column before</span>
                    </button>
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().addColumnAfter().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Insert column after</span>
                    </button>
                    <button 
                        class=${ne.dropdown.item.style}
                        @click=${() => {
      this.editor.chain().focus().deleteRow().run();
    }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        <span>Delete column</span>
                    </button>
                </div>
            </div>
        `), this.dropdown.show(this.button);
  }
}
customElements.define("pd-button-table", Fd);
class Vd extends Oe {
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
    return this.editor.isActive("bold");
  }
}
customElements.define("pd-button-underline", Vd);
class _d extends HTMLElement {
  constructor() {
    super(...arguments);
    Re(this, "buttons", {
      heading: Dd,
      bold: Id,
      italic: Ld,
      underline: Vd,
      strikethrough: Pd,
      link: Bd,
      "ordered-list": zd,
      "bullet-list": Hd,
      table: Fd
    });
  }
  connectedCallback() {
    this.setAttribute("class", ne.toolbar.style);
  }
  /**
   * Add a new button implementation
   * 
   * To display the button in the toolbar you have to 
   * update the toolbar attribute on the editor element
   * 
   * @param name      - name of the button
   * @param button    - implementation
   */
  addButton(t, r) {
    this.buttons[t] && console.warn(`A button with this name already exists, \`${t}\`. This can cause unexpected behaviour.`), this.buttons[t] = r, this.dispatchEvent(new CustomEvent("buttonAdded", {
      detail: {
        name: t,
        button: r
      }
    }));
  }
  /**
   * Removes a registrated button
   * 
   * This will also remove the button from the toolbar
   * since we deleted the implementation
   * 
   * @param name      - name of the button which was used upon registration
   */
  removeButton(t) {
    this.buttons[t] && (delete this.buttons[t], this.dispatchEvent(new CustomEvent("buttonRemoved", { detail: { name: t } })));
  }
}
customElements.define("pd-editor-toolbar", _d);
const to = Math.min, nn = Math.max, Ss = Math.round, wr = Math.floor, gt = (n) => ({
  x: n,
  y: n
});
function jd(n) {
  return n.split("-")[0];
}
function u1(n) {
  return n.split("-")[1];
}
function h1(n) {
  return n === "x" ? "y" : "x";
}
function f1(n) {
  return n === "y" ? "height" : "width";
}
function Wd(n) {
  return ["top", "bottom"].includes(jd(n)) ? "y" : "x";
}
function p1(n) {
  return h1(Wd(n));
}
function Ud(n) {
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
function Aa(n, e, t) {
  let {
    reference: r,
    floating: s
  } = n;
  const i = Wd(e), o = p1(e), l = f1(o), a = jd(e), c = i === "y", d = r.x + r.width / 2 - s.width / 2, u = r.y + r.height / 2 - s.height / 2, h = r[l] / 2 - s[l] / 2;
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
  switch (u1(e)) {
    case "start":
      f[o] -= h * (t && c ? -1 : 1);
      break;
    case "end":
      f[o] += h * (t && c ? -1 : 1);
      break;
  }
  return f;
}
const m1 = async (n, e, t) => {
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
  } = Aa(c, r, a), h = r, f = {}, p = 0;
  for (let m = 0; m < l.length; m++) {
    const {
      name: g,
      fn: y
    } = l[m], {
      x: w,
      y: C,
      data: R,
      reset: E
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
    d = w ?? d, u = C ?? u, f = {
      ...f,
      [g]: {
        ...f[g],
        ...R
      }
    }, E && p <= 50 && (p++, typeof E == "object" && (E.placement && (h = E.placement), E.rects && (c = E.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: s
    }) : E.rects), {
      x: d,
      y: u
    } = Aa(c, h, a)), m = -1);
  }
  return {
    x: d,
    y: u,
    placement: h,
    strategy: s,
    middlewareData: f
  };
};
function yn(n) {
  return Kd(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function fe(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ye(n) {
  var e;
  return (e = (Kd(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Kd(n) {
  return n instanceof Node || n instanceof fe(n).Node;
}
function _e(n) {
  return n instanceof Element || n instanceof fe(n).Element;
}
function je(n) {
  return n instanceof HTMLElement || n instanceof fe(n).HTMLElement;
}
function Ea(n) {
  return typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof fe(n).ShadowRoot;
}
function tr(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: s
  } = Ae(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !["inline", "contents"].includes(s);
}
function g1(n) {
  return ["table", "td", "th"].includes(yn(n));
}
function Fs(n) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
function Io(n) {
  const e = Lo(), t = Ae(n);
  return t.transform !== "none" || t.perspective !== "none" || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((r) => (t.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some((r) => (t.contain || "").includes(r));
}
function y1(n) {
  let e = yt(n);
  for (; je(e) && !pn(e); ) {
    if (Fs(e))
      return null;
    if (Io(e))
      return e;
    e = yt(e);
  }
  return null;
}
function Lo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function pn(n) {
  return ["html", "body", "#document"].includes(yn(n));
}
function Ae(n) {
  return fe(n).getComputedStyle(n);
}
function Vs(n) {
  return _e(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function yt(n) {
  if (yn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Ea(n) && n.host || // Fallback.
    Ye(n)
  );
  return Ea(e) ? e.host : e;
}
function Jd(n) {
  const e = yt(n);
  return pn(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : je(e) && tr(e) ? e : Jd(e);
}
function Gn(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const s = Jd(n), i = s === ((r = n.ownerDocument) == null ? void 0 : r.body), o = fe(s);
  return i ? e.concat(o, o.visualViewport || [], tr(s) ? s : [], o.frameElement && t ? Gn(o.frameElement) : []) : e.concat(s, Gn(s, [], t));
}
function qd(n) {
  const e = Ae(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const s = je(n), i = s ? n.offsetWidth : t, o = s ? n.offsetHeight : r, l = Ss(t) !== i || Ss(r) !== o;
  return l && (t = i, r = o), {
    width: t,
    height: r,
    $: l
  };
}
function Po(n) {
  return _e(n) ? n : n.contextElement;
}
function rn(n) {
  const e = Po(n);
  if (!je(e))
    return gt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: s,
    $: i
  } = qd(e);
  let o = (i ? Ss(t.width) : t.width) / r, l = (i ? Ss(t.height) : t.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!l || !Number.isFinite(l)) && (l = 1), {
    x: o,
    y: l
  };
}
const b1 = /* @__PURE__ */ gt(0);
function Gd(n) {
  const e = fe(n);
  return !Lo() || !e.visualViewport ? b1 : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function w1(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== fe(n) ? !1 : e;
}
function Vt(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const s = n.getBoundingClientRect(), i = Po(n);
  let o = gt(1);
  e && (r ? _e(r) && (o = rn(r)) : o = rn(n));
  const l = w1(i, t, r) ? Gd(i) : gt(0);
  let a = (s.left + l.x) / o.x, c = (s.top + l.y) / o.y, d = s.width / o.x, u = s.height / o.y;
  if (i) {
    const h = fe(i), f = r && _e(r) ? fe(r) : r;
    let p = h, m = p.frameElement;
    for (; m && r && f !== p; ) {
      const g = rn(m), y = m.getBoundingClientRect(), w = Ae(m), C = y.left + (m.clientLeft + parseFloat(w.paddingLeft)) * g.x, R = y.top + (m.clientTop + parseFloat(w.paddingTop)) * g.y;
      a *= g.x, c *= g.y, d *= g.x, u *= g.y, a += C, c += R, p = fe(m), m = p.frameElement;
    }
  }
  return Ud({
    width: d,
    height: u,
    x: a,
    y: c
  });
}
function k1(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: s
  } = n;
  const i = s === "fixed", o = Ye(r), l = e ? Fs(e.floating) : !1;
  if (r === o || l && i)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = gt(1);
  const d = gt(0), u = je(r);
  if ((u || !u && !i) && ((yn(r) !== "body" || tr(o)) && (a = Vs(r)), je(r))) {
    const h = Vt(r);
    c = rn(r), d.x = h.x + r.clientLeft, d.y = h.y + r.clientTop;
  }
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - a.scrollLeft * c.x + d.x,
    y: t.y * c.y - a.scrollTop * c.y + d.y
  };
}
function x1(n) {
  return Array.from(n.getClientRects());
}
function Yd(n) {
  return Vt(Ye(n)).left + Vs(n).scrollLeft;
}
function S1(n) {
  const e = Ye(n), t = Vs(n), r = n.ownerDocument.body, s = nn(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), i = nn(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Yd(n);
  const l = -t.scrollTop;
  return Ae(r).direction === "rtl" && (o += nn(e.clientWidth, r.clientWidth) - s), {
    width: s,
    height: i,
    x: o,
    y: l
  };
}
function C1(n, e) {
  const t = fe(n), r = Ye(n), s = t.visualViewport;
  let i = r.clientWidth, o = r.clientHeight, l = 0, a = 0;
  if (s) {
    i = s.width, o = s.height;
    const c = Lo();
    (!c || c && e === "fixed") && (l = s.offsetLeft, a = s.offsetTop);
  }
  return {
    width: i,
    height: o,
    x: l,
    y: a
  };
}
function M1(n, e) {
  const t = Vt(n, !0, e === "fixed"), r = t.top + n.clientTop, s = t.left + n.clientLeft, i = je(n) ? rn(n) : gt(1), o = n.clientWidth * i.x, l = n.clientHeight * i.y, a = s * i.x, c = r * i.y;
  return {
    width: o,
    height: l,
    x: a,
    y: c
  };
}
function Oa(n, e, t) {
  let r;
  if (e === "viewport")
    r = C1(n, t);
  else if (e === "document")
    r = S1(Ye(n));
  else if (_e(e))
    r = M1(e, t);
  else {
    const s = Gd(n);
    r = {
      ...e,
      x: e.x - s.x,
      y: e.y - s.y
    };
  }
  return Ud(r);
}
function Xd(n, e) {
  const t = yt(n);
  return t === e || !_e(t) || pn(t) ? !1 : Ae(t).position === "fixed" || Xd(t, e);
}
function v1(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Gn(n, [], !1).filter((l) => _e(l) && yn(l) !== "body"), s = null;
  const i = Ae(n).position === "fixed";
  let o = i ? yt(n) : n;
  for (; _e(o) && !pn(o); ) {
    const l = Ae(o), a = Io(o);
    !a && l.position === "fixed" && (s = null), (i ? !a && !s : !a && l.position === "static" && !!s && ["absolute", "fixed"].includes(s.position) || tr(o) && !a && Xd(n, o)) ? r = r.filter((d) => d !== o) : s = l, o = yt(o);
  }
  return e.set(n, r), r;
}
function T1(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: s
  } = n;
  const o = [...t === "clippingAncestors" ? Fs(e) ? [] : v1(e, this._c) : [].concat(t), r], l = o[0], a = o.reduce((c, d) => {
    const u = Oa(e, d, s);
    return c.top = nn(u.top, c.top), c.right = to(u.right, c.right), c.bottom = to(u.bottom, c.bottom), c.left = nn(u.left, c.left), c;
  }, Oa(e, l, s));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function A1(n) {
  const {
    width: e,
    height: t
  } = qd(n);
  return {
    width: e,
    height: t
  };
}
function E1(n, e, t) {
  const r = je(e), s = Ye(e), i = t === "fixed", o = Vt(n, !0, i, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = gt(0);
  if (r || !r && !i)
    if ((yn(e) !== "body" || tr(s)) && (l = Vs(e)), r) {
      const u = Vt(e, !0, i, e);
      a.x = u.x + e.clientLeft, a.y = u.y + e.clientTop;
    } else s && (a.x = Yd(s));
  const c = o.left + l.scrollLeft - a.x, d = o.top + l.scrollTop - a.y;
  return {
    x: c,
    y: d,
    width: o.width,
    height: o.height
  };
}
function ki(n) {
  return Ae(n).position === "static";
}
function Na(n, e) {
  return !je(n) || Ae(n).position === "fixed" ? null : e ? e(n) : n.offsetParent;
}
function Qd(n, e) {
  const t = fe(n);
  if (Fs(n))
    return t;
  if (!je(n)) {
    let s = yt(n);
    for (; s && !pn(s); ) {
      if (_e(s) && !ki(s))
        return s;
      s = yt(s);
    }
    return t;
  }
  let r = Na(n, e);
  for (; r && g1(r) && ki(r); )
    r = Na(r, e);
  return r && pn(r) && ki(r) && !Io(r) ? t : r || y1(n) || t;
}
const O1 = async function(n) {
  const e = this.getOffsetParent || Qd, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: E1(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function N1(n) {
  return Ae(n).direction === "rtl";
}
const R1 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: k1,
  getDocumentElement: Ye,
  getClippingRect: T1,
  getOffsetParent: Qd,
  getElementRects: O1,
  getClientRects: x1,
  getDimensions: A1,
  getScale: rn,
  isElement: _e,
  isRTL: N1
};
function D1(n, e) {
  let t = null, r;
  const s = Ye(n);
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
    const f = wr(d), p = wr(s.clientWidth - (c + u)), m = wr(s.clientHeight - (d + h)), g = wr(c), w = {
      rootMargin: -f + "px " + -p + "px " + -m + "px " + -g + "px",
      threshold: nn(0, to(1, a)) || 1
    };
    let C = !0;
    function R(E) {
      const M = E[0].intersectionRatio;
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
        ...w,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(R, w);
    }
    t.observe(n);
  }
  return o(!0), i;
}
function I1(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: i = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: l = typeof IntersectionObserver == "function",
    animationFrame: a = !1
  } = r, c = Po(n), d = s || i ? [...c ? Gn(c) : [], ...Gn(e)] : [];
  d.forEach((y) => {
    s && y.addEventListener("scroll", t, {
      passive: !0
    }), i && y.addEventListener("resize", t);
  });
  const u = c && l ? D1(c, t) : null;
  let h = -1, f = null;
  o && (f = new ResizeObserver((y) => {
    let [w] = y;
    w && w.target === c && f && (f.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var C;
      (C = f) == null || C.observe(e);
    })), t();
  }), c && !a && f.observe(c), f.observe(e));
  let p, m = a ? Vt(n) : null;
  a && g();
  function g() {
    const y = Vt(n);
    m && (y.x !== m.x || y.y !== m.y || y.width !== m.width || y.height !== m.height) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    d.forEach((w) => {
      s && w.removeEventListener("scroll", t), i && w.removeEventListener("resize", t);
    }), u == null || u(), (y = f) == null || y.disconnect(), f = null, a && cancelAnimationFrame(p);
  };
}
const L1 = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), s = {
    platform: R1,
    ...t
  }, i = {
    ...s.platform,
    _c: r
  };
  return m1(n, e, {
    ...s,
    platform: i
  });
};
var $e, Yn, lt;
class Zd extends HTMLElement {
  constructor() {
    super(...arguments);
    sr(this, $e);
    sr(this, Yn, "bottom-start");
    sr(this, lt);
  }
  connectedCallback() {
    this.setAttribute("class", ne.dropdown.style), document.addEventListener("keyup", (t) => t.code === "Escape" && this.hide());
  }
  disconnectCallback() {
    me(this, lt) && me(this, lt).call(this);
  }
  setPlacement(t) {
    ir(this, Yn, t);
  }
  getPlacement() {
    return me(this, Yn);
  }
  getReference() {
    return me(this, $e);
  }
  renderHTML(t) {
    In(t, this);
  }
  updatePosition() {
    return L1(this.getReference(), this, { placement: this.getPlacement() }).then(({ x: t, y: r }) => {
      this.style.top = `${r}px`, this.style.left = `${t}px`;
    });
  }
  async show(t) {
    ir(this, $e, t), this.classList.remove("hidden"), this.classList.add("block"), ir(this, lt, I1(
      t,
      this,
      this.updatePosition.bind(this)
    )), this.render(), document.addEventListener("click", this.onClickOutside.bind(this));
  }
  hide() {
    this.classList.remove("block"), this.classList.add("hidden"), document.removeEventListener("click", this.onClickOutside.bind(this)), me(this, lt) && me(this, lt).call(this);
  }
  toggle(t) {
    this.checkVisibility() ? this.hide() : this.show(t);
  }
  onClickOutside(t) {
    var r;
    this.contains(t.target) || (r = me(this, $e)) != null && r.contains(t.target) || this.hide();
  }
  render() {
    if (me(this, $e) instanceof Oe) {
      if (Array.isArray(me(this, $e).getTemplate())) {
        const t = ke`
                <nav class="list-none flex flex-col">
                    ${me(this, $e).getTemplate().map(
          (r) => ke`
                            <li>
                                <button class="p-2 w-full rounded-lg hover:bg-gray-50" @click=${(s) => r.action(s, this)}>
                                    ${r.icon}
                                </button>
                            </li>
                        `
        )}
                </nav>
            `;
        return this.classList.add("p-1"), this.classList.add("min-w-[150px]"), In(t, this);
      }
      return In(me(this, $e).getTemplate(), this);
    }
  }
}
$e = new WeakMap(), Yn = new WeakMap(), lt = new WeakMap();
customElements.define("pd-dropdown", Zd);
const P1 = new Event("show"), $1 = new Event("hide");
class eu extends HTMLElement {
  constructor() {
    super();
    /**
     * A reference to the element that activated the modal
     */
    Re(this, "reference");
    this.setAttribute("class", ne.modal.backdrop.style), document.addEventListener("keyup", (t) => t.code === "Escape" && this.hide());
  }
  show(t) {
    this.reference = t, this.classList.replace("hidden", "block"), this.dispatchEvent(P1), this.render();
  }
  hide() {
    this.classList.replace("block", "hidden"), this.dispatchEvent($1);
  }
  toggle(t) {
    this.checkVisibility() ? this.hide() : this.show(t);
  }
  render() {
    if (this.reference instanceof Oe) {
      const t = ke`
                <div  class=${ne.modal.dialog.style}>
                    <div class="p-4 flex items-center">
                        ${this.reference.getTitle() !== "" ? ke`<span class="text-xl font-bold">${this.reference.getTitle()}</span>` : ""}
                        <button @click=${() => this.hide()} class="p-2 ms-auto rounded-full bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-4">
                        ${this.reference.getTemplate()}
                    </div>
                </div>
            `;
      In(t, this);
    }
  }
}
customElements.define("pd-modal", eu);
class tu extends HTMLElement {
  constructor() {
    super();
    /**
     * Reference to TipTap editor
     * 
     * @type {Editor}
     */
    Re(this, "editor");
    /**
     * Reference to PdEditorToolbar
     * 
     * @type {PdEditorToolbar}
     */
    Re(this, "toolbar");
    /**
     * Reference to PdDropdown
     * 
     * @type {PdDropdown}
     */
    Re(this, "dropdown");
    /**
     * Reference to PdModal
     * 
     * @type {PdModal}
     */
    Re(this, "modal");
    this.editor = new ng(Object.assign(ne.editor.config, { element: this })), this.setAttribute("class", ne.editor.style), this.dropdown = document.querySelector("pd-dropdown") ?? document.body.appendChild(new Zd()), this.modal = document.querySelector("pd-modal") ?? document.body.appendChild(new eu()), this.toolbar = new _d(), this.prepend(this.toolbar), this.renderButtons(), this.toolbar.addEventListener("buttonAdded", () => this.renderButtons()), this.toolbar.addEventListener("buttonRemoved", () => this.renderButtons());
  }
  renderButtons() {
    let t = this.getAttribute("toolbar");
    for (; this.toolbar.firstChild; )
      this.toolbar.removeChild(this.toolbar.firstChild);
    t || (t = "heading|bold,italic,strikethrough|link,image|table");
    const r = t.split("|");
    for (const s of r) {
      const i = document.createElement("div");
      i.classList.add("me-1", "flex"), s.split(",").forEach((o) => {
        this.toolbar.buttons[o] && i.append(
          new this.toolbar.buttons[o](
            this.editor,
            this.dropdown,
            this.modal
          )
        );
      }), this.toolbar.append(i);
    }
  }
}
Re(tu, "observedAttributes", ["toolbar"]);
customElements.define("pd-editor", tu);
export {
  Oe as PdButton,
  tu as PdEditor,
  ne as pdConfig
};
