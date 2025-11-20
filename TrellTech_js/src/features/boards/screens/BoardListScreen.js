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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { BOARDS_ENDPOINTS } from '../../../api/trello/endpoints';
import boardService from '../services/boardService';
import BoardFormModal from '../components/BoardFormModal';

const BoardListScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: boards, isLoading, error } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const response = await trelloClient.get(BOARDS_ENDPOINTS.getAll, {
        params: {
          fields: 'name,desc,closed,prefs,dateLastActivity',
        },
      });
      return response.data.filter(board => !board.closed);
    },
  });

  const createBoardMutation = useMutation({
    mutationFn: ({ name, desc }) => boardService.createBoard(name, desc),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
      Alert.alert('Succès', 'Board créé avec succès');
    },
    onError: (error) => {
      Alert.alert('Erreur', 'Impossible de créer le board');
      console.error(error);
    },
  });

  const handleBoardPress = (board) => {
    navigation.navigate('BoardDetail', {
      boardId: board.id,
      boardName: board.name,
    });
  };

  const renderBoardItem = ({ item }) => (
    <TouchableOpacity
      style={styles.boardItem}
      onPress={() => handleBoardPress(item)}
    >
      <View style={[styles.boardHeader, { backgroundColor: item.prefs?.backgroundColor || '#0079BF' }]}>
        <Text style={styles.boardName}>{item.name}</Text>
      </View>
      <View style={styles.boardContent}>
        <Text style={styles.boardDescription} numberOfLines={2}>
          {item.desc || 'Aucune description'}
        </Text>
        <View style={styles.boardFooter}>
          <Text style={styles.boardDate}>
            Modifié: {new Date(item.dateLastActivity).toLocaleDateString()}
          </Text>
        </View>
      </View>
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
      </View>
    );
  }

  const handleCreateBoard = async (name, description) => {
    await createBoardMutation.mutateAsync({ name, desc: description });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableaux</Text>
        <Text style={styles.headerSubtitle}>
          {boards?.length || 0} tableau(x) actif(s)
        </Text>
      </View>

      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={renderBoardItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />

      {/* Bouton flottant pour créer un board */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de création */}
      <BoardFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateBoard}
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
    padding: 8,
  },
  boardItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    maxWidth: '46%',
  },
  boardHeader: {
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  boardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  boardContent: {
    padding: 12,
  },
  boardDescription: {
    fontSize: 12,
    color: '#5E6C84',
    marginBottom: 8,
    lineHeight: 16,
  },
  boardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F4F5F7',
    paddingTop: 8,
  },
  boardDate: {
    fontSize: 10,
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

export default BoardListScreen;