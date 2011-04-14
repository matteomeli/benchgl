function start() {
	var time = 0,
			requestedSamplingLevel = 64,
			isolevel = 50,
			xRot = yRot = 0, z = -2.0, mouseDown = false, toSample = true,
			sampler = function(x, y, z, t) {
				var result = 0,
						height = 20 * (t + Math.sqrt((0.5 - x) * (0.5 - x) + (0.5 - y) * (0.5 - y)));
						
				height = 1.5 + 0.1 * (Math.sin(height) + Math.cos(height)),
				result = (height - z) * 50;
				return result;
	  	};
  
  // Start the application
	BenchGL('surfaces-canvas', {
		program : {
			type : 'scripts',
			vertex : 'surfaces-vs',
			fragment : 'surfaces-fs'
		},
		events : {
			onMouseDown : function(e, x, y) {
				if (e.button === 0) {
					mouseDown = true;
				}
			},
			onMouseUp : function(e, x, y) {
				if (e.button === 0) {
					mouseDown = false;
				}
			},
			onMouseMove : function(e, dx, dy) {
				if (mouseDown) {
					xRot += dy/2;
					yRot += dx/2;
				}
			},
			onMouseWheel : function(e, delta) {
				z += delta/10;
			}
		},
		onError : function() {
			alert('An error occured launching the application...');
		},
		onLoad : function(handler) {
			var gl = handler.gl,
					canvas = handler.canvas,
					program = handler.program,
					camera = handler.camera,
					renderer = handler.renderer;
			
			function client() {
				// Create SocketIO instance, connect
				var socket = new io.Socket('localhost', {
				  port: 3333
				});
				socket.connect(); 
				
				// Add a connect listener
				socket.on('connect', function() {
				  console.log('Client has connected to the server!');
				});
				// Add a connect listener
				socket.on('message', function(data) {
				  console.log('Received a message from the server!', data);
				});
				// Add a disconnect listener
				socket.on('disconnect', function() {
				  console.log('The client has disconnected!');
				});
			};
			
			client();
		}
	});
};