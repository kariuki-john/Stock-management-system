// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddProduct from './components/Products/ProductForm';
import AddPayment from './components/Payments/PaymentForm';
import Dashboard from './pages/Dashboard';
import Sales from './components/SalesComponent';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Wrap routes with the Layout */}
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Dashboard/>
                        </Layout>
                    }
                />
                
                <Route
                    path="/add-product"
                    element={
                        <Layout>
                            <AddProduct />
                        </Layout>
                    }
                />
            
                <Route
                    path="/add-payment"
                    element={
                        <Layout>
                            <AddPayment />
                        </Layout>
                    }
                />

                <Route
                path='/sales'
                element={
                    <Layout>
                        <Sales/>
                    </Layout>
                }
                />
            </Routes>
        </Router>
    );
};

export default App;
