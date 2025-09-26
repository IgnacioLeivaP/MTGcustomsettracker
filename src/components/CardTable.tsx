import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { Settings, RotateCcw } from 'lucide-react';
import { ManaSymbols } from './ManaSymbols';
import { CardEditModal } from './CardEditModal';

interface CardTableProps {
  cards: Card[];
  archetypes: Archetype[];
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
  onDeleteCard: (id: string) => void;
}

export const CardTable: React.FC<CardTableProps> = ({ 
  cards, 
  archetypes, 
  onUpdateCard, 
  onDeleteCard 
}) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-red-400">📋 Card List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-500/30">
              <th className="p-4 text-left font-bold text-white">Card Name</th>
              <th className="p-4 text-left font-bold text-white">Original Name</th>
              <th className="p-4 text-left font-bold text-white">Mana Cost</th>
              <th className="p-4 text-left font-bold text-white">Type</th>
              <th className="p-4 text-left font-bold text-white">Rarity</th>
              <th className="p-4 text-left font-bold text-white">Archetype</th>
              <th className="p-4 text-left font-bold text-white">Original/Reprint</th>
              <th className="p-4 text-left font-bold text-white">Image Status</th>
              <th className="p-4 text-left font-bold text-white">Actions</th>
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
                <td className="p-4">
                  {card.isNickname && card.originalName ? (
                    <span className="text-purple-300 italic">{card.originalName}</span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="p-4">
                  <ManaSymbols manaCost={card.manaCost || ''} />
                </td>
                <td className="p-4 text-gray-300">{card.type}</td>
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
                <td className="p-4">
                  <span className="text-white">{getArchetypeName(card.archetype)}</span>
                </td>
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
                <td className="p-4">
                  <button
                    onClick={() => openEditModal(card)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                    title="Configure card"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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