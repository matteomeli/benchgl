// core.js
// The core module provides the main entry point for the library.

BenchGL.namespace('BenchGL.core.Engine');

BenchGL.core.Engine = (function() {

	// Dependencies
	var WebGL = BenchGL.webgl.WebGL,
			Program = BenchGL.webgl.Program,
			Canvas = BenchGL.ui.Canvas,
			Camera = BenchGL.ui.Camera,
			Renderer = BenchGL.drawing.Renderer,
			instance,
			
			// Private properties
			Engine,
			
			// Private methods
			start = function(program, canvas, camera, effects, callback, debug) {
	    	// Binds the loaded program for rendering
	      program.bind();
	      
	      // Create a renderer
	      renderer = new Renderer(program, camera, effects);
	      
	      if (debug) {
	      	gl.setTracing(true);
	      }
	      
	      // Call the application with library handlers references 
	      callback({
	        gl: gl,
	        canvas: canvas,
	        program: program,
	        camera: camera,
	        renderer: renderer
	      });
	      
	      if (debug) {
	      	gl.setTracing(false);
	      }    
    	};

	/**
	 * Creates an instance of BenchGL. 
	 * @class Provides an entry point for BenchGL library.
	 * @param {String} canvasId The id of the canvas that WebGL exploits.
	 * @param {Object} [options] General options for initializing the library.
	 * @param {Object} [options.context] The options for the WebGL context.
	 * @param {Object} [options.program] The options for the shader program.
	 * @param {String} [options.program.type='defaults'] The type of shader program.
	 * @param {String} [options.program.vertex] The vertex shader source.
	 * @param {String} [options.program.fragment] The fragmente shader source.
	 * @param {String} [options.camera] The options for the camera.
	 * @param {Number} [options.camera.fovy=45] The field of view angle for the camera.
	 * @param {Number} [options.camera.near=0.1] The near clipping plane for the camera.
	 * @param {Number} [options.camera.far=100] The far clipping plane for the camera.
	 * @param {Object} [effects] Special effects for the rendering engine. 
	 * @param {Object} [events] Functions to eventually handle user events.
	 * @param {Boolean} [debug=false] Is debug active?
	 * @param {Function} [onError] Callback function to call on errors.
	 * @param {Function} [onLoad] Callback function to call after loading succesfully. 
	 */
  Engine = function(canvasId, options) {
  	if (instance) {
  		return instance;
  	}
  	
  	instance = this;
  	
    options = $.mix({
      context: {},
      program: {
        type: 'defaults'	// {defaults|urls|scripts|sources}
      },
      camera: {
        fovy: 45,
        near: 0.1,
        far: 100
      },
      effects: {
      	/* 
      	Example:
      	
      	fog : {
      		active : true,
      		color : [0.5, 0.5, 0.5],
      		near : 	10,
      		far : 100
      	}
      	
      	*/      	
      },
      events: {
      	/* 
      	Example:
      	
      	onKeyDown : function() { ... },
      	onMouseMove : function() { ... },
      	
      	*/
      },
      debug: false,
      onError: $.empty,
      onLoad: $.empty
    }, options || {});
    
    var contextOptions = options.context,
        eventsOptions = options.events,
        cameraOptions = options.camera,
        programOptions = options.program,
        effectsOptions = options.effects,
        canvas, program, camera, renderer;
    
    // Create the WebGL context and store it in a library-shared variable.
    gl = WebGL.getContext(canvasId, contextOptions);
    
    if (!gl) {
      options.onError();
      return null;
    }
    
    // Use webgl-trace.js library to trace webgl calls
    if (options.debug && WebGLDebugUtils) {
    	gl = WebGLDebugUtils.makeDebugContext(gl);
    }
    
    // Create a canvas wrapper to handle user events
    canvas = new Canvas(gl.canvas, eventsOptions);
    
    // Create a camera
    camera = new Camera($.mix(cameraOptions, {
      aspect: gl.canvas.width / gl.canvas.height
    }));
    
    // Set up the shader program asynchronously
    program = Program.factory($.mix({
      onSuccess : function(program) {
        start(program, canvas, camera, effectsOptions, function(application) {
          options.onLoad(application);
        }, options.debug);
      },
      onError : function(e) {
        options.onError(e);
      }
    }, programOptions));
    
    // If the program has loaded correctly, call the onLoad callback
    if (program) {
      start(program, canvas, camera, effectsOptions, function(application) {
        options.onLoad(application);
      }, options.debug);
    }
  };
  
 	return Engine;
  
}());

// Framework version
BenchGL.version = '0.1';

// WebGL context container
var gl;
