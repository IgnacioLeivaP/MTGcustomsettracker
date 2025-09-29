import React, { useState } from 'react';
import { X, AlertTriangle, Download, Upload } from 'lucide-react';
import { AppData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  appData: AppData;
  onImportData: (data: AppData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  appData,
  onImportData
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  if (!isOpen) return null;

  const handleReset = () => {
    if (resetConfirmText === 'RESET') {
      onResetData();
      setShowResetConfirm(false);
      setResetConfirmText('');
      onClose();
      // Force page reload to ensure complete reset
      window.location.reload();
    } else {
      alert('Please type "RESET" to confirm data deletion');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mtg-card-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as AppData;
          if (data.cards && data.archetypes && data.version) {
            onImportData(data);
            alert('Data imported successfully!');
          } else {
            alert('Invalid file format');
          }
        } catch (error) {
          alert('Error reading file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-400">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Data Management</h3>
            
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Data</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Danger Zone</h3>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Reset All Data</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-300 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold">Warning!</span>
                  </div>
                  <p className="text-sm text-red-200 mb-3">
                    This will permanently delete all your cards, archetypes, and settings. 
                    This action cannot be undone.
                  </p>
                  <div className="mb-3">
                    <label className="block text-sm text-red-300 mb-1">
                      Type "RESET" to confirm:
                    </label>
                    <input
                      type="text"
                      value={resetConfirmText}
                      onChange={(e) => setResetConfirmText(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-red-500/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Type RESET here"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => {
                        setShowResetConfirm(false);
                        setResetConfirmText('');
                      }}
                      className="flex-1 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};