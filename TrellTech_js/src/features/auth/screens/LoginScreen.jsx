import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { TRELLO_AUTH_URL } from '../../../api/trello/constants';
import { clearAuthStorage } from '../../../utils/clearStorage';

export default function LoginScreen({ navigation }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugClicks, setDebugClicks] = useState(0);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un token valide');
      return;
    }

    try {
      setLoading(true);
      // Sauvegarder le token
      await setAuth(token);
      // La navigation sera gérée automatiquement par le changement d'état
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter. Vérifiez votre token.');
      setLoading(false);
    }
  };

  const handleDebugPress = () => {
    const newCount = debugClicks + 1;
    setDebugClicks(newCount);

    if (newCount >= 5) {
      Alert.alert(
        'Mode Debug',
        'Nettoyer le cache d\'authentification ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Nettoyer',
            onPress: async () => {
              await clearAuthStorage();
              setDebugClicks(0);
              Alert.alert('Succès', 'Cache nettoyé. Redémarrez l\'app.');
            },
          },
        ]
      );
    }
  };

  const openTrelloAuth = async () => {
    try {
      const url = TRELLO_AUTH_URL;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le lien d\'authentification');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleDebugPress}>
          <Text style={styles.title}>TrellTech</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>Connectez-vous avec votre token Trello</Text>

        <TextInput
          style={styles.input}
          placeholder="Token Trello"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={openTrelloAuth}
        >
          <Text style={styles.linkText}>Obtenir un token Trello</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Votre token vous permet d'accéder à vos workspaces, boards, listes et cartes Trello
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0079BF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5AAC44',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  helpText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    opacity: 0.8,
    lineHeight: 18,
  },
});
