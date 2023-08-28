import { Item } from "./Item";
import { Buffer } from "../Tools/Buffer";

class itToken extends Item {
    private name: string;
    private hash: number;

    constructor(id: string) {
        super();
        this.setName(id);
    }

    copy(): Item {
        return new itToken(this.getName());
    }

    getIcon(): string {
        return "";
    }

    toString(depth: number): string {
        let msg = "";
        for (let ix = 0; ix < depth; ix++) {
            msg += "\t";
        }
        return msg + this.getName();
    }

    static factory(buf: Buffer): Item {
        const it = new itToken(buf.token());
        if (
            it.getName() === null ||
            it.getName().length < 1 ||
            it.getName().charAt(0) === "{" ||
            it.getName().charAt(0) === "}"
        ) {
            return null;
        }
        return it;
    }

    getName(): string {
        if (!this.isValid()) {
            process.exit(-1);
        }
        return this.name;
    }

    setName(val: string): void {
        this.name = val;
        this.hash = this.name === null ? 0 : this.name.hashCode();
    }

    isValid(): boolean {
        return (this.name === null && this.hash === 0) || this.hash === this.name.hashCode();
    }

    toShow(): string {
        return `${this.getName()}(${this.getCount()})`;
    }

    toLoot(): string {
        return `${this.getCount()} ${this.getName()}`;
    }

    getValue(): string | null {
        return null;
    }

    setValue(val: string): void {}

    isMatch(it: Item | null): boolean {
        if (it === null || this.name === null) {
            return false;
        }
        return this.name.toLowerCase() === it.getName().toLowerCase();
    }

    isMatch(id: string): boolean {
        if (this.name === null) {
            return false;
        }
        return this.name.toLowerCase() === id.toLowerCase();
    }

    getCount(): number {
        return 1;
    }

    setCount(num: number): void {}

    add(val: number): number {
        return 0;
    }

    sub(val: number): number {
        return 0;
    }

    decay(val: number): boolean {
        return false;
    }

    toInteger(): number {
        try {
            return parseInt(this.name);
        } catch (e) {
            console.error(`itToken.toInteger() failed for [${this.name}]`);
            return 0;
        }
    }

    toLong(): number {
        try {
            return parseInt(this.name);
        } catch (e) {
            console.error(`itToken.toLong() failed for [${this.name}]`);
            return 0;
        }
    }
}

export { itToken };
