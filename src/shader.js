// shader.js

(function() {
	
	var Shader = function(gl, type, source) {
		var shader = gl.createShader(type),
				valid = false,
				log = '';
		
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		
		valid = gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== 0;		
		log += gl.getShaderInfoLog(shader);
		
		this.source = source;
		this.handler = shader;
		this.type = type;
		this.valid = valid;
		this.log = log;
	};
	
	Shader.prototype.destroy = function() {
		this.gl.deleteShader(this.handler);
	};
	
	Shader.Vertex = {
		Default : [
			"#ifdef GL_ES",
			"precision highp float;",
			"#endif",
			
			"attribute vec3 a_position;",
			"attribute vec3 a_normal;",
			"attribute vec2 a_texcoord;",
			"attribute vec4 a_color;",
			
			"uniform mat4 u_modelViewMatrix;",
			"uniform mat4 u_projectionMatrix;",
			"uniform mat4 u_normalMatrix;",
			"uniform mat4 u_viewMatrix;",
			
			"uniform bool u_enableLighting;",
			"uniform vec3 u_ambientColor;",
			"uniform vec3 u_directionalColor;",
			"uniform vec3 u_lightingDirection;",
			
			"uniform bool u_enableLight1;",
			"uniform vec3 u_lightColor1;",
			"uniform vec3 u_lightPosition1;",
			
			"uniform bool u_enableLight2;",
			"uniform vec3 u_lightColor2;",
			"uniform vec3 u_lightPosition2;",
		
			"uniform bool u_enableLight3;",
			"uniform vec3 u_lightColor3;",
			"uniform vec3 u_lightPosition3;",
			
			"uniform bool u_enableLight4;",
			"uniform vec3 u_lightColor4;",
			"uniform vec3 u_lightPosition4;",
			
			"varying vec4 v_color;",
			"varying vec2 v_texcoord;",
			"varying vec3 v_lightFactor;",
			
			"void main(void) {",
			"	vec4 ecPosition = u_modelViewMatrix * vec4(a_position, 1.0);",
			
			" if (!u_enableLighting) {",
			"		v_lightFactor = vec3(1.0, 1.0, 1.0);",
			"	} else {",
			"		vec3 lightDirection;",
			"		vec3 lightPosition;",
			"		vec3 lightFactor1 = vec3(0.0, 0.0, 0.0);",
			"		vec3 lightFactor2 = vec3(0.0, 0.0, 0.0);",
			"		vec3 lightFactor3 = vec3(0.0, 0.0, 0.0);",
			"		vec3 lightFactor4 = vec3(0.0, 0.0, 0.0);",
			
			"		vec3 normal = normalize((u_normalMatrix * vec4(a_normal, 1.0)).xyz);",
	
			"		vec3 directionalFactor = max(0.0, dot(normal, -u_lightingDirection)) * u_directionalColor;",
			
			"		if (u_enableLight1) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition1, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor1 = max(0.0, dot(normal, lightDirection)) * u_lightColor1;",
			"		}",
			
			"		if (u_enableLight2) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition2, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor2 = max(0.0, dot(normal, lightDirection)) * u_lightColor2;",
			"		}",
			
			"		if (u_enableLight3) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition3, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor3 = max(0.0, dot(normal, lightDirection)) * u_lightColor3;",
			"		}",
			
			"		if (u_enableLight4) {",
			"			lightPosition = (u_viewMatrix * vec4(u_lightPosition4, 1.0)).xyz;",
			"			lightDirection = normalize(lightPosition - ecPosition.xyz);",
			"			lightFactor4 = max(0.0, dot(normal, lightDirection)) * u_lightColor4;",
			"		}",
			
			"		v_lightFactor = u_ambientColor + directionalFactor + ",
			"			lightFactor1 + lightFactor2 + lightFactor3 + lightFactor4;",
			"	}",
			
			"	v_color = a_color;",
			" v_texcoord = a_texcoord;",
			" gl_Position = u_projectionMatrix * ecPosition;",
			"}"
			
		].join("\n")
	};
	
	Shader.Fragment = {
		Default : [
			"#ifdef GL_ES",
			"precision highp float;",
			"#endif",
			
			"uniform bool u_enableTexturing;",
			"uniform bool u_useTexture0;",
			"uniform sampler2D tex0;",
			
			"varying vec4 v_color;",
			"varying vec2 v_texcoord;",
			"varying vec3 v_lightFactor;",
			
			"void main(void) {",
			"	vec4 fColor = vec4(v_color.rgb * v_lightFactor, v_color.a);",
			
			"	if (u_enableTexturing) {",
      "   if (u_useTexture0) {",
			"			fColor = vec4(texture2D(tex0, vec2(v_texcoord.s, v_texcoord.t)).rgb * v_lightFactor, 1.0);",
      "   }",
      " }",
			
			"	gl_FragColor = fColor;",
			"}"
		].join("\n")
	};
	
	BenchGL.Shader = Shader;
	
}());

