import { Screen } from './Screen'; // Assuming you have a Screen module
import { itHero } from './itHero'; // Assuming you have an itHero module
import { Constants } from './Constants'; // Assuming you have a Constants module
import { Tools } from './Tools'; // Assuming you have a Tools module
import { Portrait } from './Portrait'; // Assuming you have a Portrait module

class arHealer extends Screen {
  tools: HTMLButtonElement[];
  cost: number[];
  static text = ["Minor Healing", "Half Healing", "Full Healing", "Tithe", "Cure Disease"];
  static greeting = [
    null,
    "How may I aid thee?",
    "Please let me help",
    "Care for a massage?",
    "Let me heal thy aches",
    "Thou art distressed",
    "Thou art disturbed",
    "Share with the poor",
    "Can you spare some marks?",
    "Tithe for thy soul",
    "Alms for the poor?"
  ];

  constructor(from: Screen) {
    super(from, "Elden Bishop's Temple of Brotherly Sharing");
    this.setBackground(new Color(128, 255, 128));
    this.setForeground(Color.black);
    this.setFont(Tools.textF);
  }

  localPaint(g: Graphics): void {
    super.localPaint(g);
    this.updateTools();
  }

  action(e: Event, o: any): boolean {
    const h: itHero = Tools.getHero();
    const wounds: number = h.getWounds();
    const level: number = h.getLevel();
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    for (let i = 0; i < this.tools.length; i++) {
      if (e.target === this.tools[i]) {
        h.subMoney(this.cost[i]);
        switch (i) {
          case 0:
            h.subWounds(wounds / 4);
            break;
          case 1:
            h.subWounds(wounds / 2);
            break;
          case 2:
            h.subWounds(wounds);
            break;
          case 3:
            if (level + 14 <= h.getAge()) {
              h.learn(this.cost[3] / (level * level));
              const num: number = h.getRaise();
              if (h.getExp() > num) {
                h.getStatus().fix(Constants.EXP, num);
              }
            }
            break;
          case 4:
            h.getTemp().zero("Disease");
            h.getTemp().clrTrait("Blind");
            h.getTemp().clrTrait("Panic");
            break;
        }
        break;
      }
    }
    this.repaint();
    return super.action(e, o);
  }

  createTools(): void {
    arHealer.greeting[0] = `Be brave like ${String(Tools.getPlayer().getBest())}`;
    this.addPic(new Portrait("Exit.jpg", 320, 230, 64, 32));
    this.addPic(new Portrait("Faces/Elden.jpg", Tools.select(arHealer.greeting), 10, 30, 144, 192));
    const i: number = arHealer.text.length;
    this.tools = new Array(i);
    this.cost = new Array(i);
    for (let i2 = 0; i2 < this.tools.length; i2++) {
      this.tools[i2] = document.createElement('button');
      this.tools[i2].style.position = 'absolute';
      this.tools[i2].style.left = '180px';
      this.tools[i2].style.top = `${40 + i2 * 30}px`;
      this.tools[i2].style.width = '180px';
      this.tools[i2].style.height = '25px';
      this.tools[i2].style.font = 'Tools.statusF';
    }
  }

  addTools(): void {
    for (let i = 0; i < this.tools.length; i++) {
      this.add(this.tools[i]);
    }
  }

  updateTools(): void {
    const h: itHero = Tools.getHero();
    const cash: number = h.getMoney();
    const wounds: number = h.getWounds();
    const disease: number = h.disease();
    let level: number = h.getLevel() - h.getSocial() - 1;
    const mercy: boolean = h.getLevel() === 1;
    if (level < 1) {
      level = 1;
    }
    this.cost[0] = mercy ? 0 : (wounds / 4) * level;
    this.cost[1] = mercy ? 0 : (wounds / 2) * level;
    this.cost[2] = wounds < 1 ? 0 : mercy ? 1 : wounds * level;
    this.cost[3] = (cash + 9) / 10;
    this.cost[4] = (disease > 0 || h.hasTrait("Blind") || h.hasTrait("Panic")) ? (mercy ? 1 : 10 * level) : 0;
    for (let i = 0; i < this.tools.length; i++) {
      this.tools[i].disabled = this.cost[i] === 0 || cash < this.cost[i];
      this.tools[i].textContent = `${arHealer.text[i]} $${this.cost[i]}`;
    }
  }
}
