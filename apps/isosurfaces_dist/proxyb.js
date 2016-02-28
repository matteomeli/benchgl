var http = require('http'),
		path = require('path'),
		io = require('socket.io'),
		ioc = require('./node-socket.io-client/socket.io').io,
		sys = require('sys'),
		port = process.argv[2] || 4444,
		wport = process.argv[3] || 3333;
		
if (process.argv[2] === 'help') {
	console.log('Usage: node proxyb.js [server-port] [servant-port]');
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
			console.log('Geometry received! Sending... (level %d)', message.level); 
			client.send(message);
		});
		
		wconns[i] = wconn;
  }
  
  // Splicing over grid (z axis)
  client.on('message', function(message) {
  	var grid = message.grid,
  			zstart = grid.z.start,
  			zend = grid.z.end,
  			partial = (zend - zstart) / available,
  			reqLevel = message.level,
    		i, j;
    		
    for (i = 0; i < levels.length && levels[i] < reqLevel; i++) {
    	console.log('Dispatching to %d workers... (level %d)', available, levels[i]);
    	message.level = levels[i]; 
	    for (j = 0; j < available; j++) {
	    	console.log('Dispatching to worker %d...', j);
	    	
	    	grid.z.start = j * partial;
	    	grid.z.end = j * partial + partial;
	    	message.grid = grid;
	    	wconns[j].send(message);
	    }
    }
    console.log('Dispatching to %d workers... (level %d)', available, reqLevel);
    message.level = reqLevel; 
    for (j = 0; j < available; j++) {
    	console.log('Dispatching to worker %d...', j);
    	 
    	grid.z.start = j * partial;
    	grid.z.end = j * partial + partial;
    	message.grid = grid;
    	wconns[j].send(message);
    }
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