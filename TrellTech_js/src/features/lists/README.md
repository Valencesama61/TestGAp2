# Lists Feature

Gestion complète des listes (Lists) dans TrellTech.

## 📁 Structure

```
lists/
├── components/       # Composants UI
│   ├── ListCard.jsx
│   └── ListForm.jsx
├── hooks/           # Hooks React Query
│   ├── index.js     # Export centralisé
│   ├── useListActions.js  # Mutations CRUD
│   └── useLists.js        # Queries
├── screens/         # Écrans
│   ├── ListDetailScreen.jsx
│   └── ListScreen.jsx
└── services/        # Services API
    ├── index.js     # Export centralisé
    └── listService.js
```

## 🎯 Utilisation

### Import des hooks

```javascript
import {
  useCreateList,
  useUpdateList,
  useDeleteList,
  useArchiveList,
  useMoveAllCards,
  useLists
} from '@features/lists/hooks';
```

### Créer une liste

```javascript
const CreateListButton = ({ boardId }) => {
  const { mutate: createList, isLoading } = useCreateList();

  const handleCreate = () => {
    createList(
      { boardId, name: 'To Do' },
      {
        onSuccess: (newList) => {
          console.log('Liste créée:', newList);
        },
        onError: (error) => {
          console.error('Erreur:', error);
        }
      }
    );
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? 'Création...' : 'Créer une liste'}
    </button>
  );
};
```

### Mettre à jour une liste

```javascript
const EditListForm = ({ listId, currentName }) => {
  const [name, setName] = useState(currentName);
  const { mutate: updateList } = useUpdateList();

  const handleSubmit = () => {
    updateList({ listId, name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Mettre à jour</button>
    </form>
  );
};
```

### Supprimer une liste

```javascript
const DeleteListButton = ({ listId, boardId }) => {
  const { mutate: deleteList, isLoading } = useDeleteList();

  const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer cette liste ?')) {
      deleteList({ listId, boardId });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      Supprimer
    </button>
  );
};
```

### Archiver une liste

```javascript
const ArchiveListButton = ({ listId, boardId }) => {
  const { mutate: archiveList } = useArchiveList();

  return (
    <button onClick={() => archiveList({ listId, boardId })}>
      Archiver
    </button>
  );
};
```

### Déplacer toutes les cartes

```javascript
const MoveCardsButton = ({ sourceListId, targetListId, boardId }) => {
  const { mutate: moveAllCards } = useMoveAllCards();

  const handleMove = () => {
    moveAllCards({ sourceListId, targetListId, boardId });
  };

  return <button onClick={handleMove}>Déplacer toutes les cartes</button>;
};
```

## 🔧 API Service

Le service `listService` expose les méthodes suivantes:

```javascript
import { listService } from '@features/lists/services';

// Récupérer une liste
const list = await listService.getListById('list-id');

// Récupérer les cartes d'une liste
const cards = await listService.getListCards('list-id');

// Créer une liste
const newList = await listService.createList('board-id', 'Ma liste');

// Mettre à jour
const updated = await listService.updateList('list-id', 'Nouveau nom');

// Supprimer
await listService.deleteList('list-id');

// Archiver
const archived = await listService.archiveList('list-id');

// Déplacer toutes les cartes
await listService.moveAllCards('source-id', 'target-id');
```

## 🎨 Composants disponibles

### ListCard
Composant pour afficher une carte de liste.

### ListForm
Formulaire pour créer/éditer une liste.

## ⚡ React Query Cache

Les hooks invalident automatiquement les queries suivantes:

- `['list', listId]` - Détails d'une liste
- `['board-lists', boardId]` - Toutes les listes d'un board
- `['cards', listId]` - Cartes d'une liste

## 📚 Ressources

- [API Trello - Lists](https://developer.atlassian.com/cloud/trello/rest/api-group-lists/)
- [React Query Documentation](https://tanstack.com/query/latest)
