(function() {
  "use strict";
  var interval
    ;

  function runchecks() {

    var net = require('net')
      , mysql = net.connect(3306, '127.0.0.1')
      , httpd = net.connect(80, '49.29.20.10')
      ;

    mysql.setTimeout(500);
    httpd.setTimeout(500);

    mysql.on('connect', function() {
      console.log('mysql OK');
      mysql.end();
    });

    httpd.on('error', function(e) {
      console.log(e);

    });

    httpd.on('timeout', function() {
      httpd.destroy();
      console.log('httpd timed out! Lighting fire!');
    });

    httpd.on('connect', function(connect) {
      console.log('httpd is okay.');
      httpd.end();
    });
  }

  interval = setInterval(runchecks, 20000);
}());
