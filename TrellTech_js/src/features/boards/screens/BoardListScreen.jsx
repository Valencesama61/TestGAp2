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
import { useBoards } from '../hooks/useBoards';

export default function BoardListScreen({ navigation }) {
  const { data: boards, isLoading, error, refetch } = useBoards();

  const renderBoard = ({ item }) => (
    <TouchableOpacity
      style={styles.boardCard}
      onPress={() => navigation.navigate('BoardDetail', { boardId: item.id, boardName: item.name })}
    >
      <View style={[styles.boardColor, { backgroundColor: item.prefs?.backgroundColor || '#0079BF' }]} />
      <View style={styles.boardInfo}>
        <Text style={styles.boardName}>{item.name}</Text>
        {item.desc && <Text style={styles.boardDesc} numberOfLines={2}>{item.desc}</Text>}
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
        data={boards}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="grid-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun board trouvé</Text>
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
  boardCard: {
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
  boardColor: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  boardInfo: {
    flex: 1,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 4,
  },
  boardDesc: {
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
