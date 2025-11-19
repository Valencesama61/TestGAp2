import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Auth
import LoginScreen from '../features/auth/screens/LoginScreen';

// Main App
import MainTabNavigator from './MainTabNavigator';

// Store
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => !!state.isAuthenticated);
  const isLoading = useAuthStore((state) => !!state.isLoading);

  // Afficher un loader pendant l'initialisation
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Stack d'authentification
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Stack principal de l'application
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
