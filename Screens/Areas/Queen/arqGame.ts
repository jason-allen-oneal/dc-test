import { arNotice } from './path-to-arNotice-module';
import { itHero } from './path-to-itHero-module';
import { Screen } from './path-to-Screen-module';
import { MadLib } from './path-to-MadLib-module';
import { Tools } from './path-to-Tools-module';

export class arqGame extends arNotice {
  static readonly gameMsg =
    "$TB$Your friends tell you about the latest craze from $country$.  It's called $game$$CR$";
  static readonly game = [
    "Wickets.  You whack a wooden ball with a mallet and try to knock down a standing stick called a wicket while a team of nine men try to stop you.",
    "Nine Pins. You set up ten pegs in a triangle formation. then take turns throwing a ball to bowl them down.",
    "Croquette.  You knock a wooden ball through little hoops and try to hit a standing stick.",
    "Golfing. You knock a small ball with a stick and try to drop it into a hole with the fewest swings.",
    "Badmitton.  Two players enter a court, then knock a feathered ball over a net and off the walls.",
    "Poloball.  You ride a horse around whacking a wooden ball with a mallet.  You score by shooting into a goal box.",
    "Scrumming. Two teams face off over an inflated pigs bladder. They charge at each other and try to push the balloon across an end line.",
    "Fisticuffs. Two to six men face off in a ring wielding nothing more than their bare knuckles.  Points are scored by striking the face and shoulders.",
  ];
  static readonly accident = [
    "accidently smash your hand",
    "run headfirst into a wall",
    "trip and wrench your ankle",
    "jump and bang your head",
    "turn and twist your knee",
    "throw out your back",
  ];
  static readonly country = [
    "Hie Brasil",
    "Shangala",
    "Orehwon",
    "the Troll Dominion",
    "Alfheim",
    "Raynoma",
    "Farstael",
    "Ter Winache",
  ];
  static readonly result = [
    "$TB$You bumble about clumsily, fowling your opponents and tripping up repeatedly. When you $accident$ your mates kick you out of the game.$CR$$TB$Later that the day, everyone is whispering and giggling whenever you aren't looking.$CR$$CR$$TB$$TB$*** you take -$hurt$ wounds ***",
    "$TB$You play as hard as you can, but for some reason you just can't quite get the hang of things. You remain scoreless for the day.$CR$$TB$After the game, your friends try to cheer you up. They pretend that noone likes this game, but you know that's a lie.$CR$",
    "$TB$You charge about with strength and enthusiam. You score once and so do some of your mates.$CR$$TB$When all the scores are tallied, things are about even.Everyone declares the game to be great good fun and vow to play it daily.$CR$",
    "$TB$You charge about with verve and force.  You score several times, impressing the crowds.$CR$$TB$When the scores are tallied, you are found to be ahead of everyone.  Your mates congratulate and express their admiration.$CR$",
    "$TB$You play with an unmatched skill that devestates the opposition. You stop all their points, and score with complete impunity.$CR$$TB$At the end of play, the crowds charge forward and bear you on their shoulders while loudly chanting your name.$CR$",
  ];
  static readonly SMASHED =
    "\tYou are wounded mortally and fall to the ground. Your friends crowd around looking worried and confused. Finally, someone sends for the healers.  You are carried to the monastery where your life is refreshed.\n";

  constructor(from: Screen) {
    super(from, arqGame.prepareText());
    const h = Screen.getHero() as itHero;
    if (h.getWounds() >= h.getGuts()) {
      this.setHome(h.killedScreen(this, arqGame.SMASHED, false));
    }
  }

  static prepareText(): string {
    const h = Screen.getHero() as itHero;
    const rank = Tools.roll(6) + Tools.roll(3);
    const level = h.getLevel();
    const skill = h.getGuts();
    const favor = h.getFavor();
    h.addFatigue(1);
    const index = Tools.fourTest(skill, (1 + rank) * 20);
    const msg = new MadLib(arqGame.gameMsg.concat(arqGame.result[index]));
    switch (index) {
      case 0:
        const num = ((1 + Tools.twice(3)) * h.getGuts()) / 10;
        h.addWounds(num);
        h.subFavor(favor / (12 - rank));
        msg.replace('$hurt$', num.toString());
        break;
      case 1:
        h.subFavor(favor / (14 - rank));
        break;
      case 2:
        msg.append(h.gainExp(rank + level));
        msg.append(h.gainGuts(4));
        break;
      case 3:
        msg.append(h.gainExp((rank * 2) + level));
        msg.append(h.gainGuts(7));
                h.addFavor(favor / (14 - rank));
        break;
      case 4:
        msg.append(h.gainExp((rank * 5) + level));
        msg.append(h.gainGuts(10));
        h.addFavor(favor / (12 - rank));
        break;
    }
    msg.append(arQueen.Recommend());
    msg.replace('$country$', Tools.select(arqGame.country));
    msg.replace('$game$', arqGame.game[rank]);
    msg.replace('$accident$', Tools.select(arqGame.accident));
    return msg.getText();
  }
}

