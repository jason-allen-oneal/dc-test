import { Item } from './Item'; // Make sure to import the correct path for the Item class
import { itHero } from './itHero'; // Make sure to import the correct path for the itHero class
import { itMonster } from './itMonster'; // Make sure to import the correct path for the itMonster class
import { itList } from './itList'; // Make sure to import the correct path for the itList class
import { itValue } from './itValue'; // Make sure to import the correct path for the itValue class
import { Color } from './Color'; // Make sure to import the correct path for the Color class
import { Tools } from './Tools'; // Make sure to import the correct path for the Tools class
import { Graphics } from './Graphics'; // Make sure to import the correct path for the Graphics class
import { Font } from './Font'; // Make sure to import the correct path for the Font class
import { FontMetrics } from './FontMetrics'; // Make sure to import the correct path for the FontMetrics class

export class Options extends Canvas {
  OPT_STRING: string[][];
  list: itList;
  goal: itList;
  font: Font;
  select: number;
  fontH: number;
  fontA: number;
  fontB: number;
  firstRound: boolean;

  constructor() {
    super();
    this.OPT_STRING = [
      ["Bribe with Marks", "Pay for Passage", "Give it Money"],
      ["Feed This Creature", "Tempt With Food", "Throw Some Grub"],
      ["Try to Answer", "Hazard a Guess", "Riddle Me This"],
      ["Bargain", "Barter", "Swap Goods", "Trade"],
      ["Aid the Poor Booger", "Help Out", "Lend a Hand"],
      ["Seduce the Beast", "Use Sex Appeal", "Flirt Lewdly"],
      ["  M:Hypnotize"],
      ["  T:Backstab"],
      ["  F:Berzerk"],
      ["  T:Swindle"],
      ["  S:Ieatsu"],
      [
        "Slay This Brute",
        "Attack Yon Beastie",
        "Assault The Monster",
        "Kill The Critter",
        "Smash The Devil"
      ],
      ["Flee For Safety", "Run For Your Life", "Evade With Haste", "Run Away! Run Away!"],
      ["Feed This Creature", "Tempt With Food", "Throw Some Grub"],
      ["Present Your Token", "Display A Token", "Hand Over Token"],
      ["Grab The Sucker", "Bottle This Thing", "Take it Captive"]
    ];
    this.select = -1;
  }

  constructor(ml: itList) {
    super();
    this.OPT_STRING = [
      ["Bribe with Marks", "Pay for Passage", "Give it Money"],
      ["Feed This Creature", "Tempt With Food", "Throw Some Grub"],
      ["Try to Answer", "Hazard a Guess", "Riddle Me This"],
      ["Bargain", "Barter", "Swap Goods", "Trade"],
      ["Aid the Poor Booger", "Help Out", "Lend a Hand"],
      ["Seduce the Beast", "Use Sex Appeal", "Flirt Lewdly"],
      ["  M:Hypnotize"],
      ["  T:Backstab"],
      ["  F:Berzerk"],
      ["  T:Swindle"],
      ["  S:Ieatsu"],
      [
        "Slay This Brute",
        "Attack Yon Beastie",
        "Assault The Monster",
        "Kill The Critter",
        "Smash The Devil"
      ],
      ["Flee For Safety", "Run For Your Life", "Evade With Haste", "Run Away! Run Away!"],
      ["Feed This Creature", "Tempt With Food", "Throw Some Grub"],
      ["Present Your Token", "Display A Token", "Hand Over Token"],
      ["Grab The Sucker", "Bottle This Thing", "Take it Captive"]
    ];
    this.select = -1;
    this.goal = ml;
    this.firstRound = true;
    this.list = new itList("Options");
    this.fixList();
    this.redraw();
  }

  reshape(x: number, y: number, w: number, h: number) {
    super.reshape(x, y, w, h);
    this.setdraw();
  }

  select(): number {
    return this.get(this.select);
  }

  paint(g: Graphics) {
    g.setColor(this.getBackground());
    g.fillRect(0, 0, this.bounds().width, this.bounds().height);
    g.setFont(this.font);
    for (let ix = 0; ix < this.list.getCount(); ix++) {
      g.setColor(this.select === ix ? Color.red : Color.black);
      g.drawString(this.text(ix), 2, this.fontB + this.fontA + ix * this.fontH);
    }
  }

  setdraw() {
    const count = this.list.getCount();
    const height = this.bounds().height;
    for (let size = 16; size >= 8; size--) {
      this.font = new Font(Tools.primeFont, 3, size);
      const fmet: FontMetrics = this.getFontMetrics(this.font);
      this.fontA = fmet.getAscent();
      this.fontH = this.fontA + fmet.getDescent();
      if (this.fontH * count < height) {
        break;
      }
    }
    this.fontB = (this.bounds().height - this.list.getCount() * this.fontH) / 2;
    if (this.fontB < 0) {
      this.fontB = 0;
    }
    this.repaint();
  }

  handleEvent(e: Event): boolean {
    const choice = this.select;
    if (e.id === 503) {
      this.select = (e.y - this.fontB) / this.fontH;
      if (this.select !== choice) {
        this.repaint();
      }
    }
    if (e.id === 501 && this.select >= 0 && this.select < this.list.getCount()) {
      this.postEvent(new Event(this, 1001, null));
    }
    return super.handleEvent(e);
  }

  append(what: number) {
    const which = Tools.roll(this.OPT_STRING[what].length);
    const tag = what.toString();
    this.list.drop(tag);
    this.list.append(new itValue(tag, this.OPT_STRING[what][which]));
  }

  remove(what: number) {
    this.goal.drop(OPT_ARRAY[what]);
  }

  redraw() {
    const h: itHero = Tools.getHero();
    for (let px = 0; px < this.list.getCount(); px++) {
      const it: Item = this.list.select(px);
      const ix: number = it.toInteger();
      switch (ix) {
        case 6:
          it.setValue(`${this.OPT_STRING[ix][0]}[${h.magic()}]`);
          break;
        case 7:
        case 9:
                    it.setValue(`${this.OPT_STRING[ix][0]}[${h.thief()}]`);
          break;
        case 8:
          it.setValue(`${this.OPT_STRING[ix][0]}[${h.fight()}]`);
          break;
        case 10:
          it.setValue(`${this.OPT_STRING[ix][0]}[${h.ieatsu()}]`);
          break;
      }
    }
    this.setdraw();
  }

  fixList() {
    const h: itHero = Tools.getHero();
    this.list.clrQueue();
    if (h.hasTrait("Panic")) {
      this.append(12);
    } else if (!this.firstRound) {
      this.append(11);
      this.append(12);
      if (this.goal.contains("control") && h.magic() > 0) {
        this.append(6);
      }
      if (h.fight() > 0) {
        this.append(8);
      }
    } else {
      this.append(11);
      this.append(12);
      for (let ix = 0; ix < this.goal.getCount(); ix++) {
        const choice = OPT_LIST.firstOf(this.goal.select(ix).getName());
        if (
          choice >= 0 &&
          ((choice !== 0 || h.getMoney() >= 1) &&
          (choice !== 3 || h.getMoney() >= 1) &&
          (choice !== 1 || h.packCount(GearTypes.FOOD) >= 1) &&
          (choice !== 13 || h.packCount(GearTypes.FISH) >= 1) &&
          (choice !== 14 ||
            (h.packCount(GearTypes.TOKEN) >= 1 &&
            h.getQuests() >= 10 &&
            h.guildRank() < h.getLevel()))
          )
        ) {
          if (choice === 7 || choice === 9) {
            if (h.thief() > 0) {
              this.append(choice);
            }
          } else if (choice !== 6) {
            this.append(choice);
          } else if (h.magic() > 0) {
            this.append(choice);
          }
        }
      }
      if (h.ieatsu() > 0) {
        this.append(10);
      }
    }
  }

  nextRound(h: itHero, m: itMonster) {
    this.firstRound = false;
    if (m.isHostile() || m.isDefensive()) {
      m.incStance();
    }
  }

  count(): number {
    if (this.list === null) {
      return 0;
    }
    return this.list.getCount();
  }

  text(which: number): string {
    return (this.list.select(which) as itValue).getValue();
  }

  get(which: number): number {
    return (this.list.select(which) as itValue).toInteger();
  }
}
