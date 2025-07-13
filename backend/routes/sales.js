const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales history.' });
  }
});

// Add a new sale
router.post('/', async (req, res) => {
  try {
    const { productId, productName, storeId, storeName, quantity, date } = req.body;

    if (!productId || !productName || !storeId || !storeName || !quantity || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newSale = new Sale({ productId, productName, storeId, storeName, quantity, date });
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add sale.' });
  }
});

module.exports = router;
