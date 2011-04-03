//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Shader = BenchGL.Shader;
	
	var ProgramAttribute = function(program, name, type, size, index) {
		this.program = program;
		this.name = name;
		this.type = type;
		this.size = size;
		this.location = location;
	};
	
	ProgramAttribute.prototype.setIndex = function(n) {
		this.program.gl.bindAttribLocation(this.program.handler, n, this.name);
		this.location = n;
	},
	
	ProgramAttribute.prototype.getIndex = function() { 
		return this.location; 
	};
	
	var ProgramUniform = function(program, name, type, size, location) {
		this.program = program;
		this.name = name;
		this.type = type;
		this.size = size;
		this.location = location;		
		this.func = null;
		this.value = null;
		
		var gl = program.gl;
		
		switch (type) {
			case gl.BOOL:
				this.func = function(v) { gl.uniform1i(this.location, v); };
				break;
			case gl.BOOL_VEC2:
				this.func = function(v) { gl.uniform2iv(this.location, v); };
				break;
			case gl.BOOL_VEC3:
				this.func = function(v) { gl.uniform3iv(this.location, v); };
				break;
			case gl.BOOL_VEC4:
				this.func = function(v) { gl.uniform4iv(this.location, v); };
				break;
			case gl.INT:
				this.func = function(v) { gl.uniform1i(this.location, v); };
				break;
			case gl.INT_VEC2:
				this.func = function(v) { gl.uniform2iv(this.location, v); };
				break;
			case gl.INT_VEC3:
				this.func = function(v) { gl.uniform3iv(this.location, v); };
				break;
			case gl.INT_VEC4:
				this.func = function(v) { gl.uniform4iv(this.location, v); };
				break;
			case gl.FLOAT:
				this.func = function(v) { gl.uniform1f(this.location, v); };
				break;
			case gl.FLOAT_VEC2:
				this.func = function(v) { gl.uniform2fv(this.location, v); };
				break;
			case gl.FLOAT_VEC3:
				this.func = function(v) { gl.uniform3fv(this.location, v); };
				break;
			case gl.FLOAT_VEC4:
				this.func = function(v) { gl.uniform4fv(this.location, v); };
				break;
			case gl.FLOAT_MAT2:
				this.func = function(v) { gl.uniformMatrix2fv(this.location, gl.FALSE, v); };
				break;
			case gl.FLOAT_MAT3:
				this.func = function(v) { gl.uniformMatrix3fv(this.location, gl.FALSE, v); };
				break;
			case gl.FLOAT_MAT4:
				this.func = function(v) { gl.uniformMatrix4fv(this.location, gl.FALSE, v); };
				break;
			default:
				throw {
					name : "UnknownUniformType",
					message : "The uniform variable type is unknown."
				};
				break;
		}
	};
	
	ProgramUniform.prototype.setValue = function(v) {
		this.value = v;
		this.func(v);
	};
	
	ProgramUniform.prototype.getValue = function() {
		return this.value;
	};
	
	var ProgramSampler = function(program, name, type, size, location) {
		this.program = program;
		this.name = name;
		this.type = type;
		this.size = size;
		this.location = location;
		this.unit = -1;
	};
	
	ProgramSampler.prototype.getUnit = function() {
		return this.unit;
	};
		
	ProgramSampler.prototype.setUnit = function(n) {
		this.program.gl.uniform1i(this.location, n);
		this.unit = n;
	};
	
	var Program = function(gl, vertex, fragment) {
		var program = gl.createProgram(),
				valid = false,
				log = '';
		
		gl.attachShader(program, vertex.handler);
		gl.attachShader(program, fragment.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Compiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}

		this.gl = gl;
		this.vertex = vertex;
		this.fragment = fragment;
		this.handler = program;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.buildVariables();
		this.setupDefaultBindings();
	};
	
	Program.prototype.buildVariables = function() {
		var gl = this.gl,
				program = this.handler,
				attributes = this.attributes,
				uniforms = this.uniforms,
				samplers = this.samplers,
				attributesCount = 0, uniformsCount = 0,
				a, u, location, attribute, uniform, sampler;
				
		attributesCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		for (var i=0; i<attributesCount; ++i) {
			a = gl.getActiveAttrib(program, i);
			if (!a) continue;
			location = gl.getAttribLocation(program, a.name);
			attribute = new ProgramAttribute(this, a.name, a.type, a.size, location);
			attributes[a.name] = attribute;
		}
		
		uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for (var i=0; i<uniformsCount; ++i) {
			u = gl.getActiveUniform(program, i);
			if (!u) continue;
			location = gl.getUniformLocation(program, u.name);
			if (u.type == gl.SAMPLER_2D || u.type == gl.SAMPLER_CUBE) {
				sampler = new ProgramSampler(this, u.name, u.type, u.size, location);
				samplers[u.name] = sampler;
			} else {
				uniform = new ProgramUniform(this, u.name, u.type, u.size, location);
				uniforms[u.name] = uniform;
			}
		}
		
		return this;
	};

	Program.prototype.setupDefaultBindings = function() {
		var gl = this.gl,
				program = this.handler,
				index = 0, unit = 0,
				attribute, uniforms;
				
		for (var a in this.attributes) {
			attribute = this.attributes[a];
			gl.bindAttribLocation(program, index, attribute.name);
			attribute.setIndex(index);
			index++;
		}
		gl.linkProgram(program);
		
		for (var u in this.uniforms) {
			uniform = this.uniforms[u];
			uniform.location = gl.getUniformLocation(program, uniform.name);
		}
		gl.useProgram(program);
		
		for (var s in this.samplers) {
			sampler = this.samplers[s];
			sampler.location = gl.getUniformLocation(program, sampler.name);
			sampler.setUnit(unit);
			unit++;
		}
		
		return this;
	};
	
	Program.prototype.setVertexShader = function(shader) {
		var gl = this.gl,
				program = this.handler,
				valid = false,
				log = '';
		
		gl.detachShader(program, this.vertex.handler);
		gl.attachShader(program, shader.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Recompiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}

		this.vertex = shader;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.buildVariables();
		this.setupDefaultBindings();
		
		return this;
	};
	
	Program.prototype.setFragmentShader = function(shader) {
		var gl = this.gl,
				program = this.handler,
				valid = false,
				log = '';
		
		gl.detachShader(program, this.fragment.handler);
		gl.attachShader(program, shader.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Recompiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}
	
		this.fragment = shader;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.buildVariables();
		this.setupDefaultBindings();
		
		return this;
	};
	
	Program.prototype.setShaders = function(vertex, fragment) {
		var gl = this.gl,
				program = this.handler,
				valid = false,
				log = '';
		
		gl.detachShader(program, this.vertex.handler);
		gl.detachShader(program, this.fragment.handler);
		gl.attachShader(program, vertex.handler);
		gl.attachShader(program, fragment.handler);
		gl.linkProgram(program);
		
		valid = gl.getProgramParameter(program, gl.LINK_STATUS) != 0;
		if (valid) {
			log += "Recompiled succesfully!\n"
		} else {
			log += "Compilation error: ";
			log += gl.getProgramInfoLog(program);
			log += "\n";
		}
		
		this.vertex = vertex;
		this.fragment = fragment;
		this.valid = valid;
		this.log = log;
		this.attributes = {};
		this.uniforms = {};
		this.samplers = {};
		
		this.build();
		this.setupDefaultBindings();
		
		return this;
	};
	
	Program.prototype.link = function() {
		this.gl.linkProgram(this.handler);
	};
	
	Program.prototype.destroy = function() {
		this.gl.deleteProgram(this.handler);
		this.vertex.destroy();
		this.fragment.destroy();
	};
	
	Program.prototype.bind = function() {
		this.gl.useProgram(this.handler);
	};
	
	Program.prototype.unbind = function() {
		this.gl.useProgram(null);
	};
	
	Program.prototype.bindAttributes = function(mapping) {
		var attribute = null;
		for (var a in mapping) {
			attribute = this.attributes[a];
			if (attribute) {
				attribute.setIndex(mapping[a]);
			}
		}

		this.gl.linkProgram(this.handler);
	};
	
	Program.prototype.bindUniforms = function(mapping) {
		var uniform = null;
		for (var u in mapping) {
			uniform = this.uniforms[u];
			if (uniform) {
				uniform.setValue(mapping[u]);
			}
		}
	};
	
	Program.prototype.bindSamplers = function(mapping) {
		var sampler = null;
		for (var s in mapping) {
			sampler = this.samplers[s];
			if (sampler) {
				sampler.setUnit(mapping[u]);
			}
		}
	};
	
	Program.factory = function(gl, options) {
		var type = options && 
							 ('From' + options.type.charAt(0).toUpperCase() + type.slice(1)) 
							 || 'FromDefaults',
				vertex = options && options.vertex || '',
				fragment = options && options.fragment || '';
				
		if (typeof Program[type] !== "function") {
			throw {
				name : "UnknownProgramType",
				message : type + "does not exists."
			};
		}
		
		return Program[type](gl, vertex, fragment);
	};
	
	Program.FromUrls = function(gl, vurl, furl) {
		var program;
		
		new XHRequest({
			url : vurl,
			onSuccess : function(vs) {
				new XHRequest({
					url : furl,
					onSuccess : function(fs) {
						program = Program.fromSources(gl, vs, fs);
					}
				}).send();
			} 
		}).send();
		
		return program;
	};
	
	Program.FromScripts = function(gl, vscriptId, fscriptId) {
		var vertex = new Shader(gl, gl.VERTEX_SHADER, $(vscriptId).innerHTML),
				fragment = new Shader(gl, gl.FRAGMENT_SHADER, $(fscriptId).innerHTML);
		return new Program(gl, vertex, fragment);
	};
	
	Program.FromSources = function(gl, vsrc, fsrc) {
		var vertex = new Shader(gl, gl.VERTEX_SHADER, vsrc),
				fragment = new Shader(gl, gl.FRAGMENT_SHADER, fsrc);
		return new Program(gl, vertex, fragment);
	};
	
	Program.FromDefaults = function(gl) {
		var vertex = new Shader(gl, gl.VERTEX_SHADER, Shader.Vertex.Default),
				fragment = new Shader(gl, gl.FRAGMENT_SHADER, Shader.Fragment.Default);
		return new Program(gl, vertex, fragment);
	};

	BenchGL.Program = Program;

})();

