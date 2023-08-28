import { Screen } from './Screen';
import { FTextField } from './FTextField';
import { GearTable } from './GearTable';
import { Item } from './Item';
import { itArms } from './itArms';
import { itHero } from './itHero';
import { itList } from './itList';
import { Constants } from './Constants';
import { Buffer } from './Buffer';
import { Loader } from './Loader';
import { MadLib } from './MadLib';
import { Tools } from './Tools';
import { Color, Graphics } from 'your-graphics-library'; // Replace with your graphics library

export class arPeer extends arNotice {
  private heroName: FTextField;
  private seek: Button;
  private done: Button;
  private pname: string;
  private target: itHero;
  private spend: number;
  static SEEKMONEY = 250;
  static SEEKGEM = 'Opal';

  constructor(from: Screen, source: number, who: string) {
    super(from, 'Examine Hero');
    this.setBackground(Color.blue);
    this.setForeground(Color.white);
    this.setFont(Tools.courtF);
    this.hideStatusBar();
    this.pname = who == null ? Screen.getHero().getName() : who;
    this.spend = source;
    if (this.spend === 2 && GearTable.canMageUse(arPeer.SEEKGEM)) {
      this.spend = 0;
    }
    this.setMessage('Working...');
  }

  init() {
    super.init();
    this.LoadVision(this.pname);
  }

  localPaint(g: Graphics) {
    const h: itHero = Screen.getHero();
    if (this.spend !== 4) {
      this.seek.enable(
        this.heroName.isMatch(h.getName()) ||
          (this.spend === 1 && h.getMoney() > arPeer.SEEKMONEY) ||
          (this.spend === 2 && h.packCount(arPeer.SEEKGEM) > 3)
      );
    }
    g.setColor(this.getBackground());
    g.fillRect(0, 0, Tools.DEFAULT_WIDTH, Tools.DEFAULT_HEIGHT);
    g.setColor(this.getForeground());
    g.setFont(Tools.statusF);
    if (this.heroName.isMatch(h.getName())) {
      g.drawString('Cost: Free', 195, 23);
    } else if (this.spend === 1) {
      g.drawString('Cost: $250', 195, 23);
    } else if (this.spend === 2) {
      g.drawString(`Cost: 3/${h.packCount(arPeer.SEEKGEM)} ${arPeer.SEEKGEM}`, 195, 23);
    } else if (this.spend === 4) {
      g.drawString(`${h.getClan()} Clan Palantir`, 10, 20);
    } else {
      g.drawString('Cost: ---', 200, 20);
    }
    g.setColor(this.getForeground());
    this.drawText(g, 10, 40);
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.done) {
      Tools.setRegion(this.getHome());
    }
    if (e.target === this.seek) {
      this.LoadVision(this.heroName.getText());
    }
    this.repaint();
    return true;
  }

  createTools() {
    this.setFont(Tools.textF);
    this.setForeground(Color.black);
    this.done = new Button('Done');
    this.done.reshape(335, 7, 60, 20);
    this.heroName = new FTextField(15);
    this.heroName.reshape(70, 5, 120, 22);
    if (this.spend !== 4) {
      this.heroName.setText(Screen.getHero().getName());
    }
    this.seek = new Button('Seek');
    this.seek.reshape(5, 7, 60, 20);
  }

  addTools() {
    this.add(this.done);
    if (this.spend !== 4) {
      this.add(this.seek);
      this.add(this.heroName);
    }
  }

  LoadVision(who: string) {
    const h: itHero = Screen.getHero();
    this.pname = who;
    if (who == null || who.length < 4) {
      this.setMessage(`Illegal Name: <${who}>`);
    } else if (h.isMatch(this.pname)) {
      this.target = h;
      this.BuildDescription();
    } else {
      if (this.spend === 1) {
        h.subMoney(arPeer.SEEKMONEY);
      }
      if (this.spend === 2) {
        h.subPack(arPeer.SEEKGEM, 3);
      }
      const buf: Buffer = Loader.cgiBuffer(Loader.READHERO, this.pname);
      if (buf == null || buf.isEmpty() || buf.isError()) {
        this.setMessage(`Unable to Load <${this.pname}>`);
        return;
      }
      this.target = Item.factory(buf) as itHero;
      this.BuildDescription();
    }
  }

  BuildDescription() {
  let mad: MadLib;
  const lp: itList = this.target.getLooks();
  if (lp == null || lp.getCount() < 1) {
    mad = new MadLib(arPeer.noDescription);
  } else {
    let madTemplate: string;
    if (lp.getValue(Constants.HABIT) == null || Tools.chance(3)) {
      madTemplate = arPeer.describe0;
    } else {
      madTemplate = arPeer.describe0 + arPeer.describe2;
    }
    mad = new MadLib(madTemplate + arPeer.describe3);

    const gender: number = this.getGender(lp.getValue(Constants.TITLE));
    const dress: number = this.getDress(lp.getValue(Constants.DRESS));
    const behave: number = this.getBehave(lp.getValue(Constants.BEHAVE));

    mad.replace('$title$', this.target.getTitle());
    mad.replace('$name$', this.target.getName());
    mad.replace('$clanmsg$', this.target.getClan() == null ? '' : 'of the ' + this.target.getClan() + ' Clan');
    mad.replace('$build$', lp.getValue(Constants.BUILD));
    mad.replace('$race$', lp.getValue(Constants.RACE));
    mad.replace('$hair$', lp.getValue(Constants.HAIR));
    mad.replace('$eyes$', lp.getValue(Constants.EYES));
    mad.replace('$skin$', lp.getValue(Constants.SKIN));
    mad.replace('$dress$', dress === gender ? '' : dressmsg);
    mad.replace('$sexact$', sex_Act[dress]);
    mad.replace('$sexdress$', sex_Dress[dress]);
    if (gender !== behave) {
      mad.replace('$behave$', behave === dress ? arPeer.AND : arPeer.WHILE);
      mad.replace('$also$', behave === dress ? arPeer.ALSO : '');
      mad.replace('$sexact$', sex_Act[behave]);
    } else {
      mad.replace('$behave$', behave === dress ? '' : behave === gender ? behave2 : behave1);
    }
    mad.replace('$intro$', gender === dress ? arPeer.intro1 : arPeer.intro2);
    mad.replace('$marks$', lp.getValue('Marks'));
    mad.replace('$sign$', lp.getValue(Constants.SIGN));
    mad.replace('$situation$', Tools.select(arPeer.situation));
    mad.replace('$phrase$', lp.getValue(Constants.PHRASE));
    mad.replace('$habit$', lp.getValue(Constants.HABIT));
    mad.replace('$rank$', this.target.getRankTitle());
    mad.replace('$adject$', Tools.select(arPeer.strongAdj));
    mad.genderize(gender === 0);
  }

  mad.replace('$guts$', this.target.getGuts());
  mad.replace('$wits$', this.target.getWits());
  mad.replace('$charm$', this.target.getCharm());

  const rightArm: itArms = this.target.findGearTrait(ArmsTrait.RIGHT);
  mad.replace('$weapon$', rightArm == null ? Constants.NONE : rightArm.getName());
  const bodyArm: itArms = this.target.findGearTrait(ArmsTrait.BODY);
  mad.replace('$armor$', bodyArm == null ? Constants.NONE : bodyArm.getName());

  const msg: string = mad.getText() + '\nTraits: ';
  let row: number = 1;
  for (let i = 0; i < Constants.TraitList.length; i++) {
    if (this.target.hasTrait(Constants.TraitList[i])) {
      if (this.target.hasTrait(Constants.TraitList[i])) {
  msg += Constants.TraitList[i] + ' ';
  row++;
  if (row % 6 === 0) {
    msg += '\n\t';
  }
}

    }
  }
  if (row === 1) {
    if (row === 1) {
  msg += Constants.NONE;
}


  }

  this.setMessage(msg);
}

getGender(title: string): number {
  for (let gender = 0; gender < 2; gender++) {
    if (title === Constants.sexs[gender]) {
      return gender;
    }
  }
  return 0;
}

getDress(dress: string): number {
  for (let i = 0; i < arPeer.sex_Act.length; i++) {
    if (dress === arPeer.sex_Act[i]) {
      return i;
    }
  }
  return 0;
}

getBehave(behave: string): number {
  for (let i = 0; i < arPeer.sex_Act.length; i++) {
    if (behave === arPeer.sex_Act[i]) {
      return i;
    }
  }
  return 0;
}

}
