var http = require('http'),
		path = require('path'),
		io = require('socket.io'),
		ioc = require('./node-socket.io-client/socket.io').io,
		sys = require('sys'),
		port = process.argv[2] || 4444,
		wport = process.argv[3] || 3333;
		
if (process.argv[2] === 'help') {
	console.log('Usage: node proxy.js [server-port] [servant-port]');
	return;
}
		
var server = http.createServer(function(req, res){ 
  res.writeHead(200, { 'Content-Type': 'text/html' }); 
  res.write('<h1>Hello! Server is running on port ' + port + '...</h1>');
  res.end();
});

server.listen(port);

var socket = io.listen(server);

socket.on('connection', function(client) {
  var wconns = [],
  		available = 0;
  		
  for (var i = 0; i < workers.length; i++) {
  	var wconn = new ioc.Socket(workers[i], { port: wport });
  	wconn.connect();

		wconn.on('connect', function() {
			available++;
		  console.log('Connected to worker %d!', available);
		});
		
		wconn.on('disconnect', function() {
      console.log('Disconnected from worker!');
      wconn.connect();
		});
		
		wconn.on('message', function(message) {
			console.log('Geometry received! Sending... (level %d)!', message.level); 
			client.send(message);
		});
		
		wconns[i] = wconn;
  }
  
  // Splicing over levels
  client.on('message', function(message) {
  	console.log('Distributing computation over %d worker server(s)...', available);
    var reqLevel = message.level,
    		i, j;
    for (i = 0, j = i % workers.length; i < levels.length && levels[i] < reqLevel; i++) {
			console.log('Dispatching to worker %d... (level %d)', j, levels[i]);    
    	message.level = levels[i];
    	wconns[j].send(message);
    }
    console.log('Dispatching to worker %d... (level %d)', j, reqLevel);   
   	message.level = reqLevel;
    wconns[j].send(message);    
  });
  
  client.on('disconnect',function() {
    // TODO
  });
  
});

// Sampling levels
var levels = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

// List of workers server to use
var workers = [
	'localhost'
];