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
			
			camera.transform.view().loadIdentity();
			camera.transform.model().loadIdentity();
			
			camera.transform.translate(-1.5, 0.0, -7.0);
			renderer.renderModel(triangle);
			
			camera.transform.translate(3, 0.0, 0.0);
			renderer.renderModel(square);
		}
	});
};