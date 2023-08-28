import { Screen } from './Screen';
import { arNotice } from './arNotice';
import { Tools } from './Tools';

export abstract class WildsScreen extends Screen {
  static readonly TOO_TIRED = "\tYou find yourself far too exhausted to continue adventuring. Please return tomorrow for further exploration.\n";
  static readonly NEED_ROPE = "\tYou cannot advance any further up these cliffs and crags without an additional supply of ROPE.\n";
  static readonly NEED_LIGHT = "\tYou can advance no further through these dark and dingy caverns without TORCHES or some other source of light.\n";

  public abstract pickQuest(i: number): Screen;
  public abstract getPower(i: number): number;
  public abstract getWhere(i: number): string;

  constructor();
  constructor(from: Screen);
  constructor(name: string);
  constructor(from: Screen, name: string);
  constructor(from?: Screen | string, name?: string) {
    super(from, name || "WildsScreen");
  }

  needsLight(loc: number): boolean {
    return false;
  }

  needsRope(loc: number): boolean {
    return false;
  }

  getHideBits(): number {
    return 0;
  }

  markFound(find: number): string {
    return "";
  }

  goQuesting(): void;
  goQuesting(loc: number): void;
  goQuesting(loc?: number): void {
    if (this.testAdvance(loc) && !this.doSearch(loc)) {
      Tools.setRegion(this.pickQuest(loc));
    }
  }

  testAdvance(loc: number): boolean {
    const test = this.canAdvance(loc);
    if (test === null) {
      return true;
    }
    Tools.setRegion(new arNotice(this, test));
    return false;
  }

  canAdvance(loc: number): string | null {
    if (Tools.getHero().getQuests() < 1) {
      return WildsScreen.TOO_TIRED;
    }
    if (this.needsRope(loc) && !this.findClimb()) {
      return WildsScreen.NEED_ROPE;
    }
    if (!this.needsLight(loc) || this.findLight()) {
      return null;
    }
    return WildsScreen.NEED_LIGHT;
  }

  doSearch(loc: number): boolean {
    let count = 0;
    const bits = this.getHideBits();
    if (bits === 0 || !Tools.contest(Screen.getWits(), this.getPower(loc) * 20)) {
      return false;
    }
    for (let ix = bits; ix !== 0; ix >>= 1) {
      if ((ix & 1) !== 0) {
        count++;
      }
    }
    const num = Tools.roll(count);
    let ix2 = 1;
    let pick = -1;
    while (num >= 0) {
      if ((bits & ix2) !== 0) {
        num--;
      }
      pick++;
      ix2 <<= 1;
    }
    Screen.getHero().searchWork(1);
    Tools.setRegion(new arNotice(
      this,
      `${this.markFound(pick)}${Screen.getHero().gainWits(this.getPower(loc) + 2)}`
    ));
    return true;
  }

  selectQuest(names: string[], weight: number[]): itMonster;
  selectQuest(loc: number, names: string[][], weight: number[][]): itMonster;
  selectQuest(loc: number | string[], names: string[][], weight: number[][]): itMonster {
    if (Array.isArray(loc)) {
      return this.selectQuest(0, loc, names);
    }
    return this.selectQuest(loc, names[loc], weight[loc]);
  }

  private selectQuest(loc: number, names: string[], weight: number[]): itMonster {
    let total = 0;
    if (Tools.percent(1)) {
      return Screen.findBeast("Faery");
    }
    for (const i of weight) {
      total += i;
    }
    let total2 = Tools.roll(total);
    for (let ix = 0; ix < weight.length; ix++) {
      total2 -= weight[ix];
      if (total2 < 0) {
        return Screen.findBeast(`${this.getWhere(loc)}:${names[ix]}`);
      }
    }
    return Screen.findBeast(`${this.getWhere(loc)}:${names[0]}`);
  }

  findClimb(): boolean {
    return Screen.hasTrait(Constants.HILLFOLK) || Screen.subPack("Rope", 1) === 1;
  }

  protected findLight(): boolean {
    return Screen.hasTrait(Constants.CATSEYES)
      || Screen.findGearTrait(ArmsTrait.GLOWS) !== null
      || Screen.findGearTrait(ArmsTrait.FLAME) !== null
      || Screen.subPack("Torch", 1) > 0;
  }
}
