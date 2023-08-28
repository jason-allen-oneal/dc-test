import { Color } from 'java.awt';

import { Portrait } from 'DCourt.Components.Portrait';
import { Screen } from 'DCourt.Screens.Screen';
import { Tools } from 'DCourt.Tools.Tools';

/* loaded from: DCourt.jar:DCourt/Screens/Template/Indoors.class */
export abstract class Indoors extends Screen {
  abstract getGreeting(): string;
  abstract getFace(): string;

  constructor(from: Screen, name: string) {
    super(from, name);
    this.setBackground(new Color(128, 255, 129));
    this.setForeground(new Color(0, 128, 0));
    this.addPic(new Portrait('Exit.jpg', 320, 10, 64, 32));
    this.addPic(new Portrait(this.getFace(), this.getGreeting(), 10, 30, 144, 192));
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    return super.action(e, o);
  }
}
