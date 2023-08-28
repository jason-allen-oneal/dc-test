import { Screen } from 'path-to-Screen'; // Replace with the correct import path
import { Item } from 'path-to-Item'; // Replace with the correct import path
import { Smith } from 'path-to-Smith'; // Replace with the correct import path
import { itArms } from 'path-to-itArms'; // Replace with the correct import path
import { ArmsTrait } from 'path-to-ArmsTrait'; // Replace with the correct import path
import { Tools } from 'path-to-Tools'; // Replace with the correct import path

class arWeapon extends Smith {
  static greeting = [
    null,
    'Welcome to my Shop',
    'Greetings Friend',
    'Buy something sharp',
    "You think Aileen's cute?",
    'Elf Bows are fast',
    'Gonna sell something?',
    'See you at the Tavern',
    'How are you today?',
    'My joints are aching',
    'Want to arm wrestle?'
  ];

  static stock = [
    'Knife',
    'Hatchet',
    'Short Sword',
    'Long Sword',
    'Spear',
    'Broad Sword',
    'Battle Axe',
    'Pike',
    'Sling',
    'Short Bow',
    'Long Bow',
    'Spike Helm',
    'Main Gauche'
  ];

  constructor(from: Screen) {
    super(from, 'Bill Smith\'s Weapon Shoppe');
    this.setShopValues(60, 10);
  }

  getFace(): string {
    return 'Faces/Bill.jpg'; // Replace with the correct path to the image
  }

  getGreeting(): string {
    const msg = Tools.select(arWeapon.greeting);
    return msg === null ? `${Tools.getBest()} is strong...` : msg;
  }

  getStockList(): string[] {
    return arWeapon.stock;
  }

  getSpecial(): string {
    return 'Identify';
  }

  doSpecial(): void {
    this.doIdentify();
  }

  costSpecial(): number {
    const a = this.shopFind() as itArms;
    return a === null || !a.hasTrait(ArmsTrait.SECRET) ? 0 : 40;
  }

  stockValue(it: Item): number {
    if (!(it instanceof itArms)) {
      return 0;
    }
    const arm = it as itArms;
    let val = arm.stockValue();
    if (arm.hasTrait(ArmsTrait.RIGHT)) {
      val = Math.floor(val * 1.3);
    }
    if (val < 2) {
      return 2;
    }
    return val;
  }
}
