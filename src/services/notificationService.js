import axios from 'axios';

const BASE_URL = '/api/notifications';

const notificationService = {
  getAll: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  createNotification: async (notificationData) => {
    try {
      const response = await axios.post(BASE_URL, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await axios.delete(`${BASE_URL}/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  subscribeToNotifications: (callback) => {
    // This is a placeholder for real-time notifications
    // In a real application, you might use WebSockets or Server-Sent Events here
    const intervalId = setInterval(async () => {
      const notifications = await notificationService.getAll();
      callback(notifications);
    }, 60000); // Check for new notifications every minute

    return () => clearInterval(intervalId); // Return a function to unsubscribe
  }
};

export default notificationService;