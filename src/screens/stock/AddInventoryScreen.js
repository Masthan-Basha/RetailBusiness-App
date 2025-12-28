import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView, 
  Alert, 
  Platform, 
  KeyboardAvoidingView 
} from 'react-native';
import { AppContext } from '../../context/AppContext';

export default function AddInventoryScreen({ navigation }) {
  const { addInventoryItem } = useContext(AppContext);

  // Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    const qtyNum = Number(quantity);
    const priceNum = Number(price);

    // Validation
    if (!name.trim() || isNaN(qtyNum) || qtyNum <= 0 || isNaN(priceNum) || priceNum <= 0) {
      const errorMsg = "Please enter a valid product name, quantity, and price.";
      if (Platform.OS === 'web') window.alert(errorMsg);
      else Alert.alert("Invalid Input", errorMsg);
      return;
    }

    // Execute Action (Mode removed to match updated AppContext)
    addInventoryItem({
      name: name.trim(),
      quantity: qtyNum,
      price: priceNum
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content} 
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>Add New Stock</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. PVC Pipe 4-inch"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={quantity}
              onChangeText={(val) => setQuantity(val.replace(/[^0-9]/g, ''))}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Cost Price (Per Unit)</Text>
            <TextInput
              style={styles.input}
              placeholder="₹ 0.00"
              keyboardType="numeric"
              value={price}
              onChangeText={(val) => setPrice(val.replace(/[^0-9.]/g, ''))}
            />
          </View>
        </View>

        {/* Action Button */}
        <Pressable 
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            { opacity: pressed ? 0.8 : 1, cursor: 'pointer' }
          ]}
        >
          <Text style={styles.saveButtonText}>Add to Inventory</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#000'
  },
  row: { flexDirection: 'row', marginBottom: 20 },
  saveButton: {
    backgroundColor: '#1e90ff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
      web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', outlineStyle: 'none' }
    })
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});