import { Screen } from './Screen'; // Assuming you have a Screen module
import { itHero } from './itHero'; // Assuming you have an itHero module
import { arNotice } from './arNotice'; // Assuming you have an arNotice module
import { Constants } from './Constants'; // Assuming you have a Constants module
import { Tools } from './Tools'; // Assuming you have a Tools module
import { Indoors } from './Indoors'; // Assuming you have an Indoors module
import { Button } from 'your-button-library'; // Import your button library

class arGuild extends Indoors {
  tools: Button[];
  cost: number[];
  static text = ["Guild Member", "{5}Fighter Skill", "{5}Magery Skill", "{5}Trader Skill"];
  static someone = [
    null,
    "Silas Keep",
    "Sally Trader",
    "Bill Smith",
    "Aileen Suitor",
    "Elden Bishop",
    "Fenton Magus",
    "Gareth Shortlegs"
  ];
  static greeting = [
    null,
    "I am Fenton Magus",
    "Feel fear mortal",
    "Who violates these halls?",
    "Beware the Snot",
    "Elves are aloof",
    "Boar tastes like chicken",
    "Orcs are greedy",
    "Gryphons talk in riddles"
  ];
  static joinMsg = `...`; // Your long string here
  static fightMsg = `...`; // Your long string here
  static magicMsg = `...`; // Your long string here
  static thiefMsg = `...`; // Your long string here

  constructor(from: Screen) {
    super(
      from,
      `The Free Adventurers Guild${
        Screen.getQuests() < 5 ? ' - Closed For Rituals' : ''
      }`
    );
  }

  getFace(): string {
    return 'Faces/Fenton.jpg';
  }

  getGreeting(): string {
    const msg: string = Tools.select(arGuild.greeting);
    return msg === null ? `I've met ${Tools.getBest()}` : msg;
  }

  localPaint(g: Graphics): void {
    const h: itHero = Screen.getHero();
    super.localPaint(g);
    this.updateTools(h);
    if (h.hasTrait(Constants.GUILD)) {
      g.drawString('Guild Training', 210, 60);
      g.drawString(
        `Fighter: ${h.fight()}/${h.fightRank()}`,
        160,
        80
      );
      g.drawString(
        `Magery: ${h.magic()}/${h.magicRank()}`,
        160,
        100
      );
      g.drawString(
        `Trader: ${h.thief()}/${h.thiefRank()}`,
        280,
        80
      );
      g.drawString(
        `Total: ${h.guildRank()}/${h.getLevel()}`,
        280,
        100
      );
    }
  }

  action(e: Event, o: any): boolean {
    const h: itHero = Screen.getHero();
    let next: Screen = null;
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.getPic(0)) {
      next = this.getHome();
    }
    for (let i = 0; i < this.tools.length; i++) {
      if (e.target === this.tools[i] && h.getMoney() >= this.cost[i]) {
        h.subMoney(this.cost[i]);
        switch (i) {
          case 0:
            next = this.joinGuild(h);
            break;
          case 1:
            next = this.addFight(h);
            break;
          case 2:
            next = this.addMagic(h);
            break;
          case 3:
            next = this.addThief(h);
            break;
        }
      }
    }
    Tools.setRegion(next);
    return super.action(e, o);
  }

  createTools(): void {
    this.tools = new Array<Button>(arGuild.text.length);
    this.cost = new Array<number>(arGuild.text.length);
    for (let i = 0; i < this.tools.length; i++) {
      this.tools[i] = new Button(arGuild.text[i]);
      this.tools[i].reshape(170, 110 + i * 30, 200, 25);
      this.tools[i].setFont(Tools.statusF);
    }
    this.updateTools(Screen.getHero());
  }

  addTools(): void {
    for (let i = 0; i < this.tools.length; i++) {
      this.add(this.tools[i]);
    }
  }

  updateTools(h: itHero): void {
    let msg: string;
    const cash: number = h.getMoney();
    const guild: number = h.guildRank();
    const closed: boolean = h.getQuests() < 5;
    const member: boolean = h.hasTrait(Constants.GUILD);
    const avail: boolean = !closed && member && guild < h.getLevel();
    this.cost[0] = 4000;
    for (let i = 1; i < this.tools.length; i++) {
      this.cost[i] = guild * 1000;
    }
    if (h.hasTrait(Constants.ILLUMINATI)) {
      for (let i = 0; i < 4; i++) {
        this.cost[i] = Math.floor(this.cost[i] / 2);
      }
    }
    for (let i = 0; i < this.tools.length; i++) {
      if (i === 0) {
        msg = member ? arGuild.text[i] : `{5}Join Guild $4000`;
      } else {
        msg = `${arGuild.text[i]} ${
          guild === 0 ? ' Free' : ` $${this.cost[i]}`
        }`;
      }
      this.tools[i].setLabel(msg);
    }
    this.tools[0].enable(!closed && !member && cash >= this.cost[1]);
    for (let i = 1; i < this.tools.length; i++) {
      this.tools[i].enable(avail && cash >= this.cost[i]);
    }
  }

  joinGuild(h: itHero): Screen {
    h.getStatus().fixTrait(Constants.GUILD);
    h.addFatigue(5);
    return new arNotice(this, arGuild.joinMsg);
  }

  addFight(h: itHero): Screen {
    h.addWits(-2);
    h.addCharm(-2);
    h.addRank(Constants.FIGHT, 1);
    h.addTemp(Constants.FIGHT, 1);
    h.addFatigue(5);
    return new arNotice(this, arGuild.fightMsg);
  }

  addMagic(h: itHero): Screen {
    h.addGuts(-2);
    h.addCharm(-2);
    h.addRank(Constants.MAGIC, 1);
    h.addTemp(Constants.MAGIC, 1);
    h.addFatigue(5);
    return new arNotice(this, arGuild.magicMsg);
  }

    addThief(h: itHero): Screen {
    h.addGuts(-2);
    h.addWits(-2);
    h.addRank(Constants.THIEF, 1);
    h.addTemp(Constants.THIEF, 1);
    h.addFatigue(5);
    return new arNotice(this, arGuild.thiefMsg);
  }
}

