const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require("./SQLmodels");
const verifyMicroserviceApiKey = require('./middlewares/verifyMicroserviceApiKey'); // Import the middleware

const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');
const clientRoutes = require('./routes/clientRoutes');
const restaurateurRoutes = require('./routes/restaurateurRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/clientdb')
// mongoose.connect('mongodb://mongo:27017/clientdb')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

db.sequelize.sync()
.then(() => console.log('MySQL connected...'))
.catch(err => console.log(err));

app.use(express.json())

// Apply the middleware to all routes
app.use(verifyMicroserviceApiKey);

app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/restaurateurs', restaurateurRoutes);
app.use('/api/menus', menuRoutes);

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Client backend running on port ${PORT}`);
});

