import React, { useState, useEffect } from 'react';
import { Card, Archetype, AppData } from './types';
import { loadData, saveData, clearData } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { StatsGrid } from './components/StatsGrid';
import { CardForm } from './components/CardForm';
import { CardTable } from './components/CardTable';
import { SetSpoiler } from './components/SetSpoiler';
import { ArchetypeManager } from './components/ArchetypeManager';
import { SettingsModal } from './components/SettingsModal';
import { OverviewSettings } from './components/OverviewSettings';
import { HelpSection } from './components/HelpSection';
import { SetInfoSettings } from './components/SetInfoSettings';
import { SetHeader } from './components/SetHeader';
import { DebugSection } from './components/DebugSection';

type ActiveSection = 'dashboard' | 'add-card' | 'card-list' | 'set-spoiler' | 'settings' | 'help';

function App() {
  const [appData, setAppData] = useState<AppData>(() => loadData());
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Reset scroll position when changing sections
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

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

  const updateSettings = (newSettings: any) => {
    setAppData(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Content based on active section */}
          <div className="space-y-8">
            {activeSection === 'dashboard' && (
              <>
                <SetHeader 
                  setInfo={appData.settings.setInfo}
                  currentCardCount={appData.cards.length}
                />
                <StatsGrid 
                  cards={appData.cards} 
                  archetypes={appData.archetypes}
                  settings={appData.settings}
                  onUpdateSettings={updateSettings}
                />
              </>
            )}

            {activeSection === 'add-card' && (
              <CardForm 
                archetypes={appData.archetypes} 
                cards={appData.cards}
                onAddCard={addCard} 
              />
            )}

            {activeSection === 'card-list' && (
              <CardTable 
                cards={appData.cards}
                archetypes={appData.archetypes}
                onUpdateCard={updateCard}
                onDeleteCard={deleteCard}
              />
            )}

            {activeSection === 'set-spoiler' && (
              <SetSpoiler 
                cards={appData.cards}
                archetypes={appData.archetypes}
              />
            )}

            {activeSection === 'settings' && (
              <div className="space-y-8">
                <SetInfoSettings
                  settings={appData.settings}
                  onUpdateSettings={updateSettings}
                />
                
                <ArchetypeManager
                  archetypes={appData.archetypes}
                  onUpdateArchetypes={updateArchetypes}
                />
                
                <DebugSection appData={appData} />
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold mb-6 text-red-400">⚙️ App Settings</h2>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Open Data Management
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'help' && (
              <HelpSection />
            )}
          </div>
        </div>
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
  );
}

export default App;