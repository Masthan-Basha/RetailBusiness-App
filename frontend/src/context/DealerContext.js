// src/context/DealerContext.js
import React, { createContext, useState } from 'react';

export const DealerContext = createContext();

export const DealerProvider = ({ children }) => {
  const [dealers, setDealers] = useState([
    { id: 1, name: 'Dealer One', company: 'Company A', phone: '1234567890' },
    { id: 2, name: 'Dealer Two', company: 'Company B', phone: '9876543210' },
  ]);

  return (
    <DealerContext.Provider value={{ dealers, setDealers }}>
      {children}
    </DealerContext.Provider>
  );
};
