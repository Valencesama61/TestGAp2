import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupInterceptors } from '../api/trello/interceptors';

// Initialiser les intercepteurs au démarrage
setupInterceptors();

/**
 * Store d'authentification avec persistence
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      token: null,
      isAuthenticated: false,
      isLoading: true,
      user: null,

      // Actions
      setAuth: async (token, user = null) => {
        try {
          set({ token, isAuthenticated: true, user, isLoading: false });
          return true;
        } catch (error) {
          console.error('Error setting auth:', error);
          set({ isLoading: false });
          return false;
        }
      },

      clearAuth: async () => {
        try {
          set({ token: null, isAuthenticated: false, user: null, isLoading: false });
          return true;
        } catch (error) {
          console.error('Error clearing auth:', error);
          return false;
        }
      },

      initializeAuth: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'trelltech-auth-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Helpers pour les intercepteurs
 */
export const getAuthToken = () => useAuthStore.getState().token;
export const clearAuthToken = () => useAuthStore.getState().clearAuth();