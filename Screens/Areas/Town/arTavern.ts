import itHero from './path-to-itHero'; // Update the path accordingly
import Screen from './path-to-Screen'; // Update the path accordingly
import Indoors from './path-to-Indoors'; // Update the path accordingly
import arNotice from './path-to-arNotice'; // Update the path accordingly
import arStorage from './path-to-arStorage'; // Update the path accordingly
import Constants from './path-to-Constants'; // Update the path accordingly
import GameStrings from './path-to-GameStrings'; // Update the path accordingly
import Rumors from './path-to-Rumors'; // Update the path accordingly
import Tools from './path-to-Tools'; // Update the path accordingly

class arTavern extends Indoors implements Rumors {
  tools: Button[];
  monger: string[] = [
    "One old woman tells you:",
    "A spirited forester tells you:",
    "An old drunken soldier tells you:",
    "Silas Keeper whispers to you:",
    "A beligerent fish monger prods you:",
    "A sly bard sing to you:",
    "Kara the barmaid sidles up to you:"
  ];
  static greeting: (string | null)[] = [
    null,
    "This job is great",
    "I love to drink",
    "You're my best friend",
    "I'm so happy",
    "Hixxup! Excuse me",
    "Burrrp - Ahhhhh",
    "*Sniff* *Sniff* <Gulp>",
    "Beer is my friend",
    "Huh? You say something?",
    "I'm kinda sleepy"
  ];
  static cost: number[] = [1, 5, 25, 100, 1];
  static text: string[] = [
    "Buy a Drink", "Sleep on Floor", "Rent a Room", "Rent a Suite", "Storage"
  ];
  static readonly TAVERN_ID: number = 1;

  constructor(from: Screen) {
    super(from, "Silas Keepers Bed & Breakfast");
    if (itHero.getHero().hasTrait(Constants.HOTEL)) {
      for (let i = 1; i <= 4; i++) {
        arTavern.cost[i] = (arTavern.cost[i] + 9) / 10;
      }
    }
  }

  getFace(): string {
    return "Faces/Silas.jpg";
  }

  getGreeting(): string {
    const msg: string | null = Tools.select(arTavern.greeting);
    return msg === null
      ? `${Tools.getBest()} who?`
      : msg;
  }

  localPaint(g: Graphics): void {
    super.localPaint(g);
    this.updateTools();
  }

  action(e: Event, o: any): boolean {
    const hero: itHero = Screen.getHero();
    let next: Screen | null = null;
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.getPic(0)) {
      next = this.getHome();
    }
    let i = 0;
    while (i < this.tools.length) {
      if (e.target === this.tools[i]) {
        if (i < 4) {
          hero.subMoney(arTavern.cost[i]);
        }
        switch (i) {
          case 0:
            next = this.rumors();
            break;
          case 1:
            next = Screen.tryToExit(this, Constants.FLOOR, arTavern.cost[i]);
            break;
          case 2:
            next = Screen.tryToExit(this, Constants.ROOM, arTavern.cost[i]);
            break;
          case 3:
            next = Screen.tryToExit(this, Constants.SUITE, arTavern.cost[i]);
            break;
          case 4:
            const spend: number = hero.subMoney(arTavern.cost[i]);
            if (spend < arTavern.cost[i]) {
              hero.subStore("Marks", arTavern.cost[i] - spend);
            }
            next = new arStorage(this);
            break;
        }
        break;
      } else {
        i++;
      }
    }
    this.repaint();
    Tools.setRegion(next);
    return super.action(e, o);
  }

  createTools(): void {
    const level: number = Screen.getHero().getLevel();
    let i: number = arTavern.text.length;
    if (i > arTavern.cost.length) {
      i = arTavern.cost.length;
    }
    this.tools = new Array<Button>(i);
    arTavern.cost[1] = 4 + level;
    arTavern.cost[2] = 20 + (5 * level);
    arTavern.cost[3] = 75 + (25 * level);
    arTavern.cost[4] = level * 50;
    for (let i2 = 0; i2 < this.tools.length; i2++) {
      let msg: string = arTavern.text[i2];
      if (arTavern.cost[i2] > 0) {
        msg = `$${arTavern.cost[i2]} ${msg}`;
      }
      this.tools[i2] = new Button(msg);
      this.tools[i2].reshape(180, 55 + (i2 * 30), 180, 25);
      this.tools[i2].setFont(Tools.statusF);
    }
    this.updateTools();
  }

  addTools(): void {
    for (let i = 0; i < this.tools.length; i++) {
      this.add(this.tools[i]);
    }
  }

  updateTools(): void {
    const h: itHero = Screen.getHero();
    const cash: number = h.getMoney();
    const store: number = h.storeCount("Marks");
    let i: number = 0;
    while (i < this.tools.length - 1) {
      this.tools[i].enable(cash >= arTavern.cost[i]);
      i++;
    }
    this.tools[i].enable(cash >= arTavern.cost[i] || store >= arTavern.cost[i] || cash + store > arTavern.cost[i]);
  }

  rumors(): Screen {
    let msg: string;
    const h: itHero = Screen.getHero();
    if (h.getQuests() < 1) {
      return new arNotice(
        this,
        `${GameStrings.GOSSIP}\nYou are so tired that you nearly pass out trying to swallow your drink.\n`
      );
    }
    let val: number = Tools.roll(h.getCharm());
    if (h.getCharm() <= 10) {
      val += 2;
    } else if (h.getCharm() <= 20) {
      val++;
    }
    switch (val) {
      case 0:
        msg = `${GameStrings.GOSSIP}\n\tSomeone slips you a mickey. You awake with a headache in the dark and stinking alley.\n\n*** You Have Missed One Quest ***\n\n*** ${h.getMoney()} Marks Lost ***\n`;
        h.subMoney(h.getMoney());
        h.addFatigue(1);
        break;
      case 1:
                msg = `${GameStrings.GOSSIP}\n\tYou drink heavily and pass out for a couple hours.\n\n*** You Have Missed One Quest ***\n`;
        h.addFatigue(1);
        break;
      case 2:
      case 3:
      case 4:
        msg = `${GameStrings.GOSSIP}\nNo one seems interested in you...\n`;
        break;
      default:
        msg = `${GameStrings.GOSSIP}\n\t${Tools.select(this.monger)}\n\t${Tools.select(Rumors.rumors)}\n${h.gainCharm(1)}`;
        break;
    }
    return new arNotice(this, msg);
  }
}

