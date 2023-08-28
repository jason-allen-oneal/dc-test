import TextField from './TextField';
import Tools from 'path-to-DCourt.Tools.Tools'; // Make sure to provide the correct path
import Color from 'path-to-awt.Color'; // Make sure to provide the correct path
import Event from 'path-to-java.awt.Event'; // Make sure to provide the correct path

class FTextField extends TextField {
  max: number;

  constructor(len?: number) {
    super();
    if (len !== undefined) {
      this.max = len;
      this.setForeground(Color.black); // Use appropriate Color import
      this.setFont(Tools.textF); // Use appropriate Tools import
    }
  }

  constructor(s: string, len: number) {
    super(s);
    this.max = len;
    this.setForeground(Color.black); // Use appropriate Color import
    this.setFont(Tools.textF); // Use appropriate Tools import
  }

  setSize(len: number): void {
    this.max = len;
  }

  isMatch(test: string): boolean {
    if (test === null) {
      return this.getText() === null;
    }
    return test.equalsIgnoreCase(this.getText());
  }

  postEvent(e: Event): boolean {
    let msg: string;
    const result = super.postEvent(e);
    if (e.target === this && (msg = this.getText()) !== null && msg.length > this.max) {
      this.setText(msg.substring(0, this.max));
    }
    return result;
  }
}

export default FTextField;
