const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  path: { type: String, required: true, unique: true }, // Set path as unique
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
