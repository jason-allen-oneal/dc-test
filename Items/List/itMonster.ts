import Portrait from './DCourt/Components/Portrait';
import itAgent from './DCourt/Items/List/itAgent';
import itText from './DCourt/Items/Token/itText';
import itList from './DCourt/Items/itList';
import Item from './DCourt/Items/Item';
import ArmsTrait from './DCourt/Static/ArmsTrait';
import Constants from './DCourt/Static/Constants';
import GearTypes from './DCourt/Static/GearTypes';
import Buffer from './DCourt/Tools/Buffer';
import Tools from './DCourt/Tools/Tools';


class itMonster extends itAgent {
  private picture: Portrait;
  private text: itText;
  private opts: itList;
  private baseA: number;
  private baseD: number;
  private baseS: number;
  private stance: number;

  static readonly PASSION = 'passion';
  static readonly PASSIVE = 'passive';
  static readonly DEFENSIVE = 'defensive';
  static readonly HOSTILE = 'hostile';
  static readonly AGGRESSIVE = 'aggressive';
  static readonly TEXT = 'text';

  constructor(name: string) {
    super(name);
  }

  copy(): Item {
    return new itMonster(this);
  }

  getIcon(): string {
    return 'itMonster';
  }

  toString(depth: number): string {
    return `${super.toStringHead(depth)}|${this.getGuts()}|${this.getWits()}|${this.getCharm()}|${this.getAttack()}|${this.getDefend()}|${this.getSkill()}\n\t${this.listBody(depth)}`;
  }

  static factory(buf: Buffer): Item | null {
    if (!buf.begin() || !buf.match('itMonster') || !buf.split()) {
      return null;
    }
    const who = new itMonster(buf.token());
    who.loadAttributes(buf);
    who.loadSecondary(buf);
    who.loadBody(buf);
    who.fixLists();
    return who;
  }

  loadSecondary(buf: Buffer): void {
    if (buf.split()) {
      this.baseA = buf.num();
    }
    if (buf.split()) {
      this.baseD = buf.num();
    }
    if (buf.split()) {
      this.baseS = buf.num();
    }
  }

  fixLists(): void {
    super.fixLists();
    this.text = this.find(TEXT) as itText;
    if (!this.text) {
      console.error(`ERR: [text=null] for [${this}]`);
    }
    const it = this.find('pic');
    if (!it) {
      console.error(`ERR: [pic=null] for [${this}]`);
    } else {
      this.picture = new Portrait(it.getValue(), 0, 0, 80, 80);
      this.picture.setType(2);
    }
    this.opts = this.findList('opts') as itList;
    if (!this.opts) {
      console.error(`ERR: [opts=null] for [${this}]`);
    }
  }

  balance(weight: number): void {
    if (this.isMatch(Constants.DRAGON) && Tools.getHero().hasTrait(Constants.DRAGON)) {
      this.getOptions().append('trade');
      this.stance--;
    }
    this.calcPrimary(weight);
    this.calcCombat();
    this.calcSecondary(weight);
    this.buildPack();
    this.buildGear(this.getGear().select(0));
    this.buildGear(this.getGear().select(1));
  }

  alterGuts(val: number): void {
    this.setGuts(Math.floor(this.getGuts() * val));
  }

  alterWits(val: number): void {
    this.setWits(Math.floor(this.getWits() * val));
  }

  alterCharm(val: number): void {
    this.setCharm(Math.floor(this.getCharm() * val));
  }

  calcPrimary(weight: number): void {
    const id = this.text.getIdentity();
    if (id !== null) {
      this.setName(id);
    }
    const ratio = 0.9 + (Tools.getHero().getLevel() * 0.1);
    this.alterGuts(ratio);
    this.alterWits(ratio);
    this.alterCharm(ratio);
    this.setGuts(Tools.spread(this.getGuts()));
    this.setWits(Tools.spread(this.getWits()));
    this.setCharm(Tools.spread(this.getCharm()));
    if (this.hasTrait('adjust')) {
      const ratio2 = (1.0 + (weight * 0.1)) / (this.getPower() / Tools.getHero().getPower());
      if (ratio2 > 1.0) {
        this.alterGuts(ratio2);
        this.alterWits(ratio2);
        this.alterCharm(ratio2);
        this.baseA = Math.floor(this.baseA * ratio2);
        this.baseD = Math.floor(this.baseD * ratio2);
        this.baseS = Math.floor(this.baseS * ratio2);
      }
    }
  }

  calcSecondary(weight: number): void {
    let num = this.tempCount(Constants.ACTIONS);
    if (num === 0) {
      num = 1;
      this.fixTemp(Constants.ACTIONS, 1);
    }
    this.fixStatus(
      Constants.ACTIONS,
      (((this.getGuts() + this.getWits()) + this.getCharm()) / 30) +
        ((((this.thief() + this.magic()) + this.fight()) + weight) / 4)
    );
    this.fixStatus(
      Constants.FAME,
      Math.floor(
        ((this.getGuts() + this.getWits()) + this.getCharm()) / 30 +
          (((this.thief() + this.magic()) + this.fight()) + weight) / 4
      )
    );
    this.fixStatus(
      Constants.EXP,
      Math.floor(((1 + this.getAttack()) + this.getDefend()) * (100 + this.getSkill()) / 100)
    );
    const passion = this.getValues().getValue(itMonster.PASSION);
    if (passion === itMonster.AGGRESSIVE) {
      this.stance = 4;
    } else if (itMonster.HOSTILE === passion) {
      this.stance = 3;
    } else if (itMonster.DEFENSIVE === passion) {
      this.stance = 2;
    } else if (passion === 'timid') {
      this.stance = 1;
    } else if (itMonster.PASSIVE === passion) {
      this.stance = 0;
    } else {
      this.stance = 2;
      console.error(`Unknown [passion=${passion}] for [${this}]`);
    }
  }
  
  buildPack(): void {
    const pack = this.getPack();
    const from = <itList>pack.copy();
    pack.clrQueue();
    for (let ix = 0; ix < from.getCount(); ix++) {
      const it = from.select(ix);
      if (GearTable.find(it)) {
        if (it instanceof itNote) {
          pack.append(it);
        } else {
          const make = GearTable.shopItem(it);
          if (!(make instanceof itArms)) {
            const num = (<itCount>it).makeCount();
            if (num >= 1) {
              make.setCount(num);
              pack.append(make);
            }
          } else if (Tools.percent(it.getCount()) && (!make.getName().startsWith('Silver') || Tools.percent(10))) {
            make.tweak();
            pack.append(make);
          }
        }
      }
    }
  }

  buildGear(it: Item): void {
    let make: itArms;
    if ((<itCount>it).makeCount() >= 1 && (make = <itArms>GearTable.shopItem(it)) !== null) {
      make.tweak();
      if (this.getGear().hasTrait(ArmsTrait.CURSE) && Tools.percent(25)) {
        make.fixTrait(ArmsTrait.CURSED);
      }
      if (this.getGear().hasTrait(ArmsTrait.BLESS)) {
        make.fixTrait(ArmsTrait.BLESS);
      }
      this.getPack().append(make);
    }
  }

  testGear(): void {
    for (let ix = 0; ix < this.getPack().getCount(); ix++) {
      GearTable.find(this.getPack().select(ix));
    }
    this.testItem(this.getGear().select(0), 'weapon');
    this.testItem(this.getGear().select(1), 'armour');
  }

  testItem(it: Item, type: string): void {
    if (it === null) {
      console.error(`ERR: No ${type} for ${this.getName()}`);
    } else if (!(it instanceof itCount)) {
      console.error(`ERR: Bad ${type} for ${this.getName()}`);
    } else if (it.getCount() > 0) {
      GearTable.find(it);
    }
  }

  resetActions(): void {
    const acts = this.getActions();
    const temp = this.getTemp();
    if (this.hasTrait('Blind')) {
      temp.zero(Constants.ACTIONS);
    } else {
      temp.fix(Constants.ACTIONS, this.statusCount(Constants.ACTIONS));
    }
    acts.clrQueue();
    acts.setName(Constants.ATTACK);
    this.setState(itAgent.ALIVE);
  }
  
  getText(): string {
    return this.text.getText();
  }

  getPicture(): Portrait {
    return this.picture;
  }

  getOptions(): itList {
    return this.opts;
  }

  baseExp(): number {
    return this.statusCount('exp');
  }

  baseFame(): number {
    return this.statusCount(Constants.FAME);
  }

  getWeapon(): string {
    return this.getGear().select(0).getName();
  }

  getArmour(): string {
    return this.getGear().select(1).getName();
  }

  gearAttack(): number {
    return this.baseA;
  }

  gearDefend(): number {
    return this.baseD;
  }

  gearSkill(): number {
    return this.baseS;
  }

  getStance(): number {
    return this.stance;
  }

  incStance(): void {
    this.stance++;
  }

  setPassive(): void {
    this.stance = 0;
  }

  isAggresive(): boolean {
    return this.stance >= 4;
  }

  isHostile(): boolean {
    return this.stance === 3;
  }

  isDefensive(): boolean {
    return this.stance === 2;
  }

  isPassive(): boolean {
    return this.stance <= 1;
  }
  
    chooseActions(first: boolean): void {
    const enemy = Tools.getHero();
    const pm = this.packMagic();
    const ph = this.packHeal();
    const sk = this.guildSkill();
    const acts = this.getActions();
    const temp = this.getTemp();
    acts.setName(Constants.ATTACK);
    if (this.actions() < 1) {
      this.useSkills(first);
      return;
    }
    if ((this.hasTrait("Blind") || this.hasTrait("Panic")) && this.subPack(GearTypes.SELTZER, 1) === 1) {
      acts.add(GearTypes.SELTZER, 1);
      temp.clrTrait("Blind");
      temp.clrTrait("Panic");
      this.useAction();
    }
    let num = this.getWounds();
    let val = this.actions();
    if (num > val * 20 && ph > val && this.subPack(GearTypes.GINSENG, 1) === 1) {
      acts.add(GearTypes.GINSENG, 1);
      temp.add(Constants.ACTIONS, 2);
    }
    let num2 = num - this.actionHeal(GearTypes.TROLL, num, 30);
    let num3 = num2 - this.actionHeal(GearTypes.APPLE, num2, 30);
    let actionHeal = num3 - this.actionHeal(GearTypes.SALVE, num3, 15);
    if (temp.getCount(Constants.GOAT) > 0) {
      acts.setName(Constants.GOAT);
      temp.sub(Constants.GOAT, 1);
    } else if (temp.getCount(Constants.WORM) > 0) {
      acts.setName(Constants.WORM);
      temp.sub(Constants.WORM, 1);
    } else {
      let danger = this.getPower();
      let danger2 = ((enemy.getPower() - danger) * 4) / danger;
      let num4 = this.actions() + (this.packCount(GearTypes.GINSENG) * 2);
      if (pm > num4) {
        pm = num4;
      }
      if (sk > 0) {
        sk += danger2;
      }
      if (Tools.contest(pm, first ? sk - this.fight() : sk - this.thief())) {
        this.useMagic();
      } else {
        this.useSkills(first);
      }
    }
  }
  
    useMagic(): void {
    let bd = this.packCount(GearTypes.BLIND_DUST);
    let pn = this.packCount(GearTypes.PANIC_DUST);
    let bt = this.packCount(GearTypes.BLAST_DUST);
    const acts = this.getActions();
    const temp = this.getTemp();
    acts.setName(Constants.SPELLS);
    while (bd + pn > this.actions() && this.subPack(GearTypes.GINSENG, 1) === 1) {
      acts.add(GearTypes.GINSENG, 1);
      temp.add(Constants.ACTIONS, 2);
    }
    while (bd + pn + bt > 0 && this.actions() > 0) {
      if (Tools.contest(bd, pn + bt)) {
        this.subPack(GearTypes.BLIND_DUST, 1);
        acts.add("Blind", 1);
        bd--;
      } else if (Tools.contest(pn, bt)) {
        this.subPack(GearTypes.PANIC_DUST, 1);
        acts.add("Panic", 1);
        pn--;
      } else {
        this.subPack(GearTypes.BLAST_DUST, 1);
        acts.add(ArmsTrait.BLAST, 1);
        bt--;
      }
      this.useAction();
    }
  }

  useSkills(first: boolean): void {
    const wr = this.fight();
    const mg = this.magic();
    const tf = this.thief();
    const sm = this.ieatsu();
    const acts = this.getActions();
    if (Tools.roll(3) >= this.stance) {
      acts.setName(Constants.RUNAWAY);
    } else if (first) {
      if (tf + mg + sm >= 1) {
        if (Tools.contest(mg, tf + sm)) {
          acts.setName("Control");
        } else if (Tools.contest(sm, tf)) {
          acts.setName(Constants.IEATSU);
        } else {
          acts.setName(Tools.roll(2) === 0 ? "Swindle" : Constants.BACKSTAB);
        }
      }
    } else if (mg + wr >= 1) {
      if (Tools.contest(mg, wr)) {
        acts.setName("Control");
      } else {
        acts.setName(Constants.BERZERK);
      }
    }
  }

  actionHeal(id: string, wounds: number, val: number): number {
    let num = (wounds + (val / 2)) / val;
    const has = this.packCount(id);
    if (num > has) {
      num = has;
    }
    const has2 = this.actions();
    if (num > has2) {
      num = has2;
    }
    this.useAction(num);
    this.getActions().add(id, num);
    return num * val;
  }

  goatSkill(): string {
    const h = Tools.getHero();
    this.getActions().setName(Constants.ATTACK);
    if (!Tools.contest(2 * this.getGuts(), h.getGuts()) || h.packCount("Rope") === 0) {
      return "";
    }
    const val = h.packCount("Rope");
    let num = 1 + Tools.roll(4) + Tools.roll(4);
    if (num > val) {
      num = val;
    }
    h.subPack("Rope", num);
    return `\tThe ${this.getName()} steals and devours ${num} pieces of rope!  Baa-a-a-a!\n`;
  }

  wormSkill(): string {
    const h = Tools.getHero();
    this.getActions().setName(Constants.ATTACK);
    if (!Tools.contest(2 * this.getGuts(), h.getGuts())) {
      return "";
    }
    let it = h.findGearTrait(ArmsTrait.GLOWS);
    if (it === null) {
      it = h.findGearTrait(ArmsTrait.FLAME);
    }
    if (it === null) {
      return "";
    }
    h.dropGear(it);
    it.decay(3);
    this.getPack().insert(it);
    return `\tThe ${this.getName()} rips the ${it.getName()} from your body and swallows it whole!\n`;
  }
}

}
