// Utility functions for parsing mana costs
export const normalizeManaForStorage = (input: string): string => {
  if (!input) return '';
  
  // Remove extra spaces
  let normalized = input.trim();
  
  // If input already has braces, return as is
  if (normalized.includes('{') && normalized.includes('}')) {
    return normalized;
  }
  
  // Convert shorthand format (like "1W" or "2WR") to full format (like "{1}{W}" or "{2}{W}{R}")
  const result: string[] = [];
  let i = 0;
  
  while (i < normalized.length) {
    const char = normalized[i];
    
    // Handle numbers (including multi-digit)
    if (/\d/.test(char)) {
      let number = '';
      while (i < normalized.length && /\d/.test(normalized[i])) {
        number += normalized[i];
        i++;
      }
      result.push(`{${number}}`);
    }
    // Handle color symbols
    else if (/[WUBRG]/i.test(char)) {
      result.push(`{${char.toUpperCase()}}`);
      i++;
    }
    // Handle colorless mana symbol
    else if (/[C]/i.test(char)) {
      result.push(`{${char.toUpperCase()}}`);
      i++;
    }
    // Skip other characters
    else {
      i++;
    }
  }
  
  return result.join('');
};

export const normalizeManaForDisplay = (input: string): string => {
  // For display, we keep the user's input as-is
  return input;
};

export const validateManaInput = (input: string): boolean => {
  if (!input) return true; // Empty is valid
  
  // Check if it matches the expected pattern
  const manaPattern = /^(\{[0-9WUBRGC]+\})*$/;
  const normalized = normalizeManaForStorage(input);
  
  return manaPattern.test(normalized);
}