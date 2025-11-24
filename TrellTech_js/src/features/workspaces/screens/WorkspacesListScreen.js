import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import trelloClient from '../../../api/trello/client';
import { WORKSPACES_ENDPOINTS } from '../../../api/trello/endpoints';

// Actions CRUD
import {
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from '../hooks/useWorkspaceActions';

const screenWidth = Dimensions.get('screen').width;

const WorkspacesListScreen = ({ navigation }) => {
  // === FETCH WORKSPACES ===
  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await trelloClient.get(WORKSPACES_ENDPOINTS.getAll);
      return response.data;
    },
  });

  // === MUTATIONS ===
  const createWorkspace = useCreateWorkspace();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  // === MODAL STATE ===
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalInput, setModalInput] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const openModal = (action, workspace = null) => {
    setModalAction(action);
    setSelectedWorkspace(workspace);
    setModalInput(workspace ? workspace.displayName : '');
    setModalVisible(true);
  };

  const validateModal = () => {
    const name = modalInput.trim();
    if (!name) return;

    if (modalAction === 'create') {
      createWorkspace.mutate({ displayName: name, desc: '' });
    }

    if (modalAction === 'update' && selectedWorkspace) {
      updateWorkspace.mutate({
        workspaceId: selectedWorkspace.id,
        updates: { displayName: name },
      });
    }

    setModalVisible(false);
  };

  const handleDelete = (workspace) => {
    Alert.alert(
      'Delete',
      `Delete "${workspace.displayName}" ?`,
      [
        { text: 'Discard', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWorkspace.mutate(workspace.id),
        },
      ]
    );
  };

  // LOADING UI
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  const renderWorkspaceItem = ({ item }) => (
    <View style={styles.workspaceItem}>
      <TouchableOpacity
        style={{ flexDirection: 'row', flex: 1 }}
        onPress={() =>
          navigation.navigate('WorkspaceDetail', {
            workspaceId: item.id,
            workspaceName: item.displayName,
          })
        }
      >
        <View style={styles.workspaceIcon}>
          <Text style={styles.workspaceIconText}>
            {item.displayName ? item.displayName.charAt(0).toUpperCase() : 'W'}
          </Text>
        </View>

        <View style={styles.workspaceInfo}>
          <Text style={styles.workspaceName}>{item.displayName}</Text>
          <Text style={styles.workspaceType}>{item.name || 'Workspace'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => openModal('update', item)}>
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
        <Text style={[styles.actionButtonText, { color: 'red' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workspaces</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal('create')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
        <Text style={styles.headerSubtitle}>
          {workspaces?.length || 0} workspace(s)
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkspaceItem}
        contentContainerStyle={styles.listContainer}
        numColumns={Platform.OS === 'web' ? 3 : 1}
        columnWrapperStyle={
          Platform.OS === 'web'
            ? { justifyContent: 'space-between', gap: 12 }
            : null
        }
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalAction === 'create' ? 'Create a workspace' : 'Update a workspace'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Workspace title"
              value={modalInput}
              onChangeText={setModalInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#bbb' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#0079BF' }]}
                onPress={validateModal}
              >
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },

  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#172B4D' },
  headerSubtitle: { fontSize: 14, color: '#5E6C84', marginTop: 4 },

  addButton: {
    backgroundColor: '#0079BF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },

  listContainer: {
    padding: 12,
  },

  workspaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,

    // GRID WEB
    flex: Platform.OS === 'web' ? 1 : 0,
    minWidth: Platform.OS === 'web' ? '31%' : '100%',
    maxWidth: Platform.OS === 'web' ? '31%' : '100%',
  },

  workspaceIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  workspaceIconText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  workspaceInfo: { flex: 1 },
  workspaceName: { fontSize: 15, fontWeight: '600', color: '#172B4D' },
  workspaceType: { fontSize: 13, color: '#5E6C84' },

  actionButton: { marginLeft: 8 },
  actionButtonText: { fontSize: 12 },

  // MODAL
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
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    width: '45%',
    borderRadius: 6,
    alignItems: 'center',
  },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#EB5A46', fontSize: 16 },
});

export default WorkspacesListScreen;
