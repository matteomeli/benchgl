function $(id) {
	return document.getElementById(id);
};

function start() {
	BenchGL('example-canvas', {
		onError : function() {
			alert('An error occured launching the application...');
		},
		onLoad : function(handler) {
			var gl = handler.gl,
					canvas = handler.canvas,
					vertexProgram = handler.program,
					fragmentProgram = BenchGL.Program.FromScripts(gl, {
						vertex : 'per-fragment-lighting-vs',
						fragment : 'per-fragment-lighting-fs'
					}),
					currentProgram,
					camera = handler.camera,
					renderer = handler.renderer,
					timer = new BenchGL.Timer(),
					cube = BenchGL.Model.factory('cube'),
					sphere = BenchGL.Model.factory('sphere'),
					cubeAngle = 0,
					moonAngle = 180;
			
			renderer.useLights(true);
			renderer.setDirectionalColor(0.0, 0.0, 0.0);
			renderer.addLight('light0', {
				position 	: {
					x : 0.0,
					y : 0.0,
					z : -5.0
				},
				diffuse		: {
					r : 0.8,
					g : 0.8,
					b : 0.8
				}
			});
			
			renderer.useTextures(true);
			renderer.addTextures({
				crate : {
					src : 'crate.gif'
				},
				moon : {
					src : 'moon.gif'
				}
			});
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
				moonAngle += 0.05 * elapsed;
        cubeAngle += 0.05 * elapsed;
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function handleControls() {
				var lightEnabled = $('lighting').checked,
						perFragmentEnabled = $('fragment').checked,
						textureEnabled = $('texturing').checked,
						light = renderer.lights['light0'],
						lightR = +$('lightR').value,
						lightG = +$('lightG').value,
						lightB = +$('lightB').value,
						lightX = +$('lightX').value,
						lightY = +$('lightY').value,
						lightZ = +$('lightZ').value,
						ambientR = +$('ambientR').value,
						ambientG = +$('ambientG').value,
						ambientB = +$('ambientB').value;
				
				renderer.useLights(lightEnabled);
				renderer.useTextures(textureEnabled);
				renderer.setAmbientColor(ambientR, ambientG, ambientB);
				light.setDiffuse(lightR, lightG, lightB);
				light.setPosition(lightX, lightY, lightZ);
				
				// set current program
				if (perFragmentEnabled) {
					currentProgram = fragmentProgram;
				} else {
					currentProgram = vertexProgram;
				}
				currentProgram.bind();
				renderer.program = currentProgram;
			};
			
			function display() {
				renderer.background();
				
				camera.transform.view().loadIdentity();
				camera.transform.model().loadIdentity();
				
				camera.transform.translate(0.0, 0.0, -5.0);
				camera.transform.rotate(30, 1, 0, 0);
				
				camera.transform.pushMatrix();
				camera.transform.rotate(moonAngle, 0, 1, 0);
				camera.transform.translate(2.0, 0.0, 0.0);
				renderer.setTextures('moon');
				renderer.renderModel(sphere);
				camera.transform.popMatrix();
				
				camera.transform.pushMatrix();
				camera.transform.rotate(cubeAngle, 0, 1, 0);
				camera.transform.translate(1.25, 0.0, 0.0);
				renderer.setTextures('crate');
				renderer.renderModel(cube);
				camera.transform.popMatrix();
			};
			
			function tick() {
				requestAnimFrame(tick);
				handleControls();
				display();
				animate();
				info();
			};

			timer.start();			
			tick();
		}
	});
};