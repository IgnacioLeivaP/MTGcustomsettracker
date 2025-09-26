import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { ManaSymbols } from './ManaSymbols';
import { X, Image as ImageIcon } from 'lucide-react';

interface SetSpoilerProps {
  cards: Card[];
  archetypes: Archetype[];
}

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  archetypes: Archetype[];
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, isOpen, onClose, archetypes }) => {
  if (!isOpen || !card) return null;

  const getArchetypeName = (id: string) => {
    return archetypes.find(a => a.id === id)?.name || id;
  };

  const getRarityName = (rarity: string) => {
    const rarityNames = {
      'C': 'Common',
      'U': 'Uncommon', 
      'R': 'Rare',
      'M': 'Mythic Rare'
    };
    return rarityNames[rarity as keyof typeof rarityNames] || rarity;
  };

  const isCreature = card.type.toLowerCase().includes('creature');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-1/2 p-6">
            {card.imageFile ? (
              <img 
                src={card.imageFile} 
                alt={card.name}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[5/7] bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="w-1/2 p-6 border-l border-white/20">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{card.name}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                {card.number && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-medium w-20">Number:</span>
                    <span className="text-white">{card.number}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-medium w-20">Cost:</span>
                  <ManaSymbols manaCost={card.manaCost || ''} />
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-medium w-20">Type:</span>
                  <span className="text-white">{card.type}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-medium w-20">Rarity:</span>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${
                    card.rarity === 'C' ? 'bg-gray-600/20 text-gray-300' :
                    card.rarity === 'U' ? 'bg-blue-500/20 text-blue-300' :
                    card.rarity === 'R' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {getRarityName(card.rarity)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-medium w-20">Set:</span>
                  <span className="text-white">{getArchetypeName(card.archetype)}</span>
                </div>

                {isCreature && card.power && card.toughness && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-medium w-20">P/T:</span>
                    <span className="text-white font-bold">{card.power}/{card.toughness}</span>
                  </div>
                )}
              </div>

              {/* Card Text */}
              {card.abilityText && (
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Card Text</h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {card.abilityText}
                    </p>
                  </div>
                </div>
              )}

              {/* Flavor Text */}
              {card.flavorText && (
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Flavor Text</h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-300 italic whitespace-pre-wrap leading-relaxed">
                      {card.flavorText}
                    </p>
                  </div>
                </div>
              )}

              {/* Artist */}
              {card.artist && (
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-medium">Artist:</span>
                    <span className="text-white">{card.artist}</span>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Additional Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      card.isReprint ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {card.isReprint ? 'Reprint' : 'Original'}
                    </span>
                  </div>

                  {card.isNickname && card.originalName && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Original Name:</span>
                      <span className="text-purple-300">{card.originalName}</span>
                    </div>
                  )}

                  {card.isAlternateArt && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Special:</span>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300">
                        Alternate Art
                      </span>
                    </div>
                  )}

                  {card.isDoubleFaced && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Special:</span>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300">
                        Double-Faced Card
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SetSpoiler: React.FC<SetSpoilerProps> = ({ cards, archetypes }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort cards by number first, then alphabetically by name
  const sortedCards = [...cards].sort((a, b) => {
    // If both have numbers, sort by number
    if (a.number && b.number) {
      const aNum = parseInt(a.number.replace(/\D/g, '')) || 0;
      const bNum = parseInt(b.number.replace(/\D/g, '')) || 0;
      return aNum - bNum;
    }
    
    // Cards with numbers come first
    if (a.number && !b.number) return -1;
    if (!a.number && b.number) return 1;
    
    // If neither has numbers, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  const openCardModal = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const isCreature = (card: Card) => card.type.toLowerCase().includes('creature');

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-400">🃏 Set Spoiler</h2>
          <div className="text-gray-300">
            {sortedCards.length} cards
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => openCardModal(card)}
              className="bg-white/5 border border-white/20 rounded-lg overflow-hidden hover:bg-white/10 hover:border-white/40 transition-all duration-200 cursor-pointer group"
            >
              {/* Card Image or Placeholder */}
              <div className="aspect-[5/7] relative">
                {card.imageFile ? (
                  <img
                    src={card.imageFile}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex flex-col justify-center items-center p-3 text-center">
                    <div className="text-gray-400 mb-2">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs font-semibold">No Preview</p>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-300 w-full">
                      {card.number && (
                        <div className="font-bold text-white">{card.number}</div>
                      )}
                      
                      <div className="font-semibold text-white text-sm leading-tight">
                        {card.name}
                      </div>
                      
                      <div className="flex justify-center">
                        <ManaSymbols manaCost={card.manaCost || ''} />
                      </div>
                      
                      <div className="text-gray-400">{card.type}</div>
                      
                      <div className={`inline-block px-1 py-0.5 rounded text-xs font-bold ${
                        card.rarity === 'C' ? 'bg-gray-600/30 text-gray-300' :
                        card.rarity === 'U' ? 'bg-blue-500/30 text-blue-300' :
                        card.rarity === 'R' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-red-500/30 text-red-300'
                      }`}>
                        {card.rarity}
                      </div>
                      
                      {card.abilityText && (
                        <div className="text-gray-400 text-xs leading-tight line-clamp-2">
                          {card.abilityText.substring(0, 60)}
                          {card.abilityText.length > 60 && '...'}
                        </div>
                      )}
                      
                      {card.flavorText && (
                        <div className="text-gray-500 italic text-xs leading-tight line-clamp-1">
                          {card.flavorText.substring(0, 40)}
                          {card.flavorText.length > 40 && '...'}
                        </div>
                      )}
                      
                      {isCreature(card) && card.power && card.toughness && (
                        <div className="text-white font-bold text-sm">
                          {card.power}/{card.toughness}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Name Overlay for images */}
              {card.imageFile && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-white font-semibold text-sm text-center">
                    {card.number && <span className="text-gray-300 text-xs">{card.number} </span>}
                    {card.name}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No cards found</div>
            <div className="text-gray-500 text-sm mt-2">Add some cards to see them in the spoiler view</div>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={closeCardModal}
        archetypes={archetypes}
      />
    </>
  );
};