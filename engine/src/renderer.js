//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


// Max actives constants
const BGL_MAX_LIGHTS = 4;
const BGL_MAX_TEXTURES = 1;


/**
 * Creates a new Renderer.
 * @class This class responsibility is to render geometric objects 
 * and provide function to access the wrapped WebGL context.
 */
function Renderer(gl, program, xtrans) {
	this.gl = gl;
	this.program = program;
	this.xtrans = xtrans;
	
	// Default rendering mode
	this._renderingMode = 'triangles';

	// Background and current color
	this._clearColor = new Color([0.0, 0.0, 0.0, 1.0]);	
	
	// Textures
	this._useTexturing = false;
	this._textures = {};
	this._activeTextures = [];
	
	// Ambient Light
	this._ambientColor = new Color([0.2, 0.2, 0.2]);
	
	// Lights
	this._useLighting = false;
	this._directionalColor = new Color([0.8, 0.8, 0.8]);
	this._lightingDirection = new Vector([0.0, 0.0, -1.0]);
	this._lights = {};
	this._activeLights = [];
	this._numActiveLights = 0;
	
	// Fog
	this._useFog = false;
	this._fogNear = 0.0;
	this._fogFar = 100.0;
	this._fogColor = new Color([0.0, 0.0, 0.0]);
	
	// Materials
	this._useMaterials = false;
	this._material = new Material();
	
	// Uniforms and samplers
	this._uniforms = {};
	this._samplers = {};
};

/**
 * Switches lighting.
 * @param {Boolean} lighting True to enable lighting, false otherwise.
 */
Renderer.prototype.useLighting = function(lighting) {
	this._useLighting = lighting;
};

/**
 * Switches texturing.
 * @param {Boolean} texturing True to enable texturing, false otherwise.
 */
Renderer.prototype.useTexturing = function(texturing) {
	this._useTexturing = texturing;
};

/**
 * Switches material use.
 * @param {Object} material True to use materials, false otherwise.
 */
Renderer.prototype.useMaterials = function(materials) {
	this._useMaterials = materials;
};

/**
 * Switches alpha-blending.
 * @param {Boolean} blending True to enable alpha-blending is on, false otherwise.
 * @param [options] Information about the blending functions.
 * @param options.srcBlendFunc The source blending function.
 * @param options.destBlendFunc The destination blending function.
 */
Renderer.prototype.useAlphaBlending = function(blending, options) {
	if (blending) {
		var defaultOptions = {
			'srcBlendFunc' : this.gl.SRC_ALPHA,
			'destBlendFunc' : this.gl.ONE
		};
		var options = options || {};
		for (var d in defaultOptions) {
			if (!options[d]) options[d] = defaultOptions[d];
		}
		
  	this.gl.enable(this.gl.BLEND);
		this.gl.disable(this.gl.DEPTH_TEST);
  	this.gl.blendFunc(options.srcBlendFunc, options.destBlendFunc);
  } else {
		this.gl.disable(this.gl.BLEND);
		this.gl.enable(this.gl.DEPTH_TEST);
	}
};

/**
 * Sets the clear color for the color buffer.
 * @param {Number[]} rgba An RGBA color.
 */
Renderer.prototype.setClearColor = function(rgba) {
	this._clearColor = new Color(rgba);
};

/**
 * Sets the general ambient light color.
 * @param {Number[]} rgba An RGB color.
 */
Renderer.prototype.setAmbientColor = function(rgb) {
	this._ambientColor = new Color(rgb);
};

/**
 * Sets the directional light color.
 * @param {Number[]} rgb An RGB color.
 */
Renderer.prototype.setDirectionalColor = function(rgb) {
	this._directionalColor = new Color(rgb);
};

/**
 * Sets the directional light color.
 * @param {Number[]} direction The direction of the light.
 */
Renderer.prototype.setLightingDirection = function(direction) {
	this._lightingDirection = new Vector(direction).normalize();
};

Renderer.prototype.createLight = function(name, options) {
	if (this._lights[name]) return;
	this._lights[name] = new Light(name, options);
};

/**
 * Activate a Light.
 * @param {String} name The name of the light to activate.
 */
Renderer.prototype.setLight = function(name, options) {
	if (!this._lights[name]) return;
	
	var light = this._lights[name];
	if (typeof options == "boolean" && options) {
		if (this._numActiveLights+1 <= BGL_MAX_LIGHTS) {
			this._activeLights[this._numActiveLights++] = light;
		}
	} else {
		light.setParameter(options);
	}
};

Renderer.prototype.createTexture = function(name, options) {
	if (this._textures[name]) return;
	this._textures[name] = new Texture(this.gl, options);
};

Renderer.prototype.createTextures = function(textures) {
	var options = {
		textures 	: {},
		callback	: null
	};
	for (var t in textures)
		options.textures[t] = textures[t];
	
	var myself = this;
	options.callback = function(texture) {
		if (!myself._textures[texture.name])
			myself._textures[texture.name] = texture;
	}
	
	var req = new TextureRequest(this.gl, options);
};

Renderer.prototype.setTextures = function(textures) {
	var textures = textures || [];
	this._activeTextures = [];
	if (typeof textures == 'string') {
  	var texture = this._textures[textures];
		if (texture)
			this._activeTextures[0] = texture;
  } else {
  	for (var i = 0; i < textures.length, i < BGL_MAX_TEXTURES; i++) {
  		var texture = this._textures[textures[i]];
  		if (texture) 
  			this._activeTextures[i] = texture;
  	}
  }
};

/**
 * Clears the color buffer and the depth buffer.
 */
Renderer.prototype.background = function() {
	this.gl.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.gl.enable(this.gl.DEPTH_TEST);
};

Renderer.prototype.beforeRender = function() {
	this._uniforms['u_modelViewMatrix'] = new Float32Array(this.xtrans.modelViewMatrix.flatten());
	this._uniforms['u_projectionMatrix'] = new Float32Array(this.xtrans.projectionMatrix.flatten());
	this._uniforms['u_normalMatrix'] = new Float32Array(this.xtrans.normalMatrix.flatten());
	this._uniforms['u_viewMatrix'] = new Float32Array(this.xtrans.viewMatrix.flatten());
};

Renderer.prototype.setupLights = function() {
	this._uniforms['u_enableLighting'] = this._useLighting;
	this._uniforms['u_ambientColor'] = this._ambientColor.rgb;
	this._uniforms['u_directionalColor'] = this._directionalColor.rgb;
	this._uniforms['u_lightingDirection'] = this._lightingDirection.xyz;
	
	for (var i=0; i<BGL_MAX_LIGHTS; i++) {
		var light = this._activeLights[i];
		if (!light) {
			this._uniforms['u_enableLight'+(i+1)] = false;
			this._uniforms['u_lightColor'+(i+1)] = [0.0, 0.0, 0.0];
			this._uniforms['u_lightPosition'+(i+1)] = [0.0, 0.0, 0.0];
			this._uniforms['u_lightSpecularColor'+(i+1)] = [0.0, 0.0, 0.0];
		} else {
			this._uniforms['u_enableLight'+(i+1)] = true;
			this._uniforms['u_lightPosition'+(i+1)] = light.position.xyz;
			this._uniforms['u_lightColor'+(i+1)] = light.diffuse.rgb;
			this._uniforms['u_lightSpecularColor'+(i+1)] = light.specular.rgb;
		}
	}
};

Renderer.prototype.setupLight = function(i) {
	;
};

Renderer.prototype.setupTextures = function() {
	// Binds all the textures
	this._uniforms['u_enableTexturing'] = this._useTexturing;
	for (var i=0; i<this._activeTextures.length; i++) {
		var texture = this._activeTextures[i];
		if (!texture) {
			this._uniforms['u_useTexture'+i] = false;
		} else {
			this._uniforms['u_useTexture'+i] = true;
			this._samplers['tex'+i] = texture;
		}
	}
	this._activeTextures = [];	
};

Renderer.prototype.setupMaterial = function() {
	this._uniforms['u_matAmbient'] = this._material.ambient.rgb;
	this._uniforms['u_matDiffuse'] = this._material.diffuse.rgb;
	this._uniforms['u_matSpecular'] = this._material.specular.rgb;
	this._uniforms['u_matEmissive'] = this._material.emissive.rgb;
	this._uniforms['u_matShininess'] = this._material.shininess;
};

Renderer.prototype.setupEffects = function() {
	// Fog
	this._uniforms['u_useFog'] = this._useFog;
	this._uniforms['u_fogNear'] = this._fogNear;
	this._uniforms['u_fogFar'] = this._fogFar;
	this._uniforms['u_fogColor'] = this._fogColor.rgb;
	
	// TODO: Other effects
};

Renderer.prototype.setupUniforms = function(uniforms) {
	// Binds custom uniforms
	if (uniforms) {
		for (var c in uniforms) {
			this._uniforms[c] = uniforms[c];
		}
	}
};

/**
 * Renders a mesh.
 * @param {ShaderProgram} program The shader program in the current rendering state.
 * @param {Model} mesh The mesh to render.
 */
Renderer.prototype.render = function(model, uniforms) {
	var prg = this.program.current;
	var mode = this._renderingMode;
	
	// Setups before rendering
	this.beforeRender();
	this.setupLights();
	this.setupTextures();
	this.setupMaterial();
	this.setupEffects();
	this.setupUniforms(model.uniforms);
	this.setupUniforms(uniforms);
	
	// Bind the current program
	prg.bind();
		
	// Set uniforms and samplers
	prg.bindUniforms(this._uniforms);
	prg.bindSamplers(this._samplers);
	
	// Render
	model.render(prg, mode);
};
