import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BoardListScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>BoardListScreen (placeholder)</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 18 },
});
