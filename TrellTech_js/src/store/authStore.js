import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupInterceptors } from '../api/trello/interceptors';

const STORAGE_KEY = 'trelltech-auth-storage';

// Clear old storage
AsyncStorage.removeItem(STORAGE_KEY);

const AuthContext = createContext(null);

// Global state for interceptors
let globalAuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(globalAuthState);

  useEffect(() => {
    // Initialize auth from storage
    const initAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          const newState = {
            token: data.token || null,
            isAuthenticated: data.token ? true : false,
            user: data.user || null,
            isLoading: false,
          };
          globalAuthState = newState;
          setState(newState);
        } else {
          globalAuthState = { ...globalAuthState, isLoading: false };
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading auth:', error);
        globalAuthState = { ...globalAuthState, isLoading: false };
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
    setupInterceptors();
  }, []);

  const setAuth = async (token, user = null) => {
    try {
      const newState = {
        token,
        isAuthenticated: true,
        user,
        isLoading: false,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      globalAuthState = newState;
      setState(newState);
      return true;
    } catch (error) {
      console.error('Error setting auth:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      const newState = {
        token: null,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
      globalAuthState = newState;
      setState(newState);
      return true;
    } catch (error) {
      console.error('Error clearing auth:', error);
      return false;
    }
  };

  const initializeAuth = () => {
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const value = {
    ...state,
    setAuth,
    clearAuth,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthStore must be used within AuthProvider');
  }
  return context;
};

/**
 * Helpers for interceptors
 */
export const getAuthToken = () => globalAuthState.token;
export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    globalAuthState = {
      token: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};
