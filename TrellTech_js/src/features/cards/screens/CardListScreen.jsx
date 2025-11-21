
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useCards, useCreateCard, useDeleteCard } from '../hooks/useCards';
import CardList from '../components/CardList';
import CreateCardModal from '../components/CreateCardModal';

const CardsListScreen = ({ route, navigation }) => {
  const listId = route?.params?.listId || 'default-list';
  const listName = route?.params?.listName || 'Ma Liste';

  // State pour le modal
  const [modalVisible, setModalVisible] = useState(false);

  // Hooks React Query
  const { data: cards, isLoading, error, refetch } = useCards(listId);
  const createCardMutation = useCreateCard();
  const deleteCardMutation = useDeleteCard();

  /**
   * Gérer le clic sur une carte
   */
  const handleCardPress = (card) => {
    navigation.navigate('CardDetail', { 
      cardId: card.id,
      cardName: card.name 
    });
  };

  /**
   * Gérer le long press (suppression)
   */
  const handleCardLongPress = (card) => {
    Alert.alert(
      'Supprimer la carte',
      `Êtes-vous sûr de vouloir supprimer "${card.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => handleDeleteCard(card.id),
        },
      ]
    );
  };

  /**
   * Supprimer une carte
   */
  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCardMutation.mutateAsync({ cardId, listId });
      Alert.alert('Succès', 'Carte supprimée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer la carte');
    }
  };

  /**
   * Créer une nouvelle carte
   */
  const handleCreateCard = async (cardData) => {
    try {
      await createCardMutation.mutateAsync(cardData);
      Alert.alert('Succès', 'Carte créée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la carte');
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header avec le nom de la liste */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{listName}</Text>
        <Text style={styles.headerSubtitle}>
          {cards?.length || 0} carte(s)
        </Text>
      </View>

      {/* Liste des cartes */}
      <CardList
        cards={cards}
        loading={isLoading}
        error={error}
        onCardPress={handleCardPress}
        onCardLongPress={handleCardLongPress}
        onRefresh={refetch}
      />

      {/* Bouton flottant pour ajouter une carte */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de création */}
      <CreateCardModal
        visible={modalVisible}
        listId={listId}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
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

export default CardsListScreen;


