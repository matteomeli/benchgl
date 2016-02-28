function $(id) {
  return document.getElementById(id);
};

function start() {
	var status = $('status'),
			button = $('sample'),
			level = $('level'),
			lastLevel = -1,
      samplingLevel = +level.value,
      time = 0,
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
	BenchGL.Engine('surfaces-canvas', {
		program : {
      type : 'urls',
      vertex : '../../shaders/surfaces.vertex',
      fragment : '../../shaders/surfaces.fragment'
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
					surface = new BenchGL.drawing.Model(gl, {
						colorPerVertex : false,
						dynamic : true
					});
			
			// Node.js server connection stuff
			//var socket = new io.Socket('plm.dia.uniroma3.it', { port: 3333, connectTimeout : 60000 });
			var socket = new io.Socket(null, { port: 4444, connectTimeout : 60000 });
			socket.connect();
			
			socket.on('message', function(message) {
				var end = new Date().getTime(),
						transportTime = end - message.start;
						
				console.log('Transport time (level ' + message.level + '): ' + transportTime + 'ms');		
				
        if (message.type === 'chunk') {
       		console.log('Data [chunk] (level ' + message.level + '): ' + (message.vertices.length*2)/3);
        } else if (message.type === 'last') {
       		console.log('Data [last chunk] (level ' + message.level + '): ' + (message.vertices.length*2)/3);
       		console.timeEnd('Total time (level ' + message.level + ')');
        } else if (message.type === 'first' || message.type === 'unique') {
					if (message.type === 'first') {
       			console.log('Data [first chunk] (level ' + message.level + '): ' + (message.vertices.length*2)/3);
       		} else {
       			console.log('Data [full] (level ' + message.level + '): ' + (message.vertices.length*2)/3);
       		}
					
					if (message.type === 'unique') {
						console.timeEnd('Total time (level ' + message.level + ')');
					}
        }
        
        if (message.level !== lastLevel) {
        	lastLevel = message.level;
        	surface.vertices = message.vertices;
        	surface.normals = message.normals;
        } else {
        	surface.vertices = surface.vertices.concat(message.vertices);
        	surface.normals = surface.normals.concat(message.normals);
        }
        
        surface.dynamic = true;
			});
			
			socket.on('connect', function() {
			  console.log('Connected!');
			});
			
			socket.on('disconnect', function() {
        console.log('Disconnected!');
        socket.connect();
			});
			
			socket.on('reconnect', function() {
        console.log('Reconnected!');
			});
			
			socket.on('reconnecting', function(nextTry) {
        console.log('Reconnecting to server (next attempt in ' + nextTry + ' ms) ...');
			});
			
			socket.on('reconnect_failed', function() {
        console.log('Reconnection failed!');
			});
			
			// Rendering stuff
      surface.setMaterialDiffuse(0.8, 0.4, 0.4);  
      surface.setMaterialShininess(10);
			renderer.useLights(true);
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
				
			function render() {
        if (!renderer.models.length) {
          renderer.addModels(surface);
        }
        
        renderer.background();
        
        camera.reset();
        camera.model().translate(0.0, 0.0, z);
        
        surface.reset();
        surface.rotate(-xRot, 1, 0, 0);
        surface.rotate(yRot, 0, 1, 0);
        surface.translate(-0.5, -0.5, -0.5);
        
        renderer.renderAll();
        
        if (surface.dynamic) {
          surface.dynamic = false;
        }
        
        requestAnimFrame(render);
			}
			
			button.addEventListener('click', function(e) {
				samplingLevel = +level.value;
				sample();
			}, false);
			
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
							start : new Date().getTime(),
		          level : samplingLevel,
							time			: time,
							isolevel 	: isolevel,
							body			: body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"))
						};
		        
		   console.time('Total time (level ' + samplingLevel +')');		 
			 socket.send(config);
			}
      
      render();
		}
	});
};