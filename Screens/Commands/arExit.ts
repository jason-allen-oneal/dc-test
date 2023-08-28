import { Screen } from 'path-to-Screen';
import { arNotice } from 'path-to-arNotice';
import { PlaceTable } from 'path-to-PlaceTable';
import { MadLib } from 'path-to-MadLib';
import { Tools } from 'path-to-Tools';

class arExit extends arNotice {
  saveSuccess: boolean = false;
  static deadMsg: string =
    "$TB$Whoops! you have been killed!!!$CR$$TB$The creature steals half your gear...$CR$$CR$You fall to the ground in the $place$. You will lie there unmourned until tomorrow when the spirits of the $place$ will awaken you.$CR$$CR$$TB$$TB$Please Return Tomorrow$CR$$TB$$TB$For Further Adventures$CR$";

  constructor(from: Screen, loc: string) {
    super(from, "arExit");
    Screen.setPlace(loc);

    if (Screen.getPlayer().isDead()) {
      this.setMessage(this.dead());
      return;
    }

    const lot: PlaceTable = Tools.getPlaceTable();
    lot.select(loc);

    let msg: string = lot.getSleep();
    const use: string = lot.getUse();

    if (use.indexOf(99) >= 0 && Screen.packCount("Cooking Gear") > 0) {
      msg += "\tYou cook up a hearty dinner.\n";
    }
    if (use.indexOf(116) >= 0 && Screen.packCount("Camp Tent") > 0) {
      msg += "\tYou prepare a tent for shelter.\n";
    }
    if (use.indexOf(98) >= 0 && Screen.packCount("Sleeping Bag") > 0) {
      msg += "\tYou roll up in a sleeping bag.\n";
    }

    this.setMessage(msg + this.questsRemain());
  }

  down(x: number, y: number): Screen | null {
    if (Tools.movedAway(this)) {
      return null;
    }
    this.saveAdvance();
    return null;
  }

  saveAdvance(): void {
    if (Screen.getPlayer().saveHero()) {
      Screen.getPlayer().saveScore();
      Tools.setRegion(new arFinish());
      return;
    }
    Tools.setRegion(Screen.getPlayer().errorScreen(this.getHome()));
  }

  dead(): string {
    const mad = new MadLib(arExit.deadMsg);
    mad.replace("$place$", Screen.getHero().getPlace());
    Screen.getHero().doExhaust();
    return mad.getText();
  }

  questsRemain(): string {
    const qnum: number = Screen.getQuests();
    return qnum > 0
      ? `\n\n\t${qnum} Quests Remain for Today...\n`
      : "\n\n\tReturn Tomorrow for Further Quests...\n";
  }
}
