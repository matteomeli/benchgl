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
					pyramid = BenchGL.Model.factory('pyramid', {
						color : [
							1.0, 0.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							1.0, 0.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							1.0, 0.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							1.0, 0.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							0.0, 1.0, 0.0, 1.0
						]
					}), 
					cube = BenchGL.Model.factory('cube', {
						color : [
							1.0, 0.0, 0.0, 1.0,
							1.0, 0.0, 0.0, 1.0,
							1.0, 0.0, 0.0, 1.0,
							1.0, 0.0, 0.0, 1.0,
							1.0, 1.0, 0.0, 1.0,
							1.0, 1.0, 0.0, 1.0,
							1.0, 1.0, 0.0, 1.0,
							1.0, 1.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							1.0, 0.5, 0.5, 1.0,
							1.0, 0.5, 0.5, 1.0,
							1.0, 0.5, 0.5, 1.0,
							1.0, 0.5, 0.5, 1.0,
							1.0, 0.0, 1.0, 1.0,
							1.0, 0.0, 1.0, 1.0,
							1.0, 0.0, 1.0, 1.0,
							1.0, 0.0, 1.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
							0.0, 0.0, 1.0, 1.0,
						]
					}),
					rPyr = 0, rCube = 0;
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
				rPyr += (90 * elapsed) / 1000.0;
        rCube -= (75 * elapsed) / 1000.0;		
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function display() {
				renderer.background();
				
				camera.transform.view().loadIdentity();

				camera.transform.model().loadIdentity();
				
				camera.transform.translate(-1.5, 0.0, -8.0);
				camera.transform.pushMatrix();
				camera.transform.rotate(rPyr, 0, 1, 0);
				renderer.renderModel(pyramid);
				camera.transform.popMatrix();
				
				camera.transform.pushMatrix();
				camera.transform.translate(3.0, 0.0, 0.0);
				camera.transform.rotate(rCube, 1, 1, 1);
				renderer.renderModel(cube);
				camera.transform.popMatrix();
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