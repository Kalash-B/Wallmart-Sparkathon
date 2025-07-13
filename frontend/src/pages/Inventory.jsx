import React, { useState, useMemo } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', price: '', stock: '' });

  const [products, setProducts] = useState([
    { name: 'Premium Chair', sku: 'PRD-124', category: 'Furniture', price: 299.99, stock: 4 },
    { name: 'Desk Lamp', sku: 'PRD-865', category: 'Lighting', price: 49.99, stock: 8 },
    { name: 'Wireless Mouse', sku: 'PRD-392', category: 'Electronics', price: 29.99, stock: 6 },
    { name: 'Office Desk', sku: 'PRD-578', category: 'Furniture', price: 399.99, stock: 12 }
  ]);

  const getStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    if (stock < 10) return { label: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', class: 'bg-green-100 text-green-800' };
  };

  const handleDelete = (sku) => {
    setProducts(prev => prev.filter(p => p.sku !== sku));
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, sortKey, sortOrder]);

  const handleExport = () => {
    const csv = Papa.unparse(products);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'inventory.csv');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setProducts(prev => [...prev, ...results.data.map(row => ({
            ...row,
            price: parseFloat(row.price),
            stock: parseInt(row.stock, 10)
          }))]);
        }
      });
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.price || !newProduct.stock) return;
    setProducts(prev => [...prev, { ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock, 10) }]);
    setNewProduct({ name: '', sku: '', category: '', price: '', stock: '' });
    setShowAddForm(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Manage your product inventory across all locations</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-indigo-600 text-white px-4 py-2 rounded">{showAddForm ? 'Cancel' : 'Add Product'}</button>
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Export</button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border rounded px-2 py-1" required />
          <input type="text" placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="border rounded px-2 py-1" required />
          <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border rounded px-2 py-1" required />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="border rounded px-2 py-1" required />
          <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="border rounded px-2 py-1" required />
          <button type="submit" className="md:col-span-5 bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      )}

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['name', 'sku', 'category', 'price', 'stock'].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} {sortKey === key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSorted.map((product) => {
              const status = getStatus(product.stock);
              return (
                <tr key={product.sku}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>{status.label}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2"><i className="fas fa-edit"></i></button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(product.sku)}><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
