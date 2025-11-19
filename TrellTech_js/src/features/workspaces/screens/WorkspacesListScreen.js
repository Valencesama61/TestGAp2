import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { WORKSPACES_ENDPOINTS } from '../../../api/trello/endpoints';

const WorkspacesListScreen = ({ navigation }) => {
  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await trelloClient.get(WORKSPACES_ENDPOINTS.getAll);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erreur: {error.message}</Text>
      </View>
    );
  }

  const handleWorkspacePress = (workspace) => {
    navigation.navigate('WorkspaceDetail', { 
      workspaceId: workspace.id,
      workspaceName: workspace.displayName 
    });
  };

  const renderWorkspaceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.workspaceItem}
      onPress={() => handleWorkspacePress(item)}
    >
      <View style={styles.workspaceIcon}>
        <Text style={styles.workspaceIconText}>
          {item.displayName ? item.displayName.charAt(0).toUpperCase() : 'W'}
        </Text>
      </View>
      <View style={styles.workspaceInfo}>
        <Text style={styles.workspaceName}>{item.displayName}</Text>
        <Text style={styles.workspaceType}>
          {item.name || 'Workspace'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workspaces</Text>
        <Text style={styles.headerSubtitle}>
          {workspaces?.length || 0} workspace(s)
        </Text>
      </View>

      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkspaceItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EB5A46',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5E6C84',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  workspaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workspaceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workspaceIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workspaceInfo: {
    flex: 1,
  },
  workspaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 4,
  },
  workspaceType: {
    fontSize: 14,
    color: '#5E6C84',
  },
});

export default WorkspacesListScreen;