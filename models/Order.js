const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  items: [{
    name: String,
    quantity: Number,
    price: { type: Number, required: true },
    options: { type: String },
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'placed', 'cancelled'],
    default: 'active'
  }
});

orderSchema.set('autoIndex', false);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
