import React, { useState, useMemo, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Pressable, 
  TextInput, ActivityIndicator, Alert, Keyboard, Platform 
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AppContext } from '../../context/AppContext';

export default function CreateInvoiceScreen({ navigation }) {
  const { recordSale, stock } = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('1');

  // --- 1. ROBUST CALCULATION LOGIC ---
  const totals = useMemo(() => {
    // Ensure we are working with numbers, not strings
    const qty = parseFloat(quantity) || 0;
    const price = selectedItem ? parseFloat(selectedItem.price) : 0;
    
    const grandTotal = qty * price;

    return { 
      grandTotal: grandTotal > 0 ? grandTotal : 0,
      qtyNum: qty 
    };
  }, [selectedItem, quantity]);

  // --- 2. CONFIRM SALE & PRINT ---
  const handleConfirmAndPrint = async () => {
    // Basic Validations
    if (!customerName.trim()) {
      Alert.alert("Required", "Please enter the Customer Name.");
      return;
    }
    if (!selectedItem) {
      Alert.alert("Required", "Please select a product from the list.");
      return;
    }

    const qtyNum = parseInt(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid quantity.");
      return;
    }

    if (qtyNum > selectedItem.quantity) {
      Alert.alert("Stock Alert", `Insufficient stock. Only ${selectedItem.quantity} units available.`);
      return;
    }

    try {
      setIsProcessing(true);
      Keyboard.dismiss();

      // 1. Update Context (Stock and Transactions)
      recordSale({
        customerName: customerName.trim(),
        itemName: selectedItem.name,
        qty: qtyNum,
        totalAmount: totals.grandTotal
      });

      // 2. Generate Professional Invoice Template
      const htmlContent = `
        <html>
          <body style="font-family: 'Helvetica', sans-serif; padding: 40px; color: #333;">
            <div style="text-align: center; border-bottom: 2px solid #1e90ff; padding-bottom: 10px;">
              <h1 style="margin: 0; color: #1e90ff;">TAX INVOICE</h1>
              <p style="margin: 5px 0;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <p><strong>Billed To:</strong> ${customerName}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Item Description</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Qty</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">${selectedItem.name}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${qtyNum}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${totals.grandTotal.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top: 30px; text-align: right;">
              <h2 style="color: #1e90ff;">Total Payable: ₹${totals.grandTotal.toLocaleString('en-IN')}</h2>
            </div>
            
            <p style="margin-top: 50px; text-align: center; font-size: 12px; color: #777;">
              Thank you for your business!
            </p>
          </body>
        </html>
      `;

      // 3. Trigger Native Print/Share Dialog
      if (Platform.OS === 'web') {
        await Print.printAsync({ html: htmlContent });
      } else {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri);
      }

      Alert.alert("Success", "Bill Generated & Stock Updated!");
      navigation.goBack();

    } catch (error) {
      console.error("Billing Error:", error);
      Alert.alert("Error", "Could not complete the transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Customer Details</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Customer Name"
          placeholderTextColor="#aaa"
          value={customerName}
          onChangeText={setCustomerName}
        />

        <View style={styles.headerWithAction}>
          <Text style={styles.label}>Available Inventory</Text>
          {selectedItem && (
            <Pressable onPress={() => setSelectedItem(null)}>
              <Text style={styles.clearText}>Deselect</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.stockGrid}>
          {stock.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No items in stock. Add stock first.</Text>
            </View>
          ) : (
            stock.map((item) => (
              <Pressable 
                key={item.id} 
                onPress={() => {
                  setSelectedItem(item);
                  if (parseInt(quantity) > item.quantity) setQuantity('1');
                }}
                style={[
                  styles.itemCard, 
                  selectedItem?.id === item.id && styles.selectedCard
                ]}
              >
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{parseFloat(item.price).toLocaleString('en-IN')}</Text>
                <Text style={styles.itemStock}>Available: {item.quantity}</Text>
              </Pressable>
            ))
          )}
        </View>

        {selectedItem && (
          <View style={styles.qtyContainer}>
            <Text style={styles.label}>Quantity to Bill</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              selectTextOnFocus
            />
          </View>
        )}
      </ScrollView>

      {/* Persistent Bottom Summary */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{totals.grandTotal.toLocaleString('en-IN')}</Text>
        </View>
        
        <Pressable 
          style={[
            styles.confirmBtn, 
            (!selectedItem || totals.grandTotal <= 0) && styles.disabledBtn
          ]} 
          onPress={handleConfirmAndPrint}
          disabled={isProcessing || !selectedItem || totals.grandTotal <= 0}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm Sale & Print</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 20 },
  headerWithAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },
  clearText: { fontSize: 12, color: '#ff4d4d', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 20, fontSize: 16, color: '#333' },
  stockGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, width: '48%', marginBottom: 12, borderWidth: 1, borderColor: '#eee', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  selectedCard: { borderColor: '#1e90ff', backgroundColor: '#eef6ff', borderWidth: 2 },
  itemName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  itemPrice: { color: '#28a745', fontWeight: 'bold', fontSize: 15, marginVertical: 4 },
  itemStock: { fontSize: 11, color: '#888' },
  emptyState: { width: '100%', padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontStyle: 'italic' },
  qtyContainer: { marginTop: 10 },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 10 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: '#666' },
  totalValue: { fontSize: 26, fontWeight: 'bold', color: '#1e90ff' },
  confirmBtn: { backgroundColor: '#28a745', padding: 18, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#b2dfdb' }
});