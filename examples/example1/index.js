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
					triangle = BenchGL.Model.factory('triangle'), 
					square = BenchGL.Model.factory('rectangle');
			
			renderer.background();
			
      camera.reset();
      camera.model.translate(0, 0, -7);
      
      renderer.setupCamera();
			
			triangle.translate(-1.5, 0, 0);
			renderer.renderModel(triangle);
			
			square.translate(1.5, 0, 0);
			renderer.renderModel(square);
		}
	});
};