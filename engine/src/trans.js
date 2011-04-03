//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function(){

	var Mat4 = BenchGL.Matrix4,
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
		this.multiply(Mat4.Rotate(angle * pi / 180, new Vec3(x, y, z)));
		return this;
	};
	
	MatrixStack.prototype.rotateXYZ = function(rx, ry, rz) {
		this.multiply(Mat4.RotateXYZ(rx, ry, rz));
		return this;
	};
	
	MatrixStack.prototype.scale = function(vector) {
		this.multiply(Mat4.Scale(vector));
		return this;
	};
	
	MatrixStack.prototype.translate = function(vector) {
		this.multiply(Mat4.Translate(vector));
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
		this.model = new MatrixStack();
		this.view = new MatrixStack();
		this.proj = new MatrixStack();
		this.currentStack = this.proj;
	};
	
	TransformStack.prototype.getModelMatrix = function() {
		return this.model.top;
	};
	
	TransformStack.prototype.getModelMatrixTranspose = function() {
		return this.model.top.transpose();
	};
	
	TransformStack.prototype.getModelMatrixInverse = function() {
		return this.model.top.inverse();
	};
	
	TransformStack.prototype.getModelMatrixInverseTranspose = function() {
		return this.model.top.inverse().$transpose();
	};
	
	TransformStack.prototype.getViewMatrix = function() {
		return this.view.top;
	};
	
	TransformStack.prototype.getViewMatrixTranspose = function() {
		return this.view.top.transpose();
	};
	
	TransformStack.prototype.getViewMatrixInverse = function() {
		return this.view.top.inverse();
	};
	
	TransformStack.prototype.getViewMatrixInverseTranspose = function() {
		return this.view.top.inverse().$transpose();
	};
	
	TransformStack.prototype.getProjectionMatrix = function() {
		return this.proj.top;
	};
	
	TransformStack.prototype.getProjectionMatrixTranspose = function() {
		return this.proj.top.transpose();
	};
	
	TransformStack.prototype.getProjectionMatrixInverse = function() {
		return this.proj.top.inverse();
	};
	
	TransformStack.prototype.getProjectionMatrixInverseTranspose = function() {
		return this.proj.top.inverse().$transpose();
	};
	
	TransformStack.prototype.getModelViewMatrix = function() {
		return this.view.top.multiply(this.model.top);
	};
	
	TransformStack.prototype.getModelViewMatrixTranspose = function() {
		return this.getModelViewMatrix().transpose();
	};
	
	TransformStack.prototype.getModelViewMatrixInverse = function() {
		return this.getModelViewMatrix().inverse();
	};
	
	TransformStack.prototype.getModelViewMatrixInverseTranspose = function() {
		return this.getModelViewMatrix().inverse().$transpose();
	};
	
	TransformStack.prototype.getNormalMatrix = function() {
		return this.getModelViewMatrixInverseTranspose();
	};
	
	TransformStack.prototype.projection = function() {
		this.currentStack = this.proj;
		return this;
	};
	
	TransformStack.prototype.view = function() {
		this.currentStack = this.view;
		return this;
	};
	
	TransformStack.prototype.model = function() {
		this.currentStack = this.model;
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

	TransformStack.prototype.lookAt = function(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
		this.currentStack.lookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz);
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


