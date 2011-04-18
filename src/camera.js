// camera.js

(function () {
	
	var Vec3 = BenchGL.Vector3,
			MatStack = BenchGL.MatrixStack,
      Camera;
	
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
		this.eye = (e && new Vec3(e.x, e.y, e.z)) || new Vec3();
		this.direction = (d && new Vec3(d.x, d.y, d.z)) || new Vec3();
		this.up = (u && new Vec3(u.x, u.y, u.z)) || new Vec3(0, 1, 0);
			
    this.proj = new MatStack();
    this.view = new MatStack();
    this.model = new MatStack();
    
    this.view.lookAt(this.eye, this.direction, this.up);
		this.proj.perspective(fovy, aspect, near, far);
	};
  
  Camera.prototype.getProj = function() {
    return this.proj.top();
  };
  
  Camera.prototype.getView = function() {
    return this.view.top();
  };
  
  Camera.prototype.getModelView = function() {
    return this.view.top().multiplyMat4(this.model.top());
  };
  
  Camera.prototype.reset = function() {
    this.view.loadIdentity();
    this.model.loadIdentity();
  };
	
	Camera.prototype.set = function(options) {
		var e = options.eye,
				d = options.direction,
				u = options.up;
				
		this.eye = (e && new Vec3(e.x, e.y, e.z)) || new Vec3();
		this.direction = (d && new Vec3(d.x, d.y, d.z)) || new Vec3();
		this.up = (u && new Vec3(u.x, u.y, u.z)) || new Vec3(0, 1, 0);
		
		this.view.lookAt(this.eye, this.direction, this.up);
	};
	
	BenchGL.Camera = Camera;
	
}());
