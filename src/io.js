// io.js
// Offers structures and functions to perform asynchronous IO operations.

BenchGL.namespace('BenchGL.io.XHRequest');

BenchGL.io.XHRequest = (function() {
  
  var XHRequest;
	
	/**
	 * Creates a new XHRequest.
	 * @class Wraps an XMLHttpRequest object to load resources asynchronously. 
	 * @param {Object} [options] The request's options.
	 * @param {String} [options.url] The url for the request.
	 * @param {String} [options.method] The method for the request.
	 * @param {Boolean} [options.async] Is the request asynchronous?
	 * @param {Boolean} [options.binary] Is the response in binary format?
	 * @param {Function} [options.onProgress] Callback to call during request processing.
	 * @param {Function} [options.onLoad] Callback to call after request loading.
	 * @param {Function} [options.onError] Callback to call in case of error.
	 * @param {Function} [options.onAbort] Callback to call if the request is aborted.
	 * @param {Function} [options.onSuccess] Callback to call in case of success.         
	 */
  XHRequest = function(options) {
    options = $.mix({
      url: 'www.webrendering.sourceforge.net',
      method: 'GET',
      async: true,
      binary: false,
      onProgress: $.empty,
      onLoad: $.empty,
      onError: $.empty,
      onAbort: $.empty,
      onSuccess: $.empty
    }, options || {});
    
    var myself = this;
       
    this.options = options;
    this.request = new XMLHttpRequest();
    
    this.request.addEventListener('progress', function(e) { myself.onProgress(e); }, false);
    this.request.addEventListener('load', function(e) { myself.onLoad(e); }, false);
    this.request.addEventListener('error', function(e) { myself.onError(e); }, false);
    this.request.addEventListener('abort', function(e) { myself.onAbort(e); }, false);
  };
  
  /**
   * Executes the request wrapped in this XHRequest.
   */
  XHRequest.prototype.send = function() {
    var options = this.options, 
    		url = this.options.url, 
    		method = this.options.method, 
    		async = this.options.async, 
    		binary = this.options.binary, 
    		request = this.request;
    
    // Opens the request
    request.open(method, url, async);
    
    // Handle async requests
    if (async) {
      request.onreadystatechange = function(e) {
        if (request.readyState === 4) {
          if (request.status === 200) {
            options.onSuccess(request.responseText);
          }
          else {
            options.onError(request.status);
          }
        }
      };
    }
    
    // Handles binary requests
    if (binary) {
      request.sendAsBinary(null);
    }
    else {
      request.send(null);
    }
    
    // If not async wait for the response
    if (!async) {
      if (request.status === 200) {
        options.onSuccess(request.responseText);
      }
      else {
        options.onError(request.status);
      }
    }
  };
  
  /**
   * Handles the 'onprogress' event of this XHRequest.
   */
  XHRequest.prototype.onProgress = function(e) {
    this.options.onProgress(e);
  };

  /**
   * Handles the 'onerror' event of this XHRequest.
   */  
  XHRequest.prototype.onError = function(e) {
    this.options.onError(e);
  };

  /**
   * Handles the 'onabort' event of this XHRequest.
   */  
  XHRequest.prototype.onAbort = function(e) {
    this.options.onAbort(e);
  };
  
  /**
   * Handles the 'onload' event of this XHRequest.
   */  
  XHRequest.prototype.onLoad = function(e) {
    this.options.onLoad(e);
  };
  
	return XHRequest;
	
}());

BenchGL.namespace('BenchGL.io.TextureRequest');

BenchGL.io.TextureRequest = (function() {

	var TextureRequest;
  
  /**
   * Creates a new TextureRequest.
   * @class Represents multiple asynchronous requests for images to build up Texture objects.
   * @param {Object} options Information about the requested textures.
   */
  TextureRequest = function(options) {
    this.texturesReqs = options;
  };
  
  /**
   * Executes all the request of this TextureRequest, 
   * using a callback function to handle each one of them on completion.
   * @param {Function} callback A callback function to handle results on completion.
   */
  TextureRequest.prototype.send = function(callback) {
    var texturesReqs = this.texturesReqs,
        keys = Object.keys(texturesReqs);
    
    keys.map(function(key) {
      var textureOpt = texturesReqs[key];
      textureOpt.image = new Image();
      textureOpt.image.onload = function() {
      	if (callback) {
        	callback(key, textureOpt);
        }
      };
      textureOpt.image.src = textureOpt.src;
    });
  };
  
  return TextureRequest;
  
}());
