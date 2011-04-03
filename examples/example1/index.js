function start() {
	BenchGL('example1-canvas', {
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
					square = BenchGL.Model.factory('square');
			
			renderer.background();
			
			camera.transform.pushMatrix();
			camera.transform.translate([-1.5, 0.0, 0.0]);
			renderer.render(triangle);
			camera.transform.popMatrix();
			
			camera.transform.pushMatrix();
			camera.transform.translate([1.5, 0.0, 0.0]);
			renderer.render(square);
			camera.transform.popMatrix();
		}
	});
}