import { StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

let storage: any = null;
let isMMKVAvailable = false;

// Try to use MMKV, fall back to AsyncStorage for Expo Go
try {
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV({ id: 'dashtok-storage' });
  isMMKVAvailable = true;
} catch {
  // MMKV not available (Expo Go), use AsyncStorage
  isMMKVAvailable = false;
}

// Zustand persist storage adapter
export const zustandStorage: StateStorage = isMMKVAvailable
  ? {
      setItem: (name, value) => {
        storage.set(name, value);
      },
      getItem: (name) => {
        const value = storage.getString(name);
        return value ?? null;
      },
      removeItem: (name) => {
        storage.delete(name);
      },
    }
  : {
      setItem: async (name, value) => {
        await AsyncStorage.setItem(name, value);
      },
      getItem: async (name) => {
        return await AsyncStorage.getItem(name);
      },
      removeItem: async (name) => {
        await AsyncStorage.removeItem(name);
      },
    };

// Helper functions
export const mmkv = {
  getString: (key: string): string | undefined => {
    if (isMMKVAvailable) {
      return storage.getString(key);
    }
    // For AsyncStorage, this needs to be async - use zustandStorage for Zustand
    return undefined;
  },
  setString: (key: string, value: string): void => {
    if (isMMKVAvailable) {
      storage.set(key, value);
    } else {
      AsyncStorage.setItem(key, value);
    }
  },
  getNumber: (key: string): number | undefined => {
    if (isMMKVAvailable) {
      return storage.getNumber(key);
    }
    return undefined;
  },
  setNumber: (key: string, value: number): void => {
    if (isMMKVAvailable) {
      storage.set(key, value);
    } else {
      AsyncStorage.setItem(key, String(value));
    }
  },
  getBoolean: (key: string): boolean | undefined => {
    if (isMMKVAvailable) {
      return storage.getBoolean(key);
    }
    return undefined;
  },
  setBoolean: (key: string, value: boolean): void => {
    if (isMMKVAvailable) {
      storage.set(key, value);
    } else {
      AsyncStorage.setItem(key, String(value));
    }
  },
  delete: (key: string): void => {
    if (isMMKVAvailable) {
      storage.delete(key);
    } else {
      AsyncStorage.removeItem(key);
    }
  },
  clearAll: (): void => {
    if (isMMKVAvailable) {
      storage.clearAll();
    } else {
      AsyncStorage.clear();
    }
  },
};
