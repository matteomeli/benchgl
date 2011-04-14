//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {
	
	var XHRequest = function(options) {
		options = $.mix({
			url : 'www.google.com',
			method : 'GET',
			async : true,
			binary : false,
			onProgress : $.empty,
			onLoad : $.empty,
			onError : $.empty,
			onAbort : $.empty,
			onSuccess : $.empty
		}, options || {});
		
		this.options = options;
		this.request = new XMLHttpRequest();
		myself = this;
		
		this.request.addEventListener("progress", function(e) { myself.onProgress(e); }, false);
		this.request.addEventListener("load", function(e) { myself.onLoad(e); }, false);
		this.request.addEventListener("error", function(e) { myself.onError(e); }, false);
		this.request.addEventListener("abort", function(e) { myself.onAbort(e); }, false);
	};
	
	XHRequest.prototype.send = function() {
		var options = this.options,
				url = this.options.url,
				method = this.options.method,
				async = this.options.async,
				binary = this.options.binary,
				request = this.request;
				
		request.open(method, url, async);
		
		if (async) {
			request.onreadystatechange = function(e) {
				if (request.readyState == 4) {
					if (request.status == 200) {
						options.onSuccess(request.responseText);
					} else {
						options.onError(request.status);
					}
				}
			};
		}
		
		if (binary) {
			request.sendAsBinary(null);
		} else {
			request.send(null);
		}
		
		if (!async) {
			if (request.status == 200) {
				options.onSuccess(request.responseText);
			} else {
				options.onError(request.status);
			}
		}
	};
	
	XHRequest.prototype.onProgress = function(e) {
		this.options.onProgress(e);
	};
	
	XHRequest.prototype.onError = function(e) {
		this.options.onError(e);
	};
	
	XHRequest.prototype.onAbort = function(e) {
		this.options.onAbort(e);
	};
	
	XHRequest.prototype.onLoad = function(e) {
		this.options.onLoad(e);
	};
	
	var TextureRequest = function(renderer, options) {		
		this.textures = options;
		this.renderer = renderer;
	};
	
	TextureRequest.prototype.send = function() {
		var textures = this.textures,
				renderer = this.renderer,
				keys = Object.keys(this.textures),
				callback = this.callback;
				
		keys.map(function(key) {
			var textureOpt = textures[key];
			textureOpt.image = new Image();
			textureOpt.image.onload = function() {
				renderer.addTexture(key, textureOpt);
			};
			textureOpt.image.src = textureOpt.src;
		});
	};
	
	BenchGL.XHRequest = XHRequest;
	BenchGL.TextureRequest = TextureRequest;
	
})();
