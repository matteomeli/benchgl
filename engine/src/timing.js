//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

/**
 * Creates a new Timer.
 * @class Handles all the time issues (i.e. fps counting).
 */
function Timer() {
	this._fps = 0.0;
	this._targetFps = 0.0;
	this._maxSamples = 0;
	this._samples = [];
	
	this._nowTime = 0.0;
	this._lastTime = 0.0;
	this._elapsedTime = 0.0;
};

/**
 * Getters and setters.
 */
Timer.prototype = {
	get fps() { return this._fps; },
	get target() { return this._targetFps; },
	get lastStartTime() { return this._nowTime; },
	get lastStopTime() { return this._lastTime; },
	get elapsedTime() { return this._elapsedTime; },
	
	set target(value) { this._targetFps = this._maxSamples = value; }
};

/**
 * Starts this Timer.
 */
Timer.prototype.start = function() {
	this._nowTime = new Date().getTime();
	this._lastTime = this._nowTime;
	this._elapsedTime = 0.0;
};

/**
 * Stops this Timer, storing the interval time.
 */
Timer.prototype.stop = function() {
	var now = new Date().getTime();
	this._lastTime = this._nowTime;
	this._nowTime = now;
	this._elapsedTime = this._nowTime - this._lastTime;
	
	var fps = 1000.0 / this._elapsedTime;
	if (this._samples.unshift(fps) > this._maxSamples)
		this._samples.pop();
		
	var fps = 0;
	for (var i=0; i<this._samples.length; i++) {
		fps += this._samples[i];
	}
	fps /= this._samples.length;
	
	this._fps = Math.round(fps);
};

/**
 * Clears this Timer.
 */
Timer.prototype.clear = function() {
	this._nowTime = 0.0;
	this._lastTime = 0.0;
	this._elapsedTime = 0.0;
	this._fps = 0.0;
	this._recents = [];
};
