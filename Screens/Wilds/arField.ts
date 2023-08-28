import { Color, Event } from 'java.awt';
import { Portrait } from 'DCourt.Components.Portrait';
import { itHero } from 'DCourt.Items.List.itHero';
import { arHealer } from 'DCourt.Screens.Areas.Fields.arHealer';
import { arTown } from 'DCourt.Screens.Areas.arTown';
import { arQuest } from 'DCourt.Screens.Quest.arQuest';
import { Screen } from 'DCourt.Screens.Screen';
import { WildsScreen } from 'DCourt.Screens.Template.WildsScreen';
import { arNotice } from 'DCourt.Screens.Utility.arNotice';
import { Constants } from 'DCourt.Static.Constants';
import { Tools } from 'DCourt.Tools.Tools';

class arField extends WildsScreen {
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
  hiweight: number[] = [8, 6, 4, 5, 2, 5, 2];
  loweight: number[] = [12, 10, 6, 10, 2, 1, 0];
  beasts: string[] = [
    "Rodent", "Goblin", "Centaur", Constants.MERCHANT, "Wizard", Constants.GYPSY, "Soldier"
  ];

  constructor() {
    super("The Fields near Salamander Township");
    this.setBackground(new Color(255, 128, 128));
    this.setForeground(new Color(192, 64, 64));
    Tools.setHeroPlace(Constants.FIELDS);
  }

  createTools(): void {
    this.addPic(new Portrait("fldTown.jpg", "Town Road", 30, arField.FINDFOREST, 96, 64));
    this.addPic(new Portrait("Tower.jpg", "Healers Tower", 320, 55, 64, 96));
    this.addPic(new Portrait("fldQuest.jpg", "{1}Quest!", 145, 135, 96, 64));
    this.addPic(new Portrait("fldCamp.jpg", "Exit Game", 265, 185, 96, 64));
    this.addPic(new Portrait("fldForest.jpg", "{1}Forest Road", 10, 180, 96, 64));
    this.addPic(new Portrait("fldMound.jpg", "{1}Goblin Mound", 190, 30, 96, 64));
  }

  init(): void {
    super.init();
    this.questInit();
    this.getPic(4).show(Tools.getHero().getLevel() >= 4);
    this.getPic(5).show(Tools.getHero().getLevel() >= 8);
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    switch (this.getPic(e.target)) {
      case 0:
        Tools.setRegion(new arTown());
        break;
      case 1:
        Tools.setRegion(new arHealer(this));
        break;
      case 2:
        this.goQuesting();
        break;
      case 3:
        Tools.setRegion(Screen.tryToExit(this, Constants.FIELDS, 0));
        break;
      case 4:
        Tools.setRegion(this.enterForest());
        break;
      case 5:
        Tools.setRegion(this.enterMound());
        break;
    }
    return super.action(e, o);
  }

  enterForest(): Screen {
    const h: itHero = Tools.getHero();
    if (h.getQuests() < 1) {
      return new arNotice(this, WildsScreen.TOO_TIRED);
    }
    if (!Tools.contest(h.getWits(), arField.FINDFOREST)) {
      return h.getLevel() >= 6
        ? this.pickQuest(0)
        : new arNotice(
            this.pickQuest(0),
            "\tYou start hiking towards the distant woods. You are making good time, when suddenly..."
          );
    }
    const msg: string =
      `\tYou trudge along the dusty trail and occasion to wonder why you haven't seen any other travellers.\n\n\t` +
      `${this.forests[Tools.roll(this.forests.length)]}\n\n\tYou Enter the Forest...\n` +
      String.valueOf(h.gainWits(2));
    h.travelWork(1);
    return new arNotice(new arForest(), msg);
  }

  enterMound(): Screen {
    return Screen.getHero().getQuests() < 1
      ? new arNotice(this, WildsScreen.TOO_TIRED)
      : new arQuest(this, new arMound(), 2, "Goblin Mound Quest", Screen.findBeast("Mound:Gate"));
  }

  getPower(loc: number): number {
    return 1;
  }

  getWhere(loc: number): string {
    return "Fields";
  }

  pickQuest(loc: number): Screen {
    return new arQuest(
      this,
      1,
      "Fields Quest",
      this.selectQuest(this.beasts, Tools.getHero().getLevel() < 3 ? this.loweight : this.hiweight)
    );
  }
}
