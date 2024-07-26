import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthService } from '../services/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = AuthService.getToken();
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
      const cartTotal = response.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(cartTotal);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart. Please try again later.');
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    try {
      const token = AuthService.getToken();
      const response = await axios.post(`${API_URL}/orders`, 
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (paymentMethod === 'crypto') {
        // Handle crypto payment
        // You might want to redirect to a crypto payment gateway or show QR code here
        alert('Please complete the crypto payment using the provided address.');
      } else if (paymentMethod === 'fiat') {
        // Handle fiat payment
        // You might want to integrate with Stripe or another payment processor here
        alert('Please complete the fiat payment using the provided payment form.');
      }

      // After successful payment
      history.push(`/orders/${response.data.orderId}`);
    } catch (err) {
      setError('Checkout failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <h4>Total: ${total.toFixed(2)}</h4>
      </div>
      <div className="payment-method">
        <h3>Select Payment Method</h3>
        <label>
          <input
            type="radio"
            value="crypto"
            checked={paymentMethod === 'crypto'}
            onChange={handlePaymentMethodChange}
          />
          Cryptocurrency ($SELF token)
        </label>
        <label>
          <input
            type="radio"
            value="fiat"
            checked={paymentMethod === 'fiat'}
            onChange={handlePaymentMethodChange}
          />
          Fiat Currency (via Stripe)
        </label>
      </div>
      <button onClick={handleCheckout} disabled={!paymentMethod}>
        Complete Purchase
      </button>
    </div>
  );
};

export default Checkout;