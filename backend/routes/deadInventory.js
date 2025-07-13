const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const THRESHOLD_DAYS = 180;
    const now = new Date();

    const products = await Product.find();
    const deadInventory = [];

    for (const product of products) {
      const store = product.stores?.[0];
      if (!store || !store.lastSoldDate) continue;

      const daysWithoutSale = Math.floor((now - new Date(store.lastSoldDate)) / (1000 * 60 * 60 * 24));

      if (daysWithoutSale >= THRESHOLD_DAYS && store.quantity > 0) {
        const estimatedValue = product.price * store.quantity;
        const aiSuggestedAction = store.quantity > 5 ? 'Clearance Sale' : 'Bundle Offer';

        deadInventory.push({
          _id: product._id,
          name: product.name,
          category: product.category,
          stock: store.quantity,
          daysWithoutSale,
          estimatedValue,
          aiSuggestedAction
        });
      }
    }

    res.json(deadInventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dead inventory' });
  }
});

module.exports = router;