import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { Upload } from 'lucide-react';
import { normalizeManaForStorage } from '../utils/manaParser';
import { compressImage } from '../utils/imageCompression';

interface CardFormProps {
  archetypes: Archetype[];
  cards: Card[];
  onAddCard: (card: Omit<Card, 'id' | 'createdAt'>) => void;
}

const cardTypes = [
  'Creature',
  'Instant',
  'Sorcery',
  'Enchantment',
  'Enchantment - Aura',
  'Artifact',
  'Planeswalker',
  'Land'
];

export const CardForm: React.FC<CardFormProps> = ({ archetypes, cards, onAddCard }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Creature',
    manaCost: '',
    rarity: 'C' as const,
    archetype: archetypes[0]?.id || '',
    imageStatus: 'pending' as const,
    isReprint: false,
    isNickname: false,
    isAlternateArt: false,
    originalName: '',
    isDoubleFaced: false,
    otherFaceId: '',
    imageFile: '',
    power: '',
    toughness: '',
    abilityText: '',
    flavorText: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show loading state
      setFormData(prev => ({
        ...prev,
        imageStatus: 'pending' as const
      }));
      
      compressImage(file)
        .then((compressedDataUrl) => {
          setFormData(prev => ({
            ...prev,
            imageFile: compressedDataUrl,
            imageStatus: 'complete' as const
          }));
        })
        .catch((error) => {
          console.error('Error compressing image:', error);
          alert('Error processing image. Please try a different image.');
          setFormData(prev => ({
            ...prev,
            imageStatus: 'pending' as const
          }));
        });
    }
  };

  const handleImageUploadLegacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Fallback to original method if compression fails
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          imageFile: result,
          imageStatus: 'complete' as const
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a card name');
      return;
    }
    if (!formData.archetype) {
      alert('Please select an archetype');
      return;
    }

    // Normalize mana cost for storage
    const cardData = {
      ...formData,
      manaCost: normalizeManaForStorage(formData.manaCost)
    };
    
    onAddCard(cardData);
    setFormData({
      name: '',
      type: 'Creature',
      manaCost: '',
      rarity: 'C',
      archetype: archetypes[0]?.id || '',
      imageStatus: 'pending',
      isReprint: false,
      isNickname: false,
      isAlternateArt: false,
      originalName: '',
      isDoubleFaced: false,
      otherFaceId: '',
      imageFile: '',
      power: '',
      toughness: '',
      abilityText: '',
      flavorText: ''
    });
  };

  const isCreature = formData.type.toLowerCase().includes('creature');

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-red-400">➕ Add New Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Card Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter card name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mana Cost</label>
            <input
              type="text"
              value={formData.manaCost}
              onChange={(e) => setFormData(prev => ({ ...prev, manaCost: e.target.value }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. {1}{U}{R}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Card Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {cardTypes.map(type => (
                <option key={type} value={type} className="bg-gray-800">{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
            <select
              value={formData.rarity}
              onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value as 'C' | 'U' | 'R' | 'M' }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="C" className="bg-gray-800">Common (C)</option>
              <option value="U" className="bg-gray-800">Uncommon (U)</option>
              <option value="R" className="bg-gray-800">Rare (R)</option>
              <option value="M" className="bg-gray-800">Mythic (M)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Archetype</label>
            <select
              value={formData.archetype}
              onChange={(e) => setFormData(prev => ({ ...prev, archetype: e.target.value }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {archetypes.map(archetype => (
                <option key={archetype.id} value={archetype.id} className="bg-gray-800">
                  {archetype.name}
                </option>
              ))}
            </select>
          </div>

          {formData.isNickname && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Original Card Name</label>
              <input
                type="text"
                value={formData.originalName}
                onChange={(e) => setFormData(prev => ({ ...prev, originalName: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter the original Magic card name"
              />
            </div>
          )}

          {formData.isDoubleFaced && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Other Face</label>
              <select
                value={formData.otherFaceId}
                onChange={(e) => setFormData(prev => ({ ...prev, otherFaceId: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="" className="bg-gray-800">Select other face...</option>
                {cards.filter(card => card.id !== 'new').map(card => (
                  <option key={card.id} value={card.id} className="bg-gray-800">
                    {card.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isCreature && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Power</label>
                <input
                  type="text"
                  value={formData.power}
                  onChange={(e) => setFormData(prev => ({ ...prev, power: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 2, *, X"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Toughness</label>
                <input
                  type="text"
                  value={formData.toughness}
                  onChange={(e) => setFormData(prev => ({ ...prev, toughness: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 3, *, X"
                />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ability Text</label>
            <textarea
              value={formData.abilityText}
              onChange={(e) => setFormData(prev => ({ ...prev, abilityText: e.target.value }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
              placeholder="Enter the card's abilities and rules text"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Flavor Text</label>
            <textarea
              value={formData.flavorText}
              onChange={(e) => setFormData(prev => ({ ...prev, flavorText: e.target.value }))}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical italic"
              placeholder="Enter the card's flavor text (optional)"
              rows={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Card Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center p-3 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {formData.imageFile ? 'Change Image' : 'Upload Image'}
              </div>
            </div>
            {formData.imageFile && (
              <img 
                src={formData.imageFile} 
                alt="Card preview" 
                className="mt-2 w-16 h-16 object-cover rounded border"
              />
            )}
          </div>

          <div className="flex items-center">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isReprint}
                onChange={(e) => setFormData(prev => ({ ...prev, isReprint: e.target.checked }))}
                className="mr-2 w-4 h-4 text-red-500 bg-white/10 border-white/30 rounded focus:ring-red-500"
              />
              This is a reprint
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNickname}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isNickname: e.target.checked,
                  originalName: e.target.checked ? prev.originalName : ''
                }))}
                disabled={!formData.isReprint}
                className="mr-2 w-4 h-4 text-red-500 bg-white/10 border-white/30 rounded focus:ring-red-500"
              />
              This is a nickname card {!formData.isReprint && '(requires reprint)'}
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAlternateArt}
                onChange={(e) => setFormData(prev => ({ ...prev, isAlternateArt: e.target.checked }))}
                className="mr-2 w-4 h-4 text-red-500 bg-white/10 border-white/30 rounded focus:ring-red-500"
              />
              This is alternate art
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDoubleFaced}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isDoubleFaced: e.target.checked,
                  otherFaceId: e.target.checked ? prev.otherFaceId : ''
                }))}
                className="mr-2 w-4 h-4 text-red-500 bg-white/10 border-white/30 rounded focus:ring-red-500"
              />
              This is a double-faced card
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Add Card
          </button>
        </div>
      </form>
    </div>
  );
};