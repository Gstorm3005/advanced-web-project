const NotifLivreur = require('../models/NotifLivreur');

exports.createNotifLivreur = async (req, res) => {
  try {
    const notifLivreur = new NotifLivreur(req.body);
    await notifLivreur.save();
    res.status(201).json(notifLivreur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotifLivreurs = async (req, res) => {
  try {
    const notifLivreurs = await NotifLivreur.find().populate('Livreur').populate('Commande');
    res.status(200).json(notifLivreurs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotifLivreurById = async (req, res) => {
  try {
    const notifLivreur = await NotifLivreur.findById(req.params.id).populate('Livreur').populate('Commande');
    if (!notifLivreur) return res.status(404).json({ error: 'NotifLivreur not found' });
    res.status(200).json(notifLivreur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateNotifLivreur = async (req, res) => {
  try {
    const notifLivreur = await NotifLivreur.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notifLivreur) return res.status(404).json({ error: 'NotifLivreur not found' });
    res.status(200).json(notifLivreur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNotifLivreur = async (req, res) => {
  try {
    const notifLivreur = await NotifLivreur.findByIdAndDelete(req.params.id);
    if (!notifLivreur) return res.status(404).json({ error: 'NotifLivreur not found' });
    res.status(200).json({ message: 'NotifLivreur deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
