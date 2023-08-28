import { Color, Event } from 'java.awt';
import { Portrait } from 'DCourt.Components.Portrait';
import { itHero } from 'DCourt.Items.List.itHero';
import { arGemShop } from 'DCourt.Screens.Areas.Hills.arGemShop';
import { arMagicShop } from 'DCourt.Screens.Areas.Hills.arMagicShop';
import { arQuest } from 'DCourt.Screens.Quest.arQuest';
import { Screen } from 'DCourt.Screens.Screen';
import { WildsScreen } from 'DCourt.Screens.Template.WildsScreen';
import { arNotice } from 'DCourt.Screens.Utility.arNotice';
import { Constants } from 'DCourt.Static.Constants';
import { Tools } from 'DCourt.Tools.Tools';

class arHills extends WildsScreen {
  hidden: number = 7;
  forests: string[] = [
    "You spy an old sign that reads: 'Danger!'",
    "You find a human skull with an arrow embedded in it...",
    "You pass a pond that is obviously poisonous.",
    "You find animal droppings. There are chainmail links in it...",
    "You find a horse skeleton. Something big was eating it...",
    "Vultures circle above you...",
    "You hear distance howling, or is it screaming?",
    "You pass a homestead that has been burned to the ground..."
  ];
  static FINDFOREST: number = 40;
  static SEARCH: number = 80;
  weights: number[] = [7, 5, 5, 4, 3, 3];
  beasts: string[] = ["Goat", "Basilisk", "Troll", "Wyvern", "Giant", "Sphinx"];
  found: string[] = [
    "The Jewel Exchange atop a misty peak!\n",
    "Djinni's Magic Shop floating on a cloud!\n",
    "A dangerous shaft leading to the Abandoned Mines!\n"
  ];

  constructor() {
    super("High Crags of the Fenris Mountains");
    this.setBackground(new Color(160, 160, 160));
    this.setForeground(Color.white);
    this.setFont(Tools.textF);
    this.addPic(new Portrait("hllJewels.jpg", "Jewel Store", Tools.DEFAULT_HEIGHT, 20, 96, 64));
    this.addPic(new Portrait("hllMagics.jpg", "Magic Shop", 20, arHills.FINDFOREST, 96, 64));
    this.addPic(new Portrait("hllMines.jpg", "{1}Abandoned Mines", 150, 180, 96, 64));
    this.addPic(new Portrait("hllQuest.jpg", "{1}Quest", 170, arHills.SEARCH, 96, 64));
    this.addPic(new Portrait("hllCamp.jpg", "Exit Game", 10, 175, 96, 64));
    this.addPic(new Portrait("hllForest.jpg", "{1}Forest Trail", Tools.DEFAULT_HEIGHT, 180, 96, 64));
    Screen.setPlace(Constants.HILLS);
    for (let ix = 0; ix < 3; ix++) {
      this.getPic(ix).hide();
    }
  }

  init(): void {
    super.init();
    this.questInit();
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    switch (this.getPic(e.target)) {
      case 0:
        Tools.setRegion(new arGemShop(this));
        break;
      case 1:
        Tools.setRegion(new arMagicShop(this));
        break;
      case 2:
        Tools.setRegion(this.cavern());
        break;
      case 3:
        this.goQuesting();
        break;
      case 4:
        Tools.setRegion(Screen.tryToExit(this, Constants.HILLS, 0));
        break;
      case 5:
        Tools.setRegion(this.forest());
        break;
    }
    return super.action(e, o);
  }

  getHideBits(): number {
    return this.hidden;
  }

  markFound(pick: number): string {
    this.hidden &= 65535 ^ (1 << pick);
    if (pick < 0 || pick >= this.found.length) {
      return "???";
    }
    this.getPic(pick).show();
    return `While hiking over rocky ridges you discover...\n\n${this.found[pick]}`;
  }

  needsRope(loc: number): boolean {
    return true;
  }

  getPower(loc: number): number {
    return 3;
  }

  getWhere(loc: number): string {
    return "Hills";
  }

  pickQuest(loc: number): Screen {
    return new arQuest(this, 3, "Mountain Quest", this.selectQuest(this.beasts, this.weights));
  }

  forest(): Screen {
    const h: itHero = Screen.getHero();
    if (h.getQuests() < 1) {
      return new arNotice(this, WildsScreen.TOO_TIRED);
    }
    if (!Tools.contest(h.getWits(), arHills.FINDFOREST)) {
      return this.pickQuest(0);
    }
    const msg: string =
      `\tYou trudge along the dusty trail and occasion to wonder why you haven't seen any other travellers.\n\n\t` +
      `${this.forests[Tools.roll(this.forests.length)]}\n\n\tYou Enter the Forest...\n` +
      String.valueOf(h.gainWits(2));
    h.travelWork(1);
    return new arNotice(new arForest(), msg);
  }

  cavern(): Screen {
    return Screen.getQuests() < 1
      ? new arNotice(this, WildsScreen.TOO_TIRED)
      : !this.findClimb()
        ? new arNotice(this, WildsScreen.NEED_ROPE)
        : new arQuest(this, this, 5, "Deep Mines Quest", Screen.findBeast("Hills:Dragon"));
  }
}
