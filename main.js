(function() {
  "use strict";
  var config  = require('./config.js')
    , fs      = require('fs')
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
      modules[module].ev.addListener('fail', handleFail);
      modules[module].init();
    });
    console.log('Loaded and initialized.');
  }


  function handleFail(data) {
    console.log('Omg a fail event! data:\n', data);

  }

  loadModules();

}());
