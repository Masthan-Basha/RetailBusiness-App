import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../context/AppContext';

export default function TransactionList() {
  const { transactions } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions based on search input
  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => 
      item.party.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const renderItem = ({ item }) => {
    const isIncome = item.type === 'IN';

    return (
      <View style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: isIncome ? '#e8f5e9' : '#ffebee' }]}>
          <Ionicons 
            name={isIncome ? "arrow-down" : "arrow-up"} 
            size={20} 
            color={isIncome ? "#2e7d32" : "#c62828"} 
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.partyName}>{item.party}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: isIncome ? "#2e7d32" : "#c62828" }]}>
            {isIncome ? "+" : "-"} ₹{Number(item.amount).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.typeLabel}>{isIncome ? "Income" : "Expense"}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Ledger History</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by customer or item..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? "No matching records found." : "No transactions recorded yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerBox: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  // Search Bar Styling
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f3f5', 
    borderRadius: 10, 
    paddingHorizontal: 12,
    height: 45
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#333' },

  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      web: { boxShadow: '0px 2px 5px rgba(0,0,0,0.05)' },
      default: { elevation: 2 }
    })
  },
  iconContainer: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1, marginLeft: 15 },
  partyName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  timeText: { fontSize: 12, color: '#999', marginTop: 2 },
  amountContainer: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: 'bold' },
  typeLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase', marginTop: 2 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 }
});