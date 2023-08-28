import { Portrait } from 'DCourt.Components.Portrait';
import { Player } from 'DCourt.Control.Player';
import { itAgent } from 'DCourt.Items.List.itAgent';
import { itHero } from 'DCourt.Items.List.itHero';
import { itCount } from 'DCourt.Items.Token.itCount';
import { Screen } from 'DCourt.Screens.Screen';
import { arField } from 'DCourt.Screens.Wilds.arField';
import { Constants } from 'DCourt.Static.Constants';
import { DrawTools } from 'DCourt.Tools.DrawTools';
import { Tools } from 'DCourt.Tools.Tools';
import { Color } from 'java.awt.Color';
import { Button } from 'java.awt.Button';
import { Checkbox } from 'java.awt.Checkbox';
import { Event } from 'java.awt.Event';
import { FontMetrics } from 'java.awt.FontMetrics';
import { Graphics } from 'java.awt.Graphics';
import { Rectangle } from 'java.awt.Rectangle';

class arCreate extends Screen {
  static sink: Rectangle[] = [
    new Rectangle(40, 80, 65, 40),
    new Rectangle(160, 80, 65, 40),
    new Rectangle(280, 80, 65, 40),
    new Rectangle(245, 160, 100, 40),
    new Rectangle(40, 240, 65, 40)
  ];
  static text: string[] = [
    Constants.GUTS, Constants.WITS, Constants.CHARM, "Money(1p=$25)", "Build Points"
  ];
  static traitStr: string[] = ["Noble", "Wizard", "Warrior", Constants.TRADER"];
  static traitCost: number[] = [12, 9, 8, 10];
  
  add: Button[] = [];
  sub: Button[] = [];
  traits: Checkbox[] = [];
  guts: itCount;
  wits: itCount;
  charm: itCount;
  money: itCount;
  who: Player;

  constructor(who: Player) {
    super("Hero Creation");
    this.who = who;
    this.setBackground(Color.blue);
    this.setForeground(Color.white);
    this.hideStatusBar();
    this.prepStats();
  }

  prepStats(): void {
    this.guts = new itCount("g", 4);
    this.wits = new itCount("w", 4);
    this.charm = new itCount("c", 4);
    this.money = new itCount("m", 1);
  }

  getBuild(): number {
    let build: number =
      (((20 - (this.guts.getCount() - 4)) - (this.wits.getCount() - 4))
        - (this.charm.getCount() - 4))
        - (this.money.getCount() - 1);
    for (let ix = 0; ix < 4; ix++) {
      if (this.traits[ix].getState()) {
        build -= arCreate.traitCost[ix];
      }
    }
    return build;
  }

  isNoble(): boolean {
    return this.traits[0].getState();
  }

  isMagic(): boolean {
    return this.traits[1].getState();
  }

  isFight(): boolean {
    return this.traits[2].getState();
  }

  isThief(): boolean {
    return this.traits[3].getState();
  }

  isGuild(): boolean {
    return this.isMagic() || this.isThief() || this.isFight();
  }

  update(g: Graphics): void {
    this.getPic(1).show(this.getBuild() == 0);
    this.update(g);
  }

  localPaint(g: Graphics): void {
    g.setFont(Tools.bigF);
    g.setColor(Color.green);
    DrawTools.center(
      g,
      (this.isNoble() ? "Knight " : "") + this.who.getName(),
      200,
      35
    );
    g.setFont(Tools.statusF);
    g.setColor(Color.yellow);
    for (let i = 0; i < arCreate.sink.length; i++) {
      g.drawString(arCreate.text[i], arCreate.sink[i].x, arCreate.sink[i].y - 10);
    }
    g.drawString("Options", 90, 150);
    this.drawNumSink(g, "" + this.guts.getCount(), arCreate.sink[0]);
    this.drawNumSink(g, "" + this.wits.getCount(), arCreate.sink[1]);
    this.drawNumSink(g, "" + this.charm.getCount(), arCreate.sink[2]);
    this.drawNumSink(g, "" + (this.money.getCount() * 25), arCreate.sink[3]);
    this.drawNumSink(g, "" + this.getBuild(), arCreate.sink[4]);
  }

  drawNumSink(g: Graphics, msg: string, r: Rectangle): void {
    const fm: FontMetrics = g.getFontMetrics(Tools.bigF);
    const dx: number = r.x + ((r.width - fm.stringWidth(msg)) / 2);
    const dy: number = r.y + (((r.height + fm.getAscent()) - 6) / 2);
    this.drawSink(g, r);
    g.setFont(Tools.bigF);
    g.setColor(Color.black);
    g.drawString(msg, dx + 2, dy + 2);
    g.setColor(new Color(255, 128, 0));
    g.drawString(msg, dx, dy);
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    for (let ix = 0; ix < this.add.length; ix++) {
      if (e.target === this.add[ix]) {
        this.raise(ix);
      }
      if (e.target === this.sub[ix]) {
        this.lower(ix);
      }
    }
    let ix2 = 0;
    while (true) {
      if (ix2 >= this.traits.length) {
        break;
      } else if (e.target != this.traits[ix2]) {
        ix2++;
      } else {
        this.traits[ix2].setState(this.traits[ix2].getState());
        if (this.traits[ix2].getState() && this.getBuild() < 0) {
          this.traits[ix2].setState(false);
        }
      }
    }
    if (e.target == this.getPic(0)) {
      Tools.setRegion(new arEntry());
    }
    if (e.target == this.getPic(1)) {
      Tools.setRegion(this.beginPlay());
    }
    this.repaint();
    return super.action(e, o);
  }

  createTools(): void {
    this.setFont(Tools.textF);
    this.addPic(new Portrait("Exit.jpg", 320, 240, 64, 32));
    this.addPic(new Portrait("fldQuest.jpg", "Enter Here", 180, 215, 96, 64));
    this.getPic(1).show(false);
    this.getPic(1).setForeground(Color.white);
    for (let i = 0; i < arCreate.sink.length - 1; i++) {
            this.add[i] = new Button("+");
      this.sub[i] = new Button("-");
      const r = arCreate.sink[i];
      this.add[i].reshape(r.x - 25, r.y, 20, 20);
      this.sub[i].reshape(r.x - 25, r.y + 20, 20, 20);
    }
    const traitLength = Math.min(arCreate.traitStr.length, arCreate.traitCost.length);
    this.traits = new Checkbox[traitLength];
    for (let i = 0; i < this.traits.length; i++) {
      this.traits[i] =
        new Checkbox(
          arCreate.traitStr[i] + ' ' + arCreate.traitCost[i] + 'p'
        );
      this.traits[i].setFont(Tools.textF);
      this.traits[i].setForeground(Color.white);
      this.traits[i].setBackground(Color.blue);
      this.traits[i].reshape(20 + ((i / 2) * 100), 160 + (25 * (i % 2)), 100, 20);
    }
  }

  addTools(): void {
    for (let i = 0; i < this.add.length; i++) {
      this.add(this.add[i]);
      this.add(this.sub[i]);
    }
    for (let i = 0; i < this.traits.length; i++) {
      this.add(this.traits[i]);
    }
  }

  raise(what: number): void {
    switch (what) {
      case 0:
        if (this.getBuild() > 0) {
          this.guts.adds(1);
        }
        break;
      case 1:
        if (this.getBuild() > 0) {
          this.wits.adds(1);
        }
        break;
      case 2:
        if (this.getBuild() > 0) {
          this.charm.adds(1);
        }
        break;
      case 3:
        if (this.getBuild() > 0) {
          this.money.adds(1);
        }
        break;
    }
  }

  lower(what: number): void {
    switch (what) {
      case 0:
        if (this.guts.getCount() > 4) {
          this.guts.adds(-1);
        }
        break;
      case 1:
        if (this.wits.getCount() > 4) {
          this.wits.adds(-1);
        }
        break;
      case 2:
        if (this.charm.getCount() > 4) {
          this.charm.adds(-1);
        }
        break;
      case 3:
        if (this.money.getCount() > 1) {
          this.money.adds(-1);
        }
        break;
    }
  }

  drawSink(g: Graphics, r: Rectangle): void {
    g.setColor(new Color(0, 255, 255));
    g.fillRect(r.x, r.y, r.width, r.height);
    g.setColor(new Color(0, 255, 128));
    g.drawRect(r.x - 1, r.y - 1, r.width + 1, r.height + 1);
    g.setColor(new Color(0, 192, 64));
    g.drawRect(r.x - 2, r.y - 2, r.width + 3, r.height + 3);
    g.setColor(new Color(0, 128, 64));
    g.drawRect(r.x - 3, r.y - 3, r.width + 5, r.height + 5);
  }

  beginPlay(): Screen {
    if (this.getBuild() !== 0) {
      return null;
    }
    this.createHero();
    return this.who.saveHero() ? new arField() : this.who.errorScreen(this);
  }

  createHero(): void {
    const hero: itHero = this.who.createHero();
    hero.setGuts(this.guts.getCount());
    hero.setWits(this.wits.getCount());
    hero.setCharm(this.charm.getCount());
    hero.getPack().clrQueue();
    hero.getPack().fix("Marks", this.money.getCount() * 25);
    hero.getRank().clrQueue();
    hero.getRank().fix(Constants.LEVEL, 1);
    hero.getRank().fix(Constants.SOCIAL, this.isNoble() ? 1 : 0);
    hero.getStatus().clrQueue();
    hero.getStatus().fix(Constants.AGE, 16);
    hero.calcCombat();
    hero.calcRaise();
    hero.setState(itAgent.CREATE);
    hero.setPlace(Constants.FIELDS);
    if (this.isThief()) {
      hero.addRank(Constants.THIEF, 1);
      hero.fixTemp(Constants.THIEF, hero.thiefRank());
    }
    if (this.isMagic()) {
      hero.addRank(Constants.MAGIC, 1);
      hero.fixTemp(Constants.MAGIC, hero.magicRank());
    }
    if (this.isFight()) {
      hero.addRank(Constants.FIGHT, 1);
      hero.fixTemp(Constants.FIGHT, hero.fightRank());
    }
    
    if (this.isGuild()) {
      hero.fixStatTrait(Constants.GUILD);
    }
  }
}

