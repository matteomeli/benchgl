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
					cube = BenchGL.Model.factory(gl, 'cube'),
					xRot = yRot = 0, z = -5.0,
					xSpeed = 3, ySpeed = -3;
			
			renderer.useLights(true);
			
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
				
				camera.transform.view().loadIdentity();
				camera.transform.model().loadIdentity();
				
				camera.transform.translate(0.0, 0.0, z);
				camera.transform.rotate(xRot, 1, 0, 0);
				camera.transform.rotate(yRot, 0, 1, 0);
				renderer.setTextures('crate');
				renderer.renderModel(cube);
			};
			
			function tick() {
				requestAnimFrame(tick);
				handleKeys();
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