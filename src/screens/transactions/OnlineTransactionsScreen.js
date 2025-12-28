import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function OnlineTransactionsScreen() {
  const { transactions } = useContext(AppContext);

  // Filter only Online transactions
  const onlineData = transactions.filter(t => t.mode === 'Online');

  const renderItem = ({ item }) => (
    <View style={styles.txCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="globe-outline" size={24} color="#2196F3" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.partyName}>{item.party}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.amount, { color: item.type === 'IN' ? '#2e7d32' : '#c62828' }]}>
          {item.type === 'IN' ? '+' : '-'} ₹{item.amount}
        </Text>
        <Text style={styles.typeTag}>{item.type === 'IN' ? 'RECEIPT' : 'PAYMENT'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryLabel}>Online Ledger Total</Text>
        <Text style={styles.summaryValue}>
          ₹{onlineData.reduce((acc, curr) => acc + (curr.type === 'IN' ? curr.amount : -curr.amount), 0)}
        </Text>
      </View>

      <FlatList
        data={onlineData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No online transactions found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  summaryHeader: { padding: 20, backgroundColor: '#2196F3', alignItems: 'center' },
  summaryLabel: { color: '#fff', fontSize: 14, opacity: 0.8 },
  summaryValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  txCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  partyName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  time: { fontSize: 12, color: '#888' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  typeTag: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});