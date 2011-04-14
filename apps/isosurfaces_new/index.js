function start() {
	var surfaceR = $('surfaceR'),
			surfaceG = $('surfaceG'),
			surfaceB = $('surfaceB'),
			lightR = $('lightR'),
			lightG = $('lightG'),
			lightB = $('lightB'),
			lightX = $('lightX'),
			lightY = $('lightY'),
			lightZ = $('lightZ'),
			sampler = $('sampler'),
			workers = $('workers'),
			step = $('step'),
			iso = $('isolevel'),
			timeEnabled = $('time'),
			tFrom = $('timeFrom'),
			tTo = $('timeTo'),
			loop = $('loop'),
			play = $('play'),
			stop = $('stop'),
			speed = $('speed'),
			useTime = false,
			toSample = true,
			grid = {
			  x: {
			    start: 0,
			    end: 1,
			    step: 0.1
			  },
			  y: {
			    start: 0,
			    end: 1,
			    step: 0.1
			  },
			  z: {
			    start: 0,
			    end: 1,
			    step: 0.1
			  }
			},
			samplingSteps = 10,
			parallelization = +workers.value,
			isolevel = +iso.value,
			samplerIndex = +sampler.value,
			time = 0, fps = +speed.value,
			xRot = yRot = 0, z = -2.0, mouseDown = false,
			samplers = [
				function(x, y, z, t) {
					var result = 0,
							height = 20 * (t + Math.sqrt((0.5 - x) * (0.5 - x) + (0.5 - y) * (0.5 - y)));
							
					height = 1.5 + 0.1 * (Math.sin(height) + Math.cos(height)),
					result = (height - z) * 50;
					return result;
		  	},
		  	function(x, y, z, t) {
		  		var result = 0,
		  				offset = 1.0 + Math.sin(t),
		  				sourcePoint = [
								{
									x : 0.5,
									y : 0.5,
									z : 0.5
								},
								{
									x : 0.5,
									y : 0.5,
									z : 0.5
								},
								{
									x : 0.5,
									y : 0.5, 
									z : 0.5
								}
							],
							sp1 = sourcePoint[0],
							sp2 = sourcePoint[1],
							sp3 = sourcePoint[2],		  				
		  				dx, dy, dz;
		  		
		  		sp1.x *= offset;
		  		sp2.y *= offset;
		  		sp3.z *= offset;
		  		
		  		dx = x - sp1.x;
		  		dy = y - sp1.z;
		  		dz = z - sp2.z;
		  		result += 0.5 / (dx*dx + dy*dy + dz*dz);
		  		
		  		dx = x - sp2.x;
		  		dy = y - sp2.y;
		  		dz = z - sp2.z;
		  		result += 1.0 / (dx*dx + dy*dy + dz*dz);
		  		
		  		dx = x - sp3.x;
		  		dy = y - sp3.y;
		  		dz = z - sp3.z;
		  		result += 1.5 / (dx*dx + dy*dy + dz*dz);
		  		
		  		return result;
		  	},
		  	function(x, y, z, t) {
		  		var result = 0,
		  				offset = 1.0 + Math.sin(t),
		  				sourcePoint = [
								{
									x : 0.5,
									y : 0.5,
									z : 0.5
								},
								{
									x : 0.5,
									y : 0.5,
									z : 0.5
								},
								{
									x : 0.5,
									y : 0.5, 
									z : 0.5
								}
							],
							sp1 = sourcePoint[0],
							sp2 = sourcePoint[1],
							sp3 = sourcePoint[2],		  				
		  				dx, dy, dz;
		  		
		  		sp1.x *= offset;
		  		sp2.y *= offset;
		  		sp3.z *= offset;
		  		
		  		dx = x - sp1.x;
		  		dy = y - sp1.z;
		  		result += 0.5 / (dx*dx + dy*dy);
		  		
		  		dx = x - sp2.x;
		  		dz = z - sp2.z;
		  		result += 0.75 / (dx*dx + dz*dz);
		  		
		  		dy = y - sp3.y;
		  		dz = z - sp3.z;
		  		result += 1.0 / (dy*dy + dz*dz);
		  		
		  		return result;
		  	},
		  	function(x, y, z, t) {
		  		// TODO
		  	}
		  ];
	
	// Set event listeners for control widgets
	timeEnabled.addEventListener("click", function(e) {
		tFrom.disabled = !timeEnabled.checked;
		tTo.disabled = !timeEnabled.checked;
		play.disabled = !timeEnabled.checked;
		stop.disabled = !timeEnabled.checked;
		loop.disabled = !timeEnabled.checked;
		speed.disabled = !timeEnabled.checked;
	}, false);
	
	play.addEventListener("click", function(e) {
		if (timeEnabled.checked) {
			useTime = true;
			time = +tFrom.value;
			timeStep = (+tTo.value - +tFrom.value) / fps;
		}
	}, false);

	stop.addEventListener("click", function(e) {
		if (timeEnabled.checked) {
			useTime = false;
		}
	}, false);
  
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
					}),
					pool = new BenchGL.WorkerPool('marchingcubes.js', parallelization);
				
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
			
			function handleSampling() {
				toSample = false;
				if (+iso.value != isolevel) {
					isolevel = +iso.value;
					toSample = true;
				} 
				if (+sampler.value != samplerIndex) {
					samplerIndex = +sampler.value;
					toSample = true;
				}
				if (useTime) {
					if (time >= +tTo.value) {
						time = +tFrom.value;
						if (!loop.checked) {
							useTime = false;
						}
					} else {
						time += timeStep;
					}
					if (useTime) {
						toSample = true;
					}
				}
				if (+workers.value != parallelization) {
					parallelization = +workers.value;
					pool = new BenchGL.WorkerPool('marchingcubes.js', parallelization)
					toSample = true;
				}
				if (+step.value != samplingSteps) {
					samplingSteps = +step.value;
					grid.x.step = (grid.x.end - grid.x.start) / samplingSteps;
					grid.y.step = (grid.y.end - grid.y.start) / samplingSteps;
					grid.z.step = (grid.z.end - grid.z.start) / samplingSteps;
					toSample = true;
				}
				if (+speed.value != fps) {
					fps = +speed.value;
				}
			};
			
			function handleControls() {
				renderer.material.setDiffuse(+surfaceR.value, +surfaceG.value, +surfaceB.value);
				renderer.lights['light0'].setPosition(+lightX.value, +lightY.value, +lightZ.value);
				renderer.lights['light0'].setDiffuse(+lightR.value, +lightG.value, +lightB.value);
			};
			
			function display() {
				if (toSample) {
					sample();
				} else {
					render();
				}
				
				handleControls();
				handleSampling();
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
				requestAnimFrame(display);
			};
			
			function sample() {
				var start, end, elapsed,
						body = samplers[+sampler.value].toString(),
			  		x = grid.x,
			      xstart = x.start,
			      xend = x.end,
			      xstep = x.step,
			      nx = ((xend - xstart) / parallelization),
			      y = grid.y,
			      ystart = y.start,
			      yend = y.end,
			      ystep = y.step,
			      ny = ((yend - ystart) / parallelization),
			      z = grid.z,
			      zstart = z.start,
			      zend = z.end,
			      zstep = z.step,
			      nz = ((zend - zstart) / parallelization);;
						
				// DEBUG
				start = new Date().getTime();
				console.log(start + ': Sampling started!');
				// DEBUG
				
				pool.map(function(i) {
			    var config = {
						grid : {
							x : {
								start : xstart,
								end : xend,
								step : xstep
							},
							y : {
								start : ystart,
								end : yend,
								step : ystep,
							},
							z : {
								start : i * nz,
								end : i * nz + nz,
								step : zstep
							}
						},
						time			: time,
						isolevel 	: isolevel,
						body			: body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"))
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
					// DEBUG
					end = new Date().getTime();
					elapsed = end - start;
					console.log(end + ': Sampling done! (Time elapsed: ' + elapsed + ' ms)');
					// DEBUG
					
				  surface.setVertices(result.vertices);
					surface.setNormals(result.normals);
					render();
				}, {
					vertices 	: [],
					normals 	: []
				});
				
				pool.clean();	
			};
			
			// Call display function
			display();
		}
	});
};