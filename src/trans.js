// trans.js

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


