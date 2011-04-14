
self.onmessage = function(e) {
	var start = new Date().getTime(),
			end, elapsed;
	for (var n = e.data.from; n <= e.data.to; n += 1) {
		var found = false;
		for (var i = 2; i <= Math.sqrt(n); i += 1) {
			if (n % i == 0) {
				found = true;
				break;
			}
		}
		if (!found) {
			// found a prime!		
			//postMessage(n);
			// do nothing
			;
		}
	}
	end = new Date().getTime();
	postMessage({
		start : start,
		end : end
	});
}