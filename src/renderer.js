// renderer.js

(function() {

	var Vec3 = BenchGL.Vector3,
			Mat4 = BenchGL.Matrix4,
			MatStack = BenchGL.MatrixStack,
			Color = BenchGL.Color,
			Material = BenchGL.Material,
			Light = BenchGL.Light,
			Texture = BenchGL.Texture,
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
		
		// Ambient Light
		this.ambientColor = new Color(0.2, 0.2, 0.2);
		
		// Lights
		this.useLighting = false;
		this.directionalColor = new Color(0.8, 0.8, 0.8);
		this.lightingDirection = new Vec3(0.0, 0.0, -1.0);
		this.lights = {};
		
		// Materials
		this.useMaterials = false;
		this.material = new Material();
		
		// Uniforms and samplers
		this.uniforms = {};
		this.samplers = {};
		
		// Saved models
		this.models = [];
	};
	
	Renderer.prototype.background = function() {
		var color = this.clearColor;
		
		this.gl.clearColor(color.r, color.g, color.b, color.a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.enable(this.gl.DEPTH_TEST);
	};	
	
	Renderer.prototype.useLights = function(lighting) {
		this.useLighting = lighting;
	};
	
	Renderer.prototype.useTextures = function(texturing) {
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
	
	Renderer.prototype.setDirectionalColor = function(r, g, b, a) {
		this.directionalColor = new Color(r, g, b, a);
	};
	
	Renderer.prototype.setLightingDirection = function(x, y, z) {
		this.lightingDirection = new Vec3(x, y, z).$unit();
	};
	
	Renderer.prototype.addLight = function(name, options) {
		this.lights[name] = new Light(options);
	};
	
	Renderer.prototype.addTexture = function(name, options) {
		this.textures[name] = new Texture(this.gl, options);
	};
	
	Renderer.prototype.addTextures = function(options) {
		new TextureRequest(this, options).send();
	};
	
	Renderer.prototype.setTextures = function(options) {
		this.activeTextures = [];
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg in this.textures) {
				this.activeTextures.push(this.textures[arg]);
			}
		}
	};
	
	Renderer.prototype.setUniform = function(name, value) {
		this.uniforms[name] = value;
	};
	
	Renderer.prototype.setSampler = function(name, value) {
		this.samplers[name] = value;
	};
	
	Renderer.prototype.setupCamera = function() {
		var uniforms = this.uniforms,
				transformStack = this.camera.transform,
				proj = transformStack.getProjectionMatrix().toFloat32Array(),
				view = transformStack.getViewMatrix().toFloat32Array(),
				modelView = transformStack.getModelViewMatrix().toFloat32Array(),
				normal = transformStack.getNormalMatrix().toFloat32Array();
		
		uniforms['u_projectionMatrix'] = proj;
		uniforms['u_viewMatrix'] = view;
		uniforms['u_modelViewMatrix'] = modelView;
		uniforms['u_normalMatrix'] = normal;
	};
	
	Renderer.prototype.setupLights = function() {
		var uniforms = this.uniforms,
				index = 0, light;
		
		uniforms['u_enableLighting'] = this.useLighting;
		uniforms['u_ambientColor'] = this.ambientColor.toRGBFloat32Array();
		uniforms['u_directionalColor'] = this.directionalColor.toRGBFloat32Array();
		uniforms['u_lightingDirection'] = this.lightingDirection.toFloat32Array();
		
		for (var l in this.lights) {
			light = this.lights[l];
			uniforms['u_enableLight' + (index + 1)] = light.active;
			uniforms['u_lightColor' + (index + 1)] = light.diffuse.toRGBFloat32Array();
			uniforms['u_lightPosition' + (index + 1)] = light.position.toFloat32Array();
			uniforms['u_lightSpecularColor' + (index + 1)] = light.specular.toRGBFloat32Array();
			index++;
		}
	};
	
	Renderer.prototype.setupTextures = function() {
		var uniforms = this.uniforms,
				samplers = this.samplers,
				texture;
				
		uniforms['u_enableTexturing'] = this.useTexturing;
		
		for (var i = 0, l = this.activeTextures.length; i < l; i++) {
			texture = this.activeTextures[i];
			uniforms['u_useTexture' + i] = true;
			samplers['tex' + i] = i;
			texture.bind(i);
		}
	};
	
	Renderer.prototype.setupMaterials = function() {
		var uniforms = this.uniforms,
				material = this.material;
		
		uniforms['u_matAmbient'] = material.ambient.toRGBAFloat32Array();
		uniforms['u_matDiffuse'] = material.diffuse.toRGBAFloat32Array();
		uniforms['u_matSpecular'] = material.specular.toRGBAFloat32Array();
		uniforms['u_matEmissive'] = material.emissive.toRGBAFloat32Array();
		uniforms['u_matShininess'] = material.shininess;
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
				
			this.setupCamera();
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
