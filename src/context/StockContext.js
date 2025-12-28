// src/context/StockContext.js
import React, { createContext, useState } from 'react';

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stockItems, setStockItems] = useState([
    { id: 1, name: 'Item A', quantity: 10, price: 50 },
    { id: 2, name: 'Item B', quantity: 3, price: 100 },
  ]);

  return (
    <StockContext.Provider value={{ stockItems, setStockItems }}>
      {children}
    </StockContext.Provider>
  );
};
