const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livreurController');

router.post('/', livreurController.createLivreur);
router.get('/', livreurController.getLivreurs);
router.get('/:id', livreurController.getLivreurById);
router.put('/:id', livreurController.updateLivreur);
router.delete('/:id', livreurController.deleteLivreur);

module.exports = router;
