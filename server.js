const express = require('express');
const { PeerServer } = require('peer');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/:channel', (req, res) => {
  res.render('channel', { channelId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-channel', (channelId, userId) => {
    socket.join(channelId);
    socket.to(channelId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(channelId).broadcast.emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Hobey listening on port ${PORT}`);
});

PeerServer({
  port: 3001,
  path: '/',
  proxied: true,
}, () => {
  console.log('Peer server listening on port 3001');
});
