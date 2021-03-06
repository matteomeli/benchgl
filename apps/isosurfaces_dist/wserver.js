var http = require('http'),
		path = require('path'),
		io = require('socket.io'),
		sys = require('sys'),
		Worker = require('webworker').Worker;

var server = http.createServer(function(req, res){ 
  res.writeHead(200, { 'Content-Type': 'text/html' }); 
  res.write('<h1>Hello! Server is running on port 3333...</h1>');
  res.end();
});

server.listen(3333);

var socket = io.listen(server);

socket.on('connection', function(client){
  var worker = new Worker(path.join(__dirname, 'worker.js'));
      
  worker.onmessage = function (message) {
  	var message = message.data,
  			level = message.level,
  			vertices = message.vertices,
  			normals = message.normals;
  	
    console.timeEnd('Calculating geometry (level ' + message.level + ')');

    client.send(message);
  };
    
  client.on('message', function(message) {
  	console.log('Calculation requested! (level ' + message.level + ')');
    console.time('Calculating geometry (level ' + message.level + ')');
    worker.postMessage(message);
  });
  
  client.on('disconnect',function() {
    console.log('Client has disconnected!');
  });
  
});