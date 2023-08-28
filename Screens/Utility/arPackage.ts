import { Screen } from './Screen';
import { FTextField } from './FTextField';
import { itHero } from './itHero';
import { itList } from './itList';
import { Transfer } from './Transfer';
import { GameStrings } from './GameStrings';
import { Buffer } from './Buffer';
import { Loader } from './Loader';
import { MadLib } from './MadLib';
import { Tools } from './Tools';
import { Color, Graphics } from 'your-graphics-library'; // Replace with your graphics library

export class arPackage extends Transfer {
  private send: Button;
  private name: FTextField;
  private breaksound: string[] = [
    '***KEERASH***',
    '***SMASHOLA***',
    '***BANG+CRACK+POP***',
    '+++SHLORP-bump+++',
    '***CRASH***...tinkle...',
    'HEE-HAW! HEE HAW!',
    '***KABADABOOM***',
    '...bzzzzzzzzzzzz...',
    'AIYEEEE!!!!'
  ];
  private static mailSent =
    '$TB$Okay Chief, got it covered. When your friend comes to pick it up, we\'ll have it sitting right on top here.$CR$$CR$$TB$$TB$$crash$$CR$$CR$$TB$No problem, got it covered.$CR$';

  constructor(from: Screen) {
    super(from, `${from.getTitle()} Mail Room`);
    this.setBackground(new Color(0, 0, 128));
    this.setForeground(Color.white);
    this.hideStatusBar();
    this.setValues(0, Screen.getPack(), new itList('stash'));
  }

  goHome() {
    Screen.getPack().merge(this.getStash());
    this.clrStash();
    this.goHome();
  }

  localPaint(g: Graphics) {
    super.localPaint(g);
    this.updateTools();
    g.setFont(Tools.textF);
    g.setColor(this.getForeground());
    g.drawString('Send To:', 10, 285);
    g.setFont(Tools.statusF);
    g.drawString(`Backpack ${Screen.packCount()}`, 30, 65);
    g.drawString(`Mail Package ${this.stashCount()}`, 230, 65);
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target == this.send) {
      Tools.setRegion(this.sendPackage());
    }
    return super.action(e, o);
  }

  createTools() {
    super.createTools();
    this.send = new Button('Send $0');
    this.send.reshape(275, 272, 80, 20);
    this.send.setFont(Tools.textF);
    this.name = new FTextField(15);
    this.name.reshape(65, 270, 200, 22);
    this.updateTools();
  }

  addTools() {
    super.addTools();
    this.add(this.send);
    this.add(this.name);
  }

  updateTools() {
    const count = this.stashCount();
    this.send.setLabel(`Send $${count * 100}`);
    this.send.enable(count > 0 && Screen.getMoney() >= count * 100);
    this.updateTools();
  }

  sendPackage(): Screen {
    const h: itHero = Screen.getHero();
    const dest: string = this.name.getText();
    if (dest.length < 4 || dest.length > 15) {
      return new arNotice(
        this,
        `\tThe name you have selected is malformed:\n<${dest}>\n\n\tHero names must be at least 4 letters and no more than 15 letters\n`
      );
    }
    if (Screen.getHero().isMatch(dest)) {
      return new arNotice(
        this,
        `\tWhat is the point of sending mail to yourself?\n\n\tIt poses a metaphysical conundrum, and lends the suggestion that you are insane.\n\n<<Why'd I go and say a fool thing like that?>>\n`
      );
    }
    const count = this.stashCount();
    h.subMoney(count * 100);
    if (!Screen.saveHero()) {
      h.addMoney(count * 100);
      return new arNotice(this.getHome(), GameStrings.SAVE_CANCEL);
    }
    const result = this.send(
      `${h.getTitle()}${h.getName()}`,
      dest,
      this.getStash()
    );
    if (result != null) {
      Screen.addMoney(count * 100);
      return new arNotice(
        this,
        `${GameStrings.MAIL_CANCEL}${result}`
      );
    }
    const sent = new MadLib(arPackage.mailSent);
    sent.replace('$crash$', Tools.select(this.breaksound));
    return new arNotice(this.getHome(), sent.getText());
  }

  static send(source: string, dest: string, mail: itList): string | null {
    const pkg: Buffer = new Buffer(mail.toString());
    const msg: string = Tools.getToday();
    const buf: Buffer = Loader.cgiBuffer(
      Loader.SENDMAIL,
      `${Screen.getHero().getName()}|${Screen.getPlayer().getSessionID()}|${msg.substring(0, msg.lastIndexOf('/'))} Package <== ${source}|${dest}\n${pkg.toString()}`
    );
    if (buf.isError()) {
      return buf.peek();
    }
    return null;
  }
}
