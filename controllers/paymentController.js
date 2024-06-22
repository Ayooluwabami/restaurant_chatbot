const stripe = require('stripe')('your-stripe-secret-key');
const logger = require('../logger');

const processPayment = async (req, res) => {
  try {
    const { amount, currency, source, description } = req.body;

    // Validate payment data
    if (!amount || !currency || !source || !description) {
      return res.status(400).json({ message: 'Invalid payment data' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      source,
      description
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

module.exports = {
  processPayment
};
