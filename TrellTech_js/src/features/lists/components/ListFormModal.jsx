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

const ListFormModal = ({
  visible,
  onClose,
  onCreate,
  onUpdate,
  list = null, // Si fourni, mode édition
  boardId = null, // Requis pour créer une liste
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!list;

  useEffect(() => {
    if (list) {
      setName(list.name || '');
    } else {
      setName('');
    }
  }, [list, visible]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Le nom de la liste est requis');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await onUpdate(list.id, name);
      } else {
        await onCreate(boardId, name);
      }

      // Réinitialiser et fermer
      setName('');
      onClose();
    } catch (error) {
      alert(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la liste`);
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
            {isEditMode ? 'Modifier la Liste' : 'Nouvelle Liste'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nom de la liste *"
            value={name}
            onChangeText={setName}
            autoFocus={!isEditMode}
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

ListFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  list: PropTypes.object,
  boardId: PropTypes.string,
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

export default ListFormModal;
