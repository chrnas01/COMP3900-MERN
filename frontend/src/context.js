import React, { createContext } from 'react';

export const initialValue = {
  title: 'Home',
  sidebarOpen: true,
  content: {},
  loaded: false,
  screenWidth: 1000,
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
