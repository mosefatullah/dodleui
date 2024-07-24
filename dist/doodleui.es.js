var E = Object.defineProperty;
var D = (t, r, o) => r in t ? E(t, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[r] = o;
var b = (t, r, o) => (D(t, typeof r != "symbol" ? r + "" : r, o), o);
const p = (t, r) => {
  let o = {};
  if (o.options = S, typeof t == "string") {
    const e = document.querySelectorAll(t);
    if (e)
      e.length == 1 ? o.elem = e[0] : o.elems = e;
    else
      throw new Error("(Error: DoodleUI) Element not found!");
    r && typeof r == "object" && (o.options = Object.assign(o.options, r));
  } else if (t && Array.isArray(t)) {
    if (typeof t[0] == "string") {
      const e = document.querySelectorAll(t[0]);
      if (e)
        e.length == 1 ? o.elem = e[0] : o.elems = e;
      else
        throw new Error("(Error: DoodleUI) Elements not found!");
    }
    r && typeof r == "object" && (o.options = Object.assign(o.options, r));
  } else if (t && typeof t == "object")
    r && typeof r == "object" && (o.options = Object.assign(o.options, r)), t instanceof HTMLElement ? o.elem = t : t instanceof NodeList ? o.elems = t : t instanceof Document ? o.elems = t.querySelectorAll("*") : o.options = Object.assign(o.options, t);
  else if (t == null)
    throw new Error("(Error: DoodleUI) Selector is empty! Provide a selector.");
  return o;
}, x = (t, r) => {
  t.elem ? r(t.elem) : t.elems && t.elems.forEach((o) => {
    r(o);
  });
}, S = {}, I = (t, r, o) => {
  let e = {};
  return typeof o == "object" && o.elem || o.elems ? e = o : e = p(t, r), (i, n) => {
    x(e, (s) => {
      if (s["data-dui-observe"] = !0, !("IntersectionObserver" in window))
        throw new Error("(Error: DoodleUI) Observer: intersectionObserver is not supported by your browser!");
      new IntersectionObserver((d) => {
        d.forEach((f) => {
          f.isIntersecting ? typeof i == "function" && i(f) : f.isIntersecting || typeof n == "function" && n(f);
        });
      }).observe(s);
    });
  };
}, C = (t, r, o) => {
  let e = {};
  return typeof o == "object" && o.elem || o.elems ? e = o : e = p(t, r), (i) => {
    x(e, (n) => {
      n["data-dui-getScroll"] = !0, window.addEventListener("scroll", () => {
        const s = n.getBoundingClientRect().top, l = n.getBoundingClientRect().bottom, d = window.scrollY;
        if (typeof i == "function")
          i(d, s, l, n);
        else
          throw new Error(
            "(Error: DoodleUI) Scroller: onScroll (arg1) is not a function!"
          );
      });
    });
  };
}, u = function(t) {
  if (typeof t == "object" || typeof t == "number" || typeof t == "boolean" || typeof t == "array")
    return t;
  if (typeof t == "string") {
    if (t === "undefined")
      return;
    if (t === "null")
      return null;
    if (t === "true")
      return !0;
    if (t === "false")
      return !1;
    try {
      t = JSON.parse(t);
    } catch {
      try {
        let o = parseFloat(t);
        isNaN(o) === !1 && (t = o);
      } catch {
      }
    }
    return t;
  } else
    return typeof t > "u" ? void 0 : typeof t == "function" ? t : "";
}, w = function(t) {
  if (typeof t == "object")
    t === null ? t = "null" : t = JSON.stringify(t);
  else if (typeof t == "string" || typeof t == "number")
    t = t.toString(), t === "undefined" && (t = void 0), t === "null" && (t = null);
  else if (typeof t == "boolean")
    t = t.toString();
  else if (typeof t == "function") {
    let r = "", o = t.toString().split(`
`);
    for (let e = 0; e < o.length; e++)
      o[e].startsWith(" ") ? r += " " + o[e].trim() : r += "," + o[e].trim();
    t = r.substring(1).trim();
  } else if (typeof t == "array")
    t = t.toString();
  else if (typeof t > "u")
    t = "undefined";
  else
    return "";
  return t;
}, c = (t) => t === "session" || t === "s" ? "session" : t === "cookie" || t === "c" ? "cookie" : t === "indexedDB" || t === "idb" || t === "db" || t === "database" ? "indexedDB" : "local", h = {
  setStorage(t, r, o, e = 365) {
    let i;
    if (c(t) === "cookie") {
      let n = "session";
      if (e !== "session") {
        e === "" && (e = 365), e = u(e) * 24 * 60 * 60 * 1e3;
        let s = /* @__PURE__ */ new Date();
        s.setTime(s.getTime() + e), n = "; expires=" + s.toUTCString();
      }
      o = w(o), document.cookie = r + "=" + (o || "") + n + "; path=/";
      return;
    } else if (c(t) === "indexedDB") {
      "indexedDB" in window || (i = {
        error: "(Error: DoodleUI) Storage: this browser doesn't support IndexedDB!"
      });
      let n = indexedDB.open(r, 1);
      n.onupgradeneeded = (function(s) {
        const l = s.target.result;
        if (l.onerror = (d) => {
          console.log("Error: ", d.target.error);
        }, o.table && typeof o.table == "string") {
          let d = l.createObjectStore(
            o.table,
            typeof o.primary == "string" ? { keyPath: o.primary, autoIncrement: !0 } : { autoIncrement: !0 }
          );
          if (o.index && typeof o.index == "array")
            for (let f = 0; f < o.index.length; f++)
              typeof o.index[f][0] == "string" && typeof o.index[f][1] == "boolean" && d.createIndex(o.index[f][0], o.index[f][0], {
                unique: o.index[f][1]
              });
          else
            o.index && typeof o.index == "object" ? typeof o.index[0] == "string" && typeof o.index[1] == "boolean" && d.createIndex(o.index[0], o.index[0], {
              unique: o.index[1]
            }) : o.index && typeof o.index == "string" && d.createIndex(o.index, o.index, { unique: !0 });
        }
      }).bind(this), n.onsuccess = (function(s) {
        let l = s.target.result;
        if (o.table && typeof o.table == "string" && o.value) {
          let d = l.transaction(o.table, "readwrite");
          d.objectStore(o.table).add(o.value).addEventListener("success", () => {
            i = {
              error: "(Error: DoodleUI) Storage: data added to the database successfully!"
            };
          }), d.addEventListener("error", () => {
            i = {
              error: "(Error: DoodleUI) Storage: transaction of indexedDB not opened due to error!"
            };
          }), l.close();
        }
      }).bind(this), n.onerror = function(s) {
        console.log("Error: ", s.target.error);
      };
    } else
      c(t) === "session" ? (o = w(o), sessionStorage.setItem(r, o)) : (o = w(o), localStorage.setItem(r, o));
    return i;
  },
  getStorage(t, r) {
    let o;
    if (c(t) === "cookie") {
      let e = r + "=", n = decodeURIComponent(document.cookie).split(";");
      for (let s = 0; s < n.length; s++) {
        let l = n[s];
        for (; l.charAt(0) === " "; )
          l = l.substring(1);
        if (l.indexOf(e) === 0) {
          let d = l.substring(e.length, l.length);
          d = u(d), o = d;
        }
      }
    } else if (c(t) === "indexedDB") {
      "indexedDB" in window || (o = {
        error: "(Error: DoodleUI) Storage: this browser doesn't support IndexedDB!"
      });
      let e = indexedDB.open(r, 1);
      e.onsuccess = function(i) {
        let d = i.target.result.transaction(r, "readwrite").objectStore(r).get(1);
        d.onsuccess = function(f) {
          let y = f.target.result;
          y = u(y), o = y;
        };
      }, e.onerror = function(i) {
        o = { error: "(Error: DoodleUI) Stoarge: " + i.target.error };
      };
    } else if (c(t) === "session") {
      let e = sessionStorage.getItem(r);
      if (e === null)
        return "";
      e = u(e), o = e;
    } else {
      let e = localStorage.getItem(r);
      if (e === null)
        return "";
      e = u(e), o = e;
    }
    return o;
  },
  removeStorage(t, r) {
    let o;
    return c(t) === "cookie" ? document.cookie = "" : c(t) === "indexedDB" ? ("indexedDB" in window || (o = {
      error: "(Error: DoodleUI) Storage: this browser doesn't support IndexedDB!"
    }), indexedDB.deleteDatabase(r)) : c(t) === "session" ? sessionStorage.removeItem(r) : localStorage.removeItem(r), o;
  },
  clearStorage(t) {
    let r;
    return c(t) === "cookie" ? document.cookie = "" : c(t) === "indexedDB" ? ("indexedDB" in window || (r = {
      error: "(Error: DoodleUI) Storage: this browser doesn't support IndexedDB!"
    }), indexedDB.databases().then((o) => {
      Array.isArray(o) && o.map((e) => {
        this.removeStorage(t, e.name);
      });
    })) : c(t) === "session" ? sessionStorage.clear() : localStorage.clear(), r;
  }
}, j = (t) => {
  let r, o = {
    Control: "Ctrl",
    Escape: "Esc",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    CapsLock: "Capslock",
    NumLock: "Numlock",
    PageUp: "Pageup",
    PageDown: "Pagedown",
    " ": "Space"
  };
  document.onkeyup = function(e) {
    let i = e.key, n = e.ctrlKey, s = e.altKey, l = e.shiftKey;
    if (r = o[i] || i, r.length == 1 && (r = r.toUpperCase()), n && (r = "Ctrl+" + r), s && (r = "Alt+" + r), l && (r = "Shift+" + r), typeof t == "function")
      t(r, e);
    else
      throw new Error("(Error: DoodleUI) Keypress: onKeypress (arg1) is not a function!");
  };
}, A = (t, r, o) => {
  let e = {};
  return typeof o == "object" && o.elem || o.elems ? e = o : e = p(t, r), () => {
    x(e, (i) => {
      i.tagName === "IMG" && i["data-dui-zoom"] !== !0 && (i["data-dui-zoom"] = !0, i.style.cursor = "zoom-in", i.addEventListener("click", () => {
        const n = document.createElement("img"), s = document.body.style.overflow;
        n.src = i.src, n.style.position = "fixed", n.style.top = "0", n.style.left = "0", n.style.width = "100%", n.style.height = "100%", n.style.objectFit = "contain", n.style.zIndex = "9999", n.style.cursor = "zoom-out", n.style.backgroundColor = "rgba(0,0,0,0.5)", n.addEventListener("click", function() {
          this.remove(), document.body.style.overflow = s;
        }), document.body.appendChild(n), document.body.style.overflow = "hidden";
      }));
    });
  };
}, k = (t) => {
  const r = (o) => {
    switch (o) {
      case 1:
        return "Permission denied!";
      case 2:
        return "Position unavailable!";
      case 3:
        return "Timeout reached!";
      default:
        return "An unknown error!";
    }
  };
  if (typeof t == "function")
    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(
        function(o) {
          t({ lat: o.coords.latitude, long: o.coords.longitude }, o);
        },
        function(o) {
          t({ error: r(o.code) }, o);
        }
      );
    else
      throw new Error(
        "(Error: DoodleUI) Location: geolocation is not supported by your browser!"
      );
  else
    throw new Error(
      "(Error: DoodleUI) Location: onLocation (arg1) is not a function!"
    );
}, m = {
  text: function(t, r) {
    let o = t, e = r, i = o.getContext("2d");
    typeof e == "object" && e.value && e.size && e.font && e.xy && e.xy instanceof Array && (i.font = e.size + "px " + e.font, i.fillText(e.value, e.xy[0], e.xy[1])), this.option(t, e, i);
  },
  line: function(t, r) {
    let o = t, e = r, i = o.getContext("2d");
    if (i.beginPath(), typeof e == "object" && (e.width && typeof e.width == "number" && (i.lineWidth = e.width), e.start && e.start instanceof Array && typeof e.start[0] == "number" && typeof e.start[1] == "number" && i.moveTo(e.start[0], e.start[1]), e.end && e.end instanceof Array))
      for (let n = 0; n < e.end.length; n++)
        typeof e.end[n] == "object" && e.end[n] instanceof Array && typeof e.end[n][0] == "number" && typeof e.end[n][1] == "number" && i.lineTo(e.end[n][0], e.end[n][1]);
    i.closePath(), this.option(t, e, i);
  },
  rect: function(t, r) {
    let o = t, e = r, i = o.getContext("2d");
    if (typeof e == "object" && (e.width && typeof e.width == "number" && (i.lineWidth = e.width), e.end && e.end instanceof Array))
      for (let n = 0; n < e.start.length; n++)
        for (let s = 0; s < e.end.length; s++)
          typeof e.start[n] == "object" && e.start[n] instanceof Array && typeof e.start[n][0] == "number" && typeof e.start[n][1] == "number" && typeof e.end[n] == "object" && e.end[n] instanceof Array && typeof e.end[n][0] == "number" && typeof e.end[n][1] == "number" && (i.beginPath(), i.rect(
            e.start[n][0],
            e.start[n][1],
            e.end[s][0],
            e.end[s][1]
          ));
    i.closePath(), this.option(t, e, i);
  },
  circle: function(t, r) {
    let o = t, e = r, i = o.getContext("2d");
    if (typeof e == "object" && (e.width && typeof e.width == "number" && (i.lineWidth = e.width), e.xyr && e.start && e.end))
      for (let n = 0; n < e.xyr.length; n++)
        for (let s = 0; s < e.start.length; s++)
          for (let l = 0; l < e.end.length; l++)
            i.beginPath(), i.arc(
              e.xyr[n][0],
              e.xyr[n][1],
              e.xyr[n][2],
              e.start[s],
              e.end[l]
            );
    i.closePath(), this.option(t, e, i);
  },
  option: function(t, r, o) {
    let e, i, n = r;
    if (o ? e = o : e = t, n && typeof n == "object") {
      if (n.alpha && typeof n.alpha == "number" && (e.globalAlpha = n.alpha), n.rotate && typeof n.rotate == "number" && e.rotate(n.rotate), n.gradient && typeof n.gradient == "object" && n.gradient instanceof Array) {
        i = e.createLinearGradient(0, 0, t.width, 0);
        for (let s = 0; s < n.gradient.length; s++)
          i.addColorStop(n.gradient[s][0], n.gradient[s][1]);
      }
      n.stroke && (e.strokeStyle = n.stroke, n.stroke === "gradient" && i && (e.strokeStyle = i), e.stroke()), typeof n.shadow == "object" && n.shadow instanceof Array && n.shadow[0] && typeof n.shadow[1] == "number" && (e.shadowBlur = n.shadow[1], e.shadowColor = n.shadow[0]), n.fill && (e.fillStyle = n.fill, n.fill === "gradient" && i && (e.fillStyle = i), e.fill());
    }
  },
  animate: function(t) {
    requestAnimationFrame(t);
  },
  clear: function(t) {
    t.getContext("2d").clearRect(0, 0, t.width, t.height);
  },
  save: function(t) {
    t.getContext("2d").save();
  },
  restore: function(t) {
    t.getContext("2d").restore();
  },
  getUrl: function(t) {
    return t.toDataURL("image/svg");
  }
}, g = class g {
  /*** Configuration  */
  constructor(r, o) {
    b(this, "canvas", {
      text: (r) => {
        if (this.elem)
          return m.text(this.elem, r);
        throw new Error(
          "(Error: DoodleUI) Canvas.text: provide fixed element (only 1)!"
        );
      },
      line: (r) => {
        if (this.elem)
          return m.line(this.elem, r);
        throw new Error(
          "(Error: DoodleUI) Canvas.line: provide fixed element (only 1)!"
        );
      },
      rect: (r) => {
        if (this.elem)
          return m.rect(this.elem, r);
        throw new Error(
          "(Error: DoodleUI) Canvas.rect: provide fixed element (only 1)!"
        );
      },
      circle: (r) => {
        if (this.elem)
          return m.circle(this.elem, r);
        throw new Error(
          "(Error: DoodleUI) Canvas.circle: provide fixed element (only 1)!"
        );
      }
    });
    this.elem = null, this.elems = null, this.options = null;
    const { elem: e, elems: i, options: n } = p(r, o);
    return this.elem = e, this.elems = i, this.options = n, this.init(), this instanceof g ? this : new g(r);
  }
  init() {
    this.options && this.options.class && (this.elem ? this.elem.classList.add(...this.options.class.split(" ")) : this.elems && this.elems.forEach((r) => {
      r.classList.add(...this.options.class.split(" "));
    }));
  }
  /*** UI  */
  zoom() {
    A(null, null, this)();
  }
  observer(r, o) {
    I(null, null, this)(r, o);
  }
  scroller(r) {
    C(null, null, this)(r);
  }
  dnd() {
  }
};
b(g, "defaults", S);
let a = g;
a.storage = (t) => ({
  set: (r, o, e) => {
    h.setStorage(t, r, o, e);
  },
  get: (r) => h.getStorage(t, r),
  remove: (r) => {
    h.removeStorage(t, r);
  },
  clear: () => {
    h.clearStorage(t);
  }
});
a.keypress = j;
a.API = {
  location: k,
  device: 0,
  file: 0,
  storage: 0
};
const U = (t, r) => new a(t, r);
export {
  a as DoodleUI,
  U as default
};
