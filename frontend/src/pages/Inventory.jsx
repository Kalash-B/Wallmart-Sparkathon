import React, { useState } from 'react';
const Inventory = () => {
      const [products, setProducts] = React.useState([]);
      const [loading, setLoading] = React.useState(true);
      const [isEditing, setIsEditing] = React.useState(false);
      const [currentProduct, setCurrentProduct] = React.useState({
        id: null,
        name: '',
        sku: '',
        description: '',
        category: '',
      });
      const [stores, setStores] = React.useState([]);
      const [storeStocks, setStoreStocks] = React.useState({});
      
      React.useEffect(() => {
        // Simulate API call to get products
        setTimeout(() => {
          // Mock products
          const mockProducts = [
            { id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', description: 'Noise cancelling wireless headphones' },
            { id: 2, name: 'Cotton T-Shirt', sku: 'CT-002', category: 'Apparel', description: 'Plain white cotton t-shirt' },
            { id: 3, name: 'Ceramic Mug', sku: 'CM-003', category: 'Kitchenware', description: '12oz ceramic coffee mug' },
            { id: 4, name: 'Desk Lamp', sku: 'DL-004', category: 'Home Goods', description: 'Adjustable LED desk lamp' },
            { id: 5, name: 'Protein Powder', sku: 'PP-005', category: 'Health', description: 'Whey protein isolate' },
          ];
          
          // Mock stores
          const mockStores = [
            { id: 1, name: 'Downtown Store', location: 'City Center' },
            { id: 2, name: 'Mall Outlet', location: 'North Mall' },
            { id: 3, name: 'East Branch', location: 'East Side' },
            { id: 4, name: 'West Branch', location: 'West Side' },
          ];
          
          // Mock stock levels
          const mockStoreStocks = {
            1: { 1: 5, 2: 10, 3: 8, 4: 12 },  // Product ID 1 stocks at different stores
            2: { 1: 8, 2: 12, 3: 5, 4: 3 },   // Product ID 2 stocks
            3: { 1: 3, 2: 0, 3: 0, 4: 0 },    // Product ID 3 stocks
            4: { 1: 6, 2: 6, 3: 9, 4: 3 },    // Product ID 4 stocks
            5: { 1: 2, 2: 4, 3: 0, 4: 0 },    // Product ID 5 stocks
          };
          
          setProducts(mockProducts);
          setStores(mockStores);
          setStoreStocks(mockStoreStocks);
          setLoading(false);
        }, 1000);
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
      };

      const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
      };

      const handleAddNew = () => {
        setCurrentProduct({
          id: null,
          name: '',
          sku: '',
          description: '',
          category: '',
        });
        setIsEditing(true);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form
        if (!currentProduct.name || !currentProduct.sku || !currentProduct.category) {
          alert('Please fill in all required fields.');
          return;
        }
        
        // API call would go here
        setIsEditing(false);
        
        // Update local state for prototype purposes
        if (currentProduct.id) {
          // Editing existing product
          setProducts(products.map(p => 
            p.id === currentProduct.id ? currentProduct : p
          ));
        } else {
          // Adding new product
          const newProduct = {
            ...currentProduct,
            id: Date.now(), // temporary ID for prototype
          };
          setProducts([...products, newProduct]);
          
          // Initialize stock for this product
          const newStocks = {};
          stores.forEach(store => {
            newStocks[store.id] = 0;
          });
          setStoreStocks(prev => ({
            ...prev,
            [newProduct.id]: newStocks
          }));
        }
      };

      const handleCancelEdit = () => {
        setIsEditing(false);
      };

      const handleStockChange = (productId, storeId, value) => {
        // Convert to number and validate
        const newValue = parseInt(value, 10);
        if (isNaN(newValue) || newValue < 0) return;
        
        // Update stock level
        setStoreStocks(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            [storeId]: newValue
          }
        }));
      };
      
      // Calculate total stock for a product across all stores
      const getTotalStock = (productId) => {
        if (!storeStocks[productId]) return 0;
        return Object.values(storeStocks[productId]).reduce((sum, qty) => sum + qty, 0);
      };

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
            {!isEditing && (
              <button 
                onClick={handleAddNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                <i className="fas fa-plus mr-2"></i> Add New Product
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {currentProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={currentProduct.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={currentProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={currentProduct.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                  >
                    {currentProduct.id ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          ) : loading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="spinner mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading inventory data...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
                      {stores.map(store => (
                        <th key={store.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {store.name}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map(product => {
                      const totalStock = getTotalStock(product.id);
                      const isLowStock = totalStock < 10;
                      
                      return (
                        <tr key={product.id} className={isLowStock ? 'low-stock' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sku}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                              {totalStock} units
                              {isLowStock && <i className="fas fa-exclamation-circle ml-2"></i>}
                            </div>
                          </td>
                          
                          {stores.map(store => (
                            <td key={store.id} className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                value={storeStocks[product.id]?.[store.id] || 0}
                                onChange={(e) => handleStockChange(product.id, store.id, e.target.value)}
                                className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </td>
                          ))}
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    };
export default Inventory;