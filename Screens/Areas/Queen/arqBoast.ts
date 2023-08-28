import { arNotice } from './path-to-arNotice-module';
import { Constants } from './path-to-Constants-module';
import { GameStrings } from './path-to-GameStrings-module';
import { itHero } from './path-to-itHero-module';
import { Screen } from './path-to-Screen-module';
import { arCastle } from './path-to-arCastle-module';
import { arQueen } from './path-to-arQueen-module';
import { MadLib } from './path-to-MadLib-module';
import { Tools } from './path-to-Tools-module';

export class arqBoast extends arNotice {
  static BOASTRISK = 10;
  static boastMsg =
    '$TB$You corner $lordname$ and start spilling your tales of adventure throughout the realm. You dramatize this narrative by leaping onto tables and swinging candelabras as makeshift weaponry.$CR$';
  static boastText = [
    '$TB$Your narrative is going well, when quite by accident you $accident$$CR$$TB$You apologize profusely, but the guardsmen grab you by the collar, take half your purse for damages and eject you from the premises.$CR$',
    "$TB$$lordname$'s frown grows deeper and deeper as you blather continuously about the inummerable goblins, rodents, and boars you have slain in your day.$CR$$TB$Finally, $HE$ interrupts you, declares you a bore and a liar and stomps away indignantly for having wasted $his$ time.$CR$",
    "$TB$The $lordrank$ bears an amused smile throughout your discourse.  When your tale is concluded, $HE$ thanks you for the opportunity to wax nostalgic and dream about $HIS$ own halcyon days of youth.$CR$",
    '$TB$The $lordrank$ listens with fascination for the better part of an hour.  $HE$ is favorably impressed by your courage and heroism and agrees to take up your case with the queen.$CR$',
    '$TB$The $lordrank$ becomes the core of an admiring knot of listeners.  When you finish they all applaud.$CR$$TB$The $lordrank$ shakes your hand and thanks you heartily for such a terrifically inspiring tale of braggadocio and derring-do.  $HE$ further declares you to be a credit and inspiration to the entire court.$CR$',
  ];
  static accidents = [
    'smash an antique burial urn.',
    'step on the dinner platter.',
    'slip and fall into the fireplace.',
    'hurl a drumstick into the Queen\'s lap.',
    'kick the Queen\'s favorite wolf-hound.',
    'skid and rip your trews wide open.',
    'throw wine on the Queen\'s portrait.',
    'refer to the Queen as \'a bit of rumpy-pumpy\'.',
    'swing on the chandelier, carrying it and you into a drunken group of visiting dignitaries who proceed to pummel you senseless with their oddly shaped walking sticks.',
  ];

  constructor(from: Screen) {
    super(from, 'arqBoast');
    this.prepareText(from);
  }

  prepareText(from: Screen): void {
    const h = Screen.getHero() as itHero;
    let rank = 1 + Tools.roll(h.getSocial() + Tools.roll(3));
    if (rank > 10) {
      rank = 10;
    }
    const level = (rank * 2) + Tools.roll(rank * 2);
    const skill = h.getCharm() + (h.fight() * 5);
    const favor = h.getFavor();
    h.addFatigue(1);
    const index = Tools.fourTest(skill, level * arqBoast.BOASTRISK);
    const msg = new MadLib(arqBoast.boastMsg.concat(arqBoast.boastText[index]));
    switch (index) {
      case 0:
        h.subMoney(Math.floor(h.getMoney() / 2));
        h.subFavor(Math.floor(favor / (12 - rank)));
        break;
      case 1:
        h.subFavor(Math.floor(favor / (14 - rank)));
        break;
      case 2:
        msg.append(h.gainExp(rank + level));
        msg.append(h.gainCharm(4));
        break;
      case 3:
        msg.append(h.gainExp((rank * 2) + level));
        msg.append(h.gainCharm(7));
        h.addFavor(Math.floor(favor / (14 - rank)));
        break;
      case 4:
        msg.append(h.gainExp((rank * 5) + level));
        msg.append(h.gainCharm(10));
        h.addFavor(Math.floor(favor / (12 - rank)));
        break;
    }
    msg.append(arQueen.Recommend());
    msg.replace(
      '$lordname$',
      `${Constants.rankTitle[rank]}${Tools.select(GameStrings.Names)}`,
    );
    const strArr = Constants.rankName;
    const sex = Tools.roll(2);
    msg.replace('$lordrank$', strArr[sex][rank]);
    msg.replace('$accident$', Tools.select(arqBoast.accidents));
    msg.genderize(sex === 0);
    if (index === 0) {
      this.setHome(new arCastle());
    } else {
      this.setHome(from);
    }
    this.setMessage(msg.getText());
  }
}
