import React from 'react';
import { BookOpen, Info, Tag, Palette, Star } from 'lucide-react';

export const HelpSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpen className="w-8 h-8 text-red-400" />
          <h2 className="text-2xl font-bold text-red-400">📚 Help & Documentation</h2>
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
              <Palette className="w-5 h-5 text-green-400" />
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