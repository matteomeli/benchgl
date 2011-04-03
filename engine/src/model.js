//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

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
		useMaterial	: false, 
		vertices		: [],
		normals			: [],
		texcoords		: [],
		primitives	:	{
			triangles : gl.TRIANGLES
		},
		indices			: {
			triangles : []
		},
		color				: [1.0, 1.0, 1.0, 1.0],
		uniforms		: {
			u_shininess	: 0.1,
			u_color			: [1.0, 1.0, 1.0, 1.0]
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
	this._useMaterial = options.useMaterial;
	
	if (!this._useMaterial) {
		this.normalizeColor();
	}
	
	if (this._dynamic) {
  	this.buildMesh();
  }
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
	
	if (this._color.length > 0 && !this._useMaterial)
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

	if (this._dynamic) {
  	this._mesh.addAttribute('a_position', 3, false, new Float32Array(this._vertices));
  	if (!this._useMaterial) {
  		this.normalizeColor();
  		this._mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
  	}
  }
};

/**
 * Sets the normals of this Model.
 * @param {Number} normals The normals to set.
 */
Model.prototype.setNormals = function(normals) {
	this._normals = normals;

	if (this._dynamic) {
    this._mesh.addAttribute('a_normal', 3, false, new Float32Array(this._normals));		
	}
};

/**
 * Sets the texture coordinates for this Model.
 * @param {Number[]} texcoords The texture coordinates to set.
 */
Model.prototype.setTexcoords = function(texcoords) {
	this._texcoords = texcoords;

	if (this._dynamic) {
    this._mesh.addAttribute('a_texcoord', 2, false, new Float32Array(this._texcoords));
	}
};

/**
 * Sets the colors for this Model.
 * @param {Number[]} colors The colors to set.
 */
Model.prototype.setColor = function(color) {
	this._color = color;

  if (this._dynamic) {
    if (!this._useMaterial) {
      this.normalizeColor();
      this._mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
    }
  }
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

	if (this._dynamic) {
    for (var p in this._primitives) {
      var primitives = this._primitives[p] || this.gl.TRIANGLES;
      var indices = this._indices[p];
      if (!indices || indices.length == 0) {
        this._mesh.addFlatTopology(p, primitives, 0, this._vertices.length);
      } else {
        this._mesh.addIndexedTopology(p, primitives, new Uint16Array(indices));
      }
    }
	}
};

/**
 * Adds one or more vertices to this Model.
 * @param {Number[]} vertices The vertices to add.
 */
Model.prototype.addVertices = function(vertices) {
	var newVertices = this._vertices;
	
	for (var i=0; i<vertices.length; i++) {
		newVertices.push(vertices[i]);
	}
	
	this.setVertices(newVertices);
};

/**
 * Adds one or more normals to this Model.
 * @param {Number[]} normal The normals to add.
 */
Model.prototype.addNormals = function(normals) {
  var newNormals = this._normals;
	
	for (var i=0; i<normals.length; i++) {
		newNormals.push(normals[i]);
	}
	
	this.setNormals(newNormals);
};

/**
 * Adds one or more texture coordinates to this Model.
 * @param {Number[]} texcoords The texture coordinates to add.
 */
Model.prototype.addTexcoords = function(texcoords) {
	var newTexcoords = this._texcoords;
	
	for (var i=0; i<texcoords.length; i++) {
		newTexcoords.push(texcoords[i]);
	}
	
	this.setTexcoords(newTexcoords);
};

Model.prototype.addIndices = function(name, primitives, indices) {
	var newIndices = this._indices[name] || [];
	
	for (var i=0; i<indices.length; i++) {
		newIndices.push(indices[i]);
	}

  this.setIndices(name, primitives, newIndices);
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
<<<<<<< .mine
 * Updates this Model reflecting its changes to the wrapped Mesh object.
 */
Model.prototype.updateMesh = function() {
	var updates = this._pending;
			
	while (updates.length) {
		var update = updates.shift();
		
  	switch (update) {
  		case BGL_UPDATE_VERTEX:
  			this._mesh.addAttribute('a_position', 3, false, new Float32Array(this._vertices));
  			if (!this._useMaterial) {
  				this.normalizeColor();
					this._mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
				}
				break;
  		case BGL_UPDATE_NORMAL:
				this._mesh.addAttribute('a_normal', 3, false, new Float32Array(this._normals));
  			break;
  		case BGL_UPDATE_TCOORD:
  			this._mesh.addAttribute('a_texcoord', 2, false, new Float32Array(this._texcoords));
				break;
  		case BGL_UPDATE_COLOR:
  			if (!this._useMaterial) {
  				this.normalizeColor();
					this._mesh.addAttribute('a_color', 4, false, new Float32Array(this._color));
				}
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
	if (!this._dynamic) {
  	this.buildMesh();
  }
	
	this._mesh.render(program, primitives);
};

