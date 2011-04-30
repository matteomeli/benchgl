// benchgl.js
// Contains the global variable representing the framework and some utilities.

// Unique global variable repesenting the framework
this.BenchGL = this.BenchGL || {};

// Special function to create namespaces
BenchGL.namespace = function(name) {
	var parts = name.split('.'),
			parent = BenchGL;
			
	if (parts[0] === 'BenchGL') {
		parts = parts.slice(1);
	}
	
	for (var i = 0; i < parts.length; i++) {
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	
	return parent;
};

// Special function to globalize BenchGL library
BenchGL.globalize = function() {
	for (var module in BenchGL) {
		for (var object in BenchGL[module]) {
			window[object] = BenchGL[module][object];
		}
	}
};
