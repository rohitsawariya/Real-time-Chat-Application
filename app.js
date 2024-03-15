const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//Middlewares
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " Joined the conversation");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " Left the conversation");
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});


server.listen(5000, () => {
  console.log(`Connection established on http://localhost:5000`);
});