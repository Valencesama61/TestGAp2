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
import { useQuery } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { BOARDS_ENDPOINTS } from '../../../api/trello/endpoints';
import { useCreateList, useUpdateList, useArchiveList } from '../hooks/useListActions';
import ListCard from '../components/ListCard';
import ListForm from '../components/ListForm';

const ListScreen = ({ route, navigation }) => {
  const { boardId, boardName } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  // Récupération des listes du board
  const { data: lists, isLoading, error, refetch } = useQuery({
    queryKey: ['board-lists', boardId],
    queryFn: async () => {
      const response = await trelloClient.get(
        BOARDS_ENDPOINTS.getLists(boardId),
        {
          params: {
            cards: 'open',
            card_fields: 'name',
          },
        }
      );
      return response.data;
    },
    enabled: !!boardId,
  });

  // Mutations
  const createListMutation = useCreateList();
  const updateListMutation = useUpdateList();
  const archiveListMutation = useArchiveList();

  // Handlers
  const handleListPress = (list) => {
    navigation.navigate('CardsList', {
      listId: list.id,
      listName: list.name,
    });
  };

  const handleListLongPress = (list) => {
    Alert.alert(
      'Options',
      `Que voulez-vous faire avec "${list.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Modifier',
          onPress: () => openModalForEdit(list),
        },
        {
          text: 'Archiver',
          style: 'destructive',
          onPress: () => handleArchive(list),
        },
      ]
    );
  };

  const openModalForCreate = () => {
    setSelectedList(null);
    setModalVisible(true);
  };

  const openModalForEdit = (list) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedList(null);
  };

  const handleCreate = async (data) => {
    try {
      await createListMutation.mutateAsync(data);
      Alert.alert('Succès', 'Liste créée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la liste');
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateListMutation.mutateAsync(data);
      Alert.alert('Succès', 'Liste modifiée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la liste');
      throw error;
    }
  };

  const handleArchive = (list) => {
    Alert.alert(
      'Archiver la liste',
      `Êtes-vous sûr de vouloir archiver "${list.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Archiver',
          style: 'destructive',
          onPress: async () => {
            try {
              await archiveListMutation.mutateAsync({
                listId: list.id,
                boardId,
              });
              Alert.alert('Succès', 'Liste archivée avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'archiver la liste');
            }
          },
        },
      ]
    );
  };

  const renderListItem = ({ item }) => (
    <ListCard
      list={item}
      onPress={handleListPress}
      onLongPress={handleListLongPress}
      onEdit={openModalForEdit}
      onArchive={handleArchive}
    />
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
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{boardName}</Text>
        <Text style={styles.headerSubtitle}>
          {lists?.length || 0} liste(s)
        </Text>
      </View>

      {/* Liste des listes */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        contentContainerStyle={styles.listContainer}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune liste dans ce board</Text>
            <Text style={styles.emptySubtext}>
              Appuyez sur le bouton + pour créer une liste
            </Text>
          </View>
        }
      />

      {/* Bouton d'ajout */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openModalForCreate}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de création/édition */}
      <ListForm
        visible={modalVisible}
        boardId={boardId}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        initialData={selectedList}
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0079BF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#5E6C84',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#5E6C84',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8993A4',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});

export default ListScreen;
