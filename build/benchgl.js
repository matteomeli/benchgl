/**
@preserve

BenchGL - A WebGL-based javascript graphic library.
Copyright (c) 2010-2011 Matteo Meli.
 
*/

(function() {

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

// utils.js
// General utility functions.

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

// math.js
// Provides a math library to handle 3D vectors, matrices and quaternions.

BenchGL.namespace('BenchGL.math.Vector3');

BenchGL.math.Vector3 = (function() {
	
	// Dependencies
  var acos = Math.acos,
  		sqrt = Math.sqrt,
			
			// Private properties and methods
      Vector3;
  
  /**
   * Creates a new Vector3.
   * @class Represents a vector in homogeneous 3D space.
   * @param {Number} [x=0] The x coordinate.
   * @param {Number} [y=0] The y coordinate.
   * @param {Number} [z=0] The z coordinate.  
   */
  Vector3 = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };
  
  /**
   * Copies this Vector3 in a new one.
   * @returns {Vector3} A copy of this Vector3. 
   */
  Vector3.prototype.copy = function() {
    return new Vector3(this.x, this.y, this.z);
  };
  
  /**
   * Sets this Vector3 coordinates.
   * @param {Number} [x=0] The x coordinate to set.
   * @param {Number} [y=0] The y coordinate to set.
   * @param {Number} [z=0] The z coordinate to set.
   */
  Vector3.prototype.set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  };
  
  /**
   * Gets the norm of this Vector3.
   * @returns {Number} The norm of this Vector3.
   */
  Vector3.prototype.norm = function() {
    var x = this.x, y = this.y, z = this.z;
    return sqrt(x * x + y * y + z * z);
  };
  
  /**
   * Gets the squared norm of this Vector3.
   * @returns {Number} The squared norm of this Vector3. 
   */
  Vector3.prototype.normSqr = function() {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };
  
  /**
   * Negates this Vector3. Does not affect this Vector3.
   * @returns {Vector3} A new vector representing the negation of this Vector3.
   */
  Vector3.prototype.negate = function() {
    return new Vector3(-this.x, -this.y, -this.z);
  };
 	
 	/**
 	 * Negates this Vector3. Affects this Vector3.
 	 * @returns {Vector3} The negated version of this Vector3.
 	 */
  Vector3.prototype.$negate = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  };
  
  /**
   * Normalizes this Vector3. Does not affect this Vector3.
   * @returns {Vector3} A new vector representing the normalized version of this Vector3.
   */
  Vector3.prototype.unit = function() {
    var x = this.x, y = this.y, z = this.z, d = sqrt(x * x + y * y + z * z);
    if (d > 0) {
      return new Vector3(x / d, y / d, z / d);
    }
    return this.copy();
  };

  /**
   * Normalizes this Vector3. Affects this Vector3.
   * @returns {Vector3} The normalized version of this Vector3.
   */  
  Vector3.prototype.$unit = function(){
    var x = this.x, y = this.y, z = this.z, d = sqrt(x * x + y * y + z * z);
    if (d > 0) {
      this.$scale(1 / d);
    }
    return this;
  };
  
  /**
   * Adds another Vector3 to this Vector3. Does not affect this Vector3.
   * @param {Vector3} vector The Vector3 to add.
   * @returns {Vector3} A new vector representing the addition.
   */
  Vector3.prototype.add = function(vector) {
    var x = this.x + vector.x, 
    		y = this.y + vector.y, 
    		z = this.z + vector.z;
    return new Vector3(x, y, z);
  };

  /**
   * Adds another Vector3 to this Vector3. Affects this Vector3.
   * @param {Vector3} vector The Vector3 to add.
   * @returns {Vector3} This Vector3 now stores the sum.
   */  
  Vector3.prototype.$add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  };

  /**
   * Subtracts another Vector3 to this Vector3. Does not affect this Vector3.
   * @param {Vector3} vector The Vector3 to add.
   * @returns {Vector3} A new vector representing the subtraction.
   */    
  Vector3.prototype.sub = function(vector) {
    var x = this.x - vector.x, y = this.y - vector.y, z = this.z - vector.z;
    return new Vector3(x, y, z);
  };

  /**
   * Subtracts another Vector3 to this Vector3. Affects this Vector3.
   * @param {Vector3} vector The Vector3 to add.
   * @returns {Vector3} This Vector3 now stores the subtraction.
   */    
  Vector3.prototype.$sub = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  };
  
  /**
   * Scales this Vector3 by a factor. Does not affect this Vector3.
   * @param {Number} f The factor to scale this Vector3 with.
   * @returns {Vector3} A new vector representing the scaled version of this Vector3.
   */
  Vector3.prototype.scale = function(f) {
    var x = this.x * f, y = this.y * f, z = this.z * f;
    return new Vector3(x, y, z);
  };

  /**
   * Scales this Vector3 by a factor. Affects this Vector3
   * @param {Number} f The factor to scale this Vector3 with.
   * @returns {Vector3} This Vector3 now is scaled.
   */  
  Vector3.prototype.$scale = function(f) {
    this.x *= f;
    this.y *= f;
    this.z *= f;
    return this;
  };
  
  /**
   * Calculates the angle between this and another Vector3.
   * @param {Vector3} vector The other Vector3 to calculate the angle with.
   * @returns {Number} The angle between the two Vector3.
   */
  Vector3.prototype.angleWith = function(vector) {
    var dot = this.dot(vector), normThis = this.norm(), normThat = vector.norm();
    return acos(dot / (normThis * normThat));
  };
  
  /**
   * Calculates the distance between this and another Vector3.
   * @param {Vector3} vector The other Vector3 to calculate the distance with.
   * @returns {Number} The distance between the two Vector3.
   */
  Vector3.prototype.distTo = function(vector) {
    var x = this.x - vector.x, y = this.y - vector.y, z = this.z - vector.z;
    return sqrt(x * x + y * y + z * z);
  };

  /**
   * Calculates the squared distance between this and another Vector3.
   * @param {Vector3} vector The other Vector3 to calculate the distance with.
   * @returns {Number} The squared distance between the two Vector3.
   */  
  Vector3.prototype.distToSqr = function(vector) {
    var x = this.x - vector.x, y = this.y - vector.y, z = this.z - vector.z;
    return (x * x + y * y + z * z);
  };
  
  /**
   * Computes the dot product between this and another Vector3.
   * @param {Vector3} vector The other Vector3 to compute the dot product with.
   * @returns {Number} The dot product.
   */
  Vector3.prototype.dot = function(vector) {
    return (this.x * vector.x + this.y * vector.y + this.z * vector.z);
  };

  /**
   * Computes the cross product between this and another Vector3. 
   * Does not affect this Vector3.
   * @param {Vector3} vector The other Vector3 to compute the dot product with.
   * @returns {Vector3} A new vector representing the croos product.
   */  
  Vector3.prototype.cross = function(vector) {
    var x = this.x, y = this.y, z = this.z, vx = vector.x, vy = vector.y, vz = vector.z;
    return new Vector3(y * vz - z * vy, x * vz - z * vx, x * vy - y * vx);
  };
  
  /**
   * Gets the array version of this Vector3.
   * @returns {Array} An array representation of this Vector3.
   */
  Vector3.prototype.toArray = function() {
    return [this.x, this.y, this.z];
  };
  
  return Vector3;
  
}());

BenchGL.namespace('BenchGL.math.Matrix4');

BenchGL.math.Matrix4 = (function() {

	// Dependencies
	var sin = Math.sin, 
      cos = Math.cos, 
      sqrt = Math.sqrt,
      tan = Math.tan, 
      pi = Math.PI,
      Vec3 = BenchGL.math.Vector3,
      
      // Private properties and methods
			Matrix4;
  
  /**
   * Creates a new Matrix4. If no argumnets are supplied returns the identity matrix.
   * @class Represents a four by four matrix.
   * @param {Number} [m11=1] The element at row 1 column 1.
   * @param {Number} [m12=0] The element at row 1 column 2.
   * @param {Number} [m13=0] The element at row 1 column 3.
   * @param {Number} [m14=0] The element at row 1 column 4.
   * @param {Number} [m21=0] The element at row 2 column 1.
   * @param {Number} [m22=1] The element at row 2 column 2. 
   * @param {Number} [m23=0] The element at row 2 column 3. 
   * @param {Number} [m24=0] The element at row 2 column 4. 
   * @param {Number} [m31=0] The element at row 3 column 1. 
   * @param {Number} [m32=0] The element at row 3 column 2. 
   * @param {Number} [m33=1] The element at row 3 column 3. 
   * @param {Number} [m34=0] The element at row 3 column 4. 
   * @param {Number} [m41=0] The element at row 4 column 1.
   * @param {Number} [m42=0] The element at row 4 column 2. 
   * @param {Number} [m43=0] The element at row 4 column 3. 
   * @param {Number} [m44=1] The element at row 4 column 4.    
   */
  Matrix4 = function(m11, m12, m13, m14, 
                     m21, m22, m23, m24, 
                     m31, m32, m33, m34, 
                     m41, m42, m43, m44) {
    if (typeof m11 !== "undefined") {
      this.set(m11, m12, m13, m14, 
               m21, m22, m23, m24, 
               m31, m32, m33, m34, 
               m41, m42, m43, m44);
    }
    else {
	    this.m11 = this.m22 = this.m33 = this.m44 = 1; 
	    this.m12 = this.m13 = this.m14 = 0;
	    this.m21 = this.m23 = this.m24 = 0; 
	    this.m31 = this.m32 = this.m34 = 0; 
	    this.m41 = this.m42 = this.m43 = 0;
    }
  };

  /**
   * Sets the elements of this Matrix4.
   * @param {Number} m11 The element at row 1 column 1.
   * @param {Number} m12 The element at row 1 column 2.
   * @param {Number} m13 The element at row 1 column 3.
   * @param {Number} m14 The element at row 1 column 4.
   * @param {Number} m21 The element at row 2 column 1.
   * @param {Number} m22 The element at row 2 column 2. 
   * @param {Number} m23 The element at row 2 column 3. 
   * @param {Number} m24 The element at row 2 column 4. 
   * @param {Number} m31 The element at row 3 column 1. 
   * @param {Number} m32 The element at row 3 column 2. 
   * @param {Number} m33 The element at row 3 column 3. 
   * @param {Number} m34 The element at row 3 column 4. 
   * @param {Number} m41 The element at row 4 column 1.
   * @param {Number} m42 The element at row 4 column 2. 
   * @param {Number} m43 The element at row 4 column 3. 
   * @param {Number} m44 The element at row 4 column 4.    
   */  
  Matrix4.prototype.set = function(m11, m12, m13, m14, 
                                   m21, m22, m23, m24, 
                                   m31, m32, m33, m34, 
                                   m41, m42, m43, m44){
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
  
  /**
   * Sets this Matrix4 to the identity matrix. Affects this Matrix4.
   * @returns {Matrix4} This Matrix4 is now an identity matrix.
   */
  Matrix4.prototype.$identity = function() {
    this.m11 = this.m22 = this.m33 = this.m44 = 1; 
    this.m12 = this.m13 = this.m14 = 0;
    this.m21 = this.m23 = this.m24 = 0; 
    this.m31 = this.m32 = this.m34 = 0; 
    this.m41 = this.m42 = this.m43 = 0;
	  return this;    
  };
  
  /**
   * Copies this Matrix4 in another one.
   * @returns {Matrix4} A copy of this Matrix4.
   */
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
  
  /**
   * Adds this Matrix4 to another one. Does not affect this Matrix4.
   * @param {Matrix4} m The Matrix4 to add.
   * @returns {Matrix4} A new matrix containing the addition.
   */
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

  /**
   * Adds this Matrix4 to another one. Affects this Matrix4.
   * @param {Matrix4} m The Matrix4 to add.
   * @returns {Matrix4} This Matrix4 now contains the addition.
   */  
  Matrix4.prototype.$add = function(m){
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

  /**
   * Subtracts this Matrix4 to another one. Does not affect this Matrix4.
   * @param {Matrix4} m The Matrix4 to add.
   * @returns {Matrix4} A new matrix containing the subtraction.
   */  
  Matrix4.prototype.sub = function(m){
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

  /**
   * Subtracts this Matrix4 to another one. Affects this Matrix4.
   * @param {Matrix4} m The Matrix4 to add.
   * @returns {Matrix4} This Matrix4 now contains the subtraction.
   */   
  Matrix4.prototype.$sub = function(m){
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

	/**
	 * Multiplies a Vector3 by this Matrix4. (r = M*v)
	 * @returns {Vector3} A new vector with the result of the multiplication.
	 */
  Matrix4.prototype.multiplyVec3 = function(vector) {
    var vx = vector.x, 
    		vy = vector.y, 
    		vz = vector.z;
    
    return new Vec3(this.m11 * vx + this.m12 * vy + this.m13 * vz + this.m14, 
    									 this.m21 * vx + this.m22 * vy + this.m23 * vz + this.m24, 
    									 this.m31 * vx + this.m32 * vy + this.m33 * vz + this.m34);
  };
  
	/**
	 * Multiplies this Matrix4 by another one. Does not affect this Matrix4.
	 * @returns {Matrix4} A new matrix with the result of the multiplication.
	 */  
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

	/**
	 * Multiplies this Matrix4 by another one. Affects this Matrix4.
	 * @returns {Matrix4} This Matrix4 now stores the result of the multiplication.
	 */   
  Matrix4.prototype.$multiplyMat4 = function(m){
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
  
  /**
   * Transpose this Matrix4. Does not affect this Matrix4.
   * @returns {Matrix4} A new matrix representing the transpose of this Matrix4.
   */
  Matrix4.prototype.transpose = function(){
    var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14, 
        m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24, 
        m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34, 
        m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44;
    
    return new Matrix4(m11, m21, m31, m41, 
                       m12, m22, m32, m42, 
                       m13, m23, m33, m43, 
                       m14, m24, m34, m44);
  };

  /**
   * Transpose this Matrix4. Affects this Matrix4.
   * @returns {Matrix4} This Matrix4 is now transposed.
   */  
  Matrix4.prototype.$transpose = function(){
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

  /**
   * Inverts this Matrix4. Does not affect this Matrix4.
   * @returns {Matrix4} A new matrix representing the inverted of this MAtrix4.
   */  
  Matrix4.prototype.invert = function() {
    var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14, 
        m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24, 
        m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34, 
        m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44,
    
        s0 = m11 * m22 - m12 * m21, 
        s1 = m11 * m23 - m13 * m21, 
        s2 = m11 * m24 - m14 * m21, 
        s3 = m12 * m23 - m13 * m22, 
        s4 = m12 * m24 - m14 * m22, 
        s5 = m13 * m24 - m14 * m23, 
        c0 = m31 * m42 - m32 * m41, 
        c1 = m31 * m43 - m33 * m41, 
        c2 = m31 * m44 - m34 * m41, 
        c3 = m32 * m43 - m33 * m42, 
        c4 = m32 * m44 - m34 * m42, 
        c5 = m33 * m44 - m34 * m43,
    
        det = s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0,
    
        a11 = m22 * c5 - m23 * c4 + m24 * c3, 
        a12 = -m12 * c5 + m13 * c4 - m14 * c3, 
        a13 = m42 * s5 - m43 * s4 + m44 * s3, 
        a14 = -m32 * s5 + m33 * s4 - m34 * s3, 
        a21 = -m21 * c5 + m23 * c2 - m24 * c1, 
        a22 = m11 * c5 - m13 * c2 + m14 * c1, 
        a23 = -m41 * s5 + m43 * s2 - m44 * s1, 
        a24 = m31 * s5 - m33 * s2 + m34 * s1, 
        a31 = m21 * c4 - m22 * c2 + m24 * c0, 
        a32 = -m11 * c4 + m12 * c2 - m14 * c0, 
        a33 = m41 * s4 - m42 * s2 + m44 * s0, 
        a34 = -m31 * s4 + m32 * s2 - m34 * s0, 
        a41 = -m21 * c3 + m22 * c1 - m23 * c0, 
        a42 = m11 * c3 - m12 * c1 + m13 * c0, 
        a43 = -m41 * s3 + m42 * s1 - m43 * s0, 
        a44 = m31 * s3 - m32 * s1 + m33 * s0;
    
    return new Matrix4(a11 / det, a12 / det, a13 / det, a14 / det, 
                       a21 / det, a22 / det, a23 / det, a24 / det, 
                       a31 / det, a32 / det, a33 / det, a34 / det, 
                       a41 / det, a42 / det, a43 / det, a44 / det);
  };

  /**
   * Inverts this Matrix4. Affects this Matrix4.
   * @returns {Matrix4} This Matrix4 is now inverted.
   */    
  Matrix4.prototype.$invert = function() {
    var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14, 
        m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24, 
        m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34, 
        m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44,
    
        s0 = m11 * m22 - m12 * m21, 
        s1 = m11 * m23 - m13 * m21, 
        s2 = m11 * m24 - m14 * m21, 
        s3 = m12 * m23 - m13 * m22, 
        s4 = m12 * m24 - m14 * m22, 
        s5 = m13 * m24 - m14 * m23, 
        c0 = m31 * m42 - m32 * m41, 
        c1 = m31 * m43 - m33 * m41, 
        c2 = m31 * m44 - m34 * m41, 
        c3 = m32 * m43 - m33 * m42, 
        c4 = m32 * m44 - m34 * m42, 
        c5 = m33 * m44 - m34 * m43,
    
        det = s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0,
    
        a11 = m22 * c5 - m23 * c4 + m24 * c3, 
        a12 = -m12 * c5 + m13 * c4 - m14 * c3, 
        a13 = m42 * s5 - m43 * s4 + m44 * s3, 
        a14 = -m32 * s5 + m33 * s4 - m34 * s3, 
        a21 = -m21 * c5 + m23 * c2 - m24 * c1, 
        a22 = m11 * c5 - m13 * c2 + m14 * c1, 
        a23 = -m41 * s5 + m43 * s2 - m44 * s1, 
        a24 = m31 * s5 - m33 * s2 + m34 * s1, 
        a31 = m21 * c4 - m22 * c2 + m24 * c0, 
        a32 = -m11 * c4 + m12 * c2 - m14 * c0, 
        a33 = m41 * s4 - m42 * s2 + m44 * s0, 
        a34 = -m31 * s4 + m32 * s2 - m34 * s0, 
        a41 = -m21 * c3 + m22 * c1 - m23 * c0, 
        a42 = m11 * c3 - m12 * c1 + m13 * c0, 
        a43 = -m41 * s3 + m42 * s1 - m43 * s0, 
        a44 = m31 * s3 - m32 * s1 + m33 * s0;
    
    this.set(a11 / det, a12 / det, a13 / det, a14 / det, 
             a21 / det, a22 / det, a23 / det, a24 / det, 
             a31 / det, a32 / det, a33 / det, a34 / det, 
             a41 / det, a42 / det, a43 / det, a44 / det);
    
    return this;
  };
  
  /**
   * Gets a Float32Array representation of this Matrix4.
   * @returns {Float32Array} A new Float32Array containing the elements of this Matrix.
   */
  Matrix4.prototype.toFloat32Array = function() {
    return new Float32Array([this.m11, this.m21, this.m31, this.m41, 
                             this.m12, this.m22, this.m32, this.m42, 
                             this.m13, this.m23, this.m33, this.m43, 
                             this.m14, this.m24, this.m34, this.m44]);
  };
  
  /**
   * Creates the identity matrix.
   * @returns {Matrix4} The identity matrix.
   */
  Matrix4.Identity = function() {
  	return new Matrix4();
  };
  
  /**
   * Creates a translation matrix.
   * @param {Number} x The translation on x coordinate.
   * @param {Number} y The translation on y coordinate.
   * @param {Number} z The translation on z coordinate.      
   * @returns {Matrix4} A translation matrix.
   */
  Matrix4.Translate = function(x, y, z){
    return new Matrix4(1, 0, 0, x, 
                       0, 1, 0, y, 
                       0, 0, 1, z, 
                       0, 0, 0, 1);
  };

  /**
   * Creates a scale matrix.
   * @param {Number} x The scale on x coordinate.
   * @param {Number} y The scale on y coordinate.
   * @param {Number} z The scale on z coordinate.      
   * @returns {Matrix4} A scale matrix.
   */  
  Matrix4.Scale = function(x, y, z){
    return new Matrix4(x, 0, 0, 0, 
                       0, y, 0, 0, 
                       0, 0, z, 0, 
                       0, 0, 0, 1);
  };

  /**
   * Creates a general rotation matrix around an axis.
   * @param {Number} angle The rotation angle in radians.
   * @param {Number} x The axis x coordinate.
   * @param {Number} y The axis y coordinate.
   * @param {Number} z The axis z coordinate.      
   * @returns {Matrix4} A general rotation matrix.
   */   
  Matrix4.Rotate = function(angle, x, y, z) {
    var axis = new Vec3(x, y, z).$unit(), 
        ax = axis.x, ay = axis.y, az = axis.z, 
        s = sin(angle), c = cos(angle), t = 1 - c;
    return new Matrix4(t * ax * ax + c, t * ax * ay - az * s, t * ax * az + ay * s, 0, 
                       t * ax * ay + az * s, t * ay * ay + c, t * ay * az - ax * s, 0, 
                       t * ax * az - ay * s, t * ay * az + ax * s, t * az * az + c, 0, 
                       0, 0, 0, 1);
  };

  /**
   * Creates a rotation matrix around an x, y and z axis.
   * @param {Number} rx The rotation angle around x axis.
   * @param {Number} ry The rotation angle around y axis.
   * @param {Number} rz The rotation angle around z axis.    
   * @returns {Matrix4} A XYZ rotation matrix.
   */  
  Matrix4.RotateXYZ = function(rx, ry, rz) {
    var sx = sin(rx), cx = cos(rx), 
        sy = sin(ry), cy = cos(ry), 
        sz = sin(rz), cz = cos(rz);
    
    return new Matrix4(cy * cz, -cx * sz + sx * sy * cz, sx * sz + cx * sy * cz, 0,
                       cy * sz, cx * cz + sx * sy * sz, -sx * cz + cx * sy * sz, 0, 
                       -sy, sx * cy, cx * cy, 0, 
                       0, 0, 0, 1);
  };

  /**
   * Creates a lookAt matrix.
   * @param {Vector3} eye The eye vector.
   * @param {Vector3} direction The direction vector.
   * @param {Vector3} up The up vector.    
   * @returns {Matrix4} A lookAt Matrix4.
   */   
  Matrix4.LookAt = function(eye, direction, up){
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
                       0, 0, 0, 1);
  };

  /**
   * Creates a frustum matrix.
   * @param {Number} left The left clipping plane.
   * @param {Number} right The right clipping plane.
   * @param {Number} bottom The bottom clipping plane.
   * @param {Number} top The top clipping plane.
   * @param {Number} near The near clipping plane.
   * @param {Number} far The far clipping plane.  
   * @returns {Matrix4} A frustum matrix.
   */  
  Matrix4.Frustum = function(left, right, bottom, top, near, far){
    var x = 2.0 * near / (right - left), 
        y = 2.0 * near / (top - bottom),
        a = (right + left) / (right - left),
        b = (top + bottom) / (top - bottom),
        c = -(far + near) / (far - near),
        d = -2.0 * far * near / (far - near);
    
    return new Matrix4(x, 0,  a, 0, 
                       0, y,  b, 0, 
                       0, 0,  c, d, 
                       0, 0, -1, 0);
  };

  /**
   * Creates a perspective matrix.
   * @param {Number} fovy The vertical field of view angle.
   * @param {Number} aspect The aspect ratio aka the horizontal field of view angle.
   * @param {Number} near The near clipping plane.
   * @param {Number} far The far clipping plane.  
   * @returns {Matrix4} A perspective matrix.
   */    
  Matrix4.Perspective = function(fovy, aspect, near, far){
    var ymax = near * tan(fovy * pi / 360.0),
        ymin = -ymax,
        xmin = ymin * aspect,
        xmax = ymax * aspect;
    
    return Matrix4.Frustum(xmin, xmax, ymin, ymax, near, far);
  };

	return Matrix4;
  
}());

BenchGL.namespace('BenchGL.math.Quaternion');

BenchGL.math.Quaternion = (function() {
  
  // Dependencies
  var sin = Math.sin,
  		cos = Math.cos,
  		Mat4 = BenchGL.math.Matrix4,
  		
  		// Private properties and methods
  		Quaternion;
  /**
   * Creates a new Quaternion.
   * @class	Represents a quaternion.
   * @param {Number} a The scalar part.
   * @param {Number} b The i component of the vector part.
   * @param {Number} c The j component of the vector part.
   * @param {Number} d The k component of the vector part.
   */
  Quaternion = function(a, b, c, d) {
    if (typeof a !== "undefined") {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
    }
    else {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 0;
    }
  };
  
  /**
   * Sets this Quaternion as the identity quaternion.
   * @returns {Quaternion} This Quaternion is now the identity quaternion.
   */
  Quaternion.prototype.identity = function() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 0;
    return this;
  };
  
  /**
   * Multiplies this Quaternion with another one. Does not affect this Quaternion.
   * @param {Quaternion} quat The Quaternion to multiply with.
   * @returns {Quaternion} A new quaternion containing the multiplication's result.
   */
  Quaternion.prototype.multiply = function(quat) {
    var a1 = this.m, 
        b1 = this.b, 
        c1 = this.c, 
        d1 = this.d, 
        a2 = quat.a, 
        b2 = quat.b, 
        c2 = quat.c, 
        d2 = quat.d, 
    
        a = a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
        b = a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
        c = a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
        d = a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2;
    
    return new Quaternion(a, b, c, d);
  };

  /**
   * Multiplies this Quaternion with another one. Affects this Quaternion.
   * @param {Quaternion} quat The Quaternion to multiply with.
   * @returns {Quaternion} This Quaternion now stores the result of the multiplication.
   */  
  Quaternion.prototype.$multiply = function(quat) {
    var a1 = this.m, 
        b1 = this.b, 
        c1 = this.c, 
        d1 = this.d, 
        a2 = quat.a, 
        b2 = quat.b, 
        c2 = quat.c, 
        d2 = quat.d, 
    
        a = a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
        b = a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
        c = a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
        d = a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2;
    
    this.m = a;
    this.b = b;
    this.c = c;
    this.d = d;
        
    return this;
  };
  
  /**
   * Gets a Matrix4 representing this Quaternion.
   * @returns {Matrix4} A matrix representing this Quaternion.
   */
  Quaternion.prototype.toMatrix4 = function() {
    var a = this.m, b = this.b, c = this.c, d = this.d, 
        b2 = b * b, c2 = c * c, d2 = d * d, 
        bc = b * c, bd = b * d, cd = c * d, ab = a * b, ac = a * c, ad = a * d;
    
    return new Mat4(1 - 2 * c2 - 2 * d2, 2 * bc - 2 * ad, 2 * ac + 2 * bd, 0, 
                       2 * bc + 2 * ad, 1 - 2 * b2 - 2 * d2, 2 * cd - 2 * ab, 0, 
                       2 * bd - 2 * ac, 2 * ab + 2 * cd, 1 - 2 * b2 - 2 * c2, 0, 
                       0, 0, 0, 1);
  };
  
  /**
   * Creates a new quaternion from euler angles.
   * @returns {Quaternion} A new quaternion from the euler angles.
   */
  Quaternion.FromEulerAngles = function(pitch, roll, yaw){
    var p = pitch * 0.5, y = yaw * 0.5, r = roll * 0.5, 
        cp = cos(p), sp = sin(p), 
        cy = cos(y), sy = sin(y), 
        cr = cos(r), sr = sin(r),
    
        a = cp * cy * cr + sp * sy * sr,
        b = sp * cy * cr - cp * sy * sr,
        c = cp * sy * cr + sp * cy * sr,
        d = cp * cy * sr - sp * sy * cr;
    
    return new Quaternion(a, b, c, d);
  };
  
  return Quaternion;
  
}());

BenchGL.namespace('BenchGL.math.MatrixStack');

BenchGL.math.MatrixStack = (function() {

	// Dependencies
	var Mat4 = BenchGL.math.Matrix4,
			pi = Math.PI,
			
			// Private properties and methods
      MatrixStack;
	
	MatrixStack = function() {
		this.stack = [];
		this.current = 0;
		this.stack.push(Mat4.Identity());
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
		this.stack[this.current] = Mat4.Identity();
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
		var conversion = pi / 180;
		this.multiply(Mat4.RotateXYZ(rx * conversion, ry * conversion, rz * conversion));
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
	
	return MatrixStack;
	
}());

BenchGL.namespace('BenchGL.math.TransformStack');

BenchGL.math.TransformStack = (function() {

	// Private properties and methods
	var TransformStack;
	
	TransformStack = function() {
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
	
	return TransformStack;
	
}());

// skin.js
// The skin module has the tools to manipulate colors, materials, lights and textures.

BenchGL.namespace('BenchGL.skin.Color');

BenchGL.skin.Color = (function() {

	// Dependencies
  var Vec3 = BenchGL.math.Vector3, 
  
  		// Private properties and methods
      Color;
  
  Color = function(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 1;
  };
  
  Color.prototype.toRGBArray = function(){
    return [this.r, this.g, this.b];
  };
  
  Color.prototype.toRGBAArray = function(){
    return [this.r, this.g, this.b, this.a];
  };
  
  return Color;
  
}());

BenchGL.namespace('BenchGL.skin.Material');

BenchGL.skin.Material = (function() {

	// Dependencies
	var Color = BenchGL.skin.Color,
			
			// Private properties and methods
			Material;
  
  Material = function(options){
    options = $.mix({
      ambient: {
        r: 0.0,
        g: 0.0,
        b: 0.0
      },
      diffuse: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      specular: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      emissive: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      shininess: 0.1
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
  
  Material.prototype.setAmbient = function(r, g, b){
    this.ambient = new Color(r, g, b);
  };
  
  Material.prototype.setDiffuse = function(r, g, b){
    this.diffuse = new Color(r, g, b);
  };
  
  Material.prototype.setSpecular = function(r, g, b){
    this.specular = new Color(r, g, b);
  };
  
  Material.prototype.setEmissive = function(r, g, b){
    this.emissive = new Color(r, g, b);
  };
  
  Material.prototype.setShininess = function(shininess){
    this.shininess = shininess;
  };
  
  return Material;
  
}());

BenchGL.namespace('BenchGL.skin.Light');

BenchGL.skin.Light = (function() {
  
  // Dependencies
  var Vec3 = BenchGL.math.Vector3,
  		Color = BenchGL.skin.Color,
  		Material = BenchGL.skin.Material,
  
  		// Private properties and methods
  		Light;
  
  Light = function(options){
    options = $.mix({
      position: {
        x: 0.0,
        y: 0.0,
        z: -1.0
      },
      ambient: {
        r: 0.0,
        g: 0.0,
        b: 0.0
      },
      diffuse: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      specular: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      direction: {
        x: 0.0,
        y: 0.0,
        z: -1.0
      },
      cutoff: 180.0,
      exponent: 0.0,
      constant: 1.0,
      linear: 0.0,
      quadratic: 0.0,
      active: true
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
  
  Light.prototype.setPosition = function(x, y, z){
    this.position = new Vec3(x, y, z);
  };
  
  Light.prototype.setAmbient = function(r, g, b){
    this.ambient = new Color(r, g, b);
  };
  
  Light.prototype.setDiffuse = function(r, g, b){
    this.diffuse = new Color(r, g, b);
  };
  
  Light.prototype.setSpecular = function(r, g, b){
    this.specular = new Color(r, g, b);
  };
  
  Light.prototype.setDirection = function(x, y, z){
    this.direction = new Vec3(x, y, z).$unit();
  };
  
  Light.prototype.setExponent = function(exponent){
    this.exponent = exponent;
  };
  
  Light.prototype.setCutoff = function(cutoff){
    this.cutoff = cutoff;
  };
  
  Light.prototype.setConstantAttenuation = function(constant){
    this.constant = constant;
  };
  
  Light.prototype.setLinearAttenuation = function(linear){
    this.linear = linear;
  };
  
  Light.prototype.setQuadraticAttenuation = function(quadratic){
    this.quadratic = quadratic;
  };
  
  Light.prototype.setActive = function(active){
    this.active = active;
  };
  
  return Light;
  
}());

BenchGL.namespace('BenchGL.skin.Texture');

BenchGL.skin.Texture = (function() {
  
  // Private properties and methods
  var Texture;
  
  Texture = function(options){
    options = $.mix({
      level: 0,
      verticalFlip: true,
      internalFmt: gl.RGBA,
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      magFilter: gl.LINEAR,
      minFilter: gl.LINEAR_MIPMAP_NEAREST,
      mipmap: true,
      target: gl.TEXTURE_2D
    }, options || {});
    
    var texture = gl.createTexture();
    
    this.options = options;
    this.handler = texture;
    
    gl.bindTexture(options.target, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.verticalFlip);
    gl.texImage2D(options.target, options.level, options.internalFmt, options.format, options.type, options.image);
    gl.texParameteri(options.target, gl.TEXTURE_MAG_FILTER, options.magFilter);
    gl.texParameteri(options.target, gl.TEXTURE_MIN_FILTER, options.minFilter);
    if (options.mipmap) {
      this.generateMipmap();
    }
    gl.bindTexture(options.target, null);
  };
  
  Texture.prototype.destroy = function(){
    gl.deleteTexture(this.handler);
    return this;
  };
  
  Texture.prototype.bind = function(unit){
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(this.options.target, this.handler);
    return this;
  };
  
  Texture.prototype.unbind = function(unit){
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(this.options.target, null);
    return this;
  };
  
  Texture.prototype.generateMipmap = function(){
    gl.generateMipmap(this.options.target);
    return this;
  };
  
  return Texture;
  
}());

// io.js
// Offers structures and functions to perform asynchronous IO operations.

BenchGL.namespace('BenchGL.io.XHRequest');

BenchGL.io.XHRequest = (function() {
  
  var XHRequest;
	
	/**
	 * Creates a new XHRequest.
	 * @class Wraps an XMLHttpRequest object to load resources asynchronously. 
	 * @param {Object} [options] The request's options.
	 * @param {String} [options.url] The url for the request.
	 * @param {String} [options.method] The method for the request.
	 * @param {Boolean} [options.async] Is the request asynchronous?
	 * @param {Boolean} [options.binary] Is the response in binary format?
	 * @param {Function} [options.onProgress] Callback to call during request processing.
	 * @param {Function} [options.onLoad] Callback to call after request loading.
	 * @param {Function} [options.onError] Callback to call in case of error.
	 * @param {Function} [options.onAbort] Callback to call if the request is aborted.
	 * @param {Function} [options.onSuccess] Callback to call in case of success.         
	 */
  XHRequest = function(options) {
    options = $.mix({
      url: 'www.webrendering.sourceforge.net',
      method: 'GET',
      async: true,
      binary: false,
      onProgress: $.empty,
      onLoad: $.empty,
      onError: $.empty,
      onAbort: $.empty,
      onSuccess: $.empty
    }, options || {});
    
    var myself = this;
       
    this.options = options;
    this.request = new XMLHttpRequest();
    
    this.request.addEventListener('progress', function(e) { myself.onProgress(e); }, false);
    this.request.addEventListener('load', function(e) { myself.onLoad(e); }, false);
    this.request.addEventListener('error', function(e) { myself.onError(e); }, false);
    this.request.addEventListener('abort', function(e) { myself.onAbort(e); }, false);
  };
  
  /**
   * Executes the request wrapped in this XHRequest.
   */
  XHRequest.prototype.send = function() {
    var options = this.options, 
    		url = this.options.url, 
    		method = this.options.method, 
    		async = this.options.async, 
    		binary = this.options.binary, 
    		request = this.request;
    
    // Opens the request
    request.open(method, url, async);
    
    // Handle async requests
    if (async) {
      request.onreadystatechange = function(e) {
        if (request.readyState === 4) {
          if (request.status === 200) {
            options.onSuccess(request.responseText);
          }
          else {
            options.onError(request.status);
          }
        }
      };
    }
    
    // Handles binary requests
    if (binary) {
      request.sendAsBinary(null);
    }
    else {
      request.send(null);
    }
    
    // If not async wait for the response
    if (!async) {
      if (request.status === 200) {
        options.onSuccess(request.responseText);
      }
      else {
        options.onError(request.status);
      }
    }
  };
  
  /**
   * Handles the 'onprogress' event of this XHRequest.
   */
  XHRequest.prototype.onProgress = function(e) {
    this.options.onProgress(e);
  };

  /**
   * Handles the 'onerror' event of this XHRequest.
   */  
  XHRequest.prototype.onError = function(e) {
    this.options.onError(e);
  };

  /**
   * Handles the 'onabort' event of this XHRequest.
   */  
  XHRequest.prototype.onAbort = function(e) {
    this.options.onAbort(e);
  };
  
  /**
   * Handles the 'onload' event of this XHRequest.
   */  
  XHRequest.prototype.onLoad = function(e) {
    this.options.onLoad(e);
  };
  
	return XHRequest;
	
}());

BenchGL.namespace('BenchGL.io.TextureRequest');

BenchGL.io.TextureRequest = (function() {

	var TextureRequest;
  
  /**
   * Creates a new TextureRequest.
   * @class Represents multiple asynchronous requests for images to build up Texture objects.
   * @param {Object} options Information about the requested textures.
   */
  TextureRequest = function(options) {
    this.texturesReqs = options;
  };
  
  /**
   * Executes all the request of this TextureRequest, 
   * using a callback function to handle each one of them on completion.
   * @param {Function} callback A callback function to handle results on completion.
   */
  TextureRequest.prototype.send = function(callback) {
    var texturesReqs = this.texturesReqs,
        keys = Object.keys(texturesReqs);
    
    keys.map(function(key) {
      var textureOpt = texturesReqs[key];
      textureOpt.image = new Image();
      textureOpt.image.onload = function() {
      	if (callback) {
        	callback(key, textureOpt);
        }
      };
      textureOpt.image.src = textureOpt.src;
    });
  };
  
  return TextureRequest;
  
}());

// ui.js
// The ui module handles user interaction and events.

BenchGL.namespace('BenchGL.ui.Canvas');

BenchGL.ui.Canvas = (function() {

	var Canvas;
	
	/**
	 * Creates a new Canvas.
	 * @class Represents a wrap object for a canvas HTML5 element.
	 * @param {HTMLCanvasElement} canvas The canvas element.
	 * @options {Object} options Contains callbacks to handle events in the browser.
	 */
  Canvas = function(canvas, options) {
    options = $.mix({
      onKeyDown: $.empty,
      onKeyUp: $.empty,
      onMouseDown: $.empty,
      onMouseUp: $.empty,
      onMouseMove: $.empty,
      onMouseWheel: $.empty,
      onMouseOut: $.empty
    }, options || {});
    
    //canvas.contentEditable = true;
    
    this.canvas = canvas;
    this.events = options;
    this.keysDown = {};
    this.mouseDown = {};
    this.mousePosition = {
      x: 0.0,
      y: 0.0
    };
    this.mouseLastPosition = {
      x: 0.0,
      y: 0.0
    };
    this.mouseDelta = {
      x: 0.0,
      y: 0.0
    };
    
    var myself = this;
    document.addEventListener('keydown', function(e) { myself.onKeyDown(e); }, false);
    document.addEventListener('keyup', function(e) { myself.onKeyUp(e); }, false);
    canvas.addEventListener('mousedown', function(e) { myself.onMouseDown(e); }, false);
    canvas.addEventListener('mouseup', function(e) { myself.onMouseUp(e); }, false);
    canvas.addEventListener('mousemove', function(e) { myself.onMouseMove(e); }, false);
    canvas.addEventListener('mousewheel', function(e) { myself.onMouseWheel(e); }, false);
    canvas.addEventListener('DOMMouseScroll', function(e) { myself.onMouseWheel(e); }, false);
  };
  
  /**
   * Handles the 'keydown' event, if supplied.
   * @param {Event} e Information about the event occured.
   */
  Canvas.prototype.onKeyDown = function(e){
    this.keysDown[e.keyCode] = true;
    this.events.onKeyDown(e);
  };

  /**
   * Handles the 'keyup' event, if supplied.
   * @param {Event} e Information about the event occured.
   */  
  Canvas.prototype.onKeyUp = function(e){
    this.keysDown[e.keyCode] = false;
    this.events.onKeyUp(e);
  };

  /**
   * Handles the 'mousedown' event, if supplied.
   * @param {Event} e Information about the event occured.
   */   
  Canvas.prototype.onMouseDown = function(e){
    var x = e.clientX, y = this.canvas.height - e.clientY - 1;
    
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseLastPosition.x = x;
    this.mouseLastPosition.y = y;
    this.mouseDelta.x = 0.0;
    this.mouseDelta.y = 0.0;
    this.mouseDown[e.button] = true;
    
    this.events.onMouseDown(e, x, y);
  };

  /**
   * Handles the 'mouseup' event, if supplied.
   * @param {Event} e Information about the event occured.
   */   
  Canvas.prototype.onMouseUp = function(e){
    var x = e.clientX, y = this.canvas.height - e.clientY - 1;
    
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseLastPosition.x = x;
    this.mouseLastPosition.y = y;
    this.mouseDelta.x = 0.0;
    this.mouseDelta.y = 0.0;
    this.mouseDown[e.button] = false;
    
    this.events.onMouseUp(e, x, y);
  };

  /**
   * Handles the 'mousemove' event, if supplied.
   * @param {Event} e Information about the event occured.
   */   
  Canvas.prototype.onMouseMove = function(e){
    var x = e.clientX, y = this.canvas.height - e.clientY - 1;
    
    this.mouseLastPosition.x = this.mousePosition.x;
    this.mouseLastPosition.y = this.mousePosition.y;
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseDelta.x = this.mousePosition.x - this.mouseLastPosition.x;
    this.mouseDelta.y = this.mousePosition.y - this.mouseLastPosition.y;
    
    this.events.onMouseMove(e, this.mouseDelta.x, this.mouseDelta.y);
  };

  /**
   * Handles the 'mousewheel' event, if supplied.
   * @param {Event} e Information about the event occured.
   */     
  Canvas.prototype.onMouseWheel = function(e) {
    var x = e.clientX, y = this.canvas.height - e.clientY - 1, delta = 0;
    
    this.mouseLastPosition.x = this.mousePosition.x;
    this.mouseLastPosition.y = this.mousePosition.y;
    this.mousePosition.x = x;
    this.mousePosition.y = y;
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    
    if (!e) {
      e = window.event;
    }
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
      if (window.opera) {
        delta = -delta;
      }
    }
    else if (e.detail){
      delta = -e.detail / 3;
    }
    
    if (delta) {
      this.events.onMouseWheel(e, delta);
    }
  };
  
  return Canvas;
  
}());

BenchGL.namespace('BenchGL.ui.Camera');

BenchGL.ui.Camera = (function() {
	
	// Dependencies
	var Vec3 = BenchGL.math.Vector3,
			MatStack = BenchGL.math.MatrixStack,
			
			// Private properties and methods
      Camera;
	
	/**
	 * Creates a new Camera.
	 * @class Represents a camera with a point of view over a 3D scene.
	 * @param {Object} options The options to set up this Camera.
	 * @param {Number} options.fovy The field of view vertical angle.
	 * @param {Number} options.aspect The aspect ratio.
	 * @param {Number} options.near The near clipping plane.
	 * @param {Number} options.far The far clipping plane.
	 * @param {Number[]} [options.eye] The position vector of this Camera.
	 * @param {Number[]} [options.direction] The viewing direction vector of this Camera.
	 * @param {Number[]} [options.up] The up vector of this Camera. 
	 */
	Camera = function(options) {
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
		this.eye = (e && new Vec3(e.x, e.y, e.z)) || new Vec3(0, 0, 0);
		this.direction = (d && new Vec3(d.x, d.y, d.z)) || new Vec3(0, 0, -1);
		this.up = (u && new Vec3(u.x, u.y, u.z)) || new Vec3(0, 1, 0);
			
    this.projStack = new MatStack();
    this.viewStack = new MatStack();
    this.modelStack = new MatStack();
    
    this.viewStack.lookAt(this.eye, this.direction, this.up);
		this.projStack.perspective(fovy, aspect, near, far);
	};
  
  /**
   * Gets this Camera's projection stack.
   * @returns {MatrixStack} A projection matrix stack.
   */
  Camera.prototype.proj = function() {
    return this.projstack;
  };
  
	/**
	 * Gets this Camera's view stack.
	 * @returns {MatrixStack} A view matrix stack
	 */
  Camera.prototype.view = function() {
    return this.viewStack;
  };
  
	/**
	 * Gets this Camera's model stack.
	 * @returns {MatrixStack} A model matrix stack
	 */  
  Camera.prototype.model = function() {
    return this.modelStack;
  };

  /**
   * Gets the projection matrix of this Camera.
   * @returns {Matrix4} A matrix representing a projective transformation.
   */  
  Camera.prototype.projMatrix = function() {
    return this.projStack.top();
  };

  /**
   * Gets the view matrix of this Camera.
   * @returns {Matrix4} A matrix representing a transformation from world to camera space.
   */  
  Camera.prototype.viewMatrix = function() {
    return this.viewStack.top();
  };
  
  /**
   * Gets the model matrix of this Camera.
   * @returns {Matrix4} A matrix representing a common transformation to apply to the scene.
   */
  Camera.prototype.modelMatrix = function() {
    return this.modelStack.top();
  };

	/**
	 * Gets the modelView matrix of this Camera.
	 * @returns {Matrix4} A matrix representing the full tranformation from object to camera space.
	 */
  Camera.prototype.modelViewMatrix = function() {
    return this.viewStack.top().multiplyMat4(this.modelStack.top());
  };
  
  /**
   * Resets this Camera, loading identity matrices on top of the view and model stacks.
   */
  Camera.prototype.reset = function() {
    this.viewStack.loadIdentity();
    this.modelStack.loadIdentity();
  };
	
	/**
	 * Updates this Camera's local reference frame.
	 */
	Camera.prototype.update = function() {
		this.viewStack.lookAt(this.eye, this.direction, this.up);
	};
	
	return Camera;
	
}());

BenchGL.namespace('BenchGL.ui.Logger');

BenchGL.ui.Logger = (function() {
  
  // Private properties and methods
  var instance, 
  		Logger;

  Logger = function Logger() {
    if (instance) {
      return instance;
    }
    instance = this;
  };
  
  Logger.prototype.log = function(message) {
    console.log(message);
  };

	return Logger;
	
}());

BenchGL.namespace('BenchGL.ui.Timer');

BenchGL.ui.Timer = (function() {

	// Private properties and methods
	var nowTime = 0,
			lastTime = 0,
			elapsedTime = 0,
      Timer;

	Timer = function() {
		this.fps = 0;
		this.lastDelta = 0;
		this.maxSamples = 50;
		this.samples = [];
	};
	
	Timer.prototype.start = function() {
		nowTime = new Date().getTime();
		lastTime = nowTime;
		elapsedTime = 0;
		return this;
	};
	
	Timer.prototype.stop = function() {
		var now = new Date().getTime(),
        sample, i, l, fps = 0;
		
    lastTime = nowTime;
		nowTime = now;
		elapsedTime = nowTime - lastTime;
		sample = 1000.0 / elapsedTime;
				
		if (this.samples.unshift(sample) > this.maxSamples) {
      this.samples.pop();     
    }
		
		for (i = 0, l = this.samples.length; i < l; i++) {
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
	
	return Timer;
	
}());

// worker.js
// Part of the extra module, provides support to Web Workers.

BenchGL.namespace('BenchGL.extra.WorkerPool');

BenchGL.extra.WorkerPool = (function() {
	
	// Private properties and methods
	var WorkerPool;
	
  WorkerPool = function(filename, n){
    this.workers = [];
    this.configs = [];
    while (n--) {
      this.workers.push(new Worker(filename));
    }
  };
  
  WorkerPool.prototype.map = function(mapper){
    var i, l;
    for (i = 0, l = this.workers.length; i < l; i++) {
      this.configs.push(mapper(i));
    }
  };
  
  WorkerPool.prototype.reduce = function(reducer, callback, base){
    var total = base,
        l = this.workers.length,
        message = function(e){
          l--;
          if (total === "undefined") {
            total = e.data;
          }
          else {
            reducer(total, e.data);
          }
          if (l === 0) {
            callback(total);
          }
        },
        i, worker;
    
    for (i = 0, l = this.workers.length; i < l; i++) {
      worker = this.workers[i];
      worker.onmessage = message;
      worker.postMessage(this.configs[i]);
    }
  };
  
  WorkerPool.prototype.shutDown = function(){
    var workers = this.workers, 
        worker, i, l;
        
    for (i = 0, l = workers.length; i < l; i++) {
      worker = workers[i];
      worker.terminate();
    }
  };
  
  WorkerPool.prototype.clean = function(){
    this.configs = [];
  };
  
  return WorkerPool;
  
}());

// shader.js
// Module webgl: Offers WebGL shader encapsulation.

BenchGL.namespace('BenchGL.webgl.Shader');

BenchGL.webgl.Shader = (function() {

	// Private properties and methods
	var Shader;
	
	Shader = function(type, source) {
		var shader = gl.createShader(type),
				valid = false,
				log = '';
		
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		
		valid = gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== 0;		
		log += gl.getShaderInfoLog(shader);
		
		this.source = source;
		this.handler = shader;
		this.type = type;
		this.valid = valid;
		this.log = log;
	};
	
	Shader.prototype.destroy = function() {
		gl.deleteShader(this.handler);
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
      "   if (u_useTexture0) {",
			"			fColor = vec4(texture2D(tex0, vec2(v_texcoord.s, v_texcoord.t)).rgb * v_lightFactor, 1.0);",
      "   }",
      " }",
			
			"	gl_FragColor = fColor;",
			"}"
		].join("\n")
	};
	
	return Shader;
	
}());

// program.js
// Module webgl: Gives shader program support.

BenchGL.namespace('BenchGL.webgl.ProgramAttribute');

BenchGL.webgl.ProgramAttribute = (function() {

	// Private properties and methods
  var ProgramAttribute;
  
  ProgramAttribute = function(program, name, type, size, location){
    this.program = program;
    this.name = name;
    this.type = type;
    this.size = size;
    this.location = location;
  };
  
  ProgramAttribute.prototype.setIndex = function(n) {
    gl.bindAttribLocation(this.program.handler, n, this.name);
    this.location = n;
  }; 
  
  ProgramAttribute.prototype.getIndex = function() {
    return this.location;
  };
  
  return ProgramAttribute;
  
}());

BenchGL.namespace('BenchGL.webgl.ProgramUniform');

BenchGL.webgl.ProgramUniform = (function() {

	// Private properties and methods
	var ProgramUniform;
  
  ProgramUniform = function(program, name, type, size, location){
    this.program = program;
    this.name = name;
    this.type = type;
    this.size = size;
    this.location = location;
    this.func = null;
    this.value = null;
    
    switch (type) {
      case gl.BOOL:
        this.func = function(v){
          gl.uniform1i(this.location, v);
        };
        break;
      case gl.BOOL_VEC2:
        this.func = function(v){
          gl.uniform2iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.BOOL_VEC3:
        this.func = function(v){
          gl.uniform3iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.BOOL_VEC4:
        this.func = function(v){
          gl.uniform4iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.INT:
        this.func = function(v){
          gl.uniform1i(this.location, v);
        };
        break;
      case gl.INT_VEC2:
        this.func = function(v){
          gl.uniform2iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.INT_VEC3:
        this.func = function(v){
          gl.uniform3iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.INT_VEC4:
        this.func = function(v){
          gl.uniform4iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.FLOAT:
        this.func = function(v){
          gl.uniform1f(this.location, v);
        };
        break;
      case gl.FLOAT_VEC2:
        this.func = function(v){
          gl.uniform2fv(this.location, new Float32Array(v));
        };
        break;
      case gl.FLOAT_VEC3:
        this.func = function(v){
          gl.uniform3fv(this.location, new Float32Array(v));
        };
        break;
      case gl.FLOAT_VEC4:
        this.func = function(v){
          gl.uniform4fv(this.location, new Float32Array(v));
        };
        break;
      case gl.FLOAT_MAT2:
        this.func = function(v){
          gl.uniformMatrix2fv(this.location, false, v.toFloat32Array());
        };
        break;
      case gl.FLOAT_MAT3:
        this.func = function(v){
          gl.uniformMatrix3fv(this.location, false, v.toFloat32Array());
        };
        break;
      case gl.FLOAT_MAT4:
        this.func = function(v){
          gl.uniformMatrix4fv(this.location, false, v.toFloat32Array());
        };
        break;
      default:
        throw {
          name: "UnknownUniformType",
          message: "The uniform variable type is unknown."
        };
    }
  };
  
  ProgramUniform.prototype.setValue = function(v){
    this.value = v;
    this.func(v);
  };
  
  ProgramUniform.prototype.getValue = function(){
    return this.value;
  };
  
  return ProgramUniform;
  
}());

BenchGL.namespace('BenchGL.webgl.ProgramSampler');

BenchGL.webgl.ProgramSampler = (function() {

	// Private properties and methods
	var ProgramSampler;
  
  ProgramSampler = function(program, name, type, size, location){
    this.program = program;
    this.name = name;
    this.type = type;
    this.size = size;
    this.location = location;
    this.unit = -1;
  };
  
  ProgramSampler.prototype.getUnit = function(){
    return this.unit;
  };
  
  ProgramSampler.prototype.setUnit = function(n){
    gl.uniform1i(this.location, n);
    this.unit = n;
  };
  
  return ProgramSampler;
  
}());

BenchGL.namespace('BenchGL.webgl.Program');

BenchGL.webgl.Program = (function() {

	// Dependencies
	var Shader = BenchGL.webgl.Shader, 
      ProgramAttribute = BenchGL.webgl.ProgramAttribute,
      ProgramUniform = BenchGL.webgl.ProgramUniform,
      ProgramSampler = BenchGL.webgl.ProgramSampler,
      XHR = BenchGL.io.XHRequest,
      
      // Private properties and methods
      Program;
  
  Program = function(vertex, fragment){
    var program = gl.createProgram(), 
    		valid = false, log = '';
    
    gl.attachShader(program, vertex.handler);
    gl.attachShader(program, fragment.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Compiled succesfully!\n";
    }
    else {
      log += "Compilation error: ";
      log += gl.getProgramInfoLog(program);
      log += "\n";
    }
    
    this.vertex = vertex;
    this.fragment = fragment;
    this.handler = program;
    this.valid = valid;
    this.log = log;
    
    this.attributes = {};
    this.uniforms = {};
    this.samplers = {};
    
    this.buffers = {};
    this.cachedBuffers = {};
    
    this.build();
  };
  
  Program.prototype.build = function(){
    var program = this.handler, 
        attributes = this.attributes, 
        uniforms = this.uniforms, 
        samplers = this.samplers, 
        attributesCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES), 
        uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS),
        a, u, location, attribute, uniform, sampler, i;
    
    for (i = 0; i < attributesCount; ++i) {
      a = gl.getActiveAttrib(program, i);
      if (a) {
        location = gl.getAttribLocation(program, a.name);
        attribute = new ProgramAttribute(this, a.name, a.type, a.size, location);
        attributes[a.name] = attribute;       
      }
    }
    
    for (i = 0; i < uniformsCount; ++i) {
      u = gl.getActiveUniform(program, i);
      if (u) {
        location = gl.getUniformLocation(program, u.name);
        if (u.type === gl.SAMPLER_2D || u.type === gl.SAMPLER_CUBE) {
          sampler = new ProgramSampler(this, u.name, u.type, u.size, location);
          samplers[u.name] = sampler;
        }
        else {
          uniform = new ProgramUniform(this, u.name, u.type, u.size, location);
          uniforms[u.name] = uniform;
        }
      }
    }
    
    return this;
  };
  
  Program.prototype.setVertexShader = function(shader){
    var program = this.handler,
        valid = false, 
        log = '';
    
    gl.detachShader(program, this.vertex.handler);
    gl.attachShader(program, shader.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Recompiled succesfully!\n";
    }
    else {
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
    this.buffers = {};
        
    this.build();
    
    return this;
  };
  
  Program.prototype.setFragmentShader = function(shader){
    var program = this.handler, 
        valid = false, 
        log = '';
    
    gl.detachShader(program, this.fragment.handler);
    gl.attachShader(program, shader.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Recompiled succesfully!\n";
    }
    else {
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
    this.buffers = {};
        
    this.build();
    
    return this;
  };
  
  Program.prototype.setShaders = function(vertex, fragment){
    var program = this.handler, 
        valid = false, 
        log = '';
    
    gl.detachShader(program, this.vertex.handler);
    gl.detachShader(program, this.fragment.handler);
    gl.attachShader(program, vertex.handler);
    gl.attachShader(program, fragment.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Recompiled succesfully!\n";
    }
    else {
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
    this.buffers = {};
        
    this.build();
    
    return this;
  };
  
  Program.prototype.link = function(){
    gl.linkProgram(this.handler);
  };
  
  Program.prototype.destroy = function(){
  	gl.deleteProgram(this.handler);
    this.vertex.destroy();
    this.fragment.destroy();
  };
  
  Program.prototype.bind = function(){
    gl.useProgram(this.handler);
  };
  
  Program.prototype.unbind = function(){
    gl.useProgram(null);
  };
  
  Program.prototype.bindAttribute = function(name, options) {
    options = $.mix({
      attributeType : gl.ARRAY_BUFFER,
      dataType : gl.FLOAT,
      drawType : gl.STATIC_DRAW,
      size : 1,
      stride : 0,
      offset : 0
    }, this.cachedBuffers[name] || {}, options || {});
    
    var attributeName = options.name || name,
        attributeType = options.attributeType,
        dataType = options.dataType,
        drawType = options.drawType,
        size = options.size,
        stride = options.stride,
        offset = options.offset,
        data = options.data,
        hasBuffer = name in this.buffers,
        buffer = hasBuffer ? this.buffers[name] : gl.createBuffer(),
        hasData = 'data' in options,
        index = this.attributes[attributeName] && this.attributes[attributeName].getIndex(),
        isAttribute = index !== undefined;
    
    if (!hasBuffer) {
      this.buffers[name] = buffer;
      isAttribute && gl.enableVertexAttribArray(index);
    }

    gl.bindBuffer(attributeType, buffer);
    
    if (hasData) {
      gl.bufferData(attributeType, data, drawType);
    }
    
    isAttribute && gl.vertexAttribPointer(index, size, dataType, false, stride, offset);
    
    delete options.data;
    this.cachedBuffers[name] = options;
    
    return this;
  };
  
  Program.prototype.bindAttributes = function(mapping){
    for (var name in mapping) {
      this.bindAttribute(name, mapping[name]);
    }
    return this;
  };
  
  Program.prototype.bindUniform = function(name, value){
    if (this.uniforms[name]) {
      this.uniforms[name].setValue(value);
    }
    return this;
  }; 
  
  Program.prototype.bindUniforms = function(mapping){
    for (var name in mapping) {
      this.bindUniform(name, mapping[name]);
    }
    return this;
  };
  
  Program.prototype.bindSampler = function(name, value){
    if (this.samplers[name]) {
      this.samplers[name].setUnit(value);
    }
    return this;
  };
  
  Program.prototype.bindSamplers = function(mapping){
    for (var name in mapping) {
      this.bindSampler(name, mapping[name]);
    }
    return this;
  };
  
  Program.factory = function(options){
    var type = (options && options.type) || 'defaults', 
        method = 'From' + $.capitalize(type);
    
    if (typeof Program[method] !== "function") {
      throw {
        name: "UnknownProgramType",
        message: "Type '" + method + "' does not exist."
      };
    }
    
    return Program[method](options);
  };
  
  Program.FromUrls = function(options){
    options = $.mix({
      vertex: '',
      fragment: '',
      onSuccess: $.empty,
      onError: $.empty
    }, options || {});
    
    new XHR({
      url: options.vertex,
      onError: function(e){
        options.onError(e);
      },
      onSuccess: function(vs){
        new XHR({
          url: options.fragment,
          onError: function(e){
            options.onError(e);
          },
          onSuccess: function(fs){
            options.onSuccess(Program.FromSources({
              vertex: vs,
              fragment: fs
            }));
          }
        }).send();
      }
    }).send();
  };
  
  Program.FromScripts = function(options){
    var vs = options.vertex, 
        fs = options.fragment, 
        vertex = new Shader(gl.VERTEX_SHADER, $(vs).innerHTML), 
        fragment = new Shader(gl.FRAGMENT_SHADER, $(fs).innerHTML);
    return new Program(vertex, fragment);
  };
  
  Program.FromSources = function(options){
    var vs = options.vertex, 
        fs = options.fragment, 
        vertex = new Shader(gl.VERTEX_SHADER, vs), 
        fragment = new Shader(gl.FRAGMENT_SHADER, fs);
    return new Program(vertex, fragment);
  };
  
  Program.FromDefaults = function(options){
    var vs = (options && $.capitalize(options.vertex)) || 'Default', 
        fs = (options && $.capitalize(options.fragment)) || 'Default', 
        vertex = new Shader(gl.VERTEX_SHADER, Shader.Vertex[vs]), 
        fragment = new Shader(gl.FRAGMENT_SHADER, Shader.Fragment[fs]);
    return new Program(vertex, fragment);
  };
  
  return Program;
  
}());

// model.js
// Modeule drawing: Provides a Model object to create and manipulate shapes.

BenchGL.namespace('BenchGL.drawing.Model');

BenchGL.drawing.Model = (function() {
  
  // Dependencies
  var MatStack = BenchGL.math.MatrixStack,
      Mat = BenchGL.skin.Material,
      XHR = BenchGL.io.XHRequest,
      sin = Math.sin,
      cos = Math.cos,
      pi = Math.PI,
      id = 0,
      
      // Private properties and methods
      Model;
  
  Model = function(options) {
    options = $.mix({
      drawType : gl.TRIANGLES,
      useColors : true,
      dynamic : true,
      colors : [1, 1, 1, 1]
    }, options || {});
    
    this.id = options.id || id++;
    this.drawType = options.drawType;
    this.useColors = options.useColors;
    this.dynamic = options.dynamic;
    this.vertices = options.vertices;
    this.normals = options.normals;
    this.texcoords = options.texcoords;
    this.colors = options.colors;
    this.indices = options.indices;
    
    this.material = new Mat();
    this.uniforms = {};
    this.textures = [];
    
    this.matrixStack = new MatStack();
        
    if (this.useColors) {
      this.normalizeColors();
    }
  };
  
  Model.prototype.matrix = function() {
  	return this.matrixStack.top();
  };
  
  Model.prototype.reset = function() {
    this.matrixStack.loadIdentity();
  };
  
  Model.prototype.translate = function(x, y, z) {
    this.matrixStack.translate(x, y, z);
  };
  
  Model.prototype.scale = function(x, y, z) {
    this.matrixStack.scale(x, y, z);
  };
  
  Model.prototype.rotate = function(angle, x, y, z) {
    this.matrixStack.rotate(angle, x, y, z);
  };
  
  Model.prototype.rotateXYZ = function(rx, ry, rz) {
    this.matrixStack.rotateXYZ(rx, ry, rz);
  };  
  
  Model.prototype.normalizeColors = function() {
    if (!this.vertices) return;
    
    var colors = this.colors,
        totalLength = this.vertices.length * 4 / 3,
        count = totalLength / colors.length,
        result = new Float32Array(totalLength);
    
    if (colors.length < totalLength) {
      while (count--) {
        result.set(colors, count * colors.length);
      }
      this.colors = result;
    }    
  };
  
  Model.prototype.setTextures = function() {
    var textures = this.textures;
    for (var i = 0, l = arguments.length; i < l; i ++) {
      textures.push(arguments[i]);
    }
  };

  Model.prototype.setMaterialAmbient = function(r, g, b) {
    this.material.setAmbient(r, g, b);
  };
    
  Model.prototype.setMaterialDiffuse = function(r, g, b) {
    this.material.setDiffuse(r, g, b);    
  };
  
  Model.prototype.setMaterialSpecular = function(r, g, b) {
    this.material.setSpecular(r, g, b);    
  };
  
  Model.prototype.setMaterialEmissive = function(r, g, b) {
    this.material.setEmissive(r, g, b);    
  };

  Model.prototype.setMaterialShininess = function(shininess) {
    this.material.setShininess(shininess);
  };   
  
  Model.prototype.setUniform = function(name, value) {
    this.uniforms[name] = value;
  };
  
  Model.prototype.bindVertices = function(program, update) {
    if (!this.vertices) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-vertices', {
        name: 'a_position',
        data: new Float32Array(this.vertices),
        size: 3
      });
    } else {
      program.bindAttribute(this.id + '-vertices');
    }
  };
  
  Model.prototype.bindNormals = function(program, update) {
    if (!this.normals) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-normals', {
        name : 'a_normal',
        data : new Float32Array(this.normals),
        size : 3
      });          
    } else {
      program.bindAttribute(this.id + '-normals');
    }
  };
  
  Model.prototype.bindTexcoords = function(program, update) {
    if (!this.texcoords) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-texcoords', {
        name: 'a_texcoord',
        data: new Float32Array(this.texcoords),
        size: 2
      });
    } else {
      program.bindAttribute(this.id + '-texcoords');
    }
  };

  Model.prototype.bindColors = function(program, update) {
    if (!this.colors || !this.useColors) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-colors', {
        name : 'a_color',
        data: new Float32Array(this.colors),
        size: 4
      });
    } else {
      program.bindAttribute(this.id + '-colors');
    }
  };
   
  Model.prototype.bindIndices = function(program, update) {
    if (!this.indices) return;
    
    if (update || this.dynamic) {
	    program.bindAttribute(this.id + '-indices', {
	      attributeType : gl.ELEMENT_ARRAY_BUFFER,
	      data : new Uint16Array(this.indices),
	    });
    } else {
    	program.bindAttribute(this.id + '-indices');
    }
  };
  
  Model.prototype.bindUniforms = function(program) {
    program.bindUniforms(this.uniforms);
  };
  
  Model.prototype.bindMaterial = function(program) {
    var material = this.material,
        uniforms = {};
    
    uniforms.u_matAmbient = material.ambient.toRGBAArray();
    uniforms.u_matDiffuse = material.diffuse.toRGBAArray();
    uniforms.u_matSpecular = material.specular.toRGBAArray();
    uniforms.u_matEmissive = material.emissive.toRGBAArray();
    uniforms.u_matShininess = material.shininess;
    
    program.bindUniforms(uniforms);
  };
  
  Model.prototype.bindTextures = function(program, textures) {
    var names = this.textures;
    for (i = 0, l = names.length; i < l; i++) {
      var texture = textures[names[i]];
      if (texture) {
        program.bindUniform('u_useTexture' + i, true);
        program.bindSamplers('tex' + i, i);
        texture.bind(i);
      }
    }
    this.textures = [];
  };
  
  Model.prototype.draw = function() {
    if (this.indices) {
      // Draw the model with as an indexed vertex array
      gl.drawElements(this.drawType, this.indices.length, gl.UNSIGNED_SHORT, 0);
    } else if (this.vertices) {
      // Draw the model with as a simple flat vertex array
      gl.drawArrays(this.drawType, 0, this.vertices.length / 3);
    }
  };
  
  Model.factory = function(type, options){
    type = $.capitalize(type);
    
    if (typeof Model[type] !== "function") {
      throw {
        name: "UnknownModelType",
        message: "Method '" + type + "' does not exist."
      };
    }
    
    return Model[type](options);
  };
  
  Model.Triangle = function(options){
    return new Model($.mix({
      vertices: [0, 1, 0, -1, -1, 0, 1, -1, 0],
      normals: [0, 0, 1, 0, 0, 1, 0, 0, 1],
      texcoords: [1, 1, 0, 0, 1, 0],
      colors: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }, options || {}));
  };
  
  Model.Rectangle = function(options){
    return new Model($.mix({
      vertices: [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0],
      normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      texcoords: [0, 0, 1, 0, 0, 1, 1, 1],
      colors: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      indices: [0, 1, 2, 3, 1, 2]
    }, options || {}));
  };
  
  Model.Circle = function(options){
    var n = (options) ? options.slices || 16 : 16, 
        r = (options) ? options.radius || 1 : 1, 
        vertexCoords = [0, 0, 0], 
        normalCoords = [0, 0, 1], 
        textureCoords = [0.5, 0.5],
        i, angle, x, y, u, v;
    
    for (i = 0; i <= n; i++) {
      angle = pi * i / n;
      x = r * cos(angle);
      y = r * sin(angle);
      u = (cos(angle) + 1) * 0.5;
      v = (sin(angle) + 1) * 0.5;
      
      vertexCoords.push(x);
      vertexCoords.push(y);
      vertexCoords.push(0);
      normalCoords.push(0);
      normalCoords.push(0);
      normalCoords.push(1);
      textureCoords.push(u);
      textureCoords.push(v);
    }
    
    return new Model($.mix({
      drawType : gl.TRIANGLE_FAN,
      vertices: vertexCoords,
      normals: normalCoords,
      texcoords: textureCoords,
      colors: [1, 1, 1, 1]
    }, options || {}));
  };
  
  Model.Cube = function(options){
    return new Model($.mix({
      vertices: [
      -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
      -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
      -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
      1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
      -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1],
      normals: [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0],
      texcoords: [
      0, 0, 1, 0, 1, 1, 0, 1,
      1, 0, 1, 1, 0, 1, 0, 0,
      0, 1, 0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0, 1, 0,
      1, 0, 1, 1, 0, 1, 0, 0,
      0, 0, 1, 0, 1, 1, 0, 1 ],
      colors: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
    }, options || {}));
  };
  
  Model.Pyramid = function(options){
    return new Model($.mix({
      vertices: [
      0, 1, 0, -1, -1, 1, 1, -1, 1,
      0, 1, 0, 1, -1, -1, -1, -1, -1,
      0, 1, 0, 1, -1, 1, 1, -1, -1,
      0, 1, 0, -1, -1, -1, -1, -1, 1],
      normals: [
      0, 1, 0, -1, -1, 1, 1, -1, 1,
      0, 1, 0, 1, -1, -1, -1, -1, -1,
      0, 1, 0, 1, -1, 1, 1, -1, -1,
      0, 1, 0, -1, -1, -1, -1, -1, 1],
      texcoords: [
      1, 1, 0, 0, 1, 0,
      1, 1, 0, 0, 1, 0,
      1, 1, 0, 0, 1, 0,
      1, 1, 0, 0, 1, 0],
      colors: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }, options || {}));
  };
  
  Model.Sphere = function(options){
    var n = (options) ? options.slices || 32 : 32, 
        m = (options) ? options.stacks || 32 : 32, 
        r = (options) ? options.radius || 1.0 : 1.0, 
        vertexCoords = [], 
        normalCoords = [],
        textureCoords = [], 
        indices = [],
        pi2 = pi * 2,
        i, j, theta, phi, sint, cost, sinp, cosp,
        x, y, z, u, v, first, second;
    
    for (i = 0; i <= n; i++) {
      theta = pi * i / n;
      sint = sin(theta);
      cost = cos(theta);
      for (j = 0; j <= m; j++) {
        phi = pi2 * j / m;
        sinp = sin(phi);
        cosp = cos(phi);
        x = r * sint * cosp;
        y = r * cost;
        z = r * sint * sinp;
        u = 1 - j / m;
        v = 1 - i / n;
        
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
    
    for (i = 0; i < n; i++) {
      for (j = 0; j < m; j++) {
        first = i * (m + 1) + j;
        second = first + m + 1;
        
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);
        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
    }
    
    return new Model($.mix({
      vertices: vertexCoords,
      normals: normalCoords,
      texcoords: textureCoords,
      colors: [1.0, 1.0, 1.0, 1.0],
      indices: indices
    }, options || {}));
  };
  
  Model.Json = function(options){
    var modelOptions = options.model,
        model;
    
    new XHR({
      url: options.url,
      async: false,
      onSuccess: function(response){
        var json = JSON.parse(response), 
            options = $.mix({
              vertices: json.vertexPositions,
              normals: json.vertexNormals,
              texcoords: json.vertexTextureCoords,
              indices: json.indices
            }, modelOptions || {});
        
        model = new Model(options);
      }
    }).send();
    
    return model;
  };
  
  return Model;
  
}());

// renderer.js
// Module drawing: Implements the core of the rendering engine.

BenchGL.namespace('BenchGL.drawing.Renderer');

BenchGL.drawing.Renderer = (function() {

	// Dependencies
  var Vec3 = BenchGL.math.Vector3,
      Mat4 = BenchGL.math.Matrix4,
      Color = BenchGL.skin.Color, 
      Material = BenchGL.skin.Material, 
      Light = BenchGL.skin.Light, 
      Texture = BenchGL.skin.Texture, 
      TextureRequest = BenchGL.io.TextureRequest,
      
      // Private properties and methods 
      Renderer;
  
  Renderer = function(program, camera, effects){
    this.program = program;
    this.camera = camera;
    this.effects = effects;
    
    // Background and current color
    this.clearColor = new Color(0, 0, 0, 1);
    
    // Textures
    this.useTexturing = false;
    this.textures = {};
    
    // Ambient Light
    this.ambientColor = new Color(0.2, 0.2, 0.2);
    
    // Lights
    this.useLighting = false;
    this.directionalColor = new Color(0.8, 0.8, 0.8);
    this.lightingDirection = new Vec3(0.0, 0.0, -1.0);
    this.lights = {};
    
    // Saved models
    this.models = [];
  };
  
  Renderer.prototype.background = function(){
    var color = this.clearColor;
    
   	gl.clearColor(color.r, color.g, color.b, color.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
  };
  
  Renderer.prototype.useLights = function(lighting){
    this.useLighting = lighting;
  };
  
  Renderer.prototype.useTextures = function(texturing){
    this.useTexturing = texturing;
  };
  
  Renderer.prototype.useAlphaBlending = function(blending, options){
    options = $.mix({
      src: gl.SRC_ALPHA,
      dest: gl.ONE
    }, options || {});
    
    if (blending) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }
  };
  
  Renderer.prototype.setClearColor = function(r, g, b, a){
    this.clearColor = new Color(r, g, b, a);
  };
  
  Renderer.prototype.setAmbientColor = function(r, g, b, a){
    this.ambientColor = new Color(r, g, b, a);
  };
  
  Renderer.prototype.setDirectionalColor = function(r, g, b, a){
    this.directionalColor = new Color(r, g, b, a);
  };
  
  Renderer.prototype.setLightingDirection = function(x, y, z){
    this.lightingDirection = new Vec3(x, y, z).$unit();
  };
  
  Renderer.prototype.addLight = function(name, options){
    this.lights[name] = new Light(options);
  };
  
  Renderer.prototype.addTexture = function(name, options){
    this.textures[name] = new Texture(options);
  };
  
  Renderer.prototype.addTextures = function(options){
  	var myself = this;
  	
    new TextureRequest(options).send(function(name, options) {
    	myself.addTexture(name, options);
    });
  };
  
  Renderer.prototype.setupCamera = function(){
    var program = this.program,
        camera = this.camera;
    
    program.bindUniform('u_projectionMatrix', camera.projMatrix());
    program.bindUniform('u_viewMatrix', camera.viewMatrix());
  };
  
  Renderer.prototype.setupLights = function(){
    var uniforms = {},
        index = 0, l, light;
    
    uniforms.u_enableLighting = this.useLighting;
    uniforms.u_ambientColor = this.ambientColor.toRGBArray();
    uniforms.u_directionalColor = this.directionalColor.toRGBArray();
    uniforms.u_lightingDirection = this.lightingDirection.toArray();
    
    for (l in this.lights) {
      light = this.lights[l];
      uniforms['u_enableLight' + (index + 1)] = light.active;
      uniforms['u_lightPosition' + (index + 1)] = light.position.toArray();
      uniforms['u_lightColor' + (index + 1)] = light.diffuse.toRGBArray();
      uniforms['u_lightSpecularColor' + (index + 1)] = light.specular.toRGBArray();
      index++;
    }
    
    this.program.bindUniforms(uniforms);
  };
  
  Renderer.prototype.setupTextures = function(){
    this.program.bindUniform('u_enableTexturing', this.useTexturing);
  };
  
  Renderer.prototype.setupEffects = function(){
    var effects = this.effects,
        uniforms = {}, 
        e, effect, p, property, value;
    
    for (e in effects) {
      effect = effects[e];
      for (p in effect) {
        property = p.charAt(0).toUpperCase() + p.slice(1);
        value = effect[p];
        uniforms['u_' + e + property] = value;
      }
    }
    
    this.program.bindUniforms(uniforms);
  };
  
  Renderer.prototype.addModels = function() {
    var models = this.models,
        i, l, model;
        
    for (i = 0, l = arguments.length; i < l; i++) {
      model = arguments[i];
      models.push(model);
      
      model.bindVertices(this.program, true);
      model.bindNormals(this.program, true);
      model.bindTexcoords(this.program, true);
      model.bindColors(this.program, true);
      model.bindIndices(this.program, true);
    }
  };
  
  Renderer.prototype.renderModel = function(model){
    var program = this.program,
        camera = this.camera,
        textures = this.textures,
        modelView, i, l, texture;
    
  	model.bindVertices(program);
  	model.bindNormals(program);
  	model.bindTexcoords(program);
  	model.bindColors(program);
  	model.bindIndices(program);
    	
    model.bindMaterial(program);
    model.bindUniforms(program);
    model.bindTextures(program, textures);
    
    // Set modelView and normal matrices
    modelView = camera.modelViewMatrix().multiplyMat4(model.matrix());
    program.bindUniform('u_modelViewMatrix', modelView);
    program.bindUniform('u_normalMatrix', modelView.invert().$transpose());    
    
    model.draw();
  };
  
  Renderer.prototype.renderAll = function() {
    this.setupCamera();
    this.setupLights();
    this.setupTextures();
    this.setupEffects();
    
    for (var i = 0, l = this.models.length; i < l; i++) {
      this.renderModel(this.models[i]);
    }    
  };
  
  return Renderer;
  
}());

BenchGL.drawing.RendereringStrategy = (function() {

	var RenderingStrategy;
	
	RenderingStrategy = function(renderer) {
		this.renderer = renderer;
	};
	
	RenderingStrategy.prototype.renderModel = function(model) {
	
	};
	
	RenderingStrategy.prototype.renderAll = function() {
	
	};
	
	return RenderingStrategy;

}());


// webgl.js

BenchGL.namespace('BenchGL.webgl.WebGL');

BenchGL.webgl.WebGL = (function() {
	
	// Private properties and methods 
	var WebGL;
	
	/**
	 * The WebGL container.
	 * @class Represents a container for the static method that retrieves a WebGL context.
	 */
	WebGL = {};
	
	/**
	 * Tries to retrieve a WebGL, if availale.
	 * @param {String|HTMLCanvasElement} The canvas id or element to leverage.
	 * @param {Object} Options for creating the context.
	 * @returns {WebGLRenderingContext} A WebGL rendering context or null if not available.
	 */
	WebGL.getContext = function(canvas, options) {
		var canvas = typeof canvas === "string" ? $(canvas) : canvas,
				options = options || {},
				gl = canvas.getContext('experimental-webgl', options);
		
		if (!gl) {
			gl = canvas.getContext('webgl', options);
		}
		
		return gl;
	};
	
	return WebGL;

}());
// core.js
// The core module provides the main entry point for the library.

BenchGL.namespace('BenchGL.core.Engine');

BenchGL.core.Engine = (function() {

	// Dependencies
	var WebGL = BenchGL.webgl.WebGL,
			Program = BenchGL.webgl.Program,
			Canvas = BenchGL.ui.Canvas,
			Camera = BenchGL.ui.Camera,
			Renderer = BenchGL.drawing.Renderer,
			instance,
			
			// Private properties
			Engine,
			
			// Private methods
			start = function(program, canvas, camera, effects, callback, debug) {
	    	// Binds the loaded program for rendering
	      program.bind();
	      
	      // Create a renderer
	      renderer = new Renderer(program, camera, effects);
	      
	      if (debug) {
	      	gl.setTracing(true);
	      }
	      
	      // Call the application with library handlers references 
	      callback({
	        gl: gl,
	        canvas: canvas,
	        program: program,
	        camera: camera,
	        renderer: renderer
	      });
	      
	      if (debug) {
	      	gl.setTracing(false);
	      }    
    	};

	/**
	 * Creates an instance of BenchGL. 
	 * @class Provides an entry point for BenchGL library.
	 * @param {String} canvasId The id of the canvas that WebGL exploits.
	 * @param {Object} [options] General options for initializing the library.
	 * @param {Object} [options.context] The options for the WebGL context.
	 * @param {Object} [options.program] The options for the shader program.
	 * @param {String} [options.program.type='defaults'] The type of shader program.
	 * @param {String} [options.program.vertex] The vertex shader source.
	 * @param {String} [options.program.fragment] The fragmente shader source.
	 * @param {String} [options.camera] The options for the camera.
	 * @param {Number} [options.camera.fovy=45] The field of view angle for the camera.
	 * @param {Number} [options.camera.near=0.1] The near clipping plane for the camera.
	 * @param {Number} [options.camera.far=100] The far clipping plane for the camera.
	 * @param {Object} [effects] Special effects for the rendering engine. 
	 * @param {Object} [events] Functions to eventually handle user events.
	 * @param {Boolean} [debug=false] Is debug active?
	 * @param {Function} [onError] Callback function to call on errors.
	 * @param {Function} [onLoad] Callback function to call after loading succesfully. 
	 */
  Engine = function(canvasId, options) {
  	if (instance) {
  		return instance;
  	}
  	
  	instance = this;
  	
    options = $.mix({
      context: {},
      program: {
        type: 'defaults'	// {defaults|urls|scripts|sources}
      },
      camera: {
        fovy: 45,
        near: 0.1,
        far: 100
      },
      effects: {
      	/* 
      	Example:
      	
      	fog : {
      		active : true,
      		color : [0.5, 0.5, 0.5],
      		near : 	10,
      		far : 100
      	}
      	
      	*/      	
      },
      events: {
      	/* 
      	Example:
      	
      	onKeyDown : function() { ... },
      	onMouseMove : function() { ... },
      	
      	*/
      },
      debug: false,
      onError: $.empty,
      onLoad: $.empty
    }, options || {});
    
    var contextOptions = options.context,
        eventsOptions = options.events,
        cameraOptions = options.camera,
        programOptions = options.program,
        effectsOptions = options.effects,
        canvas, program, camera, renderer;
    
    // Create the WebGL context and store it in a library-shared variable.
    gl = WebGL.getContext(canvasId, contextOptions);
    
    if (!gl) {
      options.onError();
      return null;
    }
    
    // Use webgl-trace.js library to trace webgl calls
    if (options.debug && WebGLDebugUtils) {
    	gl = WebGLDebugUtils.makeDebugContext(gl);
    }
    
    // Create a canvas wrapper to handle user events
    canvas = new Canvas(gl.canvas, eventsOptions);
    
    // Create a camera
    camera = new Camera($.mix(cameraOptions, {
      aspect: gl.canvas.width / gl.canvas.height
    }));
    
    // Set up the shader program asynchronously
    program = Program.factory($.mix({
      onSuccess : function(program) {
        start(program, canvas, camera, effectsOptions, function(application) {
          options.onLoad(application);
        }, options.debug);
      },
      onError : function(e) {
        options.onError(e);
      }
    }, programOptions));
    
    // If the program has loaded correctly, call the onLoad callback
    if (program) {
      start(program, canvas, camera, effectsOptions, function(application) {
        options.onLoad(application);
      }, options.debug);
    }
  };
  
 	return Engine;
  
}());

// Framework version
BenchGL.version = '0.1';

// WebGL context container
var gl;

}());
