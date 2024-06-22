const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require("./SQLmodels");

const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');
const clientRoutes = require('./routes/clientRoutes');
const restaurateurRoutes = require('./routes/restaurateurRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/clientdb')
// mongoose.connect('mongodb://mongo:27017/clientdb')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

db.sequelize.sync()
.then(() => console.log('MySQL connected...'))
.catch(err => console.log(err));

app.use(bodyParser.json());

app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/restaurateurs', restaurateurRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Client backend running on port ${PORT}`);
});
