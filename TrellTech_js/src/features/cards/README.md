# Cards Feature

Gestion complète des cartes (Cards) dans TrellTech avec support des membres, labels, et opérations avancées.

## 📁 Structure

```
cards/
├── components/       # Composants UI
│   ├── CardList.jsx
│   ├── CardsItem.jsx
│   └── CreateCardModal.jsx
├── hooks/           # Hooks React Query
│   ├── index.js     # Export centralisé
│   ├── useCardActions.js  # Mutations CRUD
│   └── useCards.js        # Queries
├── screens/         # Écrans
│   ├── CardDetailScreen.jsx
│   └── CardListScreen.jsx
└── services/        # Services API
    ├── index.js     # Export centralisé
    └── cardService.js
```

## 🎯 Utilisation

### Import des hooks

```javascript
import {
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
  useMoveCard,
  useAssignMember,
  useRemoveMember,
  useAddLabel,
  useRemoveLabel,
  useCards
} from '@features/cards/hooks';
```

### Créer une carte

```javascript
const CreateCardExample = ({ listId }) => {
  const { mutate: createCard, isLoading } = useCreateCard();

  const handleCreate = () => {
    createCard({
      name: 'Ma nouvelle tâche',
      desc: 'Description détaillée',
      idList: listId,
      pos: 'bottom',  // 'top', 'bottom', ou un nombre
      due: '2024-12-31T23:59:59Z'  // Date d'échéance (optionnel)
    });
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      Créer une carte
    </button>
  );
};
```

### Mettre à jour une carte

```javascript
const EditCardExample = ({ cardId }) => {
  const { mutate: updateCard } = useUpdateCard();

  const handleUpdate = () => {
    updateCard({
      cardId,
      updates: {
        name: 'Nom mis à jour',
        desc: 'Description mise à jour',
        due: '2024-12-31T23:59:59Z',
        dueComplete: false
      }
    });
  };

  return <button onClick={handleUpdate}>Mettre à jour</button>;
};
```

### Supprimer une carte

```javascript
const DeleteCardButton = ({ cardId, listId }) => {
  const { mutate: deleteCard, isLoading } = useDeleteCard();

  const handleDelete = () => {
    if (confirm('Supprimer cette carte ?')) {
      deleteCard({ cardId, listId });
    }
  };

  return <button onClick={handleDelete}>Supprimer</button>;
};
```

### Déplacer une carte

```javascript
const MoveCardExample = ({ cardId, currentListId, targetListId }) => {
  const { mutate: moveCard } = useMoveCard();

  const handleMove = () => {
    moveCard({
      cardId,
      newListId: targetListId,
      oldListId: currentListId
    });
  };

  return <button onClick={handleMove}>Déplacer</button>;
};
```

### Gérer les membres

```javascript
const CardMembersExample = ({ cardId }) => {
  const { mutate: assignMember } = useAssignMember();
  const { mutate: removeMember } = useRemoveMember();

  const handleAssign = (memberId) => {
    assignMember({ cardId, memberId });
  };

  const handleRemove = (memberId) => {
    removeMember({ cardId, memberId });
  };

  return (
    <div>
      <button onClick={() => handleAssign('member-123')}>
        Assigner membre
      </button>
      <button onClick={() => handleRemove('member-123')}>
        Retirer membre
      </button>
    </div>
  );
};
```

### Gérer les labels

```javascript
const CardLabelsExample = ({ cardId }) => {
  const { mutate: addLabel } = useAddLabel();
  const { mutate: removeLabel } = useRemoveLabel();

  return (
    <div>
      <button onClick={() => addLabel({ cardId, labelId: 'label-red' })}>
        Ajouter label
      </button>
      <button onClick={() => removeLabel({ cardId, labelId: 'label-red' })}>
        Retirer label
      </button>
    </div>
  );
};
```

## 🔧 API Service

Le service `cardService` expose de nombreuses méthodes:

```javascript
import { cardService } from '@features/cards/services';

// Opérations de base
const cards = await cardService.getCardsByList('list-id');
const card = await cardService.getCardById('card-id');
const newCard = await cardService.createCard({
  name: 'Tâche',
  idList: 'list-id',
  desc: 'Description'
});
const updated = await cardService.updateCard('card-id', { name: 'Nouveau' });
await cardService.deleteCard('card-id');

// Déplacement
const moved = await cardService.moveCard('card-id', 'new-list-id');

// Membres
await cardService.addMemberToCard('card-id', 'member-id');
await cardService.removeMemberFromCard('card-id', 'member-id');
const members = await cardService.getCardMembers('card-id');

// Labels
await cardService.addLabelToCard('card-id', 'label-id');
await cardService.removeLabelFromCard('card-id', 'label-id');
```

## 🎨 Composants disponibles

### CreateCardModal
Modal pour créer une nouvelle carte avec nom et description.

**Props:**
- `visible` (boolean) - Afficher/masquer le modal
- `listId` (string) - ID de la liste
- `onClose` (function) - Callback de fermeture
- `onCreate` (function) - Callback de création

**Exemple:**
```javascript
const [modalVisible, setModalVisible] = useState(false);
const { mutate: createCard } = useCreateCard();

<CreateCardModal
  visible={modalVisible}
  listId={listId}
  onClose={() => setModalVisible(false)}
  onCreate={(cardData) => createCard(cardData)}
/>
```

### CardList
Affiche une liste de cartes.

### CardsItem
Affiche une carte individuelle.

## ⚡ React Query Cache

Les hooks invalident automatiquement les queries suivantes:

- `['card', cardId]` - Détails d'une carte
- `['cards', listId]` - Toutes les cartes d'une liste
- `['board-lists', boardId]` - Listes du board (pour création)

## 🚀 Fonctionnalités avancées disponibles

Le `cardService` supporte également:

- **Comments**: Via les endpoints CARDS_ENDPOINTS.getComments / addComment
- **Checklists**: Via getChecklists / addChecklist
- **Attachments**: Via getAttachments / addAttachment

Ces fonctionnalités sont prêtes à être utilisées via le service, il suffit de créer les hooks correspondants!

## 📚 Ressources

- [API Trello - Cards](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/)
- [React Query Documentation](https://tanstack.com/query/latest)
