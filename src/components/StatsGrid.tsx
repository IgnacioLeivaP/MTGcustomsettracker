import React from 'react';
import { Eye, EyeOff, Settings as SettingsIcon } from 'lucide-react';
import { Card, Archetype } from '../types';

interface StatsGridProps {
  cards: Card[];
  archetypes: Archetype[];
  settings: {
    setInfo: {
      totalCards: number;
      customCounters: {
        rarities: {
          common: number;
          uncommon: number;
          rare: number;
          mythic: number;
        };
        alternateArts: {
          target: number;
        };
        tokens: {
          target: number;
        };
        emblems: {
          target: number;
        };
      };
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
      customCounters: boolean;
      rarityDistribution: boolean;
      alternateArts: boolean;
      tokens: boolean;
      emblems: boolean;
    };
  };
  onUpdateSettings: (settings: any) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ cards, archetypes, settings, onUpdateSettings }) => {
  const [showOverviewConfig, setShowOverviewConfig] = React.useState(false);

  // Separate cards by type
  const mainSetCards = cards.filter(card => !card.isToken && !card.isEmblem).length;
  const tokenCards = cards.filter(card => card.isToken).length;
  const emblemCards = cards.filter(card => card.isEmblem).length;
  const totalCards = cards.length;
  
  // Calculate completion percentages
  const targetCards = settings.setInfo.totalCards || 1; // Prevent division by zero
  const mainSetCompletionPercent = ((mainSetCards / targetCards) * 100);
  
  const imageCompleteCards = cards.filter(card => card.imageStatus === 'complete').length;
  const reprintCards = cards.filter(card => card.isReprint).length;
  const originalCards = totalCards - reprintCards;
  
  const archetypeCounts = cards.reduce((acc, card) => {
    acc[card.archetype] = (acc[card.archetype] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activeArchetypes = Object.keys(archetypeCounts).length;
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

  // Custom counters data
  const alternateArtCards = cards.filter(card => card.isAlternateArt).length;
  const customCounters = settings.setInfo.customCounters;

  const toggleSection = (section: keyof typeof settings.overviewSections) => {
    onUpdateSettings({
      ...settings,
      overviewSections: {
        ...settings.overviewSections,
        [section]: !settings.overviewSections[section]
      }
    });
  };

  const showAllSections = () => {
    const newSettings = Object.keys(settings.overviewSections).reduce((acc, key) => {
      acc[key as keyof typeof settings.overviewSections] = true;
      return acc;
    }, {} as typeof settings.overviewSections);
    
    onUpdateSettings({
      ...settings,
      overviewSections: newSettings
    });
  };

  const hideAllSections = () => {
    const newSettings = Object.keys(settings.overviewSections).reduce((acc, key) => {
      acc[key as keyof typeof settings.overviewSections] = false;
      return acc;
    }, {} as typeof settings.overviewSections);
    
    onUpdateSettings({
      ...settings,
      overviewSections: newSettings
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
    { key: 'averagePowerToughness' as const, label: 'Average Power/Toughness', description: 'Average stats of creatures in the set' },
    { key: 'rarityDistribution' as const, label: 'Rarity Distribution', description: 'Progress toward rarity targets' },
    { key: 'individualRarities' as const, label: 'Individual Rarity Counters', description: 'Separate counter for each rarity (C/U/R/M)' },
    { key: 'alternateArts' as const, label: 'Alternate Arts Counter', description: 'Progress toward alternate art target' },
    { key: 'tokens' as const, label: 'Tokens Counter', description: 'Progress toward token target' },
    { key: 'emblems' as const, label: 'Emblems Counter', description: 'Progress toward emblem target' },
    { key: 'colorBreakdownGraphical' as const, label: 'Color Breakdown (Graphical)', description: 'Visual chart of color distribution' },
    { key: 'cardTypeBreakdownGraphical' as const, label: 'Card Type Breakdown (Graphical)', description: 'Visual chart of card types' },
    { key: 'costBreakdownGraphical' as const, label: 'Cost Breakdown (Graphical)', description: 'Visual chart of mana cost distribution' }
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
          
          <div className="flex space-x-3 mb-4">
            <button
              onClick={showAllSections}
              className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
            >
              Show All Sections
            </button>
            <button
              onClick={hideAllSections}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
              Hide All Sections
            </button>
          </div>
          
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
            <div className="text-3xl font-bold text-white mb-2">{mainSetCards}</div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-teal-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, mainSetCompletionPercent)}%` }}
              />
            </div>
            <small className="text-gray-300">
              Target: {settings.setInfo.totalCards || 'Not set'} cards ({mainSetCompletionPercent.toFixed(1)}%)
              {(tokenCards > 0 || emblemCards > 0) && (
                <div className="text-xs text-gray-400 mt-1">
                  + {tokenCards} tokens, {emblemCards} emblems
                </div>
              )}
            </small>
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

        {/* Custom Counters */}
        {customCounters && (
          <>
            {/* Rarity Distribution */}
            {settings.overviewSections.rarityDistribution && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-red-400 text-center">Rarity Distribution</h3>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Common:</span>
                    <span className="text-white font-bold">{rarityCounts.C || 0}/{customCounters.rarities.common}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Uncommon:</span>
                    <span className="text-white font-bold">{rarityCounts.U || 0}/{customCounters.rarities.uncommon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-300">Rare:</span>
                    <span className="text-white font-bold">{rarityCounts.R || 0}/{customCounters.rarities.rare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-400">Mythic:</span>
                    <span className="text-white font-bold">{rarityCounts.M || 0}/{customCounters.rarities.mythic}</span>
                  </div>
                </div>
                {renderProgressBar([
                  { 
                    value: Math.min(rarityCounts.C || 0, customCounters.rarities.common), 
                    color: 'bg-gray-600', 
                    label: 'Common' 
                  },
                  { 
                    value: Math.min(rarityCounts.U || 0, customCounters.rarities.uncommon), 
                    color: 'bg-blue-500', 
                    label: 'Uncommon' 
                  },
                  { 
                    value: Math.min(rarityCounts.R || 0, customCounters.rarities.rare), 
                    color: 'bg-yellow-500', 
                    label: 'Rare' 
                  },
                  { 
                    value: Math.min(rarityCounts.M || 0, customCounters.rarities.mythic), 
                    color: 'bg-orange-600', 
                    label: 'Mythic' 
                  }
                ])}
              </div>
            )}

            {/* Individual Rarity Counters */}
            {settings.overviewSections.individualRarities && customCounters && (
              <>
                {/* Common Counter */}
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Common Cards</h3>
                  <div className="text-3xl font-bold text-white mb-2">{rarityCounts.C || 0}</div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-gray-500 to-gray-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((rarityCounts.C || 0) / Math.max(1, customCounters.rarities.common)) * 100)}%` }}
                    />
                  </div>
                  <small className="text-gray-300">
                    Target: {customCounters.rarities.common} ({(((rarityCounts.C || 0) / Math.max(1, customCounters.rarities.common)) * 100).toFixed(1)}%)
                  </small>
                </div>

                {/* Uncommon Counter */}
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Uncommon Cards</h3>
                  <div className="text-3xl font-bold text-white mb-2">{rarityCounts.U || 0}</div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((rarityCounts.U || 0) / Math.max(1, customCounters.rarities.uncommon)) * 100)}%` }}
                    />
                  </div>
                  <small className="text-gray-300">
                    Target: {customCounters.rarities.uncommon} ({(((rarityCounts.U || 0) / Math.max(1, customCounters.rarities.uncommon)) * 100).toFixed(1)}%)
                  </small>
                </div>

                {/* Rare Counter */}
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Rare Cards</h3>
                  <div className="text-3xl font-bold text-white mb-2">{rarityCounts.R || 0}</div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((rarityCounts.R || 0) / Math.max(1, customCounters.rarities.rare)) * 100)}%` }}
                    />
                  </div>
                  <small className="text-gray-300">
                    Target: {customCounters.rarities.rare} ({(((rarityCounts.R || 0) / Math.max(1, customCounters.rarities.rare)) * 100).toFixed(1)}%)
                  </small>
                </div>

                {/* Mythic Counter */}
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Mythic Cards</h3>
                  <div className="text-3xl font-bold text-white mb-2">{rarityCounts.M || 0}</div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((rarityCounts.M || 0) / Math.max(1, customCounters.rarities.mythic)) * 100)}%` }}
                    />
                  </div>
                  <small className="text-gray-300">
                    Target: {customCounters.rarities.mythic} ({(((rarityCounts.M || 0) / Math.max(1, customCounters.rarities.mythic)) * 100).toFixed(1)}%)
                  </small>
                </div>
              </>
            )}

            {/* Alternate Arts */}
            {settings.overviewSections.alternateArts && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Alternate Arts</h3>
                <div className="text-3xl font-bold text-white mb-2">{alternateArtCards}</div>
                <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (alternateArtCards / Math.max(1, customCounters.alternateArts.target)) * 100)}%` }}
                  />
                </div>
                <small className="text-gray-300">
                  Target: {customCounters.alternateArts.target} ({((alternateArtCards / Math.max(1, customCounters.alternateArts.target)) * 100).toFixed(1)}%)
                </small>
              </div>
            )}

            {/* Tokens */}
            {settings.overviewSections.tokens && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Tokens</h3>
                <div className="text-3xl font-bold text-white mb-2">{tokenCards}</div>
                <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (tokenCards / Math.max(1, customCounters.tokens.target)) * 100)}%` }}
                  />
                </div>
                <small className="text-gray-300">
                  Target: {customCounters.tokens.target} ({((tokenCards / Math.max(1, customCounters.tokens.target)) * 100).toFixed(1)}%)
                </small>
              </div>
            )}

            {/* Emblems */}
            {settings.overviewSections.emblems && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Emblems</h3>
                <div className="text-3xl font-bold text-white mb-2">{emblemCards}</div>
                <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (emblemCards / Math.max(1, customCounters.emblems.target)) * 100)}%` }}
                  />
                </div>
                <small className="text-gray-300">
                  Target: {customCounters.emblems.target} ({((emblemCards / Math.max(1, customCounters.emblems.target)) * 100).toFixed(1)}%)
                </small>
              </div>
            )}
          </>
        )}

        {/* Graphical Breakdowns */}
        {settings.overviewSections.colorBreakdownGraphical && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-red-400 text-center">🎨 Color Distribution</h3>
            <div className="space-y-3">
              {Object.entries(colorCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([color, count]) => {
                  const percentage = totalCards > 0 ? (count / totalCards) * 100 : 0;
                  const colorClasses = {
                    'White': 'bg-gradient-to-r from-yellow-200 to-yellow-400',
                    'Blue': 'bg-gradient-to-r from-blue-400 to-blue-600',
                    'Black': 'bg-gradient-to-r from-gray-600 to-gray-800',
                    'Red': 'bg-gradient-to-r from-red-400 to-red-600',
                    'Green': 'bg-gradient-to-r from-green-400 to-green-600',
                    'Colorless': 'bg-gradient-to-r from-gray-400 to-gray-500'
                  };
                  
                  return (
                    <div key={color} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className={`font-medium ${
                          color === 'White' ? 'text-yellow-200' :
                          color === 'Blue' ? 'text-blue-300' :
                          color === 'Black' ? 'text-gray-300' :
                          color === 'Red' ? 'text-red-300' :
                          color === 'Green' ? 'text-green-300' :
                          'text-gray-400'
                        }`}>
                          {color}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{count}</span>
                          <span className="text-gray-400">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            colorClasses[color as keyof typeof colorClasses] || 'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {settings.overviewSections.cardTypeBreakdownGraphical && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-red-400 text-center">🃏 Card Type Distribution</h3>
            <div className="space-y-3">
              {Object.entries(typeCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([type, count], index) => {
                  const percentage = totalCards > 0 ? (count / totalCards) * 100 : 0;
                  const gradientColors = [
                    'bg-gradient-to-r from-purple-400 to-purple-600',
                    'bg-gradient-to-r from-blue-400 to-blue-600',
                    'bg-gradient-to-r from-green-400 to-green-600',
                    'bg-gradient-to-r from-yellow-400 to-yellow-600',
                    'bg-gradient-to-r from-red-400 to-red-600',
                    'bg-gradient-to-r from-pink-400 to-pink-600',
                    'bg-gradient-to-r from-indigo-400 to-indigo-600',
                    'bg-gradient-to-r from-teal-400 to-teal-600'
                  ];
                  
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-white">{type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{count}</span>
                          <span className="text-gray-400">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            gradientColors[index % gradientColors.length]
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {settings.overviewSections.costBreakdownGraphical && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-red-400 text-center">💎 Mana Cost Distribution</h3>
            <div className="space-y-3">
              {Array.from({length: 10}, (_, i) => {
                const cost = i;
                const count = costCounts[cost] || 0;
                const percentage = totalCards > 0 ? (count / totalCards) * 100 : 0;
                
                if (count === 0 && cost > 7) return null;
                
                const costColors = [
                  'bg-gradient-to-r from-gray-300 to-gray-400',      // 0
                  'bg-gradient-to-r from-blue-300 to-blue-500',      // 1
                  'bg-gradient-to-r from-green-300 to-green-500',    // 2
                  'bg-gradient-to-r from-yellow-300 to-yellow-500',  // 3
                  'bg-gradient-to-r from-orange-300 to-orange-500',  // 4
                  'bg-gradient-to-r from-red-300 to-red-500',        // 5
                  'bg-gradient-to-r from-purple-300 to-purple-500',  // 6
                  'bg-gradient-to-r from-pink-300 to-pink-500',      // 7
                  'bg-gradient-to-r from-indigo-400 to-purple-600',  // 8
                  'bg-gradient-to-r from-red-500 to-red-700'         // 9+
                ];
                
                return (
                  <div key={cost} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-white">
                        {cost === 0 ? '0 mana' : cost >= 9 ? '9+ mana' : `${cost} mana`}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">{count}</span>
                        <span className="text-gray-400">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          costColors[Math.min(cost, costColors.length - 1)]
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              }).filter(Boolean)}
              
              {/* High cost summary */}
              {Object.entries(costCounts).some(([cost]) => Number(cost) >= 8) && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">High Cost Cards (8+)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {Object.entries(costCounts)
                      .filter(([cost]) => Number(cost) >= 8)
                      .map(([cost, count]) => (
                        <div key={cost} className="flex justify-between">
                          <span className="text-gray-400">{cost}:</span>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
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