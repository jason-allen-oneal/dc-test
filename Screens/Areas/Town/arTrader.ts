import { Screen } from './Screen'; // Replace with the correct import path
import { Trade } from './Trade'; // Replace with the correct import path
import { GearTypes } from './GearTypes'; // Replace with the correct import path
import { Tools } from './Tools'; // Replace with the correct import path

class arTrader extends Trade implements GearTypes {
  static greeting: string[] = [
    null,
    'Hello Again',
    'How are you?',
    'Nice weather today',
    "How's the family?",
    'You look healthy',
    'Need something special?',
    'Aileen scares me',
    'The tavern is noisy',
    'Need some help?',
    'Want a kiss?',
  ];
  static stock: string[] = [
    GearTypes.FOOD,
    GearTypes.FISH,
    'Torch',
    'Rope',
    'Pen & Paper',
    'Sleeping Bag',
    'Cooking Gear',
    'Camp Tent',
    'Identify Scroll',
    GearTypes.SALVE,
    GearTypes.SELTZER,
    GearTypes.PANIC_DUST,
    GearTypes.BLIND_DUST,
    GearTypes.PANIC_DUST,
    GearTypes.BLAST_DUST,
    'Castle Permit',
  ];

  constructor(from: Screen) {
    super(from, 'Sally Trader\'s Curious Goods');
    this.setShopValues(80, 15);
  }

  getFace(): string {
    return 'Faces/Sally.jpg';
    // Replace with the correct path to the image
  }
  
  getGreeting(): string {
    const msg = Tools.select(arTrader.greeting);
    return msg === null ? `I like ${Tools.getBest()}` : msg;
  }
  
  getStockList(): string[] {
    return arTrader.stock;
  }
}
