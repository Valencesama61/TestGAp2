import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useInviteMember } from '../hooks/useWorkspaceMembers';

const InviteMemberModal = ({ visible, workspace, onClose }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('normal');
  
  const inviteMemberMutation = useInviteMember();

  const roles = [
    { id: 'normal', name: 'Membre normal', description: 'Can create and edit tables' },
    { id: 'admin', name: 'Administrateur', description: 'Full access, can manage members' },
    { id: 'observer', name: 'Observateur', description: 'Can only see the paintings' },
  ];

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please give a valid email');
      return;
    }

    try {
      await inviteMemberMutation.mutateAsync({
        workspaceId: workspace.id,
        email: email.trim(),
        fullName: fullName.trim(),
        role: selectedRole,
      });

      // Réinitialiser le formulaire
      setEmail('');
      setFullName('');
      setSelectedRole('normal');
      
      Alert.alert('Success', `Invitation sent to ${email.trim()}`);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      Alert.alert(
        'Invitation error',
        `Impossible to sent invitation: ${errorMessage}`
      );
    }
  };

  const handleClose = () => {
    setEmail('');
    setFullName('');
    setSelectedRole('normal');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Inviter un membre à {workspace?.displayName}
          </Text>

          <ScrollView style={styles.scrollContent}>
            {/* Email */}
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="email@exemple.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              autoFocus
            />

            {/* Nom complet */}
            <Text style={styles.inputLabel}>Complete Name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Jean Dupont"
              value={fullName}
              onChangeText={setFullName}
              autoComplete="name"
            />

            {/* Sélection du rôle */}
            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.rolesContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleItem,
                    selectedRole === role.id && styles.roleItemSelected,
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <View style={styles.roleHeader}>
                    <View style={styles.roleRadio}>
                      {selectedRole === role.id && (
                        <View style={styles.radioSelected} />
                      )}
                    </View>
                    <Text style={styles.roleName}>{role.name}</Text>
                  </View>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Informations */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                 The member will receive an invitation by email.
              </Text>
              <Text style={styles.infoText}>
                 The invitation will expire after 30 days.
              </Text>
            </View>
          </ScrollView>

          {/* Boutons d'action */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={inviteMemberMutation.isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.inviteButton]}
              onPress={handleInvite}
              disabled={!email.trim() || inviteMemberMutation.isLoading}
            >
              {inviteMemberMutation.isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.inviteButtonText}>Send invitation</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  scrollContent: {
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
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
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FAFBFC',
  },
  rolesContainer: {
    marginBottom: 20,
  },
  roleItem: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#FAFBFC',
  },
  roleItemSelected: {
    borderColor: '#0079BF',
    backgroundColor: '#E4F0F6',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0079BF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0079BF',
  },
  roleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
  },
  roleDescription: {
    fontSize: 12,
    color: '#5E6C84',
    marginLeft: 32,
  },
  infoBox: {
    backgroundColor: '#F4F5F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#5E6C84',
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
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
  inviteButton: {
    backgroundColor: '#0079BF',
    marginLeft: 8,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InviteMemberModal;