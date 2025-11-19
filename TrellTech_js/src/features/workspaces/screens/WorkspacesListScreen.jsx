import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useWorkspaceActions } from '../hooks/useWorkspaceActions';
import WorkspaceCard from '../components/WorkspaceCard';
import WorkspaceForm from '../components/WorkspaceForm';

export default function WorkspacesListScreen({ navigation }) {
  const [formVisible, setFormVisible] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const { workspaces, loading, error, refetch } = useWorkspaces();
  const { addWorkspace, editWorkspace, removeWorkspace } = useWorkspaceActions(refetch);

  const handleCreateWorkspace = async (name, desc) => {
    try {
      await addWorkspace(name, desc);
      setFormVisible(false);
      Alert.alert('Succès', 'Workspace créé');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le workspace');
    }
  };

  const handleUpdateWorkspace = async (name, desc) => {
    try {
      await editWorkspace(selectedWorkspace.id, name, desc);
      setFormVisible(false);
      setSelectedWorkspace(null);
      Alert.alert('Succès', 'Workspace modifié');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le workspace');
    }
  };

  const handleDeleteWorkspace = (workspace) => {
    Alert.alert(
      'Supprimer le workspace',
      `Supprimer "${workspace.displayName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeWorkspace(workspace.id);
              Alert.alert('Succès', 'Workspace supprimé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le workspace');
            }
          },
        },
      ]
    );
  };

  const handleEditWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setFormVisible(true);
  };

  const handlePressWorkspace = (workspace) => {
    navigation.navigate('WorkspaceDetail', {
      workspaceId: workspace.id,
      workspaceName: workspace.displayName,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
        <Text style={styles.loadingText}>Chargement des workspaces...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EB5A46" />
        <Text style={styles.errorText}>Erreur de chargement</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const workspacesList = Array.isArray(workspaces) ? workspaces : [];

  const renderWorkspace = ({ item }) => (
    <WorkspaceCard
      workspace={item}
      onPress={handlePressWorkspace}
      onEdit={handleEditWorkspace}
      onDelete={handleDeleteWorkspace}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="briefcase-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Aucun workspace</Text>
      <Text style={styles.emptySubtext}>Créez votre premier workspace</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workspacesList}
        renderItem={renderWorkspace}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          workspacesList.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFormVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <WorkspaceForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setSelectedWorkspace(null);
        }}
        onSubmit={
          selectedWorkspace
            ? (name, desc) => handleUpdateWorkspace(name, desc)
            : (name, desc) => handleCreateWorkspace(name, desc)
        }
        initialData={selectedWorkspace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0079BF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyListContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5AAC44',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
