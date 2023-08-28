import { itToken } from "./itToken";

class itList extends itToken {
    private queue: Item[];

    constructor(id: string) {
        super(id);
        this.queue = [];
    }

    merge(list: string[]): void {
        for (const item of list) {
            this.append(new itToken(item));
        }
    }

    copy(): Item {
        const newItem = new itList(this.getName());
        for (let ix = 0; ix < this.getCount(); ix++) {
            newItem.append(this.select(ix).copy());
        }
        return newItem;
    }

    getIcon(): string {
        return "~";
    }

    toString(depth: number): string {
        return `${this.toStringHead(depth)}${this.listBody(depth)}`;
    }

    toShow(): string {
        return `${this.getName()}(1)`;
    }

    toLoot(): string {
        return `1 ${this.getName()}`;
    }

    listBody(depth: number): string {
        let result = "";
        let count = 0;

        for (const it of this.queue) {
            const result2 = `${result}|`;
            count = it.getIcon().length < 1 ? count + 1 : count + 2;

            if (it instanceof itArms || it instanceof itList || count >= 6) {
                result += `\n${it.toString(depth + 1)}`;
                count = count >= 6 ? 0 : 5;
            } else {
                result += it.toString();
            }
        }

        return `${result}}`;
    }

    static factory(buf: Buffer): Item {
        if (!buf.begin()) {
            return null;
        }

        if ((!buf.match("itList") && !buf.match("~")) || !buf.split()) {
            return null;
        }

        const what = new itList(buf.token());
        what.loadBody(buf);
        return what;
    }

    loadBody(buf: Buffer): void {
        while (buf.split()) {
            this.append(Item.factory(buf));
        }
        buf.end();
    }

    isValid(): boolean {
        if (!super.isValid()) {
            return false;
        }

        for (const it of this.queue) {
            if (!it.isValid()) {
                return false;
            }
        }
        return true;
    }

    getCount(): number {
        return this.queue.length;
    }

    isEmpty(): boolean {
        return this.getCount() < 1;
    }

    getQueue(): Item[] {
        return this.queue;
    }

    clrQueue(): void {
        this.queue = [];
    }

    merge(str: string[]): void {
        for (const str2 of str) {
            this.append(new itToken(str2));
        }
    }

    decay(rate: number): boolean {
        let result = false;
        for (const it of this.queue) {
            if (it.decay(rate)) {
                result = true;
            }
        }
        return result;
    }

    insert(id: string): void {
        if (id !== null) {
            this.insert(new itToken(id));
        }
    }

    insertWithVal(id: string, val: string): void {
        if (id !== null) {
            this.insert(new itValue(id, val));
        }
    }

    insert(item: Item): void {
        if (item !== null) {
            if (!(item instanceof itCount) || this.find(item.getName()) === null) {
                this.queue.unshift(item);
            } else {
                this.add(<itCount>item);
            }
        }
    }
    
    merge(str: string[]): void {
        for (const str2 of str) {
            this.append(new itToken(str2));
        }
    }

    decay(rate: number): boolean {
        let result = false;
        for (const it of this.queue) {
            if (it.decay(rate)) {
                result = true;
            }
        }
        return result;
    }

    insert(id: string): void {
        if (id !== null) {
            this.insert(new itToken(id));
        }
    }

    insertWithVal(id: string, val: string): void {
        if (id !== null) {
            this.insert(new itValue(id, val));
        }
    }

    insert(item: Item): void {
        if (item !== null) {
            if (!(item instanceof itCount) || this.find(item.getName()) === null) {
                this.queue.unshift(item);
            } else {
                this.add(<itCount>item);
            }
        }
    }

        append(id: string): void {
        if (id !== null) {
            this.append(new itToken(id));
        }
    }

    appendWithVal(id: string, val: string): void {
        if (id !== null) {
            this.append(new itValue(id, val));
        }
    }

    append(item: Item): void {
        if (item !== null) {
            if (!(item instanceof itCount) || this.find(item.getName()) === null) {
                this.queue.push(item);
            } else {
                this.add(<itCount>item);
            }
        }
    }

    add(id: string, num: number): number {
        return this.add(new itCount(id, num));
    }

    add(itc: itCount): number {
        if (itc.getCount() < 1) {
            return this.getCount(itc);
        }
        const it = this.find(itc.getName());
        if (it !== null) {
            return it.add(itc.getCount());
        }
        this.insert(itc);
        return itc.getCount();
    }

    indexOf(what: Item): number {
    return this.queue.indexOf(what);
}

firstOf(id: string): number {
    for (let ix = 0; ix < this.getCount(); ix++) {
        if (this.select(ix).isMatch(id)) {
            return ix;
        }
    }
    return -1;
}

find(id: string): Item | null {
    for (let ix = 0; ix < this.queue.length; ix++) {
        const it = this.queue[ix];
        if (it.isMatch(id)) {
            return it;
        }
    }
    return null;
}

getCount(it: Item): number {
    return this.getCount(it.getName());
}

getCount(id: string): number {
    const it = this.find(id);
    if (it === null) {
        return 0;
    }
    return it.getCount();
}

contains(id: string): boolean {
    return this.find(id) !== null;
}

getValue(id: string): string | null {
    const it = this.find(id);
    if (it === null || !(it instanceof itValue)) {
        return null;
    }
    return it.getValue();
}

loseHalf(): void {
    let ix = 0;
    while (ix < this.getCount()) {
        const it = this.select(ix);
        if (it instanceof itCount) {
            it.sub(Tools.roll(1 + it.getCount()));
            if (it.getCount() > 0) {
                ix++;
            }
            this.drop(it);
        } else {
            if (Tools.chance(2)) {
                ix++;
            }
            this.drop(it);
        }
    }
}

fullSkill(): number {
    let skill = 0;
    for (let ix = 0; ix < this.getCount(); ix++) {
        const it = this.select(ix);
        if (it instanceof itArms) {
            skill += it.fullSkill();
        }
    }
    return skill;
}

fullAttack(): number {
    let attack = 0;
    for (let ix = 0; ix < this.getCount(); ix++) {
        const it = this.select(ix);
        if (it instanceof itArms) {
            attack += it.fullAttack();
        }
    }
    return attack;
}

fullDefend(): number {
    let defend = 0;
    for (let ix = 0; ix < this.getCount(); ix++) {
        const it = this.select(ix);
        if (it instanceof itArms) {
            defend += it.fullDefend();
        }
    }
    return defend;
}

findArms(id: string): itArms | null {
    for (let ix = 0; ix < this.getCount(); ix++) {
        const what = this.select(ix);
        if (what instanceof itArms) {
            const it = what as itArms;
            if (it.hasTrait(id)) {
                return it;
            }
        }
    }
    return null;
}
}

 	