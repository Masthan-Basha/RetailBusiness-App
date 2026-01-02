import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MOCK_DEALERS = [
  { id: '1', company: 'Everest Steel Corp', contact: 'Manoj Ji', totalTrade: '₹2,45,000' },
  { id: '2', company: 'UltraTech Cement Ltd', contact: 'Deepak', totalTrade: '₹8,10,000' },
];

export default function DealerListScreen() {
  return (
    <View style={styles.container}>
      <FlatList 
        data={MOCK_DEALERS} 
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.contact}>Contact: {item.contact}</Text>
            <View style={styles.tradeRow}>
              <Text style={styles.tradeLabel}>Total Business:</Text>
              <Text style={styles.tradeValue}>{item.totalTrade}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#6c757d', elevation: 2 },
  company: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  contact: { fontSize: 14, color: '#666', marginVertical: 4 },
  tradeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  tradeLabel: { color: '#888' },
  tradeValue: { fontWeight: 'bold', color: '#1e90ff' }
});