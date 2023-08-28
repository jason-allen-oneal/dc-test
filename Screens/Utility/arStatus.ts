import { Screen } from './Screen'; // Assuming you have a Screen class
import { FTextList } from './FTextList'; // Assuming you have an FTextList class
import { GearTable } from './GearTable'; // Assuming you have a GearTable class
import { Item } from './Item'; // Assuming you have an Item class
import { itAgent } from './itAgent'; // Assuming you have an itAgent class
import { itArms } from './itArms'; // Assuming you have an itArms class
import { itHero } from './itHero'; // Assuming you have an itHero class
import { itNote } from './itNote'; // Assuming you have an itNote class
import { itList } from './itList'; // Assuming you have an itList class
import { ArmsTrait } from './ArmsTrait'; // Assuming you have an ArmsTrait class
import { GearTypes } from './GearTypes'; // Assuming you have a GearTypes class
import { Tools } from './Tools'; // Assuming you have a Tools class
import { Button } from './Button'; // Assuming you have a Button class
import { Color } from './Color'; // Assuming you have a Color class
import { Event } from './Event'; // Assuming you have an Event class
import { Graphics } from './Graphics'; // Assuming you have a Graphics class
import { Rectangle } from './Rectangle'; // Assuming you have a Rectangle class
import { Enumeration } from './Enumeration'; // Assuming you have an Enumeration class

class arStatus extends Screen {
  useItem: Item;
  pick: Item;
  over: itArms;
  state: number;
  effect: number;
  fight: boolean;
  attack: boolean;
  table: FTextList;
  action: Button[];
  static readonly STATE_WAIT = 0;
  static readonly STATE_TARGET = 1;
  static readonly actionSTR = ["Use", "Info", "Peer", "Dump Slot", "Oops", "Exit"];
  static readonly slot = [ArmsTrait.HEAD, ArmsTrait.BODY, ArmsTrait.FEET, ArmsTrait.RIGHT, ArmsTrait.LEFT];
  static readonly loc = ["H:", "B:", "F:", "R:", "L:"];
  static readonly gearRect = new Rectangle(200, 145, 200, 100);
  static readonly expRect = new Rectangle(175, 98, 90, 10);
  static readonly gclr = [Color.white, Color.cyan, Color.lightGray, new Color(96, 192, 192)];

  constructor(from: Screen, battle: boolean = false) {
    super(from, "Hero Status Screen");
    this.useItem = null;
    this.pick = null;
    this.over = null;
    this.state = 0;
    this.effect = 0;
    this.fight = battle;
    this.attack = this.fight && !Tools.getHero().hasTrait("Panic");
    this.hideStatusBar();
    this.setBackground(new Color(192, 64, 0));
    this.setForeground(Color.white);
    this.setFont(Tools.statusF);
    Screen.getHero().calcCombat();
  }

  getDump(): itList {
    return Screen.getHero().getDump();
  }

  init(): void {
    super.init();
    this.updateTools();
    this.fixTable();
  }

  createTools(): void {
    this.addPic(Screen.getHero().getPortrait());
    this.getPic(0).reshape(275, 5, 120, 120);
    this.action = new Array<Button>(6);
    for (let ix = 0; ix < 6; ix++) {
      const off = ix % 3 === 0 ? 20 : 0;
      this.action[ix] = new Button(arStatus.actionSTR[ix]);
      this.action[ix].setFont(Tools.textF);
      this.action[ix].reshape((205 + ((ix % 3) * 65)) - off, ix < 3 ? 250 : 275, 60 + off, 20);
      this.action[ix].setForeground(Color.black);
    }
    this.table = new FTextList();
    this.table.reshape(5, 140, 170, 140);
    this.table.setFont(Tools.textF);
    this.table.setForeground(Color.black);
    this.updateTools();
  }

  addTools(): void {
    for (let i = 0; i < 6; i++) {
      this.add(this.action[i]);
    }
    this.add(this.table);
  }

  updateTools(): void {
    const h = Screen.getHero();
    this.action[0].setLabel(
      `${this.useString()}${this.fight ? ` (${h.actions()})` : ''}`
    );
    this.action[4].enable(!h.getDump().isEmpty());
    h.picture();
  }

  useString(): string {
    return this.state === 0 ? "Use" : GearTable.effectLabel(this.useItem);
  }

  fixTable(): void {
    const e: Enumeration = Screen.getPack().elements();
    let choice = -1;
    let ix = 0;
    this.table.clear();
    while (e.hasMoreElements()) {
      const it: Item = e.nextElement() as Item;
      this.table.addItem(this.nameItem(it));
      if (it === this.pick) {
        choice = ix;
      }
      ix++;
    }
    this.table.setSelect(choice);
  }

  findPack(p: itList): Item | null {
    const e: Enumeration = p.elements();
    const which = this.table.getSelect();
    if (which < 0) {
      return null;
    }
    while (e.hasMoreElements()) {
      const it: Item = e.nextElement() as Item;
      which--;
      if (which < 0) {
        return it;
      }
    }
    return null;
  }

  nameItem(it: Item): string {
    return !GearTable.canMageUse(it)
      ? it.toShow()
      : `${it.toShow()} {${GearTable.effectLabel(it)}}`;
  }

  insertPack(it: Item): void {
    Screen.putPack(it);
    this.table.addItem(nameItem(it), 0);
  }

  removePack(it: Item): boolean {
    const ix = Screen.getPack().indexOf(it);
    if (ix < 0) {
      return false;
    }
    this.table.delItem(ix);
    Screen.subPack(it);
    this.table.setSelect(-1);
    return true;
  }

  updatePack(it: Item): void {
    const ix = Screen.getPack().indexOf(it);
    if (ix >= 0) {
      this.table.setItem(nameItem(it), ix);
      this.table.setSelect(ix);
      this.pick = it;
    }
  }

  localPaint(g: Graphics): void {
    g.setColor(this.getBackground());
    g.fillRect(0, 0, this.bounds().width, this.bounds().height);
    this.drawStats(g);
    this.drawGear(g, 180, 140);
  }

  drawStats(g: Graphics): void {
    const h = Screen.getHero();
    const wounds = h.getWounds();
    const fatigue = h.getFatigue() + h.getOverload();
    const disease = h.disease();
    g.setColor(this.getForeground());
    g.setFont(Tools.statusF);
    g.drawString(`${h.getTitle()}${h.getName()}`, 5, 18);
    g.drawString(
      `Level: ${h.getLevel()}   Rank: ${h.getRankTitle()}   Age: ${h.getAge()}`,
      5,
      36
    );
    g.drawString(
      `Guts: ${h.getGuts()}${wounds > 0 ? `[-${wounds}]` : ''}`,
      5,
      54
    );
    g.drawString(`Wits: ${h.getWits()}`, 5, 72);
    g.drawString(`Charm: ${h.getCharm()}`, 5, 90);
    g.drawString(
      `Quests: ${h.getBaseQuests()}${fatigue > 0 ? `[-${fatigue}]` : ''}`,
      5,
      108
    );
    g.drawString(`Attack: ${h.getAttack()}`, 140, 54);
    g.drawString(`Defend: ${h.getDefend()}`, 140, 72);
    g.drawString(
      `Skill: ${h.getSkill()}${disease > 0 ? `[-${disease}]sick` : ''}`,
      140,
      90
    );
    g.drawString("Exp:", 140, 108);
    const r = new Rectangle(175, 98, 90, 10);
    g.setColor(Color.white);
    g.fillRect(r.x, r.y, r.width, r.height);
    g.setColor(Color.blue);
    g.fillRect(r.x, r.y, (r.width * h.getExp()) / h.getRaise(), r.height);
    g.setColor(Color.black);
    g.drawRect(r.x, r.y, r.width, r.height);
    if (this.fight) {
      g.setFont(Tools.courtF);
      g.drawString(this.actionLine(h), 5, 130);
    } else {
      g.setFont(Tools.statusF);
      g.drawString(this.guildLine(h), 5, 130);
    }
    const msg =
      `Load: ${Screen.getPack().getCount()} (${h.packMax()})`;
    g.setFont(Tools.boldF);
    if (h.getOverload() > 0) {
      g.setColor(Color.cyan);
      g.drawString(`OVER ${msg}`, 5, 295);
    } else {
      g.drawString(msg, 5, 295);
    }
  }

  drawGear(g: Graphics, dx: number, dy: number): void {
    g.setFont(Tools.statusF);
    g.setColor(Color.black);
    g.drawString("Armament", dx + 70, dy);
    for (let ix = 0; ix < 5; ix++) {
      const it = Screen.getHero().findGearTrait(arStatus.slot[ix]) as itArms;
      g.setColor(
        arStatus.gclr[
          it == null ? 0 : (it === this.pick ? 1 : 0) + (it === this.over ? 2 : 0)
        ]
      );
      dy += 20;
      g.drawString(
        `${arStatus.loc[ix]}${it == null ? '' : it.toShow()}`,
        dx,
        dy
      );
    }
  }

  actionLine(h: itAgent): string {
    const e: Enumeration = h.getActions().elements();
    let msg = '';
    while (e.hasMoreElements()) {
      msg += ` ${((e.nextElement() as Item).toShow())}`;
    }
    return msg.length() < 1 ? msg : `Use: ${msg}`;
  }

  guildLine(h: itAgent): string {
    let msg = 'Guild = ';
    if (h.guildRank() < 1) {
      return '';
    }
    const num = h.fightRank();
    if (num > 0) {
      msg += `F:${h.fight()}/${num}  `;
    }
    const num2 = h.magicRank();
    if (num2 > 0) {
      msg += `M:${h.magic()}/${num2}  `;
    }
    const num3 = h.thiefRank();
    if (num3 > 0) {
      msg += `T:${h.thief()}/${num3}  `;
    }
    const num4 = h.ieatsuRank();
    if (num4 > 0) {
      msg += `S:${h.ieatsu()}/${num4}  `;
    }
    return msg;
  }

  mouseMove(e: Event, x: number, y: number): boolean {
    const what = !arStatus.gearRect.inside(x, y)
      ? null
      : (Screen.getHero().findGearTrait(
          arStatus.slot[(y - arStatus.gearRect.y) / 20
        ) as itArms;
    if (what === this.over) {
      return false;
    }
    this.over = what;
    this.repaint();
    return false;
  }

  mouseDown(e: Event, x: number, y: number): boolean {
    if (!arStatus.gearRect.inside(x, y)) {
      return false;
    }
    if (this.table.getSelect() >= 0) {
      this.table.setSelect(-1);
      this.pick = null;
    }
    const what = Screen.getHero().findGearTrait(
      arStatus.slot[(y - arStatus.gearRect.y) / 20]
    ) as itArms;
    if (!(what instanceof itArms)) {
      return false;
    }
    this.over = what;
    if (this.over === this.pick) {
      this.pick = null;
    } else {
      this.pick = this.over;
    }
    this.repaint();
    return true;
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.table) {
      this.pick = Screen.getPack().select(this.table.getSelect());
    } else if (e.target === this.action[0]) {
      this.usePick();
    } else if (e.target === this.action[1]) {
      this.detailItem(this.pick);
    } else if (e.target === this.action[2]) {
      this.peerHero();
    } else if (e.target === this.action[3]) {
      this.dumpItem();
    } else if (e.target === this.action[4]) {
      this.backDump();
    } else if (e.target === this.action[5] || e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    this.updateTools();
    this.repaint();
    return true;
  }

  detailItem(what: Item): void {
    if (what !== null) {
      Tools.setRegion(new arDetail(this, what));
    }
  }

  peerHero(): void {
    Tools.setRegion(new arPeer(this, 2, Screen.getHero().getName()));
  }

  usePick(): void {
    if (
      (this.fight && Screen.getHero().actCount() < 1) ||
      !GearTable.find(this.pick)
    ) {
      return;
    }
    if (this.state === 1) {
      if (this.pick instanceof itArms) {
        this.performEffect(this.useItem);
      }
      this.setStateWait();
    } else if (this.state !== 0) {
    } else {
      if (this.pick instanceof itArms) {
        this.enactGear();
      } else if (GearTable.isScroll(this.pick)) {
        this.setStateTarget();
      } else if (GearTable.canHeroUse(this.pick)) {
        this.useItem = this.pick;
        this.performEffect(this.pick);
      }
    }
  }

  dumpItem(): void {
    if (this.pick !== null) {
      if (this.table.getSelect() >= 0) {
        const old = this.table.getSelect();
        if (this.removePack(this.pick)) {
          this.getDump().insert(this.pick);
          this.table.setSelect(old);
          this.pick = Screen.selectPack(this.table.getSelect());
        }
      } else if (
        Screen.getGear().indexOf(this.pick) >= 0 &&
        this.pick instanceof itArms &&
        !(this.pick as itArms).hasTrait(ArmsTrait.CURSE) &&
        Screen.getGear().drop(this.pick) !== null
      ) {
        this.getDump().insert(this.pick);
        this.pick = null;
      }
    }
  }

  backDump(): void {
    const it = this.getDump().select(0);
    if (it !== null) {
      this.getDump().drop(it);
      this.insertPack(it);
    }
  }

  enactGear(): void {
    if (Screen.getPack().indexOf(this.pick) >= 0) {
      this.wearGear();
    } else if (
      Screen.getGear().indexOf(this.pick) >= 0
      && this.pick instanceof itArms
      && !(this.pick as itArms).hasTrait(ArmsTrait.CURSE)
      && Screen.getGear().drop(this.pick) !== null
    ) {
      this.getDump().insert(this.pick);
      this.pick = null;
    }
  }

  wearGear(): void {
    const what = this.pick as itArms;
    let slots = 0;
    for (let ix = 0; ix < 5; ix++) {
      if (what.hasTrait(arStatus.slot[ix])) {
        if (this.removeGear(
          Screen.getGear().findArms(arStatus.slot[ix])
        )) {
          slots++;
        } else {
          return;
        }
      }
    }
    if (slots >= 1) {
      what.revealCurse();
      this.removePack(what);
      const gear = Screen.getGear();
      this.pick = what;
      gear.append(what);
    }
  }

  removeGear(what: itArms): boolean {
    if (what === null) {
      return true;
    }
    if (what.isCursed()) {
      Tools.setRegion(
        new arNotice(
          this,
          `\tYou can't remove the ${what.getName()}!  The @&$#~ thing is Cursed %#$@!\n`
        )
      );
      return false;
    }
    Screen.getGear().drop(what);
    this.insertPack(what);
    return true;
  }

  setStateWait(): void {
    if (this.state !== 0) {
      this.state = 0;
      this.useItem = null;
      this.effect = 0;
    }
  }

  setStateTarget(): void {
    if (this.state !== 1) {
      this.state = 1;
      this.useItem = this.pick;
      this.effect = GearTable.getEffect(this.pick);
      this.pick = null;
    }
  }

  performEffect(source: Item): void {
    if (this.tryEffect(source)) {
      this.attack = this.fight && !Screen.getHero().hasTrait("Panic");
      if (this.fight) {
        Screen.getHero().act();
      }
      if (this.useItem.getCount() === 1) {
        this.removePack(this.useItem);
        this.pick = null;
      } else {
        Screen.subPack(this.useItem.getName(), 1);
        this.updatePack(this.useItem);
      }
      this.repaint();
    }
  }

  tryEffect(source: Item): boolean {
    switch (GearTable.getEffect(source)) {
      case 1:
        this.effectIdentify(this.pick as itArms);
        return true;
      case 2:
        Screen.getHero().doHeal();
        return true;
      case 3:
        Screen.getHero().doCure();
        return true;
      case 4:
        Screen.getHero().doBlind();
        return true;
      case 5:
        Screen.getHero().doPanic();
        return true;
      case 6:
        Screen.getHero().doBlast();
        return true;
      case 7:
        Screen.getHero().doRevive();
        return true;
      case 8:
        Screen.getHero().doHaste();
        return true;
      case 9:
        Screen.getHero().doRefresh();
        return true;
      case 10:
        Screen.getHero().doCookie();
        return true;
      case 11:
        Screen.getHero().doYouth();
        return true;
      case GearTypes.EFF_AGING:
        Screen.getHero().doAging();
        return true;
      case GearTypes.EFF_FACELESS:
        this.effectFaceless();
        return true;
      case GearTypes.EFF_SCRIBE:
        this.effectScribe(this.pick);
        return true;
      case GearTypes.EFF_GLOW:
        this.effectGlow(this.pick as itArms);
        return true;
      case GearTypes.EFF_BLESS:
        this.effectBless(this.pick as itArms);
        return true;
      case GearTypes.EFF_LUCK:
        this.effectLuck(this.pick as itArms);
        return true;
      case GearTypes.EFF_FLAME:
        this.effectFlame(this.pick as itArms);
        return true;
      case GearTypes.EFF_ENCHANT:
        this.effectEnchant(this.pick as itArms);
        return true;
      case GearTypes.EFF_GRANT:
        this.effectGrant(this.pick);
        return true;
      case GearTypes.EFF_FOOD:
        Screen.getHero().doFood();
        return true;
      default:
        return false;
    }
  }

  effectFaceless(): void {
    Screen.getHero().doFaceless();
    Tools.setRegion(
      new arNotice(
        new arPeer(this, 2, Screen.getHero().getName()),
        "\tYou feel your features dissolve into an indistinct and shapeless form."
      )
    );
  }

  effectScribe(what: Item): void {
    Tools.setRegion(new arScribe(this, what.getName()));
  }

  effectGrant(what: Item): void {
    Tools.setRegion(new arNotice(this, Screen.getHero().doGrant(what as itNote)));
  }

  tryScroll(what: itArms): boolean {
    if (Tools.contest(Screen.getHero().getWits(), what.getPower())) {
      return true;
    }
    Tools.setRegion(
      new arNotice(
        this,
        `\tThe mass and material of the ${what.getName()} resists the power of your spell.  This scroll has been inneffective.\n`
      )
    );
    return false;
  }

  effectGlow(what: itArms): void {
    this.addArmsTrait(what, ArmsTrait.GLOWS);
  }

  effectLuck(what: itArms): void {
    this.addArmsTrait(what, ArmsTrait.LUCKY);
  }

  effectFlame(what: itArms): void {
    this.addArmsTrait(what, ArmsTrait.FLAME);
  }

  addArmsTrait(what: itArms, trait: string): void {
    if (this.tryScroll(what)) {
      what.fixTrait(trait);
      this.detailItem(what);
    }
  }

  effectIdentify(what: itArms): void {
    if (this.tryScroll(what)) {
      if (what.hasTrait(ArmsTrait.SECRET)) {
        what.clrTrait(ArmsTrait.SECRET);
      } else {
        what.revealCurse();
      }
      this.detailItem(what);
    }
  }

  effectBless(what: itArms): void {
    if (this.tryScroll(what)) {
      if (what.isCursed()) {
        what.clrTrait(ArmsTrait.CURSED);
        what.clrTrait(ArmsTrait.CURSE);
        Tools.setRegion(
          new arNotice(
            this,
            `\tThe ${what.getName()} flashes and sparkles first red then blue as a terrible curse is lifted...\n`
          )
        );
        return;
      }
      what.fixTrait(ArmsTrait.BLESS);
      this.detailItem(what);
    }
  }

  effectEnchant(what: itArms): void {
  if (this.tryScroll(what)) {
    what.incEnchant();
    const power = what.getPower();
    const dif = what.getEnchant() - what.getPower();
    if (dif < 0) {
      this.detailItem(what);
    } else if (!Tools.contest(dif, power)) {
      Tools.setRegion(
        new arNotice(
          new arDetail(this, what),
          `The ${what.getName()} pulses with a dangerous purple light.`
        )
      );
    } else {
      if (Screen.getGear().drop(what) === null) {
        this.removePack(what);
      }
      const msg = `\tThere is a hot, steamy explosion as your ${what.getName()} suddenly disintegrates into whirling, melting, whining and floating fragments!  The magical energies penetrate your body causing -${dif} wounds!\n`;
      Screen.getHero().addWounds(dif);
      if (Screen.getHero().isDead()) {
        Tools.setRegion(
          Screen.getHero().killedScreen(
            this.getHome(),
            `${msg}\tYou have been killed!\n`,
            false
          )
        );
      } else {
        Tools.setRegion(new arNotice(this, msg));
      }
    }
  }
}

}