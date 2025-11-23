import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { 
  useBoardMembers, 
  useCardMembers, 
  useAssignMember, 
  useRemoveMember 
} from '../hooks/useCards'; 

const AssignMemberModal = ({ visible, card, boardId, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: boardMembers, isLoading: isLoadingMembers, error: boardMembersError } = useBoardMembers(boardId);
  const { data: cardMembers, isLoading: isLoadingCardMembers, error: cardMembersError } = useCardMembers(card?.id);
  const assignMemberMutation = useAssignMember();
  const removeMemberMutation = useRemoveMember();

  // Debug: Pour vérifier que les données sont bien récupérées
  console.log('Board Members:', boardMembers);
  console.log('Card Members:', cardMembers);
  console.log('Board Members Error:', boardMembersError);
  console.log('Card Members Error:', cardMembersError);

  // Filtrer les membres selon la recherche
  const filteredMembers = boardMembers?.filter(member =>
    member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Vérifier si un membre est déjà assigné
  const isMemberAssigned = (memberId) => {
    return cardMembers?.some(member => member.id === memberId);
  };

  // Assigner ou retirer un membre
  const handleMemberAction = (member) => {
    const isAssigned = isMemberAssigned(member.id);
    
    if (isAssigned) {
      // Retirer le membre
      removeMemberMutation.mutate({
        cardId: card.id,
        memberId: member.id,
      });
    } else {
      // Assigner le membre
      assignMemberMutation.mutate({
        cardId: card.id,
        memberId: member.id,
      });
    }
  };

  if (!card) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.errorText}>Card not available</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
           Assign members to: {card.name}
          </Text>

          {/* Barre de recherche */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search a member..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Gestion des erreurs */}
          {boardMembersError && (
            <Text style={styles.errorText}>
              Error loading members: {boardMembersError.message}
            </Text>
          )}

          {/* Liste des membres */}
          {isLoadingMembers ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#0079BF" />
              <Text style={styles.loadingText}>Loading Members...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredMembers}
              keyExtractor={(item) => item.id}
              style={styles.membersList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.memberItem,
                    isMemberAssigned(item.id) && styles.memberItemAssigned
                  ]}
                  onPress={() => handleMemberAction(item)}
                  disabled={assignMemberMutation.isLoading || removeMemberMutation.isLoading}
                >
                  {/* Avatar du membre */}
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitials}>
                      {item.initials || (item.fullName ? item.fullName.charAt(0).toUpperCase() : 'U')}
                    </Text>
                  </View>

                  {/* Infos du membre */}
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {item.fullName || 'Unnamed user'}
                    </Text>
                    <Text style={styles.memberUsername}>
                      @{item.username || 'unknown'}
                    </Text>
                  </View>

                  {/* Statut */}
                  <View style={styles.memberStatus}>
                    {isMemberAssigned(item.id) ? (
                      <View style={styles.assignedBadge}>
                        <Text style={styles.assignedText}>Assigned</Text>
                      </View>
                    ) : (
                      <Text style={styles.assignText}>Assign</Text>
                    )}
                  </View>

                  {/* Indicateur de chargement */}
                  {(assignMemberMutation.isLoading || removeMemberMutation.isLoading) && (
                    <ActivityIndicator size="small" color="#0079BF" style={styles.loadingIndicator} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No members were found for this search.' : 'No members available'}
                </Text>
              }
            />
          )}

          {/* Bouton fermer */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FAFBFC',
  },
  membersList: {
    maxHeight: 400,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FAFBFC',
    position: 'relative',
  },
  memberItemAssigned: {
    backgroundColor: '#E4F0F6',
    borderColor: '#0079BF',
    borderWidth: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberInfo: {
    flex: 1,
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
  memberStatus: {
    marginLeft: 'auto',
    marginRight: 8,
  },
  assignedBadge: {
    backgroundColor: '#61BD4F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  assignText: {
    color: '#0079BF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 8,
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#5E6C84',
  },
  emptyText: {
    textAlign: 'center',
    color: '#5E6C84',
    fontStyle: 'italic',
    padding: 20,
  },
  errorText: {
    color: '#EB5A46',
    textAlign: 'center',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#F4F5F7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#172B4D',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AssignMemberModal;