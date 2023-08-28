class Buffer {
  private msg: string;
  private currentIndex: number = 0;

  constructor(msg: string) {
    this.msg = msg;
  }

  public isDone(): boolean {
    return this.currentIndex >= this.msg.length;
  }

  public index(): number {
    return this.currentIndex;
  }

  public getChar(index?: number): string {
    if (index !== undefined) {
      return this.msg.charAt(index);
    }
    return this.msg.charAt(this.currentIndex++);
  }

  public goMark(): void {
    // Not implemented in this conversion
  }

  public setMark(): void {
    // Not implemented in this conversion
  }
}

class Breaker {
  private buf: Buffer;
  private wide: number;
  private tabWidth: number;
  private indent: boolean;
  private fm: any; // Replace with actual type of FontMetrics
  private lines: string[] = [];
  private static TAB: string = "  ";

  constructor(msg: string, fm: any, wide: number, indent: boolean) {
    this.buf = new Buffer(msg);
    this.wide = wide;
    this.indent = indent;
    this.fm = fm;
    if (fm !== null) {
      // this.tabWidth = fm.stringWidth(Breaker.TAB); // Use equivalent in TypeScript
      this.breakText();
    }
  }

  public getText(): string {
    return this.buf.toString();
  }

  public getFontMetrics(): any {
    return this.fm;
  }

  public getAscent(): number {
    return this.fm.getAscent();
  }

  public getHeight(): number {
    return this.fm.getHeight();
  }

  public breakText(): void {
    let c: string;
    let end: number;
    let paragraph: boolean = true;

    if (!(this.wide === 0 || this.fm === null)) {
      while (!this.buf.isDone()) {
        let i: number = (paragraph || !this.indent) ? 0 : this.tabWidth;
        let pixels: number = i;
        let markPixels: number = i;
        let start: number = this.buf.index();

        while (true) {
          c = this.buf.getChar();
          if (c === '\0' || c === '\n') {
            break;
          } else if (c !== '\r') {
            pixels = c === '\t' ? pixels + this.tabWidth : pixels + this.fm.charWidth(c);
            if (pixels > this.wide) {
              this.buf.goMark();
              break;
            } else if (c <= ' ') {
              this.buf.setMark();
              markPixels = pixels;
            }
          }
        }
        end = this.buf.index();
        let msg: string = (paragraph || !this.indent) ? "" : Breaker.TAB;
        for (let ix = start; ix < end; ix++) {
          c = this.buf.getChar(ix);
          if (c === '\0' || c === '\n') {
            break;
          }
          if (c !== '\r') {
            msg += c === '\t' ? Breaker.TAB : c;
          }
        }
        paragraph = c === '\n';
        let count: number = this.lines.length;
        let temp: string[] = new Array(count + 1);
        for (let ix2 = 0; ix2 < count; ix2++) {
          temp[ix2] = this.lines[ix2];
        }
        temp[count] = msg;
        this.lines = temp;
      }
    }
  }

  public lineCount(): number {
    return this.lines.length;
  }

  public getLine(index: number): string | null {
    if (index < 0 || index >= this.lines.length) {
      return null;
    }
    return this.lines[index];
  }
}
