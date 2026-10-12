import { toCharacter, slimUser, slimRepo, playUrl, ATTR_SOURCES, RACE_RULES, FAMILIES } from "./mapping.js";
import { buildRows, rowsToHTML, rowsToCanvas, loadPortrait, FONT } from "./card.js";
import { SAMPLE } from "./sample.js";
import { RACES, PROFESSIONS } from "./data.js";

const SITE = "https://pravin.github.io/charsheet/";
const API = "https://api.github.com";
const CACHE_MS = 60 * 60 * 1000;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LOGIN_RE = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

// ---------- fetching ----------
class ApiError extends Error {
  constructor(kind, msg, extra = {}) { super(msg); this.kind = kind; Object.assign(this, extra); }
}

function headers() {
  const h = { Accept: "application/vnd.github+json" };
  // Local debugging only: a token you put in localStorage yourself, never shipped.
  if (["localhost", "127.0.0.1"].includes(location.hostname)) {
    try { const t = localStorage.getItem("charsheet-debug-token"); if (t) h.Authorization = `Bearer ${t}`; } catch {}
  }
  return h;
}

async function get(path) {
  let res;
  try { res = await fetch(API + path, { headers: headers() }); }
  catch { throw new ApiError("network", "Couldn't reach GitHub. Check your connection and try again."); }
  if (res.ok) return res.json();
  const remaining = res.headers.get("x-ratelimit-remaining");
  if ((res.status === 403 || res.status === 429) && (remaining === "0" || res.status === 429)) {
    const reset = Number(res.headers.get("x-ratelimit-reset")) * 1000 || Date.now() + 3600e3;
    throw new ApiError("rate", "rate limited", { reset });
  }
  if (res.status === 404) throw new ApiError("notfound", "not found");
  throw new ApiError("http", `GitHub answered ${res.status}.`);
}

async function fetchProfile(login) {
  const key = `charsheet:v1:${login.toLowerCase()}`;
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || "null");
    if (hit && Date.now() - hit.at < CACHE_MS) return hit;
  } catch {}
  const user = await get(`/users/${encodeURIComponent(login)}`);
  const repos = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await get(`/users/${encodeURIComponent(user.login)}/repos?per_page=100&type=owner&sort=pushed&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  const data = { user: slimUser(user), repos: repos.map(slimRepo), at: Date.now() };
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch {}
  return data;
}

// ---------- rendering ----------
let current = null; // { ch, rows }

async function showCard(data, target) {
  const ch = toCharacter(data.user, data.repos, data.at);
  const draw = (portrait) => {
    const rows = buildRows(ch, portrait);
    target.innerHTML = rowsToHTML(rows);
    current = { ch, rows };
  };
  draw(null);
  const portrait = await loadPortrait(ch.avatar);
  if (portrait) draw(portrait);
  return ch;
}

function shareText(ch) {
  const weapon = ch.items[0] ? `, wielding a +${ch.items[0].plus} ${ch.items[0].name}` : "";
  return `My GitHub as a roguelike character: a level ${ch.level} ${ch.race.name} ${ch.profession.name} of the ${ch.creed.creed}${weapon}. What's yours?`;
}
const pageUrl = (ch) => `${SITE}?u=${encodeURIComponent(ch.login)}`;

function renderSide(ch) {
  $("#play").href = playUrl(ch);
  $("#play-sub").textContent = `Start a new game as a ${ch.race.name} ${ch.profession.name}. Free, in your browser.`;
  $("#why").innerHTML = `
    <dt>${esc(ch.race.name)}</dt><dd>${esc(ch.race.why)} <span class="flav">${esc(ch.race.description)}</span></dd>
    <dt>${esc(ch.profession.name)}</dt><dd>${esc(ch.profession.why)} <span class="flav">${esc(ch.profession.description)}</span></dd>
    <dt>${esc(ch.creed.creed === "Balance" ? "The Tide" : ch.creed.creed)}</dt><dd>${esc(creedWhy(ch))}</dd>`;
  const text = shareText(ch), url = pageUrl(ch);
  $("#x").href = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  $("#li").href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  renderNumbers(ch);
}

function creedWhy(ch) {
  const m = ch.metrics;
  const pct = (x) => `${Math.round(x * 100)}%`;
  if (!m.total) return "No public repos to judge by, so you stand in the Tide.";
  return `${pct(m.longLived)} of your repos lived past a year and ${pct(m.licensed)} carry a licence (the Vigil), against ${pct(m.shortLived)} finished within a week and ${pct(m.forkFrac)} forks (the Rift).`;
}

function renderNumbers(ch) {
  const m = ch.metrics;
  const rows = [
    ["Original repos", m.originals], ["Forks", m.forks], ["Stars on originals", m.stars], ["Forks of your repos", m.forksReceived],
    ["Followers", m.followers], ["Following", m.following], ["Gists", m.gists], ["Languages", m.distinctLangs],
    ["Account age", `${m.ageYears.toFixed(1)} years`], ["Pushed in last 90 days", m.recent90], ["Archived repos", m.archived],
  ];
  $("#numbers").innerHTML = rows.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(typeof v === "number" ? v.toLocaleString("en-US") : v)}</b></div>`).join("") +
    `<p class="note">Attributes: ${ch.attrs.map((a) => `${a.ab} ${a.base}${a.mod ? (a.mod > 0 ? "+" : "") + a.mod : ""}`).join(" · ")} (from GitHub, then race and profession modifiers)</p>`;
}

// ---------- the "how" section is generated from the real rules ----------
function renderHow() {
  $("#how-race").innerHTML = RACE_RULES.map(([id, why]) => `<li><b>${esc(RACES[id].name)}</b> ${esc(why)}</li>`).join("");
  $("#how-prof").innerHTML = Object.entries(FAMILIES).map(([id, f]) =>
    `<li><b>${esc(PROFESSIONS[id].name)}</b> ${esc(f.langs.slice(0, 6).join(", "))}${f.langs.length > 6 ? "…" : ""}</li>`).join("");
  $("#how-attrs").innerHTML = Object.entries(ATTR_SOURCES).map(([ab, [src]]) => `<li><b>${ab}</b> ${esc(src)}</li>`).join("");
}

// ---------- sharing ----------
async function cardCanvas() {
  try {
    await Promise.all([document.fonts.load(`20px ${FONT}`, "A█═"), document.fonts.ready]);
  } catch {}
  return rowsToCanvas(current.rows, { scale: 2, fontPx: 20 });
}
// Exposed for tests and the curious: render the current card to a canvas.
window.charsheetCanvas = () => current && cardCanvas();
const toBlob = (cv) => new Promise((r) => cv.toBlob(r, "image/png"));

async function download() {
  if (!current) return;
  const blob = await toBlob(await cardCanvas());
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `charsheet-${current.ch.login}.png`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast("Saved the card as a PNG.");
}

async function shareImage() {
  if (!current) return;
  const blob = await toBlob(await cardCanvas());
  const file = new File([blob], `charsheet-${current.ch.login}.png`, { type: "image/png" });
  const ch = current.ch;
  try {
    await navigator.share({ files: [file], title: `${ch.display}: ${ch.race.name} ${ch.profession.name}`, text: `${shareText(ch)} ${pageUrl(ch)}` });
  } catch (e) {
    if (e && e.name !== "AbortError") download();
  }
}

async function copyLink() {
  if (!current) return;
  const url = pageUrl(current.ch);
  try { await navigator.clipboard.writeText(url); toast("Link copied."); }
  catch { window.prompt("Copy this link:", url); }
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2400);
}

// ---------- errors ----------
function showError(err, login) {
  const box = $("#error");
  let html;
  if (err.kind === "notfound") html = `<b>No one called @${esc(login)} came to the Vaultspine.</b> There's no GitHub user or organisation with that name. Check the spelling?`;
  else if (err.kind === "rate") {
    const at = new Date(err.reset);
    const mins = Math.max(1, Math.ceil((err.reset - Date.now()) / 60000));
    html = `<b>The bell-wardens need a rest.</b> GitHub allows 60 lookups an hour from one network without signing in, and this one has used them up. Try again in about ${mins} minute${mins === 1 ? "" : "s"} (at ${esc(at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}). Characters you've already looked at are remembered for this tab.`;
  } else if (err.kind === "bad") html = `<b>That isn't a GitHub username.</b> Usernames are letters, digits and single hyphens, up to 39 characters.`;
  else html = `<b>Something went wrong.</b> ${esc(err.message)}`;
  box.innerHTML = html;
  box.hidden = false;
}

// ---------- boot ----------
function goto(login) {
  const u = new URL(location.href);
  u.search = login ? `?u=${encodeURIComponent(login)}` : "";
  location.href = u.toString();
}

function bindForms() {
  document.querySelectorAll("form.lookup").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = f.querySelector("input").value.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/\/.*$/, "");
    if (v) goto(v);
  }));
  $("#dl").addEventListener("click", download);
  $("#copy").addEventListener("click", copyLink);
  const sh = $("#share");
  try {
    const probe = new File([new Blob(["x"], { type: "image/png" })], "x.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [probe] })) { sh.hidden = false; sh.addEventListener("click", shareImage); }
  } catch {}
}

async function main() {
  renderHow();
  bindForms();
  const login = (new URLSearchParams(location.search).get("u") || "").trim().replace(/^@/, "");
  const card = $("#card");
  if (!login) {
    document.body.dataset.mode = "landing";
    const ch = await showCard(SAMPLE, card);
    renderSide(ch);
    return;
  }
  document.body.dataset.mode = "loading";
  $("#q2").value = login;
  document.title = `@${login} · Charsheet`;
  if (!LOGIN_RE.test(login)) { document.body.dataset.mode = "error"; return showError(new ApiError("bad", ""), login); }
  card.innerHTML = loadingRows(login);
  try {
    const data = await fetchProfile(login);
    const ch = await showCard(data, card);
    document.body.dataset.mode = "sheet";
    document.title = `${ch.display}, ${ch.race.name} ${ch.profession.name} · Charsheet`;
    if (!data.repos.length) $("#empty").hidden = false;
    renderSide(ch);
  } catch (err) {
    document.body.dataset.mode = "error";
    showError(err, login);
  }
}

function loadingRows(login) {
  return `<span class="k-f">╔${"═".repeat(58)}╗</span>\n<span class="k-f">║</span> <span class="k-d">${esc(("Reading the ledger for @" + login + "…").slice(0, 56).padEnd(56))}</span> <span class="k-f">║</span>\n<span class="k-f">╚${"═".repeat(58)}╝</span>`;
}

main();
