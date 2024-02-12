// paymentController.js
require("dotenv").config(); // Load environment variables from .env file
const stripe = require("stripe")(process.env.CLIENT_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods:{
        enabled:true,
      }      
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createPaymentIntent };
