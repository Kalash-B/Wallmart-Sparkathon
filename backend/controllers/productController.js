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
  try {
    const { name, SKU, category, price, description, stock, stores } = req.body;

    if (!name || !SKU || !category || price == null) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    let storeData;

    if (Array.isArray(stores)) {
      // from CSV or manual UI with custom lastSoldDate
      storeData = stores;
    } else {
      // fallback: use `stock` field if present (for backward compatibility)
      if (stock == null) {
        return res.status(400).json({ message: 'Stock or Stores required' });
      }

      storeData = [
        {
          storeName: 'Default Store',
          location: 'Main Warehouse',
          quantity: stock,
          lastSoldDate: new Date('2024-01-01'), // default date
        },
      ];
    }

    const product = await Product.create({
      name,
      SKU,
      category,
      price,
      description,
      stores: storeData,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err.message);
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
