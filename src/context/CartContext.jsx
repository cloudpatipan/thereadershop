import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [carts, setCarts] = useState([]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, carts, setCarts }}>
      {children}
    </CartContext.Provider>
  );
};
