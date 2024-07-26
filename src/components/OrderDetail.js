import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/shop/orders/${id}`);
        setOrder(response.data);
        setNewStatus(response.data.status);
        setTrackingNumber(response.data.trackingNumber || '');
        setLoading(false);
      } catch (err) {
        setError('Error fetching order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`/api/shop/orders/${id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      setError('Error updating order status. Please try again.');
    }
  };

  const handleTrackingUpdate = async () => {
    try {
      await axios.put(`/api/shop/orders/${id}/tracking`, { trackingNumber });
      setOrder({ ...order, trackingNumber });
    } catch (err) {
      setError('Error updating tracking number. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-detail">
      <h2>Order #{order._id.slice(-6)}</h2>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>

      <h3>Items</h3>
      <ul className="list-group mb-3">
        {order.items.map((item) => (
          <li key={item._id} className="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 className="my-0">{item.item.name}</h6>
              <small className="text-muted">Quantity: {item.quantity}</small>
            </div>
            <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h3>Shipping Address</h3>
      <p>
        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country} {order.shippingAddress.zipCode}
      </p>

      <h3>Payment Method</h3>
      <p>{order.paymentMethod}</p>

      <h3>Update Order</h3>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          className="form-control"
          id="status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={handleStatusUpdate}>Update Status</button>
      </div>

      <div className="form-group mt-3">
        <label htmlFor="tracking">Tracking Number</label>
        <input
          type="text"
          className="form-control"
          id="tracking"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleTrackingUpdate}>Update Tracking</button>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate('/orders')}>Back to Orders</button>
    </div>
  );
};

export default OrderDetail;