class Buffer {
  private text: string;
  private index: number;
  private mark: number;
  private size: number;
  private static readonly OPEN_SYMBOL: string = '{';
  private static readonly DIVIDE_SYMBOL: string = '|';
  private static readonly CLOSE_SYMBOL: string = '}';

  constructor() {
    this.text = '';
    this.size = 0;
    this.mark = 0;
    this.index = 0;
  }

  constructor(s: string) {
    this.size = s.length;
    this.text = s;
    this.mark = 0;
    this.index = 0;
  }

  public reset(): void {
    this.mark = 0;
    this.index = 0;
  }

  public toString(sx?: number, ex?: number): string {
    if (sx !== undefined && ex !== undefined) {
      return this.text.substring(sx, ex);
    } else if (sx !== undefined) {
      return this.text.substring(sx);
    }
    return this.text;
  }

  public peek(num?: number): string {
    const max = num !== undefined ? this.index + num : this.size;
    return this.toString(this.index, Math.min(max, this.size));
  }

  private charAt(ix: number): string {
    if (ix < 0 || ix >= this.size) {
      return '\0';
    }
    return this.text.charAt(ix);
  }

  public length(len?: number): void | number {
    if (len !== undefined) {
      if (len > 0 && len < this.size) {
        this.size = len;
      }
    } else {
      return this.size;
    }
  }

  public isDone(): boolean {
    return this.index >= this.size;
  }

  public index(): number {
    return this.index;
  }

  public advance(val: number): void {
    this.index += val;
  }

  public space(): number {
    return this.size - this.index;
  }

  public set(ix: number): void {
    this.index = ix;
  }

  public getChar(ix?: number): string {
    if (ix !== undefined) {
      return this.charAt(ix);
    }
    if (this.index >= this.size) {
      return '\0';
    }
    const i = this.index;
    this.index = i + 1;
    return this.charAt(i);
  }

  public isError(): boolean {
    if (this.text.length < 6) {
      return false;
    }
    return this.text.substring(0, 6).equalsIgnoreCase('ERROR:');
  }

  public begin(): boolean {
    return this.getOpen();
  }

  public end(): boolean {
    return this.getClose();
  }

  public split(): boolean {
    return this.getDivide();
  }

  public trim(): void {
    this.skipWhite();
  }

  public token(): string {
    return this.getToken();
  }

  public num(): number {
    return this.getNumber();
  }

  public line(): string {
    return this.getLine();
  }

  public match(val: string): boolean {
    if (val === null) {
      return false;
    }
    this.setMark();
    if (val === this.getToken()) {
      return true;
    }
    this.goMark();
    return false;
  }

  public skipWhite(): void {
    while (this.index < this.size && this.charAt(this.index) <= ' ') {
      this.index++;
    }
  }

  public getOpen(): boolean {
    this.skipWhite();
    if (this.charAt(this.index) !== Buffer.OPEN_SYMBOL) {
      return false;
    }
    this.index++;
    return true;
  }

  public getDivide(): boolean {
    this.skipWhite();
    if (this.charAt(this.index) !== Buffer.DIVIDE_SYMBOL) {
      return false;
    }
    this.index++;
    return true;
  }

  public getClose(): boolean {
    this.skipWhite();
    if (this.charAt(this.index) !== Buffer.CLOSE_SYMBOL) {
      return false;
    }
    this.index++;
    return true;
  }

  public setMark(): void {
    this.mark = this.index;
  }

  public goMark(): void {
    this.index = this.mark;
  }

  public getToken(): string {
    this.skipWhite();
    if (this.index >= this.size) {
      return '';
    }
    const start = this.index;
    let c: string;
    while (
      this.index < this.size &&
      (c = this.charAt(this.index)) !== Buffer.OPEN_SYMBOL &&
      c !== Buffer.DIVIDE_SYMBOL &&
      c !== Buffer.CLOSE_SYMBOL
    ) {
      this.index++;
    }
    return this.toString(start, this.index).trim();
  }

  public getNumber(): number {
    try {
      return parseInt(this.getToken());
    } catch (e) {
      return 0;
    }
  }

  public isEmpty(): boolean {
    return this.size < 1;
  }

  public startsWith(s: string): boolean {
    this.skipWhite();
    return this.text.startsWith(s, this.index);
  }

  public indexOf(c: string): number {
    return this.text.indexOf(c, this.index);
  }

  public getLine(): string {
    const ix = this.indexOf('\n');
    if (ix < 0) {
      this.index = this.size;
    }
    const result = this.toString(this.index, ix);
    this.index = ix;
    return result.trim();
  }
}
