interface GearTypes {
  TYPE_JUNK: number;
  TYPE_MAP: number;
  TYPE_CAMP: number;
  TYPE_SUPPLY: number;
  TYPE_LOOT: number;
  TYPE_GEMS: number;
  TYPE_POTION: number;
  TYPE_SCROLL: number;
  TYPE_SPECIAL: number;
  TYPE_MONEY: number;
  typeLabel: string[];
  EFF_NONE: number;
  EFF_IDENTIFY: number;
  EFF_HEAL: number;
  EFF_CURE: number;
  EFF_BLIND: number;
  EFF_PANIC: number;
  EFF_BLAST: number;
  EFF_REVIVE: number;
  EFF_HASTE: number;
  EFF_REFRESH: number;
  EFF_COOKIE: number;
  EFF_YOUTH: number;
  EFF_AGING: number;
  EFF_FACELESS: number;
  EFF_SCRIBE: number;
  EFF_GLOW: number;
  EFF_BLESS: number;
  EFF_LUCK: number;
  EFF_FLAME: number;
  EFF_ENCHANT: number;
  EFF_GRANT: number;
  EFF_FOOD: number;
  effectLabel: string[];
  TROLL: string;
  APPLE: string;
  SALVE: string;
  SELTZER: string;
  BLIND_DUST: string;
  PANIC_DUST: string;
  BLAST_DUST: string;
  MANDRAKE: string;
  GINSENG: string;
  BLINDED: string;
  PANICKY: string;
  FOOD: string;
  FISH: string;
  TOKEN: string;
  INSURANCE: string;
}

const gearTypes: GearTypes = {
  TYPE_JUNK: 0,
  TYPE_MAP: 1,
  TYPE_CAMP: 2,
  TYPE_SUPPLY: 3,
  TYPE_LOOT: 4,
  TYPE_GEMS: 5,
  TYPE_POTION: 6,
  TYPE_SCROLL: 7,
  TYPE_SPECIAL: 8,
  TYPE_MONEY: 9,
  typeLabel: [
    "Junk",
    "Map",
    "Camp",
    "Supply",
    "Loot",
    "Gems",
    "Potion",
    "Scroll",
    "Special",
    "Money",
  ],
  EFF_NONE: 0,
  EFF_IDENTIFY: 1,
  EFF_HEAL: 2,
  EFF_CURE: 3,
  EFF_BLIND: 4,
  EFF_PANIC: 5,
  EFF_BLAST: 6,
  EFF_REVIVE: 7,
  EFF_HASTE: 8,
  EFF_REFRESH: 9,
  EFF_COOKIE: 10,
  EFF_YOUTH: 11,
  EFF_AGING: 12,
  EFF_FACELESS: 13,
  EFF_SCRIBE: 14,
  EFF_GLOW: 15,
  EFF_BLESS: 16,
  EFF_LUCK: 17,
  EFF_FLAME: 18,
  EFF_ENCHANT: 19,
  EFF_GRANT: 20,
  EFF_FOOD: 21,
  effectLabel: [
    "none",
    "identify",
    "heal",
    "cure",
    "blind",
    "panic",
    "blast",
    "apple",
    "haste",
    "refresh",
    "cookie",
    "youth",
    "aging",
    "faceless",
    "scribe",
    "glow",
    "bless",
    "luck",
    "flame",
    "enchant",
    "grant",
    "food",
  ],
  TROLL: "Troll Warts",
  APPLE: "Golden Apple",
  SALVE: "Healing Salve",
  SELTZER: "Seltzer Water",
  BLIND_DUST: "Blinding Dust",
  PANIC_DUST: "Panic Dust",
  BLAST_DUST: "Blast Powder",
  MANDRAKE: "Mandrake Root",
  GINSENG: "Ginseng Root",
  BLINDED: "Blind",
  PANICKY: "Panic",
  FOOD: "Food",
  FISH: "Fish",
  TOKEN: "Bushido Token",
  INSURANCE: "Thief Insurance",
};

export default gearTypes;
