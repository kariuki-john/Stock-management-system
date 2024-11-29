import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all payment records
  const fetchPayments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/payments/get-payments');
      setPaymentRecords(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  // Handle form submission
  const handleAddPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/payments/add-payment',
        { method, amount, transactionCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMessage('Payment recorded successfully!');
      setModalType('success');
      setPaymentRecords((prevRecords) => [
        ...prevRecords,
        response.data,
      ]);
      setShowSuccessModal(true);
      setShowPaymentModal(false);
      setMethod('');
      setAmount('');
      setTransactionCode('');
    } catch (error) {
      setModalMessage('Failed to record payment. Please try again.');
      setModalType('error');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      {/* Header */}
      <div className="w-full flex justify-between px-4 py-3 bg-indigo-600 text-white shadow-md border-b border-indigo-700">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-indigo-800 text-white px-6 py-2 rounded-md hover:bg-indigo-900"
        >
          Record Payment
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-xs animate__animated animate__fadeIn animate__faster">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Record Payment</h2>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="M-Pesa">M-Pesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction Code</label>
                <input
                  type="text"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Record Payment'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-xs animate__animated animate__fadeIn animate__faster border-2 border-green-500">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center items-center bg-green-500 text-white w-14 h-14 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Success!</h3>
            <p className="text-center text-gray-600 mb-6">{modalMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-xs animate__animated animate__fadeIn animate__faster border-2 border-red-500">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center items-center bg-red-500 text-white w-14 h-14 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Error!</h3>
            <p className="text-center text-gray-600 mb-6">{modalMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Records */}
      <div className="w-full max-w-4xl mt-8 px-4 py-2 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Records</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Method</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Amount</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Transaction Code</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentRecords.map((payment, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{payment.method}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{payment.amount} KES</td>
                <td className="px-4 py-2 text-sm text-gray-800">{payment.transactionCode}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{new Date(payment.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentForm;
