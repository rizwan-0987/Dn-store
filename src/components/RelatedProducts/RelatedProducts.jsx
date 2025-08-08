import React from 'react'
import './RelatedProducts.css'
import data_porduct from '../assets/data'
import Item from "../Item/Item"

const RelatedProducts = () => {
  return (
    
    <div className='relatedproducts'>
      
      <h1>RELATED PRODUCTS</h1>
      <hr />
      <div className="relatedproducts-item">
      
        {data_porduct.map((item, idx) => {
          return (
            <Item
              key={idx}
              id={item.id}
              name={item.name}
              image={item.image}
              variations={item.variations}
            />
          );
        })}

      </div>
      
    </div>
  )
}

export default RelatedProducts
