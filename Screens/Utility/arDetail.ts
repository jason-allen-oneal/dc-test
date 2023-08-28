import { Screen } from './Screen';
import { arNotice } from './arNotice';
import { GearTable } from './GearTable';
import { Item } from './Item';
import { itArms } from './itArms';
import { itNote } from './itNote';
import { itCount } from './itCount';
import { Constants } from './Constants';
import { ArmsTrait } from './ArmsTrait';

export class arDetail extends arNotice {
  static readonly typeString = [
    "Junk\n\tDitch it\n",
    "Map\n\tAllows Access to Region\n",
    "Camp Gear\n\tImproves Outdoor Camping\n",
    "Gear\n\tCommon Adventure Supplies\n",
    "Treasure\n\tSell it for money",
    "Treasure\n\tMay be used by Mages\n",
    "Magic\n\tAffect Hero + Monsters\n",
    "Magic\n\tAffects Armaments\n",
    "Special\n\tAdvanced Adventuring Supplies\n",
    "Money\n\tThis is what you spend in shops"
  ];

  constructor(from: Screen, it: Item) {
    super(from, "Equipment Detail");
    this.setMessage(this.detail(it));
  }

  private detail(it: Item): string {
    if (it instanceof itArms) {
      return this.armsDetail(it);
    } else if (it instanceof itCount) {
      return this.countDetail(it);
    } else if (it instanceof itNote) {
      return this.noteDetail(it);
    } else {
      return "No Information";
    }
  }

  private countDetail(it: itCount): string {
    return `${it.getName()}[${it.getCount()}]\n\n\t${arDetail.typeString[GearTable.getType(it)]}`;
  }

  private noteDetail(it: itNote): string {
    return `${it.getName()}: ${it.getFrom()}\nSent: ${it.getDate()}\n====================\n${it.getBody()}`;
  }

  private armsDetail(a: itArms): string {
    if (a.hasTrait(ArmsTrait.SECRET)) {
      if (Screen.hasTrait(Constants.SMITH) && (a.hasTrait(ArmsTrait.RIGHT) || a.hasTrait(ArmsTrait.LEFT))) {
        a.clrTrait(ArmsTrait.SECRET);
      }
      if (Screen.hasTrait(Constants.ARMOR) && (a.hasTrait(ArmsTrait.HEAD) || a.hasTrait(ArmsTrait.BODY) || a.hasTrait(ArmsTrait.FEET))) {
        a.clrTrait(ArmsTrait.SECRET);
      }
    }
    let msg = `${a.toShow()}\n\n\tArmament\n\tLoc:`;
    let none = true;
    for (let ix = 0; ix < ArmsTrait.END_WEAR_TRAIT; ix++) {
      if (a.hasTrait(ArmsTrait.traitLabel[ix])) {
        msg += ` ${ArmsTrait.traitLabel[ix]}`;
        none = false;
      }
    }
    if (none) {
      msg += " NONE";
    }
    if (a.hasTrait(ArmsTrait.SECRET)) {
      return `${msg}\n\n\tNot Identified\n`;
    }
    let msg2 = `${msg}\n`;
    const num = a.getAttack();
    if (num !== 0) {
      msg2 += `\t${num < 1 ? "" : "+"}${num} Attack\n`;
    }
    const num2 = a.getDefend();
    if (num2 !== 0) {
      msg2 += `\t${num2 < 1 ? "" : "+"}${num2} Defense\n`;
    }
    const num3 = a.getSkill();
    if (num3 !== 0) {
      msg2 += `\t${num3 < 1 ? "" : "+"}${num3} Skill\n`;
    }
    let msg3 = `${msg2}\n\tOther:`;
    let none2 = true;
    for (let ix2 = ArmsTrait.VISIBLE_TRAIT; ix2 < ArmsTrait.traitLabel.length; ix2++) {
      if (a.hasTrait(ArmsTrait.traitLabel[ix2])) {
        msg3 += `\n\t\t${ArmsTrait.traitLabel[ix2]}`;
        if (ix2 === ArmsTrait.ENCHANT_TRAIT) {
          msg3 += `${this.enchantStrength(a.getPower(), a.getCount(ArmsTrait.ENCHANT))}`;
        }
        none2 = false;
      }
    }
    if (none2) {
      msg3 += "\n\t\tNONE\n";
    }
    return msg3;
  }

  private enchantStrength(power: number, spell: number): string {
    return spell < power / 2 ? " Weak\n" : spell < power ? " Good\n" : " Strong\n";
  }
}
