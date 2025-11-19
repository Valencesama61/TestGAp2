import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import trelloClient from '../../../api/trello/client';
import { MEMBERS_ENDPOINTS } from '../../../api/trello/endpoints';

const ProfileScreen = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await trelloClient.get(MEMBERS_ENDPOINTS.getMe, {
        params: {
          fields: 'fullName,username,email,bio,url,avatarUrl,initials',
        },
      });
      return response.data;
    },
  });

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: `${profile.avatarUrl}/170.png` }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile?.initials || 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>
          {profile?.fullName || 'Utilisateur'}
        </Text>
        <Text style={styles.userUsername}>
          @{profile?.username}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {profile?.email || 'Non renseigné'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bio</Text>
          <Text style={styles.infoValue}>
            {profile?.bio || 'Aucune biographie'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Profil Trello</Text>
          <Text style={styles.infoValue}>
            {profile?.url ? profile.url : 'Non disponible'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Paramètres</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Aide et support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>À propos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          TrellTech v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
    color: '#5E6C84',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
  },
  infoLabel: {
    fontSize: 14,
    color: '#5E6C84',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#172B4D',
    flex: 2,
    textAlign: 'right',
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
  },
  menuText: {
    fontSize: 16,
    color: '#172B4D',
  },
  logoutButton: {
    backgroundColor: '#EB5A46',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#8993A4',
  },
});

export default ProfileScreen;