import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching items. Please try again later.');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="item-list">
      <h2>Available Items</h2>
      {items.length === 0 ? (
        <p>No items available at the moment.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <Link to={`/purchase/${item._id}`}>Purchase</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;