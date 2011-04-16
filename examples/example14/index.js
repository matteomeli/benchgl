function $(id) {
	return document.getElementById(id);
};

function start() {
	BenchGL('example-canvas', {
		program : {
			type : 'scripts',
			vertex : 'per-fragment-lighting-vs',
			fragment : 'per-fragment-lighting-fs'
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
					teapot = BenchGL.Model.factory('json', {
						url : 'Teapot.json'
					}),
					teapotAngle = 0;
			
			renderer.useLights(true);
			renderer.setDirectionalColor(0.0, 0.0, 0.0);
			renderer.addLight('light0', {
				position 	: {
					x : -10.0,
					y : 4.0,
					z : -20.0
				},
				diffuse		: {
					r : 0.8,
					g : 0.8,
					b : 0.8
				}
			});
			
			renderer.useTextures(true);
			renderer.addTextures({
				metal : {
					src : 'metal.jpg'
				}
			});
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
				teapotAngle += 0.05 * elapsed;
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function handleControls() {
				var lightEnabled = $('lighting').checked,
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
						ambientB = +$('ambientB').value,
						shininess = +$('shininess').value;
				
				renderer.useLights(lightEnabled);
				renderer.useTextures(textureEnabled);
				renderer.setAmbientColor(ambientR, ambientG, ambientB);
				renderer.material.setShininess(shininess);
				light.setDiffuse(lightR, lightG, lightB);
				light.setPosition(lightX, lightY, lightZ);
			};
			
			function display() {
				renderer.background();
				
				camera.transform.view().loadIdentity();
				camera.transform.model().loadIdentity();

				camera.transform.translate(0.0, 0.0, -40.0);
				camera.transform.rotate(23.4, 1, 0, -1);
				camera.transform.rotate(teapotAngle, 0, 1, 0);
				renderer.setTextures('metal');
				renderer.renderModel(teapot);
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