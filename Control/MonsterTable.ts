import { itMonster } from './DCourt/Items/List/itMonster';
import { Quests, VQuests } from './DCourt/Screens/Quest';

class MonsterTable implements Quests, VQuests {
  private static table: Map<string, itMonster> | null = null;
  private static loading: boolean = false;

  constructor() {
    this.buildTable();
  }

  public static isLoading(): boolean {
    return this.loading;
  }

  public static find(key: string): itMonster | null {
    const what = this.table?.get(key);
    if (what !== undefined) {
      return what;
    }
    console.error(`MonsterTable could not find key=[${key}]`);
    return null;
  }

  private add(key: string, info: string): void {
    // Assuming Item class and factory function implementation
    const it = Item.factory(info);
    if (it === null || !(it instanceof itMonster)) {
      console.error(`MonsterTable bad item = [${info}]`);
    } else if (this.table?.get(key) !== undefined) {
      console.error(`MonsterTable duplicate key=[${key}]`);
    } else {
      (it as itMonster).testGear();
      this.table?.set(key, it);
    }
  }

  private synchronized void buildTable() {
  if (table != null) {
    loading = false;
    Tools.repaint();
    return;
  }
  table = new Hashtable();
  add("Town:Guard", Quests.townGuard);
  add("Castle:Guard", Quests.castleGuard);
  add("Vortex:Guard", Quests.vortexGuard);
  add("Faery", Quests.faeryRing);
  add("Fields:Rodent", Quests.fieldRodent);
  add("Fields:Goblin", Quests.fieldGoblin);
  add("Fields:Gypsy", Quests.fieldGypsy);
  add("Fields:Centaur", Quests.fieldCentaur);
  add("Fields:Merchant", Quests.fieldMerchant);
  add("Fields:Wizard", Quests.fieldWizard);
  add("Fields:Soldier", Quests.fieldSoldier);
  Tools.repaint();
  add("Forest:Boar", Quests.forestBoar);
  add("Forest:Orc", Quests.forestOrc);
  add("Forest:Elf", Quests.forestElf);
  add("Forest:Gryphon", Quests.forestGryphon);
  add("Forest:Snot", Quests.forestSnot);
  add("Forest:Unicorn", Quests.forestUnicorn);
  add("Mound:Gate", Quests.moundGate);
  add("Mound:Gang", Quests.moundGang);
  add("Mound:Rager", Quests.moundRager);
  add("Mound:Thief", Quests.moundThief);
  add("Mound:Worm", Quests.moundWorm);
  add("Mound:Mage", Quests.moundMage);
  add("Mound:Guard", Quests.moundGuard);
  add("Mound:Vault", Quests.moundVault);
  add("Mound:Champ", Quests.moundChamp);
  add("Mound:Queen", Quests.moundQueen);
  Tools.repaint();
  add("Hills:Goat", Quests.hillsGoat);
  add("Hills:Basilisk", Quests.hillsBasilisk);
  add("Hills:Wyvern", Quests.hillsWyvern);
  add("Hills:Troll", Quests.hillsTroll);
  add("Hills:Sphinx", Quests.hillsSphinx);
  add("Hills:Giant", Quests.hillsGiant);
  add("Hills:Dragon", Quests.hillsDragon);
  add("Dunjeon:Rodent", VQuests.dungRodent);
  add("Dunjeon:Snot", VQuests.dungSnot);
  add("Dunjeon:Rager", VQuests.dungRager);
  add("Dunjeon:Gang", VQuests.dungGang);
  add("Dunjeon:Troll", VQuests.dungTroll);
  add("Dunjeon:Mage", VQuests.dungMage);
  Tools.repaint();
  add("Ocean:Traders", VQuests.seaTraders);
  add("Ocean:Serpent", VQuests.seaSerpent);
  add("Ocean:Mermaid", VQuests.seaMermaid);
  add("Brasil:Harpy", VQuests.braHarpy);
  add("Brasil:Fighter", VQuests.braFighter);
  add("Brasil:Golem", VQuests.braGolem);
  add("Brasil:Medusa", VQuests.braMedusa);
  add("Brasil:Hero", VQuests.braHero);
  Tools.repaint();
  add("Shang:Gunner", VQuests.shaGunner);
  add("Shang:Plague", VQuests.shaPlague);
  add("Shang:Peasant", VQuests.shaPeasant);
  add("Shang:Ninja", VQuests.shaNinja);
  add("Shang:Shogun", VQuests.shaShogun);
  add("Shang:Panda", VQuests.shaPanda);
  add("Shang:Samurai", VQuests.shaSamurai);
  loading = false;
  Tools.repaint();
}

}

// Assuming you export the necessary classes/interfaces
export { MonsterTable };
