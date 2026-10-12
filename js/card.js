// The character sheet as a grid of monospace cells, drawn two ways from the
// same rows: as HTML spans (on the page) and onto a canvas (the PNG).

export const COLS = 60; // the card is 60 columns wide; inner text area is 56
const IN = COLS - 4;

export const COLORS = {
  f: "#2f5d6e", // frame
  t: "#5fa8bc", // frame titles (cyan)
  a: "#e8a33d", // amber
  b: "#b98235", // amber, dimmer
  i: "#dfe6f2", // ink
  d: "#9aa7bd", // ink 2
  m: "#5c6a83", // ink 3
  o: "#34466a", // bar background
  c: "#5fa8bc", // blessed / Balance
  r: "#e0664f", // cursed / Rift
  v: "#eef1f7", // Vigil (pale)
};
export const BG = "#0b1220";
export const FONT = '"Plex Mono CS", "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';

const seg = (t, c = "i") => ({ t: String(t), c });
const len = (segs) => segs.reduce((n, s) => n + [...s.t].length, 0);
function fit(segs, width) {
  // Cut or pad a row of segments to exactly `width` characters.
  const out = [];
  let n = 0;
  for (const s of segs) {
    const chars = [...s.t];
    if (n + chars.length <= width) { out.push(s); n += chars.length; continue; }
    const room = width - n;
    if (room > 0) out.push(seg(chars.slice(0, Math.max(0, room - 1)).join("") + "…", s.c));
    n = width;
    break;
  }
  if (n < width) out.push(seg(" ".repeat(width - n)));
  return out;
}
const trunc = (s, w) => ([...s].length > w ? [...s].slice(0, w - 1).join("") + "…" : s);
function wrap(text, w) {
  const lines = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    if (!cur) cur = word;
    else if (cur.length + 1 + word.length <= w) cur += " " + word;
    else { lines.push(cur); cur = word; }
  }
  if (cur) lines.push(cur);
  return lines;
}
export function compact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "m";
  if (n >= 1e4) return Math.round(n / 1e3) + "k";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
const fmt = (n) => n.toLocaleString("en-US");

// Frame helpers
const row = (segs) => [seg("║ ", "f"), ...fit(segs, IN), seg(" ║", "f")];
function rule(title, left = "╟", right = "╢", ch = "─") {
  if (!title) return [seg(left + ch.repeat(COLS - 2) + right, "f")];
  const head = `${ch} `, tail = ` ${ch.repeat(COLS - 2 - 2 - title.length - 1)}`;
  return [seg(left + head, "f"), seg(title, "t"), seg(tail + right, "f")];
}
function topRule(left, right) {
  const fill = COLS - 2 - 2 - left.length - right.length - 2 - 2;
  return [seg("╔═ ", "f"), seg(left, "a"), seg(" " + "═".repeat(fill) + " ", "f"), seg(right, "t"), seg(" ═╗", "f")];
}
function bottomRule(left, right) {
  const fill = COLS - 2 - 2 - left.length - right.length - 2 - 2;
  return [seg("╚═ ", "f"), seg(left, "m"), seg(" " + "═".repeat(fill) + " ", "f"), seg(right, "m"), seg(" ═╝", "f")];
}

// A fallback portrait when the avatar can't be read: a big @.
const AT = [
  "                  ",
  "     .:=***=:.    ",
  "   :*%#+==+#%*:   ",
  "  =%*: =##=+ *%=  ",
  "  =%= +%= #* =%=  ",
  "  :%*:.=##*=#%*.  ",
  "   .=*%%##%%*=.   ",
  "                  ",
];
export const AVATAR_W = 18, AVATAR_H = 8;
export function fallbackPortrait() {
  return AT.map((l) => [...l].map((ch) => ({ ch, c: ch === " " ? "m" : /[%#@]/.test(ch) ? "a" : /[*+=]/.test(ch) ? "b" : "m" })));
}

const CREED_COLOR = { Vigil: "v", Balance: "c", Rift: "r" };
const STATUS_COLOR = { blessed: "c", cursed: "r", uncursed: "i" };

export function buildRows(ch, portrait) {
  const rows = [];
  rows.push(topRule("HOLLOWMOON", "CHARACTER SHEET"));
  rows.push(row([]));
  const P = portrait || fallbackPortrait();
  const creedC = CREED_COLOR[ch.creed.creed];
  const infoW = IN - AVATAR_W - 2;
  const info = [
    [seg(trunc(ch.display, infoW), "a")],
    [seg(`${ch.race.name} ${ch.profession.name}`, "i")],
    [seg("Level ", "d"), seg(ch.level, "a"), seg("   Exp ", "d"), seg(fmt(ch.xp), "i")],
    [seg("Creed ", "d"), seg(ch.creed.code.padEnd(3), creedC), seg(` ${ch.creed.long}`, "d")],
    [seg("Deity ", "d"), seg(`${ch.deity}, ${ch.deityTitle}`, "i")],
    [seg("Born  ", "d"), seg(`under ${ch.turning}, ${ch.born}`, "i")],
    [seg("HP ", "d"), seg(fmt(ch.hp), "i"), seg("  PP ", "d"), seg(fmt(ch.pp), "i"), seg("  Gold ", "d"), seg(compact(ch.gold), "a"), seg("  Marks ", "d"), seg(ch.marks, ch.marks ? "r" : "i")],
    [seg("github.com/", "m"), seg(ch.login, "d")],
  ];
  for (let y = 0; y < AVATAR_H; y++) {
    const pr = P[y].map((cell) => seg(cell.ch, cell.c));
    rows.push(row([...pr, seg("  "), ...fit(info[y] || [], infoW)]));
  }
  rows.push(row([]));

  rows.push(rule("ATTRIBUTES"));
  for (let r = 0; r < 3; r++) {
    const cells = [];
    for (let k = 0; k < 3; k++) {
      const a = ch.attrs[r * 3 + k];
      const filled = Math.round(((a.value - 3) / 22) * 10);
      cells.push(seg(a.ab + " ", "d"), seg(String(a.value).padStart(2), a.value >= 18 ? "a" : "i"), seg(" "),
        seg("━".repeat(filled), a.value >= 18 ? "a" : "b"), seg("┄".repeat(10 - filled), "o"), seg(k < 2 ? "  " : ""));
    }
    rows.push(row(cells));
  }

  rows.push(rule("EQUIPMENT"));
  for (let k = 0; k < 6; k++) {
    const it = ch.items[k];
    const letter = String.fromCharCode(97 + k);
    const slot = ["Main hand", "Off hand", "Body", "Neck", "Cloak", "Missile"][k].padEnd(10);
    if (!it) { rows.push(row([seg(`${letter} `, "m"), seg(slot, "m"), seg("-", "m")])); continue; }
    const name = `+${it.plus} ${it.name}${it.lang ? ` of ${it.lang}` : ""}`;
    const star = `${compact(it.stars)}*`;
    const room = IN - 2 - 10 - 1 - star.length;
    rows.push(row([seg(`${letter} `, "m"), seg(slot, "d"), seg(trunc(name, room).padEnd(room), STATUS_COLOR[it.status]), seg(" "), seg(star, it.stars ? "a" : "m")]));
  }

  rows.push(rule("TRAITS"));
  if (!ch.traits.length) rows.push(row([seg("None yet. Every hero starts somewhere.", "m")]));
  for (const t of ch.traits) rows.push(row([seg(t.name.padEnd(19), "a"), seg(t.why, "d")]));

  rows.push(rule());
  for (const l of wrap(ch.epitaph, IN)) rows.push(row([seg(l, "i")]));
  rows.push(row([seg(`"${ch.saying}"`, creedC === "v" ? "d" : creedC)]));
  rows.push(bottomRule("pravin.github.io/charsheet", ch.isOrg ? "a guild" : `@${ch.login}`.slice(0, 20)));
  return rows;
}

// ---- HTML ----
export function rowsToHTML(rows) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return rows.map((r) => {
    // merge neighbouring segments of the same colour
    const out = [];
    for (const s of r) {
      if (out.length && out[out.length - 1].c === s.c) out[out.length - 1].t += s.t;
      else out.push({ ...s });
    }
    return out.map((s) => `<span class="k-${s.c}">${esc(s.t)}</span>`).join("");
  }).join("\n");
}

// ---- Canvas ----
// Draws the card at `scale` (2 for a crisp download). The font must be loaded
// first (document.fonts.load), or the canvas falls back to a system mono.
export function rowsToCanvas(rows, { scale = 2, fontPx = 20 } = {}) {
  const cw = fontPx * 0.6, lh = fontPx * 1.3, pad = 44;
  const W = Math.round(COLS * cw + pad * 2), H = Math.round(rows.length * lh + pad * 2 + 14);
  const cv = document.createElement("canvas");
  cv.width = W * scale; cv.height = H * scale;
  const g = cv.getContext("2d");
  g.scale(scale, scale);
  g.fillStyle = BG;
  g.fillRect(0, 0, W, H);
  // drafting grid
  g.lineWidth = 1;
  for (const [step, alpha] of [[28, 0.045], [140, 0.08]]) {
    g.strokeStyle = `rgba(95,168,188,${alpha})`;
    g.beginPath();
    for (let x = 0.5; x < W; x += step) { g.moveTo(x, 0); g.lineTo(x, H); }
    for (let y = 0.5; y < H; y += step) { g.moveTo(0, y); g.lineTo(W, y); }
    g.stroke();
  }
  // corner ticks
  g.strokeStyle = "#5fa8bc";
  g.beginPath();
  const t = 18, o = 14;
  g.moveTo(o, o + t); g.lineTo(o, o); g.lineTo(o + t, o);
  g.moveTo(W - o - t, H - o); g.lineTo(W - o, H - o); g.lineTo(W - o, H - o - t);
  g.stroke();

  g.font = `${fontPx}px ${FONT}`;
  g.textBaseline = "alphabetic";
  const ascent = fontPx * 1.025; // Plex Mono: ascender 1025/1000 inside a 1.3em line
  rows.forEach((r, y) => {
    let x = 0;
    for (const s of r) {
      const chars = [...s.t];
      if (s.t.trim()) {
        g.fillStyle = COLORS[s.c] || COLORS.i;
        // draw char by char so the grid never drifts, whatever the font
        chars.forEach((c, k) => { if (c !== " ") g.fillText(c, pad + (x + k) * cw, pad + y * lh + ascent); });
      }
      x += chars.length;
    }
  });
  return cv;
}

// ---- Avatar -> ASCII portrait ----
const RAMP = " .:-=+*#%@";
export function portraitFromImage(img) {
  const sw = AVATAR_W * 2, sh = AVATAR_H * 4; // supersample, then average
  const cv = document.createElement("canvas");
  cv.width = sw; cv.height = sh;
  const g = cv.getContext("2d", { willReadFrequently: true });
  // crop the square avatar to the card's cell aspect (18 x 8 cells is ~square)
  g.drawImage(img, 0, 0, sw, sh);
  const d = g.getImageData(0, 0, sw, sh).data; // throws if tainted
  const px = (x, y) => { const i = (y * sw + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  // background = average of the four corners
  const corners = [px(0, 0), px(sw - 1, 0), px(0, sh - 1), px(sw - 1, sh - 1)];
  const bg = [0, 1, 2].map((k) => corners.reduce((a, c) => a + c[k], 0) / 4);
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const vals = [];
  let max = 1;
  for (let y = 0; y < AVATAR_H; y++) {
    const r = [];
    for (let x = 0; x < AVATAR_W; x++) {
      let dist = 0, l = 0;
      for (let yy = 0; yy < 4; yy++) for (let xx = 0; xx < 2; xx++) {
        const c = px(x * 2 + xx, y * 4 + yy);
        dist += Math.hypot(c[0] - bg[0], c[1] - bg[1], c[2] - bg[2]);
        l += lum(c);
      }
      r.push({ dist: dist / 8, l: l / 8 });
      max = Math.max(max, dist / 8);
    }
    vals.push(r);
  }
  // A flat background (identicons, logos): draw what differs from it. A photo
  // (corners disagree): draw brightness, stretched to the full ramp.
  const spread = Math.max(...corners.map((c) => Math.hypot(c[0] - bg[0], c[1] - bg[1], c[2] - bg[2])));
  const ls = vals.flat().map((v) => v.l);
  const lo = Math.min(...ls), hi = Math.max(...ls) || 1;
  return vals.map((r) => r.map(({ dist, l }) => {
    const v = spread > 40 ? (l - lo) / Math.max(1, hi - lo) : Math.min(1, dist / max);
    const ch = RAMP[Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)))];
    return { ch, c: v > 0.66 ? "a" : v > 0.33 ? "b" : "m" };
  }));
}

export function loadPortrait(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { try { resolve(portraitFromImage(img)); } catch { resolve(null); } };
    img.onerror = () => resolve(null);
    img.src = url + (url.includes("?") ? "&" : "?") + "s=96";
    setTimeout(() => resolve(null), 8000);
  });
}
