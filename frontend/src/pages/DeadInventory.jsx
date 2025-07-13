import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getDeadInventory } from '../services/api';

const DeadInventory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  getDeadInventory()
    .then((res) => setData(res.data))
    .catch((err) => console.error('Error:', err));
}, []);

  const totalItems = data.length;
  const totalUnits = data.reduce((acc, item) => acc + item.stock, 0);
  const totalValue = data.reduce((acc, item) => acc + item.estimatedValue, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dead Inventory</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Dead Stock Items</p>
          <h3 className="text-xl font-semibold">{totalItems}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Units in Dead Stock</p>
          <h3 className="text-xl font-semibold">{totalUnits}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Estimated Value (INR)</p>
          <h3 className="text-xl font-semibold">₹{totalValue.toFixed(2)}</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Product</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Days Without Sale</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-2 text-left text-sm font-medium">AI Suggested Action</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.daysWithoutSale} days</td>
                <td className="px-4 py-2">{item.stock}</td>
                <td className="px-4 py-2 font-semibold text-blue-600">{item.aiSuggestedAction}</td>
                <td className="px-4 py-2">
                  <button className="text-red-600 hover:underline mr-2">Archive</button>
                  <button className="text-indigo-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeadInventory;