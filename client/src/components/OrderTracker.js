import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderTracker = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-tracker">
      <h2>Order #{order.orderNumber}</h2>
      <p>Status: {order.status}</p>
      <p>Item: {order.item.name}</p>
      <p>Price: ${order.item.price}</p>
      <p>Payment Method: {order.paymentMethod}</p>
      <p>Shipping Address: {order.address}</p>
      {order.trackingNumber && (
        <p>Tracking Number: {order.trackingNumber}</p>
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