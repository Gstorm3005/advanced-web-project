const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LivreurSchema = new Schema({
  sponsorship_code_owned: { type: String, required: true },
  sponsorship_code_used: { type: String, required: true },
  ID_user: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Livreur', LivreurSchema);
