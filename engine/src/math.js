//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

const PRECISION = 1e-6;
const DPI = 6.28318531;

/**
 * Creates a new Vector.
 * @class Provides an implementation of a n-dimensional vector and
 * all the relative mathematics. All the functions are indipendent from dimension.
 * @param {Number[]|Vector} elements The array of elements (or another Vector) to build the vector from.
 */
function Vector(ee) {
	this.setElements(ee);
};

Vector.prototype = {
	get xyz() { return this.elements.slice(0, 3); },
	get xyzw() { return this.elements.slice(); },
	get x() { return this.elements[0]; },
	get y() { return this.elements[1]; },
	get z() { return this.elements[2]; },
	get w() { return this.elements[3]; },
};

/**
 * Compares this vector with the argument vector.
 * @param vector A vector to compare.
 * @returns {Boolean} True iff this vector is equal to the argument, false otherwise.
 */
Vector.prototype.eql = function(vector) {
	var n = this.elements.length;
	var v = vector.elements || vector;
	if (n != v.length) return false;
	do {
		if (Math.abs(this.elements[n-1] - v[n-1]) > PRECISION) return false;
	} while (--n);
	return true;
};

/**
 * Constructs a copy of this vector.
 * @returns {Vector} A copy of this vector.
 */
Vector.prototype.duplicate = function() {
	return new Vector(this.elements);
};

/**
 * Sets the elements of this vector.
 * @param {Number[]|Vector} els The array to build the vector.
 */
Vector.prototype.setElements = function(els) {
	this.elements = (els.elements || els).slice();
	return this;
};

/**
 * Gets the i-th element of this vector. The index is 1-based.
 * @param i The index of the element to retrieve.
 * @returns {Number} The i-th element of this vector, or null if i is out of range.
 */
Vector.prototype.e = function(i) {
	return (i < 1 || i > this.elements.length) ? null : this.elements[i-1];
};

/**
 * Gets the dimension of this vector.
 * @returns {Number} The dimension of this vector aka the length of its element array.
 */
Vector.prototype.dimension = function() {
	return this.elements.length;
};

/**
 * Calculates the modulus of this vector.
 * @returns {Number} The modulus of this vector.
 */
Vector.prototype.modulus = function() {
	return Math.sqrt(this.dot(this));
};

/**
 * Calculates the squared modulus of this vector.
 * @returns {Number} The squared modulus of this vector.
 */
Vector.prototype.sqrModulus = function() {
	return this.dot(this);
};

/**
 * Maps a function applied to all the elements of this vector in a new vector.
 * @param {Function} fn The function to apply.
 * @returns {Vector} A new vector with the result of the application of the fn function over this vector.
 */
Vector.prototype.map = function(fn) {
	var els = [];
	var n = this.elements.length, k = n, i;
	do {
		i = k - n;
		els.push(fn(this.elements[i]));
	} while (--n);
	return new Vector(els);
};

/**
 * Negates this vector.
 */
Vector.prototype.negate = function() {
	return this.map(function(x) { return x * -1.0; });
};

/**
 * Builds a new normalized version of this vector.
 * @return {Vector} The normalized version of this vector.
 */
Vector.prototype.normalize = function() {
	var r = this.modulus();
	if (r === 0) return this.duplicate();
	return this.map(function(x) { return x/r; });
};

/**
 * Generates a string representation of this vector.
 * @returns {String} A string that represents this vector.
 */
Vector.prototype.toString = function() {
	return '[' + this.elements.join(', ') + ']';			
};

/**
 * Adds an argument vector to this vector and puts the result in a new one.
 * @param {Number[]|Vector} vector The vector to add.
 * @returns {Vector} The sum vector.
 */
Vector.prototype.add = function(vector) {
	var V = vector.elements || vector;
	var elements = [], i;
	for (i=0; i<this.elements.length; i++) {
		elements.push(this.elements[i] + V[i]);
	}
	return new Vector(elements);
};

/**
 * Subtracts an argument vector to this vector and puts the result in a new one.
 * @param {Number[]|Vector} vector The vector to subtract.
 * @returns {Vector} The suberence vector.
 */		
Vector.prototype.sub = function(vector) {
	var V = vector.elements || vector;
	var elements = [], i;
	for (i=0; i<this.elements.length; i++) {
		elements.push(this.elements[i] - V[i]);
	}
	return new Vector(elements);		
};

/**
 * Scales this vector by a factor and puts the result in a new one.
 * @param {Number} factor The scaling factor.
 * @returns {Vector} A new scaled version of this vector.
 */			
Vector.prototype.scale = function(factor) {
	var elements = [], i;
	for (i=0; i<this.elements.length; i++) {
		elements.push(this.elements[i] * factor);
	}
	return new Vector(elements);			
};

/**
 * Calculates the dot product between this vector and argument vector.
 * The two vector must have the same dimension, otherwise returns null.
 * @param {Number[]|Vector} vector The vector to calculate the dot product with.
 * @returns {Number} The dot product or null.
 */
Vector.prototype.dot = function(vector) {
	var V = vector.elements || vector;
	var product = 0, n = this.elements.length;
	if (n != V.length) return null;
	do { product += this.elements[n-1] * V[n-1]; } while (--n);
	return product;
};

/**
 * Gets the angle between this vector and an argument vector.
 * @param {Number[]|Vector} vector The vector to calculate the angle from.
 * @returns {Number} An angle in radians.
 */
Vector.prototype.angleWith = function(vector) {
	var V = vector.elements || vector;
	if (this.elements.length != V.length) return null;
	var dot = this.dot(vector);
	var mod1 = this.modulus();
	var mod2 = this.modulus();
	return Math.acos(dot/(mod1 * mod2));
};

/**
 * Generates the cross product (in 3D space) vector from this vector and the argument.
 * @param {Number[]|Vector} vector The argument vector.
 * @returns {Vector} A new vector from the cross product.
 */
Vector.prototype.cross = function(vector) {
	var A = this.elements;
	var B = vector.elements || vector;
	if (A.length != 3 || B.length != 3) return null;
	return new Vector([
		A[1]*B[2] - A[2]*B[1],
		A[2]*B[0] - A[0]*B[2],
		A[0]*B[1] - A[1]*B[0]
	]);
};

/**
 * 3D Standard coordinate vectors.
 */
Vector.O = new Vector([0.0, 0.0, 0.0]);
Vector.I = new Vector([1.0, 0.0, 0.0]);
Vector.J = new Vector([0.0, 1.0, 0.0]);
Vector.K = new Vector([0.0, 0.0, 1.0]);

/**
 * Generates a random vector.
 * @param {Number} n The size of the vector.
 */
Vector.Random = function(n) {
	var elements = [];
	do {
		elements.push(Math.random());
	} while (--n);
	return new Vector(elements);
};

/**
 * Generates a zero vector.
 * @param {Number} n The size of the vector.
 */
Vector.Zero = function(n) {
	var elements = [];
	do {
		elements.push(0);
	} while (--n);
	return new Vector(elements);
};


/**
 * Creates a new Matrix.
 * @class Represents a square matrix.
 * @param {Number[][]|Matrix} m The elements (or another Matrix) to build this new matrix from.
 */
function Matrix(m) {
	this.setElements(m);
};

/**
 * Set the elements of this matrix. 
 * If the supplied element is a vector the result matrix will be a single-column matrix.
 * @param {Number[][]|Matrix} m The elements to set.
 */
Matrix.prototype.setElements = function(m) {
	var elements = m.elements || m;
 	var n = elements.length, i;
 	if (typeof(elements[0][0]) != 'undefined') {
 		var m = elements[0].length, j;
 		this.elements = [];
	 	for (i=0; i<n; i++) {
	 		this.elements[i] = [];
	 		for (j=0; j<m; j++) {
	 			this.elements[i].push(elements[i][j]);
	 		}
	 	}
 	} else {
 		this.elements = [];
 		for (i=0; i<elements.length; i++) {
 			this.elements.push([elements[i]]);
 		}
 	}
 	return this;
};

/**
 * Check if this matrix is equal to the argument matrix.
 * @param {Number[][]|Matrix} matrix The matrix to check the equality with.
 * @returns {Boolean} True iff the two matrix are equal element-wise, false otherwise.
 */
Matrix.prototype.eql = function(matrix) {
	var M = matrix.elements || matrix;
	if (typeof(M[0][0]) == 'undefined') {
		M = new Matrix(M).elements;
	}
	if (this.elements.length != M.length ||
			this.elements[0].length != M[0].length) { return false; }
	var n = this.elements.length, i;
	var m = this.elements[0].length, j;
	for (i=0; i<n; i++) {
		for (j=0; j<m; j++) {
			if (Math.abs(this.elements[i][j] - M[i][j]) > PRECISION) return false;
		}
	}
	return true;
};
 
/**
 * Gets the element at row i and column j. The indexes are 1-based.
 * @param {Number} i The row index.
 * @param {Number} j The column index.
 * @returns {Number} The element at position (i,j).
 */
Matrix.prototype.e = function(i, j) {
	if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length)
		return null;
	return this.elements[i-1][j-1];
};
 
/**
 * Gets the i-th row in this matrix as a vector.
 * @param {Number} i The row index. (1-based)
 * @returns {Vector} The i-th row as a new Vector.
 */
Matrix.prototype.row = function(i) {
	return (i < 1 || i > this.elements.length) ? null : new Vector(this.elements[i-1]); 
};
 
/**
 * Gets the j-th column in this matrix as a vector
 * @param {Number} j The column index. (1-based)
 * @returns {Vector} The j-th column as a new Vector.
 */
Matrix.prototype.col = function(j) {
	if (j < 1 || j > this.elements[0].length)
		return null;
	var column = [], n = this.elements.length, i;
	for (i=0; i<n; i++)
		column.push(this.elements[i][j-1]);
	return new Vector(column);
};

/**
 * Gets the number of rows in this matrix.
 * @returns {Number} The number of rows in this Matrix.
 */
Matrix.prototype.rows = function() {
	return this.elements.length;
};

/**
 * Gets the number of columns in this matrix.
 * @returns {Number} The number of columns in this Matrix.
 */
Matrix.prototype.cols = function() {
	return this.elements[0].length;
};

/**
 * Gets the dimensions of this matrix.
 * @returns {Number} The dimensions (rows/columns) of this matrix.
 */
Matrix.prototype.dimensions = function() {
	return {rows: this.elements.length, cols: this.elements[0].length};
};

/**
 * Duplicate this matrix in a new one.
 * @returns {Matrix} A new matrix equal to this matrix.
 */
Matrix.prototype.duplicate = function() {
	return new Matrix(this.elements);
};

/**
 * Maps a function on every element of this matrix on a new matrix.
 * @param {Function} fn The function to apply.
 * @returns {Matrix} A new matrix from the application of the function.
 */
Matrix.prototype.map = function(fn) {
	var elements = [];
	var n = this.elements.length, i;
	var m = this.elements[0].length, j;
	for (i=0; i<n; i++) {
		elements[i] = [];
		for (j=0; j<m; j++) {
			elements[i][j] = fn(this.elements[i][j], i + 1, j + 1);
		}
	}
	return new Matrix(elements);
};

/**
 * Checks if this matrix has the same dimensions of the argument matrix.
 * @matrix {Number[][]|Matrix} matrix The argument matrix.
 * @returns {Boolean} True iif this matrix has the same dimensions of the argument.
 */
Matrix.prototype.hasSameSizeOf = function(matrix) {
	var M = matrix.elements || matrix;
	if (typeof(M[0][0]) == 'undefined') { M = new Matrix(M).elements; }
	return (this.elements.length == M.length && 
					this.elements[0].length == M[0].length);
};

/**
 * Calculates the upper triangular version of this matrix.
 * @returns {Matrix} A new matrix representing the upper triangular version of this matrix.
 */
Matrix.prototype.toUpperTriangular = function() {
	var M = this.duplicate();
	var n = this.elements.length, m = this.elements[0].length, i, j;
	for (i=0; i<n; i++) {
		if (M.elements[i][i] == 0) {
			// Switch it with another row
			var temp, k;
			for (k=i+1; k<n; k++) {
				if (M.elements[k][i] != 0) {
					// Can't switch rows to keep the determinant, just sum them.
					var els = [];
					for (j=0; j<m; j++) {
						els.push(M.elements[i][j] + M.elements[k][j]);
					}
					M.elements[i] = els;
					break;
				}
			}
		}
		if (M.elements[i][i] != 0) {
			var k;
			for (k=i+1; k<n; k++) {
				if (M.elements[k][i] != 0) {
					var coefficient = - M.elements[k][i] / M.elements[i][i];
					for (j=0; j<m; j++) {
						M.elements[k][j] += M.elements[i][j] * coefficient;
					}
				}
				}
		}
	}
	return M;
};

/**
 * Checks if this matriz is a square matrix.
 * @returns {Boolean} True iff this matrix is squared, false otherwise.
 */		
Matrix.prototype.isSquare = function() {
	return (this.elements.length == this.elements[0].length);
};

/**
 * Finds the determinant of this matrix.
 * @returns {Number} The value of this matrix determinant.
 */
Matrix.prototype.determinant = function() {
	if (!this.isSquare()) return null;
	var M = this.toUpperTriangular();
	var n = M.elements.length, i, det = 1;
	for (i=0; i<n; i++) {
		det *= M.elements[i][i];
	}
	return det;
};

/**
 * Cheack if this matrix is singular.
 * A matrix is singular if it's a square matrix and the determinant is 0.
 * @returns {Boolean} True iff this matrix is not singular, false otherwise.
 */
Matrix.prototype.isSingular = function() {
	return (this.isSquare() && this.determinant() === 0);
};

/**
 * Augment this matrix on the right with the argument matrix.
 * @param {Number[][]|Matrix} matrix The matrix to attach to this matrix.
 * @returns {Matrix} A new matrix build upon this matrix with the argument matrix attached.
 */
Matrix.prototype.augment = function(matrix) {
	var M = matrix.elements || matrix;
	if (typeof(M[0][0]) == 'undefined') { return M = new Matrix(M).elements; }
	var T = this.duplicate();
	var n = T.elements.length, i;
	if (n != M.length) return null;
	for (i=0; i<n; i++) {
		T.elements[i] = T.elements[i].concat(M[i]);
	}
	return T;
};

/**
 * Generates a string representation of this matrix.
 * @returns {String} A string that represents this matrix.
 */
Matrix.prototype.toString = function() {
	var rows = [];
	var n = this.elements.length, i;
	for (i=0; i<n; i++) {
  	rows.push(new Vector(this.elements[i]).toString());
	}
	return rows.join('\n');
};

/**
 * Adds this matrix and the argument in a new matrix.
 * @param {Number[][]|Matrix} matrix The argument matrix to add.
 * @returns {Matrix} The sum matrix.
 */
Matrix.prototype.add = function(matrix) {
	var M = matrix.elements || matrix;
	if (typeof(M[0][0]) == 'undefined') { M = new Matrix(M).elements; }
	if (!this.hasSameSizeOf(M)) return null;
	return this.map(function(x, i, j) { return x + M[i-1][j-1]; });
};

/**
 * Subtracts the argument matrix from this matrix.
 * @param {Number[][]|Matrix} matrix The argument matrix to subtract.
 * @returns {Matrix} The suberence matrix.
 */
Matrix.prototype.subtract = function(matrix) {
	var M = matrix.elements || matrix;
	if (typeof(M[0][0]) == 'undefined') { M = new Matrix(M).elements; }
	if (!this.hasSameSizeOf(M)) return null;
	return this.map(function(x, i, j) { return x - M[i-1][j-1]; });
};

/**
 * Check if this matrix can multiply from the left the argument.
 * @param {Number[][]|Matrix} matrix The argument to multiply by.
 * @returns {Boolean} True iff this.column is equal to matrix.rows
 */
Matrix.prototype.canMultiply = function(matrix) {
	var M = matrix.elements || matrix;
	if (typeof(M[0][0]) == 'undefined') { M = new Matrix(M).elements; }
	return (this.elements[0].length == M.length);		
};

/**
 * Multiply this matrix by the argument.
 * @param {Number|Number[][]|Vector|Matrix} matrix The argument can be a scalar, 
 * a vector or a matrix. If the argument is a scalar just multiply it on all the elements.
 * @returns {Matrix|Vector} The result of the multiplication on a new matrix or a new vector.
 */
Matrix.prototype.multiply = function(operand) {
	if (!operand.elements) { // The argument is a scalar
		return this.map(function(x, i, j) { return x * operand; });
	}
	var isVector = operand.cross ? true : false;
	var M = operand.elements || operand;
	if (typeof(M[0][0]) == 'undefined') { M = new Matrix(M).elements; }
	if (!this.canMultiply(M)) return null;
	var elements = [];
	var n = this.elements.length, i;
	var m = this.elements[0].length, j;
	for (i=0; i<n; i++) {
		elements[i] = [];
		for (j=0; j<m; j++) {
			var sum = 0, k;
			for (k=0; k<n; k++) {
				sum += this.elements[i][k] * M[k][j];
			}
			elements[i][j] = sum;
		}
	}
	var M = new Matrix(elements);
	return isVector ? M.col(1) : M;
};
 
/**
 * Transposes the elements of this matrix.
 * @returns {Matrix} A new transposed matrix.
 */
Matrix.prototype.transpose = function() {
	var n = this.elements.length, i;
	var m = this.elements[0].length, j;
	var els = [];
	for (j=0; j<m; j++) {
		els[j] = [];
		for (i=0; i<n; i++) {
			els[j].push(this.elements[i][j]);
		}
	}
	return new Matrix(els);
};
 
/**
 * Inverts this matrix.
 * @returns {Matrix} A new inverted matrix.
 */
Matrix.prototype.inverse = function() {
	if (!this.isSquare() || this.isSingular()) return null;
	var n = this.elements.length, i;
	var M = this.augment(Matrix.Identity(n)).toUpperTriangular();
	var m = M.elements[0].length, j;
	var inv_els = [];
	for (i=n-1; i>=0; i--) {
		// 1) Normalize the diagonal elements to 1
		var els = [];
		inv_els[i] = [];
		var divisor = M.elements[i][i];
		for (j=0; j<m; j++) {
			var new_el = M.elements[i][j] / divisor;
			els.push(new_el);
			if (j>=n) inv_els[i].push(new_el);
		}
		M.elements[i] = els;
		// 2) Subtract this row from each row above to
		// gain the identity matrix on the left hand side
		for (var k=0; k<i; k++) {
			var els = [];
			for (var l=0; l<m; l++) {
				els.push(M.elements[k][l] - M.elements[i][l] * M.elements[k][i]);
			}
			M.elements[k] = els;
		}
	}
	return new Matrix(inv_els);
};

/**
 * Embed this matrix in a 4 dimensional homogeneous coordinate system
 * if needed and possible.
 * @returns {Matrix} A new matrix embedded in an homogeneous space.
 */
Matrix.prototype.homogenize = function() {
	if (this.elements.length == 4 && this.elements[0].length == 4)
		return this.duplicate();
		
	if (this.elements.length > 4 || this.elements[0].length > 4)
		return null;
	
	var M = this.duplicate();
	for (var i = 0; i < M.elements.length; i++) {
    for (var j = M.elements[i].length; j < 4; j++) {
    	if (i == j)
      	M.elements[i].push(1.0);
      else
      	M.elements[i].push(0.0);
    }
	}

	for (var i = M.elements.length; i < 4; i++) {
    if (i == 0)
    	M.elements.push([1.0, 0.0, 0.0, 0.0]);
    else if (i == 1)
    	M.elements.push([0.0, 1.0, 0.0, 0.0]);
    else if (i == 2)
    	M.elements.push([0.0, 0.0, 1.0, 0.0]);
    else if (i == 3)
    	M.elements.push([0.0, 0.0, 0.0, 1.0]);
	}
	return M;
};

/**
 * Generates a flat version (1d array) of this matrix.
 * The resulting array is in column-major order.
 * @returns {Number[]} A flattened representation of this matrix.
 */
Matrix.prototype.flatten = function() {
	var ret = [];
	var n = this.elements.length, i;
	var m = this.elements[0].length, j;
	for (j=0; j<m; j++)
		for (i=0; i<n; i++)
			ret.push(this.elements[i][j]);
	return ret;
};

/**
 * Generate an identity matrix.
 * @param {Number} n The size of the matrix.
 */
Matrix.Identity = function(n) {
	var elements = [], i, j;
	for (i=0; i<n; i++) {
		elements[i] = [];
		for (j=0; j<n; j++) {
			if (i==j)
				elements[i][j] = 1.0;
			else
				elements[i][j] = 0.0;
		}
	}
	return new Matrix(elements);
};

/**
 * Generates a generic 3D rotation matrix around an axis, if supplied.
 * If the axis is not supplied it's assumed to be in 2D.
 * @param {Number} angle The angle of rotation.
 * @param {Vector} axis The axis of the rotation.
 */
Matrix.Rotation = function(angle, axis) {
	if (!axis) {
		return new Matrix([
			[Math.cos(angle), -Math.sin(angle)],
			[Math.sin(angle), Math.cos(angle)]
		]);
	}
	var naxis = axis.normalize();
	var x = naxis.e(1);
	var y = naxis.e(2);
	var z = naxis.e(3);
	var s = Math.sin(angle), c = Math.cos(angle), t = 1 - c;
	return new Matrix([
		[  t*x*x + c, t*x*y - z*s, t*x*z + y*s],
		[t*x*y + z*s,   t*y*y + c, t*y*z - x*s],
		[t*x*z - y*s, t*y*z + x*s,   t*z*z + c]
	]);
};

/**
 * Generates a 3D rotation matrix around the X axis.
 * @param {Number} angle The angle of rotation.
 */
Matrix.RotationX = function(angle) {
	var c = Math.cos(angle), s = Math.sin(angle);
	return new Matrix([
		[1.0, 0.0, 0.0],
		[0.0,   c,  -s],
		[0.0,		s,	 c],
	]);
};

/**
 * Generates a 3D rotation matrix around the Y axis.
 * @param {Number} angle The angle of rotation.
 */
Matrix.RotationY = function(angle) {
	var c = Math.cos(angle), s = Math.sin(angle);
	return new Matrix([
		[  c, 0.0,   s],
		[0.0, 1.0, 0.0],
		[ -s,	0.0,	 c],
	]);
};

/**
 * Generates a 3D rotation matrix around the Z axis.
 * @param {Number} angle The angle of rotation.
 */
Matrix.RotationZ = function(angle) {
	var c = Math.cos(angle), s = Math.sin(angle);
	return new Matrix([
		[  c,  -s, 0.0],
		[	 s,   c, 0.0],
		[0.0, 0.0, 1.0],
	]);
};

/**
 * Generates a translation matrix.
 * @param {Number[]|Vector} v The translation vector.
 */
Matrix.Translation = function(v) {
	var V = v.elements || v;
	var n = V.length, i;
	var T = Matrix.Identity(n);
	for (i=0; i<n; i++) {
		T.elements[i][n] = V[i];
	}
	return T;
};

/**
 * Generates a scale matrix.
 * @param {Number[]|Vector} v The scale vector.
 */
Matrix.Scale = function(v) {
	var V = v.elements || v;
	var n = V.length, i;
	var T = Matrix.Identity(n);
	for (i=0; i<n; i++) {
		if (v[i]!=0)
			T.elements[i][i] *= V[i];
	}
	return T;
};

/**
 * Generates a lookup matrix, like OpenGL's gluLookAt.
 * @param {Vector} eye The eye vector  
 * @param {Vector} center The direction vector.
 * @param {Vector} up The up vector.
 */
Matrix.LookAt = function(eye, center, up) {
	var e = new Vector(eye),
			c = new Vector(center),
			u = new Vector(up);
	var x, y, z;
	z = e.sub(c).normalize();
	x = u.cross(z).normalize();
	y = z.cross(x);
	
	return new Matrix([
		[x.x, x.y, x.z, -x.dot(eye)],
		[y.x, y.y, y.z, -y.dot(eye)],
		[z.x, z.y, z.z, -z.dot(eye)],
		[0.0, 0.0, 0.0, 1.0]
	]);
};

/**
 * Generates a matrix for orthogonal projection, lige OpenGL's glOrtho.
 * @param {Number} left The left clipping plane.
 * @param {Number} right The right clipping plane.
 * @param {Number} bottom The bottom clipping plane.
 * @param {Number} top The top clipping plane.
 * @param {Number} near The far clipping plane.
 * @param {Number} near The far clipping plane.
 */
Matrix.Ortho = function(left, right, bottom, top, near, far) {
	// Compose the projection as a translation followed by a scale
	var tv = new Vector([
		-(left + right)/2.0, 
		-(bottom + top)/2.0, 
		-(near + far)/2.0
	]);
	var sv = new Vector([
		2.0/(right-left), 
		2.0/(top-bottom), 
		-2.0/(far-near)
	]);
	
	var T = Matrix.Translation(tv).homogenize();
	var S = Matrix.Scale(sv).homogenize();
	
	return S.multiply(T);
};

/**
 * Generates a perspective matrix, using Matrix.Frustum.
 * @param {Number} fovy The field of view angle in the y direction
 * @param {Number} aspect The aspect ratio determines the field of view angle in the x direction.
 * @param {Number} near The near clipping plane.
 * @param {Number} far The far clipping plane.
 */
Matrix.Perspective = function(fovy, aspect, near, far) {
	var ymax = near * Math.tan(fovy * Math.PI / 360.0);
	var ymin = -ymax;
	var xmin = ymin * aspect;
	var xmax = ymax * aspect;

	return Matrix.Frustum(xmin, xmax, ymin, ymax, near, far);
};

/**
 * Sets up a projection matrix, like OpenGL's glFrustum.
 * @param {Number} left The left clipping plane.
 * @param {Number} right The right clipping plane.
 * @param {Number} bottom The bottom clipping plane.
 * @param {Number} top The top clipping plane.
 * @param {Number} near The far clipping plane.
 * @param {Number} near The far clipping plane.
 */
Matrix.Frustum = function(left, right, bottom, top, near, far) {
	var X = 2.0*near/(right-left);
	var Y = 2.0*near/(top-bottom);
	var A = (right+left)/(right-left);
	var B = (top+bottom)/(top-bottom);
	var C = -(far+near)/(far-near);
	var D = -(2.0*far*near)/(far-near);
	
	return new Matrix([
		[  X, 0.0,    A, 0.0],
		[0.0,   Y,    B, 0.0],
		[0.0, 0.0,    C,   D],
		[0.0, 0.0, -1.0, 0.0]
	]);
};

/**
 * Generates a random square matrix.
 * @param {Number} n The size of the matrix.
 */
Matrix.Random = function(n) {
	var elements = [], i, j;
	for (i=0; i<n; i++) {
		elements[i] = [];
		for (j=0; j<n; j++) {
			elements[i][j] = Math.random();
		}
	}
	return new Matrix(elements);
};

/**
 * Generates a zero matrix.
 * @param {Number} n The size of the matrix.
 */
Matrix.Zero = function(n) {
	var elements = [], i, j;
	for (i=0; i<n; i++) {
		elements[i] = [];
		for (j=0; j<n; j++) {
			elements[i][j] = 0.0;
		}
	}
	return new Matrix(elements);
};


/**
 * Creates a new Quaternion.
 * @class Represents a quaternion in 4D space. The general form for a quaternion
 * is q = [w, v], where w is a scalar value and v is a 3D vector. 
 * If no arguments are passed to the constructor an "identity" quaternion is returned.
 * @param {Number} w The real part of the quaternion.
 * @param {Vector} v The vector of the imaginary parts.
 */
function Quaternion(w, v) {
	if (!w || !v) {
		this.w = 1.0;
		this.v = Vector.Zero(3).elements;
	} else {
		this.w = w;
		this.v = (v.elements || v).slice();
	}
};

/**
 * Multiplies this quaternion with the argument.
 * @param {Quaternion} q The argument quaternion.
 * @returns {Quaternion} A new quaternion with the result of the multiplication.
 */
Quaternion.prototype.multiply = function(q) {
	var Q = Quaternion.Identity();
	Q.w    = this.w*q.w - this.v[0]*q.v[0] - this.v[1]*q.v[1] - this.v[2]*q.v[2];
	Q.v[0] = this.w*q.v[0] + this.v[0]*q.w + this.v[1]*q.v[2] - this.v[2]*q.v[1];
	Q.v[1] = this.w*q.v[1] + this.v[1]*q.w + this.v[2]*q.v[0] - this.v[0]*q.v[2];
	Q.v[2] = this.w*q.v[2] + this.v[2]*q.w + this.v[0]*q.v[1] - this.v[1]*q.v[0];
	return Q;
};

/**
 * Calculates the transformation matrix from this quaternion.
 * @returns {Matrix} A transformation matrix
 */
Quaternion.prototype.getMatrix = function() {
	var X = this.v[0]*this.v[0];
	var Y = this.v[0]*this.v[0];
	var Z = this.v[0]*this.v[0];
	var xy = this.v[0]*this.v[1];
	var xz = this.v[0]*this.v[2];
	var yz = this.v[1]*this.v[2];
	var wx = this.w*this.v[0];
	var wy = this.w*this.v[1];
	var wz = this.w*this.v[2];
	return new Matrix([
		[1-2*Y-2*Z, 2*xy-2*wz, 2*wy+2*xz],
		[2*xy+2*wz, 1-2*X-2*Z, 2*yz-2*wx],
		[2*xz-2*wy, 2*wx+2*yz, 1-2*X-2*Y]
	]);
};

/**
 * Generates a string representation of this quaternion.
 */
Quaternion.prototype.toString = function() {
	return '[' + w + ', (' + this.v.join(', ')  + ')]';
};

/**
 * Generates the identity quaternion.
 */
Quaternion.Identity = function() {
	return new Quaternion();
};

/**
 * Creates a new quaternion from Euler angles.
 * @param {Number} pitch The angle around the x coordinate.
 * @param {Number} yaw The angle around the y coordinate.
 * @param {Number} roll The angle around the z coordinate. 
 */
Quaternion.MakeFromEuler = function(pitch, yaw, roll) {
	var w, v = [];
	var x = pitch * 0.5;
	var y = yaw * 0.5;
	var z = roll * 0.5;
  var cX = Math.cos(x), sX = Math.sin(x);
  var cY = Math.cos(y), sY = Math.sin(y);
  var cZ = Math.cos(z), sZ = Math.sin(z);
  w = cX*cY*cZ + sX*sY*sZ;
  v[0] = sX*cY*cZ - cX*sY*sZ;
  v[1] = cX*sY*cZ + sX*cY*sZ;
  v[2] = cX*cY*sZ - sX*sY*cZ;
  return new Quaternion(w, v);
};
