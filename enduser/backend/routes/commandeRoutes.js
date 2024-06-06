const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

router.post('/', commandeController.createCommande);
router.get('/', commandeController.getCommandes);
router.get('/:id', commandeController.getCommandeById);
router.put('/:id', commandeController.updateCommande);
router.delete('/:id', commandeController.deleteCommande);

module.exports = router;
