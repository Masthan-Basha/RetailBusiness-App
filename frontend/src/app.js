// src/App.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// ----- Context Providers -----
import { InvoiceProvider } from './context/InvoiceContext';
import { StockProvider } from './context/StockContext';
import { CustomerProvider } from './context/CustomerContext';
import { DealerProvider } from './context/DealerContext';
import { AlertProvider } from './context/AlertContext';

// ----- Screens -----
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retail Business App</Text>
      <Text style={styles.subtitle}>Welcome to your dashboard</Text>
      <Button
        title="Go to Products"
        onPress={() => navigation.navigate('Products')}
        color="#1e90ff"
      />
    </View>
  );
}

function ProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products List</Text>
      <Text style={styles.subtitle}>Your products will appear here</Text>
    </View>
  );
}

// ----- Navigation Stack -----
const Stack = createNativeStackNavigator();

// ----- Main App -----
export default function App() {
  return (
    <InvoiceProvider>
      <StockProvider>
        <CustomerProvider>
          <DealerProvider>
            <AlertProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Dashboard' }}
                  />
                  <Stack.Screen
                    name="Products"
                    component={ProductsScreen}
                    options={{ title: 'Products' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </AlertProvider>
          </DealerProvider>
        </CustomerProvider>
      </StockProvider>
    </InvoiceProvider>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
});
