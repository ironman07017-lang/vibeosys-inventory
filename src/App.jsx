import React, { useState, useReducer } from 'react';

// Initial state
const initialState = {
  products: [
    {
      id: 1,
      name: 'Vitamin Tablets',
      unitOfMeasure: 'box',
      category: 'Finished',
      expiryDate: '2026-12-31',
      materials: [
        { id: 1, name: 'Calcium Carbonate', unitOfMeasure: 'gm', quantity: 100, price: 50, tax: 50 },
        { id: 2, name: 'Vitamin D3', unitOfMeasure: 'gm', quantity: 10, price: 500, tax: 50 }
      ]
    }
  ]
};

// Reducer function
const inventoryReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    default:
      return state;
  }
};

// Material list component
const MaterialsList = ({ materials, onAdd, onRemove, onChange }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Raw Materials</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm transition"
        >
          <i className="fas fa-plus"></i> Add Material
        </button>
      </div>

      {materials.length === 0 ? (
        <p className="text-gray-500 text-sm">No materials added yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {materials.map((material, idx) => {
            const totalPrice = material.quantity * material.price;
            const tax = Math.round(totalPrice * 0.1);
            const totalAmount = totalPrice + tax;

            return (
              <div key={material.tempId || idx} className="bg-white p-3 rounded border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Material name"
                    value={material.name}
                    onChange={(e) => onChange(idx, { ...material, name: e.target.value })}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={material.unitOfMeasure}
                    onChange={(e) => onChange(idx, { ...material, unitOfMeasure: e.target.value })}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>ml</option>
                    <option>ltr</option>
                    <option>gm</option>
                    <option>kg</option>
                    <option>mtr</option>
                    <option>mm</option>
                    <option>box</option>
                    <option>units</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Quantity</label>
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => onChange(idx, { ...material, quantity: parseFloat(e.target.value) || 0 })}
                      className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Price (₹)</label>
                    <input
                      type="number"
                      value={material.price}
                      onChange={(e) => onChange(idx, { ...material, price: parseFloat(e.target.value) || 0 })}
                      className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Tax (₹)</label>
                    <input
                      type="text"
                      value={tax}
                      disabled
                      className="border rounded px-2 py-1 text-sm w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                  <span className="font-medium">Total: ₹{totalPrice.toFixed(2)} | Tax: ₹{tax} | Amount: ₹{totalAmount.toFixed(2)}</span>
                  <button
                    onClick={() => onRemove(idx)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Product form component
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    unitOfMeasure: 'units',
    category: 'Finished',
    expiryDate: '',
    materials: []
  });

  const [errors, setErrors] = useState({});

  const handleMaterialChange = (idx, material) => {
    const newMaterials = [...formData.materials];
    newMaterials[idx] = material;
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { tempId: Date.now(), name: '', unitOfMeasure: 'gm', quantity: 0, price: 0 }]
    });
  };

  const handleRemoveMaterial = (idx) => {
    const newMaterials = formData.materials.filter((_, i) => i !== idx);
    setFormData({ ...formData, materials: newMaterials });
  };

  const calculateTotalCost = () => {
    return formData.materials.reduce((sum, m) => {
      const totalPrice = m.quantity * m.price;
      const tax = Math.round(totalPrice * 0.1);
      return sum + totalPrice + tax;
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (formData.materials.length === 0) newErrors.materials = 'At least one material is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave({ ...formData, totalCost: calculateTotalCost() });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4 transition font-medium"
      >
        <i className="fas fa-arrow-left"></i> Back to Products
      </button>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {product ? 'Update Product' : 'Create New Product'}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit of Measure *</label>
            <select
              value={formData.unitOfMeasure}
              onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option>ml</option>
              <option>ltr</option>
              <option>gm</option>
              <option>kg</option>
              <option>mtr</option>
              <option>mm</option>
              <option>box</option>
              <option>units</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option>Finished</option>
              <option>Semi finished</option>
              <option>Subsidiary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Raw Materials</h3>
          <MaterialsList
            materials={formData.materials}
            onAdd={handleAddMaterial}
            onRemove={handleRemoveMaterial}
            onChange={handleMaterialChange}
          />
          {errors.materials && <p className="text-red-500 text-sm mt-2">{errors.materials}</p>}
        </div>

        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Product Cost</p>
              <p className="text-3xl font-bold text-blue-600">₹{calculateTotalCost().toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm mb-1">Materials Count</p>
              <p className="text-2xl font-bold text-gray-800">{formData.materials.length}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-linear-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold transition shadow-md"
          >
            <i className="fas fa-save mr-2"></i>
            {product ? 'Update Product' : 'Save Product'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Product list page
const ProductsList = ({ products, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Inventory Products</h2>
          <p className="text-gray-600 text-sm mt-1">Manage your manufacturing inventory</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition shadow-md"
        >
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>

      {products.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          {products.length === 0 ? (
            <>
              <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
              <p className="text-lg text-gray-600">No products yet. Create your first product!</p>
            </>
          ) : (
            <>
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <p className="text-lg text-gray-600">No products match your search</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-500"
            >
              <div className="grid grid-cols-5 gap-4 items-start">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Product Name</p>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-lg transition"
                  >
                    {product.name}
                  </button>
                  <p className="text-xs text-gray-600 mt-1">
                    <i className="fas fa-calendar-alt mr-1"></i>
                    Expires: {new Date(product.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Category</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    product.category === 'Finished' ? 'bg-green-100 text-green-800' :
                    product.category === 'Semi finished' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {product.category}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total Cost</p>
                  <p className="font-bold text-2xl text-green-600">₹{product.totalCost?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Materials</p>
                  <p className="font-bold text-xl text-gray-800">{product.materials.length}</p>
                  <p className="text-xs text-gray-600 mt-1">raw materials</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition"
                    title="Edit product"
                  >
                    <i className="fas fa-edit text-lg"></i>
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                    title="Delete product"
                  >
                    <i className="fas fa-trash text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mt-8">
          <p className="text-sm text-gray-600">
            <i className="fas fa-info-circle mr-2"></i>
            Total Products: <span className="font-bold">{products.length}</span> | 
            Total Inventory Value: <span className="font-bold text-green-600">₹{products.reduce((sum, p) => sum + (p.totalCost || 0), 0).toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

// Main app
export default function InventoryApp() {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);
  const [currentPage, setCurrentPage] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);

  React.useEffect(() => {
    // Add FontAwesome CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: { ...product, id: editingProduct.id } });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    }
    setCurrentPage('list');
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentPage('form');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            <i className="fas fa-industry mr-3"></i>
            Manufacturing Inventory System
          </h1>
          <p className="text-blue-200 text-lg">Vibeosys - Product & Material Management</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {currentPage === 'list' ? (
            <ProductsList
              products={state.products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onCreate={() => {
                setEditingProduct(null);
                setCurrentPage('form');
              }}
            />
          ) : (
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setCurrentPage('list');
                setEditingProduct(null);
              }}
            />
          )}
        </div>

        <footer className="text-center mt-12 text-blue-200 text-sm">
          <p><i className="fas fa-check-circle mr-2"></i>Vibeosys Inventory Management System v1.0 | React 19 + Vite</p>
        </footer>
      </div>
    </div>
  );
}