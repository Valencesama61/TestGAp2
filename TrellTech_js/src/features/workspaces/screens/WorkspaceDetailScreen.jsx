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
import { useBoards } from '../../boards/hooks/useBoards';
import BoardCard from '../../boards/components/BoardCard';

export default function WorkspaceDetailScreen({ route, navigation }) {
  const { workspaceId, workspaceName } = route.params;

  // Récupérer tous les boards et filtrer ceux du workspace
  const { data: allBoards, isLoading, refetch } = useBoards();

  // Filtrer les boards qui appartiennent à ce workspace
  const workspaceBoards = allBoards?.filter(
    (board) => board.idOrganization === workspaceId
  ) || [];

  const handlePressBoard = (board) => {
    navigation.navigate('BoardDetail', {
      boardId: board.id,
      boardName: board.name,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const renderBoard = ({ item }) => (
    <BoardCard
      board={item}
      onPress={handlePressBoard}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="grid-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Aucun board</Text>
      <Text style={styles.emptySubtext}>
        Ce workspace ne contient pas encore de boards
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="briefcase" size={24} color="#0079BF" />
        <Text style={styles.workspaceName}>{workspaceName}</Text>
      </View>

      <FlatList
        data={workspaceBoards}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          workspaceBoards.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  workspaceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
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
});
