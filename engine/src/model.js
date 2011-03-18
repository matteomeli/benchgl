//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

// Model update states constants
const BGL_UPDATE_VERTEX = 0;
const BGL_UPDATE_NORMAL = 1;
const BGL_UPDATE_TCOORD = 2;
const BGL_UPDATE_COLOR = 3;
const BGL_UPDATE_INDEX = 4;

/**
 * Creates a new Model.
 * @class Represents a geometric mesh.
 * @param {Object} options Contains the 
 */
function Model(gl, options) {
	this.gl = gl;
	
	var options = options || {};
	var defaultOptions = {
		dynamic 		: true,
		vertices		: [],
		normals			: [],
		texcoords		: [],
		primitives	:	{},
		indices			: {},
		color				: [1.0, 1.0, 1.0, 1.0],
		uniforms		: {
			u_shininess	: 0.1
		}
	};
	
	for (var d in defaultOptions) {
		if (typeof options[d] === "undefined") options[d] = defaultOptions[d];
	}
	
	this._mesh = null;
	this._dynamic = options.dynamic;
	this._vertices = options.vertices;
	this._normals = options.normals;
	this._texcoords = options.texcoords;
	this._color = options.color;
	this._primitives = options.primitives;
	this._indices = options.indices;
	this._uniforms = options.uniforms;
	
	this._pending = [];
	
	this.normalizeColor();
	this.buildMesh();
};

Model.prototype = {
	get uniforms() { return this._uniforms; }
};

Model.prototype.buildMesh = function() {
	var mesh = new Mesh(this.gl);
	
	if (this._vertices.length > 0)
		mesh.addAttribute('a_position', 3, false, new Float32Array(this._vertices));
		
	if (this._normals.length > 0)
		mesh.addAttribute('a_normal', 3, false, new Float32Array(this._normals));
		
	if (this._texcoords.length > 0)
		mesh.addAttribute('a_texcoord', 2, false, new Float32Array(this._texcoords));
	
	if (this._color.length > 0)
		mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
	
	for (var i in this._primitives) {
		var primitives = this._primitives[i] || this.gl.TRIANGLES;
		var indices = this._indices[i];
		if (!indices || indices.length == 0) {
			mesh.addFlatTopology(i, primitives, 0, this._vertices.length/3);
		} else {
			mesh.addIndexedTopology(i, primitives, new Uint16Array(indices));
		}
	}	
	
	this._mesh = mesh;
};

/**
 * Sets the vertices of this Model.
 * @param {Number[]} vertices The vertices to set.
 */
Model.prototype.setVertices = function(vertices) {
	this._vertices = vertices;
	this._pending.push(BGL_UPDATE_VERTEX);
	if (this._dynamic) this.updateMesh();
};

/**
 * Sets the normals of this Model.
 * @param {Number} normals The normals to set.
 */
Model.prototype.setNormals = function(normals) {
	this._normals = normals;
	this._pending.push(BGL_UPDATE_NORMAL);
	if (this._dynamic) this.updateMesh();
};

/**
 * Sets the texture coordinates for this Model.
 * @param {Number[]} texcoords The texture coordinates to set.
 */
Model.prototype.setTexcoords = function(texcoords) {
	this._texcoords = texcoords;
	this._pending.push(BGL_UPDATE_TCOORD);
	if (this._dynamic) this.updateMesh();
};

/**
 * Sets the colors for this Model.
 * @param {Number[]} colors The colors to set.
 */
Model.prototype.setColor = function(color) {
	this._color = color;
	this._pending.push(BGL_UPDATE_COLOR);
	if (this._dynamic) this.updateMesh();
};

/**
 * Sets indices for this Model.
 * @param {String} name The name of the index.
 * @param {Number} primitives The primitive WebGL type.
 * @param {Number[]} [values] The values of the index to set.
 */
Model.prototype.setIndices = function(name, primitives, indices) {
	this._indices[name] = indices;
	this._primitives[name] = primitives;
	this._pending.push(BGL_UPDATE_INDEX);
	if (this._dynamic) this.updateMesh();
};

Model.prototype.setUniforms = function(mapping) {
	this._uniforms = mapping;
};

/**
 * Adds one or more vertices to this Model.
 * @param {Number[]} vertices The vertices to add.
 */
Model.prototype.addVertices = function(vertices) {
	for (var i=0; i<vertices.length; i++) {
		this._vertices.push(vertices[i]);
	}
	this._pending.push(BGL_UPDATE_VERTEX);
	if (this._dynamic) this.updateMesh();
};

/**
 * Adds one or more normals to this Model.
 * @param {Number[]} normal The normals to add.
 */
Model.prototype.addNormals = function(normals) {
	for (var i=0; i<normals.length; i++) {
		this._normals.push(normals[i]);
	}
	this._pending.push(BGL_UPDATE_NORMAL);
	if (this._dynamic) this.updateMesh();
};

/**
 * Adds one or more texture coordinates to this Model.
 * @param {Number[]} texcoords The texture coordinates to add.
 */
Model.prototype.addTexcoords = function(texcoords) {
	for (var i=0; i<texcoords.length; i++) {
		this._texcoords.push(texcoords[i]);
	}
	this._pending.push(BGL_UPDATE_TCOORD);
	if (this._dynamic) this.updateMesh();
};

Model.prototype.addIndices = function(name, primitives, indices) {
	if (!this._indices[name]) {
  	this._indices[name] = [];
  	this._primitives[name] = primitives;
	}
	for (var i=0; i<indices.length; i++) {
		this._indices[name].push(indices[i]);
	}
	this._pendingChange = BGL_UPDATE_INDEX;
	if (this._dynamic) this.updateMesh();
};

Model.prototype.setUniform = function(name, value) {
	this._uniforms[name] = value;
};

Model.prototype.normalizeColor = function() {
	if (!this._vertices) return;
	
	var cl = this._vertices.length * 4/3;
	if (this._color && this._color.length < cl) {
		var count = cl / this._color.length;
		var color = this._color;
		var copy = this._color.slice();
		while (count--) {
			color.push(copy[0]);
			color.push(copy[1]);
			color.push(copy[2]);
			color.push(copy[3]);
		}
	}
};

Model.prototype.calculateCentroid = function() {
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	
	if (this._vertices) {
		var l = this._vertices.length;
		for (var i=0; i<l; i+=3) {
			x += this._vertices[i];
			y += this._vertices[i+1];
			z += this._vertices[i+2];
		}
		x /= l;
		y /= l;
		z /= l;
	}
	
	return [x, y, z];
};

/**
 * Updates this Model reflecting its changes to the wrapped Mesh object.
 */
Model.prototype.updateMesh = function() {
	var updates = this._pending;
			
	while (updates.length) {
		var update = updates.shift();
		
  	switch (update) {
  		case BGL_UPDATE_VERTEX:
  			this.normalizeColor();
  			this._mesh.addAttribute('a_position', 3, false, new Float32Array(this._vertices));
				this._mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
				break;
  		case BGL_UPDATE_NORMAL:
				this._mesh.addAttribute('a_normal', 3, false, new Float32Array(this._normals));
  			break;
  		case BGL_UPDATE_TCOORD:
  			this._mesh.addAttribute('a_texcoord', 2, false, new Float32Array(this._texcoords));
				break;
  		case BGL_UPDATE_COLOR:
  			this.normalizeColor();
				this._mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
				break;
  		case BGL_UPDATE_INDEX:
  				for (var i in this._primitives) {
						var primitives = this._primitives[i] || this.gl.TRIANGLES;
						var indices = this._indices[i];
						if (!indices || indices.length == 0) {
							this._mesh.addFlatTopology(i, primitives, 0, this._vertices.length);
						} else {
							this._mesh.addIndexedTopology(i, primitives, new Uint16Array(indices));
						}
					}
					break;
  		default:
  			break;
  	}
  }
};

/**
 * Renders this Model.
 * @param {Program} program The program in the current rendering state.
 * @param {String} primitives The primitives to render.
 */
Model.prototype.render = function(program, primitives) {
	if (!this._dynamic) this.updateMesh();
	if (this._mesh) {
		this._mesh.render(program, primitives);
	}
};

