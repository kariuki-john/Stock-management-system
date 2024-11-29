import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa'; // Import icons

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(0); // For restocking quantity
  const [showRestockModal, setShowRestockModal] = useState(false); // To control restock modal visibility
  const [selectedProductId, setSelectedProductId] = useState(null); // Store product ID for restock or delete

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openRestockModal = (productId) => {
    setSelectedProductId(productId);
    setShowRestockModal(true);
  };
  const closeRestockModal = () => setShowRestockModal(false);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products/get-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      alert('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/products/add-product',
        { name, description, price, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSuccess(true);
      setAlertMessage('Product added successfully!');
      setShowAlert(true);
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setShowModal(false); // Close the modal after success
      fetchProducts();
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 5 seconds
      }, 5000);
    } catch (error) {
      setIsSuccess(false);
      setAlertMessage('Failed to add product.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false); // Hide the alert after 5 seconds
      }, 5000);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/delete-product/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Re-fetch products after deletion
      setShowAlert(true);
      setAlertMessage('Product deleted successfully!');
      setIsSuccess(true);
      setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
      closeRestockModal(); // Close the delete confirmation modal
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowAlert(true);
      setAlertMessage('Failed to delete product.');
      setIsSuccess(false);
      setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
    }
  };

  // Handle editing a product (populate the form with existing product data)
  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setQuantity(product.quantity);
    openModal(); // Open the modal for editing
  };

  // Handle updating product quantity (restocking)
  const handleRestockProduct = async () => {
    try {
      if (restockQuantity <= 0) {
        setAlertMessage('Quantity must be greater than 0!');
        setIsSuccess(false);
        setShowAlert(true);
        return;
      }

      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/products/update-product/${selectedProductId}`,
        { quantity: restockQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts(); // Re-fetch products after updating
      setShowRestockModal(false); // Close the restock modal after success
      setAlertMessage('Product restocked successfully!');
      setIsSuccess(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000); // Hide the alert after 5 seconds
    } catch (error) {
      console.error('Error restocking product:', error);
      setAlertMessage('Failed to restock product.');
      setIsSuccess(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000); // Hide the alert after 5 seconds
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg py-4 px-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Add Product
        </button>
      </header>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg animate__animated animate__fadeIn animate__faster">
            <h2 className="text-xl font-semibold mb-4">{name ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  {name ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg flex flex-col items-center border-2 ${
              isSuccess ? 'border-green-500' : 'border-red-500'
            } animate__animated animate__fadeIn animate__faster`}
          >
            <div
              className={`flex justify-center items-center bg-${
                isSuccess ? 'green' : 'red'
              }-500 text-white w-12 h-12 rounded-full mb-4`}
            >
              <span className="text-3xl">{isSuccess ? '✔' : '❌'}</span>
            </div>
            <span className="text-lg text-center">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg animate__animated animate__fadeIn animate__faster">
            <h2 className="text-xl font-semibold mb-4">Restock Product</h2>
            <input
              type="number"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Enter quantity to add"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleRestockProduct}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Restock
              </button>
              <button
                onClick={closeRestockModal}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.description}</td>
                <td className="px-4 py-2">{product.price} KES</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2 flex space-x-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setSelectedProductId(product._id)}
                    className="text-red-600 hover:text-red-800"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                  >
                    <FaTrash />
                  </button>
                  {product.quantity === 0 && (
                    <button
                      onClick={() => openRestockModal(product._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaPlusCircle />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductForm;
