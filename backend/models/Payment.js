
const mongoose = require('mongoose');

// Payment schema definition
const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionCode: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the Payment model based on the schema
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
