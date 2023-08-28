import { Screen } from './Screen'; // Assuming you have a Screen module
import { Item } from './Item'; // Assuming you have an Item module
import { itArms } from './itArms'; // Assuming you have an itArms module
import { Tools } from './Tools'; // Assuming you have a Tools module
import { ArmsTrait } from './ArmsTrait'; // Assuming you have an ArmsTrait module
import { Smith } from './Smith'; // Assuming you have a Smith module

class arDwfSmith extends Smith {
  static greeting = [
    null,
    "What the hell you want?",
    "Think as you're tough?",
    "Sod off ye bugger!",
    "What now!",
    "Well, piss on me",
    "Fargin' hell!",
    "Acch! What is it?",
    "Shades! Go away!",
    "This is me finest work",
    "A dandy bit this is",
    "Here's a pretty piece",
    "This is art, laddy",
    "Mithril is crap!",
    "I spit on Mithril",
    "Elf Bows? Bah!",
    "Gak! I hate Elf Bows!",
    "REPAIR!? Smeg off!",
    "FIX IT!? Yure Nuts!",
    "POLISH!? I'm no serf!"
  ];
  static stock = [
    "Steel Sword",
    "Bill Hook",
    "Sword Breaker",
    "Shakrum",
    "Recurve Bow",
    "Half Plate",
    "Full Plate",
    "Steel Buckler",
    "Roman Helm",
    "Doc Martins",
    "Mercury Sandals"
  ];

  constructor(from: Screen) {
    super(from, "Gareth Shortleg's Forest Smithy");
    this.setShopValues(50, 20);
  }

  getFace(): string {
    return "Faces/Gareth.jpg";
  }

  getGreeting(): string {
    const msg: string = Tools.select(arDwfSmith.greeting);
    return msg === null ? `You're no ${Tools.getBest()}` : msg;
  }

  getStockList(): string[] {
    return arDwfSmith.stock;
  }

  stockValue(it: Item): number {
    if (!(it instanceof itArms)) {
      return 0;
    }
    const arm: itArms = it;
    let val: number = arm.stockValue();
    if (arm.hasTrait(ArmsTrait.LEFT)) {
      val = Math.floor(val * 1.3);
    }
    if (val < 2) {
      return 2;
    }
    return val;
  }

  doSpecial(): void {
    this.doIdentify();
  }

  getSpecial(): string {
    return "Identify";
  }

  costSpecial(): number {
    const arm: itArms = this.shopFind() as itArms;
    return (arm === null || !arm.hasTrait(ArmsTrait.SECRET)) ? 0 : 60;
  }
}
