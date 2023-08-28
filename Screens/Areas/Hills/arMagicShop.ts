class arMagicShop extends Trade {
  static greeting = [
    null,
    "Greetings Master",
    "You Wish is My Command",
    "How May I Serve Thee?",
    "Do Not Anger Me",
    "Seek and Ye Shall Find",
    "Try Blinding Trolls",
    "Seltzer Cleans Dust",
    "Never Ask A Girls Age"
  ];
  static stock = [
    "Identify Scroll",
    "Glow Scroll",
    GearTypes.SALVE,
    GearTypes.SELTZER,
    GearTypes.PANIC_DUST,
    "Gold Apple",
    GearTypes.BLIND_DUST,
    "Bless Scroll",
    "Luck Scroll",
    "Enchant Scroll",
    "Flame Scroll",
    "Faceless Potion"
  ];

  constructor(from: Screen) {
    super(from, "Djinni's Ethereal Magic Shop");
    this.setShopValues(55, 22);
  }

  getFace(): string {
    return "Faces/Djinni.jpg";
  }

  getGreeting(): string {
    const msg = Tools.select(arMagicShop.greeting);
    return msg == null
        ? `${Screen.getBest()} Is Dreeeamy*`
        : msg;
  }

  getStockList(): string[] {
    return arMagicShop.stock;
  }

  getBuyList(): itList {
    const list = GearTable.findList("Buy", 6);
    list.merge(GearTable.findList("", 7));
    return list;
  }

  getSpecial(): string | null {
    return null;
  }

  doSpecial(): void {
    // Define doSpecial method
  }

  costSpecial(): number {
    return 0;
  }

  stockValue(it: Item): number {
    return stockValue(it) * 2;
  }
}
