// mesh.js

BenchGL.namespace('BenchGL.drawing');

BenchGL.drawing.Model = (function() {
  
  // Dependencies
  var MatStack = BenchGL.math.MatrixStack,
      Mat = BenchGL.skin.Material,
      XHR = BenchGL.io.XHRequest,
      sin = Math.sin,
      cos = Math.cos,
      pi = Math.PI,
      id = 0,
      
      // Private properties and methods
      Model;
  
  Model = function(options) {
    options = $.mix({
      drawType : gl.TRIANGLES,
      useColors : true,
      dynamic : true,
      colors : [1, 1, 1, 1]
    }, options || {});
    
    this.id = options.id || id++;
    this.drawType = options.drawType;
    this.useColors = options.useColors;
    this.dynamic = options.dynamic;
    this.vertices = options.vertices;
    this.normals = options.normals;
    this.texcoords = options.texcoords;
    this.colors = options.colors;
    this.indices = options.indices;
    
    this.material = new Mat();
    this.uniforms = {};
    this.textureNames = [];
    
    this.matrixStack = new MatStack();
        
    if (this.useColors) {
      this.normalizeColors();
    }
  };
  
  Model.prototype.textures = function() {
    return this.textureNames;
  };
  
  Model.prototype.matrix = function() {
  	return this.matrixStack.top();
  };
  
  Model.prototype.reset = function() {
    this.matrixStack.loadIdentity();
  };
  
  Model.prototype.translate = function(x, y, z) {
    this.matrixStack.translate(x, y, z);
  };
  
  Model.prototype.scale = function(x, y, z) {
    this.matrixStack.scale(x, y, z);
  };
  
  Model.prototype.rotate = function(angle, x, y, z) {
    this.matrixStack.rotate(angle, x, y, z);
  };
  
  Model.prototype.rotateXYZ = function(rx, ry, rz) {
    this.matrixStack.rotateXYZ(rx, ry, rz);
  };  
  
  Model.prototype.normalizeColors = function() {
    if (!this.vertices) return;
    
    var colors = this.colors,
        totalLength = this.vertices.length * 4 / 3,
        count = totalLength / colors.length,
        result = new Float32Array(totalLength);
    
    if (colors.length < totalLength) {
      while (count--) {
        result.set(colors, count * colors.length);
      }
      this.colors = result;
    }    
  };
  
  Model.prototype.setTextures = function() {
    var textureNames = this.textureNames,
        i, l;
    for (i = 0, l = arguments.length; i < l; i ++) {
      textureNames.push(arguments[i]);
    }
  };

  Model.prototype.setMaterialAmbient = function(r, g, b) {
    this.material.setAmbient(r, g, b);
  };
    
  Model.prototype.setMaterialDiffuse = function(r, g, b) {
    this.material.setDiffuse(r, g, b);    
  };
  
  Model.prototype.setMaterialSpecular = function(r, g, b) {
    this.material.setSpecular(r, g, b);    
  };
  
  Model.prototype.setMaterialEmissive = function(r, g, b) {
    this.material.setEmissive(r, g, b);    
  };

  Model.prototype.setMaterialShininess = function(shininess) {
    this.material.setShininess(shininess);
  };   
  
  Model.prototype.setUniform = function(name, value) {
    this.uniforms[name] = value;
  };
  
  Model.prototype.bindVertices = function(program, update) {
    if (!this.vertices) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-vertices', {
        name: 'a_position',
        data: new Float32Array(this.vertices),
        size: 3
      });
    } else {
      program.bindAttribute(this.id + '-vertices');
    }
  };
  
  Model.prototype.bindNormals = function(program, update) {
    if (!this.normals) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-normals', {
        name : 'a_normal',
        data : new Float32Array(this.normals),
        size : 3
      });          
    } else {
      program.bindAttribute(this.id + '-normals');
    }
  };
  
  Model.prototype.bindTexcoords = function(program, update) {
    if (!this.texcoords) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-texcoords', {
        name: 'a_texcoord',
        data: new Float32Array(this.texcoords),
        size: 2
      });
    } else {
      program.bindAttribute(this.id + '-texcoords');
    }
  };

  Model.prototype.bindColors = function(program, update) {
    if (!this.colors || !this.useColors) return;
    
    if (update || this.dynamic) {
      program.bindAttribute(this.id + '-colors', {
        name : 'a_color',
        data: new Float32Array(this.colors),
        size: 4
      });
    } else {
      program.bindAttribute(this.id + '-colors');
    }
  };
   
  Model.prototype.bindIndices = function(program, update) {
    if (!this.indices) return;
    
    program.bindAttribute('a_index', {
      attributeType : gl.ELEMENT_ARRAY_BUFFER,
      data : new Uint16Array(this.indices),
    });     
  };
  
  Model.prototype.bindUniforms = function(program) {
    program.bindUniforms(this.uniforms);
  };
  
  Model.prototype.bindMaterial = function(program) {
    var material = this.material,
        uniforms = {};
    
    uniforms.u_matAmbient = material.ambient.toRGBAArray();
    uniforms.u_matDiffuse = material.diffuse.toRGBAArray();
    uniforms.u_matSpecular = material.specular.toRGBAArray();
    uniforms.u_matEmissive = material.emissive.toRGBAArray();
    uniforms.u_matShininess = material.shininess;
    
    program.bindUniforms(uniforms);
  };
  
  Model.prototype.bindTextures = function(program, textures) {
    var textureNames = this.textureNames,
        i, l, texture;
    for (i = 0, l = textureNames.length; i < l; i++) {
      texture = textures[textureNames[i]];
      if (texture) {
        program.bindUniform('u_useTexture' + i, true);
        program.bindSamplers('tex' + i, i);
        texture.bind(i);
      }
    }    
  };
  
  Model.prototype.draw = function() {
    if (this.indices) {
      // Draw the model with as an indexed vertex array
      gl.drawElements(this.drawType, this.indices.length, gl.UNSIGNED_SHORT, 0);
    } else if (this.vertices) {
      // Draw the model with as a simple flat vertex array
      gl.drawArrays(this.drawType, 0, this.vertices.length / 3);
    }
  };
  
  Model.factory = function(type, options){
    type = $.capitalize(type);
    
    if (typeof Model[type] !== "function") {
      throw {
        name: "UnknownModelType",
        message: "Method '" + type + "' does not exist."
      };
    }
    
    return Model[type](options);
  };
  
  Model.Triangle = function(options){
    return new Model($.mix({
      vertices: [0, 1, 0, -1, -1, 0, 1, -1, 0],
      normals: [0, 0, 1, 0, 0, 1, 0, 0, 1],
      texcoords: [1, 1, 0, 0, 1, 0],
      colors: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }, options || {}));
  };
  
  Model.Rectangle = function(options){
    return new Model($.mix({
      vertices: [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0],
      normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      texcoords: [0, 0, 1, 0, 0, 1, 1, 1],
      colors: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      indices: [0, 1, 2, 3, 1, 2]
    }, options || {}));
  };
  
  Model.Circle = function(options){
    var n = (options) ? options.slices || 16 : 16, 
        r = (options) ? options.radius || 1 : 1, 
        vertexCoords = [0, 0, 0], 
        normalCoords = [0, 0, 1], 
        textureCoords = [0.5, 0.5],
        i, angle, x, y, u, v;
    
    for (i = 0; i <= n; i++) {
      angle = pi * i / n;
      x = r * cos(angle);
      y = r * sin(angle);
      u = (cos(angle) + 1) * 0.5;
      v = (sin(angle) + 1) * 0.5;
      
      vertexCoords.push(x);
      vertexCoords.push(y);
      vertexCoords.push(0);
      normalCoords.push(0);
      normalCoords.push(0);
      normalCoords.push(1);
      textureCoords.push(u);
      textureCoords.push(v);
    }
    
    return new Model($.mix({
      drawType : gl.TRIANGLE_FAN,
      vertices: vertexCoords,
      normals: normalCoords,
      texcoords: textureCoords,
      colors: [1, 1, 1, 1]
    }, options || {}));
  };
  
  Model.Cube = function(options){
    return new Model($.mix({
      vertices: [
      -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
      -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
      -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
      1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
      -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1],
      normals: [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0],
      texcoords: [
      0, 0, 1, 0, 1, 1, 0, 1,
      1, 0, 1, 1, 0, 1, 0, 0,
      0, 1, 0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0, 1, 0,
      1, 0, 1, 1, 0, 1, 0, 0,
      0, 0, 1, 0, 1, 1, 0, 1 ],
      colors: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
    }, options || {}));
  };
  
  Model.Pyramid = function(options){
    return new Model($.mix({
      vertices: [
      0, 1, 0, -1, -1, 1, 1, -1, 1,
      0, 1, 0, 1, -1, -1, -1, -1, -1,
      0, 1, 0, 1, -1, 1, 1, -1, -1,
      0, 1, 0, -1, -1, -1, -1, -1, 1],
      normals: [
      0, 1, 0, -1, -1, 1, 1, -1, 1,
      0, 1, 0, 1, -1, -1, -1, -1, -1,
      0, 1, 0, 1, -1, 1, 1, -1, -1,
      0, 1, 0, -1, -1, -1, -1, -1, 1],
      texcoords: [
      1, 1, 0, 0, 1, 0,
      1, 1, 0, 0, 1, 0,
      1, 1, 0, 0, 1, 0,
      1, 1, 0, 0, 1, 0],
      colors: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }, options || {}));
  };
  
  Model.Sphere = function(options){
    var n = (options) ? options.slices || 32 : 32, 
        m = (options) ? options.stacks || 32 : 32, 
        r = (options) ? options.radius || 1.0 : 1.0, 
        vertexCoords = [], 
        normalCoords = [],
        textureCoords = [], 
        indices = [],
        pi2 = pi * 2,
        i, j, theta, phi, sint, cost, sinp, cosp,
        x, y, z, u, v, first, second;
    
    for (i = 0; i <= n; i++) {
      theta = pi * i / n;
      sint = sin(theta);
      cost = cos(theta);
      for (j = 0; j <= m; j++) {
        phi = pi2 * j / m;
        sinp = sin(phi);
        cosp = cos(phi);
        x = r * sint * cosp;
        y = r * cost;
        z = r * sint * sinp;
        u = 1 - j / m;
        v = 1 - i / n;
        
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
    
    for (i = 0; i < n; i++) {
      for (j = 0; j < m; j++) {
        first = i * (m + 1) + j;
        second = first + m + 1;
        
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);
        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
    }
    
    return new Model($.mix({
      vertices: vertexCoords,
      normals: normalCoords,
      texcoords: textureCoords,
      colors: [1.0, 1.0, 1.0, 1.0],
      indices: indices
    }, options || {}));
  };
  
  Model.Json = function(options){
    var modelOptions = options.model,
        model;
    
    new XHR({
      url: options.url,
      async: false,
      onSuccess: function(response){
        var json = JSON.parse(response), 
            options = $.mix({
              vertices: json.vertexPositions,
              normals: json.vertexNormals,
              texcoords: json.vertexTextureCoords,
              indices: json.indices
            }, modelOptions || {});
        
        model = new Model(options);
      }
    }).send();
    
    return model;
  };
  
  return Model;
  
}());
