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
					xRot = yRot = zRot = 0;
			
			renderer.useTextures(true);
			renderer.addTextures({
				nehe : {
					src : 'nehe.gif'
				}
			});
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
        xRot += (90 * elapsed) / 1000.0;
        yRot += (90 * elapsed) / 1000.0;
        zRot += (90 * elapsed) / 1000.0;
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function display() {
				renderer.background();
				
				camera.transform.view().loadIdentity();
				camera.transform.model().loadIdentity();
				
				camera.transform.translate(0.0, 0.0, -5.0);
				camera.transform.rotate(xRot, 1, 0, 0);
				camera.transform.rotate(yRot, 0, 1, 0);
				camera.transform.rotate(zRot, 0, 0, 1);
				renderer.setTextures('nehe');
				renderer.renderModel(cube);
			};
			
			function tick() {
				requestAnimFrame(tick);
				display();
				animate();
				info();
			};

			timer.start();			
			tick();
		}
	});
};