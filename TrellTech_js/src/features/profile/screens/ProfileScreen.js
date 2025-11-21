import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useProfileActions';

// Composant Image de secours
const CustomImage = ({ source, style, children, ...props }) => {
  return (
    <View 
      style={[
        style, 
        { 
          backgroundColor: '#0079BF', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }
      ]} 
      {...props}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
        {children || 'U'}
      </Text>
    </View>
  );
};

const ProfileScreen = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedFullName, setEditedFullName] = useState('');
  const [editedBio, setEditedBio] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'LogOut',
      'Are you sure you want to log off? ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'LogOut',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditedFullName(profile?.fullName || '');
    setEditedBio(profile?.bio || '');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updates = {};
      if (editedFullName.trim() !== profile?.fullName) {
        updates.fullName = editedFullName.trim();
      }
      if (editedBio.trim() !== profile?.bio) {
        updates.bio = editedBio.trim();
      }

      // Vérifier qu'il y a des changements
      if (Object.keys(updates).length === 0) {
        Alert.alert('Info', 'No changes detected');
        setIsEditModalVisible(false);
        return;
      }

      console.log(' Sending updates:', updates);
      await updateProfileMutation.mutateAsync(updates);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      Alert.alert('Error', 'Unable to update profile: ' + error.message);
    }
  };

  // Fonction pour obtenir les initiales
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error loading profile
        </Text>
        <Text style={styles.errorDetail}>
          {error.message}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <CustomImage style={styles.avatar}>
            {getInitials(profile?.fullName)}
          </CustomImage>
        </View>
        <Text style={styles.userName}>
          {profile?.fullName || 'Utilisateur'}
        </Text>
        <Text style={styles.userUsername}>@{profile?.username}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Update Profile</Text>
        </TouchableOpacity>
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
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help and support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LogOut</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>TrellTech v1.0.0</Text>
      </View>

      {/* Modal d'édition */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              style={styles.input}
              value={editedFullName}
              onChangeText={setEditedFullName}
              placeholder="Enter your name"
              placeholderTextColor="#8993A4"
            />

            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedBio}
              onChangeText={setEditedBio}
              placeholder="Talk about yourself"
              placeholderTextColor="#8993A4"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#0079BF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  errorText: {
    fontSize: 16,
    color: '#EB5A46',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0079BF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F4F5F7',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#172B4D',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DFE1E6',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F4F5F7',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#172B4D',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0079BF',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;
