import React from 'react'
import "./NewCollections.css"
import new_collections from "../assets/new_collections"
import Item from '../Item/Item'

const NewCollections = () => {
  return (
    <div className="new-collection">
      <h1>New Collections</h1>
      <hr />
      <div className="collections">
        {new_collections.map((Items, idx) => {
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

export default NewCollections
