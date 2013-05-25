(function() {
  "use strict";
  var config  = require('./config.js')
    , fs      = require('fs')
    , handlers = require('./handlers.js')
    , modules = {}
    ;
  function loadModules() {
    fs.readdir(config.module_location, function(err, files) {
      var isjs = new RegExp('\.js$');
      if(err) {
        console.error("Problem opening modules directory: ", err);
        process.exit(1);
      }
      files.forEach(function(file_name) {
        file_name = file_name.replace('/\s+/', ''); // chomp
        if(isjs.test(file_name)) {
          // strip off .js, compare to config, and push onto modules.
          file_name = file_name.replace(isjs, '');
          if(config.watch.indexOf(file_name) != -1) {
            console.log('Loaded: ', file_name);
            modules[file_name] = require(config.module_location + '/' + file_name + '.js');
          }
        }
      });
      initModules();
    });
  }

  function initModules() {
    Object.keys(modules).forEach(function(module) {
      if(modules[module] instanceof Array) {
        modules[module].forEach(function(multi) {
          Object.keys(handlers).forEach(function(handler) {
            multi.addListener(handler, handlers[handler]);
          });
        });
      } else {
        Object.keys(handlers).forEach(function(handler) {
          modules[module].addListener(handler, handlers[handler]);
        });
      }
      if(modules[module] instanceof Array) {
        modules[module].forEach(function(multi) {
          multi.init();
        });
      } else {
        modules[module].init();
      }
    });
    console.log('Loaded and initialized.');
  }

  loadModules();

}());
