// logger.js

(function(){
  
  var instance, Logger;

  Logger = function Logger(){
    if (instance) {
      return instance;
    }
    instance = this;
  };
  
  Logger.prototype.log = function(message){
    console.log(message);
  };
  
  BenchGL.Logger = Logger;
  
}());
