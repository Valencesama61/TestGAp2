import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store d'authentification avec persistence
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // État initial
      token: null,
      isAuthenticated: false,
      isLoading: true,
      user: null,

      // Actions
      setAuth: async (token, user = null) => {
        try {
          set({
            token,
            isAuthenticated: !!token,  // Force boolean
            user,
            isLoading: false
          });
          return true;
        } catch (error) {
          console.error('Error setting auth:', error);
          set({ isLoading: false });
          return false;
        }
      },

      clearAuth: async () => {
        try {
          set({
            token: null,
            isAuthenticated: false,
            user: null,
            isLoading: false
          });
          return true;
        } catch (error) {
          console.error('Error clearing auth:', error);
          return false;
        }
      },

      initializeAuth: () => {
        // Vérifier si on a un token en storage
        const state = get();
        const hasToken = !!state.token;
        set({
          isAuthenticated: hasToken,
          isLoading: false
        });
      },
    }),
    {
      name: 'trelltech-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

/**
 * Helpers pour les intercepteurs
 */
export const getAuthToken = () => {
  const state = useAuthStore.getState();
  return state.token;
};

export const clearAuthToken = () => {
  return useAuthStore.getState().clearAuth();
};

