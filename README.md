# charsheet

**What would your GitHub be in a roguelike?** Type a username at
<https://pravin.github.io/charsheet/> and get a character sheet from
[Hollowmoon](https://pravin.github.io/hollowmoon/): race, profession, level,
nine attributes, creed, your repos as enchanted gear and a few hard-won titles.
Download it as a PNG, share it, then play as that character in the game.

Plain static HTML, CSS and JavaScript. No build step, no backend, no tracking.

## How a profile becomes a character

The same profile always gives the same character. The page's
"How is this calculated?" section lists every rule; in short:

| Sheet | Comes from |
|---|---|
| **Profession** | Your dominant kind of code, weighting each original repo by 1 + log2(1 + stars): C/C++/Zig → Shardwright, Rust → Oathsworn, Go → Shieldbearer, Java/C# → Hierophant, shell/infra → Pathfinder, TypeScript → Lanternkeeper, JavaScript → Tidecaller, HTML/CSS → Skald, Python → Arcanist, notebooks/R/Julia → Mindweaver, Haskell/Lisp/Vim script → Ascetic, Elixir/Erlang → Chirurgeon, PHP/Ruby → Factor, Swift/Kotlin/Dart → Marksman, Perl/Fortran/Pascal → Bonesinger, Lua/GDScript/shaders → Verdant, TeX/Markdown → Cartographer. Habits come first: under two original repos → Yeoman; 60%+ forks → Nightcutter; most repos finished within a week → Riftbound; mostly undescribed → Reaver; no kind above 30% across 6+ languages → Cartographer. |
| **Race** | The first account trait that fits: huge stars on few repos → Grothir, 150+ repos → Gnarl, 10k+ followers → Vael, 2k+ stars → Stoneblood, one bright repo → Ashborn, old but quiet → Sunken Vael, idle two years → Hollowed, more forks than originals → Skrit, blank profile → Echofolk, topics everywhere → Bellborn, follows many → Skarn, 10+ languages → Windborne, two equal languages → Fenwalker, bursty years → Ebbfolk, 12+ years → Hearthkin, young and busy → Karrok, many repos few followers → Pickwit, else Reachfolk. |
| **Level** (1–50) | Experience = 10/original repo + 1/star + 2/fork received + ½/follower + 25/year + 2/fork made; level = 1 + 3 × log2(1 + exp/25). |
| **Attributes** | St stars · In languages · Wi longest-tended repo · Ag repos pushed in 90 days · En account age · Pr followers · Gr profile and descriptions · Ae forks received · Se following and gists; then the game's race and profession modifiers. |
| **Creed** | Vigil (long-lived, licensed, described repos) against Rift (week-long repos, forks, no descriptions) → V+ … B= … R-, and your deity. |
| **Equipment** | Your six most-starred original repos, +1 per tripling of stars; blessed if licensed and described, cursed if archived. |
| **Traits** | Fun facts named after the game's traits: Heir (oldest repo), Unbroken (longest-tended), Silver Tongue, Pack Rat, Bookish… |
| **Epitaph** | "*Name, a Race Profession of the Nth expedition, who came …*", N being your sign-up year (2008 → the eighth). |

Race and profession ids are the game's own (copied into `js/data.js` from
Hollowmoon's data files), so "Play as this character" opens
`https://pravin.github.io/hollowmoon/?race=<id>&profession=<id>`.

## Privacy

Public data only. Your browser asks GitHub's public API for the profile and up
to 300 of its most recently pushed public repos. Nothing goes anywhere else, and
nothing is stored except a one-hour cache in that browser tab
(`sessionStorage`). The PNG is drawn in your browser.

GitHub allows 60 unauthenticated requests an hour per network; a sheet costs
2 to 4 of them.

## Files

- `index.html`, `style.css`: the page
- `js/mapping.js`: GitHub → character (pure functions)
- `js/card.js`: the 60-column sheet, drawn as HTML and onto a canvas for the PNG
- `js/app.js`: fetching, caching, errors, sharing
- `js/data.js`: Hollowmoon's races and professions; `js/sample.js`: the landing page's sample (@pravin)
- `fonts/`: IBM Plex Mono (SIL OFL, see `fonts/OFL.txt`), served locally so the PNG export always has it
- `tools/og.html`, `tools/make-og.sh`: renders `og.png` (1200×630) with headless Chrome

## Run locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000/?u=pravin
```

On `localhost` only, a token you put in `localStorage["charsheet-debug-token"]`
is sent to the API, to get past the rate limit while testing.

## License

MIT, © 2026 Pravin Paratey. IBM Plex Mono is under the SIL Open Font License.
