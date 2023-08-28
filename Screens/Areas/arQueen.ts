import { Color, Event, Graphics } from 'java.awt';
import { Screen } from './Screen';
import { arqBoast, arqDice, arqGame, arqMingle } from './Areas/Queen';
import { Indoors } from './Template/Indoors';
import { arNotice } from './Utility/arNotice';
import { arPackage } from './Utility/arPackage';
import { Constants } from '../Static/Constants';
import { GameStrings } from '../Static/GameStrings';
import { MadLib } from '../Tools/MadLib';
import { Tools } from '../Tools/Tools';

export class arQueen extends Indoors {
  hero = Screen.getHero();
  tools: java.awt.Button[];
  petition: java.awt.Button;
  invest: java.awt.Button;

  static MAXIMUM_RANK = 9;
  static INVEST_DANGER = 9;
  static PETITION_COST = 5000;
  static PETITION_QUEST = 3;
  static INVEST_COST = 100000;
  static INVEST_QUEST = 5;

  static text = ["{1}Dice", "{1}Mingle", "{1}Boast", "{1}Game"];
  static greeting = [
    null,
    "What a clever little man.",
    "I'm getting bored.",
    "Tell me a story.",
    "Where have you been?",
    "Give me a good reason.",
    "OFF WITH HIS HEAD!",
    "Show me something special.",
    "You are boring me.",
    "Why should I listen?",
    "Give me a good jape."
  ];

  static investMsg = ` $TB$You enter into business with one $lordname$ , a $MAN$ of good repute. $HE$ is investing in $jobname$. If all goes well, you should see a return of $reward$ marks for your investment. The risks are $risk$ and so are the rewards.$CR$$TB$The $lordrank$ will contact you upon the morrow with word of the results.$CR$ `;

  constructor(from: Screen) {
    super(from, "Queen Beth reigns over Dragon Court");
    this.setBackground(new Color(255, 128, 128));
    this.setForeground(new Color(128, 0, 0));
  }

  getFace(): string {
    return "Faces/Ruler.jpg";
  }

  getGreeting(): string {
    let msg = Tools.select(arQueen.greeting);
    return msg === null
      ? `Have you seen ${Screen.getBest()}?`
      : msg;
  }

  update(g: Graphics): void {
    this.paint(g);
    this.updateTools();
  }

  localPaint(g: Graphics): void {
    const rank = this.hero.getSocial();
    const sex = this.hero.getGender();
    super.localPaint(g);
    if (rank < 9) {
      g.drawString(
        `${Constants.rankName[sex][rank]} to ${Constants.rankName[sex][rank + 1]}`,
        180,
        190
      );
    }
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (Screen.getQuests() > 0) {
      if (e.target === this.tools[0]) {
        Tools.setRegion(new arqDice(this));
      } else if (e.target === this.tools[1]) {
        Tools.setRegion(new arqMingle(this));
      } else if (e.target === this.tools[2]) {
        Tools.setRegion(new arqBoast(this));
      } else if (e.target === this.tools[3]) {
        Tools.setRegion(new arqGame(this));
      }
    }
    if (e.target === this.petition) {
      this.petition();
    } else if (e.target === this.invest) {
      this.invest();
    } else if (e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    return super.action(e, o);
  }

  createTools(): void {
    this.tools = new java.awt.Button[arQueen.text.length];
    for (let i = 0; i < this.tools.length; i++) {
      this.tools[i] = new java.awt.Button(arQueen.text[i]);
      this.tools[i].reshape(160 + ((i / 2) * 100), 50 + ((i % 2) * 40), 90, 25);
      this.tools[i].setFont(Tools.statusF);
    }
    this.petition = new java.awt.Button(`{3} Petition $${arQueen.PETITION_COST}`);
    this.petition.reshape(170, 200, 170, 25);
    this.petition.setFont(Tools.statusF);
    this.petition.show(Screen.getSocial() < 9);
    this.invest = new java.awt.Button(`{5}Invest $${arQueen.INVEST_COST}`);
    this.invest.reshape(170, 130, 170, 25);
    this.invest.setFont(Tools.statusF);
    this.updateTools();
  }

  addTools(): void {
    for (let i = 0; i < this.tools.length; i++) {
      this.add(this.tools[i]);
    }
    this.add(this.petition);
    this.add(this.invest);
  }

  updateTools(): void {
    const rank = Screen.getSocial();
    const cash = Screen.getMoney();
    const quests = Screen.getQuests();

    for (let i = 0; i < this.tools.length; i++) {
      this.tools[i].enable(quests >= 1);
    }

    if (cash < 1000) {
      this.tools[0].enable(false);
    }

    this.petition.enable(quests >= arQueen.PETITION_QUEST && cash >= arQueen.PETITION_COST);
    this.petition.show(rank < arQueen.MAXIMUM_RANK);

    this.invest.enable(cash >= arQueen.INVEST_COST && quests >= arQueen.INVEST_QUEST);
  }

    synchronized void invest() {
    int rank;
    if (Screen.getQuests() >= 5
        && Screen.getMoney() >= INVEST_COST
        && (rank = (Screen.getSocial() + Tools.roll(4)) - 1) >= 0
        && rank <= 11) {
      int risk = (rank + Tools.roll(rank + 2)) / 3;
      int gain = 0;
      int index = Tools.fourTest(this.hero.getWits(), 20 + (risk * 40));
      int reward = (INVEST_COST * (23 + (risk * 3))) / 20;
      MadLib msg = new MadLib(investMsg.concat(String.valueOf(String.valueOf(investFeel[index]))));
      MadLib note =
          new MadLib(investNote.concat(String.valueOf(String.valueOf(investText[index]))));
      switch (index) {
        case 0:
          note = new MadLib(investText[0]);
          note.replace(
              "$official$",
              String.valueOf(
                  String.valueOf(
                      new StringBuffer(String.valueOf(String.valueOf(Tools.select(officialTitle))))
                          .append(" ")
                          .append(Tools.select(GameStrings.Names)))));
          gain = 0;
          break;
        case 1:
          gain = INVEST_COST / 2;
          break;
        case 2:
          msg.append(this.hero.gainExp((risk * 5) + rank));
          msg.append(this.hero.gainWits(5));
          gain = INVEST_COST;
          break;
        case 3:
          msg.append(this.hero.gainExp((risk * 10) + rank));
          msg.append(this.hero.gainWits(10));
          gain = reward;
          break;
        case 4:
          gain = (reward * 3) / 2;
          msg.replace("$bonus$", "".concat(String.valueOf(String.valueOf(gain - reward))));
          msg.append(this.hero.gainExp((risk * 15) + rank));
          msg.append(this.hero.gainWits(15));
          break;
      }
      String name =
          String.valueOf(String.valueOf(Constants.rankTitle[rank]))
              .concat(String.valueOf(String.valueOf(Tools.select(GameStrings.Names))));
      int sex = Tools.roll(2);
      note.replace("$lordname$", name);
      note.replace("$rank$", this.hero.getRankTitle());
      note.replace("$name$", this.hero.getName());
      note.replace("$today$", Tools.getToday());
      msg.replace("$lordname$", name);
      msg.replace("$lordrank$", Constants.rankName[sex][rank]);
      msg.replace("$jobname$", Tools.select(investJobs[risk]));
      msg.replace("$cost$", "".concat(String.valueOf(String.valueOf((int) INVEST_COST))));
      msg.replace("$risk$", investRisk[risk]);
      msg.replace("$reward$", "".concat(String.valueOf(String.valueOf(reward))));
      msg.genderize(sex == 0);
      itList mail = new itList(Constants.MAIL);
      mail.append(new itNote("Letter", name, note.getText()));
      if (gain > 0) {
        mail.add(new itCount("Marks", gain));
      }
      Screen.subMoney(INVEST_COST);
      this.hero.addFatigue(5);
      if (!Screen.saveHero()) {
        Screen.addMoney(INVEST_COST);
        this.hero.subFatigue(5);
        Tools.setRegion(new arNotice(getHome(), GameStrings.SAVE_CANCEL));
        return;
      }
      String result = arPackage.send(name, this.hero.getName(), mail);
      if (result != null) {
        Screen.addMoney(INVEST_COST);
        this.hero.subFatigue(5);
        Tools.setRegion(
            new arNotice(
                this, GameStrings.MAIL_CANCEL.concat(String.valueOf(String.valueOf(result)))));
        return;
      }
      Tools.setRegion(new arNotice(this, msg.getText()));
    }
  }

  synchronized void petition() {
    Screen next;
    int rank = Screen.getSocial();
    int cost = Constants.rankCost[rank];
    int sex = this.hero.getGender();
    if (Screen.getQuests() >= 3 && Screen.getMoney() >= PETITION_COST) {
      this.hero.addFatigue(3);
      Screen.subMoney(PETITION_COST);
      this.hero.addFavor(PETITION_COST);
      int index =
          ((this.hero.hasTrait(Constants.POPULAR)
                      ? this.hero.getFavor() / 700
                      : this.hero.getFavor() / 1000)
                  * 4)
              / cost;
      if (index > 4) {
        index = 4;
      }
      MadLib msg = new MadLib(petitionText[index]);
      msg.replace("$newrank$", Constants.rankName[sex][rank + 1]);
      msg.replace("$name$", this.hero.getName());
      switch (index) {
        case 0:
          next = new arNotice(new arTown(), msg.getText());
          break;
        case 1:
        case 2:
        case 3:
          next = new arNotice(this, msg.getText());
          break;
        default:
          this.hero.getStatus().zero(Constants.FAVOR);
          this.hero.addRank(Constants.SOCIAL, 1);
          this.hero.addStatus(Constants.FAME, this.hero.getSocial() * 100);
          next = new arNotice(this, msg.getText());
          break;
      }
      Tools.setRegion(next);
    }
}


  public static String Recommend() {
    itHero hero = Screen.getHero();
    return ((hero.hasTrait(Constants.POPULAR) ? hero.getFavor() / 700 : hero.getFavor() / 900)
                < Constants.rankCost[hero.getSocial()]
            || Tools.roll(2) > 0)
        ? ""
        : recommendMsg;
}

}

}
