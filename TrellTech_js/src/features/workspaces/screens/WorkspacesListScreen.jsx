import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkspaces } from '../hooks/useWorkspaces';

export default function WorkspacesListScreen({ navigation }) {
  const { data: workspaces, isLoading, error, refetch } = useWorkspaces();

  const renderWorkspace = ({ item }) => (
    <TouchableOpacity
      style={styles.workspaceCard}
      onPress={() => navigation.navigate('WorkspaceDetail', { workspaceId: item.id, workspaceName: item.displayName || item.name })}
    >
      <View style={styles.workspaceIcon}>
        <Ionicons name="briefcase" size={24} color="#0079BF" />
      </View>
      <View style={styles.workspaceInfo}>
        <Text style={styles.workspaceName}>{item.displayName || item.name}</Text>
        {item.desc && <Text style={styles.workspaceDesc} numberOfLines={2}>{item.desc}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workspaces}
        renderItem={renderWorkspace}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun workspace trouvé</Text>
          </View>
        }
      />
    </View>
  );
}

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
  listContainer: {
    padding: 16,
  },
  workspaceCard: {
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
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  workspaceDesc: {
    fontSize: 12,
    color: '#5E6C84',
  },
  errorText: {
    color: '#EB5A46',
    fontSize: 14,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0079BF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#5E6C84',
    marginTop: 16,
  },
});
