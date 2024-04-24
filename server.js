const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./controllers/publicController');

app.use(cors());
app.use(express.json());
app.get('/', router);

app.listen(process.env.PORT || 8080);