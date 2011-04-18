// webgl.js

(function() {

	var WebGL = function(canvas, options) {
		var canvas = typeof canvas === "string" ? $(canvas) : canvas,
				gl = canvas.getContext('experimental-webgl', options);
		
		if (!gl) {
			gl = canvas.getContext('webgl', options);
		}
		
		this.context = gl;
		this.canvas = canvas;
	};
	
	WebGL.prototype.getContext = function() {
		return this.context;
	};
	
	WebGL.prototype.getCanvas = function() {
		return this.canvas;
	};
	
	BenchGL.WebGL = WebGL;

}());