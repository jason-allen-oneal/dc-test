class Trade extends Shop {
  one: Button;
  ten: Button;
  hundred: Button;
  kilo: Button;

  constructor(from: Screen, title: string) {
    super(from, title);
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.one) {
      this.transact(1);
    }
    if (e.target === this.ten) {
      this.transact(10);
    }
    if (e.target === this.hundred) {
      this.transact(100);
    }
    if (e.target === this.kilo) {
      this.transact(1000);
    }
    this.repaint();
    return super.action(e, o);
  }

  createTools(): void {
    super.createTools();
    this.one = new Button("1");
    this.one.reshape(295, 50, 40, 20);
    this.one.setFont(Tools.textF);
    this.ten = new Button("10");
    this.ten.reshape(250, 50, 40, 20);
    this.ten.setFont(Tools.textF);
    this.hundred = new Button("100");
    this.hundred.reshape(205, 50, 40, 20);
    this.hundred.setFont(Tools.textF);
    this.kilo = new Button("1K");
    this.kilo.reshape(160, 50, 40, 20);
    this.kilo.setFont(Tools.textF);
  }

  addTools(): void {
    super.addTools();
    this.add(this.one);
    this.add(this.ten);
    this.add(this.hundred);
    this.add(this.kilo);
  }

  discardStock(it: Item): boolean {
    return it instanceof itArms;
  }

  discardPack(it: Item): boolean {
    return it instanceof itArms;
  }

  transact(num: number): void {
    Screen.getHero().clearDump();
    if (this.isPack()) {
      this.sellItem(num);
    } else {
      this.buyItem(num);
    }
  }
}
