import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCard } from '../hooks/useCards';
import { useCardActions } from '../hooks/useCardActions';

export default function CardDetailScreen({ route, navigation }) {
  const { cardId } = route.params;
  const { data: card, isLoading } = useCard(cardId);
  const { deleteCard, updateCard } = useCardActions();

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la carte',
      'Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCard(cardId);
              navigation.goBack();
              Alert.alert('Succès', 'Carte supprimée');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la carte');
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

  if (!card) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EB5A46" />
        <Text style={styles.errorText}>Carte non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="card" size={24} color="#0079BF" />
        <Text style={styles.title}>{card.name}</Text>
      </View>

      {card.desc && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.description}>{card.desc}</Text>
        </View>
      )}

      {card.due && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Date d'échéance</Text>
          </View>
          <Text style={styles.infoText}>
            {new Date(card.due).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {card.dueComplete && (
            <View style={styles.completeBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#5AAC44" />
              <Text style={styles.completeText}>Terminée</Text>
            </View>
          )}
        </View>
      )}

      {card.labels && card.labels.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag-outline" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Labels</Text>
          </View>
          <View style={styles.labelsContainer}>
            {card.labels.map((label) => (
              <View
                key={label.id}
                style={[
                  styles.label,
                  { backgroundColor: label.color || '#ccc' },
                ]}
              >
                <Text style={styles.labelText}>{label.name || 'Sans nom'}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {card.idMembers && card.idMembers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Membres</Text>
          </View>
          <Text style={styles.infoText}>{card.idMembers.length} membre(s)</Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.sectionTitle}>Informations</Text>
        </View>
        <Text style={styles.infoText}>ID: {card.id}</Text>
        {card.dateLastActivity && (
          <Text style={styles.infoText}>
            Dernière activité:{' '}
            {new Date(card.dateLastActivity).toLocaleDateString('fr-FR')}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteButtonText}>Supprimer la carte</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completeText: {
    fontSize: 14,
    color: '#5AAC44',
    fontWeight: '600',
    marginLeft: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#EB5A46',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
