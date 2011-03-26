//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


/**
 * Singleton instance of the BenchGL graphic engine.
 * @class Represents the main entry point for the graphic engine.
 */
var BenchGL = (function() {
	// Singleton instance
	var instance = null;
	
	// Private constructor
	function Bench() {
		this._canvas = null;
		this._program = null;
		this._transform = null;
		this._renderer = null;
		this._handler = null;
		
		this._running = false;
		this._debug = true;
	};

	/**
	 * Getters and setters.
	 */	
	Bench.prototype = {
		get canvas() { return this._canvas; },
		get program() { return this._program; },
		get transform() { return this._transform; },
		get renderer() { return this._renderer; },
		get handler() { return this._handler; },
		get isRunning() { return this._running; },
		get isDebugging() { return this._debug; },
		get gl() { return this._canvas.gl; },
	};

// ENGINE FUNCTIONS ******************************************************************** //

	/**
	 * Starts the engine.
	 * @param {String} canvasID The id of the canvas element to draw to.
	 * @param {Number} updateRate The target frame per second to achieve. 
	 * @param handler A reference to the client application object.
	 */
	Bench.prototype.start = function(canvasID, updateRate, handler) {
		this.log('Starting BenchGL engine (version 1.0)!');
		
		// The engine is now running
		this._running = true;
		
		// Save a reference handler for the client application
		this._handler = handler;
		
		// Initialize the canvas manager
		this._canvas = new CanvasManager(canvasID);
		
		// Create a default shader program
		this._program = new ProgramManager(this.gl);
		
		// Set a transform stack
		this._transform = new TransformManager();
		
		// Use a renderer
		this._renderer = new Renderer(this.gl, this._program, this._transform);
		
		// Is debugging active?
		this._debug = true;
		
		// Load application data
		this.log('Loading application data...');
		this._canvas.load();
		this.log('Done...');
		
		// Start a drawing loop if requested
		if (updateRate) {
			this.log('Starting drawing loop...');
			this._canvas.startDrawingLoop(updateRate);
		} else {
			this.log('Requesting a drawing...');
			this._canvas.requestDraw();
		}
	};
	
	/**
	 * Stops the engine.
	 */
	Bench.prototype.stop = function() {
		this._isRunning = false;
		this._canvas.clearDrawingLoop();
	};
	
	/**
	 * Pauses the engine.
	 */
	Bench.prototype.pause = function() {
		this.stop();
	};
	
	/**
	 * Sets a new frame per second target.
	 * @param {Number} updateRate The new fps target.
	 */
	Bench.prototype.restart = function(updateRate) {
		this._canvas.startDrawingLoop(updateRate);
	};
	
	Bench.prototype.fps = function() {
		 return this._canvas.getFps();
	};
	
	Bench.prototype.log = function(message) {
		Logger.getInstance().log(message);
	};

// TRANSFORMATION FUNCTIONS *********************************************************** //
	
	/**
	 * Changes the matrix stack to wich next tranformation will be applied.
	 * @param {Number} type A code that identifies the stack to be selected.
	 * The type argument can be on of: 
	 * 	- BGL_PROJECTION, 
	 * 	- BGL_MODEL,
	 * 	- BGL_VIEW;
	 */
	Bench.prototype.matrixMode = function(type) {
		this._transform.mode(type);
	};
	
	/**
	 * Loads the identity matrix onto the the current matrix stack.
	 */
	Bench.prototype.loadIdentity = function() {
		this._transform.loadIdentity();
	};
	
	/**
	 * Loads a perspective matrix onto the current matrix stack.
	 */
	Bench.prototype.perspective = function(fovy, aspect, near, far) {
		this._transform.perspective(fovy, aspect, near, far);
	};
	
	/**
	 * Loads a lookAt matrix onto the current matrix stack.
	 */
	Bench.prototype.lookAt = function(eye, center, up) {
		this._transform.lookAt(eye, center, up);
	};
	
	/**
	 * Copies the current matrix onto the the current matrix stack.
	 */	
	Bench.prototype.pushMatrix = function() {
		this._transform.pushMatrix();
	};
	
	/**
	 * Pops out the current matrix from the the current matrix stack.
	 */
	Bench.prototype.popMatrix = function() {
		this._transform.popMatrix();
	};
	
	/**
	 * Transforms the current matrix stack by a rotation matrix.
	 * @param {Number} angle The angle of the rotation in degrees.
	 * @param {Number} x The x-coordinate of the rotation axis.
	 * @param {Number} y The y-coordinate of the rotation axis.
	 * @param {Number} z The z-coordinate of the rotation axis.	
	 */
	Bench.prototype.rotate = function(angle, axis) {
		this._transform.rotate(angle, axis);
	};
	
	/**
	 * Transforms the current matrix stack by a translation matrix.
	 * @param {Number} x The translation factor on x-coordinate.
	 * @param {Number} y The translation factor on y-ccordinate.
	 * @param {Number} z The translation factor on z-coordinate.
	 */
	Bench.prototype.translate = function(vector) {
		this._transform.translate(vector);
	};
	
	/**
	 * Transforms the current matrix stack by a scaling matrix.
	 * @param {Number} w The width scaling factor.
	 * @param {Number} h The height scaling factor.
	 * @param {Number} d The 
	 */
	Bench.prototype.scale = function(vector) {
		this._transform.scale(vector);
	};
	
	/**
	 * Multiply the current matrix stack with the argument matrix.
	 * @param {Matrix} m The matrix tu use in the multiplication.
	 */
	Bench.prototype.multiply = function(m) {
		this._transform.multiply(m);
	};

// SHADER FUNCTIONS ****************************************************************** //

	Bench.prototype.createProgram = function(name, vertex, fragment) {
		this._program.createProgram(name, vertex, fragment);
	};
	
	Bench.prototype.createProgramFromShadersURL = function(name, vurl, furl) {
		this._program.createProgramFromShadersURL(name, vurl, furl);
	};
	
	Bench.prototype.createProgramFromShadersScript = function(name, vscriptId, fscriptId) {
		this._program.createProgramFromShadersScript(name, vscriptId, fscriptId);
	};
	
	Bench.prototype.createProgramFromShadersSource = function(name, vsrc, fsrc) {
		this._program.createProgramFromShadersSource(name, vsrc, fsrc);
	};
	
	Bench.prototype.createProgramFromShadersBuilder = function(name, vb, fb) {
		this._program.createProgramFromShadersBuilder(name, vb, fb);
	};

	Bench.prototype.useProgram = function(name) {
		this._program.useProgram(name);
	};
	
	Bench.prototype.setVertexShader = function(src) {
		this._program.setVertexShader(src);
	};
	
	Bench.prototype.setFragmentShader = function(src) {
		this._program.setFragmentShader(src);
	};
	
	Bench.prototype.setShaders = function(vertexSrc, fragmentSrc) {
		this._program.setShaders(vertexSrc, fragmentSrc);		
	};

	
// GRAPHIC FUNCTIONS ****************************************************************** //

	/**
	 * Switches lighting.
	 * @param {Boolean} lighting True to set lighting on, false otherwise.
	 */
	Bench.prototype.useLighting = function(lighting) {
		this._renderer.useLighting(lighting);
	};
	
	/**
	 * Switches texturing.
	 * @param {Boolean} texturing True to set texturing on, false otherwise.
	 */
	Bench.prototype.useTexturing = function(texturing) {
		this._renderer.useTexturing(texturing);
	};
	
	/**
	 * Swithces material use.
	 * @param {Object} material True to use materials, false otherwise.
	 */
	Bench.prototype.useMaterials = function(material) {
		this._renderer.useMaterials(material);
	};
	
	/**
	 * Switches alpha-blending.
	 * @param {Boolean} blending True to enable alpha-blending is on, false otherwise.
	 * @param [options] Information about the blending functions.
	 * @param options.srcBlendFunc The source blending function.
	 * @param options.destBlendFunc The destination blending function.
	 */
	Bench.prototype.useAlphaBlending = function(blending, options) {
		this._renderer.useAlphaBlending(blending, options);
	};
	
	/**
	 * Sets the clear color for the color buffer.
 	 * @param {Number[]} rgba An RGBA color.
	 */
	Bench.prototype.setClearColor = function(rgba) {
		this._renderer.setClearColor(rgba);
	};
	
	/**
	 * Sets the ambient light color.
	 * @param {Number[]} rgba An RGB color.
	 */
	Bench.prototype.setAmbientColor = function(rgb) {
		this._renderer.setAmbientColor(rgb);
	};
	
	/**
	 * Sets the directional light color.
	 * @param {Number[]} rgb An RGB color.
	 */
	Bench.prototype.setDirectionalColor = function(rgb) {
		this._renderer.setDirectionalColor(rgb);
	};
	
	/**
	 * Sets the directional light color.
	 * @param {Number[]} direction The direction of the light.
	 */
	Bench.prototype.setLightingDirection = function(direction) {
		this._renderer.setLightingDirection(direction);
	};
	
	Bench.prototype.createLight = function(name, options) {
		this._renderer.createLight(name, options);
	};
	
	/**
	 * Activate or set parameters of a Light in the scene.
	 * @param {Boolean|Object} [options] Information about a light or to activate a light.
	 */
	Bench.prototype.setLight = function(name, options) {
		this._renderer.setLight(name, options);
	};
	
	Bench.prototype.createTexture = function(name, options) {
		this._renderer.createTexture(name, options);
	};
	
	Bench.prototype.createTextures = function(textures) {
		this._renderer.createTextures(textures);
	};
	
	/**
	 * Activate one or more Texture in the scene.
	 * @param {String} name The name of the texture to activate.
	 */
	Bench.prototype.setTextures = function(textures) {
		this._renderer.setTextures(textures);
	};
	
// RENDER FUNCTIONS **************************************************************** //	
		
	/**
	 * Clears the color buffer and the depth buffer.
	 */
	Bench.prototype.background = function() {
		this._renderer.background();
	};

	/**
	 * Renders a Model.
	 * @param {Model} model The model to render.
	 */
	Bench.prototype.render = function(model, uniforms) {
		this._renderer.render(model, uniforms);
	};
	
	Bench.prototype.createModel = function(options) {
		return ModelFactory.getInstance().createModel(this.gl, options);
	};
	
	Bench.prototype.loadModel = function(type, options) {
		var model = null;
		switch (type) {
			case BGL_MODEL_JSON:
				model = ModelFactory.getInstance().loadFromJSON(this.gl, options);
				break;
			case BGL_MODEL_OBJ:
				model = ModelFactory.getInstance().loadFromOBJInBackground(this.gl, options);
				break;
			default:
				// Error format not supported
				break;
		}
		return model;
	};
	
	Bench.prototype.loadModels = function(objs) {
		return ModelFactory.getInstance().loadFromOBJsInBackground(this.gl, objs);
  };
	
	Bench.prototype.triangle = function(options) {
		return ModelFactory.getInstance().createTriangle(this.gl, options);
	};
	
	Bench.prototype.rectangle = function(options) {
		return ModelFactory.getInstance().createRectangle(this.gl, options);
	};
	
	Bench.prototype.circle = function(options) {
		return ModelFactory.getInstance().createCircle(this.gl, options);
	};
	
	Bench.prototype.cube = function(options) {
		return ModelFactory.getInstance().createCube(this.gl, options);
	};
	
	Bench.prototype.pyramid = function(options) {
		return ModelFactory.getInstance().createPyramid(this.gl, options);
	};
	
	Bench.prototype.sphere = function(options) {
		return ModelFactory.getInstance().createSphere(this.gl, options);
	};
	
	return new function() {
		this.getInstance = function() {
			if (instance == null) {
				instance = new Bench();
				instance.constructor = null;
			}
			return instance;
		}
	}
})();
