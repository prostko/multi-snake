var express = require('express')
var app = express();
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server);


app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.set("view options", { layout: false });

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/home.html');
});

server.listen(5678);
console.log("Server listening on port " + 5678);

io.sockets.on('connection', function(socket){
  socket.on('setPseudo', function(data){
    socket.nickname = data;
    socket.emit('pseudo', data);
    console.log("user " + data + " connected");
  });

  socket.on('message', function(data){
      var transmit = {date : new Date().toISOString(), pseudo : socket.nickname, message : data};
      console.log(transmit['pseudo'])
      socket.broadcast.emit('message', transmit);
      console.log("user " + transmit['pseudo'] + " said this \""+data+"\"");
  });

  socket.on('directionChange', function(data) {
    console.log('there was a change in direction to: ' + data);
    console.log("here")
  });
});
