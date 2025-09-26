import React, { useState } from 'react';
import { BookOpen, FileText, Hash, Palette } from 'lucide-react';

interface SetInfoSettingsProps {
  settings: {
    setInfo: {
      name: string;
      description: string;
      totalCards: number;
      hasAlternateArts: boolean;
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
    hasAlternateArts: settings.setInfo.hasAlternateArts
  });

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      setInfo: formData
    });
  };

  const handleChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-save on change
    onUpdateSettings({
      ...settings,
      setInfo: newFormData
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-red-400" />
        <h2 className="text-2xl font-bold text-red-400">📝 Set Information</h2>
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
              onChange={(e) => handleChange('totalCards', parseInt(e.target.value) || 280)}
              className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="280"
            />
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
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-semibold text-blue-300 mb-2">💡 Information</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Set name and description will appear in the dashboard header</li>
            <li>• Total cards target affects the progress calculation in overview statistics</li>
            <li>• Alternate arts setting helps track if your set includes special art variants</li>
            <li>• All changes are saved automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};