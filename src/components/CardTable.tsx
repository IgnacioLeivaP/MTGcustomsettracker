import React, { useState } from 'react';
import { Card, Archetype } from '../types';
import { CreditCard as Edit, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { ManaSymbols } from './ManaSymbols';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingArchetype, setEditingArchetype] = useState<string>('');

  const startEditing = (card: Card) => {
    setEditingId(card.id);
    setEditingArchetype(card.archetype);
  };

  const saveEdit = (cardId: string) => {
    onUpdateCard(cardId, { archetype: editingArchetype });
    setEditingId(null);
    setEditingArchetype('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingArchetype('');
  };

  const handleImageUpload = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdateCard(cardId, {
          imageFile: result,
          imageStatus: 'complete'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (cardId: string) => {
    if (confirm('Are you sure you want to remove this card\'s image?')) {
      onUpdateCard(cardId, {
        imageFile: undefined,
        imageStatus: 'pending'
      });
    }
  };

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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-red-400">📋 Card List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white/5 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-500/30">
              <th className="p-4 text-left font-bold text-white">Image</th>
              <th className="p-4 text-left font-bold text-white">Card Name</th>
              <th className="p-4 text-left font-bold text-white">Mana Cost</th>
              <th className="p-4 text-left font-bold text-white">Type</th>
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
                  <div className="relative group">
                    {card.imageFile ? (
                      <div className="relative">
                        <img 
                          src={card.imageFile} 
                          alt={card.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <div className="flex space-x-1">
                            <label className="cursor-pointer p-1 bg-blue-500 rounded hover:bg-blue-600 transition-colors">
                              <Upload className="w-3 h-3 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(card.id, e)}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => removeImage(card.id)}
                              className="p-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-600 rounded border flex items-center justify-center group-hover:bg-gray-500 transition-colors">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <label className="cursor-pointer p-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors">
                            <Upload className="w-4 h-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(card.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <strong className="text-white">{card.name}</strong>
                </td>
                <td className="p-4">
                  <ManaSymbols manaCost={card.manaCost || ''} />
                </td>
                <td className="p-4 text-gray-300">{card.type}</td>
                <td className="p-4">
                  {editingId === card.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editingArchetype}
                        onChange={(e) => setEditingArchetype(e.target.value)}
                        className="p-2 bg-white/10 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {archetypes.map(archetype => (
                          <option key={archetype.id} value={archetype.id} className="bg-gray-800">
                            {archetype.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveEdit(card.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-white">{getArchetypeName(card.archetype)}</span>
                      <button
                        onClick={() => startEditing(card)}
                        className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleReprint(card.id, card.isReprint)}
                    className={`px-3 py-1 rounded font-bold text-sm transition-colors ${
                      card.isReprint 
                        ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30' 
                        : 'bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30'
                    }`}
                  >
                    {card.isReprint ? 'Reprint' : 'Original'}
                  </button>
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
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove "${card.name}"?`)) {
                        onDeleteCard(card.id);
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};