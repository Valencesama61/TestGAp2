import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Auth
import LoginScreen from '../features/auth/screens/LoginScreen';

// Main App
import MainTabNavigator from './MainTabNavigator';

// Store
import { useAuthStore } from '../store/authStore';
import LoadingScreen from '../features/auth/screens/LoadingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [showLoading, setShowLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Display a loader while initialisation
  if (showLoading) {
    return <LoadingScreen onFinish={() => setShowLoading(false)} />;
  }

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
        // Authentification stack
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // App main stack
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
