importScripts('../../engine/src/request.js');

self.addEventListener('message', function(e) {
	//self.postMessage('Model URL: ' + e.data.url);
	//self.postMessage('Loading OBJ model...');

	var options = e.data || {};
	var url = "../" + options.url;
	options.url = url;
	//self.postMessage('Adjusting model url : ' + options.url);
	
	var defaultOptions = {
		async: false,
		callback: buildFromOBJ
	};
	
	for (var d in defaultOptions) {
		if (typeof options[d] === "undefined") 
			options[d] = defaultOptions[d];
	}
	//self.postMessage('Preparing request...');
	var response = new XHRequest(options).send();
	//self.postMessage('Request sent!');
	
	if (!options.async) {
		//self.postMessage('Reading response synchronously...');
  	buildFromOBJ(response);
  }
}, false);

function buildFromOBJ(response) {
	//self.postMessage('Inside building function...');
	var result = {
		vertexCoords 		: [],
		normalCoords 		: [],
		textureCoords 	: [],
		indices 				: []
	};
	
	var positions = [];
	var normals = [];
	var textures = [];
	var faces = {};
	var index = 0;
	
	var tokens = null;
	var line = "";
	
	var x = y = z = nx = ny = nz = u = v = 0.0;
	var pos = norm = tex = 0;
	var hasPos = hasNorm = hasTex = false;
	
	var lines = response.split("\n");
	for (var l in lines) {
		line = lines[l].replace(/[ \t]+/g, " ").replace(/[\s\s*]$/, "");
		
		if (line.length == 0) continue;
		
		tokens = line.split(' ');
		
		if (tokens[0] == '#') continue;
		
		if (tokens[0] == 'v') {
			positions.push(parseFloat(tokens[1]));
			positions.push(parseFloat(tokens[2]));
			positions.push(parseFloat(tokens[3]));
		} else if (tokens[0] == 'vn') {
			normals.push(parseFloat(tokens[1]));
			normals.push(parseFloat(tokens[2]));
			normals.push(parseFloat(tokens[3]));
		} else if (tokens[0] == 'vt') {
			textures.push(parseFloat(tokens[1]));
			textures.push(parseFloat(tokens[2]));
		} else if (tokens[0] == 'f') {
			if (tokens.length != 4) continue;
						
			for (var i = 1; i < 4; i++) {
				if (!(tokens[i] in faces)) {
					var f = tokens[i].split("/");
					
					if (f.length == 1) {
						pos = parseInt(f[0]) - 1;
						tex = pos;
						norm = pos;
					} else if (f.length == 3) {
						pos = parseInt(f[0]) - 1;
						tex = parseInt(f[1]) - 1;
						norm = parseInt(f[2]) - 1;
					} else {
						// Error face length not recognized
						break;
					}
					
					if (pos * 3 + 2 < positions.length) {
						hasPos = true;
						x = positions[pos * 3];
						y = positions[pos * 3 + 1];
						z = positions[pos * 3 + 2];
					}
					result.vertexCoords.push(x);
					result.vertexCoords.push(y);
					result.vertexCoords.push(z);
					
					if (norm * 3 + 2 < normals.length) {
						hasNorm = true;
						nx = normals[norm * 3];
						ny = normals[norm * 3 + 1];
						nz = normals[norm * 3 + 2];
					}
					result.normalCoords.push(nx);
					result.normalCoords.push(ny);
					result.normalCoords.push(nz);
					
					if (tex * 2 + 2 < textures.length) {
						hasTex = true;
						u = textures[tex * 2];
						v = textures[tex * 2 + 1];
					}
					result.textureCoords.push(u);
					result.textureCoords.push(v);
					
					faces[tokens[i]] = index++;
				}
				
				result.indices.push(faces[tokens[i]]);
			}
		} else {
			// Error line type not recognized
		}
	}
	
	self.postMessage(result);
};
