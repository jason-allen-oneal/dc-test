import { Graphics, Rectangle } from 'your-graphics-library'; // Import the appropriate graphics library

class DrawTools {
  public static white = new Color(255, 255, 255);
  public static fill = new Color(192, 192, 192);
  public static glow = new Color(224, 224, 224);
  public static dull = new Color(128, 128, 128);
  public static dark = new Color(96, 96, 96);
  public static black = new Color(0, 0, 0);

  public static center(g: Graphics, msg: string, x: number, y: number): void {
    g.drawString(
      msg,
      x - (g.getFontMetrics(g.getFont()).stringWidth(msg) / 2),
      y
    );
  }

  public static right(g: Graphics, msg: string, x: number, y: number): void {
    g.drawString(msg, x - g.getFontMetrics(g.getFont()).stringWidth(msg), y);
  }

  public static sink(
    g: Graphics,
    back: Color,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    g.setColor(back);
    g.fillRect(x, y, w, h);
    DrawTools.sinkBorder(g, back, x, y, w, h);
  }

  public static sinkBorder(
    g: Graphics,
    back: Color,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const right = x + w - 1;
    const bottom = y + h - 1;
    if (right >= 0 && bottom >= 0) {
      g.setColor(back);
      g.drawRect(x + 0, y + 0, w - 1, h - 1);
      g.drawRect(x + 1, y + 1, w - 3, h - 3);
      g.drawRect(x + 2, y + 2, w - 5, h - 5);
      g.setColor(glow);
      g.drawLine(right - 1, y + 1, right - 1, bottom - 1);
      g.drawLine(x + 1, bottom - 1, right - 1, bottom - 1);
      g.setColor(fill);
      g.drawLine(right, y, right, bottom);
      g.drawLine(x, bottom, right, bottom);
      g.setColor(dull);
      g.drawLine(x + 1, y + 1, right, y + 1);
      g.drawLine(x + 1, y + 1, x + 1, bottom);
      g.setColor(dark);
      g.drawLine(x, y, right, y);
      g.drawLine(x, y, x, bottom);
    }
  }

  public static bar(g: Graphics, back: Color, x: number, y: number, w: number, h: number): void {
    g.setColor(back);
    g.fillRect(x, y, w, h);
    DrawTools.barBorder(g, back, x, y, w, h);
  }

  public static barBorder(
    g: Graphics,
    back: Color,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const right = x + w - 1;
    const bottom = y + h - 1;
    if (right >= 0 && bottom >= 0) {
      g.setColor(glow);
      g.drawLine(x, y, right - 1, y);
      g.drawLine(x, y, x, bottom - 1);
      g.setColor(back);
      g.drawLine(right - 1, y + 1, right - 1, bottom - 1);
      g.drawLine(x + 1, bottom - 1, right - 1, bottom - 1);
      g.setColor(dark);
      g.drawLine(right, y, right, bottom);
      g.drawLine(x, bottom, right, bottom);
    }
  }

  public static upArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    g.setColor(dark);
    const high8 = height / 8;
    const high4 = (height * 5) / 8;
    if (high4 !== 0) {
      const wide3 = (width * 5) / 8;
      for (let v = 0; v < height; v++) {
        const val = v - high8;
        if (val > 0 && val <= high4) {
          const val2 = (wide3 * val) / high4;
          const wide2 = (width - val2) / 2;
          g.drawLine(x + wide2, y + v, (x + wide2 + val2) - 1, y + v);
        }
      }
    }
  }

  public static downArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    const bottom = y + height - 1;
    g.setColor(dark);
    const high8 = height / 8;
    const high4 = (height * 5) / 8;
    if (high4 !== 0) {
      const wide3 = (width * 5) / 8;
      for (let v = 0; v < height; v++) {
        const val = v - high8;
        if (val > 0 && val <= high4) {
          const val2 = (wide3 * val) / high4;
          const wide2 = (width - val2) / 2;
          g.drawLine(x + wide2, bottom - v, (x + wide2 + val2) - 1, bottom - v);
        }
      }
    }
  }

  public static leftArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    g.setColor(dark);
    const wide8 = width / 8;
    const wide4 = (width * 5) / 8;
    if (wide4 !== 0) {
      const high3 = (height * 5) / 8;
      for (let h = 0; h < width; h++) {
        const val = h - wide8;
        if (val > 0 && val <= wide4) {
          const val2 = (high3 * val) / wide4;
          const high2 = (height - val2) / 2;
          g.drawLine(x + h, y + high2, x + h, (y + high2 + val2) - 1);
        }
      }
    }
  }

  public static rightArrow(g: Graphics, x: number, y: number, width: number, height: number): void {
    const right = x + width;
    g.setColor(dark);
    const wide8 = width / 8;
    const wide4 = (width * 5) / 8;
    if (wide4 !== 0) {
      const high3 = (height * 5) / 8;
      for (let h = 0; h < width; h++) {
        const val = h - wide8;
        if (val > 0 && val <= wide4) {
          const val2 = (high3 * val) / wide4;
          const high2 = (height - val2) / 2;
          g.drawLine(right - h, y + high2, right - h, (y + high2 + val2) - 1);
        }
      }
    }
  }
}
