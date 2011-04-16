// TODO : it's not displayed correctly the blending!!!
function $(id) {
	return document.getElementById(id);
};
	
function start() {
	BenchGL.Shader.Fragment.Blend = [
		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",
		
		"uniform float u_alpha;",
		
		"uniform bool u_useTexture0;",
		"uniform sampler2D tex0;",
		
		"varying vec4 v_color;",
		"varying vec2 v_texcoord;",
		"varying vec3 v_lightFactor;",
		
		"void main(void) {",
		"	vec4 fColor;",
		
		" if (!u_useTexture0) {",
		"		fColor = vec4(v_color.rgb * v_lightFactor, v_color.a);",
		" } else {",
		"		fColor = vec4(texture2D(tex0, vec2(v_texcoord.s, v_texcoord.t)).rgb * v_lightFactor, u_alpha);",
		" }",
		
		"	gl_FragColor = fColor;",
		"}"
	].join("\n");

	BenchGL('example-canvas', {
		program : {
			type : 'defaults',
			fragment : 'blend'
		},
		onError : function() {
			alert('An error occured launching the application...');
		},
		onLoad : function(handler) {
			var gl = handler.gl,
					canvas = handler.canvas,
					program = handler.program,
					camera = handler.camera,
					renderer = handler.renderer,
					timer = new BenchGL.Timer(),
					cube = BenchGL.Model.factory('cube'),
					xRot = yRot = 0, z = -5.0,
					xSpeed = 3, ySpeed = -3;
					
			program.set
			
			renderer.useLights(true);
			renderer.useTextures(true);
			renderer.addTextures({
				glass : {
					src : 'glass.gif'
				}
			});
					
			function animate() {
				var elapsed = timer.stop().lastDelta;
        xRot += (xSpeed * elapsed) / 1000.0;
        yRot += (ySpeed * elapsed) / 1000.0;
			};
			
			function info() {
				$('fps').innerHTML = timer.fps + ' fps';
			};
			
			function handleKeys() {
		    if (canvas.keysDown[33]) {
		      // Page Up
		      z += 0.05;
		    }
		    if (canvas.keysDown[34]) {
		      // Page Down
		      z -= 0.05;
		    }
		    if (canvas.keysDown[37]) {
		      // Left cursor key
		      ySpeed -= 1;
		    }
		    if (canvas.keysDown[39]) {
		      // Right cursor key
		      ySpeed += 1;
		    }
		    if (canvas.keysDown[38]) {
		      // Up cursor key
		      xSpeed -= 1;
		    }
		    if (canvas.keysDown[40]) {
		      // Down cursor key
		      xSpeed += 1;
		    }
			};
			
			function handleControls() {
				var lightEnabled = $('lighting').checked,
						lightR = +$('lightR').value,
						lightG = +$('lightG').value,
						lightB = +$('lightB').value,
						lightX = +$('lightX').value,
						lightY = +$('lightY').value,
						lightZ = +$('lightZ').value,
						ambientR = +$('ambientR').value,
						ambientG = +$('ambientG').value,
						ambientB = +$('ambientB').value,
						blending = $('blending').checked,
						alpha = +$('alpha').value;
				
				renderer.useLights(lightEnabled);
				renderer.setLightingDirection(lightX, lightY, lightZ);
				renderer.setDirectionalColor(lightR, lightG, lightB);
				renderer.setAmbientColor(ambientR, ambientG, ambientB);

				if (blending) {
					renderer.useAlphaBlending(true);
				} else {
					alpha = 1.0;
					renderer.useAlphaBlending(false);
				}
				
				renderer.setUniform('u_alpha', alpha);
			};
			
			function display() {
				renderer.background();
				
				camera.transform.view().loadIdentity();
				camera.transform.model().loadIdentity();
				
				camera.transform.translate(0.0, 0.0, z);
				camera.transform.rotate(xRot, 1, 0, 0);
				camera.transform.rotate(yRot, 0, 1, 0);
				renderer.setTextures('glass');
				renderer.renderModel(cube);
			};
			
			function tick() {
				requestAnimFrame(tick);
				handleKeys();
				handleControls();
				display();
				animate();
				info();
			};

			timer.start();			
			tick();
		}
	});
};