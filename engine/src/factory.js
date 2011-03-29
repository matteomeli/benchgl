//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

// File type constants
const BGL_MODEL_JSON = 0;
const BGL_MODEL_OBJ = 1;

var ModelFactory = (function() {
	var instance = null;
	
	function Factory() {
		
	};
	
	Factory.prototype.createTriangle = function(gl, options) {
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
	
	Factory.prototype.createRectangle = function(gl, options) {
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
	
	Factory.prototype.createCircle = function(gl, options) {
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
	
	Factory.prototype.createCube = function(gl, options) {
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
	
	Factory.prototype.createPyramid = function(gl, options) {
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
	
	Factory.prototype.createSphere = function(gl, options) {
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
	
	Factory.prototype.createModel = function(gl, options) {
		return new Model(gl, options);
	};
	
	Factory.prototype.loadFromJSON = function(gl, options) {
		var model = new Model(gl);
		
		var defaultOptions = {
			async			: true,
			callback	: function(response) {
				var data = JSON.parse(response);
				model.setVertices(data.vertexPositions);
				model.setNormals(data.vertexNormals);
				model.setTexcoords(data.vertexTextureCoords);
				model.setIndices('triangles', gl.TRIANGLES, data.indices);
			}
		};
		
		var options = options || {};
		for (var d in defaultOptions) {
			if (typeof options[d] == "undefined") options[d] = defaultOptions[d];
		}
		
		var response = new XHRequest(options).send();
		
		return model;		
	};
	
	Factory.prototype.loadFromOBJ = function(gl, options) {
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
	
	Factory.prototype.loadFromOBJInBackground = function(gl, options) {
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
	
	Factory.prototype.loadFromOBJsInBackground = function(gl, objs) {
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
	
	return new function() {
		this.getInstance = function() {
			if (instance == null) {
				instance = new Factory();
				instance.constructor = null;
			}
			return instance;
		}
	}
})();
