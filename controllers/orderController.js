const Order = require('../models/Order');
const logger = require('../logger');

const updateOrder = async (req, res) => {
  try {
    const { orderId, updatedItems } = req.body;

    // Validate orderId and updatedItems
    if (!orderId || !updatedItems || !Array.isArray(updatedItems)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { items: updatedItems }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    logger.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

module.exports = {
  updateOrder
};
