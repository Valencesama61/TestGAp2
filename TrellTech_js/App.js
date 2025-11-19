import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/store/authStore';
import AppNavigator from './src/navigation/AppNavigator';

import { setupInterceptors } from './src/api/trello/interceptors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
  },
});

export default function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    setupInterceptors();
    
    initializeAuth();
  }, []);
  console.log("n'importe quoi")
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
