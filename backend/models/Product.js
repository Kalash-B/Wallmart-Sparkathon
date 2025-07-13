const mongoose = require('mongoose');

const StoreStockSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  location: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  lastSoldDate: { type: Date, default: () => new Date('2024-01-01') } // default old date
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  SKU: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  stores: [StoreStockSchema],
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);