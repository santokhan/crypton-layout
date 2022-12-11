function initMap() {
  if (google && google.maps && google.maps.Map) {
    new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(40.67, -73.94),
      zoom: 17,
      mapTypeControl: !1,
      scrollwheel: !1,
      fullscreenControl: !1,
      zoomControl: !1,
      streetViewControl: !1,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [
            { saturation: 36 },
            { color: "#000000" },
            { lightness: 40 },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#000000" },
            { lightness: 16 },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#000000" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#000000" }, { lightness: 17 }, { weight: 1.2 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 20 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 21 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#000000" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#000000" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 16 }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 19 }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 17 }],
        },
      ],
    });
  }
}
function applyState(t, e, r, i) {
  switch (r[0]) {
    case "transform":
      t.css(prefixed("transform", r[1] + "(" + i + r[2] + ")"));
      break;
    case "text":
      typingA(t, Math.round(i));
      break;
    case "revertText":
      typingA(t, Math.round(i), !0);
      break;
    default:
      var n = {};
      (n[r[0]] = i + (r[1] || "")), t.css(n);
  }
}
function typingA(t, e, r) {
  t.attr("aria-label") || t.lettering();
  var i = t.children();
  !r &&
    (window.frameWithPrint === !0 || window.frameWithPrint === !1) &&
    e > 0 &&
    e < i.length &&
    (window.frameWithPrint = t.data("faceMode") || !0),
    i.each(function (t, i) {
      var n = e > t ? (r ? "false" : "true") : r ? "true" : "false";
      n !== i.getAttribute("aria-hidden") && i.setAttribute("aria-hidden", n);
    });
}
function prefixed(t, e) {
  var r = {};
  return (
    prefixes.forEach(function (i) {
      r[i + t] = e;
    }),
    r
  );
}
function interpolate(t, e, r) {
  return t + (e - t) * r;
}
function interpolateColor(t, e, r) {
  (t = parseColor(t)), (e = parseColor(e));
  var i = t.map(function (t, i) {
    return Math.round(interpolate(t, e[i], r));
  });
  return "rgb(" + i.join(", ") + ")";
}
function parseColor(t) {
  return [
    parseInt(t.slice(1, 3), 16),
    parseInt(t.slice(3, 5), 16),
    parseInt(t.slice(5, 7), 16),
  ];
}
function isColor(t) {
  return /^#[\da-fA-F]{6}$/.test(t);
}
function movieLoad(t) {
  var e = animationParams[t],
    r = bodymovin.loadAnimation(e);
  r.addEventListener("data_ready", function () {
    movieLoaded(r, t);
  }),
    (movies[t] = r);
}
function movieLoaded(t, e) {
  var r = $cache("#bodymovin_" + e).closest(".animBlock"),
    i = (t.totalFrames / t.frameRate) * 1e3;
  r.data("maxPosition", i);
  var n = i + delayAnimations[e];
  r.height(n),
    (window.fullContentHeight = Math.round($cache("#content").height())),
    e++,
    e < animationParams.length && movieLoad(e);
}
function createGetProps(t, e) {
  return (
    t || (t = $(window)),
    function () {
      var r = {
        scrollTop: Math.min(
          Math.max(0, t.scrollTop()),
          window.fullContentHeight || 3e4
        ),
        width: t.width(),
        height: t.height(),
      };
      return e ? $.extend(r, e(r)) : r;
    }
  );
}
function startScenario(t, e) {
  (scenarioStarted = !1),
    $cache(".animBlock").each(function () {
      $(this).height(parseFloat($(this).attr("data-animTimeline")));
    });
  var r = $cache(".animBlock--cover");
  e &&
    subscribeAnimationFrame($scrollable, animKeys, !0, function (t) {
      return {
        _coverHeight: r.height(),
        horizontal: t.width >= t.height,
        desktop: t.width > 1080,
      };
    }),
    setTimeout(function () {
      r.animate({ height: 500 }, 3e3, "linear", function () {
        if (
          ($cache("body").removeClass("fixed-scroll"),
          (window.fullContentHeight = Math.round($cache("#content").height())),
          (scenarioStarted = !0),
          $cache(".animBlock")
            .get()
            .reduce(function (t, e) {
              var r = $(e);
              return r.data("animTop", t), t + e.offsetHeight;
            }, 0),
          window.location.hash && "#" !== window.location.hash)
        ) {
          var t = $cache('a[href="' + window.location.hash + '"]');
          t.length > 0 && window.scrollByLink(t);
        }
      });
    }, t);
}
function animKeys(t, e, r) {
  (!scenario || r.horizontal || r.desktop) &&
    ((horizontal = t.horizontal), updateScenario(t), dropAniRels()),
    (window.playScrollTop = t.scrollTop),
    playScenario(t, r);
}
function playScenario(t, e) {
  (window.frameWithPrint = !1),
    Object.keys(scenario).forEach(function (t) {
      $cache(t).cryptonA(scenario[t]);
    }),
    enhancePlayCover(t),
    window.faceTalk(t, e),
    window.setGoToAndStop(t);
}
function enhancePlayCover(t) {
  if (t.scrollTop < t._coverHeight) {
    var e = $cache("#cover_title").children('[aria-hidden="true"]:last');
    if (e.length) {
      var r = e.position();
      $cache("#animItem-cursor").css({
        right: "auto",
        left: r.left,
        top: r.top,
      });
    }
  }
}
function updateScenario(t) {
  function e(t) {
    var e = t.screenKey,
      r = horizontal || t.onlyText ? t.inTime : 0,
      i = horizontal || t.noInAnimation ? 0 : 240,
      n = horizontal || t.noInAnimation ? t.outTime : r + defaultTypingDuration;
    t.onlyText ||
      ((scenario["#animItem-rect-" + e] = [fullBlock()]),
      showArrows(e.split("_")[1])),
      (scenario["#animItem-" + e] = [
        timeBlock(r, n),
        textOut(n, null, t.textOutPower),
      ]),
      t.noInAnimation || scenario["#animItem-" + e].unshift(textIn(r)),
      (scenario["#animItem-text-" + e + "_1"] = [
        textTyping(r + i, textDuration, t.textLength),
        timeBlock(r + i, n),
        textTypingReverse(n + i / 2, textReverseDuration),
      ]),
      t.noInAnimation ||
        (scenario["#animItem-text-" + e + "_2"] = [
          textTyping(
            r + i + subTextDelay,
            horizontal || t.noInAnimation
              ? subTextDuration
              : subTextDuration / 2
          ),
          timeBlock(r + i + subTextDelay, n),
          textTypingReverse(
            n + i / 2,
            horizontal || !t.noInAnimation
              ? subTextReverseDuration
              : subTextReverseDuration / 2
          ),
        ]);
  }
  function r(t) {
    return 320 + 100 * t;
  }
  (idA = 1), scenario || (scenario = {});
  var i = -500,
    n = i - 600,
    s = $cache("#cover_title").text().length + 5,
    a = $cache("#cover_lid").text().length + 5;
  (scenario["#animItem-1"] = [fullBlock(), textOut(i, -1, 2)]),
    (scenario["#cover_title"] = [
      textTyping(n + 1, 300, s),
      timeBlock(n + 300, i),
      textTypingReverse(i, -1, s),
    ]),
    (scenario["#cover_lid"] = [
      textTyping(n + 300, 300, a),
      timeBlock(n + 300 + 300, i),
      textTypingReverse(i, -1, a),
    ]),
    (scenario["#animItem-cursor"] = [
      timeBlock(i, -1, attr("transform:scaleY:", 1, horizontal ? 30 : 40)),
      timeBlock(i, i + 200, attr("background-color", "#ffffff", "#000000")),
    ]),
    (scenario["#animItem-arrow-down-cover"] = [
      timeBlock(i, i + 100),
      timeBlock(i + 100, -1, attr("opacity", 1, 0)),
    ]);
  var o = [
    { screenKey: "2_1", inTime: 0, outTime: -1 },
    { screenKey: "2_2", inTime: 210, outTime: -100 },
    { screenKey: "2_3", inTime: 120, outTime: -100 },
    { screenKey: "2_4", inTime: 130, outTime: -1 },
    { screenKey: "2_5", inTime: 240, outTime: -1 },
    { screenKey: "2_6", inTime: 250, outTime: -200 },
  ];
  (scenario["#animItem-rect-2_0"] = [fullBlock()]),
    showArrows("0"),
    o.forEach(e);
  var l = 800,
    h = horizontal ? 0 : 100;
  (scenario["#animItem-4"] = [
    textIn(0, 700, horizontal ? 1 : 0.5),
    fullBlock(),
    textOut(-390 + h, null, 2),
  ]),
    showArrows("7"),
    (scenario["#animItem-rect-3"] = [fullBlock()]),
    (scenario["#animItem-text-4"] = [
      textTyping(0, textDuration, 130),
      fullBlock(),
      textTypingReverse(
        -380 + h + l / 8,
        horizontal ? textReverseDuration : textReverseDuration / 1.5
      ),
    ]),
    ["4_1", "4_2", "4_3"].forEach(function (t, r) {
      var i = 710 - l / 4 + r * (2100 - l);
      e({
        screenKey: t,
        inTime: i,
        outTime: i + 1700 + h - l + (l ? 200 : 0),
        onlyText: !0,
        noInAnimation: !0,
        textOutPower: 2,
        textLength: 260 / 1.5,
      });
    }),
    (scenario["#animItem-5_0"] = [
      textIn(0, 500, horizontal ? 1 : 0.5),
      fullBlock(),
    ]),
    (scenario["#animItem-text-5_0_1"] = [textTyping(0, textDuration, 130)]),
    (scenario["#animItem-rect-5"] = [fullBlock()]),
    showArrows("8");
  var p = 400,
    c = horizontal && t.desktop,
    f = r(horizontal ? 2 : 1);
  (scenario["#map"] = [
    timeBlock(
      f,
      p,
      attr("width:%", horizontal ? 0 : 100, horizontal ? 50 : 100)
    ),
    timeBlock(
      f,
      p,
      attr("height:%", horizontal ? 100 : 0, horizontal ? 100 : 70)
    ),
    fullBlock(),
  ]),
    ["5_1", "5_2", "5_3"].forEach(function (t, e) {
      var i = r(e),
        n = "#animItem-" + t;
      (scenario[n] = [
        timeBlock(
          i,
          p,
          attr("width:%", c ? 0 : 100, c ? (2 > e ? 25 : 50) : 100)
        ),
        fullBlock(),
      ]),
        (scenario[n + "_0"] = [textIn(i, 300, c ? 1 : 0.25), fullBlock()]),
        ["_1", "_2", "_3"].forEach(function (t, e) {
          scenario[n + t] = [
            textTyping(i + 80 + 20 * e, textDuration),
            fullBlock(),
          ];
        });
    }),
    (scenario["#animItem-5_4"] = [
      textTyping(700),
      timeBlock(700, 200, attr("transform:translateY:%", 100, 0)),
    ]);
}
function fullBlock() {
  return { idA: idA++ };
}
function timeBlock(t, e, r) {
  var i = { idA: idA++, tStart: t, tDuration: e };
  return r && $.extend(i, r), i;
}
function textIn(t, e, r) {
  return timeBlock(
    t || 0,
    e || defaultTypingDuration,
    horizontal
      ? attr("transform:translateY:%", 100 * (null == r ? 1 : r), 0)
      : attr("transform:translateY:vh", 75 * (null == r ? 1 : r), 0)
  );
}
function textOut(t, e, r) {
  return (
    r || (r = 1),
    timeBlock(
      t || 0,
      e || 600,
      horizontal
        ? attr("transform:translateY:%", 0, -50 * r)
        : attr("transform:translateY:vh", 0, -75 / r)
    )
  );
}
function textTyping(t, e, r) {
  return timeBlock(t, e, attr("text", 0, r || 260));
}
function textTypingReverse(t, e, r) {
  return $.extend(textTyping(t, e, r), { attr: "revertText" });
}
function attr(t, e, r) {
  return { attr: t, attrMin: e, attrMax: r };
}
function showArrows(t) {
  var e = horizontal ? "transform:translateX:vw" : "transform:translateY:vh";
  ["up", "down"].forEach(function (r) {
    var i, n;
    if ("0" === t || ("7" === t && "down" === r)) {
      var s = horizontal ? -5 : "up" === r ? -10 : 10;
      "0" === t ? ((i = s), (n = 0)) : ((i = 0), (n = s));
    } else (i = 0), (n = 0);
    scenario[["#animItem-arrow", r, t].join("-")] = [
      fullBlock(),
      timeBlock("7" === t ? -500 : 0, 500, attr(e, i, n)),
    ];
  });
}
function getCurrentEye(t) {
  return !window.frameWithPrint &&
    (t.scrollTop % 3e3 < 50 || t.scrollTop % 1777 > 2727)
    ? "="
    : window.globalEye
    ? window.globalEye
    : window.frameWithPrint && window.frameWithPrint !== !0
    ? window.frameWithPrint
    : defaultEye;
}
function getCurrentMouth(t, e) {
  return window.frameWithPrint
    ? mouths[
        Math.round(e._coverHeight ? t._coverHeight / 10 : t.scrollTop / 80) %
          mouths.length
      ]
    : defaultMouth;
}
!(function (t, e) {
  "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = t.document
        ? e(t, !0)
        : function (t) {
            if (!t.document)
              throw new Error("jQuery requires a window with a document");
            return e(t);
          })
    : e(t);
})("undefined" != typeof window ? window : this, function (t, e) {
  function r(t) {
    var e = t.length,
      r = st.type(t);
    return "function" === r || st.isWindow(t)
      ? !1
      : 1 === t.nodeType && e
      ? !0
      : "array" === r ||
        0 === e ||
        ("number" == typeof e && e > 0 && e - 1 in t);
  }
  function i(t, e, r) {
    if (st.isFunction(e))
      return st.grep(t, function (t, i) {
        return !!e.call(t, i, t) !== r;
      });
    if (e.nodeType)
      return st.grep(t, function (t) {
        return (t === e) !== r;
      });
    if ("string" == typeof e) {
      if (ut.test(e)) return st.filter(e, t, r);
      e = st.filter(e, t);
    }
    return st.grep(t, function (t) {
      return st.inArray(t, e) >= 0 !== r;
    });
  }
  function n(t, e) {
    do t = t[e];
    while (t && 1 !== t.nodeType);
    return t;
  }
  function s(t) {
    var e = (Et[t] = {});
    return (
      st.each(t.match(xt) || [], function (t, r) {
        e[r] = !0;
      }),
      e
    );
  }
  function a() {
    mt.addEventListener
      ? (mt.removeEventListener("DOMContentLoaded", o, !1),
        t.removeEventListener("load", o, !1))
      : (mt.detachEvent("onreadystatechange", o), t.detachEvent("onload", o));
  }
  function o() {
    (mt.addEventListener ||
      "load" === event.type ||
      "complete" === mt.readyState) &&
      (a(), st.ready());
  }
  function l(t, e, r) {
    if (void 0 === r && 1 === t.nodeType) {
      var i = "data-" + e.replace(kt, "-$1").toLowerCase();
      if (((r = t.getAttribute(i)), "string" == typeof r)) {
        try {
          r =
            "true" === r
              ? !0
              : "false" === r
              ? !1
              : "null" === r
              ? null
              : +r + "" === r
              ? +r
              : Ct.test(r)
              ? st.parseJSON(r)
              : r;
        } catch (n) {}
        st.data(t, e, r);
      } else r = void 0;
    }
    return r;
  }
  function h(t) {
    var e;
    for (e in t)
      if (("data" !== e || !st.isEmptyObject(t[e])) && "toJSON" !== e)
        return !1;
    return !0;
  }
  function p(t, e, r, i) {
    if (st.acceptData(t)) {
      var n,
        s,
        a = st.expando,
        o = t.nodeType,
        l = o ? st.cache : t,
        h = o ? t[a] : t[a] && a;
      if (
        (h && l[h] && (i || l[h].data)) ||
        void 0 !== r ||
        "string" != typeof e
      )
        return (
          h || (h = o ? (t[a] = Y.pop() || st.guid++) : a),
          l[h] || (l[h] = o ? {} : { toJSON: st.noop }),
          ("object" == typeof e || "function" == typeof e) &&
            (i
              ? (l[h] = st.extend(l[h], e))
              : (l[h].data = st.extend(l[h].data, e))),
          (s = l[h]),
          i || (s.data || (s.data = {}), (s = s.data)),
          void 0 !== r && (s[st.camelCase(e)] = r),
          "string" == typeof e
            ? ((n = s[e]), null == n && (n = s[st.camelCase(e)]))
            : (n = s),
          n
        );
    }
  }
  function c(t, e, r) {
    if (st.acceptData(t)) {
      var i,
        n,
        s = t.nodeType,
        a = s ? st.cache : t,
        o = s ? t[st.expando] : st.expando;
      if (a[o]) {
        if (e && (i = r ? a[o] : a[o].data)) {
          st.isArray(e)
            ? (e = e.concat(st.map(e, st.camelCase)))
            : e in i
            ? (e = [e])
            : ((e = st.camelCase(e)), (e = e in i ? [e] : e.split(" "))),
            (n = e.length);
          for (; n--; ) delete i[e[n]];
          if (r ? !h(i) : !st.isEmptyObject(i)) return;
        }
        (r || (delete a[o].data, h(a[o]))) &&
          (s
            ? st.cleanData([t], !0)
            : it.deleteExpando || a != a.window
            ? delete a[o]
            : (a[o] = null));
      }
    }
  }
  function f() {
    return !0;
  }
  function u() {
    return !1;
  }
  function d() {
    try {
      return mt.activeElement;
    } catch (t) {}
  }
  function m(t) {
    var e = Rt.split("|"),
      r = t.createDocumentFragment();
    if (r.createElement) for (; e.length; ) r.createElement(e.pop());
    return r;
  }
  function y(t, e) {
    var r,
      i,
      n = 0,
      s =
        typeof t.getElementsByTagName !== St
          ? t.getElementsByTagName(e || "*")
          : typeof t.querySelectorAll !== St
          ? t.querySelectorAll(e || "*")
          : void 0;
    if (!s)
      for (s = [], r = t.childNodes || t; null != (i = r[n]); n++)
        !e || st.nodeName(i, e) ? s.push(i) : st.merge(s, y(i, e));
    return void 0 === e || (e && st.nodeName(t, e)) ? st.merge([t], s) : s;
  }
  function g(t) {
    Ft.test(t.type) && (t.defaultChecked = t.checked);
  }
  function v(t, e) {
    return st.nodeName(t, "table") &&
      st.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr")
      ? t.getElementsByTagName("tbody")[0] ||
          t.appendChild(t.ownerDocument.createElement("tbody"))
      : t;
  }
  function b(t) {
    return (t.type = (null !== st.find.attr(t, "type")) + "/" + t.type), t;
  }
  function x(t) {
    var e = Yt.exec(t.type);
    return e ? (t.type = e[1]) : t.removeAttribute("type"), t;
  }
  function E(t, e) {
    for (var r, i = 0; null != (r = t[i]); i++)
      st._data(r, "globalEval", !e || st._data(e[i], "globalEval"));
  }
  function w(t, e) {
    if (1 === e.nodeType && st.hasData(t)) {
      var r,
        i,
        n,
        s = st._data(t),
        a = st._data(e, s),
        o = s.events;
      if (o) {
        delete a.handle, (a.events = {});
        for (r in o)
          for (i = 0, n = o[r].length; n > i; i++) st.event.add(e, r, o[r][i]);
      }
      a.data && (a.data = st.extend({}, a.data));
    }
  }
  function P(t, e) {
    var r, i, n;
    if (1 === e.nodeType) {
      if (((r = e.nodeName.toLowerCase()), !it.noCloneEvent && e[st.expando])) {
        n = st._data(e);
        for (i in n.events) st.removeEvent(e, i, n.handle);
        e.removeAttribute(st.expando);
      }
      "script" === r && e.text !== t.text
        ? ((b(e).text = t.text), x(e))
        : "object" === r
        ? (e.parentNode && (e.outerHTML = t.outerHTML),
          it.html5Clone &&
            t.innerHTML &&
            !st.trim(e.innerHTML) &&
            (e.innerHTML = t.innerHTML))
        : "input" === r && Ft.test(t.type)
        ? ((e.defaultChecked = e.checked = t.checked),
          e.value !== t.value && (e.value = t.value))
        : "option" === r
        ? (e.defaultSelected = e.selected = t.defaultSelected)
        : ("input" === r || "textarea" === r) &&
          (e.defaultValue = t.defaultValue);
    }
  }
  function S(e, r) {
    var i = st(r.createElement(e)).appendTo(r.body),
      n = t.getDefaultComputedStyle
        ? t.getDefaultComputedStyle(i[0]).display
        : st.css(i[0], "display");
    return i.detach(), n;
  }
  function C(t) {
    var e = mt,
      r = te[t];
    return (
      r ||
        ((r = S(t, e)),
        ("none" !== r && r) ||
          ((Zt = (
            Zt || st("<iframe frameborder='0' width='0' height='0'/>")
          ).appendTo(e.documentElement)),
          (e = (Zt[0].contentWindow || Zt[0].contentDocument).document),
          e.write(),
          e.close(),
          (r = S(t, e)),
          Zt.detach()),
        (te[t] = r)),
      r
    );
  }
  function k(t, e) {
    return {
      get: function () {
        var r = t();
        return null != r
          ? r
            ? void delete this.get
            : (this.get = e).apply(this, arguments)
          : void 0;
      },
    };
  }
  function T(t, e) {
    if (e in t) return e;
    for (
      var r = e.charAt(0).toUpperCase() + e.slice(1), i = e, n = ue.length;
      n--;

    )
      if (((e = ue[n] + r), e in t)) return e;
    return i;
  }
  function A(t, e) {
    for (var r, i, n, s = [], a = 0, o = t.length; o > a; a++)
      (i = t[a]),
        i.style &&
          ((s[a] = st._data(i, "olddisplay")),
          (r = i.style.display),
          e
            ? (s[a] || "none" !== r || (i.style.display = ""),
              "" === i.style.display &&
                Mt(i) &&
                (s[a] = st._data(i, "olddisplay", C(i.nodeName))))
            : s[a] ||
              ((n = Mt(i)),
              ((r && "none" !== r) || !n) &&
                st._data(i, "olddisplay", n ? r : st.css(i, "display"))));
    for (a = 0; o > a; a++)
      (i = t[a]),
        i.style &&
          ((e && "none" !== i.style.display && "" !== i.style.display) ||
            (i.style.display = e ? s[a] || "" : "none"));
    return t;
  }
  function M(t, e, r) {
    var i = he.exec(e);
    return i ? Math.max(0, i[1] - (r || 0)) + (i[2] || "px") : e;
  }
  function D(t, e, r, i, n) {
    for (
      var s = r === (i ? "border" : "content") ? 4 : "width" === e ? 1 : 0,
        a = 0;
      4 > s;
      s += 2
    )
      "margin" === r && (a += st.css(t, r + At[s], !0, n)),
        i
          ? ("content" === r && (a -= st.css(t, "padding" + At[s], !0, n)),
            "margin" !== r &&
              (a -= st.css(t, "border" + At[s] + "Width", !0, n)))
          : ((a += st.css(t, "padding" + At[s], !0, n)),
            "padding" !== r &&
              (a += st.css(t, "border" + At[s] + "Width", !0, n)));
    return a;
  }
  function F(t, e, r) {
    var i = !0,
      n = "width" === e ? t.offsetWidth : t.offsetHeight,
      s = ee(t),
      a = it.boxSizing() && "border-box" === st.css(t, "boxSizing", !1, s);
    if (0 >= n || null == n) {
      if (
        ((n = re(t, e, s)),
        (0 > n || null == n) && (n = t.style[e]),
        ne.test(n))
      )
        return n;
      (i = a && (it.boxSizingReliable() || n === t.style[e])),
        (n = parseFloat(n) || 0);
    }
    return n + D(t, e, r || (a ? "border" : "content"), i, s) + "px";
  }
  function I(t, e, r, i, n) {
    return new I.prototype.init(t, e, r, i, n);
  }
  function _() {
    return (
      setTimeout(function () {
        de = void 0;
      }),
      (de = st.now())
    );
  }
  function N(t, e) {
    var r,
      i = { height: t },
      n = 0;
    for (e = e ? 1 : 0; 4 > n; n += 2 - e)
      (r = At[n]), (i["margin" + r] = i["padding" + r] = t);
    return e && (i.opacity = i.width = t), i;
  }
  function B(t, e, r) {
    for (
      var i, n = (xe[e] || []).concat(xe["*"]), s = 0, a = n.length;
      a > s;
      s++
    )
      if ((i = n[s].call(r, e, t))) return i;
  }
  function L(t, e, r) {
    var i,
      n,
      s,
      a,
      o,
      l,
      h,
      p,
      c = this,
      f = {},
      u = t.style,
      d = t.nodeType && Mt(t),
      m = st._data(t, "fxshow");
    r.queue ||
      ((o = st._queueHooks(t, "fx")),
      null == o.unqueued &&
        ((o.unqueued = 0),
        (l = o.empty.fire),
        (o.empty.fire = function () {
          o.unqueued || l();
        })),
      o.unqueued++,
      c.always(function () {
        c.always(function () {
          o.unqueued--, st.queue(t, "fx").length || o.empty.fire();
        });
      })),
      1 === t.nodeType &&
        ("height" in e || "width" in e) &&
        ((r.overflow = [u.overflow, u.overflowX, u.overflowY]),
        (h = st.css(t, "display")),
        (p = C(t.nodeName)),
        "none" === h && (h = p),
        "inline" === h &&
          "none" === st.css(t, "float") &&
          (it.inlineBlockNeedsLayout && "inline" !== p
            ? (u.zoom = 1)
            : (u.display = "inline-block"))),
      r.overflow &&
        ((u.overflow = "hidden"),
        it.shrinkWrapBlocks() ||
          c.always(function () {
            (u.overflow = r.overflow[0]),
              (u.overflowX = r.overflow[1]),
              (u.overflowY = r.overflow[2]);
          }));
    for (i in e)
      if (((n = e[i]), ye.exec(n))) {
        if (
          (delete e[i], (s = s || "toggle" === n), n === (d ? "hide" : "show"))
        ) {
          if ("show" !== n || !m || void 0 === m[i]) continue;
          d = !0;
        }
        f[i] = (m && m[i]) || st.style(t, i);
      }
    if (!st.isEmptyObject(f)) {
      m ? "hidden" in m && (d = m.hidden) : (m = st._data(t, "fxshow", {})),
        s && (m.hidden = !d),
        d
          ? st(t).show()
          : c.done(function () {
              st(t).hide();
            }),
        c.done(function () {
          var e;
          st._removeData(t, "fxshow");
          for (e in f) st.style(t, e, f[e]);
        });
      for (i in f)
        (a = B(d ? m[i] : 0, i, c)),
          i in m ||
            ((m[i] = a.start),
            d &&
              ((a.end = a.start),
              (a.start = "width" === i || "height" === i ? 1 : 0)));
    }
  }
  function R(t, e) {
    var r, i, n, s, a;
    for (r in t)
      if (
        ((i = st.camelCase(r)),
        (n = e[i]),
        (s = t[r]),
        st.isArray(s) && ((n = s[1]), (s = t[r] = s[0])),
        r !== i && ((t[i] = s), delete t[r]),
        (a = st.cssHooks[i]),
        a && "expand" in a)
      ) {
        (s = a.expand(s)), delete t[i];
        for (r in s) r in t || ((t[r] = s[r]), (e[r] = n));
      } else e[i] = n;
  }
  function V(t, e, r) {
    var i,
      n,
      s = 0,
      a = be.length,
      o = st.Deferred().always(function () {
        delete l.elem;
      }),
      l = function () {
        if (n) return !1;
        for (
          var e = de || _(),
            r = Math.max(0, h.startTime + h.duration - e),
            i = r / h.duration || 0,
            s = 1 - i,
            a = 0,
            l = h.tweens.length;
          l > a;
          a++
        )
          h.tweens[a].run(s);
        return (
          o.notifyWith(t, [h, s, r]),
          1 > s && l ? r : (o.resolveWith(t, [h]), !1)
        );
      },
      h = o.promise({
        elem: t,
        props: st.extend({}, e),
        opts: st.extend(!0, { specialEasing: {} }, r),
        originalProperties: e,
        originalOptions: r,
        startTime: de || _(),
        duration: r.duration,
        tweens: [],
        createTween: function (e, r) {
          var i = st.Tween(
            t,
            h.opts,
            e,
            r,
            h.opts.specialEasing[e] || h.opts.easing
          );
          return h.tweens.push(i), i;
        },
        stop: function (e) {
          var r = 0,
            i = e ? h.tweens.length : 0;
          if (n) return this;
          for (n = !0; i > r; r++) h.tweens[r].run(1);
          return e ? o.resolveWith(t, [h, e]) : o.rejectWith(t, [h, e]), this;
        },
      }),
      p = h.props;
    for (R(p, h.opts.specialEasing); a > s; s++)
      if ((i = be[s].call(h, t, p, h.opts))) return i;
    return (
      st.map(p, B, h),
      st.isFunction(h.opts.start) && h.opts.start.call(t, h),
      st.fx.timer(st.extend(l, { elem: t, anim: h, queue: h.opts.queue })),
      h
        .progress(h.opts.progress)
        .done(h.opts.done, h.opts.complete)
        .fail(h.opts.fail)
        .always(h.opts.always)
    );
  }
  function j(t) {
    return function (e, r) {
      "string" != typeof e && ((r = e), (e = "*"));
      var i,
        n = 0,
        s = e.toLowerCase().match(xt) || [];
      if (st.isFunction(r))
        for (; (i = s[n++]); )
          "+" === i.charAt(0)
            ? ((i = i.slice(1) || "*"), (t[i] = t[i] || []).unshift(r))
            : (t[i] = t[i] || []).push(r);
    };
  }
  function H(t, e, r, i) {
    function n(o) {
      var l;
      return (
        (s[o] = !0),
        st.each(t[o] || [], function (t, o) {
          var h = o(e, r, i);
          return "string" != typeof h || a || s[h]
            ? a
              ? !(l = h)
              : void 0
            : (e.dataTypes.unshift(h), n(h), !1);
        }),
        l
      );
    }
    var s = {},
      a = t === qe;
    return n(e.dataTypes[0]) || (!s["*"] && n("*"));
  }
  function O(t, e) {
    var r,
      i,
      n = st.ajaxSettings.flatOptions || {};
    for (i in e) void 0 !== e[i] && ((n[i] ? t : r || (r = {}))[i] = e[i]);
    return r && st.extend(!0, t, r), t;
  }
  function z(t, e, r) {
    for (var i, n, s, a, o = t.contents, l = t.dataTypes; "*" === l[0]; )
      l.shift(),
        void 0 === n && (n = t.mimeType || e.getResponseHeader("Content-Type"));
    if (n)
      for (a in o)
        if (o[a] && o[a].test(n)) {
          l.unshift(a);
          break;
        }
    if (l[0] in r) s = l[0];
    else {
      for (a in r) {
        if (!l[0] || t.converters[a + " " + l[0]]) {
          s = a;
          break;
        }
        i || (i = a);
      }
      s = s || i;
    }
    return s ? (s !== l[0] && l.unshift(s), r[s]) : void 0;
  }
  function G(t, e, r, i) {
    var n,
      s,
      a,
      o,
      l,
      h = {},
      p = t.dataTypes.slice();
    if (p[1]) for (a in t.converters) h[a.toLowerCase()] = t.converters[a];
    for (s = p.shift(); s; )
      if (
        (t.responseFields[s] && (r[t.responseFields[s]] = e),
        !l && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)),
        (l = s),
        (s = p.shift()))
      )
        if ("*" === s) s = l;
        else if ("*" !== l && l !== s) {
          if (((a = h[l + " " + s] || h["* " + s]), !a))
            for (n in h)
              if (
                ((o = n.split(" ")),
                o[1] === s && (a = h[l + " " + o[0]] || h["* " + o[0]]))
              ) {
                a === !0
                  ? (a = h[n])
                  : h[n] !== !0 && ((s = o[0]), p.unshift(o[1]));
                break;
              }
          if (a !== !0)
            if (a && t["throws"]) e = a(e);
            else
              try {
                e = a(e);
              } catch (c) {
                return {
                  state: "parsererror",
                  error: a ? c : "No conversion from " + l + " to " + s,
                };
              }
        }
    return { state: "success", data: e };
  }
  function q(t, e, r, i) {
    var n;
    if (st.isArray(e))
      st.each(e, function (e, n) {
        r || Ye.test(t)
          ? i(t, n)
          : q(t + "[" + ("object" == typeof n ? e : "") + "]", n, r, i);
      });
    else if (r || "object" !== st.type(e)) i(t, e);
    else for (n in e) q(t + "[" + n + "]", e[n], r, i);
  }
  function W() {
    try {
      return new t.XMLHttpRequest();
    } catch (e) {}
  }
  function $() {
    try {
      return new t.ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
  }
  function X(t) {
    return st.isWindow(t)
      ? t
      : 9 === t.nodeType
      ? t.defaultView || t.parentWindow
      : !1;
  }
  var Y = [],
    U = Y.slice,
    K = Y.concat,
    J = Y.push,
    Q = Y.indexOf,
    Z = {},
    tt = Z.toString,
    et = Z.hasOwnProperty,
    rt = "".trim,
    it = {},
    nt = "1.11.0",
    st = function (t, e) {
      return new st.fn.init(t, e);
    },
    at = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    ot = /^-ms-/,
    lt = /-([\da-z])/gi,
    ht = function (t, e) {
      return e.toUpperCase();
    };
  (st.fn = st.prototype =
    {
      jquery: nt,
      constructor: st,
      selector: "",
      length: 0,
      toArray: function () {
        return U.call(this);
      },
      get: function (t) {
        return null != t
          ? 0 > t
            ? this[t + this.length]
            : this[t]
          : U.call(this);
      },
      pushStack: function (t) {
        var e = st.merge(this.constructor(), t);
        return (e.prevObject = this), (e.context = this.context), e;
      },
      each: function (t, e) {
        return st.each(this, t, e);
      },
      map: function (t) {
        return this.pushStack(
          st.map(this, function (e, r) {
            return t.call(e, r, e);
          })
        );
      },
      slice: function () {
        return this.pushStack(U.apply(this, arguments));
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      eq: function (t) {
        var e = this.length,
          r = +t + (0 > t ? e : 0);
        return this.pushStack(r >= 0 && e > r ? [this[r]] : []);
      },
      end: function () {
        return this.prevObject || this.constructor(null);
      },
      push: J,
      sort: Y.sort,
      splice: Y.splice,
    }),
    (st.extend = st.fn.extend =
      function () {
        var t,
          e,
          r,
          i,
          n,
          s,
          a = arguments[0] || {},
          o = 1,
          l = arguments.length,
          h = !1;
        for (
          "boolean" == typeof a && ((h = a), (a = arguments[o] || {}), o++),
            "object" == typeof a || st.isFunction(a) || (a = {}),
            o === l && ((a = this), o--);
          l > o;
          o++
        )
          if (null != (n = arguments[o]))
            for (i in n)
              (t = a[i]),
                (r = n[i]),
                a !== r &&
                  (h && r && (st.isPlainObject(r) || (e = st.isArray(r)))
                    ? (e
                        ? ((e = !1), (s = t && st.isArray(t) ? t : []))
                        : (s = t && st.isPlainObject(t) ? t : {}),
                      (a[i] = st.extend(h, s, r)))
                    : void 0 !== r && (a[i] = r));
        return a;
      }),
    st.extend({
      expando: "jQuery" + (nt + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function (t) {
        throw new Error(t);
      },
      noop: function () {},
      isFunction: function (t) {
        return "function" === st.type(t);
      },
      isArray:
        Array.isArray ||
        function (t) {
          return "array" === st.type(t);
        },
      isWindow: function (t) {
        return null != t && t == t.window;
      },
      isNumeric: function (t) {
        return t - parseFloat(t) >= 0;
      },
      isEmptyObject: function (t) {
        var e;
        for (e in t) return !1;
        return !0;
      },
      isPlainObject: function (t) {
        var e;
        if (!t || "object" !== st.type(t) || t.nodeType || st.isWindow(t))
          return !1;
        try {
          if (
            t.constructor &&
            !et.call(t, "constructor") &&
            !et.call(t.constructor.prototype, "isPrototypeOf")
          )
            return !1;
        } catch (r) {
          return !1;
        }
        if (it.ownLast) for (e in t) return et.call(t, e);
        for (e in t);
        return void 0 === e || et.call(t, e);
      },
      type: function (t) {
        return null == t
          ? t + ""
          : "object" == typeof t || "function" == typeof t
          ? Z[tt.call(t)] || "object"
          : typeof t;
      },
      globalEval: function (e) {
        e &&
          st.trim(e) &&
          (
            t.execScript ||
            function (e) {
              t.eval.call(t, e);
            }
          )(e);
      },
      camelCase: function (t) {
        return t.replace(ot, "ms-").replace(lt, ht);
      },
      nodeName: function (t, e) {
        return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase();
      },
      each: function (t, e, i) {
        var n,
          s = 0,
          a = t.length,
          o = r(t);
        if (i) {
          if (o) for (; a > s && ((n = e.apply(t[s], i)), n !== !1); s++);
          else for (s in t) if (((n = e.apply(t[s], i)), n === !1)) break;
        } else if (o)
          for (; a > s && ((n = e.call(t[s], s, t[s])), n !== !1); s++);
        else for (s in t) if (((n = e.call(t[s], s, t[s])), n === !1)) break;
        return t;
      },
      trim:
        rt && !rt.call("\ufeff\xa0")
          ? function (t) {
              return null == t ? "" : rt.call(t);
            }
          : function (t) {
              return null == t ? "" : (t + "").replace(at, "");
            },
      makeArray: function (t, e) {
        var i = e || [];
        return (
          null != t &&
            (r(Object(t))
              ? st.merge(i, "string" == typeof t ? [t] : t)
              : J.call(i, t)),
          i
        );
      },
      inArray: function (t, e, r) {
        var i;
        if (e) {
          if (Q) return Q.call(e, t, r);
          for (
            i = e.length, r = r ? (0 > r ? Math.max(0, i + r) : r) : 0;
            i > r;
            r++
          )
            if (r in e && e[r] === t) return r;
        }
        return -1;
      },
      merge: function (t, e) {
        for (var r = +e.length, i = 0, n = t.length; r > i; ) t[n++] = e[i++];
        if (r !== r) for (; void 0 !== e[i]; ) t[n++] = e[i++];
        return (t.length = n), t;
      },
      grep: function (t, e, r) {
        for (var i, n = [], s = 0, a = t.length, o = !r; a > s; s++)
          (i = !e(t[s], s)), i !== o && n.push(t[s]);
        return n;
      },
      map: function (t, e, i) {
        var n,
          s = 0,
          a = t.length,
          o = r(t),
          l = [];
        if (o) for (; a > s; s++) (n = e(t[s], s, i)), null != n && l.push(n);
        else for (s in t) (n = e(t[s], s, i)), null != n && l.push(n);
        return K.apply([], l);
      },
      guid: 1,
      proxy: function (t, e) {
        var r, i, n;
        return (
          "string" == typeof e && ((n = t[e]), (e = t), (t = n)),
          st.isFunction(t)
            ? ((r = U.call(arguments, 2)),
              (i = function () {
                return t.apply(e || this, r.concat(U.call(arguments)));
              }),
              (i.guid = t.guid = t.guid || st.guid++),
              i)
            : void 0
        );
      },
      now: function () {
        return +new Date();
      },
      support: it,
    }),
    st.each(
      "Boolean Number String Function Array Date RegExp Object Error".split(
        " "
      ),
      function (t, e) {
        Z["[object " + e + "]"] = e.toLowerCase();
      }
    );
  var pt = (function (t) {
    function e(t, e, r, i) {
      var n, s, a, o, l, h, c, d, m, y;
      if (
        ((e ? e.ownerDocument || e : H) !== I && F(e),
        (e = e || I),
        (r = r || []),
        !t || "string" != typeof t)
      )
        return r;
      if (1 !== (o = e.nodeType) && 9 !== o) return [];
      if (N && !i) {
        if ((n = vt.exec(t)))
          if ((a = n[1])) {
            if (9 === o) {
              if (((s = e.getElementById(a)), !s || !s.parentNode)) return r;
              if (s.id === a) return r.push(s), r;
            } else if (
              e.ownerDocument &&
              (s = e.ownerDocument.getElementById(a)) &&
              V(e, s) &&
              s.id === a
            )
              return r.push(s), r;
          } else {
            if (n[2]) return Z.apply(r, e.getElementsByTagName(t)), r;
            if (
              (a = n[3]) &&
              P.getElementsByClassName &&
              e.getElementsByClassName
            )
              return Z.apply(r, e.getElementsByClassName(a)), r;
          }
        if (P.qsa && (!B || !B.test(t))) {
          if (
            ((d = c = j),
            (m = e),
            (y = 9 === o && t),
            1 === o && "object" !== e.nodeName.toLowerCase())
          ) {
            for (
              h = f(t),
                (c = e.getAttribute("id"))
                  ? (d = c.replace(xt, "\\$&"))
                  : e.setAttribute("id", d),
                d = "[id='" + d + "'] ",
                l = h.length;
              l--;

            )
              h[l] = d + u(h[l]);
            (m = (bt.test(t) && p(e.parentNode)) || e), (y = h.join(","));
          }
          if (y)
            try {
              return Z.apply(r, m.querySelectorAll(y)), r;
            } catch (g) {
            } finally {
              c || e.removeAttribute("id");
            }
        }
      }
      return E(t.replace(lt, "$1"), e, r, i);
    }
    function r() {
      function t(r, i) {
        return (
          e.push(r + " ") > S.cacheLength && delete t[e.shift()],
          (t[r + " "] = i)
        );
      }
      var e = [];
      return t;
    }
    function i(t) {
      return (t[j] = !0), t;
    }
    function n(t) {
      var e = I.createElement("div");
      try {
        return !!t(e);
      } catch (r) {
        return !1;
      } finally {
        e.parentNode && e.parentNode.removeChild(e), (e = null);
      }
    }
    function s(t, e) {
      for (var r = t.split("|"), i = t.length; i--; ) S.attrHandle[r[i]] = e;
    }
    function a(t, e) {
      var r = e && t,
        i =
          r &&
          1 === t.nodeType &&
          1 === e.nodeType &&
          (~e.sourceIndex || Y) - (~t.sourceIndex || Y);
      if (i) return i;
      if (r) for (; (r = r.nextSibling); ) if (r === e) return -1;
      return t ? 1 : -1;
    }
    function o(t) {
      return function (e) {
        var r = e.nodeName.toLowerCase();
        return "input" === r && e.type === t;
      };
    }
    function l(t) {
      return function (e) {
        var r = e.nodeName.toLowerCase();
        return ("input" === r || "button" === r) && e.type === t;
      };
    }
    function h(t) {
      return i(function (e) {
        return (
          (e = +e),
          i(function (r, i) {
            for (var n, s = t([], r.length, e), a = s.length; a--; )
              r[(n = s[a])] && (r[n] = !(i[n] = r[n]));
          })
        );
      });
    }
    function p(t) {
      return t && typeof t.getElementsByTagName !== X && t;
    }
    function c() {}
    function f(t, r) {
      var i,
        n,
        s,
        a,
        o,
        l,
        h,
        p = q[t + " "];
      if (p) return r ? 0 : p.slice(0);
      for (o = t, l = [], h = S.preFilter; o; ) {
        (!i || (n = ht.exec(o))) &&
          (n && (o = o.slice(n[0].length) || o), l.push((s = []))),
          (i = !1),
          (n = pt.exec(o)) &&
            ((i = n.shift()),
            s.push({ value: i, type: n[0].replace(lt, " ") }),
            (o = o.slice(i.length)));
        for (a in S.filter)
          !(n = dt[a].exec(o)) ||
            (h[a] && !(n = h[a](n))) ||
            ((i = n.shift()),
            s.push({ value: i, type: a, matches: n }),
            (o = o.slice(i.length)));
        if (!i) break;
      }
      return r ? o.length : o ? e.error(t) : q(t, l).slice(0);
    }
    function u(t) {
      for (var e = 0, r = t.length, i = ""; r > e; e++) i += t[e].value;
      return i;
    }
    function d(t, e, r) {
      var i = e.dir,
        n = r && "parentNode" === i,
        s = z++;
      return e.first
        ? function (e, r, s) {
            for (; (e = e[i]); ) if (1 === e.nodeType || n) return t(e, r, s);
          }
        : function (e, r, a) {
            var o,
              l,
              h = [O, s];
            if (a) {
              for (; (e = e[i]); )
                if ((1 === e.nodeType || n) && t(e, r, a)) return !0;
            } else
              for (; (e = e[i]); )
                if (1 === e.nodeType || n) {
                  if (
                    ((l = e[j] || (e[j] = {})),
                    (o = l[i]) && o[0] === O && o[1] === s)
                  )
                    return (h[2] = o[2]);
                  if (((l[i] = h), (h[2] = t(e, r, a)))) return !0;
                }
          };
    }
    function m(t) {
      return t.length > 1
        ? function (e, r, i) {
            for (var n = t.length; n--; ) if (!t[n](e, r, i)) return !1;
            return !0;
          }
        : t[0];
    }
    function y(t, e, r, i, n) {
      for (var s, a = [], o = 0, l = t.length, h = null != e; l > o; o++)
        (s = t[o]) && (!r || r(s, i, n)) && (a.push(s), h && e.push(o));
      return a;
    }
    function g(t, e, r, n, s, a) {
      return (
        n && !n[j] && (n = g(n)),
        s && !s[j] && (s = g(s, a)),
        i(function (i, a, o, l) {
          var h,
            p,
            c,
            f = [],
            u = [],
            d = a.length,
            m = i || x(e || "*", o.nodeType ? [o] : o, []),
            g = !t || (!i && e) ? m : y(m, f, t, o, l),
            v = r ? (s || (i ? t : d || n) ? [] : a) : g;
          if ((r && r(g, v, o, l), n))
            for (h = y(v, u), n(h, [], o, l), p = h.length; p--; )
              (c = h[p]) && (v[u[p]] = !(g[u[p]] = c));
          if (i) {
            if (s || t) {
              if (s) {
                for (h = [], p = v.length; p--; )
                  (c = v[p]) && h.push((g[p] = c));
                s(null, (v = []), h, l);
              }
              for (p = v.length; p--; )
                (c = v[p]) &&
                  (h = s ? et.call(i, c) : f[p]) > -1 &&
                  (i[h] = !(a[h] = c));
            }
          } else (v = y(v === a ? v.splice(d, v.length) : v)), s ? s(null, a, v, l) : Z.apply(a, v);
        })
      );
    }
    function v(t) {
      for (
        var e,
          r,
          i,
          n = t.length,
          s = S.relative[t[0].type],
          a = s || S.relative[" "],
          o = s ? 1 : 0,
          l = d(
            function (t) {
              return t === e;
            },
            a,
            !0
          ),
          h = d(
            function (t) {
              return et.call(e, t) > -1;
            },
            a,
            !0
          ),
          p = [
            function (t, r, i) {
              return (
                (!s && (i || r !== A)) ||
                ((e = r).nodeType ? l(t, r, i) : h(t, r, i))
              );
            },
          ];
        n > o;
        o++
      )
        if ((r = S.relative[t[o].type])) p = [d(m(p), r)];
        else {
          if (((r = S.filter[t[o].type].apply(null, t[o].matches)), r[j])) {
            for (i = ++o; n > i && !S.relative[t[i].type]; i++);
            return g(
              o > 1 && m(p),
              o > 1 &&
                u(
                  t
                    .slice(0, o - 1)
                    .concat({ value: " " === t[o - 2].type ? "*" : "" })
                ).replace(lt, "$1"),
              r,
              i > o && v(t.slice(o, i)),
              n > i && v((t = t.slice(i))),
              n > i && u(t)
            );
          }
          p.push(r);
        }
      return m(p);
    }
    function b(t, r) {
      var n = r.length > 0,
        s = t.length > 0,
        a = function (i, a, o, l, h) {
          var p,
            c,
            f,
            u = 0,
            d = "0",
            m = i && [],
            g = [],
            v = A,
            b = i || (s && S.find.TAG("*", h)),
            x = (O += null == v ? 1 : Math.random() || 0.1),
            E = b.length;
          for (h && (A = a !== I && a); d !== E && null != (p = b[d]); d++) {
            if (s && p) {
              for (c = 0; (f = t[c++]); )
                if (f(p, a, o)) {
                  l.push(p);
                  break;
                }
              h && (O = x);
            }
            n && ((p = !f && p) && u--, i && m.push(p));
          }
          if (((u += d), n && d !== u)) {
            for (c = 0; (f = r[c++]); ) f(m, g, a, o);
            if (i) {
              if (u > 0) for (; d--; ) m[d] || g[d] || (g[d] = J.call(l));
              g = y(g);
            }
            Z.apply(l, g),
              h && !i && g.length > 0 && u + r.length > 1 && e.uniqueSort(l);
          }
          return h && ((O = x), (A = v)), m;
        };
      return n ? i(a) : a;
    }
    function x(t, r, i) {
      for (var n = 0, s = r.length; s > n; n++) e(t, r[n], i);
      return i;
    }
    function E(t, e, r, i) {
      var n,
        s,
        a,
        o,
        l,
        h = f(t);
      if (!i && 1 === h.length) {
        if (
          ((s = h[0] = h[0].slice(0)),
          s.length > 2 &&
            "ID" === (a = s[0]).type &&
            P.getById &&
            9 === e.nodeType &&
            N &&
            S.relative[s[1].type])
        ) {
          if (((e = (S.find.ID(a.matches[0].replace(Et, wt), e) || [])[0]), !e))
            return r;
          t = t.slice(s.shift().value.length);
        }
        for (
          n = dt.needsContext.test(t) ? 0 : s.length;
          n-- && ((a = s[n]), !S.relative[(o = a.type)]);

        )
          if (
            (l = S.find[o]) &&
            (i = l(
              a.matches[0].replace(Et, wt),
              (bt.test(s[0].type) && p(e.parentNode)) || e
            ))
          ) {
            if ((s.splice(n, 1), (t = i.length && u(s)), !t))
              return Z.apply(r, i), r;
            break;
          }
      }
      return T(t, h)(i, e, !N, r, (bt.test(t) && p(e.parentNode)) || e), r;
    }
    var w,
      P,
      S,
      C,
      k,
      T,
      A,
      M,
      D,
      F,
      I,
      _,
      N,
      B,
      L,
      R,
      V,
      j = "sizzle" + -new Date(),
      H = t.document,
      O = 0,
      z = 0,
      G = r(),
      q = r(),
      W = r(),
      $ = function (t, e) {
        return t === e && (D = !0), 0;
      },
      X = "undefined",
      Y = 1 << 31,
      U = {}.hasOwnProperty,
      K = [],
      J = K.pop,
      Q = K.push,
      Z = K.push,
      tt = K.slice,
      et =
        K.indexOf ||
        function (t) {
          for (var e = 0, r = this.length; r > e; e++)
            if (this[e] === t) return e;
          return -1;
        },
      rt =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      it = "[\\x20\\t\\r\\n\\f]",
      nt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      st = nt.replace("w", "w#"),
      at =
        "\\[" +
        it +
        "*(" +
        nt +
        ")" +
        it +
        "*(?:([*^$|!~]?=)" +
        it +
        "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" +
        st +
        ")|)|)" +
        it +
        "*\\]",
      ot =
        ":(" +
        nt +
        ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
        at.replace(3, 8) +
        ")*)|.*)\\)|)",
      lt = new RegExp(
        "^" + it + "+|((?:^|[^\\\\])(?:\\\\.)*)" + it + "+$",
        "g"
      ),
      ht = new RegExp("^" + it + "*," + it + "*"),
      pt = new RegExp("^" + it + "*([>+~]|" + it + ")" + it + "*"),
      ct = new RegExp("=" + it + "*([^\\]'\"]*?)" + it + "*\\]", "g"),
      ft = new RegExp(ot),
      ut = new RegExp("^" + st + "$"),
      dt = {
        ID: new RegExp("^#(" + nt + ")"),
        CLASS: new RegExp("^\\.(" + nt + ")"),
        TAG: new RegExp("^(" + nt.replace("w", "w*") + ")"),
        ATTR: new RegExp("^" + at),
        PSEUDO: new RegExp("^" + ot),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            it +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            it +
            "*(?:([+-]|)" +
            it +
            "*(\\d+)|))" +
            it +
            "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + rt + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            it +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            it +
            "*((?:-\\d)?\\d*)" +
            it +
            "*\\)|)(?=[^-]|$)",
          "i"
        ),
      },
      mt = /^(?:input|select|textarea|button)$/i,
      yt = /^h\d$/i,
      gt = /^[^{]+\{\s*\[native \w/,
      vt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      bt = /[+~]/,
      xt = /'|\\/g,
      Et = new RegExp("\\\\([\\da-f]{1,6}" + it + "?|(" + it + ")|.)", "ig"),
      wt = function (t, e, r) {
        var i = "0x" + e - 65536;
        return i !== i || r
          ? e
          : 0 > i
          ? String.fromCharCode(i + 65536)
          : String.fromCharCode((i >> 10) | 55296, (1023 & i) | 56320);
      };
    try {
      Z.apply((K = tt.call(H.childNodes)), H.childNodes),
        K[H.childNodes.length].nodeType;
    } catch (Pt) {
      Z = {
        apply: K.length
          ? function (t, e) {
              Q.apply(t, tt.call(e));
            }
          : function (t, e) {
              for (var r = t.length, i = 0; (t[r++] = e[i++]); );
              t.length = r - 1;
            },
      };
    }
    (P = e.support = {}),
      (k = e.isXML =
        function (t) {
          var e = t && (t.ownerDocument || t).documentElement;
          return e ? "HTML" !== e.nodeName : !1;
        }),
      (F = e.setDocument =
        function (t) {
          var e,
            r = t ? t.ownerDocument || t : H,
            i = r.defaultView;
          return r !== I && 9 === r.nodeType && r.documentElement
            ? ((I = r),
              (_ = r.documentElement),
              (N = !k(r)),
              i &&
                i !== i.top &&
                (i.addEventListener
                  ? i.addEventListener(
                      "unload",
                      function () {
                        F();
                      },
                      !1
                    )
                  : i.attachEvent &&
                    i.attachEvent("onunload", function () {
                      F();
                    })),
              (P.attributes = n(function (t) {
                return (t.className = "i"), !t.getAttribute("className");
              })),
              (P.getElementsByTagName = n(function (t) {
                return (
                  t.appendChild(r.createComment("")),
                  !t.getElementsByTagName("*").length
                );
              })),
              (P.getElementsByClassName =
                gt.test(r.getElementsByClassName) &&
                n(function (t) {
                  return (
                    (t.innerHTML =
                      "<div class='a'></div><div class='a i'></div>"),
                    (t.firstChild.className = "i"),
                    2 === t.getElementsByClassName("i").length
                  );
                })),
              (P.getById = n(function (t) {
                return (
                  (_.appendChild(t).id = j),
                  !r.getElementsByName || !r.getElementsByName(j).length
                );
              })),
              P.getById
                ? ((S.find.ID = function (t, e) {
                    if (typeof e.getElementById !== X && N) {
                      var r = e.getElementById(t);
                      return r && r.parentNode ? [r] : [];
                    }
                  }),
                  (S.filter.ID = function (t) {
                    var e = t.replace(Et, wt);
                    return function (t) {
                      return t.getAttribute("id") === e;
                    };
                  }))
                : (delete S.find.ID,
                  (S.filter.ID = function (t) {
                    var e = t.replace(Et, wt);
                    return function (t) {
                      var r =
                        typeof t.getAttributeNode !== X &&
                        t.getAttributeNode("id");
                      return r && r.value === e;
                    };
                  })),
              (S.find.TAG = P.getElementsByTagName
                ? function (t, e) {
                    return typeof e.getElementsByTagName !== X
                      ? e.getElementsByTagName(t)
                      : void 0;
                  }
                : function (t, e) {
                    var r,
                      i = [],
                      n = 0,
                      s = e.getElementsByTagName(t);
                    if ("*" === t) {
                      for (; (r = s[n++]); ) 1 === r.nodeType && i.push(r);
                      return i;
                    }
                    return s;
                  }),
              (S.find.CLASS =
                P.getElementsByClassName &&
                function (t, e) {
                  return typeof e.getElementsByClassName !== X && N
                    ? e.getElementsByClassName(t)
                    : void 0;
                }),
              (L = []),
              (B = []),
              (P.qsa = gt.test(r.querySelectorAll)) &&
                (n(function (t) {
                  (t.innerHTML =
                    "<select t=''><option selected=''></option></select>"),
                    t.querySelectorAll("[t^='']").length &&
                      B.push("[*^$]=" + it + "*(?:''|\"\")"),
                    t.querySelectorAll("[selected]").length ||
                      B.push("\\[" + it + "*(?:value|" + rt + ")"),
                    t.querySelectorAll(":checked").length || B.push(":checked");
                }),
                n(function (t) {
                  var e = r.createElement("input");
                  e.setAttribute("type", "hidden"),
                    t.appendChild(e).setAttribute("name", "D"),
                    t.querySelectorAll("[name=d]").length &&
                      B.push("name" + it + "*[*^$|!~]?="),
                    t.querySelectorAll(":enabled").length ||
                      B.push(":enabled", ":disabled"),
                    t.querySelectorAll("*,:x"),
                    B.push(",.*:");
                })),
              (P.matchesSelector = gt.test(
                (R =
                  _.webkitMatchesSelector ||
                  _.mozMatchesSelector ||
                  _.oMatchesSelector ||
                  _.msMatchesSelector)
              )) &&
                n(function (t) {
                  (P.disconnectedMatch = R.call(t, "div")),
                    R.call(t, "[s!='']:x"),
                    L.push("!=", ot);
                }),
              (B = B.length && new RegExp(B.join("|"))),
              (L = L.length && new RegExp(L.join("|"))),
              (e = gt.test(_.compareDocumentPosition)),
              (V =
                e || gt.test(_.contains)
                  ? function (t, e) {
                      var r = 9 === t.nodeType ? t.documentElement : t,
                        i = e && e.parentNode;
                      return (
                        t === i ||
                        !(
                          !i ||
                          1 !== i.nodeType ||
                          !(r.contains
                            ? r.contains(i)
                            : t.compareDocumentPosition &&
                              16 & t.compareDocumentPosition(i))
                        )
                      );
                    }
                  : function (t, e) {
                      if (e)
                        for (; (e = e.parentNode); ) if (e === t) return !0;
                      return !1;
                    }),
              ($ = e
                ? function (t, e) {
                    if (t === e) return (D = !0), 0;
                    var i =
                      !t.compareDocumentPosition - !e.compareDocumentPosition;
                    return i
                      ? i
                      : ((i =
                          (t.ownerDocument || t) === (e.ownerDocument || e)
                            ? t.compareDocumentPosition(e)
                            : 1),
                        1 & i ||
                        (!P.sortDetached && e.compareDocumentPosition(t) === i)
                          ? t === r || (t.ownerDocument === H && V(H, t))
                            ? -1
                            : e === r || (e.ownerDocument === H && V(H, e))
                            ? 1
                            : M
                            ? et.call(M, t) - et.call(M, e)
                            : 0
                          : 4 & i
                          ? -1
                          : 1);
                  }
                : function (t, e) {
                    if (t === e) return (D = !0), 0;
                    var i,
                      n = 0,
                      s = t.parentNode,
                      o = e.parentNode,
                      l = [t],
                      h = [e];
                    if (!s || !o)
                      return t === r
                        ? -1
                        : e === r
                        ? 1
                        : s
                        ? -1
                        : o
                        ? 1
                        : M
                        ? et.call(M, t) - et.call(M, e)
                        : 0;
                    if (s === o) return a(t, e);
                    for (i = t; (i = i.parentNode); ) l.unshift(i);
                    for (i = e; (i = i.parentNode); ) h.unshift(i);
                    for (; l[n] === h[n]; ) n++;
                    return n
                      ? a(l[n], h[n])
                      : l[n] === H
                      ? -1
                      : h[n] === H
                      ? 1
                      : 0;
                  }),
              r)
            : I;
        }),
      (e.matches = function (t, r) {
        return e(t, null, null, r);
      }),
      (e.matchesSelector = function (t, r) {
        if (
          ((t.ownerDocument || t) !== I && F(t),
          (r = r.replace(ct, "='$1']")),
          !(!P.matchesSelector || !N || (L && L.test(r)) || (B && B.test(r))))
        )
          try {
            var i = R.call(t, r);
            if (
              i ||
              P.disconnectedMatch ||
              (t.document && 11 !== t.document.nodeType)
            )
              return i;
          } catch (n) {}
        return e(r, I, null, [t]).length > 0;
      }),
      (e.contains = function (t, e) {
        return (t.ownerDocument || t) !== I && F(t), V(t, e);
      }),
      (e.attr = function (t, e) {
        (t.ownerDocument || t) !== I && F(t);
        var r = S.attrHandle[e.toLowerCase()],
          i = r && U.call(S.attrHandle, e.toLowerCase()) ? r(t, e, !N) : void 0;
        return void 0 !== i
          ? i
          : P.attributes || !N
          ? t.getAttribute(e)
          : (i = t.getAttributeNode(e)) && i.specified
          ? i.value
          : null;
      }),
      (e.error = function (t) {
        throw new Error("Syntax error, unrecognized expression: " + t);
      }),
      (e.uniqueSort = function (t) {
        var e,
          r = [],
          i = 0,
          n = 0;
        if (
          ((D = !P.detectDuplicates),
          (M = !P.sortStable && t.slice(0)),
          t.sort($),
          D)
        ) {
          for (; (e = t[n++]); ) e === t[n] && (i = r.push(n));
          for (; i--; ) t.splice(r[i], 1);
        }
        return (M = null), t;
      }),
      (C = e.getText =
        function (t) {
          var e,
            r = "",
            i = 0,
            n = t.nodeType;
          if (n) {
            if (1 === n || 9 === n || 11 === n) {
              if ("string" == typeof t.textContent) return t.textContent;
              for (t = t.firstChild; t; t = t.nextSibling) r += C(t);
            } else if (3 === n || 4 === n) return t.nodeValue;
          } else for (; (e = t[i++]); ) r += C(e);
          return r;
        }),
      (S = e.selectors =
        {
          cacheLength: 50,
          createPseudo: i,
          match: dt,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" },
          },
          preFilter: {
            ATTR: function (t) {
              return (
                (t[1] = t[1].replace(Et, wt)),
                (t[3] = (t[4] || t[5] || "").replace(Et, wt)),
                "~=" === t[2] && (t[3] = " " + t[3] + " "),
                t.slice(0, 4)
              );
            },
            CHILD: function (t) {
              return (
                (t[1] = t[1].toLowerCase()),
                "nth" === t[1].slice(0, 3)
                  ? (t[3] || e.error(t[0]),
                    (t[4] = +(t[4]
                      ? t[5] + (t[6] || 1)
                      : 2 * ("even" === t[3] || "odd" === t[3]))),
                    (t[5] = +(t[7] + t[8] || "odd" === t[3])))
                  : t[3] && e.error(t[0]),
                t
              );
            },
            PSEUDO: function (t) {
              var e,
                r = !t[5] && t[2];
              return dt.CHILD.test(t[0])
                ? null
                : (t[3] && void 0 !== t[4]
                    ? (t[2] = t[4])
                    : r &&
                      ft.test(r) &&
                      (e = f(r, !0)) &&
                      (e = r.indexOf(")", r.length - e) - r.length) &&
                      ((t[0] = t[0].slice(0, e)), (t[2] = r.slice(0, e))),
                  t.slice(0, 3));
            },
          },
          filter: {
            TAG: function (t) {
              var e = t.replace(Et, wt).toLowerCase();
              return "*" === t
                ? function () {
                    return !0;
                  }
                : function (t) {
                    return t.nodeName && t.nodeName.toLowerCase() === e;
                  };
            },
            CLASS: function (t) {
              var e = G[t + " "];
              return (
                e ||
                ((e = new RegExp("(^|" + it + ")" + t + "(" + it + "|$)")) &&
                  G(t, function (t) {
                    return e.test(
                      ("string" == typeof t.className && t.className) ||
                        (typeof t.getAttribute !== X &&
                          t.getAttribute("class")) ||
                        ""
                    );
                  }))
              );
            },
            ATTR: function (t, r, i) {
              return function (n) {
                var s = e.attr(n, t);
                return null == s
                  ? "!=" === r
                  : r
                  ? ((s += ""),
                    "=" === r
                      ? s === i
                      : "!=" === r
                      ? s !== i
                      : "^=" === r
                      ? i && 0 === s.indexOf(i)
                      : "*=" === r
                      ? i && s.indexOf(i) > -1
                      : "$=" === r
                      ? i && s.slice(-i.length) === i
                      : "~=" === r
                      ? (" " + s + " ").indexOf(i) > -1
                      : "|=" === r
                      ? s === i || s.slice(0, i.length + 1) === i + "-"
                      : !1)
                  : !0;
              };
            },
            CHILD: function (t, e, r, i, n) {
              var s = "nth" !== t.slice(0, 3),
                a = "last" !== t.slice(-4),
                o = "of-type" === e;
              return 1 === i && 0 === n
                ? function (t) {
                    return !!t.parentNode;
                  }
                : function (e, r, l) {
                    var h,
                      p,
                      c,
                      f,
                      u,
                      d,
                      m = s !== a ? "nextSibling" : "previousSibling",
                      y = e.parentNode,
                      g = o && e.nodeName.toLowerCase(),
                      v = !l && !o;
                    if (y) {
                      if (s) {
                        for (; m; ) {
                          for (c = e; (c = c[m]); )
                            if (
                              o
                                ? c.nodeName.toLowerCase() === g
                                : 1 === c.nodeType
                            )
                              return !1;
                          d = m = "only" === t && !d && "nextSibling";
                        }
                        return !0;
                      }
                      if (((d = [a ? y.firstChild : y.lastChild]), a && v)) {
                        for (
                          p = y[j] || (y[j] = {}),
                            h = p[t] || [],
                            u = h[0] === O && h[1],
                            f = h[0] === O && h[2],
                            c = u && y.childNodes[u];
                          (c = (++u && c && c[m]) || (f = u = 0) || d.pop());

                        )
                          if (1 === c.nodeType && ++f && c === e) {
                            p[t] = [O, u, f];
                            break;
                          }
                      } else if (
                        v &&
                        (h = (e[j] || (e[j] = {}))[t]) &&
                        h[0] === O
                      )
                        f = h[1];
                      else
                        for (
                          ;
                          (c = (++u && c && c[m]) || (f = u = 0) || d.pop()) &&
                          ((o
                            ? c.nodeName.toLowerCase() !== g
                            : 1 !== c.nodeType) ||
                            !++f ||
                            (v && ((c[j] || (c[j] = {}))[t] = [O, f]),
                            c !== e));

                        );
                      return (f -= n), f === i || (f % i === 0 && f / i >= 0);
                    }
                  };
            },
            PSEUDO: function (t, r) {
              var n,
                s =
                  S.pseudos[t] ||
                  S.setFilters[t.toLowerCase()] ||
                  e.error("unsupported pseudo: " + t);
              return s[j]
                ? s(r)
                : s.length > 1
                ? ((n = [t, t, "", r]),
                  S.setFilters.hasOwnProperty(t.toLowerCase())
                    ? i(function (t, e) {
                        for (var i, n = s(t, r), a = n.length; a--; )
                          (i = et.call(t, n[a])), (t[i] = !(e[i] = n[a]));
                      })
                    : function (t) {
                        return s(t, 0, n);
                      })
                : s;
            },
          },
          pseudos: {
            not: i(function (t) {
              var e = [],
                r = [],
                n = T(t.replace(lt, "$1"));
              return n[j]
                ? i(function (t, e, r, i) {
                    for (var s, a = n(t, null, i, []), o = t.length; o--; )
                      (s = a[o]) && (t[o] = !(e[o] = s));
                  })
                : function (t, i, s) {
                    return (e[0] = t), n(e, null, s, r), !r.pop();
                  };
            }),
            has: i(function (t) {
              return function (r) {
                return e(t, r).length > 0;
              };
            }),
            contains: i(function (t) {
              return function (e) {
                return (e.textContent || e.innerText || C(e)).indexOf(t) > -1;
              };
            }),
            lang: i(function (t) {
              return (
                ut.test(t || "") || e.error("unsupported lang: " + t),
                (t = t.replace(Et, wt).toLowerCase()),
                function (e) {
                  var r;
                  do
                    if (
                      (r = N
                        ? e.lang
                        : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                    )
                      return (
                        (r = r.toLowerCase()),
                        r === t || 0 === r.indexOf(t + "-")
                      );
                  while ((e = e.parentNode) && 1 === e.nodeType);
                  return !1;
                }
              );
            }),
            target: function (e) {
              var r = t.location && t.location.hash;
              return r && r.slice(1) === e.id;
            },
            root: function (t) {
              return t === _;
            },
            focus: function (t) {
              return (
                t === I.activeElement &&
                (!I.hasFocus || I.hasFocus()) &&
                !!(t.type || t.href || ~t.tabIndex)
              );
            },
            enabled: function (t) {
              return t.disabled === !1;
            },
            disabled: function (t) {
              return t.disabled === !0;
            },
            checked: function (t) {
              var e = t.nodeName.toLowerCase();
              return (
                ("input" === e && !!t.checked) ||
                ("option" === e && !!t.selected)
              );
            },
            selected: function (t) {
              return (
                t.parentNode && t.parentNode.selectedIndex, t.selected === !0
              );
            },
            empty: function (t) {
              for (t = t.firstChild; t; t = t.nextSibling)
                if (t.nodeType < 6) return !1;
              return !0;
            },
            parent: function (t) {
              return !S.pseudos.empty(t);
            },
            header: function (t) {
              return yt.test(t.nodeName);
            },
            input: function (t) {
              return mt.test(t.nodeName);
            },
            button: function (t) {
              var e = t.nodeName.toLowerCase();
              return ("input" === e && "button" === t.type) || "button" === e;
            },
            text: function (t) {
              var e;
              return (
                "input" === t.nodeName.toLowerCase() &&
                "text" === t.type &&
                (null == (e = t.getAttribute("type")) ||
                  "text" === e.toLowerCase())
              );
            },
            first: h(function () {
              return [0];
            }),
            last: h(function (t, e) {
              return [e - 1];
            }),
            eq: h(function (t, e, r) {
              return [0 > r ? r + e : r];
            }),
            even: h(function (t, e) {
              for (var r = 0; e > r; r += 2) t.push(r);
              return t;
            }),
            odd: h(function (t, e) {
              for (var r = 1; e > r; r += 2) t.push(r);
              return t;
            }),
            lt: h(function (t, e, r) {
              for (var i = 0 > r ? r + e : r; --i >= 0; ) t.push(i);
              return t;
            }),
            gt: h(function (t, e, r) {
              for (var i = 0 > r ? r + e : r; ++i < e; ) t.push(i);
              return t;
            }),
          },
        }),
      (S.pseudos.nth = S.pseudos.eq);
    for (w in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
      S.pseudos[w] = o(w);
    for (w in { submit: !0, reset: !0 }) S.pseudos[w] = l(w);
    return (
      (c.prototype = S.filters = S.pseudos),
      (S.setFilters = new c()),
      (T = e.compile =
        function (t, e) {
          var r,
            i = [],
            n = [],
            s = W[t + " "];
          if (!s) {
            for (e || (e = f(t)), r = e.length; r--; )
              (s = v(e[r])), s[j] ? i.push(s) : n.push(s);
            s = W(t, b(n, i));
          }
          return s;
        }),
      (P.sortStable = j.split("").sort($).join("") === j),
      (P.detectDuplicates = !!D),
      F(),
      (P.sortDetached = n(function (t) {
        return 1 & t.compareDocumentPosition(I.createElement("div"));
      })),
      n(function (t) {
        return (
          (t.innerHTML = "<a href='#'></a>"),
          "#" === t.firstChild.getAttribute("href")
        );
      }) ||
        s("type|href|height|width", function (t, e, r) {
          return r
            ? void 0
            : t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2);
        }),
      (P.attributes &&
        n(function (t) {
          return (
            (t.innerHTML = "<input/>"),
            t.firstChild.setAttribute("value", ""),
            "" === t.firstChild.getAttribute("value")
          );
        })) ||
        s("value", function (t, e, r) {
          return r || "input" !== t.nodeName.toLowerCase()
            ? void 0
            : t.defaultValue;
        }),
      n(function (t) {
        return null == t.getAttribute("disabled");
      }) ||
        s(rt, function (t, e, r) {
          var i;
          return r
            ? void 0
            : t[e] === !0
            ? e.toLowerCase()
            : (i = t.getAttributeNode(e)) && i.specified
            ? i.value
            : null;
        }),
      e
    );
  })(t);
  (st.find = pt),
    (st.expr = pt.selectors),
    (st.expr[":"] = st.expr.pseudos),
    (st.unique = pt.uniqueSort),
    (st.text = pt.getText),
    (st.isXMLDoc = pt.isXML),
    (st.contains = pt.contains);
  var ct = st.expr.match.needsContext,
    ft = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    ut = /^.[^:#\[\.,]*$/;
  (st.filter = function (t, e, r) {
    var i = e[0];
    return (
      r && (t = ":not(" + t + ")"),
      1 === e.length && 1 === i.nodeType
        ? st.find.matchesSelector(i, t)
          ? [i]
          : []
        : st.find.matches(
            t,
            st.grep(e, function (t) {
              return 1 === t.nodeType;
            })
          )
    );
  }),
    st.fn.extend({
      find: function (t) {
        var e,
          r = [],
          i = this,
          n = i.length;
        if ("string" != typeof t)
          return this.pushStack(
            st(t).filter(function () {
              for (e = 0; n > e; e++) if (st.contains(i[e], this)) return !0;
            })
          );
        for (e = 0; n > e; e++) st.find(t, i[e], r);
        return (
          (r = this.pushStack(n > 1 ? st.unique(r) : r)),
          (r.selector = this.selector ? this.selector + " " + t : t),
          r
        );
      },
      filter: function (t) {
        return this.pushStack(i(this, t || [], !1));
      },
      not: function (t) {
        return this.pushStack(i(this, t || [], !0));
      },
      is: function (t) {
        return !!i(
          this,
          "string" == typeof t && ct.test(t) ? st(t) : t || [],
          !1
        ).length;
      },
    });
  var dt,
    mt = t.document,
    yt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    gt = (st.fn.init = function (t, e) {
      var r, i;
      if (!t) return this;
      if ("string" == typeof t) {
        if (
          ((r =
            "<" === t.charAt(0) &&
            ">" === t.charAt(t.length - 1) &&
            t.length >= 3
              ? [null, t, null]
              : yt.exec(t)),
          !r || (!r[1] && e))
        )
          return !e || e.jquery
            ? (e || dt).find(t)
            : this.constructor(e).find(t);
        if (r[1]) {
          if (
            ((e = e instanceof st ? e[0] : e),
            st.merge(
              this,
              st.parseHTML(
                r[1],
                e && e.nodeType ? e.ownerDocument || e : mt,
                !0
              )
            ),
            ft.test(r[1]) && st.isPlainObject(e))
          )
            for (r in e)
              st.isFunction(this[r]) ? this[r](e[r]) : this.attr(r, e[r]);
          return this;
        }
        if (((i = mt.getElementById(r[2])), i && i.parentNode)) {
          if (i.id !== r[2]) return dt.find(t);
          (this.length = 1), (this[0] = i);
        }
        return (this.context = mt), (this.selector = t), this;
      }
      return t.nodeType
        ? ((this.context = this[0] = t), (this.length = 1), this)
        : st.isFunction(t)
        ? "undefined" != typeof dt.ready
          ? dt.ready(t)
          : t(st)
        : (void 0 !== t.selector &&
            ((this.selector = t.selector), (this.context = t.context)),
          st.makeArray(t, this));
    });
  (gt.prototype = st.fn), (dt = st(mt));
  var vt = /^(?:parents|prev(?:Until|All))/,
    bt = { children: !0, contents: !0, next: !0, prev: !0 };
  st.extend({
    dir: function (t, e, r) {
      for (
        var i = [], n = t[e];
        n &&
        9 !== n.nodeType &&
        (void 0 === r || 1 !== n.nodeType || !st(n).is(r));

      )
        1 === n.nodeType && i.push(n), (n = n[e]);
      return i;
    },
    sibling: function (t, e) {
      for (var r = []; t; t = t.nextSibling)
        1 === t.nodeType && t !== e && r.push(t);
      return r;
    },
  }),
    st.fn.extend({
      has: function (t) {
        var e,
          r = st(t, this),
          i = r.length;
        return this.filter(function () {
          for (e = 0; i > e; e++) if (st.contains(this, r[e])) return !0;
        });
      },
      closest: function (t, e) {
        for (
          var r,
            i = 0,
            n = this.length,
            s = [],
            a =
              ct.test(t) || "string" != typeof t ? st(t, e || this.context) : 0;
          n > i;
          i++
        )
          for (r = this[i]; r && r !== e; r = r.parentNode)
            if (
              r.nodeType < 11 &&
              (a
                ? a.index(r) > -1
                : 1 === r.nodeType && st.find.matchesSelector(r, t))
            ) {
              s.push(r);
              break;
            }
        return this.pushStack(s.length > 1 ? st.unique(s) : s);
      },
      index: function (t) {
        return t
          ? "string" == typeof t
            ? st.inArray(this[0], st(t))
            : st.inArray(t.jquery ? t[0] : t, this)
          : this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
      },
      add: function (t, e) {
        return this.pushStack(st.unique(st.merge(this.get(), st(t, e))));
      },
      addBack: function (t) {
        return this.add(
          null == t ? this.prevObject : this.prevObject.filter(t)
        );
      },
    }),
    st.each(
      {
        parent: function (t) {
          var e = t.parentNode;
          return e && 11 !== e.nodeType ? e : null;
        },
        parents: function (t) {
          return st.dir(t, "parentNode");
        },
        parentsUntil: function (t, e, r) {
          return st.dir(t, "parentNode", r);
        },
        next: function (t) {
          return n(t, "nextSibling");
        },
        prev: function (t) {
          return n(t, "previousSibling");
        },
        nextAll: function (t) {
          return st.dir(t, "nextSibling");
        },
        prevAll: function (t) {
          return st.dir(t, "previousSibling");
        },
        nextUntil: function (t, e, r) {
          return st.dir(t, "nextSibling", r);
        },
        prevUntil: function (t, e, r) {
          return st.dir(t, "previousSibling", r);
        },
        siblings: function (t) {
          return st.sibling((t.parentNode || {}).firstChild, t);
        },
        children: function (t) {
          return st.sibling(t.firstChild);
        },
        contents: function (t) {
          return st.nodeName(t, "iframe")
            ? t.contentDocument || t.contentWindow.document
            : st.merge([], t.childNodes);
        },
      },
      function (t, e) {
        st.fn[t] = function (r, i) {
          var n = st.map(this, e, r);
          return (
            "Until" !== t.slice(-5) && (i = r),
            i && "string" == typeof i && (n = st.filter(i, n)),
            this.length > 1 &&
              (bt[t] || (n = st.unique(n)), vt.test(t) && (n = n.reverse())),
            this.pushStack(n)
          );
        };
      }
    );
  var xt = /\S+/g,
    Et = {};
  (st.Callbacks = function (t) {
    t = "string" == typeof t ? Et[t] || s(t) : st.extend({}, t);
    var e,
      r,
      i,
      n,
      a,
      o,
      l = [],
      h = !t.once && [],
      p = function (s) {
        for (
          r = t.memory && s, i = !0, a = o || 0, o = 0, n = l.length, e = !0;
          l && n > a;
          a++
        )
          if (l[a].apply(s[0], s[1]) === !1 && t.stopOnFalse) {
            r = !1;
            break;
          }
        (e = !1),
          l && (h ? h.length && p(h.shift()) : r ? (l = []) : c.disable());
      },
      c = {
        add: function () {
          if (l) {
            var i = l.length;
            !(function s(e) {
              st.each(e, function (e, r) {
                var i = st.type(r);
                "function" === i
                  ? (t.unique && c.has(r)) || l.push(r)
                  : r && r.length && "string" !== i && s(r);
              });
            })(arguments),
              e ? (n = l.length) : r && ((o = i), p(r));
          }
          return this;
        },
        remove: function () {
          return (
            l &&
              st.each(arguments, function (t, r) {
                for (var i; (i = st.inArray(r, l, i)) > -1; )
                  l.splice(i, 1), e && (n >= i && n--, a >= i && a--);
              }),
            this
          );
        },
        has: function (t) {
          return t ? st.inArray(t, l) > -1 : !(!l || !l.length);
        },
        empty: function () {
          return (l = []), (n = 0), this;
        },
        disable: function () {
          return (l = h = r = void 0), this;
        },
        disabled: function () {
          return !l;
        },
        lock: function () {
          return (h = void 0), r || c.disable(), this;
        },
        locked: function () {
          return !h;
        },
        fireWith: function (t, r) {
          return (
            !l ||
              (i && !h) ||
              ((r = r || []),
              (r = [t, r.slice ? r.slice() : r]),
              e ? h.push(r) : p(r)),
            this
          );
        },
        fire: function () {
          return c.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!i;
        },
      };
    return c;
  }),
    st.extend({
      Deferred: function (t) {
        var e = [
            ["resolve", "done", st.Callbacks("once memory"), "resolved"],
            ["reject", "fail", st.Callbacks("once memory"), "rejected"],
            ["notify", "progress", st.Callbacks("memory")],
          ],
          r = "pending",
          i = {
            state: function () {
              return r;
            },
            always: function () {
              return n.done(arguments).fail(arguments), this;
            },
            then: function () {
              var t = arguments;
              return st
                .Deferred(function (r) {
                  st.each(e, function (e, s) {
                    var a = st.isFunction(t[e]) && t[e];
                    n[s[1]](function () {
                      var t = a && a.apply(this, arguments);
                      t && st.isFunction(t.promise)
                        ? t
                            .promise()
                            .done(r.resolve)
                            .fail(r.reject)
                            .progress(r.notify)
                        : r[s[0] + "With"](
                            this === i ? r.promise() : this,
                            a ? [t] : arguments
                          );
                    });
                  }),
                    (t = null);
                })
                .promise();
            },
            promise: function (t) {
              return null != t ? st.extend(t, i) : i;
            },
          },
          n = {};
        return (
          (i.pipe = i.then),
          st.each(e, function (t, s) {
            var a = s[2],
              o = s[3];
            (i[s[1]] = a.add),
              o &&
                a.add(
                  function () {
                    r = o;
                  },
                  e[1 ^ t][2].disable,
                  e[2][2].lock
                ),
              (n[s[0]] = function () {
                return n[s[0] + "With"](this === n ? i : this, arguments), this;
              }),
              (n[s[0] + "With"] = a.fireWith);
          }),
          i.promise(n),
          t && t.call(n, n),
          n
        );
      },
      when: function (t) {
        var e,
          r,
          i,
          n = 0,
          s = U.call(arguments),
          a = s.length,
          o = 1 !== a || (t && st.isFunction(t.promise)) ? a : 0,
          l = 1 === o ? t : st.Deferred(),
          h = function (t, r, i) {
            return function (n) {
              (r[t] = this),
                (i[t] = arguments.length > 1 ? U.call(arguments) : n),
                i === e ? l.notifyWith(r, i) : --o || l.resolveWith(r, i);
            };
          };
        if (a > 1)
          for (e = new Array(a), r = new Array(a), i = new Array(a); a > n; n++)
            s[n] && st.isFunction(s[n].promise)
              ? s[n]
                  .promise()
                  .done(h(n, i, s))
                  .fail(l.reject)
                  .progress(h(n, r, e))
              : --o;
        return o || l.resolveWith(i, s), l.promise();
      },
    });
  var wt;
  (st.fn.ready = function (t) {
    return st.ready.promise().done(t), this;
  }),
    st.extend({
      isReady: !1,
      readyWait: 1,
      holdReady: function (t) {
        t ? st.readyWait++ : st.ready(!0);
      },
      ready: function (t) {
        if (t === !0 ? !--st.readyWait : !st.isReady) {
          if (!mt.body) return setTimeout(st.ready);
          (st.isReady = !0),
            (t !== !0 && --st.readyWait > 0) ||
              (wt.resolveWith(mt, [st]),
              st.fn.trigger && st(mt).trigger("ready").off("ready"));
        }
      },
    }),
    (st.ready.promise = function (e) {
      if (!wt)
        if (((wt = st.Deferred()), "complete" === mt.readyState))
          setTimeout(st.ready);
        else if (mt.addEventListener)
          mt.addEventListener("DOMContentLoaded", o, !1),
            t.addEventListener("load", o, !1);
        else {
          mt.attachEvent("onreadystatechange", o), t.attachEvent("onload", o);
          var r = !1;
          try {
            r = null == t.frameElement && mt.documentElement;
          } catch (i) {}
          r &&
            r.doScroll &&
            !(function n() {
              if (!st.isReady) {
                try {
                  r.doScroll("left");
                } catch (t) {
                  return setTimeout(n, 50);
                }
                a(), st.ready();
              }
            })();
        }
      return wt.promise(e);
    });
  var Pt,
    St = "undefined";
  for (Pt in st(it)) break;
  (it.ownLast = "0" !== Pt),
    (it.inlineBlockNeedsLayout = !1),
    st(function () {
      var t,
        e,
        r = mt.getElementsByTagName("body")[0];
      r &&
        ((t = mt.createElement("div")),
        (t.style.cssText =
          "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px"),
        (e = mt.createElement("div")),
        r.appendChild(t).appendChild(e),
        typeof e.style.zoom !== St &&
          ((e.style.cssText =
            "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1"),
          (it.inlineBlockNeedsLayout = 3 === e.offsetWidth) &&
            (r.style.zoom = 1)),
        r.removeChild(t),
        (t = e = null));
    }),
    (function () {
      var t = mt.createElement("div");
      if (null == it.deleteExpando) {
        it.deleteExpando = !0;
        try {
          delete t.test;
        } catch (e) {
          it.deleteExpando = !1;
        }
      }
      t = null;
    })(),
    (st.acceptData = function (t) {
      var e = st.noData[(t.nodeName + " ").toLowerCase()],
        r = +t.nodeType || 1;
      return 1 !== r && 9 !== r
        ? !1
        : !e || (e !== !0 && t.getAttribute("classid") === e);
    });
  var Ct = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    kt = /([A-Z])/g;
  st.extend({
    cache: {},
    noData: {
      "applet ": !0,
      "embed ": !0,
      "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    },
    hasData: function (t) {
      return (
        (t = t.nodeType ? st.cache[t[st.expando]] : t[st.expando]), !!t && !h(t)
      );
    },
    data: function (t, e, r) {
      return p(t, e, r);
    },
    removeData: function (t, e) {
      return c(t, e);
    },
    _data: function (t, e, r) {
      return p(t, e, r, !0);
    },
    _removeData: function (t, e) {
      return c(t, e, !0);
    },
  }),
    st.fn.extend({
      data: function (t, e) {
        var r,
          i,
          n,
          s = this[0],
          a = s && s.attributes;
        if (void 0 === t) {
          if (
            this.length &&
            ((n = st.data(s)), 1 === s.nodeType && !st._data(s, "parsedAttrs"))
          ) {
            for (r = a.length; r--; )
              (i = a[r].name),
                0 === i.indexOf("data-") &&
                  ((i = st.camelCase(i.slice(5))), l(s, i, n[i]));
            st._data(s, "parsedAttrs", !0);
          }
          return n;
        }
        return "object" == typeof t
          ? this.each(function () {
              st.data(this, t);
            })
          : arguments.length > 1
          ? this.each(function () {
              st.data(this, t, e);
            })
          : s
          ? l(s, t, st.data(s, t))
          : void 0;
      },
      removeData: function (t) {
        return this.each(function () {
          st.removeData(this, t);
        });
      },
    }),
    st.extend({
      queue: function (t, e, r) {
        var i;
        return t
          ? ((e = (e || "fx") + "queue"),
            (i = st._data(t, e)),
            r &&
              (!i || st.isArray(r)
                ? (i = st._data(t, e, st.makeArray(r)))
                : i.push(r)),
            i || [])
          : void 0;
      },
      dequeue: function (t, e) {
        e = e || "fx";
        var r = st.queue(t, e),
          i = r.length,
          n = r.shift(),
          s = st._queueHooks(t, e),
          a = function () {
            st.dequeue(t, e);
          };
        "inprogress" === n && ((n = r.shift()), i--),
          n &&
            ("fx" === e && r.unshift("inprogress"),
            delete s.stop,
            n.call(t, a, s)),
          !i && s && s.empty.fire();
      },
      _queueHooks: function (t, e) {
        var r = e + "queueHooks";
        return (
          st._data(t, r) ||
          st._data(t, r, {
            empty: st.Callbacks("once memory").add(function () {
              st._removeData(t, e + "queue"), st._removeData(t, r);
            }),
          })
        );
      },
    }),
    st.fn.extend({
      queue: function (t, e) {
        var r = 2;
        return (
          "string" != typeof t && ((e = t), (t = "fx"), r--),
          arguments.length < r
            ? st.queue(this[0], t)
            : void 0 === e
            ? this
            : this.each(function () {
                var r = st.queue(this, t, e);
                st._queueHooks(this, t),
                  "fx" === t && "inprogress" !== r[0] && st.dequeue(this, t);
              })
        );
      },
      dequeue: function (t) {
        return this.each(function () {
          st.dequeue(this, t);
        });
      },
      clearQueue: function (t) {
        return this.queue(t || "fx", []);
      },
      promise: function (t, e) {
        var r,
          i = 1,
          n = st.Deferred(),
          s = this,
          a = this.length,
          o = function () {
            --i || n.resolveWith(s, [s]);
          };
        for (
          "string" != typeof t && ((e = t), (t = void 0)), t = t || "fx";
          a--;

        )
          (r = st._data(s[a], t + "queueHooks")),
            r && r.empty && (i++, r.empty.add(o));
        return o(), n.promise(e);
      },
    });
  var Tt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    At = ["Top", "Right", "Bottom", "Left"],
    Mt = function (t, e) {
      return (
        (t = e || t),
        "none" === st.css(t, "display") || !st.contains(t.ownerDocument, t)
      );
    },
    Dt = (st.access = function (t, e, r, i, n, s, a) {
      var o = 0,
        l = t.length,
        h = null == r;
      if ("object" === st.type(r)) {
        n = !0;
        for (o in r) st.access(t, e, o, r[o], !0, s, a);
      } else if (
        void 0 !== i &&
        ((n = !0),
        st.isFunction(i) || (a = !0),
        h &&
          (a
            ? (e.call(t, i), (e = null))
            : ((h = e),
              (e = function (t, e, r) {
                return h.call(st(t), r);
              }))),
        e)
      )
        for (; l > o; o++) e(t[o], r, a ? i : i.call(t[o], o, e(t[o], r)));
      return n ? t : h ? e.call(t) : l ? e(t[0], r) : s;
    }),
    Ft = /^(?:checkbox|radio)$/i;
  !(function () {
    var t = mt.createDocumentFragment(),
      e = mt.createElement("div"),
      r = mt.createElement("input");
    if (
      (e.setAttribute("className", "t"),
      (e.innerHTML = "  <link/><table></table><a href='/a'>a</a>"),
      (it.leadingWhitespace = 3 === e.firstChild.nodeType),
      (it.tbody = !e.getElementsByTagName("tbody").length),
      (it.htmlSerialize = !!e.getElementsByTagName("link").length),
      (it.html5Clone =
        "<:nav></:nav>" !== mt.createElement("nav").cloneNode(!0).outerHTML),
      (r.type = "checkbox"),
      (r.checked = !0),
      t.appendChild(r),
      (it.appendChecked = r.checked),
      (e.innerHTML = "<textarea>x</textarea>"),
      (it.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue),
      t.appendChild(e),
      (e.innerHTML = "<input type='radio' checked='checked' name='t'/>"),
      (it.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (it.noCloneEvent = !0),
      e.attachEvent &&
        (e.attachEvent("onclick", function () {
          it.noCloneEvent = !1;
        }),
        e.cloneNode(!0).click()),
      null == it.deleteExpando)
    ) {
      it.deleteExpando = !0;
      try {
        delete e.test;
      } catch (i) {
        it.deleteExpando = !1;
      }
    }
    t = e = r = null;
  })(),
    (function () {
      var e,
        r,
        i = mt.createElement("div");
      for (e in { submit: !0, change: !0, focusin: !0 })
        (r = "on" + e),
          (it[e + "Bubbles"] = r in t) ||
            (i.setAttribute(r, "t"),
            (it[e + "Bubbles"] = i.attributes[r].expando === !1));
      i = null;
    })();
  var It = /^(?:input|select|textarea)$/i,
    _t = /^key/,
    Nt = /^(?:mouse|contextmenu)|click/,
    Bt = /^(?:focusinfocus|focusoutblur)$/,
    Lt = /^([^.]*)(?:\.(.+)|)$/;
  (st.event = {
    global: {},
    add: function (t, e, r, i, n) {
      var s,
        a,
        o,
        l,
        h,
        p,
        c,
        f,
        u,
        d,
        m,
        y = st._data(t);
      if (y) {
        for (
          r.handler && ((l = r), (r = l.handler), (n = l.selector)),
            r.guid || (r.guid = st.guid++),
            (a = y.events) || (a = y.events = {}),
            (p = y.handle) ||
              ((p = y.handle =
                function (t) {
                  return typeof st === St ||
                    (t && st.event.triggered === t.type)
                    ? void 0
                    : st.event.dispatch.apply(p.elem, arguments);
                }),
              (p.elem = t)),
            e = (e || "").match(xt) || [""],
            o = e.length;
          o--;

        )
          (s = Lt.exec(e[o]) || []),
            (u = m = s[1]),
            (d = (s[2] || "").split(".").sort()),
            u &&
              ((h = st.event.special[u] || {}),
              (u = (n ? h.delegateType : h.bindType) || u),
              (h = st.event.special[u] || {}),
              (c = st.extend(
                {
                  type: u,
                  origType: m,
                  data: i,
                  handler: r,
                  guid: r.guid,
                  selector: n,
                  needsContext: n && st.expr.match.needsContext.test(n),
                  namespace: d.join("."),
                },
                l
              )),
              (f = a[u]) ||
                ((f = a[u] = []),
                (f.delegateCount = 0),
                (h.setup && h.setup.call(t, i, d, p) !== !1) ||
                  (t.addEventListener
                    ? t.addEventListener(u, p, !1)
                    : t.attachEvent && t.attachEvent("on" + u, p))),
              h.add &&
                (h.add.call(t, c), c.handler.guid || (c.handler.guid = r.guid)),
              n ? f.splice(f.delegateCount++, 0, c) : f.push(c),
              (st.event.global[u] = !0));
        t = null;
      }
    },
    remove: function (t, e, r, i, n) {
      var s,
        a,
        o,
        l,
        h,
        p,
        c,
        f,
        u,
        d,
        m,
        y = st.hasData(t) && st._data(t);
      if (y && (p = y.events)) {
        for (e = (e || "").match(xt) || [""], h = e.length; h--; )
          if (
            ((o = Lt.exec(e[h]) || []),
            (u = m = o[1]),
            (d = (o[2] || "").split(".").sort()),
            u)
          ) {
            for (
              c = st.event.special[u] || {},
                u = (i ? c.delegateType : c.bindType) || u,
                f = p[u] || [],
                o =
                  o[2] &&
                  new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                l = s = f.length;
              s--;

            )
              (a = f[s]),
                (!n && m !== a.origType) ||
                  (r && r.guid !== a.guid) ||
                  (o && !o.test(a.namespace)) ||
                  (i && i !== a.selector && ("**" !== i || !a.selector)) ||
                  (f.splice(s, 1),
                  a.selector && f.delegateCount--,
                  c.remove && c.remove.call(t, a));
            l &&
              !f.length &&
              ((c.teardown && c.teardown.call(t, d, y.handle) !== !1) ||
                st.removeEvent(t, u, y.handle),
              delete p[u]);
          } else for (u in p) st.event.remove(t, u + e[h], r, i, !0);
        st.isEmptyObject(p) && (delete y.handle, st._removeData(t, "events"));
      }
    },
    trigger: function (e, r, i, n) {
      var s,
        a,
        o,
        l,
        h,
        p,
        c,
        f = [i || mt],
        u = et.call(e, "type") ? e.type : e,
        d = et.call(e, "namespace") ? e.namespace.split(".") : [];
      if (
        ((o = p = i = i || mt),
        3 !== i.nodeType &&
          8 !== i.nodeType &&
          !Bt.test(u + st.event.triggered) &&
          (u.indexOf(".") >= 0 &&
            ((d = u.split(".")), (u = d.shift()), d.sort()),
          (a = u.indexOf(":") < 0 && "on" + u),
          (e = e[st.expando] ? e : new st.Event(u, "object" == typeof e && e)),
          (e.isTrigger = n ? 2 : 3),
          (e.namespace = d.join(".")),
          (e.namespace_re = e.namespace
            ? new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (e.result = void 0),
          e.target || (e.target = i),
          (r = null == r ? [e] : st.makeArray(r, [e])),
          (h = st.event.special[u] || {}),
          n || !h.trigger || h.trigger.apply(i, r) !== !1))
      ) {
        if (!n && !h.noBubble && !st.isWindow(i)) {
          for (
            l = h.delegateType || u, Bt.test(l + u) || (o = o.parentNode);
            o;
            o = o.parentNode
          )
            f.push(o), (p = o);
          p === (i.ownerDocument || mt) &&
            f.push(p.defaultView || p.parentWindow || t);
        }
        for (c = 0; (o = f[c++]) && !e.isPropagationStopped(); )
          (e.type = c > 1 ? l : h.bindType || u),
            (s =
              (st._data(o, "events") || {})[e.type] && st._data(o, "handle")),
            s && s.apply(o, r),
            (s = a && o[a]),
            s &&
              s.apply &&
              st.acceptData(o) &&
              ((e.result = s.apply(o, r)),
              e.result === !1 && e.preventDefault());
        if (
          ((e.type = u),
          !n &&
            !e.isDefaultPrevented() &&
            (!h._default || h._default.apply(f.pop(), r) === !1) &&
            st.acceptData(i) &&
            a &&
            i[u] &&
            !st.isWindow(i))
        ) {
          (p = i[a]), p && (i[a] = null), (st.event.triggered = u);
          try {
            i[u]();
          } catch (m) {}
          (st.event.triggered = void 0), p && (i[a] = p);
        }
        return e.result;
      }
    },
    dispatch: function (t) {
      t = st.event.fix(t);
      var e,
        r,
        i,
        n,
        s,
        a = [],
        o = U.call(arguments),
        l = (st._data(this, "events") || {})[t.type] || [],
        h = st.event.special[t.type] || {};
      if (
        ((o[0] = t),
        (t.delegateTarget = this),
        !h.preDispatch || h.preDispatch.call(this, t) !== !1)
      ) {
        for (
          a = st.event.handlers.call(this, t, l), e = 0;
          (n = a[e++]) && !t.isPropagationStopped();

        )
          for (
            t.currentTarget = n.elem, s = 0;
            (i = n.handlers[s++]) && !t.isImmediatePropagationStopped();

          )
            (!t.namespace_re || t.namespace_re.test(i.namespace)) &&
              ((t.handleObj = i),
              (t.data = i.data),
              (r = (
                (st.event.special[i.origType] || {}).handle || i.handler
              ).apply(n.elem, o)),
              void 0 !== r &&
                (t.result = r) === !1 &&
                (t.preventDefault(), t.stopPropagation()));
        return h.postDispatch && h.postDispatch.call(this, t), t.result;
      }
    },
    handlers: function (t, e) {
      var r,
        i,
        n,
        s,
        a = [],
        o = e.delegateCount,
        l = t.target;
      if (o && l.nodeType && (!t.button || "click" !== t.type))
        for (; l != this; l = l.parentNode || this)
          if (1 === l.nodeType && (l.disabled !== !0 || "click" !== t.type)) {
            for (n = [], s = 0; o > s; s++)
              (i = e[s]),
                (r = i.selector + " "),
                void 0 === n[r] &&
                  (n[r] = i.needsContext
                    ? st(r, this).index(l) >= 0
                    : st.find(r, this, null, [l]).length),
                n[r] && n.push(i);
            n.length && a.push({ elem: l, handlers: n });
          }
      return o < e.length && a.push({ elem: this, handlers: e.slice(o) }), a;
    },
    fix: function (t) {
      if (t[st.expando]) return t;
      var e,
        r,
        i,
        n = t.type,
        s = t,
        a = this.fixHooks[n];
      for (
        a ||
          (this.fixHooks[n] = a =
            Nt.test(n) ? this.mouseHooks : _t.test(n) ? this.keyHooks : {}),
          i = a.props ? this.props.concat(a.props) : this.props,
          t = new st.Event(s),
          e = i.length;
        e--;

      )
        (r = i[e]), (t[r] = s[r]);
      return (
        t.target || (t.target = s.srcElement || mt),
        3 === t.target.nodeType && (t.target = t.target.parentNode),
        (t.metaKey = !!t.metaKey),
        a.filter ? a.filter(t, s) : t
      );
    },
    props:
      "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
        " "
      ),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (t, e) {
        return (
          null == t.which &&
            (t.which = null != e.charCode ? e.charCode : e.keyCode),
          t
        );
      },
    },
    mouseHooks: {
      props:
        "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(
          " "
        ),
      filter: function (t, e) {
        var r,
          i,
          n,
          s = e.button,
          a = e.fromElement;
        return (
          null == t.pageX &&
            null != e.clientX &&
            ((i = t.target.ownerDocument || mt),
            (n = i.documentElement),
            (r = i.body),
            (t.pageX =
              e.clientX +
              ((n && n.scrollLeft) || (r && r.scrollLeft) || 0) -
              ((n && n.clientLeft) || (r && r.clientLeft) || 0)),
            (t.pageY =
              e.clientY +
              ((n && n.scrollTop) || (r && r.scrollTop) || 0) -
              ((n && n.clientTop) || (r && r.clientTop) || 0))),
          !t.relatedTarget &&
            a &&
            (t.relatedTarget = a === t.target ? e.toElement : a),
          t.which ||
            void 0 === s ||
            (t.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
          t
        );
      },
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function () {
          if (this !== d() && this.focus)
            try {
              return this.focus(), !1;
            } catch (t) {}
        },
        delegateType: "focusin",
      },
      blur: {
        trigger: function () {
          return this === d() && this.blur ? (this.blur(), !1) : void 0;
        },
        delegateType: "focusout",
      },
      click: {
        trigger: function () {
          return st.nodeName(this, "input") &&
            "checkbox" === this.type &&
            this.click
            ? (this.click(), !1)
            : void 0;
        },
        _default: function (t) {
          return st.nodeName(t.target, "a");
        },
      },
      beforeunload: {
        postDispatch: function (t) {
          void 0 !== t.result && (t.originalEvent.returnValue = t.result);
        },
      },
    },
    simulate: function (t, e, r, i) {
      var n = st.extend(new st.Event(), r, {
        type: t,
        isSimulated: !0,
        originalEvent: {},
      });
      i ? st.event.trigger(n, null, e) : st.event.dispatch.call(e, n),
        n.isDefaultPrevented() && r.preventDefault();
    },
  }),
    (st.removeEvent = mt.removeEventListener
      ? function (t, e, r) {
          t.removeEventListener && t.removeEventListener(e, r, !1);
        }
      : function (t, e, r) {
          var i = "on" + e;
          t.detachEvent &&
            (typeof t[i] === St && (t[i] = null), t.detachEvent(i, r));
        }),
    (st.Event = function (t, e) {
      return this instanceof st.Event
        ? (t && t.type
            ? ((this.originalEvent = t),
              (this.type = t.type),
              (this.isDefaultPrevented =
                t.defaultPrevented ||
                (void 0 === t.defaultPrevented &&
                  (t.returnValue === !1 ||
                    (t.getPreventDefault && t.getPreventDefault())))
                  ? f
                  : u))
            : (this.type = t),
          e && st.extend(this, e),
          (this.timeStamp = (t && t.timeStamp) || st.now()),
          void (this[st.expando] = !0))
        : new st.Event(t, e);
    }),
    (st.Event.prototype = {
      isDefaultPrevented: u,
      isPropagationStopped: u,
      isImmediatePropagationStopped: u,
      preventDefault: function () {
        var t = this.originalEvent;
        (this.isDefaultPrevented = f),
          t && (t.preventDefault ? t.preventDefault() : (t.returnValue = !1));
      },
      stopPropagation: function () {
        var t = this.originalEvent;
        (this.isPropagationStopped = f),
          t &&
            (t.stopPropagation && t.stopPropagation(), (t.cancelBubble = !0));
      },
      stopImmediatePropagation: function () {
        (this.isImmediatePropagationStopped = f), this.stopPropagation();
      },
    }),
    st.each(
      { mouseenter: "mouseover", mouseleave: "mouseout" },
      function (t, e) {
        st.event.special[t] = {
          delegateType: e,
          bindType: e,
          handle: function (t) {
            var r,
              i = this,
              n = t.relatedTarget,
              s = t.handleObj;
            return (
              (!n || (n !== i && !st.contains(i, n))) &&
                ((t.type = s.origType),
                (r = s.handler.apply(this, arguments)),
                (t.type = e)),
              r
            );
          },
        };
      }
    ),
    it.submitBubbles ||
      (st.event.special.submit = {
        setup: function () {
          return st.nodeName(this, "form")
            ? !1
            : void st.event.add(
                this,
                "click._submit keypress._submit",
                function (t) {
                  var e = t.target,
                    r =
                      st.nodeName(e, "input") || st.nodeName(e, "button")
                        ? e.form
                        : void 0;
                  r &&
                    !st._data(r, "submitBubbles") &&
                    (st.event.add(r, "submit._submit", function (t) {
                      t._submit_bubble = !0;
                    }),
                    st._data(r, "submitBubbles", !0));
                }
              );
        },
        postDispatch: function (t) {
          t._submit_bubble &&
            (delete t._submit_bubble,
            this.parentNode &&
              !t.isTrigger &&
              st.event.simulate("submit", this.parentNode, t, !0));
        },
        teardown: function () {
          return st.nodeName(this, "form")
            ? !1
            : void st.event.remove(this, "._submit");
        },
      }),
    it.changeBubbles ||
      (st.event.special.change = {
        setup: function () {
          return It.test(this.nodeName)
            ? (("checkbox" === this.type || "radio" === this.type) &&
                (st.event.add(this, "propertychange._change", function (t) {
                  "checked" === t.originalEvent.propertyName &&
                    (this._just_changed = !0);
                }),
                st.event.add(this, "click._change", function (t) {
                  this._just_changed &&
                    !t.isTrigger &&
                    (this._just_changed = !1),
                    st.event.simulate("change", this, t, !0);
                })),
              !1)
            : void st.event.add(this, "beforeactivate._change", function (t) {
                var e = t.target;
                It.test(e.nodeName) &&
                  !st._data(e, "changeBubbles") &&
                  (st.event.add(e, "change._change", function (t) {
                    !this.parentNode ||
                      t.isSimulated ||
                      t.isTrigger ||
                      st.event.simulate("change", this.parentNode, t, !0);
                  }),
                  st._data(e, "changeBubbles", !0));
              });
        },
        handle: function (t) {
          var e = t.target;
          return this !== e ||
            t.isSimulated ||
            t.isTrigger ||
            ("radio" !== e.type && "checkbox" !== e.type)
            ? t.handleObj.handler.apply(this, arguments)
            : void 0;
        },
        teardown: function () {
          return st.event.remove(this, "._change"), !It.test(this.nodeName);
        },
      }),
    it.focusinBubbles ||
      st.each({ focus: "focusin", blur: "focusout" }, function (t, e) {
        var r = function (t) {
          st.event.simulate(e, t.target, st.event.fix(t), !0);
        };
        st.event.special[e] = {
          setup: function () {
            var i = this.ownerDocument || this,
              n = st._data(i, e);
            n || i.addEventListener(t, r, !0), st._data(i, e, (n || 0) + 1);
          },
          teardown: function () {
            var i = this.ownerDocument || this,
              n = st._data(i, e) - 1;
            n
              ? st._data(i, e, n)
              : (i.removeEventListener(t, r, !0), st._removeData(i, e));
          },
        };
      }),
    st.fn.extend({
      on: function (t, e, r, i, n) {
        var s, a;
        if ("object" == typeof t) {
          "string" != typeof e && ((r = r || e), (e = void 0));
          for (s in t) this.on(s, e, r, t[s], n);
          return this;
        }
        if (
          (null == r && null == i
            ? ((i = e), (r = e = void 0))
            : null == i &&
              ("string" == typeof e
                ? ((i = r), (r = void 0))
                : ((i = r), (r = e), (e = void 0))),
          i === !1)
        )
          i = u;
        else if (!i) return this;
        return (
          1 === n &&
            ((a = i),
            (i = function (t) {
              return st().off(t), a.apply(this, arguments);
            }),
            (i.guid = a.guid || (a.guid = st.guid++))),
          this.each(function () {
            st.event.add(this, t, i, r, e);
          })
        );
      },
      one: function (t, e, r, i) {
        return this.on(t, e, r, i, 1);
      },
      off: function (t, e, r) {
        var i, n;
        if (t && t.preventDefault && t.handleObj)
          return (
            (i = t.handleObj),
            st(t.delegateTarget).off(
              i.namespace ? i.origType + "." + i.namespace : i.origType,
              i.selector,
              i.handler
            ),
            this
          );
        if ("object" == typeof t) {
          for (n in t) this.off(n, e, t[n]);
          return this;
        }
        return (
          (e === !1 || "function" == typeof e) && ((r = e), (e = void 0)),
          r === !1 && (r = u),
          this.each(function () {
            st.event.remove(this, t, r, e);
          })
        );
      },
      trigger: function (t, e) {
        return this.each(function () {
          st.event.trigger(t, e, this);
        });
      },
      triggerHandler: function (t, e) {
        var r = this[0];
        return r ? st.event.trigger(t, e, r, !0) : void 0;
      },
    });
  var Rt =
      "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    Vt = / jQuery\d+="(?:null|\d+)"/g,
    jt = new RegExp("<(?:" + Rt + ")[\\s/>]", "i"),
    Ht = /^\s+/,
    Ot =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    zt = /<([\w:]+)/,
    Gt = /<tbody/i,
    qt = /<|&#?\w+;/,
    Wt = /<(?:script|style|link)/i,
    $t = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Xt = /^$|\/(?:java|ecma)script/i,
    Yt = /^true\/(.*)/,
    Ut = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    Kt = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: it.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"],
    },
    Jt = m(mt),
    Qt = Jt.appendChild(mt.createElement("div"));
  (Kt.optgroup = Kt.option),
    (Kt.tbody = Kt.tfoot = Kt.colgroup = Kt.caption = Kt.thead),
    (Kt.th = Kt.td),
    st.extend({
      clone: function (t, e, r) {
        var i,
          n,
          s,
          a,
          o,
          l = st.contains(t.ownerDocument, t);
        if (
          (it.html5Clone || st.isXMLDoc(t) || !jt.test("<" + t.nodeName + ">")
            ? (s = t.cloneNode(!0))
            : ((Qt.innerHTML = t.outerHTML),
              Qt.removeChild((s = Qt.firstChild))),
          !(
            (it.noCloneEvent && it.noCloneChecked) ||
            (1 !== t.nodeType && 11 !== t.nodeType) ||
            st.isXMLDoc(t)
          ))
        )
          for (i = y(s), o = y(t), a = 0; null != (n = o[a]); ++a)
            i[a] && P(n, i[a]);
        if (e)
          if (r)
            for (o = o || y(t), i = i || y(s), a = 0; null != (n = o[a]); a++)
              w(n, i[a]);
          else w(t, s);
        return (
          (i = y(s, "script")),
          i.length > 0 && E(i, !l && y(t, "script")),
          (i = o = n = null),
          s
        );
      },
      buildFragment: function (t, e, r, i) {
        for (
          var n, s, a, o, l, h, p, c = t.length, f = m(e), u = [], d = 0;
          c > d;
          d++
        )
          if (((s = t[d]), s || 0 === s))
            if ("object" === st.type(s)) st.merge(u, s.nodeType ? [s] : s);
            else if (qt.test(s)) {
              for (
                o = o || f.appendChild(e.createElement("div")),
                  l = (zt.exec(s) || ["", ""])[1].toLowerCase(),
                  p = Kt[l] || Kt._default,
                  o.innerHTML = p[1] + s.replace(Ot, "<$1></$2>") + p[2],
                  n = p[0];
                n--;

              )
                o = o.lastChild;
              if (
                (!it.leadingWhitespace &&
                  Ht.test(s) &&
                  u.push(e.createTextNode(Ht.exec(s)[0])),
                !it.tbody)
              )
                for (
                  s =
                    "table" !== l || Gt.test(s)
                      ? "<table>" !== p[1] || Gt.test(s)
                        ? 0
                        : o
                      : o.firstChild,
                    n = s && s.childNodes.length;
                  n--;

                )
                  st.nodeName((h = s.childNodes[n]), "tbody") &&
                    !h.childNodes.length &&
                    s.removeChild(h);
              for (
                st.merge(u, o.childNodes), o.textContent = "";
                o.firstChild;

              )
                o.removeChild(o.firstChild);
              o = f.lastChild;
            } else u.push(e.createTextNode(s));
        for (
          o && f.removeChild(o),
            it.appendChecked || st.grep(y(u, "input"), g),
            d = 0;
          (s = u[d++]);

        )
          if (
            (!i || -1 === st.inArray(s, i)) &&
            ((a = st.contains(s.ownerDocument, s)),
            (o = y(f.appendChild(s), "script")),
            a && E(o),
            r)
          )
            for (n = 0; (s = o[n++]); ) Xt.test(s.type || "") && r.push(s);
        return (o = null), f;
      },
      cleanData: function (t, e) {
        for (
          var r,
            i,
            n,
            s,
            a = 0,
            o = st.expando,
            l = st.cache,
            h = it.deleteExpando,
            p = st.event.special;
          null != (r = t[a]);
          a++
        )
          if ((e || st.acceptData(r)) && ((n = r[o]), (s = n && l[n]))) {
            if (s.events)
              for (i in s.events)
                p[i] ? st.event.remove(r, i) : st.removeEvent(r, i, s.handle);
            l[n] &&
              (delete l[n],
              h
                ? delete r[o]
                : typeof r.removeAttribute !== St
                ? r.removeAttribute(o)
                : (r[o] = null),
              Y.push(n));
          }
      },
    }),
    st.fn.extend({
      text: function (t) {
        return Dt(
          this,
          function (t) {
            return void 0 === t
              ? st.text(this)
              : this.empty().append(
                  ((this[0] && this[0].ownerDocument) || mt).createTextNode(t)
                );
          },
          null,
          t,
          arguments.length
        );
      },
      append: function () {
        return this.domManip(arguments, function (t) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var e = v(this, t);
            e.appendChild(t);
          }
        });
      },
      prepend: function () {
        return this.domManip(arguments, function (t) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var e = v(this, t);
            e.insertBefore(t, e.firstChild);
          }
        });
      },
      before: function () {
        return this.domManip(arguments, function (t) {
          this.parentNode && this.parentNode.insertBefore(t, this);
        });
      },
      after: function () {
        return this.domManip(arguments, function (t) {
          this.parentNode && this.parentNode.insertBefore(t, this.nextSibling);
        });
      },
      remove: function (t, e) {
        for (
          var r, i = t ? st.filter(t, this) : this, n = 0;
          null != (r = i[n]);
          n++
        )
          e || 1 !== r.nodeType || st.cleanData(y(r)),
            r.parentNode &&
              (e && st.contains(r.ownerDocument, r) && E(y(r, "script")),
              r.parentNode.removeChild(r));
        return this;
      },
      empty: function () {
        for (var t, e = 0; null != (t = this[e]); e++) {
          for (1 === t.nodeType && st.cleanData(y(t, !1)); t.firstChild; )
            t.removeChild(t.firstChild);
          t.options && st.nodeName(t, "select") && (t.options.length = 0);
        }
        return this;
      },
      clone: function (t, e) {
        return (
          (t = null == t ? !1 : t),
          (e = null == e ? t : e),
          this.map(function () {
            return st.clone(this, t, e);
          })
        );
      },
      html: function (t) {
        return Dt(
          this,
          function (t) {
            var e = this[0] || {},
              r = 0,
              i = this.length;
            if (void 0 === t)
              return 1 === e.nodeType ? e.innerHTML.replace(Vt, "") : void 0;
            if (
              !(
                "string" != typeof t ||
                Wt.test(t) ||
                (!it.htmlSerialize && jt.test(t)) ||
                (!it.leadingWhitespace && Ht.test(t)) ||
                Kt[(zt.exec(t) || ["", ""])[1].toLowerCase()]
              )
            ) {
              t = t.replace(Ot, "<$1></$2>");
              try {
                for (; i > r; r++)
                  (e = this[r] || {}),
                    1 === e.nodeType &&
                      (st.cleanData(y(e, !1)), (e.innerHTML = t));
                e = 0;
              } catch (n) {}
            }
            e && this.empty().append(t);
          },
          null,
          t,
          arguments.length
        );
      },
      replaceWith: function () {
        var t = arguments[0];
        return (
          this.domManip(arguments, function (e) {
            (t = this.parentNode),
              st.cleanData(y(this)),
              t && t.replaceChild(e, this);
          }),
          t && (t.length || t.nodeType) ? this : this.remove()
        );
      },
      detach: function (t) {
        return this.remove(t, !0);
      },
      domManip: function (t, e) {
        t = K.apply([], t);
        var r,
          i,
          n,
          s,
          a,
          o,
          l = 0,
          h = this.length,
          p = this,
          c = h - 1,
          f = t[0],
          u = st.isFunction(f);
        if (
          u ||
          (h > 1 && "string" == typeof f && !it.checkClone && $t.test(f))
        )
          return this.each(function (r) {
            var i = p.eq(r);
            u && (t[0] = f.call(this, r, i.html())), i.domManip(t, e);
          });
        if (
          h &&
          ((o = st.buildFragment(t, this[0].ownerDocument, !1, this)),
          (r = o.firstChild),
          1 === o.childNodes.length && (o = r),
          r)
        ) {
          for (s = st.map(y(o, "script"), b), n = s.length; h > l; l++)
            (i = o),
              l !== c &&
                ((i = st.clone(i, !0, !0)), n && st.merge(s, y(i, "script"))),
              e.call(this[l], i, l);
          if (n)
            for (
              a = s[s.length - 1].ownerDocument, st.map(s, x), l = 0;
              n > l;
              l++
            )
              (i = s[l]),
                Xt.test(i.type || "") &&
                  !st._data(i, "globalEval") &&
                  st.contains(a, i) &&
                  (i.src
                    ? st._evalUrl && st._evalUrl(i.src)
                    : st.globalEval(
                        (i.text || i.textContent || i.innerHTML || "").replace(
                          Ut,
                          ""
                        )
                      ));
          o = r = null;
        }
        return this;
      },
    }),
    st.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (t, e) {
        st.fn[t] = function (t) {
          for (var r, i = 0, n = [], s = st(t), a = s.length - 1; a >= i; i++)
            (r = i === a ? this : this.clone(!0)),
              st(s[i])[e](r),
              J.apply(n, r.get());
          return this.pushStack(n);
        };
      }
    );
  var Zt,
    te = {};
  !(function () {
    var t,
      e,
      r = mt.createElement("div"),
      i =
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
    (r.innerHTML =
      "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
      (t = r.getElementsByTagName("a")[0]),
      (t.style.cssText = "float:left;opacity:.5"),
      (it.opacity = /^0.5/.test(t.style.opacity)),
      (it.cssFloat = !!t.style.cssFloat),
      (r.style.backgroundClip = "content-box"),
      (r.cloneNode(!0).style.backgroundClip = ""),
      (it.clearCloneStyle = "content-box" === r.style.backgroundClip),
      (t = r = null),
      (it.shrinkWrapBlocks = function () {
        var t, r, n, s;
        if (null == e) {
          if (((t = mt.getElementsByTagName("body")[0]), !t)) return;
          (s =
            "border:0;width:0;height:0;position:absolute;top:0;left:-9999px"),
            (r = mt.createElement("div")),
            (n = mt.createElement("div")),
            t.appendChild(r).appendChild(n),
            (e = !1),
            typeof n.style.zoom !== St &&
              ((n.style.cssText = i + ";width:1px;padding:1px;zoom:1"),
              (n.innerHTML = "<div></div>"),
              (n.firstChild.style.width = "5px"),
              (e = 3 !== n.offsetWidth)),
            t.removeChild(r),
            (t = r = n = null);
        }
        return e;
      });
  })();
  var ee,
    re,
    ie = /^margin/,
    ne = new RegExp("^(" + Tt + ")(?!px)[a-z%]+$", "i"),
    se = /^(top|right|bottom|left)$/;
  t.getComputedStyle
    ? ((ee = function (t) {
        return t.ownerDocument.defaultView.getComputedStyle(t, null);
      }),
      (re = function (t, e, r) {
        var i,
          n,
          s,
          a,
          o = t.style;
        return (
          (r = r || ee(t)),
          (a = r ? r.getPropertyValue(e) || r[e] : void 0),
          r &&
            ("" !== a ||
              st.contains(t.ownerDocument, t) ||
              (a = st.style(t, e)),
            ne.test(a) &&
              ie.test(e) &&
              ((i = o.width),
              (n = o.minWidth),
              (s = o.maxWidth),
              (o.minWidth = o.maxWidth = o.width = a),
              (a = r.width),
              (o.width = i),
              (o.minWidth = n),
              (o.maxWidth = s))),
          void 0 === a ? a : a + ""
        );
      }))
    : mt.documentElement.currentStyle &&
      ((ee = function (t) {
        return t.currentStyle;
      }),
      (re = function (t, e, r) {
        var i,
          n,
          s,
          a,
          o = t.style;
        return (
          (r = r || ee(t)),
          (a = r ? r[e] : void 0),
          null == a && o && o[e] && (a = o[e]),
          ne.test(a) &&
            !se.test(e) &&
            ((i = o.left),
            (n = t.runtimeStyle),
            (s = n && n.left),
            s && (n.left = t.currentStyle.left),
            (o.left = "fontSize" === e ? "1em" : a),
            (a = o.pixelLeft + "px"),
            (o.left = i),
            s && (n.left = s)),
          void 0 === a ? a : a + "" || "auto"
        );
      })),
    !(function () {
      function e() {
        var e,
          r,
          i = mt.getElementsByTagName("body")[0];
        i &&
          ((e = mt.createElement("div")),
          (r = mt.createElement("div")),
          (e.style.cssText = h),
          i.appendChild(e).appendChild(r),
          (r.style.cssText =
            "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%"),
          st.swap(i, null != i.style.zoom ? { zoom: 1 } : {}, function () {
            n = 4 === r.offsetWidth;
          }),
          (s = !0),
          (a = !1),
          (o = !0),
          t.getComputedStyle &&
            ((a = "1%" !== (t.getComputedStyle(r, null) || {}).top),
            (s =
              "4px" ===
              (t.getComputedStyle(r, null) || { width: "4px" }).width)),
          i.removeChild(e),
          (r = i = null));
      }
      var r,
        i,
        n,
        s,
        a,
        o,
        l = mt.createElement("div"),
        h = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
        p =
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
      (l.innerHTML =
        "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
        (r = l.getElementsByTagName("a")[0]),
        (r.style.cssText = "float:left;opacity:.5"),
        (it.opacity = /^0.5/.test(r.style.opacity)),
        (it.cssFloat = !!r.style.cssFloat),
        (l.style.backgroundClip = "content-box"),
        (l.cloneNode(!0).style.backgroundClip = ""),
        (it.clearCloneStyle = "content-box" === l.style.backgroundClip),
        (r = l = null),
        st.extend(it, {
          reliableHiddenOffsets: function () {
            if (null != i) return i;
            var t,
              e,
              r,
              n = mt.createElement("div"),
              s = mt.getElementsByTagName("body")[0];
            return s
              ? (n.setAttribute("className", "t"),
                (n.innerHTML =
                  "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
                (t = mt.createElement("div")),
                (t.style.cssText = h),
                s.appendChild(t).appendChild(n),
                (n.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
                (e = n.getElementsByTagName("td")),
                (e[0].style.cssText =
                  "padding:0;margin:0;border:0;display:none"),
                (r = 0 === e[0].offsetHeight),
                (e[0].style.display = ""),
                (e[1].style.display = "none"),
                (i = r && 0 === e[0].offsetHeight),
                s.removeChild(t),
                (n = s = null),
                i)
              : void 0;
          },
          boxSizing: function () {
            return null == n && e(), n;
          },
          boxSizingReliable: function () {
            return null == s && e(), s;
          },
          pixelPosition: function () {
            return null == a && e(), a;
          },
          reliableMarginRight: function () {
            var e, r, i, n;
            if (null == o && t.getComputedStyle) {
              if (((e = mt.getElementsByTagName("body")[0]), !e)) return;
              (r = mt.createElement("div")),
                (i = mt.createElement("div")),
                (r.style.cssText = h),
                e.appendChild(r).appendChild(i),
                (n = i.appendChild(mt.createElement("div"))),
                (n.style.cssText = i.style.cssText = p),
                (n.style.marginRight = n.style.width = "0"),
                (i.style.width = "1px"),
                (o = !parseFloat(
                  (t.getComputedStyle(n, null) || {}).marginRight
                )),
                e.removeChild(r);
            }
            return o;
          },
        });
    })(),
    (st.swap = function (t, e, r, i) {
      var n,
        s,
        a = {};
      for (s in e) (a[s] = t.style[s]), (t.style[s] = e[s]);
      n = r.apply(t, i || []);
      for (s in e) t.style[s] = a[s];
      return n;
    });
  var ae = /alpha\([^)]*\)/i,
    oe = /opacity\s*=\s*([^)]*)/,
    le = /^(none|table(?!-c[ea]).+)/,
    he = new RegExp("^(" + Tt + ")(.*)$", "i"),
    pe = new RegExp("^([+-])=(" + Tt + ")", "i"),
    ce = { position: "absolute", visibility: "hidden", display: "block" },
    fe = { letterSpacing: 0, fontWeight: 400 },
    ue = ["Webkit", "O", "Moz", "ms"];
  st.extend({
    cssHooks: {
      opacity: {
        get: function (t, e) {
          if (e) {
            var r = re(t, "opacity");
            return "" === r ? "1" : r;
          }
        },
      },
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: { float: it.cssFloat ? "cssFloat" : "styleFloat" },
    style: function (t, e, r, i) {
      if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
        var n,
          s,
          a,
          o = st.camelCase(e),
          l = t.style;
        if (
          ((e = st.cssProps[o] || (st.cssProps[o] = T(l, o))),
          (a = st.cssHooks[e] || st.cssHooks[o]),
          void 0 === r)
        )
          return a && "get" in a && void 0 !== (n = a.get(t, !1, i)) ? n : l[e];
        if (
          ((s = typeof r),
          "string" === s &&
            (n = pe.exec(r)) &&
            ((r = (n[1] + 1) * n[2] + parseFloat(st.css(t, e))),
            (s = "number")),
          null != r &&
            r === r &&
            ("number" !== s || st.cssNumber[o] || (r += "px"),
            it.clearCloneStyle ||
              "" !== r ||
              0 !== e.indexOf("background") ||
              (l[e] = "inherit"),
            !(a && "set" in a && void 0 === (r = a.set(t, r, i)))))
        )
          try {
            (l[e] = ""), (l[e] = r);
          } catch (h) {}
      }
    },
    css: function (t, e, r, i) {
      var n,
        s,
        a,
        o = st.camelCase(e);
      return (
        (e = st.cssProps[o] || (st.cssProps[o] = T(t.style, o))),
        (a = st.cssHooks[e] || st.cssHooks[o]),
        a && "get" in a && (s = a.get(t, !0, r)),
        void 0 === s && (s = re(t, e, i)),
        "normal" === s && e in fe && (s = fe[e]),
        "" === r || r
          ? ((n = parseFloat(s)), r === !0 || st.isNumeric(n) ? n || 0 : s)
          : s
      );
    },
  }),
    st.each(["height", "width"], function (t, e) {
      st.cssHooks[e] = {
        get: function (t, r, i) {
          return r
            ? 0 === t.offsetWidth && le.test(st.css(t, "display"))
              ? st.swap(t, ce, function () {
                  return F(t, e, i);
                })
              : F(t, e, i)
            : void 0;
        },
        set: function (t, r, i) {
          var n = i && ee(t);
          return M(
            t,
            r,
            i
              ? D(
                  t,
                  e,
                  i,
                  it.boxSizing() &&
                    "border-box" === st.css(t, "boxSizing", !1, n),
                  n
                )
              : 0
          );
        },
      };
    }),
    it.opacity ||
      (st.cssHooks.opacity = {
        get: function (t, e) {
          return oe.test(
            (e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || ""
          )
            ? 0.01 * parseFloat(RegExp.$1) + ""
            : e
            ? "1"
            : "";
        },
        set: function (t, e) {
          var r = t.style,
            i = t.currentStyle,
            n = st.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
            s = (i && i.filter) || r.filter || "";
          (r.zoom = 1),
            ((e >= 1 || "" === e) &&
              "" === st.trim(s.replace(ae, "")) &&
              r.removeAttribute &&
              (r.removeAttribute("filter"), "" === e || (i && !i.filter))) ||
              (r.filter = ae.test(s) ? s.replace(ae, n) : s + " " + n);
        },
      }),
    (st.cssHooks.marginRight = k(it.reliableMarginRight, function (t, e) {
      return e
        ? st.swap(t, { display: "inline-block" }, re, [t, "marginRight"])
        : void 0;
    })),
    st.each({ margin: "", padding: "", border: "Width" }, function (t, e) {
      (st.cssHooks[t + e] = {
        expand: function (r) {
          for (
            var i = 0, n = {}, s = "string" == typeof r ? r.split(" ") : [r];
            4 > i;
            i++
          )
            n[t + At[i] + e] = s[i] || s[i - 2] || s[0];
          return n;
        },
      }),
        ie.test(t) || (st.cssHooks[t + e].set = M);
    }),
    st.fn.extend({
      css: function (t, e) {
        return Dt(
          this,
          function (t, e, r) {
            var i,
              n,
              s = {},
              a = 0;
            if (st.isArray(e)) {
              for (i = ee(t), n = e.length; n > a; a++)
                s[e[a]] = st.css(t, e[a], !1, i);
              return s;
            }
            return void 0 !== r ? st.style(t, e, r) : st.css(t, e);
          },
          t,
          e,
          arguments.length > 1
        );
      },
      show: function () {
        return A(this, !0);
      },
      hide: function () {
        return A(this);
      },
      toggle: function (t) {
        return "boolean" == typeof t
          ? t
            ? this.show()
            : this.hide()
          : this.each(function () {
              Mt(this) ? st(this).show() : st(this).hide();
            });
      },
    }),
    (st.Tween = I),
    (I.prototype = {
      constructor: I,
      init: function (t, e, r, i, n, s) {
        (this.elem = t),
          (this.prop = r),
          (this.easing = n || "swing"),
          (this.options = e),
          (this.start = this.now = this.cur()),
          (this.end = i),
          (this.unit = s || (st.cssNumber[r] ? "" : "px"));
      },
      cur: function () {
        var t = I.propHooks[this.prop];
        return t && t.get ? t.get(this) : I.propHooks._default.get(this);
      },
      run: function (t) {
        var e,
          r = I.propHooks[this.prop];
        return (
          (this.pos = e =
            this.options.duration
              ? st.easing[this.easing](
                  t,
                  this.options.duration * t,
                  0,
                  1,
                  this.options.duration
                )
              : t),
          (this.now = (this.end - this.start) * e + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          r && r.set ? r.set(this) : I.propHooks._default.set(this),
          this
        );
      },
    }),
    (I.prototype.init.prototype = I.prototype),
    (I.propHooks = {
      _default: {
        get: function (t) {
          var e;
          return null == t.elem[t.prop] ||
            (t.elem.style && null != t.elem.style[t.prop])
            ? ((e = st.css(t.elem, t.prop, "")), e && "auto" !== e ? e : 0)
            : t.elem[t.prop];
        },
        set: function (t) {
          st.fx.step[t.prop]
            ? st.fx.step[t.prop](t)
            : t.elem.style &&
              (null != t.elem.style[st.cssProps[t.prop]] || st.cssHooks[t.prop])
            ? st.style(t.elem, t.prop, t.now + t.unit)
            : (t.elem[t.prop] = t.now);
        },
      },
    }),
    (I.propHooks.scrollTop = I.propHooks.scrollLeft =
      {
        set: function (t) {
          t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now);
        },
      }),
    (st.easing = {
      linear: function (t) {
        return t;
      },
      swing: function (t) {
        return 0.5 - Math.cos(t * Math.PI) / 2;
      },
    }),
    (st.fx = I.prototype.init),
    (st.fx.step = {});
  var de,
    me,
    ye = /^(?:toggle|show|hide)$/,
    ge = new RegExp("^(?:([+-])=|)(" + Tt + ")([a-z%]*)$", "i"),
    ve = /queueHooks$/,
    be = [L],
    xe = {
      "*": [
        function (t, e) {
          var r = this.createTween(t, e),
            i = r.cur(),
            n = ge.exec(e),
            s = (n && n[3]) || (st.cssNumber[t] ? "" : "px"),
            a =
              (st.cssNumber[t] || ("px" !== s && +i)) &&
              ge.exec(st.css(r.elem, t)),
            o = 1,
            l = 20;
          if (a && a[3] !== s) {
            (s = s || a[3]), (n = n || []), (a = +i || 1);
            do (o = o || ".5"), (a /= o), st.style(r.elem, t, a + s);
            while (o !== (o = r.cur() / i) && 1 !== o && --l);
          }
          return (
            n &&
              ((a = r.start = +a || +i || 0),
              (r.unit = s),
              (r.end = n[1] ? a + (n[1] + 1) * n[2] : +n[2])),
            r
          );
        },
      ],
    };
  (st.Animation = st.extend(V, {
    tweener: function (t, e) {
      st.isFunction(t) ? ((e = t), (t = ["*"])) : (t = t.split(" "));
      for (var r, i = 0, n = t.length; n > i; i++)
        (r = t[i]), (xe[r] = xe[r] || []), xe[r].unshift(e);
    },
    prefilter: function (t, e) {
      e ? be.unshift(t) : be.push(t);
    },
  })),
    (st.speed = function (t, e, r) {
      var i =
        t && "object" == typeof t
          ? st.extend({}, t)
          : {
              complete: r || (!r && e) || (st.isFunction(t) && t),
              duration: t,
              easing: (r && e) || (e && !st.isFunction(e) && e),
            };
      return (
        (i.duration = st.fx.off
          ? 0
          : "number" == typeof i.duration
          ? i.duration
          : i.duration in st.fx.speeds
          ? st.fx.speeds[i.duration]
          : st.fx.speeds._default),
        (null == i.queue || i.queue === !0) && (i.queue = "fx"),
        (i.old = i.complete),
        (i.complete = function () {
          st.isFunction(i.old) && i.old.call(this),
            i.queue && st.dequeue(this, i.queue);
        }),
        i
      );
    }),
    st.fn.extend({
      fadeTo: function (t, e, r, i) {
        return this.filter(Mt)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: e }, t, r, i);
      },
      animate: function (t, e, r, i) {
        var n = st.isEmptyObject(t),
          s = st.speed(e, r, i),
          a = function () {
            var e = V(this, st.extend({}, t), s);
            (n || st._data(this, "finish")) && e.stop(!0);
          };
        return (
          (a.finish = a),
          n || s.queue === !1 ? this.each(a) : this.queue(s.queue, a)
        );
      },
      stop: function (t, e, r) {
        var i = function (t) {
          var e = t.stop;
          delete t.stop, e(r);
        };
        return (
          "string" != typeof t && ((r = e), (e = t), (t = void 0)),
          e && t !== !1 && this.queue(t || "fx", []),
          this.each(function () {
            var e = !0,
              n = null != t && t + "queueHooks",
              s = st.timers,
              a = st._data(this);
            if (n) a[n] && a[n].stop && i(a[n]);
            else for (n in a) a[n] && a[n].stop && ve.test(n) && i(a[n]);
            for (n = s.length; n--; )
              s[n].elem !== this ||
                (null != t && s[n].queue !== t) ||
                (s[n].anim.stop(r), (e = !1), s.splice(n, 1));
            (e || !r) && st.dequeue(this, t);
          })
        );
      },
      finish: function (t) {
        return (
          t !== !1 && (t = t || "fx"),
          this.each(function () {
            var e,
              r = st._data(this),
              i = r[t + "queue"],
              n = r[t + "queueHooks"],
              s = st.timers,
              a = i ? i.length : 0;
            for (
              r.finish = !0,
                st.queue(this, t, []),
                n && n.stop && n.stop.call(this, !0),
                e = s.length;
              e--;

            )
              s[e].elem === this &&
                s[e].queue === t &&
                (s[e].anim.stop(!0), s.splice(e, 1));
            for (e = 0; a > e; e++)
              i[e] && i[e].finish && i[e].finish.call(this);
            delete r.finish;
          })
        );
      },
    }),
    st.each(["toggle", "show", "hide"], function (t, e) {
      var r = st.fn[e];
      st.fn[e] = function (t, i, n) {
        return null == t || "boolean" == typeof t
          ? r.apply(this, arguments)
          : this.animate(N(e, !0), t, i, n);
      };
    }),
    st.each(
      {
        slideDown: N("show"),
        slideUp: N("hide"),
        slideToggle: N("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (t, e) {
        st.fn[t] = function (t, r, i) {
          return this.animate(e, t, r, i);
        };
      }
    ),
    (st.timers = []),
    (st.fx.tick = function () {
      var t,
        e = st.timers,
        r = 0;
      for (de = st.now(); r < e.length; r++)
        (t = e[r]), t() || e[r] !== t || e.splice(r--, 1);
      e.length || st.fx.stop(), (de = void 0);
    }),
    (st.fx.timer = function (t) {
      st.timers.push(t), t() ? st.fx.start() : st.timers.pop();
    }),
    (st.fx.interval = 13),
    (st.fx.start = function () {
      me || (me = setInterval(st.fx.tick, st.fx.interval));
    }),
    (st.fx.stop = function () {
      clearInterval(me), (me = null);
    }),
    (st.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (st.fn.delay = function (t, e) {
      return (
        (t = st.fx ? st.fx.speeds[t] || t : t),
        (e = e || "fx"),
        this.queue(e, function (e, r) {
          var i = setTimeout(e, t);
          r.stop = function () {
            clearTimeout(i);
          };
        })
      );
    }),
    (function () {
      var t,
        e,
        r,
        i,
        n = mt.createElement("div");
      n.setAttribute("className", "t"),
        (n.innerHTML =
          "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
        (t = n.getElementsByTagName("a")[0]),
        (r = mt.createElement("select")),
        (i = r.appendChild(mt.createElement("option"))),
        (e = n.getElementsByTagName("input")[0]),
        (t.style.cssText = "top:1px"),
        (it.getSetAttribute = "t" !== n.className),
        (it.style = /top/.test(t.getAttribute("style"))),
        (it.hrefNormalized = "/a" === t.getAttribute("href")),
        (it.checkOn = !!e.value),
        (it.optSelected = i.selected),
        (it.enctype = !!mt.createElement("form").enctype),
        (r.disabled = !0),
        (it.optDisabled = !i.disabled),
        (e = mt.createElement("input")),
        e.setAttribute("value", ""),
        (it.input = "" === e.getAttribute("value")),
        (e.value = "t"),
        e.setAttribute("type", "radio"),
        (it.radioValue = "t" === e.value),
        (t = e = r = i = n = null);
    })();
  var Ee = /\r/g;
  st.fn.extend({
    val: function (t) {
      var e,
        r,
        i,
        n = this[0];
      return arguments.length
        ? ((i = st.isFunction(t)),
          this.each(function (r) {
            var n;
            1 === this.nodeType &&
              ((n = i ? t.call(this, r, st(this).val()) : t),
              null == n
                ? (n = "")
                : "number" == typeof n
                ? (n += "")
                : st.isArray(n) &&
                  (n = st.map(n, function (t) {
                    return null == t ? "" : t + "";
                  })),
              (e =
                st.valHooks[this.type] ||
                st.valHooks[this.nodeName.toLowerCase()]),
              (e && "set" in e && void 0 !== e.set(this, n, "value")) ||
                (this.value = n));
          }))
        : n
        ? ((e = st.valHooks[n.type] || st.valHooks[n.nodeName.toLowerCase()]),
          e && "get" in e && void 0 !== (r = e.get(n, "value"))
            ? r
            : ((r = n.value),
              "string" == typeof r ? r.replace(Ee, "") : null == r ? "" : r))
        : void 0;
    },
  }),
    st.extend({
      valHooks: {
        option: {
          get: function (t) {
            var e = st.find.attr(t, "value");
            return null != e ? e : st.text(t);
          },
        },
        select: {
          get: function (t) {
            for (
              var e,
                r,
                i = t.options,
                n = t.selectedIndex,
                s = "select-one" === t.type || 0 > n,
                a = s ? null : [],
                o = s ? n + 1 : i.length,
                l = 0 > n ? o : s ? n : 0;
              o > l;
              l++
            )
              if (
                ((r = i[l]),
                !(
                  (!r.selected && l !== n) ||
                  (it.optDisabled
                    ? r.disabled
                    : null !== r.getAttribute("disabled")) ||
                  (r.parentNode.disabled &&
                    st.nodeName(r.parentNode, "optgroup"))
                ))
              ) {
                if (((e = st(r).val()), s)) return e;
                a.push(e);
              }
            return a;
          },
          set: function (t, e) {
            for (
              var r, i, n = t.options, s = st.makeArray(e), a = n.length;
              a--;

            )
              if (((i = n[a]), st.inArray(st.valHooks.option.get(i), s) >= 0))
                try {
                  i.selected = r = !0;
                } catch (o) {
                  i.scrollHeight;
                }
              else i.selected = !1;
            return r || (t.selectedIndex = -1), n;
          },
        },
      },
    }),
    st.each(["radio", "checkbox"], function () {
      (st.valHooks[this] = {
        set: function (t, e) {
          return st.isArray(e)
            ? (t.checked = st.inArray(st(t).val(), e) >= 0)
            : void 0;
        },
      }),
        it.checkOn ||
          (st.valHooks[this].get = function (t) {
            return null === t.getAttribute("value") ? "on" : t.value;
          });
    });
  var we,
    Pe,
    Se = st.expr.attrHandle,
    Ce = /^(?:checked|selected)$/i,
    ke = it.getSetAttribute,
    Te = it.input;
  st.fn.extend({
    attr: function (t, e) {
      return Dt(this, st.attr, t, e, arguments.length > 1);
    },
    removeAttr: function (t) {
      return this.each(function () {
        st.removeAttr(this, t);
      });
    },
  }),
    st.extend({
      attr: function (t, e, r) {
        var i,
          n,
          s = t.nodeType;
        return t && 3 !== s && 8 !== s && 2 !== s
          ? typeof t.getAttribute === St
            ? st.prop(t, e, r)
            : ((1 === s && st.isXMLDoc(t)) ||
                ((e = e.toLowerCase()),
                (i =
                  st.attrHooks[e] || (st.expr.match.bool.test(e) ? Pe : we))),
              void 0 === r
                ? i && "get" in i && null !== (n = i.get(t, e))
                  ? n
                  : ((n = st.find.attr(t, e)), null == n ? void 0 : n)
                : null !== r
                ? i && "set" in i && void 0 !== (n = i.set(t, r, e))
                  ? n
                  : (t.setAttribute(e, r + ""), r)
                : void st.removeAttr(t, e))
          : void 0;
      },
      removeAttr: function (t, e) {
        var r,
          i,
          n = 0,
          s = e && e.match(xt);
        if (s && 1 === t.nodeType)
          for (; (r = s[n++]); )
            (i = st.propFix[r] || r),
              st.expr.match.bool.test(r)
                ? (Te && ke) || !Ce.test(r)
                  ? (t[i] = !1)
                  : (t[st.camelCase("default-" + r)] = t[i] = !1)
                : st.attr(t, r, ""),
              t.removeAttribute(ke ? r : i);
      },
      attrHooks: {
        type: {
          set: function (t, e) {
            if (!it.radioValue && "radio" === e && st.nodeName(t, "input")) {
              var r = t.value;
              return t.setAttribute("type", e), r && (t.value = r), e;
            }
          },
        },
      },
    }),
    (Pe = {
      set: function (t, e, r) {
        return (
          e === !1
            ? st.removeAttr(t, r)
            : (Te && ke) || !Ce.test(r)
            ? t.setAttribute((!ke && st.propFix[r]) || r, r)
            : (t[st.camelCase("default-" + r)] = t[r] = !0),
          r
        );
      },
    }),
    st.each(st.expr.match.bool.source.match(/\w+/g), function (t, e) {
      var r = Se[e] || st.find.attr;
      Se[e] =
        (Te && ke) || !Ce.test(e)
          ? function (t, e, i) {
              var n, s;
              return (
                i ||
                  ((s = Se[e]),
                  (Se[e] = n),
                  (n = null != r(t, e, i) ? e.toLowerCase() : null),
                  (Se[e] = s)),
                n
              );
            }
          : function (t, e, r) {
              return r
                ? void 0
                : t[st.camelCase("default-" + e)]
                ? e.toLowerCase()
                : null;
            };
    }),
    (Te && ke) ||
      (st.attrHooks.value = {
        set: function (t, e, r) {
          return st.nodeName(t, "input")
            ? void (t.defaultValue = e)
            : we && we.set(t, e, r);
        },
      }),
    ke ||
      ((we = {
        set: function (t, e, r) {
          var i = t.getAttributeNode(r);
          return (
            i || t.setAttributeNode((i = t.ownerDocument.createAttribute(r))),
            (i.value = e += ""),
            "value" === r || e === t.getAttribute(r) ? e : void 0
          );
        },
      }),
      (Se.id =
        Se.name =
        Se.coords =
          function (t, e, r) {
            var i;
            return r
              ? void 0
              : (i = t.getAttributeNode(e)) && "" !== i.value
              ? i.value
              : null;
          }),
      (st.valHooks.button = {
        get: function (t, e) {
          var r = t.getAttributeNode(e);
          return r && r.specified ? r.value : void 0;
        },
        set: we.set,
      }),
      (st.attrHooks.contenteditable = {
        set: function (t, e, r) {
          we.set(t, "" === e ? !1 : e, r);
        },
      }),
      st.each(["width", "height"], function (t, e) {
        st.attrHooks[e] = {
          set: function (t, r) {
            return "" === r ? (t.setAttribute(e, "auto"), r) : void 0;
          },
        };
      })),
    it.style ||
      (st.attrHooks.style = {
        get: function (t) {
          return t.style.cssText || void 0;
        },
        set: function (t, e) {
          return (t.style.cssText = e + "");
        },
      });
  var Ae = /^(?:input|select|textarea|button|object)$/i,
    Me = /^(?:a|area)$/i;
  st.fn.extend({
    prop: function (t, e) {
      return Dt(this, st.prop, t, e, arguments.length > 1);
    },
    removeProp: function (t) {
      return (
        (t = st.propFix[t] || t),
        this.each(function () {
          try {
            (this[t] = void 0), delete this[t];
          } catch (e) {}
        })
      );
    },
  }),
    st.extend({
      propFix: { for: "htmlFor", class: "className" },
      prop: function (t, e, r) {
        var i,
          n,
          s,
          a = t.nodeType;
        return t && 3 !== a && 8 !== a && 2 !== a
          ? ((s = 1 !== a || !st.isXMLDoc(t)),
            s && ((e = st.propFix[e] || e), (n = st.propHooks[e])),
            void 0 !== r
              ? n && "set" in n && void 0 !== (i = n.set(t, r, e))
                ? i
                : (t[e] = r)
              : n && "get" in n && null !== (i = n.get(t, e))
              ? i
              : t[e])
          : void 0;
      },
      propHooks: {
        tabIndex: {
          get: function (t) {
            var e = st.find.attr(t, "tabindex");
            return e
              ? parseInt(e, 10)
              : Ae.test(t.nodeName) || (Me.test(t.nodeName) && t.href)
              ? 0
              : -1;
          },
        },
      },
    }),
    it.hrefNormalized ||
      st.each(["href", "src"], function (t, e) {
        st.propHooks[e] = {
          get: function (t) {
            return t.getAttribute(e, 4);
          },
        };
      }),
    it.optSelected ||
      (st.propHooks.selected = {
        get: function (t) {
          var e = t.parentNode;
          return (
            e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex),
            null
          );
        },
      }),
    st.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
      ],
      function () {
        st.propFix[this.toLowerCase()] = this;
      }
    ),
    it.enctype || (st.propFix.enctype = "encoding");
  var De = /[\t\r\n\f]/g;
  st.fn.extend({
    addClass: function (t) {
      var e,
        r,
        i,
        n,
        s,
        a,
        o = 0,
        l = this.length,
        h = "string" == typeof t && t;
      if (st.isFunction(t))
        return this.each(function (e) {
          st(this).addClass(t.call(this, e, this.className));
        });
      if (h)
        for (e = (t || "").match(xt) || []; l > o; o++)
          if (
            ((r = this[o]),
            (i =
              1 === r.nodeType &&
              (r.className ? (" " + r.className + " ").replace(De, " ") : " ")))
          ) {
            for (s = 0; (n = e[s++]); )
              i.indexOf(" " + n + " ") < 0 && (i += n + " ");
            (a = st.trim(i)), r.className !== a && (r.className = a);
          }
      return this;
    },
    removeClass: function (t) {
      var e,
        r,
        i,
        n,
        s,
        a,
        o = 0,
        l = this.length,
        h = 0 === arguments.length || ("string" == typeof t && t);
      if (st.isFunction(t))
        return this.each(function (e) {
          st(this).removeClass(t.call(this, e, this.className));
        });
      if (h)
        for (e = (t || "").match(xt) || []; l > o; o++)
          if (
            ((r = this[o]),
            (i =
              1 === r.nodeType &&
              (r.className ? (" " + r.className + " ").replace(De, " ") : "")))
          ) {
            for (s = 0; (n = e[s++]); )
              for (; i.indexOf(" " + n + " ") >= 0; )
                i = i.replace(" " + n + " ", " ");
            (a = t ? st.trim(i) : ""), r.className !== a && (r.className = a);
          }
      return this;
    },
    toggleClass: function (t, e) {
      var r = typeof t;
      return "boolean" == typeof e && "string" === r
        ? e
          ? this.addClass(t)
          : this.removeClass(t)
        : this.each(
            st.isFunction(t)
              ? function (r) {
                  st(this).toggleClass(t.call(this, r, this.className, e), e);
                }
              : function () {
                  if ("string" === r)
                    for (
                      var e, i = 0, n = st(this), s = t.match(xt) || [];
                      (e = s[i++]);

                    )
                      n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                  else
                    (r === St || "boolean" === r) &&
                      (this.className &&
                        st._data(this, "__className__", this.className),
                      (this.className =
                        this.className || t === !1
                          ? ""
                          : st._data(this, "__className__") || ""));
                }
          );
    },
    hasClass: function (t) {
      for (var e = " " + t + " ", r = 0, i = this.length; i > r; r++)
        if (
          1 === this[r].nodeType &&
          (" " + this[r].className + " ").replace(De, " ").indexOf(e) >= 0
        )
          return !0;
      return !1;
    },
  }),
    st.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
        " "
      ),
      function (t, e) {
        st.fn[e] = function (t, r) {
          return arguments.length > 0
            ? this.on(e, null, t, r)
            : this.trigger(e);
        };
      }
    ),
    st.fn.extend({
      hover: function (t, e) {
        return this.mouseenter(t).mouseleave(e || t);
      },
      bind: function (t, e, r) {
        return this.on(t, null, e, r);
      },
      unbind: function (t, e) {
        return this.off(t, null, e);
      },
      delegate: function (t, e, r, i) {
        return this.on(e, t, r, i);
      },
      undelegate: function (t, e, r) {
        return 1 === arguments.length
          ? this.off(t, "**")
          : this.off(e, t || "**", r);
      },
    });
  var Fe = st.now(),
    Ie = /\?/,
    _e =
      /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
  (st.parseJSON = function (e) {
    if (t.JSON && t.JSON.parse) return t.JSON.parse(e + "");
    var r,
      i = null,
      n = st.trim(e + "");
    return n &&
      !st.trim(
        n.replace(_e, function (t, e, n, s) {
          return (
            r && e && (i = 0), 0 === i ? t : ((r = n || e), (i += !s - !n), "")
          );
        })
      )
      ? Function("return " + n)()
      : st.error("Invalid JSON: " + e);
  }),
    (st.parseXML = function (e) {
      var r, i;
      if (!e || "string" != typeof e) return null;
      try {
        t.DOMParser
          ? ((i = new DOMParser()), (r = i.parseFromString(e, "text/xml")))
          : ((r = new ActiveXObject("Microsoft.XMLDOM")),
            (r.async = "false"),
            r.loadXML(e));
      } catch (n) {
        r = void 0;
      }
      return (
        (r &&
          r.documentElement &&
          !r.getElementsByTagName("parsererror").length) ||
          st.error("Invalid XML: " + e),
        r
      );
    });
  var Ne,
    Be,
    Le = /#.*$/,
    Re = /([?&])_=[^&]*/,
    Ve = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    je = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    He = /^(?:GET|HEAD)$/,
    Oe = /^\/\//,
    ze = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    Ge = {},
    qe = {},
    We = "*/".concat("*");
  try {
    Be = location.href;
  } catch ($e) {
    (Be = mt.createElement("a")), (Be.href = ""), (Be = Be.href);
  }
  (Ne = ze.exec(Be.toLowerCase()) || []),
    st.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: Be,
        type: "GET",
        isLocal: je.test(Ne[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": We,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript",
        },
        contents: { xml: /xml/, html: /html/, json: /json/ },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON",
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": st.parseJSON,
          "text xml": st.parseXML,
        },
        flatOptions: { url: !0, context: !0 },
      },
      ajaxSetup: function (t, e) {
        return e ? O(O(t, st.ajaxSettings), e) : O(st.ajaxSettings, t);
      },
      ajaxPrefilter: j(Ge),
      ajaxTransport: j(qe),
      ajax: function (t, e) {
        function r(t, e, r, i) {
          var n,
            p,
            g,
            v,
            x,
            w = e;
          2 !== b &&
            ((b = 2),
            o && clearTimeout(o),
            (h = void 0),
            (a = i || ""),
            (E.readyState = t > 0 ? 4 : 0),
            (n = (t >= 200 && 300 > t) || 304 === t),
            r && (v = z(c, E, r)),
            (v = G(c, v, E, n)),
            n
              ? (c.ifModified &&
                  ((x = E.getResponseHeader("Last-Modified")),
                  x && (st.lastModified[s] = x),
                  (x = E.getResponseHeader("etag")),
                  x && (st.etag[s] = x)),
                204 === t || "HEAD" === c.type
                  ? (w = "nocontent")
                  : 304 === t
                  ? (w = "notmodified")
                  : ((w = v.state), (p = v.data), (g = v.error), (n = !g)))
              : ((g = w), (t || !w) && ((w = "error"), 0 > t && (t = 0))),
            (E.status = t),
            (E.statusText = (e || w) + ""),
            n ? d.resolveWith(f, [p, w, E]) : d.rejectWith(f, [E, w, g]),
            E.statusCode(y),
            (y = void 0),
            l && u.trigger(n ? "ajaxSuccess" : "ajaxError", [E, c, n ? p : g]),
            m.fireWith(f, [E, w]),
            l &&
              (u.trigger("ajaxComplete", [E, c]),
              --st.active || st.event.trigger("ajaxStop")));
        }
        "object" == typeof t && ((e = t), (t = void 0)), (e = e || {});
        var i,
          n,
          s,
          a,
          o,
          l,
          h,
          p,
          c = st.ajaxSetup({}, e),
          f = c.context || c,
          u = c.context && (f.nodeType || f.jquery) ? st(f) : st.event,
          d = st.Deferred(),
          m = st.Callbacks("once memory"),
          y = c.statusCode || {},
          g = {},
          v = {},
          b = 0,
          x = "canceled",
          E = {
            readyState: 0,
            getResponseHeader: function (t) {
              var e;
              if (2 === b) {
                if (!p)
                  for (p = {}; (e = Ve.exec(a)); ) p[e[1].toLowerCase()] = e[2];
                e = p[t.toLowerCase()];
              }
              return null == e ? null : e;
            },
            getAllResponseHeaders: function () {
              return 2 === b ? a : null;
            },
            setRequestHeader: function (t, e) {
              var r = t.toLowerCase();
              return b || ((t = v[r] = v[r] || t), (g[t] = e)), this;
            },
            overrideMimeType: function (t) {
              return b || (c.mimeType = t), this;
            },
            statusCode: function (t) {
              var e;
              if (t)
                if (2 > b) for (e in t) y[e] = [y[e], t[e]];
                else E.always(t[E.status]);
              return this;
            },
            abort: function (t) {
              var e = t || x;
              return h && h.abort(e), r(0, e), this;
            },
          };
        if (
          ((d.promise(E).complete = m.add),
          (E.success = E.done),
          (E.error = E.fail),
          (c.url = ((t || c.url || Be) + "")
            .replace(Le, "")
            .replace(Oe, Ne[1] + "//")),
          (c.type = e.method || e.type || c.method || c.type),
          (c.dataTypes = st
            .trim(c.dataType || "*")
            .toLowerCase()
            .match(xt) || [""]),
          null == c.crossDomain &&
            ((i = ze.exec(c.url.toLowerCase())),
            (c.crossDomain = !(
              !i ||
              (i[1] === Ne[1] &&
                i[2] === Ne[2] &&
                (i[3] || ("http:" === i[1] ? "80" : "443")) ===
                  (Ne[3] || ("http:" === Ne[1] ? "80" : "443")))
            ))),
          c.data &&
            c.processData &&
            "string" != typeof c.data &&
            (c.data = st.param(c.data, c.traditional)),
          H(Ge, c, e, E),
          2 === b)
        )
          return E;
        (l = c.global),
          l && 0 === st.active++ && st.event.trigger("ajaxStart"),
          (c.type = c.type.toUpperCase()),
          (c.hasContent = !He.test(c.type)),
          (s = c.url),
          c.hasContent ||
            (c.data &&
              ((s = c.url += (Ie.test(s) ? "&" : "?") + c.data), delete c.data),
            c.cache === !1 &&
              (c.url = Re.test(s)
                ? s.replace(Re, "$1_=" + Fe++)
                : s + (Ie.test(s) ? "&" : "?") + "_=" + Fe++)),
          c.ifModified &&
            (st.lastModified[s] &&
              E.setRequestHeader("If-Modified-Since", st.lastModified[s]),
            st.etag[s] && E.setRequestHeader("If-None-Match", st.etag[s])),
          ((c.data && c.hasContent && c.contentType !== !1) || e.contentType) &&
            E.setRequestHeader("Content-Type", c.contentType),
          E.setRequestHeader(
            "Accept",
            c.dataTypes[0] && c.accepts[c.dataTypes[0]]
              ? c.accepts[c.dataTypes[0]] +
                  ("*" !== c.dataTypes[0] ? ", " + We + "; q=0.01" : "")
              : c.accepts["*"]
          );
        for (n in c.headers) E.setRequestHeader(n, c.headers[n]);
        if (c.beforeSend && (c.beforeSend.call(f, E, c) === !1 || 2 === b))
          return E.abort();
        x = "abort";
        for (n in { success: 1, error: 1, complete: 1 }) E[n](c[n]);
        if ((h = H(qe, c, e, E))) {
          (E.readyState = 1),
            l && u.trigger("ajaxSend", [E, c]),
            c.async &&
              c.timeout > 0 &&
              (o = setTimeout(function () {
                E.abort("timeout");
              }, c.timeout));
          try {
            (b = 1), h.send(g, r);
          } catch (w) {
            if (!(2 > b)) throw w;
            r(-1, w);
          }
        } else r(-1, "No Transport");
        return E;
      },
      getJSON: function (t, e, r) {
        return st.get(t, e, r, "json");
      },
      getScript: function (t, e) {
        return st.get(t, void 0, e, "script");
      },
    }),
    st.each(["get", "post"], function (t, e) {
      st[e] = function (t, r, i, n) {
        return (
          st.isFunction(r) && ((n = n || i), (i = r), (r = void 0)),
          st.ajax({ url: t, type: e, dataType: n, data: r, success: i })
        );
      };
    }),
    st.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend",
      ],
      function (t, e) {
        st.fn[e] = function (t) {
          return this.on(e, t);
        };
      }
    ),
    (st._evalUrl = function (t) {
      return st.ajax({
        url: t,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        throws: !0,
      });
    }),
    st.fn.extend({
      wrapAll: function (t) {
        if (st.isFunction(t))
          return this.each(function (e) {
            st(this).wrapAll(t.call(this, e));
          });
        if (this[0]) {
          var e = st(t, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && e.insertBefore(this[0]),
            e
              .map(function () {
                for (
                  var t = this;
                  t.firstChild && 1 === t.firstChild.nodeType;

                )
                  t = t.firstChild;
                return t;
              })
              .append(this);
        }
        return this;
      },
      wrapInner: function (t) {
        return this.each(
          st.isFunction(t)
            ? function (e) {
                st(this).wrapInner(t.call(this, e));
              }
            : function () {
                var e = st(this),
                  r = e.contents();
                r.length ? r.wrapAll(t) : e.append(t);
              }
        );
      },
      wrap: function (t) {
        var e = st.isFunction(t);
        return this.each(function (r) {
          st(this).wrapAll(e ? t.call(this, r) : t);
        });
      },
      unwrap: function () {
        return this.parent()
          .each(function () {
            st.nodeName(this, "body") || st(this).replaceWith(this.childNodes);
          })
          .end();
      },
    }),
    (st.expr.filters.hidden = function (t) {
      return (
        (t.offsetWidth <= 0 && t.offsetHeight <= 0) ||
        (!it.reliableHiddenOffsets() &&
          "none" === ((t.style && t.style.display) || st.css(t, "display")))
      );
    }),
    (st.expr.filters.visible = function (t) {
      return !st.expr.filters.hidden(t);
    });
  var Xe = /%20/g,
    Ye = /\[\]$/,
    Ue = /\r?\n/g,
    Ke = /^(?:submit|button|image|reset|file)$/i,
    Je = /^(?:input|select|textarea|keygen)/i;
  (st.param = function (t, e) {
    var r,
      i = [],
      n = function (t, e) {
        (e = st.isFunction(e) ? e() : null == e ? "" : e),
          (i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e));
      };
    if (
      (void 0 === e && (e = st.ajaxSettings && st.ajaxSettings.traditional),
      st.isArray(t) || (t.jquery && !st.isPlainObject(t)))
    )
      st.each(t, function () {
        n(this.name, this.value);
      });
    else for (r in t) q(r, t[r], e, n);
    return i.join("&").replace(Xe, "+");
  }),
    st.fn.extend({
      serialize: function () {
        return st.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          var t = st.prop(this, "elements");
          return t ? st.makeArray(t) : this;
        })
          .filter(function () {
            var t = this.type;
            return (
              this.name &&
              !st(this).is(":disabled") &&
              Je.test(this.nodeName) &&
              !Ke.test(t) &&
              (this.checked || !Ft.test(t))
            );
          })
          .map(function (t, e) {
            var r = st(this).val();
            return null == r
              ? null
              : st.isArray(r)
              ? st.map(r, function (t) {
                  return { name: e.name, value: t.replace(Ue, "\r\n") };
                })
              : { name: e.name, value: r.replace(Ue, "\r\n") };
          })
          .get();
      },
    }),
    (st.ajaxSettings.xhr =
      void 0 !== t.ActiveXObject
        ? function () {
            return (
              (!this.isLocal &&
                /^(get|post|head|put|delete|options)$/i.test(this.type) &&
                W()) ||
              $()
            );
          }
        : W);
  var Qe = 0,
    Ze = {},
    tr = st.ajaxSettings.xhr();
  t.ActiveXObject &&
    st(t).on("unload", function () {
      for (var t in Ze) Ze[t](void 0, !0);
    }),
    (it.cors = !!tr && "withCredentials" in tr),
    (tr = it.ajax = !!tr),
    tr &&
      st.ajaxTransport(function (t) {
        if (!t.crossDomain || it.cors) {
          var e;
          return {
            send: function (r, i) {
              var n,
                s = t.xhr(),
                a = ++Qe;
              if (
                (s.open(t.type, t.url, t.async, t.username, t.password),
                t.xhrFields)
              )
                for (n in t.xhrFields) s[n] = t.xhrFields[n];
              t.mimeType &&
                s.overrideMimeType &&
                s.overrideMimeType(t.mimeType),
                t.crossDomain ||
                  r["X-Requested-With"] ||
                  (r["X-Requested-With"] = "XMLHttpRequest");
              for (n in r) void 0 !== r[n] && s.setRequestHeader(n, r[n] + "");
              s.send((t.hasContent && t.data) || null),
                (e = function (r, n) {
                  var o, l, h;
                  if (e && (n || 4 === s.readyState))
                    if (
                      (delete Ze[a],
                      (e = void 0),
                      (s.onreadystatechange = st.noop),
                      n)
                    )
                      4 !== s.readyState && s.abort();
                    else {
                      (h = {}),
                        (o = s.status),
                        "string" == typeof s.responseText &&
                          (h.text = s.responseText);
                      try {
                        l = s.statusText;
                      } catch (p) {
                        l = "";
                      }
                      o || !t.isLocal || t.crossDomain
                        ? 1223 === o && (o = 204)
                        : (o = h.text ? 200 : 404);
                    }
                  h && i(o, l, h, s.getAllResponseHeaders());
                }),
                t.async
                  ? 4 === s.readyState
                    ? setTimeout(e)
                    : (s.onreadystatechange = Ze[a] = e)
                  : e();
            },
            abort: function () {
              e && e(void 0, !0);
            },
          };
        }
      }),
    st.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /(?:java|ecma)script/ },
      converters: {
        "text script": function (t) {
          return st.globalEval(t), t;
        },
      },
    }),
    st.ajaxPrefilter("script", function (t) {
      void 0 === t.cache && (t.cache = !1),
        t.crossDomain && ((t.type = "GET"), (t.global = !1));
    }),
    st.ajaxTransport("script", function (t) {
      if (t.crossDomain) {
        var e,
          r = mt.head || st("head")[0] || mt.documentElement;
        return {
          send: function (i, n) {
            (e = mt.createElement("script")),
              (e.async = !0),
              t.scriptCharset && (e.charset = t.scriptCharset),
              (e.src = t.url),
              (e.onload = e.onreadystatechange =
                function (t, r) {
                  (r ||
                    !e.readyState ||
                    /loaded|complete/.test(e.readyState)) &&
                    ((e.onload = e.onreadystatechange = null),
                    e.parentNode && e.parentNode.removeChild(e),
                    (e = null),
                    r || n(200, "success"));
                }),
              r.insertBefore(e, r.firstChild);
          },
          abort: function () {
            e && e.onload(void 0, !0);
          },
        };
      }
    });
  var er = [],
    rr = /(=)\?(?=&|$)|\?\?/;
  st.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var t = er.pop() || st.expando + "_" + Fe++;
      return (this[t] = !0), t;
    },
  }),
    st.ajaxPrefilter("json jsonp", function (e, r, i) {
      var n,
        s,
        a,
        o =
          e.jsonp !== !1 &&
          (rr.test(e.url)
            ? "url"
            : "string" == typeof e.data &&
              !(e.contentType || "").indexOf(
                "application/x-www-form-urlencoded"
              ) &&
              rr.test(e.data) &&
              "data");
      return o || "jsonp" === e.dataTypes[0]
        ? ((n = e.jsonpCallback =
            st.isFunction(e.jsonpCallback)
              ? e.jsonpCallback()
              : e.jsonpCallback),
          o
            ? (e[o] = e[o].replace(rr, "$1" + n))
            : e.jsonp !== !1 &&
              (e.url += (Ie.test(e.url) ? "&" : "?") + e.jsonp + "=" + n),
          (e.converters["script json"] = function () {
            return a || st.error(n + " was not called"), a[0];
          }),
          (e.dataTypes[0] = "json"),
          (s = t[n]),
          (t[n] = function () {
            a = arguments;
          }),
          i.always(function () {
            (t[n] = s),
              e[n] && ((e.jsonpCallback = r.jsonpCallback), er.push(n)),
              a && st.isFunction(s) && s(a[0]),
              (a = s = void 0);
          }),
          "script")
        : void 0;
    }),
    (st.parseHTML = function (t, e, r) {
      if (!t || "string" != typeof t) return null;
      "boolean" == typeof e && ((r = e), (e = !1)), (e = e || mt);
      var i = ft.exec(t),
        n = !r && [];
      return i
        ? [e.createElement(i[1])]
        : ((i = st.buildFragment([t], e, n)),
          n && n.length && st(n).remove(),
          st.merge([], i.childNodes));
    });
  var ir = st.fn.load;
  (st.fn.load = function (t, e, r) {
    if ("string" != typeof t && ir) return ir.apply(this, arguments);
    var i,
      n,
      s,
      a = this,
      o = t.indexOf(" ");
    return (
      o >= 0 && ((i = t.slice(o, t.length)), (t = t.slice(0, o))),
      st.isFunction(e)
        ? ((r = e), (e = void 0))
        : e && "object" == typeof e && (s = "POST"),
      a.length > 0 &&
        st
          .ajax({ url: t, type: s, dataType: "html", data: e })
          .done(function (t) {
            (n = arguments),
              a.html(i ? st("<div>").append(st.parseHTML(t)).find(i) : t);
          })
          .complete(
            r &&
              function (t, e) {
                a.each(r, n || [t.responseText, e, t]);
              }
          ),
      this
    );
  }),
    (st.expr.filters.animated = function (t) {
      return st.grep(st.timers, function (e) {
        return t === e.elem;
      }).length;
    });
  var nr = t.document.documentElement;
  (st.offset = {
    setOffset: function (t, e, r) {
      var i,
        n,
        s,
        a,
        o,
        l,
        h,
        p = st.css(t, "position"),
        c = st(t),
        f = {};
      "static" === p && (t.style.position = "relative"),
        (o = c.offset()),
        (s = st.css(t, "top")),
        (l = st.css(t, "left")),
        (h =
          ("absolute" === p || "fixed" === p) &&
          st.inArray("auto", [s, l]) > -1),
        h
          ? ((i = c.position()), (a = i.top), (n = i.left))
          : ((a = parseFloat(s) || 0), (n = parseFloat(l) || 0)),
        st.isFunction(e) && (e = e.call(t, r, o)),
        null != e.top && (f.top = e.top - o.top + a),
        null != e.left && (f.left = e.left - o.left + n),
        "using" in e ? e.using.call(t, f) : c.css(f);
    },
  }),
    st.fn.extend({
      offset: function (t) {
        if (arguments.length)
          return void 0 === t
            ? this
            : this.each(function (e) {
                st.offset.setOffset(this, t, e);
              });
        var e,
          r,
          i = { top: 0, left: 0 },
          n = this[0],
          s = n && n.ownerDocument;
        return s
          ? ((e = s.documentElement),
            st.contains(e, n)
              ? (typeof n.getBoundingClientRect !== St &&
                  (i = n.getBoundingClientRect()),
                (r = X(s)),
                {
                  top:
                    i.top + (r.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                  left:
                    i.left +
                    (r.pageXOffset || e.scrollLeft) -
                    (e.clientLeft || 0),
                })
              : i)
          : void 0;
      },
      position: function () {
        if (this[0]) {
          var t,
            e,
            r = { top: 0, left: 0 },
            i = this[0];
          return (
            "fixed" === st.css(i, "position")
              ? (e = i.getBoundingClientRect())
              : ((t = this.offsetParent()),
                (e = this.offset()),
                st.nodeName(t[0], "html") || (r = t.offset()),
                (r.top += st.css(t[0], "borderTopWidth", !0)),
                (r.left += st.css(t[0], "borderLeftWidth", !0))),
            {
              top: e.top - r.top - st.css(i, "marginTop", !0),
              left: e.left - r.left - st.css(i, "marginLeft", !0),
            }
          );
        }
      },
      offsetParent: function () {
        return this.map(function () {
          for (
            var t = this.offsetParent || nr;
            t && !st.nodeName(t, "html") && "static" === st.css(t, "position");

          )
            t = t.offsetParent;
          return t || nr;
        });
      },
    }),
    st.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (t, e) {
        var r = /Y/.test(e);
        st.fn[t] = function (i) {
          return Dt(
            this,
            function (t, i, n) {
              var s = X(t);
              return void 0 === n
                ? s
                  ? e in s
                    ? s[e]
                    : s.document.documentElement[i]
                  : t[i]
                : void (s
                    ? s.scrollTo(
                        r ? st(s).scrollLeft() : n,
                        r ? n : st(s).scrollTop()
                      )
                    : (t[i] = n));
            },
            t,
            i,
            arguments.length,
            null
          );
        };
      }
    ),
    st.each(["top", "left"], function (t, e) {
      st.cssHooks[e] = k(it.pixelPosition, function (t, r) {
        return r
          ? ((r = re(t, e)), ne.test(r) ? st(t).position()[e] + "px" : r)
          : void 0;
      });
    }),
    st.each({ Height: "height", Width: "width" }, function (t, e) {
      st.each(
        { padding: "inner" + t, content: e, "": "outer" + t },
        function (r, i) {
          st.fn[i] = function (i, n) {
            var s = arguments.length && (r || "boolean" != typeof i),
              a = r || (i === !0 || n === !0 ? "margin" : "border");
            return Dt(
              this,
              function (e, r, i) {
                var n;
                return st.isWindow(e)
                  ? e.document.documentElement["client" + t]
                  : 9 === e.nodeType
                  ? ((n = e.documentElement),
                    Math.max(
                      e.body["scroll" + t],
                      n["scroll" + t],
                      e.body["offset" + t],
                      n["offset" + t],
                      n["client" + t]
                    ))
                  : void 0 === i
                  ? st.css(e, r, a)
                  : st.style(e, r, i, a);
              },
              e,
              s ? i : void 0,
              s,
              null
            );
          };
        }
      );
    }),
    (st.fn.size = function () {
      return this.length;
    }),
    (st.fn.andSelf = st.fn.addBack),
    "function" == typeof define &&
      define.amd &&
      define("jquery", [], function () {
        return st;
      });
  var sr = t.jQuery,
    ar = t.$;
  return (
    (st.noConflict = function (e) {
      return (
        t.$ === st && (t.$ = ar), e && t.jQuery === st && (t.jQuery = sr), st
      );
    }),
    typeof e === St && (t.jQuery = t.$ = st),
    st
  );
}),
  !(function (t, e) {
    "function" == typeof define && define.amd
      ? define(e)
      : "object" == typeof module && module.exports
      ? (module.exports = e())
      : (t.bodymovin = e());
  })(window, function () {
    function ProjectInterface() {
      return {};
    }
    function roundValues(t) {
      bm_rnd = t
        ? Math.round
        : function (t) {
            return t;
          };
    }
    function roundTo2Decimals(t) {
      return Math.round(1e4 * t) / 1e4;
    }
    function roundTo3Decimals(t) {
      return Math.round(100 * t) / 100;
    }
    function styleDiv(t) {
      (t.style.position = "absolute"),
        (t.style.top = 0),
        (t.style.left = 0),
        (t.style.display = "block"),
        (t.style.transformOrigin = t.style.webkitTransformOrigin = "0 0"),
        (t.style.backfaceVisibility = t.style.webkitBackfaceVisibility =
          "visible"),
        (t.style.transformStyle =
          t.style.webkitTransformStyle =
          t.style.mozTransformStyle =
            "preserve-3d");
    }
    function styleUnselectableDiv(t) {
      (t.style.userSelect = "none"),
        (t.style.MozUserSelect = "none"),
        (t.style.webkitUserSelect = "none"),
        (t.style.oUserSelect = "none");
    }
    function BMEnterFrameEvent(t, e, r, i) {
      (this.type = t),
        (this.currentTime = e),
        (this.totalTime = r),
        (this.direction = 0 > i ? -1 : 1);
    }
    function BMCompleteEvent(t, e) {
      (this.type = t), (this.direction = 0 > e ? -1 : 1);
    }
    function BMCompleteLoopEvent(t, e, r, i) {
      (this.type = t),
        (this.currentLoop = e),
        (this.totalLoops = r),
        (this.direction = 0 > i ? -1 : 1);
    }
    function BMSegmentStartEvent(t, e, r) {
      (this.type = t), (this.firstFrame = e), (this.totalFrames = r);
    }
    function BMDestroyEvent(t, e) {
      (this.type = t), (this.target = e);
    }
    function _addEventListener(t, e) {
      this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e);
    }
    function _removeEventListener(t, e) {
      if (e) {
        if (this._cbs[t]) {
          for (var r = 0, i = this._cbs[t].length; i > r; )
            this._cbs[t][r] === e &&
              (this._cbs[t].splice(r, 1), (r -= 1), (i -= 1)),
              (r += 1);
          this._cbs[t].length || (this._cbs[t] = null);
        }
      } else this._cbs[t] = null;
    }
    function _triggerEvent(t, e) {
      if (this._cbs[t])
        for (var r = this._cbs[t].length, i = 0; r > i; i++) this._cbs[t][i](e);
    }
    function randomString(t, e) {
      void 0 === e &&
        (e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
      var r,
        i = "";
      for (r = t; r > 0; --r)
        i += e[Math.round(Math.random() * (e.length - 1))];
      return i;
    }
    function HSVtoRGB(t, e, r) {
      var i, n, s, a, o, l, h, p;
      switch (
        (1 === arguments.length && ((e = t.s), (r = t.v), (t = t.h)),
        (a = Math.floor(6 * t)),
        (o = 6 * t - a),
        (l = r * (1 - e)),
        (h = r * (1 - o * e)),
        (p = r * (1 - (1 - o) * e)),
        a % 6)
      ) {
        case 0:
          (i = r), (n = p), (s = l);
          break;
        case 1:
          (i = h), (n = r), (s = l);
          break;
        case 2:
          (i = l), (n = r), (s = p);
          break;
        case 3:
          (i = l), (n = h), (s = r);
          break;
        case 4:
          (i = p), (n = l), (s = r);
          break;
        case 5:
          (i = r), (n = l), (s = h);
      }
      return [i, n, s];
    }
    function RGBtoHSV(t, e, r) {
      1 === arguments.length && ((e = t.g), (r = t.b), (t = t.r));
      var i,
        n = Math.max(t, e, r),
        s = Math.min(t, e, r),
        a = n - s,
        o = 0 === n ? 0 : a / n,
        l = n / 255;
      switch (n) {
        case s:
          i = 0;
          break;
        case t:
          (i = e - r + a * (r > e ? 6 : 0)), (i /= 6 * a);
          break;
        case e:
          (i = r - t + 2 * a), (i /= 6 * a);
          break;
        case r:
          (i = t - e + 4 * a), (i /= 6 * a);
      }
      return [i, o, l];
    }
    function addSaturationToRGB(t, e) {
      var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
      return (
        (r[1] += e),
        r[1] > 1 ? (r[1] = 1) : r[1] <= 0 && (r[1] = 0),
        HSVtoRGB(r[0], r[1], r[2])
      );
    }
    function addBrightnessToRGB(t, e) {
      var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
      return (
        (r[2] += e),
        r[2] > 1 ? (r[2] = 1) : r[2] < 0 && (r[2] = 0),
        HSVtoRGB(r[0], r[1], r[2])
      );
    }
    function addHueToRGB(t, e) {
      var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
      return (
        (r[0] += e / 360),
        r[0] > 1 ? (r[0] -= 1) : r[0] < 0 && (r[0] += 1),
        HSVtoRGB(r[0], r[1], r[2])
      );
    }
    function componentToHex(t) {
      var e = t.toString(16);
      return 1 == e.length ? "0" + e : e;
    }
    function fillToRgba(t, e) {
      if (!cachedColors[t]) {
        var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        cachedColors[t] =
          parseInt(r[1], 16) +
          "," +
          parseInt(r[2], 16) +
          "," +
          parseInt(r[3], 16);
      }
      return "rgba(" + cachedColors[t] + "," + e + ")";
    }
    function RenderedFrame(t, e) {
      (this.tr = t), (this.o = e);
    }
    function LetterProps(t, e, r, i, n, s) {
      (this.o = t),
        (this.sw = e),
        (this.sc = r),
        (this.fc = i),
        (this.m = n),
        (this.props = s);
    }
    function iterateDynamicProperties(t) {
      var e,
        r = this.dynamicProperties;
      for (e = 0; r > e; e += 1) this.dynamicProperties[e].getValue(t);
    }
    function reversePath(t) {
      var e,
        r,
        i = [],
        n = [],
        s = [],
        a = {},
        o = 0;
      t.c && ((i[0] = t.o[0]), (n[0] = t.i[0]), (s[0] = t.v[0]), (o = 1)),
        (r = t.i.length);
      var l = r - 1;
      for (e = o; r > e; e += 1)
        i.push(t.o[l]), n.push(t.i[l]), s.push(t.v[l]), (l -= 1);
      return (a.i = i), (a.o = n), (a.v = s), a;
    }
    function Matrix() {}
    function matrixManagerFunction() {
      var t = new Matrix(),
        e = function (e, r, i, n, s) {
          return t.reset().translate(n, s).rotate(e).scale(r, i).toCSS();
        },
        r = function (t) {
          return e(t.tr.r[2], t.tr.s[0], t.tr.s[1], t.tr.p[0], t.tr.p[1]);
        };
      return { getMatrix: r };
    }
    function createElement(t, e, r) {
      if (!e) {
        var i = Object.create(t.prototype, r),
          n = {};
        return (
          i && "[object Function]" === n.toString.call(i.init) && i.init(), i
        );
      }
      (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        (e.prototype._parent = t.prototype);
    }
    function extendPrototype(t, e) {
      for (var r in t.prototype)
        t.prototype.hasOwnProperty(r) && (e.prototype[r] = t.prototype[r]);
    }
    function bezFunction() {
      function t(t, e, r, i, n, s) {
        var a = t * i + e * n + r * s - n * i - s * t - r * e;
        return a > -1e-4 && 1e-4 > a;
      }
      function e(t, e, r, i, n, s, a, o, l) {
        var h,
          p = Math.sqrt(
            Math.pow(i - t, 2) + Math.pow(n - e, 2) + Math.pow(s - r, 2)
          ),
          c = Math.sqrt(
            Math.pow(a - t, 2) + Math.pow(o - e, 2) + Math.pow(l - r, 2)
          ),
          f = Math.sqrt(
            Math.pow(a - i, 2) + Math.pow(o - n, 2) + Math.pow(l - s, 2)
          );
        return (
          (h =
            p > c
              ? p > f
                ? p - c - f
                : f - c - p
              : f > c
              ? f - c - p
              : c - p - f),
          h > -1e-4 && 1e-4 > h
        );
      }
      function r(t) {
        (this.segmentLength = 0), (this.points = new Array(t));
      }
      function i(t, e) {
        (this.partialLength = t), (this.point = e);
      }
      function n(t, e) {
        var r = e.segments,
          i = r.length,
          n = bm_floor((i - 1) * t),
          s = t * e.addedLength,
          a = 0;
        if (s == r[n].l) return r[n].p;
        for (var o = r[n].l > s ? -1 : 1, l = !0; l; )
          r[n].l <= s && r[n + 1].l > s
            ? ((a = (s - r[n].l) / (r[n + 1].l - r[n].l)), (l = !1))
            : (n += o),
            (0 > n || n >= i - 1) && (l = !1);
        return r[n].p + (r[n + 1].p - r[n].p) * a;
      }
      function s() {
        (this.pt1 = new Array(2)),
          (this.pt2 = new Array(2)),
          (this.pt3 = new Array(2)),
          (this.pt4 = new Array(2));
      }
      function a(t, e, r, i, a, o, l) {
        var h = new s();
        a = 0 > a ? 0 : a > 1 ? 1 : a;
        var p = n(a, l);
        o = o > 1 ? 1 : o;
        var c,
          f = n(o, l),
          u = t.length,
          d = 1 - p,
          m = 1 - f;
        for (c = 0; u > c; c += 1)
          (h.pt1[c] =
            Math.round(
              1e3 *
                (d * d * d * t[c] +
                  (p * d * d + d * p * d + d * d * p) * r[c] +
                  (p * p * d + d * p * p + p * d * p) * i[c] +
                  p * p * p * e[c])
            ) / 1e3),
            (h.pt3[c] =
              Math.round(
                1e3 *
                  (d * d * m * t[c] +
                    (p * d * m + d * p * m + d * d * f) * r[c] +
                    (p * p * m + d * p * f + p * d * f) * i[c] +
                    p * p * f * e[c])
              ) / 1e3),
            (h.pt4[c] =
              Math.round(
                1e3 *
                  (d * m * m * t[c] +
                    (p * m * m + d * f * m + d * m * f) * r[c] +
                    (p * f * m + d * f * f + p * m * f) * i[c] +
                    p * f * f * e[c])
              ) / 1e3),
            (h.pt2[c] =
              Math.round(
                1e3 *
                  (m * m * m * t[c] +
                    (f * m * m + m * f * m + m * m * f) * r[c] +
                    (f * f * m + m * f * f + f * m * f) * i[c] +
                    f * f * f * e[c])
              ) / 1e3);
        return h;
      }
      var o =
          (Math,
          (function () {
            function t(t, e) {
              (this.l = t), (this.p = e);
            }
            return function (e, r, i, n) {
              var s,
                a,
                o,
                l,
                h,
                p,
                c = defaultCurveSegments,
                f = 0,
                u = [],
                d = [],
                m = { addedLength: 0, segments: [] };
              for (o = i.length, s = 0; c > s; s += 1) {
                for (h = s / (c - 1), p = 0, a = 0; o > a; a += 1)
                  (l =
                    bm_pow(1 - h, 3) * e[a] +
                    3 * bm_pow(1 - h, 2) * h * i[a] +
                    3 * (1 - h) * bm_pow(h, 2) * n[a] +
                    bm_pow(h, 3) * r[a]),
                    (u[a] = l),
                    null !== d[a] && (p += bm_pow(u[a] - d[a], 2)),
                    (d[a] = u[a]);
                p && ((p = bm_sqrt(p)), (f += p)), m.segments.push(new t(f, h));
              }
              return (m.addedLength = f), m;
            };
          })()),
        l = (function () {
          var e = {};
          return function (n) {
            var s = n.s,
              a = n.e,
              o = n.to,
              l = n.ti,
              h = (
                s.join("_") +
                "_" +
                a.join("_") +
                "_" +
                o.join("_") +
                "_" +
                l.join("_")
              ).replace(/\./g, "p");
            if (e[h]) return void (n.bezierData = e[h]);
            var p,
              c,
              f,
              u,
              d,
              m,
              y,
              g = defaultCurveSegments,
              v = 0,
              b = null;
            2 === s.length &&
              (s[0] != a[0] || s[1] != a[1]) &&
              t(s[0], s[1], a[0], a[1], s[0] + o[0], s[1] + o[1]) &&
              t(s[0], s[1], a[0], a[1], a[0] + l[0], a[1] + l[1]) &&
              (g = 2);
            var x = new r(g);
            for (f = o.length, p = 0; g > p; p += 1) {
              for (
                y = new Array(f), d = p / (g - 1), m = 0, c = 0;
                f > c;
                c += 1
              )
                (u =
                  bm_pow(1 - d, 3) * s[c] +
                  3 * bm_pow(1 - d, 2) * d * (s[c] + o[c]) +
                  3 * (1 - d) * bm_pow(d, 2) * (a[c] + l[c]) +
                  bm_pow(d, 3) * a[c]),
                  (y[c] = u),
                  null !== b && (m += bm_pow(y[c] - b[c], 2));
              (m = bm_sqrt(m)), (v += m), (x.points[p] = new i(m, y)), (b = y);
            }
            (x.segmentLength = v), (n.bezierData = x), (e[h] = x);
          };
        })();
      return {
        getBezierLength: o,
        getNewSegment: a,
        buildBezierData: l,
        pointOnLine2D: t,
        pointOnLine3D: e,
      };
    }
    function dataFunctionManager() {
      function t(n, s, o) {
        var l,
          h,
          p,
          c,
          f,
          u,
          d,
          m,
          y = n.length;
        for (c = 0; y > c; c += 1)
          if (((l = n[c]), "ks" in l && !l.completed)) {
            if (
              ((l.completed = !0),
              l.tt && (n[c - 1].td = l.tt),
              (h = []),
              (p = -1),
              l.hasMask)
            ) {
              var g = l.masksProperties;
              for (u = g.length, f = 0; u > f; f += 1)
                if (g[f].pt.k.i) i(g[f].pt.k);
                else
                  for (m = g[f].pt.k.length, d = 0; m > d; d += 1)
                    g[f].pt.k[d].s && i(g[f].pt.k[d].s[0]),
                      g[f].pt.k[d].e && i(g[f].pt.k[d].e[0]);
            }
            0 === l.ty
              ? ((l.layers = e(l.refId, s)), t(l.layers, s, o))
              : 4 === l.ty
              ? r(l.shapes)
              : 5 == l.ty && a(l, o);
          }
      }
      function e(t, e) {
        for (var r = 0, i = e.length; i > r; ) {
          if (e[r].id === t) return e[r].layers;
          r += 1;
        }
      }
      function r(t) {
        var e,
          n,
          s,
          a = t.length,
          o = !1;
        for (e = a - 1; e >= 0; e -= 1)
          if ("sh" == t[e].ty) {
            if (t[e].ks.k.i) i(t[e].ks.k);
            else
              for (s = t[e].ks.k.length, n = 0; s > n; n += 1)
                t[e].ks.k[n].s && i(t[e].ks.k[n].s[0]),
                  t[e].ks.k[n].e && i(t[e].ks.k[n].e[0]);
            o = !0;
          } else "gr" == t[e].ty && r(t[e].it);
      }
      function i(t) {
        var e,
          r = t.i.length;
        for (e = 0; r > e; e += 1)
          (t.i[e][0] += t.v[e][0]),
            (t.i[e][1] += t.v[e][1]),
            (t.o[e][0] += t.v[e][0]),
            (t.o[e][1] += t.v[e][1]);
      }
      function n(t, e) {
        var r = e ? e.split(".") : [100, 100, 100];
        return t[0] > r[0]
          ? !0
          : r[0] > t[0]
          ? !1
          : t[1] > r[1]
          ? !0
          : r[1] > t[1]
          ? !1
          : t[2] > r[2]
          ? !0
          : r[2] > t[2]
          ? !1
          : void 0;
      }
      function s(e, r) {
        e.__complete ||
          (l(e), o(e), h(e), t(e.layers, e.assets, r), (e.__complete = !0));
      }
      function a(t, e) {
        var r,
          i,
          n = t.t.d.k,
          s = n.length;
        for (i = 0; s > i; i += 1) {
          var a = t.t.d.k[i].s;
          r = [];
          var o,
            l,
            h,
            p,
            c,
            f,
            u,
            d = 0,
            m = t.t.m.g,
            y = 0,
            g = 0,
            v = 0,
            b = [],
            x = 0,
            E = 0,
            w = e.getFontByName(a.f),
            P = 0,
            S = w.fStyle.split(" "),
            C = "normal",
            k = "normal";
          for (l = S.length, o = 0; l > o; o += 1)
            "italic" === S[o].toLowerCase()
              ? (k = "italic")
              : "bold" === S[o].toLowerCase()
              ? (C = "700")
              : "black" === S[o].toLowerCase()
              ? (C = "900")
              : "medium" === S[o].toLowerCase()
              ? (C = "500")
              : "regular" === S[o].toLowerCase() ||
                "normal" === S[o].toLowerCase()
              ? (C = "400")
              : ("light" === S[o].toLowerCase() ||
                  "thin" === S[o].toLowerCase()) &&
                (C = "200");
          if (((a.fWeight = C), (a.fStyle = k), (l = a.t.length), a.sz)) {
            var T = a.sz[0],
              A = -1;
            for (o = 0; l > o; o += 1)
              (h = !1),
                " " === a.t.charAt(o)
                  ? (A = o)
                  : 13 === a.t.charCodeAt(o) && ((x = 0), (h = !0)),
                e.chars
                  ? ((u = e.getCharData(a.t.charAt(o), w.fStyle, w.fFamily)),
                    (P = h ? 0 : (u.w * a.s) / 100))
                  : (P = e.measureText(a.t.charAt(o), a.f, a.s)),
                x + P > T
                  ? (-1 === A
                      ? ((a.t = a.t.substr(0, o) + "\r" + a.t.substr(o)),
                        (l += 1))
                      : ((o = A),
                        (a.t = a.t.substr(0, o) + "\r" + a.t.substr(o + 1))),
                    (A = -1),
                    (x = 0))
                  : (x += P);
            l = a.t.length;
          }
          for (x = 0, P = 0, o = 0; l > o; o += 1)
            if (
              ((h = !1),
              " " === a.t.charAt(o)
                ? (p = "\xa0")
                : 13 === a.t.charCodeAt(o)
                ? (b.push(x),
                  (E = x > E ? x : E),
                  (x = 0),
                  (p = ""),
                  (h = !0),
                  (v += 1))
                : (p = a.t.charAt(o)),
              e.chars
                ? ((u = e.getCharData(
                    a.t.charAt(o),
                    w.fStyle,
                    e.getFontByName(a.f).fFamily
                  )),
                  (P = h ? 0 : (u.w * a.s) / 100))
                : (P = e.measureText(p, a.f, a.s)),
              (x += P),
              r.push({
                l: P,
                an: P,
                add: y,
                n: h,
                anIndexes: [],
                val: p,
                line: v,
              }),
              2 == m)
            ) {
              if (((y += P), "" == p || "\xa0" == p || o == l - 1)) {
                for (("" == p || "\xa0" == p) && (y -= P); o >= g; )
                  (r[g].an = y), (r[g].ind = d), (r[g].extra = P), (g += 1);
                (d += 1), (y = 0);
              }
            } else if (3 == m) {
              if (((y += P), "" == p || o == l - 1)) {
                for ("" == p && (y -= P); o >= g; )
                  (r[g].an = y), (r[g].ind = d), (r[g].extra = P), (g += 1);
                (y = 0), (d += 1);
              }
            } else (r[d].ind = d), (r[d].extra = 0), (d += 1);
          if (((a.l = r), (E = x > E ? x : E), b.push(x), a.sz))
            (a.boxWidth = a.sz[0]), (a.justifyOffset = 0);
          else
            switch (((a.boxWidth = E), a.j)) {
              case 1:
                a.justifyOffset = -a.boxWidth;
                break;
              case 2:
                a.justifyOffset = -a.boxWidth / 2;
                break;
              default:
                a.justifyOffset = 0;
            }
          a.lineWidths = b;
          var M = t.t.a;
          f = M.length;
          var D,
            F,
            I = [];
          for (c = 0; f > c; c += 1) {
            for (
              M[c].a.sc && (a.strokeColorAnim = !0),
                M[c].a.sw && (a.strokeWidthAnim = !0),
                (M[c].a.fc || M[c].a.fh || M[c].a.fs || M[c].a.fb) &&
                  (a.fillColorAnim = !0),
                F = 0,
                D = M[c].s.b,
                o = 0;
              l > o;
              o += 1
            )
              (r[o].anIndexes[c] = F),
                ((1 == D && "" != r[o].val) ||
                  (2 == D && "" != r[o].val && "\xa0" != r[o].val) ||
                  (3 == D && (r[o].n || "\xa0" == r[o].val || o == l - 1)) ||
                  (4 == D && (r[o].n || o == l - 1))) &&
                  (1 === M[c].s.rn && I.push(F), (F += 1));
            t.t.a[c].s.totalChars = F;
            var _,
              N = -1;
            if (1 === M[c].s.rn)
              for (o = 0; l > o; o += 1)
                N != r[o].anIndexes[c] &&
                  ((N = r[o].anIndexes[c]),
                  (_ = I.splice(Math.floor(Math.random() * I.length), 1)[0])),
                  (r[o].anIndexes[c] = _);
          }
          0 !== f || "m" in t.t.p || (t.singleShape = !0),
            (a.yOffset = a.lh || 1.2 * a.s),
            (a.ls = a.ls || 0),
            (a.ascent = (w.ascent * a.s) / 100);
        }
      }
      var o = (function () {
          function t(t) {
            var e = t.t.d;
            t.t.d = { k: [{ s: e, t: 0 }] };
          }
          function e(e) {
            var r,
              i = e.length;
            for (r = 0; i > r; r += 1) 5 === e[r].ty && t(e[r]);
          }
          var r = [4, 4, 14];
          return function (t) {
            if (n(r, t.v) && (e(t.layers), t.assets)) {
              var i,
                s = t.assets.length;
              for (i = 0; s > i; i += 1)
                t.assets[i].layers && e(t.assets[i].layers);
            }
          };
        })(),
        l = (function () {
          function t(e) {
            var r,
              i,
              n,
              s = e.length;
            for (r = 0; s > r; r += 1)
              if ("gr" === e[r].ty) t(e[r].it);
              else if ("fl" === e[r].ty || "st" === e[r].ty)
                if (e[r].c.k && e[r].c.k[0].i)
                  for (n = e[r].c.k.length, i = 0; n > i; i += 1)
                    e[r].c.k[i].s &&
                      ((e[r].c.k[i].s[0] /= 255),
                      (e[r].c.k[i].s[1] /= 255),
                      (e[r].c.k[i].s[2] /= 255),
                      (e[r].c.k[i].s[3] /= 255)),
                      e[r].c.k[i].e &&
                        ((e[r].c.k[i].e[0] /= 255),
                        (e[r].c.k[i].e[1] /= 255),
                        (e[r].c.k[i].e[2] /= 255),
                        (e[r].c.k[i].e[3] /= 255));
                else
                  (e[r].c.k[0] /= 255),
                    (e[r].c.k[1] /= 255),
                    (e[r].c.k[2] /= 255),
                    (e[r].c.k[3] /= 255);
          }
          function e(e) {
            var r,
              i = e.length;
            for (r = 0; i > r; r += 1) 4 === e[r].ty && t(e[r].shapes);
          }
          var r = [4, 1, 9];
          return function (t) {
            if (n(r, t.v) && (e(t.layers), t.assets)) {
              var i,
                s = t.assets.length;
              for (i = 0; s > i; i += 1)
                t.assets[i].layers && e(t.assets[i].layers);
            }
          };
        })(),
        h = (function () {
          function t(e) {
            var r,
              i,
              n,
              s = e.length,
              a = !1;
            for (r = s - 1; r >= 0; r -= 1)
              if ("sh" == e[r].ty) {
                if (e[r].ks.k.i) e[r].ks.k.c = e[r].closed;
                else
                  for (n = e[r].ks.k.length, i = 0; n > i; i += 1)
                    e[r].ks.k[i].s && (e[r].ks.k[i].s[0].c = e[r].closed),
                      e[r].ks.k[i].e && (e[r].ks.k[i].e[0].c = e[r].closed);
                a = !0;
              } else "gr" == e[r].ty && t(e[r].it);
          }
          function e(e) {
            var r,
              i,
              n,
              s,
              a,
              o,
              l = e.length;
            for (i = 0; l > i; i += 1) {
              if (((r = e[i]), r.hasMask)) {
                var h = r.masksProperties;
                for (s = h.length, n = 0; s > n; n += 1)
                  if (h[n].pt.k.i) h[n].pt.k.c = h[n].cl;
                  else
                    for (o = h[n].pt.k.length, a = 0; o > a; a += 1)
                      h[n].pt.k[a].s && (h[n].pt.k[a].s[0].c = h[n].cl),
                        h[n].pt.k[a].e && (h[n].pt.k[a].e[0].c = h[n].cl);
              }
              4 === r.ty && t(r.shapes);
            }
          }
          var r = [4, 4, 18];
          return function (t) {
            if (n(r, t.v) && (e(t.layers), t.assets)) {
              var i,
                s = t.assets.length;
              for (i = 0; s > i; i += 1)
                t.assets[i].layers && e(t.assets[i].layers);
            }
          };
        })(),
        p = {};
      return (p.completeData = s), p;
    }
    function ShapePath() {
      (this.c = !1),
        (this._length = 0),
        (this._maxLength = 8),
        (this.v = Array.apply(null, { length: this._maxLength })),
        (this.o = Array.apply(null, { length: this._maxLength })),
        (this.i = Array.apply(null, { length: this._maxLength }));
    }
    function ShapeModifier() {}
    function TrimModifier() {}
    function RoundCornersModifier() {}
    function RepeaterModifier() {}
    function ShapeCollection() {
      (this._length = 0),
        (this._maxLength = 4),
        (this.shapes = Array.apply(null, { length: this._maxLength }));
    }
    function BaseRenderer() {}
    function SVGRenderer(t, e) {
      (this.animationItem = t),
        (this.layers = null),
        (this.renderedFrame = -1),
        (this.globalData = { frameNum: -1 }),
        (this.renderConfig = {
          preserveAspectRatio: (e && e.preserveAspectRatio) || "xMidYMid meet",
          progressiveLoad: (e && e.progressiveLoad) || !1,
        }),
        (this.elements = []),
        (this.pendingElements = []),
        (this.destroyed = !1);
    }
    function MaskElement(t, e, r) {
      (this.dynamicProperties = []),
        (this.data = t),
        (this.element = e),
        (this.globalData = r),
        (this.paths = []),
        (this.storedData = []),
        (this.masksProperties = this.data.masksProperties),
        (this.viewData = new Array(this.masksProperties.length)),
        (this.maskElement = null),
        (this.firstFrame = !0);
      var i,
        n,
        s,
        a,
        o,
        l,
        h,
        p,
        c = this.globalData.defs,
        f = this.masksProperties.length,
        u = this.masksProperties,
        d = 0,
        m = [],
        y = randomString(10),
        g = "clipPath",
        v = "clip-path";
      for (i = 0; f > i; i++)
        if (
          ((("a" !== u[i].mode && "n" !== u[i].mode) ||
            u[i].inv ||
            100 !== u[i].o.k) &&
            ((g = "mask"), (v = "mask")),
          ("s" != u[i].mode && "i" != u[i].mode) || 0 != d
            ? (o = null)
            : ((o = document.createElementNS(svgNS, "rect")),
              o.setAttribute("fill", "#ffffff"),
              o.setAttribute("width", this.element.comp.data.w),
              o.setAttribute("height", this.element.comp.data.h),
              m.push(o)),
          (n = document.createElementNS(svgNS, "path")),
          "n" != u[i].mode)
        ) {
          if (
            ((d += 1),
            "s" == u[i].mode
              ? n.setAttribute("fill", "#000000")
              : n.setAttribute("fill", "#ffffff"),
            n.setAttribute("clip-rule", "nonzero"),
            0 !== u[i].x.k)
          ) {
            (g = "mask"),
              (v = "mask"),
              (p = PropertyFactory.getProp(
                this.element,
                u[i].x,
                0,
                null,
                this.dynamicProperties
              ));
            var b = "fi_" + randomString(10);
            (l = document.createElementNS(svgNS, "filter")),
              l.setAttribute("id", b),
              (h = document.createElementNS(svgNS, "feMorphology")),
              h.setAttribute("operator", "dilate"),
              h.setAttribute("in", "SourceGraphic"),
              h.setAttribute("radius", "0"),
              l.appendChild(h),
              c.appendChild(l),
              "s" == u[i].mode
                ? n.setAttribute("stroke", "#000000")
                : n.setAttribute("stroke", "#ffffff");
          } else (h = null), (p = null);
          if (
            ((this.storedData[i] = {
              elem: n,
              x: p,
              expan: h,
              lastPath: "",
              lastOperator: "",
              filterId: b,
              lastRadius: 0,
            }),
            "i" == u[i].mode)
          ) {
            a = m.length;
            var x = document.createElementNS(svgNS, "g");
            for (s = 0; a > s; s += 1) x.appendChild(m[s]);
            var E = document.createElementNS(svgNS, "mask");
            E.setAttribute("mask-type", "alpha"),
              E.setAttribute("id", y + "_" + d),
              E.appendChild(n),
              c.appendChild(E),
              x.setAttribute("mask", "url(#" + y + "_" + d + ")"),
              (m.length = 0),
              m.push(x);
          } else m.push(n);
          u[i].inv &&
            !this.solidPath &&
            (this.solidPath = this.createLayerSolidPath()),
            (this.viewData[i] = {
              elem: n,
              lastPath: "",
              op: PropertyFactory.getProp(
                this.element,
                u[i].o,
                0,
                0.01,
                this.dynamicProperties
              ),
              prop: ShapePropertyFactory.getShapeProp(
                this.element,
                u[i],
                3,
                this.dynamicProperties,
                null
              ),
            }),
            o && (this.viewData[i].invRect = o),
            this.viewData[i].prop.k ||
              this.drawPath(u[i], this.viewData[i].prop.v, this.viewData[i]);
        } else
          (this.viewData[i] = {
            op: PropertyFactory.getProp(
              this.element,
              u[i].o,
              0,
              0.01,
              this.dynamicProperties
            ),
            prop: ShapePropertyFactory.getShapeProp(
              this.element,
              u[i],
              3,
              this.dynamicProperties,
              null
            ),
            elem: n,
          }),
            c.appendChild(n);
      for (
        this.maskElement = document.createElementNS(svgNS, g),
          f = m.length,
          i = 0;
        f > i;
        i += 1
      )
        this.maskElement.appendChild(m[i]);
      this.maskElement.setAttribute("id", y),
        d > 0 && this.element.maskedElement.setAttribute(v, "url(#" + y + ")"),
        c.appendChild(this.maskElement);
    }
    function BaseElement() {}
    function SVGBaseElement(t, e, r, i, n) {
      (this.globalData = r),
        (this.comp = i),
        (this.data = t),
        (this.matteElement = null),
        (this.transformedElement = null),
        (this.parentContainer = e),
        (this.layerId = n ? n.layerId : "ly_" + randomString(10)),
        (this.placeholder = n),
        this.init();
    }
    function ITextElement(t, e, r, i) {}
    function SVGTextElement(t, e, r, i, n) {
      (this.textSpans = []),
        (this.renderType = "svg"),
        this._parent.constructor.call(this, t, e, r, i, n);
    }
    function SVGTintFilter(t, e) {
      this.filterManager = e;
      var r = document.createElementNS(svgNS, "feColorMatrix");
      if (
        (r.setAttribute("type", "matrix"),
        r.setAttribute("color-interpolation-filters", "linearRGB"),
        r.setAttribute(
          "values",
          "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
        ),
        r.setAttribute("result", "f1"),
        t.appendChild(r),
        (r = document.createElementNS(svgNS, "feColorMatrix")),
        r.setAttribute("type", "matrix"),
        r.setAttribute("color-interpolation-filters", "sRGB"),
        r.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"),
        r.setAttribute("result", "f2"),
        t.appendChild(r),
        (this.matrixFilter = r),
        100 !== e.effectElements[2].p.v || e.effectElements[2].p.k)
      ) {
        var i = document.createElementNS(svgNS, "feMerge");
        t.appendChild(i);
        var n;
        (n = document.createElementNS(svgNS, "feMergeNode")),
          n.setAttribute("in", "SourceGraphic"),
          i.appendChild(n),
          (n = document.createElementNS(svgNS, "feMergeNode")),
          n.setAttribute("in", "f2"),
          i.appendChild(n);
      }
    }
    function SVGFillFilter(t, e) {
      this.filterManager = e;
      var r = document.createElementNS(svgNS, "feColorMatrix");
      r.setAttribute("type", "matrix"),
        r.setAttribute("color-interpolation-filters", "sRGB"),
        r.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"),
        t.appendChild(r),
        (this.matrixFilter = r);
    }
    function SVGStrokeEffect(t, e) {
      (this.initialized = !1),
        (this.filterManager = e),
        (this.elem = t),
        (this.paths = []);
    }
    function SVGTritoneFilter(t, e) {
      this.filterManager = e;
      var r = document.createElementNS(svgNS, "feColorMatrix");
      r.setAttribute("type", "matrix"),
        r.setAttribute("color-interpolation-filters", "linearRGB"),
        r.setAttribute(
          "values",
          "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
        ),
        r.setAttribute("result", "f1"),
        t.appendChild(r);
      var i = document.createElementNS(svgNS, "feComponentTransfer");
      i.setAttribute("color-interpolation-filters", "sRGB"),
        t.appendChild(i),
        (this.matrixFilter = i);
      var n = document.createElementNS(svgNS, "feFuncR");
      n.setAttribute("type", "table"), i.appendChild(n), (this.feFuncR = n);
      var s = document.createElementNS(svgNS, "feFuncG");
      s.setAttribute("type", "table"), i.appendChild(s), (this.feFuncG = s);
      var a = document.createElementNS(svgNS, "feFuncB");
      a.setAttribute("type", "table"), i.appendChild(a), (this.feFuncB = a);
    }
    function SVGProLevelsFilter(t, e) {
      this.filterManager = e;
      var r = this.filterManager.effectElements,
        i = document.createElementNS(svgNS, "feComponentTransfer");
      (r[9].p.k ||
        0 !== r[9].p.v ||
        r[10].p.k ||
        1 !== r[10].p.v ||
        r[11].p.k ||
        1 !== r[11].p.v ||
        r[12].p.k ||
        0 !== r[12].p.v ||
        r[13].p.k ||
        1 !== r[13].p.v) &&
        (this.feFuncR = this.createFeFunc("feFuncR", i)),
        (r[16].p.k ||
          0 !== r[16].p.v ||
          r[17].p.k ||
          1 !== r[17].p.v ||
          r[18].p.k ||
          1 !== r[18].p.v ||
          r[19].p.k ||
          0 !== r[19].p.v ||
          r[20].p.k ||
          1 !== r[20].p.v) &&
          (this.feFuncG = this.createFeFunc("feFuncG", i)),
        (r[23].p.k ||
          0 !== r[23].p.v ||
          r[24].p.k ||
          1 !== r[24].p.v ||
          r[25].p.k ||
          1 !== r[25].p.v ||
          r[26].p.k ||
          0 !== r[26].p.v ||
          r[27].p.k ||
          1 !== r[27].p.v) &&
          (this.feFuncB = this.createFeFunc("feFuncB", i)),
        (r[30].p.k ||
          0 !== r[30].p.v ||
          r[31].p.k ||
          1 !== r[31].p.v ||
          r[32].p.k ||
          1 !== r[32].p.v ||
          r[33].p.k ||
          0 !== r[33].p.v ||
          r[34].p.k ||
          1 !== r[34].p.v) &&
          (this.feFuncA = this.createFeFunc("feFuncA", i)),
        (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
          (i.setAttribute("color-interpolation-filters", "sRGB"),
          t.appendChild(i),
          (i = document.createElementNS(svgNS, "feComponentTransfer"))),
        (r[2].p.k ||
          0 !== r[2].p.v ||
          r[3].p.k ||
          1 !== r[3].p.v ||
          r[4].p.k ||
          1 !== r[4].p.v ||
          r[5].p.k ||
          0 !== r[5].p.v ||
          r[6].p.k ||
          1 !== r[6].p.v) &&
          (i.setAttribute("color-interpolation-filters", "sRGB"),
          t.appendChild(i),
          (this.feFuncRComposed = this.createFeFunc("feFuncR", i)),
          (this.feFuncGComposed = this.createFeFunc("feFuncG", i)),
          (this.feFuncBComposed = this.createFeFunc("feFuncB", i)));
    }
    function SVGDropShadowEffect(t, e) {
      t.setAttribute("x", "-100%"),
        t.setAttribute("y", "-100%"),
        t.setAttribute("width", "400%"),
        t.setAttribute("height", "400%"),
        (this.filterManager = e);
      var r = document.createElementNS(svgNS, "feGaussianBlur");
      r.setAttribute("in", "SourceAlpha"),
        r.setAttribute("result", "drop_shadow_1"),
        r.setAttribute("stdDeviation", "0"),
        (this.feGaussianBlur = r),
        t.appendChild(r);
      var i = document.createElementNS(svgNS, "feOffset");
      i.setAttribute("dx", "25"),
        i.setAttribute("dy", "0"),
        i.setAttribute("in", "drop_shadow_1"),
        i.setAttribute("result", "drop_shadow_2"),
        (this.feOffset = i),
        t.appendChild(i);
      var n = document.createElementNS(svgNS, "feFlood");
      n.setAttribute("flood-color", "#00ff00"),
        n.setAttribute("flood-opacity", "1"),
        n.setAttribute("result", "drop_shadow_3"),
        (this.feFlood = n),
        t.appendChild(n);
      var s = document.createElementNS(svgNS, "feComposite");
      s.setAttribute("in", "drop_shadow_3"),
        s.setAttribute("in2", "drop_shadow_2"),
        s.setAttribute("operator", "in"),
        s.setAttribute("result", "drop_shadow_4"),
        t.appendChild(s);
      var a = document.createElementNS(svgNS, "feMerge");
      t.appendChild(a);
      var o;
      (o = document.createElementNS(svgNS, "feMergeNode")),
        a.appendChild(o),
        (o = document.createElementNS(svgNS, "feMergeNode")),
        o.setAttribute("in", "SourceGraphic"),
        (this.feMergeNode = o),
        (this.feMerge = a),
        (this.originalNodeAdded = !1),
        a.appendChild(o);
    }
    function SVGEffects(t) {
      var e,
        r = t.data.ef.length,
        i = randomString(10),
        n = filtersFactory.createFilter(i),
        s = 0;
      this.filters = [];
      var a;
      for (e = 0; r > e; e += 1)
        20 === t.data.ef[e].ty
          ? ((s += 1),
            (a = new SVGTintFilter(n, t.effects.effectElements[e])),
            this.filters.push(a))
          : 21 === t.data.ef[e].ty
          ? ((s += 1),
            (a = new SVGFillFilter(n, t.effects.effectElements[e])),
            this.filters.push(a))
          : 22 === t.data.ef[e].ty
          ? ((a = new SVGStrokeEffect(t, t.effects.effectElements[e])),
            this.filters.push(a))
          : 23 === t.data.ef[e].ty
          ? ((s += 1),
            (a = new SVGTritoneFilter(n, t.effects.effectElements[e])),
            this.filters.push(a))
          : 24 === t.data.ef[e].ty
          ? ((s += 1),
            (a = new SVGProLevelsFilter(n, t.effects.effectElements[e])),
            this.filters.push(a))
          : 25 === t.data.ef[e].ty &&
            ((s += 1),
            (a = new SVGDropShadowEffect(n, t.effects.effectElements[e])),
            this.filters.push(a));
      s &&
        (t.globalData.defs.appendChild(n),
        t.layerElement.setAttribute("filter", "url(#" + i + ")"));
    }
    function ICompElement(t, e, r, i, n) {
      this._parent.constructor.call(this, t, e, r, i, n),
        (this.layers = t.layers),
        (this.supports3d = !0),
        (this.completeLayers = !1),
        (this.pendingElements = []),
        (this.elements = this.layers
          ? Array.apply(null, { length: this.layers.length })
          : []),
        this.data.tm &&
          (this.tm = PropertyFactory.getProp(
            this,
            this.data.tm,
            0,
            r.frameRate,
            this.dynamicProperties
          )),
        this.data.xt
          ? ((this.layerElement = document.createElementNS(svgNS, "g")),
            this.buildAllItems())
          : r.progressiveLoad || this.buildAllItems();
    }
    function IImageElement(t, e, r, i, n) {
      (this.assetData = r.getAssetData(t.refId)),
        this._parent.constructor.call(this, t, e, r, i, n);
    }
    function IShapeElement(t, e, r, i, n) {
      (this.shapes = []),
        (this.shapesData = t.shapes),
        (this.stylesList = []),
        (this.viewData = []),
        (this.shapeModifiers = []),
        this._parent.constructor.call(this, t, e, r, i, n);
    }
    function ISolidElement(t, e, r, i, n) {
      this._parent.constructor.call(this, t, e, r, i, n);
    }
    function CanvasRenderer(t, e) {
      (this.animationItem = t),
        (this.renderConfig = {
          clearCanvas: e && void 0 !== e.clearCanvas ? e.clearCanvas : !0,
          context: (e && e.context) || null,
          progressiveLoad: (e && e.progressiveLoad) || !1,
          preserveAspectRatio: (e && e.preserveAspectRatio) || "xMidYMid meet",
        }),
        (this.renderConfig.dpr = (e && e.dpr) || 1),
        this.animationItem.wrapper &&
          (this.renderConfig.dpr =
            (e && e.dpr) || window.devicePixelRatio || 1),
        (this.renderedFrame = -1),
        (this.globalData = { frameNum: -1 }),
        (this.contextData = {
          saved: Array.apply(null, { length: 15 }),
          savedOp: Array.apply(null, { length: 15 }),
          cArrPos: 0,
          cTr: new Matrix(),
          cO: 1,
        });
      var r,
        i = 15;
      for (r = 0; i > r; r += 1)
        this.contextData.saved[r] = Array.apply(null, { length: 16 });
      (this.elements = []),
        (this.pendingElements = []),
        (this.transformMat = new Matrix()),
        (this.completeLayers = !1);
    }
    function HybridRenderer(t) {
      (this.animationItem = t),
        (this.layers = null),
        (this.renderedFrame = -1),
        (this.globalData = { frameNum: -1 }),
        (this.pendingElements = []),
        (this.elements = []),
        (this.threeDElements = []),
        (this.destroyed = !1),
        (this.camera = null),
        (this.supports3d = !0);
    }
    function CVBaseElement(t, e, r) {
      (this.globalData = r),
        (this.data = t),
        (this.comp = e),
        (this.canvasContext = r.canvasContext),
        this.init();
    }
    function CVCompElement(t, e, r) {
      this._parent.constructor.call(this, t, e, r);
      var i = {};
      for (var n in r) r.hasOwnProperty(n) && (i[n] = r[n]);
      (i.renderer = this),
        (i.compHeight = this.data.h),
        (i.compWidth = this.data.w),
        (this.renderConfig = { clearCanvas: !0 }),
        (this.contextData = {
          saved: Array.apply(null, { length: 15 }),
          savedOp: Array.apply(null, { length: 15 }),
          cArrPos: 0,
          cTr: new Matrix(),
          cO: 1,
        }),
        (this.completeLayers = !1);
      var s,
        a = 15;
      for (s = 0; a > s; s += 1)
        this.contextData.saved[s] = Array.apply(null, { length: 16 });
      (this.transformMat = new Matrix()),
        (this.parentGlobalData = this.globalData);
      var o = document.createElement("canvas");
      (i.canvasContext = o.getContext("2d")),
        (this.canvasContext = i.canvasContext),
        (o.width = this.data.w),
        (o.height = this.data.h),
        (this.canvas = o),
        (this.globalData = i),
        (this.layers = t.layers),
        (this.pendingElements = []),
        (this.elements = Array.apply(null, { length: this.layers.length })),
        this.data.tm &&
          (this.tm = PropertyFactory.getProp(
            this,
            this.data.tm,
            0,
            r.frameRate,
            this.dynamicProperties
          )),
        (this.data.xt || !r.progressiveLoad) && this.buildAllItems();
    }
    function CVImageElement(t, e, r) {
      (this.assetData = r.getAssetData(t.refId)),
        this._parent.constructor.call(this, t, e, r),
        this.globalData.addPendingElement();
    }
    function CVMaskElement(t, e) {
      (this.data = t),
        (this.element = e),
        (this.dynamicProperties = []),
        (this.masksProperties = this.data.masksProperties),
        (this.viewData = new Array(this.masksProperties.length));
      var r,
        i = this.masksProperties.length;
      for (r = 0; i > r; r++)
        this.viewData[r] = ShapePropertyFactory.getShapeProp(
          this.element,
          this.masksProperties[r],
          3,
          this.dynamicProperties,
          null
        );
    }
    function CVShapeElement(t, e, r) {
      (this.shapes = []),
        (this.stylesList = []),
        (this.viewData = []),
        (this.shapeModifiers = []),
        (this.shapesData = t.shapes),
        (this.firstFrame = !0),
        this._parent.constructor.call(this, t, e, r);
    }
    function CVSolidElement(t, e, r) {
      this._parent.constructor.call(this, t, e, r);
    }
    function CVTextElement(t, e, r) {
      (this.textSpans = []),
        (this.yOffset = 0),
        (this.fillColorAnim = !1),
        (this.strokeColorAnim = !1),
        (this.strokeWidthAnim = !1),
        (this.stroke = !1),
        (this.fill = !1),
        (this.justifyOffset = 0),
        (this.currentRender = null),
        (this.renderType = "canvas"),
        (this.values = {
          fill: "rgba(0,0,0,0)",
          stroke: "rgba(0,0,0,0)",
          sWidth: 0,
          fValue: "",
        }),
        this._parent.constructor.call(this, t, e, r);
    }
    function HBaseElement(t, e, r, i, n) {
      (this.globalData = r),
        (this.comp = i),
        (this.data = t),
        (this.matteElement = null),
        (this.parentContainer = e),
        (this.layerId = n ? n.layerId : "ly_" + randomString(10)),
        (this.placeholder = n),
        this.init();
    }
    function HSolidElement(t, e, r, i, n) {
      this._parent.constructor.call(this, t, e, r, i, n);
    }
    function HCompElement(t, e, r, i, n) {
      this._parent.constructor.call(this, t, e, r, i, n),
        (this.layers = t.layers),
        (this.supports3d = !0),
        (this.completeLayers = !1),
        (this.pendingElements = []),
        (this.elements = Array.apply(null, { length: this.layers.length })),
        this.data.tm &&
          (this.tm = PropertyFactory.getProp(
            this,
            this.data.tm,
            0,
            r.frameRate,
            this.dynamicProperties
          )),
        this.data.hasMask && (this.supports3d = !1),
        this.data.xt && (this.layerElement = document.createElement("div")),
        this.buildAllItems();
    }
    function HShapeElement(t, e, r, i, n) {
      (this.shapes = []),
        (this.shapeModifiers = []),
        (this.shapesData = t.shapes),
        (this.stylesList = []),
        (this.viewData = []),
        this._parent.constructor.call(this, t, e, r, i, n),
        (this.addedTransforms = { mdf: !1, mats: [this.finalTransform.mat] }),
        (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 });
    }
    function HTextElement(t, e, r, i, n) {
      (this.textSpans = []),
        (this.textPaths = []),
        (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
        (this.renderType = "svg"),
        (this.isMasked = !1),
        this._parent.constructor.call(this, t, e, r, i, n);
    }
    function HImageElement(t, e, r, i, n) {
      (this.assetData = r.getAssetData(t.refId)),
        this._parent.constructor.call(this, t, e, r, i, n);
    }
    function HCameraElement(t, e, r, i, n) {
      if (
        (this._parent.constructor.call(this, t, e, r, i, n),
        (this.pe = PropertyFactory.getProp(
          this,
          t.pe,
          0,
          0,
          this.dynamicProperties
        )),
        t.ks.p.s
          ? ((this.px = PropertyFactory.getProp(
              this,
              t.ks.p.x,
              1,
              0,
              this.dynamicProperties
            )),
            (this.py = PropertyFactory.getProp(
              this,
              t.ks.p.y,
              1,
              0,
              this.dynamicProperties
            )),
            (this.pz = PropertyFactory.getProp(
              this,
              t.ks.p.z,
              1,
              0,
              this.dynamicProperties
            )))
          : (this.p = PropertyFactory.getProp(
              this,
              t.ks.p,
              1,
              0,
              this.dynamicProperties
            )),
        t.ks.a &&
          (this.a = PropertyFactory.getProp(
            this,
            t.ks.a,
            1,
            0,
            this.dynamicProperties
          )),
        t.ks.or.k.length && t.ks.or.k[0].to)
      ) {
        var s,
          a = t.ks.or.k.length;
        for (s = 0; a > s; s += 1)
          (t.ks.or.k[s].to = null), (t.ks.or.k[s].ti = null);
      }
      (this.or = PropertyFactory.getProp(
        this,
        t.ks.or,
        1,
        degToRads,
        this.dynamicProperties
      )),
        (this.or.sh = !0),
        (this.rx = PropertyFactory.getProp(
          this,
          t.ks.rx,
          0,
          degToRads,
          this.dynamicProperties
        )),
        (this.ry = PropertyFactory.getProp(
          this,
          t.ks.ry,
          0,
          degToRads,
          this.dynamicProperties
        )),
        (this.rz = PropertyFactory.getProp(
          this,
          t.ks.rz,
          0,
          degToRads,
          this.dynamicProperties
        )),
        (this.mat = new Matrix());
    }
    function SliderEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
    }
    function AngleEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
    }
    function ColorEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
    }
    function PointEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
    }
    function LayerIndexEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
    }
    function MaskIndexEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
    }
    function CheckboxEffect(t, e, r) {
      this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
    }
    function NoValueEffect() {
      this.p = {};
    }
    function EffectsManager(t, e, r) {
      var i = t.ef;
      this.effectElements = [];
      var n,
        s,
        a = i.length;
      for (n = 0; a > n; n++)
        (s = new GroupEffect(i[n], e, r)), this.effectElements.push(s);
    }
    function GroupEffect(t, e, r) {
      (this.dynamicProperties = []),
        this.init(t, e, this.dynamicProperties),
        this.dynamicProperties.length && r.push(this);
    }
    function play(t) {
      animationManager.play(t);
    }
    function pause(t) {
      animationManager.pause(t);
    }
    function togglePause(t) {
      animationManager.togglePause(t);
    }
    function setSpeed(t, e) {
      animationManager.setSpeed(t, e);
    }
    function setDirection(t, e) {
      animationManager.setDirection(t, e);
    }
    function stop(t) {
      animationManager.stop(t);
    }
    function moveFrame(t) {
      animationManager.moveFrame(t);
    }
    function searchAnimations() {
      standalone === !0
        ? animationManager.searchAnimations(animationData, standalone, renderer)
        : animationManager.searchAnimations();
    }
    function registerAnimation(t) {
      return animationManager.registerAnimation(t);
    }
    function resize() {
      animationManager.resize();
    }
    function start() {
      animationManager.start();
    }
    function goToAndStop(t, e, r) {
      animationManager.goToAndStop(t, e, r);
    }
    function setSubframeRendering(t) {
      subframeEnabled = t;
    }
    function loadAnimation(t) {
      return (
        standalone === !0 && (t.animationData = JSON.parse(animationData)),
        animationManager.loadAnimation(t)
      );
    }
    function destroy(t) {
      return animationManager.destroy(t);
    }
    function setQuality(t) {
      if ("string" == typeof t)
        switch (t) {
          case "high":
            defaultCurveSegments = 200;
            break;
          case "medium":
            defaultCurveSegments = 50;
            break;
          case "low":
            defaultCurveSegments = 10;
        }
      else !isNaN(t) && t > 1 && (defaultCurveSegments = t);
      roundValues(defaultCurveSegments >= 50 ? !1 : !0);
    }
    function installPlugin(t, e) {
      "expressions" === t && (expressionsPlugin = e);
    }
    function getFactory(t) {
      switch (t) {
        case "propertyFactory":
          return PropertyFactory;
        case "shapePropertyFactory":
          return ShapePropertyFactory;
        case "matrix":
          return Matrix;
      }
    }
    function checkReady() {
      "complete" === document.readyState &&
        (clearInterval(readyStateCheckInterval), searchAnimations());
    }
    function getQueryVariable(t) {
      for (var e = queryString.split("&"), r = 0; r < e.length; r++) {
        var i = e[r].split("=");
        if (decodeURIComponent(i[0]) == t) return decodeURIComponent(i[1]);
      }
    }
    var svgNS = "http://www.w3.org/2000/svg",
      subframeEnabled = !0,
      expressionsPlugin,
      isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
      cachedColors = {},
      bm_rounder = Math.round,
      bm_rnd,
      bm_pow = Math.pow,
      bm_sqrt = Math.sqrt,
      bm_abs = Math.abs,
      bm_floor = Math.floor,
      bm_max = Math.max,
      bm_min = Math.min,
      blitter = 10,
      BMMath = {};
    !(function () {
      var t,
        e = Object.getOwnPropertyNames(Math),
        r = e.length;
      for (t = 0; r > t; t += 1) BMMath[e[t]] = Math[e[t]];
    })(),
      (BMMath.random = Math.random),
      (BMMath.abs = function (t) {
        var e = typeof t;
        if ("object" === e && t.length) {
          var r,
            i = Array.apply(null, { length: t.length }),
            n = t.length;
          for (r = 0; n > r; r += 1) i[r] = Math.abs(t[r]);
          return i;
        }
        return Math.abs(t);
      });
    var defaultCurveSegments = 150,
      degToRads = Math.PI / 180,
      roundCorner = 0.5519;
    roundValues(!1);
    var rgbToHex = (function () {
        var t,
          e,
          r = [];
        for (t = 0; 256 > t; t += 1)
          (e = t.toString(16)), (r[t] = 1 == e.length ? "0" + e : e);
        return function (t, e, i) {
          return (
            0 > t && (t = 0),
            0 > e && (e = 0),
            0 > i && (i = 0),
            "#" + r[t] + r[e] + r[i]
          );
        };
      })(),
      fillColorToString = (function () {
        var t = [];
        return function (e, r) {
          return (
            void 0 !== r && (e[3] = r),
            t[e[0]] || (t[e[0]] = {}),
            t[e[0]][e[1]] || (t[e[0]][e[1]] = {}),
            t[e[0]][e[1]][e[2]] || (t[e[0]][e[1]][e[2]] = {}),
            t[e[0]][e[1]][e[2]][e[3]] ||
              (t[e[0]][e[1]][e[2]][e[3]] = "rgba(" + e.join(",") + ")"),
            t[e[0]][e[1]][e[2]][e[3]]
          );
        };
      })(),
      Matrix = (function () {
        function t() {
          return (
            (this.props[0] = 1),
            (this.props[1] = 0),
            (this.props[2] = 0),
            (this.props[3] = 0),
            (this.props[4] = 0),
            (this.props[5] = 1),
            (this.props[6] = 0),
            (this.props[7] = 0),
            (this.props[8] = 0),
            (this.props[9] = 0),
            (this.props[10] = 1),
            (this.props[11] = 0),
            (this.props[12] = 0),
            (this.props[13] = 0),
            (this.props[14] = 0),
            (this.props[15] = 1),
            this
          );
        }
        function e(t) {
          if (0 === t) return this;
          var e = Math.cos(t),
            r = Math.sin(t);
          return this._t(e, -r, 0, 0, r, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function r(t) {
          if (0 === t) return this;
          var e = Math.cos(t),
            r = Math.sin(t);
          return this._t(1, 0, 0, 0, 0, e, -r, 0, 0, r, e, 0, 0, 0, 0, 1);
        }
        function i(t) {
          if (0 === t) return this;
          var e = Math.cos(t),
            r = Math.sin(t);
          return this._t(e, 0, r, 0, 0, 1, 0, 0, -r, 0, e, 0, 0, 0, 0, 1);
        }
        function n(t) {
          if (0 === t) return this;
          var e = Math.cos(t),
            r = Math.sin(t);
          return this._t(e, -r, 0, 0, r, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function s(t, e) {
          return this._t(1, e, t, 1, 0, 0);
        }
        function a(t, e) {
          return this.shear(Math.tan(t), Math.tan(e));
        }
        function o(t, e) {
          var r = Math.cos(e),
            i = Math.sin(e);
          return this._t(r, i, 0, 0, -i, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(1, 0, 0, 0, Math.tan(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(r, -i, 0, 0, i, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function l(t, e, r) {
          return (
            (r = isNaN(r) ? 1 : r),
            1 == t && 1 == e && 1 == r
              ? this
              : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, r, 0, 0, 0, 0, 1)
          );
        }
        function h(t, e, r, i, n, s, a, o, l, h, p, c, f, u, d, m) {
          return (
            (this.props[0] = t),
            (this.props[1] = e),
            (this.props[2] = r),
            (this.props[3] = i),
            (this.props[4] = n),
            (this.props[5] = s),
            (this.props[6] = a),
            (this.props[7] = o),
            (this.props[8] = l),
            (this.props[9] = h),
            (this.props[10] = p),
            (this.props[11] = c),
            (this.props[12] = f),
            (this.props[13] = u),
            (this.props[14] = d),
            (this.props[15] = m),
            this
          );
        }
        function p(t, e, r) {
          return (
            (r = r || 0),
            0 !== t || 0 !== e || 0 !== r
              ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, r, 1)
              : this
          );
        }
        function c(t, e, r, i, n, s, a, o, l, h, p, c, f, u, d, m) {
          if (
            1 === t &&
            0 === e &&
            0 === r &&
            0 === i &&
            0 === n &&
            1 === s &&
            0 === a &&
            0 === o &&
            0 === l &&
            0 === h &&
            1 === p &&
            0 === c
          )
            return (
              (0 !== f || 0 !== u || 0 !== d) &&
                ((this.props[12] =
                  this.props[12] * t +
                  this.props[13] * n +
                  this.props[14] * l +
                  this.props[15] * f),
                (this.props[13] =
                  this.props[12] * e +
                  this.props[13] * s +
                  this.props[14] * h +
                  this.props[15] * u),
                (this.props[14] =
                  this.props[12] * r +
                  this.props[13] * a +
                  this.props[14] * p +
                  this.props[15] * d),
                (this.props[15] =
                  this.props[12] * i +
                  this.props[13] * o +
                  this.props[14] * c +
                  this.props[15] * m)),
              this
            );
          var y = this.props[0],
            g = this.props[1],
            v = this.props[2],
            b = this.props[3],
            x = this.props[4],
            E = this.props[5],
            w = this.props[6],
            P = this.props[7],
            S = this.props[8],
            C = this.props[9],
            k = this.props[10],
            T = this.props[11],
            A = this.props[12],
            M = this.props[13],
            D = this.props[14],
            F = this.props[15];
          return (
            (this.props[0] = y * t + g * n + v * l + b * f),
            (this.props[1] = y * e + g * s + v * h + b * u),
            (this.props[2] = y * r + g * a + v * p + b * d),
            (this.props[3] = y * i + g * o + v * c + b * m),
            (this.props[4] = x * t + E * n + w * l + P * f),
            (this.props[5] = x * e + E * s + w * h + P * u),
            (this.props[6] = x * r + E * a + w * p + P * d),
            (this.props[7] = x * i + E * o + w * c + P * m),
            (this.props[8] = S * t + C * n + k * l + T * f),
            (this.props[9] = S * e + C * s + k * h + T * u),
            (this.props[10] = S * r + C * a + k * p + T * d),
            (this.props[11] = S * i + C * o + k * c + T * m),
            (this.props[12] = A * t + M * n + D * l + F * f),
            (this.props[13] = A * e + M * s + D * h + F * u),
            (this.props[14] = A * r + M * a + D * p + F * d),
            (this.props[15] = A * i + M * o + D * c + F * m),
            this
          );
        }
        function f(t) {
          var e;
          for (e = 0; 16 > e; e += 1) t.props[e] = this.props[e];
        }
        function u(t) {
          var e;
          for (e = 0; 16 > e; e += 1) this.props[e] = t[e];
        }
        function d(t, e, r) {
          return {
            x:
              t * this.props[0] +
              e * this.props[4] +
              r * this.props[8] +
              this.props[12],
            y:
              t * this.props[1] +
              e * this.props[5] +
              r * this.props[9] +
              this.props[13],
            z:
              t * this.props[2] +
              e * this.props[6] +
              r * this.props[10] +
              this.props[14],
          };
        }
        function m(t, e, r) {
          return (
            t * this.props[0] +
            e * this.props[4] +
            r * this.props[8] +
            this.props[12]
          );
        }
        function y(t, e, r) {
          return (
            t * this.props[1] +
            e * this.props[5] +
            r * this.props[9] +
            this.props[13]
          );
        }
        function g(t, e, r) {
          return (
            t * this.props[2] +
            e * this.props[6] +
            r * this.props[10] +
            this.props[14]
          );
        }
        function v(t) {
          var e,
            r = this.props[0] * this.props[5] - this.props[1] * this.props[4],
            i = this.props[5] / r,
            n = -this.props[1] / r,
            s = -this.props[4] / r,
            a = this.props[0] / r,
            o =
              (this.props[4] * this.props[13] -
                this.props[5] * this.props[12]) /
              r,
            l =
              -(
                this.props[0] * this.props[13] -
                this.props[1] * this.props[12]
              ) / r,
            h = t.length,
            p = [];
          for (e = 0; h > e; e += 1)
            p[e] = [
              t[e][0] * i + t[e][1] * s + o,
              t[e][0] * n + t[e][1] * a + l,
              0,
            ];
          return p;
        }
        function b(t, e, r, i) {
          if (i && 2 === i) {
            var n = point_pool.newPoint();
            return (
              (n[0] =
                t * this.props[0] +
                e * this.props[4] +
                r * this.props[8] +
                this.props[12]),
              (n[1] =
                t * this.props[1] +
                e * this.props[5] +
                r * this.props[9] +
                this.props[13]),
              n
            );
          }
          return [
            t * this.props[0] +
              e * this.props[4] +
              r * this.props[8] +
              this.props[12],
            t * this.props[1] +
              e * this.props[5] +
              r * this.props[9] +
              this.props[13],
            t * this.props[2] +
              e * this.props[6] +
              r * this.props[10] +
              this.props[14],
          ];
        }
        function x(t, e) {
          return (
            bm_rnd(t * this.props[0] + e * this.props[4] + this.props[12]) +
            "," +
            bm_rnd(t * this.props[1] + e * this.props[5] + this.props[13])
          );
        }
        function E() {
          return [
            this.props[0],
            this.props[1],
            this.props[2],
            this.props[3],
            this.props[4],
            this.props[5],
            this.props[6],
            this.props[7],
            this.props[8],
            this.props[9],
            this.props[10],
            this.props[11],
            this.props[12],
            this.props[13],
            this.props[14],
            this.props[15],
          ];
        }
        function w() {
          return isSafari
            ? "matrix3d(" +
                roundTo2Decimals(this.props[0]) +
                "," +
                roundTo2Decimals(this.props[1]) +
                "," +
                roundTo2Decimals(this.props[2]) +
                "," +
                roundTo2Decimals(this.props[3]) +
                "," +
                roundTo2Decimals(this.props[4]) +
                "," +
                roundTo2Decimals(this.props[5]) +
                "," +
                roundTo2Decimals(this.props[6]) +
                "," +
                roundTo2Decimals(this.props[7]) +
                "," +
                roundTo2Decimals(this.props[8]) +
                "," +
                roundTo2Decimals(this.props[9]) +
                "," +
                roundTo2Decimals(this.props[10]) +
                "," +
                roundTo2Decimals(this.props[11]) +
                "," +
                roundTo2Decimals(this.props[12]) +
                "," +
                roundTo2Decimals(this.props[13]) +
                "," +
                roundTo2Decimals(this.props[14]) +
                "," +
                roundTo2Decimals(this.props[15]) +
                ")"
            : ((this.cssParts[1] = this.props.join(",")),
              this.cssParts.join(""));
        }
        function P() {
          return (
            "matrix(" +
            this.props[0] +
            "," +
            this.props[1] +
            "," +
            this.props[4] +
            "," +
            this.props[5] +
            "," +
            this.props[12] +
            "," +
            this.props[13] +
            ")"
          );
        }
        function S() {
          return "" + this.toArray();
        }
        return function () {
          (this.reset = t),
            (this.rotate = e),
            (this.rotateX = r),
            (this.rotateY = i),
            (this.rotateZ = n),
            (this.skew = a),
            (this.skewFromAxis = o),
            (this.shear = s),
            (this.scale = l),
            (this.setTransform = h),
            (this.translate = p),
            (this.transform = c),
            (this.applyToPoint = d),
            (this.applyToX = m),
            (this.applyToY = y),
            (this.applyToZ = g),
            (this.applyToPointArray = b),
            (this.applyToPointStringified = x),
            (this.toArray = E),
            (this.toCSS = w),
            (this.to2dCSS = P),
            (this.toString = S),
            (this.clone = f),
            (this.cloneFromProps = u),
            (this.inversePoints = v),
            (this._t = this.transform),
            (this.props = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            (this.cssParts = ["matrix3d(", "", ")"]);
        };
      })();
    !(function (t, e) {
      function r(r, h, p) {
        var u = [];
        h = 1 == h ? { entropy: !0 } : h || {};
        var v = a(s(h.entropy ? [r, l(t)] : null == r ? o() : r, 3), u),
          b = new i(u),
          x = function () {
            for (var t = b.g(f), e = m, r = 0; y > t; )
              (t = (t + r) * c), (e *= c), (r = b.g(1));
            for (; t >= g; ) (t /= 2), (e /= 2), (r >>>= 1);
            return (t + r) / e;
          };
        return (
          (x.int32 = function () {
            return 0 | b.g(4);
          }),
          (x.quick = function () {
            return b.g(4) / 4294967296;
          }),
          (x["double"] = x),
          a(l(b.S), t),
          (
            h.pass ||
            p ||
            function (t, r, i, s) {
              return (
                s &&
                  (s.S && n(s, b),
                  (t.state = function () {
                    return n(b, {});
                  })),
                i ? ((e[d] = t), r) : t
              );
            }
          )(x, v, "global" in h ? h.global : this == e, h.state)
        );
      }
      function i(t) {
        var e,
          r = t.length,
          i = this,
          n = 0,
          s = (i.i = i.j = 0),
          a = (i.S = []);
        for (r || (t = [r++]); c > n; ) a[n] = n++;
        for (n = 0; c > n; n++)
          (a[n] = a[(s = v & (s + t[n % r] + (e = a[n])))]), (a[s] = e);
        (i.g = function (t) {
          for (var e, r = 0, n = i.i, s = i.j, a = i.S; t--; )
            (e = a[(n = v & (n + 1))]),
              (r = r * c + a[v & ((a[n] = a[(s = v & (s + e))]) + (a[s] = e))]);
          return (i.i = n), (i.j = s), r;
        })(c);
      }
      function n(t, e) {
        return (e.i = t.i), (e.j = t.j), (e.S = t.S.slice()), e;
      }
      function s(t, e) {
        var r,
          i = [],
          n = typeof t;
        if (e && "object" == n)
          for (r in t)
            try {
              i.push(s(t[r], e - 1));
            } catch (a) {}
        return i.length ? i : "string" == n ? t : t + "\x00";
      }
      function a(t, e) {
        for (var r, i = t + "", n = 0; n < i.length; )
          e[v & n] = v & ((r ^= 19 * e[v & n]) + i.charCodeAt(n++));
        return l(e);
      }
      function o() {
        try {
          if (h) return l(h.randomBytes(c));
          var e = new Uint8Array(c);
          return (p.crypto || p.msCrypto).getRandomValues(e), l(e);
        } catch (r) {
          var i = p.navigator,
            n = i && i.plugins;
          return [+new Date(), p, n, p.screen, l(t)];
        }
      }
      function l(t) {
        return String.fromCharCode.apply(0, t);
      }
      var h,
        p = this,
        c = 256,
        f = 6,
        u = 52,
        d = "random",
        m = e.pow(c, f),
        y = e.pow(2, u),
        g = 2 * y,
        v = c - 1;
      (e["seed" + d] = r), a(e.random(), t);
    })([], BMMath);
    var BezierFactory = (function () {
        function t(t, e, r, i, n) {
          var s =
            n || ("bez_" + t + "_" + e + "_" + r + "_" + i).replace(/\./g, "p");
          if (p[s]) return p[s];
          var a = new l([t, e, r, i]);
          return (p[s] = a), a;
        }
        function e(t, e) {
          return 1 - 3 * e + 3 * t;
        }
        function r(t, e) {
          return 3 * e - 6 * t;
        }
        function i(t) {
          return 3 * t;
        }
        function n(t, n, s) {
          return ((e(n, s) * t + r(n, s)) * t + i(n)) * t;
        }
        function s(t, n, s) {
          return 3 * e(n, s) * t * t + 2 * r(n, s) * t + i(n);
        }
        function a(t, e, r, i, s) {
          var a,
            o,
            l = 0;
          do
            (o = e + (r - e) / 2),
              (a = n(o, i, s) - t),
              a > 0 ? (r = o) : (e = o);
          while (Math.abs(a) > u && ++l < d);
          return o;
        }
        function o(t, e, r, i) {
          for (var a = 0; c > a; ++a) {
            var o = s(e, r, i);
            if (0 === o) return e;
            var l = n(e, r, i) - t;
            e -= l / o;
          }
          return e;
        }
        function l(t) {
          (this._p = t),
            (this._mSampleValues = g ? new Float32Array(m) : new Array(m)),
            (this._precomputed = !1),
            (this.get = this.get.bind(this));
        }
        var h = {};
        h.getBezierEasing = t;
        var p = {},
          c = 4,
          f = 0.001,
          u = 1e-7,
          d = 10,
          m = 11,
          y = 1 / (m - 1),
          g = "function" == typeof Float32Array;
        return (
          (l.prototype = {
            get: function (t) {
              var e = this._p[0],
                r = this._p[1],
                i = this._p[2],
                s = this._p[3];
              return (
                this._precomputed || this._precompute(),
                e === r && i === s
                  ? t
                  : 0 === t
                  ? 0
                  : 1 === t
                  ? 1
                  : n(this._getTForX(t), r, s)
              );
            },
            _precompute: function () {
              var t = this._p[0],
                e = this._p[1],
                r = this._p[2],
                i = this._p[3];
              (this._precomputed = !0),
                (t !== e || r !== i) && this._calcSampleValues();
            },
            _calcSampleValues: function () {
              for (var t = this._p[0], e = this._p[2], r = 0; m > r; ++r)
                this._mSampleValues[r] = n(r * y, t, e);
            },
            _getTForX: function (t) {
              for (
                var e = this._p[0],
                  r = this._p[2],
                  i = this._mSampleValues,
                  n = 0,
                  l = 1,
                  h = m - 1;
                l !== h && i[l] <= t;
                ++l
              )
                n += y;
              --l;
              var p = (t - i[l]) / (i[l + 1] - i[l]),
                c = n + p * y,
                u = s(c, e, r);
              return u >= f
                ? o(t, c, e, r)
                : 0 === u
                ? c
                : a(t, n, n + y, e, r);
            },
          }),
          h
        );
      })(),
      MatrixManager = matrixManagerFunction;
    !(function () {
      for (
        var t = 0, e = ["ms", "moz", "webkit", "o"], r = 0;
        r < e.length && !window.requestAnimationFrame;
        ++r
      )
        (window.requestAnimationFrame = window[e[r] + "RequestAnimationFrame"]),
          (window.cancelAnimationFrame =
            window[e[r] + "CancelAnimationFrame"] ||
            window[e[r] + "CancelRequestAnimationFrame"]);
      window.requestAnimationFrame ||
        (window.requestAnimationFrame = function (e, r) {
          var i = new Date().getTime(),
            n = Math.max(0, 16 - (i - t)),
            s = window.setTimeout(function () {
              e(i + n);
            }, n);
          return (t = i + n), s;
        }),
        window.cancelAnimationFrame ||
          (window.cancelAnimationFrame = function (t) {
            clearTimeout(t);
          });
    })();
    var bez = bezFunction(),
      dataManager = dataFunctionManager(),
      FontManager = (function () {
        function t(t, e) {
          var r = document.createElement("span");
          r.style.fontFamily = e;
          var i = document.createElement("span");
          (i.innerHTML = "giItT1WQy@!-/#"),
            (r.style.position = "absolute"),
            (r.style.left = "-10000px"),
            (r.style.top = "-10000px"),
            (r.style.fontSize = "300px"),
            (r.style.fontVariant = "normal"),
            (r.style.fontStyle = "normal"),
            (r.style.fontWeight = "normal"),
            (r.style.letterSpacing = "0"),
            r.appendChild(i),
            document.body.appendChild(r);
          var n = i.offsetWidth;
          return (
            (i.style.fontFamily = t + ", " + e), { node: i, w: n, parent: r }
          );
        }
        function e() {
          var t,
            r,
            i,
            n = this.fonts.length,
            s = n;
          for (t = 0; n > t; t += 1)
            if (this.fonts[t].loaded) s -= 1;
            else if ("t" === this.fonts[t].fOrigin) {
              if (
                window.Typekit &&
                window.Typekit.load &&
                0 === this.typekitLoaded
              ) {
                this.typekitLoaded = 1;
                try {
                  window.Typekit.load({
                    async: !0,
                    active: function () {
                      this.typekitLoaded = 2;
                    }.bind(this),
                  });
                } catch (a) {}
              }
              2 === this.typekitLoaded && (this.fonts[t].loaded = !0);
            } else
              "n" === this.fonts[t].fOrigin
                ? (this.fonts[t].loaded = !0)
                : ((r = this.fonts[t].monoCase.node),
                  (i = this.fonts[t].monoCase.w),
                  r.offsetWidth !== i
                    ? ((s -= 1), (this.fonts[t].loaded = !0))
                    : ((r = this.fonts[t].sansCase.node),
                      (i = this.fonts[t].sansCase.w),
                      r.offsetWidth !== i &&
                        ((s -= 1), (this.fonts[t].loaded = !0))),
                  this.fonts[t].loaded &&
                    (this.fonts[t].sansCase.parent.parentNode.removeChild(
                      this.fonts[t].sansCase.parent
                    ),
                    this.fonts[t].monoCase.parent.parentNode.removeChild(
                      this.fonts[t].monoCase.parent
                    )));
          0 !== s && Date.now() - this.initTime < l
            ? setTimeout(e.bind(this), 20)
            : setTimeout(
                function () {
                  this.loaded = !0;
                }.bind(this),
                0
              );
        }
        function r(t, e) {
          var r = document.createElementNS(svgNS, "text");
          (r.style.fontSize = "100px"),
            (r.style.fontFamily = e.fFamily),
            (r.textContent = "1"),
            e.fClass
              ? ((r.style.fontFamily = "inherit"), (r.className = e.fClass))
              : (r.style.fontFamily = e.fFamily),
            t.appendChild(r);
          var i = document.createElement("canvas").getContext("2d");
          return (i.font = "100px " + e.fFamily), i;
        }
        function i(i, n) {
          if (!i) return void (this.loaded = !0);
          if (this.chars) return (this.loaded = !0), void (this.fonts = i.list);
          var s,
            a = i.list,
            o = a.length;
          for (s = 0; o > s; s += 1) {
            if (
              ((a[s].loaded = !1),
              (a[s].monoCase = t(a[s].fFamily, "monospace")),
              (a[s].sansCase = t(a[s].fFamily, "sans-serif")),
              a[s].fPath)
            ) {
              if ("p" === a[s].fOrigin) {
                var l = document.createElement("style");
                (l.type = "text/css"),
                  (l.innerHTML =
                    "@font-face {font-family: " +
                    a[s].fFamily +
                    "; font-style: normal; src: url('" +
                    a[s].fPath +
                    "');}"),
                  n.appendChild(l);
              } else if ("g" === a[s].fOrigin) {
                var h = document.createElement("link");
                (h.type = "text/css"),
                  (h.rel = "stylesheet"),
                  (h.href = a[s].fPath),
                  n.appendChild(h);
              } else if ("t" === a[s].fOrigin) {
                var p = document.createElement("script");
                p.setAttribute("src", a[s].fPath), n.appendChild(p);
              }
            } else a[s].loaded = !0;
            (a[s].helper = r(n, a[s])), this.fonts.push(a[s]);
          }
          e.bind(this)();
        }
        function n(t) {
          if (t) {
            this.chars || (this.chars = []);
            var e,
              r,
              i,
              n = t.length,
              s = this.chars.length;
            for (e = 0; n > e; e += 1) {
              for (r = 0, i = !1; s > r; )
                this.chars[r].style === t[e].style &&
                  this.chars[r].fFamily === t[e].fFamily &&
                  this.chars[r].ch === t[e].ch &&
                  (i = !0),
                  (r += 1);
              i || (this.chars.push(t[e]), (s += 1));
            }
          }
        }
        function s(t, e, r) {
          for (var i = 0, n = this.chars.length; n > i; ) {
            if (
              this.chars[i].ch === t &&
              this.chars[i].style === e &&
              this.chars[i].fFamily === r
            )
              return this.chars[i];
            i += 1;
          }
        }
        function a(t, e, r) {
          var i = this.getFontByName(e),
            n = i.helper;
          return (n.measureText(t).width * r) / 100;
        }
        function o(t) {
          for (var e = 0, r = this.fonts.length; r > e; ) {
            if (this.fonts[e].fName === t) return this.fonts[e];
            e += 1;
          }
          return "sans-serif";
        }
        var l = 5e3,
          h = function () {
            (this.fonts = []),
              (this.chars = null),
              (this.typekitLoaded = 0),
              (this.loaded = !1),
              (this.initTime = Date.now());
          };
        return (
          (h.prototype.addChars = n),
          (h.prototype.addFonts = i),
          (h.prototype.getCharData = s),
          (h.prototype.getFontByName = o),
          (h.prototype.measureText = a),
          h
        );
      })(),
      PropertyFactory = (function () {
        function t() {
          if (this.elem.globalData.frameId !== this.frameId) {
            this.mdf = !1;
            var t = this.comp.renderedFrame - this.offsetTime;
            if (
              !(
                t === this.lastFrame ||
                (this.lastFrame !== h &&
                  ((this.lastFrame >=
                    this.keyframes[this.keyframes.length - 1].t -
                      this.offsetTime &&
                    t >=
                      this.keyframes[this.keyframes.length - 1].t -
                        this.offsetTime) ||
                    (this.lastFrame < this.keyframes[0].t - this.offsetTime &&
                      t < this.keyframes[0].t - this.offsetTime)))
              )
            ) {
              for (
                var e,
                  r,
                  i = this.lastFrame < t ? this._lastIndex : 0,
                  n = this.keyframes.length - 1,
                  s = !0;
                s;

              ) {
                if (
                  ((e = this.keyframes[i]),
                  (r = this.keyframes[i + 1]),
                  i == n - 1 && t >= r.t - this.offsetTime)
                ) {
                  e.h && (e = r);
                  break;
                }
                if (r.t - this.offsetTime > t) break;
                n - 1 > i ? (i += 1) : (s = !1);
              }
              this._lastIndex = i;
              var a, o, l, p, c, f;
              if (e.to) {
                e.bezierData || bez.buildBezierData(e);
                var u = e.bezierData;
                if (t >= r.t - this.offsetTime || t < e.t - this.offsetTime) {
                  var d = t >= r.t - this.offsetTime ? u.points.length - 1 : 0;
                  for (o = u.points[d].point.length, a = 0; o > a; a += 1)
                    (this.pv[a] = u.points[d].point[a]),
                      (this.v[a] = this.mult
                        ? this.pv[a] * this.mult
                        : this.pv[a]),
                      this.lastPValue[a] !== this.pv[a] &&
                        ((this.mdf = !0), (this.lastPValue[a] = this.pv[a]));
                  this._lastBezierData = null;
                } else {
                  e.__fnct
                    ? (f = e.__fnct)
                    : ((f = BezierFactory.getBezierEasing(
                        e.o.x,
                        e.o.y,
                        e.i.x,
                        e.i.y,
                        e.n
                      ).get),
                      (e.__fnct = f)),
                    (l = f(
                      (t - (e.t - this.offsetTime)) /
                        (r.t - this.offsetTime - (e.t - this.offsetTime))
                    ));
                  var m,
                    y = u.segmentLength * l,
                    g =
                      this.lastFrame < t && this._lastBezierData === u
                        ? this._lastAddedLength
                        : 0;
                  for (
                    c =
                      this.lastFrame < t && this._lastBezierData === u
                        ? this._lastPoint
                        : 0,
                      s = !0,
                      p = u.points.length;
                    s;

                  ) {
                    if (
                      ((g += u.points[c].partialLength),
                      0 === y || 0 === l || c == u.points.length - 1)
                    ) {
                      for (o = u.points[c].point.length, a = 0; o > a; a += 1)
                        (this.pv[a] = u.points[c].point[a]),
                          (this.v[a] = this.mult
                            ? this.pv[a] * this.mult
                            : this.pv[a]),
                          this.lastPValue[a] !== this.pv[a] &&
                            ((this.mdf = !0),
                            (this.lastPValue[a] = this.pv[a]));
                      break;
                    }
                    if (y >= g && y < g + u.points[c + 1].partialLength) {
                      for (
                        m = (y - g) / u.points[c + 1].partialLength,
                          o = u.points[c].point.length,
                          a = 0;
                        o > a;
                        a += 1
                      )
                        (this.pv[a] =
                          u.points[c].point[a] +
                          (u.points[c + 1].point[a] - u.points[c].point[a]) *
                            m),
                          (this.v[a] = this.mult
                            ? this.pv[a] * this.mult
                            : this.pv[a]),
                          this.lastPValue[a] !== this.pv[a] &&
                            ((this.mdf = !0),
                            (this.lastPValue[a] = this.pv[a]));
                      break;
                    }
                    p - 1 > c ? (c += 1) : (s = !1);
                  }
                  (this._lastPoint = c),
                    (this._lastAddedLength = g - u.points[c].partialLength),
                    (this._lastBezierData = u);
                }
              } else {
                var v, b, x, E, w;
                for (n = e.s.length, i = 0; n > i; i += 1) {
                  if (
                    (1 !== e.h &&
                      (t >= r.t - this.offsetTime
                        ? (l = 1)
                        : t < e.t - this.offsetTime
                        ? (l = 0)
                        : (e.o.x instanceof Array
                            ? (e.__fnct || (e.__fnct = []),
                              e.__fnct[i]
                                ? (f = e.__fnct[i])
                                : ((v = e.o.x[i] || e.o.x[0]),
                                  (b = e.o.y[i] || e.o.y[0]),
                                  (x = e.i.x[i] || e.i.x[0]),
                                  (E = e.i.y[i] || e.i.y[0]),
                                  (f = BezierFactory.getBezierEasing(
                                    v,
                                    b,
                                    x,
                                    E
                                  ).get),
                                  (e.__fnct[i] = f)))
                            : e.__fnct
                            ? (f = e.__fnct)
                            : ((v = e.o.x),
                              (b = e.o.y),
                              (x = e.i.x),
                              (E = e.i.y),
                              (f = BezierFactory.getBezierEasing(
                                v,
                                b,
                                x,
                                E
                              ).get),
                              (e.__fnct = f)),
                          (l = f(
                            (t - (e.t - this.offsetTime)) /
                              (r.t - this.offsetTime - (e.t - this.offsetTime))
                          )))),
                    this.sh && 1 !== e.h)
                  ) {
                    var P = e.s[i],
                      S = e.e[i];
                    -180 > P - S ? (P += 360) : P - S > 180 && (P -= 360),
                      (w = P + (S - P) * l);
                  } else
                    w = 1 === e.h ? e.s[i] : e.s[i] + (e.e[i] - e.s[i]) * l;
                  1 === n
                    ? ((this.v = this.mult ? w * this.mult : w),
                      (this.pv = w),
                      this.lastPValue != this.pv &&
                        ((this.mdf = !0), (this.lastPValue = this.pv)))
                    : ((this.v[i] = this.mult ? w * this.mult : w),
                      (this.pv[i] = w),
                      this.lastPValue[i] !== this.pv[i] &&
                        ((this.mdf = !0), (this.lastPValue[i] = this.pv[i])));
                }
              }
            }
            (this.lastFrame = t), (this.frameId = this.elem.globalData.frameId);
          }
        }
        function e() {}
        function r(t, r, i) {
          (this.mult = i),
            (this.v = i ? r.k * i : r.k),
            (this.pv = r.k),
            (this.mdf = !1),
            (this.comp = t.comp),
            (this.k = !1),
            (this.kf = !1),
            (this.vel = 0),
            (this.getValue = e);
        }
        function i(t, r, i) {
          (this.mult = i),
            (this.data = r),
            (this.mdf = !1),
            (this.comp = t.comp),
            (this.k = !1),
            (this.kf = !1),
            (this.frameId = -1),
            (this.v = Array.apply(null, { length: r.k.length })),
            (this.pv = Array.apply(null, { length: r.k.length })),
            (this.lastValue = Array.apply(null, { length: r.k.length }));
          var n = Array.apply(null, { length: r.k.length });
          this.vel = n.map(function () {
            return 0;
          });
          var s,
            a = r.k.length;
          for (s = 0; a > s; s += 1)
            (this.v[s] = i ? r.k[s] * i : r.k[s]), (this.pv[s] = r.k[s]);
          this.getValue = e;
        }
        function n(e, r, i) {
          (this.keyframes = r.k),
            (this.offsetTime = e.data.st),
            (this.lastValue = -99999),
            (this.lastPValue = -99999),
            (this.frameId = -1),
            (this._lastIndex = 0),
            (this.k = !0),
            (this.kf = !0),
            (this.data = r),
            (this.mult = i),
            (this.elem = e),
            (this.comp = e.comp),
            (this.lastFrame = h),
            (this.v = i ? r.k[0].s[0] * i : r.k[0].s[0]),
            (this.pv = r.k[0].s[0]),
            (this.getValue = t);
        }
        function s(e, r, i) {
          var n,
            s,
            a,
            o,
            l,
            p = r.k.length;
          for (n = 0; p - 1 > n; n += 1)
            r.k[n].to &&
              r.k[n].s &&
              r.k[n].e &&
              ((s = r.k[n].s),
              (a = r.k[n].e),
              (o = r.k[n].to),
              (l = r.k[n].ti),
              ((2 === s.length &&
                (s[0] !== a[0] || s[1] !== a[1]) &&
                bez.pointOnLine2D(
                  s[0],
                  s[1],
                  a[0],
                  a[1],
                  s[0] + o[0],
                  s[1] + o[1]
                ) &&
                bez.pointOnLine2D(
                  s[0],
                  s[1],
                  a[0],
                  a[1],
                  a[0] + l[0],
                  a[1] + l[1]
                )) ||
                (3 === s.length &&
                  (s[0] !== a[0] || s[1] !== a[1] || s[2] !== a[2]) &&
                  bez.pointOnLine3D(
                    s[0],
                    s[1],
                    s[2],
                    a[0],
                    a[1],
                    a[2],
                    s[0] + o[0],
                    s[1] + o[1],
                    s[2] + o[2]
                  ) &&
                  bez.pointOnLine3D(
                    s[0],
                    s[1],
                    s[2],
                    a[0],
                    a[1],
                    a[2],
                    a[0] + l[0],
                    a[1] + l[1],
                    a[2] + l[2]
                  ))) &&
                ((r.k[n].to = null), (r.k[n].ti = null)));
          (this.keyframes = r.k),
            (this.offsetTime = e.data.st),
            (this.k = !0),
            (this.kf = !0),
            (this.mult = i),
            (this.elem = e),
            (this.comp = e.comp),
            (this.getValue = t),
            (this.frameId = -1),
            (this._lastIndex = 0),
            (this.v = Array.apply(null, { length: r.k[0].s.length })),
            (this.pv = Array.apply(null, { length: r.k[0].s.length })),
            (this.lastValue = Array.apply(null, { length: r.k[0].s.length })),
            (this.lastPValue = Array.apply(null, { length: r.k[0].s.length })),
            (this.lastFrame = h);
        }
        function a(t, e, a, o, l) {
          var h;
          if (2 === a) h = new p(t, e, l);
          else if (0 === e.a) h = 0 === a ? new r(t, e, o) : new i(t, e, o);
          else if (1 === e.a) h = 0 === a ? new n(t, e, o) : new s(t, e, o);
          else if (e.k.length)
            if ("number" == typeof e.k[0]) h = new i(t, e, o);
            else
              switch (a) {
                case 0:
                  h = new n(t, e, o);
                  break;
                case 1:
                  h = new s(t, e, o);
              }
          else h = new r(t, e, o);
          return h.k && l.push(h), h;
        }
        function o(t, e, r, i) {
          return new f(t, e, r, i);
        }
        function l(t, e, r) {
          return new u(t, e, r);
        }
        var h = -999999,
          p = (function () {
            function t() {
              return ExpressionValue(this.p);
            }
            function e() {
              return ExpressionValue(this.px);
            }
            function r() {
              return ExpressionValue(this.py);
            }
            function i() {
              return ExpressionValue(this.a);
            }
            function n() {
              return ExpressionValue(this.or);
            }
            function s() {
              return ExpressionValue(this.r, 1 / degToRads);
            }
            function a() {
              return ExpressionValue(this.s, 100);
            }
            function o() {
              return ExpressionValue(this.o, 100);
            }
            function l() {
              return ExpressionValue(this.sk);
            }
            function h() {
              return ExpressionValue(this.sa);
            }
            function p(t) {
              var e,
                r = this.dynamicProperties.length;
              for (e = 0; r > e; e += 1)
                this.dynamicProperties[e].getValue(),
                  this.dynamicProperties[e].mdf && (this.mdf = !0);
              this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                this.r
                  ? t.rotate(-this.r.v)
                  : t
                      .rotateZ(-this.rz.v)
                      .rotateY(this.ry.v)
                      .rotateX(this.rx.v)
                      .rotateZ(-this.or.v[2])
                      .rotateY(this.or.v[1])
                      .rotateX(this.or.v[0]),
                this.data.p.s
                  ? this.data.p.z
                    ? t.translate(this.px.v, this.py.v, -this.pz.v)
                    : t.translate(this.px.v, this.py.v, 0)
                  : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            }
            function c() {
              if (this.elem.globalData.frameId !== this.frameId) {
                this.mdf = !1;
                var t,
                  e = this.dynamicProperties.length;
                for (t = 0; e > t; t += 1)
                  this.dynamicProperties[t].getValue(),
                    this.dynamicProperties[t].mdf && (this.mdf = !0);
                if (this.mdf) {
                  if (
                    (this.v.reset(),
                    this.a &&
                      this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                    this.s &&
                      this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                    this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v),
                    this.r
                      ? this.v.rotate(-this.r.v)
                      : this.v
                          .rotateZ(-this.rz.v)
                          .rotateY(this.ry.v)
                          .rotateX(this.rx.v)
                          .rotateZ(-this.or.v[2])
                          .rotateY(this.or.v[1])
                          .rotateX(this.or.v[0]),
                    this.autoOriented &&
                      this.p.keyframes &&
                      this.p.getValueAtTime)
                  ) {
                    var r, i;
                    this.p.lastFrame + this.p.offsetTime <=
                    this.p.keyframes[0].t
                      ? ((r = this.p.getValueAtTime(
                          (this.p.keyframes[0].t + 0.01) /
                            this.elem.globalData.frameRate,
                          0
                        )),
                        (i = this.p.getValueAtTime(
                          this.p.keyframes[0].t /
                            this.elem.globalData.frameRate,
                          0
                        )))
                      : this.p.lastFrame + this.p.offsetTime >=
                        this.p.keyframes[this.p.keyframes.length - 1].t
                      ? ((r = this.p.getValueAtTime(
                          this.p.keyframes[this.p.keyframes.length - 1].t /
                            this.elem.globalData.frameRate,
                          0
                        )),
                        (i = this.p.getValueAtTime(
                          (this.p.keyframes[this.p.keyframes.length - 1].t -
                            0.01) /
                            this.elem.globalData.frameRate,
                          0
                        )))
                      : ((r = this.p.pv),
                        (i = this.p.getValueAtTime(
                          (this.p.lastFrame + this.p.offsetTime - 0.01) /
                            this.elem.globalData.frameRate,
                          this.p.offsetTime
                        ))),
                      this.v.rotate(-Math.atan2(r[1] - i[1], r[0] - i[0]));
                  }
                  this.data.p.s
                    ? this.data.p.z
                      ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                      : this.v.translate(this.px.v, this.py.v, 0)
                    : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                }
                this.frameId = this.elem.globalData.frameId;
              }
            }
            function f() {
              (this.inverted = !0),
                (this.iv = new Matrix()),
                this.k ||
                  (this.data.p.s
                    ? this.iv.translate(this.px.v, this.py.v, -this.pz.v)
                    : this.iv.translate(this.p.v[0], this.p.v[1], -this.p.v[2]),
                  this.r
                    ? this.iv.rotate(-this.r.v)
                    : this.iv
                        .rotateX(-this.rx.v)
                        .rotateY(-this.ry.v)
                        .rotateZ(this.rz.v),
                  this.s && this.iv.scale(this.s.v[0], this.s.v[1], 1),
                  this.a &&
                    this.iv.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]));
            }
            function u() {}
            return function (d, m, y) {
              (this.elem = d),
                (this.frameId = -1),
                (this.type = "transform"),
                (this.dynamicProperties = []),
                (this.mdf = !1),
                (this.data = m),
                (this.getValue = c),
                (this.applyToMatrix = p),
                (this.setInverted = f),
                (this.autoOrient = u),
                (this.v = new Matrix()),
                m.p.s
                  ? ((this.px = PropertyFactory.getProp(
                      d,
                      m.p.x,
                      0,
                      0,
                      this.dynamicProperties
                    )),
                    (this.py = PropertyFactory.getProp(
                      d,
                      m.p.y,
                      0,
                      0,
                      this.dynamicProperties
                    )),
                    m.p.z &&
                      (this.pz = PropertyFactory.getProp(
                        d,
                        m.p.z,
                        0,
                        0,
                        this.dynamicProperties
                      )))
                  : (this.p = PropertyFactory.getProp(
                      d,
                      m.p,
                      1,
                      0,
                      this.dynamicProperties
                    )),
                m.r
                  ? (this.r = PropertyFactory.getProp(
                      d,
                      m.r,
                      0,
                      degToRads,
                      this.dynamicProperties
                    ))
                  : m.rx &&
                    ((this.rx = PropertyFactory.getProp(
                      d,
                      m.rx,
                      0,
                      degToRads,
                      this.dynamicProperties
                    )),
                    (this.ry = PropertyFactory.getProp(
                      d,
                      m.ry,
                      0,
                      degToRads,
                      this.dynamicProperties
                    )),
                    (this.rz = PropertyFactory.getProp(
                      d,
                      m.rz,
                      0,
                      degToRads,
                      this.dynamicProperties
                    )),
                    (this.or = PropertyFactory.getProp(
                      d,
                      m.or,
                      1,
                      degToRads,
                      this.dynamicProperties
                    ))),
                m.sk &&
                  ((this.sk = PropertyFactory.getProp(
                    d,
                    m.sk,
                    0,
                    degToRads,
                    this.dynamicProperties
                  )),
                  (this.sa = PropertyFactory.getProp(
                    d,
                    m.sa,
                    0,
                    degToRads,
                    this.dynamicProperties
                  ))),
                m.a &&
                  (this.a = PropertyFactory.getProp(
                    d,
                    m.a,
                    1,
                    0,
                    this.dynamicProperties
                  )),
                m.s &&
                  (this.s = PropertyFactory.getProp(
                    d,
                    m.s,
                    1,
                    0.01,
                    this.dynamicProperties
                  )),
                (this.o = m.o
                  ? PropertyFactory.getProp(d, m.o, 0, 0.01, y)
                  : { mdf: !1, v: 1 }),
                this.dynamicProperties.length
                  ? y.push(this)
                  : (this.a &&
                      this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                    this.s &&
                      this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                    this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v),
                    this.r
                      ? this.v.rotate(-this.r.v)
                      : this.v
                          .rotateZ(-this.rz.v)
                          .rotateY(this.ry.v)
                          .rotateX(this.rx.v)
                          .rotateZ(-this.or.v[2])
                          .rotateY(this.or.v[1])
                          .rotateX(this.or.v[0]),
                    this.data.p.s
                      ? m.p.z
                        ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                        : this.v.translate(this.px.v, this.py.v, 0)
                      : this.v.translate(
                          this.p.v[0],
                          this.p.v[1],
                          -this.p.v[2]
                        )),
                Object.defineProperty(this, "position", { get: t }),
                Object.defineProperty(this, "xPosition", { get: e }),
                Object.defineProperty(this, "yPosition", { get: r }),
                Object.defineProperty(this, "orientation", { get: n }),
                Object.defineProperty(this, "anchorPoint", { get: i }),
                Object.defineProperty(this, "rotation", { get: s }),
                Object.defineProperty(this, "scale", { get: a }),
                Object.defineProperty(this, "opacity", { get: o }),
                Object.defineProperty(this, "skew", { get: l }),
                Object.defineProperty(this, "skewAxis", { get: h });
            };
          })(),
          c = (function () {
            function t(t) {
              if (
                (this.prop.getValue(),
                (this.cmdf = !1),
                (this.omdf = !1),
                this.prop.mdf || t)
              ) {
                var e,
                  r,
                  i,
                  n = 4 * this.data.p;
                for (e = 0; n > e; e += 1)
                  (r = e % 4 === 0 ? 100 : 255),
                    (i = Math.round(this.prop.v[e] * r)),
                    this.c[e] !== i && ((this.c[e] = i), (this.cmdf = !0));
                if (this.o.length)
                  for (
                    n = this.prop.v.length, e = 4 * this.data.p;
                    n > e;
                    e += 1
                  )
                    (r = e % 2 === 0 ? 100 : 1),
                      (i =
                        e % 2 === 0
                          ? Math.round(100 * this.prop.v[e])
                          : this.prop.v[e]),
                      this.o[e - 4 * this.data.p] !== i &&
                        ((this.o[e - 4 * this.data.p] = i), (this.omdf = !0));
              }
            }
            function e(e, r, i) {
              (this.prop = a(e, r.k, 1, null, [])),
                (this.data = r),
                (this.k = this.prop.k),
                (this.c = Array.apply(null, { length: 4 * r.p }));
              var n = r.k.k[0].s
                ? r.k.k[0].s.length - 4 * r.p
                : r.k.k.length - 4 * r.p;
              (this.o = Array.apply(null, { length: n })),
                (this.cmdf = !1),
                (this.omdf = !1),
                (this.getValue = t),
                this.prop.k && i.push(this),
                this.getValue(!0);
            }
            return function (t, r, i) {
              return new e(t, r, i);
            };
          })(),
          f = (function () {
            function t(t) {
              var e = 0,
                r = this.dataProps.length;
              if (this.elem.globalData.frameId !== this.frameId || t) {
                for (
                  this.mdf = !1, this.frameId = this.elem.globalData.frameId;
                  r > e;

                ) {
                  if (this.dataProps[e].p.mdf) {
                    this.mdf = !0;
                    break;
                  }
                  e += 1;
                }
                if (this.mdf || t)
                  for (
                    "svg" === this.renderer && (this.dasharray = ""), e = 0;
                    r > e;
                    e += 1
                  )
                    "o" != this.dataProps[e].n
                      ? "svg" === this.renderer
                        ? (this.dasharray += " " + this.dataProps[e].p.v)
                        : (this.dasharray[e] = this.dataProps[e].p.v)
                      : (this.dashoffset = this.dataProps[e].p.v);
              }
            }
            return function (e, r, i, n) {
              (this.elem = e),
                (this.frameId = -1),
                (this.dataProps = new Array(r.length)),
                (this.renderer = i),
                (this.mdf = !1),
                (this.k = !1),
                (this.dasharray =
                  "svg" === this.renderer ? "" : new Array(r.length - 1)),
                (this.dashoffset = 0);
              var s,
                a,
                o = r.length;
              for (s = 0; o > s; s += 1)
                (a = PropertyFactory.getProp(e, r[s].v, 0, 0, n)),
                  (this.k = a.k ? !0 : this.k),
                  (this.dataProps[s] = { n: r[s].n, p: a });
              (this.getValue = t), this.k ? n.push(this) : this.getValue(!0);
            };
          })(),
          u = (function () {
            function t() {
              if (this.dynamicProperties.length) {
                var t,
                  e = this.dynamicProperties.length;
                for (t = 0; e > t; t += 1)
                  this.dynamicProperties[t].getValue(),
                    this.dynamicProperties[t].mdf && (this.mdf = !0);
              }
              var r = this.data.totalChars,
                i = 2 === this.data.r ? 1 : 100 / r,
                n = this.o.v / i,
                s = this.s.v / i + n,
                a = this.e.v / i + n;
              if (s > a) {
                var o = s;
                (s = a), (a = o);
              }
              (this.finalS = s), (this.finalE = a);
            }
            function e(t) {
              var e = BezierFactory.getBezierEasing(
                  this.ne.v / 100,
                  0,
                  1 - this.xe.v / 100,
                  1
                ).get,
                s = 0,
                a = this.finalS,
                o = this.finalE,
                l = this.data.sh;
              if (2 == l)
                (s =
                  o === a
                    ? t >= o
                      ? 1
                      : 0
                    : r(0, i(0.5 / (o - a) + (t - a) / (o - a), 1))),
                  (s = e(s));
              else if (3 == l)
                (s =
                  o === a
                    ? t >= o
                      ? 0
                      : 1
                    : 1 - r(0, i(0.5 / (o - a) + (t - a) / (o - a), 1))),
                  (s = e(s));
              else if (4 == l)
                o === a
                  ? (s = 0)
                  : ((s = r(0, i(0.5 / (o - a) + (t - a) / (o - a), 1))),
                    0.5 > s ? (s *= 2) : (s = 1 - 2 * (s - 0.5))),
                  (s = e(s));
              else if (5 == l) {
                if (o === a) s = 0;
                else {
                  var h = o - a;
                  t = i(r(0, t + 0.5 - a), o - a);
                  var p = -h / 2 + t,
                    c = h / 2;
                  s = Math.sqrt(1 - (p * p) / (c * c));
                }
                s = e(s);
              } else
                6 == l
                  ? (o === a
                      ? (s = 0)
                      : ((t = i(r(0, t + 0.5 - a), o - a)),
                        (s =
                          (1 +
                            Math.cos(Math.PI + (2 * Math.PI * t) / (o - a))) /
                          2)),
                    (s = e(s)))
                  : (t >= n(a) &&
                      (s = 0 > t - a ? 1 - (a - t) : r(0, i(o - t, 1))),
                    (s = e(s)));
              return s * this.a.v;
            }
            var r = Math.max,
              i = Math.min,
              n = Math.floor;
            return function (r, i, n) {
              (this.mdf = !1),
                (this.k = !1),
                (this.data = i),
                (this.dynamicProperties = []),
                (this.getValue = t),
                (this.getMult = e),
                (this.comp = r.comp),
                (this.finalS = 0),
                (this.finalE = 0),
                (this.s = PropertyFactory.getProp(
                  r,
                  i.s || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.e =
                  "e" in i
                    ? PropertyFactory.getProp(
                        r,
                        i.e,
                        0,
                        0,
                        this.dynamicProperties
                      )
                    : { v: 2 === i.r ? i.totalChars : 100 }),
                (this.o = PropertyFactory.getProp(
                  r,
                  i.o || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.xe = PropertyFactory.getProp(
                  r,
                  i.xe || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.ne = PropertyFactory.getProp(
                  r,
                  i.ne || { k: 0 },
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.a = PropertyFactory.getProp(
                  r,
                  i.a,
                  0,
                  0.01,
                  this.dynamicProperties
                )),
                this.dynamicProperties.length ? n.push(this) : this.getValue();
            };
          })(),
          d = {};
        return (
          (d.getProp = a),
          (d.getDashProp = o),
          (d.getTextSelectorProp = l),
          (d.getGradientProp = c),
          d
        );
      })();
    (ShapePath.prototype.setPathData = function (t, e) {
      for (this.c = t; e > this._maxLength; ) this.doubleArrayLength();
      for (var r = 0; e > r; )
        (this.v[r] = point_pool.newPoint()),
          (this.o[r] = point_pool.newPoint()),
          (this.i[r] = point_pool.newPoint()),
          (r += 1);
      this._length = e;
    }),
      (ShapePath.prototype.doubleArrayLength = function () {
        (this.v = this.v.concat(
          Array.apply(null, { length: this._maxLength })
        )),
          (this.i = this.i.concat(
            Array.apply(null, { length: this._maxLength })
          )),
          (this.o = this.o.concat(
            Array.apply(null, { length: this._maxLength })
          )),
          (this._maxLength *= 2);
      }),
      (ShapePath.prototype.setXYAt = function (t, e, r, i, n) {
        var s;
        switch (
          ((this._length = Math.max(this._length, i + 1)),
          this._length >= this._maxLength && this.doubleArrayLength(),
          r)
        ) {
          case "v":
            s = this.v;
            break;
          case "i":
            s = this.i;
            break;
          case "o":
            s = this.o;
        }
        (!s[i] || (s[i] && !n)) && (s[i] = point_pool.newPoint()),
          (s[i][0] = t),
          (s[i][1] = e);
      }),
      (ShapePath.prototype.setTripleAt = function (t, e, r, i, n, s, a, o) {
        this.setXYAt(t, e, "v", a, o),
          this.setXYAt(r, i, "o", a, o),
          this.setXYAt(n, s, "i", a, o);
      });
    var ShapePropertyFactory = (function () {
        function t() {
          if (this.elem.globalData.frameId !== this.frameId) {
            this.mdf = !1;
            var t = this.comp.renderedFrame - this.offsetTime;
            if (
              this.lastFrame === a ||
              !(
                (this.lastFrame < this.keyframes[0].t - this.offsetTime &&
                  t < this.keyframes[0].t - this.offsetTime) ||
                (this.lastFrame >
                  this.keyframes[this.keyframes.length - 1].t -
                    this.offsetTime &&
                  t >
                    this.keyframes[this.keyframes.length - 1].t -
                      this.offsetTime)
              )
            ) {
              var e, r, i;
              if (t < this.keyframes[0].t - this.offsetTime)
                (e = this.keyframes[0].s[0]), (i = !0), (this._lastIndex = 0);
              else if (
                t >=
                this.keyframes[this.keyframes.length - 1].t - this.offsetTime
              )
                (e =
                  1 === this.keyframes[this.keyframes.length - 2].h
                    ? this.keyframes[this.keyframes.length - 1].s[0]
                    : this.keyframes[this.keyframes.length - 2].e[0]),
                  (i = !0);
              else {
                for (
                  var n,
                    s,
                    o,
                    l,
                    h,
                    p,
                    c = this.lastFrame < a ? this._lastIndex : 0,
                    f = this.keyframes.length - 1,
                    u = !0;
                  u &&
                  ((n = this.keyframes[c]),
                  (s = this.keyframes[c + 1]),
                  !(s.t - this.offsetTime > t));

                )
                  f - 1 > c ? (c += 1) : (u = !1);
                (i = 1 === n.h), (this._lastIndex = c);
                var d;
                if (!i) {
                  if (t >= s.t - this.offsetTime) d = 1;
                  else if (t < n.t - this.offsetTime) d = 0;
                  else {
                    var m;
                    n.__fnct
                      ? (m = n.__fnct)
                      : ((m = BezierFactory.getBezierEasing(
                          n.o.x,
                          n.o.y,
                          n.i.x,
                          n.i.y
                        ).get),
                        (n.__fnct = m)),
                      (d = m(
                        (t - (n.t - this.offsetTime)) /
                          (s.t - this.offsetTime - (n.t - this.offsetTime))
                      ));
                  }
                  r = n.e[0];
                }
                e = n.s[0];
              }
              (l = this.v._length), (p = e.i[0].length);
              var y,
                g = !1;
              for (o = 0; l > o; o += 1)
                for (h = 0; p > h; h += 1)
                  i
                    ? ((y = e.i[o][h]),
                      this.v.i[o][h] !== y &&
                        ((this.v.i[o][h] = y), (this.pv.i[o][h] = y), (g = !0)),
                      (y = e.o[o][h]),
                      this.v.o[o][h] !== y &&
                        ((this.v.o[o][h] = y), (this.pv.o[o][h] = y), (g = !0)),
                      (y = e.v[o][h]),
                      this.v.v[o][h] !== y &&
                        ((this.v.v[o][h] = y), (this.pv.v[o][h] = y), (g = !0)))
                    : ((y = e.i[o][h] + (r.i[o][h] - e.i[o][h]) * d),
                      this.v.i[o][h] !== y &&
                        ((this.v.i[o][h] = y), (this.pv.i[o][h] = y), (g = !0)),
                      (y = e.o[o][h] + (r.o[o][h] - e.o[o][h]) * d),
                      this.v.o[o][h] !== y &&
                        ((this.v.o[o][h] = y), (this.pv.o[o][h] = y), (g = !0)),
                      (y = e.v[o][h] + (r.v[o][h] - e.v[o][h]) * d),
                      this.v.v[o][h] !== y &&
                        ((this.v.v[o][h] = y),
                        (this.pv.v[o][h] = y),
                        (g = !0)));
              (this.mdf = g),
                (this.v.c = e.c),
                (this.paths = this.localShapeCollection);
            }
            (this.lastFrame = t), (this.frameId = this.elem.globalData.frameId);
          }
        }
        function e() {
          return this.v;
        }
        function r() {
          (this.paths = this.localShapeCollection), this.k || (this.mdf = !1);
        }
        function i(t, i, n) {
          (this.comp = t.comp),
            (this.k = !1),
            (this.mdf = !1),
            (this.v = shape_pool.newShape());
          var s = 3 === n ? i.pt.k : i.ks.k;
          (this.v.v = s.v),
            (this.v.i = s.i),
            (this.v.o = s.o),
            (this.v.c = s.c),
            (this.v._length = this.v.v.length),
            (this.getValue = e),
            (this.pv = shape_pool.clone(this.v)),
            (this.localShapeCollection =
              shapeCollection_pool.newShapeCollection()),
            (this.paths = this.localShapeCollection),
            this.paths.addShape(this.v),
            (this.reset = r);
        }
        function n(e, i, n) {
          (this.comp = e.comp),
            (this.elem = e),
            (this.offsetTime = e.data.st),
            (this._lastIndex = 0),
            (this.getValue = t),
            (this.keyframes = 3 === n ? i.pt.k : i.ks.k),
            (this.k = !0),
            (this.kf = !0);
          var s = this.keyframes[0].s[0].i.length;
          this.keyframes[0].s[0].i[0].length,
            (this.v = shape_pool.newShape()),
            this.v.setPathData(this.keyframes[0].s[0].c, s),
            (this.pv = shape_pool.clone(this.v)),
            (this.localShapeCollection =
              shapeCollection_pool.newShapeCollection()),
            (this.paths = this.localShapeCollection),
            this.paths.addShape(this.v),
            (this.lastFrame = a),
            (this.reset = r);
        }
        function s(t, e, r, s) {
          var a;
          if (3 === r || 4 === r) {
            var p = 3 === r ? e.pt : e.ks,
              c = p.k;
            a = 1 === p.a || c.length ? new n(t, e, r) : new i(t, e, r);
          } else
            5 === r
              ? (a = new h(t, e))
              : 6 === r
              ? (a = new o(t, e))
              : 7 === r && (a = new l(t, e));
          return a.k && s.push(a), a;
        }
        var a = -999999,
          o = (function () {
            function t() {
              var t = this.p.v[0],
                e = this.p.v[1],
                r = this.s.v[0] / 2,
                n = this.s.v[1] / 2;
              3 !== this.d
                ? ((this.v.v[0][0] = t),
                  (this.v.v[0][1] = e - n),
                  (this.v.v[1][0] = t + r),
                  (this.v.v[1][1] = e),
                  (this.v.v[2][0] = t),
                  (this.v.v[2][1] = e + n),
                  (this.v.v[3][0] = t - r),
                  (this.v.v[3][1] = e),
                  (this.v.i[0][0] = t - r * i),
                  (this.v.i[0][1] = e - n),
                  (this.v.i[1][0] = t + r),
                  (this.v.i[1][1] = e - n * i),
                  (this.v.i[2][0] = t + r * i),
                  (this.v.i[2][1] = e + n),
                  (this.v.i[3][0] = t - r),
                  (this.v.i[3][1] = e + n * i),
                  (this.v.o[0][0] = t + r * i),
                  (this.v.o[0][1] = e - n),
                  (this.v.o[1][0] = t + r),
                  (this.v.o[1][1] = e + n * i),
                  (this.v.o[2][0] = t - r * i),
                  (this.v.o[2][1] = e + n),
                  (this.v.o[3][0] = t - r),
                  (this.v.o[3][1] = e - n * i))
                : ((this.v.v[0][0] = t),
                  (this.v.v[0][1] = e - n),
                  (this.v.v[1][0] = t - r),
                  (this.v.v[1][1] = e),
                  (this.v.v[2][0] = t),
                  (this.v.v[2][1] = e + n),
                  (this.v.v[3][0] = t + r),
                  (this.v.v[3][1] = e),
                  (this.v.i[0][0] = t + r * i),
                  (this.v.i[0][1] = e - n),
                  (this.v.i[1][0] = t - r),
                  (this.v.i[1][1] = e - n * i),
                  (this.v.i[2][0] = t - r * i),
                  (this.v.i[2][1] = e + n),
                  (this.v.i[3][0] = t + r),
                  (this.v.i[3][1] = e + n * i),
                  (this.v.o[0][0] = t - r * i),
                  (this.v.o[0][1] = e - n),
                  (this.v.o[1][0] = t - r),
                  (this.v.o[1][1] = e + n * i),
                  (this.v.o[2][0] = t + r * i),
                  (this.v.o[2][1] = e + n),
                  (this.v.o[3][0] = t + r),
                  (this.v.o[3][1] = e - n * i));
            }
            function e(t) {
              var e,
                r = this.dynamicProperties.length;
              if (this.elem.globalData.frameId !== this.frameId) {
                for (
                  this.mdf = !1,
                    this.frameId = this.elem.globalData.frameId,
                    e = 0;
                  r > e;
                  e += 1
                )
                  this.dynamicProperties[e].getValue(t),
                    this.dynamicProperties[e].mdf && (this.mdf = !0);
                this.mdf && this.convertEllToPath();
              }
            }
            var i = roundCorner;
            return function (i, n) {
              (this.v = shape_pool.newShape()),
                this.v.setPathData(!0, 4),
                (this.localShapeCollection =
                  shapeCollection_pool.newShapeCollection()),
                (this.paths = this.localShapeCollection),
                this.localShapeCollection.addShape(this.v),
                (this.d = n.d),
                (this.dynamicProperties = []),
                (this.elem = i),
                (this.comp = i.comp),
                (this.frameId = -1),
                (this.mdf = !1),
                (this.getValue = e),
                (this.convertEllToPath = t),
                (this.reset = r),
                (this.p = PropertyFactory.getProp(
                  i,
                  n.p,
                  1,
                  0,
                  this.dynamicProperties
                )),
                (this.s = PropertyFactory.getProp(
                  i,
                  n.s,
                  1,
                  0,
                  this.dynamicProperties
                )),
                this.dynamicProperties.length
                  ? (this.k = !0)
                  : this.convertEllToPath();
            };
          })(),
          l = (function () {
            function t() {
              var t,
                e = Math.floor(this.pt.v),
                r = (2 * Math.PI) / e,
                i = this.or.v,
                n = this.os.v,
                s = (2 * Math.PI * i) / (4 * e),
                a = -Math.PI / 2,
                o = 3 === this.data.d ? -1 : 1;
              for (a += this.r.v, this.v._length = 0, t = 0; e > t; t += 1) {
                var l = i * Math.cos(a),
                  h = i * Math.sin(a),
                  p = 0 === l && 0 === h ? 0 : h / Math.sqrt(l * l + h * h),
                  c = 0 === l && 0 === h ? 0 : -l / Math.sqrt(l * l + h * h);
                (l += +this.p.v[0]),
                  (h += +this.p.v[1]),
                  this.v.setTripleAt(
                    l,
                    h,
                    l - p * s * n * o,
                    h - c * s * n * o,
                    l + p * s * n * o,
                    h + c * s * n * o,
                    t,
                    !0
                  ),
                  (a += r * o);
              }
              (this.paths.length = 0), (this.paths[0] = this.v);
            }
            function e() {
              var t,
                e,
                r,
                i,
                n = 2 * Math.floor(this.pt.v),
                s = (2 * Math.PI) / n,
                a = !0,
                o = this.or.v,
                l = this.ir.v,
                h = this.os.v,
                p = this.is.v,
                c = (2 * Math.PI * o) / (2 * n),
                f = (2 * Math.PI * l) / (2 * n),
                u = -Math.PI / 2;
              u += this.r.v;
              var d = 3 === this.data.d ? -1 : 1;
              for (this.v._length = 0, t = 0; n > t; t += 1) {
                (e = a ? o : l), (r = a ? h : p), (i = a ? c : f);
                var m = e * Math.cos(u),
                  y = e * Math.sin(u),
                  g = 0 === m && 0 === y ? 0 : y / Math.sqrt(m * m + y * y),
                  v = 0 === m && 0 === y ? 0 : -m / Math.sqrt(m * m + y * y);
                (m += +this.p.v[0]),
                  (y += +this.p.v[1]),
                  this.v.setTripleAt(
                    m,
                    y,
                    m - g * i * r * d,
                    y - v * i * r * d,
                    m + g * i * r * d,
                    y + v * i * r * d,
                    t,
                    !0
                  ),
                  (a = !a),
                  (u += s * d);
              }
            }
            function i() {
              if (this.elem.globalData.frameId !== this.frameId) {
                (this.mdf = !1), (this.frameId = this.elem.globalData.frameId);
                var t,
                  e = this.dynamicProperties.length;
                for (t = 0; e > t; t += 1)
                  this.dynamicProperties[t].getValue(),
                    this.dynamicProperties[t].mdf && (this.mdf = !0);
                this.mdf && this.convertToPath();
              }
            }
            return function (n, s) {
              (this.v = shape_pool.newShape()),
                this.v.setPathData(!0, 0),
                (this.elem = n),
                (this.comp = n.comp),
                (this.data = s),
                (this.frameId = -1),
                (this.d = s.d),
                (this.dynamicProperties = []),
                (this.mdf = !1),
                (this.getValue = i),
                (this.reset = r),
                1 === s.sy
                  ? ((this.ir = PropertyFactory.getProp(
                      n,
                      s.ir,
                      0,
                      0,
                      this.dynamicProperties
                    )),
                    (this.is = PropertyFactory.getProp(
                      n,
                      s.is,
                      0,
                      0.01,
                      this.dynamicProperties
                    )),
                    (this.convertToPath = e))
                  : (this.convertToPath = t),
                (this.pt = PropertyFactory.getProp(
                  n,
                  s.pt,
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.p = PropertyFactory.getProp(
                  n,
                  s.p,
                  1,
                  0,
                  this.dynamicProperties
                )),
                (this.r = PropertyFactory.getProp(
                  n,
                  s.r,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
                (this.or = PropertyFactory.getProp(
                  n,
                  s.or,
                  0,
                  0,
                  this.dynamicProperties
                )),
                (this.os = PropertyFactory.getProp(
                  n,
                  s.os,
                  0,
                  0.01,
                  this.dynamicProperties
                )),
                (this.localShapeCollection =
                  shapeCollection_pool.newShapeCollection()),
                this.localShapeCollection.addShape(this.v),
                (this.paths = this.localShapeCollection),
                this.dynamicProperties.length
                  ? (this.k = !0)
                  : this.convertToPath();
            };
          })(),
          h = (function () {
            function t(t) {
              if (this.elem.globalData.frameId !== this.frameId) {
                (this.mdf = !1), (this.frameId = this.elem.globalData.frameId);
                var e,
                  r = this.dynamicProperties.length;
                for (e = 0; r > e; e += 1)
                  this.dynamicProperties[e].getValue(t),
                    this.dynamicProperties[e].mdf && (this.mdf = !0);
                this.mdf && this.convertRectToPath();
              }
            }
            function e() {
              var t = this.p.v[0],
                e = this.p.v[1],
                r = this.s.v[0] / 2,
                i = this.s.v[1] / 2,
                n = bm_min(r, i, this.r.v),
                s = n * (1 - roundCorner);
              (this.v._length = 0),
                2 === this.d || 1 === this.d
                  ? (this.v.setTripleAt(
                      t + r,
                      e - i + n,
                      t + r,
                      e - i + n,
                      t + r,
                      e - i + s,
                      0,
                      !0
                    ),
                    this.v.setTripleAt(
                      t + r,
                      e + i - n,
                      t + r,
                      e + i - s,
                      t + r,
                      e + i - n,
                      1,
                      !0
                    ),
                    0 !== n
                      ? (this.v.setTripleAt(
                          t + r - n,
                          e + i,
                          t + r - n,
                          e + i,
                          t + r - s,
                          e + i,
                          2,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r + n,
                          e + i,
                          t - r + s,
                          e + i,
                          t - r + n,
                          e + i,
                          3,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r,
                          e + i - n,
                          t - r,
                          e + i - n,
                          t - r,
                          e + i - s,
                          4,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r,
                          e - i + n,
                          t - r,
                          e - i + s,
                          t - r,
                          e - i + n,
                          5,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r + n,
                          e - i,
                          t - r + n,
                          e - i,
                          t - r + s,
                          e - i,
                          6,
                          !0
                        ),
                        this.v.setTripleAt(
                          t + r - n,
                          e - i,
                          t + r - s,
                          e - i,
                          t + r - n,
                          e - i,
                          7,
                          !0
                        ))
                      : (this.v.setTripleAt(
                          t - r,
                          e + i,
                          t - r + s,
                          e + i,
                          t - r,
                          e + i,
                          2
                        ),
                        this.v.setTripleAt(
                          t - r,
                          e - i,
                          t - r,
                          e - i + s,
                          t - r,
                          e - i,
                          3
                        )))
                  : (this.v.setTripleAt(
                      t + r,
                      e - i + n,
                      t + r,
                      e - i + s,
                      t + r,
                      e - i + n,
                      0,
                      !0
                    ),
                    0 !== n
                      ? (this.v.setTripleAt(
                          t + r - n,
                          e - i,
                          t + r - n,
                          e - i,
                          t + r - s,
                          e - i,
                          1,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r + n,
                          e - i,
                          t - r + s,
                          e - i,
                          t - r + n,
                          e - i,
                          2,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r,
                          e - i + n,
                          t - r,
                          e - i + n,
                          t - r,
                          e - i + s,
                          3,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r,
                          e + i - n,
                          t - r,
                          e + i - s,
                          t - r,
                          e + i - n,
                          4,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r + n,
                          e + i,
                          t - r + n,
                          e + i,
                          t - r + s,
                          e + i,
                          5,
                          !0
                        ),
                        this.v.setTripleAt(
                          t + r - n,
                          e + i,
                          t + r - s,
                          e + i,
                          t + r - n,
                          e + i,
                          6,
                          !0
                        ),
                        this.v.setTripleAt(
                          t + r,
                          e + i - n,
                          t + r,
                          e + i - n,
                          t + r,
                          e + i - s,
                          7,
                          !0
                        ))
                      : (this.v.setTripleAt(
                          t - r,
                          e - i,
                          t - r + s,
                          e - i,
                          t - r,
                          e - i,
                          1,
                          !0
                        ),
                        this.v.setTripleAt(
                          t - r,
                          e + i,
                          t - r,
                          e + i - s,
                          t - r,
                          e + i,
                          2,
                          !0
                        ),
                        this.v.setTripleAt(
                          t + r,
                          e + i,
                          t + r - s,
                          e + i,
                          t + r,
                          e + i,
                          3,
                          !0
                        )));
            }
            return function (i, n) {
              (this.v = shape_pool.newShape()),
                (this.v.c = !0),
                (this.localShapeCollection =
                  shapeCollection_pool.newShapeCollection()),
                this.localShapeCollection.addShape(this.v),
                (this.paths = this.localShapeCollection),
                (this.elem = i),
                (this.comp = i.comp),
                (this.frameId = -1),
                (this.d = n.d),
                (this.dynamicProperties = []),
                (this.mdf = !1),
                (this.getValue = t),
                (this.convertRectToPath = e),
                (this.reset = r),
                (this.p = PropertyFactory.getProp(
                  i,
                  n.p,
                  1,
                  0,
                  this.dynamicProperties
                )),
                (this.s = PropertyFactory.getProp(
                  i,
                  n.s,
                  1,
                  0,
                  this.dynamicProperties
                )),
                (this.r = PropertyFactory.getProp(
                  i,
                  n.r,
                  0,
                  0,
                  this.dynamicProperties
                )),
                this.dynamicProperties.length
                  ? (this.k = !0)
                  : this.convertRectToPath();
            };
          })(),
          p = {};
        return (p.getShapeProp = s), p;
      })(),
      ShapeModifiers = (function () {
        function t(t, e) {
          i[t] || (i[t] = e);
        }
        function e(t, e, r, n) {
          return new i[t](e, r, n);
        }
        var r = {},
          i = {};
        return (r.registerModifier = t), (r.getModifier = e), r;
      })();
    (ShapeModifier.prototype.initModifierProperties = function () {}),
      (ShapeModifier.prototype.addShapeToModifier = function () {}),
      (ShapeModifier.prototype.addShape = function (t) {
        this.closed ||
          (this.shapes.push({
            shape: t.sh,
            data: t,
            localShapeCollection: shapeCollection_pool.newShapeCollection(),
          }),
          this.addShapeToModifier(t.sh));
      }),
      (ShapeModifier.prototype.init = function (t, e, r) {
        (this.elem = t),
          (this.frameId = -1),
          (this.shapes = []),
          (this.dynamicProperties = []),
          (this.mdf = !1),
          (this.closed = !1),
          (this.k = !1),
          (this.isTrimming = !1),
          (this.comp = t.comp),
          this.initModifierProperties(t, e),
          this.dynamicProperties.length
            ? ((this.k = !0), r.push(this))
            : this.getValue(!0);
      }),
      extendPrototype(ShapeModifier, TrimModifier),
      (TrimModifier.prototype.processKeys = function (t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
          (this.mdf = t ? !0 : !1),
            (this.frameId = this.elem.globalData.frameId);
          var e,
            r = this.dynamicProperties.length;
          for (e = 0; r > e; e += 1)
            this.dynamicProperties[e].getValue(),
              this.dynamicProperties[e].mdf && (this.mdf = !0);
          if (this.mdf || t) {
            var i = (this.o.v % 360) / 360;
            0 > i && (i += 1);
            var n = this.s.v + i,
              s = this.e.v + i;
            if (n > s) {
              var a = n;
              (n = s), (s = a);
            }
            (this.sValue = n), (this.eValue = s), (this.oValue = i);
          }
        }
      }),
      (TrimModifier.prototype.initModifierProperties = function (t, e) {
        (this.sValue = 0),
          (this.eValue = 0),
          (this.oValue = 0),
          (this.getValue = this.processKeys),
          (this.s = PropertyFactory.getProp(
            t,
            e.s,
            0,
            0.01,
            this.dynamicProperties
          )),
          (this.e = PropertyFactory.getProp(
            t,
            e.e,
            0,
            0.01,
            this.dynamicProperties
          )),
          (this.o = PropertyFactory.getProp(
            t,
            e.o,
            0,
            0,
            this.dynamicProperties
          )),
          (this.m = e.m),
          this.dynamicProperties.length || this.getValue(!0);
      }),
      (TrimModifier.prototype.getSegmentsLength = function (t) {
        var e,
          r = t.c,
          i = t.v,
          n = t.o,
          s = t.i,
          a = t._length,
          o = [],
          l = 0;
        for (e = 0; a - 1 > e; e += 1)
          (o[e] = bez.getBezierLength(i[e], i[e + 1], n[e], s[e + 1])),
            (l += o[e].addedLength);
        return (
          r &&
            ((o[e] = bez.getBezierLength(i[e], i[0], n[e], s[0])),
            (l += o[e].addedLength)),
          { lengths: o, totalLength: l }
        );
      }),
      (TrimModifier.prototype.calculateShapeEdges = function (t, e, r, i, n) {
        var s = [];
        1 >= e
          ? s.push({ s: t, e: e })
          : t >= 1
          ? s.push({ s: t - 1, e: e - 1 })
          : (s.push({ s: t, e: 1 }), s.push({ s: 0, e: e - 1 }));
        var a,
          o,
          l = [],
          h = s.length;
        for (a = 0; h > a; a += 1)
          if (((o = s[a]), o.e * n < i || o.s * n > i + r));
          else {
            var p, c;
            (p = o.s * n <= i ? 0 : (o.s * n - i) / r),
              (c = o.e * n >= i + r ? 1 : (o.e * n - i) / r),
              l.push([p, c]);
          }
        return l.length || l.push([0, 0]), l;
      }),
      (TrimModifier.prototype.processShapes = function (t) {
        var e,
          r,
          i,
          n,
          s,
          a,
          o,
          l = this.shapes.length,
          h = this.sValue,
          p = this.eValue,
          c = 0;
        if (p === h)
          for (r = 0; l > r; r += 1)
            this.shapes[r].localShapeCollection.releaseShapes(),
              (this.shapes[r].shape.mdf = !0),
              (this.shapes[r].shape.paths =
                this.shapes[r].localShapeCollection);
        else if ((1 === p && 0 === h) || (0 === p && 1 === h)) {
          if (this.mdf)
            for (r = 0; l > r; r += 1) this.shapes[r].shape.mdf = !0;
        } else {
          var f,
            u,
            d = [];
          for (r = 0; l > r; r += 1)
            if (
              ((f = this.shapes[r]),
              f.shape.mdf || this.mdf || t || 2 === this.m)
            ) {
              if (
                ((e = f.shape.paths),
                (n = e._length),
                (o = 0),
                !f.shape.mdf && f.pathsData)
              )
                o = f.totalShapeLength;
              else {
                for (s = [], i = 0; n > i; i += 1)
                  (a = this.getSegmentsLength(e.shapes[i])),
                    s.push(a),
                    (o += a.totalLength);
                (f.totalShapeLength = o), (f.pathsData = s);
              }
              (c += o), (f.shape.mdf = !0);
            } else f.shape.paths = f.localShapeCollection;
          var i,
            n,
            m = h,
            y = p,
            g = 0;
          for (r = l - 1; r >= 0; r -= 1)
            if (((f = this.shapes[r]), f.shape.mdf)) {
              if (
                ((u = f.localShapeCollection),
                u.releaseShapes(),
                2 === this.m && l > 1)
              ) {
                var v = this.calculateShapeEdges(
                  h,
                  p,
                  f.totalShapeLength,
                  g,
                  c
                );
                g += f.totalShapeLength;
              } else v = [[m, y]];
              for (n = v.length, i = 0; n > i; i += 1) {
                (m = v[i][0]),
                  (y = v[i][1]),
                  (d.length = 0),
                  1 >= y
                    ? d.push({
                        s: f.totalShapeLength * m,
                        e: f.totalShapeLength * y,
                      })
                    : m >= 1
                    ? d.push({
                        s: f.totalShapeLength * (m - 1),
                        e: f.totalShapeLength * (y - 1),
                      })
                    : (d.push({
                        s: f.totalShapeLength * m,
                        e: f.totalShapeLength,
                      }),
                      d.push({ s: 0, e: f.totalShapeLength * (y - 1) }));
                var b = this.addShapes(f, d[0]);
                if (d[0].s !== d[0].e) {
                  if (d.length > 1)
                    if (f.shape.v.c) {
                      var x = b.pop();
                      this.addPaths(b, u), (b = this.addShapes(f, d[1], x));
                    } else this.addPaths(b, u), (b = this.addShapes(f, d[1]));
                  this.addPaths(b, u);
                }
              }
              f.shape.paths = u;
            }
        }
        this.dynamicProperties.length || (this.mdf = !1);
      }),
      (TrimModifier.prototype.addPaths = function (t, e) {
        var r,
          i = t.length;
        for (r = 0; i > r; r += 1) e.addShape(t[r]);
      }),
      (TrimModifier.prototype.addSegment = function (t, e, r, i, n, s, a) {
        n.setXYAt(e[0], e[1], "o", s),
          n.setXYAt(r[0], r[1], "i", s + 1),
          a && n.setXYAt(t[0], t[1], "v", s),
          n.setXYAt(i[0], i[1], "v", s + 1);
      }),
      (TrimModifier.prototype.addShapes = function (t, e, r) {
        var i,
          n,
          s,
          a,
          o,
          l,
          h,
          p,
          c = t.pathsData,
          f = t.shape.paths.shapes,
          u = t.shape.paths._length,
          d = 0,
          m = [],
          y = !0;
        for (
          r
            ? ((o = r._length), (p = r._length))
            : ((r = shape_pool.newShape()), (o = 0), (p = 0)),
            m.push(r),
            i = 0;
          u > i;
          i += 1
        ) {
          for (
            l = c[i].lengths,
              r.c = f[i].c,
              s = f[i].c ? l.length : l.length + 1,
              n = 1;
            s > n;
            n += 1
          )
            if (((a = l[n - 1]), d + a.addedLength < e.s))
              (d += a.addedLength), (r.c = !1);
            else {
              if (d > e.e) {
                r.c = !1;
                break;
              }
              e.s <= d && e.e >= d + a.addedLength
                ? (this.addSegment(
                    f[i].v[n - 1],
                    f[i].o[n - 1],
                    f[i].i[n],
                    f[i].v[n],
                    r,
                    o,
                    y
                  ),
                  (y = !1))
                : ((h = bez.getNewSegment(
                    f[i].v[n - 1],
                    f[i].v[n],
                    f[i].o[n - 1],
                    f[i].i[n],
                    (e.s - d) / a.addedLength,
                    (e.e - d) / a.addedLength,
                    l[n - 1]
                  )),
                  this.addSegment(h.pt1, h.pt3, h.pt4, h.pt2, r, o, y),
                  (y = !1),
                  (r.c = !1)),
                (d += a.addedLength),
                (o += 1);
            }
          if (f[i].c) {
            if (((a = l[n - 1]), d <= e.e)) {
              var g = l[n - 1].addedLength;
              e.s <= d && e.e >= d + g
                ? (this.addSegment(
                    f[i].v[n - 1],
                    f[i].o[n - 1],
                    f[i].i[0],
                    f[i].v[0],
                    r,
                    o,
                    y
                  ),
                  (y = !1))
                : ((h = bez.getNewSegment(
                    f[i].v[n - 1],
                    f[i].v[0],
                    f[i].o[n - 1],
                    f[i].i[0],
                    (e.s - d) / g,
                    (e.e - d) / g,
                    l[n - 1]
                  )),
                  this.addSegment(h.pt1, h.pt3, h.pt4, h.pt2, r, o, y),
                  (y = !1),
                  (r.c = !1));
            } else r.c = !1;
            (d += a.addedLength), (o += 1);
          }
          if (
            (r._length &&
              (r.setXYAt(r.v[p][0], r.v[p][1], "i", p),
              r.setXYAt(
                r.v[r._length - 1][0],
                r.v[r._length - 1][1],
                "o",
                r._length - 1
              )),
            d > e.e)
          )
            break;
          u - 1 > i &&
            ((r = shape_pool.newShape()), (y = !0), m.push(r), (o = 0));
        }
        return m;
      }),
      ShapeModifiers.registerModifier("tm", TrimModifier),
      extendPrototype(ShapeModifier, RoundCornersModifier),
      (RoundCornersModifier.prototype.processKeys = function (t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
          (this.mdf = t ? !0 : !1),
            (this.frameId = this.elem.globalData.frameId);
          var e,
            r = this.dynamicProperties.length;
          for (e = 0; r > e; e += 1)
            this.dynamicProperties[e].getValue(),
              this.dynamicProperties[e].mdf && (this.mdf = !0);
        }
      }),
      (RoundCornersModifier.prototype.initModifierProperties = function (t, e) {
        (this.getValue = this.processKeys),
          (this.rd = PropertyFactory.getProp(
            t,
            e.r,
            0,
            null,
            this.dynamicProperties
          )),
          this.dynamicProperties.length || this.getValue(!0);
      }),
      (RoundCornersModifier.prototype.processPath = function (t, e) {
        var r = shape_pool.newShape();
        r.c = t.c;
        var i,
          n,
          s,
          a,
          o,
          l,
          h,
          p,
          c,
          f,
          u,
          d,
          m,
          y = t._length,
          g = 0;
        for (i = 0; y > i; i += 1)
          (n = t.v[i]),
            (a = t.o[i]),
            (s = t.i[i]),
            n[0] === a[0] && n[1] === a[1] && n[0] === s[0] && n[1] === s[1]
              ? (0 !== i && i !== y - 1) || t.c
                ? ((o = 0 === i ? t.v[y - 1] : t.v[i - 1]),
                  (l = Math.sqrt(
                    Math.pow(n[0] - o[0], 2) + Math.pow(n[1] - o[1], 2)
                  )),
                  (h = l ? Math.min(l / 2, e) / l : 0),
                  (p = d = n[0] + (o[0] - n[0]) * h),
                  (c = m = n[1] - (n[1] - o[1]) * h),
                  (f = p - (p - n[0]) * roundCorner),
                  (u = c - (c - n[1]) * roundCorner),
                  r.setTripleAt(p, c, f, u, d, m, g),
                  (g += 1),
                  (o = i === y - 1 ? t.v[0] : t.v[i + 1]),
                  (l = Math.sqrt(
                    Math.pow(n[0] - o[0], 2) + Math.pow(n[1] - o[1], 2)
                  )),
                  (h = l ? Math.min(l / 2, e) / l : 0),
                  (p = f = n[0] + (o[0] - n[0]) * h),
                  (c = u = n[1] + (o[1] - n[1]) * h),
                  (d = p - (p - n[0]) * roundCorner),
                  (m = c - (c - n[1]) * roundCorner),
                  r.setTripleAt(p, c, f, u, d, m, g),
                  (g += 1))
                : (r.setTripleAt(n[0], n[1], a[0], a[1], s[0], s[1], g),
                  (g += 1))
              : (r.setTripleAt(
                  t.v[i][0],
                  t.v[i][1],
                  t.o[i][0],
                  t.o[i][1],
                  t.i[i][0],
                  t.i[i][1],
                  g
                ),
                (g += 1));
        return r;
      }),
      (RoundCornersModifier.prototype.processShapes = function (t) {
        var e,
          r,
          i,
          n,
          s = this.shapes.length,
          a = this.rd.v;
        if (0 !== a) {
          var o, l, h;
          for (r = 0; s > r; r += 1) {
            if (
              ((o = this.shapes[r]),
              (l = o.shape.paths),
              (h = o.localShapeCollection),
              o.shape.mdf || this.mdf || t)
            )
              for (
                h.releaseShapes(),
                  o.shape.mdf = !0,
                  e = o.shape.paths.shapes,
                  n = o.shape.paths._length,
                  i = 0;
                n > i;
                i += 1
              )
                h.addShape(this.processPath(e[i], a));
            o.shape.paths = o.localShapeCollection;
          }
        }
        this.dynamicProperties.length || (this.mdf = !1);
      }),
      ShapeModifiers.registerModifier("rd", RoundCornersModifier),
      extendPrototype(ShapeModifier, RepeaterModifier),
      (RepeaterModifier.prototype.processKeys = function (t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
          (this.mdf = t ? !0 : !1),
            (this.frameId = this.elem.globalData.frameId);
          var e,
            r = this.dynamicProperties.length;
          for (e = 0; r > e; e += 1)
            this.dynamicProperties[e].getValue(),
              this.dynamicProperties[e].mdf && (this.mdf = !0);
        }
      }),
      (RepeaterModifier.prototype.initModifierProperties = function (t, e) {
        (this.getValue = this.processKeys),
          (this.c = PropertyFactory.getProp(
            t,
            e.c,
            0,
            null,
            this.dynamicProperties
          )),
          (this.o = PropertyFactory.getProp(
            t,
            e.o,
            0,
            null,
            this.dynamicProperties
          )),
          (this.tr = PropertyFactory.getProp(
            t,
            e.tr,
            2,
            null,
            this.dynamicProperties
          )),
          this.dynamicProperties.length || this.getValue(!0),
          (this.pMatrix = new Matrix()),
          (this.rMatrix = new Matrix()),
          (this.sMatrix = new Matrix()),
          (this.tMatrix = new Matrix()),
          (this.matrix = new Matrix());
      }),
      (RepeaterModifier.prototype.applyTransforms = function (
        t,
        e,
        r,
        i,
        n,
        s
      ) {
        var a = s ? -1 : 1,
          o = i.s.v[0] + (1 - i.s.v[0]) * (1 - n),
          l = i.s.v[1] + (1 - i.s.v[1]) * (1 - n);
        t.translate(i.p.v[0] * a * n, i.p.v[1] * a * n, i.p.v[2]),
          e.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
          e.rotate(-i.r.v * a * n),
          e.translate(i.a.v[0], i.a.v[1], i.a.v[2]),
          r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
          r.scale(s ? 1 / o : o, s ? 1 / l : l),
          r.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
      }),
      (RepeaterModifier.prototype.processShapes = function (t) {
        this.dynamicProperties.length || (this.mdf = !1);
        var e,
          r,
          i,
          n,
          s,
          a,
          o,
          l,
          h,
          p,
          c,
          f,
          u,
          d,
          m = this.shapes.length,
          y = Math.ceil(this.c.v),
          g = this.o.v,
          v = g % 1,
          b = g > 0 ? Math.floor(g) : Math.ceil(g),
          x = (this.tr.v.props, this.pMatrix.props),
          E = this.rMatrix.props,
          w = this.sMatrix.props,
          P = 0;
        for (e = 0; m > e; e += 1) {
          if (
            ((n = this.shapes[e]),
            (s = n.localShapeCollection),
            n.shape.mdf || this.mdf || t)
          ) {
            if (
              (s.releaseShapes(),
              (n.shape.mdf = !0),
              (l = n.shape.paths),
              (h = l.shapes),
              (i = l._length),
              (P = 0),
              this.pMatrix.reset(),
              this.rMatrix.reset(),
              this.sMatrix.reset(),
              this.tMatrix.reset(),
              this.matrix.reset(),
              g > 0)
            ) {
              for (; b > P; )
                this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !1
                ),
                  (P += 1);
              v &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  v,
                  !1
                ),
                (P += v));
            } else if (0 > b) {
              for (; P > b; )
                this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !0
                ),
                  (P -= 1);
              v &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  -v,
                  !0
                ),
                (P -= v));
            }
            for (r = 0; i > r; r += 1)
              for (a = h[r], o = 0; y > o; o += 1) {
                if (
                  (0 !== o &&
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1
                    ),
                  n.data.transformers)
                ) {
                  for (
                    n.data.lvl = 0, d = 0, c = n.data.elements.length, p = 0;
                    c > p;
                    p += 1
                  )
                    d = Math.max(d, n.data.elements[p].st.lvl);
                  for (
                    u = n.data.transformers, c = u.length, p = c - 1;
                    p >= d;
                    p -= 1
                  )
                    (f = u[p].mProps.v.props),
                      this.matrix.transform(
                        f[0],
                        f[1],
                        f[2],
                        f[3],
                        f[4],
                        f[5],
                        f[6],
                        f[7],
                        f[8],
                        f[9],
                        f[10],
                        f[11],
                        f[12],
                        f[13],
                        f[14],
                        f[15]
                      );
                }
                0 !== P &&
                  (this.matrix.transform(
                    E[0],
                    E[1],
                    E[2],
                    E[3],
                    E[4],
                    E[5],
                    E[6],
                    E[7],
                    E[8],
                    E[9],
                    E[10],
                    E[11],
                    E[12],
                    E[13],
                    E[14],
                    E[15]
                  ),
                  this.matrix.transform(
                    w[0],
                    w[1],
                    w[2],
                    w[3],
                    w[4],
                    w[5],
                    w[6],
                    w[7],
                    w[8],
                    w[9],
                    w[10],
                    w[11],
                    w[12],
                    w[13],
                    w[14],
                    w[15]
                  ),
                  this.matrix.transform(
                    x[0],
                    x[1],
                    x[2],
                    x[3],
                    x[4],
                    x[5],
                    x[6],
                    x[7],
                    x[8],
                    x[9],
                    x[10],
                    x[11],
                    x[12],
                    x[13],
                    x[14],
                    x[15]
                  )),
                  s.addShape(this.processPath(a, this.matrix)),
                  this.matrix.reset(),
                  (P += 1);
              }
          }
          n.shape.paths = s;
        }
      }),
      (RepeaterModifier.prototype.processPath = function (t, e) {
        var r = shape_pool.clone(t, e);
        return r;
      }),
      ShapeModifiers.registerModifier("rp", RepeaterModifier),
      (ShapeCollection.prototype.addShape = function (t) {
        this._length === this._maxLength &&
          ((this.shapes = this.shapes.concat(
            Array.apply(null, { length: this._maxLength })
          )),
          (this._maxLength *= 2)),
          (this.shapes[this._length] = t),
          (this._length += 1);
      }),
      (ShapeCollection.prototype.releaseShapes = function () {
        var t;
        for (t = 0; t < this._length; t += 1)
          shape_pool.release(this.shapes[t]);
        this._length = 0;
      });
    var ImagePreloader = (function () {
        function t() {
          (this.loadedAssets += 1), this.loadedAssets === this.totalImages;
        }
        function e(t) {
          var e = "";
          if (this.assetsPath) {
            var r = t.p;
            -1 !== r.indexOf("images/") && (r = r.split("/")[1]),
              (e = this.assetsPath + r);
          } else (e = this.path), (e += t.u ? t.u : ""), (e += t.p);
          return e;
        }
        function r(e) {
          var r = document.createElement("img");
          r.addEventListener("load", t.bind(this), !1),
            r.addEventListener("error", t.bind(this), !1),
            (r.src = e);
        }
        function i(t) {
          this.totalAssets = t.length;
          var i;
          for (i = 0; i < this.totalAssets; i += 1)
            t[i].layers ||
              (r.bind(this)(e.bind(this)(t[i])), (this.totalImages += 1));
        }
        function n(t) {
          this.path = t || "";
        }
        function s(t) {
          this.assetsPath = t || "";
        }
        return function () {
          (this.loadAssets = i),
            (this.setAssetsPath = s),
            (this.setPath = n),
            (this.assetsPath = ""),
            (this.path = ""),
            (this.totalAssets = 0),
            (this.totalImages = 0),
            (this.loadedAssets = 0);
        };
      })(),
      featureSupport = (function () {
        var t = { maskType: !0 };
        return (
          (/MSIE 10/i.test(navigator.userAgent) ||
            /MSIE 9/i.test(navigator.userAgent) ||
            /rv:11.0/i.test(navigator.userAgent) ||
            /Edge\/\d./i.test(navigator.userAgent)) &&
            (t.maskType = !1),
          t
        );
      })(),
      filtersFactory = (function () {
        function t(t) {
          var e = document.createElementNS(svgNS, "filter");
          return (
            e.setAttribute("id", t),
            e.setAttribute("filterUnits", "objectBoundingBox"),
            e.setAttribute("x", "0%"),
            e.setAttribute("y", "0%"),
            e.setAttribute("width", "100%"),
            e.setAttribute("height", "100%"),
            e
          );
        }
        function e() {
          var t = document.createElementNS(svgNS, "feColorMatrix");
          return (
            t.setAttribute("type", "matrix"),
            t.setAttribute("color-interpolation-filters", "sRGB"),
            t.setAttribute(
              "values",
              "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 0 1"
            ),
            t
          );
        }
        var r = {};
        return (r.createFilter = t), (r.createAlphaToLuminanceFilter = e), r;
      })(),
      pooling = (function () {
        function t(t) {
          return t.concat(Array.apply(null, { length: t.length }));
        }
        return { double: t };
      })(),
      point_pool = (function () {
        function t() {
          var t;
          return i ? ((i -= 1), (t = s[i])) : (t = [0.1, 0.1]), t;
        }
        function e(t) {
          i === n && ((s = pooling["double"](s)), (n = 2 * n)),
            (s[i] = t),
            (i += 1);
        }
        var r = { newPoint: t, release: e },
          i = 0,
          n = 8,
          s = Array.apply(null, { length: n });
        return r;
      })(),
      shape_pool = (function () {
        function t() {
          var t;
          return s ? ((s -= 1), (t = o[s])) : (t = new ShapePath()), t;
        }
        function e(t) {
          s === a && ((o = pooling["double"](o)), (a = 2 * a));
          var e,
            r = t._length;
          for (e = 0; r > e; e += 1)
            point_pool.release(t.v[e]),
              point_pool.release(t.i[e]),
              point_pool.release(t.o[e]),
              (t.v[e] = null),
              (t.i[e] = null),
              (t.o[e] = null);
          (t._length = 0), (t.c = !1), (o[s] = t), (s += 1);
        }
        function r(t, r) {
          for (; r--; ) e(t[r]);
        }
        function i(e, r) {
          var i,
            n = e._length,
            s = t();
          (s._length = e._length), (s.c = e.c);
          var a;
          for (i = 0; n > i; i += 1)
            r
              ? ((a = r.applyToPointArray(e.v[i][0], e.v[i][1], 0, 2)),
                s.setXYAt(a[0], a[1], "v", i),
                point_pool.release(a),
                (a = r.applyToPointArray(e.o[i][0], e.o[i][1], 0, 2)),
                s.setXYAt(a[0], a[1], "o", i),
                point_pool.release(a),
                (a = r.applyToPointArray(e.i[i][0], e.i[i][1], 0, 2)),
                s.setXYAt(a[0], a[1], "i", i),
                point_pool.release(a))
              : s.setTripleAt(
                  e.v[i][0],
                  e.v[i][1],
                  e.o[i][0],
                  e.o[i][1],
                  e.i[i][0],
                  e.i[i][1],
                  i
                );
          return s;
        }
        var n = { clone: i, newShape: t, release: e, releaseArray: r },
          s = 0,
          a = 4,
          o = Array.apply(null, { length: a });
        return n;
      })(),
      shapeCollection_pool = (function () {
        function t() {
          var t;
          return n ? ((n -= 1), (t = a[n])) : (t = new ShapeCollection()), t;
        }
        function e(t) {
          var e,
            r = t._length;
          for (e = 0; r > e; e += 1) shape_pool.release(t.shapes[e]);
          (t._length = 0),
            n === s && ((a = pooling["double"](a)), (s = 2 * s)),
            (a[n] = t),
            (n += 1);
        }
        function r(t, r) {
          e(t),
            n === s && ((a = pooling["double"](a)), (s = 2 * s)),
            (a[n] = t),
            (n += 1);
        }
        var i = { newShapeCollection: t, release: e, clone: r },
          n = 0,
          s = 4,
          a = Array.apply(null, { length: s });
        return i;
      })();
    (BaseRenderer.prototype.checkLayers = function (t) {
      var e,
        r,
        i = this.layers.length;
      for (this.completeLayers = !0, e = i - 1; e >= 0; e--)
        this.elements[e] ||
          ((r = this.layers[e]),
          r.ip - r.st <= t - this.layers[e].st &&
            r.op - r.st > t - this.layers[e].st &&
            this.buildItem(e)),
          (this.completeLayers = this.elements[e] ? this.completeLayers : !1);
      this.checkPendingElements();
    }),
      (BaseRenderer.prototype.createItem = function (t) {
        switch (t.ty) {
          case 2:
            return this.createImage(t);
          case 0:
            return this.createComp(t);
          case 1:
            return this.createSolid(t);
          case 4:
            return this.createShape(t);
          case 5:
            return this.createText(t);
          case 13:
            return this.createCamera(t);
          case 99:
            return null;
        }
        return this.createBase(t);
      }),
      (BaseRenderer.prototype.createCamera = function () {
        throw new Error("You're using a 3d camera. Try the html renderer.");
      }),
      (BaseRenderer.prototype.buildAllItems = function () {
        var t,
          e = this.layers.length;
        for (t = 0; e > t; t += 1) this.buildItem(t);
        this.checkPendingElements();
      }),
      (BaseRenderer.prototype.includeLayers = function (t) {
        this.completeLayers = !1;
        var e,
          r,
          i = t.length,
          n = this.layers.length;
        for (e = 0; i > e; e += 1)
          for (r = 0; n > r; ) {
            if (this.layers[r].id == t[e].id) {
              this.layers[r] = t[e];
              break;
            }
            r += 1;
          }
      }),
      (BaseRenderer.prototype.setProjectInterface = function (t) {
        this.globalData.projectInterface = t;
      }),
      (BaseRenderer.prototype.initItems = function () {
        this.globalData.progressiveLoad || this.buildAllItems();
      }),
      (BaseRenderer.prototype.buildElementParenting = function (t, e, r) {
        r = r || [];
        for (
          var i = this.elements, n = this.layers, s = 0, a = n.length;
          a > s;

        )
          n[s].ind == e &&
            (i[s] && i[s] !== !0
              ? void 0 !== n[s].parent
                ? (r.push(i[s]),
                  (i[s]._isParent = !0),
                  this.buildElementParenting(t, n[s].parent, r))
                : (r.push(i[s]), (i[s]._isParent = !0), t.setHierarchy(r))
              : (this.buildItem(s), this.addPendingElement(t))),
            (s += 1);
      }),
      (BaseRenderer.prototype.addPendingElement = function (t) {
        this.pendingElements.push(t);
      }),
      extendPrototype(BaseRenderer, SVGRenderer),
      (SVGRenderer.prototype.createBase = function (t) {
        return new SVGBaseElement(t, this.layerElement, this.globalData, this);
      }),
      (SVGRenderer.prototype.createShape = function (t) {
        return new IShapeElement(t, this.layerElement, this.globalData, this);
      }),
      (SVGRenderer.prototype.createText = function (t) {
        return new SVGTextElement(t, this.layerElement, this.globalData, this);
      }),
      (SVGRenderer.prototype.createImage = function (t) {
        return new IImageElement(t, this.layerElement, this.globalData, this);
      }),
      (SVGRenderer.prototype.createComp = function (t) {
        return new ICompElement(t, this.layerElement, this.globalData, this);
      }),
      (SVGRenderer.prototype.createSolid = function (t) {
        return new ISolidElement(t, this.layerElement, this.globalData, this);
      }),
      (SVGRenderer.prototype.configAnimation = function (t) {
        (this.layerElement = document.createElementNS(svgNS, "svg")),
          this.layerElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
          this.layerElement.setAttribute("width", t.w),
          this.layerElement.setAttribute("height", t.h),
          this.layerElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h),
          this.layerElement.setAttribute(
            "preserveAspectRatio",
            this.renderConfig.preserveAspectRatio
          ),
          (this.layerElement.style.width = "100%"),
          (this.layerElement.style.height = "100%"),
          this.animationItem.wrapper.appendChild(this.layerElement);
        var e = document.createElementNS(svgNS, "defs");
        (this.globalData.defs = e),
          this.layerElement.appendChild(e),
          (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
            this.animationItem
          )),
          (this.globalData.getAssetsPath =
            this.animationItem.getAssetsPath.bind(this.animationItem)),
          (this.globalData.progressiveLoad = this.renderConfig.progressiveLoad),
          (this.globalData.frameId = 0),
          (this.globalData.nm = t.nm),
          (this.globalData.compSize = { w: t.w, h: t.h }),
          (this.data = t),
          (this.globalData.frameRate = t.fr);
        var r = document.createElementNS(svgNS, "clipPath"),
          i = document.createElementNS(svgNS, "rect");
        i.setAttribute("width", t.w),
          i.setAttribute("height", t.h),
          i.setAttribute("x", 0),
          i.setAttribute("y", 0);
        var n = "animationMask_" + randomString(10);
        r.setAttribute("id", n), r.appendChild(i);
        var s = document.createElementNS(svgNS, "g");
        s.setAttribute("clip-path", "url(#" + n + ")"),
          this.layerElement.appendChild(s),
          e.appendChild(r),
          (this.layerElement = s),
          (this.layers = t.layers),
          (this.globalData.fontManager = new FontManager()),
          this.globalData.fontManager.addChars(t.chars),
          this.globalData.fontManager.addFonts(t.fonts, e),
          (this.elements = Array.apply(null, { length: t.layers.length }));
      }),
      (SVGRenderer.prototype.destroy = function () {
        (this.animationItem.wrapper.innerHTML = ""),
          (this.layerElement = null),
          (this.globalData.defs = null);
        var t,
          e = this.layers ? this.layers.length : 0;
        for (t = 0; e > t; t++) this.elements[t] && this.elements[t].destroy();
        (this.elements.length = 0),
          (this.destroyed = !0),
          (this.animationItem = null);
      }),
      (SVGRenderer.prototype.updateContainerSize = function () {}),
      (SVGRenderer.prototype.buildItem = function (t) {
        var e = this.elements;
        if (!e[t] && 99 != this.layers[t].ty) {
          e[t] = !0;
          var r = this.createItem(this.layers[t]);
          (e[t] = r),
            expressionsPlugin &&
              (0 === this.layers[t].ty &&
                this.globalData.projectInterface.registerComposition(r),
              r.initExpressions()),
            this.appendElementInPos(r, t),
            this.layers[t].tt &&
              (this.elements[t - 1] && this.elements[t - 1] !== !0
                ? r.setMatte(e[t - 1].layerId)
                : (this.buildItem(t - 1), this.addPendingElement(r)));
        }
      }),
      (SVGRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length; ) {
          var t = this.pendingElements.pop();
          if ((t.checkParenting(), t.data.tt))
            for (var e = 0, r = this.elements.length; r > e; ) {
              if (this.elements[e] === t) {
                t.setMatte(this.elements[e - 1].layerId);
                break;
              }
              e += 1;
            }
        }
      }),
      (SVGRenderer.prototype.renderFrame = function (t) {
        if (this.renderedFrame != t && !this.destroyed) {
          null === t ? (t = this.renderedFrame) : (this.renderedFrame = t),
            (this.globalData.frameNum = t),
            (this.globalData.frameId += 1),
            (this.globalData.projectInterface.currentFrame = t);
          var e,
            r = this.layers.length;
          for (
            this.completeLayers || this.checkLayers(t), e = r - 1;
            e >= 0;
            e--
          )
            (this.completeLayers || this.elements[e]) &&
              this.elements[e].prepareFrame(t - this.layers[e].st);
          for (e = r - 1; e >= 0; e--)
            (this.completeLayers || this.elements[e]) &&
              this.elements[e].renderFrame();
        }
      }),
      (SVGRenderer.prototype.appendElementInPos = function (t, e) {
        var r = t.getBaseElement();
        if (r) {
          for (var i, n = 0; e > n; )
            this.elements[n] &&
              this.elements[n] !== !0 &&
              this.elements[n].getBaseElement() &&
              (i = this.elements[n].getBaseElement()),
              (n += 1);
          i
            ? this.layerElement.insertBefore(r, i)
            : this.layerElement.appendChild(r);
        }
      }),
      (SVGRenderer.prototype.hide = function () {
        this.layerElement.style.display = "none";
      }),
      (SVGRenderer.prototype.show = function () {
        this.layerElement.style.display = "block";
      }),
      (SVGRenderer.prototype.searchExtraCompositions = function (t) {
        var e,
          r = t.length,
          i = document.createElementNS(svgNS, "g");
        for (e = 0; r > e; e += 1)
          if (t[e].xt) {
            var n = this.createComp(t[e], i, this.globalData.comp, null);
            n.initExpressions(),
              this.globalData.projectInterface.registerComposition(n);
          }
      }),
      (MaskElement.prototype.getMaskProperty = function (t) {
        return this.viewData[t].prop;
      }),
      (MaskElement.prototype.prepareFrame = function () {
        var t,
          e = this.dynamicProperties.length;
        for (t = 0; e > t; t += 1) this.dynamicProperties[t].getValue();
      }),
      (MaskElement.prototype.renderFrame = function (t) {
        var e,
          r = this.masksProperties.length;
        for (e = 0; r > e; e++)
          if (
            ((this.viewData[e].prop.mdf || this.firstFrame) &&
              this.drawPath(
                this.masksProperties[e],
                this.viewData[e].prop.v,
                this.viewData[e]
              ),
            (this.viewData[e].op.mdf || this.firstFrame) &&
              this.viewData[e].elem.setAttribute(
                "fill-opacity",
                this.viewData[e].op.v
              ),
            "n" !== this.masksProperties[e].mode &&
              (this.viewData[e].invRect &&
                (this.element.finalTransform.mProp.mdf || this.firstFrame) &&
                (this.viewData[e].invRect.setAttribute("x", -t.props[12]),
                this.viewData[e].invRect.setAttribute("y", -t.props[13])),
              this.storedData[e].x &&
                (this.storedData[e].x.mdf || this.firstFrame)))
          ) {
            var i = this.storedData[e].expan;
            this.storedData[e].x.v < 0
              ? ("erode" !== this.storedData[e].lastOperator &&
                  ((this.storedData[e].lastOperator = "erode"),
                  this.storedData[e].elem.setAttribute(
                    "filter",
                    "url(#" + this.storedData[e].filterId + ")"
                  )),
                i.setAttribute("radius", -this.storedData[e].x.v))
              : ("dilate" !== this.storedData[e].lastOperator &&
                  ((this.storedData[e].lastOperator = "dilate"),
                  this.storedData[e].elem.setAttribute("filter", null)),
                this.storedData[e].elem.setAttribute(
                  "stroke-width",
                  2 * this.storedData[e].x.v
                ));
          }
        this.firstFrame = !1;
      }),
      (MaskElement.prototype.getMaskelement = function () {
        return this.maskElement;
      }),
      (MaskElement.prototype.createLayerSolidPath = function () {
        var t = "M0,0 ";
        return (
          (t += " h" + this.globalData.compSize.w),
          (t += " v" + this.globalData.compSize.h),
          (t += " h-" + this.globalData.compSize.w),
          (t += " v-" + this.globalData.compSize.h + " ")
        );
      }),
      (MaskElement.prototype.drawPath = function (t, e, r) {
        var i,
          n,
          s = " M" + e.v[0][0] + "," + e.v[0][1];
        for (n = e._length, i = 1; n > i; i += 1)
          s +=
            " C" +
            bm_rnd(e.o[i - 1][0]) +
            "," +
            bm_rnd(e.o[i - 1][1]) +
            " " +
            bm_rnd(e.i[i][0]) +
            "," +
            bm_rnd(e.i[i][1]) +
            " " +
            bm_rnd(e.v[i][0]) +
            "," +
            bm_rnd(e.v[i][1]);
        e.c &&
          n > 1 &&
          (s +=
            " C" +
            bm_rnd(e.o[i - 1][0]) +
            "," +
            bm_rnd(e.o[i - 1][1]) +
            " " +
            bm_rnd(e.i[0][0]) +
            "," +
            bm_rnd(e.i[0][1]) +
            " " +
            bm_rnd(e.v[0][0]) +
            "," +
            bm_rnd(e.v[0][1])),
          r.lastPath !== s &&
            (r.elem &&
              (e.c
                ? t.inv
                  ? r.elem.setAttribute("d", this.solidPath + s)
                  : r.elem.setAttribute("d", s)
                : r.elem.setAttribute("d", "")),
            (r.lastPath = s));
      }),
      (MaskElement.prototype.getMask = function (t) {
        for (var e = 0, r = this.masksProperties.length; r > e; ) {
          if (this.masksProperties[e].nm === t)
            return { maskPath: this.viewData[e].prop.pv };
          e += 1;
        }
      }),
      (MaskElement.prototype.destroy = function () {
        (this.element = null),
          (this.globalData = null),
          (this.maskElement = null),
          (this.data = null),
          (this.paths = null),
          (this.masksProperties = null);
      }),
      (BaseElement.prototype.checkMasks = function () {
        if (!this.data.hasMask) return !1;
        for (var t = 0, e = this.data.masksProperties.length; e > t; ) {
          if (
            "n" !== this.data.masksProperties[t].mode &&
            this.data.masksProperties[t].cl !== !1
          )
            return !0;
          t += 1;
        }
        return !1;
      }),
      (BaseElement.prototype.checkParenting = function () {
        void 0 !== this.data.parent &&
          this.comp.buildElementParenting(this, this.data.parent);
      }),
      (BaseElement.prototype.prepareFrame = function (t) {
        this.data.ip - this.data.st <= t && this.data.op - this.data.st > t
          ? this.isVisible !== !0 &&
            ((this.elemMdf = !0),
            (this.globalData.mdf = !0),
            (this.isVisible = !0),
            (this.firstFrame = !0),
            this.data.hasMask && (this.maskManager.firstFrame = !0))
          : this.isVisible !== !1 &&
            ((this.elemMdf = !0),
            (this.globalData.mdf = !0),
            (this.isVisible = !1));
        var e,
          r = this.dynamicProperties.length;
        for (e = 0; r > e; e += 1)
          (this.isVisible ||
            (this._isParent &&
              "transform" === this.dynamicProperties[e].type)) &&
            (this.dynamicProperties[e].getValue(),
            this.dynamicProperties[e].mdf &&
              ((this.elemMdf = !0), (this.globalData.mdf = !0)));
        return (
          this.data.hasMask &&
            this.isVisible &&
            this.maskManager.prepareFrame(t * this.data.sr),
          (this.currentFrameNum = t * this.data.sr),
          this.isVisible
        );
      }),
      (BaseElement.prototype.globalToLocal = function (t) {
        var e = [];
        e.push(this.finalTransform);
        for (var r = !0, i = this.comp; r; )
          i.finalTransform
            ? (i.data.hasMask && e.splice(0, 0, i.finalTransform), (i = i.comp))
            : (r = !1);
        var n,
          s,
          a = e.length;
        for (n = 0; a > n; n += 1)
          (s = e[n].mat.applyToPointArray(0, 0, 0)),
            (t = [t[0] - s[0], t[1] - s[1], 0]);
        return t;
      }),
      (BaseElement.prototype.initExpressions = function () {
        (this.layerInterface = LayerExpressionInterface(this)),
          this.data.hasMask &&
            this.layerInterface.registerMaskInterface(this.maskManager);
        var t = EffectsExpressionInterface.createEffectsInterface(
          this,
          this.layerInterface
        );
        this.layerInterface.registerEffectsInterface(t),
          0 === this.data.ty || this.data.xt
            ? (this.compInterface = CompExpressionInterface(this))
            : 4 === this.data.ty
            ? (this.layerInterface.shapeInterface =
                ShapeExpressionInterface.createShapeInterface(
                  this.shapesData,
                  this.viewData,
                  this.layerInterface
                ))
            : 5 === this.data.ty &&
              (this.layerInterface.textInterface =
                TextExpressionInterface(this));
      }),
      (BaseElement.prototype.setBlendMode = function () {
        var t = "";
        switch (this.data.bm) {
          case 1:
            t = "multiply";
            break;
          case 2:
            t = "screen";
            break;
          case 3:
            t = "overlay";
            break;
          case 4:
            t = "darken";
            break;
          case 5:
            t = "lighten";
            break;
          case 6:
            t = "color-dodge";
            break;
          case 7:
            t = "color-burn";
            break;
          case 8:
            t = "hard-light";
            break;
          case 9:
            t = "soft-light";
            break;
          case 10:
            t = "difference";
            break;
          case 11:
            t = "exclusion";
            break;
          case 12:
            t = "hue";
            break;
          case 13:
            t = "saturation";
            break;
          case 14:
            t = "color";
            break;
          case 15:
            t = "luminosity";
        }
        var e = this.baseElement || this.layerElement;
        e.style["mix-blend-mode"] = t;
      }),
      (BaseElement.prototype.init = function () {
        this.data.sr || (this.data.sr = 1),
          (this.dynamicProperties = []),
          this.data.ef &&
            (this.effects = new EffectsManager(
              this.data,
              this,
              this.dynamicProperties
            )),
          (this.hidden = !1),
          (this.firstFrame = !0),
          (this.isVisible = !1),
          (this._isParent = !1),
          (this.currentFrameNum = -99999),
          (this.lastNum = -99999),
          this.data.ks &&
            ((this.finalTransform = {
              mProp: PropertyFactory.getProp(
                this,
                this.data.ks,
                2,
                null,
                this.dynamicProperties
              ),
              matMdf: !1,
              opMdf: !1,
              mat: new Matrix(),
              opacity: 1,
            }),
            this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
            (this.finalTransform.op = this.finalTransform.mProp.o),
            (this.transform = this.finalTransform.mProp),
            11 !== this.data.ty && this.createElements(),
            this.data.hasMask && this.addMasks(this.data)),
          (this.elemMdf = !1);
      }),
      (BaseElement.prototype.getType = function () {
        return this.type;
      }),
      (BaseElement.prototype.resetHierarchy = function () {
        this.hierarchy ? (this.hierarchy.length = 0) : (this.hierarchy = []);
      }),
      (BaseElement.prototype.getHierarchy = function () {
        return this.hierarchy || (this.hierarchy = []), this.hierarchy;
      }),
      (BaseElement.prototype.setHierarchy = function (t) {
        this.hierarchy = t;
      }),
      (BaseElement.prototype.getLayerSize = function () {
        return 5 === this.data.ty
          ? { w: this.data.textData.width, h: this.data.textData.height }
          : { w: this.data.width, h: this.data.height };
      }),
      (BaseElement.prototype.hide = function () {}),
      (BaseElement.prototype.mHelper = new Matrix()),
      createElement(BaseElement, SVGBaseElement),
      (SVGBaseElement.prototype.createElements = function () {
        (this.layerElement = document.createElementNS(svgNS, "g")),
          (this.transformedElement = this.layerElement),
          this.data.hasMask && (this.maskedElement = this.layerElement);
        var t = null;
        if (this.data.td) {
          if (3 == this.data.td || 1 == this.data.td) {
            var e = document.createElementNS(svgNS, "mask");
            if (
              (e.setAttribute("id", this.layerId),
              e.setAttribute(
                "mask-type",
                3 == this.data.td ? "luminance" : "alpha"
              ),
              e.appendChild(this.layerElement),
              (t = e),
              this.globalData.defs.appendChild(e),
              !featureSupport.maskType && 1 == this.data.td)
            ) {
              e.setAttribute("mask-type", "luminance");
              var r = randomString(10),
                i = filtersFactory.createFilter(r);
              this.globalData.defs.appendChild(i),
                i.appendChild(filtersFactory.createAlphaToLuminanceFilter());
              var n = document.createElementNS(svgNS, "g");
              n.appendChild(this.layerElement),
                (t = n),
                e.appendChild(n),
                n.setAttribute("filter", "url(#" + r + ")");
            }
          } else if (2 == this.data.td) {
            var s = document.createElementNS(svgNS, "mask");
            s.setAttribute("id", this.layerId),
              s.setAttribute("mask-type", "alpha");
            var a = document.createElementNS(svgNS, "g");
            s.appendChild(a);
            var r = randomString(10),
              i = filtersFactory.createFilter(r),
              o = document.createElementNS(svgNS, "feColorMatrix");
            o.setAttribute("type", "matrix"),
              o.setAttribute("color-interpolation-filters", "sRGB"),
              o.setAttribute(
                "values",
                "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 -1 1"
              ),
              i.appendChild(o),
              this.globalData.defs.appendChild(i);
            var l = document.createElementNS(svgNS, "rect");
            if (
              (l.setAttribute("width", this.comp.data.w),
              l.setAttribute("height", this.comp.data.h),
              l.setAttribute("x", "0"),
              l.setAttribute("y", "0"),
              l.setAttribute("fill", "#ffffff"),
              l.setAttribute("opacity", "0"),
              a.setAttribute("filter", "url(#" + r + ")"),
              a.appendChild(l),
              a.appendChild(this.layerElement),
              (t = a),
              !featureSupport.maskType)
            ) {
              s.setAttribute("mask-type", "luminance"),
                i.appendChild(filtersFactory.createAlphaToLuminanceFilter());
              var n = document.createElementNS(svgNS, "g");
              a.appendChild(l),
                n.appendChild(this.layerElement),
                (t = n),
                a.appendChild(n);
            }
            this.globalData.defs.appendChild(s);
          }
        } else
          (this.data.hasMask || this.data.tt) && this.data.tt
            ? ((this.matteElement = document.createElementNS(svgNS, "g")),
              this.matteElement.appendChild(this.layerElement),
              (t = this.matteElement),
              (this.baseElement = this.matteElement))
            : (this.baseElement = this.layerElement);
        if (
          ((!this.data.ln && !this.data.cl) ||
            (4 !== this.data.ty && 0 !== this.data.ty) ||
            (this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute("class", this.data.cl)),
          0 === this.data.ty)
        ) {
          var h = document.createElementNS(svgNS, "clipPath"),
            p = document.createElementNS(svgNS, "path");
          p.setAttribute(
            "d",
            "M0,0 L" +
              this.data.w +
              ",0 L" +
              this.data.w +
              "," +
              this.data.h +
              " L0," +
              this.data.h +
              "z"
          );
          var c = "cp_" + randomString(8);
          if (
            (h.setAttribute("id", c),
            h.appendChild(p),
            this.globalData.defs.appendChild(h),
            this.checkMasks())
          ) {
            var f = document.createElementNS(svgNS, "g");
            f.setAttribute("clip-path", "url(#" + c + ")"),
              f.appendChild(this.layerElement),
              (this.transformedElement = f),
              t
                ? t.appendChild(this.transformedElement)
                : (this.baseElement = this.transformedElement);
          } else this.layerElement.setAttribute("clip-path", "url(#" + c + ")");
        }
        0 !== this.data.bm && this.setBlendMode(),
          this.layerElement !== this.parentContainer &&
            (this.placeholder = null),
          this.data.ef && (this.effectsManager = new SVGEffects(this)),
          this.checkParenting();
      }),
      (SVGBaseElement.prototype.setBlendMode =
        BaseElement.prototype.setBlendMode),
      (SVGBaseElement.prototype.renderFrame = function (t) {
        if (3 === this.data.ty || this.data.hd || !this.isVisible) return !1;
        (this.lastNum = this.currentFrameNum),
          (this.finalTransform.opMdf =
            this.firstFrame || this.finalTransform.op.mdf),
          (this.finalTransform.matMdf =
            this.firstFrame || this.finalTransform.mProp.mdf),
          (this.finalTransform.opacity = this.finalTransform.op.v);
        var e,
          r = this.finalTransform.mat;
        if (this.hierarchy) {
          var i = 0,
            n = this.hierarchy.length;
          if (!this.finalTransform.matMdf)
            for (; n > i; ) {
              if (this.hierarchy[i].finalTransform.mProp.mdf) {
                this.finalTransform.matMdf = !0;
                break;
              }
              i += 1;
            }
          if (this.finalTransform.matMdf)
            for (
              e = this.finalTransform.mProp.v.props, r.cloneFromProps(e), i = 0;
              n > i;
              i += 1
            )
              (e = this.hierarchy[i].finalTransform.mProp.v.props),
                r.transform(
                  e[0],
                  e[1],
                  e[2],
                  e[3],
                  e[4],
                  e[5],
                  e[6],
                  e[7],
                  e[8],
                  e[9],
                  e[10],
                  e[11],
                  e[12],
                  e[13],
                  e[14],
                  e[15]
                );
        } else this.isVisible && (r = this.finalTransform.mProp.v);
        return (
          this.finalTransform.matMdf &&
            this.layerElement &&
            this.transformedElement.setAttribute("transform", r.to2dCSS()),
          this.finalTransform.opMdf &&
            this.layerElement &&
            this.transformedElement.setAttribute(
              "opacity",
              this.finalTransform.op.v
            ),
          this.data.hasMask && this.maskManager.renderFrame(r),
          this.effectsManager &&
            this.effectsManager.renderFrame(this.firstFrame),
          this.isVisible
        );
      }),
      (SVGBaseElement.prototype.destroy = function () {
        (this.layerElement = null),
          (this.parentContainer = null),
          this.matteElement && (this.matteElement = null),
          this.maskManager && this.maskManager.destroy();
      }),
      (SVGBaseElement.prototype.getBaseElement = function () {
        return this.baseElement;
      }),
      (SVGBaseElement.prototype.addMasks = function (t) {
        this.maskManager = new MaskElement(t, this, this.globalData);
      }),
      (SVGBaseElement.prototype.setMatte = function (t) {
        this.matteElement &&
          this.matteElement.setAttribute("mask", "url(#" + t + ")");
      }),
      (SVGBaseElement.prototype.setMatte = function (t) {
        this.matteElement &&
          this.matteElement.setAttribute("mask", "url(#" + t + ")");
      }),
      (SVGBaseElement.prototype.hide = function () {}),
      (ITextElement.prototype.init = function () {
        this._parent.init.call(this),
          (this.lettersChangedFlag = !1),
          (this.currentTextDocumentData = {});
        var t = this.data;
        this.viewData = {
          m: {
            a: PropertyFactory.getProp(
              this,
              t.t.m.a,
              1,
              0,
              this.dynamicProperties
            ),
          },
        };
        var e = this.data.t;
        if (e.a.length) {
          this.viewData.a = Array.apply(null, { length: e.a.length });
          var r,
            i,
            n,
            s = e.a.length;
          for (r = 0; s > r; r += 1)
            (n = e.a[r]),
              (i = { a: {}, s: {} }),
              "r" in n.a &&
                (i.a.r = PropertyFactory.getProp(
                  this,
                  n.a.r,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
              "rx" in n.a &&
                (i.a.rx = PropertyFactory.getProp(
                  this,
                  n.a.rx,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
              "ry" in n.a &&
                (i.a.ry = PropertyFactory.getProp(
                  this,
                  n.a.ry,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
              "sk" in n.a &&
                (i.a.sk = PropertyFactory.getProp(
                  this,
                  n.a.sk,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
              "sa" in n.a &&
                (i.a.sa = PropertyFactory.getProp(
                  this,
                  n.a.sa,
                  0,
                  degToRads,
                  this.dynamicProperties
                )),
              "s" in n.a &&
                (i.a.s = PropertyFactory.getProp(
                  this,
                  n.a.s,
                  1,
                  0.01,
                  this.dynamicProperties
                )),
              "a" in n.a &&
                (i.a.a = PropertyFactory.getProp(
                  this,
                  n.a.a,
                  1,
                  0,
                  this.dynamicProperties
                )),
              "o" in n.a &&
                (i.a.o = PropertyFactory.getProp(
                  this,
                  n.a.o,
                  0,
                  0.01,
                  this.dynamicProperties
                )),
              "p" in n.a &&
                (i.a.p = PropertyFactory.getProp(
                  this,
                  n.a.p,
                  1,
                  0,
                  this.dynamicProperties
                )),
              "sw" in n.a &&
                (i.a.sw = PropertyFactory.getProp(
                  this,
                  n.a.sw,
                  0,
                  0,
                  this.dynamicProperties
                )),
              "sc" in n.a &&
                (i.a.sc = PropertyFactory.getProp(
                  this,
                  n.a.sc,
                  1,
                  0,
                  this.dynamicProperties
                )),
              "fc" in n.a &&
                (i.a.fc = PropertyFactory.getProp(
                  this,
                  n.a.fc,
                  1,
                  0,
                  this.dynamicProperties
                )),
              "fh" in n.a &&
                (i.a.fh = PropertyFactory.getProp(
                  this,
                  n.a.fh,
                  0,
                  0,
                  this.dynamicProperties
                )),
              "fs" in n.a &&
                (i.a.fs = PropertyFactory.getProp(
                  this,
                  n.a.fs,
                  0,
                  0.01,
                  this.dynamicProperties
                )),
              "fb" in n.a &&
                (i.a.fb = PropertyFactory.getProp(
                  this,
                  n.a.fb,
                  0,
                  0.01,
                  this.dynamicProperties
                )),
              "t" in n.a &&
                (i.a.t = PropertyFactory.getProp(
                  this,
                  n.a.t,
                  0,
                  0,
                  this.dynamicProperties
                )),
              (i.s = PropertyFactory.getTextSelectorProp(
                this,
                n.s,
                this.dynamicProperties
              )),
              (i.s.t = n.s.t),
              (this.viewData.a[r] = i);
        } else this.viewData.a = [];
        e.p && "m" in e.p
          ? ((this.viewData.p = {
              f: PropertyFactory.getProp(
                this,
                e.p.f,
                0,
                0,
                this.dynamicProperties
              ),
              l: PropertyFactory.getProp(
                this,
                e.p.l,
                0,
                0,
                this.dynamicProperties
              ),
              r: e.p.r,
              m: this.maskManager.getMaskProperty(e.p.m),
            }),
            (this.maskPath = !0))
          : (this.maskPath = !1);
      }),
      (ITextElement.prototype.prepareFrame = function (t) {
        var e = 0,
          r = this.data.t.d.k.length,
          i = this.data.t.d.k[e].s;
        for (e += 1; r > e && !(this.data.t.d.k[e].t > t); )
          (i = this.data.t.d.k[e].s), (e += 1);
        (this.lettersChangedFlag = !1),
          i !== this.currentTextDocumentData &&
            ((this.currentTextDocumentData = i),
            (this.lettersChangedFlag = !0),
            this.buildNewText()),
          this._parent.prepareFrame.call(this, t);
      }),
      (ITextElement.prototype.createPathShape = function (t, e) {
        var r,
          i,
          n,
          s,
          a = e.length,
          o = "";
        for (r = 0; a > r; r += 1) {
          for (n = e[r].ks.k.i.length, s = e[r].ks.k, i = 1; n > i; i += 1)
            1 == i &&
              (o += " M" + t.applyToPointStringified(s.v[0][0], s.v[0][1])),
              (o +=
                " C" +
                t.applyToPointStringified(s.o[i - 1][0], s.o[i - 1][1]) +
                " " +
                t.applyToPointStringified(s.i[i][0], s.i[i][1]) +
                " " +
                t.applyToPointStringified(s.v[i][0], s.v[i][1]));
          (o +=
            " C" +
            t.applyToPointStringified(s.o[i - 1][0], s.o[i - 1][1]) +
            " " +
            t.applyToPointStringified(s.i[0][0], s.i[0][1]) +
            " " +
            t.applyToPointStringified(s.v[0][0], s.v[0][1])),
            (o += "z");
        }
        return o;
      }),
      (ITextElement.prototype.getMeasures = function () {
        var t,
          e,
          r,
          i,
          n = this.mHelper,
          s = this.renderType,
          a = this.data,
          o = this.currentTextDocumentData,
          l = o.l;
        if (this.maskPath) {
          var h = this.viewData.p.m;
          if (!this.viewData.p.n || this.viewData.p.mdf) {
            var p = h.v;
            this.viewData.p.r && (p = reversePath(p));
            var c = { tLength: 0, segments: [] };
            i = p.v.length - 1;
            var f,
              u = 0;
            for (r = 0; i > r; r += 1)
              (f = {
                s: p.v[r],
                e: p.v[r + 1],
                to: [p.o[r][0] - p.v[r][0], p.o[r][1] - p.v[r][1]],
                ti: [
                  p.i[r + 1][0] - p.v[r + 1][0],
                  p.i[r + 1][1] - p.v[r + 1][1],
                ],
              }),
                bez.buildBezierData(f),
                (c.tLength += f.bezierData.segmentLength),
                c.segments.push(f),
                (u += f.bezierData.segmentLength);
            (r = i),
              h.v.c &&
                ((f = {
                  s: p.v[r],
                  e: p.v[0],
                  to: [p.o[r][0] - p.v[r][0], p.o[r][1] - p.v[r][1]],
                  ti: [p.i[0][0] - p.v[0][0], p.i[0][1] - p.v[0][1]],
                }),
                bez.buildBezierData(f),
                (c.tLength += f.bezierData.segmentLength),
                c.segments.push(f),
                (u += f.bezierData.segmentLength)),
              (this.viewData.p.pi = c);
          }
          var d,
            m,
            y,
            c = this.viewData.p.pi,
            g = this.viewData.p.f.v,
            v = 0,
            b = 1,
            x = 0,
            E = !0,
            w = c.segments;
          if (0 > g && h.v.c)
            for (
              c.tLength < Math.abs(g) && (g = -Math.abs(g) % c.tLength),
                v = w.length - 1,
                y = w[v].bezierData.points,
                b = y.length - 1;
              0 > g;

            )
              (g += y[b].partialLength),
                (b -= 1),
                0 > b &&
                  ((v -= 1), (y = w[v].bezierData.points), (b = y.length - 1));
          (y = w[v].bezierData.points), (m = y[b - 1]), (d = y[b]);
          var P,
            S,
            C = d.partialLength;
        }
        (i = l.length), (t = 0), (e = 0);
        var k,
          T,
          A,
          M,
          D,
          F = 1.2 * o.s * 0.714,
          I = !0,
          _ = this.viewData,
          N = Array.apply(null, { length: i });
        M = _.a.length;
        var B,
          L,
          R,
          V,
          j,
          H,
          O,
          z,
          G,
          q,
          W,
          $,
          X,
          Y,
          U,
          K,
          J = -1,
          Q = g,
          Z = v,
          tt = b,
          et = -1,
          rt = 0;
        for (r = 0; i > r; r += 1)
          if ((n.reset(), (H = 1), l[r].n))
            (t = 0),
              (e += o.yOffset),
              (e += I ? 1 : 0),
              (g = Q),
              (I = !1),
              (rt = 0),
              this.maskPath &&
                ((v = Z),
                (b = tt),
                (y = w[v].bezierData.points),
                (m = y[b - 1]),
                (d = y[b]),
                (C = d.partialLength),
                (x = 0)),
              (N[r] = this.emptyProp);
          else {
            if (this.maskPath) {
              if (et !== l[r].line) {
                switch (o.j) {
                  case 1:
                    g += u - o.lineWidths[l[r].line];
                    break;
                  case 2:
                    g += (u - o.lineWidths[l[r].line]) / 2;
                }
                et = l[r].line;
              }
              J !== l[r].ind &&
                (l[J] && (g += l[J].extra), (g += l[r].an / 2), (J = l[r].ind)),
                (g += (_.m.a.v[0] * l[r].an) / 200);
              var it = 0;
              for (A = 0; M > A; A += 1)
                (k = _.a[A].a),
                  "p" in k &&
                    ((T = _.a[A].s),
                    (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                    (it += L.length ? k.p.v[0] * L[0] : k.p.v[0] * L)),
                  "a" in k &&
                    ((T = _.a[A].s),
                    (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                    (it += L.length ? k.a.v[0] * L[0] : k.a.v[0] * L));
              for (E = !0; E; )
                x + C >= g + it || !y
                  ? ((P = (g + it - x) / d.partialLength),
                    (V = m.point[0] + (d.point[0] - m.point[0]) * P),
                    (j = m.point[1] + (d.point[1] - m.point[1]) * P),
                    n.translate(
                      (-_.m.a.v[0] * l[r].an) / 200,
                      -((_.m.a.v[1] * F) / 100)
                    ),
                    (E = !1))
                  : y &&
                    ((x += d.partialLength),
                    (b += 1),
                    b >= y.length &&
                      ((b = 0),
                      (v += 1),
                      w[v]
                        ? (y = w[v].bezierData.points)
                        : h.v.c
                        ? ((b = 0), (v = 0), (y = w[v].bezierData.points))
                        : ((x -= d.partialLength), (y = null))),
                    y && ((m = d), (d = y[b]), (C = d.partialLength)));
              (R = l[r].an / 2 - l[r].add), n.translate(-R, 0, 0);
            } else
              (R = l[r].an / 2 - l[r].add),
                n.translate(-R, 0, 0),
                n.translate(
                  (-_.m.a.v[0] * l[r].an) / 200,
                  (-_.m.a.v[1] * F) / 100,
                  0
                );
            for (rt += l[r].l / 2, A = 0; M > A; A += 1)
              (k = _.a[A].a),
                "t" in k &&
                  ((T = _.a[A].s),
                  (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                  this.maskPath
                    ? (g += L.length ? k.t * L[0] : k.t * L)
                    : (t += L.length ? k.t.v * L[0] : k.t.v * L));
            for (
              rt += l[r].l / 2,
                o.strokeWidthAnim && (z = o.sw || 0),
                o.strokeColorAnim &&
                  (O = o.sc ? [o.sc[0], o.sc[1], o.sc[2]] : [0, 0, 0]),
                o.fillColorAnim && (G = [o.fc[0], o.fc[1], o.fc[2]]),
                A = 0;
              M > A;
              A += 1
            )
              (k = _.a[A].a),
                "a" in k &&
                  ((T = _.a[A].s),
                  (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                  L.length
                    ? n.translate(
                        -k.a.v[0] * L[0],
                        -k.a.v[1] * L[1],
                        k.a.v[2] * L[2]
                      )
                    : n.translate(-k.a.v[0] * L, -k.a.v[1] * L, k.a.v[2] * L));
            for (A = 0; M > A; A += 1)
              (k = _.a[A].a),
                "s" in k &&
                  ((T = _.a[A].s),
                  (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                  L.length
                    ? n.scale(
                        1 + (k.s.v[0] - 1) * L[0],
                        1 + (k.s.v[1] - 1) * L[1],
                        1
                      )
                    : n.scale(
                        1 + (k.s.v[0] - 1) * L,
                        1 + (k.s.v[1] - 1) * L,
                        1
                      ));
            for (A = 0; M > A; A += 1) {
              if (
                ((k = _.a[A].a),
                (T = _.a[A].s),
                (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                "sk" in k &&
                  (L.length
                    ? n.skewFromAxis(-k.sk.v * L[0], k.sa.v * L[1])
                    : n.skewFromAxis(-k.sk.v * L, k.sa.v * L)),
                "r" in k && n.rotateZ(L.length ? -k.r.v * L[2] : -k.r.v * L),
                "ry" in k && n.rotateY(L.length ? k.ry.v * L[1] : k.ry.v * L),
                "rx" in k && n.rotateX(L.length ? k.rx.v * L[0] : k.rx.v * L),
                "o" in k &&
                  (H += L.length
                    ? (k.o.v * L[0] - H) * L[0]
                    : (k.o.v * L - H) * L),
                o.strokeWidthAnim &&
                  "sw" in k &&
                  (z += L.length ? k.sw.v * L[0] : k.sw.v * L),
                o.strokeColorAnim && "sc" in k)
              )
                for (q = 0; 3 > q; q += 1)
                  O[q] = Math.round(
                    L.length
                      ? 255 * (O[q] + (k.sc.v[q] - O[q]) * L[0])
                      : 255 * (O[q] + (k.sc.v[q] - O[q]) * L)
                  );
              if (o.fillColorAnim) {
                if ("fc" in k)
                  for (q = 0; 3 > q; q += 1)
                    G[q] = L.length
                      ? G[q] + (k.fc.v[q] - G[q]) * L[0]
                      : G[q] + (k.fc.v[q] - G[q]) * L;
                "fh" in k &&
                  (G = L.length
                    ? addHueToRGB(G, k.fh.v * L[0])
                    : addHueToRGB(G, k.fh.v * L)),
                  "fs" in k &&
                    (G = L.length
                      ? addSaturationToRGB(G, k.fs.v * L[0])
                      : addSaturationToRGB(G, k.fs.v * L)),
                  "fb" in k &&
                    (G = L.length
                      ? addBrightnessToRGB(G, k.fb.v * L[0])
                      : addBrightnessToRGB(G, k.fb.v * L));
              }
            }
            for (A = 0; M > A; A += 1)
              (k = _.a[A].a),
                "p" in k &&
                  ((T = _.a[A].s),
                  (L = T.getMult(l[r].anIndexes[A], a.t.a[A].s.totalChars)),
                  this.maskPath
                    ? L.length
                      ? n.translate(0, k.p.v[1] * L[0], -k.p.v[2] * L[1])
                      : n.translate(0, k.p.v[1] * L, -k.p.v[2] * L)
                    : L.length
                    ? n.translate(
                        k.p.v[0] * L[0],
                        k.p.v[1] * L[1],
                        -k.p.v[2] * L[2]
                      )
                    : n.translate(k.p.v[0] * L, k.p.v[1] * L, -k.p.v[2] * L));
            if (
              (o.strokeWidthAnim && (W = 0 > z ? 0 : z),
              o.strokeColorAnim &&
                ($ =
                  "rgb(" +
                  Math.round(255 * O[0]) +
                  "," +
                  Math.round(255 * O[1]) +
                  "," +
                  Math.round(255 * O[2]) +
                  ")"),
              o.fillColorAnim &&
                (X =
                  "rgb(" +
                  Math.round(255 * G[0]) +
                  "," +
                  Math.round(255 * G[1]) +
                  "," +
                  Math.round(255 * G[2]) +
                  ")"),
              this.maskPath)
            ) {
              if (
                (n.translate(0, -o.ls),
                n.translate(0, (_.m.a.v[1] * F) / 100 + e, 0),
                a.t.p.p)
              ) {
                S = (d.point[1] - m.point[1]) / (d.point[0] - m.point[0]);
                var nt = (180 * Math.atan(S)) / Math.PI;
                d.point[0] < m.point[0] && (nt += 180),
                  n.rotate((-nt * Math.PI) / 180);
              }
              n.translate(V, j, 0),
                (g -= (_.m.a.v[0] * l[r].an) / 200),
                l[r + 1] &&
                  J !== l[r + 1].ind &&
                  ((g += l[r].an / 2), (g += (o.tr / 1e3) * o.s));
            } else {
              switch (
                (n.translate(t, e, 0),
                o.ps && n.translate(o.ps[0], o.ps[1] + o.ascent, 0),
                o.j)
              ) {
                case 1:
                  n.translate(
                    o.justifyOffset + (o.boxWidth - o.lineWidths[l[r].line]),
                    0,
                    0
                  );
                  break;
                case 2:
                  n.translate(
                    o.justifyOffset +
                      (o.boxWidth - o.lineWidths[l[r].line]) / 2,
                    0,
                    0
                  );
              }
              n.translate(0, -o.ls),
                n.translate(R, 0, 0),
                n.translate(
                  (_.m.a.v[0] * l[r].an) / 200,
                  (_.m.a.v[1] * F) / 100,
                  0
                ),
                (t += l[r].l + (o.tr / 1e3) * o.s);
            }
            "html" === s
              ? (Y = n.toCSS())
              : "svg" === s
              ? (Y = n.to2dCSS())
              : (U = [
                  n.props[0],
                  n.props[1],
                  n.props[2],
                  n.props[3],
                  n.props[4],
                  n.props[5],
                  n.props[6],
                  n.props[7],
                  n.props[8],
                  n.props[9],
                  n.props[10],
                  n.props[11],
                  n.props[12],
                  n.props[13],
                  n.props[14],
                  n.props[15],
                ]),
              (K = H),
              (B = this.renderedLetters[r]),
              !B || (B.o === K && B.sw === W && B.sc === $ && B.fc === X)
                ? ("svg" !== s && "html" !== s) || (B && B.m === Y)
                  ? "canvas" !== s ||
                    (B &&
                      B.props[0] === U[0] &&
                      B.props[1] === U[1] &&
                      B.props[4] === U[4] &&
                      B.props[5] === U[5] &&
                      B.props[12] === U[12] &&
                      B.props[13] === U[13])
                    ? (D = B)
                    : ((this.lettersChangedFlag = !0),
                      (D = new LetterProps(K, W, $, X, null, U)))
                  : ((this.lettersChangedFlag = !0),
                    (D = new LetterProps(K, W, $, X, Y)))
                : ((this.lettersChangedFlag = !0),
                  (D = new LetterProps(K, W, $, X, Y, U))),
              (this.renderedLetters[r] = D);
          }
      }),
      (ITextElement.prototype.emptyProp = new LetterProps()),
      createElement(SVGBaseElement, SVGTextElement),
      (SVGTextElement.prototype.init = ITextElement.prototype.init),
      (SVGTextElement.prototype.createPathShape =
        ITextElement.prototype.createPathShape),
      (SVGTextElement.prototype.getMeasures =
        ITextElement.prototype.getMeasures),
      (SVGTextElement.prototype.prepareFrame =
        ITextElement.prototype.prepareFrame),
      (SVGTextElement.prototype.createElements = function () {
        this._parent.createElements.call(this),
          this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
          this.data.cl && this.layerElement.setAttribute("class", this.data.cl);
      }),
      (SVGTextElement.prototype.buildNewText = function () {
        var t,
          e,
          r = this.currentTextDocumentData;
        (this.renderedLetters = Array.apply(null, {
          length: this.currentTextDocumentData.l
            ? this.currentTextDocumentData.l.length
            : 0,
        })),
          r.fc
            ? this.layerElement.setAttribute(
                "fill",
                "rgb(" +
                  Math.round(255 * r.fc[0]) +
                  "," +
                  Math.round(255 * r.fc[1]) +
                  "," +
                  Math.round(255 * r.fc[2]) +
                  ")"
              )
            : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"),
          r.sc &&
            (this.layerElement.setAttribute(
              "stroke",
              "rgb(" +
                Math.round(255 * r.sc[0]) +
                "," +
                Math.round(255 * r.sc[1]) +
                "," +
                Math.round(255 * r.sc[2]) +
                ")"
            ),
            this.layerElement.setAttribute("stroke-width", r.sw)),
          this.layerElement.setAttribute("font-size", r.s);
        var i = this.globalData.fontManager.getFontByName(r.f);
        if (i.fClass) this.layerElement.setAttribute("class", i.fClass);
        else {
          this.layerElement.setAttribute("font-family", i.fFamily);
          var n = r.fWeight,
            s = r.fStyle;
          this.layerElement.setAttribute("font-style", s),
            this.layerElement.setAttribute("font-weight", n);
        }
        var a = r.l || [];
        if ((e = a.length)) {
          var o,
            l,
            h = this.mHelper,
            p = "",
            c = this.data.singleShape;
          if (c)
            var f = 0,
              u = 0,
              d = r.lineWidths,
              m = r.boxWidth,
              y = !0;
          var g = 0;
          for (t = 0; e > t; t += 1) {
            if (
              (this.globalData.fontManager.chars
                ? (c && 0 !== t) ||
                  (o = this.textSpans[g]
                    ? this.textSpans[g]
                    : document.createElementNS(svgNS, "path"))
                : (o = this.textSpans[g]
                    ? this.textSpans[g]
                    : document.createElementNS(svgNS, "text")),
              (o.style.display = "inherit"),
              o.setAttribute("stroke-linecap", "butt"),
              o.setAttribute("stroke-linejoin", "round"),
              o.setAttribute("stroke-miterlimit", "4"),
              c &&
                a[t].n &&
                ((f = 0), (u += r.yOffset), (u += y ? 1 : 0), (y = !1)),
              h.reset(),
              this.globalData.fontManager.chars &&
                h.scale(r.s / 100, r.s / 100),
              c)
            ) {
              switch (
                (r.ps && h.translate(r.ps[0], r.ps[1] + r.ascent, 0),
                h.translate(0, -r.ls, 0),
                r.j)
              ) {
                case 1:
                  h.translate(r.justifyOffset + (m - d[a[t].line]), 0, 0);
                  break;
                case 2:
                  h.translate(r.justifyOffset + (m - d[a[t].line]) / 2, 0, 0);
              }
              h.translate(f, u, 0);
            }
            if (this.globalData.fontManager.chars) {
              var v,
                b = this.globalData.fontManager.getCharData(
                  r.t.charAt(t),
                  i.fStyle,
                  this.globalData.fontManager.getFontByName(r.f).fFamily
                );
              (v = b ? b.data : null),
                v &&
                  v.shapes &&
                  ((l = v.shapes[0].it),
                  c || (p = ""),
                  (p += this.createPathShape(h, l)),
                  c || o.setAttribute("d", p)),
                c || this.layerElement.appendChild(o);
            } else
              (o.textContent = a[t].val),
                o.setAttributeNS(
                  "http://www.w3.org/XML/1998/namespace",
                  "xml:space",
                  "preserve"
                ),
                this.layerElement.appendChild(o),
                c && o.setAttribute("transform", h.to2dCSS());
            c && ((f += a[t].l), (f += (r.tr / 1e3) * r.s)),
              (this.textSpans[g] = o),
              (g += 1);
          }
          if (!c)
            for (; g < this.textSpans.length; )
              (this.textSpans[g].style.display = "none"), (g += 1);
          c &&
            this.globalData.fontManager.chars &&
            (o.setAttribute("d", p), this.layerElement.appendChild(o));
        }
      }),
      (SVGTextElement.prototype.hide = function () {
        this.hidden ||
          ((this.layerElement.style.display = "none"), (this.hidden = !0));
      }),
      (SVGTextElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        if (e === !1) return void this.hide();
        if (
          (this.hidden &&
            ((this.hidden = !1), (this.layerElement.style.display = "block")),
          !this.data.singleShape &&
            (this.getMeasures(), this.lettersChangedFlag))
        ) {
          var r,
            i,
            n = this.renderedLetters,
            s = this.currentTextDocumentData.l;
          i = s.length;
          var a;
          for (r = 0; i > r; r += 1)
            s[r].n ||
              ((a = n[r]),
              this.textSpans[r].setAttribute("transform", a.m),
              this.textSpans[r].setAttribute("opacity", a.o),
              a.sw && this.textSpans[r].setAttribute("stroke-width", a.sw),
              a.sc && this.textSpans[r].setAttribute("stroke", a.sc),
              a.fc && this.textSpans[r].setAttribute("fill", a.fc));
          this.firstFrame && (this.firstFrame = !1);
        }
      }),
      (SVGTextElement.prototype.destroy = function () {
        this._parent.destroy.call(this._parent);
      }),
      (SVGTintFilter.prototype.renderFrame = function (t) {
        if (t || this.filterManager.mdf) {
          var e = this.filterManager.effectElements[0].p.v,
            r = this.filterManager.effectElements[1].p.v,
            i = this.filterManager.effectElements[2].p.v / 100;
          this.matrixFilter.setAttribute(
            "values",
            r[0] -
              e[0] +
              " 0 0 0 " +
              e[0] +
              " " +
              (r[1] - e[1]) +
              " 0 0 0 " +
              e[1] +
              " " +
              (r[2] - e[2]) +
              " 0 0 0 " +
              e[2] +
              " 0 0 0 " +
              i +
              " 0"
          );
        }
      }),
      (SVGFillFilter.prototype.renderFrame = function (t) {
        if (t || this.filterManager.mdf) {
          var e = this.filterManager.effectElements[2].p.v,
            r = this.filterManager.effectElements[6].p.v;
          this.matrixFilter.setAttribute(
            "values",
            "0 0 0 0 " +
              e[0] +
              " 0 0 0 0 " +
              e[1] +
              " 0 0 0 0 " +
              e[2] +
              " 0 0 0 " +
              r +
              " 0"
          );
        }
      }),
      (SVGStrokeEffect.prototype.initialize = function () {
        var t,
          e,
          r,
          i,
          n =
            this.elem.layerElement.children ||
            this.elem.layerElement.childNodes;
        for (
          1 === this.filterManager.effectElements[1].p.v
            ? ((i = this.elem.maskManager.masksProperties.length), (r = 0))
            : ((r = this.filterManager.effectElements[0].p.v - 1), (i = r + 1)),
            e = document.createElementNS(svgNS, "g"),
            e.setAttribute("fill", "none"),
            e.setAttribute("stroke-linecap", "round"),
            e.setAttribute("stroke-dashoffset", 1),
            r;
          i > r;
          r += 1
        )
          (t = document.createElementNS(svgNS, "path")),
            e.appendChild(t),
            this.paths.push({ p: t, m: r });
        if (3 === this.filterManager.effectElements[10].p.v) {
          var s = document.createElementNS(svgNS, "mask"),
            a = "stms_" + randomString(10);
          s.setAttribute("id", a),
            s.setAttribute("mask-type", "alpha"),
            s.appendChild(e),
            this.elem.globalData.defs.appendChild(s);
          var o = document.createElementNS(svgNS, "g");
          o.setAttribute("mask", "url(#" + a + ")"),
            n[0] && o.appendChild(n[0]),
            this.elem.layerElement.appendChild(o),
            (this.masker = s),
            e.setAttribute("stroke", "#fff");
        } else if (
          1 === this.filterManager.effectElements[10].p.v ||
          2 === this.filterManager.effectElements[10].p.v
        ) {
          if (2 === this.filterManager.effectElements[10].p.v)
            for (
              var n =
                this.elem.layerElement.children ||
                this.elem.layerElement.childNodes;
              n.length;

            )
              this.elem.layerElement.removeChild(n[0]);
          this.elem.layerElement.appendChild(e),
            this.elem.layerElement.removeAttribute("mask"),
            e.setAttribute("stroke", "#fff");
        }
        (this.initialized = !0), (this.pathMasker = e);
      }),
      (SVGStrokeEffect.prototype.renderFrame = function (t) {
        this.initialized || this.initialize();
        var e,
          r,
          i,
          n = this.paths.length;
        for (e = 0; n > e; e += 1)
          if (
            ((r = this.elem.maskManager.viewData[this.paths[e].m]),
            (i = this.paths[e].p),
            (t || this.filterManager.mdf || r.prop.mdf) &&
              i.setAttribute("d", r.lastPath),
            t ||
              this.filterManager.effectElements[9].p.mdf ||
              this.filterManager.effectElements[4].p.mdf ||
              this.filterManager.effectElements[7].p.mdf ||
              this.filterManager.effectElements[8].p.mdf ||
              r.prop.mdf)
          ) {
            var s;
            if (
              0 !== this.filterManager.effectElements[7].p.v ||
              100 !== this.filterManager.effectElements[8].p.v
            ) {
              var a =
                  Math.min(
                    this.filterManager.effectElements[7].p.v,
                    this.filterManager.effectElements[8].p.v
                  ) / 100,
                o =
                  Math.max(
                    this.filterManager.effectElements[7].p.v,
                    this.filterManager.effectElements[8].p.v
                  ) / 100,
                l = i.getTotalLength();
              s = "0 0 0 " + l * a + " ";
              var h,
                p = l * (o - a),
                c =
                  1 +
                  (2 *
                    this.filterManager.effectElements[4].p.v *
                    this.filterManager.effectElements[9].p.v) /
                    100,
                f = Math.floor(p / c);
              for (h = 0; f > h; h += 1)
                s +=
                  "1 " +
                  (2 *
                    this.filterManager.effectElements[4].p.v *
                    this.filterManager.effectElements[9].p.v) /
                    100 +
                  " ";
              s += "0 " + 10 * l + " 0 0";
            } else
              s =
                "1 " +
                (2 *
                  this.filterManager.effectElements[4].p.v *
                  this.filterManager.effectElements[9].p.v) /
                  100;
            i.setAttribute("stroke-dasharray", s);
          }
        if (
          ((t || this.filterManager.effectElements[4].p.mdf) &&
            this.pathMasker.setAttribute(
              "stroke-width",
              2 * this.filterManager.effectElements[4].p.v
            ),
          (t || this.filterManager.effectElements[6].p.mdf) &&
            this.pathMasker.setAttribute(
              "opacity",
              this.filterManager.effectElements[6].p.v
            ),
          (1 === this.filterManager.effectElements[10].p.v ||
            2 === this.filterManager.effectElements[10].p.v) &&
            (t || this.filterManager.effectElements[3].p.mdf))
        ) {
          var u = this.filterManager.effectElements[3].p.v;
          this.pathMasker.setAttribute(
            "stroke",
            "rgb(" +
              bm_floor(255 * u[0]) +
              "," +
              bm_floor(255 * u[1]) +
              "," +
              bm_floor(255 * u[2]) +
              ")"
          );
        }
      }),
      (SVGTritoneFilter.prototype.renderFrame = function (t) {
        if (t || this.filterManager.mdf) {
          var e = this.filterManager.effectElements[0].p.v,
            r = this.filterManager.effectElements[1].p.v,
            i = this.filterManager.effectElements[2].p.v,
            n = i[0] + " " + r[0] + " " + e[0],
            s = i[1] + " " + r[1] + " " + e[1],
            a = i[2] + " " + r[2] + " " + e[2];
          this.feFuncR.setAttribute("tableValues", n),
            this.feFuncG.setAttribute("tableValues", s),
            this.feFuncB.setAttribute("tableValues", a);
        }
      }),
      (SVGProLevelsFilter.prototype.createFeFunc = function (t, e) {
        var r = document.createElementNS(svgNS, t);
        return r.setAttribute("type", "table"), e.appendChild(r), r;
      }),
      (SVGProLevelsFilter.prototype.getTableValue = function (t, e, r, i, n) {
        for (
          var s,
            a,
            o = 0,
            l = 256,
            h = Math.min(t, e),
            p = Math.max(t, e),
            c = Array.call(null, { length: l }),
            f = 0,
            u = n - i,
            d = e - t;
          256 >= o;

        )
          (s = o / 256),
            (a =
              h >= s
                ? 0 > d
                  ? n
                  : i
                : s >= p
                ? 0 > d
                  ? i
                  : n
                : i + u * Math.pow((s - t) / d, 1 / r)),
            (c[f++] = a),
            (o += 256 / (l - 1));
        return c.join(" ");
      }),
      (SVGProLevelsFilter.prototype.renderFrame = function (t) {
        if (t || this.filterManager.mdf) {
          var e,
            r = this.filterManager.effectElements;
          this.feFuncRComposed &&
            (t ||
              r[2].p.mdf ||
              r[3].p.mdf ||
              r[4].p.mdf ||
              r[5].p.mdf ||
              r[6].p.mdf) &&
            ((e = this.getTableValue(
              r[2].p.v,
              r[3].p.v,
              r[4].p.v,
              r[5].p.v,
              r[6].p.v
            )),
            this.feFuncRComposed.setAttribute("tableValues", e),
            this.feFuncGComposed.setAttribute("tableValues", e),
            this.feFuncBComposed.setAttribute("tableValues", e)),
            this.feFuncR &&
              (t ||
                r[9].p.mdf ||
                r[10].p.mdf ||
                r[11].p.mdf ||
                r[12].p.mdf ||
                r[13].p.mdf) &&
              ((e = this.getTableValue(
                r[9].p.v,
                r[10].p.v,
                r[11].p.v,
                r[12].p.v,
                r[13].p.v
              )),
              this.feFuncR.setAttribute("tableValues", e)),
            this.feFuncG &&
              (t ||
                r[16].p.mdf ||
                r[17].p.mdf ||
                r[18].p.mdf ||
                r[19].p.mdf ||
                r[20].p.mdf) &&
              ((e = this.getTableValue(
                r[16].p.v,
                r[17].p.v,
                r[18].p.v,
                r[19].p.v,
                r[20].p.v
              )),
              this.feFuncG.setAttribute("tableValues", e)),
            this.feFuncB &&
              (t ||
                r[23].p.mdf ||
                r[24].p.mdf ||
                r[25].p.mdf ||
                r[26].p.mdf ||
                r[27].p.mdf) &&
              ((e = this.getTableValue(
                r[23].p.v,
                r[24].p.v,
                r[25].p.v,
                r[26].p.v,
                r[27].p.v
              )),
              this.feFuncB.setAttribute("tableValues", e)),
            this.feFuncA &&
              (t ||
                r[30].p.mdf ||
                r[31].p.mdf ||
                r[32].p.mdf ||
                r[33].p.mdf ||
                r[34].p.mdf) &&
              ((e = this.getTableValue(
                r[30].p.v,
                r[31].p.v,
                r[32].p.v,
                r[33].p.v,
                r[34].p.v
              )),
              this.feFuncA.setAttribute("tableValues", e));
        }
      }),
      (SVGDropShadowEffect.prototype.renderFrame = function (t) {
        if (t || this.filterManager.mdf) {
          if (
            ((t || this.filterManager.effectElements[4].p.mdf) &&
              this.feGaussianBlur.setAttribute(
                "stdDeviation",
                this.filterManager.effectElements[4].p.v / 4
              ),
            t || this.filterManager.effectElements[0].p.mdf)
          ) {
            var e = this.filterManager.effectElements[0].p.v;
            this.feFlood.setAttribute(
              "flood-color",
              rgbToHex(
                Math.round(255 * e[0]),
                Math.round(255 * e[1]),
                Math.round(255 * e[2])
              )
            );
          }
          if (
            ((t || this.filterManager.effectElements[1].p.mdf) &&
              this.feFlood.setAttribute(
                "flood-opacity",
                this.filterManager.effectElements[1].p.v / 255
              ),
            t ||
              this.filterManager.effectElements[2].p.mdf ||
              this.filterManager.effectElements[3].p.mdf)
          ) {
            var r = this.filterManager.effectElements[3].p.v,
              i = (this.filterManager.effectElements[2].p.v - 90) * degToRads,
              n = r * Math.cos(i),
              s = r * Math.sin(i);
            this.feOffset.setAttribute("dx", n),
              this.feOffset.setAttribute("dy", s);
          }
        }
      }),
      (SVGEffects.prototype.renderFrame = function (t) {
        var e,
          r = this.filters.length;
        for (e = 0; r > e; e += 1) this.filters[e].renderFrame(t);
      }),
      createElement(SVGBaseElement, ICompElement),
      (ICompElement.prototype.hide = function () {
        if (!this.hidden) {
          var t,
            e = this.elements.length;
          for (t = 0; e > t; t += 1)
            this.elements[t] && this.elements[t].hide();
          this.hidden = !0;
        }
      }),
      (ICompElement.prototype.prepareFrame = function (t) {
        if (
          (this._parent.prepareFrame.call(this, t),
          this.isVisible !== !1 || this.data.xt)
        ) {
          if (this.tm) {
            var e = this.tm.v;
            e === this.data.op && (e = this.data.op - 1),
              (this.renderedFrame = e);
          } else this.renderedFrame = t / this.data.sr;
          var r,
            i = this.elements.length;
          for (
            this.completeLayers || this.checkLayers(this.renderedFrame), r = 0;
            i > r;
            r += 1
          )
            (this.completeLayers || this.elements[r]) &&
              this.elements[r].prepareFrame(
                this.renderedFrame - this.layers[r].st
              );
        }
      }),
      (ICompElement.prototype.renderFrame = function (t) {
        var e,
          r = this._parent.renderFrame.call(this, t),
          i = this.layers.length;
        if (r === !1) return void this.hide();
        for (this.hidden = !1, e = 0; i > e; e += 1)
          (this.completeLayers || this.elements[e]) &&
            this.elements[e].renderFrame();
        this.firstFrame && (this.firstFrame = !1);
      }),
      (ICompElement.prototype.setElements = function (t) {
        this.elements = t;
      }),
      (ICompElement.prototype.getElements = function () {
        return this.elements;
      }),
      (ICompElement.prototype.destroy = function () {
        this._parent.destroy.call(this._parent);
        var t,
          e = this.layers.length;
        for (t = 0; e > t; t += 1)
          this.elements[t] && this.elements[t].destroy();
      }),
      (ICompElement.prototype.checkLayers = SVGRenderer.prototype.checkLayers),
      (ICompElement.prototype.buildItem = SVGRenderer.prototype.buildItem),
      (ICompElement.prototype.buildAllItems =
        SVGRenderer.prototype.buildAllItems),
      (ICompElement.prototype.buildElementParenting =
        SVGRenderer.prototype.buildElementParenting),
      (ICompElement.prototype.createItem = SVGRenderer.prototype.createItem),
      (ICompElement.prototype.createImage = SVGRenderer.prototype.createImage),
      (ICompElement.prototype.createComp = SVGRenderer.prototype.createComp),
      (ICompElement.prototype.createSolid = SVGRenderer.prototype.createSolid),
      (ICompElement.prototype.createShape = SVGRenderer.prototype.createShape),
      (ICompElement.prototype.createText = SVGRenderer.prototype.createText),
      (ICompElement.prototype.createBase = SVGRenderer.prototype.createBase),
      (ICompElement.prototype.appendElementInPos =
        SVGRenderer.prototype.appendElementInPos),
      (ICompElement.prototype.checkPendingElements =
        SVGRenderer.prototype.checkPendingElements),
      (ICompElement.prototype.addPendingElement =
        SVGRenderer.prototype.addPendingElement),
      createElement(SVGBaseElement, IImageElement),
      (IImageElement.prototype.createElements = function () {
        var t = this.globalData.getAssetsPath(this.assetData);
        this._parent.createElements.call(this),
          (this.innerElem = document.createElementNS(svgNS, "image")),
          this.innerElem.setAttribute("width", this.assetData.w + "px"),
          this.innerElem.setAttribute("height", this.assetData.h + "px"),
          this.innerElem.setAttribute("preserveAspectRatio", "xMidYMid slice"),
          this.innerElem.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            t
          ),
          (this.maskedElement = this.innerElem),
          this.layerElement.appendChild(this.innerElem),
          this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
          this.data.cl && this.layerElement.setAttribute("class", this.data.cl);
      }),
      (IImageElement.prototype.hide = function () {
        this.hidden ||
          ((this.layerElement.style.display = "none"), (this.hidden = !0));
      }),
      (IImageElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        return e === !1
          ? void this.hide()
          : (this.hidden &&
              ((this.hidden = !1), (this.layerElement.style.display = "block")),
            void (this.firstFrame && (this.firstFrame = !1)));
      }),
      (IImageElement.prototype.destroy = function () {
        this._parent.destroy.call(this._parent), (this.innerElem = null);
      }),
      createElement(SVGBaseElement, IShapeElement),
      (IShapeElement.prototype.lcEnum = { 1: "butt", 2: "round", 3: "butt" }),
      (IShapeElement.prototype.ljEnum = { 1: "miter", 2: "round", 3: "butt" }),
      (IShapeElement.prototype.buildExpressionInterface = function () {}),
      (IShapeElement.prototype.createElements = function () {
        this._parent.createElements.call(this),
          this.searchShapes(
            this.shapesData,
            this.viewData,
            this.layerElement,
            this.dynamicProperties,
            0
          ),
          (!this.data.hd || this.data.td) &&
            styleUnselectableDiv(this.layerElement);
      }),
      (IShapeElement.prototype.setGradientData = function (t, e, r) {
        var i,
          n = "gr_" + randomString(10);
        (i =
          1 === e.t
            ? document.createElementNS(svgNS, "linearGradient")
            : document.createElementNS(svgNS, "radialGradient")),
          i.setAttribute("id", n),
          i.setAttribute("spreadMethod", "pad"),
          i.setAttribute("gradientUnits", "userSpaceOnUse");
        var s,
          a,
          o,
          l = [];
        for (o = 4 * e.g.p, a = 0; o > a; a += 4)
          (s = document.createElementNS(svgNS, "stop")),
            i.appendChild(s),
            l.push(s);
        t.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(#" + n + ")"),
          this.globalData.defs.appendChild(i),
          (r.gf = i),
          (r.cst = l);
      }),
      (IShapeElement.prototype.setGradientOpacity = function (t, e, r) {
        if (
          (t.g.k.k[0].s && t.g.k.k[0].s.length > 4 * t.g.p) ||
          t.g.k.k.length > 4 * t.g.p
        ) {
          var i,
            n,
            s,
            a,
            o = document.createElementNS(svgNS, "mask"),
            l = document.createElementNS(svgNS, "path");
          o.appendChild(l);
          var h = "op_" + randomString(10),
            p = "mk_" + randomString(10);
          o.setAttribute("id", p),
            (i =
              1 === t.t
                ? document.createElementNS(svgNS, "linearGradient")
                : document.createElementNS(svgNS, "radialGradient")),
            i.setAttribute("id", h),
            i.setAttribute("spreadMethod", "pad"),
            i.setAttribute("gradientUnits", "userSpaceOnUse"),
            (a = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length);
          var c = [];
          for (s = 4 * t.g.p; a > s; s += 2)
            (n = document.createElementNS(svgNS, "stop")),
              n.setAttribute("stop-color", "rgb(255,255,255)"),
              i.appendChild(n),
              c.push(n);
          return (
            l.setAttribute(
              "gf" === t.ty ? "fill" : "stroke",
              "url(#" + h + ")"
            ),
            this.globalData.defs.appendChild(i),
            this.globalData.defs.appendChild(o),
            (e.of = i),
            (e.ost = c),
            (r.msElem = l),
            p
          );
        }
      }),
      (IShapeElement.prototype.searchShapes = function (t, e, r, i, n, s) {
        s = s || [];
        var a,
          o,
          l,
          h,
          p,
          c = [].concat(s),
          f = t.length - 1,
          u = [],
          d = [];
        for (a = f; a >= 0; a -= 1)
          if (
            "fl" == t[a].ty ||
            "st" == t[a].ty ||
            "gf" == t[a].ty ||
            "gs" == t[a].ty
          ) {
            (e[a] = {}),
              (h = { type: t[a].ty, d: "", ld: "", lvl: n, mdf: !1 });
            var m = document.createElementNS(svgNS, "path");
            if (
              ((e[a].o = PropertyFactory.getProp(this, t[a].o, 0, 0.01, i)),
              ("st" == t[a].ty || "gs" == t[a].ty) &&
                (m.setAttribute(
                  "stroke-linecap",
                  this.lcEnum[t[a].lc] || "round"
                ),
                m.setAttribute(
                  "stroke-linejoin",
                  this.ljEnum[t[a].lj] || "round"
                ),
                m.setAttribute("fill-opacity", "0"),
                1 == t[a].lj && m.setAttribute("stroke-miterlimit", t[a].ml),
                (e[a].w = PropertyFactory.getProp(this, t[a].w, 0, null, i)),
                t[a].d))
            ) {
              var y = PropertyFactory.getDashProp(this, t[a].d, "svg", i);
              y.k ||
                (m.setAttribute("stroke-dasharray", y.dasharray),
                m.setAttribute("stroke-dashoffset", y.dashoffset)),
                (e[a].d = y);
            }
            if ("fl" == t[a].ty || "st" == t[a].ty)
              (e[a].c = PropertyFactory.getProp(this, t[a].c, 1, 255, i)),
                r.appendChild(m);
            else {
              (e[a].g = PropertyFactory.getGradientProp(this, t[a].g, i)),
                2 == t[a].t &&
                  ((e[a].h = PropertyFactory.getProp(this, t[a].h, 1, 0.01, i)),
                  (e[a].a = PropertyFactory.getProp(
                    this,
                    t[a].a,
                    1,
                    degToRads,
                    i
                  ))),
                (e[a].s = PropertyFactory.getProp(this, t[a].s, 1, null, i)),
                (e[a].e = PropertyFactory.getProp(this, t[a].e, 1, null, i)),
                this.setGradientData(m, t[a], e[a], h);
              var g = this.setGradientOpacity(t[a], e[a], h);
              g && m.setAttribute("mask", "url(#" + g + ")"),
                (e[a].elem = m),
                r.appendChild(m);
            }
            2 === t[a].r && m.setAttribute("fill-rule", "evenodd"),
              t[a].ln && m.setAttribute("id", t[a].ln),
              t[a].cl && m.setAttribute("class", t[a].cl),
              (h.pElem = m),
              this.stylesList.push(h),
              (e[a].style = h),
              u.push(h);
          } else if ("gr" == t[a].ty) {
            e[a] = { it: [] };
            var v = document.createElementNS(svgNS, "g");
            r.appendChild(v),
              (e[a].gr = v),
              this.searchShapes(t[a].it, e[a].it, v, i, n + 1, c);
          } else if ("tr" == t[a].ty)
            (e[a] = {
              transform: {
                op: PropertyFactory.getProp(this, t[a].o, 0, 0.01, i),
                mProps: PropertyFactory.getProp(this, t[a], 2, null, i),
              },
              elements: [],
            }),
              (p = e[a].transform),
              c.push(p);
          else if (
            "sh" == t[a].ty ||
            "rc" == t[a].ty ||
            "el" == t[a].ty ||
            "sr" == t[a].ty
          ) {
            e[a] = {
              elements: [],
              caches: [],
              styles: [],
              transformers: c,
              lStr: "",
            };
            var b = 4;
            for (
              "rc" == t[a].ty
                ? (b = 5)
                : "el" == t[a].ty
                ? (b = 6)
                : "sr" == t[a].ty && (b = 7),
                e[a].sh = ShapePropertyFactory.getShapeProp(this, t[a], b, i),
                e[a].lvl = n,
                this.shapes.push(e[a].sh),
                this.addShapeToModifiers(e[a]),
                l = this.stylesList.length,
                o = 0;
              l > o;
              o += 1
            )
              this.stylesList[o].closed ||
                e[a].elements.push({
                  ty: this.stylesList[o].type,
                  st: this.stylesList[o],
                });
          } else if (
            "tm" == t[a].ty ||
            "rd" == t[a].ty ||
            "ms" == t[a].ty ||
            "rp" == t[a].ty
          ) {
            var x = ShapeModifiers.getModifier(t[a].ty);
            x.init(this, t[a], i),
              this.shapeModifiers.push(x),
              d.push(x),
              (e[a] = x);
          }
        for (f = u.length, a = 0; f > a; a += 1) u[a].closed = !0;
        for (f = d.length, a = 0; f > a; a += 1) d[a].closed = !0;
      }),
      (IShapeElement.prototype.addShapeToModifiers = function (t) {
        var e,
          r = this.shapeModifiers.length;
        for (e = 0; r > e; e += 1) this.shapeModifiers[e].addShape(t);
      }),
      (IShapeElement.prototype.renderModifiers = function () {
        if (this.shapeModifiers.length) {
          var t,
            e = this.shapes.length;
          for (t = 0; e > t; t += 1) this.shapes[t].reset();
          for (e = this.shapeModifiers.length, t = e - 1; t >= 0; t -= 1)
            this.shapeModifiers[t].processShapes(this.firstFrame);
        }
      }),
      (IShapeElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        return e === !1
          ? void this.hide()
          : (this.globalToLocal([0, 0, 0]),
            this.hidden &&
              ((this.layerElement.style.display = "block"), (this.hidden = !1)),
            this.renderModifiers(),
            void this.renderShape(null, null, !0, null));
      }),
      (IShapeElement.prototype.hide = function () {
        if (!this.hidden) {
          this.layerElement.style.display = "none";
          var t,
            e = this.stylesList.length;
          for (t = e - 1; t >= 0; t -= 1)
            "0" !== this.stylesList[t].ld &&
              ((this.stylesList[t].ld = "0"),
              (this.stylesList[t].pElem.style.display = "none"),
              this.stylesList[t].pElem.parentNode &&
                (this.stylesList[t].parent =
                  this.stylesList[t].pElem.parentNode));
          this.hidden = !0;
        }
      }),
      (IShapeElement.prototype.renderShape = function (t, e, r, i) {
        var n, s;
        if (!t)
          for (
            t = this.shapesData, s = this.stylesList.length, n = 0;
            s > n;
            n += 1
          )
            (this.stylesList[n].d = ""), (this.stylesList[n].mdf = !1);
        e || (e = this.viewData), (s = t.length - 1);
        var a;
        for (n = s; n >= 0; n -= 1)
          (a = t[n].ty),
            "tr" == a
              ? ((this.firstFrame || (e[n].transform.op.mdf && i)) &&
                  i.setAttribute("opacity", e[n].transform.op.v),
                (this.firstFrame || (e[n].transform.mProps.mdf && i)) &&
                  i.setAttribute(
                    "transform",
                    e[n].transform.mProps.v.to2dCSS()
                  ))
              : "sh" == a || "el" == a || "rc" == a || "sr" == a
              ? this.renderPath(t[n], e[n])
              : "fl" == a
              ? this.renderFill(t[n], e[n])
              : "gf" == a
              ? this.renderGradient(t[n], e[n])
              : "gs" == a
              ? (this.renderGradient(t[n], e[n]), this.renderStroke(t[n], e[n]))
              : "st" == a
              ? this.renderStroke(t[n], e[n])
              : "gr" == a && this.renderShape(t[n].it, e[n].it, !1, e[n].gr);
        if (r) {
          for (s = this.stylesList.length, n = 0; s > n; n += 1)
            "0" === this.stylesList[n].ld &&
              ((this.stylesList[n].ld = "1"),
              (this.stylesList[n].pElem.style.display = "block")),
              (this.stylesList[n].mdf || this.firstFrame) &&
                (this.stylesList[n].pElem.setAttribute(
                  "d",
                  this.stylesList[n].d
                ),
                this.stylesList[n].msElem &&
                  this.stylesList[n].msElem.setAttribute(
                    "d",
                    this.stylesList[n].d
                  ));
          this.firstFrame && (this.firstFrame = !1);
        }
      }),
      (IShapeElement.prototype.renderPath = function (t, e) {
        var r,
          i,
          n,
          s,
          a,
          o,
          l,
          h,
          p = e.elements.length,
          c = e.lvl;
        for (h = 0; p > h; h += 1) {
          (o = e.sh.mdf || this.firstFrame), (a = "M0 0");
          var f = e.sh.paths;
          if (((s = f._length), e.elements[h].st.lvl < c)) {
            for (
              var u,
                d = this.mHelper.reset(),
                m = c - e.elements[h].st.lvl,
                y = e.transformers.length - 1;
              m > 0;

            )
              (o = e.transformers[y].mProps.mdf || o),
                (u = e.transformers[y].mProps.v.props),
                d.transform(
                  u[0],
                  u[1],
                  u[2],
                  u[3],
                  u[4],
                  u[5],
                  u[6],
                  u[7],
                  u[8],
                  u[9],
                  u[10],
                  u[11],
                  u[12],
                  u[13],
                  u[14],
                  u[15]
                ),
                m--,
                y--;
            if (o) {
              for (n = 0; s > n; n += 1)
                if (((l = f.shapes[n]), l && l._length)) {
                  for (r = l._length, i = 1; r > i; i += 1)
                    1 == i &&
                      (a +=
                        " M" + d.applyToPointStringified(l.v[0][0], l.v[0][1])),
                      (a +=
                        " C" +
                        d.applyToPointStringified(
                          l.o[i - 1][0],
                          l.o[i - 1][1]
                        ) +
                        " " +
                        d.applyToPointStringified(l.i[i][0], l.i[i][1]) +
                        " " +
                        d.applyToPointStringified(l.v[i][0], l.v[i][1]));
                  1 == r &&
                    (a +=
                      " M" + d.applyToPointStringified(l.v[0][0], l.v[0][1])),
                    l.c &&
                      ((a +=
                        " C" +
                        d.applyToPointStringified(
                          l.o[i - 1][0],
                          l.o[i - 1][1]
                        ) +
                        " " +
                        d.applyToPointStringified(l.i[0][0], l.i[0][1]) +
                        " " +
                        d.applyToPointStringified(l.v[0][0], l.v[0][1])),
                      (a += "z"));
                }
              e.caches[h] = a;
            } else a = e.caches[h];
          } else if (o) {
            for (n = 0; s > n; n += 1)
              if (((l = f.shapes[n]), l && l._length)) {
                for (r = l._length, i = 1; r > i; i += 1)
                  1 == i && (a += " M" + l.v[0].join(",")),
                    (a +=
                      " C" +
                      l.o[i - 1].join(",") +
                      " " +
                      l.i[i].join(",") +
                      " " +
                      l.v[i].join(","));
                1 == r && (a += " M" + l.v[0].join(",")),
                  l.c &&
                    r &&
                    ((a +=
                      " C" +
                      l.o[i - 1].join(",") +
                      " " +
                      l.i[0].join(",") +
                      " " +
                      l.v[0].join(",")),
                    (a += "z"));
              }
            e.caches[h] = a;
          } else a = e.caches[h];
          (e.elements[h].st.d += a),
            (e.elements[h].st.mdf = o || e.elements[h].st.mdf);
        }
      }),
      (IShapeElement.prototype.renderFill = function (t, e) {
        var r = e.style;
        (e.c.mdf || this.firstFrame) &&
          r.pElem.setAttribute(
            "fill",
            "rgb(" +
              bm_floor(e.c.v[0]) +
              "," +
              bm_floor(e.c.v[1]) +
              "," +
              bm_floor(e.c.v[2]) +
              ")"
          ),
          (e.o.mdf || this.firstFrame) &&
            r.pElem.setAttribute("fill-opacity", e.o.v);
      }),
      (IShapeElement.prototype.renderGradient = function (t, e) {
        var r = e.gf,
          i = e.of,
          n = e.s.v,
          s = e.e.v;
        if (e.o.mdf || this.firstFrame) {
          var a = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
          e.elem.setAttribute(a, e.o.v);
        }
        if (e.s.mdf || this.firstFrame) {
          var o = 1 === t.t ? "x1" : "cx",
            l = "x1" === o ? "y1" : "cy";
          r.setAttribute(o, n[0]),
            r.setAttribute(l, n[1]),
            i && (i.setAttribute(o, n[0]), i.setAttribute(l, n[1]));
        }
        var h, p, c, f;
        if (e.g.cmdf || this.firstFrame) {
          h = e.cst;
          var u = e.g.c;
          for (c = h.length, p = 0; c > p; p += 1)
            (f = h[p]),
              f.setAttribute("offset", u[4 * p] + "%"),
              f.setAttribute(
                "stop-color",
                "rgb(" +
                  u[4 * p + 1] +
                  "," +
                  u[4 * p + 2] +
                  "," +
                  u[4 * p + 3] +
                  ")"
              );
        }
        if (i && (e.g.omdf || this.firstFrame)) {
          h = e.ost;
          var d = e.g.o;
          for (c = h.length, p = 0; c > p; p += 1)
            (f = h[p]),
              f.setAttribute("offset", d[2 * p] + "%"),
              f.setAttribute("stop-opacity", d[2 * p + 1]);
        }
        if (1 === t.t)
          (e.e.mdf || this.firstFrame) &&
            (r.setAttribute("x2", s[0]),
            r.setAttribute("y2", s[1]),
            i && (i.setAttribute("x2", s[0]), i.setAttribute("y2", s[1])));
        else {
          var m;
          if (
            ((e.s.mdf || e.e.mdf || this.firstFrame) &&
              ((m = Math.sqrt(
                Math.pow(n[0] - s[0], 2) + Math.pow(n[1] - s[1], 2)
              )),
              r.setAttribute("r", m),
              i && i.setAttribute("r", m)),
            e.e.mdf || e.h.mdf || e.a.mdf || this.firstFrame)
          ) {
            m ||
              (m = Math.sqrt(
                Math.pow(n[0] - s[0], 2) + Math.pow(n[1] - s[1], 2)
              ));
            var y = Math.atan2(s[1] - n[1], s[0] - n[0]),
              g = e.h.v >= 1 ? 0.99 : e.h.v <= -1 ? -0.99 : e.h.v,
              v = m * g,
              b = Math.cos(y + e.a.v) * v + n[0],
              x = Math.sin(y + e.a.v) * v + n[1];
            r.setAttribute("fx", b),
              r.setAttribute("fy", x),
              i && (i.setAttribute("fx", b), i.setAttribute("fy", x));
          }
        }
      }),
      (IShapeElement.prototype.renderStroke = function (t, e) {
        var r = e.style,
          i = e.d;
        i &&
          i.k &&
          (i.mdf || this.firstFrame) &&
          (r.pElem.setAttribute("stroke-dasharray", i.dasharray),
          r.pElem.setAttribute("stroke-dashoffset", i.dashoffset)),
          e.c &&
            (e.c.mdf || this.firstFrame) &&
            r.pElem.setAttribute(
              "stroke",
              "rgb(" +
                bm_floor(e.c.v[0]) +
                "," +
                bm_floor(e.c.v[1]) +
                "," +
                bm_floor(e.c.v[2]) +
                ")"
            ),
          (e.o.mdf || this.firstFrame) &&
            r.pElem.setAttribute("stroke-opacity", e.o.v),
          (e.w.mdf || this.firstFrame) &&
            (r.pElem.setAttribute("stroke-width", e.w.v),
            r.msElem && r.msElem.setAttribute("stroke-width", e.w.v));
      }),
      (IShapeElement.prototype.destroy = function () {
        this._parent.destroy.call(this._parent),
          (this.shapeData = null),
          (this.viewData = null),
          (this.parentContainer = null),
          (this.placeholder = null);
      }),
      createElement(SVGBaseElement, ISolidElement),
      (ISolidElement.prototype.createElements = function () {
        this._parent.createElements.call(this);
        var t = document.createElementNS(svgNS, "rect");
        t.setAttribute("width", this.data.sw),
          t.setAttribute("height", this.data.sh),
          t.setAttribute("fill", this.data.sc),
          this.layerElement.appendChild(t),
          (this.innerElem = t),
          this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
          this.data.cl && this.layerElement.setAttribute("class", this.data.cl);
      }),
      (ISolidElement.prototype.hide = IImageElement.prototype.hide),
      (ISolidElement.prototype.renderFrame =
        IImageElement.prototype.renderFrame),
      (ISolidElement.prototype.destroy = IImageElement.prototype.destroy);
    var animationManager = (function () {
        function t(t) {
          for (var e = 0, r = t.target; S > e; )
            w[e].animation === r &&
              (w.splice(e, 1), (e -= 1), (S -= 1), r.isPaused || i()),
              (e += 1);
        }
        function e(t, e) {
          if (!t) return null;
          for (var r = 0; S > r; ) {
            if (w[r].elem == t && null !== w[r].elem) return w[r].animation;
            r += 1;
          }
          var i = new AnimationItem();
          return n(i, t), i.setData(t, e), i;
        }
        function r() {
          (k += 1), x();
        }
        function i() {
          (k -= 1), 0 === k && (C = !0);
        }
        function n(e, n) {
          e.addEventListener("destroy", t),
            e.addEventListener("_active", r),
            e.addEventListener("_idle", i),
            w.push({ elem: n, animation: e }),
            (S += 1);
        }
        function s(t) {
          var e = new AnimationItem();
          return n(e, null), e.setParams(t), e;
        }
        function a(t, e) {
          var r;
          for (r = 0; S > r; r += 1) w[r].animation.setSpeed(t, e);
        }
        function o(t, e) {
          var r;
          for (r = 0; S > r; r += 1) w[r].animation.setDirection(t, e);
        }
        function l(t) {
          var e;
          for (e = 0; S > e; e += 1) w[e].animation.play(t);
        }
        function h(t, e) {
          P = Date.now();
          var r;
          for (r = 0; S > r; r += 1) w[r].animation.moveFrame(t, e);
        }
        function p(t) {
          var e,
            r = t - P;
          for (e = 0; S > e; e += 1) w[e].animation.advanceTime(r);
          (P = t), C || requestAnimationFrame(p);
        }
        function c(t) {
          (P = t), requestAnimationFrame(p);
        }
        function f(t) {
          var e;
          for (e = 0; S > e; e += 1) w[e].animation.pause(t);
        }
        function u(t, e, r) {
          var i;
          for (i = 0; S > i; i += 1) w[i].animation.goToAndStop(t, e, r);
        }
        function d(t) {
          var e;
          for (e = 0; S > e; e += 1) w[e].animation.stop(t);
        }
        function m(t) {
          var e;
          for (e = 0; S > e; e += 1) w[e].animation.togglePause(t);
        }
        function y(t) {
          var e;
          for (e = S - 1; e >= 0; e -= 1) w[e].animation.destroy(t);
        }
        function g(t, r, i) {
          var n,
            s = document.getElementsByClassName("bodymovin"),
            a = s.length;
          for (n = 0; a > n; n += 1)
            i && s[n].setAttribute("data-bm-type", i), e(s[n], t);
          if (r && 0 === a) {
            i || (i = "svg");
            var o = document.getElementsByTagName("body")[0];
            o.innerHTML = "";
            var l = document.createElement("div");
            (l.style.width = "100%"),
              (l.style.height = "100%"),
              l.setAttribute("data-bm-type", i),
              o.appendChild(l),
              e(l, t);
          }
        }
        function v() {
          var t;
          for (t = 0; S > t; t += 1) w[t].animation.resize();
        }
        function b() {
          requestAnimationFrame(c);
        }
        function x() {
          C && ((C = !1), requestAnimationFrame(c));
        }
        var E = {},
          w = [],
          P = 0,
          S = 0,
          C = !0,
          k = 0;
        return (
          setTimeout(b, 0),
          (E.registerAnimation = e),
          (E.loadAnimation = s),
          (E.setSpeed = a),
          (E.setDirection = o),
          (E.play = l),
          (E.moveFrame = h),
          (E.pause = f),
          (E.stop = d),
          (E.togglePause = m),
          (E.searchAnimations = g),
          (E.resize = v),
          (E.start = b),
          (E.goToAndStop = u),
          (E.destroy = y),
          E
        );
      })(),
      AnimationItem = function () {
        (this._cbs = []),
          (this.name = ""),
          (this.path = ""),
          (this.isLoaded = !1),
          (this.currentFrame = 0),
          (this.currentRawFrame = 0),
          (this.totalFrames = 0),
          (this.frameRate = 0),
          (this.frameMult = 0),
          (this.playSpeed = 1),
          (this.playDirection = 1),
          (this.pendingElements = 0),
          (this.playCount = 0),
          (this.prerenderFramesFlag = !0),
          (this.animationData = {}),
          (this.layers = []),
          (this.assets = []),
          (this.isPaused = !0),
          (this.autoplay = !1),
          (this.loop = !0),
          (this.renderer = null),
          (this.animationID = randomString(10)),
          (this.scaleMode = "fit"),
          (this.assetsPath = ""),
          (this.timeCompleted = 0),
          (this.segmentPos = 0),
          (this.subframeEnabled = subframeEnabled),
          (this.segments = []),
          (this.pendingSegment = !1),
          (this._idle = !0),
          (this.projectInterface = ProjectInterface());
      };
    (AnimationItem.prototype.setParams = function (t) {
      var e = this;
      t.context && (this.context = t.context),
        (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
      var r = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
      switch (r) {
        case "canvas":
          this.renderer = new CanvasRenderer(this, t.rendererSettings);
          break;
        case "svg":
          this.renderer = new SVGRenderer(this, t.rendererSettings);
          break;
        case "hybrid":
        case "html":
        default:
          this.renderer = new HybridRenderer(this, t.rendererSettings);
      }
      if (
        (this.renderer.setProjectInterface(this.projectInterface),
        (this.animType = r),
        "" === t.loop ||
          null === t.loop ||
          (this.loop =
            t.loop === !1 ? !1 : t.loop === !0 ? !0 : parseInt(t.loop)),
        (this.autoplay = "autoplay" in t ? t.autoplay : !0),
        (this.name = t.name ? t.name : ""),
        (this.prerenderFramesFlag = "prerender" in t ? t.prerender : !0),
        (this.autoloadSegments = t.hasOwnProperty("autoloadSegments")
          ? t.autoloadSegments
          : !0),
        t.animationData)
      )
        e.configAnimation(t.animationData);
      else if (t.path) {
        "json" != t.path.substr(-4) &&
          ("/" != t.path.substr(-1, 1) && (t.path += "/"),
          (t.path += "data.json"));
        var i = new XMLHttpRequest();
        (this.path =
          -1 != t.path.lastIndexOf("\\")
            ? t.path.substr(0, t.path.lastIndexOf("\\") + 1)
            : t.path.substr(0, t.path.lastIndexOf("/") + 1)),
          (this.assetsPath = t.assetsPath),
          (this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1)),
          (this.fileName = this.fileName.substr(
            0,
            this.fileName.lastIndexOf(".json")
          )),
          i.open("GET", t.path, !0),
          i.send(),
          (i.onreadystatechange = function () {
            if (4 == i.readyState)
              if (200 == i.status)
                e.configAnimation(JSON.parse(i.responseText));
              else
                try {
                  var t = JSON.parse(i.responseText);
                  e.configAnimation(t);
                } catch (r) {}
          });
      }
    }),
      (AnimationItem.prototype.setData = function (t, e) {
        var r = {
            wrapper: t,
            animationData: e
              ? "object" == typeof e
                ? e
                : JSON.parse(e)
              : null,
          },
          i = t.attributes;
        (r.path = i.getNamedItem("data-animation-path")
          ? i.getNamedItem("data-animation-path").value
          : i.getNamedItem("data-bm-path")
          ? i.getNamedItem("data-bm-path").value
          : i.getNamedItem("bm-path")
          ? i.getNamedItem("bm-path").value
          : ""),
          (r.animType = i.getNamedItem("data-anim-type")
            ? i.getNamedItem("data-anim-type").value
            : i.getNamedItem("data-bm-type")
            ? i.getNamedItem("data-bm-type").value
            : i.getNamedItem("bm-type")
            ? i.getNamedItem("bm-type").value
            : i.getNamedItem("data-bm-renderer")
            ? i.getNamedItem("data-bm-renderer").value
            : i.getNamedItem("bm-renderer")
            ? i.getNamedItem("bm-renderer").value
            : "canvas");
        var n = i.getNamedItem("data-anim-loop")
          ? i.getNamedItem("data-anim-loop").value
          : i.getNamedItem("data-bm-loop")
          ? i.getNamedItem("data-bm-loop").value
          : i.getNamedItem("bm-loop")
          ? i.getNamedItem("bm-loop").value
          : "";
        "" === n ||
          (r.loop = "false" === n ? !1 : "true" === n ? !0 : parseInt(n));
        var s = i.getNamedItem("data-anim-autoplay")
          ? i.getNamedItem("data-anim-autoplay").value
          : i.getNamedItem("data-bm-autoplay")
          ? i.getNamedItem("data-bm-autoplay").value
          : i.getNamedItem("bm-autoplay")
          ? i.getNamedItem("bm-autoplay").value
          : !0;
        (r.autoplay = "false" !== s),
          (r.name = i.getNamedItem("data-name")
            ? i.getNamedItem("data-name").value
            : i.getNamedItem("data-bm-name")
            ? i.getNamedItem("data-bm-name").value
            : i.getNamedItem("bm-name")
            ? i.getNamedItem("bm-name").value
            : "");
        var a = i.getNamedItem("data-anim-prerender")
          ? i.getNamedItem("data-anim-prerender").value
          : i.getNamedItem("data-bm-prerender")
          ? i.getNamedItem("data-bm-prerender").value
          : i.getNamedItem("bm-prerender")
          ? i.getNamedItem("bm-prerender").value
          : "";
        "false" === a && (r.prerender = !1), this.setParams(r);
      }),
      (AnimationItem.prototype.includeLayers = function (t) {
        t.op > this.animationData.op &&
          ((this.animationData.op = t.op),
          (this.totalFrames = Math.floor(t.op - this.animationData.ip)),
          (this.animationData.tf = this.totalFrames));
        var e,
          r,
          i = this.animationData.layers,
          n = i.length,
          s = t.layers,
          a = s.length;
        for (r = 0; a > r; r += 1)
          for (e = 0; n > e; ) {
            if (i[e].id == s[r].id) {
              i[e] = s[r];
              break;
            }
            e += 1;
          }
        if (
          ((t.chars || t.fonts) &&
            (this.renderer.globalData.fontManager.addChars(t.chars),
            this.renderer.globalData.fontManager.addFonts(
              t.fonts,
              this.renderer.globalData.defs
            )),
          t.assets)
        )
          for (n = t.assets.length, e = 0; n > e; e += 1)
            this.animationData.assets.push(t.assets[e]);
        (this.animationData.__complete = !1),
          dataManager.completeData(
            this.animationData,
            this.renderer.globalData.fontManager
          ),
          this.renderer.includeLayers(t.layers),
          expressionsPlugin && expressionsPlugin.initExpressions(this),
          this.renderer.renderFrame(null),
          this.loadNextSegment();
      }),
      (AnimationItem.prototype.loadNextSegment = function () {
        var t = this.animationData.segments;
        if (!t || 0 === t.length || !this.autoloadSegments)
          return (
            this.trigger("data_ready"),
            void (this.timeCompleted = this.animationData.tf)
          );
        var e = t.shift();
        this.timeCompleted = e.time * this.frameRate;
        var r = new XMLHttpRequest(),
          i = this,
          n = this.path + this.fileName + "_" + this.segmentPos + ".json";
        (this.segmentPos += 1),
          r.open("GET", n, !0),
          r.send(),
          (r.onreadystatechange = function () {
            if (4 == r.readyState)
              if (200 == r.status) i.includeLayers(JSON.parse(r.responseText));
              else
                try {
                  var t = JSON.parse(r.responseText);
                  i.includeLayers(t);
                } catch (e) {}
          });
      }),
      (AnimationItem.prototype.loadSegments = function () {
        var t = this.animationData.segments;
        t || (this.timeCompleted = this.animationData.tf),
          this.loadNextSegment();
      }),
      (AnimationItem.prototype.configAnimation = function (t) {
        (this.renderer && this.renderer.destroyed) ||
          ((this.animationData = t),
          (this.totalFrames = Math.floor(
            this.animationData.op - this.animationData.ip
          )),
          (this.animationData.tf = this.totalFrames),
          this.renderer.configAnimation(t),
          t.assets || (t.assets = []),
          t.comps && ((t.assets = t.assets.concat(t.comps)), (t.comps = null)),
          this.renderer.searchExtraCompositions(t.assets),
          (this.layers = this.animationData.layers),
          (this.assets = this.animationData.assets),
          (this.frameRate = this.animationData.fr),
          (this.firstFrame = Math.round(this.animationData.ip)),
          (this.frameMult = this.animationData.fr / 1e3),
          this.trigger("config_ready"),
          (this.imagePreloader = new ImagePreloader()),
          this.imagePreloader.setAssetsPath(this.assetsPath),
          this.imagePreloader.setPath(this.path),
          this.imagePreloader.loadAssets(t.assets),
          this.loadSegments(),
          this.updaFrameModifier(),
          this.renderer.globalData.fontManager
            ? this.waitForFontsLoaded()
            : (dataManager.completeData(
                this.animationData,
                this.renderer.globalData.fontManager
              ),
              this.checkLoaded()));
      }),
      (AnimationItem.prototype.waitForFontsLoaded = (function () {
        function t() {
          this.renderer.globalData.fontManager.loaded
            ? (dataManager.completeData(
                this.animationData,
                this.renderer.globalData.fontManager
              ),
              this.checkLoaded())
            : setTimeout(t.bind(this), 20);
        }
        return function () {
          t.bind(this)();
        };
      })()),
      (AnimationItem.prototype.addPendingElement = function () {
        this.pendingElements += 1;
      }),
      (AnimationItem.prototype.elementLoaded = function () {
        this.pendingElements--, this.checkLoaded();
      }),
      (AnimationItem.prototype.checkLoaded = function () {
        0 === this.pendingElements &&
          (expressionsPlugin && expressionsPlugin.initExpressions(this),
          this.renderer.initItems(),
          setTimeout(
            function () {
              this.trigger("DOMLoaded");
            }.bind(this),
            0
          ),
          (this.isLoaded = !0),
          this.gotoFrame(),
          this.autoplay && this.play());
      }),
      (AnimationItem.prototype.resize = function () {
        this.renderer.updateContainerSize();
      }),
      (AnimationItem.prototype.setSubframe = function (t) {
        this.subframeEnabled = t ? !0 : !1;
      }),
      (AnimationItem.prototype.gotoFrame = function () {
        (this.currentFrame = this.subframeEnabled
          ? this.currentRawFrame
          : Math.floor(this.currentRawFrame)),
          this.timeCompleted !== this.totalFrames &&
            this.currentFrame > this.timeCompleted &&
            (this.currentFrame = this.timeCompleted),
          this.trigger("enterFrame"),
          this.renderFrame();
      }),
      (AnimationItem.prototype.renderFrame = function () {
        this.isLoaded !== !1 &&
          this.renderer.renderFrame(this.currentFrame + this.firstFrame);
      }),
      (AnimationItem.prototype.play = function (t) {
        (t && this.name != t) ||
          (this.isPaused === !0 &&
            ((this.isPaused = !1),
            this._idle && ((this._idle = !1), this.trigger("_active"))));
      }),
      (AnimationItem.prototype.pause = function (t) {
        (t && this.name != t) ||
          (this.isPaused === !1 &&
            ((this.isPaused = !0),
            this.pendingSegment || ((this._idle = !0), this.trigger("_idle"))));
      }),
      (AnimationItem.prototype.togglePause = function (t) {
        (t && this.name != t) ||
          (this.isPaused === !0 ? this.play() : this.pause());
      }),
      (AnimationItem.prototype.stop = function (t) {
        (t && this.name != t) ||
          (this.pause(),
          (this.currentFrame = this.currentRawFrame = 0),
          (this.playCount = 0),
          this.gotoFrame());
      }),
      (AnimationItem.prototype.goToAndStop = function (t, e, r) {
        (r && this.name != r) ||
          (this.setCurrentRawFrameValue(e ? t : t * this.frameModifier),
          this.pause());
      }),
      (AnimationItem.prototype.goToAndPlay = function (t, e, r) {
        this.goToAndStop(t, e, r), this.play();
      }),
      (AnimationItem.prototype.advanceTime = function (t) {
        return this.pendingSegment
          ? ((this.pendingSegment = !1),
            this.adjustSegment(this.segments.shift()),
            void (this.isPaused && this.play()))
          : void (
              this.isPaused !== !0 &&
              this.isLoaded !== !1 &&
              this.setCurrentRawFrameValue(
                this.currentRawFrame + t * this.frameModifier
              )
            );
      }),
      (AnimationItem.prototype.updateAnimation = function (t) {
        this.setCurrentRawFrameValue(this.totalFrames * t);
      }),
      (AnimationItem.prototype.moveFrame = function (t, e) {
        (e && this.name != e) ||
          this.setCurrentRawFrameValue(this.currentRawFrame + t);
      }),
      (AnimationItem.prototype.adjustSegment = function (t) {
        (this.playCount = 0),
          t[1] < t[0]
            ? (this.frameModifier > 0 &&
                (this.playSpeed < 0
                  ? this.setSpeed(-this.playSpeed)
                  : this.setDirection(-1)),
              (this.totalFrames = t[0] - t[1]),
              (this.firstFrame = t[1]),
              this.setCurrentRawFrameValue(this.totalFrames - 0.01))
            : t[1] > t[0] &&
              (this.frameModifier < 0 &&
                (this.playSpeed < 0
                  ? this.setSpeed(-this.playSpeed)
                  : this.setDirection(1)),
              (this.totalFrames = t[1] - t[0]),
              (this.firstFrame = t[0]),
              this.setCurrentRawFrameValue(0)),
          this.trigger("segmentStart");
      }),
      (AnimationItem.prototype.setSegment = function (t, e) {
        var r = -1;
        this.isPaused &&
          (this.currentRawFrame + this.firstFrame < t
            ? (r = t)
            : this.currentRawFrame + this.firstFrame > e && (r = e - t - 0.01)),
          (this.firstFrame = t),
          (this.totalFrames = e - t),
          -1 !== r && this.goToAndStop(r, !0);
      }),
      (AnimationItem.prototype.playSegments = function (t, e) {
        if ("object" == typeof t[0]) {
          var r,
            i = t.length;
          for (r = 0; i > r; r += 1) this.segments.push(t[r]);
        } else this.segments.push(t);
        e && this.adjustSegment(this.segments.shift()),
          this.isPaused && this.play();
      }),
      (AnimationItem.prototype.resetSegments = function (t) {
        (this.segments.length = 0),
          this.segments.push([
            this.animationData.ip * this.frameRate,
            Math.floor(
              this.animationData.op -
                this.animationData.ip +
                this.animationData.ip * this.frameRate
            ),
          ]),
          t && this.adjustSegment(this.segments.shift());
      }),
      (AnimationItem.prototype.checkSegments = function () {
        this.segments.length && (this.pendingSegment = !0);
      }),
      (AnimationItem.prototype.remove = function (t) {
        (t && this.name != t) || this.renderer.destroy();
      }),
      (AnimationItem.prototype.destroy = function (t) {
        (t && this.name != t) ||
          (this.renderer && this.renderer.destroyed) ||
          (this.renderer.destroy(),
          this.trigger("destroy"),
          (this._cbs = null),
          (this.onEnterFrame =
            this.onLoopComplete =
            this.onComplete =
            this.onSegmentStart =
            this.onDestroy =
              null));
      }),
      (AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
        if (
          ((this.currentRawFrame = t), this.currentRawFrame >= this.totalFrames)
        ) {
          if ((this.checkSegments(), this.loop === !1))
            return (
              (this.currentRawFrame = this.totalFrames - 0.01),
              this.gotoFrame(),
              this.pause(),
              void this.trigger("complete")
            );
          if (
            (this.trigger("loopComplete"),
            (this.playCount += 1),
            (this.loop !== !0 && this.playCount == this.loop) ||
              this.pendingSegment)
          )
            return (
              (this.currentRawFrame = this.totalFrames - 0.01),
              this.gotoFrame(),
              this.pause(),
              void this.trigger("complete")
            );
          this.currentRawFrame = this.currentRawFrame % this.totalFrames;
        } else if (this.currentRawFrame < 0)
          return (
            this.checkSegments(),
            (this.playCount -= 1),
            this.playCount < 0 && (this.playCount = 0),
            this.loop === !1 || this.pendingSegment
              ? ((this.currentRawFrame = 0),
                this.gotoFrame(),
                this.pause(),
                void this.trigger("complete"))
              : (this.trigger("loopComplete"),
                (this.currentRawFrame =
                  (this.totalFrames + this.currentRawFrame) % this.totalFrames),
                void this.gotoFrame())
          );
        this.gotoFrame();
      }),
      (AnimationItem.prototype.setSpeed = function (t) {
        (this.playSpeed = t), this.updaFrameModifier();
      }),
      (AnimationItem.prototype.setDirection = function (t) {
        (this.playDirection = 0 > t ? -1 : 1), this.updaFrameModifier();
      }),
      (AnimationItem.prototype.updaFrameModifier = function () {
        this.frameModifier =
          this.frameMult * this.playSpeed * this.playDirection;
      }),
      (AnimationItem.prototype.getPath = function () {
        return this.path;
      }),
      (AnimationItem.prototype.getAssetsPath = function (t) {
        var e = "";
        if (this.assetsPath) {
          var r = t.p;
          -1 !== r.indexOf("images/") && (r = r.split("/")[1]),
            (e = this.assetsPath + r);
        } else (e = this.path), (e += t.u ? t.u : ""), (e += t.p);
        return e;
      }),
      (AnimationItem.prototype.getAssetData = function (t) {
        for (var e = 0, r = this.assets.length; r > e; ) {
          if (t == this.assets[e].id) return this.assets[e];
          e += 1;
        }
      }),
      (AnimationItem.prototype.hide = function () {
        this.renderer.hide();
      }),
      (AnimationItem.prototype.show = function () {
        this.renderer.show();
      }),
      (AnimationItem.prototype.getAssets = function () {
        return this.assets;
      }),
      (AnimationItem.prototype.trigger = function (t) {
        if (this._cbs && this._cbs[t])
          switch (t) {
            case "enterFrame":
              this.triggerEvent(
                t,
                new BMEnterFrameEvent(
                  t,
                  this.currentFrame,
                  this.totalFrames,
                  this.frameMult
                )
              );
              break;
            case "loopComplete":
              this.triggerEvent(
                t,
                new BMCompleteLoopEvent(
                  t,
                  this.loop,
                  this.playCount,
                  this.frameMult
                )
              );
              break;
            case "complete":
              this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
              break;
            case "segmentStart":
              this.triggerEvent(
                t,
                new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)
              );
              break;
            case "destroy":
              this.triggerEvent(t, new BMDestroyEvent(t, this));
              break;
            default:
              this.triggerEvent(t);
          }
        "enterFrame" === t &&
          this.onEnterFrame &&
          this.onEnterFrame.call(
            this,
            new BMEnterFrameEvent(
              t,
              this.currentFrame,
              this.totalFrames,
              this.frameMult
            )
          ),
          "loopComplete" === t &&
            this.onLoopComplete &&
            this.onLoopComplete.call(
              this,
              new BMCompleteLoopEvent(
                t,
                this.loop,
                this.playCount,
                this.frameMult
              )
            ),
          "complete" === t &&
            this.onComplete &&
            this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)),
          "segmentStart" === t &&
            this.onSegmentStart &&
            this.onSegmentStart.call(
              this,
              new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)
            ),
          "destroy" === t &&
            this.onDestroy &&
            this.onDestroy.call(this, new BMDestroyEvent(t, this));
      }),
      (AnimationItem.prototype.addEventListener = _addEventListener),
      (AnimationItem.prototype.removeEventListener = _removeEventListener),
      (AnimationItem.prototype.triggerEvent = _triggerEvent),
      extendPrototype(BaseRenderer, CanvasRenderer),
      (CanvasRenderer.prototype.createBase = function (t) {
        return new CVBaseElement(t, this, this.globalData);
      }),
      (CanvasRenderer.prototype.createShape = function (t) {
        return new CVShapeElement(t, this, this.globalData);
      }),
      (CanvasRenderer.prototype.createText = function (t) {
        return new CVTextElement(t, this, this.globalData);
      }),
      (CanvasRenderer.prototype.createImage = function (t) {
        return new CVImageElement(t, this, this.globalData);
      }),
      (CanvasRenderer.prototype.createComp = function (t) {
        return new CVCompElement(t, this, this.globalData);
      }),
      (CanvasRenderer.prototype.createSolid = function (t) {
        return new CVSolidElement(t, this, this.globalData);
      }),
      (CanvasRenderer.prototype.ctxTransform = function (t) {
        if (
          1 !== t[0] ||
          0 !== t[1] ||
          0 !== t[4] ||
          1 !== t[5] ||
          0 !== t[12] ||
          0 !== t[13]
        ) {
          if (!this.renderConfig.clearCanvas)
            return void this.canvasContext.transform(
              t[0],
              t[1],
              t[4],
              t[5],
              t[12],
              t[13]
            );
          this.transformMat.cloneFromProps(t),
            this.transformMat.transform(
              this.contextData.cTr.props[0],
              this.contextData.cTr.props[1],
              this.contextData.cTr.props[2],
              this.contextData.cTr.props[3],
              this.contextData.cTr.props[4],
              this.contextData.cTr.props[5],
              this.contextData.cTr.props[6],
              this.contextData.cTr.props[7],
              this.contextData.cTr.props[8],
              this.contextData.cTr.props[9],
              this.contextData.cTr.props[10],
              this.contextData.cTr.props[11],
              this.contextData.cTr.props[12],
              this.contextData.cTr.props[13],
              this.contextData.cTr.props[14],
              this.contextData.cTr.props[15]
            ),
            this.contextData.cTr.cloneFromProps(this.transformMat.props);
          var e = this.contextData.cTr.props;
          this.canvasContext.setTransform(e[0], e[1], e[4], e[5], e[12], e[13]);
        }
      }),
      (CanvasRenderer.prototype.ctxOpacity = function (t) {
        if (1 !== t) {
          if (!this.renderConfig.clearCanvas)
            return void (this.canvasContext.globalAlpha *= 0 > t ? 0 : t);
          (this.contextData.cO *= 0 > t ? 0 : t),
            (this.canvasContext.globalAlpha = this.contextData.cO);
        }
      }),
      (CanvasRenderer.prototype.reset = function () {
        return this.renderConfig.clearCanvas
          ? ((this.contextData.cArrPos = 0),
            this.contextData.cTr.reset(),
            void (this.contextData.cO = 1))
          : void this.canvasContext.restore();
      }),
      (CanvasRenderer.prototype.save = function (t) {
        if (!this.renderConfig.clearCanvas)
          return void this.canvasContext.save();
        t && this.canvasContext.save();
        var e = this.contextData.cTr.props;
        (null === this.contextData.saved[this.contextData.cArrPos] ||
          void 0 === this.contextData.saved[this.contextData.cArrPos]) &&
          (this.contextData.saved[this.contextData.cArrPos] = new Array(16));
        var r,
          i = this.contextData.saved[this.contextData.cArrPos];
        for (r = 0; 16 > r; r += 1) i[r] = e[r];
        (this.contextData.savedOp[this.contextData.cArrPos] =
          this.contextData.cO),
          (this.contextData.cArrPos += 1);
      }),
      (CanvasRenderer.prototype.restore = function (t) {
        if (!this.renderConfig.clearCanvas)
          return void this.canvasContext.restore();
        t && this.canvasContext.restore(), (this.contextData.cArrPos -= 1);
        var e,
          r = this.contextData.saved[this.contextData.cArrPos],
          i = this.contextData.cTr.props;
        for (e = 0; 16 > e; e += 1) i[e] = r[e];
        this.canvasContext.setTransform(r[0], r[1], r[4], r[5], r[12], r[13]),
          (r = this.contextData.savedOp[this.contextData.cArrPos]),
          (this.contextData.cO = r),
          (this.canvasContext.globalAlpha = r);
      }),
      (CanvasRenderer.prototype.configAnimation = function (t) {
        this.animationItem.wrapper
          ? ((this.animationItem.container = document.createElement("canvas")),
            (this.animationItem.container.style.width = "100%"),
            (this.animationItem.container.style.height = "100%"),
            (this.animationItem.container.style.transformOrigin =
              this.animationItem.container.style.mozTransformOrigin =
              this.animationItem.container.style.webkitTransformOrigin =
              this.animationItem.container.style["-webkit-transform"] =
                "0px 0px 0px"),
            this.animationItem.wrapper.appendChild(
              this.animationItem.container
            ),
            (this.canvasContext =
              this.animationItem.container.getContext("2d")))
          : (this.canvasContext = this.renderConfig.context),
          (this.data = t),
          (this.globalData.canvasContext = this.canvasContext),
          (this.globalData.renderer = this),
          (this.globalData.isDashed = !1),
          (this.globalData.totalFrames = Math.floor(t.tf)),
          (this.globalData.compWidth = t.w),
          (this.globalData.compHeight = t.h),
          (this.globalData.frameRate = t.fr),
          (this.globalData.frameId = 0),
          (this.globalData.compSize = { w: t.w, h: t.h }),
          (this.globalData.progressiveLoad = this.renderConfig.progressiveLoad),
          (this.layers = t.layers),
          (this.transformCanvas = {}),
          (this.transformCanvas.w = t.w),
          (this.transformCanvas.h = t.h),
          (this.globalData.fontManager = new FontManager()),
          this.globalData.fontManager.addChars(t.chars),
          this.globalData.fontManager.addFonts(t.fonts, document.body),
          (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
            this.animationItem
          )),
          (this.globalData.getAssetsPath =
            this.animationItem.getAssetsPath.bind(this.animationItem)),
          (this.globalData.elementLoaded =
            this.animationItem.elementLoaded.bind(this.animationItem)),
          (this.globalData.addPendingElement =
            this.animationItem.addPendingElement.bind(this.animationItem)),
          (this.globalData.transformCanvas = this.transformCanvas),
          (this.elements = Array.apply(null, { length: t.layers.length })),
          this.updateContainerSize();
      }),
      (CanvasRenderer.prototype.updateContainerSize = function () {
        var t, e;
        this.animationItem.wrapper && this.animationItem.container
          ? ((t = this.animationItem.wrapper.offsetWidth),
            (e = this.animationItem.wrapper.offsetHeight),
            this.animationItem.container.setAttribute(
              "width",
              t * this.renderConfig.dpr
            ),
            this.animationItem.container.setAttribute(
              "height",
              e * this.renderConfig.dpr
            ))
          : ((t = this.canvasContext.canvas.width * this.renderConfig.dpr),
            (e = this.canvasContext.canvas.height * this.renderConfig.dpr));
        var r, i;
        if (
          -1 !== this.renderConfig.preserveAspectRatio.indexOf("meet") ||
          -1 !== this.renderConfig.preserveAspectRatio.indexOf("slice")
        ) {
          var n = this.renderConfig.preserveAspectRatio.split(" "),
            s = n[1] || "meet",
            a = n[0] || "xMidYMid",
            o = a.substr(0, 4),
            l = a.substr(4);
          (r = t / e),
            (i = this.transformCanvas.w / this.transformCanvas.h),
            (i > r && "meet" === s) || (r > i && "slice" === s)
              ? ((this.transformCanvas.sx =
                  t / (this.transformCanvas.w / this.renderConfig.dpr)),
                (this.transformCanvas.sy =
                  t / (this.transformCanvas.w / this.renderConfig.dpr)))
              : ((this.transformCanvas.sx =
                  e / (this.transformCanvas.h / this.renderConfig.dpr)),
                (this.transformCanvas.sy =
                  e / (this.transformCanvas.h / this.renderConfig.dpr))),
            (this.transformCanvas.tx =
              "xMid" === o &&
              ((r > i && "meet" === s) || (i > r && "slice" === s))
                ? ((t - this.transformCanvas.w * (e / this.transformCanvas.h)) /
                    2) *
                  this.renderConfig.dpr
                : "xMax" === o &&
                  ((r > i && "meet" === s) || (i > r && "slice" === s))
                ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) *
                  this.renderConfig.dpr
                : 0),
            (this.transformCanvas.ty =
              "YMid" === l &&
              ((i > r && "meet" === s) || (r > i && "slice" === s))
                ? ((e - this.transformCanvas.h * (t / this.transformCanvas.w)) /
                    2) *
                  this.renderConfig.dpr
                : "YMax" === l &&
                  ((i > r && "meet" === s) || (r > i && "slice" === s))
                ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) *
                  this.renderConfig.dpr
                : 0);
        } else
          "none" == this.renderConfig.preserveAspectRatio
            ? ((this.transformCanvas.sx =
                t / (this.transformCanvas.w / this.renderConfig.dpr)),
              (this.transformCanvas.sy =
                e / (this.transformCanvas.h / this.renderConfig.dpr)),
              (this.transformCanvas.tx = 0),
              (this.transformCanvas.ty = 0))
            : ((this.transformCanvas.sx = this.renderConfig.dpr),
              (this.transformCanvas.sy = this.renderConfig.dpr),
              (this.transformCanvas.tx = 0),
              (this.transformCanvas.ty = 0));
        this.transformCanvas.props = [
          this.transformCanvas.sx,
          0,
          0,
          0,
          0,
          this.transformCanvas.sy,
          0,
          0,
          0,
          0,
          1,
          0,
          this.transformCanvas.tx,
          this.transformCanvas.ty,
          0,
          1,
        ];
        var h,
          p = this.elements.length;
        for (h = 0; p > h; h += 1)
          this.elements[h] &&
            0 === this.elements[h].data.ty &&
            this.elements[h].resize(this.globalData.transformCanvas);
      }),
      (CanvasRenderer.prototype.destroy = function () {
        this.renderConfig.clearCanvas &&
          (this.animationItem.wrapper.innerHTML = "");
        var t,
          e = this.layers ? this.layers.length : 0;
        for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
        (this.elements.length = 0),
          (this.globalData.canvasContext = null),
          (this.animationItem.container = null),
          (this.destroyed = !0);
      }),
      (CanvasRenderer.prototype.renderFrame = function (t) {
        if (
          !(
            (this.renderedFrame == t && this.renderConfig.clearCanvas === !0) ||
            this.destroyed ||
            null === t
          )
        ) {
          (this.renderedFrame = t),
            (this.globalData.frameNum = t - this.animationItem.firstFrame),
            (this.globalData.frameId += 1),
            (this.globalData.projectInterface.currentFrame = t),
            this.renderConfig.clearCanvas === !0
              ? (this.reset(),
                this.canvasContext.save(),
                this.canvasContext.clearRect(
                  this.transformCanvas.tx,
                  this.transformCanvas.ty,
                  this.transformCanvas.w * this.transformCanvas.sx,
                  this.transformCanvas.h * this.transformCanvas.sy
                ))
              : this.save(),
            this.ctxTransform(this.transformCanvas.props),
            this.canvasContext.beginPath(),
            this.canvasContext.rect(
              0,
              0,
              this.transformCanvas.w,
              this.transformCanvas.h
            ),
            this.canvasContext.closePath(),
            this.canvasContext.clip();
          var e,
            r = this.layers.length;
          for (this.completeLayers || this.checkLayers(t), e = 0; r > e; e++)
            (this.completeLayers || this.elements[e]) &&
              this.elements[e].prepareFrame(t - this.layers[e].st);
          for (e = r - 1; e >= 0; e -= 1)
            (this.completeLayers || this.elements[e]) &&
              this.elements[e].renderFrame();
          this.renderConfig.clearCanvas !== !0
            ? this.restore()
            : this.canvasContext.restore();
        }
      }),
      (CanvasRenderer.prototype.buildItem = function (t) {
        var e = this.elements;
        if (!e[t] && 99 != this.layers[t].ty) {
          var r = this.createItem(this.layers[t], this, this.globalData);
          (e[t] = r),
            r.initExpressions(),
            0 === this.layers[t].ty &&
              r.resize(this.globalData.transformCanvas);
        }
      }),
      (CanvasRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length; ) {
          var t = this.pendingElements.pop();
          t.checkParenting();
        }
      }),
      (CanvasRenderer.prototype.hide = function () {
        this.animationItem.container.style.display = "none";
      }),
      (CanvasRenderer.prototype.show = function () {
        this.animationItem.container.style.display = "block";
      }),
      (CanvasRenderer.prototype.searchExtraCompositions = function (t) {
        var e,
          r = t.length;
        for (document.createElementNS(svgNS, "g"), e = 0; r > e; e += 1)
          if (t[e].xt) {
            var i = this.createComp(
              t[e],
              this.globalData.comp,
              this.globalData
            );
            i.initExpressions(),
              this.globalData.projectInterface.registerComposition(i);
          }
      }),
      extendPrototype(BaseRenderer, HybridRenderer),
      (HybridRenderer.prototype.buildItem = SVGRenderer.prototype.buildItem),
      (HybridRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length; ) {
          var t = this.pendingElements.pop();
          t.checkParenting();
        }
      }),
      (HybridRenderer.prototype.appendElementInPos = function (t, e) {
        var r = t.getBaseElement();
        if (r) {
          var i = this.layers[e];
          if (i.ddd && this.supports3d) this.addTo3dContainer(r, e);
          else {
            for (var n, s = 0; e > s; )
              this.elements[s] &&
                this.elements[s] !== !0 &&
                this.elements[s].getBaseElement &&
                (n = this.elements[s].getBaseElement()),
                (s += 1);
            n
              ? (i.ddd && this.supports3d) ||
                this.layerElement.insertBefore(r, n)
              : (i.ddd && this.supports3d) || this.layerElement.appendChild(r);
          }
        }
      }),
      (HybridRenderer.prototype.createBase = function (t) {
        return new SVGBaseElement(t, this.layerElement, this.globalData, this);
      }),
      (HybridRenderer.prototype.createShape = function (t) {
        return this.supports3d
          ? new HShapeElement(t, this.layerElement, this.globalData, this)
          : new IShapeElement(t, this.layerElement, this.globalData, this);
      }),
      (HybridRenderer.prototype.createText = function (t) {
        return this.supports3d
          ? new HTextElement(t, this.layerElement, this.globalData, this)
          : new SVGTextElement(t, this.layerElement, this.globalData, this);
      }),
      (HybridRenderer.prototype.createCamera = function (t) {
        return (
          (this.camera = new HCameraElement(
            t,
            this.layerElement,
            this.globalData,
            this
          )),
          this.camera
        );
      }),
      (HybridRenderer.prototype.createImage = function (t) {
        return this.supports3d
          ? new HImageElement(t, this.layerElement, this.globalData, this)
          : new IImageElement(t, this.layerElement, this.globalData, this);
      }),
      (HybridRenderer.prototype.createComp = function (t) {
        return this.supports3d
          ? new HCompElement(t, this.layerElement, this.globalData, this)
          : new ICompElement(t, this.layerElement, this.globalData, this);
      }),
      (HybridRenderer.prototype.createSolid = function (t) {
        return this.supports3d
          ? new HSolidElement(t, this.layerElement, this.globalData, this)
          : new ISolidElement(t, this.layerElement, this.globalData, this);
      }),
      (HybridRenderer.prototype.getThreeDContainer = function (t) {
        var e = document.createElement("div");
        styleDiv(e),
          (e.style.width = this.globalData.compSize.w + "px"),
          (e.style.height = this.globalData.compSize.h + "px"),
          (e.style.transformOrigin =
            e.style.mozTransformOrigin =
            e.style.webkitTransformOrigin =
              "50% 50%");
        var r = document.createElement("div");
        styleDiv(r),
          (r.style.transform = r.style.webkitTransform =
            "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"),
          e.appendChild(r),
          this.resizerElem.appendChild(e);
        var i = { container: r, perspectiveElem: e, startPos: t, endPos: t };
        return this.threeDElements.push(i), i;
      }),
      (HybridRenderer.prototype.build3dContainers = function () {
        var t,
          e,
          r = this.layers.length;
        for (t = 0; r > t; t += 1)
          this.layers[t].ddd
            ? (e || (e = this.getThreeDContainer(t)),
              (e.endPos = Math.max(e.endPos, t)))
            : (e = null);
      }),
      (HybridRenderer.prototype.addTo3dContainer = function (t, e) {
        for (var r = 0, i = this.threeDElements.length; i > r; ) {
          if (e <= this.threeDElements[r].endPos) {
            for (var n, s = this.threeDElements[r].startPos; e > s; )
              this.elements[s] &&
                this.elements[s].getBaseElement &&
                (n = this.elements[s].getBaseElement()),
                (s += 1);
            n
              ? this.threeDElements[r].container.insertBefore(t, n)
              : this.threeDElements[r].container.appendChild(t);
            break;
          }
          r += 1;
        }
      }),
      (HybridRenderer.prototype.configAnimation = function (t) {
        var e = document.createElement("div"),
          r = this.animationItem.wrapper;
        (e.style.width = t.w + "px"),
          (e.style.height = t.h + "px"),
          (this.resizerElem = e),
          styleDiv(e),
          (e.style.transformStyle =
            e.style.webkitTransformStyle =
            e.style.mozTransformStyle =
              "flat"),
          r.appendChild(e);
        var i = document.createElementNS(svgNS, "svg");
        i.setAttribute("width", "1"),
          i.setAttribute("height", "1"),
          styleDiv(i),
          this.resizerElem.appendChild(i);
        var n = document.createElementNS(svgNS, "defs");
        i.appendChild(n),
          (this.globalData.defs = n),
          (this.data = t),
          (this.globalData.getAssetData = this.animationItem.getAssetData.bind(
            this.animationItem
          )),
          (this.globalData.getAssetsPath =
            this.animationItem.getAssetsPath.bind(this.animationItem)),
          (this.globalData.elementLoaded =
            this.animationItem.elementLoaded.bind(this.animationItem)),
          (this.globalData.frameId = 0),
          (this.globalData.compSize = { w: t.w, h: t.h }),
          (this.globalData.frameRate = t.fr),
          (this.layers = t.layers),
          (this.globalData.fontManager = new FontManager()),
          this.globalData.fontManager.addChars(t.chars),
          this.globalData.fontManager.addFonts(t.fonts, i),
          (this.layerElement = this.resizerElem),
          this.build3dContainers(),
          this.updateContainerSize();
      }),
      (HybridRenderer.prototype.destroy = function () {
        (this.animationItem.wrapper.innerHTML = ""),
          (this.animationItem.container = null),
          (this.globalData.defs = null);
        var t,
          e = this.layers ? this.layers.length : 0;
        for (t = 0; e > t; t++) this.elements[t].destroy();
        (this.elements.length = 0),
          (this.destroyed = !0),
          (this.animationItem = null);
      }),
      (HybridRenderer.prototype.updateContainerSize = function () {
        var t,
          e,
          r,
          i,
          n = this.animationItem.wrapper.offsetWidth,
          s = this.animationItem.wrapper.offsetHeight,
          a = n / s,
          o = this.globalData.compSize.w / this.globalData.compSize.h;
        o > a
          ? ((t = n / this.globalData.compSize.w),
            (e = n / this.globalData.compSize.w),
            (r = 0),
            (i =
              (s -
                this.globalData.compSize.h * (n / this.globalData.compSize.w)) /
              2))
          : ((t = s / this.globalData.compSize.h),
            (e = s / this.globalData.compSize.h),
            (r =
              (n -
                this.globalData.compSize.w * (s / this.globalData.compSize.h)) /
              2),
            (i = 0)),
          (this.resizerElem.style.transform =
            this.resizerElem.style.webkitTransform =
              "matrix3d(" +
              t +
              ",0,0,0,0," +
              e +
              ",0,0,0,0,1,0," +
              r +
              "," +
              i +
              ",0,1)");
      }),
      (HybridRenderer.prototype.renderFrame =
        SVGRenderer.prototype.renderFrame),
      (HybridRenderer.prototype.hide = function () {
        this.resizerElem.style.display = "none";
      }),
      (HybridRenderer.prototype.show = function () {
        this.resizerElem.style.display = "block";
      }),
      (HybridRenderer.prototype.initItems = function () {
        if ((this.buildAllItems(), this.camera)) this.camera.setup();
        else {
          var t,
            e = this.globalData.compSize.w,
            r = this.globalData.compSize.h,
            i = this.threeDElements.length;
          for (t = 0; i > t; t += 1)
            this.threeDElements[t].perspectiveElem.style.perspective =
              this.threeDElements[t].perspectiveElem.style.webkitPerspective =
                Math.sqrt(Math.pow(e, 2) + Math.pow(r, 2)) + "px";
        }
      }),
      (HybridRenderer.prototype.searchExtraCompositions = function (t) {
        var e,
          r = t.length,
          i = document.createElement("div");
        for (e = 0; r > e; e += 1)
          if (t[e].xt) {
            var n = this.createComp(t[e], i, this.globalData.comp, null);
            n.initExpressions(),
              this.globalData.projectInterface.registerComposition(n);
          }
      }),
      createElement(BaseElement, CVBaseElement),
      (CVBaseElement.prototype.createElements = function () {
        this.checkParenting();
      }),
      (CVBaseElement.prototype.checkBlendMode = function (t) {
        if (t.blendMode !== this.data.bm) {
          t.blendMode = this.data.bm;
          var e = "";
          switch (this.data.bm) {
            case 0:
              e = "normal";
              break;
            case 1:
              e = "multiply";
              break;
            case 2:
              e = "screen";
              break;
            case 3:
              e = "overlay";
              break;
            case 4:
              e = "darken";
              break;
            case 5:
              e = "lighten";
              break;
            case 6:
              e = "color-dodge";
              break;
            case 7:
              e = "color-burn";
              break;
            case 8:
              e = "hard-light";
              break;
            case 9:
              e = "soft-light";
              break;
            case 10:
              e = "difference";
              break;
            case 11:
              e = "exclusion";
              break;
            case 12:
              e = "hue";
              break;
            case 13:
              e = "saturation";
              break;
            case 14:
              e = "color";
              break;
            case 15:
              e = "luminosity";
          }
          t.canvasContext.globalCompositeOperation = e;
        }
      }),
      (CVBaseElement.prototype.renderFrame = function (t) {
        if (3 === this.data.ty) return !1;
        if (
          (this.checkBlendMode(
            0 === this.data.ty ? this.parentGlobalData : this.globalData
          ),
          !this.isVisible)
        )
          return this.isVisible;
        (this.finalTransform.opMdf = this.finalTransform.op.mdf),
          (this.finalTransform.matMdf = this.finalTransform.mProp.mdf),
          (this.finalTransform.opacity = this.finalTransform.op.v);
        var e,
          r = this.finalTransform.mat;
        if (this.hierarchy) {
          var i,
            n = this.hierarchy.length;
          for (
            e = this.finalTransform.mProp.v.props, r.cloneFromProps(e), i = 0;
            n > i;
            i += 1
          )
            (this.finalTransform.matMdf = this.hierarchy[i].finalTransform.mProp
              .mdf
              ? !0
              : this.finalTransform.matMdf),
              (e = this.hierarchy[i].finalTransform.mProp.v.props),
              r.transform(
                e[0],
                e[1],
                e[2],
                e[3],
                e[4],
                e[5],
                e[6],
                e[7],
                e[8],
                e[9],
                e[10],
                e[11],
                e[12],
                e[13],
                e[14],
                e[15]
              );
        } else
          t
            ? ((e = this.finalTransform.mProp.v.props), r.cloneFromProps(e))
            : r.cloneFromProps(this.finalTransform.mProp.v.props);
        return (
          t &&
            ((e = t.mat.props),
            r.transform(
              e[0],
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7],
              e[8],
              e[9],
              e[10],
              e[11],
              e[12],
              e[13],
              e[14],
              e[15]
            ),
            (this.finalTransform.opacity *= t.opacity),
            (this.finalTransform.opMdf = t.opMdf
              ? !0
              : this.finalTransform.opMdf),
            (this.finalTransform.matMdf = t.matMdf
              ? !0
              : this.finalTransform.matMdf)),
          this.data.hasMask &&
            (this.globalData.renderer.save(!0),
            this.maskManager.renderFrame(0 === this.data.ty ? null : r)),
          this.data.hd && (this.isVisible = !1),
          this.isVisible
        );
      }),
      (CVBaseElement.prototype.addMasks = function (t) {
        this.maskManager = new CVMaskElement(t, this, this.globalData);
      }),
      (CVBaseElement.prototype.destroy = function () {
        (this.canvasContext = null),
          (this.data = null),
          (this.globalData = null),
          this.maskManager && this.maskManager.destroy();
      }),
      (CVBaseElement.prototype.mHelper = new Matrix()),
      createElement(CVBaseElement, CVCompElement),
      (CVCompElement.prototype.ctxTransform =
        CanvasRenderer.prototype.ctxTransform),
      (CVCompElement.prototype.ctxOpacity =
        CanvasRenderer.prototype.ctxOpacity),
      (CVCompElement.prototype.save = CanvasRenderer.prototype.save),
      (CVCompElement.prototype.restore = CanvasRenderer.prototype.restore),
      (CVCompElement.prototype.reset = function () {
        (this.contextData.cArrPos = 0),
          this.contextData.cTr.reset(),
          (this.contextData.cO = 1);
      }),
      (CVCompElement.prototype.resize = function (t) {
        var e = Math.max(t.sx, t.sy);
        (this.canvas.width = this.data.w * e),
          (this.canvas.height = this.data.h * e),
          (this.transformCanvas = {
            sc: e,
            w: this.data.w * e,
            h: this.data.h * e,
            props: [e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          });
        var r,
          i = this.elements.length;
        for (r = 0; i > r; r += 1)
          this.elements[r] &&
            0 === this.elements[r].data.ty &&
            this.elements[r].resize(t);
      }),
      (CVCompElement.prototype.prepareFrame = function (t) {
        if (
          ((this.globalData.frameId = this.parentGlobalData.frameId),
          (this.globalData.mdf = !1),
          this._parent.prepareFrame.call(this, t),
          this.isVisible !== !1 || this.data.xt)
        ) {
          var e = t;
          this.tm &&
            ((e = this.tm.v), e === this.data.op && (e = this.data.op - 1)),
            (this.renderedFrame = e / this.data.sr);
          var r,
            i = this.elements.length;
          for (this.completeLayers || this.checkLayers(t), r = 0; i > r; r += 1)
            (this.completeLayers || this.elements[r]) &&
              (this.elements[r].prepareFrame(
                e / this.data.sr - this.layers[r].st
              ),
              0 === this.elements[r].data.ty &&
                this.elements[r].globalData.mdf &&
                (this.globalData.mdf = !0));
          this.globalData.mdf &&
            !this.data.xt &&
            (this.canvasContext.clearRect(0, 0, this.data.w, this.data.h),
            this.ctxTransform(this.transformCanvas.props));
        }
      }),
      (CVCompElement.prototype.renderFrame = function (t) {
        if (this._parent.renderFrame.call(this, t) !== !1) {
          if (this.globalData.mdf) {
            var e,
              r = this.layers.length;
            for (e = r - 1; e >= 0; e -= 1)
              (this.completeLayers || this.elements[e]) &&
                this.elements[e].renderFrame();
          }
          this.data.hasMask && this.globalData.renderer.restore(!0),
            this.firstFrame && (this.firstFrame = !1),
            this.parentGlobalData.renderer.save(),
            this.parentGlobalData.renderer.ctxTransform(
              this.finalTransform.mat.props
            ),
            this.parentGlobalData.renderer.ctxOpacity(
              this.finalTransform.opacity
            ),
            this.parentGlobalData.renderer.canvasContext.drawImage(
              this.canvas,
              0,
              0,
              this.data.w,
              this.data.h
            ),
            this.parentGlobalData.renderer.restore(),
            this.globalData.mdf && this.reset();
        }
      }),
      (CVCompElement.prototype.setElements = function (t) {
        this.elements = t;
      }),
      (CVCompElement.prototype.getElements = function () {
        return this.elements;
      }),
      (CVCompElement.prototype.destroy = function () {
        var t,
          e = this.layers.length;
        for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
        (this.layers = null),
          (this.elements = null),
          this._parent.destroy.call(this._parent);
      }),
      (CVCompElement.prototype.checkLayers =
        CanvasRenderer.prototype.checkLayers),
      (CVCompElement.prototype.buildItem = CanvasRenderer.prototype.buildItem),
      (CVCompElement.prototype.checkPendingElements =
        CanvasRenderer.prototype.checkPendingElements),
      (CVCompElement.prototype.addPendingElement =
        CanvasRenderer.prototype.addPendingElement),
      (CVCompElement.prototype.buildAllItems =
        CanvasRenderer.prototype.buildAllItems),
      (CVCompElement.prototype.createItem =
        CanvasRenderer.prototype.createItem),
      (CVCompElement.prototype.createImage =
        CanvasRenderer.prototype.createImage),
      (CVCompElement.prototype.createComp =
        CanvasRenderer.prototype.createComp),
      (CVCompElement.prototype.createSolid =
        CanvasRenderer.prototype.createSolid),
      (CVCompElement.prototype.createShape =
        CanvasRenderer.prototype.createShape),
      (CVCompElement.prototype.createText =
        CanvasRenderer.prototype.createText),
      (CVCompElement.prototype.createBase =
        CanvasRenderer.prototype.createBase),
      (CVCompElement.prototype.buildElementParenting =
        CanvasRenderer.prototype.buildElementParenting),
      createElement(CVBaseElement, CVImageElement),
      (CVImageElement.prototype.createElements = function () {
        var t = function () {
            if (
              (this.globalData.elementLoaded(),
              this.assetData.w !== this.img.width ||
                this.assetData.h !== this.img.height)
            ) {
              var t = document.createElement("canvas");
              (t.width = this.assetData.w), (t.height = this.assetData.h);
              var e,
                r,
                i = t.getContext("2d"),
                n = this.img.width,
                s = this.img.height,
                a = n / s,
                o = this.assetData.w / this.assetData.h;
              a > o ? ((r = s), (e = r * o)) : ((e = n), (r = e / o)),
                i.drawImage(
                  this.img,
                  (n - e) / 2,
                  (s - r) / 2,
                  e,
                  r,
                  0,
                  0,
                  this.assetData.w,
                  this.assetData.h
                ),
                (this.img = t);
            }
          }.bind(this),
          e = function () {
            (this.failed = !0), this.globalData.elementLoaded();
          }.bind(this);
        (this.img = new Image()),
          this.img.addEventListener("load", t, !1),
          this.img.addEventListener("error", e, !1);
        var r = this.globalData.getAssetsPath(this.assetData);
        (this.img.src = r), this._parent.createElements.call(this);
      }),
      (CVImageElement.prototype.renderFrame = function (t) {
        if (!this.failed && this._parent.renderFrame.call(this, t) !== !1) {
          var e = this.canvasContext;
          this.globalData.renderer.save();
          var r = this.finalTransform.mat.props;
          this.globalData.renderer.ctxTransform(r),
            this.globalData.renderer.ctxOpacity(this.finalTransform.opacity),
            e.drawImage(this.img, 0, 0),
            this.globalData.renderer.restore(this.data.hasMask),
            this.firstFrame && (this.firstFrame = !1);
        }
      }),
      (CVImageElement.prototype.destroy = function () {
        (this.img = null), this._parent.destroy.call(this._parent);
      }),
      (CVMaskElement.prototype.getMaskProperty = function (t) {
        return this.viewData[t];
      }),
      (CVMaskElement.prototype.prepareFrame = function (t) {
        var e,
          r = this.dynamicProperties.length;
        for (e = 0; r > e; e += 1)
          this.dynamicProperties[e].getValue(t),
            this.dynamicProperties[e].mdf && (this.element.globalData.mdf = !0);
      }),
      (CVMaskElement.prototype.renderFrame = function (t) {
        var e,
          r,
          i,
          n,
          s,
          a = this.element.canvasContext,
          o = this.data.masksProperties.length,
          l = !1;
        for (e = 0; o > e; e++)
          if ("n" !== this.masksProperties[e].mode) {
            l === !1 && (a.beginPath(), (l = !0)),
              this.masksProperties[e].inv &&
                (a.moveTo(0, 0),
                a.lineTo(this.element.globalData.compWidth, 0),
                a.lineTo(
                  this.element.globalData.compWidth,
                  this.element.globalData.compHeight
                ),
                a.lineTo(0, this.element.globalData.compHeight),
                a.lineTo(0, 0)),
              (s = this.viewData[e].v),
              (r = t ? t.applyToPointArray(s.v[0][0], s.v[0][1], 0) : s.v[0]),
              a.moveTo(r[0], r[1]);
            var h,
              p = s._length;
            for (h = 1; p > h; h++)
              (r = t
                ? t.applyToPointArray(s.o[h - 1][0], s.o[h - 1][1], 0)
                : s.o[h - 1]),
                (i = t ? t.applyToPointArray(s.i[h][0], s.i[h][1], 0) : s.i[h]),
                (n = t ? t.applyToPointArray(s.v[h][0], s.v[h][1], 0) : s.v[h]),
                a.bezierCurveTo(r[0], r[1], i[0], i[1], n[0], n[1]);
            (r = t
              ? t.applyToPointArray(s.o[h - 1][0], s.o[h - 1][1], 0)
              : s.o[h - 1]),
              (i = t ? t.applyToPointArray(s.i[0][0], s.i[0][1], 0) : s.i[0]),
              (n = t ? t.applyToPointArray(s.v[0][0], s.v[0][1], 0) : s.v[0]),
              a.bezierCurveTo(r[0], r[1], i[0], i[1], n[0], n[1]);
          }
        l && a.clip();
      }),
      (CVMaskElement.prototype.getMask = function (t) {
        for (var e = 0, r = this.masksProperties.length; r > e; ) {
          if (this.masksProperties[e].nm === t)
            return { maskPath: this.viewData[e].pv };
          e += 1;
        }
      }),
      (CVMaskElement.prototype.destroy = function () {
        this.element = null;
      }),
      createElement(CVBaseElement, CVShapeElement),
      (CVShapeElement.prototype.lcEnum = { 1: "butt", 2: "round", 3: "butt" }),
      (CVShapeElement.prototype.ljEnum = { 1: "miter", 2: "round", 3: "butt" }),
      (CVShapeElement.prototype.transformHelper = {
        opacity: 1,
        mat: new Matrix(),
        matMdf: !1,
        opMdf: !1,
      }),
      (CVShapeElement.prototype.dashResetter = []),
      (CVShapeElement.prototype.createElements = function () {
        this._parent.createElements.call(this),
          this.searchShapes(
            this.shapesData,
            this.viewData,
            this.dynamicProperties
          );
      }),
      (CVShapeElement.prototype.searchShapes = function (t, e, r) {
        var i,
          n,
          s,
          a,
          o = t.length - 1,
          l = [],
          h = [];
        for (i = o; i >= 0; i -= 1)
          if ("fl" == t[i].ty || "st" == t[i].ty) {
            if (
              ((a = { type: t[i].ty, elements: [] }),
              (e[i] = {}),
              ("fl" == t[i].ty || "st" == t[i].ty) &&
                ((e[i].c = PropertyFactory.getProp(this, t[i].c, 1, 255, r)),
                e[i].c.k ||
                  (a.co =
                    "rgb(" +
                    bm_floor(e[i].c.v[0]) +
                    "," +
                    bm_floor(e[i].c.v[1]) +
                    "," +
                    bm_floor(e[i].c.v[2]) +
                    ")")),
              (e[i].o = PropertyFactory.getProp(this, t[i].o, 0, 0.01, r)),
              "st" == t[i].ty)
            ) {
              if (
                ((a.lc = this.lcEnum[t[i].lc] || "round"),
                (a.lj = this.ljEnum[t[i].lj] || "round"),
                1 == t[i].lj && (a.ml = t[i].ml),
                (e[i].w = PropertyFactory.getProp(this, t[i].w, 0, null, r)),
                e[i].w.k || (a.wi = e[i].w.v),
                t[i].d)
              ) {
                var p = PropertyFactory.getDashProp(this, t[i].d, "canvas", r);
                (e[i].d = p),
                  e[i].d.k ||
                    ((a.da = e[i].d.dasharray), (a["do"] = e[i].d.dashoffset));
              }
            } else a.r = 2 === t[i].r ? "evenodd" : "nonzero";
            this.stylesList.push(a), (e[i].style = a), l.push(e[i].style);
          } else if ("gr" == t[i].ty)
            (e[i] = { it: [] }), this.searchShapes(t[i].it, e[i].it, r);
          else if ("tr" == t[i].ty)
            e[i] = {
              transform: {
                mat: new Matrix(),
                opacity: 1,
                matMdf: !1,
                opMdf: !1,
                op: PropertyFactory.getProp(this, t[i].o, 0, 0.01, r),
                mProps: PropertyFactory.getProp(this, t[i], 2, null, r),
              },
              elements: [],
            };
          else if (
            "sh" == t[i].ty ||
            "rc" == t[i].ty ||
            "el" == t[i].ty ||
            "sr" == t[i].ty
          ) {
            e[i] = { nodes: [], trNodes: [], tr: [0, 0, 0, 0, 0, 0] };
            var c = 4;
            "rc" == t[i].ty
              ? (c = 5)
              : "el" == t[i].ty
              ? (c = 6)
              : "sr" == t[i].ty && (c = 7),
              (e[i].sh = ShapePropertyFactory.getShapeProp(this, t[i], c, r)),
              this.shapes.push(e[i].sh),
              this.addShapeToModifiers(e[i]),
              (s = this.stylesList.length);
            var f = !1,
              u = !1;
            for (n = 0; s > n; n += 1)
              this.stylesList[n].closed ||
                (this.stylesList[n].elements.push(e[i]),
                "st" === this.stylesList[n].type ? (f = !0) : (u = !0));
            (e[i].st = f), (e[i].fl = u);
          } else if ("tm" == t[i].ty || "rd" == t[i].ty || "rp" == t[i].ty) {
            var d = ShapeModifiers.getModifier(t[i].ty);
            d.init(this, t[i], r),
              this.shapeModifiers.push(d),
              h.push(d),
              (e[i] = d);
          }
        for (o = l.length, i = 0; o > i; i += 1) l[i].closed = !0;
        for (o = h.length, i = 0; o > i; i += 1) h[i].closed = !0;
      }),
      (CVShapeElement.prototype.addShapeToModifiers =
        IShapeElement.prototype.addShapeToModifiers),
      (CVShapeElement.prototype.renderModifiers =
        IShapeElement.prototype.renderModifiers),
      (CVShapeElement.prototype.renderFrame = function (t) {
        this._parent.renderFrame.call(this, t) !== !1 &&
          (this.transformHelper.mat.reset(),
          (this.transformHelper.opacity = this.finalTransform.opacity),
          (this.transformHelper.matMdf = !1),
          (this.transformHelper.opMdf = this.finalTransform.opMdf),
          this.renderModifiers(),
          this.renderShape(this.transformHelper, null, null, !0),
          this.data.hasMask && this.globalData.renderer.restore(!0));
      }),
      (CVShapeElement.prototype.renderShape = function (t, e, r, i) {
        var n, s;
        if (!e)
          for (
            e = this.shapesData, s = this.stylesList.length, n = 0;
            s > n;
            n += 1
          )
            (this.stylesList[n].d = ""), (this.stylesList[n].mdf = !1);
        r || (r = this.viewData), (s = e.length - 1);
        var a, o;
        for (a = t, n = s; n >= 0; n -= 1)
          if ("tr" == e[n].ty) {
            a = r[n].transform;
            var l = r[n].transform.mProps.v.props;
            if (
              ((a.matMdf = a.mProps.mdf),
              (a.opMdf = a.op.mdf),
              (o = a.mat),
              o.cloneFromProps(l),
              t)
            ) {
              var h = t.mat.props;
              (a.opacity = t.opacity),
                (a.opacity *= r[n].transform.op.v),
                (a.matMdf = t.matMdf ? !0 : a.matMdf),
                (a.opMdf = t.opMdf ? !0 : a.opMdf),
                o.transform(
                  h[0],
                  h[1],
                  h[2],
                  h[3],
                  h[4],
                  h[5],
                  h[6],
                  h[7],
                  h[8],
                  h[9],
                  h[10],
                  h[11],
                  h[12],
                  h[13],
                  h[14],
                  h[15]
                );
            } else a.opacity = a.op.o;
          } else
            "sh" == e[n].ty ||
            "el" == e[n].ty ||
            "rc" == e[n].ty ||
            "sr" == e[n].ty
              ? this.renderPath(e[n], r[n], a)
              : "fl" == e[n].ty
              ? this.renderFill(e[n], r[n], a)
              : "st" == e[n].ty
              ? this.renderStroke(e[n], r[n], a)
              : "gr" == e[n].ty
              ? this.renderShape(a, e[n].it, r[n].it)
              : "tm" == e[n].ty;
        if (i) {
          s = this.stylesList.length;
          var p,
            c,
            f,
            u,
            d,
            m,
            y,
            g = this.globalData.renderer,
            v = this.globalData.canvasContext;
          for (
            g.save(), g.ctxTransform(this.finalTransform.mat.props), n = 0;
            s > n;
            n += 1
          )
            if (
              ((y = this.stylesList[n].type),
              "st" !== y || 0 !== this.stylesList[n].wi)
            ) {
              for (
                g.save(),
                  d = this.stylesList[n].elements,
                  "st" === y
                    ? ((v.strokeStyle = this.stylesList[n].co),
                      (v.lineWidth = this.stylesList[n].wi),
                      (v.lineCap = this.stylesList[n].lc),
                      (v.lineJoin = this.stylesList[n].lj),
                      (v.miterLimit = this.stylesList[n].ml || 0))
                    : (v.fillStyle = this.stylesList[n].co),
                  g.ctxOpacity(this.stylesList[n].coOp),
                  "st" !== y && v.beginPath(),
                  c = d.length,
                  p = 0;
                c > p;
                p += 1
              ) {
                for (
                  "st" === y &&
                    (v.beginPath(),
                    this.stylesList[n].da
                      ? (v.setLineDash(this.stylesList[n].da),
                        (v.lineDashOffset = this.stylesList[n]["do"]),
                        (this.globalData.isDashed = !0))
                      : this.globalData.isDashed &&
                        (v.setLineDash(this.dashResetter),
                        (this.globalData.isDashed = !1))),
                    m = d[p].trNodes,
                    u = m.length,
                    f = 0;
                  u > f;
                  f += 1
                )
                  "m" == m[f].t
                    ? v.moveTo(m[f].p[0], m[f].p[1])
                    : "c" == m[f].t
                    ? v.bezierCurveTo(
                        m[f].p1[0],
                        m[f].p1[1],
                        m[f].p2[0],
                        m[f].p2[1],
                        m[f].p3[0],
                        m[f].p3[1]
                      )
                    : v.closePath();
                "st" === y && v.stroke();
              }
              "st" !== y && v.fill(this.stylesList[n].r), g.restore();
            }
          g.restore(), this.firstFrame && (this.firstFrame = !1);
        }
      }),
      (CVShapeElement.prototype.renderPath = function (t, e, r) {
        var i,
          n,
          s,
          a,
          o = r.matMdf || e.sh.mdf || this.firstFrame;
        if (o) {
          var l = e.sh.paths;
          a = l._length;
          var h = e.trNodes;
          for (h.length = 0, s = 0; a > s; s += 1) {
            var p = l.shapes[s];
            if (p && p.v) {
              for (i = p._length, n = 1; i > n; n += 1)
                1 == n &&
                  h.push({
                    t: "m",
                    p: r.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0),
                  }),
                  h.push({
                    t: "c",
                    p1: r.mat.applyToPointArray(
                      p.o[n - 1][0],
                      p.o[n - 1][1],
                      0
                    ),
                    p2: r.mat.applyToPointArray(p.i[n][0], p.i[n][1], 0),
                    p3: r.mat.applyToPointArray(p.v[n][0], p.v[n][1], 0),
                  });
              1 == i &&
                h.push({
                  t: "m",
                  p: r.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0),
                }),
                p.c &&
                  i &&
                  (h.push({
                    t: "c",
                    p1: r.mat.applyToPointArray(
                      p.o[n - 1][0],
                      p.o[n - 1][1],
                      0
                    ),
                    p2: r.mat.applyToPointArray(p.i[0][0], p.i[0][1], 0),
                    p3: r.mat.applyToPointArray(p.v[0][0], p.v[0][1], 0),
                  }),
                  h.push({ t: "z" })),
                (e.lStr = h);
            }
          }
          if (e.st) for (n = 0; 16 > n; n += 1) e.tr[n] = r.mat.props[n];
          e.trNodes = h;
        }
      }),
      (CVShapeElement.prototype.renderFill = function (t, e, r) {
        var i = e.style;
        (e.c.mdf || this.firstFrame) &&
          (i.co =
            "rgb(" +
            bm_floor(e.c.v[0]) +
            "," +
            bm_floor(e.c.v[1]) +
            "," +
            bm_floor(e.c.v[2]) +
            ")"),
          (e.o.mdf || r.opMdf || this.firstFrame) &&
            (i.coOp = e.o.v * r.opacity);
      }),
      (CVShapeElement.prototype.renderStroke = function (t, e, r) {
        var i = e.style,
          n = e.d;
        n &&
          (n.mdf || this.firstFrame) &&
          ((i.da = n.dasharray), (i["do"] = n.dashoffset)),
          (e.c.mdf || this.firstFrame) &&
            (i.co =
              "rgb(" +
              bm_floor(e.c.v[0]) +
              "," +
              bm_floor(e.c.v[1]) +
              "," +
              bm_floor(e.c.v[2]) +
              ")"),
          (e.o.mdf || r.opMdf || this.firstFrame) &&
            (i.coOp = e.o.v * r.opacity),
          (e.w.mdf || this.firstFrame) && (i.wi = e.w.v);
      }),
      (CVShapeElement.prototype.destroy = function () {
        (this.shapesData = null),
          (this.globalData = null),
          (this.canvasContext = null),
          (this.stylesList.length = 0),
          (this.viewData.length = 0),
          this._parent.destroy.call(this._parent);
      }),
      createElement(CVBaseElement, CVSolidElement),
      (CVSolidElement.prototype.renderFrame = function (t) {
        if (this._parent.renderFrame.call(this, t) !== !1) {
          var e = this.canvasContext;
          this.globalData.renderer.save(),
            this.globalData.renderer.ctxTransform(
              this.finalTransform.mat.props
            ),
            this.globalData.renderer.ctxOpacity(this.finalTransform.opacity),
            (e.fillStyle = this.data.sc),
            e.fillRect(0, 0, this.data.sw, this.data.sh),
            this.globalData.renderer.restore(this.data.hasMask),
            this.firstFrame && (this.firstFrame = !1);
        }
      }),
      createElement(CVBaseElement, CVTextElement),
      (CVTextElement.prototype.init = ITextElement.prototype.init),
      (CVTextElement.prototype.getMeasures =
        ITextElement.prototype.getMeasures),
      (CVTextElement.prototype.getMult = ITextElement.prototype.getMult),
      (CVTextElement.prototype.prepareFrame =
        ITextElement.prototype.prepareFrame),
      (CVTextElement.prototype.tHelper = document
        .createElement("canvas")
        .getContext("2d")),
      (CVTextElement.prototype.createElements = function () {
        this._parent.createElements.call(this);
      }),
      (CVTextElement.prototype.buildNewText = function () {
        var t = this.currentTextDocumentData;
        this.renderedLetters = Array.apply(null, {
          length: this.currentTextDocumentData.l
            ? this.currentTextDocumentData.l.length
            : 0,
        });
        var e = !1;
        t.fc
          ? ((e = !0),
            (this.values.fill =
              "rgb(" +
              Math.round(255 * t.fc[0]) +
              "," +
              Math.round(255 * t.fc[1]) +
              "," +
              Math.round(255 * t.fc[2]) +
              ")"))
          : (this.values.fill = "rgba(0,0,0,0)"),
          (this.fill = e);
        var r = !1;
        t.sc &&
          ((r = !0),
          (this.values.stroke =
            "rgb(" +
            Math.round(255 * t.sc[0]) +
            "," +
            Math.round(255 * t.sc[1]) +
            "," +
            Math.round(255 * t.sc[2]) +
            ")"),
          (this.values.sWidth = t.sw));
        var i,
          n,
          s = this.globalData.fontManager.getFontByName(t.f),
          a = t.l,
          o = this.mHelper;
        (this.stroke = r),
          (this.values.fValue =
            t.s +
            "px " +
            this.globalData.fontManager.getFontByName(t.f).fFamily),
          (n = t.t.length),
          (this.tHelper.font = this.values.fValue);
        var l,
          h,
          p,
          c,
          f,
          u,
          d,
          m,
          y,
          g,
          v = this.data.singleShape;
        if (v)
          var b = 0,
            x = 0,
            E = t.lineWidths,
            w = t.boxWidth,
            P = !0;
        var S = 0;
        for (i = 0; n > i; i += 1) {
          l = this.globalData.fontManager.getCharData(
            t.t.charAt(i),
            s.fStyle,
            this.globalData.fontManager.getFontByName(t.f).fFamily
          );
          var h;
          if (
            ((h = l ? l.data : null),
            o.reset(),
            v &&
              a[i].n &&
              ((b = 0), (x += t.yOffset), (x += P ? 1 : 0), (P = !1)),
            h && h.shapes)
          ) {
            if (
              ((f = h.shapes[0].it),
              (d = f.length),
              o.scale(t.s / 100, t.s / 100),
              v)
            ) {
              switch (
                (t.ps && o.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                o.translate(0, -t.ls, 0),
                t.j)
              ) {
                case 1:
                  o.translate(t.justifyOffset + (w - E[a[i].line]), 0, 0);
                  break;
                case 2:
                  o.translate(t.justifyOffset + (w - E[a[i].line]) / 2, 0, 0);
              }
              o.translate(b, x, 0);
            }
            for (y = new Array(d), u = 0; d > u; u += 1) {
              for (
                c = f[u].ks.k.i.length, m = f[u].ks.k, g = [], p = 1;
                c > p;
                p += 1
              )
                1 == p &&
                  g.push(
                    o.applyToX(m.v[0][0], m.v[0][1], 0),
                    o.applyToY(m.v[0][0], m.v[0][1], 0)
                  ),
                  g.push(
                    o.applyToX(m.o[p - 1][0], m.o[p - 1][1], 0),
                    o.applyToY(m.o[p - 1][0], m.o[p - 1][1], 0),
                    o.applyToX(m.i[p][0], m.i[p][1], 0),
                    o.applyToY(m.i[p][0], m.i[p][1], 0),
                    o.applyToX(m.v[p][0], m.v[p][1], 0),
                    o.applyToY(m.v[p][0], m.v[p][1], 0)
                  );
              g.push(
                o.applyToX(m.o[p - 1][0], m.o[p - 1][1], 0),
                o.applyToY(m.o[p - 1][0], m.o[p - 1][1], 0),
                o.applyToX(m.i[0][0], m.i[0][1], 0),
                o.applyToY(m.i[0][0], m.i[0][1], 0),
                o.applyToX(m.v[0][0], m.v[0][1], 0),
                o.applyToY(m.v[0][0], m.v[0][1], 0)
              ),
                (y[u] = g);
            }
          } else y = [];
          v && (b += a[i].l),
            this.textSpans[S]
              ? (this.textSpans[S].elem = y)
              : (this.textSpans[S] = { elem: y }),
            (S += 1);
        }
      }),
      (CVTextElement.prototype.renderFrame = function (t) {
        if (this._parent.renderFrame.call(this, t) !== !1) {
          var e = this.canvasContext,
            r = this.finalTransform.mat.props;
          this.globalData.renderer.save(),
            this.globalData.renderer.ctxTransform(r),
            this.globalData.renderer.ctxOpacity(this.finalTransform.opacity),
            (e.font = this.values.fValue),
            (e.lineCap = "butt"),
            (e.lineJoin = "miter"),
            (e.miterLimit = 4),
            this.data.singleShape || this.getMeasures();
          var i,
            n,
            s,
            a,
            o,
            l,
            h = this.renderedLetters,
            p = this.currentTextDocumentData.l;
          n = p.length;
          var c,
            f,
            u,
            d = null,
            m = null,
            y = null;
          for (i = 0; n > i; i += 1)
            if (!p[i].n) {
              if (
                ((c = h[i]),
                c &&
                  (this.globalData.renderer.save(),
                  this.globalData.renderer.ctxTransform(c.props),
                  this.globalData.renderer.ctxOpacity(c.o)),
                this.fill)
              ) {
                for (
                  c && c.fc
                    ? d !== c.fc && ((d = c.fc), (e.fillStyle = c.fc))
                    : d !== this.values.fill &&
                      ((d = this.values.fill),
                      (e.fillStyle = this.values.fill)),
                    f = this.textSpans[i].elem,
                    a = f.length,
                    this.globalData.canvasContext.beginPath(),
                    s = 0;
                  a > s;
                  s += 1
                )
                  for (
                    u = f[s],
                      l = u.length,
                      this.globalData.canvasContext.moveTo(u[0], u[1]),
                      o = 2;
                    l > o;
                    o += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      u[o],
                      u[o + 1],
                      u[o + 2],
                      u[o + 3],
                      u[o + 4],
                      u[o + 5]
                    );
                this.globalData.canvasContext.closePath(),
                  this.globalData.canvasContext.fill();
              }
              if (this.stroke) {
                for (
                  c && c.sw
                    ? y !== c.sw && ((y = c.sw), (e.lineWidth = c.sw))
                    : y !== this.values.sWidth &&
                      ((y = this.values.sWidth),
                      (e.lineWidth = this.values.sWidth)),
                    c && c.sc
                      ? m !== c.sc && ((m = c.sc), (e.strokeStyle = c.sc))
                      : m !== this.values.stroke &&
                        ((m = this.values.stroke),
                        (e.strokeStyle = this.values.stroke)),
                    f = this.textSpans[i].elem,
                    a = f.length,
                    this.globalData.canvasContext.beginPath(),
                    s = 0;
                  a > s;
                  s += 1
                )
                  for (
                    u = f[s],
                      l = u.length,
                      this.globalData.canvasContext.moveTo(u[0], u[1]),
                      o = 2;
                    l > o;
                    o += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      u[o],
                      u[o + 1],
                      u[o + 2],
                      u[o + 3],
                      u[o + 4],
                      u[o + 5]
                    );
                this.globalData.canvasContext.closePath(),
                  this.globalData.canvasContext.stroke();
              }
              c && this.globalData.renderer.restore();
            }
          this.globalData.renderer.restore(this.data.hasMask),
            this.firstFrame && (this.firstFrame = !1);
        }
      }),
      createElement(BaseElement, HBaseElement),
      (HBaseElement.prototype.checkBlendMode = function () {}),
      (HBaseElement.prototype.setBlendMode =
        BaseElement.prototype.setBlendMode),
      (HBaseElement.prototype.getBaseElement = function () {
        return this.baseElement;
      }),
      (HBaseElement.prototype.createElements = function () {
        this.data.hasMask
          ? ((this.layerElement = document.createElementNS(svgNS, "svg")),
            styleDiv(this.layerElement),
            (this.baseElement = this.layerElement),
            (this.maskedElement = this.layerElement))
          : (this.layerElement = this.parentContainer),
          (this.transformedElement = this.layerElement),
          !this.data.ln ||
            (4 !== this.data.ty && 0 !== this.data.ty) ||
            (this.layerElement === this.parentContainer &&
              ((this.layerElement = document.createElementNS(svgNS, "g")),
              (this.baseElement = this.layerElement)),
            this.layerElement.setAttribute("id", this.data.ln)),
          this.setBlendMode(),
          this.layerElement !== this.parentContainer &&
            (this.placeholder = null),
          this.checkParenting();
      }),
      (HBaseElement.prototype.renderFrame = function (t) {
        if (3 === this.data.ty) return !1;
        if (this.currentFrameNum === this.lastNum || !this.isVisible)
          return this.isVisible;
        (this.lastNum = this.currentFrameNum),
          (this.finalTransform.opMdf = this.finalTransform.op.mdf),
          (this.finalTransform.matMdf = this.finalTransform.mProp.mdf),
          (this.finalTransform.opacity = this.finalTransform.op.v),
          this.firstFrame &&
            ((this.finalTransform.opMdf = !0),
            (this.finalTransform.matMdf = !0));
        var e,
          r = this.finalTransform.mat;
        if (this.hierarchy) {
          var i,
            n = this.hierarchy.length;
          for (
            e = this.finalTransform.mProp.v.props, r.cloneFromProps(e), i = 0;
            n > i;
            i += 1
          )
            (this.finalTransform.matMdf = this.hierarchy[i].finalTransform.mProp
              .mdf
              ? !0
              : this.finalTransform.matMdf),
              (e = this.hierarchy[i].finalTransform.mProp.v.props),
              r.transform(
                e[0],
                e[1],
                e[2],
                e[3],
                e[4],
                e[5],
                e[6],
                e[7],
                e[8],
                e[9],
                e[10],
                e[11],
                e[12],
                e[13],
                e[14],
                e[15]
              );
        } else
          this.isVisible &&
            this.finalTransform.matMdf &&
            (t
              ? ((e = this.finalTransform.mProp.v.props), r.cloneFromProps(e))
              : r.cloneFromProps(this.finalTransform.mProp.v.props));
        return (
          this.data.hasMask && this.maskManager.renderFrame(r),
          t &&
            ((e = t.mat.props),
            r.cloneFromProps(e),
            (this.finalTransform.opacity *= t.opacity),
            (this.finalTransform.opMdf = t.opMdf
              ? !0
              : this.finalTransform.opMdf),
            (this.finalTransform.matMdf = t.matMdf
              ? !0
              : this.finalTransform.matMdf)),
          this.finalTransform.matMdf &&
            ((this.transformedElement.style.transform =
              this.transformedElement.style.webkitTransform =
                r.toCSS()),
            (this.finalMat = r)),
          this.finalTransform.opMdf &&
            (this.transformedElement.style.opacity =
              this.finalTransform.opacity),
          this.isVisible
        );
      }),
      (HBaseElement.prototype.destroy = function () {
        (this.layerElement = null),
          (this.transformedElement = null),
          (this.parentContainer = null),
          this.matteElement && (this.matteElement = null),
          this.maskManager &&
            (this.maskManager.destroy(), (this.maskManager = null));
      }),
      (HBaseElement.prototype.getDomElement = function () {
        return this.layerElement;
      }),
      (HBaseElement.prototype.addMasks = function (t) {
        this.maskManager = new MaskElement(t, this, this.globalData);
      }),
      (HBaseElement.prototype.hide = function () {}),
      (HBaseElement.prototype.setMatte = function () {}),
      (HBaseElement.prototype.buildElementParenting =
        HybridRenderer.prototype.buildElementParenting),
      createElement(HBaseElement, HSolidElement),
      (HSolidElement.prototype.createElements = function () {
        var t = document.createElement("div");
        styleDiv(t);
        var e = document.createElementNS(svgNS, "svg");
        styleDiv(e),
          e.setAttribute("width", this.data.sw),
          e.setAttribute("height", this.data.sh),
          t.appendChild(e),
          (this.layerElement = t),
          (this.transformedElement = t),
          (this.baseElement = t),
          (this.innerElem = t),
          this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
          0 !== this.data.bm && this.setBlendMode();
        var r = document.createElementNS(svgNS, "rect");
        r.setAttribute("width", this.data.sw),
          r.setAttribute("height", this.data.sh),
          r.setAttribute("fill", this.data.sc),
          e.appendChild(r),
          this.data.hasMask && (this.maskedElement = r),
          this.checkParenting();
      }),
      (HSolidElement.prototype.hide = IImageElement.prototype.hide),
      (HSolidElement.prototype.renderFrame =
        IImageElement.prototype.renderFrame),
      (HSolidElement.prototype.destroy = IImageElement.prototype.destroy),
      createElement(HBaseElement, HCompElement),
      (HCompElement.prototype.createElements = function () {
        var t = document.createElement("div");
        if (
          (styleDiv(t),
          this.data.ln && t.setAttribute("id", this.data.ln),
          (t.style.clip =
            "rect(0px, " + this.data.w + "px, " + this.data.h + "px, 0px)"),
          this.data.hasMask)
        ) {
          var e = document.createElementNS(svgNS, "svg");
          styleDiv(e),
            e.setAttribute("width", this.data.w),
            e.setAttribute("height", this.data.h);
          var r = document.createElementNS(svgNS, "g");
          e.appendChild(r),
            t.appendChild(e),
            (this.maskedElement = r),
            (this.baseElement = t),
            (this.layerElement = r),
            (this.transformedElement = t);
        } else
          (this.layerElement = t),
            (this.baseElement = this.layerElement),
            (this.transformedElement = t);
        this.checkParenting();
      }),
      (HCompElement.prototype.hide = ICompElement.prototype.hide),
      (HCompElement.prototype.prepareFrame =
        ICompElement.prototype.prepareFrame),
      (HCompElement.prototype.setElements = ICompElement.prototype.setElements),
      (HCompElement.prototype.getElements = ICompElement.prototype.getElements),
      (HCompElement.prototype.destroy = ICompElement.prototype.destroy),
      (HCompElement.prototype.renderFrame = function (t) {
        var e,
          r = this._parent.renderFrame.call(this, t),
          i = this.layers.length;
        if (r === !1) return void this.hide();
        for (this.hidden = !1, e = 0; i > e; e += 1)
          (this.completeLayers || this.elements[e]) &&
            this.elements[e].renderFrame();
        this.firstFrame && (this.firstFrame = !1);
      }),
      (HCompElement.prototype.checkLayers = BaseRenderer.prototype.checkLayers),
      (HCompElement.prototype.buildItem = HybridRenderer.prototype.buildItem),
      (HCompElement.prototype.checkPendingElements =
        HybridRenderer.prototype.checkPendingElements),
      (HCompElement.prototype.addPendingElement =
        HybridRenderer.prototype.addPendingElement),
      (HCompElement.prototype.buildAllItems =
        BaseRenderer.prototype.buildAllItems),
      (HCompElement.prototype.createItem = HybridRenderer.prototype.createItem),
      (HCompElement.prototype.buildElementParenting =
        HybridRenderer.prototype.buildElementParenting),
      (HCompElement.prototype.createImage =
        HybridRenderer.prototype.createImage),
      (HCompElement.prototype.createComp = HybridRenderer.prototype.createComp),
      (HCompElement.prototype.createSolid =
        HybridRenderer.prototype.createSolid),
      (HCompElement.prototype.createShape =
        HybridRenderer.prototype.createShape),
      (HCompElement.prototype.createText = HybridRenderer.prototype.createText),
      (HCompElement.prototype.createBase = HybridRenderer.prototype.createBase),
      (HCompElement.prototype.appendElementInPos =
        HybridRenderer.prototype.appendElementInPos),
      createElement(HBaseElement, HShapeElement);
    var parent = HShapeElement.prototype._parent;
    extendPrototype(IShapeElement, HShapeElement),
      (HShapeElement.prototype._parent = parent),
      (HShapeElement.prototype.createElements = function () {
        var t = document.createElement("div");
        styleDiv(t);
        var e = document.createElementNS(svgNS, "svg");
        styleDiv(e);
        var r = this.comp.data ? this.comp.data : this.globalData.compSize;
        if (
          (e.setAttribute("width", r.w),
          e.setAttribute("height", r.h),
          this.data.hasMask)
        ) {
          var i = document.createElementNS(svgNS, "g");
          t.appendChild(e),
            e.appendChild(i),
            (this.maskedElement = i),
            (this.layerElement = i),
            (this.shapesContainer = i);
        } else
          t.appendChild(e),
            (this.layerElement = e),
            (this.shapesContainer = document.createElementNS(svgNS, "g")),
            this.layerElement.appendChild(this.shapesContainer);
        this.data.hd || (this.baseElement = t),
          (this.innerElem = t),
          this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
          this.searchShapes(
            this.shapesData,
            this.viewData,
            this.layerElement,
            this.dynamicProperties,
            0
          ),
          this.buildExpressionInterface(),
          (this.layerElement = t),
          (this.transformedElement = t),
          (this.shapeCont = e),
          0 !== this.data.bm && this.setBlendMode(),
          this.checkParenting();
      }),
      (HShapeElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        if (e === !1) return void this.hide();
        if (
          (this.hidden &&
            ((this.layerElement.style.display = "block"), (this.hidden = !1)),
          this.renderModifiers(),
          (this.addedTransforms.mdf = this.finalTransform.matMdf),
          (this.addedTransforms.mats.length = 1),
          (this.addedTransforms.mats[0] = this.finalTransform.mat),
          this.renderShape(null, null, !0, null),
          this.isVisible && (this.elemMdf || this.firstFrame))
        ) {
          var r = this.shapeCont.getBBox(),
            i = !1;
          this.currentBBox.w !== r.width &&
            ((this.currentBBox.w = r.width),
            this.shapeCont.setAttribute("width", r.width),
            (i = !0)),
            this.currentBBox.h !== r.height &&
              ((this.currentBBox.h = r.height),
              this.shapeCont.setAttribute("height", r.height),
              (i = !0)),
            (i || this.currentBBox.x !== r.x || this.currentBBox.y !== r.y) &&
              ((this.currentBBox.w = r.width),
              (this.currentBBox.h = r.height),
              (this.currentBBox.x = r.x),
              (this.currentBBox.y = r.y),
              this.shapeCont.setAttribute(
                "viewBox",
                this.currentBBox.x +
                  " " +
                  this.currentBBox.y +
                  " " +
                  this.currentBBox.w +
                  " " +
                  this.currentBBox.h
              ),
              (this.shapeCont.style.transform =
                this.shapeCont.style.webkitTransform =
                  "translate(" +
                  this.currentBBox.x +
                  "px," +
                  this.currentBBox.y +
                  "px)"));
        }
      }),
      createElement(HBaseElement, HTextElement),
      (HTextElement.prototype.init = ITextElement.prototype.init),
      (HTextElement.prototype.getMeasures = ITextElement.prototype.getMeasures),
      (HTextElement.prototype.createPathShape =
        ITextElement.prototype.createPathShape),
      (HTextElement.prototype.prepareFrame =
        ITextElement.prototype.prepareFrame),
      (HTextElement.prototype.createElements = function () {
        this.isMasked = this.checkMasks();
        var t = document.createElement("div");
        if (
          (styleDiv(t),
          (this.layerElement = t),
          (this.transformedElement = t),
          this.isMasked)
        ) {
          this.renderType = "svg";
          var e = document.createElementNS(svgNS, "svg");
          styleDiv(e),
            (this.cont = e),
            (this.compW = this.comp.data.w),
            (this.compH = this.comp.data.h),
            e.setAttribute("width", this.compW),
            e.setAttribute("height", this.compH);
          var r = document.createElementNS(svgNS, "g");
          e.appendChild(r),
            t.appendChild(e),
            (this.maskedElement = r),
            (this.innerElem = r);
        } else (this.renderType = "html"), (this.innerElem = t);
        (this.baseElement = t), this.checkParenting();
      }),
      (HTextElement.prototype.buildNewText = function () {
        var t = this.currentTextDocumentData;
        (this.renderedLetters = Array.apply(null, {
          length: this.currentTextDocumentData.l
            ? this.currentTextDocumentData.l.length
            : 0,
        })),
          (this.innerElem.style.color = this.innerElem.style.fill =
            t.fc
              ? "rgb(" +
                Math.round(255 * t.fc[0]) +
                "," +
                Math.round(255 * t.fc[1]) +
                "," +
                Math.round(255 * t.fc[2]) +
                ")"
              : "rgba(0,0,0,0)"),
          t.sc &&
            ((this.innerElem.style.stroke =
              "rgb(" +
              Math.round(255 * t.sc[0]) +
              "," +
              Math.round(255 * t.sc[1]) +
              "," +
              Math.round(255 * t.sc[2]) +
              ")"),
            (this.innerElem.style.strokeWidth = t.sw + "px"));
        var e = this.globalData.fontManager.getFontByName(t.f);
        if (!this.globalData.fontManager.chars)
          if (
            ((this.innerElem.style.fontSize = t.s + "px"),
            (this.innerElem.style.lineHeight = t.s + "px"),
            e.fClass)
          )
            this.innerElem.className = e.fClass;
          else {
            this.innerElem.style.fontFamily = e.fFamily;
            var r = t.fWeight,
              i = t.fStyle;
            (this.innerElem.style.fontStyle = i),
              (this.innerElem.style.fontWeight = r);
          }
        var n,
          s,
          a = t.l;
        s = a.length;
        var o,
          l,
          h,
          p,
          c = this.mHelper,
          f = "",
          u = 0;
        for (n = 0; s > n; n += 1) {
          if (
            (this.globalData.fontManager.chars
              ? (this.textPaths[u]
                  ? (o = this.textPaths[u])
                  : ((o = document.createElementNS(svgNS, "path")),
                    o.setAttribute("stroke-linecap", "butt"),
                    o.setAttribute("stroke-linejoin", "round"),
                    o.setAttribute("stroke-miterlimit", "4")),
                this.isMasked ||
                  (this.textSpans[u]
                    ? ((l = this.textSpans[u]), (h = l.children[0]))
                    : ((l = document.createElement("div")),
                      (h = document.createElementNS(svgNS, "svg")),
                      h.appendChild(o),
                      styleDiv(l))))
              : this.isMasked
              ? (o = this.textPaths[u]
                  ? this.textPaths[u]
                  : document.createElementNS(svgNS, "text"))
              : this.textSpans[u]
              ? ((l = this.textSpans[u]), (o = this.textPaths[u]))
              : ((l = document.createElement("span")),
                styleDiv(l),
                (o = document.createElement("span")),
                styleDiv(o),
                l.appendChild(o)),
            this.globalData.fontManager.chars)
          ) {
            var d,
              m = this.globalData.fontManager.getCharData(
                t.t.charAt(n),
                e.fStyle,
                this.globalData.fontManager.getFontByName(t.f).fFamily
              );
            if (
              ((d = m ? m.data : null),
              c.reset(),
              d &&
                d.shapes &&
                ((p = d.shapes[0].it),
                c.scale(t.s / 100, t.s / 100),
                (f = this.createPathShape(c, p)),
                o.setAttribute("d", f)),
              this.isMasked)
            )
              this.innerElem.appendChild(o);
            else if ((this.innerElem.appendChild(l), d && d.shapes)) {
              document.body.appendChild(h);
              var y = h.getBBox();
              h.setAttribute("width", y.width),
                h.setAttribute("height", y.height),
                h.setAttribute(
                  "viewBox",
                  y.x + " " + y.y + " " + y.width + " " + y.height
                ),
                (h.style.transform = h.style.webkitTransform =
                  "translate(" + y.x + "px," + y.y + "px)"),
                (a[n].yOffset = y.y),
                l.appendChild(h);
            } else h.setAttribute("width", 1), h.setAttribute("height", 1);
          } else
            (o.textContent = a[n].val),
              o.setAttributeNS(
                "http://www.w3.org/XML/1998/namespace",
                "xml:space",
                "preserve"
              ),
              this.isMasked
                ? this.innerElem.appendChild(o)
                : (this.innerElem.appendChild(l),
                  (o.style.transform = o.style.webkitTransform =
                    "translate3d(0," + -t.s / 1.2 + "px,0)"));
          (this.textSpans[u] = this.isMasked ? o : l),
            (this.textSpans[u].style.display = "block"),
            (this.textPaths[u] = o),
            (u += 1);
        }
        for (; u < this.textSpans.length; )
          (this.textSpans[u].style.display = "none"), (u += 1);
      }),
      (HTextElement.prototype.hide = SVGTextElement.prototype.hide),
      (HTextElement.prototype.renderFrame = function (t) {
        var e = this._parent.renderFrame.call(this, t);
        if (e === !1) return void this.hide();
        if (
          (this.hidden &&
            ((this.hidden = !1),
            (this.innerElem.style.display = "block"),
            (this.layerElement.style.display = "block")),
          this.data.singleShape)
        ) {
          if (!this.firstFrame && !this.lettersChangedFlag) return;
          this.isMasked &&
            this.finalTransform.matMdf &&
            (this.cont.setAttribute(
              "viewBox",
              -this.finalTransform.mProp.p.v[0] +
                " " +
                -this.finalTransform.mProp.p.v[1] +
                " " +
                this.compW +
                " " +
                this.compH
            ),
            (this.cont.style.transform = this.cont.style.webkitTransform =
              "translate(" +
              -this.finalTransform.mProp.p.v[0] +
              "px," +
              -this.finalTransform.mProp.p.v[1] +
              "px)"));
        }
        if ((this.getMeasures(), this.lettersChangedFlag)) {
          var r,
            i,
            n = this.renderedLetters,
            s = this.currentTextDocumentData.l;
          i = s.length;
          var a;
          for (r = 0; i > r; r += 1)
            s[r].n ||
              ((a = n[r]),
              this.isMasked
                ? this.textSpans[r].setAttribute("transform", a.m)
                : (this.textSpans[r].style.transform = this.textSpans[
                    r
                  ].style.webkitTransform =
                    a.m),
              (this.textSpans[r].style.opacity = a.o),
              a.sw && this.textPaths[r].setAttribute("stroke-width", a.sw),
              a.sc && this.textPaths[r].setAttribute("stroke", a.sc),
              a.fc &&
                (this.textPaths[r].setAttribute("fill", a.fc),
                (this.textPaths[r].style.color = a.fc)));
          if (
            this.isVisible &&
            (this.elemMdf || this.firstFrame) &&
            this.innerElem.getBBox
          ) {
            var o = this.innerElem.getBBox();
            this.currentBBox.w !== o.width &&
              ((this.currentBBox.w = o.width),
              this.cont.setAttribute("width", o.width)),
              this.currentBBox.h !== o.height &&
                ((this.currentBBox.h = o.height),
                this.cont.setAttribute("height", o.height)),
              (this.currentBBox.w !== o.width ||
                this.currentBBox.h !== o.height ||
                this.currentBBox.x !== o.x ||
                this.currentBBox.y !== o.y) &&
                ((this.currentBBox.w = o.width),
                (this.currentBBox.h = o.height),
                (this.currentBBox.x = o.x),
                (this.currentBBox.y = o.y),
                this.cont.setAttribute(
                  "viewBox",
                  this.currentBBox.x +
                    " " +
                    this.currentBBox.y +
                    " " +
                    this.currentBBox.w +
                    " " +
                    this.currentBBox.h
                ),
                (this.cont.style.transform = this.cont.style.webkitTransform =
                  "translate(" +
                  this.currentBBox.x +
                  "px," +
                  this.currentBBox.y +
                  "px)"));
          }
          this.firstFrame && (this.firstFrame = !1);
        }
      }),
      (HTextElement.prototype.destroy = SVGTextElement.prototype.destroy),
      createElement(HBaseElement, HImageElement),
      (HImageElement.prototype.createElements = function () {
        var t = this.globalData.getAssetsPath(this.assetData),
          e = new Image();
        if (this.data.hasMask) {
          var r = document.createElement("div");
          styleDiv(r);
          var i = document.createElementNS(svgNS, "svg");
          styleDiv(i),
            i.setAttribute("width", this.assetData.w),
            i.setAttribute("height", this.assetData.h),
            r.appendChild(i),
            (this.imageElem = document.createElementNS(svgNS, "image")),
            this.imageElem.setAttribute("width", this.assetData.w + "px"),
            this.imageElem.setAttribute("height", this.assetData.h + "px"),
            this.imageElem.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "href",
              t
            ),
            i.appendChild(this.imageElem),
            (this.layerElement = r),
            (this.transformedElement = r),
            (this.baseElement = r),
            (this.innerElem = r),
            (this.maskedElement = this.imageElem);
        } else
          styleDiv(e),
            (this.layerElement = e),
            (this.baseElement = e),
            (this.innerElem = e),
            (this.transformedElement = e);
        (e.src = t),
          this.data.ln && this.innerElem.setAttribute("id", this.data.ln),
          this.checkParenting();
      }),
      (HImageElement.prototype.hide = HSolidElement.prototype.hide),
      (HImageElement.prototype.renderFrame =
        HSolidElement.prototype.renderFrame),
      (HImageElement.prototype.destroy = HSolidElement.prototype.destroy),
      createElement(HBaseElement, HCameraElement),
      (HCameraElement.prototype.setup = function () {
        var t,
          e,
          r = this.comp.threeDElements.length;
        for (t = 0; r > t; t += 1)
          (e = this.comp.threeDElements[t]),
            (e.perspectiveElem.style.perspective =
              e.perspectiveElem.style.webkitPerspective =
                this.pe.v + "px"),
            (e.container.style.transformOrigin =
              e.container.style.mozTransformOrigin =
              e.container.style.webkitTransformOrigin =
                "0px 0px 0px"),
            (e.perspectiveElem.style.transform =
              e.perspectiveElem.style.webkitTransform =
                "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)");
      }),
      (HCameraElement.prototype.createElements = function () {}),
      (HCameraElement.prototype.hide = function () {}),
      (HCameraElement.prototype.renderFrame = function () {
        var t,
          e,
          r = this.firstFrame;
        if (this.hierarchy)
          for (e = this.hierarchy.length, t = 0; e > t; t += 1)
            r = this.hierarchy[t].finalTransform.mProp.mdf ? !0 : r;
        if (
          r ||
          (this.p && this.p.mdf) ||
          (this.px && (this.px.mdf || this.py.mdf || this.pz.mdf)) ||
          this.rx.mdf ||
          this.ry.mdf ||
          this.rz.mdf ||
          this.or.mdf ||
          (this.a && this.a.mdf)
        ) {
          if (
            (this.mat.reset(),
            this.p
              ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
              : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
            this.a)
          ) {
            var i = [
                this.p.v[0] - this.a.v[0],
                this.p.v[1] - this.a.v[1],
                this.p.v[2] - this.a.v[2],
              ],
              n = Math.sqrt(
                Math.pow(i[0], 2) + Math.pow(i[1], 2) + Math.pow(i[2], 2)
              ),
              s = [i[0] / n, i[1] / n, i[2] / n],
              a = Math.sqrt(s[2] * s[2] + s[0] * s[0]),
              o = Math.atan2(s[1], a),
              l = Math.atan2(s[0], -s[2]);
            this.mat.rotateY(l).rotateX(-o);
          }
          if (
            (this.mat
              .rotateX(-this.rx.v)
              .rotateY(-this.ry.v)
              .rotateZ(this.rz.v),
            this.mat
              .rotateX(-this.or.v[0])
              .rotateY(-this.or.v[1])
              .rotateZ(this.or.v[2]),
            this.mat.translate(
              this.globalData.compSize.w / 2,
              this.globalData.compSize.h / 2,
              0
            ),
            this.mat.translate(0, 0, this.pe.v),
            this.hierarchy)
          ) {
            var h;
            for (e = this.hierarchy.length, t = 0; e > t; t += 1)
              (h = this.hierarchy[t].finalTransform.mProp.iv.props),
                this.mat.transform(
                  h[0],
                  h[1],
                  h[2],
                  h[3],
                  h[4],
                  h[5],
                  h[6],
                  h[7],
                  h[8],
                  h[9],
                  h[10],
                  h[11],
                  -h[12],
                  -h[13],
                  h[14],
                  h[15]
                );
          }
          e = this.comp.threeDElements.length;
          var p;
          for (t = 0; e > t; t += 1)
            (p = this.comp.threeDElements[t]),
              (p.container.style.transform = p.container.style.webkitTransform =
                this.mat.toCSS());
        }
        this.firstFrame = !1;
      }),
      (HCameraElement.prototype.destroy = function () {});
    var Expressions = (function () {
      function t(t) {
        (t.renderer.compInterface = CompExpressionInterface(t.renderer)),
          t.renderer.globalData.projectInterface.registerComposition(
            t.renderer
          );
      }
      var e = {};
      return (e.initExpressions = t), e;
    })();
    (expressionsPlugin = Expressions),
      (function () {
        function t() {
          return this.pv;
        }
        function e(t, e) {
          t *= this.elem.globalData.frameRate;
          var r,
            i,
            n = 0,
            s = this.keyframes.length - 1,
            a = 1,
            o = !0;
          e = void 0 === e ? this.offsetTime : 0;
          for (var l = "object" == typeof this.pv ? [this.pv.length] : 0; o; ) {
            if (
              ((r = this.keyframes[n]),
              (i = this.keyframes[n + 1]),
              n == s - 1 && t >= i.t - e)
            ) {
              r.h && (r = i);
              break;
            }
            if (i.t - e > t) break;
            s - 1 > n ? (n += a) : (o = !1);
          }
          var h,
            p,
            c,
            f,
            u,
            d = 0;
          if (r.to) {
            r.bezierData || bez.buildBezierData(r);
            var m = r.bezierData;
            if (t >= i.t - e || t < r.t - e) {
              var y = t >= i.t - e ? m.points.length - 1 : 0;
              for (p = m.points[y].point.length, h = 0; p > h; h += 1)
                l[h] = m.points[y].point[h];
            } else {
              r.__fnct
                ? (u = r.__fnct)
                : ((u = BezierFactory.getBezierEasing(
                    r.o.x,
                    r.o.y,
                    r.i.x,
                    r.i.y,
                    r.n
                  ).get),
                  (r.__fnct = u)),
                (c = u((t - (r.t - e)) / (i.t - e - (r.t - e))));
              var g,
                v = m.segmentLength * c,
                b = 0;
              for (a = 1, o = !0, f = m.points.length; o; ) {
                if (
                  ((b += m.points[d].partialLength * a),
                  0 === v || 0 === c || d == m.points.length - 1)
                ) {
                  for (p = m.points[d].point.length, h = 0; p > h; h += 1)
                    l[h] = m.points[d].point[h];
                  break;
                }
                if (v >= b && v < b + m.points[d + 1].partialLength) {
                  for (
                    g = (v - b) / m.points[d + 1].partialLength,
                      p = m.points[d].point.length,
                      h = 0;
                    p > h;
                    h += 1
                  )
                    l[h] =
                      m.points[d].point[h] +
                      (m.points[d + 1].point[h] - m.points[d].point[h]) * g;
                  break;
                }
                (f - 1 > d && 1 == a) || (d > 0 && -1 == a)
                  ? (d += a)
                  : (o = !1);
              }
            }
          } else {
            var x,
              E,
              w,
              P,
              S,
              C = !1;
            for (s = r.s.length, n = 0; s > n; n += 1) {
              if (
                (1 !== r.h &&
                  (r.o.x instanceof Array
                    ? ((C = !0),
                      r.__fnct || (r.__fnct = []),
                      r.__fnct[n] ||
                        ((x = r.o.x[n] || r.o.x[0]),
                        (E = r.o.y[n] || r.o.y[0]),
                        (w = r.i.x[n] || r.i.x[0]),
                        (P = r.i.y[n] || r.i.y[0])))
                    : ((C = !1),
                      r.__fnct ||
                        ((x = r.o.x), (E = r.o.y), (w = r.i.x), (P = r.i.y))),
                  C
                    ? r.__fnct[n]
                      ? (u = r.__fnct[n])
                      : ((u = BezierFactory.getBezierEasing(x, E, w, P).get),
                        (r.__fnct[n] = u))
                    : r.__fnct
                    ? (u = r.__fnct)
                    : ((u = BezierFactory.getBezierEasing(x, E, w, P).get),
                      (r.__fnct = u)),
                  (c =
                    t >= i.t - e
                      ? 1
                      : t < r.t - e
                      ? 0
                      : u((t - (r.t - e)) / (i.t - e - (r.t - e))))),
                this.sh && 1 !== r.h)
              ) {
                var k = r.s[n],
                  T = r.e[n];
                -180 > k - T ? (k += 360) : k - T > 180 && (k -= 360),
                  (S = k + (T - k) * c);
              } else S = 1 === r.h ? r.s[n] : r.s[n] + (r.e[n] - r.s[n]) * c;
              1 === s ? (l = S) : (l[n] = S);
            }
          }
          return l;
        }
        function r(t) {
          if (void 0 !== this.vel) return this.vel;
          var e,
            r = -0.01,
            i = this.getValueAtTime(t, 0),
            n = this.getValueAtTime(t + r, 0);
          if (i.length) {
            e = Array.apply(null, { length: i.length });
            var s;
            for (s = 0; s < i.length; s += 1) e[s] = (n[s] - i[s]) / r;
          } else e = (n - i) / r;
          return e;
        }
        function i(t) {
          this.propertyGroup = t;
        }
        function n(t, e, r) {
          e.x &&
            ((r.k = !0),
            (r.x = !0),
            r.getValue && (r.getPreValue = r.getValue),
            (r.getValue = ExpressionManager.initiateExpression.bind(r)(
              t,
              e,
              r
            )));
        }
        var s = (function () {
            function s(t, e) {
              return (
                (this.textIndex = t + 1),
                (this.textTotal = e),
                this.getValue(),
                this.v
              );
            }
            return function (a, o) {
              (this.pv = 1),
                (this.comp = a.comp),
                (this.elem = a),
                (this.mult = 0.01),
                (this.type = "textSelector"),
                (this.textTotal = o.totalChars),
                (this.selectorValue = 100),
                (this.lastValue = [1, 1, 1]),
                n.bind(this)(a, o, this),
                (this.getMult = s),
                (this.getVelocityAtTime = r),
                (this.getValueAtTime = this.kf ? e.bind(this) : t.bind(this)),
                (this.setGroupProperty = i);
            };
          })(),
          a = PropertyFactory.getProp;
        PropertyFactory.getProp = function (s, o, l, h, p) {
          var c = a(s, o, l, h, p);
          (c.getVelocityAtTime = r),
            (c.getValueAtTime = c.kf ? e.bind(c) : t.bind(c)),
            (c.setGroupProperty = i);
          var f = c.k;
          return (
            void 0 !== o.ix &&
              Object.defineProperty(c, "propertyIndex", {
                get: function () {
                  return o.ix;
                },
              }),
            n(s, o, c),
            !f && c.x && p.push(c),
            c
          );
        };
        var o = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (r, s, a, l, h) {
          var p = o(r, s, a, l, h);
          (p.setGroupProperty = i), (p.getValueAtTime = p.kf ? e : t);
          var c = p.k;
          return (
            void 0 !== s.ix &&
              Object.defineProperty(p, "propertyIndex", {
                get: function () {
                  return s.ix;
                },
              }),
            3 === a ? n(r, s.pt, p) : 4 === a && n(r, s.ks, p),
            !c && p.x && l.push(p),
            p
          );
        };
        var l = PropertyFactory.getTextSelectorProp;
        PropertyFactory.getTextSelectorProp = function (t, e, r) {
          return 1 === e.t ? new s(t, e, r) : l(t, e, r);
        };
      })();
    var ExpressionManager = (function () {
        function duplicatePropertyValue(t, e) {
          if (((e = e || 1), "number" == typeof t || t instanceof Number))
            return t * e;
          if (t.i) return JSON.parse(JSON.stringify(t));
          var r,
            i = Array.apply(null, { length: t.length }),
            n = t.length;
          for (r = 0; n > r; r += 1) i[r] = t[r] * e;
          return i;
        }
        function shapesEqual(t, e) {
          if (t._length !== e._length || t.c !== e.c) return !1;
          var r,
            i = t._length;
          for (r = 0; i > r; r += 1)
            if (
              t.v[r][0] !== e.v[r][0] ||
              t.v[r][1] !== e.v[r][1] ||
              t.o[r][0] !== e.o[r][0] ||
              t.o[r][1] !== e.o[r][1] ||
              t.i[r][0] !== e.i[r][0] ||
              t.i[r][1] !== e.i[r][1]
            )
              return !1;
          return !0;
        }
        function $bm_neg(t) {
          var e = typeof t;
          if ("number" === e || "boolean" === e || t instanceof Number)
            return -t;
          if (t.constructor === Array) {
            var r,
              i = t.length,
              n = [];
            for (r = 0; i > r; r += 1) n[r] = -t[r];
            return n;
          }
        }
        function sum(t, e) {
          var r = typeof t,
            i = typeof e;
          if ("string" === r || "string" === i) return t + e;
          if (
            ("number" === r ||
              "boolean" === r ||
              "string" === r ||
              t instanceof Number) &&
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              e instanceof Number)
          )
            return t + e;
          if (
            t.constructor === Array &&
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              e instanceof Number)
          )
            return (t[0] = t[0] + e), t;
          if (
            ("number" === r ||
              "boolean" === r ||
              "string" === r ||
              t instanceof Number) &&
            e.constructor === Array
          )
            return (e[0] = t + e[0]), e;
          if (t.constructor === Array && e.constructor === Array) {
            for (
              var n = 0, s = t.length, a = e.length, o = [];
              s > n || a > n;

            )
              (o[n] =
                "number" == typeof t[n] && "number" == typeof e[n]
                  ? t[n] + e[n]
                  : void 0 == e[n]
                  ? t[n]
                  : t[n] || e[n]),
                (n += 1);
            return o;
          }
          return 0;
        }
        function sub(t, e) {
          var r = typeof t,
            i = typeof e;
          if (
            ("number" === r ||
              "boolean" === r ||
              "string" === r ||
              t instanceof Number) &&
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              e instanceof Number)
          )
            return t - e;
          if (
            t.constructor === Array &&
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              e instanceof Number)
          )
            return (t[0] = t[0] - e), t;
          if (
            ("number" === r ||
              "boolean" === r ||
              "string" === r ||
              t instanceof Number) &&
            e.constructor === Array
          )
            return (e[0] = t - e[0]), e;
          if (t.constructor === Array && e.constructor === Array) {
            for (
              var n = 0, s = t.length, a = e.length, o = [];
              s > n || a > n;

            )
              (o[n] =
                "number" == typeof t[n] && "number" == typeof e[n]
                  ? t[n] - e[n]
                  : void 0 == e[n]
                  ? t[n]
                  : t[n] || e[n]),
                (n += 1);
            return o;
          }
          return 0;
        }
        function mul(t, e) {
          var r,
            i = typeof t,
            n = typeof e;
          if (
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              t instanceof Number) &&
            ("number" === n ||
              "boolean" === n ||
              "string" === n ||
              e instanceof Number)
          )
            return t * e;
          var s, a;
          if (
            t.constructor === Array &&
            ("number" === n ||
              "boolean" === n ||
              "string" === n ||
              e instanceof Number)
          ) {
            for (
              a = t.length, r = Array.apply(null, { length: a }), s = 0;
              a > s;
              s += 1
            )
              r[s] = t[s] * e;
            return r;
          }
          if (
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              t instanceof Number) &&
            e.constructor === Array
          ) {
            for (
              a = e.length, r = Array.apply(null, { length: a }), s = 0;
              a > s;
              s += 1
            )
              r[s] = t * e[s];
            return r;
          }
          return 0;
        }
        function div(t, e) {
          var r,
            i = typeof t,
            n = typeof e;
          if (
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              t instanceof Number) &&
            ("number" === n ||
              "boolean" === n ||
              "string" === n ||
              e instanceof Number)
          )
            return t / e;
          var s, a;
          if (
            t.constructor === Array &&
            ("number" === n ||
              "boolean" === n ||
              "string" === n ||
              e instanceof Number)
          ) {
            for (
              a = t.length, r = Array.apply(null, { length: a }), s = 0;
              a > s;
              s += 1
            )
              r[s] = t[s] / e;
            return r;
          }
          if (
            ("number" === i ||
              "boolean" === i ||
              "string" === i ||
              t instanceof Number) &&
            e.constructor === Array
          ) {
            for (
              a = e.length, r = Array.apply(null, { length: a }), s = 0;
              a > s;
              s += 1
            )
              r[s] = t / e[s];
            return r;
          }
          return 0;
        }
        function clamp(t, e, r) {
          if (e > r) {
            var i = r;
            (r = e), (e = i);
          }
          return Math.min(Math.max(t, e), r);
        }
        function radiansToDegrees(t) {
          return t / degToRads;
        }
        function degreesToRadians(t) {
          return t * degToRads;
        }
        function length(t, e) {
          if ("number" == typeof t) return (e = e || 0), Math.abs(t - e);
          e || (e = helperLengthArray);
          var r,
            i = Math.min(t.length, e.length),
            n = 0;
          for (r = 0; i > r; r += 1) n += Math.pow(e[r] - t[r], 2);
          return Math.sqrt(n);
        }
        function normalize(t) {
          return div(t, length(t));
        }
        function rgbToHsl(t) {
          var e,
            r,
            i = t[0],
            n = t[1],
            s = t[2],
            a = Math.max(i, n, s),
            o = Math.min(i, n, s),
            l = (a + o) / 2;
          if (a == o) e = r = 0;
          else {
            var h = a - o;
            switch (((r = l > 0.5 ? h / (2 - a - o) : h / (a + o)), a)) {
              case i:
                e = (n - s) / h + (s > n ? 6 : 0);
                break;
              case n:
                e = (s - i) / h + 2;
                break;
              case s:
                e = (i - n) / h + 4;
            }
            e /= 6;
          }
          return [e, r, l, t[3]];
        }
        function hslToRgb(t) {
          function e(t, e, r) {
            return (
              0 > r && (r += 1),
              r > 1 && (r -= 1),
              1 / 6 > r
                ? t + 6 * (e - t) * r
                : 0.5 > r
                ? e
                : 2 / 3 > r
                ? t + (e - t) * (2 / 3 - r) * 6
                : t
            );
          }
          var r,
            i,
            n,
            s = t[0],
            a = t[1],
            o = t[2];
          if (0 == a) r = i = n = o;
          else {
            var l = 0.5 > o ? o * (1 + a) : o + a - o * a,
              h = 2 * o - l;
            (r = e(h, l, s + 1 / 3)),
              (i = e(h, l, s)),
              (n = e(h, l, s - 1 / 3));
          }
          return [r, i, n, t[3]];
        }
        function linear(t, e, r, i, n) {
          if (void 0 === i || void 0 === n) return linear(t, 0, 1, e, r);
          if (e >= t) return i;
          if (t >= r) return n;
          var s = r === e ? 0 : (t - e) / (r - e);
          if (!i.length) return i + (n - i) * s;
          var a,
            o = i.length,
            l = Array.apply(null, { length: o });
          for (a = 0; o > a; a += 1) l[a] = i[a] + (n[a] - i[a]) * s;
          return l;
        }
        function random(t, e) {
          if (
            (void 0 === e &&
              (void 0 === t ? ((t = 0), (e = 1)) : ((e = t), (t = void 0))),
            e.length)
          ) {
            var r,
              i = e.length;
            t || (t = Array.apply(null, { length: i }));
            var n = Array.apply(null, { length: i }),
              s = BMMath.random();
            for (r = 0; i > r; r += 1) n[r] = t[r] + s * (e[r] - t[r]);
            return n;
          }
          void 0 === t && (t = 0);
          var a = BMMath.random();
          return t + a * (e - t);
        }
        function initiateExpression(elem, data, property) {
          function lookAt(t, e) {
            var r = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
              i =
                Math.atan2(r[0], Math.sqrt(r[1] * r[1] + r[2] * r[2])) /
                degToRads,
              n = -Math.atan2(r[1], r[2]) / degToRads;
            return [n, i, 0];
          }
          function easeOut(t, e, r) {
            return -(r - e) * t * (t - 2) + e;
          }
          function nearestKey(t) {
            var e,
              r,
              i,
              n = data.k.length;
            if (data.k.length && "number" != typeof data.k[0]) {
              for (
                r = -1, t *= elem.comp.globalData.frameRate, e = 0;
                n - 1 > e;
                e += 1
              ) {
                if (t === data.k[e].t) {
                  (r = e + 1), (i = data.k[e].t);
                  break;
                }
                if (t > data.k[e].t && t < data.k[e + 1].t) {
                  t - data.k[e].t > data.k[e + 1].t - t
                    ? ((r = e + 2), (i = data.k[e + 1].t))
                    : ((r = e + 1), (i = data.k[e].t));
                  break;
                }
              }
              -1 === r && ((r = e + 1), (i = data.k[e].t));
            } else (r = 0), (i = 0);
            var s = {};
            return (
              (s.index = r), (s.time = i / elem.comp.globalData.frameRate), s
            );
          }
          function key(t) {
            if (!data.k.length || "number" == typeof data.k[0])
              return { time: 0 };
            t -= 1;
            var e,
              r = { time: data.k[t].t / elem.comp.globalData.frameRate };
            e =
              t !== data.k.length - 1 || data.k[t].h
                ? data.k[t].s
                : data.k[t - 1].e;
            var i,
              n = e.length;
            for (i = 0; n > i; i += 1) r[i] = e[i];
            return r;
          }
          function framesToTime(t, e) {
            return e || (e = elem.comp.globalData.frameRate), t / e;
          }
          function timeToFrames(t, e) {
            return (
              t || (t = time), e || (e = elem.comp.globalData.frameRate), t * e
            );
          }
          function toWorld(t) {
            if (
              (toworldMatrix.reset(),
              elem.finalTransform.mProp.applyToMatrix(toworldMatrix),
              elem.hierarchy && elem.hierarchy.length)
            ) {
              var e,
                r = elem.hierarchy.length;
              for (e = 0; r > e; e += 1)
                elem.hierarchy[e].finalTransform.mProp.applyToMatrix(
                  toworldMatrix
                );
              return toworldMatrix.applyToPointArray(t[0], t[1], t[2] || 0);
            }
            return toworldMatrix.applyToPointArray(t[0], t[1], t[2] || 0);
          }
          function fromWorld(t) {
            fromworldMatrix.reset();
            var e = [];
            if (
              (e.push(t),
              elem.finalTransform.mProp.applyToMatrix(fromworldMatrix),
              elem.hierarchy && elem.hierarchy.length)
            ) {
              var r,
                i = elem.hierarchy.length;
              for (r = 0; i > r; r += 1)
                elem.hierarchy[r].finalTransform.mProp.applyToMatrix(
                  fromworldMatrix
                );
              return fromworldMatrix.inversePoints(e)[0];
            }
            return fromworldMatrix.inversePoints(e)[0];
          }
          function seedRandom(t) {
            BMMath.seedrandom(randSeed + t);
          }
          function execute() {
            if (
              (_needsRandom && seedRandom(randSeed),
              this.frameExpressionId !== elem.globalData.frameId ||
                "textSelector" === this.type)
            ) {
              if (this.lock)
                return (
                  (this.v = duplicatePropertyValue(this.pv, this.mult)), !0
                );
              "textSelector" === this.type &&
                ((textIndex = this.textIndex),
                (textTotal = this.textTotal),
                (selectorValue = this.selectorValue)),
                thisLayer ||
                  ((thisLayer = elem.layerInterface),
                  (thisComp = elem.comp.compInterface)),
                transform ||
                  (transform = elem.layerInterface("ADBE Transform Group")),
                4 !== elemType ||
                  content ||
                  (content = thisLayer("ADBE Root Vectors Group")),
                effect || (effect = thisLayer(4)),
                (hasParent = !(!elem.hierarchy || !elem.hierarchy.length)),
                hasParent &&
                  !parent &&
                  (parent =
                    elem.hierarchy[elem.hierarchy.length - 1].layerInterface),
                (this.lock = !0),
                this.getPreValue && this.getPreValue(),
                (value = this.pv),
                (time =
                  this.comp.renderedFrame / this.comp.globalData.frameRate),
                needsVelocity && (velocity = velocityAtTime(time)),
                bindedFn(),
                (this.frameExpressionId = elem.globalData.frameId);
              var t, e;
              if (this.mult)
                if (
                  "number" == typeof this.v ||
                  this.v instanceof Number ||
                  "string" == typeof this.v
                )
                  this.v *= this.mult;
                else if (1 === this.v.length) this.v = this.v[0] * this.mult;
                else
                  for (
                    e = this.v.length,
                      value === this.v &&
                        (this.v =
                          2 === e
                            ? [value[0], value[1]]
                            : [value[0], value[1], value[2]]),
                      t = 0;
                    e > t;
                    t += 1
                  )
                    this.v[t] *= this.mult;
              if (
                (1 === this.v.length && (this.v = this.v[0]),
                "number" == typeof this.v ||
                  this.v instanceof Number ||
                  "string" == typeof this.v)
              )
                this.lastValue !== this.v &&
                  ((this.lastValue = this.v), (this.mdf = !0));
              else if (this.v._length)
                shapesEqual(this.v, this.localShapeCollection.shapes[0]) ||
                  ((this.mdf = !0),
                  this.localShapeCollection.releaseShapes(),
                  this.localShapeCollection.addShape(shape_pool.clone(this.v)));
              else
                for (e = this.v.length, t = 0; e > t; t += 1)
                  this.v[t] !== this.lastValue[t] &&
                    ((this.lastValue[t] = this.v[t]), (this.mdf = !0));
              this.lock = !1;
            }
          }
          var val = data.x,
            needsVelocity = /velocity(?![\w\d])/.test(val),
            _needsRandom = -1 !== val.indexOf("random"),
            elemType = elem.data.ty,
            transform,
            content,
            effect,
            thisComp = elem.comp,
            thisProperty = property;
          elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate;
          var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
            outPoint = elem.data.op / elem.comp.globalData.frameRate,
            width = elem.data.sw ? elem.data.sw : 0,
            height = elem.data.sh ? elem.data.sh : 0,
            thisLayer,
            thisComp,
            fn = new Function(),
            fn = eval("[function(){" + val + ";this.v = $bm_rt;}]")[0],
            bindedFn = fn.bind(this),
            numKeys = property.kf ? data.k.length : 0,
            wiggle = function (t, e) {
              var r,
                i,
                n = this.pv.length ? this.pv.length : 1,
                s = Array.apply(null, { len: n });
              for (i = 0; n > i; i += 1) s[i] = 0;
              t = 5;
              var a = Math.floor(time * t);
              for (r = 0, i = 0; a > r; ) {
                for (i = 0; n > i; i += 1) s[i] += -e + 2 * e * BMMath.random();
                r += 1;
              }
              var o = time * t,
                l = o - Math.floor(o),
                h = Array.apply({ length: n });
              if (n > 1) {
                for (i = 0; n > i; i += 1)
                  h[i] = this.pv[i] + s[i] + (-e + 2 * e * BMMath.random()) * l;
                return h;
              }
              return this.pv + s[0] + (-e + 2 * e * BMMath.random()) * l;
            }.bind(this),
            loopIn = function (t, e, r) {
              if (!this.k) return this.pv;
              var i = time * elem.comp.globalData.frameRate,
                n = this.keyframes,
                s = n[0].t;
              if (i >= s) return this.pv;
              var a, o;
              r
                ? ((a = e
                    ? Math.abs(elem.comp.globalData.frameRate * e)
                    : Math.max(0, this.elem.data.op - s)),
                  (o = s + a))
                : ((!e || e > n.length - 1) && (e = n.length - 1),
                  (o = n[e].t),
                  (a = o - s));
              var l, h, p;
              if ("pingpong" === t) {
                var c = Math.floor((s - i) / a);
                if (c % 2 === 0)
                  return this.getValueAtTime(
                    (((s - i) % a) + s) / this.comp.globalData.frameRate,
                    0
                  );
              } else {
                if ("offset" === t) {
                  var f = this.getValueAtTime(
                      s / this.comp.globalData.frameRate,
                      0
                    ),
                    u = this.getValueAtTime(
                      o / this.comp.globalData.frameRate,
                      0
                    ),
                    d = this.getValueAtTime(
                      (a - ((s - i) % a) + s) / this.comp.globalData.frameRate,
                      0
                    ),
                    m = Math.floor((s - i) / a) + 1;
                  if (this.pv.length) {
                    for (
                      p = new Array(f.length), h = p.length, l = 0;
                      h > l;
                      l += 1
                    )
                      p[l] = d[l] - (u[l] - f[l]) * m;
                    return p;
                  }
                  return d - (u - f) * m;
                }
                if ("continue" === t) {
                  var y = this.getValueAtTime(
                      s / this.comp.globalData.frameRate,
                      0
                    ),
                    g = this.getValueAtTime(
                      (s + 0.001) / this.comp.globalData.frameRate,
                      0
                    );
                  if (this.pv.length) {
                    for (
                      p = new Array(y.length), h = p.length, l = 0;
                      h > l;
                      l += 1
                    )
                      p[l] = y[l] + ((y[l] - g[l]) * (s - i)) / 0.001;
                    return p;
                  }
                  return y + ((y - g) * (s - i)) / 0.001;
                }
              }
              return this.getValueAtTime(
                (a - ((s - i) % a) + s) / this.comp.globalData.frameRate,
                0
              );
            }.bind(this),
            loopInDuration = function (t, e) {
              return loopIn(t, e, !0);
            }.bind(this),
            loopOut = function (t, e, r) {
              if (!this.k || !this.keyframes) return this.pv;
              var i = time * elem.comp.globalData.frameRate,
                n = this.keyframes,
                s = n[n.length - 1].t;
              if (s >= i) return this.pv;
              var a, o;
              r
                ? ((a = e
                    ? Math.abs(s - elem.comp.globalData.frameRate * e)
                    : Math.max(0, s - this.elem.data.ip)),
                  (o = s - a))
                : ((!e || e > n.length - 1) && (e = n.length - 1),
                  (o = n[n.length - 1 - e].t),
                  (a = s - o));
              var l, h, p;
              if ("pingpong" === t) {
                var c = Math.floor((i - o) / a);
                if (c % 2 !== 0)
                  return this.getValueAtTime(
                    (a - ((i - o) % a) + o) / this.comp.globalData.frameRate,
                    0
                  );
              } else {
                if ("offset" === t) {
                  var f = this.getValueAtTime(
                      o / this.comp.globalData.frameRate,
                      0
                    ),
                    u = this.getValueAtTime(
                      s / this.comp.globalData.frameRate,
                      0
                    ),
                    d = this.getValueAtTime(
                      (((i - o) % a) + o) / this.comp.globalData.frameRate,
                      0
                    ),
                    m = Math.floor((i - o) / a);
                  if (this.pv.length) {
                    for (
                      p = new Array(f.length), h = p.length, l = 0;
                      h > l;
                      l += 1
                    )
                      p[l] = (u[l] - f[l]) * m + d[l];
                    return p;
                  }
                  return (u - f) * m + d;
                }
                if ("continue" === t) {
                  var y = this.getValueAtTime(
                      s / this.comp.globalData.frameRate,
                      0
                    ),
                    g = this.getValueAtTime(
                      (s - 0.001) / this.comp.globalData.frameRate,
                      0
                    );
                  if (this.pv.length) {
                    for (
                      p = new Array(y.length), h = p.length, l = 0;
                      h > l;
                      l += 1
                    )
                      p[l] =
                        y[l] +
                        ((y[l] - g[l]) *
                          ((i - s) / this.comp.globalData.frameRate)) /
                          5e-4;
                    return p;
                  }
                  return y + (y - g) * ((i - s) / 0.001);
                }
              }
              return this.getValueAtTime(
                (((i - o) % a) + o) / this.comp.globalData.frameRate,
                0
              );
            }.bind(this),
            loop_out = loopOut,
            loopOutDuration = function (t, e) {
              return loopOut(t, e, !0);
            }.bind(this),
            valueAtTime = function (t) {
              return this.getValueAtTime(t, 0);
            }.bind(this),
            velocityAtTime = function (t) {
              return this.getVelocityAtTime(t);
            }.bind(this),
            comp = elem.comp.globalData.projectInterface.bind(
              elem.comp.globalData.projectInterface
            ),
            toworldMatrix = new Matrix(),
            fromworldMatrix = new Matrix(),
            time,
            velocity,
            value,
            textIndex,
            textTotal,
            selectorValue,
            index = elem.data.ind,
            hasParent = !(!elem.hierarchy || !elem.hierarchy.length),
            parent,
            randSeed = Math.floor(1e6 * Math.random());
          return execute;
        }
        var ob = {},
          Math = BMMath,
          window = null,
          document = null,
          add = sum,
          radians_to_degrees = radiansToDegrees,
          degrees_to_radians = radiansToDegrees,
          helperLengthArray = [0, 0, 0, 0, 0, 0];
        return (ob.initiateExpression = initiateExpression), ob;
      })(),
      ShapeExpressionInterface = (function () {
        function t(t, e, r) {
          return d(t, e, r);
        }
        function e(t, e, r) {
          return y(t, e, r);
        }
        function r(t, e, r) {
          return g(t, e, r);
        }
        function i(t, e, r) {
          return v(t, e, r);
        }
        function n(t, e, r) {
          return b(t, e, r);
        }
        function s(t, e, r) {
          return x(t, e, r);
        }
        function a(t, e, r) {
          return E(t, e, r);
        }
        function o(t, e, r) {
          return w(t, e, r);
        }
        function l(t, e, r) {
          return P(t, e, r);
        }
        function h(t, e, r) {
          return S(t, e, r);
        }
        function p(t, e, r) {
          return C(t, e, r);
        }
        function c(t, e, r) {
          return k(t, e, r);
        }
        function f(t, e, r) {
          var i,
            n = [],
            s = t ? t.length : 0;
          for (i = 0; s > i; i += 1)
            "gr" == t[i].ty
              ? n.push(
                  ShapeExpressionInterface.createGroupInterface(t[i], e[i], r)
                )
              : "fl" == t[i].ty
              ? n.push(
                  ShapeExpressionInterface.createFillInterface(t[i], e[i], r)
                )
              : "st" == t[i].ty
              ? n.push(
                  ShapeExpressionInterface.createStrokeInterface(t[i], e[i], r)
                )
              : "tm" == t[i].ty
              ? n.push(
                  ShapeExpressionInterface.createTrimInterface(t[i], e[i], r)
                )
              : "tr" == t[i].ty ||
                ("el" == t[i].ty
                  ? n.push(
                      ShapeExpressionInterface.createEllipseInterface(
                        t[i],
                        e[i],
                        r
                      )
                    )
                  : "sr" == t[i].ty
                  ? n.push(
                      ShapeExpressionInterface.createStarInterface(
                        t[i],
                        e[i],
                        r
                      )
                    )
                  : "sh" == t[i].ty
                  ? n.push(
                      ShapeExpressionInterface.createPathInterface(
                        t[i],
                        e[i],
                        r
                      )
                    )
                  : "rc" == t[i].ty
                  ? n.push(
                      ShapeExpressionInterface.createRectInterface(
                        t[i],
                        e[i],
                        r
                      )
                    )
                  : "rd" == t[i].ty
                  ? n.push(
                      ShapeExpressionInterface.createRoundedInterface(
                        t[i],
                        e[i],
                        r
                      )
                    )
                  : "rp" == t[i].ty &&
                    n.push(
                      ShapeExpressionInterface.createRepatearInterface(
                        t[i],
                        e[i],
                        r
                      )
                    ));
          return n;
        }
        var u = {
            createShapeInterface: t,
            createGroupInterface: e,
            createTrimInterface: n,
            createStrokeInterface: i,
            createTransformInterface: s,
            createEllipseInterface: a,
            createStarInterface: o,
            createRectInterface: l,
            createRoundedInterface: h,
            createRepatearInterface: p,
            createPathInterface: c,
            createFillInterface: r,
          },
          d = (function () {
            return function (t, e, r) {
              function i(t) {
                if ("number" == typeof t) return n[t - 1];
                for (var e = 0, r = n.length; r > e; ) {
                  if (n[e]._name === t) return n[e];
                  e += 1;
                }
              }
              var n;
              return (i.propertyGroup = r), (n = f(t, e, i)), i;
            };
          })(),
          m = (function () {
            return function (t, e, r) {
              var i,
                n = function (t) {
                  for (var e = 0, r = i.length; r > e; ) {
                    if (
                      i[e]._name === t ||
                      i[e].mn === t ||
                      i[e].propertyIndex === t ||
                      i[e].ix === t ||
                      i[e].ind === t
                    )
                      return i[e];
                    e += 1;
                  }
                  return "number" == typeof t ? i[t - 1] : void 0;
                };
              return (
                (n.propertyGroup = function (t) {
                  return 1 === t ? n : r(t - 1);
                }),
                (i = f(t.it, e.it, n.propertyGroup)),
                (n.numProperties = i.length),
                (n.propertyIndex = t.cix),
                n
              );
            };
          })(),
          y = (function () {
            return function (t, e, r) {
              var i = function (t) {
                switch (t) {
                  case "ADBE Vectors Group":
                  case "Contents":
                  case 2:
                    return i.content;
                  case "ADBE Vector Transform Group":
                  case 3:
                  default:
                    return i.transform;
                }
              };
              i.propertyGroup = function (t) {
                return 1 === t ? i : r(t - 1);
              };
              var n = m(t, e, i.propertyGroup),
                s = ShapeExpressionInterface.createTransformInterface(
                  t.it[t.it.length - 1],
                  e.it[e.it.length - 1],
                  i.propertyGroup
                );
              return (
                (i.content = n),
                (i.transform = s),
                Object.defineProperty(i, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (i.numProperties = t.np),
                (i.propertyIndex = t.ix),
                (i.nm = t.nm),
                (i.mn = t.mn),
                i
              );
            };
          })(),
          g = (function () {
            return function (t, e, r) {
              function i(t) {
                return "Color" === t || "color" === t
                  ? i.color
                  : "Opacity" === t || "opacity" === t
                  ? i.opacity
                  : void 0;
              }
              return (
                Object.defineProperty(i, "color", {
                  get: function () {
                    return ExpressionValue(e.c, 1 / e.c.mult, "color");
                  },
                }),
                Object.defineProperty(i, "opacity", {
                  get: function () {
                    return ExpressionValue(e.o, 100);
                  },
                }),
                Object.defineProperty(i, "_name", { value: t.nm }),
                Object.defineProperty(i, "mn", { value: t.mn }),
                e.c.setGroupProperty(r),
                e.o.setGroupProperty(r),
                i
              );
            };
          })(),
          v = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 === t ? u : r(t - 1);
              }
              function n(t) {
                return 1 === t ? h : i(t - 1);
              }
              function s(r) {
                Object.defineProperty(h, t.d[r].nm, {
                  get: function () {
                    return ExpressionValue(e.d.dataProps[r].p);
                  },
                });
              }
              function a(t) {
                return "Color" === t || "color" === t
                  ? a.color
                  : "Opacity" === t || "opacity" === t
                  ? a.opacity
                  : "Stroke Width" === t || "stroke width" === t
                  ? a.strokeWidth
                  : void 0;
              }
              var o,
                l = t.d ? t.d.length : 0,
                h = {};
              for (o = 0; l > o; o += 1)
                s(o), e.d.dataProps[o].p.setGroupProperty(n);
              return (
                Object.defineProperty(a, "color", {
                  get: function () {
                    return ExpressionValue(e.c, 1 / e.c.mult, "color");
                  },
                }),
                Object.defineProperty(a, "opacity", {
                  get: function () {
                    return ExpressionValue(e.o, 100);
                  },
                }),
                Object.defineProperty(a, "strokeWidth", {
                  get: function () {
                    return ExpressionValue(e.w);
                  },
                }),
                Object.defineProperty(a, "dash", {
                  get: function () {
                    return h;
                  },
                }),
                Object.defineProperty(a, "_name", { value: t.nm }),
                Object.defineProperty(a, "mn", { value: t.mn }),
                e.c.setGroupProperty(i),
                e.o.setGroupProperty(i),
                e.w.setGroupProperty(i),
                a
              );
            };
          })(),
          b = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return e === t.e.ix || "End" === e || "end" === e
                  ? n.end
                  : e === t.s.ix
                  ? n.start
                  : e === t.o.ix
                  ? n.offset
                  : void 0;
              }
              return (
                (n.propertyIndex = t.ix),
                e.s.setGroupProperty(i),
                e.e.setGroupProperty(i),
                e.o.setGroupProperty(i),
                (n.propertyIndex = t.ix),
                Object.defineProperty(n, "start", {
                  get: function () {
                    return ExpressionValue(e.s, 1 / e.s.mult);
                  },
                }),
                Object.defineProperty(n, "end", {
                  get: function () {
                    return ExpressionValue(e.e, 1 / e.e.mult);
                  },
                }),
                Object.defineProperty(n, "offset", {
                  get: function () {
                    return ExpressionValue(e.o);
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          x = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return t.a.ix === e
                  ? n.anchorPoint
                  : t.o.ix === e
                  ? n.opacity
                  : t.p.ix === e
                  ? n.position
                  : t.r.ix === e
                  ? n.rotation
                  : t.s.ix === e
                  ? n.scale
                  : t.sk && t.sk.ix === e
                  ? n.skew
                  : t.sa && t.sa.ix === e
                  ? n.skewAxis
                  : "Opacity" === e
                  ? n.opacity
                  : "Position" === e
                  ? n.position
                  : "Anchor Point" === e
                  ? n.anchorPoint
                  : "Scale" === e
                  ? n.scale
                  : "Rotation" === e || "ADBE Vector Rotation" === e
                  ? n.rotation
                  : "Skew" === e
                  ? n.skew
                  : "Skew Axis" === e
                  ? n.skewAxis
                  : void 0;
              }
              return (
                e.transform.mProps.o.setGroupProperty(i),
                e.transform.mProps.p.setGroupProperty(i),
                e.transform.mProps.a.setGroupProperty(i),
                e.transform.mProps.s.setGroupProperty(i),
                e.transform.mProps.r.setGroupProperty(i),
                e.transform.mProps.sk &&
                  (e.transform.mProps.sk.setGroupProperty(i),
                  e.transform.mProps.sa.setGroupProperty(i)),
                e.transform.op.setGroupProperty(i),
                Object.defineProperty(n, "opacity", {
                  get: function () {
                    return ExpressionValue(
                      e.transform.mProps.o,
                      1 / e.transform.mProps.o.mult
                    );
                  },
                }),
                Object.defineProperty(n, "position", {
                  get: function () {
                    return ExpressionValue(e.transform.mProps.p);
                  },
                }),
                Object.defineProperty(n, "anchorPoint", {
                  get: function () {
                    return ExpressionValue(e.transform.mProps.a);
                  },
                }),
                Object.defineProperty(n, "scale", {
                  get: function () {
                    return ExpressionValue(
                      e.transform.mProps.s,
                      1 / e.transform.mProps.s.mult
                    );
                  },
                }),
                Object.defineProperty(n, "rotation", {
                  get: function () {
                    return ExpressionValue(
                      e.transform.mProps.r,
                      1 / e.transform.mProps.r.mult
                    );
                  },
                }),
                Object.defineProperty(n, "skew", {
                  get: function () {
                    return ExpressionValue(e.transform.mProps.sk);
                  },
                }),
                Object.defineProperty(n, "skewAxis", {
                  get: function () {
                    return ExpressionValue(e.transform.mProps.sa);
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.ty = "tr"),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          E = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return t.p.ix === e
                  ? n.position
                  : t.s.ix === e
                  ? n.size
                  : void 0;
              }
              n.propertyIndex = t.ix;
              var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
              return (
                s.s.setGroupProperty(i),
                s.p.setGroupProperty(i),
                Object.defineProperty(n, "size", {
                  get: function () {
                    return ExpressionValue(s.s);
                  },
                }),
                Object.defineProperty(n, "position", {
                  get: function () {
                    return ExpressionValue(s.p);
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          w = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return t.p.ix === e
                  ? n.position
                  : t.r.ix === e
                  ? n.rotation
                  : t.pt.ix === e
                  ? n.points
                  : t.or.ix === e || "ADBE Vector Star Outer Radius" === e
                  ? n.outerRadius
                  : t.os.ix === e
                  ? n.outerRoundness
                  : !t.ir ||
                    (t.ir.ix !== e && "ADBE Vector Star Inner Radius" !== e)
                  ? t.is && t.is.ix === e
                    ? n.innerRoundness
                    : void 0
                  : n.innerRadius;
              }
              var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
              return (
                (n.propertyIndex = t.ix),
                s.or.setGroupProperty(i),
                s.os.setGroupProperty(i),
                s.pt.setGroupProperty(i),
                s.p.setGroupProperty(i),
                s.r.setGroupProperty(i),
                t.ir && (s.ir.setGroupProperty(i), s.is.setGroupProperty(i)),
                Object.defineProperty(n, "position", {
                  get: function () {
                    return ExpressionValue(s.p);
                  },
                }),
                Object.defineProperty(n, "rotation", {
                  get: function () {
                    return ExpressionValue(s.r, 1 / s.r.mult);
                  },
                }),
                Object.defineProperty(n, "points", {
                  get: function () {
                    return ExpressionValue(s.pt);
                  },
                }),
                Object.defineProperty(n, "outerRadius", {
                  get: function () {
                    return ExpressionValue(s.or);
                  },
                }),
                Object.defineProperty(n, "outerRoundness", {
                  get: function () {
                    return ExpressionValue(s.os);
                  },
                }),
                Object.defineProperty(n, "innerRadius", {
                  get: function () {
                    return s.ir ? ExpressionValue(s.ir) : 0;
                  },
                }),
                Object.defineProperty(n, "innerRoundness", {
                  get: function () {
                    return s.is ? ExpressionValue(s.is, 1 / s.is.mult) : 0;
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          P = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return t.p.ix === e
                  ? n.position
                  : t.r.ix === e
                  ? n.rotation
                  : t.pt.ix === e
                  ? n.points
                  : t.or.ix === e || "ADBE Vector Star Outer Radius" === e
                  ? n.outerRadius
                  : t.os.ix === e
                  ? n.outerRoundness
                  : !t.ir ||
                    (t.ir.ix !== e && "ADBE Vector Star Inner Radius" !== e)
                  ? t.is && t.is.ix === e
                    ? n.innerRoundness
                    : void 0
                  : n.innerRadius;
              }
              var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
              return (
                (n.propertyIndex = t.ix),
                s.p.setGroupProperty(i),
                s.s.setGroupProperty(i),
                s.r.setGroupProperty(i),
                Object.defineProperty(n, "position", {
                  get: function () {
                    return ExpressionValue(s.p);
                  },
                }),
                Object.defineProperty(n, "roundness", {
                  get: function () {
                    return ExpressionValue(s.r);
                  },
                }),
                Object.defineProperty(n, "size", {
                  get: function () {
                    return ExpressionValue(s.s);
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          S = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return t.r.ix === e || "Round Corners 1" === e
                  ? n.radius
                  : void 0;
              }
              var s = e;
              return (
                (n.propertyIndex = t.ix),
                s.rd.setGroupProperty(i),
                Object.defineProperty(n, "radius", {
                  get: function () {
                    return ExpressionValue(s.rd);
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          C = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(e) {
                return t.c.ix === e || "Copies" === e
                  ? n.copies
                  : t.o.ix === e || "Offset" === e
                  ? n.offset
                  : void 0;
              }
              var s = e;
              return (
                (n.propertyIndex = t.ix),
                s.c.setGroupProperty(i),
                s.o.setGroupProperty(i),
                Object.defineProperty(n, "copies", {
                  get: function () {
                    return ExpressionValue(s.c);
                  },
                }),
                Object.defineProperty(n, "offset", {
                  get: function () {
                    return ExpressionValue(s.o);
                  },
                }),
                Object.defineProperty(n, "_name", {
                  get: function () {
                    return t.nm;
                  },
                }),
                (n.mn = t.mn),
                n
              );
            };
          })(),
          k = (function () {
            return function (t, e, r) {
              function i(t) {
                return 1 == t ? n : r(--t);
              }
              function n(t) {
                return "Shape" === t ||
                  "shape" === t ||
                  "Path" === t ||
                  "path" === t
                  ? n.path
                  : void 0;
              }
              var s = "tm" === e.sh.ty ? e.sh.prop : e.sh;
              return (
                s.setGroupProperty(i),
                Object.defineProperty(n, "path", {
                  get: function () {
                    return s.k && s.getValue(), s.v;
                  },
                }),
                Object.defineProperty(n, "shape", {
                  get: function () {
                    return s.k && s.getValue(), s.v;
                  },
                }),
                Object.defineProperty(n, "_name", { value: t.nm }),
                Object.defineProperty(n, "ix", { value: t.ix }),
                Object.defineProperty(n, "mn", { value: t.mn }),
                n
              );
            };
          })();
        return u;
      })(),
      TextExpressionInterface = (function () {
        return function (t) {
          function e() {}
          return (
            Object.defineProperty(e, "sourceText", {
              get: function () {
                return t.currentTextDocumentData.t
                  ? t.currentTextDocumentData.t
                  : "";
              },
            }),
            e
          );
        };
      })(),
      LayerExpressionInterface = (function () {
        function t(t) {
          var e = new Matrix();
          if (
            (e.reset(),
            this._elem.finalTransform.mProp.applyToMatrix(e),
            this._elem.hierarchy && this._elem.hierarchy.length)
          ) {
            var r,
              i = this._elem.hierarchy.length;
            for (r = 0; i > r; r += 1)
              this._elem.hierarchy[r].finalTransform.mProp.applyToMatrix(e);
            return e.applyToPointArray(t[0], t[1], t[2] || 0);
          }
          return e.applyToPointArray(t[0], t[1], t[2] || 0);
        }
        return function (e) {
          function r(t) {
            n.mask = t.getMask.bind(t);
          }
          function i(t) {
            n.effect = t;
          }
          function n(t) {
            switch (t) {
              case "ADBE Root Vectors Group":
              case "Contents":
              case 2:
                return n.shapeInterface;
              case 1:
              case "Transform":
              case "transform":
              case "ADBE Transform Group":
                return s;
              case 4:
              case "ADBE Effect Parade":
                return n.effect;
            }
          }
          var s = TransformExpressionInterface(e.transform);
          return (
            (n.toWorld = t),
            (n.toComp = t),
            (n._elem = e),
            Object.defineProperty(n, "hasParent", {
              get: function () {
                return !!e.hierarchy;
              },
            }),
            Object.defineProperty(n, "parent", {
              get: function () {
                return e.hierarchy[0].layerInterface;
              },
            }),
            Object.defineProperty(n, "rotation", {
              get: function () {
                return s.rotation;
              },
            }),
            Object.defineProperty(n, "scale", {
              get: function () {
                return s.scale;
              },
            }),
            Object.defineProperty(n, "position", {
              get: function () {
                return s.position;
              },
            }),
            Object.defineProperty(n, "anchorPoint", {
              get: function () {
                return s.anchorPoint;
              },
            }),
            Object.defineProperty(n, "transform", {
              get: function () {
                return s;
              },
            }),
            Object.defineProperty(n, "width", {
              get: function () {
                return 0 === e.data.ty ? e.data.w : 100;
              },
            }),
            Object.defineProperty(n, "height", {
              get: function () {
                return 0 === e.data.ty ? e.data.h : 100;
              },
            }),
            Object.defineProperty(n, "source", {
              get: function () {
                return e.data.refId;
              },
            }),
            Object.defineProperty(n, "_name", { value: e.data.nm }),
            Object.defineProperty(n, "content", {
              get: function () {
                return n.shapeInterface;
              },
            }),
            Object.defineProperty(n, "active", {
              get: function () {
                return e.isVisible;
              },
            }),
            Object.defineProperty(n, "text", {
              get: function () {
                return n.textInterface;
              },
            }),
            (n.registerMaskInterface = r),
            (n.registerEffectsInterface = i),
            n
          );
        };
      })(),
      CompExpressionInterface = (function () {
        return function (t) {
          function e(e) {
            for (var r = 0, i = t.layers.length; i > r; ) {
              if (t.layers[r].nm === e || t.layers[r].ind === e)
                return t.elements[r].layerInterface;
              r += 1;
            }
            return { active: !1 };
          }
          return (
            Object.defineProperty(e, "_name", { value: t.data.nm }),
            (e.layer = e),
            (e.pixelAspect = 1),
            (e.height = t.globalData.compSize.h),
            (e.width = t.globalData.compSize.w),
            (e.pixelAspect = 1),
            (e.frameDuration = 1 / t.globalData.frameRate),
            e
          );
        };
      })(),
      TransformExpressionInterface = (function () {
        return function (t) {
          function e(r) {
            switch (r) {
              case "scale":
              case "Scale":
              case "ADBE Scale":
                return e.scale;
              case "rotation":
              case "Rotation":
              case "ADBE Rotation":
              case "ADBE Rotate Z":
                return e.rotation;
              case "position":
              case "Position":
              case "ADBE Position":
                return t.position;
              case "anchorPoint":
              case "AnchorPoint":
              case "Anchor Point":
              case "ADBE AnchorPoint":
                return e.anchorPoint;
              case "opacity":
              case "Opacity":
                return e.opacity;
            }
          }
          return (
            Object.defineProperty(e, "rotation", {
              get: function () {
                return t.rotation;
              },
            }),
            Object.defineProperty(e, "scale", {
              get: function () {
                return t.scale;
              },
            }),
            Object.defineProperty(e, "position", {
              get: function () {
                return t.position;
              },
            }),
            Object.defineProperty(e, "xPosition", {
              get: function () {
                return t.xPosition;
              },
            }),
            Object.defineProperty(e, "yPosition", {
              get: function () {
                return t.yPosition;
              },
            }),
            Object.defineProperty(e, "anchorPoint", {
              get: function () {
                return t.anchorPoint;
              },
            }),
            Object.defineProperty(e, "opacity", {
              get: function () {
                return t.opacity;
              },
            }),
            Object.defineProperty(e, "skew", {
              get: function () {
                return t.skew;
              },
            }),
            Object.defineProperty(e, "skewAxis", {
              get: function () {
                return t.skewAxis;
              },
            }),
            e
          );
        };
      })(),
      ProjectInterface = (function () {
        function t(t) {
          this.compositions.push(t);
        }
        return function () {
          function e(t) {
            for (var e = 0, r = this.compositions.length; r > e; ) {
              if (
                this.compositions[e].data &&
                this.compositions[e].data.nm === t
              )
                return (
                  this.compositions[e].prepareFrame(this.currentFrame),
                  this.compositions[e].compInterface
                );
              e += 1;
            }
          }
          return (
            (e.compositions = []),
            (e.currentFrame = 0),
            (e.registerComposition = t),
            e
          );
        };
      })(),
      EffectsExpressionInterface = (function () {
        function t(t, r) {
          if (t.effects) {
            var i,
              n = [],
              s = t.data.ef,
              a = t.effects.effectElements.length;
            for (i = 0; a > i; i += 1)
              n.push(e(s[i], t.effects.effectElements[i], r, t));
            return function (e) {
              for (var r = t.data.ef, i = 0, s = r.length; s > i; ) {
                if (e === r[i].nm || e === r[i].mn || e === r[i].ix)
                  return n[i];
                i += 1;
              }
            };
          }
        }
        function e(t, i, n, s) {
          var a,
            o = [],
            l = t.ef.length;
          for (a = 0; l > a; a += 1)
            o.push(
              5 === t.ef[a].ty
                ? e(t.ef[a], i.effectElements[a], n, s)
                : r(i.effectElements[a], t.ef[a].ty, s)
            );
          var h = function (e) {
            for (var r = t.ef, i = 0, n = r.length; n > i; ) {
              if (e === r[i].nm || e === r[i].mn || e === r[i].ix)
                return 5 === r[i].ty ? o[i] : o[i]();
              i += 1;
            }
            return o[0]();
          };
          return (
            "ADBE Color Control" === t.mn &&
              Object.defineProperty(h, "color", {
                get: function () {
                  return o[0]();
                },
              }),
            (h.active = 0 !== t.en),
            h
          );
        }
        function r(t, e, r) {
          return function () {
            return 10 === e
              ? r.comp.compInterface(t.p.v)
              : ExpressionValue(t.p);
          };
        }
        var i = { createEffectsInterface: t };
        return i;
      })(),
      ExpressionValue = (function () {
        return function (t, e, r) {
          var i;
          t.k && t.getValue();
          var n, s, a;
          if (r) {
            if ("color" === r) {
              for (
                s = 4,
                  i = Array.apply(null, { length: s }),
                  a = Array.apply(null, { length: s }),
                  n = 0;
                s > n;
                n += 1
              )
                i[n] = a[n] = e && 3 > n ? t.v[n] * e : 1;
              i.value = a;
            }
          } else if ("number" == typeof t.v || t.v instanceof Number)
            (i = new Number(e ? t.v * e : t.v)), (i.value = e ? t.v * e : t.v);
          else {
            for (
              s = t.v.length,
                i = Array.apply(null, { length: s }),
                a = Array.apply(null, { length: s }),
                n = 0;
              s > n;
              n += 1
            )
              i[n] = a[n] = e ? t.v[n] * e : t.v[n];
            i.value = a;
          }
          return (
            (i.numKeys = t.keyframes ? t.keyframes.length : 0),
            (i.key = function (e) {
              return i.numKeys ? t.keyframes[e - 1].t : 0;
            }),
            (i.valueAtTime = t.getValueAtTime),
            (i.propertyGroup = t.propertyGroup),
            i
          );
        };
      })();
    (GroupEffect.prototype.getValue = function () {
      this.mdf = !1;
      var t,
        e = this.dynamicProperties.length;
      for (t = 0; e > t; t += 1)
        this.dynamicProperties[t].getValue(),
          (this.mdf = this.dynamicProperties[t].mdf ? !0 : this.mdf);
    }),
      (GroupEffect.prototype.init = function (t, e, r) {
        (this.data = t), (this.mdf = !1), (this.effectElements = []);
        var i,
          n,
          s = this.data.ef.length,
          a = this.data.ef;
        for (i = 0; s > i; i += 1)
          switch (a[i].ty) {
            case 0:
              (n = new SliderEffect(a[i], e, r)), this.effectElements.push(n);
              break;
            case 1:
              (n = new AngleEffect(a[i], e, r)), this.effectElements.push(n);
              break;
            case 2:
              (n = new ColorEffect(a[i], e, r)), this.effectElements.push(n);
              break;
            case 3:
              (n = new PointEffect(a[i], e, r)), this.effectElements.push(n);
              break;
            case 4:
            case 7:
              (n = new CheckboxEffect(a[i], e, r)), this.effectElements.push(n);
              break;
            case 10:
              (n = new LayerIndexEffect(a[i], e, r)),
                this.effectElements.push(n);
              break;
            case 11:
              (n = new MaskIndexEffect(a[i], e, r)),
                this.effectElements.push(n);
              break;
            case 5:
              (n = new EffectsManager(a[i], e, r)), this.effectElements.push(n);
              break;
            case 6:
              (n = new NoValueEffect(a[i], e, r)), this.effectElements.push(n);
          }
      });
    var bodymovinjs = {};
    (bodymovinjs.play = play),
      (bodymovinjs.pause = pause),
      (bodymovinjs.togglePause = togglePause),
      (bodymovinjs.setSpeed = setSpeed),
      (bodymovinjs.setDirection = setDirection),
      (bodymovinjs.stop = stop),
      (bodymovinjs.moveFrame = moveFrame),
      (bodymovinjs.searchAnimations = searchAnimations),
      (bodymovinjs.registerAnimation = registerAnimation),
      (bodymovinjs.loadAnimation = loadAnimation),
      (bodymovinjs.setSubframeRendering = setSubframeRendering),
      (bodymovinjs.resize = resize),
      (bodymovinjs.start = start),
      (bodymovinjs.goToAndStop = goToAndStop),
      (bodymovinjs.destroy = destroy),
      (bodymovinjs.setQuality = setQuality),
      (bodymovinjs.installPlugin = installPlugin),
      (bodymovinjs.__getFactory = getFactory),
      (bodymovinjs.version = "4.6.8");
    var standalone = "__[STANDALONE]__",
      animationData = "__[ANIMATIONDATA]__",
      renderer = "";
    if (standalone) {
      var scripts = document.getElementsByTagName("script"),
        index = scripts.length - 1,
        myScript = scripts[index],
        queryString = myScript.src.replace(/^[^\?]+\??/, "");
      renderer = getQueryVariable("renderer");
    }
    var readyStateCheckInterval = setInterval(checkReady, 100);
    return bodymovinjs;
  }),
  (function (t) {
    function e(e) {
      return e.classList ? e.classList : t(e).attr("class").match(/\S+/gi);
    }
    t.fn.ShareLink = function (r) {
      function i(t) {
        var e = a[t];
        return (e = e.replace(/{url}/g, encodeURIComponent(r.url)));
      }
      var n = { url: window.location.href, class_prefix: "s_" },
        r = t.extend({}, n, r),
        s = r.class_prefix.length,
        a = {
          twitter: "https://twitter.com/intent/tweet?url={url}",
          facebook:
            "https://www.facebook.com/sharer.php?s=100&u={url}&p[url]={url}",
        };
      return this.each(function (n, o) {
        for (var l = e(o), h = 0; h < l.length; h++) {
          var p = l[h];
          if (p.substr(0, s) == r.class_prefix && a[p.substr(s)]) {
            var c = i(p.substr(s));
            t(o)
              .attr("href", c)
              .click(function () {
                if (
                  -1 === t(this).attr("href").indexOf("http://") &&
                  -1 === t(this).attr("href").indexOf("https://")
                )
                  return window.open(t(this).attr("href")) && !1;
                var e = screen.width,
                  i = screen.height,
                  n = r.width ? r.width : e - 0.2 * e,
                  s = r.height ? r.height : i - 0.2 * i,
                  a = e / 2 - n / 2,
                  o = i / 2 - s / 2,
                  l =
                    "toolbar=0,status=0,width=" +
                    n +
                    ",height=" +
                    s +
                    ",top=" +
                    o +
                    ",left=" +
                    a;
                return window.open(t(this).attr("href"), "", l) && !1;
              });
          }
        }
      });
    };
  })(jQuery),
  (function (t) {
    function e(e, r, i, n) {
      var s = e.text().replace(/\s+/, " "),
        a = s.split(r),
        o = "";
      a.length &&
        (t(a).each(function (t, e) {
          o +=
            '<span class="' +
            i +
            (t + 1) +
            '" aria-hidden="true">' +
            e +
            "</span>" +
            n;
        }),
        e.attr("aria-label", s).empty().append(o));
    }
    var r = {
      init: function () {
        return this.each(function () {
          e(t(this), "", "char", "");
        });
      },
      words: function () {
        return this.each(function () {
          e(t(this), " ", "word", " ");
        });
      },
      lines: function () {
        return this.each(function () {
          var r = "eefec303079ad17405c889e092e105b0";
          e(t(this).children("br").replaceWith(r).end(), r, "line", "");
        });
      },
    };
    t.fn.lettering = function (e) {
      return e && r[e]
        ? r[e].apply(this, [].slice.call(arguments, 1))
        : "letters" !== e && e
        ? (t.error("Method " + e + " does not exist on jQuery.lettering"), this)
        : r.init.apply(this, [].slice.call(arguments, 0));
    };
  })(jQuery);
var aniRels = [];
(window.dropAniRels = function () {
  aniRels = [];
}),
  ($.fn.cryptonA = function t() {
    if (0 === this.length) return this;
    var e;
    if (arguments.length > 1) {
      for (var r = 0; r < arguments.length; r++) t.call(this, arguments[r]);
      return this;
    }
    if (((e = arguments[0]), $.isArray(e))) {
      for (var i = 0; i < e.length; i++) t.call(this, e[i]);
      return this;
    }
    var n = this.data("animBlock");
    n || ((n = this.closest(".animBlock")), this.data("animBlock", n));
    var s =
        n.data("animTop") ||
        n
          .prevAll()
          .get()
          .reduce(function (t, e) {
            return t + e.offsetHeight;
          }, 0),
      a = window.playScrollTop - s,
      o = n.height(),
      l = $.extend(
        { idA: "", tStart: 0, tDuration: o, attr: "", attrMin: 0, attrMax: 0 },
        e
      );
    l.tStart < 0 && (l.tStart += o),
      l.tDuration < 0 && (l.tDuration += o - l.tStart);
    var h = l.attr.split(":"),
      p = this.data("ida"),
      c = p ? p.indexOf(l.idA) : -1;
    p || ((p = []), this.data("ida", p), applyState(this, l, h, l.attrMin));
    var f = l.tStart + l.tDuration + 1,
      u = a < l.tStart ? -1 : a > f ? 1 : 0,
      d = aniRels[l.idA];
    if (u !== d && ((aniRels[l.idA] = u), 0 !== u && 0 !== d))
      return applyState(this, l, h, -1 === u ? l.attrMin : l.attrMax), this;
    if (0 === u) {
      if (
        (-1 === c && p.push(l.idA),
        this.hasClass("active") || this.addClass("active"),
        "" === l.attr)
      )
        return this;
      var m = (a - l.tStart) / l.tDuration,
        y = $.isNumeric(l.attrMin)
          ? interpolate(l.attrMin, l.attrMax, m)
          : isColor(l.attrMin)
          ? interpolateColor(l.attrMin, l.attrMax, m)
          : "";
      applyState(this, l, h, y);
    } else
      -1 !== c &&
        (p.splice(c, 1),
        0 === p.length && this.hasClass("active") && this.removeClass("active"),
        applyState(this, l, h, -1 === u ? l.attrMin : l.attrMax));
    return this;
  });
for (
  var prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""],
    delayAnimations = [0, 1450, 1400, 1500, 1300, 1350, 1300],
    movieElements = [],
    i = 0;
  6 >= i;
  i++
)
  movieElements.push(document.getElementById("bodymovin_" + i));
var animationParams = movieElements.map(function (t, e) {
    return {
      container: t,
      renderer: "svg",
      loop: !1,
      autoplay: !1,
      rendererSettings: { progressiveLoad: !0, hideOnTransparent: !0 },
      path: "/crypton-layout/anim_json/0" + e + ".json",
    };
  }),
  movies = [];
movieLoad(0);
var DEBUG_MOVIES = !1;
window.setGoToAndStop = function (t) {
  var e = [],
    r = [];
  movies.forEach(function (i, n) {
    if (i.isLoaded) {
      var s = $cache("#bodymovin_" + n),
        a = s.closest(".animBlock"),
        o =
          a.data("animTop") ||
          a
            .prevAll()
            .get()
            .reduce(function (t, e) {
              return t + e.offsetHeight;
            }, 0),
        l = t.scrollTop - o - delayAnimations[n],
        h = s.data("prevPosition");
      (l = Math.min(Math.max(0, l), a.data("maxPosition"))),
        l !== h && (i.goToAndStop(l), s.data("prevPosition", l)),
        DEBUG_MOVIES &&
          (r.push(Math.round(t.scrollTop - o)), e.push(Math.round(l)));
    }
  }),
    DEBUG_MOVIES &&
      $cache(".nav-main_brand").html(
        "<table><tr><td>" +
          t.scrollTop +
          "</td><td>" +
          r.join("</td><td>") +
          "</td></tr><tr><td>" +
          t.width +
          "x" +
          t.height +
          "</td><td>" +
          e.join("</td><td>") +
          "</td></tr></table>"
      );
};
var DEBUG_MODE = !1;
(window.subscribeAnimationFrame = function (t, e, r, i) {
  function n(t) {
    var i = s(),
      c = {},
      f = !1;
    if (
      (Object.keys(i).forEach(function (t) {
        (c[t] = i[t] !== a[t]), !f && c[t] && (f = !0);
      }),
      f && (e(i, a, c, t), (a = i)),
      "function" != typeof r || r(i, t))
    ) {
      if (DEBUG_MODE) {
        var u = t - o;
        u > 1e3 && ((h = 0), (o = t)),
          (h = (h + 1) % l),
          0 === h && ((p = Math.round((1e3 * l) / u)), (o = t)),
          $cache(".nav-main_brand").html(
            "<table><tr><td>" +
              a.scrollTop +
              "</td><td>" +
              p +
              " fps</td></tr><tr><td>" +
              a.width +
              "x" +
              a.height +
              "</td><td>&nbsp;</td></tr></table>"
          );
      }
      window.requestAnimationFrame(n);
    }
  }
  var s = createGetProps(t, i),
    a = {},
    o = 0,
    l = 10,
    h = 0,
    p = 0;
  window.requestAnimationFrame(n);
}),
  (window.$scrollable = $(window));
var $cachePoll = {};
(window.$cache = function (t) {
  return $cachePoll[t] || ($cachePoll[t] = $(t));
}),
  $(function () {
    startScenario(1e3, !0);
  });
var scenarioStarted = !1;
window.resetScenario = function () {
  scenarioStarted &&
    ($cache(".animBlock").each(function (t, e) {
      var r = $(e);
      r.removeData("animTop");
    }),
    $("html, body").scrollTop(0),
    startScenario(100));
};
var $socialShare = $(".social-share");
$(".social-share__title").click(function () {
  $socialShare.addClass("hover");
}),
  $("body").click(function (t) {
    $(t.currentTarget).closest(".social-share__title").length > 0 ||
      $socialShare.removeClass("hover");
  }),
  $(".share").ShareLink({ width: 640, height: 480 });
var subTextDelay = 300,
  textDuration = 3e3,
  textReverseDuration = 2400,
  subTextDuration = 1500,
  subTextReverseDuration = 500,
  defaultTypingDuration = 1200,
  scenario,
  horizontal,
  idA,
  $face = $cache(".nav-main_brand");
$face.hover(
  function () {
    window.globalEye = "0";
  },
  function () {
    window.globalEye = "";
  }
);
var defaultFace = $face.html(),
  defaultEye = defaultFace.split("")[0],
  defaultMouth = defaultFace.split("")[1],
  mouths = ["_", "\u0323", "\u0325", "\u032e", "\u0331"],
  prevFace = defaultFace,
  prevFrameWithPrint = !1;
(window.faceTalk = function (t, e) {
  var r = getCurrentEye(t),
    i = r + getCurrentMouth(t, e) + r;
  i !== prevFace &&
    (i && $face.html("<span>" + i.split("").join("</span><span>") + "</span>"),
    (prevFace = i)),
    (prevFrameWithPrint = window.frameWithPrint);
}),
  (function (t) {
    t("a[data-target_id]").click(function () {
      var e = t(this);
      return $cache(".b_menu").removeClass("active"), scrollByLink(e), !1;
    }),
      t("a.nav-main_brand").click(function () {
        return (
          $cache(".b_menu").removeClass("active"),
          window.location.hash &&
            "#" !== window.location.hash &&
            (window.location.hash = ""),
          window.resetScenario(),
          !1
        );
      }),
      t(".js-menuToggle").click(function (t) {
        t.preventDefault(), $cache(".b_menu").toggleClass("active");
      }),
      (window.scrollByLink = function (t) {
        var e = $cache(t.attr("data-target_id")),
          r = parseInt(t.attr("data-target_frame")),
          i = t.attr("href").split("#")[1],
          n = t.data("targetJump"),
          s = e.closest(".animBlock");
        n && 0 > n && (s = s.prev());
        var a =
            s.data("animTop") ||
            s
              .prevAll()
              .get()
              .reduce(function (t, e) {
                return t + e.offsetHeight;
              }, 0),
          o = n ? a : $scrollable.scrollTop(),
          l = 20 * Math.sqrt(Math.abs(a + r - o)),
          h = $scrollable[0] === window ? $cache("html, body") : $scrollable;
        h.stop(!0),
          n && h.scrollTop(a),
          h.animate({ scrollTop: a + r }, l, function () {
            window.location.hash = i || "";
          });
      });
  })(jQuery);
