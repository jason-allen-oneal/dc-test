import { Screen } from 'DCourt.Screens.Screen';
import { itAgent, itMonster, itHero, itList } from 'DCourt.Items';
import { arQuest } from 'DCourt.Screens.Quest';
import { arNotice } from 'DCourt.Screens.Utility';
import { ArmsTrait, Constants, GearTypes } from 'DCourt.Static';
import { Tools } from 'DCourt.Tools';
import { Color, Event, Graphics } from 'java.awt';

class arBattle extends Screen implements GearTypes {
  events: string;
  text: string;
  power: string[] = ["Fly Swat", "Weak Blow", "Good Hit", "Potent Hit", "POWER HIT!"];
  effect: string[] = ["DODGED!", "Unharmed", "Scratched", "Injured!", "Wounded!!", "KILLED!!!"];
  killStop = false;
  hero: itHero = Screen.getHero();
  mob: itMonster;
  quest: arQuest;
  static ABUF = "    ---";
  static berzerks = [
    "With a scream of fury, you tear into it!",
    "Foaming at the mouth you leap onto it!",
    "You attack like a whirlwind, screaming!",
    "KILL!  KILL!  KILL!  KILL!  KILL!  KILL!"
  ];
  static backstabs = [
    "You pat it on the back with a knife",
    "You point down \"Hey your shoes are untied\"",
    "You pretend to leave, but circle back!",
    "I'm your best friend - DIE! DIE! DIE!"
  ];

  constructor(from: arQuest, msg: string) {
    super(from, "Battle Screen");
    this.hideStatusBar();
    this.setBackground(new Color(192, 0, 0));
    this.setForeground(Color.white);
    this.setFont(Tools.courtF);
    this.quest = from;
    this.mob = from.getMob();
    this.addPic(this.mob.getPicture());
    this.getPic(0).reshape(10, 10, 160, 160);
    this.addPic(this.hero.getPicture());
    this.getPic(1).reshape(230, 10, 160, 160);
    this.text = this.battle(this.hero, this.mob);
    this.events = this.combatEvents(msg);
  }

  init() {
    super.init();
    if (this.events.length() > 0) {
      Tools.setRegion(new arNotice(this, this.events));
      this.events = "";
    }
  }

  localPaint(g: Graphics) {
    let v = 170;
    let msg = this.text;
    g.setColor(this.getForeground());
    g.setFont(this.getFont());
    while (true) {
      let ix = msg.indexOf(10);
      if (ix === -1) {
        g.drawString(msg, 5, v + 20);
        return;
      }
      v += 20;
      g.drawString(msg.substring(0, ix), 5, v);
      msg = msg.substring(ix + 1);
    }
  }

  action(e: Event, o: Object): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    this.hero.clearDump();
    this.quest.battleActionResult();
    return true;
  }

  battle(hero: itAgent, mob: itAgent): string {
    let heroFirst: boolean;
    let msg: string;
    let hguts = hero.getGuts();
    let hspeed = hero.skill();
    let hhit = Tools.twice(3);
    let mguts = mob.getGuts();
    let mspeed = mob.skill();
    let mhit = Tools.twice(3);
    let ha = hero.getActions();
    let ma = mob.getActions();
    if (ha.isMatch(Constants.BACKSTAB)) {
      hguts *= 2;
      hspeed *= 2;
      mhit = 1;
    } else if (ha.isMatch(Constants.BERZERK) || ha.isMatch(Constants.IEATSU)) {
      hguts *= 2;
      hspeed *= 2;
      hhit = 4;
    } else if (ha.isMatch("Control")) {
      hspeed = hero.getWits();
    } else if (ha.isMatch("Swindle")) {
      hspeed = hero.getCharm();
    }
    if (hero.hasTrait(Constants.REFLEX)) {
      hspeed += 30;
    }
    if (hero.hasTrait("Blind")) {
      hspeed /= 2;
      hhit /= 2;
    }
    if (ma.isMatch(Constants.BACKSTAB)) {
      mguts *= 2;
      mspeed *= 2;
      hhit = 1;
    } else if (ma.isMatch(Constants.BERZERK) || ma.isMatch(Constants.IEATSU)) {
      mguts *= 2;
      mspeed *= 2;
      mhit = 4;
    } else if (ma.isMatch("Control")) {
      mspeed = mob.getWits();
    } else if (ma.isMatch("Swindle")) {
      mspeed = mob.getCharm();
    }
    if (mob.hasTrait(Constants.REFLEX)) {
      mspeed += 30;
    }
    if (mob.hasTrait("Blind")) {
      mspeed /= 2;
      mhit /= 2;
    }
    if (ma.isMatch(Constants.RUNAWAY) && !ha.isMatch(Constants.RUNAWAY)) {
      heroFirst = true;
    } else if (!ha.isMatch(Constants.RUNAWAY) || ma.isMatch(Constants.RUNAWAY)) {
      heroFirst = Tools.contest(hspeed, mspeed);
    } else {
      heroFirst = false;
    }
    if (heroFirst) {
      msg = `${this.agentAct(hero, mob, hguts, hhit, hspeed, mspeed)}`;
      if (!this.killStop) {
        msg += `${this.agentAct(mob, hero, mguts, mhit, mspeed, hspeed)}`;
      }
    } else {
      msg = `${this.agentAct(mob, hero, mguts, mhit, mspeed, hspeed)}`;
      if (!this.killStop) {
        msg += `${this.agentAct(hero, mob, hguts, hhit, hspeed, mspeed)}`;
      }
    }
    return msg;
  }

  agentAct(at: itAgent, df: itAgent, guts: number, hit: number, as: number, ds: number): string {
    let stk: number;
    let dmg: number;
    let act = at.getActions();
    let useBlast = false;
    if (act.isMatch("Control")) {
      return this.actorControls(at, df, 2 * at.getWits());
    }
    if (act.isMatch("Swindle")) {
      return this.actorSwindles(at, df, 2 * at.getCharm());
    }
    if (act.isMatch(Constants.BACKSTAB)) {
      at.thief(1);
      if (df.hasTrait(Constants.ALERT)) {
        ds += 30;
      }
    }
    if (act.isMatch(Constants.BERZERK)) {
      at.fight(1);
      if (df.hasTrait(Constants.FENCER)) {
        ds += 30;
      }
    }
    if (act.isMatch(Constants.IEATSU)) {
      at.ieatsu(1);
      if (df.hasTrait(Constants.FENCER)) {
        ds += 30;
      }
    }
    let weapon = at.getGear().findArms(ArmsTrait.RIGHT);
    if (weapon !== null && weapon.hasTrait(ArmsTrait.BLAST)) {
      at.getActions().add(ArmsTrait.BLAST, 1);
    }
    if (Tools.roll(ds) > as) {
      dmg = 0;
      stk = 0;
    } else {
      dmg = (((guts * (2 + hit)) / 10) + at.getAttack()) - df.getDefend();
      let val = 25 * at.getActions().getCount(ArmsTrait.BLAST);
      useBlast = val > dmg;
      if (useBlast) {
        dmg = val;
      } else {
        at.getActions().drop(ArmsTrait.BLAST);
      }
      let val2 = df.getGuts() - df.getWounds();
      if (dmg < 1) {
        stk = 1;
      } else {
        stk = dmg >= val2 ? 5 : 2 + ((3 * dmg) / val2);
      }
    }
    if (stk > 1) {
      df.addWounds(dmg);
    }
    if (stk === 5) {
      this.killStop = true;
      df.setState(itAgent.DEAD);
    }
    if (weapon !== null) {
      if (weapon.hasTrait("Blind")) {
        at.getActions().add("Blind", 1);
      }
      if (weapon.hasTrait("Panic")) {
        at.getActions().add("Panic", 1);
      }
      if (!useBlast && weapon.hasTrait("Disease")) {
        at.getActions().add("Disease", (dmg + 3) / 5);
      }
    }
    let msg = `${at.getName()}: `;
    return `${act.isMatch(Constants.ATTACK)
      ? msg + this.power[hit]
      : msg + act.getName()} ${df.getName()} ${this.effect[stk]} ${this.spellEffects(at, df)}\n`;
  }

  actorControls(at: itAgent, df: itAgent, as: number): string {
    let msg: string;
    at.magic(1);
    let msg2 = `${at.getName()} tries Hypnosis!\n`;
    let ds = df.getWits();
    if (df.hasTrait(Constants.STUBBORN)) {
      ds += 30;
    }
    if (Tools.contest(as, ds)) {
      msg = `${msg2}${ABUF}${df.getName()} is Mesmerized!\n`;
      at.setState("Control");
      this.killStop = true;
    } else {
      msg = `${msg2}    ---But the ${df.getName()} Resists!\n`;
    }
    return msg;
  }

  actorSwindles(at: itAgent, df: itAgent, as: number): string {
    let msg: string;
    at.thief(1);
    let msg2 = `${at.getName()} starts 'Trading'!\n`;
    let ds = df.getCharm();
    if (df.hasTrait(Constants.CLEVER)) {
      ds += 30;
    }
    if (Tools.contest(as, ds)) {
      msg = `${msg2}${ABUF}${df.getName()} falls for It!\n`;
      at.setState("Swindle");
      this.killStop = true;
    } else {
      msg = `${msg2}    ---But the ${df.getName()} is too Cunning!\n`;
    }
    return msg;
  }

  spellEffects(at: itAgent, df: itAgent): string {
    let msg = "";
    let e = at.getActions().elements();
    while (e.hasMoreElements()) {
      let it = e.nextElement() as Item;
      if (it.isMatch("Blind") && Tools.contest(at.getWits() * it.getCount(), df.getWits())) {
        msg += " *BLIND*";
        df.getTemp().fixTrait("Blind");
      }
      if (it.isMatch("Panic") && Tools.contest(at.getWits() * it.getCount(), df.getWits())) {
        msg += " +PANIC+";
        if (df instanceof itMonster) {
          (df as itMonster).setPassive();
        }
        df.getTemp().fixTrait("Panic");
      }
      if (it.isMatch("Disease") && it.getCount() > 0) {
        msg += " ^Sick^";
        if (df.hasTrait(Constants.HARDY)) {
          df.ail(Math.floor(it.getCount() / 2));
        } else {
          df.ail(it.getCount());
        }
      }
      if (it.isMatch(ArmsTrait.BLAST)) {
        msg += " >KABOOM<";
      }
    }
    return msg;
  }

  combatEvents(msg: string): string {
    let ma = this.mob.getActions();
    if (msg === null) {
      msg = "";
    }
    let num = ma.getCount(GearTypes.GINSENG);
    if (num > 0) {
      msg += `\tThe ${this.mob.getName()} gains energy by eating ${num} ${GearTypes.GINSENG}\n`;
    }
    if (ma.getCount(GearTypes.SELTZER) > 0) {
      msg += `\tThe ${this.mob.getName()} washes dust from its eyes by using ${GearTypes.SELTZER}\n`;
    }
    let val = ma.getCount(GearTypes.APPLE);
    let num2 = ma.getCount(GearTypes.SALVE);
    if (val > 0 || num2 > 0) {
      let msg2 = `\tThe ${this.mob.getName()} swallows`;
      if (val > 0) {
        msg2 += ` ${val} ${GearTypes.APPLE}`;
      }
      if (val > 0 && num2 > 0) {
        msg2 += " and";
      }
      if (num2 > 0) {
        msg2 += ` ${num2} ${GearTypes.SALVE}`;
      }
      msg = `${msg2} healing its wounds.\n`;
      while (val--) {
        this.mob.doRevive();
        this.mob.subPack(GearTypes.APPLE, 1);
      }
      while (num2--) {
        this.mob.doHeal();
        this.mob.subPack(GearTypes.SALVE, 1);
      }
    }
    let val2 = ma.getCount(GearTypes.TROLL);
    if (val2 > 0) {
      msg += `\tThe ${this.mob.getName()} regenerates!\n`;
      while (val2--) {
        this.mob.doRevive();
        this.mob.subPack(GearTypes.TROLL, 1);
      }
    }
    if (ma.isMatch(Constants.GOAT)) {
      msg += this.mob.goatSkill();
    }
    if (ma.isMatch(Constants.WORM)) {
      msg += this.mob.wormSkill();
    }
    return msg;
  }
}
