// timer.js

(function() {

	var nowTime = 0,
			lastTime = 0,
			elapsedTime = 0,
      Timer;

	Timer = function() {
		this.fps = 0;
		this.lastDelta = 0;
		this.maxSamples = 60;
		this.samples = [];
	};
	
	Timer.prototype.start = function() {
		nowTime = new Date().getTime();
		lastTime = nowTime;
		elapsedTime = 0;
		return this;
	};
	
	Timer.prototype.stop = function() {
		var now = new Date().getTime(),
        sample, i, l, fps = 0;
		
    lastTime = nowTime;
		nowTime = now;
		elapsedTime = nowTime - lastTime;
		sample = 1000.0 / elapsedTime;
				
		if (this.samples.unshift(sample) > this.maxSamples) {
      this.samples.pop();     
    }
		
		for (i = 0, l = this.samples.length; i < l; i++) {
			fps += this.samples[i];
		}
		fps /= this.samples.length;
		
		this.fps = Math.round(fps);
		this.lastDelta = elapsedTime;
		return this;
	};
	
	Timer.prototype.clear = function() {
		nowTime = 0;
		lastTime = 0;
		elapsedTime = 0;
		
		this.fps = 0;
		this.lastDelta = 0;
		this.samples = [];
		return this;
	};
	
	BenchGL.Timer = Timer;

}());

