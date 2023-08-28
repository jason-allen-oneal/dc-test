import { Item } from "./Item"; // Assuming you have an Item class defined
import { itList } from "./itList"; // Assuming you have an itList class defined
import { ArmsTable } from "./ArmsTable"; // Assuming you have an ArmsTable class defined
import { GearTypes } from "./GearTypes"; // Assuming you have a GearTypes module defined
import { Tools } from "./Tools"; // Assuming you have a Tools class defined
import { Enumeration } from "./Enumeration"; // Assuming you have an Enumeration class defined
import { Vector } from "./Vector"; // Assuming you have a Vector class defined

class GearTable implements GearTypes {
  static table: Map<string, GearRecord> = new Map();
  static unknown: GearRecord | null = null;

  constructor() {
    this.buildTable();
  }

  static find(it: Item | null): boolean {
    if (!it) {
      return false;
    }
    return this.findByName(it.getName());
  }

  static findByName(key: string): boolean {
    if (!key) {
      return false;
    }
    if (this.table.has(key) || ArmsTable.find(key)) {
      return true;
    }
    console.error(`GearTable could not find item=[${key}]`);
    return false;
  }

  private add(name: string, type: number, cost: number, effect: number = 0): void {
    this.addRecord(new GearRecord(this, name, type, cost, effect));
  }

  private addRecord(rec: GearRecord): void {
    if (this.table.has(rec.getName())) {
      console.error(`GearTable duplicate key=[${rec.getName()}]`);
    } else {
      this.table.set(rec.getName(), rec);
    }
  }

  static getRecord(key: string): GearRecord | GearRecord {
    const rec = this.table.get(key);
    return rec === undefined ? this.unknown! : rec;
  }

  static findList(name: string, type: number): itList {
    const keys = Array.from(this.table.keys());
    const list = new itList(name);
    for (const key of keys) {
      const rec = this.getRecord(key);
      if (rec.getType() === type) {
        list.fix(rec.getName(), rec.getCost());
      }
    }
    return list;
  }

  static findVector(type: number): Vector {
    const keys = Array.from(this.table.keys());
    const list = new Vector();
    for (const key of keys) {
      const rec = this.getRecord(key);
      if (rec.getType() === type) {
        list.addElement(rec.getName());
      }
    }
    return list;
  }

  static shopItem(what: Item): Item {
    return this.shopItemByName(what.getName());
  }

  static shopItemByName(key: string): Item {
    const rec = this.getRecord(key);
    return rec === this.unknown ? ArmsTable.shopItem(key) : new itCount(key, rec.getCost());
  }

  static getType(what: Item): number {
    return this.getRecord(what.getName()).getType();
  }

  static getCost(what: Item): number {
    return this.getRecord(what.getName()).getCost();
  }

  static getEffect(what: Item): number {
    return this.getRecord(what.getName()).getEffect();
  }

  static isScroll(what: Item): boolean {
    return this.getType(what) === 7;
  }

  static canHeroUse(what: Item): boolean {
    return this.getEffect(what) !== 0;
  }

  static canMageUse(what: Item): boolean {
    return this.canMageUseByName(what.getName());
  }

  static effectLabel(what: Item): string {
    return GearTypes.effectLabel[this.getEffect(what)];
  }

  static getTypeByName(key: string): number {
    return this.getRecord(key).getType();
  }

  static getCostByName(key: string): number {
    return this.getRecord(key).getCost();
  }

  static getEffectByName(key: string): number {
    return this.getRecord(key).getEffect();
  }

  static canMageUseByName(key: string): boolean {
    const skill = Tools.getHero().magicRank();
    return this.getTypeByName(key) === 5 && (skill * skill) * 25 >= this.getCostByName(key);
  }

  private buildTable(): void {
  if (this.table.size === 0) {
    this.unknown = new GearRecord(this, "Unknown", 0, 0, 0);
    this.add("Marks", 9, 1);
    this.add("Map to Warrens", 1, 500);
    this.add("Map to Treasury", 1, 2000);
    this.add("Map to Throne Room", 1, 5000);
    this.add("Map to Vortex", 1, 10000);
    this.add("Rutter for Hie Brasil", 1, 6000);
    this.add("Rutter for Shangala", 1, 12000);
    this.add("Time Crystal", 1, 18000);
    this.add("Castle Permit", 1, 5000);
    this.add("Sleeping Bag", 2, 25);
    this.add("Cooking Gear", 2, 75);
    this.add("Camp Tent", 2, 150);
    this.add(GearTypes.FOOD, 3, 2, 21);
    this.add(GearTypes.FISH, 3, 2, 21);
    this.add("Torch", 3, 5);
    this.add("Rope", 3, 8);
    this.add("Pen & Paper", 3, 12, 14);
    this.add("Teeth", 4, 2);
    this.add("Tusk", 4, 200);
    this.add("Gold Nugget", 4, Tools.DEFAULT_WIDTH);
    this.add("Horn", 4, 600);
    this.add("Crystal Crown", 4, 2500);
    this.add("Platinum Ring", 4, 8000);
    this.add("Dragon Scales", 4, 5000);
    this.add("Quartz", 5, 100, 1);
    this.add("Opal", 5, 250, 2);
    this.add("Garnet", 5, 650, 3);
    this.add("Emerald", 5, 1250, 5);
    this.add("Ruby", 5, 2400, 4);
    this.add("Turquoise", 5, 3500, 6);
    this.add("Diamond", 5, 5000, 10);
    this.add(GearTypes.SALVE, 6, 150, 2);
    this.add(GearTypes.SELTZER, 6, 200, 3);
    this.add("Gold Apple", 6, 500, 7);
    this.add(GearTypes.GINSENG, 6, 1000, 8);
    this.add(GearTypes.MANDRAKE, 6, 2000, 9);
    this.add("Cookie", 6, 1, 10);
    this.add(GearTypes.BLIND_DUST, 6, Tools.DEFAULT_WIDTH, 4);
    this.add(GearTypes.PANIC_DUST, 6, 800, 5);
    this.add(GearTypes.BLAST_DUST, 6, 2000, 6);
    this.add("Youth Elixir", 6, 8000, 11);
    this.add("Aging Elixir", 6, 1000, 12);
    this.add("Faceless Potion", 6, 1500, 13);
    this.add("Identify Scroll", 7, 60, 1);
    this.add("Glow Scroll", 7, Tools.DEFAULT_HEIGHT, 15);
    this.add("Bless Scroll", 7, 1000, 16);
    this.add("Luck Scroll", 7, 1500, 17);
    this.add("Flame Scroll", 7, 3500, 18);
    this.add("Enchant Scroll", 7, 2500, 19);
    this.add("Bottled Faery", 8, 800);
    this.add(GearTypes.INSURANCE, 8, 1000);
    this.add(GearTypes.TOKEN, 8, 0);
    this.add("Postcard", 8, 0);
    this.add("Letter", 8, 0);
    this.add("Petition", 8, 0);
    this.add("Grant", 8, 0, 20);
    this.add("Denial", 8, 0);
    this.add("Gobble Inn Postcard", 0, 50, 14);
    this.add("Gobble Inn T-Shirt", 0, 100);
    this.add("Troll Wart", 0, 0);
    this.add("Turnip", 0, 0);
    this.add("Rock", 0, 0);
  }
}

}

class GearRecord {
  name: string;
  type: number;
  cost: number;
  effect: number;

  constructor(private gearTable: GearTable, name: string, type: number, cost: number, effect: number) {
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.effect = effect;
  }

  getName(): string {
    return this.name;
  }

  getType(): number {
    return this.type;
  }

  getCost(): number {
    return this.cost;
  }

  getEffect(): number {
    return this.effect;
  }
}
