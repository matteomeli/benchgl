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
					triangle = BenchGL.drawing.Model.factory('triangle', {
            dynamic : false,
						colors : [
							1.0, 0.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0
						]
					}),
          square = BenchGL.drawing.Model.factory('rectangle', {
            dynamic : false,
            colors : [0.5, 0.5, 1.0, 1.0]
          }),
          triRot = 0, squareRot = 0;
          
      renderer.addModels(triangle, square);    
			
			function display() {
				renderer.background();
				
        camera.reset();
        camera.model().translate(0, 0, -7);
				
				triangle.reset();
				triangle.translate(-1.5, 0, 0);
				triangle.rotate(triRot, 0, 1, 0);
				
				square.reset();
				square.translate(1.5, 0, 0);
				square.rotate(squareRot, 1, 0, 0);
				
        renderer.renderAll();
			};

      function animate() {
        var elapsed = timer.stop().lastDelta;
        triRot += (90 * elapsed) / 1000.0;
        squareRot += (75 * elapsed) / 1000.0;   
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