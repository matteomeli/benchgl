//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

/**
 * Includes an external javascript file.
 * @param {String} 
 * @param {Number} 
 * @returns
 */
function include(file) {
	var head = document.getElementsByTagName('head')[0];

	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', file);
	
	head.appendChild(script);
}

// Include all files needed to use the engine.
include('../../engine/src/utils.js');
include('../../engine/src/math.js');
include('../../engine/src/trans.js');
include('../../engine/src/skin.js');
include('../../engine/src/mesh.js');
include('../../engine/src/model.js');
include('../../engine/src/factory.js');
include('../../engine/src/request.js');
include('../../engine/src/worker.js');
include('../../engine/src/camera.js');
include('../../engine/src/shader.js');
include('../../engine/src/program.js');
include('../../engine/src/canvas.js');
include('../../engine/src/renderer.js');
include('../../engine/src/logger.js');
include('../../engine/src/timing.js');
include('../../engine/src/bench.js');
