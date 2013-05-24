(function() {
  "use strict";
  var handlers = {}
    ;

  handlers.crit = function(data) {
    console.log('Crit event received. Relevant data: ', data);
  }

  handlers.warn = function(data) {
    console.log('Warn event received. Relevant data: ', data);

  }

  handlers.info = function(data) {
    console.log('Info event received. Relevant data: ', data);

  }


  module.exports = handlers;

}());
