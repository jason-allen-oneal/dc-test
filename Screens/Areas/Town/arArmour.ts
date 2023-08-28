import itArms from './path-to-itArms'; // Update the path accordingly
import itHero from './path-to-itHero'; // Update the path accordingly
import Screen from './path-to-Screen'; // Update the path accordingly
import Smith from './path-to-Smith'; // Update the path accordingly
import ArmsTrait from './path-to-ArmsTrait'; // Update the path accordingly
import Tools from './path-to-Tools'; // Update the path accordingly
import Item from './path-to-Item'; // Update the path accordingly

class arArmour extends Smith {
  static MAXFIX_POWER: number = 60;
  static greeting: (string | null)[] = [
    null,
    "What's your sign?",
    "Hiya Sonny!",
    "Watcha Got?",
    "Hey there, sexy",
    "Rub me feet, willya?",
    "Armour is good...",
    "C'mon sexy, smile",
    "Cover ever'thing",
    "Back fer more?",
    "Need some shoes?"
  ];
  static stock: string[] = [
    "Clothes",
    "Leather Jacket",
    "Brigandine",
    "Chain Suit",
    "Scale Suit",
    "Buckler",
    "Targe",
    "Shield",
    "Spike Shield",
    "Sandals",
    "Shoes",
    "Boots",
    "Leather Cap",
    "Pot Helm",
    "Chain Coif"
  ];

  constructor(from: Screen) {
    super(from, "Aileen Suitor's Armour Shoppe");
    this.setShopValues(50, 15);
  }

  getFace(): string {
    return "Faces/Aileen.jpg";
  }

  getGreeting(): string {
    const val: string | null = Tools.select(arArmour.greeting);
    return val === null
      ? `${Tools.getBest()} is my hero.`
      : val;
  }

  getStockList(): string[] {
    return arArmour.stock;
  }

  getSpecial(): string {
    return "Polish";
  }

  doSpecial(): void {
    let cost: number;
    const h: itHero = Screen.getHero();
    const arm: itArms | null = this.shopFind() as itArms | null;
    if (arm !== null && !arm.hasTrait(ArmsTrait.SECRET) && h.getMoney() >= (cost = this.costSpecial())) {
      h.subMoney(cost);
      arm.clrTrait(ArmsTrait.DECAY);
      if (cost >= 2) {
        const base: itArms | null = ArmsTable.get(arm);
        if (base !== null) {
          if (base.getAttack() > arm.getAttack()) {
            arm.setAttack(base.getAttack());
          }
          if (base.getDefend() > arm.getDefend()) {
            arm.setDefend(base.getDefend());
          }
          if (base.getSkill() > arm.getSkill()) {
            arm.setSkill(base.getSkill());
          }
        }
        this.getTable().setItem(this.shopName(arm), this.getTable().getSelect());
      }
    }
  }

  costSpecial(): number {
    const arm: itArms | null = this.shopFind() as itArms | null;
    if (arm === null || arm.hasTrait(ArmsTrait.SECRET)) {
      return 0;
    }
    const base: itArms | null = ArmsTable.get(arm);
    let cost: number = arm.hasTrait(ArmsTrait.DECAY) ? 1 : 0;
    if (base === null || base.getPower() >= arArmour.MAXFIX_POWER) {
      return cost;
    }
    const num: number = base.getAttack() - arm.getAttack();
    if (num > 0) {
      cost += num * num * 5;
    }
    const num2: number = base.getDefend() - arm.getDefend();
    if (num2 > 0) {
      cost += num2 * num2 * 4;
    }
    const num3: number = base.getSkill() - arm.getSkill();
    if (num3 > 0) {
      cost += num3 * num3 * 2;
    }
    return cost;
  }

  stockValue(it: Item): number {
    if (!(it instanceof itArms)) {
      return 0;
    }
    const arm: itArms = it;
    let val: number = arm.stockValue();
    if (arm.hasTrait(ArmsTrait.BODY)) {
      val = Math.round(val * 1.3);
    }
    if (val < 2) {
      return 2;
    }
    return val;
  }
}
