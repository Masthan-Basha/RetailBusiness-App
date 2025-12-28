import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, TextInput, Pressable, 
  FlatList, Alert, Keyboard, Platform 
} from 'react-native';
import { AppContext } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function StockScreen() {
  const { stock, addInventoryItem } = useContext(AppContext);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddItem = () => {
    if (!name || !price || !quantity) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    addInventoryItem({
      name: name.trim(),
      price: price,
      quantity: quantity
    });

    // Clear form and close keyboard
    setName('');
    setPrice('');
    setQuantity('');
    Keyboard.dismiss();
    Alert.alert("Success", "Stock updated successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory Management</Text>
      
      {/* ADD STOCK FORM */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add / Restock Item</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Product Name (e.g., Cement)" 
          value={name} 
          onChangeText={setName} 
        />
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 10 }]} 
            placeholder="Price (₹)" 
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Qty" 
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>
        <Pressable style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>Update Inventory</Text>
        </Pressable>
      </View>

      {/* CURRENT STOCK LIST */}
      <Text style={styles.sectionTitle}>Current Stock Levels</Text>
      <FlatList
        data={stock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.stockItem}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Rate: ₹{item.price}</Text>
            </View>
            <View style={[styles.qtyBadge, { backgroundColor: item.quantity <= 5 ? '#fff5f5' : '#f0f9ff' }]}>
              <Text style={[styles.qtyText, { color: item.quantity <= 5 ? '#c53030' : '#0077b6' }]}>
                {item.quantity} units
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  formCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 3, marginBottom: 25 },
  formTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 15, textTransform: 'uppercase' },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row' },
  addButton: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 10 },
  stockItem: { 
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  itemPrice: { fontSize: 12, color: '#888' },
  qtyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  qtyText: { fontSize: 13, fontWeight: 'bold' }
});