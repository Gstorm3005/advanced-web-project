const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  price: { type: Number, required: true },
  state: { type: String, required: true },
  notif_res: { type: Boolean, required: true },
  notif_cli: { type: Boolean, required: true },
  Menu: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
  Article: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  Client: { type: Schema.Types.ObjectId, ref: 'Client' },
  Restaurateur: { type: Schema.Types.ObjectId, ref: 'Restaurateur' },
  Livreur: { type: Schema.Types.ObjectId, ref: 'Livreur' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

