// Require HTTP module (to start server) and Socket.IO
var http = require('http'),
		url = require('url'),
		fs = require('fs'),
		io = require('socket.io');

// Start the server at port 3333
var server = http.createServer(function(req, res){ 
  // Send HTML headers and message
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
		  res.writeHead(200, { 'Content-Type': 'text/html' }); 
		  res.write('<h1>Hello! Try the <a href="client.html">client</a> example.</h1>');
		  res.end();
      break;
      
    case '/json.js':
    case '/client.html':
      fs.readFile(__dirname + path, function(err, data) {
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
      
    default: send404(res);
  }

});

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(3333);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 
  
  // Success!  Now listen to messages to be received
  client.on('message',function(event){ 
    console.log('Received message from client!',event);
  });
  client.on('disconnect',function(){
    console.log('Client has disconnected');
  });

});