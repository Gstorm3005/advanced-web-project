const express = require('express');
const router = express.Router();
const notifLivreurController = require('../controllers/notifLivreurController');

router.post('/', notifLivreurController.createNotifLivreur);
router.get('/', notifLivreurController.getNotifLivreurs);
router.get('/:id', notifLivreurController.getNotifLivreurById);
router.put('/:id', notifLivreurController.updateNotifLivreur);
router.delete('/:id', notifLivreurController.deleteNotifLivreur);

module.exports = router;
