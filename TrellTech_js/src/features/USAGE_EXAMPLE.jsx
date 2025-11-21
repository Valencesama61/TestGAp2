/**
 * EXEMPLE D'UTILISATION COMPLÈTE
 *
 * Ce fichier montre comment utiliser les hooks et services
 * pour les Lists et Cards dans une application réelle.
 *
 * ⚠️ Ce fichier est à titre d'exemple uniquement, ne pas l'importer dans l'app
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

// Import simplifié grâce aux fichiers index.js
import {
  useCreateList,
  useUpdateList,
  useDeleteList,
  useArchiveList,
} from './lists/hooks';

import {
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
  useMoveCard,
  useAssignMember,
  useAddLabel,
} from './cards/hooks';

/**
 * Exemple 1: Gestion de listes
 */
const ListManagerExample = ({ boardId }) => {
  const [listName, setListName] = useState('');

  // Hooks pour les opérations CRUD sur les listes
  const { mutate: createList, isLoading: isCreating } = useCreateList();
  const { mutate: updateList } = useUpdateList();
  const { mutate: deleteList } = useDeleteList();
  const { mutate: archiveList } = useArchiveList();

  const handleCreateList = () => {
    if (!listName.trim()) return;

    createList(
      { boardId, name: listName },
      {
        onSuccess: (newList) => {
          console.log('Liste créée:', newList);
          setListName(''); // Reset le champ
        },
        onError: (error) => {
          console.error('Erreur création:', error);
          alert('Erreur lors de la création de la liste');
        }
      }
    );
  };

  const handleUpdateList = (listId, newName) => {
    updateList(
      { listId, name: newName },
      {
        onSuccess: () => {
          console.log('Liste mise à jour');
        }
      }
    );
  };

  const handleDeleteList = (listId) => {
    if (confirm('Voulez-vous vraiment supprimer cette liste ?')) {
      deleteList(
        { listId, boardId },
        {
          onSuccess: () => {
            console.log('Liste supprimée');
          }
        }
      );
    }
  };

  const handleArchiveList = (listId) => {
    archiveList({ listId, boardId });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Gestion des listes</Text>

      <TextInput
        value={listName}
        onChangeText={setListName}
        placeholder="Nom de la liste"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TouchableOpacity
        onPress={handleCreateList}
        disabled={isCreating}
        style={{ backgroundColor: '#0079BF', padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isCreating ? 'Création...' : 'Créer une liste'}
        </Text>
      </TouchableOpacity>

      {/* Les boutons update, delete, archive seraient sur chaque liste */}
    </View>
  );
};

/**
 * Exemple 2: Gestion de cartes complète
 */
const CardManagerExample = ({ listId }) => {
  const [cardData, setCardData] = useState({
    name: '',
    desc: '',
  });

  // Hooks pour les opérations CRUD sur les cartes
  const { mutate: createCard, isLoading: isCreating } = useCreateCard();
  const { mutate: updateCard } = useUpdateCard();
  const { mutate: deleteCard } = useDeleteCard();
  const { mutate: moveCard } = useMoveCard();

  // Hooks pour les opérations avancées
  const { mutate: assignMember } = useAssignMember();
  const { mutate: addLabel } = useAddLabel();

  const handleCreateCard = () => {
    if (!cardData.name.trim()) return;

    createCard(
      {
        name: cardData.name,
        desc: cardData.desc,
        idList: listId,
        pos: 'bottom',
      },
      {
        onSuccess: (newCard) => {
          console.log('Carte créée:', newCard);
          setCardData({ name: '', desc: '' });
        },
        onError: (error) => {
          console.error('Erreur création carte:', error);
          alert('Erreur lors de la création de la carte');
        }
      }
    );
  };

  const handleUpdateCard = (cardId, updates) => {
    updateCard(
      { cardId, updates },
      {
        onSuccess: (updatedCard) => {
          console.log('Carte mise à jour:', updatedCard);
        }
      }
    );
  };

  const handleDeleteCard = (cardId) => {
    if (confirm('Supprimer cette carte ?')) {
      deleteCard({ cardId, listId });
    }
  };

  const handleMoveCard = (cardId, targetListId) => {
    moveCard({
      cardId,
      newListId: targetListId,
      oldListId: listId,
    });
  };

  const handleAssignMember = (cardId, memberId) => {
    assignMember(
      { cardId, memberId },
      {
        onSuccess: () => {
          console.log('Membre assigné');
        }
      }
    );
  };

  const handleAddLabel = (cardId, labelId) => {
    addLabel({ cardId, labelId });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Gestion des cartes</Text>

      <TextInput
        value={cardData.name}
        onChangeText={(text) => setCardData({ ...cardData, name: text })}
        placeholder="Nom de la carte *"
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />

      <TextInput
        value={cardData.desc}
        onChangeText={(text) => setCardData({ ...cardData, desc: text })}
        placeholder="Description (optionnelle)"
        multiline
        numberOfLines={3}
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />

      <TouchableOpacity
        onPress={handleCreateCard}
        disabled={isCreating}
        style={{ backgroundColor: '#0079BF', padding: 12, borderRadius: 8, marginTop: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isCreating ? 'Création...' : 'Créer une carte'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Exemple 3: Board complet avec listes et cartes
 */
const BoardViewExample = ({ boardId }) => {
  const [selectedListId, setSelectedListId] = useState(null);

  // Hook pour créer des listes
  const { mutate: createList } = useCreateList();

  // Hook pour créer des cartes
  const { mutate: createCard } = useCreateCard();

  const handleQuickCreateList = (name) => {
    createList(
      { boardId, name },
      {
        onSuccess: (newList) => {
          setSelectedListId(newList.id);
        }
      }
    );
  };

  const handleQuickCreateCard = (listId, name) => {
    createCard({
      name,
      idList: listId,
      desc: '',
      pos: 'bottom',
    });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Board View</Text>

        {/* Boutons rapides */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => handleQuickCreateList('To Do')}
            style={{ backgroundColor: '#61BD4F', padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: 'white' }}>+ To Do</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickCreateList('In Progress')}
            style={{ backgroundColor: '#F2D600', padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: '#172B4D' }}>+ In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickCreateList('Done')}
            style={{ backgroundColor: '#0079BF', padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: 'white' }}>+ Done</Text>
          </TouchableOpacity>
        </View>

        {/* Ici, vous afficheriez vos listes et cartes */}
        <Text style={{ marginTop: 20, fontStyle: 'italic' }}>
          Les listes et cartes s'afficheraient ici...
        </Text>
      </View>
    </ScrollView>
  );
};

/**
 * Exemple 4: Utilisation avec le modal CreateCardModal
 */
const CardModalExample = ({ listId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { mutate: createCard } = useCreateCard();

  // Import du composant modal
  const CreateCardModal = require('./cards/components/CreateCardModal').default;

  const handleCreateCard = (cardData) => {
    createCard(cardData, {
      onSuccess: () => {
        console.log('Carte créée avec succès');
      },
      onError: (error) => {
        console.error('Erreur:', error);
      }
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: '#0079BF', padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: 'white' }}>+ Ajouter une carte</Text>
      </TouchableOpacity>

      <CreateCardModal
        visible={modalVisible}
        listId={listId}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCard}
      />
    </View>
  );
};

/**
 * Exemple 5: Gestion d'erreurs et loading states
 */
const AdvancedExample = ({ boardId }) => {
  const {
    mutate: createList,
    isLoading,
    isError,
    error,
    isSuccess
  } = useCreateList();

  const handleCreate = (name) => {
    createList(
      { boardId, name },
      {
        onSuccess: (data) => {
          console.log('Succès:', data);
          // Afficher un toast de succès
        },
        onError: (err) => {
          console.error('Erreur:', err);
          // Afficher un toast d'erreur
        },
        onSettled: () => {
          console.log('Requête terminée (succès ou erreur)');
        }
      }
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleCreate('Ma liste')}
        disabled={isLoading}
      >
        <Text>
          {isLoading && 'Création en cours...'}
          {isError && `Erreur: ${error.message}`}
          {isSuccess && 'Liste créée !'}
          {!isLoading && !isError && !isSuccess && 'Créer une liste'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * RÉSUMÉ DES BONNES PRATIQUES
 *
 * 1. ✅ Toujours utiliser les hooks au lieu d'appeler directement les services
 * 2. ✅ Gérer les états de loading pour désactiver les boutons
 * 3. ✅ Utiliser onSuccess/onError pour les callbacks
 * 4. ✅ Invalider les queries automatiquement (fait par les hooks)
 * 5. ✅ Valider les inputs avant de faire la mutation
 * 6. ✅ Donner du feedback utilisateur (loading, success, error)
 * 7. ✅ Utiliser les imports centralisés via index.js
 * 8. ✅ Nettoyer les formulaires après succès
 */

export {
  ListManagerExample,
  CardManagerExample,
  BoardViewExample,
  CardModalExample,
  AdvancedExample,
};
