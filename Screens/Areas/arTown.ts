import { Color, Event } from 'java.awt';
import { Screen } from './Screen';
import { Portrait } from '../Components/Portrait';
import { itHero } from '../Items/List/itHero';
import { arArmour, arTavern, arTrader, arWeapon } from './Areas/Town';
import { arQuest } from './Quest/arQuest';
import { arNotice } from './Utility/arNotice';
import { arCastle } from './Wilds/arCastle';
import { arField } from './Wilds/arField';
import { WildsScreen } from './Template/WildsScreen';
import { Tools } from '../Tools/Tools';

export class arTown extends Screen {
  constructor() {
    super("Welcome to Salamander Township");
    this.setBackground(new Color(0, 255, 255));
    this.setForeground(Color.red);
    this.addPic(new Portrait("Tavern.jpg", "Tavern", 10, 60, 96, 64));
    this.addPic(new Portrait("Weapon.jpg", "Weapons", 160, 40, 96, 64));
    this.addPic(new Portrait("twnArmour.jpg", "Armour", 30, 170, 96, 64));
    this.addPic(new Portrait("toCastle.jpg", "Castle Gate", Tools.DEFAULT_HEIGHT, 20, 96, 64));
    this.addPic(new Portrait("twnTrader.jpg", "Trade Shop", 150, 180, 96, 64));
    this.addPic(new Portrait("toFields.jpg", "Leave Town", 280, 150, 96, 64));
  }

  init(): void {
    super.init();
    this.getPic(3).show(Screen.getHero().getLevel() >= 6);
    Screen.getHero().tryToLevel(this);
  }

  action(e: Event, o: any): boolean {
    let next: Screen | null = null;
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.getPic(0)) {
      next = new arTavern(this);
    } else if (e.target === this.getPic(1)) {
      next = new arWeapon(this);
    } else if (e.target === this.getPic(2)) {
      next = new arArmour(this);
    } else if (e.target === this.getPic(3)) {
      next = this.enterCastle();
    } else if (e.target === this.getPic(4)) {
      next = new arTrader(this);
    } else if (e.target === this.getPic(5)) {
      next = new arField();
    }
    Tools.setRegion(next);
    return super.action(e, o);
  }

  enterCastle(): Screen {
    const h: itHero = Screen.getHero();
    return (h.getSocial() > 0 || h.packCount("Castle Permit") > 0)
      ? new arCastle()
      : h.getQuests() < 1
      ? new arNotice(this, WildsScreen.TOO_TIRED)
      : new arQuest(this, new arCastle(), 3, "Castle Gate", Screen.findBeast("Town:Guard"));
  }
}
