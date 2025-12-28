import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function InvoicePreviewScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Preview</Text>
      <Text style={styles.subtitle}>Check your invoice details here</Text>
      <Button title="Confirm & Save" onPress={() => alert('Invoice saved!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
});
