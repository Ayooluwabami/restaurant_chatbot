router.post('/', async (req, res) => {
  try {
    const { items } = req.body; 
    const order = await Order.create({ items });

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/current', async (req, res) => {
  try {
    const currentOrder = await Order.findOne({ status: 'active' }); 

    if (!currentOrder) {
      res.status(404).json({ message: 'No current order found' });
      return;
    }

    res.status(200).json({ currentOrder });
  } catch (error) {
    console.error('Error fetching current order:', error);
    res.status(500).json({ message: 'Error fetching current order' });
  }
});

router.post('/cancel', async (req, res) => {
  try {
    const currentOrder = await Order.findOneAndDelete({ status: 'active' }); 

    if (!currentOrder) {
      res.status(404).json({ message: 'No current order to cancel' });
      return;
    }

    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Error canceling order' });
  }
});