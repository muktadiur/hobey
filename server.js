const express = require('express')
const { PeerServer } = require('peer');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen({
  port: 3000,
  // ssl: {
  //   key: fs.readFileSync('/etc/letsencrypt/live/theschoolify.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/theschoolify.com/fullchain.pem')
  // }
}, () => {
    console.log(`App listening on port 3000`);
})

const peerServer = PeerServer({
  port: 3001,
  path: '/',
  // ssl: {
  //   key: fs.readFileSync('/etc/letsencrypt/live/theschoolify.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/theschoolify.com/fullchain.pem')
  // },
  proxied: true
}, () => {
  console.log('Peer server listening on port 3001');
});