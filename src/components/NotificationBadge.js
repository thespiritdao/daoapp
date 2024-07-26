import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        const unreadNotifications = response.data.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadNotifications();
    // Set up an interval to fetch notifications every minute
    const interval = setInterval(fetchUnreadNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className="notification-badge">
      {unreadCount}
    </span>
  );
};

export default NotificationBadge;