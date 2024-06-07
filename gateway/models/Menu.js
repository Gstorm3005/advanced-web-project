const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  Article: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);