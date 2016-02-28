function $(id) {
	return document.getElementById(id);
};

function start() {
	BenchGL.Engine('example-canvas', {
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
				
				camera.reset();
				
        renderer.setupCamera();
        renderer.setupTextures();
        
        cube.reset();
				cube.translate(0, 0, -5);
				cube.rotateXYZ(xRot, yRot, zRot);
				cube.setTextures('nehe');
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