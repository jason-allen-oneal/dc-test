import { Item } from "./Item";
import { itToken } from "./itToken";
import { Buffer } from "../Tools/Buffer";
import { Tools } from "../Tools/Tools";

class itCount extends itToken {
    private value: number;
    private offset: number;

    constructor(id: string, num: number) {
        super(id);
        this.setCount(num);
    }

    copy(): Item {
        return new itCount(this.getName(), this.getCount());
    }

    getIcon(): string {
        return "#";
    }

    toString(depth: number): string {
        return `${this.toStringHead(depth)}|${this.getCount()}}`;
    }

    static factory(buf: Buffer): Item {
        const it = new itCount(buf.token(), 0);
        if (!buf.begin() || it.getName() === null || it.getName().length !== 1) {
            return null;
        }
        if (buf.split()) {
            it.setName(buf.token());
        }
        if (buf.split()) {
            it.setCount(buf.num());
        }
        if (!buf.end()) {
            return null;
        }
        return it;
    }

    setCount(num: number): void {
        this.offset = Tools.roll(1024) + 1;
        this.value = num - this.offset;
    }

    getCount(): number {
        return this.value + this.offset;
    }

    makeCount(): number {
        return this.getCount();
    }

    display(): string {
        return `${this.getName()}[${this.getCount()}]`;
    }

    add(itc: itCount | number): number {
        const count = itc instanceof itCount ? itc.getCount() : itc;
        return this.adds(count);
    }

    adds(num: number): number {
        this.setCount(this.getCount() + num);
        return this.getCount();
    }

    sub(itc: itCount | number): number {
        const count = itc instanceof itCount ? itc.getCount() : itc;
        return this.subs(count);
    }

    subs(num: number): number {
        const sum = this.getCount();
        if (num < 0) {
            return 0;
        }
        if (num > sum) {
            num = sum;
        }
        this.setCount(sum - num);
        return num;
    }
}

export { itCount };
