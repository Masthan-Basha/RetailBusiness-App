import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, Platform } from 'react-native'; // Added Platform here

import { AuthContext } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import StockListScreen from '../screens/stock/StockListScreen';
import CustomerListScreen from '../screens/customers/CustomerListScreen';
import AlertsScreen from '../screens/alerts/AlertsScreen';
import TransactionScreen from '../screens/transactions/TransactionList'; 
import CreateInvoiceScreen from '../screens/billing/CreateInvoiceScreen';
import AddInventoryScreen from '../screens/stock/AddInventoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { 
          height: Platform.OS === 'ios' ? 88 : 70, 
          paddingBottom: Platform.OS === 'ios' ? 30 : 12, 
          paddingTop: 8 
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Stock') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Transactions') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Customers') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'notifications' : 'notifications-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Stock" component={StockListScreen} options={{ title: 'Inventory' }} />
      <Tab.Screen name="Transactions" component={TransactionScreen} />
      <Tab.Screen name="Customers" component={CustomerListScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If AuthContext is still checking the session, show a loader
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        // --- AUTHENTICATION FLOW ---
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ animation: 'fade' }}
        />
      ) : (
        // --- MAIN APP FLOW ---
        <Stack.Group>
          <Stack.Screen name="Main" component={BottomTabs} />
          
          <Stack.Screen 
            name="CreateInvoice" 
            component={CreateInvoiceScreen} 
            options={{ 
                headerShown: true, 
                title: 'Create New Bill',
                headerTintColor: '#1e90ff',
                animation: 'slide_from_bottom' 
            }} 
          />
          
          <Stack.Screen 
            name="AddInventory" 
            component={AddInventoryScreen} 
            options={{ 
                headerShown: true, 
                title: 'Manual Stock Entry',
                headerTintColor: '#1e90ff',
                animation: 'slide_from_right'
            }} 
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}