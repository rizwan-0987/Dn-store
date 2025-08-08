import React, { useContext, useState, useEffect, useMemo } from "react";
import "./ProductDisplay.css";
import star_icon from "../assets/star_icon.png";
import star_dull_icon from "../assets/star_dull_icon.png";
import plus_icon from "../assets/plus.png";
import minus_icon from "../assets/minus.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ShopContext } from "../../Context/ShopContext";
import { loadReviews } from "../../lib/reviews"; 

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("S");
  const variation = product.variations[selectedSize];
  const inStock = variation.stock > 0;

  const [reviews, setReviews] = useState(() => loadReviews(product.id));
  useEffect(() => {
    setReviews(loadReviews(product.id));
  }, [product.id]);

  const { reviewCount, avg, avgWhole } = useMemo(() => {
    const count = reviews.length;
    const average = count
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count
      : 0;
    const whole = Math.floor(average);
    return { reviewCount: count, avg: average, avgWhole: whole };
  }, [reviews]);

  return (
    <div className="productdisplay">
      <ToastContainer />
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div
          className="productdisplay-right-star"
          title={
            reviewCount ? `Average: ${avg.toFixed(1)} / 5` : "No reviews yet"
          }
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={i <= avgWhole ? star_icon : star_dull_icon}
              alt=""
            />
          ))}
          <p>({reviewCount})</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            <s>${product.variations[selectedSize].old_price}</s>
          </div>
          <div className="productdisplay-right-price-new">
            ${product.variations[selectedSize].new_price}
          </div>
        </div>

        <div className="productdisplay-right-description">
          <p>{product.shortDescription}</p>
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() => setSelectedSize(size)}
                className={selectedSize === size ? "selected" : ""}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="productdisplay-quantity">
          <img
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            src={minus_icon}
            alt=""
            width={20}
            height={20}
          />

          <input
            value={quantity}
            min={1}
            max={Math.min(3, variation.stock)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setQuantity("");
                return;
              }
              const num = parseInt(val, 10);
              if (!isNaN(num)) {
                const allowedMax = Math.min(3, variation.stock);
                setQuantity(Math.min(Math.max(num, 1), allowedMax));
              }
            }}
            onBlur={() => {
              if (quantity === "") setQuantity(1);
            }}
          />

          <img
            onClick={() =>
              setQuantity((prev) =>
                Math.min(prev + 1, Math.min(3, variation.stock))
              )
            }
            src={plus_icon}
            alt=""
            width={20}
            height={20}
          />
        </div>

        <p className="stock-info"> Only {variation.stock} left in stock</p>

        <button
          onClick={() => {
            if (inStock) {
              addToCart(
                product.id,
                quantity,
                selectedSize,
                variation.new_price
              );
              toast.success(`${product.name} X ${quantity} added to cart!`, {
                position: "top-right",
                autoClose: 1000,
                theme: "colored",
              });
            }
          }}
          disabled={!inStock}
          style={{
            backgroundColor: inStock ? "#ff5a5f" : "#ccc",
            cursor: inStock ? "pointer" : "not-allowed",
          }}
        >
          {inStock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>

        <p className="productdisplay-right-category">
          <span>Category:</span> {product.categorytag}
        </p>
        <p className="productdisplay-right-tags productdisplay-right-category">
          <span>Tags:</span> {product.tags}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
