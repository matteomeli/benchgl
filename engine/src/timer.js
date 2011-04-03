//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//

(function() {

	var nowTime = 0,
			lastTime = 0,
			elapsedTime = 0;

	var Timer = function() {
		this.fps = 0;
		this.lastDelta = 0;
		this.maxSamples = 60;
		this.samples = [];
	};
	
	Timer.prototype.start = function() {
		nowTime = new Date().getTime();
		lastTime = nowTime;
		elapsedTime = 0;
	};
	
	Timer.prototype.stop = function() {
		var now = new Date().getTime()
				lastTime = nowTime;
				nowTime = now;
				elapsedTime = nowTime - lastTime,
				fps = 1000.0 / elapsedTime;
				
		if (this.samples.unshift(fps) > this.maxSamples)
			this.samples.pop();
			
		var fps = 0;
		for (var i = 0, l = this.samples.length; i < l; i++) {
			fps += this.samples[i];
		}
		fps /= this.samples.length;
		
		this.fps = Math.round(fps);
		this.lastDelta = elapsedTime;
	};
	
	Timer.prototype.clear = function() {
		nowTime = 0;
		lastTime = 0;
		elapsedTime = 0;
		
		this.fps = 0;
		this.lastDelta = 0;
		this.samples = [];
	};
	
	BenchGL.Timer = Timer;

})();

