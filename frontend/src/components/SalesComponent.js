import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sales = () => {
    const [products, setProducts] = useState([]); // All products
    const [selectedProducts, setSelectedProducts] = useState([]); // Selected products
    const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering products
    const [paymentMethod, setPaymentMethod] = useState('cash'); // Payment method (cash or mpesa)
    const [transactionCode, setTransactionCode] = useState(''); // MPESA transaction code
    const [receipt, setReceipt] = useState(null); // Receipt details
    const [error, setError] = useState(''); // Error messages

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products/get-products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on the search term
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle product selection (allow multiple products)
    const handleProductChange = (e, product) => {
        const quantity = Number(e.target.value);
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p._id === product._id);
            if (existingProduct) {
                existingProduct.quantity = quantity; // Update existing product quantity
                return [...prev];
            } else {
                return [...prev, { ...product, quantity }];
            }
        });
    };

    // Handle payment method change
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value !== 'mpesa') {
            setTransactionCode(''); // Reset transaction code if not MPESA
        }
    };

    // Handle the Sell button click
    const handleSell = async () => {
        if (selectedProducts.length === 0) {
            setError('Please select at least one product.');
            return;
        }

        if (paymentMethod === 'mpesa' && !transactionCode) {
            setError('Please enter a unique MPESA transaction code.');
            return;
        }

        // Check if transaction code is unique (mock implementation)
        try {
            if (paymentMethod === 'mpesa') {
                const res = await axios.get(`http://localhost:5000/api/payments/verify-transaction/${transactionCode}`);
                if (res.data.exists) {
                    setError('MPESA transaction code already used.');
                    return;
                }
            }

            // Generate receipt data
            let totalAmount = 0;
            selectedProducts.forEach((product) => {
                totalAmount += product.price * product.quantity;
            });

            const receiptData = {
                products: selectedProducts,
                totalAmount,
                paymentMethod,
                transactionCode: paymentMethod === 'mpesa' ? transactionCode : null,
            };
            setReceipt(receiptData); // Set receipt details

            // Update product quantities in database after sale
            for (const product of selectedProducts) {
                await axios.put(`http://localhost:5000/api/products/${product._id}`, {
                    quantitySold: product.quantity,
                });
            }

            // Reset the selection after the sale
            setSelectedProducts([]);
            setTransactionCode('');
            setPaymentMethod('cash');
            setError('');
        } catch (error) {
            console.error('Error processing sale:', error);
            setError('Error processing sale. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Sales</h1>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
                {/* Searchable Product Selection */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Search Products</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded"
                        placeholder="Search for a product"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Display filtered products */}
                    {searchTerm && (
                        <div className="mt-2 border rounded shadow-md max-h-40 overflow-auto">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="p-2 hover:bg-gray-200 cursor-pointer">
                                    <label className="block text-gray-700">{product.name} - KES {product.price}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-3 border rounded"
                                        placeholder="Quantity"
                                        onChange={(e) => handleProductChange(e, product)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Method Selection */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Payment Method</label>
                    <select
                        className="w-full p-3 border rounded"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                    >
                        <option value="cash">Cash</option>
                        <option value="mpesa">MPESA</option>
                    </select>
                </div>

                {/* MPESA Transaction Code */}
                {paymentMethod === 'mpesa' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">MPESA Transaction Code</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded"
                            placeholder="Enter MPESA Transaction Code"
                            value={transactionCode}
                            onChange={(e) => setTransactionCode(e.target.value)}
                        />
                    </div>
                )}

                {/* Error Messages */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Sell Button */}
                <button
                    className="w-full bg-purple-500 text-white font-bold py-3 rounded hover:bg-purple-600"
                    onClick={handleSell}
                >
                    Sell
                </button>
            </div>

            {/* Receipt Section */}
            {receipt && (
                <div className="mt-6 bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
                    <h2 className="text-xl font-bold mb-4">Receipt</h2>
                    {receipt.products.map((product) => (
                        <div key={product._id} className="mb-2">
                            <p><strong>Product:</strong> {product.name}</p>
                            <p><strong>Price per unit:</strong> KES {product.price}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><strong>Total:</strong> KES {product.price * product.quantity}</p>
                        </div>
                    ))}
                    <p className="font-semibold">Total Amount: KES {receipt.totalAmount}</p>
                    {receipt.paymentMethod === 'mpesa' && (
                        <p><strong>MPESA Transaction Code:</strong> {receipt.transactionCode}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Sales;
