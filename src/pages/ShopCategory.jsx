import React, { useContext, useState } from "react";
import "./Css/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item from "../components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  const [sortOption, setSortOption] = useState("default");

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredProducts = all_product.filter(
    (item) => item.category === props.category
  );

  const getLowestPrice = (variations) => {
    if (!variations) return Infinity;
    return Math.min(...Object.values(variations).map((v) => v.new_price));
  };
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return getLowestPrice(a.variations) - getLowestPrice(b.variations);
      case "price-desc":
        return getLowestPrice(b.variations) - getLowestPrice(a.variations);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {sortedProducts.length}</span> products
        </p>

        <div className="shopcategory-sort">
          <select value={sortOption} onChange={handleSortChange}>
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
        </div>
      </div>

      <div className="shopcategory-products">
        {sortedProducts.map((item, idx) => (
          <Item
            key={idx}
            id={item.id}
            name={item.name}
            image={item.image}
            variations={item.variations}
          />
        ))}
      </div>

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;
