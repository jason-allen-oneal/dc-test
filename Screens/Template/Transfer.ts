class Transfer extends Screen {
  exit: Button;
  transfer: Button;
  plist: FTextList;
  slist: FTextList;
  scroll: FScrollbar;
  limit: number;
  purse: itList;
  stash: itList;
  static readonly TRANSFER: string = "Transfer";

  constructor(from: Screen, name: string) {
    super(from, name);
  }

  setValues(limit: number, purse: itList, stash: itList): void {
    this.limit = limit;
    this.purse = purse;
    this.stash = stash;
  }

  getLimit(): number {
    return this.limit;
  }

  stashCount(): number {
    if (this.stash === null) {
      return 0;
    }
    return this.stash.getCount();
  }

  getStash(): itList {
    return this.stash;
  }

  clrStash(): void {
    this.stash.clrQueue();
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.exit) {
      this.goHome();
    } else if (e.target === this.transfer) {
      this.transferItems();
    } else if (e.target === this.plist) {
      this.purseSelect();
    } else if (e.target === this.slist) {
      this.stashSelect();
    }
    this.repaint();
    return super.action(e, o);
  }

  goHome(): void {
    Tools.setRegion(this.getHome());
  }

  createTools(): void {
    this.exit = new Button("Exit");
    this.exit.reshape(340, 5, 50, 20);
    this.exit.setFont(Tools.textF);
    this.transfer = new Button("Transfer 0");
    this.transfer.reshape(5, 28, 115, 20);
    this.transfer.setFont(Tools.textF);
    this.transfer.enable(false);
    this.plist = new FTextList();
    this.plist.reshape(5, 70, 190, 190);
    this.slist = new FTextList();
    this.slist.reshape(205, 70, 190, 190);
    this.scroll = new FScrollbar();
    this.scroll.reshape(125, 30, 270, 16);
  }

  addTools(): void {
    this.add(this.exit);
    this.add(this.transfer);
    this.add(this.plist);
    this.add(this.slist);
    this.add(this.scroll);
    this.purseList(null);
    this.stashList(null);
  }

  updateTools(): void {
    this.transfer.enable(this.plist.getSelect() >= 0 || this.slist.getSelect() >= 0);
    this.transfer.setLabel(Transfer.TRANSFER + this.scroll.getVal());
  }

  purseList(find: string): void {
    this.purseList(this.purse.find(Tools.truncate(find)));
  }

  purseList(find: Item): void {
    let select = -1;
    this.plist.clear();
    for (let ix = 0; ix < this.purse.getCount(); ix++) {
      let it = this.purse.select(ix);
      this.plist.addItem(it.toShow());
      if (it === find) {
        select = ix;
      }
    }
    this.plist.setSelect(select);
  }

  stashList(find: string): void {
    this.purseList(this.stash.find(Tools.truncate(find)));
  }

  stashList(find: Item): void {
    let select = -1;
    this.slist.clear();
    for (let ix = 0; ix < this.stash.getCount(); ix++) {
      let it = this.stash.select(ix);
      this.slist.addItem(it.toShow());
      if (it === find) {
        select = ix;
      }
    }
    this.slist.setSelect(select);
  }

  purseSelect(): void {
    this.slist.setSelect(-1);
    this.transfer.enable(false);
    let ix = this.plist.getSelect();
    if (ix < 0 || this.purse.select(ix) === null) {
      return;
    }
    let it = this.purse.select(ix);
    if (it.getCount() > 1) {
      this.prepareTransfer(it);
      return;
    }
    this.packToStash(it, ix, 1);
    this.scroll.setMax(0);
  }

  stashSelect(): void {
    this.plist.setSelect(-1);
    this.transfer.enable(false);
    let ix = this.slist.getSelect();
    if (ix < 0 || this.stash.select(ix) === null) {
      return;
    }
    let it = this.stash.select(ix);
    if (it.getCount() > 1) {
      this.prepareTransfer(it);
      return;
    }
    this.stashToPack(it, ix, 1);
    this.scroll.setMax(0);
  }

  prepareTransfer(it: Item): void {
    if (it !== null) {
      let val = it.getCount();
      this.scroll.setMax(val);
      this.scroll.setVal(val);
      this.transfer.setLabel(Transfer.TRANSFER + val);
      this.transfer.enable(true);
    }
  }

  transferItems(): void {
    let count = this.scroll.getVal();
    if (count >= 1) {
      let pix = this.plist.getSelect();
      if (pix >= 0) {
        this.packToStash(pix, count);
      }
      let six = this.slist.getSelect();
      if (six >= 0) {
        this.stashToPack(six, count);
      }
    }
  }

  packToStash(pix: number, count: number): void {
    let it = this.purse.select(pix);
    if (it !== null) {
      this.packToStash(it, pix, count);
    }
  }

  packToStash(it: Item, pix: number, count: number): void {
    let delSlot = true;
    let newSlot = true;
    let id = null;
    let six = 0;
    if (!(it instanceof itValue)) {
      if (it instanceof itCount) {
        id = it.getName();
        delSlot = count >= it.getCount();
        six = this.stash.firstOf(id);
        newSlot = six < 0;
        if (!newSlot || this.limit <= 0 || this.stash.getCount() < this.limit) {
          this.stash.add(id, this.purse.sub(id, count));
        } else {
          return;
        }
      } else if (this.limit <= 0 || this.stash.getCount() < this.limit) {
        this.purse.drop(it);
        this.stash.insert(it);
      } else {
        return;
      }
      if (delSlot) {
        this.plist.delItem(pix);
      } else {
        this.plist.setItem(this.purse.find(id).toShow(), pix);
      }
      this.plist.setSelect(-1);
      if (newSlot) {
        this.slist.addItem(this.stash.select(0).toShow(), 0);
      } else {
        this.slist.setItem(this.stash.find(id).toShow(), six);
      }
      this.transfer.enable(false);
      this.scroll.setMax(0);
    }
  }

  stashToPack(six: number, count: number): void {
    let it = this.stash.select(six);
    if (it !== null) {
      this.stashToPack(it, six, count);
    }
  }

  stashToPack(it: Item, six: number, count: number): void {
    let delSlot = true;
    let newSlot = true;
    let id = null;
    let pix = 0;
    if (!(it instanceof itValue)) {
      if (!(it instanceof itCount)) {
        this.stash.drop(it);
        this.purse.insert(it);
      } else {
        id = it.getName();
        delSlot = count >= it.getCount();
        pix = this.purse.firstOf(id);
        newSlot = pix < 0;
        this.purse.add(id, this.stash.sub(id, count));
      }
      if (delSlot) {
        this.slist.delItem(six);
      } else {
        this.slist.setItem(this.stash.find(id).toShow(), six);
      }
      this.slist.setSelect(-1);
      if (newSlot) {
        this.plist.addItem(this.purse.select(0).toShow(), 0);
      } else {
        this.plist.setItem(this.purse.find(id).toShow(), pix);
      }
      this.transfer.enable(false);
      this.scroll.setMax(0);
    }
  }
}

