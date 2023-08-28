class Tools {
  static papa: DCourtApplet;
  static resourceTable: Map<string, any>;
  static rand: Random;
  static today: string;
  static inBrowser: boolean;
  static jvmVersion: number;
  static version: string;
  static player: Player;
  static places: PlaceTable;
  static monsters: MonsterTable;
  static gear: GearTable;
  static arms: ArmsTable;
  static statusPic: StatusPic;
  static courtF: Font;
  static questF: Font;
  static statusF: Font;
  static fightF: Font;
  static fieldF: Font;
  static boldF: Font;
  static textF: Font;
  static bigF: Font;
  static giantF: Font;
  static ranks: Buffer;
  static DEFAULT_WIDTH = 400;
  static DEFAULT_HEIGHT = 300;
  static lastWho = "not";
  static primeFont: string | null = null;
  static find = ["TimesRoman", "Serif", "SansSerif", "Helvitica", "Dialog"];

  constructor(who: DCourtApplet) {
    Tools.papa = who;
    Tools.fixJvmVersion();
    Tools.chooseFont();
    Tools.prepareFonts();
    Tools.resourceTable = new Map();
    Tools.rand = new Random(System.currentTimeMillis());
  }

  static isLoading(stage: number): boolean {
    switch (stage) {
      case 0:
        Tools.loadImage("Splash.jpg");
        return true;
      case 1:
        Tools.loadImage("Faces/Hero.jpg");
        Tools.statusPic = new StatusPic();
        return true;
      case 2:
        Tools.places = new PlaceTable();
        return true;
      case 3:
        Tools.gear = new GearTable();
        return true;
      case 4:
        Tools.arms = new ArmsTable();
        return true;
      case 5:
        Tools.player = new Player();
        return true;
      case 6:
        Tools.monsters = new MonsterTable();
        return true;
      default:
        return MonsterTable.isLoading();
    }
  }

  static prepareFonts(): void {
    Tools.courtF = new Font(Tools.primeFont, Font.ITALIC + Font.BOLD, 14);
    Tools.questF = new Font(Tools.primeFont, Font.ITALIC, 14);
    Tools.statusF = new Font(Tools.primeFont, 0, 18);
    Tools.fieldF = new Font(Tools.primeFont, Font.ITALIC + Font.BOLD, 16);
    Tools.fightF = new Font(Tools.primeFont, 0, 16);
    Tools.boldF = new Font(Tools.primeFont, Font.BOLD, 14);
    Tools.textF = new Font(Tools.primeFont, 0, 14);
    Tools.bigF = new Font(Tools.primeFont, Font.BOLD, 36);
    Tools.giantF = new Font(Tools.primeFont, Font.BOLD, 75);
  }

  static getJvmVersion(): number {
    return Tools.jvmVersion;
  }

  static fixJvmVersion(): void {
    const vers: string = System.getProperty("java.version");
    if (vers.startsWith("1.0")) {
      Tools.jvmVersion = 0;
    } else if (vers.startsWith("1.1")) {
      Tools.jvmVersion = 1;
    } else if (vers.startsWith("1.2")) {
      Tools.jvmVersion = 2;
    } else if (vers.startsWith("1.3")) {
      Tools.jvmVersion = 3;
    } else {
      Tools.jvmVersion = 4;
    }
    console.log(`JVM version ${vers}  game=[${Tools.jvmVersion}]`);
  }

  static setRegion(next: Screen): void {
    Tools.papa.setRegion(next);
  }

  static getRegion(): Screen {
    return Tools.papa.getRegion();
  }

  static movedAway(test: Screen): boolean {
    return test !== Tools.papa.getRegion();
  }

  static repaint(): void {
    if (Tools.papa.getRegion() !== null) {
      Tools.papa.getRegion().repaint();
    }
  }

  static getToday(): string {
    return Tools.today;
  }

  static setToday(val: string): void {
    Tools.today = val;
  }

  static isPlaytest(): boolean {
    return Tools.papa.isPlaytest();
  }

  static getCgibin(): string {
    return Tools.papa.getCgibin();
  }

  static getConfig(): string {
    return Tools.papa.getConfig();
  }

  static getPlaceTable(): PlaceTable {
    return Tools.places;
  }

  static getPlayer(): Player {
    return Tools.player;
  }

  static getBest(): string {
    return Tools.player.getBest();
  }

  static getHero(): itHero {
    return Tools.player.getHero();
  }

  static setHeroPlace(val: string): void {
    Tools.getHero().setPlace(val);
  }

  static getHeroPlace(): string {
    return Tools.getHero().getPlace();
  }

  static setHeroState(val: string): void {
    Tools.getHero().setState(val);
  }

  static getHeroState(): string {
    return Tools.getHero().getState();
  }

  static loadImage(path: string): Image | null {
    let tmp: Image;
    const artpath = Tools.papa.getArtpath();
    if (path == null) {
      console.log("getArtpath() returned null");
      return null;
    }
    const tmp2 = Tools.findResource(path);
    if (tmp2 != null) {
      return tmp2;
    }
    if (!Tools.papa.isInBrowser()) {
      tmp = Tools.papa.getToolkit().getImage(`${artpath}/${path}`);
    } else {
      try {
        tmp = Tools.papa.getToolkit().getImage(new URL(`${artpath}/${path}`));
      } catch (e) {
        console.log(`Failed to retrieve ${path}`);
        return null;
      }
    }
    Tools.storeResource(path, tmp);
    return tmp;
  }
  
  static storeResource(path: string, item: Image | null): void {
    Tools.resourceTable.set(path, item);
  }

  static findResource(path: string): Image | null {
    return Tools.resourceTable.get(path) as Image | null;
  }

  static replaceResource(path: string, item: Image | null): void {
    Tools.resourceTable.delete(path);
    Tools.resourceTable.set(path, item);
  }

  static dropDocumentResources(): void {
    const e = Tools.resourceTable.keys();
    for (const path of e) {
      if (path.endsWith(".doc")) {
        Tools.resourceTable.delete(path);
      }
    }
  }

  static getRankings(): Buffer {
    const who = Tools.getHero() == null ? "not" : Tools.getHero().getName();
    if (Tools.ranks == null || !Tools.lastWho.equalsIgnoreCase(who)) {
      Tools.ranks = Loader.cgiBuffer(Loader.READRANK, who);
    }
    Tools.lastWho = who;
    Tools.ranks.reset();
    return Tools.ranks;
  }

  static setSeed(val: number): void {
    Tools.rand.setSeed(val);
  }

  static nextInt(): number {
    return Tools.rand.nextInt();
  }

  static twice(value: number): number {
    return Tools.roll(value) + Tools.roll(value);
  }

  static contest(a: number, b: number): boolean {
    return Tools.roll(a + b) < a;
  }

  static percent(value: number): boolean {
    return Tools.roll(100) < value;
  }

  static chance(value: number): boolean {
    return Tools.roll(value) === 0;
  }

  static select<T>(list: T[]): T {
    return list[Tools.roll(list.length)];
  }

  static roll(value: number): number {
    if (value < 1) {
      return 0;
    }
    let num = Tools.rand.nextInt();
    if (num < 0) {
      num = -num;
    }
    return num % value;
  }
  
  static fourTest(a: number, b: number): number {
    const test = a + b;
    let num = 0;
    if (Tools.roll(test) < a) {
      num++;
    }
    if (Tools.roll(test) < a) {
      num++;
    }
    if (Tools.roll(test) < a) {
      num++;
    }
    if (Tools.roll(test) < a) {
      num++;
    }
    return num;
  }

  static spread(value: number): number {
    const min = (value * 5) / 7;
    return 1 + min + Tools.twice(value - min);
  }

  static percent(s: string): boolean {
    try {
      return Tools.percent(parseInt(s));
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }

  static skew(value: number): number {
    let sum = 0;
    while (Tools.percent(value)) {
      sum++;
    }
    return sum;
  }

  static truncate(id: string | null): string | null {
    if (id === null) {
      return null;
    }
    const ix = id.indexOf("[");
    if (ix > 0) {
      return id.substring(0, ix);
    }
    const ix2 = id.indexOf("$");
    return ix2 < 1 ? id : id.substring(0, ix2 - 1);
  }

  static detokenize(msg: string): string {
    return msg.replace('{', '(').replace('|', ':').replace('}', ')');
  }

  public static chooseFont(): void {
    const list: string[] = papa.getToolkit().getFontList();
    let i = 0;
    let j = 0;
    while (i < find.length) {
      j = 0;
      while (j < list.length && !find[i].equalsIgnoreCase(list[j])) {
        j++;
      }
      if (j < list.length) {
        break;
      }
      i++;
    }
    if (j === list.length) {
      j = 0;
    }
    primeFont = list[j];
  }
}
