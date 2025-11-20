import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

const BoardFormModal = ({
  visible,
  onClose,
  onCreate,
  onUpdate,
  board = null, // Si fourni, mode édition
  workspaceId = null, // Pour créer un board dans un workspace spécifique
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!board;

  useEffect(() => {
    if (board) {
      setName(board.name || '');
      setDescription(board.desc || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [board, visible]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Le nom du board est requis');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await onUpdate(board.id, {
          name,
          desc: description,
        });
      } else {
        await onCreate(name, description, workspaceId);
      }

      // Réinitialiser et fermer
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      alert(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} du board`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Modifier le Board' : 'Nouveau Board'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nom du board *"
            value={name}
            onChangeText={setName}
            autoFocus={!isEditMode}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optionnel)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isEditMode ? 'Modifier' : 'Créer'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

BoardFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  board: PropTypes.object,
  workspaceId: PropTypes.string,
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
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE1E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F4F5F7',
  },
  cancelButtonText: {
    color: '#5E6C84',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0079BF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BoardFormModal;
