const NotifDelivery = require('../models/NotifDelivery');

exports.createNotifDelivery = async (req, res) => {
  try {
    const notifDelivery = new NotifDelivery(req.body);
    await notifDelivery.save();
    res.status(201).json(notifDelivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotifDeliverys = async (req, res) => {
  try {
    const notifDeliverys = await NotifDelivery.find().populate('Livreur').populate('Commande');
    res.status(200).json(notifDeliverys);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotifDeliveryById = async (req, res) => {
  try {
    const notifDelivery = await NotifDelivery.findById(req.params.id).populate('Livreur').populate('Commande');
    if (!notifDelivery) return res.status(404).json({ error: 'NotifDelivery not found' });
    res.status(200).json(notifDelivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateNotifDelivery = async (req, res) => {
  try {
    const notifDelivery = await NotifDelivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notifDelivery) return res.status(404).json({ error: 'NotifDelivery not found' });
    res.status(200).json(notifDelivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNotifDelivery = async (req, res) => {
  try {
    const notifDelivery = await NotifDelivery.findByIdAndDelete(req.params.id);
    if (!notifDelivery) return res.status(404).json({ error: 'NotifDelivery not found' });
    res.status(200).json({ message: 'NotifDelivery deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
