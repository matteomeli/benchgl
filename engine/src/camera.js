//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

/**
 * Creates a new FreeMovementController.
 * @class Controls the movement of any free 
 * "movable" object with 6 degrees of freedom. 
 */
function FreeMovementController() {
	this.pos = new Vector([0.0, 0.0, 0.0]);
	this.rgt = new Vector([1.0, 0.0, 0.0]);
	this.upv = new Vector([0.0, 1.0, 0.0]);
	this.dir = new Vector([0.0, 0.0, 1.0]);
	this.vel = new Vector([0.0, 0.0, 0.0]);
	this.rotX = this.rotY = this.rotZ = 0.0;
	this.rollSpd = this.pitchSpd = this.yawSpd = 0.0;
	this.quat = Quaternion.Identity();
	//this.view = this.frame.getMatrix(); 
};

FreeMovementController.prototype = {
	get position() { return this.pos; },
	get right() { return this.rgt; },
	get up() { return this.upv; },
	get direction() { return this.dir; },
	get velocity() { return this.vel; },
	
	set position(pos) { this.pos = pos; },
	set right(rgt) { this.rgt = rgt; },
	set up(upv) { this.upv = upv; },
	set direction(dir) { this.dir = dir; },
	
	set rotationSpeedX(sx) { this.rollSpd = sx; },
	set rotationSpeedY(sy) { this.pitchSpd = sy; },
	set rotationSpeedZ(sz) { this.yawSpd = sz; },
	
	addRotationSpeed: function(sx, sy, sz) {
		this.rollSpd += sx;
		this.pitchSpd += sy;
		this.yawSpd += sz;
	},
	
	setRotationSpeed: function(sx, sy, sz) {
		this.rollSpd = sx;
		this.pitchSpd = sy;
		this.yawSpd = sz;	
	},
	
	setRotation: function(rx, ry, rz) {
		this.rotX = rx;
		this.rotY = ry;
		this.rotZ = rz;
	},
	
	update: function(elapsedTime) {
		// Calculate new rotation angles
		this.rotX = this.rollSpd * elapsedTime;
		this.rotY = this.pitchSpd * elapsedTime;
		this.rotZ = this.yawSpeed * elapsedTime;
		
		// Update velocity vector and position
		this.vel = this.dir.scale(elapsedTime);
		this.pos = this.pos.add(this.vel);
		
		// Update the local frame
		this.updateLocalAxis();
	},
	
	updateLocalAxes: function() {
		with (this) {
			// Keep rotations into the range of 360 degrees
			if (rotX > DPI) rotX -= DPI;
			else if (rotX < -DPI) rotX += DPI;
			
			if (rotY > DPI) rotY -= DPI;
			else if (rotY < -DPI) rotY += DPI;
			
			if (rotZ > DPI) rotZ -= DPI;
			else if (rotZ < -DPI) rotZ += DPI;
			
			// Builds a quaternion to represent the current rotation
			var frame = Quaternion.MakeFromEuler(rotX, rotY, rotZ);
			// Add the current rotation
			quat = quat.multiply(frame);
			
			// Get the corresponding view matrix from the quaternion
			var view = quat.getMatrix();
			rgt = view.row(1);
			upv = view.row(2);
			dir = view.row(3); 
		}
	}
};
