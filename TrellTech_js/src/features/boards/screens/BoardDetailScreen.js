import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { BOARDS_ENDPOINTS } from '../../../api/trello/endpoints';
import boardService from '../services/boardService';
import listService from '../../lists/services/listService';
import BoardFormModal from '../components/BoardFormModal';
import ListFormModal from '../../lists/components/ListFormModal';

const BoardDetailScreen = ({ route, navigation }) => {
  const { boardId, boardName } = route.params;
  const [editBoardModalVisible, setEditBoardModalVisible] = useState(false);
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [editListModalVisible, setEditListModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const queryClient = useQueryClient();

  const { data: lists, isLoading, error } = useQuery({
    queryKey: ['board-lists', boardId],
    queryFn: async () => {
      const response = await trelloClient.get(
        BOARDS_ENDPOINTS.getLists(boardId),
        {
          params: {
            cards: 'open',
            card_fields: 'name,idMembers,due,labels,cover',
          },
        }
      );
      return response.data;
    },
    enabled: !!boardId,
  });

  const { data: board } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      return await boardService.getBoardById(boardId);
    },
    enabled: !!boardId,
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, updates }) => boardService.updateBoard(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['board', boardId]);
      queryClient.invalidateQueries(['boards']);
      Alert.alert('Succès', 'Board modifié avec succès');
    },
    onError: (error) => {
      Alert.alert('Erreur', 'Impossible de modifier le board');
      console.error(error);
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id) => boardService.deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
      Alert.alert('Succès', 'Board supprimé avec succès');
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Erreur', 'Impossible de supprimer le board');
      console.error(error);
    },
  });

  const createListMutation = useMutation({
    mutationFn: ({ boardId, name }) => listService.createList(boardId, name),
    onSuccess: () => {
      queryClient.invalidateQueries(['board-lists', boardId]);
      Alert.alert('Succès', 'Liste créée avec succès');
    },
    onError: (error) => {
      Alert.alert('Erreur', 'Impossible de créer la liste');
      console.error(error);
    },
  });

  const updateListMutation = useMutation({
    mutationFn: ({ listId, name }) => listService.updateList(listId, name),
    onSuccess: () => {
      queryClient.invalidateQueries(['board-lists', boardId]);
      Alert.alert('Succès', 'Liste modifiée avec succès');
    },
    onError: (error) => {
      Alert.alert('Erreur', 'Impossible de modifier la liste');
      console.error(error);
    },
  });

  const archiveListMutation = useMutation({
    mutationFn: (listId) => listService.archiveList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries(['board-lists', boardId]);
      Alert.alert('Succès', 'Liste archivée avec succès');
    },
    onError: (error) => {
      Alert.alert('Erreur', 'Impossible d\'archiver la liste');
      console.error(error);
    },
  });

  const handleListPress = (list) => {
    navigation.navigate('CardsList', {
      listId: list.id,
      listName: list.name,
    });
  };

  const handleUpdateBoard = async (id, updates) => {
    await updateBoardMutation.mutateAsync({ id, updates });
  };

  const handleDeleteBoard = () => {
    Alert.alert(
      'Supprimer le board',
      `Êtes-vous sûr de vouloir supprimer "${boardName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteBoardMutation.mutate(boardId),
        },
      ]
    );
  };

  const handleCreateList = async (boardId, name) => {
    await createListMutation.mutateAsync({ boardId, name });
  };

  const handleUpdateList = async (listId, name) => {
    await updateListMutation.mutateAsync({ listId, name });
  };

  const handleEditList = (list) => {
    setSelectedList(list);
    setEditListModalVisible(true);
  };

  const handleArchiveList = (list) => {
    Alert.alert(
      'Archiver la liste',
      `Êtes-vous sûr de vouloir archiver "${list.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Archiver',
          style: 'destructive',
          onPress: () => archiveListMutation.mutate(list.id),
        },
      ]
    );
  };

  const renderList = ({ item: list }) => (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.listName}>{list.name}</Text>
        <View style={styles.listActions}>
          <TouchableOpacity
            onPress={() => handleEditList(list)}
            style={styles.listActionButton}
          >
            <Text style={styles.listActionText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleArchiveList(list)}
            style={styles.listActionButton}
          >
            <Text style={styles.listActionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cardCount}>{list.cards?.length || 0} carte(s)</Text>
      
      <ScrollView style={styles.cardsContainer}>
        {list.cards?.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardItem}
            onPress={() => navigation.navigate('CardDetail', { 
              cardId: card.id,
              cardName: card.name 
            })}
          >
            {card.cover && card.cover.backgroundColor && (
              <View style={[styles.cardCover, { backgroundColor: card.cover.backgroundColor }]} />
            )}
            
            <Text style={styles.cardName}>{card.name}</Text>
            
            {card.labels && card.labels.length > 0 && (
              <View style={styles.labelsContainer}>
                {card.labels.slice(0, 3).map((label) => (
                  <View
                    key={label.id}
                    style={[
                      styles.label,
                      { backgroundColor: label.color || '#ccc' },
                    ]}
                  />
                ))}
              </View>
            )}
            
            <View style={styles.cardFooter}>
              {card.due && (
                <Text style={styles.dueDate}>
                  📅 {new Date(card.due).toLocaleDateString()}
                </Text>
              )}
              {card.idMembers && card.idMembers.length > 0 && (
                <Text style={styles.membersCount}>
                  👥 {card.idMembers.length}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => handleListPress(list)}
        >
          <Text style={styles.addCardText}>+ Ajouter une carte</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{boardName}</Text>
        <Text style={styles.headerSubtitle}>
          {lists?.length || 0} liste(s)
        </Text>

        {/* Boutons d'action pour le board */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.createListButton]}
            onPress={() => setCreateListModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>+ Liste</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => setEditBoardModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteBoard}
          >
            <Text style={styles.actionButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listsContainer}
      />

      {/* Modal de modification du board */}
      <BoardFormModal
        visible={editBoardModalVisible}
        onClose={() => setEditBoardModalVisible(false)}
        onUpdate={handleUpdateBoard}
        board={board}
      />

      {/* Modal de création de liste */}
      <ListFormModal
        visible={createListModalVisible}
        onClose={() => setCreateListModalVisible(false)}
        onCreate={handleCreateList}
        boardId={boardId}
      />

      {/* Modal de modification de liste */}
      <ListFormModal
        visible={editListModalVisible}
        onClose={() => {
          setEditListModalVisible(false);
          setSelectedList(null);
        }}
        onUpdate={handleUpdateList}
        list={selectedList}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5E6C84',
    marginTop: 4,
  },
  listsContainer: {
    padding: 16,
  },
  listContainer: {
    width: 300,
    backgroundColor: '#EBECF0',
    borderRadius: 8,
    marginRight: 16,
    padding: 12,
    maxHeight: '80%',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    flex: 1,
  },
  listActions: {
    flexDirection: 'row',
    gap: 4,
  },
  listActionButton: {
    padding: 4,
  },
  listActionText: {
    fontSize: 16,
  },
  cardCount: {
    fontSize: 12,
    color: '#5E6C84',
    marginBottom: 12,
  },
  cardsContainer: {
    flex: 1,
  },
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardCover: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    color: '#172B4D',
    marginBottom: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 4,
  },
  label: {
    height: 8,
    width: 40,
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 11,
    color: '#5E6C84',
  },
  membersCount: {
    fontSize: 11,
    color: '#5E6C84',
  },
  addCardButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addCardText: {
    color: '#5E6C84',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  createListButton: {
    backgroundColor: '#61BD4F',
  },
  editButton: {
    backgroundColor: '#0079BF',
  },
  deleteButton: {
    backgroundColor: '#EB5A46',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default BoardDetailScreen;