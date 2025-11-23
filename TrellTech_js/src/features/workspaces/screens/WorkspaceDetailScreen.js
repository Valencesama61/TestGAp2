import React, { useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ActionSheetIOS,
  Platform,
  ScrollView,
} from 'react-native';
import { useWorkspaceBoards } from '../hooks/useWorkspaces';
import { useCreateBoard, useUpdateBoard, useDeleteBoard } from '../../boards/hooks/useBoardActions';
import { useWorkspaceMembers } from '../hooks/useWorkspaceMembers';
import InviteMemberModal from '../components/InviteMemberModal';

const screenWidth = Dimensions.get('screen').width;

const WorkspaceDetailScreen = ({ route, navigation }) => {
  const { workspaceId, workspaceName } = route.params;
  
  // Fetch des boards du workspace
  const { data: boards, isLoading, error, refetch } = useWorkspaceBoards(workspaceId);
  const { data: members, isLoading: isLoadingMembers } = useWorkspaceMembers(workspaceId);
  
  // Mutations
  const createBoardMutation = useCreateBoard();
  const updateBoardMutation = useUpdateBoard();
  const deleteBoardMutation = useDeleteBoard();

  // State pour les modals
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDesc, setBoardDesc] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('kanban');
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Templates disponibles
  const templates = [
    { id: 'kanban', name: ' Kanban', description: 'To Do, Doing, Done' },
    { id: 'scrum', name: ' Scrum', description: 'Backlog, Sprint, In Progress, Done' },
    { id: 'project', name: ' Project', description: 'Personalized Lists' },
  ];

  // Créer un board
  const handleCreateBoard = () => {
    if (!boardName.trim()) {
      Alert.alert('Error', 'Board Name is required');
      return;
    }

    createBoardMutation.mutate(
      { 
        name: boardName.trim(), 
        desc: boardDesc.trim(),
        idOrganization: workspaceId,
        template: selectedTemplate
      },
      {
        onSuccess: () => {
          setCreateModalVisible(false);
          setBoardName('');
          setBoardDesc('');
          setSelectedTemplate('kanban');
        },
        onError: (error) => {
          Alert.alert(
            'Error', 
            `Unable to create board: ${error.response?.data?.message || error.message}`
          );
        }
      }
    );
  };

  // Mettre à jour un board
  const handleUpdateBoard = () => {
    if (!boardName.trim() || !selectedBoard) {
      Alert.alert('Error', 'Board name is required');
      return;
    }

    updateBoardMutation.mutate(
      {
        boardId: selectedBoard.id,
        updates: {
          name: boardName.trim(),
          desc: boardDesc.trim(),
        }
      },
      {
        onSuccess: () => {
          setEditModalVisible(false);
          setBoardName('');
          setBoardDesc('');
          setSelectedBoard(null);
        },
        onError: (error) => {
          Alert.alert(
            'Error', 
            `Unable to update board: ${error.response?.data?.message || error.message}`
          );
        }
      }
    );
  };

  // Supprimer un board
  const handleDeleteBoard = (board) => {
    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete "${board.name}"? This action is irreversible.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBoardMutation.mutate({
              boardId: board.id,
              workspaceId: workspaceId
            });
          },
        },
      ]
    );
  };

  // Ouvrir le menu d'actions (appui long)
  const handleLongPress = (board) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Update', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openEditModal(board);
          } else if (buttonIndex === 2) {
            handleDeleteBoard(board);
          }
        }
      );
    } else {
      // Pour Android - Alert personnalisé
      Alert.alert(
        `Actions for "${board.name}"`,
        'What do you want to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Update', onPress: () => openEditModal(board) },
          { text: 'Delete', style: 'destructive', onPress: () => handleDeleteBoard(board) },
        ]
      );
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (board) => {
    setSelectedBoard(board);
    setBoardName(board.name);
    setBoardDesc(board.desc || '');
    setEditModalVisible(true);
  };

  // Ouvrir le modal de création
  const openCreateModal = () => {
    setBoardName('');
    setBoardDesc('');
    setSelectedTemplate('kanban');
    setCreateModalVisible(true);
  };

  // Fermer tous les modals
  const closeAllModals = () => {
    setCreateModalVisible(false);
    setEditModalVisible(false);
    setBoardName('');
    setBoardDesc('');
    setSelectedBoard(null);
  };

  // Naviguer vers le détail du board
  const handleBoardPress = (board) => {
    navigation.navigate('BoardDetail', {
      boardId: board.id,
      boardName: board.name,
    });
  };

  // Obtenir le nom du template
  const getTemplateName = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : '📋 Kanban';
  };

  // Render item pour FlatList des boards
  const renderBoardItem = ({ item }) => (
    <TouchableOpacity
      style={styles.boardItem}
      onPress={() => handleBoardPress(item)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
    >
      <View style={[styles.boardHeader, { backgroundColor: item.prefs?.backgroundColor || '#0079BF' }]}>
        <Text style={styles.boardName}>{item.name}</Text>
      </View>
      <View style={styles.boardContent}>
        <Text style={styles.boardDescription} numberOfLines={2}>
          {item.desc || 'No description'}
        </Text>
        <View style={styles.boardFooter}>
          <Text style={styles.boardInfo}>
            {item.closed ? ' Archived' : ' Active'}
          </Text>
          <Text style={styles.boardTemplate}>
            {getTemplateName(item.prefs?.templateBoardId || 'kanban')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render item pour FlatList des membres
  const renderMemberItem = ({ item }) => (
    <View style={styles.memberChip}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberInitials}>
          {item.initials || (item.fullName ? item.fullName.charAt(0).toUpperCase() : 'U')}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName} numberOfLines={1}>
          {item.fullName || item.username}
        </Text>
        <Text style={styles.memberRole}>
          {item.memberType === 'admin' ? ' Admin' : ' Member'}
        </Text>
      </View>
    </View>
  );

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
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{workspaceName}</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
             {boards?.length || 0} board(s) •  {members?.length || 0} member(s)
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.inviteButton]}
            onPress={() => setInviteModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Invite</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={openCreateModal}
          >
            <Text style={styles.actionButtonText}>+ Board</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Section Membres */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workspace Members</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setInviteModalVisible(true)}
            >
              <Text style={styles.seeAllText}>Invite +</Text>
            </TouchableOpacity>
          </View>
          
          {isLoadingMembers ? (
            <ActivityIndicator size="small" color="#0079BF" />
          ) : (
            <FlatList
              data={members?.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderMemberItem}
              contentContainerStyle={styles.membersList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No members in this workspace</Text>
              }
            />
          )}
          {members && members.length > 6 && (
            <Text style={styles.moreMembersText}>
              + {members.length - 6} more members
            </Text>
          )}
        </View>

        {/* Section Tableaux */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Boards</Text>
            <Text style={styles.sectionSubtitle}>
              {boards?.length || 0} board(s) - Long press for actions
            </Text>
          </View>

          <FlatList
            data={boards}
            keyExtractor={(item) => item.id}
            renderItem={renderBoardItem}
            contentContainerStyle={styles.boardsList}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyBoardsContainer}>
                <Text style={styles.emptyBoardsText}>No boards in this workspace</Text>
                <Text style={styles.emptyBoardsSubtext}>
                  Create your first board to get started!
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Modal d'invitation */}
      <InviteMemberModal
        visible={inviteModalVisible}
        workspace={{ id: workspaceId, displayName: workspaceName }}
        onClose={() => setInviteModalVisible(false)}
      />

      {/* Modal de création de board */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Board</Text>

            <Text style={styles.inputLabel}>Board Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Marketing Project"
              value={boardName}
              onChangeText={setBoardName}
              autoFocus
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Board description..."
              value={boardDesc}
              onChangeText={setBoardDesc}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Template</Text>
            <View style={styles.templatesContainer}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateItem,
                    selectedTemplate === template.id && styles.templateItemSelected
                  ]}
                  onPress={() => setSelectedTemplate(template.id)}
                >
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeAllModals}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateBoard}
                disabled={!boardName.trim() || createBoardMutation.isLoading}
              >
                {createBoardMutation.isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal d'édition de board */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Board</Text>

            <Text style={styles.inputLabel}>Board Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Marketing Project"
              value={boardName}
              onChangeText={setBoardName}
              autoFocus
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Board description..."
              value={boardDesc}
              onChangeText={setBoardDesc}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeAllModals}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateBoard}
                disabled={!boardName.trim() || updateBoardMutation.isLoading}
              >
                {updateBoardMutation.isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F5F7' 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  errorText: {
    color: '#EB5A46',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
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
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 8,
  },
  statsContainer: {
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#5E6C84',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
  },
  inviteButton: {
    backgroundColor: '#61BD4F',
  },
  addButton: {
    backgroundColor: '#0079BF',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#5E6C84',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#F4F5F7',
  },
  seeAllText: {
    fontSize: 12,
    color: '#0079BF',
    fontWeight: '600',
  },
  membersList: {
    paddingVertical: 4,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 120,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  memberInitials: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 10,
    color: '#5E6C84',
  },
  moreMembersText: {
    fontSize: 12,
    color: '#5E6C84',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#5E6C84',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  boardsList: {
    paddingVertical: 4,
  },
  boardItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DFE1E6',
  },
  boardHeader: {
    padding: 16,
  },
  boardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  boardContent: {
    padding: 16,
  },
  boardDescription: {
    fontSize: 14,
    color: '#5E6C84',
    marginBottom: 8,
    lineHeight: 20,
  },
  boardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F4F5F7',
    paddingTop: 8,
  },
  boardInfo: {
    fontSize: 12,
    color: '#8993A4',
  },
  boardTemplate: {
    fontSize: 12,
    color: '#0079BF',
    fontWeight: '600',
  },
  emptyBoardsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyBoardsText: {
    fontSize: 16,
    color: '#5E6C84',
    marginBottom: 8,
  },
  emptyBoardsSubtext: {
    fontSize: 14,
    color: '#8993A4',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: screenWidth < 760 ? '80%' : '50%',
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#FAFBFC',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  templatesContainer: {
    marginBottom: 20,
  },
  templateItem: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#FAFBFC',
  },
  templateItemSelected: {
    borderColor: '#0079BF',
    backgroundColor: '#E4F0F6',
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    color: '#5E6C84',
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

export default WorkspaceDetailScreen;