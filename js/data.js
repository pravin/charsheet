// Races and professions of Hollowmoon, copied from the game's data files
// (src/data/races.ron, src/data/professions.ron). Ids are the game's own ids,
// as used by https://pravin.github.io/hollowmoon/?race=<id>&profession=<id>.
// attr mods order: St In Wi Ag En Pr Gr Ae Se
export const RACES = {
 "reachfolk": {
  "id": "reachfolk",
  "name": "Reachfolk",
  "creed": "Balance",
  "mods": [
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0
  ],
  "hp_mod": 0,
  "pp_mod": 0,
  "description": "Hardy northern settlers who came to the Vaultspine for silver and stayed for stubbornness. They learn quickly and excel at nothing in particular."
 },
 "vael": {
  "id": "vael",
  "name": "Vael",
  "creed": "Vigil",
  "mods": [
   -2,
   3,
   1,
   1,
   -2,
   1,
   3,
   3,
   1
  ],
  "hp_mod": -2,
  "pp_mod": 3,
  "description": "Tall, ageless folk with lantern-pale eyes, said to have been touched by the moon before it broke. Frail, brilliant, and slow to change."
 },
 "sunken_vael": {
  "id": "sunken_vael",
  "name": "Sunken Vael",
  "creed": "Rift",
  "mods": [
   -1,
   2,
   1,
   3,
   -1,
   -1,
   0,
   2,
   3
  ],
  "hp_mod": -1,
  "pp_mod": 2,
  "description": "Vael who fled beneath the mountains at the Sundering and were changed by the dark. They see without light and are resistant to poison."
 },
 "hearthkin": {
  "id": "hearthkin",
  "name": "Hearthkin",
  "creed": "Vigil",
  "mods": [
   2,
   -1,
   1,
   -1,
   3,
   0,
   -1,
   -1,
   0
  ],
  "hp_mod": 2,
  "pp_mod": -1,
  "description": "Stout tunnel-folk of the Vaultspine mines. Smiths, delvers, keepers of ledgers; they find secret doors by habit."
 },
 "pickwit": {
  "id": "pickwit",
  "name": "Pickwit",
  "creed": "Vigil",
  "mods": [
   -3,
   0,
   0,
   3,
   0,
   2,
   1,
   -1,
   1
  ],
  "hp_mod": -1,
  "pp_mod": 0,
  "description": "Small, quick fen-folk with a talent for not being noticed and a genius for slings and stews."
 },
 "grothir": {
  "id": "grothir",
  "name": "Grothir",
  "creed": "Rift",
  "mods": [
   6,
   -4,
   -2,
   -2,
   5,
   -3,
   -3,
   -3,
   -1
  ],
  "hp_mod": 6,
  "pp_mod": -3,
  "description": "Stone-hided giants, slow to think and slower to die. They regenerate, they smash, and they do not read."
 },
 "karrok": {
  "id": "karrok",
  "name": "Karrok",
  "creed": "Rift",
  "mods": [
   3,
   -2,
   0,
   0,
   2,
   -2,
   -3,
   -1,
   1
  ],
  "hp_mod": 2,
  "pp_mod": -1,
  "description": "War-bred, tusked and clan-bound. The steadings of the Karrok have fought the Unnamed longest and trust no one who hasn't."
 },
 "skrit": {
  "id": "skrit",
  "name": "Skrit",
  "creed": "Balance",
  "mods": [
   -2,
   0,
   -1,
   3,
   -1,
   -1,
   -2,
   0,
   3
  ],
  "hp_mod": -2,
  "pp_mod": 0,
  "description": "Rat-kin scavengers of the lower towns. Fast, frail, tolerant of poison, and able to eat nearly anything."
 },
 "ashborn": {
  "id": "ashborn",
  "name": "Ashborn",
  "creed": "Balance",
  "mods": [
   1,
   0,
   1,
   0,
   1,
   -1,
   1,
   2,
   0
  ],
  "hp_mod": 0,
  "pp_mod": 1,
  "description": "Born with moon-glass in their veins. They can cast shards of themselves at enemies, resist the Hollowing, and shatter more easily than most."
 },
 "hollowed": {
  "id": "hollowed",
  "name": "Hollowed",
  "creed": "Balance",
  "mods": [
   0,
   1,
   3,
   0,
   -2,
   -2,
   -3,
   2,
   1
  ],
  "hp_mod": -3,
  "pp_mod": 2,
  "description": "Mortals partway erased by the Hollowing and somehow stabilized. They barely hunger, cast no reflection, and the Faces struggle to see them."
 },
 "fenwalker": {
  "id": "fenwalker",
  "name": "Fenwalker",
  "creed": "Balance",
  "mods": [
   0,
   0,
   1,
   1,
   1,
   0,
   -1,
   0,
   2
  ],
  "hp_mod": 0,
  "pp_mod": 0,
  "description": "Amphibious marsh people who breathe water as easily as air and know every herb of the fens. Fire terrifies them."
 },
 "skarn": {
  "id": "skarn",
  "name": "Skarn",
  "creed": "Balance",
  "mods": [
   1,
   -1,
   0,
   2,
   1,
   -1,
   -1,
   -2,
   4
  ],
  "hp_mod": 1,
  "pp_mod": -1,
  "description": "Wolf-kin of the high passes. Keen-nosed, quick, hungry, with natural weapons and no use for boots."
 },
 "gnarl": {
  "id": "gnarl",
  "name": "Gnarl",
  "creed": "Balance",
  "mods": [
   -2,
   3,
   0,
   2,
   -2,
   0,
   0,
   0,
   1
  ],
  "hp_mod": -2,
  "pp_mod": 0,
  "description": "Small root-folk who live inside the mountain's oldest trees and trade in cut gems and clever tools. Nothing breaks in their hands, and no lock stays shut for long."
 },
 "bellborn": {
  "id": "bellborn",
  "name": "Bellborn",
  "creed": "Vigil",
  "mods": [
   0,
   2,
   3,
   0,
   0,
   1,
   0,
   1,
   -2
  ],
  "hp_mod": 0,
  "pp_mod": 1,
  "description": "Foundlings raised in the Compact's bell-towers, half-deafened by the great bells and taught names before words. Nothing that rings or frightens can move them, and a bell in their hands is a weapon."
 },
 "windborne": {
  "id": "windborne",
  "name": "Windborne",
  "creed": "Balance",
  "mods": [
   0,
   -2,
   0,
   3,
   2,
   0,
   0,
   -1,
   1
  ],
  "hp_mod": 1,
  "pp_mod": -1,
  "description": "Riders of the eastern grass beyond the Karrok hills, who count time in horizons. Fast and sure under the open sky; uneasy in the dark under stone."
 },
 "ebbfolk": {
  "id": "ebbfolk",
  "name": "Ebbfolk",
  "creed": "Balance",
  "mods": [
   0,
   0,
   1,
   0,
   0,
   0,
   1,
   1,
   1
  ],
  "hp_mod": 0,
  "pp_mod": 0,
  "description": "Coast-dwellers born under the broken moon's tides; their blood rises and falls with it. Everything they are is stronger at the full moon and weaker at the new."
 },
 "stoneblood": {
  "id": "stoneblood",
  "name": "Stoneblood",
  "creed": "Vigil",
  "mods": [
   4,
   -1,
   0,
   -2,
   3,
   -1,
   -2,
   -1,
   0
  ],
  "hp_mod": 3,
  "pp_mod": -1,
  "description": "Half-Grothir: the size and patience of the giants, the schooling of the Reach. They heal slowly, eat a great deal, and stop things."
 },
 "echofolk": {
  "id": "echofolk",
  "name": "Echofolk",
  "creed": "Rift",
  "mods": [
   0,
   0,
   2,
   1,
   0,
   -1,
   -2,
   0,
   3
  ],
  "hp_mod": 0,
  "pp_mod": 0,
  "description": "Cave-born people who lost their eyes to the dark generations ago and hear the shape of the world instead. Light and darkness mean nothing to them: they know everything within five paces, through stone, and nothing beyond it."
 }
};
export const PROFESSIONS = {
 "warden": {
  "id": "warden",
  "name": "Shieldbearer",
  "vow": "to hold the stair",
  "mods": [
   2,
   -1,
   0,
   1,
   2,
   0,
   0,
   -2,
   0
  ],
  "hp_die": 10,
  "pp_die": 2,
  "description": "Armored fighters of the bell-wardens' line. Shieldbearers hold doors, break shield walls, and train faster with every weapon they lift."
 },
 "oathsworn": {
  "id": "oathsworn",
  "name": "Oathsworn",
  "vow": "to keep an oath",
  "mods": [
   1,
   0,
   2,
   0,
   1,
   2,
   1,
   0,
   0
  ],
  "hp_die": 9,
  "pp_die": 3,
  "description": "Knights sworn to the Vigil. Their word binds monsters and their prayers are heard first."
 },
 "pathfinder": {
  "id": "pathfinder",
  "name": "Pathfinder",
  "vow": "to find the way down",
  "mods": [
   0,
   0,
   0,
   2,
   1,
   0,
   0,
   0,
   2
  ],
  "hp_die": 8,
  "pp_die": 3,
  "description": "Rangers of the high roads. Two blades, a bow, and the certainty of never being lost."
 },
 "nightcutter": {
  "id": "nightcutter",
  "name": "Nightcutter",
  "vow": "to bring back what the dead carried",
  "mods": [
   -1,
   0,
   0,
   3,
   0,
   0,
   0,
   0,
   1
  ],
  "hp_die": 7,
  "pp_die": 3,
  "description": "Thieves and knife-workers of the Sunken Bazaar. Locks, pockets, poisons, and the backs of the unwary."
 },
 "arcanist": {
  "id": "arcanist",
  "name": "Arcanist",
  "vow": "to learn the moon's true name",
  "mods": [
   -2,
   3,
   1,
   0,
   -1,
   0,
   0,
   3,
   0
  ],
  "hp_die": 5,
  "pp_die": 8,
  "description": "Scholars of the spell-schools. Weak of arm, dangerous at range, and forever running out of power."
 },
 "hierophant": {
  "id": "hierophant",
  "name": "Hierophant",
  "vow": "to carry the Faces into the dark",
  "mods": [
   0,
   1,
   2,
   0,
   0,
   1,
   0,
   2,
   0
  ],
  "hp_die": 7,
  "pp_die": 6,
  "description": "Priests of the three Faces. They turn the Unnamed, mend the broken and know where every altar lies."
 },
 "skald": {
  "id": "skald",
  "name": "Skald",
  "vow": "to make the song of the Vaults",
  "mods": [
   0,
   1,
   0,
   1,
   0,
   3,
   1,
   0,
   0
  ],
  "hp_die": 7,
  "pp_die": 4,
  "description": "Singers of the old names. Their songs steady friends and unsettle foes, and their companions stay loyal."
 },
 "ascetic": {
  "id": "ascetic",
  "name": "Ascetic",
  "vow": "to meet the Hollowing unafraid",
  "mods": [
   1,
   0,
   2,
   2,
   1,
   0,
   0,
   0,
   0
  ],
  "hp_die": 8,
  "pp_die": 4,
  "description": "Bare-handed wanderers who grow faster with every year. Armor slows them; nothing else does."
 },
 "chirurgeon": {
  "id": "chirurgeon",
  "name": "Chirurgeon",
  "vow": "to mend the half-forgotten",
  "mods": [
   0,
   2,
   1,
   1,
   0,
   1,
   0,
   0,
   0
  ],
  "hp_die": 7,
  "pp_die": 5,
  "description": "Healers of the Harrowgate hospice. They diagnose with a glance and brew remembrance from salt and patience."
 },
 "shardwright": {
  "id": "shardwright",
  "name": "Shardwright",
  "vow": "to forge with moon-glass",
  "mods": [
   2,
   0,
   0,
   1,
   1,
   0,
   0,
   0,
   0
  ],
  "hp_die": 9,
  "pp_die": 3,
  "description": "Smiths who temper steel with moon-glass at the forges of Harrowgate. Give them iron and a fire and wait."
 },
 "marksman": {
  "id": "marksman",
  "name": "Marksman",
  "vow": "to collect the Compact's bounty",
  "mods": [
   0,
   0,
   0,
   3,
   0,
   0,
   0,
   0,
   2
  ],
  "hp_die": 7,
  "pp_die": 3,
  "description": "Archers of the bell-towers. More shots, longer range, and arrows made from whatever is at hand."
 },
 "factor": {
  "id": "factor",
  "name": "Factor",
  "vow": "to turn a profit on the end of the world",
  "mods": [
   0,
   1,
   0,
   0,
   0,
   3,
   1,
   0,
   0
  ],
  "hp_die": 6,
  "pp_die": 3,
  "description": "Merchant-adventurers of the guild. They start rich, buy cheap, sell dear and are welcome in every shop."
 },
 "yeoman": {
  "id": "yeoman",
  "name": "Yeoman",
  "vow": "to win back the fields",
  "mods": [
   2,
   0,
   1,
   0,
   2,
   0,
   0,
   -1,
   0
  ],
  "hp_die": 8,
  "pp_die": 2,
  "description": "Farmers of Greyhallow with a scythe and a grievance. The underdog's road, and the sturdiest."
 },
 "mindweaver": {
  "id": "mindweaver",
  "name": "Mindweaver",
  "vow": "to answer the voice under the mountain",
  "mods": [
   -1,
   2,
   3,
   0,
   0,
   0,
   0,
   1,
   1
  ],
  "hp_die": 6,
  "pp_die": 7,
  "description": "The rare few who weave thought into force. No books, no gods to thank: only the mind, and the cost it exacts."
 },
 "reaver": {
  "id": "reaver",
  "name": "Reaver",
  "vow": "to kill what cannot be killed",
  "mods": [
   3,
   -2,
   0,
   1,
   3,
   -1,
   0,
   -2,
   0
  ],
  "hp_die": 12,
  "pp_die": 1,
  "description": "Raiders of the outer steadings. They do not read; they rage, and they are very hard to kill."
 },
 "verdant": {
  "id": "verdant",
  "name": "Verdant",
  "vow": "to remind the trees how to grow",
  "mods": [
   0,
   1,
   2,
   0,
   1,
   0,
   1,
   1,
   0
  ],
  "hp_die": 7,
  "pp_die": 6,
  "description": "Keepers of Kindlewood. Animals follow them, plants obey them, and the Tide keeps them always in balance."
 },
 "bonesinger": {
  "id": "bonesinger",
  "name": "Bonesinger",
  "vow": "to sing the nameless dead to rest",
  "mods": [
   -1,
   2,
   2,
   0,
   -1,
   -2,
   -1,
   3,
   0
  ],
  "hp_die": 5,
  "pp_die": 7,
  "description": "Singers to the dead, who rise and serve. Greyhallow hates them; the Rift finds them useful."
 },
 "tidecaller": {
  "id": "tidecaller",
  "name": "Tidecaller",
  "vow": "to follow the tide to its source",
  "mods": [
   -1,
   2,
   2,
   0,
   0,
   0,
   0,
   3,
   0
  ],
  "hp_die": 6,
  "pp_die": 7,
  "description": "Callers of storm, tide and ember who need no books. The elements answer; whether they obey is another matter."
 },
 "riftbound": {
  "id": "riftbound",
  "name": "Riftbound",
  "vow": "to give the Rift what it asked for",
  "mods": [
   2,
   0,
   -1,
   0,
   2,
   -2,
   -2,
   1,
   0
  ],
  "hp_die": 10,
  "pp_die": 3,
  "description": "Knights who took the Rift's bargain. They begin already marked, and every mark is a weapon."
 },
 "lanternkeeper": {
  "id": "lanternkeeper",
  "name": "Lanternkeeper",
  "vow": "to bring the seventh expedition home",
  "mods": [
   0,
   2,
   1,
   0,
   0,
   1,
   0,
   1,
   1
  ],
  "hp_die": 7,
  "pp_die": 5,
  "description": "Scholar-knights of the Lantern Compact. They learn true names and speak them; the Unnamed cannot abide it."
 },
 "cartographer": {
  "id": "cartographer",
  "name": "Cartographer",
  "vow": "to map the Vaults to the bottom",
  "mods": [
   0,
   1,
   0,
   1,
   0,
   0,
   0,
   0,
   3
  ],
  "hp_die": 7,
  "pp_die": 3,
  "description": "Explorers who map as they breathe. They always know where the stairs are, and they smell a trap before it springs."
 }
};
