// Image compression utility
export interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeKB: number;
}

const defaultOptions: CompressionOptions = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  maxSizeKB: 500
};

export const compressImage = (file: File, options: Partial<CompressionOptions> = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const opts = { ...defaultOptions, ...options };
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > opts.maxWidth || height > opts.maxHeight) {
        const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels if size is too large
      let quality = opts.quality;
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Estimate size (base64 is ~33% larger than binary)
      const estimatedSizeKB = (compressedDataUrl.length * 0.75) / 1024;
      
      // Reduce quality if still too large
      while (estimatedSizeKB > opts.maxSizeKB && quality > 0.1) {
        quality -= 0.1;
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const newSizeKB = (compressedDataUrl.length * 0.75) / 1024;
        if (newSizeKB <= opts.maxSizeKB) break;
      }
      
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const getImageSizeKB = (base64String: string): number => {
  // Remove data URL prefix if present
  const base64Data = base64String.split(',')[1] || base64String;
  // Convert base64 to approximate binary size
  return (base64Data.length * 0.75) / 1024;
};

export const getStorageUsage = (): { used: number; total: number; percentage: number } => {
  try {
    let totalSize = 0;
    
    // Calculate total localStorage usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    
    // Convert to KB
    const usedKB = totalSize / 1024;
    
    // Estimate total available (typically 5-10MB, we'll use 5MB as conservative)
    const totalKB = 5 * 1024; // 5MB in KB
    
    return {
      used: usedKB,
      total: totalKB,
      percentage: (usedKB / totalKB) * 100
    };
  } catch (error) {
    return { used: 0, total: 5120, percentage: 0 };
  }
};