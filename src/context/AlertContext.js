import React, { createContext } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  return <AlertContext.Provider value={{}}>{children}</AlertContext.Provider>;
};
