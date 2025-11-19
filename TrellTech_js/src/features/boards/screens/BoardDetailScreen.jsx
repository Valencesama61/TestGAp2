import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBoard, useBoardLists } from '../hooks/useBoards';
import { useListActions } from '../../lists/hooks/useListActions';
import ListCard from '../../lists/components/ListCard';
import ListForm from '../../lists/components/ListForm';

export default function BoardDetailScreen({ route, navigation }) {
  const { boardId } = route.params;
  const [formVisible, setFormVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  const { data: board, isLoading: boardLoading } = useBoard(boardId);
  const { data: lists, isLoading: listsLoading, refetch } = useBoardLists(boardId);
  const { createList, updateList, archiveList, isCreating, isUpdating } = useListActions();

  const isLoading = boardLoading || listsLoading;

  const handleCreateList = async (listData) => {
    try {
      await createList({ ...listData, idBoard: boardId });
      setFormVisible(false);
      Alert.alert('Succès', 'Liste créée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la liste');
    }
  };

  const handleUpdateList = async (listData) => {
    try {
      await updateList({ id: selectedList.id, updates: listData });
      setFormVisible(false);
      setSelectedList(null);
      Alert.alert('Succès', 'Liste modifiée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la liste');
    }
  };

  const handleArchiveList = (list) => {
    Alert.alert(
      'Archiver la liste',
      `Archiver "${list.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Archiver',
          onPress: async () => {
            try {
              await archiveList(list.id);
              Alert.alert('Succès', 'Liste archivée');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'archiver la liste');
            }
          },
        },
      ]
    );
  };

  const handleEditList = (list) => {
    setSelectedList(list);
    setFormVisible(true);
  };

  const handlePressList = (list) => {
    navigation.navigate('ListDetail', { listId: list.id, listName: list.name });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const renderList = ({ item }) => (
    <ListCard
      list={item}
      onPress={handlePressList}
      onEdit={handleEditList}
      onArchive={handleArchiveList}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Aucune liste</Text>
      <Text style={styles.emptySubtext}>Créez une liste pour organiser vos cartes</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {board?.desc && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{board.desc}</Text>
        </View>
      )}

      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          lists?.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFormVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <ListForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setSelectedList(null);
        }}
        onSubmit={selectedList ? handleUpdateList : handleCreateList}
        initialData={selectedList}
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
