import { FTextField } from 'DCourt.Components.FTextField';
import { itAgent, itHero, itNote, itValue, itList } from 'DCourt.Items.List';
import { Screen } from 'DCourt.Screens.Screen';
import { Indoors } from 'DCourt.Screens.Template.Indoors';
import { arNotice } from 'DCourt.Screens.Utility.arNotice';
import { arPackage } from 'DCourt.Screens.Utility.arPackage';
import { arPeer } from 'DCourt.Screens.Utility.arPeer';
import { Constants } from 'DCourt.Static.Constants';
import { GameStrings } from 'DCourt.Static.GameStrings';
import { Buffer } from 'DCourt.Tools.Buffer';
import { Loader } from 'DCourt.Tools.Loader';
import { MadLib } from 'DCourt.Tools.MadLib';
import { Tools } from 'DCourt.Tools.Tools';
import { Button } from 'java.awt.Button';
import { Checkbox } from 'java.awt.Checkbox';
import { CheckboxGroup } from 'java.awt.CheckboxGroup';
import { Color } from 'java.awt.Color';
import { Event } from 'java.awt.Event';
import { Graphics } from 'java.awt.Graphics';

class arClanHall extends Indoors {
  clantext: FTextField;
  current: string;
  leader: string;
  ability: string;
  members: number;
  power: number;
  petitionID: number;
  enact: Button;
  peer: Button;
  next: Button;
  grant: Button;
  deny: Button;
  clanAction: CheckboxGroup;
  join: Checkbox;
  quit: Checkbox;
  member: Checkbox;
  create: Checkbox;
  confirm: Checkbox;
  showPetitions: boolean;
  petition: itValue;
  heroStatus: number;
  clanStatus: number;

  static readonly JOIN_QUESTS = 1;
  static readonly JOIN_COSTS = 1000;
  static readonly QUIT_QUESTS = 5;
  static readonly QUIT_COSTS = 5000;
  static readonly DISBAND_QUESTS = 15;
  static readonly DISBAND_COSTS = 50000;
  static readonly CREATE_QUESTS = 75;
  static readonly CREATE_COSTS = 250000;

  constructor(from: Screen) {
    super(from, 'Servile Krymps Clan Gathering');
    this.setBackground(new Color(255, 255, 128));
    this.setForeground(new Color(96, 96, 0));
    this.setFont(Tools.courtF);
  }

  getFace(): string {
    return 'Faces/Serville.jpg';
  }

  getGreeting(): string {
    const msg = Tools.select(greeting);
    return msg == null ? `${String(Tools.getBest())} was just here` : msg;
  }

  init(): void {
    this.petitionID = -1;
    this.findNextPetition();
    this.showPetitions = this.heroStatus === 3 || this.petition != null;
    super.init();
  }

  localPaint(g: Graphics): void {
    const h = Screen.getHero();
    const act = this.clanAction.getCurrent();
    super.localPaint(g);
    g.setFont(Tools.textF);
    g.drawString(`>>> ${h.getTitle()}${h.getName()}`, 180, 60);
    g.setFont(this.getFont());
    if (this.clanStatus === 0) {
      g.drawString('Enter a Clan Name', 180, 120);
    } else if (this.clanStatus === 2) {
      g.drawString('No Clan Found', 180, 120);
    } else {
      if (this.heroStatus !== 1) {
        g.drawString(`Clan: ${this.current}`, 180, 80);
      }
      g.drawString(`Leader: ${this.leader}`, 180, 100);
      g.drawString(`Men: ${this.members}  Power: ${this.power}`, 180, 120);
      g.drawString(`Abilities: ${this.ability}`, 180, 140);
    }
    if (act === this.create && h.getSocial() < 2) {
      g.drawString('Must be a Baron', 180, 200);
      g.drawString('to Create a Clan', 200, 220);
    }
    if (act === this.member) {
      g.setColor(new Color(255, 196, 196));
      g.fillRect(170, 150, 225, 50);
      g.setColor(this.getForeground());
      if (this.petition == null) {
        g.drawString('No Petitions Outstanding', 180, 170);
      } else {
        g.drawString(`Petition from ${this.petition.getValue()}`, 180, 170);
      }
    }
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.enact) {
      const act = this.clanAction.getCurrent();
      if (act === this.join) {
        Tools.setRegion(this.petitionClan());
      }
      if (act === this.create) {
        Tools.setRegion(this.createClan());
      }
      if (act === this.quit) {
        if (this.heroStatus === 3) {
          Tools.setRegion(this.disbandClan());
        } else {
          Tools.setRegion(this.quitClan());
        }
      }
    }
    if (e.target !== this.confirm) {
      this.confirm.setState(false);
    }
    if (e.target === this.clantext) {
      this.findClanInfo(this.clantext.getText());
    }
    if (e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    if (this.petition != null) {
      if (e.target === this.peer) {
        Tools.setRegion(new arPeer(this, 4, this.petition.getValue()));
      }
      if (e.target === this.next) {
        this.findNextPetition();
      }
      if (e.target === this.grant) {
        Tools.setRegion(this.grantPetition());
      }
      if (e.target === this.deny) {
        Tools.setRegion(this.denyPetition());
      }
    }
    this.updateTools();
    this.repaint();
    return super.action(e, o);
  }

  createTools() {
    const h = Screen.getHero();
    const backC = new Color(255, 255, 128);
    this.findClanInfo(h.getClan());
    
    if (this.current == null) {
      this.heroStatus = 1;
    } else if (!h.isMatch(this.leader)) {
      this.heroStatus = 2;
    } else {
      this.heroStatus = 3;
    }
    
    this.enact = new Button();
    this.enact.reshape(170, 160, 220, 25);
    this.enact.setFont(Tools.statusF);
    this.enact.show(false);
    
    this.confirm = new Checkbox();
    this.confirm.reshape(180, 240, 200, 20);
    this.confirm.setFont(Tools.textF);
    this.confirm.show(false);
    
    if (this.heroStatus != 3) {
      this.clantext = new FTextField(h.getClan() == null ? Constants.NONE : h.getClan(), 40);
      this.clantext.reshape(180, 63, 200, 20);
      this.clantext.setFont(Tools.textF);
    }
    
    this.clanAction = new CheckboxGroup();
    this.member = null;
    this.create = null;
    this.quit = null;
    this.join = null;
    
    if (this.heroStatus == 3) {
      this.member = new Checkbox("Members", this.clanAction, true);
      this.member.reshape(200, 205, 80, 25);
      this.quit = new Checkbox("Quit", this.clanAction, false);
      this.quit.reshape(280, 205, 80, 25);
    }
    
    if (this.heroStatus == 2) {
      this.quit = new Checkbox("Quit", this.clanAction, true);
      this.quit.reshape(200, 205, 80, 25);
      this.join = new Checkbox("Join", this.clanAction, false);
      this.join.reshape(280, 205, 80, 25);
    }
    
    if (this.heroStatus == 1) {
      this.join = new Checkbox("Join", this.clanAction, true);
      this.join.reshape(200, 205, 80, 25);
      this.create = new Checkbox(itAgent.CREATE, this.clanAction, false);
      this.create.reshape(280, 205, 80, 25);
    }
    
    if (this.join != null) {
      this.join.setFont(Tools.textF);
      this.join.setBackground(backC);
      this.join.setForeground(Color.black);
    }
    
    if (this.quit != null) {
      this.quit.setFont(Tools.textF);
      this.quit.setBackground(backC);
      this.quit.setForeground(Color.black);
    }
    
    if (this.create != null) {
      this.create.setFont(Tools.textF);
      this.create.setBackground(backC);
      this.create.setForeground(Color.black);
    }
    
    if (this.member != null) {
      this.member.setFont(Tools.textF);
      this.member.setBackground(backC);
      this.member.setForeground(Color.black);
    }
    
    if (this.heroStatus == 3) {
      this.peer = new Button("Peer");
      this.peer.setFont(Tools.textF);
      this.peer.reshape(175, 175, 50, 20);
      this.peer.show(false);
      
      this.next = new Button("Next");
      this.next.setFont(Tools.textF);
      this.next.reshape(230, 175, 50, 20);
      this.next.show(false);
      
      this.grant = new Button("Grant");
      this.grant.setFont(Tools.textF);
      this.grant.reshape(285, 175, 50, 20);
      this.grant.show(false);
      
      this.deny = new Button("Deny");
      this.deny.setFont(Tools.textF);
      this.deny.reshape(340, 175, 50, 20);
      this.deny.show(false);
    }
  }
  
    findNextPetition(): void {
    let it = Screen.getPack().select("Petition", this.petitionID + 1);
    if (it !== null && it instanceof itValue) {
      this.petitionID++;
      this.petition = it;
    } else if (this.petitionID < 0) {
      this.petition = null;
    } else {
      let it2 = Screen.getPack().select("Petition", 0);
      if (it2 !== null && it2 instanceof itValue) {
        this.petitionID = 0;
        this.petition = it2;
      } else {
        this.petition = null;
      }
    }
  }

  grantPetition(): Screen {
    let hero = Screen.getHero();
    Screen.subPack(this.petition);
    if (!Screen.saveHero()) {
      Screen.putPack(this.petition);
      return new arNotice(this, GameStrings.SAVE_CANCEL);
    }
    let mail = new itList(Constants.MAIL);
    mail.append(
      new itNote(
        "Grant",
        hero.getClan(),
        "Greetings,\nIt is my pleasure to welcome you to our guild.\nGuildmaster"
      )
    );

    let result = arPackage.send(
      `${hero.getTitle()}${hero.getName()}`,
      this.petition.getValue(),
      mail
    );

    if (result !== null) {
      Screen.putPack(this.petition);
      return new arNotice(this, `${GameStrings.MAIL_CANCEL}${result}`);
    }

    let sent = new MadLib(grantMsg);
    sent.replace("$name$", this.petition.getValue());
    sent.replace("$clan$", hero.getClan());

    return new arNotice(this, sent.getText());
  }

  denyPetition(): Screen {
    let h = Tools.getHero();
    Screen.subPack(this.petition);
    if (!Screen.saveHero()) {
      Screen.putPack(this.petition);
      return new arNotice(this, GameStrings.SAVE_CANCEL);
    }

    let msg = new MadLib(denyMsg);
    msg.replace("$today$", Tools.getToday());
    msg.replace("$name$", this.petition.getValue());
    msg.replace("$clan$", h.getClan());
    msg.replace(
      "$leader$",
      `${h.getTitle()}${h.getName()}`
    );

    let mail = new itList(Constants.MAIL);
    mail.append(new itNote("Denial", h.getName(), msg.getText()));

    let result = arPackage.send(
      `${h.getTitle()}${h.getName()}`,
      this.petition.getValue(),
      mail
    );

    if (result === null) {
      return new arNotice(this, `${denyHead}${msg.getText()}`);
    }

    Screen.putPack(this.petition);
    return new arNotice(this, `${GameStrings.MAIL_CANCEL}${result}`);
  }
}
