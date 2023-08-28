import TextArea from './TextArea';

class FTextArea extends TextArea {
  max: number;

  constructor(len?: number) {
    super();
    if (len !== undefined) {
      this.max = len;
    }
  }

  setSize(len: number): void {
    this.max = len;
  }

  handleEvent(e: Event): boolean {
    let msg: string;
    const result = super.handleEvent(e);
    if (e.target === this && (msg = this.getText()) !== null && msg.length > this.max) {
      this.setText(msg.substring(0, this.max));
      this.select(this.max, this.max);
    }
    return result;
  }
}

export default FTextArea;
