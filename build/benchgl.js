// bench.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

this.BenchGL = null;

(function(){
	
	BenchGL = function(canvasId, options) {
		options = $.mix({
			context : {},
			program : {
				type 	: 'defaults'			// Defaults, Scripts, Sources, Urls
			},
			camera 	: {
				fovy 	: 45,
				near 	: 0.1,
				far	 	: 100
			},
			effects : {
			},
			events  : {},
			debug 	: false,
			onError : $.empty,
			onLoad : $.empty
		}, options || {});
		
		var gl, canvas, program, camera, renderer, handler;
		
		gl = new BenchGL.WebGL(canvasId, options.context).getContext();
		
		if (!gl) {
			options.onError();
			return null;
		}
		
		//if (options.debug) {
		//	gl.setTracing(true);
		//}
		
		canvas = new BenchGL.Canvas(gl.canvas, options.events);
	
		camera = new BenchGL.Camera($.mix(options.camera, { 
			aspect : gl.canvas.width / gl.canvas.height
		}));
		camera.update();
		
		/*program = BenchGL.Program.factory(gl, $.mix({
			onSuccess : function(program) {
				loadApplication(gl, program, function(application) {
					options.onLoad(application);
				});
			},
			onError : function(e) {
				options.onError(e);
			}
		}, options.program));*/

		program = BenchGL.Program.factory(gl, options.program);
		
		if (program) {
			loadApplication(gl, program, function(application) {
				options.onLoad(application)
			});
		}
		
		function loadApplication(gl, program, callback) {
			program.bind();
			
			renderer = new BenchGL.Renderer(gl, program, camera, options.effects);
			
			handler = {
				gl : gl,
				canvas : canvas,
				program : program,
				camera : camera,
				renderer : renderer
			};
			
			callback(handler);			
		};
	};

})();

// helper functions
function $(id) {
	return document.getElementById(id);
}

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
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, 
         					/* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

// webgl.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var WebGL = function(canvas, options) {
		var canvas = typeof canvas === "string" ? $(canvas) : canvas,
				gl = canvas.getContext('experimental-webgl', options);
		
		if (!gl) {
			gl = canvas.getContext('webgl', options);
		}
		
		this.context = gl;
		this.canvas = canvas;
	};
	
	WebGL.prototype.getContext = function() {
		return this.context;
	};
	
	WebGL.prototype.getCanvas = function() {
		return this.canvas;
	};
	
	BenchGL.WebGL = WebGL;

})();

// math.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function(){

	var sin = Math.sin,
			cos = Math.cos
			sqrt = Math.sqrt,
			acos = Math.acos,
			tan = Math.tan,
			pi = Math.PI;
	
	var Vector3 = function(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	};
	
	Vector3.prototype.copy = function() {
		return new Vector3(this.x, this.y, this.z);
	};
	
	Vector3.prototype.set = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	};
	
	Vector3.prototype.norm = function() {
		var x = this.x, y = this.y, z = this.z;
		return sqrt(x * x + y * y + z * z);
	};
	
	Vector3.prototype.normSqr = function() {
		var x = this.x, y = this.y, z = this.z;
		return (x * x + y * y + z * z);	
	};
	
	Vector3.prototype.negate = function() {
		return new Vector3(-this.x, -this.y, -this.z);	
	};

	Vector3.prototype.$negate = function() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	};
	
	Vector3.prototype.unit = function() {
		var x = this.x, y = this.y, z = this.z,
				d = sqrt(x * x + y * y + z * z);
		if (d > 0) {
			return new Vector3(x / d, y / d, z / d);
		}
		return this.copy();		
	};
	
	Vector3.prototype.$unit = function() {
		var x = this.x, y = this.y, z = this.z,
				d = sqrt(x * x + y * y + z * z);
		if (d > 0) {
			this.$scale(1 / d);
		}
		return this;
	};
	
	Vector3.prototype.add = function(vector) {
		var x = this.x + vector.x,
				y = this.y + vector.y,
				z = this.z + vector.z;
		return new Vector3(x, y, z); 	
	};
	
	Vector3.prototype.$add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		return this;
	};
	
	Vector3.prototype.sub = function(vector) {
		var x = this.x - vector.x,
				y = this.y - vector.y,
				z = this.z - vector.z;
		return new Vector3(x, y, z); 		
	};
	
	Vector3.prototype.$sub = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;
		return this;		
	};
	
	Vector3.prototype.scale = function(f) {
		var x = this.x * f,
				y = this.y * f,
				z = this.z * f;
		return new Vector3(x, y, z); 			
	};
	
	Vector3.prototype.$scale = function(f) {
		this.x *= f;
		this.y *= f;
		this.z *= f;
		return this;			
	};
	
	Vector3.prototype.angleWith = function(vector) {
		var dot = this.dot(vector),
				normThis = this.norm(),
				normThat = vector.norm();
		return acos(dot / (normThis * normThat));
	};
	
	Vector3.prototype.distTo = function(vector) {
		var x = this.x - vector.x,
				y = this.y - vector.y,
				z = this.z - vector.z;
		return sqrt(x * x + y * y + z * z);		
	};
	
	Vector3.prototype.distToSqr = function(vector) {
		var x = this.x - vector.x,
				y = this.y - vector.y,
				z = this.z - vector.z;
		return (x * x + y * y + z * z);		
	};
	
	Vector3.prototype.dot = function(vector) {
		return (this.x * vector.x + this.y * vector.y + this.z * vector.z);
	};
	
	Vector3.prototype.cross = function(vector) {
		var x = this.x, y = this.y, z = this.z,
				vx = vector.x, vy = vector.y, vz = vector.z;
		return new Vector3(y * vz - z * vy, x * vz - z * vx, x * vy - y * vx);
	};
	
	Vector3.prototype.toFloat32Array = function() {
		return new Float32Array([this.x, this.y, this.z]);
	};
	
	
	var Matrix4 = function(m11, m12, m13, m14,
										 m21, m22, m23, m24,
										 m31, m32, m33, m34,
										 m41, m42, m43, m44) {
		if (typeof m11 !== "undefined") {
			this.set(m11, m12, m13, m14,
							 m21, m22, m23, m24,
							 m31, m32, m33, m34,
							 m41, m42, m43, m44);
		} else {
			this.identity();
		};
	};
	
	Matrix4.prototype.identity = function() {
		this.m11 = this.m22 = this.m33 = this.m44 = 1,
		this.m12 = this.m13 = this.m14 = 0,
		this.m21 = this.m23 = this.m24 = 0,
		this.m31 = this.m32 = this.m34 = 0,
		this.m41 = this.m42 = this.m43 = 0;
		return this;
	};
	
	Matrix4.prototype.set = function(m11, m12, m13, m14,
																	 m21, m22, m23, m24,
																	 m31, m32, m33, m34,
																	 m41, m42, m43, m44) {
		this.m11 = m11;
		this.m12 = m12;
		this.m13 = m13;
		this.m14 = m14;
		this.m21 = m21;
		this.m22 = m22;
		this.m23 = m23;
		this.m24 = m24;
		this.m31 = m31;
		this.m32 = m32;
		this.m33 = m33;
		this.m34 = m34;
		this.m41 = m41;
		this.m42 = m42;
		this.m43 = m43;
		this.m44 = m44;
		return this;
	};
	
	Matrix4.prototype.copy = function() {
		var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14,
				m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24,
				m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34,
				m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44;
				
		return new Matrix4(m11, m12, m13, m14,
					 					 	 m21, m22, m23, m24,
					 					 	 m31, m32, m33, m34,
					 					 	 m41, m42, m43, m44);
	};
	
	Matrix4.prototype.add = function(m) {
		var r = new Matrix4();
		
		r.m11 = this.m11 + m.m11;
		r.m12 = this.m12 + m.m12;
		r.m13 = this.m13 + m.m13;
		r.m14 = this.m14 + m.m14;
		r.m21 = this.m21 + m.m21;
		r.m22 = this.m22 + m.m22;
		r.m23 = this.m23 + m.m23;
		r.m24 = this.m24 + m.m24;
		r.m31 = this.m31 + m.m31;
		r.m32 = this.m32 + m.m32;
		r.m33 = this.m33 + m.m33;
		r.m34 = this.m34 + m.m34;
		r.m41 = this.m41 + m.m41;
		r.m42 = this.m42 + m.m42;
		r.m43 = this.m43 + m.m43;
		r.m44 = this.m44 + m.m44;		
		
		return r;
	};
	
	Matrix4.prototype.$add = function(m) {
		this.m11 += m.m11;
		this.m12 += m.m12;
		this.m13 += m.m13;
		this.m14 += m.m14;
		this.m21 += m.m21;
		this.m22 += m.m22;
		this.m23 += m.m23;
		this.m24 += m.m24;
		this.m31 += m.m31;
		this.m32 += m.m32;
		this.m33 += m.m33;
		this.m34 += m.m34;
		this.m41 += m.m41;
		this.m42 += m.m42;
		this.m43 += m.m43;
		this.m44 += m.m44;		
		return this;
	};
	
	Matrix4.prototype.sub = function() {
		var r = new Matrix4();
		
		r.m11 = this.m11 - m.m11;
		r.m12 = this.m12 - m.m12;
		r.m13 = this.m13 - m.m13;
		r.m14 = this.m14 - m.m14;
		r.m21 = this.m21 - m.m21;
		r.m22 = this.m22 - m.m22;
		r.m23 = this.m23 - m.m23;
		r.m24 = this.m24 - m.m24;
		r.m31 = this.m31 - m.m31;
		r.m32 = this.m32 - m.m32;
		r.m33 = this.m33 - m.m33;
		r.m34 = this.m34 - m.m34;
		r.m41 = this.m41 - m.m41;
		r.m42 = this.m42 - m.m42;
		r.m43 = this.m43 - m.m43;
		r.m44 = this.m44 - m.m44;		
		
		return r;	
	};

	Matrix4.prototype.$sub = function() {
		this.m11 -= m.m11;
		this.m12 -= m.m12;
		this.m13 -= m.m13;
		this.m14 -= m.m14;
		this.m21 -= m.m21;
		this.m22 -= m.m22;
		this.m23 -= m.m23;
		this.m24 -= m.m24;
		this.m31 -= m.m31;
		this.m32 -= m.m32;
		this.m33 -= m.m33;
		this.m34 -= m.m34;
		this.m41 -= m.m41;
		this.m42 -= m.m42;
		this.m43 -= m.m43;
		this.m44 -= m.m44;		
		return this;	
	};
	
	Matrix4.prototype.multiplyVec3 = function(vector) {
		var vx = vector.x,
				vy = vector.y,
				vz = vector.z;
				
		return new Vector3(this.m11 * vx + this.m12 * vy + this.m13 * vz + this.m14,
											 this.m21 * vx + this.m22 * vy + this.m23 * vz + this.m24,
											 this.m31 * vx + this.m32 * vy + this.m33 * vz + this.m34);
	};
	
	Matrix4.prototype.multiplyMat4 = function(m) {
		var a11 = this.m11, a12 = this.m12, a13 = this.m13, a14 = this.m14,
				a21 = this.m21, a22 = this.m22, a23 = this.m23, a24 = this.m24,
				a31 = this.m31, a32 = this.m32, a33 = this.m33, a34 = this.m34,
				a41 = this.m41, a42 = this.m42, a43 = this.m43, a44 = this.m44,
				b11 = m.m11, b12 = m.m12, b13 = m.m13, b14 = m.m14,
				b21 = m.m21, b22 = m.m22, b23 = m.m23, b24 = m.m24,
				b31 = m.m31, b32 = m.m32, b33 = m.m33, b34 = m.m34,
				b41 = m.m41, b42 = m.m42, b43 = m.m43, b44 = m.m44,
				m11, m12, m13, m14,
				m21, m22, m23, m24,
				m31, m32, m33, m34,
				m41, m42, m43, m44;
		
		m11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		m12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		m13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		m14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		
		m21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		m22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		m23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		m24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		m31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		m32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		m33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		m34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		m41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		m42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		m43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		m44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		
		return new Matrix4(m11, m12, m13, m14,
											 m21, m22, m23, m24,
											 m31, m32, m33, m34,
											 m41, m42, m43, m44);	
	};
	
	Matrix4.prototype.$multiplyMat4 = function(m) {
		var a11 = this.m11, a12 = this.m12, a13 = this.m13, a14 = this.m14,
				a21 = this.m21, a22 = this.m22, a23 = this.m23, a24 = this.m24,
				a31 = this.m31, a32 = this.m32, a33 = this.m33, a34 = this.m34,
				a41 = this.m41, a42 = this.m42, a43 = this.m43, a44 = this.m44,
				b11 = m.m11, b12 = m.m12, b13 = m.m13, b14 = m.m14,
				b21 = m.m21, b22 = m.m22, b23 = m.m23, b24 = m.m24,
				b31 = m.m31, b32 = m.m32, b33 = m.m33, b34 = m.m34,
				b41 = m.m41, b42 = m.m42, b43 = m.m43, b44 = m.m44,
				m11, m12, m13, m14,
				m21, m22, m23, m24,
				m31, m32, m33, m34,
				m41, m42, m43, m44;
		
		m11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		m12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		m13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		m14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		
		m21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		m22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		m23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		m24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		m31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		m32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		m33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		m34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		m41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		m42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		m43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		m44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		
		this.set(m11, m12, m13, m14,
						 m21, m22, m23, m24,
						 m31, m32, m33, m34,
						 m41, m42, m43, m44);	
		
		return this;
	};

	Matrix4.prototype.transpose = function() {
		var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14,
				m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24,
				m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34,
				m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44;
		
		return new Matrix4(m11, m21, m31, m41,
											 m12, m22, m32, m42,
											 m13, m23, m33, m43,
											 m14, m24, m34, m44);
	};
	
	Matrix4.prototype.$transpose = function() {
		var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14,
				m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24,
				m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34,
				m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44;
		
		this.set(m11, m21, m31, m41,
						 m12, m22, m32, m42,
						 m13, m23, m33, m43,
						 m14, m24, m34, m44);
		
		return this;
	};
	
	Matrix4.prototype.invert = function() {
		var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14,
				m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24,
				m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34,
				m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44;
		
		var s0 = m11*m22 - m12*m21,
				s1 = m11*m23 - m13*m21,
				s2 = m11*m24 - m14*m21,
				s3 = m12*m23 - m13*m22,
				s4 = m12*m24 - m14*m22,
				s5 = m13*m24 - m14*m23,
				c0 = m31*m42 - m32*m41,
				c1 = m31*m43 - m33*m41,
				c2 = m31*m44 - m34*m41,
				c3 = m32*m43 - m33*m42,
				c4 = m32*m44 - m34*m42,
				c5 = m33*m44 - m34*m43;
				
		det = s0*c5 - s1*c4 + s2*c3 + s3*c2 - s4*c1 + s5*c0;
				
		var a11 =  m22*c5 - m23*c4 + m24*c3,
				a12 = -m12*c5 + m13*c4 - m14*c3,
				a13 =  m42*s5 - m43*s4 + m44*s3,
				a14 = -m32*s5 + m33*s4 - m34*s3,
				a21 = -m21*c5 + m23*c2 - m24*c1,
				a22 =  m11*c5 - m13*c2 + m14*c1,
				a23 = -m41*s5 + m43*s2 - m44*s1,
				a24 =  m31*s5 - m33*s2 + m34*s1,
				a31 =  m21*c4 - m22*c2 + m24*c0,
				a32 = -m11*c4 + m12*c2 - m14*c0,
				a33 =  m41*s4 - m42*s2 + m44*s0,
				a34 = -m31*s4 + m32*s2 - m34*s0,
				a41 = -m21*c3 + m22*c1 - m23*c0,
				a42 =  m11*c3 - m12*c1 + m13*c0,
				a43 = -m41*s3 + m42*s1 - m43*s0,
				a44 =  m31*s3 - m32*s1 + m33*s0; 
		
		return new Matrix4(a11/det, a12/det, a13/det, a14/det,
											 a21/det, a22/det, a23/det, a24/det,
											 a31/det, a32/det, a33/det, a34/det,
											 a41/det, a42/det, a43/det, a44/det);
	};
	
	Matrix4.prototype.$invert = function() {
		var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14,
				m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24,
				m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34,
				m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44;

		var s0 = m11*m22 - m12*m21,
				s1 = m11*m23 - m13*m21,
				s2 = m11*m24 - m14*m21,
				s3 = m12*m23 - m13*m22,
				s4 = m12*m24 - m14*m22,
				s5 = m13*m24 - m14*m23,
				c0 = m31*m42 - m32*m41,
				c1 = m31*m43 - m33*m41,
				c2 = m31*m44 - m34*m41,
				c3 = m32*m43 - m33*m42,
				c4 = m32*m44 - m34*m42,
				c5 = m33*m44 - m34*m43;
				
		det = s0*c5 - s1*c4 + s2*c3 + s3*c2 - s4*c1 + s5*c0;
				
		var a11 =  m22*c5 - m23*c4 + m24*c3,
				a12 = -m12*c5 + m13*c4 - m14*c3,
				a13 =  m42*s5 - m43*s4 + m44*s3,
				a14 = -m32*s5 + m33*s4 - m34*s3,
				a21 = -m21*c5 + m23*c2 - m24*c1,
				a22 =  m11*c5 - m13*c2 + m14*c1,
				a23 = -m41*s5 + m43*s2 - m44*s1,
				a24 =  m31*s5 - m33*s2 + m34*s1,
				a31 =  m21*c4 - m22*c2 + m24*c0,
				a32 = -m11*c4 + m12*c2 - m14*c0,
				a33 =  m41*s4 - m42*s2 + m44*s0,
				a34 = -m31*s4 + m32*s2 - m34*s0,
				a41 = -m21*c3 + m22*c1 - m23*c0,
				a42 =  m11*c3 - m12*c1 + m13*c0,
				a43 = -m41*s3 + m42*s1 - m43*s0,
				a44 =  m31*s3 - m32*s1 + m33*s0; 
		
		this.set(a11/det, a12/det, a13/det, a14/det,
						 a21/det, a22/det, a23/det, a24/det,
						 a31/det, a32/det, a33/det, a34/det,
						 a41/det, a42/det, a43/det, a44/det);
		
		return this;
	};
	
	Matrix4.prototype.toFloat32Array = function() {
		return new Float32Array([this.m11, this.m21, this.m31, this.m41,
														 this.m12, this.m22, this.m32, this.m42,
														 this.m13, this.m23, this.m33, this.m43,
														 this.m14, this.m24, this.m34, this.m44]);
	};
	
	Matrix4.Translate = function(x, y, z) {
		return new Matrix4(1, 0, 0, x,
											 0, 1, 0, y,
											 0, 0, 1, z,
											 0, 0, 0, 1);
	};
	
	Matrix4.Scale = function(x, y, z) {
		return new Matrix4(x, 0, 0, 0,
											 0, y, 0, 0,
											 0, 0, z, 0,
											 0, 0, 0, 1);	
	};
	
	Matrix4.Rotate = function(angle, x, y, z) {
		var axis = new Vector3(x, y, z).$unit(),
				x = axis.x, y = axis.y, z = axis.z,
				s = sin(angle), c = cos(angle), t = 1 - c;
		return new Matrix4(t*x*x + c,   t*x*y - z*s, t*x*z + y*s, 0,
											 t*x*y + z*s, t*y*y + c, 	 t*y*z - x*s, 0,
											 t*x*z - y*s, t*y*z + x*s, t*z*z + c, 	0,
											 0,						0, 					 0, 					1);		
	};

	Matrix4.RotateXYZ = function(rx, ry, rz) {
		var sx = sin(rx), cx = cos(rx),
				sy = sin(ry), cy = cos(ry),
				sz = sin(rz), cz = cos(rz);
		
		return new Matrix4(cy*cz, -cx*sz+sx*sy*cz, sx*sz+cx*sy*cz, 	0,
											 cy*sz, cx*cz+sx*sy*sz,  -sx*cz+cx*sy*sz, 0,
											 -sy,		sx*cy,					 cx*cy,						0,
											 0,			0,							 0,								1);		
	};
	
	Matrix4.LookAt = function(eye, direction, up) {
		var x, y, z;
				
		z = eye.sub(direction);
		z.$unit();
		x = up.cross(z);
		x.$unit();
		y = z.cross(x);
		y.$unit();
		
		return new Matrix4(x.x, x.y, x.z, -x.dot(eye),
											 y.x, y.y, y.z, -y.dot(eye),
											 z.x, z.y, z.z, -z.dot(eye),
											 0.0, 0.0, 0.0, 1.0);
	};
	
	Matrix4.Frustum = function(left, right, bottom, top, near, far) {
		var x = 2.0 * near / (right - left),
				y = 2.0 * near / (top - bottom);
				a = (right + left) / (right - left);
				b = (top + bottom) / (top - bottom);
				c = -(far + near) / (far - near);
				d = -2.0 * far * near / (far - near);
		
		return new Matrix4(  x, 0.0,    a, 0.0,
											 0.0,   y,    b, 0.0,
											 0.0, 0.0,    c,   d,
											 0.0, 0.0, -1.0, 0.0);	
	};
	
	Matrix4.Perspective = function(fovy, aspect, near, far) {
		var ymax = near * tan(fovy * pi / 360.0);
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;
	
		return Matrix4.Frustum(xmin, xmax, ymin, ymax, near, far);	
	};
	
	Matrix4.Ortho = function() {
		// TODO
	};
	
	var Quaternion = function(a, b, c, d) {
		if (typeof a !== "undefined") {
			this.m = a;
			this.b = b;
			this.c = c;
			this.d = d;
		} else {
			this.identity();
		} 
	};
	
	Quaternion.prototype.identity = function() {
		return new Quaternion(1, 0, 0, 0);
	};
	
	Quaternion.prototype.multiply = function(quat) {
		var ta = this.m, tb = this.b, tc = this.c, td = this.d,
				qa = quat.a, qb = quat.b, qc = quat.c, qd = quat.d,
				a, b, c, d;
				
		a = ta*qa - tb*qb - tc*qc - td*qd;
		b = ta*wb + tb*qa + tc*qd - td*qc;
		c = ta*wc + tc*qa + td*qb - tb*qd;
		d = ta*wd + td*qa + tb*qc - tc*qb;
		
		return new Quaternion(a, b, c, d);
	};
	
	Quaternion.prototype.$multiply = function(quat) {
		var ta = this.m, tb = this.b, tc = this.c, td = this.d,
				qa = quat.a, qb = quat.b, qc = quat.c, qd = quat.d,
				a, b, c, d;
				
		this.m = ta*qa - tb*qb - tc*qc - td*qd;
		this.b = ta*wb + tb*qa + tc*qd - td*qc;
		this.c = ta*wc + tc*qa + td*qb - tb*qd;
		this.d = ta*wd + td*qa + tb*qc - tc*qb;
		
		return this;	
	};
	
	Quaternion.prototype.toMatrix4 = function() {
		var a = this.m, b = this.b, c = this.c, d = this.d,
				b2 = b*b,
				c2 = c*c,
				d2 = d*d,
				bc = b*c,
				bd = b*d,
				cd = c*d,
				ab = a*b,
				ac = a*c,
				ad = a*d;
				
		return new Matrix4(1-2*c2-2*d2, 2*bc-2*ad, 	 2*ac+2*bd, 	0,
											 2*bc+2*ad, 	1-2*b2-2*d2, 2*cd-2*ab, 	0,
											 2*bd-2*ac, 	2*ab+2*cd, 	 1-2*b2-2*c2, 0,
											 0,						0,					 0,						1);	
	};
	
	Quaternion.FromEulerAngles = function(pitch, roll, yaw) {
		var p = pitch * 0.5,
				y = yaw * 0.5,
				r = roll * 0.5,
	  		cp = cos(p), sp = sin(p),
	  		cy = cos(y), sy = sin(y),
	  		cr = cos(r), sr = sin(r),
	  		a, b, c, d;
	  		
	  a = cp*cy*cr + sp*sy*sr;
	  b = sp*cy*cr - cp*sy*sr;
	  c = cp*sy*cr + sp*cy*sr;
	  d = cp*cy*sr - sp*sy*cr;
	  
	  return new Quaternion(a, b, c, d);
	};
	
	BenchGL.Vector3 = Vector3;
	BenchGL.Matrix4 = Matrix4;
	BenchGL.Quaternion = Quaternion;
	
})();

// trans.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function(){

	var Vec3 = BenchGL.Vector3,
			Mat4 = BenchGL.Matrix4,
			pi = Math.PI;
	
	var MatrixStack = function() {
		this.stack = [],
		this.current = 0;
		this.stack.push(new Mat4());
	};
	
	MatrixStack.prototype.top = function() {
		return this.stack[this.current];
	};
	
	MatrixStack.prototype.push = function() {
		this.stack.push(this.stack[this.current].copy());
		this.current++;
		return this;
	};
	
	MatrixStack.prototype.pop = function() {
		if (this.current > 0) {
			this.stack.pop();
			this.current--;
		}
		return this;
	};
	
	MatrixStack.prototype.load = function(matrix) {
		this.stack[this.current] = matrix;
		return this;
	};
	
	MatrixStack.prototype.loadIdentity = function() {
		this.stack[this.current] = new Mat4();
		return this;
	};
	
	MatrixStack.prototype.multiply = function(matrix) {
		this.stack[this.current].$multiplyMat4(matrix);
		return this;
	};
	
	MatrixStack.prototype.rotate = function(angle, x, y, z) {
		this.multiply(Mat4.Rotate(angle * pi / 180, x, y, z));
		return this;
	};
	
	MatrixStack.prototype.rotateXYZ = function(rx, ry, rz) {
		this.multiply(Mat4.RotateXYZ(rx, ry, rz));
		return this;
	};
	
	MatrixStack.prototype.scale = function(x, y, z) {
		this.multiply(Mat4.Scale(x, y, z));
		return this;
	};
	
	MatrixStack.prototype.translate = function(x, y, z) {
		this.multiply(Mat4.Translate(x, y, z));
		return this;
	};

	MatrixStack.prototype.lookAt = function(eye, direction, up) {
		this.multiply(Mat4.LookAt(eye, direction, up));
		return this;
	};
			
	MatrixStack.prototype.perspective = function(fovy, aspect, near, far) {
		this.multiply(Mat4.Perspective(fovy, aspect, near, far));
		return this;
	};
	
	MatrixStack.prototype.frustum = function(left, rigth, bottom, top, near, far) {
		this.multiply(Mat4.Frustum(left, rigth, bottom, top, near, far));
		return this;
	};
	
	var TransformStack = function() {
		this.modelStack = new MatrixStack();
		this.viewStack = new MatrixStack();
		this.projStack = new MatrixStack();
		this.currentStack = null;
	};
	
	TransformStack.prototype.getModelMatrix = function() {
		return this.modelStack.top();
	};
	
	TransformStack.prototype.getModelMatrixTranspose = function() {
		return this.modelStack.top().transpose();
	};
	
	TransformStack.prototype.getModelMatrixInverse = function() {
		return this.modelStack.top().invert();
	};
	
	TransformStack.prototype.getModelMatrixInverseTranspose = function() {
		return this.modelStack.top().invert().$transpose();
	};
	
	TransformStack.prototype.getViewMatrix = function() {
		return this.viewStack.top();
	};
	
	TransformStack.prototype.getViewMatrixTranspose = function() {
		return this.viewStack.top().transpose();
	};
	
	TransformStack.prototype.getViewMatrixInverse = function() {
		return this.viewStack.top().invert();
	};
	
	TransformStack.prototype.getViewMatrixInverseTranspose = function() {
		return this.viewStack.top().invert().$transpose();
	};
	
	TransformStack.prototype.getProjectionMatrix = function() {
		return this.projStack.top();
	};
	
	TransformStack.prototype.getProjectionMatrixTranspose = function() {
		return this.projStack.top().transpose();
	};
	
	TransformStack.prototype.getProjectionMatrixInverse = function() {
		return this.projStack.top().invert();
	};
	
	TransformStack.prototype.getProjectionMatrixInverseTranspose = function() {
		return this.projStack.top().inverse().$transpose();
	};
	
	TransformStack.prototype.getModelViewMatrix = function() {
		return this.viewStack.top().multiplyMat4(this.modelStack.top());
	};
	
	TransformStack.prototype.getModelViewMatrixTranspose = function() {
		return this.getModelViewMatrix().transpose();
	};
	
	TransformStack.prototype.getModelViewMatrixInverse = function() {
		return this.getModelViewMatrix().invert();
	};
	
	TransformStack.prototype.getModelViewMatrixInverseTranspose = function() {
		return this.getModelViewMatrix().invert().$transpose();
	};
	
	TransformStack.prototype.getNormalMatrix = function() {
		return this.getModelViewMatrixInverseTranspose();
	};
	
	TransformStack.prototype.projection = function() {
		this.currentStack = this.projStack;
		return this;
	};
	
	TransformStack.prototype.view = function() {
		this.currentStack = this.viewStack;
		return this;
	};
	
	TransformStack.prototype.model = function() {
		this.currentStack = this.modelStack;
		return this;
	};	

	TransformStack.prototype.loadIdentity = function() {
		this.currentStack.loadIdentity();
		return this;
	};
	
	TransformStack.prototype.multiply = function(matrix) {
		this.currentStack.multiply(matrix);
		return this;
	};

	TransformStack.prototype.perspective = function(fovy, aspect, near, far) {
		this.currentStack.perspective(fovy, aspect, near, far);
		return this;
	};

	TransformStack.prototype.lookAt = function(eye, direction, up) {
		this.currentStack.lookAt(eye, direction, up);
		return this;
	};

	TransformStack.prototype.pushMatrix = function() {
		this.currentStack.push();
		return this;
	};

	TransformStack.prototype.popMatrix = function() {
		this.currentStack.pop();
		return this;
	};

	TransformStack.prototype.rotate = function(angle, x, y, z) {
		this.currentStack.rotate(angle, x, y, z);
		return this;
	};
	
	TransformStack.prototype.rotateXYZ = function(rx, ry, rz) {
		this.currentStack.rotateXYZ(rx, ry, rz);
		return this;
	};

	TransformStack.prototype.translate = function(x, y, z) {
		this.currentStack.translate(x, y, z);
		return this;
	};

	TransformStack.prototype.scale = function(x, y, z) {
		this.currentStack.scale(x, y, z);
		return this;
	};
	
	BenchGL.MatrixStack = MatrixStack;
	BenchGL.TransformStack = TransformStack;
	
})();

// skin.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Vec3 = BenchGL.Vector3;

	var Color = function(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a || 1;
	};
	
	Color.prototype.toRGBArray = function() {
		return [this.r, this.g, this.b];
	};
	
	Color.prototype.toRGBAArray = function() {
		return [this.r, this.g, this.b, this.a];
	};
	
	Color.prototype.toRGBFloat32Array = function() {
		return new Float32Array([this.r, this.g, this.b]);
	};
	
	Color.prototype.toRGBAFloat32Array = function() {
		return new Float32Array([this.r, this.g, this.b, this.a]);
	};
	
	var Material = function(options) {
		options = $.mix({
			ambient : {
				r : 0.0, 
				g : 0.0, 
				b : 0.0
			},
			diffuse	: {
				r : 1.0,
				g : 1.0,
				b : 1.0
			},
			specular : {
				r : 1.0,
				g : 1.0,
				b : 1.0
			},
			emissive : {
				r : 1.0,
				g : 1.0,
				b : 1.0
			},
			shininess	: 0.1
		}, options || {});
		
		var ambient = options.ambient,
				diffuse = options.diffuse,
				specular = options.specular,
				emissive = options.emissive;
		
		this.ambient = new Color(ambient.r, ambient.g, ambient.b);
		this.diffuse = new Color(diffuse.r, diffuse.g, diffuse.b);
		this.specular = new Color(specular.r, specular.g, specular.b);
		this.emissive = new Color(emissive.r, emissive.g, emissive.b);
		this.shininess = options.shininess;
	};
	
	Material.prototype.setAmbient = function(r, g, b) {
		this.ambient = new Color(r, g, b);
	};
	
	Material.prototype.setDiffuse = function(r, g, b) {
		this.diffuse = new Color(r, g, b);
	};
	
	Material.prototype.setSpecular = function(r, g, b) {
		this.specular = new Color(r, g, b);
	};
	
	Material.prototype.setEmissive = function(r, g, b) {
		this.emissive = new Color(r, g, b);
	};
	
	Material.prototype.setShininess = function(shininess) {
		this.shininess = shininess;
	};
	
	var Light = function(options) {
		options = $.mix({
			position : {
				x : 0.0, 
				y : 0.0, 
				z : -1.0
			},
			ambient	: {
				r : 0.0, 
				g : 0.0, 
				b : 0.0
			},
			diffuse	: {
				r : 1.0,
				g : 1.0,
				b : 1.0
			},
			specular : {
				r : 1.0,
				g : 1.0,
				b : 1.0
			},
			direction	: {
				x : 0.0,
				y : 0.0,
				z : -1.0
			},
			cutoff		: 180.0,
			exponent	: 0.0,
			constant	: 1.0,
			linear		: 0.0,
			quadratic	: 0.0,
			active : true	
		}, options || {});
		
		var position = options.position,
				ambient = options.ambient,
				diffuse = options.diffuse,
				specular = options.specular,
				direction = options.direction;
		
		this.position = new Vec3(position.x, position.y, position.z);
		this.ambient = new Color(ambient.r, ambient.g, ambient.b);
		this.diffuse = new Color(diffuse.r, diffuse.g, diffuse.b);
		this.specular = new Color(specular.r, specular.g, specular.b);
		this.direction = new Color(direction.x, direction.y, direction.z);
		this.cutOff = options.cutoff;
		this.exponent = options.exponent;
		this.constant = options.constant;
		this.linear = options.linear;
		this.quadratic = options.quadratic;
		this.active = options.active;
	};
	
	Light.prototype.setPosition = function(x, y, z) {
		this.position = new Vec3(x, y, z);
	};
	
	Light.prototype.setAmbient = function(r, g, b) {
		this.ambient = new Color(r, g, b);
	};
	
	Light.prototype.setDiffuse = function(r, g, b) {
		this.diffuse = new Color(r, g, b);
	};
	
	Light.prototype.setSpecular = function(r, g, b) {
		this.specular = new Color(r, g, b);
	};
	
	Light.prototype.setDirection = function(x, y, z) {
		this.direction = new Vec3(x, y, z).$unit();
	};
	
	Light.prototype.setExponent = function(exponent) {
		this.exponent = exponent;
	};
	
	Light.prototype.setCutoff = function(cutoff) {
		this.cutoff = cutoff;
	};
	
	Light.prototype.setConstantAttenuation = function(constant) {
		this.constant = constant;
	};
	
	Light.prototype.setLinearAttenuation = function(linear) {
		this.linear = linear;	
	};
	
	Light.prototype.setQuadraticAttenuation = function(quadratic) {
		this.quadratic = quadratic;	
	};
	
	Light.prototype.setActive = function(active) {
		this.active = active;
	};
	
	var Texture = function(gl, options) {
		options = $.mix({
			level					: 0,
			verticalFlip	:	true,
			internalFmt		: gl.RGBA,
			format				: gl.RGBA,
			type					: gl.UNSIGNED_BYTE,
			magFilter			: gl.LINEAR,
			minFilter			: gl.LINEAR_MIPMAP_NEAREST,
			mipmap				: true,
			target				: gl.TEXTURE_2D			
		}, options || {});
		
		var texture = gl.createTexture();
		
		this.gl = gl;
		this.options = options;
		this.handler = texture;		
		
		gl.bindTexture(options.target, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.verticalFlip);
		gl.texImage2D(options.target, options.level, options.internalFmt, 
									options.format, options.type, options.image);
		gl.texParameteri(options.target, gl.TEXTURE_MAG_FILTER, options.magFilter);
		gl.texParameteri(options.target, gl.TEXTURE_MIN_FILTER, options.minFilter);
		if (options.mipmap) {
			this.generateMipmap();
		}
		gl.bindTexture(options.target, null);
	};
	
	Texture.prototype.destroy = function() {
		this.gl.deleteTexture(this.handler);
		return this;
	};
	
	Texture.prototype.bind = function(unit) {
		this.gl.activeTexture(this.gl.TEXTURE0 + unit);
		this.gl.bindTexture(this.options.target, this.handler);
		return this;
	};
	
	Texture.prototype.unbind = function(unit) {
		this.gl.activeTexture(this.gl.TEXTURE0 + unit);
		this.gi.bindTexture(this.options.target, null);
		return this;
	};
	
	Texture.prototype.generateMipmap = function() {
		this.gl.generateMipmap(this.options.target);
		return this;
	};

	BenchGL.Color = Color;
	BenchGL.Light = Light;
	BenchGL.Material = Material;
	BenchGL.Texture = Texture;
	
})();

// request.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {
	
	var XHRequest = function(options) {
		options = $.mix({
			url : 'www.google.com',
			method : 'GET',
			async : true,
			binary : false,
			onProgress : $.empty,
			onLoad : $.empty,
			onError : $.empty,
			onAbort : $.empty,
			onSuccess : $.empty
		}, options || {});
		
		this.options = options;
		this.request = new XMLHttpRequest();
		myself = this;
		
		this.request.addEventListener("progress", function(e) { myself.onProgress(e); }, false);
		this.request.addEventListener("load", function(e) { myself.onLoad(e); }, false);
		this.request.addEventListener("error", function(e) { myself.onError(e); }, false);
		this.request.addEventListener("abort", function(e) { myself.onAbort(e); }, false);
	};
	
	XHRequest.prototype.send = function() {
		var options = this.options,
				url = this.options.url,
				method = this.options.method,
				async = this.options.async,
				binary = this.options.binary,
				request = this.request;
				
		request.open(method, url, async);
		
		if (async) {
			request.onreadystatechange = function(e) {
				if (request.readyState == 4) {
					if (request.status == 200) {
						options.onSuccess(request.responseText);
					} else {
						options.onError(request.status);
					}
				}
			};
		}
		
		if (binary) {
			request.sendAsBinary(null);
		} else {
			request.send(null);
		}
		
		if (!async) {
			if (request.status == 200) {
				options.onSuccess(request.responseText);
			} else {
				options.onError(request.status);
			}
		}
	};
	
	XHRequest.prototype.onProgress = function(e) {
		this.options.onProgress(e);
	};
	
	XHRequest.prototype.onError = function(e) {
		this.options.onError(e);
	};
	
	XHRequest.prototype.onAbort = function(e) {
		this.options.onAbort(e);
	};
	
	XHRequest.prototype.onLoad = function(e) {
		this.options.onLoad(e);
	};
	
	var TextureRequest = function(renderer, options) {		
		this.textures = options;
		this.renderer = renderer;
	};
	
	TextureRequest.prototype.send = function() {
		var textures = this.textures,
				renderer = this.renderer,
				keys = Object.keys(this.textures),
				callback = this.callback;
				
		keys.map(function(key) {
			var textureOpt = textures[key];
			textureOpt.image = new Image();
			textureOpt.image.onload = function() {
				renderer.addTexture(key, textureOpt);
			};
			textureOpt.image.src = textureOpt.src;
		});
	};
	
	BenchGL.XHRequest = XHRequest;
	BenchGL.TextureRequest = TextureRequest;
	
})();

// mesh.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {
	
	var VertexBuffer = function(gl, values) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		this.gl = gl;
		this.handler = buffer;
		this.values = values;
		this.size = values.byteLength;
	};

	VertexBuffer.prototype.destroy = function() {
		this.gl.deleteBuffer(this.handler);
	};
	
	VertexBuffer.prototype.bind = function() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.handler);
	};
	
	VertexBuffer.prototype.unbind = function() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	};
	
	var IndexBuffer = function(gl, values) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, values, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		this.gl = gl;
		this.handler = buffer;
		this.values = values;
		this.size = values.byteLength;
	};
	
	IndexBuffer.prototype.destroy = function() {
		this.gl.deleteBuffer(this.handler);
	};
	
	IndexBuffer.prototype.bind = function() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.handler);
	};
	
	IndexBuffer.prototype.unbind = function() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	};
	
	var VertexAttribute = function(gl, name, size, normalized, stride, offset, values) {
		this.gl = gl;
		this.name = name;
		this.size = size;
		this.normalized = normalized;
		this.stride = stride;
		this.offset = offset;
		this.buffer = new VertexBuffer(gl, values);
	};
	
	VertexAttribute.prototype.destroy = function() {
		this.buffer.destroy();
	};
	
	VertexAttribute.prototype.bind = function(index) {
		this.buffer.bind();
		this.gl.vertexAttribPointer(index, this.size, this.gl.FLOAT, 
																this.normalized, this.stride, this.offset);
	};
	
	VertexAttribute.prototype.unbind = function() {
		this.buffer.unbind();
	};
	
	var FlatTopology = function(gl, name, primitive, first, count) {
		this.gl = gl;
		this.name = name;
		this.primitive = primitive;
		this.first = first;
		this.count = count;
	};
	
	FlatTopology.prototype.destroy = function() {
		;
	};
	
	FlatTopology.prototype.bind = function() {
		;
	};
	
	FlatTopology.prototype.unbind = function() {
		;
	};
	
	FlatTopology.prototype.render = function() {
		this.gl.drawArrays(this.primitive, this.first, this.count);
	};
	
	var IndexedTopology = function(gl, name, primitive, values) {
		this.gl = gl;
		this.name = name;
		this.primitive = primitive;
		this.size = values.length;
		this.buffer = new IndexBuffer(gl, values);
	};

	IndexedTopology.prototype.destroy = function() {
		this.buffer.destroy();
	};

	IndexedTopology.prototype.bind = function() {
		this.buffer.bind();
	};
	
	IndexedTopology.prototype.unbind = function() {
		this.buffer.unbind();
	};
	
	IndexedTopology.prototype.render = function() {
		this.gl.drawElements(this.primitive, this.size, this.gl.UNSIGNED_SHORT, 0);
	};
	
	var AttributeStream = function(gl) {
		this.gl = gl;
		this.size = 0;
		this.attributes = {};
	};
	
	AttributeStream.prototype.destroy = function() {
		for (var a in this.attributes) {
			this.attributes[a].destroy();
		}
	};
	
	AttributeStream.prototype.addAttribute = function(name, size, normalized, values) {
		var stride = 0,
				offset = 0,
				att = new VertexAttribute(this.gl, name, size, normalized, stride, offset, values);
		this.attributes[name] = att;
		this.size = values.length / size;
	};
	
	var TopologyStream = function(gl) {
		this.gl = gl;
		this.topologies = {};
	};
	
	TopologyStream.prototype.destroy = function() {
		for (var t in this.topologies) {
			this.topologies[t].destroy();
		}
	};
	
	TopologyStream.prototype.addFlatTopology = function(name, primitive, start, count) {
		this.topologies[name] = new FlatTopology(this.gl, name, primitive, start, count);
	};
	
	TopologyStream.prototype.addIndexedTopology = function(name, primitive, values) {
		this.topologies[name] = new IndexedTopology(this.gl, name, primitive, values);
	};
	
	var Mesh = function(gl) {
		this.gl = gl;
		this.astream = new AttributeStream(gl);
		this.tstream = new TopologyStream(gl);
	};
	
	Mesh.prototype.destroy = function() {
		this.astream.destroy();
		this.tstream.destroy();
	};
	
	Mesh.prototype.addAttribute = function(name, size, normalized, values) {
		this.astream.addAttribute(name, size, normalized, values);
	};
	
	Mesh.prototype.addFlatTopology = function(name, primitive, start, count) {
		this.tstream.addFlatTopology(name, primitive, start, count);
	};
	
	Mesh.prototype.addIndexedTopology = function(name, primitive, values) {
		this.tstream.addIndexedTopology(name, primitive, values);
	};
	
	Mesh.prototype.bind = function(program) {
		var attribute, buffer, index;

		for (var a in program.attributes) {
			attribute = program.attributes[a];
			buffer = this.astream.attributes[attribute.name];
			index = attribute.getIndex();
			program.gl.enableVertexAttribArray(index);
			if (buffer) {
				buffer.bind(index);
			}
		}	
	};
	
	Mesh.prototype.unbind = function(program) {
		var attribute, buffer, index;
		
		for (var a in program.attributes) {
			var attribute = program.attributes[a];
			var buffer = this.astream.attributes[attribute.name];
			index = attribute.getIndex();
			if (buffer) {
				buffer.unbind(index);
			}
			program.gl.disableVertexAttribArray(index);
		}	
	};
	
	Mesh.prototype.draw = function(primitives) {
		var prim = this.tstream.topologies[primitives];
		if (prim) {
			prim.bind();
			prim.render();
			prim.unbind();
		}	
	};
	
	Mesh.prototype.render = function(program, primitives) {
		this.bind(program);
		this.draw(primitives);
		this.unbind(program);
	};

	BenchGL.Mesh = Mesh;

})();

// model.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Vec3 = BenchGL.Vector3,
			Mesh = BenchGL.Mesh,
			cos = Math.cos,
			sin = Math.sin,
			pi = Math.PI,
			XHR = BenchGL.XHRequest;

	var Model = function(gl, options) {
		options = $.mix({
			dynamic 		: true,
			colorPerVertex : true,
			vertices		: [],
			normals			: [],
			texcoords		: [],
			color				: [1.0, 1.0, 1.0, 1.0],	
			primitives	:	{
				triangles : {
					type 			: gl.TRIANGLES
				}
			}
		}, options || {});
		
		this.gl = gl;
		this.dynamic = options.dynamic;
		this.colorPerVertex = options.colorPerVertex;
		this.vertices = options.vertices;
		this.normals = options.normals;
		this.texcoords = options.texcoords;
		this.color = options.color;
		this.primitives = options.primitives;
		this.mesh = null;
		
		if (this.dynamic) {
	  	this.buildMesh();
	  }
	};
	
	Model.prototype.buildMesh = function() {
		var vertices = this.vertices,
				normals = this.normals,
				texcoords = this.texcoords,
				color = this.color,
				primitives = this.primitives,
				mesh = new Mesh(this.gl);
		
		if (vertices.length > 0)
			mesh.addAttribute('a_position', 3, false, new Float32Array(vertices));
			
		if (normals.length > 0)
			mesh.addAttribute('a_normal', 3, false, new Float32Array(normals));
			
		if (texcoords.length > 0)
			mesh.addAttribute('a_texcoord', 2, false, new Float32Array(texcoords));
		
		if (this.colorPerVertex && color.length > 0) {
			this.normalizeColor();
			mesh.addAttribute('a_color', 4, false, new Float32Array(color));
		}
		
		for (var p in primitives) {
			var primitives = primitives[p],
					type = primitives.type,
					indices = primitives.indices;
			if (indices && indices.length > 0) {
				mesh.addIndexedTopology(p, type, new Uint16Array(indices));
			} else {
				mesh.addFlatTopology(p, type, 0, vertices.length/3);
			}
		}	
		
		this.mesh = mesh;
	};
	
	Model.prototype.setVertices = function(vertices) {
		if (this.dynamic) {
	  	this.mesh.addAttribute('a_position', 3, false, new Float32Array(vertices));
	  	if (this.colorPerVertex) {
	  		this.normalizeColor();
	  		this.mesh.addAttribute('a_color', 4, false, new Float32Array(this.color));
	  	}
	  }
	  this.vertices = vertices;
	  return this;
	};
	
	Model.prototype.setNormals = function(normals) {	
		if (this.dynamic) {
	    this.mesh.addAttribute('a_normal', 3, false, new Float32Array(normals));		
		}
		this.normals = normals;
		return this;
	};
	
	Model.prototype.setTexcoords = function(texcoords) {
		if (this.dynamic) {
	    this.mesh.addAttribute('a_texcoord', 2, false, new Float32Array(texcoords));
		}
		this.texcoords = texcoords;
		return this;
	};
	
	Model.prototype.setColor = function(color) {
		this.color = color;
	  if (this.dynamic) {
	    if (this.useMaterial) {
	      this.normalizeColor();
	      this.mesh.addAttribute('a_color', 4, false, new Float32Array(this.color));
	    }
	  }
		return this;
	};
	
	Model.prototype.setIndices = function(options) {
		var primitives, type, indices;
		
		for (var o in options) {
			primitives = options[o];
			type = primitives.type || this.gl.TRIANGLES;
			indices = primitives.indices;
			if (this.dynamic) {
	      if (indices && indices.length > 0) {
	      	this.mesh.addIndexedTopology(o, type, new Uint16Array(indices));
	      } else {
	        this.mesh.addFlatTopology(o, type, 0, this.vertices.length/3);
	      }		
			}
			this.primitives[o] = primitives;
		}
		return this;
	};
	
	Model.prototype.normalizeColor = function() {
		var color = this.color,
				factor = this.vertices.length * 4/3;
		
		if (color.length < factor) {
			var count = factor / this.color.length,
					copy = color.slice();
			
			while (--count) {
				color.push(copy[0]);
				color.push(copy[1]);
				color.push(copy[2]);
				color.push(copy[3]);
			}
		}
	};
	
	Model.prototype.calculateCentroid = function() {
		var vertices = this.vertices,
				l = this.vertices.length,
				x = 0.0,
				y = 0.0,
				z = 0.0;
	
		for (var i = 0; i < l; i += 3) {
			x += vertices[i];
			y += vertices[i+1];
			z += vertices[i+2];
		}
		
		x /= l;
		y /= l;
		z /= l;
		
		return new Vec3(x, y, z);
	};
	
	Model.prototype.render = function(program, mode) {
		if (!this.dynamic) {
	  	this.buildMesh();
	  }
		
		this.mesh.render(program, mode);
	};
	
	Model.factory = function(gl, type, options) {
		type = $.capitalize(type);
		
		if (typeof Model[type] !== "function") {
			throw {
				name : "UnknownModelType",
				message : "Method '" + type + "' does not exist."
			};
		}
		
		return Model[type](gl, options);	
	};
	
	
	Model.Triangle = function(gl, options) {
		return new Model(gl, $.mix({
			vertices : [
		     0.0,  1.0,  0.0,
		    -1.0, -1.0,  0.0,
		     1.0, -1.0,  0.0
			],
			normals : [
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0 
			],
			texcoords : [
				1.0, 1.0,
				0.0, 0.0,
				1.0, 0.0
			],
			color : [
		    1.0, 1.0, 1.0, 1.0,
		    1.0, 1.0, 1.0, 1.0,
		    1.0, 1.0, 1.0, 1.0			
			],
			primitives : {
				triangles : {
					type : gl.TRIANGLES
				}
			}			
		}, options || {}));		
	};
	
	Model.Rectangle = function(gl, options) {
		return new Model(gl, $.mix({
			vertices : [
				-1.0, -1.0, 0.0,
				 1.0, -1.0, 0.0,
				-1.0,  1.0, 0.0,
				 1.0,  1.0, 0.0
			],
			normals : [
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0
			],
			texcoords : [
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				1.0, 1.0
			],
			color : [
		    1.0, 1.0, 1.0, 1.0,
		    1.0, 1.0, 1.0, 1.0,
		    1.0, 1.0, 1.0, 1.0,
		    1.0, 1.0, 1.0, 1.0		
			],
			primitives : {
				triangles : {
					type 	: gl.TRIANGLES,
					indices : [0, 1, 2, 3, 1, 2]
				}
			}		
		}, options || {}));		
	};
	
	Model.Circle = function(gl, options) {
		var n = (options) ? options.slices || 16 : 16,
				r = (options) ? options.radius || 1.0 : 1.0,
				vertexCoords = [0.0, 0.0, 0.0],
				normalCoords = [0.0, 0.0, 1.0],
				textureCoords = [0.5, 0.5];
		
		for (var i=0; i<=n; i++) {
			var angle = pi*i/n;
			var x = r*cos(angle);
			var y = r*sin(angle);
			var u = (cos(angle)+1.0)*0.5;
			var v = (sin(angle)+1.0)*0.5;
			
			vertexCoords.push(x);
			vertexCoords.push(y);
			vertexCoords.push(0.0);
			normalCoords.push(0.0);
			normalCoords.push(0.0);
			normalCoords.push(1.0);
			textureCoords.push(u);
			textureCoords.push(v);
		}
		
		return new Model(gl, $.mix({
			vertices 		:	vertexCoords,
			normals 		: normalCoords,
			texcoords 	: textureCoords,
			color 			: [1.0, 1.0, 1.0, 1.0],
			primitives 	: {
				triangles : {
					type : gl.TRIANGLE_FAN
				}
			}		
		}, options || {}));		
	};
	
	Model.Cube = function(gl, options) {
		return new Model(gl, $.mix({
			vertices : [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
      ],
			normals : [
        // Front face
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,

        // Back face
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,

        // Top face
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,

        // Bottom face
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,

        // Right face
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
			],
			texcoords : [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
			],
			color : [
				// Front face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Back face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Top Face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Bottom face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Right face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Left face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0
			],
			primitives : {
				triangles : {
					type  : gl.TRIANGLES,
					indices : [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
					]
				}
			}		
		}, options || {}));			
	};
	
	Model.Pyramid = function(gl, options) {
		return new Model(gl, $.mix({
			vertices : [
				// Front
				 0.0,  1.0, 0.0,
				-1.0, -1.0, 1.0,
				 1.0, -1.0, 1.0,
				// Back
				 0.0,  1.0,  0.0,
				 1.0, -1.0, -1.0,
				-1.0, -1.0, -1.0,  
				// Right
				0.0,  1.0,  0.0,
				1.0, -1.0,  1.0,
				1.0, -1.0, -1.0,
				// Left
				 0.0,  1.0,  0.0,
				-1.0, -1.0, -1.0,
				-1.0, -1.0,  1.0 
			],
			normals : [
				// Front
				 0.0,  1.0, 0.0,
				-1.0, -1.0, 1.0,
				 1.0, -1.0, 1.0,
				// Back
				 0.0,  1.0,  0.0,
				 1.0, -1.0, -1.0,
				-1.0, -1.0, -1.0,  
				// Right
				0.0,  1.0,  0.0,
				1.0, -1.0,  1.0,
				1.0, -1.0, -1.0,
				// Left
				 0.0,  1.0,  0.0,
				-1.0, -1.0, -1.0,
				-1.0, -1.0,  1.0 		 
			],
			texcoords : [
				// Front
				1.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,
				// Back
				1.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,	
				// Right
				1.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,		
				// Left
				1.0, 1.0,
				0.0, 0.0,
				1.0, 0.0
			],
			color : [
				// Back face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Front Face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Right face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				// Left face
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0
			],
			primitives : {
				triangles : {
					type : gl.TRIANGLES
				}
			}		
		}, options || {}));		
	};
	
	Model.Sphere = function(gl, options) {
		var n = (options) ? options.slices || 32 : 32,
				m = (options) ? options.stacks || 32 : 32,
				r = (options) ? options.radius || 1.0 : 1.0,
				vertexCoords = [],
				normalCoords = [],
				textureCoords = [],
				pi2 = pi*2;
		
		for (var i=0; i<=n; i++) {
			var theta = pi*i/n;
			var sinT = sin(theta);
			var cosT = cos(theta);
			for (var j=0; j<=m; j++) {
				var phi = pi2*j/m;
				var sinP = sin(phi);
				var cosP = cos(phi);
				var x = r*sinT*cosP;
				var y = r*cosT;
				var z = r*sinT*sinP;
				var u = 1-j/m;
				var v = 1-i/n;
				var vertex = [r*sinT*cosP, r*cosT, r*sinT*sinP];
				var texcoord = [1-j/m, 1-i/n];
				
				vertexCoords.push(x);
				vertexCoords.push(y);
				vertexCoords.push(z);
				normalCoords.push(x);
				normalCoords.push(y);
				normalCoords.push(z);
				textureCoords.push(u);
				textureCoords.push(v);
			}
		}
		
		var indices = [];
		for (var i=0; i<n; i++) {
			for (var j=0; j<m; j++) {
				var first = i*(m+1)+j;
				var second = first+m+1;
				
				indices.push(first);
				indices.push(second);
				indices.push(first+1);
				indices.push(second);
				indices.push(second+1);
				indices.push(first+1);
			}
		}
		
		return new Model(gl, $.mix({
			vertices 		: vertexCoords,
			normals 		: normalCoords,
			texcoords		: textureCoords,
			color 			: [1.0, 1.0, 1.0, 1.0],
			primitives 	: {
				triangles : {
					type 		:	gl.TRIANGLES,
					indices : indices
				}
			}
		}, options || {}));			
	};
	
	Model.Json = function(gl, options) {
		var model;
		
		new XHR({
			url : options.url,
			async : false,
			onSuccess : function(response) {
				var json = JSON.parse(response),
						modelOpt = $.mix({
							vertices : json.vertexPositions,
							normals : json.vertexNormals,
							texcoords : json.vertexTextureCoords,
							primitives : {
								triangles : {
									type : gl.TRIANGLES,
									indices : json.indices
								}
							} 
						}, options.model || {});
				
				model = new Model(gl, modelOpt);
			}
		}).send();
		
		return model;		
	};
	
	Model.Obj = function(gl, options) {
		/*var model = new Model(gl);
		
		var defaultOptions = {
			async: true,
			callback: function(response){
				var vertexCoords = [];
				var normalCoords = [];
				var textureCoords = [];
				var indices = [];
				
				var positions = [];
				var normals = [];
				var textures = [];
				var faces = {};
				var index = 0;
				
				var tokens = null;
				var line = "";
				
				var x = y = z = nx = ny = nz = u = v = 0.0;
				var pos = norm = tex = 0;
				var hasPos = hasNorm = hasTex = false;
				
				var lines = response.split("\n");
				for (var l in lines) {
					line = lines[l].replace(/[ \t]+/g, " ").replace(/[\s\s*]$/, "");
					
					if (line.length == 0) continue;
					
					tokens = line.split(' ');
					
					if (tokens[0] == '#') continue;
					
					if (tokens[0] == 'v') {
			  		positions.push(parseFloat(tokens[1]));
			  		positions.push(parseFloat(tokens[2]));
			  		positions.push(parseFloat(tokens[3]));
			  	} else if (tokens[0] == 'vn') {
			  		normals.push(parseFloat(tokens[1]));
			  		normals.push(parseFloat(tokens[2]));
			  		normals.push(parseFloat(tokens[3]));
			  	}	else if (tokens[0] == 'vt') {
			  		textures.push(parseFloat(tokens[1]));
			  		textures.push(parseFloat(tokens[2]));
			  	} else if (tokens[0] == 'f') {
			  		if (tokens.length != 4) continue;
			  		
			  		for (var i = 1; i < 4; i++) {
			  			if (!(tokens[i] in faces)) {
			  				var f = tokens[i].split("/");
			  				
			  				if (f.length == 1) {
			  					pos = parseInt(f[0]) - 1;
			  					tex = pos;
			  					norm = pos;
			  				} else if (f.length == 3) {
			  					pos = parseInt(f[0]) - 1;
			  					tex = parseInt(f[1]) - 1;
			  					norm = parseInt(f[2]) - 1;
			  				} else {
			  					// Error face length not recognized
									break;
								}
									
								if (pos * 3 + 2 < positions.length) {
									hasPos = true;
									x = positions[pos * 3];
									y = positions[pos * 3 + 1];
									z = positions[pos * 3 + 2];
								}
								vertexCoords.push(x);
								vertexCoords.push(y);
								vertexCoords.push(z);
									
								if (norm * 3 + 2 < normals.length) {
									hasNorm = true;
									nx = normals[norm * 3];
									ny = normals[norm * 3 + 1];
									nz = normals[norm * 3 + 2];
								}
								normalCoords.push(nx);
								normalCoords.push(ny);
								normalCoords.push(nz);
									
								if (tex * 2 + 2 < textures.length) {
									hasTex = true;
									u = textures[tex * 2];
									v = textures[tex * 2 + 1];
								}
								textureCoords.push(u);
								textureCoords.push(v);
								
								faces[tokens[i]] = index++;
							}
								
							indices.push(faces[tokens[i]]);
						}	
					} else {
						// Error line type not recognized
					} 
				}
						
				if (hasPos) 
					model.setVertices(vertexCoords);
						
				if (hasNorm) 
					model.setNormals(normalCoords);
						
				if (hasTex) 
					model.setTexcoords(textureCoords);
						
				if (indices.length > 0) 
					model.setIndices('triangles', gl.TRIANGLES, indices);
			}
		};
		
		var options = options || {};
		for (var d in defaultOptions) {
			if (typeof options[d] === "undefined") 
				options[d] = defaultOptions[d];
		}
		
		var response = new XHRequest(options).send();
		
		return model;*/
	};
	
	Model.Objb = function(gl, options) {
		/*var model = new Model(gl);
		
		var worker = new Worker('../workers/loader1.js');
		
		worker.addEventListener('message', function(e) {
			switch (e.data.type) {
	  		case 'vertex':
					model.setVertices(e.data.values);
					break;
				case 'normal':
					model.setNormals(e.data.values);
					break;
				case 'texture':
					model.setTexcoords(e.data.values);
					break;
				case 'index':
					model.setIndices('triangles', gl.TRIANGLES, e.data.values);
					break;
				default:
					break;
	  	}
		}, false);
		
		worker.postMessage(options);
		
		return model;*/	
	};
	
	Model.Objs = function(gl, objs) {
		/*var keys = Object.keys(objs);
		var l = keys.length;
		var models = [];
		for (var i=0; i<l; i++) {
			models.push(new Model(gl));
		}
		
		var workers = new BenchWorkerPool('../workers/loader2.js', l);
		
		workers.map(function(i) {
			return objs[keys[i]];
		});
		
		workers.reduce(function(result, data) {
			result.push(data);
		}, 
		function(result) {
			console.log(result);
			var i = 0;
			for (var r in result) {
				var model = models[i++];
				var modelData = result[r];
				model.setVertices(modelData.vertexCoords);
				model.setNormals(modelData.normalCoords);
				model.setTexcoords(modelData.textureCoords);
				model.setIndices('triangles', gl.TRIANGLES, modelData.indices);
			}
		}, []);
		
		return models;*/
	};	
	
	BenchGL.Model = Model;

})();

// worker.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var WorkerPool = function(filename, n) {
		this.workers = [];
		this.intermediates = [];
		while (n--) {
			this.workers.push(new Worker(filename));
		}
	};
	
	WorkerPool.prototype.map = function(mapper) {
		for(var i=0; i<this.workers.length; i++) {
			this.intermediates.push(mapper(i));
		}
	};
	
	WorkerPool.prototype.reduce = function(reducer, callback, base) {
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
	
	WorkerPool.prototype.clean = function() {
		this.intermediates = [];
	};
	
	BenchGL.WorkerPool = WorkerPool; 
	
})();

// canvas.js
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
		
		//canvas.contentEditable = true;
		
		this.canvas = canvas;
		this.events = options;
		this.keysDown = {};
		this.mouseDown = {};
		this.mousePosition = { x: 0.0, y: 0.0 };
		this.mouseLastPosition = { x: 0.0, y: 0.0 };
		this.mouseDelta = { x: 0.0, y: 0.0 };
		
		myself = this;
		document.addEventListener("keydown", function(e) { myself.onKeyDown(e); }, false);
		document.addEventListener("keyup", function(e) { myself.onKeyUp(e); }, false);
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
				y = this.canvas.height - e.clientY - 1;
				
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
				y = this.canvas.height - e.clientY - 1;
				
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
				y = this.canvas.height - e.clientY - 1;
				
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
				y = this.canvas.height - e.clientY - 1,
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

// camera.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function () {
	
	var Vec3 = BenchGL.Vector3,
			MatStack = BenchGL.MatrixStack,
			TransformStack = BenchGL.TransformStack;
	
	var Camera = function(options) {
		var e = options.eye,
				d = options.direction,
				u = options.up,
				fovy = options.fovy,
				aspect = options.aspect,
				near = options.near,
				far = options.far;
		
		this.fovy = fovy;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.eye = e && new Vec3(e.x, e.y, e.z) || new Vec3();
		this.direction = d && new Vec3(d.x, d.y, d.z) || new Vec3();
		this.up = u && new Vec3(u.x, u.y, u.z) || new Vec3(0, 1, 0);
			
		this.transform = new TransformStack();
		this.transform.projection();
		this.transform.perspective(fovy, aspect, near, far);
	};
	
	Camera.prototype.update = function() {
		this.transform.view();
		this.transform.lookAt(this.eye, this.direction, this.up);
		this.transform.model();
	};
	
	Camera.prototype.move = function(options) {
		options = options || {};
		
		var e = options.eye,
				d = options.direction,
				u = options.up;
				
		this.eye = e && new Vec3(e.x, e.y, e.z) || new Vec3();
		this.direction = d && new Vec3(d.x, d.y, d.z) || new Vec3();
		this.up = u && new Vec3(u.x, u.y, u.z) || new Vec3(0, 1, 0);
		
		this.update();
	};
	
	BenchGL.Camera = Camera;
	
})();

// shader.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


(function() {
	
	var Shader = function(gl, type, source) {
		var shader = gl.createShader(type),
				valid = false,
				log = '';
		
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		
		valid = gl.getShaderParameter(shader, gl.COMPILE_STATUS) != 0;		
		log += gl.getShaderInfoLog(shader);
		
		this.source = source;
		this.handler = shader;
		this.type = type;
		this.valid = valid;
		this.log = log;
	};
	
	Shader.prototype.destroy = function() {
		this.gl.deleteShader(this.handler);
	};
	
	Shader.Vertex = {
		Default : [
			"#ifdef GL_ES",
			"precision highp float;",
			"#endif",
			
			"attribute vec3 a_position;",
			"attribute vec3 a_normal;",
			"attribute vec2 a_texcoord;",
			"attribute vec4 a_color;",
			
			"uniform mat4 u_modelViewMatrix;",
			"uniform mat4 u_projectionMatrix;",
			"uniform mat4 u_normalMatrix;",
			"uniform mat4 u_viewMatrix;",
			
			"uniform bool u_enableLighting;",
			"uniform vec3 u_ambientColor;",
			"uniform vec3 u_directionalColor;",
			"uniform vec3 u_lightingDirection;",
			
			"uniform bool u_enableLight1;",
			"uniform vec3 u_lightColor1;",
			"uniform vec3 u_lightPosition1;",
			
			"uniform bool u_enableLight2;",
			"uniform vec3 u_lightColor2;",
			"uniform vec3 u_lightPosition2;",
		
			"uniform bool u_enableLight3;",
			"uniform vec3 u_lightColor3;",
			"uniform vec3 u_lightPosition3;",
			
			"uniform bool u_enableLight4;",
			"uniform vec3 u_lightColor4;",
			"uniform vec3 u_lightPosition4;",
			
			"varying vec4 v_color;",
			"varying vec2 v_texcoord;",
			"varying vec3 v_lightFactor;",
			
			"void main(void) {",
			"	vec4 ecPosition = u_modelViewMatrix * vec4(a_position, 1.0);",
			
			" if (!u_enableLighting) {",
			"		v_lightFactor = vec3(1.0, 1.0, 1.0);",
			"	} else {",
			"		vec3 lightDirection;",
			"		vec3 lightPosition;",
			"		vec3 lightFactor1 = vec3(0.0, 0.0, 0.0);",
			"		vec3 lightFactor2 = vec3(0.0, 0.0, 0.0);",
			"		vec3 lightFactor3 = vec3(0.0, 0.0, 0.0);",
			"		vec3 lightFactor4 = vec3(0.0, 0.0, 0.0);",
			
			"		vec3 normal = normalize((u_normalMatrix * vec4(a_normal, 1.0)).xyz);",
	
			"		vec3 directionalFactor = max(0.0, dot(normal, -u_lightingDirection)) * u_directionalColor;",
			
			"		if (u_enableLight1) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition1, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor1 = max(0.0, dot(normal, lightDirection)) * u_lightColor1;",
			"		}",
			
			"		if (u_enableLight2) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition2, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor2 = max(0.0, dot(normal, lightDirection)) * u_lightColor2;",
			"		}",
			
			"		if (u_enableLight3) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition3, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor3 = max(0.0, dot(normal, lightDirection)) * u_lightColor3;",
			"		}",
			
			"		if (u_enableLight4) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition4, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor4 = max(0.0, dot(normal, lightDirection)) * u_lightColor4;",
			"		}",
			
			"		v_lightFactor = u_ambientColor + directionalFactor + ",
			"			lightFactor1 + lightFactor2 + lightFactor3 + lightFactor4;",
			"	}",
			
			"	v_color = a_color;",
			" v_texcoord = a_texcoord;",
			" gl_Position = u_projectionMatrix * ecPosition;",
			"}"
			
		].join("\n")
	};
	
	Shader.Fragment = {
		Default : [
			"#ifdef GL_ES",
			"precision highp float;",
			"#endif",
			
			"uniform bool u_enableTexturing;",
			"uniform bool u_useTexture0;",
			"uniform sampler2D tex0;",
			
			"varying vec4 v_color;",
			"varying vec2 v_texcoord;",
			"varying vec3 v_lightFactor;",
			
			"void main(void) {",
			"	vec4 fColor = vec4(v_color.rgb * v_lightFactor, v_color.a);",
			
			"	if (u_enableTexturing) {",
			" 	if (u_useTexture0) {",
			"			fColor = vec4(texture2D(tex0, vec2(v_texcoord.s, v_texcoord.t)).rgb * v_lightFactor, 1.0);",
			" 	}",
			"	}",
			
			"	gl_FragColor = fColor;",
			"}"
		].join("\n")
	};
	
	BenchGL.Shader = Shader;
	
})();

// program.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Shader = BenchGL.Shader,
			XHR = BenchGL.XHRequest;
	
	var ProgramAttribute = function(program, name, type, size, index) {
		this.program = program;
		this.name = name;
		this.type = type;
		this.size = size;
		this.location = location;
	};
	
	ProgramAttribute.prototype.setIndex = function(n) {
		this.program.gl.bindAttribLocation(this.program.handler, n, this.name);
		this.location = n;
	},
	
	ProgramAttribute.prototype.getIndex = function() { 
		return this.location; 
	};
	
	var ProgramUniform = function(program, name, type, size, location) {
		this.program = program;
		this.name = name;
		this.type = type;
		this.size = size;
		this.location = location;		
		this.func = null;
		this.value = null;
		
		var gl = program.gl;
		
		switch (type) {
			case gl.BOOL:
				this.func = function(v) { gl.uniform1i(this.location, v); };
				break;
			case gl.BOOL_VEC2:
				this.func = function(v) { gl.uniform2iv(this.location, v); };
				break;
			case gl.BOOL_VEC3:
				this.func = function(v) { gl.uniform3iv(this.location, v); };
				break;
			case gl.BOOL_VEC4:
				this.func = function(v) { gl.uniform4iv(this.location, v); };
				break;
			case gl.INT:
				this.func = function(v) { gl.uniform1i(this.location, v); };
				break;
			case gl.INT_VEC2:
				this.func = function(v) { gl.uniform2iv(this.location, v); };
				break;
			case gl.INT_VEC3:
				this.func = function(v) { gl.uniform3iv(this.location, v); };
				break;
			case gl.INT_VEC4:
				this.func = function(v) { gl.uniform4iv(this.location, v); };
				break;
			case gl.FLOAT:
				this.func = function(v) { gl.uniform1f(this.location, v); };
				break;
			case gl.FLOAT_VEC2:
				this.func = function(v) { gl.uniform2fv(this.location, v); };
				break;
			case gl.FLOAT_VEC3:
				this.func = function(v) { gl.uniform3fv(this.location, v); };
				break;
			case gl.FLOAT_VEC4:
				this.func = function(v) { gl.uniform4fv(this.location, v); };
				break;
			case gl.FLOAT_MAT2:
				this.func = function(v) { gl.uniformMatrix2fv(this.location, gl.FALSE, v); };
				break;
			case gl.FLOAT_MAT3:
				this.func = function(v) { gl.uniformMatrix3fv(this.location, gl.FALSE, v); };
				break;
			case gl.FLOAT_MAT4:
				this.func = function(v) { gl.uniformMatrix4fv(this.location, gl.FALSE, v); };
				break;
			default:
				throw {
					name : "UnknownUniformType",
					message : "The uniform variable type is unknown."
				};
				break;
		}
	};
	
	ProgramUniform.prototype.setValue = function(v) {
		this.value = v;
		this.func(v);
	};
	
	ProgramUniform.prototype.getValue = function() {
		return this.value;
	};
	
	var ProgramSampler = function(program, name, type, size, location) {
		this.program = program;
		this.name = name;
		this.type = type;
		this.size = size;
		this.location = location;
		this.unit = -1;
	};
	
	ProgramSampler.prototype.getUnit = function() {
		return this.unit;
	};
		
	ProgramSampler.prototype.setUnit = function(n) {
		this.program.gl.uniform1i(this.location, n);
		this.unit = n;
	};
	
	var Program = function(gl, vertex, fragment) {
		var program = gl.createProgram(),
				valid = false,
				log = '';
		
		gl.attachShader(program, vertex.handler);
		gl.attachShader(program, fragment.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Compiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}

		this.gl = gl;
		this.vertex = vertex;
		this.fragment = fragment;
		this.handler = program;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.buildVariables();
		this.setupDefaultBindings();
	};
	
	Program.prototype.buildVariables = function() {
		var gl = this.gl,
				program = this.handler,
				attributes = this.attributes,
				uniforms = this.uniforms,
				samplers = this.samplers,
				attributesCount = 0, uniformsCount = 0,
				a, u, location, attribute, uniform, sampler;
				
		attributesCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		for (var i=0; i<attributesCount; ++i) {
			a = gl.getActiveAttrib(program, i);
			if (!a) continue;
			location = gl.getAttribLocation(program, a.name);
			attribute = new ProgramAttribute(this, a.name, a.type, a.size, location);
			attributes[a.name] = attribute;
		}
		
		uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for (var i=0; i<uniformsCount; ++i) {
			u = gl.getActiveUniform(program, i);
			if (!u) continue;
			location = gl.getUniformLocation(program, u.name);
			if (u.type == gl.SAMPLER_2D || u.type == gl.SAMPLER_CUBE) {
				sampler = new ProgramSampler(this, u.name, u.type, u.size, location);
				samplers[u.name] = sampler;
			} else {
				uniform = new ProgramUniform(this, u.name, u.type, u.size, location);
				uniforms[u.name] = uniform;
			}
		}
		
		return this;
	};

	Program.prototype.setupDefaultBindings = function() {
		var gl = this.gl,
				program = this.handler,
				index = 0, unit = 0,
				attribute, uniforms;
				
		for (var a in this.attributes) {
			attribute = this.attributes[a];
			gl.bindAttribLocation(program, index, attribute.name);
			attribute.setIndex(index);
			index++;
		}
		gl.linkProgram(program);
		
		for (var u in this.uniforms) {
			uniform = this.uniforms[u];
			uniform.location = gl.getUniformLocation(program, uniform.name);
		}
		
		for (var s in this.samplers) {
			sampler = this.samplers[s];
			sampler.location = gl.getUniformLocation(program, sampler.name);
			sampler.setUnit(unit);
			unit++;
		}
		
		return this;
	};
	
	Program.prototype.setVertexShader = function(shader) {
		var gl = this.gl,
				program = this.handler,
				valid = false,
				log = '';
		
		gl.detachShader(program, this.vertex.handler);
		gl.attachShader(program, shader.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Recompiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}

		this.vertex = shader;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.buildVariables();
		this.setupDefaultBindings();
		
		return this;
	};
	
	Program.prototype.setFragmentShader = function(shader) {
		var gl = this.gl,
				program = this.handler,
				valid = false,
				log = '';
		
		gl.detachShader(program, this.fragment.handler);
		gl.attachShader(program, shader.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Recompiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}
	
		this.fragment = shader;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.buildVariables();
		this.setupDefaultBindings();
		
		return this;
	};
	
	Program.prototype.setShaders = function(vertex, fragment) {
		var gl = this.gl,
				program = this.handler,
				valid = false,
				log = '';
		
		gl.detachShader(program, this.vertex.handler);
		gl.detachShader(program, this.fragment.handler);
		gl.attachShader(program, vertex.handler);
		gl.attachShader(program, fragment.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Recompiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}
		
		this.vertex = vertex;
		this.fragment = fragment;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.build();
		this.setupDefaultBindings();
		
		return this;
	};
	
	Program.prototype.link = function() {
		this.gl.linkProgram(this.handler);
	};
	
	Program.prototype.destroy = function() {
		this.gl.deleteProgram(this.handler);
		this.vertex.destroy();
		this.fragment.destroy();
	};
	
	Program.prototype.bind = function() {
		this.gl.useProgram(this.handler);
	};
	
	Program.prototype.unbind = function() {
		this.gl.useProgram(null);
	};
	
	Program.prototype.bindAttributes = function(mapping) {
		var attribute = null;
		for (var a in mapping) {
			attribute = this.attributes[a];
			if (attribute) {
				attribute.setIndex(mapping[a]);
			}
		}

		this.gl.linkProgram(this.handler);
	};
	
	Program.prototype.bindUniforms = function(mapping) {
		var uniform = null;
		for (var u in mapping) {
			uniform = this.uniforms[u];
			if (uniform) {
				uniform.setValue(mapping[u]);
			}
		}
	};
	
	Program.prototype.bindSamplers = function(mapping) {
		var sampler = null;
		for (var s in mapping) {
			sampler = this.samplers[s];
			if (sampler) {
				sampler.setUnit(mapping[s]);
			}
		}
	};
	
	Program.factory = function(gl, options) {
		var type = options && options.type || 'defaults',
				method = 'From' + $.capitalize(type);
				
		if (typeof Program[method] !== "function") {
			throw {
				name : "UnknownProgramType",
				message : "Type '" + method + "' does not exist."
			};
		}
		
		return Program[method](gl, options);
	};
	
	Program.FromUrls = function(gl, options) {
		options = $.mix({
			vertex : '',
			fragment : '',
			onSuccess : $.empty,
			onError : $.empty
		}, options || {});
		
		new XHR({
			url : options.vertex,
			onError : function(e) {
				options.onError(e);
			},
			onSuccess : function(vs) {
				new XHR({
					url : options.fragment,
					onError : function(e) {
						options.onError(e);
					},
					onSuccess : function(fs) {
						options.onSuccess(Program.FromSources(gl, {
							vertex : vs, 
							fragment : fs
						}));
					}
				}).send();
			} 
		}).send();
	};
	
	Program.FromScripts = function(gl, options) {
		var vs = options.vertex, 
				fs = options.fragment,
				vertex = new Shader(gl, gl.VERTEX_SHADER, $(vs).innerHTML),
				fragment = new Shader(gl, gl.FRAGMENT_SHADER, $(fs).innerHTML);
		return new Program(gl, vertex, fragment);
	};
	
	Program.FromSources = function(gl, options) {
		var vs = options.vertex, 
				fs = options.fragment,
				vertex = new Shader(gl, gl.VERTEX_SHADER, vs),
				fragment = new Shader(gl, gl.FRAGMENT_SHADER, fs);
		return new Program(gl, vertex, fragment);
	};
	
	Program.FromDefaults = function(gl, options) {
		var vs = options && $.capitalize(options.vertex) || 'Default',
				fs = options && $.capitalize(options.fragment) || 'Default',
				vertex = new Shader(gl, gl.VERTEX_SHADER, Shader.Vertex[vs]),
				fragment = new Shader(gl, gl.FRAGMENT_SHADER, Shader.Fragment[fs]);
		return new Program(gl, vertex, fragment);
	};

	BenchGL.Program = Program;

})();

// renderer.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Vec3 = BenchGL.Vector3,
			Mat4 = BenchGL.Matrix4,
			MatStack = BenchGL.MatrixStack,
			Color = BenchGL.Color,
			Material = BenchGL.Material,
			Light = BenchGL.Light,
			Texture = BenchGL.Texture,
			TextureRequest = BenchGL.TextureRequest;

	var Renderer = function(gl, program, camera, effects) {
		this.gl = gl;
		this.program = program;
		this.camera = camera;
		this.effects = effects;
	
		// Background and current color
		this.clearColor = new Color(0, 0, 0, 1);	
		
		// Textures
		this.useTexturing = false;
		this.textures = {};
		this.activeTextures = [];
		
		// Ambient Light
		this.ambientColor = new Color(0.2, 0.2, 0.2);
		
		// Lights
		this.useLighting = false;
		this.directionalColor = new Color(0.8, 0.8, 0.8);
		this.lightingDirection = new Vec3(0.0, 0.0, -1.0);
		this.lights = {};
		
		// Materials
		this.useMaterials = false;
		this.material = new Material();
		
		// Uniforms and samplers
		this.uniforms = {};
		this.samplers = {};
		
		// Saved models
		this.models = [];
	};
	
	Renderer.prototype.background = function() {
		var color = this.clearColor;
		
		this.gl.clearColor(color.r, color.g, color.b, color.a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.enable(this.gl.DEPTH_TEST);
	};	
	
	Renderer.prototype.useLights = function(lighting) {
		this.useLighting = lighting;
	};
	
	Renderer.prototype.useTextures = function(texturing) {
		this.useTexturing = texturing;
	};

	Renderer.prototype.useAlphaBlending = function(blending, options) {
		options = $.mix({
			src : this.gl.SRC_ALPHA,
			dest : this.gl.ONE
		}, options || {});
		
		if (blending) {
	  	this.gl.enable(this.gl.BLEND);
			this.gl.disable(this.gl.DEPTH_TEST);
	  	this.gl.blendFunc(options.src, options.dest);
	  } else {
			this.gl.disable(this.gl.BLEND);
			this.gl.enable(this.gl.DEPTH_TEST);
		}
	};
	
	Renderer.prototype.setClearColor = function(r, g, b, a) {
		this.clearColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setAmbientColor = function(r, g, b, a) {
		this.ambientColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setDirectionalColor = function(r, g, b, a) {
		this.directionalColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setLightingDirection = function(x, y, z) {
		this.lightingDirection = new Vec3(x, y, z).$unit();
	};
	
	Renderer.prototype.addLight = function(name, options) {
		this.lights[name] = new Light(options);
	};
	
	Renderer.prototype.addTexture = function(name, options) {
		this.textures[name] = new Texture(this.gl, options);
	};
	
	Renderer.prototype.addTextures = function(options) {
		new TextureRequest(this, options).send();
	};
	
	Renderer.prototype.setTextures = function(options) {
		this.activeTextures = [];
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg in this.textures) {
				this.activeTextures.push(this.textures[arg]);
			}
		}
	};
	
	Renderer.prototype.setUniform = function(name, value) {
		this.uniforms[name] = value;
	};
	
	Renderer.prototype.setSampler = function(name, value) {
		this.samplers[name] = value;
	};
	
	Renderer.prototype.setupCamera = function() {
		var uniforms = this.uniforms,
				transformStack = this.camera.transform,
				proj = transformStack.getProjectionMatrix().toFloat32Array(),
				view = transformStack.getViewMatrix().toFloat32Array(),
				modelView = transformStack.getModelViewMatrix().toFloat32Array(),
				normal = transformStack.getNormalMatrix().toFloat32Array();
		
		uniforms['u_projectionMatrix'] = proj;
		uniforms['u_viewMatrix'] = view;
		uniforms['u_modelViewMatrix'] = modelView;
		uniforms['u_normalMatrix'] = normal;
	};
	
	Renderer.prototype.setupLights = function() {
		var uniforms = this.uniforms,
				index = 0, light;
		
		uniforms['u_enableLighting'] = this.useLighting;
		uniforms['u_ambientColor'] = this.ambientColor.toRGBFloat32Array();
		uniforms['u_directionalColor'] = this.directionalColor.toRGBFloat32Array();
		uniforms['u_lightingDirection'] = this.lightingDirection.toFloat32Array();
		
		for (var l in this.lights) {
			light = this.lights[l];
			uniforms['u_enableLight' + (index + 1)] = light.active;
			uniforms['u_lightColor' + (index + 1)] = light.diffuse.toRGBFloat32Array();
			uniforms['u_lightPosition' + (index + 1)] = light.position.toFloat32Array();
			uniforms['u_lightSpecularColor' + (index + 1)] = light.specular.toRGBFloat32Array();
			index++;
		}
	};
	
	Renderer.prototype.setupTextures = function() {
		var uniforms = this.uniforms,
				samplers = this.samplers,
				texture;
				
		uniforms['u_enableTexturing'] = this.useTexturing;
		
		for (var i = 0, l = this.activeTextures.length; i < l; i++) {
			texture = this.activeTextures[i];
			uniforms['u_useTexture' + i] = true;
			samplers['tex' + i] = i;
			texture.bind(i);
		}
	};
	
	Renderer.prototype.setupMaterials = function() {
		var uniforms = this.uniforms,
				material = this.material;
		
		uniforms['u_matAmbient'] = material.ambient.toRGBAFloat32Array();
		uniforms['u_matDiffuse'] = material.diffuse.toRGBAFloat32Array();
		uniforms['u_matSpecular'] = material.specular.toRGBAFloat32Array();
		uniforms['u_matEmissive'] = material.emissive.toRGBAFloat32Array();
		uniforms['u_matShininess'] = material.shininess;
	};
	
	Renderer.prototype.setupEffects = function() {
		var uniforms = this.uniforms,
				effects = this.effects,
				effect, property, value;
		
		for (var e in effects) {
			effect = effects[e];
			uniforms['use' + e] = true;
			for (var p in effect) {
				property = p.charAt(0).toUpperCase() + p.slice(1);
				value = effect[p];
				uniforms[e + property] = value;
			} 
		}
	};
	
	Renderer.prototype.renderModel = function(model, mode) {
		if (model) {
			var program = this.program,
					mode = this.mode || 'triangles',
					uniforms = this.uniforms
					samplers = this.samplers;
				
			this.setupCamera();
			this.setupLights();
			this.setupTextures();
			this.setupMaterials();
			this.setupEffects();
				
			program.bindUniforms(uniforms);
			program.bindSamplers(samplers);
			
			model.render(program, mode);
		}
	};
	
	BenchGL.Renderer = Renderer;

})();

// timer.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var nowTime = 0,
			lastTime = 0,
			elapsedTime = 0;

	var Timer = function() {
		this.fps = 0;
		this.lastDelta = 0;
		this.maxSamples = 60;
		this.samples = [];
	};
	
	Timer.prototype.start = function() {
		nowTime = new Date().getTime();
		lastTime = nowTime;
		elapsedTime = 0;
		return this;
	};
	
	Timer.prototype.stop = function() {
		var now = new Date().getTime()
				lastTime = nowTime;
				nowTime = now;
				elapsedTime = nowTime - lastTime,
				fps = 1000.0 / elapsedTime;
				
		if (this.samples.unshift(fps) > this.maxSamples)
			this.samples.pop();
			
		var fps = 0;
		for (var i = 0, l = this.samples.length; i < l; i++) {
			fps += this.samples[i];
		}
		fps /= this.samples.length;
		
		this.fps = Math.round(fps);
		this.lastDelta = elapsedTime;
		return this;
	};
	
	Timer.prototype.clear = function() {
		nowTime = 0;
		lastTime = 0;
		elapsedTime = 0;
		
		this.fps = 0;
		this.lastDelta = 0;
		this.samples = [];
		return this;
	};
	
	BenchGL.Timer = Timer;

})();

// logger.js
//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

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

