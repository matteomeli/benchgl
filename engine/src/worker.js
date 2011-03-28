//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

function WorkerGroup(filename, n) {
	this.workers = [];
	this.intermediates = [];
	while (n--) {
		this.workers.push(new Worker(filename));
	}
};

WorkerGroup.prototype.map = function(mapper) {
	for(var i=0; i<this.workers.length; i++) {
		this.intermediates.push(mapper(i));
	}
};

WorkerGroup.prototype.reduce = function(reducer, callback, base) {
	var total = base,
			l = this.workers.length,
			message = function(e) {
				l--;
				if (total === "undefined") {
					total = e.data;
				} else {
					reducer(total, e.data);
				}
				if (l==0) {
					callback(total);
				}
			};
	
	for (var i=0; i<this.workers.length; i++) {
		var w = this.workers[i];
		w.onmessage = message;
		w.postMessage(this.intermediates[i]);
	}
};
