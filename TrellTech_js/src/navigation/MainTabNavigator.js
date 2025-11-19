import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Workspace Screens
import WorkspacesListScreen from '../features/workspaces/screens/WorkspacesListScreen';
import WorkspaceDetailScreen from '../features/workspaces/screens/WorkspaceDetailScreen';

// Board Screens
import BoardListScreen from '../features/boards/screens/BoardListScreen';
import BoardDetailScreen from '../features/boards/screens/BoardDetailScreen';

// Card Screens
import CardsListScreen from '../features/cards/screens/CardListScreen';
import CardDetailScreen from '../features/cards/screens/CardDetailScreen';

// Profile Screen
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const WorkspaceStack = createNativeStackNavigator();
const BoardStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Workspace Stack Navigator
function WorkspaceStackNavigator() {
  return (
    <WorkspaceStack.Navigator>
      <WorkspaceStack.Screen
        name="WorkspacesList"
        component={WorkspacesListScreen}
        options={{ title: 'Workspaces' }}
      />
      <WorkspaceStack.Screen
        name="WorkspaceDetail"
        component={WorkspaceDetailScreen}
        options={{ title: 'Détails Workspace' }}
      />
      <WorkspaceStack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={{ title: 'Détails Board' }}
      />
      <WorkspaceStack.Screen
        name="CardsList"
        component={CardsListScreen}
        options={{ title: 'Cartes' }}
      />
      <WorkspaceStack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{ title: 'Détails Carte' }}
      />
    </WorkspaceStack.Navigator>
  );
}

// Board Stack Navigator
function BoardStackNavigator() {
  return (
    <BoardStack.Navigator>
      <BoardStack.Screen
        name="BoardsList"
        component={BoardListScreen}
        options={{ title: 'Boards' }}
      />
      <BoardStack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={{ title: 'Détails Board' }}
      />
      <BoardStack.Screen
        name="CardsList"
        component={CardsListScreen}
        options={{ title: 'Cartes' }}
      />
      <BoardStack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{ title: 'Détails Carte' }}
      />
    </BoardStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'WorkspacesTab') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'BoardsTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0079BF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="WorkspacesTab"
        component={WorkspaceStackNavigator}
        options={{ title: 'Workspaces' }}
      />
      <Tab.Screen
        name="BoardsTab"
        component={BoardStackNavigator}
        options={{ title: 'Boards' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}
