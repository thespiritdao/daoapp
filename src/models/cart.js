const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [CartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

CartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity, price });
  }
  
  this.calculateTotalPrice();
  return this.save();
};

CartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  this.calculateTotalPrice();
  return this.save();
};

CartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  
  if (item) {
    item.quantity = quantity;
    this.calculateTotalPrice();
    return this.save();
  }
  
  return Promise.reject(new Error('Item not found in cart'));
};

CartSchema.methods.calculateTotalPrice = function() {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

CartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalPrice = 0;
  return this.save();
};

module.exports = mongoose.model('Cart', CartSchema);