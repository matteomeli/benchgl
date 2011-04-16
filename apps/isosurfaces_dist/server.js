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
	sys.debug('Worker initializing.');
	var worker = new Worker(path.join(__dirname, 'worker.js'));
  worker.onmessage = function (e) {
  	console.timeEnd("timing worker");
  	client.send(e);
  };
    
  client.on('message', function(message) {
    console.time("timing worker");
    worker.postMessage(message);
  });
  
  client.on('disconnect',function() {
  	worker.terminate();
    console.log('Client has disconnected');
  });

});