import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import trelloClient from "../../../api/trello/client";
import { WORKSPACES_ENDPOINTS, BOARDS_ENDPOINTS } from "../../../api/trello/endpoints";

const WorkspaceDetailScreen = ({ route, navigation }) => {
  const { workspaceId, workspaceName } = route.params;
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalTemplate, setModalTemplate] = useState("kanban");
  const [selectedBoard, setSelectedBoard] = useState(null);

  const { data: boards, isLoading, error } = useQuery({
    queryKey: ["workspace-boards", workspaceId],
    queryFn: async () => {
      const response = await trelloClient.get(
        WORKSPACES_ENDPOINTS.getBoards(workspaceId)
      );
      return response.data.map(board => ({
        ...board,
        template: board.prefs?.templateBoardId || "kanban"
      }));
    },
    enabled: !!workspaceId,
  });

  const addBoardMutation = useMutation({
    mutationFn: async ({ name, desc, template }) =>
      trelloClient.post(BOARDS_ENDPOINTS.create, {
        idOrganization: workspaceId,
        name,
        desc,
        prefs: {
          templateBoardId: template,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["workspace-boards", workspaceId]);
      closeModal();
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: async ({ id, name, desc, template }) =>
      trelloClient.put(BOARDS_ENDPOINTS.update(id), { 
        name, 
        desc, 
        prefs: { templateBoardId: template } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["workspace-boards", workspaceId]);
      closeModal();
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (id) => trelloClient.delete(BOARDS_ENDPOINTS.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(["workspace-boards", workspaceId]);
    },
  });

  const handleBoardPress = (board) => {
    navigation.navigate("BoardDetail", {
      boardId: board.id,
      boardName: board.name,
      boardDescription: board.desc,
    });
  };

  const openModal = (action, board = null) => {
    setModalAction(action);
    setSelectedBoard(board);
    setModalName(board ? board.name : "");
    setModalDesc(board ? board.desc : "");
    setModalTemplate(board ? board.template : "kanban");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalName("");
    setModalDesc("");
    setModalTemplate("kanban");
    setSelectedBoard(null);
    setModalAction(null);
  };

  const validateModal = () => {
    if (!modalName.trim()) return;

    if (modalAction === "add") {
      addBoardMutation.mutate({ name: modalName, desc: modalDesc, template: modalTemplate });
    } else if (modalAction === "edit" && selectedBoard) {
      updateBoardMutation.mutate({
        id: selectedBoard.id,
        name: modalName,
        desc: modalDesc,
        template: modalTemplate,
      });
    }
  };

  const handleDelete = (board) => {
    Alert.alert(
      "Delete",
      `Delete "${board.name}" ?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBoardMutation.mutate(board.id),
        },
      ]
    );
  };

  const renderBoardItem = ({ item }) => (
    <View style={styles.boardItem}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        onPress={() => handleBoardPress(item)}
        onLongPress={() => openModal("edit", item)}
      >
        <View
          style={[
            styles.boardColor,
            { backgroundColor: item.prefs?.backgroundColor || "#0079BF" },
          ]}
        />
        <View style={styles.boardInfo}>
          <Text style={styles.boardName}>{item.name}</Text>
          <Text style={styles.boardDescription}>{item.desc || "No description"}</Text>
          <Text style={{ fontSize: 12, color: "#0079BF", marginTop: 2 }}>
            Template: {item.template}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => openModal("edit", item)}
      >
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleDelete(item)}
      >
        <Text style={[styles.actionButtonText, { color: "red" }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
      </View>
    );

  if (error)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{String(error.message)}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{workspaceName}</Text>
        <Text style={styles.headerSubtitle}>
          {boards?.length || 0} board(s)
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal("add")}
        >
          <Text style={styles.addButtonText}>+ Add board</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={renderBoardItem}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalAction === "add" ? "Create a board" : "Edit board"}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Board name"
              value={modalName}
              onChangeText={setModalName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={modalDesc}
              onChangeText={setModalDesc}
            />

            <Text style={{ marginBottom: 5 }}>Template</Text>
            <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, marginBottom: 15 }}>
              <Picker
                selectedValue={modalTemplate}
                onValueChange={(itemValue) => setModalTemplate(itemValue)}
              >
                <Picker.Item label="Kanban" value="kanban" />
                <Picker.Item label="Scrum" value="scrum" />
                <Picker.Item label="Basic" value="basic" />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#bbb" }]}
                onPress={closeModal}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#0079BF" }]}
                onPress={validateModal}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 14, color: "#666", marginBottom: 12 },
  addButton: { padding: 10, backgroundColor: "#0079BF", borderRadius: 8, marginTop: 10 },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  listContainer: { paddingVertical: 16 },
  boardItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", padding: 16, borderRadius: 8, marginBottom: 10 },
  boardColor: { width: 12, height: 60, borderRadius: 4, marginRight: 12 },
  boardInfo: { flex: 1 },
  boardName: { fontSize: 18, fontWeight: "bold" },
  boardDescription: { color: "#555", marginTop: 4 },
  actionButton: { marginLeft: 8 },
  actionButtonText: { fontSize: 12 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, width: "80%", borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6, marginBottom: 15 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { padding: 10, width: "45%", borderRadius: 6, alignItems: "center" },
});

export default WorkspaceDetailScreen;
