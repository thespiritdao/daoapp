import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ItemDetail = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/shop/items/${id}`);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching item details. Please try again later.');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/shop/items/${id}`);
        navigate('/items');
      } catch (err) {
        setError('Error deleting item. Please try again later.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="item-detail">
      <h2>{item.name}</h2>
      <img src={item.imageUrl} alt={item.name} className="img-fluid mb-3" />
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Stock:</strong> {item.stock}</p>
      <p><strong>Tags:</strong> {item.tags.join(', ')}</p>
      <p><strong>Created by:</strong> {item.creator.username}</p>
      <p><strong>Created at:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
      <p><strong>Last updated:</strong> {new Date(item.updatedAt).toLocaleDateString()}</p>
      
      <div className="mt-3">
        <Link to={`/items/${id}/edit`} className="btn btn-primary mr-2">Edit Item</Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete Item</button>
      </div>
      
      <Link to="/items" className="btn btn-secondary mt-3">Back to Item List</Link>
    </div>
  );
};

export default ItemDetail;