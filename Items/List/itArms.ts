import { Item } from './Item';
import { itCount } from './itCount';
import { itList } from './itList';
import { Buffer } from './Buffer';
import { Tools } from './Tools';
import { ArmsTrait } from './ArmsTrait';

/* loaded from: DCourt.jar:DCourt/Items/List/itArms.class */
export class itArms extends itList implements ArmsTrait {
  private aval: itCount;
  private dval: itCount;
  private sval: itCount;
  static readonly MEGATWEAK = 2048;
  static readonly DECAY_FACTOR = 12;

  constructor();
  constructor(id: string);
  constructor(id: string, atk: number, def: number, skl: number);
  constructor(_id?: string, atk: number = 0, def: number = 0, skl: number = 0) {
    super(_id);

    this.setVals(atk, def, skl);
  }

  copy(): Item {
    return new itArms(this);
  }

  getIcon(): string {
    return 'itArms';
  }

  toString(): string {
    return this.toString(0);
  }

  toString(depth: number): string {
    return `${super.toStringHead(depth)}|${this.getAttack()}|${this.getDefend()}|${this.getSkill()}${this.listBody(depth)}`;
  }

  private setVals(a: number, d: number, s: number): void {
    this.aval = new itCount('a', a);
    this.dval = new itCount('d', d);
    this.sval = new itCount('s', s);
  }

  setAttack(num: number): void {
    this.aval.setCount(num);
  }

  setDefend(num: number): void {
    this.dval.setCount(num);
  }

  setSkill(num: number): void {
    this.sval.setCount(num);
  }

  getAttack(): number {
    return this.aval.getCount();
  }

  getDefend(): number {
    return this.dval.getCount();
  }

  getSkill(): number {
    return this.sval.getCount();
  }

  addAttack(num: number): void {
    this.aval.adds(num);
  }

  addDefend(num: number): void {
    this.dval.adds(num);
  }

  addSkill(num: number): void {
    this.sval.adds(num);
  }

  subAttack(num: number): void {
    this.aval.adds(-num);
  }

  subDefend(num: number): void {
    this.dval.adds(-num);
  }

  subSkill(num: number): void {
    this.sval.adds(-num);
  }

  static factory(buf: Buffer): Item | null {
    if (!buf.begin() || !buf.match('itArms') || !buf.split()) {
      return null;
    }
    const what = new itArms(buf.token());
    if (buf.split()) {
      what.setAttack(buf.num());
    }
    if (buf.split()) {
      what.setDefend(buf.num());
    }
    if (buf.split()) {
      what.setSkill(buf.num());
    }
    what.loadBody(buf);
    return what;
  }

  toLoot(): string {
    return this.toShow();
  }

  toShow(): string {
    let msg = this.getName();
    if (this.hasTrait(ArmsTrait.SECRET)) {
      return `${msg}[?]`;
    }
    let msg2 = `${msg}[`;
    if (this.fullAttack() > 0) {
      msg2 += '+';
    }
    if (this.fullAttack() !== 0) {
      msg2 += `${this.fullAttack()}a`;
    }
    if (this.fullDefend() > 0) {
      msg2 += '+';
    }
    if (this.fullDefend() !== 0) {
      msg2 += `${this.fullDefend()}d`;
    }
    if (this.fullSkill() > 0) {
      msg2 += '+';
    }
    if (this.fullSkill() !== 0) {
      msg2 += `${this.fullSkill()}s`;
    }
    if (this.hasTrait(ArmsTrait.DECAY)) {
      msg2 += '@';
    }
    if (this.hasTrait(ArmsTrait.CURSE)) {
      msg2 += '*';
    }
    return `${msg2}]`;
  }

  fullAttack(): number {
    let num = this.getAttack();
    if (this.hasTrait(ArmsTrait.RIGHT) && this.hasTrait(ArmsTrait.FLAME)) {
      num += 8;
    }
    return num + ((this.getEnchant() + 9) / 10);
  }

  fullDefend(): number {
    let num = this.getDefend();
    if (this.hasTrait(ArmsTrait.BLESS)) {
      num++;
    }
    return num + ((this.getEnchant() + 4) / 10);
  }

  fullSkill(): number {
    let num = this.getSkill();
    if (this.hasTrait(ArmsTrait.RIGHT) && this.hasTrait(ArmsTrait.LUCKY)) {
      num += 12;
    }
    if (this.hasTrait(ArmsTrait.GLOWS)) {
      num += 2;
    }
    return num + this.getEnchant();
  }

  getPower(): number {
    let power = (this.getAttack() * 3) + (this.getDefend() * 2) + this.getSkill();
    if (power < 1) {
      return 1;
    }
    return power;
  }

  getEnchant(): number {
    return this.getCount(ArmsTrait.ENCHANT);
  }

  incEnchant(): void {
    this.add(ArmsTrait.ENCHANT, 1);
  }

  setEnchant(val: number): void {
    this.fix(ArmsTrait.ENCHANT, val);
  }

  isBright(): boolean {
    return this.hasTrait(ArmsTrait.GLOWS) || this.hasTrait(ArmsTrait.FLAME);
  }

    isCursed(): boolean {
    return this.hasTrait(ArmsTrait.CURSE) || this.hasTrait(ArmsTrait.CURSED);
  }

  revealCurse(): void {
    if (this.hasTrait(ArmsTrait.CURSED)) {
      this.clrTrait(ArmsTrait.CURSED);
      this.fixTrait(ArmsTrait.CURSE);
    }
  }

  wearable(): boolean {
    for (let ix = 0; ix < ArmsTrait.END_WEAR_TRAIT; ix++) {
      if (this.hasTrait(ix)) {
        return true;
      }
    }
    return false;
  }

  hasTrait(num: number): boolean {
    return this.hasTrait(ArmsTrait.traitLabel[num]);
  }

  fixTrait(num: number): void {
    this.fixTrait(ArmsTrait.traitLabel[num]);
  }

  clrTrait(num: number): void {
    this.clrTrait(ArmsTrait.traitLabel[num]);
  }

  decay(rate: number): boolean {
    this.clrTrait(ArmsTrait.DECAY);
    if (rate < 2) {
      rate = 2;
    }
    if (Tools.roll(rate) > 0) {
      return false;
    }
    this.fixTrait(ArmsTrait.DECAY);
    let num = this.getAttack();
    this.subAttack(num <= 1 ? 1 - (num / 12) : 1 + (num / 12));
    let num2 = this.getDefend();
    this.subDefend(num2 <= 1 ? 1 - (num2 / 12) : 1 + (num2 / 12));
    let num3 = this.getSkill();
    this.subSkill(num3 <= 1 ? 1 - (num3 / 12) : 1 + (num3 / 12));
    if (Tools.roll(12) !== 0) {
      return true;
    }
    this.clrTrait(ArmsTrait.VISIBLE_TRAIT + Tools.roll(ArmsTrait.ENCHANT_TRAIT - ArmsTrait.VISIBLE_TRAIT));
    this.sub(ArmsTrait.ENCHANT, (this.getEnchant() + 4) / 5);
    return true;
  }

  tweak(): void {
    let sum = this.getPower();
    let value = 7 + Tools.twice(4) + Tools.skew(50);
    let num = this.getAttack();
    this.setAttack(num < 0 ? (num * 10) / value : (num * value) / 10);
    let num2 = this.getDefend();
    this.setDefend(num2 < 0 ? (num2 * 10) / value : (num2 * value) / 10);
    let num3 = this.getSkill();
    this.setSkill(num3 < 0 ? (num3 * 10) / value : (num3 * value) / 10);
    while (true) {
      let value2 = Tools.roll(itArms.MEGATWEAK);
      if (value2 >= sum) {
        break;
      }
      sum -= value2;
      let trait = ArmsTrait.VISIBLE_TRAIT + Tools.roll(ArmsTrait.ENCHANT_TRAIT - ArmsTrait.VISIBLE_TRAIT);
      if ((value2 & 1) === 0) {
        this.clrTrait(trait);
      } else {
        this.fixTrait(trait);
      }
    }
    if (this.isCursed()) {
      this.clrTrait(ArmsTrait.CURSE);
      this.fixTrait(ArmsTrait.CURSED);
    }
    if (this.isCursed() || this.stockValue() >= 70) {
      this.fixTrait(ArmsTrait.SECRET);
    }
  }

  stockValue(): number {
    if (this.hasTrait(ArmsTrait.SECRET) || this.hasTrait(ArmsTrait.CURSE)) {
      return 2;
    }
    let num = this.getAttack() + this.getDefend();
    let value = 0 + ((num > 0 ? 1 : -1) * num * num * 5);
    let num2 = this.getSkill();
    let value2 = (value + ((((num2 > 0 ? 1 : -1) * num2) * num2) * 2)) / 2;
    for (let ix = ArmsTrait.VALUED_TRAIT; ix < ArmsTrait.traitLabel.length; ix++) {
      let it = this.find(ArmsTrait.traitLabel[ix]);
      if (it !== null) {
        value2 += it.getCount() * ArmsTrait.traitValue[ix];
      }
    }
    return value2;
  }
}
