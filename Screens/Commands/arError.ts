import { Screen } from './Screen'; // Make sure to import the correct path for the Screen class
import { Tools } from './Tools'; // Make sure to import the correct path for the Tools class

export class arError extends Screen {
  problem: string;

  constructor() {
    super();
    this.problem = 'Unknown Error';
  }

  constructor(err: string) {
    super();
    this.problem = err;
    this.setBackground('red');
    this.setForeground('white');
    this.setFont(Tools.textF);
    this.hideStatusBar();
  }

  localPaint(g: Graphics) {
    let msg = this.problem;
    super.localPaint(g);
    g.setColor(this.getForeground());
    g.setFont(this.getFont());
    let v = 10 + 15;
    g.drawString('ERROR - Dragon Court Error has occurred', 10, v);
    let i = 0;
    while (true) {
      let ix = msg.indexOf('\n');
      if (ix === -1) {
        g.drawString(msg, 30, v + 15);
        return;
      }
      v += 15;
      g.drawString(msg.substring(0, ix), 30, v);
      msg = msg.substring(ix + 1);
      i++;
    }
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this) || e.target !== this) {
      return true;
    }
    Tools.setRegion(this.getHome()); // Make sure you have the getHome() method defined
    return true;
  }
}
