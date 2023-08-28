import { Color, Event } from 'java.awt';
import { Portrait } from 'DCourt.Components.Portrait';
import { itMonster } from 'DCourt.Items.List.itMonster';
import { arClanHall } from 'DCourt.Screens.Areas.Castle.arClanHall';
import { arPostal } from 'DCourt.Screens.Areas.Castle.arPostal';
import { arQueen } from 'DCourt.Screens.Areas.arQueen';
import { arTown } from 'DCourt.Screens.Areas.arTown';
import { arQuest } from 'DCourt.Screens.Quest.arQuest';
import { Screen } from 'DCourt.Screens.Screen';
import { WildsScreen } from 'DCourt.Screens.Template.WildsScreen';
import { arNotice } from 'DCourt.Screens.Utility.arNotice';
import { Tools } from 'DCourt.Tools.Tools';

class arCastle extends WildsScreen {
  place: string[] = ["Castle", "Dunjeon", "Ocean", "Brasil", "Shang"];
  power: number[] = [4, 2, 3, 4, 5];
  static FIND_OCEAN: number = 100;
  static weight: number[][] = [
    [1],
    [7, 6, 5, 4, 3, 2],
    [5, 3, 2],
    [6, 5, 4, 3, 2],
    [6, 7, 2, 6, 5, 3, 2]
  ];
  static beasts: string[][] = [
    ["Guard"],
    ["Rodent", "Snot", "Rager", "Gang", "Troll", "Mage"],
    ["Traders", "Serpent", "Mermaid"],
    ["Harpy", "Fighter", "Golem", "Medusa", "Hero"],
    ["Gunner", "Peasant", "Ninja", "Plague", "Shogun", "Panda", "Samurai"]
  ];
  static DOCKS_FAILURE: string =
    "\tYou plot a course with confidence.  But after days of fruitless searching you must return for additional provisions.\n\n\t";
  static DOCKS_SUCCESS: string =
    "\tYou plot a course with confidence.  After hours of searching you encounter oceanic inhabitants.\n\n\t";
  static DOCKS_BRASIL: string =
    " \tYou plot a course with confidence.  After days of travel you arrive on the shores of Hie Brasil.\n\n\t";
  static DOCKS_SHANG: string =
    "\tYou plot a course with confidence.  After a week of travel you arrive on the shores of Shangala.\n\n\t";
  static oceans: string[] = [
    "You spy an bouy marking low waters...",
    "You find a barrel floating on the waves...",
    "You pass a stretch of choking seaweed.",
    "You catch an odd fish with bulging eyeballs...",
    "A dolphin swims circles around your ship...",
    "Seagulls circle above you...",
    "You hear distance groans from some sea beast...",
    "You find planks from a ship that broke apart..."
  ];

  constructor() {
    super("The Central Courtyard of Dragon Keep");
    this.setBackground(new Color(255, 128, 255));
    this.setForeground(new Color(128, 0, 128));
  }

  createTools(): void {
    this.addPic(new Portrait("cstTown.jpg", "Town Gate", 20, 175, 96, 64));
    this.addPic(new Portrait("toCastle.jpg", "Royal Court", 155, 45, 96, 64));
    this.addPic(new Portrait("cstDunjeon.jpg", "{1}Dunjeons", 15, 70, 96, 64));
    this.addPic(new Portrait("Tower.jpg", "Clan Hall", 295, 40, 64, 96));
    this.addPic(new Portrait("cstPostal.jpg", "Post Office", 140, 170, 96, 64));
    this.addPic(new Portrait("cstDocks.jpg", "{1}Docks", 280, 180, 96, 64));
  }

  init(): void {
    super.init();
    this.getPic(2).show(Screen.getLevel() >= 8);
    this.getPic(5).show(Screen.getLevel() >= 10);
    Screen.getHero().tryToLevel(this);
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
        this.goQueen();
        break;
      case 2:
        this.goQuesting(1);
        break;
      case 3:
        Tools.setRegion(new arClanHall(this));
        break;
      case 4:
        Tools.setRegion(new arPostal(this));
        break;
      case 5:
        this.goQuesting(2);
        break;
    }
    return super.action(e, o);
  }

  goQueen(): void {
    if (Screen.getSocial() > 0) {
      Tools.setRegion(new arQueen(this));
    } else {
      this.goQuesting(0);
    }
  }

  getPower(loc: number): number {
    return this.power[loc];
  }

  getWhere(loc: number): string {
    return this.place[loc];
  }

  needsLight(loc: number): boolean {
    return loc == 1;
  }

  goQuesting(loc: number): void {
    if (loc < 2) {
      this.goQuesting(loc);
    } else if (this.testAdvance(loc)) {
      if (!Tools.contest(Screen.getWits(), arCastle.FIND_OCEAN)) {
        Tools.setRegion(
          new arNotice(
            this,
            arCastle.DOCKS_FAILURE.concat(
              String.valueOf(Tools.select(arCastle.oceans))
            )
          )
        );
        Screen.getHero().addFatigue(1);
      } else if (
        Screen.packCount("Rutter for Shangala") > 0 &&
        Tools.percent(70)
      ) {
        this.goQuesting(4);
      } else if (
        Screen.packCount("Rutter for Hie Brasil") <= 0 ||
        !Tools.percent(70)
      ) {
        this.goQuesting(2);
      } else {
        this.goQuesting(3);
      }
    }
  }

  pickQuest(loc: number): Screen {
    const beast: itMonster = this.selectQuest(loc, arCastle.beasts, arCastle.weight);
    let next: Screen = this;
    if (loc == 0) {
      next = new arQueen(this);
    }
    return new arQuest(
      this,
      next,
      this.getPower(loc),
      `${this.getWhere(loc)} Quest`,
      beast
    );
  }
}
