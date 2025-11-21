import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { BOARDS_ENDPOINTS } from '../../../api/trello/endpoints';

const BoardDetailScreen = ({ route, navigation }) => {
  const { boardId, boardName } = route.params;

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

  const handleListPress = (list) => {
    navigation.navigate('CardsList', {
      listId: list.id,
      listName: list.name,
    });
  };

  const renderList = ({ item: list }) => (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.listName}>{list.name}</Text>
        <Text style={styles.cardCount}>{list.cards?.length || 0} carte(s)</Text>
      </View>
      
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
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listsContainer}
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
    marginBottom: 12,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
  },
  cardCount: {
    fontSize: 12,
    color: '#5E6C84',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
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
});

export default BoardDetailScreen;