function $(id) {
	return document.getElementById(id);
};

function start() {
	BenchGL.core.Engine('example-canvas', {
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
					cube = BenchGL.drawing.Model.factory('cube'),
					xRot = yRot = 0, z = -5.0,
					xSpeed = ySpeed = 0;
			
			renderer.useTextures(true);
			renderer.addTextures({
				crate : {
					src : 'crate.gif'
				}
			});
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
        xRot += (xSpeed * elapsed) / 1000.0;
        yRot += (ySpeed * elapsed) / 1000.0;
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function handleKeys() {
		    if (canvas.keysDown[33]) {
		      // Page Up
		      z += 0.05;
		    }
		    if (canvas.keysDown[34]) {
		      // Page Down
		      z -= 0.05;
		    }
		    if (canvas.keysDown[37]) {
		      // Left cursor key
		      ySpeed -= 1;
		    }
		    if (canvas.keysDown[39]) {
		      // Right cursor key
		      ySpeed += 1;
		    }
		    if (canvas.keysDown[38]) {
		      // Up cursor key
		      xSpeed -= 1;
		    }
		    if (canvas.keysDown[40]) {
		      // Down cursor key
		      xSpeed += 1;
		    }
			};
			
			function display() {
				renderer.background();
				
				camera.reset();
        
        renderer.setupCamera();
        renderer.setupTextures();        
				
				cube.reset();
				cube.translate(0.0, 0.0, z);
				cube.rotate(xRot, 1, 0, 0);
				cube.rotate(yRot, 0, 1, 0);
				cube.setTextures('crate');
				renderer.renderModel(cube);
			};
			
			function tick() {
				requestAnimFrame(tick);
				handleKeys();
				display();
				animate();
				info();
			};

			timer.start();			
			tick();
		}
	});
};