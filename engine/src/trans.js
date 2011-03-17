//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

// Stack type constants
const BGL_PROJECTION = 0;
const BGL_VIEW = 1;
const BGL_MODEL = 2;

/**
 * Creates a new MatrixStack.
 * @class Implements a 4x4 matrix stack.
 */
function MatrixStack() {
	this.stack = [];
	this.stack.push(Matrix.Identity(4));
	this.current = 0;
};

/**
 * Getters.
 */
MatrixStack.prototype = {
	get top() { return this.stack[this.current]; },
	get topCopy() { return this.stack[this.current].duplicate(); }
};

/**
 * Pushes a copy of the current matrix onto the stack.
 */
MatrixStack.prototype.push = function() {
	this.stack.push(this.stack[this.current].duplicate());
	this.current++;
};

/**
 * Pops the current matrix from the stack.
 */
MatrixStack.prototype.pop = function() {
	if (this.current > 0) {
		this.stack.pop();
		this.current--;
	}
};

/**
 * Copies this stack in a new one.
 */
MatrixStack.prototype.copy = function() {
	var S = new MatrixStack();
	S.stack = [];
	for (var i=0; i<this.stack.length; i++)
		S.stack.push(this.stack[i].duplicate());
	return S;
};

/**
 * Resets this stack.
 */
MatrixStack.prototype.reset = function() {
	this.current = 0;
	this.stack = [];
	this.stack.push(Matrix.Identity(4));
};

/**
 * Gets the stack length.
 */
MatrixStack.prototype.size = function() {
	return this.stack.length;
};

/**
 * Loads a new matrix on top of the stack.
 * @param {Matrix} matrix The matrix to load.
 */
MatrixStack.prototype.load = function(matrix) {
	var M = matrix.homogenize();
	this.stack[this.current] = M;
};

/**
 * Loads the identity matrix on top of the stack.
 */
MatrixStack.prototype.loadIdentity = function() {
	this.stack[this.current] = Matrix.Identity(4);
};

/**
 * Multiplies the current matrix with the argument matrix
 * and puts the result on top of the stack.
 * @param {Matrix} matrix The matrix to multiply with.
 */
MatrixStack.prototype.multiply = function(matrix) {
	this.stack[this.current] = this.stack[this.current].multiply(matrix);
};

/**
 * Multiplies the current matrix with a rotation matrix
 * built from the arguments.
 * @param {Number} angle The rotation angle.
 * @param {Number} x The x component of the rotation axis.
 * @param {Number} y The y component of the rotation axis.
 * @param {Number} z The z component of the rotation axis.
 */
MatrixStack.prototype.rotate = function(angle, axis) {
	var a = new Vector(axis);
	var rad = angle * Math.PI / 180.0;
	var M = Matrix.Rotation(rad, a).homogenize();
	this.stack[this.current] = this.stack[this.current].multiply(M);
};

/**
 * Multiplies the current matrix with a scale matrix
 * built from the arguments.
 * @param {Number[]} vector The scale vector.
 */	
MatrixStack.prototype.scale = function(vector) {
	var M = Matrix.Scale(vector).homogenize();
	this.stack[this.current] = this.stack[this.current].multiply(M);
};

/**
 * Multiplies the current matrix with a translation matrix
 * built from the arguments.
 * @param {Number[]} vector The translation vector.
 */		
MatrixStack.prototype.translate = function(vector) {
	var M = Matrix.Translation(vector).homogenize();
	this.stack[this.current] = this.stack[this.current].multiply(M);	
};

/**
 * Multiplies the current matrix with a lookAt matrix
 * built from the arguments.
 * @param {Vector} eye The camera eye vector.
 * @param {Vector} center The camera center vector.
 * @param {Vector} up The camera up vector.
 */			
MatrixStack.prototype.lookAt = function(eye, center, up) {
	this.multiply(Matrix.LookAt(eye, center, up));
};

/**
 * Multiplies the current matrix with a orthogonal projection matrix
 * built from the arguments.
 * @param {Number} left The left clipping plane.
 * @param {Number} right The right clipping plane.
 * @param {Number} bottom The bottom clipping plane.
 * @param {Number} top The top clipping plane.
 * @param {Number} near The near clipping plane.
 * @param {Number} far The far clipping plane.
 */			
MatrixStack.prototype.ortho = function(left, right, bottom, top, near, far) {
	this.multiply(Matrix.Ortho(left, right, bottom, top, near, far));
};

/**
 * Multiplies the current matrix with a perspective projection matrix
 * built from the arguments.
 * @param {Number} fovy The field of view angle (degrees) in the y direction.
 * @param {Number} aspect The aspect ratio that determines the fov in the x direction.
 * @param {Number} near The distance of the viewer from the near clipping plane.
 * @param {Number} far The distance of the viewer from the far clipping plane.
 */				
MatrixStack.prototype.perspective = function(fovy, aspect, near, far) {
	this.multiply(Matrix.Perspective(fovy, aspect, near, far));
};

/**
 * Multiplies the current matrix with a frustum matrix
 * built from the arguments.
 * @param {Number} left The left clipping plane.
 * @param {Number} right The right clipping plane.
 * @param {Number} bottom The bottom clipping plane.
 * @param {Number} top The top clipping plane.
 * @param {Number} near The near clipping plane.
 * @param {Number} far The far clipping plane.
 */				
MatrixStack.prototype.frustum = function(left, rigth, bottom, top, near, far) {
	this.multiply(Matrix.Frustum(left, rigth, bottom, top, near, far));
};

/**
 * Creates a new TranformStack.
 * @class Contains a full transform stack.
 * Includes a model, a view and a perspective stack.
 */
function TransformStack() {
	this._model = new MatrixStack();
	this._view = new MatrixStack();
	this._projection = new MatrixStack();
};

TransformStack.prototype = {	
	get model() {
		return this._model;
	},
	
	get view() {
		return this._view;
	},
	
	get projection() {
		return this._projection;
	},
	
	get modelMatrix() {
		return this.model.top;
	},
	
	get modelMatrixTranspose() {
		return this.modelMatrix.transpose();
	},
	
	get modelMatrixInverse() {
		return this.modelMatrix.inverse();
	},
	
	get modelMatrixInverseTranspose() {
		return this.modelMatrixInverse.transpose();
	},
	
	get viewMatrix() {
		return this.view.top;
	},
	
	get viewMatrixTranspose() {
		return this.viewMatrix.transpose();
	},
	
	get viewMatrixInverse() {
		return this.viewMatrix.inverse();
	},
	
	get viewMatrixInverseTranspose() {
		return this.viewMatrixInverse.transpose();
	},
	
	get projectionMatrix() {
		return this.projection.top;
	},
	
	get projectionMatrixTranspose() {
		return this.projectionMatrix.transpose();
	},
	
	get projectionMatrixInverse() {
		return this.projectionMatrix.inverse();
	},
	
	get projectionMatrixInverseTranspose() {
		return this.projectionMatrixInverse.transpose();
	},
	
	get modelViewMatrix() {
		return this.viewMatrix.multiply(this.modelMatrix);
	},
	
	get modelViewMatrixTranspose() {
		return this.modelViewMatrix.transpose();
	},
	
	get modelViewMatrixInverse() {
		return this.modelViewMatrix.inverse();
	},
	
	get modelViewMatrixInverseTranspose() {
		return this.modelViewMatrixInverse.transpose();
	},
	
	get normalMatrix() {
		return this.modelViewMatrixInverseTranspose;
	}	
};

/**
 * Resets this TransformStack.
 */
TransformStack.prototype.reset = function() {
	this._model.reset();
	this._view.reset();
	this._projection.reset();
};

/**
 * Copies this TransformStack.
 * @returns {TransformStack} A new copy of this TransformStack.
 */
TransformStack.prototype.copy = function() {
	var TS = new TransformStack();
	TS._model = this._model.copy();
	TS._view = this._view.copy();
	TS._projection = this._projection.copy();
	return TS;
};

/**
 * Creates a new TransformManager.
 * @class Manages a TransformStack.
 */
function TransformManager() {
	this._stacks = new TransformStack();
	this._currentStack = this._stacks.projection;
};

/**
 * Getters.
 */
TransformManager.prototype = {
	get stacks() { return this._stacks; },
	get currentStack() { return this._currentStack; },
	get model() { return this._stacks.model; },
	get view() { return this._stacks.view; },
	get projection() { return this._stacks.projection; },
	get modelMatrix() { return this._stacks.modelMatrix; },
	get modelMatrixTranspose() { return this._stacks.modelMatrixTranspose; },
	get modelMatrixInverse() { return this._stacks.modelMatrixInverse; },
	get modelMatrixInverseTranspose() { return this._stacks.modelMatrixInverseTranspose; },
	get viewMatrix() { return this._stacks.viewMatrix; },
	get viewMatrixTranspose() { return this._stacks.viewMatrixTranspose; },
	get viewMatrixInverse() { return this._stacks.viewMatrixInverse; },
	get viewMatrixInverseTranspose() { return this._stacks.viewMatrixInverseTranspose; },
	get projectionMatrix() { return this._stacks.projectionMatrix; },
	get projectionMatrixTranspose() { return this._stacks.projectionMatrixTranspose; },
	get projectionMatrixInverse() { return this._stacks.projectionMatrixInverse; },
	get projectionMatrixInverseTranspose() { return this._stacks.projectionMatrixInverseTranspose; },
	get modelViewMatrix() { return this._stacks.modelViewMatrix; },
	get modelViewMatrixTranspose() { return this._stacks.modelViewMatrixTranspose; },
	get modelViewMatrixInverse() { return this._stacks.modelViewMatrixInverse; },
	get modelViewMatrixInverseTranspose() { return this._stacks.modelViewMatrixInverseTranspose; },
	get normalMatrix() { return this._stacks.modelViewMatrixInverseTranspose; }
};

/**
 * Changes the current active stack.
 * @param {Number} type The stack to activate.
 */
TransformManager.prototype.mode = function(type) {
	switch (type) {
		case BGL_PROJECTION:
			this._currentStack = this._stacks.projection;
			break;
		case BGL_VIEW:
			this._currentStack = this._stacks.view;
			break;
		case BGL_MODEL:
			this._currentStack = this._stacks.model;
			break;
		default:
			break;
	}
};

/**
 * Loads the identity matrix on the active stack.
 */
TransformManager.prototype.loadIdentity = function() {
	this._currentStack.loadIdentity();
};

/**
 * Loads a perspective matrix on the active stack.
 * @param {Number} fovy The field of view angle (degrees) in the y direction.
 * @param {Number} aspect The aspect ratio that determines the fov in the x direction.
 * @param {Number} near The distance of the viewer from the near clipping plane.
 * @param {Number} far The distance of the viewer from the far clipping plane.
 */
TransformManager.prototype.perspective = function(fovy, aspect, near, far) {
	this._currentStack.perspective(fovy, aspect, near, far);
};

/**
 * Loads a lookAt matrix on the active stack.
 * @param {Number[]} eye The camera eye vector.
 * @param {Number[]} center The camera center vector.
 * @param {Number[]} up The camera up vector.
 */
TransformManager.prototype.lookAt = function(eye, center, up) {
	this._currentStack.lookAt(eye, center, up);
};

/**
 * Push a copy of the top matrix on the active stack.
 */
TransformManager.prototype.pushMatrix = function() {
	this._currentStack.push();
};

/**
 * Pops out the top matrix of the active stack.
 */
TransformManager.prototype.popMatrix = function() {
	this._currentStack.pop();
};

/**
 * Multiplies the top matrix of the active stack by a rotation matrix.
 * @param {Number} angle The angle of rotation in degrees.
 * @param {Number[]} axis The rotation axis.
 */
TransformManager.prototype.rotate = function(angle, axis) {
	this._currentStack.rotate(angle, axis);
};

/**
 * Multiplies the top matrix of the active stack by a translation matrix.
 * @param {Number} x The x component of translation.
 * @param {Number} y The y component of translation.
 * @param {Number} z The z component of translation.
 */
TransformManager.prototype.translate = function(vector) {
	this._currentStack.translate(vector);
};

/**
 * Multiplies the top matrix of the active stack by a scale matrix.
 * @param {Number} w The x component of scale.
 * @param {Number} h The y component of scale.
 * @param {Number} d The z component of scale.
 */
TransformManager.prototype.scale = function(vector) {
	this._currentStack.scale(vector);
};

/**
 * Multiplies the top matrix of the active stack by a matrix.
 * @param {Matrix} matrix The argument matrix for multiplication.
 */
TransformManager.prototype.multiply = function(matrix) {
	this._currentStack.multiply(matrix);
};

/**
 * Resets the active tranform stack.
 */
TransformManager.prototype.reset = function() {
	this.stacks.reset();
};