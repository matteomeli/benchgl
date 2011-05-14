// renderer.js
// Module drawing: Implements the core of the rendering engine.

BenchGL.namespace('BenchGL.drawing.SinglePassRenderingStrategy');

BenchGL.drawing.SinglePassRenderingStrategy = (function() {

	var SinglePassRenderingStrategy;
	
	SinglePassRenderingStrategy = function(renderer) {
		this.renderer = renderer;
	};
	
  SinglePassRenderingStrategy.prototype.setupCamera = function(){
    var program = this.renderer.program,
        camera = this.renderer.camera;
    
    program.bindUniform('u_projectionMatrix', camera.projMatrix());
    program.bindUniform('u_viewMatrix', camera.viewMatrix());
  };
  
  SinglePassRenderingStrategy.prototype.setupLights = function(){
    var uniforms = {},
        index = 0, l, light;
    
    uniforms.u_enableLighting = this.renderer.useLighting;
    uniforms.u_ambientColor = this.renderer.ambientColor.toRGBArray();
    uniforms.u_directionalColor = this.renderer.directionalColor.toRGBArray();
    uniforms.u_lightingDirection = this.renderer.lightingDirection.toArray();
    
    for (l in this.renderer.lights) {
      light = this.renderer.lights[l];
      uniforms['u_enableLight' + (index + 1)] = light.active;
      uniforms['u_lightPosition' + (index + 1)] = light.position.toArray();
      uniforms['u_lightColor' + (index + 1)] = light.diffuse.toRGBArray();
      uniforms['u_lightSpecularColor' + (index + 1)] = light.specular.toRGBArray();
      index++;
    }
    
    this.renderer.program.bindUniforms(uniforms);
  };
  
  SinglePassRenderingStrategy.prototype.setupTextures = function() {
    this.renderer.program.bindUniform('u_enableTexturing', this.renderer.useTexturing);
  };
  
  SinglePassRenderingStrategy.prototype.setupEffects = function(){
    var effects = this.renderer.effects,
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
    
    this.renderer.program.bindUniforms(uniforms);
  };	
	
	SinglePassRenderingStrategy.prototype.renderModel = function(model) {
    var program = this.renderer.program,
        camera = this.renderer.camera,
        textures = this.renderer.textures,
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
	
	SinglePassRenderingStrategy.prototype.renderAll = function() {
    this.setupCamera();
    this.setupLights();
    this.setupTextures();
    this.setupEffects();
    
    for (var i = 0, l = this.renderer.models.length; i < l; i++) {
      this.renderModel(this.renderer.models[i]);
    }   	
	};
	
	return SinglePassRenderingStrategy;

}());

BenchGL.namespace('BenchGL.drawing.Renderer');

BenchGL.drawing.Renderer = (function() {

	// Dependencies
  var Vec3 = BenchGL.math.Vector3,
      Mat4 = BenchGL.math.Matrix4,
      Color = BenchGL.skin.Color, 
      Material = BenchGL.skin.Material, 
      Light = BenchGL.skin.Light, 
      Texture = BenchGL.skin.Texture, 
      TextureRequest = BenchGL.io.TextureRequest,
      SinglePassRenderingStrategy = BenchGL.drawing.SinglePassRenderingStrategy,
      
      // Private properties and methods 
      Renderer;
  
  Renderer = function(program, camera, effects){
    this.program = program;
    this.camera = camera;
    this.effects = effects;
    
    // Rendering strategy
    this.strategy = new SinglePassRenderingStrategy(this);
    
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
    
   	gl.clearColor(color.r, color.g, color.b, color.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
  };
  
  Renderer.prototype.useLights = function(lighting){
    this.useLighting = lighting;
  };
  
  Renderer.prototype.useTextures = function(texturing){
    this.useTexturing = texturing;
  };
  
  Renderer.prototype.useAlphaBlending = function(blending, options){
    options = $.mix({
      src: gl.SRC_ALPHA,
      dest: gl.ONE
    }, options || {});
    
    if (blending) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
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
  
  Renderer.prototype.addTexture = function(name, options) {
    this.textures[name] = new Texture(options);
  };
  
  Renderer.prototype.addTextures = function(options) {
  	var myself = this;
  	
    new TextureRequest(options).send(function(name, options) {
    	myself.addTexture(name, options);
    });
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
  
  Renderer.prototype.setupCamera = function() {
    this.strategy.setupCamera();
  };
  
  Renderer.prototype.setupLights = function() {
    this.strategy.setupLights();
  };
  
  Renderer.prototype.setupTextures = function() {
    this.strategy.setupTextures();
  };
  
  Renderer.prototype.setupEffects = function() {
    this.strategy.setupTextures();
  };
  
  Renderer.prototype.renderModel = function(model) {
    this.strategy.renderModel(model);
  };
  
  Renderer.prototype.renderAll = function() {
    this.strategy.renderAll(); 
  };
  
  return Renderer;
  
}());
