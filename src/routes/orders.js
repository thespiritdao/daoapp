const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Item = require('../models/item');
const auth = require('../middleware/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, address, paymentMethod } = req.body;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const order = new Order({
      user: req.user.id,
      item: itemId,
      address,
      paymentMethod,
      status: 'Processing',
      orderNumber: Math.floor(100000 + Math.random() * 900000), // Generate a random 6-digit order number
      timeline: [{ status: 'Order Placed', timestamp: new Date() }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Estimate delivery in 7 days
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('item');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get a specific order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('item');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, description } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is an admin (you'll need to implement this check)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }

    order.status = status;
    order.timeline.push({ status, description, timestamp: new Date() });

    if (status === 'Shipped') {
      order.trackingNumber = Math.random().toString(36).substring(7).toUpperCase(); // Generate a random tracking number
      order.carrier = 'FedEx'; // You can randomize this or set based on your business logic
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
});

module.exports = router;