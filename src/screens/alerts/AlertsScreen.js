import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsScreen({ navigation }) {
  const { stock } = useContext(AppContext);

  // --- 1. DEFINE ALERT THRESHOLD ---
  const LOW_STOCK_THRESHOLD = 10;

  // --- 2. DYNAMIC FILTERING ---
  // This automatically recalculates whenever 'stock' changes in AppContext
  const alertItems = useMemo(() => {
    return stock.filter(item => item.quantity <= LOW_STOCK_THRESHOLD);
  }, [stock]);

  const renderItem = ({ item }) => {
    const isCritical = item.quantity === 0;

    return (
      <View style={[styles.card, isCritical ? styles.criticalCard : styles.warningCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleGroup}>
            <View style={[styles.indicator, { backgroundColor: isCritical ? '#ff4d4d' : '#ffa500' }]} />
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
          <Text style={[styles.statusLabel, isCritical ? styles.criticalText : styles.warningText]}>
            {isCritical ? 'OUT OF STOCK' : 'LOW STOCK'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.quantityText}>
            Current Quantity: <Text style={styles.bold}>{item.quantity}</Text>
          </Text>
          
          <Pressable 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AddInventory', { prefillName: item.name })}
          >
            <Text style={styles.actionBtnText}>Restock</Text>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          You have <Text style={styles.bold}>{alertItems.length}</Text> priority alerts
        </Text>
      </View>

      <FlatList
        data={alertItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Ionicons name="shield-check-mark" size={80} color="#28a745" />
            <Text style={styles.emptyTitle}>Inventory Healthy</Text>
            <Text style={styles.emptySub}>All items are well-stocked!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  summaryBar: { backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  summaryText: { color: '#666', fontSize: 15 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({ android: { elevation: 3 }, ios: { shadowOpacity: 0.1, shadowRadius: 5 } })
  },
  criticalCard: { borderLeftWidth: 5, borderLeftColor: '#ff4d4d' },
  warningCard: { borderLeftWidth: 5, borderLeftColor: '#ffa500' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  indicator: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  itemName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  statusLabel: { fontSize: 11, fontWeight: 'bold' },
  criticalText: { color: '#ff4d4d' },
  warningText: { color: '#ffa500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityText: { color: '#777' },
  bold: { fontWeight: 'bold', color: '#000' },
  actionBtn: { backgroundColor: '#1e90ff', flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: 'bold', marginRight: 5 },
  emptyView: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#28a745', marginTop: 15 },
  emptySub: { color: '#888', marginTop: 5 }
});