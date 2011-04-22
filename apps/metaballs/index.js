function $(id) {
  return document.getElementById(id);
};

function start() {
	var ball1 = $('ball1'),
			ball2 = $('ball2'),
			ball5 = $('ball5'),
			ball10 = $('ball10'),
			//ball15 = $('ball15'),
			size5 = $('size5'),
			size10 = $('size10'),
			size20 = $('size20'),
			size30 = $('size30'),
			size40 = $('size40'),
			grid = {
			  x: {
			    start: -1.6,
			    end: 1.6,
			    step: 0.2
			  },
			  y: {
			    start: -1.6,
			    end: 1.6,
			    step: 0.2
			  },
			  z: {
			    start: -1.6,
			    end: 1.6,
			    step: 0.2
			  }
			},
			numberOfBalls = 5,
			ballsUpdate = false;
			isolevel = 10,
			isolevelUpdate = false;
			time = 0,
			parallelization = 0,
			ratio = parallelization + 1,
			workers = Math.pow(8, parallelization),
			balls = new Metaballs(numberOfBalls, grid),
			xRot = yRot = 0, z = -5.0, mouseDown = false;
			
	// Register controls
	ball1.addEventListener('click', function(e) {
		numberOfBalls = 1;
		balls = new Metaballs(numberOfBalls, grid);
		ball1.style.color = 'red';
		ball2.style.color = '';
		ball5.style.color = '';
		ball10.style.color = '';
		//ball100.style.color = '';
	}, false);
	
	ball2.addEventListener('click', function(e) {
		numberOfBalls = 2;
		balls = new Metaballs(numberOfBalls, grid);
		ball1.style.color = '';
		ball2.style.color = 'red';
		ball5.style.color = '';
		ball10.style.color = '';
		//ball15.style.color = '';
	}, false);
	
	ball5.addEventListener('click', function(e) {
		numberOfBalls = 5;
		balls = new Metaballs(numberOfBalls, grid);
		ball1.style.color = '';
		ball2.style.color = '';
		ball5.style.color = 'red';
		ball10.style.color = '';
		//ball15.style.color = '';
	}, false);
	
	ball10.addEventListener('click', function(e) {
		numberOfBalls = 10;
		balls = new Metaballs(numberOfBalls, grid);
		ball1.style.color = '';
		ball2.style.color = '';
		ball5.style.color = '';
		ball10.style.color = 'red';
		//ball15.style.color = '';
	}, false);
	
	/*ball15.addEventListener('click', function(e) {
		numberOfBalls = 15;
		ballsUpdate = true;
		ball1.style.color = '';
		ball2.style.color = '';
		ball5.style.color = '';
		ball10.style.color = '';
		ball15.style.color = 'red';
	}, false);*/
	
	size5.addEventListener('click', function(e) {
		isolevel = 5;
		size5.style.color = 'red';
		size10.style.color = '';
		size30.style.color = '';
	}, false);
	
	size10.addEventListener('click', function(e) {
		isolevel = 10;
		size5.style.color = '';
		size10.style.color = 'red';
		size30.style.color = '';
	}, false);
	
	size30.addEventListener('click', function(e) {
		isolevel = 30;
		size5.style.color = '';
		size10.style.color = '';
		size30.style.color = 'red';
	}, false);
  
  // Start the application
	BenchGL('metaballs-canvas', {
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
					timer = new BenchGL.Timer(),
					surface = new BenchGL.Model(gl, {
						useColors : false,
						dynamic : true
					}),
					pool = new BenchGL.WorkerPool('worker.js', workers);
			
      surface.setMaterialDiffuse(0.0, 0.4, 0.8);	
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
					g : 0.8,
					b : 0.8
				}
			});
			
			function tick() {
				requestAnimFrame(tick);
				sample();
				balls.update();
				info();
			};

			function info() {
				timer.stop();
				$('fps').innerHTML = 'Fps: ' + timer.fps;
			};
			
			function render() {
        if (!renderer.models.length) {
          renderer.addModels(surface);
        }
        
				renderer.background();
				
				camera.reset();
				
				surface.translate(0.0, 0.0, z);
				surface.rotate(-xRot, 1, 0, 0);
				surface.rotate(yRot, 0, 1, 0);
				
        renderer.renderAll();
			};
			
			function sample() {
			  var x = grid.x,
			      xstart = x.start,
			      xend = x.end,
			      xstep = x.step,
			      nx = ((xend - xstart) / ratio),
			      y = grid.y,
			      ystart = y.start,
			      yend = y.end,
			      ystep = y.step,
			      ny = ((yend - ystart) / ratio),
			      z = grid.z,
			      zstart = z.start,
			      zend = z.end,
			      zstep = z.step,
			      nz = ((zend - zstart) / ratio);
			      
				pool.map(function(i) {
			    var idx = i % ratio,
					    idy = ((i / ratio) >> 0) % ratio,
					    idz = ((i / ratio / ratio) >> 0) % ratio;
					
					var config = {
						grid : {
							x : {
			          start: xstart + idx * nx,
			          end: xstart + idx * nx + nx,
			          step: xstep
							},
							y : {
			          start: ystart + idy * ny,
			          end: ystart + idy * ny + ny,
			          step: ystep
							},
							z : {
			          start: zstart + idz * nz,
			          end: zstart + idz * nz + nz,
			          step: zstep
							}
						},
						isolevel : isolevel,
						time : time,
						balls : balls.toArray()
					};
					
					return config;
				});
				
				pool.reduce(function(total, partial) {
					var l = partial.vertices.length, i = 0;
					while (i < l) {
						total.vertices.push(partial.vertices[i]);
						total.normals.push(partial.normals[i]);
						i++;
					}
					return total;
				}, 
				function(result) {
				  surface.vertices = result.vertices;
					surface.normals = result.normals;
          render();
				}, {
					vertices 	: [],
					normals 	: []
				});
				
				pool.clean();
			};
			
			// Call tick function
			timer.start();
			tick();
		}
	});
};