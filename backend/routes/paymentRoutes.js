const express = require('express');
const router = express.Router();
const Sale = require('../models/Sales'); 
const Payment = require('../models/Payment'); // Import the Payment model

// GET all payments
router.get('/get-payments', async (req, res) => {
    try {
        const payments = await Payment.find(); // Fetch all payments from the database
        res.status(200).json(payments); // Respond with the list of payments
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error fetching payments' });
    }
});

// ADD a new payment
router.post('/add-payment', async (req, res) => {
    const { method, amount, transactionCode } = req.body;
    const payment = new Payment({
        method,
        amount,
        transactionCode,
        date: new Date(),
    });

    try {
        await payment.save(); // Save the new payment to the database
        res.status(201).json(payment); // Respond with the saved payment
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error recording payment' });
    }
});

// DELETE a payment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findByIdAndDelete(id); // Delete the payment by ID
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error deleting payment' });
    }
});

// Verify if the MPESA transaction code is unique
router.get('/verify-transaction/:transactionCode', async (req, res) => {
    const { transactionCode } = req.params;
    try {
        const payment = await Payment.findOne({ transactionCode });
        if (payment) {
            return res.status(200).json({ exists: true });
        }
        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error checking transaction code' });
    }
});

//inserting a sale
router.post('/record-sale', async (req, res) => {
    const { productName, quantity, amount, paymentMethod, transactionCode } = req.body;
    
    try {
        // Create a new sale
        const newSale = new Sale({
            productName,
            quantity,
            amount,
            paymentMethod,
            transactionCode,
            date: new Date(),
        });

        // If paymentMethod is M-Pesa, ensure transactionCode is provided and unique
        if (paymentMethod === 'M-Pesa' && !transactionCode) {
            return res.status(400).json({ message: 'Transaction code is required for M-Pesa payments' });
        }

        // If payment method is M-Pesa, check if transaction code is unique
        if (paymentMethod === 'M-Pesa') {
            const existingPayment = await Payment.findOne({ transactionCode });
            if (existingPayment) {
                return res.status(400).json({ message: 'Transaction code must be unique' });
            }
        }

        // Save the sale to the database
        await newSale.save();
        res.status(201).json({ message: 'Sale recorded successfully', sale: newSale });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error recording sale' });
    }
});

// Get all sales along with their payment details
router.get('/get-sales', async (req, res) => {
    try {
        // Fetch all sales and populate payment details (transaction code, method, etc.)
        const sales = await Sale.find()
            .populate('paymentId', 'method amount transactionCode'); // Assuming Sale references Payment through paymentId
        res.status(200).json(sales);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error fetching sales data' });
    }
});

module.exports = router;
