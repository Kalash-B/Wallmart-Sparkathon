const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed, required: true },
  productName: { type: String, required: true },
  storeId: { type: mongoose.Schema.Types.Mixed, required: true },
  storeName: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Sale', saleSchema);
