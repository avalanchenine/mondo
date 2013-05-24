(function() {
  "use strict";
  var config = require('./config.js')
// Modules start here.
    , httpd  = require('./modules/httpd.js')
    ;

  if(config.watch.indexOf('httpd') != -1) {
    httpd.emtr.addListener('fail', handleFail);
    httpd.init();
  }

  function handleFail(data) {
    console.log('Omg a fail event! data:\n', data);

  }


  console.log(config.watch);

}());
