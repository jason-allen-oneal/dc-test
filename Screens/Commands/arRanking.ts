import { Screen } from './Screen'; // Make sure to import the correct path for the Screen class
import { Tools } from './Tools'; // Make sure to import the correct path for the Tools class
import { FScrollbar } from './FScrollbar'; // Make sure to import the correct path for the FScrollbar class
import { Item } from './Item'; // Make sure to import the correct path for the Item class
import { itHero } from './itHero'; // Make sure to import the correct path for the itHero class
import { itList } from './itList'; // Make sure to import the correct path for the itList class
import { Constants } from './Constants'; // Make sure to import the correct path for the Constants class

export class arRanking extends Screen {
  done: Button;
  ranks: Button[];
  lists: itList[];
  heroItem: Item | null = null;
  start: number = 0;
  top: number = 0;
  which: number = 0;
  scroll: FScrollbar;

  constructor(from: Screen) {
    super(from, "arRankig");
    this.setBackground('green');
    this.setForeground('black');
    this.setFont(Tools.statusF);
    this.hideStatusBar();
  }

  init() {
    super.init();
    const buf: Buffer = Tools.getRankings();
    if (buf == null || buf.isError()) {
      Tools.setRegion(new arNotice(getHome(), `Error Reading Rankfile:\n${buf.line()}`));
    } else {
      this.digest(buf);
    }
  }

  localPaint(g: Graphics) {
    let target: string;
    const hero: itHero = Tools.getHero();
    if (this.which == 4) {
      target = hero == null ? "none" : hero.getClan();
    } else {
      target = hero == null ? "not" : hero.getName();
    }
    this.scroll.setMax(this.lists[this.which].getCount() - 12);
    this.scroll.setJump(12);
    this.scroll.setStep(1);
    g.setColor(bars[this.which]);
    g.fillRect(217, 0, SHOWWIDE, 265);
    g.fillRect(327, 0, SHOWWIDE, 265);
    g.setFont(Tools.courtF);
    g.setColor(new Color(0, 0, 128));
    g.drawString(office[this.which], 30, 20);
    g.setFont(this.getFont());
    for (let i = 0; i < 3; i++) {
      g.drawString(stats[this.which][i], SHOWLEFT + (i * SHOWWIDE), 20);
    }
    g.setFont(this.getFont());
    g.setColor(this.getForeground());
    const base = this.scroll.getVal();
    if (this.lists[this.which].getCount() < 1) {
      g.drawString("No Records Found", 28, 44);
      return;
    }
    const e: Enumeration = this.lists[this.which].elements();
    let i2 = 0;
    while (e.hasMoreElements() && i2 < base) {
      const item: Item = e.nextElement() as Item;
      i2++;
    }
    let i3 = 1;
    while (e.hasMoreElements() && i3 <= 12) {
      const it: Item = e.nextElement() as Item;
      if (it instanceof itList) {
        const list: itList = it as itList;
        const v: number = 24 + (i3 * 20);
        g.setColor('white');
        g.drawLine(0, v, Tools.DEFAULT_WIDTH, v);
        if (it.isMatch(target)) {
          g.setColor('blue');
        } else {
          g.setColor('black');
        }
        g.setFont(Tools.textF);
        const fm: FontMetrics = this.getFontMetrics(g.getFont());
        let next: number = 0;
        const rank: string = list.select(0).getName();
        const h: number = fm.stringWidth(rank);
        g.drawString(rank, 3, v);
        g.setFont(Tools.statusF);
        if (this.which == 4) {
          g.drawString(list.getName(), h + 6, v);
        } else {
          next = 0 + 1;
          g.drawString(`${Constants.rankTitle[list.select(next).toInteger()]}${list.getName()}`, h + 6, v);
        }
        g.setFont(Tools.textF);
        let h2: number = SHOWLEFT;
        while (true) {
          next++;
          const it2: Item = list.select(next);
          if (it2 == null) {
            break;
          }
          g.drawString(it2.getName(), h2, v);
          h2 += SHOWWIDE;
        }
      }
      i3++;
    }
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target == this.done) {
      Tools.setRegion(this.getHome());
    }
    let i = 0;
    while (i < 5) {
      if (this.ranks[i] == e.target) {
        this.which = i;
        break;
      }
      i++;
    }
    this.repaint();
    return super.action(e, o);
  }

  createTools() {
    this.setForeground('black');
    this.setFont(Tools.textF);
    this.done = new Button('Done');
    this.ranks = new Button[5];
    for (let i = 0; i < this.ranks.length; i++) {
      this.ranks[i] = new Button(rankStr[i]);
    }
    this.scroll = new FScrollbar();
    this.scroll.reshape(384, 0, 16, Tools.DEFAULT_HEIGHT);
    this.scroll.setAll(0, this.start, 1, 12);
    this.done.reshape(5, 277, 50, 20);
    for (let i2 = 0; i2 < this.ranks.length; i2++) {
      this.ranks[i2].reshape(75 + (60 * i2), 277, 50, 20);
    }
  }

  addTools() {
    this.add(this.done);
    this.add(this.scroll);
    for (let i = 0; i < this.ranks.length; i++) {
      this.add(this.ranks[i]);
    }
  }

  digest(buf: Buffer) {
    this.lists = new itList[5];
    for (let i = 0; i < this.lists.length; i++) {
      const it: Item = Item.factory(buf);
      if (it instanceof itList) {
        this.lists[i] = it as itList;
      } else {
        this.lists[i] = new itList('');
      }
    }
  }
}
