class Item {
    abstract copy(): Item;
    abstract toString(i: number): string;
    abstract getIcon(): string;
    abstract getName(): string;
    abstract setName(str: string): void;
    abstract isValid(): boolean;
    abstract toShow(): string;
    abstract toLoot(): string;
    abstract isMatch(item: Item): boolean;
    abstract isMatch(str: string): boolean;
    abstract getValue(): string;
    abstract setValue(str: string): void;
    abstract getCount(): number;
    abstract setCount(i: number): void;
    abstract add(i: number): number;
    abstract sub(i: number): number;
    abstract decay(i: number): boolean;
    abstract toLong(): number;
    abstract toInteger(): number;

    toString(): string {
        return this.toString(0);
    }

    protected toStringHead(depth: number): string {
        let msg = "";
        for (let ix = 0; ix < depth; ix++) {
            msg = `${msg}\t`;
        }
        return `${msg}{${this.getIcon()}|${this.getName()}`;
    }

    static factory(val: string): Item {
        return this.factory(new Buffer(val));
    }

    static factory(buf: Buffer): Item {
        if (buf.startsWith("{#|")) {
            return itCount.factory(buf);
        }
        if (buf.startsWith("{@|")) {
            return itRandom.factory(buf);
        }
        if (buf.startsWith("{%|")) {
            return itPercent.factory(buf);
        }
        if (buf.startsWith("{=|")) {
            return itValue.factory(buf);
        }
        if (buf.startsWith("{~|") || buf.startsWith("{itList|")) {
            return itList.factory(buf);
        }
        if (buf.startsWith("{itArms|")) {
            return itArms.factory(buf);
        }
        if (buf.startsWith("{itText|")) {
            return itText.factory(buf);
        }
        if (buf.startsWith("{itNote|")) {
            return itNote.factory(buf);
        }
        if (buf.startsWith("{itAgent|") || buf.startsWith("{itHero|")) {
            return itHero.factory(buf);
        }
        return buf.startsWith("{itMonster|") ? itMonster.factory(buf) : itToken.factory(buf);
    }
}
