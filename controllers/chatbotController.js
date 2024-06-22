const logger = require('../logger');
const { MenuItem, Order } = require('../models');

// Function to start the chatbot and provide initial options
const startChat = async (req, res) => {
  try {
    const optionsMessage = `Welcome to our restaurant chatbot! Here are your options:\n\n
    Select 1: Place an order\n\n
    Select 99: Checkout order\n\n
    Select 98: See order history\n\n
    Select 97: See current order\n\n
    Select 0: Cancel order`;

    res.json({ message: optionsMessage });
  } catch (error) {
    logger.error('Error starting chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to fetch menu items from the database
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({ menuItems });
  } catch (error) {
    logger.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};

// Function to place an order based on received items
const placeOrder = async (req, res) => {
  try {
    const { itemIds } = req.body;

    // Validate itemIds and create order
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      res.status(400).json({ error: 'Please provide valid items to place an order' });
      return;
    }

    const items = await MenuItem.find({ _id: { $in: itemIds } });

    if (items.length !== itemIds.length) {
      res.status(400).json({ error: 'Some items selected are not valid' });
      return;
    }

    const order = await Order.create({ items: itemIds });

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    logger.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

// Function to checkout the current active order
const checkoutOrder = async (req, res) => {
  try {
    const currentOrder = await Order.findOne({ status: 'active' });

    if (!currentOrder) {
      res.status(404).json({ message: 'No active order to checkout' });
      return;
    }

    // Update order status to 'placed' (assuming you need to mark it as placed after checkout)
    currentOrder.status = 'placed';
    await currentOrder.save();

    res.status(200).json({ message: 'Order checked out successfully', order: currentOrder });
  } catch (error) {
    logger.error('Error checking out order:', error);
    res.status(500).json({ message: 'Error checking out order' });
  }
};

// Function to fetch all placed orders from the database
const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'placed' });

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: 'No orders found' });
      return;
    }

    res.status(200).json({ orders });
  } catch (error) {
    logger.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

// Function to fetch the current active order from the database
const getCurrentOrder = async (req, res) => {
  try {
    const currentOrder = await Order.findOne({ status: 'active' });

    if (!currentOrder) {
      res.status(404).json({ message: 'No current order found' });
      return;
    }

    res.status(200).json({ currentOrder });
  } catch (error) {
    logger.error('Error getting current order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to cancel the current active order in the database
const cancelOrder = async (req, res) => {
  try {
    const currentOrder = await Order.findOneAndDelete({ status: 'active' });

    if (!currentOrder) {
      res.status(404).json({ message: 'No current order to cancel' });
      return;
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    logger.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { startChat, getMenuItems, placeOrder, checkoutOrder, getOrderHistory, getCurrentOrder, cancelOrder };