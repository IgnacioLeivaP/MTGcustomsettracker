import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { Upload } from 'lucide-react';

interface CardFormProps {
  archetypes: Archetype[];
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

export const CardForm: React.FC<CardFormProps> = ({ archetypes, onAddCard }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Creature',
    archetype: archetypes[0]?.id || '',
    imageStatus: 'pending' as const,
    isReprint: false,
    imageFile: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    onAddCard(formData);
    setFormData({
      name: '',
      type: 'Creature',
      archetype: archetypes[0]?.id || '',
      imageStatus: 'pending',
      isReprint: false,
      imageFile: ''
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-red-400">➕ Add New Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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