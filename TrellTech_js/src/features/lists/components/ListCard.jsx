import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { getLists, createList, updateList, archiveList } from '../services/listService';

const ListCRUD = ({ boardId }) => {
  const [lists, setLists] = useState([]);
  const [newName, setNewName] = useState('');

  const fetchLists = async () => {
    try {
      const res = await getLists(boardId);
      setLists(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => { fetchLists(); }, [boardId]);

  const handleCreate = async () => {
    if (!newName) return;
    await createList(boardId, newName);
    setNewName('');
    fetchLists();
  };

  const handleUpdate = (id, currentName) => {
    Alert.prompt(
      'Modifier le nom',
      '',
      async (text) => {
        if (text) {
          await updateList(id, text);
          fetchLists();
        }
      },
      'plain-text',
      currentName
    );
  };

  const handleArchive = async (id) => {
    Alert.alert(
      'Archiver la liste ?',
      '',
      [
        { text: 'Annuler' },
        { text: 'Oui', onPress: async () => { await archiveList(id); fetchLists(); } }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listes Trello</Text>
      <TextInput
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
        placeholder="Nouvelle liste"
      />
      <Button title="Créer" onPress={handleCreate} />
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <View style={styles.buttons}>
              <Button title="Éditer" onPress={() => handleUpdate(item.id, item.name)} />
              <Button title="Archiver" onPress={() => handleArchive(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, marginBottom: 10, padding: 5 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  buttons: { flexDirection: 'row', gap: 5 }
});

export default ListCRUD;
