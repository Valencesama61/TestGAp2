import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useCard,
  useUpdateCard,
  useAssignMember,
  useRemoveMember,
} from '../hooks/useCards';

const CardDetailScreen = ({ route, navigation }) => {
  const { cardId } = route.params;

  // State local
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  // Hooks
  const { data: card, isLoading, error } = useCard(cardId);
  const updateCardMutation = useUpdateCard();
  const assignMemberMutation = useAssignMember();
  const removeMemberMutation = useRemoveMember();

  /**
   * Activer le mode édition
   */
  const handleEditStart = () => {
    setEditedName(card.name);
    setEditedDesc(card.desc || '');
    setIsEditing(true);
  };

  /**
   * Sauvegarder les modifications
   */
  const handleSave = async () => {
    try {
      await updateCardMutation.mutateAsync({
        cardId: card.id,
        updates: {
          name: editedName,
          desc: editedDesc,
        },
      });
      setIsEditing(false);
      Alert.alert('Success', 'Updated map');
    } catch (error) {
      Alert.alert('Erreur', 'Unable to update the map');
    }
  };

  /**
   * Retirer un membre
   */
  const handleRemoveMember = async (memberId) => {
    Alert.alert(
      'Remove member',
      'Are you sure you want to remove this member??',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMemberMutation.mutateAsync({ cardId, memberId });
              Alert.alert('Succès', 'Membre retiré');
            } catch (error) {
              Alert.alert('Erreur', 'Unable to remove the member');
            }
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

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erreur: {error.message}</Text>
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.centerContainer}>
        <Text>Card not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Section Titre */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Title</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Card Name"
          />
        ) : (
          <Text style={styles.cardTitle}>{card.name}</Text>
        )}
      </View>

      {/* Section Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editedDesc}
            onChangeText={setEditedDesc}
            placeholder="Description of card"
            multiline
            numberOfLines={6}
          />
        ) : (
          <Text style={styles.description}>
            {card.desc || 'No description'}
          </Text>
        )}
      </View>

      {/* Section Membres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Assigned members</Text>
        {card.members && card.members.length > 0 ? (
          card.members.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View>
                <Text style={styles.memberName}>{member.fullName}</Text>
                <Text style={styles.memberUsername}>@{member.username}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveMember(member.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No members assigned</Text>
        )}
      </View>

      {/* Section Labels */}
      {card.labels && card.labels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labels</Text>
          <View style={styles.labelsContainer}>
            {card.labels.map((label) => (
              <View
                key={label.id}
                style={[
                  styles.labelChip,
                  { backgroundColor: label.color || '#ccc' },
                ]}
              >
                <Text style={styles.labelText}>{label.name || 'No Name'}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Date d'échéance */}
      {card.due && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Due date</Text>
          <Text style={styles.dueDate}>
            {new Date(card.due).toLocaleString('fr-FR')}
          </Text>
          {card.dueComplete && (
            <Text style={styles.completeTag}>Add</Text>
          )}
        </View>
      )}

      {/* Boutons d'action */}
      <View style={styles.actionsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEditStart}
          >
            <Text style={styles.editButtonText}>Update</Text>
          </TouchableOpacity>
        )}
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
  errorText: {
    color: '#EB5A46',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5E6C84',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  description: {
    fontSize: 14,
    color: '#172B4D',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#172B4D',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
  },
  memberUsername: {
    fontSize: 12,
    color: '#5E6C84',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EB5A46',
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#5E6C84',
    fontStyle: 'italic',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 14,
    color: '#172B4D',
  },
  completeTag: {
    marginTop: 8,
    fontSize: 12,
    color: '#61BD4F',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#0079BF',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F4F5F7',
  },
  cancelButtonText: {
    color: '#5E6C84',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#61BD4F',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CardDetailScreen;