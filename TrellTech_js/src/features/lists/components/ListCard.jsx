import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const ListCard = ({ list, onPress, onLongPress, onEdit, onArchive }) => {
  const cardCount = list.cards?.length || 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={() => onPress(list)}
        onLongPress={() => onLongPress && onLongPress(list)}
        activeOpacity={0.7}
      >
        {/* Header avec le nom de la liste */}
        <View style={styles.header}>
          <Text style={styles.listName} numberOfLines={1}>
            {list.name}
          </Text>
          <View style={styles.cardCountBadge}>
            <Text style={styles.cardCountText}>{cardCount}</Text>
          </View>
        </View>

        {/* Indicateur de position */}
        {list.pos !== undefined && (
          <Text style={styles.positionText}>Position: {list.pos}</Text>
        )}

        {/* État fermé/archivé */}
        {list.closed && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedText}>Archivée</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(list)}
          >
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>
        )}

        {onArchive && !list.closed && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onArchive(list)}
          >
            <Text style={[styles.actionButtonText, styles.archiveText]}>
              Archiver
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

ListCard.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    closed: PropTypes.bool,
    pos: PropTypes.number,
    cards: PropTypes.array,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  mainContent: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
    flex: 1,
    marginRight: 8,
  },
  cardCountBadge: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCountText: {
    fontSize: 12,
    color: '#5E6C84',
    fontWeight: '600',
  },
  positionText: {
    fontSize: 11,
    color: '#8993A4',
    marginTop: 4,
  },
  closedBadge: {
    marginTop: 8,
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  closedText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F4F5F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#0079BF',
    fontWeight: '600',
  },
  archiveText: {
    color: '#EB5A46',
  },
});

export default ListCard;
