import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupInterceptors } from '../api/trello/interceptors';
AsyncStorage.removeItem("trelltech-auth-storage");

setupInterceptors();

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
      version: 2, // version pour migration future



migrate: (persistedState) => {
  if (!persistedState?.state) return persistedState;

  const s = persistedState.state;

  return {
    ...persistedState,
    state: {
      ...s,
      isAuthenticated:
        s.isAuthenticated === true || s.isAuthenticated === "true",
      isLoading:
        s.isLoading === true || s.isLoading === "true",
    },
  };
},



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
