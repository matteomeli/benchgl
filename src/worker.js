// worker.js
// Part of the extra module, provides support to Web Workers.

BenchGL.namespace('BenchGL.extra.WorkerPool');

BenchGL.extra.WorkerPool = (function() {
	
	// Private properties and methods
	var WorkerPool;
	
  WorkerPool = function(filename, n){
    this.workers = [];
    this.configs = [];
    while (n--) {
      this.workers.push(new Worker(filename));
    }
  };
  
  WorkerPool.prototype.map = function(mapper){
    var i, l;
    for (i = 0, l = this.workers.length; i < l; i++) {
      this.configs.push(mapper(i));
    }
  };
  
  WorkerPool.prototype.reduce = function(reducer, callback, base){
    var total = base,
        l = this.workers.length,
        message = function(e){
          l--;
          if (total === "undefined") {
            total = e.data;
          }
          else {
            reducer(total, e.data);
          }
          if (l === 0) {
            callback(total);
          }
        },
        i, worker;
    
    for (i = 0, l = this.workers.length; i < l; i++) {
      worker = this.workers[i];
      worker.onmessage = message;
      worker.postMessage(this.configs[i]);
    }
  };
  
  WorkerPool.prototype.shutDown = function(){
    var workers = this.workers, 
        worker, i, l;
        
    for (i = 0, l = workers.length; i < l; i++) {
      worker = workers[i];
      worker.terminate();
    }
  };
  
  WorkerPool.prototype.clean = function(){
    this.configs = [];
  };
  
  return WorkerPool;
  
}());
