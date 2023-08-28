import { Item } from 'path-to-DCourt.Items.Item';
import { itArms } from 'path-to-DCourt.Items.List.itArms';
import { Hashtable } from 'path-to-java.util.Hashtable';

class ArmsTable {
  static table: Hashtable<string, Item> | null = null;

  constructor() {
    this.buildTable();
  }

  add(info: string): void {
    const it: Item | null = Item.factory(info);
    if (it === null || !(it instanceof itArms)) {
      console.error(`ArmsTable bad item = [${info}]`);
    } else if (this.table?.get(it.getName()) !== null) {
      console.error(`ArmsTable duplicate key = [${it.getName()}]`);
    } else {
      this.table?.put(it.getName(), it);
    }
  }

  static get(it: itArms): itArms | null {
    return this.get(it.getName());
  }

  static get(key: string): itArms | null {
    const what: itArms | undefined = this.table?.get(key);
    if (what !== undefined) {
      return what;
    }
    console.error(`ArmsTable could not find key=[${key}]`);
    return null;
  }

  static find(it: itArms): boolean {
    return this.find(it.getName());
  }

  static find(key: string): boolean {
    if (this.table?.get(key) !== undefined) {
      return true;
    }
    console.error(`ArmsTable could not find item=[${key}]`);
    return false;
  }

  static shopItem(key: string): itArms | null {
    const what: itArms | null = this.get(key);
    if (what === null) {
      return null;
    }
    return <itArms>what.copy();
  }

    buildTable(): void {
    if (ArmsTable.table === null) {
      ArmsTable.table = new Hashtable<string, Item>();
      this.add("{itArms|Knife|2|0|-1|right}");
      this.add("{itArms|Hatchet|4|0|-1|right}");
      this.add("{itArms|Short Sword|5|0|0|right}");
      this.add("{itArms|Long Sword|7|0|0|right}");
      this.add("{itArms|Spear|9|0|1|right}");
      this.add("{itArms|Broad Sword|11|0|1|right}");
      this.add("{itArms|Battle Axe|13|0|1|right|left}");
      this.add("{itArms|Pike|15|0|2|right|left}");
      this.add("{itArms|Silver Pike|30|0|2|right}");
      this.add("{itArms|Sling|4|0|4|right}");
      this.add("{itArms|Short Bow|8|0|6|right|left}");
      this.add("{itArms|Long Bow|12|0|8|right|left}");
      this.add("{itArms|Spike Helm|3|5|-2|head}");
      this.add("{itArms|Main Gauche|2|2|1|left}");
      this.add("{itArms|Clothes|0|2|0|body}");
      this.add("{itArms|Leather Jacket|0|4|0|body}");
      this.add("{itArms|Brigandine|0|6|-1|body}");
      this.add("{itArms|Chain Suit|0|8|-2|body}");
      this.add("{itArms|Scale Suit|0|10|-2|body}");
      this.add("{itArms|Buckler|0|2|-1|left}");
      this.add("{itArms|Targe|0|4|-1|left}");
      this.add("{itArms|Shield|0|6|-2|left}");
      this.add("{itArms|Spike Shield|3|5|-3|left}");
      this.add("{itArms|Sandals|0|0|3|feet}");
      this.add("{itArms|Shoes|0|2|5|feet}");
      this.add("{itArms|Boots|0|4|7|feet}");
      this.add("{itArms|Leather Cap|0|2|-1|head}");
      this.add("{itArms|Pot Helm|0|4|-2|head}");
      this.add("{itArms|Chain Coif|0|6|-3|head}");
      this.add("{itArms|Steel Sword|15|0|-3|right}");
      this.add("{itArms|Bill Hook|17|0|5|right|left}");
      this.add("{itArms|Sword Breaker|6|6|3|left}");
      this.add("{itArms|Shakrum|13|0|7|right}");
      this.add("{itArms|Recurve Bow|16|0|9|right|left}");
      this.add("{itArms|Half Plate|0|12|-6|body}");
      this.add("{itArms|Full Plate|0|15|-9|body}");
      this.add("{itArms|Steel Buckler|0|5|-1|left}");
      this.add("{itArms|Roman Helm|0|7|-3|head}");
      this.add("{itArms|Doc Martins|4|6|5|feet}");
      this.add("{itArms|Mercury Sandals|0|0|20|feet}");
      this.add("{itArms|Rusty Dagger|3|0|-1|right|decay}");
      this.add("{itArms|Throwing Knife|5|0|5|right}");
      this.add("{itArms|Silver Throwing Knife|10|0|10|right|panic}");
      this.add("{itArms|Staff|5|0|3|right|left}");
      this.add("{itArms|War Tusk|7|6|-3|left}");
      this.add("{itArms|Elf Bow|21|0|10|right|left}");
      this.add("{itArms|Silver Elf Bow|42|0|10|right|left|blast}");
      this.add("{itArms|Mithril Mail|0|13|-2|body}");
      this.add("{itArms|Dwarf Axe|13|2|5|right|lucky}");
      this.add("{itArms|Unicorn Horn|17|0|8|right|bless}");
      this.add("{itArms|Cross Bow|20|0|20|right|left}");
      this.add("{itArms|Miners Cap|0|12|-5|head|glows}");
      this.add("{itArms|Goblin Pick|18|0|0|right}");
      this.add("{itArms|Weird Knife|12|8|12}");
      this.add("{itArms|Silver Weird Knife|25|8|12|left|disease}");
      this.add("{itArms|Goblin Shield|0|13|-5|left}");
      this.add("{itArms|War Boots|7|8|10|feet}");
      this.add("{itArms|Goblin Pike|22|0|5|right}");
      this.add("{itArms|Magic Staff|15|10|12|right|left|bless|lucky}");
      this.add("{itArms|Silver Staff|30|10|12|right|bless|lucky}");
      this.add("{itArms|Magic Robes|0|10|3|head|bless|lucky}");
      this.add("{itArms|Goblin Mithril|0|15|-5}");
      this.add("{itArms|Flaming Sword|15|0|5|right|flames}");
      this.add("{itArms|Goblin Plate|0|18|-5|bless}");
      this.add("{itArms|Terror Rod|17|0|8|right|glows|panic}");
      this.add("{itArms|Rams Horn|7|13|-8|left}");
      this.add("{itArms|Giant Maul|45|0|-20|right|left}");
      this.add("{itArms|Silver Giant Maul|90|0|-20|right}");
      this.add("{itArms|Rat Tail Whip|25|6|25|right|disease}");
      this.add("{itArms|Silver Tail Whip|50|12|50|right|disease}");
      this.add("{itArms|Dragon Shield|0|25|18|left}");
      this.add("{itArms|Great Pike|54|0|15|right|left}");
            this.add("{itArms|Mystic Staff|25|25|25|right|left|bless|lucky}");
      this.add("{itArms|Mystic Robes|0|25|12|body|bless|lucky}");
      this.add("{itArms|Great Bow|50|0|35|right|left}");
      this.add("{itArms|Serpent Scale|0|20|25|left}");
      this.add("{itArms|Sea Slippers|0|10|100|feet}");
      this.add("{itArms|Silver Sea Slippers|0|20|200|feet}");
      this.add("{itArms|Gladius|50|0|20|right}");
      this.add("{itArms|Silver Gladius|100|0|20|right|blind}");
      this.add("{itArms|Great Targe|0|35|10|left}");
      this.add("{itArms|Snake Scale Suit|0|50|-15|body}");
      this.add("{itArms|Matchlock Rifle|80|0|80|right|left|blast}");
      this.add("{itArms|Foul Axe|30|0|15|right|disease}");
      this.add("{itArms|Asaura|0|20|12|feet}");
      this.add("{itArms|Nunchaku|25|0|30|right}");
      this.add("{itArms|Shuriken|30|0|50|left}");
      this.add("{itArms|Spirit Katana|50|0|80|right|panic}");
      this.add("{itArms|Masamune|60|0|40|right}");
      this.add("{itArms|Silver Masamune|120|0|40|right|panic}");
      this.add("{itArms|Koutetsu|10|60|-20|body}");
    }
  }


}
