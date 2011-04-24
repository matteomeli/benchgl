// math.js
// Provides a 3D-oriented math library to handle Vectors, Matrices and Quaternions.

BenchGL.namespace('BenchGL.math');

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
