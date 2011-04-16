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
					triangle = BenchGL.Model.factory('triangle', {
						color : [
							1.0, 0.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0
						]
					}), 
					square = BenchGL.Model.factory('rectangle', {
						color : [0.5, 0.5, 1.0, 1.0]
					}),
					rTri = 0, rRect = 0;
					
			timer.start();
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
				rTri += (90 * elapsed) / 1000.0;
        rRect += (75 * elapsed) / 1000.0;		
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function display() {
				renderer.background();
				
				camera.transform.view().loadIdentity();

				camera.transform.model().loadIdentity();
				
				camera.transform.translate(-1.5, 0.0, -7.0);
				camera.transform.pushMatrix();
				camera.transform.rotate(rTri, 0, 1, 0);
				renderer.renderModel(triangle);
				camera.transform.popMatrix();
				
				camera.transform.pushMatrix();
				camera.transform.translate(3.0, 0.0, 0.0);
				camera.transform.rotate(rRect, 1, 0, 0);
				renderer.renderModel(square);
				camera.transform.popMatrix();
			};
			
			function tick() {
				requestAnimFrame(tick);
				display();
				animate();
				info();
			};
			
			tick();
		}
	});
};