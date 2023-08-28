import FTools from './FTools';

class FScrollbar extends FTools {
  static HORIZONTAL = true;
  static VERTICAL = false;
  head: Rectangle;
  tail: Rectangle;
  body: Rectangle;
  thumb: Rectangle;
  iMax: number;
  iVal: number;
  iStep: number;
  iJump: number;
  horz: boolean;
  drag: boolean;

  constructor(max: number, val: number, step: number, jump: number) {
    super();
    this.horz = false;
    this.drag = false;
    this.reshape(0, 0, 10, 30);
    this.setAll(max, val, step, jump);
  }

  setAll(max: number, val: number, step: number, jump: number): void {
    this.iMax = max;
    this.iJump = jump > max ? max : jump;
    this.iStep = step > jump ? jump : step;
    this.setVal(val);
  }

  setMax(newMax: number): void {
    this.iMax = newMax;
    if (this.iMax < 0) {
      this.iMax = 0;
    }
    this.setJump((this.iMax + 9) / 10);
    this.setStep((this.iMax + 99) / 100);
    this.setVal(this.iVal);
  }

  setVal(newVal: number): void {
    const r = this.bounds();
    this.iVal = newVal;
    if (this.iVal < 0) {
      this.iVal = 0;
    }
    if (this.iVal > this.iMax) {
      this.iVal = this.iMax;
    }
    if (this.horz) {
      this.thumb.x =
        this.head.x +
        this.head.width +
        (this.iMax < 1
          ? 0
          : (this.iVal * ((r.width - 2 * this.head.width) - this.thumb.width)) / this.iMax);
    } else {
      this.thumb.y =
        this.head.y +
        this.head.height +
        (this.iMax < 1
          ? 0
          : (this.iVal * ((r.height - 2 * this.head.height) - this.thumb.height)) / this.iMax);
    }
  }

  setJump(newJump: number): void {
    this.iJump = newJump;
    if (this.iJump > this.iMax) {
      this.iJump = this.iMax;
    }
  }

  setStep(newStep: number): void {
    this.iStep = newStep;
    if (this.iStep > this.iMax) {
      this.iStep = this.iMax;
    }
    if (this.iStep > this.iJump) {
      this.iStep = this.iJump;
    }
  }

  getMax(): number {
    return this.iMax;
  }

  getVal(): number {
    return this.iVal;
  }

  getJump(): number {
    return this.iJump;
  }

  getStep(): number {
    return this.iStep;
  }

  getHorz(): boolean {
    return this.horz;
  }
}

export default FScrollbar;