function $(id) {
	return document.getElementById(id);
};

function start() {
	BenchGL.Engine('example-canvas', {
		program : {
			type : 'urls',
			vertex : '../../shaders/lighting-pf.vertex',
			fragment : '../../shaders/lighting-pf.fragment'
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
					timer = new BenchGL.ui.Timer(),
					teapot = BenchGL.drawing.Model.factory('json', {
						url : 'Teapot.json',
						model : {
							dynamic : false
						}
					}),
					teapotAngle = 0;
      
      renderer.addModels(teapot);    
			
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
				light.setDiffuse(lightR, lightG, lightB);
				light.setPosition(lightX, lightY, lightZ);
        teapot.setMaterialShininess(shininess);
			};
			
			function display() {
				renderer.background();
				
				camera.reset()
        camera.model().translate(0.0, 0.0, -40.0);
				
				teapot.reset();
        teapot.rotate(23.4, 1, 0, -1);
				teapot.rotate(teapotAngle, 0, 1, 0);
				teapot.setTextures('metal');
				
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