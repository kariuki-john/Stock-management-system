const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add a new product
router.post('/add-product', async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            date: new Date(),
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error recording product' });
    }
});

// Get all products
router.get('/get-products', async (req, res) => {
    const { searchTerm } = req.query;  // Get search term from query parameters
    try {
        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {}; // Case-insensitive search
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching products' });
    }
});

// Update product stock (for when a sale is made)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { quantitySold } = req.body; // Assuming quantitySold is passed in the request body

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Deduct quantity sold from the stock
        if (product.quantity >= quantitySold) {
            product.quantity -= quantitySold;
        } else {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Save the updated product
        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error updating product stock' });
    }
});


// Delete product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
