import Item from './DCourt/Items/Item';
import itList from './DCourt/Items/itList';
import Buffer from './DCourt/Tools/Buffer';
import MadLib from './DCourt/Tools/MadLib';
import Tools from './DCourt/Tools/Tools';

class itText extends itList {
  text: MadLib;

  constructor(id: string) {
    super(id);
    this.text = new MadLib('');
  }

  constructor(id: string, msg: string) {
    super(id);
    this.text = new MadLib('');
    this.setText(msg);
  }

  constructor(it: itText) {
    super(it);
    this.text = it.text.clone() as MadLib;
  }

  copy(): Item {
    return new itText(this);
  }

  getIcon(): string {
    return "itText";
  }

  toString(depth: number): string {
    return `${toStringHead(depth)}|${this.getText()}}`;
  }

  setText(msg: string): void {
    this.text = new MadLib(msg);
  }

  getText(): string {
    return this.text.getText();
  }

  getIdentity(): string {
    return this.text.getReplace("$NAME$");
  }

  toString(): string {
    return `{itText|${this.getName()}|${this.getText()}`;
  }

  static factory(buf: Buffer): Item | null {
    if (!buf.begin() || !buf.match("itText") || !buf.split()) {
      return null;
    }
    const it = new itText(buf.token());
    if (buf.split()) {
      it.text = new MadLib(buf.token());
    }
    it.loadBody(buf);
    it.parseText();
    return it;
  }

  parseText(): void {
    for (let ix = 0; ix < this.getCount(); ix++) {
      const list = this.select(ix);
      if (list instanceof itList) {
        const pick = list.select(Tools.roll(list.getCount()));
        if (pick) {
          this.text.replace(list.getName(), pick.getName());
        }
      }
    }
  }
}
