# 🚀 Quick Start - Lists & Cards Implementation

## Installation

Les dépendances sont déjà installées. Le projet utilise:
- React Query (`@tanstack/react-query`)
- React Native
- Expo

## 📋 Utilisation rapide

### 1. Import simplifié

```javascript
// Lists
import {
  useCreateList,
  useUpdateList,
  useDeleteList,
  useArchiveList
} from './features/lists/hooks';

// Cards
import {
  useCreateCard,
  useUpdateCard,
  useDeleteCard
} from './features/cards/hooks';
```

### 2. Créer une liste

```javascript
const { mutate: createList } = useCreateList();

createList({ boardId: 'abc123', name: 'To Do' });
```

### 3. Créer une carte

```javascript
const { mutate: createCard } = useCreateCard();

createCard({
  name: 'Ma tâche',
  desc: 'Description',
  idList: 'list123'
});
```

### 4. Supprimer une liste

```javascript
const { mutate: deleteList } = useDeleteList();

deleteList({ listId: 'list123', boardId: 'abc123' });
```

### 5. Supprimer une carte

```javascript
const { mutate: deleteCard } = useDeleteCard();

deleteCard({ cardId: 'card123', listId: 'list123' });
```

## 📚 Documentation complète

### Guides détaillés
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Vue d'ensemble complète
- **[Lists README](./src/features/lists/README.md)** - Guide complet Lists
- **[Cards README](./src/features/cards/README.md)** - Guide complet Cards
- **[USAGE_EXAMPLE.jsx](./src/features/USAGE_EXAMPLE.jsx)** - Exemples de code
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des modifications

## 🎯 Opérations disponibles

### Lists
✅ Create | ✅ Read | ✅ Update | ✅ Delete | ✅ Archive | ✅ Move Cards

### Cards
✅ Create | ✅ Read | ✅ Update | ✅ Delete | ✅ Move
✅ Members | ✅ Labels

## 🔧 Structure des fichiers

```
src/features/
├── lists/
│   ├── hooks/index.js      ← Import depuis ici
│   ├── services/index.js   ← Ou depuis ici
│   └── README.md           ← Documentation détaillée
│
└── cards/
    ├── hooks/index.js      ← Import depuis ici
    ├── services/index.js   ← Ou depuis ici
    └── README.md           ← Documentation détaillée
```

## ⚡ Example complet

```javascript
import React, { useState } from 'react';
import { useCreateCard, useDeleteCard } from './features/cards/hooks';

const MyComponent = ({ listId }) => {
  const [cardName, setCardName] = useState('');
  const { mutate: createCard, isLoading } = useCreateCard();
  const { mutate: deleteCard } = useDeleteCard();

  const handleCreate = () => {
    createCard(
      {
        name: cardName,
        idList: listId,
        desc: ''
      },
      {
        onSuccess: () => {
          setCardName('');
          alert('Carte créée !');
        }
      }
    );
  };

  return (
    <div>
      <input
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Nom de la carte"
      />
      <button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer'}
      </button>
    </div>
  );
};
```

## 🎨 Composants disponibles

### CreateCardModal
```javascript
import CreateCardModal from './features/cards/components/CreateCardModal';

<CreateCardModal
  visible={true}
  listId="list123"
  onClose={() => {}}
  onCreate={(data) => createCard(data)}
/>
```

## ✨ Nouveautés

- ✅ Suppression de listes (`useDeleteList`)
- ✅ Exports centralisés via `index.js`
- ✅ Documentation complète
- ✅ Exemples d'utilisation

## 💡 Bonnes pratiques

1. Toujours utiliser les hooks, pas les services directement
2. Gérer les états `isLoading`, `isError`, `isSuccess`
3. Utiliser `onSuccess` / `onError` pour les callbacks
4. Valider les données avant de soumettre
5. Donner du feedback utilisateur

## 🆘 Besoin d'aide ?

1. Consulter [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
2. Voir les exemples dans [USAGE_EXAMPLE.jsx](./src/features/USAGE_EXAMPLE.jsx)
3. Lire les README spécifiques (lists/cards)

---

**Tout est prêt à l'emploi !** 🎉
