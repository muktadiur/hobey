const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { setupSocketIO } = require('./config/socket');
const routes = require('./router/routes')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', routes)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Hobey listening on port ${PORT}`);
});

setupSocketIO(io);
