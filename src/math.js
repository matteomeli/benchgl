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
