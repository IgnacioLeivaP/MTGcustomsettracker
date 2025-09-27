import React from 'react';
import { Home, BookPlus, Rows4, Settings, Sparkles, ShieldQuestion, Grid3x3 as Grid3X3, Menu, X } from 'lucide-react';
type ActiveSection = 'dashboard' | 'add-card' | 'card-list' | 'set-spoiler' | 'settings' | 'help';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
      description: 'Set overview and statistics'
    },
    {
      id: 'set-spoiler' as const,
      label: 'Set Spoiler',
      icon: Grid3X3,
      description: 'Visual card spoiler view'
    },
    {
      id: 'add-card' as const,
      label: 'Add New Card',
      icon: BookPlus,
      description: 'Create a new card'
    },
    {
      id: 'card-list' as const,
      label: 'Card List',
      icon: Rows4,
      description: 'View and manage cards'
    },
    {
      id: 'help' as const,
      label: 'Help',
      icon: ShieldQuestion,
      description: 'Tools and documentation'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      description: 'App configuration'
    }
  ];

  return (
    <>
      {/* Header */}
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-gray-900/50 backdrop-blur-sm border-r border-white/20 h-screen flex-col fixed left-0 top-0 z-10">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-lg font-bold text-white">MTG Custom Set Creator</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75 truncate">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/20">
          <div className="text-xs text-gray-400 text-center">
            <div>Version 1.0.0</div>
            <div className="mt-1">Custom Set Tracker</div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/20 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-lg font-bold text-white">MTG Set Creator</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/20 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-4">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75 truncate">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 z-50">
        <div className="grid grid-cols-6 gap-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-red-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium leading-tight text-center">
                  {item.label.split(' ').map((word, index) => (
                    <div key={index}>{word}</div>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-lg font-bold text-white">MTG Custom Set Creator</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75 truncate">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <div className="text-xs text-gray-400 text-center">
          <div>Version 1.0.0</div>
          <div className="mt-1">Custom Set Tracker</div>
        </div>
      </div>
    </div>
  );
};