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
						colors : [
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
						colors : [
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
					pyrRot = 0, cubeRot = 0;
          
      renderer.addModels(pyramid, cube);
			
			function display() {
				renderer.background();
				
				camera.reset();
        camera.model.translate(0, 0, -8);
        
        pyramid.translate(-1.5, 0, 0);
				pyramid.rotate(pyrRot, 0, 1, 0);
				
				cube.translate(1.5, 0, 0);
				cube.rotate(cubeRot, 1, 1, 1);
				
        renderer.renderAll();
			};
      
      function animate() {
        var elapsed = timer.stop().lastDelta;
        pyrRot += (90 * elapsed) / 1000.0;
        cubeRot -= (75 * elapsed) / 1000.0;   
      };
      
      function info() {
        $('fps').innerHTML = timer.fps + ' fps';
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