import { Screen } from './Screen'; // Make sure to import the correct path for the Screen class
import { Portrait } from './Portrait'; // Make sure to import the correct path for the Portrait class
import { itHero } from './itHero'; // Make sure to import the correct path for the itHero class
import { itList } from './itList'; // Make sure to import the correct path for the itList class
import { Tools } from './Tools'; // Make sure to import the correct path for the Tools class

export class arFinish extends Screen implements Constants {
  lists: Button;
  credits: Button;
  hero: itHero = Screen.getHero();
  start: itList = Screen.getPlayer().getStart();
  static readonly path: string[] = [
    'Final/Bed.jpg', 'Final/Floor.jpg', 'Final/Camp.jpg', 'Final/Dead.jpg'
  ];
  static readonly which: number[] = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2];
  static readonly EQL: string = '=';

  constructor() {
    super('Time to Finally Rest');
    this.setBackground('rgb(255, 128, 128)');
    this.setForeground('rgb(64, 32, 32)');
    this.setFont(Tools.statusF);
    this.hideStatusBar();
  }

  localPaint(g: Graphics) {
    let msg = this.problem;
    super.localPaint(g);
    g.setColor(this.getForeground());
    g.setFont(this.getFont());
    let v = 10 + 15;
    g.drawString('ERROR - Dragon Court Error has occurred', 10, v);
    let i = 0;
    while (true) {
      let ix = msg.indexOf('\n');
      if (ix === -1) {
        g.drawString(msg, 30, v + 15);
        return;
      }
      v += 15;
      g.drawString(msg.substring(0, ix), 30, v);
      msg = msg.substring(ix + 1);
      i++;
    }
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.credits) {
      Tools.setRegion(new arNotice(this, GameStrings.creditText));
    } else if (e.target === this.lists) {
      Tools.setRegion(new arRanking(this));
    } else {
      this.repaint();
    }
    return super.action(e, o);
  }

  createTools() {
    let val: number;
    if (Screen.getPlayer().isDead()) {
      val = 3;
    } else {
      let i = Constants.PLACE_LIST.firstOf(Screen.getPlace());
      val = (i < 0 || i >= 11) ? 3 : this.which[i];
    }
    this.addPic(new Portrait(this.path[val], '', 5, 20, 240, 160));
    this.lists = new Button('Lists');
    this.lists.reshape(260, 10, 60, 20);
    this.lists.setFont(Tools.textF);
    this.credits = new Button('Credits');
    this.credits.reshape(330, 10, 60, 20);
    this.credits.setFont(Tools.textF);
  }

  addTools() {
    this.add(this.lists);
    this.add(this.credits);
  }

  value(what: string, val: number): string {
    return val < 0
      ? `${val} ${what}`
      : `+${val} ${what}`;
  }

  startCount(id: string): number {
    return this.start.getCount(id);
  }

  guts(): number {
    return this.hero.getGuts() - this.startCount(Constants.GUTS);
  }

  wits(): number {
    return this.hero.getWits() - this.startCount(Constants.WITS);
  }

  charm(): number {
    return this.hero.getCharm() - this.startCount(Constants.CHARM);
  }

  attack(): number {
    return this.hero.getAttack() - this.startCount(Constants.ATTACK);
  }

  defend(): number {
    return this.hero.getDefend() - this.startCount(Constants.DEFEND);
  }

  skill(): number {
    return this.hero.getSkill() - this.startCount(Constants.SKILL);
  }

  quests(): number {
    return 3 * (this.hero.getLevel() - this.startCount(Constants.LEVEL));
  }

  level(): number {
    return this.hero.getLevel() - this.startCount(Constants.LEVEL);
  }

  exp(): number {
    return this.hero.getExp() - this.startCount(Constants.EXP);
  }

  fame(): number {
    return this.hero.getFame() - this.startCount(Constants.FAME);
  }

  money(): number {
    return this.hero.getMoney() - this.startCount('Marks');
  }
}
