export interface Card {
  id: string;
  name: string;
  type: string;
  manaCost: string;
  archetype: string;
  imageStatus: 'pending' | 'complete';
  isReprint: boolean;
  rarity: 'C' | 'U' | 'R' | 'M';
  isNickname: boolean;
  isAlternateArt: boolean;
  originalName?: string;
  isDoubleFaced: boolean;
  otherFaceId?: string;
  imageFile?: string; // base64 encoded image
  power?: string;
  toughness?: string;
  abilityText?: string;
  flavorText?: string;
  createdAt: number;
  number?: string;
  artist?: string;
  isToken?: boolean;
  isEmblem?: boolean;
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface AppData {
  cards: Card[];
  archetypes: Archetype[];
  version: string;
  settings: {
    setInfo: {
      name: string;
      description: string;
      totalCards: number;
      hasAlternateArts: boolean;
      setIcon?: string; // base64 encoded image
      customCounters: {
        rarities: {
          common: number;
          uncommon: number;
          rare: number;
          mythic: number;
        };
        alternateArts: {
          target: number;
        };
        tokens: {
          target: number;
        };
        emblems: {
          target: number;
        };
      };
    };
    overviewSections: {
      totalCards: boolean;
      cardsWithImages: boolean;
      originalVsReprints: boolean;
      activeArchetypes: boolean;
      archetypeBreakdown: boolean;
      colorBreakdown: boolean;
      rarityRatio: boolean;
      cardTypeBreakdown: boolean;
      costBreakdown: boolean;
      multicolored: boolean;
      averagePowerToughness: boolean;
      rarityDistribution: boolean;
      individualRarities: boolean;
      alternateArts: boolean;
      tokens: boolean;
      emblems: boolean;
    };
  };
}