import { itAgent } from './DCourt.Items.List';
import { itHero } from './DCourt.Items.List';
import { itList } from './DCourt.Items';

import { arError } from './DCourt.Screens.Command';
import { arExit } from './DCourt.Screens.Command';
import { arNotice } from './DCourt.Screens.Utility';
import { Screen } from './DCourt.Screens.Screen';

import { Constants } from './DCourt.Static.Constants';
import { Buffer } from './DCourt.Tools.Buffer';
import { Loader } from './DCourt.Tools.Loader';
import { Tools } from './DCourt.Tools.Tools';

class Player implements Constants {
  static NOERR = 0;
  static SERVER_NOT_RESPONDING = 1;
  static SERVER_SIDE_ERROR = 2;
  static BAD_RECORD = 3;
  static err: number;
  static errMessage: string;

  private powers: string | null = null;
  private leader: string | null = null;
  private best: string | null = null;
  private pass: string | null = null;
  private name: string | null = null;
  private sessionID: number = 0;
  private hero: itHero | null = null;
  private start: itList = new itList('start');

  getHero(): itHero | null {
    return this.hero;
  }

  createHero(): itHero {
    this.hero = new itHero(this.name!);
    this.hero.fixLists();
    return this.hero;
  }

  getName(): string | null {
    return this.name;
  }

  getPass(): string | null {
    return this.pass;
  }

  getBest(): string | null {
    return this.best;
  }

  getLeader(): string | null {
    return this.leader;
  }

  getSessionID(): number {
    return this.sessionID;
  }

  alterSessionID(sid: number): number {
    return ((sid >> 11) & 2097151) | ((sid << 24) & -2097152);
  }

  isDead(): boolean {
    return itAgent.DEAD === this.hero!.getState();
  }

  isAlive(): boolean {
    return itAgent.ALIVE === this.hero!.getState();
  }

  isCreate(): boolean {
    return itAgent.CREATE === this.hero!.getState();
  }

  setState(val: string): void {
    this.hero!.setState(val);
  }

  getPlace(): string {
    return this.hero!.getPlace();
  }

  setPlace(val: string): void {
    this.hero!.setPlace(val);
  }

  needsBuild(): boolean {
    if (this.hero!.getLevel() <= 5) {
      return false;
    }
    return this.hero!.getLooks() === null || this.hero!.getLooks()!.getCount() < 1;
  }

  getStart(): itList {
    return this.start;
  }

  startValues(): void {
    this.start.add(Constants.GUTS, this.hero!.getGuts());
    this.start.add(Constants.WITS, this.hero!.getWits());
    this.start.add(Constants.CHARM, this.hero!.getCharm());
    this.start.add(Constants.ATTACK, this.hero!.getAttack());
    this.start.add(Constants.DEFEND, this.hero!.getDefend());
    this.start.add(Constants.SKILL, this.hero!.getSkill());
    this.start.add(Constants.LEVEL, this.hero!.getLevel());
    this.start.add(Constants.EXP, this.hero!.getExp());
    this.start.add(Constants.FAME, this.hero!.getFame());
    this.start.add('Marks', this.hero!.getMoney());
  }

  loadHero(tname: string, tpass: string): boolean {
    this.name = tname;
    this.pass = tpass;
    this.sessionID = Tools.nextInt();
    const msg = `${tname}|${tpass}|${this.sessionID}`;
    this.sessionID = this.alterSessionID(this.sessionID);
    /* ADD REST API HERE */
    /*
    if (!this.readFindValues(Loader.cgiBuffer(Loader.FINDHERO, msg))) {
        return false;
    }
    */
    this.hero = null;
    const STATIC_HERO = `{itHero|Static|150|100|100|50|0|300|{~|values|{=|place|fields}}|{~|pack|{#|Marks|100}}|{~|gear|{itArms|Hatchet|4|0|-1|right}}|}`;
    /* ADD REST API HERE */
    return this.readHeroValues(new Buffer(STATIC_HERO)); // //Loader.cgiBuffer(Loader.READHERO, this.name));
  }

  readHeroValues(buf: Buffer): boolean {
    Player.err = 1;
    if (buf == null || buf.isError()) {
      return false;
    }
    Player.err = 0;
    this.hero = Item.factory(buf) as itHero;
    if (this.hero == null) {
      return true;
    }
    this.hero.update(this.name!, this.powers!);
    this.startValues();
    return true;
  }

  readFindValues(buf: Buffer): boolean {
    Player.err = 1;
    if (buf == null || buf.isEmpty()) {
      return false;
    }
    Player.err = 2;
    if (buf.isError()) {
      Player.errMessage = buf.line();
      return false;
    }
    Player.err = 3;
    Tools.setToday(buf.token());
    if (Tools.getToday() === null || !buf.split()) {
      return false;
    }
    this.best = buf.token();
    if (!buf.split()) {
      return false;
    }
    this.leader = buf.token();
    if (!buf.split()) {
      return false;
    }
    this.powers = buf.token();
    return true;
  }

  saveHero(): boolean {
    this.hero!.fix('Date', Tools.getToday());
    /*
     * name|sessionID|...
     */
    const buf = Loader.cgiBuffer(
      Loader.SAVEHERO,
      `${this.name}|${this.sessionID}\n${this.hero!.toString()}`
    );
    if (!buf.isError()) {
      return true;
    }
    Player.err = 2;
    Player.errMessage = buf.line();
    return false;
  }

  saveScore(): void {
    Loader.cgi(
      Loader.SAVESCORE,
      `${this.name}|${this.sessionID}\n${this.hero!.rankString()}\n`
    );
  }

  tryToExit(from: Screen, loc: string, cost: number): Screen {
    return new arExit(from, loc);
  }

  errorScreen(from: Screen): Screen {
  const msg = `Error #${Player.err} Has Occurred\n`;
  switch (Player.err) {
    case 0:
      return null;
    case 1:
      return new arNotice(
        from,
        `${msg}\nServer Not Responding.\nPlease Try Again Later.`
      );
    case 2:
      return new arNotice(
        from,
        `${msg}\nServer Reports This Problem:\n${Player.errMessage}`
      );
    case 3:
      return new arNotice(
        from,
        `${msg}Bad Hero Record for: ${this.name}\nIf this persists, contact the game manager.`
      );
    default:
      return new arError(`Unknown Error=${Player.err}\nOkay, I'm scared...`);
  }
}
}