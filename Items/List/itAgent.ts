import { itList } from "./itList";
import { Item } from "./Item";
import { itCount } from "./Token/itCount";
import { itArms } from "./Token/itArms";
import { Constants } from "../Static/Constants";
import { GearTypes } from "../Static/GearTypes";
import { ArmsTrait } from "../Static/ArmsTrait";
import { Buffer } from "../Tools/Buffer";
import { Portrait } from "../Components/Portrait";

abstract class itAgent extends itList implements Constants, GearTypes, ArmsTrait {
    private picfile: string;
    private gval: itCount;
    private wval: itCount;
    private cval: itCount;
    private aval: itCount;
    private dval: itCount;
    private sval: itCount;
    private pack: itList;
    private gear: itList;
    private stat: itList;
    private temp: itList;
    private rank: itList;
    private vals: itList;
    private acts: itList;
    static readonly STATE = "state";
    static readonly ALIVE = "Alive";
    static readonly DEAD = "Dead";
    static readonly CREATE = "Create";
    static readonly CONTROL = "Control";
    static readonly SWINDLE = "Swindle";
    static readonly PACK = "pack";
    static readonly GEAR = "gear";
    static readonly STAT = "stat";
    static readonly TEMP = "temp";
    static readonly ACTS = "acts";
    static readonly RANK = "rank";
    static readonly OPTS = "opts";
    static readonly PIC = "pic";
    static readonly VALUES = "values";

    abstract getWeapon(): string;
    abstract getArmour(): string;
    protected abstract gearAttack(): number;
    protected abstract gearDefend(): number;
    protected abstract gearSkill(): number;

    constructor(id: string) {
        super(id);
        this.setVals(0, 0, 0, 0, 0, 0);
    }

    setVals(g: number, w: number, c: number, a: number, d: number, s: number): void {
        this.gval = new itCount("g", g);
        this.wval = new itCount("w", w);
        this.cval = new itCount("c", c);
        this.aval = new itCount("a", a);
        this.dval = new itCount("d", d);
        this.sval = new itCount("s", s);
    }

    setGuts(num: number): void {
        this.gval.setCount(num);
    }

    setWits(num: number): void {
        this.wval.setCount(num);
    }

    setCharm(num: number): void {
        this.cval.setCount(num);
    }

    setAttack(num: number): void {
        this.aval.setCount(num);
    }

    setDefend(num: number): void {
        this.dval.setCount(num);
    }

    setSkill(num: number): void {
        this.sval.setCount(num);
    }

    addGuts(num: number): void {
        this.gval.adds(num);
    }

    addWits(num: number): void {
        this.wval.adds(num);
    }

    addCharm(num: number): void {
        this.cval.adds(num);
    }

    addAttack(num: number): void {
        this.aval.adds(num);
    }

    addDefend(num: number): void {
        this.dval.adds(num);
    }

    addSkill(num: number): void {
        this.sval.adds(num);
    }

    getGuts(): number {
        return this.gval.getCount();
    }

    getWits(): number {
        return this.wval.getCount();
    }

    getCharm(): number {
        return this.cval.getCount();
    }

    getAttack(): number {
        return this.aval.getCount();
    }

    getDefend(): number {
        return this.dval.getCount();
    }

    getSkill(): number {
        return this.sval.getCount();
    }

    getIcon(): string {
        return "itAgent";
    }

    toString(depth: number): string {
        return `${super.toStringHead(depth)}|${this.getGuts()}|${this.getWits()}|${this.getCharm()}\n\t${this.listBody(depth)}`;
    }

    loadAttributes(buf: Buffer): void {
        if (buf.split()) {
            this.setGuts(buf.num());
        }
        if (buf.split()) {
            this.setWits(buf.num());
        }
        if (buf.split()) {
            this.setCharm(buf.num());
        }
    }

    fixLists(): void {
        this.picfile = this.findValue(itAgent.PIC);
        this.pack = this.findList(itAgent.PACK);
        this.gear = this.findList(itAgent.GEAR);
        this.stat = this.findList(itAgent.STAT);
        this.temp = this.findList(itAgent.TEMP);
        this.rank = this.findList(itAgent.RANK);
        this.vals = this.findList(itAgent.VALUES);
        this.acts = new itList(itAgent.ACTS);
    }

    findValue(name: string): string {
        const it = this.find(name);
        return it ? it.getValue() : null;
    }

    findList(name: string): itList {
        let it = this.find(name);
        if (!it) {
            const itlist = new itList(name);
            it = itlist;
            this.append(itlist);
        }
        return it as itList;
    }

    getPicture(): Portrait {
        return null;
    }

    getState(): string {
        return this.getValues().getValue(itAgent.STATE);
    }

    setState(val: string): void {
        this.getValues().fix(itAgent.STATE, val);
    }

    isAlive(): boolean {
        return itAgent.ALIVE === this.getState();
    }

        isDead(): boolean {
        return itAgent.DEAD === this.getState();
    }

    isCreate(): boolean {
        return itAgent.CREATE === this.getState();
    }

    isControl(): boolean {
        return "Control" === this.getState();
    }

    isSwindle(): boolean {
        return "Swindle" === this.getState();
    }

    getPack(): itList {
        return this.pack;
    }

    getGear(): itList {
        return this.gear;
    }

    getStatus(): itList {
        return this.stat;
    }

    getTemp(): itList {
        return this.temp;
    }

    getActions(): itList {
        return this.acts;
    }

    getRank(): itList {
        return this.rank;
    }

    getValues(): itList {
        return this.vals;
    }

    rankCount(it: Item): number {
        return this.rank.getCount(it);
    }

    rankCountById(id: string): number {
        return this.rank.getCount(id);
    }

    fixRank(id: string, num: number): void {
        this.rank.fix(id, num);
    }

    addRank(id: string, num: number): number {
        return this.rank.add(id, num);
    }

    subRank(id: string, num: number): number {
        return this.rank.sub(id, num);
    }

    tempCount(it: Item): number {
        return this.temp.getCount(it);
    }

    tempCountById(id: string): number {
        return this.temp.getCount(id);
    }

    fixTemp(id: string, num: number): void {
        this.temp.fix(id, num);
    }

    addTemp(id: string, num: number): number {
        return this.temp.add(id, num);
    }

    subTemp(id: string, num: number): number {
        return this.temp.sub(id, num);
    }

    fixTempTrait(id: string): void {
        this.temp.fixTrait(id);
    }

    clrTempTrait(id: string): void {
        this.temp.clrTrait(id);
    }

    statusCount(it: Item): number {
        return this.stat.getCount(it);
    }

    statusCountById(id: string): number {
        return this.stat.getCount(id);
    }

    fixStatus(id: string, num: number): void {
        this.stat.fix(id, num);
    }

    addStatus(id: string, num: number): number {
        return this.stat.add(id, num);
    }

    subStatus(id: string, num: number): number {
        return this.stat.sub(id, num);
    }

    fixStatTrait(id: string): void {
        this.stat.fixTrait(id);
    }

    clrStatTrait(id: string): void {
        this.stat.clrTrait(id);
    }

    findGearTrait(id: string): itArms {
        return this.gear.findArms(id);
    }

    dropGear(it: Item): void {
        this.gear.drop(it);
    }

    packCount(): number {
        return this.pack.getCount();
    }

    packCountOf(it: Item): number {
        return this.pack.getCount(it);
    }

    packCountById(id: string): number {
        return this.pack.getCount(id);
    }

    fixPack(id: string, num: number): void {
        this.pack.fix(id, num);
    }

    addPack(id: string, num: number): number {
        return this.pack.add(id, num);
    }

    subPack(id: string, num: number): number {
        return this.pack.sub(id, num);
    }

    addPackItem(it: Item): void {
        this.pack.append(it);
    }

    putPackItem(it: Item): void {
        this.pack.insert(it);
    }

    subPackItem(it: Item): void {
        this.pack.drop(it);
    }

    selectPack(ix: number): Item {
        return this.pack.select(ix);
    }

    firstPackById(id: string): number {
        return this.pack.firstOf(id);
    }

    indexPackItem(it: Item): number {
        return this.pack.indexOf(it);
    }

    hasTrait(attribute: string): boolean {
        return this.temp.hasTrait(attribute) || this.stat.hasTrait(attribute);
    }

    getPower(): number {
        return (
            0 +
            this.getAttack() * 4 +
            this.getDefend() * 4 +
            this.getSkill() +
            this.getGuts() * 2 +
            this.getWits() +
            this.getCharm() +
            this.scale(this.fight(), 12) +
            this.scale(this.magic(), 16) +
            this.scale(this.thief(), 8)
        );
    }

    scale(guild: number, base: number): number {
        let num = 0;
        for (let i = guild; i > 0; i--) {
            num += Math.floor(base / 2);
        }
        return num;
    }

    calcCombat(): void {
        let num = (this.getWits() * 2 + this.getCharm() + 2) / 3 + this.gearSkill() + this.magicRank();
        if (num < 1) {
            num = 1;
        }
        if (this.hasTrait(Constants.AGILE)) {
            num += Math.floor((num + 9) / 10);
        }
        this.setSkill(num);

        let num2 = this.gearAttack() + this.fightRank();
        if (this.hasTrait(Constants.STRONG)) {
            num2 += Math.floor((num2 + 9) / 10);
        }
        this.setAttack(num2);

        let num3 = this.gearDefend() + this.thiefRank();
        if (this.hasTrait(Constants.STURDY)) {
            num3 += Math.floor((num3 + 9) / 10);
        }
        this.setDefend(num3);
    }

        runWits(): number {
        let val = (this.getWits() * (10 + this.thiefRank())) / 10;
        return this.hasTrait(Constants.SWIFT) ? val + 30 : val;
    }

    bribeCharm(): number {
        return this.hasTrait(Constants.SINCERE) ? this.getCharm() + 30 : this.getCharm();
    }

    tradeCharm(): number {
        return this.hasTrait(Constants.TRICKY) ? this.getCharm() + 30 : this.getCharm();
    }

    feedCharm(): number {
        return this.hasTrait(Constants.EMPATHIC) ? this.getCharm() + 50 : this.getCharm();
    }

    seduceCharm(): number {
        return this.hasTrait(Constants.SEXY) ? this.getCharm() + 50 : this.getCharm();
    }

    getMoney(): number {
        return this.packCountById("Marks");
    }

    addMoney(num: number): number {
        return this.addPack("Marks", num);
    }

    subMoney(num: number): number {
        return this.subPack("Marks", num);
    }

    getWounds(): number {
        return this.tempCountById(Constants.WOUNDS);
    }

    subWounds(num: number): number {
        return this.subTemp(Constants.WOUNDS, num);
    }

    addWounds(num: number): number {
        return this.addTemp(Constants.WOUNDS, num);
    }

    disease(): number {
        return this.tempCountById("Disease");
    }

    ail(num: number): number {
        return this.addTemp("Disease", num);
    }

    skill(): number {
        let num = this.getSkill() - this.disease();
        if (num < 1) {
            return 1;
        }
        return num;
    }

    getLevel(): number {
        return this.rankCountById(Constants.LEVEL);
    }

    picfile(path: string): void {
        this.picfile = path.length < 1 ? null : path;
    }

    fight(): number {
        return this.tempCountById(Constants.FIGHT);
    }

    fight(num: number): void {
        this.subTemp(Constants.FIGHT, num);
    }

    magic(): number {
        return this.tempCountById(Constants.MAGIC);
    }

    magic(num: number): void {
        this.subTemp(Constants.MAGIC, num);
    }

    thief(): number {
        return this.tempCountById(Constants.THIEF);
    }

    thief(num: number): void {
        this.subTemp(Constants.THIEF, num);
    }

    ieatsu(): number {
        return this.tempCountById(Constants.IEATSU);
    }

    ieatsu(num: number): void {
        this.subTemp(Constants.IEATSU, num);
    }

    fightRank(): number {
        return this.rankCountById(Constants.FIGHT);
    }

    magicRank(): number {
        return this.rankCountById(Constants.MAGIC);
    }

    thiefRank(): number {
        return this.rankCountById(Constants.THIEF);
    }

    ieatsuRank(): number {
        return this.rankCountById(Constants.IEATSU);
    }

    guildRank(): number {
        return this.fightRank() + this.magicRank() + this.thiefRank() + this.ieatsuRank();
    }

    guildSkill(): number {
        return this.fight() + this.magic() + this.thief() + this.ieatsu();
    }

    actions(): number {
        return this.tempCountById(Constants.ACTIONS);
    }

    useAction(num: number): boolean {
        return this.subTemp(Constants.ACTIONS, num) === num;
    }

    useAction(): boolean {
        return this.useAction(1);
    }

    packHeal(): number {
        return (
            this.packCountById(GearTypes.APPLE) +
            this.packCountById(GearTypes.TROLL) +
            this.packCountById(GearTypes.SALVE)
        );
    }

    packMagic(): number {
        return (
            this.packCountById(GearTypes.BLIND_DUST) +
            this.packCountById(GearTypes.PANIC_DUST) +
            this.packCountById(GearTypes.BLAST_DUST)
        );
    }

    getPortrait(): Portrait {
        let msg = "";
        if (this.hasTrait("Blind")) {
            msg += "*BLIND*\n";
        }
        if (this.hasTrait("Panic")) {
            msg += "+PANIC+\n";
        }
        this.getPicture().setText(msg);
        return this.getPicture();
    }

    doRefresh(): void {
        this.getTemp().sub(Constants.FATIGUE, 1);
    }

    doHaste(): void {
        this.getTemp().add(Constants.ACTIONS, 2);
    }

    doCookie(): void {
        this.getTemp().zero(Constants.FATIGUE);
    }

    doCure(): void {
        this.getTemp().zero("Disease");
        this.getTemp().clrTrait("Blind");
        this.getTemp().clrTrait("Panic");
    }

    doFood(): void {
        if (this.hasTrait(Constants.MEDIC)) {
            this.subWounds(3);
        } else {
            this.subWounds(2);
        }
    }

        doHeal(): void {
        if (this.hasTrait(Constants.MEDIC)) {
            this.subWounds(25);
        } else {
            this.subWounds(15);
        }
    }

    doRevive(): void {
        if (this.hasTrait(Constants.MEDIC)) {
            this.subWounds(50);
        } else {
            this.subWounds(30);
        }
        this.doCure();
    }

    doPanic(): void {
        this.getActions().add("Panic", 1);
        this.getActions().setName(Constants.SPELLS);
    }

    doBlind(): void {
        this.getActions().add("Blind", 1);
        this.getActions().setName(Constants.SPELLS);
    }

    doBlast(): void {
        this.getActions().add(ArmsTrait.BLAST, 1);
        this.getActions().setName(Constants.SPELLS);
    }
}
