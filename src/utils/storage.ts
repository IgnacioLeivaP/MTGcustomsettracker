import { AppData, Card, Archetype } from '../types';

const STORAGE_KEY = 'mtg-card-tracker-data';
const STORAGE_VERSION = '1.0.0';

const defaultArchetypes: Archetype[] = [
  { id: 'transformation', name: 'Transformation', description: 'Shape-shifting abilities', color: 'bg-purple-500/20 border-purple-500/30' },
  { id: 'power', name: 'Power', description: 'Raw magical abilities', color: 'bg-orange-500/20 border-orange-500/30' },
  { id: 'wu', name: 'WU: Control & Spirits', description: 'White-Blue control archetype', color: 'bg-gradient-to-r from-white/20 to-blue-500/20' },
  { id: 'ur', name: 'UR: Sound/Electricity', description: 'Blue-Red tempo archetype', color: 'bg-gradient-to-r from-blue-500/20 to-red-500/20' },
  { id: 'rb', name: 'RB: Zombies/Graveyard', description: 'Red-Black graveyard synergies', color: 'bg-gradient-to-r from-red-500/20 to-black/40' },
  { id: 'gu', name: 'GU: ETB/Blink', description: 'Green-Blue enter the battlefield', color: 'bg-gradient-to-r from-green-500/20 to-blue-500/20' },
  { id: 'bw', name: 'BW: Vampires Matter', description: 'Black-White vampire tribal', color: 'bg-gradient-to-r from-black/40 to-white/20' },
  { id: 'gb', name: 'GB: Sacrifice', description: 'Green-Black sacrifice theme', color: 'bg-gradient-to-r from-green-500/20 to-black/40' },
  { id: 'ub', name: 'UB: Evasion & Landfall', description: 'Blue-Black evasive creatures', color: 'bg-gradient-to-r from-blue-500/20 to-black/40' },
  { id: 'wr', name: 'WR: Soldiers/Vampire Hate', description: 'White-Red aggressive', color: 'bg-gradient-to-r from-white/20 to-red-500/20' },
  { id: 'gr', name: 'GR: Vampire Beasts', description: 'Green-Red creature focus', color: 'bg-gradient-to-r from-green-500/20 to-red-500/20' },
  { id: 'br', name: 'BR: Haste + Counters', description: 'Black-Red aggressive counters', color: 'bg-gradient-to-r from-black/40 to-red-500/20' }
];

const defaultCards: Card[] = [
  // Transformations
  { id: '1', name: 'Bat Form', type: 'Enchantment - Aura', manaCost: '{2}{B}', archetype: 'transformation', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '2', name: 'Wolf Form', type: 'Instant', manaCost: '{1}{G}', archetype: 'transformation', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '3', name: 'Mist Form', type: 'Enchantment - Aura', manaCost: '{3}{U}', archetype: 'transformation', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '4', name: 'Disguise Form', type: 'Enchantment - Aura', manaCost: '{1}{U}{B}', archetype: 'transformation', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '5', name: 'Beguile Form', type: 'Enchantment - Aura', manaCost: '{2}{R}', archetype: 'transformation', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },

  // Powers
  { id: '6', name: 'Sanctuary', type: 'Enchantment', manaCost: '{3}{W}', archetype: 'power', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '7', name: 'Light', type: 'Instant', manaCost: '{W}', archetype: 'power', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '8', name: 'Repel Aegis', type: 'Instant', manaCost: '{1}{W}', archetype: 'power', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '9', name: 'Mind Stun', type: 'Instant', manaCost: '{2}{U}', archetype: 'power', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  { id: '10', name: 'Control Mind', type: 'Sorcery', manaCost: '{4}{U}{B}', archetype: 'power', imageStatus: 'pending', isReprint: false, createdAt: Date.now() },
  
  // Example creature with power/toughness
  { id: '11', name: 'Vampire Knight', type: 'Creature - Vampire Knight', manaCost: '{2}{B}', archetype: 'bw', imageStatus: 'pending', isReprint: false, power: '2', toughness: '2', abilityText: 'Flying, lifelink', flavorText: '"In darkness, we find our true strength."', createdAt: Date.now() },
];

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AppData;
      // Migrate or use defaults if version mismatch
      if (data.version !== STORAGE_VERSION) {
        const defaultData = getDefaultData();
        return {
          ...defaultData,
          cards: data.cards || defaultData.cards,
          archetypes: data.archetypes || defaultData.archetypes
        };
      }
      // Ensure settings object exists and has all required properties
      const defaultData = getDefaultData();
      return {
        ...data,
        settings: {
          ...defaultData.settings,
          ...data.settings,
          overviewSections: {
            ...defaultData.settings.overviewSections,
            ...(data.settings?.overviewSections || {})
          }
        }
      };
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return getDefaultData();
};

export const saveData = (data: AppData): void => {
  try {
    // Create a copy of data without image files to avoid quota exceeded errors
    const dataToSave = {
      ...data,
      cards: data.cards.map(card => {
        const { imageFile, ...cardWithoutImage } = card;
        return cardWithoutImage;
      })
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const clearData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

const getDefaultData = (): AppData => ({
  cards: [...defaultCards],
  archetypes: [...defaultArchetypes],
  version: STORAGE_VERSION,
  settings: {
    overviewSections: {
      totalCards: true,
      cardsWithImages: true,
      originalVsReprints: true,
      activeArchetypes: true,
      archetypeBreakdown: true
    }
  }
});