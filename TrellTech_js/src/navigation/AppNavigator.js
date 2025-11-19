import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Screens
import TimePage from '../pages/TimePage';
import BoardListScreen from '../features/boards/screens/BoardListScreen';
import BoardDetailScreen from '../features/boards/screens/BoardDetailScreen';
import CardListScreen from '../features/cards/screens/CardListScreen';
import CardDetailScreen from '../features/cards/screens/CardDetailScreen';
import ListScreen from '../features/lists/screens/ListScreen';
import ListDetailScreen from '../features/lists/screens/ListDetailScreen';
import WorkspacesListScreen from '../features/workspaces/screens/WorkspacesListScreen';
import WorkspaceDetailScreen from '../features/workspaces/screens/WorkspaceDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Time">
      <Stack.Screen name="Time" component={TimePage} options={{ title: 'Heure' }} />
      <Stack.Screen name="Boards" component={BoardListScreen} />
      <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
      <Stack.Screen name="Cards" component={CardListScreen} />
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
      <Stack.Screen name="Lists" component={ListScreen} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} />
      <Stack.Screen name="Workspaces" component={WorkspacesListScreen} />
      <Stack.Screen name="WorkspaceDetail" component={WorkspaceDetailScreen} />
    </Stack.Navigator>
  );
}
