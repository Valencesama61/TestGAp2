import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { TRELLO_AUTH_URL } from '../../../api/trello/constants';
import * as WebBrowser from 'expo-web-browser';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleTrelloLogin = async () => {
    setLoading(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${TRELLO_AUTH_URL}&return_url=trelltech://auth`,
        'trelltech://auth'
      );

      if (result.type === 'success') {
        // Extraire le token de l'URL
        const url = result.url;
        const tokenMatch = url.match(/token=([^&]+)/);
        
        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          await setAuth(token);
          Alert.alert('Succès', 'Connexion réussie !');
        } else {
          Alert.alert('Erreur', 'Impossible de récupérer le token');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erreur', 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleManualToken = async () => {
    Alert.prompt(
      'Token Manuel',
      'Entrez votre token Trello:',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          onPress: async (token) => {
            if (token) {
              setLoading(true);
              try {
                await setAuth(token);
                Alert.alert('Succès', 'Connexion réussie !');
              } catch (error) {
                Alert.alert('Erreur', 'Token invalide');
              } finally {
                setLoading(false);
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TrellTech</Text>
        <Text style={styles.subtitle}>Gestion de Projets</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Connectez-vous avec votre compte Trello pour gérer vos projets
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleTrelloLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter avec Trello</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleManualToken}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Utiliser un token manuel</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Pour obtenir un token Trello, visitez:{"\n"}
            https://trello.com/1/authorize?expiration=30days&name=TrellTech&scope=read,write&response_type=token
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F5F7',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0079BF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5E6C84',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#5E6C84',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#0079BF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0079BF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#0079BF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFAB4A',
  },
  infoText: {
    fontSize: 12,
    color: '#5E6C84',
    lineHeight: 16,
  },
});