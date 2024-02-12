const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,   
    required: true,
    },
  
  paymentIntentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add other attributes as needed
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
