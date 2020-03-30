import socketio from 'socket.io-client';
import { BACKEND_URL } from 'react-native-dotenv'

const socket = socketio(`${BACKEND_URL}`, {
  autoConnect: false,
});

function subscribeToNewDev(subscribeFunction){
  socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs){
  socket.io.opts.query = {
    latitude,
    longitude,
    techs
  };
  
  socket.connect();
}

function disconnect(){
  if(socket.connected){
    socket.disconnect();
  }
}

export {
  connect,
  disconnect,
  subscribeToNewDev
}

