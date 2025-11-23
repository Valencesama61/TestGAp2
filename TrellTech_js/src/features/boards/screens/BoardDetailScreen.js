import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { useBoardLists } from '../hooks/useBoards';
import { useCreateList, useUpdateList, useDeleteList } from '../../lists/hooks/useListActions';
const screenWidth = Dimensions.get('screen').width;
const BoardDetailScreen = ({ route, navigation }) => {
  const { boardId, boardName } = route.params;
  
  // Fetch des listes du board
  const { data: lists, isLoading, error } = useBoardLists(boardId);
  
  // Mutations pour les listes
  const createList = useCreateList();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();

  // State pour le modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState('create'); 
  const [listName, setListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);

  // Ouvrir le modal de création
  const openCreateModal = () => {
    setModalAction('create');
    setListName('');
    setSelectedList(null);
    setModalVisible(true);
  };

  // Ouvrir le modal de modification
  const openUpdateModal = (list) => {
    setModalAction('update');
    setListName(list.name);
    setSelectedList(list);
    setModalVisible(true);
  };

  // Valider création/mise à jour
  const handleValidateModal = () => {
    if (!listName.trim()) return;

    if (modalAction === 'create') {
      createList.mutate({ boardId, name: listName.trim() });
    } else if (modalAction === 'update' && selectedList) {
      updateList.mutate({
        listId: selectedList.id,
        name: listName.trim(),
      });
    }

    setModalVisible(false);
  };

  // Supprimer une liste
  const handleDeleteList = (list) => {
    Alert.alert(
      'Archive list',
      `Archive "${list.name}" ?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => deleteList.mutate({ 
            listId: list.id, 
            boardId: boardId 
          }),
        },
      ]
    );
  };

  // Naviguer vers les cartes de la liste
  const handleListPress = (list) => {
    navigation.navigate('CardsList', {
      listId: list.id,
      listName: list.name,
      boardId: boardId,
    });
  };

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

  // Render item pour FlatList
  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.listContent}
        onPress={() => handleListPress(item)}
      >
        <View style={styles.listIcon}>
          <Text style={styles.listIconText}>📋</Text>
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listPosition}>Position: {Math.round(item.pos)}</Text>
        </View>
      </TouchableOpacity>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openUpdateModal(item)}
        >
          <Text style={styles.actionButtonText}>edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteList(item)}
        >
          <Text style={[styles.actionButtonText, { color: '#EB5A46' }]}>delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lists - {boardName}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openCreateModal}
        >
          <Text style={styles.addButtonText}>+ New list</Text>
        </TouchableOpacity>
        <Text style={styles.headerSubtitle}>
          {lists?.length || 0} list(s)
        </Text>
      </View>

      {/* Liste des listes */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal pour créer/modifier */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalAction === 'create' 
                ? 'Create a list' 
                : 'Update a list'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="List Name"
              value={listName}
              onChangeText={setListName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleValidateModal}
                disabled={!listName.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {modalAction === 'create' ? 'Create' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { color: '#EB5A46', fontSize: 16 },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#172B4D' },
  headerSubtitle: { fontSize: 14, color: '#5E6C84', marginTop: 4 },
  addButton: {
    backgroundColor: '#0079BF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  listContainer: { padding: 16 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  listContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#61BD4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listIconText: { fontSize: 16 },
  listInfo: { flex: 1 },
  listName: { fontSize: 16, fontWeight: '600', color: '#172B4D' },
  listPosition: { fontSize: 12, color: '#5E6C84' },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: screenWidth < 760 ? '80%' : '50%',
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    width: '45%',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F4F5F7',
  },
  cancelButtonText: {
    color: '#172B4D',
  },
  saveButton: {
    backgroundColor: '#0079BF',
  },
  saveButtonText: {
    color: '#fff',
  },
});

export default BoardDetailScreen;