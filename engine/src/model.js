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

// File type constants
const BGL_MODEL_JSON = 0;
const BGL_MODEL_OBJ = 1;


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
		color				: [1.0, 1.0, 1.0, 1.0],
		primitives	:	{},
		indices			: {}
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
	
	this._pending = [];
	
	this.normalizeColor();
	this.buildMesh();
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
		// Render
		this._mesh.render(program, primitives);
	}
};

Model.fromJSON = function(gl, options) {
	var model = new Model(gl);
	var buildFromJSON = function(response) {
		var data = JSON.parse(response);
		model.setVertices(data.vertexPositions);
		model.setNormals(data.vertexNormals);
		model.setTexcoords(data.vertexTextureCoords);
		model.setIndices('triangles', gl.TRIANGLES, data.indices);
	};
	
	var defaultOptions = {
		async			: true,
		callback	: buildFromJSON
	};
	
	var options = options || {};
	for (var d in defaultOptions) {
		if (typeof options[d] == "undefined") options[d] = defaultOptions[d];
	}	
	
	var response = new XHRequest(options).send();
	
	if (!options.async)
		buildFromJSON(response);
	
	return model;
};

Model.fromOBJ = function(gl, options) {
	var model = new Model(gl);
	var inBackground = true;
	
	if (!inBackground) {
  	var buildFromOBJ = function(response){
			var vertexCoords = [];
			var normalCoords = [];
			var textureCoords = [];
			var indices = [];
			
			var positions = [];
			var normals = [];
			var textures = [];
			var faces = {};
			var index = 0;
			
			var tokens = null;
			var line = "";
			
			var x = y = z = nx = ny = nz = u = v = 0.0;
			var pos = norm = tex = 0;
			var hasPos = hasNorm = hasTex = false;
			
			var lines = response.split("\n");
			for (var l in lines) {
				line = lines[l].replace(/[ \t]+/g, " ").replace(/[\s\s*]$/, "");
				
				if (line.length == 0) continue;
				
				tokens = line.split(' ');
				
				if (tokens[0] == '#') continue;
				
				if (tokens[0] == 'v') {
		  		positions.push(parseFloat(tokens[1]));
		  		positions.push(parseFloat(tokens[2]));
		  		positions.push(parseFloat(tokens[3]));
		  	} else if (tokens[0] == 'vn') {
		  		normals.push(parseFloat(tokens[1]));
		  		normals.push(parseFloat(tokens[2]));
		  		normals.push(parseFloat(tokens[3]));
		  	}	else if (tokens[0] == 'vt') {
		  		textures.push(parseFloat(tokens[1]));
		  		textures.push(parseFloat(tokens[2]));
		  	} else if (tokens[0] == 'f') {
		  		if (tokens.length != 4) continue;
		  		
		  		for (var i = 1; i < 4; i++) {
		  			if (!(tokens[i] in faces)) {
		  				var f = tokens[i].split("/");
		  				
		  				if (f.length == 1) {
		  					pos = parseInt(f[0]) - 1;
		  					tex = pos;
		  					norm = pos;
		  				} else if (f.length == 3) {
		  					pos = parseInt(f[0]) - 1;
		  					tex = parseInt(f[1]) - 1;
		  					norm = parseInt(f[2]) - 1;
		  				} else {
		  					// Error face length not recognized
								break;
							}
								
							if (pos * 3 + 2 < positions.length) {
								hasPos = true;
								x = positions[pos * 3];
								y = positions[pos * 3 + 1];
								z = positions[pos * 3 + 2];
							}
							vertexCoords.push(x);
							vertexCoords.push(y);
							vertexCoords.push(z);
								
							if (norm * 3 + 2 < normals.length) {
								hasNorm = true;
								nx = normals[norm * 3];
								ny = normals[norm * 3 + 1];
								nz = normals[norm * 3 + 2];
							}
							normalCoords.push(nx);
							normalCoords.push(ny);
							normalCoords.push(nz);
								
							if (tex * 2 + 2 < textures.length) {
								hasTex = true;
								u = textures[tex * 2];
								v = textures[tex * 2 + 1];
							}
							textureCoords.push(u);
							textureCoords.push(v);
							
							faces[tokens[i]] = index++;
						}
							
						indices.push(faces[tokens[i]]);
					}	
				} else {
					// Error line type not recognized
				} 
			}
					
			if (hasPos) 
				model.setVertices(vertexCoords);
					
			if (hasNorm) 
				model.setNormals(normalCoords);
					
			if (hasTex) 
				model.setTextures(textureCoords);
					
			if (indices.length > 0) 
				model.setIndices('triangles', gl.TRIANGLES, indices);
		};
			
		var defaultOptions = {
			async: true,
			callback: buildFromOBJ
		};
		
		var options = options || {};
		for (var d in defaultOptions) {
			if (typeof options[d] === "undefined") 
				options[d] = defaultOptions[d];
		}
		
		var response = new XHRequest(options).send();
		
		if (!options.async) 
			buildFromOBJ(response);
	} else {
		var worker = new Worker('workers/loader1.js');
		
		worker.addEventListener('message', function(e) {
			switch (e.data.type) {
	  		case 'vertex':
					model.setVertices(e.data.values);
					break;
				case 'normal':
					model.setNormals(e.data.values);
					break;
				case 'texture':
					model.setTextures(e.data.values);
					break;
				case 'index':
					model.setIndices('triangles', gl.TRIANGLES, e.data.values);
					break;
				default:
					break;
	  	}
		}, false);
		
		worker.postMessage(options);
	}
	
	return model;
};

/**
 * Creates a triangle.
 */
Model.Triangle = function(gl, options) {
	var options = options || {};
	var triangleOptions = {
		vertices : [
	     0.0,  1.0,  0.0,
	    -1.0, -1.0,  0.0,
	     1.0, -1.0,  0.0
		],
		normals : [
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0 
		],
		texcoords : [
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0
		],
		color : [
	    1.0, 1.0, 1.0, 1.0,
	    1.0, 1.0, 1.0, 1.0,
	    1.0, 1.0, 1.0, 1.0			
		],
		primitives : {
			triangles : gl.TRIANGLES
		}	
	};
	
	for (var d in triangleOptions) {
		if (!options[d]) options[d] = triangleOptions[d];
	}
	
	return new Model(gl, options);
};

/**
 * Creates a rectangle.
 */
Model.Rectangle = function(gl, options) {
	var options = options || {};
	var rectangleOptions = {
		vertices : [
			-1.0, -1.0, 0.0,
			 1.0, -1.0, 0.0,
			-1.0,  1.0, 0.0,
			 1.0,  1.0, 0.0
		],
		normals : [
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
		],
		texcoords : [
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,
			1.0, 1.0
		],
		color : [
	    1.0, 1.0, 1.0, 1.0,
	    1.0, 1.0, 1.0, 1.0,
	    1.0, 1.0, 1.0, 1.0,
	    1.0, 1.0, 1.0, 1.0		
		],
		primitives : {
			triangles : gl.TRIANGLES
		},
		indices : {
			triangles : [0, 1, 2, 3, 1, 2]
		}
	}
	
	for (var d in rectangleOptions) {
		if (!options[d]) options[d] = rectangleOptions[d];
	}
	
	return new Model(gl, options);
};

/**
 * Creates a circle.
 * @param {Number} [slices=32] The approximation slices for the circle.
 * @returns {Mesh} A circle mesh.
 */
Model.Circle = function(gl, options) {
	var n = (options) ? options.slices || 16 : 16;
	var r = (options) ? options.radius || 1.0 : 1.0;
	
	var vertexCoords = [0.0, 0.0, 0.0];
	var normalCoords = [0.0, 0.0, 1.0];
	var textureCoords = [0.5, 0.5];
	
	for (var i=0; i<=n; i++) {
		var angle = DPI*i/n;
		var x = r*Math.cos(angle);
		var y = r*Math.sin(angle);
		var u = (Math.cos(angle)+1.0)*0.5;
		var v = (Math.sin(angle)+1.0)*0.5;
		
		vertexCoords.push(x);
		vertexCoords.push(y);
		vertexCoords.push(0.0);
		normalCoords.push(0.0);
		normalCoords.push(0.0);
		normalCoords.push(1.0);
		textureCoords.push(u);
		textureCoords.push(v);
	}
	
	var options = options || {};
	var circleOptions = {
		
		vertices 		:	vertexCoords,
		normals 		: normalCoords,
		texcoords 	: textureCoords,
		color 			: [1.0, 1.0, 1.0, 1.0],
		primitives 	: {
			triangles : gl.TRIANGLE_FAN
		}
	};
	
	for (var d in circleOptions) {
		if (!options[d]) options[d] = circleOptions[d];
	}
	
	return new Model(gl, options);
};

/**
 * Creates a cube.
 */
Model.Cube = function(gl, options) {
	var options = options || {};
	var cubeOptions = {
		vertices : [
			// Front face
			-1.0, -1.0, 1.0,
			 1.0, -1.0, 1.0,
			 1.0,  1.0, 1.0,
			-1.0,  1.0, 1.0,
			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			 1.0,  1.0, -1.0,
			 1.0, -1.0, -1.0,
			// Top Face
			-1.0, 1.0, -1.0,
			-1.0, 1.0,  1.0,
			 1.0, 1.0,  1.0,
			 1.0, 1.0, -1.0,
			// Bottom face
			-1.0, -1.0, -1.0,
			 1.0, -1.0, -1.0,
			 1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,
			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,
			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0
		],
		normals : [
			// Front face
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			// Back face
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			// Top face
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			// Bottom face
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			// Right face
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			// Left face
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0
		],
		texcoords : [
			// Front face
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			// Back face
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,
	    // Top face
	    0.0, 1.0,
	    0.0, 0.0,
	    1.0, 0.0,
	    1.0, 1.0,
	    // Bottom face
	    1.0, 1.0,
	    0.0, 1.0,
	    0.0, 0.0,
	    1.0, 0.0,
	    // Right face
	    1.0, 0.0,
	    1.0, 1.0,
	    0.0, 1.0,
	    0.0, 0.0,
	    // Left face
	    0.0, 0.0,
	    1.0, 0.0,
	    1.0, 1.0,
	    0.0, 1.0
		],
		color : [
			// Front face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Back face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Top Face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Bottom face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Right face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Left face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0
		],
		primitives : {
			triangles : gl.TRIANGLES
		},
		indices : {
			triangles : [
				0, 1, 2, 0, 2, 3,					// Front face
				4, 5, 6, 4, 6, 7,					// Back face
				8, 9, 10, 8, 10, 11,			// Top face
				12, 13, 14, 12, 14, 15,		// Bottom face
				16, 17, 18, 16, 18, 19,		// Right face
				20, 21, 22, 20, 22, 23		// Left face
			]
		}
	};
	
	for (var d in cubeOptions) {
		if (!options[d]) options[d] = cubeOptions[d];
	}
	
	return new Model(gl, options);	
};

/**
 * Creates a pyramid.
 */
Model.Pyramid = function(gl, options) {
	var options = options || {};
	var pyramidOptions = {
		vertices : [
			// Front
			 0.0,  1.0, 0.0,
			-1.0, -1.0, 1.0,
			 1.0, -1.0, 1.0,
			// Back
			 0.0,  1.0,  0.0,
			 1.0, -1.0, -1.0,
			-1.0, -1.0, -1.0,  
			// Right
			0.0,  1.0,  0.0,
			1.0, -1.0,  1.0,
			1.0, -1.0, -1.0,
			// Left
			 0.0,  1.0,  0.0,
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0 
		],
		normals : [
			// Front
			 0.0,  1.0, 0.0,
			-1.0, -1.0, 1.0,
			 1.0, -1.0, 1.0,
			// Back
			 0.0,  1.0,  0.0,
			 1.0, -1.0, -1.0,
			-1.0, -1.0, -1.0,  
			// Right
			0.0,  1.0,  0.0,
			1.0, -1.0,  1.0,
			1.0, -1.0, -1.0,
			// Left
			 0.0,  1.0,  0.0,
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0 		 
		],
		texcoords : [
			// Front
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
			// Back
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,	
			// Right
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,		
			// Left
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0
		],
		color : [
			// Back face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Front Face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Right face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			// Left face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0
		],
		primitives : {
			triangles : gl.TRIANGLES
		}
	};
	
	for (var d in pyramidOptions) {
		if (!options[d]) options[d] = pyramidOptions[d];
	}
	
	return new Model(gl, options);
};

/**
 * Creates a sphere.
 * @param {Number} [slices=32] The longitudinal approximation of the sphere.  
 * @param {Number} [stacks=32] The latitudinal approximation of the sphere.
 */
Model.Sphere = function(gl, options) {
	var n = (options) ? options.slices || 32 : 32;
	var m = (options) ? options.stacks || 32 : 32;
	var r = (options) ? options.radius || 1.0 : 1.0;
	
	var vertexCoords = [];
	var normalCoords = [];
	var textureCoords = [];
	
	for (var i=0; i<=n; i++) {
		var theta = Math.PI*i/n;
		var sinT = Math.sin(theta);
		var cosT = Math.cos(theta);
		for (var j=0; j<=m; j++) {
			var phi = DPI*j/m;
			var sinP = Math.sin(phi);
			var cosP = Math.cos(phi);
			var x = r*sinT*cosP;
			var y = r*cosT;
			var z = r*sinT*sinP;
			var u = 1-j/m;
			var v = 1-i/n;
			var vertex = [r*sinT*cosP, r*cosT, r*sinT*sinP];
			var texcoord = [1-j/m, 1-i/n];
			
			vertexCoords.push(x);
			vertexCoords.push(y);
			vertexCoords.push(z);
			normalCoords.push(x);
			normalCoords.push(y);
			normalCoords.push(z);
			textureCoords.push(u);
			textureCoords.push(v);
		}
	}
	
	var indices = [];
	for (var i=0; i<n; i++) {
		for (var j=0; j<m; j++) {
			var first = i*(m+1)+j;
			var second = first+m+1;
			
			indices.push(first);
			indices.push(second);
			indices.push(first+1);
			indices.push(second);
			indices.push(second+1);
			indices.push(first+1);
		}
	}
	
	return new Model(gl, {
		vertices 		: vertexCoords,
		normals 		: normalCoords,
		texcoords		: textureCoords,
		color 			: [1.0, 1.0, 1.0, 1.0],
		primitives 	: {
			triangles : gl.TRIANGLES
		},
		indices 		: {
			triangles : indices
		}
	});		
};

