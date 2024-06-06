const Livreur = require('../models/Livreur');

exports.createLivreur = async (req, res) => {
  try {
    const livreur = new Livreur(req.body);
    await livreur.save();
    res.status(201).json(livreur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLivreurs = async (req, res) => {
  try {
    const livreurs = await Livreur.find();
    res.status(200).json(livreurs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLivreurById = async (req, res) => {
  try {
    const livreur = await Livreur.findById(req.params.id);
    if (!livreur) return res.status(404).json({ error: 'Livreur not found' });
    res.status(200).json(livreur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!livreur) return res.status(404).json({ error: 'Livreur not found' });
    res.status(200).json(livreur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findByIdAndDelete(req.params.id);
    if (!livreur) return res.status(404).json({ error: 'Livreur not found' });
    res.status(200).json({ message: 'Livreur deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
