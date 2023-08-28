import { Color } from 'java.awt';
import { Checkbox, CheckboxGroup, Event, Button } from 'java.awt';

import { FTextList } from 'DCourt.Components.FTextList';
import { Portrait } from 'DCourt.Components.Portrait';
import { GearTable } from 'DCourt.Control.GearTable';
import { Item } from 'DCourt.Items.Item';
import { itArms } from 'DCourt.Items.List.itArms';
import { itHero } from 'DCourt.Items.List.itHero';
import { itCount } from 'DCourt.Items.Token.itCount';
import { itList } from 'DCourt.Items.itList';
import { Screen } from 'DCourt.Screens.Screen';
import { arDetail } from 'DCourt.Screens.Utility.arDetail';
import { Constants } from 'DCourt.Static.Constants';
import { Tools } from 'DCourt.Tools.Tools';

/* loaded from: DCourt.jar:DCourt/Screens/Template/Shop.class */
export abstract class Shop extends Indoors {
  static readonly STOCK = 0;
  static readonly PACK = 1;
  static readonly TABLE_COLOR = new Color(64, 255, 192);

  RESALE: number;
  BASE: number;
  mode: number;
  sellList: itList;
  buyList: itList;
  packList: itList;
  box: Checkbox[];
  table: FTextList;
  group: CheckboxGroup;
  info: Button;
  special: Button | null;
  heroCharm: number = Screen.getHero().getCharm();
  lastSelect: Item | null = null;

  abstract getGreeting(): string;
  protected abstract getStockList(): string[];
  protected abstract discardStock(item: Item): boolean;
  protected abstract discardPack(item: Item): boolean;

  constructor(from: Screen, name: string) {
    super(from, name);
    this.mode = 0;
    this.mode = 0;
  }

  init(): void {
    super.init();
    this.shopList(this.lastSelect);
  }

  fixPicture(face: string): void {
    this.addPic(new Portrait('Exit.jpg', 320, 10, 64, 32));
    this.addPic(new Portrait(face, this.getGreeting(), 10, 30, 144, 192));
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    if (e.target === this.box[0]) {
      this.setMode(0);
    }
    if (e.target === this.box[1]) {
      this.setMode(1);
    }
    if (e.target === this.info) {
      this.shopInfo();
    }
    if (e.target === this.table) {
      this.lastSelect = this.shopFind();
    }
    this.updateTools();
    this.repaint();
    return super.action(e, o);
  }

  createTools(): void {
    this.table = new FTextList();
    this.table.reshape(162, 75, 230, 186);
    this.table.setFont(Tools.boldF);
    this.info = new Button('Info');
    this.info.reshape(110, 242, 40, 20);
    this.info.setFont(Tools.textF);
    this.group = new CheckboxGroup();
    this.box = new Array<Checkbox>(2);
    this.sellList = this.getSellList();
    this.buyList = this.getBuyList();
    this.packList = Screen.getPack();
    this.box[0] = new Checkbox('Buy', this.group, this.isStock());
    this.box[0].reshape(165, 28, 60, 20);
    this.box[0].setBackground(this.getBackground());
    this.box[1] = new Checkbox('Sell', this.group, this.isPack());
    this.box[1].reshape(240, 28, 60, 20);
    this.box[1].setBackground(this.getBackground());
    this.special = null;
    if (this.getSpecial() !== null) {
      this.special = new Button(`${this.getSpecial()} $${this.costSpecial()}`);
      this.special.setFont(Tools.textF);
      this.special.reshape(10, 242, 90, 20);
    }
  }

  addTools(): void {
    this.add(this.table);
    this.add(this.box[0]);
    this.add(this.box[1]);
    this.add(this.info);
    if (this.special !== null) {
      this.add(this.special);
    }
  }

  hideTools(which: number): void {
    this.table.show(which !== 2);
    this.box[0].show(which === 0);
    this.box[1].show(which === 0);
    this.info.show(which !== 2);
    if (this.special !== null) {
      this.special.show(which !== 2);
    }
  }

  updateTools(): void {
    if (this.special !== null) {
      const cost = this.costSpecial();
      this.special.setLabel(`${this.getSpecial()} $${cost}`);
      this.special.enable(cost !== 0 && Screen.getHero().getMoney() >= cost);
    }
  }

  setMode(val: number): void {
    this.mode = val;
    this.group.setCurrent(this.box[this.mode]);
    this.shopList(this.lastSelect);
  }

  getMode(): number {
    return this.mode;
  }

  isStock(): boolean {
    return this.mode === 0;
  }

  isPack(): boolean {
    return this.mode === 1;
  }

  getModeList(): itList {
    return this.isStock() ? this.sellList : this.packList;
  }

  getSpecial(): string | null {
    return null;
  }

  doSpecial(): void {}

  costSpecial(): number {
    return 0;
  }

  shopList(id: string): void {
    const list = this.getModeList();
    if (list !== null) {
      this.shopList(list.find(Tools.truncate(id)));
    }
  }

  shopList(find: Item | null): void {
    const list = this.getModeList();
    if (list !== null) {
      this.table.clear();
      let px = 0;
      let pick = -1;
      for (let ix = 0; ix < list.getCount(); ix++) {
        const it = list.select(ix);
        if (!this.discardItem(it)) {
          this.table.addItem(this.shopName(it));
          if (it === find) {
            pick = px;
          }
          px++;
        }
      }
      this.table.setSelect(pick);
      this.lastSelect = find;
    }
  }

  shopFind(): Item | null {
    let pick = this.table.getSelect();
    const list = this.getModeList();
    if (pick < 0) {
      return null;
    }
    for (let ix = 0; ix < list.getCount(); ix++) {
      const it = list.select(ix);
      if (!this.discardItem(it)) {
        pick--;
        if (pick < 0) {
          return it;
        }
      }
    }
    return null;
  }

    shopInfo(): void {
    const it = this.shopFind();
    if (it !== null) {
      Tools.setRegion(new arDetail(this, it));
    }
  }

  shopName(it: Item): string {
    const msg =
      it instanceof itArms
        ? it.toShow()
        : `${it.getName()}(${Screen.packCount(it)})`;
    return this.isPack()
      ? `${msg} $${this.packValue(it)}`
      : `${msg} $${this.stockValue(it)}`;
  }

  packValue(it: Item): number {
    const cost = this.stockValue(it);
    const cost2 = Screen.hasTrait(Constants.MERCHANT)
      ? (cost * this.RESALE) / 95
      : (cost * this.RESALE) / 100;
    return cost2 - ((cost2 * this.BASE) / ((2 * this.BASE) + this.heroCharm));
  }

  stockValue(it: Item): number {
    return GearTable.getCost(it);
  }

  protected getSellList(): itList {
    return this.createSellList(this.getStockList());
  }

  protected getBuyList(): itList | null {
    return null;
  }

  buyItem(num: number): void {
    const h = Screen.getHero();
    const it = this.shopFind();
    if (it !== null) {
      const cost = this.stockValue(it);
      let val = Math.floor(h.getMoney() / cost);
      if (num > val) {
        num = val;
      }
      const val2 = h.holdMax() - h.heroHas(it);
      if (num > val2) {
        num = val2;
      }
      if (num !== 0) {
        h.subMoney(cost * num);
        h.addPack(it.getName(), num);
        const ix = this.table.getSelect();
        if (num === val2) {
          this.table.delItem(ix);
          this.table.setSelect(-1);
          return;
        }
        this.table.setItem(this.shopName(it), ix);
      }
    }
  }

  sellItem(num: number): void {
    let num2: number;
    const h = Screen.getHero();
    const it = this.shopFind();
    if (it !== null) {
      const cost = this.packValue(it);
      const max = it.getCount();
      if (it instanceof itCount) {
        num2 = this.packList.sub(it.getName(), num);
      } else {
        num2 = 1;
        this.packList.drop(it);
      }
      h.addMoney(cost * num2);
      const ix = this.table.getSelect();
      if (num2 === max) {
        this.table.delItem(ix);
      } else {
        this.table.setItem(this.shopName(it), ix);
      }
    }
  }
}

