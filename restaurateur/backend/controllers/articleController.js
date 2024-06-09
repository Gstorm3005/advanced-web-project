const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');

exports.createArticle = async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const article = new Article({
      name,
      category,
      quantity,
      price,
      path: filePath
    });

    await article.save();
    res.status(201).json({article, error: "The article has been created successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(200).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const updateData = { name, category, quantity, price };
    if (filePath) {
      updateData.path = filePath;
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(200).json({article, message: "The article has been created successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    
    // Delete the file if it exists
    if (article.path) {
      const filePath = path.join(__dirname, '..', article.path);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    res.status(200).json({ message: 'Article deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
