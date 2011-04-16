function start() {
	var time = 0,
			samplingLevel = 0,
			requestedSamplingLevel = 32,
			samplingStep = 1.0 / samplingLevel,
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
					renderer = handler.renderer,
					surface = new BenchGL.Model(gl, {
						colorPerVertex : false,
						dynamic : false
					});
			
			// Server connection stuff (Web Worker)
			var socket = new io.Socket('localhost', {
			  port: 3333
			});
			socket.connect(); 
			
			socket.on('connect', function() {
			  console.log('Client has connected to the server!');
			});
			
			socket.on('message', function(message) {
			  console.log('Received a message from the server!', message);
			  surface.setVertices(message.data.vertices);
				surface.setNormals(message.data.normals);
				samplingLevel = message.data.level;
			});
			
			socket.on('disconnect', function() {
			  console.log('The client has disconnected!');
			});
			
			// Rendering stuff		
			renderer.useLights(true);
			renderer.material.setShininess(10);
			renderer.setDirectionalColor(0.0, 0.0, 0.0);
			renderer.addLight('light0', {
				position 	: {
					x : 3.0,
					y : 3.0,
					z : 3.0
				},
				diffuse		: {
					r : 0.8,
					g : 0.4,
					b : 0.3
				}
			});
			
			function tick() {
				requestAnimFrame(tick);
				render();
			};
				
			function render() {
				renderer.background();
				
				camera.transform.view().loadIdentity();
				camera.transform.model().loadIdentity();
				
				camera.transform.translate(0.0, 0.0, z);
				camera.transform.rotate(-xRot, 1, 0, 0);
				camera.transform.rotate(yRot, 0, 1, 0);
				camera.transform.translate(-0.5, -0.5, -0.5);
				renderer.renderModel(surface);			
			};
			
			function sample() {
		    var body = sampler.toString(),
		    		config = {
							grid : {
								x : {
									start : 0,
									end : 1
								},
								y : {
									start : 0,
									end : 1
								},
								z : {
									start : 0,
									end : 1
								}
							},
							time			: time,
							isolevel 	: isolevel,
							body			: body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"))
						};
				
				//if (samplingLevel < requestedSamplingLevel) {
					socket.send(config);
				//}
			};
			
			sample();
			tick();
		}
	});
};