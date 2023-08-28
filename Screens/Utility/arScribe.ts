import { Screen } from './Screen'; // Assuming you have a Screen class
import { FTextArea } from './FTextArea'; // Assuming you have an FTextArea class
import { itNote } from './itNote'; // Assuming you have an itNote class
import { Tools } from './Tools'; // Assuming you have a Tools class

class arScribe extends Screen {
  private cancel: Button;
  private done: Button;
  private text: FTextArea;
  private spend: string;

  constructor(from: Screen | null, use: string) {
    super(from, "Compose A Note");
    this.setBackground(Color.red);
    this.setForeground(Color.black);
    this.setFont(Tools.statusF);
    this.spend = use;
  }

  action(e: Event, o: any): boolean {
    if (Tools.movedAway(this)) {
      return true;
    }
    if (e.target === this.cancel) {
      Tools.setRegion(this.getHome());
    }
    if (e.target === this.done) {
      this.addNoteToPack();
      Tools.setRegion(this.getHome());
    }
    return super.action(e, o);
  }

  createTools(): void {
    this.setFont(Tools.textF);
    this.setForeground(Color.black);
    this.cancel = new Button("Cancel");
    this.done = new Button("Done");
    this.text = new FTextArea(Tools.DEFAULT_HEIGHT);
    this.text.reshape(20, 30, 360, 230);
    this.text.setFont(Tools.statusF);
    this.cancel.reshape(280, 5, 50, 20);
    this.cancel.setFont(Tools.textF);
    this.done.reshape(340, 5, 50, 20);
    this.done.setFont(Tools.textF);
  }

  addTools(): void {
    this.add(this.cancel);
    this.add(this.done);
    this.add(this.text);
  }

  addNoteToPack(): void {
    const msg: string = Tools.detokenize(this.text.getText());
    Screen.subPack(this.spend, 1);
    Screen.putPack(
      new itNote(
        this.spend === "Pen & Paper" ? "Letter" : "Postcard",
        Screen.getHero().getName(),
        msg
      )
    );
  }
}
