const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const { errors } = require('celebrate');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://devmap:rocketseatdevmap@metrix-hkfkc.mongodb.net/devmap?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

module.exports = server;