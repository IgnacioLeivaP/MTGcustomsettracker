export interface Card {
  id: string;
  name: string;
  type: string;
  archetype: string;
  imageStatus: 'pending' | 'complete';
  isReprint: boolean;
  imageFile?: string; // base64 encoded image
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
}