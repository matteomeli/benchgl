// bench.js
// The core module for the library, provides the main entry point for external applications.

BenchGL.namespace('BenchGL.core');

BenchGL.core.WebGL = (function() {

	// Private properties and methods 
	var WebGL;

	WebGL = function(canvas, options) {
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
	
	return WebGL;

}());

BenchGL.core.Engine = (function() {

	var WebGL = BenchGL.core.WebGL,
			Program = BenchGL.webgl.Program,
			Canvas = BenchGL.ui.Canvas,
			Camera = BenchGL.ui.Camera,
			Renderer = BenchGL.drawing.Renderer,
			instance,
			Engine;

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
    gl = new WebGL(canvasId, contextOptions).getContext();
    
    if (!gl) {
      options.onError();
      return null;
    }
    
    // Create a canvas wrapper to handle user events
    canvas = new Canvas(gl.canvas, eventsOptions);
    
    // Create a camera
    camera = new Camera($.mix(cameraOptions, {
      aspect: gl.canvas.width / gl.canvas.height
    }));
    
    // Set up the shader program asynchronously
    program = Program.factory(gl, $.mix({
      onSuccess : function(program) {
        start(gl, program, function(application) {
          options.onLoad(application);
        });
      },
      onError : function(e) {
        options.onError(e);
      }
    }, programOptions));
    
    // If the program has loaded correctly, call the onLoad callback
    if (program) {
      start(gl, program, function(application) {
        options.onLoad(application);
      });
    }
    
    // Calls the user application
    function start(gl, program, callback) {
    	// Binds the loaded program for rendering
      program.bind();
      
      // Create a renderer
      renderer = new Renderer(gl, program, camera, effectsOptions);
      
      // Call the application with library handlers references 
      callback({
        gl: gl,
        canvas: canvas,
        program: program,
        camera: camera,
        renderer: renderer
      });      
    }
  };
  
 	return Engine;
  
}());

// Framework version
BenchGL.version = '0.1';

// WebGL context container
var gl;
