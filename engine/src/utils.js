//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


/**
 * Gets a WebGL context.
 * @param {String} canvasID The id of a canvas element.
 */
function getWebGLContext(canvasID) {
	var canvas = document.getElementById(canvasID);
	if (!canvas) return null;
	
	var gl = canvas.getContext("experimental-webgl");
	if (!gl) return null;
	
	return gl;
};

function getHTMLScript(nodeId) {
  var script = document.getElementById(nodeId);

  if (!script) {
    return null;
  }

  var ret = "";
  var c = script.firstChild;
  while (c) {
    if (c.nodeType == 3) {
      ret += c.textContent;
    }
    c = c.nextSibling;
  }
	
	return ret;	
}
