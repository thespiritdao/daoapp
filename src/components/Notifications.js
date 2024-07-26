import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Set up polling to check for new notifications every 5 minutes
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification => 
        notification._id === notificationId ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className={notification.read ? 'read' : 'unread'}>
              <Link to={notification.link} onClick={() => markAsRead(notification._id)}>
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;