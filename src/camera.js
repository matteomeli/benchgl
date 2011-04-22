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
			
    this.projStack = new MatStack();
    this.viewStack = new MatStack();
    this.modelStack = new MatStack();
    
    this.viewStack.lookAt(this.eye, this.direction, this.up);
		this.projStack.perspective(fovy, aspect, near, far);
	};
  
  Camera.prototype.proj = function() {
    return this.projstack;
  };
  
  Camera.prototype.view = function() {
    return this.viewStack;
  };
  
  Camera.prototype.model = function() {
    return this.modelStack;
  };
  
  Camera.prototype.projMatrix = function() {
    return this.projStack.top();
  };
  
  Camera.prototype.viewMatrix = function() {
    return this.viewStack.top();
  };
  
  Camera.prototype.modelViewMatrix = function() {
    return this.viewStack.top().multiplyMat4(this.modelStack.top());
  };
  
  Camera.prototype.reset = function() {
    this.viewStack.loadIdentity();
    this.modelStack.loadIdentity();
  };
	
	Camera.prototype.set = function(options) {
		var e = options.eye,
				d = options.direction,
				u = options.up;
				
		this.eye = (e && new Vec3(e.x, e.y, e.z)) || new Vec3();
		this.direction = (d && new Vec3(d.x, d.y, d.z)) || new Vec3();
		this.up = (u && new Vec3(u.x, u.y, u.z)) || new Vec3(0, 1, 0);
		
		this.viewStack.lookAt(this.eye, this.direction, this.up);
	};
	
	BenchGL.Camera = Camera;
	
}());
