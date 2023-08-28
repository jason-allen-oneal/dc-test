import { Item } from "./Item";
import { itCount } from "./itCount";
import { Buffer } from "../Tools/Buffer";
import { Tools } from "../Tools/Tools";

class itPercent extends itCount {
    constructor(it: itCount) {
        super(it.getName(), it.getCount());
    }

    copy(): Item {
        return new itPercent(this);
    }

    makeCount(): number {
        return Tools.percent(this.getCount()) ? 1 : 0;
    }

    getIcon(): string {
        return "%";
    }

    static factory(buf: Buffer): Item {
        return new itPercent(<itCount>itCount.factory(buf));
    }
}

export { itPercent };
