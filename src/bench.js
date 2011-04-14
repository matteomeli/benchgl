// bench.js

this.BenchGL = null;

(function(){
	
	BenchGL = function(canvasId, options) {
		options = $.mix({
			context : {},
			program : {
				type 	: 'defaults'			// Defaults, Scripts, Sources, Urls
			},
			camera 	: {
				fovy 	: 45,
				near 	: 0.1,
				far	 	: 100
			},
			effects : {
			},
			events  : {},
			debug		: false,
			onError : $.empty,
			onLoad : $.empty
		}, options || {});
		
		var gl, canvas, program, camera, renderer, handler;
		
		gl = new BenchGL.WebGL(canvasId, options.context).getContext();
		
		if (!gl) {
			options.onError();
			return null;
		}
		
		//if (options.debug) {
		//	gl.setTracing(true);
		//}
		
		canvas = new BenchGL.Canvas(gl.canvas, options.events);
	
		camera = new BenchGL.Camera($.mix(options.camera, { 
			aspect : gl.canvas.width / gl.canvas.height
		}));
		camera.update();
		
		/*program = BenchGL.Program.factory(gl, $.mix({
			onSuccess : function(program) {
				loadApplication(gl, program, function(application) {
					options.onLoad(application);
				});
			},
			onError : function(e) {
				options.onError(e);
			}
		}, options.program));*/

		program = BenchGL.Program.factory(gl, options.program);
		
		if (program) {
			loadApplication(gl, program, function(application) {
				options.onLoad(application)
			});
		}
		
		function loadApplication(gl, program, callback) {
			program.bind();
			
			renderer = new BenchGL.Renderer(gl, program, camera, options.effects);
			
			handler = {
				gl : gl,
				canvas : canvas,
				program : program,
				camera : camera,
				renderer : renderer
			};
			
			callback(handler);			
		};
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

$.capitalize = function(text) {
	if (text && text.length > 0) {
		text = text.charAt(0).toUpperCase() + text.slice(1);	
	}
	return text;
};

$.empty = function() {};

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, 
         					/* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();
