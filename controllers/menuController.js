const MenuItem = require('../models/MenuItem');
const logger = require('../logger');

const updateMenuItem = async (req, res) => {
  try {
    const { menuItemId, updatedItem } = req.body;

    // Validate menuItemId and updatedItem
    if (!menuItemId || !updatedItem) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, updatedItem, { new: true });

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item updated successfully', updatedMenuItem });
  } catch (error) {
    logger.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

module.exports = {
  updateMenuItem
};
