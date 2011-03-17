//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

function WebGL(canvas, options) {
	// TODO: throw error to console if canvas not present
	
	var myCanvas = (canvas.width) ? canvas : document.getElementById(canvas);
	if (!myCanvas) return null;
	
	var gl = myCanvas.getContext("experimental-webgl", options);
	if (!gl) return null;
	
	this.gl = gl;
};

// TODO

