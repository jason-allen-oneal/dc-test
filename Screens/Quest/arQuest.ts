import {
  Color,
  Event,
  FontMetrics,
  Graphics,
  Screen,
} from 'java.awt';

import {
  Constants,
  GearTypes,
  QuestStrings,
} from 'DCourt.Static';

import {
  itHero,
  itList,
  itMonster,
} from 'DCourt.Items.List';

import {
  arNotice,
  arStatus,
} from 'DCourt.Screens.Utility';

import {
  Breaker,
  DrawTools,
  Options,
  Tools,
} from 'DCourt.Tools';

class arQuest extends Screen implements QuestStrings, GearTypes {
  private mob: itMonster;
  private hero: itHero;
  private opt: Options;
  private weight: number;
  private gate: Screen;
  private static trains = "\tYou are taken to a remote location in the forest where you undergo a bizarre training regimen.  You shower naked beneath a freezing waterfall.  You eat nothing but rice and fish.  You must sit for hours in a lotus position while contemplating the sound of a single hand clapping.\n\tWhen the time comes to draw your blade, you find that an unheralded clarity of vision guides your stroke.\n\t\t\tYour Training is Complete\n\n<<< You Have Gained in Samurai Skill >>>\n\n\t*** The Cost to Your Body is Severe ***\n\t*** -3 Guts  -3 Wits  -3 Charm ***\n";

  constructor(a: Screen, n: Screen, w: number, m: string, b: itMonster) {
    super(a, m);
    this.gate = n;
    this.init(a, w, m, b);
  }

  private init(from: Screen, wgt: number, msg: string, beast: itMonster): void {
    super.init();
    this.opt = null;
    this.weight = 0;
    this.gate = null;
    this.gate = this.getHome();
    this.setBackground(new Color(255, 255, 0));
    this.setForeground(Color.black);
    this.setFont(Tools.courtF);
    this.weight = wgt;
    this.hero = Screen.getHero();
    this.mob = <itMonster>beast.copy();
    this.mob.balance(this.weight);
    this.opt = new Options(this.mob.getOptions());
    this.opt.reshape(180, 20, 200, 110);
    this.hero.addFatigue(1);
    this.hero.resetActions();
    this.mob.resetActions();
    this.mob.chooseActions(true);
  }

    public init(): void {
    super.init();
    if (Screen.getActions().isMatch(Constants.SPELLS)) {
      Tools.setRegion(this.applyChoice(16));
    }
    this.opt.fixList();
  }

  public addTools(): void {
    this.addPic(this.mob.getPicture());
    this.getPic(0).reshape(10, 10, 160, 160);
    this.add(this.opt);
    super.addTools();
  }

  public localPaint(g: Graphics): void {
    g.setFont(Tools.courtF);
    g.setColor(Color.blue);
    DrawTools.center(g, this.getTitle(), 280, 15);
    g.setColor(new Color(0, 128, 0));
    const hurt = this.mob.getWounds();
    g.drawString(
      `Guts: ${this.mob.getGuts() - hurt}${hurt > 0 ? `/${this.mob.getGuts()}` : ''}`,
      180,
      145
    );
    DrawTools.right(g, this.mob.getWeapon(), 390, 145);
    g.drawString(`Wits: ${this.mob.getWits()}`, 180, 165);
    DrawTools.right(g, this.mob.getArmour(), 390, 165);
    g.setColor(Color.black);
    g.setFont(Tools.questF);
    const fm: FontMetrics = g.getFontMetrics(g.getFont());
    const jump: number = fm.getAscent() + fm.getDescent();
    const lines: Breaker = new Breaker(this.mob.getText(), fm, 380, false);
    let ix: number = 0;
    while (ix < 5 && ix < lines.lineCount()) {
      g.drawString(lines.getLine(ix), 10, 175 + fm.getAscent() + ix * jump);
      ix++;
    }
  }

  public action(e: Event, o: Object): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target == Tools.statusPic) {
      Tools.setRegion(new arStatus(this, true));
    }
    if (e.target != this.opt) {
      return true;
    }
    Tools.setRegion(this.applyChoice(this.opt.select()));
    return true;
  }

  public battleActionResult(): void {
    let next: Screen;
    if (this.hero.isDead()) {
      next = this.hero.killedScreen(getHome(), null, true);
    } else if (this.hero.isControl()) {
      next = this.heroControls('');
    } else if (this.hero.isSwindle()) {
      next = this.heroSwindles();
    } else if (this.mob.isDead()) {
      next = this.heroWins();
    } else if (this.mob.isControl()) {
      next = this.mobControls('');
    } else if (this.mob.isSwindle()) {
      next = this.mobSwindles();
    } else {
      this.hero.resetActions();
      this.opt.nextRound(this.hero, this.mob);
      this.mob.resetActions();
      this.mob.chooseActions(false);
      next = this;
    }
    Tools.setRegion(next);
  }

  public applyChoice(choice: number): Screen {
    const ma: itList = this.mob.getActions();
    const ha: itList = this.hero.getActions();
    switch (choice) {
      case 0:
        return this.tryBribe();
      case 1:
        return this.trySupply(GearTypes.FOOD, 1);
      case 2:
        return this.tryRiddle();
      case 3:
        return this.tryTrade();
      case 4:
        return this.tryAssist();
      case 5:
        return this.trySeduce();
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      default:
        switch (choice) {
          case 6:
            ha.setName('Control');
            break;
          case 7:
            ha.setName(Constants.BACKSTAB);
            break;
          case 8:
            ha.setName(Constants.BERZERK);
            break;
          case 9:
            ha.setName('Swindle');
            break;
          case 10:
            ha.setName(Constants.IEATSU);
            break;
          case 11:
            ha.setName(Constants.ATTACK);
            break;
          case GearTypes.EFF_BLESS:
            ha.setName(Constants.SPELLS);
            break;
        }
        if (ma.isMatch(Constants.RUNAWAY)) {
          return this.mobFlees();
        }
        if (ha.isMatch(ma.getName())) {
          switch (choice) {
            case 6:
              return this.stareDown();
            case 9:
              return this.swapGoods();
          }
        }
        return new arBattle(this, null);
      case GearTypes.EFF_AGING:
        return this.tryFlee();
      case GearTypes.EFF_FACELESS:
        return this.trySupply(GearTypes.FISH, 13);
      case GearTypes.EFF_SCRIBE:
        return this.tryToken();
      case GearTypes.EFF_GLOW:
        return this.tryCapture();
    }
  }

  public getMob(): itMonster {
    return this.mob;
  }
  
    public heroWins(): Screen {
    let msg: string;
    const exp: number =
      this.mob.baseExp() +
      (((2 * this.mob.getGuts() + this.mob.getWits() + this.mob.getCharm()) * this.weight) / 4);
    this.hero.setState(Constants.VICTORY);
    let msg2 =
      `You have slain the ${this.mob.getName()} with tremendous valor.\n` +
      `${Screen.packString('\nYou Find: ', this.mob.getPack())}`;
    this.hero.getPack().merge(this.mob.getPack());
    if (this.hero.getOverload() > 0) {
      msg2 = `${msg2}*** YOUR PACK IS OVERLOADED ***\n`;
    }
    const msg3 = `${msg2}${this.hero.gainExp(exp)}`;
    this.hero.addStatus(Constants.FAME, this.mob.baseFame());

    if (this.hero.getActions().isMatch(Constants.BACKSTAB)) {
      msg = `${msg3}${this.hero.gainCharm(this.weight * 3)}${this.hero.gainGuts(this.weight * 2)}`;
    } else if (this.hero.getActions().isMatch(Constants.BERZERK)) {
      msg = `${msg3}${this.hero.gainGuts(this.weight * 5)}`;
    } else {
      msg = `${msg3}${this.hero.gainGuts(this.weight)}`;
    }

    return new arNotice(this.gate, msg);
  }

  public tryBribe(): Screen {
    let msg: string;
    const exp: number = this.mob.baseExp();
    const num: number = (this.weight * (this.mob.getGuts() + this.mob.getWits())) / 2;
    const cost: number = this.hero.subMoney(num);

    if (
      cost >= num &&
      Tools.contest(this.hero.bribeCharm(), this.mob.bribeCharm())
    ) {
      let msg2 = `You have averted conflict by paying the ${this.mob.getName()} ${cost} marks...\n`;
      msg2 = `${msg2}${this.hero.gainExp(exp)}${this.hero.gainCharm(this.weight)}`;
      this.hero.subFatigue(1);
      return new arNotice(this.gate, msg2);
    } else if (this.mob.isAggresive()) {
      this.mob.addMoney(cost);
      return new arBattle(
        this,
        `The ${this.mob.getName()} takes ${cost} marks, then attacks!\n`
      );
    } else {
      if (this.mob.isHostile()) {
        this.mob.addMoney(cost);
        msg = `The ${this.mob.getName()} takes ${cost} marks, then laughs at you!`;
      } else {
        this.hero.addMoney(cost);
        msg = `The ${this.mob.getName()} refuses your money...`;
      }
      this.opt.remove(0);
      return new arNotice(this, msg);
    }
  }

  public trySupply(id: string, choice: number): Screen {
    let msg: string;
    const exp: number = this.mob.baseExp();
    const num: number = (this.mob.getGuts() + 4) / 5;
    const cost: number = this.hero.subPack(id, num);

    if (
      cost >= num &&
      Tools.contest(this.hero.feedCharm(), this.mob.feedCharm())
    ) {
      let msg2 = `The ${this.mob.getName()} chows down on ${cost} ${id}, then waddles away with satisfaction...\n`;
      msg2 = `${msg2}${this.hero.gainExp(exp)}${this.hero.gainCharm(this.weight)}`;
      this.hero.subFatigue(1);
      return new arNotice(this.gate, msg2);
    } else if (this.mob.isAggresive()) {
      return new arBattle(
        this,
        `The ${this.mob.getName()} eats your ${id}...then it attacks!\n`
      );
    } else {
      if (this.mob.isHostile()) {
        msg = `The ${this.mob.getName()} eats ${cost} ${id}...then blocks your path!\n`;
      } else {
        this.hero.addPack('food', cost);
        msg = `The ${this.mob.getName()} turns up its nose at your ${id}...\n`;
      }
      this.opt.remove(choice);
      return new arNotice(this, msg);
    }
  }

  public tryTrade(): Screen {
    const exp: number = this.mob.baseExp();
    const num: number = this.weight * (this.mob.getCharm() + this.mob.getWits());
    const cost: number = this.hero.subMoney(num);
    const gear: itList = new itList(this.mob.getPack());
    gear.zero('marks');

    if (
      !gear.isEmpty() &&
      cost >= num &&
      Tools.contest(this.hero.tradeCharm(), this.mob.tradeCharm())
    ) {
      let msg = 'You flash your marks at it until an agreeable price is reached...\n';
      msg = `${msg}\nYou spend ${cost} marks.\n${Screen.packString(
        '\nYou Receive: ',
        this.mob.getPack()
      )}`;
      this.mob.getPack().zero('marks');
      const msg2 = `${msg}${this.hero.gainExp(exp)}${this.hero.gainCharm(this.weight)}`;
      this.hero.getPack().merge(this.mob.getPack());
      return new arNotice(this.gate, msg2);
    } else if (this.mob.isAggresive()) {
      this.mob.addMoney(cost);
      return new arBattle(
        this,
        `The ${this.mob.getName()} takes ${cost} marks, then attacks!\n`
      );
    } else if (this.mob.isHostile()) {
      this.mob.addMoney(cost);
      this.mob.setPassive();
      this.mob.getActions().setName(Constants.ATTACK);
      return this.mobFlees(`It steals ${cost} marks!\n`);
    } else {
      this.hero.addMoney(cost);
      const msg3 = `The ${this.mob.getName()} shows no interest in trading...\n`;
      this.opt.remove(3);
      return new arNotice(this, msg3);
    }
  }

  public tryAssist(): Screen {
    let msg: string;
    const exp: number = this.mob.baseExp();

    if (Tools.contest(this.hero.getWits(), this.mob.getWits())) {
      let msg2 =
        `\tYou manage to fix the problem!\n\n\tThe ${this.mob.getName()} is indebted to you for ` +
        `your kind assistance...\n`;

      this.mob.getPack().loseHalf();
      msg2 = `${msg2}${Screen.packString('\nYou Receive: ', this.mob.getPack())}`;
      this.hero.getPack().merge(this.mob.getPack());
      this.hero.addStatus(Constants.FAME, this.weight);
      return new arNotice(
        this.gate,
        `${msg2}${this.hero.gainExp(exp)}${this.hero.gainWits(this.weight)}`
      );
    } else if (this.mob.isAggresive()) {
      return new arBattle(
        this,
        `The ${this.mob      .getName()} attacks while you're busy!\n`
    );
  } else {
    if (this.mob.isHostile()) {
      msg =
        `\tYou can't seem to solve the problem...\n${Screen.packString(
          `\n\tThe ${this.mob.getName()} calls you a worthless loser!\n`
        )}`;
    } else {
      msg =
        `\tYou can't seem to solve the problem...\n${Screen.packString(
          `\n\tThe ${this.mob.getName()} thanks you for your efforts.\n`
        )}`;
    }
    this.opt.remove(4);
    return new arNotice(this, msg);
  }
}

  tryRiddle() {
    const exp = this.mob.baseExp();
    const which = Tools.roll(QuestStrings.riddle.length);
    let msg = `\t${QuestStrings.riddle[which]}\n\n\t`;

    if (!Tools.contest(this.hero.getWits(), this.mob.getWits())) {
      const guess = QuestStrings.guess[Tools.roll(QuestStrings.guess.length)];
      msg += `${guess}\n`;
      this.opt.remove(2);

      if (this.mob.isAggresive() || this.mob.isHostile()) {
        return new arBattle(this, `${msg}\n\tWRONG!! SCREEEEECH!!!\n`);
      }

      return new arNotice(this, `${msg}\n\tThe ${this.mob.getName()} shakes its head.\n`);
    }

    const answer = QuestStrings.answer[which];
    const answerMsg = `${answer}\n\n\tGARRGH! THAT'S RIGHT!!\n`;
    this.mob.getPack().loseHalf();

    const msg2 = `${msg}${Screen.packString("\nYou Recieve: ", this.mob.getPack())}`;
    this.hero.getPack().merge(this.mob.getPack());

    const msg3 = `${msg2}${this.hero.gainExp(exp)}`;
    this.hero.addStatus(Constants.FAME, this.weight);

    return new arNotice(this.gate, `${msg3}${this.hero.gainWits(this.weight)}`);
  }

  trySeduce() {
    const exp = this.mob.baseExp();
    const msg = `\tYou waggle your eyebrows and make kissing noises towards ${
      this.mob.getName()
    }.\n`;

    if (Tools.contest(this.hero.seduceCharm(), this.mob.seduceCharm())) {
      const seduces = Tools.select(QuestStrings.seduces);
      const msg2 = `${msg}\tIt smiles and slinks on over. ${seduces}\n\tAfterwards, ${
        this.mob.getName()
      } gives you a small token of affection\n`;

      this.mob.getPack().loseHalf();
      const msg3 = `${msg2}${Screen.packString("\nYou Recieve: ", this.mob.getPack())}`;
      this.hero.getPack().merge(this.mob.getPack());
      this.hero.addStatus(Constants.FAME, this.weight);

      return new arNotice(
        this.gate,
        `${msg3}${this.hero.gainExp(exp)}${this.hero.gainCharm(this.weight)}`
      );
    } else if (!this.mob.isPassive()) {
      return new arBattle(this, `${msg}\tIt shrieks with fury at your shallow lies and attacks!\n`);
    } else {
      return new arNotice(getHome(), `${msg}\tIt shrieks and runs away, giggling.\n`);
    }
  }

  tryFlee() {
    const exp = this.mob.baseExp() + Math.floor(this.mob.getWits() / 5);
    const tf = this.hero.thiefRank();

    if (this.mob.isPassive() || this.mob.isDefensive()) {
      this.hero.subFatigue(1);

      return new arNotice(
        getHome(),
        `\tYou run like the wind.  Fear lending flight to thy heels.\n` +
          `\tThe ${this.mob.getName()} makes no effort to pursue.\n`
      );
    } else if (this.mob.isHostile()) {
      let msg = `\tYou run like the wind.  Fear lending flight to thy heels.\n` +
        `\tThe ${this.mob.getName()} chases you for a while just to make sure you aren't coming back\n`;

      if (tf >= 2) {
        msg += this.thiefRun();
      }

      return new arNotice(getHome(), msg);
    } else {
      let hs = this.hero.runWits();

      if (this.mob.hasTrait(Constants.BANDIT)) {
        hs = Math.floor(hs / 2);
      }

      if (!Tools.contest(hs, this.mob.runWits())) {
        return new arBattle(
          this,
          `\tYou run like the wind.  Fear lending flight to thy heels.\n` +
            `\tBut the ${this.mob.getName()} proves to be swifter!\n`
        );
      }

      let msg2 = `\tThe ${this.mob.getName()} is left behind, panting. ` +
        `Your fleet feet have just saved your skin.\n`;

      if (tf >= 3) {
        msg2 += this.thiefRun();
      }

      return new arNotice(
        getHome(),
        `${msg2}${this.hero.gainExp(exp)}${this.hero.gainWits(this.weight)}`
      );
    }
  }

    stareDown() {
    this.mob.magic(1);
    this.hero.magic(1);
    this.opt.redraw();

    const msg = `\tYou and the ${this.mob.getName()} lock stares in a ferocious contest of wills...`;

    if (!Tools.contest(this.hero.getWits(), this.mob.getWits())) {
      return this.mobControls(`${msg}You blink first!\n`);
    }

    return this.heroControls(`${msg}It blinks first!\n`);
  }

  heroControls(msg: string) {
    const exp = this.mob.baseExp() + this.mob.getWits();
    const controlsMsg = QuestStrings.controls[Tools.roll(QuestStrings.controls.length)];
    let msg2 = `${msg}\tFirst you take all its treasures. Then you ${controlsMsg}\n`;

    msg2 += `${Screen.packString("\nYou Recieve: ", this.mob.getPack())}`;
    Screen.getPack().merge(this.mob.getPack());

    return new arNotice(
      this.gate,
      `${msg2}${this.hero.gainExp(exp)}${this.hero.gainWits(this.weight * 5)}`
    );
  }

  mobControls(msg: string) {
    if (!msg) {
      msg = "";
    }

    if (this.mob.isAggresive()) {
      return new arNotice(
        this.hero.killedScreen(getHome(), null, true),
        `${msg}\tOut of sheer maliciousness, the creature sends you on a long hike over a short cliff.\n`
      );
    }

    QuestStrings.controlled[0] = `convinces you that you are ${Tools.getBest()}.`;

    if (this.mob.isPassive()) {
      return new arNotice(
        getHome(),
        `${msg}\nThe ${this.mob.getName()} expresses its anger when it ${Tools.select(QuestStrings.controlled)}\n`
      );
    }

    this.hero.getPack().loseHalf();
    return new arNotice(
      getHome(),
      `${msg}\n\tFirst the ${this.mob.getName()} takes half your gear, then it ${Tools.select(QuestStrings.controlled)}\n`
    );
  }

  swapGoods() {
    this.mob.thief(1);
    this.hero.thief(1);
    this.opt.nextRound(this.hero, this.mob);

    return new arNotice(
      this,
      `\tYou and the ${this.mob.getName()} start trading gear, and before you know it... You are right back where you started???\n`
    );
  }

  heroSwindles() {
    const exp = this.mob.baseExp() + this.mob.getCharm();

    if (this.mob.subPack(GearTypes.INSURANCE, 1) === 1) {
      const msg = `\tYou start 'trading' in earnest with the ${this.mob.getName()}, rooting through its backpack as it nods enthusiastically, when you find a magic coupon: Thief Insurance.  Grumbling, you take the receipt and walk away.\n`;

      Screen.addPack(GearTypes.INSURANCE, 1);
      return new arNotice(getHome(), msg);
    }

    const msg2 = `\tYou lay out a complicated deal that the ${this.mob.getName()} is unable to follow.  By the time you are finished, it is paying you to take all its equipment.\n`;

    return new arNotice(
      this.gate,
      `${msg2}${Screen.packString("\nYou Recieve: ", this.mob.getPack())}${this.hero.gainExp(exp)}${this.hero.gainCharm(this.weight * 5)}`
    );
  }

  mobSwindles() {
    if (this.hero.subPack(GearTypes.INSURANCE, 1) === 1) {
      return new arNotice(
        getHome(),
        `\tThe ${this.mob.getName()} starts to tell you about this terrific bridge for sale in Brook Land, then it spies your Thief Insurance.  Grumbling, it snags the coupon and makes an escape!\n`
      );
    } else if (this.mob.isAggresive()) {
      const msg = `\tThe ${this.mob.getName()} starts to show you the benefits of trading goods.  Pretty soon you walk away completely satisfied with an empty backpack.\n`;

      this.hero.getPack().clrQueue();
      return new arNotice(getHome(), msg);
    } else if (this.mob.isPassive()) {
      const msg2 = `\tThe ${this.mob.getName()} sells you a 'magic' rock for ${this.hero.getMoney()} marks, and leaves you a satisfied customer.\n`;

      this.hero.getPack().zero("Marks");
      Screen.addPack("Rock", 1);
      return new arNotice(getHome(), msg2);
    } else {
      const cash = this.hero.getMoney();
      this.hero.getPack().loseHalf();
      this.hero.fixPack("Marks", Math.floor(cash / 2));

      return new arNotice(
        getHome(),
        `\tThe ${this.mob.getName()} makes an irresistible sales pitch. It only costs you ${cash - Math.floor(cash / 2)} marks for him to haul away half your gear.\n`
      );
    }
  }

  mobFlees(msg: string = null) {
    if (!msg) {
      msg = "";
    }

    const msg2 = `${msg}\tThe ${this.mob.getName()} turns and makes tracks rapidly away from you.\n`;
    let ms = this.mob.runWits();

    if (this.hero.hasTrait(Constants.BANDIT)) {
      ms = Math.floor(ms / 2);
    }

    if (!Tools.contest(ms, this.hero.runWits())) {
      return new arBattle(this, `${msg2}\tBut you catch it before it escapes!\n`);
    }

    return new arNotice(getHome(), `${msg2}\tIt manages to stay ahead of you long enough to escape...`);
  }

  thiefRun() {
    if (!Tools.contest(this.hero.getCharm(), this.mob.getCharm())) {
      return "";
    }

    this.hero.subFatigue(1);

    return `\nYour 'merchant' training comes in handy. You duck into cover and the ${this.mob.getName()} passes by.\n`;
  }

  tryToken() {
    const msg = `\tThe ${this.mob.getName()} fixes you with an intent stare, studying you to the core of your soul. Finally, it makes a decision.\n`;

    if (Tools.contest(this.hero.getPower(), this.mob.getPower())) {
      const trains = "You may now select the Ieatsu option from the main menu.\n";
      const msg2 = `${msg}\tBy some invisible procedure, the ${this.mob.getName()} has judged you worthy to receive special training. You are taken to a remote location where you will learn the secrets of Ieatsu.\n`;

      this.hero.addGuts(-3);
      this.hero.addWits(-3);
      this.hero.addCharm(-3);
      this.hero.addRank(Constants.IEATSU, 1);
      this.hero.addTemp(Constants.IEATSU, 1);
      this.hero.subFatigue(10);

      return new arNotice(
        new arNotice(getHome(), trains),
        `${      msg2}${this.hero.gainExp(2 * this.mob.baseExp())}${this.hero.gainGuts(2 * this.weight)}${this.hero.gainWits(2 * this.weight)}${this.hero.gainCharm(2 * this.weight)}`
      );
    } else if (this.mob.isAggresive()) {
      return new arBattle(
        this,
        `\tIt launches itself into battle, determined to destroy you!\n`
      );
    } else {
      const msg3 = `\tThe ${this.mob.getName()} slaps the token from your hand, then smashes it. Apparently you have failed some unspoken test.\n`;
      this.opt.remove(14);

      return new arNotice(this, msg3);
    }
  }

  tryCapture() {
    const msg = `\tYou scurry around the water, hopping over logs, rocks and roots. The ${this.mob.getName()} spins away from you squeeking in fear as it leaves behind a trail of sparkling dust.\n`;

    if (Tools.contest(Screen.getWits(), this.mob.getWits())) {
      const msg2 = `${msg}\tYou Capture It!\n\n*** Bottled Faery found ***`;

      Screen.addPack("Bottled Faery", 1);

      return new arNotice(
        getHome(),
        `${msg2}${this.hero.gainWits(10)}${this.hero.gainExp(this.mob.baseExp())}`
      );
    } else if (Tools.roll(3) >= this.mob.getStance()) {
      return new arNotice(
        getHome(),
        `${msg}\tThe ${this.mob.getName()} escapes over a small cliff and quickly vanishes into some hedges.`
      );
    } else {
      return new arNotice(
        new arBattle(this, null),
        `${msg}\tOkay! Now its mad!`
      );
    }
  }
}


export default arQuest;
