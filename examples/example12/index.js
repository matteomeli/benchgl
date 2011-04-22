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
					program = handler.program,
					camera = handler.camera,
					renderer = handler.renderer,
					timer = new BenchGL.Timer(),
					cube = BenchGL.Model.factory('cube'),
					sphere = BenchGL.Model.factory('sphere'),
					cubeAngle = 0,
					moonAngle = 180;
          
      renderer.addModels(sphere, cube);    
			
			renderer.useLights(true);
			renderer.setDirectionalColor(0.0, 0.0, 0.0);
			renderer.addLight('light0', {
				position 	: {
					x : 0,
					y : 0,
					z : -20
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
				renderer.setAmbientColor(ambientR, ambientG, ambientB);
				light.setDiffuse(lightR, lightG, lightB);
				light.setPosition(lightX, lightY, lightZ);
			};
			
			function display() {
        renderer.background();
        
        camera.reset();
        camera.model().translate(0, 0, -20);
        
        sphere.rotate(moonAngle, 0, 1, 0);
        sphere.translate(5, 0, 0);
        sphere.setTextures('moon');
        
        cube.rotate(cubeAngle, 0, 1, 0);
        cube.translate(5, 0, 0);
        cube.setTextures('crate');
        
        renderer.renderAll();
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