import React from 'react'
import "./Popular.css"
import data_product from "../assets/data"
import Item from '../Item/Item'
const Popular = () => {
  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((Items,idx)=>{
                  return (
                    <Item
                      key={idx}
                      id={Items.id}
                      name={Items.name}
                      image={Items.image}
                      variations={Items.variations}
                    />
                  );
              })}
       
      </div>
    </div>
  );
}

export default Popular
