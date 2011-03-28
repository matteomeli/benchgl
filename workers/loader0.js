
self.addEventListener('message', function(e) {
	e.data.numero = e.data.numero + 1;
  self.postMessage(e.data.numero);
	self.postMessage(e.data.stringa);
	self.postMessage(e.data.array);
	self.postMessage(e.data.oggetto);
}, false);