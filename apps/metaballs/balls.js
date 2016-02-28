
(function() {

	var random = Math.random,
			floor = Math.floor;

	Metaballs = function(n, grid) {
		var balls = this.balls = [],
				x = grid.x,
	      xstart = x.start,
	      xend = x.end,
	      y = grid.y,
	      ystart = y.start,
	      yend = y.end,
	      z = grid.z,
	      zstart = z.start,
	      zend = z.end;
		
		for (var i = 0; i < n; i++) {
			balls.push({
				pos : {
	        x: (xstart + random() * (xend - xstart)) / 1.5,
	        y: (ystart + random() * (yend - ystart)) / 1.5,
	        z: (zstart + random() * (zend - zstart)) / 1.5
				},
				vel : {
	        x: (2 * random() -1) * (xend - xstart) / 80,
	        y: (2 * random() -1) * (yend - ystart) / 80,
	        z: (2 * random() -1) * (zend - zstart) / 80
				}
			});
		}
		
		this.n = n;
		this.grid = grid;
	};
	
	Metaballs.prototype.update = function() {
		var balls = this.balls,
				grid = this.grid;
				
		for (var i = 0, l = balls.length; i < l; i++) {
			var ball = balls[i],
					pos = ball.pos,
					vel = ball.vel;
			for (var e in pos) {
				var p = pos[e],
						v = vel[e],
						g = grid[e];
				
        if (p + v < g.start/1.5 || p + v > g.end/1.5) {
          vel[e] *= -1;
          v *= -1;
        }
				
				pos[e] = p + v;
			}
		}
	};
	
	Metaballs.prototype.toArray = function() {
		return this.balls;
	};
	
})();