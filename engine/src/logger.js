//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


var Logger = (function() {
	var instance = null;
	
	function Log() {
		this._messages = [];
	};
	
	Log.prototype.log = function(message) {
		var message = new Date().getTime() + ': ' + message;
		this._messages.unshift(message);
		console.log(message);
	};
	
	Log.prototype.dump = function(element) {
		var el = (typeof element == 'string') ? document.getElementById(element) : element;
		el.innerHTML = this._messages.join("/n");
		this._messages = [];
	};
	
	return new function() {
		this.getInstance = function() {
			if (instance == null) {
				instance = new Log();
				instance.constructor = null;
			}
			return instance;
		}
	}
})();

/**
 * Creates a new Logger.
 * @class Logs the framework activity.
 * @param {String} logID The id of an HTML element to write to.
 */
function Logger(logID) {
	var board = document.getElementById(logID);
	this._board = board;
	this._active = (this._board) ? true : false;
};

/**
 * Getters.
 */
Logger.prototype = {
	get board() { return this._board; },
	get isActive() { return this._active; },
};

/**
 * Log a message if logging is active.
 * @param message The message to log.
 */
Logger.prototype.log = function(message) {
	if (!this._active) return;
	var time = (new Date()).getTime();
	this._board.innerHTML = time + ": " + message + "<br>" + this._board.innerHTML;
};