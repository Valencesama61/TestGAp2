import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import CardItem from './CardsItem';
//import CardItem from './CardItem';

const CardList = ({ cards, loading, error, onCardPress, onCardLongPress, onRefresh }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0079BF" />
        <Text style={styles.loadingText}>Loading maps...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}> Error: {error.message}</Text>
      </View>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}> No cards in this list</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CardItem
          card={item}
          onPress={onCardPress}
          onLongPress={onCardLongPress}
        />
      )}
      contentContainerStyle={styles.listContainer}
      onRefresh={onRefresh}
      refreshing={loading}
    />
  );
};

CardList.propTypes = {
  cards: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onCardPress: PropTypes.func.isRequired,
  onCardLongPress: PropTypes.func,
  onRefresh: PropTypes.func,
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5E6C84',
  },
  errorText: {
    fontSize: 14,
    color: '#EB5A46',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#5E6C84',
    textAlign: 'center',
  },
});

export default CardList;