# Guide d'utilisation - TrellTech avec CRUD complet

## Comment lancer l'application

### Démarrer le serveur de développement
```bash
npm start
# ou
npx expo start
```

### Options de lancement
- **Android**: `npm run android` ou appuyez sur `a` dans le terminal
- **iOS**: `npm run ios` ou appuyez sur `i` dans le terminal
- **Web**: Appuyez sur `w` dans le terminal

---

## Nouvelles fonctionnalités disponibles

### 1. Gestion du profil utilisateur

#### Voir son profil
- Naviguez vers l'onglet "Profil" dans la barre de navigation
- Vous verrez votre avatar, nom, username, email et bio

#### Modifier son profil
1. Cliquez sur le bouton "Modifier le profil"
2. Modifiez votre nom complet et/ou votre bio
3. Cliquez sur "Enregistrer"
4. Les changements sont appliqués immédiatement

#### Intégration dans votre code
```javascript
import { useProfile } from './src/features/profile/hooks/useProfile';
import { useUpdateProfile } from './src/features/profile/hooks/useProfileActions';

function MonComposant() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const modifier = () => {
    updateProfile.mutate({
      fullName: 'Nouveau nom',
      bio: 'Ma nouvelle bio'
    });
  };
}
```

---

### 2. Gestion des labels

#### Créer un label sur un board
```javascript
import { useCreateLabel } from './src/features/labels/hooks/useLabelActions';

function CreerLabel({ boardId }) {
  const createLabel = useCreateLabel();

  const handleCreate = () => {
    createLabel.mutate({
      name: 'Urgent',
      color: 'red', // Couleurs disponibles: red, orange, yellow, green, blue, purple, etc.
      idBoard: boardId
    });
  };
}
```

#### Ajouter un label à une carte
```javascript
import { useAddLabelToCard } from './src/features/labels/hooks/useLabelActions';

function AjouterLabelCarte({ cardId, labelId }) {
  const addLabel = useAddLabelToCard();

  const handleAdd = () => {
    addLabel.mutate({ cardId, labelId });
  };
}
```

#### Récupérer tous les labels d'un board
```javascript
import { useBoardLabels } from './src/features/labels/hooks/useLabels';

function AfficherLabels({ boardId }) {
  const { data: labels, isLoading } = useBoardLabels(boardId);

  if (isLoading) return <Spinner />;

  return labels.map(label => (
    <LabelChip key={label.id} name={label.name} color={label.color} />
  ));
}
```

---

### 3. Gestion des checklists

#### Créer une checklist sur une carte
```javascript
import { useCreateChecklist } from './src/features/checklists/hooks/useChecklistActions';

function CreerChecklist({ cardId }) {
  const createChecklist = useCreateChecklist();

  const handleCreate = () => {
    createChecklist.mutate({
      idCard: cardId,
      name: 'Tâches à faire',
      pos: 'bottom' // ou 'top' ou un nombre
    });
  };
}
```

#### Ajouter un item à une checklist
```javascript
import { useAddChecklistItem } from './src/features/checklists/hooks/useChecklistActions';

function AjouterItem({ checklistId }) {
  const addItem = useAddChecklistItem();

  const handleAdd = () => {
    addItem.mutate({
      checklistId,
      itemData: {
        name: 'Terminer le rapport',
        checked: false,
        pos: 'bottom'
      }
    });
  };
}
```

#### Marquer un item comme complété
```javascript
import { useUpdateChecklistItem } from './src/features/checklists/hooks/useChecklistActions';

function MarquerComplete({ checklistId, itemId }) {
  const updateItem = useUpdateChecklistItem();

  const handleToggle = () => {
    updateItem.mutate({
      checklistId,
      itemId,
      updates: {
        state: 'complete' // ou 'incomplete'
      }
    });
  };
}
```

#### Afficher les checklists d'une carte
```javascript
import { useCardChecklists } from './src/features/checklists/hooks/useChecklists';

function AfficherChecklists({ cardId }) {
  const { data: checklists, isLoading } = useCardChecklists(cardId);

  if (isLoading) return <Spinner />;

  return checklists.map(checklist => (
    <ChecklistView key={checklist.id} checklist={checklist} />
  ));
}
```

---

## Architecture du code

### Structure des dossiers créés

```
src/features/
├── profile/
│   ├── services/
│   │   └── profileService.js    # API calls pour le profil
│   ├── hooks/
│   │   ├── useProfile.js        # Hooks de lecture
│   │   └── useProfileActions.js # Hooks de mutation
│   └── screens/
│       └── ProfileScreen.js     # Écran du profil (mis à jour)
│
├── labels/
│   ├── services/
│   │   └── labelService.js      # API calls pour les labels
│   └── hooks/
│       ├── useLabels.js         # Hooks de lecture
│       └── useLabelActions.js   # Hooks de mutation
│
└── checklists/
    ├── services/
    │   └── checklistService.js  # API calls pour les checklists
    └── hooks/
        ├── useChecklists.js     # Hooks de lecture
        └── useChecklistActions.js # Hooks de mutation
```

### Pattern utilisé

1. **Services**: Gèrent les appels API
   - Fonction pure, retourne une Promise
   - Gestion des erreurs avec try/catch
   - Documentation JSDoc

2. **Hooks de lecture**: Utilisent `useQuery`
   - Nom: `use[Resource](params)`
   - Gestion du cache automatique
   - État de chargement et erreur

3. **Hooks de mutation**: Utilisent `useMutation`
   - Nom: `use[Action][Resource]()`
   - Invalidation automatique du cache
   - Gestion des erreurs

---

## Gestion des erreurs

Toutes les opérations gèrent les erreurs de manière cohérente:

```javascript
import { useUpdateProfile } from './src/features/profile/hooks/useProfileActions';
import { Alert } from 'react-native';

function MonComposant() {
  const updateProfile = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({
        fullName: 'Nouveau nom'
      });
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };
}
```

---

## Cache et invalidation

Les hooks utilisent React Query pour gérer le cache:

- **Durée de vie du cache** (staleTime):
  - Profile: 60 secondes
  - Labels: 30 secondes
  - Checklists: 30 secondes

- **Invalidation automatique**:
  - Après chaque mutation, le cache concerné est invalidé
  - Les composants se mettent à jour automatiquement

---

## Exemples d'utilisation complète

### Composant de carte avec labels et checklists

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useBoardLabels } from './src/features/labels/hooks/useLabels';
import { useAddLabelToCard } from './src/features/labels/hooks/useLabelActions';
import { useCardChecklists } from './src/features/checklists/hooks/useChecklists';
import { useCreateChecklist } from './src/features/checklists/hooks/useChecklistActions';

function CardDetailScreen({ cardId, boardId }) {
  const { data: availableLabels } = useBoardLabels(boardId);
  const { data: checklists } = useCardChecklists(cardId);
  const addLabel = useAddLabelToCard();
  const createChecklist = useCreateChecklist();

  const handleAddLabel = (labelId) => {
    addLabel.mutate({ cardId, labelId });
  };

  const handleCreateChecklist = () => {
    createChecklist.mutate({
      idCard: cardId,
      name: 'Nouvelle checklist'
    });
  };

  return (
    <View>
      <Text>Labels disponibles:</Text>
      <FlatList
        data={availableLabels}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAddLabel(item.id)}>
            <Text style={{ color: item.color }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text>Checklists:</Text>
      <FlatList
        data={checklists}
        renderItem={({ item }) => (
          <ChecklistItem checklist={item} />
        )}
      />

      <TouchableOpacity onPress={handleCreateChecklist}>
        <Text>Ajouter une checklist</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Prochaines étapes recommandées

1. **Interface utilisateur**:
   - Créer des composants UI pour gérer les labels
   - Créer des composants UI pour gérer les checklists
   - Ajouter des animations pour les transitions

2. **Fonctionnalités avancées**:
   - Implémenter les comments (endpoints déjà disponibles)
   - Implémenter les attachments
   - Ajouter la recherche

3. **Tests**:
   - Tests unitaires pour les services
   - Tests d'intégration pour les hooks
   - Tests E2E pour les flows utilisateur

---

## Support et documentation

- Documentation complète: Voir `CHANGELOG_CRUD.md`
- Structure du projet: Suivre le pattern existant dans `src/features/`
- Endpoints API: Voir `src/api/trello/endpoints.js`

---

**Bon développement !** 🚀
