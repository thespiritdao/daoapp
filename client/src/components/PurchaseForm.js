import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PurchaseForm = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('fiat');
  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/items/${itemId}`);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching item details. Please try again later.');
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/orders', {
        itemId,
        address,
        paymentMethod
      });
      navigate(`/order/${response.data._id}`);
    } catch (err) {
      setError('Error creating order. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="purchase-form">
      <h2>Purchase {item.name}</h2>
      <p>Price: ${item.price}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Delivery Address:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Payment Method:
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="fiat">Credit Card</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </label>
        </div>
        <button type="submit">Complete Purchase</button>
      </form>
    </div>
  );
};

export default PurchaseForm;