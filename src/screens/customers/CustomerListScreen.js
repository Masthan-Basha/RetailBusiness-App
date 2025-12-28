import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerListScreen() {
  const { customers, addCustomer } = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (!name || !phone) return;
    addCustomer({ name, phone });
    setName('');
    setPhone('');
  };

  return (
    <View style={styles.container}>
      {/* Quick Add Form */}
      <View style={styles.addCard}>
        <Text style={styles.cardTitle}>Quick Add Customer</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={name} 
          onChangeText={setName} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Phone Number" 
          keyboardType="phone-pad"
          value={phone} 
          onChangeText={setPhone} 
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Save Customer</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Directory ({customers.length})</Text>
      
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.customerItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.phoneText}>{item.phone}</Text>
            </View>
            <Pressable style={styles.callBtn}>
              <Ionicons name="call" size={18} color="#1e90ff" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No customers registered yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  addCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 3, marginBottom: 20 },
  cardTitle: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: { borderBottomWidth: 1, borderColor: '#eee', padding: 8, marginBottom: 10 },
  addBtn: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#666' },
  customerItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef6ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#1e90ff', fontWeight: 'bold' },
  nameText: { fontWeight: 'bold', fontSize: 15 },
  phoneText: { color: '#888', fontSize: 13 },
  callBtn: { marginLeft: 'auto', padding: 10 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 }
});