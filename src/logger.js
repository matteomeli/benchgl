// logger.js

(function() {

	var Logger = function() {
		this._messages = [];
	};
	
	Logger.prototype.log = function(message) {
		var message = new Date().getTime() + ': ' + message;
		this._messages.unshift(message);
		console.log(message);
	};
	
	Logger.prototype.dump = function(element) {
		var el = (typeof element == 'string') ? document.getElementById(element) : element;
		el.innerHTML = this._messages.join("/n");
		this._messages = [];
	};
	
	BenchGL.Logger = Logger;

})();
