# Guide de Dépannage - TrellTech

## Erreur: "TypeError: expected dynamic type 'boolean', but had type 'string'"

Cette erreur se produit lorsque AsyncStorage stocke des booléens comme des chaînes de caractères.

### Solution 1: Redémarrer l'application

1. Arrêtez complètement l'application (Ctrl+C dans le terminal Expo)
2. Redémarrez avec `npm start`
3. Appuyez sur `r` dans le terminal pour reload
4. Ou secouez le téléphone/émulateur et sélectionnez "Reload"

### Solution 2: Nettoyer le cache

Si le redémarrage ne fonctionne pas, il faut nettoyer le cache AsyncStorage:

#### Option A: Via l'application

Ajoutez temporairement ce code dans votre composant Login ou App.js:

```javascript
import { clearAuthStorage } from './src/utils/clearStorage';

// Dans un useEffect ou au clic d'un bouton
useEffect(() => {
  clearAuthStorage();
}, []);
```

#### Option B: Manuellement dans le code

Ajoutez temporairement ce code dans `App.js` avant le return:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

useEffect(() => {
  AsyncStorage.removeItem('trelltech-auth-storage');
}, []);
```

#### Option C: Reset complet de l'app

Pour Android (émulateur):
```bash
npx expo start --clear
```

Puis dans l'application, allez dans:
- Settings > Apps > TrellTech > Storage > Clear Data

Pour iOS (émulateur):
```bash
npx expo start --clear
```

Puis supprimez et réinstallez l'app sur l'émulateur.

### Solution 3: Vérification du code

Les corrections suivantes ont été appliquées:

1. **authStore.js** - Force les booléens:
```javascript
isAuthenticated: !!token  // Force boolean
```

2. **AppNavigator.js** - Sélecteurs avec conversion:
```javascript
const isAuthenticated = useAuthStore((state) => !!state.isAuthenticated);
const isLoading = useAuthStore((state) => !!state.isLoading);
```

### Débogage

Pour voir ce qui est stocké dans AsyncStorage:

```javascript
import { debugStorage } from './src/utils/clearStorage';

// Dans un useEffect
useEffect(() => {
  debugStorage();
}, []);
```

Cela affichera toutes les clés et valeurs dans la console.

## Autres erreurs courantes

### Erreur: "Cannot read property 'navigate' of undefined"

**Cause**: Le composant n'a pas accès à la navigation.

**Solution**: Vérifiez que le composant est bien dans un Navigator:
- Les composants dans les `Screen` ont automatiquement accès à `navigation`
- Sinon, utilisez `useNavigation()` hook

### Erreur: "Network request failed"

**Cause**: Problème de connexion à l'API Trello.

**Solution**:
1. Vérifiez votre connexion internet
2. Vérifiez que votre token Trello est valide
3. Vérifiez les variables d'environnement dans `.env`

### Erreur: "Invalid token"

**Cause**: Le token Trello est expiré ou invalide.

**Solution**:
1. Générez un nouveau token sur https://trello.com/app-key
2. Déconnectez-vous de l'app
3. Reconnectez-vous avec le nouveau token
