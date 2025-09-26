import React, { useState, useEffect } from 'react';
import { Settings, Home } from 'lucide-react';
import { Card, Archetype, AppData } from './types';
import { loadData, saveData, clearData } from './utils/storage';
import { StatsGrid } from './components/StatsGrid';
import { CardForm } from './components/CardForm';
import { CardTable } from './components/CardTable';
import { ArchetypeManager } from './components/ArchetypeManager';
import { SettingsModal } from './components/SettingsModal';

type ActiveTab = 'dashboard' | 'archetypes' | 'settings';

function App() {
  const [appData, setAppData] = useState<AppData>(() => loadData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save data whenever it changes
  useEffect(() => {
    saveData(appData);
  }, [appData]);

  const addCard = (cardData: Omit<Card, 'id' | 'createdAt'>) => {
    const newCard: Card = {
      ...cardData,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    setAppData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const updateCard = (id: string, updates: Partial<Card>) => {
    setAppData(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.id === id ? { ...card, ...updates } : card
      )
    }));
  };

  const deleteCard = (id: string) => {
    setAppData(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== id)
    }));
  };

  const updateArchetypes = (archetypes: Archetype[]) => {
    setAppData(prev => ({
      ...prev,
      archetypes
    }));
  };

  const resetAllData = () => {
    clearData();
    setAppData(loadData());
  };

  const importData = (newData: AppData) => {
    setAppData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            MTG Custom Set Tracker
          </h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'archetypes'
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Manage Archetypes
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <>
              <StatsGrid cards={appData.cards} archetypes={appData.archetypes} />
              <CardForm archetypes={appData.archetypes} onAddCard={addCard} />
              <CardTable 
                cards={appData.cards}
                archetypes={appData.archetypes}
                onUpdateCard={updateCard}
                onDeleteCard={deleteCard}
              />
            </>
          )}

          {activeTab === 'archetypes' && (
            <ArchetypeManager
              archetypes={appData.archetypes}
              onUpdateArchetypes={updateArchetypes}
            />
          )}
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onResetData={resetAllData}
          appData={appData}
          onImportData={importData}
        />
      </div>
    </div>
  );
}

export default App;