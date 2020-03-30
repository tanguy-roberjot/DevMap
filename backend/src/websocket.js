const socketio = require('socket.io');
const distance = require('./utils/calculateDistance');
const connections = [];
let io;

exports.setupWebSocket = (server) => {
  io = socketio(server);

  io.on('connection', socket => {
    console.log(socket.id);
    const { latitude, longitude, techs } = socket.handshake.query;
    const techsArray = techs.split(',').map(tech => tech.trim());

    connections.push({
      id: socket.id,
      coords: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: techsArray,
    });

  });
};

exports.findConnections = (coords, techs) => {
  return connections.filter(conn => {
    console.log(distance(coords.latitude, coords.longitude, conn.coords.latitude, conn.coords.longitude));
    console.log(conn.techs.some(item => techs.includes(item)));
    return distance(coords.latitude, coords.longitude, conn.coords.latitude, conn.coords.longitude) < 10
    && conn.techs.some(item => techs.includes(item));
  })
};

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
    console.log('emited');
  });
}