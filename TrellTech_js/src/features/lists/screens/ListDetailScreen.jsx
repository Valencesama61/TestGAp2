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
import { useList, useListCards } from '../hooks/useLists';
import { useCardActions } from '../../cards/hooks/useCardActions';
import CardsItem from '../../cards/components/CardsItem';
import CreateCardModal from '../../cards/components/CreateCardModal';

export default function ListDetailScreen({ route, navigation }) {
  const { listId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const { data: list, isLoading: listLoading } = useList(listId);
  const { data: cards, isLoading: cardsLoading, refetch } = useListCards(listId);
  const { createCard, deleteCard, isCreating, isDeleting } = useCardActions();

  const isLoading = listLoading || cardsLoading;

  const handleCreateCard = async (cardData) => {
    try {
      await createCard({ ...cardData, idList: listId });
      setModalVisible(false);
      Alert.alert('Succès', 'Carte créée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la carte');
    }
  };

  const handleDeleteCard = (card) => {
    Alert.alert(
      'Supprimer la carte',
      `Supprimer "${card.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCard(card.id);
              Alert.alert('Succès', 'Carte supprimée');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la carte');
            }
          },
        },
      ]
    );
  };

  const handlePressCard = (card) => {
    navigation.navigate('CardDetail', { cardId: card.id, cardName: card.name });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const renderCard = ({ item }) => (
    <CardsItem
      card={item}
      onPress={() => handlePressCard(item)}
      onDelete={() => handleDeleteCard(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="card-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Aucune carte</Text>
      <Text style={styles.emptySubtext}>Ajoutez des cartes à cette liste</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          cards?.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmpty}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <CreateCardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateCard}
        isLoading={isCreating}
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
