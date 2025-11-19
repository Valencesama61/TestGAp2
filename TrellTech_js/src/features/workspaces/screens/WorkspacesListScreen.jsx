import React from "react";
import { View, Text, FlatList, ActivityIndicator, Button } from "react-native";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useWorkspaceActions } from "../hooks/useWorkspaceActions";

export default function WorkspacesScreen() {
  const { workspaces, loading, error, refetch } = useWorkspaces();
  const { addWorkspace, removeWorkspace, editWorkspace } = useWorkspaceActions(refetch);
//   console.log("WORKSPACE SCREEN LOADED");

  if (loading) return <ActivityIndicator size="large" />;
  console.log("WORKSPACE SCREEN LOADED : ", workspaces)
  if (error) return <Text>Erreur : {error.message}</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Créer workspace"
        onPress={() => addWorkspace("Nouveau Workspace", "Description")}
      />

      <FlatList
        // data={workspaces}
        data={Array.isArray(workspaces) ? workspaces : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 20, marginTop: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 10,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.displayName}
            </Text>
            <Button
                title="Modifier workspace"
                onPress={() => editWorkspace(item.id, "Edition Workspace", "Description")}
                color="green"
            />
            <Button
              title="Supprimer"
              onPress={() => removeWorkspace(item.id)}
              color="red"
            />
          </View>
        )}
      />
    </View>
  );
}
