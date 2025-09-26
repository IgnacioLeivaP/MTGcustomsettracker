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
    overviewSections: {
      totalCards: boolean;
      cardsWithImages: boolean;
      originalVsReprints: boolean;
      activeArchetypes: boolean;
      archetypeBreakdown: boolean;
    };
  };
}