// renderer.js

BenchGL.namespace('BenchGL.drawing');

BenchGL.drawing.Renderer = (function() {

	// Dependencies
  var Vec3 = BenchGL.math.Vector3,
      Mat4 = BenchGL.math.Matrix4,
      Color = BenchGL.skin.Color, 
      Material = BenchGL.skin.Material, 
      Light = BenchGL.skin.Light, 
      Texture = BenchGL.skin.Texture, 
      TextureRequest = BenchGL.io.TextureRequest,
      
      // Private properties and methods 
      Renderer;
  
  Renderer = function(gl, program, camera, effects){
    this.gl = gl;
    this.program = program;
    this.camera = camera;
    this.effects = effects;
    
    // Background and current color
    this.clearColor = new Color(0, 0, 0, 1);
    
    // Textures
    this.useTexturing = false;
    this.textures = {};
    
    // Ambient Light
    this.ambientColor = new Color(0.2, 0.2, 0.2);
    
    // Lights
    this.useLighting = false;
    this.directionalColor = new Color(0.8, 0.8, 0.8);
    this.lightingDirection = new Vec3(0.0, 0.0, -1.0);
    this.lights = {};
    
    // Saved models
    this.models = [];
  };
  
  Renderer.prototype.background = function(){
    var color = this.clearColor;
    
    this.gl.clearColor(color.r, color.g, color.b, color.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
  };
  
  Renderer.prototype.useLights = function(lighting){
    this.useLighting = lighting;
  };
  
  Renderer.prototype.useTextures = function(texturing){
    this.useTexturing = texturing;
  };
  
  Renderer.prototype.useAlphaBlending = function(blending, options){
    options = $.mix({
      src: this.gl.SRC_ALPHA,
      dest: this.gl.ONE
    }, options || {});
    
    if (blending) {
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
      this.gl.enable(this.gl.BLEND);
      this.gl.disable(this.gl.DEPTH_TEST);
    } else {
      this.gl.disable(this.gl.BLEND);
      this.gl.enable(this.gl.DEPTH_TEST);
    }
  };
  
  Renderer.prototype.setClearColor = function(r, g, b, a){
    this.clearColor = new Color(r, g, b, a);
  };
  
  Renderer.prototype.setAmbientColor = function(r, g, b, a){
    this.ambientColor = new Color(r, g, b, a);
  };
  
  Renderer.prototype.setDirectionalColor = function(r, g, b, a){
    this.directionalColor = new Color(r, g, b, a);
  };
  
  Renderer.prototype.setLightingDirection = function(x, y, z){
    this.lightingDirection = new Vec3(x, y, z).$unit();
  };
  
  Renderer.prototype.addLight = function(name, options){
    this.lights[name] = new Light(options);
  };
  
  Renderer.prototype.addTexture = function(name, options){
    this.textures[name] = new Texture(this.gl, options);
  };
  
  Renderer.prototype.addTextures = function(options){
  	var myself = this;
  	
    new TextureRequest(options).send(function(name, options) {
    	myself.addTexture(name, options);
    });
  };
  
  Renderer.prototype.setTextures = function(){
    var textureName, i;
    for (i = 0; i < arguments.length; i++) {
      textureName = arguments[i];
      if (this.textures.hasOwnProperty(textureName)) {
        this.activeTextures.push(this.textures[textureName]);
      }
    }
  };
  
  Renderer.prototype.setupCamera = function(){
    var program = this.program,
        camera = this.camera;
    
    program.bindUniform('u_projectionMatrix', camera.projMatrix());
    program.bindUniform('u_viewMatrix', camera.viewMatrix());
  };
  
  Renderer.prototype.setupLights = function(){
    var uniforms = {},
        index = 0, l, light;
    
    uniforms.u_enableLighting = this.useLighting;
    uniforms.u_ambientColor = this.ambientColor.toRGBArray();
    uniforms.u_directionalColor = this.directionalColor.toRGBArray();
    uniforms.u_lightingDirection = this.lightingDirection.toArray();
    
    for (l in this.lights) {
      light = this.lights[l];
      uniforms['u_enableLight' + (index + 1)] = light.active;
      uniforms['u_lightPosition' + (index + 1)] = light.position.toArray();
      uniforms['u_lightColor' + (index + 1)] = light.diffuse.toRGBArray();
      uniforms['u_lightSpecularColor' + (index + 1)] = light.specular.toRGBArray();
      index++;
    }
    
    this.program.bindUniforms(uniforms);
  };
  
  Renderer.prototype.setupTextures = function(){
    this.program.bindUniform('u_enableTexturing', this.useTexturing);
  };
  
  Renderer.prototype.setupEffects = function(){
    var effects = this.effects,
        uniforms = {}, 
        e, effect, p, property, value;
    
    for (e in effects) {
      effect = effects[e];
      for (p in effect) {
        property = p.charAt(0).toUpperCase() + p.slice(1);
        value = effect[p];
        uniforms['u_' + e + property] = value;
      }
    }
    
    this.program.bindUniforms(uniforms);
  };
  
  Renderer.prototype.addModels = function() {
    var models = this.models,
        i, l, model;
        
    for (i = 0, l = arguments.length; i < l; i++) {
      model = arguments[i];
      models.push(model);
      
      model.bindVertices(this.program, true);
      model.bindNormals(this.program, true);
      model.bindTexcoords(this.program, true);
      model.bindColors(this.program, true);
      model.bindIndices(this.program, true);
    }
  };
  
  Renderer.prototype.renderModel = function(model){
    var program = this.program,
        camera = this.camera,
        textures = this.textures,
        modelView, i, l, texture;
    
  	model.bindVertices(program);
  	model.bindNormals(program);
  	model.bindTexcoords(program);
  	model.bindColors(program);
  	model.bindIndices(program);
    	
    model.bindMaterial(program);
    model.bindUniforms(program);
    model.bindTextures(program, textures);
    
    // Set modelView and normal matrices
    modelView = camera.modelViewMatrix().multiplyMat4(model.matrix());
    program.bindUniform('u_modelViewMatrix', modelView);
    program.bindUniform('u_normalMatrix', modelView.invert().$transpose());    
    
    model.draw();
  };
  
  Renderer.prototype.renderAll = function() {
    this.setupCamera();
    this.setupLights();
    this.setupTextures();
    this.setupEffects();
    
    for (var i = 0, l = this.models.length; i < l; i++) {
      this.renderModel(this.models[i]);
    }    
  };
  
  return Renderer;
  
}());
