const { PeerServer } = require('peer');

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    socket.on('join-channel', (channelId, userId) => {
      socket.join(channelId);
      socket.to(channelId).broadcast.emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(channelId).broadcast.emit('user-disconnected', userId);
      });
    });
  });
}

function setupPeerServer() {
  PeerServer({
    port: 3001,
    path: '/',
    proxied: true,
  }, () => {
    console.log('Peer server listening on port 3001');
  });
}

module.exports = {
  setupSocketIO,
  setupPeerServer,
};
