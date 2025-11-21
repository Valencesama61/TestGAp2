# Résumé de l'implémentation CRUD - Lists & Cards

## Structure du projet

L'architecture suit le pattern workspace/board existant avec une séparation claire des responsabilités:

```
src/features/
├── lists/
│   ├── components/       # Composants UI
│   ├── hooks/           # Hooks React Query
│   │   ├── index.js     # Export centralisé ✨ NOUVEAU
│   │   ├── useListActions.js
│   │   └── useLists.js
│   ├── screens/         # Écrans
│   ├── services/        # Services API
│   │   ├── index.js     # Export centralisé ✨ NOUVEAU
│   │   └── listService.js
│
├── cards/
│   ├── components/      # Composants UI
│   │   ├── CardList.jsx
│   │   ├── CardsItem.jsx
│   │   └── CreateCardModal.jsx
│   ├── hooks/          # Hooks React Query
│   │   ├── index.js    # Export centralisé ✨ NOUVEAU
│   │   ├── useCardActions.js
│   │   └── useCards.js
│   ├── screens/        # Écrans
│   └── services/       # Services API
│       ├── index.js    # Export centralisé ✨ NOUVEAU
│       └── cardService.js
```

---

## 📋 LISTS - Opérations CRUD complètes

### Service Layer (`listService.js`)

Toutes les méthodes utilisent maintenant les **LISTS_ENDPOINTS** constants:

#### Opérations disponibles:

| Méthode | Description | Endpoint |
|---------|-------------|----------|
| `getListById(listId)` | Récupérer une liste par ID | `GET /lists/{id}` |
| `getListCards(listId)` | Récupérer les cartes d'une liste | `GET /lists/{id}/cards` |
| `createList(boardId, name)` | Créer une nouvelle liste | `POST /lists` |
| `updateList(listId, name)` | Mettre à jour une liste | `PUT /lists/{id}` |
| `deleteList(listId)` | **✨ NOUVEAU** Supprimer une liste | `DELETE /lists/{id}` |
| `archiveList(listId)` | Archiver une liste | `PUT /lists/{id}/closed` |
| `moveAllCards(sourceListId, targetListId)` | Déplacer toutes les cartes | `POST /lists/{id}/moveAllCards` |

### Hooks Layer (`useListActions.js`)

Tous les hooks utilisent **React Query** avec invalidation automatique du cache:

```javascript
// Création
const { mutate: createList } = useCreateList();
createList({ boardId: '123', name: 'To Do' });

// Mise à jour
const { mutate: updateList } = useUpdateList();
updateList({ listId: '456', name: 'In Progress' });

// Suppression ✨ NOUVEAU
const { mutate: deleteList } = useDeleteList();
deleteList({ listId: '456', boardId: '123' });

// Archivage
const { mutate: archiveList } = useArchiveList();
archiveList({ listId: '456', boardId: '123' });

// Déplacement de cartes
const { mutate: moveAllCards } = useMoveAllCards();
moveAllCards({ sourceListId: '456', targetListId: '789', boardId: '123' });
```

#### Invalidation automatique des queries:
- ✅ `['list', listId]` - Détails de la liste
- ✅ `['board-lists', boardId]` - Listes du board
- ✅ `['cards', listId]` - Cartes de la liste (pour moveAllCards)

---

## 🎴 CARDS - Opérations CRUD complètes

### Service Layer (`cardService.js`)

Utilise les **CARDS_ENDPOINTS** constants pour tous les appels:

#### Opérations de base:

| Méthode | Description | Endpoint |
|---------|-------------|----------|
| `getCardsByList(listId)` | Récupérer toutes les cartes d'une liste | `GET /lists/{id}/cards` |
| `getCardById(cardId)` | Récupérer une carte par ID | `GET /cards/{id}` |
| `createCard(cardData)` | Créer une nouvelle carte | `POST /cards` |
| `updateCard(cardId, updates)` | Mettre à jour une carte | `PUT /cards/{id}` |
| `deleteCard(cardId)` | Supprimer une carte | `DELETE /cards/{id}` |
| `moveCard(cardId, newListId)` | Déplacer une carte | `PUT /cards/{id}` |

#### Opérations avancées:

| Méthode | Description | Endpoint |
|---------|-------------|----------|
| `addMemberToCard(cardId, memberId)` | Assigner un membre | `POST /cards/{id}/idMembers` |
| `removeMemberFromCard(cardId, memberId)` | Retirer un membre | `DELETE /cards/{id}/idMembers/{memberId}` |
| `getCardMembers(cardId)` | Récupérer les membres | `GET /cards/{id}/members` |
| `addLabelToCard(cardId, labelId)` | Ajouter un label | `POST /cards/{id}/idLabels` |
| `removeLabelFromCard(cardId, labelId)` | Retirer un label | `DELETE /cards/{id}/idLabels/{labelId}` |

### Hooks Layer (`useCardActions.js`)

```javascript
// Création
const { mutate: createCard } = useCreateCard();
createCard({
  name: 'Ma tâche',
  desc: 'Description',
  idList: '123',
  pos: 'bottom',
  due: null
});

// Mise à jour
const { mutate: updateCard } = useUpdateCard();
updateCard({
  cardId: '456',
  updates: { name: 'Nouveau nom', desc: 'Nouvelle description' }
});

// Suppression
const { mutate: deleteCard } = useDeleteCard();
deleteCard({ cardId: '456', listId: '123' });

// Déplacement
const { mutate: moveCard } = useMoveCard();
moveCard({ cardId: '456', newListId: '789', oldListId: '123' });

// Gestion des membres
const { mutate: assignMember } = useAssignMember();
assignMember({ cardId: '456', memberId: 'abc' });

const { mutate: removeMember } = useRemoveMember();
removeMember({ cardId: '456', memberId: 'abc' });

// Gestion des labels
const { mutate: addLabel } = useAddLabel();
addLabel({ cardId: '456', labelId: 'red' });

const { mutate: removeLabel } = useRemoveLabel();
removeLabel({ cardId: '456', labelId: 'red' });
```

#### Invalidation automatique des queries:
- ✅ `['card', cardId]` - Détails de la carte
- ✅ `['cards', listId]` - Cartes de la liste
- ✅ `['board-lists', boardId]` - Listes du board (pour création)

---

## 🎯 Améliorations apportées

### 1. **Suppression des Lists** ✨
- Ajout de `deleteList` dans `listService.js`
- Ajout de `useDeleteList` hook
- Ajout de l'endpoint dans `LISTS_ENDPOINTS`

### 2. **Refactoring pour utiliser les constants**
- Migration de tous les endpoints hardcodés vers `LISTS_ENDPOINTS`
- Cohérence avec les autres features (workspace, board, card)

### 3. **Exports centralisés** ✨
- Création de fichiers `index.js` dans `hooks/` et `services/`
- Facilite les imports: `import { useCreateCard, useDeleteCard } from '@features/cards/hooks'`

### 4. **Documentation JSDoc complète**
- Tous les paramètres documentés
- Types de retour spécifiés
- Exemples d'utilisation

---

## 📦 Utilisation recommandée

### Import simplifié avec les nouveaux index:

```javascript
// Avant
import { useCreateCard } from '@features/cards/hooks/useCardActions';
import { useDeleteCard } from '@features/cards/hooks/useCardActions';
import cardService from '@features/cards/services/cardService';

// Maintenant ✨
import { useCreateCard, useDeleteCard } from '@features/cards/hooks';
import { cardService } from '@features/cards/services';
```

### Exemple d'utilisation dans un composant:

```javascript
import React from 'react';
import { useCreateCard, useDeleteCard, useUpdateCard } from '@features/cards/hooks';

const MyComponent = ({ listId }) => {
  const { mutate: createCard, isLoading: isCreating } = useCreateCard();
  const { mutate: deleteCard, isLoading: isDeleting } = useDeleteCard();
  const { mutate: updateCard } = useUpdateCard();

  const handleCreate = () => {
    createCard({
      name: 'Nouvelle tâche',
      idList: listId,
      desc: 'Description de la tâche'
    });
  };

  const handleDelete = (cardId) => {
    deleteCard({ cardId, listId });
  };

  const handleUpdate = (cardId) => {
    updateCard({
      cardId,
      updates: { name: 'Nom mis à jour' }
    });
  };

  return (
    // ... votre UI
  );
};
```

---

## ✅ Checklist de conformité

- [x] **Lists** - CRUD complet (Create, Read, Update, Delete, Archive)
- [x] **Cards** - CRUD complet + opérations avancées (membres, labels)
- [x] Utilisation des constants d'endpoints
- [x] Hooks React Query avec invalidation
- [x] Exports centralisés via index.js
- [x] Documentation JSDoc
- [x] Gestion des erreurs
- [x] Pattern cohérent avec workspace/board

---

## 🚀 Prochaines étapes possibles

1. Ajouter des tests unitaires pour les services
2. Ajouter des tests d'intégration pour les hooks
3. Créer des composants UI réutilisables pour la gestion des cartes/listes
4. Implémenter l'optimistic UI pour une meilleure UX
5. Ajouter la gestion des checklists, attachments, et comments

---

**Date de dernière mise à jour**: ${new Date().toISOString().split('T')[0]}
**Architecture**: Clean Architecture + React Query
**State Management**: TanStack Query (React Query v5)
