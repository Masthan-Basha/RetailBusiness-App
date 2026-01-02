import React, { useContext, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Dimensions, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext'; 
import { AppContext } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

function DashboardCard({ title, value, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  
  // Destructure isLoading from context
  const { transactions, stock, seedDummyData, clearAllData, isLoading } = useContext(AppContext);

  // --- 1. PREVENT EMPTY SCREEN DURING LOAD ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>Syncing Ledger...</Text>
      </View>
    );
  }

  // --- 2. LOGIC FOR INVENTORY ALERTS ---
  const lowStockItems = useMemo(() => {
    return stock.filter(item => item.quantity <= 5 && item.quantity > 0);
  }, [stock]);

  const outOfStockItems = useMemo(() => {
    return stock.filter(item => item.quantity === 0);
  }, [stock]);

  const stats = useMemo(() => {
    const totalIn = transactions
      .filter(t => t.type === 'IN')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const totalOut = transactions
      .filter(t => t.type === 'OUT')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return {
      totalIn,
      totalOut,
      netBalance: totalIn - totalOut,
      lowStockCount: lowStockItems.length + outOfStockItems.length,
    };
  }, [transactions, lowStockItems, outOfStockItems]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Dashboard</Text>
          <Text style={styles.subHeader}>Business Overview</Text>
        </View>
        <Pressable 
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.7 : 1 }]} 
          onPress={logout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Developer Tools */}
      <View style={styles.devSection}>
        <Text style={styles.devHeader}>Developer Tools</Text>
        <View style={styles.devRow}>
          <Pressable onPress={seedDummyData} style={styles.devBtnPurple}>
            <Text style={styles.devBtnText}>🧪 Seed Data</Text>
          </Pressable>
          <Pressable onPress={clearAllData} style={styles.devBtnPink}>
            <Text style={styles.devBtnText}>♻️ Wipe All</Text>
          </Pressable>
        </View>
      </View>

      {/* Financial Cards */}
      <View style={styles.cardRow}>
        <DashboardCard title="TOTAL SALES" value={`₹${stats.totalIn.toLocaleString('en-IN')}`} color="#28a745" />
        <DashboardCard title="EXPENSES" value={`₹${stats.totalOut.toLocaleString('en-IN')}`} color="#dc3545" />
      </View>

      <View style={styles.cardRow}>
        <DashboardCard 
          title="NET BALANCE" 
          value={`₹${stats.netBalance.toLocaleString('en-IN')}`} 
          color={stats.netBalance >= 0 ? "#1e90ff" : "#dc3545"} 
        />
        <DashboardCard title="ALERTS" value={stats.lowStockCount} color="#ffc107" />
      </View>

      {/* Inventory Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>⚠️ Inventory Alerts</Text>
          {outOfStockItems.map(item => (
            <View key={item.id} style={[styles.alertCard, styles.outOfStockBg]}>
              <Text style={styles.outOfStockText}>❌ {item.name} is OUT OF STOCK</Text>
              <Pressable onPress={() => navigation.navigate('Stock')}>
                <Text style={styles.refillLink}>ADD STOCK</Text>
              </Pressable>
            </View>
          ))}
          {lowStockItems.map(item => (
            <View key={item.id} style={[styles.alertCard, styles.lowStockBg]}>
              <Text style={styles.lowStockText}>📉 {item.name} is low ({item.quantity} left)</Text>
              <Pressable onPress={() => navigation.navigate('Stock')}>
                <Text style={styles.refillLink}>REFILL</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Financial Performance Chart */}
      <Text style={styles.sectionTitle}>Financial Performance</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: ['Out', 'In'],
            datasets: [{ 
              data: [stats.totalOut || 1, stats.totalIn || 1], // Prevent 0-height crashes
            }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#1e90ff" }
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Operations */}
      <Text style={styles.sectionTitle}>Operations</Text>
      <Pressable style={styles.actionButton} onPress={() => navigation.navigate('CreateInvoice')}>
        <Text style={styles.actionText}>➕ New Sale (Invoice)</Text>
      </Pressable>

      <Pressable style={[styles.actionButton, { backgroundColor: '#6c757d' }]} onPress={() => navigation.navigate('Stock')}>
        <Text style={styles.actionText}>📦 Manage Inventory</Text>
      </Pressable>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 10, color: '#666', fontWeight: '500' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subHeader: { fontSize: 13, color: '#888' },
  logoutBtn: { backgroundColor: '#ff4d4d', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  devSection: { padding: 12, backgroundColor: '#f1f3f5', borderRadius: 12, marginBottom: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  devHeader: { fontSize: 10, fontWeight: 'bold', color: '#666', marginBottom: 8, textTransform: 'uppercase' },
  devRow: { flexDirection: 'row', gap: 10 },
  devBtnPurple: { flex: 1, backgroundColor: '#6f42c1', padding: 10, borderRadius: 8, alignItems: 'center' },
  devBtnPink: { flex: 1, backgroundColor: '#e83e8c', padding: 10, borderRadius: 8, alignItems: 'center' },
  devBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { backgroundColor: '#fff', width: '48%', padding: 16, borderRadius: 12, borderLeftWidth: 5, elevation: 2 },
  cardTitle: { fontSize: 10, color: '#999', fontWeight: 'bold', marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  alertSection: { marginTop: 10 },
  alertCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1 },
  outOfStockBg: { backgroundColor: '#fff5f5', borderColor: '#feb2b2' },
  lowStockBg: { backgroundColor: '#fffaf0', borderColor: '#fbd38d' },
  outOfStockText: { color: '#c53030', fontWeight: 'bold', fontSize: 13 },
  lowStockText: { color: '#9c4221', fontWeight: '600', fontSize: 13 },
  refillLink: { color: '#1e90ff', fontWeight: 'bold', fontSize: 11 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 12, color: '#444' },
  chartContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 2, alignItems: 'center' },
  actionButton: { backgroundColor: '#1e90ff', padding: 16, borderRadius: 12, marginBottom: 10 },
  actionText: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
});