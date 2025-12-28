import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function CashTransactionsScreen() {
  const { transactions } = useContext(AppContext);

  // Filter only Cash transactions
  const cashData = transactions.filter(t => t.mode === 'Cash');

  const renderItem = ({ item }) => (
    <View style={styles.txCard}>
      <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
        <Ionicons name="cash-outline" size={24} color="#4CAF50" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.partyName}>{item.party}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.amount, { color: item.type === 'IN' ? '#2e7d32' : '#c62828' }]}>
          {item.type === 'IN' ? '+' : '-'} ₹{item.amount}
        </Text>
        <Text style={styles.typeTag}>{item.type === 'IN' ? 'CASH IN' : 'CASH OUT'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.summaryHeader, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.summaryLabel}>Cash in Hand Total</Text>
        <Text style={styles.summaryValue}>
          ₹{cashData.reduce((acc, curr) => acc + (curr.type === 'IN' ? curr.amount : -curr.amount), 0)}
        </Text>
      </View>

      <FlatList
        data={cashData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No cash transactions found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  summaryHeader: { padding: 20, alignItems: 'center' },
  summaryLabel: { color: '#fff', fontSize: 14, opacity: 0.8 },
  summaryValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  txCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  partyName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  time: { fontSize: 12, color: '#888' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  typeTag: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});