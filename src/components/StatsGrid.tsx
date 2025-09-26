import React from 'react';
import { Eye, EyeOff, Settings as SettingsIcon } from 'lucide-react';
import { Card, Archetype } from '../types';

interface StatsGridProps {
  cards: Card[];
  archetypes: Archetype[];
  settings: {
    setInfo: {
      totalCards: number;
    };
    overviewSections: {
      totalCards: boolean;
      cardsWithImages: boolean;
      originalVsReprints: boolean;
      activeArchetypes: boolean;
      archetypeBreakdown: boolean;
      colorBreakdown: boolean;
      rarityRatio: boolean;
      cardTypeBreakdown: boolean;
      costBreakdown: boolean;
      multicolored: boolean;
      averagePowerToughness: boolean;
    };
  };
  onUpdateSettings: (settings: any) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ cards, archetypes, settings, onUpdateSettings }) => {
  const [showOverviewConfig, setShowOverviewConfig] = React.useState(false);

  const totalCards = cards.length;
  const imageCompleteCards = cards.filter(card => card.imageStatus === 'complete').length;
  const reprintCards = cards.filter(card => card.isReprint).length;
  const originalCards = totalCards - reprintCards;
  
  const archetypeCounts = cards.reduce((acc, card) => {
    acc[card.archetype] = (acc[card.archetype] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activeArchetypes = Object.keys(archetypeCounts).length;
  const completionPercent = ((totalCards / settings.setInfo.totalCards) * 100);
  const imagePercent = totalCards > 0 ? ((imageCompleteCards / totalCards) * 100) : 0;

  // Color analysis
  const getCardColors = (manaCost: string) => {
    const colors = new Set<string>();
    if (manaCost.includes('W')) colors.add('W');
    if (manaCost.includes('U')) colors.add('U');
    if (manaCost.includes('B')) colors.add('B');
    if (manaCost.includes('R')) colors.add('R');
    if (manaCost.includes('G')) colors.add('G');
    return colors;
  };

  const colorCounts = cards.reduce((acc, card) => {
    const colors = getCardColors(card.manaCost || '');
    if (colors.size === 0) {
      acc['Colorless'] = (acc['Colorless'] || 0) + 1;
    } else {
      colors.forEach(color => {
        const colorName = {
          'W': 'White',
          'U': 'Blue', 
          'B': 'Black',
          'R': 'Red',
          'G': 'Green'
        }[color] || color;
        acc[colorName] = (acc[colorName] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // Rarity analysis
  const rarityCounts = cards.reduce((acc, card) => {
    const rarity = card.rarity || 'Unknown';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Card type analysis
  const typeCounts = cards.reduce((acc, card) => {
    const baseType = card.type.split(' - ')[0].split(' ')[0]; // Get first word before subtype
    acc[baseType] = (acc[baseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mana cost analysis
  const getConvertedManaCost = (manaCost: string) => {
    if (!manaCost) return 0;
    let total = 0;
    const symbols = manaCost.match(/\{([^}]+)\}/g) || [];
    symbols.forEach(symbol => {
      const content = symbol.slice(1, -1);
      if (/^\d+$/.test(content)) {
        total += parseInt(content);
      } else {
        total += 1; // Each colored symbol counts as 1
      }
    });
    return total;
  };

  const costCounts = cards.reduce((acc, card) => {
    const cmc = getConvertedManaCost(card.manaCost || '');
    acc[cmc] = (acc[cmc] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Multicolored analysis
  const multicoloredCards = cards.filter(card => {
    const colors = getCardColors(card.manaCost || '');
    return colors.size > 1;
  }).length;

  // Average power/toughness
  const creatures = cards.filter(card => 
    card.type.toLowerCase().includes('creature') && 
    card.power && 
    card.toughness &&
    !isNaN(Number(card.power)) &&
    !isNaN(Number(card.toughness))
  );
  
  const avgPower = creatures.length > 0 
    ? creatures.reduce((sum, card) => sum + Number(card.power), 0) / creatures.length 
    : 0;
  
  const avgToughness = creatures.length > 0 
    ? creatures.reduce((sum, card) => sum + Number(card.toughness), 0) / creatures.length 
    : 0;

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
    { key: 'totalCards' as const, label: 'Total Cards Created', description: 'Shows progress towards card target' },
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

  const renderProgressBar = (segments: Array<{value: number, color: string, label: string}>) => {
    const total = segments.reduce((sum, seg) => sum + seg.value, 0);
    if (total === 0) return <div className="w-full bg-white/10 rounded-full h-3" />;
    
    return (
      <div className="w-full bg-white/10 rounded-full h-3 flex overflow-hidden">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${segment.color} transition-all duration-300`}
            style={{ width: `${(segment.value / total) * 100}%` }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-400">📊 Set Overview</h2>
        <button
          onClick={() => setShowOverviewConfig(!showOverviewConfig)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Display Settings</span>
        </button>
      </div>

      {/* Overview Configuration Panel */}
      {showOverviewConfig && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Overview Display Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => (
              <div
                key={section.key}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{section.label}</h4>
                  <p className="text-xs text-gray-400">{section.description}</p>
                </div>
                
                <button
                  onClick={() => toggleSection(section.key)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                    settings.overviewSections[section.key]
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                  }`}
                >
                  {settings.overviewSections[section.key] ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <strong>Tip:</strong> Hide sections you don't need to create a cleaner dashboard view. 
              Changes are saved automatically and take effect immediately.
            </p>
          </div>
        </div>
      )}
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {settings.overviewSections.totalCards && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Total Cards Created</h3>
            <div className="text-3xl font-bold text-white mb-2">{totalCards}</div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-teal-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, completionPercent)}%` }}
              />
            </div>
            <small className="text-gray-300">Target: {settings.setInfo.totalCards} cards ({completionPercent.toFixed(1)}%)</small>
          </div>
        )}

        {settings.overviewSections.cardsWithImages && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Cards with Images</h3>
            <div className="text-3xl font-bold text-white mb-2">{imageCompleteCards}</div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${imagePercent}%` }}
              />
            </div>
            <small className="text-gray-300">of {totalCards} created cards ({imagePercent.toFixed(0)}%)</small>
          </div>
        )}

        {settings.overviewSections.originalVsReprints && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Original vs Reprints</h3>
            <div className="flex justify-between text-white mb-2">
              <div>
                <div className="text-xl font-bold">{originalCards}</div>
                <div className="text-xs text-green-300">Original</div>
              </div>
              <div>
                <div className="text-xl font-bold">{reprintCards}</div>
                <div className="text-xs text-yellow-300">Reprints</div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 transition-all duration-300"
                  style={{ width: `${totalCards > 0 ? (originalCards / totalCards) * 100 : 0}%` }}
                />
                <div 
                  className="bg-yellow-500 transition-all duration-300"
                  style={{ width: `${totalCards > 0 ? (reprintCards / totalCards) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {settings.overviewSections.activeArchetypes && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Active Archetypes</h3>
            <div className="text-3xl font-bold text-white">{activeArchetypes}</div>
            <small className="text-gray-300">of {archetypes.length} defined</small>
          </div>
        )}

        {settings.overviewSections.colorBreakdown && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-red-400 text-center">Color Breakdown</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(colorCounts).map(([color, count]) => (
                <div key={color} className="flex justify-between items-center">
                  <span className={`font-medium ${
                    color === 'White' ? 'text-yellow-200' :
                    color === 'Blue' ? 'text-blue-300' :
                    color === 'Black' ? 'text-gray-300' :
                    color === 'Red' ? 'text-red-300' :
                    color === 'Green' ? 'text-green-300' :
                    'text-gray-400'
                  }`}>{color}</span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {settings.overviewSections.rarityRatio && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Rarity Ratio</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="text-gray-400">C: {rarityCounts.C || 0}</div>
              <div className="text-gray-300">U: {rarityCounts.U || 0}</div>
              <div className="text-yellow-300">R: {rarityCounts.R || 0}</div>
              <div className="text-orange-400">M: {rarityCounts.M || 0}</div>
            </div>
            {renderProgressBar([
              { value: rarityCounts.C || 0, color: 'bg-gray-600', label: 'Common' },
              { value: rarityCounts.U || 0, color: 'bg-gray-400', label: 'Uncommon' },
              { value: rarityCounts.R || 0, color: 'bg-yellow-500', label: 'Rare' },
              { value: rarityCounts.M || 0, color: 'bg-orange-600', label: 'Mythic' }
            ])}
          </div>
        )}

        {settings.overviewSections.cardTypeBreakdown && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-red-400 text-center">Card Type Breakdown</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(typeCounts).slice(0, 6).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-300">{type}</span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {settings.overviewSections.costBreakdown && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-red-400 text-center">Cost Breakdown</h3>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {Array.from({length: 8}, (_, i) => (
                <div key={i} className="text-center">
                  <div className="text-gray-400">{i}</div>
                  <div className="text-white font-bold">{costCounts[i] || 0}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
              {Object.keys(costCounts).filter(cost => Number(cost) >= 8).length > 0 && 
                `8+: ${Object.entries(costCounts).filter(([cost]) => Number(cost) >= 8).reduce((sum, [, count]) => sum + count, 0)}`
              }
            </div>
          </div>
        )}

        {settings.overviewSections.multicolored && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Multicolored Cards</h3>
            <div className="text-3xl font-bold text-white mb-2">{multicoloredCards}</div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${totalCards > 0 ? (multicoloredCards / totalCards) * 100 : 0}%` }}
              />
            </div>
            <small className="text-gray-300">of {totalCards} cards ({totalCards > 0 ? ((multicoloredCards / totalCards) * 100).toFixed(1) : 0}%)</small>
          </div>
        )}

        {settings.overviewSections.averagePowerToughness && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-400">Avg Power/Toughness</h3>
            <div className="flex justify-center items-center space-x-2 text-white">
              <div>
                <div className="text-2xl font-bold">{avgPower.toFixed(1)}</div>
                <div className="text-xs text-gray-300">Power</div>
              </div>
              <div className="text-gray-400">/</div>
              <div>
                <div className="text-2xl font-bold">{avgToughness.toFixed(1)}</div>
                <div className="text-xs text-gray-300">Toughness</div>
              </div>
            </div>
            <small className="text-gray-300">from {creatures.length} creatures</small>
          </div>
        )}
      </div>

      {/* Archetype Breakdown */}
      {settings.overviewSections.archetypeBreakdown && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-red-400">🏛️ Archetypes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(archetypeCounts).map(([archetypeId, count]) => {
              const archetype = archetypes.find(a => a.id === archetypeId);
              if (!archetype) return null;
              
              return (
                <div 
                  key={archetypeId}
                  className={`${archetype.color} border rounded-lg p-4 text-center`}
                >
                  <h4 className="font-semibold mb-1 text-white">{archetype.name}</h4>
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <small className="text-gray-300">cards</small>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};