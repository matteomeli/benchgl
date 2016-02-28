// program.js
// Module webgl: Gives shader program support.

BenchGL.namespace('BenchGL.webgl.ProgramAttribute');

BenchGL.webgl.ProgramAttribute = (function() {

	// Private properties and methods
  var ProgramAttribute;
  
  ProgramAttribute = function(program, name, type, size, location){
    this.program = program;
    this.name = name;
    this.type = type;
    this.size = size;
    this.location = location;
  };
  
  ProgramAttribute.prototype.setIndex = function(n) {
    gl.bindAttribLocation(this.program.handler, n, this.name);
    this.location = n;
  }; 
  
  ProgramAttribute.prototype.getIndex = function() {
    return this.location;
  };
  
  return ProgramAttribute;
  
}());

BenchGL.namespace('BenchGL.webgl.ProgramUniform');

BenchGL.webgl.ProgramUniform = (function() {

	// Private properties and methods
	var ProgramUniform;
  
  ProgramUniform = function(program, name, type, size, location){
    this.program = program;
    this.name = name;
    this.type = type;
    this.size = size;
    this.location = location;
    this.func = null;
    this.value = null;
    
    switch (type) {
      case gl.BOOL:
        this.func = function(v){
          gl.uniform1i(this.location, v);
        };
        break;
      case gl.BOOL_VEC2:
        this.func = function(v){
          gl.uniform2iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.BOOL_VEC3:
        this.func = function(v){
          gl.uniform3iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.BOOL_VEC4:
        this.func = function(v){
          gl.uniform4iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.INT:
        this.func = function(v){
          gl.uniform1i(this.location, v);
        };
        break;
      case gl.INT_VEC2:
        this.func = function(v){
          gl.uniform2iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.INT_VEC3:
        this.func = function(v){
          gl.uniform3iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.INT_VEC4:
        this.func = function(v){
          gl.uniform4iv(this.location, new Uint16Array(v));
        };
        break;
      case gl.FLOAT:
        this.func = function(v){
          gl.uniform1f(this.location, v);
        };
        break;
      case gl.FLOAT_VEC2:
        this.func = function(v){
          gl.uniform2fv(this.location, new Float32Array(v));
        };
        break;
      case gl.FLOAT_VEC3:
        this.func = function(v){
          gl.uniform3fv(this.location, new Float32Array(v));
        };
        break;
      case gl.FLOAT_VEC4:
        this.func = function(v){
          gl.uniform4fv(this.location, new Float32Array(v));
        };
        break;
      case gl.FLOAT_MAT2:
        this.func = function(v){
          gl.uniformMatrix2fv(this.location, false, v.toFloat32Array());
        };
        break;
      case gl.FLOAT_MAT3:
        this.func = function(v){
          gl.uniformMatrix3fv(this.location, false, v.toFloat32Array());
        };
        break;
      case gl.FLOAT_MAT4:
        this.func = function(v){
          gl.uniformMatrix4fv(this.location, false, v.toFloat32Array());
        };
        break;
      default:
        throw {
          name: "UnknownUniformType",
          message: "The uniform variable type is unknown."
        };
    }
  };
  
  ProgramUniform.prototype.setValue = function(v){
    this.value = v;
    this.func(v);
  };
  
  ProgramUniform.prototype.getValue = function(){
    return this.value;
  };
  
  return ProgramUniform;
  
}());

BenchGL.namespace('BenchGL.webgl.ProgramSampler');

BenchGL.webgl.ProgramSampler = (function() {

	// Private properties and methods
	var ProgramSampler;
  
  ProgramSampler = function(program, name, type, size, location){
    this.program = program;
    this.name = name;
    this.type = type;
    this.size = size;
    this.location = location;
    this.unit = -1;
  };
  
  ProgramSampler.prototype.getUnit = function(){
    return this.unit;
  };
  
  ProgramSampler.prototype.setUnit = function(n){
    gl.uniform1i(this.location, n);
    this.unit = n;
  };
  
  return ProgramSampler;
  
}());

BenchGL.namespace('BenchGL.webgl.Program');

BenchGL.webgl.Program = (function() {

	// Dependencies
	var Shader = BenchGL.webgl.Shader, 
      ProgramAttribute = BenchGL.webgl.ProgramAttribute,
      ProgramUniform = BenchGL.webgl.ProgramUniform,
      ProgramSampler = BenchGL.webgl.ProgramSampler,
      XHR = BenchGL.io.XHRequest,
      
      // Private properties and methods
      Program;
  
  Program = function(vertex, fragment){
    var program = gl.createProgram(), 
    		valid = false, log = '';
    
    gl.attachShader(program, vertex.handler);
    gl.attachShader(program, fragment.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Compiled succesfully!\n";
    }
    else {
      log += "Compilation error: ";
      log += gl.getProgramInfoLog(program);
      log += "\n";
    }
    
    this.vertex = vertex;
    this.fragment = fragment;
    this.handler = program;
    this.valid = valid;
    this.log = log;
    
    this.attributes = {};
    this.uniforms = {};
    this.samplers = {};
    
    this.buffers = {};
    this.cachedBuffers = {};
    
    this.build();
  };
  
  Program.prototype.build = function(){
    var program = this.handler, 
        attributes = this.attributes, 
        uniforms = this.uniforms, 
        samplers = this.samplers, 
        attributesCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES), 
        uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS),
        a, u, location, attribute, uniform, sampler, i;
    
    for (i = 0; i < attributesCount; ++i) {
      a = gl.getActiveAttrib(program, i);
      if (a) {
        location = gl.getAttribLocation(program, a.name);
        attribute = new ProgramAttribute(this, a.name, a.type, a.size, location);
        attributes[a.name] = attribute;       
      }
    }
    
    for (i = 0; i < uniformsCount; ++i) {
      u = gl.getActiveUniform(program, i);
      if (u) {
        location = gl.getUniformLocation(program, u.name);
        if (u.type === gl.SAMPLER_2D || u.type === gl.SAMPLER_CUBE) {
          sampler = new ProgramSampler(this, u.name, u.type, u.size, location);
          samplers[u.name] = sampler;
        }
        else {
          uniform = new ProgramUniform(this, u.name, u.type, u.size, location);
          uniforms[u.name] = uniform;
        }
      }
    }
    
    return this;
  };
  
  Program.prototype.setVertexShader = function(shader){
    var program = this.handler,
        valid = false, 
        log = '';
    
    gl.detachShader(program, this.vertex.handler);
    gl.attachShader(program, shader.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Recompiled succesfully!\n";
    }
    else {
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
    this.buffers = {};
        
    this.build();
    
    return this;
  };
  
  Program.prototype.setFragmentShader = function(shader){
    var program = this.handler, 
        valid = false, 
        log = '';
    
    gl.detachShader(program, this.fragment.handler);
    gl.attachShader(program, shader.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Recompiled succesfully!\n";
    }
    else {
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
    this.buffers = {};
        
    this.build();
    
    return this;
  };
  
  Program.prototype.setShaders = function(vertex, fragment){
    var program = this.handler, 
        valid = false, 
        log = '';
    
    gl.detachShader(program, this.vertex.handler);
    gl.detachShader(program, this.fragment.handler);
    gl.attachShader(program, vertex.handler);
    gl.attachShader(program, fragment.handler);
    gl.linkProgram(program);
    
    valid = gl.getProgramParameter(program, gl.LINK_STATUS) !== 0;
    if (valid) {
      log += "Recompiled succesfully!\n";
    }
    else {
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
    this.buffers = {};
        
    this.build();
    
    return this;
  };
  
  Program.prototype.link = function(){
    gl.linkProgram(this.handler);
  };
  
  Program.prototype.destroy = function(){
  	gl.deleteProgram(this.handler);
    this.vertex.destroy();
    this.fragment.destroy();
  };
  
  Program.prototype.bind = function(){
    gl.useProgram(this.handler);
  };
  
  Program.prototype.unbind = function(){
    gl.useProgram(null);
  };
  
  Program.prototype.bindAttribute = function(name, options) {
    options = $.mix({
      attributeType : gl.ARRAY_BUFFER,
      dataType : gl.FLOAT,
      drawType : gl.STATIC_DRAW,
      size : 1,
      stride : 0,
      offset : 0
    }, this.cachedBuffers[name] || {}, options || {});
    
    var attributeName = options.name || name,
        attributeType = options.attributeType,
        dataType = options.dataType,
        drawType = options.drawType,
        size = options.size,
        stride = options.stride,
        offset = options.offset,
        data = options.data,
        hasBuffer = name in this.buffers,
        buffer = hasBuffer ? this.buffers[name] : gl.createBuffer(),
        hasData = 'data' in options,
        index = this.attributes[attributeName] && this.attributes[attributeName].getIndex(),
        isAttribute = index !== undefined;
    
    if (!hasBuffer) {
      this.buffers[name] = buffer;
      isAttribute && gl.enableVertexAttribArray(index);
    }

    gl.bindBuffer(attributeType, buffer);
    
    if (hasData) {
      gl.bufferData(attributeType, data, drawType);
    }
    
    isAttribute && gl.vertexAttribPointer(index, size, dataType, false, stride, offset);
    
    delete options.data;
    this.cachedBuffers[name] = options;
    
    return this;
  };
  
  Program.prototype.bindAttributes = function(mapping){
    for (var name in mapping) {
      this.bindAttribute(name, mapping[name]);
    }
    return this;
  };
  
  Program.prototype.bindUniform = function(name, value){
    if (this.uniforms[name]) {
      this.uniforms[name].setValue(value);
    }
    return this;
  }; 
  
  Program.prototype.bindUniforms = function(mapping){
    for (var name in mapping) {
      this.bindUniform(name, mapping[name]);
    }
    return this;
  };
  
  Program.prototype.bindSampler = function(name, value){
    if (this.samplers[name]) {
      this.samplers[name].setUnit(value);
    }
    return this;
  };
  
  Program.prototype.bindSamplers = function(mapping){
    for (var name in mapping) {
      this.bindSampler(name, mapping[name]);
    }
    return this;
  };
  
  Program.factory = function(options){
    var type = (options && options.type) || 'defaults', 
        method = 'From' + $.capitalize(type);
    
    if (typeof Program[method] !== "function") {
      throw {
        name: "UnknownProgramType",
        message: "Type '" + method + "' does not exist."
      };
    }
    
    return Program[method](options);
  };
  
  Program.FromUrls = function(options){
    options = $.mix({
      vertex: '',
      fragment: '',
      onSuccess: $.empty,
      onError: $.empty
    }, options || {});
    
    new XHR({
      url: options.vertex,
      onError: function(e){
        options.onError(e);
      },
      onSuccess: function(vs){
        new XHR({
          url: options.fragment,
          onError: function(e){
            options.onError(e);
          },
          onSuccess: function(fs){
            options.onSuccess(Program.FromSources({
              vertex: vs,
              fragment: fs
            }));
          }
        }).send();
      }
    }).send();
  };
  
  Program.FromScripts = function(options){
    var vs = options.vertex, 
        fs = options.fragment, 
        vertex = new Shader(gl.VERTEX_SHADER, $(vs).innerHTML), 
        fragment = new Shader(gl.FRAGMENT_SHADER, $(fs).innerHTML);
    return new Program(vertex, fragment);
  };
  
  Program.FromSources = function(options){
    var vs = options.vertex, 
        fs = options.fragment, 
        vertex = new Shader(gl.VERTEX_SHADER, vs), 
        fragment = new Shader(gl.FRAGMENT_SHADER, fs);
    return new Program(vertex, fragment);
  };
  
  Program.FromDefaults = function(options){
    var vs = (options && $.capitalize(options.vertex)) || 'Default', 
        fs = (options && $.capitalize(options.fragment)) || 'Default', 
        vertex = new Shader(gl.VERTEX_SHADER, Shader.Vertex[vs]), 
        fragment = new Shader(gl.FRAGMENT_SHADER, Shader.Fragment[fs]);
    return new Program(vertex, fragment);
  };
  
  return Program;
  
}());
