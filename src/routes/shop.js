const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const CryptoPaymentService = require('../services/cryptoPayment');
const StripePaymentService = require('../services/stripePayment');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get user's cart
router.get('/cart', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/cart/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    await cart.addItem(productId, quantity, product.price);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/cart/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeItem(req.params.productId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item quantity in cart
router.put('/cart/update/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.updateItemQuantity(req.params.productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/cart/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.clearCart();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products (for shop page)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload new item
router.post('/items/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const imageUrl = req.file.path;

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      seller: req.user.id,
      stock: parseInt(stock)
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product uploaded successfully', product: newProduct });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ message: 'Error uploading product', error: error.message });
  }
});

// Process cryptocurrency payment
router.post('/payment/crypto', auth, async (req, res) => {
  try {
    const { fromAddress, amount, shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    if (cart.totalPrice !== parseFloat(amount)) {
      return res.status(400).json({ message: 'Payment amount does not match cart total' });
    }
    
    const toAddress = process.env.DAO_WALLET_ADDRESS;
    
    const tx = await CryptoPaymentService.makePayment(fromAddress, toAddress, amount);
    
    const order = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cart.totalPrice,
      paymentMethod: 'crypto',
      paymentId: tx.hash,
      shippingAddress
    });
    await order.save();
    
    await cart.clearCart();
    
    res.json({ message: 'Payment successful', transaction: tx, order });
  } catch (error) {
    console.error('Error processing crypto payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
});

// Create Stripe payment intent
router.post('/payment/stripe/create-intent', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const paymentIntent = await StripePaymentService.createPaymentIntent(cart.totalPrice);
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
});

// Confirm Stripe payment
router.post('/payment/stripe/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId, shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const paymentIntent = await StripePaymentService.confirmPayment(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const order = new Order({
        user: req.user.id,
        items: cart.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.totalPrice,
        paymentMethod: 'stripe',
        paymentId: paymentIntentId,
        shippingAddress
      });
      await order.save();
      
      await cart.clearCart();
      res.json({ message: 'Payment successful', paymentIntent, order });
    } else {
      res.status(400).json({ message: 'Payment failed', paymentIntent });
    }
  } catch (error) {
    console.error('Error confirming Stripe payment:', error);
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
});

// Get user's orders
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get single order
router.get('/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status (admin only)
router.put('/orders/:orderId/status', auth, async (req, res) => {
  try {
    // TODO: Add admin check here
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

module.exports = router;