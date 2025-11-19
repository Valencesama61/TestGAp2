// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useAuthStore } from './src/store/authStore';
// import AppNavigator from './src/navigation/AppNavigator';

// import { setupInterceptors } from './src/api/trello/interceptors';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 2,
//       staleTime: 30000,
//     },
//   },
// });

// export default function App() {
//   const initializeAuth = useAuthStore(state => state.initializeAuth);

//   useEffect(() => {
//     const initialize = async () => {
//       setupInterceptors();

//       // Petit délai pour laisser le store se réhydrater
//       await new Promise(resolve => setTimeout(resolve, 100));

//       initializeAuth();
//     };

//     initialize();
//   }, []);
//   console.log("n'importe quoi")
  
//   return (
//     <QueryClientProvider client={queryClient}>
//       <NavigationContainer>
//         <AppNavigator />
//         <StatusBar style="auto" />
//       </NavigationContainer>
//     </QueryClientProvider>
//   );
// }

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/store/authStore';
import AppNavigator from './src/navigation/AppNavigator';
import { setupInterceptors } from './src/api/trello/interceptors';
import { View, ActivityIndicator } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
  },
});

export default function App() {
  const [isStoreReady, setIsStoreReady] = useState(false);
  //const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    const initialize = async () => {
      try {
        setupInterceptors();
        
        setTimeout(() => {
          //initializeAuth();
          setIsStoreReady(true);
        }, 500);
        
      } catch (error) {
        console.error('App initialization error:', error);
        setIsStoreReady(true);
      }
    };

    initialize();
  }, []);

  // Afficher un splash screen pendant l'initialisation
  if (!isStoreReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}