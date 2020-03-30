const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const { errors } = require('celebrate');
const { setupWebSocket } = require('./websocket');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@metrix-hkfkc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

module.exports = server;