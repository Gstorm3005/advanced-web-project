const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');
const clientRoutes = require('./routes/clientRoutes');
const restaurateurRoutes = require('./routes/restaurateurRoutes');
const livreurRoutes = require('./routes/livreurRoutes');
const menuRoutes = require('./routes/menuRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const notifLivreurRoutes = require('./routes/notifLivreurRoutes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/clientdb')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use(bodyParser.json());

app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/restaurateurs', restaurateurRoutes);
app.use('/api/livreurs', livreurRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/notif_livreurs', notifLivreurRoutes);

const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Client backend running on port ${PORT}`);
});
