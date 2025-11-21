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
} from 'react-native';
import PropTypes from 'prop-types';

const EditCardModal = ({ visible, onClose, onUpdate, initialData }) => {
  const [cardName, setCardName] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCardName(initialData.name || '');
      setCardDescription(initialData.desc || '');
    }
  }, [initialData]);

  const handleUpdate = async () => {
    if (!cardName.trim()) {
      alert('Le nom de la carte est requis');
      return;
    }

    setLoading(true);
    try {
      await onUpdate({
        cardId: initialData.id,
        updates: {
          name: cardName,
          desc: cardDescription,
        },
      });

      onClose();
    } catch (error) {
      alert('Erreur lors de la modification de la carte');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCardName(initialData?.name || '');
    setCardDescription(initialData?.desc || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier la carte</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom de la carte *"
            value={cardName}
            onChangeText={setCardName}
            autoFocus
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optionnel)"
            value={cardDescription}
            onChangeText={setCardDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
              disabled={loading || !cardName.trim()}
            >
              <Text style={styles.updateButtonText}>
                {loading ? 'Modification...' : 'Modifier'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

EditCardModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    desc: PropTypes.string,
  }),
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
  updateButton: {
    backgroundColor: '#61BD4F',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditCardModal;
