// controllers/productController.js
const Product = require('../models/Product');

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create new product

exports.createProduct = async (req, res) => {
  const { name, SKU, category, price, description, stock } = req.body;

  if (!name || !SKU || !category || price == null || stock == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const product = await Product.create({
      name,
      SKU,
      category,
      price,
      description,
      stores: [
        {
          storeName: "Default Store",
          location: "Main Warehouse",
          quantity: stock
        }
      ]
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// PUT update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
