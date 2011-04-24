function $(id) {
	return document.getElementById(id);
};

function start() {
	var xRot = yRot = 0,
			mouseDown = false;
	
	BenchGL.core.Engine('example-canvas', {
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
					xRot += dy/10;
					yRot += dx/10;
				}
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
					timer = new BenchGL.ui.Timer(),
					sphere = BenchGL.drawing.Model.factory('sphere');
			
			renderer.useLights(true);
			
			renderer.useTextures(true);
			renderer.addTextures({
				moon : {
					src : 'moon.gif'
				}
			});
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function handleControls() {
				var lightEnabled = $('lighting').checked,
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
				renderer.setLightingDirection(lightX, lightY, lightZ);
				renderer.setDirectionalColor(lightR, lightG, lightB);
				renderer.setAmbientColor(ambientR, ambientG, ambientB);
			};
			
			function display() {
				renderer.background();
				
				camera.reset()
        
        renderer.setupCamera();
        renderer.setupLights(); 
        renderer.setupTextures();           
				
				sphere.reset();
				sphere.translate(0.0, 0.0, -3.0);
				sphere.rotate(-xRot, 1, 0, 0);
				sphere.rotate(yRot, 0, 1, 0);
				sphere.setTextures('moon');
				renderer.renderModel(sphere);
			};
			
			function tick() {
				requestAnimFrame(tick);
				handleControls();
				display();
				info();
			};
		
			tick();
		}
	});
};