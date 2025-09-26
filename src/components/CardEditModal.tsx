import React, { useState } from 'react';
import { X, Upload, Trash2, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { Card, Archetype } from '../types';
import { normalizeManaForStorage } from '../utils/manaParser';
import { compressImage } from '../utils/imageCompression';

interface CardEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
  archetypes: Archetype[];
  cards: Card[];
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
  onDeleteCard: (id: string) => void;
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

export const CardEditModal: React.FC<CardEditModalProps> = ({
  isOpen,
  onClose,
  card,
  archetypes,
  cards,
  onUpdateCard,
  onDeleteCard
}) => {
  const [formData, setFormData] = useState({
    name: card?.name || '',
    number: card?.number || '',
    type: card?.type || 'Creature',
    manaCost: card?.manaCost || '',
    rarity: card?.rarity || 'C',
    archetype: card?.archetype || '',
    imageStatus: card?.imageStatus || 'pending',
    isReprint: card?.isReprint || false,
    isNickname: card?.isNickname || false,
    isAlternateArt: card?.isAlternateArt || false,
    originalName: card?.originalName || '',
    isDoubleFaced: card?.isDoubleFaced || false,
    otherFaceId: card?.otherFaceId || '',
    imageFile: card?.imageFile || '',
    power: card?.power || '',
    toughness: card?.toughness || '',
    abilityText: card?.abilityText || '',
    flavorText: card?.flavorText || '',
    artist: card?.artist || ''
  });

  React.useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        number: card.number || '',
        type: card.type,
        manaCost: card.manaCost || '',
        rarity: card.rarity,
        archetype: card.archetype,
        imageStatus: card.imageStatus,
        isReprint: card.isReprint,
        isNickname: card.isNickname,
        isAlternateArt: card.isAlternateArt,
        originalName: card.originalName || '',
        isDoubleFaced: card.isDoubleFaced,
        otherFaceId: card.otherFaceId || '',
        imageFile: card.imageFile || '',
        power: card.power || '',
        toughness: card.toughness || '',
        abilityText: card.abilityText || '',
        flavorText: card.flavorText || '',
        artist: card.artist || ''
      });
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        });
    }
  };

  const handleImageUploadLegacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const removeImage = () => {
    if (confirm('Are you sure you want to remove this card\'s image?')) {
      setFormData(prev => ({
        ...prev,
        imageFile: '',
        imageStatus: 'pending' as const
      }));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a card name');
      return;
    }
    if (!formData.archetype) {
      alert('Please select an archetype');
      return;
    }

    // Normalize mana cost for storage
    const updates = {
      ...formData,
      manaCost: normalizeManaForStorage(formData.manaCost)
    };
    
    onUpdateCard(card.id, updates);
    onClose();
  };

  const isCreature = formData.type.toLowerCase().includes('creature');

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${card.name}"? This action cannot be undone.`)) {
      onDeleteCard(card.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-400">⚙️ Edit Card</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 001, 002"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mana Cost</label>
                <input
                  type="text"
                  value={formData.manaCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, manaCost: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. {1}{U}{R} or 1UR"
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
            </div>

            {formData.isNickname && (
              <div>
                <h4 className="text-md font-semibold text-white mb-3">Nickname Information</h4>
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
              </div>
            )}

            {formData.isDoubleFaced && (
              <div>
                <h4 className="text-md font-semibold text-white mb-3">Double-Faced Card</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Other Face</label>
                  <select
                    value={formData.otherFaceId}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherFaceId: e.target.value }))}
                    className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="" className="bg-gray-800">Select other face...</option>
                    {cards.filter(c => c.id !== card?.id).map(c => (
                      <option key={c.id} value={c.id} className="bg-gray-800">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {isCreature && (
              <div>
                <h4 className="text-md font-semibold text-white mb-3">Creature Stats</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>
            )}
          </div>

          {/* Card Text */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Card Text</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ability Text</label>
                <textarea
                  value={formData.abilityText}
                  onChange={(e) => setFormData(prev => ({ ...prev, abilityText: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
                  placeholder="Enter the card's abilities and rules text"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Flavor Text</label>
                <textarea
                  value={formData.flavorText}
                  onChange={(e) => setFormData(prev => ({ ...prev, flavorText: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical italic"
                  placeholder="Enter the card's flavor text (optional)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Card Properties */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Card Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex items-center">
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
              </div>

              <div className="flex items-center">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAlternateArt}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAlternateArt: e.target.checked }))}
                    className="mr-2 w-4 h-4 text-red-500 bg-white/10 border-white/30 rounded focus:ring-red-500"
                  />
                  This is alternate art
                </label>
              </div>

              <div className="flex items-center">
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter artist name for art credit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Status</label>
                <select
                  value={formData.imageStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageStatus: e.target.value as 'pending' | 'complete' }))}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending" className="bg-gray-800">Pending</option>
                  <option value="complete" className="bg-gray-800">Complete</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Management */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Card Image</h3>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {formData.imageFile ? (
                  <div className="relative group">
                    <img 
                      src={formData.imageFile} 
                      alt="Card preview" 
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <button
                        onClick={removeImage}
                        className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-600 rounded border flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
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
                <p className="text-sm text-gray-400 mt-2">
                  Upload a new image or change the existing one. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-white/20">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Card</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};