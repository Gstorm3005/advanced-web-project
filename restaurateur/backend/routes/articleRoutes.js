const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const upload = require('../middlewares/upload'); // Import the upload middleware

router.post('/', upload.single('image'), articleController.createArticle); // Handle file upload
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', upload.single('image'), articleController.updateArticle); // Handle file upload
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
