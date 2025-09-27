import React from 'react';
import { ShieldQuestion, Info, Tag, Landmark, Star, Hash, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../types';

interface HelpSectionProps {
  cards: Card[];
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
  settings: {
    setInfo: {
      totalCards: number;
    };
  };
}

export const HelpSection: React.FC<HelpSectionProps> = ({ cards, onUpdateCard, settings }) => {
  const [isNumbering, setIsNumbering] = React.useState(false);
  const [numberingComplete, setNumberingComplete] = React.useState(false);

  // Check if auto-numbering is available
  const mainSetCards = cards.filter(card => !card.isToken && !card.isEmblem);
  const canAutoNumber = mainSetCards.length === settings.setInfo.totalCards;

  const getColorOrder = (card: Card): number => {
    const manaCost = card.manaCost || '';
    const cardType = card.type.toLowerCase();
    const colors = new Set<string>();
    
    // Extract colors from mana cost
    if (manaCost.includes('W') || manaCost.includes('w')) colors.add('W');
    if (manaCost.includes('U') || manaCost.includes('u')) colors.add('U');
    if (manaCost.includes('B') || manaCost.includes('b')) colors.add('B');
    if (manaCost.includes('R') || manaCost.includes('r')) colors.add('R');
    if (manaCost.includes('G') || manaCost.includes('g')) colors.add('G');
    
    // Determine color category
    if (cardType.includes('land')) return 7; // Land
    if (cardType.includes('artifact') && colors.size === 0) return 6; // Artifact
    if (colors.size === 0) return 6; // Colorless (treated as artifact)
    if (colors.size > 1) return 5; // Multicolor
    
    // Single colors
    if (colors.has('W')) return 0; // White
    if (colors.has('U')) return 1; // Blue
    if (colors.has('B')) return 2; // Black
    if (colors.has('R')) return 3; // Red
    if (colors.has('G')) return 4; // Green
    
    return 8; // Fallback
  };

  const autoNumberCards = async () => {
    if (!canAutoNumber) return;
    
    setIsNumbering(true);
    setNumberingComplete(false);
    
    try {
      // Separate main set cards from tokens/emblems
      const mainCards = cards.filter(card => !card.isToken && !card.isEmblem);
      const tokenCards = cards.filter(card => card.isToken);
      const emblemCards = cards.filter(card => card.isEmblem);
      
      // Sort main set cards by color order, then alphabetically
      const sortedMainCards = [...mainCards].sort((a, b) => {
        const colorOrderA = getColorOrder(a);
        const colorOrderB = getColorOrder(b);
        
        if (colorOrderA !== colorOrderB) {
          return colorOrderA - colorOrderB;
        }
        
        // Same color group, sort alphabetically
        return a.name.localeCompare(b.name);
      });
      
      // Sort tokens and emblems alphabetically
      const sortedTokens = [...tokenCards].sort((a, b) => a.name.localeCompare(b.name));
      const sortedEmblems = [...emblemCards].sort((a, b) => a.name.localeCompare(b.name));
      
      // Number main set cards (1 to totalCards)
      for (let i = 0; i < sortedMainCards.length; i++) {
        const card = sortedMainCards[i];
        const cardNumber = (i + 1).toString().padStart(3, '0');
        onUpdateCard(card.id, { number: cardNumber });
        
        // Add small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Number tokens (starting after main set)
      for (let i = 0; i < sortedTokens.length; i++) {
        const card = sortedTokens[i];
        const cardNumber = `T${(i + 1).toString().padStart(2, '0')}`;
        onUpdateCard(card.id, { number: cardNumber });
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Number emblems (starting after tokens)
      for (let i = 0; i < sortedEmblems.length; i++) {
        const card = sortedEmblems[i];
        const cardNumber = `E${(i + 1).toString().padStart(2, '0')}`;
        onUpdateCard(card.id, { number: cardNumber });
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      setNumberingComplete(true);
      setTimeout(() => setNumberingComplete(false), 3000);
      
    } catch (error) {
      console.error('Error during auto-numbering:', error);
      alert('An error occurred during auto-numbering. Please try again.');
    } finally {
      setIsNumbering(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Auto-Numbering Tool */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Hash className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold text-green-400">Auto-Numbering Tool</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Automatic Card Numbering</h3>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                This tool automatically assigns collector numbers to all cards in your set following official Magic: The Gathering conventions.
              </p>
              
              {/* Status Check */}
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 bg-white/5">
                <div className="flex items-center space-x-2">
                  {canAutoNumber ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium">Ready to number</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-300 font-medium">Not ready</span>
                    </>
                  )}
                </div>
                <div className="text-gray-300">
                  {mainSetCards.length} / {settings.setInfo.totalCards} main set cards created
                </div>
              </div>
              
              {/* Numbering Rules */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-3">📋 Numbering Rules</h4>
                <div className="space-y-2 text-sm text-blue-200">
                  <div><strong>Color Order:</strong> White → Blue → Black → Red → Green → Multicolor → Artifact → Land</div>
                  <div><strong>Within Colors:</strong> Alphabetical by card name</div>
                  <div><strong>Main Set:</strong> Numbers 001-{settings.setInfo.totalCards.toString().padStart(3, '0')}</div>
                  <div><strong>Tokens:</strong> T01, T02, T03... (after main set)</div>
                  <div><strong>Emblems:</strong> E01, E02, E03... (after tokens)</div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={autoNumberCards}
                  disabled={!canAutoNumber || isNumbering}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    canAutoNumber && !isNumbering
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isNumbering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Numbering Cards...</span>
                    </>
                  ) : numberingComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Numbering Complete!</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Start Auto-Numbering</span>
                    </>
                  )}
                </button>
              </div>
              
              {!canAutoNumber && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-300 mb-2">⚠️ Requirements</h4>
                  <p className="text-sm text-orange-200">
                    Auto-numbering is only available when you have exactly {settings.setInfo.totalCards} main set cards 
                    (excluding tokens and emblems). You currently have {mainSetCards.length} main set cards.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldQuestion className="w-8 h-8 text-red-400" />
          <h2 className="text-2xl font-bold text-red-400">Help & Documentation</h2>
        </div>
        
        <div className="space-y-6">
          {/* Card Types Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Card Classification</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Original vs Reprint</h4>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li><strong className="text-green-300">Original (O):</strong> A completely new card created for this custom set</li>
                  <li><strong className="text-yellow-300">Reprint (R):</strong> A card that already exists in official Magic sets, reprinted in this custom set</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Nickname Cards</h4>
                <p className="text-gray-300 ml-4">
                  <strong className="text-purple-300">Nickname (N):</strong> Cards that have a nickname or alternate name but are still considered original cards for this set. 
                  These are functionally new cards but may reference or be inspired by existing characters or concepts.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-cyan-300 mb-2">Alternate Art</h4>
                <p className="text-gray-300 ml-4">
                  <strong className="text-cyan-300">Alternate Art (AA):</strong> Cards that already exist in this set but have different artwork, 
                  borders, or visual treatment. Similar to how official Magic sets sometimes have alternate art versions of the same card.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-indigo-300 mb-2">Double-Faced Cards</h4>
                <p className="text-gray-300 ml-4">
                  <strong className="text-indigo-300">Double-Faced (DF):</strong> Cards that have two faces, similar to transform cards 
                  or modal double-faced cards in official Magic. You can link two cards together to represent both faces of the same card.
                </p>
              </div>
            </div>
          </div>

          {/* Rarity Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Card Rarity System</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-gray-500/20 text-gray-300">C</span>
                  <span className="text-white">Common - Most frequent cards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-300">U</span>
                  <span className="text-white">Uncommon - Moderately rare</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-300">R</span>
                  <span className="text-white">Rare - Infrequent cards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-300">M</span>
                  <span className="text-white">Mythic - Extremely rare</span>
                </div>
              </div>
            </div>
          </div>

          {/* Archetypes Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Landmark className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Archetypes</h3>
            </div>
            
            <p className="text-gray-300 mb-4">
              Archetypes represent different themes, strategies, or color combinations in your set. 
              You can create custom archetypes and assign cards to them to organize your set by strategy or theme.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">💡 Tip</h4>
              <p className="text-sm text-blue-200">
                Use the Settings section to create and manage your archetypes. Each archetype can have its own color theme 
                and description to help organize your cards visually.
              </p>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-orange-400" />
              <h3 className="text-xl font-semibold text-white">Usage Tips</h3>
            </div>
            
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Use the Dashboard to track your progress toward the 280-card target</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Configure which overview sections to display in Settings → Overview Display Settings</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Export your data regularly as a backup using Settings → Data Management</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Click the settings icon (⚙️) on any card to edit all its properties in detail</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};