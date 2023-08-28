import { Item } from "./Item";
import { itCount } from "./itCount";
import { Buffer } from "../Tools/Buffer";
import { Tools } from "../Tools/Tools";

class itRandom extends itCount {
    constructor(it: itCount) {
        super(it.getName(), it.getCount());
    }

    copy(): Item {
        return new itRandom(this);
    }

    makeCount(): number {
        return Tools.roll(1 + this.getCount());
    }

    getIcon(): string {
        return "*";
    }

    static factory(buf: Buffer): Item {
        return new itRandom(<itCount>itCount.factory(buf));
    }
}

export { itRandom };
