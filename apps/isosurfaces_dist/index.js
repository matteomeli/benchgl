function $(id) {
  return document.getElementById(id);
};

function start() {
	var status = $('status'),
      level = 32,
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
	BenchGL('surfaces-canvas', {
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
					surface = new BenchGL.Model(gl, {
						colorPerVertex : false,
						dynamic : true
					});
			
			// Node.js server connection stuff
			var socket = new io.Socket('localhost', {
			  port: 3333
			});
      
      printStatus(new Date().getTime() + ': Connecting to remote server...');
			socket.connect();
		
			socket.on('connect', function() {
        printStatus(new Date().getTime() + ': Connected to remote server...');
			  console.log('Connected!');
        sample();
			});
			
			socket.on('message', function(message) {
        console.log(new Date().getTime());
        var data = message.data;
        
        console.timeEnd('Calculating geometry (level ' + data.level +')');    
        printStatus(new Date().getTime() + ': Geometry received (level ' + data.level + ')!');
        
        surface.dynamic = true;
        surface.vertices = data.vertices;
        surface.normals = data.normals;
			});
			
			socket.on('disconnect', function() {
        // TODO: Implement better reconnection logic!
			  socket.connect();
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
        
        surface.rotate(-xRot, 1, 0, 0);
        surface.rotate(yRot, 0, 1, 0);
        surface.translate(-0.5, -0.5, -0.5);
        
        renderer.renderAll();
        
        if (surface.dynamic) {
          surface.dynamic = false;
        }
        
        requestAnimFrame(render);
			}
			
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
              level : level,
							time			: time,
							isolevel 	: isolevel,
							body			: body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"))
						};
            
       printStatus(new Date().getTime() + ': Geometry requested (level ' + level + ')!');
       console.time('Calculating geometry (level ' + level +')');		 
			 socket.send(config);
			}
      
      function printStatus(message) {
        status.innerHTML += message + "<br/>";
      }
      
      render();
		}
	});
};