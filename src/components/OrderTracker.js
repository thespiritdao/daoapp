import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderTracker = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch order details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>No order found</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'blue';
      case 'Shipped': return 'orange';
      case 'Delivered': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="order-tracker">
      <h2>Order #{order.orderNumber}</h2>
      <p>Status: <span style={{color: getStatusColor(order.status)}}>{order.status}</span></p>
      <p>Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
      
      <h3>Order Details</h3>
      <p>Item: {order.item.name}</p>
      <p>Price: ${order.item.price}</p>
      <p>Payment Method: {order.paymentMethod}</p>
      
      <h3>Shipping Information</h3>
      <p>Address: {order.address}</p>
      
      {order.trackingNumber && (
        <div>
          <h3>Tracking Information</h3>
          <p>Tracking Number: {order.trackingNumber}</p>
          <p>Carrier: {order.carrier}</p>
          <a href={`https://${order.carrier}.com/track/${order.trackingNumber}`} target="_blank" rel="noopener noreferrer">
            Track Package
          </a>
        </div>
      )}
      
      <h3>Order Timeline</h3>
      <ul>
        {order.timeline.map((event, index) => (
          <li key={index}>
            <strong>{event.status}</strong> - {new Date(event.timestamp).toLocaleString()}
            {event.description && <p>{event.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTracker;