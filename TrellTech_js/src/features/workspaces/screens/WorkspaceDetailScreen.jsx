import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WorkspaceDetailScreen({ route }) {
	const id = route?.params?.id ?? '—';
	return (
		<View style={styles.container}>
			<Text style={styles.title}>WorkspaceDetailScreen (placeholder)</Text>
			<Text>ID: {String(id)}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 18, marginBottom: 8 },
});
