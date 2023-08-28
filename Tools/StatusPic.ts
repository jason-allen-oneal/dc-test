import { Portrait } from "./DCourt/Components/Portrait"; // Replace with appropriate imports
import { itHero } from "./DCourt/Items/List/itHero"; // Replace with appropriate imports
import { arHills } from "./DCourt/Screens/Wilds/arHills"; // Replace with appropriate imports
import { arMound } from "./DCourt/Screens/Wilds/arMound"; // Replace with appropriate imports
import { ArmsTrait } from "./DCourt/Static/ArmsTrait"; // Replace with appropriate imports
import { Constants } from "./DCourt/Static/Constants"; // Replace with appropriate imports
import { Color } from "./java/awt/Color"; // Replace with appropriate imports
import { Graphics } from "./java/awt/Graphics"; // Replace with appropriate imports

class StatusPic extends Portrait implements Constants {
  constructor() {
    super("Status.gif", 0, 265, Tools.DEFAULT_WIDTH, 35); // Assuming `Tools.DEFAULT_WIDTH` is accessible
    setFont(Tools.textF); // Assuming `Tools.textF` is accessible
  }

  paint(g: Graphics): void {
    let msg: string;
    const hp: itHero = Tools.getHero(); // Assuming `Tools.getHero()` is accessible
    g.setFont(this.getFont());
    g.setColor(Color.white);
    if (this.getIcon() != null) {
      g.drawImage(this.getIcon(), 0, 0, this);
    }
    if (hp != null) {
      const w: number = hp.getWounds();
      g.drawString(
        `${hp.getTitle()}${hp.getName()}  Guts:${hp.getGuts() - w}${w < 1 ? "" : `/${hp.getGuts()}`} Wits:${hp.getWits()} Charm:${hp.getCharm()}  Cash: $${hp.getMoney()}`,
        10,
        15
      );
      const msg2: string = `   Quests:${hp.getQuests()}  Level:${hp.getLevel()}  Exp:${hp.getExp()}  `;
      g.drawString(msg2, 10, 30);
      if (Tools.getRegion() instanceof arMound) {
        if (hp.hasTrait(Constants.CATSEYES)) {
          msg = `${msg2}Cats Eyes`;
        } else {
          const it = hp.getGear().findArms(ArmsTrait.GLOWS);
          msg =
            it != null
              ? `${msg2}glowing ${it.getName()}`
              : `${msg2}Torch (${hp.packCount("Torch")})`;
        }
      } else if (Tools.getRegion() instanceof arHills) {
        msg = hp.hasTrait(Constants.HILLFOLK) ? `${msg2}Hill Folk` : `${msg2}Rope (${hp.packCount("Rope")})`;
      } else {
        msg = `${msg2}${hp.getWeapon()} & ${hp.getArmour()}`;
      }
      g.drawString(msg, 10, 30);
    }
  }
}
