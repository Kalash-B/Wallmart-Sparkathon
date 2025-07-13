const Product = require('../models/Product');
const Sale = require('../models/Sale');

exports.addSale = async (req, res) => {
  try {
    const { productId, productName, storeId, storeName, quantity, date } = req.body;

    if (!productId || !productName || !storeId || !storeName || !quantity || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const store = product.stores.find((s) => s.storeName === storeName);
    if (!store) return res.status(404).json({ error: 'Store not found for this product' });

    if (store.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available in this store' });
    }

    store.quantity -= quantity;
    store.lastSoldDate = new Date(date);

    await product.save();

    const newSale = new Sale({
      productId,
      productName,
      storeId,
      storeName,
      quantity,
      date,
    });

    const savedSale = await newSale.save();

    res.status(201).json(savedSale);
  } catch (err) {
    console.error('Error adding sale:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales history.' });
  }
};
