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
					triangle = BenchGL.Model.factory('triangle', {
						color : [
							1.0, 0.0, 0.0, 1.0,
							0.0, 1.0, 0.0, 1.0,
							0.0, 0.0, 1.0, 1.0
						]
					}), 
					square = BenchGL.Model.factory('rectangle', {
						color : [0.5, 0.5, 1.0, 1.0]
					});
			
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