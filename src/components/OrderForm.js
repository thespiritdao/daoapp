import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/shop/cart');
        setCart(response.data.items);
      } catch (err) {
        setError('Error fetching cart. Please try again.');
      }
    };
    fetchCart();
  }, []);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          item: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        paymentMethod,
        shippingAddress
      };

      await axios.post('/api/shop/orders', orderData);
      setLoading(false);
      navigate('/orders');
    } catch (err) {
      setError('Error placing order. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div>Your cart is empty. Add items before placing an order.</div>;

  return (
    <div className="order-form">
      <h2>Place Order</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <h3>Shipping Address</h3>
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            className="form-control"
            id="street"
            name="street"
            value={shippingAddress.street}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            className="form-control"
            id="state"
            name="state"
            value={shippingAddress.state}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            className="form-control"
            id="country"
            name="country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="text"
            className="form-control"
            id="zipCode"
            name="zipCode"
            value={shippingAddress.zipCode}
            onChange={handleAddressChange}
            required
          />
        </div>

        <h3>Payment Method</h3>
        <div className="form-group">
          <select
            className="form-control"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Crypto">Cryptocurrency</option>
            <option value="Stripe">Credit Card (Stripe)</option>
          </select>
        </div>

        <h3>Order Summary</h3>
        <ul className="list-group mb-3">
          {cart.map(item => (
            <li key={item.product._id} className="list-group-item d-flex justify-content-between">
              <div>
                <h6 className="my-0">{item.product.name}</h6>
                <small className="text-muted">Quantity: {item.quantity}</small>
              </div>
              <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
          <li className="list-group-item d-flex justify-content-between">
            <strong>Total</strong>
            <strong>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</strong>
          </li>
        </ul>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;