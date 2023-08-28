import { ArmsTrait } from './DCourt/Static/ArmsTrait';
import { GameStrings } from './DCourt/Static/GameStrings';
import { Tools } from './DCourt/Tools/Tools';
import { Portrait } from './DCourt/Components/Portrait';
import { itArms } from './DCourt/Items/List/itArms';
import { itHero } from './DCourt/Items/List/itHero';
import { itMonster } from './DCourt/Items/List/itMonster';
import { itList } from './DCourt/Items/itList';
import { arStatus } from './DCourt/Screens/Utility/arStatus';
import { StaticLayout } from './DCourt/Tools/StaticLayout';
import { Graphics, Image, Panel } from 'java.awt';
import { Vector } from 'java.util';

/* loaded from: DCourt.jar:DCourt/Screens/Screen.class */
export abstract class Screen extends Panel implements GameStrings, ArmsTrait {
  private static offscreen: Image | null = null;
  private title: string;
  private status: boolean;
  private home: Screen | null;
  private pics: Vector<Portrait> | null;

  constructor(from?: Screen, name: string = "Default Screen") {
    super();
    console.log(`Screen: ${name}`);
    this.setLayout(new StaticLayout());
    this.home = from || null;
    this.status = true;
    this.title = name;
    this.pics = null;
    this.createTools();
    this.reshape(0, 0, Tools.DEFAULT_WIDTH, Tools.DEFAULT_HEIGHT);
    this.setFont(Tools.courtF);
  }

  toString(): string {
    return this.title;
  }

  init(): void {
    this.removeAll();
    this.addTools();
    if (this.pics !== null) {
      for (let ix = 0; ix < this.pics.size(); ix++) {
        this.add(this.pics.elementAt(ix));
      }
    }
    if (this.status) {
      this.add(Tools.statusPic);
    }
  }

  questInit(): void {
    this.getHero().tryToLevel(this);
  }

  repaint(): void {
    super.repaint();
    if (this.status) {
      Tools.statusPic.repaint();
    }
    if (Tools.getJvmVersion() >= 2) {
      this.validate();
    }
  }

  update(g: Graphics): void {
    this.paint(g);
  }

  paint(g: Graphics): void {
    if (Screen.offscreen === null) {
      Screen.offscreen = this.createImage(Tools.DEFAULT_WIDTH, Tools.DEFAULT_HEIGHT);
    }
    const og: Graphics = Screen.offscreen.getGraphics();
    og.setColor(this.getBackground());
    og.fillRect(0, 0, this.bounds().width, this.bounds().height);
    this.localPaint(og);
    g.drawImage(Screen.offscreen, 0, 0, this);
    this.paintComponents(g);
  }

  localPaint(g: Graphics): void {
    g.setFont(Tools.courtF);
    g.setColor(this.getForeground());
    g.drawString(this.title, 10, 20);
  }

  static getPlayer(): Player {
    return Tools.getPlayer();
  }

  static tryToExit(where: Screen, loc: string, cost: number): Screen {
    return getPlayer().tryToExit(where, loc, cost);
  }

  static getSessionID(): number {
    return getPlayer().getSessionID();
  }

  static getBest(): string {
    return getPlayer().getBest();
  }

  static getLeader(): string {
    return getPlayer().getLeader();
  }

  static getState(): string {
    return this.getHero().getState();
  }

  static setState(val: string): void {
    this.getHero().setState(val);
  }

  static saveHero(): boolean {
    return getPlayer().saveHero();
  }

  static getHero(): itHero {
    return Tools.getHero();
  }

  static getGuts(): number {
    return this.getHero().getGuts();
  }

  static getWits(): number {
    return this.getHero().getWits();
  }

  static getCharm(): number {
    return this.getHero().getCharm();
  }

  static getQuests(): number {
    return this.getHero().getQuests();
  }

  static getLevel(): number {
    return this.getHero().getLevel();
  }

  static getSocial(): number {
    return this.getHero().getSocial();
  }

  static getPlace(): string {
    return this.getHero().getPlace();
  }

  static setPlace(val: string): void {
    this.getHero().setPlace(val);
  }

  static getActions(): itList {
    return this.getHero().getActions();
  }

  static getGear(): itList {
    return this.getHero().getGear();
  }

  static getStatus(): itList {
    return this.getHero().getStatus();
  }

  static getPack(): itList {
    return this.getHero().getPack();
  }

  static getStore(): itList {
    return this.getHero().getStore();
  }

  static packCount(): number {
    return this.getHero().packCount();
  }

  static packCount(it: Item): number {
    return this.packCount(it.getName());
  }

  static packCount(id: string): number {
    return this.getHero().packCount(id);
  }

  static hasTrait(val: string): boolean {
    return this.getHero().hasTrait(val);
  }

  static findGearTrait(val: string): itArms | null {
    return this.getHero().findGearTrait(val);
  }

  static getMoney(): number {
    return this.getHero().getMoney();
  }

  static addMoney(val: number): number {
    return this.getHero().addMoney(val);
  }

  static subMoney(val: number): number {
    return this.getHero().subMoney(val);
  }

  static addFatigue(val: number): number {
    return this.getHero().addFatigue(val);
  }

  static subFatigue(val: number): number {
    return this.getHero().subFatigue(val);
  }

  static addPack(id: string, num: number): number {
    if (!GearTable.find(id)) {
      return 0;
    }
    return this.getHero().addPack(id, num);
  }

  static addPack(it: Item): void {
    if (GearTable.find(it)) {
      this.getHero().addPack(it);
    }
  }

  static putPack(it: Item): void {
    if (GearTable.find(it)) {
      this.getHero().putPack(it);
    }
  }

  static subPack(id: string, num: number): number {
    return this.getHero().subPack(id, num);
  }

  static subPack(it: Item): void {
    this.getHero().subPack(it);
  }

  static selectPack(ix: number): Item | null {
    return this.getHero().selectPack(ix);
  }

  static firstPack(id: string): number {
    return this.getHero().firstPack(id);
  }

  static indexPack(it: Item): number {
    return this.getHero().indexPack(it);
  }

    hideStatusBar(): void {
    this.status = false;
  }

  static findBeast(key: string): itMonster | null {
    return MonsterTable.find(key);
  }

  getTitle(): string {
    return this.title;
  }

  getHome(): Screen | null {
    return this.home;
  }

  setHome(next: Screen): void {
    this.home = next;
  }

  addPic(pic: Portrait): void {
    if (this.pics === null) {
      this.pics = new Vector<Portrait>();
    }
    this.pics.addElement(pic);
  }

  getPic(ix: number): Portrait | null {
    if (this.pics === null || ix < 0 || ix >= this.pics.size()) {
      return null;
    }
    return this.pics.elementAt(ix);
  }

  getPic(obj: any): number {
    for (let ix = 0; ix < this.pics.size(); ix++) {
      if (this.getPic(ix) === obj) {
        return ix;
      }
    }
    return -1;
  }

  createTools(): void {}

  addTools(): void {}

  action(e: any, o: any): boolean {
    /* ??? */
    if (e.target !== Tools.statusPic) {
      return true;
    }
    Tools.setRegion(new arStatus(this));
    return true;
  }

  mouseDown(e: any, x: number, y: number): boolean {
    const next: Screen | null = this.down(x, y);
    if (next === null) {
      this.postEvent(new Event(this, 1001, null));
      return true;
    }
    Tools.setRegion(next);
    return true;
  }

  down(x: number, y: number): Screen | null {
    return null;
  }

  updatePack(): void {}

  static packString(entry: string, list: itList): string {
    let msg: string = entry + "\n";
    if (list.getCount() < 1) {
      return "";
    }
    for (let ix = 0; ix < list.getCount(); ix++) {
      msg += `     ${list.select(ix).toLoot()}\n`;
    }
    return msg;
  }
}
