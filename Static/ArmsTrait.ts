import { itList } from 'path-to-itList'; // Replace with the correct import path
import { Tools } from 'path-to-Tools'; // Replace with the correct import path

export interface ArmsTrait {
  HEAD: string;
  BODY: string;
  RIGHT: string;
  LEFT: string;
  FEET: string;
  SECRET: string;
  DECAY: string;
  CURSED: string;
  CURSE: string;
  GLOWS: string;
  FLAME: string;
  BLESS: string;
  LUCKY: string;
  DISEASE: string;
  BLIND: string;
  PANIC: string;
  BLAST: string;
  ENCHANT: string;
}

export const traitLabel: string[] = [
  'Head', 'Body', 'Feet', 'Right', 'Left', 'Decay', 'Secret', 'Cursed', 'Curse', 'Glows',
  'Flame', 'Bless', 'Lucky', 'Disease', 'Blind', 'Panic', 'Blast', 'Enchant'
];

export const traitList: itList = new itList('Traits', traitLabel);

export const VISIBLE_TRAIT: number = traitList.firstOf('Curse');
export const RANDOM_TRAIT: number = traitList.firstOf('Cursed');
export const VALUED_TRAIT: number = traitList.firstOf('Glows');
export const END_WEAR_TRAIT: number = traitList.firstOf('Left') + 1;
export const ENCHANT_TRAIT: number = traitList.firstOf('Enchant');
export const MAX_TRAITS: number = traitLabel.length;

export const traitValue: number[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 800, Tools.DEFAULT_HEIGHT, 250, 1500, 4000, 3000, 2000, 100
];
