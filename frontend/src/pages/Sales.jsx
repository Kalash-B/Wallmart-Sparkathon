import React, { useEffect, useMemo, useState } from "react";
import { getProducts, getSalesHistory, addSale } from "../services/api";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, salesRes] = await Promise.all([
          getProducts(),
          getSalesHistory(),
        ]);
        setProducts(productRes.data || []);
        setSalesHistory(salesRes.data || []);
      } catch (err) {
        console.error("Error fetching sales data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity < 1) {
      alert("Please select a product and enter a valid quantity.");
      return;
    }

    const selectedProduct = products.find((p) => p._id === formData.productId);
    if (!selectedProduct) {
      alert("Selected product not found.");
      return;
    }

    const saleData = {
      productId: formData.productId,
      quantity: parseInt(formData.quantity),
      date: formData.date,
    };

    try {
      const res = await addSale(saleData);
      setSalesHistory((prev) => [res.data, ...prev]);
      setFormData({
        productId: "",
        quantity: 1,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error adding sale:", err);
      alert("Failed to record the sale. Try again.");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSales = salesHistory.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(salesHistory.length / itemsPerPage);
  const paginate = (page) => setCurrentPage(page);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Record New Sale
            </h3>
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
                    className="w-full border rounded-md px-4 py-2"
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.SKU})
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
                    value={formData.quantity}
                    min="1"
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-4 py-2"
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
                    className="w-full border rounded-md px-4 py-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sales Table */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow h-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-800">
                Sales History
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">Loading sales data...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentSales.length > 0 ? (
                        currentSales.map((sale) => (
                          <tr key={sale._id}>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(sale.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {sale.productName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {sale.quantity}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No sales records available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {salesHistory.length > itemsPerPage && (
                  <div className="flex justify-center p-4 space-x-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
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
