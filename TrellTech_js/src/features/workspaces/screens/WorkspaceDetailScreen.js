import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { WORKSPACES_ENDPOINTS } from '../../../api/trello/endpoints';

const WorkspaceDetailScreen = ({ route, navigation }) => {
  const { workspaceId, workspaceName } = route.params;

  const { data: boards, isLoading, error } = useQuery({
    queryKey: ['workspace-boards', workspaceId],
    queryFn: async () => {
      const response = await trelloClient.get(
        WORKSPACES_ENDPOINTS.getBoards(workspaceId)
      );
      return response.data;
    },
    enabled: !!workspaceId,
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
      <View style={[styles.boardColor, { backgroundColor: item.prefs?.backgroundColor || '#0079BF' }]} />
      <View style={styles.boardInfo}>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.boardDescription}>
          {item.desc || 'Aucune description'}
        </Text>
        <Text style={styles.boardMeta}>
          {item.closed ? 'Archivé' : 'Actif'} • Dernière activité: {new Date(item.dateLastActivity).toLocaleDateString()}
        </Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{workspaceName}</Text>
        <Text style={styles.headerSubtitle}>
          {boards?.length || 0} tableau(x)
        </Text>
      </View>

      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={renderBoardItem}
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
    fontSize: 20,
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
  boardItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  boardColor: {
    height: 4,
    width: '100%',
  },
  boardInfo: {
    padding: 16,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 8,
  },
  boardDescription: {
    fontSize: 14,
    color: '#5E6C84',
    marginBottom: 8,
    lineHeight: 18,
  },
  boardMeta: {
    fontSize: 12,
    color: '#8993A4',
  },
});

export default WorkspaceDetailScreen;