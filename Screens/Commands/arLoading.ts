import { DCourtApplet } from './DCourtApplet'; // Make sure to import the correct path for the DCourtApplet class
import { Screen } from './Screen'; // Make sure to import the correct path for the Screen class
import { Tools } from './Tools'; // Make sure to import the correct path for the Tools class

export class arLoading extends Screen {
  stage: number = 0;
  papa: DCourtApplet;
  tools: Tools;

  constructor(papa: DCourtApplet, tools: Tools) {
    super();
    this.papa = papa;
    this.tools = tools;
    this.hideStatusBar();
  }

  localPaint(g: Graphics) {
    g.setColor('white');
    g.fillRect(0, 0, Tools.DEFAULT_WIDTH, Tools.DEFAULT_HEIGHT);
    g.setColor('black');
    g.setFont(Tools.bigF);
    let msg: string = 'Loading';
    for (let ix = 0; ix < this.stage; ix++) {
      msg += ' .';
    }
    g.drawString(msg, 20, 120);
    let i: number = this.stage;
    this.stage = i + 1;
    if (!Tools.isLoading(i)) {
      Tools.setRegion(new arEntry());
    } else {
      this.repaint();
    }
  }
}
