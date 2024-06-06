const Commande = require('../models/Commande');

exports.createCommande = async (req, res) => {
  try {
    const commande = new Commande(req.body);
    await commande.save();
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Livreur');
    res.status(200).json(commandes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Livreur');
    if (!commande) return res.status(404).json({ error: 'Commande not found' });
    res.status(200).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCommande = async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!commande) return res.status(404).json({ error: 'Commande not found' });
    res.status(200).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findByIdAndDelete(req.params.id);
    if (!commande) return res.status(404).json({ error: 'Commande not found' });
    res.status(200).json({ message: 'Commande deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
