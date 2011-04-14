// model.js

(function() {

	var Vec3 = BenchGL.Vector3,
			Mesh = BenchGL.Mesh,
			cos = Math.cos,
			sin = Math.sin,
			pi = Math.PI,
			XHR = BenchGL.XHRequest;

	var Model = function(gl, options) {
		options = $.mix({
			dynamic 		: true,
			colorPerVertex : true,
			vertices		: [],
			normals			: [],
			texcoords		: [],
			color				: [1.0, 1.0, 1.0, 1.0],	
			primitives	:	{
				triangles : {
					type 			: gl.TRIANGLES
				}
			}
		}, options || {});
		
		this.gl = gl;
		this.dynamic = options.dynamic;
		this.colorPerVertex = options.colorPerVertex;
		this.vertices = options.vertices;
		this.normals = options.normals;
		this.texcoords = options.texcoords;
		this.color = options.color;
		this.primitives = options.primitives;
		this.mesh = null;
		
		if (this.dynamic) {
	  	this.buildMesh();
	  }
	};
	
	Model.prototype.buildMesh = function() {
		var vertices = this.vertices,
				normals = this.normals,
				texcoords = this.texcoords,
				color = this.color,
				primitives = this.primitives,
				mesh = new Mesh(this.gl);
		
		if (vertices.length > 0)
			mesh.addAttribute('a_position', 3, false, new Float32Array(vertices));
			
		if (normals.length > 0)
			mesh.addAttribute('a_normal', 3, false, new Float32Array(normals));
			
		if (texcoords.length > 0)
			mesh.addAttribute('a_texcoord', 2, false, new Float32Array(texcoords));
		
		if (this.colorPerVertex && color.length > 0) {
			this.normalizeColor();
			mesh.addAttribute('a_color', 4, false, new Float32Array(color));
		}
		
		for (var p in primitives) {
			var primitives = primitives[p],
					type = primitives.type,
					indices = primitives.indices;
			if (indices && indices.length > 0) {
				mesh.addIndexedTopology(p, type, new Uint16Array(indices));
			} else {
				mesh.addFlatTopology(p, type, 0, vertices.length/3);
			}
		}	
		
		this.mesh = mesh;
	};
	
	Model.prototype.setVertices = function(vertices) {
		if (this.dynamic) {
	  	this.mesh.addAttribute('a_position', 3, false, new Float32Array(vertices));
	  	if (this.colorPerVertex) {
	  		this.normalizeColor();
	  		this.mesh.addAttribute('a_color', 4, false, new Float32Array(this.color));
	  	}
	  }
	  this.vertices = vertices;
	  return this;
	};
	
	Model.prototype.setNormals = function(normals) {	
		if (this.dynamic) {
	    this.mesh.addAttribute('a_normal', 3, false, new Float32Array(normals));		
		}
		this.normals = normals;
		return this;
	};
	
	Model.prototype.setTexcoords = function(texcoords) {
		if (this.dynamic) {
	    this.mesh.addAttribute('a_texcoord', 2, false, new Float32Array(texcoords));
		}
		this.texcoords = texcoords;
		return this;
	};
	
	Model.prototype.setColor = function(color) {
		this.color = color;
	  if (this.dynamic) {
	    if (this.useMaterial) {
	      this.normalizeColor();
	      this.mesh.addAttribute('a_color', 4, false, new Float32Array(this.color));
	    }
	  }
		return this;
	};
	
	Model.prototype.setIndices = function(options) {
		var primitives, type, indices;
		
		for (var o in options) {
			primitives = options[o];
			type = primitives.type || this.gl.TRIANGLES;
			indices = primitives.indices;
			if (this.dynamic) {
	      if (indices && indices.length > 0) {
	      	this.mesh.addIndexedTopology(o, type, new Uint16Array(indices));
	      } else {
	        this.mesh.addFlatTopology(o, type, 0, this.vertices.length/3);
	      }		
			}
			this.primitives[o] = primitives;
		}
		return this;
	};
	
	Model.prototype.normalizeColor = function() {
		var color = this.color,
				factor = this.vertices.length * 4/3;
		
		if (color.length < factor) {
			var count = factor / this.color.length,
					copy = color.slice();
			
			while (--count) {
				color.push(copy[0]);
				color.push(copy[1]);
				color.push(copy[2]);
				color.push(copy[3]);
			}
		}
	};
	
	Model.prototype.calculateCentroid = function() {
		var vertices = this.vertices,
				l = this.vertices.length,
				x = 0.0,
				y = 0.0,
				z = 0.0;
	
		for (var i = 0; i < l; i += 3) {
			x += vertices[i];
			y += vertices[i+1];
			z += vertices[i+2];
		}
		
		x /= l;
		y /= l;
		z /= l;
		
		return new Vec3(x, y, z);
	};
	
	Model.prototype.render = function(program, mode) {
		if (!this.dynamic) {
	  	this.buildMesh();
	  }
		
		this.mesh.render(program, mode);
	};
	
	Model.factory = function(gl, type, options) {
		type = $.capitalize(type);
		
		if (typeof Model[type] !== "function") {
			throw {
				name : "UnknownModelType",
				message : "Method '" + type + "' does not exist."
			};
		}
		
		return Model[type](gl, options);	
	};
	
	
	Model.Triangle = function(gl, options) {
		return new Model(gl, $.mix({
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
				triangles : {
					type : gl.TRIANGLES
				}
			}			
		}, options || {}));		
	};
	
	Model.Rectangle = function(gl, options) {
		return new Model(gl, $.mix({
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
				triangles : {
					type 	: gl.TRIANGLES,
					indices : [0, 1, 2, 3, 1, 2]
				}
			}		
		}, options || {}));		
	};
	
	Model.Circle = function(gl, options) {
		var n = (options) ? options.slices || 16 : 16,
				r = (options) ? options.radius || 1.0 : 1.0,
				vertexCoords = [0.0, 0.0, 0.0],
				normalCoords = [0.0, 0.0, 1.0],
				textureCoords = [0.5, 0.5];
		
		for (var i=0; i<=n; i++) {
			var angle = pi*i/n;
			var x = r*cos(angle);
			var y = r*sin(angle);
			var u = (cos(angle)+1.0)*0.5;
			var v = (sin(angle)+1.0)*0.5;
			
			vertexCoords.push(x);
			vertexCoords.push(y);
			vertexCoords.push(0.0);
			normalCoords.push(0.0);
			normalCoords.push(0.0);
			normalCoords.push(1.0);
			textureCoords.push(u);
			textureCoords.push(v);
		}
		
		return new Model(gl, $.mix({
			vertices 		:	vertexCoords,
			normals 		: normalCoords,
			texcoords 	: textureCoords,
			color 			: [1.0, 1.0, 1.0, 1.0],
			primitives 	: {
				triangles : {
					type : gl.TRIANGLE_FAN
				}
			}		
		}, options || {}));		
	};
	
	Model.Cube = function(gl, options) {
		return new Model(gl, $.mix({
			vertices : [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

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
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,

        // Back face
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,

        // Top face
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,

        // Bottom face
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,

        // Right face
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
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
        0.0, 1.0,
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
				triangles : {
					type  : gl.TRIANGLES,
					indices : [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
					]
				}
			}		
		}, options || {}));			
	};
	
	Model.Pyramid = function(gl, options) {
		return new Model(gl, $.mix({
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
				triangles : {
					type : gl.TRIANGLES
				}
			}		
		}, options || {}));		
	};
	
	Model.Sphere = function(gl, options) {
		var n = (options) ? options.slices || 32 : 32,
				m = (options) ? options.stacks || 32 : 32,
				r = (options) ? options.radius || 1.0 : 1.0,
				vertexCoords = [],
				normalCoords = [],
				textureCoords = [],
				pi2 = pi*2;
		
		for (var i=0; i<=n; i++) {
			var theta = pi*i/n;
			var sinT = sin(theta);
			var cosT = cos(theta);
			for (var j=0; j<=m; j++) {
				var phi = pi2*j/m;
				var sinP = sin(phi);
				var cosP = cos(phi);
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
		
		return new Model(gl, $.mix({
			vertices 		: vertexCoords,
			normals 		: normalCoords,
			texcoords		: textureCoords,
			color 			: [1.0, 1.0, 1.0, 1.0],
			primitives 	: {
				triangles : {
					type 		:	gl.TRIANGLES,
					indices : indices
				}
			}
		}, options || {}));			
	};
	
	Model.Json = function(gl, options) {
		var model;
		
		new XHR({
			url : options.url,
			async : false,
			onSuccess : function(response) {
				var json = JSON.parse(response),
						modelOpt = $.mix({
							vertices : json.vertexPositions,
							normals : json.vertexNormals,
							texcoords : json.vertexTextureCoords,
							primitives : {
								triangles : {
									type : gl.TRIANGLES,
									indices : json.indices
								}
							} 
						}, options.model || {});
				
				model = new Model(gl, modelOpt);
			}
		}).send();
		
		return model;		
	};
	
	Model.Obj = function(gl, options) {
		var model = new Model(gl);
		
		var defaultOptions = {
			async: true,
			callback: function(response){
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
					model.setTexcoords(textureCoords);
						
				if (indices.length > 0) 
					model.setIndices('triangles', gl.TRIANGLES, indices);
			}
		};
		
		var options = options || {};
		for (var d in defaultOptions) {
			if (typeof options[d] === "undefined") 
				options[d] = defaultOptions[d];
		}
		
		var response = new XHRequest(options).send();
		
		return model;	
	};
	
	Model.Objb = function(gl, options) {
		var model = new Model(gl);
		
		var worker = new Worker('../workers/loader1.js');
		
		worker.addEventListener('message', function(e) {
			switch (e.data.type) {
	  		case 'vertex':
					model.setVertices(e.data.values);
					break;
				case 'normal':
					model.setNormals(e.data.values);
					break;
				case 'texture':
					model.setTexcoords(e.data.values);
					break;
				case 'index':
					model.setIndices('triangles', gl.TRIANGLES, e.data.values);
					break;
				default:
					break;
	  	}
		}, false);
		
		worker.postMessage(options);
		
		return model;	
	};
	
	Model.Objs = function(gl, objs) {
		var keys = Object.keys(objs);
		var l = keys.length;
		var models = [];
		for (var i=0; i<l; i++) {
			models.push(new Model(gl));
		}
		
		var workers = new WorkerGroup('../workers/loader2.js', l);
		
		workers.map(function(i) {
			return objs[keys[i]];
		});
		
		workers.reduce(function(result, data) {
			result.push(data);
		}, 
		function(result) {
			console.log(result);
			var i = 0;
			for (var r in result) {
				var model = models[i++];
				var modelData = result[r];
				model.setVertices(modelData.vertexCoords);
				model.setNormals(modelData.normalCoords);
				model.setTexcoords(modelData.textureCoords);
				model.setIndices('triangles', gl.TRIANGLES, modelData.indices);
			}
		}, []);
		
		return models;
	};	
	
	BenchGL.Model = Model;

})();







