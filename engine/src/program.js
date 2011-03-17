//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


/**
 * Creates a new ProgramAttribute.
 * @class Wraps an attribute variable in a shader program.
 */
function ProgramAttribute(program, name, type, size, location) {
	this._program = program;
	this._name = name;
	this._type = type;
	this._size = size;
	this._location = location;
};

ProgramAttribute.prototype = {
	/**
	 * Binds this ProgramAttribute to the specified location.
	 * @param {Number} n The location to bind this ProgramAttribute to.
	 */
	set index(n) {
		this._program.gl.bindAttribLocation(this._program.obj, n, this._name);
		this._location = n;
	},
	
	/**
	 * Gets the location of this attribute in the shader program.
	 * @returns {Number} The ProgramAttribute's location.
	 */
	get index() { return this._location; },

	get name() { return this._name; },
	get type() { return this._type; },
	get size() { return this._size; }
};


/**
 * Creates a new ProgramUniform.
 * @class Wraps a uniform variable in a shader program.
 */
function ProgramUniform(program, name, type, size, location) {
	this._program = program;
	this._name = name;
	this._type = type;
	this._size = size;
	this._location = location;		
	this._func = null;
	
	var gl = program.gl;
	
	switch (type) {
		case gl.BOOL:
			this._func = function(v) { gl.uniform1i(this._location, v); };
			break;
		case gl.BOOL_VEC2:
			this._func = function(v) { gl.uniform2iv(this._location, v); };
			break;
		case gl.BOOL_VEC3:
			this._func = function(v) { gl.uniform3iv(this._location, v); };
			break;
		case gl.BOOL_VEC4:
			this._func = function(v) { gl.uniform4iv(this._location, v); };
			break;
		case gl.INT:
			this._func = function(v) { gl.uniform1i(this._location, v); };
			break;
		case gl.INT_VEC2:
			this._func = function(v) { gl.uniform2iv(this._location, v); };
			break;
		case gl.INT_VEC3:
			this._func = function(v) { gl.uniform3iv(this._location, v); };
			break;
		case gl.INT_VEC4:
			this._func = function(v) { gl.uniform4iv(this._location, v); };
			break;
		case gl.FLOAT:
			this._func = function(v) { gl.uniform1f(this._location, v); };
			break;
		case gl.FLOAT_VEC2:
			this._func = function(v) { gl.uniform2fv(this._location, v); };
			break;
		case gl.FLOAT_VEC3:
			this._func = function(v) { gl.uniform3fv(this._location, v); };
			break;
		case gl.FLOAT_VEC4:
			this._func = function(v) { gl.uniform4fv(this._location, v); };
			break;
		case gl.FLOAT_MAT2:
			this._func = function(v) { gl.uniformMatrix2fv(this._location, gl.FALSE, v); };
			break;
		case gl.FLOAT_MAT3:
			this._func = function(v) { gl.uniformMatrix3fv(this._location, gl.FALSE, v); };
			break;
		case gl.FLOAT_MAT4:
			this._func = function(v) { gl.uniformMatrix4fv(this._location, gl.FALSE, v); };
			break;
		default:
			this._func = null;
			break;
	}
};

ProgramUniform.prototype = {
	/**
	 * Gets the ProgramUniform location in the shader program.
	 * @returns {Number} The ProgramUniform's location.
	 */
	get value() { return this._location; },
	
	/**
	 * Binds a value to the ProgramUniform location in the shader program.
	 * @param {Number|Number[]} The value to set.
	 */
	set value(v) {
		this._func(v);
	},
	
	get name() { return this._name; },
	get type() { return this._type; },
	get size() { return this._size; },
	set location(l) { this._location = l; }
};


/**
 * Createa a new ProgramSampler.
 * @class Wraps a sampler variable in a shader program.
 */
function ProgramSampler(program, name, type, size, location) {
	this._program = program;
	this._name = name;
	this._type = type;
	this._size = size;
	this._location = location;
	this._unit = -1;
};

ProgramSampler.prototype = {
	/**
	 * Gets the ProgramSampler unit from the shader program.
	 * @returns {Number} The unit of this ProgramSampler.
	 */
	get unit() {
		return this._unit;
	},
	
	/**
	 * Sets the unit of this ProgramSampler.
	 * @param {Number} n The unit number of this ProgramSampler.
	 */
	set unit(n) {
		this._program.gl.uniform1i(this._location, n);
		this._unit = n;
	},
	
	get name() { return this._name; },
	get type() { return this._type; },
	get size() { return this._size; },
	set location(l) { this._location = l; }
};


/**
 * Creates a new Program.
 * @class Wraps a WebGL program.
 */
function Program(gl, vertex, fragment) {
	this.gl = gl;
	
	this._vertex = vertex;
	this._fragment = fragment;
	
	var prg = gl.createProgram();
	gl.attachShader(prg, vertex.obj);
	gl.attachShader(prg, fragment.obj);
	gl.linkProgram(prg);
	this._obj = prg;
	
	this._valid = gl.getProgramParameter(prg, gl.LINK_STATUS) != 0;
	this._log = "";
	if (this._valid) {
		this._log += "Compiled succesfully!\n"
	} else {
		this._log += "Compilation error: ";
		this._log += gl.getProgramInfoLog(prg);
		this._log += "\n";
	}
	
	this._attributes = {};
	this._uniforms = {};
	this._samplers = {};
	
	this._build();
	this._setupDefaultBindings();
};

/**
 * Getters.
 */
Program.prototype = {
	get attributes() { return this._attributes; },
	get uniforms() { return this._uniforms; },
	get samplers() { return this._samplers; },
	get vertex() { return this._vertex; },
	get fragment() { return this._fragment; },
	get obj() { return this._obj; },
	get isValid() { return this._valid; }
};

/**
 * Builds this Program from the loaded shader sources.
 */
Program.prototype._build = function() {
	var gl = this.gl;
	var prg = this._obj;
	
	// Attributes
	var atts_count = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES);
	var a, loc, attribute;
	for (var i=0; i<atts_count; ++i) {
		a = gl.getActiveAttrib(prg, i);
		if (!a) continue;
		loc = gl.getAttribLocation(prg, a.name);
		attribute = new ProgramAttribute(this, a.name, a.type, a.size, loc);
		this._attributes[a.name] = attribute;
	}
	
	// Uniforms and Samplers
	var unifs_count = gl.getProgramParameter(prg, gl.ACTIVE_UNIFORMS);
	var u, uniform;
	for (var i=0; i<unifs_count; ++i) {
		u = gl.getActiveUniform(prg, i);
		if (!u) continue;
		loc = gl.getUniformLocation(prg, u.name);
		if (u.type == gl.SAMPLER_2D || u.type == gl.SAMPLER_CUBE) {
			var sampler = new ProgramSampler(this, u.name, u.type, u.size, loc);
			this._samplers[u.name] = sampler;
		} else {
			uniform = new ProgramUniform(this, u.name, u.type, u.size, loc);
			this._uniforms[u.name] = uniform;
		}
	}
};

/**
 * Ensures sequences in attributes, uniforms and samplers objects.
 */
Program.prototype._setupDefaultBindings = function() {
	// Setup defaults attributes
	var index = 0;
	for (var a in this._attributes) {
		var attribute = this._attributes[a];
		this.gl.bindAttribLocation(this._obj, index, attribute.name);
		attribute.index = index;
		index++;
	}
	this.gl.linkProgram(this._obj);
	
	// Setup defaults uniforms
	for (var u in this._uniforms) {
		var uniform = this._uniforms[u];
		uniform.location = this.gl.getUniformLocation(this._obj, uniform.name);
	}
	this.gl.useProgram(this._obj);
	
	// Setup defaults samplers
	var unit = 0;
	for (var s in this._samplers) {
		var sampler = this._samplers[s];
		sampler.location = this.gl.getUniformLocation(this._obj, sampler.name);
		sampler.unit = unit;
		unit++;
	}
};

/**
 * Synchronizes the variables locations of this Program.
 */
Program.prototype.synchronize = function() {
	var prg = this._obj;
	var gl = this.gl;
	
	// Syncs attributes locations
	for (a in this._attributes) {
		var attribute = this._attributes[a];
		attribute.location = gl.getAttribLocation(prg, attribute.name);
	}
	
	// Syncs uniforms location
	for (u in this._uniforms) {
		var uniform = this._uniforms[u];
		uniform.location = gl.getUniformLocation(prg, uniform.name);
	}
	
	// Syncs samplers location
	for (s in this._samplers) {
		var sampler = this._samplers[s];
		sampler.location = gl.getAttribLocation(prg, sampler.name);
	}
};

Program.prototype.setVertexShader = function(shader) {
	var gl = this.gl;
	
	gl.detachShader(this._obj, this._vertex.obj);
	gl.attachShader(this._obj, shader.obj);
	gl.linkProgram(this._obj);
	
	this._vertex = shader;
	
	this._valid = gl.getProgramParameter(this._obj, gl.LINK_STATUS) != 0;
	this._log = "";
	if (this._valid) {
		this._log += "Recompiled succesfully!\n"
	} else {
		this._log += "Compilation error: ";
		this._log += gl.getProgramInfoLog(this._obj);
		this._log += "\n";
	}
	
	this._attributes = {};
	this._uniforms = {};
	this._samplers = {};
	
	this._build();
	this._setupDefaultBindings();
};

Program.prototype.setFragmentShader = function(shader) {
	var gl = this.gl;
	
	gl.detachShader(this._obj, this._fragment.obj);
	gl.attachShader(this._obj, shader.obj);
	gl.linkProgram(this._obj);
	
	this._fragment = shader;
	
	this._valid = gl.getProgramParameter(this._obj, gl.LINK_STATUS) != 0;
	this._log = "";
	if (this._valid) {
		this._log += "Recompiled succesfully!\n"
	} else {
		this._log += "Compilation error: ";
		this._log += gl.getProgramInfoLog(this._obj);
		this._log += "\n";
	}
	
	this._attributes = {};
	this._uniforms = {};
	this._samplers = {};
	
	this._build();
	this._setupDefaultBindings();
};

Program.prototype.setShaders = function(vertex, fragment) {
	var gl = this.gl;
	
	gl.detachShader(this._obj, this._vertex.obj);
	gl.detachShader(this._obj, this._fragment.obj);
	gl.attachShader(this._obj, vertex.obj);
	gl.attachShader(this._obj, fragment.obj);
	gl.linkProgram(this._obj);
	
	this._vertex = vertex;
	this._fragment = fragment;
	
	this._valid = gl.getProgramParameter(this._obj, gl.LINK_STATUS) != 0;
	this._log = "";
	if (this._valid) {
		this._log += "Recompiled succesfully!\n"
	} else {
		this._log += "Compilation error: ";
		this._log += gl.getProgramInfoLog(this._obj);
		this._log += "\n";
	}
	
	this._attributes = {};
	this._uniforms = {};
	this._samplers = {};
	
	this._build();
	this._setupDefaultBindings();
};

/**
 * Links this Program.
 */
Program.prototype.link = function() {
	this.gl.linkProgram(this._obj);
};

/**
 * Destroy this Program, deleting the Shaders.
 */
Program.prototype.destroy = function() {
	this.gl.deleteProgram(this._obj);
	this._vertex.destroy();
	this._fragment.destroy();
};

/**
 * Installs this Program as the current rendering state.
 */
Program.prototype.bind = function() {
	this.gl.useProgram(this._obj);
};

/**
 * Uninstall this Program from the current rendering state.
 */
Program.prototype.unbind = function() {
	this.gl.useProgram(null);
};

/**
 * Binds the locations of the attributes in this Program.
 * @param {Object} mapping Contains the attributes to set with their new locations.
 */
Program.prototype.bindAttributes = function(mapping) {
	var attribute = null;
	for (var a in this._attributes) {
		attribute = this._attributes[a];
		if (attribute) {
			attribute.index = mapping[a];
		}
	}
	// Need to relink after attribute binding.
	this.gl.linkProgram(this._obj);
};

/**
 * Binds a value for the uniform in this Program.
 * @param {Object} mapping Contains the uniform to set with their values.
 */
Program.prototype.bindUniforms = function(mapping) {
	var uniform = null;
	for (var u in this._uniforms) {
		uniform = this._uniforms[u];
		if (uniform) {
			uniform.value = mapping[u];
		}
	}
};

/**
 * Binds the samplers in this Program.
 * @param {Object} mapping Contains the samplers to bind with their values.
 */
Program.prototype.bindSamplers = function(mapping) {
	var sampler = null;
	for (var s in mapping) {
		sampler = this._samplers[s];
		if (sampler) {
			mapping[s].bind(sampler.unit);
		}
	}
};

/**
 * Logs out information about this Program.
 * @param {String}
 * @returns
 */
Program.prototype.log = function() {
	var log = "***** SHADER PROGRAM LOG *****\n";
	for (var s in this.shaders)
		log += this.shaders[s].log;
	log += "------------------------------\n";
	log += this._log;
	log += "******************************\n";
	log += "\n";
	return log;
};

Program.fromShadersURL = function(gl, vurl, furl) {
	var vertex, vertexRequest, fragment, fragmentRequest;
	vertexRequest = new XHRequest({
		url				: vurl,
		async			: false,
		callback	: function(src) {
			vertex = new Shader(gl, gl.VERTEX_SHADER, src);
		}
	});
	
	vertex = new Shader(gl, gl.VERTEX_SHADER, vertexRequest.send());
	
	fragmentRequest = new XHRequest({
		url				: furl,
		async			: false,
		callback	: function(src) {
			fragment = new Shader(gl, gl.FRAGMENT_SHADER, src);
		}
	});
	
	fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragmentRequest.send());
	
	return new Program(gl, vertex, fragment);
};

Program.fromShadersScript = function(gl, vscriptId, fscriptId) {
	var vertex = new Shader(gl, gl.VERTEX_SHADER, getHTMLScript(vscriptId));
	var fragment = new Shader(gl, gl.FRAGMENT_SHADER, getHTMLScript(fscriptId));
	return new Program(gl, vertex, fragment);
};

Program.fromShadersSource = function(gl, vsrc, fsrc) {
	var vertex = new Shader(gl, gl.VERTEX_SHADER, vsrc);
	var fragment = new Shader(gl, gl.FRAGMENT_SHADER, fsrc);
	return new Program(gl, vertex, fragment);
};

Program.fromShadersBuilder = function(gl, vb, fb) {
	// TODO
};

/**
 * Creates a Program from default shaders.
 * @returns {Program} A new program.
 */
Program.fromShadersDefault = function(gl) {
	var vertex = new Shader(gl, gl.VERTEX_SHADER, Shader.Vertex.Default);
	var fragment = new Shader(gl, gl.FRAGMENT_SHADER, Shader.Fragment.Default);
	return new Program(gl, vertex, fragment);
};


/**
 * Creates a ShaderManger.
 * @class Manages shader programs.
 */
function ProgramManager(gl) {
	this.gl = gl;
	
	this._programs = {};
	this._currentProgram = null;
	
	this._programs['default'] = Program.fromShadersDefault(this.gl);
	this._currentProgram = this._programs['default'];
};

/**
 * Getters.
 */
ProgramManager.prototype = {
	get programs() { return this._programs; },
	get current() { return this._currentProgram; }
};

ProgramManager.prototype.createProgram = function(name, vertex, fragment) {
	var program = new Program(this.gl, vertex, fragment);
	if (program.isValid)
		this._programs[name] = program;
};

ProgramManager.prototype.createProgramFromShadersURL = function(name, vurl, furl) {
	var program = Program.fromShadersURL(this.gl, vurl, furl);
	if (program.isValid)
		this._programs[name] = program;
};

ProgramManager.prototype.createProgramFromShadersScript = function(name, vid, fid) {
	var program = Program.fromShadersScript(this.gl, vid, fid);
	if (program.isValid)
		this._programs[name] = program;
};

ProgramManager.prototype.createProgramFromShadersSource = function(name, vsrc, fsrc) {
	var program = Program.fromShadersSource(this.gl, vsrc, fsrc);
	if (program.isValid)
		this._programs[name] = program;
};

ProgramManager.prototype.createProgramFromShadersBuilder = function(name, vb, fb) {
	var program = Program.fromShadersBuilder(this.gl, vb, fb);
	if (program.isValid)
		this._programs[name] = program;
};

ProgramManager.prototype.useProgram = function(name) {
	if (!this._programs[name]) return;
	this._currentProgram = this._programs[name];
};

ProgramManager.prototype.setVertexShader = function(src) {
	var shader = new Shader(this.gl, this.gl.VERTEX_SHADER, src);
	this._currentProgram.setVertexShader(shader);
};

ProgramManager.prototype.setFragmentShader = function(src) {
	var shader = new Shader(this.gl, this.gl.FRAGMENT_SHADER, src);
	this._currentProgram.setFragmentShader(shader);	
};

ProgramManager.prototype.setShaders = function(vertexSrc, fragmentSrc) {
	var shader = new Shader(this.gl, this.gl.VERTEX_SHADER, fragmentSrc);
	var fragment = new Shader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSrc);
	this._currentProgram.setShaders(vertex, fragment);		
};
