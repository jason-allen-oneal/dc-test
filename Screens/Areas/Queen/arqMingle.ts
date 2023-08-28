import itHero from './path-to-itHero'; // Update the path accordingly
import arQueen from './path-to-arQueen'; // Update the path accordingly
import arNotice from './path-to-arNotice'; // Update the path accordingly
import Constants from './path-to-Constants'; // Update the path accordingly
import GameStrings from './path-to-GameStrings'; // Update the path accordingly
import MadLib from './path-to-MadLib'; // Update the path accordingly
import Tools from './path-to-Tools'; // Update the path accordingly

class arqMingle extends arNotice {
  static MINGLERISK: number = 5;
  static mingleMsg: string =
    "$TB$You engage $lordname$ in conversation. $interests$$CR$";
  static mingleText: string[] = [
    "$TB$Five minutes pass while you describe your bladder problems to $lordname$.  $HE$ smiles in a strained fashion and takes $his$ leave as soon as possible.$CR$$TB$Perhaps you could have been a little more attentive.$CR$",
    "$TB$The $lordrank$ is a terrific conversationalist. $HE$ smiles and nods for several minutes while you speak at some length about your adventures and aspirations.$CR$$TB$You part company thinking that you have made great success with ... uh ... what was $his$ name again? $CR$",
    "$TB$You exchange friendly banter with the noble for several minutes.  You fail to find any topic of common interest and thus part ways a short time later.$CR$$TB$Well, at least you have offended noone.$CR$",
    "$TB$You listen attentively while $lordname$ describes $HIS$ pursuits.  You nod and smile at all the appropriate points during $HIS$ stories.$CR$$TB$The $lordrank$ is favorably impressed by your intelligence and acumen.  $HE$ invites you to come visit at $HIS$ estates sometime.$CR$$TB$You have won another friend in the Dragon Court.$CR$",
    "$TB$You listen with grave attention as the $lordrank$ describes $his$ pursuits.  You wax enthusiastic and make knowledgeable comments on the topic.$CR$$TB$ $lordname$ thanks you for the delightful conversation and expresses interest in your future career. You have earned yourself a staunch ally in the Dragon Court.$CR$"
  ];

  constructor(from: Screen) {
    super(from, arqMingle.prepareText());
  }

  static prepareText(): string {
    const h: itHero = Screen.getHero();
    let rank: number = 1 + Tools.roll(2 + h.getSocial());
    if (rank > 10) {
      rank = 10;
    }
    const level: number = rank * 2 + Tools.roll(rank * 2);
    const skill: number = h.getCharm() + h.magic() * 5;
    const favor: number = h.getFavor();
    h.addFatigue(1);
    const msg: MadLib = new MadLib(
      arqMingle.mingleMsg.concat(
        String.valueOf(
          String.valueOf(
            arqMingle.mingleText[Tools.fourTest(skill, level * arqMingle.MINGLERISK)]
          )
        )
      )
    );
    const testResult: number = Tools.fourTest(skill, level * arqMingle.MINGLERISK);
    switch (testResult) {
      case 0:
        h.subFavor(favor / (14 - rank));
        break;
      case 1:
        h.subFavor(favor / (17 - rank));
        break;
      case 2:
        msg.append(h.gainExp(rank + level));
        msg.append(h.gainCharm(4));
        break;
      case 3:
        msg.append(h.gainExp(rank * 2 + level));
        msg.append(h.gainCharm(7));
        h.addFavor(favor / (17 - rank));
        break;
      case 4:
        msg.append(h.gainExp(rank * 5 + level));
        msg.append(h.gainCharm(10));
        h.addFavor(favor / (14 - rank));
        break;
    }
    msg.append(arQueen.Recommend());
    msg.replace(
      "$lordname$",
      String.valueOf(String.valueOf(Constants.rankTitle[rank]))
        .concat(String.valueOf(String.valueOf(Tools.select(GameStrings.Names))))
    );
    const strArr: string[][] = Constants.rankName;
    const sex: number = Tools.roll(2);
    msg.replace("$lordrank$", strArr[sex][rank]);
    msg.replace("$interests$", Tools.select(GameStrings.interests));
    msg.genderize(sex === 0);
    return msg.getText();
  }
}
