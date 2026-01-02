// src/context/InvoiceContext.js
import React, { createContext, useState } from 'react';

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([
    { id: 1, customer: 'John Doe', total: 250 },
    { id: 2, customer: 'Jane Smith', total: 450 },
  ]);

  return (
    <InvoiceContext.Provider value={{ invoices, setInvoices }}>
      {children}
    </InvoiceContext.Provider>
  );
};
