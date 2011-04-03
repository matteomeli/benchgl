//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {
	
	var Canvas = function(canvas, options) {
		options = $.mix({
			onKeyDown : $.empty,
			onKeyUp 	: $.empty,
			onMouseDown : $.empty,
			onMouseUp		: $.empty,
			onMouseMove : $.empty,
			onMouseWheel	: $.empty,
			onMouseOut    : $.empty
		}, options || {});
		
		this.canvas = canvas;
		this.events = options;
		this.keysDown = {};
		this.mouseDown = {};
		this.mousePosition = { x: 0.0, y: 0.0 };
		this.mouseLastPosition = { x: 0.0, y: 0.0 };
		this.mouseDelta = { x: 0.0, y: 0.0 };
		
		myself = this;
		canvas.addEventListener("keydown", function(e) { myself.onKeyDown(e); }, false);
		canvas.addEventListener("keyup", function(e) { myself.onKeyUp(e); }, false);
		canvas.addEventListener("mousedown", function(e) { myself.onMouseDown(e); }, false);
		canvas.addEventListener("mouseup", function(e) { myself.onMouseUp(e); }, false);
		canvas.addEventListener("mousemove", function(e) { myself.onMouseMove(e); }, false);
		canvas.addEventListener("mousewheel", function(e) { myself.onMouseWheel(e); }, false);
		canvas.addEventListener("DOMMouseScroll", function(e) { myself.onMouseWheel(e); }, false);
		canvas.addEventListener("mouseout", function(e) { myself.onMouseOut(e); }, false);
	};
	
	Canvas.prototype.onKeyDown = function(e) {
		this.keysDown[e.keyCode] = true;
		this.events.onKeyDown(e);
	};
	
	Canvas.prototype.onKeyUp = function(e) {
		this.keysDown[e.keyCode] = false;
		this.events.onKeyUp(e);
	};
	
	Canvas.prototype.onMouseDown = function(e) {
		var x = e.clientX,
				y = this.height - e.clientY - 1;
				
		this.mousePosition.x = x;
		this.mousePosition.y = y;
		this.mouseLastPosition.x = x;
		this.mouseLastPosition.y = y;
		this.mouseDelta.x = 0.0;
		this.mouseDelta.y = 0.0;
		this.mouseDown[e.button] = true;
		
		this.events.onMouseDown(e, x, y);
	};
	
	Canvas.prototype.onMouseUp = function(e) {
		var x = e.clientX,
				y = this.height - e.clientY - 1;
				
		this.mousePosition.x = x;
		this.mousePosition.y = y;
		this.mouseLastPosition.x = x;
		this.mouseLastPosition.y = y;
		this.mouseDelta.x = 0.0;
		this.mouseDelta.y = 0.0;
		this.mouseDown[e.button] = false;
		
		this.events.onMouseUp(e, x, y);
	};
	
	Canvas.prototype.onMouseMove = function(e) {
		var x = e.clientX,
				y = this.height - e.clientY - 1;
				
		this.mouseLastPosition.x = this.mousePosition.x;
		this.mouseLastPosition.y = this.mousePosition.y;
		this.mousePosition.x = x;
		this.mousePosition.y = y;
		this.mouseDelta.x = this.mousePosition.x - this.mouseLastPosition.x;
		this.mouseDelta.y = this.mousePosition.y - this.mouseLastPosition.y;
	
		this.events.onMouseMove(e, this.mouseDelta.x, this.mouseDelta.y);
	};
	
	Canvas.prototype.onMouseWheel = function(e) {
		var x = e.clientX,
				y = this.height - e.clientY - 1,
				delta = 0;
				
		this.mouseLastPosition.x = this.mousePosition.x;
		this.mouseLastPosition.y = this.mousePosition.y;
		this.mousePosition.x = x;
		this.mousePosition.y = y;
		this.mouseDelta.x = 0;
		this.mouseDelta.y = 0;
			
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
		if (delta)
			this.events.onMouseWheel(e, delta);
	};
	
	Canvas.prototype.onMouseOut = function(e) {
		// TODO
		this.events.onMouseOut(e);
	};
	
	BenchGL.Canvas = Canvas;
	
})();
