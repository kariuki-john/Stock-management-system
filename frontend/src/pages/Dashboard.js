import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    // State for statistics
    const [stats, setStats] = useState({
        productsCount: 0,
        mpesaPayments: 0,
        cashPayments: 0,
        productsSold: 0,
        totalSales: 0, // New state for total sales
    });

    const fetchDashboardData = async () => {
        try {
            // Fetch products
            const { data: products } = await axios.get('http://localhost:5000/api/products/get-products');
            const productsCount = products.length;
            const productsSold = products.reduce((sum, product) => sum + (product.sold || 0), 0);

            // Fetch payments
            const { data: payments } = await axios.get('http://localhost:5000/api/payments/get-payments');
            const mpesaPayments = payments
                .filter((payment) => payment.method === 'M-Pesa')
                .reduce((sum, payment) => sum + (payment.amount || 0), 0);
            const cashPayments = payments
                .filter((payment) => payment.method === 'Cash')
                .reduce((sum, payment) => sum + (payment.amount || 0), 0);
            
            // Calculate total sales (sum of all payments)
            const totalSales = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

            // Update stats
            setStats({ productsCount, mpesaPayments, cashPayments, productsSold, totalSales });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData(); // Fetch data on component mount
    }, []);

    const [sales, setSales] = useState([]); // Sales data

    // Fetch sales and payment data
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/payments/get-sales');
                setSales(data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };
        fetchSales();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               
                
                {/* Card 2: M-Pesa Payments */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-700">Total M-Pesa Payments (KES)</h2>
                    <p className="text-3xl font-bold text-green-600 mt-4">
                        KES {stats.mpesaPayments.toLocaleString()}
                    </p>
                </div>
                
                {/* Card 3: Cash Payments */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-700">Total Cash Payments (KES)</h2>
                    <p className="text-3xl font-bold text-green-600 mt-4">
                        KES {stats.cashPayments.toLocaleString()}
                    </p>
                </div>
                
                {/* Card 4: Products Sold */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-700">Products Sold</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-4">
                        {stats.productsSold}
                    </p>
                </div>

                {/* Card 5: Total Sales */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-700">Total Sales (KES)</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-4">
                        KES {stats.totalSales.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Sold Items Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Sold Items</h2>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4 text-left">Product Name</th>
                            <th className="py-2 px-4 text-left">Quantity</th>
                            <th className="py-2 px-4 text-left">Amount</th>
                            <th className="py-2 px-4 text-left">Payment Method</th>
                            <th className="py-2 px-4 text-left">Transaction Code</th>
                            <th className="py-2 px-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-4 text-center">No sales records found</td>
                            </tr>
                        ) : (
                            sales.map((sale, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2 px-4">{sale.productName}</td>
                                    <td className="py-2 px-4">{sale.quantity}</td>
                                    <td className="py-2 px-4">KES {sale.amount}</td>
                                    <td className="py-2 px-4">{sale.paymentMethod}</td>
                                    <td className="py-2 px-4">{sale.transactionCode || 'N/A'}</td>
                                    <td className="py-2 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
