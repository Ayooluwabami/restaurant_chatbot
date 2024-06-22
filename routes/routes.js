const express = require('express');
const router = express.Router();
const {
  startChat,
  getMenuItems,
  placeOrder,
  getOrderHistory,
  getCurrentOrder,
  cancelOrder
} = require('../controllers/chatbotController');
const { updateMenuItem } = require('../controllers/menuController');
const { updateOrder } = require('../controllers/orderController');
const { processPayment } = require('../controllers/paymentController');
const { messageSchema } = require('../validators/chatbotValidator');
const logger = require('../logger');

// Route to start the chat
router.get('/start', async (req, res) => {
  try {
    const optionsMessage = `Welcome to Restaurant ChatBot!\n\nPlease select one of the following options:\nSelect 1: Place an order\nSelect 99: Checkout order\nSelect 98: See order history\nSelect 97: See current order\nSelect 0: Cancel order`;

    res.status(200).json({ message: optionsMessage });
  } catch (error) {
    logger.error('Error fetching options:', error);
    res.status(500).json({ message: 'Error fetching options' });
  }
});

// Route to fetch menu items
router.get('/menu', getMenuItems);

// Route to place an order
router.post('/order', placeOrder);

// Route to fetch order history
router.get('/orders', getOrderHistory);

// Route to fetch current active order
router.get('/order/current', getCurrentOrder);

// Route to cancel the current active order
router.post('/order/cancel', cancelOrder);

// Route to update a menu item by ID
router.put('/menu/:menuItemId', updateMenuItem);

// Route to update an order by ID
router.put('/order/:orderId', updateOrder);

// Route to process a payment
router.post('/payment/process', processPayment);

// Route to handle user messages
router.post('/message', async (req, res, next) => {
  try {
    await messageSchema.validateAsync(req.body);
    // Assuming processMessage is a function defined in chatbotController to handle user messages
    const response = await processMessage(req.body); // Assuming processMessage returns a response object
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
});

module.exports = router;
