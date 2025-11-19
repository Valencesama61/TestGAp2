import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

export default function BoardCard({ board, onPress, onEdit, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(board)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {board.name}
          </Text>
          {board.starred && (
            <Ionicons name="star" size={16} color="#FFC107" />
          )}
        </View>

        {board.desc && (
          <Text style={styles.description} numberOfLines={2}>
            {board.desc}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.info}>
            {board.lists && (
              <View style={styles.infoItem}>
                <Ionicons name="list-outline" size={14} color="#666" />
                <Text style={styles.infoText}>{board.lists.length} listes</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit(board);
              }}
            >
              <Ionicons name="pencil-outline" size={20} color="#0079BF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete(board);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#EB5A46" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {board.prefs?.backgroundColor && (
        <View
          style={[
            styles.colorBar,
            { backgroundColor: board.prefs.backgroundColor },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

BoardCard.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
    starred: PropTypes.bool,
    lists: PropTypes.array,
    prefs: PropTypes.object,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

BoardCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
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
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
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
    marginRight: 12,
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
  colorBar: {
    height: 4,
  },
});
