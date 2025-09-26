import React from 'react';
import { Home, Plus, List, Settings, BarChart3, HelpCircle, Grid3x3 as Grid3X3 } from 'lucide-react';
type ActiveSection = 'dashboard' | 'add-card' | 'card-list' | 'set-spoiler' | 'settings' | 'help';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
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
      icon: Plus,
      description: 'Create a new card'
    },
    {
      id: 'card-list' as const,
      label: 'Card List',
      icon: List,
      description: 'View and manage cards'
    },
    {
      id: 'help' as const,
      label: 'Help',
      icon: HelpCircle,
      description: 'Documentation and guides'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      description: 'App configuration'
    }
  ];

  return (
    <div className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-white/20 h-screen flex flex-col fixed left-0 top-0 z-10">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-lg font-bold text-white">MTG Tracker</h1>
            <p className="text-xs text-gray-400">Custom Set Manager</p>
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