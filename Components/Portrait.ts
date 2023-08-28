import { Canvas } from 'path-to-java.awt.Canvas';
import { Color } from 'path-to-java.awt.Color';
import { Event } from 'path-to-java.awt.Event';
import { Graphics } from 'path-to-java.awt.Graphics';
import { ImageObserver } from 'path-to-java.awt.image.ImageObserver';
import { Tools } from 'path-to-DCourt.Tools.Tools';

class Portrait extends Canvas {
  static NOTEXT = 0;
  static SUBTEXT = 1;
  static SUPERTEXT = 2;

  icon: HTMLImageElement | null;
  text: string | null;
  loading: boolean;
  type: number;

  constructor() {
    super();
    this.icon = null;
    this.text = null;
    this.loading = false;
    this.setForeground(new Color(0, 0, 0));
    this.type = Portrait.SUBTEXT;
  }

  initWithImage(where: string, x: number, y: number, w: number, h: number): void {
    this.icon = Tools.loadImage(where);
    this.reshape(x, y, w, h);
  }

  initWithImageAndText(where: string, msg: string, x: number, y: number, w: number, h: number): void {
    this.text = msg;
    this.icon = Tools.loadImage(where);
    this.reshape(x, y, w, h);
  }

  setType(val: number): void {
    this.type = val;
  }

  setText(msg: string): void {
    this.text = msg;
  }

  getText(): string | null {
    return this.text;
  }

  getIcon(): HTMLImageElement | null {
    return this.icon;
  }

  update(g: Graphics): void {
    this.paint(g);
  }

  paint(g: Graphics): void {
    const r = this.bounds();
    g.setColor(this.getForeground());

    if (!this.loading) {
      g.drawRect(0, 0, r.width - 1, r.height - 1);
      this.prepareImage(this.icon, this);
      this.loading = true;
    }

    const widthGood = this.icon.width === r.width;
    const heightGood = this.icon.height === r.height;
    const doneLoading = (this.checkImage(this.icon, this) & 32) !== 0;

    if (this.icon === null || (!doneLoading && (!widthGood || !heightGood))) {
      g.drawRect(0, 0, r.width - 1, r.height - 1);
    } else {
      g.drawImage(this.icon, 0, 0, r.width, r.height, null);
    }

    if (this.type === Portrait.SUBTEXT && this.text !== null) {
      const pg = this.getParent().getGraphics();
      pg.setColor(this.getForeground());
      pg.setFont(Tools.textF);
      const fm = this.getFontMetrics(Tools.textF);
      pg.drawString(
        this.text,
        r.x + ((r.width - fm.stringWidth(this.text)) / 2),
        r.y + r.height + fm.getAscent()
      );
    }

    if (this.type === Portrait.SUPERTEXT && this.text !== null) {
      const fm2 = this.getFontMetrics(Tools.statusF);
      const lines = new Breaker(this.text, fm2, r.width, false);
      const count = lines.lineCount();
      g.setFont(Tools.statusF);
      g.setColor(new Color(255, 255, 255));
      for (let i = 0; i < count; i++) {
        const msg = lines.getLine(i);
        g.drawString(
          msg,
          (r.width - fm2.stringWidth(msg)) / 2,
          5 + ((1 + i) * fm2.getAscent())
        );
      }
    }
  }

  mouseDown(e: Event, x: number, y: number): boolean {
    this.postEvent(new Event(this, 1001, null));
    return true;
  }

  imageUpdate(img: HTMLImageElement, flags: number, x: number, y: number, w: number, h: number): boolean {
    this.repaint();
    return super.imageUpdate(img, flags, x, y, w, h);
  }
}
