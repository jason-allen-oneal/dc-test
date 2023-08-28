import { Color, Event, Graphics } from 'java.awt';
import { Portrait } from 'DCourt.Components.Portrait';
import { itHero } from 'DCourt.Items.List.itHero';
import { arGoblin } from 'DCourt.Screens.Areas.Mound.arGoblin';
import { arQuest } from 'DCourt.Screens.Quest.arQuest';
import { Screen } from 'DCourt.Screens.Screen';
import { WildsScreen } from 'DCourt.Screens.Template.WildsScreen';
import { arNotice } from 'DCourt.Screens.Utility.arNotice';
import { Constants } from 'DCourt.Static.Constants';
import { Buffer, Loader, Tools } from 'DCourt.Tools.Tools';

class arMound extends WildsScreen {
  static FINDFIELDS: number = 50;
  static FINDVORTEX: number = 100;
  static weight: number[][] = [
    [5, 7, 3, 8, 4],
    [5, 5, 5, 7, 3],
    [5, 5, 5, 4, 2]
  ];
  static beasts: string[][] = [
    ["Worm", "Thief", "Mage", "Gang", "Rager"],
    ["Worm", "Thief", "Mage", "Guard", "Vault"],
    ["Worm", "Thief", "Mage", "Queen", "Champ"]
  ];
  static fields: string[] = [
    "You spy an old sign that reads: 'Town Ahead'",
    "You find a strand of flowers just coming into bloom.",
    "You pass a pond that is fresh and sweet.",
    "You see horse droppings and wagon tracks.",
    "You pass a herd of wild horses feeding quietly.",
    "Songbirds circle above you...",
    "You hear distant laughter, or is it applause?",
    "You pass a homestead that has been newly built..."
  ];

  constructor() {
    super("The Bowels of the Goblin Mound");
    this.setBackground(new Color(192, 96, 48));
    this.setForeground(Color.white);
    this.setFont(Tools.textF);
    this.addPic(new Portrait("mndWarrens.jpg", "{1}Warrens", 145, 130, 96, 64));
    this.addPic(new Portrait("mndTreasury.jpg", "{1}Treasury", 30, 180, 96, 64));
    this.addPic(new Portrait("mndThrone.jpg", "{1}Throne Room", 280, 160, 96, 64));
    this.addPic(new Portrait("mndVortex.jpg", ">>Dark Vortex<<", 165, 25, 96, 64));
    this.addPic(new Portrait("mndFields.jpg", "{1}To Fields", 20, 40, 96, 64));
    this.addPic(new Portrait("Tavern.jpg", "Gobble Inn", Tools.DEFAULT_HEIGHT, 35, 96, 64));
    Screen.setPlace(Constants.MOUND);
  }

  init(): void {
    super.init();
    this.questInit();
    this.getPic(0).show(Screen.packCount("Map to Warrens") > 0);
    this.getPic(1).show(Screen.packCount("Map to Treasury") > 0);
    this.getPic(2).show(Screen.packCount("Map to Throne Room") > 0);
    this.getPic(3).show(Screen.packCount("Map to Vortex") > 0);
  }

  localPaint(g: Graphics): void {
    super.localPaint(g);
    g.setFont(Tools.courtF);
    g.setColor(new Color(96, 48, 24));
    g.drawString(this.getTitle(), 10, 20);
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    switch (this.getPic(e.target)) {
      case 0:
        this.goQuesting(0);
        break;
      case 1:
        this.goQuesting(1);
        break;
      case 2:
        this.goQuesting(2);
        break;
      case 3:
        Tools.setRegion(this.enterVortex());
        break;
      case 4:
        Tools.setRegion(this.enterFields());
        break;
      case 5:
        Tools.setRegion(new arGoblin(this));
        break;
    }
    return super.action(e, o);
  }

  needsLight(loc: number): boolean {
    return true;
  }

  getPower(loc: number): number {
    return 3;
  }

  getWhere(pick: number): string {
    return "Mound";
  }

  pickQuest(loc: number): Screen {
    return new arQuest(this, 3, "Goblin Mound Quest", this.selectQuest(loc, arMound.beasts, arMound.weight));
  }

  enterFields(): Screen {
    const h: itHero = Screen.getHero();
    if (Screen.getQuests() < 1) {
      return new arNotice(this, WildsScreen.TOO_TIRED);
    }
    if (!Tools.contest(h.getWits(), arMound.FINDFIELDS)) {
      return this.pickQuest(0);
    }
    const msg: string =
      `\tYou trudge along the dusty trail and occasion to wonder why you haven't seen any other travellers.\n\n\t${
        arMound.fields[Tools.roll(arMound.fields.length)]
      }\n\n\tYou Enter the Fields...\n${h.gainWits(1)}`;
    h.addFatigue(1);
    return new arNotice(new arField(), msg);
  }

  enterVortex(): Screen {
    if (Screen.getQuests() < 1) {
      return new arNotice(this, WildsScreen.TOO_TIRED);
    }
    const buf: Buffer = Loader.cgiBuffer(Loader.MESSAGE, null);
    if (buf == null || buf.isEmpty() || buf.isError()) {
      return null;
    }
    return new arQuest(this, new arNotice(this, buf.toString()), 4, "Vortex Mouth", Screen.findBeast("Vortex:Guard"));
  }
}

