import React from 'react';
import { HardDrive, Image, Database, AlertTriangle, Info } from 'lucide-react';
import { getStorageUsage, getImageSizeKB } from '../utils/imageCompression';
import { AppData } from '../types';

interface DebugSectionProps {
  appData: AppData;
}

export const DebugSection: React.FC<DebugSectionProps> = ({ appData }) => {
  const storageUsage = getStorageUsage();
  
  // Calculate image storage usage
  const cardsWithImages = appData.cards.filter(card => card.imageFile);
  const totalImageSizeKB = cardsWithImages.reduce((total, card) => {
    return total + (card.imageFile ? getImageSizeKB(card.imageFile) : 0);
  }, 0);
  
  // Calculate other data size
  const dataWithoutImages = {
    ...appData,
    cards: appData.cards.map(card => {
      const { imageFile, ...cardWithoutImage } = card;
      return cardWithoutImage;
    })
  };
  const otherDataSizeKB = (JSON.stringify(dataWithoutImages).length) / 1024;
  
  const formatSize = (sizeKB: number): string => {
    if (sizeKB < 1024) {
      return `${sizeKB.toFixed(1)} KB`;
    }
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };
  
  const getUsageColor = (percentage: number): string => {
    if (percentage < 50) return 'text-green-400';
    if (percentage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getProgressBarColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <HardDrive className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-blue-400">🔧 Debug & Storage Info</h2>
      </div>
      
      <div className="space-y-6">
        {/* Overall Storage Usage */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Overall Storage Usage</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Used:</span>
              <span className={`font-bold ${getUsageColor(storageUsage.percentage)}`}>
                {formatSize(storageUsage.used)} / {formatSize(storageUsage.total)}
              </span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${getProgressBarColor(storageUsage.percentage)}`}
                style={{ width: `${Math.min(100, storageUsage.percentage)}%` }}
              />
            </div>
            
            <div className="text-center">
              <span className={`text-lg font-bold ${getUsageColor(storageUsage.percentage)}`}>
                {storageUsage.percentage.toFixed(1)}% used
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Storage */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Image className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Image Storage</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Cards with images:</span>
                <span className="text-white font-bold">{cardsWithImages.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Total image size:</span>
                <span className="text-purple-300 font-bold">{formatSize(totalImageSizeKB)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Avg per image:</span>
                <span className="text-gray-300">
                  {cardsWithImages.length > 0 
                    ? formatSize(totalImageSizeKB / cardsWithImages.length)
                    : '0 KB'
                  }
                </span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalImageSizeKB / storageUsage.total) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* App Data Storage */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">App Data Storage</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total cards:</span>
                <span className="text-white font-bold">{appData.cards.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Total archetypes:</span>
                <span className="text-white font-bold">{appData.archetypes.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Data size:</span>
                <span className="text-green-300 font-bold">{formatSize(otherDataSizeKB)}</span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (otherDataSizeKB / storageUsage.total) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compression Info */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Image Compression Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Max dimensions:</span>
                <span className="text-cyan-300">800x600px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Quality:</span>
                <span className="text-cyan-300">80%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Max size per image:</span>
                <span className="text-cyan-300">500 KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Format:</span>
                <span className="text-cyan-300">JPEG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Warnings */}
        {storageUsage.percentage > 80 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h4 className="font-semibold text-red-300">Storage Warning</h4>
            </div>
            <p className="text-red-200 text-sm">
              You're using {storageUsage.percentage.toFixed(1)}% of available storage. 
              Consider exporting your data as backup and removing some images to free up space.
            </p>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">💡 Storage Tips</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Images are automatically compressed to max 500KB each</li>
            <li>• Total browser storage limit is typically 5-10MB</li>
            <li>• Export your data regularly as backup</li>
            <li>• Remove unused images to free up space</li>
            <li>• Consider using external image hosting for large collections</li>
          </ul>
        </div>
      </div>
    </div>
  );
};