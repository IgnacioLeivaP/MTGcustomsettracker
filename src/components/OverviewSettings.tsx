import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface OverviewSettingsProps {
  settings: {
    overviewSections: {
      totalCards: boolean;
      cardsWithImages: boolean;
      originalVsReprints: boolean;
      activeArchetypes: boolean;
      archetypeBreakdown: boolean;
    };
  };
  onUpdateSettings: (settings: any) => void;
}

export const OverviewSettings: React.FC<OverviewSettingsProps> = ({
  settings,
  onUpdateSettings
}) => {
  const toggleSection = (section: keyof typeof settings.overviewSections) => {
    onUpdateSettings({
      ...settings,
      overviewSections: {
        ...settings.overviewSections,
        [section]: !settings.overviewSections[section]
      }
    });
  };

  const sections = [
    { key: 'totalCards' as const, label: 'Total Cards Created', description: 'Shows progress towards 280 card target' },
    { key: 'cardsWithImages' as const, label: 'Cards with Images', description: 'Tracks image completion status' },
    { key: 'originalVsReprints' as const, label: 'Original vs Reprints', description: 'Breakdown of original vs reprint cards' },
    { key: 'activeArchetypes' as const, label: 'Active Archetypes', description: 'Count of archetypes in use' },
    { key: 'archetypeBreakdown' as const, label: 'Archetype Breakdown', description: 'Detailed view of cards per archetype' },
    { key: 'colorBreakdown' as const, label: 'Color Breakdown', description: 'Distribution of cards by mana colors' },
    { key: 'rarityRatio' as const, label: 'Rarity Ratio', description: 'Breakdown of cards by rarity (C/U/R/M)' },
    { key: 'cardTypeBreakdown' as const, label: 'Card Type Breakdown', description: 'Distribution by card types' },
    { key: 'costBreakdown' as const, label: 'Cost Breakdown', description: 'Mana cost distribution analysis' },
    { key: 'multicolored' as const, label: 'Multicolored Cards', description: 'Count and percentage of multicolor cards' },
    { key: 'averagePowerToughness' as const, label: 'Average Power/Toughness', description: 'Average stats of creatures in the set' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-red-400">👁️ Overview Display Settings</h2>
      
      <div className="space-y-4">
        <p className="text-gray-300 mb-4">
          Configure which sections appear in the Dashboard overview. Toggle sections on or off based on your preferences.
        </p>
        
        {sections.map((section) => (
          <div
            key={section.key}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{section.label}</h3>
              <p className="text-sm text-gray-400">{section.description}</p>
            </div>
            
            <button
              onClick={() => toggleSection(section.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                settings.overviewSections[section.key]
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                  : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
              }`}
            >
              {settings.overviewSections[section.key] ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hidden</span>
                </>
              )}
            </button>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-semibold text-blue-300 mb-2">💡 Tip</h4>
          <p className="text-sm text-blue-200">
            Hide sections you don't need to create a cleaner dashboard view. 
            Changes are saved automatically and take effect immediately.
          </p>
        </div>
      </div>
    </div>
  );
};