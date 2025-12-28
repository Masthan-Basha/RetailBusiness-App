import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [stock, setStock] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isInitialLoadDone = useRef(false);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [storedStock, storedTx, storedCustomers] = await Promise.all([
          AsyncStorage.getItem('app_stock'),
          AsyncStorage.getItem('app_transactions'),
          AsyncStorage.getItem('app_customers'),
        ]);

        if (storedStock) setStock(JSON.parse(storedStock));
        if (storedTx) setTransactions(JSON.parse(storedTx));
        if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
        
        console.log("✅ Data Load Complete");
      } catch (e) {
        console.error("❌ Failed to load local data", e);
      } finally {
        isInitialLoadDone.current = true;
        setIsLoading(false);
      }
    };
    loadAppData();
  }, []);

  // --- 2. SAVE DATA ---
  useEffect(() => {
    const saveAppData = async () => {
      if (isLoading || !isInitialLoadDone.current) return; 
      
      try {
        await AsyncStorage.setItem('app_stock', JSON.stringify(stock));
        await AsyncStorage.setItem('app_transactions', JSON.stringify(transactions));
        await AsyncStorage.setItem('app_customers', JSON.stringify(customers));
      } catch (e) {
        console.error("❌ Failed to save data", e);
      }
    };
    saveAppData();
  }, [stock, transactions, customers, isLoading]);

  // --- 3. ACTIONS ---

  const addCustomer = (customer) => {
    // Unique ID for Customer
    const newCust = { 
      ...customer, 
      id: `CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const addInventoryItem = (item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const itemName = item.name.trim();

    // 1. Update Stock State
    setStock((prev) => {
      const exists = prev.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (exists) {
        // Update existing item quantity and price
        return prev.map(i => i.id === exists.id 
          ? { ...i, quantity: i.quantity + qty, price: price } 
          : i
        );
      }
      // Create new item with a truly unique ID
      const newId = `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return [{ id: newId, name: itemName, price, quantity: qty }, ...prev];
    });

    // 2. Log the Purchase Expense Transaction
    const newTx = {
      id: `TX-PURCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      party: `Stock In: ${itemName}`,
      amount: price * qty,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'OUT', 
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const recordSale = (saleData) => {
    const totalAmount = Number(saleData.totalAmount) || 0;
    const saleQty = Number(saleData.qty) || 0;
    const itemName = saleData.itemName.trim();

    // 1. Log the Sale Income Transaction
    const newTx = {
      id: `TX-SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      party: saleData.customerName || 'Cash Customer',
      amount: totalAmount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'IN', 
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 2. Deduct from Stock
    setStock((prevStock) =>
      prevStock.map((item) => {
        if (item.name.toLowerCase() === itemName.toLowerCase()) {
          return { ...item, quantity: Math.max(0, item.quantity - saleQty) };
        }
        return item;
      })
    );
  };

  // --- 4. TEST DATA & CLEANUP ---

  const seedDummyData = () => {
    // Hardcoded unique IDs for dummy data to prevent collisions
    const dummyStock = [
      { id: 'FIXED-101', name: "PVC Pipe 4-inch", quantity: 50, price: 200 },
      { id: 'FIXED-102', name: "Steel Rod 12mm", quantity: 100, price: 450 },
      { id: 'FIXED-103', name: "Cement Bag", quantity: 30, price: 350 }
    ];
    setStock(dummyStock);
    
    const dummyTx = [
      { id: 'FIXED-T1', party: 'Initial Setup', amount: 5000, time: '10:00 AM', type: 'OUT' }
    ];
    setTransactions(dummyTx);
    Alert.alert("Success", "Test data loaded. Use 'Wipe All' before seeding again if needed.");
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove(['app_stock', 'app_transactions', 'app_customers']);
      setTransactions([]);
      setStock([]);
      setCustomers([]);
      Alert.alert("Cleaned", "All business data has been wiped.");
    } catch (e) {
      console.error("Clear storage failed", e);
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        transactions, 
        stock, 
        customers,
        isLoading,
        addCustomer,
        addInventoryItem,
        recordSale,
        clearAllData,
        seedDummyData 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};