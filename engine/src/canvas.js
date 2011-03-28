//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

/**
 * Creates a new CanvasUI.
 * @class Holds information about a canvas.
 */
function CanvasUI(canvas) {
	this._canvas = canvas;
	
	this._keysDown = {};
	this._mouseButtonsDown = {};
	this._mousePos = { x: 0.0, y: 0.0 };
	this._mouseLastPos = { x: 0.0, y: 0.0 };
	this._mouseDelta = { x: 0.0, y: 0.0 };
};

/**
 * Getters.
 */
CanvasUI.prototype = {
	get canvas() { return this._canvas; },
	get height() { return this._canvas.height; },
	get width() { return this._canvas.width; },
	
	get keysDown() { return this._keysDown; },
	get mouseButtonsDown() { return this._mouseButtonsDown; },
	get mousePos() { return this._mousePos; },
	get mouseLastPos() { return this._mouseLastPos; },
	get mouseDelta() { return this._mouseDelta; }
};


/**
 * Creates a new CanvasManager.
 * @class Manages a canvas wrapped in a CanvasUI object.
 */
function CanvasManager(canvasID) {
	var handler = BenchGL.getInstance().handler;
	
	var canvas = document.getElementById(canvasID);
	if (!canvas) throw new Error("Canvas not found.");
	
	//canvas.contentEditable = true;

	var gl = getWebGLContext(canvasID);
	if (!gl) throw new Error("Can't initialize WebGL context.");
	
	var ui = new CanvasUI(canvas);
	var timer = new Timer();
	handler.ui = ui;
	
	this.gl = gl;
	this._handler = handler;
	this._canvas = canvas;
	this._ui = ui;
	
	this._timerID = null;
	
	this._timer = timer;
	
	// Get a reference to this object for closures
	var myself = this;
	
	this.drawAwaiting = false;
	this.drawFunc = function() {
		myself.draw();
	}
	
	// Register event functions (document)
	document.addEventListener("keydown", function(e) { myself.keydown(e); }, false);
	document.addEventListener("keyup", function(e) { myself.keyup(e); }, false);
	
	// Register event functions (canvas)
	this._canvas.addEventListener("mousedown", function(e) { myself.mousedown(e); }, false);
	this._canvas.addEventListener("mouseup", function(e) { myself.mouseup(e); }, false);
	this._canvas.addEventListener("mousemove", function(e) { myself.mousemove(e); }, false);
	this._canvas.addEventListener("mousewheel",      function(e) { myself.mousewheel  (e); }, false);
	this._canvas.addEventListener("DOMMouseScroll",  function(e) { myself.mousewheel  (e); }, false);
};

/**
 * Getters and setters.
 */
CanvasManager.prototype = {
	get handler() { return this._handler; },
	get canvas() { return this._canvas; },
	get ui() { return this._ui; },
};

/**
 * Gets the current fps
 * @param {String} 
 * @param {Number} 
 * @returns
 */
CanvasManager.prototype.getFps = function() {
	return this._timer.fps;
};

/**
 * Request a drawing loop with the desired update rate.
 * @param {Number} updateRate The target frame rate.
 */
CanvasManager.prototype.startDrawingLoop = function(updateRate) {
	var rate = updateRate;
	if (rate < 0.0) rate = 0.0;
	if (rate > 1000.0) rate = 1000.0;
	if (this._timer.target == rate) return;
	
	this._timer.target = updateRate;
	
	if (this._timerID != null) {
		clearInterval(this._timerID);
		this._timerID = null;
	}
	
	if (this._timer.target > 0.0) {
		var ms = 1000.0 / this._timer.target;
		if (ms < 1.0) ms = 1.0;
		var manager = this;
		
		this._timer.start();
		
		this._timerID = setInterval(function() { manager.update(); }, ms);
	}
};

/**
 * Request to stop the active drawing loop.
 */
CanvasManager.prototype.stopDrawingLoop = function() {
	this._timer.clear();
	if (this._timerID != null) {
		clearInterval(this._timerID);
		this._timerID = null;
	}	
};

/**
 * Request a draw.
 */
CanvasManager.prototype.requestDraw = function() {
	if (!this.drawAwaiting) {
		this.drawAwaiting = true;
		setTimeout(this.drawFunc, 0);
	}
};

/**
 * Request the handler's load function, if any.
 */
CanvasManager.prototype.load = function() {
	if (this._handler.load) {
		this._handler.load();
	}
	this.requestDraw();
};

/**
 * Updates the drawing state by the frame elapsed time.
 */
CanvasManager.prototype.update = function() {
	this._timer.stop();

	var draw = false;
	if (this._handler.update) {
		draw = this._handler.update(this._timer.elapsedTime);
	}
	
	if (draw)
		this.requestDraw();
};

/**
 * Calls the handler's drawing function, if any.
 */
CanvasManager.prototype.draw = function() {
	if (this._handler.draw)
		this._handler.draw();
		
	this.gl.flush();
	
	this.drawAwaiting = false;
};

/**
 * Callback function to handle keyboard presses.
 * @param e The event to process.
 */
CanvasManager.prototype.keydown = function(e) {
	this._ui.keysDown[e.keyCode] = true;
	var key = String.fromCharCode(e.keyCode);
	if (this._handler.keydown) {
		if (this._handler.keydown(e) != false)
			this.requestDraw();
	}
};

/**
 * Callback function to handle keyboard depresses.
 * @param e The event to process.
 */
CanvasManager.prototype.keyup = function(e) {
	this._ui.keysDown[e.keyCode] = false;
	var key = String.fromCharCode(e.keyCode);
	if (this._handler.keyup) {
		if (this._handler.keyup(e) != false)
			this.requestDraw();
	}
};

/**
 * Callback function to handle mouse presses.
 * @param e The event to process.
 */
CanvasManager.prototype.mousedown = function(e) {
	this._ui.mouseButtonsDown[e.button] = true;
	var x = e.clientX;
	var y = this._ui.height - e.clientY - 1;
	this._ui.mousePos['x'] = x;
	this._ui.mousePos['y'] = y;
	this._ui.mouseLastPos['x'] = x;
	this._ui.mouseLastPos['y'] = y;
	this._ui.mouseDelta['x'] = 0.0;
	this._ui.mouseDelta['y'] = 0.0;
	if (this._handler.mousedown) {
		if (this._handler.mousedown(e, x, y) != false)
			this.requestDraw();
	}	
};

/**
 * Callback function to handle mouse depresses.
 * @param e The event to process.
 */
CanvasManager.prototype.mouseup = function(e) {
	this._ui.mouseButtonsDown[e.button] = false;
	var x = e.clientX;
	var y = this._ui.height - e.clientY - 1;
	this._ui.mousePos['x'] = x;
	this._ui.mousePos['y'] = y;
	this._ui.mouseLastPos['x'] = x;
	this._ui.mouseLastPos['y'] = y;
	this._ui.mouseDelta['x'] = 0.0;
	this._ui.mouseDelta['y'] = 0.0;
	if (this._handler.mousedown) {
		if (this._handler.mouseup(e, x, y) != false)
			this.requestDraw();
	}	
};

/**
 * Callback function to handle mouse movements.
 * @param e The event to process.
 */
CanvasManager.prototype.mousemove = function(e) {
	var x = e.clientX;
	var y = this._ui.height - e.clientY - 1;
	this._ui.mouseLastPos['x'] = this._ui.mousePos['x'];
	this._ui.mouseLastPos['y'] = this._ui.mousePos['y'];
	this._ui.mousePos['x'] = x;
	this._ui.mousePos['y'] = y;
	this._ui.mouseDelta['x'] = this._ui.mousePos['x'] - this._ui.mouseLastPos['x'];
	this._ui.mouseDelta['y'] = this._ui.mousePos['y'] - this._ui.mouseLastPos['y'];			
	if (this._handler.mousemove) {
		var dx = this._ui.mouseDelta['x'];
		var dy = this._ui.mouseDelta['y'];
		if (this._handler.mousemove(dx, dy) != false)
			this.requestDraw();
	}		
};

CanvasManager.prototype.mousewheel = function(e) {
	var x = e.clientX;
	var y = this._ui.height - e.clientY - 1;
	this._ui.mouseLastPos['x'] = this._ui.mousePos['x'];
	this._ui.mouseLastPos['y'] = this._ui.mousePos['y'];
	this._ui.mousePos['x'] = x;
	this._ui.mousePos['y'] = y;
	this._ui.mouseDelta['x'] = 0;
	this._ui.mouseDelta['y'] = 0;		
	if (this._handler.mousewheel) {
		var dx = this._ui.mouseDelta['x'];
		var dy = this._ui.mouseDelta['y'];
		var delta = 0;
		if (!e) /* For IE. */ {
			e = window.event;
		}
		if (e.wheelDelta) /* IE/Opera. */ {
			delta = e.wheelDelta / 120;
			/* In Opera 9, delta differs in sign as compared to IE.
			 */
			if (window.opera) {
				delta = -delta;
			}
		}
		else if (e.detail) /** Mozilla case. */ {
			/** In Mozilla, sign of delta is different than in IE.
			 * Also, delta is multiple of 3.
			 */
			delta = -e.detail / 3;
		}
		/* If delta is nonzero, handle it.
		 * Basically, delta is now positive if wheel was scrolled up,
		 * and negative, if wheel was scrolled down.
		 */
		if (delta) {
			if (this._handler.mousewheel(delta, dx, dy) != false)
				this.requestDraw();
		}
	}		
};
