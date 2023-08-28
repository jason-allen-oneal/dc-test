import Color from 'path-to-awt.Color'; // Make sure to provide the correct path
import Event from 'path-to-java.awt.Event'; // Make sure to provide the correct path
import Font from 'path-to-java.awt.Font'; // Make sure to provide the correct path
import FontMetrics from 'path-to-java.awt.FontMetrics'; // Make sure to provide the correct path
import Graphics from 'path-to-java.awt.Graphics'; // Make sure to provide the correct path
import Panel from 'path-to-java.awt.Panel'; // Make sure to provide the correct path
import Rectangle from 'path-to-java.awt.Rectangle'; // Make sure to provide the correct path
import StaticLayout from 'path-to-DCourt.Tools.StaticLayout'; // Make sure to provide the correct path

class FTools extends Panel {
  static textF: Font = new Font("TimesRoman", 0, 14);
  fill: Color = new Color(192, 192, 192);
  glow: Color = new Color(224, 224, 224);
  dull: Color = new Color(128, 128, 128);
  dark: Color = new Color(96, 96, 96);
  fmet: FontMetrics | null = null;

  constructor() {
    super();
    this.setLayout(new StaticLayout());
    this.setFont(FTools.textF);
    this.setForeground(Color.black);
  }

  constructor(f: Font) {
    super();
    this.setLayout(new StaticLayout());
    this.setFont(f);
    this.setForeground(Color.black);
  }

  setFill(fc: Color): void {
    if (fc !== null) {
      this.fill = fc;
      const r: number = fc.getRed();
      const g: number = fc.getGreen();
      const b: number = fc.getBlue();
      this.dull = new Color((r * 2) / 3, (g * 2) / 3, (b * 2) / 3);
      this.dark = new Color(r / 2, g / 2, b / 2);
      this.glow = new Color((256 + r) / 2, (256 + g) / 2, (256 + b) / 2);
    }
  }

  update(g: Graphics): void {
    this.paint(g);
  }

  setFont(f: Font): void {
    super.setFont(f);
    this.fmet = this.getFontMetrics(f);
  }

  handleEvent(e: Event): boolean {
    if (e.target !== this) {
      return false;
    }
    switch (e.id) {
      case 501:
        return this.mouseDown(e, e.x, e.y);
      case 502:
        return this.mouseUp(e, e.x, e.y);
      case 503:
        return false;
      case 504:
      case 505:
      default:
        return false;
      case 506:
        return this.mouseDrag(e, e.x, e.y);
    }
  }

  drawSink(g: Graphics): void {
    this.drawSink(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawSink(g: Graphics, r: Rectangle): void {
    this.drawSink(g, r.x, r.y, r.width, r.height);
  }

  drawSink(g: Graphics, x: number, y: number, w: number, h: number): void {
    g.setColor(this.fill);
    g.fillRect(x, y, w, h);
    this.drawSinkBorder(g, x, y, w, h);
  }

  drawSinkBorder(g: Graphics): void {
    this.drawSinkBorder(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawSinkBorder(g: Graphics, r: Rectangle): void {
    this.drawSinkBorder(g, r.x, r.y, r.width, r.height);
  }

  drawSinkBorder(g: Graphics, x: number, y: number, w: number, h: number): void {
    const right: number = (x + w) - 1;
    const bottom: number = (y + h) - 1;
    if (right >= 0 && bottom >= 0) {
      g.setColor(this.fill);
      g.drawRect(x + 0, y + 0, w - 1, h - 1);
      g.drawRect(x + 1, y + 1, w - 3, h - 3);
      g.drawRect(x + 2, y + 2, w - 5, h - 5);
      g.setColor(this.glow);
      g.drawLine(right - 1, y + 1, right - 1, bottom - 1);
      g.drawLine(x + 1, bottom - 1, right - 1, bottom - 1);
      g.setColor(this.dull);
      g.drawLine(x + 1, y + 1, right, y + 1);
      g.drawLine(x + 1, y + 1, x + 1, bottom);
      g.setColor(this.dark);
      g.drawLine(x, y, right, y);
      g.drawLine(x, y, x, bottom);
    }
  }

  drawBar(g: Graphics): void {
    this.drawBar(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawBar(g: Graphics, r: Rectangle): void {
    this.drawBar(g, r.x, r.y, r.width, r.height);
  }

  drawBar(g: Graphics, x: number, y: number, w: number, h: number): void {
    g.setColor(this.fill);
    g.fillRect(x, y, w, h);
    this.drawBarBorder(g, x, y, w, h);
  }

  drawBarBorder(g: Graphics): void {
    this.drawBarBorder(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawBarBorder(g: Graphics, r: Rectangle): void {
    this.drawBarBorder(g, r.x, r.y, r.width, r.height);
  }

  drawBarBorder(g: Graphics, x: number, y: number, w: number, h: number): void {
    const right: number = (x + w) - 1;
    const bottom: number = (y + h) - 1;
    if (right >= 0 && bottom >= 0) {
      g.setColor(this.glow);
      g.drawLine(x, y, right - 1, y);
      g.drawLine(x, y, x, bottom - 1);
      g.setColor(this.fill);
      g.drawLine(right - 1, y + 1, right - 1, bottom - 1);
      g.drawLine(x + 1, bottom - 1, right - 1, bottom - 1);
      g.setColor(this.dark);
      g.drawLine(right, y, right, bottom);
      g.drawLine(x, bottom, right, bottom);
    }
  }

  drawUpArrow(g: Graphics): void {
    this.drawUpArrow(g, 0, 0, this.bounds().width, this.bounds().height);
  }
  
    drawUpArrow(g: Graphics, r: Rectangle): void {
    this.drawUpArrow(g, r.x, r.y, r.width, r.height);
  }

  drawUpArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    g.setColor(this.dark);
    const high8: number = height / 8;
    const high4: number = (height * 5) / 8;
    if (high4 !== 0) {
      const wide3: number = (width * 5) / 8;
      for (let v: number = 0; v < height; v++) {
        const val: number = v - high8;
        if (val > 0 && val <= high4) {
          const val2: number = (wide3 * val) / high4;
          const wide2: number = (width - val2) / 2;
          g.drawLine(x + wide2, y + v, (x + wide2) + val2 - 1, y + v);
        }
      }
    }
  }

  drawDownArrow(g: Graphics): void {
    this.drawDownArrow(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawDownArrow(g: Graphics, r: Rectangle): void {
    this.drawDownArrow(g, r.x, r.y, r.width, r.height);
  }

  drawDownArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    const bottom: number = (y + height) - 1;
    g.setColor(this.dark);
    const high8: number = height / 8;
    const high4: number = (height * 5) / 8;
    if (high4 !== 0) {
      const wide3: number = (width * 5) / 8;
      for (let v: number = 0; v < height; v++) {
        const val: number = v - high8;
        if (val > 0 && val <= high4) {
          const val2: number = (wide3 * val) / high4;
          const wide2: number = (width - val2) / 2;
          g.drawLine(x + wide2, bottom - v, (x + wide2) + val2 - 1, bottom - v);
        }
      }
    }
  }

  drawLeftArrow(g: Graphics): void {
    this.drawLeftArrow(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawLeftArrow(g: Graphics, r: Rectangle): void {
    this.drawLeftArrow(g, r.x, r.y, r.width, r.height);
  }

  drawLeftArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    g.setColor(this.dark);
    const wide8: number = width / 8;
    const wide4: number = (width * 5) / 8;
    if (wide4 !== 0) {
      const high3: number = (height * 5) / 8;
      for (let h: number = 0; h < width; h++) {
        const val: number = h - wide8;
        if (val > 0 && val <= wide4) {
          const val2: number = (high3 * val) / wide4;
          const high2: number = (height - val2) / 2;
          g.drawLine(x + h, y + high2, x + h, (y + high2) + val2 - 1);
        }
      }
    }
  }

  drawRightArrow(g: Graphics): void {
    this.drawRightArrow(g, 0, 0, this.bounds().width, this.bounds().height);
  }

  drawRightArrow(g: Graphics, r: Rectangle): void {
    this.drawRightArrow(g, r.x, r.y, r.width, r.height);
  }

  drawRightArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    const right: number = x + width;
    g.setColor(this.dark);
    const wide8: number = width / 8;
    const wide4: number = (width * 5) / 8;
    if (wide4 !== 0) {
      const high3: number = (height * 5) / 8;
      for (let h: number = 0; h < width; h++) {
        const val: number = h - wide8;
        if (val > 0 && val <= wide4) {
          const val2: number = (high3 * val) / wide4;
          const high2: number = (height - val2) / 2;
          g.drawLine(right - h, y + high2, right - h, (y + high2) + val2 - 1);
        }
      }
    }
  }
}

 
