// import { Link } from "react-router";
// import "./Item.css";

// const Item = (props) => {

//   return (
//     <div className="item">
//       <Link to={`/product/${props.id}`}>
//         <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt="" />
//       </Link>
//       <p>{props.name}</p>
//       <div className="item-price">
//         <div className="item-price-new">${props.new_price}</div>
//         <div className="item-price-old">${props.old_price}</div>
//       </div>
//     </div>
//   );
// };

// export default Item;
import { Link } from "react-router";
import "./Item.css";

const Item = (props) => {
  const variations = Object.values(props.variations || {});
  let priceRange = "N/A";

  if (variations.length > 0) {
    const prices = variations.map((v) => v.new_price);
    const minPrice = Math.min(...prices).toFixed(2);
    const maxPrice = Math.max(...prices).toFixed(2);
    priceRange = `$${minPrice} – $${maxPrice}`;
  }

  return (
    <div className="item">
      <Link to={`/product/${props.id}`}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={props.image}
          alt={props.name}
        />
      </Link>
      <p>{props.name}</p>
      <div className="item-price">
        <div className="item-price-new">{priceRange}</div>
      </div>
    </div>
  );
};

export default Item;