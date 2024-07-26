const Notification = require('../models/notification');
const User = require('../models/user');

// Function to create a new notification
async function createNotification(userId, type, message, relatedId) {
  try {
    const newNotification = new Notification({
      userId,
      type,
      message,
      relatedId,
      onModel: 'Proposal'
    });
    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Function to send notifications to all users
async function sendNotificationToAllUsers(type, message, relatedId) {
  try {
    const users = await User.find({}, '_id');
    const notifications = users.map(user => ({
      userId: user._id,
      type,
      message,
      relatedId,
      onModel: 'Proposal'
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error sending notifications to all users:', error);
    throw error;
  }
}

module.exports = {
  createNotification,
  sendNotificationToAllUsers
};