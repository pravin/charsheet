// GitHub profile -> Hollowmoon character. Pure functions, no DOM: the same
// input always gives the same character. `now` is passed in so a sheet does
// not depend on hidden state (the page passes the time the data was fetched).

import { RACES, PROFESSIONS } from "./data.js";

export const ATTRS = [
  ["St", "Strength"], ["In", "Intellect"], ["Wi", "Willpower"],
  ["Ag", "Agility"], ["En", "Endurance"], ["Pr", "Presence"],
  ["Gr", "Grace"], ["Ae", "Aether"], ["Se", "Senses"],
];

// Twelve months of thirty days, each named for the moon's turning.
export const TURNINGS = ["Ember", "Frost", "Thaw", "Seed", "Bloom", "Blaze", "Harvest", "Dusk", "Mist", "Gale", "Hush", "Veil"];

export const FACES = {
  Vigil: { deity: "Aelthe", title: "the Keeper", saying: "What is named endures." },
  Balance: { deity: "Ondra", title: "the Tide", saying: "Names are given and taken like the tide." },
  Rift: { deity: "Vhask", title: "the Rent", saying: "Only the unnamed are free." },
};

// Language -> family -> profession. Families are the "kind" of code you write.
export const FAMILIES = {
  shardwright: { label: "systems", langs: ["C", "C++", "Assembly", "Zig", "CUDA", "Verilog", "SystemVerilog", "VHDL", "Nim", "D", "Odin", "V", "Objective-C++", "Cuda"] },
  oathsworn: { label: "Rust", langs: ["Rust", "Ada"] },
  warden: { label: "Go", langs: ["Go"] },
  hierophant: { label: "JVM and .NET", langs: ["Java", "C#", "Scala", "Groovy", "Visual Basic .NET", "Kotlin Script"] },
  pathfinder: { label: "shell and infrastructure", langs: ["Shell", "Dockerfile", "HCL", "Nix", "PowerShell", "Makefile", "Batchfile", "Puppet", "Jinja", "Starlark", "CMake", "Just", "Bicep", "Nushell", "Fish"] },
  lanternkeeper: { label: "TypeScript", langs: ["TypeScript"] },
  tidecaller: { label: "JavaScript", langs: ["JavaScript", "CoffeeScript", "LiveScript"] },
  skald: { label: "front-end", langs: ["HTML", "CSS", "SCSS", "Sass", "Less", "Stylus", "Vue", "Svelte", "Astro", "MDX", "Handlebars", "EJS", "Pug", "Liquid", "Twig", "Nunjucks"] },
  arcanist: { label: "Python", langs: ["Python", "Cython"] },
  mindweaver: { label: "data and ML", langs: ["Jupyter Notebook", "R", "Julia", "MATLAB", "Stan", "SAS", "Mathematica", "Wolfram Language", "Rich Text Format"] },
  ascetic: { label: "functional and editor", langs: ["Haskell", "OCaml", "Elm", "F#", "PureScript", "Idris", "Agda", "Coq", "Rocq Prover", "Lean", "Standard ML", "Racket", "Scheme", "Common Lisp", "Clojure", "Emacs Lisp", "Vim Script", "Vim script", "ReScript", "Reason", "Roc", "Unison", "Prolog"] },
  chirurgeon: { label: "BEAM", langs: ["Erlang", "Elixir", "Gleam", "LFE"] },
  factor: { label: "web-shop", langs: ["PHP", "Ruby", "Solidity", "Hack", "Blade", "ABAP", "Apex", "Move"] },
  marksman: { label: "mobile", langs: ["Swift", "Objective-C", "Dart", "Kotlin"] },
  bonesinger: { label: "elder", langs: ["Perl", "Raku", "Fortran", "COBOL", "Pascal", "Delphi", "Visual Basic", "Visual Basic 6.0", "VBA", "VBScript", "ActionScript", "Tcl", "Smalltalk", "AutoHotkey", "ColdFusion", "Classic ASP", "Logo", "BASIC", "FreeBASIC", "PureBasic"] },
  verdant: { label: "games and creative", langs: ["Lua", "GDScript", "GLSL", "HLSL", "ShaderLab", "Processing", "GameMaker Language", "Haxe", "OpenSCAD", "SuperCollider", "Max", "Pure Data", "Csound", "Squirrel", "AngelScript", "Ren'Py", "Luau", "WGSL"] },
  cartographer: { label: "writing", langs: ["TeX", "Markdown", "reStructuredText", "AsciiDoc", "Org", "Roff", "BibTeX"] },
};
const LANG_FAMILY = {};
for (const [prof, f] of Object.entries(FAMILIES)) for (const l of f.langs) if (!LANG_FAMILY[l]) LANG_FAMILY[l] = prof;

// What each language is "made of" when a repo becomes an item.
const ITEM_KIND = {
  shardwright: "hammer", oathsworn: "blade", warden: "shield", hierophant: "censer", pathfinder: "rope",
  lanternkeeper: "lantern", tidecaller: "wand", skald: "lute", arcanist: "tome", mindweaver: "orb",
  ascetic: "staff", chirurgeon: "salve", factor: "ledger", marksman: "bow", bonesinger: "bone flute",
  verdant: "seed", cartographer: "map",
};
export const SLOTS = ["Main hand", "Off hand", "Body", "Neck", "Cloak", "Missile"];

const DAY = 86400000, YEAR = 365.25 * DAY;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const log2 = (x) => Math.log2(x), log10 = (x) => Math.log10(x);

// Trim the API payloads to what the mapping uses (also what gets cached).
export function slimUser(u) {
  const keep = ["login", "id", "name", "bio", "blog", "location", "company", "twitter_username", "hireable", "public_repos", "public_gists", "followers", "following", "created_at", "type", "avatar_url"];
  return Object.fromEntries(keep.map((k) => [k, u[k] ?? null]));
}
export function slimRepo(r) {
  return {
    name: r.name, fork: !!r.fork, archived: !!r.archived, stars: r.stargazers_count | 0, forks: r.forks_count | 0,
    language: r.language || null, created: r.created_at, pushed: r.pushed_at || r.created_at,
    desc: !!(r.description && r.description.trim()), license: !!(r.license && r.license.key && r.license.key !== "other"),
    topics: (r.topics || []).length, homepage: !!(r.homepage && r.homepage.trim()),
  };
}

export function metrics(user, repos, now) {
  const t = (s) => new Date(s).getTime();
  const originals = repos.filter((r) => !r.fork);
  const forks = repos.filter((r) => r.fork);
  const stars = originals.reduce((a, r) => a + r.stars, 0);
  const forksReceived = originals.reduce((a, r) => a + r.forks, 0);
  const ageYears = Math.max(0, (now - t(user.created_at)) / YEAR);
  const span = (r) => Math.max(0, t(r.pushed) - t(r.created));

  // Language weights: each original repo counts 1 + log2(1 + stars).
  const langW = {};
  for (const r of originals) if (r.language) langW[r.language] = (langW[r.language] || 0) + 1 + log2(1 + r.stars);
  const langs = Object.entries(langW).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const langTotal = langs.reduce((a, [, w]) => a + w, 0);
  const famW = {};
  for (const [l, w] of langs) { const f = LANG_FAMILY[l]; if (f) famW[f] = (famW[f] || 0) + w; }
  const families = Object.entries(famW).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const n = originals.length || 1;
  const frac = (pred) => originals.filter(pred).length / n;
  const lastPush = repos.reduce((a, r) => Math.max(a, t(r.pushed)), 0);
  const recent90 = originals.filter((r) => now - t(r.pushed) < 90 * DAY).length;
  const years = new Set(originals.map((r) => new Date(r.created).getUTCFullYear()));
  const firstYear = new Date(user.created_at).getUTCFullYear(), thisYear = new Date(now).getUTCFullYear();
  const spanYears = thisYear - firstYear + 1;
  const sortedByStars = [...originals].sort((a, b) => b.stars - a.stars || b.forks - a.forks || t(b.pushed) - t(a.pushed) || a.name.localeCompare(b.name));
  const oldest = [...originals].sort((a, b) => t(a.created) - t(b.created) || a.name.localeCompare(b.name))[0] || null;
  const longest = [...originals].sort((a, b) => span(b) - span(a) || a.name.localeCompare(b.name))[0] || null;

  return {
    originals: originals.length, forks: forks.length, total: repos.length, stars, forksReceived,
    followers: user.followers | 0, following: user.following | 0, gists: user.public_gists | 0,
    ageYears, created: user.created_at, langs, langTotal, families, distinctLangs: langs.length,
    topStar: sortedByStars[0] || null, topStarShare: stars ? (sortedByStars[0]?.stars || 0) / stars : 0,
    sortedByStars, oldest, longest, longestYears: longest ? span(longest) / YEAR : 0,
    longLived: frac((r) => span(r) > YEAR), shortLived: frac((r) => span(r) < 7 * DAY),
    licensed: frac((r) => r.license), described: frac((r) => r.desc), topicsFrac: frac((r) => r.topics > 0),
    homepages: originals.filter((r) => r.homepage).length, archived: originals.filter((r) => r.archived).length,
    forkFrac: repos.length ? forks.length / repos.length : 0,
    daysSincePush: lastPush ? (now - lastPush) / DAY : Infinity, recent90,
    activeYearsRatio: spanYears > 0 ? years.size / spanYears : 0, spanYears,
    profileFields: ["name", "bio", "blog", "location", "company", "twitter_username"].filter((k) => user[k] && String(user[k]).trim()).length,
    hasName: !!(user.name && user.name.trim()), hasBio: !!(user.bio && user.bio.trim()),
  };
}

// ---- Race: the first rule that fits, top to bottom. ----
export const RACE_RULES = [
  ["grothir", "A stone giant: more than 20,000 stars on 40 or fewer repos.", (m) => m.stars >= 20000 && m.originals <= 40],
  ["gnarl", "A toolmaker: 150 or more original repos.", (m) => m.originals >= 150],
  ["vael", "Renowned and long-lived: 10,000+ followers.", (m) => m.followers >= 10000],
  ["stoneblood", "Half a giant: 2,000+ stars.", (m) => m.stars >= 2000],
  ["ashborn", "One bright shard: a repo with 200+ stars holding three quarters of all your stars.", (m) => (m.topStar?.stars || 0) >= 200 && m.topStarShare >= 0.75],
  ["sunken_vael", "Went under the mountain: an account 10+ years old with 5 or fewer public repos.", (m) => m.ageYears >= 10 && m.originals <= 5],
  ["hollowed", "Partway erased: nothing pushed for two years.", (m) => m.total > 0 && m.daysSincePush > 730],
  ["skrit", "A scavenger: more forks than originals.", (m) => m.forks > m.originals],
  ["echofolk", "Eyeless: no name, no bio, no website, no location.", (m) => m.profileFields === 0],
  ["bellborn", "Taught names before words: most repos carry topics.", (m) => m.originals >= 3 && m.topicsFrac >= 0.5],
  ["skarn", "Runs with the pack: follows 100+ people, more than follow back.", (m) => m.following >= 100 && m.following >= m.followers],
  ["windborne", "Counts time in horizons: 10+ languages.", (m) => m.distinctLangs >= 10],
  ["fenwalker", "Amphibious: two languages, each at least 30% of your code.", (m) => m.langs.length >= 2 && m.langs[1][1] / m.langTotal >= 0.3],
  ["ebbfolk", "Rises and falls with the moon: repos started in fewer than half the years since you joined.", (m) => m.originals >= 3 && m.spanYears >= 4 && m.activeYearsRatio < 0.5],
  ["hearthkin", "Dug the first shafts: an account 12+ years old.", (m) => m.ageYears >= 12],
  ["karrok", "War-bred: an account under 3 years old with 10+ repos.", (m) => m.ageYears < 3 && m.originals >= 10],
  ["pickwit", "Not noticed: 20+ repos and fewer than 25 followers.", (m) => m.originals >= 20 && m.followers < 25],
  ["reachfolk", "None of the above: hardy, average, quick to learn.", () => true],
];

function pickRace(m) {
  for (const [id, why, test] of RACE_RULES) if (test(m)) return { id, why };
}

// ---- Profession: a few habits first, then the dominant kind of code. ----
function pickProfession(m) {
  if (m.originals < 2 || m.langTotal === 0)
    return { id: "yeoman", why: "Fewer than two original repos with code: the underdog's road." };
  if (m.forks >= 10 && m.forkFrac >= 0.6)
    return { id: "nightcutter", why: `${Math.round(m.forkFrac * 100)}% of your repos are forks: you bring back what others carried.` };
  if (m.originals >= 10 && m.shortLived >= 0.6)
    return { id: "riftbound", why: `${Math.round(m.shortLived * 100)}% of your repos were done within a week of starting: every experiment a mark.` };
  if (m.originals >= 6 && m.described <= 0.3)
    return { id: "reaver", why: `${Math.round((1 - m.described) * 100)}% of your repos have no description. Reavers do not read.` };
  const top = m.families[0];
  const share = top ? top[1] / m.langTotal : 0;
  if (!top || (share < 0.3 && m.distinctLangs >= 6))
    return { id: "cartographer", why: `No kind of code above 30% across ${m.distinctLangs} languages: you map everything.` };
  const langsIn = [...new Set(m.langs.filter(([l]) => LANG_FAMILY[l] === top[0]).map(([l]) => l.replace("Vim script", "Vim Script")))].slice(0, 2).join(" and ");
  return { id: top[0], why: `Mostly ${FAMILIES[top[0]].label} code (${langsIn}, ${Math.round(share * 100)}% by weight).` };
}

// ---- Creed: tending things (Vigil) against trying things (Rift). ----
const CREED_CODES = [[900, "V+"], [600, "V"], [350, "VB"], [200, "BV"], [60, "B+"], [-59, "B="], [-199, "B-"], [-349, "BR"], [-599, "RB"], [-899, "R"], [-Infinity, "R-"]];
const CREED_LONG = {
  "V+": "Vigil, utterly steadfast", V: "Vigil", VB: "Vigil, drifting to the Tide", BV: "Tide, leaning to the Vigil",
  "B+": "Tide, a little Vigil", "B=": "Tide, balanced", "B-": "Tide, a little Rift", BR: "Tide, leaning to the Rift",
  RB: "Rift, drifting to the Tide", R: "Rift", "R-": "Rift, utterly unmoored",
};
function pickCreed(m, prof) {
  const vigil = 0.45 * m.longLived + 0.35 * m.licensed + 0.2 * m.described;
  const rift = 0.5 * m.shortLived + 0.3 * m.forkFrac + 0.2 * (1 - m.described);
  let pts = m.total ? Math.round(clamp(1600 * (vigil - rift), -1000, 1000)) : 0;
  if (prof === "oathsworn") pts = Math.max(pts, 600);
  if (prof === "verdant") pts = clamp(pts, -199, 199);
  if (prof === "riftbound") pts = Math.min(pts, 199);
  const code = CREED_CODES.find(([min]) => pts >= min)[1];
  const creed = code[0] === "V" ? "Vigil" : code[0] === "R" ? "Rift" : "Balance";
  return { points: pts, code, creed, long: CREED_LONG[code], vigil, rift };
}

// ---- Level: experience from everything you've done, on a log curve. ----
export function experience(m) {
  return Math.round(10 * m.originals + m.stars + 2 * m.forksReceived + m.followers / 2 + 25 * m.ageYears + 2 * m.forks);
}
export function levelFor(xp) {
  return clamp(1 + Math.floor(3 * log2(1 + xp / 25)), 1, 50);
}

// ---- Attributes: a GitHub number each, then race and profession modifiers. ----
export const ATTR_SOURCES = {
  St: ["stars on your repos", (m) => 6 + 3.2 * log10(1 + m.stars)],
  In: ["languages you write", (m) => 6 + 3.5 * log2(1 + m.distinctLangs)],
  Wi: ["your longest-tended repo", (m) => 7 + 1.1 * m.longestYears],
  Ag: ["repos pushed in the last 90 days", (m) => 6 + 3.5 * log2(1 + m.recent90)],
  En: ["account age", (m) => 6 + m.ageYears],
  Pr: ["followers", (m) => 5 + 3 * log10(1 + m.followers)],
  Gr: ["a filled-in profile and described repos", (m) => 6 + 1.6 * m.profileFields + 6 * m.described],
  Ae: ["forks of your repos (others drawing on your power)", (m) => 6 + 3.3 * log10(1 + m.forksReceived)],
  Se: ["people you follow and gists you keep", (m) => 6 + 3.2 * log10(1 + m.following + m.gists)],
};

// ---- Traits: titles earned from fun facts, named after the game's traits. ----
const yr = (s) => new Date(s).getUTCFullYear();
const plural = (n, w, p = w + "s") => `${n.toLocaleString("en-US")} ${n === 1 ? w : p}`;
// The first two are always looked for (oldest and longest-tended repo); then
// the rarer titles, in this order, until there are four.
const TRAIT_RULES = [
  ["Heir", (m, now) => m.oldest && (now - new Date(m.oldest.created)) / YEAR >= 3 && `heirloom ${m.oldest.name}, from ${yr(m.oldest.created)}`],
  ["Unbroken", (m) => m.longest && m.longestYears >= 2 && `tended ${m.longest.name} for ${plural(Math.floor(m.longestYears), "year")}`],
  ["Silver Tongue", (m) => m.followers >= 1000 && m.followers >= 20 * Math.max(1, m.following) && `${plural(m.followers, "follower")} heed your word`],
  ["Pack Rat", (m) => m.gists >= 25 && `hoards ${plural(m.gists, "gist")}`],
  ["Iron Gut", (m) => m.forks >= 15 && `digested ${plural(m.forks, "fork")}`],
  ["Name-keeper", (m) => m.originals >= 4 && m.topicsFrac >= 0.5 && `names ${Math.round(m.topicsFrac * 100)}% of its works`],
  ["Cartographer's Eye", (m) => m.homepages >= 5 && `${plural(m.homepages, "repo")} with a homepage`],
  ["Moonshadow", (m) => m.originals >= 3 && m.stars === 0 && `${m.originals} repos, not a star among them`],
  ["Bell-hearer", (m) => m.following >= 100 && `listens to ${plural(m.following, "other")}`],
  ["Quick", (m) => m.daysSincePush < 7 && `pushed ${m.daysSincePush < 1 ? "today" : plural(Math.floor(m.daysSincePush), "day") + " ago"}`],
  ["Bookish", (m) => m.distinctLangs >= 8 && `reads ${m.distinctLangs} languages`],
  ["Salt-blooded", (m) => m.originals >= 4 && m.licensed >= 0.7 && `licenses ${Math.round(m.licensed * 100)}% of its works`],
  ["Hardy", (m) => m.ageYears >= 10 && `${Math.floor(m.ageYears)} years on GitHub`],
  ["Long Stride", (m) => m.ageYears >= 1 && `walked GitHub since ${yr(m.created)}`],
];

const ORD = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const TENS_ORD = ["", "", "twentieth", "thirtieth", "fortieth", "fiftieth", "sixtieth", "seventieth", "eightieth", "ninetieth"];
export function ordinal(n) {
  if (n < 20) return ORD[n];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? `${TENS[t]}-${ORD[u]}` : TENS_ORD[t];
}

function enchant(stars) { return Math.min(9, Math.floor(log2(1 + stars) / 1.5)); }

export function toCharacter(user, repos, now = Date.now()) {
  const m = metrics(user, repos, now);
  const race = pickRace(m);
  const prof = pickProfession(m);
  const R = RACES[race.id], P = PROFESSIONS[prof.id];
  const creed = pickCreed(m, prof.id);
  const xp = experience(m);
  const level = levelFor(xp);

  const attrs = ATTRS.map(([ab, name], i) => {
    const base = Math.round(clamp(ATTR_SOURCES[ab][1](m), 3, 21));
    const v = clamp(base + R.mods[i] + P.mods[i], 3, 25);
    return { ab, name, base, value: v, mod: R.mods[i] + P.mods[i] };
  });
  const A = Object.fromEntries(attrs.map((a) => [a.ab, a.value]));
  const hp = Math.max(1, Math.round(level * (P.hp_die / 2 + 1 + (A.En - 10) / 3)) + 2 * (R.hp_mod || 0) + 4);
  const pp = Math.max(0, Math.round(level * (P.pp_die / 2 + (A.Ae - 10) / 3)) + 2 * (R.pp_mod || 0));
  const gold = (m.stars * 10 + m.forksReceived * 25) * (prof.id === "factor" ? 2 : 1);

  const items = m.sortedByStars.slice(0, 6).map((r, i) => {
    const fam = LANG_FAMILY[r.language];
    const status = r.archived ? "cursed" : r.license && r.desc ? "blessed" : "uncursed";
    return {
      slot: SLOTS[i], name: r.name, plus: enchant(r.stars), lang: r.language, kind: fam ? ITEM_KIND[fam] : r.language ? "relic" : "pebble",
      stars: r.stars, forks: r.forks, status,
    };
  });

  const traits = [];
  for (const [name, f] of TRAIT_RULES) {
    const why = f(m, now);
    if (why) traits.push({ name, why });
    if (traits.length === 4) break;
  }

  const created = new Date(user.created_at);
  const display = user.name && /^[\x20-\x7E -ɏ]+$/.test(user.name.trim()) ? user.name.trim() : user.login;
  const first = display.split(/\s+/)[0];
  const expedition = Math.max(7, created.getUTCFullYear() - 2000);
  const face = FACES[creed.creed];
  return {
    login: user.login, display, first, avatar: user.avatar_url, isOrg: user.type === "Organization",
    race: { id: race.id, name: R.name, why: race.why, description: R.description },
    profession: { id: prof.id, name: P.name, why: prof.why, description: P.description, vow: P.vow },
    creed, deity: face.deity, deityTitle: face.title, saying: face.saying,
    level, xp, hp, pp, gold, attrs, items, traits,
    marks: Math.min(19, m.archived),
    turning: TURNINGS[created.getUTCMonth()], born: created.getUTCFullYear(),
    expedition, expeditionWord: ordinal(expedition),
    epitaph: `${first}, a ${R.name} ${P.name} of the ${ordinal(expedition)} expedition, who came ${P.vow}.`,
    metrics: m,
  };
}

export function playUrl(c) {
  return `https://pravin.github.io/hollowmoon/?race=${encodeURIComponent(c.race.id)}&profession=${encodeURIComponent(c.profession.id)}&utm_source=charsheet`;
}
