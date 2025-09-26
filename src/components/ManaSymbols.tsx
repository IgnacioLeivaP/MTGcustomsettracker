import React from 'react';

interface ManaSymbolsProps {
  manaCost: string;
}

export const ManaSymbols: React.FC<ManaSymbolsProps> = ({ manaCost }) => {
  const parseManaSymbols = (cost: string) => {
    // Match patterns like {1}, {U}, {W}, etc.
    const symbolPattern = /\{([^}]+)\}/g;
    const symbols: string[] = [];
    let match;
    
    while ((match = symbolPattern.exec(cost)) !== null) {
      symbols.push(match[1].toLowerCase());
    }
    
    return symbols;
  };

  const renderManaSymbol = (symbol: string, index: number) => {
    const baseClasses = "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2 mr-1";
    
    // Generic mana (numbers)
    if (/^\d+$/.test(symbol)) {
      return (
        <span key={index} className={`${baseClasses} bg-gray-400 text-gray-900 border-gray-600`}>
          {symbol}
        </span>
      );
    }
    
    // Colored mana symbols
    switch (symbol) {
      case 'w':
        return (
          <span key={index} className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-400`} title="White mana">
            ☀️
          </span>
        );
      case 'u':
        return (
          <span key={index} className={`${baseClasses} bg-blue-100 text-blue-800 border-blue-400`} title="Blue mana">
            💧
          </span>
        );
      case 'b':
        return (
          <span key={index} className={`${baseClasses} bg-gray-800 text-white border-gray-600`} title="Black mana">
            💀
          </span>
        );
      case 'r':
        return (
          <span key={index} className={`${baseClasses} bg-red-100 text-red-800 border-red-400`} title="Red mana">
            🔥
          </span>
        );
      case 'g':
        return (
          <span key={index} className={`${baseClasses} bg-green-100 text-green-800 border-green-400`} title="Green mana">
            🌳
          </span>
        );
      case 'c':
        return (
          <span key={index} className={`${baseClasses} bg-gray-300 text-gray-800 border-gray-500`} title="Colorless mana">
            💎
          </span>
        );
      default:
        return (
          <span key={index} className={`${baseClasses} bg-gray-400 text-gray-900 border-gray-600`}>
            {symbol.toUpperCase()}
          </span>
        );
    }
  };

  const symbols = parseManaSymbols(manaCost);
  
  if (symbols.length === 0) {
    return <span className="text-gray-400 text-sm">—</span>;
  }

  return (
    <div className="flex items-center flex-wrap">
      {symbols.map((symbol, index) => renderManaSymbol(symbol, index))}
    </div>
  );
};