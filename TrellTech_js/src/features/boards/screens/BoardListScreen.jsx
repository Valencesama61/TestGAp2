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
import { useBoards } from '../hooks/useBoards';
import { useBoardActions } from '../hooks/useBoardActions';
import BoardCard from '../components/BoardCard';
import BoardForm from '../components/BoardForm';

export default function BoardListScreen({ navigation }) {
  const [formVisible, setFormVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const { data: boards, isLoading, error, refetch } = useBoards();
  const { createBoard, updateBoard, deleteBoard, isCreating, isUpdating, isDeleting } = useBoardActions();

  const handleCreateBoard = async (boardData) => {
    try {
      await createBoard(boardData);
      setFormVisible(false);
      Alert.alert('Succès', 'Board créé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le board');
    }
  };

  const handleUpdateBoard = async (boardData) => {
    try {
      await updateBoard({ id: selectedBoard.id, updates: boardData });
      setFormVisible(false);
      setSelectedBoard(null);
      Alert.alert('Succès', 'Board modifié avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le board');
    }
  };

  const handleDeleteBoard = (board) => {
    Alert.alert(
      'Supprimer le board',
      `Êtes-vous sûr de vouloir supprimer "${board.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBoard(board.id);
              Alert.alert('Succès', 'Board supprimé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le board');
            }
          },
        },
      ]
    );
  };

  const handleEditBoard = (board) => {
    setSelectedBoard(board);
    setFormVisible(true);
  };

  const handlePressBoard = (board) => {
    navigation.navigate('BoardDetail', { boardId: board.id, boardName: board.name });
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedBoard(null);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
        <Text style={styles.loadingText}>Chargement des boards...</Text>
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

  const renderBoard = ({ item }) => (
    <BoardCard
      board={item}
      onPress={handlePressBoard}
      onEdit={handleEditBoard}
      onDelete={handleDeleteBoard}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="grid-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Aucun board</Text>
      <Text style={styles.emptySubtext}>Créez votre premier board pour commencer</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={boards}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          boards?.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFormVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <BoardForm
        visible={formVisible}
        onClose={handleFormClose}
        onSubmit={selectedBoard ? handleUpdateBoard : handleCreateBoard}
        initialData={selectedBoard}
        isLoading={isCreating || isUpdating}
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
