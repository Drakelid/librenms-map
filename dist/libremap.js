//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region node_modules/cytoscape/dist/cytoscape.esm.mjs
function u(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function d(e) {
	if (Array.isArray(e)) return e;
}
function f(e) {
	if (Array.isArray(e)) return u(e);
}
function p(e, t) {
	if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
}
function m(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, T(r.key), r);
	}
}
function h(e, t, n) {
	return t && m(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function g(e, t) {
	var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (!n) {
		if (Array.isArray(e) || (n = D(e)) || t) {
			n && (e = n);
			var r = 0, i = function() {};
			return {
				s: i,
				n: function() {
					return r >= e.length ? { done: !0 } : {
						done: !1,
						value: e[r++]
					};
				},
				e: function(e) {
					throw e;
				},
				f: i
			};
		}
		throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	var a, o = !0, s = !1;
	return {
		s: function() {
			n = n.call(e);
		},
		n: function() {
			var e = n.next();
			return o = e.done, e;
		},
		e: function(e) {
			s = !0, a = e;
		},
		f: function() {
			try {
				o || n.return == null || n.return();
			} finally {
				if (s) throw a;
			}
		}
	};
}
function _(e, t, n) {
	return (t = T(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function v(e) {
	if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function y(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function b() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function x() {
	throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function S(e, t) {
	return d(e) || y(e, t) || D(e, t) || b();
}
function C(e) {
	return f(e) || v(e) || D(e) || x();
}
function w(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t);
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return String(e);
}
function T(e) {
	var t = w(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function E(e) {
	"@babel/helpers - typeof";
	return E = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, E(e);
}
function D(e, t) {
	if (e) {
		if (typeof e == "string") return u(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? u(e, t) : void 0;
	}
}
var O = typeof window > "u" ? null : window, k = O ? O.navigator : null;
O && O.document;
var A = E(""), j = E({}), M = E(function() {}), N = typeof HTMLElement > "u" ? "undefined" : E(HTMLElement), P = function(e) {
	return e && e.instanceString && I(e.instanceString) ? e.instanceString() : null;
}, F = function(e) {
	return e != null && E(e) == A;
}, I = function(e) {
	return e != null && E(e) === M;
}, L = function(e) {
	return !U(e) && (Array.isArray ? Array.isArray(e) : e != null && e instanceof Array);
}, R = function(e) {
	return e != null && E(e) === j && !L(e) && e.constructor === Object;
}, z = function(e) {
	return e != null && E(e) === j;
}, B = function(e) {
	return e != null && E(e) === E(1) && !isNaN(e);
}, V = function(e) {
	return B(e) && Math.floor(e) === e;
}, H = function(e) {
	if (N !== "undefined") return e != null && e instanceof HTMLElement;
}, U = function(e) {
	return W(e) || G(e);
}, W = function(e) {
	return P(e) === "collection" && e._private.single;
}, G = function(e) {
	return P(e) === "collection" && !e._private.single;
}, K = function(e) {
	return P(e) === "core";
}, q = function(e) {
	return P(e) === "stylesheet";
}, ee = function(e) {
	return P(e) === "event";
}, J = function(e) {
	return e == null || !!(e === "" || e.match(/^\s+$/));
}, Y = function(e) {
	return typeof HTMLElement > "u" ? !1 : e instanceof HTMLElement;
}, te = function(e) {
	return R(e) && B(e.x1) && B(e.x2) && B(e.y1) && B(e.y2);
}, ne = function(e) {
	return z(e) && I(e.then);
}, re = function() {
	return k && k.userAgent.match(/msie|trident|edge/i);
}, ie = function(e, t) {
	t ||= function() {
		if (arguments.length === 1) return arguments[0];
		if (arguments.length === 0) return "undefined";
		for (var e = [], t = 0; t < arguments.length; t++) e.push(arguments[t]);
		return e.join("$");
	};
	var n = function() {
		var r = this, i = arguments, a, o = t.apply(r, i), s = n.cache;
		return (a = s[o]) || (a = s[o] = e.apply(r, i)), a;
	};
	return n.cache = {}, n;
}, ae = ie(function(e) {
	return e.replace(/([A-Z])/g, function(e) {
		return "-" + e.toLowerCase();
	});
}), oe = ie(function(e) {
	return e.replace(/(-\w)/g, function(e) {
		return e[1].toUpperCase();
	});
}), se = ie(function(e, t) {
	return e + t[0].toUpperCase() + t.substring(1);
}, function(e, t) {
	return e + "$" + t;
}), ce = function(e) {
	return J(e) ? e : e.charAt(0).toUpperCase() + e.substring(1);
}, le = function(e, t) {
	return e.slice(-1 * t.length) === t;
}, ue = "(?:[-+]?(?:(?:\\d+|\\d*\\.\\d+)(?:[Ee][+-]?\\d+)?))", de = "rgb[a]?\\((" + ue + "[%]?)\\s*,\\s*(" + ue + "[%]?)\\s*,\\s*(" + ue + "[%]?)(?:\\s*,\\s*(" + ue + "))?\\)", fe = "rgb[a]?\\((?:" + ue + "[%]?)\\s*,\\s*(?:" + ue + "[%]?)\\s*,\\s*(?:" + ue + "[%]?)(?:\\s*,\\s*(?:" + ue + "))?\\)", pe = "hsl[a]?\\((" + ue + ")\\s*,\\s*(" + ue + "[%])\\s*,\\s*(" + ue + "[%])(?:\\s*,\\s*(" + ue + "))?\\)", me = "hsl[a]?\\((?:" + ue + ")\\s*,\\s*(?:" + ue + "[%])\\s*,\\s*(?:" + ue + "[%])(?:\\s*,\\s*(?:" + ue + "))?\\)", he = "\\#[0-9a-fA-F]{3}", X = "\\#[0-9a-fA-F]{6}", ge = function(e, t) {
	return e < t ? -1 : +(e > t);
}, _e = function(e, t) {
	return -1 * ge(e, t);
}, Z = Object.assign == null ? function(e) {
	for (var t = arguments, n = 1; n < t.length; n++) {
		var r = t[n];
		if (r != null) for (var i = Object.keys(r), a = 0; a < i.length; a++) {
			var o = i[a];
			e[o] = r[o];
		}
	}
	return e;
} : Object.assign.bind(Object), ve = function(e) {
	if (!(e.length !== 4 && e.length !== 7 || e[0] !== "#")) {
		var t = e.length === 4, n, r, i, a = 16;
		return t ? (n = parseInt(e[1] + e[1], a), r = parseInt(e[2] + e[2], a), i = parseInt(e[3] + e[3], a)) : (n = parseInt(e[1] + e[2], a), r = parseInt(e[3] + e[4], a), i = parseInt(e[5] + e[6], a)), [
			n,
			r,
			i
		];
	}
}, ye = function(e) {
	var t, n, r, i, a, o, s, c;
	function l(e, t, n) {
		return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
	}
	var u = RegExp("^" + pe + "$").exec(e);
	if (u) {
		if (n = parseInt(u[1]), n < 0 ? n = (360 - -1 * n % 360) % 360 : n > 360 && (n %= 360), n /= 360, r = parseFloat(u[2]), r < 0 || r > 100 || (r /= 100, i = parseFloat(u[3]), i < 0 || i > 100) || (i /= 100, a = u[4], a !== void 0 && (a = parseFloat(a), a < 0 || a > 1))) return;
		if (r === 0) o = s = c = Math.round(i * 255);
		else {
			var d = i < .5 ? i * (1 + r) : i + r - i * r, f = 2 * i - d;
			o = Math.round(255 * l(f, d, n + 1 / 3)), s = Math.round(255 * l(f, d, n)), c = Math.round(255 * l(f, d, n - 1 / 3));
		}
		t = [
			o,
			s,
			c,
			a
		];
	}
	return t;
}, be = function(e) {
	var t, n = RegExp("^" + de + "$").exec(e);
	if (n) {
		t = [];
		for (var r = [], i = 1; i <= 3; i++) {
			var a = n[i];
			if (a[a.length - 1] === "%" && (r[i] = !0), a = parseFloat(a), r[i] && (a = a / 100 * 255), a < 0 || a > 255) return;
			t.push(Math.floor(a));
		}
		var o = r[1] || r[2] || r[3], s = r[1] && r[2] && r[3];
		if (o && !s) return;
		var c = n[4];
		if (c !== void 0) {
			if (c = parseFloat(c), c < 0 || c > 1) return;
			t.push(c);
		}
	}
	return t;
}, xe = function(e) {
	return Ce[e.toLowerCase()];
}, Se = function(e) {
	return (L(e) ? e : null) || xe(e) || ve(e) || be(e) || ye(e);
}, Ce = {
	transparent: [
		0,
		0,
		0,
		0
	],
	aliceblue: [
		240,
		248,
		255
	],
	antiquewhite: [
		250,
		235,
		215
	],
	aqua: [
		0,
		255,
		255
	],
	aquamarine: [
		127,
		255,
		212
	],
	azure: [
		240,
		255,
		255
	],
	beige: [
		245,
		245,
		220
	],
	bisque: [
		255,
		228,
		196
	],
	black: [
		0,
		0,
		0
	],
	blanchedalmond: [
		255,
		235,
		205
	],
	blue: [
		0,
		0,
		255
	],
	blueviolet: [
		138,
		43,
		226
	],
	brown: [
		165,
		42,
		42
	],
	burlywood: [
		222,
		184,
		135
	],
	cadetblue: [
		95,
		158,
		160
	],
	chartreuse: [
		127,
		255,
		0
	],
	chocolate: [
		210,
		105,
		30
	],
	coral: [
		255,
		127,
		80
	],
	cornflowerblue: [
		100,
		149,
		237
	],
	cornsilk: [
		255,
		248,
		220
	],
	crimson: [
		220,
		20,
		60
	],
	cyan: [
		0,
		255,
		255
	],
	darkblue: [
		0,
		0,
		139
	],
	darkcyan: [
		0,
		139,
		139
	],
	darkgoldenrod: [
		184,
		134,
		11
	],
	darkgray: [
		169,
		169,
		169
	],
	darkgreen: [
		0,
		100,
		0
	],
	darkgrey: [
		169,
		169,
		169
	],
	darkkhaki: [
		189,
		183,
		107
	],
	darkmagenta: [
		139,
		0,
		139
	],
	darkolivegreen: [
		85,
		107,
		47
	],
	darkorange: [
		255,
		140,
		0
	],
	darkorchid: [
		153,
		50,
		204
	],
	darkred: [
		139,
		0,
		0
	],
	darksalmon: [
		233,
		150,
		122
	],
	darkseagreen: [
		143,
		188,
		143
	],
	darkslateblue: [
		72,
		61,
		139
	],
	darkslategray: [
		47,
		79,
		79
	],
	darkslategrey: [
		47,
		79,
		79
	],
	darkturquoise: [
		0,
		206,
		209
	],
	darkviolet: [
		148,
		0,
		211
	],
	deeppink: [
		255,
		20,
		147
	],
	deepskyblue: [
		0,
		191,
		255
	],
	dimgray: [
		105,
		105,
		105
	],
	dimgrey: [
		105,
		105,
		105
	],
	dodgerblue: [
		30,
		144,
		255
	],
	firebrick: [
		178,
		34,
		34
	],
	floralwhite: [
		255,
		250,
		240
	],
	forestgreen: [
		34,
		139,
		34
	],
	fuchsia: [
		255,
		0,
		255
	],
	gainsboro: [
		220,
		220,
		220
	],
	ghostwhite: [
		248,
		248,
		255
	],
	gold: [
		255,
		215,
		0
	],
	goldenrod: [
		218,
		165,
		32
	],
	gray: [
		128,
		128,
		128
	],
	grey: [
		128,
		128,
		128
	],
	green: [
		0,
		128,
		0
	],
	greenyellow: [
		173,
		255,
		47
	],
	honeydew: [
		240,
		255,
		240
	],
	hotpink: [
		255,
		105,
		180
	],
	indianred: [
		205,
		92,
		92
	],
	indigo: [
		75,
		0,
		130
	],
	ivory: [
		255,
		255,
		240
	],
	khaki: [
		240,
		230,
		140
	],
	lavender: [
		230,
		230,
		250
	],
	lavenderblush: [
		255,
		240,
		245
	],
	lawngreen: [
		124,
		252,
		0
	],
	lemonchiffon: [
		255,
		250,
		205
	],
	lightblue: [
		173,
		216,
		230
	],
	lightcoral: [
		240,
		128,
		128
	],
	lightcyan: [
		224,
		255,
		255
	],
	lightgoldenrodyellow: [
		250,
		250,
		210
	],
	lightgray: [
		211,
		211,
		211
	],
	lightgreen: [
		144,
		238,
		144
	],
	lightgrey: [
		211,
		211,
		211
	],
	lightpink: [
		255,
		182,
		193
	],
	lightsalmon: [
		255,
		160,
		122
	],
	lightseagreen: [
		32,
		178,
		170
	],
	lightskyblue: [
		135,
		206,
		250
	],
	lightslategray: [
		119,
		136,
		153
	],
	lightslategrey: [
		119,
		136,
		153
	],
	lightsteelblue: [
		176,
		196,
		222
	],
	lightyellow: [
		255,
		255,
		224
	],
	lime: [
		0,
		255,
		0
	],
	limegreen: [
		50,
		205,
		50
	],
	linen: [
		250,
		240,
		230
	],
	magenta: [
		255,
		0,
		255
	],
	maroon: [
		128,
		0,
		0
	],
	mediumaquamarine: [
		102,
		205,
		170
	],
	mediumblue: [
		0,
		0,
		205
	],
	mediumorchid: [
		186,
		85,
		211
	],
	mediumpurple: [
		147,
		112,
		219
	],
	mediumseagreen: [
		60,
		179,
		113
	],
	mediumslateblue: [
		123,
		104,
		238
	],
	mediumspringgreen: [
		0,
		250,
		154
	],
	mediumturquoise: [
		72,
		209,
		204
	],
	mediumvioletred: [
		199,
		21,
		133
	],
	midnightblue: [
		25,
		25,
		112
	],
	mintcream: [
		245,
		255,
		250
	],
	mistyrose: [
		255,
		228,
		225
	],
	moccasin: [
		255,
		228,
		181
	],
	navajowhite: [
		255,
		222,
		173
	],
	navy: [
		0,
		0,
		128
	],
	oldlace: [
		253,
		245,
		230
	],
	olive: [
		128,
		128,
		0
	],
	olivedrab: [
		107,
		142,
		35
	],
	orange: [
		255,
		165,
		0
	],
	orangered: [
		255,
		69,
		0
	],
	orchid: [
		218,
		112,
		214
	],
	palegoldenrod: [
		238,
		232,
		170
	],
	palegreen: [
		152,
		251,
		152
	],
	paleturquoise: [
		175,
		238,
		238
	],
	palevioletred: [
		219,
		112,
		147
	],
	papayawhip: [
		255,
		239,
		213
	],
	peachpuff: [
		255,
		218,
		185
	],
	peru: [
		205,
		133,
		63
	],
	pink: [
		255,
		192,
		203
	],
	plum: [
		221,
		160,
		221
	],
	powderblue: [
		176,
		224,
		230
	],
	purple: [
		128,
		0,
		128
	],
	red: [
		255,
		0,
		0
	],
	rosybrown: [
		188,
		143,
		143
	],
	royalblue: [
		65,
		105,
		225
	],
	saddlebrown: [
		139,
		69,
		19
	],
	salmon: [
		250,
		128,
		114
	],
	sandybrown: [
		244,
		164,
		96
	],
	seagreen: [
		46,
		139,
		87
	],
	seashell: [
		255,
		245,
		238
	],
	sienna: [
		160,
		82,
		45
	],
	silver: [
		192,
		192,
		192
	],
	skyblue: [
		135,
		206,
		235
	],
	slateblue: [
		106,
		90,
		205
	],
	slategray: [
		112,
		128,
		144
	],
	slategrey: [
		112,
		128,
		144
	],
	snow: [
		255,
		250,
		250
	],
	springgreen: [
		0,
		255,
		127
	],
	steelblue: [
		70,
		130,
		180
	],
	tan: [
		210,
		180,
		140
	],
	teal: [
		0,
		128,
		128
	],
	thistle: [
		216,
		191,
		216
	],
	tomato: [
		255,
		99,
		71
	],
	turquoise: [
		64,
		224,
		208
	],
	violet: [
		238,
		130,
		238
	],
	wheat: [
		245,
		222,
		179
	],
	white: [
		255,
		255,
		255
	],
	whitesmoke: [
		245,
		245,
		245
	],
	yellow: [
		255,
		255,
		0
	],
	yellowgreen: [
		154,
		205,
		50
	]
}, we = function(e) {
	for (var t = e.map, n = e.keys, r = n.length, i = 0; i < r; i++) {
		var a = n[i];
		if (R(a)) throw Error("Tried to set map with object key");
		i < n.length - 1 ? (t[a] ?? (t[a] = {}), t = t[a]) : t[a] = e.value;
	}
}, Te = function(e) {
	for (var t = e.map, n = e.keys, r = n.length, i = 0; i < r; i++) {
		var a = n[i];
		if (R(a)) throw Error("Tried to get map with object key");
		if (t = t[a], t == null) return t;
	}
	return t;
}, Ee = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function De(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Oe, ke;
function Ae() {
	if (ke) return Oe;
	ke = 1;
	function e(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	return Oe = e, Oe;
}
var je, Me;
function Ne() {
	return Me ? je : (Me = 1, je = typeof Ee == "object" && Ee && Ee.Object === Object && Ee, je);
}
var Pe, Fe;
function Ie() {
	if (Fe) return Pe;
	Fe = 1;
	var e = Ne(), t = typeof self == "object" && self && self.Object === Object && self;
	return Pe = e || t || Function("return this")(), Pe;
}
var Le, Re;
function ze() {
	if (Re) return Le;
	Re = 1;
	var e = Ie();
	return Le = function() {
		return e.Date.now();
	}, Le;
}
var Be, Ve;
function He() {
	if (Ve) return Be;
	Ve = 1;
	var e = /\s/;
	function t(t) {
		for (var n = t.length; n-- && e.test(t.charAt(n)););
		return n;
	}
	return Be = t, Be;
}
var Ue, We;
function Ge() {
	if (We) return Ue;
	We = 1;
	var e = He(), t = /^\s+/;
	function n(n) {
		return n && n.slice(0, e(n) + 1).replace(t, "");
	}
	return Ue = n, Ue;
}
var Ke, qe;
function Je() {
	return qe ? Ke : (qe = 1, Ke = Ie().Symbol, Ke);
}
var Ye, Xe;
function Ze() {
	if (Xe) return Ye;
	Xe = 1;
	var e = Je(), t = Object.prototype, n = t.hasOwnProperty, r = t.toString, i = e ? e.toStringTag : void 0;
	function a(e) {
		var t = n.call(e, i), a = e[i];
		try {
			e[i] = void 0;
			var o = !0;
		} catch {}
		var s = r.call(e);
		return o && (t ? e[i] = a : delete e[i]), s;
	}
	return Ye = a, Ye;
}
var Qe, $e;
function et() {
	if ($e) return Qe;
	$e = 1;
	var e = Object.prototype.toString;
	function t(t) {
		return e.call(t);
	}
	return Qe = t, Qe;
}
var tt, nt;
function rt() {
	if (nt) return tt;
	nt = 1;
	var e = Je(), t = Ze(), n = et(), r = "[object Null]", i = "[object Undefined]", a = e ? e.toStringTag : void 0;
	function o(e) {
		return e == null ? e === void 0 ? i : r : a && a in Object(e) ? t(e) : n(e);
	}
	return tt = o, tt;
}
var it, at;
function ot() {
	if (at) return it;
	at = 1;
	function e(e) {
		return typeof e == "object" && !!e;
	}
	return it = e, it;
}
var Q, st;
function ct() {
	if (st) return Q;
	st = 1;
	var e = rt(), t = ot(), n = "[object Symbol]";
	function r(r) {
		return typeof r == "symbol" || t(r) && e(r) == n;
	}
	return Q = r, Q;
}
var lt, ut;
function dt() {
	if (ut) return lt;
	ut = 1;
	var e = Ge(), t = Ae(), n = ct(), r = NaN, i = /^[-+]0x[0-9a-f]+$/i, a = /^0b[01]+$/i, o = /^0o[0-7]+$/i, s = parseInt;
	function c(c) {
		if (typeof c == "number") return c;
		if (n(c)) return r;
		if (t(c)) {
			var l = typeof c.valueOf == "function" ? c.valueOf() : c;
			c = t(l) ? l + "" : l;
		}
		if (typeof c != "string") return c === 0 ? c : +c;
		c = e(c);
		var u = a.test(c);
		return u || o.test(c) ? s(c.slice(2), u ? 2 : 8) : i.test(c) ? r : +c;
	}
	return lt = c, lt;
}
var ft, pt;
function mt() {
	if (pt) return ft;
	pt = 1;
	var e = Ae(), t = ze(), n = dt(), r = "Expected a function", i = Math.max, a = Math.min;
	function o(o, s, c) {
		var l, u, d, f, p, m, h = 0, g = !1, _ = !1, v = !0;
		if (typeof o != "function") throw TypeError(r);
		s = n(s) || 0, e(c) && (g = !!c.leading, _ = "maxWait" in c, d = _ ? i(n(c.maxWait) || 0, s) : d, v = "trailing" in c ? !!c.trailing : v);
		function y(e) {
			var t = l, n = u;
			return l = u = void 0, h = e, f = o.apply(n, t), f;
		}
		function b(e) {
			return h = e, p = setTimeout(C, s), g ? y(e) : f;
		}
		function x(e) {
			var t = e - m, n = e - h, r = s - t;
			return _ ? a(r, d - n) : r;
		}
		function S(e) {
			var t = e - m, n = e - h;
			return m === void 0 || t >= s || t < 0 || _ && n >= d;
		}
		function C() {
			var e = t();
			if (S(e)) return w(e);
			p = setTimeout(C, x(e));
		}
		function w(e) {
			return p = void 0, v && l ? y(e) : (l = u = void 0, f);
		}
		function T() {
			p !== void 0 && clearTimeout(p), h = 0, l = m = u = p = void 0;
		}
		function E() {
			return p === void 0 ? f : w(t());
		}
		function D() {
			var e = t(), n = S(e);
			if (l = arguments, u = this, m = e, n) {
				if (p === void 0) return b(m);
				if (_) return clearTimeout(p), p = setTimeout(C, s), y(m);
			}
			return p === void 0 && (p = setTimeout(C, s)), f;
		}
		return D.cancel = T, D.flush = E, D;
	}
	return ft = o, ft;
}
var ht = /*@__PURE__*/ De(mt()), gt = O ? O.performance : null, _t = gt && gt.now ? function() {
	return gt.now();
} : function() {
	return Date.now();
}, vt = function() {
	if (O) {
		if (O.requestAnimationFrame) return function(e) {
			O.requestAnimationFrame(e);
		};
		if (O.mozRequestAnimationFrame) return function(e) {
			O.mozRequestAnimationFrame(e);
		};
		if (O.webkitRequestAnimationFrame) return function(e) {
			O.webkitRequestAnimationFrame(e);
		};
		if (O.msRequestAnimationFrame) return function(e) {
			O.msRequestAnimationFrame(e);
		};
	}
	return function(e) {
		e && setTimeout(function() {
			e(_t());
		}, 1e3 / 60);
	};
}(), yt = function(e) {
	return vt(e);
}, bt = _t, xt = 9261, St = 65599, Ct = 5381, wt = function(e) {
	for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : xt, n; n = e.next(), !n.done;) t = t * St + n.value | 0;
	return t;
}, Tt = function(e) {
	return (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : xt) * St + e | 0;
}, Et = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ct;
	return (t << 5) + t + e | 0;
}, Dt = function(e, t) {
	return e * 2097152 + t;
}, Ot = function(e) {
	return e[0] * 2097152 + e[1];
}, kt = function(e, t) {
	return [Tt(e[0], t[0]), Et(e[1], t[1])];
}, At = function(e, t) {
	var n = {
		value: 0,
		done: !1
	}, r = 0, i = e.length;
	return wt({ next: function() {
		return r < i ? n.value = e[r++] : n.done = !0, n;
	} }, t);
}, jt = function(e, t) {
	var n = {
		value: 0,
		done: !1
	}, r = 0, i = e.length;
	return wt({ next: function() {
		return r < i ? n.value = e.charCodeAt(r++) : n.done = !0, n;
	} }, t);
}, Mt = function() {
	return Nt(arguments);
}, Nt = function(e) {
	for (var t, n = 0; n < e.length; n++) {
		var r = e[n];
		t = n === 0 ? jt(r) : jt(r, t);
	}
	return t;
};
function Pt(e, t, n, r, i) {
	var a = i * Math.PI / 180;
	return {
		x: Math.cos(a) * (e - n) - Math.sin(a) * (t - r) + n,
		y: Math.sin(a) * (e - n) + Math.cos(a) * (t - r) + r
	};
}
var Ft = function(e, t, n, r, i, a) {
	return {
		x: (e - n) * i + n,
		y: (t - r) * a + r
	};
};
function It(e, t, n) {
	if (n === 0) return e;
	var r = (t.x1 + t.x2) / 2, i = (t.y1 + t.y2) / 2, a = t.w / t.h, o = 1 / a, s = Pt(e.x, e.y, r, i, n), c = Ft(s.x, s.y, r, i, a, o);
	return {
		x: c.x,
		y: c.y
	};
}
var Lt = !0, Rt = console.warn != null, zt = console.trace != null, Bt = 2 ** 53 - 1 || 9007199254740991, Vt = function() {
	return !0;
}, Ht = function() {
	return !1;
}, Ut = function() {
	return 0;
}, Wt = function() {}, Gt = function(e) {
	throw Error(e);
}, Kt = function(e) {
	if (e !== void 0) Lt = !!e;
	else return Lt;
}, qt = function(e) {
	Kt() && (Rt ? console.warn(e) : (console.log(e), zt && console.trace()));
}, Jt = function(e) {
	return Z({}, e);
}, Yt = function(e) {
	return e == null ? e : L(e) ? e.slice() : R(e) ? Jt(e) : e;
}, Xt = function(e) {
	return e.slice();
}, Zt = function(e, t) {
	for (t = e = ""; e++ < 36; t += e * 51 & 52 ? (e ^ 15 ? 8 ^ Math.random() * (e ^ 20 ? 16 : 4) : 4).toString(16) : "-");
	return t;
}, Qt = {}, $t = function() {
	return Qt;
}, en = function(e) {
	var t = Object.keys(e);
	return function(n) {
		for (var r = {}, i = 0; i < t.length; i++) {
			var a = t[i], o = n?.[a];
			r[a] = o === void 0 ? e[a] : o;
		}
		return r;
	};
}, tn = function(e, t, n) {
	for (var r = e.length - 1; r >= 0; r--) e[r] === t && e.splice(r, 1);
}, nn = function(e) {
	e.splice(0, e.length);
}, rn = function(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		e.push(r);
	}
}, an = function(e, t, n) {
	return n && (t = se(n, t)), e[t];
}, on = function(e, t, n, r) {
	n && (t = se(n, t)), e[t] = r;
}, sn = typeof Map < "u" ? Map : /* @__PURE__ */ function() {
	function e() {
		p(this, e), this._obj = {};
	}
	return h(e, [
		{
			key: "set",
			value: function(e, t) {
				return this._obj[e] = t, this;
			}
		},
		{
			key: "delete",
			value: function(e) {
				return this._obj[e] = void 0, this;
			}
		},
		{
			key: "clear",
			value: function() {
				this._obj = {};
			}
		},
		{
			key: "has",
			value: function(e) {
				return this._obj[e] !== void 0;
			}
		},
		{
			key: "get",
			value: function(e) {
				return this._obj[e];
			}
		}
	]);
}(), cn = "undefined", ln = /*#__PURE__*/ function() {
	function e(t) {
		if (p(this, e), this._obj = Object.create(null), this.size = 0, t != null) for (var n = t.instanceString != null && t.instanceString() === this.instanceString() ? t.toArray() : t, r = 0; r < n.length; r++) this.add(n[r]);
	}
	return h(e, [
		{
			key: "instanceString",
			value: function() {
				return "set";
			}
		},
		{
			key: "add",
			value: function(e) {
				var t = this._obj;
				t[e] !== 1 && (t[e] = 1, this.size++);
			}
		},
		{
			key: "delete",
			value: function(e) {
				var t = this._obj;
				t[e] === 1 && (t[e] = 0, this.size--);
			}
		},
		{
			key: "clear",
			value: function() {
				this._obj = Object.create(null);
			}
		},
		{
			key: "has",
			value: function(e) {
				return this._obj[e] === 1;
			}
		},
		{
			key: "toArray",
			value: function() {
				var e = this;
				return Object.keys(this._obj).filter(function(t) {
					return e.has(t);
				});
			}
		},
		{
			key: "forEach",
			value: function(e, t) {
				return this.toArray().forEach(e, t);
			}
		}
	]);
}(), un = (typeof Set > "u" ? "undefined" : E(Set)) === cn ? ln : Set, dn = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
	if (e === void 0 || t === void 0 || !K(e)) {
		Gt("An element must have a core reference and parameters set");
		return;
	}
	var r = t.group;
	if (r ??= t.data && t.data.source != null && t.data.target != null ? "edges" : "nodes", r !== "nodes" && r !== "edges") {
		Gt("An element must be of type `nodes` or `edges`; you specified `" + r + "`");
		return;
	}
	this.length = 1, this[0] = this;
	var i = this._private = {
		cy: e,
		single: !0,
		data: t.data || {},
		position: t.position || {
			x: 0,
			y: 0
		},
		autoWidth: void 0,
		autoHeight: void 0,
		autoPadding: void 0,
		compoundBoundsClean: !1,
		listeners: [],
		group: r,
		style: {},
		rstyle: {},
		styleCxts: [],
		styleKeys: {},
		removed: !0,
		selected: !!t.selected,
		selectable: t.selectable === void 0 || !!t.selectable,
		locked: !!t.locked,
		grabbed: !1,
		grabbable: t.grabbable === void 0 || !!t.grabbable,
		pannable: t.pannable === void 0 ? r === "edges" : !!t.pannable,
		active: !1,
		classes: new un(),
		animation: {
			current: [],
			queue: []
		},
		rscratch: {},
		scratch: t.scratch || {},
		edges: [],
		children: [],
		parent: t.parent && t.parent.isNode() ? t.parent : null,
		traversalCache: {},
		backgrounding: !1,
		bbCache: null,
		bbCacheShift: {
			x: 0,
			y: 0
		},
		bodyBounds: null,
		overlayBounds: null,
		labelBounds: {
			all: null,
			source: null,
			target: null,
			main: null
		},
		arrowBounds: {
			source: null,
			target: null,
			"mid-source": null,
			"mid-target": null
		}
	};
	if (i.position.x ?? (i.position.x = 0), i.position.y ?? (i.position.y = 0), t.renderedPosition) {
		var a = t.renderedPosition, o = e.pan(), s = e.zoom();
		i.position = {
			x: (a.x - o.x) / s,
			y: (a.y - o.y) / s
		};
	}
	var c = [];
	L(t.classes) ? c = t.classes : F(t.classes) && (c = t.classes.split(/\s+/));
	for (var l = 0, u = c.length; l < u; l++) {
		var d = c[l];
		d && d !== "" && i.classes.add(d);
	}
	this.createEmitter(), (n === void 0 || n) && this.restore();
	var f = t.style || t.css;
	f && (qt("Setting a `style` bypass at element creation should be done only when absolutely necessary.  Try to use the stylesheet instead."), this.style(f));
}, fn = function(e) {
	return e = {
		bfs: e.bfs || !e.dfs,
		dfs: e.dfs || !e.bfs
	}, function(t, n, r) {
		var i;
		R(t) && !U(t) && (i = t, t = i.roots || i.root, n = i.visit, r = i.directed), r = arguments.length === 2 && !I(n) ? n : r, n = I(n) ? n : function() {};
		for (var a = this._private.cy, o = t = F(t) ? this.filter(t) : t, s = [], c = [], l = {}, u = {}, d = {}, f = 0, p, m = this.byGroup(), h = m.nodes, g = m.edges, _ = 0; _ < o.length; _++) {
			var v = o[_], y = v.id();
			v.isNode() && (s.unshift(v), e.bfs && (d[y] = !0, c.push(v)), u[y] = 0);
		}
		for (var b = function() {
			var t = e.bfs ? s.shift() : s.pop(), i = t.id();
			if (e.dfs) {
				if (d[i]) return 0;
				d[i] = !0, c.push(t);
			}
			var a = u[i], o = l[i], m = o == null ? null : o.source(), _ = o == null ? null : o.target(), v = o == null ? void 0 : t.same(m) ? _[0] : m[0], y = n(t, o, v, f++, a);
			if (y === !0) return p = t, 1;
			if (y === !1) return 1;
			for (var b = t.connectedEdges().filter(function(e) {
				return (!r || e.source().same(t)) && g.has(e);
			}), x = 0; x < b.length; x++) {
				var S = b[x], C = S.connectedNodes().filter(function(e) {
					return !e.same(t) && h.has(e);
				}), w = C.id();
				C.length !== 0 && !d[w] && (C = C[0], s.push(C), e.bfs && (d[w] = !0, c.push(C)), l[w] = S, u[w] = u[i] + 1);
			}
		}, x; s.length !== 0 && (x = b(), x === 0 || x !== 1););
		for (var S = a.collection(), C = 0; C < c.length; C++) {
			var w = c[C], T = l[w.id()];
			T != null && S.push(T), S.push(w);
		}
		return {
			path: a.collection(S),
			found: a.collection(p)
		};
	};
}, pn = {
	breadthFirstSearch: fn({ bfs: !0 }),
	depthFirstSearch: fn({ dfs: !0 })
};
pn.bfs = pn.breadthFirstSearch, pn.dfs = pn.depthFirstSearch;
var mn = { exports: {} }, hn = mn.exports, gn;
function _n() {
	return gn ? mn.exports : (gn = 1, (function(e, t) {
		(function() {
			var t, n, r = Math.floor, i, a, o, s, c, l, u = Math.min, d, f, p, m, h;
			n = function(e, t) {
				return e < t ? -1 : +(e > t);
			}, l = function(e, t, i, a, o) {
				var s;
				if (i ??= 0, o ??= n, i < 0) throw Error("lo must be non-negative");
				for (a ??= e.length; i < a;) s = r((i + a) / 2), o(t, e[s]) < 0 ? a = s : i = s + 1;
				return [].splice.apply(e, [i, i - i].concat(t)), t;
			}, o = function(e, t, r) {
				return r ??= n, e.push(t), m(e, 0, e.length - 1, r);
			}, a = function(e, t) {
				var r, i;
				return t ??= n, r = e.pop(), e.length ? (i = e[0], e[0] = r, h(e, 0, t)) : i = r, i;
			}, c = function(e, t, r) {
				var i;
				return r ??= n, i = e[0], e[0] = t, h(e, 0, r), i;
			}, s = function(e, t, r) {
				var i;
				return r ??= n, e.length && r(e[0], t) < 0 && (i = [e[0], t], t = i[0], e[0] = i[1], h(e, 0, r)), t;
			}, i = function(e, t) {
				var i, a, o, s, c, l;
				for (t ??= n, s = (function() {
					l = [];
					for (var t = 0, n = r(e.length / 2); 0 <= n ? t < n : t > n; 0 <= n ? t++ : t--) l.push(t);
					return l;
				}).apply(this).reverse(), c = [], a = 0, o = s.length; a < o; a++) i = s[a], c.push(h(e, i, t));
				return c;
			}, p = function(e, t, r) {
				var i;
				if (r ??= n, i = e.indexOf(t), i !== -1) return m(e, 0, i, r), h(e, i, r);
			}, d = function(e, t, r) {
				var a, o, c, l, u;
				if (r ??= n, o = e.slice(0, t), !o.length) return o;
				for (i(o, r), u = e.slice(t), c = 0, l = u.length; c < l; c++) a = u[c], s(o, a, r);
				return o.sort(r).reverse();
			}, f = function(e, t, r) {
				var o, s, c, d, f, p, m, h, g;
				if (r ??= n, t * 10 <= e.length) {
					if (c = e.slice(0, t).sort(r), !c.length) return c;
					for (s = c[c.length - 1], m = e.slice(t), d = 0, p = m.length; d < p; d++) o = m[d], r(o, s) < 0 && (l(c, o, 0, null, r), c.pop(), s = c[c.length - 1]);
					return c;
				}
				for (i(e, r), g = [], f = 0, h = u(t, e.length); 0 <= h ? f < h : f > h; 0 <= h ? ++f : --f) g.push(a(e, r));
				return g;
			}, m = function(e, t, r, i) {
				var a, o, s;
				for (i ??= n, a = e[r]; r > t;) {
					if (s = r - 1 >> 1, o = e[s], i(a, o) < 0) {
						e[r] = o, r = s;
						continue;
					}
					break;
				}
				return e[r] = a;
			}, h = function(e, t, r) {
				var i, a, o, s, c;
				for (r ??= n, a = e.length, c = t, o = e[t], i = 2 * t + 1; i < a;) s = i + 1, s < a && !(r(e[i], e[s]) < 0) && (i = s), e[t] = e[i], t = i, i = 2 * t + 1;
				return e[t] = o, m(e, c, t, r);
			}, t = (function() {
				e.push = o, e.pop = a, e.replace = c, e.pushpop = s, e.heapify = i, e.updateItem = p, e.nlargest = d, e.nsmallest = f;
				function e(e) {
					this.cmp = e ?? n, this.nodes = [];
				}
				return e.prototype.push = function(e) {
					return o(this.nodes, e, this.cmp);
				}, e.prototype.pop = function() {
					return a(this.nodes, this.cmp);
				}, e.prototype.peek = function() {
					return this.nodes[0];
				}, e.prototype.contains = function(e) {
					return this.nodes.indexOf(e) !== -1;
				}, e.prototype.replace = function(e) {
					return c(this.nodes, e, this.cmp);
				}, e.prototype.pushpop = function(e) {
					return s(this.nodes, e, this.cmp);
				}, e.prototype.heapify = function() {
					return i(this.nodes, this.cmp);
				}, e.prototype.updateItem = function(e) {
					return p(this.nodes, e, this.cmp);
				}, e.prototype.clear = function() {
					return this.nodes = [];
				}, e.prototype.empty = function() {
					return this.nodes.length === 0;
				}, e.prototype.size = function() {
					return this.nodes.length;
				}, e.prototype.clone = function() {
					var t = new e();
					return t.nodes = this.nodes.slice(0), t;
				}, e.prototype.toArray = function() {
					return this.nodes.slice(0);
				}, e.prototype.insert = e.prototype.push, e.prototype.top = e.prototype.peek, e.prototype.front = e.prototype.peek, e.prototype.has = e.prototype.contains, e.prototype.copy = e.prototype.clone, e;
			})(), (function(t, n) {
				return e.exports = n();
			})(this, function() {
				return t;
			});
		}).call(hn);
	})(mn), mn.exports);
}
var vn, yn;
function bn() {
	return yn ? vn : (yn = 1, vn = _n(), vn);
}
var xn = /*@__PURE__*/ De(bn()), Sn = en({
	root: null,
	weight: function(e) {
		return 1;
	},
	directed: !1
}), Cn = { dijkstra: function(e) {
	if (!R(e)) {
		var t = arguments;
		e = {
			root: t[0],
			weight: t[1],
			directed: t[2]
		};
	}
	var n = Sn(e), r = n.root, i = n.weight, a = n.directed, o = this, s = i, c = F(r) ? this.filter(r)[0] : r[0], l = {}, u = {}, d = {}, f = this.byGroup(), p = f.nodes, m = f.edges;
	m.unmergeBy(function(e) {
		return e.isLoop();
	});
	for (var h = function(e) {
		return l[e.id()];
	}, g = function(e, t) {
		l[e.id()] = t, _.updateItem(e);
	}, _ = new xn(function(e, t) {
		return h(e) - h(t);
	}), v = 0; v < p.length; v++) {
		var y = p[v];
		l[y.id()] = y.same(c) ? 0 : Infinity, _.push(y);
	}
	for (var b = function(e, t) {
		for (var n = (a ? e.edgesTo(t) : e.edgesWith(t)).intersect(m), r = Infinity, i, o = 0; o < n.length; o++) {
			var c = n[o], l = s(c);
			(l < r || !i) && (r = l, i = c);
		}
		return {
			edge: i,
			dist: r
		};
	}; _.size() > 0;) {
		var x = _.pop(), S = h(x), C = x.id();
		if (d[C] = S, S !== Infinity) for (var w = x.neighborhood().intersect(p), T = 0; T < w.length; T++) {
			var E = w[T], D = E.id(), O = b(x, E), k = S + O.dist;
			k < h(E) && (g(E, k), u[D] = {
				node: x,
				edge: O.edge
			});
		}
	}
	return {
		distanceTo: function(e) {
			return d[(F(e) ? p.filter(e)[0] : e[0]).id()];
		},
		pathTo: function(e) {
			var t = F(e) ? p.filter(e)[0] : e[0], n = [], r = t, i = r.id();
			if (t.length > 0) for (n.unshift(t); u[i];) {
				var a = u[i];
				n.unshift(a.edge), n.unshift(a.node), r = a.node, i = r.id();
			}
			return o.spawn(n);
		}
	};
} }, wn = { kruskal: function(e) {
	e ||= function(e) {
		return 1;
	};
	for (var t = this.byGroup(), n = t.nodes, r = t.edges, i = n.length, a = Array(i), o = n, s = function(e) {
		for (var t = 0; t < a.length; t++) if (a[t].has(e)) return t;
	}, c = 0; c < i; c++) a[c] = this.spawn(n[c]);
	for (var l = r.sort(function(t, n) {
		return e(t) - e(n);
	}), u = 0; u < l.length; u++) {
		var d = l[u], f = d.source()[0], p = d.target()[0], m = s(f), h = s(p), g = a[m], _ = a[h];
		m !== h && (o.merge(d), g.merge(_), a.splice(h, 1));
	}
	return o;
} }, Tn = en({
	root: null,
	goal: null,
	weight: function(e) {
		return 1;
	},
	heuristic: function(e) {
		return 0;
	},
	directed: !1
}), En = { aStar: function(e) {
	var t = this.cy(), n = Tn(e), r = n.root, i = n.goal, a = n.heuristic, o = n.directed, s = n.weight;
	r = t.collection(r)[0], i = t.collection(i)[0];
	var c = r.id(), l = i.id(), u = {}, d = {}, f = {}, p = new xn(function(e, t) {
		return d[e.id()] - d[t.id()];
	}), m = new un(), h = {}, g = {}, _ = function(e, t) {
		p.push(e), m.add(t);
	}, v, y, b = function() {
		v = p.pop(), y = v.id(), m.delete(y);
	}, x = function(e) {
		return m.has(e);
	};
	_(r, c), u[c] = 0, d[c] = a(r);
	for (var S = 0; p.size() > 0;) {
		if (b(), S++, y === l) {
			for (var C = [], w = i, T = l, E = g[T]; C.unshift(w), E != null && C.unshift(E), w = h[T], w != null;) T = w.id(), E = g[T];
			return {
				found: !0,
				distance: u[y],
				path: this.spawn(C),
				steps: S
			};
		}
		f[y] = !0;
		for (var D = v._private.edges, O = 0; O < D.length; O++) {
			var k = D[O];
			if (this.hasElementWithId(k.id()) && !(o && k.data("source") !== y)) {
				var A = k.source(), j = k.target(), M = A.id() === y ? j : A, N = M.id();
				if (this.hasElementWithId(N) && !f[N]) {
					var P = u[y] + s(k);
					if (!x(N)) {
						u[N] = P, d[N] = P + a(M), _(M, N), h[N] = v, g[N] = k;
						continue;
					}
					P < u[N] && (u[N] = P, d[N] = P + a(M), p.updateItem(M), h[N] = v, g[N] = k);
				}
			}
		}
	}
	return {
		found: !1,
		distance: void 0,
		path: void 0,
		steps: S
	};
} }, Dn = en({
	weight: function(e) {
		return 1;
	},
	directed: !1
}), On = { floydWarshall: function(e) {
	for (var t = this.cy(), n = Dn(e), r = n.weight, i = n.directed, a = r, o = this.byGroup(), s = o.nodes, c = o.edges, l = s.length, u = l * l, d = function(e) {
		return s.indexOf(e);
	}, f = function(e) {
		return s[e];
	}, p = Array(u), m = 0; m < u; m++) {
		var h = m % l;
		(m - h) / l === h ? p[m] = 0 : p[m] = Infinity;
	}
	for (var g = Array(u), _ = Array(u), v = 0; v < c.length; v++) {
		var y = c[v], b = y.source()[0], x = y.target()[0];
		if (b !== x) {
			var S = d(b), C = d(x), w = S * l + C, T = a(y);
			if (p[w] > T && (p[w] = T, g[w] = C, _[w] = y), !i) {
				var E = C * l + S;
				!i && p[E] > T && (p[E] = T, g[E] = S, _[E] = y);
			}
		}
	}
	for (var D = 0; D < l; D++) for (var O = 0; O < l; O++) for (var k = O * l + D, A = 0; A < l; A++) {
		var j = O * l + A, M = D * l + A;
		p[k] + p[M] < p[j] && (p[j] = p[k] + p[M], g[j] = g[k]);
	}
	var N = function(e) {
		return (F(e) ? t.filter(e) : e)[0];
	}, P = function(e) {
		return d(N(e));
	};
	return {
		distance: function(e, t) {
			var n = P(e), r = P(t);
			return p[n * l + r];
		},
		path: function(e, n) {
			var r = P(e), i = P(n), a = f(r);
			if (r === i) return a.collection();
			if (g[r * l + i] == null) return t.collection();
			var o = t.collection(), s = r, c;
			for (o.merge(a); r !== i;) s = r, r = g[r * l + i], c = _[s * l + r], o.merge(c), o.merge(f(r));
			return o;
		}
	};
} }, kn = en({
	weight: function(e) {
		return 1;
	},
	directed: !1,
	root: null
}), An = { bellmanFord: function(e) {
	var t = this, n = kn(e), r = n.weight, i = n.directed, a = n.root, o = r, s = this, c = this.cy(), l = this.byGroup(), u = l.edges, d = l.nodes, f = d.length, p = new sn(), m = !1, h = [];
	a = c.collection(a)[0], u.unmergeBy(function(e) {
		return e.isLoop();
	});
	for (var g = u.length, _ = function(e) {
		var t = p.get(e.id());
		return t || (t = {}, p.set(e.id(), t)), t;
	}, v = function(e) {
		return (F(e) ? c.$(e) : e)[0];
	}, y = function(e) {
		return _(v(e)).dist;
	}, b = function(e) {
		for (var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : a, r = v(e), i = [], o = r;;) {
			if (o == null) return t.spawn();
			var c = _(o), l = c.edge, u = c.pred;
			if (i.unshift(o[0]), o.same(n) && i.length > 0) break;
			l != null && i.unshift(l), o = u;
		}
		return s.spawn(i);
	}, x = 0; x < f; x++) {
		var S = d[x], C = _(S);
		C.dist = S.same(a) ? 0 : Infinity, C.pred = null, C.edge = null;
	}
	for (var w = !1, T = function(e, t, n, r, i, a) {
		var o = r.dist + a;
		o < i.dist && !n.same(r.edge) && (i.dist = o, i.pred = e, i.edge = n, w = !0);
	}, E = 1; E < f; E++) {
		w = !1;
		for (var D = 0; D < g; D++) {
			var O = u[D], k = O.source(), A = O.target(), j = o(O), M = _(k), N = _(A);
			T(k, A, O, M, N, j), i || T(A, k, O, N, M, j);
		}
		if (!w) break;
	}
	if (w) for (var P = [], I = 0; I < g; I++) {
		var L = u[I], R = L.source(), z = L.target(), B = o(L), V = _(R).dist, H = _(z).dist;
		if (V + B < H || !i && H + B < V) {
			if (m ||= (qt("Graph contains a negative weight cycle for Bellman-Ford"), !0), e.findNegativeWeightCycles !== !1) {
				var U = [];
				V + B < H && U.push(R), !i && H + B < V && U.push(z);
				for (var W = U.length, G = 0; G < W; G++) {
					var K = U[G], q = [K];
					q.push(_(K).edge);
					for (var ee = _(K).pred; q.indexOf(ee) === -1;) q.push(ee), q.push(_(ee).edge), ee = _(ee).pred;
					q = q.slice(q.indexOf(ee));
					for (var J = q[0].id(), Y = 0, te = 2; te < q.length; te += 2) q[te].id() < J && (J = q[te].id(), Y = te);
					q = q.slice(Y).concat(q.slice(0, Y)), q.push(q[0]);
					var ne = q.map(function(e) {
						return e.id();
					}).join(",");
					P.indexOf(ne) === -1 && (h.push(s.spawn(q)), P.push(ne));
				}
			} else break;
		}
	}
	return {
		distanceTo: y,
		pathTo: b,
		hasNegativeWeightCycle: m,
		negativeWeightCycles: h
	};
} }, jn = Math.sqrt(2), Mn = function(e, t, n) {
	n.length === 0 && Gt("Karger-Stein must be run on a connected (sub)graph");
	for (var r = n[e], i = r[1], a = r[2], o = t[i], s = t[a], c = n, l = c.length - 1; l >= 0; l--) {
		var u = c[l], d = u[1], f = u[2];
		(t[d] === o && t[f] === s || t[d] === s && t[f] === o) && c.splice(l, 1);
	}
	for (var p = 0; p < c.length; p++) {
		var m = c[p];
		m[1] === s ? (c[p] = m.slice(), c[p][1] = o) : m[2] === s && (c[p] = m.slice(), c[p][2] = o);
	}
	for (var h = 0; h < t.length; h++) t[h] === s && (t[h] = o);
	return c;
}, Nn = function(e, t, n, r) {
	for (; n > r;) t = Mn(Math.floor(Math.random() * t.length), e, t), n--;
	return t;
}, Pn = { kargerStein: function() {
	var e = this, t = this.byGroup(), n = t.nodes, r = t.edges;
	r.unmergeBy(function(e) {
		return e.isLoop();
	});
	var i = n.length, a = r.length, o = Math.ceil((Math.log(i) / Math.LN2) ** 2), s = Math.floor(i / jn);
	if (i < 2) {
		Gt("At least 2 nodes are required for Karger-Stein algorithm");
		return;
	}
	for (var c = [], l = 0; l < a; l++) {
		var u = r[l];
		c.push([
			l,
			n.indexOf(u.source()),
			n.indexOf(u.target())
		]);
	}
	for (var d = Infinity, f = [], p = Array(i), m = Array(i), h = Array(i), g = function(e, t) {
		for (var n = 0; n < i; n++) t[n] = e[n];
	}, _ = 0; _ <= o; _++) {
		for (var v = 0; v < i; v++) m[v] = v;
		var y = Nn(m, c.slice(), i, s), b = y.slice();
		g(m, h);
		var x = Nn(m, y, s, 2), S = Nn(h, b, s, 2);
		x.length <= S.length && x.length < d ? (d = x.length, f = x, g(m, p)) : S.length <= x.length && S.length < d && (d = S.length, f = S, g(h, p));
	}
	for (var C = this.spawn(f.map(function(e) {
		return r[e[0]];
	})), w = this.spawn(), T = this.spawn(), E = p[0], D = 0; D < p.length; D++) {
		var O = p[D], k = n[D];
		O === E ? w.merge(k) : T.merge(k);
	}
	var A = function(t) {
		var n = e.spawn();
		return t.forEach(function(t) {
			n.merge(t), t.connectedEdges().forEach(function(t) {
				e.contains(t) && !C.contains(t) && n.merge(t);
			});
		}), n;
	};
	return {
		cut: C,
		components: [A(w), A(T)],
		partition1: w,
		partition2: T
	};
} }, Fn = function(e) {
	return {
		x: e.x,
		y: e.y
	};
}, In = function(e, t, n) {
	return {
		x: e.x * t + n.x,
		y: e.y * t + n.y
	};
}, Ln = function(e, t, n) {
	return {
		x: (e.x - n.x) / t,
		y: (e.y - n.y) / t
	};
}, Rn = function(e) {
	return {
		x: e[0],
		y: e[1]
	};
}, zn = function(e) {
	for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : e.length, r = Infinity, i = t; i < n; i++) {
		var a = e[i];
		isFinite(a) && (r = Math.min(a, r));
	}
	return r;
}, Bn = function(e) {
	for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : e.length, r = -Infinity, i = t; i < n; i++) {
		var a = e[i];
		isFinite(a) && (r = Math.max(a, r));
	}
	return r;
}, Vn = function(e) {
	for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : e.length, r = 0, i = 0, a = t; a < n; a++) {
		var o = e[a];
		isFinite(o) && (r += o, i++);
	}
	return r / i;
}, Hn = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : e.length, r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : !0;
	r ? e = e.slice(t, n) : (n < e.length && e.splice(n, e.length - n), t > 0 && e.splice(0, t));
	for (var o = 0, s = e.length - 1; s >= 0; s--) {
		var c = e[s];
		a ? isFinite(c) || (e[s] = -Infinity, o++) : e.splice(s, 1);
	}
	i && e.sort(function(e, t) {
		return e - t;
	});
	var l = e.length, u = Math.floor(l / 2);
	return l % 2 == 0 ? (e[u - 1 + o] + e[u + o]) / 2 : e[u + 1 + o];
}, Un = function(e, t) {
	return t === 0 ? e : Un(t, e % t);
}, Wn = function(e) {
	for (var t = e[0], n = 0; n < e.length; n++) if (V(e[n])) n > 0 && (t = Un(t, e[n]));
	else return 0;
	return t;
}, Gn = function(e) {
	return Math.PI * e / 180;
}, Kn = function(e, t) {
	return Math.atan2(t, e) - Math.PI / 2;
}, qn = Math.log2 || function(e) {
	return Math.log(e) / Math.log(2);
}, Jn = function(e) {
	return e > 0 ? 1 : e < 0 ? -1 : 0;
}, Yn = function(e, t) {
	return Math.sqrt(Xn(e, t));
}, Xn = function(e, t) {
	var n = t.x - e.x, r = t.y - e.y;
	return n * n + r * r;
}, Zn = function(e) {
	for (var t = e.length, n = 0, r = 0; r < t; r++) n += e[r];
	for (var i = 0; i < t; i++) e[i] = e[i] / n;
	return e;
}, Qn = function(e, t, n, r) {
	return (1 - r) * (1 - r) * e + 2 * (1 - r) * r * t + r * r * n;
}, $n = function(e, t, n, r) {
	return {
		x: Qn(e.x, t.x, n.x, r),
		y: Qn(e.y, t.y, n.y, r)
	};
}, er = function(e, t, n, r) {
	var i = {
		x: t.x - e.x,
		y: t.y - e.y
	}, a = Yn(e, t), o = {
		x: i.x / a,
		y: i.y / a
	};
	return n ??= 0, r ??= n * a, {
		x: e.x + o.x * r,
		y: e.y + o.y * r
	};
}, tr = function(e, t, n) {
	return Math.max(e, Math.min(n, t));
}, nr = function(e) {
	if (e == null) return {
		x1: Infinity,
		y1: Infinity,
		x2: -Infinity,
		y2: -Infinity,
		w: 0,
		h: 0
	};
	if (e.x1 != null && e.y1 != null) {
		if (e.x2 != null && e.y2 != null && e.x2 >= e.x1 && e.y2 >= e.y1) return {
			x1: e.x1,
			y1: e.y1,
			x2: e.x2,
			y2: e.y2,
			w: e.x2 - e.x1,
			h: e.y2 - e.y1
		};
		if (e.w != null && e.h != null && e.w >= 0 && e.h >= 0) return {
			x1: e.x1,
			y1: e.y1,
			x2: e.x1 + e.w,
			y2: e.y1 + e.h,
			w: e.w,
			h: e.h
		};
	}
}, rr = function(e) {
	return {
		x1: e.x1,
		x2: e.x2,
		w: e.w,
		y1: e.y1,
		y2: e.y2,
		h: e.h
	};
}, ir = function(e) {
	e.x1 = Infinity, e.y1 = Infinity, e.x2 = -Infinity, e.y2 = -Infinity, e.w = 0, e.h = 0;
}, ar = function(e, t) {
	e.x1 = Math.min(e.x1, t.x1), e.x2 = Math.max(e.x2, t.x2), e.w = e.x2 - e.x1, e.y1 = Math.min(e.y1, t.y1), e.y2 = Math.max(e.y2, t.y2), e.h = e.y2 - e.y1;
}, or = function(e, t, n) {
	e.x1 = Math.min(e.x1, t), e.x2 = Math.max(e.x2, t), e.w = e.x2 - e.x1, e.y1 = Math.min(e.y1, n), e.y2 = Math.max(e.y2, n), e.h = e.y2 - e.y1;
}, sr = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	return e.x1 -= t, e.x2 += t, e.y1 -= t, e.y2 += t, e.w = e.x2 - e.x1, e.h = e.y2 - e.y1, e;
}, cr = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [0], n, r, i, a;
	if (t.length === 1) n = r = i = a = t[0];
	else if (t.length === 2) n = i = t[0], a = r = t[1];
	else if (t.length === 4) {
		var o = S(t, 4);
		n = o[0], r = o[1], i = o[2], a = o[3];
	}
	return e.x1 -= a, e.x2 += r, e.y1 -= n, e.y2 += i, e.w = e.x2 - e.x1, e.h = e.y2 - e.y1, e;
}, lr = function(e, t) {
	e.x1 = t.x1, e.y1 = t.y1, e.x2 = t.x2, e.y2 = t.y2, e.w = e.x2 - e.x1, e.h = e.y2 - e.y1;
}, ur = function(e, t) {
	return !(e.x1 > t.x2 || t.x1 > e.x2 || e.x2 < t.x1 || t.x2 < e.x1 || e.y2 < t.y1 || t.y2 < e.y1 || e.y1 > t.y2 || t.y1 > e.y2);
}, dr = function(e, t, n) {
	return e.x1 <= t && t <= e.x2 && e.y1 <= n && n <= e.y2;
}, fr = function(e, t) {
	return dr(e, t.x, t.y);
}, pr = function(e, t) {
	return dr(e, t.x1, t.y1) && dr(e, t.x2, t.y2);
}, mr = Math.hypot ?? function(e, t) {
	return Math.sqrt(e * e + t * t);
};
function hr(e, t) {
	if (e.length < 3) throw Error("Need at least 3 vertices");
	var n = function(e, t) {
		return {
			x: e.x + t.x,
			y: e.y + t.y
		};
	}, r = function(e, t) {
		return {
			x: e.x - t.x,
			y: e.y - t.y
		};
	}, i = function(e, t) {
		return {
			x: e.x * t,
			y: e.y * t
		};
	}, a = function(e, t) {
		return e.x * t.y - e.y * t.x;
	}, o = function(e) {
		var t = mr(e.x, e.y);
		return t === 0 ? {
			x: 0,
			y: 0
		} : {
			x: e.x / t,
			y: e.y / t
		};
	}, s = function(e) {
		for (var t = 0, n = 0; n < e.length; n++) {
			var r = e[n], i = e[(n + 1) % e.length];
			t += r.x * i.y - i.x * r.y;
		}
		return t / 2;
	}, c = function(e, t, o, s) {
		var c = r(t, e), l = r(s, o), u = a(c, l);
		return Math.abs(u) < 1e-9 ? n(e, i(c, .5)) : n(e, i(c, a(r(o, e), l) / u));
	}, l = e.map(function(e) {
		return {
			x: e.x,
			y: e.y
		};
	});
	s(l) < 0 && l.reverse();
	for (var u = l.length, d = [], f = 0; f < u; f++) {
		var p = l[f], m = l[(f + 1) % u], h = r(m, p), g = o({
			x: h.y,
			y: -h.x
		});
		d.push(g);
	}
	for (var _ = d.map(function(e, r) {
		return {
			p1: n(l[r], i(e, t)),
			p2: n(l[(r + 1) % u], i(e, t))
		};
	}), v = [], y = 0; y < u; y++) {
		var b = _[(y - 1 + u) % u], x = _[y], S = c(b.p1, b.p2, x.p1, x.p2);
		v.push(S);
	}
	return v;
}
function gr(e, t, n, r, i, a) {
	var o = hr(Pr(e, t, n, r, i), a), s = nr();
	return o.forEach(function(e) {
		return or(s, e.x, e.y);
	}), s;
}
var _r = function(e, t, n, r, i, a, o) {
	var s = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : "auto", c = s === "auto" ? Vr(i, a) : s, l = i / 2, u = a / 2;
	c = Math.min(c, l, u);
	var d = c !== l, f = c !== u, p;
	if (d) {
		var m = n - l + c - o, h = r - u - o;
		if (p = Nr(e, t, n, r, m, h, n + l - c + o, h, !1), p.length > 0) return p;
	}
	if (f) {
		var g = n + l + o;
		if (p = Nr(e, t, n, r, g, r - u + c - o, g, r + u - c + o, !1), p.length > 0) return p;
	}
	if (d) {
		var _ = n - l + c - o, v = r + u + o;
		if (p = Nr(e, t, n, r, _, v, n + l - c + o, v, !1), p.length > 0) return p;
	}
	if (f) {
		var y = n - l - o;
		if (p = Nr(e, t, n, r, y, r - u + c - o, y, r + u - c + o, !1), p.length > 0) return p;
	}
	var b, x = n - l + c, S = r - u + c;
	if (b = jr(e, t, n, r, x, S, c + o), b.length > 0 && b[0] <= x && b[1] <= S) return [b[0], b[1]];
	var C = n + l - c, w = r - u + c;
	if (b = jr(e, t, n, r, C, w, c + o), b.length > 0 && b[0] >= C && b[1] <= w) return [b[0], b[1]];
	var T = n + l - c, E = r + u - c;
	if (b = jr(e, t, n, r, T, E, c + o), b.length > 0 && b[0] >= T && b[1] >= E) return [b[0], b[1]];
	var D = n - l + c, O = r + u - c;
	return b = jr(e, t, n, r, D, O, c + o), b.length > 0 && b[0] <= D && b[1] >= O ? [b[0], b[1]] : [];
}, vr = function(e, t, n, r, i, a, o) {
	var s = o, c = Math.min(n, i), l = Math.max(n, i), u = Math.min(r, a), d = Math.max(r, a);
	return c - s <= e && e <= l + s && u - s <= t && t <= d + s;
}, yr = function(e, t, n, r, i, a, o, s, c) {
	var l = {
		x1: Math.min(n, o, i) - c,
		x2: Math.max(n, o, i) + c,
		y1: Math.min(r, s, a) - c,
		y2: Math.max(r, s, a) + c
	};
	return !(e < l.x1 || e > l.x2 || t < l.y1 || t > l.y2);
}, br = function(e, t, n, r) {
	n -= r;
	var i = t * t - 4 * e * n;
	if (i < 0) return [];
	var a = Math.sqrt(i), o = 2 * e;
	return [(-t + a) / o, (-t - a) / o];
}, xr = function(e, t, n, r, i) {
	e === 0 && (e = 1e-5), t /= e, n /= e, r /= e;
	var a, o = (3 * n - t * t) / 9, s = -(27 * r) + t * (9 * n - t * t * 2), c, l, u, d, f;
	if (s /= 54, a = o * o * o + s * s, i[1] = 0, d = t / 3, a > 0) {
		l = s + Math.sqrt(a), l = l < 0 ? -((-l) ** (1 / 3)) : l ** (1 / 3), u = s - Math.sqrt(a), u = u < 0 ? -((-u) ** (1 / 3)) : u ** (1 / 3), i[0] = -d + l + u, d += (l + u) / 2, i[4] = i[2] = -d, d = Math.sqrt(3) * (-u + l) / 2, i[3] = d, i[5] = -d;
		return;
	}
	if (i[5] = i[3] = 0, a === 0) {
		f = s < 0 ? -((-s) ** (1 / 3)) : s ** (1 / 3), i[0] = -d + 2 * f, i[4] = i[2] = -(f + d);
		return;
	}
	o = -o, c = o * o * o, c = Math.acos(s / Math.sqrt(c)), f = 2 * Math.sqrt(o), i[0] = -d + f * Math.cos(c / 3), i[2] = -d + f * Math.cos((c + 2 * Math.PI) / 3), i[4] = -d + f * Math.cos((c + 4 * Math.PI) / 3);
}, Sr = function(e, t, n, r, i, a, o, s) {
	var c = 1 * n * n - 4 * n * i + 2 * n * o + 4 * i * i - 4 * i * o + o * o + r * r - 4 * r * a + 2 * r * s + 4 * a * a - 4 * a * s + s * s, l = 9 * n * i - 3 * n * n - 3 * n * o - 6 * i * i + 3 * i * o + 9 * r * a - 3 * r * r - 3 * r * s - 6 * a * a + 3 * a * s, u = 3 * n * n - 6 * n * i + n * o - n * e + 2 * i * i + 2 * i * e - o * e + 3 * r * r - 6 * r * a + r * s - r * t + 2 * a * a + 2 * a * t - s * t, d = 1 * n * i - n * n + n * e - i * e + r * a - r * r + r * t - a * t, f = [];
	xr(c, l, u, d, f);
	for (var p = 1e-7, m = [], h = 0; h < 6; h += 2) Math.abs(f[h + 1]) < p && f[h] >= 0 && f[h] <= 1 && m.push(f[h]);
	m.push(1), m.push(0);
	for (var g = -1, _, v, y, b = 0; b < m.length; b++) _ = (1 - m[b]) ** 2 * n + 2 * (1 - m[b]) * m[b] * i + m[b] * m[b] * o, v = (1 - m[b]) ** 2 * r + 2 * (1 - m[b]) * m[b] * a + m[b] * m[b] * s, y = (_ - e) ** 2 + (v - t) ** 2, g >= 0 ? y < g && (g = y) : g = y;
	return g;
}, Cr = function(e, t, n, r, i, a) {
	var o = [e - n, t - r], s = [i - n, a - r], c = s[0] * s[0] + s[1] * s[1], l = o[0] * o[0] + o[1] * o[1], u = o[0] * s[0] + o[1] * s[1], d = u * u / c;
	return u < 0 ? l : d > c ? (e - i) * (e - i) + (t - a) * (t - a) : l - d;
}, wr = function(e, t, n) {
	for (var r, i, a, o, s, c = 0, l = 0; l < n.length / 2; l++) if (r = n[l * 2], i = n[l * 2 + 1], l + 1 < n.length / 2 ? (a = n[(l + 1) * 2], o = n[(l + 1) * 2 + 1]) : (a = n[(l + 1 - n.length / 2) * 2], o = n[(l + 1 - n.length / 2) * 2 + 1]), r != e || a != e) {
		if (r >= e && e >= a || r <= e && e <= a) s = (e - r) / (a - r) * (o - i) + i, s > t && c++;
		else continue;
	}
	return c % 2 != 0;
}, Tr = function(e, t, n, r, i, a, o, s, c) {
	var l = Array(n.length), u;
	s[0] == null ? u = s : (u = Math.atan(s[1] / s[0]), s[0] < 0 ? u += Math.PI / 2 : u = -u - Math.PI / 2);
	for (var d = Math.cos(-u), f = Math.sin(-u), p = 0; p < l.length / 2; p++) l[p * 2] = a / 2 * (n[p * 2] * d - n[p * 2 + 1] * f), l[p * 2 + 1] = o / 2 * (n[p * 2 + 1] * d + n[p * 2] * f), l[p * 2] += r, l[p * 2 + 1] += i;
	return wr(e, t, c > 0 ? Dr(Or(l, -c)) : l);
}, Er = function(e, t, n, r, i, a, o, s) {
	for (var c = Array(n.length * 2), l = 0; l < s.length; l++) {
		var u = s[l];
		if (c[l * 4 + 0] = u.startX, c[l * 4 + 1] = u.startY, c[l * 4 + 2] = u.stopX, c[l * 4 + 3] = u.stopY, (u.cx - e) ** 2 + (u.cy - t) ** 2 <= u.radius ** 2) return !0;
	}
	return wr(e, t, c);
}, Dr = function(e) {
	for (var t = Array(e.length / 2), n, r, i, a, o, s, c, l, u = 0; u < e.length / 4; u++) {
		n = e[u * 4], r = e[u * 4 + 1], i = e[u * 4 + 2], a = e[u * 4 + 3], u < e.length / 4 - 1 ? (o = e[(u + 1) * 4], s = e[(u + 1) * 4 + 1], c = e[(u + 1) * 4 + 2], l = e[(u + 1) * 4 + 3]) : (o = e[0], s = e[1], c = e[2], l = e[3]);
		var d = Nr(n, r, i, a, o, s, c, l, !0);
		t[u * 2] = d[0], t[u * 2 + 1] = d[1];
	}
	return t;
}, Or = function(e, t) {
	for (var n = Array(e.length * 2), r, i, a, o, s = 0; s < e.length / 2; s++) {
		r = e[s * 2], i = e[s * 2 + 1], s < e.length / 2 - 1 ? (a = e[(s + 1) * 2], o = e[(s + 1) * 2 + 1]) : (a = e[0], o = e[1]);
		var c = o - i, l = -(a - r), u = Math.sqrt(c * c + l * l), d = c / u, f = l / u;
		n[s * 4] = r + d * t, n[s * 4 + 1] = i + f * t, n[s * 4 + 2] = a + d * t, n[s * 4 + 3] = o + f * t;
	}
	return n;
}, kr = function(e, t, n, r, i, a) {
	var o = n - e, s = r - t;
	o /= i, s /= a;
	var c = Math.sqrt(o * o + s * s), l = c - 1;
	if (l < 0) return [];
	var u = l / c;
	return [(n - e) * u + e, (r - t) * u + t];
}, Ar = function(e, t, n, r, i, a, o) {
	return e -= i, t -= a, e /= n / 2 + o, t /= r / 2 + o, e * e + t * t <= 1;
}, jr = function(e, t, n, r, i, a, o) {
	var s = [n - e, r - t], c = [e - i, t - a], l = s[0] * s[0] + s[1] * s[1], u = 2 * (c[0] * s[0] + c[1] * s[1]), d = c[0] * c[0] + c[1] * c[1] - o * o, f = u * u - 4 * l * d;
	if (f < 0) return [];
	var p = (-u + Math.sqrt(f)) / (2 * l), m = (-u - Math.sqrt(f)) / (2 * l), h = Math.min(p, m), g = Math.max(p, m), _ = [];
	if (h >= 0 && h <= 1 && _.push(h), g >= 0 && g <= 1 && _.push(g), _.length === 0) return [];
	var v = _[0] * s[0] + e, y = _[0] * s[1] + t;
	return _.length > 1 ? _[0] == _[1] ? [v, y] : [
		v,
		y,
		_[1] * s[0] + e,
		_[1] * s[1] + t
	] : [v, y];
}, Mr = function(e, t, n) {
	return t <= e && e <= n || n <= e && e <= t ? e : e <= t && t <= n || n <= t && t <= e ? t : n;
}, Nr = function(e, t, n, r, i, a, o, s, c) {
	var l = e - i, u = n - e, d = o - i, f = t - a, p = r - t, m = s - a, h = d * f - m * l, g = u * f - p * l, _ = m * u - d * p;
	if (_ !== 0) {
		var v = h / _, y = g / _, b = .001, x = 0 - b, S = 1 + b;
		return x <= v && v <= S && x <= y && y <= S || c ? [e + v * u, t + v * p] : [];
	}
	return h === 0 || g === 0 ? Mr(e, n, o) === o ? [o, s] : Mr(e, n, i) === i ? [i, a] : Mr(i, o, n) === n ? [n, r] : [] : [];
}, Pr = function(e, t, n, r, i) {
	var a = [], o = r / 2, s = i / 2, c = t, l = n;
	a.push({
		x: c + o * e[0],
		y: l + s * e[1]
	});
	for (var u = 1; u < e.length / 2; u++) a.push({
		x: c + o * e[u * 2],
		y: l + s * e[u * 2 + 1]
	});
	return a;
}, Fr = function(e, t, n, r, i, a, o, s) {
	var c = [], l, u = Array(n.length), d = !0;
	a ?? (d = !1);
	var f;
	if (d) {
		for (var p = 0; p < u.length / 2; p++) u[p * 2] = n[p * 2] * a + r, u[p * 2 + 1] = n[p * 2 + 1] * o + i;
		f = s > 0 ? Dr(Or(u, -s)) : u;
	} else f = n;
	for (var m, h, g, _, v = 0; v < f.length / 2; v++) m = f[v * 2], h = f[v * 2 + 1], v < f.length / 2 - 1 ? (g = f[(v + 1) * 2], _ = f[(v + 1) * 2 + 1]) : (g = f[0], _ = f[1]), l = Nr(e, t, r, i, m, h, g, _), l.length !== 0 && c.push(l[0], l[1]);
	return c;
}, Ir = function(e, t, n, r, i, a, o, s, c) {
	var l = [], u, d = Array(n.length * 2);
	c.forEach(function(n, a) {
		a === 0 ? (d[d.length - 2] = n.startX, d[d.length - 1] = n.startY) : (d[a * 4 - 2] = n.startX, d[a * 4 - 1] = n.startY), d[a * 4] = n.stopX, d[a * 4 + 1] = n.stopY, u = jr(e, t, r, i, n.cx, n.cy, n.radius), u.length !== 0 && l.push(u[0], u[1]);
	});
	for (var f = 0; f < d.length / 4; f++) u = Nr(e, t, r, i, d[f * 4], d[f * 4 + 1], d[f * 4 + 2], d[f * 4 + 3], !1), u.length !== 0 && l.push(u[0], u[1]);
	if (l.length > 2) {
		for (var p = [l[0], l[1]], m = (p[0] - e) ** 2 + (p[1] - t) ** 2, h = 1; h < l.length / 2; h++) {
			var g = (l[h * 2] - e) ** 2 + (l[h * 2 + 1] - t) ** 2;
			g <= m && (p[0] = l[h * 2], p[1] = l[h * 2 + 1], m = g);
		}
		return p;
	}
	return l;
}, Lr = function(e, t, n) {
	var r = [e[0] - t[0], e[1] - t[1]], i = Math.sqrt(r[0] * r[0] + r[1] * r[1]), a = (i - n) / i;
	return a < 0 && (a = 1e-5), [t[0] + a * r[0], t[1] + a * r[1]];
}, Rr = function(e, t) {
	var n = Br(e, t);
	return n = zr(n), n;
}, zr = function(e) {
	for (var t, n, r = e.length / 2, i = Infinity, a = Infinity, o = -Infinity, s = -Infinity, c = 0; c < r; c++) t = e[2 * c], n = e[2 * c + 1], i = Math.min(i, t), o = Math.max(o, t), a = Math.min(a, n), s = Math.max(s, n);
	for (var l = 2 / (o - i), u = 2 / (s - a), d = 0; d < r; d++) t = e[2 * d] = e[2 * d] * l, n = e[2 * d + 1] = e[2 * d + 1] * u, i = Math.min(i, t), o = Math.max(o, t), a = Math.min(a, n), s = Math.max(s, n);
	if (a < -1) for (var f = 0; f < r; f++) n = e[2 * f + 1] = e[2 * f + 1] + (-1 - a);
	return e;
}, Br = function(e, t) {
	var n = 1 / e * 2 * Math.PI, r = e % 2 == 0 ? Math.PI / 2 + n / 2 : Math.PI / 2;
	r += t;
	for (var i = Array(e * 2), a, o = 0; o < e; o++) a = o * n + r, i[2 * o] = Math.cos(a), i[2 * o + 1] = Math.sin(-a);
	return i;
}, Vr = function(e, t) {
	return Math.min(e / 4, t / 4, 8);
}, Hr = function(e, t) {
	return Math.min(e / 10, t / 10, 8);
}, Ur = function() {
	return 8;
}, Wr = function(e, t, n) {
	return [
		e - 2 * t + n,
		2 * (t - e),
		e
	];
}, Gr = function(e, t) {
	return {
		heightOffset: Math.min(15, .05 * t),
		widthOffset: Math.min(100, .25 * e),
		ctrlPtOffsetPct: .05
	};
};
function Kr(e, t) {
	function n(e) {
		for (var t = [], n = 0; n < e.length; n++) {
			var r = e[n], i = e[(n + 1) % e.length], a = {
				x: i.x - r.x,
				y: i.y - r.y
			}, o = {
				x: -a.y,
				y: a.x
			}, s = Math.sqrt(o.x * o.x + o.y * o.y);
			t.push({
				x: o.x / s,
				y: o.y / s
			});
		}
		return t;
	}
	function r(e, t) {
		var n = Infinity, r = -Infinity, i = g(e), a;
		try {
			for (i.s(); !(a = i.n()).done;) {
				var o = a.value, s = o.x * t.x + o.y * t.y;
				n = Math.min(n, s), r = Math.max(r, s);
			}
		} catch (e) {
			i.e(e);
		} finally {
			i.f();
		}
		return {
			min: n,
			max: r
		};
	}
	function i(e, t) {
		return !(e.max < t.min || t.max < e.min);
	}
	var a = g([].concat(C(n(e)), C(n(t)))), o;
	try {
		for (a.s(); !(o = a.n()).done;) {
			var s = o.value;
			if (!i(r(e, s), r(t, s))) return !1;
		}
	} catch (e) {
		a.e(e);
	} finally {
		a.f();
	}
	return !0;
}
var qr = en({
	dampingFactor: .8,
	precision: 1e-6,
	iterations: 200,
	weight: function(e) {
		return 1;
	}
}), Jr = { pageRank: function(e) {
	for (var t = qr(e), n = t.dampingFactor, r = t.precision, i = t.iterations, a = t.weight, o = this._private.cy, s = this.byGroup(), c = s.nodes, l = s.edges, u = c.length, d = u * u, f = l.length, p = Array(d), m = Array(u), h = (1 - n) / u, g = 0; g < u; g++) {
		for (var _ = 0; _ < u; _++) {
			var v = g * u + _;
			p[v] = 0;
		}
		m[g] = 0;
	}
	for (var y = 0; y < f; y++) {
		var b = l[y], x = b.data("source"), S = b.data("target");
		if (x !== S) {
			var C = c.indexOfId(x), w = c.indexOfId(S), T = a(b), E = w * u + C;
			p[E] += T, m[C] += T;
		}
	}
	for (var D = 1 / u + h, O = 0; O < u; O++) if (m[O] === 0) for (var k = 0; k < u; k++) {
		var A = k * u + O;
		p[A] = D;
	}
	else for (var j = 0; j < u; j++) {
		var M = j * u + O;
		p[M] = p[M] / m[O] + h;
	}
	for (var N = Array(u), P = Array(u), F, I = 0; I < u; I++) N[I] = 1;
	for (var L = 0; L < i; L++) {
		for (var R = 0; R < u; R++) P[R] = 0;
		for (var z = 0; z < u; z++) for (var B = 0; B < u; B++) {
			var V = z * u + B;
			P[z] += p[V] * N[B];
		}
		Zn(P), F = N, N = P, P = F;
		for (var H = 0, U = 0; U < u; U++) {
			var W = F[U] - N[U];
			H += W * W;
		}
		if (H < r) break;
	}
	return { rank: function(e) {
		return e = o.collection(e)[0], N[c.indexOf(e)];
	} };
} }, Yr = en({
	root: null,
	weight: function(e) {
		return 1;
	},
	directed: !1,
	alpha: 0
}), Xr = {
	degreeCentralityNormalized: function(e) {
		e = Yr(e);
		var t = this.cy(), n = this.nodes(), r = n.length;
		if (e.directed) {
			for (var i = {}, a = {}, o = 0, s = 0, c = 0; c < r; c++) {
				var l = n[c], u = l.id();
				e.root = l;
				var d = this.degreeCentrality(e);
				o < d.indegree && (o = d.indegree), s < d.outdegree && (s = d.outdegree), i[u] = d.indegree, a[u] = d.outdegree;
			}
			return {
				indegree: function(e) {
					return o == 0 ? 0 : (F(e) && (e = t.filter(e)), i[e.id()] / o);
				},
				outdegree: function(e) {
					return s === 0 ? 0 : (F(e) && (e = t.filter(e)), a[e.id()] / s);
				}
			};
		}
		for (var f = {}, p = 0, m = 0; m < r; m++) {
			var h = n[m];
			e.root = h;
			var g = this.degreeCentrality(e);
			p < g.degree && (p = g.degree), f[h.id()] = g.degree;
		}
		return { degree: function(e) {
			return p === 0 ? 0 : (F(e) && (e = t.filter(e)), f[e.id()] / p);
		} };
	},
	degreeCentrality: function(e) {
		e = Yr(e);
		var t = this.cy(), n = this, r = e, i = r.root, a = r.weight, o = r.directed, s = r.alpha;
		if (i = t.collection(i)[0], o) {
			for (var c = i.connectedEdges(), l = c.filter(function(e) {
				return e.target().same(i) && n.has(e);
			}), u = c.filter(function(e) {
				return e.source().same(i) && n.has(e);
			}), d = l.length, f = u.length, p = 0, m = 0, h = 0; h < l.length; h++) p += a(l[h]);
			for (var g = 0; g < u.length; g++) m += a(u[g]);
			return {
				indegree: d ** (1 - s) * p ** +s,
				outdegree: f ** (1 - s) * m ** +s
			};
		}
		for (var _ = i.connectedEdges().intersection(n), v = _.length, y = 0, b = 0; b < _.length; b++) y += a(_[b]);
		return { degree: v ** (1 - s) * y ** +s };
	}
};
Xr.dc = Xr.degreeCentrality, Xr.dcn = Xr.degreeCentralityNormalised = Xr.degreeCentralityNormalized;
var Zr = en({
	harmonic: !0,
	weight: function() {
		return 1;
	},
	directed: !1,
	root: null
}), Qr = {
	closenessCentralityNormalized: function(e) {
		for (var t = Zr(e), n = t.harmonic, r = t.weight, i = t.directed, a = this.cy(), o = {}, s = 0, c = this.nodes(), l = this.floydWarshall({
			weight: r,
			directed: i
		}), u = 0; u < c.length; u++) {
			for (var d = 0, f = c[u], p = 0; p < c.length; p++) if (u !== p) {
				var m = l.distance(f, c[p]);
				d += n ? 1 / m : m;
			}
			n || (d = 1 / d), s < d && (s = d), o[f.id()] = d;
		}
		return { closeness: function(e) {
			return s == 0 ? 0 : (e = F(e) ? a.filter(e)[0].id() : e.id(), o[e] / s);
		} };
	},
	closenessCentrality: function(e) {
		var t = Zr(e), n = t.root, r = t.weight, i = t.directed, a = t.harmonic;
		n = this.filter(n)[0];
		for (var o = this.dijkstra({
			root: n,
			weight: r,
			directed: i
		}), s = 0, c = this.nodes(), l = 0; l < c.length; l++) {
			var u = c[l];
			if (!u.same(n)) {
				var d = o.distanceTo(u);
				s += a ? 1 / d : d;
			}
		}
		return a ? s : 1 / s;
	}
};
Qr.cc = Qr.closenessCentrality, Qr.ccn = Qr.closenessCentralityNormalised = Qr.closenessCentralityNormalized;
var $r = en({
	weight: null,
	directed: !1
}), ei = { betweennessCentrality: function(e) {
	for (var t = $r(e), n = t.directed, r = t.weight, i = r != null, a = this.cy(), o = this.nodes(), s = {}, c = {}, l = 0, u = {
		set: function(e, t) {
			c[e] = t, t > l && (l = t);
		},
		get: function(e) {
			return c[e];
		}
	}, d = 0; d < o.length; d++) {
		var f = o[d], p = f.id();
		s[p] = n ? f.outgoers().nodes() : f.openNeighborhood().nodes(), u.set(p, 0);
	}
	for (var m = function() {
		for (var e = o[h].id(), t = [], n = {}, c = {}, l = {}, d = new xn(function(e, t) {
			return l[e] - l[t];
		}), f = 0; f < o.length; f++) {
			var p = o[f].id();
			n[p] = [], c[p] = 0, l[p] = Infinity;
		}
		for (c[e] = 1, l[e] = 0, d.push(e); !d.empty();) {
			var m = d.pop();
			if (t.push(m), i) for (var g = 0; g < s[m].length; g++) {
				var _ = s[m][g], v = a.getElementById(m), y = void 0;
				y = v.edgesTo(_).length > 0 ? v.edgesTo(_)[0] : _.edgesTo(v)[0];
				var b = r(y);
				_ = _.id(), l[_] > l[m] + b && (l[_] = l[m] + b, d.nodes.indexOf(_) < 0 ? d.push(_) : d.updateItem(_), c[_] = 0, n[_] = []), l[_] == l[m] + b && (c[_] = c[_] + c[m], n[_].push(m));
			}
			else for (var x = 0; x < s[m].length; x++) {
				var S = s[m][x].id();
				l[S] == Infinity && (d.push(S), l[S] = l[m] + 1), l[S] == l[m] + 1 && (c[S] = c[S] + c[m], n[S].push(m));
			}
		}
		for (var C = {}, w = 0; w < o.length; w++) C[o[w].id()] = 0;
		for (; t.length > 0;) {
			for (var T = t.pop(), E = 0; E < n[T].length; E++) {
				var D = n[T][E];
				C[D] = C[D] + c[D] / c[T] * (1 + C[T]);
			}
			T != o[h].id() && u.set(T, u.get(T) + C[T]);
		}
	}, h = 0; h < o.length; h++) m();
	var g = {
		betweenness: function(e) {
			var t = a.collection(e).id();
			return u.get(t);
		},
		betweennessNormalized: function(e) {
			if (l == 0) return 0;
			var t = a.collection(e).id();
			return u.get(t) / l;
		}
	};
	return g.betweennessNormalised = g.betweennessNormalized, g;
} };
ei.bc = ei.betweennessCentrality;
var ti = en({
	expandFactor: 2,
	inflateFactor: 2,
	multFactor: 1,
	maxIterations: 20,
	attributes: [function(e) {
		return 1;
	}]
}), ni = function(e) {
	return ti(e);
}, ri = function(e, t) {
	for (var n = 0, r = 0; r < t.length; r++) n += t[r](e);
	return n;
}, ii = function(e, t, n) {
	for (var r = 0; r < t; r++) e[r * t + r] = n;
}, ai = function(e, t) {
	for (var n, r = 0; r < t; r++) {
		n = 0;
		for (var i = 0; i < t; i++) n += e[i * t + r];
		for (var a = 0; a < t; a++) e[a * t + r] = e[a * t + r] / n;
	}
}, oi = function(e, t, n) {
	for (var r = Array(n * n), i = 0; i < n; i++) {
		for (var a = 0; a < n; a++) r[i * n + a] = 0;
		for (var o = 0; o < n; o++) for (var s = 0; s < n; s++) r[i * n + s] += e[i * n + o] * t[o * n + s];
	}
	return r;
}, si = function(e, t, n) {
	for (var r = e.slice(0), i = 1; i < n; i++) e = oi(e, r, t);
	return e;
}, ci = function(e, t, n) {
	for (var r = Array(t * t), i = 0; i < t * t; i++) r[i] = e[i] ** +n;
	return ai(r, t), r;
}, li = function(e, t, n, r) {
	for (var i = 0; i < n; i++) if (Math.round(e[i] * 10 ** r) / 10 ** r != Math.round(t[i] * 10 ** r) / 10 ** r) return !1;
	return !0;
}, ui = function(e, t, n, r) {
	for (var i = [], a = 0; a < t; a++) {
		for (var o = [], s = 0; s < t; s++) Math.round(e[a * t + s] * 1e3) / 1e3 > 0 && o.push(n[s]);
		o.length !== 0 && i.push(r.collection(o));
	}
	return i;
}, di = function(e, t) {
	for (var n = 0; n < e.length; n++) if (!t[n] || e[n].id() !== t[n].id()) return !1;
	return !0;
}, fi = function(e) {
	for (var t = 0; t < e.length; t++) for (var n = 0; n < e.length; n++) t != n && di(e[t], e[n]) && e.splice(n, 1);
	return e;
}, pi = function(e) {
	for (var t = this.nodes(), n = this.edges(), r = this.cy(), i = ni(e), a = {}, o = 0; o < t.length; o++) a[t[o].id()] = o;
	for (var s = t.length, c = s * s, l = Array(c), u, d = 0; d < c; d++) l[d] = 0;
	for (var f = 0; f < n.length; f++) {
		var p = n[f], m = a[p.source().id()], h = a[p.target().id()], g = ri(p, i.attributes);
		l[m * s + h] += g, l[h * s + m] += g;
	}
	ii(l, s, i.multFactor), ai(l, s);
	for (var _ = !0, v = 0; _ && v < i.maxIterations;) _ = !1, u = si(l, s, i.expandFactor), l = ci(u, s, i.inflateFactor), li(l, u, c, 4) || (_ = !0), v++;
	var y = ui(l, s, t, r);
	return y = fi(y), y;
}, mi = {
	markovClustering: pi,
	mcl: pi
}, hi = function(e) {
	return e;
}, gi = function(e, t) {
	return Math.abs(t - e);
}, _i = function(e, t, n) {
	return e + gi(t, n);
}, vi = function(e, t, n) {
	return e + (n - t) ** 2;
}, yi = function(e) {
	return Math.sqrt(e);
}, bi = function(e, t, n) {
	return Math.max(e, gi(t, n));
}, xi = function(e, t, n, r, i) {
	for (var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : hi, o = r, s, c, l = 0; l < e; l++) s = t(l), c = n(l), o = i(o, s, c);
	return a(o);
}, Si = {
	euclidean: function(e, t, n) {
		return e >= 2 ? xi(e, t, n, 0, vi, yi) : xi(e, t, n, 0, _i);
	},
	squaredEuclidean: function(e, t, n) {
		return xi(e, t, n, 0, vi);
	},
	manhattan: function(e, t, n) {
		return xi(e, t, n, 0, _i);
	},
	max: function(e, t, n) {
		return xi(e, t, n, -Infinity, bi);
	}
};
Si["squared-euclidean"] = Si.squaredEuclidean, Si.squaredeuclidean = Si.squaredEuclidean;
function Ci(e, t, n, r, i, a) {
	var o = I(e) ? e : Si[e] || Si.euclidean;
	return t === 0 && I(e) ? o(i, a) : o(t, n, r, i, a);
}
var wi = en({
	k: 2,
	m: 2,
	sensitivityThreshold: 1e-4,
	distance: "euclidean",
	maxIterations: 10,
	attributes: [],
	testMode: !1,
	testCentroids: null
}), Ti = function(e) {
	return wi(e);
}, Ei = function(e, t, n, r, i) {
	var a = i === "kMedoids" ? function(e) {
		return r[e](n);
	} : function(e) {
		return n[e];
	}, o = function(e) {
		return r[e](t);
	}, s = n, c = t;
	return Ci(e, r.length, a, o, s, c);
}, Di = function(e, t, n) {
	for (var r = n.length, i = Array(r), a = Array(r), o = Array(t), s = null, c = 0; c < r; c++) i[c] = e.min(n[c]).value, a[c] = e.max(n[c]).value;
	for (var l = 0; l < t; l++) {
		s = [];
		for (var u = 0; u < r; u++) s[u] = Math.random() * (a[u] - i[u]) + i[u];
		o[l] = s;
	}
	return o;
}, Oi = function(e, t, n, r, i) {
	for (var a = Infinity, o = 0, s = 0; s < t.length; s++) {
		var c = Ei(n, e, t[s], r, i);
		c < a && (a = c, o = s);
	}
	return o;
}, ki = function(e, t, n) {
	for (var r = [], i = null, a = 0; a < t.length; a++) i = t[a], n[i.id()] === e && r.push(i);
	return r;
}, Ai = function(e, t, n) {
	return Math.abs(t - e) <= n;
}, ji = function(e, t, n) {
	for (var r = 0; r < e.length; r++) for (var i = 0; i < e[r].length; i++) if (Math.abs(e[r][i] - t[r][i]) > n) return !1;
	return !0;
}, Mi = function(e, t, n) {
	for (var r = 0; r < n; r++) if (e === t[r]) return !0;
	return !1;
}, Ni = function(e, t) {
	var n = Array(t);
	if (e.length < 50) for (var r = 0; r < t; r++) {
		for (var i = e[Math.floor(Math.random() * e.length)]; Mi(i, n, r);) i = e[Math.floor(Math.random() * e.length)];
		n[r] = i;
	}
	else for (var a = 0; a < t; a++) n[a] = e[Math.floor(Math.random() * e.length)];
	return n;
}, Pi = function(e, t, n) {
	for (var r = 0, i = 0; i < t.length; i++) r += Ei("manhattan", t[i], e, n, "kMedoids");
	return r;
}, Fi = function(e) {
	var t = this.cy(), n = this.nodes(), r = null, i = Ti(e), a = Array(i.k), o = {}, s;
	i.testMode ? typeof i.testCentroids == "number" ? (i.testCentroids, s = Di(n, i.k, i.attributes)) : s = E(i.testCentroids) === "object" ? i.testCentroids : Di(n, i.k, i.attributes) : s = Di(n, i.k, i.attributes);
	for (var c = !0, l = 0; c && l < i.maxIterations;) {
		for (var u = 0; u < n.length; u++) r = n[u], o[r.id()] = Oi(r, s, i.distance, i.attributes, "kMeans");
		c = !1;
		for (var d = 0; d < i.k; d++) {
			var f = ki(d, n, o);
			if (f.length !== 0) {
				for (var p = i.attributes.length, m = s[d], h = Array(p), g = Array(p), _ = 0; _ < p; _++) {
					g[_] = 0;
					for (var v = 0; v < f.length; v++) r = f[v], g[_] += i.attributes[_](r);
					h[_] = g[_] / f.length, Ai(h[_], m[_], i.sensitivityThreshold) || (c = !0);
				}
				s[d] = h, a[d] = t.collection(f);
			}
		}
		l++;
	}
	return a;
}, Ii = function(e) {
	var t = this.cy(), n = this.nodes(), r = null, i = Ti(e), a = Array(i.k), o, s = {}, c, l = Array(i.k);
	i.testMode ? typeof i.testCentroids == "number" || (o = E(i.testCentroids) === "object" ? i.testCentroids : Ni(n, i.k)) : o = Ni(n, i.k);
	for (var u = !0, d = 0; u && d < i.maxIterations;) {
		for (var f = 0; f < n.length; f++) r = n[f], s[r.id()] = Oi(r, o, i.distance, i.attributes, "kMedoids");
		u = !1;
		for (var p = 0; p < o.length; p++) {
			var m = ki(p, n, s);
			if (m.length !== 0) {
				l[p] = Pi(o[p], m, i.attributes);
				for (var h = 0; h < m.length; h++) c = Pi(m[h], m, i.attributes), c < l[p] && (l[p] = c, o[p] = m[h], u = !0);
				a[p] = t.collection(m);
			}
		}
		d++;
	}
	return a;
}, Li = function(e, t, n, r, i) {
	for (var a, o, s = 0; s < t.length; s++) for (var c = 0; c < e.length; c++) r[s][c] = n[s][c] ** +i.m;
	for (var l = 0; l < e.length; l++) for (var u = 0; u < i.attributes.length; u++) {
		a = 0, o = 0;
		for (var d = 0; d < t.length; d++) a += r[d][l] * i.attributes[u](t[d]), o += r[d][l];
		e[l][u] = a / o;
	}
}, Ri = function(e, t, n, r, i) {
	for (var a = 0; a < e.length; a++) t[a] = e[a].slice();
	for (var o, s, c, l = 2 / (i.m - 1), u = 0; u < n.length; u++) for (var d = 0; d < r.length; d++) {
		o = 0;
		for (var f = 0; f < n.length; f++) s = Ei(i.distance, r[d], n[u], i.attributes, "cmeans"), c = Ei(i.distance, r[d], n[f], i.attributes, "cmeans"), o += (s / c) ** +l;
		e[d][u] = 1 / o;
	}
}, zi = function(e, t, n, r) {
	for (var i = Array(n.k), a = 0; a < i.length; a++) i[a] = [];
	for (var o, s, c = 0; c < t.length; c++) {
		o = -Infinity, s = -1;
		for (var l = 0; l < t[0].length; l++) t[c][l] > o && (o = t[c][l], s = l);
		i[s].push(e[c]);
	}
	for (var u = 0; u < i.length; u++) i[u] = r.collection(i[u]);
	return i;
}, Bi = function(e) {
	for (var t = this.cy(), n = this.nodes(), r = Ti(e), i, a, o, s = Array(n.length), c, l = 0; l < n.length; l++) s[l] = Array(r.k);
	o = Array(n.length);
	for (var u = 0; u < n.length; u++) o[u] = Array(r.k);
	for (var d = 0; d < n.length; d++) {
		for (var f = 0, p = 0; p < r.k; p++) o[d][p] = Math.random(), f += o[d][p];
		for (var m = 0; m < r.k; m++) o[d][m] = o[d][m] / f;
	}
	a = Array(r.k);
	for (var h = 0; h < r.k; h++) a[h] = Array(r.attributes.length);
	c = Array(n.length);
	for (var g = 0; g < n.length; g++) c[g] = Array(r.k);
	for (var _ = !0, v = 0; _ && v < r.maxIterations;) _ = !1, Li(a, n, o, c, r), Ri(o, s, a, n, r), ji(o, s, r.sensitivityThreshold) || (_ = !0), v++;
	return i = zi(n, o, r, t), {
		clusters: i,
		degreeOfMembership: o
	};
}, Vi = {
	kMeans: Fi,
	kMedoids: Ii,
	fuzzyCMeans: Bi,
	fcm: Bi
}, Hi = en({
	distance: "euclidean",
	linkage: "min",
	mode: "threshold",
	threshold: Infinity,
	addDendrogram: !1,
	dendrogramDepth: 0,
	attributes: []
}), Ui = {
	single: "min",
	complete: "max"
}, Wi = function(e) {
	var t = Hi(e), n = Ui[t.linkage];
	return n != null && (t.linkage = n), t;
}, Gi = function(e, t, n, r, i) {
	for (var a = 0, o = Infinity, s, c = i.attributes, l = function(e, t) {
		return Ci(i.distance, c.length, function(t) {
			return c[t](e);
		}, function(e) {
			return c[e](t);
		}, e, t);
	}, u = 0; u < e.length; u++) {
		var d = e[u].key, f = n[d][r[d]];
		f < o && (a = d, o = f);
	}
	if (i.mode === "threshold" && o >= i.threshold || i.mode === "dendrogram" && e.length === 1) return !1;
	var p = t[a], m = t[r[a]], h = i.mode === "dendrogram" ? {
		left: p,
		right: m,
		key: p.key
	} : {
		value: p.value.concat(m.value),
		key: p.key
	};
	e[p.index] = h, e.splice(m.index, 1), t[p.key] = h;
	for (var g = 0; g < e.length; g++) {
		var _ = e[g];
		p.key === _.key ? s = Infinity : i.linkage === "min" ? (s = n[p.key][_.key], n[p.key][_.key] > n[m.key][_.key] && (s = n[m.key][_.key])) : i.linkage === "max" ? (s = n[p.key][_.key], n[p.key][_.key] < n[m.key][_.key] && (s = n[m.key][_.key])) : s = i.linkage === "mean" ? (n[p.key][_.key] * p.size + n[m.key][_.key] * m.size) / (p.size + m.size) : i.mode === "dendrogram" ? l(_.value, p.value) : l(_.value[0], p.value[0]), n[p.key][_.key] = n[_.key][p.key] = s;
	}
	for (var v = 0; v < e.length; v++) {
		var y = e[v].key;
		if (r[y] === p.key || r[y] === m.key) {
			for (var b = y, x = 0; x < e.length; x++) {
				var S = e[x].key;
				n[y][S] < n[y][b] && (b = S);
			}
			r[y] = b;
		}
		e[v].index = v;
	}
	return p.key = m.key = p.index = m.index = null, !0;
}, Ki = function(e, t, n) {
	e && (e.value ? t.push(e.value) : (e.left && Ki(e.left, t), e.right && Ki(e.right, t)));
}, qi = function(e, t) {
	if (!e) return "";
	if (e.left && e.right) {
		var n = qi(e.left, t), r = qi(e.right, t), i = t.add({
			group: "nodes",
			data: { id: n + "," + r }
		});
		return t.add({
			group: "edges",
			data: {
				source: n,
				target: i.id()
			}
		}), t.add({
			group: "edges",
			data: {
				source: r,
				target: i.id()
			}
		}), i.id();
	}
	if (e.value) return e.value.id();
}, Ji = function(e, t, n) {
	if (!e) return [];
	var r = [], i = [], a = [];
	return t === 0 ? (e.left && Ki(e.left, r), e.right && Ki(e.right, i), a = r.concat(i), [n.collection(a)]) : t === 1 ? e.value ? [n.collection(e.value)] : (e.left && Ki(e.left, r), e.right && Ki(e.right, i), [n.collection(r), n.collection(i)]) : e.value ? [n.collection(e.value)] : (e.left && (r = Ji(e.left, t - 1, n)), e.right && (i = Ji(e.right, t - 1, n)), r.concat(i));
}, Yi = function(e) {
	for (var t = this.cy(), n = this.nodes(), r = Wi(e), i = r.attributes, a = function(e, t) {
		return Ci(r.distance, i.length, function(t) {
			return i[t](e);
		}, function(e) {
			return i[e](t);
		}, e, t);
	}, o = [], s = [], c = [], l = [], u = 0; u < n.length; u++) {
		var d = {
			value: r.mode === "dendrogram" ? n[u] : [n[u]],
			key: u,
			index: u
		};
		o[u] = d, l[u] = d, s[u] = [], c[u] = 0;
	}
	for (var f = 0; f < o.length; f++) for (var p = 0; p <= f; p++) {
		var m = void 0;
		m = r.mode === "dendrogram" ? f === p ? Infinity : a(o[f].value, o[p].value) : f === p ? Infinity : a(o[f].value[0], o[p].value[0]), s[f][p] = m, s[p][f] = m, m < s[f][c[f]] && (c[f] = p);
	}
	for (var h = Gi(o, l, s, c, r); h;) h = Gi(o, l, s, c, r);
	var g;
	return r.mode === "dendrogram" ? (g = Ji(o[0], r.dendrogramDepth, t), r.addDendrogram && qi(o[0], t)) : (g = Array(o.length), o.forEach(function(e, n) {
		e.key = e.index = null, g[n] = t.collection(e.value);
	})), g;
}, Xi = {
	hierarchicalClustering: Yi,
	hca: Yi
}, Zi = en({
	distance: "euclidean",
	preference: "median",
	damping: .8,
	maxIterations: 1e3,
	minIterations: 100,
	attributes: []
}), Qi = function(e) {
	var t = e.damping, n = e.preference;
	.5 <= t && t < 1 || Gt(`Damping must range on [0.5, 1).  Got: ${t}`);
	var r = [
		"median",
		"mean",
		"min",
		"max"
	];
	return r.some(function(e) {
		return e === n;
	}) || B(n) || Gt(`Preference must be one of [${r.map(function(e) {
		return `'${e}'`;
	}).join(", ")}] or a number.  Got: ${n}`), Zi(e);
}, $i = function(e, t, n, r) {
	var i = function(e, t) {
		return r[t](e);
	};
	return -Ci(e, r.length, function(e) {
		return i(t, e);
	}, function(e) {
		return i(n, e);
	}, t, n);
}, ea = function(e, t) {
	var n = null;
	return n = t === "median" ? Hn(e) : t === "mean" ? Vn(e) : t === "min" ? zn(e) : t === "max" ? Bn(e) : t, n;
}, ta = function(e, t, n) {
	for (var r = [], i = 0; i < e; i++) t[i * e + i] + n[i * e + i] > 0 && r.push(i);
	return r;
}, na = function(e, t, n) {
	for (var r = [], i = 0; i < e; i++) {
		for (var a = -1, o = -Infinity, s = 0; s < n.length; s++) {
			var c = n[s];
			t[i * e + c] > o && (a = c, o = t[i * e + c]);
		}
		a > 0 && r.push(a);
	}
	for (var l = 0; l < n.length; l++) r[n[l]] = n[l];
	return r;
}, ra = function(e, t, n) {
	for (var r = na(e, t, n), i = 0; i < n.length; i++) {
		for (var a = [], o = 0; o < r.length; o++) r[o] === n[i] && a.push(o);
		for (var s = -1, c = -Infinity, l = 0; l < a.length; l++) {
			for (var u = 0, d = 0; d < a.length; d++) u += t[a[d] * e + a[l]];
			u > c && (s = l, c = u);
		}
		n[i] = a[s];
	}
	return r = na(e, t, n), r;
}, ia = function(e) {
	for (var t = this.cy(), n = this.nodes(), r = Qi(e), i = {}, a = 0; a < n.length; a++) i[n[a].id()] = a;
	for (var o = n.length, s = o * o, c = Array(s), l, u, d, f = 0; f < s; f++) c[f] = -Infinity;
	for (var p = 0; p < o; p++) for (var m = 0; m < o; m++) p !== m && (c[p * o + m] = $i(r.distance, n[p], n[m], r.attributes));
	l = ea(c, r.preference);
	for (var h = 0; h < o; h++) c[h * o + h] = l;
	u = Array(s);
	for (var g = 0; g < s; g++) u[g] = 0;
	d = Array(s);
	for (var _ = 0; _ < s; _++) d[_] = 0;
	for (var v = Array(o), y = Array(o), b = Array(o), x = 0; x < o; x++) v[x] = 0, y[x] = 0, b[x] = 0;
	for (var S = Array(o * r.minIterations), C = 0; C < S.length; C++) S[C] = 0;
	for (var w = 0; w < r.maxIterations; w++) {
		for (var T = 0; T < o; T++) {
			for (var E = -Infinity, D = -Infinity, O = -1, k = 0, A = 0; A < o; A++) v[A] = u[T * o + A], k = d[T * o + A] + c[T * o + A], k >= E ? (D = E, E = k, O = A) : k > D && (D = k);
			for (var j = 0; j < o; j++) u[T * o + j] = (1 - r.damping) * (c[T * o + j] - E) + r.damping * v[j];
			u[T * o + O] = (1 - r.damping) * (c[T * o + O] - D) + r.damping * v[O];
		}
		for (var M = 0; M < o; M++) {
			for (var N = 0, P = 0; P < o; P++) v[P] = d[P * o + M], y[P] = Math.max(0, u[P * o + M]), N += y[P];
			N -= y[M], y[M] = u[M * o + M], N += y[M];
			for (var F = 0; F < o; F++) d[F * o + M] = (1 - r.damping) * Math.min(0, N - y[F]) + r.damping * v[F];
			d[M * o + M] = (1 - r.damping) * (N - y[M]) + r.damping * v[M];
		}
		for (var I = 0, L = 0; L < o; L++) {
			var R = +(d[L * o + L] + u[L * o + L] > 0);
			S[w % r.minIterations * o + L] = R, I += R;
		}
		if (I > 0 && (w >= r.minIterations - 1 || w == r.maxIterations - 1)) {
			for (var z = 0, B = 0; B < o; B++) {
				b[B] = 0;
				for (var V = 0; V < r.minIterations; V++) b[B] += S[V * o + B];
				(b[B] === 0 || b[B] === r.minIterations) && z++;
			}
			if (z === o) break;
		}
	}
	for (var H = ta(o, u, d), U = ra(o, c, H), W = {}, G = 0; G < H.length; G++) W[H[G]] = [];
	for (var K = 0; K < n.length; K++) {
		var q = U[i[n[K].id()]];
		q != null && W[q].push(n[K]);
	}
	for (var ee = Array(H.length), J = 0; J < H.length; J++) ee[J] = t.collection(W[H[J]]);
	return ee;
}, aa = {
	affinityPropagation: ia,
	ap: ia
}, oa = en({
	root: void 0,
	directed: !1
}), sa = { hierholzer: function(e) {
	if (!R(e)) {
		var t = arguments;
		e = {
			root: t[0],
			directed: t[1]
		};
	}
	var n = oa(e), r = n.root, i = n.directed, a = this, o = !1, s, c, l;
	r && (l = F(r) ? this.filter(r)[0].id() : r[0].id());
	var u = {}, d = {};
	i ? a.forEach(function(e) {
		var t = e.id();
		if (e.isNode()) {
			var n = e.indegree(!0), r = e.outdegree(!0), i = n - r, a = r - n;
			i == 1 ? s ? o = !0 : s = t : a == 1 ? c ? o = !0 : c = t : (a > 1 || i > 1) && (o = !0), u[t] = [], e.outgoers().forEach(function(e) {
				e.isEdge() && u[t].push(e.id());
			});
		} else d[t] = [void 0, e.target().id()];
	}) : a.forEach(function(e) {
		var t = e.id();
		e.isNode() ? (e.degree(!0) % 2 && (s ? c ? o = !0 : c = t : s = t), u[t] = [], e.connectedEdges().forEach(function(e) {
			return u[t].push(e.id());
		})) : d[t] = [e.source().id(), e.target().id()];
	});
	var f = {
		found: !1,
		trail: void 0
	};
	if (o) return f;
	if (c && s) {
		if (i) {
			if (l && c != l) return f;
			l = c;
		} else if (l && c != l && s != l) return f;
		else l ||= c;
	} else l ||= a[0].id();
	var p = function(e) {
		for (var t = e, n = [e], r, a, o; u[t].length;) r = u[t].shift(), a = d[r][0], o = d[r][1], t == o ? !i && t != a && (u[a] = u[a].filter(function(e) {
			return e != r;
		}), t = a) : (u[o] = u[o].filter(function(e) {
			return e != r;
		}), t = o), n.unshift(r), n.unshift(t);
		return n;
	}, m = [], h = [];
	for (h = p(l); h.length != 1;) u[h[0]].length == 0 ? (m.unshift(a.getElementById(h.shift())), m.unshift(a.getElementById(h.shift()))) : h = p(h.shift()).concat(h);
	for (var g in m.unshift(a.getElementById(h.shift())), u) if (u[g].length) return f;
	return f.found = !0, f.trail = this.spawn(m, !0), f;
} }, ca = function() {
	var e = this, t = {}, n = 0, r = 0, i = [], a = [], o = {}, s = function(n, r) {
		for (var o = a.length - 1, s = [], c = e.spawn(); a[o].x != n || a[o].y != r;) s.push(a.pop().edge), o--;
		s.push(a.pop().edge), s.forEach(function(n) {
			var r = n.connectedNodes().intersection(e);
			c.merge(n), r.forEach(function(n) {
				var r = n.id(), i = n.connectedEdges().intersection(e);
				c.merge(n), t[r].cutVertex ? c.merge(i.filter(function(e) {
					return e.isLoop();
				})) : c.merge(i);
			});
		}), i.push(c);
	}, c = function(l, u, d) {
		l === d && (r += 1), t[u] = {
			id: n,
			low: n++,
			cutVertex: !1
		};
		var f = e.getElementById(u).connectedEdges().intersection(e);
		if (f.size() === 0) i.push(e.spawn(e.getElementById(u)));
		else {
			var p, m, h, g;
			f.forEach(function(e) {
				p = e.source().id(), m = e.target().id(), h = p === u ? m : p, h !== d && (g = e.id(), o[g] || (o[g] = !0, a.push({
					x: u,
					y: h,
					edge: e
				})), h in t ? t[u].low = Math.min(t[u].low, t[h].id) : (c(l, h, u), t[u].low = Math.min(t[u].low, t[h].low), t[u].id <= t[h].low && (t[u].cutVertex = !0, s(u, h))));
			});
		}
	};
	e.forEach(function(e) {
		if (e.isNode()) {
			var n = e.id();
			n in t || (r = 0, c(n, n), t[n].cutVertex = r > 1);
		}
	});
	var l = Object.keys(t).filter(function(e) {
		return t[e].cutVertex;
	}).map(function(t) {
		return e.getElementById(t);
	});
	return {
		cut: e.spawn(l),
		components: i
	};
}, la = {
	hopcroftTarjanBiconnected: ca,
	htbc: ca,
	htb: ca,
	hopcroftTarjanBiconnectedComponents: ca
}, ua = function() {
	var e = this, t = {}, n = 0, r = [], i = [], a = e.spawn(e), o = function(s) {
		if (i.push(s), t[s] = {
			index: n,
			low: n++,
			explored: !1
		}, e.getElementById(s).connectedEdges().intersection(e).forEach(function(e) {
			var n = e.target().id();
			n !== s && (n in t || o(n), t[n].explored || (t[s].low = Math.min(t[s].low, t[n].low)));
		}), t[s].index === t[s].low) {
			for (var c = e.spawn();;) {
				var l = i.pop();
				if (c.merge(e.getElementById(l)), t[l].low = t[s].index, t[l].explored = !0, l === s) break;
			}
			var u = c.edgesWith(c), d = c.merge(u);
			r.push(d), a = a.difference(d);
		}
	};
	return e.forEach(function(e) {
		if (e.isNode()) {
			var n = e.id();
			n in t || o(n);
		}
	}), {
		cut: a,
		components: r
	};
}, da = {
	tarjanStronglyConnected: ua,
	tsc: ua,
	tscc: ua,
	tarjanStronglyConnectedComponents: ua
}, fa = {};
[
	pn,
	Cn,
	wn,
	En,
	On,
	An,
	Pn,
	Jr,
	Xr,
	Qr,
	ei,
	mi,
	Vi,
	Xi,
	aa,
	sa,
	la,
	da
].forEach(function(e) {
	Z(fa, e);
});
var pa = 0, ma = 1, ha = 2, ga = function(e) {
	if (!(this instanceof ga)) return new ga(e);
	this.id = "Thenable/1.0.7", this.state = pa, this.fulfillValue = void 0, this.rejectReason = void 0, this.onFulfilled = [], this.onRejected = [], this.proxy = { then: this.then.bind(this) }, typeof e == "function" && e.call(this, this.fulfill.bind(this), this.reject.bind(this));
};
ga.prototype = {
	fulfill: function(e) {
		return _a(this, ma, "fulfillValue", e);
	},
	reject: function(e) {
		return _a(this, ha, "rejectReason", e);
	},
	then: function(e, t) {
		var n = this, r = new ga();
		return n.onFulfilled.push(ba(e, r, "fulfill")), n.onRejected.push(ba(t, r, "reject")), va(n), r.proxy;
	}
};
var _a = function(e, t, n, r) {
	return e.state === pa && (e.state = t, e[n] = r, va(e)), e;
}, va = function(e) {
	e.state === ma ? ya(e, "onFulfilled", e.fulfillValue) : e.state === ha && ya(e, "onRejected", e.rejectReason);
}, ya = function(e, t, n) {
	if (e[t].length !== 0) {
		var r = e[t];
		e[t] = [];
		var i = function() {
			for (var e = 0; e < r.length; e++) r[e](n);
		};
		typeof setImmediate == "function" ? setImmediate(i) : setTimeout(i, 0);
	}
}, ba = function(e, t, n) {
	return function(r) {
		if (typeof e != "function") t[n].call(t, r);
		else {
			var i;
			try {
				i = e(r);
			} catch (e) {
				t.reject(e);
				return;
			}
			xa(t, i);
		}
	};
}, xa = function(e, t) {
	if (e === t || e.proxy === t) {
		e.reject(/* @__PURE__ */ TypeError("cannot resolve promise with itself"));
		return;
	}
	var n;
	if (E(t) === "object" && t !== null || typeof t == "function") try {
		n = t.then;
	} catch (t) {
		e.reject(t);
		return;
	}
	if (typeof n == "function") {
		var r = !1;
		try {
			n.call(t, function(n) {
				r || (r = !0, n === t ? e.reject(/* @__PURE__ */ TypeError("circular thenable chain")) : xa(e, n));
			}, function(t) {
				r || (r = !0, e.reject(t));
			});
		} catch (t) {
			r || e.reject(t);
		}
		return;
	}
	e.fulfill(t);
};
ga.all = function(e) {
	return new ga(function(t, n) {
		for (var r = Array(e.length), i = 0, a = function(n, a) {
			r[n] = a, i++, i === e.length && t(r);
		}, o = 0; o < e.length; o++) (function(t) {
			var r = e[t];
			r != null && r.then != null ? r.then(function(e) {
				a(t, e);
			}, function(e) {
				n(e);
			}) : a(t, r);
		})(o);
	});
}, ga.resolve = function(e) {
	return new ga(function(t, n) {
		t(e);
	});
}, ga.reject = function(e) {
	return new ga(function(t, n) {
		n(e);
	});
};
var Sa = typeof Promise < "u" ? Promise : ga, Ca = function(e, t, n) {
	var r = K(e), i = !r, a = this._private = Z({ duration: 1e3 }, t, n);
	if (a.target = e, a.style = a.style || a.css, a.started = !1, a.playing = !1, a.hooked = !1, a.applying = !1, a.progress = 0, a.completes = [], a.frames = [], a.complete && I(a.complete) && a.completes.push(a.complete), i) {
		var o = e.position();
		a.startPosition = a.startPosition || {
			x: o.x,
			y: o.y
		}, a.startStyle = a.startStyle || e.cy().style().getAnimationStartStyle(e, a.style);
	}
	if (r) {
		var s = e.pan();
		a.startPan = {
			x: s.x,
			y: s.y
		}, a.startZoom = e.zoom();
	}
	this.length = 1, this[0] = this;
}, wa = Ca.prototype;
Z(wa, {
	instanceString: function() {
		return "animation";
	},
	hook: function() {
		var e = this._private;
		if (!e.hooked) {
			var t, n = e.target._private.animation;
			t = e.queue ? n.queue : n.current, t.push(this), U(e.target) && e.target.cy().addToAnimationPool(e.target), e.hooked = !0;
		}
		return this;
	},
	play: function() {
		var e = this._private;
		return e.progress === 1 && (e.progress = 0), e.playing = !0, e.started = !1, e.stopped = !1, this.hook(), this;
	},
	playing: function() {
		return this._private.playing;
	},
	apply: function() {
		var e = this._private;
		return e.applying = !0, e.started = !1, e.stopped = !1, this.hook(), this;
	},
	applying: function() {
		return this._private.applying;
	},
	pause: function() {
		var e = this._private;
		return e.playing = !1, e.started = !1, this;
	},
	stop: function() {
		var e = this._private;
		return e.playing = !1, e.started = !1, e.stopped = !0, this;
	},
	rewind: function() {
		return this.progress(0);
	},
	fastforward: function() {
		return this.progress(1);
	},
	time: function(e) {
		var t = this._private;
		return e === void 0 ? t.progress * t.duration : this.progress(e / t.duration);
	},
	progress: function(e) {
		var t = this._private, n = t.playing;
		return e === void 0 ? t.progress : (n && this.pause(), t.progress = e, t.started = !1, n && this.play(), this);
	},
	completed: function() {
		return this._private.progress === 1;
	},
	reverse: function() {
		var e = this._private, t = e.playing;
		t && this.pause(), e.progress = 1 - e.progress, e.started = !1;
		var n = function(t, n) {
			var r = e[t];
			r != null && (e[t] = e[n], e[n] = r);
		};
		if (n("zoom", "startZoom"), n("pan", "startPan"), n("position", "startPosition"), e.style) for (var r = 0; r < e.style.length; r++) {
			var i = e.style[r], a = i.name, o = e.startStyle[a];
			e.startStyle[a] = i, e.style[r] = o;
		}
		return t && this.play(), this;
	},
	promise: function(e) {
		var t = this._private, n;
		switch (e) {
			case "frame":
				n = t.frames;
				break;
			default:
			case "complete":
			case "completed": n = t.completes;
		}
		return new Sa(function(e, t) {
			n.push(function() {
				e();
			});
		});
	}
}), wa.complete = wa.completed, wa.run = wa.play, wa.running = wa.playing;
var Ta = {
	animated: function() {
		return function() {
			var e = this, t = e.length === void 0 ? [e] : e;
			if (!(this._private.cy || this).styleEnabled()) return !1;
			var n = t[0];
			if (n) return n._private.animation.current.length > 0;
		};
	},
	clearQueue: function() {
		return function() {
			var e = this, t = e.length === void 0 ? [e] : e;
			if (!(this._private.cy || this).styleEnabled()) return this;
			for (var n = 0; n < t.length; n++) {
				var r = t[n];
				r._private.animation.queue = [];
			}
			return this;
		};
	},
	delay: function() {
		return function(e, t) {
			return (this._private.cy || this).styleEnabled() ? this.animate({
				delay: e,
				duration: e,
				complete: t
			}) : this;
		};
	},
	delayAnimation: function() {
		return function(e, t) {
			return (this._private.cy || this).styleEnabled() ? this.animation({
				delay: e,
				duration: e,
				complete: t
			}) : this;
		};
	},
	animation: function() {
		return function(e, t) {
			var n = this, r = n.length !== void 0, i = r ? n : [n], a = this._private.cy || this, o = !r, s = !o;
			if (!a.styleEnabled()) return this;
			var c = a.style();
			if (e = Z({}, e, t), Object.keys(e).length === 0) return new Ca(i[0], e);
			switch (e.duration === void 0 && (e.duration = 400), e.duration) {
				case "slow":
					e.duration = 600;
					break;
				case "fast": e.duration = 200;
			}
			if (s && (e.style = c.getPropsList(e.style || e.css), e.css = void 0), s && e.renderedPosition != null) {
				var l = e.renderedPosition, u = a.pan(), d = a.zoom();
				e.position = Ln(l, d, u);
			}
			if (o && e.panBy != null) {
				var f = e.panBy, p = a.pan();
				e.pan = {
					x: p.x + f.x,
					y: p.y + f.y
				};
			}
			var m = e.center || e.centre;
			if (o && m != null) {
				var h = a.getCenterPan(m.eles, e.zoom);
				h != null && (e.pan = h);
			}
			if (o && e.fit != null) {
				var g = e.fit, _ = a.getFitViewport(g.eles || g.boundingBox, g.padding);
				_ != null && (e.pan = _.pan, e.zoom = _.zoom);
			}
			if (o && R(e.zoom)) {
				var v = a.getZoomedViewport(e.zoom);
				v == null ? e.zoom = null : (v.zoomed && (e.zoom = v.zoom), v.panned && (e.pan = v.pan));
			}
			return new Ca(i[0], e);
		};
	},
	animate: function() {
		return function(e, t) {
			var n = this, r = n.length === void 0 ? [n] : n;
			if (!(this._private.cy || this).styleEnabled()) return this;
			t && (e = Z({}, e, t));
			for (var i = 0; i < r.length; i++) {
				var a = r[i], o = a.animated() && (e.queue === void 0 || e.queue);
				a.animation(e, o ? { queue: !0 } : void 0).play();
			}
			return this;
		};
	},
	stop: function() {
		return function(e, t) {
			var n = this, r = n.length === void 0 ? [n] : n, i = this._private.cy || this;
			if (!i.styleEnabled()) return this;
			for (var a = 0; a < r.length; a++) {
				for (var o = r[a]._private, s = o.animation.current, c = 0; c < s.length; c++) {
					var l = s[c]._private;
					t && (l.duration = 0);
				}
				e && (o.animation.queue = []), t || (o.animation.current = []);
			}
			return i.notify("draw"), this;
		};
	}
}, Ea, Da;
function Oa() {
	return Da ? Ea : (Da = 1, Ea = Array.isArray, Ea);
}
var ka, Aa;
function ja() {
	if (Aa) return ka;
	Aa = 1;
	var e = Oa(), t = ct(), n = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, r = /^\w*$/;
	function i(i, a) {
		if (e(i)) return !1;
		var o = typeof i;
		return o == "number" || o == "symbol" || o == "boolean" || i == null || t(i) ? !0 : r.test(i) || !n.test(i) || a != null && i in Object(a);
	}
	return ka = i, ka;
}
var Ma, Na;
function Pa() {
	if (Na) return Ma;
	Na = 1;
	var e = rt(), t = Ae(), n = "[object AsyncFunction]", r = "[object Function]", i = "[object GeneratorFunction]", a = "[object Proxy]";
	function o(o) {
		if (!t(o)) return !1;
		var s = e(o);
		return s == r || s == i || s == n || s == a;
	}
	return Ma = o, Ma;
}
var Fa, Ia;
function La() {
	return Ia ? Fa : (Ia = 1, Fa = Ie()["__core-js_shared__"], Fa);
}
var Ra, za;
function Ba() {
	if (za) return Ra;
	za = 1;
	var e = La(), t = function() {
		var t = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
		return t ? "Symbol(src)_1." + t : "";
	}();
	function n(e) {
		return !!t && t in e;
	}
	return Ra = n, Ra;
}
var Va, Ha;
function Ua() {
	if (Ha) return Va;
	Ha = 1;
	var e = Function.prototype.toString;
	function t(t) {
		if (t != null) {
			try {
				return e.call(t);
			} catch {}
			try {
				return t + "";
			} catch {}
		}
		return "";
	}
	return Va = t, Va;
}
var Wa, Ga;
function Ka() {
	if (Ga) return Wa;
	Ga = 1;
	var e = Pa(), t = Ba(), n = Ae(), r = Ua(), i = /[\\^$.*+?()[\]{}|]/g, a = /^\[object .+?Constructor\]$/, o = Function.prototype, s = Object.prototype, c = o.toString, l = s.hasOwnProperty, u = RegExp("^" + c.call(l).replace(i, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	function d(i) {
		return !n(i) || t(i) ? !1 : (e(i) ? u : a).test(r(i));
	}
	return Wa = d, Wa;
}
var qa, Ja;
function Ya() {
	if (Ja) return qa;
	Ja = 1;
	function e(e, t) {
		return e?.[t];
	}
	return qa = e, qa;
}
var Xa, Za;
function Qa() {
	if (Za) return Xa;
	Za = 1;
	var e = Ka(), t = Ya();
	function n(n, r) {
		var i = t(n, r);
		return e(i) ? i : void 0;
	}
	return Xa = n, Xa;
}
var $a, eo;
function to() {
	return eo ? $a : (eo = 1, $a = Qa()(Object, "create"), $a);
}
var no, ro;
function io() {
	if (ro) return no;
	ro = 1;
	var e = to();
	function t() {
		this.__data__ = e ? e(null) : {}, this.size = 0;
	}
	return no = t, no;
}
var ao, oo;
function so() {
	if (oo) return ao;
	oo = 1;
	function e(e) {
		var t = this.has(e) && delete this.__data__[e];
		return this.size -= +!!t, t;
	}
	return ao = e, ao;
}
var co, lo;
function uo() {
	if (lo) return co;
	lo = 1;
	var e = to(), t = "__lodash_hash_undefined__", n = Object.prototype.hasOwnProperty;
	function r(r) {
		var i = this.__data__;
		if (e) {
			var a = i[r];
			return a === t ? void 0 : a;
		}
		return n.call(i, r) ? i[r] : void 0;
	}
	return co = r, co;
}
var fo, po;
function mo() {
	if (po) return fo;
	po = 1;
	var e = to(), t = Object.prototype.hasOwnProperty;
	function n(n) {
		var r = this.__data__;
		return e ? r[n] !== void 0 : t.call(r, n);
	}
	return fo = n, fo;
}
var ho, go;
function _o() {
	if (go) return ho;
	go = 1;
	var e = to(), t = "__lodash_hash_undefined__";
	function n(n, r) {
		var i = this.__data__;
		return this.size += +!this.has(n), i[n] = e && r === void 0 ? t : r, this;
	}
	return ho = n, ho;
}
var vo, yo;
function bo() {
	if (yo) return vo;
	yo = 1;
	var e = io(), t = so(), n = uo(), r = mo(), i = _o();
	function a(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = n, a.prototype.has = r, a.prototype.set = i, vo = a, vo;
}
var xo, So;
function Co() {
	if (So) return xo;
	So = 1;
	function e() {
		this.__data__ = [], this.size = 0;
	}
	return xo = e, xo;
}
var wo, To;
function Eo() {
	if (To) return wo;
	To = 1;
	function e(e, t) {
		return e === t || e !== e && t !== t;
	}
	return wo = e, wo;
}
var Do, Oo;
function ko() {
	if (Oo) return Do;
	Oo = 1;
	var e = Eo();
	function t(t, n) {
		for (var r = t.length; r--;) if (e(t[r][0], n)) return r;
		return -1;
	}
	return Do = t, Do;
}
var Ao, jo;
function Mo() {
	if (jo) return Ao;
	jo = 1;
	var e = ko(), t = Array.prototype.splice;
	function n(n) {
		var r = this.__data__, i = e(r, n);
		return i < 0 ? !1 : (i == r.length - 1 ? r.pop() : t.call(r, i, 1), --this.size, !0);
	}
	return Ao = n, Ao;
}
var No, Po;
function Fo() {
	if (Po) return No;
	Po = 1;
	var e = ko();
	function t(t) {
		var n = this.__data__, r = e(n, t);
		return r < 0 ? void 0 : n[r][1];
	}
	return No = t, No;
}
var Io, Lo;
function Ro() {
	if (Lo) return Io;
	Lo = 1;
	var e = ko();
	function t(t) {
		return e(this.__data__, t) > -1;
	}
	return Io = t, Io;
}
var zo, Bo;
function Vo() {
	if (Bo) return zo;
	Bo = 1;
	var e = ko();
	function t(t, n) {
		var r = this.__data__, i = e(r, t);
		return i < 0 ? (++this.size, r.push([t, n])) : r[i][1] = n, this;
	}
	return zo = t, zo;
}
var Ho, Uo;
function Wo() {
	if (Uo) return Ho;
	Uo = 1;
	var e = Co(), t = Mo(), n = Fo(), r = Ro(), i = Vo();
	function a(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = n, a.prototype.has = r, a.prototype.set = i, Ho = a, Ho;
}
var Go, Ko;
function qo() {
	return Ko ? Go : (Ko = 1, Go = Qa()(Ie(), "Map"), Go);
}
var Jo, Yo;
function Xo() {
	if (Yo) return Jo;
	Yo = 1;
	var e = bo(), t = Wo(), n = qo();
	function r() {
		this.size = 0, this.__data__ = {
			hash: new e(),
			map: new (n || t)(),
			string: new e()
		};
	}
	return Jo = r, Jo;
}
var Zo, Qo;
function $o() {
	if (Qo) return Zo;
	Qo = 1;
	function e(e) {
		var t = typeof e;
		return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
	}
	return Zo = e, Zo;
}
var es, ts;
function ns() {
	if (ts) return es;
	ts = 1;
	var e = $o();
	function t(t, n) {
		var r = t.__data__;
		return e(n) ? r[typeof n == "string" ? "string" : "hash"] : r.map;
	}
	return es = t, es;
}
var rs, is;
function as() {
	if (is) return rs;
	is = 1;
	var e = ns();
	function t(t) {
		var n = e(this, t).delete(t);
		return this.size -= +!!n, n;
	}
	return rs = t, rs;
}
var os, ss;
function cs() {
	if (ss) return os;
	ss = 1;
	var e = ns();
	function t(t) {
		return e(this, t).get(t);
	}
	return os = t, os;
}
var ls, us;
function ds() {
	if (us) return ls;
	us = 1;
	var e = ns();
	function t(t) {
		return e(this, t).has(t);
	}
	return ls = t, ls;
}
var fs, ps;
function ms() {
	if (ps) return fs;
	ps = 1;
	var e = ns();
	function t(t, n) {
		var r = e(this, t), i = r.size;
		return r.set(t, n), this.size += r.size == i ? 0 : 1, this;
	}
	return fs = t, fs;
}
var hs, gs;
function _s() {
	if (gs) return hs;
	gs = 1;
	var e = Xo(), t = as(), n = cs(), r = ds(), i = ms();
	function a(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = n, a.prototype.has = r, a.prototype.set = i, hs = a, hs;
}
var vs, ys;
function bs() {
	if (ys) return vs;
	ys = 1;
	var e = _s(), t = "Expected a function";
	function n(r, i) {
		if (typeof r != "function" || i != null && typeof i != "function") throw TypeError(t);
		var a = function() {
			var e = arguments, t = i ? i.apply(this, e) : e[0], n = a.cache;
			if (n.has(t)) return n.get(t);
			var o = r.apply(this, e);
			return a.cache = n.set(t, o) || n, o;
		};
		return a.cache = new (n.Cache || e)(), a;
	}
	return n.Cache = e, vs = n, vs;
}
var xs, Ss;
function Cs() {
	if (Ss) return xs;
	Ss = 1;
	var e = bs(), t = 500;
	function n(n) {
		var r = e(n, function(e) {
			return i.size === t && i.clear(), e;
		}), i = r.cache;
		return r;
	}
	return xs = n, xs;
}
var ws, Ts;
function Es() {
	if (Ts) return ws;
	Ts = 1;
	var e = Cs(), t = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, n = /\\(\\)?/g;
	return ws = e(function(e) {
		var r = [];
		return e.charCodeAt(0) === 46 && r.push(""), e.replace(t, function(e, t, i, a) {
			r.push(i ? a.replace(n, "$1") : t || e);
		}), r;
	}), ws;
}
var Ds, Os;
function ks() {
	if (Os) return Ds;
	Os = 1;
	function e(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r;) i[n] = t(e[n], n, e);
		return i;
	}
	return Ds = e, Ds;
}
var As, js;
function Ms() {
	if (js) return As;
	js = 1;
	var e = Je(), t = ks(), n = Oa(), r = ct(), i = e ? e.prototype : void 0, a = i ? i.toString : void 0;
	function o(e) {
		if (typeof e == "string") return e;
		if (n(e)) return t(e, o) + "";
		if (r(e)) return a ? a.call(e) : "";
		var i = e + "";
		return i == "0" && 1 / e == -Infinity ? "-0" : i;
	}
	return As = o, As;
}
var Ns, Ps;
function Fs() {
	if (Ps) return Ns;
	Ps = 1;
	var e = Ms();
	function t(t) {
		return t == null ? "" : e(t);
	}
	return Ns = t, Ns;
}
var Is, Ls;
function Rs() {
	if (Ls) return Is;
	Ls = 1;
	var e = Oa(), t = ja(), n = Es(), r = Fs();
	function i(i, a) {
		return e(i) ? i : t(i, a) ? [i] : n(r(i));
	}
	return Is = i, Is;
}
var zs, Bs;
function Vs() {
	if (Bs) return zs;
	Bs = 1;
	var e = ct();
	function t(t) {
		if (typeof t == "string" || e(t)) return t;
		var n = t + "";
		return n == "0" && 1 / t == -Infinity ? "-0" : n;
	}
	return zs = t, zs;
}
var Hs, Us;
function Ws() {
	if (Us) return Hs;
	Us = 1;
	var e = Rs(), t = Vs();
	function n(n, r) {
		r = e(r, n);
		for (var i = 0, a = r.length; n != null && i < a;) n = n[t(r[i++])];
		return i && i == a ? n : void 0;
	}
	return Hs = n, Hs;
}
var Gs, Ks;
function qs() {
	if (Ks) return Gs;
	Ks = 1;
	var e = Ws();
	function t(t, n, r) {
		var i = t == null ? void 0 : e(t, n);
		return i === void 0 ? r : i;
	}
	return Gs = t, Gs;
}
var Js = /*@__PURE__*/ De(qs()), Ys, Xs;
function Zs() {
	if (Xs) return Ys;
	Xs = 1;
	var e = Qa();
	return Ys = function() {
		try {
			var t = e(Object, "defineProperty");
			return t({}, "", {}), t;
		} catch {}
	}(), Ys;
}
var Qs, $s;
function ec() {
	if ($s) return Qs;
	$s = 1;
	var e = Zs();
	function t(t, n, r) {
		n == "__proto__" && e ? e(t, n, {
			configurable: !0,
			enumerable: !0,
			value: r,
			writable: !0
		}) : t[n] = r;
	}
	return Qs = t, Qs;
}
var tc, nc;
function rc() {
	if (nc) return tc;
	nc = 1;
	var e = ec(), t = Eo(), n = Object.prototype.hasOwnProperty;
	function r(r, i, a) {
		var o = r[i];
		(!(n.call(r, i) && t(o, a)) || a === void 0 && !(i in r)) && e(r, i, a);
	}
	return tc = r, tc;
}
var ic, ac;
function oc() {
	if (ac) return ic;
	ac = 1;
	var e = 9007199254740991, t = /^(?:0|[1-9]\d*)$/;
	function n(n, r) {
		var i = typeof n;
		return r ??= e, !!r && (i == "number" || i != "symbol" && t.test(n)) && n > -1 && n % 1 == 0 && n < r;
	}
	return ic = n, ic;
}
var sc, cc;
function lc() {
	if (cc) return sc;
	cc = 1;
	var e = rc(), t = Rs(), n = oc(), r = Ae(), i = Vs();
	function a(a, o, s, c) {
		if (!r(a)) return a;
		o = t(o, a);
		for (var l = -1, u = o.length, d = u - 1, f = a; f != null && ++l < u;) {
			var p = i(o[l]), m = s;
			if (p === "__proto__" || p === "constructor" || p === "prototype") return a;
			if (l != d) {
				var h = f[p];
				m = c ? c(h, p, f) : void 0, m === void 0 && (m = r(h) ? h : n(o[l + 1]) ? [] : {});
			}
			e(f, p, m), f = f[p];
		}
		return a;
	}
	return sc = a, sc;
}
var uc, dc;
function fc() {
	if (dc) return uc;
	dc = 1;
	var e = lc();
	function t(t, n, r) {
		return t == null ? t : e(t, n, r);
	}
	return uc = t, uc;
}
var pc = /*@__PURE__*/ De(fc()), mc, hc;
function gc() {
	if (hc) return mc;
	hc = 1;
	function e(e, t) {
		var n = -1, r = e.length;
		for (t ||= Array(r); ++n < r;) t[n] = e[n];
		return t;
	}
	return mc = e, mc;
}
var _c, vc;
function yc() {
	if (vc) return _c;
	vc = 1;
	var e = ks(), t = gc(), n = Oa(), r = ct(), i = Es(), a = Vs(), o = Fs();
	function s(s) {
		return n(s) ? e(s, a) : r(s) ? [s] : t(i(o(s)));
	}
	return _c = s, _c;
}
var bc = /*@__PURE__*/ De(yc()), xc = {
	data: function(e) {
		return e = Z({}, {
			field: "data",
			bindingEvent: "data",
			allowBinding: !1,
			allowSetting: !1,
			allowGetting: !1,
			settingEvent: "data",
			settingTriggersEvent: !1,
			triggerFnName: "trigger",
			immutableKeys: {},
			updateStyle: !1,
			beforeGet: function(e) {},
			beforeSet: function(e, t) {},
			onSet: function(e) {},
			canSet: function(e) {
				return !0;
			}
		}, e), function(t, n) {
			var r = e, i = this, a = i.length !== void 0, o = a ? i : [i], s = a ? i[0] : i;
			if (F(t)) {
				var c = t.indexOf(".") !== -1 && bc(t);
				if (r.allowGetting && n === void 0) {
					var l;
					return s && (r.beforeGet(s), l = c && s._private[r.field][t] === void 0 ? Js(s._private[r.field], c) : s._private[r.field][t]), l;
				}
				if (r.allowSetting && n !== void 0 && !r.immutableKeys[t]) {
					var u = _({}, t, n);
					r.beforeSet(i, u);
					for (var d = 0, f = o.length; d < f; d++) {
						var p = o[d];
						r.canSet(p) && (c && s._private[r.field][t] === void 0 ? pc(p._private[r.field], c, n) : p._private[r.field][t] = n);
					}
					r.updateStyle && i.updateStyle(), r.onSet(i), r.settingTriggersEvent && i[r.triggerFnName](r.settingEvent);
				}
			} else if (r.allowSetting && R(t)) {
				var m = t, h, g, v = Object.keys(m);
				r.beforeSet(i, m);
				for (var y = 0; y < v.length; y++) if (h = v[y], g = m[h], !r.immutableKeys[h]) for (var b = 0; b < o.length; b++) {
					var x = o[b];
					r.canSet(x) && (x._private[r.field][h] = g);
				}
				r.updateStyle && i.updateStyle(), r.onSet(i), r.settingTriggersEvent && i[r.triggerFnName](r.settingEvent);
			} else if (r.allowBinding && I(t)) {
				var S = t;
				i.on(r.bindingEvent, S);
			} else if (r.allowGetting && t === void 0) {
				var C;
				return s && (r.beforeGet(s), C = s._private[r.field]), C;
			}
			return i;
		};
	},
	removeData: function(e) {
		return e = Z({}, {
			field: "data",
			event: "data",
			triggerFnName: "trigger",
			triggerEvent: !1,
			immutableKeys: {}
		}, e), function(t) {
			var n = e, r = this, i = r.length === void 0 ? [r] : r;
			if (F(t)) {
				for (var a = t.split(/\s+/), o = a.length, s = 0; s < o; s++) {
					var c = a[s];
					if (!J(c) && !n.immutableKeys[c]) for (var l = 0, u = i.length; l < u; l++) i[l]._private[n.field][c] = void 0;
				}
				n.triggerEvent && r[n.triggerFnName](n.event);
			} else if (t === void 0) {
				for (var d = 0, f = i.length; d < f; d++) for (var p = i[d]._private[n.field], m = Object.keys(p), h = 0; h < m.length; h++) {
					var g = m[h];
					n.immutableKeys[g] || (p[g] = void 0);
				}
				n.triggerEvent && r[n.triggerFnName](n.event);
			}
			return r;
		};
	}
}, Sc = { eventAliasesOn: function(e) {
	var t = e;
	t.addListener = t.listen = t.bind = t.on, t.unlisten = t.unbind = t.off = t.removeListener, t.trigger = t.emit, t.pon = t.promiseOn = function(e, t) {
		var n = this, r = Array.prototype.slice.call(arguments, 0);
		return new Sa(function(e, t) {
			var i = r.concat([function(t) {
				n.off.apply(n, a), e(t);
			}]), a = i.concat([]);
			n.on.apply(n, i);
		});
	};
} }, Cc = {};
[
	Ta,
	xc,
	Sc
].forEach(function(e) {
	Z(Cc, e);
});
var wc = {
	animate: Cc.animate(),
	animation: Cc.animation(),
	animated: Cc.animated(),
	clearQueue: Cc.clearQueue(),
	delay: Cc.delay(),
	delayAnimation: Cc.delayAnimation(),
	stop: Cc.stop()
}, Tc = {
	classes: function(e) {
		var t = this;
		if (e === void 0) {
			var n = [];
			return t[0]._private.classes.forEach(function(e) {
				return n.push(e);
			}), n;
		}
		L(e) || (e = (e || "").match(/\S+/g) || []);
		for (var r = [], i = new un(e), a = 0; a < t.length; a++) {
			for (var o = t[a], s = o._private, c = s.classes, l = !1, u = 0; u < e.length; u++) {
				var d = e[u];
				if (!c.has(d)) {
					l = !0;
					break;
				}
			}
			l ||= c.size !== e.length, l && (s.classes = i, r.push(o));
		}
		return r.length > 0 && this.spawn(r).updateStyle().emit("class"), t;
	},
	addClass: function(e) {
		return this.toggleClass(e, !0);
	},
	hasClass: function(e) {
		var t = this[0];
		return t != null && t._private.classes.has(e);
	},
	toggleClass: function(e, t) {
		L(e) || (e = e.match(/\S+/g) || []);
		for (var n = this, r = t === void 0, i = [], a = 0, o = n.length; a < o; a++) for (var s = n[a], c = s._private.classes, l = !1, u = 0; u < e.length; u++) {
			var d = e[u], f = c.has(d), p = !1;
			t || r && !f ? (c.add(d), p = !0) : (!t || r && f) && (c.delete(d), p = !0), !l && p && (i.push(s), l = !0);
		}
		return i.length > 0 && this.spawn(i).updateStyle().emit("class"), n;
	},
	removeClass: function(e) {
		return this.toggleClass(e, !1);
	},
	flashClass: function(e, t) {
		var n = this;
		if (t == null) t = 250;
		else if (t === 0) return n;
		return n.addClass(e), setTimeout(function() {
			n.removeClass(e);
		}, t), n;
	}
};
Tc.className = Tc.classNames = Tc.classes;
var Ec = {
	metaChar: "[\\!\\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]",
	comparatorOp: "=|\\!=|>|>=|<|<=|\\$=|\\^=|\\*=",
	boolOp: "\\?|\\!|\\^",
	string: "\"(?:\\\\\"|[^\"])*\"|'(?:\\\\'|[^'])*'",
	number: ue,
	meta: "degree|indegree|outdegree",
	separator: "\\s*,\\s*",
	descendant: "\\s+",
	child: "\\s+>\\s+",
	subject: "\\$",
	group: "node|edge|\\*",
	directedEdge: "\\s+->\\s+",
	undirectedEdge: "\\s+<->\\s+"
};
Ec.variable = "(?:[\\w-.]|(?:\\\\" + Ec.metaChar + "))+", Ec.className = "(?:[\\w-]|(?:\\\\" + Ec.metaChar + "))+", Ec.value = Ec.string + "|" + Ec.number, Ec.id = Ec.variable, (function() {
	for (var e = Ec.comparatorOp.split("|"), t, n = 0; n < e.length; n++) t = e[n], Ec.comparatorOp += "|@" + t;
	for (e = Ec.comparatorOp.split("|"), n = 0; n < e.length; n++) t = e[n], !(t.indexOf("!") >= 0) && t !== "=" && (Ec.comparatorOp += "|\\!" + t);
})();
var Dc = function() {
	return { checks: [] };
}, $ = {
	GROUP: 0,
	COLLECTION: 1,
	FILTER: 2,
	DATA_COMPARE: 3,
	DATA_EXIST: 4,
	DATA_BOOL: 5,
	META_COMPARE: 6,
	STATE: 7,
	ID: 8,
	CLASS: 9,
	UNDIRECTED_EDGE: 10,
	DIRECTED_EDGE: 11,
	NODE_SOURCE: 12,
	NODE_TARGET: 13,
	NODE_NEIGHBOR: 14,
	CHILD: 15,
	DESCENDANT: 16,
	PARENT: 17,
	ANCESTOR: 18,
	COMPOUND_SPLIT: 19,
	TRUE: 20
}, Oc = [
	{
		selector: ":selected",
		matches: function(e) {
			return e.selected();
		}
	},
	{
		selector: ":unselected",
		matches: function(e) {
			return !e.selected();
		}
	},
	{
		selector: ":selectable",
		matches: function(e) {
			return e.selectable();
		}
	},
	{
		selector: ":unselectable",
		matches: function(e) {
			return !e.selectable();
		}
	},
	{
		selector: ":locked",
		matches: function(e) {
			return e.locked();
		}
	},
	{
		selector: ":unlocked",
		matches: function(e) {
			return !e.locked();
		}
	},
	{
		selector: ":visible",
		matches: function(e) {
			return e.visible();
		}
	},
	{
		selector: ":hidden",
		matches: function(e) {
			return !e.visible();
		}
	},
	{
		selector: ":transparent",
		matches: function(e) {
			return e.transparent();
		}
	},
	{
		selector: ":grabbed",
		matches: function(e) {
			return e.grabbed();
		}
	},
	{
		selector: ":free",
		matches: function(e) {
			return !e.grabbed();
		}
	},
	{
		selector: ":removed",
		matches: function(e) {
			return e.removed();
		}
	},
	{
		selector: ":inside",
		matches: function(e) {
			return !e.removed();
		}
	},
	{
		selector: ":grabbable",
		matches: function(e) {
			return e.grabbable();
		}
	},
	{
		selector: ":ungrabbable",
		matches: function(e) {
			return !e.grabbable();
		}
	},
	{
		selector: ":animated",
		matches: function(e) {
			return e.animated();
		}
	},
	{
		selector: ":unanimated",
		matches: function(e) {
			return !e.animated();
		}
	},
	{
		selector: ":parent",
		matches: function(e) {
			return e.isParent();
		}
	},
	{
		selector: ":childless",
		matches: function(e) {
			return e.isChildless();
		}
	},
	{
		selector: ":child",
		matches: function(e) {
			return e.isChild();
		}
	},
	{
		selector: ":orphan",
		matches: function(e) {
			return e.isOrphan();
		}
	},
	{
		selector: ":nonorphan",
		matches: function(e) {
			return e.isChild();
		}
	},
	{
		selector: ":compound",
		matches: function(e) {
			return e.isNode() ? e.isParent() : e.source().isParent() || e.target().isParent();
		}
	},
	{
		selector: ":loop",
		matches: function(e) {
			return e.isLoop();
		}
	},
	{
		selector: ":simple",
		matches: function(e) {
			return e.isSimple();
		}
	},
	{
		selector: ":active",
		matches: function(e) {
			return e.active();
		}
	},
	{
		selector: ":inactive",
		matches: function(e) {
			return !e.active();
		}
	},
	{
		selector: ":backgrounding",
		matches: function(e) {
			return e.backgrounding();
		}
	},
	{
		selector: ":nonbackgrounding",
		matches: function(e) {
			return !e.backgrounding();
		}
	}
].sort(function(e, t) {
	return _e(e.selector, t.selector);
}), kc = function() {
	for (var e = {}, t, n = 0; n < Oc.length; n++) t = Oc[n], e[t.selector] = t.matches;
	return e;
}(), Ac = function(e, t) {
	return kc[e](t);
}, jc = "(" + Oc.map(function(e) {
	return e.selector;
}).join("|") + ")", Mc = function(e) {
	return e.replace(RegExp("\\\\(" + Ec.metaChar + ")", "g"), function(e, t) {
		return t;
	});
}, Nc = function(e, t, n) {
	e[e.length - 1] = n;
}, Pc = [
	{
		name: "group",
		query: !0,
		regex: "(" + Ec.group + ")",
		populate: function(e, t, n) {
			var r = S(n, 1)[0];
			t.checks.push({
				type: $.GROUP,
				value: r === "*" ? r : r + "s"
			});
		}
	},
	{
		name: "state",
		query: !0,
		regex: jc,
		populate: function(e, t, n) {
			var r = S(n, 1)[0];
			t.checks.push({
				type: $.STATE,
				value: r
			});
		}
	},
	{
		name: "id",
		query: !0,
		regex: "\\#(" + Ec.id + ")",
		populate: function(e, t, n) {
			var r = S(n, 1)[0];
			t.checks.push({
				type: $.ID,
				value: Mc(r)
			});
		}
	},
	{
		name: "className",
		query: !0,
		regex: "\\.(" + Ec.className + ")",
		populate: function(e, t, n) {
			var r = S(n, 1)[0];
			t.checks.push({
				type: $.CLASS,
				value: Mc(r)
			});
		}
	},
	{
		name: "dataExists",
		query: !0,
		regex: "\\[\\s*(" + Ec.variable + ")\\s*\\]",
		populate: function(e, t, n) {
			var r = S(n, 1)[0];
			t.checks.push({
				type: $.DATA_EXIST,
				field: Mc(r)
			});
		}
	},
	{
		name: "dataCompare",
		query: !0,
		regex: "\\[\\s*(" + Ec.variable + ")\\s*(" + Ec.comparatorOp + ")\\s*(" + Ec.value + ")\\s*\\]",
		populate: function(e, t, n) {
			var r = S(n, 3), i = r[0], a = r[1], o = r[2];
			o = RegExp("^" + Ec.string + "$").exec(o) == null ? parseFloat(o) : o.substring(1, o.length - 1), t.checks.push({
				type: $.DATA_COMPARE,
				field: Mc(i),
				operator: a,
				value: o
			});
		}
	},
	{
		name: "dataBool",
		query: !0,
		regex: "\\[\\s*(" + Ec.boolOp + ")\\s*(" + Ec.variable + ")\\s*\\]",
		populate: function(e, t, n) {
			var r = S(n, 2), i = r[0], a = r[1];
			t.checks.push({
				type: $.DATA_BOOL,
				field: Mc(a),
				operator: i
			});
		}
	},
	{
		name: "metaCompare",
		query: !0,
		regex: "\\[\\[\\s*(" + Ec.meta + ")\\s*(" + Ec.comparatorOp + ")\\s*(" + Ec.number + ")\\s*\\]\\]",
		populate: function(e, t, n) {
			var r = S(n, 3), i = r[0], a = r[1], o = r[2];
			t.checks.push({
				type: $.META_COMPARE,
				field: Mc(i),
				operator: a,
				value: parseFloat(o)
			});
		}
	},
	{
		name: "nextQuery",
		separator: !0,
		regex: Ec.separator,
		populate: function(e, t) {
			var n = e.currentSubject, r = e.edgeCount, i = e.compoundCount, a = e[e.length - 1];
			return n != null && (a.subject = n, e.currentSubject = null), a.edgeCount = r, a.compoundCount = i, e.edgeCount = 0, e.compoundCount = 0, e[e.length++] = Dc();
		}
	},
	{
		name: "directedEdge",
		separator: !0,
		regex: Ec.directedEdge,
		populate: function(e, t) {
			if (e.currentSubject == null) {
				var n = Dc(), r = t, i = Dc();
				return n.checks.push({
					type: $.DIRECTED_EDGE,
					source: r,
					target: i
				}), Nc(e, t, n), e.edgeCount++, i;
			}
			var a = Dc(), o = t, s = Dc();
			return a.checks.push({
				type: $.NODE_SOURCE,
				source: o,
				target: s
			}), Nc(e, t, a), e.edgeCount++, s;
		}
	},
	{
		name: "undirectedEdge",
		separator: !0,
		regex: Ec.undirectedEdge,
		populate: function(e, t) {
			if (e.currentSubject == null) {
				var n = Dc(), r = t, i = Dc();
				return n.checks.push({
					type: $.UNDIRECTED_EDGE,
					nodes: [r, i]
				}), Nc(e, t, n), e.edgeCount++, i;
			}
			var a = Dc(), o = t, s = Dc();
			return a.checks.push({
				type: $.NODE_NEIGHBOR,
				node: o,
				neighbor: s
			}), Nc(e, t, a), s;
		}
	},
	{
		name: "child",
		separator: !0,
		regex: Ec.child,
		populate: function(e, t) {
			if (e.currentSubject == null) {
				var n = Dc(), r = Dc(), i = e[e.length - 1];
				return n.checks.push({
					type: $.CHILD,
					parent: i,
					child: r
				}), Nc(e, t, n), e.compoundCount++, r;
			}
			if (e.currentSubject === t) {
				var a = Dc(), o = e[e.length - 1], s = Dc(), c = Dc(), l = Dc(), u = Dc();
				return a.checks.push({
					type: $.COMPOUND_SPLIT,
					left: o,
					right: s,
					subject: c
				}), c.checks = t.checks, t.checks = [{ type: $.TRUE }], u.checks.push({ type: $.TRUE }), s.checks.push({
					type: $.PARENT,
					parent: u,
					child: l
				}), Nc(e, o, a), e.currentSubject = c, e.compoundCount++, l;
			}
			var d = Dc(), f = Dc(), p = [{
				type: $.PARENT,
				parent: d,
				child: f
			}];
			return d.checks = t.checks, t.checks = p, e.compoundCount++, f;
		}
	},
	{
		name: "descendant",
		separator: !0,
		regex: Ec.descendant,
		populate: function(e, t) {
			if (e.currentSubject == null) {
				var n = Dc(), r = Dc(), i = e[e.length - 1];
				return n.checks.push({
					type: $.DESCENDANT,
					ancestor: i,
					descendant: r
				}), Nc(e, t, n), e.compoundCount++, r;
			}
			if (e.currentSubject === t) {
				var a = Dc(), o = e[e.length - 1], s = Dc(), c = Dc(), l = Dc(), u = Dc();
				return a.checks.push({
					type: $.COMPOUND_SPLIT,
					left: o,
					right: s,
					subject: c
				}), c.checks = t.checks, t.checks = [{ type: $.TRUE }], u.checks.push({ type: $.TRUE }), s.checks.push({
					type: $.ANCESTOR,
					ancestor: u,
					descendant: l
				}), Nc(e, o, a), e.currentSubject = c, e.compoundCount++, l;
			}
			var d = Dc(), f = Dc(), p = [{
				type: $.ANCESTOR,
				ancestor: d,
				descendant: f
			}];
			return d.checks = t.checks, t.checks = p, e.compoundCount++, f;
		}
	},
	{
		name: "subject",
		modifier: !0,
		regex: Ec.subject,
		populate: function(e, t) {
			if (e.currentSubject != null && e.currentSubject !== t) return qt("Redefinition of subject in selector `" + e.toString() + "`"), !1;
			e.currentSubject = t;
			var n = e[e.length - 1].checks[0], r = n == null ? null : n.type;
			r === $.DIRECTED_EDGE ? n.type = $.NODE_TARGET : r === $.UNDIRECTED_EDGE && (n.type = $.NODE_NEIGHBOR, n.node = n.nodes[1], n.neighbor = n.nodes[0], n.nodes = null);
		}
	}
];
Pc.forEach(function(e) {
	return e.regexObj = RegExp("^" + e.regex);
});
var Fc = function(e) {
	for (var t, n, r, i = 0; i < Pc.length; i++) {
		var a = Pc[i], o = a.name, s = e.match(a.regexObj);
		if (s != null) {
			n = s, t = a, r = o;
			var c = s[0];
			e = e.substring(c.length);
			break;
		}
	}
	return {
		expr: t,
		match: n,
		name: r,
		remaining: e
	};
}, Ic = function(e) {
	var t = e.match(/^\s+/);
	if (t) {
		var n = t[0];
		e = e.substring(n.length);
	}
	return e;
}, Lc = {
	parse: function(e) {
		var t = this, n = t.inputText = e, r = t[0] = Dc();
		for (t.length = 1, n = Ic(n);;) {
			var i = Fc(n);
			if (i.expr == null) return qt("The selector `" + e + "`is invalid"), !1;
			var a = i.match.slice(1), o = i.expr.populate(t, r, a);
			if (o === !1) return !1;
			if (o != null && (r = o), n = i.remaining, n.match(/^\s*$/)) break;
		}
		var s = t[t.length - 1];
		t.currentSubject != null && (s.subject = t.currentSubject), s.edgeCount = t.edgeCount, s.compoundCount = t.compoundCount;
		for (var c = 0; c < t.length; c++) {
			var l = t[c];
			if (l.compoundCount > 0 && l.edgeCount > 0) return qt("The selector `" + e + "` is invalid because it uses both a compound selector and an edge selector"), !1;
			if (l.edgeCount > 1) return qt("The selector `" + e + "` is invalid because it uses multiple edge selectors"), !1;
			l.edgeCount === 1 && qt("The selector `" + e + "` is deprecated.  Edge selectors do not take effect on changes to source and target nodes after an edge is added, for performance reasons.  Use a class or data selector on edges instead, updating the class or data of an edge when your app detects a change in source or target nodes.");
		}
		return !0;
	},
	toString: function() {
		if (this.toStringCache != null) return this.toStringCache;
		for (var e = function(e) {
			return e ?? "";
		}, t = function(t) {
			return F(t) ? "\"" + t + "\"" : e(t);
		}, n = function(e) {
			return " " + e + " ";
		}, r = function(r, a) {
			var o = r.type, s = r.value;
			switch (o) {
				case $.GROUP:
					var c = e(s);
					return c.substring(0, c.length - 1);
				case $.DATA_COMPARE:
					var l = r.field, u = r.operator;
					return "[" + l + n(e(u)) + t(s) + "]";
				case $.DATA_BOOL:
					var d = r.operator, f = r.field;
					return "[" + e(d) + f + "]";
				case $.DATA_EXIST: return "[" + r.field + "]";
				case $.META_COMPARE:
					var p = r.operator;
					return "[[" + r.field + n(e(p)) + t(s) + "]]";
				case $.STATE: return s;
				case $.ID: return "#" + s;
				case $.CLASS: return "." + s;
				case $.PARENT:
				case $.CHILD: return i(r.parent, a) + n(">") + i(r.child, a);
				case $.ANCESTOR:
				case $.DESCENDANT: return i(r.ancestor, a) + " " + i(r.descendant, a);
				case $.COMPOUND_SPLIT:
					var m = i(r.left, a), h = i(r.subject, a), g = i(r.right, a);
					return m + (m.length > 0 ? " " : "") + h + g;
				case $.TRUE: return "";
			}
		}, i = function(e, t) {
			return e.checks.reduce(function(n, i, a) {
				return n + (t === e && a === 0 ? "$" : "") + r(i, t);
			}, "");
		}, a = "", o = 0; o < this.length; o++) {
			var s = this[o];
			a += i(s, s.subject), this.length > 1 && o < this.length - 1 && (a += ", ");
		}
		return this.toStringCache = a, a;
	}
}, Rc = function(e, t, n) {
	var r, i = F(e), a = B(e), o = F(n), s, c, l = !1, u = !1, d = !1;
	switch (t.indexOf("!") >= 0 && (t = t.replace("!", ""), u = !0), t.indexOf("@") >= 0 && (t = t.replace("@", ""), l = !0), (i || o || l) && (s = !i && !a ? "" : "" + e, c = "" + n), l && (e = s = s.toLowerCase(), n = c = c.toLowerCase()), t) {
		case "*=":
			r = s.indexOf(c) >= 0;
			break;
		case "$=":
			r = s.indexOf(c, s.length - c.length) >= 0;
			break;
		case "^=":
			r = s.indexOf(c) === 0;
			break;
		case "=":
			r = e === n;
			break;
		case ">":
			d = !0, r = e > n;
			break;
		case ">=":
			d = !0, r = e >= n;
			break;
		case "<":
			d = !0, r = e < n;
			break;
		case "<=":
			d = !0, r = e <= n;
			break;
		default: r = !1;
	}
	return u && (e != null || !d) && (r = !r), r;
}, zc = function(e, t) {
	switch (t) {
		case "?": return !!e;
		case "!": return !e;
		case "^": return e === void 0;
	}
}, Bc = function(e) {
	return e !== void 0;
}, Vc = function(e, t) {
	return e.data(t);
}, Hc = function(e, t) {
	return e[t]();
}, Uc = [], Wc = function(e, t) {
	return e.checks.every(function(e) {
		return Uc[e.type](e, t);
	});
};
Uc[$.GROUP] = function(e, t) {
	var n = e.value;
	return n === "*" || n === t.group();
}, Uc[$.STATE] = function(e, t) {
	var n = e.value;
	return Ac(n, t);
}, Uc[$.ID] = function(e, t) {
	var n = e.value;
	return t.id() === n;
}, Uc[$.CLASS] = function(e, t) {
	var n = e.value;
	return t.hasClass(n);
}, Uc[$.META_COMPARE] = function(e, t) {
	var n = e.field, r = e.operator, i = e.value;
	return Rc(Hc(t, n), r, i);
}, Uc[$.DATA_COMPARE] = function(e, t) {
	var n = e.field, r = e.operator, i = e.value;
	return Rc(Vc(t, n), r, i);
}, Uc[$.DATA_BOOL] = function(e, t) {
	var n = e.field, r = e.operator;
	return zc(Vc(t, n), r);
}, Uc[$.DATA_EXIST] = function(e, t) {
	var n = e.field;
	return e.operator, Bc(Vc(t, n));
}, Uc[$.UNDIRECTED_EDGE] = function(e, t) {
	var n = e.nodes[0], r = e.nodes[1], i = t.source(), a = t.target();
	return Wc(n, i) && Wc(r, a) || Wc(r, i) && Wc(n, a);
}, Uc[$.NODE_NEIGHBOR] = function(e, t) {
	return Wc(e.node, t) && t.neighborhood().some(function(t) {
		return t.isNode() && Wc(e.neighbor, t);
	});
}, Uc[$.DIRECTED_EDGE] = function(e, t) {
	return Wc(e.source, t.source()) && Wc(e.target, t.target());
}, Uc[$.NODE_SOURCE] = function(e, t) {
	return Wc(e.source, t) && t.outgoers().some(function(t) {
		return t.isNode() && Wc(e.target, t);
	});
}, Uc[$.NODE_TARGET] = function(e, t) {
	return Wc(e.target, t) && t.incomers().some(function(t) {
		return t.isNode() && Wc(e.source, t);
	});
}, Uc[$.CHILD] = function(e, t) {
	return Wc(e.child, t) && Wc(e.parent, t.parent());
}, Uc[$.PARENT] = function(e, t) {
	return Wc(e.parent, t) && t.children().some(function(t) {
		return Wc(e.child, t);
	});
}, Uc[$.DESCENDANT] = function(e, t) {
	return Wc(e.descendant, t) && t.ancestors().some(function(t) {
		return Wc(e.ancestor, t);
	});
}, Uc[$.ANCESTOR] = function(e, t) {
	return Wc(e.ancestor, t) && t.descendants().some(function(t) {
		return Wc(e.descendant, t);
	});
}, Uc[$.COMPOUND_SPLIT] = function(e, t) {
	return Wc(e.subject, t) && Wc(e.left, t) && Wc(e.right, t);
}, Uc[$.TRUE] = function() {
	return !0;
}, Uc[$.COLLECTION] = function(e, t) {
	return e.value.has(t);
}, Uc[$.FILTER] = function(e, t) {
	var n = e.value;
	return n(t);
};
var Gc = {
	matches: function(e) {
		for (var t = this, n = 0; n < t.length; n++) {
			var r = t[n];
			if (Wc(r, e)) return !0;
		}
		return !1;
	},
	filter: function(e) {
		var t = this;
		if (t.length === 1 && t[0].checks.length === 1 && t[0].checks[0].type === $.ID) return e.getElementById(t[0].checks[0].value).collection();
		var n = function(e) {
			for (var n = 0; n < t.length; n++) {
				var r = t[n];
				if (Wc(r, e)) return !0;
			}
			return !1;
		};
		return t.text() ?? (n = function() {
			return !0;
		}), e.filter(n);
	}
}, Kc = function(e) {
	this.inputText = e, this.currentSubject = null, this.compoundCount = 0, this.edgeCount = 0, this.length = 0, e == null || F(e) && e.match(/^\s*$/) || (U(e) ? this.addQuery({ checks: [{
		type: $.COLLECTION,
		value: e.collection()
	}] }) : I(e) ? this.addQuery({ checks: [{
		type: $.FILTER,
		value: e
	}] }) : F(e) ? this.parse(e) || (this.invalid = !0) : Gt("A selector must be created from a string; found "));
}, qc = Kc.prototype;
[Lc, Gc].forEach(function(e) {
	return Z(qc, e);
}), qc.text = function() {
	return this.inputText;
}, qc.size = function() {
	return this.length;
}, qc.eq = function(e) {
	return this[e];
}, qc.sameText = function(e) {
	return !this.invalid && !e.invalid && this.text() === e.text();
}, qc.addQuery = function(e) {
	this[this.length++] = e;
}, qc.selector = qc.toString;
var Jc = {
	allAre: function(e) {
		var t = new Kc(e);
		return this.every(function(e) {
			return t.matches(e);
		});
	},
	is: function(e) {
		var t = new Kc(e);
		return this.some(function(e) {
			return t.matches(e);
		});
	},
	some: function(e, t) {
		for (var n = 0; n < this.length; n++) if (t ? e.apply(t, [
			this[n],
			n,
			this
		]) : e(this[n], n, this)) return !0;
		return !1;
	},
	every: function(e, t) {
		for (var n = 0; n < this.length; n++) if (!(t ? e.apply(t, [
			this[n],
			n,
			this
		]) : e(this[n], n, this))) return !1;
		return !0;
	},
	same: function(e) {
		if (this === e) return !0;
		e = this.cy().collection(e);
		var t = this.length;
		return t === e.length ? t === 1 ? this[0] === e[0] : this.every(function(t) {
			return e.hasElementWithId(t.id());
		}) : !1;
	},
	anySame: function(e) {
		return e = this.cy().collection(e), this.some(function(t) {
			return e.hasElementWithId(t.id());
		});
	},
	allAreNeighbors: function(e) {
		e = this.cy().collection(e);
		var t = this.neighborhood();
		return e.every(function(e) {
			return t.hasElementWithId(e.id());
		});
	},
	contains: function(e) {
		e = this.cy().collection(e);
		var t = this;
		return e.every(function(e) {
			return t.hasElementWithId(e.id());
		});
	}
};
Jc.allAreNeighbours = Jc.allAreNeighbors, Jc.has = Jc.contains, Jc.equal = Jc.equals = Jc.same;
var Yc = function(e, t) {
	return function(n, r, i, a) {
		var o = n, s = this, c;
		if (o == null ? c = "" : U(o) && o.length === 1 && (c = o.id()), s.length === 1 && c) {
			var l = s[0]._private, u = l.traversalCache = l.traversalCache || {}, d = u[t] = u[t] || [], f = jt(c);
			return d[f] || (d[f] = e.call(s, n, r, i, a));
		}
		return e.call(s, n, r, i, a);
	};
}, Xc = {
	parent: function(e) {
		var t = [];
		if (this.length === 1) {
			var n = this[0]._private.parent;
			if (n) return n;
		}
		for (var r = 0; r < this.length; r++) {
			var i = this[r]._private.parent;
			i && t.push(i);
		}
		return this.spawn(t, !0).filter(e);
	},
	parents: function(e) {
		for (var t = [], n = this.parent(); n.nonempty();) {
			for (var r = 0; r < n.length; r++) {
				var i = n[r];
				t.push(i);
			}
			n = n.parent();
		}
		return this.spawn(t, !0).filter(e);
	},
	commonAncestors: function(e) {
		for (var t, n = 0; n < this.length; n++) {
			var r = this[n].parents();
			t ||= r, t = t.intersect(r);
		}
		return t.filter(e);
	},
	orphans: function(e) {
		return this.stdFilter(function(e) {
			return e.isOrphan();
		}).filter(e);
	},
	nonorphans: function(e) {
		return this.stdFilter(function(e) {
			return e.isChild();
		}).filter(e);
	},
	children: Yc(function(e) {
		for (var t = [], n = 0; n < this.length; n++) for (var r = this[n]._private.children, i = 0; i < r.length; i++) t.push(r[i]);
		return this.spawn(t, !0).filter(e);
	}, "children"),
	siblings: function(e) {
		return this.parent().children().not(this).filter(e);
	},
	isParent: function() {
		var e = this[0];
		if (e) return e.isNode() && e._private.children.length !== 0;
	},
	isChildless: function() {
		var e = this[0];
		if (e) return e.isNode() && e._private.children.length === 0;
	},
	isChild: function() {
		var e = this[0];
		if (e) return e.isNode() && e._private.parent != null;
	},
	isOrphan: function() {
		var e = this[0];
		if (e) return e.isNode() && e._private.parent == null;
	},
	descendants: function(e) {
		var t = [];
		function n(e) {
			for (var r = 0; r < e.length; r++) {
				var i = e[r];
				t.push(i), i.children().nonempty() && n(i.children());
			}
		}
		return n(this.children()), this.spawn(t, !0).filter(e);
	}
};
function Zc(e, t, n, r) {
	for (var i = [], a = new un(), o = e.cy().hasCompoundNodes(), s = 0; s < e.length; s++) {
		var c = e[s];
		n ? i.push(c) : o && r(i, a, c);
	}
	for (; i.length > 0;) {
		var l = i.shift();
		t(l), a.add(l.id()), o && r(i, a, l);
	}
	return e;
}
function Qc(e, t, n) {
	if (n.isParent()) for (var r = n._private.children, i = 0; i < r.length; i++) {
		var a = r[i];
		t.has(a.id()) || e.push(a);
	}
}
Xc.forEachDown = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
	return Zc(this, e, t, Qc);
};
function $c(e, t, n) {
	if (n.isChild()) {
		var r = n._private.parent;
		t.has(r.id()) || e.push(r);
	}
}
Xc.forEachUp = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
	return Zc(this, e, t, $c);
};
function el(e, t, n) {
	$c(e, t, n), Qc(e, t, n);
}
Xc.forEachUpAndDown = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
	return Zc(this, e, t, el);
}, Xc.ancestors = Xc.parents;
var tl = nl = {
	data: Cc.data({
		field: "data",
		bindingEvent: "data",
		allowBinding: !0,
		allowSetting: !0,
		settingEvent: "data",
		settingTriggersEvent: !0,
		triggerFnName: "trigger",
		allowGetting: !0,
		immutableKeys: {
			id: !0,
			source: !0,
			target: !0,
			parent: !0
		},
		updateStyle: !0
	}),
	removeData: Cc.removeData({
		field: "data",
		event: "data",
		triggerFnName: "trigger",
		triggerEvent: !0,
		immutableKeys: {
			id: !0,
			source: !0,
			target: !0,
			parent: !0
		},
		updateStyle: !0
	}),
	scratch: Cc.data({
		field: "scratch",
		bindingEvent: "scratch",
		allowBinding: !0,
		allowSetting: !0,
		settingEvent: "scratch",
		settingTriggersEvent: !0,
		triggerFnName: "trigger",
		allowGetting: !0,
		updateStyle: !0
	}),
	removeScratch: Cc.removeData({
		field: "scratch",
		event: "scratch",
		triggerFnName: "trigger",
		triggerEvent: !0,
		updateStyle: !0
	}),
	rscratch: Cc.data({
		field: "rscratch",
		allowBinding: !1,
		allowSetting: !0,
		settingTriggersEvent: !1,
		allowGetting: !0
	}),
	removeRscratch: Cc.removeData({
		field: "rscratch",
		triggerEvent: !1
	}),
	id: function() {
		var e = this[0];
		if (e) return e._private.data.id;
	}
}, nl;
tl.attr = tl.data, tl.removeAttr = tl.removeData;
var rl = nl, il = {};
function al(e) {
	return function(t) {
		var n = this;
		if (t === void 0 && (t = !0), n.length !== 0 && n.isNode() && !n.removed()) {
			for (var r = 0, i = n[0], a = i._private.edges, o = 0; o < a.length; o++) {
				var s = a[o];
				(t || !s.isLoop()) && (r += e(i, s));
			}
			return r;
		}
	};
}
Z(il, {
	degree: al(function(e, t) {
		return t.source().same(t.target()) ? 2 : 1;
	}),
	indegree: al(function(e, t) {
		return +!!t.target().same(e);
	}),
	outdegree: al(function(e, t) {
		return +!!t.source().same(e);
	})
});
function ol(e, t) {
	return function(n) {
		for (var r, i = this.nodes(), a = 0; a < i.length; a++) {
			var o = i[a][e](n);
			o !== void 0 && (r === void 0 || t(o, r)) && (r = o);
		}
		return r;
	};
}
Z(il, {
	minDegree: ol("degree", function(e, t) {
		return e < t;
	}),
	maxDegree: ol("degree", function(e, t) {
		return e > t;
	}),
	minIndegree: ol("indegree", function(e, t) {
		return e < t;
	}),
	maxIndegree: ol("indegree", function(e, t) {
		return e > t;
	}),
	minOutdegree: ol("outdegree", function(e, t) {
		return e < t;
	}),
	maxOutdegree: ol("outdegree", function(e, t) {
		return e > t;
	})
}), Z(il, { totalDegree: function(e) {
	for (var t = 0, n = this.nodes(), r = 0; r < n.length; r++) t += n[r].degree(e);
	return t;
} });
var sl, cl, ll = function(e, t, n) {
	for (var r = 0; r < e.length; r++) {
		var i = e[r];
		if (!i.locked()) {
			var a = i._private.position, o = {
				x: t.x == null ? 0 : t.x - a.x,
				y: t.y == null ? 0 : t.y - a.y
			};
			i.isParent() && (o.x !== 0 || o.y !== 0) && i.children().shift(o, n), i.dirtyBoundingBoxCache();
		}
	}
}, ul = {
	field: "position",
	bindingEvent: "position",
	allowBinding: !0,
	allowSetting: !0,
	settingEvent: "position",
	settingTriggersEvent: !0,
	triggerFnName: "emitAndNotify",
	allowGetting: !0,
	validKeys: ["x", "y"],
	beforeGet: function(e) {
		e.updateCompoundBounds();
	},
	beforeSet: function(e, t) {
		ll(e, t, !1);
	},
	onSet: function(e) {
		e.dirtyCompoundBoundsCache();
	},
	canSet: function(e) {
		return !e.locked();
	}
};
sl = cl = {
	position: Cc.data(ul),
	silentPosition: Cc.data(Z({}, ul, {
		allowBinding: !1,
		allowSetting: !0,
		settingTriggersEvent: !1,
		allowGetting: !1,
		beforeSet: function(e, t) {
			ll(e, t, !0);
		},
		onSet: function(e) {
			e.dirtyCompoundBoundsCache();
		}
	})),
	positions: function(e, t) {
		if (R(e)) t ? this.silentPosition(e) : this.position(e);
		else if (I(e)) {
			var n = e, r = this.cy();
			r.startBatch();
			for (var i = 0; i < this.length; i++) {
				var a = this[i], o = void 0;
				(o = n(a, i)) && (t ? a.silentPosition(o) : a.position(o));
			}
			r.endBatch();
		}
		return this;
	},
	silentPositions: function(e) {
		return this.positions(e, !0);
	},
	shift: function(e, t, n) {
		var r;
		if (R(e) ? (r = {
			x: B(e.x) ? e.x : 0,
			y: B(e.y) ? e.y : 0
		}, n = t) : F(e) && B(t) && (r = {
			x: 0,
			y: 0
		}, r[e] = t), r != null) {
			var i = this.cy();
			i.startBatch();
			for (var a = 0; a < this.length; a++) {
				var o = this[a];
				if (!(i.hasCompoundNodes() && o.isChild() && o.ancestors().anySame(this))) {
					var s = o.position(), c = {
						x: s.x + r.x,
						y: s.y + r.y
					};
					n ? o.silentPosition(c) : o.position(c);
				}
			}
			i.endBatch();
		}
		return this;
	},
	silentShift: function(e, t) {
		return R(e) ? this.shift(e, !0) : F(e) && B(t) && this.shift(e, t, !0), this;
	},
	renderedPosition: function(e, t) {
		var n = this[0], r = this.cy(), i = r.zoom(), a = r.pan(), o = R(e) ? e : void 0, s = o !== void 0 || t !== void 0 && F(e);
		if (n && n.isNode()) {
			if (s) for (var c = 0; c < this.length; c++) {
				var l = this[c];
				t === void 0 ? o !== void 0 && l.position(Ln(o, i, a)) : l.position(e, (t - a[e]) / i);
			}
			else return o = In(n.position(), i, a), e === void 0 ? o : o[e];
		} else if (!s) return;
		return this;
	},
	relativePosition: function(e, t) {
		var n = this[0], r = this.cy(), i = R(e) ? e : void 0, a = i !== void 0 || t !== void 0 && F(e), o = r.hasCompoundNodes();
		if (n && n.isNode()) {
			if (a) for (var s = 0; s < this.length; s++) {
				var c = this[s], l = o ? c.parent() : null, u = l && l.length > 0, d = u;
				u && (l = l[0]);
				var f = d ? l.position() : {
					x: 0,
					y: 0
				};
				t === void 0 ? i !== void 0 && c.position({
					x: i.x + f.x,
					y: i.y + f.y
				}) : c.position(e, t + f[e]);
			}
			else {
				var p = n.position(), m = o ? n.parent() : null, h = m && m.length > 0, g = h;
				h && (m = m[0]);
				var _ = g ? m.position() : {
					x: 0,
					y: 0
				};
				return i = {
					x: p.x - _.x,
					y: p.y - _.y
				}, e === void 0 ? i : i[e];
			}
		} else if (!a) return;
		return this;
	}
}, sl.modelPosition = sl.point = sl.position, sl.modelPositions = sl.points = sl.positions, sl.renderedPoint = sl.renderedPosition, sl.relativePoint = sl.relativePosition;
var dl = cl, fl = function(e) {
	switch (e) {
		case "left":
		case "right-inside": return "left";
		case "right":
		case "left-inside": return "right";
		default: return "center";
	}
}, pl = function(e) {
	switch (e) {
		case "top":
		case "bottom-inside": return "top";
		case "bottom":
		case "top-inside": return "bottom";
		default: return "center";
	}
}, ml = function(e) {
	switch (e) {
		case "left": return "right";
		case "right": return "left";
		case "left-inside": return "left";
		case "right-inside": return "right";
		default: return "center";
	}
}, hl = gl = {}, gl;
gl.renderedBoundingBox = function(e) {
	var t = this.boundingBox(e), n = this.cy(), r = n.zoom(), i = n.pan(), a = t.x1 * r + i.x, o = t.x2 * r + i.x, s = t.y1 * r + i.y, c = t.y2 * r + i.y;
	return {
		x1: a,
		x2: o,
		y1: s,
		y2: c,
		w: o - a,
		h: c - s
	};
}, gl.dirtyCompoundBoundsCache = function() {
	var e = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], t = this.cy();
	return !t.styleEnabled() || !t.hasCompoundNodes() || this.forEachUp(function(t) {
		if (t.isParent()) {
			var n = t._private;
			n.compoundBoundsClean = !1, n.bbCache = null, e || t.emitAndNotify("bounds");
		}
	}), this;
}, gl.updateCompoundBounds = function() {
	var e = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], t = this.cy();
	if (!t.styleEnabled() || !t.hasCompoundNodes() || !e && t.batching()) return this;
	function n(e) {
		if (!e.isParent()) return;
		var t = e._private, n = e.children(), r = e.pstyle("compound-sizing-wrt-labels").value === "include", i = {
			width: {
				val: e.pstyle("min-width").pfValue,
				left: e.pstyle("min-width-bias-left"),
				right: e.pstyle("min-width-bias-right")
			},
			height: {
				val: e.pstyle("min-height").pfValue,
				top: e.pstyle("min-height-bias-top"),
				bottom: e.pstyle("min-height-bias-bottom")
			}
		}, a = n.boundingBox({
			includeLabels: r,
			includeOverlays: !1,
			useCache: !1
		}), o = t.position;
		(a.w === 0 || a.h === 0) && (a = {
			w: e.pstyle("width").pfValue,
			h: e.pstyle("height").pfValue
		}, a.x1 = o.x - a.w / 2, a.x2 = o.x + a.w / 2, a.y1 = o.y - a.h / 2, a.y2 = o.y + a.h / 2);
		function s(e, t, n) {
			var r = 0, i = 0, a = t + n;
			return e > 0 && a > 0 && (r = t / a * e, i = n / a * e), {
				biasDiff: r,
				biasComplementDiff: i
			};
		}
		function c(e, t, n, r) {
			if (n.units === "%") switch (r) {
				case "width": return e > 0 ? n.pfValue * e : 0;
				case "height": return t > 0 ? n.pfValue * t : 0;
				case "average": return e > 0 && t > 0 ? n.pfValue * (e + t) / 2 : 0;
				case "min": return e > 0 && t > 0 ? e > t ? n.pfValue * t : n.pfValue * e : 0;
				case "max": return e > 0 && t > 0 ? e > t ? n.pfValue * e : n.pfValue * t : 0;
				default: return 0;
			}
			else if (n.units === "px") return n.pfValue;
			else return 0;
		}
		var l = i.width.left.value;
		i.width.left.units === "px" && i.width.val > 0 && (l = l * 100 / i.width.val);
		var u = i.width.right.value;
		i.width.right.units === "px" && i.width.val > 0 && (u = u * 100 / i.width.val);
		var d = i.height.top.value;
		i.height.top.units === "px" && i.height.val > 0 && (d = d * 100 / i.height.val);
		var f = i.height.bottom.value;
		i.height.bottom.units === "px" && i.height.val > 0 && (f = f * 100 / i.height.val);
		var p = s(i.width.val - a.w, l, u), m = p.biasDiff, h = p.biasComplementDiff, g = s(i.height.val - a.h, d, f), _ = g.biasDiff, v = g.biasComplementDiff;
		t.autoPadding = c(a.w, a.h, e.pstyle("padding"), e.pstyle("padding-relative-to").value), t.autoWidth = Math.max(a.w, i.width.val), o.x = (-m + a.x1 + a.x2 + h) / 2, t.autoHeight = Math.max(a.h, i.height.val), o.y = (-_ + a.y1 + a.y2 + v) / 2;
	}
	for (var r = 0; r < this.length; r++) {
		var i = this[r], a = i._private;
		(!a.compoundBoundsClean || e) && (n(i), t.batching() || (a.compoundBoundsClean = !0));
	}
	return this;
};
var _l = function(e) {
	return e === Infinity || e === -Infinity ? 0 : e;
}, vl = function(e, t, n, r, i) {
	r - t !== 0 && i - n !== 0 && t != null && n != null && r != null && i != null && (e.x1 = t < e.x1 ? t : e.x1, e.x2 = r > e.x2 ? r : e.x2, e.y1 = n < e.y1 ? n : e.y1, e.y2 = i > e.y2 ? i : e.y2, e.w = e.x2 - e.x1, e.h = e.y2 - e.y1);
}, yl = function(e, t) {
	return t == null ? e : vl(e, t.x1, t.y1, t.x2, t.y2);
}, bl = function(e, t, n) {
	return an(e, t, n);
}, xl = function(e, t, n) {
	if (!t.cy().headless()) {
		var r = t._private, i = r.rstyle, a = i.arrowWidth / 2, o = t.pstyle(n + "-arrow-shape").value, s, c;
		if (o !== "none") {
			n === "source" ? (s = i.srcX, c = i.srcY) : n === "target" ? (s = i.tgtX, c = i.tgtY) : (s = i.midX, c = i.midY);
			var l = r.arrowBounds = r.arrowBounds || {}, u = l[n] = l[n] || {};
			u.x1 = s - a, u.y1 = c - a, u.x2 = s + a, u.y2 = c + a, u.w = u.x2 - u.x1, u.h = u.y2 - u.y1, sr(u, 1), vl(e, u.x1, u.y1, u.x2, u.y2);
		}
	}
}, Sl = function(e, t, n) {
	if (!t.cy().headless()) {
		var r = n ? n + "-" : "", i = t._private, a = i.rstyle;
		if (t.pstyle(r + "label").strValue) {
			var o = t.pstyle("text-halign"), s = t.pstyle("text-valign"), c = bl(a, "labelWidth", n), l = bl(a, "labelHeight", n), u = bl(a, "labelX", n), d = bl(a, "labelY", n), f = t.pstyle(r + "text-margin-x").pfValue, p = t.pstyle(r + "text-margin-y").pfValue, m = t.isEdge(), h = t.pstyle(r + "text-rotation"), g = t.pstyle("text-outline-width").pfValue, _ = t.pstyle("text-border-width").pfValue / 2, v = t.pstyle("text-background-padding").pfValue, y = 2, b = l, x = c, S = x / 2, C = b / 2, w, T, E, D;
			if (m) w = u - S, T = u + S, E = d - C, D = d + C;
			else {
				switch (fl(o.value)) {
					case "left":
						w = u - x, T = u;
						break;
					case "center":
						w = u - S, T = u + S;
						break;
					case "right": w = u, T = u + x;
				}
				switch (pl(s.value)) {
					case "top":
						E = d - b, D = d;
						break;
					case "center":
						E = d - C, D = d + C;
						break;
					case "bottom": E = d, D = d + b;
				}
			}
			var O = f - Math.max(g, _) - v - y, k = f + Math.max(g, _) + v + y, A = p - Math.max(g, _) - v - y, j = p + Math.max(g, _) + v + y;
			w += O, T += k, E += A, D += j;
			var M = n || "main", N = i.labelBounds, P = N[M] = N[M] || {};
			P.x1 = w, P.y1 = E, P.x2 = T, P.y2 = D, P.w = T - w, P.h = D - E, P.leftPad = O, P.rightPad = k, P.topPad = A, P.botPad = j;
			var F = m && h.strValue === "autorotate", I = h.pfValue != null && h.pfValue !== 0;
			if (F || I) {
				var L = F ? bl(i.rstyle, "labelAngle", n) : h.pfValue, R = Math.cos(L), z = Math.sin(L), B = (w + T) / 2, V = (E + D) / 2;
				if (!m) {
					switch (fl(o.value)) {
						case "left":
							B = T;
							break;
						case "right": B = w;
					}
					switch (pl(s.value)) {
						case "top":
							V = D;
							break;
						case "bottom": V = E;
					}
				}
				var H = function(e, t) {
					return e -= B, t -= V, {
						x: e * R - t * z + B,
						y: e * z + t * R + V
					};
				}, U = H(w, E), W = H(w, D), G = H(T, E), K = H(T, D);
				w = Math.min(U.x, W.x, G.x, K.x), T = Math.max(U.x, W.x, G.x, K.x), E = Math.min(U.y, W.y, G.y, K.y), D = Math.max(U.y, W.y, G.y, K.y);
			}
			var q = M + "Rot", ee = N[q] = N[q] || {};
			ee.x1 = w, ee.y1 = E, ee.x2 = T, ee.y2 = D, ee.w = T - w, ee.h = D - E, vl(e, w, E, T, D), vl(i.labelBounds.all, w, E, T, D);
		}
		return e;
	}
}, Cl = function(e, t) {
	if (!t.cy().headless()) {
		var n = t.pstyle("outline-opacity").value, r = t.pstyle("outline-width").value + t.pstyle("outline-offset").value;
		wl(e, t, n, r, "outside", r / 2);
	}
}, wl = function(e, t, n, r, i, a) {
	if (!(n === 0 || r <= 0 || i === "inside")) {
		var o = t.cy().renderer(), s = o.nodeShapes[o.getNodeShape(t)];
		if (s) {
			var c = t.position(), l = c.x, u = c.y, d = t.width(), f = t.height();
			s.hasMiterBounds ? (i === "center" && (r /= 2), yl(e, s.miterBounds(l, u, d, f, r))) : a != null && a > 0 && cr(e, [
				a,
				a,
				a,
				a
			]);
		}
	}
}, Tl = function(e, t) {
	if (!t.cy().headless()) {
		var n = t.pstyle("border-opacity").value, r = t.pstyle("border-width").pfValue, i = t.pstyle("border-position").value;
		wl(e, t, n, r, i);
	}
}, El = function(e, t) {
	var n = e._private.cy, r = n.styleEnabled(), i = n.headless(), a = nr(), o = e._private, s = e.isNode(), c = e.isEdge(), l, u, d, f, p, m, h = o.rstyle, g = s && r ? e.pstyle("bounds-expansion").pfValue : [0], _ = function(e) {
		return e.pstyle("display").value !== "none";
	}, v = !r || _(e) && (!c || _(e.source()) && _(e.target()));
	if (v) {
		var y = 0, b = 0;
		r && t.includeOverlays && (y = e.pstyle("overlay-opacity").value, y !== 0 && (b = e.pstyle("overlay-padding").value));
		var x = 0, S = 0;
		r && t.includeUnderlays && (x = e.pstyle("underlay-opacity").value, x !== 0 && (S = e.pstyle("underlay-padding").value));
		var C = Math.max(b, S), w = 0, T = 0;
		if (r && (w = e.pstyle("width").pfValue, T = w / 2), s && t.includeNodes) {
			var E = e.position();
			p = E.x, m = E.y;
			var D = e.outerWidth() / 2, O = e.outerHeight() / 2;
			l = p - D, u = p + D, d = m - O, f = m + O, vl(a, l, d, u, f), r && Cl(a, e), r && t.includeOutlines && !i && Cl(a, e), r && Tl(a, e);
		} else if (c && t.includeEdges) {
			if (r && !i) {
				var k = e.pstyle("curve-style").strValue;
				if (l = Math.min(h.srcX, h.midX, h.tgtX), u = Math.max(h.srcX, h.midX, h.tgtX), d = Math.min(h.srcY, h.midY, h.tgtY), f = Math.max(h.srcY, h.midY, h.tgtY), l -= T, u += T, d -= T, f += T, vl(a, l, d, u, f), k === "haystack") {
					var A = h.haystackPts;
					if (A && A.length === 2) {
						if (l = A[0].x, d = A[0].y, u = A[1].x, f = A[1].y, l > u) {
							var j = l;
							l = u, u = j;
						}
						if (d > f) {
							var M = d;
							d = f, f = M;
						}
						vl(a, l - T, d - T, u + T, f + T);
					}
				} else if (k === "bezier" || k === "unbundled-bezier" || le(k, "segments") || le(k, "taxi")) {
					var N;
					switch (k) {
						case "bezier":
						case "unbundled-bezier":
							N = h.bezierPts;
							break;
						case "segments":
						case "taxi":
						case "round-segments":
						case "round-taxi": N = h.linePts;
					}
					if (N != null) for (var P = 0; P < N.length; P++) {
						var F = N[P];
						l = F.x - T, u = F.x + T, d = F.y - T, f = F.y + T, vl(a, l, d, u, f);
					}
				}
			} else {
				var I = e.source().position(), L = e.target().position();
				if (l = I.x, u = L.x, d = I.y, f = L.y, l > u) {
					var R = l;
					l = u, u = R;
				}
				if (d > f) {
					var z = d;
					d = f, f = z;
				}
				l -= T, u += T, d -= T, f += T, vl(a, l, d, u, f);
			}
		}
		if (r && t.includeEdges && c && (xl(a, e, "mid-source"), xl(a, e, "mid-target"), xl(a, e, "source"), xl(a, e, "target")), r && e.pstyle("ghost").value === "yes") {
			var B = e.pstyle("ghost-offset-x").pfValue, V = e.pstyle("ghost-offset-y").pfValue;
			vl(a, a.x1 + B, a.y1 + V, a.x2 + B, a.y2 + V);
		}
		var H = o.bodyBounds = o.bodyBounds || {};
		lr(H, a), cr(H, g), sr(H, 1), r && (l = a.x1, u = a.x2, d = a.y1, f = a.y2, vl(a, l - C, d - C, u + C, f + C));
		var U = o.overlayBounds = o.overlayBounds || {};
		lr(U, a), cr(U, g), sr(U, 1);
		var W = o.labelBounds = o.labelBounds || {};
		W.all == null ? W.all = nr() : ir(W.all), r && t.includeLabels && (t.includeMainLabels && Sl(a, e, null), c && (t.includeSourceLabels && Sl(a, e, "source"), t.includeTargetLabels && Sl(a, e, "target")));
	}
	return a.x1 = _l(a.x1), a.y1 = _l(a.y1), a.x2 = _l(a.x2), a.y2 = _l(a.y2), a.w = _l(a.x2 - a.x1), a.h = _l(a.y2 - a.y1), a.w > 0 && a.h > 0 && v && (cr(a, g), sr(a, 1)), a;
}, Dl = function(e) {
	var t = 0, n = function(e) {
		return +!!e << t++;
	}, r = 0;
	return r += n(e.incudeNodes), r += n(e.includeEdges), r += n(e.includeLabels), r += n(e.includeMainLabels), r += n(e.includeSourceLabels), r += n(e.includeTargetLabels), r += n(e.includeOverlays), r += n(e.includeOutlines), r;
}, Ol = function(e) {
	var t = function(e) {
		return Math.round(e);
	};
	if (e.isEdge()) {
		var n = e.source().position(), r = e.target().position();
		return At([
			t(n.x),
			t(n.y),
			t(r.x),
			t(r.y)
		]);
	}
	var i = e.position();
	return At([t(i.x), t(i.y)]);
}, kl = function(e, t) {
	var n = e._private, r, i = e.isEdge(), a = (t == null ? jl : Dl(t)) === jl;
	if (n.bbCache == null ? (r = El(e, Al), n.bbCache = r, n.bbCachePosKey = Ol(e)) : r = n.bbCache, !a) {
		var o = e.isNode();
		r = nr(), (t.includeNodes && o || t.includeEdges && !o) && (t.includeOverlays ? yl(r, n.overlayBounds) : yl(r, n.bodyBounds)), t.includeLabels && (t.includeMainLabels && (!i || t.includeSourceLabels && t.includeTargetLabels) ? yl(r, n.labelBounds.all) : (t.includeMainLabels && yl(r, n.labelBounds.mainRot), t.includeSourceLabels && yl(r, n.labelBounds.sourceRot), t.includeTargetLabels && yl(r, n.labelBounds.targetRot))), r.w = r.x2 - r.x1, r.h = r.y2 - r.y1;
	}
	return r;
}, Al = {
	includeNodes: !0,
	includeEdges: !0,
	includeLabels: !0,
	includeMainLabels: !0,
	includeSourceLabels: !0,
	includeTargetLabels: !0,
	includeOverlays: !0,
	includeUnderlays: !0,
	includeOutlines: !0,
	useCache: !0
}, jl = Dl(Al), Ml = en(Al);
gl.boundingBox = function(e) {
	var t, n = e === void 0 || e.useCache === void 0 || e.useCache === !0, r = ie(function(e) {
		var t = e._private;
		return t.bbCache == null || t.styleDirty || t.bbCachePosKey !== Ol(e);
	}, function(e) {
		return e.id();
	});
	if (n && this.length === 1 && !r(this[0])) e = e === void 0 ? Al : Ml(e), t = kl(this[0], e);
	else {
		t = nr(), e ||= Al;
		var i = Ml(e), a = this, o = a.cy().styleEnabled();
		this.edges().forEach(r), this.nodes().forEach(r), o && this.recalculateRenderedStyle(n), this.updateCompoundBounds(!n);
		for (var s = 0; s < a.length; s++) {
			var c = a[s];
			r(c) && c.dirtyBoundingBoxCache(), yl(t, kl(c, i));
		}
	}
	return t.x1 = _l(t.x1), t.y1 = _l(t.y1), t.x2 = _l(t.x2), t.y2 = _l(t.y2), t.w = _l(t.x2 - t.x1), t.h = _l(t.y2 - t.y1), t;
}, gl.dirtyBoundingBoxCache = function() {
	for (var e = 0; e < this.length; e++) {
		var t = this[e]._private;
		t.bbCache = null, t.bbCachePosKey = null, t.bodyBounds = null, t.overlayBounds = null, t.labelBounds.all = null, t.labelBounds.source = null, t.labelBounds.target = null, t.labelBounds.main = null, t.labelBounds.sourceRot = null, t.labelBounds.targetRot = null, t.labelBounds.mainRot = null, t.arrowBounds.source = null, t.arrowBounds.target = null, t.arrowBounds["mid-source"] = null, t.arrowBounds["mid-target"] = null;
	}
	return this.emitAndNotify("bounds"), this;
}, gl.boundingBoxAt = function(e) {
	var t = this.nodes(), n = this.cy(), r = n.hasCompoundNodes(), i = n.collection();
	if (r && (i = t.filter(function(e) {
		return e.isParent();
	}), t = t.not(i)), R(e)) {
		var a = e;
		e = function() {
			return a;
		};
	}
	var o = function(t, n) {
		return t._private.bbAtOldPos = e(t, n);
	}, s = function(e) {
		return e._private.bbAtOldPos;
	};
	n.startBatch(), t.forEach(o).silentPositions(e), r && (i.dirtyCompoundBoundsCache(), i.dirtyBoundingBoxCache(), i.updateCompoundBounds(!0));
	var c = rr(this.boundingBox({ useCache: !1 }));
	return t.silentPositions(s), r && (i.dirtyCompoundBoundsCache(), i.dirtyBoundingBoxCache(), i.updateCompoundBounds(!0)), n.endBatch(), c;
}, hl.boundingbox = hl.bb = hl.boundingBox, hl.renderedBoundingbox = hl.renderedBoundingBox;
var Nl = gl, Pl = Fl = {}, Fl, Il = function(e) {
	e.uppercaseName = ce(e.name), e.autoName = "auto" + e.uppercaseName, e.labelName = "label" + e.uppercaseName, e.outerName = "outer" + e.uppercaseName, e.uppercaseOuterName = ce(e.outerName), Pl[e.name] = function() {
		var t = this[0], n = t._private, r = n.cy._private.styleEnabled;
		if (t) {
			if (r) {
				if (t.isParent()) return t.updateCompoundBounds(), n[e.autoName] || 0;
				var i = t.pstyle(e.name);
				switch (i.strValue) {
					case "label": return t.recalculateRenderedStyle(), n.rstyle[e.labelName] || 0;
					default: return i.pfValue;
				}
			} else return 1;
		}
	}, Pl["outer" + e.uppercaseName] = function() {
		var t = this[0], n = t._private.cy._private.styleEnabled;
		if (t) {
			if (n) {
				var r = t[e.name](), i = t.pstyle("border-position").value, a = i === "center" ? t.pstyle("border-width").pfValue : i === "outside" ? 2 * t.pstyle("border-width").pfValue : 0, o = 2 * t.padding();
				return r + a + o;
			}
			return 1;
		}
	}, Pl["rendered" + e.uppercaseName] = function() {
		var t = this[0];
		if (t) return t[e.name]() * this.cy().zoom();
	}, Pl["rendered" + e.uppercaseOuterName] = function() {
		var t = this[0];
		if (t) return t[e.outerName]() * this.cy().zoom();
	};
};
Il({ name: "width" }), Il({ name: "height" }), Fl.padding = function() {
	var e = this[0], t = e._private;
	return e.isParent() ? (e.updateCompoundBounds(), t.autoPadding === void 0 ? e.pstyle("padding").pfValue : t.autoPadding) : e.pstyle("padding").pfValue;
}, Fl.paddedHeight = function() {
	var e = this[0];
	return e.height() + 2 * e.padding();
}, Fl.paddedWidth = function() {
	var e = this[0];
	return e.width() + 2 * e.padding();
};
var Ll = Fl, Rl = function(e, t) {
	if (e.isEdge() && e.takesUpSpace()) return t(e);
}, zl = function(e, t) {
	if (e.isEdge() && e.takesUpSpace()) {
		var n = e.cy();
		return In(t(e), n.zoom(), n.pan());
	}
}, Bl = function(e, t) {
	if (e.isEdge() && e.takesUpSpace()) {
		var n = e.cy(), r = n.pan(), i = n.zoom();
		return t(e).map(function(e) {
			return In(e, i, r);
		});
	}
}, Vl = {
	controlPoints: {
		get: function(e) {
			return e.renderer().getControlPoints(e);
		},
		mult: !0
	},
	segmentPoints: {
		get: function(e) {
			return e.renderer().getSegmentPoints(e);
		},
		mult: !0
	},
	sourceEndpoint: { get: function(e) {
		return e.renderer().getSourceEndpoint(e);
	} },
	targetEndpoint: { get: function(e) {
		return e.renderer().getTargetEndpoint(e);
	} },
	midpoint: { get: function(e) {
		return e.renderer().getEdgeMidpoint(e);
	} }
}, Hl = function(e) {
	return "rendered" + e[0].toUpperCase() + e.substr(1);
}, Ul = Z({}, dl, Nl, Ll, Object.keys(Vl).reduce(function(e, t) {
	var n = Vl[t], r = Hl(t);
	return e[t] = function() {
		return Rl(this, n.get);
	}, e[r] = n.mult ? function() {
		return Bl(this, n.get);
	} : function() {
		return zl(this, n.get);
	}, e;
}, {})), Wl = function(e, t) {
	this.recycle(e, t);
};
function Gl() {
	return !1;
}
function Kl() {
	return !0;
}
Wl.prototype = {
	instanceString: function() {
		return "event";
	},
	recycle: function(e, t) {
		if (this.isImmediatePropagationStopped = this.isPropagationStopped = this.isDefaultPrevented = Gl, e != null && e.preventDefault ? (this.type = e.type, this.isDefaultPrevented = e.defaultPrevented ? Kl : Gl) : e != null && e.type ? t = e : this.type = e, t != null && (this.originalEvent = t.originalEvent, this.type = t.type == null ? this.type : t.type, this.cy = t.cy, this.target = t.target, this.position = t.position, this.renderedPosition = t.renderedPosition, this.namespace = t.namespace, this.layout = t.layout), this.cy != null && this.position != null && this.renderedPosition == null) {
			var n = this.position, r = this.cy.zoom(), i = this.cy.pan();
			this.renderedPosition = {
				x: n.x * r + i.x,
				y: n.y * r + i.y
			};
		}
		this.timeStamp = e && e.timeStamp || Date.now();
	},
	preventDefault: function() {
		this.isDefaultPrevented = Kl;
		var e = this.originalEvent;
		e && e.preventDefault && e.preventDefault();
	},
	stopPropagation: function() {
		this.isPropagationStopped = Kl;
		var e = this.originalEvent;
		e && e.stopPropagation && e.stopPropagation();
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = Kl, this.stopPropagation();
	},
	isDefaultPrevented: Gl,
	isPropagationStopped: Gl,
	isImmediatePropagationStopped: Gl
};
var ql = /^([^.]+)(\.(?:[^.]+))?$/, Jl = ".*", Yl = {
	qualifierCompare: function(e, t) {
		return e === t;
	},
	eventMatches: function() {
		return !0;
	},
	addEventFields: function() {},
	callbackContext: function(e) {
		return e;
	},
	beforeEmit: function() {},
	afterEmit: function() {},
	bubble: function() {
		return !1;
	},
	parent: function() {
		return null;
	},
	context: null
}, Xl = Object.keys(Yl), Zl = {};
function Ql() {
	for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Zl, t = arguments.length > 1 ? arguments[1] : void 0, n = 0; n < Xl.length; n++) {
		var r = Xl[n];
		this[r] = e[r] || Yl[r];
	}
	this.context = t || this.context, this.listeners = [], this.emitting = 0;
}
var $l = Ql.prototype, eu = function(e, t, n, r, i, a, o) {
	I(r) && (i = r, r = null), o && (a = a == null ? o : Z({}, a, o));
	for (var s = L(n) ? n : n.split(/\s+/), c = 0; c < s.length; c++) {
		var l = s[c];
		if (!J(l)) {
			var u = l.match(ql);
			if (u) {
				var d = u[1];
				if (t(e, l, d, u[2] ? u[2] : null, r, i, a) === !1) break;
			}
		}
	}
}, tu = function(e, t) {
	return e.addEventFields(e.context, t), new Wl(t.type, t);
}, nu = function(e, t, n) {
	if (ee(n)) {
		t(e, n);
		return;
	}
	if (R(n)) {
		t(e, tu(e, n));
		return;
	}
	for (var r = L(n) ? n : n.split(/\s+/), i = 0; i < r.length; i++) {
		var a = r[i];
		if (!J(a)) {
			var o = a.match(ql);
			if (o) {
				var s = o[1];
				t(e, tu(e, {
					type: s,
					namespace: o[2] ? o[2] : null,
					target: e.context
				}));
			}
		}
	}
};
$l.on = $l.addListener = function(e, t, n, r, i) {
	return eu(this, function(e, t, n, r, i, a, o) {
		I(a) && e.listeners.push({
			event: t,
			callback: a,
			type: n,
			namespace: r,
			qualifier: i,
			conf: o
		});
	}, e, t, n, r, i), this;
}, $l.one = function(e, t, n, r) {
	return this.on(e, t, n, r, { one: !0 });
}, $l.removeListener = $l.off = function(e, t, n, r) {
	var i = this;
	this.emitting !== 0 && (this.listeners = Xt(this.listeners));
	for (var a = this.listeners, o = function(o) {
		var s = a[o];
		eu(i, function(t, n, r, i, c, l) {
			if ((s.type === r || e === "*") && (!i && s.namespace !== ".*" || s.namespace === i) && (!c || t.qualifierCompare(s.qualifier, c)) && (!l || s.callback === l)) return a.splice(o, 1), !1;
		}, e, t, n, r);
	}, s = a.length - 1; s >= 0; s--) o(s);
	return this;
}, $l.removeAllListeners = function() {
	return this.removeListener("*");
}, $l.emit = $l.trigger = function(e, t, n) {
	var r = this.listeners, i = r.length;
	return this.emitting++, L(t) || (t = [t]), nu(this, function(e, a) {
		n != null && (r = [{
			event: a.event,
			type: a.type,
			namespace: a.namespace,
			callback: n
		}], i = r.length);
		for (var o = function() {
			var n = r[s];
			if (n.type === a.type && (!n.namespace || n.namespace === a.namespace || n.namespace === Jl) && e.eventMatches(e.context, n, a)) {
				var i = [a];
				t != null && rn(i, t), e.beforeEmit(e.context, n, a), n.conf && n.conf.one && (e.listeners = e.listeners.filter(function(e) {
					return e !== n;
				}));
				var o = e.callbackContext(e.context, n, a), c = n.callback.apply(o, i);
				e.afterEmit(e.context, n, a), c === !1 && (a.stopPropagation(), a.preventDefault());
			}
		}, s = 0; s < i; s++) o();
		e.bubble(e.context) && !a.isPropagationStopped() && e.parent(e.context).emit(a, t);
	}, e), this.emitting--, this;
};
var ru = {
	qualifierCompare: function(e, t) {
		return e == null || t == null ? e == null && t == null : e.sameText(t);
	},
	eventMatches: function(e, t, n) {
		var r = t.qualifier;
		return r == null || e !== n.target && W(n.target) && r.matches(n.target);
	},
	addEventFields: function(e, t) {
		t.cy = e.cy(), t.target = e;
	},
	callbackContext: function(e, t, n) {
		return t.qualifier == null ? e : n.target;
	},
	beforeEmit: function(e, t) {
		t.conf && t.conf.once && t.conf.onceCollection.removeListener(t.event, t.qualifier, t.callback);
	},
	bubble: function() {
		return !0;
	},
	parent: function(e) {
		return e.isChild() ? e.parent() : e.cy();
	}
}, iu = function(e) {
	return F(e) ? new Kc(e) : e;
}, au = {
	createEmitter: function() {
		for (var e = 0; e < this.length; e++) {
			var t = this[e], n = t._private;
			n.emitter ||= new Ql(ru, t);
		}
		return this;
	},
	emitter: function() {
		return this._private.emitter;
	},
	on: function(e, t, n) {
		for (var r = iu(t), i = 0; i < this.length; i++) this[i].emitter().on(e, r, n);
		return this;
	},
	removeListener: function(e, t, n) {
		for (var r = iu(t), i = 0; i < this.length; i++) this[i].emitter().removeListener(e, r, n);
		return this;
	},
	removeAllListeners: function() {
		for (var e = 0; e < this.length; e++) this[e].emitter().removeAllListeners();
		return this;
	},
	one: function(e, t, n) {
		for (var r = iu(t), i = 0; i < this.length; i++) this[i].emitter().one(e, r, n);
		return this;
	},
	once: function(e, t, n) {
		for (var r = iu(t), i = 0; i < this.length; i++) this[i].emitter().on(e, r, n, {
			once: !0,
			onceCollection: this
		});
	},
	emit: function(e, t) {
		for (var n = 0; n < this.length; n++) this[n].emitter().emit(e, t);
		return this;
	},
	emitAndNotify: function(e, t) {
		if (this.length !== 0) return this.cy().notify(e, this), this.emit(e, t), this;
	}
};
Cc.eventAliasesOn(au);
var ou = {
	nodes: function(e) {
		return this.filter(function(e) {
			return e.isNode();
		}).filter(e);
	},
	edges: function(e) {
		return this.filter(function(e) {
			return e.isEdge();
		}).filter(e);
	},
	byGroup: function() {
		for (var e = this.spawn(), t = this.spawn(), n = 0; n < this.length; n++) {
			var r = this[n];
			r.isNode() ? e.push(r) : t.push(r);
		}
		return {
			nodes: e,
			edges: t
		};
	},
	filter: function(e, t) {
		if (e === void 0) return this;
		if (F(e) || U(e)) return new Kc(e).filter(this);
		if (I(e)) {
			for (var n = this.spawn(), r = this, i = 0; i < r.length; i++) {
				var a = r[i];
				(t ? e.apply(t, [
					a,
					i,
					r
				]) : e(a, i, r)) && n.push(a);
			}
			return n;
		}
		return this.spawn();
	},
	not: function(e) {
		if (e) {
			F(e) && (e = this.filter(e));
			for (var t = this.spawn(), n = 0; n < this.length; n++) {
				var r = this[n];
				e.has(r) || t.push(r);
			}
			return t;
		}
		return this;
	},
	absoluteComplement: function() {
		return this.cy().mutableElements().not(this);
	},
	intersect: function(e) {
		if (F(e)) {
			var t = e;
			return this.filter(t);
		}
		for (var n = this.spawn(), r = this, i = e, a = this.length < e.length, o = a ? r : i, s = a ? i : r, c = 0; c < o.length; c++) {
			var l = o[c];
			s.has(l) && n.push(l);
		}
		return n;
	},
	xor: function(e) {
		var t = this._private.cy;
		F(e) && (e = t.$(e));
		var n = this.spawn(), r = this, i = e, a = function(e, t) {
			for (var r = 0; r < e.length; r++) {
				var i = e[r], a = i._private.data.id;
				t.hasElementWithId(a) || n.push(i);
			}
		};
		return a(r, i), a(i, r), n;
	},
	diff: function(e) {
		var t = this._private.cy;
		F(e) && (e = t.$(e));
		var n = this.spawn(), r = this.spawn(), i = this.spawn(), a = this, o = e, s = function(e, t, n) {
			for (var r = 0; r < e.length; r++) {
				var a = e[r], o = a._private.data.id;
				t.hasElementWithId(o) ? i.merge(a) : n.push(a);
			}
		};
		return s(a, o, n), s(o, a, r), {
			left: n,
			right: r,
			both: i
		};
	},
	add: function(e) {
		var t = this._private.cy;
		if (!e) return this;
		if (F(e)) {
			var n = e;
			e = t.mutableElements().filter(n);
		}
		for (var r = this.spawnSelf(), i = 0; i < e.length; i++) {
			var a = e[i];
			this.has(a) || r.push(a);
		}
		return r;
	},
	merge: function(e) {
		var t = this._private, n = t.cy;
		if (!e) return this;
		if (e && F(e)) {
			var r = e;
			e = n.mutableElements().filter(r);
		}
		for (var i = t.map, a = 0; a < e.length; a++) {
			var o = e[a], s = o._private.data.id;
			if (!i.has(s)) {
				var c = this.length++;
				this[c] = o, i.set(s, {
					ele: o,
					index: c
				});
			}
		}
		return this;
	},
	unmergeAt: function(e) {
		var t = this[e].id(), n = this._private.map;
		this[e] = void 0, n.delete(t);
		var r = e === this.length - 1;
		if (this.length > 1 && !r) {
			var i = this.length - 1, a = this[i], o = a._private.data.id;
			this[i] = void 0, this[e] = a, n.set(o, {
				ele: a,
				index: e
			});
		}
		return this.length--, this;
	},
	unmergeOne: function(e) {
		e = e[0];
		var t = this._private, n = e._private.data.id, r = t.map.get(n);
		if (!r) return this;
		var i = r.index;
		return this.unmergeAt(i), this;
	},
	unmerge: function(e) {
		var t = this._private.cy;
		if (!e) return this;
		if (e && F(e)) {
			var n = e;
			e = t.mutableElements().filter(n);
		}
		for (var r = 0; r < e.length; r++) this.unmergeOne(e[r]);
		return this;
	},
	unmergeBy: function(e) {
		for (var t = this.length - 1; t >= 0; t--) {
			var n = this[t];
			e(n) && this.unmergeAt(t);
		}
		return this;
	},
	map: function(e, t) {
		for (var n = [], r = this, i = 0; i < r.length; i++) {
			var a = r[i], o = t ? e.apply(t, [
				a,
				i,
				r
			]) : e(a, i, r);
			n.push(o);
		}
		return n;
	},
	reduce: function(e, t) {
		for (var n = t, r = this, i = 0; i < r.length; i++) n = e(n, r[i], i, r);
		return n;
	},
	max: function(e, t) {
		for (var n = -Infinity, r, i = this, a = 0; a < i.length; a++) {
			var o = i[a], s = t ? e.apply(t, [
				o,
				a,
				i
			]) : e(o, a, i);
			s > n && (n = s, r = o);
		}
		return {
			value: n,
			ele: r
		};
	},
	min: function(e, t) {
		for (var n = Infinity, r, i = this, a = 0; a < i.length; a++) {
			var o = i[a], s = t ? e.apply(t, [
				o,
				a,
				i
			]) : e(o, a, i);
			s < n && (n = s, r = o);
		}
		return {
			value: n,
			ele: r
		};
	}
}, su = ou;
su.u = su["|"] = su["+"] = su.union = su.or = su.add, su["\\"] = su["!"] = su["-"] = su.difference = su.relativeComplement = su.subtract = su.not, su.n = su["&"] = su["."] = su.and = su.intersection = su.intersect, su["^"] = su["(+)"] = su["(-)"] = su.symmetricDifference = su.symdiff = su.xor, su.fnFilter = su.filterFn = su.stdFilter = su.filter, su.complement = su.abscomp = su.absoluteComplement;
var cu = {
	isNode: function() {
		return this.group() === "nodes";
	},
	isEdge: function() {
		return this.group() === "edges";
	},
	isLoop: function() {
		return this.isEdge() && this.source()[0] === this.target()[0];
	},
	isSimple: function() {
		return this.isEdge() && this.source()[0] !== this.target()[0];
	},
	group: function() {
		var e = this[0];
		if (e) return e._private.group;
	}
}, lu = function(e, t) {
	var n = e.cy().hasCompoundNodes();
	function r(e) {
		var t = e.pstyle("z-compound-depth");
		return t.value === "auto" ? n ? e.zDepth() : 0 : t.value === "bottom" ? -1 : t.value === "top" ? Bt : 0;
	}
	var i = r(e) - r(t);
	if (i !== 0) return i;
	function a(e) {
		return e.pstyle("z-index-compare").value === "auto" ? +!!e.isNode() : 0;
	}
	var o = a(e) - a(t);
	if (o !== 0) return o;
	var s = e.pstyle("z-index").value - t.pstyle("z-index").value;
	return s === 0 ? e.poolIndex() - t.poolIndex() : s;
}, uu = {
	forEach: function(e, t) {
		if (I(e)) for (var n = this.length, r = 0; r < n; r++) {
			var i = this[r];
			if ((t ? e.apply(t, [
				i,
				r,
				this
			]) : e(i, r, this)) === !1) break;
		}
		return this;
	},
	toArray: function() {
		for (var e = [], t = 0; t < this.length; t++) e.push(this[t]);
		return e;
	},
	slice: function(e, t) {
		var n = [], r = this.length;
		t ??= r, e ??= 0, e < 0 && (e = r + e), t < 0 && (t = r + t);
		for (var i = e; i >= 0 && i < t && i < r; i++) n.push(this[i]);
		return this.spawn(n);
	},
	size: function() {
		return this.length;
	},
	eq: function(e) {
		return this[e] || this.spawn();
	},
	first: function() {
		return this[0] || this.spawn();
	},
	last: function() {
		return this[this.length - 1] || this.spawn();
	},
	empty: function() {
		return this.length === 0;
	},
	nonempty: function() {
		return !this.empty();
	},
	sort: function(e) {
		if (!I(e)) return this;
		var t = this.toArray().sort(e);
		return this.spawn(t);
	},
	sortByZIndex: function() {
		return this.sort(lu);
	},
	zDepth: function() {
		var e = this[0];
		if (e) {
			var t = e._private;
			if (t.group === "nodes") {
				var n = t.data.parent ? e.parents().size() : 0;
				return e.isParent() ? n : Bt - 1;
			}
			var r = t.source, i = t.target, a = r.zDepth(), o = i.zDepth();
			return Math.max(a, o, 0);
		}
	}
};
uu.each = uu.forEach, (function() {
	var e = "undefined";
	(typeof Symbol > "u" ? "undefined" : E(Symbol)) != e && E(Symbol.iterator) != e && (uu[Symbol.iterator] = function() {
		var e = this, t = {
			value: void 0,
			done: !1
		}, n = 0, r = this.length;
		return _({ next: function() {
			return n < r ? t.value = e[n++] : (t.value = void 0, t.done = !0), t;
		} }, Symbol.iterator, function() {
			return this;
		});
	});
})();
var du = en({ nodeDimensionsIncludeLabels: !1 }), fu = {
	layoutDimensions: function(e) {
		e = du(e);
		var t;
		if (!this.takesUpSpace()) t = {
			w: 0,
			h: 0
		};
		else if (e.nodeDimensionsIncludeLabels) {
			var n = this.boundingBox();
			t = {
				w: n.w,
				h: n.h
			};
		} else t = {
			w: this.outerWidth(),
			h: this.outerHeight()
		};
		return (t.w === 0 || t.h === 0) && (t.w = t.h = 1), t;
	},
	layoutPositions: function(e, t, n) {
		var r = this.nodes().filter(function(e) {
			return !e.isParent();
		}), i = this.cy(), a = t.eles, o = function(e) {
			return e.id();
		}, s = ie(n, o);
		e.emit({
			type: "layoutstart",
			layout: e
		}), e.animations = [];
		var c = function(e, t, n) {
			var r = {
				x: t.x1 + t.w / 2,
				y: t.y1 + t.h / 2
			}, i = {
				x: (n.x - r.x) * e,
				y: (n.y - r.y) * e
			};
			return {
				x: r.x + i.x,
				y: r.y + i.y
			};
		}, l = t.spacingFactor && t.spacingFactor !== 1, u = function() {
			if (!l) return null;
			for (var e = nr(), t = 0; t < r.length; t++) {
				var n = r[t], i = s(n, t);
				or(e, i.x, i.y);
			}
			return e;
		}(), d = ie(function(e, n) {
			var r = s(e, n);
			return l && (r = c(Math.abs(t.spacingFactor), u, r)), t.transform != null && (r = t.transform(e, r)), r;
		}, o);
		if (t.animate) {
			for (var f = 0; f < r.length; f++) {
				var p = r[f], m = d(p, f);
				if (t.animateFilter == null || t.animateFilter(p, f)) {
					var h = p.animation({
						position: m,
						duration: t.animationDuration,
						easing: t.animationEasing
					});
					e.animations.push(h);
				} else p.position(m);
			}
			if (t.fit) {
				var g = i.animation({
					fit: {
						boundingBox: a.boundingBoxAt(d),
						padding: t.padding
					},
					duration: t.animationDuration,
					easing: t.animationEasing
				});
				e.animations.push(g);
			} else if (t.zoom !== void 0 && t.pan !== void 0) {
				var _ = i.animation({
					zoom: t.zoom,
					pan: t.pan,
					duration: t.animationDuration,
					easing: t.animationEasing
				});
				e.animations.push(_);
			}
			e.animations.forEach(function(e) {
				return e.play();
			}), e.one("layoutready", t.ready), e.emit({
				type: "layoutready",
				layout: e
			}), Sa.all(e.animations.map(function(e) {
				return e.promise();
			})).then(function() {
				e.one("layoutstop", t.stop), e.emit({
					type: "layoutstop",
					layout: e
				});
			});
		} else r.positions(d), t.fit && i.fit(t.eles, t.padding), t.zoom != null && i.zoom(t.zoom), t.pan && i.pan(t.pan), e.one("layoutready", t.ready), e.emit({
			type: "layoutready",
			layout: e
		}), e.one("layoutstop", t.stop), e.emit({
			type: "layoutstop",
			layout: e
		});
		return this;
	},
	layout: function(e) {
		return this.cy().makeLayout(Z({}, e, { eles: this }));
	}
};
fu.createLayout = fu.makeLayout = fu.layout;
function pu(e, t, n) {
	var r = n._private, i = r.styleCache = r.styleCache || [], a;
	return (a = i[e]) ?? (a = i[e] = t(n)), a;
}
function mu(e, t) {
	return e = jt(e), function(n) {
		return pu(e, t, n);
	};
}
function hu(e, t) {
	e = jt(e);
	var n = function(e) {
		return t.call(e);
	};
	return function() {
		var t = this[0];
		if (t) return pu(e, n, t);
	};
}
var gu = {
	recalculateRenderedStyle: function(e) {
		var t = this.cy(), n = t.renderer(), r = t.styleEnabled();
		return n && r && n.recalculateRenderedStyle(this, e), this;
	},
	dirtyStyleCache: function() {
		var e = this.cy(), t = function(e) {
			return e._private.styleCache = null;
		};
		if (e.hasCompoundNodes()) {
			var n = this.spawnSelf().merge(this.descendants()).merge(this.parents());
			n.merge(n.connectedEdges()), n.forEach(t);
		} else this.forEach(function(e) {
			t(e), e.connectedEdges().forEach(t);
		});
		return this;
	},
	updateStyle: function(e) {
		var t = this._private.cy;
		if (!t.styleEnabled()) return this;
		if (t.batching()) return t._private.batchStyleEles.merge(this), this;
		var n = t.hasCompoundNodes(), r = this;
		e = !!(e || e === void 0), n && (r = this.spawnSelf().merge(this.descendants()).merge(this.parents()));
		var i = r;
		return e ? i.emitAndNotify("style") : i.emit("style"), r.forEach(function(e) {
			return e._private.styleDirty = !0;
		}), this;
	},
	cleanStyle: function() {
		var e = this.cy();
		if (e.styleEnabled()) for (var t = 0; t < this.length; t++) {
			var n = this[t];
			n._private.styleDirty && (n._private.styleDirty = !1, e.style().apply(n));
		}
	},
	parsedStyle: function(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = this[0], r = n.cy();
		if (r.styleEnabled() && n) return n._private.styleDirty && (n._private.styleDirty = !1, r.style().apply(n)), n._private.style[e] ?? (t ? r.style().getDefaultProperty(e) : null);
	},
	numericStyle: function(e) {
		var t = this[0];
		if (t.cy().styleEnabled() && t) {
			var n = t.pstyle(e);
			return n.pfValue === void 0 ? n.value : n.pfValue;
		}
	},
	numericStyleUnits: function(e) {
		var t = this[0];
		if (t.cy().styleEnabled() && t) return t.pstyle(e).units;
	},
	renderedStyle: function(e) {
		var t = this.cy();
		if (!t.styleEnabled()) return this;
		var n = this[0];
		if (n) return t.style().getRenderedStyle(n, e);
	},
	style: function(e, t) {
		var n = this.cy();
		if (!n.styleEnabled()) return this;
		var r = !1, i = n.style();
		if (R(e)) {
			var a = e;
			i.applyBypass(this, a, r), this.emitAndNotify("style");
		} else if (F(e)) {
			if (t === void 0) {
				var o = this[0];
				return o ? i.getStylePropertyValue(o, e) : void 0;
			}
			i.applyBypass(this, e, t, r), this.emitAndNotify("style");
		} else if (e === void 0) {
			var s = this[0];
			return s ? i.getRawStyle(s) : void 0;
		}
		return this;
	},
	removeStyle: function(e) {
		var t = this.cy();
		if (!t.styleEnabled()) return this;
		var n = !1, r = t.style(), i = this;
		if (e === void 0) for (var a = 0; a < i.length; a++) {
			var o = i[a];
			r.removeAllBypasses(o, n);
		}
		else {
			e = e.split(/\s+/);
			for (var s = 0; s < i.length; s++) {
				var c = i[s];
				r.removeBypasses(c, e, n);
			}
		}
		return this.emitAndNotify("style"), this;
	},
	show: function() {
		return this.css("display", "element"), this;
	},
	hide: function() {
		return this.css("display", "none"), this;
	},
	effectiveOpacity: function() {
		var e = this.cy();
		if (!e.styleEnabled()) return 1;
		var t = e.hasCompoundNodes(), n = this[0];
		if (n) {
			var r = n._private, i = n.pstyle("opacity").value;
			if (!t) return i;
			var a = r.data.parent ? n.parents() : null;
			if (a) for (var o = 0; o < a.length; o++) i = a[o].pstyle("opacity").value * i;
			return i;
		}
	},
	transparent: function() {
		if (!this.cy().styleEnabled()) return !1;
		var e = this[0], t = e.cy().hasCompoundNodes();
		if (e) return t ? e.effectiveOpacity() === 0 : e.pstyle("opacity").value === 0;
	},
	backgrounding: function() {
		return this.cy().styleEnabled() ? !!this[0]._private.backgrounding : !1;
	}
};
function _u(e, t) {
	var n = e._private.data.parent ? e.parents() : null;
	if (n) for (var r = 0; r < n.length; r++) {
		var i = n[r];
		if (!t(i)) return !1;
	}
	return !0;
}
function vu(e) {
	var t = e.ok, n = e.edgeOkViaNode || e.ok, r = e.parentOk || e.ok;
	return function() {
		var e = this.cy();
		if (!e.styleEnabled()) return !0;
		var i = this[0], a = e.hasCompoundNodes();
		if (i) {
			var o = i._private;
			if (!t(i)) return !1;
			if (i.isNode()) return !a || _u(i, r);
			var s = o.source, c = o.target;
			return n(s) && (!a || _u(s, n)) && (s === c || n(c) && (!a || _u(c, n)));
		}
	};
}
var yu = mu("eleTakesUpSpace", function(e) {
	return e.pstyle("display").value === "element" && e.width() !== 0 && (!e.isNode() || e.height() !== 0);
});
gu.takesUpSpace = hu("takesUpSpace", vu({ ok: yu })), gu.interactive = hu("interactive", vu({
	ok: mu("eleInteractive", function(e) {
		return e.pstyle("events").value === "yes" && e.pstyle("visibility").value === "visible" && yu(e);
	}),
	parentOk: mu("parentInteractive", function(e) {
		return e.pstyle("visibility").value === "visible" && yu(e);
	}),
	edgeOkViaNode: yu
})), gu.noninteractive = function() {
	var e = this[0];
	if (e) return !e.interactive();
}, gu.visible = hu("visible", vu({
	ok: mu("eleVisible", function(e) {
		return e.pstyle("visibility").value === "visible" && e.pstyle("opacity").pfValue !== 0 && yu(e);
	}),
	edgeOkViaNode: yu
})), gu.hidden = function() {
	var e = this[0];
	if (e) return !e.visible();
}, gu.isBundledBezier = hu("isBundledBezier", function() {
	return this.cy().styleEnabled() ? !this.removed() && this.pstyle("curve-style").value === "bezier" && this.takesUpSpace() : !1;
}), gu.bypass = gu.css = gu.style, gu.renderedCss = gu.renderedStyle, gu.removeBypass = gu.removeCss = gu.removeStyle, gu.pstyle = gu.parsedStyle;
var bu = {};
function xu(e) {
	return function() {
		var t = arguments, n = [];
		if (t.length === 2) {
			var r = t[0], i = t[1];
			this.on(e.event, r, i);
		} else if (t.length === 1 && I(t[0])) {
			var a = t[0];
			this.on(e.event, a);
		} else if (t.length === 0 || t.length === 1 && L(t[0])) {
			for (var o = t.length === 1 ? t[0] : null, s = 0; s < this.length; s++) {
				var c = this[s], l = !e.ableField || c._private[e.ableField], u = c._private[e.field] != e.value;
				if (e.overrideAble) {
					var d = e.overrideAble(c);
					if (d !== void 0 && (l = d, !d)) return this;
				}
				l && (c._private[e.field] = e.value, u && n.push(c));
			}
			var f = this.spawn(n);
			f.updateStyle(), f.emit(e.event), o && f.emit(o);
		}
		return this;
	};
}
function Su(e) {
	bu[e.field] = function() {
		var t = this[0];
		if (t) {
			if (e.overrideField) {
				var n = e.overrideField(t);
				if (n !== void 0) return n;
			}
			return t._private[e.field];
		}
	}, bu[e.on] = xu({
		event: e.on,
		field: e.field,
		ableField: e.ableField,
		overrideAble: e.overrideAble,
		value: !0
	}), bu[e.off] = xu({
		event: e.off,
		field: e.field,
		ableField: e.ableField,
		overrideAble: e.overrideAble,
		value: !1
	});
}
Su({
	field: "locked",
	overrideField: function(e) {
		return e.cy().autolock() ? !0 : void 0;
	},
	on: "lock",
	off: "unlock"
}), Su({
	field: "grabbable",
	overrideField: function(e) {
		return e.cy().autoungrabify() || e.pannable() ? !1 : void 0;
	},
	on: "grabify",
	off: "ungrabify"
}), Su({
	field: "selected",
	ableField: "selectable",
	overrideAble: function(e) {
		return !e.cy().autounselectify() && void 0;
	},
	on: "select",
	off: "unselect"
}), Su({
	field: "selectable",
	overrideField: function(e) {
		return !e.cy().autounselectify() && void 0;
	},
	on: "selectify",
	off: "unselectify"
}), bu.deselect = bu.unselect, bu.grabbed = function() {
	var e = this[0];
	if (e) return e._private.grabbed;
}, Su({
	field: "active",
	on: "activate",
	off: "unactivate"
}), Su({
	field: "pannable",
	on: "panify",
	off: "unpanify"
}), bu.inactive = function() {
	var e = this[0];
	if (e) return !e._private.active;
};
var Cu = {}, wu = function(e) {
	return function(t) {
		for (var n = this, r = [], i = 0; i < n.length; i++) {
			var a = n[i];
			if (a.isNode()) {
				for (var o = !1, s = a.connectedEdges(), c = 0; c < s.length; c++) {
					var l = s[c], u = l.source(), d = l.target();
					if (e.noIncomingEdges && d === a && u !== a || e.noOutgoingEdges && u === a && d !== a) {
						o = !0;
						break;
					}
				}
				o || r.push(a);
			}
		}
		return this.spawn(r, !0).filter(t);
	};
}, Tu = function(e) {
	return function(t) {
		for (var n = this, r = [], i = 0; i < n.length; i++) {
			var a = n[i];
			if (a.isNode()) for (var o = a.connectedEdges(), s = 0; s < o.length; s++) {
				var c = o[s], l = c.source(), u = c.target();
				e.outgoing && l === a ? (r.push(c), r.push(u)) : e.incoming && u === a && (r.push(c), r.push(l));
			}
		}
		return this.spawn(r, !0).filter(t);
	};
}, Eu = function(e) {
	return function(t) {
		for (var n = this, r = [], i = {};;) {
			var a = e.outgoing ? n.outgoers() : n.incomers();
			if (a.length === 0) break;
			for (var o = !1, s = 0; s < a.length; s++) {
				var c = a[s], l = c.id();
				i[l] || (i[l] = !0, r.push(c), o = !0);
			}
			if (!o) break;
			n = a;
		}
		return this.spawn(r, !0).filter(t);
	};
};
Cu.clearTraversalCache = function() {
	for (var e = 0; e < this.length; e++) this[e]._private.traversalCache = null;
}, Z(Cu, {
	roots: wu({ noIncomingEdges: !0 }),
	leaves: wu({ noOutgoingEdges: !0 }),
	outgoers: Yc(Tu({ outgoing: !0 }), "outgoers"),
	successors: Eu({ outgoing: !0 }),
	incomers: Yc(Tu({ incoming: !0 }), "incomers"),
	predecessors: Eu({})
}), Z(Cu, {
	neighborhood: Yc(function(e) {
		for (var t = [], n = this.nodes(), r = 0; r < n.length; r++) for (var i = n[r], a = i.connectedEdges(), o = 0; o < a.length; o++) {
			var s = a[o], c = s.source(), l = s.target(), u = i === c ? l : c;
			u.length > 0 && t.push(u[0]), t.push(s[0]);
		}
		return this.spawn(t, !0).filter(e);
	}, "neighborhood"),
	closedNeighborhood: function(e) {
		return this.neighborhood().add(this).filter(e);
	},
	openNeighborhood: function(e) {
		return this.neighborhood(e);
	}
}), Cu.neighbourhood = Cu.neighborhood, Cu.closedNeighbourhood = Cu.closedNeighborhood, Cu.openNeighbourhood = Cu.openNeighborhood, Z(Cu, {
	source: Yc(function(e) {
		var t = this[0], n;
		return t && (n = t._private.source || t.cy().collection()), n && e ? n.filter(e) : n;
	}, "source"),
	target: Yc(function(e) {
		var t = this[0], n;
		return t && (n = t._private.target || t.cy().collection()), n && e ? n.filter(e) : n;
	}, "target"),
	sources: Du({ attr: "source" }),
	targets: Du({ attr: "target" })
});
function Du(e) {
	return function(t) {
		for (var n = [], r = 0; r < this.length; r++) {
			var i = this[r]._private[e.attr];
			i && n.push(i);
		}
		return this.spawn(n, !0).filter(t);
	};
}
Z(Cu, {
	edgesWith: Yc(Ou(), "edgesWith"),
	edgesTo: Yc(Ou({ thisIsSrc: !0 }), "edgesTo")
});
function Ou(e) {
	return function(t) {
		var n = [], r = this._private.cy, i = e || {};
		F(t) && (t = r.$(t));
		for (var a = 0; a < t.length; a++) for (var o = t[a]._private.edges, s = 0; s < o.length; s++) {
			var c = o[s], l = c._private.data, u = this.hasElementWithId(l.source) && t.hasElementWithId(l.target), d = t.hasElementWithId(l.source) && this.hasElementWithId(l.target);
			(u || d) && ((i.thisIsSrc || i.thisIsTgt) && (i.thisIsSrc && !u || i.thisIsTgt && !d) || n.push(c));
		}
		return this.spawn(n, !0);
	};
}
Z(Cu, {
	connectedEdges: Yc(function(e) {
		for (var t = [], n = this, r = 0; r < n.length; r++) {
			var i = n[r];
			if (i.isNode()) for (var a = i._private.edges, o = 0; o < a.length; o++) {
				var s = a[o];
				t.push(s);
			}
		}
		return this.spawn(t, !0).filter(e);
	}, "connectedEdges"),
	connectedNodes: Yc(function(e) {
		for (var t = [], n = this, r = 0; r < n.length; r++) {
			var i = n[r];
			i.isEdge() && (t.push(i.source()[0]), t.push(i.target()[0]));
		}
		return this.spawn(t, !0).filter(e);
	}, "connectedNodes"),
	parallelEdges: Yc(ku(), "parallelEdges"),
	codirectedEdges: Yc(ku({ codirected: !0 }), "codirectedEdges")
});
function ku(e) {
	return e = Z({}, { codirected: !1 }, e), function(t) {
		for (var n = [], r = this.edges(), i = e, a = 0; a < r.length; a++) for (var o = r[a]._private, s = o.source, c = s._private.data.id, l = o.data.target, u = s._private.edges, d = 0; d < u.length; d++) {
			var f = u[d], p = f._private.data, m = p.target, h = p.source, g = m === l && h === c, _ = c === m && l === h;
			(i.codirected && g || !i.codirected && (g || _)) && n.push(f);
		}
		return this.spawn(n, !0).filter(t);
	};
}
Z(Cu, {
	components: function(e) {
		var t = this, n = t.cy(), r = n.collection(), i = e == null ? t.nodes() : e.nodes(), a = [];
		e != null && i.empty() && (i = e.sources());
		var o = function(e, t) {
			r.merge(e), i.unmerge(e), t.merge(e);
		};
		if (i.empty()) return t.spawn();
		var s = function() {
			var e = n.collection();
			a.push(e);
			var r = i[0];
			o(r, e), t.bfs({
				directed: !1,
				roots: r,
				visit: function(t) {
					return o(t, e);
				}
			}), e.forEach(function(n) {
				n.connectedEdges().forEach(function(n) {
					t.has(n) && e.has(n.source()) && e.has(n.target()) && e.merge(n);
				});
			});
		};
		do
			s();
		while (i.length > 0);
		return a;
	},
	component: function() {
		var e = this[0];
		return e.cy().mutableElements().components(e)[0];
	}
}), Cu.componentsOf = Cu.components;
var Au = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = arguments.length > 3 && arguments[3] !== void 0 && arguments[3];
	if (e === void 0) {
		Gt("A collection must have a reference to the core");
		return;
	}
	var i = new sn(), a = !1;
	if (!t) t = [];
	else if (t.length > 0 && R(t[0]) && !W(t[0])) {
		a = !0;
		for (var o = [], s = new un(), c = 0, l = t.length; c < l; c++) {
			var u = t[c];
			u.data ??= {};
			var d = u.data;
			if (d.id == null) d.id = Zt();
			else if (e.hasElementWithId(d.id) || s.has(d.id)) continue;
			var f = new dn(e, u, !1);
			o.push(f), s.add(d.id);
		}
		t = o;
	}
	this.length = 0;
	for (var p = 0, m = t.length; p < m; p++) {
		var h = t[p][0];
		if (h != null) {
			var g = h._private.data.id;
			(!n || !i.has(g)) && (n && i.set(g, {
				index: this.length,
				ele: h
			}), this[this.length] = h, this.length++);
		}
	}
	this._private = {
		eles: this,
		cy: e,
		get map() {
			return this.lazyMap ?? this.rebuildMap(), this.lazyMap;
		},
		set map(e) {
			this.lazyMap = e;
		},
		rebuildMap: function() {
			for (var e = this.lazyMap = new sn(), t = this.eles, n = 0; n < t.length; n++) {
				var r = t[n];
				e.set(r.id(), {
					index: n,
					ele: r
				});
			}
		}
	}, n && (this._private.map = i), a && !r && this.restore();
}, ju = dn.prototype = Au.prototype = Object.create(Array.prototype);
ju.instanceString = function() {
	return "collection";
}, ju.spawn = function(e, t) {
	return new Au(this.cy(), e, t);
}, ju.spawnSelf = function() {
	return this.spawn(this);
}, ju.cy = function() {
	return this._private.cy;
}, ju.renderer = function() {
	return this._private.cy.renderer();
}, ju.element = function() {
	return this[0];
}, ju.collection = function() {
	return G(this) ? this : new Au(this._private.cy, [this]);
}, ju.unique = function() {
	return new Au(this._private.cy, this, !0);
}, ju.hasElementWithId = function(e) {
	return e = "" + e, this._private.map.has(e);
}, ju.getElementById = function(e) {
	e = "" + e;
	var t = this._private.cy, n = this._private.map.get(e);
	return n ? n.ele : new Au(t);
}, ju.$id = ju.getElementById, ju.poolIndex = function() {
	var e = this._private.cy._private.elements, t = this[0]._private.data.id;
	return e._private.map.get(t).index;
}, ju.indexOf = function(e) {
	var t = e[0]._private.data.id;
	return this._private.map.get(t).index;
}, ju.indexOfId = function(e) {
	return e = "" + e, this._private.map.get(e).index;
}, ju.json = function(e) {
	var t = this.element(), n = this.cy();
	if (t == null && e) return this;
	if (t != null) {
		var r = t._private;
		if (R(e)) {
			if (n.startBatch(), e.data) {
				t.data(e.data);
				var i = r.data;
				if (t.isEdge()) {
					var a = !1, o = {}, s = e.data.source, c = e.data.target;
					s != null && s != i.source && (o.source = "" + s, a = !0), c != null && c != i.target && (o.target = "" + c, a = !0), a && (t = t.move(o));
				} else {
					var l = "parent" in e.data, u = e.data.parent;
					l && (u != null || i.parent != null) && u != i.parent && (u === void 0 && (u = null), u != null && (u = "" + u), t = t.move({ parent: u }));
				}
			}
			e.position && t.position(e.position);
			var d = function(n, i, a) {
				var o = e[n];
				o != null && o !== r[n] && (o ? t[i]() : t[a]());
			};
			return d("removed", "remove", "restore"), d("selected", "select", "unselect"), d("selectable", "selectify", "unselectify"), d("locked", "lock", "unlock"), d("grabbable", "grabify", "ungrabify"), d("pannable", "panify", "unpanify"), e.classes != null && t.classes(e.classes), n.endBatch(), this;
		}
		if (e === void 0) {
			var f = {
				data: Yt(r.data),
				position: Yt(r.position),
				group: r.group,
				removed: r.removed,
				selected: r.selected,
				selectable: r.selectable,
				locked: r.locked,
				grabbable: r.grabbable,
				pannable: r.pannable,
				classes: null
			};
			f.classes = "";
			var p = 0;
			return r.classes.forEach(function(e) {
				return f.classes += p++ === 0 ? e : " " + e;
			}), f;
		}
	}
}, ju.jsons = function() {
	for (var e = [], t = 0; t < this.length; t++) {
		var n = this[t].json();
		e.push(n);
	}
	return e;
}, ju.clone = function() {
	for (var e = this.cy(), t = [], n = 0; n < this.length; n++) {
		var r = new dn(e, this[n].json(), !1);
		t.push(r);
	}
	return new Au(e, t);
}, ju.copy = ju.clone, ju.restore = function() {
	for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = this, r = n.cy(), i = r._private, a = [], o = [], s, c = 0, l = n.length; c < l; c++) {
		var u = n[c];
		(!t || u.removed()) && (u.isNode() ? a.push(u) : o.push(u));
	}
	s = a.concat(o);
	var d, f = function() {
		s.splice(d, 1), d--;
	};
	for (d = 0; d < s.length; d++) {
		var p = s[d], m = p._private, h = m.data;
		if (p.clearTraversalCache(), t || m.removed) {
			if (h.id === void 0) h.id = Zt();
			else if (B(h.id)) h.id = "" + h.id;
			else if (J(h.id) || !F(h.id)) {
				Gt("Can not create element with invalid string ID `" + h.id + "`"), f();
				continue;
			} else if (r.hasElementWithId(h.id)) {
				Gt("Can not create second element with ID `" + h.id + "`"), f();
				continue;
			}
		}
		var g = h.id;
		if (p.isNode()) {
			var _ = m.position;
			_.x ??= 0, _.y ??= 0;
		}
		if (p.isEdge()) {
			for (var v = p, y = ["source", "target"], b = y.length, x = !1, S = 0; S < b; S++) {
				var C = y[S], w = h[C];
				B(w) && (w = h[C] = "" + h[C]), w == null || w === "" ? (Gt("Can not create edge `" + g + "` with unspecified " + C), x = !0) : r.hasElementWithId(w) || (Gt("Can not create edge `" + g + "` with nonexistent " + C + " `" + w + "`"), x = !0);
			}
			if (x) {
				f();
				continue;
			}
			var T = r.getElementById(h.source), E = r.getElementById(h.target);
			T.same(E) ? T._private.edges.push(v) : (T._private.edges.push(v), E._private.edges.push(v)), v._private.source = T, v._private.target = E;
		}
		m.map = new sn(), m.map.set(g, {
			ele: p,
			index: 0
		}), m.removed = !1, t && r.addToPool(p);
	}
	for (var D = 0; D < a.length; D++) {
		var O = a[D], k = O._private.data;
		B(k.parent) && (k.parent = "" + k.parent);
		var A = k.parent;
		if (A != null || O._private.parent) {
			var j = O._private.parent ? r.collection().merge(O._private.parent) : r.getElementById(A);
			if (j.empty()) k.parent = void 0;
			else if (j[0].removed()) qt("Node added with missing parent, reference to parent removed"), k.parent = void 0, O._private.parent = null;
			else {
				for (var M = !1, N = j; !N.empty();) {
					if (O.same(N)) {
						M = !0, k.parent = void 0;
						break;
					}
					N = N.parent();
				}
				M || (j[0]._private.children.push(O), O._private.parent = j[0], i.hasCompoundNodes = !0);
			}
		}
	}
	if (s.length > 0) {
		for (var P = s.length === n.length ? n : new Au(r, s), I = 0; I < P.length; I++) {
			var L = P[I];
			L.isNode() || (L.parallelEdges().clearTraversalCache(), L.source().clearTraversalCache(), L.target().clearTraversalCache());
		}
		(i.hasCompoundNodes ? r.collection().merge(P).merge(P.connectedNodes()).merge(P.parent()) : P).dirtyCompoundBoundsCache().dirtyBoundingBoxCache().updateStyle(e), e ? P.emitAndNotify("add") : t && P.emit("add");
	}
	return n;
}, ju.removed = function() {
	var e = this[0];
	return e && e._private.removed;
}, ju.inside = function() {
	var e = this[0];
	return e && !e._private.removed;
}, ju.remove = function() {
	var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = this, r = [], i = {}, a = n._private.cy;
	function o(e) {
		for (var t = e._private.edges, n = 0; n < t.length; n++) c(t[n]);
	}
	function s(e) {
		for (var t = e._private.children, n = 0; n < t.length; n++) c(t[n]);
	}
	function c(e) {
		var n = i[e.id()];
		t && e.removed() || n || (i[e.id()] = !0, e.isNode() ? (r.push(e), o(e), s(e)) : r.unshift(e));
	}
	for (var l = 0, u = n.length; l < u; l++) {
		var d = n[l];
		c(d);
	}
	function f(e, t) {
		var n = e._private.edges;
		tn(n, t), e.clearTraversalCache();
	}
	function p(e) {
		e.clearTraversalCache();
	}
	var m = [];
	m.ids = {};
	function h(e, t) {
		t = t[0], e = e[0];
		var n = e._private.children, r = e.id();
		tn(n, t), t._private.parent = null, m.ids[r] || (m.ids[r] = !0, m.push(e));
	}
	n.dirtyCompoundBoundsCache(), t && a.removeFromPool(r);
	for (var g = 0; g < r.length; g++) {
		var _ = r[g];
		if (_.isEdge()) {
			var v = _.source()[0], y = _.target()[0];
			f(v, _), f(y, _);
			for (var b = _.parallelEdges(), x = 0; x < b.length; x++) {
				var S = b[x];
				p(S), S.isBundledBezier() && S.dirtyBoundingBoxCache();
			}
		} else {
			var C = _.parent();
			C.length !== 0 && h(C, _);
		}
		t && (_._private.removed = !0);
	}
	var w = a._private.elements;
	a._private.hasCompoundNodes = !1;
	for (var T = 0; T < w.length; T++) if (w[T].isParent()) {
		a._private.hasCompoundNodes = !0;
		break;
	}
	var E = new Au(this.cy(), r);
	E.size() > 0 && (e ? E.emitAndNotify("remove") : t && E.emit("remove"));
	for (var D = 0; D < m.length; D++) {
		var O = m[D];
		(!t || !O.removed()) && O.updateStyle();
	}
	return E;
}, ju.move = function(e) {
	var t = this._private.cy, n = this, r = !1, i = !1, a = function(e) {
		return e == null ? e : "" + e;
	};
	if (e.source !== void 0 || e.target !== void 0) {
		var o = a(e.source), s = a(e.target), c = o != null && t.hasElementWithId(o), l = s != null && t.hasElementWithId(s);
		(c || l) && (t.batch(function() {
			n.remove(r, i), n.emitAndNotify("moveout");
			for (var e = 0; e < n.length; e++) {
				var t = n[e], a = t._private.data;
				t.isEdge() && (c && (a.source = o), l && (a.target = s));
			}
			n.restore(r, i);
		}), n.emitAndNotify("move"));
	} else if (e.parent !== void 0) {
		var u = a(e.parent);
		if (u === null || t.hasElementWithId(u)) {
			var d = u === null ? void 0 : u;
			t.batch(function() {
				var e = n.remove(r, i);
				e.emitAndNotify("moveout");
				for (var t = 0; t < n.length; t++) {
					var a = n[t], o = a._private.data;
					a.isNode() && (o.parent = d);
				}
				e.restore(r, i);
			}), n.emitAndNotify("move");
		}
	}
	return this;
}, [
	fa,
	wc,
	Tc,
	Jc,
	Xc,
	rl,
	il,
	Ul,
	au,
	ou,
	cu,
	uu,
	fu,
	gu,
	bu,
	Cu
].forEach(function(e) {
	Z(ju, e);
});
var Mu = {
	add: function(e) {
		var t, n = this;
		if (U(e)) {
			var r = e;
			if (r._private.cy === n) t = r.restore();
			else {
				for (var i = [], a = 0; a < r.length; a++) {
					var o = r[a];
					i.push(o.json());
				}
				t = new Au(n, i);
			}
		} else if (L(e)) t = new Au(n, e);
		else if (R(e) && (L(e.nodes) || L(e.edges))) {
			for (var s = e, c = [], l = ["nodes", "edges"], u = 0, d = l.length; u < d; u++) {
				var f = l[u], p = s[f];
				if (L(p)) for (var m = 0, h = p.length; m < h; m++) {
					var g = Z({ group: f }, p[m]);
					c.push(g);
				}
			}
			t = new Au(n, c);
		} else t = new dn(n, e).collection();
		return t;
	},
	remove: function(e) {
		if (!U(e) && F(e)) {
			var t = e;
			e = this.$(t);
		}
		return e.remove();
	}
};
function Nu(e, t, n, r) {
	var i = 11, a = 1 / (i - 1), o = typeof Float32Array < "u";
	if (arguments.length !== 4) return !1;
	for (var s = 0; s < 4; ++s) if (typeof arguments[s] != "number" || isNaN(arguments[s]) || !isFinite(arguments[s])) return !1;
	e = Math.min(e, 1), n = Math.min(n, 1), e = Math.max(e, 0), n = Math.max(n, 0);
	var c = o ? new Float32Array(i) : Array(i);
	function l(e, t) {
		return 1 - 3 * t + 3 * e;
	}
	function u(e, t) {
		return 3 * t - 6 * e;
	}
	function d(e) {
		return 3 * e;
	}
	function f(e, t, n) {
		return ((l(t, n) * e + u(t, n)) * e + d(t)) * e;
	}
	function p(e, t, n) {
		return 3 * l(t, n) * e * e + 2 * u(t, n) * e + d(t);
	}
	function m(t, r) {
		for (var i = 0; i < 4; ++i) {
			var a = p(r, e, n);
			if (a === 0) return r;
			var o = f(r, e, n) - t;
			r -= o / a;
		}
		return r;
	}
	function h() {
		for (var t = 0; t < i; ++t) c[t] = f(t * a, e, n);
	}
	function g(t, r, i) {
		var a, o, s = 0;
		do
			o = r + (i - r) / 2, a = f(o, e, n) - t, a > 0 ? i = o : r = o;
		while (Math.abs(a) > 1e-7 && ++s < 10);
		return o;
	}
	function _(t) {
		for (var r = 0, o = 1, s = i - 1; o !== s && c[o] <= t; ++o) r += a;
		--o;
		var l = (t - c[o]) / (c[o + 1] - c[o]), u = r + l * a, d = p(u, e, n);
		return d >= .001 ? m(t, u) : d === 0 ? u : g(t, r, r + a);
	}
	var v = !1;
	function y() {
		v = !0, (e !== t || n !== r) && h();
	}
	var b = function(i) {
		return v || y(), e === t && n === r ? i : i === 0 ? 0 : i === 1 ? 1 : f(_(i), t, r);
	};
	b.getControlPoints = function() {
		return [{
			x: e,
			y: t
		}, {
			x: n,
			y: r
		}];
	};
	var x = "generateBezier(" + [
		e,
		t,
		n,
		r
	] + ")";
	return b.toString = function() {
		return x;
	}, b;
}
var Pu = function() {
	function e(e) {
		return -e.tension * e.x - e.friction * e.v;
	}
	function t(t, n, r) {
		var i = {
			x: t.x + r.dx * n,
			v: t.v + r.dv * n,
			tension: t.tension,
			friction: t.friction
		};
		return {
			dx: i.v,
			dv: e(i)
		};
	}
	function n(n, r) {
		var i = {
			dx: n.v,
			dv: e(n)
		}, a = t(n, r * .5, i), o = t(n, r * .5, a), s = t(n, r, o), c = 1 / 6 * (i.dx + 2 * (a.dx + o.dx) + s.dx), l = 1 / 6 * (i.dv + 2 * (a.dv + o.dv) + s.dv);
		return n.x += c * r, n.v += l * r, n;
	}
	return function e(t, r, i) {
		var a = {
			x: -1,
			v: 0,
			tension: null,
			friction: null
		}, o = [0], s = 0, c = 1 / 1e4, l = 16 / 1e3, u, d, f;
		for (t = parseFloat(t) || 500, r = parseFloat(r) || 20, i ||= null, a.tension = t, a.friction = r, u = i !== null, u ? (s = e(t, r), d = s / i * l) : d = l; f = n(f || a, d), o.push(1 + f.x), s += 16, Math.abs(f.x) > c && Math.abs(f.v) > c;);
		return u ? function(e) {
			return o[e * (o.length - 1) | 0];
		} : s;
	};
}(), Fu = function(e, t, n, r) {
	var i = Nu(e, t, n, r);
	return function(e, t, n) {
		return e + (t - e) * i(n);
	};
}, Iu = {
	linear: function(e, t, n) {
		return e + (t - e) * n;
	},
	ease: Fu(.25, .1, .25, 1),
	"ease-in": Fu(.42, 0, 1, 1),
	"ease-out": Fu(0, 0, .58, 1),
	"ease-in-out": Fu(.42, 0, .58, 1),
	"ease-in-sine": Fu(.47, 0, .745, .715),
	"ease-out-sine": Fu(.39, .575, .565, 1),
	"ease-in-out-sine": Fu(.445, .05, .55, .95),
	"ease-in-quad": Fu(.55, .085, .68, .53),
	"ease-out-quad": Fu(.25, .46, .45, .94),
	"ease-in-out-quad": Fu(.455, .03, .515, .955),
	"ease-in-cubic": Fu(.55, .055, .675, .19),
	"ease-out-cubic": Fu(.215, .61, .355, 1),
	"ease-in-out-cubic": Fu(.645, .045, .355, 1),
	"ease-in-quart": Fu(.895, .03, .685, .22),
	"ease-out-quart": Fu(.165, .84, .44, 1),
	"ease-in-out-quart": Fu(.77, 0, .175, 1),
	"ease-in-quint": Fu(.755, .05, .855, .06),
	"ease-out-quint": Fu(.23, 1, .32, 1),
	"ease-in-out-quint": Fu(.86, 0, .07, 1),
	"ease-in-expo": Fu(.95, .05, .795, .035),
	"ease-out-expo": Fu(.19, 1, .22, 1),
	"ease-in-out-expo": Fu(1, 0, 0, 1),
	"ease-in-circ": Fu(.6, .04, .98, .335),
	"ease-out-circ": Fu(.075, .82, .165, 1),
	"ease-in-out-circ": Fu(.785, .135, .15, .86),
	spring: function(e, t, n) {
		if (n === 0) return Iu.linear;
		var r = Pu(e, t, n);
		return function(e, t, n) {
			return e + (t - e) * r(n);
		};
	},
	"cubic-bezier": Fu
};
function Lu(e, t, n, r, i) {
	if (r === 1 || t === n) return n;
	var a = i(t, n, r);
	return e == null ? a : ((e.roundValue || e.color) && (a = Math.round(a)), e.min !== void 0 && (a = Math.max(a, e.min)), e.max !== void 0 && (a = Math.min(a, e.max)), a);
}
function Ru(e, t) {
	return e.pfValue != null || e.value != null ? e.pfValue != null && (t == null || t.type.units !== "%") ? e.pfValue : e.value : e;
}
function zu(e, t, n, r, i) {
	var a = i == null ? null : i.type;
	n < 0 ? n = 0 : n > 1 && (n = 1);
	var o = Ru(e, i), s = Ru(t, i);
	if (B(o) && B(s)) return Lu(a, o, s, n, r);
	if (L(o) && L(s)) {
		for (var c = [], l = 0; l < s.length; l++) {
			var u = o[l], d = s[l];
			if (u != null && d != null) {
				var f = Lu(a, u, d, n, r);
				c.push(f);
			} else c.push(d);
		}
		return c;
	}
}
function Bu(e, t, n, r) {
	var i = !r, a = e._private, o = t._private, s = o.easing, c = o.startTime, l = (r ? e : e.cy()).style();
	if (!o.easingImpl) {
		if (s == null) o.easingImpl = Iu.linear;
		else {
			var u = F(s) ? l.parse("transition-timing-function", s).value : s, d, f;
			F(u) ? (d = u, f = []) : (d = u[1], f = u.slice(2).map(function(e) {
				return +e;
			})), f.length > 0 ? (d === "spring" && f.push(o.duration), o.easingImpl = Iu[d].apply(null, f)) : o.easingImpl = Iu[d];
		}
	}
	var p = o.easingImpl, m = o.duration === 0 ? 1 : (n - c) / o.duration;
	if (o.applying && (m = o.progress), m < 0 ? m = 0 : m > 1 && (m = 1), o.delay == null) {
		var h = o.startPosition, g = o.position;
		if (g && i && !e.locked()) {
			var _ = {};
			Vu(h.x, g.x) && (_.x = zu(h.x, g.x, m, p)), Vu(h.y, g.y) && (_.y = zu(h.y, g.y, m, p)), e.position(_);
		}
		var v = o.startPan, y = o.pan, b = a.pan, x = y != null && r;
		x && (Vu(v.x, y.x) && (b.x = zu(v.x, y.x, m, p)), Vu(v.y, y.y) && (b.y = zu(v.y, y.y, m, p)), e.emit("pan"));
		var S = o.startZoom, C = o.zoom, w = C != null && r;
		w && (Vu(S, C) && (a.zoom = tr(a.minZoom, zu(S, C, m, p), a.maxZoom)), e.emit("zoom")), (x || w) && e.emit("viewport");
		var T = o.style;
		if (T && T.length > 0 && i) {
			for (var E = 0; E < T.length; E++) {
				var D = T[E], O = D.name, k = D, A = o.startStyle[O], j = l.properties[A.name], M = zu(A, k, m, p, j);
				l.overrideBypass(e, O, M);
			}
			e.emit("style");
		}
	}
	return o.progress = m, m;
}
function Vu(e, t) {
	return e == null || t == null ? !1 : B(e) && B(t) ? !0 : !!(e && t);
}
function Hu(e, t, n, r) {
	var i = t._private;
	i.started = !0, i.startTime = n - i.progress * i.duration;
}
function Uu(e, t) {
	var n = t._private.aniEles, r = [];
	function i(t, n) {
		var i = t._private, a = i.animation.current, o = i.animation.queue, s = !1;
		if (a.length === 0) {
			var c = o.shift();
			c && a.push(c);
		}
		for (var l = function(e) {
			for (var t = e.length - 1; t >= 0; t--) {
				var n = e[t];
				n();
			}
			e.splice(0, e.length);
		}, u = a.length - 1; u >= 0; u--) {
			var d = a[u], f = d._private;
			if (f.stopped) {
				a.splice(u, 1), f.hooked = !1, f.playing = !1, f.started = !1, l(f.frames);
				continue;
			}
			(f.playing || f.applying) && (f.playing && f.applying && (f.applying = !1), f.started || Hu(t, d, e), Bu(t, d, e, n), f.applying &&= !1, l(f.frames), f.step != null && f.step(e), d.completed() && (a.splice(u, 1), f.hooked = !1, f.playing = !1, f.started = !1, l(f.completes)), s = !0);
		}
		return !n && a.length === 0 && o.length === 0 && r.push(t), s;
	}
	for (var a = !1, o = 0; o < n.length; o++) {
		var s = n[o], c = i(s);
		a ||= c;
	}
	var l = i(t, !0);
	(a || l) && (n.length > 0 ? t.notify("draw", n) : t.notify("draw")), n.unmerge(r), t.emit("step");
}
var Wu = {
	animate: Cc.animate(),
	animation: Cc.animation(),
	animated: Cc.animated(),
	clearQueue: Cc.clearQueue(),
	delay: Cc.delay(),
	delayAnimation: Cc.delayAnimation(),
	stop: Cc.stop(),
	addToAnimationPool: function(e) {
		var t = this;
		t.styleEnabled() && t._private.aniEles.merge(e);
	},
	stopAnimationLoop: function() {
		this._private.animationsRunning = !1;
	},
	startAnimationLoop: function() {
		var e = this;
		if (e._private.animationsRunning = !0, !e.styleEnabled()) return;
		function t() {
			e._private.animationsRunning && yt(function(n) {
				Uu(n, e), t();
			});
		}
		var n = e.renderer();
		n && n.beforeRender ? n.beforeRender(function(t, n) {
			Uu(n, e);
		}, n.beforeRenderPriorities.animations) : t();
	}
}, Gu = {
	qualifierCompare: function(e, t) {
		return e == null || t == null ? e == null && t == null : e.sameText(t);
	},
	eventMatches: function(e, t, n) {
		var r = t.qualifier;
		return r == null || e !== n.target && W(n.target) && r.matches(n.target);
	},
	addEventFields: function(e, t) {
		t.cy = e, t.target = e;
	},
	callbackContext: function(e, t, n) {
		return t.qualifier == null ? e : n.target;
	}
}, Ku = function(e) {
	return F(e) ? new Kc(e) : e;
}, qu = {
	createEmitter: function() {
		var e = this._private;
		return e.emitter ||= new Ql(Gu, this), this;
	},
	emitter: function() {
		return this._private.emitter;
	},
	on: function(e, t, n) {
		return this.emitter().on(e, Ku(t), n), this;
	},
	removeListener: function(e, t, n) {
		return this.emitter().removeListener(e, Ku(t), n), this;
	},
	removeAllListeners: function() {
		return this.emitter().removeAllListeners(), this;
	},
	one: function(e, t, n) {
		return this.emitter().one(e, Ku(t), n), this;
	},
	once: function(e, t, n) {
		return this.emitter().one(e, Ku(t), n), this;
	},
	emit: function(e, t) {
		return this.emitter().emit(e, t), this;
	},
	emitAndNotify: function(e, t) {
		return this.emit(e), this.notify(e, t), this;
	}
};
Cc.eventAliasesOn(qu);
var Ju = {
	png: function(e) {
		var t = this._private.renderer;
		return e ||= {}, t.png(e);
	},
	jpg: function(e) {
		var t = this._private.renderer;
		return e ||= {}, e.bg = e.bg || "#fff", t.jpg(e);
	}
};
Ju.jpeg = Ju.jpg;
var Yu = { layout: function(e) {
	var t = this;
	if (e == null) {
		Gt("Layout options must be specified to make a layout");
		return;
	}
	if (e.name == null) {
		Gt("A `name` must be specified to make a layout");
		return;
	}
	var n = e.name, r = t.extension("layout", n);
	if (r == null) {
		Gt("No such layout `" + n + "` found.  Did you forget to import it and `cytoscape.use()` it?");
		return;
	}
	return new r(Z({}, e, {
		cy: t,
		eles: F(e.eles) ? t.$(e.eles) : e.eles == null ? t.$() : e.eles
	}));
} };
Yu.createLayout = Yu.makeLayout = Yu.layout;
var Xu = {
	notify: function(e, t) {
		var n = this._private;
		if (this.batching()) {
			n.batchNotifications = n.batchNotifications || {};
			var r = n.batchNotifications[e] = n.batchNotifications[e] || this.collection();
			t != null && r.merge(t);
			return;
		}
		if (n.notificationsEnabled) {
			var i = this.renderer();
			!this.destroyed() && i && i.notify(e, t);
		}
	},
	notifications: function(e) {
		var t = this._private;
		return e === void 0 ? t.notificationsEnabled : (t.notificationsEnabled = !!e, this);
	},
	noNotifications: function(e) {
		this.notifications(!1), e(), this.notifications(!0);
	},
	batching: function() {
		return this._private.batchCount > 0;
	},
	startBatch: function() {
		var e = this._private;
		return e.batchCount ??= 0, e.batchCount === 0 && (e.batchStyleEles = this.collection(), e.batchNotifications = {}), e.batchCount++, this;
	},
	endBatch: function() {
		var e = this._private;
		if (e.batchCount === 0) return this;
		if (e.batchCount--, e.batchCount === 0) {
			e.batchStyleEles.updateStyle();
			var t = this.renderer();
			Object.keys(e.batchNotifications).forEach(function(n) {
				var r = e.batchNotifications[n];
				r.empty() ? t.notify(n) : t.notify(n, r);
			});
		}
		return this;
	},
	batch: function(e) {
		return this.startBatch(), e(), this.endBatch(), this;
	},
	batchData: function(e) {
		var t = this;
		return this.batch(function() {
			for (var n = Object.keys(e), r = 0; r < n.length; r++) {
				var i = n[r], a = e[i];
				t.getElementById(i).data(a);
			}
		});
	}
}, Zu = en({
	hideEdgesOnViewport: !1,
	textureOnViewport: !1,
	motionBlur: !1,
	motionBlurOpacity: .05,
	pixelRatio: void 0,
	desktopTapThreshold: 4,
	touchTapThreshold: 8,
	wheelSensitivity: 1,
	debug: !1,
	showFps: !1,
	webgl: !1,
	webglDebug: !1,
	webglDebugShowAtlases: !1,
	webglTexSize: 2048,
	webglTexRows: 36,
	webglTexRowsNodes: 18,
	webglBatchSize: 2048,
	webglTexPerBatch: 14,
	webglBgColor: [
		255,
		255,
		255
	]
}), Qu = {
	renderTo: function(e, t, n, r) {
		return this._private.renderer.renderTo(e, t, n, r), this;
	},
	renderer: function() {
		return this._private.renderer;
	},
	forceRender: function() {
		return this.notify("draw"), this;
	},
	resize: function() {
		return this.invalidateSize(), this.emitAndNotify("resize"), this;
	},
	initRenderer: function(e) {
		var t = this, n = t.extension("renderer", e.name);
		if (n == null) {
			Gt(`Can not initialise: No such renderer \`${e.name}\` found. Did you forget to import it and \`cytoscape.use()\` it?`);
			return;
		}
		e.wheelSensitivity !== void 0 && qt("You have set a custom wheel sensitivity.  This will make your app zoom unnaturally when using mainstream mice.  You should change this value from the default only if you can guarantee that all your users will use the same hardware and OS configuration as your current machine.");
		var r = Zu(e);
		r.cy = t, t._private.renderer = new n(r), this.notify("init");
	},
	destroyRenderer: function() {
		var e = this;
		e.notify("destroy");
		var t = e.container();
		if (t) for (t._cyreg = null; t.childNodes.length > 0;) t.removeChild(t.childNodes[0]);
		e._private.renderer = null, e.mutableElements().forEach(function(e) {
			var t = e._private;
			t.rscratch = {}, t.rstyle = {}, t.animation.current = [], t.animation.queue = [];
		});
	},
	onRender: function(e) {
		return this.on("render", e);
	},
	offRender: function(e) {
		return this.off("render", e);
	}
};
Qu.invalidateDimensions = Qu.resize;
var $u = {
	collection: function(e, t) {
		return F(e) ? this.$(e) : U(e) ? e.collection() : L(e) ? (t ||= {}, new Au(this, e, t.unique, t.removed)) : new Au(this);
	},
	nodes: function(e) {
		var t = this.$(function(e) {
			return e.isNode();
		});
		return e ? t.filter(e) : t;
	},
	edges: function(e) {
		var t = this.$(function(e) {
			return e.isEdge();
		});
		return e ? t.filter(e) : t;
	},
	$: function(e) {
		var t = this._private.elements;
		return e ? t.filter(e) : t.spawnSelf();
	},
	mutableElements: function() {
		return this._private.elements;
	}
};
$u.elements = $u.filter = $u.$;
var ed = {}, td = "t", nd = "f";
ed.apply = function(e) {
	for (var t = this, n = t._private.cy.collection(), r = 0; r < e.length; r++) {
		var i = e[r], a = t.getContextMeta(i);
		if (!a.empty) {
			var o = t.getContextStyle(a), s = t.applyContextStyle(a, o, i);
			i._private.appliedInitStyle ? t.updateTransitions(i, s.diffProps) : i._private.appliedInitStyle = !0, t.updateStyleHints(i) && n.push(i);
		}
	}
	return n;
}, ed.getPropertiesDiff = function(e, t) {
	var n = this, r = n._private.propDiffs = n._private.propDiffs || {}, i = e + "-" + t, a = r[i];
	if (a) return a;
	for (var o = [], s = {}, c = 0; c < n.length; c++) {
		var l = n[c], u = e[c] === td, d = t[c] === td, f = u !== d, p = l.mappedProperties.length > 0;
		if (f || d && p) {
			var m = void 0;
			f && p || f ? m = l.properties : p && (m = l.mappedProperties);
			for (var h = 0; h < m.length; h++) {
				for (var g = m[h], _ = g.name, v = !1, y = c + 1; y < n.length; y++) {
					var b = n[y];
					if (t[y] === td && (v = b.properties[g.name] != null, v)) break;
				}
				!s[_] && !v && (s[_] = !0, o.push(_));
			}
		}
	}
	return r[i] = o, o;
}, ed.getContextMeta = function(e) {
	for (var t = this, n = "", r, i = e._private.styleCxtKey || "", a = 0; a < t.length; a++) {
		var o = t[a];
		o.selector && o.selector.matches(e) ? n += td : n += nd;
	}
	return r = t.getPropertiesDiff(i, n), e._private.styleCxtKey = n, {
		key: n,
		diffPropNames: r,
		empty: r.length === 0
	};
}, ed.getContextStyle = function(e) {
	var t = e.key, n = this, r = this._private.contextStyles = this._private.contextStyles || {};
	if (r[t]) return r[t];
	for (var i = { _private: { key: t } }, a = 0; a < n.length; a++) {
		var o = n[a];
		if (t[a] === td) for (var s = 0; s < o.properties.length; s++) {
			var c = o.properties[s];
			i[c.name] = c;
		}
	}
	return r[t] = i, i;
}, ed.applyContextStyle = function(e, t, n) {
	for (var r = this, i = e.diffPropNames, a = {}, o = r.types, s = 0; s < i.length; s++) {
		var c = i[s], l = t[c], u = n.pstyle(c);
		if (!l) {
			if (u) l = u.bypass ? {
				name: c,
				deleteBypassed: !0
			} : {
				name: c,
				delete: !0
			};
			else continue;
		}
		if (u !== l) {
			if (l.mapped === o.fn && u != null && u.mapping != null && u.mapping.value === l.value) {
				var d = u.mapping;
				if ((d.fnValue = l.value(n)) === d.prevFnValue) continue;
			}
			var f = a[c] = { prev: u };
			r.applyParsedProperty(n, l), f.next = n.pstyle(c), f.next && f.next.bypass && (f.next = f.next.bypassed);
		}
	}
	return { diffProps: a };
}, ed.updateStyleHints = function(e) {
	var t = e._private, n = this, r = n.propertyGroupNames, i = n.propertyGroupKeys, a = function(e, t, r) {
		return n.getPropertiesHash(e, t, r);
	}, o = t.styleKey;
	if (e.removed()) return !1;
	var s = t.group === "nodes", c = e._private.style;
	r = Object.keys(c);
	for (var l = 0; l < i.length; l++) {
		var u = i[l];
		t.styleKeys[u] = [xt, Ct];
	}
	for (var d = function(e, n) {
		return t.styleKeys[n][0] = Tt(e, t.styleKeys[n][0]);
	}, f = function(e, n) {
		return t.styleKeys[n][1] = Et(e, t.styleKeys[n][1]);
	}, p = function(e, t) {
		d(e, t), f(e, t);
	}, m = function(e, t) {
		for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);
			d(r, t), f(r, t);
		}
	}, h = 2e9, g = function(e) {
		return -128 < e && e < 128 && Math.floor(e) !== e ? h - (e * 1024 | 0) : e;
	}, _ = 0; _ < r.length; _++) {
		var v = r[_], y = c[v];
		if (y != null) {
			var b = this.properties[v], x = b.type, S = b.groupKey, C = void 0;
			b.hashOverride == null ? y.pfValue != null && (C = y.pfValue) : C = b.hashOverride(e, y);
			var w = b.enums == null ? y.value : null, T = C != null, E = T || w != null, D = y.units;
			x.number && E && !x.multiple ? (p(g(T ? C : w), S), !T && D != null && m(D, S)) : m(y.strValue, S);
		}
	}
	for (var O = [xt, Ct], k = 0; k < i.length; k++) {
		var A = i[k], j = t.styleKeys[A];
		O[0] = Tt(j[0], O[0]), O[1] = Et(j[1], O[1]);
	}
	t.styleKey = Dt(O[0], O[1]);
	var M = t.styleKeys;
	t.labelDimsKey = Ot(M.labelDimensions);
	var N = a(e, ["label"], M.labelDimensions);
	if (t.labelKey = Ot(N), t.labelStyleKey = Ot(kt(M.commonLabel, N)), !s) {
		var P = a(e, ["source-label"], M.labelDimensions);
		t.sourceLabelKey = Ot(P), t.sourceLabelStyleKey = Ot(kt(M.commonLabel, P));
		var F = a(e, ["target-label"], M.labelDimensions);
		t.targetLabelKey = Ot(F), t.targetLabelStyleKey = Ot(kt(M.commonLabel, F));
	}
	if (s) {
		var I = t.styleKeys, L = I.nodeBody, R = I.nodeBorder, z = I.nodeOutline, B = I.backgroundImage, V = I.compound, H = I.pie, U = I.stripe;
		t.nodeKey = Ot([
			L,
			R,
			z,
			B,
			V,
			H,
			U
		].filter(function(e) {
			return e != null;
		}).reduce(kt, [xt, Ct])), t.hasPie = H != null && H[0] !== xt && H[1] !== Ct, t.hasStripe = U != null && U[0] !== xt && U[1] !== Ct;
	}
	return o !== t.styleKey;
}, ed.clearStyleHints = function(e) {
	var t = e._private;
	t.styleCxtKey = "", t.styleKeys = {}, t.styleKey = null, t.labelKey = null, t.labelStyleKey = null, t.sourceLabelKey = null, t.sourceLabelStyleKey = null, t.targetLabelKey = null, t.targetLabelStyleKey = null, t.nodeKey = null, t.hasPie = null, t.hasStripe = null;
}, ed.applyParsedProperty = function(e, t) {
	var n = this, r = t, i = e._private.style, a, o = n.types, s = n.properties[r.name].type, c = r.bypass, l = i[r.name], u = l && l.bypass, d = e._private, f = "mapping", p = function(e) {
		return e == null ? null : e.pfValue == null ? e.value : e.pfValue;
	}, m = function() {
		var t = p(l), i = p(r);
		n.checkTriggers(e, r.name, t, i);
	};
	if (t.name === "curve-style" && e.isEdge() && (t.value !== "bezier" && e.isLoop() || t.value === "haystack" && (e.source().isParent() || e.target().isParent())) && (r = t = this.parse(t.name, "bezier", c)), r.delete) return i[r.name] = void 0, m(), !0;
	if (r.deleteBypassed) return l ? l.bypass ? (l.bypassed = void 0, m(), !0) : !1 : (m(), !0);
	if (r.deleteBypass) return l ? l.bypass ? (i[r.name] = l.bypassed, m(), !0) : !1 : (m(), !0);
	var h = function() {
		qt("Do not assign mappings to elements without corresponding data (i.e. ele `" + e.id() + "` has no mapping for property `" + r.name + "` with data field `" + r.field + "`); try a `[" + r.field + "]` selector to limit scope to elements with `" + r.field + "` defined");
	};
	switch (r.mapped) {
		case o.mapData:
			for (var g = r.field.split("."), _ = d.data, v = 0; v < g.length && _; v++) {
				var y = g[v];
				_ = _[y];
			}
			if (_ == null) return h(), !1;
			var b;
			if (B(_)) {
				var x = r.fieldMax - r.fieldMin;
				b = x === 0 ? 0 : (_ - r.fieldMin) / x;
			} else return qt("Do not use continuous mappers without specifying numeric data (i.e. `" + r.field + ": " + _ + "` for `" + e.id() + "` is non-numeric)"), !1;
			if (b < 0 ? b = 0 : b > 1 && (b = 1), s.color) {
				var S = r.valueMin[0], C = r.valueMax[0], w = r.valueMin[1], T = r.valueMax[1], E = r.valueMin[2], D = r.valueMax[2], O = r.valueMin[3] == null ? 1 : r.valueMin[3], k = r.valueMax[3] == null ? 1 : r.valueMax[3], A = [
					Math.round(S + (C - S) * b),
					Math.round(w + (T - w) * b),
					Math.round(E + (D - E) * b),
					Math.round(O + (k - O) * b)
				];
				a = {
					bypass: r.bypass,
					name: r.name,
					value: A,
					strValue: "rgb(" + A[0] + ", " + A[1] + ", " + A[2] + ")"
				};
			} else if (s.number) {
				var j = r.valueMin + (r.valueMax - r.valueMin) * b;
				a = this.parse(r.name, j, r.bypass, f);
			} else return !1;
			if (!a) return h(), !1;
			a.mapping = r, r = a;
			break;
		case o.data:
			for (var M = r.field.split("."), N = d.data, P = 0; P < M.length && N; P++) {
				var F = M[P];
				N = N[F];
			}
			if (N != null && (a = this.parse(r.name, N, r.bypass, f)), !a) return h(), !1;
			a.mapping = r, r = a;
			break;
		case o.fn:
			var I = r.value, L = r.fnValue == null ? I(e) : r.fnValue;
			if (r.prevFnValue = L, L == null) return qt("Custom function mappers may not return null (i.e. `" + r.name + "` for ele `" + e.id() + "` is null)"), !1;
			if (a = this.parse(r.name, L, r.bypass, f), !a) return qt("Custom function mappers may not return invalid values for the property type (i.e. `" + r.name + "` for ele `" + e.id() + "` is invalid)"), !1;
			a.mapping = Yt(r), r = a;
			break;
		case void 0: break;
		default: return !1;
	}
	return c ? (u ? r.bypassed = l.bypassed : r.bypassed = l, i[r.name] = r) : u ? l.bypassed = r : i[r.name] = r, m(), !0;
}, ed.cleanElements = function(e, t) {
	for (var n = 0; n < e.length; n++) {
		var r = e[n];
		if (this.clearStyleHints(r), r.dirtyCompoundBoundsCache(), r.dirtyBoundingBoxCache(), !t) r._private.style = {};
		else for (var i = r._private.style, a = Object.keys(i), o = 0; o < a.length; o++) {
			var s = a[o], c = i[s];
			c != null && (c.bypass ? c.bypassed = null : i[s] = null);
		}
	}
}, ed.update = function() {
	this._private.cy.mutableElements().updateStyle();
}, ed.updateTransitions = function(e, t) {
	var n = this, r = e._private, i = e.pstyle("transition-property").value, a = e.pstyle("transition-duration").pfValue, o = e.pstyle("transition-delay").pfValue;
	if (i.length > 0 && a > 0) {
		for (var s = {}, c = !1, l = 0; l < i.length; l++) {
			var u = i[l], d = e.pstyle(u), f = t[u];
			if (f) {
				var p = f.prev, m = f.next == null ? d : f.next, h = !1, g = void 0, _ = 1e-6;
				p && (B(p.pfValue) && B(m.pfValue) ? (h = m.pfValue - p.pfValue, g = p.pfValue + _ * h) : B(p.value) && B(m.value) ? (h = m.value - p.value, g = p.value + _ * h) : L(p.value) && L(m.value) && (h = p.value[0] !== m.value[0] || p.value[1] !== m.value[1] || p.value[2] !== m.value[2], g = p.strValue), h && (s[u] = m.strValue, this.applyBypass(e, u, g), c = !0));
			}
		}
		if (!c) return;
		r.transitioning = !0, new Sa(function(t) {
			o > 0 ? e.delayAnimation(o).play().promise().then(t) : t();
		}).then(function() {
			return e.animation({
				style: s,
				duration: a,
				easing: e.pstyle("transition-timing-function").value,
				queue: !1
			}).play().promise();
		}).then(function() {
			n.removeBypasses(e, i), e.emitAndNotify("style"), r.transitioning = !1;
		});
	} else r.transitioning &&= (this.removeBypasses(e, i), e.emitAndNotify("style"), !1);
}, ed.checkTrigger = function(e, t, n, r, i, a) {
	var o = this.properties[t], s = i(o);
	e.removed() || s != null && s(n, r, e) && a(o);
}, ed.checkZOrderTrigger = function(e, t, n, r) {
	var i = this;
	this.checkTrigger(e, t, n, r, function(e) {
		return e.triggersZOrder;
	}, function() {
		i._private.cy.notify("zorder", e);
	});
}, ed.checkBoundsTrigger = function(e, t, n, r) {
	this.checkTrigger(e, t, n, r, function(e) {
		return e.triggersBounds;
	}, function(t) {
		e.dirtyCompoundBoundsCache(), e.dirtyBoundingBoxCache();
	});
}, ed.checkConnectedEdgesBoundsTrigger = function(e, t, n, r) {
	this.checkTrigger(e, t, n, r, function(e) {
		return e.triggersBoundsOfConnectedEdges;
	}, function(t) {
		e.connectedEdges().forEach(function(e) {
			e.dirtyBoundingBoxCache();
		});
	});
}, ed.checkParallelEdgesBoundsTrigger = function(e, t, n, r) {
	this.checkTrigger(e, t, n, r, function(e) {
		return e.triggersBoundsOfParallelEdges;
	}, function(t) {
		e.parallelEdges().forEach(function(e) {
			e.dirtyBoundingBoxCache();
		});
	});
}, ed.checkTriggers = function(e, t, n, r) {
	e.dirtyStyleCache(), this.checkZOrderTrigger(e, t, n, r), this.checkBoundsTrigger(e, t, n, r), this.checkConnectedEdgesBoundsTrigger(e, t, n, r), this.checkParallelEdgesBoundsTrigger(e, t, n, r);
};
var rd = {};
rd.applyBypass = function(e, t, n, r) {
	var i = this, a = [], o = !0;
	if (t === "*" || t === "**") {
		if (n !== void 0) for (var s = 0; s < i.properties.length; s++) {
			var c = i.properties[s].name, l = this.parse(c, n, !0);
			l && a.push(l);
		}
	} else if (F(t)) {
		var u = this.parse(t, n, !0);
		u && a.push(u);
	} else if (R(t)) {
		var d = t;
		r = n;
		for (var f = Object.keys(d), p = 0; p < f.length; p++) {
			var m = f[p], h = d[m];
			if (h === void 0 && (h = d[oe(m)]), h !== void 0) {
				var g = this.parse(m, h, !0);
				g && a.push(g);
			}
		}
	} else return !1;
	if (a.length === 0) return !1;
	for (var _ = !1, v = 0; v < e.length; v++) {
		for (var y = e[v], b = {}, x = void 0, S = 0; S < a.length; S++) {
			var C = a[S];
			if (r) {
				var w = y.pstyle(C.name);
				x = b[C.name] = { prev: w };
			}
			_ = this.applyParsedProperty(y, Yt(C)) || _, r && (x.next = y.pstyle(C.name));
		}
		_ && this.updateStyleHints(y), r && this.updateTransitions(y, b, o);
	}
	return _;
}, rd.overrideBypass = function(e, t, n) {
	t = ae(t);
	for (var r = 0; r < e.length; r++) {
		var i = e[r], a = i._private.style[t], o = this.properties[t].type, s = o.color, c = o.mutiple, l = a ? a.pfValue == null ? a.value : a.pfValue : null;
		!a || !a.bypass ? this.applyBypass(i, t, n) : (a.value = n, a.pfValue != null && (a.pfValue = n), a.strValue = s ? "rgb(" + n.join(",") + ")" : c ? n.join(" ") : "" + n, this.updateStyleHints(i)), this.checkTriggers(i, t, l, n);
	}
}, rd.removeAllBypasses = function(e, t) {
	return this.removeBypasses(e, this.propertyNames, t);
}, rd.removeBypasses = function(e, t, n) {
	for (var r = !0, i = 0; i < e.length; i++) {
		for (var a = e[i], o = {}, s = 0; s < t.length; s++) {
			var c = t[s], l = this.properties[c], u = a.pstyle(l.name);
			if (u && u.bypass) {
				var d = this.parse(c, "", !0), f = o[l.name] = { prev: u };
				this.applyParsedProperty(a, d), f.next = a.pstyle(l.name);
			}
		}
		this.updateStyleHints(a), n && this.updateTransitions(a, o, r);
	}
};
var id = {};
id.getEmSizeInPixels = function() {
	var e = this.containerCss("font-size");
	return e == null ? 1 : parseFloat(e);
}, id.containerCss = function(e) {
	var t = this._private.cy, n = t.container(), r = t.window();
	if (r && n && r.getComputedStyle) return r.getComputedStyle(n).getPropertyValue(e);
};
var ad = {};
ad.getRenderedStyle = function(e, t) {
	return t ? this.getStylePropertyValue(e, t, !0) : this.getRawStyle(e, !0);
}, ad.getRawStyle = function(e, t) {
	var n = this;
	if (e = e[0], e) {
		for (var r = {}, i = 0; i < n.properties.length; i++) {
			var a = n.properties[i], o = n.getStylePropertyValue(e, a.name, t);
			o != null && (r[a.name] = o, r[oe(a.name)] = o);
		}
		return r;
	}
}, ad.getIndexedStyle = function(e, t, n, r) {
	return e.pstyle(t)[n][r] ?? e.cy().style().getDefaultProperty(t)[n][0];
}, ad.getStylePropertyValue = function(e, t, n) {
	var r = this;
	if (e = e[0], e) {
		var i = r.properties[t];
		i.alias && (i = i.pointsTo);
		var a = i.type, o = e.pstyle(i.name);
		if (o) {
			var s = o.value, c = o.units, l = o.strValue;
			if (n && a.number && s != null && B(s)) {
				var u = e.cy().zoom(), d = function(e) {
					return e * u;
				}, f = function(e, t) {
					return d(e) + t;
				}, p = L(s);
				return (p ? c.every(function(e) {
					return e != null;
				}) : c != null) ? p ? s.map(function(e, t) {
					return f(e, c[t]);
				}).join(" ") : f(s, c) : p ? s.map(function(e) {
					return F(e) ? e : "" + d(e);
				}).join(" ") : "" + d(s);
			}
			if (l != null) return l;
		}
		return null;
	}
}, ad.getAnimationStartStyle = function(e, t) {
	for (var n = {}, r = 0; r < t.length; r++) {
		var i = t[r].name, a = e.pstyle(i);
		a !== void 0 && (a = R(a) ? this.parse(i, a.strValue) : this.parse(i, a)), a && (n[i] = a);
	}
	return n;
}, ad.getPropsList = function(e) {
	var t = this, n = [], r = e, i = t.properties;
	if (r) for (var a = Object.keys(r), o = 0; o < a.length; o++) {
		var s = a[o], c = r[s], l = i[s] || i[ae(s)], u = this.parse(l.name, c);
		u && n.push(u);
	}
	return n;
}, ad.getNonDefaultPropertiesHash = function(e, t, n) {
	for (var r = n.slice(), i, a, o, s, c = 0, l; c < t.length; c++) if (i = t[c], a = e.pstyle(i, !1), a != null) {
		if (a.pfValue != null) r[0] = Tt(s, r[0]), r[1] = Et(s, r[1]);
		else for (o = a.strValue, l = 0; l < o.length; l++) s = o.charCodeAt(l), r[0] = Tt(s, r[0]), r[1] = Et(s, r[1]);
	}
	return r;
}, ad.getPropertiesHash = ad.getNonDefaultPropertiesHash;
var od = {};
od.appendFromJson = function(e) {
	for (var t = this, n = 0; n < e.length; n++) {
		var r = e[n], i = r.selector, a = r.style || r.css, o = Object.keys(a);
		t.selector(i);
		for (var s = 0; s < o.length; s++) {
			var c = o[s], l = a[c];
			t.css(c, l);
		}
	}
	return t;
}, od.fromJson = function(e) {
	var t = this;
	return t.resetToDefault(), t.appendFromJson(e), t;
}, od.json = function() {
	for (var e = [], t = this.defaultLength; t < this.length; t++) {
		for (var n = this[t], r = n.selector, i = n.properties, a = {}, o = 0; o < i.length; o++) {
			var s = i[o];
			a[s.name] = s.strValue;
		}
		e.push({
			selector: r ? r.toString() : "core",
			style: a
		});
	}
	return e;
};
var sd = {};
sd.appendFromString = function(e) {
	var t = this, n = this, r = "" + e, i, a, o;
	r = r.replace(/[/][*](\s|.)+?[*][/]/g, "");
	function s() {
		r = r.length > i.length ? r.substr(i.length) : "";
	}
	function c() {
		a = a.length > o.length ? a.substr(o.length) : "";
	}
	for (; !r.match(/^\s*$/);) {
		var l = r.match(/^\s*((?:.|\s)+?)\s*\{((?:.|\s)+?)\}/);
		if (!l) {
			qt("Halting stylesheet parsing: String stylesheet contains more to parse but no selector and block found in: " + r);
			break;
		}
		i = l[0];
		var u = l[1];
		if (u !== "core" && new Kc(u).invalid) {
			qt("Skipping parsing of block: Invalid selector found in string stylesheet: " + u), s();
			continue;
		}
		var d = l[2], f = !1;
		a = d;
		for (var p = []; !a.match(/^\s*$/);) {
			var m = a.match(/^\s*(.+?)\s*:\s*(.+?)(?:\s*;|\s*$)/);
			if (!m) {
				qt("Skipping parsing of block: Invalid formatting of style property and value definitions found in:" + d), f = !0;
				break;
			}
			o = m[0];
			var h = m[1], g = m[2];
			if (!t.properties[h]) {
				qt("Skipping property: Invalid property name in: " + o), c();
				continue;
			}
			if (!n.parse(h, g)) {
				qt("Skipping property: Invalid property definition in: " + o), c();
				continue;
			}
			p.push({
				name: h,
				val: g
			}), c();
		}
		if (f) {
			s();
			break;
		}
		n.selector(u);
		for (var _ = 0; _ < p.length; _++) {
			var v = p[_];
			n.css(v.name, v.val);
		}
		s();
	}
	return n;
}, sd.fromString = function(e) {
	var t = this;
	return t.resetToDefault(), t.appendFromString(e), t;
};
var cd = {};
(function() {
	var e = ue, t = fe, n = me, r = he, i = X, a = function(e) {
		return "^" + e + "\\s*\\(\\s*([\\w\\.]+)\\s*\\)$";
	}, o = function(a) {
		var o = e + "|\\w+|" + t + "|" + n + "|" + r + "|" + i;
		return "^" + a + "\\s*\\(([\\w\\.]+)\\s*\\,\\s*(" + e + ")\\s*\\,\\s*(" + e + ")\\s*,\\s*(" + o + ")\\s*\\,\\s*(" + o + ")\\)$";
	}, s = [
		"^url\\s*\\(\\s*['\"]?(.+?)['\"]?\\s*\\)$",
		"^(none)$",
		"^(.+)$"
	];
	cd.types = {
		time: {
			number: !0,
			min: 0,
			units: "s|ms",
			implicitUnits: "ms"
		},
		percent: {
			number: !0,
			min: 0,
			max: 100,
			units: "%",
			implicitUnits: "%"
		},
		percentages: {
			number: !0,
			min: 0,
			max: 100,
			units: "%",
			implicitUnits: "%",
			multiple: !0
		},
		zeroOneNumber: {
			number: !0,
			min: 0,
			max: 1,
			unitless: !0
		},
		zeroOneNumbers: {
			number: !0,
			min: 0,
			max: 1,
			unitless: !0,
			multiple: !0
		},
		nOneOneNumber: {
			number: !0,
			min: -1,
			max: 1,
			unitless: !0
		},
		nonNegativeInt: {
			number: !0,
			min: 0,
			integer: !0,
			unitless: !0
		},
		nonNegativeNumber: {
			number: !0,
			min: 0,
			unitless: !0
		},
		position: { enums: ["parent", "origin"] },
		nodeSize: {
			number: !0,
			min: 0,
			enums: ["label"]
		},
		number: {
			number: !0,
			unitless: !0
		},
		numbers: {
			number: !0,
			unitless: !0,
			multiple: !0
		},
		positiveNumber: {
			number: !0,
			unitless: !0,
			min: 0,
			strictMin: !0
		},
		size: {
			number: !0,
			min: 0
		},
		bidirectionalSize: { number: !0 },
		bidirectionalSizeMaybePercent: {
			number: !0,
			allowPercent: !0
		},
		bidirectionalSizes: {
			number: !0,
			multiple: !0
		},
		sizeMaybePercent: {
			number: !0,
			min: 0,
			allowPercent: !0
		},
		axisDirection: { enums: [
			"horizontal",
			"leftward",
			"rightward",
			"vertical",
			"upward",
			"downward",
			"auto"
		] },
		axisDirectionExplicit: { enums: [
			"leftward",
			"rightward",
			"upward",
			"downward"
		] },
		axisDirectionPrimary: { enums: ["horizontal", "vertical"] },
		paddingRelativeTo: { enums: [
			"width",
			"height",
			"average",
			"min",
			"max"
		] },
		bgWH: {
			number: !0,
			min: 0,
			allowPercent: !0,
			enums: ["auto"],
			multiple: !0
		},
		bgPos: {
			number: !0,
			allowPercent: !0,
			multiple: !0
		},
		bgRelativeTo: {
			enums: ["inner", "include-padding"],
			multiple: !0
		},
		bgRepeat: {
			enums: [
				"repeat",
				"repeat-x",
				"repeat-y",
				"no-repeat"
			],
			multiple: !0
		},
		bgFit: {
			enums: [
				"none",
				"contain",
				"cover"
			],
			multiple: !0
		},
		bgCrossOrigin: {
			enums: [
				"anonymous",
				"use-credentials",
				"null"
			],
			multiple: !0
		},
		bgClip: {
			enums: ["none", "node"],
			multiple: !0
		},
		bgContainment: {
			enums: ["inside", "over"],
			multiple: !0
		},
		boxSelection: { enums: [
			"contain",
			"overlap",
			"none"
		] },
		color: { color: !0 },
		colors: {
			color: !0,
			multiple: !0
		},
		fill: { enums: [
			"solid",
			"linear-gradient",
			"radial-gradient"
		] },
		bool: { enums: ["yes", "no"] },
		bools: {
			enums: ["yes", "no"],
			multiple: !0
		},
		lineStyle: { enums: [
			"solid",
			"dotted",
			"dashed"
		] },
		lineCap: { enums: [
			"butt",
			"round",
			"square"
		] },
		linePosition: { enums: [
			"center",
			"inside",
			"outside"
		] },
		lineJoin: { enums: [
			"round",
			"bevel",
			"miter"
		] },
		borderStyle: { enums: [
			"solid",
			"dotted",
			"dashed",
			"double"
		] },
		curveStyle: { enums: [
			"bezier",
			"unbundled-bezier",
			"haystack",
			"segments",
			"straight",
			"straight-triangle",
			"taxi",
			"round-segments",
			"round-taxi"
		] },
		radiusType: {
			enums: ["arc-radius", "influence-radius"],
			multiple: !0
		},
		fontFamily: { regex: "^([\\w- \\\"]+(?:\\s*,\\s*[\\w- \\\"]+)*)$" },
		fontStyle: { enums: [
			"italic",
			"normal",
			"oblique"
		] },
		fontWeight: { enums: [
			"normal",
			"bold",
			"bolder",
			"lighter",
			"100",
			"200",
			"300",
			"400",
			"500",
			"600",
			"800",
			"900",
			100,
			200,
			300,
			400,
			500,
			600,
			700,
			800,
			900
		] },
		textDecoration: { enums: [
			"none",
			"underline",
			"overline",
			"line-through"
		] },
		textTransform: { enums: [
			"none",
			"uppercase",
			"lowercase"
		] },
		textWrap: { enums: [
			"none",
			"wrap",
			"ellipsis"
		] },
		textOverflowWrap: { enums: ["whitespace", "anywhere"] },
		textBackgroundShape: { enums: [
			"rectangle",
			"roundrectangle",
			"round-rectangle",
			"circle"
		] },
		nodeShape: { enums: /* @__PURE__ */ "rectangle.roundrectangle.round-rectangle.cutrectangle.cut-rectangle.bottomroundrectangle.bottom-round-rectangle.barrel.ellipse.triangle.round-triangle.square.pentagon.round-pentagon.hexagon.round-hexagon.concavehexagon.concave-hexagon.heptagon.round-heptagon.octagon.round-octagon.tag.round-tag.star.diamond.round-diamond.vee.rhomboid.right-rhomboid.polygon".split(".") },
		overlayShape: { enums: [
			"roundrectangle",
			"round-rectangle",
			"ellipse"
		] },
		cornerRadius: {
			number: !0,
			min: 0,
			units: "px|em",
			implicitUnits: "px",
			enums: ["auto"]
		},
		compoundIncludeLabels: { enums: ["include", "exclude"] },
		arrowShape: { enums: [
			"tee",
			"triangle",
			"triangle-tee",
			"circle-triangle",
			"triangle-cross",
			"triangle-backcurve",
			"vee",
			"square",
			"circle",
			"diamond",
			"chevron",
			"none"
		] },
		arrowFill: { enums: ["filled", "hollow"] },
		arrowWidth: {
			number: !0,
			units: "%|px|em",
			implicitUnits: "px",
			enums: ["match-line"]
		},
		display: { enums: ["element", "none"] },
		visibility: { enums: ["hidden", "visible"] },
		zCompoundDepth: { enums: [
			"bottom",
			"orphan",
			"auto",
			"top"
		] },
		zIndexCompare: { enums: ["auto", "manual"] },
		valign: { enums: [
			"top",
			"top-inside",
			"center",
			"bottom",
			"bottom-inside"
		] },
		halign: { enums: [
			"left",
			"left-inside",
			"center",
			"right",
			"right-inside"
		] },
		justification: { enums: [
			"left",
			"center",
			"right",
			"auto"
		] },
		textMetrics: { enums: ["font", "glyph"] },
		text: { string: !0 },
		data: {
			mapping: !0,
			regex: a("data")
		},
		layoutData: {
			mapping: !0,
			regex: a("layoutData")
		},
		scratch: {
			mapping: !0,
			regex: a("scratch")
		},
		mapData: {
			mapping: !0,
			regex: o("mapData")
		},
		mapLayoutData: {
			mapping: !0,
			regex: o("mapLayoutData")
		},
		mapScratch: {
			mapping: !0,
			regex: o("mapScratch")
		},
		fn: {
			mapping: !0,
			fn: !0
		},
		url: {
			regexes: s,
			singleRegexMatchValue: !0
		},
		urls: {
			regexes: s,
			singleRegexMatchValue: !0,
			multiple: !0
		},
		propList: { propList: !0 },
		angle: {
			number: !0,
			units: "deg|rad",
			implicitUnits: "rad"
		},
		textRotation: {
			number: !0,
			units: "deg|rad",
			implicitUnits: "rad",
			enums: ["none", "autorotate"]
		},
		polygonPointList: {
			number: !0,
			multiple: !0,
			evenMultiple: !0,
			min: -1,
			max: 1,
			unitless: !0
		},
		edgeDistances: { enums: [
			"intersection",
			"node-position",
			"endpoints"
		] },
		edgeEndpoint: {
			number: !0,
			multiple: !0,
			units: "%|px|em|deg|rad",
			implicitUnits: "px",
			enums: [
				"inside-to-node",
				"outside-to-node",
				"outside-to-node-or-label",
				"outside-to-line",
				"outside-to-line-or-label"
			],
			singleEnum: !0,
			validate: function(e, t) {
				switch (e.length) {
					case 2: return t[0] !== "deg" && t[0] !== "rad" && t[1] !== "deg" && t[1] !== "rad";
					case 1: return F(e[0]) || t[0] === "deg" || t[0] === "rad";
					default: return !1;
				}
			}
		},
		easing: {
			regexes: ["^(spring)\\s*\\(\\s*(" + e + ")\\s*,\\s*(" + e + ")\\s*\\)$", "^(cubic-bezier)\\s*\\(\\s*(" + e + ")\\s*,\\s*(" + e + ")\\s*,\\s*(" + e + ")\\s*,\\s*(" + e + ")\\s*\\)$"],
			enums: /* @__PURE__ */ "linear.ease.ease-in.ease-out.ease-in-out.ease-in-sine.ease-out-sine.ease-in-out-sine.ease-in-quad.ease-out-quad.ease-in-out-quad.ease-in-cubic.ease-out-cubic.ease-in-out-cubic.ease-in-quart.ease-out-quart.ease-in-out-quart.ease-in-quint.ease-out-quint.ease-in-out-quint.ease-in-expo.ease-out-expo.ease-in-out-expo.ease-in-circ.ease-out-circ.ease-in-out-circ".split(".")
		},
		gradientDirection: { enums: [
			"to-bottom",
			"to-top",
			"to-left",
			"to-right",
			"to-bottom-right",
			"to-bottom-left",
			"to-top-right",
			"to-top-left",
			"to-right-bottom",
			"to-left-bottom",
			"to-right-top",
			"to-left-top"
		] },
		boundsExpansion: {
			number: !0,
			multiple: !0,
			min: 0,
			validate: function(e) {
				var t = e.length;
				return t === 1 || t === 2 || t === 4;
			}
		}
	};
	var c = {
		zeroNonZero: function(e, t) {
			return (e == null || t == null) && e !== t || e == 0 && t != 0 || e != 0 && t == 0;
		},
		any: function(e, t) {
			return e != t;
		},
		emptyNonEmpty: function(e, t) {
			var n = J(e), r = J(t);
			return n && !r || !n && r;
		}
	}, l = cd.types, u = [
		{
			name: "label",
			type: l.text,
			triggersBounds: c.any,
			triggersZOrder: c.emptyNonEmpty
		},
		{
			name: "text-rotation",
			type: l.textRotation,
			triggersBounds: c.any
		},
		{
			name: "text-margin-x",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "text-margin-y",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		}
	], d = [
		{
			name: "source-label",
			type: l.text,
			triggersBounds: c.any
		},
		{
			name: "source-text-rotation",
			type: l.textRotation,
			triggersBounds: c.any
		},
		{
			name: "source-text-margin-x",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "source-text-margin-y",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "source-text-offset",
			type: l.size,
			triggersBounds: c.any
		}
	], f = [
		{
			name: "target-label",
			type: l.text,
			triggersBounds: c.any
		},
		{
			name: "target-text-rotation",
			type: l.textRotation,
			triggersBounds: c.any
		},
		{
			name: "target-text-margin-x",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "target-text-margin-y",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "target-text-offset",
			type: l.size,
			triggersBounds: c.any
		}
	], p = [
		{
			name: "font-family",
			type: l.fontFamily,
			triggersBounds: c.any
		},
		{
			name: "font-style",
			type: l.fontStyle,
			triggersBounds: c.any
		},
		{
			name: "font-weight",
			type: l.fontWeight,
			triggersBounds: c.any
		},
		{
			name: "font-size",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "text-transform",
			type: l.textTransform,
			triggersBounds: c.any
		},
		{
			name: "text-wrap",
			type: l.textWrap,
			triggersBounds: c.any
		},
		{
			name: "text-overflow-wrap",
			type: l.textOverflowWrap,
			triggersBounds: c.any
		},
		{
			name: "text-max-width",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "text-outline-width",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "line-height",
			type: l.positiveNumber,
			triggersBounds: c.any
		}
	], m = [
		{
			name: "text-valign",
			type: l.valign,
			triggersBounds: c.any
		},
		{
			name: "text-halign",
			type: l.halign,
			triggersBounds: c.any
		},
		{
			name: "color",
			type: l.color
		},
		{
			name: "text-outline-color",
			type: l.color
		},
		{
			name: "text-outline-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "text-background-color",
			type: l.color
		},
		{
			name: "text-background-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "text-background-padding",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "text-border-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "text-border-color",
			type: l.color
		},
		{
			name: "text-border-width",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "text-border-style",
			type: l.borderStyle,
			triggersBounds: c.any
		},
		{
			name: "text-background-shape",
			type: l.textBackgroundShape,
			triggersBounds: c.any
		},
		{
			name: "text-justification",
			type: l.justification
		},
		{
			name: "text-metrics",
			type: l.textMetrics
		},
		{
			name: "box-select-labels",
			type: l.bool,
			triggersBounds: c.any
		}
	], h = [
		{
			name: "events",
			type: l.bool,
			triggersZOrder: c.any
		},
		{
			name: "text-events",
			type: l.bool,
			triggersZOrder: c.any
		},
		{
			name: "box-selection",
			type: l.boxSelection,
			triggersZOrder: c.any
		}
	], g = [
		{
			name: "display",
			type: l.display,
			triggersZOrder: c.any,
			triggersBounds: c.any,
			triggersBoundsOfConnectedEdges: c.any,
			triggersBoundsOfParallelEdges: function(e, t, n) {
				return e !== t && n.pstyle("curve-style").value === "bezier";
			}
		},
		{
			name: "visibility",
			type: l.visibility,
			triggersZOrder: c.any
		},
		{
			name: "opacity",
			type: l.zeroOneNumber,
			triggersZOrder: c.zeroNonZero
		},
		{
			name: "text-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "min-zoomed-font-size",
			type: l.size
		},
		{
			name: "z-compound-depth",
			type: l.zCompoundDepth,
			triggersZOrder: c.any
		},
		{
			name: "z-index-compare",
			type: l.zIndexCompare,
			triggersZOrder: c.any
		},
		{
			name: "z-index",
			type: l.number,
			triggersZOrder: c.any
		}
	], _ = [
		{
			name: "overlay-padding",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "overlay-color",
			type: l.color
		},
		{
			name: "overlay-opacity",
			type: l.zeroOneNumber,
			triggersBounds: c.zeroNonZero
		},
		{
			name: "overlay-shape",
			type: l.overlayShape,
			triggersBounds: c.any
		},
		{
			name: "overlay-corner-radius",
			type: l.cornerRadius
		}
	], v = [
		{
			name: "underlay-padding",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "underlay-color",
			type: l.color
		},
		{
			name: "underlay-opacity",
			type: l.zeroOneNumber,
			triggersBounds: c.zeroNonZero
		},
		{
			name: "underlay-shape",
			type: l.overlayShape,
			triggersBounds: c.any
		},
		{
			name: "underlay-corner-radius",
			type: l.cornerRadius
		}
	], y = [
		{
			name: "transition-property",
			type: l.propList
		},
		{
			name: "transition-duration",
			type: l.time
		},
		{
			name: "transition-delay",
			type: l.time
		},
		{
			name: "transition-timing-function",
			type: l.easing
		}
	], b = function(e, t) {
		return t.value === "label" ? -e.poolIndex() : t.pfValue;
	}, x = [
		{
			name: "height",
			type: l.nodeSize,
			triggersBounds: c.any,
			hashOverride: b
		},
		{
			name: "width",
			type: l.nodeSize,
			triggersBounds: c.any,
			hashOverride: b
		},
		{
			name: "shape",
			type: l.nodeShape,
			triggersBounds: c.any
		},
		{
			name: "shape-polygon-points",
			type: l.polygonPointList,
			triggersBounds: c.any
		},
		{
			name: "corner-radius",
			type: l.cornerRadius
		},
		{
			name: "background-color",
			type: l.color
		},
		{
			name: "background-fill",
			type: l.fill
		},
		{
			name: "background-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "background-blacken",
			type: l.nOneOneNumber
		},
		{
			name: "background-gradient-stop-colors",
			type: l.colors
		},
		{
			name: "background-gradient-stop-positions",
			type: l.percentages
		},
		{
			name: "background-gradient-direction",
			type: l.gradientDirection
		},
		{
			name: "padding",
			type: l.sizeMaybePercent,
			triggersBounds: c.any
		},
		{
			name: "padding-relative-to",
			type: l.paddingRelativeTo,
			triggersBounds: c.any
		},
		{
			name: "bounds-expansion",
			type: l.boundsExpansion,
			triggersBounds: c.any
		}
	], S = [
		{
			name: "border-color",
			type: l.color
		},
		{
			name: "border-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "border-width",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "border-style",
			type: l.borderStyle
		},
		{
			name: "border-cap",
			type: l.lineCap
		},
		{
			name: "border-join",
			type: l.lineJoin
		},
		{
			name: "border-dash-pattern",
			type: l.numbers
		},
		{
			name: "border-dash-offset",
			type: l.number
		},
		{
			name: "border-position",
			type: l.linePosition
		}
	], C = [
		{
			name: "outline-color",
			type: l.color
		},
		{
			name: "outline-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "outline-width",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "outline-style",
			type: l.borderStyle
		},
		{
			name: "outline-offset",
			type: l.size,
			triggersBounds: c.any
		}
	], w = [
		{
			name: "background-image",
			type: l.urls
		},
		{
			name: "background-image-crossorigin",
			type: l.bgCrossOrigin
		},
		{
			name: "background-image-opacity",
			type: l.zeroOneNumbers
		},
		{
			name: "background-image-containment",
			type: l.bgContainment
		},
		{
			name: "background-image-smoothing",
			type: l.bools
		},
		{
			name: "background-position-x",
			type: l.bgPos
		},
		{
			name: "background-position-y",
			type: l.bgPos
		},
		{
			name: "background-width-relative-to",
			type: l.bgRelativeTo
		},
		{
			name: "background-height-relative-to",
			type: l.bgRelativeTo
		},
		{
			name: "background-repeat",
			type: l.bgRepeat
		},
		{
			name: "background-fit",
			type: l.bgFit
		},
		{
			name: "background-clip",
			type: l.bgClip
		},
		{
			name: "background-width",
			type: l.bgWH
		},
		{
			name: "background-height",
			type: l.bgWH
		},
		{
			name: "background-offset-x",
			type: l.bgPos
		},
		{
			name: "background-offset-y",
			type: l.bgPos
		}
	], T = [
		{
			name: "position",
			type: l.position,
			triggersBounds: c.any
		},
		{
			name: "compound-sizing-wrt-labels",
			type: l.compoundIncludeLabels,
			triggersBounds: c.any
		},
		{
			name: "min-width",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "min-width-bias-left",
			type: l.sizeMaybePercent,
			triggersBounds: c.any
		},
		{
			name: "min-width-bias-right",
			type: l.sizeMaybePercent,
			triggersBounds: c.any
		},
		{
			name: "min-height",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "min-height-bias-top",
			type: l.sizeMaybePercent,
			triggersBounds: c.any
		},
		{
			name: "min-height-bias-bottom",
			type: l.sizeMaybePercent,
			triggersBounds: c.any
		}
	], E = [
		{
			name: "line-style",
			type: l.lineStyle
		},
		{
			name: "line-color",
			type: l.color
		},
		{
			name: "line-fill",
			type: l.fill
		},
		{
			name: "line-cap",
			type: l.lineCap
		},
		{
			name: "line-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "line-dash-pattern",
			type: l.numbers
		},
		{
			name: "line-dash-offset",
			type: l.number
		},
		{
			name: "line-outline-width",
			type: l.size
		},
		{
			name: "line-outline-color",
			type: l.color
		},
		{
			name: "line-gradient-stop-colors",
			type: l.colors
		},
		{
			name: "line-gradient-stop-positions",
			type: l.percentages
		},
		{
			name: "curve-style",
			type: l.curveStyle,
			triggersBounds: c.any,
			triggersBoundsOfParallelEdges: function(e, t) {
				return e === t ? !1 : e === "bezier" || t === "bezier";
			}
		},
		{
			name: "haystack-radius",
			type: l.zeroOneNumber,
			triggersBounds: c.any
		},
		{
			name: "source-endpoint",
			type: l.edgeEndpoint,
			triggersBounds: c.any
		},
		{
			name: "target-endpoint",
			type: l.edgeEndpoint,
			triggersBounds: c.any
		},
		{
			name: "control-point-step-size",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "control-point-distances",
			type: l.bidirectionalSizes,
			triggersBounds: c.any
		},
		{
			name: "control-point-weights",
			type: l.numbers,
			triggersBounds: c.any
		},
		{
			name: "segment-distances",
			type: l.bidirectionalSizes,
			triggersBounds: c.any
		},
		{
			name: "segment-weights",
			type: l.numbers,
			triggersBounds: c.any
		},
		{
			name: "segment-radii",
			type: l.numbers,
			triggersBounds: c.any
		},
		{
			name: "radius-type",
			type: l.radiusType,
			triggersBounds: c.any
		},
		{
			name: "taxi-turn",
			type: l.bidirectionalSizeMaybePercent,
			triggersBounds: c.any
		},
		{
			name: "taxi-turn-min-distance",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "taxi-direction",
			type: l.axisDirection,
			triggersBounds: c.any
		},
		{
			name: "taxi-radius",
			type: l.number,
			triggersBounds: c.any
		},
		{
			name: "edge-distances",
			type: l.edgeDistances,
			triggersBounds: c.any
		},
		{
			name: "arrow-scale",
			type: l.positiveNumber,
			triggersBounds: c.any
		},
		{
			name: "loop-direction",
			type: l.angle,
			triggersBounds: c.any
		},
		{
			name: "loop-sweep",
			type: l.angle,
			triggersBounds: c.any
		},
		{
			name: "source-distance-from-node",
			type: l.size,
			triggersBounds: c.any
		},
		{
			name: "target-distance-from-node",
			type: l.size,
			triggersBounds: c.any
		}
	], D = [
		{
			name: "ghost",
			type: l.bool,
			triggersBounds: c.any
		},
		{
			name: "ghost-offset-x",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "ghost-offset-y",
			type: l.bidirectionalSize,
			triggersBounds: c.any
		},
		{
			name: "ghost-opacity",
			type: l.zeroOneNumber
		}
	], O = [
		{
			name: "selection-box-color",
			type: l.color
		},
		{
			name: "selection-box-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "selection-box-border-color",
			type: l.color
		},
		{
			name: "selection-box-border-width",
			type: l.size
		},
		{
			name: "active-bg-color",
			type: l.color
		},
		{
			name: "active-bg-opacity",
			type: l.zeroOneNumber
		},
		{
			name: "active-bg-size",
			type: l.size
		},
		{
			name: "outside-texture-bg-color",
			type: l.color
		},
		{
			name: "outside-texture-bg-opacity",
			type: l.zeroOneNumber
		}
	], k = [];
	cd.pieBackgroundN = 16, k.push({
		name: "pie-size",
		type: l.sizeMaybePercent
	}), k.push({
		name: "pie-hole",
		type: l.sizeMaybePercent
	}), k.push({
		name: "pie-start-angle",
		type: l.angle
	});
	for (var A = 1; A <= cd.pieBackgroundN; A++) k.push({
		name: "pie-" + A + "-background-color",
		type: l.color
	}), k.push({
		name: "pie-" + A + "-background-size",
		type: l.percent
	}), k.push({
		name: "pie-" + A + "-background-opacity",
		type: l.zeroOneNumber
	});
	var j = [];
	cd.stripeBackgroundN = 16, j.push({
		name: "stripe-size",
		type: l.sizeMaybePercent
	}), j.push({
		name: "stripe-direction",
		type: l.axisDirectionPrimary
	});
	for (var M = 1; M <= cd.stripeBackgroundN; M++) j.push({
		name: "stripe-" + M + "-background-color",
		type: l.color
	}), j.push({
		name: "stripe-" + M + "-background-size",
		type: l.percent
	}), j.push({
		name: "stripe-" + M + "-background-opacity",
		type: l.zeroOneNumber
	});
	var N = [], P = cd.arrowPrefixes = [
		"source",
		"mid-source",
		"target",
		"mid-target"
	];
	[
		{
			name: "arrow-shape",
			type: l.arrowShape,
			triggersBounds: c.any
		},
		{
			name: "arrow-color",
			type: l.color
		},
		{
			name: "arrow-fill",
			type: l.arrowFill
		},
		{
			name: "arrow-width",
			type: l.arrowWidth
		}
	].forEach(function(e) {
		P.forEach(function(t) {
			var n = t + "-" + e.name, r = e.type, i = e.triggersBounds;
			N.push({
				name: n,
				type: r,
				triggersBounds: i
			});
		});
	}, {});
	var I = cd.properties = [].concat(h, y, g, _, v, D, m, p, u, d, f, x, S, C, w, k, j, T, E, N, O), L = cd.propertyGroups = {
		behavior: h,
		transition: y,
		visibility: g,
		overlay: _,
		underlay: v,
		ghost: D,
		commonLabel: m,
		labelDimensions: p,
		mainLabel: u,
		sourceLabel: d,
		targetLabel: f,
		nodeBody: x,
		nodeBorder: S,
		nodeOutline: C,
		backgroundImage: w,
		pie: k,
		stripe: j,
		compound: T,
		edgeLine: E,
		edgeArrow: N,
		core: O
	}, R = cd.propertyGroupNames = {};
	(cd.propertyGroupKeys = Object.keys(L)).forEach(function(e) {
		R[e] = L[e].map(function(e) {
			return e.name;
		}), L[e].forEach(function(t) {
			return t.groupKey = e;
		});
	});
	var z = cd.aliases = [
		{
			name: "content",
			pointsTo: "label"
		},
		{
			name: "control-point-distance",
			pointsTo: "control-point-distances"
		},
		{
			name: "control-point-weight",
			pointsTo: "control-point-weights"
		},
		{
			name: "segment-distance",
			pointsTo: "segment-distances"
		},
		{
			name: "segment-weight",
			pointsTo: "segment-weights"
		},
		{
			name: "segment-radius",
			pointsTo: "segment-radii"
		},
		{
			name: "edge-text-rotation",
			pointsTo: "text-rotation"
		},
		{
			name: "padding-left",
			pointsTo: "padding"
		},
		{
			name: "padding-right",
			pointsTo: "padding"
		},
		{
			name: "padding-top",
			pointsTo: "padding"
		},
		{
			name: "padding-bottom",
			pointsTo: "padding"
		}
	];
	cd.propertyNames = I.map(function(e) {
		return e.name;
	});
	for (var B = 0; B < I.length; B++) {
		var V = I[B];
		I[V.name] = V;
	}
	for (var H = 0; H < z.length; H++) {
		var U = z[H], W = I[U.pointsTo], G = {
			name: U.name,
			alias: !0,
			pointsTo: W
		};
		I.push(G), I[U.name] = G;
	}
})(), cd.getDefaultProperty = function(e) {
	return this.getDefaultProperties()[e];
}, cd.getDefaultProperties = function() {
	var e = this._private;
	if (e.defaultProperties != null) return e.defaultProperties;
	for (var t = Z({
		"selection-box-color": "#ddd",
		"selection-box-opacity": .65,
		"selection-box-border-color": "#aaa",
		"selection-box-border-width": 1,
		"active-bg-color": "black",
		"active-bg-opacity": .15,
		"active-bg-size": 30,
		"outside-texture-bg-color": "#000",
		"outside-texture-bg-opacity": .125,
		events: "yes",
		"text-events": "no",
		"text-valign": "top",
		"text-halign": "center",
		"text-justification": "auto",
		"line-height": 1,
		color: "#000",
		"box-selection": "contain",
		"text-outline-color": "#000",
		"text-outline-width": 0,
		"text-outline-opacity": 1,
		"text-opacity": 1,
		"text-decoration": "none",
		"text-transform": "none",
		"text-wrap": "none",
		"text-overflow-wrap": "whitespace",
		"text-max-width": 9999,
		"text-background-color": "#000",
		"text-background-opacity": 0,
		"text-background-shape": "rectangle",
		"text-background-padding": 0,
		"text-border-opacity": 0,
		"text-border-width": 0,
		"text-border-style": "solid",
		"text-border-color": "#000",
		"font-family": "Helvetica Neue, Helvetica, sans-serif",
		"font-style": "normal",
		"font-weight": "normal",
		"font-size": 16,
		"min-zoomed-font-size": 0,
		"text-rotation": "none",
		"source-text-rotation": "none",
		"target-text-rotation": "none",
		visibility: "visible",
		display: "element",
		opacity: 1,
		"z-compound-depth": "auto",
		"z-index-compare": "auto",
		"z-index": 0,
		label: "",
		"text-margin-x": 0,
		"text-margin-y": 0,
		"source-label": "",
		"source-text-offset": 0,
		"source-text-margin-x": 0,
		"source-text-margin-y": 0,
		"target-label": "",
		"target-text-offset": 0,
		"target-text-margin-x": 0,
		"target-text-margin-y": 0,
		"overlay-opacity": 0,
		"overlay-color": "#000",
		"overlay-padding": 10,
		"overlay-shape": "round-rectangle",
		"overlay-corner-radius": "auto",
		"underlay-opacity": 0,
		"underlay-color": "#000",
		"underlay-padding": 10,
		"underlay-shape": "round-rectangle",
		"underlay-corner-radius": "auto",
		"text-metrics": "font",
		"transition-property": "none",
		"transition-duration": 0,
		"transition-delay": 0,
		"transition-timing-function": "linear",
		"box-select-labels": "no",
		"background-blacken": 0,
		"background-color": "#999",
		"background-fill": "solid",
		"background-opacity": 1,
		"background-image": "none",
		"background-image-crossorigin": "anonymous",
		"background-image-opacity": 1,
		"background-image-containment": "inside",
		"background-image-smoothing": "yes",
		"background-position-x": "50%",
		"background-position-y": "50%",
		"background-offset-x": 0,
		"background-offset-y": 0,
		"background-width-relative-to": "include-padding",
		"background-height-relative-to": "include-padding",
		"background-repeat": "no-repeat",
		"background-fit": "none",
		"background-clip": "node",
		"background-width": "auto",
		"background-height": "auto",
		"border-color": "#000",
		"border-opacity": 1,
		"border-width": 0,
		"border-style": "solid",
		"border-dash-pattern": [4, 2],
		"border-dash-offset": 0,
		"border-cap": "butt",
		"border-join": "miter",
		"border-position": "center",
		"outline-color": "#999",
		"outline-opacity": 1,
		"outline-width": 0,
		"outline-offset": 0,
		"outline-style": "solid",
		height: 30,
		width: 30,
		shape: "ellipse",
		"shape-polygon-points": "-1, -1,   1, -1,   1, 1,   -1, 1",
		"corner-radius": "auto",
		"bounds-expansion": 0,
		"background-gradient-direction": "to-bottom",
		"background-gradient-stop-colors": "#999",
		"background-gradient-stop-positions": "0%",
		ghost: "no",
		"ghost-offset-y": 0,
		"ghost-offset-x": 0,
		"ghost-opacity": 0,
		padding: 0,
		"padding-relative-to": "width",
		position: "origin",
		"compound-sizing-wrt-labels": "include",
		"min-width": 0,
		"min-width-bias-left": 0,
		"min-width-bias-right": 0,
		"min-height": 0,
		"min-height-bias-top": 0,
		"min-height-bias-bottom": 0
	}, {
		"pie-size": "100%",
		"pie-hole": 0,
		"pie-start-angle": "0deg"
	}, [
		{
			name: "pie-{{i}}-background-color",
			value: "black"
		},
		{
			name: "pie-{{i}}-background-size",
			value: "0%"
		},
		{
			name: "pie-{{i}}-background-opacity",
			value: 1
		}
	].reduce(function(e, t) {
		for (var n = 1; n <= cd.pieBackgroundN; n++) {
			var r = t.name.replace("{{i}}", n);
			e[r] = t.value;
		}
		return e;
	}, {}), {
		"stripe-size": "100%",
		"stripe-direction": "horizontal"
	}, [
		{
			name: "stripe-{{i}}-background-color",
			value: "black"
		},
		{
			name: "stripe-{{i}}-background-size",
			value: "0%"
		},
		{
			name: "stripe-{{i}}-background-opacity",
			value: 1
		}
	].reduce(function(e, t) {
		for (var n = 1; n <= cd.stripeBackgroundN; n++) {
			var r = t.name.replace("{{i}}", n);
			e[r] = t.value;
		}
		return e;
	}, {}), {
		"line-style": "solid",
		"line-color": "#999",
		"line-fill": "solid",
		"line-cap": "butt",
		"line-opacity": 1,
		"line-outline-width": 0,
		"line-outline-color": "#000",
		"line-gradient-stop-colors": "#999",
		"line-gradient-stop-positions": "0%",
		"control-point-step-size": 40,
		"control-point-weights": .5,
		"segment-weights": .5,
		"segment-distances": 20,
		"segment-radii": 15,
		"radius-type": "arc-radius",
		"taxi-turn": "50%",
		"taxi-radius": 15,
		"taxi-turn-min-distance": 10,
		"taxi-direction": "auto",
		"edge-distances": "intersection",
		"curve-style": "haystack",
		"haystack-radius": 0,
		"arrow-scale": 1,
		"loop-direction": "-45deg",
		"loop-sweep": "-90deg",
		"source-distance-from-node": 0,
		"target-distance-from-node": 0,
		"source-endpoint": "outside-to-node",
		"target-endpoint": "outside-to-node",
		"line-dash-pattern": [6, 3],
		"line-dash-offset": 0
	}, [
		{
			name: "arrow-shape",
			value: "none"
		},
		{
			name: "arrow-color",
			value: "#999"
		},
		{
			name: "arrow-fill",
			value: "filled"
		},
		{
			name: "arrow-width",
			value: 1
		}
	].reduce(function(e, t) {
		return cd.arrowPrefixes.forEach(function(n) {
			var r = n + "-" + t.name;
			e[r] = t.value;
		}), e;
	}, {})), n = {}, r = 0; r < this.properties.length; r++) {
		var i = this.properties[r];
		if (!i.pointsTo) {
			var a = i.name, o = t[a];
			n[a] = this.parse(a, o);
		}
	}
	return e.defaultProperties = n, e.defaultProperties;
}, cd.addDefaultStylesheet = function() {
	this.selector(":parent").css({
		shape: "rectangle",
		padding: 10,
		"background-color": "#eee",
		"border-color": "#ccc",
		"border-width": 1
	}).selector("edge").css({ width: 3 }).selector(":loop").css({ "curve-style": "bezier" }).selector("edge:compound").css({
		"curve-style": "bezier",
		"source-endpoint": "outside-to-line",
		"target-endpoint": "outside-to-line"
	}).selector(":selected").css({
		"background-color": "#0169D9",
		"line-color": "#0169D9",
		"source-arrow-color": "#0169D9",
		"target-arrow-color": "#0169D9",
		"mid-source-arrow-color": "#0169D9",
		"mid-target-arrow-color": "#0169D9"
	}).selector(":parent:selected").css({
		"background-color": "#CCE1F9",
		"border-color": "#aec8e5"
	}).selector(":active").css({
		"overlay-color": "black",
		"overlay-padding": 10,
		"overlay-opacity": .25
	}), this.defaultLength = this.length;
};
var ld = {};
ld.parse = function(e, t, n, r) {
	var i = this;
	if (I(t)) return i.parseImplWarn(e, t, n, r);
	var a = r === "mapping" || r === !0 || r === !1 || r == null ? "dontcare" : r, o = n ? "t" : "f", s = Mt(e, "" + t, o, a), c = i.propCache = i.propCache || [], l;
	return (l = c[s]) || (l = c[s] = i.parseImplWarn(e, t, n, r)), (n || r === "mapping") && (l = Yt(l), l && (l.value = Yt(l.value))), l;
}, ld.parseImplWarn = function(e, t, n, r) {
	var i = this.parseImpl(e, t, n, r);
	return !i && t != null && qt(`The style property \`${e}: ${t}\` is invalid`), i && (i.name === "width" || i.name === "height") && t === "label" && qt("The style value of `label` is deprecated for `" + i.name + "`"), i;
}, ld.parseImpl = function(e, t, n, r) {
	var i = this;
	e = ae(e);
	var a = i.properties[e], o = t, s = i.types;
	if (!a || t === void 0) return null;
	a.alias && (a = a.pointsTo, e = a.name);
	var c = F(t);
	c && (t = t.trim());
	var l = a.type;
	if (!l) return null;
	if (n && (t === "" || t === null)) return {
		name: e,
		value: t,
		bypass: !0,
		deleteBypass: !0
	};
	if (I(t)) return {
		name: e,
		value: t,
		strValue: "fn",
		mapped: s.fn,
		bypass: n
	};
	var u, d;
	if (!(!c || r || t.length < 7 || t[1] !== "a")) {
		if (t.length >= 7 && t[0] === "d" && (u = new RegExp(s.data.regex).exec(t))) {
			if (n) return !1;
			var f = s.data;
			return {
				name: e,
				value: u,
				strValue: "" + t,
				mapped: f,
				field: u[1],
				bypass: n
			};
		}
		if (t.length >= 10 && t[0] === "m" && (d = new RegExp(s.mapData.regex).exec(t))) {
			if (n || l.multiple) return !1;
			var p = s.mapData;
			if (!(l.color || l.number)) return !1;
			var m = this.parse(e, d[4]);
			if (!m || m.mapped) return !1;
			var h = this.parse(e, d[5]);
			if (!h || h.mapped) return !1;
			if (m.pfValue === h.pfValue || m.strValue === h.strValue) return qt("`" + e + ": " + t + "` is not a valid mapper because the output range is zero; converting to `" + e + ": " + m.strValue + "`"), this.parse(e, m.strValue);
			if (l.color) {
				var g = m.value, _ = h.value;
				if (g[0] === _[0] && g[1] === _[1] && g[2] === _[2] && (g[3] === _[3] || (g[3] == null || g[3] === 1) && (_[3] == null || _[3] === 1))) return !1;
			}
			return {
				name: e,
				value: d,
				strValue: "" + t,
				mapped: p,
				field: d[1],
				fieldMin: parseFloat(d[2]),
				fieldMax: parseFloat(d[3]),
				valueMin: m.value,
				valueMax: h.value,
				bypass: n
			};
		}
	}
	if (l.multiple && r !== "multiple") {
		var v = c ? t.split(/\s+/) : L(t) ? t : [t];
		if (l.evenMultiple && v.length % 2 != 0) return null;
		for (var y = [], b = [], x = [], S = "", C = !1, w = 0; w < v.length; w++) {
			var T = i.parse(e, v[w], n, "multiple");
			C ||= F(T.value), y.push(T.value), x.push(T.pfValue == null ? T.value : T.pfValue), b.push(T.units), S += (w > 0 ? " " : "") + T.strValue;
		}
		return l.validate && !l.validate(y, b) ? null : l.singleEnum && C ? y.length === 1 && F(y[0]) ? {
			name: e,
			value: y[0],
			strValue: y[0],
			bypass: n
		} : null : {
			name: e,
			value: y,
			pfValue: x,
			strValue: S,
			bypass: n,
			units: b
		};
	}
	var E = function() {
		for (var r = 0; r < l.enums.length; r++) if (l.enums[r] === t) return {
			name: e,
			value: t,
			strValue: "" + t,
			bypass: n
		};
		return null;
	};
	if (l.number) {
		var D, O = "px";
		if (l.units && (D = l.units), l.implicitUnits && (O = l.implicitUnits), !l.unitless) {
			if (c) {
				var k = "px|em" + (l.allowPercent ? "|\\%" : "");
				D && (k = D);
				var A = t.match("^(" + ue + ")(" + k + ")?$");
				A && (t = A[1], D = A[2] || O);
			} else (!D || l.implicitUnits) && (D = O);
		}
		if (t = parseFloat(t), isNaN(t) && l.enums === void 0) return null;
		if (isNaN(t) && l.enums !== void 0) return t = o, E();
		if (l.integer && !V(t) || l.min !== void 0 && (t < l.min || l.strictMin && t === l.min) || l.max !== void 0 && (t > l.max || l.strictMax && t === l.max)) return null;
		var j = {
			name: e,
			value: t,
			strValue: "" + t + (D || ""),
			units: D,
			bypass: n
		};
		return j.pfValue = l.unitless || D !== "px" && D !== "em" || D === "px" || !D ? t : this.getEmSizeInPixels() * t, (D === "ms" || D === "s") && (j.pfValue = D === "ms" ? t : 1e3 * t), (D === "deg" || D === "rad") && (j.pfValue = D === "rad" ? t : Gn(t)), D === "%" && (j.pfValue = t / 100), j;
	}
	if (l.propList) {
		var M = [], N = "" + t;
		if (N !== "none") {
			for (var P = N.split(/\s*,\s*|\s+/), R = 0; R < P.length; R++) {
				var z = P[R].trim();
				i.properties[z] ? M.push(z) : qt("`" + z + "` is not a valid property name");
			}
			if (M.length === 0) return null;
		}
		return {
			name: e,
			value: M,
			strValue: M.length === 0 ? "none" : M.join(" "),
			bypass: n
		};
	}
	if (l.color) {
		var B = Se(t);
		return B ? {
			name: e,
			value: B,
			pfValue: B,
			strValue: "rgb(" + B[0] + "," + B[1] + "," + B[2] + ")",
			bypass: n
		} : null;
	}
	if (l.regex || l.regexes) {
		if (l.enums) {
			var H = E();
			if (H) return H;
		}
		for (var U = l.regexes ? l.regexes : [l.regex], W = 0; W < U.length; W++) {
			var G = new RegExp(U[W]).exec(t);
			if (G) return {
				name: e,
				value: l.singleRegexMatchValue ? G[1] : G,
				strValue: "" + t,
				bypass: n
			};
		}
		return null;
	}
	return l.string ? {
		name: e,
		value: "" + t,
		strValue: "" + t,
		bypass: n
	} : l.enums ? E() : null;
};
var ud = function(e) {
	if (!(this instanceof ud)) return new ud(e);
	if (!K(e)) {
		Gt("A style must have a core reference");
		return;
	}
	this._private = {
		cy: e,
		coreStyle: {}
	}, this.length = 0, this.resetToDefault();
}, dd = ud.prototype;
dd.instanceString = function() {
	return "style";
}, dd.clear = function() {
	for (var e = this._private, t = e.cy.elements(), n = 0; n < this.length; n++) this[n] = void 0;
	return this.length = 0, e.contextStyles = {}, e.propDiffs = {}, this.cleanElements(t, !0), t.forEach(function(e) {
		var t = e[0]._private;
		t.styleDirty = !0, t.appliedInitStyle = !1;
	}), this;
}, dd.resetToDefault = function() {
	return this.clear(), this.addDefaultStylesheet(), this;
}, dd.core = function(e) {
	return this._private.coreStyle[e] || this.getDefaultProperty(e);
}, dd.selector = function(e) {
	var t = e === "core" ? null : new Kc(e), n = this.length++;
	return this[n] = {
		selector: t,
		properties: [],
		mappedProperties: [],
		index: n
	}, this;
}, dd.css = function() {
	var e = this, t = arguments;
	if (t.length === 1) for (var n = t[0], r = 0; r < e.properties.length; r++) {
		var i = e.properties[r], a = n[i.name];
		a === void 0 && (a = n[oe(i.name)]), a !== void 0 && this.cssRule(i.name, a);
	}
	else t.length === 2 && this.cssRule(t[0], t[1]);
	return this;
}, dd.style = dd.css, dd.cssRule = function(e, t) {
	var n = this.parse(e, t);
	if (n) {
		var r = this.length - 1;
		this[r].properties.push(n), this[r].properties[n.name] = n, n.name.match(/pie-(\d+)-background-size/) && n.value && (this._private.hasPie = !0), n.name.match(/stripe-(\d+)-background-size/) && n.value && (this._private.hasStripe = !0), n.mapped && this[r].mappedProperties.push(n), this[r].selector || (this._private.coreStyle[n.name] = n);
	}
	return this;
}, dd.append = function(e) {
	return q(e) ? e.appendToStyle(this) : L(e) ? this.appendFromJson(e) : F(e) && this.appendFromString(e), this;
}, ud.fromJson = function(e, t) {
	var n = new ud(e);
	return n.fromJson(t), n;
}, ud.fromString = function(e, t) {
	return new ud(e).fromString(t);
}, [
	ed,
	rd,
	id,
	ad,
	od,
	sd,
	cd,
	ld
].forEach(function(e) {
	Z(dd, e);
}), ud.types = dd.types, ud.properties = dd.properties, ud.propertyGroups = dd.propertyGroups, ud.propertyGroupNames = dd.propertyGroupNames, ud.propertyGroupKeys = dd.propertyGroupKeys;
var fd = {
	style: function(e) {
		return e && this.setStyle(e).update(), this._private.style;
	},
	setStyle: function(e) {
		var t = this._private;
		return t.style = q(e) ? e.generateStyle(this) : L(e) ? ud.fromJson(this, e) : F(e) ? ud.fromString(this, e) : ud(this), t.style;
	},
	updateStyle: function() {
		this.mutableElements().updateStyle();
	}
}, pd = "single", md = {
	autolock: function(e) {
		if (e !== void 0) this._private.autolock = !!e;
		else return this._private.autolock;
		return this;
	},
	autoungrabify: function(e) {
		if (e !== void 0) this._private.autoungrabify = !!e;
		else return this._private.autoungrabify;
		return this;
	},
	autounselectify: function(e) {
		if (e !== void 0) this._private.autounselectify = !!e;
		else return this._private.autounselectify;
		return this;
	},
	selectionType: function(e) {
		var t = this._private;
		if (t.selectionType ??= pd, e !== void 0) (e === "additive" || e === "single") && (t.selectionType = e);
		else return t.selectionType;
		return this;
	},
	panningEnabled: function(e) {
		if (e !== void 0) this._private.panningEnabled = !!e;
		else return this._private.panningEnabled;
		return this;
	},
	userPanningEnabled: function(e) {
		if (e !== void 0) this._private.userPanningEnabled = !!e;
		else return this._private.userPanningEnabled;
		return this;
	},
	zoomingEnabled: function(e) {
		if (e !== void 0) this._private.zoomingEnabled = !!e;
		else return this._private.zoomingEnabled;
		return this;
	},
	userZoomingEnabled: function(e) {
		if (e !== void 0) this._private.userZoomingEnabled = !!e;
		else return this._private.userZoomingEnabled;
		return this;
	},
	boxSelectionEnabled: function(e) {
		if (e !== void 0) this._private.boxSelectionEnabled = !!e;
		else return this._private.boxSelectionEnabled;
		return this;
	},
	pan: function() {
		var e = arguments, t = this._private.pan, n, r, i, a, o;
		switch (e.length) {
			case 0: return t;
			case 1:
				if (F(e[0])) return n = e[0], t[n];
				if (R(e[0])) {
					if (!this._private.panningEnabled) return this;
					i = e[0], a = i.x, o = i.y, B(a) && (t.x = a), B(o) && (t.y = o), this.emit("pan viewport");
				}
				break;
			case 2:
				if (!this._private.panningEnabled) return this;
				n = e[0], r = e[1], (n === "x" || n === "y") && B(r) && (t[n] = r), this.emit("pan viewport");
		}
		return this.notify("viewport"), this;
	},
	panBy: function(e, t) {
		var n = arguments, r = this._private.pan, i, a, o, s, c;
		if (!this._private.panningEnabled) return this;
		switch (n.length) {
			case 1:
				R(e) && (o = n[0], s = o.x, c = o.y, B(s) && (r.x += s), B(c) && (r.y += c), this.emit("pan viewport"));
				break;
			case 2: i = e, a = t, (i === "x" || i === "y") && B(a) && (r[i] += a), this.emit("pan viewport");
		}
		return this.notify("viewport"), this;
	},
	gc: function() {
		this.notify("gc");
	},
	fit: function(e, t) {
		var n = this.getFitViewport(e, t);
		if (n) {
			var r = this._private;
			r.zoom = n.zoom, r.pan = n.pan, this.emit("pan zoom viewport"), this.notify("viewport");
		}
		return this;
	},
	getFitViewport: function(e, t) {
		if (B(e) && t === void 0 && (t = e, e = void 0), this._private.panningEnabled && this._private.zoomingEnabled) {
			var n;
			if (F(e)) {
				var r = e;
				e = this.$(r);
			} else if (te(e)) {
				var i = e;
				n = {
					x1: i.x1,
					y1: i.y1,
					x2: i.x2,
					y2: i.y2
				}, n.w = n.x2 - n.x1, n.h = n.y2 - n.y1;
			} else U(e) || (e = this.mutableElements());
			if (!(U(e) && e.empty())) {
				n ||= e.boundingBox();
				var a = this.width(), o = this.height(), s;
				if (t = B(t) ? t : 0, !isNaN(a) && !isNaN(o) && a > 0 && o > 0 && !isNaN(n.w) && !isNaN(n.h) && n.w > 0 && n.h > 0) {
					s = Math.min((a - 2 * t) / n.w, (o - 2 * t) / n.h), s = s > this._private.maxZoom ? this._private.maxZoom : s, s = s < this._private.minZoom ? this._private.minZoom : s;
					var c = {
						x: (a - s * (n.x1 + n.x2)) / 2,
						y: (o - s * (n.y1 + n.y2)) / 2
					};
					return {
						zoom: s,
						pan: c
					};
				}
			}
		}
	},
	zoomRange: function(e, t) {
		var n = this._private;
		if (t == null) {
			var r = e;
			e = r.min, t = r.max;
		}
		return B(e) && B(t) && e <= t ? (n.minZoom = e, n.maxZoom = t) : B(e) && t === void 0 && e <= n.maxZoom ? n.minZoom = e : B(t) && e === void 0 && t >= n.minZoom && (n.maxZoom = t), this;
	},
	minZoom: function(e) {
		return e === void 0 ? this._private.minZoom : this.zoomRange({ min: e });
	},
	maxZoom: function(e) {
		return e === void 0 ? this._private.maxZoom : this.zoomRange({ max: e });
	},
	getZoomedViewport: function(e) {
		var t = this._private, n = t.pan, r = t.zoom, i, a, o = !1;
		if (t.zoomingEnabled || (o = !0), B(e) ? a = e : R(e) && (a = e.level, e.position == null ? e.renderedPosition != null && (i = e.renderedPosition) : i = In(e.position, r, n), i != null && !t.panningEnabled && (o = !0)), a = a > t.maxZoom ? t.maxZoom : a, a = a < t.minZoom ? t.minZoom : a, o || !B(a) || a === r || i != null && (!B(i.x) || !B(i.y))) return null;
		if (i != null) {
			var s = n, c = r, l = a;
			return {
				zoomed: !0,
				panned: !0,
				zoom: l,
				pan: {
					x: -l / c * (i.x - s.x) + i.x,
					y: -l / c * (i.y - s.y) + i.y
				}
			};
		}
		return {
			zoomed: !0,
			panned: !1,
			zoom: a,
			pan: n
		};
	},
	zoom: function(e) {
		if (e === void 0) return this._private.zoom;
		var t = this.getZoomedViewport(e), n = this._private;
		return t == null || !t.zoomed ? this : (n.zoom = t.zoom, t.panned && (n.pan.x = t.pan.x, n.pan.y = t.pan.y), this.emit("zoom" + (t.panned ? " pan" : "") + " viewport"), this.notify("viewport"), this);
	},
	viewport: function(e) {
		var t = this._private, n = !0, r = !0, i = [], a = !1, o = !1;
		if (!e || (B(e.zoom) || (n = !1), R(e.pan) || (r = !1), !n && !r)) return this;
		if (n) {
			var s = e.zoom;
			s < t.minZoom || s > t.maxZoom || !t.zoomingEnabled ? a = !0 : (t.zoom = s, i.push("zoom"));
		}
		if (r && (!a || !e.cancelOnFailedZoom) && t.panningEnabled) {
			var c = e.pan;
			B(c.x) && (t.pan.x = c.x, o = !1), B(c.y) && (t.pan.y = c.y, o = !1), o || i.push("pan");
		}
		return i.length > 0 && (i.push("viewport"), this.emit(i.join(" ")), this.notify("viewport")), this;
	},
	center: function(e) {
		var t = this.getCenterPan(e);
		return t && (this._private.pan = t, this.emit("pan viewport"), this.notify("viewport")), this;
	},
	getCenterPan: function(e, t) {
		if (this._private.panningEnabled) {
			if (F(e)) {
				var n = e;
				e = this.mutableElements().filter(n);
			} else U(e) || (e = this.mutableElements());
			if (e.length !== 0) {
				var r = e.boundingBox(), i = this.width(), a = this.height();
				return t = t === void 0 ? this._private.zoom : t, {
					x: (i - t * (r.x1 + r.x2)) / 2,
					y: (a - t * (r.y1 + r.y2)) / 2
				};
			}
		}
	},
	reset: function() {
		return !this._private.panningEnabled || !this._private.zoomingEnabled || this.viewport({
			pan: {
				x: 0,
				y: 0
			},
			zoom: 1
		}), this;
	},
	invalidateSize: function() {
		this._private.sizeCache = null;
	},
	size: function() {
		var e = this._private, t = e.container, n = this;
		return e.sizeCache = e.sizeCache || (t ? function() {
			var e = n.window().getComputedStyle(t), r = function(t) {
				return parseFloat(e.getPropertyValue(t));
			};
			return {
				width: t.clientWidth - r("padding-left") - r("padding-right"),
				height: t.clientHeight - r("padding-top") - r("padding-bottom")
			};
		}() : {
			width: 1,
			height: 1
		});
	},
	width: function() {
		return this.size().width;
	},
	height: function() {
		return this.size().height;
	},
	extent: function() {
		var e = this._private.pan, t = this._private.zoom, n = this.renderedExtent(), r = {
			x1: (n.x1 - e.x) / t,
			x2: (n.x2 - e.x) / t,
			y1: (n.y1 - e.y) / t,
			y2: (n.y2 - e.y) / t
		};
		return r.w = r.x2 - r.x1, r.h = r.y2 - r.y1, r;
	},
	renderedExtent: function() {
		var e = this.width(), t = this.height();
		return {
			x1: 0,
			y1: 0,
			x2: e,
			y2: t,
			w: e,
			h: t
		};
	},
	multiClickDebounceTime: function(e) {
		if (e) this._private.multiClickDebounceTime = e;
		else return this._private.multiClickDebounceTime;
		return this;
	}
};
md.centre = md.center, md.autolockNodes = md.autolock, md.autoungrabifyNodes = md.autoungrabify;
var hd = {
	data: Cc.data({
		field: "data",
		bindingEvent: "data",
		allowBinding: !0,
		allowSetting: !0,
		settingEvent: "data",
		settingTriggersEvent: !0,
		triggerFnName: "trigger",
		allowGetting: !0,
		updateStyle: !0
	}),
	removeData: Cc.removeData({
		field: "data",
		event: "data",
		triggerFnName: "trigger",
		triggerEvent: !0,
		updateStyle: !0
	}),
	scratch: Cc.data({
		field: "scratch",
		bindingEvent: "scratch",
		allowBinding: !0,
		allowSetting: !0,
		settingEvent: "scratch",
		settingTriggersEvent: !0,
		triggerFnName: "trigger",
		allowGetting: !0,
		updateStyle: !0
	}),
	removeScratch: Cc.removeData({
		field: "scratch",
		event: "scratch",
		triggerFnName: "trigger",
		triggerEvent: !0,
		updateStyle: !0
	})
};
hd.attr = hd.data, hd.removeAttr = hd.removeData;
var gd = function(e) {
	var t = this;
	e = Z({}, e);
	var n = e.container;
	n && !H(n) && H(n[0]) && (n = n[0]);
	var r = n ? n._cyreg : null;
	r ||= {}, r && r.cy && (r.cy.destroy(), r = {});
	var i = r.readies = r.readies || [];
	n && (n._cyreg = r), r.cy = t;
	var a = O !== void 0 && n !== void 0 && !e.headless, o = e;
	o.layout = Z({ name: a ? "grid" : "null" }, o.layout), o.renderer = Z({ name: a ? "canvas" : "null" }, o.renderer);
	var s = function(e, t, n) {
		return t === void 0 ? n === void 0 ? e : n : t;
	}, c = this._private = {
		container: n,
		ready: !1,
		options: o,
		elements: new Au(this),
		listeners: [],
		aniEles: new Au(this),
		data: o.data || {},
		scratch: {},
		layout: null,
		renderer: null,
		destroyed: !1,
		notificationsEnabled: !0,
		minZoom: 1e-50,
		maxZoom: 1e50,
		zoomingEnabled: s(!0, o.zoomingEnabled),
		userZoomingEnabled: s(!0, o.userZoomingEnabled),
		panningEnabled: s(!0, o.panningEnabled),
		userPanningEnabled: s(!0, o.userPanningEnabled),
		boxSelectionEnabled: s(!0, o.boxSelectionEnabled),
		autolock: s(!1, o.autolock, o.autolockNodes),
		autoungrabify: s(!1, o.autoungrabify, o.autoungrabifyNodes),
		autounselectify: s(!1, o.autounselectify),
		styleEnabled: o.styleEnabled === void 0 ? a : o.styleEnabled,
		zoom: B(o.zoom) ? o.zoom : 1,
		pan: {
			x: R(o.pan) && B(o.pan.x) ? o.pan.x : 0,
			y: R(o.pan) && B(o.pan.y) ? o.pan.y : 0
		},
		animation: {
			current: [],
			queue: []
		},
		hasCompoundNodes: !1,
		multiClickDebounceTime: s(250, o.multiClickDebounceTime)
	};
	this.createEmitter(), this.selectionType(o.selectionType), this.zoomRange({
		min: o.minZoom,
		max: o.maxZoom
	});
	var l = function(e, t) {
		if (e.some(ne)) return Sa.all(e).then(t);
		t(e);
	};
	c.styleEnabled && t.setStyle([]);
	var u = Z({}, o, o.renderer);
	t.initRenderer(u);
	var d = function(e, n, r) {
		t.notifications(!1);
		var i = t.mutableElements();
		i.length > 0 && i.remove(), e != null && (R(e) || L(e)) && t.add(e), t.one("layoutready", function(e) {
			t.notifications(!0), t.emit(e), t.one("load", n), t.emitAndNotify("load");
		}).one("layoutstop", function() {
			t.one("done", r), t.emit("done");
		});
		var a = Z({}, t._private.options.layout);
		a.eles = t.elements(), t.layout(a).run();
	};
	l([o.style, o.elements], function(e) {
		var n = e[0], a = e[1];
		c.styleEnabled && t.style().append(n), d(a, function() {
			t.startAnimationLoop(), c.ready = !0, I(o.ready) && t.on("ready", o.ready);
			for (var e = 0; e < i.length; e++) {
				var n = i[e];
				t.on("ready", n);
			}
			r && (r.readies = []), t.emit("ready");
		}, o.done);
	});
}, _d = gd.prototype;
Z(_d, {
	instanceString: function() {
		return "core";
	},
	isReady: function() {
		return this._private.ready;
	},
	destroyed: function() {
		return this._private.destroyed;
	},
	ready: function(e) {
		return this.isReady() ? this.emitter().emit("ready", [], e) : this.on("ready", e), this;
	},
	destroy: function() {
		var e = this;
		if (!e.destroyed()) return e.stopAnimationLoop(), e.destroyRenderer(), this.emit("destroy"), e._private.destroyed = !0, e;
	},
	hasElementWithId: function(e) {
		return this._private.elements.hasElementWithId(e);
	},
	getElementById: function(e) {
		return this._private.elements.getElementById(e);
	},
	hasCompoundNodes: function() {
		return this._private.hasCompoundNodes;
	},
	headless: function() {
		return this._private.renderer.isHeadless();
	},
	styleEnabled: function() {
		return this._private.styleEnabled;
	},
	addToPool: function(e) {
		return this._private.elements.merge(e), this;
	},
	removeFromPool: function(e) {
		return this._private.elements.unmerge(e), this;
	},
	container: function() {
		return this._private.container || null;
	},
	window: function() {
		if (this._private.container == null) return O;
		var e = this._private.container.ownerDocument;
		return e === void 0 || e == null ? O : e.defaultView || O;
	},
	mount: function(e) {
		if (e != null) {
			var t = this, n = t._private, r = n.options;
			return !H(e) && H(e[0]) && (e = e[0]), t.stopAnimationLoop(), t.destroyRenderer(), n.container = e, n.styleEnabled = !0, t.invalidateSize(), t.initRenderer(Z({}, r, r.renderer, { name: r.renderer.name === "null" ? "canvas" : r.renderer.name })), t.startAnimationLoop(), t.style(r.style), t.emit("mount"), t;
		}
	},
	unmount: function() {
		var e = this;
		return e.stopAnimationLoop(), e.destroyRenderer(), e.initRenderer({ name: "null" }), e.emit("unmount"), e;
	},
	options: function() {
		return Yt(this._private.options);
	},
	json: function(e) {
		var t = this, n = t._private, r = t.mutableElements(), i = function(e) {
			return t.getElementById(e.id());
		};
		if (R(e)) {
			if (t.startBatch(), e.elements) {
				var a = {}, o = function(e, n) {
					for (var r = [], i = [], o = 0; o < e.length; o++) {
						var s = e[o];
						if (!s.data.id) {
							qt("cy.json() cannot handle elements without an ID attribute");
							continue;
						}
						var c = "" + s.data.id, l = t.getElementById(c);
						a[c] = !0, l.length === 0 ? (n && (s.group = n), r.push(s)) : i.push({
							ele: l,
							json: s
						});
					}
					t.add(r);
					for (var u = 0; u < i.length; u++) {
						var d = i[u], f = d.ele, p = d.json;
						f.json(p);
					}
				};
				if (L(e.elements)) o(e.elements);
				else for (var s = ["nodes", "edges"], c = 0; c < s.length; c++) {
					var l = s[c], u = e.elements[l];
					L(u) && o(u, l);
				}
				var d = t.collection();
				r.filter(function(e) {
					return !a[e.id()];
				}).forEach(function(e) {
					e.isParent() ? d.merge(e) : e.remove();
				}), d.forEach(function(e) {
					return e.children().move({ parent: null });
				}), d.forEach(function(e) {
					return i(e).remove();
				});
			}
			e.style && t.style(e.style), e.zoom != null && e.zoom !== n.zoom && t.zoom(e.zoom), e.pan && (e.pan.x !== n.pan.x || e.pan.y !== n.pan.y) && t.pan(e.pan), e.data && t.data(e.data);
			for (var f = [
				"minZoom",
				"maxZoom",
				"zoomingEnabled",
				"userZoomingEnabled",
				"panningEnabled",
				"userPanningEnabled",
				"boxSelectionEnabled",
				"autolock",
				"autoungrabify",
				"autounselectify",
				"multiClickDebounceTime"
			], p = 0; p < f.length; p++) {
				var m = f[p];
				e[m] != null && t[m](e[m]);
			}
			return t.endBatch(), this;
		}
		var h = !!e, g = {};
		h ? g.elements = this.elements().map(function(e) {
			return e.json();
		}) : (g.elements = {}, r.forEach(function(e) {
			var t = e.group();
			g.elements[t] || (g.elements[t] = []), g.elements[t].push(e.json());
		})), this._private.styleEnabled && (g.style = t.style().json()), g.data = Yt(t.data());
		var _ = n.options;
		return g.zoomingEnabled = n.zoomingEnabled, g.userZoomingEnabled = n.userZoomingEnabled, g.zoom = n.zoom, g.minZoom = n.minZoom, g.maxZoom = n.maxZoom, g.panningEnabled = n.panningEnabled, g.userPanningEnabled = n.userPanningEnabled, g.pan = Yt(n.pan), g.boxSelectionEnabled = n.boxSelectionEnabled, g.renderer = Yt(_.renderer), g.hideEdgesOnViewport = _.hideEdgesOnViewport, g.textureOnViewport = _.textureOnViewport, g.wheelSensitivity = _.wheelSensitivity, g.motionBlur = _.motionBlur, g.multiClickDebounceTime = _.multiClickDebounceTime, g;
	}
}), _d.$id = _d.getElementById, [
	Mu,
	Wu,
	qu,
	Ju,
	Yu,
	Xu,
	Qu,
	$u,
	fd,
	md,
	hd
].forEach(function(e) {
	Z(_d, e);
});
var vd = {
	fit: !0,
	directed: !1,
	direction: "downward",
	padding: 30,
	circle: !1,
	grid: !1,
	spacingFactor: 1.75,
	boundingBox: void 0,
	avoidOverlap: !0,
	nodeDimensionsIncludeLabels: !1,
	roots: void 0,
	depthSort: void 0,
	animate: !1,
	animationDuration: 500,
	animationEasing: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	ready: void 0,
	stop: void 0,
	transform: function(e, t) {
		return t;
	}
}, yd = {
	maximal: !1,
	acyclic: !1
}, bd = function(e) {
	return e.scratch("breadthfirst");
}, xd = function(e, t) {
	return e.scratch("breadthfirst", t);
};
function Sd(e) {
	this.options = Z({}, vd, yd, e);
}
Sd.prototype.run = function() {
	var e = this.options, t = e.cy, n = e.eles, r = n.nodes().filter(function(e) {
		return e.isChildless();
	}), i = n, a = e.directed, o = e.acyclic || e.maximal || e.maximalAdjustments > 0, s = !!e.boundingBox, c = nr(s ? e.boundingBox : structuredClone(t.extent())), l;
	if (U(e.roots)) l = e.roots;
	else if (L(e.roots)) {
		for (var u = [], d = 0; d < e.roots.length; d++) {
			var f = e.roots[d], p = t.getElementById(f);
			u.push(p);
		}
		l = t.collection(u);
	} else if (F(e.roots)) l = t.$(e.roots);
	else if (a) l = r.roots();
	else {
		var m = n.components();
		l = t.collection();
		for (var h = function() {
			var e = m[g], t = e.maxDegree(!1), n = e.filter(function(e) {
				return e.degree(!1) === t;
			});
			l = l.add(n);
		}, g = 0; g < m.length; g++) h();
	}
	var _ = [], v = {}, y = function(e, t) {
		_[t] ?? (_[t] = []);
		var n = _[t].length;
		_[t].push(e), xd(e, {
			index: n,
			depth: t
		});
	}, b = function(e, t) {
		var n = bd(e), r = n.depth, i = n.index;
		_[r][i] = null, e.isChildless() && y(e, t);
	};
	i.bfs({
		roots: l,
		directed: e.directed,
		visit: function(e, t, n, r, i) {
			var a = e[0], o = a.id();
			a.isChildless() && y(a, i), v[o] = !0;
		}
	});
	for (var x = [], S = 0; S < r.length; S++) {
		var C = r[S];
		v[C.id()] || x.push(C);
	}
	var w = function(e) {
		for (var t = _[e], n = 0; n < t.length; n++) {
			var r = t[n];
			if (r == null) {
				t.splice(n, 1), n--;
				continue;
			}
			xd(r, {
				depth: e,
				index: n
			});
		}
	}, T = function(t, r) {
		for (var i = bd(t), a = t.incomers().filter(function(e) {
			return e.isNode() && n.has(e);
		}), o = -1, s = t.id(), c = 0; c < a.length; c++) {
			var l = a[c], u = bd(l);
			o = Math.max(o, u.depth);
		}
		if (i.depth <= o) {
			if (!e.acyclic && r[s]) return null;
			var d = o + 1;
			return b(t, d), r[s] = d, !0;
		}
		return !1;
	};
	if (a && o) {
		var E = [], D = {}, O = function(e) {
			return E.push(e);
		}, k = function() {
			return E.shift();
		};
		for (r.forEach(function(e) {
			return E.push(e);
		}); E.length > 0;) {
			var A = k(), j = T(A, D);
			if (j) A.outgoers().filter(function(e) {
				return e.isNode() && n.has(e);
			}).forEach(O);
			else if (j === null) {
				qt("Detected double maximal shift for node `" + A.id() + "`.  Bailing maximal adjustment due to cycle.  Use `options.maximal: true` only on DAGs.");
				break;
			}
		}
	}
	var M = 0;
	if (e.avoidOverlap) for (var N = 0; N < r.length; N++) {
		var P = r[N].layoutDimensions(e), I = P.w, R = P.h;
		M = Math.max(M, I, R);
	}
	var z = {}, B = function(e) {
		if (z[e.id()]) return z[e.id()];
		for (var t = bd(e).depth, n = e.neighborhood(), i = 0, a = 0, o = 0; o < n.length; o++) {
			var s = n[o];
			if (!(s.isEdge() || s.isParent() || !r.has(s))) {
				var c = bd(s);
				if (c != null) {
					var l = c.index, u = c.depth;
					if (l != null && u != null) {
						var d = _[u].length;
						u < t && (i += l / d, a++);
					}
				}
			}
		}
		return a = Math.max(1, a), i /= a, a === 0 && (i = 0), z[e.id()] = i, i;
	}, V = function(e, t) {
		var n = B(e) - B(t);
		return n === 0 ? ge(e.id(), t.id()) : n;
	};
	e.depthSort !== void 0 && (V = e.depthSort);
	for (var H = _.length, W = 0; W < H; W++) _[W].sort(V), w(W);
	for (var G = [], K = 0; K < x.length; K++) G.push(x[K]);
	G.length && (_.unshift(G), H = _.length, function() {
		for (var e = 0; e < H; e++) w(e);
	}());
	for (var q = 0, ee = 0; ee < H; ee++) q = Math.max(_[ee].length, q);
	var J = {
		x: c.x1 + c.w / 2,
		y: c.y1 + c.h / 2
	}, Y = r.reduce(function(t, n) {
		return function(e) {
			return {
				w: t.w === -1 ? e.w : (t.w + e.w) / 2,
				h: t.h === -1 ? e.h : (t.h + e.h) / 2
			};
		}(n.boundingBox({ includeLabels: e.nodeDimensionsIncludeLabels }));
	}, {
		w: -1,
		h: -1
	}), te = Math.max(H === 1 ? 0 : s ? (c.h - e.padding * 2 - Y.h) / (H - 1) : (c.h - e.padding * 2 - Y.h) / (H + 1), M), ne = _.reduce(function(e, t) {
		return Math.max(e, t.length);
	}, 0), re = function(t) {
		var n = bd(t), r = n.depth, i = n.index;
		if (e.circle) {
			var a = Math.min(c.w / 2 / H, c.h / 2 / H);
			a = Math.max(a, M);
			var o = a * r + a - (H > 0 && _[0].length <= 3 ? a / 2 : 0), l = 2 * Math.PI / _[r].length * i;
			return r === 0 && _[0].length === 1 && (o = 1), {
				x: J.x + o * Math.cos(l),
				y: J.y + o * Math.sin(l)
			};
		}
		var u = _[r].length, d = Math.max(u === 1 ? 0 : s ? (c.w - e.padding * 2 - Y.w) / ((e.grid ? ne : u) - 1) : (c.w - e.padding * 2 - Y.w) / ((e.grid ? ne : u) + 1), M);
		return {
			x: J.x + (i + 1 - (u + 1) / 2) * d,
			y: J.y + (r + 1 - (H + 1) / 2) * te
		};
	}, ie = {
		downward: 0,
		leftward: 90,
		upward: 180,
		rightward: -90
	};
	return Object.keys(ie).indexOf(e.direction) === -1 && Gt(`Invalid direction '${e.direction}' specified for breadthfirst layout. Valid values are: ${Object.keys(ie).join(", ")}`), n.nodes().layoutPositions(this, e, function(t) {
		return It(re(t), c, ie[e.direction]);
	}), this;
};
var Cd = {
	fit: !0,
	padding: 30,
	boundingBox: void 0,
	avoidOverlap: !0,
	nodeDimensionsIncludeLabels: !1,
	spacingFactor: void 0,
	radius: void 0,
	startAngle: 3 / 2 * Math.PI,
	sweep: void 0,
	clockwise: !0,
	sort: void 0,
	animate: !1,
	animationDuration: 500,
	animationEasing: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	ready: void 0,
	stop: void 0,
	transform: function(e, t) {
		return t;
	}
};
function wd(e) {
	this.options = Z({}, Cd, e);
}
wd.prototype.run = function() {
	var e = this.options, t = e, n = e.cy, r = t.eles, i = t.counterclockwise === void 0 ? t.clockwise : !t.counterclockwise, a = r.nodes().not(":parent");
	t.sort && (a = a.sort(t.sort));
	for (var o = nr(t.boundingBox ? t.boundingBox : {
		x1: 0,
		y1: 0,
		w: n.width(),
		h: n.height()
	}), s = {
		x: o.x1 + o.w / 2,
		y: o.y1 + o.h / 2
	}, c = (t.sweep === void 0 ? 2 * Math.PI - 2 * Math.PI / a.length : t.sweep) / Math.max(1, a.length - 1), l, u = 0, d = 0; d < a.length; d++) {
		var f = a[d].layoutDimensions(t), p = f.w, m = f.h;
		u = Math.max(u, p, m);
	}
	if (l = B(t.radius) ? t.radius : a.length <= 1 ? 0 : Math.min(o.h, o.w) / 2 - u, a.length > 1 && t.avoidOverlap) {
		u *= 1.75;
		var h = Math.cos(c) - Math.cos(0), g = Math.sin(c) - Math.sin(0), _ = Math.sqrt(u * u / (h * h + g * g));
		l = Math.max(_, l);
	}
	return r.nodes().layoutPositions(this, t, function(e, n) {
		var r = t.startAngle + n * c * (i ? 1 : -1), a = l * Math.cos(r), o = l * Math.sin(r);
		return {
			x: s.x + a,
			y: s.y + o
		};
	}), this;
};
var Td = {
	fit: !0,
	padding: 30,
	startAngle: 3 / 2 * Math.PI,
	sweep: void 0,
	clockwise: !0,
	equidistant: !1,
	minNodeSpacing: 10,
	boundingBox: void 0,
	avoidOverlap: !0,
	nodeDimensionsIncludeLabels: !1,
	height: void 0,
	width: void 0,
	spacingFactor: void 0,
	concentric: function(e) {
		return e.degree();
	},
	levelWidth: function(e) {
		return e.maxDegree() / 4;
	},
	animate: !1,
	animationDuration: 500,
	animationEasing: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	ready: void 0,
	stop: void 0,
	transform: function(e, t) {
		return t;
	}
};
function Ed(e) {
	this.options = Z({}, Td, e);
}
Ed.prototype.run = function() {
	for (var e = this.options, t = e, n = t.counterclockwise === void 0 ? t.clockwise : !t.counterclockwise, r = e.cy, i = t.eles, a = i.nodes().not(":parent"), o = nr(t.boundingBox ? t.boundingBox : {
		x1: 0,
		y1: 0,
		w: r.width(),
		h: r.height()
	}), s = {
		x: o.x1 + o.w / 2,
		y: o.y1 + o.h / 2
	}, c = [], l = 0, u = 0; u < a.length; u++) {
		var d = a[u], f = void 0;
		f = t.concentric(d), c.push({
			value: f,
			node: d
		}), d._private.scratch.concentric = f;
	}
	a.updateStyle();
	for (var p = 0; p < a.length; p++) {
		var m = a[p].layoutDimensions(t);
		l = Math.max(l, m.w, m.h);
	}
	c.sort(function(e, t) {
		return t.value - e.value;
	});
	for (var h = t.levelWidth(a), g = [[]], _ = g[0], v = 0; v < c.length; v++) {
		var y = c[v];
		_.length > 0 && Math.abs(_[0].value - y.value) >= h && (_ = [], g.push(_)), _.push(y);
	}
	var b = l + t.minNodeSpacing;
	if (!t.avoidOverlap) {
		var x = g.length > 0 && g[0].length > 1, S = (Math.min(o.w, o.h) / 2 - b) / (g.length + x ? 1 : 0);
		b = Math.min(b, S);
	}
	for (var C = 0, w = 0; w < g.length; w++) {
		var T = g[w], E = T.dTheta = (t.sweep === void 0 ? 2 * Math.PI - 2 * Math.PI / T.length : t.sweep) / Math.max(1, T.length - 1);
		if (T.length > 1 && t.avoidOverlap) {
			var D = Math.cos(E) - Math.cos(0), O = Math.sin(E) - Math.sin(0), k = Math.sqrt(b * b / (D * D + O * O));
			C = Math.max(k, C);
		}
		T.r = C, C += b;
	}
	if (t.equidistant) {
		for (var A = 0, j = 0, M = 0; M < g.length; M++) {
			var N = g[M].r - j;
			A = Math.max(A, N);
		}
		j = 0;
		for (var P = 0; P < g.length; P++) {
			var F = g[P];
			P === 0 && (j = F.r), F.r = j, j += A;
		}
	}
	for (var I = {}, L = 0; L < g.length; L++) for (var R = g[L], z = R.dTheta, B = R.r, V = 0; V < R.length; V++) {
		var H = R[V], U = t.startAngle + (n ? 1 : -1) * z * V, W = {
			x: s.x + B * Math.cos(U),
			y: s.y + B * Math.sin(U)
		};
		I[H.node.id()] = W;
	}
	return i.nodes().layoutPositions(this, t, function(e) {
		return I[e.id()];
	}), this;
};
var Dd, Od = {
	ready: function() {},
	stop: function() {},
	animate: !0,
	animationEasing: void 0,
	animationDuration: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	animationThreshold: 250,
	refresh: 20,
	fit: !0,
	padding: 30,
	boundingBox: void 0,
	nodeDimensionsIncludeLabels: !1,
	randomize: !1,
	componentSpacing: 40,
	nodeRepulsion: function(e) {
		return 2048;
	},
	nodeOverlap: 4,
	idealEdgeLength: function(e) {
		return 32;
	},
	edgeElasticity: function(e) {
		return 32;
	},
	nestingFactor: 1.2,
	gravity: 1,
	numIter: 1e3,
	initialTemp: 1e3,
	coolingFactor: .99,
	minTemp: 1
};
function kd(e) {
	this.options = Z({}, Od, e), this.options.layout = this;
	var t = this.options.eles.nodes(), n = this.options.eles.edges().filter(function(e) {
		var n = e.source().data("id"), r = e.target().data("id"), i = t.some(function(e) {
			return e.data("id") === n;
		}), a = t.some(function(e) {
			return e.data("id") === r;
		});
		return !i || !a;
	});
	this.options.eles = this.options.eles.not(n);
}
kd.prototype.run = function() {
	var e = this.options, t = e.cy, n = this;
	n.stopped = !1, (e.animate === !0 || e.animate === !1) && n.emit({
		type: "layoutstart",
		layout: n
	}), Dd = !0 === e.debug;
	var r = Ad(t, n, e);
	Dd && Nd(r), e.randomize && Pd(r);
	var i = bt(), a = function() {
		Id(r, t, e), !0 === e.fit && t.fit(e.padding);
	}, o = function(t) {
		return !(n.stopped || t >= e.numIter || (Ld(r, e), r.temperature *= e.coolingFactor, r.temperature < e.minTemp));
	}, s = function() {
		if (e.animate === !0 || e.animate === !1) a(), n.one("layoutstop", e.stop), n.emit({
			type: "layoutstop",
			layout: n
		});
		else {
			var t = e.eles.nodes(), i = Fd(r, e, t);
			t.layoutPositions(n, e, i);
		}
	}, c = 0, l = !0;
	if (e.animate === !0) {
		var u = function() {
			for (var t = 0; l && t < e.refresh;) l = o(c), c++, t++;
			l ? (bt() - i >= e.animationThreshold && a(), yt(u)) : (Yd(r, e), s());
		};
		u();
	} else {
		for (; l;) l = o(c), c++;
		Yd(r, e), s();
	}
	return this;
}, kd.prototype.stop = function() {
	return this.stopped = !0, this.thread && this.thread.stop(), this.emit("layoutstop"), this;
}, kd.prototype.destroy = function() {
	return this.thread && this.thread.stop(), this;
};
var Ad = function(e, t, n) {
	for (var r = n.eles.edges(), i = n.eles.nodes(), a = nr(n.boundingBox ? n.boundingBox : {
		x1: 0,
		y1: 0,
		w: e.width(),
		h: e.height()
	}), o = {
		isCompound: e.hasCompoundNodes(),
		layoutNodes: [],
		idToIndex: {},
		nodeSize: i.size(),
		graphSet: [],
		indexToGraph: [],
		layoutEdges: [],
		edgeSize: r.size(),
		temperature: n.initialTemp,
		clientWidth: a.w,
		clientHeight: a.h,
		boundingBox: a
	}, s = n.eles.components(), c = {}, l = 0; l < s.length; l++) for (var u = s[l], d = 0; d < u.length; d++) {
		var f = u[d];
		c[f.id()] = l;
	}
	for (var l = 0; l < o.nodeSize; l++) {
		var p = i[l], m = p.layoutDimensions(n), h = {};
		h.isLocked = p.locked(), h.id = p.data("id"), h.parentId = p.data("parent"), h.cmptId = c[p.id()], h.children = [], h.positionX = p.position("x"), h.positionY = p.position("y"), h.offsetX = 0, h.offsetY = 0, h.height = m.w, h.width = m.h, h.maxX = h.positionX + h.width / 2, h.minX = h.positionX - h.width / 2, h.maxY = h.positionY + h.height / 2, h.minY = h.positionY - h.height / 2, h.padLeft = parseFloat(p.style("padding")), h.padRight = parseFloat(p.style("padding")), h.padTop = parseFloat(p.style("padding")), h.padBottom = parseFloat(p.style("padding")), h.nodeRepulsion = I(n.nodeRepulsion) ? n.nodeRepulsion(p) : n.nodeRepulsion, o.layoutNodes.push(h), o.idToIndex[h.id] = l;
	}
	for (var g = [], _ = 0, v = -1, y = [], l = 0; l < o.nodeSize; l++) {
		var p = o.layoutNodes[l], b = p.parentId;
		b == null ? (g[++v] = p.id, y.push(p.id)) : o.layoutNodes[o.idToIndex[b]].children.push(p.id);
	}
	for (o.graphSet.push(y); _ <= v;) {
		var x = g[_++], S = o.idToIndex[x], f = o.layoutNodes[S], C = f.children;
		if (C.length > 0) {
			o.graphSet.push(C);
			for (var l = 0; l < C.length; l++) g[++v] = C[l];
		}
	}
	for (var l = 0; l < o.graphSet.length; l++) for (var w = o.graphSet[l], d = 0; d < w.length; d++) {
		var T = o.idToIndex[w[d]];
		o.indexToGraph[T] = l;
	}
	for (var l = 0; l < o.edgeSize; l++) {
		var E = r[l], D = {};
		D.id = E.data("id"), D.sourceId = E.data("source"), D.targetId = E.data("target");
		var O = I(n.idealEdgeLength) ? n.idealEdgeLength(E) : n.idealEdgeLength, k = I(n.edgeElasticity) ? n.edgeElasticity(E) : n.edgeElasticity, A = o.idToIndex[D.sourceId], j = o.idToIndex[D.targetId];
		if (o.indexToGraph[A] != o.indexToGraph[j]) {
			for (var M = jd(D.sourceId, D.targetId, o), N = o.graphSet[M], P = 0, h = o.layoutNodes[A]; N.indexOf(h.id) === -1;) h = o.layoutNodes[o.idToIndex[h.parentId]], P++;
			for (h = o.layoutNodes[j]; N.indexOf(h.id) === -1;) h = o.layoutNodes[o.idToIndex[h.parentId]], P++;
			O *= P * n.nestingFactor;
		}
		D.idealLength = O, D.elasticity = k, o.layoutEdges.push(D);
	}
	return o;
}, jd = function(e, t, n) {
	var r = Md(e, t, 0, n);
	return 2 > r.count ? 0 : r.graph;
}, Md = function(e, t, n, r) {
	var i = r.graphSet[n];
	if (-1 < i.indexOf(e) && -1 < i.indexOf(t)) return {
		count: 2,
		graph: n
	};
	for (var a = 0, o = 0; o < i.length; o++) {
		var s = i[o], c = r.idToIndex[s], l = r.layoutNodes[c].children;
		if (l.length !== 0) {
			var u = r.indexToGraph[r.idToIndex[l[0]]], d = Md(e, t, u, r);
			if (d.count !== 0) {
				if (d.count === 1) {
					if (a++, a === 2) break;
				} else return d;
			}
		}
	}
	return {
		count: a,
		graph: n
	};
}, Nd, Pd = function(e, t) {
	for (var n = e.clientWidth, r = e.clientHeight, i = 0; i < e.nodeSize; i++) {
		var a = e.layoutNodes[i];
		a.children.length === 0 && !a.isLocked && (a.positionX = Math.random() * n, a.positionY = Math.random() * r);
	}
}, Fd = function(e, t, n) {
	var r = e.boundingBox, i = {
		x1: Infinity,
		x2: -Infinity,
		y1: Infinity,
		y2: -Infinity
	};
	return t.boundingBox && (n.forEach(function(t) {
		var n = e.layoutNodes[e.idToIndex[t.data("id")]];
		i.x1 = Math.min(i.x1, n.positionX), i.x2 = Math.max(i.x2, n.positionX), i.y1 = Math.min(i.y1, n.positionY), i.y2 = Math.max(i.y2, n.positionY);
	}), i.w = i.x2 - i.x1, i.h = i.y2 - i.y1), function(n, a) {
		var o = e.layoutNodes[e.idToIndex[n.data("id")]];
		if (t.boundingBox) {
			var s = i.w === 0 ? .5 : (o.positionX - i.x1) / i.w, c = i.h === 0 ? .5 : (o.positionY - i.y1) / i.h;
			return {
				x: r.x1 + s * r.w,
				y: r.y1 + c * r.h
			};
		}
		return {
			x: o.positionX,
			y: o.positionY
		};
	};
}, Id = function(e, t, n) {
	var r = n.layout, i = n.eles.nodes(), a = Fd(e, n, i);
	i.positions(a), !0 !== e.ready && (e.ready = !0, r.one("layoutready", n.ready), r.emit({
		type: "layoutready",
		layout: this
	}));
}, Ld = function(e, t, n) {
	Rd(e, t), Ud(e), Wd(e, t), Gd(e), Kd(e);
}, Rd = function(e, t) {
	for (var n = 0; n < e.graphSet.length; n++) for (var r = e.graphSet[n], i = r.length, a = 0; a < i; a++) for (var o = e.layoutNodes[e.idToIndex[r[a]]], s = a + 1; s < i; s++) {
		var c = e.layoutNodes[e.idToIndex[r[s]]];
		Bd(o, c, e, t);
	}
}, zd = function(e) {
	return -e + 2 * e * Math.random();
}, Bd = function(e, t, n, r) {
	if (e.cmptId === t.cmptId || n.isCompound) {
		var i = t.positionX - e.positionX, a = t.positionY - e.positionY, o = 1;
		i === 0 && a === 0 && (i = zd(o), a = zd(o));
		var s = Vd(e, t, i, a);
		if (s > 0) var c = r.nodeOverlap * s, l = Math.sqrt(i * i + a * a), u = c * i / l, d = c * a / l;
		else var f = Hd(e, i, a), p = Hd(t, -1 * i, -1 * a), m = p.x - f.x, h = p.y - f.y, g = m * m + h * h, l = Math.sqrt(g), c = (e.nodeRepulsion + t.nodeRepulsion) / g, u = c * m / l, d = c * h / l;
		e.isLocked || (e.offsetX -= u, e.offsetY -= d), t.isLocked || (t.offsetX += u, t.offsetY += d);
	}
}, Vd = function(e, t, n, r) {
	if (n > 0) var i = e.maxX - t.minX;
	else var i = t.maxX - e.minX;
	if (r > 0) var a = e.maxY - t.minY;
	else var a = t.maxY - e.minY;
	return i >= 0 && a >= 0 ? Math.sqrt(i * i + a * a) : 0;
}, Hd = function(e, t, n) {
	var r = e.positionX, i = e.positionY, a = e.height || 1, o = e.width || 1, s = n / t, c = a / o, l = {};
	return t === 0 && 0 < n || t === 0 && 0 > n ? (l.x = r, l.y = i + a / 2, l) : 0 < t && -1 * c <= s && s <= c ? (l.x = r + o / 2, l.y = i + o * n / 2 / t, l) : 0 > t && -1 * c <= s && s <= c ? (l.x = r - o / 2, l.y = i - o * n / 2 / t, l) : 0 < n && (s <= -1 * c || s >= c) ? (l.x = r + a * t / 2 / n, l.y = i + a / 2, l) : 0 > n && (s <= -1 * c || s >= c) ? (l.x = r - a * t / 2 / n, l.y = i - a / 2, l) : l;
}, Ud = function(e, t) {
	for (var n = 0; n < e.edgeSize; n++) {
		var r = e.layoutEdges[n], i = e.idToIndex[r.sourceId], a = e.layoutNodes[i], o = e.idToIndex[r.targetId], s = e.layoutNodes[o], c = s.positionX - a.positionX, l = s.positionY - a.positionY;
		if (c !== 0 || l !== 0) {
			var u = Hd(a, c, l), d = Hd(s, -1 * c, -1 * l), f = d.x - u.x, p = d.y - u.y, m = Math.sqrt(f * f + p * p), h = (r.idealLength - m) ** 2 / r.elasticity;
			if (m !== 0) var g = h * f / m, _ = h * p / m;
			else var g = 0, _ = 0;
			a.isLocked || (a.offsetX += g, a.offsetY += _), s.isLocked || (s.offsetX -= g, s.offsetY -= _);
		}
	}
}, Wd = function(e, t) {
	if (t.gravity !== 0) for (var n = 1, r = 0; r < e.graphSet.length; r++) {
		var i = e.graphSet[r], a = i.length;
		if (r === 0) var o = e.clientHeight / 2, s = e.clientWidth / 2;
		else var c = e.layoutNodes[e.idToIndex[i[0]]], l = e.layoutNodes[e.idToIndex[c.parentId]], o = l.positionX, s = l.positionY;
		for (var u = 0; u < a; u++) {
			var d = e.layoutNodes[e.idToIndex[i[u]]];
			if (!d.isLocked) {
				var f = o - d.positionX, p = s - d.positionY, m = Math.sqrt(f * f + p * p);
				if (m > n) {
					var h = t.gravity * f / m, g = t.gravity * p / m;
					d.offsetX += h, d.offsetY += g;
				}
			}
		}
	}
}, Gd = function(e, t) {
	var n = [], r = 0, i = -1;
	for (n.push.apply(n, e.graphSet[0]), i += e.graphSet[0].length; r <= i;) {
		var a = n[r++], o = e.idToIndex[a], s = e.layoutNodes[o], c = s.children;
		if (0 < c.length && !s.isLocked) {
			for (var l = s.offsetX, u = s.offsetY, d = 0; d < c.length; d++) {
				var f = e.layoutNodes[e.idToIndex[c[d]]];
				f.offsetX += l, f.offsetY += u, n[++i] = c[d];
			}
			s.offsetX = 0, s.offsetY = 0;
		}
	}
}, Kd = function(e, t) {
	for (var n = 0; n < e.nodeSize; n++) {
		var r = e.layoutNodes[n];
		0 < r.children.length && (r.maxX = void 0, r.minX = void 0, r.maxY = void 0, r.minY = void 0);
	}
	for (var n = 0; n < e.nodeSize; n++) {
		var r = e.layoutNodes[n];
		if (!(0 < r.children.length || r.isLocked)) {
			var i = qd(r.offsetX, r.offsetY, e.temperature);
			r.positionX += i.x, r.positionY += i.y, r.offsetX = 0, r.offsetY = 0, r.minX = r.positionX - r.width, r.maxX = r.positionX + r.width, r.minY = r.positionY - r.height, r.maxY = r.positionY + r.height, Jd(r, e);
		}
	}
	for (var n = 0; n < e.nodeSize; n++) {
		var r = e.layoutNodes[n];
		0 < r.children.length && !r.isLocked && (r.positionX = (r.maxX + r.minX) / 2, r.positionY = (r.maxY + r.minY) / 2, r.width = r.maxX - r.minX, r.height = r.maxY - r.minY);
	}
}, qd = function(e, t, n) {
	var r = Math.sqrt(e * e + t * t);
	if (r > n) var i = {
		x: n * e / r,
		y: n * t / r
	};
	else var i = {
		x: e,
		y: t
	};
	return i;
}, Jd = function(e, t) {
	var n = e.parentId;
	if (n != null) {
		var r = t.layoutNodes[t.idToIndex[n]], i = !1;
		if ((r.maxX == null || e.maxX + r.padRight > r.maxX) && (r.maxX = e.maxX + r.padRight, i = !0), (r.minX == null || e.minX - r.padLeft < r.minX) && (r.minX = e.minX - r.padLeft, i = !0), (r.maxY == null || e.maxY + r.padBottom > r.maxY) && (r.maxY = e.maxY + r.padBottom, i = !0), (r.minY == null || e.minY - r.padTop < r.minY) && (r.minY = e.minY - r.padTop, i = !0), i) return Jd(r, t);
	}
}, Yd = function(e, t) {
	for (var n = e.layoutNodes, r = [], i = 0; i < n.length; i++) {
		var a = n[i], o = a.cmptId;
		(r[o] = r[o] || []).push(a);
	}
	for (var s = 0, i = 0; i < r.length; i++) {
		var c = r[i];
		if (c) {
			c.x1 = Infinity, c.x2 = -Infinity, c.y1 = Infinity, c.y2 = -Infinity;
			for (var l = 0; l < c.length; l++) {
				var u = c[l];
				c.x1 = Math.min(c.x1, u.positionX - u.width / 2), c.x2 = Math.max(c.x2, u.positionX + u.width / 2), c.y1 = Math.min(c.y1, u.positionY - u.height / 2), c.y2 = Math.max(c.y2, u.positionY + u.height / 2);
			}
			c.w = c.x2 - c.x1, c.h = c.y2 - c.y1, s += c.w * c.h;
		}
	}
	r.sort(function(e, t) {
		return t.w * t.h - e.w * e.h;
	});
	for (var d = 0, f = 0, p = 0, m = 0, h = Math.sqrt(s) * e.clientWidth / e.clientHeight, i = 0; i < r.length; i++) {
		var c = r[i];
		if (c) {
			for (var l = 0; l < c.length; l++) {
				var u = c[l];
				u.isLocked || (u.positionX += d - c.x1, u.positionY += f - c.y1);
			}
			d += c.w + t.componentSpacing, p += c.w + t.componentSpacing, m = Math.max(m, c.h), p > h && (f += m + t.componentSpacing, d = 0, p = 0, m = 0);
		}
	}
}, Xd = {
	fit: !0,
	padding: 30,
	boundingBox: void 0,
	avoidOverlap: !0,
	avoidOverlapPadding: 10,
	nodeDimensionsIncludeLabels: !1,
	spacingFactor: void 0,
	condense: !1,
	rows: void 0,
	cols: void 0,
	position: function(e) {},
	sort: void 0,
	animate: !1,
	animationDuration: 500,
	animationEasing: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	ready: void 0,
	stop: void 0,
	transform: function(e, t) {
		return t;
	}
};
function Zd(e) {
	this.options = Z({}, Xd, e);
}
Zd.prototype.run = function() {
	var e = this.options, t = e, n = e.cy, r = t.eles, i = r.nodes().not(":parent");
	t.sort && (i = i.sort(t.sort));
	var a = nr(t.boundingBox ? t.boundingBox : {
		x1: 0,
		y1: 0,
		w: n.width(),
		h: n.height()
	});
	if (a.h === 0 || a.w === 0) r.nodes().layoutPositions(this, t, function(e) {
		return {
			x: a.x1,
			y: a.y1
		};
	});
	else {
		var o = i.size(), s = Math.sqrt(o * a.h / a.w), c = Math.round(s), l = Math.round(a.w / a.h * s), u = function(e) {
			if (e == null) return Math.min(c, l);
			Math.min(c, l) == c ? c = e : l = e;
		}, d = function(e) {
			if (e == null) return Math.max(c, l);
			Math.max(c, l) == c ? c = e : l = e;
		}, f = t.rows, p = t.cols == null ? t.columns : t.cols;
		if (f != null && p != null) c = f, l = p;
		else if (f != null && p == null) c = f, l = Math.ceil(o / c);
		else if (f == null && p != null) l = p, c = Math.ceil(o / l);
		else if (l * c > o) {
			var m = u(), h = d();
			(m - 1) * h >= o ? u(m - 1) : (h - 1) * m >= o && d(h - 1);
		} else for (; l * c < o;) {
			var g = u(), _ = d();
			(_ + 1) * g >= o ? d(_ + 1) : u(g + 1);
		}
		var v = a.w / l, y = a.h / c;
		if (t.condense && (v = 0, y = 0), t.avoidOverlap) for (var b = 0; b < i.length; b++) {
			var x = i[b], S = x._private.position;
			(S.x == null || S.y == null) && (S.x = 0, S.y = 0);
			var C = x.layoutDimensions(t), w = t.avoidOverlapPadding, T = C.w + w, E = C.h + w;
			v = Math.max(v, T), y = Math.max(y, E);
		}
		for (var D = {}, O = function(e, t) {
			return !!D["c-" + e + "-" + t];
		}, k = function(e, t) {
			D["c-" + e + "-" + t] = !0;
		}, A = 0, j = 0, M = function() {
			j++, j >= l && (j = 0, A++);
		}, N = {}, P = 0; P < i.length; P++) {
			var F = i[P], I = t.position(F);
			if (I && (I.row !== void 0 || I.col !== void 0)) {
				var L = {
					row: I.row,
					col: I.col
				};
				if (L.col === void 0) for (L.col = 0; O(L.row, L.col);) L.col++;
				else if (L.row === void 0) for (L.row = 0; O(L.row, L.col);) L.row++;
				N[F.id()] = L, k(L.row, L.col);
			}
		}
		i.layoutPositions(this, t, function(e, t) {
			var n, r;
			if (e.locked() || e.isParent()) return !1;
			var i = N[e.id()];
			if (i) n = i.col * v + v / 2 + a.x1, r = i.row * y + y / 2 + a.y1;
			else {
				for (; O(A, j);) M();
				n = j * v + v / 2 + a.x1, r = A * y + y / 2 + a.y1, k(A, j), M();
			}
			return {
				x: n,
				y: r
			};
		});
	}
	return this;
};
var Qd = {
	ready: function() {},
	stop: function() {}
};
function $d(e) {
	this.options = Z({}, Qd, e);
}
$d.prototype.run = function() {
	var e = this.options, t = e.eles, n = this;
	return e.cy, n.emit("layoutstart"), t.nodes().positions(function() {
		return {
			x: 0,
			y: 0
		};
	}), n.one("layoutready", e.ready), n.emit("layoutready"), n.one("layoutstop", e.stop), n.emit("layoutstop"), this;
}, $d.prototype.stop = function() {
	return this;
};
var ef = {
	positions: void 0,
	zoom: void 0,
	pan: void 0,
	fit: !0,
	padding: 30,
	spacingFactor: void 0,
	animate: !1,
	animationDuration: 500,
	animationEasing: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	ready: void 0,
	stop: void 0,
	transform: function(e, t) {
		return t;
	}
};
function tf(e) {
	this.options = Z({}, ef, e);
}
tf.prototype.run = function() {
	var e = this.options, t = e.eles.nodes(), n = I(e.positions);
	function r(t) {
		return e.positions == null ? Fn(t.position()) : n ? e.positions(t) : e.positions[t._private.data.id] ?? null;
	}
	return t.layoutPositions(this, e, function(e, t) {
		var n = r(e);
		return e.locked() || n == null ? !1 : n;
	}), this;
};
var nf = {
	fit: !0,
	padding: 30,
	boundingBox: void 0,
	animate: !1,
	animationDuration: 500,
	animationEasing: void 0,
	animateFilter: function(e, t) {
		return !0;
	},
	ready: void 0,
	stop: void 0,
	transform: function(e, t) {
		return t;
	}
};
function rf(e) {
	this.options = Z({}, nf, e);
}
rf.prototype.run = function() {
	var e = this.options, t = e.cy, n = e.eles, r = nr(e.boundingBox ? e.boundingBox : {
		x1: 0,
		y1: 0,
		w: t.width(),
		h: t.height()
	});
	return n.nodes().layoutPositions(this, e, function(e, t) {
		return {
			x: r.x1 + Math.round(Math.random() * r.w),
			y: r.y1 + Math.round(Math.random() * r.h)
		};
	}), this;
};
var af = [
	{
		name: "breadthfirst",
		impl: Sd
	},
	{
		name: "circle",
		impl: wd
	},
	{
		name: "concentric",
		impl: Ed
	},
	{
		name: "cose",
		impl: kd
	},
	{
		name: "grid",
		impl: Zd
	},
	{
		name: "null",
		impl: $d
	},
	{
		name: "preset",
		impl: tf
	},
	{
		name: "random",
		impl: rf
	}
];
function of(e) {
	this.options = e, this.notifications = 0;
}
var sf = function() {}, cf = function() {
	throw Error("A headless instance can not render images");
};
of.prototype = {
	recalculateRenderedStyle: sf,
	notify: function() {
		this.notifications++;
	},
	init: sf,
	isHeadless: function() {
		return !0;
	},
	png: cf,
	jpg: cf
};
var lf = {};
lf.arrowShapeWidth = .3, lf.registerArrowShapes = function() {
	var e = this.arrowShapes = {}, t = this, n = function(e, t, n, r, i, a, o) {
		var s = i.x - n / 2 - o, c = i.x + n / 2 + o, l = i.y - n / 2 - o, u = i.y + n / 2 + o;
		return s <= e && e <= c && l <= t && t <= u;
	}, r = function(e, t, n, r, i) {
		var a = e * Math.cos(r) - t * Math.sin(r), o = e * Math.sin(r) + t * Math.cos(r), s = a * n, c = o * n;
		return {
			x: s + i.x,
			y: c + i.y
		};
	}, i = function(e, t, n, i) {
		for (var a = [], o = 0; o < e.length; o += 2) {
			var s = e[o], c = e[o + 1];
			a.push(r(s, c, t, n, i));
		}
		return a;
	}, a = function(e) {
		for (var t = [], n = 0; n < e.length; n++) {
			var r = e[n];
			t.push(r.x, r.y);
		}
		return t;
	}, o = function(e) {
		return e.pstyle("width").pfValue * e.pstyle("arrow-scale").pfValue * 2;
	}, s = function(r, s) {
		F(s) && (s = e[s]), e[r] = Z({
			name: r,
			points: [
				-.15,
				-.3,
				.15,
				-.3,
				.15,
				.3,
				-.15,
				.3
			],
			collide: function(e, t, n, r, o, s) {
				return wr(e, t, a(i(this.points, n + 2 * s, r, o)));
			},
			roughCollide: n,
			draw: function(e, n, r, a) {
				var o = i(this.points, n, r, a);
				t.arrowShapeImpl("polygon")(e, o);
			},
			spacing: function(e) {
				return 0;
			},
			gap: o
		}, s);
	};
	s("none", {
		collide: Ht,
		roughCollide: Ht,
		draw: Wt,
		spacing: Ut,
		gap: Ut
	}), s("triangle", { points: [
		-.15,
		-.3,
		0,
		0,
		.15,
		-.3
	] }), s("arrow", "triangle"), s("triangle-backcurve", {
		points: e.triangle.points,
		controlPoint: [0, -.15],
		roughCollide: n,
		draw: function(e, n, a, o, s) {
			var c = i(this.points, n, a, o), l = this.controlPoint, u = r(l[0], l[1], n, a, o);
			t.arrowShapeImpl(this.name)(e, c, u);
		},
		gap: function(e) {
			return o(e) * .8;
		}
	}), s("triangle-tee", {
		points: [
			0,
			0,
			.15,
			-.3,
			-.15,
			-.3,
			0,
			0
		],
		pointsTee: [
			-.15,
			-.4,
			-.15,
			-.5,
			.15,
			-.5,
			.15,
			-.4
		],
		collide: function(e, t, n, r, o, s, c) {
			var l = a(i(this.points, n + 2 * c, r, o)), u = a(i(this.pointsTee, n + 2 * c, r, o));
			return wr(e, t, l) || wr(e, t, u);
		},
		draw: function(e, n, r, a, o) {
			var s = i(this.points, n, r, a), c = i(this.pointsTee, n, r, a);
			t.arrowShapeImpl(this.name)(e, s, c);
		}
	}), s("circle-triangle", {
		radius: .15,
		pointsTr: [
			0,
			-.15,
			.15,
			-.45,
			-.15,
			-.45,
			0,
			-.15
		],
		collide: function(e, t, n, r, o, s, c) {
			var l = o, u = (l.x - e) ** 2 + (l.y - t) ** 2 <= ((n + 2 * c) * this.radius) ** 2;
			return wr(e, t, a(i(this.points, n + 2 * c, r, o))) || u;
		},
		draw: function(e, n, r, a, o) {
			var s = i(this.pointsTr, n, r, a);
			t.arrowShapeImpl(this.name)(e, s, a.x, a.y, this.radius * n);
		},
		spacing: function(e) {
			return t.getArrowWidth(e.pstyle("width").pfValue, e.pstyle("arrow-scale").value) * this.radius;
		}
	}), s("triangle-cross", {
		points: [
			0,
			0,
			.15,
			-.3,
			-.15,
			-.3,
			0,
			0
		],
		baseCrossLinePts: [
			-.15,
			-.4,
			-.15,
			-.4,
			.15,
			-.4,
			.15,
			-.4
		],
		crossLinePts: function(e, t) {
			var n = this.baseCrossLinePts.slice(), r = t / e, i = 3, a = 5;
			return n[i] = n[i] - r, n[a] = n[a] - r, n;
		},
		collide: function(e, t, n, r, o, s, c) {
			var l = a(i(this.points, n + 2 * c, r, o)), u = a(i(this.crossLinePts(n, s), n + 2 * c, r, o));
			return wr(e, t, l) || wr(e, t, u);
		},
		draw: function(e, n, r, a, o) {
			var s = i(this.points, n, r, a), c = i(this.crossLinePts(n, o), n, r, a);
			t.arrowShapeImpl(this.name)(e, s, c);
		}
	}), s("vee", {
		points: [
			-.15,
			-.3,
			0,
			0,
			.15,
			-.3,
			0,
			-.15
		],
		gap: function(e) {
			return o(e) * .525;
		}
	}), s("circle", {
		radius: .15,
		collide: function(e, t, n, r, i, a, o) {
			var s = i;
			return (s.x - e) ** 2 + (s.y - t) ** 2 <= ((n + 2 * o) * this.radius) ** 2;
		},
		draw: function(e, n, r, i, a) {
			t.arrowShapeImpl(this.name)(e, i.x, i.y, this.radius * n);
		},
		spacing: function(e) {
			return t.getArrowWidth(e.pstyle("width").pfValue, e.pstyle("arrow-scale").value) * this.radius;
		}
	}), s("tee", {
		points: [
			-.15,
			0,
			-.15,
			-.1,
			.15,
			-.1,
			.15,
			0
		],
		spacing: function(e) {
			return 1;
		},
		gap: function(e) {
			return 1;
		}
	}), s("square", { points: [
		-.15,
		0,
		.15,
		0,
		.15,
		-.3,
		-.15,
		-.3
	] }), s("diamond", {
		points: [
			-.15,
			-.15,
			0,
			-.3,
			.15,
			-.15,
			0,
			0
		],
		gap: function(e) {
			return e.pstyle("width").pfValue * e.pstyle("arrow-scale").value;
		}
	}), s("chevron", {
		points: [
			0,
			0,
			-.15,
			-.15,
			-.1,
			-.2,
			0,
			-.1,
			.1,
			-.2,
			.15,
			-.15
		],
		gap: function(e) {
			return .95 * e.pstyle("width").pfValue * e.pstyle("arrow-scale").value;
		}
	});
};
var uf = {};
uf.projectIntoViewport = function(e, t) {
	var n = this.cy, r = this.findContainerClientCoords(), i = r[0], a = r[1], o = r[4], s = n.pan(), c = n.zoom();
	return [((e - i) / o - s.x) / c, ((t - a) / o - s.y) / c];
}, uf.findContainerClientCoords = function() {
	if (this.containerBB) return this.containerBB;
	var e = this.container, t = e.getBoundingClientRect(), n = this.cy.window().getComputedStyle(e), r = function(e) {
		return parseFloat(n.getPropertyValue(e));
	}, i = {
		left: r("padding-left"),
		right: r("padding-right"),
		top: r("padding-top"),
		bottom: r("padding-bottom")
	}, a = {
		left: r("border-left-width"),
		right: r("border-right-width"),
		top: r("border-top-width"),
		bottom: r("border-bottom-width")
	}, o = e.clientWidth, s = e.clientHeight, c = i.left + i.right, l = i.top + i.bottom, u = a.left + a.right, d = t.width / (o + u), f = o - c, p = s - l, m = t.left + i.left + a.left, h = t.top + i.top + a.top;
	return this.containerBB = [
		m,
		h,
		f,
		p,
		d
	];
}, uf.invalidateContainerClientCoordsCache = function() {
	this.containerBB = null;
}, uf.findNearestElement = function(e, t, n, r) {
	return this.findNearestElements(e, t, n, r)[0];
}, uf.findNearestElements = function(e, t, n, r) {
	var i = this, a = this, o = a.getCachedZSortedEles(), s = [], c = a.cy.zoom(), l = a.cy.hasCompoundNodes(), u = (r ? 24 : 8) / c, d = (r ? 8 : 2) / c, f = (r ? 8 : 2) / c, p = Infinity, m, h;
	n && (o = o.interactive);
	function g(e, t) {
		if (e.isNode()) {
			if (h) return;
			h = e, s.push(e);
		}
		if (e.isEdge() && (t == null || t < p)) {
			if (m) {
				if (m.pstyle("z-compound-depth").value === e.pstyle("z-compound-depth").value && m.pstyle("z-compound-depth").value === e.pstyle("z-compound-depth").value) {
					for (var n = 0; n < s.length; n++) if (s[n].isEdge()) {
						s[n] = e, m = e, p = t ?? p;
						break;
					}
				}
			} else s.push(e), m = e, p = t ?? p;
		}
	}
	function _(n) {
		var r = n.outerWidth() + 2 * d, o = n.outerHeight() + 2 * d, s = r / 2, c = o / 2, l = n.position(), u = n.pstyle("corner-radius").value === "auto" ? "auto" : n.pstyle("corner-radius").pfValue, f = n._private.rscratch;
		if (l.x - s <= e && e <= l.x + s && l.y - c <= t && t <= l.y + c && a.nodeShapes[i.getNodeShape(n)].checkPoint(e, t, 0, r, o, l.x, l.y, u, f)) return g(n, 0), !0;
	}
	function v(n) {
		var r = n._private, o = r.rscratch, c = n.pstyle("width").pfValue, d = n.pstyle("arrow-scale").value, f = c / 2 + u, p = f * f, m = f * 2, h = r.source, v = r.target, y;
		if (o.edgeType === "segments" || o.edgeType === "straight" || o.edgeType === "haystack") {
			for (var b = o.allpts, x = 0; x + 3 < b.length; x += 2) if (vr(e, t, b[x], b[x + 1], b[x + 2], b[x + 3], m) && p > (y = Cr(e, t, b[x], b[x + 1], b[x + 2], b[x + 3]))) return g(n, y), !0;
		} else if (o.edgeType === "bezier" || o.edgeType === "multibezier" || o.edgeType === "self" || o.edgeType === "compound") {
			for (var b = o.allpts, x = 0; x + 5 < o.allpts.length; x += 4) if (yr(e, t, b[x], b[x + 1], b[x + 2], b[x + 3], b[x + 4], b[x + 5], m) && p > (y = Sr(e, t, b[x], b[x + 1], b[x + 2], b[x + 3], b[x + 4], b[x + 5]))) return g(n, y), !0;
		}
		for (var h = h || r.source, v = v || r.target, S = i.getArrowWidth(c, d), C = [
			{
				name: "source",
				x: o.arrowStartX,
				y: o.arrowStartY,
				angle: o.srcArrowAngle
			},
			{
				name: "target",
				x: o.arrowEndX,
				y: o.arrowEndY,
				angle: o.tgtArrowAngle
			},
			{
				name: "mid-source",
				x: o.midX,
				y: o.midY,
				angle: o.midsrcArrowAngle
			},
			{
				name: "mid-target",
				x: o.midX,
				y: o.midY,
				angle: o.midtgtArrowAngle
			}
		], x = 0; x < C.length; x++) {
			var w = C[x], T = a.arrowShapes[n.pstyle(w.name + "-arrow-shape").value], E = n.pstyle("width").pfValue;
			if (T.roughCollide(e, t, S, w.angle, {
				x: w.x,
				y: w.y
			}, E, u) && T.collide(e, t, S, w.angle, {
				x: w.x,
				y: w.y
			}, E, u)) return g(n), !0;
		}
		l && s.length > 0 && (_(h), _(v));
	}
	function y(e, t, n) {
		return an(e, t, n);
	}
	function b(n, r) {
		var i = n._private, a = f, o = r ? r + "-" : "";
		n.boundingBox();
		var s = i.labelBounds[r || "main"], c = n.pstyle(o + "label").value;
		if (n.pstyle("text-events").strValue === "yes" && c) {
			var l = y(i.rscratch, "labelX", r), u = y(i.rscratch, "labelY", r), d = y(i.rscratch, "labelAngle", r), p = n.pstyle(o + "text-margin-x").pfValue, m = n.pstyle(o + "text-margin-y").pfValue, h = s.x1 - a - p, _ = s.x2 + a - p, v = s.y1 - a - m, b = s.y2 + a - m;
			if (d) {
				var x = Math.cos(d), S = Math.sin(d), C = function(e, t) {
					return e -= l, t -= u, {
						x: e * x - t * S + l,
						y: e * S + t * x + u
					};
				}, w = C(h, v), T = C(h, b), E = C(_, v), D = C(_, b);
				if (wr(e, t, [
					w.x + p,
					w.y + m,
					E.x + p,
					E.y + m,
					D.x + p,
					D.y + m,
					T.x + p,
					T.y + m
				])) return g(n), !0;
			} else if (dr(s, e, t)) return g(n), !0;
		}
	}
	for (var x = o.length - 1; x >= 0; x--) {
		var S = o[x];
		S.isNode() ? _(S) || b(S) : v(S) || b(S) || b(S, "source") || b(S, "target");
	}
	return s;
}, uf.getAllInBox = function(e, t, n, r) {
	var i = this.getCachedZSortedEles().interactive, a = 2 / this.cy.zoom(), o = [], s = Math.min(e, n), c = Math.max(e, n), l = Math.min(t, r), u = Math.max(t, r);
	e = s, n = c, t = l, r = u;
	var d = nr({
		x1: e,
		y1: t,
		x2: n,
		y2: r
	}), f = [
		{
			x: d.x1,
			y: d.y1
		},
		{
			x: d.x2,
			y: d.y1
		},
		{
			x: d.x2,
			y: d.y2
		},
		{
			x: d.x1,
			y: d.y2
		}
	], p = [
		[f[0], f[1]],
		[f[1], f[2]],
		[f[2], f[3]],
		[f[3], f[0]]
	];
	function m(e, t, n) {
		return an(e, t, n);
	}
	function h(e, t) {
		var n = e._private, r = a, i = "";
		e.boundingBox();
		var o = n.labelBounds.main;
		if (!o) return null;
		var s = m(n.rscratch, "labelX", t), c = m(n.rscratch, "labelY", t), l = m(n.rscratch, "labelAngle", t), u = e.pstyle(i + "text-margin-x").pfValue, d = e.pstyle(i + "text-margin-y").pfValue, f = o.x1 - r - u, p = o.x2 + r - u, h = o.y1 - r - d, g = o.y2 + r - d;
		if (l) {
			var _ = Math.cos(l), v = Math.sin(l), y = function(e, t) {
				return e -= s, t -= c, {
					x: e * _ - t * v + s,
					y: e * v + t * _ + c
				};
			};
			return [
				y(f, h),
				y(p, h),
				y(p, g),
				y(f, g)
			];
		}
		return [
			{
				x: f,
				y: h
			},
			{
				x: p,
				y: h
			},
			{
				x: p,
				y: g
			},
			{
				x: f,
				y: g
			}
		];
	}
	function g(e, t, n, r) {
		function i(e, t, n) {
			return (n.y - e.y) * (t.x - e.x) > (t.y - e.y) * (n.x - e.x);
		}
		return i(e, n, r) !== i(t, n, r) && i(e, t, n) !== i(e, t, r);
	}
	for (var _ = 0; _ < i.length; _++) {
		var v = i[_];
		if (v.isNode()) {
			var y = v, b = y.pstyle("text-events").strValue === "yes", x = y.pstyle("box-selection").strValue, C = y.pstyle("box-select-labels").strValue === "yes";
			if (x === "none") continue;
			var w = (x === "overlap" || C) && b, T = y.boundingBox({
				includeNodes: !0,
				includeEdges: !1,
				includeLabels: w
			});
			if (x === "contain") {
				var E = !1;
				if (C && b) {
					var D = h(y);
					D && Kr(D, f) && (o.push(y), E = !0);
				}
				!E && pr(d, T) && o.push(y);
			} else if (x === "overlap" && ur(d, T)) {
				var O = y.boundingBox({
					includeNodes: !0,
					includeEdges: !0,
					includeLabels: !1,
					includeMainLabels: !1,
					includeSourceLabels: !1,
					includeTargetLabels: !1
				});
				if (Kr([
					{
						x: O.x1,
						y: O.y1
					},
					{
						x: O.x2,
						y: O.y1
					},
					{
						x: O.x2,
						y: O.y2
					},
					{
						x: O.x1,
						y: O.y2
					}
				], f)) o.push(y);
				else {
					var k = h(y);
					k && Kr(k, f) && o.push(y);
				}
			}
		} else {
			var A = v, j = A._private, M = j.rscratch, N = A.pstyle("box-selection").strValue;
			if (N === "none") continue;
			if (N === "contain") {
				if (M.startX != null && M.startY != null && !dr(d, M.startX, M.startY) || M.endX != null && M.endY != null && !dr(d, M.endX, M.endY)) continue;
				if (M.edgeType === "bezier" || M.edgeType === "multibezier" || M.edgeType === "self" || M.edgeType === "compound" || M.edgeType === "segments" || M.edgeType === "haystack") {
					for (var P = j.rstyle.bezierPts || j.rstyle.linePts || j.rstyle.haystackPts, F = !0, I = 0; I < P.length; I++) if (!fr(d, P[I])) {
						F = !1;
						break;
					}
					F && o.push(A);
				} else M.edgeType === "straight" && o.push(A);
			} else if (N === "overlap") {
				var L = !1;
				if (M.startX != null && M.startY != null && M.endX != null && M.endY != null && (dr(d, M.startX, M.startY) || dr(d, M.endX, M.endY))) o.push(A), L = !0;
				else if (!L && M.edgeType === "haystack") {
					for (var R = j.rstyle.haystackPts, z = 0; z < R.length; z++) if (fr(d, R[z])) {
						o.push(A), L = !0;
						break;
					}
				}
				if (!L) {
					var B = j.rstyle.bezierPts || j.rstyle.linePts || j.rstyle.haystackPts;
					if ((!B || B.length < 2) && M.edgeType === "straight" && M.startX != null && M.startY != null && M.endX != null && M.endY != null && (B = [{
						x: M.startX,
						y: M.startY
					}, {
						x: M.endX,
						y: M.endY
					}]), !B || B.length < 2) continue;
					for (var V = 0; V < B.length - 1; V++) {
						for (var H = B[V], U = B[V + 1], W = 0; W < p.length; W++) {
							var G = S(p[W], 2), K = G[0], q = G[1];
							if (g(H, U, K, q)) {
								o.push(A), L = !0;
								break;
							}
						}
						if (L) break;
					}
				}
			}
		}
	}
	return o;
};
var df = {};
df.calculateArrowAngles = function(e) {
	var t = e._private.rscratch, n = t.edgeType === "haystack", r = t.edgeType === "bezier", i = t.edgeType === "multibezier", a = t.edgeType === "segments", o = t.edgeType === "compound", s = t.edgeType === "self", c, l, u, d, f, p, m, h;
	if (n ? (u = t.haystackPts[0], d = t.haystackPts[1], f = t.haystackPts[2], p = t.haystackPts[3]) : (u = t.arrowStartX, d = t.arrowStartY, f = t.arrowEndX, p = t.arrowEndY), m = t.midX, h = t.midY, a) c = u - t.segpts[0], l = d - t.segpts[1];
	else if (i || o || s || r) {
		var g = t.allpts, _ = Qn(g[0], g[2], g[4], .1), v = Qn(g[1], g[3], g[5], .1);
		c = u - _, l = d - v;
	} else c = u - m, l = d - h;
	t.srcArrowAngle = Kn(c, l);
	var m = t.midX, h = t.midY;
	if (n && (m = (u + f) / 2, h = (d + p) / 2), c = f - u, l = p - d, a) {
		var g = t.allpts;
		if (g.length / 2 % 2 == 0) {
			var y = g.length / 2, b = y - 2;
			c = g[y] - g[b], l = g[y + 1] - g[b + 1];
		} else if (t.isRound) c = t.midVector[1], l = -t.midVector[0];
		else {
			var y = g.length / 2 - 1, b = y - 2;
			c = g[y] - g[b], l = g[y + 1] - g[b + 1];
		}
	} else if (i || o || s) {
		var g = t.allpts, x = t.ctrlpts, S, C, w, T;
		if (x.length / 2 % 2 == 0) {
			var E = g.length / 2 - 1, D = E + 2, O = D + 2;
			S = Qn(g[E], g[D], g[O], 0), C = Qn(g[E + 1], g[D + 1], g[O + 1], 0), w = Qn(g[E], g[D], g[O], 1e-4), T = Qn(g[E + 1], g[D + 1], g[O + 1], 1e-4);
		} else {
			var D = g.length / 2 - 1, E = D - 2, O = D + 2;
			S = Qn(g[E], g[D], g[O], .4999), C = Qn(g[E + 1], g[D + 1], g[O + 1], .4999), w = Qn(g[E], g[D], g[O], .5), T = Qn(g[E + 1], g[D + 1], g[O + 1], .5);
		}
		c = w - S, l = T - C;
	}
	if (t.midtgtArrowAngle = Kn(c, l), t.midDispX = c, t.midDispY = l, c *= -1, l *= -1, a) {
		var g = t.allpts;
		if (g.length / 2 % 2 != 0 && !t.isRound) {
			var y = g.length / 2 - 1, k = y + 2;
			c = -(g[k] - g[y]), l = -(g[k + 1] - g[y + 1]);
		}
	}
	if (t.midsrcArrowAngle = Kn(c, l), a) c = f - t.segpts[t.segpts.length - 2], l = p - t.segpts[t.segpts.length - 1];
	else if (i || o || s || r) {
		var g = t.allpts, A = g.length, _ = Qn(g[A - 6], g[A - 4], g[A - 2], .9), v = Qn(g[A - 5], g[A - 3], g[A - 1], .9);
		c = f - _, l = p - v;
	} else c = f - m, l = p - h;
	t.tgtArrowAngle = Kn(c, l);
}, df.getArrowWidth = df.getArrowHeight = function(e, t) {
	var n = this.arrowWidthCache = this.arrowWidthCache || {}, r = n[e + ", " + t];
	return r || (r = Math.max((e * 13.37) ** .9, 29) * t, n[e + ", " + t] = r, r);
};
var ff, pf, mf = {}, hf = {}, gf, _f, vf, yf, bf, xf, Sf, Cf, wf, Tf, Ef, Df, Of, kf, Af, jf = function(e, t, n) {
	n.x = t.x - e.x, n.y = t.y - e.y, n.len = Math.sqrt(n.x * n.x + n.y * n.y), n.nx = n.x / n.len, n.ny = n.y / n.len, n.ang = Math.atan2(n.ny, n.nx);
}, Mf = function(e, t) {
	t.x = e.x * -1, t.y = e.y * -1, t.nx = e.nx * -1, t.ny = e.ny * -1, t.ang = e.ang > 0 ? -(Math.PI - e.ang) : Math.PI + e.ang;
}, Nf = function(e, t, n, r, i) {
	if (e === Af ? Mf(hf, mf) : jf(t, e, mf), jf(t, n, hf), gf = mf.nx * hf.ny - mf.ny * hf.nx, _f = mf.nx * hf.nx - mf.ny * -hf.ny, bf = Math.asin(Math.max(-1, Math.min(1, gf))), Math.abs(bf) < 1e-6) {
		ff = t.x, pf = t.y, Sf = wf = 0;
		return;
	}
	vf = 1, yf = !1, _f < 0 ? bf < 0 ? bf = Math.PI + bf : (bf = Math.PI - bf, vf = -1, yf = !0) : bf > 0 && (vf = -1, yf = !0), wf = t.radius === void 0 ? r : t.radius, xf = bf / 2, Tf = Math.min(mf.len / 2, hf.len / 2), i ? (Cf = Math.abs(Math.cos(xf) * wf / Math.sin(xf)), Cf > Tf ? (Cf = Tf, Sf = Math.abs(Cf * Math.sin(xf) / Math.cos(xf))) : Sf = wf) : (Cf = Math.min(Tf, wf), Sf = Math.abs(Cf * Math.sin(xf) / Math.cos(xf))), Of = t.x + hf.nx * Cf, kf = t.y + hf.ny * Cf, ff = Of - hf.ny * Sf * vf, pf = kf + hf.nx * Sf * vf, Ef = t.x + mf.nx * Cf, Df = t.y + mf.ny * Cf, Af = t;
};
function Pf(e, t) {
	t.radius === 0 ? e.lineTo(t.cx, t.cy) : e.arc(t.cx, t.cy, t.radius, t.startAngle, t.endAngle, t.counterClockwise);
}
function Ff(e, t, n, r) {
	var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0;
	return r === 0 || t.radius === 0 ? {
		cx: t.x,
		cy: t.y,
		radius: 0,
		startX: t.x,
		startY: t.y,
		stopX: t.x,
		stopY: t.y,
		startAngle: void 0,
		endAngle: void 0,
		counterClockwise: void 0
	} : (Nf(e, t, n, r, i), {
		cx: ff,
		cy: pf,
		radius: Sf,
		startX: Ef,
		startY: Df,
		stopX: Of,
		stopY: kf,
		startAngle: mf.ang + Math.PI / 2 * vf,
		endAngle: hf.ang - Math.PI / 2 * vf,
		counterClockwise: yf
	});
}
var If = .01, Lf = Math.sqrt(2 * If), Rf = {};
Rf.findMidptPtsEtc = function(e, t) {
	var n = t.posPts, r = t.intersectionPts, i = t.vectorNormInverse, a, o = e.pstyle("source-endpoint"), s = e.pstyle("target-endpoint"), c = o.units != null && s.units != null, l = function(e, t, n, r) {
		var i = r - t, a = n - e, o = Math.sqrt(a * a + i * i);
		return {
			x: -i / o,
			y: a / o
		};
	};
	switch (e.pstyle("edge-distances").value) {
		case "node-position":
			a = n;
			break;
		case "intersection":
			a = r;
			break;
		case "endpoints": if (c) {
			var u = S(this.manualEndptToPx(e.source()[0], o), 2), d = u[0], f = u[1], p = S(this.manualEndptToPx(e.target()[0], s), 2), m = p[0], h = p[1], g = {
				x1: d,
				y1: f,
				x2: m,
				y2: h
			};
			i = l(d, f, m, h), a = g;
		} else qt(`Edge ${e.id()} has edge-distances:endpoints specified without manual endpoints specified via source-endpoint and target-endpoint.  Falling back on edge-distances:intersection (default).`), a = r;
	}
	return {
		midptPts: a,
		vectorNormInverse: i
	};
}, Rf.findHaystackPoints = function(e) {
	for (var t = 0; t < e.length; t++) {
		var n = e[t], r = n._private, i = r.rscratch;
		if (!i.haystack) {
			var a = Math.random() * 2 * Math.PI;
			i.source = {
				x: Math.cos(a),
				y: Math.sin(a)
			}, a = Math.random() * 2 * Math.PI, i.target = {
				x: Math.cos(a),
				y: Math.sin(a)
			};
		}
		var o = r.source, s = r.target, c = o.position(), l = s.position(), u = o.width(), d = s.width(), f = o.height(), p = s.height(), m = n.pstyle("haystack-radius").value / 2;
		i.haystackPts = i.allpts = [
			i.source.x * u * m + c.x,
			i.source.y * f * m + c.y,
			i.target.x * d * m + l.x,
			i.target.y * p * m + l.y
		], i.midX = (i.allpts[0] + i.allpts[2]) / 2, i.midY = (i.allpts[1] + i.allpts[3]) / 2, i.edgeType = "haystack", i.haystack = !0, this.storeEdgeProjections(n), this.calculateArrowAngles(n), this.recalculateEdgeLabelProjections(n), this.calculateLabelAngles(n);
	}
}, Rf.findSegmentsPoints = function(e, t) {
	var n = e._private.rscratch, r = e.pstyle("segment-weights"), i = e.pstyle("segment-distances"), a = e.pstyle("segment-radii"), o = e.pstyle("radius-type"), s = Math.min(r.pfValue.length, i.pfValue.length), c = a.pfValue[a.pfValue.length - 1], l = o.pfValue[o.pfValue.length - 1];
	n.edgeType = "segments", n.segpts = [], n.radii = [], n.isArcRadius = [];
	for (var u = 0; u < s; u++) {
		var d = r.pfValue[u], f = i.pfValue[u], p = 1 - d, m = d, h = this.findMidptPtsEtc(e, t), g = h.midptPts, _ = h.vectorNormInverse, v = {
			x: g.x1 * p + g.x2 * m,
			y: g.y1 * p + g.y2 * m
		};
		n.segpts.push(v.x + _.x * f, v.y + _.y * f), n.radii.push(a.pfValue[u] === void 0 ? c : a.pfValue[u]), n.isArcRadius.push((o.pfValue[u] === void 0 ? l : o.pfValue[u]) === "arc-radius");
	}
}, Rf.findLoopPoints = function(e, t, n, r) {
	var i = e._private.rscratch, a = t.dirCounts, o = t.srcPos, s = e.pstyle("control-point-distances"), c = s ? s.pfValue[0] : void 0, l = e.pstyle("loop-direction").pfValue, u = e.pstyle("loop-sweep").pfValue, d = e.pstyle("control-point-step-size").pfValue;
	i.edgeType = "self";
	var f = n, p = d;
	r && (f = 0, p = c);
	var m = l - Math.PI / 2, h = m - u / 2, g = m + u / 2, _ = String(l + "_" + u);
	f = a[_] === void 0 ? a[_] = 0 : ++a[_], i.ctrlpts = [
		o.x + Math.cos(h) * 1.4 * p * (f / 3 + 1),
		o.y + Math.sin(h) * 1.4 * p * (f / 3 + 1),
		o.x + Math.cos(g) * 1.4 * p * (f / 3 + 1),
		o.y + Math.sin(g) * 1.4 * p * (f / 3 + 1)
	];
}, Rf.findCompoundLoopPoints = function(e, t, n, r) {
	var i = e._private.rscratch;
	i.edgeType = "compound";
	var a = t.srcPos, o = t.tgtPos, s = t.srcW, c = t.srcH, l = t.tgtW, u = t.tgtH, d = e.pstyle("control-point-step-size").pfValue, f = e.pstyle("control-point-distances"), p = f ? f.pfValue[0] : void 0, m = n, h = d;
	r && (m = 0, h = p);
	var g = 50, _ = {
		x: a.x - s / 2,
		y: a.y - c / 2
	}, v = {
		x: o.x - l / 2,
		y: o.y - u / 2
	}, y = {
		x: Math.min(_.x, v.x),
		y: Math.min(_.y, v.y)
	}, b = .5, x = Math.max(b, Math.log(s * If)), S = Math.max(b, Math.log(l * If));
	i.ctrlpts = [
		y.x,
		y.y - (1 + g ** 1.12 / 100) * h * (m / 3 + 1) * x,
		y.x - (1 + g ** 1.12 / 100) * h * (m / 3 + 1) * S,
		y.y
	];
}, Rf.findStraightEdgePoints = function(e) {
	e._private.rscratch.edgeType = "straight";
}, Rf.findBezierPoints = function(e, t, n, r, i) {
	var a = e._private.rscratch, o = e.pstyle("control-point-step-size").pfValue, s = e.pstyle("control-point-distances"), c = e.pstyle("control-point-weights"), l = s && c ? Math.min(s.value.length, c.value.length) : 1, u = s ? s.pfValue[0] : void 0, d = c.value[0], f = r;
	a.edgeType = f ? "multibezier" : "bezier", a.ctrlpts = [];
	for (var p = 0; p < l; p++) {
		var m = (.5 - t.eles.length / 2 + n) * o * (i ? -1 : 1), h = void 0, g = Jn(m);
		f && (u = s ? s.pfValue[p] : o, d = c.value[p]), h = r ? u : u === void 0 ? void 0 : g * u;
		var _ = h === void 0 ? m : h, v = 1 - d, y = d, b = this.findMidptPtsEtc(e, t), x = b.midptPts, S = b.vectorNormInverse, C = {
			x: x.x1 * v + x.x2 * y,
			y: x.y1 * v + x.y2 * y
		};
		a.ctrlpts.push(C.x + S.x * _, C.y + S.y * _);
	}
}, Rf.findTaxiPoints = function(e, t) {
	var n = e._private.rscratch;
	n.edgeType = "segments";
	var r = "vertical", i = "horizontal", a = "leftward", o = "rightward", s = "downward", c = "upward", l = "auto", u = t.posPts, d = t.srcW, f = t.srcH, p = t.tgtW, m = t.tgtH, h = e.pstyle("edge-distances").value !== "node-position", g = e.pstyle("taxi-direction").value, _ = g, v = e.pstyle("taxi-turn"), y = v.units === "%", b = v.pfValue, x = b < 0, S = e.pstyle("taxi-turn-min-distance").pfValue, C = h ? (d + p) / 2 : 0, w = h ? (f + m) / 2 : 0, T = u.x2 - u.x1, E = u.y2 - u.y1, D = function(e, t) {
		return e > 0 ? Math.max(e - t, 0) : Math.min(e + t, 0);
	}, O = D(T, C), k = D(E, w), A = !1;
	_ === l ? g = Math.abs(O) > Math.abs(k) ? i : r : _ === c || _ === s ? (g = r, A = !0) : (_ === a || _ === o) && (g = i, A = !0);
	var j = g === r, M = j ? k : O, N = j ? E : T, P = Jn(N), F = !1;
	!(A && (y || x)) && (_ === s && N < 0 || _ === c && N > 0 || _ === a && N > 0 || _ === o && N < 0) && (P *= -1, M = P * Math.abs(M), F = !0);
	var I = y ? (b < 0 ? 1 + b : b) * M : (b < 0 ? M : 0) + b * P, L = function(e) {
		return Math.abs(e) < S || Math.abs(e) >= Math.abs(M);
	}, R = L(I), z = L(Math.abs(M) - Math.abs(I));
	if ((R || z) && !F) {
		if (j) {
			var B = Math.abs(N) <= f / 2, V = Math.abs(T) <= p / 2;
			if (B) {
				var H = (u.x1 + u.x2) / 2;
				n.segpts = [
					H,
					u.y1,
					H,
					u.y2
				];
			} else if (V) {
				var U = (u.y1 + u.y2) / 2;
				n.segpts = [
					u.x1,
					U,
					u.x2,
					U
				];
			} else n.segpts = [u.x1, u.y2];
		} else {
			var W = Math.abs(N) <= d / 2, G = Math.abs(E) <= m / 2;
			if (W) {
				var K = (u.y1 + u.y2) / 2;
				n.segpts = [
					u.x1,
					K,
					u.x2,
					K
				];
			} else if (G) {
				var q = (u.x1 + u.x2) / 2;
				n.segpts = [
					q,
					u.y1,
					q,
					u.y2
				];
			} else n.segpts = [u.x2, u.y1];
		}
	} else if (j) {
		var ee = u.y1 + I + (h ? f / 2 * P : 0);
		n.segpts = [
			u.x1,
			ee,
			u.x2,
			ee
		];
	} else {
		var J = u.x1 + I + (h ? d / 2 * P : 0);
		n.segpts = [
			J,
			u.y1,
			J,
			u.y2
		];
	}
	if (n.isRound) {
		var Y = e.pstyle("taxi-radius").value, te = e.pstyle("radius-type").value[0] === "arc-radius";
		n.radii = Array(n.segpts.length / 2).fill(Y), n.isArcRadius = Array(n.segpts.length / 2).fill(te);
	}
}, Rf.tryToCorrectInvalidPoints = function(e, t) {
	var n = e._private.rscratch;
	if (n.edgeType === "bezier") {
		var r = t.srcPos, i = t.tgtPos, a = t.srcW, o = t.srcH, s = t.tgtW, c = t.tgtH, l = t.srcShape, u = t.tgtShape, d = t.srcCornerRadius, f = t.tgtCornerRadius, p = t.srcRs, m = t.tgtRs, h = !B(n.startX) || !B(n.startY), g = !B(n.arrowStartX) || !B(n.arrowStartY), _ = !B(n.endX) || !B(n.endY), v = !B(n.arrowEndX) || !B(n.arrowEndY), y = 3 * (this.getArrowWidth(e.pstyle("width").pfValue, e.pstyle("arrow-scale").value) * this.arrowShapeWidth), b = Yn({
			x: n.ctrlpts[0],
			y: n.ctrlpts[1]
		}, {
			x: n.startX,
			y: n.startY
		}), x = b < y, S = Yn({
			x: n.ctrlpts[0],
			y: n.ctrlpts[1]
		}, {
			x: n.endX,
			y: n.endY
		}), C = S < y, w = !1;
		if (h || g || x) {
			w = !0;
			var T = {
				x: n.ctrlpts[0] - r.x,
				y: n.ctrlpts[1] - r.y
			}, E = Math.sqrt(T.x * T.x + T.y * T.y), D = {
				x: T.x / E,
				y: T.y / E
			}, O = Math.max(a, o), k = {
				x: n.ctrlpts[0] + D.x * 2 * O,
				y: n.ctrlpts[1] + D.y * 2 * O
			}, A = l.intersectLine(r.x, r.y, a, o, k.x, k.y, 0, d, p);
			x ? (n.ctrlpts[0] = n.ctrlpts[0] + D.x * (y - b), n.ctrlpts[1] = n.ctrlpts[1] + D.y * (y - b)) : (n.ctrlpts[0] = A[0] + D.x * y, n.ctrlpts[1] = A[1] + D.y * y);
		}
		if (_ || v || C) {
			w = !0;
			var j = {
				x: n.ctrlpts[0] - i.x,
				y: n.ctrlpts[1] - i.y
			}, M = Math.sqrt(j.x * j.x + j.y * j.y), N = {
				x: j.x / M,
				y: j.y / M
			}, P = Math.max(a, o), F = {
				x: n.ctrlpts[0] + N.x * 2 * P,
				y: n.ctrlpts[1] + N.y * 2 * P
			}, I = u.intersectLine(i.x, i.y, s, c, F.x, F.y, 0, f, m);
			C ? (n.ctrlpts[0] = n.ctrlpts[0] + N.x * (y - S), n.ctrlpts[1] = n.ctrlpts[1] + N.y * (y - S)) : (n.ctrlpts[0] = I[0] + N.x * y, n.ctrlpts[1] = I[1] + N.y * y);
		}
		w && this.findEndpoints(e);
	}
}, Rf.storeAllpts = function(e) {
	var t = e._private.rscratch;
	if (t.edgeType === "multibezier" || t.edgeType === "bezier" || t.edgeType === "self" || t.edgeType === "compound") {
		t.allpts = [], t.allpts.push(t.startX, t.startY);
		for (var n = 0; n + 1 < t.ctrlpts.length; n += 2) t.allpts.push(t.ctrlpts[n], t.ctrlpts[n + 1]), n + 3 < t.ctrlpts.length && t.allpts.push((t.ctrlpts[n] + t.ctrlpts[n + 2]) / 2, (t.ctrlpts[n + 1] + t.ctrlpts[n + 3]) / 2);
		t.allpts.push(t.endX, t.endY);
		var r, i;
		t.ctrlpts.length / 2 % 2 == 0 ? (r = t.allpts.length / 2 - 1, t.midX = t.allpts[r], t.midY = t.allpts[r + 1]) : (r = t.allpts.length / 2 - 3, i = .5, t.midX = Qn(t.allpts[r], t.allpts[r + 2], t.allpts[r + 4], i), t.midY = Qn(t.allpts[r + 1], t.allpts[r + 3], t.allpts[r + 5], i));
	} else if (t.edgeType === "straight") t.allpts = [
		t.startX,
		t.startY,
		t.endX,
		t.endY
	], t.midX = (t.startX + t.endX + t.arrowStartX + t.arrowEndX) / 4, t.midY = (t.startY + t.endY + t.arrowStartY + t.arrowEndY) / 4;
	else if (t.edgeType === "segments") {
		if (t.allpts = [], t.allpts.push(t.startX, t.startY), t.allpts.push.apply(t.allpts, t.segpts), t.allpts.push(t.endX, t.endY), t.isRound) {
			t.roundCorners = [];
			for (var a = 2; a + 3 < t.allpts.length; a += 2) {
				var o = t.radii[a / 2 - 1], s = t.isArcRadius[a / 2 - 1];
				t.roundCorners.push(Ff({
					x: t.allpts[a - 2],
					y: t.allpts[a - 1]
				}, {
					x: t.allpts[a],
					y: t.allpts[a + 1],
					radius: o
				}, {
					x: t.allpts[a + 2],
					y: t.allpts[a + 3]
				}, o, s));
			}
		}
		if (t.segpts.length % 4 == 0) {
			var c = t.segpts.length / 2, l = c - 2;
			t.midX = (t.segpts[l] + t.segpts[c]) / 2, t.midY = (t.segpts[l + 1] + t.segpts[c + 1]) / 2;
		} else {
			var u = t.segpts.length / 2 - 1;
			if (!t.isRound) t.midX = t.segpts[u], t.midY = t.segpts[u + 1];
			else {
				var d = {
					x: t.segpts[u],
					y: t.segpts[u + 1]
				}, f = t.roundCorners[u / 2];
				if (f.radius === 0) {
					var p = {
						x: t.segpts[u + 2],
						y: t.segpts[u + 3]
					};
					t.midX = d.x, t.midY = d.y, t.midVector = [d.y - p.y, p.x - d.x];
				} else {
					var m = [d.x - f.cx, d.y - f.cy], h = f.radius / Math.sqrt(m[0] ** 2 + m[1] ** 2);
					m = m.map(function(e) {
						return e * h;
					}), t.midX = f.cx + m[0], t.midY = f.cy + m[1], t.midVector = m;
				}
			}
		}
	}
}, Rf.checkForInvalidEdgeWarning = function(e) {
	var t = e[0]._private.rscratch;
	t.nodesOverlap || B(t.startX) && B(t.startY) && B(t.endX) && B(t.endY) ? t.loggedErr = !1 : t.loggedErr || (t.loggedErr = !0, qt("Edge `" + e.id() + "` has invalid endpoints and so it is impossible to draw.  Adjust your edge style (e.g. control points) accordingly or use an alternative edge type.  This is expected behaviour when the source node and the target node overlap."));
}, Rf.findEdgeControlPoints = function(e) {
	var t = this;
	if (e && e.length !== 0) {
		for (var n = this, r = n.cy.hasCompoundNodes(), i = new sn(), a = function(e, t) {
			return [].concat(C(e), [+!!t]).join("-");
		}, o = [], s = [], c = 0; c < e.length; c++) {
			var l = e[c], u = l._private, d = l.pstyle("curve-style").value;
			if (!l.removed() && l.takesUpSpace()) {
				if (d === "haystack") {
					s.push(l);
					continue;
				}
				var f = d === "unbundled-bezier" || le(d, "segments") || d === "straight" || d === "straight-triangle" || le(d, "taxi"), p = d === "unbundled-bezier" || d === "bezier", m = u.source, h = u.target, g = [m.poolIndex(), h.poolIndex()].sort(), _ = a(g, f), v = i.get(_);
				v ?? (v = { eles: [] }, o.push({
					pairId: g,
					edgeIsUnbundled: f
				}), i.set(_, v)), v.eles.push(l), f && (v.hasUnbundled = !0), p && (v.hasBezier = !0);
			}
		}
		for (var y = function() {
			var e = o[b], s = e.pairId, c = e.edgeIsUnbundled, l = a(s, c), u = i.get(l), d;
			if (!u.hasUnbundled) {
				var f = u.eles[0].parallelEdges().filter(function(e) {
					return e.isBundledBezier();
				});
				nn(u.eles), f.forEach(function(e) {
					return u.eles.push(e);
				}), u.eles.sort(function(e, t) {
					return e.poolIndex() - t.poolIndex();
				});
			}
			var p = u.eles[0], m = p.source(), h = p.target();
			if (m.poolIndex() > h.poolIndex()) {
				var g = m;
				m = h, h = g;
			}
			var _ = u.srcPos = m.position(), v = u.tgtPos = h.position(), y = u.srcW = m.outerWidth(), x = u.srcH = m.outerHeight(), S = u.tgtW = h.outerWidth(), C = u.tgtH = h.outerHeight(), w = u.srcShape = n.nodeShapes[t.getNodeShape(m)], T = u.tgtShape = n.nodeShapes[t.getNodeShape(h)], E = u.srcCornerRadius = m.pstyle("corner-radius").value === "auto" ? "auto" : m.pstyle("corner-radius").pfValue, D = u.tgtCornerRadius = h.pstyle("corner-radius").value === "auto" ? "auto" : h.pstyle("corner-radius").pfValue, O = u.tgtRs = h._private.rscratch, k = u.srcRs = m._private.rscratch;
			u.dirCounts = {
				north: 0,
				west: 0,
				south: 0,
				east: 0,
				northwest: 0,
				southwest: 0,
				northeast: 0,
				southeast: 0
			};
			for (var A = 0; A < u.eles.length; A++) {
				var j = u.eles[A], M = j[0]._private.rscratch, N = j.pstyle("curve-style").value, P = N === "unbundled-bezier" || le(N, "segments") || le(N, "taxi"), F = !m.same(j.source());
				if (!u.calculatedIntersection && m !== h && (u.hasBezier || u.hasUnbundled)) {
					u.calculatedIntersection = !0;
					var I = w.intersectLine(_.x, _.y, y, x, v.x, v.y, 0, E, k), L = u.srcIntn = I, R = T.intersectLine(v.x, v.y, S, C, _.x, _.y, 0, D, O), z = u.tgtIntn = R, V = u.intersectionPts = {
						x1: I[0],
						x2: R[0],
						y1: I[1],
						y2: R[1]
					}, H = u.posPts = {
						x1: _.x,
						x2: v.x,
						y1: _.y,
						y2: v.y
					}, U = R[1] - I[1], W = R[0] - I[0], G = Math.sqrt(W * W + U * U);
					B(G) && G >= Lf || (G = Math.sqrt(Math.max(W * W, If) + Math.max(U * U, If)));
					var K = u.vector = {
						x: W,
						y: U
					}, q = u.vectorNorm = {
						x: K.x / G,
						y: K.y / G
					}, ee = {
						x: -q.y,
						y: q.x
					};
					u.nodesOverlap = !B(G) || T.checkPoint(I[0], I[1], 0, S, C, v.x, v.y, D, O) || w.checkPoint(R[0], R[1], 0, y, x, _.x, _.y, E, k), u.vectorNormInverse = ee, d = {
						nodesOverlap: u.nodesOverlap,
						dirCounts: u.dirCounts,
						calculatedIntersection: !0,
						hasBezier: u.hasBezier,
						hasUnbundled: u.hasUnbundled,
						eles: u.eles,
						srcPos: v,
						srcRs: O,
						tgtPos: _,
						tgtRs: k,
						srcW: S,
						srcH: C,
						tgtW: y,
						tgtH: x,
						srcIntn: z,
						tgtIntn: L,
						srcShape: T,
						tgtShape: w,
						posPts: {
							x1: H.x2,
							y1: H.y2,
							x2: H.x1,
							y2: H.y1
						},
						intersectionPts: {
							x1: V.x2,
							y1: V.y2,
							x2: V.x1,
							y2: V.y1
						},
						vector: {
							x: -K.x,
							y: -K.y
						},
						vectorNorm: {
							x: -q.x,
							y: -q.y
						},
						vectorNormInverse: {
							x: -ee.x,
							y: -ee.y
						}
					};
				}
				var J = F ? d : u;
				M.nodesOverlap = J.nodesOverlap, M.srcIntn = J.srcIntn, M.tgtIntn = J.tgtIntn, M.isRound = N.startsWith("round"), r && (m.isParent() || m.isChild() || h.isParent() || h.isChild()) && (m.parents().anySame(h) || h.parents().anySame(m) || m.same(h) && m.isParent()) ? t.findCompoundLoopPoints(j, J, A, P) : m === h ? t.findLoopPoints(j, J, A, P) : N.endsWith("segments") ? t.findSegmentsPoints(j, J) : N.endsWith("taxi") ? t.findTaxiPoints(j, J) : N === "straight" || !P && u.eles.length % 2 == 1 && A === Math.floor(u.eles.length / 2) ? t.findStraightEdgePoints(j) : t.findBezierPoints(j, J, A, P, F), t.findEndpoints(j), t.tryToCorrectInvalidPoints(j, J), t.checkForInvalidEdgeWarning(j), t.storeAllpts(j), t.storeEdgeProjections(j), t.calculateArrowAngles(j), t.recalculateEdgeLabelProjections(j), t.calculateLabelAngles(j);
			}
		}, b = 0; b < o.length; b++) y();
		this.findHaystackPoints(s);
	}
};
function zf(e) {
	var t = [];
	if (e != null) {
		for (var n = 0; n < e.length; n += 2) {
			var r = e[n], i = e[n + 1];
			t.push({
				x: r,
				y: i
			});
		}
		return t;
	}
}
Rf.getSegmentPoints = function(e) {
	var t = e[0]._private.rscratch;
	if (this.recalculateRenderedStyle(e), t.edgeType === "segments") return zf(t.segpts);
}, Rf.getControlPoints = function(e) {
	var t = e[0]._private.rscratch;
	this.recalculateRenderedStyle(e);
	var n = t.edgeType;
	if (n === "bezier" || n === "multibezier" || n === "self" || n === "compound") return zf(t.ctrlpts);
}, Rf.getEdgeMidpoint = function(e) {
	var t = e[0]._private.rscratch;
	return this.recalculateRenderedStyle(e), {
		x: t.midX,
		y: t.midY
	};
};
var Bf = {};
Bf.manualEndptToPx = function(e, t) {
	var n = this, r = e.position(), i = e.outerWidth(), a = e.outerHeight(), o = e._private.rscratch;
	if (t.value.length === 2) {
		var s = [t.pfValue[0], t.pfValue[1]];
		return t.units[0] === "%" && (s[0] *= i), t.units[1] === "%" && (s[1] *= a), s[0] += r.x, s[1] += r.y, s;
	}
	var c = t.pfValue[0];
	c = -Math.PI / 2 + c;
	var l = 2 * Math.max(i, a), u = [r.x + Math.cos(c) * l, r.y + Math.sin(c) * l];
	return n.nodeShapes[this.getNodeShape(e)].intersectLine(r.x, r.y, i, a, u[0], u[1], 0, e.pstyle("corner-radius").value === "auto" ? "auto" : e.pstyle("corner-radius").pfValue, o);
}, Bf.findEndpoints = function(e) {
	var t, n, r = this, i, a = e.source()[0], o = e.target()[0], s = a.position(), c = o.position(), l = e.pstyle("target-arrow-shape").value, u = e.pstyle("source-arrow-shape").value, d = e.pstyle("target-distance-from-node").pfValue, f = e.pstyle("source-distance-from-node").pfValue, p = a._private.rscratch, m = o._private.rscratch, h = e.pstyle("curve-style").value, g = e._private.rscratch, _ = g.edgeType, v = le(h, "taxi"), y = _ === "self" || _ === "compound", b = _ === "bezier" || _ === "multibezier" || y, x = _ !== "bezier", S = _ === "straight" || _ === "segments", C = _ === "segments", w = b || x || S, T = y || v, E = e.pstyle("source-endpoint"), D = T ? "outside-to-node" : E.value, O = a.pstyle("corner-radius").value === "auto" ? "auto" : a.pstyle("corner-radius").pfValue, k = e.pstyle("target-endpoint"), A = T ? "outside-to-node" : k.value, j = o.pstyle("corner-radius").value === "auto" ? "auto" : o.pstyle("corner-radius").pfValue;
	g.srcManEndpt = E, g.tgtManEndpt = k;
	var M, N, P, F, I = ((k == null || (t = k.pfValue) == null ? void 0 : t.length) === 2 ? k.pfValue : null) ?? [0, 0], L = ((E == null || (n = E.pfValue) == null ? void 0 : n.length) === 2 ? E.pfValue : null) ?? [0, 0];
	if (b) {
		var R = [g.ctrlpts[0], g.ctrlpts[1]];
		M = x ? [g.ctrlpts[g.ctrlpts.length - 2], g.ctrlpts[g.ctrlpts.length - 1]] : R, N = R;
	} else if (S) {
		var z = C ? g.segpts.slice(0, 2) : [c.x + I[0], c.y + I[1]];
		M = C ? g.segpts.slice(g.segpts.length - 2) : [s.x + L[0], s.y + L[1]], N = z;
	}
	if (A === "inside-to-node") i = [c.x, c.y];
	else if (k.units) i = this.manualEndptToPx(o, k);
	else if (A === "outside-to-line") i = g.tgtIntn;
	else if (A === "outside-to-node" || A === "outside-to-node-or-label" ? P = M : (A === "outside-to-line" || A === "outside-to-line-or-label") && (P = [s.x, s.y]), i = r.nodeShapes[this.getNodeShape(o)].intersectLine(c.x, c.y, o.outerWidth(), o.outerHeight(), P[0], P[1], 0, j, m), A === "outside-to-node-or-label" || A === "outside-to-line-or-label") {
		var V = o._private.rscratch, H = V.labelWidth, U = V.labelHeight, W = V.labelX, G = V.labelY, K = H / 2, q = U / 2, ee = o.pstyle("text-valign").value;
		ee = pl(ee), ee === "top" ? G -= q : ee === "bottom" && (G += q);
		var J = o.pstyle("text-halign").value;
		J = fl(J), J === "left" ? W -= K : J === "right" && (W += K);
		var Y = Fr(P[0], P[1], [
			W - K,
			G - q,
			W + K,
			G - q,
			W + K,
			G + q,
			W - K,
			G + q
		], c.x, c.y);
		if (Y.length > 0) {
			var te = s, ne = Xn(te, Rn(i)), re = Xn(te, Rn(Y)), ie = ne;
			re < ne && (i = Y, ie = re), Y.length > 2 && Xn(te, {
				x: Y[2],
				y: Y[3]
			}) < ie && (i = [Y[2], Y[3]]);
		}
	}
	var ae = Lr(i, M, r.arrowShapes[l].spacing(e) + d), oe = Lr(i, M, r.arrowShapes[l].gap(e) + d);
	if (g.endX = oe[0], g.endY = oe[1], g.arrowEndX = ae[0], g.arrowEndY = ae[1], D === "inside-to-node") i = [s.x, s.y];
	else if (E.units) i = this.manualEndptToPx(a, E);
	else if (D === "outside-to-line") i = g.srcIntn;
	else if (D === "outside-to-node" || D === "outside-to-node-or-label" ? F = N : (D === "outside-to-line" || D === "outside-to-line-or-label") && (F = [c.x, c.y]), i = r.nodeShapes[this.getNodeShape(a)].intersectLine(s.x, s.y, a.outerWidth(), a.outerHeight(), F[0], F[1], 0, O, p), D === "outside-to-node-or-label" || D === "outside-to-line-or-label") {
		var se = a._private.rscratch, ce = se.labelWidth, ue = se.labelHeight, de = se.labelX, fe = se.labelY, pe = ce / 2, me = ue / 2, he = a.pstyle("text-valign").value;
		he = pl(he), he === "top" ? fe -= me : he === "bottom" && (fe += me);
		var X = a.pstyle("text-halign").value;
		X = fl(X), X === "left" ? de -= pe : X === "right" && (de += pe);
		var ge = Fr(F[0], F[1], [
			de - pe,
			fe - me,
			de + pe,
			fe - me,
			de + pe,
			fe + me,
			de - pe,
			fe + me
		], s.x, s.y);
		if (ge.length > 0) {
			var _e = c, Z = Xn(_e, Rn(i)), ve = Xn(_e, Rn(ge)), ye = Z;
			ve < Z && (i = [ge[0], ge[1]], ye = ve), ge.length > 2 && Xn(_e, {
				x: ge[2],
				y: ge[3]
			}) < ye && (i = [ge[2], ge[3]]);
		}
	}
	var be = Lr(i, N, r.arrowShapes[u].spacing(e) + f), xe = Lr(i, N, r.arrowShapes[u].gap(e) + f);
	g.startX = xe[0], g.startY = xe[1], g.arrowStartX = be[0], g.arrowStartY = be[1], w && (g.badLine = !B(g.startX) || !B(g.startY) || !B(g.endX) || !B(g.endY));
}, Bf.getSourceEndpoint = function(e) {
	var t = e[0]._private.rscratch;
	switch (this.recalculateRenderedStyle(e), t.edgeType) {
		case "haystack": return {
			x: t.haystackPts[0],
			y: t.haystackPts[1]
		};
		default: return {
			x: t.arrowStartX,
			y: t.arrowStartY
		};
	}
}, Bf.getTargetEndpoint = function(e) {
	var t = e[0]._private.rscratch;
	switch (this.recalculateRenderedStyle(e), t.edgeType) {
		case "haystack": return {
			x: t.haystackPts[2],
			y: t.haystackPts[3]
		};
		default: return {
			x: t.arrowEndX,
			y: t.arrowEndY
		};
	}
};
var Vf = {};
function Hf(e, t, n) {
	for (var r = function(e, t, n, r) {
		return Qn(e, t, n, r);
	}, i = t._private.rstyle.bezierPts, a = 0; a < e.bezierProjPcts.length; a++) {
		var o = e.bezierProjPcts[a];
		i.push({
			x: r(n[0], n[2], n[4], o),
			y: r(n[1], n[3], n[5], o)
		});
	}
}
Vf.storeEdgeProjections = function(e) {
	var t = e._private, n = t.rscratch, r = n.edgeType;
	if (t.rstyle.bezierPts = null, t.rstyle.linePts = null, t.rstyle.haystackPts = null, r === "multibezier" || r === "bezier" || r === "self" || r === "compound") {
		t.rstyle.bezierPts = [];
		for (var i = 0; i + 5 < n.allpts.length; i += 4) Hf(this, e, n.allpts.slice(i, i + 6));
	} else if (r === "segments") for (var a = t.rstyle.linePts = [], i = 0; i + 1 < n.allpts.length; i += 2) a.push({
		x: n.allpts[i],
		y: n.allpts[i + 1]
	});
	else if (r === "haystack") {
		var o = n.haystackPts;
		t.rstyle.haystackPts = [{
			x: o[0],
			y: o[1]
		}, {
			x: o[2],
			y: o[3]
		}];
	}
	t.rstyle.arrowWidth = this.getArrowWidth(e.pstyle("width").pfValue, e.pstyle("arrow-scale").value) * this.arrowShapeWidth;
}, Vf.recalculateEdgeProjections = function(e) {
	this.findEdgeControlPoints(e);
};
var Uf = {};
Uf.recalculateNodeLabelProjection = function(e) {
	var t = e.pstyle("label").strValue;
	if (!J(t)) {
		var n, r, i = e._private, a = e.width(), o = e.height(), s = e.padding(), c = e.position(), l = e.pstyle("text-halign").strValue, u = e.pstyle("text-valign").strValue, d = i.rscratch, f = i.rstyle;
		switch (l) {
			case "left":
				n = c.x - a / 2 - s;
				break;
			case "left-inside":
				n = c.x - a / 2 + s;
				break;
			case "right":
				n = c.x + a / 2 + s;
				break;
			case "right-inside":
				n = c.x + a / 2 - s;
				break;
			default: n = c.x;
		}
		switch (u) {
			case "top":
				r = c.y - o / 2 - s;
				break;
			case "top-inside":
				r = c.y - o / 2 + s;
				break;
			case "bottom":
				r = c.y + o / 2 + s;
				break;
			case "bottom-inside":
				r = c.y + o / 2 - s;
				break;
			default: r = c.y;
		}
		d.labelX = n, d.labelY = r, f.labelX = n, f.labelY = r, this.calculateLabelAngles(e), this.applyLabelDimensions(e);
	}
};
var Wf = function(e, t) {
	var n = Math.atan(t / e);
	return e === 0 && n < 0 && (n *= -1), n;
}, Gf = function(e, t) {
	return Wf(t.x - e.x, t.y - e.y);
}, Kf = function(e, t, n, r) {
	var i = tr(0, r - .001, 1), a = tr(0, r + .001, 1);
	return Gf($n(e, t, n, i), $n(e, t, n, a));
};
Uf.recalculateEdgeLabelProjections = function(e) {
	var t, n = e._private, r = n.rscratch, i = this, a = {
		mid: e.pstyle("label").strValue,
		source: e.pstyle("source-label").strValue,
		target: e.pstyle("target-label").strValue
	};
	if (a.mid || a.source || a.target) {
		t = {
			x: r.midX,
			y: r.midY
		};
		var o = function(e, t, r) {
			on(n.rscratch, e, t, r), on(n.rstyle, e, t, r);
		};
		o("labelX", null, t.x), o("labelY", null, t.y), o("labelAutoAngle", null, Wf(r.midDispX, r.midDispY));
		var s = function() {
			if (s.cache) return s.cache;
			for (var e = [], t = 0; t + 5 < r.allpts.length; t += 4) {
				var a = {
					x: r.allpts[t],
					y: r.allpts[t + 1]
				}, o = {
					x: r.allpts[t + 2],
					y: r.allpts[t + 3]
				}, c = {
					x: r.allpts[t + 4],
					y: r.allpts[t + 5]
				};
				e.push({
					p0: a,
					p1: o,
					p2: c,
					startDist: 0,
					length: 0,
					segments: []
				});
			}
			var l = n.rstyle.bezierPts, u = i.bezierProjPcts.length;
			function d(e, t, n, r, i) {
				var a = Yn(t, n), o = e.segments[e.segments.length - 1], s = {
					p0: t,
					p1: n,
					t0: r,
					t1: i,
					startDist: o ? o.startDist + o.length : 0,
					length: a
				};
				e.segments.push(s), e.length += a;
			}
			for (var f = 0; f < e.length; f++) {
				var p = e[f], m = e[f - 1];
				m && (p.startDist = m.startDist + m.length), d(p, p.p0, l[f * u], 0, i.bezierProjPcts[0]);
				for (var h = 0; h < u - 1; h++) d(p, l[f * u + h], l[f * u + h + 1], i.bezierProjPcts[h], i.bezierProjPcts[h + 1]);
				d(p, l[f * u + u - 1], p.p2, i.bezierProjPcts[u - 1], 1);
			}
			return s.cache = e;
		}, c = function(n) {
			var i, c = n === "source";
			if (a[n]) {
				var l = e.pstyle(n + "-text-offset").pfValue;
				switch (r.edgeType) {
					case "self":
					case "compound":
					case "bezier":
					case "multibezier":
						for (var u = s(), d, f = 0, p = 0, m = 0; m < u.length; m++) {
							for (var h = u[c ? m : u.length - 1 - m], g = 0; g < h.segments.length; g++) {
								var _ = h.segments[c ? g : h.segments.length - 1 - g], v = m === u.length - 1 && g === h.segments.length - 1;
								if (f = p, p += _.length, p >= l || v) {
									d = {
										cp: h,
										segment: _
									};
									break;
								}
							}
							if (d) break;
						}
						var y = d.cp, b = d.segment, x = (l - f) / b.length, S = b.t1 - b.t0, C = c ? b.t0 + S * x : b.t1 - S * x;
						C = tr(0, C, 1), t = $n(y.p0, y.p1, y.p2, C), i = Kf(y.p0, y.p1, y.p2, C);
						break;
					case "straight":
					case "segments":
					case "haystack":
						for (var w = 0, T, E, D, O, k = r.allpts.length, A = 0; A + 3 < k && (c ? (D = {
							x: r.allpts[A],
							y: r.allpts[A + 1]
						}, O = {
							x: r.allpts[A + 2],
							y: r.allpts[A + 3]
						}) : (D = {
							x: r.allpts[k - 2 - A],
							y: r.allpts[k - 1 - A]
						}, O = {
							x: r.allpts[k - 4 - A],
							y: r.allpts[k - 3 - A]
						}), T = Yn(D, O), E = w, w += T, !(w >= l)); A += 2);
						var j = (l - E) / T;
						j = tr(0, j, 1), t = er(D, O, j), i = Gf(D, O);
				}
				o("labelX", n, t.x), o("labelY", n, t.y), o("labelAutoAngle", n, i);
			}
		};
		c("source"), c("target"), this.applyLabelDimensions(e);
	}
}, Uf.applyLabelDimensions = function(e) {
	this.applyPrefixedLabelDimensions(e), e.isEdge() && (this.applyPrefixedLabelDimensions(e, "source"), this.applyPrefixedLabelDimensions(e, "target"));
}, Uf.applyPrefixedLabelDimensions = function(e, t) {
	var n = e._private, r = this.getLabelText(e, t), i = jt(r, e._private.labelDimsKey);
	if (an(n.rscratch, "prefixedLabelDimsKey", t) !== i) {
		on(n.rscratch, "prefixedLabelDimsKey", t, i);
		var a = this.calculateLabelDimensions(e, r), o = e.pstyle("line-height").pfValue, s = e.pstyle("font-size").pfValue, c = e.pstyle("text-wrap").strValue, l = an(n.rscratch, "labelWrapCachedLines", t) || [], u = c === "wrap" ? Math.max(l.length, 1) : 1, d = s * o, f = a.width, p = a.height + (u - 1) * (o - 1) * s;
		on(n.rstyle, "labelWidth", t, f), on(n.rscratch, "labelWidth", t, f), on(n.rstyle, "labelHeight", t, p), on(n.rscratch, "labelHeight", t, p), on(n.rscratch, "labelLineHeight", t, d), on(n.rscratch, "labelActualDescent", t, a.labelActualDescent);
	}
}, Uf.getLabelText = function(e, t) {
	var n = e._private, r = t ? t + "-" : "", i = e.pstyle(r + "label").strValue, a = e.pstyle("text-transform").value, o = function(e, r) {
		return r ? (on(n.rscratch, e, t, r), r) : an(n.rscratch, e, t);
	};
	if (!i) return "";
	a == "none" || (a == "uppercase" ? i = i.toUpperCase() : a == "lowercase" && (i = i.toLowerCase()));
	var s = e.pstyle("text-wrap").value;
	if (s === "wrap") {
		var c = o("labelKey");
		if (c != null && o("labelWrapKey") === c) return o("labelWrapCachedText");
		for (var l = "​", u = i.split("\n"), d = e.pstyle("text-max-width").pfValue, f = e.pstyle("text-overflow-wrap").value === "anywhere", p = [], m = /[\s\u200b]+|$/g, h = 0; h < u.length; h++) {
			var _ = u[h], v = this.calculateLabelDimensions(e, _).width;
			if (f && (_ = _.split("").join(l)), v > d) {
				var y = _.matchAll(m), b = "", x = 0, S = g(y), C;
				try {
					for (S.s(); !(C = S.n()).done;) {
						var w = C.value, T = w[0], E = _.substring(x, w.index);
						x = w.index + T.length;
						var D = b.length === 0 ? E : b + E + T;
						this.calculateLabelDimensions(e, D).width <= d ? b += E + T : (b && p.push(b), b = E + T);
					}
				} catch (e) {
					S.e(e);
				} finally {
					S.f();
				}
				b.match(/^[\s\u200b]+$/) || p.push(b);
			} else p.push(_);
		}
		o("labelWrapCachedLines", p), i = o("labelWrapCachedText", p.join("\n")), o("labelWrapKey", c);
	} else if (s === "ellipsis") {
		var O = e.pstyle("text-max-width").pfValue, k = "", A = "…", j = !1;
		if (this.calculateLabelDimensions(e, i).width < O) return i;
		for (var M = 0; M < i.length && !(this.calculateLabelDimensions(e, k + i[M] + A).width > O); M++) k += i[M], M === i.length - 1 && (j = !0);
		return j || (k += A), k;
	}
	return i;
}, Uf.getLabelJustification = function(e) {
	var t = e.pstyle("text-justification").strValue, n = e.pstyle("text-halign").strValue;
	return t === "auto" ? e.isNode() ? ml(n) : "center" : t;
}, Uf.calculateLabelDimensions = function(e, t) {
	var n = this.cy.window().document, r = 0, i = e.pstyle("font-style").strValue, a = e.pstyle("font-size").pfValue, o = e.pstyle("font-family").strValue, s = e.pstyle("font-weight").strValue, c = e.pstyle("text-metrics").strValue || "font", l = this.labelCalcCanvas, u = this.labelCalcCanvasContext;
	if (!l) {
		l = this.labelCalcCanvas = n.createElement("canvas"), u = this.labelCalcCanvasContext = l.getContext("2d");
		var d = l.style;
		d.position = "absolute", d.left = "-9999px", d.top = "-9999px", d.zIndex = "-1", d.visibility = "hidden", d.pointerEvents = "none";
	}
	u.font = `${i} ${s} ${a}px ${o}`;
	for (var f = 0, p = 0, m = t.split("\n"), h = m.length, g = 0, _ = 0, v = 0; v < h; v++) {
		var y = m[v], b = u.measureText(y), x = Math.ceil(b.width), S = a;
		c === "glyph" && (v === 0 && (_ = b.actualBoundingBoxAscent), v === h - 1 && (g = b.actualBoundingBoxDescent)), f = Math.max(x, f), p += S;
	}
	return c === "glyph" && (p -= a - _ - g), f += r, p += r, {
		width: f,
		height: p,
		labelActualAscent: _,
		labelActualDescent: g
	};
}, Uf.calculateLabelAngle = function(e, t) {
	var n = e._private.rscratch, r = e.isEdge(), i = t ? t + "-" : "", a = e.pstyle(i + "text-rotation"), o = a.strValue;
	return o === "none" ? 0 : r && o === "autorotate" ? n.labelAutoAngle : o === "autorotate" ? 0 : a.pfValue;
}, Uf.calculateLabelAngles = function(e) {
	var t = this, n = e.isEdge(), r = e._private.rscratch;
	r.labelAngle = t.calculateLabelAngle(e), n && (r.sourceLabelAngle = t.calculateLabelAngle(e, "source"), r.targetLabelAngle = t.calculateLabelAngle(e, "target"));
};
var qf = {}, Jf = 28, Yf = !1;
qf.getNodeShape = function(e) {
	var t = this, n = e.pstyle("shape").value;
	if (n === "cutrectangle" && (e.width() < Jf || e.height() < Jf)) return Yf ||= (qt("The `cutrectangle` node shape can not be used at small sizes so `rectangle` is used instead"), !0), "rectangle";
	if (e.isParent()) return n === "rectangle" || n === "roundrectangle" || n === "round-rectangle" || n === "cutrectangle" || n === "cut-rectangle" || n === "barrel" ? n : "rectangle";
	if (n === "polygon") {
		var r = e.pstyle("shape-polygon-points").value;
		return t.nodeShapes.makePolygon(r).name;
	}
	return n;
};
var Xf = {};
Xf.registerCalculationListeners = function() {
	var e = this.cy, t = e.collection(), n = this, r = function(e) {
		var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
		if (t.merge(e), n) for (var r = 0; r < e.length; r++) {
			var i = e[r]._private.rstyle;
			i.clean = !1, i.cleanConnected = !1;
		}
	};
	n.binder(e).on("bounds.* dirty.*", function(e) {
		var t = e.target;
		r(t);
	}).on("style.* background.*", function(e) {
		var t = e.target;
		r(t, !1);
	});
	var i = function(i) {
		if (i) {
			var a = n.onUpdateEleCalcsFns;
			t.cleanStyle();
			for (var o = 0; o < t.length; o++) {
				var s = t[o], c = s._private.rstyle;
				s.isNode() && !c.cleanConnected && (r(s.connectedEdges()), c.cleanConnected = !0);
			}
			if (a) for (var l = 0; l < a.length; l++) {
				var u = a[l];
				u(i, t);
			}
			n.recalculateRenderedStyle(t), t = e.collection();
		}
	};
	n.flushRenderedStyleQueue = function() {
		i(!0);
	}, n.beforeRender(i, n.beforeRenderPriorities.eleCalcs);
}, Xf.onUpdateEleCalcs = function(e) {
	(this.onUpdateEleCalcsFns = this.onUpdateEleCalcsFns || []).push(e);
}, Xf.recalculateRenderedStyle = function(e, t) {
	var n = function(e) {
		return e._private.rstyle.cleanConnected;
	};
	if (e.length !== 0) {
		var r = [], i = [];
		if (!this.destroyed) {
			t === void 0 && (t = !0);
			for (var a = 0; a < e.length; a++) {
				var o = e[a], s = o._private, c = s.rstyle;
				o.isEdge() && (!n(o.source()) || !n(o.target())) && (c.clean = !1), o.isEdge() && o.isBundledBezier() && o.parallelEdges().some(function(e) {
					return !e._private.rstyle.clean && e.isBundledBezier();
				}) && (c.clean = !1), !(t && c.clean || o.removed()) && o.pstyle("display").value !== "none" && (s.group === "nodes" ? i.push(o) : r.push(o), c.clean = !0);
			}
			for (var l = 0; l < i.length; l++) {
				var u = i[l], d = u._private.rstyle, f = u.position();
				this.recalculateNodeLabelProjection(u), d.nodeX = f.x, d.nodeY = f.y, d.nodeW = u.pstyle("width").pfValue, d.nodeH = u.pstyle("height").pfValue;
			}
			this.recalculateEdgeProjections(r);
			for (var p = 0; p < r.length; p++) {
				var m = r[p]._private, h = m.rstyle, g = m.rscratch;
				h.srcX = g.arrowStartX, h.srcY = g.arrowStartY, h.tgtX = g.arrowEndX, h.tgtY = g.arrowEndY, h.midX = g.midX, h.midY = g.midY, h.labelAngle = g.labelAngle, h.sourceLabelAngle = g.sourceLabelAngle, h.targetLabelAngle = g.targetLabelAngle;
			}
		}
	}
};
var Zf = {};
Zf.updateCachedGrabbedEles = function() {
	var e = this.cachedZSortedEles;
	if (e) {
		e.drag = [], e.nondrag = [];
		for (var t = [], n = 0; n < e.length; n++) {
			var r = e[n], i = r._private.rscratch;
			r.grabbed() && !r.isParent() ? t.push(r) : i.inDragLayer ? e.drag.push(r) : e.nondrag.push(r);
		}
		for (var n = 0; n < t.length; n++) {
			var r = t[n];
			e.drag.push(r);
		}
	}
}, Zf.invalidateCachedZSortedEles = function() {
	this.cachedZSortedEles = null;
}, Zf.getCachedZSortedEles = function(e) {
	if (e || !this.cachedZSortedEles) {
		var t = this.cy.mutableElements().toArray();
		t.sort(lu), t.interactive = t.filter(function(e) {
			return e.interactive();
		}), this.cachedZSortedEles = t, this.updateCachedGrabbedEles();
	} else t = this.cachedZSortedEles;
	return t;
};
var Qf = {};
[
	uf,
	df,
	Rf,
	Bf,
	Vf,
	Uf,
	qf,
	Xf,
	Zf
].forEach(function(e) {
	Z(Qf, e);
});
var $f = {};
$f.getCachedImage = function(e, t, n) {
	var r = this, i = r.imageCache = r.imageCache || {}, a = i[e];
	if (a) return a.image.complete || a.image.addEventListener("load", n), a.image;
	a = i[e] = i[e] || {};
	var o = a.image = new Image();
	o.addEventListener("load", n), o.addEventListener("error", function() {
		o.error = !0;
	});
	var s = "data:";
	return e.substring(0, s.length).toLowerCase() !== s && (t = t === "null" ? null : t, o.crossOrigin = t), o.src = e, o;
};
var ep = function(e, t) {
	var n = e[0];
	n && n._private.grabbed !== t && (n._private.grabbed = t, e.updateStyle(!1));
}, tp = function(e) {
	ep(e, !0);
}, np = function(e) {
	ep(e, !1);
}, rp = {};
rp.registerBinding = function(e, t, n, r) {
	var i = Array.prototype.slice.apply(arguments, [1]);
	if (Array.isArray(e)) {
		for (var a = [], o = 0; o < e.length; o++) {
			var s = e[o];
			if (s !== void 0) {
				var c = this.binder(s);
				a.push(c.on.apply(c, i));
			}
		}
		return a;
	}
	var c = this.binder(e);
	return c.on.apply(c, i);
}, rp.binder = function(e) {
	var t = this, n = t.cy.window(), r = e === n || e === n.document || e === n.document.body || Y(e);
	if (t.supportsPassiveEvents == null) {
		var i = !1;
		try {
			var a = Object.defineProperty({}, "passive", { get: function() {
				return i = !0, !0;
			} });
			n.addEventListener("test", null, a);
		} catch {}
		t.supportsPassiveEvents = i;
	}
	var o = function(n, i, a) {
		var o = Array.prototype.slice.call(arguments);
		return r && t.supportsPassiveEvents && (o[2] = {
			capture: a ?? !1,
			passive: !1,
			once: !1
		}), t.bindings.push({
			target: e,
			args: o
		}), (e.addEventListener || e.on).apply(e, o), this;
	};
	return {
		on: o,
		addEventListener: o,
		addListener: o,
		bind: o
	};
}, rp.nodeIsDraggable = function(e) {
	return e && e.isNode() && !e.locked() && e.grabbable();
}, rp.nodeIsGrabbable = function(e) {
	return this.nodeIsDraggable(e) && e.interactive();
}, rp.load = function() {
	var e = this, t = e.cy.window(), n = function(e) {
		return e.selected();
	}, r = function(e) {
		var t = e.getRootNode();
		if (t && t.nodeType === 11 && t.host !== void 0) return t;
	}, i = function(t, n, r, i) {
		t ??= e.cy;
		for (var a = 0; a < n.length; a++) {
			var o = n[a];
			t.emit({
				originalEvent: r,
				type: o,
				position: i
			});
		}
	}, a = function(e) {
		return e.shiftKey || e.metaKey || e.ctrlKey;
	}, o = function(t, n) {
		var r = !0;
		if (e.cy.hasCompoundNodes() && t && t.pannable()) for (var i = 0; n && i < n.length; i++) {
			var t = n[i];
			if (t.isNode() && t.isParent() && !t.pannable()) {
				r = !1;
				break;
			}
		}
		else r = !0;
		return r;
	}, s = function(e) {
		e[0]._private.rscratch.inDragLayer = !0;
	}, c = function(e) {
		e[0]._private.rscratch.inDragLayer = !1;
	}, l = function(e) {
		e[0]._private.rscratch.isGrabTarget = !0;
	}, u = function(e) {
		e[0]._private.rscratch.isGrabTarget = !1;
	}, d = function(e, t) {
		var n = t.addToList;
		!n.has(e) && e.grabbable() && !e.locked() && (n.merge(e), tp(e));
	}, f = function(e, t) {
		if (e.cy().hasCompoundNodes() && (t.inDragLayer != null || t.addToList != null)) {
			var n = e.descendants();
			t.inDragLayer && (n.forEach(s), n.connectedEdges().forEach(s)), t.addToList && d(n, t);
		}
	}, p = function(t, n) {
		n ||= {};
		var r = t.cy().hasCompoundNodes();
		n.inDragLayer && (t.forEach(s), t.neighborhood().stdFilter(function(e) {
			return !r || e.isEdge();
		}).forEach(s)), n.addToList && t.forEach(function(e) {
			d(e, n);
		}), f(t, n), g(t, { inDragLayer: n.inDragLayer }), e.updateCachedGrabbedEles();
	}, m = p, h = function(t) {
		t && (e.getCachedZSortedEles().forEach(function(e) {
			np(e), c(e), u(e);
		}), e.updateCachedGrabbedEles());
	}, g = function(e, t) {
		if ((t.inDragLayer != null || t.addToList != null) && e.cy().hasCompoundNodes()) {
			var n = e.ancestors().orphans();
			if (!n.same(e)) {
				var r = n.descendants().spawnSelf().merge(n).unmerge(e).unmerge(e.descendants()), i = r.connectedEdges();
				t.inDragLayer && (i.forEach(s), r.forEach(s)), t.addToList && r.forEach(function(e) {
					d(e, t);
				});
			}
		}
	}, _ = function() {
		document.activeElement != null && document.activeElement.blur != null && document.activeElement.blur();
	}, v = typeof MutationObserver < "u", y = typeof ResizeObserver < "u";
	v ? (e.removeObserver = new MutationObserver(function(t) {
		for (var n = 0; n < t.length; n++) {
			var r = t[n].removedNodes;
			if (r) {
				for (var i = 0; i < r.length; i++) if (r[i] === e.container) {
					e.destroy();
					break;
				}
			}
		}
	}), e.container.parentNode && e.removeObserver.observe(e.container.parentNode, { childList: !0 })) : e.registerBinding(e.container, "DOMNodeRemoved", function(t) {
		e.destroy();
	});
	var b = ht(function() {
		e.cy.resize();
	}, 100);
	v && (e.styleObserver = new MutationObserver(b), e.styleObserver.observe(e.container, { attributes: !0 })), e.registerBinding(t, "resize", b), y && (e.resizeObserver = new ResizeObserver(b), e.resizeObserver.observe(e.container));
	var x = function(e, t) {
		for (; e != null;) t(e), e = e.parentNode;
	}, S = function() {
		e.invalidateContainerClientCoordsCache();
	};
	x(e.container, function(t) {
		e.registerBinding(t, "transitionend", S), e.registerBinding(t, "animationend", S), e.registerBinding(t, "scroll", S);
	}), e.registerBinding(e.container, "contextmenu", function(e) {
		e.preventDefault();
	});
	var C = function() {
		return e.selection[4] !== 0;
	}, w = function(t) {
		for (var n = e.findContainerClientCoords(), r = n[0], i = n[1], a = n[2], o = n[3], s = t.touches ? t.touches : [t], c = !1, l = 0; l < s.length; l++) {
			var u = s[l];
			if (r <= u.clientX && u.clientX <= r + a && i <= u.clientY && u.clientY <= i + o) {
				c = !0;
				break;
			}
		}
		if (!c) return !1;
		for (var d = e.container, f = t.target.parentNode, p = !1; f;) {
			if (f === d) {
				p = !0;
				break;
			}
			f = f.parentNode;
		}
		return !!p;
	};
	e.registerBinding(e.container, "mousedown", function(t) {
		if (w(t) && (e.hoverData.which !== 1 || t.which === 1)) {
			t.preventDefault(), _(), e.hoverData.capture = !0, e.hoverData.which = t.which;
			var n = e.cy, r = [t.clientX, t.clientY], a = e.projectIntoViewport(r[0], r[1]), o = e.selection, s = e.findNearestElements(a[0], a[1], !0, !1), c = s[0], u = e.dragData.possibleDragElements;
			e.hoverData.mdownPos = a, e.hoverData.mdownGPos = r;
			var d = function(e) {
				return {
					originalEvent: t,
					type: e,
					position: {
						x: a[0],
						y: a[1]
					}
				};
			}, f = function() {
				e.hoverData.tapholdCancelled = !1, clearTimeout(e.hoverData.tapholdTimeout), e.hoverData.tapholdTimeout = setTimeout(function() {
					if (!e.hoverData.tapholdCancelled) {
						var t = e.hoverData.down;
						t ? t.emit(d("taphold")) : n.emit(d("taphold"));
					}
				}, e.tapholdDuration);
			};
			if (t.which == 3) {
				e.hoverData.cxtStarted = !0;
				var h = {
					originalEvent: t,
					type: "cxttapstart",
					position: {
						x: a[0],
						y: a[1]
					}
				};
				c ? (c.activate(), c.emit(h), e.hoverData.down = c) : n.emit(h), e.hoverData.downTime = (/* @__PURE__ */ new Date()).getTime(), e.hoverData.cxtDragged = !1;
			} else if (t.which == 1) {
				if (c && c.activate(), c != null && e.nodeIsGrabbable(c)) {
					var g = function(e) {
						e.emit(d("grab"));
					};
					if (l(c), !c.selected()) u = e.dragData.possibleDragElements = n.collection(), m(c, { addToList: u }), c.emit(d("grabon")).emit(d("grab"));
					else {
						u = e.dragData.possibleDragElements = n.collection();
						var v = n.$(function(t) {
							return t.isNode() && t.selected() && e.nodeIsGrabbable(t);
						});
						p(v, { addToList: u }), c.emit(d("grabon")), v.forEach(g);
					}
					e.redrawHint("eles", !0), e.redrawHint("drag", !0);
				}
				e.hoverData.down = c, e.hoverData.downs = s, e.hoverData.downTime = (/* @__PURE__ */ new Date()).getTime(), i(c, [
					"mousedown",
					"tapstart",
					"vmousedown"
				], t, {
					x: a[0],
					y: a[1]
				}), c == null ? (o[4] = 1, e.data.bgActivePosistion = {
					x: a[0],
					y: a[1]
				}, e.redrawHint("select", !0), e.redraw()) : c.pannable() && (o[4] = 1), f();
			}
			o[0] = o[2] = a[0], o[1] = o[3] = a[1];
		}
	}, !1);
	var T = r(e.container);
	e.registerBinding([t, T], "mousemove", function(t) {
		if (e.hoverData.capture || w(t)) {
			var n = !1, r = e.cy, s = r.zoom(), c = [t.clientX, t.clientY], l = e.projectIntoViewport(c[0], c[1]), u = e.hoverData.mdownPos, d = e.hoverData.mdownGPos, f = e.selection, m = null;
			!e.hoverData.draggingEles && !e.hoverData.dragging && !e.hoverData.selecting && (m = e.findNearestElement(l[0], l[1], !0, !1));
			var g = e.hoverData.last, _ = e.hoverData.down, v = [l[0] - f[2], l[1] - f[3]], y = e.dragData.possibleDragElements, b;
			if (d) {
				var x = c[0] - d[0], S = x * x, C = c[1] - d[1], T = S + C * C;
				e.hoverData.isOverThresholdDrag = b = T >= e.desktopTapThreshold2;
			}
			var E = a(t);
			b && (e.hoverData.tapholdCancelled = !0);
			var D = function() {
				var t = e.hoverData.dragDelta = e.hoverData.dragDelta || [];
				t.length === 0 ? (t.push(v[0]), t.push(v[1])) : (t[0] += v[0], t[1] += v[1]);
			};
			n = !0, i(m, [
				"mousemove",
				"vmousemove",
				"tapdrag"
			], t, {
				x: l[0],
				y: l[1]
			});
			var O = function(e) {
				return {
					originalEvent: t,
					type: e,
					position: {
						x: l[0],
						y: l[1]
					}
				};
			}, k = function() {
				e.data.bgActivePosistion = void 0, e.hoverData.selecting || r.emit(O("boxstart")), f[4] = 1, e.hoverData.selecting = !0, e.redrawHint("select", !0), e.redraw();
			};
			if (e.hoverData.which === 3) {
				if (b) {
					var A = O("cxtdrag");
					_ ? _.emit(A) : r.emit(A), e.hoverData.cxtDragged = !0, (!e.hoverData.cxtOver || m !== e.hoverData.cxtOver) && (e.hoverData.cxtOver && e.hoverData.cxtOver.emit(O("cxtdragout")), e.hoverData.cxtOver = m, m && m.emit(O("cxtdragover")));
				}
			} else if (e.hoverData.dragging) {
				if (n = !0, r.panningEnabled() && r.userPanningEnabled()) {
					var j;
					if (e.hoverData.justStartedPan) {
						var M = e.hoverData.mdownPos;
						j = {
							x: (l[0] - M[0]) * s,
							y: (l[1] - M[1]) * s
						}, e.hoverData.justStartedPan = !1;
					} else j = {
						x: v[0] * s,
						y: v[1] * s
					};
					r.panBy(j), r.emit(O("dragpan")), e.hoverData.dragged = !0;
				}
				l = e.projectIntoViewport(t.clientX, t.clientY);
			} else if (f[4] == 1 && (_ == null || _.pannable())) b && (!e.hoverData.dragging && r.boxSelectionEnabled() && (E || !r.panningEnabled() || !r.userPanningEnabled()) ? k() : !e.hoverData.selecting && r.panningEnabled() && r.userPanningEnabled() && o(_, e.hoverData.downs) && (e.hoverData.dragging = !0, e.hoverData.justStartedPan = !0, f[4] = 0, e.data.bgActivePosistion = Rn(u), e.redrawHint("select", !0), e.redraw()), _ && _.pannable() && _.active() && _.unactivate());
			else {
				if (_ && _.pannable() && _.active() && _.unactivate(), (!_ || !_.grabbed()) && m != g && (g && i(g, ["mouseout", "tapdragout"], t, {
					x: l[0],
					y: l[1]
				}), m && i(m, ["mouseover", "tapdragover"], t, {
					x: l[0],
					y: l[1]
				}), e.hoverData.last = m), _) {
					if (b) {
						if (r.boxSelectionEnabled() && E) _ && _.grabbed() && (h(y), _.emit(O("freeon")), y.emit(O("free")), e.dragData.didDrag && (_.emit(O("dragfreeon")), y.emit(O("dragfree")))), k();
						else if (_ && _.grabbed() && e.nodeIsDraggable(_)) {
							var N = !e.dragData.didDrag;
							N && e.redrawHint("eles", !0), e.dragData.didDrag = !0, e.hoverData.draggingEles || p(y, { inDragLayer: !0 });
							var P = {
								x: 0,
								y: 0
							};
							if (B(v[0]) && B(v[1]) && (P.x += v[0], P.y += v[1], N)) {
								var F = e.hoverData.dragDelta;
								F && B(F[0]) && B(F[1]) && (P.x += F[0], P.y += F[1]);
							}
							e.hoverData.draggingEles = !0, y.silentShift(P).emit(O("position")).emit(O("drag")), e.redrawHint("drag", !0), e.redraw();
						}
					} else D();
				}
				n = !0;
			}
			if (f[2] = l[0], f[3] = l[1], n) return t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault(), !1;
		}
	}, !1);
	var E, D, O;
	e.registerBinding(t, "mouseup", function(t) {
		if (!(e.hoverData.which === 1 && t.which !== 1 && e.hoverData.capture) && e.hoverData.capture) {
			e.hoverData.capture = !1;
			var r = e.cy, o = e.projectIntoViewport(t.clientX, t.clientY), s = e.selection, c = e.findNearestElement(o[0], o[1], !0, !1), l = e.dragData.possibleDragElements, u = e.hoverData.down, d = a(t);
			e.data.bgActivePosistion && (e.redrawHint("select", !0), e.redraw()), e.hoverData.tapholdCancelled = !0, e.data.bgActivePosistion = void 0, u && u.unactivate();
			var f = function(e) {
				return {
					originalEvent: t,
					type: e,
					position: {
						x: o[0],
						y: o[1]
					}
				};
			};
			if (e.hoverData.which === 3) {
				var p = f("cxttapend");
				if (u ? u.emit(p) : r.emit(p), !e.hoverData.cxtDragged) {
					var m = f("cxttap");
					u ? u.emit(m) : r.emit(m);
				}
				e.hoverData.cxtDragged = !1, e.hoverData.which = null;
			} else if (e.hoverData.which === 1) {
				if (i(c, [
					"mouseup",
					"tapend",
					"vmouseup"
				], t, {
					x: o[0],
					y: o[1]
				}), !e.dragData.didDrag && !e.hoverData.dragged && !e.hoverData.selecting && !e.hoverData.isOverThresholdDrag && (i(u, [
					"click",
					"tap",
					"vclick"
				], t, {
					x: o[0],
					y: o[1]
				}), D = !1, t.timeStamp - O <= r.multiClickDebounceTime() ? (E && clearTimeout(E), D = !0, O = null, i(u, [
					"dblclick",
					"dbltap",
					"vdblclick"
				], t, {
					x: o[0],
					y: o[1]
				})) : (E = setTimeout(function() {
					D || i(u, [
						"oneclick",
						"onetap",
						"voneclick"
					], t, {
						x: o[0],
						y: o[1]
					});
				}, r.multiClickDebounceTime()), O = t.timeStamp)), u == null && !e.dragData.didDrag && !e.hoverData.selecting && !e.hoverData.dragged && !a(t) && (r.$(n).unselect(["tapunselect"]), l.length > 0 && e.redrawHint("eles", !0), e.dragData.possibleDragElements = l = r.collection()), c == u && !e.dragData.didDrag && !e.hoverData.selecting && c != null && c._private.selectable && (e.hoverData.dragging || (r.selectionType() === "additive" || d ? c.selected() ? c.unselect(["tapunselect"]) : c.select(["tapselect"]) : d || (r.$(n).unmerge(c).unselect(["tapunselect"]), c.select(["tapselect"]))), e.redrawHint("eles", !0)), e.hoverData.selecting) {
					var g = r.collection(e.getAllInBox(s[0], s[1], s[2], s[3]));
					e.redrawHint("select", !0), g.length > 0 && e.redrawHint("eles", !0), r.emit(f("boxend")), r.selectionType() === "additive" || d || r.$(n).unmerge(g).unselect(), g.emit(f("box")).stdFilter(function(e) {
						return e.selectable() && !e.selected();
					}).select().emit(f("boxselect")), e.redraw();
				}
				if (e.hoverData.dragging && (e.hoverData.dragging = !1, e.redrawHint("select", !0), e.redrawHint("eles", !0), e.redraw()), !s[4]) {
					e.redrawHint("drag", !0), e.redrawHint("eles", !0);
					var _ = u && u.grabbed();
					h(l), _ && (u.emit(f("freeon")), l.emit(f("free")), e.dragData.didDrag && (u.emit(f("dragfreeon")), l.emit(f("dragfree"))));
				}
			}
			s[4] = 0, e.hoverData.down = null, e.hoverData.cxtStarted = !1, e.hoverData.draggingEles = !1, e.hoverData.selecting = !1, e.hoverData.isOverThresholdDrag = !1, e.dragData.didDrag = !1, e.hoverData.dragged = !1, e.hoverData.dragDelta = [], e.hoverData.mdownPos = null, e.hoverData.mdownGPos = null, e.hoverData.which = null;
		}
	}, !1);
	var k = [], A = 4, j, M = 1e5, N = function(e) {
		for (var t = Math.abs(e[0]), n = 1; n < e.length; n++) if (Math.abs(e[n]) !== t) return !1;
		return !0;
	}, P = function(t) {
		var n = !1, r = t.deltaY;
		if (r ?? (t.wheelDeltaY == null ? t.wheelDelta != null && (r = t.wheelDelta / 4) : r = t.wheelDeltaY / 4), r !== 0) {
			if (j == null) {
				if (k.length >= A) {
					j = !1;
					var i = k;
					if (i[0] >= 5) {
						var a = N(i) ? i[0] : Wn(i);
						a > 1 && (j = !0, M = a);
					}
				} else k.push(Math.abs(r)), n = !0;
			} else j && (M = Math.min(Math.abs(r), M));
			if (!e.scrollingPage) {
				var o = e.cy, s = o.zoom(), c = o.pan(), l = e.projectIntoViewport(t.clientX, t.clientY), u = [l[0] * s + c.x, l[1] * s + c.y];
				if (e.hoverData.draggingEles || e.hoverData.dragging || e.hoverData.cxtStarted || C()) {
					t.preventDefault();
					return;
				}
				if (o.panningEnabled() && o.userPanningEnabled() && o.zoomingEnabled() && o.userZoomingEnabled()) {
					t.preventDefault(), e.data.wheelZooming = !0, clearTimeout(e.data.wheelTimeout), e.data.wheelTimeout = setTimeout(function() {
						e.data.wheelZooming = !1, e.redrawHint("eles", !0), e.redraw();
					}, 150);
					var d;
					n && Math.abs(r) > 5 && (r = Jn(r) * 5), d = r / -250, j && (d /= M, d *= 3), d *= e.wheelSensitivity, t.deltaMode === 1 && (d *= 33);
					var f = o.zoom() * 10 ** d;
					t.type === "gesturechange" && (f = e.gestureStartZoom * t.scale), o.zoom({
						level: f,
						renderedPosition: {
							x: u[0],
							y: u[1]
						}
					}), o.emit({
						type: t.type === "gesturechange" ? "pinchzoom" : "scrollzoom",
						originalEvent: t,
						position: {
							x: l[0],
							y: l[1]
						}
					});
				}
			}
		}
	};
	e.registerBinding(e.container, "wheel", P, !0), e.registerBinding(t, "scroll", function(t) {
		e.scrollingPage = !0, clearTimeout(e.scrollingPageTimeout), e.scrollingPageTimeout = setTimeout(function() {
			e.scrollingPage = !1;
		}, 250);
	}, !0), e.registerBinding(e.container, "gesturestart", function(t) {
		e.gestureStartZoom = e.cy.zoom(), e.hasTouchStarted || t.preventDefault();
	}, !0), e.registerBinding(e.container, "gesturechange", function(t) {
		e.hasTouchStarted || P(t);
	}, !0), e.registerBinding(e.container, "mouseout", function(t) {
		var n = e.projectIntoViewport(t.clientX, t.clientY);
		e.cy.emit({
			originalEvent: t,
			type: "mouseout",
			position: {
				x: n[0],
				y: n[1]
			}
		});
	}, !1), e.registerBinding(e.container, "mouseover", function(t) {
		var n = e.projectIntoViewport(t.clientX, t.clientY);
		e.cy.emit({
			originalEvent: t,
			type: "mouseover",
			position: {
				x: n[0],
				y: n[1]
			}
		});
	}, !1);
	var F, I, L, R, z, V, H, U, W, G, K, q, ee, J = function(e, t, n, r) {
		return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t));
	}, Y = function(e, t, n, r) {
		return (n - e) * (n - e) + (r - t) * (r - t);
	}, te;
	e.registerBinding(e.container, "touchstart", te = function(t) {
		if (e.hasTouchStarted = !0, w(t)) {
			_(), e.touchData.capture = !0, e.data.bgActivePosistion = void 0;
			var n = e.cy, r = e.touchData.now, a = e.touchData.earlier;
			if (t.touches[0]) {
				var o = e.projectIntoViewport(t.touches[0].clientX, t.touches[0].clientY);
				r[0] = o[0], r[1] = o[1];
			}
			if (t.touches[1]) {
				var o = e.projectIntoViewport(t.touches[1].clientX, t.touches[1].clientY);
				r[2] = o[0], r[3] = o[1];
			}
			if (t.touches[2]) {
				var o = e.projectIntoViewport(t.touches[2].clientX, t.touches[2].clientY);
				r[4] = o[0], r[5] = o[1];
			}
			var s = function(e) {
				return {
					originalEvent: t,
					type: e,
					position: {
						x: r[0],
						y: r[1]
					}
				};
			};
			if (t.touches[1]) {
				e.touchData.singleTouchMoved = !0, h(e.dragData.touchDragEles);
				var c = e.findContainerClientCoords();
				W = c[0], G = c[1], K = c[2], q = c[3], F = t.touches[0].clientX - W, I = t.touches[0].clientY - G, L = t.touches[1].clientX - W, R = t.touches[1].clientY - G, ee = 0 <= F && F <= K && 0 <= L && L <= K && 0 <= I && I <= q && 0 <= R && R <= q;
				var u = n.pan(), d = n.zoom();
				z = J(F, I, L, R), V = Y(F, I, L, R), H = [(F + L) / 2, (I + R) / 2], U = [(H[0] - u.x) / d, (H[1] - u.y) / d];
				var f = 200, g = f * f;
				if (V < g && !t.touches[2]) {
					var v = e.findNearestElement(r[0], r[1], !0, !0), y = e.findNearestElement(r[2], r[3], !0, !0);
					v && v.isNode() ? (v.activate().emit(s("cxttapstart")), e.touchData.start = v) : y && y.isNode() ? (y.activate().emit(s("cxttapstart")), e.touchData.start = y) : n.emit(s("cxttapstart")), e.touchData.start && (e.touchData.start._private.grabbed = !1), e.touchData.cxt = !0, e.touchData.cxtDragged = !1, e.data.bgActivePosistion = void 0, e.redraw();
					return;
				}
			}
			if (t.touches[2]) n.boxSelectionEnabled() && t.preventDefault();
			else if (!t.touches[1] && t.touches[0]) {
				var b = e.findNearestElements(r[0], r[1], !0, !0), x = b[0];
				if (x != null && (x.activate(), e.touchData.start = x, e.touchData.starts = b, e.nodeIsGrabbable(x))) {
					var S = e.dragData.touchDragEles = n.collection(), C = null;
					e.redrawHint("eles", !0), e.redrawHint("drag", !0), x.selected() ? (C = n.$(function(t) {
						return t.selected() && e.nodeIsGrabbable(t);
					}), p(C, { addToList: S })) : m(x, { addToList: S }), l(x), x.emit(s("grabon")), C ? C.forEach(function(e) {
						e.emit(s("grab"));
					}) : x.emit(s("grab"));
				}
				i(x, [
					"touchstart",
					"tapstart",
					"vmousedown"
				], t, {
					x: r[0],
					y: r[1]
				}), x ?? (e.data.bgActivePosistion = {
					x: o[0],
					y: o[1]
				}, e.redrawHint("select", !0), e.redraw()), e.touchData.singleTouchMoved = !1, e.touchData.singleTouchStartTime = +/* @__PURE__ */ new Date(), clearTimeout(e.touchData.tapholdTimeout), e.touchData.tapholdTimeout = setTimeout(function() {
					e.touchData.singleTouchMoved === !1 && !e.pinching && !e.touchData.selecting && i(e.touchData.start, ["taphold"], t, {
						x: r[0],
						y: r[1]
					});
				}, e.tapholdDuration);
			}
			if (t.touches.length >= 1) {
				for (var T = e.touchData.startPosition = [
					null,
					null,
					null,
					null,
					null,
					null
				], E = 0; E < r.length; E++) T[E] = a[E] = r[E];
				var D = t.touches[0];
				e.touchData.startGPosition = [D.clientX, D.clientY];
			}
		}
	}, !1);
	var ne;
	e.registerBinding(t, "touchmove", ne = function(t) {
		var n = e.touchData.capture;
		if (n || w(t)) {
			var r = e.selection, a = e.cy, s = e.touchData.now, c = e.touchData.earlier, l = a.zoom();
			if (t.touches[0]) {
				var u = e.projectIntoViewport(t.touches[0].clientX, t.touches[0].clientY);
				s[0] = u[0], s[1] = u[1];
			}
			if (t.touches[1]) {
				var u = e.projectIntoViewport(t.touches[1].clientX, t.touches[1].clientY);
				s[2] = u[0], s[3] = u[1];
			}
			if (t.touches[2]) {
				var u = e.projectIntoViewport(t.touches[2].clientX, t.touches[2].clientY);
				s[4] = u[0], s[5] = u[1];
			}
			var d = function(e) {
				return {
					originalEvent: t,
					type: e,
					position: {
						x: s[0],
						y: s[1]
					}
				};
			}, f = e.touchData.startGPosition, m;
			if (n && t.touches[0] && f) {
				for (var g = [], _ = 0; _ < s.length; _++) g[_] = s[_] - c[_];
				var v = t.touches[0].clientX - f[0], y = v * v, b = t.touches[0].clientY - f[1];
				m = y + b * b >= e.touchTapThreshold2;
			}
			if (n && e.touchData.cxt) {
				t.preventDefault();
				var x = t.touches[0].clientX - W, S = t.touches[0].clientY - G, C = t.touches[1].clientX - W, T = t.touches[1].clientY - G, E = Y(x, S, C, T), D = E / V, O = 150, k = O * O, A = 1.5;
				if (D >= A * A || E >= k) {
					e.touchData.cxt = !1, e.data.bgActivePosistion = void 0, e.redrawHint("select", !0);
					var j = d("cxttapend");
					e.touchData.start ? (e.touchData.start.unactivate().emit(j), e.touchData.start = null) : a.emit(j);
				}
			}
			if (n && e.touchData.cxt) {
				var j = d("cxtdrag");
				e.data.bgActivePosistion = void 0, e.redrawHint("select", !0), e.touchData.start ? e.touchData.start.emit(j) : a.emit(j), e.touchData.start && (e.touchData.start._private.grabbed = !1), e.touchData.cxtDragged = !0;
				var M = e.findNearestElement(s[0], s[1], !0, !0);
				(!e.touchData.cxtOver || M !== e.touchData.cxtOver) && (e.touchData.cxtOver && e.touchData.cxtOver.emit(d("cxtdragout")), e.touchData.cxtOver = M, M && M.emit(d("cxtdragover")));
			} else if (n && t.touches[2] && a.boxSelectionEnabled()) t.preventDefault(), e.data.bgActivePosistion = void 0, this.lastThreeTouch = +/* @__PURE__ */ new Date(), e.touchData.selecting || a.emit(d("boxstart")), e.touchData.selecting = !0, e.touchData.didSelect = !0, r[4] = 1, !r || r.length === 0 || r[0] === void 0 ? (r[0] = (s[0] + s[2] + s[4]) / 3, r[1] = (s[1] + s[3] + s[5]) / 3, r[2] = (s[0] + s[2] + s[4]) / 3 + 1, r[3] = (s[1] + s[3] + s[5]) / 3 + 1) : (r[2] = (s[0] + s[2] + s[4]) / 3, r[3] = (s[1] + s[3] + s[5]) / 3), e.redrawHint("select", !0), e.redraw();
			else if (n && t.touches[1] && !e.touchData.didSelect && a.zoomingEnabled() && a.panningEnabled() && a.userZoomingEnabled() && a.userPanningEnabled()) {
				t.preventDefault(), e.data.bgActivePosistion = void 0, e.redrawHint("select", !0);
				var N = e.dragData.touchDragEles;
				if (N) {
					e.redrawHint("drag", !0);
					for (var P = 0; P < N.length; P++) {
						var H = N[P]._private;
						H.grabbed = !1, H.rscratch.inDragLayer = !1;
					}
				}
				var K = e.touchData.start, x = t.touches[0].clientX - W, S = t.touches[0].clientY - G, C = t.touches[1].clientX - W, T = t.touches[1].clientY - G, q = J(x, S, C, T), te = q / z;
				if (ee) {
					var ne = x - F, re = S - I, ie = C - L, ae = T - R, oe = (ne + ie) / 2, se = (re + ae) / 2, ce = a.zoom(), le = ce * te, ue = a.pan(), de = U[0] * ce + ue.x, fe = U[1] * ce + ue.y, pe = {
						x: -le / ce * (de - ue.x - oe) + de,
						y: -le / ce * (fe - ue.y - se) + fe
					};
					if (K && K.active()) {
						var N = e.dragData.touchDragEles;
						h(N), e.redrawHint("drag", !0), e.redrawHint("eles", !0), K.unactivate().emit(d("freeon")), N && N.emit(d("free")), e.dragData.didDrag && (K.emit(d("dragfreeon")), N && N.emit(d("dragfree")));
					}
					a.viewport({
						zoom: le,
						pan: pe,
						cancelOnFailedZoom: !0
					}), a.emit(d("pinchzoom")), z = q, F = x, I = S, L = C, R = T, e.pinching = !0;
				}
				if (t.touches[0]) {
					var u = e.projectIntoViewport(t.touches[0].clientX, t.touches[0].clientY);
					s[0] = u[0], s[1] = u[1];
				}
				if (t.touches[1]) {
					var u = e.projectIntoViewport(t.touches[1].clientX, t.touches[1].clientY);
					s[2] = u[0], s[3] = u[1];
				}
				if (t.touches[2]) {
					var u = e.projectIntoViewport(t.touches[2].clientX, t.touches[2].clientY);
					s[4] = u[0], s[5] = u[1];
				}
			} else if (t.touches[0] && !e.touchData.didSelect) {
				var me = e.touchData.start, he = e.touchData.last, M;
				if (!e.hoverData.draggingEles && !e.swipePanning && (M = e.findNearestElement(s[0], s[1], !0, !0)), n && me != null && t.preventDefault(), n && me != null && e.nodeIsDraggable(me)) {
					if (m) {
						var N = e.dragData.touchDragEles, X = !e.dragData.didDrag;
						X && p(N, { inDragLayer: !0 }), e.dragData.didDrag = !0;
						var ge = {
							x: 0,
							y: 0
						};
						if (B(g[0]) && B(g[1]) && (ge.x += g[0], ge.y += g[1], X)) {
							e.redrawHint("eles", !0);
							var _e = e.touchData.dragDelta;
							_e && B(_e[0]) && B(_e[1]) && (ge.x += _e[0], ge.y += _e[1]);
						}
						e.hoverData.draggingEles = !0, N.silentShift(ge).emit(d("position")).emit(d("drag")), e.redrawHint("drag", !0), e.touchData.startPosition[0] == c[0] && e.touchData.startPosition[1] == c[1] && e.redrawHint("eles", !0), e.redraw();
					} else {
						var _e = e.touchData.dragDelta = e.touchData.dragDelta || [];
						_e.length === 0 ? (_e.push(g[0]), _e.push(g[1])) : (_e[0] += g[0], _e[1] += g[1]);
					}
				}
				if (i(me || M, [
					"touchmove",
					"tapdrag",
					"vmousemove"
				], t, {
					x: s[0],
					y: s[1]
				}), (!me || !me.grabbed()) && M != he && (he && he.emit(d("tapdragout")), M && M.emit(d("tapdragover"))), e.touchData.last = M, n) for (var P = 0; P < s.length; P++) s[P] && e.touchData.startPosition[P] && m && (e.touchData.singleTouchMoved = !0);
				if (n && (me == null || me.pannable()) && a.panningEnabled() && a.userPanningEnabled()) {
					o(me, e.touchData.starts) && (t.preventDefault(), e.data.bgActivePosistion || (e.data.bgActivePosistion = Rn(e.touchData.startPosition)), e.swipePanning ? (a.panBy({
						x: g[0] * l,
						y: g[1] * l
					}), a.emit(d("dragpan"))) : m && (e.swipePanning = !0, a.panBy({
						x: v * l,
						y: b * l
					}), a.emit(d("dragpan")), me && (me.unactivate(), e.redrawHint("select", !0), e.touchData.start = null)));
					var u = e.projectIntoViewport(t.touches[0].clientX, t.touches[0].clientY);
					s[0] = u[0], s[1] = u[1];
				}
			}
			for (var _ = 0; _ < s.length; _++) c[_] = s[_];
			n && t.touches.length > 0 && !e.hoverData.draggingEles && !e.swipePanning && e.data.bgActivePosistion != null && (e.data.bgActivePosistion = void 0, e.redrawHint("select", !0), e.redraw());
		}
	}, !1);
	var re;
	e.registerBinding(t, "touchcancel", re = function(t) {
		var n = e.touchData.start;
		e.touchData.capture = !1, n && n.unactivate();
	});
	var ie, ae, oe, se;
	if (e.registerBinding(t, "touchend", ie = function(t) {
		var r = e.touchData.start;
		if (e.touchData.capture) t.touches.length === 0 && (e.touchData.capture = !1), t.preventDefault();
		else return;
		var a = e.selection;
		e.swipePanning = !1, e.hoverData.draggingEles = !1;
		var o = e.cy, s = o.zoom(), c = e.touchData.now, l = e.touchData.earlier;
		if (t.touches[0]) {
			var u = e.projectIntoViewport(t.touches[0].clientX, t.touches[0].clientY);
			c[0] = u[0], c[1] = u[1];
		}
		if (t.touches[1]) {
			var u = e.projectIntoViewport(t.touches[1].clientX, t.touches[1].clientY);
			c[2] = u[0], c[3] = u[1];
		}
		if (t.touches[2]) {
			var u = e.projectIntoViewport(t.touches[2].clientX, t.touches[2].clientY);
			c[4] = u[0], c[5] = u[1];
		}
		var d = function(e) {
			return {
				originalEvent: t,
				type: e,
				position: {
					x: c[0],
					y: c[1]
				}
			};
		};
		r && r.unactivate();
		var f;
		if (e.touchData.cxt) {
			if (f = d("cxttapend"), r ? r.emit(f) : o.emit(f), !e.touchData.cxtDragged) {
				var p = d("cxttap");
				r ? r.emit(p) : o.emit(p);
			}
			e.touchData.start && (e.touchData.start._private.grabbed = !1), e.touchData.cxt = !1, e.touchData.start = null, e.redraw();
			return;
		}
		if (!t.touches[2] && o.boxSelectionEnabled() && e.touchData.selecting) {
			e.touchData.selecting = !1;
			var m = o.collection(e.getAllInBox(a[0], a[1], a[2], a[3]));
			a[0] = void 0, a[1] = void 0, a[2] = void 0, a[3] = void 0, a[4] = 0, e.redrawHint("select", !0), o.emit(d("boxend")), m.emit(d("box")).stdFilter(function(e) {
				return e.selectable() && !e.selected();
			}).select().emit(d("boxselect")), m.nonempty() && e.redrawHint("eles", !0), e.redraw();
		}
		if (r?.unactivate(), t.touches[2]) e.data.bgActivePosistion = void 0, e.redrawHint("select", !0);
		else if (!t.touches[1] && !t.touches[0] && !t.touches[0]) {
			e.data.bgActivePosistion = void 0, e.redrawHint("select", !0);
			var g = e.dragData.touchDragEles;
			if (r != null) {
				var _ = r._private.grabbed;
				h(g), e.redrawHint("drag", !0), e.redrawHint("eles", !0), _ && (r.emit(d("freeon")), g.emit(d("free")), e.dragData.didDrag && (r.emit(d("dragfreeon")), g.emit(d("dragfree")))), i(r, [
					"touchend",
					"tapend",
					"vmouseup",
					"tapdragout"
				], t, {
					x: c[0],
					y: c[1]
				}), r.unactivate(), e.touchData.start = null;
			} else i(e.findNearestElement(c[0], c[1], !0, !0), [
				"touchend",
				"tapend",
				"vmouseup",
				"tapdragout"
			], t, {
				x: c[0],
				y: c[1]
			});
			var v = e.touchData.startPosition[0] - c[0], y = v * v, b = e.touchData.startPosition[1] - c[1], x = (y + b * b) * s * s;
			e.touchData.singleTouchMoved || (r || o.$(":selected").unselect(["tapunselect"]), i(r, ["tap", "vclick"], t, {
				x: c[0],
				y: c[1]
			}), ae = !1, t.timeStamp - se <= o.multiClickDebounceTime() ? (oe && clearTimeout(oe), ae = !0, se = null, i(r, ["dbltap", "vdblclick"], t, {
				x: c[0],
				y: c[1]
			})) : (oe = setTimeout(function() {
				ae || i(r, ["onetap", "voneclick"], t, {
					x: c[0],
					y: c[1]
				});
			}, o.multiClickDebounceTime()), se = t.timeStamp)), r != null && !e.dragData.didDrag && r._private.selectable && x < e.touchTapThreshold2 && !e.pinching && (o.selectionType() === "single" ? (o.$(n).unmerge(r).unselect(["tapunselect"]), r.select(["tapselect"])) : r.selected() ? r.unselect(["tapunselect"]) : r.select(["tapselect"]), e.redrawHint("eles", !0)), e.touchData.singleTouchMoved = !0;
		}
		for (var S = 0; S < c.length; S++) l[S] = c[S];
		e.dragData.didDrag = !1, t.touches.length === 0 && (e.touchData.dragDelta = [], e.touchData.startPosition = [
			null,
			null,
			null,
			null,
			null,
			null
		], e.touchData.startGPosition = null, e.touchData.didSelect = !1), t.touches.length < 2 && (t.touches.length === 1 && (e.touchData.startGPosition = [t.touches[0].clientX, t.touches[0].clientY]), e.pinching = !1, e.redrawHint("eles", !0), e.redraw());
	}, !1), typeof TouchEvent > "u") {
		var ce = [], le = function(e) {
			return {
				clientX: e.clientX,
				clientY: e.clientY,
				force: 1,
				identifier: e.pointerId,
				pageX: e.pageX,
				pageY: e.pageY,
				radiusX: e.width / 2,
				radiusY: e.height / 2,
				screenX: e.screenX,
				screenY: e.screenY,
				target: e.target
			};
		}, ue = function(e) {
			return {
				event: e,
				touch: le(e)
			};
		}, de = function(e) {
			ce.push(ue(e));
		}, fe = function(e) {
			for (var t = 0; t < ce.length; t++) if (ce[t].event.pointerId === e.pointerId) {
				ce.splice(t, 1);
				return;
			}
		}, pe = function(e) {
			var t = ce.filter(function(t) {
				return t.event.pointerId === e.pointerId;
			})[0];
			t.event = e, t.touch = le(e);
		}, me = function(e) {
			e.touches = ce.map(function(e) {
				return e.touch;
			});
		}, he = function(e) {
			return e.pointerType === "mouse" || e.pointerType === 4;
		};
		e.registerBinding(e.container, "pointerdown", function(e) {
			he(e) || (e.preventDefault(), de(e), me(e), te(e));
		}), e.registerBinding(e.container, "pointerup", function(e) {
			he(e) || (fe(e), me(e), ie(e));
		}), e.registerBinding(e.container, "pointercancel", function(e) {
			he(e) || (fe(e), me(e), re(e));
		}), e.registerBinding(e.container, "pointermove", function(e) {
			he(e) || (e.preventDefault(), pe(e), me(e), ne(e));
		});
	}
};
var ip = {};
ip.generatePolygon = function(e, t) {
	return this.nodeShapes[e] = {
		renderer: this,
		name: e,
		points: t,
		draw: function(e, t, n, r, i, a) {
			this.renderer.nodeShapeImpl("polygon", e, t, n, r, i, this.points);
		},
		intersectLine: function(e, t, n, r, i, a, o, s) {
			return Fr(i, a, this.points, e, t, n / 2, r / 2, o);
		},
		checkPoint: function(e, t, n, r, i, a, o, s) {
			return Tr(e, t, this.points, a, o, r, i, [0, -1], n);
		},
		hasMiterBounds: e !== "rectangle",
		miterBounds: function(e, t, n, r, i, a) {
			return gr(this.points, e, t, n, r, i);
		}
	};
}, ip.generateEllipse = function() {
	return this.nodeShapes.ellipse = {
		renderer: this,
		name: "ellipse",
		draw: function(e, t, n, r, i, a) {
			this.renderer.nodeShapeImpl(this.name, e, t, n, r, i);
		},
		intersectLine: function(e, t, n, r, i, a, o, s) {
			return kr(i, a, e, t, n / 2 + o, r / 2 + o);
		},
		checkPoint: function(e, t, n, r, i, a, o, s) {
			return Ar(e, t, r, i, a, o, n);
		}
	};
}, ip.generateRoundPolygon = function(e, t) {
	return this.nodeShapes[e] = {
		renderer: this,
		name: e,
		points: t,
		getOrCreateCorners: function(e, n, r, i, a, o, s) {
			if (o[s] !== void 0 && o[s + "-cx"] === e && o[s + "-cy"] === n && o[s + "-w"] === r && o[s + "-h"] === i && o[s + "-corner-radius"] === a) return o[s];
			o[s] = Array(t.length / 2), o[s + "-cx"] = e, o[s + "-cy"] = n, o[s + "-w"] = r, o[s + "-h"] = i, o[s + "-corner-radius"] = a;
			var c = r / 2, l = i / 2;
			a = a === "auto" ? Hr(r, i) : a;
			for (var u = Array(t.length / 2), d = 0; d < t.length / 2; d++) u[d] = {
				x: e + c * t[d * 2],
				y: n + l * t[d * 2 + 1]
			};
			var f, p, m, h, g = u.length;
			for (p = u[g - 1], f = 0; f < g; f++) m = u[f % g], h = u[(f + 1) % g], o[s][f] = Ff(p, m, h, a), p = m, m = h;
			return o[s];
		},
		draw: function(e, t, n, r, i, a, o) {
			this.renderer.nodeShapeImpl("round-polygon", e, t, n, r, i, this.points, this.getOrCreateCorners(t, n, r, i, a, o, "drawCorners"));
		},
		intersectLine: function(e, t, n, r, i, a, o, s, c) {
			return Ir(i, a, this.points, e, t, n, r, o, this.getOrCreateCorners(e, t, n, r, s, c, "corners"));
		},
		checkPoint: function(e, t, n, r, i, a, o, s, c) {
			return Er(e, t, this.points, a, o, r, i, this.getOrCreateCorners(a, o, r, i, s, c, "corners"));
		}
	};
}, ip.generateRoundRectangle = function() {
	return this.nodeShapes["round-rectangle"] = this.nodeShapes.roundrectangle = {
		renderer: this,
		name: "round-rectangle",
		points: Rr(4, 0),
		draw: function(e, t, n, r, i, a) {
			this.renderer.nodeShapeImpl(this.name, e, t, n, r, i, this.points, a);
		},
		intersectLine: function(e, t, n, r, i, a, o, s) {
			return _r(i, a, e, t, n, r, o, s);
		},
		checkPoint: function(e, t, n, r, i, a, o, s) {
			var c = r / 2, l = i / 2;
			s = s === "auto" ? Vr(r, i) : s, s = Math.min(c, l, s);
			var u = s * 2;
			return !!(Tr(e, t, this.points, a, o, r, i - u, [0, -1], n) || Tr(e, t, this.points, a, o, r - u, i, [0, -1], n) || Ar(e, t, u, u, a - c + s, o - l + s, n) || Ar(e, t, u, u, a + c - s, o - l + s, n) || Ar(e, t, u, u, a + c - s, o + l - s, n) || Ar(e, t, u, u, a - c + s, o + l - s, n));
		}
	};
}, ip.generateCutRectangle = function() {
	return this.nodeShapes["cut-rectangle"] = this.nodeShapes.cutrectangle = {
		renderer: this,
		name: "cut-rectangle",
		cornerLength: Ur(),
		points: Rr(4, 0),
		draw: function(e, t, n, r, i, a) {
			this.renderer.nodeShapeImpl(this.name, e, t, n, r, i, null, a);
		},
		generateCutTrianglePts: function(e, t, n, r, i) {
			var a = i === "auto" ? this.cornerLength : i, o = t / 2, s = e / 2, c = n - s, l = n + s, u = r - o, d = r + o;
			return {
				topLeft: [
					c,
					u + a,
					c + a,
					u,
					c + a,
					u + a
				],
				topRight: [
					l - a,
					u,
					l,
					u + a,
					l - a,
					u + a
				],
				bottomRight: [
					l,
					d - a,
					l - a,
					d,
					l - a,
					d - a
				],
				bottomLeft: [
					c + a,
					d,
					c,
					d - a,
					c + a,
					d - a
				]
			};
		},
		intersectLine: function(e, t, n, r, i, a, o, s) {
			var c = this.generateCutTrianglePts(n + 2 * o, r + 2 * o, e, t, s);
			return Fr(i, a, [].concat.apply([], [
				c.topLeft.splice(0, 4),
				c.topRight.splice(0, 4),
				c.bottomRight.splice(0, 4),
				c.bottomLeft.splice(0, 4)
			]), e, t);
		},
		checkPoint: function(e, t, n, r, i, a, o, s) {
			var c = s === "auto" ? this.cornerLength : s;
			if (Tr(e, t, this.points, a, o, r, i - 2 * c, [0, -1], n) || Tr(e, t, this.points, a, o, r - 2 * c, i, [0, -1], n)) return !0;
			var l = this.generateCutTrianglePts(r, i, a, o);
			return wr(e, t, l.topLeft) || wr(e, t, l.topRight) || wr(e, t, l.bottomRight) || wr(e, t, l.bottomLeft);
		}
	};
}, ip.generateBarrel = function() {
	return this.nodeShapes.barrel = {
		renderer: this,
		name: "barrel",
		points: Rr(4, 0),
		draw: function(e, t, n, r, i, a) {
			this.renderer.nodeShapeImpl(this.name, e, t, n, r, i);
		},
		intersectLine: function(e, t, n, r, i, a, o, s) {
			var c = this.generateBarrelBezierPts(n + 2 * o, r + 2 * o, e, t), l = function(e) {
				var t = $n({
					x: e[0],
					y: e[1]
				}, {
					x: e[2],
					y: e[3]
				}, {
					x: e[4],
					y: e[5]
				}, .15), n = $n({
					x: e[0],
					y: e[1]
				}, {
					x: e[2],
					y: e[3]
				}, {
					x: e[4],
					y: e[5]
				}, .5), r = $n({
					x: e[0],
					y: e[1]
				}, {
					x: e[2],
					y: e[3]
				}, {
					x: e[4],
					y: e[5]
				}, .85);
				return [
					e[0],
					e[1],
					t.x,
					t.y,
					n.x,
					n.y,
					r.x,
					r.y,
					e[4],
					e[5]
				];
			};
			return Fr(i, a, [].concat(l(c.topLeft), l(c.topRight), l(c.bottomRight), l(c.bottomLeft)), e, t);
		},
		generateBarrelBezierPts: function(e, t, n, r) {
			var i = t / 2, a = e / 2, o = n - a, s = n + a, c = r - i, l = r + i, u = Gr(e, t), d = u.heightOffset, f = u.widthOffset, p = u.ctrlPtOffsetPct * e, m = {
				topLeft: [
					o,
					c + d,
					o + p,
					c,
					o + f,
					c
				],
				topRight: [
					s - f,
					c,
					s - p,
					c,
					s,
					c + d
				],
				bottomRight: [
					s,
					l - d,
					s - p,
					l,
					s - f,
					l
				],
				bottomLeft: [
					o + f,
					l,
					o + p,
					l,
					o,
					l - d
				]
			};
			return m.topLeft.isTop = !0, m.topRight.isTop = !0, m.bottomLeft.isBottom = !0, m.bottomRight.isBottom = !0, m;
		},
		checkPoint: function(e, t, n, r, i, a, o, s) {
			var c = Gr(r, i), l = c.heightOffset, u = c.widthOffset;
			if (Tr(e, t, this.points, a, o, r, i - 2 * l, [0, -1], n) || Tr(e, t, this.points, a, o, r - 2 * u, i, [0, -1], n)) return !0;
			for (var d = this.generateBarrelBezierPts(r, i, a, o), f = function(e, t, n) {
				var r = n[4], i = n[2], a = n[0], o = n[5], s = n[1];
				if (Math.min(r, a) <= e && e <= Math.max(r, a) && Math.min(o, s) <= t && t <= Math.max(o, s)) {
					var c = Wr(r, i, a), l = br(c[0], c[1], c[2], e).filter(function(e) {
						return 0 <= e && e <= 1;
					});
					if (l.length > 0) return l[0];
				}
				return null;
			}, p = Object.keys(d), m = 0; m < p.length; m++) {
				var h = d[p[m]], g = f(e, t, h);
				if (g != null) {
					var _ = h[5], v = h[3], y = h[1], b = Qn(_, v, y, g);
					if (h.isTop && b <= t || h.isBottom && t <= b) return !0;
				}
			}
			return !1;
		}
	};
}, ip.generateBottomRoundrectangle = function() {
	return this.nodeShapes["bottom-round-rectangle"] = this.nodeShapes.bottomroundrectangle = {
		renderer: this,
		name: "bottom-round-rectangle",
		points: Rr(4, 0),
		draw: function(e, t, n, r, i, a) {
			this.renderer.nodeShapeImpl(this.name, e, t, n, r, i, this.points, a);
		},
		intersectLine: function(e, t, n, r, i, a, o, s) {
			var c = e - (n / 2 + o), l = t - (r / 2 + o), u = l, d = Nr(i, a, e, t, c, l, e + (n / 2 + o), u, !1);
			return d.length > 0 ? d : _r(i, a, e, t, n, r, o, s);
		},
		checkPoint: function(e, t, n, r, i, a, o, s) {
			s = s === "auto" ? Vr(r, i) : s;
			var c = 2 * s;
			if (Tr(e, t, this.points, a, o, r, i - c, [0, -1], n) || Tr(e, t, this.points, a, o, r - c, i, [0, -1], n)) return !0;
			var l = r / 2 + 2 * n, u = i / 2 + 2 * n;
			return !!(wr(e, t, [
				a - l,
				o - u,
				a - l,
				o,
				a + l,
				o,
				a + l,
				o - u
			]) || Ar(e, t, c, c, a + r / 2 - s, o + i / 2 - s, n) || Ar(e, t, c, c, a - r / 2 + s, o + i / 2 - s, n));
		}
	};
}, ip.registerNodeShapes = function() {
	var e = this.nodeShapes = {}, t = this;
	this.generateEllipse(), this.generatePolygon("triangle", Rr(3, 0)), this.generateRoundPolygon("round-triangle", Rr(3, 0)), this.generatePolygon("rectangle", Rr(4, 0)), e.square = e.rectangle, this.generateRoundRectangle(), this.generateCutRectangle(), this.generateBarrel(), this.generateBottomRoundrectangle();
	var n = [
		0,
		1,
		1,
		0,
		0,
		-1,
		-1,
		0
	];
	this.generatePolygon("diamond", n), this.generateRoundPolygon("round-diamond", n), this.generatePolygon("pentagon", Rr(5, 0)), this.generateRoundPolygon("round-pentagon", Rr(5, 0)), this.generatePolygon("hexagon", Rr(6, 0)), this.generateRoundPolygon("round-hexagon", Rr(6, 0)), this.generatePolygon("heptagon", Rr(7, 0)), this.generateRoundPolygon("round-heptagon", Rr(7, 0)), this.generatePolygon("octagon", Rr(8, 0)), this.generateRoundPolygon("round-octagon", Rr(8, 0));
	var r = Array(20), i = Br(5, 0), a = Br(5, Math.PI / 5), o = .5 * (3 - Math.sqrt(5));
	o *= 1.57;
	for (var s = 0; s < a.length / 2; s++) a[s * 2] *= o, a[s * 2 + 1] *= o;
	for (var s = 0; s < 5; s++) r[s * 4] = i[s * 2], r[s * 4 + 1] = i[s * 2 + 1], r[s * 4 + 2] = a[s * 2], r[s * 4 + 3] = a[s * 2 + 1];
	r = zr(r), this.generatePolygon("star", r), this.generatePolygon("vee", [
		-1,
		-1,
		0,
		-.333,
		1,
		-1,
		0,
		1
	]), this.generatePolygon("rhomboid", [
		-1,
		-1,
		.333,
		-1,
		1,
		1,
		-.333,
		1
	]), this.generatePolygon("right-rhomboid", [
		-.333,
		-1,
		1,
		-1,
		.333,
		1,
		-1,
		1
	]), this.nodeShapes.concavehexagon = this.generatePolygon("concave-hexagon", [
		-1,
		-.95,
		-.75,
		0,
		-1,
		.95,
		1,
		.95,
		.75,
		0,
		1,
		-.95
	]);
	var c = [
		-1,
		-1,
		.25,
		-1,
		1,
		0,
		.25,
		1,
		-1,
		1
	];
	this.generatePolygon("tag", c), this.generateRoundPolygon("round-tag", c), e.makePolygon = function(e) {
		var n = "polygon-" + e.join("$"), r;
		return (r = this[n]) ? r : t.generatePolygon(n, e);
	};
};
var ap = {};
ap.timeToRender = function() {
	return this.redrawTotalTime / this.redrawCount;
}, ap.redraw = function(e) {
	e ||= $t();
	var t = this;
	t.averageRedrawTime === void 0 && (t.averageRedrawTime = 0), t.lastRedrawTime === void 0 && (t.lastRedrawTime = 0), t.lastDrawTime === void 0 && (t.lastDrawTime = 0), t.requestedFrame = !0, t.renderOptions = e;
}, ap.beforeRender = function(e, t) {
	if (!this.destroyed) {
		t ?? Gt("Priority is not optional for beforeRender");
		var n = this.beforeRenderCallbacks;
		n.push({
			fn: e,
			priority: t
		}), n.sort(function(e, t) {
			return t.priority - e.priority;
		});
	}
};
var op = function(e, t, n) {
	for (var r = e.beforeRenderCallbacks, i = 0; i < r.length; i++) r[i].fn(t, n);
};
ap.startRenderLoop = function() {
	var e = this, t = e.cy;
	if (!e.renderLoopStarted) {
		e.renderLoopStarted = !0;
		var n = function(r) {
			if (!e.destroyed) {
				if (!t.batching()) {
					if (e.requestedFrame && !e.skipFrame) {
						op(e, !0, r);
						var i = bt();
						e.render(e.renderOptions);
						var a = e.lastDrawTime = bt();
						e.averageRedrawTime === void 0 && (e.averageRedrawTime = a - i), e.redrawCount === void 0 && (e.redrawCount = 0), e.redrawCount++, e.redrawTotalTime === void 0 && (e.redrawTotalTime = 0);
						var o = a - i;
						e.redrawTotalTime += o, e.lastRedrawTime = o, e.averageRedrawTime = e.averageRedrawTime / 2 + o / 2, e.requestedFrame = !1;
					} else op(e, !1, r);
				}
				e.skipFrame = !1, yt(n);
			}
		};
		yt(n);
	}
};
var sp = function(e) {
	this.init(e);
}, cp = sp.prototype;
cp.clientFunctions = [
	"redrawHint",
	"render",
	"renderTo",
	"matchCanvasSize",
	"nodeShapeImpl",
	"arrowShapeImpl"
], cp.init = function(e) {
	var t = this;
	t.options = e, t.cy = e.cy;
	var n = t.container = e.cy.container(), r = t.cy.window();
	if (r) {
		var i = r.document, a = i.head, o = "__________cytoscape_stylesheet", s = "__________cytoscape_container", c = i.getElementById(o) != null;
		if (n.className.indexOf(s) < 0 && (n.className = (n.className || "") + " " + s), !c) {
			var l = i.createElement("style");
			l.id = o, l.textContent = "." + s + " { position: relative; }", a.insertBefore(l, a.children[0]);
		}
		r.getComputedStyle(n).getPropertyValue("position") === "static" && qt("A Cytoscape container has style position:static and so can not use UI extensions properly");
	}
	t.selection = [
		void 0,
		void 0,
		void 0,
		void 0,
		0
	], t.bezierProjPcts = [
		.05,
		.225,
		.4,
		.5,
		.6,
		.775,
		.95
	], t.hoverData = {
		down: null,
		last: null,
		downTime: null,
		triggerMode: null,
		dragging: !1,
		initialPan: [null, null],
		capture: !1
	}, t.dragData = { possibleDragElements: [] }, t.touchData = {
		start: null,
		capture: !1,
		startPosition: [
			null,
			null,
			null,
			null,
			null,
			null
		],
		singleTouchStartTime: null,
		singleTouchMoved: !0,
		now: [
			null,
			null,
			null,
			null,
			null,
			null
		],
		earlier: [
			null,
			null,
			null,
			null,
			null,
			null
		]
	}, t.redraws = 0, t.showFps = e.showFps, t.debug = e.debug, t.webgl = e.webgl, t.hideEdgesOnViewport = e.hideEdgesOnViewport, t.textureOnViewport = e.textureOnViewport, t.wheelSensitivity = e.wheelSensitivity, t.motionBlurEnabled = e.motionBlur, t.forcedPixelRatio = B(e.pixelRatio) ? e.pixelRatio : null, t.motionBlur = e.motionBlur, t.motionBlurOpacity = e.motionBlurOpacity, t.motionBlurTransparency = 1 - t.motionBlurOpacity, t.motionBlurPxRatio = 1, t.mbPxRBlurry = 1, t.minMbLowQualFrames = 4, t.fullQualityMb = !1, t.clearedForMotionBlur = [], t.desktopTapThreshold = e.desktopTapThreshold, t.desktopTapThreshold2 = e.desktopTapThreshold * e.desktopTapThreshold, t.touchTapThreshold = e.touchTapThreshold, t.touchTapThreshold2 = e.touchTapThreshold * e.touchTapThreshold, t.tapholdDuration = 500, t.bindings = [], t.beforeRenderCallbacks = [], t.beforeRenderPriorities = {
		animations: 400,
		eleCalcs: 300,
		eleTxrDeq: 200,
		lyrTxrDeq: 150,
		lyrTxrSkip: 100
	}, t.registerNodeShapes(), t.registerArrowShapes(), t.registerCalculationListeners();
}, cp.notify = function(e, t) {
	var n = this, r = n.cy;
	if (!this.destroyed) {
		if (e === "init") {
			n.load();
			return;
		}
		if (e === "destroy") {
			n.destroy();
			return;
		}
		(e === "add" || e === "remove" || e === "move" && r.hasCompoundNodes() || e === "load" || e === "zorder" || e === "mount") && n.invalidateCachedZSortedEles(), e === "viewport" && n.redrawHint("select", !0), e === "gc" && n.redrawHint("gc", !0), (e === "load" || e === "resize" || e === "mount") && (n.invalidateContainerClientCoordsCache(), n.matchCanvasSize(n.container)), n.redrawHint("eles", !0), n.redrawHint("drag", !0), this.startRenderLoop(), this.redraw();
	}
}, cp.destroy = function() {
	var e = this;
	e.destroyed = !0, e.cy.stopAnimationLoop();
	for (var t = 0; t < e.bindings.length; t++) {
		var n = e.bindings[t], r = n.target;
		(r.off || r.removeEventListener).apply(r, n.args);
	}
	if (e.bindings = [], e.beforeRenderCallbacks = [], e.onUpdateEleCalcsFns = [], e.removeObserver && e.removeObserver.disconnect(), e.styleObserver && e.styleObserver.disconnect(), e.resizeObserver && e.resizeObserver.disconnect(), e.labelCalcDiv) try {
		document.body.removeChild(e.labelCalcDiv);
	} catch {}
}, cp.isHeadless = function() {
	return !1;
}, [
	lf,
	Qf,
	$f,
	rp,
	ip,
	ap
].forEach(function(e) {
	Z(cp, e);
});
var lp = 1e3 / 60, up = { setupDequeueing: function(e) {
	return function() {
		var t = this, n = this.renderer;
		if (!t.dequeueingSetup) {
			t.dequeueingSetup = !0;
			var r = ht(function() {
				n.redrawHint("eles", !0), n.redrawHint("drag", !0), n.redraw();
			}, e.deqRedrawThreshold), i = function(i, a) {
				var o = bt(), s = n.averageRedrawTime, c = n.lastRedrawTime, l = [], u = n.cy.extent(), d = n.getPixelRatio();
				for (i || n.flushRenderedStyleQueue();;) {
					var f = bt(), p = f - o, m = f - a;
					if (c < lp) {
						var h = lp - (i ? s : 0);
						if (m >= e.deqFastCost * h) break;
					} else if (i) {
						if (p >= e.deqCost * c || p >= e.deqAvgCost * s) break;
					} else if (m >= e.deqNoDrawCost * lp) break;
					var g = e.deq(t, d, u);
					if (g.length > 0) for (var _ = 0; _ < g.length; _++) l.push(g[_]);
					else break;
				}
				l.length > 0 && (e.onDeqd(t, l), !i && e.shouldRedraw(t, l, d, u) && r());
			}, a = e.priority || Wt;
			n.beforeRender(i, a(t));
		}
	};
} }, dp = /*#__PURE__*/ function() {
	function e(t) {
		var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ht;
		p(this, e), this.idsByKey = new sn(), this.keyForId = new sn(), this.cachesByLvl = new sn(), this.lvls = [], this.getKey = t, this.doesEleInvalidateKey = n;
	}
	return h(e, [
		{
			key: "getIdsFor",
			value: function(e) {
				e ?? Gt("Can not get id list for null key");
				var t = this.idsByKey, n = this.idsByKey.get(e);
				return n || (n = new un(), t.set(e, n)), n;
			}
		},
		{
			key: "addIdForKey",
			value: function(e, t) {
				e != null && this.getIdsFor(e).add(t);
			}
		},
		{
			key: "deleteIdForKey",
			value: function(e, t) {
				e != null && this.getIdsFor(e).delete(t);
			}
		},
		{
			key: "getNumberOfIdsForKey",
			value: function(e) {
				return e == null ? 0 : this.getIdsFor(e).size;
			}
		},
		{
			key: "updateKeyMappingFor",
			value: function(e) {
				var t = e.id(), n = this.keyForId.get(t), r = this.getKey(e);
				this.deleteIdForKey(n, t), this.addIdForKey(r, t), this.keyForId.set(t, r);
			}
		},
		{
			key: "deleteKeyMappingFor",
			value: function(e) {
				var t = e.id(), n = this.keyForId.get(t);
				this.deleteIdForKey(n, t), this.keyForId.delete(t);
			}
		},
		{
			key: "keyHasChangedFor",
			value: function(e) {
				var t = e.id();
				return this.keyForId.get(t) !== this.getKey(e);
			}
		},
		{
			key: "isInvalid",
			value: function(e) {
				return this.keyHasChangedFor(e) || this.doesEleInvalidateKey(e);
			}
		},
		{
			key: "getCachesAt",
			value: function(e) {
				var t = this.cachesByLvl, n = this.lvls, r = t.get(e);
				return r || (r = new sn(), t.set(e, r), n.push(e)), r;
			}
		},
		{
			key: "getCache",
			value: function(e, t) {
				return this.getCachesAt(t).get(e);
			}
		},
		{
			key: "get",
			value: function(e, t) {
				var n = this.getKey(e), r = this.getCache(n, t);
				return r != null && this.updateKeyMappingFor(e), r;
			}
		},
		{
			key: "getForCachedKey",
			value: function(e, t) {
				var n = this.keyForId.get(e.id());
				return this.getCache(n, t);
			}
		},
		{
			key: "hasCache",
			value: function(e, t) {
				return this.getCachesAt(t).has(e);
			}
		},
		{
			key: "has",
			value: function(e, t) {
				var n = this.getKey(e);
				return this.hasCache(n, t);
			}
		},
		{
			key: "setCache",
			value: function(e, t, n) {
				n.key = e, this.getCachesAt(t).set(e, n);
			}
		},
		{
			key: "set",
			value: function(e, t, n) {
				var r = this.getKey(e);
				this.setCache(r, t, n), this.updateKeyMappingFor(e);
			}
		},
		{
			key: "deleteCache",
			value: function(e, t) {
				this.getCachesAt(t).delete(e);
			}
		},
		{
			key: "delete",
			value: function(e, t) {
				var n = this.getKey(e);
				this.deleteCache(n, t);
			}
		},
		{
			key: "invalidateKey",
			value: function(e) {
				var t = this;
				this.lvls.forEach(function(n) {
					return t.deleteCache(e, n);
				});
			}
		},
		{
			key: "invalidate",
			value: function(e) {
				var t = e.id(), n = this.keyForId.get(t);
				this.deleteKeyMappingFor(e);
				var r = this.doesEleInvalidateKey(e);
				return r && this.invalidateKey(n), r || this.getNumberOfIdsForKey(n) === 0;
			}
		}
	]);
}(), fp = 25, pp = 50, mp = -4, hp = 3, gp = 7.99, _p = 8, vp = 1024, yp = 1024, bp = 1024, xp = .2, Sp = .8, Cp = 10, wp = .15, Tp = .1, Ep = .9, Dp = .9, Op = 100, kp = 1, Ap = {
	dequeue: "dequeue",
	downscale: "downscale",
	highQuality: "highQuality"
}, jp = en({
	getKey: null,
	doesEleInvalidateKey: Ht,
	drawElement: null,
	getBoundingBox: null,
	getRotationPoint: null,
	getRotationOffset: null,
	isVisible: Vt,
	allowEdgeTxrCaching: !0,
	allowParentTxrCaching: !0
}), Mp = function(e, t) {
	var n = this;
	n.renderer = e, n.onDequeues = [];
	var r = jp(t);
	Z(n, r), n.lookup = new dp(r.getKey, r.doesEleInvalidateKey), n.setupDequeueing();
}, Np = Mp.prototype;
Np.reasons = Ap, Np.getTextureQueue = function(e) {
	var t = this;
	return t.eleImgCaches = t.eleImgCaches || {}, t.eleImgCaches[e] = t.eleImgCaches[e] || [];
}, Np.getRetiredTextureQueue = function(e) {
	var t = this, n = t.eleImgCaches.retired = t.eleImgCaches.retired || {};
	return n[e] = n[e] || [];
}, Np.getElementQueue = function() {
	var e = this;
	return e.eleCacheQueue = e.eleCacheQueue || new xn(function(e, t) {
		return t.reqs - e.reqs;
	});
}, Np.getElementKeyToQueue = function() {
	var e = this;
	return e.eleKeyToCacheQueue = e.eleKeyToCacheQueue || {};
}, Np.getElement = function(e, t, n, r, i) {
	var a = this, o = this.renderer, s = o.cy.zoom(), c = this.lookup;
	if (!t || t.w === 0 || t.h === 0 || isNaN(t.w) || isNaN(t.h) || !e.visible() || e.removed() || !a.allowEdgeTxrCaching && e.isEdge() || !a.allowParentTxrCaching && e.isParent()) return null;
	if (r ??= Math.ceil(qn(s * n)), r < mp) r = mp;
	else if (s >= gp || r > hp) return null;
	var l = 2 ** r, u = t.h * l, d = t.w * l, f = o.eleTextBiggerThanMin(e, l);
	if (!this.isVisible(e, f)) return null;
	var p = c.get(e, r);
	if (p && p.invalidated && (p.invalidated = !1, p.texture.invalidatedWidth -= p.width), p) return p;
	var m = u <= fp ? fp : u <= pp ? pp : Math.ceil(u / pp) * pp;
	if (u > bp || d > yp) return null;
	var h = a.getTextureQueue(m), g = h[h.length - 2], _ = function() {
		return a.recycleTexture(m, d) || a.addTexture(m, d);
	};
	g ||= h[h.length - 1], g ||= _(), g.width - g.usedWidth < d && (g = _());
	for (var v = function(e) {
		return e && e.scaledLabelShown === f;
	}, y = i && i === Ap.dequeue, b = i && i === Ap.highQuality, x = i && i === Ap.downscale, S, C = r + 1; C <= hp; C++) {
		var w = c.get(e, C);
		if (w) {
			S = w;
			break;
		}
	}
	var T = S && S.level === r + 1 ? S : null, E = function() {
		g.context.drawImage(T.texture.canvas, T.x, 0, T.width, T.height, g.usedWidth, 0, d, u);
	};
	if (g.context.setTransform(1, 0, 0, 1, 0, 0), g.context.clearRect(g.usedWidth, 0, d, m), v(T)) E();
	else if (v(S)) {
		if (b) {
			for (var D = S.level; D > r; D--) T = a.getElement(e, t, n, D, Ap.downscale);
			E();
		} else return a.queueElement(e, S.level - 1), S;
	} else {
		var O;
		if (!y && !b && !x) for (var k = r - 1; k >= mp; k--) {
			var A = c.get(e, k);
			if (A) {
				O = A;
				break;
			}
		}
		if (v(O)) return a.queueElement(e, r), O;
		g.context.translate(g.usedWidth, 0), g.context.scale(l, l), this.drawElement(g.context, e, t, f, !1), g.context.scale(1 / l, 1 / l), g.context.translate(-g.usedWidth, 0);
	}
	return p = {
		x: g.usedWidth,
		texture: g,
		level: r,
		scale: l,
		width: d,
		height: u,
		scaledLabelShown: f
	}, g.usedWidth += Math.ceil(d + _p), g.eleCaches.push(p), c.set(e, r, p), a.checkTextureFullness(g), p;
}, Np.invalidateElements = function(e) {
	for (var t = 0; t < e.length; t++) this.invalidateElement(e[t]);
}, Np.invalidateElement = function(e) {
	var t = this, n = t.lookup, r = [];
	if (n.isInvalid(e)) {
		for (var i = mp; i <= hp; i++) {
			var a = n.getForCachedKey(e, i);
			a && r.push(a);
		}
		if (n.invalidate(e)) for (var o = 0; o < r.length; o++) {
			var s = r[o], c = s.texture;
			c.invalidatedWidth += s.width, s.invalidated = !0, t.checkTextureUtility(c);
		}
		t.removeFromQueue(e);
	}
}, Np.checkTextureUtility = function(e) {
	e.invalidatedWidth >= xp * e.width && this.retireTexture(e);
}, Np.checkTextureFullness = function(e) {
	var t = this.getTextureQueue(e.height);
	e.usedWidth / e.width > Sp && e.fullnessChecks >= Cp ? tn(t, e) : e.fullnessChecks++;
}, Np.retireTexture = function(e) {
	var t = this, n = e.height, r = t.getTextureQueue(n), i = this.lookup;
	tn(r, e), e.retired = !0;
	for (var a = e.eleCaches, o = 0; o < a.length; o++) {
		var s = a[o];
		i.deleteCache(s.key, s.level);
	}
	nn(a), t.getRetiredTextureQueue(n).push(e);
}, Np.addTexture = function(e, t) {
	var n = this, r = n.getTextureQueue(e), i = {};
	return r.push(i), i.eleCaches = [], i.height = e, i.width = Math.max(vp, t), i.usedWidth = 0, i.invalidatedWidth = 0, i.fullnessChecks = 0, i.canvas = n.renderer.makeOffscreenCanvas(i.width, i.height), i.context = i.canvas.getContext("2d"), i;
}, Np.recycleTexture = function(e, t) {
	for (var n = this, r = n.getTextureQueue(e), i = n.getRetiredTextureQueue(e), a = 0; a < i.length; a++) {
		var o = i[a];
		if (o.width >= t) return o.retired = !1, o.usedWidth = 0, o.invalidatedWidth = 0, o.fullnessChecks = 0, nn(o.eleCaches), o.context.setTransform(1, 0, 0, 1, 0, 0), o.context.clearRect(0, 0, o.width, o.height), tn(i, o), r.push(o), o;
	}
}, Np.queueElement = function(e, t) {
	var n = this, r = n.getElementQueue(), i = n.getElementKeyToQueue(), a = this.getKey(e), o = i[a];
	if (o) o.level = Math.max(o.level, t), o.eles.merge(e), o.reqs++, r.updateItem(o);
	else {
		var s = {
			eles: e.spawn().merge(e),
			level: t,
			reqs: 1,
			key: a
		};
		r.push(s), i[a] = s;
	}
}, Np.dequeue = function(e) {
	for (var t = this, n = t.getElementQueue(), r = t.getElementKeyToQueue(), i = [], a = t.lookup, o = 0; o < kp && n.size() > 0; o++) {
		var s = n.pop(), c = s.key, l = s.eles[0], u = a.hasCache(l, s.level);
		if (r[c] = null, !u) {
			i.push(s);
			var d = t.getBoundingBox(l);
			t.getElement(l, d, e, s.level, Ap.dequeue);
		}
	}
	return i;
}, Np.removeFromQueue = function(e) {
	var t = this, n = t.getElementQueue(), r = t.getElementKeyToQueue(), i = this.getKey(e), a = r[i];
	a != null && (a.eles.length === 1 ? (a.reqs = Bt, n.updateItem(a), n.pop(), r[i] = null) : a.eles.unmerge(e));
}, Np.onDequeue = function(e) {
	this.onDequeues.push(e);
}, Np.offDequeue = function(e) {
	tn(this.onDequeues, e);
}, Np.setupDequeueing = up.setupDequeueing({
	deqRedrawThreshold: Op,
	deqCost: wp,
	deqAvgCost: Tp,
	deqNoDrawCost: Ep,
	deqFastCost: Dp,
	deq: function(e, t, n) {
		return e.dequeue(t, n);
	},
	onDeqd: function(e, t) {
		for (var n = 0; n < e.onDequeues.length; n++) {
			var r = e.onDequeues[n];
			r(t);
		}
	},
	shouldRedraw: function(e, t, n, r) {
		for (var i = 0; i < t.length; i++) for (var a = t[i].eles, o = 0; o < a.length; o++) if (ur(a[o].boundingBox(), r)) return !0;
		return !1;
	},
	priority: function(e) {
		return e.renderer.beforeRenderPriorities.eleTxrDeq;
	}
});
var Pp = 1, Fp = -4, Ip = 2, Lp = 3.99, Rp = 50, zp = 50, Bp = .15, Vp = .1, Hp = .9, Up = .9, Wp = 1, Gp = 250, Kp = 16e6, qp = 32767, Jp = !0, Yp = function(e) {
	var t = this, n = t.renderer = e, r = n.cy;
	t.layersByLevel = {}, t.firstGet = !0, t.lastInvalidationTime = bt() - 2 * Gp, t.skipping = !1, t.eleTxrDeqs = r.collection(), t.scheduleElementRefinement = ht(function() {
		t.refineElementTextures(t.eleTxrDeqs), t.eleTxrDeqs.unmerge(t.eleTxrDeqs);
	}, zp), n.beforeRender(function(e, n) {
		t.skipping = n - t.lastInvalidationTime <= Gp;
	}, n.beforeRenderPriorities.lyrTxrSkip), t.layersQueue = new xn(function(e, t) {
		return t.reqs - e.reqs;
	}), t.setupDequeueing();
}, Xp = Yp.prototype, Zp = 0, Qp = 2 ** 53 - 1;
Xp.makeLayer = function(e, t) {
	var n = 2 ** t, r = Math.ceil(e.w * n), i = Math.ceil(e.h * n), a = this.renderer.makeOffscreenCanvas(r, i), o = {
		id: Zp = ++Zp % Qp,
		bb: e,
		level: t,
		width: r,
		height: i,
		canvas: a,
		context: a.getContext("2d"),
		eles: [],
		elesQueue: [],
		reqs: 0
	}, s = o.context, c = -o.bb.x1, l = -o.bb.y1;
	return s.scale(n, n), s.translate(c, l), o;
}, Xp.getLayers = function(e, t, n) {
	var r = this, i = r.renderer.cy.zoom(), a = r.firstGet;
	if (r.firstGet = !1, n == null) {
		if (n = Math.ceil(qn(i * t)), n < Fp) n = Fp;
		else if (i >= Lp || n > Ip) return null;
	}
	r.validateLayersElesOrdering(n, e);
	var o = r.layersByLevel, s = 2 ** n, c = o[n] = o[n] || [], l, u = r.levelIsComplete(n, e), d, f = function() {
		var t = function(t) {
			if (r.validateLayersElesOrdering(t, e), r.levelIsComplete(t, e)) return d = o[t], !0;
		}, i = function(e) {
			if (!d) for (var r = n + e; Fp <= r && r <= Ip && !t(r); r += e);
		};
		i(1), i(-1);
		for (var a = c.length - 1; a >= 0; a--) {
			var s = c[a];
			s.invalid && tn(c, s);
		}
	};
	if (!u) f();
	else return c;
	var p = function() {
		if (!l) {
			l = nr();
			for (var t = 0; t < e.length; t++) ar(l, e[t].boundingBox());
		}
		return l;
	}, m = function(e) {
		e ||= {};
		var t = e.after;
		p();
		var i = Math.ceil(l.w * s), a = Math.ceil(l.h * s);
		if (i > qp || a > qp || i * a > Kp) return null;
		var o = r.makeLayer(l, n);
		if (t != null) {
			var u = c.indexOf(t) + 1;
			c.splice(u, 0, o);
		} else (e.insert === void 0 || e.insert) && c.unshift(o);
		return o;
	};
	if (r.skipping && !a) return null;
	for (var h = null, g = e.length / Pp, _ = !a, v = 0; v < e.length; v++) {
		var y = e[v], b = y._private.rscratch, x = b.imgLayerCaches = b.imgLayerCaches || {}, S = x[n];
		if (S) {
			h = S;
			continue;
		}
		if ((!h || h.eles.length >= g || !pr(h.bb, y.boundingBox())) && (h = m({
			insert: !0,
			after: h
		}), !h)) return null;
		d || _ ? r.queueLayer(h, y) : r.drawEleInLayer(h, y, n, t), h.eles.push(y), x[n] = h;
	}
	return d || (_ ? null : c);
}, Xp.getEleLevelForLayerLevel = function(e, t) {
	return e;
}, Xp.drawEleInLayer = function(e, t, n, r) {
	var i = this, a = this.renderer, o = e.context, s = t.boundingBox();
	s.w !== 0 && s.h !== 0 && t.visible() && (n = i.getEleLevelForLayerLevel(n, r), a.setImgSmoothing(o, !1), a.drawCachedElement(o, t, null, null, n, Jp), a.setImgSmoothing(o, !0));
}, Xp.levelIsComplete = function(e, t) {
	var n = this.layersByLevel[e];
	if (!n || n.length === 0) return !1;
	for (var r = 0, i = 0; i < n.length; i++) {
		var a = n[i];
		if (a.reqs > 0 || a.invalid) return !1;
		r += a.eles.length;
	}
	return r === t.length;
}, Xp.validateLayersElesOrdering = function(e, t) {
	var n = this.layersByLevel[e];
	if (n) for (var r = 0; r < n.length; r++) {
		for (var i = n[r], a = -1, o = 0; o < t.length; o++) if (i.eles[0] === t[o]) {
			a = o;
			break;
		}
		if (a < 0) {
			this.invalidateLayer(i);
			continue;
		}
		for (var s = a, o = 0; o < i.eles.length; o++) if (i.eles[o] !== t[s + o]) {
			this.invalidateLayer(i);
			break;
		}
	}
}, Xp.updateElementsInLayers = function(e, t) {
	for (var n = this, r = W(e[0]), i = 0; i < e.length; i++) for (var a = r ? null : e[i], o = r ? e[i] : e[i].ele, s = o._private.rscratch, c = s.imgLayerCaches = s.imgLayerCaches || {}, l = Fp; l <= Ip; l++) {
		var u = c[l];
		u && (a && n.getEleLevelForLayerLevel(u.level) !== a.level || t(u, o, a));
	}
}, Xp.haveLayers = function() {
	for (var e = this, t = !1, n = Fp; n <= Ip; n++) {
		var r = e.layersByLevel[n];
		if (r && r.length > 0) {
			t = !0;
			break;
		}
	}
	return t;
}, Xp.invalidateElements = function(e) {
	var t = this;
	e.length !== 0 && (t.lastInvalidationTime = bt(), e.length !== 0 && t.haveLayers() && t.updateElementsInLayers(e, function(e, n, r) {
		t.invalidateLayer(e);
	}));
}, Xp.invalidateLayer = function(e) {
	if (this.lastInvalidationTime = bt(), !e.invalid) {
		var t = e.level, n = e.eles, r = this.layersByLevel[t];
		tn(r, e), e.elesQueue = [], e.invalid = !0, e.replacement && (e.replacement.invalid = !0);
		for (var i = 0; i < n.length; i++) {
			var a = n[i]._private.rscratch.imgLayerCaches;
			a && (a[t] = null);
		}
	}
}, Xp.refineElementTextures = function(e) {
	var t = this;
	t.updateElementsInLayers(e, function(e, n, r) {
		var i = e.replacement;
		if (i || (i = e.replacement = t.makeLayer(e.bb, e.level), i.replaces = e, i.eles = e.eles), !i.reqs) for (var a = 0; a < i.eles.length; a++) t.queueLayer(i, i.eles[a]);
	});
}, Xp.enqueueElementRefinement = function(e) {
	this.eleTxrDeqs.merge(e), this.scheduleElementRefinement();
}, Xp.queueLayer = function(e, t) {
	var n = this.layersQueue, r = e.elesQueue, i = r.hasId = r.hasId || {};
	if (!e.replacement) {
		if (t) {
			if (i[t.id()]) return;
			r.push(t), i[t.id()] = !0;
		}
		e.reqs ? (e.reqs++, n.updateItem(e)) : (e.reqs = 1, n.push(e));
	}
}, Xp.dequeue = function(e) {
	for (var t = this, n = t.layersQueue, r = [], i = 0; i < Wp && n.size() !== 0;) {
		var a = n.peek();
		if (a.replacement) {
			n.pop();
			continue;
		}
		if (a.replaces && a !== a.replaces.replacement) {
			n.pop();
			continue;
		}
		if (a.invalid) {
			n.pop();
			continue;
		}
		var o = a.elesQueue.shift();
		o && (t.drawEleInLayer(a, o, a.level, e), i++), r.length === 0 && r.push(!0), a.elesQueue.length === 0 && (n.pop(), a.reqs = 0, a.replaces && t.applyLayerReplacement(a), t.requestRedraw());
	}
	return r;
}, Xp.applyLayerReplacement = function(e) {
	var t = this, n = t.layersByLevel[e.level], r = e.replaces, i = n.indexOf(r);
	if (!(i < 0 || r.invalid)) {
		n[i] = e;
		for (var a = 0; a < e.eles.length; a++) {
			var o = e.eles[a]._private, s = o.imgLayerCaches = o.imgLayerCaches || {};
			s && (s[e.level] = e);
		}
		t.requestRedraw();
	}
}, Xp.requestRedraw = ht(function() {
	var e = this.renderer;
	e.redrawHint("eles", !0), e.redrawHint("drag", !0), e.redraw();
}, 100), Xp.setupDequeueing = up.setupDequeueing({
	deqRedrawThreshold: Rp,
	deqCost: Bp,
	deqAvgCost: Vp,
	deqNoDrawCost: Hp,
	deqFastCost: Up,
	deq: function(e, t) {
		return e.dequeue(t);
	},
	onDeqd: Wt,
	shouldRedraw: Vt,
	priority: function(e) {
		return e.renderer.beforeRenderPriorities.lyrTxrDeq;
	}
});
var $p = {}, em;
function tm(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		e.lineTo(r.x, r.y);
	}
}
function nm(e, t, n) {
	for (var r, i = 0; i < t.length; i++) {
		var a = t[i];
		i === 0 && (r = a), e.lineTo(a.x, a.y);
	}
	e.quadraticCurveTo(n.x, n.y, r.x, r.y);
}
function rm(e, t, n) {
	e.beginPath && e.beginPath();
	for (var r = t, i = 0; i < r.length; i++) {
		var a = r[i];
		e.lineTo(a.x, a.y);
	}
	var o = n, s = n[0];
	e.moveTo(s.x, s.y);
	for (var i = 1; i < o.length; i++) {
		var a = o[i];
		e.lineTo(a.x, a.y);
	}
	e.closePath && e.closePath();
}
function im(e, t, n, r, i) {
	e.beginPath && e.beginPath(), e.arc(n, r, i, 0, Math.PI * 2, !1);
	var a = t, o = a[0];
	e.moveTo(o.x, o.y);
	for (var s = 0; s < a.length; s++) {
		var c = a[s];
		e.lineTo(c.x, c.y);
	}
	e.closePath && e.closePath();
}
function am(e, t, n, r) {
	e.arc(t, n, r, 0, Math.PI * 2, !1);
}
$p.arrowShapeImpl = function(e) {
	return (em ||= {
		polygon: tm,
		"triangle-backcurve": nm,
		"triangle-tee": rm,
		"circle-triangle": im,
		"triangle-cross": rm,
		circle: am
	})[e];
};
var om = {};
om.drawElement = function(e, t, n, r, i, a) {
	var o = this;
	t.isNode() ? o.drawNode(e, t, n, r, i, a) : o.drawEdge(e, t, n, r, i, a);
}, om.drawElementOverlay = function(e, t) {
	var n = this;
	t.isNode() ? n.drawNodeOverlay(e, t) : n.drawEdgeOverlay(e, t);
}, om.drawElementUnderlay = function(e, t) {
	var n = this;
	t.isNode() ? n.drawNodeUnderlay(e, t) : n.drawEdgeUnderlay(e, t);
}, om.drawCachedElementPortion = function(e, t, n, r, i, a, o, s) {
	var c = this, l = n.getBoundingBox(t);
	if (l.w !== 0 && l.h !== 0) {
		var u = n.getElement(t, l, r, i, a);
		if (u != null) {
			var d = s(c, t);
			if (d === 0) return;
			var f = o(c, t), p = l.x1, m = l.y1, h = l.w, g = l.h, _, v, y, b, x;
			if (f !== 0) {
				var S = n.getRotationPoint(t);
				y = S.x, b = S.y, e.translate(y, b), e.rotate(f), x = c.getImgSmoothing(e), x || c.setImgSmoothing(e, !0);
				var C = n.getRotationOffset(t);
				_ = C.x, v = C.y;
			} else _ = p, v = m;
			var w;
			d !== 1 && (w = e.globalAlpha, e.globalAlpha = w * d), e.drawImage(u.texture.canvas, u.x, 0, u.width, u.height, _, v, h, g), d !== 1 && (e.globalAlpha = w), f !== 0 && (e.rotate(-f), e.translate(-y, -b), x || c.setImgSmoothing(e, !1));
		} else n.drawElement(e, t);
	}
};
var sm = function() {
	return 0;
}, cm = function(e, t) {
	return e.getTextAngle(t, null);
}, lm = function(e, t) {
	return e.getTextAngle(t, "source");
}, um = function(e, t) {
	return e.getTextAngle(t, "target");
}, dm = function(e, t) {
	return t.effectiveOpacity();
}, fm = function(e, t) {
	return t.pstyle("text-opacity").pfValue * t.effectiveOpacity();
};
om.drawCachedElement = function(e, t, n, r, i, a) {
	var o = this, s = o.data, c = s.eleTxrCache, l = s.lblTxrCache, u = s.slbTxrCache, d = s.tlbTxrCache, f = t.boundingBox(), p = a === !0 ? c.reasons.highQuality : null;
	if (f.w !== 0 && f.h !== 0 && t.visible() && (!r || ur(f, r))) {
		var m = t.isEdge(), h = t.element()._private.rscratch.badLine;
		o.drawElementUnderlay(e, t), o.drawCachedElementPortion(e, t, c, n, i, p, sm, dm), (!m || !h) && o.drawCachedElementPortion(e, t, l, n, i, p, cm, fm), m && !h && (o.drawCachedElementPortion(e, t, u, n, i, p, lm, fm), o.drawCachedElementPortion(e, t, d, n, i, p, um, fm)), o.drawElementOverlay(e, t);
	}
}, om.drawElements = function(e, t) {
	for (var n = this, r = 0; r < t.length; r++) {
		var i = t[r];
		n.drawElement(e, i);
	}
}, om.drawCachedElements = function(e, t, n, r) {
	for (var i = this, a = 0; a < t.length; a++) {
		var o = t[a];
		i.drawCachedElement(e, o, n, r);
	}
}, om.drawCachedNodes = function(e, t, n, r) {
	for (var i = this, a = 0; a < t.length; a++) {
		var o = t[a];
		o.isNode() && i.drawCachedElement(e, o, n, r);
	}
}, om.drawLayeredElements = function(e, t, n, r) {
	var i = this, a = i.data.lyrTxrCache.getLayers(t, n);
	if (a) for (var o = 0; o < a.length; o++) {
		var s = a[o], c = s.bb;
		c.w !== 0 && c.h !== 0 && e.drawImage(s.canvas, c.x1, c.y1, c.w, c.h);
	}
	else i.drawCachedElements(e, t, n, r);
};
var pm = {};
pm.drawEdge = function(e, t, n) {
	var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : !0, o = this, s = t._private.rscratch;
	if ((!a || t.visible()) && !(s.badLine || s.allpts == null || isNaN(s.allpts[0]))) {
		var c;
		n && (c = n, e.translate(-c.x1, -c.y1));
		var l = a ? t.pstyle("opacity").value : 1, u = a ? t.pstyle("line-opacity").value : 1, d = t.pstyle("curve-style").value, f = t.pstyle("line-style").value, p = t.pstyle("width").pfValue, m = t.pstyle("line-cap").value, h = t.pstyle("line-outline-width").value, g = t.pstyle("line-outline-color").value, _ = l * u, v = l * u, y = function() {
			var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _;
			d === "straight-triangle" ? (o.eleStrokeStyle(e, t, n), o.drawEdgeTrianglePath(t, e, s.allpts)) : (e.lineWidth = p, e.lineCap = m, o.eleStrokeStyle(e, t, n), o.drawEdgePath(t, e, s.allpts, f), e.lineCap = "butt");
		}, b = function() {
			var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _;
			if (e.lineWidth = p + h, e.lineCap = m, h > 0) o.colorStrokeStyle(e, g[0], g[1], g[2], n);
			else {
				e.lineCap = "butt";
				return;
			}
			d === "straight-triangle" ? o.drawEdgeTrianglePath(t, e, s.allpts) : (o.drawEdgePath(t, e, s.allpts, f), e.lineCap = "butt");
		}, x = function() {
			i && o.drawEdgeOverlay(e, t);
		}, S = function() {
			i && o.drawEdgeUnderlay(e, t);
		}, C = function() {
			var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : v;
			o.drawArrowheads(e, t, n);
		}, w = function() {
			o.drawElementText(e, t, null, r);
		};
		if (e.lineJoin = "round", t.pstyle("ghost").value === "yes") {
			var T = t.pstyle("ghost-offset-x").pfValue, E = t.pstyle("ghost-offset-y").pfValue, D = _ * t.pstyle("ghost-opacity").value;
			e.translate(T, E), y(D), C(D), e.translate(-T, -E);
		} else b();
		S(), y(), C(), x(), w(), n && e.translate(c.x1, c.y1);
	}
};
var mm = function(e) {
	if (!["overlay", "underlay"].includes(e)) throw Error("Invalid state");
	return function(t, n) {
		if (n.visible()) {
			var r = n.pstyle(`${e}-opacity`).value;
			if (r !== 0) {
				var i = this, a = i.usePaths(), o = n._private.rscratch, s = 2 * n.pstyle(`${e}-padding`).pfValue, c = n.pstyle(`${e}-color`).value;
				t.lineWidth = s, t.lineCap = o.edgeType === "self" && !a ? "butt" : "round", i.colorStrokeStyle(t, c[0], c[1], c[2], r), i.drawEdgePath(n, t, o.allpts, "solid");
			}
		}
	};
};
pm.drawEdgeOverlay = mm("overlay"), pm.drawEdgeUnderlay = mm("underlay"), pm.drawEdgePath = function(e, t, n, r) {
	var i = e._private.rscratch, a = t, o, s = !1, c = this.usePaths(), l = e.pstyle("line-dash-pattern").pfValue, u = e.pstyle("line-dash-offset").pfValue;
	if (c) {
		var d = n.join("$");
		i.pathCacheKey && i.pathCacheKey === d ? (o = t = i.pathCache, s = !0) : (o = t = new Path2D(), i.pathCacheKey = d, i.pathCache = o);
	}
	if (a.setLineDash) switch (r) {
		case "dotted":
			a.setLineDash([1, 1]);
			break;
		case "dashed":
			a.setLineDash(l), a.lineDashOffset = u;
			break;
		case "solid": a.setLineDash([]);
	}
	if (!s && !i.badLine) switch (t.beginPath && t.beginPath(), t.moveTo(n[0], n[1]), i.edgeType) {
		case "bezier":
		case "self":
		case "compound":
		case "multibezier":
			for (var f = 2; f + 3 < n.length; f += 4) t.quadraticCurveTo(n[f], n[f + 1], n[f + 2], n[f + 3]);
			break;
		case "straight":
		case "haystack":
			for (var p = 2; p + 1 < n.length; p += 2) t.lineTo(n[p], n[p + 1]);
			break;
		case "segments": if (i.isRound) {
			var m = g(i.roundCorners), h;
			try {
				for (m.s(); !(h = m.n()).done;) {
					var _ = h.value;
					Pf(t, _);
				}
			} catch (e) {
				m.e(e);
			} finally {
				m.f();
			}
			t.lineTo(n[n.length - 2], n[n.length - 1]);
		} else for (var v = 2; v + 1 < n.length; v += 2) t.lineTo(n[v], n[v + 1]);
	}
	t = a, c ? t.stroke(o) : t.stroke(), t.setLineDash && t.setLineDash([]);
}, pm.drawEdgeTrianglePath = function(e, t, n) {
	t.fillStyle = t.strokeStyle;
	for (var r = e.pstyle("width").pfValue, i = 0; i + 1 < n.length; i += 2) {
		var a = [n[i + 2] - n[i], n[i + 3] - n[i + 1]], o = Math.sqrt(a[0] * a[0] + a[1] * a[1]), s = [a[1] / o, -a[0] / o], c = [s[0] * r / 2, s[1] * r / 2];
		t.beginPath(), t.moveTo(n[i] - c[0], n[i + 1] - c[1]), t.lineTo(n[i] + c[0], n[i + 1] + c[1]), t.lineTo(n[i + 2], n[i + 3]), t.closePath(), t.fill();
	}
}, pm.drawArrowheads = function(e, t, n) {
	var r = t._private.rscratch, i = r.edgeType === "haystack";
	i || this.drawArrowhead(e, t, "source", r.arrowStartX, r.arrowStartY, r.srcArrowAngle, n), this.drawArrowhead(e, t, "mid-target", r.midX, r.midY, r.midtgtArrowAngle, n), this.drawArrowhead(e, t, "mid-source", r.midX, r.midY, r.midsrcArrowAngle, n), i || this.drawArrowhead(e, t, "target", r.arrowEndX, r.arrowEndY, r.tgtArrowAngle, n);
}, pm.drawArrowhead = function(e, t, n, r, i, a, o) {
	if (!(isNaN(r) || r == null || isNaN(i) || i == null || isNaN(a) || a == null)) {
		var s = this, c = t.pstyle(n + "-arrow-shape").value;
		if (c !== "none") {
			var l = t.pstyle(n + "-arrow-fill").value === "hollow" ? "both" : "filled", u = t.pstyle(n + "-arrow-fill").value, d = t.pstyle("width").pfValue, f = t.pstyle(n + "-arrow-width"), p = f.value === "match-line" ? d : f.pfValue;
			f.units === "%" && (p *= d);
			var m = t.pstyle("opacity").value;
			o === void 0 && (o = m);
			var h = e.globalCompositeOperation;
			(o !== 1 || u === "hollow") && (e.globalCompositeOperation = "destination-out", s.colorFillStyle(e, 255, 255, 255, 1), s.colorStrokeStyle(e, 255, 255, 255, 1), s.drawArrowShape(t, e, l, d, c, p, r, i, a), e.globalCompositeOperation = h);
			var g = t.pstyle(n + "-arrow-color").value;
			s.colorFillStyle(e, g[0], g[1], g[2], o), s.colorStrokeStyle(e, g[0], g[1], g[2], o), s.drawArrowShape(t, e, u, d, c, p, r, i, a);
		}
	}
}, pm.drawArrowShape = function(e, t, n, r, i, a, o, s, c) {
	var l = this, u = this.usePaths() && i !== "triangle-cross", d = !1, f, p = t, m = {
		x: o,
		y: s
	}, h = e.pstyle("arrow-scale").value, g = this.getArrowWidth(r, h), _ = l.arrowShapes[i];
	if (u) {
		var v = l.arrowPathCache = l.arrowPathCache || [], y = jt(i), b = v[y];
		b == null ? (f = t = new Path2D(), v[y] = f) : (f = t = b, d = !0);
	}
	d || (t.beginPath && t.beginPath(), u ? _.draw(t, 1, 0, {
		x: 0,
		y: 0
	}, 1) : _.draw(t, g, c, m, r), t.closePath && t.closePath()), t = p, u && (t.translate(o, s), t.rotate(c), t.scale(g, g)), (n === "filled" || n === "both") && (u ? t.fill(f) : t.fill()), (n === "hollow" || n === "both") && (t.lineWidth = a / (u ? g : 1), t.lineJoin = "miter", u ? t.stroke(f) : t.stroke()), u && (t.scale(1 / g, 1 / g), t.rotate(-c), t.translate(-o, -s));
};
var hm = {};
hm.safeDrawImage = function(e, t, n, r, i, a, o, s, c, l) {
	if (!(i <= 0 || a <= 0 || c <= 0 || l <= 0)) try {
		e.drawImage(t, n, r, i, a, o, s, c, l);
	} catch (e) {
		qt(e);
	}
}, hm.drawInscribedImage = function(e, t, n, r, i) {
	var a = this, o = n.position(), s = o.x, c = o.y, l = n.cy().style(), u = l.getIndexedStyle.bind(l), d = u(n, "background-fit", "value", r), f = u(n, "background-repeat", "value", r), p = n.width(), m = n.height(), h = n.padding() * 2, g = p + (u(n, "background-width-relative-to", "value", r) === "inner" ? 0 : h), _ = m + (u(n, "background-height-relative-to", "value", r) === "inner" ? 0 : h), v = n._private.rscratch, y = u(n, "background-clip", "value", r) === "node", b = u(n, "background-image-opacity", "value", r) * i, x = u(n, "background-image-smoothing", "value", r), S = n.pstyle("corner-radius").value;
	S !== "auto" && (S = n.pstyle("corner-radius").pfValue);
	var C = t.width || t.cachedW, w = t.height || t.cachedH;
	(C == null || w == null) && (document.body.appendChild(t), C = t.cachedW = t.width || t.offsetWidth, w = t.cachedH = t.height || t.offsetHeight, document.body.removeChild(t));
	var T = C, E = w;
	if (u(n, "background-width", "value", r) !== "auto" && (T = u(n, "background-width", "units", r) === "%" ? u(n, "background-width", "pfValue", r) * g : u(n, "background-width", "pfValue", r)), u(n, "background-height", "value", r) !== "auto" && (E = u(n, "background-height", "units", r) === "%" ? u(n, "background-height", "pfValue", r) * _ : u(n, "background-height", "pfValue", r)), T !== 0 && E !== 0) {
		if (d === "contain") {
			var D = Math.min(g / T, _ / E);
			T *= D, E *= D;
		} else if (d === "cover") {
			var D = Math.max(g / T, _ / E);
			T *= D, E *= D;
		}
		var O = s - g / 2, k = u(n, "background-position-x", "units", r), A = u(n, "background-position-x", "pfValue", r);
		O += k === "%" ? (g - T) * A : A;
		var j = u(n, "background-offset-x", "units", r), M = u(n, "background-offset-x", "pfValue", r);
		O += j === "%" ? (g - T) * M : M;
		var N = c - _ / 2, P = u(n, "background-position-y", "units", r), F = u(n, "background-position-y", "pfValue", r);
		N += P === "%" ? (_ - E) * F : F;
		var I = u(n, "background-offset-y", "units", r), L = u(n, "background-offset-y", "pfValue", r);
		N += I === "%" ? (_ - E) * L : L, v.pathCache && (O -= s, N -= c, s = 0, c = 0);
		var R = e.globalAlpha;
		e.globalAlpha = b;
		var z = a.getImgSmoothing(e), B = !1;
		x === "no" && z ? (a.setImgSmoothing(e, !1), B = !0) : x === "yes" && !z && (a.setImgSmoothing(e, !0), B = !0), f === "no-repeat" ? (y && (e.save(), v.pathCache ? e.clip(v.pathCache) : (a.nodeShapes[a.getNodeShape(n)].draw(e, s, c, g, _, S, v), e.clip())), a.safeDrawImage(e, t, 0, 0, C, w, O, N, T, E), y && e.restore()) : (e.fillStyle = e.createPattern(t, f), a.nodeShapes[a.getNodeShape(n)].draw(e, s, c, g, _, S, v), e.translate(O, N), e.fill(), e.translate(-O, -N)), e.globalAlpha = R, B && a.setImgSmoothing(e, z);
	}
};
var gm = {};
gm.eleTextBiggerThanMin = function(e, t) {
	if (!t) {
		var n = e.cy().zoom(), r = this.getPixelRatio();
		t = 2 ** Math.ceil(qn(n * r));
	}
	return !(e.pstyle("font-size").pfValue * t < e.pstyle("min-zoomed-font-size").pfValue);
}, gm.drawElementText = function(e, t, n, r, i) {
	var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : !0, o = this;
	if (r == null) {
		if (a && !o.eleTextBiggerThanMin(t)) return;
	} else if (r === !1) return;
	if (t.isNode()) {
		var s = t.pstyle("label");
		if (!s || !s.value) return;
		var c = o.getLabelJustification(t), l = t.pstyle("text-metrics").strValue === "glyph";
		e.textAlign = c, e.textBaseline = l ? "alphabetic" : "bottom";
	} else {
		var u = t.element()._private.rscratch.badLine, d = t.pstyle("label"), f = t.pstyle("source-label"), p = t.pstyle("target-label");
		if (u || (!d || !d.value) && (!f || !f.value) && (!p || !p.value)) return;
		e.textAlign = "center", e.textBaseline = "bottom";
	}
	var m = !n, h;
	n && (h = n, e.translate(-h.x1, -h.y1)), i == null ? (o.drawText(e, t, null, m, a), t.isEdge() && (o.drawText(e, t, "source", m, a), o.drawText(e, t, "target", m, a))) : o.drawText(e, t, i, m, a), n && e.translate(h.x1, h.y1);
}, gm.getFontCache = function(e) {
	var t;
	this.fontCaches = this.fontCaches || [];
	for (var n = 0; n < this.fontCaches.length; n++) if (t = this.fontCaches[n], t.context === e) return t;
	return t = { context: e }, this.fontCaches.push(t), t;
}, gm.setupTextStyle = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, r = t.pstyle("font-style").strValue, i = t.pstyle("font-size").pfValue + "px", a = t.pstyle("font-family").strValue, o = t.pstyle("font-weight").strValue, s = n ? t.effectiveOpacity() * t.pstyle("text-opacity").value : 1, c = t.pstyle("text-outline-opacity").value * s, l = t.pstyle("color").value, u = t.pstyle("text-outline-color").value;
	e.font = r + " " + o + " " + i + " " + a, e.lineJoin = "round", this.colorFillStyle(e, l[0], l[1], l[2], s), this.colorStrokeStyle(e, u[0], u[1], u[2], c);
};
function _m(e, t, n, r, i) {
	var a = Math.min(r, i) / 2, o = t + r / 2, s = n + i / 2;
	e.beginPath(), e.arc(o, s, a, 0, Math.PI * 2), e.closePath();
}
function vm(e, t, n, r, i) {
	var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 5, o = Math.min(a, r / 2, i / 2);
	e.beginPath(), e.moveTo(t + o, n), e.lineTo(t + r - o, n), e.quadraticCurveTo(t + r, n, t + r, n + o), e.lineTo(t + r, n + i - o), e.quadraticCurveTo(t + r, n + i, t + r - o, n + i), e.lineTo(t + o, n + i), e.quadraticCurveTo(t, n + i, t, n + i - o), e.lineTo(t, n + o), e.quadraticCurveTo(t, n, t + o, n), e.closePath();
}
gm.getTextAngle = function(e, t) {
	var n, r = e._private.rscratch, i = t ? t + "-" : "", a = e.pstyle(i + "text-rotation");
	if (a.strValue === "autorotate") {
		var o = an(r, "labelAngle", t);
		n = e.isEdge() ? o : 0;
	} else n = a.strValue === "none" ? 0 : a.pfValue;
	return n;
}, gm.drawText = function(e, t, n) {
	var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = t._private.rscratch, o = i ? t.effectiveOpacity() : 1;
	if (!i || o !== 0 && t.pstyle("text-opacity").value !== 0) {
		n === "main" && (n = null);
		var s = an(a, "labelX", n), c = an(a, "labelY", n), l, u, d = this.getLabelText(t, n);
		if (d != null && d !== "" && !isNaN(s) && !isNaN(c)) {
			this.setupTextStyle(e, t, i);
			var f = n ? n + "-" : "", p = an(a, "labelWidth", n), m = an(a, "labelHeight", n), h = an(a, "labelActualDescent", n), g = t.pstyle(f + "text-margin-x").pfValue, _ = t.pstyle(f + "text-margin-y").pfValue, v = t.isEdge(), y = t.pstyle("text-halign").value, b = t.pstyle("text-valign").value;
			v && (y = "center", b = "center"), s += g, c += _;
			var x = r ? this.getTextAngle(t, n) : 0;
			x !== 0 && (l = s, u = c, e.translate(l, u), e.rotate(x), s = 0, c = 0);
			var S = fl(y), C = pl(b);
			switch (C) {
				case "top": break;
				case "center":
					c += m / 2;
					break;
				case "bottom": c += m;
			}
			var w = t.pstyle("text-background-opacity").value, T = t.pstyle("text-border-opacity").value, E = t.pstyle("text-border-width").pfValue, D = t.pstyle("text-background-padding").pfValue, O = t.pstyle("text-background-shape").strValue, k = O === "round-rectangle" || O === "roundrectangle", A = O === "circle", j = 2;
			if (w > 0 || E > 0 && T > 0) {
				var M = e.fillStyle, N = e.strokeStyle, P = e.lineWidth, F = t.pstyle("text-background-color").value, I = t.pstyle("text-border-color").value, L = t.pstyle("text-border-style").value, R = w > 0, z = E > 0 && T > 0, B = s - D;
				switch (S) {
					case "left":
						B -= p;
						break;
					case "center": B -= p / 2;
				}
				var V = c - m - D, H = p + 2 * D, U = m + 2 * D;
				if (R && (e.fillStyle = `rgba(${F[0]},${F[1]},${F[2]},${w * o})`), z && (e.strokeStyle = `rgba(${I[0]},${I[1]},${I[2]},${T * o})`, e.lineWidth = E, e.setLineDash)) switch (L) {
					case "dotted":
						e.setLineDash([1, 1]);
						break;
					case "dashed":
						e.setLineDash([4, 2]);
						break;
					case "double":
						e.lineWidth = E / 4, e.setLineDash([]);
						break;
					default: e.setLineDash([]);
				}
				if (k ? (e.beginPath(), vm(e, B, V, H, U, j)) : A ? (e.beginPath(), _m(e, B, V, H, U)) : (e.beginPath(), e.rect(B, V, H, U)), R && e.fill(), z && e.stroke(), z && L === "double") {
					var W = E / 2;
					e.beginPath(), k ? vm(e, B + W, V + W, H - 2 * W, U - 2 * W, j) : e.rect(B + W, V + W, H - 2 * W, U - 2 * W), e.stroke();
				}
				e.fillStyle = M, e.strokeStyle = N, e.lineWidth = P, e.setLineDash && e.setLineDash([]);
			}
			var G = 2 * t.pstyle("text-outline-width").pfValue;
			if (G > 0 && (e.lineWidth = G), c -= h, t.pstyle("text-wrap").value === "wrap") {
				var K = an(a, "labelWrapCachedLines", n), q = an(a, "labelLineHeight", n), ee = p / 2, J = this.getLabelJustification(t);
				switch (J === "auto" || (S === "left" ? J === "left" ? s += -p : J === "center" && (s += -ee) : S === "center" ? J === "left" ? s += -ee : J === "right" && (s += ee) : S === "right" && (J === "center" ? s += ee : J === "right" && (s += p))), C) {
					case "top":
						c -= (K.length - 1) * q;
						break;
					case "center":
					case "bottom": c -= (K.length - 1) * q;
				}
				for (var Y = 0; Y < K.length; Y++) G > 0 && e.strokeText(K[Y], s, c), e.fillText(K[Y], s, c), c += q;
			} else G > 0 && e.strokeText(d, s, c), e.fillText(d, s, c);
			x !== 0 && (e.rotate(-x), e.translate(-l, -u));
		}
	}
};
var ym = {};
ym.drawNode = function(e, t, n) {
	var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : !0, o = this, s, c, l = t._private, u = l.rscratch, d = t.position();
	if (B(d.x) && B(d.y) && (!a || t.visible())) {
		var f = a ? t.effectiveOpacity() : 1, p = o.usePaths(), m, h = !1, g = t.padding();
		s = t.width() + 2 * g, c = t.height() + 2 * g;
		var _;
		n && (_ = n, e.translate(-_.x1, -_.y1));
		for (var v = t.pstyle("background-image").value, y = Array(v.length), b = Array(v.length), x = 0, S = 0; S < v.length; S++) {
			var C = v[S];
			if (y[S] = C != null && C !== "none") {
				var w = t.cy().style().getIndexedStyle(t, "background-image-crossorigin", "value", S);
				x++, b[S] = o.getCachedImage(C, w, function() {
					l.backgroundTimestamp = Date.now(), t.emitAndNotify("background");
				});
			}
		}
		var T = t.pstyle("background-blacken").value, E = t.pstyle("border-width").pfValue, D = t.pstyle("background-opacity").value * f, O = t.pstyle("border-color").value, k = t.pstyle("border-style").value, A = t.pstyle("border-join").value, j = t.pstyle("border-cap").value, M = t.pstyle("border-position").value, N = t.pstyle("border-dash-pattern").pfValue, P = t.pstyle("border-dash-offset").pfValue, F = t.pstyle("border-opacity").value * f, I = t.pstyle("outline-width").pfValue, L = t.pstyle("outline-color").value, R = t.pstyle("outline-style").value, z = t.pstyle("outline-opacity").value * f, V = t.pstyle("outline-offset").value, H = t.pstyle("corner-radius").value;
		H !== "auto" && (H = t.pstyle("corner-radius").pfValue);
		var U = function() {
			var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : D;
			o.eleFillStyle(e, t, n);
		}, W = function() {
			var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : F;
			o.colorStrokeStyle(e, O[0], O[1], O[2], t);
		}, G = function() {
			var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : z;
			o.colorStrokeStyle(e, L[0], L[1], L[2], t);
		}, K = function(e, t, n, r) {
			var i = o.nodePathCache = o.nodePathCache || [], a = Mt(n === "polygon" ? n + "," + r.join(",") : n, "" + t, "" + e, "" + H), s = i[a], c, l = !1;
			return s == null ? (c = new Path2D(), i[a] = u.pathCache = c) : (c = s, l = !0, u.pathCache = c), {
				path: c,
				cacheHit: l
			};
		}, q = t.pstyle("shape").strValue, ee = t.pstyle("shape-polygon-points").pfValue;
		if (p) {
			e.translate(d.x, d.y);
			var J = K(s, c, q, ee);
			m = J.path, h = J.cacheHit;
		}
		var Y = function() {
			if (!h) {
				var n = d;
				p && (n = {
					x: 0,
					y: 0
				}), o.nodeShapes[o.getNodeShape(t)].draw(m || e, n.x, n.y, s, c, H, u);
			}
			p ? e.fill(m) : e.fill();
		}, te = function() {
			for (var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : f, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, i = l.backgrounding, a = 0, s = 0; s < b.length; s++) {
				var c = t.cy().style().getIndexedStyle(t, "background-image-containment", "value", s);
				if (r && c === "over" || !r && c === "inside") {
					a++;
					continue;
				}
				y[s] && b[s].complete && !b[s].error && (a++, o.drawInscribedImage(e, b[s], t, s, n));
			}
			l.backgrounding = a !== x, i !== l.backgrounding && t.updateStyle(!1);
		}, ne = function() {
			var n = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : f;
			o.hasPie(t) && (o.drawPie(e, t, r), n && (p || o.nodeShapes[o.getNodeShape(t)].draw(e, d.x, d.y, s, c, H, u)));
		}, re = function() {
			var n = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : f;
			o.hasStripe(t) && (e.save(), p ? e.clip(u.pathCache) : (o.nodeShapes[o.getNodeShape(t)].draw(e, d.x, d.y, s, c, H, u), e.clip()), o.drawStripe(e, t, r), e.restore(), n && (p || o.nodeShapes[o.getNodeShape(t)].draw(e, d.x, d.y, s, c, H, u)));
		}, ie = function() {
			var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : f, n = (T > 0 ? T : -T) * t, r = T > 0 ? 0 : 255;
			T !== 0 && (o.colorFillStyle(e, r, r, r, n), p ? e.fill(m) : e.fill());
		}, ae = function() {
			if (E > 0) {
				if (e.lineWidth = E, e.lineCap = j, e.lineJoin = A, e.setLineDash) switch (k) {
					case "dotted":
						e.setLineDash([1, 1]);
						break;
					case "dashed":
						e.setLineDash(N), e.lineDashOffset = P;
						break;
					case "solid":
					case "double": e.setLineDash([]);
				}
				if (M !== "center") {
					if (e.save(), e.lineWidth *= 2, M === "inside") p ? e.clip(m) : e.clip();
					else {
						var t = new Path2D();
						t.rect(-s / 2 - E, -c / 2 - E, s + 2 * E, c + 2 * E), t.addPath(m), e.clip(t, "evenodd");
					}
					p ? e.stroke(m) : e.stroke(), e.restore();
				} else p ? e.stroke(m) : e.stroke();
				if (k === "double") {
					e.lineWidth = E / 3;
					var n = e.globalCompositeOperation;
					e.globalCompositeOperation = "destination-out", p ? e.stroke(m) : e.stroke(), e.globalCompositeOperation = n;
				}
				e.setLineDash && e.setLineDash([]);
			}
		}, oe = function() {
			if (I > 0) {
				if (e.lineWidth = I, e.lineCap = "butt", e.setLineDash) switch (R) {
					case "dotted":
						e.setLineDash([1, 1]);
						break;
					case "dashed":
						e.setLineDash([4, 2]);
						break;
					case "solid":
					case "double": e.setLineDash([]);
				}
				var n = d;
				p && (n = {
					x: 0,
					y: 0
				});
				var r = o.getNodeShape(t), i = E;
				M === "inside" && (i = 0), M === "outside" && (i *= 2);
				var a = (s + i + (I + V)) / s, l = (c + i + (I + V)) / c, u = s * a, f = c * l, m = o.nodeShapes[r].points, h;
				if (p && (h = K(u, f, r, m).path), r === "ellipse") o.drawEllipsePath(h || e, n.x, n.y, u, f);
				else if ([
					"round-diamond",
					"round-heptagon",
					"round-hexagon",
					"round-octagon",
					"round-pentagon",
					"round-polygon",
					"round-triangle",
					"round-tag"
				].includes(r)) {
					var g = 0, _ = 0, v = 0;
					r === "round-diamond" ? g = (i + V + I) * 1.4 : r === "round-heptagon" ? (g = (i + V + I) * 1.075, v = -(i / 2 + V + I) / 35) : r === "round-hexagon" ? g = (i + V + I) * 1.12 : r === "round-pentagon" ? (g = (i + V + I) * 1.13, v = -(i / 2 + V + I) / 15) : r === "round-tag" ? (g = (i + V + I) * 1.12, _ = (i / 2 + I + V) * .07) : r === "round-triangle" && (g = (i + V + I) * (Math.PI / 2), v = -(i + V / 2 + I) / Math.PI), g !== 0 && (a = (s + g) / s, u = s * a, ["round-hexagon", "round-tag"].includes(r) || (l = (c + g) / c, f = c * l)), H = H === "auto" ? Hr(u, f) : H;
					for (var y = u / 2, b = f / 2, x = H + (i + I + V) / 2, S = Array(m.length / 2), C = Array(m.length / 2), w = 0; w < m.length / 2; w++) S[w] = {
						x: n.x + _ + y * m[w * 2],
						y: n.y + v + b * m[w * 2 + 1]
					};
					var T, D, O, k, A = S.length;
					for (D = S[A - 1], T = 0; T < A; T++) O = S[T % A], k = S[(T + 1) % A], C[T] = Ff(D, O, k, x), D = O, O = k;
					o.drawRoundPolygonPath(h || e, n.x + _, n.y + v, s * a, c * l, m, C);
				} else if (["roundrectangle", "round-rectangle"].includes(r)) H = H === "auto" ? Vr(u, f) : H, o.drawRoundRectanglePath(h || e, n.x, n.y, u, f, H + (i + I + V) / 2);
				else if (["cutrectangle", "cut-rectangle"].includes(r)) H = H === "auto" ? Ur() : H, o.drawCutRectanglePath(h || e, n.x, n.y, u, f, null, H + (i + I + V) / 4);
				else if (["bottomroundrectangle", "bottom-round-rectangle"].includes(r)) H = H === "auto" ? Vr(u, f) : H, o.drawBottomRoundRectanglePath(h || e, n.x, n.y, u, f, H + (i + I + V) / 2);
				else if (r === "barrel") o.drawBarrelPath(h || e, n.x, n.y, u, f);
				else if (r.startsWith("polygon") || [
					"rhomboid",
					"right-rhomboid",
					"round-tag",
					"tag",
					"vee"
				].includes(r)) {
					var j = (i + I + V) / s;
					m = Dr(Or(m, j)), o.drawPolygonPath(h || e, n.x, n.y, s, c, m);
				} else {
					var N = (i + I + V) / s;
					m = Dr(Or(m, -N)), o.drawPolygonPath(h || e, n.x, n.y, s, c, m);
				}
				if (p ? e.stroke(h) : e.stroke(), R === "double") {
					e.lineWidth = i / 3;
					var P = e.globalCompositeOperation;
					e.globalCompositeOperation = "destination-out", p ? e.stroke(h) : e.stroke(), e.globalCompositeOperation = P;
				}
				e.setLineDash && e.setLineDash([]);
			}
		}, se = function() {
			i && o.drawNodeOverlay(e, t, d, s, c);
		}, ce = function() {
			i && o.drawNodeUnderlay(e, t, d, s, c);
		}, le = function() {
			o.drawElementText(e, t, null, r);
		};
		if (t.pstyle("ghost").value === "yes") {
			var ue = t.pstyle("ghost-offset-x").pfValue, de = t.pstyle("ghost-offset-y").pfValue, fe = t.pstyle("ghost-opacity").value, pe = fe * f;
			e.translate(ue, de), G(), oe(), U(fe * D), Y(), te(pe, !0), W(fe * F), ae(), ne(T !== 0 || E !== 0), re(T !== 0 || E !== 0), te(pe, !1), ie(pe), e.translate(-ue, -de);
		}
		p && e.translate(-d.x, -d.y), ce(), p && e.translate(d.x, d.y), G(), oe(), U(), Y(), te(f, !0), W(), ae(), ne(T !== 0 || E !== 0), re(T !== 0 || E !== 0), te(f, !1), ie(), p && e.translate(-d.x, -d.y), le(), se(), n && e.translate(_.x1, _.y1);
	}
};
var bm = function(e) {
	if (!["overlay", "underlay"].includes(e)) throw Error("Invalid state");
	return function(t, n, r, i, a) {
		var o = this;
		if (n.visible()) {
			var s = n.pstyle(`${e}-padding`).pfValue, c = n.pstyle(`${e}-opacity`).value, l = n.pstyle(`${e}-color`).value, u = n.pstyle(`${e}-shape`).value, d = n.pstyle(`${e}-corner-radius`).value;
			if (c > 0) {
				if (r ||= n.position(), i == null || a == null) {
					var f = n.padding();
					i = n.width() + 2 * f, a = n.height() + 2 * f;
				}
				o.colorFillStyle(t, l[0], l[1], l[2], c), o.nodeShapes[u].draw(t, r.x, r.y, i + s * 2, a + s * 2, d), t.fill();
			}
		}
	};
};
ym.drawNodeOverlay = bm("overlay"), ym.drawNodeUnderlay = bm("underlay"), ym.hasPie = function(e) {
	return e = e[0], e._private.hasPie;
}, ym.hasStripe = function(e) {
	return e = e[0], e._private.hasStripe;
}, ym.drawPie = function(e, t, n, r) {
	t = t[0], r ||= t.position();
	var i = t.cy().style(), a = t.pstyle("pie-size"), o = t.pstyle("pie-hole"), s = t.pstyle("pie-start-angle").pfValue, c = r.x, l = r.y, u = t.width(), d = t.height(), f = Math.min(u, d) / 2, p, m = 0;
	if (this.usePaths() && (c = 0, l = 0), a.units === "%" ? f *= a.pfValue : a.pfValue !== void 0 && (f = a.pfValue / 2), o.units === "%" ? p = f * o.pfValue : o.pfValue !== void 0 && (p = o.pfValue / 2), !(p >= f)) for (var h = 1; h <= i.pieBackgroundN; h++) {
		var g = t.pstyle("pie-" + h + "-background-size").value, _ = t.pstyle("pie-" + h + "-background-color").value, v = t.pstyle("pie-" + h + "-background-opacity").value * n, y = g / 100;
		y + m > 1 && (y = 1 - m);
		var b = 1.5 * Math.PI + 2 * Math.PI * m;
		b += s;
		var x = 2 * Math.PI * y, S = b + x;
		g === 0 || m >= 1 || m + y > 1 || (p === 0 ? (e.beginPath(), e.moveTo(c, l), e.arc(c, l, f, b, S), e.closePath()) : (e.beginPath(), e.arc(c, l, f, b, S), e.arc(c, l, p, S, b, !0), e.closePath()), this.colorFillStyle(e, _[0], _[1], _[2], v), e.fill(), m += y);
	}
}, ym.drawStripe = function(e, t, n, r) {
	t = t[0], r ||= t.position();
	var i = t.cy().style(), a = r.x, o = r.y, s = t.width(), c = t.height(), l = 0, u = this.usePaths();
	e.save();
	var d = t.pstyle("stripe-direction").value, f = t.pstyle("stripe-size");
	switch (d) {
		case "vertical": break;
		case "righward": e.rotate(-Math.PI / 2);
	}
	var p = s, m = c;
	f.units === "%" ? (p *= f.pfValue, m *= f.pfValue) : f.pfValue !== void 0 && (p = f.pfValue, m = f.pfValue), u && (a = 0, o = 0), o -= p / 2, a -= m / 2;
	for (var h = 1; h <= i.stripeBackgroundN; h++) {
		var g = t.pstyle("stripe-" + h + "-background-size").value, _ = t.pstyle("stripe-" + h + "-background-color").value, v = t.pstyle("stripe-" + h + "-background-opacity").value * n, y = g / 100;
		y + l > 1 && (y = 1 - l), !(g === 0 || l >= 1 || l + y > 1) && (e.beginPath(), e.rect(a, o + m * l, p, m * y), e.closePath(), this.colorFillStyle(e, _[0], _[1], _[2], v), e.fill(), l += y);
	}
	e.restore();
};
var xm = {}, Sm = 100;
xm.getPixelRatio = function() {
	var e = this.data.contexts[0];
	if (this.forcedPixelRatio != null) return this.forcedPixelRatio;
	var t = this.cy.window(), n = e.backingStorePixelRatio || e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1;
	return (t.devicePixelRatio || 1) / n;
}, xm.paintCache = function(e) {
	for (var t = this.paintCaches = this.paintCaches || [], n = !0, r, i = 0; i < t.length; i++) if (r = t[i], r.context === e) {
		n = !1;
		break;
	}
	return n && (r = { context: e }, t.push(r)), r;
}, xm.createGradientStyleFor = function(e, t, n, r, i) {
	var a, o = this.usePaths(), s = n.pstyle(t + "-gradient-stop-colors").value, c = n.pstyle(t + "-gradient-stop-positions").pfValue;
	if (r === "radial-gradient") {
		if (n.isEdge()) {
			var l = n.sourceEndpoint(), u = n.targetEndpoint(), d = n.midpoint(), f = Yn(l, d), p = Yn(u, d);
			a = e.createRadialGradient(d.x, d.y, 0, d.x, d.y, Math.max(f, p));
		} else {
			var m = o ? {
				x: 0,
				y: 0
			} : n.position(), h = n.paddedWidth(), g = n.paddedHeight();
			a = e.createRadialGradient(m.x, m.y, 0, m.x, m.y, Math.max(h, g));
		}
	} else if (n.isEdge()) {
		var _ = n.sourceEndpoint(), v = n.targetEndpoint();
		a = e.createLinearGradient(_.x, _.y, v.x, v.y);
	} else {
		var y = o ? {
			x: 0,
			y: 0
		} : n.position(), b = n.paddedWidth(), x = n.paddedHeight(), S = b / 2, C = x / 2;
		switch (n.pstyle("background-gradient-direction").value) {
			case "to-bottom":
				a = e.createLinearGradient(y.x, y.y - C, y.x, y.y + C);
				break;
			case "to-top":
				a = e.createLinearGradient(y.x, y.y + C, y.x, y.y - C);
				break;
			case "to-left":
				a = e.createLinearGradient(y.x + S, y.y, y.x - S, y.y);
				break;
			case "to-right":
				a = e.createLinearGradient(y.x - S, y.y, y.x + S, y.y);
				break;
			case "to-bottom-right":
			case "to-right-bottom":
				a = e.createLinearGradient(y.x - S, y.y - C, y.x + S, y.y + C);
				break;
			case "to-top-right":
			case "to-right-top":
				a = e.createLinearGradient(y.x - S, y.y + C, y.x + S, y.y - C);
				break;
			case "to-bottom-left":
			case "to-left-bottom":
				a = e.createLinearGradient(y.x + S, y.y - C, y.x - S, y.y + C);
				break;
			case "to-top-left":
			case "to-left-top": a = e.createLinearGradient(y.x + S, y.y + C, y.x - S, y.y - C);
		}
	}
	if (!a) return null;
	for (var w = c.length === s.length, T = s.length, E = 0; E < T; E++) a.addColorStop(w ? c[E] : E / (T - 1), "rgba(" + s[E][0] + "," + s[E][1] + "," + s[E][2] + "," + i + ")");
	return a;
}, xm.gradientFillStyle = function(e, t, n, r) {
	var i = this.createGradientStyleFor(e, "background", t, n, r);
	if (!i) return null;
	e.fillStyle = i;
}, xm.colorFillStyle = function(e, t, n, r, i) {
	e.fillStyle = "rgba(" + t + "," + n + "," + r + "," + i + ")";
}, xm.eleFillStyle = function(e, t, n) {
	var r = t.pstyle("background-fill").value;
	if (r === "linear-gradient" || r === "radial-gradient") this.gradientFillStyle(e, t, r, n);
	else {
		var i = t.pstyle("background-color").value;
		this.colorFillStyle(e, i[0], i[1], i[2], n);
	}
}, xm.gradientStrokeStyle = function(e, t, n, r) {
	var i = this.createGradientStyleFor(e, "line", t, n, r);
	if (!i) return null;
	e.strokeStyle = i;
}, xm.colorStrokeStyle = function(e, t, n, r, i) {
	e.strokeStyle = "rgba(" + t + "," + n + "," + r + "," + i + ")";
}, xm.eleStrokeStyle = function(e, t, n) {
	var r = t.pstyle("line-fill").value;
	if (r === "linear-gradient" || r === "radial-gradient") this.gradientStrokeStyle(e, t, r, n);
	else {
		var i = t.pstyle("line-color").value;
		this.colorStrokeStyle(e, i[0], i[1], i[2], n);
	}
}, xm.matchCanvasSize = function(e) {
	var t = this, n = t.data, r = t.findContainerClientCoords(), i = r[2], a = r[3], o = t.getPixelRatio(), s = t.motionBlurPxRatio;
	(e === t.data.bufferCanvases[t.MOTIONBLUR_BUFFER_NODE] || e === t.data.bufferCanvases[t.MOTIONBLUR_BUFFER_DRAG]) && (o = s);
	var c = i * o, l = a * o, u;
	if (c !== t.canvasWidth || l !== t.canvasHeight) {
		t.fontCaches = null;
		var d = n.canvasContainer;
		d.style.width = i + "px", d.style.height = a + "px";
		for (var f = 0; f < t.CANVAS_LAYERS; f++) u = n.canvases[f], u.width = c, u.height = l, u.style.width = i + "px", u.style.height = a + "px";
		for (var f = 0; f < t.BUFFER_COUNT; f++) u = n.bufferCanvases[f], u.width = c, u.height = l, u.style.width = i + "px", u.style.height = a + "px";
		t.textureMult = 1, o <= 1 && (u = n.bufferCanvases[t.TEXTURE_BUFFER], t.textureMult = 2, u.width = c * t.textureMult, u.height = l * t.textureMult), t.canvasWidth = c, t.canvasHeight = l, t.pixelRatio = o;
	}
}, xm.renderTo = function(e, t, n, r) {
	this.render({
		forcedContext: e,
		forcedZoom: t,
		forcedPan: n,
		drawAllLayers: !0,
		forcedPxRatio: r
	});
}, xm.clearCanvas = function() {
	var e = this, t = e.data;
	function n(t) {
		t.clearRect(0, 0, e.canvasWidth, e.canvasHeight);
	}
	n(t.contexts[e.NODE]), n(t.contexts[e.DRAG]);
}, xm.render = function(e) {
	var t = this;
	e ||= $t();
	var n = t.cy, r = e.forcedContext, i = e.drawAllLayers, a = e.drawOnlyNodeLayer, o = e.forcedZoom, s = e.forcedPan, c = e.forcedPxRatio === void 0 ? this.getPixelRatio() : e.forcedPxRatio, l = t.data, u = l.canvasNeedsRedraw, d = t.textureOnViewport && !r && (t.pinching || t.hoverData.dragging || t.swipePanning || t.data.wheelZooming), f = e.motionBlur === void 0 ? t.motionBlur : e.motionBlur, p = t.motionBlurPxRatio, m = n.hasCompoundNodes(), h = t.hoverData.draggingEles, g = !!(t.hoverData.selecting || t.touchData.selecting);
	f = f && !r && t.motionBlurEnabled && !g;
	var _ = f;
	r || (t.prevPxRatio !== c && (t.invalidateContainerClientCoordsCache(), t.matchCanvasSize(t.container), t.redrawHint("eles", !0), t.redrawHint("drag", !0)), t.prevPxRatio = c), !r && t.motionBlurTimeout && clearTimeout(t.motionBlurTimeout), f && (t.mbFrames ??= 0, t.mbFrames++, t.mbFrames < 3 && (_ = !1), t.mbFrames > t.minMbLowQualFrames && (t.motionBlurPxRatio = t.mbPxRBlurry)), t.clearingMotionBlur && (t.motionBlurPxRatio = 1), t.textureDrawLastFrame && !d && (u[t.NODE] = !0, u[t.SELECT_BOX] = !0);
	var v = n.style(), y = n.zoom(), b = o === void 0 ? y : o, x = n.pan(), S = {
		x: x.x,
		y: x.y
	}, C = {
		zoom: y,
		pan: {
			x: x.x,
			y: x.y
		}
	}, w = t.prevViewport;
	w !== void 0 && C.zoom === w.zoom && C.pan.x === w.pan.x && C.pan.y === w.pan.y && (!h || m) && (t.motionBlurPxRatio = 1), s && (S = s), b *= c, S.x *= c, S.y *= c;
	var T = t.getCachedZSortedEles();
	function E(e, n, r, i, a) {
		var o = e.globalCompositeOperation;
		e.globalCompositeOperation = "destination-out", t.colorFillStyle(e, 255, 255, 255, t.motionBlurTransparency), e.fillRect(n, r, i, a), e.globalCompositeOperation = o;
	}
	function D(e, n) {
		var a, c, u, d;
		!t.clearingMotionBlur && (e === l.bufferContexts[t.MOTIONBLUR_BUFFER_NODE] || e === l.bufferContexts[t.MOTIONBLUR_BUFFER_DRAG]) ? (a = {
			x: x.x * p,
			y: x.y * p
		}, c = y * p, u = t.canvasWidth * p, d = t.canvasHeight * p) : (a = S, c = b, u = t.canvasWidth, d = t.canvasHeight), e.setTransform(1, 0, 0, 1, 0, 0), n === "motionBlur" ? E(e, 0, 0, u, d) : !r && (n === void 0 || n) && e.clearRect(0, 0, u, d), i || (e.translate(a.x, a.y), e.scale(c, c)), s && e.translate(s.x, s.y), o && e.scale(o, o);
	}
	if (d || (t.textureDrawLastFrame = !1), d) {
		if (t.textureDrawLastFrame = !0, !t.textureCache) {
			t.textureCache = {}, t.textureCache.bb = n.mutableElements().boundingBox(), t.textureCache.texture = t.data.bufferCanvases[t.TEXTURE_BUFFER];
			var O = t.data.bufferContexts[t.TEXTURE_BUFFER];
			O.setTransform(1, 0, 0, 1, 0, 0), O.clearRect(0, 0, t.canvasWidth * t.textureMult, t.canvasHeight * t.textureMult), t.render({
				forcedContext: O,
				drawOnlyNodeLayer: !0,
				forcedPxRatio: c * t.textureMult
			});
			var C = t.textureCache.viewport = {
				zoom: n.zoom(),
				pan: n.pan(),
				width: t.canvasWidth,
				height: t.canvasHeight
			};
			C.mpan = {
				x: (0 - C.pan.x) / C.zoom,
				y: (0 - C.pan.y) / C.zoom
			};
		}
		u[t.DRAG] = !1, u[t.NODE] = !1;
		var k = l.contexts[t.NODE], A = t.textureCache.texture, C = t.textureCache.viewport;
		k.setTransform(1, 0, 0, 1, 0, 0), f ? E(k, 0, 0, C.width, C.height) : k.clearRect(0, 0, C.width, C.height);
		var j = v.core("outside-texture-bg-color").value, M = v.core("outside-texture-bg-opacity").value;
		t.colorFillStyle(k, j[0], j[1], j[2], M), k.fillRect(0, 0, C.width, C.height);
		var y = n.zoom();
		D(k, !1), k.clearRect(C.mpan.x, C.mpan.y, C.width / C.zoom / c, C.height / C.zoom / c), k.drawImage(A, C.mpan.x, C.mpan.y, C.width / C.zoom / c, C.height / C.zoom / c);
	} else t.textureOnViewport && !r && (t.textureCache = null);
	var N = n.extent(), P = t.pinching || t.hoverData.dragging || t.swipePanning || t.data.wheelZooming || t.hoverData.draggingEles || t.cy.animated(), F = t.hideEdgesOnViewport && P, I = [];
	if (I[t.NODE] = !u[t.NODE] && f && !t.clearedForMotionBlur[t.NODE] || t.clearingMotionBlur, I[t.NODE] && (t.clearedForMotionBlur[t.NODE] = !0), I[t.DRAG] = !u[t.DRAG] && f && !t.clearedForMotionBlur[t.DRAG] || t.clearingMotionBlur, I[t.DRAG] && (t.clearedForMotionBlur[t.DRAG] = !0), u[t.NODE] || i || a || I[t.NODE]) {
		var L = f && !I[t.NODE] && p !== 1, k = r || (L ? t.data.bufferContexts[t.MOTIONBLUR_BUFFER_NODE] : l.contexts[t.NODE]);
		D(k, f && !L ? "motionBlur" : void 0), F ? t.drawCachedNodes(k, T.nondrag, c, N) : t.drawLayeredElements(k, T.nondrag, c, N), t.debug && t.drawDebugPoints(k, T.nondrag), !i && !f && (u[t.NODE] = !1);
	}
	if (!a && (u[t.DRAG] || i || I[t.DRAG])) {
		var L = f && !I[t.DRAG] && p !== 1, k = r || (L ? t.data.bufferContexts[t.MOTIONBLUR_BUFFER_DRAG] : l.contexts[t.DRAG]);
		D(k, f && !L ? "motionBlur" : void 0), F ? t.drawCachedNodes(k, T.drag, c, N) : t.drawCachedElements(k, T.drag, c, N), t.debug && t.drawDebugPoints(k, T.drag), !i && !f && (u[t.DRAG] = !1);
	}
	if (this.drawSelectionRectangle(e, D), f && p !== 1) {
		var R = l.contexts[t.NODE], z = t.data.bufferCanvases[t.MOTIONBLUR_BUFFER_NODE], B = l.contexts[t.DRAG], V = t.data.bufferCanvases[t.MOTIONBLUR_BUFFER_DRAG], H = function(e, n, r) {
			e.setTransform(1, 0, 0, 1, 0, 0), r || !_ ? e.clearRect(0, 0, t.canvasWidth, t.canvasHeight) : E(e, 0, 0, t.canvasWidth, t.canvasHeight);
			var i = p;
			e.drawImage(n, 0, 0, t.canvasWidth * i, t.canvasHeight * i, 0, 0, t.canvasWidth, t.canvasHeight);
		};
		(u[t.NODE] || I[t.NODE]) && (H(R, z, I[t.NODE]), u[t.NODE] = !1), (u[t.DRAG] || I[t.DRAG]) && (H(B, V, I[t.DRAG]), u[t.DRAG] = !1);
	}
	t.prevViewport = C, t.clearingMotionBlur && (t.clearingMotionBlur = !1, t.motionBlurCleared = !0, t.motionBlur = !0), f && (t.motionBlurTimeout = setTimeout(function() {
		t.motionBlurTimeout = null, t.clearedForMotionBlur[t.NODE] = !1, t.clearedForMotionBlur[t.DRAG] = !1, t.motionBlur = !1, t.clearingMotionBlur = !d, t.mbFrames = 0, u[t.NODE] = !0, u[t.DRAG] = !0, t.redraw();
	}, Sm)), r || n.emit("render");
};
var Cm;
xm.drawSelectionRectangle = function(e, t) {
	var n = this, r = n.cy, i = n.data, a = r.style(), o = e.drawOnlyNodeLayer, s = e.drawAllLayers, c = i.canvasNeedsRedraw, l = e.forcedContext;
	if (n.showFps || !o && c[n.SELECT_BOX] && !s) {
		var u = l || i.contexts[n.SELECT_BOX];
		if (t(u), n.selection[4] == 1 && (n.hoverData.selecting || n.touchData.selecting)) {
			var d = n.cy.zoom(), f = a.core("selection-box-border-width").value / d;
			u.lineWidth = f, u.fillStyle = "rgba(" + a.core("selection-box-color").value[0] + "," + a.core("selection-box-color").value[1] + "," + a.core("selection-box-color").value[2] + "," + a.core("selection-box-opacity").value + ")", u.fillRect(n.selection[0], n.selection[1], n.selection[2] - n.selection[0], n.selection[3] - n.selection[1]), f > 0 && (u.strokeStyle = "rgba(" + a.core("selection-box-border-color").value[0] + "," + a.core("selection-box-border-color").value[1] + "," + a.core("selection-box-border-color").value[2] + "," + a.core("selection-box-opacity").value + ")", u.strokeRect(n.selection[0], n.selection[1], n.selection[2] - n.selection[0], n.selection[3] - n.selection[1]));
		}
		if (i.bgActivePosistion && !n.hoverData.selecting) {
			var d = n.cy.zoom(), p = i.bgActivePosistion;
			u.fillStyle = "rgba(" + a.core("active-bg-color").value[0] + "," + a.core("active-bg-color").value[1] + "," + a.core("active-bg-color").value[2] + "," + a.core("active-bg-opacity").value + ")", u.beginPath(), u.arc(p.x, p.y, a.core("active-bg-size").pfValue / d, 0, 2 * Math.PI), u.fill();
		}
		var m = n.lastRedrawTime;
		if (n.showFps && m) {
			m = Math.round(m);
			var h = Math.round(1e3 / m), g = "1 frame = " + m + " ms = " + h + " fps";
			u.setTransform(1, 0, 0, 1, 0, 0), u.fillStyle = "rgba(255, 0, 0, 0.75)", u.strokeStyle = "rgba(255, 0, 0, 0.75)", u.font = "30px Arial", Cm ||= u.measureText(g).actualBoundingBoxAscent, u.fillText(g, 0, Cm), u.strokeRect(0, Cm + 10, 250, 20), u.fillRect(0, Cm + 10, 250 * Math.min(h / 60, 1), 20);
		}
		s || (c[n.SELECT_BOX] = !1);
	}
};
function wm(e, t, n) {
	var r = e.createShader(t);
	if (e.shaderSource(r, n), e.compileShader(r), !e.getShaderParameter(r, e.COMPILE_STATUS)) throw Error(e.getShaderInfoLog(r));
	return r;
}
function Tm(e, t, n) {
	var r = wm(e, e.VERTEX_SHADER, t), i = wm(e, e.FRAGMENT_SHADER, n), a = e.createProgram();
	if (e.attachShader(a, r), e.attachShader(a, i), e.linkProgram(a), !e.getProgramParameter(a, e.LINK_STATUS)) throw Error("Could not initialize shaders");
	return a;
}
function Em(e, t, n) {
	n === void 0 && (n = t);
	var r = e.makeOffscreenCanvas(t, n), i = r.context = r.getContext("2d");
	return r.clear = function() {
		return i.clearRect(0, 0, r.width, r.height);
	}, r.clear(), r;
}
function Dm(e) {
	var t = e.pixelRatio, n = e.cy.zoom(), r = e.cy.pan();
	return {
		zoom: n * t,
		pan: {
			x: r.x * t,
			y: r.y * t
		}
	};
}
function Om(e) {
	var t = e.pixelRatio;
	return e.cy.zoom() * t;
}
function km(e, t, n, r, i) {
	var a = r * n + t.x, o = i * n + t.y;
	return o = Math.round(e.canvasHeight - o), [a, o];
}
function Am(e, t) {
	return t.picking ? !0 : e.pstyle("background-fill").value !== "solid" || e.pstyle("background-image").strValue !== "none" ? !1 : e.pstyle("border-width").value === 0 || e.pstyle("border-opacity").value === 0 || e.pstyle("border-style").value === "solid";
}
function jm(e, t) {
	if (e.length !== t.length) return !1;
	for (var n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function Mm(e, t, n) {
	var r = e[0] / 255, i = e[1] / 255, a = e[2] / 255, o = t, s = n || [
		,
		,
		,
		,
	];
	return s[0] = r * o, s[1] = i * o, s[2] = a * o, s[3] = o, s;
}
function Nm(e, t) {
	var n = t || [
		,
		,
		,
		,
	];
	return n[0] = (e >> 0 & 255) / 255, n[1] = (e >> 8 & 255) / 255, n[2] = (e >> 16 & 255) / 255, n[3] = (e >> 24 & 255) / 255, n;
}
function Pm(e) {
	return e[0] + (e[1] << 8) + (e[2] << 16) + (e[3] << 24);
}
function Fm(e, t) {
	var n = e.createTexture();
	return n.buffer = function(t) {
		e.bindTexture(e.TEXTURE_2D, n), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_NEAREST), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t), e.generateMipmap(e.TEXTURE_2D), e.bindTexture(e.TEXTURE_2D, null);
	}, n.deleteTexture = function() {
		e.deleteTexture(n);
	}, n;
}
function Im(e, t) {
	switch (t) {
		case "float": return [
			1,
			e.FLOAT,
			4
		];
		case "vec2": return [
			2,
			e.FLOAT,
			4
		];
		case "vec3": return [
			3,
			e.FLOAT,
			4
		];
		case "vec4": return [
			4,
			e.FLOAT,
			4
		];
		case "int": return [
			1,
			e.INT,
			4
		];
		case "ivec2": return [
			2,
			e.INT,
			4
		];
	}
}
function Lm(e, t, n) {
	switch (t) {
		case e.FLOAT: return new Float32Array(n);
		case e.INT: return new Int32Array(n);
	}
}
function Rm(e, t, n, r, i, a) {
	switch (t) {
		case e.FLOAT: return new Float32Array(n.buffer, a * r, i);
		case e.INT: return new Int32Array(n.buffer, a * r, i);
	}
}
function zm(e, t, n, r) {
	var i = S(Im(e, t), 2), a = i[0], o = i[1], s = Lm(e, o, r), c = e.createBuffer();
	return e.bindBuffer(e.ARRAY_BUFFER, c), e.bufferData(e.ARRAY_BUFFER, s, e.STATIC_DRAW), o === e.FLOAT ? e.vertexAttribPointer(n, a, o, !1, 0, 0) : o === e.INT && e.vertexAttribIPointer(n, a, o, 0, 0), e.enableVertexAttribArray(n), e.bindBuffer(e.ARRAY_BUFFER, null), c;
}
function Bm(e, t, n, r) {
	var i = S(Im(e, n), 3), a = i[0], o = i[1], s = i[2], c = Lm(e, o, t * a), l = a * s, u = e.createBuffer();
	e.bindBuffer(e.ARRAY_BUFFER, u), e.bufferData(e.ARRAY_BUFFER, t * l, e.DYNAMIC_DRAW), e.enableVertexAttribArray(r), o === e.FLOAT ? e.vertexAttribPointer(r, a, o, !1, l, 0) : o === e.INT && e.vertexAttribIPointer(r, a, o, l, 0), e.vertexAttribDivisor(r, 1), e.bindBuffer(e.ARRAY_BUFFER, null);
	for (var d = Array(t), f = 0; f < t; f++) d[f] = Rm(e, o, c, l, a, f);
	return u.dataArray = c, u.stride = l, u.size = a, u.getView = function(e) {
		return d[e];
	}, u.setPoint = function(e, t, n) {
		var r = d[e];
		r[0] = t, r[1] = n;
	}, u.bufferSubData = function(t) {
		e.bindBuffer(e.ARRAY_BUFFER, u), t ? e.bufferSubData(e.ARRAY_BUFFER, 0, c, 0, t * a) : e.bufferSubData(e.ARRAY_BUFFER, 0, c);
	}, u;
}
function Vm(e, t, n) {
	for (var r = 9, i = new Float32Array(t * r), a = Array(t), o = 0; o < t; o++) {
		var s = o * r * 4;
		a[o] = new Float32Array(i.buffer, s, r);
	}
	var c = e.createBuffer();
	e.bindBuffer(e.ARRAY_BUFFER, c), e.bufferData(e.ARRAY_BUFFER, i.byteLength, e.DYNAMIC_DRAW);
	for (var l = 0; l < 3; l++) {
		var u = n + l;
		e.enableVertexAttribArray(u), e.vertexAttribPointer(u, 3, e.FLOAT, !1, 36, l * 12), e.vertexAttribDivisor(u, 1);
	}
	return e.bindBuffer(e.ARRAY_BUFFER, null), c.getMatrixView = function(e) {
		return a[e];
	}, c.setData = function(e, t) {
		a[t].set(e, 0);
	}, c.bufferSubData = function() {
		e.bindBuffer(e.ARRAY_BUFFER, c), e.bufferSubData(e.ARRAY_BUFFER, 0, i);
	}, c;
}
function Hm(e) {
	var t = e.createFramebuffer();
	e.bindFramebuffer(e.FRAMEBUFFER, t);
	var n = e.createTexture();
	return e.bindTexture(e.TEXTURE_2D, n), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, n, 0), e.bindFramebuffer(e.FRAMEBUFFER, null), t.setFramebufferAttachmentSizes = function(t, r) {
		e.bindTexture(e.TEXTURE_2D, n), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t, r, 0, e.RGBA, e.UNSIGNED_BYTE, null);
	}, t;
}
var Um = typeof Float32Array < "u" ? Float32Array : Array;
Math.hypot || (Math.hypot = function() {
	for (var e = 0, t = arguments.length; t--;) e += arguments[t] * arguments[t];
	return Math.sqrt(e);
});
function Wm() {
	var e = new Um(9);
	return Um != Float32Array && (e[1] = 0, e[2] = 0, e[3] = 0, e[5] = 0, e[6] = 0, e[7] = 0), e[0] = 1, e[4] = 1, e[8] = 1, e;
}
function Gm(e) {
	return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e;
}
function Km(e, t, n) {
	var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = n[0], p = n[1], m = n[2], h = n[3], g = n[4], _ = n[5], v = n[6], y = n[7], b = n[8];
	return e[0] = f * r + p * o + m * l, e[1] = f * i + p * s + m * u, e[2] = f * a + p * c + m * d, e[3] = h * r + g * o + _ * l, e[4] = h * i + g * s + _ * u, e[5] = h * a + g * c + _ * d, e[6] = v * r + y * o + b * l, e[7] = v * i + y * s + b * u, e[8] = v * a + y * c + b * d, e;
}
function qm(e, t, n) {
	var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = n[0], p = n[1];
	return e[0] = r, e[1] = i, e[2] = a, e[3] = o, e[4] = s, e[5] = c, e[6] = f * r + p * o + l, e[7] = f * i + p * s + u, e[8] = f * a + p * c + d, e;
}
function Jm(e, t, n) {
	var r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = Math.sin(n), p = Math.cos(n);
	return e[0] = p * r + f * o, e[1] = p * i + f * s, e[2] = p * a + f * c, e[3] = p * o - f * r, e[4] = p * s - f * i, e[5] = p * c - f * a, e[6] = l, e[7] = u, e[8] = d, e;
}
function Ym(e, t, n) {
	var r = n[0], i = n[1];
	return e[0] = r * t[0], e[1] = r * t[1], e[2] = r * t[2], e[3] = i * t[3], e[4] = i * t[4], e[5] = i * t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
}
function Xm(e, t, n) {
	return e[0] = 2 / t, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = -2 / n, e[5] = 0, e[6] = -1, e[7] = 1, e[8] = 1, e;
}
var Zm = /*#__PURE__*/ function() {
	function e(t, n, r, i) {
		p(this, e), this.debugID = Math.floor(Math.random() * 1e4), this.r = t, this.texSize = n, this.texRows = r, this.texHeight = Math.floor(n / r), this.enableWrapping = !0, this.locked = !1, this.texture = null, this.needsBuffer = !0, this.freePointer = {
			x: 0,
			row: 0
		}, this.keyToLocation = /* @__PURE__ */ new Map(), this.canvas = i(t, n, n), this.scratch = i(t, n, this.texHeight, "scratch");
	}
	return h(e, [
		{
			key: "lock",
			value: function() {
				this.locked = !0;
			}
		},
		{
			key: "getKeys",
			value: function() {
				return new Set(this.keyToLocation.keys());
			}
		},
		{
			key: "getScale",
			value: function(e) {
				var t = e.w, n = e.h, r = this.texHeight, i = this.texSize, a = r / n, o = t * a, s = n * a;
				return o > i && (a = i / t, o = t * a, s = n * a), {
					scale: a,
					texW: o,
					texH: s
				};
			}
		},
		{
			key: "draw",
			value: function(e, t, n) {
				var r = this;
				if (this.locked) throw Error("can't draw, atlas is locked");
				var i = this.texSize, a = this.texRows, o = this.texHeight, s = this.getScale(t), c = s.scale, l = s.texW, u = s.texH, d = function(e, r) {
					if (n && r) {
						var i = r.context, a = e.x, s = e.row, l = a, u = o * s;
						i.save(), i.translate(l, u), i.scale(c, c), n(i, t), i.restore();
					}
				}, f = [null, null], p = function() {
					d(r.freePointer, r.canvas), f[0] = {
						x: r.freePointer.x,
						y: r.freePointer.row * o,
						w: l,
						h: u
					}, f[1] = {
						x: r.freePointer.x + l,
						y: r.freePointer.row * o,
						w: 0,
						h: u
					}, r.freePointer.x += l, r.freePointer.x == i && (r.freePointer.x = 0, r.freePointer.row++);
				}, m = function() {
					var e = r.scratch, t = r.canvas;
					e.clear(), d({
						x: 0,
						row: 0
					}, e);
					var n = i - r.freePointer.x, a = l - n, s = o, c = r.freePointer.x, p = r.freePointer.row * o, m = n;
					t.context.drawImage(e, 0, 0, m, s, c, p, m, s), f[0] = {
						x: c,
						y: p,
						w: m,
						h: u
					};
					var h = n, g = (r.freePointer.row + 1) * o, _ = a;
					t && t.context.drawImage(e, h, 0, _, s, 0, g, _, s), f[1] = {
						x: 0,
						y: g,
						w: _,
						h: u
					}, r.freePointer.x = a, r.freePointer.row++;
				}, h = function() {
					r.freePointer.x = 0, r.freePointer.row++;
				};
				if (this.freePointer.x + l <= i) p();
				else if (this.freePointer.row >= a - 1) return !1;
				else this.freePointer.x === i ? (h(), p()) : this.enableWrapping ? m() : (h(), p());
				return this.keyToLocation.set(e, f), this.needsBuffer = !0, f;
			}
		},
		{
			key: "getOffsets",
			value: function(e) {
				return this.keyToLocation.get(e);
			}
		},
		{
			key: "isEmpty",
			value: function() {
				return this.freePointer.x === 0 && this.freePointer.row === 0;
			}
		},
		{
			key: "canFit",
			value: function(e) {
				if (this.locked) return !1;
				var t = this.texSize, n = this.texRows, r = this.getScale(e).texW;
				return this.freePointer.x + r > t ? this.freePointer.row < n - 1 : !0;
			}
		},
		{
			key: "bufferIfNeeded",
			value: function(e) {
				this.texture ||= Fm(e, this.debugID), this.needsBuffer && (this.texture.buffer(this.canvas), this.needsBuffer = !1, this.locked && (this.canvas = null, this.scratch = null));
			}
		},
		{
			key: "dispose",
			value: function() {
				this.texture &&= (this.texture.deleteTexture(), null), this.canvas = null, this.scratch = null, this.locked = !0;
			}
		}
	]);
}(), Qm = /*#__PURE__*/ function() {
	function e(t, n, r, i) {
		p(this, e), this.r = t, this.texSize = n, this.texRows = r, this.createTextureCanvas = i, this.atlases = [], this.styleKeyToAtlas = /* @__PURE__ */ new Map(), this.markedKeys = /* @__PURE__ */ new Set();
	}
	return h(e, [
		{
			key: "getKeys",
			value: function() {
				return new Set(this.styleKeyToAtlas.keys());
			}
		},
		{
			key: "_createAtlas",
			value: function() {
				var e = this.r, t = this.texSize, n = this.texRows, r = this.createTextureCanvas;
				return new Zm(e, t, n, r);
			}
		},
		{
			key: "_getScratchCanvas",
			value: function() {
				if (!this.scratch) {
					var e = this.r, t = this.texSize, n = this.texRows, r = this.createTextureCanvas, i = Math.floor(t / n);
					this.scratch = r(e, t, i, "scratch");
				}
				return this.scratch;
			}
		},
		{
			key: "draw",
			value: function(e, t, n) {
				var r = this.styleKeyToAtlas.get(e);
				return r || (r = this.atlases[this.atlases.length - 1], (!r || !r.canFit(t)) && (r && r.lock(), r = this._createAtlas(), this.atlases.push(r)), r.draw(e, t, n), this.styleKeyToAtlas.set(e, r)), r;
			}
		},
		{
			key: "getAtlas",
			value: function(e) {
				return this.styleKeyToAtlas.get(e);
			}
		},
		{
			key: "hasAtlas",
			value: function(e) {
				return this.styleKeyToAtlas.has(e);
			}
		},
		{
			key: "markKeyForGC",
			value: function(e) {
				this.markedKeys.add(e);
			}
		},
		{
			key: "gc",
			value: function() {
				var e = this, t = this.markedKeys;
				if (t.size === 0) {
					console.log("nothing to garbage collect");
					return;
				}
				var n = [], r = /* @__PURE__ */ new Map(), i = null, a = g(this.atlases), o;
				try {
					var s = function() {
						var a = o.value, s = a.getKeys(), c = $m(t, s);
						if (c.size === 0) return n.push(a), s.forEach(function(e) {
							return r.set(e, a);
						}), 1;
						i || (i = e._createAtlas(), n.push(i));
						var l = g(s), u;
						try {
							for (l.s(); !(u = l.n()).done;) {
								var d = u.value;
								if (!c.has(d)) {
									var f = S(a.getOffsets(d), 2), p = f[0], m = f[1];
									i.canFit({
										w: p.w + m.w,
										h: p.h
									}) || (i.lock(), i = e._createAtlas(), n.push(i)), a.canvas && (e._copyTextureToNewAtlas(d, a, i), r.set(d, i));
								}
							}
						} catch (e) {
							l.e(e);
						} finally {
							l.f();
						}
						a.dispose();
					};
					for (a.s(); !(o = a.n()).done;) if (s()) continue;
				} catch (e) {
					a.e(e);
				} finally {
					a.f();
				}
				this.atlases = n, this.styleKeyToAtlas = r, this.markedKeys = /* @__PURE__ */ new Set();
			}
		},
		{
			key: "_copyTextureToNewAtlas",
			value: function(e, t, n) {
				var r = S(t.getOffsets(e), 2), i = r[0], a = r[1];
				if (a.w === 0) n.draw(e, i, function(e) {
					e.drawImage(t.canvas, i.x, i.y, i.w, i.h, 0, 0, i.w, i.h);
				});
				else {
					var o = this._getScratchCanvas();
					o.clear(), o.context.drawImage(t.canvas, i.x, i.y, i.w, i.h, 0, 0, i.w, i.h), o.context.drawImage(t.canvas, a.x, a.y, a.w, a.h, i.w, 0, a.w, a.h);
					var s = i.w + a.w, c = i.h;
					n.draw(e, {
						w: s,
						h: c
					}, function(e) {
						e.drawImage(o, 0, 0, s, c, 0, 0, s, c);
					});
				}
			}
		},
		{
			key: "getCounts",
			value: function() {
				return {
					keyCount: this.styleKeyToAtlas.size,
					atlasCount: new Set(this.styleKeyToAtlas.values()).size
				};
			}
		}
	]);
}();
function $m(e, t) {
	return e.intersection ? e.intersection(t) : new Set(C(e).filter(function(e) {
		return t.has(e);
	}));
}
var eh = /*#__PURE__*/ function() {
	function e(t, n) {
		p(this, e), this.r = t, this.globalOptions = n, this.atlasSize = n.webglTexSize, this.maxAtlasesPerBatch = n.webglTexPerBatch, this.renderTypes = /* @__PURE__ */ new Map(), this.collections = /* @__PURE__ */ new Map(), this.typeAndIdToKey = /* @__PURE__ */ new Map();
	}
	return h(e, [
		{
			key: "getAtlasSize",
			value: function() {
				return this.atlasSize;
			}
		},
		{
			key: "addAtlasCollection",
			value: function(e, t) {
				var n = this.globalOptions, r = n.webglTexSize, i = n.createTextureCanvas, a = t.texRows, o = this._cacheScratchCanvas(i), s = new Qm(this.r, r, a, o);
				this.collections.set(e, s);
			}
		},
		{
			key: "addRenderType",
			value: function(e, t) {
				var n = t.collection;
				if (!this.collections.has(n)) throw Error(`invalid atlas collection name '${n}'`);
				var r = Z({
					type: e,
					atlasCollection: this.collections.get(n)
				}, t);
				this.renderTypes.set(e, r);
			}
		},
		{
			key: "getRenderTypeOpts",
			value: function(e) {
				return this.renderTypes.get(e);
			}
		},
		{
			key: "getAtlasCollection",
			value: function(e) {
				return this.collections.get(e);
			}
		},
		{
			key: "_cacheScratchCanvas",
			value: function(e) {
				var t = -1, n = -1, r = null;
				return function(i, a, o, s) {
					return s ? ((!r || a != t || o != n) && (t = a, n = o, r = e(i, a, o)), r) : e(i, a, o);
				};
			}
		},
		{
			key: "_key",
			value: function(e, t) {
				return `${e}-${t}`;
			}
		},
		{
			key: "invalidate",
			value: function(e) {
				var t = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = n.forceRedraw, i = r !== void 0 && r, a = n.filterEle, o = a === void 0 ? function() {
					return !0;
				} : a, s = n.filterType, c = s === void 0 ? function() {
					return !0;
				} : s, l = !1, u = !1, d = g(e), f;
				try {
					for (d.s(); !(f = d.n()).done;) {
						var p = f.value;
						if (o(p)) {
							var m = g(this.renderTypes.values()), h;
							try {
								var _ = function() {
									var e = h.value, n = e.type;
									if (c(n)) {
										var r = t.collections.get(e.collection), a = e.getKey(p), o = Array.isArray(a) ? a : [a];
										if (i) o.forEach(function(e) {
											return r.markKeyForGC(e);
										}), u = !0;
										else {
											var s = e.getID ? e.getID(p) : p.id(), d = t._key(n, s), f = t.typeAndIdToKey.get(d);
											f !== void 0 && !jm(o, f) && (l = !0, t.typeAndIdToKey.delete(d), f.forEach(function(e) {
												return r.markKeyForGC(e);
											}));
										}
									}
								};
								for (m.s(); !(h = m.n()).done;) _();
							} catch (e) {
								m.e(e);
							} finally {
								m.f();
							}
						}
					}
				} catch (e) {
					d.e(e);
				} finally {
					d.f();
				}
				return u && (this.gc(), l = !1), l;
			}
		},
		{
			key: "gc",
			value: function() {
				var e = g(this.collections.values()), t;
				try {
					for (e.s(); !(t = e.n()).done;) t.value.gc();
				} catch (t) {
					e.e(t);
				} finally {
					e.f();
				}
			}
		},
		{
			key: "getOrCreateAtlas",
			value: function(e, t, n, r) {
				var i = this.renderTypes.get(t), a = this.collections.get(i.collection), o = !1, s = a.draw(r, n, function(t) {
					i.drawClipped ? (t.save(), t.beginPath(), t.rect(0, 0, n.w, n.h), t.clip(), i.drawElement(t, e, n, !0, !0), t.restore()) : i.drawElement(t, e, n, !0, !0), o = !0;
				});
				if (o) {
					var c = i.getID ? i.getID(e) : e.id(), l = this._key(t, c);
					this.typeAndIdToKey.has(l) ? this.typeAndIdToKey.get(l).push(r) : this.typeAndIdToKey.set(l, [r]);
				}
				return s;
			}
		},
		{
			key: "getAtlasInfo",
			value: function(e, t) {
				var n = this, r = this.renderTypes.get(t), i = r.getKey(e);
				return (Array.isArray(i) ? i : [i]).map(function(i) {
					var a = r.getBoundingBox(e, i), o = n.getOrCreateAtlas(e, t, a, i), s = S(o.getOffsets(i), 2), c = s[0];
					return {
						atlas: o,
						tex: c,
						tex1: c,
						tex2: s[1],
						bb: a
					};
				});
			}
		},
		{
			key: "getDebugInfo",
			value: function() {
				var e = [], t = g(this.collections), n;
				try {
					for (t.s(); !(n = t.n()).done;) {
						var r = S(n.value, 2), i = r[0], a = r[1].getCounts(), o = a.keyCount, s = a.atlasCount;
						e.push({
							type: i,
							keyCount: o,
							atlasCount: s
						});
					}
				} catch (e) {
					t.e(e);
				} finally {
					t.f();
				}
				return e;
			}
		}
	]);
}(), th = /*#__PURE__*/ function() {
	function e(t) {
		p(this, e), this.globalOptions = t, this.atlasSize = t.webglTexSize, this.maxAtlasesPerBatch = t.webglTexPerBatch, this.batchAtlases = [];
	}
	return h(e, [
		{
			key: "getMaxAtlasesPerBatch",
			value: function() {
				return this.maxAtlasesPerBatch;
			}
		},
		{
			key: "getAtlasSize",
			value: function() {
				return this.atlasSize;
			}
		},
		{
			key: "getIndexArray",
			value: function() {
				return Array.from({ length: this.maxAtlasesPerBatch }, function(e, t) {
					return t;
				});
			}
		},
		{
			key: "startBatch",
			value: function() {
				this.batchAtlases = [];
			}
		},
		{
			key: "getAtlasCount",
			value: function() {
				return this.batchAtlases.length;
			}
		},
		{
			key: "getAtlases",
			value: function() {
				return this.batchAtlases;
			}
		},
		{
			key: "canAddToCurrentBatch",
			value: function(e) {
				return this.batchAtlases.length !== this.maxAtlasesPerBatch || this.batchAtlases.includes(e);
			}
		},
		{
			key: "getAtlasIndexForBatch",
			value: function(e) {
				var t = this.batchAtlases.indexOf(e);
				if (t < 0) {
					if (this.batchAtlases.length === this.maxAtlasesPerBatch) throw Error("cannot add more atlases to batch");
					this.batchAtlases.push(e), t = this.batchAtlases.length - 1;
				}
				return t;
			}
		}
	]);
}(), nh = "\n  float circleSD(vec2 p, float r) {\n    return distance(vec2(0), p) - r; // signed distance\n  }\n", rh = "\n  float rectangleSD(vec2 p, vec2 b) {\n    vec2 d = abs(p)-b;\n    return distance(vec2(0),max(d,0.0)) + min(max(d.x,d.y),0.0);\n  }\n", ih = "\n  float roundRectangleSD(vec2 p, vec2 b, vec4 cr) {\n    cr.xy = (p.x > 0.0) ? cr.xy : cr.zw;\n    cr.x  = (p.y > 0.0) ? cr.x  : cr.y;\n    vec2 q = abs(p) - b + cr.x;\n    return min(max(q.x, q.y), 0.0) + distance(vec2(0), max(q, 0.0)) - cr.x;\n  }\n", ah = "\n  float ellipseSD(vec2 p, vec2 ab) {\n    p = abs( p ); // symmetry\n\n    // find root with Newton solver\n    vec2 q = ab*(p-ab);\n    float w = (q.x<q.y)? 1.570796327 : 0.0;\n    for( int i=0; i<5; i++ ) {\n      vec2 cs = vec2(cos(w),sin(w));\n      vec2 u = ab*vec2( cs.x,cs.y);\n      vec2 v = ab*vec2(-cs.y,cs.x);\n      w = w + dot(p-u,v)/(dot(p-u,u)+dot(v,v));\n    }\n    \n    // compute final point and distance\n    float d = length(p-ab*vec2(cos(w),sin(w)));\n    \n    // return signed distance\n    return (dot(p/ab,p/ab)>1.0) ? d : -d;\n  }\n", oh = {
	SCREEN: {
		name: "screen",
		screen: !0
	},
	PICKING: {
		name: "picking",
		picking: !0
	}
}, sh = {
	IGNORE: 1,
	USE_BB: 2
}, ch = 0, lh = 1, uh = 2, dh = 3, fh = 4, ph = 5, mh = 6, hh = 7, gh = /*#__PURE__*/ function() {
	function e(t, n, r) {
		p(this, e), this.r = t, this.gl = n, this.maxInstances = r.webglBatchSize, this.atlasSize = r.webglTexSize, this.bgColor = r.bgColor, this.debug = r.webglDebug, this.batchDebugInfo = [], r.enableWrapping = !0, r.createTextureCanvas = Em, this.atlasManager = new eh(t, r), this.batchManager = new th(r), this.simpleShapeOptions = /* @__PURE__ */ new Map(), this.program = this._createShaderProgram(oh.SCREEN), this.pickingProgram = this._createShaderProgram(oh.PICKING), this.vao = this._createVAO();
	}
	return h(e, [
		{
			key: "addAtlasCollection",
			value: function(e, t) {
				this.atlasManager.addAtlasCollection(e, t);
			}
		},
		{
			key: "addTextureAtlasRenderType",
			value: function(e, t) {
				this.atlasManager.addRenderType(e, t);
			}
		},
		{
			key: "addSimpleShapeRenderType",
			value: function(e, t) {
				this.simpleShapeOptions.set(e, t);
			}
		},
		{
			key: "invalidate",
			value: function(e) {
				var t = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).type, n = this.atlasManager;
				return t ? n.invalidate(e, {
					filterType: function(e) {
						return e === t;
					},
					forceRedraw: !0
				}) : n.invalidate(e);
			}
		},
		{
			key: "gc",
			value: function() {
				this.atlasManager.gc();
			}
		},
		{
			key: "_createShaderProgram",
			value: function(e) {
				var t = this.gl, n = `#version 300 es
      precision highp float;

      uniform mat3 uPanZoomMatrix;
      uniform int  uAtlasSize;
      
      // instanced
      in vec2 aPosition; // a vertex from the unit square
      
      in mat3 aTransform; // used to transform verticies, eg into a bounding box
      in int aVertType; // the type of thing we are rendering

      // the z-index that is output when using picking mode
      in vec4 aIndex;
      
      // For textures
      in int aAtlasId; // which shader unit/atlas to use
      in vec4 aTex; // x/y/w/h of texture in atlas

      // for edges
      in vec4 aPointAPointB;
      in vec4 aPointCPointD;
      in vec2 aLineWidth; // also used for node border width

      // simple shapes
      in vec4 aCornerRadius; // for round-rectangle [top-right, bottom-right, top-left, bottom-left]
      in vec4 aColor; // also used for edges
      in vec4 aBorderColor; // aLineWidth is used for border width

      // output values passed to the fragment shader
      out vec2 vTexCoord;
      out vec4 vColor;
      out vec2 vPosition;
      // flat values are not interpolated
      flat out int vAtlasId; 
      flat out int vVertType;
      flat out vec2 vTopRight;
      flat out vec2 vBotLeft;
      flat out vec4 vCornerRadius;
      flat out vec4 vBorderColor;
      flat out vec2 vBorderWidth;
      flat out vec4 vIndex;
      
      void main(void) {
        int vid = gl_VertexID;
        vec2 position = aPosition; // TODO make this a vec3, simplifies some code below

        if(aVertType == ${ch}) {
          float texX = aTex.x; // texture coordinates
          float texY = aTex.y;
          float texW = aTex.z;
          float texH = aTex.w;

          if(vid == 1 || vid == 2 || vid == 4) {
            texX += texW;
          }
          if(vid == 2 || vid == 4 || vid == 5) {
            texY += texH;
          }

          float d = float(uAtlasSize);
          vTexCoord = vec2(texX / d, texY / d); // tex coords must be between 0 and 1

          gl_Position = vec4(uPanZoomMatrix * aTransform * vec3(position, 1.0), 1.0);
        }
        else if(aVertType == ${fh} || aVertType == ${hh} 
             || aVertType == ${ph} || aVertType == ${mh}) { // simple shapes

          // the bounding box is needed by the fragment shader
          vBotLeft  = (aTransform * vec3(0, 0, 1)).xy; // flat
          vTopRight = (aTransform * vec3(1, 1, 1)).xy; // flat
          vPosition = (aTransform * vec3(position, 1)).xy; // will be interpolated

          // calculations are done in the fragment shader, just pass these along
          vColor = aColor;
          vCornerRadius = aCornerRadius;
          vBorderColor = aBorderColor;
          vBorderWidth = aLineWidth;

          gl_Position = vec4(uPanZoomMatrix * aTransform * vec3(position, 1.0), 1.0);
        }
        else if(aVertType == ${lh}) {
          vec2 source = aPointAPointB.xy;
          vec2 target = aPointAPointB.zw;

          // adjust the geometry so that the line is centered on the edge
          position.y = position.y - 0.5;

          // stretch the unit square into a long skinny rectangle
          vec2 xBasis = target - source;
          vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
          vec2 point = source + xBasis * position.x + yBasis * aLineWidth[0] * position.y;

          gl_Position = vec4(uPanZoomMatrix * vec3(point, 1.0), 1.0);
          vColor = aColor;
        } 
        else if(aVertType == ${uh}) {
          vec2 pointA = aPointAPointB.xy;
          vec2 pointB = aPointAPointB.zw;
          vec2 pointC = aPointCPointD.xy;
          vec2 pointD = aPointCPointD.zw;

          // adjust the geometry so that the line is centered on the edge
          position.y = position.y - 0.5;

          vec2 p0, p1, p2, pos;
          if(position.x == 0.0) { // The left side of the unit square
            p0 = pointA;
            p1 = pointB;
            p2 = pointC;
            pos = position;
          } else { // The right side of the unit square, use same approach but flip the geometry upside down
            p0 = pointD;
            p1 = pointC;
            p2 = pointB;
            pos = vec2(0.0, -position.y);
          }

          vec2 p01 = p1 - p0;
          vec2 p12 = p2 - p1;
          vec2 p21 = p1 - p2;

          // Find the normal vector.
          vec2 tangent = normalize(normalize(p12) + normalize(p01));
          vec2 normal = vec2(-tangent.y, tangent.x);

          // Find the vector perpendicular to p0 -> p1.
          vec2 p01Norm = normalize(vec2(-p01.y, p01.x));

          // Determine the bend direction.
          float sigma = sign(dot(p01 + p21, normal));
          float width = aLineWidth[0];

          if(sign(pos.y) == -sigma) {
            // This is an intersecting vertex. Adjust the position so that there's no overlap.
            vec2 point = 0.5 * width * normal * -sigma / dot(normal, p01Norm);
            gl_Position = vec4(uPanZoomMatrix * vec3(p1 + point, 1.0), 1.0);
          } else {
            // This is a non-intersecting vertex. Treat it like a mitre join.
            vec2 point = 0.5 * width * normal * sigma * dot(normal, p01Norm);
            gl_Position = vec4(uPanZoomMatrix * vec3(p1 + point, 1.0), 1.0);
          }

          vColor = aColor;
        } 
        else if(aVertType == ${dh} && vid < 3) {
          // massage the first triangle into an edge arrow
          if(vid == 0)
            position = vec2(-0.15, -0.3);
          if(vid == 1)
            position = vec2(  0.0,  0.0);
          if(vid == 2)
            position = vec2( 0.15, -0.3);

          gl_Position = vec4(uPanZoomMatrix * aTransform * vec3(position, 1.0), 1.0);
          vColor = aColor;
        }
        else {
          gl_Position = vec4(2.0, 0.0, 0.0, 1.0); // discard vertex by putting it outside webgl clip space
        }

        vAtlasId = aAtlasId;
        vVertType = aVertType;
        vIndex = aIndex;
      }
    `, r = this.batchManager.getIndexArray(), i = Tm(t, n, `#version 300 es
      precision highp float;

      // declare texture unit for each texture atlas in the batch
      ${r.map(function(e) {
					return `uniform sampler2D uTexture${e};`;
				}).join("\n	")}

      uniform vec4 uBGColor;
      uniform float uZoom;

      in vec2 vTexCoord;
      in vec4 vColor;
      in vec2 vPosition; // model coordinates

      flat in int vAtlasId;
      flat in vec4 vIndex;
      flat in int vVertType;
      flat in vec2 vTopRight;
      flat in vec2 vBotLeft;
      flat in vec4 vCornerRadius;
      flat in vec4 vBorderColor;
      flat in vec2 vBorderWidth;

      out vec4 outColor;

      ${nh}
      ${rh}
      ${ih}
      ${ah}

      vec4 blend(vec4 top, vec4 bot) { // blend colors with premultiplied alpha
        return vec4( 
          top.rgb + (bot.rgb * (1.0 - top.a)),
          top.a   + (bot.a   * (1.0 - top.a)) 
        );
      }

      vec4 distInterp(vec4 cA, vec4 cB, float d) { // interpolate color using Signed Distance
        // scale to the zoom level so that borders don't look blurry when zoomed in
        // note 1.5 is an aribitrary value chosen because it looks good
        return mix(cA, cB, 1.0 - smoothstep(0.0, 1.5 / uZoom, abs(d))); 
      }

      void main(void) {
        if(vVertType == ${ch}) {
          // look up the texel from the texture unit
          ${r.map(function(e) {
					return `if(vAtlasId == ${e}) outColor = texture(uTexture${e}, vTexCoord);`;
				}).join("\n	else ")}
        } 
        else if(vVertType == ${dh}) {
          // mimics how canvas renderer uses context.globalCompositeOperation = 'destination-out';
          outColor = blend(vColor, uBGColor);
          outColor.a = 1.0; // make opaque, masks out line under arrow
        }
        else if(vVertType == ${fh} && vBorderWidth == vec2(0.0)) { // simple rectangle with no border
          outColor = vColor; // unit square is already transformed to the rectangle, nothing else needs to be done
        }
        else if(vVertType == ${fh} || vVertType == ${hh} 
          || vVertType == ${ph} || vVertType == ${mh}) { // use SDF

          float outerBorder = vBorderWidth[0];
          float innerBorder = vBorderWidth[1];
          float borderPadding = outerBorder * 2.0;
          float w = vTopRight.x - vBotLeft.x - borderPadding;
          float h = vTopRight.y - vBotLeft.y - borderPadding;
          vec2 b = vec2(w/2.0, h/2.0); // half width, half height
          vec2 p = vPosition - vec2(vTopRight.x - b[0] - outerBorder, vTopRight.y - b[1] - outerBorder); // translate to center

          float d; // signed distance
          if(vVertType == ${fh}) {
            d = rectangleSD(p, b);
          } else if(vVertType == ${hh} && w == h) {
            d = circleSD(p, b.x); // faster than ellipse
          } else if(vVertType == ${hh}) {
            d = ellipseSD(p, b);
          } else {
            d = roundRectangleSD(p, b, vCornerRadius.wzyx);
          }

          // use the distance to interpolate a color to smooth the edges of the shape, doesn't need multisampling
          // we must smooth colors inwards, because we can't change pixels outside the shape's bounding box
          if(d > 0.0) {
            if(d > outerBorder) {
              discard;
            } else {
              outColor = distInterp(vBorderColor, vec4(0), d - outerBorder);
            }
          } else {
            if(d > innerBorder) {
              vec4 outerColor = outerBorder == 0.0 ? vec4(0) : vBorderColor;
              vec4 innerBorderColor = blend(vBorderColor, vColor);
              outColor = distInterp(innerBorderColor, outerColor, d);
            } 
            else {
              vec4 outerColor;
              if(innerBorder == 0.0 && outerBorder == 0.0) {
                outerColor = vec4(0);
              } else if(innerBorder == 0.0) {
                outerColor = vBorderColor;
              } else {
                outerColor = blend(vBorderColor, vColor);
              }
              outColor = distInterp(vColor, outerColor, d - innerBorder);
            }
          }
        }
        else {
          outColor = vColor;
        }

        ${e.picking ? "if(outColor.a == 0.0) discard;\n             else outColor = vIndex;" : ""}
      }
    `);
				i.aPosition = t.getAttribLocation(i, "aPosition"), i.aIndex = t.getAttribLocation(i, "aIndex"), i.aVertType = t.getAttribLocation(i, "aVertType"), i.aTransform = t.getAttribLocation(i, "aTransform"), i.aAtlasId = t.getAttribLocation(i, "aAtlasId"), i.aTex = t.getAttribLocation(i, "aTex"), i.aPointAPointB = t.getAttribLocation(i, "aPointAPointB"), i.aPointCPointD = t.getAttribLocation(i, "aPointCPointD"), i.aLineWidth = t.getAttribLocation(i, "aLineWidth"), i.aColor = t.getAttribLocation(i, "aColor"), i.aCornerRadius = t.getAttribLocation(i, "aCornerRadius"), i.aBorderColor = t.getAttribLocation(i, "aBorderColor"), i.uPanZoomMatrix = t.getUniformLocation(i, "uPanZoomMatrix"), i.uAtlasSize = t.getUniformLocation(i, "uAtlasSize"), i.uBGColor = t.getUniformLocation(i, "uBGColor"), i.uZoom = t.getUniformLocation(i, "uZoom"), i.uTextures = [];
				for (var a = 0; a < this.batchManager.getMaxAtlasesPerBatch(); a++) i.uTextures.push(t.getUniformLocation(i, `uTexture${a}`));
				return i;
			}
		},
		{
			key: "_createVAO",
			value: function() {
				var e = [
					0,
					0,
					1,
					0,
					1,
					1,
					0,
					0,
					1,
					1,
					0,
					1
				];
				this.vertexCount = e.length / 2;
				var t = this.maxInstances, n = this.gl, r = this.program, i = n.createVertexArray();
				return n.bindVertexArray(i), zm(n, "vec2", r.aPosition, e), this.transformBuffer = Vm(n, t, r.aTransform), this.indexBuffer = Bm(n, t, "vec4", r.aIndex), this.vertTypeBuffer = Bm(n, t, "int", r.aVertType), this.atlasIdBuffer = Bm(n, t, "int", r.aAtlasId), this.texBuffer = Bm(n, t, "vec4", r.aTex), this.pointAPointBBuffer = Bm(n, t, "vec4", r.aPointAPointB), this.pointCPointDBuffer = Bm(n, t, "vec4", r.aPointCPointD), this.lineWidthBuffer = Bm(n, t, "vec2", r.aLineWidth), this.colorBuffer = Bm(n, t, "vec4", r.aColor), this.cornerRadiusBuffer = Bm(n, t, "vec4", r.aCornerRadius), this.borderColorBuffer = Bm(n, t, "vec4", r.aBorderColor), n.bindVertexArray(null), i;
			}
		},
		{
			key: "buffers",
			get: function() {
				var e = this;
				return this._buffers ||= Object.keys(this).filter(function(e) {
					return le(e, "Buffer");
				}).map(function(t) {
					return e[t];
				}), this._buffers;
			}
		},
		{
			key: "startFrame",
			value: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : oh.SCREEN;
				this.panZoomMatrix = e, this.renderTarget = t, this.batchDebugInfo = [], this.wrappedCount = 0, this.simpleCount = 0, this.startBatch();
			}
		},
		{
			key: "startBatch",
			value: function() {
				this.instanceCount = 0, this.batchManager.startBatch();
			}
		},
		{
			key: "endFrame",
			value: function() {
				this.endBatch();
			}
		},
		{
			key: "_isVisible",
			value: function(e, t) {
				return e.visible() ? t && t.isVisible ? t.isVisible(e) : !0 : !1;
			}
		},
		{
			key: "drawTexture",
			value: function(e, t, n) {
				var r = this.atlasManager, i = this.batchManager, a = r.getRenderTypeOpts(n);
				if (this._isVisible(e, a) && (!e.isEdge() || this._isValidEdge(e))) {
					if (this.renderTarget.picking && a.getTexPickingMode) {
						var o = a.getTexPickingMode(e);
						if (o === sh.IGNORE) return;
						if (o == sh.USE_BB) {
							this.drawPickingRectangle(e, t, n);
							return;
						}
					}
					var s = g(r.getAtlasInfo(e, n)), c;
					try {
						for (s.s(); !(c = s.n()).done;) {
							var l = c.value, u = l.atlas, d = l.tex1, f = l.tex2;
							i.canAddToCurrentBatch(u) || this.endBatch();
							for (var p = i.getAtlasIndexForBatch(u), m = 0, h = [[d, !0], [f, !1]]; m < h.length; m++) {
								var _ = S(h[m], 2), v = _[0], y = _[1];
								if (v.w != 0) {
									var b = this.instanceCount;
									this.vertTypeBuffer.getView(b)[0] = ch, Nm(t, this.indexBuffer.getView(b));
									var x = this.atlasIdBuffer.getView(b);
									x[0] = p;
									var C = this.texBuffer.getView(b);
									C[0] = v.x, C[1] = v.y, C[2] = v.w, C[3] = v.h;
									var w = this.transformBuffer.getMatrixView(b);
									this.setTransformMatrix(e, w, a, l, y), this.instanceCount++, y || this.wrappedCount++, this.instanceCount >= this.maxInstances && this.endBatch();
								}
							}
						}
					} catch (e) {
						s.e(e);
					} finally {
						s.f();
					}
				}
			}
		},
		{
			key: "setTransformMatrix",
			value: function(e, t, n, r) {
				var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = 0;
				if (n.shapeProps && n.shapeProps.padding && (a = e.pstyle(n.shapeProps.padding).pfValue), r) {
					var o = r.bb, s = r.tex1, c = r.tex2, l = s.w / (s.w + c.w);
					i || (l = 1 - l);
					var u = this._getAdjustedBB(o, a, i, l);
					this._applyTransformMatrix(t, u, n, e);
				} else {
					var d = n.getBoundingBox(e), f = this._getAdjustedBB(d, a, !0, 1);
					this._applyTransformMatrix(t, f, n, e);
				}
			}
		},
		{
			key: "_applyTransformMatrix",
			value: function(e, t, n, r) {
				var i, a;
				Gm(e);
				var o = n.getRotation ? n.getRotation(r) : 0;
				if (o !== 0) {
					var s = n.getRotationPoint(r), c = s.x, l = s.y;
					qm(e, e, [c, l]), Jm(e, e, o);
					var u = n.getRotationOffset(r);
					i = u.x + (t.xOffset || 0), a = u.y + (t.yOffset || 0);
				} else i = t.x1, a = t.y1;
				qm(e, e, [i, a]), Ym(e, e, [t.w, t.h]);
			}
		},
		{
			key: "_getAdjustedBB",
			value: function(e, t, n, r) {
				var i = e.x1, a = e.y1, o = e.w, s = e.h, c = e.yOffset;
				t && (i -= t, a -= t, o += 2 * t, s += 2 * t);
				var l = 0, u = o * r;
				return n && r < 1 ? o = u : !n && r < 1 && (l = o - u, i += l, o = u), {
					x1: i,
					y1: a,
					w: o,
					h: s,
					xOffset: l,
					yOffset: c
				};
			}
		},
		{
			key: "drawPickingRectangle",
			value: function(e, t, n) {
				var r = this.atlasManager.getRenderTypeOpts(n), i = this.instanceCount;
				this.vertTypeBuffer.getView(i)[0] = fh, Nm(t, this.indexBuffer.getView(i)), Mm([
					0,
					0,
					0
				], 1, this.colorBuffer.getView(i));
				var a = this.transformBuffer.getMatrixView(i);
				this.setTransformMatrix(e, a, r), this.simpleCount++, this.instanceCount++, this.instanceCount >= this.maxInstances && this.endBatch();
			}
		},
		{
			key: "drawNode",
			value: function(e, t, n) {
				var r = this.simpleShapeOptions.get(n);
				if (this._isVisible(e, r)) {
					var i = r.shapeProps, a = this._getVertTypeForShape(e, i.shape);
					if (a === void 0 || r.isSimple && !r.isSimple(e, this.renderTarget)) {
						this.drawTexture(e, t, n);
						return;
					}
					var o = this.instanceCount;
					if (this.vertTypeBuffer.getView(o)[0] = a, a === ph || a === mh) {
						var s = r.getBoundingBox(e), c = this._getCornerRadius(e, i.radius, s), l = this.cornerRadiusBuffer.getView(o);
						l[0] = c, l[1] = c, l[2] = c, l[3] = c, a === mh && (l[0] = 0, l[2] = 0);
					}
					Nm(t, this.indexBuffer.getView(o));
					var u = this.renderTarget.picking ? 1 : n === "node-body" ? e.effectiveOpacity() : 1, d = this.renderTarget.picking ? 1 : e.pstyle(i.opacity).value * u, f = e.pstyle(i.color).value;
					Mm(f, d, this.colorBuffer.getView(o));
					var p = this.lineWidthBuffer.getView(o);
					if (p[0] = 0, p[1] = 0, i.border) {
						var m = e.pstyle("border-width").value;
						if (m > 0) {
							var h = e.pstyle("border-color").value;
							Mm(h, u * e.pstyle("border-opacity").value, this.borderColorBuffer.getView(o));
							var g = e.pstyle("border-position").value;
							if (g === "inside") p[0] = 0, p[1] = -m;
							else if (g === "outside") p[0] = m, p[1] = 0;
							else {
								var _ = m / 2;
								p[0] = _, p[1] = -_;
							}
						}
					}
					var v = this.transformBuffer.getMatrixView(o);
					this.setTransformMatrix(e, v, r), this.simpleCount++, this.instanceCount++, this.instanceCount >= this.maxInstances && this.endBatch();
				}
			}
		},
		{
			key: "_getVertTypeForShape",
			value: function(e, t) {
				switch (e.pstyle(t).value) {
					case "rectangle": return fh;
					case "ellipse": return hh;
					case "roundrectangle":
					case "round-rectangle": return ph;
					case "bottom-round-rectangle": return mh;
					default: return;
				}
			}
		},
		{
			key: "_getCornerRadius",
			value: function(e, t, n) {
				var r = n.w, i = n.h;
				if (e.pstyle(t).value === "auto") return Vr(r, i);
				var a = e.pstyle(t).pfValue, o = r / 2, s = i / 2;
				return Math.min(a, s, o);
			}
		},
		{
			key: "drawEdgeArrow",
			value: function(e, t, n) {
				if (e.visible()) {
					var r = e._private.rscratch, i, a, o;
					if (n === "source" ? (i = r.arrowStartX, a = r.arrowStartY, o = r.srcArrowAngle) : (i = r.arrowEndX, a = r.arrowEndY, o = r.tgtArrowAngle), !(isNaN(i) || i == null || isNaN(a) || a == null || isNaN(o) || o == null) && e.pstyle(n + "-arrow-shape").value !== "none") {
						var s = e.pstyle(n + "-arrow-color").value, c = e.pstyle("opacity").value * e.pstyle("line-opacity").value, l = e.pstyle("width").pfValue, u = e.pstyle("arrow-scale").value, d = this.r.getArrowWidth(l, u), f = this.instanceCount, p = this.transformBuffer.getMatrixView(f);
						Gm(p), qm(p, p, [i, a]), Ym(p, p, [d, d]), Jm(p, p, o), this.vertTypeBuffer.getView(f)[0] = dh, Nm(t, this.indexBuffer.getView(f)), Mm(s, c, this.colorBuffer.getView(f)), this.instanceCount++, this.instanceCount >= this.maxInstances && this.endBatch();
					}
				}
			}
		},
		{
			key: "drawEdgeLine",
			value: function(e, t) {
				if (e.visible()) {
					var n = this._getEdgePoints(e);
					if (n) {
						var r = e.pstyle("opacity").value, i = e.pstyle("line-opacity").value, a = e.pstyle("width").pfValue, o = e.pstyle("line-color").value, s = r * i;
						if (n.length / 2 + this.instanceCount > this.maxInstances && this.endBatch(), n.length == 4) {
							var c = this.instanceCount;
							this.vertTypeBuffer.getView(c)[0] = lh, Nm(t, this.indexBuffer.getView(c)), Mm(o, s, this.colorBuffer.getView(c));
							var l = this.lineWidthBuffer.getView(c);
							l[0] = a;
							var u = this.pointAPointBBuffer.getView(c);
							u[0] = n[0], u[1] = n[1], u[2] = n[2], u[3] = n[3], this.instanceCount++, this.instanceCount >= this.maxInstances && this.endBatch();
						} else for (var d = 0; d < n.length - 2; d += 2) {
							var f = this.instanceCount;
							this.vertTypeBuffer.getView(f)[0] = uh, Nm(t, this.indexBuffer.getView(f)), Mm(o, s, this.colorBuffer.getView(f));
							var p = this.lineWidthBuffer.getView(f);
							p[0] = a;
							var m = n[d - 2], h = n[d - 1], g = n[d], _ = n[d + 1], v = n[d + 2], y = n[d + 3], b = n[d + 4], x = n[d + 5];
							d == 0 && (m = 2 * g - v + .001, h = 2 * _ - y + .001), d == n.length - 4 && (b = 2 * v - g + .001, x = 2 * y - _ + .001);
							var S = this.pointAPointBBuffer.getView(f);
							S[0] = m, S[1] = h, S[2] = g, S[3] = _;
							var C = this.pointCPointDBuffer.getView(f);
							C[0] = v, C[1] = y, C[2] = b, C[3] = x, this.instanceCount++, this.instanceCount >= this.maxInstances && this.endBatch();
						}
					}
				}
			}
		},
		{
			key: "_isValidEdge",
			value: function(e) {
				var t = e._private.rscratch;
				return !(t.badLine || t.allpts == null || isNaN(t.allpts[0]));
			}
		},
		{
			key: "_getEdgePoints",
			value: function(e) {
				var t = e._private.rscratch;
				if (this._isValidEdge(e)) {
					var n = t.allpts;
					if (n.length == 4) return n;
					var r = this._getNumSegments(e);
					return this._getCurveSegmentPoints(n, r);
				}
			}
		},
		{
			key: "_getNumSegments",
			value: function(e) {
				return Math.min(15, this.maxInstances);
			}
		},
		{
			key: "_getCurveSegmentPoints",
			value: function(e, t) {
				if (e.length == 4) return e;
				for (var n = Array((t + 1) * 2), r = 0; r <= t; r++) if (r == 0) n[0] = e[0], n[1] = e[1];
				else if (r == t) n[r * 2] = e[e.length - 2], n[r * 2 + 1] = e[e.length - 1];
				else {
					var i = r / t;
					this._setCurvePoint(e, i, n, r * 2);
				}
				return n;
			}
		},
		{
			key: "_setCurvePoint",
			value: function(e, t, n, r) {
				if (e.length <= 2) n[r] = e[0], n[r + 1] = e[1];
				else {
					for (var i = Array(e.length - 2), a = 0; a < i.length; a += 2) {
						var o = (1 - t) * e[a] + t * e[a + 2], s = (1 - t) * e[a + 1] + t * e[a + 3];
						i[a] = o, i[a + 1] = s;
					}
					return this._setCurvePoint(i, t, n, r);
				}
			}
		},
		{
			key: "endBatch",
			value: function() {
				var e = this.gl, t = this.vao, n = this.vertexCount, r = this.instanceCount;
				if (r !== 0) {
					var i = this.renderTarget.picking ? this.pickingProgram : this.program;
					e.useProgram(i), e.bindVertexArray(t);
					var a = g(this.buffers), o;
					try {
						for (a.s(); !(o = a.n()).done;) o.value.bufferSubData(r);
					} catch (e) {
						a.e(e);
					} finally {
						a.f();
					}
					for (var s = this.batchManager.getAtlases(), c = 0; c < s.length; c++) s[c].bufferIfNeeded(e);
					for (var l = 0; l < s.length; l++) e.activeTexture(e.TEXTURE0 + l), e.bindTexture(e.TEXTURE_2D, s[l].texture), e.uniform1i(i.uTextures[l], l);
					e.uniform1f(i.uZoom, Om(this.r)), e.uniformMatrix3fv(i.uPanZoomMatrix, !1, this.panZoomMatrix), e.uniform1i(i.uAtlasSize, this.batchManager.getAtlasSize());
					var u = Mm(this.bgColor, 1);
					e.uniform4fv(i.uBGColor, u), e.drawArraysInstanced(e.TRIANGLES, 0, n, r), e.bindVertexArray(null), e.bindTexture(e.TEXTURE_2D, null), this.debug && this.batchDebugInfo.push({
						count: r,
						atlasCount: s.length
					}), this.startBatch();
				}
			}
		},
		{
			key: "getDebugInfo",
			value: function() {
				var e = this.atlasManager.getDebugInfo(), t = e.reduce(function(e, t) {
					return e + t.atlasCount;
				}, 0), n = this.batchDebugInfo, r = n.reduce(function(e, t) {
					return e + t.count;
				}, 0);
				return {
					atlasInfo: e,
					totalAtlases: t,
					wrappedCount: this.wrappedCount,
					simpleCount: this.simpleCount,
					batchCount: n.length,
					batchInfo: n,
					totalInstances: r
				};
			}
		}
	]);
}(), _h = {};
_h.initWebgl = function(e, t) {
	var n = this, r = n.data.contexts[n.WEBGL];
	e.bgColor = vh(n), e.webglTexSize = Math.min(e.webglTexSize, r.getParameter(r.MAX_TEXTURE_SIZE)), e.webglTexRows = Math.min(e.webglTexRows, 54), e.webglTexRowsNodes = Math.min(e.webglTexRowsNodes, 54), e.webglBatchSize = Math.min(e.webglBatchSize, 16384), e.webglTexPerBatch = Math.min(e.webglTexPerBatch, r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS)), n.webglDebug = e.webglDebug, n.webglDebugShowAtlases = e.webglDebugShowAtlases, n.pickingFrameBuffer = Hm(r), n.pickingFrameBuffer.needsDraw = !0, n.drawing = new gh(n, r, e);
	var i = function(e) {
		return function(t) {
			return n.getTextAngle(t, e);
		};
	}, a = function(e) {
		return function(t) {
			var n = t.pstyle(e);
			return n && n.value;
		};
	}, o = function(e) {
		return function(t) {
			return t.pstyle(`${e}-opacity`).value > 0;
		};
	}, s = function(e) {
		return e.pstyle("text-events").strValue === "yes" ? sh.USE_BB : sh.IGNORE;
	}, c = function(e) {
		var t = e.position(), n = t.x, r = t.y, i = e.outerWidth(), a = e.outerHeight();
		return {
			w: i,
			h: a,
			x1: n - i / 2,
			y1: r - a / 2
		};
	};
	n.drawing.addAtlasCollection("node", { texRows: e.webglTexRowsNodes }), n.drawing.addAtlasCollection("label", { texRows: e.webglTexRows }), n.drawing.addTextureAtlasRenderType("node-body", {
		collection: "node",
		getKey: t.getStyleKey,
		getBoundingBox: t.getElementBox,
		drawElement: t.drawElement
	}), n.drawing.addSimpleShapeRenderType("node-body", {
		getBoundingBox: c,
		isSimple: Am,
		shapeProps: {
			shape: "shape",
			color: "background-color",
			opacity: "background-opacity",
			radius: "corner-radius",
			border: !0
		}
	}), n.drawing.addSimpleShapeRenderType("node-overlay", {
		getBoundingBox: c,
		isVisible: o("overlay"),
		shapeProps: {
			shape: "overlay-shape",
			color: "overlay-color",
			opacity: "overlay-opacity",
			padding: "overlay-padding",
			radius: "overlay-corner-radius"
		}
	}), n.drawing.addSimpleShapeRenderType("node-underlay", {
		getBoundingBox: c,
		isVisible: o("underlay"),
		shapeProps: {
			shape: "underlay-shape",
			color: "underlay-color",
			opacity: "underlay-opacity",
			padding: "underlay-padding",
			radius: "underlay-corner-radius"
		}
	}), n.drawing.addTextureAtlasRenderType("label", {
		collection: "label",
		getTexPickingMode: s,
		getKey: bh(t.getLabelKey, null),
		getBoundingBox: xh(t.getLabelBox, null),
		drawClipped: !0,
		drawElement: t.drawLabel,
		getRotation: i(null),
		getRotationPoint: t.getLabelRotationPoint,
		getRotationOffset: t.getLabelRotationOffset,
		isVisible: a("label")
	}), n.drawing.addTextureAtlasRenderType("edge-source-label", {
		collection: "label",
		getTexPickingMode: s,
		getKey: bh(t.getSourceLabelKey, "source"),
		getBoundingBox: xh(t.getSourceLabelBox, "source"),
		drawClipped: !0,
		drawElement: t.drawSourceLabel,
		getRotation: i("source"),
		getRotationPoint: t.getSourceLabelRotationPoint,
		getRotationOffset: t.getSourceLabelRotationOffset,
		isVisible: a("source-label")
	}), n.drawing.addTextureAtlasRenderType("edge-target-label", {
		collection: "label",
		getTexPickingMode: s,
		getKey: bh(t.getTargetLabelKey, "target"),
		getBoundingBox: xh(t.getTargetLabelBox, "target"),
		drawClipped: !0,
		drawElement: t.drawTargetLabel,
		getRotation: i("target"),
		getRotationPoint: t.getTargetLabelRotationPoint,
		getRotationOffset: t.getTargetLabelRotationOffset,
		isVisible: a("target-label")
	});
	var l = ht(function() {
		console.log("garbage collect flag set"), n.data.gc = !0;
	}, 1e4);
	n.onUpdateEleCalcs(function(e, t) {
		var r = !1;
		t && t.length > 0 && (r |= n.drawing.invalidate(t)), r && l();
	}), Sh(n);
};
function vh(e) {
	var t = e.cy.container();
	return Se(t && t.style && t.style.backgroundColor || "white");
}
function yh(e, t) {
	var n = e._private.rscratch;
	return an(n, "labelWrapCachedLines", t) || [];
}
var bh = function(e, t) {
	return function(n) {
		var r = e(n), i = yh(n, t);
		return i.length > 1 ? i.map(function(e, t) {
			return `${r}_${t}`;
		}) : r;
	};
}, xh = function(e, t) {
	return function(n, r) {
		var i = e(n);
		if (typeof r == "string") {
			var a = r.indexOf("_");
			if (a > 0) {
				var o = Number(r.substring(a + 1)), s = yh(n, t), c = i.h / s.length, l = c * o, u = i.y1 + l;
				return {
					x1: i.x1,
					w: i.w,
					y1: u,
					h: c,
					yOffset: l
				};
			}
		}
		return i;
	};
};
function Sh(e) {
	var t = e.render;
	e.render = function(n) {
		n ||= {};
		var r = e.cy;
		e.webgl && (r.zoom() > gp ? (Ch(e), t.call(e, n)) : (wh(e), Nh(e, n, oh.SCREEN)));
	};
	var n = e.matchCanvasSize;
	e.matchCanvasSize = function(t) {
		n.call(e, t), e.pickingFrameBuffer.setFramebufferAttachmentSizes(e.canvasWidth, e.canvasHeight), e.pickingFrameBuffer.needsDraw = !0;
	}, e.findNearestElements = function(t, n, r, i) {
		return jh(e, t, n);
	};
	var r = e.invalidateCachedZSortedEles;
	e.invalidateCachedZSortedEles = function() {
		r.call(e), e.pickingFrameBuffer.needsDraw = !0;
	};
	var i = e.notify;
	e.notify = function(t, n) {
		i.call(e, t, n), t === "viewport" || t === "bounds" ? e.pickingFrameBuffer.needsDraw = !0 : t === "background" && e.drawing.invalidate(n, { type: "node-body" });
	};
}
function Ch(e) {
	var t = e.data.contexts[e.WEBGL];
	t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT);
}
function wh(e) {
	var t = function(t) {
		t.save(), t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.canvasWidth, e.canvasHeight), t.restore();
	};
	t(e.data.contexts[e.NODE]), t(e.data.contexts[e.DRAG]);
}
function Th(e) {
	var t = e.canvasWidth, n = e.canvasHeight, r = Dm(e), i = r.pan, a = r.zoom, o = Wm();
	qm(o, o, [i.x, i.y]), Ym(o, o, [a, a]);
	var s = Wm();
	Xm(s, t, n);
	var c = Wm();
	return Km(c, s, o), c;
}
function Eh(e, t) {
	var n = e.canvasWidth, r = e.canvasHeight, i = Dm(e), a = i.pan, o = i.zoom;
	t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, n, r), t.translate(a.x, a.y), t.scale(o, o);
}
function Dh(e, t) {
	e.drawSelectionRectangle(t, function(t) {
		return Eh(e, t);
	});
}
function Oh(e) {
	var t = e.data.contexts[e.NODE];
	t.save(), Eh(e, t), t.strokeStyle = "rgba(0, 0, 0, 0.3)", t.beginPath(), t.moveTo(-1e3, 0), t.lineTo(1e3, 0), t.stroke(), t.beginPath(), t.moveTo(0, -1e3), t.lineTo(0, 1e3), t.stroke(), t.restore();
}
function kh(e) {
	var t = function(t, n, r) {
		for (var i = t.atlasManager.getAtlasCollection(n), a = e.data.contexts[e.NODE], o = i.atlases, s = 0; s < o.length; s++) {
			var c = o[s].canvas;
			if (c) {
				var l = c.width, u = c.height, d = l * s, f = c.height * r, p = .4;
				a.save(), a.scale(p, p), a.drawImage(c, d, f), a.strokeStyle = "black", a.rect(d, f, l, u), a.stroke(), a.restore();
			}
		}
	}, n = 0;
	t(e.drawing, "node", n++), t(e.drawing, "label", n++);
}
function Ah(e, t, n, r, i) {
	var a, o, s, c, l = Dm(e), u = l.pan, d = l.zoom, f = S(km(e, u, d, t, n), 2), p = f[0], m = f[1], h = 6;
	if (a = p - h / 2, o = m - h / 2, s = h, c = h, s === 0 || c === 0) return [];
	var g = e.data.contexts[e.WEBGL];
	g.bindFramebuffer(g.FRAMEBUFFER, e.pickingFrameBuffer), e.pickingFrameBuffer.needsDraw && (g.viewport(0, 0, g.canvas.width, g.canvas.height), Nh(e, null, oh.PICKING), e.pickingFrameBuffer.needsDraw = !1);
	var _ = s * c, v = new Uint8Array(_ * 4);
	g.readPixels(a, o, s, c, g.RGBA, g.UNSIGNED_BYTE, v), g.bindFramebuffer(g.FRAMEBUFFER, null);
	for (var y = /* @__PURE__ */ new Set(), b = 0; b < _; b++) {
		var x = Pm(v.slice(b * 4, b * 4 + 4)) - 1;
		x >= 0 && y.add(x);
	}
	return y;
}
function jh(e, t, n) {
	var r = Ah(e, t, n), i = e.getCachedZSortedEles(), a, o, s = g(r), c;
	try {
		for (s.s(); !(c = s.n()).done;) {
			var l = i[c.value];
			if (!a && l.isNode() && (a = l), !o && l.isEdge() && (o = l), a && o) break;
		}
	} catch (e) {
		s.e(e);
	} finally {
		s.f();
	}
	return [a, o].filter(Boolean);
}
function Mh(e, t, n) {
	var r = e.drawing;
	t += 1, n.isNode() ? (r.drawNode(n, t, "node-underlay"), r.drawNode(n, t, "node-body"), r.drawTexture(n, t, "label"), r.drawNode(n, t, "node-overlay")) : (r.drawEdgeLine(n, t), r.drawEdgeArrow(n, t, "source"), r.drawEdgeArrow(n, t, "target"), r.drawTexture(n, t, "label"), r.drawTexture(n, t, "edge-source-label"), r.drawTexture(n, t, "edge-target-label"));
}
function Nh(e, t, n) {
	var r;
	e.webglDebug && (r = performance.now());
	var i = e.drawing, a = 0;
	if (n.screen && e.data.canvasNeedsRedraw[e.SELECT_BOX] && Dh(e, t), e.data.canvasNeedsRedraw[e.NODE] || n.picking) {
		var o = e.data.contexts[e.WEBGL];
		n.screen ? (o.clearColor(0, 0, 0, 0), o.enable(o.BLEND), o.blendFunc(o.ONE, o.ONE_MINUS_SRC_ALPHA)) : o.disable(o.BLEND), o.clear(o.COLOR_BUFFER_BIT | o.DEPTH_BUFFER_BIT), o.viewport(0, 0, o.canvas.width, o.canvas.height);
		var s = Th(e), c = e.getCachedZSortedEles();
		if (a = c.length, i.startFrame(s, n), n.screen) {
			for (var l = 0; l < c.nondrag.length; l++) Mh(e, l, c.nondrag[l]);
			for (var u = 0; u < c.drag.length; u++) Mh(e, u, c.drag[u]);
		} else if (n.picking) for (var d = 0; d < c.length; d++) Mh(e, d, c[d]);
		i.endFrame(), n.screen && e.webglDebugShowAtlases && (Oh(e), kh(e)), e.data.canvasNeedsRedraw[e.NODE] = !1, e.data.canvasNeedsRedraw[e.DRAG] = !1;
	}
	if (e.webglDebug) {
		var f = performance.now(), p = Math.ceil(f - r), m = i.getDebugInfo(), h = [
			`${a} elements`,
			`${m.totalInstances} instances`,
			`${m.batchCount} batches`,
			`${m.totalAtlases} atlases`,
			`${m.wrappedCount} wrapped textures`,
			`${m.simpleCount} simple shapes`
		].join(", ");
		console.log(`WebGL (${n.name}) - frame time ${p}ms`), console.log("Totals:"), console.log(`  ${h}`), console.log("Texture Atlases Used:");
		var _ = m.atlasInfo, v = g(_), y;
		try {
			for (v.s(); !(y = v.n()).done;) {
				var b = y.value;
				console.log(`  ${b.type}: ${b.keyCount} keys, ${b.atlasCount} atlases`);
			}
		} catch (e) {
			v.e(e);
		} finally {
			v.f();
		}
		console.log("");
	}
	e.data.gc && (console.log("Garbage Collect!"), e.data.gc = !1, i.gc());
}
var Ph = {};
Ph.drawPolygonPath = function(e, t, n, r, i, a) {
	var o = r / 2, s = i / 2;
	e.beginPath && e.beginPath(), e.moveTo(t + o * a[0], n + s * a[1]);
	for (var c = 1; c < a.length / 2; c++) e.lineTo(t + o * a[c * 2], n + s * a[c * 2 + 1]);
	e.closePath();
}, Ph.drawRoundPolygonPath = function(e, t, n, r, i, a, o) {
	o.forEach(function(t) {
		return Pf(e, t);
	}), e.closePath();
}, Ph.drawRoundRectanglePath = function(e, t, n, r, i, a) {
	var o = r / 2, s = i / 2, c = a === "auto" ? Vr(r, i) : Math.min(a, s, o);
	e.beginPath && e.beginPath(), e.moveTo(t, n - s), e.arcTo(t + o, n - s, t + o, n, c), e.arcTo(t + o, n + s, t, n + s, c), e.arcTo(t - o, n + s, t - o, n, c), e.arcTo(t - o, n - s, t, n - s, c), e.lineTo(t, n - s), e.closePath();
}, Ph.drawBottomRoundRectanglePath = function(e, t, n, r, i, a) {
	var o = r / 2, s = i / 2, c = a === "auto" ? Vr(r, i) : a;
	e.beginPath && e.beginPath(), e.moveTo(t, n - s), e.lineTo(t + o, n - s), e.lineTo(t + o, n), e.arcTo(t + o, n + s, t, n + s, c), e.arcTo(t - o, n + s, t - o, n, c), e.lineTo(t - o, n - s), e.lineTo(t, n - s), e.closePath();
}, Ph.drawCutRectanglePath = function(e, t, n, r, i, a, o) {
	var s = r / 2, c = i / 2, l = o === "auto" ? Ur() : o;
	e.beginPath && e.beginPath(), e.moveTo(t - s + l, n - c), e.lineTo(t + s - l, n - c), e.lineTo(t + s, n - c + l), e.lineTo(t + s, n + c - l), e.lineTo(t + s - l, n + c), e.lineTo(t - s + l, n + c), e.lineTo(t - s, n + c - l), e.lineTo(t - s, n - c + l), e.closePath();
}, Ph.drawBarrelPath = function(e, t, n, r, i) {
	var a = r / 2, o = i / 2, s = t - a, c = t + a, l = n - o, u = n + o, d = Gr(r, i), f = d.widthOffset, p = d.heightOffset, m = d.ctrlPtOffsetPct * f;
	e.beginPath && e.beginPath(), e.moveTo(s, l + p), e.lineTo(s, u - p), e.quadraticCurveTo(s + m, u, s + f, u), e.lineTo(c - f, u), e.quadraticCurveTo(c - m, u, c, u - p), e.lineTo(c, l + p), e.quadraticCurveTo(c - m, l, c - f, l), e.lineTo(s + f, l), e.quadraticCurveTo(s + m, l, s, l + p), e.closePath();
};
for (var Fh = Math.sin(0), Ih = Math.cos(0), Lh = {}, Rh = {}, zh = Math.PI / 40, Bh = 0 * Math.PI; Bh < 2 * Math.PI; Bh += zh) Lh[Bh] = Math.sin(Bh), Rh[Bh] = Math.cos(Bh);
Ph.drawEllipsePath = function(e, t, n, r, i) {
	if (e.beginPath && e.beginPath(), e.ellipse) e.ellipse(t, n, r / 2, i / 2, 0, 0, 2 * Math.PI);
	else for (var a, o, s = r / 2, c = i / 2, l = 0 * Math.PI; l < 2 * Math.PI; l += zh) a = t - s * Lh[l] * Fh + s * Rh[l] * Ih, o = n + c * Rh[l] * Fh + c * Lh[l] * Ih, l === 0 ? e.moveTo(a, o) : e.lineTo(a, o);
	e.closePath();
};
var Vh = {};
Vh.createBuffer = function(e, t) {
	var n = document.createElement("canvas");
	return n.width = e, n.height = t, [n, n.getContext("2d")];
}, Vh.bufferCanvasImage = function(e) {
	var t = this.cy, n = t.mutableElements().boundingBox(), r = this.findContainerClientCoords(), i = e.full ? Math.ceil(n.w) : r[2], a = e.full ? Math.ceil(n.h) : r[3], o = B(e.maxWidth) || B(e.maxHeight), s = this.getPixelRatio(), c = 1;
	if (e.scale !== void 0) i *= e.scale, a *= e.scale, c = e.scale;
	else if (o) {
		var l = Infinity, u = Infinity;
		B(e.maxWidth) && (l = c * e.maxWidth / i), B(e.maxHeight) && (u = c * e.maxHeight / a), c = Math.min(l, u), i *= c, a *= c;
	}
	o || (i *= s, a *= s, c *= s);
	var d = document.createElement("canvas");
	d.width = i, d.height = a, d.style.width = i + "px", d.style.height = a + "px";
	var f = d.getContext("2d");
	if (i > 0 && a > 0) {
		f.clearRect(0, 0, i, a), f.globalCompositeOperation = "source-over";
		var p = this.getCachedZSortedEles();
		if (e.full) f.translate(-n.x1 * c, -n.y1 * c), f.scale(c, c), this.drawElements(f, p), f.scale(1 / c, 1 / c), f.translate(n.x1 * c, n.y1 * c);
		else {
			var m = t.pan(), h = {
				x: m.x * c,
				y: m.y * c
			};
			c *= t.zoom(), f.translate(h.x, h.y), f.scale(c, c), this.drawElements(f, p), f.scale(1 / c, 1 / c), f.translate(-h.x, -h.y);
		}
		e.bg && (f.globalCompositeOperation = "destination-over", f.fillStyle = e.bg, f.rect(0, 0, i, a), f.fill());
	}
	return d;
};
function Hh(e, t) {
	for (var n = atob(e), r = new ArrayBuffer(n.length), i = new Uint8Array(r), a = 0; a < n.length; a++) i[a] = n.charCodeAt(a);
	return new Blob([r], { type: t });
}
function Uh(e) {
	var t = e.indexOf(",");
	return e.substr(t + 1);
}
function Wh(e, t, n) {
	var r = function() {
		return t.toDataURL(n, e.quality);
	};
	switch (e.output) {
		case "blob-promise": return new Sa(function(r, i) {
			try {
				t.toBlob(function(e) {
					e == null ? i(/* @__PURE__ */ Error("`canvas.toBlob()` sent a null value in its callback")) : r(e);
				}, n, e.quality);
			} catch (e) {
				i(e);
			}
		});
		case "blob": return Hh(Uh(r()), n);
		case "base64": return Uh(r());
		default: return r();
	}
}
Vh.png = function(e) {
	return Wh(e, this.bufferCanvasImage(e), "image/png");
}, Vh.jpg = function(e) {
	return Wh(e, this.bufferCanvasImage(e), "image/jpeg");
};
var Gh = {};
Gh.nodeShapeImpl = function(e, t, n, r, i, a, o, s) {
	switch (e) {
		case "ellipse": return this.drawEllipsePath(t, n, r, i, a);
		case "polygon": return this.drawPolygonPath(t, n, r, i, a, o);
		case "round-polygon": return this.drawRoundPolygonPath(t, n, r, i, a, o, s);
		case "roundrectangle":
		case "round-rectangle": return this.drawRoundRectanglePath(t, n, r, i, a, s);
		case "cutrectangle":
		case "cut-rectangle": return this.drawCutRectanglePath(t, n, r, i, a, o, s);
		case "bottomroundrectangle":
		case "bottom-round-rectangle": return this.drawBottomRoundRectanglePath(t, n, r, i, a, s);
		case "barrel": return this.drawBarrelPath(t, n, r, i, a);
	}
};
var Kh = Jh, qh = Jh.prototype;
qh.CANVAS_LAYERS = 3, qh.SELECT_BOX = 0, qh.DRAG = 1, qh.NODE = 2, qh.WEBGL = 3, qh.CANVAS_TYPES = [
	"2d",
	"2d",
	"2d",
	"webgl2"
], qh.BUFFER_COUNT = 3, qh.TEXTURE_BUFFER = 0, qh.MOTIONBLUR_BUFFER_NODE = 1, qh.MOTIONBLUR_BUFFER_DRAG = 2;
function Jh(e) {
	var t = this, n = t.cy.window().document;
	e.webgl && (qh.CANVAS_LAYERS = t.CANVAS_LAYERS = 4, console.log("webgl rendering enabled")), t.data = {
		canvases: Array(qh.CANVAS_LAYERS),
		contexts: Array(qh.CANVAS_LAYERS),
		canvasNeedsRedraw: Array(qh.CANVAS_LAYERS),
		bufferCanvases: Array(qh.BUFFER_COUNT),
		bufferContexts: Array(qh.CANVAS_LAYERS)
	};
	var r = "-webkit-tap-highlight-color", i = "rgba(0,0,0,0)";
	t.data.canvasContainer = n.createElement("div");
	var a = t.data.canvasContainer.style;
	t.data.canvasContainer.style[r] = i, a.position = "relative", a.zIndex = "0", a.overflow = "hidden";
	var o = e.cy.container();
	o.appendChild(t.data.canvasContainer), o.style[r] = i;
	var s = {
		"-webkit-user-select": "none",
		"-moz-user-select": "-moz-none",
		"user-select": "none",
		"-webkit-tap-highlight-color": "rgba(0,0,0,0)",
		"outline-style": "none"
	};
	re() && (s["-ms-touch-action"] = "none", s["touch-action"] = "none");
	for (var c = 0; c < qh.CANVAS_LAYERS; c++) {
		var l = t.data.canvases[c] = n.createElement("canvas"), u = qh.CANVAS_TYPES[c];
		t.data.contexts[c] = l.getContext(u), t.data.contexts[c] || Gt("Could not create canvas of type " + u), Object.keys(s).forEach(function(e) {
			l.style[e] = s[e];
		}), l.style.position = "absolute", l.setAttribute("data-id", "layer" + c), l.style.zIndex = String(qh.CANVAS_LAYERS - c), t.data.canvasContainer.appendChild(l), t.data.canvasNeedsRedraw[c] = !1;
	}
	t.data.topCanvas = t.data.canvases[0], t.data.canvases[qh.NODE].setAttribute("data-id", "layer" + qh.NODE + "-node"), t.data.canvases[qh.SELECT_BOX].setAttribute("data-id", "layer" + qh.SELECT_BOX + "-selectbox"), t.data.canvases[qh.DRAG].setAttribute("data-id", "layer" + qh.DRAG + "-drag"), t.data.canvases[qh.WEBGL] && t.data.canvases[qh.WEBGL].setAttribute("data-id", "layer" + qh.WEBGL + "-webgl");
	for (var c = 0; c < qh.BUFFER_COUNT; c++) t.data.bufferCanvases[c] = n.createElement("canvas"), t.data.bufferContexts[c] = t.data.bufferCanvases[c].getContext("2d"), t.data.bufferCanvases[c].style.position = "absolute", t.data.bufferCanvases[c].setAttribute("data-id", "buffer" + c), t.data.bufferCanvases[c].style.zIndex = String(-c - 1), t.data.bufferCanvases[c].style.visibility = "hidden";
	t.pathsEnabled = !0;
	var d = nr(), f = function(e) {
		return {
			x: (e.x1 + e.x2) / 2,
			y: (e.y1 + e.y2) / 2
		};
	}, p = function(e) {
		return {
			x: -e.w / 2,
			y: -e.h / 2
		};
	}, m = function(e) {
		var t = e[0]._private;
		return t.oldBackgroundTimestamp !== t.backgroundTimestamp;
	}, h = function(e) {
		return e[0]._private.nodeKey;
	}, g = function(e) {
		return e[0]._private.labelStyleKey;
	}, _ = function(e) {
		return e[0]._private.sourceLabelStyleKey;
	}, v = function(e) {
		return e[0]._private.targetLabelStyleKey;
	}, y = function(e, n, r, i, a) {
		return t.drawElement(e, n, r, !1, !1, a);
	}, b = function(e, n, r, i, a) {
		return t.drawElementText(e, n, r, i, "main", a);
	}, x = function(e, n, r, i, a) {
		return t.drawElementText(e, n, r, i, "source", a);
	}, S = function(e, n, r, i, a) {
		return t.drawElementText(e, n, r, i, "target", a);
	}, C = function(e) {
		return e.boundingBox(), e[0]._private.bodyBounds;
	}, w = function(e) {
		return e.boundingBox(), e[0]._private.labelBounds.main || d;
	}, T = function(e) {
		return e.boundingBox(), e[0]._private.labelBounds.source || d;
	}, E = function(e) {
		return e.boundingBox(), e[0]._private.labelBounds.target || d;
	}, D = function(e, t) {
		return t;
	}, O = function(e) {
		return f(C(e));
	}, k = function(e, t, n) {
		var r = e ? e + "-" : "";
		return {
			x: t.x + n.pstyle(r + "text-margin-x").pfValue,
			y: t.y + n.pstyle(r + "text-margin-y").pfValue
		};
	}, A = function(e, t, n) {
		var r = e[0]._private.rscratch;
		return {
			x: r[t],
			y: r[n]
		};
	}, j = function(e) {
		return k("", A(e, "labelX", "labelY"), e);
	}, M = function(e) {
		return k("source", A(e, "sourceLabelX", "sourceLabelY"), e);
	}, N = function(e) {
		return k("target", A(e, "targetLabelX", "targetLabelY"), e);
	}, P = function(e) {
		return p(C(e));
	}, F = function(e) {
		return p(T(e));
	}, I = function(e) {
		return p(E(e));
	}, L = function(e) {
		var t = w(e), n = p(w(e));
		if (e.isNode()) {
			switch (fl(e.pstyle("text-halign").value)) {
				case "left":
					n.x = -t.w - (t.leftPad || 0);
					break;
				case "right": n.x = -(t.rightPad || 0);
			}
			switch (pl(e.pstyle("text-valign").value)) {
				case "top":
					n.y = -t.h - (t.topPad || 0);
					break;
				case "bottom": n.y = -(t.botPad || 0);
			}
		}
		return n;
	}, R = t.data.eleTxrCache = new Mp(t, {
		getKey: h,
		doesEleInvalidateKey: m,
		drawElement: y,
		getBoundingBox: C,
		getRotationPoint: O,
		getRotationOffset: P,
		allowEdgeTxrCaching: !1,
		allowParentTxrCaching: !1
	}), z = t.data.lblTxrCache = new Mp(t, {
		getKey: g,
		drawElement: b,
		getBoundingBox: w,
		getRotationPoint: j,
		getRotationOffset: L,
		isVisible: D
	}), B = t.data.slbTxrCache = new Mp(t, {
		getKey: _,
		drawElement: x,
		getBoundingBox: T,
		getRotationPoint: M,
		getRotationOffset: F,
		isVisible: D
	}), V = t.data.tlbTxrCache = new Mp(t, {
		getKey: v,
		drawElement: S,
		getBoundingBox: E,
		getRotationPoint: N,
		getRotationOffset: I,
		isVisible: D
	}), H = t.data.lyrTxrCache = new Yp(t);
	t.onUpdateEleCalcs(function(e, t) {
		R.invalidateElements(t), z.invalidateElements(t), B.invalidateElements(t), V.invalidateElements(t), H.invalidateElements(t);
		for (var n = 0; n < t.length; n++) {
			var r = t[n]._private;
			r.oldBackgroundTimestamp = r.backgroundTimestamp;
		}
	});
	var U = function(e) {
		for (var t = 0; t < e.length; t++) H.enqueueElementRefinement(e[t].ele);
	};
	R.onDequeue(U), z.onDequeue(U), B.onDequeue(U), V.onDequeue(U), e.webgl && t.initWebgl(e, {
		getStyleKey: h,
		getLabelKey: g,
		getSourceLabelKey: _,
		getTargetLabelKey: v,
		drawElement: y,
		drawLabel: b,
		drawSourceLabel: x,
		drawTargetLabel: S,
		getElementBox: C,
		getLabelBox: w,
		getSourceLabelBox: T,
		getTargetLabelBox: E,
		getElementRotationPoint: O,
		getElementRotationOffset: P,
		getLabelRotationPoint: j,
		getSourceLabelRotationPoint: M,
		getTargetLabelRotationPoint: N,
		getLabelRotationOffset: L,
		getSourceLabelRotationOffset: F,
		getTargetLabelRotationOffset: I
	});
}
qh.redrawHint = function(e, t) {
	var n = this;
	switch (e) {
		case "eles":
			n.data.canvasNeedsRedraw[qh.NODE] = t;
			break;
		case "drag":
			n.data.canvasNeedsRedraw[qh.DRAG] = t;
			break;
		case "select":
			n.data.canvasNeedsRedraw[qh.SELECT_BOX] = t;
			break;
		case "gc": n.data.gc = !0;
	}
};
var Yh = typeof Path2D < "u";
qh.path2dEnabled = function(e) {
	if (e === void 0) return this.pathsEnabled;
	this.pathsEnabled = !!e;
}, qh.usePaths = function() {
	return Yh && this.pathsEnabled;
}, qh.setImgSmoothing = function(e, t) {
	e.imageSmoothingEnabled == null ? (e.webkitImageSmoothingEnabled = t, e.mozImageSmoothingEnabled = t, e.msImageSmoothingEnabled = t) : e.imageSmoothingEnabled = t;
}, qh.getImgSmoothing = function(e) {
	return e.imageSmoothingEnabled == null ? e.webkitImageSmoothingEnabled || e.mozImageSmoothingEnabled || e.msImageSmoothingEnabled : e.imageSmoothingEnabled;
}, qh.makeOffscreenCanvas = function(e, t) {
	var n;
	return (typeof OffscreenCanvas > "u" ? "undefined" : E(OffscreenCanvas)) === "undefined" ? (n = this.cy.window().document.createElement("canvas"), n.width = e, n.height = t) : n = new OffscreenCanvas(e, t), n;
}, [
	$p,
	om,
	pm,
	hm,
	gm,
	ym,
	xm,
	_h,
	Ph,
	Vh,
	Gh
].forEach(function(e) {
	Z(qh, e);
});
var Xh = [{
	type: "layout",
	extensions: af
}, {
	type: "renderer",
	extensions: [
		{
			name: "null",
			impl: of
		},
		{
			name: "base",
			impl: sp
		},
		{
			name: "canvas",
			impl: Kh
		}
	]
}], Zh = {}, Qh = {};
function $h(e, t, n) {
	var r = n, i = function(n) {
		qt("Can not register `" + t + "` for `" + e + "` since `" + n + "` already exists in the prototype and can not be overridden");
	};
	if (e === "core") {
		if (gd.prototype[t]) return i(t);
		gd.prototype[t] = n;
	} else if (e === "collection") {
		if (Au.prototype[t]) return i(t);
		Au.prototype[t] = n;
	} else if (e === "layout") {
		for (var a = function(e) {
			this.options = e, n.call(this, e), R(this._private) || (this._private = {}), this._private.cy = e.cy, this._private.listeners = [], this.createEmitter();
		}, o = a.prototype = Object.create(n.prototype), s = [], c = 0; c < s.length; c++) {
			var l = s[c];
			o[l] = o[l] || function() {
				return this;
			};
		}
		o.start && !o.run ? o.run = function() {
			return this.start(), this;
		} : !o.start && o.run && (o.start = function() {
			return this.run(), this;
		});
		var u = n.prototype.stop;
		o.stop = function() {
			var e = this.options;
			if (e && e.animate) {
				var t = this.animations;
				if (t) for (var n = 0; n < t.length; n++) t[n].stop();
			}
			return u ? u.call(this) : this.emit("layoutstop"), this;
		}, o.destroy ||= function() {
			return this;
		}, o.cy = function() {
			return this._private.cy;
		};
		var d = function(e) {
			return e._private.cy;
		}, f = {
			addEventFields: function(e, t) {
				t.layout = e, t.cy = d(e), t.target = e;
			},
			bubble: function() {
				return !0;
			},
			parent: function(e) {
				return d(e);
			}
		};
		Z(o, {
			createEmitter: function() {
				return this._private.emitter = new Ql(f, this), this;
			},
			emitter: function() {
				return this._private.emitter;
			},
			on: function(e, t) {
				return this.emitter().on(e, t), this;
			},
			one: function(e, t) {
				return this.emitter().one(e, t), this;
			},
			once: function(e, t) {
				return this.emitter().one(e, t), this;
			},
			removeListener: function(e, t) {
				return this.emitter().removeListener(e, t), this;
			},
			removeAllListeners: function() {
				return this.emitter().removeAllListeners(), this;
			},
			emit: function(e, t) {
				return this.emitter().emit(e, t), this;
			}
		}), Cc.eventAliasesOn(o), r = a;
	} else if (e === "renderer" && t !== "null" && t !== "base") {
		var p = eg("renderer", "base"), m = p.prototype, h = n, g = n.prototype, _ = function() {
			p.apply(this, arguments), h.apply(this, arguments);
		}, v = _.prototype;
		for (var y in m) {
			var b = m[y];
			if (g[y] != null) return i(y);
			v[y] = b;
		}
		for (var x in g) v[x] = g[x];
		m.clientFunctions.forEach(function(e) {
			v[e] = v[e] || function() {
				Gt("Renderer does not implement `renderer." + e + "()` on its prototype");
			};
		}), r = _;
	} else if (e === "__proto__" || e === "constructor" || e === "prototype") return Gt(e + " is an illegal type to be registered, possibly lead to prototype pollutions");
	return we({
		map: Zh,
		keys: [e, t],
		value: r
	});
}
function eg(e, t) {
	return Te({
		map: Zh,
		keys: [e, t]
	});
}
function tg(e, t, n, r, i) {
	return we({
		map: Qh,
		keys: [
			e,
			t,
			n,
			r
		],
		value: i
	});
}
function ng(e, t, n, r) {
	return Te({
		map: Qh,
		keys: [
			e,
			t,
			n,
			r
		]
	});
}
var rg = function() {
	if (arguments.length === 2) return eg.apply(null, arguments);
	if (arguments.length === 3) return $h.apply(null, arguments);
	if (arguments.length === 4) return ng.apply(null, arguments);
	if (arguments.length === 5) return tg.apply(null, arguments);
	Gt("Invalid extension access syntax");
};
gd.prototype.extension = rg, Xh.forEach(function(e) {
	e.extensions.forEach(function(t) {
		$h(e.type, t.name, t.impl);
	});
});
var ig = function() {
	if (!(this instanceof ig)) return new ig();
	this.length = 0;
}, ag = ig.prototype;
ag.instanceString = function() {
	return "stylesheet";
}, ag.selector = function(e) {
	var t = this.length++;
	return this[t] = {
		selector: e,
		properties: []
	}, this;
}, ag.css = function(e, t) {
	var n = this.length - 1;
	if (F(e)) this[n].properties.push({
		name: e,
		value: t
	});
	else if (R(e)) for (var r = e, i = Object.keys(r), a = 0; a < i.length; a++) {
		var o = i[a], s = r[o];
		if (s != null) {
			var c = ud.properties[o] || ud.properties[oe(o)];
			if (c != null) {
				var l = c.name, u = s;
				this[n].properties.push({
					name: l,
					value: u
				});
			}
		}
	}
	return this;
}, ag.style = ag.css, ag.generateStyle = function(e) {
	var t = new ud(e);
	return this.appendToStyle(t);
}, ag.appendToStyle = function(e) {
	for (var t = 0; t < this.length; t++) {
		var n = this[t], r = n.selector, i = n.properties;
		e.selector(r);
		for (var a = 0; a < i.length; a++) {
			var o = i[a];
			e.css(o.name, o.value);
		}
	}
	return e;
};
var og = "3.34.3", sg = function(e) {
	if (e === void 0 && (e = {}), R(e)) return new gd(e);
	if (F(e)) return rg.apply(rg, arguments);
};
sg.use = function(e) {
	var t = Array.prototype.slice.call(arguments, 1);
	return t.unshift(sg), e.apply(null, t), this;
}, sg.warnings = function(e) {
	return Kt(e);
}, sg.version = og, sg.stylesheet = sg.Stylesheet = ig;
//#endregion
//#region frontend/topology.ts
var cg = /^(?<site>.+?\d)(?<role>agg|er)(?<number>\d+)$/;
function lg(e, t) {
	let n = e.toLowerCase().split(".")[0];
	for (let e of t) if (n.startsWith(e)) {
		n = n.slice(e.length);
		break;
	}
	return cg.exec(n)?.groups;
}
function ug(e) {
	return typeof e.displayName == "string" && e.displayName.trim() !== "" ? e.displayName.trim() : e.hostname;
}
function dg(e, t) {
	let n = t.prefixes.filter((e) => typeof e == "string" && e !== "").map((e) => e.toLowerCase()).sort((e, t) => t.length - e.length), r = lg(e.hostname, n) ?? (typeof e.sysName == "string" ? lg(e.sysName, n) : void 0), i = t.overrides[e.id], a = typeof i?.role == "string" ? i.role : r?.role ?? "other", o = typeof i?.site == "string" ? i.site : r?.site ?? "Unclassified";
	return {
		role: a.toUpperCase(),
		site: o
	};
}
var fg = (e, t) => JSON.stringify([e, t]);
function pg(e, t) {
	let n = /* @__PURE__ */ new Map(), r = (e, t, r) => {
		let i = n.get(e), a = i && fg(i.source, i.sourcePortId) <= fg(i.target, i.targetPortId);
		(!i || r && !a || r === a && (t.sampledAt ?? 0) > (i.sampledAt ?? 0)) && n.set(e, {
			...t,
			id: e
		});
	}, i = (e) => {
		let t = [[e.source, e.sourcePortId], [e.target, e.targetPortId]], n = JSON.stringify(t[0]) > JSON.stringify(t[1]);
		return {
			key: JSON.stringify(n ? t.reverse() : t),
			canonical: !n
		};
	}, a = [];
	for (let n of e) {
		if (!t.has(n.source) || !t.has(n.target)) continue;
		if (!n.sourcePortId || !n.targetPortId) {
			a.push(n);
			continue;
		}
		let { key: e, canonical: o } = i(n);
		r(e, n, o);
	}
	let o = new Set([...n.values()].flatMap((e) => [fg(e.source, e.sourcePortId), fg(e.target, e.targetPortId)])), s = /* @__PURE__ */ new Map();
	for (let e of a) {
		if (e.sourcePortId && o.has(fg(e.source, e.sourcePortId))) continue;
		let t = JSON.stringify([e.source, e.target].sort());
		s.set(t, [...s.get(t) ?? [], e]);
	}
	for (let e of s.values()) {
		let t = e.filter((e) => e.source < e.target), a = e.filter((e) => e.source > e.target);
		if (t.length === 1 && a.length === 1 && t[0].sourcePortId && a[0].sourcePortId) {
			let [e, n] = [t[0], a[0]], o = {
				...e,
				targetPortId: n.sourcePortId,
				targetPort: n.sourcePort
			}, { key: s, canonical: c } = i(o);
			r(s, o, c);
			continue;
		}
		for (let t of e) n.set(`unresolved:${t.id}`, {
			...t,
			id: `unresolved:${t.id}`
		});
	}
	return [...n.values()].sort((e, t) => e.id.localeCompare(t.id));
}
function mg(e) {
	let t = e.devices.map((t) => ({
		...t,
		...dg(t, e.config),
		tier: -1,
		reachable: !1
	})), n = new Map(t.map((e) => [e.id, e])), r = (Array.isArray(e.deviceGroups) ? e.deviceGroups : []).flatMap((e) => {
		if (!e || typeof e.id != "string" || !/^[1-9]\d{0,9}$/.test(e.id) || typeof e.name != "string" || e.name.trim() === "" || !Array.isArray(e.deviceIds)) return [];
		let t = [...new Set(e.deviceIds.filter((e) => typeof e == "string" && n.has(e)))];
		return t.length ? [{
			id: e.id,
			name: e.name,
			deviceIds: t
		}] : [];
	}).sort((e, t) => e.name.localeCompare(t.name, void 0, { numeric: !0 }) || e.id.localeCompare(t.id)), i = pg(e.links, new Set(n.keys())), a = new Map(t.map((e) => [e.id, /* @__PURE__ */ new Set()]));
	for (let e of i) a.get(e.source).add(e.target), a.get(e.target).add(e.source);
	let o = t.filter((e) => e.role === "AGG");
	for (let e of o) e.tier = 0, e.reachable = !0;
	for (let e = 0; e < o.length; e++) for (let t of a.get(o[e].id)) {
		let r = n.get(t);
		r.tier < 0 && (r.tier = o[e].tier + 1, r.reachable = !0, o.push(r));
	}
	let s = Math.max(0, ...t.map((e) => e.tier)) + 1;
	for (let e of t) e.tier < 0 && (e.tier = s);
	return t.sort((e, t) => e.tier - t.tier || e.site.localeCompare(t.site) || ug(e).localeCompare(ug(t), void 0, { numeric: !0 })), {
		nodes: t,
		links: i,
		deviceGroups: r
	};
}
function hg(e) {
	let t = new Map(e.nodes.map((e) => [e.id, e.tier])), n = /* @__PURE__ */ new Map();
	for (let r of e.links) {
		if (t.get(r.source) !== t.get(r.target)) continue;
		let e = JSON.stringify([r.source, r.target].sort()), i = n.get(e) ?? [];
		i.push(r), n.set(e, i);
	}
	let r = /* @__PURE__ */ new Map();
	for (let e of n.values()) e.sort((e, t) => e.id.localeCompare(t.id)).forEach((e, t) => {
		r.set(e.id, (-80 - t * 90) * (e.source <= e.target ? 1 : -1));
	});
	return r;
}
var gg = {
	normal: "#6485b6",
	warning: "#cb9a28",
	high: "#e03131"
};
function _g(e, t, n) {
	if (e.status === "down") return {
		label: "DOWN",
		color: "#e05b65",
		state: "down",
		utilization: null
	};
	if (e.status === "disabled") return {
		label: "DISABLED",
		color: "#8a96a9",
		state: "unknown",
		utilization: null
	};
	if (e.sampledAt === null || t - e.sampledAt > n || e.sampledAt > t + 60) return {
		label: "STALE",
		color: "#8a96a9",
		state: "stale",
		utilization: null
	};
	if (e.status !== "up" || !e.speedBps || e.speedBps <= 0 || e.inBps === null || e.outBps === null || e.inBps < 0 || e.outBps < 0 || ![
		e.speedBps,
		e.inBps,
		e.outBps
	].every(Number.isFinite)) return {
		label: "N/A",
		color: "#8a96a9",
		state: "unknown",
		utilization: null
	};
	let r = Math.max(e.inBps, e.outBps) / e.speedBps * 100, i = Math.round(r);
	return {
		label: `${i}%`,
		color: i > 70 ? gg.high : i >= 50 ? gg.warning : gg.normal,
		state: "up",
		utilization: r
	};
}
//#endregion
//#region frontend/canvas-style.ts
function vg(e) {
	return e === null || !Number.isFinite(e) ? "N/A" : e >= 1e9 ? `${(e / 1e9).toFixed(2)} Gbps` : e >= 1e6 ? `${(e / 1e6).toFixed(1)} Mbps` : `${Math.round(e / 1e3)} Kbps`;
}
var yg = (e) => e === "down" ? "#e05b65" : e === "up" ? "#36b89a" : "#8a96a9", bg = (e) => {
	let t = getComputedStyle(e), n = (e, n) => t.getPropertyValue(e).trim() || n;
	return {
		color: n,
		panel: n("--panel", "#ffffff"),
		ink: n("--ink", "#20324b"),
		line: n("--line", "#e4eaf2"),
		muted: n("--muted", "#7a889c"),
		accent: n("--accent", "#246b89")
	};
};
function xg(e) {
	let { color: t, panel: n, ink: r, line: i } = bg(e);
	return [
		{
			selector: "node",
			style: {
				shape: "round-rectangle",
				width: "data(width)",
				height: 72,
				"background-color": n,
				"border-width": 1.5,
				"border-color": "data(color)",
				label: "data(label)",
				color: r,
				"font-family": "Inter, Segoe UI, sans-serif",
				"font-size": 18,
				"font-weight": 500,
				"text-wrap": "wrap",
				"text-valign": "center",
				"text-halign": "center",
				"line-height": 1.6
			}
		},
		{
			selector: "node[role = \"AGG\"]",
			style: {
				height: 82,
				"border-width": 2.5,
				"background-color": t("--node-agg", "#eef5ff"),
				"font-weight": 700
			}
		},
		{
			selector: "edge",
			style: {
				width: 2.4,
				"curve-style": "bezier",
				"control-point-step-size": 90,
				"line-color": "data(color)",
				label: "data(label)",
				"font-size": 15,
				"font-weight": 600,
				color: t("--edge-ink", "#4d6077"),
				"text-background-color": n,
				"text-background-opacity": 1,
				"text-background-padding": "4px",
				"text-background-shape": "roundrectangle",
				"text-border-width": 1,
				"text-border-opacity": 1,
				"text-border-color": i,
				"text-rotation": "none",
				"text-events": "yes"
			}
		},
		{
			selector: "edge[lateral = 1]",
			style: {
				"curve-style": "unbundled-bezier",
				"control-point-distances": "data(curveDistance)",
				"control-point-weights": [.5]
			}
		},
		{
			selector: "edge[state = \"down\"], edge[state = \"stale\"], edge[state = \"unknown\"]",
			style: { "line-style": "dashed" }
		},
		{
			selector: ":selected",
			style: {
				"overlay-color": "#55a7ce",
				"overlay-opacity": .12,
				"overlay-padding": 7
			}
		},
		{
			selector: ".lm-dim",
			style: { opacity: .18 }
		},
		{
			selector: ".lm-no-label",
			style: { label: "" }
		}
	];
}
function Sg(e) {
	let { ink: t, muted: n, accent: r } = bg(e);
	return [
		...xg(e),
		{
			selector: "node, edge",
			style: { "z-index-compare": "manual" }
		},
		{
			selector: "edge",
			style: { "z-index": 4 }
		},
		{
			selector: "node[kind = \"device\"]",
			style: { "z-index": 10 }
		},
		{
			selector: "node[kind = \"box\"]",
			style: {
				height: "data(height)",
				"background-color": r,
				"background-opacity": .05,
				"border-width": 1.5,
				"border-style": "dashed",
				"border-color": n,
				color: n,
				"font-size": 16,
				"font-weight": 600,
				"text-valign": "top",
				"text-halign": "center",
				"text-margin-y": 30,
				"text-max-width": "data(width)",
				"z-index": 0
			}
		},
		{
			selector: "node[kind = \"text\"]",
			style: {
				shape: "rectangle",
				height: "data(height)",
				"background-opacity": 0,
				"border-width": 0,
				color: t,
				"font-size": 18,
				"font-weight": 600,
				"text-max-width": "data(width)",
				"z-index": 5
			}
		},
		{
			selector: "edge[state = \"drawn\"]",
			style: {
				"line-style": "dotted",
				"line-color": n,
				width: 2.4
			}
		},
		{
			selector: ".lm-connect-source",
			style: {
				"border-width": 3.5,
				"border-color": "#299e9b"
			}
		}
	];
}
function Cg(e, t) {
	let n = e.dataset.hostTheme === "true", r = window.matchMedia("(prefers-color-scheme: dark)"), i, a = "";
	function o() {
		let o = n ? document.documentElement.classList.contains("dark") : i ?? r.matches, s = n ? getComputedStyle(document.body).backgroundColor : "", c = `${o}|${s}`;
		c !== a && (a = c, e.classList.toggle("lm-dark", o), /^rgb\(/.test(s) ? e.style.setProperty("--bg", s) : e.style.removeProperty("--bg"), t());
	}
	return o(), n ? new MutationObserver(o).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["class"]
	}) : r.addEventListener("change", o), { toggle() {
		i = !e.classList.contains("lm-dark"), o();
	} };
}
//#endregion
//#region frontend/canvas-tools.ts
var wg = 2, Tg = 8e3;
async function Eg(e, t, n) {
	if (!e.elements(":visible").length) throw Error("There is nothing on the map to export.");
	let r = getComputedStyle(t).getPropertyValue("--bg").trim() || "#ffffff", i = await e.png({
		output: "blob-promise",
		full: !0,
		scale: wg,
		maxWidth: Tg,
		maxHeight: Tg,
		bg: r
	}), a = URL.createObjectURL(i);
	try {
		let e = document.createElement("a");
		e.href = a, e.download = `${Dg(n)}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.png`, document.body.append(e), e.click(), e.remove();
	} finally {
		setTimeout(() => URL.revokeObjectURL(a), 1e3);
	}
}
function Dg(e) {
	return e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "libremap";
}
function Og(e, t) {
	let n = e.target;
	return e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented || n && (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || n.isContentEditable) ? !1 : !t.querySelector("dialog[open]");
}
function kg(e, t) {
	e.zoom({
		level: e.zoom() * t,
		renderedPosition: {
			x: e.width() / 2,
			y: e.height() / 2
		}
	});
}
function Ag(e, t, n, r) {
	let i = e.zoom(), a = e.pan(), o = r;
	for (; o * i < 10;) o *= 5;
	let s = o * i;
	t.style.backgroundSize = `${s}px ${s}px`, t.style.backgroundPosition = `${n.offsetLeft + a.x - s / 2}px ${n.offsetTop + a.y - s / 2}px`;
}
//#endregion
//#region frontend/page-nav.ts
var jg = [
	[
		"topology",
		"Topology map",
		"topologyUrl"
	],
	[
		"world",
		"World map",
		"worldUrl"
	],
	[
		"custom",
		"Custom maps",
		"customUrl"
	]
];
function Mg(e, t, n) {
	let r = jg.filter(([e, , r]) => e === n || t.dataset[r]);
	if (e.replaceChildren(), e.hidden = r.length < 2, !e.hidden) for (let [i, a, o] of r) {
		if (i === n) {
			let t = document.createElement("span");
			t.textContent = a, t.setAttribute("aria-current", "page"), e.append(t);
			continue;
		}
		let r = t.dataset[o];
		if (new URL(r, location.href).origin !== location.origin) continue;
		let s = document.createElement("a");
		s.href = r, s.textContent = a, e.append(s);
	}
}
//#endregion
//#region frontend/custom-map-document.ts
var Ng = {
	devices: 500,
	links: 2e3,
	shapes: 200,
	text: 200,
	label: 100
}, Pg = 5e3, Fg = {
	text: {
		width: 220,
		height: 48
	},
	box: {
		width: 520,
		height: 320
	}
}, Ig = /^[a-z]-[a-z0-9]{1,32}$/, Lg = /^[1-9]\d{0,9}$/, Rg = (e) => !!e && typeof e == "object" && !Array.isArray(e), zg = (e) => typeof e == "number" && Number.isFinite(e) && Math.abs(e) <= 1e6, Bg = (e) => typeof e == "number" && Number.isFinite(e) && e >= 20 && e <= 5e3, Vg = (e, t) => typeof e == "string" ? Array.from(e).slice(0, t).join("") : "", Hg = () => ({
	devices: [],
	shapes: [],
	links: [],
	zoom: 1,
	pan: {
		x: 0,
		y: 0
	}
});
function Ug(e) {
	let t = Hg();
	if (!Rg(e)) return t;
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = (e) => typeof e == "string" && Ig.test(e) && !n.has(e);
	if (Array.isArray(e.devices)) for (let a of e.devices) {
		if (t.devices.length >= Ng.devices) break;
		Rg(a) && i(a.key) && typeof a.deviceId == "string" && Lg.test(a.deviceId) && !r.has(a.deviceId) && zg(a.x) && zg(a.y) && (n.add(a.key), r.add(a.deviceId), t.devices.push({
			key: a.key,
			deviceId: a.deviceId,
			x: a.x,
			y: a.y
		}));
	}
	if (Array.isArray(e.shapes)) for (let r of e.shapes) {
		if (t.shapes.length >= Ng.shapes) break;
		Rg(r) && i(r.key) && (r.kind === "text" || r.kind === "box") && zg(r.x) && zg(r.y) && Bg(r.width) && Bg(r.height) && (n.add(r.key), t.shapes.push({
			key: r.key,
			kind: r.kind,
			x: r.x,
			y: r.y,
			width: r.width,
			height: r.height,
			text: Vg(r.text, Ng.text)
		}));
	}
	let a = new Set(t.devices.map((e) => e.key));
	if (Array.isArray(e.links)) for (let r of e.links) {
		if (t.links.length >= Ng.links) break;
		Rg(r) && i(r.key) && typeof r.source == "string" && typeof r.target == "string" && r.source !== r.target && a.has(r.source) && a.has(r.target) && (n.add(r.key), t.links.push({
			key: r.key,
			source: r.source,
			target: r.target,
			label: Vg(r.label, Ng.label),
			portId: typeof r.portId == "string" && Lg.test(r.portId) ? r.portId : null
		}));
	}
	return typeof e.zoom == "number" && Number.isFinite(e.zoom) && (t.zoom = Math.min(2.5, Math.max(.15, e.zoom))), Rg(e.pan) && zg(e.pan.x) && zg(e.pan.y) && (t.pan = {
		x: e.pan.x,
		y: e.pan.y
	}), t;
}
function Wg(e) {
	return `${e}-${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12))].map((e) => (e % 36).toString(36)).join("")}`;
}
var Gg = (e) => ({
	x: Math.max(-1e6, Math.min(1e6, e.x)),
	y: Math.max(-1e6, Math.min(1e6, e.y))
});
function Kg(e, t, n) {
	if (!Lg.test(t)) return "Choose a device from the list.";
	if (e.devices.some((e) => e.deviceId === t)) return "That device is already on this map.";
	if (e.devices.length >= Ng.devices) return `A map can hold up to ${Ng.devices} devices.`;
	let r = {
		key: Wg("d"),
		deviceId: t,
		...Gg(n)
	};
	return e.devices.push(r), r;
}
function qg(e, t, n) {
	if (e.shapes.length >= Ng.shapes) return `A map can hold up to ${Ng.shapes} text labels and areas.`;
	let r = {
		key: Wg("s"),
		kind: t,
		...Gg(n),
		...Fg[t],
		text: t === "text" ? "Label" : "Area"
	};
	return e.shapes.push(r), r;
}
function Jg(e, t, n) {
	let r = new Set(e.devices.map((e) => e.key));
	if (t === n || !r.has(t) || !r.has(n)) return "A line must join two different devices.";
	if (e.links.length >= Ng.links) return `A map can hold up to ${Ng.links} lines.`;
	let i = {
		key: Wg("l"),
		source: t,
		target: n,
		label: "",
		portId: null
	};
	return e.links.push(i), i;
}
function Yg(e, t) {
	let n = e.devices.length + e.shapes.length + e.links.length;
	return e.devices = e.devices.filter((e) => e.key !== t), e.shapes = e.shapes.filter((e) => e.key !== t), e.links = e.links.filter((e) => e.key !== t && e.source !== t && e.target !== t), e.devices.length + e.shapes.length + e.links.length !== n;
}
var Xg = (e) => Math.round(Math.min(Pg, Math.max(20, Number.isFinite(e) ? e : 20))), Zg = class extends Error {
	status;
	constructor(e, t = 0) {
		super(e), this.status = t;
	}
}, Qg = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function $g(e, t, n) {
	let r = new URL(e, location.href), i = new URL(t, location.href);
	if (r.origin !== location.origin || i.origin !== location.origin) throw Error("Custom maps must use the same origin.");
	let a = (e, ...t) => new URL(`${e.href.replace(/\/$/, "")}/${t.map(encodeURIComponent).join("/")}`);
	async function o(e, t, r) {
		let i = {
			Accept: "application/json",
			"X-CSRF-TOKEN": n
		};
		r !== void 0 && (i["Content-Type"] = "application/json");
		let a = await fetch(t, {
			method: e,
			credentials: "same-origin",
			headers: i,
			body: r === void 0 ? void 0 : JSON.stringify(r),
			signal: AbortSignal.timeout(2e4)
		});
		if (!a.ok) throw new Zg(await e_(a), a.status);
		return a.status === 204 ? void 0 : a.json();
	}
	let s = (e) => {
		if (!Qg(e) || !Qg(e.map) || !Qg(e.live) || typeof e.map.id != "string") throw new Zg("Unexpected custom map response.");
		return e;
	}, c = (e, t) => {
		if (!Qg(e) || !Array.isArray(e[t])) throw new Zg("Unexpected custom map response.");
		return e[t];
	};
	return {
		list: async () => c(await o("GET", r), "maps"),
		load: async (e) => s(await o("GET", a(r, e))),
		create: async (e, t, n) => s(await o("POST", r, {
			name: e,
			shared: t,
			document: n
		})),
		update: async (e, t, n, i) => s(await o("PUT", a(r, e.id), {
			name: t,
			shared: n,
			document: i,
			revision: e.revision
		})),
		remove: async (e) => {
			let t = a(r, e.id);
			t.searchParams.set("revision", String(e.revision)), await o("DELETE", t);
		},
		devices: async () => c(await o("GET", i), "devices"),
		ports: async (e) => c(await o("GET", a(i, e, "ports")), "ports")
	};
}
async function e_(e) {
	if (e.status === 422) {
		let t = await e.json().catch(() => void 0), n = Qg(t) && typeof t.message == "string" ? t.message.trim() : "";
		if (n && n.length <= 300) return n;
	}
	return {
		401: "Your session has expired. Sign in and reload.",
		403: "You no longer have access to custom maps.",
		404: "This map is no longer available. It may have been deleted or unshared.",
		409: "This map changed in another session. Reload it before saving again.",
		419: "Your session has expired. Reload the page before saving.",
		422: "The map could not be saved. Check its name, devices and size.",
		429: "Too many requests. Wait a moment and try again.",
		503: "Custom maps are unavailable. The plugin database migration may be pending."
	}[e.status] ?? `Custom map request failed (HTTP ${e.status}).`;
}
var t_ = 1e5, n_ = (e) => Array.from(e).length, r_ = (e) => Array.from(e).slice(0, 200).join(""), i_ = 100, a_ = 20, o_ = 100;
function s_(e) {
	e.innerHTML = `
    <div class="lm-shell lm-custom">
      <header class="lm-header"><div class="lm-brand"><span class="lm-logo">◈</span><div><strong>LibreMap</strong><span>CUSTOM MAPS</span></div></div><div class="lm-header-right"><nav class="lm-pages" aria-label="LibreMap pages" hidden></nav><a class="lm-back" href="/">LibreNMS ↗</a></div></header>
      <div class="lm-toolbar">
        <label class="lm-select">Map <select aria-label="Custom map"></select></label>
        <button data-cm="new">New map</button><button data-cm="rename">Rename</button><button data-cm="share" aria-pressed="false">Share read-only</button><button data-cm="delete">Delete</button>
        <span class="lm-spacer"></span>
        <button data-cm="export" title="Download this map as an image">Export PNG</button>
        <button data-cm="edit" aria-pressed="false">Edit</button><button data-cm="save">Save</button><button data-cm="discard">Discard changes</button>
      </div>
      <div class="lm-viewbar lm-editbar" hidden>
        <label class="lm-select">Device <input class="lm-cm-device" list="lm-cm-devices" aria-label="Device to add" placeholder="Search devices…" autocomplete="off"></label><datalist id="lm-cm-devices"></datalist>
        <button data-cm="add-device">Add device</button><button data-cm="add-text">Add text</button><button data-cm="add-box">Add area</button>
        <button data-cm="connect" aria-pressed="false">Draw line</button><button data-cm="remove">Remove selected</button>
        <span class="lm-spacer"></span>
        <button data-cm="undo" title="Undo (Ctrl+Z)">↶ Undo</button><button data-cm="redo" title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
      </div>
      <div class="lm-notice" role="status" aria-live="polite">Loading custom maps…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap"><div class="lm-canvas-caption"><span class="lm-live-dot"></span><strong class="lm-cm-title">Custom maps</strong><span class="lm-cm-meta"></span></div><div class="lm-canvas" aria-label="Custom network map"></div><div class="lm-empty"></div><div class="lm-map-controls"><button data-cm="zoom-in" aria-label="Zoom in">+</button><button data-cm="zoom-out" aria-label="Zoom out">−</button><button data-cm="fit">Fit</button></div><div class="lm-legend"><span><i style="color:${gg.normal}"></i>&lt;50%</span><span><i style="color:${gg.warning}"></i>50–70%</span><span><i style="color:${gg.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Down</span><span><i class="lm-dashed" style="color:#8a96a9"></i>Disabled / unknown / stale</span><span><i class="lm-dotted"></i>Drawn (no interface)</span></div></div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Edit to place devices, areas and text · Draw line joins two devices · Bind a line to an interface for live load · Keys: F fit · + − zoom · Esc clear · Delete remove · Ctrl+Z undo</span></footer>
      <dialog class="lm-cm-name-dialog" aria-labelledby="lm-cm-name-title"><form><h2 id="lm-cm-name-title">New map</h2><label>Map name<input name="name" aria-label="Map name" required autocomplete="off"></label><div class="lm-dialog-actions"><button type="button" data-cm="cancel-name">Cancel</button><button type="submit">Save</button></div></form></dialog>
      <dialog class="lm-cm-delete-dialog" aria-labelledby="lm-cm-delete-title"><h2 id="lm-cm-delete-title">Delete map?</h2><p></p><div class="lm-dialog-actions"><button data-cm="cancel-delete">Cancel</button><button data-cm="confirm-delete">Delete map</button></div></dialog>
    </div>`;
	let t = (t) => e.querySelector(t), n = (e) => t(`[data-cm="${e}"]`), r = t(".lm-notice"), i = t("[aria-label=\"Custom map\"]"), a = t(".lm-details"), o = t(".lm-cm-device"), s = t("#lm-cm-devices"), c = t(".lm-cm-name-dialog"), l = c.querySelector("input"), u = t(".lm-cm-delete-dialog"), d = t(".lm-back");
	e.dataset.homeUrl && (d.href = e.dataset.homeUrl), Mg(t(".lm-pages"), e, "custom");
	let f = sg({
		container: t(".lm-canvas"),
		minZoom: .15,
		maxZoom: 2.5,
		selectionType: "single",
		autoungrabify: !0,
		style: Sg(e)
	});
	Cg(e, () => f.style(Sg(e)));
	let p;
	try {
		e.dataset.mapsEndpoint && e.dataset.devicesEndpoint && (p = $g(e.dataset.mapsEndpoint, e.dataset.devicesEndpoint, e.dataset.csrf ?? ""));
	} catch {}
	let m = [], h, g = Hg(), _ = !1, v = !1, y = !1, b = !1, x, S, C = "new", w, T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = 900, k = 0, A = () => Date.now() / 1e3 + k, j = JSON.stringify(g), M = [], N = [], P = () => {
		M = [], N = [];
	}, F = "";
	function I(e) {
		M.push(e), M.length > o_ && M.shift(), N = [], F = "";
	}
	let L = () => I(JSON.stringify(g));
	function R(e) {
		F !== e && (L(), F = e);
	}
	function z() {
		if (!S || !_) return;
		let e = JSON.stringify(g);
		Yg(g, S) && (I(e), S = void 0, Y(), ye(), ae());
	}
	function B(e, t, n) {
		let r = e.pop();
		r !== void 0 && _ && (t.push(JSON.stringify(g)), F = "", g = Ug(JSON.parse(r)), x = void 0, Y(), ye(), ae(), U(`${n}.`));
	}
	let V = () => B(M, N, "Undone"), H = () => B(N, M, "Redone"), U = (e, t = !1) => {
		r.textContent = e, r.classList.toggle("lm-error", t);
	}, W = () => !!h?.map.owned;
	function G() {
		let e = W();
		i.disabled = y, n("new").disabled = y || !p;
		for (let t of [
			"rename",
			"share",
			"delete",
			"edit"
		]) n(t).hidden = !e, n(t).disabled = y;
		n("share").setAttribute("aria-pressed", String(!!h?.map.shared)), n("share").textContent = h?.map.shared ? "Shared read-only" : "Share read-only", n("share").classList.toggle("lm-active", !!h?.map.shared), n("edit").setAttribute("aria-pressed", String(_)), n("edit").classList.toggle("lm-active", _), n("edit").textContent = _ ? "Done editing" : "Edit", n("save").hidden = !_, n("discard").hidden = !_, n("save").disabled = y || !v, n("discard").disabled = y || !v, t(".lm-editbar").hidden = !_, n("connect").setAttribute("aria-pressed", String(b)), n("connect").classList.toggle("lm-active", b), n("remove").disabled = y || !S;
		for (let e of [
			"add-device",
			"add-text",
			"add-box",
			"connect"
		]) n(e).disabled = y;
		n("undo").disabled = y || !M.length, n("redo").disabled = y || !N.length, n("export").disabled = y || !h || !f.elements().length, t(".lm-cm-title").textContent = h ? h.map.name : "Custom maps", t(".lm-cm-meta").textContent = h ? `${h.map.owned ? "Your map" : `Shared by ${h.map.ownerName ?? "another user"}`} · ${h.map.shared ? "shared read-only" : "private"}${v ? " · unsaved changes" : ""}` : "", f.autoungrabify(!_ || y);
	}
	function K() {
		let e = m.filter((e) => e.owned), t = m.filter((e) => !e.owned), n = [new Option(m.length ? "Choose a map…" : "No maps yet", "")];
		for (let [r, i] of [["My maps", e], ["Shared with me", t]]) {
			if (!i.length) continue;
			let e = document.createElement("optgroup");
			e.label = r, e.append(...i.map((e) => new Option(e.owned ? e.name : `${e.name} — ${e.ownerName ?? "shared"}`, e.id))), n.push(e);
		}
		i.replaceChildren(...n), i.value = h?.map.id ?? "";
	}
	let q = (e, t) => {
		let n = T.get(t), r = n ? ug(n) : `Device ${t}`, i = n?.status ?? "unknown";
		return {
			id: e,
			kind: "device",
			deviceId: t,
			name: r,
			label: `${r}\n${i.toUpperCase()}`,
			color: yg(i),
			width: 206
		};
	}, ee = (e) => {
		let t = e.portId ? E.get(e.portId) : void 0;
		if (t) return {
			port: t,
			..._g({
				...t,
				id: e.key,
				source: e.source,
				target: e.target,
				sourcePort: t.name,
				targetPort: "",
				sourcePortId: t.id,
				targetPortId: ""
			}, A(), O)
		};
	}, J = (e) => {
		let t = ee(e), n = [e.label, t?.label].filter(Boolean).join(" · ");
		return {
			id: e.key,
			source: e.source,
			target: e.target,
			label: n,
			color: t?.color ?? "#8a96a9",
			state: t?.state ?? "drawn"
		};
	};
	function Y() {
		let e = [
			...g.shapes.map((e) => ({
				group: "nodes",
				data: {
					id: e.key,
					kind: e.kind,
					label: e.text,
					width: e.width,
					height: e.height,
					color: "#8a96a9"
				},
				position: {
					x: e.x,
					y: e.y
				}
			})),
			...g.devices.map((e) => ({
				group: "nodes",
				data: q(e.key, e.deviceId),
				position: {
					x: e.x,
					y: e.y
				}
			})),
			...g.links.map((e) => ({
				group: "edges",
				data: J(e)
			}))
		];
		f.batch(() => {
			f.elements().remove(), f.add(e);
		}), S && !f.getElementById(S).length && (S = void 0), S && f.getElementById(S).select(), x && f.getElementById(x).addClass("lm-connect-source");
		let n = t(".lm-empty");
		n.hidden = !!f.elements().length, n.textContent = p ? h ? W() ? _ ? "Add devices, areas and text with the tools above." : "This map is empty. Select Edit to start drawing." : "This map is empty, or holds no devices you can access." : m.length ? "Choose a map, or create a new one." : "No custom maps yet. Create one with New map." : "Custom maps are unavailable on this page.";
	}
	function te() {
		f.batch(() => {
			for (let e of g.links) f.getElementById(e.key).data(J(e));
			for (let e of g.devices) f.getElementById(e.key).data(q(e.key, e.deviceId));
		});
		let e = g.links.find((e) => e.key === S), t = a.querySelector("[data-link-status]");
		e && t && (t.textContent = ee(e)?.label ?? "Drawn only");
	}
	function ne(e) {
		k = Number.isFinite(e.generatedAt) ? e.generatedAt - Date.now() / 1e3 : 0, O = Number.isFinite(e.config?.staleAfter) && e.config.staleAfter > 0 ? e.config.staleAfter : 900;
		for (let [t, n] of Object.entries(e.live.devices ?? {})) T.set(t, n);
		for (let [t, n] of Object.entries(e.live.ports ?? {})) E.set(t, n);
		t(".lm-updated").textContent = `Live data fetched · ${(/* @__PURE__ */ new Date(e.generatedAt * 1e3)).toLocaleTimeString()}`;
	}
	function re(e, t) {
		let { document: n, ...r } = e.map;
		h?.map.id !== r.id && P(), h = e, g = Ug(n), j = JSON.stringify(g), v = !1, x = void 0, m = [r, ...m.filter((e) => e.id !== r.id)].sort((e, t) => e.name.localeCompare(t.name) || e.id.localeCompare(t.id)), r.owned || (_ = !1), ne(e), Y(), t && (g.zoom === 1 && g.pan.x === 0 && g.pan.y === 0 && f.elements().length ? f.fit(f.elements(), 70) : f.viewport({
			zoom: g.zoom,
			pan: g.pan
		})), K(), ye(), G();
	}
	function ie() {
		h = void 0, g = Hg(), j = JSON.stringify(g), P(), v = !1, _ = !1, b = !1, x = void 0, S = void 0, history.replaceState(null, "", oe()), Y(), K(), ye(), G();
	}
	function ae() {
		v = JSON.stringify(g) !== j, G();
	}
	function oe(e) {
		let t = new URL(location.href);
		return e ? t.searchParams.set("map", e) : t.searchParams.delete("map"), t.href;
	}
	let se = () => !v || window.confirm("Discard unsaved changes to this map?");
	function ce(e) {
		U(e instanceof Error ? e.message : "Custom maps are unavailable.", !0), e instanceof Zg && [
			401,
			403,
			404,
			419
		].includes(e.status) && h && !v && (m = m.filter((e) => e.id !== h.map.id), ie());
	}
	async function le(e) {
		if (!y) {
			y = !0, G();
			try {
				return await e();
			} catch (e) {
				ce(e);
				return;
			} finally {
				y = !1, G();
			}
		}
	}
	async function ue(e) {
		if (!p) return;
		if (!se()) {
			i.value = h?.map.id ?? "";
			return;
		}
		if (!e) {
			ie(), U("Choose a map, or create a new one.");
			return;
		}
		_ = !1, b = !1, S = void 0;
		let t = await le(() => p.load(e));
		if (!t) {
			i.value = h?.map.id ?? "";
			return;
		}
		re(t, !0), history.replaceState(null, "", oe(e)), U(t.map.owned ? `Opened “${t.map.name}”.` : `Opened “${t.map.name}”, shared read-only by ${t.map.ownerName ?? "another user"}.`);
	}
	async function de(e = {}) {
		if (!p || !h?.map.owned) return !1;
		g.zoom = Math.min(2.5, Math.max(.15, f.zoom())), g.pan = { ...f.pan() };
		let t = h.map, n = await le(() => p.update(t, e.name ?? t.name, e.shared ?? t.shared, g));
		return n ? (re(n, !1), U(`Saved “${n.map.name}”.`), !0) : !1;
	}
	async function fe() {
		if (w || !p) return;
		let e = await le(() => p.devices());
		if (e) {
			w = [...e].sort((e, t) => ug(e).localeCompare(ug(t), void 0, { numeric: !0 }));
			for (let e of w) T.has(e.id) || T.set(e.id, e);
			s.replaceChildren(...w.map((e) => new Option(`${ug(e)} (#${e.id})`)));
		}
	}
	let pe = (e) => {
		let t = D.get(e);
		return t || (t = p.ports(e), D.set(e, t), t.catch(() => D.delete(e))), t;
	};
	function me(e) {
		let t = f.extent(), n = e % 4, r = Math.floor(e / 4) % 6;
		return {
			x: (t.x1 + t.x2) / 2 + (n - 1.5) * 240,
			y: (t.y1 + t.y2) / 2 + (r - 1) * 110
		};
	}
	function he(e) {
		S = e, f.elements().unselect(), e && f.getElementById(e).select(), ye(), G();
	}
	let X = (e, t, n) => {
		let r = document.createElement(e);
		return t !== void 0 && (r.textContent = t), n && (r.className = n), r;
	};
	function ge(e) {
		let t = X("dl");
		for (let [n, r] of e) t.append(X("dt", n), X("dd", r));
		return t;
	}
	function _e(e, t) {
		let n = X("label", void 0, "lm-cm-field");
		return n.append(X("span", e), t), n;
	}
	function Z() {
		let e = X("button", "×", "lm-close");
		return e.setAttribute("aria-label", "Close details"), e.onclick = () => he(void 0), e;
	}
	function ve() {
		let e = X("button", "Remove from map", "lm-cm-remove");
		return e.onclick = z, e;
	}
	function ye() {
		if (a.replaceChildren(), !h) {
			a.append(X("div", "CUSTOM MAPS", "lm-eyebrow"), X("h2", "Draw your own map"), X("p", "Create a map, place the devices you care about, mark areas and add notes, then draw lines between devices. Bind a line to an interface to show its live load and status."), X("p", "Share a map read-only with every LibreNMS user. Each reader sees only the devices and interfaces they are allowed to see.", "lm-hint"));
			return;
		}
		let e = S ? f.getElementById(S) : void 0;
		if (!e?.length) {
			let e = h.map;
			a.append(X("div", "MAP", "lm-eyebrow"), X("h2", e.name), ge([
				["Owner", e.owned ? "You" : e.ownerName ?? "Another user"],
				["Visibility", e.shared ? "Shared read-only with all users" : "Private"],
				["Devices", String(g.devices.length)],
				["Lines", String(g.links.length)],
				["Last saved", new Date(e.updatedAt).toLocaleString()]
			])), e.shared ? a.append(X("p", "Anyone signed in to LibreNMS can open this map from Custom maps, or with this page’s address. Devices they cannot access are hidden from them.", "lm-hint")) : e.owned && !_ && a.append(X("p", "Select Edit to add devices, areas, text and lines. Drag to arrange, then Save.", "lm-hint"));
			return;
		}
		a.append(Z());
		let t = e.id(), n = e.data("kind");
		if (e.isNode() && n === "device") return be(e.data("deviceId"));
		if (e.isNode()) return xe(t);
		Se(t);
	}
	function be(e) {
		let t = T.get(e), n = t ? ug(t) : `Device ${e}`;
		if (a.append(X("div", "DEVICE", "lm-eyebrow"), X("h2", n), ge([
			["Status", t?.status ?? "unknown"],
			...t && t.hostname !== n ? [["Hostname", t.hostname]] : [],
			["Lines on this map", String(g.links.filter((e) => e.source === S || e.target === S).length)]
		])), t?.url) {
			let e = new URL(t.url, location.href);
			if (e.origin === location.origin) {
				let t = X("a", "Open in LibreNMS ↗", "lm-device-link");
				t.href = e.href, a.append(t);
			}
		}
		_ && a.append(ve());
	}
	function xe(e) {
		let t = g.shapes.find((t) => t.key === e);
		if (!t) return;
		if (a.append(X("div", t.kind === "box" ? "AREA" : "TEXT", "lm-eyebrow")), !_) {
			a.append(X("h2", t.text || (t.kind === "box" ? "Unnamed area" : "Empty text")));
			return;
		}
		let n = X("textarea");
		n.value = t.text, n.rows = 3, n.setAttribute("aria-label", t.kind === "box" ? "Area label" : "Text"), n.oninput = () => {
			R(`text:${e}`), t.text = Vg(n.value, Ng.text), n.value !== t.text && (n.value = t.text), f.getElementById(e).data("label", t.text), ae();
		}, a.append(_e(t.kind === "box" ? "Label" : "Text", n));
		for (let n of ["width", "height"]) {
			let r = X("input");
			r.type = "number", r.min = "20", r.max = String(Pg), r.step = "10", r.value = String(t[n]), r.setAttribute("aria-label", n === "width" ? "Width" : "Height"), r.onchange = () => {
				L(), t[n] = Xg(Number(r.value)), r.value = String(t[n]), f.getElementById(e).data(n, t[n]), ae();
			}, a.append(_e(n === "width" ? "Width" : "Height", r));
		}
		a.append(ve());
	}
	function Se(e) {
		let t = g.links.find((t) => t.key === e);
		if (!t) return;
		let n = (e) => {
			let t = g.devices.find((t) => t.key === e);
			return t ? {
				deviceId: t.deviceId,
				name: q(e, t.deviceId).name
			} : void 0;
		}, r = n(t.source), i = n(t.target);
		a.append(X("div", "DRAWN LINE", "lm-eyebrow"), X("h2", `${r?.name ?? "?"} ↔ ${i?.name ?? "?"}`));
		let o = ee(t), s = X("dd", o ? o.label : "Drawn only");
		s.dataset.linkStatus = "true";
		let c = ge(o ? [
			["Interface", `${T.get(o.port.deviceId) ? ug(T.get(o.port.deviceId)) : ""} ${o.port.name}`.trim()],
			["Capacity", vg(o.port.speedBps)],
			["Inbound", vg(o.port.inBps)],
			["Outbound", vg(o.port.outBps)],
			["Sample time", o.port.sampledAt ? (/* @__PURE__ */ new Date(o.port.sampledAt * 1e3)).toLocaleString() : "Unavailable"]
		] : []);
		if (c.prepend(X("dt", "Status"), s), !_) {
			t.label && a.append(X("p", t.label)), a.append(c);
			return;
		}
		let l = X("input");
		l.value = t.label, l.setAttribute("aria-label", "Line label"), l.autocomplete = "off", l.oninput = () => {
			R(`label:${e}`), t.label = Vg(l.value, Ng.label), l.value !== t.label && (l.value = t.label), f.getElementById(e).data(J(t)), ae();
		}, a.append(_e("Label", l));
		let u = X("select");
		u.setAttribute("aria-label", "Interface"), u.disabled = !0, u.append(new Option("Loading interfaces…", t.portId ?? "")), a.append(_e("Interface for live load", u), c, ve()), Promise.all([r, i].map((e) => e ? pe(e.deviceId).then((t) => ({
			e,
			list: t
		})) : Promise.resolve(void 0))).then((n) => {
			if (S !== e || !u.isConnected) return;
			let r = [new Option("None — drawn only", "")];
			for (let e of n) {
				if (!e) continue;
				for (let t of e.list) E.set(t.id, t);
				let t = document.createElement("optgroup");
				t.label = e.e.name, t.append(...e.list.map((e) => new Option(e.name, e.id))), r.push(t);
			}
			u.replaceChildren(...r), u.value = t.portId ?? "", u.disabled = !1;
		}).catch((e) => {
			u.isConnected && u.replaceChildren(new Option("Interfaces unavailable", "")), U(e instanceof Error ? e.message : "Interfaces unavailable.", !0);
		}), u.onchange = () => {
			L(), t.portId = u.value || null, f.getElementById(e).data(J(t)), ae(), ye();
		};
	}
	f.on("tap", "node", (e) => {
		let t = e.target;
		if (_ && b && t.data("kind") === "device") {
			if (!x) {
				x = t.id(), t.addClass("lm-connect-source"), U("Now select the device at the other end.");
				return;
			}
			let e = x;
			if (x = void 0, f.nodes().removeClass("lm-connect-source"), e === t.id()) {
				U("Line cancelled.");
				return;
			}
			let n = JSON.stringify(g), r = Jg(g, e, t.id());
			if (typeof r == "string") {
				U(r, !0);
				return;
			}
			I(n), Y(), he(r.key), ae(), U("Line drawn. Select another device to draw the next line, or bind this one to an interface.");
			return;
		}
		he(t.id());
	}), f.on("tap", "edge", (e) => he(e.target.id())), f.on("tap", (e) => {
		e.target === f && (x && (x = void 0, f.nodes().removeClass("lm-connect-source")), he(void 0));
	}), f.on("dragfree", "node", (e) => {
		if (!_) return;
		let t = e.target.id(), n = g.devices.find((e) => e.key === t) ?? g.shapes.find((e) => e.key === t);
		if (!n) return;
		let r = {
			x: Math.round(e.target.position().x / a_) * a_,
			y: Math.round(e.target.position().y / a_) * a_
		};
		e.target.position(r), (n.x !== r.x || n.y !== r.y) && (L(), n.x = r.x, n.y = r.y, ae());
	}), f.on("zoom", () => f.edges().toggleClass("lm-no-label", f.zoom() < .45));
	let Ce = t(".lm-canvas-wrap"), we = t(".lm-canvas");
	f.on("pan zoom resize", () => Ag(f, Ce, we, a_)), i.addEventListener("change", () => void ue(i.value));
	function Te(e) {
		C = e, c.querySelector("h2").textContent = e === "new" ? "New map" : "Rename map", l.value = e === "rename" ? h?.map.name ?? "" : "", l.setCustomValidity(""), c.showModal(), l.focus();
	}
	l.oninput = () => l.setCustomValidity(n_(l.value.trim()) > i_ ? `Use at most ${i_} characters.` : ""), c.querySelector("form").onsubmit = async (e) => {
		e.preventDefault();
		let t = l.value.trim();
		if (!t || n_(t) > i_) {
			l.setCustomValidity(t ? `Use at most ${i_} characters.` : "Enter a map name."), l.reportValidity();
			return;
		}
		if (c.close(), C === "rename") {
			await de({ name: t });
			return;
		}
		if (!p || !se()) return;
		let n = await le(() => p.create(t, !1, Hg()));
		n && (S = void 0, _ = !0, re(n, !0), history.replaceState(null, "", oe(n.map.id)), U(`Created “${n.map.name}”. Add devices, areas and text, then Save.`), fe());
	}, e.addEventListener("click", (t) => {
		let n = t.target.closest("[data-cm]")?.dataset.cm;
		switch (n) {
			case "new":
				Te("new");
				break;
			case "rename":
				Te("rename");
				break;
			case "cancel-name":
				c.close();
				break;
			case "share":
				h && de({ shared: !h.map.shared }).then((e) => {
					e && U(h?.map.shared ? "Shared read-only with all LibreNMS users." : "This map is private again.");
				});
				break;
			case "delete":
				h && (u.querySelector("p").textContent = `“${h.map.name}” will be deleted for you${h.map.shared ? " and everyone it is shared with" : ""}.`, u.showModal());
				break;
			case "cancel-delete":
				u.close();
				break;
			case "confirm-delete":
				u.close(), Ee();
				break;
			case "edit":
				De();
				break;
			case "save":
				de();
				break;
			case "discard":
				h && window.confirm("Discard unsaved changes to this map?") && (g = Ug(h.map.document), P(), v = !1, x = void 0, Y(), ye(), G(), U("Changes discarded."));
				break;
			case "add-device": {
				let e = /#([1-9]\d{0,9})\)$/.exec(o.value.trim())?.[1] ?? (w?.some((e) => e.id === o.value.trim()) ? o.value.trim() : ""), t = JSON.stringify(g), n = Kg(g, e, me(g.devices.length));
				if (typeof n == "string") {
					U(n, !0);
					break;
				}
				I(t), o.value = "", Y(), he(n.key), ae(), U("Device added. Drag it into place.");
				break;
			}
			case "add-text":
			case "add-box": {
				let e = JSON.stringify(g), t = qg(g, n === "add-text" ? "text" : "box", me(g.shapes.length));
				if (typeof t == "string") {
					U(t, !0);
					break;
				}
				I(e), Y(), he(t.key), ae();
				break;
			}
			case "undo":
				V();
				break;
			case "redo":
				H();
				break;
			case "export":
				h && Eg(f, e, h.map.name).then(() => U("Map image downloaded."), (e) => U(e instanceof Error ? e.message : "The map image could not be created.", !0));
				break;
			case "connect":
				b = !b, x = void 0, f.nodes().removeClass("lm-connect-source"), G(), U(b ? "Select the device where the line starts." : "Finished drawing lines.");
				break;
			case "remove":
				z();
				break;
			case "zoom-in":
				kg(f, 1.2);
				break;
			case "zoom-out":
				kg(f, 1 / 1.2);
				break;
			case "fit": f.elements().length && f.fit(f.elements(), 70);
		}
	}), o.addEventListener("keydown", (e) => {
		e.key === "Enter" && (e.preventDefault(), n("add-device").click());
	});
	async function Ee() {
		let e = h?.map;
		e && p && await le(async () => (await p.remove(e), !0)) && (m = m.filter((t) => t.id !== e.id), ie(), U(`Deleted “${e.name}”.`));
	}
	async function De() {
		if (!_) {
			_ = !0, G(), ye(), Y(), fe();
			return;
		}
		(!v || await de()) && (_ = !1, b = !1, x = void 0, P(), f.nodes().removeClass("lm-connect-source"), Y(), ye(), G());
	}
	document.addEventListener("keydown", (t) => {
		let n = t.target, r = !!n && (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || n.isContentEditable);
		if ((t.ctrlKey || t.metaKey) && !t.altKey && _ && !r && !e.querySelector("dialog[open]")) {
			let e = t.key.toLowerCase();
			e === "z" && !t.shiftKey ? (t.preventDefault(), V()) : (e === "z" && t.shiftKey || e === "y") && (t.preventDefault(), H());
			return;
		}
		if (Og(t, e)) switch (t.key) {
			case "f":
			case "F":
				f.elements().length && (t.preventDefault(), f.fit(f.elements(), 70));
				break;
			case "+":
			case "=":
				t.preventDefault(), kg(f, 1.2);
				break;
			case "-":
				t.preventDefault(), kg(f, 1 / 1.2);
				break;
			case "Escape":
				x || b ? (b = !1, x = void 0, f.nodes().removeClass("lm-connect-source"), G(), U("Finished drawing lines.")) : S && he(void 0);
				break;
			case "Delete": _ && S && (t.preventDefault(), z());
		}
	}), window.addEventListener("beforeunload", (e) => {
		v && (e.preventDefault(), e.returnValue = "");
	});
	async function Oe() {
		if (!p || !h || y || document.hidden) return;
		let e = h.map.id;
		try {
			let t = await p.load(e);
			if (h?.map.id !== e || y) return;
			if (_ || v) {
				ne(t), te();
				return;
			}
			let n = {
				zoom: f.zoom(),
				pan: { ...f.pan() }
			};
			re(t, !1), f.viewport(n);
		} catch (t) {
			h?.map.id === e && t instanceof Zg && [
				401,
				403,
				404,
				419
			].includes(t.status) ? ce(t) : U(`${t instanceof Error ? t.message : "Live data unavailable."} · Showing the last data received.`, !0);
		}
	}
	if (setInterval(() => void Oe(), 6e4), setInterval(() => {
		h && te();
	}, 1e4), new ResizeObserver(() => f.resize()).observe(t(".lm-canvas")), e.dataset.debug === "true" && Object.defineProperty(window, "libremapCustomDebug", {
		value: () => ({
			nodes: f.nodes().map((e) => ({
				key: e.id(),
				kind: e.data("kind"),
				label: e.data("label"),
				position: e.position(),
				renderedPosition: e.renderedPosition()
			})),
			edges: f.edges().map((e) => ({
				key: e.id(),
				label: e.data("label"),
				state: e.data("state"),
				lineStyle: e.style("line-style"),
				midpoint: e.renderedMidpoint()
			})),
			grabbable: f.nodes().map((e) => e.grabbable()).every(Boolean)
		}),
		configurable: !0
	}), Y(), K(), ye(), G(), Ag(f, Ce, we, a_), !p) {
		U("Custom maps are unavailable on this page.", !0);
		return;
	}
	(async () => {
		let e = await le(() => p.list());
		if (!e) return;
		m = e, K();
		let t = new URL(location.href).searchParams.get("map");
		t && /^[0-9a-f-]{36}$/i.test(t) ? await ue(t) : (Y(), U(m.length ? "Choose a map, or create a new one." : "No custom maps yet. Create one with New map."));
	})();
}
var c_ = 85.05112878, l_ = (e) => 256 * 2 ** e;
function u_({ lat: e, lng: t }, n) {
	let r = l_(n), i = Math.max(-85.05112878, Math.min(c_, e)) * Math.PI / 180;
	return {
		x: (t + 180) / 360 * r,
		y: (1 - Math.log(Math.tan(i) + 1 / Math.cos(i)) / Math.PI) / 2 * r
	};
}
function d_(e, t, n, r, i, a = 10) {
	if (!e.length) return {
		zoom: 1,
		center: {
			x: l_(1) / 2,
			y: l_(1) / 2
		}
	};
	let o = e.map((e) => u_(e, 0)), s = o.map((e) => e.x), c = o.map((e) => e.y), l = Math.min(...s), u = Math.max(...s), d = Math.min(...c), f = Math.max(...c), p = u - l, m = f - d, h = {
		x: Math.max(1, t - 2 * r),
		y: Math.max(1, n - 2 * r)
	}, g = p === 0 && m === 0 ? a : Math.floor(Math.log2(Math.min(p ? h.x / p : Infinity, m ? h.y / m : Infinity))), _ = Math.max(1, Math.min(i, g)), v = 2 ** _;
	return {
		zoom: _,
		center: {
			x: (l + u) / 2 * v,
			y: (d + f) / 2 * v
		}
	};
}
function f_(e, t, n, r) {
	let i = 2 ** t, a = (n % i + i) % i;
	if (r < 0 || r >= i) return;
	let o = e.replace(/\{s\}/g, "abc"[(a + r) % 3]).replace(/\{z\}/g, String(t)).replace(/\{x\}/g, String(a)).replace(/\{y\}/g, String(r));
	try {
		let e = new URL(o);
		return e.protocol === "https:" || e.protocol === "http:" ? e.href : void 0;
	} catch {
		return;
	}
}
var p_ = /\[\s*[-+]?\d{1,3}(?:\.\d+)?\s*,\s*[-+]?\d{1,3}(?:\.\d+)?\s*\]/g;
function m_(e) {
	return e.replace(p_, " ").replace(/\s+([,;])/g, "$1").replace(/\s{2,}/g, " ").trim().replace(/^[,;\s]+|[,;\s]+$/g, "");
}
function h_({ lat: e, lng: t }, n) {
	let r = !1;
	for (let i = 0, a = n.length - 1; i < n.length; a = i++) {
		let [o, s] = n[i], [c, l] = n[a];
		s > e != l > e && t < (c - o) * (e - s) / (l - s) + o && (r = !r);
	}
	return r;
}
function g_(e, t, n, r = .75) {
	let i = e.map(([e, n]) => u_({
		lat: n,
		lng: e
	}, t)), a = (e) => `${e.x.toFixed(1)} ${e.y.toFixed(1)}`, o = [];
	return i.forEach((e, t) => {
		let n = o[o.length - 1];
		n && t < i.length - 1 && Math.abs(e.x - n.x) < r && Math.abs(e.y - n.y) < r || o.push(e);
	}), "M" + (o.length >= (n ? 4 : 2) ? o : i).map(a).join("L") + (n ? "Z" : "");
}
function __(e, t) {
	return !t.length || !h_(e, t[0]) ? !1 : !t.slice(1).some((t) => h_(e, t));
}
function v_(e, t, n) {
	let r = l_(t), i = n / 2, a = r <= n ? r / 2 : Math.max(i, Math.min(r - i, e.y));
	return {
		x: (e.x % r + r) % r,
		y: a
	};
}
//#endregion
//#region frontend/power.ts
var y_ = {
	current: "#c2255c",
	planned: "#7048e8"
}, b_ = {
	current: "Current outage",
	planned: "Planned outage"
}, x_ = {
	unknown_kind: "not marked current or planned",
	no_location: "without a location"
}, S_ = (e) => !!e && typeof e == "object" && !Array.isArray(e), C_ = (e, t) => typeof e == "string" ? Array.from(e.trim()).slice(0, t).join("") : "", w_ = (e, t) => C_(e, t) || null, T_ = (e) => typeof e == "string" && !Number.isNaN(Date.parse(e)) ? e : null, E_ = (e) => Array.isArray(e) && typeof e[0] == "number" && typeof e[1] == "number" && Math.abs(e[0]) <= 180 && Math.abs(e[1]) <= 90;
function D_(e) {
	let t = S_(e) ? e : {};
	return {
		source: C_(t.source, 120) || "DRIFT",
		observedAt: T_(t.observed_at),
		limitations: Array.isArray(t.limitations) ? t.limitations.map((e) => C_(e, 300)).filter(Boolean).slice(0, 20) : []
	};
}
function O_(e, t, n) {
	if (e) return e;
	let r = (e) => {
		let t = e.map((e) => e[0]), n = e.map((e) => e[1]);
		return {
			lng: (Math.min(...t) + Math.max(...t)) / 2,
			lat: (Math.min(...n) + Math.max(...n)) / 2,
			size: (Math.max(...t) - Math.min(...t)) * (Math.max(...n) - Math.min(...n))
		};
	}, i = t.map((e) => r(e[0])).sort((e, t) => t.size - e.size)[0];
	if (i) return [i.lng, i.lat];
	let a = n[0];
	return a ? a[Math.floor(a.length / 2)] : null;
}
function k_(e) {
	if (!S_(e) || typeof e.id != "string" || !e.id || e.kind !== "current" && e.kind !== "planned") return;
	let t = [];
	for (let n of Array.isArray(e.polygons) ? e.polygons : []) {
		if (!Array.isArray(n)) continue;
		let e = n.filter((e) => Array.isArray(e) && e.length >= 4 && e.every(E_));
		e.length && e[0] === n[0] && t.push(e);
	}
	let n = (Array.isArray(e.lines) ? e.lines : []).filter((e) => Array.isArray(e) && e.length >= 2 && e.every(E_)), r = E_(e.point) ? e.point : null, i = [
		...t.flatMap((e) => e[0]),
		...n.flat(),
		...r ? [r] : []
	], a = i.map((e) => e[0]), o = i.map((e) => e[1]);
	return {
		id: e.id,
		provider: C_(e.provider, 80) || "Grid operator",
		kind: e.kind,
		state: w_(e.state, 80),
		type: w_(e.type, 80),
		municipality: w_(e.municipality, 120),
		customers: typeof e.customers == "number" && Number.isFinite(e.customers) && e.customers >= 0 ? Math.round(e.customers) : null,
		text: w_(e.text, 1e3),
		gridLevel: w_(e.grid_level, 80),
		reason: w_(e.reason, 300),
		start: T_(e.start),
		expectedEnd: T_(e.expected_end),
		endedAt: T_(e.ended_at),
		point: r,
		polygons: t,
		lines: n,
		anchor: O_(r, t, n),
		shapeDropped: e.shape_dropped === !0,
		distanceKm: typeof e.distance_km == "number" && Number.isFinite(e.distance_km) ? e.distance_km : null,
		bounds: i.length ? {
			minLat: Math.min(...o),
			maxLat: Math.max(...o),
			minLng: Math.min(...a),
			maxLng: Math.max(...a)
		} : null
	};
}
function A_(e) {
	if (!S_(e) || !Array.isArray(e.outages)) throw Error("Unexpected power outage response.");
	let t = e.outages.map(k_).filter((e) => !!e && !!e.bounds);
	return t.sort((e, t) => Number(e.kind === "current") - Number(t.kind === "current")), {
		outages: t,
		evidence: D_(e.evidence),
		count: typeof e.count == "number" ? e.count : t.length,
		complete: e.complete === !0,
		skipped: S_(e.skipped) ? Object.fromEntries(Object.entries(e.skipped).filter((e) => typeof e[1] == "number" && e[1] > 0)) : {}
	};
}
function j_(e) {
	if (!S_(e) || e.verdict !== "in_outage_area" && e.verdict !== "near_outage" && e.verdict !== "no_known_outage") throw Error("Unexpected power outage response.");
	return {
		verdict: e.verdict,
		why: C_(e.why, 500),
		outages: (Array.isArray(e.outages) ? e.outages : []).map(k_).filter((e) => !!e),
		evidence: D_(e.evidence)
	};
}
function M_(e) {
	if (!S_(e) || e.status !== "ok" && e.status !== "not_read_yet") throw Error("Unexpected power outage status response.");
	let t = S_(e.providers) ? Object.entries(e.providers) : [];
	return {
		status: e.status,
		providers: t.filter(([, e]) => S_(e)).map(([e, t]) => {
			let n = t;
			return {
				key: e,
				name: C_(n.name, 80) || e,
				fetchedAt: T_(n.fetched_at),
				lastError: w_(n.last_error, 300),
				lastErrorAt: T_(n.last_error_at)
			};
		})
	};
}
function N_(e, t) {
	return t.filter((t) => t.bounds && e.lat >= t.bounds.minLat && e.lat <= t.bounds.maxLat && e.lng >= t.bounds.minLng && e.lng <= t.bounds.maxLng && t.polygons.some((t) => __(e, t))).sort((e, t) => Number(t.kind === "current") - Number(e.kind === "current"));
}
function P_(e, [t, n]) {
	return {
		x: (t - e.lng) * 111.32 * Math.cos(e.lat * Math.PI / 180),
		y: (n - e.lat) * 110.574
	};
}
function F_(e, t, n) {
	let r = P_(e, t), i = P_(e, n), a = i.x - r.x, o = i.y - r.y, s = a * a + o * o, c = s ? Math.max(0, Math.min(1, -(r.x * a + r.y * o) / s)) : 0;
	return Math.hypot(r.x + c * a, r.y + c * o);
}
function I_(e, t) {
	let n = Infinity, r = (t, r) => {
		for (let r = 1; r < t.length; r++) n = Math.min(n, F_(e, t[r - 1], t[r]));
		r && t.length > 1 && (n = Math.min(n, F_(e, t[t.length - 1], t[0])));
	};
	for (let e of t.polygons) for (let t of e) r(t, !0);
	for (let e of t.lines) r(e, !1);
	if (t.point) {
		let r = P_(e, t.point);
		n = Math.min(n, Math.hypot(r.x, r.y));
	}
	return n;
}
function L_(e, t, n = 1) {
	let r = n / 110, i = n / (111 * Math.max(.1, Math.cos(e.lat * Math.PI / 180))), a = new Set(N_(e, t));
	return t.filter((t) => t.bounds && !a.has(t) && e.lat >= t.bounds.minLat - r && e.lat <= t.bounds.maxLat + r && e.lng >= t.bounds.minLng - i && e.lng <= t.bounds.maxLng + i).map((t) => ({
		outage: t,
		km: I_(e, t)
	})).filter((e) => e.km <= n).sort((e, t) => e.km - t.km);
}
function R_(e, t) {
	return e.polygons.map((e) => e.map((e) => g_(e, t, !0)).join("")).join("") + e.lines.map((e) => g_(e, t, !1)).join("");
}
function z_(e, t) {
	return e.anchor ? u_({
		lat: e.anchor[1],
		lng: e.anchor[0]
	}, t) : void 0;
}
var B_ = (e) => e.polygons.length ? "area" : e.lines.length ? "lines" : "point", V_ = (e) => e ? new Date(e).toLocaleString(void 0, {
	weekday: "short",
	day: "numeric",
	month: "short",
	hour: "2-digit",
	minute: "2-digit"
}) : "";
function H_(e) {
	let t = V_(e.start), n = V_(e.endedAt ?? e.expectedEnd), r = e.endedAt ? "fixed" : "expected";
	return t && n ? `${t} – ${r} ${n}` : n ? `${r[0].toUpperCase()}${r.slice(1)} ${n}` : t ? `From ${t}` : "Time not given";
}
function U_(e) {
	return e.observedAt ? `Maps read at ${new Date(e.observedAt).toLocaleTimeString(void 0, {
		hour: "2-digit",
		minute: "2-digit"
	})}` : "Maps not read yet";
}
function W_(e) {
	if (e.verdict === "in_outage_area") return "Inside an outage area on the grid operator's map.";
	if (e.verdict === "near_outage") {
		let t = e.outages.map((e) => e.distanceKm).filter((e) => e !== null).sort((e, t) => e - t)[0];
		return `Near an outage on the grid operator's map${t === void 0 ? "" : ` (${t < 1 ? t.toFixed(1) : Math.round(t)} km away)`}.`;
	}
	return "No outage on the grid operators' maps here. This does not confirm the power is on.";
}
//#endregion
//#region frontend/weather.ts
var G_ = {
	yellow: "#e6b800",
	orange: "#f08a24",
	red: "#e03131"
}, K_ = {
	yellow: 1,
	orange: 2,
	red: 3
}, q_ = {
	yellow: "Yellow",
	orange: "Orange",
	red: "Red"
}, J_ = (e) => !!e && typeof e == "object" && !Array.isArray(e), Y_ = (e, t) => typeof e == "string" ? Array.from(e.trim()).slice(0, t).join("") : "", X_ = (e) => Array.isArray(e) && typeof e[0] == "number" && typeof e[1] == "number" && Math.abs(e[0]) <= 180 && Math.abs(e[1]) <= 90;
function Z_(e) {
	if (!J_(e) || !Array.isArray(e.warnings)) throw Error("Unexpected weather warning response.");
	let t = [];
	for (let n of e.warnings) {
		if (!J_(n) || typeof n.id != "string" || n.level !== "yellow" && n.level !== "orange" && n.level !== "red" || !Array.isArray(n.polygons)) continue;
		let e = [];
		for (let t of n.polygons) {
			if (!Array.isArray(t)) continue;
			let n = t.filter((e) => Array.isArray(e) && e.length >= 4 && e.every(X_));
			n.length && n[0] === t[0] && e.push(n);
		}
		if (!e.length) continue;
		let r = e.flatMap((e) => e[0]), i = r.map((e) => e[0]), a = r.map((e) => e[1]), o = typeof n.web == "string" && /^https:\/\//i.test(n.web) ? n.web : null, s = (e) => typeof e == "string" && !Number.isNaN(Date.parse(e)) ? e : null;
		t.push({
			id: n.id,
			level: n.level,
			event: Y_(n.event, 40),
			title: Y_(n.title, 120) || "Weather warning",
			area: Y_(n.area, 200),
			description: Y_(n.description, 1e3),
			instruction: Y_(n.instruction, 1e3),
			consequences: Y_(n.consequences, 1e3),
			start: s(n.start),
			end: s(n.end),
			web: o,
			marine: n.marine === !0,
			polygons: e,
			bounds: {
				minLat: Math.min(...a),
				maxLat: Math.max(...a),
				minLng: Math.min(...i),
				maxLng: Math.max(...i)
			}
		});
	}
	return t.sort((e, t) => K_[e.level] - K_[t.level]), {
		warnings: t,
		attribution: Y_(e.attribution, 120) || "Weather warnings © MET Norway",
		fetchedAt: typeof e.fetchedAt == "number" ? e.fetchedAt : 0,
		stale: e.stale === !0
	};
}
function Q_(e, t) {
	return t.filter((t) => e.lat >= t.bounds.minLat && e.lat <= t.bounds.maxLat && e.lng >= t.bounds.minLng && e.lng <= t.bounds.maxLng && t.polygons.some((t) => __(e, t))).sort((e, t) => K_[t.level] - K_[e.level]);
}
var $_ = (e) => e.reduce((e, t) => !e || K_[t.level] > K_[e] ? t.level : e, void 0);
function ev(e, t) {
	return e.polygons.map((e) => e.map((e) => g_(e, t, !0)).join("")).join("");
}
function tv(e) {
	let t = (e) => e ? new Date(e).toLocaleString(void 0, {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	}) : "", n = t(e.start), r = t(e.end);
	return n && r ? `${n} – ${r}` : r ? `Until ${r}` : n ? `From ${n}` : "Time not given";
}
//#endregion
//#region frontend/world-map.ts
var nv = "http://www.w3.org/2000/svg", rv = 7, iv = 70, av = 12, ov = 6, sv = 3e5, cv = 3e5, lv = 6e4, uv = /* @__PURE__ */ new Set([
	401,
	403,
	404,
	419
]), dv = class extends Error {
	status;
	constructor(e, t) {
		super(e), this.status = t;
	}
}, fv = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function pv(e) {
	e.innerHTML = `
    <div class="lm-shell lm-world-page">
      <header class="lm-header"><div class="lm-brand"><span class="lm-logo">◈</span><div><strong>LibreMap</strong><span>WORLD MAP</span></div></div><div class="lm-header-right"><nav class="lm-pages" aria-label="LibreMap pages" hidden></nav><a class="lm-back" href="/">LibreNMS ↗</a></div></header>
      <section class="lm-heading"><div><div class="lm-eyebrow">INFRASTRUCTURE / GEOGRAPHY</div></div><div class="lm-summary" aria-label="Location summary"></div></section>
      <div class="lm-toolbar"><label class="lm-search"><span>⌕</span><input type="search" aria-label="Find device" placeholder="Find a device or location…"></label><label class="lm-select">Device group <select aria-label="Device group"><option value="">All device groups</option></select></label><button data-world="problems" aria-pressed="false">Only problems</button><button data-world="links" aria-pressed="true" class="lm-active">Links</button><button data-world="weather" aria-pressed="false" hidden title="Show MET Norway weather warnings">⚠ Weather warnings</button><button data-world="power" aria-pressed="false" hidden title="Show power outages on the grid operators' maps">⚡ Power outages</button><button data-world="names" aria-pressed="false" title="Label locations with the names of their devices">Device names</button><button data-world="addresses" aria-pressed="false" title="Show the LibreNMS location text and coordinates">Addresses</button><span class="lm-spacer"></span><button data-world="refresh">↻ Refresh</button><button data-world="fullscreen" title="Fullscreen">⛶</button></div>
      <div class="lm-notice" role="status" aria-live="polite">Loading device locations…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap lm-world-wrap">
        <div class="lm-world" tabindex="0" aria-label="World map of device locations. Drag to pan, scroll to zoom."><div class="lm-world-pane"><div class="lm-world-tiles"></div><svg class="lm-world-weather"></svg><svg class="lm-world-power"></svg><svg class="lm-world-links"></svg><div class="lm-world-markers"></div></div></div>
        <div class="lm-empty" hidden></div>
        <div class="lm-map-controls"><button data-world="zoom-in" aria-label="Zoom in">+</button><button data-world="zoom-out" aria-label="Zoom out">−</button><button data-world="fit">Fit</button></div>
        <div class="lm-legend"><span><i class="lm-world-key" style="background:${yg("up")}"></i>Up</span><span><i class="lm-world-key" style="background:${yg("down")}"></i>Down</span><span><i class="lm-world-key" style="background:${yg("unknown")}"></i>Unknown</span><span><i style="color:${gg.normal}"></i>&lt;50%</span><span><i style="color:${gg.warning}"></i>50–70%</span><span><i style="color:${gg.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Link down</span>${[
		"yellow",
		"orange",
		"red"
	].map((e) => `<span class="lm-world-weather-key" hidden><i class="lm-world-area" style="--area:${G_[e]}"></i>${q_[e]} warning</span>`).join("")}${["current", "planned"].map((e) => `<span class="lm-world-power-key" hidden><i class="lm-world-area lm-world-${e}" style="--area:${y_[e]}"></i>${b_[e]}</span>`).join("")}</div>
        <div class="lm-world-attribution" hidden></div>
      </div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Drag to pan · Scroll or double-click to zoom · Click a location to inspect · Keys: / find · F fit · + − zoom · arrows pan · D next problem · O next location in an outage · Esc clear</span></footer>
    </div>`;
	let t = (t) => e.querySelector(t), n = t(".lm-notice"), r = t(".lm-details"), i = t(".lm-empty"), a = t(".lm-world"), o = t(".lm-world-pane"), s = t(".lm-world-tiles"), c = t(".lm-world-links"), l = t(".lm-world-markers"), u = t(".lm-world-weather"), d = t(".lm-world-power"), f = t("[aria-label=\"Find device\"]"), p = t("[aria-label=\"Device group\"]"), m = (e) => t(`[data-world="${e}"]`);
	e.dataset.homeUrl && (t(".lm-back").href = e.dataset.homeUrl), Mg(t(".lm-pages"), e, "world"), Cg(e, () => {});
	let h, g = {
		nodes: [],
		links: [],
		deviceGroups: []
	}, _, v = [], y = [], b = [], x = /* @__PURE__ */ new Map(), S = 0, C = {
		zoom: 2,
		center: {
			x: l_(2) / 2,
			y: l_(2) / 2
		}
	}, w, T = !1, E = !0, D = !1, O = !1, k = -1, A = 0, j = 0, M = () => Date.now() / 1e3 + j, N = (e, t = !1) => {
		n.textContent = e, n.classList.toggle("lm-error", t);
	}, P = (e) => /^\d{1,3}(\.\d{1,3}){3}$/.test(e) || e.includes(":") && /^[0-9a-f:.]+$/i.test(e);
	function F(e) {
		let t = e.hostname.trim(), n = (e.sysName ?? "").trim();
		return t && !P(t) ? t : n || t || ug(e);
	}
	let I = `libremap:world:${e.dataset.storageKey ?? "local"}`, L = (() => {
		try {
			let e = JSON.parse(localStorage.getItem(I) ?? "{}");
			return fv(e) ? e : {};
		} catch {
			return {};
		}
	})(), R = () => {
		try {
			localStorage.setItem(I, JSON.stringify({
				addresses: z,
				deviceNames: B,
				weather: H,
				power: J
			}));
		} catch {}
	}, z = L.addresses === !0, B = L.deviceNames === !0, V = e.dataset.weatherEndpoint, H = !!V && L.weather === !0, U = [], W = "", G = 0, K = !1, q = /* @__PURE__ */ new Map(), ee = e.dataset.powerEndpoint, J = !!ee && L.power === !0, Y = [], te, ne = !0, re, ie = !1, ae = {}, oe = -1, se = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ue = (e) => e.site && e.site !== "Unclassified" ? e.site : "";
	function de(e) {
		if (B) return ue(e);
		let t = h?.config.overrides?.[e.id]?.site;
		return typeof t == "string" ? t.trim() : "";
	}
	let fe = (e) => {
		let t = [...new Set(e.filter(Boolean))].sort();
		return t.length > 1 ? `${t[0]} +${t.length - 1}` : t[0] ?? "";
	};
	function pe(e) {
		return z && e.name.trim() ? e.name.trim() : fe(e.nodes.map(de));
	}
	let me = /* @__PURE__ */ new Map(), he = (e) => pe(e) || (B && e.nodes.length ? ge(e) : `Location ${me.get(e.id) ?? ""}`.trim()), X = (e) => z && e.name.trim() || fe(e.nodes.map(ue)) || ge(e) || "Location";
	function ge(e, t = 3) {
		let n = e.nodes.slice(0, t).map(F).join(", ");
		return e.nodes.length > t ? `${n} +${e.nodes.length - t}` : n;
	}
	let _e = (e) => B ? ge(e) : pe(e);
	async function Z(e, t) {
		if (!e) throw Error(`Missing ${t} endpoint.`);
		let n = new URL(e, location.href);
		if (n.origin !== location.origin) throw Error(`The ${t} endpoint must use the same origin.`);
		let r = await fetch(n, {
			credentials: "same-origin",
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(2e4)
		});
		if (!r.ok) {
			let e = `LibreNMS returned HTTP ${r.status}`;
			if (r.status === 422 || r.status === 502 || r.status === 503) {
				let t = await r.json().catch(() => void 0);
				fv(t) && typeof t.message == "string" && t.message.length <= 300 && (e = t.message);
			}
			throw r.status === 429 && (e = "Too many requests. The map will retry on the next refresh."), new dv(e, r.status);
		}
		return r.json();
	}
	function ve(e) {
		if (!fv(e) || !Array.isArray(e.locations) || !fv(e.devices)) throw Error("Unexpected locations response.");
		let t = e.locations.filter((e) => fv(e) && typeof e.id == "string" && typeof e.name == "string" && typeof e.lat == "number" && typeof e.lng == "number" && Math.abs(e.lat) <= 90 && Math.abs(e.lng) <= 180).map((e) => ({
			id: e.id,
			name: m_(e.name),
			lat: e.lat,
			lng: e.lng
		})), n = {};
		for (let [t, r] of Object.entries(e.devices)) typeof r == "string" && (n[t] = r);
		let r = fv(e.map) ? e.map : {}, i = fv(r.center) ? r.center : {}, a = (e, t) => typeof e == "number" && Number.isFinite(e) ? e : t;
		return {
			locations: t,
			devices: n,
			map: {
				tiles: typeof r.tiles == "string" && r.tiles ? r.tiles : null,
				attribution: typeof r.attribution == "string" ? r.attribution : "",
				maxZoom: Math.max(1, Math.min(19, Math.round(a(r.maxZoom, 18)))),
				center: {
					lat: a(i.lat, 0),
					lng: a(i.lng, 0),
					zoom: Math.max(1, Math.min(18, Math.round(a(i.zoom, 2))))
				}
			}
		};
	}
	function ye() {
		let e = f.value.trim().toLowerCase(), t = g.deviceGroups.find((e) => e.id === p.value), n = t ? new Set(t.deviceIds) : void 0, r = new Map((_?.locations ?? []).map((e) => [e.id, e])), a = (e) => {
			let t = _?.devices[e];
			return t ? r.get(t) : void 0;
		}, o = g.nodes.filter((t) => n && !n.has(t.id) || T && t.status !== "down" ? !1 : !e || [
			F(t),
			t.hostname,
			t.sysName ?? "",
			t.site,
			z ? a(t.id)?.name ?? "" : ""
		].some((t) => t.toLowerCase().includes(e))), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
		b = [];
		for (let e of o) {
			let t = a(e.id);
			if (!t) {
				b.push(e);
				continue;
			}
			let n = s.get(t.id);
			n || (n = {
				...t,
				nodes: [],
				status: "up"
			}, s.set(t.id, n)), n.nodes.push(e), c.set(e.id, n);
		}
		v = [...s.values()];
		for (let e of v) e.nodes.sort((e, t) => F(e).localeCompare(F(t), void 0, { numeric: !0 })), e.status = e.nodes.some((e) => e.status === "down") ? "down" : e.nodes.every((e) => e.status === "up") ? "up" : "unknown";
		v.sort((e, t) => Number(e.status === "down") - Number(t.status === "down") || e.id.localeCompare(t.id));
		let l = /* @__PURE__ */ new Map(), u = new Set(o.map((e) => e.id));
		x = /* @__PURE__ */ new Map(), S = 0;
		for (let e of g.links) {
			let t = c.get(e.source), n = c.get(e.target);
			if (t && t === n) {
				x.set(t.id, [...x.get(t.id) ?? [], e]);
				continue;
			}
			if (!t || !n) {
				u.has(e.source) && u.has(e.target) && S++;
				continue;
			}
			let [r, i] = t.id < n.id ? [t, n] : [n, t], a = `${r.id}|${i.id}`, o = l.get(a) ?? {
				key: a,
				a: r,
				b: i,
				links: [],
				color: "",
				state: "",
				label: ""
			};
			o.links.push(e), l.set(a, o);
		}
		y = [...l.values()], Se(), be(), xe(), w?.type === "site" && !s.has(w.id) && (w = void 0), w?.type === "device" && !c.has(w.id) && (w = void 0), w?.type === "link" && !l.has(w.id) && (w = void 0), w?.type === "warning" && !U.some((e) => e.id === w.id) && (w = void 0), w?.type === "outage" && !Y.some((e) => e.id === w.id) && (w = void 0), Fe(), Le(), ct(), mt(), i.hidden = v.length > 0, i.textContent = h ? _?.locations.length ? "No located devices match these filters." : "No devices have map coordinates yet. Give devices a LibreNMS location with coordinates to place them here." : "Device locations unavailable. Use Refresh to retry.", et();
	}
	function be() {
		if (q.clear(), H) for (let e of v) {
			let t = Q_(e, U);
			t.length && q.set(e.id, t);
		}
	}
	function xe() {
		if (se.clear(), ce.clear(), J) for (let e of v) {
			let t = N_(e, Y);
			if (t.length) {
				se.set(e.id, t);
				continue;
			}
			let n = L_(e, Y);
			n.length && ce.set(e.id, n);
		}
	}
	function Se() {
		let e = M(), t = h?.config.staleAfter ?? 900;
		for (let n of y) {
			let r = n.links.map((n) => _g(n, e, t)), i = r.filter((e) => e.state === "down").length, a = r.filter((e) => e.state === "up" && e.utilization !== null).sort((e, t) => t.utilization - e.utilization)[0];
			i ? (n.color = "#e05b65", n.state = "down", n.label = `${i} of ${n.links.length} down`) : a ? (n.color = a.color, n.state = "up", n.label = `busiest ${a.label}`) : (n.color = "#8a96a9", n.state = "unknown", n.label = "load unknown");
		}
	}
	function Ce() {
		Se();
		for (let e of y) {
			let t = Ie.get(e.key);
			if (!t) continue;
			t[1].setAttribute("stroke", e.color), e.state === "up" ? t[1].removeAttribute("stroke-dasharray") : t[1].setAttribute("stroke-dasharray", "7 5");
			let n = t[1].parentElement?.querySelector("title");
			n && (n.textContent = `${he(e.a)} ↔ ${he(e.b)} · ${e.links.length} link${e.links.length === 1 ? "" : "s"} · ${e.label}`);
		}
	}
	let we = {
		w: 0,
		h: 0
	}, Te = () => {
		we = {
			w: a.clientWidth,
			h: a.clientHeight
		};
	}, Ee = () => (!we.w && !we.h && Te(), we);
	function De(e) {
		let { w: t, h: n } = Ee(), r = l_(C.zoom), i = e.x - C.center.x;
		return i > r / 2 ? i -= r : i < -r / 2 && (i += r), {
			x: t / 2 + i,
			y: n / 2 + e.y - C.center.y
		};
	}
	let Oe = {
		x: 0,
		y: 0
	}, ke = {
		zoom: -1,
		x: 0,
		y: 0,
		w: 0,
		h: 0
	}, Ae = () => {
		ke.zoom = -1;
	}, je = /* @__PURE__ */ new Map(), Me = "";
	function Ne() {
		let e = _?.map.tiles;
		if (!e) {
			je.size && (s.replaceChildren(), je.clear());
			return;
		}
		let { w: t, h: n } = Ee(), r = C.zoom, i = 2 ** r, a = C.center.x - t / 2, o = C.center.y - n / 2, c = Me !== `${r}/${Oe.x}/${Oe.y}`;
		Me = `${r}/${Oe.x}/${Oe.y}`;
		let l = /* @__PURE__ */ new Set();
		for (let u = Math.max(0, Math.floor(o / 256) - 1); u <= Math.min(i - 1, Math.floor((o + n) / 256) + 1); u++) for (let n = Math.floor(a / 256) - 1; n <= Math.floor((a + t) / 256) + 1; n++) {
			let t = `${r}/${n}/${u}`;
			l.add(t);
			let i = je.get(t), a = !i;
			if (!i) {
				let a = f_(e, r, n, u);
				if (!a) continue;
				i = new Image(256, 256), i.alt = "", i.decoding = "async", i.draggable = !1, i.onerror = () => {
					i.classList.add("lm-tile-failed"), ++A === ov && N("Map tiles could not be loaded. Device locations are still shown.", !0);
				}, i.src = a, je.set(t, i), s.append(i);
			}
			(a || c) && (i.style.transform = `translate(${n * 256 - Oe.x}px,${u * 256 - Oe.y}px)`);
		}
		for (let [e, t] of je) l.has(e) || (t.remove(), je.delete(e));
	}
	let Pe = /* @__PURE__ */ new Map();
	function Fe() {
		Pe.clear(), Ae(), l.replaceChildren(...v.map((e) => {
			let t = e.nodes.length, n = e.nodes.filter((e) => e.status === "down").length, r = document.createElement("button"), i = $_(q.get(e.id) ?? []), a = se.get(e.id)?.[0]?.kind, o = ce.get(e.id)?.[0];
			r.type = "button", r.className = `lm-world-marker lm-world-${e.status}`, r.dataset.site = e.id, a ? (r.classList.add("lm-world-in-outage", `lm-world-in-${a}`), r.style.setProperty("--outage", y_[a])) : o && (r.classList.add("lm-world-near-outage"), r.style.setProperty("--outage", y_[o.outage.kind])), r.setAttribute("aria-label", `${he(e)}: ${t} device${t === 1 ? "" : "s"}${n ? `, ${n} down` : ""}${i ? `, ${i} weather warning` : ""}${a ? `, inside a ${a} power outage area` : o ? `, ${lt(o.km)} from a ${o.outage.kind} power outage` : ""}`), r.style.setProperty("--marker", `${Math.round(Math.min(36, 14 + Math.sqrt(t) * 4))}px`);
			let s = document.createElement("span");
			s.className = "lm-world-dot", s.textContent = t > 1 ? String(t) : "";
			let c = document.createElement("span");
			if (c.className = "lm-world-label", c.textContent = _e(e), r.append(s, c), i) {
				let e = document.createElement("span");
				e.className = "lm-world-badge", e.textContent = "!", e.style.setProperty("--area", G_[i]), r.dataset.warning = i, r.append(e);
			}
			if (a) {
				let e = document.createElement("span");
				e.className = "lm-world-badge lm-world-power-badge", e.textContent = "⚡", e.style.setProperty("--area", y_[a]);
				let t = document.createElement("span");
				t.className = "lm-world-outage-tag", t.textContent = a === "current" ? "⚡ OUTAGE" : "⚡ PLANNED", r.dataset.outage = a, r.append(e, t);
			} else if (o) {
				let e = document.createElement("span");
				e.className = "lm-world-badge lm-world-power-badge lm-world-near-badge", e.textContent = "⚡", e.style.setProperty("--area", y_[o.outage.kind]), r.dataset.nearOutage = o.outage.kind, r.append(e);
			}
			return Pe.set(e.id, r), r;
		}));
	}
	let Ie = /* @__PURE__ */ new Map();
	function Le() {
		if (Ie.clear(), c.replaceChildren(), Ae(), E) for (let e of y) {
			let t = document.createElementNS(nv, "g");
			t.classList.add("lm-world-link"), t.dataset.link = e.key, t.setAttribute("tabindex", "0"), t.setAttribute("role", "button"), t.setAttribute("aria-label", `${he(e.a)} to ${he(e.b)}: ${e.links.length} link${e.links.length === 1 ? "" : "s"}, ${e.label}`);
			let n = document.createElementNS(nv, "title");
			n.textContent = `${he(e.a)} ↔ ${he(e.b)} · ${e.links.length} link${e.links.length === 1 ? "" : "s"} · ${e.label}`;
			let r = document.createElementNS(nv, "line");
			r.classList.add("lm-world-hit");
			let i = document.createElementNS(nv, "line");
			i.classList.add("lm-world-line"), i.setAttribute("stroke", e.color), i.setAttribute("stroke-width", String(Math.min(7, 2 + Math.log2(e.links.length)))), e.state !== "up" && i.setAttribute("stroke-dasharray", "7 5"), t.append(n, r, i), c.append(t), Ie.set(e.key, [r, i]);
		}
	}
	let Re, ze = -1, Be = /* @__PURE__ */ new Map();
	function Ve() {
		u.replaceChildren(), Be.clear(), Re = void 0, ze = -1, Ae();
		for (let t of e.querySelectorAll(".lm-world-weather-key")) t.hidden = !H;
		if (H) {
			Re = document.createElementNS(nv, "g");
			for (let e of U) {
				let t = document.createElementNS(nv, "path");
				t.classList.add("lm-world-warning"), t.dataset.warning = e.id, t.setAttribute("fill-rule", "evenodd"), t.style.setProperty("--area", G_[e.level]);
				let n = document.createElementNS(nv, "title");
				n.textContent = `${q_[e.level]} warning: ${e.title}${e.area ? ` · ${e.area}` : ""}`, t.append(n), Re.append(t), Be.set(e.id, t);
			}
			u.append(Re);
		}
	}
	function He() {
		if (Re) {
			if (ze !== C.zoom) {
				for (let e of U) Be.get(e.id)?.setAttribute("d", ev(e, C.zoom));
				ze = C.zoom;
			}
			Re.setAttribute("transform", `translate(${-Oe.x} ${-Oe.y})`);
		}
	}
	let Ue, We = -1, Ge = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map(), qe = (e) => `${b_[e.kind]}: ${e.provider}${e.municipality ? ` · ${e.municipality}` : ""}${e.customers === null ? "" : ` · ${e.customers} customers`}`;
	function Je() {
		d.replaceChildren(), Ge.clear(), Ke.clear(), Ue = void 0, We = -1, Ae();
		for (let t of e.querySelectorAll(".lm-world-power-key")) t.hidden = !J;
		if (!J) return;
		Ue = document.createElementNS(nv, "g");
		let t = document.createElementNS(nv, "g");
		for (let e of Y) {
			let n = document.createElementNS(nv, "path");
			n.classList.add("lm-world-outage", `lm-world-${e.kind}`, `lm-world-outage-${B_(e)}`), n.dataset.outage = e.id, n.setAttribute("fill-rule", "evenodd"), n.style.setProperty("--area", y_[e.kind]);
			let r = document.createElementNS(nv, "title");
			if (r.textContent = qe(e), n.append(r), Ue.append(n), Ge.set(e.id, n), !e.anchor) continue;
			let i = document.createElementNS(nv, "g");
			i.classList.add("lm-world-outage-pin", `lm-world-${e.kind}`), i.dataset.outage = e.id, i.style.setProperty("--area", y_[e.kind]);
			let a = document.createElementNS(nv, "circle");
			a.setAttribute("r", "10");
			let o = document.createElementNS(nv, "text");
			o.textContent = "⚡", o.setAttribute("text-anchor", "middle"), o.setAttribute("dy", "4.5");
			let s = document.createElementNS(nv, "title");
			s.textContent = qe(e), i.append(s, a, o), t.append(i), Ke.set(e.id, i);
		}
		Ue.append(t), d.append(Ue);
	}
	function Ye() {
		if (Ue) {
			if (We !== C.zoom) {
				for (let e of Y) {
					Ge.get(e.id)?.setAttribute("d", R_(e, C.zoom));
					let t = z_(e, C.zoom);
					t && Ke.get(e.id)?.setAttribute("transform", `translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`);
				}
				We = C.zoom;
			}
			Ue.setAttribute("transform", `translate(${-Oe.x} ${-Oe.y})`);
		}
	}
	function Xe(e) {
		let t = l_(C.zoom), n = e.x - C.center.x;
		return n > t / 2 ? n -= t : n < -t / 2 && (n += t), {
			x: C.center.x + n - Oe.x,
			y: e.y - Oe.y
		};
	}
	function Ze() {
		let { w: e, h: t } = Ee(), n = C.zoom;
		Oe = {
			x: Math.round(C.center.x - e / 2),
			y: Math.round(C.center.y - t / 2)
		}, ke = {
			zoom: n,
			x: C.center.x,
			y: C.center.y,
			w: e,
			h: t
		}, He(), Ye();
		for (let r of v) {
			let i = Pe.get(r.id);
			if (!i) continue;
			let a = Xe(u_(r, n)), o = a.x < -e - 60 || a.y < -t - 60 || a.x > 2 * e + 60 || a.y > 2 * t + 60;
			i.style.display = o ? "none" : "", o || (i.style.transform = `translate(${a.x}px,${a.y}px) translate(-50%,-50%)`);
		}
		l.classList.toggle("lm-world-named", n >= rv || B), l.classList.toggle("lm-world-device-names", B);
		let r = l_(n);
		for (let e of y) {
			let t = Ie.get(e.key);
			if (!t) continue;
			let i = Xe(u_(e.a, n)), a = Xe(u_(e.b, n));
			a.x - i.x > r / 2 ? a.x -= r : i.x - a.x > r / 2 && (a.x += r);
			for (let e of t) e.setAttribute("x1", String(i.x)), e.setAttribute("y1", String(i.y)), e.setAttribute("x2", String(a.x)), e.setAttribute("y2", String(a.y));
		}
		Qe();
	}
	function Qe() {
		let e = w?.type === "site" ? w.id : w?.type === "device" ? v.find((e) => e.nodes.some((e) => e.id === w.id))?.id : void 0;
		for (let [t, n] of Pe) n.classList.toggle("lm-selected", t === e);
		for (let [e, t] of Ie) t[1].classList.toggle("lm-selected", w?.type === "link" && w.id === e);
		for (let [e, t] of Be) t.classList.toggle("lm-selected", w?.type === "warning" && w.id === e);
		for (let [e, t] of Ge) t.classList.toggle("lm-selected", w?.type === "outage" && w.id === e);
		for (let [e, t] of Ke) t.classList.toggle("lm-selected", w?.type === "outage" && w.id === e);
	}
	let $e = 0;
	function et() {
		cancelAnimationFrame($e), $e = 0;
		let { w: e, h: t } = Ee();
		(ke.zoom !== C.zoom || ke.w !== e || ke.h !== t || Math.abs(C.center.x - ke.x) > Math.min(e, l_(C.zoom) / 2) || Math.abs(C.center.y - ke.y) > t) && Ze(), o.style.transform = `translate3d(${Math.round(Oe.x - (C.center.x - e / 2))}px,${Math.round(Oe.y - (C.center.y - t / 2))}px,0)`, Ne();
	}
	let tt = () => {
		$e ||= requestAnimationFrame(et);
	};
	function nt(e, t) {
		let n = _?.map.maxZoom ?? 18;
		e = Math.max(1, Math.min(n, Math.round(e))), C = {
			zoom: e,
			center: v_(t, e, Ee().h)
		}, ot(), tt();
	}
	function rt(e, t) {
		let { w: n, h: r } = Ee(), i = _?.map.maxZoom ?? 18, a = Math.max(1, Math.min(i, C.zoom + e));
		if (a === C.zoom) return;
		let o = t ?? {
			x: n / 2,
			y: r / 2
		}, s = 2 ** (a - C.zoom), c = {
			x: o.x - n / 2,
			y: o.y - r / 2
		};
		nt(a, {
			x: (C.center.x + c.x) * s - c.x,
			y: (C.center.y + c.y) * s - c.y
		});
	}
	function it() {
		let { w: e, h: t } = Ee();
		if (!v.length) {
			let e = _?.map.center ?? {
				lat: 0,
				lng: 0,
				zoom: 2
			};
			nt(e.zoom, u_(e, e.zoom));
			return;
		}
		let n = d_(v, e, t, iv, _?.map.maxZoom ?? 18, av);
		nt(n.zoom, n.center);
	}
	function at(e) {
		let t = Math.max(C.zoom, Math.min(_?.map.maxZoom ?? 18, 8));
		nt(t, u_(e, t));
	}
	function ot() {
		let e = _?.map.maxZoom ?? 18, t = !h;
		m("zoom-in").disabled = C.zoom >= e, m("zoom-out").disabled = C.zoom <= 1, m("fit").disabled = t, f.disabled = t, p.disabled = t, m("problems").disabled = t, m("links").disabled = t, m("addresses").disabled = t, m("names").disabled = t, m("weather").hidden = !V, m("weather").disabled = K, m("power").hidden = !ee, m("power").disabled = ie;
		for (let [e, t] of [
			["problems", T],
			["links", E],
			["addresses", z],
			["names", B],
			["weather", H],
			["power", J]
		]) m(e).classList.toggle("lm-active", t), m(e).setAttribute("aria-pressed", String(t));
	}
	let Q = (e, t, n) => {
		let r = document.createElement(e);
		return t !== void 0 && (r.textContent = t), n && (r.className = n), r;
	};
	function st(e) {
		let t = Q("dl");
		for (let [n, r] of e) t.append(Q("dt", n), Q("dd", r));
		return t;
	}
	function ct() {
		let e = t(".lm-summary");
		if (e.replaceChildren(), !h) return;
		let n = v.reduce((e, t) => e + t.nodes.length, 0), r = v.filter((e) => e.status === "down").length;
		for (let [t, i] of [
			[n, "Located"],
			[v.length, "Locations"],
			[b.length, "No coordinates"],
			[r, "Problem sites"]
		]) {
			let n = i === "Problem sites" && r > 0, a = Q(n ? "button" : "div");
			a.append(Q("strong", String(t)), Q("span", i)), n && (a.className = "lm-summary-down", a.dataset.world = "next-down", a.title = "Show the next location with a down device (D)", a.setAttribute("aria-label", `${r} problem sites. Show the next one`)), e.append(a);
		}
		if (H) {
			let t = Q("div", void 0, "lm-summary-weather");
			t.append(Q("strong", String(q.size)), Q("span", "Under warning")), e.append(t);
		}
		if (J) {
			let t = se.size, n = Q(t ? "button" : "div", void 0, `lm-summary-power${t ? " lm-summary-power-hit" : ""}`);
			if (n.append(Q("strong", String(t)), Q("span", "In outage area")), t && (n.dataset.world = "next-outage", n.title = "Show the next location inside an outage area (O)", n.setAttribute("aria-label", `${t} location${t === 1 ? "" : "s"} inside an outage area. Show the next one`)), e.append(n), ce.size) {
				let t = Q("div", void 0, "lm-summary-power");
				t.append(Q("strong", String(ce.size)), Q("span", "Within 1 km")), e.append(t);
			}
		}
	}
	let lt = (e) => e < 1 ? `${Math.max(10, Math.round(e * 100) * 10)} m` : `${e.toFixed(1)} km`;
	function ut(e) {
		let t = se.get(e.id) ?? [], n = ce.get(e.id) ?? [];
		if (!J || !t.length && !n.length) return;
		let r = t[0] ?? n[0].outage, i = Q("div", void 0, `lm-world-outage-banner${t.length ? "" : " lm-world-outage-banner-near"}`);
		i.style.setProperty("--outage", y_[r.kind]), i.append(Q("strong", t.length ? `⚡ ${r.kind === "current" ? "INSIDE A POWER OUTAGE AREA" : "INSIDE A PLANNED OUTAGE AREA"}` : `⚡ ${lt(n[0].km)} FROM A ${r.kind === "current" ? "POWER OUTAGE" : "PLANNED OUTAGE"}`));
		let a = [
			r.provider,
			r.municipality,
			r.customers === null ? "" : `${r.customers} customers`,
			H_(r)
		].filter(Boolean).join(" · ");
		i.append(Q("span", a)), t.length > 1 && i.append(Q("span", `and ${t.length - 1} more outage${t.length === 2 ? "" : "s"} here`));
		let o = Q("button", "Show the outage");
		return o.onclick = () => ft({
			type: "outage",
			id: r.id
		}), i.append(o), i;
	}
	function dt() {
		let e = v.filter((e) => se.has(e.id)).sort((e, t) => Number(se.get(t.id)[0].kind === "current") - Number(se.get(e.id)[0].kind === "current"));
		if (!J) {
			N("Turn on ⚡ Power outages to step through affected locations.");
			return;
		}
		if (!e.length) {
			N(ce.size ? `No location is inside an outage area; ${ce.size} ${ce.size === 1 ? "is" : "are"} within 1 km of one.` : "No location is inside or near an outage on the grid operators' maps.");
			return;
		}
		oe = (oe + 1) % e.length;
		let t = e[oe];
		ft({
			type: "site",
			id: t.id
		}), at(t), N(`Location in an outage area ${oe + 1} of ${e.length}: ${X(t)}`);
	}
	function ft(e) {
		w = e, mt(), Qe();
	}
	function pt() {
		let e = Q("button", "×", "lm-close");
		return e.setAttribute("aria-label", "Close details"), e.onclick = () => ft(void 0), e;
	}
	function mt() {
		r.replaceChildren();
		let e = w?.type === "site" ? v.find((e) => e.id === w.id) : void 0, t = w?.type === "device" ? v.flatMap((e) => e.nodes).find((e) => e.id === w.id) : void 0, n = w?.type === "link" ? y.find((e) => e.key === w.id) : void 0, i = w?.type === "warning" ? U.find((e) => e.id === w.id) : void 0, a = w?.type === "outage" ? Y.find((e) => e.id === w.id) : void 0;
		if (e) return gt(e);
		if (t) return wt(t);
		if (n) return Et(n);
		if (i) return vt(i);
		if (a) return Ct(a);
		r.append(Q("div", "WORLD MAP", "lm-eyebrow"), Q("h2", "Where the network is"), Q("p", "Each marker is a LibreNMS location, sized by its number of devices and coloured by the worst device status there. Lines are discovered links between locations, coloured by their busiest link."));
		let o = [...x.values()].reduce((e, t) => e + t.length, 0);
		if (o || S) {
			let e = [o ? `${o} join devices at the same location (listed under that location)` : "", S ? `${S} reach a device without coordinates` : ""].filter(Boolean);
			r.append(Q("p", `${o + S} link${o + S === 1 ? " is" : "s are"} not drawn as lines: ${e.join("; ")}.`, "lm-hint lm-world-undrawn"));
		}
		if (!z && !B ? r.append(Q("p", "Markers are shown without names. Select Addresses for the LibreNMS location text, or Device names to label them with their devices. Select a location to see its devices.", "lm-hint")) : z || r.append(Q("p", "Select Addresses to show the LibreNMS location text and coordinates.", "lm-hint")), H && (r.append(Q("div", `WEATHER WARNINGS · ${U.length}`, "lm-eyebrow lm-world-section")), U.length ? r.append(_t(U)) : r.append(Q("p", G ? "MET Norway has no active warnings." : "Loading weather warnings…"))), J && (r.append(Q("div", `POWER OUTAGES · ${Y.length}`, "lm-eyebrow lm-world-section")), Y.length ? r.append(yt(Y)) : r.append(Q("p", te ? "No outages on the grid operators' maps. This does not confirm the power is on everywhere." : "Loading power outages…")), r.append(bt())), b.length) {
			let e = Q("details", "", "lm-world-unlocated");
			e.append(Q("summary", `${b.length} device${b.length === 1 ? " has" : "s have"} no coordinates`));
			let t = Q("ul");
			for (let e of b.slice(0, 50)) t.append(Q("li", F(e)));
			b.length > 50 && t.append(Q("li", `…and ${b.length - 50} more`)), e.append(t, Q("p", "Give these devices a LibreNMS location with coordinates to place them on the map.")), r.append(e);
		}
	}
	function ht(e) {
		let t = Q("button", void 0, "lm-world-device"), n = Q("i");
		return n.style.background = yg(e.status), t.append(n, Q("span", F(e))), t.title = e.status, t.onclick = () => ft({
			type: "device",
			id: e.id
		}), t;
	}
	function gt(e) {
		let t = e.nodes.filter((e) => e.status === "down").length;
		r.append(pt(), Q("div", "LOCATION", "lm-eyebrow"), Q("h2", X(e)), st([
			["Devices", String(e.nodes.length)],
			["Down", String(t)],
			...z ? [["Coordinates", `${e.lat.toFixed(5)}, ${e.lng.toFixed(5)}`]] : []
		]));
		let n = ut(e);
		n && r.append(n);
		let i = q.get(e.id) ?? [];
		i.length && r.append(Q("div", "WEATHER WARNINGS HERE", "lm-eyebrow lm-world-section"), _t(i)), J && r.append(Q("div", "POWER HERE", "lm-eyebrow lm-world-section"), xt(e));
		let a = Q("div", void 0, "lm-device-list");
		a.append(...e.nodes.map(ht)), r.append(a);
		let o = x.get(e.id) ?? [];
		o.length && r.append(Q("div", `LINKS WITHIN THIS LOCATION · ${o.length}`, "lm-eyebrow lm-world-section"), Tt(o));
		let s = y.filter((t) => t.a === e || t.b === e);
		if (s.length) {
			r.append(Q("div", "CONNECTED LOCATIONS", "lm-eyebrow"));
			let t = Q("div", void 0, "lm-device-list");
			for (let n of s) {
				let r = n.a === e ? n.b : n.a, i = Q("button", `${X(r)} · ${n.links.length} link${n.links.length === 1 ? "" : "s"} · ${n.label}`);
				i.onclick = () => ft({
					type: "link",
					id: n.key
				}), t.append(i);
			}
			r.append(t);
		}
	}
	function _t(e) {
		let t = Q("div", void 0, "lm-device-list lm-world-warnings");
		for (let n of [...e].sort((e, t) => K_[t.level] - K_[e.level])) {
			let e = Q("button", void 0, "lm-world-device"), r = Q("i");
			r.style.background = G_[n.level], e.append(r, Q("span", `${n.title}${n.area ? ` · ${n.area}` : ""}`)), e.title = `${q_[n.level]} warning`, e.onclick = () => ft({
				type: "warning",
				id: n.id
			}), t.append(e);
		}
		return t;
	}
	function vt(e) {
		let t = v.filter((t) => q.get(t.id)?.includes(e));
		r.append(pt(), Q("div", `${q_[e.level].toUpperCase()} WARNING · MET NORWAY`, "lm-eyebrow"), Q("h2", e.title), st([
			...e.area ? [["Area", e.area]] : [],
			["When", tv(e)],
			["Locations affected", String(t.length)]
		]));
		for (let [t, n] of [
			["", e.description],
			["Consequences", e.consequences],
			["Advice", e.instruction]
		]) n && (t && r.append(Q("div", t.toUpperCase(), "lm-eyebrow lm-world-section")), r.append(Q("p", n)));
		if (t.length) {
			let e = Q("div", void 0, "lm-device-list");
			for (let n of t) {
				let t = Q("button", X(n));
				t.onclick = () => {
					ft({
						type: "site",
						id: n.id
					}), at(n);
				}, e.append(t);
			}
			r.append(Q("div", "AFFECTED LOCATIONS", "lm-eyebrow lm-world-section"), e);
		}
		if (e.web) {
			let t = Q("a", "Details at MET Norway ↗", "lm-device-link");
			t.href = e.web, t.target = "_blank", t.rel = "noopener noreferrer", r.append(t);
		}
	}
	function yt(e) {
		let t = Q("div", void 0, "lm-device-list lm-world-outages");
		for (let n of [...e].sort((e, t) => Number(t.kind === "current") - Number(e.kind === "current"))) {
			let e = Q("button", void 0, "lm-world-device"), r = Q("i");
			r.style.background = y_[n.kind], e.append(r, Q("span", `${n.provider}${n.municipality ? ` · ${n.municipality}` : ""}${n.customers === null ? "" : ` · ${n.customers} customers`}`)), e.title = b_[n.kind], Y.some((e) => e.id === n.id) ? e.onclick = () => ft({
				type: "outage",
				id: n.id
			}) : e.disabled = !0, t.append(e);
		}
		return t;
	}
	function bt() {
		let e = Q("div", void 0, "lm-hint lm-world-power-status");
		if (!te) return e.textContent = "Grid operator maps: waiting for DRIFT.", e;
		e.append(Q("p", `${U_(te)} · ${te.source}`)), ne || e.append(Q("p", "The list may be incomplete: it was cut off, or a map has not been read yet."));
		for (let [t, n] of Object.entries(ae)) t === "shape_too_large" ? e.append(Q("p", `⚠ ${n} outage area${n === 1 ? " was" : "s were"} too detailed to draw and ${n === 1 ? "is" : "are"} shown as a pin.`)) : e.append(Q("p", `⚠ ${n} outage${n === 1 ? "" : "s"} from DRIFT ${n === 1 ? "is" : "are"} not on the map: ${x_[t] ?? t}.`));
		for (let t of te.limitations) e.append(Q("p", `⚠ ${t}`));
		for (let t of re?.providers ?? []) t.lastError ? e.append(Q("p", `⚠ ${t.name}: ${t.lastError}${t.lastErrorAt ? ` (${new Date(t.lastErrorAt).toLocaleTimeString()})` : ""}`)) : t.fetchedAt || e.append(Q("p", `${t.name}: map not read yet`));
		return e;
	}
	function xt(e) {
		let t = Q("div", void 0, "lm-world-power-here"), n = le.get(e.id);
		if ((!n || Date.now() - n.at > lv) && St(e), !n || !n.check && !n.error) return t.append(Q("p", "Checking the grid operators' maps…")), t;
		if (n.error) return t.append(Q("p", n.error, "lm-hint")), t;
		let r = n.check, i = Q("p", W_(r), `lm-world-verdict lm-world-${r.verdict}`);
		t.append(i), r.why && t.append(Q("p", r.why, "lm-hint")), r.outages.length && t.append(yt(r.outages.map((e) => Y.find((t) => t.id === e.id) ?? e))), t.append(Q("p", U_(r.evidence), "lm-hint"));
		for (let e of r.evidence.limitations) t.append(Q("p", `⚠ ${e}`, "lm-hint"));
		return t;
	}
	async function St(t) {
		let n = e.dataset.powerAtEndpoint;
		if (!n) return;
		let r = le.get(t.id);
		le.set(t.id, {
			at: Date.now(),
			check: r?.check
		});
		try {
			let e = new URL(n, location.href);
			e.searchParams.set("lat", String(t.lat)), e.searchParams.set("lon", String(t.lng)), le.set(t.id, {
				at: Date.now(),
				check: j_(await Z(e.href, "power outage check"))
			});
		} catch (e) {
			le.set(t.id, {
				at: Date.now(),
				error: e instanceof Error ? e.message : "The power outage check failed."
			});
		}
		J && w?.type === "site" && w.id === t.id && mt();
	}
	function Ct(e) {
		let t = v.filter((t) => se.get(t.id)?.includes(e)), n = v.map((t) => ({
			site: t,
			near: ce.get(t.id)?.find((t) => t.outage === e)
		})).filter((e) => !!e.near);
		r.append(pt(), Q("div", `${b_[e.kind].toUpperCase()} · ${e.provider.toUpperCase()}`, "lm-eyebrow"), Q("h2", e.municipality ?? e.provider), st([
			...e.state ? [["State", e.state]] : [],
			...e.type ? [["Type", e.type]] : [],
			...e.customers === null ? [] : [["Customers affected", String(e.customers)]],
			["When", H_(e)],
			...e.gridLevel ? [["Grid level", e.gridLevel]] : [],
			...e.reason ? [["Reason", e.reason]] : [],
			["Locations in area", String(t.length)],
			["Devices in area", String(t.reduce((e, t) => e + t.nodes.length, 0))]
		])), e.text && r.append(Q("p", e.text)), B_(e) === "point" && r.append(Q("p", "The grid operator gives this outage as a point, without an area, so the map cannot tell which locations it covers. Locations within 1 km are listed as near it.", "lm-hint")), e.shapeDropped && r.append(Q("p", "This outage's area was too detailed to draw alongside the others, so it is shown as a pin.", "lm-hint"));
		let i = Q("button", "Show on the map", "lm-world-back");
		if (i.onclick = () => {
			let t = z_(e, 0);
			if (t) {
				let e = Math.max(C.zoom, Math.min(_?.map.maxZoom ?? 18, 10));
				nt(e, {
					x: t.x * 2 ** e,
					y: t.y * 2 ** e
				});
			}
		}, r.append(i), t.length) {
			let e = Q("div", void 0, "lm-device-list lm-world-in-outage-list");
			for (let n of t) {
				let t = Q("button", `⚡ ${X(n)} · ${n.nodes.length} device${n.nodes.length === 1 ? "" : "s"}`);
				t.onclick = () => {
					ft({
						type: "site",
						id: n.id
					}), at(n);
				}, e.append(t);
			}
			r.append(Q("div", "LOCATIONS INSIDE THIS AREA", "lm-eyebrow lm-world-section"), e);
		}
		if (n.length) {
			let e = Q("div", void 0, "lm-device-list");
			for (let { site: t, near: r } of n.sort((e, t) => e.near.km - t.near.km)) {
				let n = Q("button", `${X(t)} · ${lt(r.km)} away`);
				n.onclick = () => {
					ft({
						type: "site",
						id: t.id
					}), at(t);
				}, e.append(n);
			}
			r.append(Q("div", "LOCATIONS WITHIN 1 KM", "lm-eyebrow lm-world-section"), e);
		}
		r.append(bt());
	}
	function wt(e) {
		let t = v.find((t) => t.nodes.includes(e)), n = Q("button", `← ${X(t)}`, "lm-world-back");
		n.onclick = () => ft({
			type: "site",
			id: t.id
		}), r.append(pt(), n, Q("div", `${e.role} / DEVICE`, "lm-eyebrow"), Q("h2", F(e)), st([
			["Status", e.status],
			...e.hostname.trim() && e.hostname.trim() !== F(e) ? [[P(e.hostname.trim()) ? "IP address" : "Hostname", e.hostname.trim()]] : [],
			...e.sysName?.trim() && e.sysName.trim() !== F(e) ? [["sysName", e.sysName.trim()]] : [],
			["Location", X(t)],
			...ue(e) ? [["Site", ue(e)]] : []
		]));
		let i = ut(t);
		if (i && r.append(i), e.url) {
			let t = new URL(e.url, location.href);
			if (t.origin === location.origin) {
				let e = Q("a", "Open in LibreNMS ↗", "lm-device-link");
				e.href = t.href, r.append(e);
			}
		}
	}
	function Tt(e) {
		let t = new Map(g.nodes.map((e) => [e.id, F(e)])), n = Q("ul", void 0, "lm-world-links-list"), r = M(), i = h?.config.staleAfter ?? 900;
		for (let a of e) {
			let e = _g(a, r, i), o = Q("li"), s = Q("strong", e.label);
			s.style.color = e.color;
			let c = a.targetPortId ? a.targetPort : `${a.targetPort} (reported by neighbor)`;
			o.append(s, Q("span", `${t.get(a.source) ?? a.source} ${a.sourcePort} ↔ ${t.get(a.target) ?? a.target} ${c}`)), n.append(o);
		}
		return n;
	}
	function Et(e) {
		r.append(pt(), Q("div", "CONNECTIONS", "lm-eyebrow"), Q("h2", `${X(e.a)} ↔ ${X(e.b)}`), st([["Links", String(e.links.length)], ["Status", e.label]]), Tt(e.links));
		for (let t of [e.a, e.b]) {
			let e = Q("button", `Show ${X(t)}`, "lm-world-back");
			e.onclick = () => {
				ft({
					type: "site",
					id: t.id
				}), at(t);
			}, r.append(e);
		}
	}
	function Dt() {
		let e = v.filter((e) => e.status === "down");
		if (!e.length) {
			N(h && g.nodes.some((e) => e.status === "down") ? "Down devices have no coordinates or are hidden by the current filters." : "No located devices are down.");
			return;
		}
		k = (k + 1) % e.length;
		let t = e[k];
		ft({
			type: "site",
			id: t.id
		}), at(t), N(`Problem location ${k + 1} of ${e.length}: ${X(t)}`);
	}
	async function Ot() {
		if (!D) {
			D = !0, m("refresh").disabled = !0;
			try {
				let [n, r] = await Promise.all([Z(e.dataset.endpoint, "topology"), Z(e.dataset.locationsEndpoint, "locations")]);
				if (!fv(n) || !Array.isArray(n.devices) || !Array.isArray(n.links) || !fv(n.config)) throw Error("Unexpected topology response.");
				h = n, _ = ve(r), g = mg(h), me = new Map([..._.locations].sort((e, t) => Number(e.id) - Number(t.id) || e.id.localeCompare(t.id)).map((e, t) => [e.id, t + 1])), j = Number.isFinite(h.generatedAt) ? h.generatedAt - Date.now() / 1e3 : 0;
				let i = p.value;
				p.replaceChildren(new Option("All device groups", ""), ...g.deviceGroups.map((e) => new Option(e.name, e.id))), p.value = g.deviceGroups.some((e) => e.id === i) ? i : "", kt(), ye(), ot(), O ||= (it(), !0), t(".lm-updated").textContent = `Snapshot fetched · ${(/* @__PURE__ */ new Date(h.generatedAt * 1e3)).toLocaleTimeString()}`, N(_.locations.length ? `${v.reduce((e, t) => e + t.nodes.length, 0)} devices at ${v.length} locations` : "No devices have map coordinates yet.");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Unable to load device locations";
				if (h && !(e instanceof dv && uv.has(e.status))) {
					N(`${t} · Showing the data from ${(/* @__PURE__ */ new Date(h.generatedAt * 1e3)).toLocaleTimeString()}.`, !0);
					return;
				}
				h = void 0, _ = void 0, g = {
					nodes: [],
					links: [],
					deviceGroups: []
				}, w = void 0, O = !1, ye(), ot(), N(t, !0);
			} finally {
				D = !1, m("refresh").disabled = !1;
			}
		}
	}
	function kt() {
		let e = t(".lm-world-attribution");
		e.textContent = [
			_?.map.tiles ? _.map.attribution : "",
			H ? W || "Weather warnings © MET Norway" : "",
			J ? `Power outages: grid operators' maps via ${te?.source ?? "DRIFT"}` : ""
		].filter(Boolean).join(" · "), e.hidden = !e.textContent;
	}
	async function At() {
		if (H && !K && V) {
			K = !0, ot();
			try {
				let e = Z_(await Z(V, "weather warning"));
				if (!H) return;
				U = e.warnings, W = e.attribution, G = e.fetchedAt || Date.now() / 1e3, Ve(), ye(), kt();
				let t = (/* @__PURE__ */ new Date(G * 1e3)).toLocaleTimeString();
				N(e.stale ? `MET Norway is unreachable · Showing the weather warnings from ${t}.` : `${U.length} active weather warning${U.length === 1 ? "" : "s"} · ${q.size} location${q.size === 1 ? "" : "s"} affected · MET Norway, ${t}`, e.stale);
			} catch (e) {
				N(`${e instanceof Error ? e.message : "Weather warnings are unavailable."}${U.length ? " · Showing the last warnings received." : ""}`, !0);
			} finally {
				K = !1, ot();
			}
		}
	}
	function jt(e) {
		H = e && !!V, R(), H || (U = [], G = 0, w?.type === "warning" && (w = void 0)), Ve(), ye(), kt(), ot(), H && At();
	}
	async function Mt() {
		if (J && !ie && ee) {
			ie = !0, ot();
			try {
				let [t, n] = await Promise.all([Z(ee, "power outage").then(A_), Z(e.dataset.powerHealthEndpoint, "power outage status").then(M_).catch(() => void 0)]);
				if (!J) return;
				Y = t.outages, te = t.evidence, ne = t.complete, re = n, ae = t.skipped, Je(), ye(), kt();
				let r = Y.filter((e) => e.kind === "current").length, i = Object.entries(t.skipped).filter(([e]) => e !== "shape_too_large").reduce((e, [, t]) => e + t, 0), a = [
					...t.evidence.limitations,
					...t.complete ? [] : ["the list may be incomplete"],
					...i ? [`${i} outage${i === 1 ? "" : "s"} could not be placed`] : []
				];
				N(`${r} current and ${Y.length - r} planned power outage${Y.length === 1 ? "" : "s"} · ${se.size} location${se.size === 1 ? "" : "s"} inside an outage area${ce.size ? `, ${ce.size} within 1 km` : ""} · ${U_(t.evidence)}${a.length ? ` · ⚠ ${a.join("; ")}` : ""}`, a.length > 0);
			} catch (e) {
				N(`${e instanceof Error ? e.message : "Power outages are unavailable."}${Y.length ? " · Showing the last outages received." : ""}`, !0);
			} finally {
				ie = !1, ot();
			}
		}
	}
	function Nt(e) {
		J = e && !!ee, R(), J || (Y = [], te = void 0, re = void 0, ne = !0, ae = {}, oe = -1, le.clear(), w?.type === "outage" && (w = void 0)), Je(), ye(), kt(), ot(), J && Mt();
	}
	let Pt;
	a.addEventListener("pointerdown", (e) => {
		if (e.button !== 0 || e.target.closest(".lm-world-marker, .lm-world-link")) return;
		let t = e.target.closest(".lm-world-warning")?.dataset.warning, n = e.target.closest(".lm-world-outage, .lm-world-outage-pin")?.dataset.outage;
		Pt = {
			id: e.pointerId,
			start: {
				x: e.clientX,
				y: e.clientY
			},
			center: { ...C.center },
			moved: !1,
			warning: t,
			outage: n
		}, a.setPointerCapture(e.pointerId), a.classList.add("lm-dragging");
	}), a.addEventListener("pointermove", (e) => {
		if (!Pt || e.pointerId !== Pt.id) return;
		let t = e.clientX - Pt.start.x, n = e.clientY - Pt.start.y;
		!Pt.moved && Math.hypot(t, n) < 4 || (Pt.moved = !0, C = {
			zoom: C.zoom,
			center: v_({
				x: Pt.center.x - t,
				y: Pt.center.y - n
			}, C.zoom, Ee().h)
		}, tt());
	});
	let Ft = (e) => {
		Pt && e.pointerId === Pt.id && (!Pt.moved && e.type === "pointerup" && (Pt.outage ? ft({
			type: "outage",
			id: Pt.outage
		}) : Pt.warning ? ft({
			type: "warning",
			id: Pt.warning
		}) : w && ft(void 0)), Pt = void 0, a.classList.remove("lm-dragging"));
	};
	a.addEventListener("pointerup", Ft), a.addEventListener("pointercancel", Ft);
	let It = 0;
	a.addEventListener("wheel", (e) => {
		if (e.preventDefault(), e.timeStamp - It < 180 || e.deltaY === 0) return;
		It = e.timeStamp;
		let t = a.getBoundingClientRect();
		rt(e.deltaY < 0 ? 1 : -1, {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		});
	}, { passive: !1 }), a.addEventListener("dblclick", (e) => {
		if (e.target.closest(".lm-world-marker, .lm-world-link")) return;
		let t = a.getBoundingClientRect();
		rt(e.shiftKey ? -1 : 1, {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		});
	}), l.addEventListener("click", (e) => {
		let t = e.target.closest(".lm-world-marker");
		t?.dataset.site && ft({
			type: "site",
			id: t.dataset.site
		});
	});
	let Lt = (e) => {
		let t = e.target.closest(".lm-world-link");
		t?.dataset.link && ft({
			type: "link",
			id: t.dataset.link
		});
	};
	c.addEventListener("click", Lt), c.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), Lt(e));
	}), f.addEventListener("input", () => {
		f.value = r_(f.value), ye();
	}), p.addEventListener("change", () => {
		ye(), it();
	}), e.addEventListener("click", (t) => {
		switch (t.target.closest("[data-world]")?.dataset.world) {
			case "problems":
				T = !T, ot(), ye(), T && v.length && it();
				break;
			case "links":
				E = !E, ot(), Le(), et();
				break;
			case "weather":
				jt(!H);
				break;
			case "power":
				Nt(!J);
				break;
			case "addresses":
				z = !z, R(), ot(), ye();
				break;
			case "names":
				B = !B, R(), ot(), ye();
				break;
			case "refresh":
				Ot();
				break;
			case "fit":
				it();
				break;
			case "zoom-in":
				rt(1);
				break;
			case "zoom-out":
				rt(-1);
				break;
			case "next-down":
				Dt();
				break;
			case "next-outage":
				dt();
				break;
			case "fullscreen": (document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen()).catch(() => N("Fullscreen is unavailable in this browser."));
		}
	}), document.addEventListener("keydown", (t) => {
		if (!Og(t, e)) return;
		let n = (e, t) => nt(C.zoom, {
			x: C.center.x + e,
			y: C.center.y + t
		}), r = {
			"/": () => {
				f.disabled || f.focus();
			},
			f: it,
			"+": () => rt(1),
			"=": () => rt(1),
			"-": () => rt(-1),
			d: Dt,
			o: dt,
			ArrowLeft: () => n(-120, 0),
			ArrowRight: () => n(120, 0),
			ArrowUp: () => n(0, -120),
			ArrowDown: () => n(0, 120),
			Escape: () => {
				w && ft(void 0);
			}
		}[t.key.length === 1 ? t.key.toLowerCase() : t.key];
		r && (t.preventDefault(), r());
	}), new ResizeObserver(() => {
		Te(), nt(C.zoom, C.center), !O && v.length && (it(), O = !0);
	}).observe(a), setInterval(() => {
		h && y.length && Ce();
	}, 1e4), setInterval(() => {
		document.hidden || Ot();
	}, 6e4), setInterval(() => {
		H && !document.hidden && At();
	}, sv), setInterval(() => {
		J && !document.hidden && Mt();
	}, cv), e.dataset.debug === "true" && Object.defineProperty(window, "libremapWorldDebug", {
		value: () => ({
			zoom: C.zoom,
			center: { ...C.center },
			markers: v.map((e) => ({
				id: e.id,
				name: e.name,
				label: he(e),
				text: Pe.get(e.id)?.querySelector(".lm-world-label")?.textContent ?? "",
				count: e.nodes.length,
				status: e.status,
				warning: $_(q.get(e.id) ?? []) ?? null,
				outage: se.get(e.id)?.[0]?.kind ?? null,
				nearOutage: ce.get(e.id)?.[0]?.outage.kind ?? null,
				position: De(u_(e, C.zoom))
			})),
			links: y.map((e) => ({
				key: e.key,
				count: e.links.length,
				state: e.state,
				label: e.label,
				color: e.color
			})),
			undrawn: {
				withinSite: Object.fromEntries([...x].map(([e, t]) => [e, t.length])),
				unlocated: S
			},
			warnings: H ? U.map((e) => ({
				id: e.id,
				level: e.level,
				drawn: !!Be.get(e.id)?.getAttribute("d")
			})) : [],
			outages: J ? Y.map((e) => ({
				id: e.id,
				kind: e.kind,
				shape: B_(e),
				drawn: !!Ge.get(e.id)?.getAttribute("d") || !!Ke.get(e.id)?.getAttribute("transform"),
				pinned: !!Ke.get(e.id)?.getAttribute("transform")
			})) : [],
			tiles: [...je.values()].map((e) => e.src)
		}),
		configurable: !0
	}), ot(), mt(), Ve(), Je(), Ot(), H && At(), J && Mt();
}
//#endregion
//#region node_modules/elkjs/lib/elk-worker.min.js?worker
var mv = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	(function(n) {
		if (typeof e == "object" && t !== void 0) t.exports = n();
		else if (typeof define == "function" && define.amd) define([], n);
		else {
			var r = typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : this;
			r.ELK = n();
		}
	})(function() {
		return (function() {
			function e(t, n, r) {
				function i(o, s) {
					if (!n[o]) {
						if (!t[o]) {
							var c = typeof l == "function" && l;
							if (!s && c) return c(o, !0);
							if (a) return a(o, !0);
							var u = /* @__PURE__ */ Error("Cannot find module '" + o + "'");
							throw u.code = "MODULE_NOT_FOUND", u;
						}
						var d = n[o] = { exports: {} };
						t[o][0].call(d.exports, function(e) {
							var n = t[o][1][e];
							return i(n || e);
						}, d, d.exports, e, t, n, r);
					}
					return n[o].exports;
				}
				for (var a = typeof l == "function" && l, o = 0; o < r.length; o++) i(r[o]);
				return i;
			}
			return e;
		})()({
			1: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;
				function r(e) {
					"@babel/helpers - typeof";
					return r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
						return typeof e;
					} : function(e) {
						return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
					}, r(e);
				}
				function i(e, t) {
					if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
				}
				function a(e, t) {
					for (var n = 0; n < t.length; n++) {
						var r = t[n];
						r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, s(r.key), r);
					}
				}
				function o(e, t, n) {
					return t && a(e.prototype, t), n && a(e, n), Object.defineProperty(e, "prototype", { writable: !1 }), e;
				}
				function s(e) {
					var t = c(e, "string");
					return r(t) == "symbol" ? t : t + "";
				}
				function c(e, t) {
					if (r(e) != "object" || !e) return e;
					var n = e[Symbol.toPrimitive];
					if (n !== void 0) {
						var i = n.call(e, t || "default");
						if (r(i) != "object") return i;
						throw TypeError("@@toPrimitive must return a primitive value.");
					}
					return (t === "string" ? String : Number)(e);
				}
				n.default = /*#__PURE__*/ function() {
					function e() {
						var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = n.defaultLayoutOptions, a = r === void 0 ? {} : r, o = n.algorithms, s = o === void 0 ? [
							"layered",
							"stress",
							"mrtree",
							"radial",
							"force",
							"disco",
							"sporeOverlap",
							"sporeCompaction",
							"rectpacking"
						] : o, c = n.workerFactory, u = n.workerUrl;
						if (i(this, e), this.defaultLayoutOptions = a, this.initialized = !1, u === void 0 && c === void 0) throw Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");
						var d = c;
						u !== void 0 && c === void 0 && (d = function(e) {
							return new Worker(e);
						});
						var f = d(u);
						if (typeof f.postMessage != "function") throw TypeError("Created worker does not provide the required 'postMessage' function.");
						this.worker = new l(f), this.worker.postMessage({
							cmd: "register",
							algorithms: s
						}).then(function(e) {
							return t.initialized = !0;
						}).catch(console.err);
					}
					return o(e, [
						{
							key: "layout",
							value: function(e) {
								var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = t.layoutOptions, r = n === void 0 ? this.defaultLayoutOptions : n, i = t.logging, a = i !== void 0 && i, o = t.measureExecutionTime, s = o !== void 0 && o;
								return e ? this.worker.postMessage({
									cmd: "layout",
									graph: e,
									layoutOptions: r,
									options: {
										logging: a,
										measureExecutionTime: s
									}
								}) : Promise.reject(/* @__PURE__ */ Error("Missing mandatory parameter 'graph'."));
							}
						},
						{
							key: "knownLayoutAlgorithms",
							value: function() {
								return this.worker.postMessage({ cmd: "algorithms" });
							}
						},
						{
							key: "knownLayoutOptions",
							value: function() {
								return this.worker.postMessage({ cmd: "options" });
							}
						},
						{
							key: "knownLayoutCategories",
							value: function() {
								return this.worker.postMessage({ cmd: "categories" });
							}
						},
						{
							key: "terminateWorker",
							value: function() {
								this.worker && this.worker.terminate();
							}
						}
					]);
				}();
				var l = /*#__PURE__*/ function() {
					function e(t) {
						var n = this;
						if (i(this, e), t === void 0) throw Error("Missing mandatory parameter 'worker'.");
						this.resolvers = {}, this.worker = t, this.worker.onmessage = function(e) {
							setTimeout(function() {
								n.receive(n, e);
							}, 0);
						};
					}
					return o(e, [
						{
							key: "postMessage",
							value: function(e) {
								var t = this.id || 0;
								this.id = t + 1, e.id = t;
								var n = this;
								return new Promise(function(r, i) {
									n.resolvers[t] = function(e, t) {
										e ? (n.convertGwtStyleError(e), i(e)) : r(t);
									}, n.worker.postMessage(e);
								});
							}
						},
						{
							key: "receive",
							value: function(e, t) {
								var n = t.data, r = e.resolvers[n.id];
								r && (delete e.resolvers[n.id], n.error ? r(n.error) : r(null, n.data));
							}
						},
						{
							key: "terminate",
							value: function() {
								this.worker && this.worker.terminate();
							}
						},
						{
							key: "convertGwtStyleError",
							value: function(e) {
								if (e) {
									var t = e.__java$exception;
									t && (t.cause && t.cause.backingJsObject && (e.cause = t.cause.backingJsObject, this.convertGwtStyleError(e.cause)), delete e.__java$exception);
								}
							}
						}
					]);
				}();
			}, {}],
			2: [function(e, t, n) {
				var r = e("./elk-api.js").default;
				Object.defineProperty(t.exports, "__esModule", { value: !0 }), t.exports = r, r.default = r;
			}, { "./elk-api.js": 1 }]
		}, {}, [2])(2);
	});
})))(), 1);
function hv(e) {
	return new Worker("" + new URL("assets/elk-worker.min-ChMHynyl.js", import.meta.url).href, {
		type: "module",
		name: e?.name
	});
}
//#endregion
//#region frontend/layout-positions.ts
var gv = 256, _v = 180, vv = 246, yv = 155, bv = 8, xv = 4, Sv = 4, Cv = [{
	column: 260,
	row: 210
}, {
	column: 238,
	row: 135
}], wv = 2;
function Tv(e, t) {
	if (e <= 0) return !1;
	let n = Math.max(1, Math.round(e / t));
	return Math.abs(e - n * t) <= wv;
}
function Ev(e, t) {
	if (e.length <= bv) return !1;
	let n = /* @__PURE__ */ new Map();
	for (let [, t] of e) {
		let e = Math.round(t.y);
		n.set(e, [...n.get(e) ?? [], t.x]);
	}
	let r = [...n.keys()].sort((e, t) => e - t), i = r.slice(1).map((e, t) => e - r[t]).filter((e) => e > 0), a = [...n.values()].flatMap((e) => {
		let t = [...e].sort((e, t) => e - t);
		return t.slice(1).map((e, n) => e - t[n]).filter((e) => e > 0);
	});
	if (i.length === 0 || a.length < 2) return !1;
	let o = i.filter((e) => Tv(e, t.row)).length, s = a.filter((e) => Tv(e, t.column)).length;
	return o / i.length >= .75 && s / a.length >= .75;
}
function Dv(e, t) {
	let n = Object.entries(e);
	if (n.length <= bv) return e;
	let r = n.map(([, e]) => e.x), i = n.map(([, e]) => e.y), a = Math.max(...r) - Math.min(...r) + 210, o = Math.max(...i) - Math.min(...i) + 76, s = n.filter(([e]) => !t.has(e));
	return a / o <= Sv && !Cv.some((e) => Ev(s, e)) ? e : Object.fromEntries(n.filter(([e]) => t.has(e)));
}
function Ov(e, t, n = !1) {
	let r = /* @__PURE__ */ new Map();
	for (let t of e.nodes) r.set(t.tier, [...r.get(t.tier) ?? [], t]);
	let i = n ? vv : gv, a = n ? yv : _v, o = n ? 1.2 : 1.4, s = Math.max(n ? xv : bv, Math.ceil(Math.sqrt(e.nodes.length * o * a / i))), c = {}, l = 0;
	for (let e of [...r.keys()].sort((e, t) => e - t)) {
		let n = r.get(e);
		n.sort((e, n) => e.site.localeCompare(n.site) || (t.get(e.id) ?? 0) - (t.get(n.id) ?? 0) || e.id.localeCompare(n.id));
		for (let e = 0; e < n.length; e += s) {
			let t = n.slice(e, e + s);
			t.forEach((e, n) => {
				c[e.id] = {
					x: (n - (t.length - 1) / 2) * i,
					y: l * a
				};
			}), l++;
		}
	}
	return c;
}
//#endregion
//#region frontend/layout.ts
var kv = () => new mv.default({ workerFactory: () => new hv() }), Av = kv();
function jv() {
	Av.terminateWorker(), Av = kv();
}
async function Mv(e) {
	let t = new Map(e.nodes.map((e) => [e.id, e])), n = e.links.filter((e) => t.get(e.source).tier !== t.get(e.target).tier).map((e, n) => {
		let r = t.get(e.source).tier < t.get(e.target).tier;
		return {
			id: String(n),
			sources: [r ? e.source : e.target],
			targets: [r ? e.target : e.source]
		};
	}), r = await Av.layout({
		id: "root",
		layoutOptions: {
			"elk.algorithm": "layered",
			"elk.direction": "DOWN",
			"elk.spacing.nodeNode": "60",
			"elk.layered.spacing.nodeNodeBetweenLayers": "120",
			"elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES"
		},
		children: e.nodes.map((e) => ({
			id: e.id,
			width: 210,
			height: 76
		})),
		edges: n
	});
	return Ov(e, new Map(r.children.map((e) => [e.id, e.x ?? 0])));
}
//#endregion
//#region frontend/link-preview.ts
var Nv = 300, Pv = 150, Fv = 400;
function Iv(e, t, n) {
	let r = e.querySelector(".lm-canvas-wrap"), i = e.querySelector(".lm-canvas"), a = document.createElement("div");
	a.className = "lm-link-preview", a.hidden = !0, a.setAttribute("role", "tooltip"), r.append(a);
	let o = "", s, c = () => {
		o = "", clearTimeout(s), a.hidden = !0, a.replaceChildren();
	}, l = (t) => {
		if (!/^[1-9][0-9]*$/.test(t)) return;
		let r = new URL(e.dataset.homeUrl || "/", location.href);
		if (r.origin !== location.origin) return;
		r.pathname = `${r.pathname.replace(/\/+$/, "")}/graph`.replace(/\/{2,}/g, "/"), r.search = "", r.hash = "";
		let i = {
			type: "port_bits",
			id: t,
			from: "-1d",
			legend: "no",
			width: String(Nv),
			height: String(Pv),
			refreshnum: String(n() ?? 0)
		};
		for (let [e, t] of Object.entries(i)) r.searchParams.set(e, t);
		return r.href;
	}, u = (e) => {
		let t = {
			x: i.offsetLeft + e.x + 14,
			y: i.offsetTop + e.y + 14
		}, n = Math.max(8, r.clientWidth - a.offsetWidth - 8), o = Math.max(8, r.clientHeight - a.offsetHeight - 8);
		a.style.left = `${Math.max(8, Math.min(t.x, n))}px`, a.style.top = `${Math.max(8, Math.min(t.y, o))}px`;
	}, d = (e, t) => {
		let n = [{
			hostname: String(e.source().data("name") ?? ""),
			port: String(e.data("sourcePort") ?? ""),
			portId: String(e.data("sourcePortId") ?? "")
		}, {
			hostname: String(e.target().data("name") ?? ""),
			port: String(e.data("targetPort") ?? ""),
			portId: String(e.data("targetPortId") ?? "")
		}], r = document.createElement("div");
		r.className = "lm-link-preview-title", r.textContent = "Interface traffic · last 24 hours";
		let i = document.createElement("div");
		i.className = "lm-link-preview-graphs";
		for (let e of n) {
			let t = document.createElement("figure"), n = document.createElement("figcaption"), r = document.createElement("strong");
			r.textContent = e.hostname;
			let a = document.createElement("span");
			a.textContent = e.port, n.append(r, a), t.append(n);
			let o = l(e.portId);
			if (o) {
				let n = document.createElement("img");
				n.src = o, n.width = Nv, n.height = Pv, n.alt = `Traffic graph for ${e.hostname} ${e.port}`, n.decoding = "async", t.append(n);
			} else {
				let e = document.createElement("div");
				e.className = "lm-link-preview-unavailable", e.textContent = "Traffic graph unavailable", t.append(e);
			}
			i.append(t);
		}
		a.replaceChildren(r, i), a.hidden = !1, u(t);
	};
	return t.on("mouseover", "edge", (e) => {
		clearTimeout(s), o = e.target.id();
		let t = e.target, n = e.renderedPosition ?? t.renderedMidpoint();
		s = setTimeout(() => {
			o === t.id() && t.visible() && d(t, n);
		}, Fv);
	}), t.on("mouseout", "edge", (e) => {
		o === e.target.id() && c();
	}), t.on("pan zoom", c), i.addEventListener("mouseleave", c), { hide: c };
}
//#endregion
//#region frontend/demo.ts
function Lv() {
	let e = Math.floor(Date.now() / 1e3);
	return {
		generatedAt: e,
		config: {
			prefixes: ["hk-"],
			staleAfter: 900,
			overrides: {}
		},
		devices: [
			"hk-rossa1agg1",
			"hk-rossa1agg2",
			"hk-heiane1agg1",
			"hk-heiane1agg2",
			"hk-rossa1er1",
			"hk-rossa1er2",
			"hk-rossa1er3",
			"hk-rossa1er4",
			"hk-heiane1er1",
			"hk-heiane1er2",
			"hk-kvala1er1",
			"hk-solvang1er1",
			"hk-flotmyr1er1",
			"hk-bandadalen1er2",
			"hk-se1er1",
			"unclassified-switch"
		].map((e, t) => ({
			id: String(t),
			hostname: e,
			status: t === 14 ? "down" : t === 15 ? "unknown" : "up"
		})),
		deviceGroups: [{
			id: "101",
			name: "Rossa access",
			deviceIds: [
				"0",
				"1",
				"4",
				"5",
				"6",
				"7",
				"10",
				"11",
				"12",
				"15"
			]
		}, {
			id: "102",
			name: "Heiane access",
			deviceIds: [
				"2",
				"3",
				"8",
				"9",
				"13",
				"14"
			]
		}],
		links: [
			[
				0,
				1,
				12
			],
			[
				1,
				2,
				34
			],
			[
				2,
				3,
				8
			],
			[
				0,
				4,
				19
			],
			[
				1,
				4,
				22
			],
			[
				0,
				5,
				5
			],
			[
				1,
				6,
				81
			],
			[
				1,
				7,
				52
			],
			[
				2,
				8,
				7
			],
			[
				3,
				9,
				94
			],
			[
				4,
				10,
				14
			],
			[
				10,
				11,
				4
			],
			[
				11,
				5,
				8
			],
			[
				6,
				12,
				27
			],
			[
				8,
				13,
				0
			],
			[
				13,
				14,
				3
			],
			[
				14,
				9,
				11
			],
			[
				0,
				4,
				6
			]
		].map(([t, n, r], i) => ({
			id: `demo-${i}`,
			source: String(t),
			target: String(n),
			sourcePortId: String(i * 2 + 1),
			targetPortId: String(i * 2 + 2),
			sourcePort: `xe-0/0/${i}`,
			targetPort: "xe-0/0/0",
			speedBps: 1e10,
			inBps: r * 1e8,
			outBps: r * 6e7,
			sampledAt: i === 15 ? e - 1800 : e,
			status: n === 14 || t === 14 ? "down" : "up"
		}))
	};
}
var Rv = () => ({
	rootId: null,
	deviceGroupId: null,
	site: "",
	search: "",
	backbone: !1,
	showOther: !1,
	hops: 1,
	positions: {},
	pinned: [],
	zoom: 1,
	pan: {
		x: 0,
		y: 0
	}
}), zv = (e) => !!e && typeof e == "object" && !Array.isArray(e), Bv = (e) => typeof e == "number" && Number.isFinite(e) && Math.abs(e) <= 1e6, Vv = (e) => zv(e) && Bv(e.x) && Bv(e.y);
function Hv(e, t) {
	let n = Rv();
	if (!zv(e)) return n;
	let r = t ? new Set(t.nodes.map((e) => e.id)) : void 0, i = (e) => /^\d+$/.test(e) && (!r || r.has(e));
	typeof e.rootId == "string" && i(e.rootId) && (!t || t.nodes.some((t) => t.id === e.rootId && t.role === "AGG")) && (n.rootId = e.rootId), typeof e.deviceGroupId == "string" && /^[1-9]\d{0,9}$/.test(e.deviceGroupId) && (!t || t.deviceGroups.some((t) => t.id === e.deviceGroupId)) && (n.deviceGroupId = e.deviceGroupId), typeof e.site == "string" && n_(e.site) <= 200 && (!t || t.nodes.some((t) => t.site === e.site)) && (n.site = e.site), typeof e.search == "string" && (n.search = r_(e.search)), n.backbone = e.backbone === !0, n.showOther = e.showOther === !0, typeof e.hops == "number" && Number.isInteger(e.hops) && e.hops >= 1 && e.hops <= 5 && (n.hops = e.hops);
	let a = t ? t.nodes.length : t_, o = 0;
	if (zv(e.positions)) for (let [t, r] of Object.entries(e.positions)) {
		if (o >= a) break;
		i(t) && Vv(r) && (n.positions[t] = {
			x: r.x,
			y: r.y
		}, o++);
	}
	return Array.isArray(e.pinned) && (n.pinned = [...new Set(e.pinned.filter((e) => typeof e == "string" && i(e) && Object.hasOwn(n.positions, e)))].slice(0, a)), typeof e.zoom == "number" && Number.isFinite(e.zoom) && (n.zoom = Math.min(2.5, Math.max(.15, e.zoom))), Vv(e.pan) && (n.pan = {
		x: e.pan.x,
		y: e.pan.y
	}), n;
}
function Uv(e, t) {
	let n = e.nodes.find((e) => e.id === t && e.role === "AGG");
	if (!n) return new Set(e.nodes.map((e) => e.id));
	let r = new Map(e.nodes.map((e) => [e.id, e])), i = new Map(e.nodes.map((e) => [e.id, []]));
	for (let t of e.links) i.get(t.source)?.push(t.target), i.get(t.target)?.push(t.source);
	let a = e.nodes.filter((e) => e.role === "AGG" && e.site === n.site).map((e) => e.id), o = new Set(a);
	for (let e = 0; e < a.length; e++) {
		let t = r.get(a[e]).tier;
		for (let n of i.get(a[e]) ?? []) {
			if (o.has(n)) continue;
			let e = r.get(n);
			if (e.role === "AGG") {
				o.add(n);
				continue;
			}
			e.tier <= t || (o.add(n), a.push(n));
		}
	}
	return o;
}
function Wv(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let t of e.links) if (r.has(t.source) && r.has(t.target)) for (let e of [t.source, t.target]) {
		let n = i.get(e);
		n ? n.push(t) : i.set(e, [t]);
	}
	let a = /* @__PURE__ */ new Set([t]), o = /* @__PURE__ */ new Set(), s = [t];
	for (let e = 0; e < n && s.length; e++) {
		let e = [];
		for (let t of s) for (let n of i.get(t) ?? []) {
			o.add(n.id);
			let r = n.source === t ? n.target : n.source;
			a.has(r) || (a.add(r), e.push(r));
		}
		s = e;
	}
	return {
		nodes: a,
		links: o
	};
}
function Gv(e, t) {
	let n = Uv(e, t.rootId), r = t.deviceGroupId ? e.deviceGroups.find((e) => e.id === t.deviceGroupId) : void 0;
	if (t.deviceGroupId && !r) return /* @__PURE__ */ new Set();
	let i = r ? new Set(r.deviceIds) : void 0, a = new Set(e.nodes.filter((e) => {
		let r = t.backbone ? e.role === "AGG" : t.showOther || e.role === "AGG" || e.role === "ER";
		return n.has(e.id) && (!i || i.has(e.id)) && (!t.site || e.site === t.site) && r;
	}).map((e) => e.id)), o = t.search.toLowerCase(), s = new Set(e.nodes.filter((e) => a.has(e.id) && [
		ug(e),
		e.hostname,
		e.sysName ?? ""
	].some((e) => e.toLowerCase().includes(o))).map((e) => e.id)), c = new Set(s);
	if (t.search) for (let t of e.links) s.has(t.source) && a.has(t.target) && c.add(t.target), s.has(t.target) && a.has(t.source) && c.add(t.source);
	return c;
}
var Kv = 228, qv = 94;
function Jv(e, t, n, r) {
	let i = {}, a = /* @__PURE__ */ new Map(), o = (e, t) => `${e}:${t}`, s = (e) => {
		let t = o(Math.floor(e.x / Kv), Math.floor(e.y / qv)), n = a.get(t);
		n ? n.push(e) : a.set(t, [e]);
	}, c = (e) => {
		let t = Math.floor(e.x / Kv), n = Math.floor(e.y / qv);
		for (let r = -1; r <= 1; r++) for (let i = -1; i <= 1; i++) for (let s of a.get(o(t + r, n + i)) ?? []) if (Math.abs(s.x - e.x) < Kv && Math.abs(s.y - e.y) < qv) return !0;
		return !1;
	};
	for (let t of e.nodes) Vv(n[t.id]) && (i[t.id] = { ...n[t.id] }, s(i[t.id]));
	for (let n of e.nodes) if (!i[n.id]) {
		let r = { ...t[n.id] ?? {
			x: 0,
			y: n.tier * 180
		} }, a = r.x;
		for (let t = 1; c(r) && t <= e.nodes.length * 2 + 1; t++) r.x = a + Math.ceil(t / 2) * Kv * (t % 2 ? 1 : -1);
		i[n.id] = r, s(r);
	}
	for (let e of r) i[e] && Vv(n[e]) && (i[e] = { ...n[e] });
	return i;
}
//#endregion
//#region frontend/view-store.ts
var Yv = class extends Error {
	status;
	constructor(e, t = 0) {
		super(e), this.status = t;
	}
}, Xv = {
	PUT: "This view changed in another tab. Reload views before saving again.",
	DELETE: "This view changed in another tab. Reload views before deleting it."
};
function Zv(e, t) {
	let n = new URL(e, location.href);
	if (n.origin !== location.origin) throw Error("Saved views must use the same origin.");
	async function r(e, r, i, a = {}) {
		let o = new URL(r ? `${n.href.replace(/\/$/, "")}/${encodeURIComponent(r)}` : n.href);
		for (let [e, t] of Object.entries(a)) o.searchParams.set(e, t);
		let s = {
			Accept: "application/json",
			"X-CSRF-TOKEN": t
		};
		i !== void 0 && (s["Content-Type"] = "application/json");
		let c = await fetch(o, {
			method: e,
			credentials: "same-origin",
			headers: s,
			body: i === void 0 ? void 0 : JSON.stringify(i),
			signal: AbortSignal.timeout(2e4)
		});
		if (!c.ok) throw new Yv(await Qv(c, e), c.status);
		return c.status === 204 ? void 0 : c.json();
	}
	return {
		list: async () => {
			let e = await r("GET");
			if (!Array.isArray(e.views)) throw Error("Unexpected saved views response.");
			return e.views;
		},
		save: async (e, t, n) => (await r(n ? "PUT" : "POST", n?.id, {
			name: e,
			state: t,
			...n ? { revision: n.revision } : {}
		})).view,
		remove: async (e) => {
			await r("DELETE", e.id, void 0, { revision: String(e.revision) });
		}
	};
}
async function Qv(e, t) {
	if (e.status === 422) {
		let t = await e.json().catch(() => void 0), n = t && typeof t == "object" && "message" in t && typeof t.message == "string" ? t.message.trim() : "";
		if (n && n.length <= 300) return n;
	}
	return {
		401: "Your session has expired. Sign in and reload.",
		403: "You no longer have access to saved views.",
		404: "This view is no longer available. Reload views.",
		409: Xv[t] ?? Xv.PUT,
		419: "Your session has expired. Reload the page before saving.",
		422: "The view could not be saved. Check its name, device access and size.",
		429: "Too many requests. Wait a moment before saving again.",
		503: "Saved views are unavailable. The plugin database migration may be pending."
	}[e.status] ?? `Saved views request failed (HTTP ${e.status}).`;
}
function $v() {
	if (typeof crypto.randomUUID == "function") return crypto.randomUUID();
	let e = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
	let t = [...e].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${t.slice(0, 8)}-${t.slice(8, 12)}-${t.slice(12, 16)}-${t.slice(16, 20)}-${t.slice(20)}`;
}
function ey(e) {
	function t() {
		let t;
		try {
			t = localStorage.getItem(e);
		} catch {
			return [];
		}
		let n;
		try {
			n = JSON.parse(t ?? "[]");
		} catch {
			try {
				localStorage.setItem(e, "[]");
			} catch {}
			return [];
		}
		return Array.isArray(n) ? n.filter((e) => e && typeof e.id == "string" && typeof e.name == "string" && Number.isInteger(e.revision)).slice(0, 50).map((e) => ({
			...e,
			state: Hv(e.state)
		})) : [];
	}
	function n(t) {
		localStorage.setItem(e, JSON.stringify(t));
	}
	return {
		list: async () => t(),
		save: async (e, r, i) => {
			let a = t(), o = a.findIndex((e) => e.id === i?.id);
			if (i && (o < 0 || a[o].revision !== i.revision)) throw new Yv(Xv.PUT, 409);
			if (!i && a.length >= 50) throw new Yv("You can save up to 50 views. Delete a view before creating another.", 422);
			let s = {
				id: i?.id ?? $v(),
				name: e,
				state: Hv(r),
				revision: (i?.revision ?? 0) + 1,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			return n([s, ...a.filter((e) => e.id !== s.id)]), s;
		},
		remove: async (e) => {
			let r = t(), i = r.find((t) => t.id === e.id);
			if (!i || i.revision !== e.revision) throw new Yv(Xv.DELETE, 409);
			n(r.filter((t) => t.id !== e.id));
		}
	};
}
//#endregion
//#region frontend/views-panel.ts
function ty(e, t) {
	e.innerHTML = "<label class=\"lm-select\">Saved view <select aria-label=\"Saved view\"><option value=\"\">Current workspace</option></select></label><button data-view-action=\"save\" disabled>Save view</button><button data-view-action=\"delete\" disabled>Delete view</button><button data-view-action=\"reload\">Reload views</button><span class=\"lm-view-status\" aria-live=\"polite\"></span><dialog class=\"lm-view-dialog\" aria-labelledby=\"lm-view-title\"><form><h2 id=\"lm-view-title\">Save current view</h2><p>Remember filters, positions, pins and zoom.</p><label>View name<input name=\"name\" aria-label=\"View name\" required autocomplete=\"off\"></label><div class=\"lm-dialog-actions\"><button type=\"button\" data-view-action=\"cancel\">Cancel</button><button type=\"submit\" value=\"new\">Save as new</button><button type=\"submit\" value=\"update\">Save changes</button></div></form></dialog><dialog class=\"lm-delete-dialog\" aria-labelledby=\"lm-delete-title\"><h2 id=\"lm-delete-title\">Delete saved view?</h2><p></p><div class=\"lm-dialog-actions\"><button data-view-action=\"cancel-delete\">Cancel</button><button data-view-action=\"confirm-delete\">Delete saved view</button></div></dialog>";
	let n = e.querySelector("select"), r = e.querySelector(".lm-view-status"), i = e.querySelector(".lm-view-dialog"), a = e.querySelector(".lm-delete-dialog"), o = e.querySelector("input"), s = [], c, l = !1, u = !1, d = !1, f = 0;
	function p(e, t = !1) {
		r.textContent = e, r.classList.toggle("lm-view-error", t);
	}
	function m() {
		e.querySelectorAll("button").forEach((e) => {
			e.disabled = l;
		}), e.querySelector("[data-view-action=\"save\"]").disabled = l || d || !u || !t.store, e.querySelector("[data-view-action=\"delete\"]").disabled = l || !u || !c, e.querySelector("[data-view-action=\"reload\"]").disabled = l || !t.store, e.querySelectorAll(".lm-view-dialog button[type=\"submit\"]").forEach((e) => {
			e.disabled = l || d;
		}), n.disabled = l || d || !u;
	}
	function h() {
		n.replaceChildren(new Option("Current workspace", ""), ...s.map((e) => new Option(e.name, e.id))), n.value = c?.id ?? "", m();
	}
	function g(e) {
		e instanceof Yv && [
			401,
			403,
			404,
			419
		].includes(e.status) && (s = [], c = void 0, h()), p(e instanceof Error ? e.message : "Saved views are unavailable.", !0);
	}
	async function _() {
		if (!t.store || l) return;
		l = !0, m();
		let e = f;
		try {
			let n = await t.store.list();
			if (e !== f) return;
			s = n, c = s.find((e) => e.id === c?.id), c && t.restore(c.state), h(), p(t.demo ? "Demo views · this browser only" : "Private views · saved to LibreNMS");
		} catch (t) {
			e === f && g(t);
		} finally {
			l = !1, m();
		}
	}
	n.onchange = () => {
		c = s.find((e) => e.id === n.value), c && (t.restore(c.state), p(`Loaded “${c.name}”.`)), m();
	}, e.addEventListener("click", (t) => {
		let n = t.target.closest("[data-view-action]")?.dataset.viewAction;
		n === "reload" && _(), n === "save" && (o.value = c?.name ?? "", o.setCustomValidity(""), e.querySelector("[value=\"update\"]").hidden = !c, i.showModal(), o.focus()), n === "cancel" && i.close(), n === "delete" && c && (a.querySelector("p").textContent = `“${c.name}” will be removed. The current map will stay open.`, a.showModal()), n === "cancel-delete" && a.close(), n === "confirm-delete" && v();
	}), i.querySelector("form").onsubmit = async (e) => {
		if (e.preventDefault(), !t.store || l || d || !u) return;
		let n = o.value.trim();
		if (!n || n_(n) > 100) {
			o.setCustomValidity(n ? "Use at most 100 characters." : "Enter a view name."), o.reportValidity();
			return;
		}
		o.setCustomValidity("");
		let r = e.submitter?.value === "update" ? c : void 0;
		l = !0, m();
		let a = f;
		try {
			let e = await t.store.save(n, t.capture(), r);
			if (a !== f) return;
			c = e, s = [e, ...s.filter((t) => t.id !== e.id)], h(), i.close(), p(`Saved “${e.name}”.`);
		} catch (e) {
			a === f && (i.close(), g(e));
		} finally {
			l = !1, m();
		}
	}, o.oninput = () => o.setCustomValidity(n_(o.value.trim()) > 100 ? "Use at most 100 characters." : "");
	async function v() {
		if (!t.store || !c || l) return;
		l = !0, m();
		let e = f, n = c;
		try {
			if (await t.store.remove(n), e !== f) return;
			s = s.filter((e) => e.id !== n.id), c = void 0, h(), a.close(), p("Saved view deleted.");
		} catch (t) {
			e === f && (a.close(), g(t));
		} finally {
			l = !1, m();
		}
	}
	return t.store || p("Saved views are unavailable on this page."), m(), {
		setLayoutPending(e) {
			d = e, m();
		},
		setAvailable(e) {
			u = e, e || (f++, s = [], c = void 0, i.close(), a.close(), h(), p("Load the topology to use saved views.")), m();
		},
		reload: _
	};
}
//#endregion
//#region frontend/main.ts
var ny = class extends Error {
	status;
	constructor(e, t) {
		super(e), this.status = t;
	}
}, ry = /* @__PURE__ */ new Set([
	401,
	403,
	404,
	419
]), iy = document.querySelector("#libremap");
iy && (iy.dataset.mode === "custom" ? s_(iy) : iy.dataset.mode === "world" ? pv(iy) : ay(iy));
function ay(e) {
	let t = e.dataset.demo === "true";
	e.innerHTML = `
    <div class="lm-shell">
      <header class="lm-header"><div class="lm-brand"><span class="lm-logo">◈</span><div><strong>LibreMap</strong><span>NETWORK TOPOLOGY</span></div></div><div class="lm-header-right"><span class="lm-source">${t ? "DEMO DATA" : "LIBRENMS"}</span><button data-action="theme" title="Toggle color theme">◐ <span>Theme</span></button><nav class="lm-pages" aria-label="LibreMap pages" hidden></nav><a class="lm-back" href="/">LibreNMS ↗</a></div></header>
      <section class="lm-heading"><div><div class="lm-eyebrow">INFRASTRUCTURE / TOPOLOGY</div></div><div class="lm-summary" aria-label="Network summary"></div></section>
      <div class="lm-toolbar"><label class="lm-search"><span>⌕</span><input type="search" aria-label="Find device" placeholder="Find a device…"></label><label class="lm-select">Site <select aria-label="Site"><option value="">All sites</option></select></label><button data-action="overview">AGG backbone</button><button data-action="other-devices" aria-pressed="false">Show other devices</button><span class="lm-spacer"></span><button data-action="refresh">↻ Refresh</button><button data-action="layout">Re-layout</button><button data-action="export" title="Download the visible map as an image">Export PNG</button><button data-action="fullscreen" title="Fullscreen">⛶</button></div>
      <div class="lm-viewbar"><label class="lm-select">Device group <select aria-label="Device group"><option value="">All device groups</option></select></label><label class="lm-select">AGG root <select aria-label="AGG root"><option value="">All AGG groups</option></select></label><label class="lm-select">Highlight <select aria-label="Highlight hops">${Array.from({ length: 5 }, (e, t) => `<option value="${t + 1}">${t + 1} hop${t ? "s" : ""}</option>`).join("")}</select></label><span class="lm-pin-count">0 pinned</span><button data-action="unpin-all">Unpin all</button><div class="lm-views"></div></div>
      <div class="lm-notice" role="status" aria-live="polite">Loading topology…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap"><div class="lm-canvas-caption"><span class="lm-live-dot"></span><strong>Physical topology</strong><span>AGG → ER · discovered links</span></div><div class="lm-canvas" aria-label="Interactive network topology"></div><div class="lm-empty" hidden></div><div class="lm-map-controls"><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="zoom-out" aria-label="Zoom out">−</button><button data-action="fit">Fit</button></div><div class="lm-legend"><span><i style="color:${gg.normal}"></i>&lt;50%</span><span><i style="color:${gg.warning}"></i>50–70%</span><span><i style="color:${gg.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Down</span><span><i class="lm-dashed" style="color:#8a96a9"></i>Disabled / unknown / stale</span></div></div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Drag to arrange · Scroll to zoom · Hover links for traffic · Click to inspect · Keys: / find · F fit · + − zoom · D next down device · Esc clear</span></footer>
    </div>`, t && e.querySelector(".lm-back")?.remove(), e.dataset.hostTheme === "true" && e.querySelector("[data-action=\"theme\"]")?.remove();
	let n = e.querySelector(".lm-back");
	n && e.dataset.homeUrl && (n.href = e.dataset.homeUrl), t || Mg(e.querySelector(".lm-pages"), e, "topology");
	let r = (t) => e.querySelector(t), i = r(".lm-notice"), a = r("[aria-label=\"Find device\"]"), o = r("[aria-label=\"Site\"]"), s = r("[aria-label=\"Device group\"]"), c = r("[aria-label=\"AGG root\"]"), l = r("[aria-label=\"Highlight hops\"]"), u = sg({
		container: r(".lm-canvas"),
		minZoom: .15,
		maxZoom: 2.5,
		selectionType: "single",
		style: xg(e)
	}), d = Cg(e, () => u.style(xg(e))), f, p = t ? void 0 : Iv(e, u, () => f?.generatedAt), m = {
		nodes: [],
		links: [],
		deviceGroups: []
	}, h = !1, g = !1, _ = !1, v, y = 0, b, x = {}, S, C = !1, w, T, E = 0, D = () => Date.now() / 1e3 + E, O = `libremap:v1:${e.dataset.storageKey ?? "local"}`, k = `libremap:v2:${e.dataset.storageKey ?? "local"}`;
	function A() {
		try {
			let e = localStorage.getItem(k);
			return Hv(e ? JSON.parse(e) : { positions: JSON.parse(localStorage.getItem(O) ?? "{}") });
		} catch {
			return Rv();
		}
	}
	let j = A(), M = j.positions, N = new Set(j.pinned), P = !1, F = {}, I = !1, L = () => Object.fromEntries(u.nodes().map((e) => [e.id(), e.position()])), R = () => {
		let e = L();
		if (!I) return e;
		let t = { ...F };
		for (let n of N) e[n] && (t[n] = e[n]);
		return t;
	};
	function z() {
		return Hv({
			rootId: c.value || null,
			deviceGroupId: s.value || null,
			site: o.value,
			search: a.value,
			backbone: h,
			showOther: g,
			hops: Number(l.value),
			positions: R(),
			pinned: [...N],
			zoom: u.zoom(),
			pan: u.pan()
		}, m);
	}
	let B = () => {
		if (f) {
			M = R();
			try {
				localStorage.setItem(k, JSON.stringify(z()));
			} catch {
				i.textContent = "Workspace could not be saved in this browser.";
			}
		}
	}, V = (e, t = !1) => {
		i.textContent = e, i.classList.toggle("lm-error", t);
	}, H;
	try {
		H = t ? ey(`${k}:views`) : e.dataset.viewsEndpoint ? Zv(e.dataset.viewsEndpoint, e.dataset.csrf ?? "") : void 0;
	} catch {}
	let U = ty(r(".lm-views"), {
		store: H,
		demo: t,
		capture: z,
		restore: q
	});
	function W() {
		let t = C || !f;
		a.disabled = t, o.disabled = t, s.disabled = t, c.disabled = t, l.disabled = t;
		for (let e of [
			"layout",
			"zoom-in",
			"zoom-out",
			"fit",
			"overview",
			"other-devices",
			"export"
		]) r(`[data-action="${e}"]`).disabled = t;
		e.querySelectorAll(".lm-pin-device,.lm-focus-device").forEach((e) => {
			e.disabled = t;
		}), r("[data-action=\"unpin-all\"]").disabled = t || N.size === 0;
	}
	function G(e) {
		C = e, U.setLayoutPending(e), u.autoungrabify(e), u.userPanningEnabled(!e), u.userZoomingEnabled(!e), W();
	}
	function K() {
		u.nodes().forEach((e) => {
			let t = N.has(e.id());
			e.data({
				pinned: +!!t,
				label: `${e.data("name")}\n${e.data("role")}  ·  ${String(e.data("status")).toUpperCase()}${t ? "  ·  PIN" : ""}`
			}), t ? e.lock() : e.unlock();
		}), r(".lm-pin-count").textContent = `${N.size} pinned`, W();
	}
	function q(e) {
		if (!f) return;
		let t = Hv(e, m);
		c.value = t.rootId ?? "", s.value = t.deviceGroupId ?? "", o.value = t.site, a.value = t.search, h = t.backbone, g = t.showOther, l.value = String(t.hops), N = new Set(t.pinned), v = void 0, u.elements().unselect().removeClass("lm-dim"), K(), te(), ee(), J(), ie(t.positions, t);
	}
	function ee() {
		let e = r("[data-action=\"overview\"]");
		e.classList.toggle("lm-active", h), e.setAttribute("aria-pressed", String(h));
	}
	function J() {
		let e = r("[data-action=\"other-devices\"]");
		e.classList.toggle("lm-active", g), e.setAttribute("aria-pressed", String(g)), e.textContent = g ? "Hide other devices" : "Show other devices";
	}
	let Y = () => {
		let e = r(".lm-details");
		e.replaceChildren();
		let t = document.createElement("div");
		t.className = "lm-eyebrow", t.textContent = "NETWORK EXPLORER", e.append(t);
		let n = document.createElement("h2");
		n.textContent = "Follow the connection", e.append(n);
		let i = document.createElement("p");
		i.textContent = "Hover a link to preview both interface traffic graphs. Select a device or link to inspect its status and traffic.", e.append(i);
		let a = document.createElement("div");
		a.className = "lm-device-list";
		for (let e of m.nodes.filter((e) => e.role === "AGG")) {
			let t = document.createElement("button");
			t.textContent = `◈  ${ug(e)}`, t.addEventListener("click", () => ne(e.id)), a.append(t);
		}
		e.append(a);
		let o = document.createElement("p");
		o.className = "lm-hint", o.textContent = "Choose a LibreNMS device group or an AGG root to focus the map. Filters combine, and Show other devices reveals non-AGG/ER members inside that scope. Highlight sets how many connection hops around a selected device stay in view. Save a named view to return to this workspace.", e.append(o);
	};
	function te() {
		if (!v) return Y();
		let e = v.type === "node" ? m.nodes.find((e) => e.id === v.id) : void 0, t = v.type === "link" ? m.links.find((e) => e.id === v.id) : void 0;
		if (!e && !t) return v = void 0, Y();
		let n = r(".lm-details");
		n.replaceChildren();
		let i = document.createElement("button");
		i.className = "lm-close", i.textContent = "×", i.setAttribute("aria-label", "Close details"), i.onclick = () => {
			v = void 0, u.elements().removeClass("lm-dim"), u.elements().unselect(), Y();
		}, n.append(i);
		let a = document.createElement("div");
		a.className = "lm-eyebrow", a.textContent = e ? `${e.role} / DEVICE` : "PHYSICAL LINK", n.append(a);
		let o = (e) => {
			let t = m.nodes.find((t) => t.id === e);
			return t ? ug(t) : void 0;
		}, s = document.createElement("h2");
		s.textContent = e ? ug(e) : `${o(t.source)} ↔ ${o(t.target)}`, n.append(s);
		let l = e ? [
			["Status", e.status],
			...ug(e) === e.hostname ? [] : [["Hostname", e.hostname]],
			["Role", e.role],
			["Site", e.site],
			["Placement", e.reachable ? e.tier === 0 ? "Root tier" : `Hop ${e.tier} from AGG` : "No discovered AGG path"],
			["Connections", String(m.links.filter((t) => t.source === e.id || t.target === e.id).length)]
		] : [
			["Status", _g(t, D(), f.config.staleAfter).label],
			["Source interface", t.sourcePort],
			["Remote interface", t.targetPortId ? t.targetPort : `${t.targetPort} (as reported by the neighbor; not matched to a LibreNMS port)`],
			["Capacity", vg(t.speedBps)],
			["Inbound at source", vg(t.inBps)],
			["Outbound at source", vg(t.outBps)],
			["Sample time", t.sampledAt ? (/* @__PURE__ */ new Date(t.sampledAt * 1e3)).toLocaleString() : "Unavailable"]
		], d = document.createElement("dl");
		for (let [e, n] of l) {
			let r = document.createElement("dt");
			r.textContent = e;
			let i = document.createElement("dd");
			i.textContent = n, t && e === "Status" && (i.dataset.linkStatus = "true"), d.append(r, i);
		}
		if (n.append(d), e) {
			let t = document.createElement("button");
			if (t.className = "lm-pin-device", t.disabled = C, t.textContent = N.has(e.id) ? "Unpin device" : "Pin position", t.setAttribute("aria-pressed", String(N.has(e.id))), t.onclick = () => {
				N.has(e.id) ? N.delete(e.id) : (N.add(e.id), F[e.id] = { ...u.getElementById(e.id).position() }), K(), re(!1), B(), te();
			}, n.append(t), e.role === "AGG") {
				let t = document.createElement("button");
				t.className = "lm-focus-device", t.disabled = C, t.textContent = "Focus AGG group", t.onclick = () => {
					c.value = e.id, re(), B();
				}, n.append(t);
			}
		}
		if (e?.url) {
			let t = new URL(e.url, window.location.href);
			if (t.origin === window.location.origin && ["http:", "https:"].includes(t.protocol)) {
				let e = document.createElement("a");
				e.className = "lm-device-link", e.href = t.href, e.textContent = "Open in LibreNMS ↗", n.append(e);
			}
		}
	}
	function ne(e) {
		let t = u.getElementById(e);
		if (!t.length) return;
		v = {
			type: "node",
			id: e
		}, u.elements().unselect(), t.select();
		let n = Wv(m, e, Number(l.value), new Set(u.nodes(":visible").map((e) => e.id())));
		u.elements().addClass("lm-dim"), u.elements().filter((e) => e.isNode() ? n.nodes.has(e.id()) : n.links.has(e.data("linkId"))).removeClass("lm-dim"), te();
	}
	function re(e = !0) {
		let t = Gv(m, {
			rootId: c.value || null,
			deviceGroupId: s.value || null,
			site: o.value,
			search: a.value,
			backbone: h,
			showOther: g
		}), n = !!c.value || !!s.value;
		u.batch(() => {
			if (u.nodes().forEach((e) => {
				e.style("display", t.has(e.id()) ? "element" : "none");
			}), u.edges().forEach((e) => {
				e.style("display", t.has(e.source().id()) && t.has(e.target().id()) ? "element" : "none");
			}), n && t.size && Object.keys(F).length) {
				let e = {
					nodes: m.nodes.filter((e) => t.has(e.id)),
					links: m.links.filter((e) => t.has(e.source) && t.has(e.target)),
					deviceGroups: []
				}, n = Ov(e, new Map(e.nodes.map((e) => [e.id, F[e.id]?.x ?? 0])), !0), r = new Set([...N].filter((e) => t.has(e))), i = Jv(e, n, Object.fromEntries([...r].filter((e) => F[e]).map((e) => [e, F[e]])), r);
				u.nodes().filter((e) => t.has(e.id()) && !N.has(e.id())).forEach((e) => {
					e.position(i[e.id()]);
				}), I = !0;
			} else !n && I && (u.nodes().filter((e) => !N.has(e.id()) && !!F[e.id()]).forEach((e) => {
				e.position(F[e.id()]);
			}), I = !1);
		}), r(".lm-empty").hidden = t.size > 0, r(".lm-empty").textContent = m.nodes.length ? "No devices match these filters." : "No authorized devices are available.", e && t.size && u.fit(u.elements(":visible"), 70);
	}
	function ie(e = {}, t) {
		let n = Dv(e, N);
		x = n, S = n === e ? t : void 0, y++, G(!0), clearTimeout(b), b = setTimeout(() => {
			y++, jv(), G(!1), V("Layout timed out. Existing positions are retained; retry Re-layout.", !0);
		}, 2e4);
		let r = y;
		Mv(m).then((e) => ae(r, e)).catch(() => {
			r === y && (clearTimeout(b), G(!1), V("Automatic layout failed. Check the published worker asset and retry Re-layout.", !0));
		});
	}
	function ae(e, n) {
		if (e !== y) return;
		clearTimeout(b);
		let r = Jv(m, n, x, N);
		F = r, I = !1, u.batch(() => u.nodes().forEach((e) => {
			e.unlock(), e.position(r[e.id()]);
		})), K(), re(!S), S && u.viewport(S), S = void 0, G(!1), B(), V(t ? "Demo topology · illustrative devices and traffic" : "Topology loaded · positions saved in this browser");
	}
	function oe(e) {
		p?.hide();
		let n = C ? x : void 0, i = C ? S : void 0, d = JSON.stringify([m.nodes.map((e) => [
			e.id,
			e.role,
			e.site,
			e.tier
		]), m.links.map((e) => e.id)]);
		f = e, m = mg(e), E = Number.isFinite(e.generatedAt) ? e.generatedAt - Date.now() / 1e3 : 0;
		let _ = JSON.stringify([m.nodes.map((e) => [
			e.id,
			e.role,
			e.site,
			e.tier
		]), m.links.map((e) => e.id)]), v = R(), y = o.value;
		o.replaceChildren(new Option("All sites", ""), ...Array.from(new Set(m.nodes.map((e) => e.site))).sort().map((e) => new Option(e, e))), [...o.options].some((e) => e.value === y) && (o.value = y);
		let b = c.value;
		c.replaceChildren(new Option("All AGG groups", ""), ...m.nodes.filter((e) => e.role === "AGG").map((e) => new Option(ug(e), e.id))), [...c.options].some((e) => e.value === b) && (c.value = b);
		let w = s.value;
		if (s.replaceChildren(new Option("All device groups", ""), ...m.deviceGroups.map((e) => new Option(e.name, e.id))), [...s.options].some((e) => e.value === w) && (s.value = w), N = new Set([...N].filter((e) => m.nodes.some((t) => t.id === e))), !P) {
			let e = Hv(j, m);
			c.value = e.rootId ?? "", s.value = e.deviceGroupId ?? "", o.value = e.site, a.value = e.search, h = e.backbone, g = e.showOther, l.value = String(e.hops), N = new Set(e.pinned), ee(), J();
		}
		u.batch(() => {
			let t = new Set(m.nodes.map((e) => e.id)), n = new Set(m.links.map((e) => `edge:${e.id}`));
			u.edges().filter((e) => !n.has(e.id())).remove(), u.nodes().filter((e) => !t.has(e.id())).remove();
			for (let e of m.nodes) {
				let t = ug(e), n = {
					...e,
					name: t,
					label: `${t}\n${e.role}  ·  ${e.status.toUpperCase()}`,
					color: e.status === "down" ? "#e05b65" : e.status === "up" ? "#36b89a" : "#8a96a9",
					width: e.role === "AGG" ? 220 : 206
				}, r = u.getElementById(e.id);
				r.length ? r.data(n) : u.add({ data: n });
			}
			let r = hg(m);
			for (let t of m.links) {
				let n = _g(t, D(), e.config.staleAfter), i = {
					...t,
					id: `edge:${t.id}`,
					linkId: t.id,
					label: n.label,
					color: n.color,
					state: n.state,
					lateral: +!!r.has(t.id),
					curveDistance: r.get(t.id) ?? 0
				}, a = u.getElementById(i.id);
				a.length ? a.data(i) : u.add({ data: i });
			}
		}), K();
		let T = r(".lm-summary");
		T.replaceChildren();
		let O = m.nodes.filter((e) => e.status === "down").length;
		for (let [e, t] of [
			[m.nodes.length, "Devices"],
			[m.links.length, "Links"],
			[m.nodes.filter((e) => e.role === "AGG").length, "AGG roots"],
			[O, "Down"]
		]) {
			let n = t === "Down" && O > 0, r = document.createElement(n ? "button" : "div"), i = document.createElement("strong");
			i.textContent = String(e);
			let a = document.createElement("span");
			a.textContent = t, r.append(i, a), n && (r.className = "lm-summary-down", r.dataset.action = "next-down", r.title = "Select the next down device (D)", r.setAttribute("aria-label", `${O} down. Select the next down device`)), T.append(r);
		}
		r(".lm-updated").textContent = `${t ? "Demo snapshot" : "Snapshot fetched"} · ${(/* @__PURE__ */ new Date(e.generatedAt * 1e3)).toLocaleTimeString()}`, re(!1), te(), U.setAvailable(!0), P || U.reload(), _ !== d || C ? ie(n ?? {
			...M,
			...v
		}, i ?? (!P && Object.keys(M).length ? j : P ? {
			zoom: u.zoom(),
			pan: u.pan()
		} : void 0)) : V(t ? "Demo topology · illustrative devices and traffic" : "Updated · layout unchanged"), P = !0;
	}
	async function se() {
		if (!_) {
			_ = !0;
			try {
				if (t) oe(Lv());
				else {
					if (!e.dataset.endpoint) throw Error("Missing topology endpoint");
					let t = new URL(e.dataset.endpoint, location.href);
					if (t.origin !== location.origin) throw Error("Topology endpoint must use the same origin");
					let n = await fetch(t, {
						credentials: "same-origin",
						headers: { Accept: "application/json" },
						signal: AbortSignal.timeout(2e4)
					});
					if (n.status === 429) throw new ny("Too many topology requests. The map will retry on the next refresh.", 429);
					if (!n.ok) throw new ny(await oy(n), n.status);
					let r = await n.json();
					if (!Array.isArray(r.devices) || !Array.isArray(r.links) || !r.config) throw Error("Unexpected topology response");
					oe(r);
				}
			} catch (e) {
				let t = e instanceof Error ? e.message : "Unable to load topology";
				if (f && !(e instanceof ny && ry.has(e.status))) {
					V(`${t} · Showing the snapshot from ${(/* @__PURE__ */ new Date(f.generatedAt * 1e3)).toLocaleTimeString()}.`, !0);
					return;
				}
				p?.hide(), u.elements().remove(), m = {
					nodes: [],
					links: [],
					deviceGroups: []
				}, F = {}, I = !1, v = void 0, f = void 0, y++, clearTimeout(b), Y(), G(!1), clearTimeout(w), clearTimeout(T), N.clear(), j = A(), M = j.positions, P = !1, o.replaceChildren(new Option("All sites", "")), s.replaceChildren(new Option("All device groups", "")), c.replaceChildren(new Option("All AGG groups", "")), U.setAvailable(!1), K(), r(".lm-summary").replaceChildren(), r(".lm-empty").hidden = !1, r(".lm-empty").textContent = "Topology unavailable. Use Refresh to retry.", V(t, !0);
			} finally {
				_ = !1;
			}
		}
	}
	u.on("tap", "node", (e) => ne(e.target.id())), u.on("tap", "edge", (e) => {
		v = {
			type: "link",
			id: e.target.data("linkId")
		}, e.target.union(e.target.connectedNodes()).removeClass("lm-dim"), te();
	}), u.on("tap", (e) => {
		e.target === u && (v = void 0, u.elements().removeClass("lm-dim"), Y());
	}), u.on("dragfree", "node", (e) => {
		I || (F[e.target.id()] = { ...e.target.position() }, B());
	}), u.on("zoom", () => u.edges().toggleClass("lm-no-label", u.zoom() < .45)), u.on("pan zoom", () => {
		f && !C && (clearTimeout(w), w = setTimeout(() => {
			f && !C && B();
		}, 200));
	}), a.addEventListener("input", () => {
		a.value = r_(a.value), re(!1), clearTimeout(T), T = setTimeout(() => {
			if (!f) return;
			let e = u.elements(":visible");
			e.length && u.fit(e, 70), B();
		}, 300);
	}), o.addEventListener("change", () => {
		re(), B();
	}), s.addEventListener("change", () => {
		re(), B();
	}), c.addEventListener("change", () => {
		re(), B();
	}), l.addEventListener("change", () => {
		v?.type === "node" && ne(v.id), B();
	}), e.addEventListener("click", (t) => {
		let n = t.target.closest("button[data-action]");
		if (n) switch (n.dataset.action) {
			case "refresh":
				se();
				break;
			case "fit":
				u.fit(u.elements(":visible"), 70);
				break;
			case "layout":
				ie(Object.fromEntries(u.nodes().map((e) => ({
					id: e.id(),
					position: e.position()
				})).filter((e) => N.has(e.id)).map((e) => [e.id, e.position])));
				break;
			case "unpin-all":
				N.clear(), K(), re(!1), B(), te();
				break;
			case "zoom-in":
				kg(u, 1.2);
				break;
			case "zoom-out":
				kg(u, 1 / 1.2);
				break;
			case "next-down":
				le();
				break;
			case "export":
				Eg(u, e, "libremap-topology").then(() => V("Map image downloaded."), (e) => V(e instanceof Error ? e.message : "The map image could not be created.", !0));
				break;
			case "overview":
				h = !h, ee(), re(), B();
				break;
			case "other-devices":
				g = !g, J(), re(), B();
				break;
			case "theme":
				d.toggle();
				break;
			case "fullscreen": (document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen()).catch(() => V("Fullscreen is unavailable in this browser."));
		}
	});
	let ce = -1;
	function le() {
		if (!f || C) return;
		let e = m.nodes.filter((e) => e.status === "down"), t = e.filter((e) => u.getElementById(e.id).visible());
		if (!t.length) {
			V(e.length ? "Down devices are hidden by the current filters." : "No devices are down.");
			return;
		}
		ce = (ce + 1) % t.length;
		let n = t[ce];
		ne(n.id), u.animate({
			center: { eles: u.getElementById(n.id) },
			zoom: Math.max(u.zoom(), .8)
		}, { duration: 250 }), V(`Down device ${ce + 1} of ${t.length}: ${ug(n)}`);
	}
	document.addEventListener("keydown", (t) => {
		if (!Og(t, e)) return;
		let n = () => {
			v = void 0, u.elements().unselect().removeClass("lm-dim"), Y();
		}, r = {
			"/": () => {
				a.disabled || a.focus();
			},
			f: () => {
				C || u.fit(u.elements(":visible"), 70);
			},
			"+": () => {
				C || kg(u, 1.2);
			},
			"=": () => {
				C || kg(u, 1.2);
			},
			"-": () => {
				C || kg(u, 1 / 1.2);
			},
			d: le,
			Escape: () => {
				v && n();
			}
		}[t.key.length === 1 ? t.key.toLowerCase() : t.key];
		r && (t.preventDefault(), r());
	}), new ResizeObserver(() => u.resize()).observe(r(".lm-canvas")), W(), Y(), se(), setInterval(() => {
		document.hidden || se();
	}, 6e4), setInterval(() => {
		if (!f) return;
		let t = D();
		u.batch(() => m.links.forEach((n) => {
			let r = _g(n, t, f.config.staleAfter);
			if (u.getElementById(`edge:${n.id}`).data({
				label: r.label,
				color: r.color,
				state: r.state
			}), v?.type === "link" && v.id === n.id) {
				let t = e.querySelector("[data-link-status]");
				t && (t.textContent = r.label);
			}
		}));
	}, 1e4), (t || e.dataset.debug === "true") && Object.defineProperty(window, "libremapDebug", {
		value: () => ({
			zoom: u.zoom(),
			nodes: u.nodes().map((e) => ({
				id: e.id(),
				tier: e.data("tier"),
				position: e.position(),
				renderedPosition: e.renderedPosition(),
				visible: e.visible(),
				dimmed: e.hasClass("lm-dim")
			})),
			edges: u.edges().length,
			links: u.edges().map((e) => ({
				port: e.data("sourcePort"),
				midpoint: e.renderedMidpoint(),
				label: e.data("label"),
				lineStyle: e.style("line-style"),
				dimmed: e.hasClass("lm-dim"),
				labelBox: e.renderedBoundingBox({
					includeNodes: !1,
					includeEdges: !1,
					includeLabels: !0,
					includeOverlays: !1
				})
			}))
		}),
		configurable: !0
	});
}
async function oy(e) {
	if (e.status === 422) {
		let t = await e.json().catch(() => void 0), n = t && typeof t == "object" && "message" in t && typeof t.message == "string" ? t.message.trim() : "";
		if (n && n.length <= 300) return n;
	}
	return `LibreNMS returned HTTP ${e.status}`;
}
//#endregion
