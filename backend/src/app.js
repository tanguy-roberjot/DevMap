const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const routes = require('./routes');
const { errors } = require('celebrate');

const app = express();

mongoose.connect('mongodb+srv://devmap:rocketseatdevmap@metrix-hkfkc.mongodb.net/devmap?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

module.exports = app;