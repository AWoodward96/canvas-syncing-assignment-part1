const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  // handle sending back the html
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

const io = socketio(app);

app.listen(PORT);

const myVal = {
  message: 0,
};

// On connection join a room
io.on('connection', (socket) => {
  const s = socket;
  s.join('room1');

  socket.on('increment', (data) => {
    myVal.message += data.message;

    io.sockets.in('room1').emit('updatePara', myVal);
  });

  socket.on('clear', () => {
    myVal.message = 0;
    io.sockets.in('room1').emit('clearPara');
  });
});
