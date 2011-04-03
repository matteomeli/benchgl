//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function () {
	
	var Vec3 = BenchGL.Vector3,
			MatStack = BenchGL.MatrixStack,
			TransStack = BenchGL.TransformationStack;
	
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
			
		this.transform = new TransStack();
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
