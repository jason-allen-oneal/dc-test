import { Screen } from './Screen';
import { Breaker } from './Breaker';
import { Tools } from './Tools';
import { Color, Graphics } from 'your-graphics-library'; // Replace with your graphics library

export class arNotice extends Screen {
  private text: string | null = null;

  constructor(from: Screen) {
    super(from, "arNotice");
    this.hideStatusBar();
  }

  constructor(from: Screen, msg: string) {
    super(from, "arNotice");
    this.hideStatusBar();
    this.setMessage(msg);
  }

  protected setMessage(msg: string) {
    this.text = msg;
    this.repaint();
  }

  localPaint(g: Graphics) {
    g.setColor(Color.black);
    g.fillRect(0, 0, Tools.DEFAULT_WIDTH, Tools.DEFAULT_HEIGHT);
    g.setColor(Color.white);
    this.drawText(g, 10, 5);
  }

  private drawText(g: Graphics, dx: number, dy: number) {
    if (this.text !== null) {
      g.setFont(Tools.courtF);
      const snap = new Breaker(this.text, g.getFontMetrics(g.getFont()), 380, false);
      for (let ix = 0; ix < snap.lineCount(); ix++) {
        g.drawString(snap.getLine(ix), dx, dy + snap.getAscent() + ix * snap.getHeight());
      }
    }
  }

  down(x: number, y: number): Screen | null {
    if (Tools.movedAway(this)) {
      return null;
    }
    Tools.setRegion(this.getHome());
    return null;
  }
}
