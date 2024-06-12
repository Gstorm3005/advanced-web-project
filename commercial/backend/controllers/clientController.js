const Client = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json({ message: 'Client deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// suspendre un client 
exports.suspendClient = async (req, res) => {
  try {
    // Trouver le client par son ID et mettre à jour le champ 'suspended' à true
    const client = await Client.findByIdAndUpdate(req.params.id, { suspended: true }, { new: true });

    // Si aucun client n'a été trouvé avec cet ID, renvoyer une réponse 404 (Not Found)
    if (!client) return res.status(404).json({ error: 'Client not found' });

    // Si le client a été trouvé et mis à jour, renvoyer une réponse 200 (OK) avec un message de succès
    res.status(200).json({ message: 'Client suspended', client });
  } catch (err) {
    // En cas d'erreur, renvoyer une réponse 400 (Bad Request) avec le message d'erreur
    res.status(400).json({ error: err.message });
  }
};

