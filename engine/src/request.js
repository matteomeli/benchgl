//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


function XHRequest(options) {
	var defaultOptions = {
		url				: '',
		async 		: true,
		method		: 'GET',
		callback	:	null,
	};
	
	var options = options || {};
	for (var d in defaultOptions) {
		if (typeof options[d] == "undefined") options[d] = defaultOptions[d];
	}
	
	this._url = options.url;
	this._async = options.async;
	this._method = options.method;
	this._callback = options.callback;
};

XHRequest.prototype.send = function() {
	var request = new XMLHttpRequest();
	var callback = this._callback;
	
	if (this._async) {
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					if (callback) {
						callback(request.responseText);
					}
				}
			}
		};
	}
	
	request.open(this._method, this._url, this._async);
	request.send();
	
	var ret = null;
	if (!this._async) {
		ret = request.responseText;
	}
	
	return ret;
};

function TextureRequest(gl, options) {
	var textures = options.textures;
	var callback = options.callback;
	var keys = Object.keys(textures);
	
	keys.map(function(key) {
		var textureOptions = textures[key];
		textureOptions.name = key;
		textureOptions.image = new Image();
		textureOptions.image.onload = function() {
			var texture = new Texture(gl, textureOptions);
			if (callback)
				callback(texture);
		}
		textureOptions.image.src = textures[key].path + textures[key].src;
	});
};



