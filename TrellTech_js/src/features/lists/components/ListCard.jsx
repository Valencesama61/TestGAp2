import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

export default function ListCard({ list, onPress, onEdit, onArchive }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(list)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {list.name}
          </Text>
          {list.closed && (
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedText}>Archivée</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.info}>
            {list.cards && (
              <View style={styles.infoItem}>
                <Ionicons name="card-outline" size={14} color="#666" />
                <Text style={styles.infoText}>{list.cards.length} cartes</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit(list);
              }}
            >
              <Ionicons name="pencil-outline" size={20} color="#0079BF" />
            </TouchableOpacity>

            {!list.closed && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onArchive(list);
                }}
              >
                <Ionicons name="archive-outline" size={20} color="#EB5A46" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

ListCard.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    closed: PropTypes.bool,
    cards: PropTypes.array,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
};

ListCard.defaultProps = {
  onEdit: () => {},
  onArchive: () => {},
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  archivedBadge: {
    backgroundColor: '#EB5A46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  archivedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
