import React, { useState } from 'react';
import { List, FileText, Hash, Palette, Upload, Image as ImageIcon, Trash2, Target, ToggleLeft, ToggleRight } from 'lucide-react';

interface SetInfoSettingsProps {
  settings: {
    setInfo: {
      name: string;
      description: string;
      totalCards: number;
      hasAlternateArts: boolean;
      setIcon?: string;
      customCounters: {
        rarities: {
          enabled: boolean;
          common: number;
          uncommon: number;
          rare: number;
          mythic: number;
        };
        alternateArts: {
          enabled: boolean;
          target: number;
        };
        tokens: {
          enabled: boolean;
          target: number;
        };
        emblems: {
          enabled: boolean;
          target: number;
        };
      };
    };
  };
  onUpdateSettings: (settings: any) => void;
}

export const SetInfoSettings: React.FC<SetInfoSettingsProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [formData, setFormData] = useState({
    name: settings.setInfo.name,
    description: settings.setInfo.description,
    totalCards: settings.setInfo.totalCards,
    hasAlternateArts: settings.setInfo.hasAlternateArts,
    setIcon: settings.setInfo.setIcon || '',
    customCounters: settings.setInfo.customCounters || {
      rarities: {
        enabled: false,
        common: 101,
        uncommon: 80,
        rare: 53,
        mythic: 15
      },
      alternateArts: {
        enabled: false,
        target: 20
      },
      tokens: {
        enabled: false,
        target: 15
      },
      emblems: {
        enabled: false,
        target: 5
      }
    }
  });

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      setInfo: formData
    });
  };

  const handleChange = (field: string, value: any) => {
    // Special handling for totalCards to prevent crashes
    if (field === 'totalCards') {
      // Allow empty string but don't save it
      if (value === '' || value === null || value === undefined) {
        setFormData({ ...formData, [field]: '' });
        return; // Don't auto-save empty values
      }
      
      // Convert to number and validate
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1) {
        setFormData({ ...formData, [field]: '' });
        return; // Don't save invalid values
      }
      
      value = numValue;
    }
    
    // Handle nested customCounters updates
    if (field.startsWith('customCounters.')) {
      const [, category, property] = field.split('.');
      const newCustomCounters = {
        ...formData.customCounters,
        [category]: {
          ...formData.customCounters[category as keyof typeof formData.customCounters],
          [property]: value
        }
      };
      
      const newFormData = { ...formData, customCounters: newCustomCounters };
      setFormData(newFormData);
      
      // Auto-save on change
      onUpdateSettings({
        ...settings,
        setInfo: newFormData
      });
      return;
    }
    
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-save on change
    onUpdateSettings({
      ...settings,
      setInfo: newFormData
    });
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match(/^image\/(svg\+xml|png)$/)) {
        alert('Please upload only SVG or PNG files');
        return;
      }
      
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('File size must be less than 1MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('setIcon', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    if (confirm('Are you sure you want to remove the set icon?')) {
      handleChange('setIcon', '');
    }
  };
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <List className="w-6 h-6 text-red-400" />
        <h2 className="text-2xl font-bold text-red-400">Set Information</h2>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-300 mb-4">
          Configure the basic information about your custom Magic set. This information will be displayed in the dashboard header.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              <span>Set Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your set name"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Hash className="w-4 h-4" />
              <span>Total Cards Target</span>
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.totalCards}
              onChange={(e) => handleChange('totalCards', e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="280"
            />
            {(formData.totalCards === '' || formData.totalCards < 1) && (
              <p className="text-red-400 text-sm mt-1">
                ⚠️ Please enter a valid number of cards (minimum 1)
              </p>
            )}
          </div>
        </div>

        {/* Set Icon Upload */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
            <ImageIcon className="w-4 h-4" />
            <span>Set Icon</span>
          </label>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {formData.setIcon ? (
                <div className="relative group">
                  <img 
                    src={formData.setIcon} 
                    alt="Set icon preview" 
                    className="w-16 h-16 object-contain rounded border border-white/20 bg-white/5"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <button
                      onClick={removeIcon}
                      className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-600/30 rounded border border-white/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  accept=".svg,.png,image/svg+xml,image/png"
                  onChange={handleIconUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center p-3 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.setIcon ? 'Change Icon' : 'Upload Icon'}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Upload an SVG or PNG file (max 1MB). This icon will appear next to your set name.
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
            <FileText className="w-4 h-4" />
            <span>Set Description</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
            placeholder="Enter a description for your custom set"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <Palette className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-semibold text-white">Alternate Arts</h3>
              <p className="text-sm text-gray-400">Does this set include alternate art versions of cards?</p>
            </div>
          </div>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasAlternateArts}
              onChange={(e) => handleChange('hasAlternateArts', e.target.checked)}
              className="mr-2 w-4 h-4 text-red-500 bg-white/10 border-white/30 rounded focus:ring-red-500"
            />
            <span className={`text-sm font-medium ${formData.hasAlternateArts ? 'text-green-300' : 'text-gray-400'}`}>
              {formData.hasAlternateArts ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
        
        {/* Custom Counters Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Custom Counters</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Set targets for different card categories. Use Dashboard → Display Settings to show/hide these counters.
          </p>
          
          {/* Rarity Counters */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
            <div className="mb-4">
              <h4 className="font-semibold text-white">Rarity Distribution</h4>
              <p className="text-sm text-gray-400">Set target quantities for each rarity level</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Common</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.rarities.common}
                  onChange={(e) => handleChange('customCounters.rarities.common', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Uncommon</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.rarities.uncommon}
                  onChange={(e) => handleChange('customCounters.rarities.uncommon', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rare</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.rarities.rare}
                  onChange={(e) => handleChange('customCounters.rarities.rare', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mythic</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.rarities.mythic}
                  onChange={(e) => handleChange('customCounters.rarities.mythic', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
          
          {/* Other Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Alternate Arts */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="mb-3">
                <h4 className="font-semibold text-white text-sm">Alternate Arts</h4>
                <p className="text-xs text-gray-400">Target for special art variants</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.alternateArts.target}
                  onChange={(e) => handleChange('customCounters.alternateArts.target', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            {/* Tokens */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="mb-3">
                <h4 className="font-semibold text-white text-sm">Tokens</h4>
                <p className="text-xs text-gray-400">Target for token creatures</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.tokens.target}
                  onChange={(e) => handleChange('customCounters.tokens.target', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            {/* Emblems */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="mb-3">
                <h4 className="font-semibold text-white text-sm">Emblems</h4>
                <p className="text-xs text-gray-400">Target for planeswalker emblems</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target</label>
                <input
                  type="number"
                  min="0"
                  value={formData.customCounters.emblems.target}
                  onChange={(e) => handleChange('customCounters.emblems.target', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-semibold text-blue-300 mb-2">💡 Information</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Set name and description will appear in the dashboard header</li>
            <li>• Set icon will replace the default book icon next to your set name</li>
            <li>• Total cards target affects the progress calculation in overview statistics</li>
            <li>• Custom counters help track specific goals and appear in the Dashboard when enabled</li>
            <li>• Alternate arts setting helps track if your set includes special art variants</li>
            <li>• All changes are saved automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};