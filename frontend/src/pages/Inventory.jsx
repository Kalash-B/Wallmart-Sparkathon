import React, { useState, useEffect, useMemo } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/api";

const Inventory = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortKey, sortOrder]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    SKU: "",
    category: "",
    price: "",
    stock: "",
    lastSoldDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      const updated = res.data.map((product) => ({
        ...product,
        stock:
          product.stores?.reduce((sum, store) => sum + store.quantity, 0) || 0,
      }));

      setProducts(updated);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getStatus = (stores) => {
    const stock = stores?.[0]?.quantity || 0;
    if (stock === 0)
      return { label: "Out of Stock", class: "bg-red-100 text-red-800" };
    if (stock < 10)
      return { label: "Low Stock", class: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", class: "bg-green-100 text-green-800" };
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSorted.slice(startIndex, endIndex);
  }, [filteredAndSorted, currentPage]);

  const handleExport = () => {
    const csv = Papa.unparse(products);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "inventory.csv");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const fields = results.meta.fields;
          if (
            !fields.includes("name") ||
            !fields.includes("price") ||
            !fields.includes("stock") ||
            !fields.includes("lastSoldDate")
          ) {
            console.error(
              "CSV must include 'name', 'price', 'stock', and 'lastSoldDate'"
            );
            return;
          }

          for (const row of results.data) {
            const payload = {
              name: row.name,
              SKU: row.SKU,
              category: row.category || "General",
              price: parseFloat(row.price),
              description: "N/A",
              stores: [
                {
                  storeName: "Default Store",
                  location: "Main Warehouse",
                  quantity: parseInt(row.stock, 10),
                  lastSoldDate: new Date(row.lastSoldDate),
                },
              ],
            };

            if (
              !payload.name ||
              isNaN(payload.price) ||
              isNaN(payload.stores[0].quantity)
            )
              continue;

            try {
              const res = await addProduct(payload);
              setProducts((prev) => [...prev, res.data]);
            } catch (err) {
              console.error("Failed to import product:", err);
            }
          }
        },
      });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const payload = {
      name: newProduct.name,
      SKU: newProduct.SKU,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      description: "N/A",
      stores: [
        {
          storeName: "Default Store",
          location: "Main Warehouse",
          quantity: parseInt(newProduct.stock),
          lastSoldDate: new Date(newProduct.lastSoldDate),
        },
      ],
    };

    try {
      if (isEditing && editProductId) {
        const res = await updateProduct(editProductId, payload);
        setProducts((prev) =>
          prev.map((p) => (p._id === editProductId ? res.data : p))
        );
      } else {
        const res = await addProduct(payload);
        setProducts((prev) => [...prev, res.data]);
      }

      setNewProduct({
        name: "",
        SKU: "",
        category: "",
        price: "",
        stock: "",
        lastSoldDate: new Date().toISOString().split("T")[0],
      });
      setIsEditing(false);
      setEditProductId(null);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding/updating product:", err);
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setNewProduct({
      name: product.name,
      SKU: product.SKU,
      category: product.category,
      price: product.price,
      stock: product.stores?.[0]?.quantity ?? 0,
      lastSoldDate: new Date(product.stores?.[0]?.lastSoldDate)
        .toISOString()
        .split("T")[0],
    });
    setShowAddForm(true);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">
            Manage your product inventory across all locations
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {showAddForm ? "Cancel" : "Add Product"}
          </button>
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            onClick={handleExport}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Export
          </button>
        </div>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="SKU"
            value={newProduct.SKU}
            onChange={(e) =>
              setNewProduct({ ...newProduct, SKU: e.target.value })
            }
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="date"
            value={newProduct.lastSoldDate}
            onChange={(e) =>
              setNewProduct({ ...newProduct, lastSoldDate: e.target.value })
            }
            className="border rounded px-2 py-1"
          />
          <button
            type="submit"
            className="md:col-span-6 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {isEditing ? "Update" : "Add"}
          </button>
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
              {["name", "category", "price", "SKU", "stock"].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {sortKey === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((product) => {
              const status = getStatus(product.stores);
              return (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.SKU}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.stores?.[0]?.quantity ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      onClick={() => handleEditClick(product)}
                    >
                      <i className="fas fa-edit">Edit</i>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(product._id)}
                    >
                      <i className="fas fa-trash">Delete</i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
