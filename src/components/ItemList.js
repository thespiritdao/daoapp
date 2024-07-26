import React from 'react';

const ItemList = ({ products, addToCart }) => {
  return (
    <div className="item-list">
      <h2>Items for Sale</h2>
      {products.length === 0 ? (
        <p>No items available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              {product.image && <img src={product.image} alt={product.name} />}
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;