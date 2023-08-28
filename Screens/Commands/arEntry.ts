import { Screen } from './Screen'; // Import the necessary classes and modules

class arEntry extends Screen {
  nameTXF: FTextField;
  passTXF: FTextField;
  lists: Button;
  credits: Button;
  splash: Image;

  constructor() {
    super("Title Screen");
    this.splash = null;
    this.setBackground(new Color(0, 128, 0));
    this.setForeground(Color.white);
    this.setFont(Tools.textF);
    this.hideStatusBar();
    this.splash = Tools.loadImage("Splash.jpg");
    this.createTools();
    this.addTools();
  }

  localPaint(g: Graphics): void {
    g.setColor(new Color(255, 64, 0));
    g.setFont(Tools.giantF);
    g.drawString("Dragon", 80, 100);
    g.drawString(court, 100, 180);
    if (this.splash != null) {
      g.drawImage(this.splash, 0, 0, (int) Tools.DEFAULT_WIDTH, (int) Tools.DEFAULT_HEIGHT, this);
    }
    g.setColor(Color.white);
    g.setFont(Tools.textF);
    FontMetrics fm = getFontMetrics(g.getFont());
    int val = 5 + fm.getAscent();
    g.drawString(copyright, 5, val);
    g.drawString(homepage, (Tools.DEFAULT_WIDTH - fm.stringWidth(homepage)) - 5, val);
    g.setColor(new Color(50, 200, 200));
    g.setFont(Tools.statusF);
    FontMetrics fm2 = getFontMetrics(g.getFont());
    g.drawString(welcome, (Tools.DEFAULT_WIDTH - fm2.stringWidth(welcome)) / 2, 45);
    g.drawString(guard, (Tools.DEFAULT_WIDTH - fm2.stringWidth(guard)) / 2, 205);
    g.setColor(getForeground());
    g.setFont(getFont());
    int val2 = getFontMetrics(getFont()).getAscent();
    g.drawString("Hero Name", 25, 232 + val2);
    g.drawString("Password", 28, 262 + val2);
  }

  actionPerformed(e: ActionEvent): void {
    if (Tools.movedAway(this)) {
      return;
    }
    if (e.getSource() === this.lists) {
      Tools.setRegion(new arRanking(this));
    }
    if (e.getSource() === this.credits) {
      Tools.setRegion(new arNotice(this, GameStrings.creditText));
    }
  }

  mouseClicked(e: MouseEvent): void {
    if (e.getSource() === getPic(0)) {
      Tools.setRegion(EnterGame());
    }
  }

  keyPressed(e: KeyEvent): void {
    getPic(0).show(testNames());
  }

  EnterGame(): Screen {
    let a = 0;
    console.log("EnterGame: " + a);
    a += 1;
    let name = scoreString(this.nameTXF.getText());
    let pass = scoreString(this.passTXF.getText());
    console.log("EnterGame: " + a);
    a += 1;
    let player = Tools.getPlayer();
    console.log("EnterGame: " + a);
    a += 1;
    if (!player.loadHero(name, pass)) {
      console.log("error loadHero EnterGame: " + a);
      a += 1;
      return player.errorScreen(this);
    }
    console.log("EnterGame: " + a);
    a += 1;
    if (player.getHero() == null) {
      console.log("error getHero EnterGame: " + a);
      a += 1;
      return new arCreate(player);
    }
    console.log("EnterGame: " + a);
    a += 1;
    if (player.isDead()) {
      console.log("Dead EnterGame: " + a);
      a += 1;
      return new arNotice(this, GameStrings.heroHasDied);
    }
    console.log("EnterGame: " + a);
    a += 1;
    let lot = Tools.getPlaceTable();
    lot.select(player.getPlace());
    let next = lot.getLaunch();
    if (next == null) {
      next = this;
    }
    let next2 = heroAwakens(lot.getDecay(), lot.getUse(), lot.getAwake(), next);
    return player.needsBuild() ? new arBuild(next2) : next2;
  }

    heroAwakens(dcy: number, use: string, msg: string, after: Screen): Screen {
    const hero = Tools.getHero();
    let result = msg;

    if (use.indexOf("b") >= 0 && hero.packCount("Sleeping Bag") > 0) {
      dcy++;
    }
    if (use.indexOf("c") >= 0 && hero.packCount("Cooking Gear") > 0) {
      dcy++;
    }
    if (use.indexOf("t") >= 0 && hero.packCount("Camp Tent") > 0) {
      dcy++;
    }

    if (hero.isNewday()) {
      if (use.indexOf("s") >= 0) {
        result = `${result}\n${this.heroStipend(hero)}`;
      }
      result = `${result}\n${this.diseaseHero(hero, dcy)}`;
      result = `${result}\n${this.injureHero(hero, dcy)}`;
      result = `${result}\n${this.exhaustHero(hero, dcy)}`;
      result = `${result}\n${this.heroDecay(hero, dcy)}`;
    }

    if (hero.getOverload() > 0) {
      result = `${result}\n*** YOUR PACK IS OVERLOADED ***\n`;
    }

    return new arNotice(after, result);
  }

  createTools(): void {
    const entryC = new Color(64, 128, 64);
    addPic(new Portrait("fldQuest.jpg", "Enter Here", 235, 215, 96, 64));
    getPic(0).setForeground(Color.white);
        getPic(0).show(false);
    getPic(0).addMouseListener(this);

    this.nameTXF = new FTextField(15);
    this.nameTXF.setBackground(entryC);
    this.nameTXF.setForeground(Color.black);
    this.nameTXF.reshape(100, 230, 120, 22);
    this.nameTXF.addKeyListener(this);

    this.passTXF = new FTextField(15);
    this.passTXF.setEchoCharacter('*');
    this.passTXF.setBackground(entryC);
    this.passTXF.setForeground(Color.black);
    this.passTXF.reshape(100, 260, 120, 22);
    this.passTXF.addKeyListener(this);

    /* for Debug */
    this.nameTXF.setText("murlock42");
    this.passTXF.setText("secret");
    getPic(0).show(true);

    this.lists = new Button("Lists");
    this.lists.reshape(340, 232, 55, 20);
    this.lists.addActionListener(this);

    this.credits = new Button("Credits");
    this.credits.reshape(340, 262, 55, 20);
    this.credits.addActionListener(this);
  }

  addTools(): void {
    this.add(this.nameTXF);
    this.add(this.passTXF);
    this.add(this.lists);
    this.add(this.credits);
  }

  testNames(): boolean {
    return this.nameTXF.getText().length >= 4 && this.passTXF.getText().length >= 4;
  }

  scoreString(msg: string): string {
    let buf = "";
    let msg2 = Tools.detokenize(msg);
    let len = msg2.length;
    let tlen = msg2.trim().length;
    let ix = 0;
    let c;
    while (ix < len && (c = msg2.charAt(ix)) >= 0 && c <= ' ') {
      buf = String.valueOf(String.valueOf(buf)).concat("_");
      ix++;
    }
    let tlen2 = tlen + ix;
    while (ix < tlen2) {
      buf =
        String.valueOf(String.valueOf(buf))
        .concat(String.valueOf(String.valueOf(msg2.charAt(ix))));
      ix++;
    }
    while (ix < len) {
      buf = String.valueOf(String.valueOf(buf)).concat("_");
      ix++;
    }
    return buf;
  }

    diseaseHero(h: itHero, rate: number): string {
    let msg: string = "";

    if (Tools.roll(rate) > 0) {
      return msg;
    }

    if (rate >= arEntry.sick.length) {
      msg = `${msg}${arEntry.sniffle}`;
    } else {
      msg = `${msg}\t${arEntry.sick[rate]}`;
    }

    if (h.fight() >= 1) {
      return `${msg}${arEntry.warriorSniffle}`;
    }

    h.ail(Math.floor(h.getSkill() / rate));
    return `${msg}\n`;
  }


    injureHero(h: itHero, rate: number): string {
    let msg: string = "";

    if (Tools.roll(rate) > 0) {
      return msg;
    }

    if (rate >= arEntry.injure.length) {
      msg = `${msg}${arEntry.cramp}`;
    } else {
      msg = `${msg}\t${arEntry.injure[rate]}`;
    }

    if (h.fight() >= 2) {
      return `${msg}${arEntry.warriorCramp}`;
    }

    h.addWounds(Math.floor(h.getGuts() / rate) - 1);
    return `${msg}\n`;
  }


    exhaustHero(h: itHero, rate: number): string {
    let msg: string = "";

    if (Tools.roll(rate) > 0) {
      return msg;
    }

    if (rate >= arEntry.tired.length) {
      msg = `${msg}${arEntry.sleepLate}`;
    } else {
      msg = `${msg}\t${arEntry.tired[rate]}`;
    }

    if (h.fight() >= 3) {
      return `${msg}${arEntry.warriorRise}`;
    }

    h.addFatigue(Math.floor(h.getBaseQuests() / (rate + 1)) - 1);
    return `${msg}\n`;
  }


    heroDecay(h: itHero, rate: number): string {
    let decay: boolean = false;
    let msg: string = "";
    const rate2: number = (rate + h.fight()) * 5;

    if (Screen.getGear().decay(rate2)) {
      decay = true;
    }

    if (Screen.getPack().decay(rate2)) {
      decay = true;
    }

    if (decay) {
      msg = `${msg}${arEntry.gearRust}`;
    }

    let decay2: boolean = false;

    if (Tools.roll(rate2) === 0 && Screen.subPack("Sleeping Bag", 1) === 1) {
      decay2 = true;
    }

    if (Tools.roll(rate2) === 0 && Screen.subPack("Cooking Gear", 1) === 1) {
      decay2 = true;
    }

    if (Tools.roll(rate2) === 0 && Screen.subPack("Camp Tent", 1) === 1) {
      decay2 = true;
    }

    if (decay2) {
      msg = `${msg}${arEntry.gearRot}`;
    }

    return msg.length > 0 ? `\n${msg}` : msg;
  }


    heroStipend(h: itHero): string {
    let num: number = h.getStatus().getCount(Constants.STIPEND);
    h.getStatus().zero(Constants.STIPEND);

    if (num < 1) {
      return "";
    }

    h.addMoney(num);
    return `${arEntry.stipendArrives}${num}\n`;
  }

}

