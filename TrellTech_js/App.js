// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View } from 'react-native';

// // export default function App() {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Open up App.js to start working on your app!</Text>
// //       <StatusBar style="auto" />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });


// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { useEffect } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useAuthStore } from './src/store/authStore';
// import CardsListScreen from './src/features/cards/screens/CardListScreen';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 2,                // Réessayer 2 fois en cas d'erreur
//       staleTime: 30000,        // Les données sont fraîches pendant 30 secondes
//       cacheTime: 5 * 60 * 1000, // Garder en cache 5 minutes
//       refetchOnWindowFocus: false, // Ne pas refetch au focus
//     },
//     mutations: {
//       retry: 1, // Réessayer 1 fois pour les mutations
//     },
//   },
// });

// export default function App() {
//   const initializeAuth = useAuthStore(state => state.initializeAuth);

//   useEffect(() => {
//     // Initialiser l'authentification au démarrage
//     initializeAuth();
//   }, []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <CardsListScreen />
//         <StatusBar style="auto" />
//       </View>
//     </QueryClientProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WorkspacesScreen from './src/features/workspaces/screens/WorkspacesListScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto"></StatusBar>
      <WorkspacesScreen></WorkspacesScreen>
      {/* <WorkspacesScreen /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';

// import AppNavigator from './src/navigation/AppNavigator';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <AppNavigator />
//       <StatusBar style="auto" />
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

