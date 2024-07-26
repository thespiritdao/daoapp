import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthService } from '../services/auth';
import { debounce } from '../utils/rateLimit';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [searchTerm]);

  const fetchProducts = async (search = '') => {
    try {
      const token = AuthService.getToken();
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = AuthService.getToken();
      await axios.post(`${API_URL}/cart/add`, { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added to cart successfully!');
    } catch (err) {
      setError('Failed to add product to cart. Please try again.');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const debouncedSearch = debounce(handleSearch, 300);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="shop-container">
      <h2>Shop</h2>
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;