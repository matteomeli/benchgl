// utils.js

function $(id) {
  return document.getElementById(id);
}

$.inherit = (function() {
	var F = function() {};
	return function(C, P) {
		F.prototype = P.prototype;
		C.prototype = new F();
		C.uber = P.prototype;
		C.prototype.constructor = C;
	}
}());

$.mix = function() {
  var i, object, key, mix = {};
  for (i = 0, l = arguments.length; i < l; i++) {
    object = arguments[i];
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        mix[key] = object[key];
      }
    }
  }
  return mix;
};

$.capitalize = function(text) {
  if (text && text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
};

$.empty = function() {};

/**
 * Provides requestAnimationFrame in a cross browser way.
 * Copyright 2010, Google Inc.
 * All rights reserved.
 * @ignore
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback, element) {
    window.setTimeout(callback, 1000 / 60);
  };
}());
