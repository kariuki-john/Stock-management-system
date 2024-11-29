// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'M-Pesa'], required: true },
    transactionCode: { type: String, unique: true },  // Only required for M-Pesa
    date: { type: Date, default: Date.now },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },  // Reference to payment details if necessary
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
