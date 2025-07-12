import React, { useState } from 'react';
const Sales = () => {
      const [products, setProducts] = React.useState([]);
      const [stores, setStores] = React.useState([]);
      const [salesHistory, setSalesHistory] = React.useState([]);
      const [loading, setLoading] = React.useState(true);
      const [formData, setFormData] = React.useState({
        productId: '',
        storeId: '',
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
      });
      const [currentPage, setCurrentPage] = React.useState(1);
      const itemsPerPage = 10;
      
      React.useEffect(() => {
        // Simulate API call to get data
        setTimeout(() => {
          // Mock products
          const mockProducts = [
            { id: 1, name: 'Wireless Headphones', sku: 'WH-001' },
            { id: 2, name: 'Cotton T-Shirt', sku: 'CT-002' },
            { id: 3, name: 'Ceramic Mug', sku: 'CM-003' },
            { id: 4, name: 'Desk Lamp', sku: 'DL-004' },
            { id: 5, name: 'Protein Powder', sku: 'PP-005' },
          ];
          
          // Mock stores
          const mockStores = [
            { id: 1, name: 'Downtown Store' },
            { id: 2, name: 'Mall Outlet' },
            { id: 3, name: 'East Branch' },
            { id: 4, name: 'West Branch' },
          ];
          
          // Mock sales history
          const mockSalesHistory = [
            { id: 101, productId: 1, productName: 'Wireless Headphones', storeId: 1, storeName: 'Downtown Store', quantity: 2, date: '2025-03-01' },
            { id: 102, productId: 2, productName: 'Cotton T-Shirt', storeId: 3, storeName: 'East Branch', quantity: 3, date: '2025-03-02' },
            { id: 103, productId: 4, productName: 'Desk Lamp', storeId: 2, storeName: 'Mall Outlet', quantity: 1, date: '2025-03-03' },
            { id: 104, productId: 1, productName: 'Wireless Headphones', storeId: 4, storeName: 'West Branch', quantity: 1, date: '2025-03-04' },
            { id: 105, productId: 3, productName: 'Ceramic Mug', storeId: 1, storeName: 'Downtown Store', quantity: 4, date: '2025-02-15' },
            { id: 106, productId: 5, productName: 'Protein Powder', storeId: 2, storeName: 'Mall Outlet', quantity: 2, date: '2025-02-10' },
            { id: 107, productId: 2, productName: 'Cotton T-Shirt', storeId: 3, storeName: 'East Branch', quantity: 5, date: '2025-02-08' },
            { id: 108, productId: 4, productName: 'Desk Lamp', storeId: 1, storeName: 'Downtown Store', quantity: 3, date: '2025-02-05' },
            { id: 109, productId: 1, productName: 'Wireless Headphones', storeId: 4, storeName: 'West Branch', quantity: 2, date: '2025-02-03' },
            { id: 110, productId: 3, productName: 'Ceramic Mug', storeId: 2, storeName: 'Mall Outlet', quantity: 6, date: '2025-01-30' },
            { id: 111, productId: 5, productName: 'Protein Powder', storeId: 3, storeName: 'East Branch', quantity: 3, date: '2025-01-28' },
            { id: 112, productId: 2, productName: 'Cotton T-Shirt', storeId: 1, storeName: 'Downtown Store', quantity: 4, date: '2025-01-25' },
          ];
          
          setProducts(mockProducts);
          setStores(mockStores);
          setSalesHistory(mockSalesHistory);
          setLoading(false);
        }, 1000);
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.productId || !formData.storeId || formData.quantity < 1) {
          alert('Please fill in all required fields correctly.');
          return;
        }
        
        // Find product and store details for the new sale
        const product = products.find(p => p.id === parseInt(formData.productId));
        const store = stores.find(s => s.id === parseInt(formData.storeId));
        
        if (!product || !store) {
          alert('Invalid product or store selection.');
          return;
        }
        
        // Create new sale object
        const newSale = {
          id: Date.now(), // Temporary ID for prototype
          productId: parseInt(formData.productId),
          productName: product.name,
          storeId: parseInt(formData.storeId),
          storeName: store.name,
          quantity: parseInt(formData.quantity),
          date: formData.date
        };
        
        // Add to sales history
        setSalesHistory([newSale, ...salesHistory]);
        
        // Reset form
        setFormData({
          productId: '',
          storeId: '',
          quantity: 1,
          date: new Date().toISOString().split('T')[0],
        });
      };
      
      // Pagination logic
      const indexOfLastSale = currentPage * itemsPerPage;
      const indexOfFirstSale = indexOfLastSale - itemsPerPage;
      const currentSales = salesHistory.slice(indexOfFirstSale, indexOfLastSale);
      const totalPages = Math.ceil(salesHistory.length / itemsPerPage);

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sales Entry Form */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Record New Sale</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store
                      </label>
                      <select
                        name="storeId"
                        value={formData.storeId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select a store</option>
                        {stores.map(store => (
                          <option key={store.id} value={store.id}>
                            {store.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                    >
                      <i className="fas fa-plus-circle mr-2"></i> Record Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sales History */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow h-full">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-800">Sales History</h3>
                </div>
                
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="spinner mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading sales data...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentSales.length > 0 ? (
                            currentSales.map(sale => (
                              <tr key={sale.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(sale.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{sale.productName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {sale.storeName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {sale.quantity} units
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                No sales records found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {salesHistory.length > itemsPerPage && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstSale + 1}</span> to{' '}
                            <span className="font-medium">
                              {indexOfLastSale > salesHistory.length ? salesHistory.length : indexOfLastSale}
                            </span>{' '}
                            of <span className="font-medium">{salesHistory.length}</span> results
                          </div>
                          <nav className="flex items-center">
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`mr-2 px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50 border'}`}
                            >
                              Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 mx-1 rounded-md ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border'}`}
                              >
                                {number}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`ml-2 px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50 border'}`}
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
export default Sales;