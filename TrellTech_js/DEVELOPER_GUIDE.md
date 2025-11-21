# Guide du développeur - TrellTech

## Table des matières
1. [Architecture](#architecture)
2. [Comment utiliser les hooks](#comment-utiliser-les-hooks)
3. [Exemples d'utilisation](#exemples-dutilisation)
4. [Composants disponibles](#composants-disponibles)
5. [Bonnes pratiques](#bonnes-pratiques)

---

## Architecture

### Structure des features

Chaque feature suit cette structure :

```
src/features/{feature}/
├── components/       # Composants UI réutilisables
│   ├── {Feature}Card.jsx       # Affichage d'un item
│   └── {Feature}Form.jsx       # Formulaire création/édition
├── hooks/
│   ├── use{Feature}Actions.js  # Mutations (create, update, delete)
│   └── use{Feature}s.js        # Queries (get, list)
├── screens/
│   ├── {Feature}ListScreen.jsx # Liste des items
│   └── {Feature}DetailScreen.jsx # Détails d'un item
└── services/
    └── {feature}Service.js     # API calls
```

---

## Comment utiliser les hooks

### Pour les Lists

#### 1. Récupérer des données (Queries)

```javascript
import { useList, useListCards } from '../features/lists/hooks/useLists';

// Dans votre composant
const MyComponent = ({ listId }) => {
  // Récupérer une liste spécifique
  const { data: list, isLoading, error } = useList(listId);

  // Récupérer les cartes d'une liste
  const { data: cards } = useListCards(listId);

  return (
    // Votre JSX
  );
};
```

#### 2. Modifier des données (Mutations)

```javascript
import {
  useCreateList,
  useUpdateList,
  useArchiveList
} from '../features/lists/hooks/useListActions';

const MyComponent = ({ boardId }) => {
  const createListMutation = useCreateList();
  const updateListMutation = useUpdateList();
  const archiveListMutation = useArchiveList();

  const handleCreateList = async () => {
    try {
      await createListMutation.mutateAsync({
        boardId: boardId,
        name: 'Nouvelle liste'
      });
      alert('Liste créée !');
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleUpdateList = async (listId) => {
    try {
      await updateListMutation.mutateAsync({
        listId: listId,
        name: 'Nom modifié'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveList = async (listId) => {
    try {
      await archiveListMutation.mutateAsync({
        listId: listId,
        boardId: boardId
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // Votre JSX avec des boutons qui appellent ces handlers
  );
};
```

### Pour les Cards

#### 1. Récupérer des données (Queries)

```javascript
import { useCards, useCard } from '../features/cards/hooks/useCards';

const MyComponent = ({ listId, cardId }) => {
  // Récupérer toutes les cartes d'une liste
  const { data: cards, isLoading, refetch } = useCards(listId);

  // Récupérer une carte spécifique
  const { data: card } = useCard(cardId);

  return (
    // Votre JSX
  );
};
```

#### 2. Modifier des données (Mutations)

```javascript
import {
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
  useMoveCard
} from '../features/cards/hooks/useCardActions';

const MyComponent = ({ listId }) => {
  const createCardMutation = useCreateCard();
  const updateCardMutation = useUpdateCard();
  const deleteCardMutation = useDeleteCard();
  const moveCardMutation = useMoveCard();

  const handleCreateCard = async () => {
    try {
      await createCardMutation.mutateAsync({
        name: 'Nouvelle carte',
        desc: 'Description de la carte',
        idList: listId,
        pos: 'bottom' // Position
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCard = async (cardId) => {
    try {
      await updateCardMutation.mutateAsync({
        cardId: cardId,
        updates: {
          name: 'Nom modifié',
          desc: 'Nouvelle description'
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCardMutation.mutateAsync({
        cardId: cardId,
        listId: listId // Pour invalider le cache
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveCard = async (cardId, newListId) => {
    try {
      await moveCardMutation.mutateAsync({
        cardId: cardId,
        newListId: newListId,
        oldListId: listId
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // Votre JSX
  );
};
```

#### 3. Gestion des membres et labels

```javascript
import {
  useAssignMember,
  useRemoveMember,
  useAddLabel,
  useRemoveLabel
} from '../features/cards/hooks/useCardActions';

const CardMembersComponent = ({ cardId }) => {
  const assignMemberMutation = useAssignMember();
  const removeMemberMutation = useRemoveMember();

  const handleAssignMember = async (memberId) => {
    await assignMemberMutation.mutateAsync({
      cardId: cardId,
      memberId: memberId
    });
  };

  const handleRemoveMember = async (memberId) => {
    await removeMemberMutation.mutateAsync({
      cardId: cardId,
      memberId: memberId
    });
  };

  return (
    // Votre JSX
  );
};
```

---

## Exemples d'utilisation

### Exemple 1 : Créer une liste avec un formulaire

```javascript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useCreateList } from '../features/lists/hooks/useListActions';
import ListForm from '../features/lists/components/ListForm';

const MyBoardScreen = ({ boardId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const createListMutation = useCreateList();

  const handleCreate = async (data) => {
    try {
      await createListMutation.mutateAsync(data);
      alert('Liste créée avec succès');
    } catch (error) {
      alert('Erreur lors de la création');
      throw error; // Important : relancer l'erreur pour que le modal la gère
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Créer une liste</Text>
      </TouchableOpacity>

      <ListForm
        visible={modalVisible}
        boardId={boardId}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreate}
      />
    </View>
  );
};
```

### Exemple 2 : Afficher et gérer les cartes d'une liste

```javascript
import React from 'react';
import { FlatList, View, Alert } from 'react-native';
import { useCards, useDeleteCard } from '../features/cards/hooks/useCards';
import CardItem from '../features/cards/components/CardsItem';

const MyListScreen = ({ listId, navigation }) => {
  const { data: cards, isLoading } = useCards(listId);
  const deleteCardMutation = useDeleteCard();

  const handleCardPress = (card) => {
    navigation.navigate('CardDetail', {
      cardId: card.id,
      cardName: card.name
    });
  };

  const handleCardLongPress = (card) => {
    Alert.alert(
      'Supprimer la carte',
      `Voulez-vous supprimer "${card.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteCardMutation.mutateAsync({
              cardId: card.id,
              listId: listId
            });
          }
        }
      ]
    );
  };

  if (isLoading) return <Text>Chargement...</Text>;

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CardItem
          card={item}
          onPress={handleCardPress}
          onLongPress={handleCardLongPress}
        />
      )}
    />
  );
};
```

### Exemple 3 : Modal de création ET d'édition

```javascript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useCreateList, useUpdateList } from '../features/lists/hooks/useListActions';
import ListForm from '../features/lists/components/ListForm';

const MyComponent = ({ boardId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  const createListMutation = useCreateList();
  const updateListMutation = useUpdateList();

  const openForCreate = () => {
    setSelectedList(null);
    setModalVisible(true);
  };

  const openForEdit = (list) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  const handleCreate = async (data) => {
    await createListMutation.mutateAsync(data);
  };

  const handleUpdate = async (data) => {
    await updateListMutation.mutateAsync(data);
  };

  return (
    <View>
      <TouchableOpacity onPress={openForCreate}>
        <Text>Nouvelle liste</Text>
      </TouchableOpacity>

      <ListForm
        visible={modalVisible}
        boardId={boardId}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        initialData={selectedList} // null pour création, objet pour édition
      />
    </View>
  );
};
```

---

## Composants disponibles

### Lists

#### `ListForm`
Modal pour créer ou modifier une liste.

**Props :**
```typescript
{
  visible: boolean;           // Contrôle la visibilité du modal
  boardId: string;           // ID du board (requis pour création)
  onClose: () => void;       // Callback de fermeture
  onCreate: (data) => void;  // Callback de création
  onUpdate: (data) => void;  // Callback de modification
  initialData?: {            // Données pour l'édition (optionnel)
    id: string;
    name: string;
  };
}
```

#### `ListCard`
Composant d'affichage d'une liste.

**Props :**
```typescript
{
  list: {
    id: string;
    name: string;
    closed?: boolean;
    pos?: number;
    cards?: Array;
  };
  onPress: (list) => void;      // Callback au clic
  onLongPress?: (list) => void; // Callback au long press
  onEdit?: (list) => void;      // Callback pour éditer
  onArchive?: (list) => void;   // Callback pour archiver
}
```

### Cards

#### `CreateCardModal`
Modal pour créer une nouvelle carte.

**Props :**
```typescript
{
  visible: boolean;
  listId: string;
  onClose: () => void;
  onCreate: (cardData) => void;
}
```

#### `EditCardModal`
Modal pour modifier une carte existante.

**Props :**
```typescript
{
  visible: boolean;
  onClose: () => void;
  onUpdate: ({ cardId, updates }) => void;
  initialData: {
    id: string;
    name?: string;
    desc?: string;
  };
}
```

#### `CardList`
Composant de liste de cartes avec FlatList.

**Props :**
```typescript
{
  cards: Array;
  loading: boolean;
  error: object;
  onCardPress: (card) => void;
  onCardLongPress?: (card) => void;
  onRefresh?: () => void;
}
```

#### `CardsItem` (ou `CardItem`)
Composant d'affichage d'une carte individuelle.

**Props :**
```typescript
{
  card: {
    id: string;
    name: string;
    desc?: string;
    labels?: Array;
    idMembers?: Array;
    due?: string;
    badges?: object;
  };
  onPress: (card) => void;
  onLongPress?: (card) => void;
}
```

---

## Bonnes pratiques

### 1. Gestion des erreurs

Toujours gérer les erreurs dans les mutations :

```javascript
const handleAction = async () => {
  try {
    await mutation.mutateAsync(data);
    // Succès
    Alert.alert('Succès', 'Opération réussie');
  } catch (error) {
    // Erreur
    Alert.alert('Erreur', 'Une erreur est survenue');
    console.error(error);
  }
};
```

### 2. Invalidation du cache

React Query invalide automatiquement le cache grâce aux hooks. Pas besoin de le faire manuellement dans la plupart des cas.

### 3. Loading states

Utilisez les états `isLoading` et `error` fournis par les hooks :

```javascript
const { data, isLoading, error } = useCards(listId);

if (isLoading) return <ActivityIndicator />;
if (error) return <Text>Erreur: {error.message}</Text>;
if (!data || data.length === 0) return <Text>Aucune carte</Text>;

return <CardList cards={data} />;
```

### 4. Confirmation pour les actions destructives

Toujours demander confirmation avant une suppression ou archivage :

```javascript
const handleDelete = (item) => {
  Alert.alert(
    'Confirmation',
    `Voulez-vous vraiment supprimer "${item.name}" ?`,
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync({ id: item.id });
        }
      }
    ]
  );
};
```

### 5. Optimistic updates (avancé)

Pour une meilleure UX, vous pouvez implémenter des optimistic updates :

```javascript
const updateCardMutation = useUpdateCard({
  onMutate: async (variables) => {
    // Annuler les queries en cours
    await queryClient.cancelQueries(['cards', variables.listId]);

    // Snapshot de l'ancien état
    const previousCards = queryClient.getQueryData(['cards', variables.listId]);

    // Mise à jour optimiste
    queryClient.setQueryData(['cards', variables.listId], (old) => {
      return old.map(card =>
        card.id === variables.cardId
          ? { ...card, ...variables.updates }
          : card
      );
    });

    return { previousCards };
  },
  onError: (err, variables, context) => {
    // Rollback en cas d'erreur
    queryClient.setQueryData(
      ['cards', variables.listId],
      context.previousCards
    );
  },
});
```

### 6. Réutilisabilité

Créez des composants réutilisables et utilisez les composants existants plutôt que de dupliquer le code.

### 7. Navigation

Utilisez `navigation.navigate()` pour naviguer entre les écrans :

```javascript
const handlePress = (item) => {
  navigation.navigate('ScreenName', {
    paramName: item.id,
    // autres params
  });
};
```

---

## Support et contribution

Pour toute question ou amélioration, consultez :
- `IMPLEMENTATION_SUMMARY.md` pour une vue d'ensemble
- Le code source dans `src/features/`
- Les exemples dans ce guide

Bonne programmation ! 🚀
