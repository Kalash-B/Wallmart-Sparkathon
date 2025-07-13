// Dashboard Page (Updated with Backend Integration)
import React, { useEffect, useRef, useState } from "react";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { getProducts, getDeadInventory, getSalesHistory } from "../services/api";

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const salesChartRef = useRef(null);
  const heatmapChartRef = useRef(null);
  const salesChartInstance = useRef(null);
  const heatmapChartInstance = useRef(null);

  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deadInventory, setDeadInventory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, deadInventoryResponse, salesResponse] = await Promise.all([
          getProducts(),
          getDeadInventory(),
          getSalesHistory()
        ]);

        const productList = productResponse.data.map((product) => ({
          ...product,
          id: product._id,
          stock: product.stores.reduce((sum, store) => sum + store.quantity, 0),
        }));

        setProducts(productList);
        setDeadInventory(deadInventoryResponse.data || []);
        setSalesHistory(salesResponse.data || []);

        initializeCharts(salesResponse.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      salesChartInstance.current?.destroy();
      heatmapChartInstance.current?.destroy();
    };
  }, []);

  const initializeCharts = (salesData) => {
    salesChartInstance.current?.destroy();
    heatmapChartInstance.current?.destroy();

    if (salesChartRef.current) {
      const monthlySales = Array(12).fill(0);

      salesData.forEach(sale => {
        const month = new Date(sale.date).getMonth();
        monthlySales[month] += sale.quantity;
      });

      salesChartInstance.current = new Chart(salesChartRef.current, {
        type: "line",
        data: {
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ],
          datasets: [
            {
              label: "Sales",
              data: monthlySales,
              borderColor: "rgb(79, 70, 229)",
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Monthly Sales Trend",
            },
            legend: {
              display: true,
            },
          },
        },
      });
    }

    if (heatmapChartRef.current) {
      heatmapChartInstance.current = new Chart(heatmapChartRef.current, {
        type: "bar",
        data: {
          labels: ["Store A", "Store B", "Store C", "Store D"],
          datasets: [
            {
              label: "Electronics",
              data: [15, 8, 12, 5],
              backgroundColor: "rgba(79, 70, 229, 0.6)",
            },
            {
              label: "Apparel",
              data: [8, 20, 15, 10],
              backgroundColor: "rgba(16, 185, 129, 0.6)",
            },
            {
              label: "Kitchenware",
              data: [3, 7, 5, 9],
              backgroundColor: "rgba(245, 158, 11, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Stock Levels by Store",
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.SKU.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "" || product.category === categoryFilter) &&
      (!lowStockOnly || product.stock < 10)
    );
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          iconClass="fas fa-box"
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          label="Total Products"
          value={products.length}
        />
        <StatCard
          iconClass="fas fa-store"
          bgColor="bg-green-100"
          iconColor="text-green-600"
          label="Total Stores"
          value={4}
        />
        <StatCard
          iconClass="fas fa-exclamation-triangle"
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          label="Low Stock Items"
          value={products.filter((p) => p.stock < 10).length}
        />
        <StatCard
          iconClass="fas fa-skull"
          bgColor="bg-red-100"
          iconColor="text-red-600"
          label="Dead Stock"
          value={4}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales Trend" canvasRef={salesChartRef} />
        <ChartCard title="Inventory Heatmap" canvasRef={heatmapChartRef} />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">
            Inventory Overview
          </h3>

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStockFilter"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="lowStockFilter"
                className="ml-2 text-sm text-gray-700"
              >
                Low Stock Only
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={product.stock < 10 ? "low-stock" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.SKU}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            product.stock < 10
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock} units
                          {product.stock < 10 && (
                            <i className="fas fa-exclamation-circle ml-2"></i>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No products match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dead Stock Preview */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">
              Dead Stock Items
            </h3>
            <button
              className="text-indigo-600 hover:text-indigo-800"
              onClick={() =>
                document.getElementById("deadInventoryTab")?.click()
              }
            >
              See All <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Without Sale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suggested Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deadInventory.slice(0, 3).map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.SKU}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.daysWithoutSale} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {item.suggestedActions?.[0]?.action || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
