import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx'; // 1. Import useAuth untuk mendengarkan status login

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Gagal membaca data keranjang dari localStorage", error);
      return [];
    }
  });

  const { user } = useAuth(); // 2. Dapatkan data pengguna saat ini

  // Simpan ke localStorage setiap kali keranjang berubah
  useEffect(() => {
    try {
      // Hanya simpan keranjang jika ada pengguna yang login
      if (user) {
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        // Jika tidak ada pengguna, hapus keranjang dari localStorage
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error("Gagal menyimpan data keranjang ke localStorage", error);
    }
  }, [cart, user]); // Tambahkan user sebagai dependensi

  // 3. Hapus keranjang dari state saat pengguna logout
  useEffect(() => {
    if (!user) {
      setCart([]);
    }
  }, [user]); // Efek ini berjalan setiap kali status user berubah

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };
  
  const updateQuantity = (productId, newQuantity) => {
      if (newQuantity <= 0) {
          removeFromCart(productId);
      } else {
          setCart(prevCart => prevCart.map(item =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
          ));
      }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const clearCart = () => {
      setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.pricePerKg || 0) * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);