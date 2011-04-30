// webgl.js

BenchGL.namespace('BenchGL.webgl.WebGL');

BenchGL.webgl.WebGL = (function() {
	
	// Private properties and methods 
	var WebGL;
	
	/**
	 * The WebGL container.
	 * @class Represents a container for the static method that retrieves a WebGL context.
	 */
	WebGL = {};
	
	/**
	 * Tries to retrieve a WebGL, if availale.
	 * @param {String|HTMLCanvasElement} The canvas id or element to leverage.
	 * @param {Object} Options for creating the context.
	 * @returns {WebGLRenderingContext} A WebGL rendering context or null if not available.
	 */
	WebGL.getContext = function(canvas, options) {
		var canvas = typeof canvas === "string" ? $(canvas) : canvas,
				options = options || {},
				gl = canvas.getContext('experimental-webgl', options);
		
		if (!gl) {
			gl = canvas.getContext('webgl', options);
		}
		
		return gl;
	};
	
	return WebGL;

}());