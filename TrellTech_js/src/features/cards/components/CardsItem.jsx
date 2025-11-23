import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { CardSchema } from '../../../api/schema';

const CardItem = ({ card, onPress, onLongPress }) => {
  const hasMembers = card.idMembers && card.idMembers.length > 0;
  const hasLabels = card.labels && card.labels.length > 0;
  const hasDueDate = !!card.due;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(card)}
      onLongPress={() => onLongPress && onLongPress(card)}
      activeOpacity={0.7}
    >
      {/* Labels */}
      {hasLabels && (
        <View style={styles.labelsContainer}>
          {card.labels.slice(0, 3).map((label) => (
            <View
              key={label.id}
              style={[
                styles.label,
                { backgroundColor: label.color || '#ccc' },
              ]}
            />
          ))}
        </View>
      )}

      {/* Titre de la carte */}
      <Text style={styles.title} numberOfLines={2}>
        {card.name}
      </Text>

      {/* Description (aperçu) */}
      {card.desc && (
        <Text style={styles.description} numberOfLines={1}>
          {card.desc}
        </Text>
      )}

      {/* Footer avec métadonnées */}
      <View style={styles.footer}>
        {/* Date d'échéance */}
        {hasDueDate && (
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDate}>
                {new Date(card.due).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Nombre de membres */}
        {hasMembers && (
          <View style={styles.membersContainer}>
            <Text style={styles.membersCount}>
             {card.idMembers.length}
            </Text>
          </View>
        )}

        {/* Badges (commentaires, pièces jointes, etc.) */}
        {card.badges && card.badges.comments > 0 && (
          <Text style={styles.badge}> {card.badges.comments}</Text>
        )}
        {card.badges && card.badges.attachments > 0 && (
          <Text style={styles.badge}>📎 {card.badges.attachments}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

CardItem.propTypes = {
  card: CardSchema.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 4,
  },
  label: {
    width: 40,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#5E6C84',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  dueDateContainer: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  dueDate: {
    fontSize: 11,
    color: '#5E6C84',
  },
  membersContainer: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  membersCount: {
    fontSize: 11,
    color: '#5E6C84',
  },
  badge: {
    fontSize: 11,
    color: '#5E6C84',
  },
});

export default CardItem;
