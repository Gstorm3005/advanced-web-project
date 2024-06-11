const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors')
const app = express();
app.use(cors())
mongoose.connect('mongodb://127.0.0.1:27017/imagedb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/uploads', uploadRoutes);

const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Image service running on port ${PORT}`);
});
