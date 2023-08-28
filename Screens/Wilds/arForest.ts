import { Color, Event } from 'java.awt';
import { Portrait } from 'DCourt.Components.Portrait';
import { itHero } from 'DCourt.Items.List.itHero';
import { arDwfSmith } from 'DCourt.Screens.Areas.Forest.arDwfSmith';
import { arGuild } from 'DCourt.Screens.Areas.Forest.arGuild';
import { arQuest } from 'DCourt.Screens.Quest.arQuest';
import { Screen } from 'DCourt.Screens.Screen';
import { WildsScreen } from 'DCourt.Screens.Template.WildsScreen';
import { arNotice } from 'DCourt.Screens.Utility.arNotice';
import { Constants } from 'DCourt.Static.Constants';
import { Tools } from 'DCourt.Tools.Tools';

class arForest extends WildsScreen {
  hidden: number = 7;
  fields: string[] = [
    "You spy an old sign that reads: 'Town Ahead'",
    "You find a strand of flowers just coming into bloom.",
    "You pass a pond that is fresh and sweet.",
    "You see horse droppings and wagon tracks.",
    "You pass a herd of wild horses feeding quietly.",
    "Songbirds circle above you...",
    "You hear distant laughter, or is it applause?",
    "You pass a homestead that has been newly built..."
  ];
  hills: string[] = [
    "You spy an old sign that reads: 'Djini Crossing'",
    "You find a strand of scrubby flowers clinging to a crevice.",
    "You pass a trickling mountain stream.",
    "You see the paw prints of some large cat.",
    "You spy a herd of sheep in the distance.",
    "Flys circle around you...",
    "You hear distant water, or is it wind?",
    "You pass a cave that smells of bear..."
  ];
  static FINDHILLS: number = 80;
  static SEARCH: number = 40;
  static FINDFIELDS: number = 20;
  weights: number[] = [10, 9, 8, 6, 4, 3];
  beasts: string[] = ["Boar", "Orc", "Elf", "Gryphon", "Snot", "Unicorn"];
  found: string[] = [
    "The Forest Smithy, hidden in an enchanted grove!\n",
    "The Free Adventurers Guild in a maze of shrubbery!\n",
    "The secret path to the Fenris Mountains!\n"
  ];

  constructor() {
    super("The Depths of the Arcane Forest");
    this.setBackground(new Color(0, 128, 0));
    this.setForeground(new Color(128, 255, 128));
    this.setFont(Tools.textF);
    this.addPic(new Portrait("Weapon.jpg", "Smithy", 20, 170, 96, 64));
    this.addPic(new Portrait("Tower.jpg", "The Guild", 320, 150, 64, 96));
    this.addPic(new Portrait("fstHills.jpg", "{1}Mountain Trail", 10, 30, 96, 64));
    this.addPic(new Portrait("toFields.jpg", "{1}To Fields", Tools.DEFAULT_HEIGHT, 10, 96, 64));
    this.addPic(new Portrait("fstQuest.jpg", "{1}Quest!", 160, 60, 96, 64));
    this.addPic(new Portrait("fstCamp.jpg", "Exit Game", 180, 180, 96, 64));
    for (let i = 0; i < 3; i++) {
      this.getPic(i).hide();
    }
    Screen.setPlace(Constants.FOREST);
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
        Tools.setRegion(new arDwfSmith(this));
        break;
      case 1:
        Tools.setRegion(new arGuild(this));
        break;
      case 2:
        Tools.setRegion(this.hills());
        break;
      case 3:
        Tools.setRegion(this.fields());
        break;
      case 4:
        this.goQuesting();
        break;
      case 5:
        Tools.setRegion(Screen.tryToExit(this, Constants.FOREST, 0));
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
    return `While trudging through the woods you discover...\n\n${this.found[pick]}`;
  }

  getPower(loc: number): number {
    return 2;
  }

  getWhere(loc: number): string {
    return "Forest";
  }

  pickQuest(loc: number): Screen {
    return new arQuest(this, 2, "Forest Quest", this.selectQuest(this.beasts, this.weights));
  }

  fields(): Screen {
    const h: itHero = Screen.getHero();
    if (Screen.getQuests() < 1) {
      return new arNotice(this, WildsScreen.TOO_TIRED);
    }
    if (!Tools.contest(h.getWits(), 20)) {
      return this.pickQuest(0);
    }
    const msg: string =
      `\tYou trudge along the dusty trail and occasion to wonder why you haven't seen any other travellers.\n\n\t` +
      `${this.fields[Tools.roll(this.fields.length)]}\n\n\tYou Enter the Fields...\n` +
      String.valueOf(h.gainWits(1));
    h.travelWork(1);
    return new arNotice(new arField(), msg);
  }

  hills(): Screen {
    const h: itHero = Screen.getHero();
    if (h.getQuests() < 1) {
      return new arNotice(this, WildsScreen.TOO_TIRED);
    }
    if (!Tools.contest(h.getWits(), arForest.FINDHILLS)) {
      return this.pickQuest(0);
    }
    const msg: string =
      `\tYou march along a rising trail, admiring the spreading vista where mountain meets forest.\n\n\t` +
      `${this.hills[Tools.roll(this.fields.length)]}\n\n\tYou Enter the Mountains...\n` +
      String.valueOf(h.gainWits(3));
    h.travelWork(1);
    return new arNotice(new arHills(), msg);
  }
}
