import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../assets/cart_cross_icon.png";

const CartItems = () => {
  const {
    all_product,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    updateCartQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
  } = useContext(ShopContext);

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {cartItems.map((item, index) => {
        const product = all_product.find((p) => p.id === item.id);
        if (!product) return null;

        const variation = product.variations[item.size];
        const maxAllowed = Math.min(variation.stock, 3);

        return (
          <div key={index}>
            <div className="cartitems-format cartitems-format-main">
              <img
                className="carticon-product-icon"
                src={product.image}
                alt={product.name}
              />
              <p>
                {product.name} ({item.size})
              </p>
              <p>${item.price}</p>

              <div className="cartitems-quantity-buttons">
                <button
                  onClick={() =>
                    updateCartQuantity(item.id, item.size, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartQuantity(item.id, item.size, item.quantity + 1)
                  }
                  disabled={item.quantity >= maxAllowed}
                >
                  +
                </button>
              </div>

              <p>${item.price * item.quantity}</p>

              <img
                className="cartitem-remove-icon"
                src={remove_icon}
                onClick={() => removeFromCart(item.id, item.size)}
                alt="Remove"
              />
            </div>
            <hr />
          </div>
        );
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
