import { Item } from "./Item";
import { itToken } from "./itToken";
import { Buffer } from "../Tools/Buffer";

class itValue extends itToken {
    private value: string;

    constructor(id: string, val: string) {
        super(id);
        this.value = val;
    }

    copy(): Item {
        return new itValue(this.getName(), this.getValue());
    }

    getIcon(): string {
        return "=";
    }

    toString(depth: number): string {
        return `${super.toStringHead(depth)}|${this.getValue()}}`;
    }

    static factory(buf: Buffer): Item {
        const v = new itValue("", "");
        if (!buf.begin() || !buf.match("=")) {
            return null;
        }
        if (buf.split()) {
            v.setName(buf.token());
        }
        if (buf.split()) {
            v.setValue(buf.token());
        }
        buf.end();
        return v;
    }

    getValue(): string {
        return this.value;
    }

    setValue(val: string): void {
        this.value = val;
    }

    toLong(): number {
        try {
            return parseInt(this.value);
        } catch (e) {
            return 0;
        }
    }

    toInt(): number {
        try {
            return parseInt(this.value);
        } catch (e) {
            return 0;
        }
    }
}

export { itValue };
