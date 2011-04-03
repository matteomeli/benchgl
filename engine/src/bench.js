//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

this.BenchGL = null;

(function(){
	
	BenchGL = function(canvasId, options) {
		options = $.mix({
			context : {},
			program : {
				from 			: 'Defaults',			// Defaults, Scripts, Sources, Urls
				vertex		: '',
				fragment 	: ''
			},
			camera 	: {
				fovy 	: 45,
				near 	: 0.1,
				far	 	: 100
			},
			effects : {
			},
			events  : {},
			onError : $.empty,
			onLoad : $.empty
		}, options || {});
		
		var gl, canvas, program, camera, renderer, handler;
		
		gl = new BenchGL.WebGL(canvasId, options.context).getContext();
		
		if (!gl) {
			options.onError();
			return null;
		}
		
		// create canvas and attach events
		canvas = new BenchGL.Canvas(gl.canvas, options.events);
		
		// create default program
		program = BenchGL.Program.factory(gl, options.program);
		
		if (!program.valid) {
			options.onError();
			return null;
		}
		
		// bind program
		program.bind();
		
		// create and update camera
		camera = new BenchGL.Camera($.mix(options.camera, { 
			aspect : gl.canvas.width / gl.canvas.height
		}));
		camera.update();
		
		// create renderer
		renderer = new BenchGL.Renderer(gl, program, camera, options.effects);
		
		// call the drawing function with an app object to hold references
		handler = {
			gl : gl,
			canvas : canvas,
			program : program,
			camera : camera,
			renderer : renderer
		};
		
		options.onLoad(handler);
	};

})();

// helper functions
function $(id) {
	return document.getElementById(id);
}

$.mix = function() {
	var i, object, key, mix = {};
	for (i = 0, l = arguments.length; i < l; i++) {	
		object = arguments[i];
		for (key in object) {
			if (object.hasOwnProperty(key)) {
				mix[key] = object[key];
			}
		}
	}
	return mix;
};

$.empty = function() {};
