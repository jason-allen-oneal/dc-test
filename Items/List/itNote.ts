import Item from './DCourt/Items/Item';
import itList from './DCourt/Items/itList';
import Buffer from './DCourt/Tools/Buffer';
import Tools from './DCourt/Tools/Tools';

class itNote extends itList {
  body: string;
  from: string;
  date: string;

  constructor(id: string) {
    super(id);
  }

  constructor(id: string, from: string, msg: string) {
    super(id);
    this.setFrom(from);
    this.setDate(Tools.getToday());
    this.setBody(msg);
  }

  constructor(it: itNote) {
    super(it);
    this.fixStrings();
  }

  copy(): Item {
    return new itNote(this);
  }

  getIcon(): string {
    return "itNote";
  }

  static factory(buf: Buffer): Item | null {
    if (!buf.begin() || !buf.match("itNote") || !buf.split()) {
      return null;
    }
    const what = new itNote(buf.token());
    what.loadBody(buf);
    what.fixStrings();
    return what;
  }

  fixStrings(): void {
    this.from = this.getValue("from");
    this.date = this.getValue("date");
    this.body = this.getValue("body");
  }

  setFrom(val: string): void {
    this.from = val;
    this.fix("from", val);
  }

  setDate(val: string): void {
    this.date = val;
    this.fix("date", val);
  }

  setBody(val: string): void {
    this.body = val;
    this.fix("body", val);
  }

  getFrom(): string {
    return this.from;
  }

  getDate(): string {
    return this.date;
  }

  getBody(): string {
    return this.body;
  }

  getCount(): number {
    return 1;
  }

  getValue(): string {
    return this.body;
  }

  toShow(): string {
    return `${this.getName()}: ${this.getFrom()}`;
  }

  toLoot(): string {
    return this.getName();
  }
}
