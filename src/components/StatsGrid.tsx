import React from 'react';
import { Card, Archetype } from '../types';

interface StatsGridProps {
  cards: Card[];
  archetypes: Archetype[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ cards, archetypes }) => {
  const totalCards = cards.length;
  const imageCompleteCards = cards.filter(card => card.imageStatus === 'complete').length;
  const reprintCards = cards.filter(card => card.isReprint).length;
  const originalCards = totalCards - reprintCards;
  
  const archetypeCounts = cards.reduce((acc, card) => {
    acc[card.archetype] = (acc[card.archetype] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activeArchetypes = Object.keys(archetypeCounts).length;
  const completionPercent = ((totalCards / 280) * 100);
  const imagePercent = totalCards > 0 ? ((imageCompleteCards / totalCards) * 100) : 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-red-400">📊 Set Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Total Cards Created</h3>
          <div className="text-3xl font-bold text-white mb-2">{totalCards}</div>
          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-teal-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, completionPercent)}%` }}
            />
          </div>
          <small className="text-gray-300">Target: 280 cards ({completionPercent.toFixed(1)}%)</small>
        </div>

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

        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Active Archetypes</h3>
          <div className="text-3xl font-bold text-white">{activeArchetypes}</div>
          <small className="text-gray-300">of {archetypes.length} defined</small>
        </div>
      </div>

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
  );
};