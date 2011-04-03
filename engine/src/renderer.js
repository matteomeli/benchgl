//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var Color = BenchGL.Color,
			Vec3 = BenchGL.Vector3,
			Mat4 = BenchGL.Matrix4,
			MatStack = BenchGL.MatrixStack,
			TextureRequest = BenchGL.TextureRequest;

	var Renderer = function(gl, program, camera, effects) {
		this.gl = gl;
		this.program = program;
		this.camera = camera;
		this.effects = effects;
	
		// Background and current color
		this.clearColor = new Color(0, 0, 0, 1);	
		
		// Textures
		this.useTexturing = false;
		this.textures = {};
		this.activeTextures = [];
		this.savedTextures = 0;
		
		// Ambient Light
		this.ambientColor = new Color(0.2, 0.2, 0.2);
		
		// Lights
		this.useLighting = false;
		this.directionalColor = new Color(0.8, 0.8, 0.8);
		this.lightingDirection = new Vector([0.0, 0.0, -1.0);
		this.lights = {};
		this.savedLights = 0;
		
		// Materials
		this.useMaterials = false;
		this.material = new Material();
		
		// Uniforms and samplers
		this.uniforms = {};
		this.samplers = {};
		
		// Saved models
		this.models = [];
	};
	
	Renderer.prototype.useLighting = function(lighting) {
		this.useLighting = lighting;
	};
	
	Renderer.prototype.useTexturing = function(texturing) {
		this.useTexturing = texturing;
	};

	Renderer.prototype.useAlphaBlending = function(blending, options) {
		options = $.mix({
			src : this.gl.SRC_ALPHA,
			dest : this.gl.ONE
		}, options || {});
		
		if (blending) {
	  	this.gl.enable(this.gl.BLEND);
			this.gl.disable(this.gl.DEPTH_TEST);
	  	this.gl.blendFunc(options.src, options.dest);
	  } else {
			this.gl.disable(this.gl.BLEND);
			this.gl.enable(this.gl.DEPTH_TEST);
		}
	};
	
	Renderer.prototype.setClearColor = function(r, g, b, a) {
		this.clearColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setAmbientColor = function(r, g, b, a) {
		this.ambientColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setDirectionalColor = function(rgb) {
		this.directionalColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setLightingDirection = function(x, y, z) {
		this.lightingDirection = new Vec3(x, y, z).$unit();
	};
	
	Renderer.prototype.background = function() {
		var color = this.color;
		
		this.gl.clearColor(color.r, color.g, color.b, color.a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.enable(this.gl.DEPTH_TEST);
	};
	
	Renderer.prototype.setMaterial = function(options) {
		this.material.setParameters(options);
	};	
	
	Renderer.prototype.addLight = function(name, options) {
		this.lights.push(new Light(options));
		this.savedLights++;
	};
	
	Renderer.prototype.setLight = function(name, options) {
		if (name in lights) {
			this.lights[name].setParameters(options);
		}
	};
	
	Renderer.prototype.addTexture = function(name, options) {
		this.textures[name] = new Texture(this.gl, options);
		this.savedTextures++;
	};
	
	Renderer.prototype.addTextures = function(options) {
		new TextureRequest(options).send();
	};
	
	Renderer.prototype.setTextures = function(options) {
		for (var o in options) {
			if (options[o] in this.textures) {
				this.activeTextures.push(this.textures[o]);
			}
		}
	};
	
	Renderer.prototype.noTexture = function() {
		this.activeTextures = [];
	};
	
	Renderer.prototype.setupTransformations = function() {
		var uniforms = this.uniforms,
				proj = this.camera.transform.getProjectionMatrix(),
				view = this.camera.transform.getViewMatrix(),
				modelView = this.camera.transform.getModelViewMatrix(),
				normal = this.camera.transform.getNormalMatrix();
		
		uniforms['u_projectionMatrix'] = proj.toFloat32Array();
		uniforms['u_viewMatrix'] = view.toFloat32Array();
		uniforms['u_modelViewMatrix'] = modelView.toFloat32Array();
		uniforms['u_normalMatrix'] = normal.toFloat32Array();
	};
	
	Renderer.prototype.setupAllLights = function() {
		var uniforms = this.uniforms,
				light;
		
		uniforms['u_enableLighting'] = this.useLighting;
		uniforms['u_ambientColor'] = this.ambientColor.toRGBFloat32Array();
		uniforms['u_directionalColor'] = this.directionalColor.toRGBFloat32Array();
		uniforms['u_lightingDirection'] = this.lightingDirection.toFloat32Array();
		
		for (var i = 0, l = this.activeLights.length; i < l; i++) {
			light = this.activeLights[i];
			uniforms['u_enableLight' + (i + 1)] = light.isActive();
			uniforms['u_lightColor' + (i + 1)] = light.getDiffuse().toRGBFloat32Array();;
			uniforms['u_lightPosition' + (i + 1)] = light.getPosition().toRGBFloat32Array();
			uniforms['u_lightSpecularColor' + (i + 1)] = light.getSpecular().toRGBFloat32Array();
		}
	};
	
	Renderer.prototype.setupTextures = function() {
		var uniforms = this.uniforms,
				samplers = this.samplers,
				texture;
				
		uniforms['u_enableTexturing'] = this._useTexturing;
		
		for (var i = 0, l = this.activeTextures; i < l; i++) {
			texture = this._activeTextures[i];
			texture.bind(i);
			
			uniforms['u_useTexture' + i] = true;
			samplers['tex' + i] = i;
		}
		
		//this.activeTextures = [];	
	};
	
	Renderer.prototype.setupMaterials = function() {
		var uniforms = this.uniforms,
				material = this.material;
		
		uniforms['u_matAmbient'] = material.getAmbient().toRGBFloat32Array();
		uniforms['u_matDiffuse'] = material.getDiffuse().toRGBFloat32Array();
		uniforms['u_matSpecular'] = material.getSpecular().toRGBFloat32Array();
		uniforms['u_matEmissive'] = material.getEmissive().toRGBFloat32Array();
		uniforms['u_matShininess'] = material.getShininess();
	};
	
	Renderer.prototype.setupEffects = function() {
		var uniforms = this.uniforms,
				effects = this.effects,
				effect, property, value;
		
		for (var e in effects) {
			effect = effects[e];
			uniforms['use' + e] = true;
			for (var p in effect) {
				property = p.charAt(0).toUpperCase() + p.slice(1);
				value = effect[p];
				uniforms[e + property] = value;
			} 
		}
	};
	
	Renderer.prototype.renderModel = function(model, mode) {
		if (model) {
			var program = this.program,
					mode = this.mode || 'triangles',
					uniforms = this.uniforms
					samplers = this.samplers;
				
			this.setupTransformations();
			this.setupLights();
			this.setupTextures();
			this.setupMaterials();
			this.setupEffects();
				
			program.bindUniforms(uniforms);
			program.bindSamplers(samplers);
			
			model.render(program, mode);
		}
	};
	
	BenchGL.Renderer = Renderer;

})();


