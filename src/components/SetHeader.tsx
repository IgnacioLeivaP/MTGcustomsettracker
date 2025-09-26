import React from 'react';
import { BookOpen, Target, Palette } from 'lucide-react';

interface SetHeaderProps {
  setInfo: {
    name: string;
    description: string;
    totalCards: number;
    hasAlternateArts: boolean;
  };
  currentCardCount: number;
}

export const SetHeader: React.FC<SetHeaderProps> = ({ setInfo, currentCardCount }) => {
  const progressPercent = ((currentCardCount / setInfo.totalCards) * 100);

  return (
    <div className="bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <BookOpen className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">{setInfo.name}</h1>
            {setInfo.hasAlternateArts && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <Palette className="w-4 h-4 text-purple-300" />
                <span className="text-xs font-medium text-purple-300">AA</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-300 text-lg mb-4 max-w-2xl">{setInfo.description}</p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">
                {currentCardCount} / {setInfo.totalCards} cards
              </span>
              <span className="text-gray-400">
                ({progressPercent.toFixed(1)}% complete)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-6">
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercent / 100)}`}
                className="text-red-400 transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};