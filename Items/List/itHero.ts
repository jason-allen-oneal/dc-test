import { Portrait } from './DCourt/Components/Portrait';
import { itList } from './DCourt/Items/itList';
import { itAgent } from './DCourt/Items/List/itAgent';
import { ArmsTrait } from './DCourt/Static/ArmsTrait';
import { Constants } from './DCourt/Static/Constants';
import { GearTypes } from './DCourt/Static/GearTypes';
import { Tools } from './DCourt/Tools/Tools';
import { Buffer } from './DCourt/Tools/Buffer';
import { MadLib } from './DCourt/Tools/MadLib';
import { itNote } from './DCourt/Items/itNote';
import { arExit } from './DCourt/Screens/Command/arExit';
import { arHealer } from './DCourt/Screens/Areas/Fields/arHealer';
import { arNotice } from './DCourt/Screens/Utility/arNotice';
import { arField } from './DCourt/Screens/Wilds/arField';
import { Screen } from './DCourt/Screens/Screen';

class itHero extends itAgent {
  private pass: string;
  private lastPlay: string;
  private best: string;
  private leader: string;
  private raise: number;
  private static readonly PLACE = 'place';
  private static readonly STORE = 'store';
  private static readonly DUMP = 'dump';
  private static readonly LOOKS = 'looks';
  private static picture: Portrait = new Portrait('Faces/Hero.jpg', 0, 0, 80, 80);
  private sessionID = 0;
  private store: itList = new itList(itHero.STORE);
  private looks: itList = new itList(itHero.LOOKS);
  private dump: itList = new itList(itHero.DUMP);

  static {
    itHero.picture.setType(2);
  }

  constructor(id: string) {
    super(id);
  }

  copy(): itHero {
    return new itHero(this);
  }

  getIcon(): string {
    return 'itHero';
  }

  static factory(buf: Buffer): itHero | null {
    if (!buf.begin()) {
      return null;
    }
    if ((!buf.match('itHero') && !buf.match('itAgent')) || !buf.split()) {
      return null;
    }
    const who: itHero = new itHero(buf.token());
    who.loadAttributes(buf);
    who.loadBody(buf);
    who.fixLists();
    return who;
  }

  fixLists(): void {
    super.fixLists();
    this.lastPlay = this.findValue('Date');
    this.store = this.findList(itHero.STORE);
    this.looks = this.findList(itHero.LOOKS);
    this.dump = new itList(this.dump);
  }

  getStore(): itList {
    return this.store;
  }

  getDump(): itList {
    return this.dump;
  }

  getLooks(): itList {
    return this.looks;
  }

  getVersion(): number {
    return this.getStatus().getCount(Constants.VERSION);
  }

  setVersion(val: number): void {
    this.getStatus().fix(Constants.VERSION, val);
  }

  storeCount(id: string): number {
    return this.store.getCount(id);
  }

  storeCountItem(it: Item): number {
    return this.store.getCount(it);
  }

  fixStore(id: string, num: number): void {
    this.store.fix(id, num);
  }

  addStore(id: string, num: number): number {
    return this.store.add(id, num);
  }

  subStore(id: string, num: number): number {
    return this.store.sub(id, num);
  }

  getPicture(): Portrait {
    return itHero.picture;
  }

  calcRaise(): void {
    this.raise = Math.floor(50 * Math.pow(1.5, this.getLevel() - 1));
  }

  getPlace(): string {
    return this.getValues().getValue(itHero.PLACE);
  }

  setPlace(val: string): void {
    this.getValues().fix(itHero.PLACE, val);
  }

  clearDump(): void {
    this.dump.clrQueue();
  }

  doFaceless(): void {
    this.looks.clrQueue();
  }

  doAging(): void {
    this.getStatus().add(Constants.AGE, 1);
  }

  doYouth(): void {
    if (this.getAge() >= 9) {
      this.getStatus().sub(Constants.AGE, 1);
    }
  }

  doExhaust(): void {
    this.getTemp().fix(Constants.FATIGUE, this.getBaseQuests());
  }

  update(tname: string, powers: string): boolean {
    Tools.setSeed(
      this.getLevel() + this.getExp() + this.getMoney() + this.getAge() + this.getFame() + this.guildRank()
    );
    this.calcCombat();
    this.calcRaise();
    if (this.getVersion() !== 10) {
      this.getPack().fix('Cookie', 3);
      this.getPack().fix('Bottled Faery', 1);
      this.getPack().append(
        new itNote(
          'Letter',
          'Fred',
          'Hi There,\nThe changes to DC1 are now complete except for fixing bugs. In order to celebrate, everyone gets a onetime gift of cookies and a bottled faery. Thanks for helping out.\n-Fred-'
        )
      );
      this.drop('end');
    }
    this.setVersion(10);
    if (!Tools.isPlaytest() && (!this.isNewday() || itAgent.CREATE === this.getState())) {
      return true;
    }
    this.advance(powers);
    return true;
  }

      advance(powers: string | null): void {
  const temp = this.getTemp();
  const stat = this.getStatus();
  temp.clrQueue();
  this.setState(itAgent.ALIVE);

  if (powers !== null) {
    for (let i = 0; i < Constants.TraitList.length; i++) {
      if (powers.indexOf(Constants.TraitList[i]) >= 0 ||
          powers.indexOf(Constants.TraitStub[i]) >= 0) {
        temp.fixTrait(Constants.TraitList[i]);
      }
    }
  }

  temp.fix(Constants.FIGHT, this.fightRank());
  if (this.hasTrait(Constants.BERZERK)) {
    temp.add(Constants.FIGHT, Math.floor((this.getLevel() + 7) / 8));
  }
  temp.fix(Constants.MAGIC, this.magicRank());
  if (this.hasTrait(Constants.MYSTIC)) {
    temp.add(Constants.MAGIC, Math.floor((this.getLevel() + 7) / 8));
  }
  temp.fix(Constants.THIEF, this.thiefRank());
  if (this.hasTrait(Constants.TRADER)) {
    temp.add(Constants.THIEF, Math.floor((this.getLevel() + 7) / 8));
  }
  temp.fix(Constants.IEATSU, this.ieatsuRank());

  if (this.getStatus().getCount(Constants.AGE) < 15) {
    this.getStatus().fix(Constants.AGE, 15);
  }

  if (!this.hasTrait(Constants.UNAGING)) {
    this.getStatus().add(Constants.AGE, 1);
  } else {
    if (this.getStatus().getCount(Constants.AGE) > 33) {
      this.getStatus().sub(Constants.AGE, 1);
    }
    if (this.getStatus().getCount(Constants.AGE) < 33) {
      this.getStatus().add(Constants.AGE, 1);
    }
  }

  const fame = this.getFame();
  const rank = this.getSocial();
  stat.fix(Constants.FAME, (fame - Math.floor(fame / 10)) + rank * 10);
  stat.add(Constants.STIPEND, rank * rank * 50);
}

rankString(): string {
  this.getPack();
  this.calcCombat();
  return `{
    itList|${this.getName()}|
    ${this.getSocial()}|${this.getAge()}|
    ${this.getFame()}|${this.getSkill()}|
    ${this.getAttack() + this.getDefend()}|
    ${this.getGuts() + this.getWits() + this.getCharm()}|
    ${this.getMoney() + this.getStore().getCount("Marks")}|
    ${this.guildRank()}|
    ${this.getState() === itAgent.DEAD ? this.getState() : this.getPlace()}|
    ${this.getClan() === null ? Constants.NONE : this.getClan()}
  }`;
}

protected gearAttack(): number {
  return this.getGear().fullAttack();
}

protected gearDefend(): number {
  return this.getGear().fullDefend();
}

protected gearSkill(): number {
  return this.getGear().fullSkill();
}

getWeapon(): string {
  const it = this.getGear().findArms(ArmsTrait.RIGHT);
  return this.hasTrait("Blind") ? Constants.BLIND_STR : it === null ? "Fists" : it.getName();
}

getArmour(): string {
  const it = this.getGear().findArms(ArmsTrait.BODY);
  return this.hasTrait("Panic") ? Constants.PANIC_STR : it === null ? Constants.SKIN : it.getName();
}

gainExp(exp: number): string {
  if (exp < 1) {
    return "";
  }
  this.learn(exp);
  return `\nThis encounter has left you wiser +${exp}xp\n`;
}

gainGuts(weight: number): string {
  if (Tools.roll(this.getGuts()) >= weight) {
    return "";
  }
  this.addGuts(1);
  return "\n*** You grow Stronger  +1 Guts! ***\n";
}

gainWits(weight: number): string {
  if (Tools.roll(this.getWits()) >= weight) {
    return "";
  }
  this.addWits(1);
  return "\n*** You grow Smarter  +1 Wits! ***\n";
}

gainCharm(weight: number): string {
  if (Tools.roll(this.getCharm()) >= weight) {
    return "";
  }
  this.addCharm(1);
  return "\n*** You grow Happier  +1 Charm! ***\n";
}

learn(num: number): number {
  return this.getStatus().add(Constants.EXP, num);
}

getExp(): number {
  return this.getStatus().getCount(Constants.EXP);
}

getRaise(): number {
  return this.raise;
}

getBaseQuests(): number {
  return this.hasTrait(Constants.QUICK) ? 27 + (4 * this.getLevel()) : 27 + (3 * this.getLevel());
}

getQuests(): number {
  return (this.getBaseQuests() - this.getFatigue()) - this.getOverload();
}

getFatigue(): number {
  return this.getTemp().getCount(Constants.FATIGUE);
}

getOverload(): number {
  const max = this.packMax();
  const size = this.getPack().getCount();
  if (size > max) {
    return size - max;
  }
  return 0;
}

addFatigue(num: number): number {
  return this.getTemp().add(Constants.FATIGUE, num);
}

subFatigue(num: number): number {
  return this.getTemp().sub(Constants.FATIGUE, num);
}

getSocial(): number {
  return this.getRank().getCount(Constants.SOCIAL);
}

getTitle(): string {
  return Constants.rankTitle[this.getSocial()];
}

getRankTitle(): string {
  return Constants.rankName[this.getGender()][this.getSocial()];
}

getFullTitle(): string {
  return `${this.getRankTitle()} ${this.getName()}`;
}

getGender(): number {
  return Constants.FEMALE === this.looks.getValue(Constants.TITLE) ? 1 : 0;
}

getFame(): number {
  return this.getStatus().getCount(Constants.FAME);
}

getAge(): number {
  return this.getStatus().getCount(Constants.AGE);
}

isNewday(): boolean {
  return this.lastPlay !== null && this.lastPlay !== Tools.getToday();
}

getFavor(): number {
  return this.getStatus().getCount(Constants.FAVOR);
}

addFavor(add: number): void {
  if (this.getFavor() + add >= 0) {
    this.getStatus().add(Constants.FAVOR, add);
  }
}

subFavor(sub: number): void {
  if (sub > this.getFavor()) {
    this.getStatus().zero(Constants.FAVOR);
  } else {
    this.getStatus().sub(Constants.FAVOR, sub);
  }
}

searchWork(val: number): void {
  if (this.hasTrait(Constants.RANGER)) {
    this.addFatigue(Tools.roll(1 + val));
  } else {
    this.addFatigue(val);
  }
}

travelWork(val: number): void {
  if (this.hasTrait(Constants.GYPSY)) {
    this.addFatigue(Tools.roll(1 + val));
  } else {
    this.addFatigue(val);
  }
}

actCount(): number {
  return this.getTemp().getCount(Constants.ACTIONS);
}

act(): boolean {
  return this.getTemp().sub(Constants.ACTIONS, 1) === 1;
}

act(num: number): boolean {
  return this.getTemp().sub(Constants.ACTIONS, num) === num;
}

resetActions(): void {
  if (this.hasTrait("Blind")) {
    this.getTemp().zero(Constants.ACTIONS);
  } else {
    this.getTemp().fix(Constants.ACTIONS, 1 + Math.floor(this.fightRank() / 4) + Math.floor(this.thiefRank() / 5) + Math.floor(this.magicRank() / 6));
  }
  this.getActions().clrQueue();
  this.getActions().setName(Constants.ATTACK);
  this.setState(itAgent.ALIVE);
}

maxPack(): number {
  return 60 + (this.hasTrait(Constants.TRADER) ? 20 : 0) + (this.hasTrait(Constants.MERCHANT) ? 20 : 0);
}

storeMax(): number {
  return 100 + (this.hasTrait(Constants.HOTEL) ? 50 : 0);
}

holdMax(): number {
  return 100 + (this.hasTrait(Constants.TRADER) ? 50 : 0) + (this.hasTrait(Constants.MERCHANT) ? 100 : 0);
}

heroHas(it: Item): number {
  return this.packCount(it) + this.getStore().getCount(it);
}

packHeal(): number {
  return this.packCount(GearTypes.APPLE) + this.packCount(GearTypes.TROLL) + this.packCount(GearTypes.SALVE);
}

packMagic(): number {
  return this.packCount(GearTypes.BLIND_DUST) + this.packCount(GearTypes.PANIC_DUST) + this.packCount(GearTypes.BLAST_DUST);
}

getClan(): string | null {
  const clan = this.getRank().getValue(Constants.CLAN);
  if (clan !== null && clan.length >= 1) {
    return clan;
  }
  return null;
}

setClan(clan: string | null): void {
  this.getRank().drop(Constants.CLAN);
  if (clan !== null) {
    this.getRank().append(Constants.CLAN, clan);
  }
}

picture(): Portrait {
  let msg = "";
  if (this.hasTrait("Blind")) {
    msg = `${msg}*BLIND*\n`;
  }
  if (this.hasTrait("Panic")) {
    msg = `${msg}+PANIC+\n`;
  }
  this.getPicture().setText(msg);
  return this.getPicture();
}

doGrant(it: itNote): string {
  const newClan = it.getFrom();
  const oldClan = this.getClan();
  this.getPack().drop(it);

  if (oldClan === null || oldClan.length <= 0 || Constants.NONE.equalsIgnoreCase(oldClan)) {
    this.setClan(newClan);
    return `\nYou are now a proud member of the ${newClan} clan!\n`;
  }

  if (oldClan === newClan) {
    return `\nYou are already a member of the ${newClan} clan!\n`;
  }

  const reaction = Tools.roll(1, 10);
  if (reaction >= 5) {
    this.setClan(newClan);
    return `\nYou are now a proud member of the ${newClan} clan!\n`;
  }

  return `\nThe ${newClan} clan doesn't accept your request to join.\n`;
}

tryToLevel(from: Screen): boolean {
  if (!this.isDead()) {
    this.setState(itAgent.ALIVE);
  }

  if (this.getExp() < this.getRaise()) {
    return false;
  }

  this.getRank().add(Constants.LEVEL, 1);
  this.getStatus().sub(Constants.EXP, this.getRaise());
  this.calcRaise();
  this.addGuts(2);
  this.addWits(2);
  this.addCharm(2);
  this.getStatus().add(Constants.FAME, this.getLevel());

  const congratulationMessage = `
    CONGRATULATIONS!!!!
    Your hours and minutes of sweat and suffering have finally been rewarded by an epiphany of understanding.
    +++ You Have Gained A Level - Level ${this.getLevel()} +++
    *** You Have Grown Stronger  +2 Guts ***
    *** You Have Grown Smarter  +2 Wits ***
    *** You Have Grown Happier  +2 Charm ***
    +++ You Have Grown Tougher  +3 Quests +++
  `;

  const notice = new arNotice(from, congratulationMessage);
  Tools.setRegion(notice);

  return true;
}

killedScreen(from: Screen, tale: string, losePack: boolean): Screen {
  let msg = "";
  const cost = Math.floor(this.getBaseQuests() / 4);
  let msg2 = tale;

  if (this.getPack().getCount("Bottled Faery") > 0) {
    msg = msg2 === null
      ? `\nYou are wounded mortally and fall to the ground. Before the creature can act, a Bottled Faery breaks free from your pack and transports you to the monastery. It clucks at you briefly in admonishment, then flies away leaving a trail of sparkly dust.\n`
      : `${msg2}\nA Bottled Faery breaks free from your pack and transports you to the healers!`;
    this.subPack("Bottled Faery", 1);
  } else {
    if (msg2 === null) {
      msg2 = `\nYou are wounded mortally and fall to the ground. The creature roots through your pack and leaves you for dead. A friendly woodsman finds you before the last of your blood has fallen. He drags you to the healers where your life is sustained by a thread.\n`;
    }
    this.setState(itAgent.DEAD);
    this.addFatigue(cost);
    this.getStatus().fix(Constants.FAME, Math.floor((this.getStatus().getCount(Constants.FAME) * 9) / 10));

    if (losePack) {
      msg2 += "\n*** Half your equipment is lost. ***\n";
      this.getPack().loseHalf();
    }

    if (this.getQuests() < 1) {
      return new arExit(from, this.getPlace());
    }

    msg = `${msg2}\n\t\t*** You lose ${cost} quests. ***\n`;
  }

  this.getTemp().fix(Constants.WOUNDS, this.getGuts() - Math.floor(this.getGuts() / this.getLevel()));
  this.doCure();
  this.setState(itAgent.ALIVE);
  this.setPlace(Constants.FIELDS);
  Screen.saveHero();
  return new arNotice(new arHealer(new arField()), msg);
}


}
