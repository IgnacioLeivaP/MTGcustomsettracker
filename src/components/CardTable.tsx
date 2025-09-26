import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { Settings, RotateCcw, Eye, EyeOff, Columns2 as Columns, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ManaSymbols } from './ManaSymbols';
import { CardEditModal } from './CardEditModal';

interface CardTableProps {
  cards: Card[];
  archetypes: Archetype[];
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
  onDeleteCard: (id: string) => void;
}

interface ColumnVisibility {
  number: boolean;
  originalName: boolean;
  manaCost: boolean;
  type: boolean;
  rarity: boolean;
  archetype: boolean;
  originalReprint: boolean;
  imageStatus: boolean;
  colorIdentity: boolean;
  imageThumbnail: boolean;
  actions: boolean;
}

type SortField = 'name' | 'manaCost' | 'rarity' | 'archetype' | 'originalReprint' | 'type' | 'colorIdentity';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

const COLUMN_SETTINGS_KEY = 'mtg-card-table-columns';
const SORT_SETTINGS_KEY = 'mtg-card-table-sort';

const defaultColumnVisibility: ColumnVisibility = {
  number: true,
  originalName: true,
  manaCost: true,
  type: true,
  rarity: true,
  archetype: true,
  originalReprint: true,
  imageStatus: true,
  colorIdentity: true,
  imageThumbnail: true,
  actions: true
};

const loadColumnSettings = (): ColumnVisibility => {
  try {
    const stored = localStorage.getItem(COLUMN_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return { ...defaultColumnVisibility, ...parsed };
    }
  } catch (error) {
    console.error('Error loading column settings:', error);
  }
  return defaultColumnVisibility;
};

const saveColumnSettings = (settings: ColumnVisibility): void => {
  try {
    localStorage.setItem(COLUMN_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving column settings:', error);
  }
};

const loadSortSettings = (): SortConfig => {
  try {
    const stored = localStorage.getItem(SORT_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading sort settings:', error);
  }
  return { field: null, direction: 'asc' };
};

const saveSortSettings = (settings: SortConfig): void => {
  try {
    localStorage.setItem(SORT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving sort settings:', error);
  }
};

export const CardTable: React.FC<CardTableProps> = ({ 
  cards, 
  archetypes, 
  onUpdateCard, 
  onDeleteCard 
}) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>(() => loadSortSettings());
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => loadColumnSettings());

  const toggleImageStatus = (cardId: string, currentStatus: 'pending' | 'complete') => {
    onUpdateCard(cardId, { 
      imageStatus: currentStatus === 'complete' ? 'pending' : 'complete' 
    });
  };

  const toggleReprint = (cardId: string, currentReprint: boolean) => {
    onUpdateCard(cardId, { isReprint: !currentReprint });
  };

  const getArchetypeName = (id: string) => {
    return archetypes.find(a => a.id === id)?.name || id;
  };

  const getArchetypeColor = (id: string) => {
    return archetypes.find(a => a.id === id)?.color || 'bg-gray-500/20 border-gray-500/30';
  };

  const openEditModal = (card: Card) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingCard(null);
    setIsEditModalOpen(false);
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    const newSettings = {
      ...columnVisibility,
      [column]: !columnVisibility[column]
    };
    setColumnVisibility(newSettings);
    saveColumnSettings(newSettings);
  };

  const getConvertedManaCost = (manaCost: string): number => {
    if (!manaCost) return 0;
    let total = 0;
    const symbols = manaCost.match(/\{([^}]+)\}/g) || [];
    symbols.forEach(symbol => {
      const content = symbol.slice(1, -1);
      if (/^\d+$/.test(content)) {
        total += parseInt(content);
      } else {
        total += 1; // Each colored symbol counts as 1
      }
    });
    return total;
  };

  const getRarityOrder = (rarity: string): number => {
    const order = { 'C': 0, 'U': 1, 'R': 2, 'M': 3 };
    return order[rarity as keyof typeof order] ?? 999;
  };

  const getColorIdentity = (card: Card): { colors: string[], category: string, displayName: string } => {
    const manaCost = card.manaCost || '';
    const cardType = card.type.toLowerCase();
    const colors = new Set<string>();
    
    // Extract colors from mana cost
    if (manaCost.includes('W') || manaCost.includes('w')) colors.add('W');
    if (manaCost.includes('U') || manaCost.includes('u')) colors.add('U');
    if (manaCost.includes('B') || manaCost.includes('b')) colors.add('B');
    if (manaCost.includes('R') || manaCost.includes('r')) colors.add('R');
    if (manaCost.includes('G') || manaCost.includes('g')) colors.add('G');
    
    const colorArray = Array.from(colors).sort();
    
    // Determine category
    if (cardType.includes('land')) {
      return { colors: [], category: 'Land', displayName: 'Land' };
    }
    
    if (colorArray.length === 0) {
      if (cardType.includes('artifact')) {
        return { colors: [], category: 'Artifact', displayName: 'Artifact' };
      }
      return { colors: [], category: 'Colorless', displayName: 'Colorless' };
    }
    
    if (colorArray.length > 1) {
      return { colors: colorArray, category: 'Multicolor', displayName: 'Multicolor' };
    }
    
    const colorNames = {
      'W': 'White',
      'U': 'Blue', 
      'B': 'Black',
      'R': 'Red',
      'G': 'Green'
    };
    
    const singleColor = colorArray[0];
    return { 
      colors: colorArray, 
      category: colorNames[singleColor as keyof typeof colorNames] || 'Unknown',
      displayName: colorNames[singleColor as keyof typeof colorNames] || 'Unknown'
    };
  };
  
  const getColorIdentityOrder = (card: Card): number => {
    const identity = getColorIdentity(card);
    const order = {
      'White': 0,
      'Blue': 1,
      'Black': 2,
      'Red': 3,
      'Green': 4,
      'Multicolor': 5,
      'Artifact': 6,
      'Land': 7,
      'Colorless': 8
    };
    return order[identity.category as keyof typeof order] ?? 999;
  };
  
  const renderColorIdentity = (card: Card) => {
    const identity = getColorIdentity(card);
    
    if (identity.category === 'Land') {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 rounded border-2 border-gray-500 bg-gradient-to-br from-green-800 to-brown-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">🏞️</span>
          </div>
          <span className="text-gray-300 text-sm">Land</span>
        </div>
      );
    }
    
    if (identity.category === 'Artifact') {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 rounded border-2 border-gray-400 bg-gray-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">⚙️</span>
          </div>
          <span className="text-gray-300 text-sm">Artifact</span>
        </div>
      );
    }
    
    if (identity.category === 'Multicolor') {
      const colorSymbols = {
        'W': '☀️',
        'U': '💧',
        'B': '💀',
        'R': '🔥',
        'G': '🌳'
      };
      
      return (
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 rounded border-2 border-yellow-400 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex">
              {identity.colors.slice(0, 2).map((color, index) => (
                <div key={color} className={`flex-1 flex items-center justify-center text-xs ${
                  color === 'W' ? 'bg-yellow-100' :
                  color === 'U' ? 'bg-blue-400' :
                  color === 'B' ? 'bg-gray-800' :
                  color === 'R' ? 'bg-red-500' :
                  'bg-green-500'
                }`}>
                  <span className="text-white text-xs">
                    {colorSymbols[color as keyof typeof colorSymbols]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="text-yellow-300 text-sm">Multicolor</span>
        </div>
      );
    }
    
    // Single color
    const colorInfo = {
      'White': { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800', symbol: '☀️', textColor: 'text-yellow-300' },
      'Blue': { bg: 'bg-blue-400', border: 'border-blue-500', text: 'text-white', symbol: '💧', textColor: 'text-blue-300' },
      'Black': { bg: 'bg-gray-800', border: 'border-gray-600', text: 'text-white', symbol: '💀', textColor: 'text-gray-300' },
      'Red': { bg: 'bg-red-500', border: 'border-red-600', text: 'text-white', symbol: '🔥', textColor: 'text-red-300' },
      'Green': { bg: 'bg-green-500', border: 'border-green-600', text: 'text-white', symbol: '🌳', textColor: 'text-green-300' }
    };
    
    const info = colorInfo[identity.category as keyof typeof colorInfo];
    if (!info) {
      return <span className="text-gray-400">—</span>;
    }
    
    return (
      <div className="flex items-center space-x-1">
        <div className={`w-6 h-6 rounded border-2 ${info.border} ${info.bg} flex items-center justify-center`}>
          <span className={`text-xs ${info.text}`}>{info.symbol}</span>
        </div>
        <span className={`text-sm ${info.textColor}`}>{identity.displayName}</span>
      </div>
    );
  };

  const handleSort = (field: SortField) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const newSortConfig = { field, direction };
    setSortConfig(newSortConfig);
    saveSortSettings(newSortConfig);
  };

  const getSortedCards = () => {
    if (!sortConfig.field) return cards;

    return [...cards].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'number':
          // Sort by number, treating empty as highest value
          aValue = a.number ? parseInt(a.number.replace(/\D/g, '')) || 999999 : 999999;
          bValue = b.number ? parseInt(b.number.replace(/\D/g, '')) || 999999 : 999999;
          break;
        case 'manaCost':
          aValue = getConvertedManaCost(a.manaCost || '');
          bValue = getConvertedManaCost(b.manaCost || '');
          break;
        case 'rarity':
          aValue = getRarityOrder(a.rarity);
          bValue = getRarityOrder(b.rarity);
          break;
        case 'archetype':
          aValue = getArchetypeName(a.archetype).toLowerCase();
          bValue = getArchetypeName(b.archetype).toLowerCase();
          break;
        case 'originalReprint':
          aValue = a.isReprint ? 1 : 0; // Original = 0, Reprint = 1
          bValue = b.isReprint ? 1 : 0;
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'colorIdentity':
          const aOrder = getColorIdentityOrder(a);
          const bOrder = getColorIdentityOrder(b);
          if (aOrder !== bOrder) {
            aValue = aOrder;
            bValue = bOrder;
          } else {
            // Same color identity, sort alphabetically by name
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
          }
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-400" />
      : <ArrowDown className="w-4 h-4 text-blue-400" />;
  };

  const columnConfig = [
    { key: 'number' as const, label: 'Card Number', description: 'Shows card number for set ordering' },
    { key: 'originalName' as const, label: 'Original Name', description: 'Shows original card name for nickname cards' },
    { key: 'imageThumbnail' as const, label: 'Image Thumbnail', description: 'Shows card image thumbnail if uploaded' },
    { key: 'manaCost' as const, label: 'Mana Cost', description: 'Displays mana cost symbols' },
    { key: 'type' as const, label: 'Type', description: 'Card type line' },
    { key: 'rarity' as const, label: 'Rarity', description: 'Card rarity (C/U/R/M)' },
    { key: 'archetype' as const, label: 'Archetype', description: 'Card archetype assignment' },
    { key: 'colorIdentity' as const, label: 'Color Identity', description: 'Automatic color identity based on mana cost' },
    { key: 'originalReprint' as const, label: 'Original/Reprint', description: 'Shows if card is original or reprint' },
    { key: 'imageStatus' as const, label: 'Image Status', description: 'Image completion status' },
    { key: 'actions' as const, label: 'Actions', description: 'Edit and configuration buttons' }
  ];

  const sortedCards = getSortedCards();

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-400">📋 Card List</h2>
          <button
            onClick={() => setShowColumnConfig(!showColumnConfig)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Columns className="w-4 h-4" />
            <span>Column Settings</span>
          </button>
        </div>

        {/* Column Configuration Panel */}
        {showColumnConfig && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Column Visibility Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {columnConfig.map((column) => (
                <div
                  key={column.key}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{column.label}</h4>
                    <p className="text-xs text-gray-400">{column.description}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleColumnVisibility(column.key)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                      columnVisibility[column.key]
                        ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                        : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                    }`}
                  >
                    {columnVisibility[column.key] ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Show</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-200">
                💡 <strong>Tip:</strong> Hide columns you don't need to create a cleaner view. 
                The "Card Name\" column is always visible as it's essential for identification.
              </p>
            </div>
          </div>
        )}

        {/* Card Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-red-500/30">
                {columnVisibility.number && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('number')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Card Number</span>
                      {getSortIcon('number')}
                    </button>
                  </th>
                )}
                <th className="p-4 text-left font-bold text-white">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                  >
                    <span>Card Name</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                {columnVisibility.originalName && (
                  <th className="p-4 text-left font-bold text-white">Original Name</th>
                )}
                {columnVisibility.imageThumbnail && (
                  <th className="p-4 text-left font-bold text-white">Image</th>
                )}
                {columnVisibility.manaCost && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('manaCost')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Mana Cost</span>
                      {getSortIcon('manaCost')}
                    </button>
                  </th>
                )}
                {columnVisibility.type && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Type</span>
                      {getSortIcon('type')}
                    </button>
                  </th>
                )}
                {columnVisibility.rarity && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('rarity')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Rarity</span>
                      {getSortIcon('rarity')}
                    </button>
                  </th>
                )}
                {columnVisibility.archetype && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('archetype')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Archetype</span>
                      {getSortIcon('archetype')}
                    </button>
                  </th>
                )}
                {columnVisibility.colorIdentity && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('colorIdentity')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Color Identity</span>
                      {getSortIcon('colorIdentity')}
                    </button>
                  </th>
                )}
                {columnVisibility.originalReprint && (
                  <th className="p-4 text-left font-bold text-white">
                    <button
                      onClick={() => handleSort('originalReprint')}
                      className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
                    >
                      <span>Original/Reprint</span>
                      {getSortIcon('originalReprint')}
                    </button>
                  </th>
                )}
                {columnVisibility.imageStatus && (
                  <th className="p-4 text-left font-bold text-white">Image Status</th>
                )}
                {columnVisibility.actions && (
                  <th className="p-4 text-left font-bold text-white">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedCards.map((card) => (
                <tr 
                  key={card.id}
                  className={`${getArchetypeColor(card.archetype)} hover:bg-white/10 transition-colors border-b border-white/10`}
                >
                  {columnVisibility.number && (
                    <td className="p-4">
                      <span className="text-gray-300">{card.number || '—'}</span>
                    </td>
                  )}
                  <td className="p-4">
                    <strong className="text-white">{card.name}</strong>
                    {card.isDoubleFaced && (
                  {columnVisibility.originalName && (
                    <td className="p-4">
                      {card.isNickname && card.originalName ? (
                        <span className="text-purple-300 italic">{card.originalName}</span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  )}
                  {columnVisibility.imageThumbnail && (
                    <td className="p-4">
                      {card.imageFile ? (
                        <div className="relative group">
                          <img 
                            src={card.imageFile} 
                            alt={`${card.name} thumbnail`}
                            className="w-12 h-12 object-cover rounded border border-white/20 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => {
                              // Create a modal to show full image
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
                              modal.onclick = () => modal.remove();
                              
                              const img = document.createElement('img');
                              img.src = card.imageFile!;
                              img.className = 'max-w-full max-h-full object-contain rounded-lg shadow-2xl';
                              img.alt = card.name;
                              
                              modal.appendChild(img);
                              document.body.appendChild(modal);
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                              Click to enlarge
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-600/30 rounded border border-white/10 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                  )}
                  {columnVisibility.manaCost && (
                    <td className="p-4">
                      <ManaSymbols manaCost={card.manaCost || ''} />
                    </td>
                  )}
                  {columnVisibility.type && (
                    <td className="p-4 text-gray-300">{card.type}</td>
                  )}
                  {columnVisibility.rarity && (
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        card.rarity === 'C' ? 'bg-gray-600/20 text-gray-300' :
                        card.rarity === 'U' ? 'bg-blue-500/20 text-blue-300' :
                        card.rarity === 'R' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {card.rarity}
                      </span>
                    </td>
                  )}
                  {columnVisibility.archetype && (
                    <td className="p-4">
                      <span className="text-white">{getArchetypeName(card.archetype)}</span>
                    </td>
                  )}
                  {columnVisibility.colorIdentity && (
                    <td className="p-4">
                      {renderColorIdentity(card)}
                    </td>
                  )}
                  {columnVisibility.originalReprint && (
                    <td className="p-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => toggleReprint(card.id, card.isReprint)}
                          className={`px-2 py-1 rounded font-bold text-xs transition-colors ${
                            card.isReprint 
                              ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30' 
                              : 'bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30'
                          }`}
                        >
                          {card.isReprint ? 'R' : 'O'}
                        </button>
                        {card.isNickname && (
                          <span className="px-2 py-1 rounded font-bold text-xs bg-purple-500/20 text-purple-300">
                            N
                          </span>
                        )}
                        {card.isAlternateArt && (
                          <span className="px-2 py-1 rounded font-bold text-xs bg-cyan-500/20 text-cyan-300">
                            AA
                          </span>
                        )}
                        {card.isDoubleFaced && (
                          <span className="px-2 py-1 rounded font-bold text-xs bg-indigo-500/20 text-indigo-300">
                            DF
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {columnVisibility.imageStatus && (
                    <td className="p-4">
                      <button
                        onClick={() => toggleImageStatus(card.id, card.imageStatus)}
                        className={`px-3 py-1 rounded font-bold text-sm border-2 transition-colors ${
                          card.imageStatus === 'complete'
                            ? 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30'
                            : 'bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                        }`}
                      >
                        {card.imageStatus === 'complete' ? '✓ Done' : '⏳ Pending'}
                      </button>
                    </td>
                  )}
                  {columnVisibility.actions && (
                    <td className="p-4">
                      <button
                        onClick={() => openEditModal(card)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                        title="Configure card"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards Count */}
        <div className="mt-4 text-center text-gray-400">
          Showing {sortedCards.length} cards
          {sortConfig.field && (
            <span className="ml-2 text-blue-300">
              (sorted by {sortConfig.field} {sortConfig.direction === 'asc' ? '↑' : '↓'})
            </span>
          )}
        </div>
      </div>

      <CardEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        card={editingCard}
        archetypes={archetypes}
        cards={cards}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
      />
    </>
  );
};