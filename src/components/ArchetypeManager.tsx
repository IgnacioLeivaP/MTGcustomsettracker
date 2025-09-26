import React, { useState } from 'react';
import { Archetype } from '../types';
import { Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react';

interface ArchetypeManagerProps {
  archetypes: Archetype[];
  onUpdateArchetypes: (archetypes: Archetype[]) => void;
}

export const ArchetypeManager: React.FC<ArchetypeManagerProps> = ({
  archetypes,
  onUpdateArchetypes
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500/20 border-blue-500/30'
  });

  const colorOptions = [
    { value: 'bg-blue-500/20 border-blue-500/30', label: 'Blue' },
    { value: 'bg-red-500/20 border-red-500/30', label: 'Red' },
    { value: 'bg-green-500/20 border-green-500/30', label: 'Green' },
    { value: 'bg-yellow-500/20 border-yellow-500/30', label: 'Yellow' },
    { value: 'bg-purple-500/20 border-purple-500/30', label: 'Purple' },
    { value: 'bg-pink-500/20 border-pink-500/30', label: 'Pink' },
    { value: 'bg-orange-500/20 border-orange-500/30', label: 'Orange' },
    { value: 'bg-teal-500/20 border-teal-500/30', label: 'Teal' },
    { value: 'bg-gradient-to-r from-white/20 to-blue-500/20', label: 'White-Blue Gradient' },
    { value: 'bg-gradient-to-r from-blue-500/20 to-black/40', label: 'Blue-Black Gradient' },
    { value: 'bg-gradient-to-r from-black/40 to-red-500/20', label: 'Black-Red Gradient' },
    { value: 'bg-gradient-to-r from-red-500/20 to-green-500/20', label: 'Red-Green Gradient' },
    { value: 'bg-gradient-to-r from-green-500/20 to-white/20', label: 'Green-White Gradient' }
  ];

  const startAdd = () => {
    setIsAdding(true);
    setFormData({ name: '', description: '', color: 'bg-blue-500/20 border-blue-500/30' });
  };

  const startEdit = (archetype: Archetype) => {
    setEditingId(archetype.id);
    setFormData({
      name: archetype.name,
      description: archetype.description,
      color: archetype.color
    });
  };

  const saveArchetype = () => {
    if (!formData.name.trim()) {
      alert('Please enter an archetype name');
      return;
    }

    if (isAdding) {
      const newArchetype: Archetype = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        color: formData.color
      };
      onUpdateArchetypes([...archetypes, newArchetype]);
    } else if (editingId) {
      const updatedArchetypes = archetypes.map(archetype =>
        archetype.id === editingId
          ? { ...archetype, ...formData }
          : archetype
      );
      onUpdateArchetypes(updatedArchetypes);
    }

    resetForm();
  };

  const deleteArchetype = (id: string) => {
    if (confirm('Are you sure you want to delete this archetype? Cards using this archetype will need to be reassigned.')) {
      onUpdateArchetypes(archetypes.filter(a => a.id !== id));
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', color: 'bg-blue-500/20 border-blue-500/30' });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-400">🏛️ Archetype Management</h2>
        <button
          onClick={startAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Archetype</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-white">
            {isAdding ? 'Add New Archetype' : 'Edit Archetype'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Archetype name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Brief description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={saveArchetype}
              className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={resetForm}
              className="flex items-center space-x-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archetypes.map(archetype => (
          <div
            key={archetype.id}
            className={`${archetype.color} border rounded-lg p-4`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-white">{archetype.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => startEdit(archetype)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteArchetype(archetype.id)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-300 text-sm">{archetype.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};