// This service handles local storage management and synchronization

// Store any value with type safety
export function storeValue<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error storing value for key ${key}:`, error);
    throw error;
  }
}

// Retrieve a value with type safety
export function getValue<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Error retrieving value for key ${key}:`, error);
    return defaultValue;
  }
}

// Remove a value
export function removeValue(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing value for key ${key}:`, error);
    throw error;
  }
}

// Check if a value exists
export function hasValue(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

// Clear all values
export function clearAllValues(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing all values:", error);
    throw error;
  }
}

// Self-repair functionality for data integrity
export function repairStorage(): boolean {
  try {
    // Check for corrupted JSON data
    const keys = Object.keys(localStorage);
    let repaired = false;
    
    for (const key of keys) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // Try to parse it to check if it's valid JSON
          JSON.parse(value);
        }
      } catch (error) {
        // If parsing fails, the data is corrupted
        console.warn(`Corrupted data detected for key ${key}, removing...`);
        localStorage.removeItem(key);
        repaired = true;
      }
    }
    
    return repaired;
  } catch (error) {
    console.error("Error during storage repair:", error);
    return false;
  }
}

// Sync local storage to server (if available)
export async function syncToServer(): Promise<boolean> {
  try {
    const keys = Object.keys(localStorage);
    const syncData: Record<string, any> = {};
    
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          syncData[key] = JSON.parse(value);
        } catch (error) {
          syncData[key] = value;
        }
      }
    }
    
    const response = await fetch("/api/storage/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(syncData),
      credentials: "include"
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error syncing to server:", error);
    return false;
  }
}

// Restore from server (if available)
export async function restoreFromServer(): Promise<boolean> {
  try {
    const response = await fetch("/api/storage/restore", {
      credentials: "include"
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Clear current storage
      localStorage.clear();
      
      // Restore from server data
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error restoring from server:", error);
    return false;
  }
}
