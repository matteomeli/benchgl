//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Vec3 = BenchGL.Vector3;

	var Color = function(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a || 1;
	};
	
	Color.prototype.toRGBArray = function() {
		return [r, g, b];
	};
	
	Color.prototype.toRGBAArray = function() {
		return [r, g, b, a];
	};
	
	Color.prototype.toRGBFloat32Array = function() {
		return new Float32Array([r, g, b]);
	};
	
	Color.prototype.toRGBAFloat32Array = function() {
		return new Float32Array([r, g, b, a]);
	};
	
	var Light = function(options) {
		options = $.mix({
			position	: new Vec3(0.0, 0.0, -1.0),
			ambient		: new Color(0.0, 0.0, 0.0),
			diffuse	 	: new Color(1.0, 1.0, 1.0),
			specular	: new Color(1.0, 1.0, 1.0),
			direction	: new Color(0.0, 0.0, -1.0),
			cutOff		: 180.0,
			exponent	: 0.0,
			constAtt	: 1.0,
			linAtt		: 0.0,
			quadAtt		: 0.0,
			active : true	
		}, options || {});
		
		this.options = options;
	};
	
	Light.prototype.isActive = function() {
		return this.options.active;
	};
	
	Light.prototype.getPosition = function() {
		return this.options.position;
	};
	
	Light.prototype.getAmbient = function() {
		return this.options.ambient;
	};
	
	Light.prototype.getDiffuse = function() {
		return this.options.diffuse;
	};
	
	Light.prototype.getSpecular = function() {
		return this.options.specular;
	};
	
	Light.prototype.getDirection = function() {
		return this.options.direction;
	};
	
	Light.prototype.getCutoff = function() {
		return this.options.cutoff;
	};
	
	Light.prototype.getExponent = function() {
		return this.options.exponent;
	};
	
	Light.prototype.getConstAttenuation = function() {
		return this.options.position;
	};
	
	Light.prototype.getLinearAttenuation = function() {
		return this.options.position;
	};
	
	Light.prototype.getQuadAttenuation = function() {
		return this.options.position;
	};
	
	Light.prototype.setParameters = function(options) {
		for (var o in options) {
			this.options[o] = options[o];
		}
	};
	
	var Material = function(options) {
		options = $.mix({
			ambient		: new Color(0.2, 0.2, 0.2),
			diffuse		: new Color(0.8, 0.8, 0.8),
			specular	: new Color(0.0, 0.0, 0.0),
			emissive	: new Color(0.0, 0.0, 0.0),
			shininess	: 0.1
		}, options || {});
		
		this.options = options;
	};
	
	Material.prototype.getAmbient = function() {
		return this.options.ambient;
	};
	
	Material.prototype.getDiffuse = function() {
		return this.options.diffuse;
	};
	
	Material.prototype.getSpecular = function() {
		return this.options.specular;
	};
	
	Material.prototype.getEmissive = function() {
		return this.options.emissive;
	};
	
	Material.prototype.getShininess = function() {
		return this.options.shininess;
	};	
	
	Material.prototype.setParameters = function(options) {
		for (var o in options) {
			this.options[o] = options[o];
		}
	};
	
	var Texture = function(gl, options) {
		options = $.mix({
			level					: 0,
			verticalFlip	:	true,
			internalFmt		: gl.RGBA,
			format				: gl.RGBA,
			type					: gl.UNSIGNED_BYTE,
			magFilter			: gl.LINEAR,
			minFilter			: gl.LINEAR_MIPMAP_NEAREST,
			mipmap				: true,
			target				: gl.TEXTURE_2D			
		}, options || {});
		
		var texture = gl.createTexture();
		gl.bindTexture(options.target, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.verticalFlip);
		gl.texImage2D(options.target, options.level, options.internalFmt, 
									options.format, options.type, options.image);
		gl.texParameteri(options.target, gl.TEXTURE_MAG_FILTER, options.magFilter);
		gl.texParameteri(options.target, gl.TEXTURE_MIN_FILTER, options.minFilter);
		gl.bindTexture(options.target, null);
		
		this.gl = gl;
		this.options = options;
		this.handler = texture;
		
		if (options.mipmap) {
			this.generateMipmap();
		}
	};
	
	Texture.prototype.destroy = function() {
		this.gl.deleteTexture(this.handler);
		return this;
	};
	
	Texture.prototype.bind = function(unit) {
		this.gl.activeTexture(this.gl.TEXTURE0 + unit);
		this.gl.bindTexture(this.options.target, this.handler);
		return this;
	};
	
	Texture.prototype.unbind = function(unit) {
		this.gl.activeTexture(this.gl.TEXTURE0 + unit);
		this.gi.bindTexture(this.options.target, null);
		return this;
	};
	
	Texture.prototype.generateMipmap = function() {
		this.gl.generateMipmap(this.options.target);
		return this;
	};

	BenchGL.Color = Color;
	BenchGL.Light = Light;
	BenchGL.Texture = Texture;
	
})();
