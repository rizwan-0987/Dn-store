import React, { createContext, useState } from "react";
import all_product from "../components/assets/all_product";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (itemId, quantity = 1, size = "S", price = 0) => {
    const product = all_product.find((p) => p.id === itemId);
    const stock = product?.variations?.[size]?.stock || 0;
    const maxLimit = Math.min(stock, 3);

    setCartItems((prevCartItems) => {
      const existingIndex = prevCartItems.findIndex(
        (item) => item.id === itemId && item.size === size
      );

      if (existingIndex !== -1) {
        const currentQty = prevCartItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, maxLimit);
        const updatedCart = [...prevCartItems];
        updatedCart[existingIndex].quantity = newQty;
        return updatedCart;
      } else {
        return [
          ...prevCartItems,
          { id: itemId, size, quantity: Math.min(quantity, maxLimit), price },
        ];
      }
    });
  };
  const removeFromCart = (itemId, size) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter(
        (item) => !(item.id === itemId && item.size === size)
      )
    );
  };
  const getTotalCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const updateCartQuantity = (itemId, size, newQty) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    updateCartQuantity,
    getTotalCartItems,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
