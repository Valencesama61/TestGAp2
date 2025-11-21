import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useWorkspaceMembers } from '../hooks/useWorkspaces';
import {
  useInviteMemberToWorkspace,
  useRemoveMemberFromWorkspace,
  useUpdateMemberRole,
} from '../hooks/useWorkspaceActions';

/**
 * Composant pour gérer les membres d'un workspace
 */
const WorkspaceMemberManager = ({ workspaceId }) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [memberType, setMemberType] = useState('normal');

  // Hooks
  const { data: members, isLoading, error } = useWorkspaceMembers(workspaceId);
  const inviteMember = useInviteMemberToWorkspace();
  const removeMember = useRemoveMemberFromWorkspace();
  const updateRole = useUpdateMemberRole();

  // Handlers
  const handleInviteMember = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un email');
      return;
    }

    try {
      await inviteMember.mutateAsync({
        workspaceId,
        email: email.trim(),
        type: memberType,
        fullName: fullName.trim(),
      });

      Alert.alert('Succès', 'Invitation envoyée avec succès');
      setEmail('');
      setFullName('');
      setMemberType('normal');
      setShowInviteForm(false);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible d\'inviter le membre');
    }
  };

  const handleRemoveMember = (memberId, memberName) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir retirer ${memberName} du workspace ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMember.mutateAsync({ workspaceId, memberId });
              Alert.alert('Succès', 'Membre retiré du workspace');
            } catch (error) {
              Alert.alert('Erreur', error.message || 'Impossible de retirer le membre');
            }
          },
        },
      ]
    );
  };

  const handleToggleRole = async (memberId, currentType, memberName) => {
    const newType = currentType === 'admin' ? 'normal' : 'admin';

    Alert.alert(
      'Changer le rôle',
      `Voulez-vous changer ${memberName} en ${newType === 'admin' ? 'administrateur' : 'membre normal'} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await updateRole.mutateAsync({
                workspaceId,
                memberId,
                type: newType,
              });
              Alert.alert('Succès', 'Rôle mis à jour');
            } catch (error) {
              Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le rôle');
            }
          },
        },
      ]
    );
  };

  // Render member item
  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials || item.fullName?.charAt(0) || '?'}</Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.fullName}</Text>
          <Text style={styles.memberUsername}>@{item.username}</Text>
        </View>
      </View>

      <View style={styles.memberActions}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            item.memberType === 'admin' && styles.adminButton,
          ]}
          onPress={() => handleToggleRole(item.id, item.memberType, item.fullName)}
        >
          <Text style={styles.roleButtonText}>
            {item.memberType === 'admin' ? 'Admin' : 'Normal'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveMember(item.id, item.fullName)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079bf" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement des membres</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Membres ({members?.length || 0})</Text>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => setShowInviteForm(!showInviteForm)}
        >
          <Text style={styles.inviteButtonText}>
            {showInviteForm ? 'Annuler' : '+ Inviter'}
          </Text>
        </TouchableOpacity>
      </View>

      {showInviteForm && (
        <View style={styles.inviteForm}>
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom complet (optionnel)"
            value={fullName}
            onChangeText={setFullName}
          />

          <View style={styles.roleSelector}>
            <Text style={styles.roleSelectorLabel}>Rôle:</Text>
            <TouchableOpacity
              style={[
                styles.roleOption,
                memberType === 'normal' && styles.roleOptionActive,
              ]}
              onPress={() => setMemberType('normal')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  memberType === 'normal' && styles.roleOptionTextActive,
                ]}
              >
                Normal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleOption,
                memberType === 'admin' && styles.roleOptionActive,
              ]}
              onPress={() => setMemberType('admin')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  memberType === 'admin' && styles.roleOptionTextActive,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleInviteMember}
            disabled={inviteMember.isPending}
          >
            {inviteMember.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Envoyer l'invitation</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun membre dans ce workspace</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172b4d',
  },
  inviteButton: {
    backgroundColor: '#0079bf',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  inviteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inviteForm: {
    padding: 16,
    backgroundColor: '#f4f5f7',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe1e6',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    color: '#172b4d',
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dfe1e6',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  roleOptionActive: {
    backgroundColor: '#0079bf',
    borderColor: '#0079bf',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#172b4d',
  },
  roleOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#5aac44',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4f5f7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0079bf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172b4d',
    marginBottom: 2,
  },
  memberUsername: {
    fontSize: 12,
    color: '#5e6c84',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#dfe1e6',
    marginRight: 8,
  },
  adminButton: {
    backgroundColor: '#5aac44',
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#172b4d',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eb5a46',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#5e6c84',
  },
  errorText: {
    fontSize: 14,
    color: '#eb5a46',
  },
});

export default WorkspaceMemberManager;
