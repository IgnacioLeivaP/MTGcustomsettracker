import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { Settings, RotateCcw, Eye, EyeOff, Columns } from 'lucide-react';
import { ManaSymbols } from './ManaSymbols';
import { CardEditModal } from './CardEditModal';

interface CardTableProps {
  cards: Card[];
  archetypes: Archetype[];
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
  onDeleteCard: (id: string) => void;
}

interface ColumnVisibility {
  originalName: boolean;
  manaCost: boolean;
  type: boolean;
  rarity: boolean;
  archetype: boolean;
  originalReprint: boolean;
  imageStatus: boolean;
  actions: boolean;
}

export const CardTable: React.FC<CardTableProps> = ({ 
  cards, 
  archetypes, 
  onUpdateCard, 
  onDeleteCard 
}) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    originalName: true,
    manaCost: true,
    type: true,
    rarity: true,
    archetype: true,
    originalReprint: true,
    imageStatus: true,
    actions: true
  });

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
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const columnConfig = [
    { key: 'originalName' as const, label: 'Original Name', description: 'Shows original card name for nickname cards' },
    { key: 'manaCost' as const, label: 'Mana Cost', description: 'Displays mana cost symbols' },
    { key: 'type' as const, label: 'Type', description: 'Card type line' },
    { key: 'rarity' as const, label: 'Rarity', description: 'Card rarity (C/U/R/M)' },
    { key: 'archetype' as const, label: 'Archetype', description: 'Card archetype assignment' },
    { key: 'originalReprint' as const, label: 'Original/Reprint', description: 'Shows if card is original or reprint' },
    { key: 'imageStatus' as const, label: 'Image Status', description: 'Image completion status' },
    { key: 'actions' as const, label: 'Actions', description: 'Edit and configuration buttons' }
  ];

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
                The "Card Name" column is always visible as it's essential for identification.
              </p>
            </div>
          </div>
        )}

        {/* Card Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-red-500/30">
                <th className="p-4 text-left font-bold text-white">Card Name</th>
                {columnVisibility.originalName && (
                  <th className="p-4 text-left font-bold text-white">Original Name</th>
                )}
                {columnVisibility.manaCost && (
                  <th className="p-4 text-left font-bold text-white">Mana Cost</th>
                )}
                {columnVisibility.type && (
                  <th className="p-4 text-left font-bold text-white">Type</th>
                )}
                {columnVisibility.rarity && (
                  <th className="p-4 text-left font-bold text-white">Rarity</th>
                )}
                {columnVisibility.archetype && (
                  <th className="p-4 text-left font-bold text-white">Archetype</th>
                )}
                {columnVisibility.originalReprint && (
                  <th className="p-4 text-left font-bold text-white">Original/Reprint</th>
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
              {cards.map((card) => (
                <tr 
                  key={card.id}
                  className={`${getArchetypeColor(card.archetype)} hover:bg-white/10 transition-colors border-b border-white/10`}
                >
                  <td className="p-4">
                    <strong className="text-white">{card.name}</strong>
                    {card.isDoubleFaced && (
                      <span className="ml-2 text-blue-300" title="Double-faced card">
                        <RotateCcw className="w-4 h-4 inline" />
                      </span>
                    )}
                  </td>
                  {columnVisibility.originalName && (
                    <td className="p-4">
                      {card.isNickname && card.originalName ? (
                        <span className="text-purple-300 italic">{card.originalName}</span>
                      ) : (
                        <span className="text-gray-500">—</span>
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
          Showing {cards.length} cards
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