// canvas.js
// Gives a Canvas class to wrap a <canvas> HTML5 element and handle its events.

BenchGL.namespace('BenchGL.ui');

BenchGL.ui.Canvas = (function() {

	var Canvas;
	
	/**
	 * Creates a new Canvas.
	 * @class Represents a wrap object for a canvas HTML5 element.
	 * @param {HTMLCanvasElement} canvas The canvas element.
	 * @options {Object} options Contains callback functions to handle events occurring in the browser.
	 */
  Canvas = function(canvas, options) {
    options = $.mix({
      onKeyDown: $.empty,
      onKeyUp: $.empty,
      onMouseDown: $.empty,
      onMouseUp: $.empty,
      onMouseMove: $.empty,
      onMouseWheel: $.empty,
      onMouseOut: $.empty
    }, options || {});
    
    //canvas.contentEditable = true;
    
    this.canvas = canvas;
    this.events = options;
    this.keysDown = {};
    this.mouseDown = {};
    this.mousePosition = {
      x: 0.0,
      y: 0.0
    };
    this.mouseLastPosition = {
      x: 0.0,
      y: 0.0
    };
    this.mouseDelta = {
      x: 0.0,
      y: 0.0
    };
    
    var myself = this;
    document.addEventListener('keydown', function(e) { myself.onKeyDown(e); }, false);
    document.addEventListener('keyup', function(e) { myself.onKeyUp(e); }, false);
    canvas.addEventListener('mousedown', function(e) { myself.onMouseDown(e); }, false);
    canvas.addEventListener('mouseup', function(e) { myself.onMouseUp(e); }, false);
    canvas.addEventListener('mousemove', function(e) { myself.onMouseMove(e); }, false);
    canvas.addEventListener('mousewheel', function(e) { myself.onMouseWheel(e); }, false);
    canvas.addEventListener('DOMMouseScroll', function(e) { myself.onMouseWheel(e); }, false);
  };
  
  /**
   * Handles the 'keydown' event, if supplied.
   * @param {Event} e Information about the event occured.
   */
  Canvas.prototype.onKeyDown = function(e){
    this.keysDown[e.keyCode] = true;
    this.events.onKeyDown(e);
  };

  /**
   * Handles the 'keyup' event, if supplied.
   * @param {Event} e Information about the event occured.
   */  
  Canvas.prototype.onKeyUp = function(e){
    this.keysDown[e.keyCode] = false;
    this.events.onKeyUp(e);
  };

  /**
   * Handles the 'mousedown' event, if supplied.
   * @param {Event} e Information about the event occured.
   */   
  Canvas.prototype.onMouseDown = function(e){
    var x = e.clientX, y = this.canvas.height - e.clientY - 1;
    
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseLastPosition.x = x;
    this.mouseLastPosition.y = y;
    this.mouseDelta.x = 0.0;
    this.mouseDelta.y = 0.0;
    this.mouseDown[e.button] = true;
    
    this.events.onMouseDown(e, x, y);
  };

  /**
   * Handles the 'mouseup' event, if supplied.
   * @param {Event} e Information about the event occured.
   */   
  Canvas.prototype.onMouseUp = function(e){
    var x = e.clientX, y = this.canvas.height - e.clientY - 1;
    
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseLastPosition.x = x;
    this.mouseLastPosition.y = y;
    this.mouseDelta.x = 0.0;
    this.mouseDelta.y = 0.0;
    this.mouseDown[e.button] = false;
    
    this.events.onMouseUp(e, x, y);
  };

  /**
   * Handles the 'mousemove' event, if supplied.
   * @param {Event} e Information about the event occured.
   */   
  Canvas.prototype.onMouseMove = function(e){
    var x = e.clientX, y = this.canvas.height - e.clientY - 1;
    
    this.mouseLastPosition.x = this.mousePosition.x;
    this.mouseLastPosition.y = this.mousePosition.y;
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseDelta.x = this.mousePosition.x - this.mouseLastPosition.x;
    this.mouseDelta.y = this.mousePosition.y - this.mouseLastPosition.y;
    
    this.events.onMouseMove(e, this.mouseDelta.x, this.mouseDelta.y);
  };

  /**
   * Handles the 'mousewheel' event, if supplied.
   * @param {Event} e Information about the event occured.
   */     
  Canvas.prototype.onMouseWheel = function(e) {
    var x = e.clientX, y = this.canvas.height - e.clientY - 1, delta = 0;
    
    this.mouseLastPosition.x = this.mousePosition.x;
    this.mouseLastPosition.y = this.mousePosition.y;
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    
    if (!e) {
      e = window.event;
    }
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
      if (window.opera) {
        delta = -delta;
      }
    }
    else if (e.detail){
      delta = -e.detail / 3;
    }
    
    if (delta) {
      this.events.onMouseWheel(e, delta);
    }
  };
  
  return Canvas;
  
}());

BenchGL.ui.Camera = (function() {
	
	// Dependencies
	var Vec3 = BenchGL.math.Vector3,
			MatStack = BenchGL.math.MatrixStack,
			
			// Private properties and methods
      Camera;
	
	/**
	 * Creates a new Camera.
	 * @class Represents a camera with a point of view over a 3D scene.
	 * @param {Object} options The options to set up this Camera.
	 * @param {Number} options.fovy The field of view vertical angle.
	 * @param {Number} options.aspect The aspect ratio.
	 * @param {Number} options.near The near clipping plane.
	 * @param {Number} options.far The far clipping plane.
	 * @param {Number[]} [options.eye] The position vector of this Camera.
	 * @param {Number[]} [options.direction] The viewing direction vector of this Camera.
	 * @param {Number[]} [options.up] The up vector of this Camera. 
	 */
	Camera = function(options) {
		var e = options.eye,
				d = options.direction,
				u = options.up,
				fovy = options.fovy,
				aspect = options.aspect,
				near = options.near,
				far = options.far;
		
		this.fovy = fovy;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.eye = (e && new Vec3(e.x, e.y, e.z)) || new Vec3(0, 0, 0);
		this.direction = (d && new Vec3(d.x, d.y, d.z)) || new Vec3(0, 0, -1);
		this.up = (u && new Vec3(u.x, u.y, u.z)) || new Vec3(0, 1, 0);
			
    this.projStack = new MatStack();
    this.viewStack = new MatStack();
    this.modelStack = new MatStack();
    
    this.viewStack.lookAt(this.eye, this.direction, this.up);
		this.projStack.perspective(fovy, aspect, near, far);
	};
  
  /**
   * Gets this Camera's projection stack.
   * @returns {MatrixStack} A projection matrix stack.
   */
  Camera.prototype.proj = function() {
    return this.projstack;
  };
  
	/**
	 * Gets this Camera's view stack.
	 * @returns {MatrixStack} A view matrix stack
	 */
  Camera.prototype.view = function() {
    return this.viewStack;
  };
  
	/**
	 * Gets this Camera's model stack.
	 * @returns {MatrixStack} A model matrix stack
	 */  
  Camera.prototype.model = function() {
    return this.modelStack;
  };

  /**
   * Gets the projection matrix of this Camera.
   * @returns {Matrix4} A matrix representing a projective transformation.
   */  
  Camera.prototype.projMatrix = function() {
    return this.projStack.top();
  };

  /**
   * Gets the view matrix of this Camera.
   * @returns {Matrix4} A matrix representing a transformation from world to camera space.
   */  
  Camera.prototype.viewMatrix = function() {
    return this.viewStack.top();
  };
  
  /**
   * Gets the model matrix of this Camera.
   * @returns {Matrix4} A matrix representing a common transformation to apply to the scene.
   */
  Camera.prototype.modelMatrix = function() {
    return this.modelStack.top();
  };

	/**
	 * Gets the modelView matrix of this Camera.
	 * @returns {Matrix4} A matrix representing the full tranformation from object to camera space.
	 */
  Camera.prototype.modelViewMatrix = function() {
    return this.viewStack.top().multiplyMat4(this.modelStack.top());
  };
  
  /**
   * Resets this Camera, loading identity matrices on top of the view and model stacks.
   */
  Camera.prototype.reset = function() {
    this.viewStack.loadIdentity();
    this.modelStack.loadIdentity();
  };
	
	/**
	 * Updates this Camera's local reference frame.
	 */
	Camera.prototype.update = function() {
		this.viewStack.lookAt(this.eye, this.direction, this.up);
	};
	
	return Camera;
	
}());

BenchGL.ui.Logger = (function() {
  
  // Private properties and methods
  var instance, 
  		Logger;

  Logger = function Logger() {
    if (instance) {
      return instance;
    }
    instance = this;
  };
  
  Logger.prototype.log = function(message) {
    console.log(message);
  };

	return Logger;
	
}());

BenchGL.ui.Timer = (function() {

	// Private properties and methods
	var nowTime = 0,
			lastTime = 0,
			elapsedTime = 0,
      Timer;

	Timer = function() {
		this.fps = 0;
		this.lastDelta = 0;
		this.maxSamples = 60;
		this.samples = [];
	};
	
	Timer.prototype.start = function() {
		nowTime = new Date().getTime();
		lastTime = nowTime;
		elapsedTime = 0;
		return this;
	};
	
	Timer.prototype.stop = function() {
		var now = new Date().getTime(),
        sample, i, l, fps = 0;
		
    lastTime = nowTime;
		nowTime = now;
		elapsedTime = nowTime - lastTime;
		sample = 1000.0 / elapsedTime;
				
		if (this.samples.unshift(sample) > this.maxSamples) {
      this.samples.pop();     
    }
		
		for (i = 0, l = this.samples.length; i < l; i++) {
			fps += this.samples[i];
		}
		fps /= this.samples.length;
		
		this.fps = Math.round(fps);
		this.lastDelta = elapsedTime;
		return this;
	};
	
	Timer.prototype.clear = function() {
		nowTime = 0;
		lastTime = 0;
		elapsedTime = 0;
		
		this.fps = 0;
		this.lastDelta = 0;
		this.samples = [];
		return this;
	};
	
	return Timer;
	
}());
