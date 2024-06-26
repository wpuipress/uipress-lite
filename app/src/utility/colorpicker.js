import {
  ref as e,
  reactive as a,
  computed as r,
  watch as t,
  onMounted as n,
  onBeforeUnmount as o,
  openBlock as c,
  createElementBlock as i,
  createElementVNode as l,
  renderSlot as s,
  createTextVNode as p,
  createCommentVNode as u,
  Fragment as v,
  renderList as h,
  toDisplayString as d,
} from 'vue';
function f(e, a, r) {
  return Math.max(a, Math.min(e, r));
}
function g(e, a = 2) {
  return e.toFixed(a).replace(/\.?0+$/, '');
}
function b(e) {
  if (e.endsWith('.')) return NaN;
  return (((parseFloat(e) % 360) + 360) % 360) / 360;
}
function m(e) {
  return g(360 * e);
}
function w(e) {
  if (!e.endsWith('%')) return NaN;
  const a = e.substring(0, e.length - 1);
  if (a.endsWith('.')) return NaN;
  const r = parseFloat(a);
  return Number.isNaN(r) ? NaN : f(r, 0, 100) / 100;
}
function x(e) {
  return g(100 * e) + '%';
}
function y(e) {
  if (e.endsWith('%')) return w(e);
  if (e.endsWith('.')) return NaN;
  const a = parseFloat(e);
  return Number.isNaN(a) ? NaN : f(a, 0, 255) / 255;
}
function k(e) {
  return g(255 * e);
}
function $(e) {
  return e.endsWith('%') ? w(e) : f(parseFloat(e), 0, 1);
}
function z(e) {
  return String(e);
}
const C = {
  hsl: { h: { to: m, from: b }, s: { to: x, from: w }, l: { to: x, from: w }, a: { to: z, from: $ } },
  hwb: { h: { to: m, from: b }, w: { to: x, from: w }, b: { to: x, from: w }, a: { to: z, from: $ } },
  rgb: { r: { to: k, from: y }, g: { to: k, from: y }, b: { to: k, from: y }, a: { to: z, from: $ } },
};
function N(e) {
  const a = e.replace(/^#/, ''),
    r = [],
    t = a.length > 4 ? 2 : 1;
  for (let e = 0; e < a.length; e += t) {
    const n = a.slice(e, e + t);
    r.push(n.repeat((t % 2) + 1));
  }
  3 === r.length && r.push('ff');
  const n = r.map((e) => parseInt(e, 16) / 255);
  return { r: n[0], g: n[1], b: n[2], a: n[3] };
}
function S(e) {
  const a = e.l < 0.5 ? e.l * (1 + e.s) : e.l + e.s - e.l * e.s,
    r = 2 * e.l - a;
  return { r: A(r, a, e.h + 1 / 3), g: A(r, a, e.h), b: A(r, a, e.h - 1 / 3), a: e.a };
}
function A(e, a, r) {
  return r < 0 ? (r += 1) : r > 1 && (r -= 1), r < 1 / 6 ? e + 6 * (a - e) * r : r < 0.5 ? a : r < 2 / 3 ? e + (a - e) * (2 / 3 - r) * 6 : e;
}
function M(e) {
  return { r: F(5, e), g: F(3, e), b: F(1, e), a: e.a };
}
function F(e, a) {
  const r = (e + 6 * a.h) % 6;
  return a.v - a.v * a.s * Math.max(0, Math.min(r, 4 - r, 1));
}
function E(e) {
  return { h: e.h, s: 1 === e.b ? 0 : 1 - e.w / (1 - e.b), v: 1 - e.b, a: e.a };
}
function L(e) {
  const a = Math.min(e.r, e.g, e.b),
    r = Math.max(e.r, e.g, e.b);
  let t;
  return (
    (t = r === a ? 0 : r === e.r ? (0 + (e.g - e.b) / (r - a)) / 6 : r === e.g ? (2 + (e.b - e.r) / (r - a)) / 6 : (4 + (e.r - e.g) / (r - a)) / 6), t < 0 && (t += 1), { h: t, w: a, b: 1 - r, a: e.a }
  );
}
function I(e) {
  const a = L(e),
    r = a.w,
    t = 1 - a.b,
    n = (t + r) / 2;
  let o;
  return (o = 0 === t || 1 === r ? 0 : (t - n) / Math.min(n, 1 - n)), { h: a.h, s: o, l: n, a: e.a };
}
function j(e) {
  return (
    '#' +
    Object.values(e)
      .map((e) => {
        const a = 255 * e,
          r = Math.round(a).toString(16);
        return 1 === r.length ? '0' + r : r;
      })
      .join('')
  );
}
const P = {
  hex: [
    ['hsl', (e) => T(e, [N, I])],
    ['hsv', (e) => T(e, [N, L, E])],
    ['hwb', (e) => T(e, [N, L])],
    ['rgb', N],
  ],
  hsl: [
    ['hex', (e) => T(e, [S, j])],
    [
      'hsv',
      function (e) {
        const a = e.l + e.s * Math.min(e.l, 1 - e.l),
          r = 0 === a ? 0 : 2 - (2 * e.l) / a;
        return { h: e.h, s: r, v: a, a: e.a };
      },
    ],
    ['hwb', (e) => T(e, [S, L])],
    ['rgb', S],
  ],
  hsv: [
    ['hex', (e) => T(e, [M, j])],
    [
      'hsl',
      function (e) {
        const a = e.v - (e.v * e.s) / 2,
          r = Math.min(a, 1 - a),
          t = 0 === r ? 0 : (e.v - a) / r;
        return { h: e.h, s: t, l: a, a: e.a };
      },
    ],
    [
      'hwb',
      function (e) {
        return { h: e.h, w: (1 - e.s) * e.v, b: 1 - e.v, a: e.a };
      },
    ],
    ['rgb', M],
  ],
  hwb: [
    ['hex', (e) => T(e, [E, M, j])],
    ['hsl', (e) => T(e, [E, M, I])],
    ['hsv', E],
    ['rgb', (e) => T(e, [E, M])],
  ],
  rgb: [
    ['hex', j],
    ['hsl', I],
    ['hsv', (e) => T(e, [L, E])],
    ['hwb', L],
  ],
};
function T(e, a) {
  return a.reduce((e, a) => a(e), e);
}
function O(e) {
  const a = {};
  for (const r in e) a[r] = e[r];
  return a;
}
const H = {
  hex: (e, a) => (a && [5, 9].includes(e.length) ? e.substring(0, e.length - (e.length - 1) / 4) : e),
  hsl: (e, a) => `hsl(${g(360 * e.h)} ${g(100 * e.s)}% ${g(100 * e.l)}%` + (a ? ')' : ` / ${g(e.a)})`),
  hwb: (e, a) => `hwb(${g(360 * e.h)} ${g(100 * e.w)}% ${g(100 * e.b)}%` + (a ? ')' : ` / ${g(e.a)})`),
  rgb: (e, a) => `rgb(${g(255 * e.r)} ${g(255 * e.g)} ${g(255 * e.b)}` + (a ? ')' : ` / ${g(e.a)})`),
};
function _(e, a, r) {
  return H[a](e, r);
}
function D(e) {
  return /^#(?:(?:[A-F0-9]{2}){3,4}|[A-F0-9]{3,4})$/i.test(e);
}
function U(e) {
  if ('string' != typeof e) {
    const a = (function (e) {
      return Object.prototype.hasOwnProperty.call(e, 'r') ? 'rgb' : Object.prototype.hasOwnProperty.call(e, 'w') ? 'hwb' : Object.prototype.hasOwnProperty.call(e, 'v') ? 'hsv' : 'hsl';
    })(e);
    return { format: a, color: e };
  }
  if (D(e)) return { format: 'hex', color: e };
  if (!e.includes('(')) {
    const a = document.createElement('canvas').getContext('2d');
    a.fillStyle = e;
    const r = a.fillStyle;
    return '#000000' === r && 'black' !== e ? null : { format: 'hex', color: r };
  }
  const [a, r] = e.split('('),
    t = a.substring(0, 3),
    n = r.replace(/[,/)]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
  3 === n.length && n.push('1');
  const o = (t + 'a').split(''),
    c = Object.fromEntries(o.map((e, a) => [e, C[t][e].from(n[a])]));
  return { format: t, color: c };
}
const W = ['hex', 'hsl', 'hwb', 'rgb'],
  B = ['show', 'hide'],
  K = { class: 'vacp-range-input-group' },
  R = ['for'],
  X = { class: 'vacp-range-input-label-text vacp-range-input-label-text--hue uip-hidden' },
  Y = ['id', 'value'],
  q = ['for'],
  G = { class: 'vacp-range-input-label-text vacp-range-input-label-text--alpha uip-hidden' },
  J = ['id', 'value'],
  Q = l('span', { class: 'vacp-visually-hidden' }, 'Copy color', -1),
  V = l(
    'svg',
    { class: 'vacp-icon', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true', width: '24', height: '24', viewBox: '0 0 32 32' },
    [
      l('path', {
        d: 'M25.313 28v-18.688h-14.625v18.688h14.625zM25.313 6.688c1.438 0 2.688 1.188 2.688 2.625v18.688c0 1.438-1.25 2.688-2.688 2.688h-14.625c-1.438 0-2.688-1.25-2.688-2.688v-18.688c0-1.438 1.25-2.625 2.688-2.625h14.625zM21.313 1.313v2.688h-16v18.688h-2.625v-18.688c0-1.438 1.188-2.688 2.625-2.688h16z',
        fill: 'currentColor',
      }),
    ],
    -1
  ),
  Z = { class: 'vacp-color-inputs' },
  ee = { class: 'vacp-color-input-group uip-hidden' },
  ae = ['for'],
  re = l('span', { class: 'vacp-color-input-label-text' }, ' Hex ', -1),
  te = ['id', 'value'],
  ne = ['id', 'for', 'onInput'],
  oe = { class: 'vacp-color-input-label-text' },
  ce = ['id', 'value', 'onInput'],
  ie = l('span', { class: 'vacp-visually-hidden' }, 'Switch format', -1),
  le = l(
    'svg',
    { class: 'vacp-icon', 'aria-hidden': 'true', xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '15' },
    [l('path', { d: 'M8 15l5-5-1-1-4 2-4-2-1 1zm4-9l1-1-5-5-5 5 1 1 4-2z', fill: 'currentColor' })],
    -1
  );
var se = {
  __name: 'ColorPicker',
  props: {
    color: { type: [String, Object], default: '#ffffffff' },
    id: { type: String, default: 'color-picker' },
    visibleFormats: { type: Array, default: () => W, validator: (e) => e.length > 0 && e.every((e) => W.includes(e)) },
    defaultFormat: { type: String, default: 'hsl', validator: (e) => W.includes(e) },
    alphaChannel: { type: String, default: 'show', validator: (e) => B.includes(e) },
  },
  emits: ['color-change'],
  setup(g, { emit: b }) {
    const m = g,
      w = e(null),
      x = e(null),
      y = e(null);
    let k = !1;
    const $ = e(m.visibleFormats.includes(m.defaultFormat) ? m.defaultFormat : m.visibleFormats[0]),
      z = a({ hex: '#ffffffff', hsl: { h: 0, s: 0, l: 1, a: 1 }, hsv: { h: 0, s: 0, v: 1, a: 1 }, hwb: { h: 0, w: 1, b: 0, a: 1 }, rgb: { r: 1, g: 1, b: 1, a: 1 } }),
      N = r(function () {
        const e = Object.keys(z[$.value]);
        return 'hex' !== $.value && 'hide' === m.alphaChannel ? e.slice(0, 3) : e;
      }),
      S = r(function () {
        return 'hide' === m.alphaChannel && [5, 9].includes(z.hex.length) ? z.hex.substring(0, z.hex.length - (z.hex.length - 1) / 4) : z.hex;
      });
    function A() {
      const e = (m.visibleFormats.findIndex((e) => e === $.value) + 1) % m.visibleFormats.length;
      $.value = m.visibleFormats[e];
    }
    function M(e) {
      (k = !0), L(e);
    }
    function F(e) {
      (k = !0), I(e);
    }
    function E() {
      k = !1;
    }
    function L(e) {
      1 === e.buttons && !1 !== k && x.value instanceof HTMLElement && j(x.value, e.clientX, e.clientY);
    }
    function I(e) {
      if (!1 === k || !(x.value instanceof HTMLElement)) return;
      e.preventDefault();
      const a = e.touches[0];
      j(x.value, a.clientX, a.clientY);
    }
    function j(e, a, r) {
      const t = (function (e, a, r) {
          const t = e.getBoundingClientRect(),
            n = a - t.left,
            o = r - t.top;
          return { x: 0 === t.width ? 0 : f(n / t.width, 0, 1), y: 0 === t.height ? 0 : f(1 - o / t.height, 0, 1) };
        })(e, a, r),
        n = O(z.hsv);
      (n.s = t.x), (n.v = t.y), pe('hsv', n);
    }
    function T(e) {
      if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) return;
      e.preventDefault();
      const a = ['ArrowLeft', 'ArrowDown'].includes(e.key) ? -1 : 1,
        r = ['ArrowLeft', 'ArrowRight'].includes(e.key) ? 's' : 'v',
        t = e.shiftKey ? 10 : 1,
        n = z.hsv[r] + a * t * 0.01,
        o = O(z.hsv);
      (o[r] = f(n, 0, 1)), pe('hsv', o);
    }
    function H(e) {
      const a = U(e);
      null !== a && pe(a.format, a.color);
    }
    function W(e, a) {
      const r = e.currentTarget,
        t = O(z.hsv);
      (t[a] = parseInt(r.value) / parseInt(r.max)), pe('hsv', t);
    }
    function B(e) {
      const a = e.target;
      D(a.value) && pe('hex', a.value);
    }
    function se(e, a) {
      const r = e.target,
        t = O(z[$.value]),
        n = C[$.value][a].from(r.value);
      Number.isNaN(n) || void 0 === n || ((t[a] = n), pe($.value, t));
    }
    function pe(e, a) {
      let r = a;
      if ('hide' === m.alphaChannel)
        if ('string' != typeof a) (a.a = 1), (r = a);
        else if ([5, 9].includes(a.length)) {
          const e = (a.length - 1) / 4;
          r = a.substring(0, a.length - e) + 'f'.repeat(e);
        } else [4, 7].includes(a.length) && (r = a + 'f'.repeat((a.length - 1) / 3));
      if (
        !(function (e, a) {
          if ('string' == typeof e || 'string' == typeof a) return e === a;
          for (const r in e) if (e[r] !== a[r]) return !1;
          return !0;
        })(z[e], r)
      ) {
        !(function (e, a) {
          z[e] = a;
          for (const [a, r] of P[e]) z[a] = r(z[e]);
        })(e, r);
        const a = (function () {
          const e = 'hide' === m.alphaChannel,
            a = _(z[$.value], $.value, e);
          return { colors: z, cssColor: a };
        })();
        b('color-change', a);
      }
      !(function () {
        if (!(w.value instanceof HTMLElement && x.value instanceof HTMLElement && y.value instanceof HTMLElement)) return;
        w.value.style.setProperty('--vacp-hsl-h', String(z.hsl.h)),
          w.value.style.setProperty('--vacp-hsl-s', String(z.hsl.s)),
          w.value.style.setProperty('--vacp-hsl-l', String(z.hsl.l)),
          w.value.style.setProperty('--vacp-hsl-a', String(z.hsl.a)),
          (x.value.style.position = 'relative'),
          (x.value.style.backgroundColor = 'hsl(calc(var(--vacp-hsl-h) * 360) 100% 50%)'),
          (x.value.style.backgroundImage = 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)'),
          (y.value.style.boxSizing = 'border-box'),
          (y.value.style.position = 'absolute'),
          (y.value.style.left = 100 * z.hsv.s + '%'),
          (y.value.style.bottom = 100 * z.hsv.v + '%');
      })();
    }
    async function ue() {
      const e = z[$.value],
        a = 'hide' === m.alphaChannel,
        r = _(e, $.value, a);
      await window.navigator.clipboard.writeText(r);
    }
    function ve(e, a) {
      return C[e][a].to(z[e][a]);
    }
    function he(e) {
      if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key) || !e.shiftKey) return;
      const a = e.currentTarget,
        r = parseFloat(a.step),
        t = ['ArrowLeft', 'ArrowDown'].includes(e.key) ? -1 : 1,
        n = f(parseFloat(a.value) + t * r * 10, parseInt(a.min), parseInt(a.max));
      a.value = String(n - t * r);
    }
    return (
      t(() => m.color, H),
      n(function () {
        document.addEventListener('mousemove', L, { passive: !1 }),
          document.addEventListener('touchmove', I, { passive: !1 }),
          document.addEventListener('mouseup', E),
          document.addEventListener('touchend', E),
          H(m.color);
      }),
      o(function () {
        document.removeEventListener('mousemove', L), document.removeEventListener('touchmove', I), document.removeEventListener('mouseup', E), document.removeEventListener('touchend', E);
      }),
      (e, a) => (
        c(),
        i(
          'div',
          { ref_key: 'colorPicker', ref: w, class: 'vacp-color-picker uip-flex uip-flex-column uip-row-gap-xs' },
          [
            l(
              'div',
              { ref_key: 'colorSpace', ref: x, class: 'vacp-color-space uip-border-rounder uip-h-130 uip-w-100p', onMousedown: M, onTouchstart: F },
              [l('div', { ref_key: 'thumb', ref: y, class: 'vacp-color-space-thumb', tabindex: '0', 'aria-label': 'Color space thumb', onKeydown: T }, null, 544)],
              544
            ),
            l('div', K, [
              l(
                'label',
                { class: 'vacp-range-input-label vacp-range-input-label--hue', for: `${g.id}-hue-slider` },
                [
                  l('span', X, [s(e.$slots, 'hue-range-input-label', {}, () => [p('Hue')])]),
                  l(
                    'input',
                    {
                      id: `${g.id}-hue-slider`,
                      class: 'vacp-range-input vacp-range-input--hue',
                      value: 360 * z.hsv.h,
                      type: 'range',
                      min: '0',
                      max: '360',
                      step: '1',
                      onKeydownPassive: he,
                      onInput: a[0] || (a[0] = (e) => W(e, 'h')),
                    },
                    null,
                    40,
                    Y
                  ),
                ],
                8,
                R
              ),
              'show' === g.alphaChannel
                ? (c(),
                  i(
                    'label',
                    { key: 0, class: 'vacp-range-input-label vacp-range-input-label--alpha', for: `${g.id}-alpha-slider` },
                    [
                      l('span', G, [s(e.$slots, 'alpha-range-input-label', {}, () => [p('Alpha')])]),
                      l(
                        'input',
                        {
                          id: `${g.id}-alpha-slider`,
                          class: 'vacp-range-input vacp-range-input--alpha',
                          value: 100 * z.hsv.a,
                          type: 'range',
                          min: '0',
                          max: '100',
                          step: '1',
                          onKeydownPassive: he,
                          onInput: a[1] || (a[1] = (e) => W(e, 'a')),
                        },
                        null,
                        40,
                        J
                      ),
                    ],
                    8,
                    q
                  ))
                : u('v-if', !0),
            ]),
            l('button', { class: 'vacp-copy-button uip-hidden', type: 'button', onClick: ue }, [s(e.$slots, 'copy-button', {}, () => [Q, V])]),
            l('div', Z, [
              l('div', ee, [
                'hex' === $.value
                  ? (c(),
                    i(
                      'label',
                      { key: 0, class: 'vacp-color-input-label', for: `${g.id}-color-hex` },
                      [re, l('input', { id: `${g.id}-color-hex`, class: 'vacp-color-input', type: 'text', value: S.value, onInput: B }, null, 40, te)],
                      8,
                      ae
                    ))
                  : (c(!0),
                    i(
                      v,
                      { key: 1 },
                      h(
                        N.value,
                        (e) => (
                          c(),
                          i(
                            'label',
                            {
                              id: `${g.id}-color-${$.value}-${e}-label`,
                              key: `${g.id}-color-${$.value}-${e}-label`,
                              class: 'vacp-color-input-label',
                              for: `${g.id}-color-${$.value}-${e}`,
                              onInput: (a) => se(a, e),
                            },
                            [
                              l('span', oe, d(e.toUpperCase()), 1),
                              l('input', { id: `${g.id}-color-${$.value}-${e}`, class: 'vacp-color-input', type: 'text', value: ve($.value, e), onInput: (a) => se(a, e) }, null, 40, ce),
                            ],
                            40,
                            ne
                          )
                        )
                      ),
                      128
                    )),
              ]),
              g.visibleFormats.length > 1
                ? (c(), i('button', { key: 0, class: 'vacp-format-switch-button uip-hidden', type: 'button', onClick: A }, [s(e.$slots, 'format-switch-button', {}, () => [ie, le])]))
                : u('v-if', !0),
            ]),
          ],
          512
        )
      )
    );
  },
};
!(function (e, a) {
  void 0 === a && (a = {});
  var r = a.insertAt;
  if (e && 'undefined' != typeof document) {
    var t = document.head || document.getElementsByTagName('head')[0],
      n = document.createElement('style');
    (n.type = 'text/css'), 'top' === r && t.firstChild ? t.insertBefore(n, t.firstChild) : t.appendChild(n), n.styleSheet ? (n.styleSheet.cssText = e) : n.appendChild(document.createTextNode(e));
  }
})(
  '.vacp-color-picker{--vacp-color:hsl(calc(var(--vacp-hsl-h)*360) calc(var(--vacp-hsl-s)*100%) calc(var(--vacp-hsl-l)*100%)/var(--vacp-hsl-a));--vacp-focus-color:#19f;--vacp-focus-outline:2px solid var(--vacp-focus-color);--vacp-border-width:1px;--vacp-border-color:#000;--vacp-border:var(--vacp-border-width) solid var(--vacp-border-color);--vacp-color-space-width:300px;--vacp-spacing:6px;grid-gap:var(--vacp-spacing);background-color:transparent;display:grid;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:.8em;max-width:var(--vacp-color-space-width)}.vacp-color-picker *,.vacp-color-picker :after,.vacp-color-picker :before{box-sizing:border-box}.vacp-color-picker button::-moz-focus-inner{border:none;padding:0}.vacp-color-picker :focus{outline:var(--vacp-focus-outline)}.vacp-color-space{grid-column:1/-1;height:calc(var(--vacp-color-space-width)*.6);overflow:hidden}.vacp-color-space-thumb{--vacp-thumb-size:calc(var(--vacp-spacing)*4);border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);height:var(--vacp-thumb-size);margin-bottom:calc(var(--vacp-thumb-size)*-1/2);margin-left:calc(var(--vacp-thumb-size)*-1/2);transform:rotate(0);width:var(--vacp-thumb-size)}.vacp-color-space-thumb:focus{box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color),0 0 0 3px var(--vacp-focus-color);outline-color:transparent}.vacp-range-input-label{--vacp-slider-track-width:100%;--vacp-slider-track-height:calc(var(--vacp-spacing)*3);display:block}.vacp-range-input-group{display:flex;flex-direction:column;justify-content:center}.vacp-range-input-group>:not(:first-child){margin-top:var(--vacp-spacing)}.vacp-range-input,.vacp-range-input::-webkit-slider-thumb{-webkit-appearance:none}.vacp-range-input{background:none;border:none;display:block;height:var(--vacp-slider-track-height);margin-bottom:calc(var(--vacp-spacing)/2 + 1px);margin-left:0;margin-right:0;margin-top:calc(var(--vacp-spacing)/2 + 1px);padding:0;width:var(--vacp-slider-track-width)}.vacp-range-input:focus{outline:none}.vacp-range-input::-moz-focus-outer{border:none}.vacp-range-input--alpha{background-color:#fff;background-image:linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee),linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee);background-position:0 0,var(--vacp-spacing) var(--vacp-spacing);background-size:calc(var(--vacp-spacing)*2) calc(var(--vacp-spacing)*2)}.vacp-range-input::-moz-range-track{border:var(--vacp-border);box-sizing:content-box;height:var(--vacp-slider-track-height);width:var(--vacp-slider-track-width)}.vacp-range-input::-webkit-slider-runnable-track{border:var(--vacp-border);box-sizing:content-box;height:var(--vacp-slider-track-height);width:var(--vacp-slider-track-width)}.vacp-range-input::-ms-track{border:var(--vacp-border);box-sizing:content-box;height:var(--vacp-slider-track-height);width:var(--vacp-slider-track-width)}.vacp-range-input:focus::-moz-range-track{outline:var(--vacp-focus-outline)}.vacp-range-input:focus::-webkit-slider-runnable-track{outline:var(--vacp-focus-outline)}.vacp-range-input:focus::-ms-track{outline:var(--vacp-focus-outline)}.vacp-range-input--alpha::-moz-range-track{background-image:linear-gradient(to right,transparent,var(--vacp-color))}.vacp-range-input--alpha::-webkit-slider-runnable-track{background-image:linear-gradient(to right,transparent,var(--vacp-color))}.vacp-range-input--alpha::-ms-track{background-image:linear-gradient(to right,transparent,var(--vacp-color))}.vacp-range-input--hue::-moz-range-track{background-image:linear-gradient(90deg,red 0,#ff0 16.66667%,#0f0 33.33333%,#0ff 50%,#00f 66.66667%,#f0f 83.33333%,red 100%)}.vacp-range-input--hue::-webkit-slider-runnable-track{background-image:linear-gradient(90deg,red 0,#ff0 16.66667%,#0f0 33.33333%,#0ff 50%,#00f 66.66667%,#f0f 83.33333%,red 100%)}.vacp-range-input--hue::-ms-track{background-image:linear-gradient(90deg,red 0,#ff0 16.66667%,#0f0 33.33333%,#0ff 50%,#00f 66.66667%,#f0f 83.33333%,red 100%)}.vacp-range-input::-moz-range-thumb{background-color:transparent;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);box-sizing:content-box;height:var(--vacp-slider-track-height);isolation:isolate;width:var(--vacp-slider-track-height)}.vacp-range-input::-webkit-slider-thumb{background-color:transparent;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);box-sizing:content-box;height:var(--vacp-slider-track-height);isolation:isolate;margin-top:calc((var(--vacp-spacing)/2)*-1);width:var(--vacp-slider-track-height)}.vacp-range-input::-ms-thumb{background-color:transparent;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 var(--vacp-border-width) var(--vacp-border-color);box-sizing:content-box;height:var(--vacp-slider-track-height);isolation:isolate;margin-top:calc((var(--vacp-spacing)/2)*-1);width:var(--vacp-slider-track-height)}.vacp-copy-button{align-items:center;align-self:center;background-color:#fff;border:var(--vacp-border-width) solid transparent;border-radius:50%;display:flex;height:calc(var(--vacp-spacing)*6);justify-content:center;justify-self:center;overflow:hidden;position:relative;width:calc(var(--vacp-spacing)*6)}.vacp-copy-button:enabled:focus{border-color:var(--vacp-border-color);box-shadow:0 0 0 2px var(--vacp-focus-color);outline:none}.vacp-copy-button:enabled:hover{background-color:#0002}.vacp-color-inputs{align-items:center;display:flex;grid-column:1/-1}.vacp-color-inputs>:not(:first-child){margin-left:var(--vacp-spacing)}.vacp-color-input-group{column-gap:var(--vacp-spacing);display:grid;flex-grow:1;grid-auto-flow:column}.vacp-color-input-label{text-align:center}.vacp-color-input{border:var(--vacp-border);margin:0;margin-top:calc(var(--vacp-spacing)/2);text-align:center;width:100%}.vacp-color-input,.vacp-format-switch-button{background-color:#fff;color:inherit;font:inherit;padding:var(--vacp-spacing)}.vacp-format-switch-button{align-items:center;border:var(--vacp-border-width) solid transparent;border-radius:50%;display:flex;justify-content:center;margin:0}.vacp-format-switch-button:enabled:focus{border-color:var(--vacp-border-color)}.vacp-format-switch-button:enabled:hover{background-color:#0002}.vacp-visually-hidden{clip:rect(0 0 0 0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.vacp-range-input-label{margin:0!important}.vacp-range-input{border-radius:var(--uip-border-radius-large);height:8px}.vacp-range-input::-webkit-slider-runnable-track{border:none!important;border-radius:var(--uip-border-radius-large);height:8px}.vacp-range-input--alpha{background:repeating-conic-gradient(#cccccd 0 25%,transparent 0 50%) 50%/8px 10px}.vacp-range-input::-webkit-slider-thumb{width:8px;height:8px;outline:grey 1px;box-shadow:0 0 0 1px var(--uip-border-color)}.vacp-color-space-thumb{--vacp-thumb-size:calc(var(--vacp-spacing)*2);border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px var(--uip-border-color);height:12px;width:12px}'
),
  (se.__file = 'src/ColorPicker.vue');
const pe = {
  install(e) {
    e.component('ColorPicker', se);
  },
};
export default se;
