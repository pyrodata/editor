var Fd = Object.defineProperty;
var Eo = (n) => {
  throw TypeError(n);
};
var Vd = (n, e, t) => e in n ? Fd(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var Re = (n, e, t) => Vd(n, typeof e != "symbol" ? e + "" : e, t), No = (n, e, t) => e.has(n) || Eo("Cannot " + t);
var me = (n, e, t) => (No(n, e, "read from private field"), t ? t.call(n) : e.get(n)), er = (n, e, t) => e.has(n) ? Eo("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), tr = (n, e, t, r) => (No(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t);
function U(n) {
  this.content = n;
}
U.prototype = {
  constructor: U,
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
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), s = r.content.slice();
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new U(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new U(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new U([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new U(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new U(i);
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
    return n = U.from(n), n.size ? new U(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = U.from(n), n.size ? new U(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = U.from(n);
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
U.from = function(n) {
  if (n instanceof U) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new U(e);
};
function ba(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), s = e.child(r);
    if (i == s) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(s))
      return t;
    if (i.isText && i.text != s.text) {
      for (let o = 0; i.text[o] == s.text[o]; o++)
        t++;
      return t;
    }
    if (i.content.size || s.content.size) {
      let o = ba(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function ka(n, e, t, r) {
  for (let i = n.childCount, s = e.childCount; ; ) {
    if (i == 0 || s == 0)
      return i == s ? null : { a: t, b: r };
    let o = n.child(--i), l = e.child(--s), a = o.nodeSize;
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
      let c = ka(o.content, l.content, t - 1, r - 1);
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
  nodesBetween(e, t, r, i = 0, s) {
    for (let o = 0, l = 0; l < t; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, i + l, s || null, o) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, t - d), r, i + d);
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
  textBetween(e, t, r, i) {
    let s = "", o = !0;
    return this.nodesBetween(e, t, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, t - a) : l.isLeaf ? i ? typeof i == "function" ? i(l) : i : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && r && (o ? o = !1 : s += r), s += c;
    }, 0), s;
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
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), s = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), s = 1); s < e.content.length; s++)
      i.push(e.content[s]);
    return new b(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let s = 0, o = 0; o < t; s++) {
        let l = this.content[s], a = o + l.nodeSize;
        a > e && ((o < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, t - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, t - o - 1))), r.push(l), i += l.nodeSize), o = a;
      }
    return new b(r, i);
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
    let i = this.content.slice(), s = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new b(i, s);
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
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return ba(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return ka(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e, t = -1) {
    if (e == 0)
      return nr(0, e);
    if (e == this.size)
      return nr(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, i = 0; ; r++) {
      let s = this.child(r), o = i + s.nodeSize;
      if (o >= e)
        return o == e || t > 0 ? nr(r + 1, o) : nr(r, i);
      i = o;
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
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
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
const zi = { index: 0, offset: 0 };
function nr(n, e) {
  return zi.index = n, zi.offset = e, zi;
}
function Mr(n, e) {
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
      if (!Mr(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !Mr(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let L = class ps {
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
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      if (this.eq(s))
        return e;
      if (this.type.excludes(s.type))
        t || (t = e.slice(0, i));
      else {
        if (s.type.excludes(this.type))
          return e;
        !r && s.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(s);
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
    return this == e || this.type == e.type && Mr(this.attrs, e.attrs);
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
      return ps.none;
    if (e instanceof ps)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
L.none = [];
class Tr extends Error {
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
    let r = xa(this.content, e + this.openStart, t);
    return r && new x(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new x(wa(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new x(b.fromJSON(e, t.content), r, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let s = e.firstChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.firstChild)
      r++;
    for (let s = e.lastChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.lastChild)
      i++;
    return new x(e, r, i);
  }
}
x.empty = new x(b.empty, 0, 0);
function wa(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: l } = n.findIndex(t);
  if (i == e || s.isText) {
    if (l != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(wa(s.content, e - i - 1, t - i - 1)));
}
function xa(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return n.cut(0, e).append(t).append(n.cut(e));
  let l = xa(o.content, e - s - 1, t);
  return l && n.replaceChild(i, o.copy(l));
}
function jd(n, e, t) {
  if (t.openStart > n.depth)
    throw new Tr("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Tr("Inconsistent open depths");
  return Ca(n, e, t, 0);
}
function Ca(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = Ca(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, l = o.content;
      return Nt(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = Wd(t, n);
      return Nt(s, Ma(n, o, l, e, r));
    }
  else return Nt(s, vr(n, e, r));
}
function Sa(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Tr("Cannot join " + e.type.name + " onto " + n.type.name);
}
function ms(n, e, t) {
  let r = n.node(t);
  return Sa(r, e.node(t)), r;
}
function Et(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function xn(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (Et(n.nodeAfter, r), s++));
  for (let l = s; l < o; l++)
    Et(i.child(l), r);
  e && e.depth == t && e.textOffset && Et(e.nodeBefore, r);
}
function Nt(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Ma(n, e, t, r, i) {
  let s = n.depth > i && ms(n, e, i + 1), o = r.depth > i && ms(t, r, i + 1), l = [];
  return xn(null, n, i, l), s && o && e.index(i) == t.index(i) ? (Sa(s, o), Et(Nt(s, Ma(n, e, t, r, i + 1)), l)) : (s && Et(Nt(s, vr(n, e, i + 1)), l), xn(e, t, i, l), o && Et(Nt(o, vr(t, r, i + 1)), l)), xn(r, null, i, l), new b(l);
}
function vr(n, e, t) {
  let r = [];
  if (xn(null, n, t, r), n.depth > t) {
    let i = ms(n, e, t + 1);
    Et(Nt(i, vr(n, e, t + 1)), r);
  }
  return xn(e, null, t, r), new b(r);
}
function Wd(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(b.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class On {
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
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
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
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let s = 0; s < e; s++)
      i += r.child(s).nodeSize;
    return i;
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
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = i, i = l;
    }
    let s = r.marks;
    for (var o = 0; o < s.length; o++)
      s[o].type.spec.inclusive === !1 && (!i || !s[o].isInSet(i.marks)) && (s = s[o--].removeFromSet(s));
    return s;
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
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var s = 0; s < r.length; s++)
      r[s].type.spec.inclusive === !1 && (!i || !r[s].isInSet(i.marks)) && (r = r[s--].removeFromSet(r));
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
        return new Ar(this, e, r);
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
    let r = [], i = 0, s = t;
    for (let o = e; ; ) {
      let { index: l, offset: a } = o.content.findIndex(s), c = s - a;
      if (r.push(o, l, i + a), !c || (o = o.child(l), o.isText))
        break;
      s = c - 1, i += a + 1;
    }
    return new On(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Oo.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      Oo.set(e, r = new _d());
    let i = r.elts[r.i] = On.resolve(e, t);
    return r.i = (r.i + 1) % Kd, i;
  }
}
class _d {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const Kd = 12, Oo = /* @__PURE__ */ new WeakMap();
class Ar {
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
const Jd = /* @__PURE__ */ Object.create(null);
let Ot = class gs {
  /**
  @internal
  */
  constructor(e, t, r, i = L.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || b.empty;
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
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
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
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
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
    return this.type == e && Mr(this.attrs, t || e.defaultAttrs || Jd) && L.sameSet(this.marks, r || L.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new gs(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new gs(this.type, this.attrs, this.content, e);
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
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), l = i.start(o), c = i.node(o).content.cut(i.pos - l, s.pos - l);
    return new x(c, i.depth - o, s.depth - o);
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
    return jd(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
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
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return On.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return On.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (s) => (r.isInSet(s.marks) && (i = !0), !i)), i;
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ta(this.marks, e);
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
  canReplace(e, t, r = b.empty, i = 0, s = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, i, s), l = o && o.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = i; a < s; a++)
      if (!this.type.allowsMarks(r.child(a).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let s = this.contentMatchAt(e).matchType(r), o = s && s.matchFragment(this.content, t);
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
    let i = b.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, i, r);
  }
};
Ot.prototype.text = void 0;
class Er extends Ot {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ta(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new Er(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Er(this.type, this.attrs, e, this.marks);
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
function Ta(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class Lt {
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
    let r = new qd(e, t);
    if (r.next == null)
      return Lt.empty;
    let i = va(r);
    r.next && r.err("Unexpected trailing text");
    let s = eu(Zd(i));
    return tu(s, r), s;
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
    let i = this;
    for (let s = t; i && s < r; s++)
      i = i.matchType(e.child(s).type);
    return i;
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
    let i = [this];
    function s(o, l) {
      let a = o.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return b.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: d, next: u } = o.next[c];
        if (!(d.isText || d.hasRequiredAttrs()) && i.indexOf(u) == -1) {
          i.push(u);
          let h = s(u, l.concat(d));
          if (h)
            return h;
        }
      }
      return null;
    }
    return s(this, []);
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
      let i = r.shift(), s = i.match;
      if (s.matchType(e)) {
        let o = [];
        for (let l = i; l.type; l = l.via)
          o.push(l.type);
        return o.reverse();
      }
      for (let o = 0; o < s.next.length; o++) {
        let { type: l, next: a } = s.next[o];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!i.type || a.validEnd) && (r.push({ match: l.contentMatch, type: l, via: i }), t[l.name] = !0);
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
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let s = i + (r.validEnd ? "*" : " ") + " ";
      for (let o = 0; o < r.next.length; o++)
        s += (o ? ", " : "") + r.next[o].type.name + "->" + e.indexOf(r.next[o].next);
      return s;
    }).join(`
`);
  }
}
Lt.empty = new Lt(!0);
class qd {
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
function va(n) {
  let e = [];
  do
    e.push(Ud(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Ud(n) {
  let e = [];
  do
    e.push(Gd(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Gd(n) {
  let e = Qd(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = Yd(n, e);
    else
      break;
  return e;
}
function Ro(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function Yd(n, e) {
  let t = Ro(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Ro(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function Xd(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let s in t) {
    let o = t[s];
    o.groups.indexOf(e) > -1 && i.push(o);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function Qd(n) {
  if (n.eat("(")) {
    let e = va(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Xd(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Zd(n) {
  let e = [[]];
  return i(s(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(o, l, a) {
    let c = { term: a, to: l };
    return e[o].push(c), c;
  }
  function i(o, l) {
    o.forEach((a) => a.to = l);
  }
  function s(o, l) {
    if (o.type == "choice")
      return o.exprs.reduce((a, c) => a.concat(s(c, l)), []);
    if (o.type == "seq")
      for (let a = 0; ; a++) {
        let c = s(o.exprs[a], l);
        if (a == o.exprs.length - 1)
          return c;
        i(c, l = t());
      }
    else if (o.type == "star") {
      let a = t();
      return r(l, a), i(s(o.expr, a), a), [r(a)];
    } else if (o.type == "plus") {
      let a = t();
      return i(s(o.expr, l), a), i(s(o.expr, a), a), [r(a)];
    } else {
      if (o.type == "opt")
        return [r(l)].concat(s(o.expr, l));
      if (o.type == "range") {
        let a = l;
        for (let c = 0; c < o.min; c++) {
          let d = t();
          i(s(o.expr, a), d), a = d;
        }
        if (o.max == -1)
          i(s(o.expr, a), a);
        else
          for (let c = o.min; c < o.max; c++) {
            let d = t();
            r(a, d), i(s(o.expr, a), d), a = d;
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
function Aa(n, e) {
  return e - n;
}
function Do(n, e) {
  let t = [];
  return r(e), t.sort(Aa);
  function r(i) {
    let s = n[i];
    if (s.length == 1 && !s[0].term)
      return r(s[0].to);
    t.push(i);
    for (let o = 0; o < s.length; o++) {
      let { term: l, to: a } = s[o];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function eu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Do(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let d = 0; d < i.length; d++)
          i[d][0] == l && (c = i[d][1]);
        Do(n, a).forEach((d) => {
          c || i.push([l, c = []]), c.indexOf(d) == -1 && c.push(d);
        });
      });
    });
    let s = e[r.join(",")] = new Lt(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let l = i[o][1].sort(Aa);
      s.next.push({ type: i[o][0], next: e[l.join(",")] || t(l) });
    }
    return s;
  }
}
function tu(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      o.push(a.name), s && !(a.isText || a.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Ea(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Na(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let s = n[r];
      if (s.hasDefault)
        i = s.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function Oa(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new nu(n[t]);
  return e;
}
let Io = class Ra {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Oa(r.attrs), this.defaultAttrs = Ea(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == Lt.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Na(this.attrs, e);
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
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(b.empty, !0);
    return s ? new Ot(this, e, t.append(s), L.setFrom(r)) : null;
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
    e.forEach((s, o) => r[s] = new Ra(s, t, o));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let s in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
class nu {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class yi {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = Oa(i.attrs), this.excluded = null;
    let s = Ea(this.attrs);
    this.instance = s ? new L(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new L(this, Na(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new yi(s, i++, t, o)), r;
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
class ru {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = U.from(e.nodes), t.marks = U.from(e.marks || {}), this.nodes = Io.compile(this.spec.nodes, this), this.marks = yi.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", l = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = Lt.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = l == "_" ? null : l ? Lo(this, l.split(" ")) : l == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : Lo(this, o.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Io) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new Er(r, r.defaultAttrs, e, L.setFrom(t));
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
function Lo(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], s = n.marks[i], o = s;
    if (s)
      t.push(s);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (i == "_" || a.spec.group && a.spec.group.split(" ").indexOf(i) > -1) && t.push(o = a);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function iu(n) {
  return n.tag != null;
}
function su(n) {
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
    t.forEach((i) => {
      if (iu(i))
        this.tags.push(i);
      else if (su(i)) {
        let s = /[^=]*/.exec(i.style)[0];
        r.indexOf(s) < 0 && r.push(s), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let s = e.nodes[i.node];
      return s.contentMatch.matchType(s);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Bo(this, t, !1);
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
    let r = new Bo(this, t, !0);
    return r.addAll(e, t.from, t.to), x.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (au(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
        if (s.getAttrs) {
          let o = s.getAttrs(e);
          if (o === !1)
            continue;
          s.attrs = o || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, i) {
    for (let s = i ? this.styles.indexOf(i) + 1 : 0; s < this.styles.length; s++) {
      let o = this.styles[s], l = o.style;
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
    function r(i) {
      let s = i.priority == null ? 50 : i.priority, o = 0;
      for (; o < t.length; o++) {
        let l = t[o];
        if ((l.priority == null ? 50 : l.priority) < s)
          break;
      }
      t.splice(o, 0, i);
    }
    for (let i in e.marks) {
      let s = e.marks[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = $o(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = $o(o)), o.node || o.ignore || o.mark || (o.node = i);
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
const Da = {
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
}, ou = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Ia = { ol: !0, ul: !0 }, Nr = 1, Or = 2, Cn = 4;
function Po(n, e, t) {
  return e != null ? (e ? Nr : 0) | (e === "full" ? Or : 0) : n && n.whitespace == "pre" ? Nr | Or : t & ~Cn;
}
class rr {
  constructor(e, t, r, i, s, o, l) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = i, this.solid = s, this.options = l, this.content = [], this.activeMarks = L.none, this.stashMarks = [], this.match = o || (l & Cn ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(b.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Nr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
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
      let i = r[t];
      (this.type ? this.type.allowsMarkType(i.type) : cu(i.type, e)) && !i.isInSet(this.activeMarks) && (this.activeMarks = i.addToSet(this.activeMarks), this.pendingMarks = i.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Da.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Bo {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let i = t.topNode, s, o = Po(null, t.preserveWhitespace, 0) | (r ? Cn : 0);
    i ? s = new rr(i.type, i.attrs, L.none, L.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new rr(null, null, L.none, L.none, !0, null, o) : s = new rr(e.schema.topNodeType, null, L.none, L.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let i = this.readStyles(e.style);
    if (!i)
      return;
    let [s, o] = i, l = this.top;
    for (let a = 0; a < o.length; a++)
      this.removePendingMark(o[a], l);
    for (let a = 0; a < s.length; a++)
      this.addPendingMark(s[a]);
    t();
    for (let a = 0; a < s.length; a++)
      this.removePendingMark(s[a], l);
    for (let a = 0; a < o.length; a++)
      this.addPendingMark(o[a]);
  }
  addTextNode(e) {
    let t = e.nodeValue, r = this.top;
    if (r.options & Or || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & Nr)
        r.options & Or ? t = t.replace(/\r\n?/g, `
`) : t = t.replace(/\r?\n|\r/g, " ");
      else if (t = t.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1) {
        let i = r.content[r.content.length - 1], s = e.previousSibling;
        (!i || s && s.nodeName == "BR" || i.isText && /[ \t\r\n\u000c]$/.test(i.text)) && (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t) {
    let r = e.nodeName.toLowerCase(), i;
    Ia.hasOwnProperty(r) && this.parser.normalizeLists && lu(e);
    let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (i = this.parser.matchTag(e, this, t));
    if (s ? s.ignore : ou.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!s || s.skip || s.closeParent) {
      s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
      let o, l = this.top, a = this.needsBlock;
      if (Da.hasOwnProperty(r))
        l.content.length && l.content[0].isInline && this.open && (this.open--, l = this.top), o = !0, l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      s && s.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), o && this.sync(l), this.needsBlock = a;
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, s, s.consuming === !1 ? i : void 0);
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
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let s = this.parser.matchedStyles[i], o = e.getPropertyValue(s);
        if (o)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(s, o, this, l);
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
    let i, s, o;
    t.node ? (s = this.parser.schema.nodes[t.node], s.isLeaf ? this.insertNode(s.create(t.attrs)) || this.leafFallback(e) : i = this.enter(s, t.attrs || null, t.preserveWhitespace)) : (o = this.parser.schema.marks[t.mark].create(t.attrs), this.addPendingMark(o));
    let l = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a);
    }
    i && this.sync(l) && this.open--, o && this.removePendingMark(o, l);
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r) {
    let i = t || 0;
    for (let s = t ? e.childNodes[t] : e.firstChild, o = r == null ? null : e.childNodes[r]; s != o; s = s.nextSibling, ++i)
      this.findAtPoint(e, i), this.addDOM(s);
    this.findAtPoint(e, i);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e) {
    let t, r;
    for (let i = this.open; i >= 0; i--) {
      let s = this.nodes[i], o = s.findWrapping(e);
      if (o && (!t || t.length > o.length) && (t = o, r = s, !o.length) || s.solid)
        break;
    }
    if (!t)
      return !1;
    this.sync(r);
    for (let i = 0; i < t.length; i++)
      this.enterInner(t[i], null, !1);
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
      for (let i = 0; i < e.marks.length; i++)
        (!t.type || t.type.allowsMarkType(e.marks[i].type)) && (r = e.marks[i].addToSet(r));
      return t.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r) {
    let i = this.findPlace(e.create(t));
    return i && this.enterInner(e, t, !0, r), i;
  }
  // Open a node of the given type
  enterInner(e, t = null, r = !1, i) {
    this.closeExtra();
    let s = this.top;
    s.applyPending(e), s.match = s.match && s.match.matchType(e);
    let o = Po(e, i, s.options);
    s.options & Cn && s.content.length == 0 && (o |= Cn), this.nodes.push(new rr(e, t, s.activeMarks, s.pendingMarks, r, null, o)), this.open++;
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
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
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
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
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
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= s; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let d = a > 0 || a == 0 && i ? this.nodes[a].type : r && a >= s ? r.node(a - s).type : null;
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
    let t = du(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, t) {
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r];
      if (i.pendingMarks.lastIndexOf(e) > -1)
        i.pendingMarks = e.removeFromSet(i.pendingMarks);
      else {
        i.activeMarks = e.removeFromSet(i.activeMarks);
        let o = i.popFromStashMark(e);
        o && i.type && i.type.allowsMarkType(o.type) && (i.activeMarks = o.addToSet(i.activeMarks));
      }
      if (i == t)
        break;
    }
  }
}
function lu(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ia.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function au(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function $o(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function cu(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let s = [], o = (l) => {
      s.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: d } = l.edge(a);
        if (c == e || s.indexOf(d) < 0 && o(d))
          return !0;
      }
    };
    if (o(i.contentMatch))
      return !0;
  }
}
function du(n, e) {
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
    r || (r = Hi(t).createDocumentFragment());
    let i = r, s = [];
    return e.forEach((o) => {
      if (s.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < s.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(s[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < s.length; )
          i = s.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], d = this.serializeMark(c, o.isInline, t);
          d && (s.push([c, i]), i.appendChild(d.dom), i = d.contentDOM || d.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(o, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: i } = ze.renderSpec(Hi(t), this.nodes[e.type.name](e));
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
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
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let s = this.serializeMark(e.marks[i], e.isInline, t);
      s && ((s.contentDOM || s.dom).appendChild(r), r = s.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && ze.renderSpec(Hi(r), i(e, t));
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
    let i = t[0], s = i.indexOf(" ");
    s > 0 && (r = i.slice(0, s), i = i.slice(s + 1));
    let o, l = r ? e.createElementNS(r, i) : e.createElement(i), a = t[1], c = 1;
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
    let t = zo(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return zo(e.marks);
  }
}
function zo(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Hi(n) {
  return n.document || window.document;
}
const La = 65535, Pa = Math.pow(2, 16);
function uu(n, e) {
  return n + e * Pa;
}
function Ho(n) {
  return n & La;
}
function hu(n) {
  return (n - (n & La)) / Pa;
}
const Ba = 1, $a = 2, gr = 4, za = 8;
class ys {
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
    return (this.delInfo & za) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Ba | gr)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & ($a | gr)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & gr) > 0;
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
    let t = 0, r = Ho(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + hu(e);
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
    let i = 0, s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], d = this.ranges[l + o], u = a + c;
      if (e <= u) {
        let h = c ? e == a ? -1 : e == u ? 1 : t : t, f = a + i + (h < 0 ? 0 : d);
        if (r)
          return f;
        let p = e == (t < 0 ? a : u) ? null : uu(l / 3, e - a), m = e == a ? $a : e == u ? Ba : gr;
        return (t < 0 ? e != a : e != u) && (m |= za), new ys(f, m, p);
      }
      i += d - c;
    }
    return r ? e + i : new ys(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Ho(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], d = a + c;
      if (e <= d && l == i * 3)
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
    for (let i = 0, s = 0; i < this.ranges.length; i += 3) {
      let o = this.ranges[i], l = o - (this.inverted ? s : 0), a = o + (this.inverted ? 0 : s), c = this.ranges[i + t], d = this.ranges[i + r];
      e(l, l + c, a, a + d), s += d - c;
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
class Yt {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e = [], t, r = 0, i = e.length) {
    this.maps = e, this.mirror = t, this.from = r, this.to = i;
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
      let i = e.getMirror(t);
      this.appendMap(e.maps[t], i != null && i < t ? r + i : void 0);
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
      let i = e.getMirror(t);
      this.appendMap(e.maps[t].invert(), i != null && i > t ? r - i - 1 : void 0);
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
    let i = 0;
    for (let s = this.from; s < this.to; s++) {
      let o = this.maps[s], l = o.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(s);
        if (a != null && a > s && a < this.to) {
          s = a, e = this.maps[a].recover(l.recover);
          continue;
        }
      }
      i |= l.delInfo, e = l.pos;
    }
    return r ? e : new ys(e, i, null);
  }
}
const Fi = /* @__PURE__ */ Object.create(null);
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
    let r = Fi[t.stepType];
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
    if (e in Fi)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Fi[e] = t, t.prototype.jsonID = e, t;
  }
}
class j {
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
    return new j(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new j(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return j.ok(e.replace(t, r, i));
    } catch (s) {
      if (s instanceof Tr)
        return j.fail(s.message);
      throw s;
    }
  }
}
function Us(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(Us(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
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
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new x(Us(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return j.fromReplace(e, this.from, this.to, s);
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
    let t = e.slice(this.from, this.to), r = new x(Us(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return j.fromReplace(e, this.from, this.to, r);
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
      return j.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return j.fromReplace(e, this.pos, this.pos + 1, new x(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new ct(this.pos, t.marks[i]);
        return new ct(this.pos, this.mark);
      }
    }
    return new rn(this.pos, this.mark);
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
      return j.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return j.fromReplace(e, this.pos, this.pos + 1, new x(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new ct(this.pos, this.mark);
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
class W extends te {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && bs(e, this.from, this.to) ? j.fail("Structure replace would overwrite content") : j.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new he([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new W(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new W(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof W) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? x.empty : new x(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new W(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? x.empty : new x(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new W(e.from, this.to, t, this.structure);
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
    return new W(t.from, t.to, x.fromJSON(e, t.slice), !!t.structure);
  }
}
te.jsonID("replace", W);
class _ extends te {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, i, s, o, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = s, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (bs(e, this.from, this.gapFrom) || bs(e, this.gapTo, this.to)))
      return j.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return j.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? j.fromReplace(e, this.from, this.to, r) : j.fail("Content does not fit in gap");
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
    return new _(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), s = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new _(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new _(t.from, t.to, t.gapFrom, t.gapTo, x.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
te.jsonID("replaceAround", _);
function bs(n, e, t) {
  let r = n.resolve(e), i = t - e, s = r.depth;
  for (; i > 0 && s > 0 && r.indexAfter(s) == r.node(s).childCount; )
    s--, i--;
  if (i > 0) {
    let o = r.node(s).maybeChild(r.indexAfter(s));
    for (; i > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, i--;
    }
  }
  return !1;
}
function fu(n, e, t, r) {
  let i = [], s = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, d) => {
    if (!a.isInline)
      return;
    let u = a.marks;
    if (!r.isInSet(u) && d.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), f = Math.min(c + a.nodeSize, t), p = r.addToSet(u);
      for (let m = 0; m < u.length; m++)
        u[m].isInSet(p) || (o && o.to == h && o.mark.eq(u[m]) ? o.to = f : i.push(o = new He(h, f, u[m])));
      l && l.to == h ? l.to = f : s.push(l = new at(h, f, r));
    }
  }), i.forEach((a) => n.step(a)), s.forEach((a) => n.step(a));
}
function pu(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    s++;
    let a = null;
    if (r instanceof yi) {
      let c = o.marks, d;
      for (; d = r.isInSet(c); )
        (a || (a = [])).push(d), c = d.removeFromSet(c);
    } else r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, t);
      for (let d = 0; d < a.length; d++) {
        let u = a[d], h;
        for (let f = 0; f < i.length; f++) {
          let p = i[f];
          p.step == s - 1 && u.eq(i[f].style) && (h = p);
        }
        h ? (h.to = c, h.step = s) : i.push({ style: u, from: Math.max(l, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => n.step(new He(o.from, o.to, o.style)));
}
function Ha(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], l = e + 1;
  for (let a = 0; a < s.childCount; a++) {
    let c = s.child(a), d = l + c.nodeSize, u = r.matchType(c.type);
    if (!u)
      o.push(new W(l, d, x.empty));
    else {
      r = u;
      for (let h = 0; h < c.marks.length; h++)
        t.allowsMarkType(c.marks[h].type) || n.step(new He(l, d, c.marks[h]));
      if (i && c.isText && t.whitespace != "pre") {
        let h, f = /\r?\n|\r/g, p;
        for (; h = f.exec(c.text); )
          p || (p = new x(b.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new W(l + h.index, l + h.index + h[0].length, p));
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
function mu(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function hn(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let i = n.$from.node(r), s = n.$from.index(r), o = n.$to.indexAfter(r);
    if (r < n.depth && i.canReplace(s, o, t))
      return r;
    if (r == 0 || i.type.spec.isolating || !mu(i, s, o))
      break;
  }
  return null;
}
function gu(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), l = i.after(s + 1), a = o, c = l, d = b.empty, u = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, d = b.from(r.node(p).copy(d)), u++) : a--;
  let h = b.empty, f = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, h = b.from(i.node(p).copy(h)), f++) : c++;
  n.step(new _(a, c, o, l, new x(d.append(h), u, f), d.size - u, !0));
}
function Gs(n, e, t = null, r = n) {
  let i = yu(n, e), s = i && bu(r, e);
  return s ? i.map(Fo).concat({ type: e, attrs: t }).concat(s.map(Fo)) : null;
}
function Fo(n) {
  return { type: n, attrs: null };
}
function yu(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function bu(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function ku(n, e, t) {
  let r = b.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = t[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = b.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new _(i, s, i, s, new x(r, 0, 0), t.length, !0));
}
function wu(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, i) && Su(n.doc, n.mapping.slice(s).map(l), r)) {
      let a = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", f = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !f ? a = !1 : !h && f && (a = !0);
      }
      a === !1 && Cu(n, o, l, s), Ha(n, n.mapping.slice(s).map(l, 1), r, void 0, a === null);
      let c = n.mapping.slice(s), d = c.map(l, 1), u = c.map(l + o.nodeSize, 1);
      return n.step(new _(d, u, d + 1, u - 1, new x(b.from(r.create(i, null, o.marks)), 0, 0), 1, !0)), a === !0 && xu(n, o, l, s), !1;
    }
  });
}
function xu(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.isText) {
      let o, l = /\r?\n|\r/g;
      for (; o = l.exec(i.text); ) {
        let a = n.mapping.slice(r).map(t + 1 + s + o.index);
        n.replaceWith(a, a + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Cu(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Su(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function Mu(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new _(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new x(b.from(o), 0, 0), 1, !0));
}
function Xt(n, e, t = 1, r) {
  let i = n.resolve(e), s = i.depth - t, o = r && r[r.length - 1] || i.parent;
  if (s < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, d = t - 2; c > s; c--, d--) {
    let u = i.node(c), h = i.index(c);
    if (u.type.spec.isolating)
      return !1;
    let f = u.content.cutByIndex(h, u.childCount), p = r && r[d + 1];
    p && (f = f.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[d] || u;
    if (!u.canReplace(h + 1, u.childCount) || !m.type.validContent(f))
      return !1;
  }
  let l = i.indexAfter(s), a = r && r[0];
  return i.node(s).canReplaceWith(l, l, a ? a.type : i.node(s + 1).type);
}
function Tu(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = b.empty, o = b.empty;
  for (let l = i.depth, a = i.depth - t, c = t - 1; l > a; l--, c--) {
    s = b.from(i.node(l).copy(s));
    let d = r && r[c];
    o = b.from(d ? d.type.create(d.attrs, o) : i.node(l).copy(o));
  }
  n.step(new W(e, e, new x(s.append(o), t, t), !0));
}
function yt(n, e) {
  let t = n.resolve(e), r = t.index();
  return Fa(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Fa(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function bi(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, l = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), l++, o = r.node(i).maybeChild(l)) : (s = r.node(i).maybeChild(l - 1), o = r.node(i + 1)), s && !s.isTextblock && Fa(s, o) && r.node(i).canReplace(l, l + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function vu(n, e, t) {
  let r = new W(e - t, e + t, x.empty, !0);
  n.step(r);
}
function Au(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.index(i);
      if (r.node(i).canReplaceWith(s, s, t))
        return r.before(i + 1);
      if (s > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.indexAfter(i);
      if (r.node(i).canReplaceWith(s, s, t))
        return r.after(i + 1);
      if (s < r.node(i).childCount)
        return null;
    }
  return null;
}
function Va(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let s = 0; s < t.openStart; s++)
    i = i.firstChild.content;
  for (let s = 1; s <= (t.openStart == 0 && t.size ? 2 : 1); s++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), d = !1;
      if (s == 1)
        d = c.canReplace(a, a, i);
      else {
        let u = c.contentMatchAt(a).findWrapping(i.firstChild.type);
        d = u && c.canReplaceWith(a, a, u[0]);
      }
      if (d)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function ki(n, e, t = e, r = x.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return ja(i, s, r) ? new W(e, t, r) : new Eu(i, s, r).fit();
}
function ja(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Eu {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = b.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = b.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let s = this.placed, o = r.depth, l = i.depth;
    for (; o && l && s.childCount == 1; )
      s = s.firstChild.content, o--, l--;
    let a = new x(s, o, l);
    return e > -1 ? new _(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new W(r.pos, i.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, i = this.unplaced.openEnd; r < e; r++) {
      let s = t.firstChild;
      if (t.childCount > 1 && (i = 0), s.type.spec.isolating && i <= r) {
        e = r;
        break;
      }
      t = s.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i, s = null;
        r ? (s = Vi(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], d, u = null;
          if (t == 1 && (o ? c.matchType(o.type) || (u = c.fillBefore(b.from(o), !1)) : s && a.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, inject: u };
          if (t == 2 && o && (d = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, wrap: d };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Vi(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new x(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Vi(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new x(bn(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new x(bn(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: s }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (s)
      for (let m = 0; m < s.length; m++)
        this.openFrontierNode(s[m]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, d = [], { match: u, type: h } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        d.push(i.child(m));
      u = u.matchFragment(i);
    }
    let f = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c), g = u.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || a == 0 || m.content.size) && (u = g, d.push(Wa(m.mark(h.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let p = c == l.childCount;
    p || (f = -1), this.placed = kn(this.placed, t, b.from(d)), this.frontier[t].match = u, p && f < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < f; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? x.empty : new x(bn(o.content, e - 1, 1), e - 1, f < 0 ? o.openEnd : e - 1) : new x(bn(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !ji(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = ji(e, t, i, r, s);
      if (o) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], d = ji(e, l, c, a, !0);
          if (!d || d.childCount)
            continue e;
        }
        return { depth: t, fit: o, move: s ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = kn(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = kn(this.placed, this.depth, b.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(b.empty, !0);
    t.childCount && (this.placed = kn(this.placed, this.frontier.length, t));
  }
}
function bn(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(bn(n.firstChild.content, e - 1, t)));
}
function kn(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(kn(n.lastChild.content, e - 1, t)));
}
function Vi(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Wa(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Wa(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(b.empty, !0)))), n.copy(r);
}
function ji(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, o);
  return l && !Nu(t, s.content, o) ? l : null;
}
function Nu(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Ou(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Ru(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (ja(i, s, r))
    return n.step(new W(e, t, r));
  let o = Ka(i, n.doc.resolve(t));
  o[o.length - 1] == 0 && o.pop();
  let l = -(i.depth + 1);
  o.unshift(l);
  for (let h = i.depth, f = i.pos - 1; h > 0; h--, f--) {
    let p = i.node(h).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(h) > -1 ? l = h : i.before(h) == f && o.splice(1, 0, -h);
  }
  let a = o.indexOf(l), c = [], d = r.openStart;
  for (let h = r.content, f = 0; ; f++) {
    let p = h.firstChild;
    if (c.push(p), f == r.openStart)
      break;
    h = p.content;
  }
  for (let h = d - 1; h >= 0; h--) {
    let f = c[h], p = Ou(f.type);
    if (p && !f.sameMarkup(i.node(Math.abs(l) - 1)))
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
        let k = i.node(g - 1), S = i.index(g - 1);
        if (k.canReplaceWith(S, S, p.type, p.marks))
          return n.replace(i.before(g), y ? s.after(g) : t, new x(_a(r.content, 0, r.openStart, f), f, r.openEnd));
      }
  }
  let u = n.steps.length;
  for (let h = o.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > u)); h--) {
    let f = o[h];
    f < 0 || (e = i.before(f), t = s.after(f));
  }
}
function _a(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(_a(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(b.empty, !0));
  }
  return n;
}
function Du(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Au(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new x(b.from(r), 0, 0));
}
function Iu(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Ka(r, i);
  for (let o = 0; o < s.length; o++) {
    let l = s[o], a = o == s.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), i.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), i.indexAfter(l - 1))))
      return n.delete(r.before(l), i.after(l));
  }
  for (let o = 1; o <= r.depth && o <= i.depth; o++)
    if (e - r.start(o) == r.depth - o && t > r.end(o) && i.end(o) - t != i.depth - o)
      return n.delete(r.before(o), t);
  n.delete(e, t);
}
function Ka(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
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
      return j.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return j.fromReplace(e, this.pos, this.pos + 1, new x(b.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return he.empty;
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
class Rn extends te {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return j.ok(r);
  }
  getMap() {
    return he.empty;
  }
  invert(e) {
    return new Rn(this.attr, e.attrs[this.attr]);
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
    return new Rn(t.attr, t.value);
  }
}
te.jsonID("docAttr", Rn);
let sn = class extends Error {
};
sn = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
sn.prototype = Object.create(Error.prototype);
sn.prototype.constructor = sn;
sn.prototype.name = "TransformError";
class Ys {
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
    let i = ki(this.doc, e, t, r);
    return i && this.step(i), this;
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
    return Ru(this, e, t, r), this;
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
    return Du(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Iu(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return gu(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return vu(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return ku(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return wu(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return Mu(this, e, t, r, i), this;
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
    return this.step(new Rn(e, t)), this;
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
    return Tu(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return fu(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return pu(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Ha(this, e, t, r), this;
  }
}
const Wi = /* @__PURE__ */ Object.create(null);
class A {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new Ja(e.min(t), e.max(t))];
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
    let r = t.content.lastChild, i = null;
    for (let l = 0; l < t.openEnd; l++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], d = e.mapping.slice(s);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? x.empty : t), l == 0 && Wo(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: o, $to: l } = i[s], a = e.mapping.slice(r), c = a.map(o.pos), d = a.map(l.pos);
      s ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), Wo(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new v(e) : Kt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Kt(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Kt(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Te(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Kt(e, e, 0, 0, 1) || new Te(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Kt(e, e, e.content.size, e.childCount, -1) || new Te(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Wi[t.type];
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
    if (e in Wi)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Wi[e] = t, t.prototype.jsonID = e, t;
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
    return v.between(this.$anchor, this.$head).getBookmark();
  }
}
A.prototype.visible = !0;
class Ja {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Vo = !1;
function jo(n) {
  !Vo && !n.parent.inlineContent && (Vo = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class v extends A {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    jo(e), jo(t), super(e, t);
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
    let i = e.resolve(t.map(this.anchor));
    return new v(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = x.empty) {
    if (super.replace(e, t), t == x.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof v && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new wi(this.anchor, this.head);
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
    return new v(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
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
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let s = A.findFrom(t, r, !0) || A.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return A.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (A.findFrom(e, -r, !0) || A.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new v(e, t);
  }
}
A.jsonID("text", v);
class wi {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new wi(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return v.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class T extends A {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), s = e.resolve(i);
    return r ? A.near(s) : new T(s);
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
    return new Xs(this.anchor);
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
A.jsonID("node", T);
class Xs {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new wi(r, r) : new Xs(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && T.isSelectable(r) ? new T(t) : A.near(t);
  }
}
class Te extends A {
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
    return new Te(e);
  }
  map(e) {
    return new Te(e);
  }
  eq(e) {
    return e instanceof Te;
  }
  getBookmark() {
    return Lu;
  }
}
A.jsonID("all", Te);
const Lu = {
  map() {
    return this;
  },
  resolve(n) {
    return new Te(n);
  }
};
function Kt(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return v.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!s && T.isSelectable(l))
        return T.create(n, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = Kt(n, l, t + i, i < 0 ? l.childCount : 0, i, s);
      if (a)
        return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function Wo(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof W || i instanceof _))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((l, a, c, d) => {
    o == null && (o = d);
  }), n.setSelection(A.near(n.doc.resolve(o), t));
}
const _o = 1, ir = 2, Ko = 4;
class Pu extends Ys {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | _o) & ~ir, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & _o) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= ir, this;
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
    return (this.updated & ir) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~ir, this.storedMarks = null;
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
    let i = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(i.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), r = r ?? t, !e)
        return this.deleteRange(t, r);
      let s = this.storedMarks;
      if (!s) {
        let o = this.doc.resolve(t);
        s = r == t ? o.marks() : o.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, i.text(e, s)), this.selection.empty || this.setSelection(A.near(this.selection.$to)), this;
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
    return this.updated |= Ko, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Ko) > 0;
  }
}
function Jo(n, e) {
  return !e || !n ? n : n.bind(e);
}
class wn {
  constructor(e, t, r) {
    this.name = e, this.init = Jo(t.init, r), this.apply = Jo(t.apply, r);
  }
}
const Bu = [
  new wn("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new wn("selection", {
    init(n, e) {
      return n.selection || A.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new wn("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new wn("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class _i {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Bu.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new wn(r.key, r.spec.state, r));
    });
  }
}
class Ut {
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
        let i = this.config.plugins[r];
        if (i.spec.filterTransaction && !i.spec.filterTransaction.call(i, e, this))
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
    let t = [e], r = this.applyInner(e), i = null;
    for (; ; ) {
      let s = !1;
      for (let o = 0; o < this.config.plugins.length; o++) {
        let l = this.config.plugins[o];
        if (l.spec.appendTransaction) {
          let a = i ? i[o].n : 0, c = i ? i[o].state : this, d = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (d && r.filterTransaction(d, o)) {
            if (d.setMeta("appendedTransaction", e), !i) {
              i = [];
              for (let u = 0; u < this.config.plugins.length; u++)
                i.push(u < o ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(d), r = r.applyInner(d), s = !0;
          }
          i && (i[o] = { state: r, n: t.length });
        }
      }
      if (!s)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new Ut(this.config), r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let s = r[i];
      t[s.name] = s.apply(e, this[s.name], this, t);
    }
    return t;
  }
  /**
  Start a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new Pu(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new _i(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Ut(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
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
    let t = new _i(this.schema, e.plugins), r = t.fields, i = new Ut(t);
    for (let s = 0; s < r.length; s++) {
      let o = r[s].name;
      i[o] = this.hasOwnProperty(o) ? this[o] : r[s].init(e, i);
    }
    return i;
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
        let i = e[r], s = i.spec.state;
        s && s.toJSON && (t[r] = s.toJSON.call(i, this[i.key]));
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
    let i = new _i(e.schema, e.plugins), s = new Ut(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = Ot.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = A.fromJSON(s.doc, t.selection);
      else if (o.name == "storedMarks")
        t.storedMarks && (s.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let a = r[l], c = a.spec.state;
            if (a.key == o.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              s[o.name] = c.fromJSON.call(a, e, t[l], s);
              return;
            }
          }
        s[o.name] = o.init(e, s);
      }
    }), s;
  }
}
function qa(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = qa(i, e, {})), t[r] = i;
  }
  return t;
}
class X {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && qa(e.props, this, this.props), this.key = e.key ? e.key.key : Ua("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Ki = /* @__PURE__ */ Object.create(null);
function Ua(n) {
  return n in Ki ? n + "$" + ++Ki[n] : (Ki[n] = 0, n + "$");
}
class ue {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Ua(e);
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
}, Dn = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let ks = null;
const Ue = function(n, e, t) {
  let r = ks || (ks = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, $u = function() {
  ks = null;
}, Pt = function(n, e, t, r) {
  return t && (qo(n, e, t, r, -1) || qo(n, e, t, r, 1));
}, zu = /^(img|br|input|textarea|hr)$/i;
function qo(n, e, t, r, i) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : $e(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || qn(n) || zu.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = G(n) + (i < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (i < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = i < 0 ? $e(n) : 0;
    } else
      return !1;
  }
}
function $e(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Hu(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = $e(n);
    } else if (n.parentNode && !qn(n))
      e = G(n), n = n.parentNode;
    else
      return null;
  }
}
function Fu(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !qn(n))
      e = G(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function Vu(n, e, t) {
  for (let r = e == 0, i = e == $e(n); r || i; ) {
    if (n == t)
      return !0;
    let s = G(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == $e(n);
  }
}
function qn(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const xi = function(n) {
  return n.focusNode && Pt(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function xt(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function ju(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Wu(n, e, t) {
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
const Fe = typeof navigator < "u" ? navigator : null, Uo = typeof document < "u" ? document : null, bt = Fe && Fe.userAgent || "", ws = /Edge\/(\d+)/.exec(bt), Ga = /MSIE \d/.exec(bt), xs = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(bt), de = !!(Ga || xs || ws), ut = Ga ? document.documentMode : xs ? +xs[1] : ws ? +ws[1] : 0, ve = !de && /gecko\/(\d+)/i.test(bt);
ve && +(/Firefox\/(\d+)/.exec(bt) || [0, 0])[1];
const Cs = !de && /Chrome\/(\d+)/.exec(bt), re = !!Cs, _u = Cs ? +Cs[1] : 0, ie = !de && !!Fe && /Apple Computer/.test(Fe.vendor), on = ie && (/Mobile\/\w+/.test(bt) || !!Fe && Fe.maxTouchPoints > 2), be = on || (Fe ? /Mac/.test(Fe.platform) : !1), Ku = Fe ? /Win/.test(Fe.platform) : !1, Se = /Android \d/.test(bt), Un = !!Uo && "webkitFontSmoothing" in Uo.documentElement.style, Ju = Un ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function qu(n) {
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
function Ke(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Uu(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function Go(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; o = Dn(o)) {
    if (o.nodeType != 1)
      continue;
    let l = o, a = l == s.body, c = a ? qu(s) : Uu(l), d = 0, u = 0;
    if (e.top < c.top + Ke(r, "top") ? u = -(c.top - e.top + Ke(i, "top")) : e.bottom > c.bottom - Ke(r, "bottom") && (u = e.bottom - e.top > c.bottom - c.top ? e.top + Ke(i, "top") - c.top : e.bottom - c.bottom + Ke(i, "bottom")), e.left < c.left + Ke(r, "left") ? d = -(c.left - e.left + Ke(i, "left")) : e.right > c.right - Ke(r, "right") && (d = e.right - c.right + Ke(i, "right")), d || u)
      if (a)
        s.defaultView.scrollBy(d, u);
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
function Gu(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let s = (e.left + e.right) / 2, o = t + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let l = n.root.elementFromPoint(s, o);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      r = l, i = a.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: Ya(n.dom) };
}
function Ya(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Dn(r))
    ;
  return e;
}
function Yu({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Xa(t, r == 0 ? 0 : r - e);
}
function Xa(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let jt = null;
function Xu(n) {
  if (n.setActive)
    return n.setActive();
  if (jt)
    return n.focus(jt);
  let e = Ya(n);
  n.focus(jt == null ? {
    get preventScroll() {
      return jt = { preventScroll: !0 }, !0;
    }
  } : void 0), jt || (jt = !1, Xa(e, 0));
}
function Qa(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, l = e.top, a, c;
  for (let d = n.firstChild, u = 0; d; d = d.nextSibling, u++) {
    let h;
    if (d.nodeType == 1)
      h = d.getClientRects();
    else if (d.nodeType == 3)
      h = Ue(d).getClientRects();
    else
      continue;
    for (let f = 0; f < h.length; f++) {
      let p = h[f];
      if (p.top <= o && p.bottom >= l) {
        o = Math.max(p.bottom, o), l = Math.min(p.top, l);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = d, r = m, i = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, d.nodeType == 1 && m && (s = u + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else p.top > e.top && !a && p.left <= e.left && p.right >= e.left && (a = d, c = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (s = u + 1);
    }
  }
  return !t && a && (t = a, i = c, r = 0), t && t.nodeType == 3 ? Qu(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : Qa(t, i);
}
function Qu(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let i = 0; i < t; i++) {
    r.setEnd(n, i + 1), r.setStart(n, i);
    let s = Ze(r, 1);
    if (s.top != s.bottom && Qs(e, s))
      return { node: n, offset: i + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function Qs(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Zu(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function eh(n, e, t) {
  let { node: r, offset: i } = Qa(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function th(n, e, t, r) {
  let i = -1;
  for (let s = e, o = !1; s != n.dom; ) {
    let l = n.docView.nearestDesc(s, !0);
    if (!l)
      return null;
    if (l.dom.nodeType == 1 && (l.node.isBlock && l.parent || !l.contentDOM)) {
      let a = l.dom.getBoundingClientRect();
      if (l.node.isBlock && l.parent && (!o && a.left > r.left || a.top > r.top ? i = l.posBefore : (!o && a.right < r.left || a.bottom < r.top) && (i = l.posAfter), o = !0), !l.contentDOM && i < 0 && !l.node.isText)
        return (l.node.isBlock ? r.top < (a.top + a.bottom) / 2 : r.left < (a.left + a.right) / 2) ? l.posBefore : l.posAfter;
    }
    s = l.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, -1);
}
function Za(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let l = o.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (Qs(e, c))
            return Za(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function nh(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = Wu(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!Qs(e, c) || (o = Za(n.dom, e, c), !o))
      return null;
  }
  if (ie)
    for (let c = o; r && c; c = Dn(c))
      c.draggable && (r = void 0);
  if (o = Zu(o, e), r) {
    if (ve && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let d = r.childNodes[i], u;
      d.nodeName == "IMG" && (u = d.getBoundingClientRect()).right <= e.left && u.bottom > e.top && i++;
    }
    let c;
    Un && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (l = th(n, r, i, e));
  }
  l == null && (l = eh(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function Yo(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Ze(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Yo(r))
      return r;
  }
  return Array.prototype.find.call(t, Yo) || n.getBoundingClientRect();
}
const rh = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ec(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = Un || ve;
  if (r.nodeType == 3)
    if (o && (rh.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let a = Ze(Ue(r, i, i), t);
      if (ve && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Ze(Ue(r, i - 1, i - 1), -1);
        if (c.top == a.top) {
          let d = Ze(Ue(r, i, i + 1), -1);
          if (d.top != a.top)
            return gn(d, d.left < c.left);
        }
      }
      return a;
    } else {
      let a = i, c = i, d = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, d = -1) : t >= 0 && i == r.nodeValue.length ? (a--, d = 1) : t < 0 ? a-- : c++, gn(Ze(Ue(r, a, c), d), d < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == $e(r))) {
      let a = r.childNodes[i - 1];
      if (a.nodeType == 1)
        return Ji(a.getBoundingClientRect(), !1);
    }
    if (s == null && i < $e(r)) {
      let a = r.childNodes[i];
      if (a.nodeType == 1)
        return Ji(a.getBoundingClientRect(), !0);
    }
    return Ji(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == $e(r))) {
    let a = r.childNodes[i - 1], c = a.nodeType == 3 ? Ue(a, $e(a) - (o ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return gn(Ze(c, 1), !1);
  }
  if (s == null && i < $e(r)) {
    let a = r.childNodes[i];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? Ue(a, 0, o ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return gn(Ze(c, -1), !0);
  }
  return gn(Ze(r.nodeType == 3 ? Ue(r) : r, -t), t >= 0);
}
function gn(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Ji(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function tc(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function ih(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return tc(n, e, () => {
    let { node: s } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(s, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        s = l.contentDOM || l.dom;
        break;
      }
      s = l.dom.parentNode;
    }
    let o = ec(n, i.pos, 1);
    for (let l = s.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = Ue(l, 0, l.nodeValue.length).getClientRects();
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
const sh = /[\u0590-\u08ac]/;
function oh(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, l = n.domSelection();
  return !sh.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? s : o : tc(n, e, () => {
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
let Xo = null, Qo = null, Zo = !1;
function lh(n, e, t) {
  return Xo == e && Qo == t ? Zo : (Xo = e, Qo = t, Zo = t == "up" || t == "down" ? ih(n, e, t) : oh(n, e, t));
}
const xe = 0, el = 1, St = 2, Ve = 3;
class Gn {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = xe, r.pmViewDesc = this;
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
      let i = this.children[t];
      if (i == e)
        return r;
      r += i.size;
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
        let s, o;
        if (e == this.contentDOM)
          s = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.previousSibling;
        }
        for (; s && !((o = s.pmViewDesc) && o.parent == this); )
          s = s.previousSibling;
        return s ? this.posBeforeChild(o) + o.size : this.posAtStart;
      } else {
        let s, o;
        if (e == this.contentDOM)
          s = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.nextSibling;
        }
        for (; s && !((o = s.pmViewDesc) && o.parent == this); )
          s = s.nextSibling;
        return s ? this.posBeforeChild(o) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM)
      i = t > G(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            i = !1;
            break;
          }
          if (s.previousSibling)
            break;
        }
      if (i == null && t == e.childNodes.length)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            i = !0;
            break;
          }
          if (s.nextSibling)
            break;
        }
    }
    return i ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let s = this.getDesc(i), o;
      if (s && (!t || s.node))
        if (r && (o = s.nodeDOM) && !(o.nodeType == 1 ? o.contains(e.nodeType == 1 ? e : e.parentNode) : o == e))
          r = !1;
        else
          return s;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let s = this.getDesc(i);
      if (s)
        return s.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t], s = r + i.size;
      if (r == e && s != r) {
        for (; !i.border && i.children.length; )
          i = i.children[0];
        return i;
      }
      if (e < s)
        return i.descAt(e - r - i.border);
      r = s;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, i = 0;
    for (let s = 0; r < this.children.length; r++) {
      let o = this.children[r], l = s + o.size;
      if (l > e || o instanceof rc) {
        i = e - s;
        break;
      }
      s = l;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof nc && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? G(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? G(s.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, s = -1;
    for (let o = r, l = 0; ; l++) {
      let a = this.children[l], c = o + a.size;
      if (i == -1 && e <= c) {
        let d = o + a.border;
        if (e >= d && t <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM))
          return a.parseRange(e, t, d);
        e = o;
        for (let u = l; u > 0; u--) {
          let h = this.children[u - 1];
          if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
            i = G(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let d = l + 1; d < this.children.length; d++) {
          let u = this.children[d];
          if (u.size && u.dom.parentNode == this.contentDOM && !u.emptyChildAt(-1)) {
            s = G(u.dom);
            break;
          }
          t += u.size;
        }
        s == -1 && (s = this.contentDOM.childNodes.length);
        break;
      }
      o = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: i, toOffset: s };
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
  setSelection(e, t, r, i = !1) {
    let s = Math.min(e, t), o = Math.max(e, t);
    for (let h = 0, f = 0; h < this.children.length; h++) {
      let p = this.children[h], m = f + p.size;
      if (s > f && o < m)
        return p.setSelection(e - f - p.border, t - f - p.border, r, i);
      f = m;
    }
    let l = this.domFromPos(e, e ? -1 : 1), a = t == e ? l : this.domFromPos(t, t ? -1 : 1), c = r.getSelection(), d = !1;
    if ((ve || ie) && e == t) {
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
    if (ve && c.focusNode && c.focusNode != a.node && c.focusNode.nodeType == 1) {
      let h = c.focusNode.childNodes[c.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && ie) && Pt(l.node, l.offset, c.anchorNode, c.anchorOffset) && Pt(a.node, a.offset, c.focusNode, c.focusOffset))
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
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let s = this.children[i], o = r + s.size;
      if (r == o ? e <= o && t >= r : e < o && t > r) {
        let l = r + s.border, a = o - s.border;
        if (e >= l && t <= a) {
          this.dirty = e == r || t == o ? St : el, e == l && t == a && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = Ve : s.markDirty(e - l, t - l);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? St : Ve;
      }
      r = o;
    }
    this.dirty = St;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? St : el;
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
class nc extends Gn {
  constructor(e, t, r, i) {
    let s, o = t.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!s)
        return i;
      if (s.parent)
        return s.parent.posBeforeChild(s);
    })), !t.type.spec.raw) {
      if (o.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(o), o = l;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = t, this.widget = t, s = this;
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
class ah extends Gn {
  constructor(e, t, r, i) {
    super(e, [], t, null), this.textDOM = r, this.text = i;
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
class Bt extends Gn {
  constructor(e, t, r, i) {
    super(e, [], r, i), this.mark = t;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
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
    let i = Bt.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = Ts(s, t, o, r)), e > 0 && (s = Ts(s, 0, e, r));
    for (let l = 0; l < s.length; l++)
      s[l].parent = i;
    return i.children = s, i;
  }
}
class ht extends Gn {
  constructor(e, t, r, i, s, o, l, a, c) {
    super(e, [], s, o), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = l;
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
  static create(e, t, r, i, s, o) {
    let l = s.nodeViews[t.type.name], a, c = l && l(t, s, () => {
      if (!a)
        return o;
      if (a.parent)
        return a.parent.posBeforeChild(a);
    }, r, i), d = c && c.dom, u = c && c.contentDOM;
    if (t.isText) {
      if (!d)
        d = document.createTextNode(t.text);
      else if (d.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else d || ({ dom: d, contentDOM: u } = ze.renderSpec(document, t.type.spec.toDOM(t)));
    !u && !t.isText && d.nodeName != "BR" && (d.hasAttribute("contenteditable") || (d.contentEditable = "false"), t.type.spec.draggable && (d.draggable = !0));
    let h = d;
    return d = oc(d, r, t), c ? a = new ch(e, t, r, i, d, u || null, h, c, s, o + 1) : t.isText ? new Ci(e, t, r, i, d, h, s) : new ht(e, t, r, i, d, u || null, h, s, o + 1);
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
    return this.dirty == xe && e.eq(this.node) && Ms(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, l = s && s.pos < 0, a = new uh(this, o && o.node, e);
    ph(this.node, this.innerDeco, (c, d, u) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e) : c.type.side >= 0 && !u && a.syncToMarks(d == this.node.childCount ? L.none : this.node.child(d).marks, r, e), a.placeWidget(c, e, i);
    }, (c, d, u, h) => {
      a.syncToMarks(c.marks, r, e);
      let f;
      a.findNodeMatch(c, d, u, h) || l && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (f = a.findIndexWithChild(s.node)) > -1 && a.updateNodeAt(c, d, u, f, e) || a.updateNextNode(c, d, u, e, h, i) || a.addNode(c, d, u, e, i), i += c.nodeSize;
    }), a.syncToMarks([], r, e), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == St) && (o && this.protectLocalComposition(e, o), ic(this.contentDOM, this.children, e), on && mh(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof v) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, l = gh(this.node.content, o, r - t, i - t);
      return l < 0 ? null : { node: s, pos: l, text: o };
    } else
      return { node: s, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t))
      return;
    let s = t;
    for (; s.parentNode != this.contentDOM; s = s.parentNode) {
      for (; s.previousSibling; )
        s.parentNode.removeChild(s.previousSibling);
      for (; s.nextSibling; )
        s.parentNode.removeChild(s.nextSibling);
      s.pmViewDesc && (s.pmViewDesc = void 0);
    }
    let o = new ah(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = Ts(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == Ve || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = xe;
  }
  updateOuterDeco(e) {
    if (Ms(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = sc(this.dom, this.nodeDOM, Ss(this.outerDeco, this.node, t), Ss(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function tl(n, e, t, r, i) {
  oc(r, e, n);
  let s = new ht(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class Ci extends ht {
  constructor(e, t, r, i, s, o, l) {
    super(e, t, r, i, s, null, o, l, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == Ve || this.dirty != xe && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != xe || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = xe, !0);
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
    let i = this.node.cut(e, t), s = document.createTextNode(i.text);
    return new Ci(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
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
class rc extends Gn {
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
class ch extends ht {
  constructor(e, t, r, i, s, o, l, a, c, d) {
    super(e, t, r, i, s, o, l, c, d), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == Ve)
      return !1;
    if (this.spec.update) {
      let s = this.spec.update(e, t, r);
      return s && this.updateInner(e, t, r, i), s;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r) : super.setSelection(e, t, r, i);
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
function ic(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], l = o.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = nl(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(l, r);
    if (o instanceof Bt) {
      let a = r ? r.previousSibling : n.lastChild;
      ic(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = nl(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Sn = function(n) {
  n && (this.nodeName = n);
};
Sn.prototype = /* @__PURE__ */ Object.create(null);
const Mt = [new Sn()];
function Ss(n, e, t) {
  if (n.length == 0)
    return Mt;
  let r = t ? Mt[0] : new Sn(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new Sn(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && i.length == 1 && i.push(r = new Sn(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return i;
}
function sc(n, e, t, r) {
  if (t == Mt && r == Mt)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], l = t[s];
    if (s) {
      let a;
      l && l.nodeName == o.nodeName && i != n && (a = i.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(i), l = Mt[0]), i = a;
    }
    dh(i, l || Mt[0], o);
  }
  return i;
}
function dh(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let s = 0; s < r.length; s++)
      i.indexOf(r[s]) == -1 && n.classList.remove(r[s]);
    for (let s = 0; s < i.length; s++)
      r.indexOf(i[s]) == -1 && n.classList.add(i[s]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, i;
      for (; i = r.exec(e.style); )
        n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function oc(n, e, t) {
  return sc(n, n, Mt, Ss(e, t, n.nodeType != 1));
}
function Ms(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function nl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class uh {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = hh(e.node.content, e);
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
    let i = 0, s = this.stack.length >> 1, o = Math.min(s, e.length);
    for (; i < o && (i == s - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1; )
      i++;
    for (; i < s; )
      this.destroyRest(), this.top.dirty = xe, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
    for (; s < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1;
      for (let a = this.index; a < Math.min(this.index + 3, this.top.children.length); a++) {
        let c = this.top.children[a];
        if (c.matchesMark(e[s]) && !this.isLocked(c.dom)) {
          l = a;
          break;
        }
      }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let a = Bt.create(this.top, e[s], t, r);
        this.top.children.splice(this.index, 0, a), this.top = a, this.changed = !0;
      }
      this.index = 0, s++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, i) {
    let s = -1, o;
    if (i >= this.preMatch.index && (o = this.preMatch.matches[i - this.preMatch.index]).parent == this.top && o.matchesNode(e, t, r))
      s = this.top.children.indexOf(o, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          s = l;
          break;
        }
      }
    return s < 0 ? !1 : (this.destroyBetween(this.index, s), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, s) {
    let o = this.top.children[i];
    return o.dirty == Ve && o.dom == o.contentDOM && (o.dirty = St), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r)
              return i;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, i, s, o) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof ht) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != s)
          return !1;
        let d = a.dom, u, h = this.isLocked(d) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != Ve && Ms(t, a.outerDeco));
        if (!h && a.update(e, t, r, i))
          return this.destroyBetween(this.index, l), a.dom != d && (this.changed = !0), this.index++, !0;
        if (!h && (u = this.recreateWrapper(a, e, t, r, i, o)))
          return this.top.children[this.index] = u, u.contentDOM && (u.dirty = St, u.updateChildren(i, o + 1), u.dirty = xe), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content))
      return null;
    let l = ht.create(this.top, t, r, i, s, o);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = ht.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new nc(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Bt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Ci) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((ie || re) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new rc(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function hh(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
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
      if (a != n.child(i - 1))
        break;
      --i, s.set(l, i), o.push(l);
    }
  }
  return { index: i, matched: s, matches: o.reverse() };
}
function fh(n, e) {
  return n.type.side - e.type.side;
}
function ph(n, e, t, r) {
  let i = e.locals(n), s = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let d = n.child(c);
      r(d, i, e.forChild(s, d), c), s += d.nodeSize;
    }
    return;
  }
  let o = 0, l = [], a = null;
  for (let c = 0; ; ) {
    let d, u;
    for (; o < i.length && i[o].to == s; ) {
      let g = i[o++];
      g.widget && (d ? (u || (u = [d])).push(g) : d = g);
    }
    if (d)
      if (u) {
        u.sort(fh);
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
      l[g].to <= s && l.splice(g--, 1);
    for (; o < i.length && i[o].from <= s && i[o].to > s; )
      l.push(i[o++]);
    let p = s + h.nodeSize;
    if (h.isText) {
      let g = p;
      o < i.length && i[o].from < g && (g = i[o].from);
      for (let y = 0; y < l.length; y++)
        l[y].to < g && (g = l[y].to);
      g < p && (a = h.cut(g - s), h = h.cut(0, g - s), p = g, f = -1);
    } else
      for (; o < i.length && i[o].to < p; )
        o++;
    let m = h.isInline && !h.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(h, m, e.forChild(s, h), f), s = p;
  }
}
function mh(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function gh(n, e, t, r) {
  for (let i = 0, s = 0; i < n.childCount && s <= r; ) {
    let o = n.child(i++), l = s;
    if (s += o.nodeSize, !o.isText)
      continue;
    let a = o.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (s += c.nodeSize, !c.isText)
        break;
      a += c.text;
    }
    if (s >= t) {
      if (s >= r && a.slice(r - e.length - l, r - l) == e)
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
function Ts(n, e, t, r, i) {
  let s = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, d = l += a.size;
    c >= t || d <= e ? s.push(a) : (c < e && s.push(a.slice(0, e - c, r)), i && (s.push(i), i = void 0), d > t && s.push(a.slice(t - c, a.size, r)));
  }
  return s;
}
function Zs(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (xi(t)) {
    for (a = l; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && T.isSelectable(d) && i.parent && !(d.isInline && Vu(t.focusNode, t.focusOffset, i.dom))) {
      let u = i.posBefore;
      c = new T(o == u ? l : r.resolve(u));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0)
      return null;
    a = r.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < l.pos && !s ? 1 : -1;
    c = eo(n, a, l, d);
  }
  return c;
}
function lc(n) {
  return n.editable ? n.hasFocus() : cc(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Ge(n, e = !1) {
  let t = n.state.selection;
  if (ac(n, t), !!lc(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && re) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && Pt(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      bh(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      rl && !(t instanceof v) && (t.$from.parent.inlineContent || (s = il(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = il(n, t.to))), n.docView.setSelection(r, i, n.root, e), rl && (s && sl(s), o && sl(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && yh(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const rl = ie || re && _u < 63;
function il(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (ie && i && i.contentEditable == "false")
    return qi(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return qi(i);
    if (s)
      return qi(s);
  }
}
function qi(n) {
  return n.contentEditable = "true", ie && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function sl(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function yh(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!lc(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function bh(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, i = r.nodeName == "IMG";
  i ? t.setEnd(r.parentNode, G(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !i && !n.state.selection.visible && de && ut <= 11 && (r.disabled = !0, r.disabled = !1);
}
function ac(n, e) {
  if (e instanceof T) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (ol(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    ol(n);
}
function ol(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function eo(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || v.between(e, t, r);
}
function ll(n) {
  return n.editable && !n.hasFocus() ? !1 : cc(n);
}
function cc(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function kh(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Pt(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function vs(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && A.findFrom(s, e);
}
function et(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function al(n, e, t) {
  let r = n.state.selection;
  if (r instanceof v)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return et(n, new v(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = vs(n.state, e);
        return i && i instanceof T ? et(n, i) : !1;
      } else if (!(be && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let l = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? T.isSelectable(s) ? et(n, new T(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : Un ? et(n, new v(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof T && r.node.isInline)
      return et(n, new v(e > 0 ? r.$to : r.$from));
    {
      let i = vs(n.state, e);
      return i ? et(n, i) : !1;
    }
  }
}
function Rr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Mn(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Wt(n, e) {
  return e < 0 ? wh(n) : xh(n);
}
function wh(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (ve && t.nodeType == 1 && r < Rr(t) && Mn(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (Mn(l, -1))
          i = t, s = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (dc(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && Mn(l, -1); )
          i = t.parentNode, s = G(l), l = l.previousSibling;
        if (l)
          t = l, r = Rr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? As(n, t, r) : i && As(n, i, s);
}
function xh(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = Rr(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (Mn(l, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (dc(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && Mn(l, 1); )
          s = l.parentNode, o = G(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, i = Rr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && As(n, s, o);
}
function dc(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Ch(n, e) {
  for (; n && e == n.childNodes.length && !qn(n); )
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
function Sh(n, e) {
  for (; n && !e && !qn(n); )
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
function As(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = Ch(e, t)) ? (e = o, t = 0) : (s = Sh(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (xi(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Ge(n);
  }, 50);
}
function cl(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(re || Ku) && t.parent.inlineContent) {
    let i = n.coordsAtPos(e);
    if (e > t.start()) {
      let s = n.coordsAtPos(e - 1), o = (s.top + s.bottom) / 2;
      if (o > i.top && o < i.bottom && Math.abs(s.left - i.left) > 1)
        return s.left < i.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let s = n.coordsAtPos(e + 1), o = (s.top + s.bottom) / 2;
      if (o > i.top && o < i.bottom && Math.abs(s.left - i.left) > 1)
        return s.left > i.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function dl(n, e, t) {
  let r = n.state.selection;
  if (r instanceof v && !r.empty || t.indexOf("s") > -1 || be && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = vs(n.state, e);
    if (o && o instanceof T)
      return et(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, l = r instanceof Te ? A.near(o, e) : A.findFrom(o, e);
    return l ? et(n, l) : !1;
  }
  return !1;
}
function ul(n, e) {
  if (!(n.state.selection instanceof v))
    return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let s = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (s && !s.isText) {
    let o = n.state.tr;
    return e < 0 ? o.delete(t.pos - s.nodeSize, t.pos) : o.delete(t.pos, t.pos + s.nodeSize), n.dispatch(o), !0;
  }
  return !1;
}
function hl(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function Mh(n) {
  if (!ie || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    hl(n, r, "true"), setTimeout(() => hl(n, r, "false"), 20);
  }
  return !1;
}
function Th(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function vh(n, e) {
  let t = e.keyCode, r = Th(e);
  if (t == 8 || be && t == 72 && r == "c")
    return ul(n, -1) || Wt(n, -1);
  if (t == 46 && !e.shiftKey || be && t == 68 && r == "c")
    return ul(n, 1) || Wt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || be && t == 66 && r == "c") {
    let i = t == 37 ? cl(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return al(n, i, r) || Wt(n, i);
  } else if (t == 39 || be && t == 70 && r == "c") {
    let i = t == 39 ? cl(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return al(n, i, r) || Wt(n, i);
  } else {
    if (t == 38 || be && t == 80 && r == "c")
      return dl(n, -1, r) || Wt(n, -1);
    if (t == 40 || be && t == 78 && r == "c")
      return Mh(n) || dl(n, 1, r) || Wt(n, 1);
    if (r == (be ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function uc(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let f = r.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), r = f.content;
  }
  let o = n.someProp("clipboardSerializer") || ze.fromSchema(n.state.schema), l = yc(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, d, u = 0;
  for (; c && c.nodeType == 1 && (d = gc[c.nodeName.toLowerCase()]); ) {
    for (let f = d.length - 1; f >= 0; f--) {
      let p = l.createElement(d[f]);
      for (; a.firstChild; )
        p.appendChild(a.firstChild);
      a.appendChild(p), u++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${u ? ` -${u}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (f) => f(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: h, slice: e };
}
function hc(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, l;
  if (!t && !e)
    return null;
  let a = e && (r || s || !t);
  if (a) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, s || r, n);
    }), s)
      return e ? new x(b.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : x.empty;
    let u = n.someProp("clipboardTextParser", (h) => h(e, i, r, n));
    if (u)
      l = u;
    else {
      let h = i.marks(), { schema: f } = n.state, p = ze.fromSchema(f);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(f.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (u) => {
      t = u(t, n);
    }), o = Nh(t), Un && Oh(o);
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
    context: i,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !Ah.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), d)
    l = Rh(fl(l, +d[1], +d[2]), d[4]);
  else if (l = x.maxOpen(Eh(l.content, i), !0), l.openStart || l.openEnd) {
    let u = 0, h = 0;
    for (let f = l.content.firstChild; u < l.openStart && !f.type.spec.isolating; u++, f = f.firstChild)
      ;
    for (let f = l.content.lastChild; h < l.openEnd && !f.type.spec.isolating; h++, f = f.lastChild)
      ;
    l = fl(l, u, h);
  }
  return n.someProp("transformPasted", (u) => {
    l = u(l, n);
  }), l;
}
const Ah = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Eh(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), s, o = [];
    if (n.forEach((l) => {
      if (!o)
        return;
      let a = i.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && s.length && pc(a, s, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = mc(o[o.length - 1], s.length));
        let d = fc(l, a);
        o.push(d), i = i.matchType(d.type), s = a;
      }
    }), o)
      return b.from(o);
  }
  return n;
}
function fc(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, b.from(n));
  return n;
}
function pc(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = pc(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(b.from(fc(t, n, i + 1))));
  }
}
function mc(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, mc(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(b.empty, !0);
  return n.copy(t.append(r));
}
function Es(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (l = Es(l, e, t, r, i + 1, s)), i >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, s <= i).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(b.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function fl(n, e, t) {
  return e < n.openStart && (n = new x(Es(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new x(Es(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const gc = {
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
let pl = null;
function yc() {
  return pl || (pl = document.implementation.createHTMLDocument("title"));
}
function Nh(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = yc().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && gc[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = n, i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function Oh(n) {
  let e = n.querySelectorAll(re ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Rh(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: s, openEnd: o } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    i = b.from(a.create(r[l + 1], i)), s++, o++;
  }
  return new x(i, s, o);
}
const se = {}, oe = {}, Dh = { touchstart: !0, touchmove: !0 };
class Ih {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Lh(n) {
  for (let e in se) {
    let t = se[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Bh(n, r) && !to(n, r) && (n.editable || !(r.type in oe)) && t(n, r);
    }, Dh[e] ? { passive: !0 } : void 0);
  }
  ie && n.dom.addEventListener("input", () => null), Ns(n);
}
function dt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Ph(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Ns(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => to(n, r));
  });
}
function to(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Bh(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function $h(n, e) {
  !to(n, e) && se[e.type] && (n.editable || !(e.type in oe)) && se[e.type](n, e);
}
oe.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !kc(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Se && re && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), on && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, xt(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || vh(n, t) ? t.preventDefault() : dt(n, "key");
};
oe.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
oe.keypress = (n, e) => {
  let t = e;
  if (kc(n, t) || !t.charCode || t.ctrlKey && !t.altKey || be && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof v) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, i)) && n.dispatch(n.state.tr.insertText(i).scrollIntoView()), t.preventDefault();
  }
};
function Si(n) {
  return { left: n.clientX, top: n.clientY };
}
function zh(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function no(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > s.depth ? l(n, t, s.nodeAfter, s.before(o), i, !0) : l(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function Zt(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function Hh(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && T.isSelectable(r) ? (Zt(n, new T(t)), !0) : !1;
}
function Fh(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof T && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let l = o > s.depth ? s.nodeAfter : s.node(o);
    if (T.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (Zt(n, T.create(n.state.doc, i)), !0) : !1;
}
function Vh(n, e, t, r, i) {
  return no(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? Fh(n, t) : Hh(n, t));
}
function jh(n, e, t, r) {
  return no(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function Wh(n, e, t, r) {
  return no(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || _h(n, t, r);
}
function _h(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Zt(n, v.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), l = i.before(s);
    if (o.inlineContent)
      Zt(n, v.create(r, l + 1, l + 1 + o.content.size));
    else if (T.isSelectable(o))
      Zt(n, T.create(r, l));
    else
      continue;
    return !0;
  }
}
function ro(n) {
  return Dr(n);
}
const bc = be ? "metaKey" : "ctrlKey";
se.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = ro(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && zh(t, n.input.lastClick) && !t[bc] && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s };
  let o = n.posAtCoords(Si(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new Kh(n, o, t, !!r)) : (s == "doubleClick" ? jh : Wh)(n, o.pos, o.inside, t) ? t.preventDefault() : dt(n, "pointer"));
};
class Kh {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[bc], this.allowDefault = r.shiftKey;
    let s, o;
    if (t.inside > -1)
      s = e.state.doc.nodeAt(t.inside), o = t.inside;
    else {
      let d = e.state.doc.resolve(t.pos);
      s = d.parent, o = d.depth ? d.before() : 0;
    }
    const l = i ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a && a.dom.nodeType == 1 ? a.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof T && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && ve && !this.target.hasAttribute("contentEditable"))
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
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Si(e))), this.updateAllowDefault(e), this.allowDefault || !t ? dt(this.view, "pointer") : Vh(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    ie && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    re && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Zt(this.view, A.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : dt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), dt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
se.touchstart = (n) => {
  n.input.lastTouch = Date.now(), ro(n), dt(n, "pointer");
};
se.touchmove = (n) => {
  n.input.lastTouch = Date.now(), dt(n, "pointer");
};
se.contextmenu = (n) => ro(n);
function kc(n, e) {
  return n.composing ? !0 : ie && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const Jh = Se ? 5e3 : -1;
oe.compositionstart = oe.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), Dr(n, !0), n.markCursor = null;
    else if (Dr(n), ve && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let i = r.focusNode, s = r.focusOffset; i && i.nodeType == 1 && s != 0; ) {
        let o = s < 0 ? i.lastChild : i.childNodes[s - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          n.domSelection().collapse(o, o.nodeValue.length);
          break;
        } else
          i = o, s = -1;
      }
    }
    n.input.composing = !0;
  }
  wc(n, Jh);
};
oe.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, wc(n, 20));
};
function wc(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => Dr(n), e));
}
function xc(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Uh()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function qh(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Hu(e.focusNode, e.focusOffset), r = Fu(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let i = r.pmViewDesc, s = n.domObserver.lastChangedTextNode;
    if (t == s || r == s)
      return s;
    if (!i || !i.isText(r.nodeValue))
      return r;
    if (n.input.compositionNode == r) {
      let o = t.pmViewDesc;
      if (!(!o || !o.isText(t.nodeValue)))
        return r;
    }
  }
  return t || r;
}
function Uh() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Dr(n, e = !1) {
  if (!(Se && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), xc(n), e || n.docView && n.docView.dirty) {
      let t = Zs(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Gh(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const In = de && ut < 15 || on && Ju < 604;
se.copy = oe.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = In ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = uc(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", a)) : Gh(n, l), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Yh(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Xh(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Ln(n, r.value, null, i, e) : Ln(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Ln(n, e, t, r, i) {
  let s = hc(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, i, s || x.empty)))
    return !0;
  if (!s)
    return !1;
  let o = Yh(s), l = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Cc(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
oe.paste = (n, e) => {
  let t = e;
  if (n.composing && !Se)
    return;
  let r = In ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Ln(n, Cc(r), r.getData("text/html"), i, t) ? t.preventDefault() : Xh(n, t);
};
class Sc {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const Mc = be ? "altKey" : "ctrlKey";
se.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Si(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof T ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = T.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let u = n.docView.nearestDesc(t.target, !0);
      u && u.node.type.spec.draggable && u != n.docView && (o = T.create(n.state.doc, u.posBefore));
    }
  }
  let l = (o || n.state.selection).content(), { dom: a, text: c, slice: d } = uc(n, l);
  t.dataTransfer.clearData(), t.dataTransfer.setData(In ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", In || t.dataTransfer.setData("text/plain", c), n.dragging = new Sc(d, !t[Mc], o);
};
se.dragend = (n) => {
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
  let i = n.posAtCoords(Si(t));
  if (!i)
    return;
  let s = n.state.doc.resolve(i.pos), o = r && r.slice;
  o ? n.someProp("transformPasted", (p) => {
    o = p(o, n);
  }) : o = hc(n, Cc(t.dataTransfer), In ? null : t.dataTransfer.getData("text/html"), !1, s);
  let l = !!(r && !t[Mc]);
  if (n.someProp("handleDrop", (p) => p(n, t, o || x.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!o)
    return;
  t.preventDefault();
  let a = o ? Va(n.state.doc, s.pos, o) : s.pos;
  a == null && (a = s.pos);
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
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, g, y, k) => p = k), c.setSelection(eo(n, f, c.doc.resolve(p)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
se.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Ge(n);
  }, 20));
};
se.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
se.beforeinput = (n, e) => {
  if (re && Se && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, xt(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in oe)
  se[n] = oe[n];
function Pn(n, e) {
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
class Ir {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Rt, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new ce(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof Ir && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Pn(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class ft {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Rt;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new ce(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof ft && Pn(this.attrs, e.attrs) && Pn(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof ft;
  }
  destroy() {
  }
}
class io {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Rt;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new ce(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof io && Pn(this.attrs, e.attrs) && Pn(this.spec, e.spec);
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
    return new ce(e, e, new Ir(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new ce(e, t, new ft(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new ce(e, t, new io(r, i));
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
    return this.type instanceof Ir;
  }
}
const Jt = [], Rt = {};
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
    return t.length ? Lr(t, e, 0, Rt) : Z;
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
    let i = [];
    return this.findInner(e ?? 0, t ?? 1e9, i, 0, r), i;
  }
  findInner(e, t, r, i, s) {
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      l.from <= t && l.to >= e && (!s || s(l.spec)) && r.push(l.copy(l.from + i, l.to + i));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < t && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, t - l, r, i + l, s);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Z || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Rt);
  }
  /**
  @internal
  */
  mapInner(e, t, r, i, s) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, i);
      a && a.type.valid(t, a) ? (o || (o = [])).push(a) : s.onRemove && s.onRemove(this.local[l].spec);
    }
    return this.children.length ? Qh(this.children, o || [], e, t, r, i, s) : o ? new z(o.sort(Dt), Jt) : Z;
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
    let i, s = 0;
    e.forEach((l, a) => {
      let c = a + r, d;
      if (d = vc(t, l, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < a; )
          s += 3;
        i[s] == a ? i[s + 2] = i[s + 2].addInner(l, d, c + 1) : i.splice(s, 0, a, a + l.nodeSize, Lr(d, l, c + 1, Rt)), s += 3;
      }
    });
    let o = Tc(s ? Ac(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new z(o.length ? this.local.concat(o).sort(Dt) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Z ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let s = 0; s < r.length; s += 3) {
      let o, l = r[s] + t, a = r[s + 1] + t;
      for (let d = 0, u; d < e.length; d++)
        (u = e[d]) && u.from > l && u.to < a && (e[d] = null, (o || (o = [])).push(u));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[s + 2].removeInner(o, l + 1);
      c != Z ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let l = 0; l < i.length; l++)
            i[l].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new z(i, r) : Z;
  }
  forChild(e, t) {
    if (this == Z)
      return this;
    if (t.isLeaf)
      return z.empty;
    let r, i;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > s && a.type instanceof ft) {
        let c = Math.max(s, a.from) - s, d = Math.min(o, a.to) - s;
        c < d && (i || (i = [])).push(a.copy(c, d));
      }
    }
    if (i) {
      let l = new z(i.sort(Dt), Jt);
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
    return so(this.localsInner(e));
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
z.removeOverlap = so;
const Z = z.empty;
class rt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, Rt));
    return rt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return z.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != Z && (s instanceof rt ? r = r.concat(s.members) : r.push(s));
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
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].localsInner(e);
      if (s.length)
        if (!t)
          t = s;
        else {
          r && (t = t.slice(), r = !1);
          for (let o = 0; o < s.length; o++)
            t.push(s[o]);
        }
    }
    return t ? so(r ? t : t.sort(Dt)) : Jt;
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
function Qh(n, e, t, r, i, s, o) {
  let l = n.slice();
  for (let c = 0, d = s; c < t.maps.length; c++) {
    let u = 0;
    t.maps[c].forEach((h, f, p, m) => {
      let g = m - p - (f - h);
      for (let y = 0; y < l.length; y += 3) {
        let k = l[y + 1];
        if (k < 0 || h > k + d - u)
          continue;
        let S = l[y] + d - u;
        f >= S ? l[y + 1] = h <= S ? -2 : -1 : h >= d && g && (l[y] += g, l[y + 1] += g);
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
      let d = t.map(n[c] + s), u = d - i;
      if (u < 0 || u >= r.content.size) {
        a = !0;
        continue;
      }
      let h = t.map(n[c + 1] + s, -1), f = h - i, { index: p, offset: m } = r.content.findIndex(u), g = r.maybeChild(p);
      if (g && m == u && m + g.nodeSize == f) {
        let y = l[c + 2].mapInner(t, g, d + 1, n[c] + s + 1, o);
        y != Z ? (l[c] = u, l[c + 1] = f, l[c + 2] = y) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = Zh(l, n, e, t, i, s, o), d = Lr(c, r, 0, o);
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
  return new z(e.sort(Dt), l);
}
function Tc(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new ce(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Zh(n, e, t, r, i, s, o) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let u = a.local[d].map(r, i, c);
      u ? t.push(u) : o.onRemove && o.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3)
      l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + s + 1);
  return t;
}
function vc(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function Ac(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Lr(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((l, a) => {
    let c = vc(n, l, a + t);
    if (c) {
      s = !0;
      let d = Lr(c, l, t + a + 1, r);
      d != Z && i.push(a, a + l.nodeSize, d);
    }
  });
  let o = Tc(s ? Ac(n) : n, -t).sort(Dt);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || i.length ? new z(o, i) : Z;
}
function Dt(n, e) {
  return n.from - e.from || n.to - e.to;
}
function so(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), ml(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), ml(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ml(n, e, t) {
  for (; e < n.length && Dt(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Ui(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Z && e.push(r);
  }), n.cursorWrapper && e.push(z.create(n.state.doc, [n.cursorWrapper.deco])), rt.from(e);
}
const ef = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, tf = de && ut <= 11;
class nf {
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
class rf {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new nf(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      de && ut <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), tf && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, ef)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (ll(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Ge(this.view);
      if (de && ut <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Pt(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = Dn(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = Dn(s))
      if (t.has(s)) {
        r = s;
        break;
      }
    let i = r && this.view.docView.nearestDesc(r);
    if (i && i.ignoreMutation({
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && ll(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, l = !1, a = [];
    if (e.editable)
      for (let d = 0; d < t.length; d++) {
        let u = this.registerMutation(t[d], a);
        u && (s = s < 0 ? u.from : Math.min(u.from, s), o = o < 0 ? u.to : Math.max(u.to, o), u.typeOver && (l = !0));
      }
    if (ve && a.length) {
      let d = a.filter((u) => u.nodeName == "BR");
      if (d.length == 2) {
        let [u, h] = d;
        u.parentNode && u.parentNode.parentNode == h.parentNode ? h.remove() : u.remove();
      } else {
        let { focusNode: u } = this.currentSelection;
        for (let h of d) {
          let f = h.parentNode;
          f && f.nodeName == "LI" && (!u || lf(e, u) != f) && h.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && xi(r) && (c = Zs(e)) && c.eq(A.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Ge(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), sf(e)), this.handleDOMChange(s, o, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Ge(e), this.currentSelection.set(r));
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
      let i = e.previousSibling, s = e.nextSibling;
      if (de && ut <= 11 && e.addedNodes.length)
        for (let d = 0; d < e.addedNodes.length; d++) {
          let { previousSibling: u, nextSibling: h } = e.addedNodes[d];
          (!u || Array.prototype.indexOf.call(e.addedNodes, u) < 0) && (i = u), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (s = h);
        }
      let o = i && i.parentNode == e.target ? G(i) + 1 : 0, l = r.localPosFromDOM(e.target, o, -1), a = s && s.parentNode == e.target ? G(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
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
let gl = /* @__PURE__ */ new WeakMap(), yl = !1;
function sf(n) {
  if (!gl.has(n) && (gl.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = ve, yl)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), yl = !0;
  }
}
function bl(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return Pt(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function of(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return bl(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? bl(n, t) : null;
}
function lf(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function af(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: l } = n.docView.parseRange(e, t), a = n.domSelectionRange(), c, d = a.anchorNode;
  if (d && n.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (c = [{ node: d, offset: a.anchorOffset }], xi(a) || c.push({ node: a.focusNode, offset: a.focusOffset })), re && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let y = r.childNodes[g - 1], k = y.pmViewDesc;
      if (y.nodeName == "BR" && !k) {
        s = g;
        break;
      }
      if (!k || k.size)
        break;
    }
  let u = n.state.doc, h = n.someProp("domParser") || nn.fromSchema(n.state.schema), f = u.resolve(o), p = null, m = h.parse(r, {
    topNode: f.parent,
    topMatch: f.parent.contentMatchAt(f.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: f.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: cf,
    context: f
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: l };
}
function cf(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (ie && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || ie && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const df = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function uf(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let D = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, Oe = Zs(n, D);
    if (Oe && !n.state.selection.eq(Oe)) {
      if (re && Se && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (Qn) => Qn(n, xt(13, "Enter"))))
        return;
      let Xe = n.state.tr.setSelection(Oe);
      D == "pointer" ? Xe.setMeta("pointer", !0) : D == "key" && Xe.scrollIntoView(), s && Xe.setMeta("composition", s), n.dispatch(Xe);
    }
    return;
  }
  let o = n.state.doc.resolve(e), l = o.sharedDepth(t);
  e = o.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = af(n, e, t), d = n.state.doc, u = d.slice(c.from, c.to), h, f;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, f = "end") : (h = n.state.selection.from, f = "start"), n.input.lastKeyCode = null;
  let p = pf(u.content, c.doc.content, c.from, h, f);
  if ((on && n.input.lastIOSEnter > Date.now() - 225 || Se) && i.some((D) => D.nodeType == 1 && !df.test(D.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (D) => D(n, xt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof v && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let D = kl(n, n.state.doc, c.sel);
        if (D && !D.eq(n.state.selection)) {
          let Oe = n.state.tr.setSelection(D);
          s && Oe.setMeta("composition", s), n.dispatch(Oe);
        }
      }
      return;
    }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof v && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), de && ut <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = d.resolve(p.start), k = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA, S;
  if ((on && n.input.lastIOSEnter > Date.now() - 225 && (!k || i.some((D) => D.nodeName == "DIV" || D.nodeName == "P")) || !k && m.pos < c.doc.content.size && !m.sameParent(g) && (S = A.findFrom(c.doc.resolve(m.pos + 1), 1, !0)) && S.head == g.pos) && n.someProp("handleKeyDown", (D) => D(n, xt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && ff(d, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (D) => D(n, xt(8, "Backspace")))) {
    Se && re && n.domObserver.suppressSelectionUpdates();
    return;
  }
  re && Se && p.endB == p.start && (n.input.lastAndroidDelete = Date.now()), Se && !k && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(D) {
      return D(n, xt(13, "Enter"));
    });
  }, 20));
  let R = p.start, E = p.endA, M, I, q;
  if (k) {
    if (m.pos == g.pos)
      de && ut <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Ge(n), 20)), M = n.state.tr.delete(R, E), I = d.resolve(p.start).marksAcross(d.resolve(p.endA));
    else if (
      // Adding or removing a mark
      p.endA == p.endB && (q = hf(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    )
      M = n.state.tr, q.type == "add" ? M.addMark(R, E, q.mark) : M.removeMark(R, E, q.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let D = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (Oe) => Oe(n, R, E, D)))
        return;
      M = n.state.tr.insertText(D, R, E);
    }
  }
  if (M || (M = n.state.tr.replace(R, E, c.doc.slice(p.start - c.from, p.endB - c.from))), c.sel) {
    let D = kl(n, M.doc, c.sel);
    D && !(re && Se && n.composing && D.empty && (p.start != p.endB || n.input.lastAndroidDelete < Date.now() - 100) && (D.head == R || D.head == M.mapping.map(E) - 1) || de && D.empty && D.head == R) && M.setSelection(D);
  }
  I && M.ensureMarks(I), s && M.setMeta("composition", s), n.dispatch(M.scrollIntoView());
}
function kl(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : eo(n, e.resolve(t.anchor), e.resolve(t.head));
}
function hf(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, s = r, o, l, a;
  for (let d = 0; d < r.length; d++)
    i = r[d].removeFromSet(i);
  for (let d = 0; d < t.length; d++)
    s = t[d].removeFromSet(s);
  if (i.length == 1 && s.length == 0)
    l = i[0], o = "add", a = (d) => d.mark(l.addToSet(d.marks));
  else if (i.length == 0 && s.length == 1)
    l = s[0], o = "remove", a = (d) => d.mark(l.removeFromSet(d.marks));
  else
    return null;
  let c = [];
  for (let d = 0; d < e.childCount; d++)
    c.push(a(e.child(d)));
  if (b.from(c).eq(n))
    return { mark: l, type: o };
}
function ff(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    Gi(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = s.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(Gi(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || Gi(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Gi(n, e, t) {
  let r = n.depth, i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, e = !1;
  if (t) {
    let s = n.node(r).maybeChild(n.indexAfter(r));
    for (; s && !s.isLeaf; )
      s = s.firstChild, i++;
  }
  return i;
}
function pf(n, e, t, r, i) {
  let s = n.findDiffStart(e, t);
  if (s == null)
    return null;
  let { a: o, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (i == "end") {
    let a = Math.max(0, s - Math.min(o, l));
    r -= o + a - s;
  }
  if (o < s && n.size < e.size) {
    let a = r <= s && r >= o ? s - r : 0;
    s -= a, s && s < e.size && wl(e.textBetween(s - 1, s + 1)) && (s += a ? 1 : -1), l = s + (l - o), o = s;
  } else if (l < s) {
    let a = r <= s && r >= l ? s - r : 0;
    s -= a, s && s < n.size && wl(n.textBetween(s - 1, s + 1)) && (s += a ? 1 : -1), o = s + (o - l), l = s;
  }
  return { start: s, endA: o, endB: l };
}
function wl(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class mf {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Ih(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Tl), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Sl(this), Cl(this), this.nodeViews = Ml(this), this.docView = tl(this.state.doc, xl(this), Ui(this), this.dom, this), this.domObserver = new rf(this, (r, i, s, o) => uf(this, r, i, s, o)), this.domObserver.start(), Lh(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && Ns(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Tl), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    let i = this.state, s = !1, o = !1;
    e.storedMarks && this.composing && (xc(this), o = !0), this.state = e;
    let l = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let f = Ml(this);
      yf(f, this.nodeViews) && (this.nodeViews = f, s = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && Ns(this), this.editable = Sl(this), Cl(this);
    let a = Ui(this), c = xl(this), d = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", u = s || !this.docView.matchesNode(e.doc, c, a);
    (u || !e.selection.eq(i.selection)) && (o = !0);
    let h = d == "preserve" && o && this.dom.style.overflowAnchor == null && Gu(this);
    if (o) {
      this.domObserver.stop();
      let f = u && (de || re) && !this.composing && !i.selection.empty && !e.selection.empty && gf(i.selection, e.selection);
      if (u) {
        let p = re ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = qh(this)), (s || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = tl(e.doc, c, a, this.dom, this)), p && !this.trackWrites && (f = !0);
      }
      f || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && kh(this)) ? Ge(this, f) : (ac(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), d == "reset" ? this.dom.scrollTop = 0 : d == "to selection" ? this.scrollToSelection() : h && Yu(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof T) {
      let t = this.docView.domAfterPos(this.state.selection.from);
      t.nodeType == 1 && Go(this, t.getBoundingClientRect(), e);
    } else
      Go(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    let r = e.node, i = -1;
    if (this.state.doc.nodeAt(r.from) == r.node)
      i = r.from;
    else {
      let s = r.from + (this.state.doc.content.size - t.doc.content.size);
      (s > 0 && this.state.doc.nodeAt(s)) == r.node && (i = s);
    }
    this.dragging = new Sc(e.slice, e.move, i < 0 ? void 0 : T.create(this.state.doc, i));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let l = this.directPlugins[o].props[e];
      if (l != null && (i = t ? t(l) : l))
        return i;
    }
    let s = this.state.plugins;
    if (s)
      for (let o = 0; o < s.length; o++) {
        let l = s[o].props[e];
        if (l != null && (i = t ? t(l) : l))
          return i;
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
    this.domObserver.stop(), this.editable && Xu(this.dom), Ge(this), this.domObserver.start();
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
    return nh(this, e);
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
    return ec(this, e, t);
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
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null)
      throw new RangeError("DOM position not inside the editor");
    return i;
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
    return lh(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Ln(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Ln(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Ph(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Ui(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, $u());
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
    return $h(this, e);
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
    return ie && this.root.nodeType === 11 && ju(this.dom.ownerDocument) == this.dom && of(this, e) || e;
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
function xl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [ce.node(0, n.state.doc.content.size, e)];
}
function Cl(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: ce.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Sl(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function gf(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Ml(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function yf(n, e) {
  let t = 0, r = 0;
  for (let i in n) {
    if (n[i] != e[i])
      return !0;
    t++;
  }
  for (let i in e)
    r++;
  return t != r;
}
function Tl(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var pt = {
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
}, Pr = {
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
}, bf = typeof navigator < "u" && /Mac/.test(navigator.platform), kf = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Y = 0; Y < 10; Y++) pt[48 + Y] = pt[96 + Y] = String(Y);
for (var Y = 1; Y <= 24; Y++) pt[Y + 111] = "F" + Y;
for (var Y = 65; Y <= 90; Y++)
  pt[Y] = String.fromCharCode(Y + 32), Pr[Y] = String.fromCharCode(Y);
for (var Yi in pt) Pr.hasOwnProperty(Yi) || (Pr[Yi] = pt[Yi]);
function wf(n) {
  var e = bf && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || kf && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Pr : pt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const xf = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function Cf(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      xf ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function Sf(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Cf(t)] = n[t];
  return e;
}
function Xi(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function Mf(n) {
  return new X({ props: { handleKeyDown: oo(n) } });
}
function oo(n) {
  let e = Sf(n);
  return function(t, r) {
    let i = wf(r), s, o = e[Xi(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let l = e[Xi(i, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || i.charCodeAt(0) > 127) && (s = pt[r.keyCode]) && s != i) {
        let l = e[Xi(s, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
const Tf = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Ec(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const vf = (n, e, t) => {
  let r = Ec(n, t);
  if (!r)
    return !1;
  let i = lo(r);
  if (!i) {
    let o = r.blockRange(), l = o && hn(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (!s.type.spec.isolating && Dc(n, i, e))
    return !0;
  if (r.parent.content.size == 0 && (ln(s, "end") || T.isSelectable(s))) {
    let o = ki(n.doc, r.before(), r.after(), x.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(ln(s, "end") ? A.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : T.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Af = (n, e, t) => {
  let r = Ec(n, t);
  if (!r)
    return !1;
  let i = lo(r);
  return i ? Nc(n, i, e) : !1;
}, Ef = (n, e, t) => {
  let r = Oc(n, t);
  if (!r)
    return !1;
  let i = ao(r);
  return i ? Nc(n, i, e) : !1;
};
function Nc(n, e, t) {
  let r = e.nodeBefore, i = r, s = e.pos - 1;
  for (; !i.isTextblock; s--) {
    if (i.type.spec.isolating)
      return !1;
    let d = i.lastChild;
    if (!d)
      return !1;
    i = d;
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
  let c = ki(n.doc, s, a, x.empty);
  if (!c || c.from != s || c instanceof W && c.slice.size >= a - s)
    return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(v.create(d.doc, s)), t(d.scrollIntoView());
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
const Nf = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = lo(r);
  }
  let o = s && s.nodeBefore;
  return !o || !T.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(T.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function lo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Oc(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Of = (n, e, t) => {
  let r = Oc(n, t);
  if (!r)
    return !1;
  let i = ao(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Dc(n, i, e))
    return !0;
  if (r.parent.content.size == 0 && (ln(s, "start") || T.isSelectable(s))) {
    let o = ki(n.doc, r.before(), r.after(), x.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(ln(s, "start") ? A.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : T.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, Rf = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = ao(r);
  }
  let o = s && s.nodeAfter;
  return !o || !T.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(T.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function ao(n) {
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
const Df = (n, e) => {
  let t = n.selection, r = t instanceof T, i;
  if (r) {
    if (t.node.isTextblock || !yt(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = bi(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(T.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, If = (n, e) => {
  let t = n.selection, r;
  if (t instanceof T) {
    if (t.node.isTextblock || !yt(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = bi(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Lf = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && hn(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, Pf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Rc(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Bf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = Rc(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(A.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, $f = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Te || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = Rc(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, l = n.tr.insert(o, s.createAndFill());
    l.setSelection(v.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, zf = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (Xt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && hn(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
}, Hf = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(T.create(n.doc, i))), !0);
};
function Ff(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || yt(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Dc(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s, o;
  if (r.type.spec.isolating || i.type.spec.isolating)
    return !1;
  if (Ff(n, e, t))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (s = (o = r.contentMatchAt(r.childCount)).findWrapping(i.type)) && o.matchType(s[0] || i.type).validEnd) {
    if (t) {
      let u = e.pos + i.nodeSize, h = b.empty;
      for (let m = s.length - 1; m >= 0; m--)
        h = b.from(s[m].create(null, h));
      h = b.from(r.copy(h));
      let f = n.tr.step(new _(e.pos - 1, u, e.pos, u, new x(h, 1, 0), s.length, !0)), p = u + 2 * s.length;
      yt(f.doc, p) && f.join(p), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = A.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), d = c && hn(c);
  if (d != null && d >= e.depth)
    return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && ln(i, "start", !0) && ln(r, "end")) {
    let u = r, h = [];
    for (; h.push(u), !u.isTextblock; )
      u = u.lastChild;
    let f = i, p = 1;
    for (; !f.isTextblock; f = f.firstChild)
      p++;
    if (u.canReplace(u.childCount, u.childCount, f.content)) {
      if (t) {
        let m = b.empty;
        for (let y = h.length - 1; y >= 0; y--)
          m = b.from(h[y].copy(m));
        let g = n.tr.step(new _(e.pos - h.length, e.pos + i.nodeSize, e.pos + p, e.pos + i.nodeSize - p, new x(m, h.length, 0), 0, !0));
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ic(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (t && t(e.tr.setSelection(v.create(e.doc, n < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const Vf = Ic(-1), jf = Ic(1);
function Wf(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), l = o && Gs(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function vl(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let s = 0; s < t.selection.ranges.length && !i; s++) {
      let { $from: { pos: o }, $to: { pos: l } } = t.selection.ranges[s];
      t.doc.nodesBetween(o, l, (a, c) => {
        if (i)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n)
            i = !0;
          else {
            let d = t.doc.resolve(c), u = d.index();
            i = d.parent.canReplaceWith(u, u + 1, n);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let s = t.tr;
      for (let o = 0; o < t.selection.ranges.length; o++) {
        let { $from: { pos: l }, $to: { pos: a } } = t.selection.ranges[o];
        s.setBlockType(l, a, n, e);
      }
      r(s.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function _f(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && i.node(o.depth - 1).type.compatibleContent(n) && o.startIndex == 0) {
      if (i.index(o.depth - 1) == 0)
        return !1;
      let d = t.doc.resolve(o.start - 2);
      a = new Ar(d, d, o.depth), o.endIndex < o.parent.childCount && (o = new Ar(i, t.doc.resolve(s.end(o.depth)), o.depth)), l = !0;
    }
    let c = Gs(a, n, e, o);
    return c ? (r && r(Kf(t.tr, o, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function Kf(n, e, t, r, i) {
  let s = b.empty;
  for (let d = t.length - 1; d >= 0; d--)
    s = b.from(t[d].type.create(t[d].attrs, s));
  n.step(new _(e.start - (r ? 2 : 0), e.end, e.start, e.end, new x(s, 0, 0), t.length, !0));
  let o = 0;
  for (let d = 0; d < t.length; d++)
    t[d].type == i && (o = d + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let d = e.startIndex, u = e.endIndex, h = !0; d < u; d++, h = !1)
    !h && Xt(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(d).nodeSize;
  return n;
}
function Jf(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? qf(e, t, n, s) : Uf(e, t, s) : !0 : !1;
  };
}
function qf(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new _(s - 1, o, s, o, new x(b.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Ar(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const l = hn(r);
  if (l == null)
    return !1;
  i.lift(r, l);
  let a = i.mapping.map(s, -1) - 1;
  return yt(i.doc, a) && i.join(a), e(i.scrollIntoView()), !0;
}
function Uf(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let f = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    f -= i.child(p).nodeSize, r.delete(f - 1, f + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == i.childCount, c = s.node(-1), d = s.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, o.content.append(a ? b.empty : b.from(i))))
    return !1;
  let u = s.pos, h = u + o.nodeSize;
  return r.step(new _(u - (l ? 1 : 0), h + (a ? 1 : 0), u + 1, h - 1, new x((l ? b.empty : b.from(i.copy(b.empty))).append(a ? b.empty : b.from(i.copy(b.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function Gf(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!s)
      return !1;
    let o = s.startIndex;
    if (o == 0)
      return !1;
    let l = s.parent, a = l.child(o - 1);
    if (a.type != n)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, d = b.from(c ? n.create() : null), u = new x(b.from(n.create(null, b.from(l.type.create(null, d)))), c ? 3 : 1, 0), h = s.start, f = s.end;
      t(e.tr.step(new _(h - (c ? 3 : 1), f, h, f, u, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Mi(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: s } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return s;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, s = t.storedMarks, t;
    }
  };
}
class Ti {
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
    const { rawCommands: e, editor: t, state: r } = this, { view: i } = t, { tr: s } = r, o = this.buildProps(s);
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...d) => {
      const u = a(...d)(o);
      return !s.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(s), u;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, l = [], a = !!e, c = e || s.tr, d = () => (!a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(c), l.every((h) => h === !0)), u = {
      ...Object.fromEntries(Object.entries(r).map(([h, f]) => [h, (...m) => {
        const g = this.buildProps(c, t), y = f(...m)(g);
        return l.push(y), u;
      }])),
      run: d
    };
    return u;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, i = !1, s = e || r.tr, o = this.buildProps(s, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...d) => c(...d)({ ...o, dispatch: void 0 })])),
      chain: () => this.createChain(s, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, l = {
      tr: e,
      editor: i,
      view: o,
      state: Mi({
        state: s,
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
class Yf {
  constructor() {
    this.callbacks = {};
  }
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((i) => i.apply(this, t)), this;
  }
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((i) => i !== t) : delete this.callbacks[e]), this;
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}
function C(n, e, t) {
  return n.config[e] === void 0 && n.parent ? C(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? C(n.parent, e, t) : null
  }) : n.config[e];
}
function vi(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Lc(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = vi(n), i = [...t, ...r], s = {
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
    }, a = C(o, "addGlobalAttributes", l);
    if (!a)
      return;
    a().forEach((d) => {
      d.types.forEach((u) => {
        Object.entries(d.attributes).forEach(([h, f]) => {
          e.push({
            type: u,
            name: h,
            attribute: {
              ...s,
              ...f
            }
          });
        });
      });
    });
  }), i.forEach((o) => {
    const l = {
      name: o.name,
      options: o.options,
      storage: o.storage
    }, a = C(o, "addAttributes", l);
    if (!a)
      return;
    const c = a();
    Object.entries(c).forEach(([d, u]) => {
      const h = {
        ...s,
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
function J(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function B(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, s]) => {
      if (!r[i]) {
        r[i] = s;
        return;
      }
      if (i === "class") {
        const l = s ? s.split(" ") : [], a = r[i] ? r[i].split(" ") : [], c = l.filter((d) => !a.includes(d));
        r[i] = [...a, ...c].join(" ");
      } else i === "style" ? r[i] = [r[i], s].join("; ") : r[i] = s;
    }), r;
  }, {});
}
function Os(n, e) {
  return e.filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => B(t, r), {});
}
function Pc(n) {
  return typeof n == "function";
}
function N(n, e = void 0, ...t) {
  return Pc(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Xf(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function Qf(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Al(n, e) {
  return n.style ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : Qf(t.getAttribute(o.name));
        return l == null ? s : {
          ...s,
          [o.name]: l
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function El(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && Xf(t) ? !1 : t != null)
  );
}
function Zf(n, e) {
  var t;
  const r = Lc(n), { nodeExtensions: i, markExtensions: s } = vi(n), o = (t = i.find((c) => C(c, "topNode"))) === null || t === void 0 ? void 0 : t.name, l = Object.fromEntries(i.map((c) => {
    const d = r.filter((y) => y.type === c.name), u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, h = n.reduce((y, k) => {
      const S = C(k, "extendNodeSchema", u);
      return {
        ...y,
        ...S ? S(c) : {}
      };
    }, {}), f = El({
      ...h,
      content: N(C(c, "content", u)),
      marks: N(C(c, "marks", u)),
      group: N(C(c, "group", u)),
      inline: N(C(c, "inline", u)),
      atom: N(C(c, "atom", u)),
      selectable: N(C(c, "selectable", u)),
      draggable: N(C(c, "draggable", u)),
      code: N(C(c, "code", u)),
      defining: N(C(c, "defining", u)),
      isolating: N(C(c, "isolating", u)),
      attrs: Object.fromEntries(d.map((y) => {
        var k;
        return [y.name, { default: (k = y == null ? void 0 : y.attribute) === null || k === void 0 ? void 0 : k.default }];
      }))
    }), p = N(C(c, "parseHTML", u));
    p && (f.parseDOM = p.map((y) => Al(y, d)));
    const m = C(c, "renderHTML", u);
    m && (f.toDOM = (y) => m({
      node: y,
      HTMLAttributes: Os(y, d)
    }));
    const g = C(c, "renderText", u);
    return g && (f.toText = g), [c.name, f];
  })), a = Object.fromEntries(s.map((c) => {
    const d = r.filter((g) => g.type === c.name), u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, h = n.reduce((g, y) => {
      const k = C(y, "extendMarkSchema", u);
      return {
        ...g,
        ...k ? k(c) : {}
      };
    }, {}), f = El({
      ...h,
      inclusive: N(C(c, "inclusive", u)),
      excludes: N(C(c, "excludes", u)),
      group: N(C(c, "group", u)),
      spanning: N(C(c, "spanning", u)),
      code: N(C(c, "code", u)),
      attrs: Object.fromEntries(d.map((g) => {
        var y;
        return [g.name, { default: (y = g == null ? void 0 : g.attribute) === null || y === void 0 ? void 0 : y.default }];
      }))
    }), p = N(C(c, "parseHTML", u));
    p && (f.parseDOM = p.map((g) => Al(g, d)));
    const m = C(c, "renderHTML", u);
    return m && (f.toDOM = (g) => m({
      mark: g,
      HTMLAttributes: Os(g, d)
    })), [c.name, f];
  }));
  return new ru({
    topNode: o,
    nodes: l,
    marks: a
  });
}
function Qi(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Nl(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
const ep = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(Math.max(0, r - e), r, (i, s, o, l) => {
    var a, c;
    const d = ((c = (a = i.type.spec).toText) === null || c === void 0 ? void 0 : c.call(a, {
      node: i,
      pos: s,
      parent: o,
      index: l
    })) || i.textContent || "%leaf%";
    t += d.slice(0, Math.max(0, r - s));
  }), t;
};
function co(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class Ai {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const tp = (n, e) => {
  if (co(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function sr(n) {
  var e;
  const { editor: t, from: r, to: i, text: s, rules: o, plugin: l } = n, { view: a } = t;
  if (a.composing)
    return !1;
  const c = a.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || !((e = c.nodeBefore || c.nodeAfter) === null || e === void 0) && e.marks.find((h) => h.type.spec.code)
  )
    return !1;
  let d = !1;
  const u = ep(c) + s;
  return o.forEach((h) => {
    if (d)
      return;
    const f = tp(u, h.find);
    if (!f)
      return;
    const p = a.state.tr, m = Mi({
      state: a.state,
      transaction: p
    }), g = {
      from: r - (f[0].length - s.length),
      to: i
    }, { commands: y, chain: k, can: S } = new Ti({
      editor: t,
      state: m
    });
    h.handler({
      state: m,
      range: g,
      match: f,
      commands: y,
      chain: k,
      can: S
    }) === null || !p.steps.length || (p.setMeta(l, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), a.dispatch(p), d = !0);
  }), d;
}
function np(n) {
  const { editor: e, rules: t } = n, r = new X({
    state: {
      init() {
        return null;
      },
      apply(i, s) {
        const o = i.getMeta(r);
        if (o)
          return o;
        const l = i.getMeta("applyInputRules");
        return !!l && setTimeout(() => {
          const { from: c, text: d } = l, u = c + d.length;
          sr({
            editor: e,
            from: c,
            to: u,
            text: d,
            rules: t,
            plugin: r
          });
        }), i.selectionSet || i.docChanged ? null : s;
      }
    },
    props: {
      handleTextInput(i, s, o, l) {
        return sr({
          editor: e,
          from: s,
          to: o,
          text: l,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (i) => (setTimeout(() => {
          const { $cursor: s } = i.state.selection;
          s && sr({
            editor: e,
            from: s.pos,
            to: s.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      // add support for input rules to trigger on enter
      // this is useful for example for code blocks
      handleKeyDown(i, s) {
        if (s.key !== "Enter")
          return !1;
        const { $cursor: o } = i.state.selection;
        return o ? sr({
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
function rp(n) {
  return typeof n == "number";
}
class ip {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const sp = (n, e, t) => {
  if (co(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function op(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: l } = n, { commands: a, chain: c, can: d } = new Ti({
    editor: e,
    state: t
  }), u = [];
  return t.doc.nodesBetween(r, i, (f, p) => {
    if (!f.isTextblock || f.type.spec.code)
      return;
    const m = Math.max(r, p), g = Math.min(i, p + f.content.size), y = f.textBetween(m - p, g - p, void 0, "￼");
    sp(y, s.find, o).forEach((S) => {
      if (S.index === void 0)
        return;
      const R = m + S.index + 1, E = R + S[0].length, M = {
        from: t.tr.mapping.map(R),
        to: t.tr.mapping.map(E)
      }, I = s.handler({
        state: t,
        range: M,
        match: S,
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
const lp = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) === null || e === void 0 || e.setData("text/html", n), t;
};
function ap(n) {
  const { editor: e, rules: t } = n;
  let r = null, i = !1, s = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  const a = ({ state: d, from: u, to: h, rule: f, pasteEvt: p }) => {
    const m = d.tr, g = Mi({
      state: d,
      transaction: m
    });
    if (!(!op({
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
        drop: (u, h) => (s = r === u.dom.parentElement, l = h, !1),
        paste: (u, h) => {
          var f;
          const p = (f = h.clipboardData) === null || f === void 0 ? void 0 : f.getData("text/html");
          return o = h, i = !!(p != null && p.includes("data-pm-slice")), !1;
        }
      }
    },
    appendTransaction: (u, h, f) => {
      const p = u[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !s, y = p.getMeta("applyPasteRules"), k = !!y;
      if (!m && !g && !k)
        return;
      if (k) {
        const { from: E, text: M } = y, I = E + M.length, q = lp(M);
        return a({
          rule: d,
          state: f,
          from: E,
          to: { b: I },
          pasteEvt: q
        });
      }
      const S = h.doc.content.findDiffStart(f.doc.content), R = h.doc.content.findDiffEnd(f.doc.content);
      if (!(!rp(S) || !R || S === R.b))
        return a({
          rule: d,
          state: f,
          from: S,
          to: R,
          pasteEvt: o
        });
    }
  }));
}
function cp(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return [...new Set(e)];
}
class Gt {
  constructor(e, t) {
    this.splittableMarks = [], this.editor = t, this.extensions = Gt.resolve(e), this.schema = Zf(this.extensions, t), this.setupExtensions();
  }
  /**
   * Returns a flattened and sorted extension list while
   * also checking for duplicated extensions and warns the user.
   * @param extensions An array of Tiptap extensions
   * @returns An flattened and sorted array of Tiptap extensions
   */
  static resolve(e) {
    const t = Gt.sort(Gt.flatten(e)), r = cp(t.map((i) => i.name));
    return r.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${r.map((i) => `'${i}'`).join(", ")}]. This can lead to issues.`), t;
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
      }, i = C(t, "addExtensions", r);
      return i ? [t, ...this.flatten(i())] : t;
    }).flat(10);
  }
  /**
   * Sort extensions by priority.
   * @param extensions An array of Tiptap extensions
   * @returns A sorted array of Tiptap extensions by priority
   */
  static sort(e) {
    return e.sort((r, i) => {
      const s = C(r, "priority") || 100, o = C(i, "priority") || 100;
      return s > o ? -1 : s < o ? 1 : 0;
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
        type: Qi(t.name, this.schema)
      }, i = C(t, "addCommands", r);
      return i ? {
        ...e,
        ...i()
      } : e;
    }, {});
  }
  /**
   * Get all registered Prosemirror plugins from the extensions.
   * @returns An array of Prosemirror plugins
   */
  get plugins() {
    const { editor: e } = this, t = Gt.sort([...this.extensions].reverse()), r = [], i = [], s = t.map((o) => {
      const l = {
        name: o.name,
        options: o.options,
        storage: o.storage,
        editor: e,
        type: Qi(o.name, this.schema)
      }, a = [], c = C(o, "addKeyboardShortcuts", l);
      let d = {};
      if (o.type === "mark" && o.config.exitable && (d.ArrowRight = () => Ce.handleExit({ editor: e, mark: o })), c) {
        const m = Object.fromEntries(Object.entries(c()).map(([g, y]) => [g, () => y({ editor: e })]));
        d = { ...d, ...m };
      }
      const u = Mf(d);
      a.push(u);
      const h = C(o, "addInputRules", l);
      Nl(o, e.options.enableInputRules) && h && r.push(...h());
      const f = C(o, "addPasteRules", l);
      Nl(o, e.options.enablePasteRules) && f && i.push(...f());
      const p = C(o, "addProseMirrorPlugins", l);
      if (p) {
        const m = p();
        a.push(...m);
      }
      return a;
    }).flat();
    return [
      np({
        editor: e,
        rules: r
      }),
      ...ap({
        editor: e,
        rules: i
      }),
      ...s
    ];
  }
  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return Lc(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: e } = this, { nodeExtensions: t } = vi(this.extensions);
    return Object.fromEntries(t.filter((r) => !!C(r, "addNodeView")).map((r) => {
      const i = this.attributes.filter((a) => a.type === r.name), s = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: e,
        type: J(r.name, this.schema)
      }, o = C(r, "addNodeView", s);
      if (!o)
        return [];
      const l = (a, c, d, u) => {
        const h = Os(a, i);
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
        type: Qi(e.name, this.schema)
      };
      e.type === "mark" && (!((t = N(C(e, "keepOnSplit", r))) !== null && t !== void 0) || t) && this.splittableMarks.push(e.name);
      const i = C(e, "onBeforeCreate", r), s = C(e, "onCreate", r), o = C(e, "onUpdate", r), l = C(e, "onSelectionUpdate", r), a = C(e, "onTransaction", r), c = C(e, "onFocus", r), d = C(e, "onBlur", r), u = C(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), l && this.editor.on("selectionUpdate", l), a && this.editor.on("transaction", a), c && this.editor.on("focus", c), d && this.editor.on("blur", d), u && this.editor.on("destroy", u);
    });
  }
}
function dp(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Zi(n) {
  return dp(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Ei(n, e) {
  const t = { ...n };
  return Zi(n) && Zi(e) && Object.keys(e).forEach((r) => {
    Zi(e[r]) ? r in n ? t[r] = Ei(n[r], e[r]) : Object.assign(t, { [r]: e[r] }) : Object.assign(t, { [r]: e[r] });
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
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = N(C(this, "addOptions", {
      name: this.name
    }))), this.storage = N(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new pe(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.parent = this.parent, t.options = Ei(this.options, e), t.storage = N(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new pe({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = N(C(t, "addOptions", {
      name: t.name
    })), t.storage = N(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Bc(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = t || {};
  let l = "";
  return n.nodesBetween(r, i, (a, c, d, u) => {
    var h;
    a.isBlock && c > r && (l += s);
    const f = o == null ? void 0 : o[a.type.name];
    if (f)
      return d && (l += f({
        node: a,
        pos: c,
        parent: d,
        index: u,
        range: e
      })), !1;
    a.isText && (l += (h = a == null ? void 0 : a.text) === null || h === void 0 ? void 0 : h.slice(Math.max(r, c) - c, i - c));
  }), l;
}
function $c(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
const up = pe.create({
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
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((d) => d.$from.pos)), l = Math.max(...s.map((d) => d.$to.pos)), a = $c(t);
            return Bc(r, { from: o, to: l }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: a
            });
          }
        }
      })
    ];
  }
}), hp = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), fp = (n = !1) => ({ commands: e }) => e.setContent("", n), pp = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: d } = e, u = c.resolve(d.map(a)), h = c.resolve(d.map(a + l.nodeSize)), f = u.blockRange(h);
      if (!f)
        return;
      const p = hn(f);
      if (l.type.isTextblock) {
        const { defaultType: m } = u.parent.contentMatchAt(u.index());
        e.setNodeMarkup(f.start, m);
      }
      (p || p === 0) && e.lift(f, p);
    });
  }), !0;
}, mp = (n) => (e) => n(e), gp = () => ({ state: n, dispatch: e }) => $f(n, e), yp = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new v(r.doc.resolve(o - 1))), !0;
}, bp = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let s = i.depth; s > 0; s -= 1)
    if (i.node(s).type === r.type) {
      if (e) {
        const l = i.before(s), a = i.after(s);
        n.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, kp = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = J(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const a = s.before(o), c = s.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, wp = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, xp = () => ({ state: n, dispatch: e }) => Tf(n, e), Cp = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Sp = () => ({ state: n, dispatch: e }) => Bf(n, e);
function Br(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : co(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function Rs(n, e, t = {}) {
  return n.find((r) => r.type === e && Br(r.attrs, t));
}
function Mp(n, e, t = {}) {
  return !!Rs(n, e, t);
}
function uo(n, e, t = {}) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if (n.parentOffset === r.offset && r.offset !== 0 && (r = n.parent.childBefore(n.parentOffset)), !r.node)
    return;
  const i = Rs([...r.node.marks], e, t);
  if (!i)
    return;
  let s = r.index, o = n.start() + r.offset, l = s + 1, a = o + r.node.nodeSize;
  for (Rs([...r.node.marks], e, t); s > 0 && i.isInSet(n.parent.child(s - 1).marks); )
    s -= 1, o -= n.parent.child(s).nodeSize;
  for (; l < n.parent.childCount && Mp([...n.parent.child(l).marks], e, t); )
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
const Tp = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = kt(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: d } = l;
  if (i) {
    const u = uo(a, s, e);
    if (u && u.from <= c && u.to >= d) {
      const h = v.create(o, u.from, u.to);
      t.setSelection(h);
    }
  }
  return !0;
}, vp = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function zc(n) {
  return n instanceof v;
}
function Tt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Hc(n, e = null) {
  if (!e)
    return null;
  const t = A.atStart(n), r = A.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? v.create(n, Tt(0, i, s), Tt(n.content.size, i, s)) : v.create(n, Tt(e, i, s), Tt(e, i, s));
}
function ho() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const Ap = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    ho() && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (s && n === null && !zc(t.state.selection))
    return o(), !0;
  const l = Hc(i.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return s && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, Ep = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), Np = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Fc = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Fc(r);
  }
  return n;
};
function Ol(n) {
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Fc(t);
}
function $r(n, e, t) {
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const r = typeof n == "object" && n !== null, i = typeof n == "string";
  if (r)
    try {
      return Array.isArray(n) && n.length > 0 ? b.fromArray(n.map((o) => e.nodeFromJSON(o))) : e.nodeFromJSON(n);
    } catch (s) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), $r("", e, t);
    }
  if (i) {
    const s = nn.fromSchema(e);
    return t.slice ? s.parseSlice(Ol(n), t.parseOptions).content : s.parse(Ol(n), t.parseOptions);
  }
  return $r("", e, t);
}
function Op(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof W || i instanceof _))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((l, a, c, d) => {
    o === 0 && (o = d);
  }), n.setSelection(A.near(n.doc.resolve(o), t));
}
const Rp = (n) => n.toString().startsWith("<"), Dp = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
  if (i) {
    t = {
      parseOptions: {},
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    const o = $r(e, s.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...t.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, c = !0, d = !0;
    if ((Rp(o) ? o : [o]).forEach((f) => {
      f.check(), c = c ? f.isText && f.marks.length === 0 : !1, d = d ? f.isBlock : !1;
    }), l === a && d) {
      const { parent: f } = r.doc.resolve(l);
      f.isTextblock && !f.type.spec.code && !f.childCount && (l -= 1, a += 1);
    }
    let h;
    c ? (Array.isArray(e) ? h = e.map((f) => f.text || "").join("") : typeof e == "object" && e && e.text ? h = e.text : h = e, r.insertText(h, l, a)) : (h = o, r.replaceWith(l, a, h)), t.updateSelection && Op(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: l, text: h }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: l, text: h });
  }
  return !0;
}, Ip = () => ({ state: n, dispatch: e }) => Df(n, e), Lp = () => ({ state: n, dispatch: e }) => If(n, e), Pp = () => ({ state: n, dispatch: e }) => vf(n, e), Bp = () => ({ state: n, dispatch: e }) => Of(n, e), $p = () => ({ tr: n, state: e, dispatch: t }) => {
  try {
    const r = bi(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, zp = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = bi(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Hp = () => ({ state: n, dispatch: e }) => Af(n, e), Fp = () => ({ state: n, dispatch: e }) => Ef(n, e);
function Vc() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Vp(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      ho() || Vc() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
const jp = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = Vp(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a == null || a.steps.forEach((c) => {
    const d = c.map(r.mapping);
    d && i && r.maybeStep(d);
  }), !0;
};
function Bn(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? J(e, n.schema) : null, l = [];
  n.doc.nodesBetween(r, i, (u, h) => {
    if (u.isText)
      return;
    const f = Math.max(r, h), p = Math.min(i, h + u.nodeSize);
    l.push({
      node: u,
      from: f,
      to: p
    });
  });
  const a = i - r, c = l.filter((u) => o ? o.name === u.node.type.name : !0).filter((u) => Br(u.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((u, h) => u + h.to - h.from, 0) >= a;
}
const Wp = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = J(n, t.schema);
  return Bn(t, i, e) ? Lf(t, r) : !1;
}, _p = () => ({ state: n, dispatch: e }) => zf(n, e), Kp = (n) => ({ state: e, dispatch: t }) => {
  const r = J(n, e.schema);
  return Jf(r)(e, t);
}, Jp = () => ({ state: n, dispatch: e }) => Pf(n, e);
function Ni(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Rl(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
const qp = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = Ni(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (s = J(n, r.schema)), l === "mark" && (o = kt(n, r.schema)), i && t.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
      s && s === c.type && t.setNodeMarkup(d, void 0, Rl(c.attrs, e)), o && c.marks.length && c.marks.forEach((u) => {
        o === u.type && t.addMark(d, d + c.nodeSize, o.create(Rl(u.attrs, e)));
      });
    });
  }), !0) : !1;
}, Up = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), Gp = () => ({ tr: n, commands: e }) => e.setTextSelection({
  from: 0,
  to: n.doc.content.size
}), Yp = () => ({ state: n, dispatch: e }) => Nf(n, e), Xp = () => ({ state: n, dispatch: e }) => Rf(n, e), Qp = () => ({ state: n, dispatch: e }) => Hf(n, e), Zp = () => ({ state: n, dispatch: e }) => jf(n, e), em = () => ({ state: n, dispatch: e }) => Vf(n, e);
function jc(n, e, t = {}) {
  return $r(n, e, { slice: !1, parseOptions: t });
}
const tm = (n, e = !1, t = {}) => ({ tr: r, editor: i, dispatch: s }) => {
  const { doc: o } = r, l = jc(n, i.schema, t);
  return s && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function Oi(n, e) {
  const t = kt(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function nm(n, e) {
  const t = new Ys(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function rm(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function im(n, e, t) {
  const r = [];
  return n.nodesBetween(e.from, e.to, (i, s) => {
    t(i) && r.push({
      node: i,
      pos: s
    });
  }), r;
}
function Wc(n, e) {
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
function fo(n) {
  return (e) => Wc(e.$from, n);
}
function sm(n, e) {
  const t = ze.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function om(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Bc(n, t, e);
}
function lm(n, e) {
  const t = J(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (l) => {
    s.push(l);
  });
  const o = s.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function _c(n, e) {
  const t = Ni(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? lm(n, e) : t === "mark" ? Oi(n, e) : {};
}
function am(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function cm(n) {
  const e = am(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function dm(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((i, s) => {
    const o = [];
    if (i.ranges.length)
      i.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = t[s];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(s).map(l, -1), d = e.slice(s).map(a), u = e.invert().map(c, -1), h = e.invert().map(d);
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
  }), cm(r);
}
function po(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((i) => {
    const s = t.resolve(n - 1), o = uo(s, i.type);
    o && r.push({
      mark: i,
      ...o
    });
  }) : t.nodesBetween(n, e, (i, s) => {
    !i || (i == null ? void 0 : i.nodeSize) === void 0 || r.push(...i.marks.map((o) => ({
      from: s,
      to: s + i.nodeSize,
      mark: o
    })));
  }), r;
}
function yr(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const i = n.find((s) => s.type === e && s.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function Ds(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? kt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((u) => s ? s.name === u.type.name : !0).find((u) => Br(u.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (i.forEach(({ $from: u, $to: h }) => {
    const f = u.pos, p = h.pos;
    n.doc.nodesBetween(f, p, (m, g) => {
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(f, g), k = Math.min(p, g + m.nodeSize), S = k - y;
      o += S, l.push(...m.marks.map((R) => ({
        mark: R,
        from: y,
        to: k
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((u) => s ? s.name === u.mark.type.name : !0).filter((u) => Br(u.mark.attrs, t, { strict: !1 })).reduce((u, h) => u + h.to - h.from, 0), c = l.filter((u) => s ? u.mark.type !== s && u.mark.type.excludes(s) : !0).reduce((u, h) => u + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function um(n, e, t = {}) {
  if (!e)
    return Bn(n, null, t) || Ds(n, null, t);
  const r = Ni(e, n.schema);
  return r === "node" ? Bn(n, e, t) : r === "mark" ? Ds(n, e, t) : !1;
}
function Dl(n, e) {
  const { nodeExtensions: t } = vi(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = N(C(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function hm(n) {
  var e;
  const t = (e = n.type.createAndFill()) === null || e === void 0 ? void 0 : e.toJSON(), r = n.toJSON();
  return JSON.stringify(t) === JSON.stringify(r);
}
function fm(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (zc(i) && (s = i.$cursor), s) {
    const l = (r = n.storedMarks) !== null && r !== void 0 ? r : s.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: o } = i;
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
const pm = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: l } = s, a = kt(n, r.schema);
  if (i)
    if (o) {
      const c = Oi(r, a);
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
  return fm(r, t, a);
}, mm = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), gm = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = J(n, t.schema);
  return s.isTextblock ? i().command(({ commands: o }) => vl(s, e)(t) ? !0 : o.clearNodes()).command(({ state: o }) => vl(s, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, ym = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = Tt(n, 0, r.content.size), s = T.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, bm = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = v.atStart(r).from, l = v.atEnd(r).to, a = Tt(i, o, l), c = Tt(s, o, l), d = v.create(r, a, c);
    e.setSelection(d);
  }
  return !0;
}, km = (n) => ({ state: e, dispatch: t }) => {
  const r = J(n, e.schema);
  return Gf(r)(e, t);
};
function Il(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
const wm = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: l, $to: a } = s, c = i.extensionManager.attributes, d = yr(c, l.node().type.name, l.node().attrs);
  if (s instanceof T && s.node.isBlock)
    return !l.parentOffset || !Xt(o, l.pos) ? !1 : (r && (n && Il(t, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const u = a.parentOffset === a.parent.content.size;
    s instanceof v && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : rm(l.node(-1).contentMatchAt(l.indexAfter(-1)));
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
    n && Il(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, xm = (n) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  var s;
  const o = J(n, t.schema), { $from: l, $to: a } = t.selection, c = t.selection.node;
  if (c && c.isBlock || l.depth < 2 || !l.sameParent(a))
    return !1;
  const d = l.node(-1);
  if (d.type !== o)
    return !1;
  const u = i.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== o || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (r) {
      let g = b.empty;
      const y = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let I = l.depth - y; I >= l.depth - 3; I -= 1)
        g = b.from(l.node(I).copy(g));
      const k = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, S = yr(u, l.node().type.name, l.node().attrs), R = ((s = o.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(S)) || void 0;
      g = g.append(b.from(o.createAndFill(null, R) || void 0));
      const E = l.before(l.depth - (y - 1));
      e.replace(E, l.after(-k), new x(g, 4 - y, 0));
      let M = -1;
      e.doc.nodesBetween(E, e.doc.content.size, (I, q) => {
        if (M > -1)
          return !1;
        I.isTextblock && I.content.size === 0 && (M = q + 1);
      }), M > -1 && e.setSelection(v.near(e.doc.resolve(M))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null, f = yr(u, d.type.name, d.attrs), p = yr(u, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const m = h ? [
    { type: o, attrs: f },
    { type: h, attrs: p }
  ] : [{ type: o, attrs: f }];
  if (!Xt(e.doc, l.pos, 2))
    return !1;
  if (r) {
    const { selection: g, storedMarks: y } = t, { splittableMarks: k } = i.extensionManager, S = y || g.$to.parentOffset && g.$from.marks();
    if (e.split(l.pos, 2, m).scrollIntoView(), !S || !r)
      return !0;
    const R = S.filter((E) => k.includes(E.type.name));
    e.ensureMarks(R);
  }
  return !0;
}, es = (n, e) => {
  const t = fo((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && yt(n.doc, t.pos) && n.join(t.pos), !0;
}, ts = (n, e) => {
  const t = fo((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && yt(n.doc, r) && n.join(r), !0;
}, Cm = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: l, chain: a, commands: c, can: d }) => {
  const { extensions: u, splittableMarks: h } = i.extensionManager, f = J(n, o.schema), p = J(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: k } = m, S = y.blockRange(k), R = g || m.$to.parentOffset && m.$from.marks();
  if (!S)
    return !1;
  const E = fo((M) => Dl(M.type.name, u))(m);
  if (S.depth >= 1 && E && S.depth - E.depth <= 1) {
    if (E.node.type === f)
      return c.liftListItem(p);
    if (Dl(E.node.type.name, u) && f.validContent(E.node.content) && l)
      return a().command(() => (s.setNodeMarkup(E.pos, f), !0)).command(() => es(s, f)).command(() => ts(s, f)).run();
  }
  return !t || !R || !l ? a().command(() => d().wrapInList(f, r) ? !0 : c.clearNodes()).wrapInList(f, r).command(() => es(s, f)).command(() => ts(s, f)).run() : a().command(() => {
    const M = d().wrapInList(f, r), I = R.filter((q) => h.includes(q.type.name));
    return s.ensureMarks(I), M ? !0 : c.clearNodes();
  }).wrapInList(f, r).command(() => es(s, f)).command(() => ts(s, f)).run();
}, Sm = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = kt(n, r.schema);
  return Ds(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, Mm = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = J(n, r.schema), o = J(e, r.schema);
  return Bn(r, s, t) ? i.setNode(o) : i.setNode(s, t);
}, Tm = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = J(n, t.schema);
  return Bn(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, vm = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let s;
    if (i.spec.isInputRules && (s = i.getState(n))) {
      if (e) {
        const o = n.tr, l = s.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (s.text) {
          const a = o.doc.resolve(s.from).marks();
          o.replaceWith(s.from, s.to, n.schema.text(s.text, a));
        } else
          o.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, Am = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Em = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = kt(n, r.schema), { $from: c, empty: d, ranges: u } = l;
  if (!i)
    return !0;
  if (d && o) {
    let { from: h, to: f } = l;
    const p = (s = c.marks().find((g) => g.type === a)) === null || s === void 0 ? void 0 : s.attrs, m = uo(c, a, p);
    m && (h = m.from, f = m.to), t.removeMark(h, f, a);
  } else
    u.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, Nm = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = Ni(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (s = J(n, r.schema)), l === "mark" && (o = kt(n, r.schema)), i && t.selection.ranges.forEach((a) => {
    const c = a.$from.pos, d = a.$to.pos;
    r.doc.nodesBetween(c, d, (u, h) => {
      s && s === u.type && t.setNodeMarkup(h, void 0, {
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
}, Om = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = J(n, t.schema);
  return Wf(i, e)(t, r);
}, Rm = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = J(n, t.schema);
  return _f(i, e)(t, r);
};
var Dm = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: hp,
  clearContent: fp,
  clearNodes: pp,
  command: mp,
  createParagraphNear: gp,
  cut: yp,
  deleteCurrentNode: bp,
  deleteNode: kp,
  deleteRange: wp,
  deleteSelection: xp,
  enter: Cp,
  exitCode: Sp,
  extendMarkRange: Tp,
  first: vp,
  focus: Ap,
  forEach: Ep,
  insertContent: Np,
  insertContentAt: Dp,
  joinUp: Ip,
  joinDown: Lp,
  joinBackward: Pp,
  joinForward: Bp,
  joinItemBackward: $p,
  joinItemForward: zp,
  joinTextblockBackward: Hp,
  joinTextblockForward: Fp,
  keyboardShortcut: jp,
  lift: Wp,
  liftEmptyBlock: _p,
  liftListItem: Kp,
  newlineInCode: Jp,
  resetAttributes: qp,
  scrollIntoView: Up,
  selectAll: Gp,
  selectNodeBackward: Yp,
  selectNodeForward: Xp,
  selectParentNode: Qp,
  selectTextblockEnd: Zp,
  selectTextblockStart: em,
  setContent: tm,
  setMark: pm,
  setMeta: mm,
  setNode: gm,
  setNodeSelection: ym,
  setTextSelection: bm,
  sinkListItem: km,
  splitBlock: wm,
  splitListItem: xm,
  toggleList: Cm,
  toggleMark: Sm,
  toggleNode: Mm,
  toggleWrap: Tm,
  undoInputRule: vm,
  unsetAllMarks: Am,
  unsetMark: Em,
  updateAttributes: Nm,
  wrapIn: Om,
  wrapInList: Rm
});
const Im = pe.create({
  name: "commands",
  addCommands() {
    return {
      ...Dm
    };
  }
}), Lm = pe.create({
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
}), Pm = pe.create({
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
}), Bm = pe.create({
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
    }, i = {
      ...r
    }, s = {
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
    return ho() || Vc() ? s : i;
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
          const { empty: i, from: s, to: o } = e.selection, l = A.atStart(e.doc).from, a = A.atEnd(e.doc).to;
          if (i || !(s === l && o === a) || !(t.doc.textBetween(0, t.doc.content.size, " ", " ").length === 0))
            return;
          const u = t.tr, h = Mi({
            state: t,
            transaction: u
          }), { commands: f } = new Ti({
            editor: this.editor,
            state: h
          });
          if (f.clearNodes(), !!u.steps.length)
            return u;
        }
      })
    ];
  }
}), $m = pe.create({
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
  constructor(e, t, r = !1, i = null) {
    this.currentNode = null, this.actualDepth = null, this.isBlock = r, this.resolvedPos = e, this.editor = t, this.currentNode = i;
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
      const i = t.isBlock && !t.isTextblock, s = this.pos + r + 1, o = this.resolvedPos.doc.resolve(s);
      if (!i && o.depth <= this.depth)
        return;
      const l = new Ct(o, this.editor, i, i ? t : null);
      i && (l.actualDepth = this.depth + 1), e.push(new Ct(o, this.editor, i, i ? t : null));
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
    let r = null, i = this.parent;
    for (; i && !r; ) {
      if (i.node.type.name === e)
        if (Object.keys(t).length > 0) {
          const s = i.node.attrs, o = Object.keys(t);
          for (let l = 0; l < o.length; l += 1) {
            const a = o[l];
            if (s[a] !== t[a])
              break;
          }
        } else
          r = i;
      i = i.parent;
    }
    return r;
  }
  querySelector(e, t = {}) {
    return this.querySelectorAll(e, t, !0)[0] || null;
  }
  querySelectorAll(e, t = {}, r = !1) {
    let i = [];
    if (!this.children || this.children.length === 0)
      return i;
    const s = Object.keys(t);
    return this.children.forEach((o) => {
      r && i.length > 0 || (o.node.type.name === e && s.every((a) => t[a] === o.node.attrs[a]) && i.push(o), !(r && i.length > 0) && (i = i.concat(o.querySelectorAll(e, t, r))));
    }), i;
  }
  setAttribute(e) {
    const t = this.editor.state.selection;
    this.editor.chain().setTextSelection(this.from).updateAttributes(this.node.type.name, e).setTextSelection(t.from).run();
  }
}
const zm = `.ProseMirror {
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
function Hm(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
class Fm extends Yf {
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
    this.options.injectCSS && document && (this.css = Hm(zm, this.options.injectNonce));
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
    const r = Pc(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
    this.view.updateState(i);
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
      plugins: this.state.plugins.filter((i) => !i.key.startsWith(t))
    });
    this.view.updateState(r);
  }
  /**
   * Creates an extension manager.
   */
  createExtensionManager() {
    var e, t;
    const i = [...this.options.enableCoreExtensions ? [
      Lm,
      up.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) === null || e === void 0 ? void 0 : e.clipboardTextSerializer) === null || t === void 0 ? void 0 : t.blockSeparator
      }),
      Im,
      Pm,
      Bm,
      $m
    ] : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s == null ? void 0 : s.type));
    this.extensionManager = new Gt(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new Ti({
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
    const e = jc(this.options.content, this.schema, this.options.parseOptions), t = Hc(e, this.options.autofocus);
    this.view = new mf(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: Ut.create({
        doc: e,
        selection: t || void 0
      })
    });
    const r = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(r), this.createNodeViews(), this.prependClass();
    const i = this.view.dom;
    i.editor = this;
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
    const i = e.getMeta("focus"), s = e.getMeta("blur");
    i && this.emit("focus", {
      editor: this,
      event: i.event,
      transaction: e
    }), s && this.emit("blur", {
      editor: this,
      event: s.event,
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
    return _c(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return um(this.state, r, i);
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
    return sm(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return om(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...$c(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return hm(this.state.doc);
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
function an(n) {
  return new Ai({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = N(n.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: s } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = t.from + l.indexOf(o), d = c + o.length;
        if (po(t.from, t.to, e.doc).filter((f) => f.mark.type.excluded.find((m) => m === n.type && m !== f.mark.type)).filter((f) => f.to > c).length)
          return null;
        d < t.to && s.delete(d, t.to), c > t.from && s.delete(t.from + a, c);
        const h = t.from + a + o.length;
        s.addMark(t.from + a, h, n.type.create(i || {})), s.removeStoredMark(n.type);
      }
    }
  });
}
function Vm(n) {
  return new Ai({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = N(n.getAttributes, void 0, r) || {}, { tr: s } = e, o = t.from;
      let l = t.to;
      const a = n.type.create(i);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let d = o + c;
        d > l ? d = l : l = d + r[1].length;
        const u = r[0][r[0].length - 1];
        s.insertText(u, o + r[0].length - 1), s.replaceWith(d, l, a);
      } else r[0] && s.insert(o - 1, n.type.create(i)).delete(s.mapping.map(o), s.mapping.map(l));
      s.scrollIntoView();
    }
  });
}
function Is(n) {
  return new Ai({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = e.doc.resolve(t.from), s = N(n.getAttributes, void 0, r) || {};
      if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, s);
    }
  });
}
function $n(n) {
  return new Ai({
    find: n.find,
    handler: ({ state: e, range: t, match: r, chain: i }) => {
      const s = N(n.getAttributes, void 0, r) || {}, o = e.tr.delete(t.from, t.to), a = o.doc.resolve(t.from).blockRange(), c = a && Gs(a, n.type, s);
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
        i().updateAttributes(u, s).run();
      }
      const d = o.doc.resolve(t.from - 1).nodeBefore;
      d && d.type === n.type && yt(o.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, d)) && o.join(t.from - 1);
    }
  });
}
class Ce {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = N(C(this, "addOptions", {
      name: this.name
    }))), this.storage = N(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ce(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = Ei(this.options, e), t.storage = N(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Ce({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = N(C(t, "addOptions", {
      name: t.name
    })), t.storage = N(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const o = i.marks();
      if (!!!o.find((c) => (c == null ? void 0 : c.type.name) === t.name))
        return !1;
      const a = o.find((c) => (c == null ? void 0 : c.type.name) === t.name);
      return a && r.removeStoredMark(a), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
let Q = class Ls {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = N(C(this, "addOptions", {
      name: this.name
    }))), this.storage = N(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ls(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = Ei(this.options, e), t.storage = N(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Ls({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = N(C(t, "addOptions", {
      name: t.name
    })), t.storage = N(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
};
function $t(n) {
  return new ip({
    find: n.find,
    handler: ({ state: e, range: t, match: r, pasteEvent: i }) => {
      const s = N(n.getAttributes, void 0, r, i);
      if (s === !1 || s === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = t.to;
      if (l) {
        const d = a.search(/\S/), u = t.from + a.indexOf(l), h = u + l.length;
        if (po(t.from, t.to, e.doc).filter((p) => p.mark.type.excluded.find((g) => g === n.type && g !== p.mark.type)).filter((p) => p.to > u).length)
          return null;
        h < t.to && o.delete(h, t.to), u > t.from && o.delete(t.from + d, u), c = t.from + d + l.length, o.addMark(t.from + d, c, n.type.create(s || {})), o.removeStoredMark(n.type);
      }
    }
  });
}
const jm = /^\s*>\s$/, Wm = Q.create({
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
    return ["blockquote", B(this.options.HTMLAttributes, n), 0];
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
      $n({
        find: jm,
        type: this.type
      })
    ];
  }
}), _m = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, Km = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, Jm = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, qm = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, Um = Ce.create({
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
    return ["strong", B(this.options.HTMLAttributes, n), 0];
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
        find: _m,
        type: this.type
      }),
      an({
        find: Jm,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: Km,
        type: this.type
      }),
      $t({
        find: qm,
        type: this.type
      })
    ];
  }
}), Gm = Q.create({
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
    return ["li", B(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Ll = Ce.create({
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
    return ["span", B(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: n, commands: e }) => {
        const t = Oi(n, this.type);
        return Object.entries(t).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), Pl = /^\s*([-+*])\s$/, Ym = Q.create({
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
    return ["ul", B(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Gm.name, this.editor.getAttributes(Ll.name)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let n = $n({
      find: Pl,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = $n({
      find: Pl,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(Ll.name),
      editor: this.editor
    })), [
      n
    ];
  }
}), Xm = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/, Qm = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g, Zm = Ce.create({
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
    return ["code", B(this.options.HTMLAttributes, n), 0];
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
        find: Xm,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: Qm,
        type: this.type
      })
    ];
  }
}), eg = /^```([a-z]+)?[\s\n]$/, tg = /^~~~([a-z]+)?[\s\n]$/, ng = Q.create({
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
          const { languageClassPrefix: t } = this.options, s = [...((e = n.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((o) => o.startsWith(t)).map((o) => o.replace(t, ""))[0];
          return s || null;
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
      B(this.options.HTMLAttributes, e),
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
        const { state: e } = n, { selection: t } = e, { $from: r, empty: i } = t;
        if (!i || r.parent.type !== this.type)
          return !1;
        const s = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !s || !o ? !1 : n.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: n }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = n, { selection: t, doc: r } = e, { $from: i, empty: s } = t;
        if (!s || i.parent.type !== this.type || !(i.parentOffset === i.parent.nodeSize - 2))
          return !1;
        const l = i.after();
        return l === void 0 || r.nodeAt(l) ? !1 : n.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      Is({
        find: eg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      Is({
        find: tg,
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
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), i = r ? JSON.parse(r) : void 0, s = i == null ? void 0 : i.mode;
            if (!t || !s)
              return !1;
            const { tr: o } = n.state;
            return n.state.selection.from === n.state.doc.nodeSize - (1 + n.state.selection.$to.depth * 2) ? o.insert(n.state.selection.from - 1, this.type.create({ language: s })) : o.replaceSelectionWith(this.type.create({ language: s })), o.setSelection(v.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(t.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), n.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), rg = Q.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function ig(n = {}) {
  return new X({
    view(e) {
      return new sg(e, n);
    }
  });
}
class sg {
  constructor(e, t) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = t.width) !== null && r !== void 0 ? r : 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((i) => {
      let s = (o) => {
        this[i](o);
      };
      return e.dom.addEventListener(i, s), { name: i, handler: s };
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
    let i = this.editorView.dom.offsetParent;
    this.element || (this.element = i.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
    let s, o;
    if (!i || i == document.body && getComputedStyle(i).position == "static")
      s = -pageXOffset, o = -pageYOffset;
    else {
      let l = i.getBoundingClientRect();
      s = l.left - i.scrollLeft, o = l.top - i.scrollTop;
    }
    this.element.style.left = r.left - s + "px", this.element.style.top = r.top - o + "px", this.element.style.width = r.right - r.left + "px", this.element.style.height = r.bottom - r.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), i = r && r.type.spec.disableDropCursor, s = typeof i == "function" ? i(this.editorView, t, e) : i;
    if (t && !s) {
      let o = t.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let l = Va(this.editorView.state.doc, o, this.editorView.dragging.slice);
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
const og = pe.create({
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
      ig(this.options)
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
    return new mo(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !lg(e) || !ag(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let i = t.contentMatchAt(e.index()).defaultType;
    return i && i.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, t, r = !1) {
    e: for (; ; ) {
      if (!r && H.valid(e))
        return e;
      let i = e.pos, s = null;
      for (let o = e.depth; ; o--) {
        let l = e.node(o);
        if (t > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
          s = l.child(t > 0 ? e.indexAfter(o) : e.index(o) - 1);
          break;
        } else if (o == 0)
          return null;
        i += t;
        let a = e.doc.resolve(i);
        if (H.valid(a))
          return a;
      }
      for (; ; ) {
        let o = t > 0 ? s.firstChild : s.lastChild;
        if (!o) {
          if (s.isAtom && !s.isText && !T.isSelectable(s)) {
            e = e.doc.resolve(i + s.nodeSize * t), r = !1;
            continue e;
          }
          break;
        }
        s = o, i += t;
        let l = e.doc.resolve(i);
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
class mo {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new mo(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return H.valid(t) ? new H(t) : A.near(t);
  }
}
function lg(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t - 1); ; i = i.lastChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function ag(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t); ; i = i.firstChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function cg() {
  return new X({
    props: {
      decorations: fg,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && H.valid(t) ? new H(t) : null;
      },
      handleClick: ug,
      handleKeyDown: dg,
      handleDOMEvents: { beforeinput: hg }
    }
  });
}
const dg = oo({
  ArrowLeft: or("horiz", -1),
  ArrowRight: or("horiz", 1),
  ArrowUp: or("vert", -1),
  ArrowDown: or("vert", 1)
});
function or(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, s) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof v) {
      if (!s.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = H.findGapCursorFrom(l, e, a);
    return c ? (i && i(r.tr.setSelection(new H(c))), !0) : !1;
  };
}
function ug(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!H.valid(r))
    return !1;
  let i = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return i && i.inside > -1 && T.isSelectable(n.state.doc.nodeAt(i.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new H(r))), !0);
}
function hg(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof H))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = b.empty;
  for (let o = r.length - 1; o >= 0; o--)
    i = b.from(r[o].createAndFill(null, i));
  let s = n.state.tr.replace(t.pos, t.pos, new x(i, 0, 0));
  return s.setSelection(v.near(s.doc.resolve(t.pos + 1))), n.dispatch(s), !1;
}
function fg(n) {
  if (!(n.selection instanceof H))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", z.create(n.doc, [ce.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const pg = pe.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      cg()
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
      allowGapCursor: (e = N(C(n, "allowGapCursor", t))) !== null && e !== void 0 ? e : null
    };
  }
}), mg = Q.create({
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
    return ["br", B(this.options.HTMLAttributes, n)];
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
          const { selection: i, storedMarks: s } = t;
          if (i.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: l } = r.extensionManager, a = s || i.$to.parentOffset && i.$from.marks();
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
}), gg = Q.create({
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
    return [`h${this.options.levels.includes(n.attrs.level) ? n.attrs.level : this.options.levels[0]}`, B(this.options.HTMLAttributes, e), 0];
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
    return this.options.levels.map((n) => Is({
      find: new RegExp(`^(#{1,${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
});
var zr = 200, K = function() {
};
K.prototype.append = function(e) {
  return e.length ? (e = K.from(e), !this.length && e || e.length < zr && this.leafAppend(e) || this.length < zr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
K.prototype.prepend = function(e) {
  return e.length ? K.from(e).append(this) : this;
};
K.prototype.appendInner = function(e) {
  return new yg(this, e);
};
K.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? K.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
K.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
K.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
K.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(s, o) {
    return i.push(e(s, o));
  }, t, r), i;
};
K.from = function(e) {
  return e instanceof K ? e : e && e.length ? new Kc(e) : K.empty;
};
var Kc = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, s) {
    return i == 0 && s == this.length ? this : new e(this.values.slice(i, s));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, s, o, l) {
    for (var a = s; a < o; a++)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, s, o, l) {
    for (var a = s - 1; a >= o; a--)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= zr)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= zr)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(K);
K.empty = new Kc([]);
var yg = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i < l && this.left.forEachInner(r, i, Math.min(s, l), o) === !1 || s > l && this.right.forEachInner(r, Math.max(i - l, 0), Math.min(this.length, s) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i > l && this.right.forEachInvertedInner(r, i - l, Math.max(s, l) - l, o + l) === !1 || s < l && this.left.forEachInvertedInner(r, Math.min(i, l), s, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var s = this.left.length;
    return i <= s ? this.left.slice(r, i) : r >= s ? this.right.slice(r - s, i - s) : this.left.slice(r, s).append(this.right.slice(0, i - s));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(K);
const bg = 500;
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
    let i, s;
    t && (i = this.remapping(r, this.items.length), s = i.maps.length);
    let o = e.tr, l, a, c = [], d = [];
    return this.items.forEach((u, h) => {
      if (!u.step) {
        i || (i = this.remapping(r, h + 1), s = i.maps.length), s--, d.push(u);
        return;
      }
      if (i) {
        d.push(new De(u.map));
        let f = u.step.map(i.slice(s)), p;
        f && o.maybeStep(f).doc && (p = o.mapping.maps[o.mapping.maps.length - 1], c.push(new De(p, void 0, void 0, c.length + d.length))), s--, p && i.appendMap(p, s);
      } else
        o.maybeStep(u.step);
      if (u.selection)
        return l = i ? u.selection.map(i.slice(s)) : u.selection, a = new Me(this.items.slice(0, r).append(d.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, i) {
    let s = [], o = this.eventCount, l = this.items, a = !i && l.length ? l.get(l.length - 1) : null;
    for (let d = 0; d < e.steps.length; d++) {
      let u = e.steps[d].invert(e.docs[d]), h = new De(e.mapping.maps[d], u, t), f;
      (f = a && a.merge(h)) && (h = f, d ? s.pop() : l = l.slice(0, l.length - 1)), s.push(h), t && (o++, t = void 0), i || (a = h);
    }
    let c = o - r.depth;
    return c > wg && (l = kg(l, c), o -= c), new Me(l.append(s), o);
  }
  remapping(e, t) {
    let r = new Yt();
    return this.items.forEach((i, s) => {
      let o = i.mirrorOffset != null && s - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, o);
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
    let r = [], i = Math.max(0, this.items.length - t), s = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, i);
    let a = t;
    this.items.forEach((h) => {
      let f = s.getMirror(--a);
      if (f == null)
        return;
      o = Math.min(o, f);
      let p = s.maps[f];
      if (h.step) {
        let m = e.steps[f].invert(e.docs[f]), g = h.selection && h.selection.map(s.slice(a + 1, f));
        g && l++, r.push(new De(p, m, g));
      } else
        r.push(new De(p));
    }, i);
    let c = [];
    for (let h = t; h < o; h++)
      c.push(new De(s.maps[h]));
    let d = this.items.slice(0, i).append(c).append(r), u = new Me(d, l);
    return u.emptyItemCount() > bg && (u = u.compress(this.items.length - r.length)), u;
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
    let t = this.remapping(0, e), r = t.maps.length, i = [], s = 0;
    return this.items.forEach((o, l) => {
      if (l >= e)
        i.push(o), o.selection && s++;
      else if (o.step) {
        let a = o.step.map(t.slice(r)), c = a && a.getMap();
        if (r--, c && t.appendMap(c, r), a) {
          let d = o.selection && o.selection.map(t.slice(r));
          d && s++;
          let u = new De(c.invert(), a, d), h, f = i.length - 1;
          (h = i.length && i[f].merge(u)) ? i[f] = h : i.push(u);
        }
      } else o.map && r--;
    }, this.items.length, 0), new Me(K.from(i.reverse()), s);
  }
}
Me.empty = new Me(K.empty, 0);
function kg(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class De {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
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
  constructor(e, t, r, i, s) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i, this.prevComposition = s;
  }
}
const wg = 20;
function xg(n, e, t, r) {
  let i = t.getMeta(It), s;
  if (i)
    return i.historyState;
  t.getMeta(Mg) && (n = new tt(n.done, n.undone, null, 0, -1));
  let o = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (o && o.getMeta(It))
    return o.getMeta(It).redo ? new tt(n.done.addTransform(t, void 0, r, br(e)), n.undone, Bl(t.mapping.maps[t.steps.length - 1]), n.prevTime, n.prevComposition) : new tt(n.done, n.undone.addTransform(t, void 0, r, br(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), a = n.prevTime == 0 || !o && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !Cg(t, n.prevRanges)), c = o ? ns(n.prevRanges, t.mapping) : Bl(t.mapping.maps[t.steps.length - 1]);
    return new tt(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, br(e)), Me.empty, c, t.time, l ?? n.prevComposition);
  } else return (s = t.getMeta("rebased")) ? new tt(n.done.rebased(t, s), n.undone.rebased(t, s), ns(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new tt(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), ns(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function Cg(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, i) => {
    for (let s = 0; s < e.length; s += 2)
      r <= e[s + 1] && i >= e[s] && (t = !0);
  }), t;
}
function Bl(n) {
  let e = [];
  return n.forEach((t, r, i, s) => e.push(i, s)), e;
}
function ns(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), s = e.map(n[r + 1], -1);
    i <= s && t.push(i, s);
  }
  return t;
}
function Sg(n, e, t) {
  let r = br(e), i = It.get(e).spec.config, s = (t ? n.undone : n.done).popEvent(e, r);
  if (!s)
    return null;
  let o = s.selection.resolve(s.transform.doc), l = (t ? n.done : n.undone).addTransform(s.transform, e.selection.getBookmark(), i, r), a = new tt(t ? l : s.remaining, t ? s.remaining : l, null, 0, -1);
  return s.transform.setSelection(o).setMeta(It, { redo: t, historyState: a });
}
let rs = !1, $l = null;
function br(n) {
  let e = n.plugins;
  if ($l != e) {
    rs = !1, $l = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        rs = !0;
        break;
      }
  }
  return rs;
}
const It = new ue("history"), Mg = new ue("closeHistory");
function Tg(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new X({
    key: It,
    state: {
      init() {
        return new tt(Me.empty, Me.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return xg(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? qc : r == "historyRedo" ? Uc : null;
          return i ? (t.preventDefault(), i(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
function Jc(n, e) {
  return (t, r) => {
    let i = It.getState(t);
    if (!i || (n ? i.undone : i.done).eventCount == 0)
      return !1;
    if (r) {
      let s = Sg(i, t, n);
      s && r(e ? s.scrollIntoView() : s);
    }
    return !0;
  };
}
const qc = Jc(!1, !0), Uc = Jc(!0, !0), vg = pe.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => qc(n, e),
      redo: () => ({ state: n, dispatch: e }) => Uc(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      Tg(this.options)
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
}), Ag = Q.create({
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
    return ["hr", B(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: n, state: e }) => {
        const { $to: t } = e.selection, r = n();
        return t.parentOffset === 0 ? r.insertContentAt(Math.max(t.pos - 2, 0), { type: this.name }) : r.insertContent({ type: this.name }), r.command(({ tr: i, dispatch: s }) => {
          var o;
          if (s) {
            const { $to: l } = i.selection, a = l.end();
            if (l.nodeAfter)
              l.nodeAfter.isTextblock ? i.setSelection(v.create(i.doc, l.pos + 1)) : l.nodeAfter.isBlock ? i.setSelection(T.create(i.doc, l.pos)) : i.setSelection(v.create(i.doc, l.pos));
            else {
              const c = (o = l.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (i.insert(a, c), i.setSelection(v.create(i.doc, a + 1)));
            }
            i.scrollIntoView();
          }
          return !0;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      Vm({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), Eg = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, Ng = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, Og = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, Rg = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, Dg = Ce.create({
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
    return ["em", B(this.options.HTMLAttributes, n), 0];
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
        find: Eg,
        type: this.type
      }),
      an({
        find: Og,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: Ng,
        type: this.type
      }),
      $t({
        find: Rg,
        type: this.type
      })
    ];
  }
}), Ig = Q.create({
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
    return ["li", B(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Lg = Q.create({
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
    return ["li", B(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), zl = Ce.create({
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
    return ["span", B(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: n, commands: e }) => {
        const t = Oi(n, this.type);
        return Object.entries(t).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), Hl = /^(\d+)\.\s$/, Pg = Q.create({
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
    return e === 1 ? ["ol", B(this.options.HTMLAttributes, t), 0] : ["ol", B(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Lg.name, this.editor.getAttributes(zl.name)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let n = $n({
      find: Hl,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = $n({
      find: Hl,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(zl.name) }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1],
      editor: this.editor
    })), [
      n
    ];
  }
}), Bg = Q.create({
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
    return ["p", B(this.options.HTMLAttributes, n), 0];
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
}), $g = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, zg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, Hg = Ce.create({
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
    return ["s", B(this.options.HTMLAttributes, n), 0];
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
        find: $g,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      $t({
        find: zg,
        type: this.type
      })
    ];
  }
}), Fg = Q.create({
  name: "text",
  group: "inline"
}), Vg = pe.create({
  name: "starterKit",
  addExtensions() {
    var n, e, t, r, i, s, o, l, a, c, d, u, h, f, p, m, g, y;
    const k = [];
    return this.options.blockquote !== !1 && k.push(Wm.configure((n = this.options) === null || n === void 0 ? void 0 : n.blockquote)), this.options.bold !== !1 && k.push(Um.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && k.push(Ym.configure((t = this.options) === null || t === void 0 ? void 0 : t.bulletList)), this.options.code !== !1 && k.push(Zm.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && k.push(ng.configure((i = this.options) === null || i === void 0 ? void 0 : i.codeBlock)), this.options.document !== !1 && k.push(rg.configure((s = this.options) === null || s === void 0 ? void 0 : s.document)), this.options.dropcursor !== !1 && k.push(og.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && k.push(pg.configure((l = this.options) === null || l === void 0 ? void 0 : l.gapcursor)), this.options.hardBreak !== !1 && k.push(mg.configure((a = this.options) === null || a === void 0 ? void 0 : a.hardBreak)), this.options.heading !== !1 && k.push(gg.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && k.push(vg.configure((d = this.options) === null || d === void 0 ? void 0 : d.history)), this.options.horizontalRule !== !1 && k.push(Ag.configure((u = this.options) === null || u === void 0 ? void 0 : u.horizontalRule)), this.options.italic !== !1 && k.push(Dg.configure((h = this.options) === null || h === void 0 ? void 0 : h.italic)), this.options.listItem !== !1 && k.push(Ig.configure((f = this.options) === null || f === void 0 ? void 0 : f.listItem)), this.options.orderedList !== !1 && k.push(Pg.configure((p = this.options) === null || p === void 0 ? void 0 : p.orderedList)), this.options.paragraph !== !1 && k.push(Bg.configure((m = this.options) === null || m === void 0 ? void 0 : m.paragraph)), this.options.strike !== !1 && k.push(Hg.configure((g = this.options) === null || g === void 0 ? void 0 : g.strike)), this.options.text !== !1 && k.push(Fg.configure((y = this.options) === null || y === void 0 ? void 0 : y.text)), k;
  }
}), le = (...n) => n.join(" "), jg = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", Wg = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", cn = (n, e) => {
  for (const t in e)
    n[t] = e[t];
  return n;
}, Ps = "numeric", Bs = "ascii", $s = "alpha", kr = "asciinumeric", lr = "alphanumeric", zs = "domain", Gc = "emoji", _g = "scheme", Kg = "slashscheme", Fl = "whitespace";
function Jg(n, e) {
  return n in e || (e[n] = []), e[n];
}
function vt(n, e, t) {
  e[Ps] && (e[kr] = !0, e[lr] = !0), e[Bs] && (e[kr] = !0, e[$s] = !0), e[kr] && (e[lr] = !0), e[$s] && (e[lr] = !0), e[lr] && (e[zs] = !0), e[Gc] && (e[zs] = !0);
  for (const r in e) {
    const i = Jg(r, t);
    i.indexOf(n) < 0 && i.push(n);
  }
}
function qg(n, e) {
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
      const i = e.jr[r][0], s = e.jr[r][1];
      if (s && i.test(n))
        return s;
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
    for (let i = 0; i < n.length; i++)
      this.tt(n[i], e, t, r);
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
    let i;
    return e && e.j ? i = e : (i = new ae(e), t && r && vt(e, t, r)), this.jr.push([n, i]), i;
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
    let i = this;
    const s = n.length;
    if (!s)
      return i;
    for (let o = 0; o < s - 1; o++)
      i = i.tt(n[o]);
    return i.tt(n[s - 1], e, t, r);
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
    const i = this;
    if (e && e.j)
      return i.j[n] = e, e;
    const s = e;
    let o, l = i.go(n);
    if (l ? (o = new ae(), cn(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new ae(), s) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = cn(qg(o.t, r), t);
          vt(s, a, r);
        } else t && vt(s, t, r);
      o.t = s;
    }
    return i.j[n] = o, o;
  }
};
const O = (n, e, t, r, i) => n.ta(e, t, r, i), ge = (n, e, t, r, i) => n.tr(e, t, r, i), Vl = (n, e, t, r, i) => n.ts(e, t, r, i), w = (n, e, t, r, i) => n.tt(e, t, r, i), Je = "WORD", Hs = "UWORD", zn = "LOCALHOST", Fs = "TLD", Vs = "UTLD", wr = "SCHEME", qt = "SLASH_SCHEME", go = "NUM", Yc = "WS", yo = "NL", Tn = "OPENBRACE", vn = "CLOSEBRACE", Hr = "OPENBRACKET", Fr = "CLOSEBRACKET", Vr = "OPENPAREN", jr = "CLOSEPAREN", Wr = "OPENANGLEBRACKET", _r = "CLOSEANGLEBRACKET", Kr = "FULLWIDTHLEFTPAREN", Jr = "FULLWIDTHRIGHTPAREN", qr = "LEFTCORNERBRACKET", Ur = "RIGHTCORNERBRACKET", Gr = "LEFTWHITECORNERBRACKET", Yr = "RIGHTWHITECORNERBRACKET", Xr = "FULLWIDTHLESSTHAN", Qr = "FULLWIDTHGREATERTHAN", Zr = "AMPERSAND", ei = "APOSTROPHE", ti = "ASTERISK", nt = "AT", ni = "BACKSLASH", ri = "BACKTICK", ii = "CARET", it = "COLON", bo = "COMMA", si = "DOLLAR", Ie = "DOT", oi = "EQUALS", ko = "EXCLAMATION", Le = "HYPHEN", li = "PERCENT", ai = "PIPE", ci = "PLUS", di = "POUND", ui = "QUERY", wo = "QUOTE", xo = "SEMI", Pe = "SLASH", An = "TILDE", hi = "UNDERSCORE", Xc = "EMOJI", fi = "SYM";
var Qc = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: Je,
  UWORD: Hs,
  LOCALHOST: zn,
  TLD: Fs,
  UTLD: Vs,
  SCHEME: wr,
  SLASH_SCHEME: qt,
  NUM: go,
  WS: Yc,
  NL: yo,
  OPENBRACE: Tn,
  CLOSEBRACE: vn,
  OPENBRACKET: Hr,
  CLOSEBRACKET: Fr,
  OPENPAREN: Vr,
  CLOSEPAREN: jr,
  OPENANGLEBRACKET: Wr,
  CLOSEANGLEBRACKET: _r,
  FULLWIDTHLEFTPAREN: Kr,
  FULLWIDTHRIGHTPAREN: Jr,
  LEFTCORNERBRACKET: qr,
  RIGHTCORNERBRACKET: Ur,
  LEFTWHITECORNERBRACKET: Gr,
  RIGHTWHITECORNERBRACKET: Yr,
  FULLWIDTHLESSTHAN: Xr,
  FULLWIDTHGREATERTHAN: Qr,
  AMPERSAND: Zr,
  APOSTROPHE: ei,
  ASTERISK: ti,
  AT: nt,
  BACKSLASH: ni,
  BACKTICK: ri,
  CARET: ii,
  COLON: it,
  COMMA: bo,
  DOLLAR: si,
  DOT: Ie,
  EQUALS: oi,
  EXCLAMATION: ko,
  HYPHEN: Le,
  PERCENT: li,
  PIPE: ai,
  PLUS: ci,
  POUND: di,
  QUERY: ui,
  QUOTE: wo,
  SEMI: xo,
  SLASH: Pe,
  TILDE: An,
  UNDERSCORE: hi,
  EMOJI: Xc,
  SYM: fi
});
const _t = /[a-z]/, is = new RegExp("\\p{L}", "u"), ss = new RegExp("\\p{Emoji}", "u"), ls = /\d/, jl = /\s/, Wl = `
`, Ug = "️", Gg = "‍";
let ar = null, cr = null;
function Yg(n) {
  n === void 0 && (n = []);
  const e = {};
  ae.groups = e;
  const t = new ae();
  ar == null && (ar = _l(jg)), cr == null && (cr = _l(Wg)), w(t, "'", ei), w(t, "{", Tn), w(t, "}", vn), w(t, "[", Hr), w(t, "]", Fr), w(t, "(", Vr), w(t, ")", jr), w(t, "<", Wr), w(t, ">", _r), w(t, "（", Kr), w(t, "）", Jr), w(t, "「", qr), w(t, "」", Ur), w(t, "『", Gr), w(t, "』", Yr), w(t, "＜", Xr), w(t, "＞", Qr), w(t, "&", Zr), w(t, "*", ti), w(t, "@", nt), w(t, "`", ri), w(t, "^", ii), w(t, ":", it), w(t, ",", bo), w(t, "$", si), w(t, ".", Ie), w(t, "=", oi), w(t, "!", ko), w(t, "-", Le), w(t, "%", li), w(t, "|", ai), w(t, "+", ci), w(t, "#", di), w(t, "?", ui), w(t, '"', wo), w(t, "/", Pe), w(t, ";", xo), w(t, "~", An), w(t, "_", hi), w(t, "\\", ni);
  const r = ge(t, ls, go, {
    [Ps]: !0
  });
  ge(r, ls, r);
  const i = ge(t, _t, Je, {
    [Bs]: !0
  });
  ge(i, _t, i);
  const s = ge(t, is, Hs, {
    [$s]: !0
  });
  ge(s, _t), ge(s, is, s);
  const o = ge(t, jl, Yc, {
    [Fl]: !0
  });
  w(t, Wl, yo, {
    [Fl]: !0
  }), w(o, Wl), ge(o, jl, o);
  const l = ge(t, ss, Xc, {
    [Gc]: !0
  });
  ge(l, ss, l), w(l, Ug, l);
  const a = w(l, Gg);
  ge(a, ss, l);
  const c = [[_t, i]], d = [[_t, null], [is, s]];
  for (let u = 0; u < ar.length; u++)
    Qe(t, ar[u], Fs, Je, c);
  for (let u = 0; u < cr.length; u++)
    Qe(t, cr[u], Vs, Hs, d);
  vt(Fs, {
    tld: !0,
    ascii: !0
  }, e), vt(Vs, {
    utld: !0,
    alpha: !0
  }, e), Qe(t, "file", wr, Je, c), Qe(t, "mailto", wr, Je, c), Qe(t, "http", qt, Je, c), Qe(t, "https", qt, Je, c), Qe(t, "ftp", qt, Je, c), Qe(t, "ftps", qt, Je, c), vt(wr, {
    scheme: !0,
    ascii: !0
  }, e), vt(qt, {
    slashscheme: !0,
    ascii: !0
  }, e), n = n.sort((u, h) => u[0] > h[0] ? 1 : -1);
  for (let u = 0; u < n.length; u++) {
    const h = n[u][0], p = n[u][1] ? {
      [_g]: !0
    } : {
      [Kg]: !0
    };
    h.indexOf("-") >= 0 ? p[zs] = !0 : _t.test(h) ? ls.test(h) ? p[kr] = !0 : p[Bs] = !0 : p[Ps] = !0, Vl(t, h, h, p);
  }
  return Vl(t, "localhost", zn, {
    ascii: !0
  }), t.jd = new ae(fi), {
    start: t,
    tokens: cn({
      groups: e
    }, Qc)
  };
}
function Xg(n, e) {
  const t = Qg(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = t.length, i = [];
  let s = 0, o = 0;
  for (; o < r; ) {
    let l = n, a = null, c = 0, d = null, u = -1, h = -1;
    for (; o < r && (a = l.go(t[o])); )
      l = a, l.accepts() ? (u = 0, h = 0, d = l) : u >= 0 && (u += t[o].length, h++), c += t[o].length, s += t[o].length, o++;
    s -= u, o -= h, c -= u, i.push({
      t: d.t,
      // token type/name
      v: e.slice(s - c, s),
      // string value
      s: s - c,
      // start index
      e: s
      // end index (excluding)
    });
  }
  return i;
}
function Qg(n) {
  const e = [], t = n.length;
  let r = 0;
  for (; r < t; ) {
    let i = n.charCodeAt(r), s, o = i < 55296 || i > 56319 || r + 1 === t || (s = n.charCodeAt(r + 1)) < 56320 || s > 57343 ? n[r] : n.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function Qe(n, e, t, r, i) {
  let s;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    n.j[a] ? s = n.j[a] : (s = new ae(r), s.jr = i.slice(), n.j[a] = s), n = s;
  }
  return s = new ae(t), s.jr = i.slice(), n.j[e[o - 1]] = s, s;
}
function _l(n) {
  const e = [], t = [];
  let r = 0, i = "0123456789";
  for (; r < n.length; ) {
    let s = 0;
    for (; i.indexOf(n[r + s]) >= 0; )
      s++;
    if (s > 0) {
      e.push(t.join(""));
      for (let o = parseInt(n.substring(r, r + s), 10); o > 0; o--)
        t.pop();
      r += s;
    } else
      t.push(n[r]), r++;
  }
  return e;
}
const Hn = {
  defaultProtocol: "http",
  events: null,
  format: Kl,
  formatHref: Kl,
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
function Co(n, e) {
  e === void 0 && (e = null);
  let t = cn({}, Hn);
  n && (t = cn(t, n instanceof Co ? n.o : n));
  const r = t.ignoreTags, i = [];
  for (let s = 0; s < r.length; s++)
    i.push(r[s].toUpperCase());
  this.o = t, e && (this.defaultRender = e), this.ignoreTags = i;
}
Co.prototype = {
  o: Hn,
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
    let i = this.o[n];
    return i && (typeof i == "object" ? (i = t.t in i ? i[t.t] : Hn[n], typeof i == "function" && r && (i = i(e, t))) : typeof i == "function" && r && (i = i(e, t.t, t)), i);
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
function Kl(n) {
  return n;
}
function Zc(n, e) {
  this.t = "token", this.v = n, this.tk = e;
}
Zc.prototype = {
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
    return n === void 0 && (n = Hn.defaultProtocol), {
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
    const e = this, t = this.toHref(n.get("defaultProtocol")), r = n.get("formatHref", t, this), i = n.get("tagName", t, e), s = this.toFormattedString(n), o = {}, l = n.get("className", t, e), a = n.get("target", t, e), c = n.get("rel", t, e), d = n.getObj("attributes", t, e), u = n.getObj("events", t, e);
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), d && cn(o, d), {
      tagName: i,
      attributes: o,
      content: s,
      eventListeners: u
    };
  }
};
function Ri(n, e) {
  class t extends Zc {
    constructor(i, s) {
      super(i, s), this.t = n;
    }
  }
  for (const r in e)
    t.prototype[r] = e[r];
  return t.t = n, t;
}
const Jl = Ri("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), ql = Ri("text"), Zg = Ri("nl"), dr = Ri("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(n) {
    return n === void 0 && (n = Hn.defaultProtocol), this.hasProtocol() ? this.v : `${n}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const n = this.tk;
    return n.length >= 2 && n[0].t !== zn && n[1].t === it;
  }
}), ye = (n) => new ae(n);
function e0(n) {
  let {
    groups: e
  } = n;
  const t = e.domain.concat([Zr, ti, nt, ni, ri, ii, si, oi, Le, go, li, ai, ci, di, Pe, fi, An, hi]), r = [ei, it, bo, Ie, ko, ui, wo, xo, Wr, _r, Tn, vn, Fr, Hr, Vr, jr, Kr, Jr, qr, Ur, Gr, Yr, Xr, Qr], i = [Zr, ei, ti, ni, ri, ii, si, oi, Le, Tn, vn, li, ai, ci, di, ui, Pe, fi, An, hi], s = ye(), o = w(s, An);
  O(o, i, o), O(o, e.domain, o);
  const l = ye(), a = ye(), c = ye();
  O(s, e.domain, l), O(s, e.scheme, a), O(s, e.slashscheme, c), O(l, i, o), O(l, e.domain, l);
  const d = w(l, nt);
  w(o, nt, d), w(a, nt, d), w(c, nt, d);
  const u = w(o, Ie);
  O(u, i, o), O(u, e.domain, o);
  const h = ye();
  O(d, e.domain, h), O(h, e.domain, h);
  const f = w(h, Ie);
  O(f, e.domain, h);
  const p = ye(Jl);
  O(f, e.tld, p), O(f, e.utld, p), w(d, zn, p);
  const m = w(h, Le);
  O(m, e.domain, h), O(p, e.domain, h), w(p, Ie, f), w(p, Le, m);
  const g = w(p, it);
  O(g, e.numeric, Jl);
  const y = w(l, Le), k = w(l, Ie);
  O(y, e.domain, l), O(k, i, o), O(k, e.domain, l);
  const S = ye(dr);
  O(k, e.tld, S), O(k, e.utld, S), O(S, e.domain, l), O(S, i, o), w(S, Ie, k), w(S, Le, y), w(S, nt, d);
  const R = w(S, it), E = ye(dr);
  O(R, e.numeric, E);
  const M = ye(dr), I = ye();
  O(M, t, M), O(M, r, I), O(I, t, M), O(I, r, I), w(S, Pe, M), w(E, Pe, M);
  const q = w(a, it), D = w(c, it), Oe = w(D, Pe), Xe = w(Oe, Pe);
  O(a, e.domain, l), w(a, Ie, k), w(a, Le, y), O(c, e.domain, l), w(c, Ie, k), w(c, Le, y), O(q, e.domain, M), w(q, Pe, M), O(Xe, e.domain, M), O(Xe, t, M), w(Xe, Pe, M);
  const Qn = [
    [Tn, vn],
    // {}
    [Hr, Fr],
    // []
    [Vr, jr],
    // ()
    [Wr, _r],
    // <>
    [Kr, Jr],
    // （）
    [qr, Ur],
    // 「」
    [Gr, Yr],
    // 『』
    [Xr, Qr]
    // ＜＞
  ];
  for (let Bi = 0; Bi < Qn.length; Bi++) {
    const [Ao, $i] = Qn[Bi], Zn = w(M, Ao);
    w(I, Ao, Zn), w(Zn, $i, M);
    const Vt = ye(dr);
    O(Zn, t, Vt);
    const mn = ye();
    O(Zn, r), O(Vt, t, Vt), O(Vt, r, mn), O(mn, t, Vt), O(mn, r, mn), w(Vt, $i, M), w(mn, $i, M);
  }
  return w(s, zn, S), w(s, yo, Zg), {
    start: s,
    tokens: Qc
  };
}
function t0(n, e, t) {
  let r = t.length, i = 0, s = [], o = [];
  for (; i < r; ) {
    let l = n, a = null, c = null, d = 0, u = null, h = -1;
    for (; i < r && !(a = l.go(t[i].t)); )
      o.push(t[i++]);
    for (; i < r && (c = a || l.go(t[i].t)); )
      a = null, l = c, l.accepts() ? (h = 0, u = l) : h >= 0 && h++, i++, d++;
    if (h < 0)
      i -= d, i < r && (o.push(t[i]), i++);
    else {
      o.length > 0 && (s.push(as(ql, e, o)), o = []), i -= h, d -= h;
      const f = u.t, p = t.slice(i - d, i);
      s.push(as(f, e, p));
    }
  }
  return o.length > 0 && s.push(as(ql, e, o)), s;
}
function as(n, e, t) {
  const r = t[0].s, i = t[t.length - 1].e, s = e.slice(r, i);
  return new n(s, t);
}
const n0 = typeof console < "u" && console && console.warn || (() => {
}), r0 = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", $ = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function i0() {
  ae.groups = {}, $.scanner = null, $.parser = null, $.tokenQueue = [], $.pluginQueue = [], $.customSchemes = [], $.initialized = !1;
}
function Ul(n, e) {
  if (e === void 0 && (e = !1), $.initialized && n0(`linkifyjs: already initialized - will not register custom scheme "${n}" ${r0}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(n))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  $.customSchemes.push([n, e]);
}
function s0() {
  $.scanner = Yg($.customSchemes);
  for (let n = 0; n < $.tokenQueue.length; n++)
    $.tokenQueue[n][1]({
      scanner: $.scanner
    });
  $.parser = e0($.scanner.tokens);
  for (let n = 0; n < $.pluginQueue.length; n++)
    $.pluginQueue[n][1]({
      scanner: $.scanner,
      parser: $.parser
    });
  $.initialized = !0;
}
function ed(n) {
  return $.initialized || s0(), t0($.parser.start, n, Xg($.scanner.start, n));
}
function td(n, e, t) {
  if (e === void 0 && (e = null), t === void 0 && (t = null), e && typeof e == "object") {
    if (t)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    t = e, e = null;
  }
  const r = new Co(t), i = ed(n), s = [];
  for (let o = 0; o < i.length; o++) {
    const l = i[o];
    l.isLink && (!e || l.t === e) && r.check(l) && s.push(l.toFormattedObject(r));
  }
  return s;
}
function o0(n) {
  return n.length === 1 ? n[0].isLink : n.length === 3 && n[1].isLink ? ["()", "[]"].includes(n[0].value + n[2].value) : !1;
}
function l0(n) {
  return new X({
    key: new ue("autolink"),
    appendTransaction: (e, t, r) => {
      const i = e.some((c) => c.docChanged) && !t.doc.eq(r.doc), s = e.some((c) => c.getMeta("preventAutolink"));
      if (!i || s)
        return;
      const { tr: o } = r, l = nm(t.doc, [...e]);
      if (dm(l).forEach(({ newRange: c }) => {
        const d = im(r.doc, c, (f) => f.isTextblock);
        let u, h;
        if (d.length > 1 ? (u = d[0], h = r.doc.textBetween(u.pos, u.pos + u.node.nodeSize, void 0, " ")) : d.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (u = d[0], h = r.doc.textBetween(u.pos, c.to, void 0, " ")), u && h) {
          const f = h.split(" ").filter((y) => y !== "");
          if (f.length <= 0)
            return !1;
          const p = f[f.length - 1], m = u.pos + h.lastIndexOf(p);
          if (!p)
            return !1;
          const g = ed(p).map((y) => y.toObject());
          if (!o0(g))
            return !1;
          g.filter((y) => y.isLink).map((y) => ({
            ...y,
            from: m + y.start + 1,
            to: m + y.end + 1
          })).filter((y) => r.schema.marks.code ? !r.doc.rangeHasMark(y.from, y.to, r.schema.marks.code) : !0).filter((y) => n.validate ? n.validate(y.value) : !0).forEach((y) => {
            po(y.from, y.to, r.doc).some((k) => k.mark.type === n.type) || o.addMark(y.from, y.to, n.type.create({
              href: y.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function a0(n) {
  return new X({
    key: new ue("handleClickLink"),
    props: {
      handleClick: (e, t, r) => {
        var i, s;
        if (n.whenNotEditable && e.editable || r.button !== 0)
          return !1;
        let o = r.target;
        const l = [];
        for (; o.nodeName !== "DIV"; )
          l.push(o), o = o.parentNode;
        if (!l.find((h) => h.nodeName === "A"))
          return !1;
        const a = _c(e.state, n.type.name), c = r.target, d = (i = c == null ? void 0 : c.href) !== null && i !== void 0 ? i : a.href, u = (s = c == null ? void 0 : c.target) !== null && s !== void 0 ? s : a.target;
        return c && d ? (window.open(d, u), !0) : !1;
      }
    }
  });
}
function c0(n) {
  return new X({
    key: new ue("handlePasteLink"),
    props: {
      handlePaste: (e, t, r) => {
        const { state: i } = e, { selection: s } = i, { empty: o } = s;
        if (o)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = td(l).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : (n.editor.commands.setMark(n.type, {
          href: a.href
        }), !0);
      }
    }
  });
}
const d0 = Ce.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((n) => {
      if (typeof n == "string") {
        Ul(n);
        return;
      }
      Ul(n.scheme, n.optionalSlashes);
    });
  },
  onDestroy() {
    i0();
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
    return !((e = n.href) === null || e === void 0) && e.startsWith("javascript:") ? ["a", B(this.options.HTMLAttributes, { ...n, href: "" }), 0] : ["a", B(this.options.HTMLAttributes, n), 0];
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
            const t = td(n).filter((r) => r.isLink);
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
    return this.options.autolink && n.push(l0({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && n.push(a0({
      type: this.type,
      whenNotEditable: this.options.openOnClick === "whenNotEditable"
    })), this.options.linkOnPaste && n.push(c0({
      editor: this.editor,
      type: this.type
    })), n;
  }
});
var js, Ws;
if (typeof WeakMap < "u") {
  let n = /* @__PURE__ */ new WeakMap();
  js = (e) => n.get(e), Ws = (e, t) => (n.set(e, t), t);
} else {
  const n = [];
  let t = 0;
  js = (r) => {
    for (let i = 0; i < n.length; i += 2)
      if (n[i] == r)
        return n[i + 1];
  }, Ws = (r, i) => (t == 10 && (t = 0), n[t++] = r, n[t++] = i);
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
      const r = e % this.width, i = e / this.width | 0;
      let s = r + 1, o = i + 1;
      for (let l = 1; s < this.width && this.map[e + l] == t; l++)
        s++;
      for (let l = 1; o < this.height && this.map[e + this.width * l] == t; l++)
        o++;
      return { left: r, top: i, right: s, bottom: o };
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
    const { left: r, right: i, top: s, bottom: o } = this.findCell(n);
    return e == "horiz" ? (t < 0 ? r == 0 : i == this.width) ? null : this.map[s * this.width + (t < 0 ? r - 1 : i)] : (t < 0 ? s == 0 : o == this.height) ? null : this.map[r + this.width * (t < 0 ? s - 1 : o)];
  }
  // Get the rectangle spanning the two given cells.
  rectBetween(n, e) {
    const {
      left: t,
      right: r,
      top: i,
      bottom: s
    } = this.findCell(n), {
      left: o,
      right: l,
      top: a,
      bottom: c
    } = this.findCell(e);
    return {
      left: Math.min(t, o),
      top: Math.min(i, a),
      right: Math.max(r, l),
      bottom: Math.max(s, c)
    };
  }
  // Return the position of all cells that have the top left corner in
  // the given rectangle.
  cellsInRect(n) {
    const e = [], t = {};
    for (let r = n.top; r < n.bottom; r++)
      for (let i = n.left; i < n.right; i++) {
        const s = r * this.width + i, o = this.map[s];
        t[o] || (t[o] = !0, !(i == n.left && i && this.map[s - 1] == o || r == n.top && r && this.map[s - this.width] == o) && e.push(o));
      }
    return e;
  }
  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  positionAt(n, e, t) {
    for (let r = 0, i = 0; ; r++) {
      const s = i + t.child(r).nodeSize;
      if (r == n) {
        let o = e + n * this.width;
        const l = (n + 1) * this.width;
        for (; o < l && this.map[o] < i; )
          o++;
        return o == l ? s - 1 : this.map[o];
      }
      i = s;
    }
  }
  // Find the table map for the given table node.
  static get(n) {
    return js(n) || Ws(n, u0(n));
  }
};
function u0(n) {
  if (n.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + n.type.name);
  const e = h0(n), t = n.childCount, r = [];
  let i = 0, s = null;
  const o = [];
  for (let c = 0, d = e * t; c < d; c++)
    r[c] = 0;
  for (let c = 0, d = 0; c < t; c++) {
    const u = n.child(c);
    d++;
    for (let p = 0; ; p++) {
      for (; i < r.length && r[i] != 0; )
        i++;
      if (p == u.childCount)
        break;
      const m = u.child(p), { colspan: g, rowspan: y, colwidth: k } = m.attrs;
      for (let S = 0; S < y; S++) {
        if (S + c >= t) {
          (s || (s = [])).push({
            type: "overlong_rowspan",
            pos: d,
            n: y - S
          });
          break;
        }
        const R = i + S * e;
        for (let E = 0; E < g; E++) {
          r[R + E] == 0 ? r[R + E] = d : (s || (s = [])).push({
            type: "collision",
            row: c,
            pos: d,
            n: g - E
          });
          const M = k && k[E];
          if (M) {
            const I = (R + E) % e * 2, q = o[I];
            q == null || q != M && o[I + 1] == 1 ? (o[I] = M, o[I + 1] = 1) : q == M && o[I + 1]++;
          }
        }
      }
      i += g, d += m.nodeSize;
    }
    const h = (c + 1) * e;
    let f = 0;
    for (; i < h; )
      r[i++] == 0 && f++;
    f && (s || (s = [])).push({ type: "missing", row: c, n: f }), d++;
  }
  const l = new F(e, t, r, s);
  let a = !1;
  for (let c = 0; !a && c < o.length; c += 2)
    o[c] != null && o[c + 1] < t && (a = !0);
  return a && f0(l, o, n), l;
}
function h0(n) {
  let e = -1, t = !1;
  for (let r = 0; r < n.childCount; r++) {
    const i = n.child(r);
    let s = 0;
    if (t)
      for (let o = 0; o < r; o++) {
        const l = n.child(o);
        for (let a = 0; a < l.childCount; a++) {
          const c = l.child(a);
          o + c.attrs.rowspan > r && (s += c.attrs.colspan);
        }
      }
    for (let o = 0; o < i.childCount; o++) {
      const l = i.child(o);
      s += l.attrs.colspan, l.attrs.rowspan > 1 && (t = !0);
    }
    e == -1 ? e = s : e != s && (e = Math.max(e, s));
  }
  return e;
}
function f0(n, e, t) {
  n.problems || (n.problems = []);
  const r = {};
  for (let i = 0; i < n.map.length; i++) {
    const s = n.map[i];
    if (r[s])
      continue;
    r[s] = !0;
    const o = t.nodeAt(s);
    if (!o)
      throw new RangeError(`No cell with offset ${s} found`);
    let l = null;
    const a = o.attrs;
    for (let c = 0; c < a.colspan; c++) {
      const d = (i + c) % n.width, u = e[d * 2];
      u != null && (!a.colwidth || a.colwidth[c] != u) && ((l || (l = p0(a)))[c] = u);
    }
    l && n.problems.unshift({
      type: "colwidth mismatch",
      pos: s,
      colwidth: l
    });
  }
}
function p0(n) {
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
      const r = n.nodes[t], i = r.spec.tableRole;
      i && (e[i] = r);
    }
  }
  return e;
}
var st = new ue("selectingCells");
function fn(n) {
  for (let e = n.depth - 1; e > 0; e--)
    if (n.node(e).type.spec.tableRole == "row")
      return n.node(0).resolve(n.before(e + 1));
  return null;
}
function m0(n) {
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
function Di(n) {
  const e = n.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const t = fn(e.$head) || g0(e.$head);
  if (t)
    return t;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function g0(n) {
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
function _s(n) {
  return n.parent.type.spec.tableRole == "row" && !!n.nodeAfter;
}
function y0(n) {
  return n.node(0).resolve(n.pos + n.nodeAfter.nodeSize);
}
function So(n, e) {
  return n.depth == e.depth && n.pos >= e.start(-1) && n.pos <= e.end(-1);
}
function nd(n, e, t) {
  const r = n.node(-1), i = F.get(r), s = n.start(-1), o = i.nextCell(n.pos - s, e, t);
  return o == null ? null : n.node(0).resolve(s + o);
}
function zt(n, e, t = 1) {
  const r = { ...n, colspan: n.colspan - t };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, t), r.colwidth.some((i) => i > 0) || (r.colwidth = null)), r;
}
function rd(n, e, t = 1) {
  const r = { ...n, colspan: n.colspan + t };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let i = 0; i < t; i++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function b0(n, e, t) {
  const r = ee(e.type.schema).header_cell;
  for (let i = 0; i < n.height; i++)
    if (e.nodeAt(n.map[t + i * n.width]).type != r)
      return !1;
  return !0;
}
var P = class qe extends A {
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  constructor(e, t = e) {
    const r = e.node(-1), i = F.get(r), s = e.start(-1), o = i.rectBetween(
      e.pos - s,
      t.pos - s
    ), l = e.node(0), a = i.cellsInRect(o).filter((d) => d != t.pos - s);
    a.unshift(t.pos - s);
    const c = a.map((d) => {
      const u = r.nodeAt(d);
      if (!u)
        throw RangeError(`No cell with offset ${d} found`);
      const h = s + d + 1;
      return new Ja(
        l.resolve(h),
        l.resolve(h + u.content.size)
      );
    });
    super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = t;
  }
  map(e, t) {
    const r = e.resolve(t.map(this.$anchorCell.pos)), i = e.resolve(t.map(this.$headCell.pos));
    if (_s(r) && _s(i) && So(r, i)) {
      const s = this.$anchorCell.node(-1) != r.node(-1);
      return s && this.isRowSelection() ? qe.rowSelection(r, i) : s && this.isColSelection() ? qe.colSelection(r, i) : new qe(r, i);
    }
    return v.between(r, i);
  }
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  content() {
    const e = this.$anchorCell.node(-1), t = F.get(e), r = this.$anchorCell.start(-1), i = t.rectBetween(
      this.$anchorCell.pos - r,
      this.$headCell.pos - r
    ), s = {}, o = [];
    for (let a = i.top; a < i.bottom; a++) {
      const c = [];
      for (let d = a * t.width + i.left, u = i.left; u < i.right; u++, d++) {
        const h = t.map[d];
        if (s[h])
          continue;
        s[h] = !0;
        const f = t.findCell(h);
        let p = e.nodeAt(h);
        if (!p)
          throw RangeError(`No cell with offset ${h} found`);
        const m = i.left - f.left, g = f.right - i.right;
        if (m > 0 || g > 0) {
          let y = p.attrs;
          if (m > 0 && (y = zt(y, 0, m)), g > 0 && (y = zt(
            y,
            y.colspan - g,
            g
          )), f.left < i.left) {
            if (p = p.type.createAndFill(y), !p)
              throw RangeError(
                `Could not create cell with attrs ${JSON.stringify(y)}`
              );
          } else
            p = p.type.create(y, p.content);
        }
        if (f.top < i.top || f.bottom > i.bottom) {
          const y = {
            ...p.attrs,
            rowspan: Math.min(f.bottom, i.bottom) - Math.max(f.top, i.top)
          };
          f.top < i.top ? p = p.type.createAndFill(y) : p = p.type.create(y, p.content);
        }
        c.push(p);
      }
      o.push(e.child(a).copy(b.from(c)));
    }
    const l = this.isColSelection() && this.isRowSelection() ? e : o;
    return new x(b.from(l), 1, 1);
  }
  replace(e, t = x.empty) {
    const r = e.steps.length, i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      const { $from: l, $to: a } = i[o], c = e.mapping.slice(r);
      e.replace(
        c.map(l.pos),
        c.map(a.pos),
        o ? x.empty : t
      );
    }
    const s = A.findFrom(
      e.doc.resolve(e.mapping.slice(r).map(this.to)),
      -1
    );
    s && e.setSelection(s);
  }
  replaceWith(e, t) {
    this.replace(e, new x(b.from(t), 0, 0));
  }
  forEachCell(e) {
    const t = this.$anchorCell.node(-1), r = F.get(t), i = this.$anchorCell.start(-1), s = r.cellsInRect(
      r.rectBetween(
        this.$anchorCell.pos - i,
        this.$headCell.pos - i
      )
    );
    for (let o = 0; o < s.length; o++)
      e(t.nodeAt(s[o]), i + s[o]);
  }
  // True if this selection goes all the way from the top to the
  // bottom of the table.
  isColSelection() {
    const e = this.$anchorCell.index(-1), t = this.$headCell.index(-1);
    if (Math.min(e, t) > 0)
      return !1;
    const r = e + this.$anchorCell.nodeAfter.attrs.rowspan, i = t + this.$headCell.nodeAfter.attrs.rowspan;
    return Math.max(r, i) == this.$headCell.node(-1).childCount;
  }
  // Returns the smallest column selection that covers the given anchor
  // and head cell.
  static colSelection(e, t = e) {
    const r = e.node(-1), i = F.get(r), s = e.start(-1), o = i.findCell(e.pos - s), l = i.findCell(t.pos - s), a = e.node(0);
    return o.top <= l.top ? (o.top > 0 && (e = a.resolve(s + i.map[o.left])), l.bottom < i.height && (t = a.resolve(
      s + i.map[i.width * (i.height - 1) + l.right - 1]
    ))) : (l.top > 0 && (t = a.resolve(s + i.map[l.left])), o.bottom < i.height && (e = a.resolve(
      s + i.map[i.width * (i.height - 1) + o.right - 1]
    ))), new qe(e, t);
  }
  // True if this selection goes all the way from the left to the
  // right of the table.
  isRowSelection() {
    const e = this.$anchorCell.node(-1), t = F.get(e), r = this.$anchorCell.start(-1), i = t.colCount(this.$anchorCell.pos - r), s = t.colCount(this.$headCell.pos - r);
    if (Math.min(i, s) > 0)
      return !1;
    const o = i + this.$anchorCell.nodeAfter.attrs.colspan, l = s + this.$headCell.nodeAfter.attrs.colspan;
    return Math.max(o, l) == t.width;
  }
  eq(e) {
    return e instanceof qe && e.$anchorCell.pos == this.$anchorCell.pos && e.$headCell.pos == this.$headCell.pos;
  }
  // Returns the smallest row selection that covers the given anchor
  // and head cell.
  static rowSelection(e, t = e) {
    const r = e.node(-1), i = F.get(r), s = e.start(-1), o = i.findCell(e.pos - s), l = i.findCell(t.pos - s), a = e.node(0);
    return o.left <= l.left ? (o.left > 0 && (e = a.resolve(
      s + i.map[o.top * i.width]
    )), l.right < i.width && (t = a.resolve(
      s + i.map[i.width * (l.top + 1) - 1]
    ))) : (l.left > 0 && (t = a.resolve(s + i.map[l.top * i.width])), o.right < i.width && (e = a.resolve(
      s + i.map[i.width * (o.top + 1) - 1]
    ))), new qe(e, t);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(e, t) {
    return new qe(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    return new qe(e.resolve(t), e.resolve(r));
  }
  getBookmark() {
    return new k0(this.$anchorCell.pos, this.$headCell.pos);
  }
};
P.prototype.visible = !1;
A.jsonID("cell", P);
var k0 = class id {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new id(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    const t = e.resolve(this.anchor), r = e.resolve(this.head);
    return t.parent.type.spec.tableRole == "row" && r.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && r.index() < r.parent.childCount && So(t, r) ? new P(t, r) : A.near(r, 1);
  }
};
function w0(n) {
  if (!(n.selection instanceof P))
    return null;
  const e = [];
  return n.selection.forEachCell((t, r) => {
    e.push(
      ce.node(r, r + t.nodeSize, { class: "selectedCell" })
    );
  }), z.create(n.doc, e);
}
function x0({ $from: n, $to: e }) {
  if (n.pos == e.pos || n.pos < n.pos - 6)
    return !1;
  let t = n.pos, r = e.pos, i = n.depth;
  for (; i >= 0 && !(n.after(i + 1) < n.end(i)); i--, t++)
    ;
  for (let s = e.depth; s >= 0 && !(e.before(s + 1) > e.start(s)); s--, r--)
    ;
  return t == r && /row|table/.test(n.node(i).type.spec.tableRole);
}
function C0({ $from: n, $to: e }) {
  let t, r;
  for (let i = n.depth; i > 0; i--) {
    const s = n.node(i);
    if (s.type.spec.tableRole === "cell" || s.type.spec.tableRole === "header_cell") {
      t = s;
      break;
    }
  }
  for (let i = e.depth; i > 0; i--) {
    const s = e.node(i);
    if (s.type.spec.tableRole === "cell" || s.type.spec.tableRole === "header_cell") {
      r = s;
      break;
    }
  }
  return t !== r && e.parentOffset === 0;
}
function S0(n, e, t) {
  const r = (e || n).selection, i = (e || n).doc;
  let s, o;
  if (r instanceof T && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      s = P.create(i, r.from);
    else if (o == "row") {
      const l = i.resolve(r.from + 1);
      s = P.rowSelection(l, l);
    } else if (!t) {
      const l = F.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      s = P.create(i, a + 1, c);
    }
  } else r instanceof v && x0(r) ? s = v.create(i, r.from) : r instanceof v && C0(r) && (s = v.create(i, r.$from.start(), r.$from.end()));
  return s && (e || (e = n.tr)).setSelection(s), e;
}
var M0 = new ue("fix-tables");
function sd(n, e, t, r) {
  const i = n.childCount, s = e.childCount;
  e:
    for (let o = 0, l = 0; o < s; o++) {
      const a = e.child(o);
      for (let c = l, d = Math.min(i, o + 3); c < d; c++)
        if (n.child(c) == a) {
          l = c + 1, t += a.nodeSize;
          continue e;
        }
      r(a, t), l < i && n.child(l).sameMarkup(a) ? sd(n.child(l), a, t + 1, r) : a.nodesBetween(0, a.content.size, r, t + 1), t += a.nodeSize;
    }
}
function od(n, e) {
  let t;
  const r = (i, s) => {
    i.type.spec.tableRole == "table" && (t = T0(n, i, s, t));
  };
  return e ? e.doc != n.doc && sd(e.doc, n.doc, 0, r) : n.doc.descendants(r), t;
}
function T0(n, e, t, r) {
  const i = F.get(e);
  if (!i.problems)
    return r;
  r || (r = n.tr);
  const s = [];
  for (let a = 0; a < i.height; a++)
    s.push(0);
  for (let a = 0; a < i.problems.length; a++) {
    const c = i.problems[a];
    if (c.type == "collision") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      const u = d.attrs;
      for (let h = 0; h < u.rowspan; h++)
        s[c.row + h] += c.n;
      r.setNodeMarkup(
        r.mapping.map(t + 1 + c.pos),
        null,
        zt(u, u.colspan - c.n, c.n)
      );
    } else if (c.type == "missing")
      s[c.row] += c.n;
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
  for (let a = 0; a < s.length; a++)
    s[a] && (o == null && (o = a), l = a);
  for (let a = 0, c = t + 1; a < i.height; a++) {
    const d = e.child(a), u = c + d.nodeSize, h = s[a];
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
  return r.setMeta(M0, { fixTables: !0 });
}
function v0(n) {
  if (!n.size)
    return null;
  let { content: e, openStart: t, openEnd: r } = n;
  for (; e.childCount == 1 && (t > 0 && r > 0 || e.child(0).type.spec.tableRole == "table"); )
    t--, r--, e = e.child(0).content;
  const i = e.child(0), s = i.type.spec.tableRole, o = i.type.schema, l = [];
  if (s == "row")
    for (let a = 0; a < e.childCount; a++) {
      let c = e.child(a).content;
      const d = a ? 0 : Math.max(0, t - 1), u = a < e.childCount - 1 ? 0 : Math.max(0, r - 1);
      (d || u) && (c = Ks(
        ee(o).row,
        new x(c, d, u)
      ).content), l.push(c);
    }
  else if (s == "cell" || s == "header_cell")
    l.push(
      t || r ? Ks(
        ee(o).row,
        new x(e, t, r)
      ).content : e
    );
  else
    return null;
  return A0(o, l);
}
function A0(n, e) {
  const t = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    for (let o = s.childCount - 1; o >= 0; o--) {
      const { rowspan: l, colspan: a } = s.child(o).attrs;
      for (let c = i; c < i + l; c++)
        t[c] = (t[c] || 0) + a;
    }
  }
  let r = 0;
  for (let i = 0; i < t.length; i++)
    r = Math.max(r, t[i]);
  for (let i = 0; i < t.length; i++)
    if (i >= e.length && e.push(b.empty), t[i] < r) {
      const s = ee(n).cell.createAndFill(), o = [];
      for (let l = t[i]; l < r; l++)
        o.push(s);
      e[i] = e[i].append(b.from(o));
    }
  return { height: e.length, width: r, rows: e };
}
function Ks(n, e) {
  const t = n.createAndFill();
  return new Ys(t).replace(0, t.content.size, e).doc;
}
function E0({ width: n, height: e, rows: t }, r, i) {
  if (n != r) {
    const s = [], o = [];
    for (let l = 0; l < t.length; l++) {
      const a = t[l], c = [];
      for (let d = s[l] || 0, u = 0; d < r; u++) {
        let h = a.child(u % a.childCount);
        d + h.attrs.colspan > r && (h = h.type.createChecked(
          zt(
            h.attrs,
            h.attrs.colspan,
            d + h.attrs.colspan - r
          ),
          h.content
        )), c.push(h), d += h.attrs.colspan;
        for (let f = 1; f < h.attrs.rowspan; f++)
          s[l + f] = (s[l + f] || 0) + h.attrs.colspan;
      }
      o.push(b.from(c));
    }
    t = o, n = r;
  }
  if (e != i) {
    const s = [];
    for (let o = 0, l = 0; o < i; o++, l++) {
      const a = [], c = t[l % e];
      for (let d = 0; d < c.childCount; d++) {
        let u = c.child(d);
        o + u.attrs.rowspan > i && (u = u.type.create(
          {
            ...u.attrs,
            rowspan: Math.max(1, i - u.attrs.rowspan)
          },
          u.content
        )), a.push(u);
      }
      s.push(b.from(a));
    }
    t = s, e = i;
  }
  return { width: n, height: e, rows: t };
}
function N0(n, e, t, r, i, s, o) {
  const l = n.doc.type.schema, a = ee(l);
  let c, d;
  if (i > e.width)
    for (let u = 0, h = 0; u < e.height; u++) {
      const f = t.child(u);
      h += f.nodeSize;
      const p = [];
      let m;
      f.lastChild == null || f.lastChild.type == a.cell ? m = c || (c = a.cell.createAndFill()) : m = d || (d = a.header_cell.createAndFill());
      for (let g = e.width; g < i; g++)
        p.push(m);
      n.insert(n.mapping.slice(o).map(h - 1 + r), p);
    }
  if (s > e.height) {
    const u = [];
    for (let p = 0, m = (e.height - 1) * e.width; p < Math.max(e.width, i); p++) {
      const g = p >= e.width ? !1 : t.nodeAt(e.map[m + p]).type == a.header_cell;
      u.push(
        g ? d || (d = a.header_cell.createAndFill()) : c || (c = a.cell.createAndFill())
      );
    }
    const h = a.row.create(null, b.from(u)), f = [];
    for (let p = e.height; p < s; p++)
      f.push(h);
    n.insert(n.mapping.slice(o).map(r + t.nodeSize - 2), f);
  }
  return !!(c || d);
}
function Gl(n, e, t, r, i, s, o, l) {
  if (o == 0 || o == e.height)
    return !1;
  let a = !1;
  for (let c = i; c < s; c++) {
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
function Yl(n, e, t, r, i, s, o, l) {
  if (o == 0 || o == e.width)
    return !1;
  let a = !1;
  for (let c = i; c < s; c++) {
    const d = c * e.width + o, u = e.map[d];
    if (e.map[d - 1] == u) {
      a = !0;
      const h = t.nodeAt(u), f = e.colCount(u), p = n.mapping.slice(l).map(u + r);
      n.setNodeMarkup(
        p,
        null,
        zt(
          h.attrs,
          o - f,
          h.attrs.colspan - (o - f)
        )
      ), n.insert(
        p + h.nodeSize,
        h.type.createAndFill(
          zt(h.attrs, 0, o - f)
        )
      ), c += h.attrs.rowspan - 1;
    }
  }
  return a;
}
function Xl(n, e, t, r, i) {
  let s = t ? n.doc.nodeAt(t - 1) : n.doc;
  if (!s)
    throw new Error("No table found");
  let o = F.get(s);
  const { top: l, left: a } = r, c = a + i.width, d = l + i.height, u = n.tr;
  let h = 0;
  function f() {
    if (s = t ? u.doc.nodeAt(t - 1) : u.doc, !s)
      throw new Error("No table found");
    o = F.get(s), h = u.mapping.maps.length;
  }
  N0(u, o, s, t, c, d, h) && f(), Gl(u, o, s, t, a, c, l, h) && f(), Gl(u, o, s, t, a, c, d, h) && f(), Yl(u, o, s, t, l, d, a, h) && f(), Yl(u, o, s, t, l, d, c, h) && f();
  for (let p = l; p < d; p++) {
    const m = o.positionAt(p, a, s), g = o.positionAt(p, c, s);
    u.replace(
      u.mapping.slice(h).map(m + t),
      u.mapping.slice(h).map(g + t),
      new x(i.rows[p - l], 0, 0)
    );
  }
  f(), u.setSelection(
    new P(
      u.doc.resolve(t + o.positionAt(l, a, s)),
      u.doc.resolve(t + o.positionAt(d - 1, c - 1, s))
    )
  ), e(u);
}
var O0 = oo({
  ArrowLeft: ur("horiz", -1),
  ArrowRight: ur("horiz", 1),
  ArrowUp: ur("vert", -1),
  ArrowDown: ur("vert", 1),
  "Shift-ArrowLeft": hr("horiz", -1),
  "Shift-ArrowRight": hr("horiz", 1),
  "Shift-ArrowUp": hr("vert", -1),
  "Shift-ArrowDown": hr("vert", 1),
  Backspace: fr,
  "Mod-Backspace": fr,
  Delete: fr,
  "Mod-Delete": fr
});
function xr(n, e, t) {
  return t.eq(n.selection) ? !1 : (e && e(n.tr.setSelection(t).scrollIntoView()), !0);
}
function ur(n, e) {
  return (t, r, i) => {
    if (!i)
      return !1;
    const s = t.selection;
    if (s instanceof P)
      return xr(
        t,
        r,
        A.near(s.$headCell, e)
      );
    if (n != "horiz" && !s.empty)
      return !1;
    const o = ld(i, n, e);
    if (o == null)
      return !1;
    if (n == "horiz")
      return xr(
        t,
        r,
        A.near(t.doc.resolve(s.head + e), e)
      );
    {
      const l = t.doc.resolve(o), a = nd(l, n, e);
      let c;
      return a ? c = A.near(a, 1) : e < 0 ? c = A.near(t.doc.resolve(l.before(-1)), -1) : c = A.near(t.doc.resolve(l.after(-1)), 1), xr(t, r, c);
    }
  };
}
function hr(n, e) {
  return (t, r, i) => {
    if (!i)
      return !1;
    const s = t.selection;
    let o;
    if (s instanceof P)
      o = s;
    else {
      const a = ld(i, n, e);
      if (a == null)
        return !1;
      o = new P(t.doc.resolve(a));
    }
    const l = nd(o.$headCell, n, e);
    return l ? xr(
      t,
      r,
      new P(o.$anchorCell, l)
    ) : !1;
  };
}
function fr(n, e) {
  const t = n.selection;
  if (!(t instanceof P))
    return !1;
  if (e) {
    const r = n.tr, i = ee(n.schema).cell.createAndFill().content;
    t.forEachCell((s, o) => {
      s.content.eq(i) || r.replace(
        r.mapping.map(o + 1),
        r.mapping.map(o + s.nodeSize - 1),
        new x(i, 0, 0)
      );
    }), r.docChanged && e(r);
  }
  return !0;
}
function R0(n, e) {
  const t = n.state.doc, r = fn(t.resolve(e));
  return r ? (n.dispatch(n.state.tr.setSelection(new P(r))), !0) : !1;
}
function D0(n, e, t) {
  if (!Ee(n.state))
    return !1;
  let r = v0(t);
  const i = n.state.selection;
  if (i instanceof P) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        b.from(
          Ks(ee(n.state.schema).cell, t)
        )
      ]
    });
    const s = i.$anchorCell.node(-1), o = i.$anchorCell.start(-1), l = F.get(s).rectBetween(
      i.$anchorCell.pos - o,
      i.$headCell.pos - o
    );
    return r = E0(r, l.right - l.left, l.bottom - l.top), Xl(n.state, n.dispatch, o, l, r), !0;
  } else if (r) {
    const s = Di(n.state), o = s.start(-1);
    return Xl(
      n.state,
      n.dispatch,
      o,
      F.get(s.node(-1)).findCell(s.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function I0(n, e) {
  var t;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = Ql(n, e.target);
  let i;
  if (e.shiftKey && n.state.selection instanceof P)
    s(n.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (i = fn(n.state.selection.$anchor)) != null && ((t = cs(n, e)) == null ? void 0 : t.pos) != i.pos)
    s(i, e), e.preventDefault();
  else if (!r)
    return;
  function s(a, c) {
    let d = cs(n, c);
    const u = st.getState(n.state) == null;
    if (!d || !So(a, d))
      if (u)
        d = a;
      else
        return;
    const h = new P(a, d);
    if (u || !n.state.selection.eq(h)) {
      const f = n.state.tr.setSelection(h);
      u && f.setMeta(st, a.pos), n.dispatch(f);
    }
  }
  function o() {
    n.root.removeEventListener("mouseup", o), n.root.removeEventListener("dragstart", o), n.root.removeEventListener("mousemove", l), st.getState(n.state) != null && n.dispatch(n.state.tr.setMeta(st, -1));
  }
  function l(a) {
    const c = a, d = st.getState(n.state);
    let u;
    if (d != null)
      u = n.state.doc.resolve(d);
    else if (Ql(n, c.target) != r && (u = cs(n, e), !u))
      return o();
    u && s(u, c);
  }
  n.root.addEventListener("mouseup", o), n.root.addEventListener("dragstart", o), n.root.addEventListener("mousemove", l);
}
function ld(n, e, t) {
  if (!(n.state.selection instanceof v))
    return null;
  const { $head: r } = n.state.selection;
  for (let i = r.depth - 1; i >= 0; i--) {
    const s = r.node(i);
    if ((t < 0 ? r.index(i) : r.indexAfter(i)) != (t < 0 ? 0 : s.childCount))
      return null;
    if (s.type.spec.tableRole == "cell" || s.type.spec.tableRole == "header_cell") {
      const l = r.before(i), a = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
      return n.endOfTextblock(a) ? l : null;
    }
  }
  return null;
}
function Ql(n, e) {
  for (; e && e != n.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function cs(n, e) {
  const t = n.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return t && t ? fn(n.state.doc.resolve(t.pos)) : null;
}
var L0 = class {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Js(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, Js(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function Js(n, e, t, r, i, s) {
  var o;
  let l = 0, a = !0, c = e.firstChild;
  const d = n.firstChild;
  if (d) {
    for (let u = 0, h = 0; u < d.childCount; u++) {
      const { colspan: f, colwidth: p } = d.child(u).attrs;
      for (let m = 0; m < f; m++, h++) {
        const g = i == h ? s : p && p[m], y = g ? g + "px" : "";
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
var ke = new ue(
  "tableColumnResizing"
);
function P0({
  handleWidth: n = 5,
  cellMinWidth: e = 25,
  View: t = L0,
  lastColumnResizable: r = !0
} = {}) {
  const i = new X({
    key: ke,
    state: {
      init(s, o) {
        return i.spec.props.nodeViews[ee(o.schema).table.name] = (l, a) => new t(l, e, a), new B0(-1, !1);
      },
      apply(s, o) {
        return o.apply(s);
      }
    },
    props: {
      attributes: (s) => {
        const o = ke.getState(s);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (s, o) => {
          $0(
            s,
            o,
            n,
            e,
            r
          );
        },
        mouseleave: (s) => {
          z0(s);
        },
        mousedown: (s, o) => {
          H0(s, o, e);
        }
      },
      decorations: (s) => {
        const o = ke.getState(s);
        if (o && o.activeHandle > -1)
          return K0(s, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return i;
}
var B0 = class Cr {
  constructor(e, t) {
    this.activeHandle = e, this.dragging = t;
  }
  apply(e) {
    const t = this, r = e.getMeta(ke);
    if (r && r.setHandle != null)
      return new Cr(r.setHandle, !1);
    if (r && r.setDragging !== void 0)
      return new Cr(t.activeHandle, r.setDragging);
    if (t.activeHandle > -1 && e.docChanged) {
      let i = e.mapping.map(t.activeHandle, -1);
      return _s(e.doc.resolve(i)) || (i = -1), new Cr(i, t.dragging);
    }
    return t;
  }
};
function $0(n, e, t, r, i) {
  const s = ke.getState(n.state);
  if (s && !s.dragging) {
    const o = V0(e.target);
    let l = -1;
    if (o) {
      const { left: a, right: c } = o.getBoundingClientRect();
      e.clientX - a <= t ? l = Zl(n, e, "left", t) : c - e.clientX <= t && (l = Zl(n, e, "right", t));
    }
    if (l != s.activeHandle) {
      if (!i && l !== -1) {
        const a = n.state.doc.resolve(l), c = a.node(-1), d = F.get(c), u = a.start(-1);
        if (d.colCount(a.pos - u) + a.nodeAfter.attrs.colspan - 1 == d.width - 1)
          return;
      }
      ad(n, l);
    }
  }
}
function z0(n) {
  const e = ke.getState(n.state);
  e && e.activeHandle > -1 && !e.dragging && ad(n, -1);
}
function H0(n, e, t) {
  var r;
  const i = (r = n.dom.ownerDocument.defaultView) != null ? r : window, s = ke.getState(n.state);
  if (!s || s.activeHandle == -1 || s.dragging)
    return !1;
  const o = n.state.doc.nodeAt(s.activeHandle), l = F0(n, s.activeHandle, o.attrs);
  n.dispatch(
    n.state.tr.setMeta(ke, {
      setDragging: { startX: e.clientX, startWidth: l }
    })
  );
  function a(d) {
    i.removeEventListener("mouseup", a), i.removeEventListener("mousemove", c);
    const u = ke.getState(n.state);
    u != null && u.dragging && (j0(
      n,
      u.activeHandle,
      ea(u.dragging, d, t)
    ), n.dispatch(
      n.state.tr.setMeta(ke, { setDragging: null })
    ));
  }
  function c(d) {
    if (!d.which)
      return a(d);
    const u = ke.getState(n.state);
    if (u && u.dragging) {
      const h = ea(u.dragging, d, t);
      W0(n, u.activeHandle, h, t);
    }
  }
  return i.addEventListener("mouseup", a), i.addEventListener("mousemove", c), e.preventDefault(), !0;
}
function F0(n, e, { colspan: t, colwidth: r }) {
  const i = r && r[r.length - 1];
  if (i)
    return i;
  const s = n.domAtPos(e);
  let l = s.node.childNodes[s.offset].offsetWidth, a = t;
  if (r)
    for (let c = 0; c < t; c++)
      r[c] && (l -= r[c], a--);
  return l / a;
}
function V0(n) {
  for (; n && n.nodeName != "TD" && n.nodeName != "TH"; )
    n = n.classList && n.classList.contains("ProseMirror") ? null : n.parentNode;
  return n;
}
function Zl(n, e, t, r) {
  const i = t == "right" ? -r : r, s = n.posAtCoords({
    left: e.clientX + i,
    top: e.clientY
  });
  if (!s)
    return -1;
  const { pos: o } = s, l = fn(n.state.doc.resolve(o));
  if (!l)
    return -1;
  if (t == "right")
    return l.pos;
  const a = F.get(l.node(-1)), c = l.start(-1), d = a.map.indexOf(l.pos - c);
  return d % a.width == 0 ? -1 : c + a.map[d - 1];
}
function ea(n, e, t) {
  const r = e.clientX - n.startX;
  return Math.max(t, n.startWidth + r);
}
function ad(n, e) {
  n.dispatch(
    n.state.tr.setMeta(ke, { setHandle: e })
  );
}
function j0(n, e, t) {
  const r = n.state.doc.resolve(e), i = r.node(-1), s = F.get(i), o = r.start(-1), l = s.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, a = n.state.tr;
  for (let c = 0; c < s.height; c++) {
    const d = c * s.width + l;
    if (c && s.map[d] == s.map[d - s.width])
      continue;
    const u = s.map[d], h = i.nodeAt(u).attrs, f = h.colspan == 1 ? 0 : l - s.colCount(u);
    if (h.colwidth && h.colwidth[f] == t)
      continue;
    const p = h.colwidth ? h.colwidth.slice() : _0(h.colspan);
    p[f] = t, a.setNodeMarkup(o + u, null, { ...h, colwidth: p });
  }
  a.docChanged && n.dispatch(a);
}
function W0(n, e, t, r) {
  const i = n.state.doc.resolve(e), s = i.node(-1), o = i.start(-1), l = F.get(s).colCount(i.pos - o) + i.nodeAfter.attrs.colspan - 1;
  let a = n.domAtPos(i.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; )
    a = a.parentNode;
  a && Js(
    s,
    a.firstChild,
    a,
    r,
    l,
    t
  );
}
function _0(n) {
  return Array(n).fill(0);
}
function K0(n, e) {
  const t = [], r = n.doc.resolve(e), i = r.node(-1);
  if (!i)
    return z.empty;
  const s = F.get(i), o = r.start(-1), l = s.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let a = 0; a < s.height; a++) {
    const c = l + a * s.width - 1;
    if ((l == s.width || s.map[c] != s.map[c + 1]) && (a == 0 || s.map[c] != s.map[c - s.width])) {
      const d = s.map[c], u = o + d + i.nodeAt(d).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", t.push(ce.widget(u, h));
    }
  }
  return z.create(n.doc, t);
}
function _e(n) {
  const e = n.selection, t = Di(n), r = t.node(-1), i = t.start(-1), s = F.get(r);
  return { ...e instanceof P ? s.rectBetween(
    e.$anchorCell.pos - i,
    e.$headCell.pos - i
  ) : s.findCell(t.pos - i), tableStart: i, map: s, table: r };
}
function cd(n, { map: e, tableStart: t, table: r }, i) {
  let s = i > 0 ? -1 : 0;
  b0(e, r, i + s) && (s = i == 0 || i == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const l = o * e.width + i;
    if (i > 0 && i < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      n.setNodeMarkup(
        n.mapping.map(t + a),
        null,
        rd(c.attrs, i - e.colCount(a))
      ), o += c.attrs.rowspan - 1;
    } else {
      const a = s == null ? ee(r.type.schema).cell : r.nodeAt(e.map[l + s]).type, c = e.positionAt(o, i, r);
      n.insert(n.mapping.map(t + c), a.createAndFill());
    }
  }
  return n;
}
function J0(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = _e(n);
    e(cd(n.tr, t, t.left));
  }
  return !0;
}
function q0(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = _e(n);
    e(cd(n.tr, t, t.right));
  }
  return !0;
}
function U0(n, { map: e, table: t, tableStart: r }, i) {
  const s = n.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const l = o * e.width + i, a = e.map[l], c = t.nodeAt(a), d = c.attrs;
    if (i > 0 && e.map[l - 1] == a || i < e.width - 1 && e.map[l + 1] == a)
      n.setNodeMarkup(
        n.mapping.slice(s).map(r + a),
        null,
        zt(d, i - e.colCount(a))
      );
    else {
      const u = n.mapping.slice(s).map(r + a);
      n.delete(u, u + c.nodeSize);
    }
    o += d.rowspan;
  }
}
function G0(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = _e(n), r = n.tr;
    if (t.left == 0 && t.right == t.map.width)
      return !1;
    for (let i = t.right - 1; U0(r, t, i), i != t.left; i--) {
      const s = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!s)
        throw RangeError("No table found");
      t.table = s, t.map = F.get(s);
    }
    e(r);
  }
  return !0;
}
function Y0(n, e, t) {
  var r;
  const i = ee(e.type.schema).header_cell;
  for (let s = 0; s < n.width; s++)
    if (((r = e.nodeAt(n.map[s + t * n.width])) == null ? void 0 : r.type) != i)
      return !1;
  return !0;
}
function dd(n, { map: e, tableStart: t, table: r }, i) {
  var s;
  let o = t;
  for (let c = 0; c < i; c++)
    o += r.child(c).nodeSize;
  const l = [];
  let a = i > 0 ? -1 : 0;
  Y0(e, r, i + a) && (a = i == 0 || i == e.height ? null : 0);
  for (let c = 0, d = e.width * i; c < e.width; c++, d++)
    if (i > 0 && i < e.height && e.map[d] == e.map[d - e.width]) {
      const u = e.map[d], h = r.nodeAt(u).attrs;
      n.setNodeMarkup(t + u, null, {
        ...h,
        rowspan: h.rowspan + 1
      }), c += h.colspan - 1;
    } else {
      const u = a == null ? ee(r.type.schema).cell : (s = r.nodeAt(e.map[d + a * e.width])) == null ? void 0 : s.type, h = u == null ? void 0 : u.createAndFill();
      h && l.push(h);
    }
  return n.insert(o, ee(r.type.schema).row.create(null, l)), n;
}
function X0(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = _e(n);
    e(dd(n.tr, t, t.top));
  }
  return !0;
}
function Q0(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = _e(n);
    e(dd(n.tr, t, t.bottom));
  }
  return !0;
}
function Z0(n, { map: e, table: t, tableStart: r }, i) {
  let s = 0;
  for (let c = 0; c < i; c++)
    s += t.child(c).nodeSize;
  const o = s + t.child(i).nodeSize, l = n.mapping.maps.length;
  n.delete(s + r, o + r);
  const a = /* @__PURE__ */ new Set();
  for (let c = 0, d = i * e.width; c < e.width; c++, d++) {
    const u = e.map[d];
    if (!a.has(u)) {
      if (a.add(u), i > 0 && u == e.map[d - e.width]) {
        const h = t.nodeAt(u).attrs;
        n.setNodeMarkup(n.mapping.slice(l).map(u + r), null, {
          ...h,
          rowspan: h.rowspan - 1
        }), c += h.colspan - 1;
      } else if (i < e.height && u == e.map[d + e.width]) {
        const h = t.nodeAt(u), f = h.attrs, p = h.type.create(
          { ...f, rowspan: h.attrs.rowspan - 1 },
          h.content
        ), m = e.positionAt(i + 1, c, t);
        n.insert(n.mapping.slice(l).map(r + m), p), c += f.colspan - 1;
      }
    }
  }
}
function ey(n, e) {
  if (!Ee(n))
    return !1;
  if (e) {
    const t = _e(n), r = n.tr;
    if (t.top == 0 && t.bottom == t.map.height)
      return !1;
    for (let i = t.bottom - 1; Z0(r, t, i), i != t.top; i--) {
      const s = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!s)
        throw RangeError("No table found");
      t.table = s, t.map = F.get(t.table);
    }
    e(r);
  }
  return !0;
}
function ta(n) {
  const e = n.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function ty({ width: n, height: e, map: t }, r) {
  let i = r.top * n + r.left, s = i, o = (r.bottom - 1) * n + r.left, l = i + (r.right - r.left - 1);
  for (let a = r.top; a < r.bottom; a++) {
    if (r.left > 0 && t[s] == t[s - 1] || r.right < n && t[l] == t[l + 1])
      return !0;
    s += n, l += n;
  }
  for (let a = r.left; a < r.right; a++) {
    if (r.top > 0 && t[i] == t[i - n] || r.bottom < e && t[o] == t[o + n])
      return !0;
    i++, o++;
  }
  return !1;
}
function na(n, e) {
  const t = n.selection;
  if (!(t instanceof P) || t.$anchorCell.pos == t.$headCell.pos)
    return !1;
  const r = _e(n), { map: i } = r;
  if (ty(i, r))
    return !1;
  if (e) {
    const s = n.tr, o = {};
    let l = b.empty, a, c;
    for (let d = r.top; d < r.bottom; d++)
      for (let u = r.left; u < r.right; u++) {
        const h = i.map[d * i.width + u], f = r.table.nodeAt(h);
        if (!(o[h] || !f))
          if (o[h] = !0, a == null)
            a = h, c = f;
          else {
            ta(f) || (l = l.append(f.content));
            const p = s.mapping.map(h + r.tableStart);
            s.delete(p, p + f.nodeSize);
          }
      }
    if (a == null || c == null)
      return !0;
    if (s.setNodeMarkup(a + r.tableStart, null, {
      ...rd(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), l.size) {
      const d = a + 1 + c.content.size, u = ta(c) ? a + 1 : d;
      s.replaceWith(u + r.tableStart, d + r.tableStart, l);
    }
    s.setSelection(
      new P(s.doc.resolve(a + r.tableStart))
    ), e(s);
  }
  return !0;
}
function ra(n, e) {
  const t = ee(n.schema);
  return ny(({ node: r }) => t[r.type.spec.tableRole])(n, e);
}
function ny(n) {
  return (e, t) => {
    var r;
    const i = e.selection;
    let s, o;
    if (i instanceof P) {
      if (i.$anchorCell.pos != i.$headCell.pos)
        return !1;
      s = i.$anchorCell.nodeAfter, o = i.$anchorCell.pos;
    } else {
      if (s = m0(i.$from), !s)
        return !1;
      o = (r = fn(i.$from)) == null ? void 0 : r.pos;
    }
    if (s == null || o == null || s.attrs.colspan == 1 && s.attrs.rowspan == 1)
      return !1;
    if (t) {
      let l = s.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = { ...l, rowspan: 1 }), l.colspan > 1 && (l = { ...l, colspan: 1 });
      const d = _e(e), u = e.tr;
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
        f == d.top && (p += s.nodeSize);
        for (let m = d.left, g = 0; m < d.right; m++, g++)
          m == d.left && f == d.top || u.insert(
            h = u.mapping.map(p + d.tableStart, 1),
            n({ node: s, row: f, col: m }).createAndFill(a[g])
          );
      }
      u.setNodeMarkup(
        o,
        n({ node: s, row: d.top, col: d.left }),
        a[0]
      ), i instanceof P && u.setSelection(
        new P(
          u.doc.resolve(i.$anchorCell.pos),
          h ? u.doc.resolve(h) : void 0
        )
      ), t(u);
    }
    return !0;
  };
}
function ry(n, e) {
  return function(t, r) {
    if (!Ee(t))
      return !1;
    const i = Di(t);
    if (i.nodeAfter.attrs[n] === e)
      return !1;
    if (r) {
      const s = t.tr;
      t.selection instanceof P ? t.selection.forEachCell((o, l) => {
        o.attrs[n] !== e && s.setNodeMarkup(l, null, {
          ...o.attrs,
          [n]: e
        });
      }) : s.setNodeMarkup(i.pos, null, {
        ...i.nodeAfter.attrs,
        [n]: e
      }), r(s);
    }
    return !0;
  };
}
function iy(n) {
  return function(e, t) {
    if (!Ee(e))
      return !1;
    if (t) {
      const r = ee(e.schema), i = _e(e), s = e.tr, o = i.map.cellsInRect(
        n == "column" ? {
          left: i.left,
          top: 0,
          right: i.right,
          bottom: i.map.height
        } : n == "row" ? {
          left: 0,
          top: i.top,
          right: i.map.width,
          bottom: i.bottom
        } : i
      ), l = o.map((a) => i.table.nodeAt(a));
      for (let a = 0; a < o.length; a++)
        l[a].type == r.header_cell && s.setNodeMarkup(
          i.tableStart + o[a],
          r.cell,
          l[a].attrs
        );
      if (s.steps.length == 0)
        for (let a = 0; a < o.length; a++)
          s.setNodeMarkup(
            i.tableStart + o[a],
            r.header_cell,
            l[a].attrs
          );
      t(s);
    }
    return !0;
  };
}
function ia(n, e, t) {
  const r = e.map.cellsInRect({
    left: 0,
    top: 0,
    right: n == "row" ? e.map.width : 1,
    bottom: n == "column" ? e.map.height : 1
  });
  for (let i = 0; i < r.length; i++) {
    const s = e.table.nodeAt(r[i]);
    if (s && s.type !== t.header_cell)
      return !1;
  }
  return !0;
}
function Fn(n, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? iy(n) : function(t, r) {
    if (!Ee(t))
      return !1;
    if (r) {
      const i = ee(t.schema), s = _e(t), o = t.tr, l = ia("row", s, i), a = ia(
        "column",
        s,
        i
      ), d = (n === "column" ? l : n === "row" ? a : !1) ? 1 : 0, u = n == "column" ? {
        left: 0,
        top: d,
        right: 1,
        bottom: s.map.height
      } : n == "row" ? {
        left: d,
        top: 0,
        right: s.map.width,
        bottom: 1
      } : s, h = n == "column" ? a ? i.cell : i.header_cell : n == "row" ? l ? i.cell : i.header_cell : i.cell;
      s.map.cellsInRect(u).forEach((f) => {
        const p = f + s.tableStart, m = o.doc.nodeAt(p);
        m && o.setNodeMarkup(p, h, m.attrs);
      }), r(o);
    }
    return !0;
  };
}
Fn("row", {
  useDeprecatedLogic: !0
});
Fn("column", {
  useDeprecatedLogic: !0
});
var sy = Fn("cell", {
  useDeprecatedLogic: !0
});
function oy(n, e) {
  if (e < 0) {
    const t = n.nodeBefore;
    if (t)
      return n.pos - t.nodeSize;
    for (let r = n.index(-1) - 1, i = n.before(); r >= 0; r--) {
      const s = n.node(-1).child(r), o = s.lastChild;
      if (o)
        return i - 1 - o.nodeSize;
      i -= s.nodeSize;
    }
  } else {
    if (n.index() < n.parent.childCount - 1)
      return n.pos + n.nodeAfter.nodeSize;
    const t = n.node(-1);
    for (let r = n.indexAfter(-1), i = n.after(); r < t.childCount; r++) {
      const s = t.child(r);
      if (s.childCount)
        return i + 1;
      i += s.nodeSize;
    }
  }
  return null;
}
function sa(n) {
  return function(e, t) {
    if (!Ee(e))
      return !1;
    const r = oy(Di(e), n);
    if (r == null)
      return !1;
    if (t) {
      const i = e.doc.resolve(r);
      t(
        e.tr.setSelection(v.between(i, y0(i))).scrollIntoView()
      );
    }
    return !0;
  };
}
function ly(n, e) {
  const t = n.selection.$anchor;
  for (let r = t.depth; r > 0; r--)
    if (t.node(r).type.spec.tableRole == "table")
      return e && e(
        n.tr.delete(t.before(r), t.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function ay({
  allowTableNodeSelection: n = !1
} = {}) {
  return new X({
    key: st,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, t) {
        const r = e.getMeta(st);
        if (r != null)
          return r == -1 ? null : r;
        if (t == null || !e.docChanged)
          return t;
        const { deleted: i, pos: s } = e.mapping.mapResult(t);
        return i ? null : s;
      }
    },
    props: {
      decorations: w0,
      handleDOMEvents: {
        mousedown: I0
      },
      createSelectionBetween(e) {
        return st.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: R0,
      handleKeyDown: O0,
      handlePaste: D0
    },
    appendTransaction(e, t, r) {
      return S0(
        r,
        od(r, t),
        n
      );
    }
  });
}
function oa(n, e, t, r, i, s) {
  let o = 0, l = !0, a = e.firstChild;
  const c = n.firstChild;
  for (let d = 0, u = 0; d < c.childCount; d += 1) {
    const { colspan: h, colwidth: f } = c.child(d).attrs;
    for (let p = 0; p < h; p += 1, u += 1) {
      const m = i === u ? s : f && f[p], g = m ? `${m}px` : "";
      o += m || r, m || (l = !1), a ? (a.style.width !== g && (a.style.width = g), a = a.nextSibling) : e.appendChild(document.createElement("col")).style.width = g;
    }
  }
  for (; a; ) {
    const d = a.nextSibling;
    a.parentNode.removeChild(a), a = d;
  }
  l ? (t.style.width = `${o}px`, t.style.minWidth = "") : (t.style.width = "", t.style.minWidth = `${o}px`);
}
class cy {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), oa(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, oa(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function dy(n, e, t, r) {
  let i = 0, s = !0;
  const o = [], l = n.firstChild;
  if (!l)
    return {};
  for (let u = 0, h = 0; u < l.childCount; u += 1) {
    const { colspan: f, colwidth: p } = l.child(u).attrs;
    for (let m = 0; m < f; m += 1, h += 1) {
      const g = t === h ? r : p && p[m], y = g ? `${g}px` : "";
      i += g || e, g || (s = !1), o.push(["col", y ? { style: `width: ${y}` } : {}]);
    }
  }
  const a = s ? `${i}px` : "", c = s ? "" : `${i}px`;
  return { colgroup: ["colgroup", {}, ...o], tableWidth: a, tableMinWidth: c };
}
function la(n, e) {
  return n.createAndFill();
}
function uy(n) {
  if (n.cached.tableNodeTypes)
    return n.cached.tableNodeTypes;
  const e = {};
  return Object.keys(n.nodes).forEach((t) => {
    const r = n.nodes[t];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), n.cached.tableNodeTypes = e, e;
}
function hy(n, e, t, r, i) {
  const s = uy(n), o = [], l = [];
  for (let c = 0; c < t; c += 1) {
    const d = la(s.cell);
    if (d && l.push(d), r) {
      const u = la(s.header_cell);
      u && o.push(u);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(s.row.createChecked(null, r && c === 0 ? o : l));
  return s.table.createChecked(null, a);
}
function fy(n) {
  return n instanceof P;
}
const pr = ({ editor: n }) => {
  const { selection: e } = n.state;
  if (!fy(e))
    return !1;
  let t = 0;
  const r = Wc(e.ranges[0].$from, (s) => s.type.name === "table");
  return r == null || r.node.descendants((s) => {
    if (s.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(s.type.name) && (t += 1);
  }), t === e.ranges.length ? (n.commands.deleteTable(), !0) : !1;
}, py = Q.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: cy,
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
    const { colgroup: t, tableWidth: r, tableMinWidth: i } = dy(n, this.options.cellMinWidth);
    return [
      "table",
      B(this.options.HTMLAttributes, e, {
        style: r ? `width: ${r}` : `minWidth: ${i}`
      }),
      t,
      ["tbody", 0]
    ];
  },
  addCommands() {
    return {
      insertTable: ({ rows: n = 3, cols: e = 3, withHeaderRow: t = !0 } = {}) => ({ tr: r, dispatch: i, editor: s }) => {
        const o = hy(s.schema, n, e, t);
        if (i) {
          const l = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(v.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: n, dispatch: e }) => J0(n, e),
      addColumnAfter: () => ({ state: n, dispatch: e }) => q0(n, e),
      deleteColumn: () => ({ state: n, dispatch: e }) => G0(n, e),
      addRowBefore: () => ({ state: n, dispatch: e }) => X0(n, e),
      addRowAfter: () => ({ state: n, dispatch: e }) => Q0(n, e),
      deleteRow: () => ({ state: n, dispatch: e }) => ey(n, e),
      deleteTable: () => ({ state: n, dispatch: e }) => ly(n, e),
      mergeCells: () => ({ state: n, dispatch: e }) => na(n, e),
      splitCell: () => ({ state: n, dispatch: e }) => ra(n, e),
      toggleHeaderColumn: () => ({ state: n, dispatch: e }) => Fn("column")(n, e),
      toggleHeaderRow: () => ({ state: n, dispatch: e }) => Fn("row")(n, e),
      toggleHeaderCell: () => ({ state: n, dispatch: e }) => sy(n, e),
      mergeOrSplit: () => ({ state: n, dispatch: e }) => na(n, e) ? !0 : ra(n, e),
      setCellAttribute: (n, e) => ({ state: t, dispatch: r }) => ry(n, e)(t, r),
      goToNextCell: () => ({ state: n, dispatch: e }) => sa(1)(n, e),
      goToPreviousCell: () => ({ state: n, dispatch: e }) => sa(-1)(n, e),
      fixTables: () => ({ state: n, dispatch: e }) => (e && od(n), !0),
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
      Backspace: pr,
      "Mod-Backspace": pr,
      Delete: pr,
      "Mod-Delete": pr
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        P0({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      ay({
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
      tableRole: N(C(n, "tableRole", e))
    };
  }
}), my = Q.create({
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
    return ["th", B(this.options.HTMLAttributes, n), 0];
  }
}), gy = Q.create({
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
    return ["tr", B(this.options.HTMLAttributes, n), 0];
  }
}), yy = Q.create({
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
    return ["td", B(this.options.HTMLAttributes, n), 0];
  }
}), by = Ce.create({
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
    return ["u", B(this.options.HTMLAttributes, n), 0];
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
        Vg,
        d0.configure({
          openOnClick: !1
        }),
        py.configure({
          resizable: !0,
          handleWidth: 10,
          lastColumnResizable: !0
        }),
        my,
        gy,
        yy,
        by
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
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const En = globalThis, pi = En.trustedTypes, aa = pi ? pi.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ud = "$lit$", ot = `lit$${Math.random().toFixed(9).slice(2)}$`, hd = "?" + ot, ky = `<${hd}>`, Ht = document, Vn = () => Ht.createComment(""), jn = (n) => n === null || typeof n != "object" && typeof n != "function", fd = Array.isArray, wy = (n) => fd(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", ds = `[ 	
\f\r]`, yn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ca = /-->/g, da = />/g, wt = RegExp(`>|${ds}(?:([^\\s"'>=/]+)(${ds}*=${ds}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ua = /'/g, ha = /"/g, pd = /^(?:script|style|textarea|title)$/i, xy = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), we = xy(1), Wn = Symbol.for("lit-noChange"), V = Symbol.for("lit-nothing"), fa = /* @__PURE__ */ new WeakMap(), At = Ht.createTreeWalker(Ht, 129);
function md(n, e) {
  if (!Array.isArray(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return aa !== void 0 ? aa.createHTML(e) : e;
}
const Cy = (n, e) => {
  const t = n.length - 1, r = [];
  let i, s = e === 2 ? "<svg>" : "", o = yn;
  for (let l = 0; l < t; l++) {
    const a = n[l];
    let c, d, u = -1, h = 0;
    for (; h < a.length && (o.lastIndex = h, d = o.exec(a), d !== null); ) h = o.lastIndex, o === yn ? d[1] === "!--" ? o = ca : d[1] !== void 0 ? o = da : d[2] !== void 0 ? (pd.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = wt) : d[3] !== void 0 && (o = wt) : o === wt ? d[0] === ">" ? (o = i ?? yn, u = -1) : d[1] === void 0 ? u = -2 : (u = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? wt : d[3] === '"' ? ha : ua) : o === ha || o === ua ? o = wt : o === ca || o === da ? o = yn : (o = wt, i = void 0);
    const f = o === wt && n[l + 1].startsWith("/>") ? " " : "";
    s += o === yn ? a + ky : u >= 0 ? (r.push(c), a.slice(0, u) + ud + a.slice(u) + ot + f) : a + ot + (u === -2 ? l : f);
  }
  return [md(n, s + (n[t] || "<?>") + (e === 2 ? "</svg>" : "")), r];
};
class _n {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let s = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, d] = Cy(e, t);
    if (this.el = _n.createElement(c, r), At.currentNode = this.el.content, t === 2) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = At.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(ud)) {
          const h = d[o++], f = i.getAttribute(u).split(ot), p = /([.?@])?(.*)/.exec(h);
          a.push({ type: 1, index: s, name: p[2], strings: f, ctor: p[1] === "." ? My : p[1] === "?" ? Ty : p[1] === "@" ? vy : Ii }), i.removeAttribute(u);
        } else u.startsWith(ot) && (a.push({ type: 6, index: s }), i.removeAttribute(u));
        if (pd.test(i.tagName)) {
          const u = i.textContent.split(ot), h = u.length - 1;
          if (h > 0) {
            i.textContent = pi ? pi.emptyScript : "";
            for (let f = 0; f < h; f++) i.append(u[f], Vn()), At.nextNode(), a.push({ type: 2, index: ++s });
            i.append(u[h], Vn());
          }
        }
      } else if (i.nodeType === 8) if (i.data === hd) a.push({ type: 2, index: s });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(ot, u + 1)) !== -1; ) a.push({ type: 7, index: s }), u += ot.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const r = Ht.createElement("template");
    return r.innerHTML = e, r;
  }
}
function dn(n, e, t = n, r) {
  var o, l;
  if (e === Wn) return e;
  let i = r !== void 0 ? (o = t._$Co) == null ? void 0 : o[r] : t._$Cl;
  const s = jn(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = i : t._$Cl = i), i !== void 0 && (e = dn(n, i._$AS(n, e.values), i, r)), e;
}
class Sy {
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
    const { el: { content: t }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? Ht).importNode(t, !0);
    At.currentNode = i;
    let s = At.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new Yn(s, s.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (c = new Ay(s, this, e)), this._$AV.push(c), a = r[++l];
      }
      o !== (a == null ? void 0 : a.index) && (s = At.nextNode(), o++);
    }
    return At.currentNode = Ht, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class Yn {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = dn(this, e, t), jn(e) ? e === V || e == null || e === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : e !== this._$AH && e !== Wn && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : wy(e) ? this.k(e) : this._(e);
  }
  S(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.S(e));
  }
  _(e) {
    this._$AH !== V && jn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ht.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = _n.createElement(md(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(t);
    else {
      const o = new Sy(i, this), l = o.u(this.options);
      o.p(t), this.T(l), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = fa.get(e.strings);
    return t === void 0 && fa.set(e.strings, t = new _n(e)), t;
  }
  k(e) {
    fd(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const s of e) i === t.length ? t.push(r = new Yn(this.S(Vn()), this.S(Vn()), this, this.options)) : r = t[i], r._$AI(s), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Ii {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, s) {
    this.type = 1, this._$AH = V, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = V;
  }
  _$AI(e, t = this, r, i) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = dn(this, e, t, 0), o = !jn(e) || e !== this._$AH && e !== Wn, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = s[0], a = 0; a < s.length - 1; a++) c = dn(this, l[r + a], t, a), c === Wn && (c = this._$AH[a]), o || (o = !jn(c) || c !== this._$AH[a]), c === V ? e = V : e !== V && (e += (c ?? "") + s[a + 1]), this._$AH[a] = c;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class My extends Ii {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === V ? void 0 : e;
  }
}
class Ty extends Ii {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== V);
  }
}
class vy extends Ii {
  constructor(e, t, r, i, s) {
    super(e, t, r, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = dn(this, e, t, 0) ?? V) === Wn) return;
    const r = this._$AH, i = e === V && r !== V || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== V && (r === V || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ay {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    dn(this, e);
  }
}
const us = En.litHtmlPolyfillSupport;
us == null || us(_n, Yn), (En.litHtmlVersions ?? (En.litHtmlVersions = [])).push("3.1.4");
const Sr = (n, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = i = new Yn(e.insertBefore(Vn(), s), s, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
class Ne extends HTMLElement {
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
class gd extends Ne {
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
        icon: we`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
      },
      {
        title: "H3",
        icon: we`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
      },
      {
        title: "H4",
        icon: we`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-4"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 4 }).run();
        }
      },
      {
        title: "H5",
        icon: we`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-5"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 13v-3h4"/><path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 5 }).run();
        }
      },
      {
        title: "H6",
        icon: we`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-6"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></svg>`,
        action: () => {
          this.editor.chain().focus().toggleHeading({ level: 6 }).run();
        }
      }
    ];
  }
}
customElements.define("pd-button-heading", gd);
class yd extends Ne {
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
customElements.define("pd-button-bold", yd);
class bd extends Ne {
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
customElements.define("pd-button-italic", bd);
class kd extends Ne {
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
customElements.define("pd-button-strike", kd);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ey = (n) => n.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ny = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Oy = (n) => (...e) => ({ _$litDirective$: n, values: e });
class Ry {
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
const Nn = (n, e) => {
  var r;
  const t = n._$AN;
  if (t === void 0) return !1;
  for (const i of t) (r = i._$AO) == null || r.call(i, e, !1), Nn(i, e);
  return !0;
}, mi = (n) => {
  let e, t;
  do {
    if ((e = n._$AM) === void 0) break;
    t = e._$AN, t.delete(n), n = e;
  } while ((t == null ? void 0 : t.size) === 0);
}, wd = (n) => {
  for (let e; e = n._$AM; n = e) {
    let t = e._$AN;
    if (t === void 0) e._$AN = t = /* @__PURE__ */ new Set();
    else if (t.has(n)) break;
    t.add(n), Ly(e);
  }
};
function Dy(n) {
  this._$AN !== void 0 ? (mi(this), this._$AM = n, wd(this)) : this._$AM = n;
}
function Iy(n, e = !1, t = 0) {
  const r = this._$AH, i = this._$AN;
  if (i !== void 0 && i.size !== 0) if (e) if (Array.isArray(r)) for (let s = t; s < r.length; s++) Nn(r[s], !1), mi(r[s]);
  else r != null && (Nn(r, !1), mi(r));
  else Nn(this, n);
}
const Ly = (n) => {
  n.type == Ny.CHILD && (n._$AP ?? (n._$AP = Iy), n._$AQ ?? (n._$AQ = Dy));
};
class Py extends Ry {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, t, r) {
    super._$AT(e, t, r), wd(this), this.isConnected = e._$AU;
  }
  _$AO(e, t = !0) {
    var r, i;
    e !== this.isConnected && (this.isConnected = e, e ? (r = this.reconnected) == null || r.call(this) : (i = this.disconnected) == null || i.call(this)), t && (Nn(this, e), mi(this));
  }
  setValue(e) {
    if (Ey(this._$Ct)) this._$Ct._$AI(e, this);
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
const By = () => new $y();
class $y {
}
const hs = /* @__PURE__ */ new WeakMap(), zy = Oy(class extends Py {
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
      let t = hs.get(e);
      t === void 0 && (t = /* @__PURE__ */ new WeakMap(), hs.set(e, t)), t.get(this.Y) !== void 0 && this.Y.call(this.ht, void 0), t.set(this.Y, n), n !== void 0 && this.Y.call(this.ht, n);
    } else this.Y.value = n;
  }
  get lt() {
    var n, e;
    return typeof this.Y == "function" ? (n = hs.get(this.ht ?? globalThis)) == null ? void 0 : n.get(this.Y) : (e = this.Y) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
class xd extends Ne {
  constructor(t, r, i) {
    super(t, r, i);
    Re(this, "formRef", By());
    this.modal.addEventListener("hide", () => {
      var s;
      return (s = this.formRef.value) == null ? void 0 : s.reset();
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
    const r = new FormData(t.target), i = r.get("text"), s = r.get("url");
    this.editor.chain().focus().setLink({ href: s }).insertContent(i.trim()).focus().run(), this.modal.hide();
  }
  unsetLink() {
    this.editor.chain().focus().unsetLink().run();
  }
  getTemplate() {
    return we`
            <form @submit=${(t) => this.setLink(t)} ${zy(this.formRef)}>
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
    var r, i;
    const t = (r = document.getSelection().anchorNode) == null ? void 0 : r.parentElement;
    if (!t)
      return this.dropdown.hide();
    if (((i = t.closest("a")) == null ? void 0 : i.tagName) !== "A")
      return this.dropdown.hide();
    this.dropdown.renderHTML(we`
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
    const { view: t, state: r } = this.editor, { from: i, to: s } = t.state.selection;
    return r.doc.textBetween(i, s, "");
  }
  get urlValue() {
    return this.isActive() ? this.editor.getAttributes("link").href : "";
  }
}
customElements.define("pd-button-link", xd);
class Cd extends Ne {
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
customElements.define("pd-button-ordered-list", Cd);
class Sd extends Ne {
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
customElements.define("pd-button-bullet-list", Sd);
class Md extends Ne {
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
    const { top: r, left: i, width: s } = t.getBoundingClientRect();
    this.button.classList.replace("hidden", "block"), this.button.style.top = `${r + 3}px`, this.button.style.left = `${s + i - 38}px`, window.addEventListener("resize", () => {
      const { top: l, left: a, width: c } = t.getBoundingClientRect();
      this.button.style.top = `${l + 3}px`, this.button.style.left = `${c + a - 38}px`;
    });
  }
  showDropdown() {
    this.dropdown.renderHTML(we`
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
customElements.define("pd-button-table", Md);
class Td extends Ne {
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
customElements.define("pd-button-underline", Td);
class vd extends HTMLElement {
  constructor() {
    super(...arguments);
    Re(this, "buttons", {
      heading: gd,
      bold: yd,
      italic: bd,
      underline: Td,
      strikethrough: kd,
      link: xd,
      "ordered-list": Cd,
      "bullet-list": Sd,
      table: Md
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
customElements.define("pd-editor-toolbar", vd);
const qs = Math.min, en = Math.max, gi = Math.round, mr = Math.floor, mt = (n) => ({
  x: n,
  y: n
});
function Ad(n) {
  return n.split("-")[0];
}
function Hy(n) {
  return n.split("-")[1];
}
function Fy(n) {
  return n === "x" ? "y" : "x";
}
function Vy(n) {
  return n === "y" ? "height" : "width";
}
function Ed(n) {
  return ["top", "bottom"].includes(Ad(n)) ? "y" : "x";
}
function jy(n) {
  return Fy(Ed(n));
}
function Nd(n) {
  const {
    x: e,
    y: t,
    width: r,
    height: i
  } = n;
  return {
    width: r,
    height: i,
    top: t,
    left: e,
    right: e + r,
    bottom: t + i,
    x: e,
    y: t
  };
}
function pa(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = Ed(e), o = jy(e), l = Vy(o), a = Ad(e), c = s === "y", d = r.x + r.width / 2 - i.width / 2, u = r.y + r.height / 2 - i.height / 2, h = r[l] / 2 - i[l] / 2;
  let f;
  switch (a) {
    case "top":
      f = {
        x: d,
        y: r.y - i.height
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
        x: r.x - i.width,
        y: u
      };
      break;
    default:
      f = {
        x: r.x,
        y: r.y
      };
  }
  switch (Hy(e)) {
    case "start":
      f[o] -= h * (t && c ? -1 : 1);
      break;
    case "end":
      f[o] += h * (t && c ? -1 : 1);
      break;
  }
  return f;
}
const Wy = async (n, e, t) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = t, l = s.filter(Boolean), a = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: n,
    floating: e,
    strategy: i
  }), {
    x: d,
    y: u
  } = pa(c, r, a), h = r, f = {}, p = 0;
  for (let m = 0; m < l.length; m++) {
    const {
      name: g,
      fn: y
    } = l[m], {
      x: k,
      y: S,
      data: R,
      reset: E
    } = await y({
      x: d,
      y: u,
      initialPlacement: r,
      placement: h,
      strategy: i,
      middlewareData: f,
      rects: c,
      platform: o,
      elements: {
        reference: n,
        floating: e
      }
    });
    d = k ?? d, u = S ?? u, f = {
      ...f,
      [g]: {
        ...f[g],
        ...R
      }
    }, E && p <= 50 && (p++, typeof E == "object" && (E.placement && (h = E.placement), E.rects && (c = E.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : E.rects), {
      x: d,
      y: u
    } = pa(c, h, a)), m = -1);
  }
  return {
    x: d,
    y: u,
    placement: h,
    strategy: i,
    middlewareData: f
  };
};
function pn(n) {
  return Od(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function fe(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ye(n) {
  var e;
  return (e = (Od(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Od(n) {
  return n instanceof Node || n instanceof fe(n).Node;
}
function je(n) {
  return n instanceof Element || n instanceof fe(n).Element;
}
function We(n) {
  return n instanceof HTMLElement || n instanceof fe(n).HTMLElement;
}
function ma(n) {
  return typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof fe(n).ShadowRoot;
}
function Xn(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = Ae(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !["inline", "contents"].includes(i);
}
function _y(n) {
  return ["table", "td", "th"].includes(pn(n));
}
function Li(n) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
function Mo(n) {
  const e = To(), t = Ae(n);
  return t.transform !== "none" || t.perspective !== "none" || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((r) => (t.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some((r) => (t.contain || "").includes(r));
}
function Ky(n) {
  let e = gt(n);
  for (; We(e) && !un(e); ) {
    if (Li(e))
      return null;
    if (Mo(e))
      return e;
    e = gt(e);
  }
  return null;
}
function To() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function un(n) {
  return ["html", "body", "#document"].includes(pn(n));
}
function Ae(n) {
  return fe(n).getComputedStyle(n);
}
function Pi(n) {
  return je(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function gt(n) {
  if (pn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    ma(n) && n.host || // Fallback.
    Ye(n)
  );
  return ma(e) ? e.host : e;
}
function Rd(n) {
  const e = gt(n);
  return un(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : We(e) && Xn(e) ? e : Rd(e);
}
function Kn(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = Rd(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = fe(i);
  return s ? e.concat(o, o.visualViewport || [], Xn(i) ? i : [], o.frameElement && t ? Kn(o.frameElement) : []) : e.concat(i, Kn(i, [], t));
}
function Dd(n) {
  const e = Ae(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = We(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, l = gi(t) !== s || gi(r) !== o;
  return l && (t = s, r = o), {
    width: t,
    height: r,
    $: l
  };
}
function vo(n) {
  return je(n) ? n : n.contextElement;
}
function tn(n) {
  const e = vo(n);
  if (!We(e))
    return mt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Dd(e);
  let o = (s ? gi(t.width) : t.width) / r, l = (s ? gi(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!l || !Number.isFinite(l)) && (l = 1), {
    x: o,
    y: l
  };
}
const Jy = /* @__PURE__ */ mt(0);
function Id(n) {
  const e = fe(n);
  return !To() || !e.visualViewport ? Jy : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function qy(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== fe(n) ? !1 : e;
}
function Ft(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = vo(n);
  let o = mt(1);
  e && (r ? je(r) && (o = tn(r)) : o = tn(n));
  const l = qy(s, t, r) ? Id(s) : mt(0);
  let a = (i.left + l.x) / o.x, c = (i.top + l.y) / o.y, d = i.width / o.x, u = i.height / o.y;
  if (s) {
    const h = fe(s), f = r && je(r) ? fe(r) : r;
    let p = h, m = p.frameElement;
    for (; m && r && f !== p; ) {
      const g = tn(m), y = m.getBoundingClientRect(), k = Ae(m), S = y.left + (m.clientLeft + parseFloat(k.paddingLeft)) * g.x, R = y.top + (m.clientTop + parseFloat(k.paddingTop)) * g.y;
      a *= g.x, c *= g.y, d *= g.x, u *= g.y, a += S, c += R, p = fe(m), m = p.frameElement;
    }
  }
  return Nd({
    width: d,
    height: u,
    x: a,
    y: c
  });
}
function Uy(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = Ye(r), l = e ? Li(e.floating) : !1;
  if (r === o || l && s)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = mt(1);
  const d = mt(0), u = We(r);
  if ((u || !u && !s) && ((pn(r) !== "body" || Xn(o)) && (a = Pi(r)), We(r))) {
    const h = Ft(r);
    c = tn(r), d.x = h.x + r.clientLeft, d.y = h.y + r.clientTop;
  }
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - a.scrollLeft * c.x + d.x,
    y: t.y * c.y - a.scrollTop * c.y + d.y
  };
}
function Gy(n) {
  return Array.from(n.getClientRects());
}
function Ld(n) {
  return Ft(Ye(n)).left + Pi(n).scrollLeft;
}
function Yy(n) {
  const e = Ye(n), t = Pi(n), r = n.ownerDocument.body, i = en(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = en(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Ld(n);
  const l = -t.scrollTop;
  return Ae(r).direction === "rtl" && (o += en(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: l
  };
}
function Xy(n, e) {
  const t = fe(n), r = Ye(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, l = 0, a = 0;
  if (i) {
    s = i.width, o = i.height;
    const c = To();
    (!c || c && e === "fixed") && (l = i.offsetLeft, a = i.offsetTop);
  }
  return {
    width: s,
    height: o,
    x: l,
    y: a
  };
}
function Qy(n, e) {
  const t = Ft(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = We(n) ? tn(n) : mt(1), o = n.clientWidth * s.x, l = n.clientHeight * s.y, a = i * s.x, c = r * s.y;
  return {
    width: o,
    height: l,
    x: a,
    y: c
  };
}
function ga(n, e, t) {
  let r;
  if (e === "viewport")
    r = Xy(n, t);
  else if (e === "document")
    r = Yy(Ye(n));
  else if (je(e))
    r = Qy(e, t);
  else {
    const i = Id(n);
    r = {
      ...e,
      x: e.x - i.x,
      y: e.y - i.y
    };
  }
  return Nd(r);
}
function Pd(n, e) {
  const t = gt(n);
  return t === e || !je(t) || un(t) ? !1 : Ae(t).position === "fixed" || Pd(t, e);
}
function Zy(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Kn(n, [], !1).filter((l) => je(l) && pn(l) !== "body"), i = null;
  const s = Ae(n).position === "fixed";
  let o = s ? gt(n) : n;
  for (; je(o) && !un(o); ) {
    const l = Ae(o), a = Mo(o);
    !a && l.position === "fixed" && (i = null), (s ? !a && !i : !a && l.position === "static" && !!i && ["absolute", "fixed"].includes(i.position) || Xn(o) && !a && Pd(n, o)) ? r = r.filter((d) => d !== o) : i = l, o = gt(o);
  }
  return e.set(n, r), r;
}
function e1(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? Li(e) ? [] : Zy(e, this._c) : [].concat(t), r], l = o[0], a = o.reduce((c, d) => {
    const u = ga(e, d, i);
    return c.top = en(u.top, c.top), c.right = qs(u.right, c.right), c.bottom = qs(u.bottom, c.bottom), c.left = en(u.left, c.left), c;
  }, ga(e, l, i));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function t1(n) {
  const {
    width: e,
    height: t
  } = Dd(n);
  return {
    width: e,
    height: t
  };
}
function n1(n, e, t) {
  const r = We(e), i = Ye(e), s = t === "fixed", o = Ft(n, !0, s, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = mt(0);
  if (r || !r && !s)
    if ((pn(e) !== "body" || Xn(i)) && (l = Pi(e)), r) {
      const u = Ft(e, !0, s, e);
      a.x = u.x + e.clientLeft, a.y = u.y + e.clientTop;
    } else i && (a.x = Ld(i));
  const c = o.left + l.scrollLeft - a.x, d = o.top + l.scrollTop - a.y;
  return {
    x: c,
    y: d,
    width: o.width,
    height: o.height
  };
}
function fs(n) {
  return Ae(n).position === "static";
}
function ya(n, e) {
  return !We(n) || Ae(n).position === "fixed" ? null : e ? e(n) : n.offsetParent;
}
function Bd(n, e) {
  const t = fe(n);
  if (Li(n))
    return t;
  if (!We(n)) {
    let i = gt(n);
    for (; i && !un(i); ) {
      if (je(i) && !fs(i))
        return i;
      i = gt(i);
    }
    return t;
  }
  let r = ya(n, e);
  for (; r && _y(r) && fs(r); )
    r = ya(r, e);
  return r && un(r) && fs(r) && !Mo(r) ? t : r || Ky(n) || t;
}
const r1 = async function(n) {
  const e = this.getOffsetParent || Bd, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: n1(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function i1(n) {
  return Ae(n).direction === "rtl";
}
const s1 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Uy,
  getDocumentElement: Ye,
  getClippingRect: e1,
  getOffsetParent: Bd,
  getElementRects: r1,
  getClientRects: Gy,
  getDimensions: t1,
  getScale: tn,
  isElement: je,
  isRTL: i1
};
function o1(n, e) {
  let t = null, r;
  const i = Ye(n);
  function s() {
    var l;
    clearTimeout(r), (l = t) == null || l.disconnect(), t = null;
  }
  function o(l, a) {
    l === void 0 && (l = !1), a === void 0 && (a = 1), s();
    const {
      left: c,
      top: d,
      width: u,
      height: h
    } = n.getBoundingClientRect();
    if (l || e(), !u || !h)
      return;
    const f = mr(d), p = mr(i.clientWidth - (c + u)), m = mr(i.clientHeight - (d + h)), g = mr(c), k = {
      rootMargin: -f + "px " + -p + "px " + -m + "px " + -g + "px",
      threshold: en(0, qs(1, a)) || 1
    };
    let S = !0;
    function R(E) {
      const M = E[0].intersectionRatio;
      if (M !== a) {
        if (!S)
          return o();
        M ? o(!1, M) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      S = !1;
    }
    try {
      t = new IntersectionObserver(R, {
        ...k,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(R, k);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function l1(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: l = typeof IntersectionObserver == "function",
    animationFrame: a = !1
  } = r, c = vo(n), d = i || s ? [...c ? Kn(c) : [], ...Kn(e)] : [];
  d.forEach((y) => {
    i && y.addEventListener("scroll", t, {
      passive: !0
    }), s && y.addEventListener("resize", t);
  });
  const u = c && l ? o1(c, t) : null;
  let h = -1, f = null;
  o && (f = new ResizeObserver((y) => {
    let [k] = y;
    k && k.target === c && f && (f.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var S;
      (S = f) == null || S.observe(e);
    })), t();
  }), c && !a && f.observe(c), f.observe(e));
  let p, m = a ? Ft(n) : null;
  a && g();
  function g() {
    const y = Ft(n);
    m && (y.x !== m.x || y.y !== m.y || y.width !== m.width || y.height !== m.height) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    d.forEach((k) => {
      i && k.removeEventListener("scroll", t), s && k.removeEventListener("resize", t);
    }), u == null || u(), (y = f) == null || y.disconnect(), f = null, a && cancelAnimationFrame(p);
  };
}
const a1 = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: s1,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return Wy(n, e, {
    ...i,
    platform: s
  });
};
var Be, Jn, lt;
class $d extends HTMLElement {
  constructor() {
    super(...arguments);
    er(this, Be);
    er(this, Jn, "bottom-start");
    er(this, lt);
  }
  connectedCallback() {
    this.setAttribute("class", ne.dropdown.style), document.addEventListener("keyup", (t) => t.code === "Escape" && this.hide());
  }
  disconnectCallback() {
    me(this, lt) && me(this, lt).call(this);
  }
  setPlacement(t) {
    tr(this, Jn, t);
  }
  getPlacement() {
    return me(this, Jn);
  }
  getReference() {
    return me(this, Be);
  }
  renderHTML(t) {
    Sr(t, this);
  }
  updatePosition() {
    return a1(this.getReference(), this, { placement: this.getPlacement() }).then(({ x: t, y: r }) => {
      this.style.top = `${r}px`, this.style.left = `${t}px`;
    });
  }
  async show(t) {
    tr(this, Be, t), this.classList.remove("hidden"), this.classList.add("block"), tr(this, lt, l1(
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
    this.contains(t.target) || (r = me(this, Be)) != null && r.contains(t.target) || this.hide();
  }
  render() {
    if (me(this, Be) instanceof Ne) {
      if (Array.isArray(me(this, Be).getTemplate())) {
        const t = we`
                <nav class="list-none flex flex-col">
                    ${me(this, Be).getTemplate().map(
          (r) => we`
                            <li>
                                <button class="p-2 w-full rounded-lg hover:bg-gray-50" @click=${(i) => r.action(i, this)}>
                                    ${r.icon}
                                </button>
                            </li>
                        `
        )}
                </nav>
            `;
        return this.classList.add("p-1"), this.classList.add("min-w-[150px]"), Sr(t, this);
      }
      return Sr(me(this, Be).getTemplate(), this);
    }
  }
}
Be = new WeakMap(), Jn = new WeakMap(), lt = new WeakMap();
customElements.define("pd-dropdown", $d);
const c1 = new Event("show"), d1 = new Event("hide");
class zd extends HTMLElement {
  constructor() {
    super();
    /**
     * A reference to the element that activated the modal
     */
    Re(this, "reference");
    this.setAttribute("class", ne.modal.backdrop.style), document.addEventListener("keyup", (t) => t.code === "Escape" && this.hide());
  }
  show(t) {
    this.reference = t, this.classList.replace("hidden", "block"), this.dispatchEvent(c1), this.render();
  }
  hide() {
    this.classList.replace("block", "hidden"), this.dispatchEvent(d1);
  }
  toggle(t) {
    this.checkVisibility() ? this.hide() : this.show(t);
  }
  render() {
    if (this.reference instanceof Ne) {
      const t = we`
                <div  class=${ne.modal.dialog.style}>
                    <div class="p-4 flex items-center">
                        ${this.reference.getTitle() !== "" ? we`<span class="text-xl font-bold">${this.reference.getTitle()}</span>` : ""}
                        <button @click=${() => this.hide()} class="p-2 ms-auto rounded-full bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-4">
                        ${this.reference.getTemplate()}
                    </div>
                </div>
            `;
      Sr(t, this);
    }
  }
}
customElements.define("pd-modal", zd);
class Hd extends HTMLElement {
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
    this.editor = new Fm(Object.assign(ne.editor.config, { element: this })), this.setAttribute("class", ne.editor.style), this.dropdown = document.querySelector("pd-dropdown") ?? document.body.appendChild(new $d()), this.modal = document.querySelector("pd-modal") ?? document.body.appendChild(new zd()), this.toolbar = new vd(), this.prepend(this.toolbar), this.renderButtons(), this.toolbar.addEventListener("buttonAdded", () => this.renderButtons()), this.toolbar.addEventListener("buttonRemoved", () => this.renderButtons());
  }
  renderButtons() {
    let t = this.getAttribute("toolbar");
    for (; this.toolbar.firstChild; )
      this.toolbar.removeChild(this.toolbar.firstChild);
    t || (t = "heading|bold,italic,strikethrough|link,image|table");
    const r = t.split("|");
    for (const i of r) {
      const s = document.createElement("div");
      s.classList.add("me-1", "flex"), i.split(",").forEach((o) => {
        this.toolbar.buttons[o] && s.append(
          new this.toolbar.buttons[o](
            this.editor,
            this.dropdown,
            this.modal
          )
        );
      }), this.toolbar.append(s);
    }
  }
}
Re(Hd, "observedAttributes", ["toolbar"]);
customElements.define("pd-editor", Hd);
export {
  Ne as PdButton,
  Hd as PdEditor,
  ne as pdConfig
};
