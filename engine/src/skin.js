//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

// Light types constants
const BGL_LIGHT_DIRECTIONAL = 0;
const BGL_LIGHT_POINT = 1;
const BGL_LIGHT_SPOT = 2;

// Light properties constants
const BGL_LIGHT_AMBIENT = 10;
const BGL_LIGHT_DIFFUSE = 11;
const BGL_LIGHT_SPECULAR = 12;
const BGL_LIGHT_POSITION = 13;
const BGL_SPOT_DIRECTION = 14;
const BGL_SPOT_EXPONENT = 15;
const BGL_SPOT_CUTOFF = 16;
const BGL_CONSTANT_ATT = 17;
const BGL_LINEAR_ATT = 18;
const BGL_QUADRATIC_ATT = 19;

// Material properties constants
const BGL_MAT_AMBIENT = 20;
const BGL_MAT_DIFFUSE = 21;
const BGL_MAT_AMBIENT_AND_DIFFUSE = 22;
const BGL_MAT_SPECULAR = 23;
const BGL_MAT_SHININESS = 24;
const BGL_MAT_EMISSIVE = 25;


function Color(color) {
	var C = color._rgba || color;
	this._rgba = C.slice();
	
	if (this._rgba.length == 3)
		this._rgba.push(1.0);
};

Color.prototype = {
	get r() { return this._rgba[0]; },
	get g() { return this._rgba[1]; },
	get b() { return this._rgba[2]; },
	get a() { return this._rgba[3]; },
	get rgba() { return this._rgba; },
	get rgb() { return this._rgba.slice(0, 3); }
};

function Light(name, options) {
	this._name = name;
	
	var defaultOptions = {
		type			: BGL_LIGHT_POINT,
		position	: [0.0, 0.0, -1.0],
		ambient		: [0.0, 0.0, 0.0],
		diffuse	 	: [1.0, 1.0, 1.0],
		specular	: [1.0, 1.0, 1.0],
		direction	: [0.0, 0.0, -1.0],
		cutOff		: 180.0,
		exponent	: 0.0,
		constAtt	: 1.0,
		linAtt		: 0.0,
		quadAtt		: 0.0
	};
	
	if (!options) options = {};
	for (var d in defaultOptions) {
		if (!options[d]) options[d] = defaultOptions[d];
	}
	
	this._type = options.type;
	this._position = new Vector(options.position);
	this._diffuse = new Color(options.diffuse);
	this._ambient = new Color(options.ambient);
	this._specular = new Color(options.specular);
	this._spotCutoff = options.cutOff;
	this._spotDir = new Vector(options.direction);
	this._spotExp = options.exponent;
	this._constantAtt = options.constAtt;
	this._linearAtt = options.linAtt;
	this._quadraticAtt = options.quadAtt; 
};

Light.prototype = {
	get name() { return this._name; },
	get type() { return this._type; },
	get position() { return this._position; },
	get diffuse() { return this._diffuse; },
	get ambient() { return this._ambient; },
	get specular() { return this._specular; },
	get direction() { return this._spotDir; },
	get exponent() { return this._spotExp; },
	get cutoff() { return this._spotCutoff; },
	get constantAtt() { return this._constantAtt; },
	get linearAtt() { return this._linearAtt; },
	get quadraticAtt() { return this._quadraticAtt; },
};

Light.prototype.setParameter = function(options) {
	var previousOptions = {
		type				: this._type,
		position		: this._position,
		ambient			: this._ambient,
		diffuse		 	: this._diffuse,
		specular		: this._specular,
		direction		: this._spotDir,
		cutOff			: this._spotCutoff,
		exponent		: this._spotExp,
		constAtt		: this._constantAtt,
		linAtt			: this._linearAtt,
		quadAtt			: this._quadraticAtt
	};
	
	if (!options) options = {};
	for (var p in previousOptions) {
		if (!options[p]) options[p] = previousOptions[p];
	}
	
	this._type = options.type;
	this._position = new Vector(options.position);
	this._diffuse = new Color(options.diffuse);
	this._ambient = new Color(options.ambient);
	this._specular = new Color(options.specular);
	this._spotCutoff = options.cutOff;
	this._spotDir = new Vector(options.direction);
	this._spotExp = options.exponent;
	this._constantAtt = options.constAtt;
	this._linearAtt = options.linAtt;
	this._quadraticAtt = options.quadAtt; 
};

function Material(options) {
	var defaultOptions = {
		ambient		: new Color([0.2, 0.2, 0.2]),
		diffuse		: new Color([0.8, 0.8, 0.8]),
		specular	: new Color([0.0, 0.0, 0.0]),
		emissive	: new Color([0.0, 0.0, 0.0]),
		shininess	: 0.1
	};
	
	if (!options) options = {};
	for (var d in defaultOptions) {
		if (!options[d]) options[d] = defaultOptions[d];
	}	
	
	this._diffuse = options.diffuse;
	this._ambient = options.ambient;
	this._specular = options.specular;
	this._emissive = options.emissive;
	this._shininess = options.shininess;
};

Material.prototype = {
	get diffuse() { return this._diffuse; },
	get ambient() { return this._ambient; },
	get specular() { return this._specular; },
	get emissive() { return this._emissive; },
	get shininess() { return this._shininess; },
};

function Texture(gl, options) {
	this.gl = gl;
	
	var defaultOptions = {
		level					: 0,
		verticalFlip	:	true,
		internalFmt		: gl.RGBA,
		format				: gl.RGBA,
		type					: gl.UNSIGNED_BYTE,
		magFilter			: gl.LINEAR,
		minFilter			: gl.LINEAR_MIPMAP_NEAREST,
		mipmap				: true,
		target				: gl.TEXTURE_2D
	};
	
	var options = options || {};
	for (var d in defaultOptions) {
		if (!options[d]) options[d] = defaultOptions[d];
	}
	
	this._name = options.name;
	this._src	= options.image.src;
	this._image = options.image;
	this._level = options.level;
	this._vFlip = options.verticalFlip;
	this._iFormat = options.internalFmt;
	this._format = options.format;
	this._type = options.type;
	this._magFilter = options.magFilter;
	this._minFilter = options.minFilter;
	this._genMipmap = options.mipmap;
	this._target = options.target;
	this._width = options.image.width;
	this._height = options.image.height;
	this._valid = true;
	
	var obj = gl.createTexture();
	gl.bindTexture(this._target, obj);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this._vFlip);
	gl.texImage2D(this._target, this._level, this._iFormat, this._format, this._type, this._image);
	gl.texParameteri(this._target, gl.TEXTURE_MAG_FILTER, this._magFilter);
	gl.texParameteri(this._target, gl.TEXTURE_MIN_FILTER, this._minFilter);
	if (this._genMipmap) {
		this.generateMipmap();
	}
	gl.bindTexture(this._target, null);
	
	this._obj = obj;
};

/**
 * Getters.
 */
Texture.prototype = {
	get obj() { return this._obj; }, 
	get name() { return this._name; },
	get src() { return this._src; },
	get image() { return this._image; },
	get level() { return this._level; },
	get isVertFlipped() { return this._vFlip; },
	get internalFmt() { return this._iFormat; },
	get format() { return this._format; },
	get type() { return this._type; },
	get magFilter() { return this._magFilter; },
	get minFilter() { return this._minFilter; },
	get isValid() { return this.valid; },
	get target() { return this._target; },
};

/**
  * Destroys this Texture.
  */ 
Texture.prototype.destroy = function() {
	this.gl.deleteTexture(this.obj);
};

/**
 * Binds this Texture as the current WebGL texture.
 */
Texture.prototype.bind = function(unit) {
	this.gl.activeTexture(this.gl.TEXTURE0 + unit);
	this.gl.bindTexture(this._target, this.obj);
};

/**
 * Unbinds this Texture.
 */
Texture.prototype.unbind = function(unit) {
	this.gl.activeTexture(this.gl.TEXTURE0 + unit);
	this.gi.bindTexture(this._target, null);
};

/**
 * Generates mipmaps for this Texture.
 */
Texture.prototype.generateMipmap = function() {
	this.gl.generateMipmap(this._target);
};
