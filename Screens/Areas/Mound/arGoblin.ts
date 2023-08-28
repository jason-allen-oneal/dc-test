import { Item } from 'path-to-item-module';
import { itArms } from 'path-to-itArms-module';
import { Screen } from 'path-to-Screen-module';
import { Shop } from 'path-to-Shop-module';
import { arNotice } from 'path-to-arNotice-module';
import { Constants } from 'path-to-Constants-module';
import { GRumors } from 'path-to-GRumors-module';
import { GameStrings } from 'path-to-GameStrings-module';
import { GearTypes } from 'path-to-GearTypes-module';
import { Tools } from 'path-to-Tools-module';

class arGoblin extends Shop implements GRumors {
  tools: Button[];
  transact: Button;
  bar_shop: CheckboxGroup;
  bar: Checkbox;
  shop: Checkbox;

  static greeting = [
    null,
    "Sorry, I sneezded on it",
    "Zat's funny! tee-hee-hee!",
    "Need some shirtzez?",
    "I can loanzez money...",
    "You need zomething?",
    "I price thingzez nice",
    "Insuranze for your woezez?",
    "Whatz your problemzez?"
  ];
  static cost = [0, 10, 250];
  static text = ["Sleep on Floor", "Buy a Drink", "Rent Smelly Cot"];
  static stock = [
    "Gobble Inn Postcard",
    "Gobble Inn T-Shirt",
    "Identify Scroll",
    GearTypes.SALVE,
    GearTypes.SELTZER,
    "Map to Warrens",
    GearTypes.INSURANCE,
    "Map to Treasury"
  ];
  static monger = [
    "An old goblin witch tells you:",
    "A frothing berzerker screams:",
    "A sly pickpocket sidles up to you:",
    "Smidgeon Crumb grunts at you:",
    "A beligerent worm herder prods you:",
    "A goblin mage deigns to inform you:",
    "Slouch the barmaid mumbles to you:"
  ];

  constructor(from: Screen) {
    super(from, "Smidgeon Crumb at the Gobble Inn");
    arGoblin.cost[2] = 75 + (25 * Screen.getHero().getLevel());
    if (Screen.hasTrait(Constants.HOTEL)) {
      arGoblin.cost[2] = arGoblin.cost[2] / 10;
    }
  }

  getFace(): string {
    return "Faces/Smidgeon.jpg";
  }

  getGreeting(): string {
    const msg = Tools.select(arGoblin.greeting);
    return msg == null
      ? `${Screen.getBest()} aint nuzzin`
      : msg;
  }

  getStockList(): string[] {
    return arGoblin.stock;
  }

  doSpecial(): void {}

  getSpecial(): string | null {
    return null;
  }

  costSpecial(): number {
    return 0;
  }

  discardStock(it: Item): boolean {
    return false;
  }

  discardPack(it: Item): boolean {
    return it instanceof itArms;
  }

  createTools(): void {
    super.createTools();
    this.getTable().reshape(160, 80, 230, 175);
    let i = arGoblin.text.length;
    if (i > arGoblin.cost.length) {
      i = arGoblin.cost.length;
    }
    this.tools = new Button[i];
    for (let i2 = 0; i2 < this.tools.length; i2++) {
      let msg = arGoblin.text[i2];
      if (arGoblin.cost[i2] > 0) {
        msg = `${msg} $${arGoblin.cost[i2]}`;
      }
      this.tools[i2] = new Button(msg);
      this.tools[i2].reshape(180, 75 + (i2 * 30), 200, 25);
      this.tools[i2].setFont(Tools.statusF);
    }
    this.transact = new Button("Buy");
    this.transact.reshape(200, 50, 100, 20);
    this.transact.setFont(Tools.statusF);
    this.bar_shop = new CheckboxGroup();
    this.bar = new Checkbox("Inn", this.bar_shop, true);
    this.bar.reshape(5, 240, 45, 20);
    this.bar.setFont(Tools.statusF);
    this.bar.setBackground(getBackground());
    this.shop = new Checkbox("Shop", this.bar_shop, false);
    this.shop.reshape(50, 240, 65, 20);
    this.shop.setFont(Tools.statusF);
    this.shop.setBackground(getBackground());
    this.updateTools();
  }

  addTools(): void {
    super.addTools();
    for (let i = 0; i < this.tools.length; i++) {
      add(this.tools[i]);
    }
    add(this.transact);
    add(this.bar);
    add(this.shop);
  }

  updateTools(): void {
    const inBar = this.bar_shop.getCurrent() == this    .bar;
    const cash = Screen.getHero().getMoney();
    super.updateTools();
    this.hideTools(inBar ? 2 : 1);
    for (let i = 0; i < this.tools.length; i++) {
      this.tools[i].enable(cash >= arGoblin.cost[i]);
      this.tools[i].show(inBar);
    }
    const it = this.shopFind();
    if (it == null) {
      this.transact.setLabel("Buy");
      this.transact.enable(false);
    } else {
      const price = this.stockValue(it);
      this.transact.setLabel(`Buy $${price}`);
      this.transact.enable(cash >= price);
    }
    this.transact.show(!inBar);
  }

  action(e: Event, o: Object): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target == this.transact) {
      this.buyItem(1);
    } else if (e.target == this.getPic(0)) {
      Tools.setRegion(this.getHome());
    } else {
      let ix = 0;
      while (true) {
        if (ix >= this.tools.length) {
          break;
        } else if (e.target != this.tools[ix]) {
          ix++;
        } else if (Screen.getMoney() >= arGoblin.cost[ix]) {
          Screen.subMoney(arGoblin.cost[ix]);
          switch (ix) {
            case 0:
              Tools.setRegion(Screen.tryToExit(this, Constants.MOUND, arGoblin.cost[ix]));
              break;
            case 1:
              Tools.setRegion(this.rumors());
              break;
            case 2:
              Tools.setRegion(Screen.tryToExit(this, Constants.COT, arGoblin.cost[ix]));
              break;
          }
        }
      }
    }
    return super.action(e, o);
  }

  rumors(): Screen {
    let msg: string;
    if (Screen.getQuests() < 1) {
      return new arNotice(
        this,
        `${GameStrings.GOSSIP}\nYou are so tired that you nearly pass out trying to swallow your drink.\n`
      );
    }
    switch (Tools.roll(Screen.getCharm())) {
      case 0:
        msg = `${GameStrings.GOSSIP}\n\tSomeone slips you a mickey. You awake with a headache in the dark and stinking alley.\n\n*** You Have Missed One Quest ***\n\n*** Your Backpack is Empty! ***\n`;
        Screen.getPack().clrQueue();
        Screen.addFatigue(1);
        break;
      case 1:
      case 2:
        msg = `${GameStrings.GOSSIP}\n\tYou drink heavily and pass out for a couple hours.\n\n*** You Have Missed One Quest ***\n`;
        Screen.addFatigue(1);
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        msg = `${GameStrings.GOSSIP}\tNoone seems interested in you...\n`;
        break;
      default:
        msg =
          `${GameStrings.GOSSIP}\t${Tools.select(arGoblin.monger)}\n` +
          `${Tools.select(GRumors.grumors)}\n${Screen.getHero().gainCharm(2)}`;
        break;
    }
    return new arNotice(this, msg);
  }
}

