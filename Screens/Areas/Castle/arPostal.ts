import { Screen } from './Screen'; // Assuming you have a Screen module
import { FTextList } from './FTextList'; // Assuming you have an FTextList module
import { itAgent } from './itAgent'; // Assuming you have an itAgent module
import { itHero } from './itHero'; // Assuming you have an itHero module
import { itList } from './itList'; // Assuming you have an itList module
import { arNotice } from './arNotice'; // Assuming you have an arNotice module
import { arPackage } from './arPackage'; // Assuming you have an arPackage module
import { Buffer } from './Buffer'; // Assuming you have a Buffer module
import { Loader } from './Loader'; // Assuming you have a Loader module
import { Tools } from './Tools'; // Assuming you have a Tools module

class arPostal extends Indoors {
  take: HTMLButtonElement;
  send: HTMLButtonElement;
  postbox: FTextList;
  mail: itList | null = null;
  static greeting = [
    null,
    "In a minute..",
    "Okay, alright already.",
    "Fill in this form.",
    "This form is wrong",
    "I'm on my break",
    "Geez, again?",
    "*Sigh* Oh I suppose.",
    "Right now? Yeah, yeah."
  ];

  constructor(from: Screen) {
    super(from, "Sloeth Dreyfus Postal Express");
    this.setBackground(new Color(128, 255, 128));
    this.setForeground(new Color(0, 128, 0));
  }

  getFace(): string {
    return "Faces/Sloeth.jpg";
  }

  getGreeting(): string {
    const msg = Tools.select(this.greeting);
    return msg === null ? `${String(Tools.getBest())}? Oh yeah.` : msg;
  }

  localPaint(g: Graphics): void {
    super.localPaint(g);
    this.updateTools(Tools.getHero());
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.take) {
      Tools.setRegion(this.takePackage());
    }
    if (e.target === this.send) {
      Tools.setRegion(new arPackage(this));
    }
    if (e.target === this.getPic(0)) {
      Tools.setRegion(this.getHome());
    }
    this.repaint();
    return super.action(e, o);
  }

  createTools(): void {
    const h: itHero = Screen.getHero();
    this.take = document.createElement('button');
    this.take.textContent = 'Take Mail $100';
    this.take.style.position = 'absolute';
    this.take.style.left = '160px';
    this.take.style.top = '40px';
    this.take.style.width = '150px';
    this.take.style.height = '20px';
    this.take.style.font = 'Tools.textF';
    this.send = document.createElement('button');
    this.send.textContent = 'Send Mail <x$100>';
    this.send.style.position = 'absolute';
    this.send.style.left = '10px';
    this.send.style.top = '240px';
    this.send.style.width = '140px';
    this.send.style.height = '20px';
    this.send.style.font = 'Tools.textF';
    this.postbox = new FTextList();
    this.postbox.reshape(160, 70, 230, 180);
    this.postbox.setFont(Tools.textF);
    if (this.mail === null) {
      this.loadMailList();
    }
    if (this.mail !== null) {
      for (const item of this.mail.elements()) {
        this.postbox.addItem(item.getName());
      }
    }
    this.postbox.setSelect(-1);
    this.updateTools(h);
  }

  addTools(): void {
    this.add(this.take);
    this.add(this.send);
    this.add(this.postbox);
  }

  updateTools(h: itAgent): void {
    this.take.disabled = this.postbox.getSelect() >= 0 && h.getMoney() >= 100;
  }

  loadMailList(): void {
    this.mail = Loader.cgiItem(
      Loader.LISTMAIL,
      `${Screen.getHero().getName()}|${Screen.getPlayer().getSessionID()}`
    ) as itList;
  }

  takePackage(): Screen {
    const h: itHero = Screen.getHero();
    const index: number = this.postbox.getSelect();
    if (index < 0) {
      return null;
    }
    const buf: Buffer = Loader.cgiBuffer(
      Loader.TAKEMAIL,
      `${h.getName()}|${Screen.getSessionID()}|${index}`
    );
    const msg: string = this.postbox.getItem(index);
    this.postbox.delItem(index);
    if (buf === null || buf.isEmpty() || buf.isError()) {
      return new arNotice(
        this,
        `A transmission error has occurred:\n${buf === null ? "" : buf.peek()}\nSorry About That.`
      );
    }
    let msg2 = `\tA mail daemon pushes out a dilapidated package, makes a futile attempt to polish it up, then scurries into the depths of the mail room.\n\nThe label reads:\n\t${msg}\nThe package contains:\n`;
    const list: itList = Item.factory(buf) as itList;
    for (let ix = 0; ix < list.getCount(); ix++) {
      const it: Item = list.select(ix);
      if (it.getName() !== null && it.getName().length >= 1) {
        msg2 = `${msg2}\t${it.toShow()}\n`;
        Screen.addPack(it);
      }
    }
    h.subMoney(100);
    Screen.saveHero();
    return new arNotice(this, msg2);
  }
}
