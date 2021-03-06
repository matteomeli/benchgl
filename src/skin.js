// skin.js
// The skin module has the tools to manipulate colors, materials, lights and textures.

BenchGL.namespace('BenchGL.skin.Color');

BenchGL.skin.Color = (function() {

	// Dependencies
  var Vec3 = BenchGL.math.Vector3, 
  
  		// Private properties and methods
      Color;
  
  Color = function(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 1;
  };
  
  Color.prototype.toRGBArray = function(){
    return [this.r, this.g, this.b];
  };
  
  Color.prototype.toRGBAArray = function(){
    return [this.r, this.g, this.b, this.a];
  };
  
  return Color;
  
}());

BenchGL.namespace('BenchGL.skin.Material');

BenchGL.skin.Material = (function() {

	// Dependencies
	var Color = BenchGL.skin.Color,
			
			// Private properties and methods
			Material;
  
  Material = function(options){
    options = $.mix({
      ambient: {
        r: 0.0,
        g: 0.0,
        b: 0.0
      },
      diffuse: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      specular: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      emissive: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      shininess: 0.1
    }, options || {});
    
    var ambient = options.ambient, 
        diffuse = options.diffuse, 
        specular = options.specular, 
        emissive = options.emissive;
    
    this.ambient = new Color(ambient.r, ambient.g, ambient.b);
    this.diffuse = new Color(diffuse.r, diffuse.g, diffuse.b);
    this.specular = new Color(specular.r, specular.g, specular.b);
    this.emissive = new Color(emissive.r, emissive.g, emissive.b);
    this.shininess = options.shininess;
  };
  
  Material.prototype.setAmbient = function(r, g, b){
    this.ambient = new Color(r, g, b);
  };
  
  Material.prototype.setDiffuse = function(r, g, b){
    this.diffuse = new Color(r, g, b);
  };
  
  Material.prototype.setSpecular = function(r, g, b){
    this.specular = new Color(r, g, b);
  };
  
  Material.prototype.setEmissive = function(r, g, b){
    this.emissive = new Color(r, g, b);
  };
  
  Material.prototype.setShininess = function(shininess){
    this.shininess = shininess;
  };
  
  return Material;
  
}());

BenchGL.namespace('BenchGL.skin.Light');

BenchGL.skin.Light = (function() {
  
  // Dependencies
  var Vec3 = BenchGL.math.Vector3,
  		Color = BenchGL.skin.Color,
  		Material = BenchGL.skin.Material,
  
  		// Private properties and methods
  		Light;
  
  Light = function(options){
    options = $.mix({
      position: {
        x: 0.0,
        y: 0.0,
        z: -1.0
      },
      ambient: {
        r: 0.0,
        g: 0.0,
        b: 0.0
      },
      diffuse: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      specular: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      direction: {
        x: 0.0,
        y: 0.0,
        z: -1.0
      },
      cutoff: 180.0,
      exponent: 0.0,
      constant: 1.0,
      linear: 0.0,
      quadratic: 0.0,
      active: true
    }, options || {});
    
    var position = options.position, 
        ambient = options.ambient, 
        diffuse = options.diffuse, 
        specular = options.specular, 
        direction = options.direction;
    
    this.position = new Vec3(position.x, position.y, position.z);
    this.ambient = new Color(ambient.r, ambient.g, ambient.b);
    this.diffuse = new Color(diffuse.r, diffuse.g, diffuse.b);
    this.specular = new Color(specular.r, specular.g, specular.b);
    this.direction = new Color(direction.x, direction.y, direction.z);
    this.cutOff = options.cutoff;
    this.exponent = options.exponent;
    this.constant = options.constant;
    this.linear = options.linear;
    this.quadratic = options.quadratic;
    this.active = options.active;
  };
  
  Light.prototype.setPosition = function(x, y, z){
    this.position = new Vec3(x, y, z);
  };
  
  Light.prototype.setAmbient = function(r, g, b){
    this.ambient = new Color(r, g, b);
  };
  
  Light.prototype.setDiffuse = function(r, g, b){
    this.diffuse = new Color(r, g, b);
  };
  
  Light.prototype.setSpecular = function(r, g, b){
    this.specular = new Color(r, g, b);
  };
  
  Light.prototype.setDirection = function(x, y, z){
    this.direction = new Vec3(x, y, z).$unit();
  };
  
  Light.prototype.setExponent = function(exponent){
    this.exponent = exponent;
  };
  
  Light.prototype.setCutoff = function(cutoff){
    this.cutoff = cutoff;
  };
  
  Light.prototype.setConstantAttenuation = function(constant){
    this.constant = constant;
  };
  
  Light.prototype.setLinearAttenuation = function(linear){
    this.linear = linear;
  };
  
  Light.prototype.setQuadraticAttenuation = function(quadratic){
    this.quadratic = quadratic;
  };
  
  Light.prototype.setActive = function(active){
    this.active = active;
  };
  
  return Light;
  
}());

BenchGL.namespace('BenchGL.skin.Texture');

BenchGL.skin.Texture = (function() {
  
  // Private properties and methods
  var Texture;
  
  Texture = function(options){
    options = $.mix({
      level: 0,
      verticalFlip: true,
      internalFmt: gl.RGBA,
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      magFilter: gl.LINEAR,
      minFilter: gl.LINEAR_MIPMAP_NEAREST,
      mipmap: true,
      target: gl.TEXTURE_2D
    }, options || {});
    
    var texture = gl.createTexture();
    
    this.options = options;
    this.handler = texture;
    
    gl.bindTexture(options.target, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.verticalFlip);
    gl.texImage2D(options.target, options.level, options.internalFmt, options.format, options.type, options.image);
    gl.texParameteri(options.target, gl.TEXTURE_MAG_FILTER, options.magFilter);
    gl.texParameteri(options.target, gl.TEXTURE_MIN_FILTER, options.minFilter);
    if (options.mipmap) {
      this.generateMipmap();
    }
    gl.bindTexture(options.target, null);
  };
  
  Texture.prototype.destroy = function(){
    gl.deleteTexture(this.handler);
    return this;
  };
  
  Texture.prototype.bind = function(unit){
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(this.options.target, this.handler);
    return this;
  };
  
  Texture.prototype.unbind = function(unit){
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(this.options.target, null);
    return this;
  };
  
  Texture.prototype.generateMipmap = function(){
    gl.generateMipmap(this.options.target);
    return this;
  };
  
  return Texture;
  
}());
