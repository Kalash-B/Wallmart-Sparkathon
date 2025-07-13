const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const THRESHOLD_DAYS = 30;
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
          SKU: product.SKU,
          category: product.category,
          daysWithoutSale,
          stock: store.quantity,
          estimatedValue,
          suggestedActions: [
            { id: 1, action: aiSuggestedAction, impact: 'High' },
            { id: 2, action: 'Transfer to another store', impact: 'Medium' },
            { id: 3, action: 'Online promotion campaign', impact: 'Low' }
          ]
        });
      }
    }

    res.json(deadInventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dead inventory' });
  }
});

module.exports = router;

