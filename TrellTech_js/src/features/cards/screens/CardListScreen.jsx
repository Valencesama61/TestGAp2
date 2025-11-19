import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CardListScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>CardListScreen (placeholder)</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 18 },
});
