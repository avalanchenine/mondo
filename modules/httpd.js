(function() {
  "use strict";

  var net = require('net')
    , ev  = require('events')
    , emtr = new ev.EventEmitter()
    , fs = require('fs')
    , pidfile = '/usr/local/apache/logs/httpd.pid'
    , iv = []
    ;
  
  function init() {
    iv.push(setInterval(conn, 2000));
    iv.push(setInterval(proc, 8000));
  }

  function conn() {
    var httpd = new net.Socket()
      ;

    httpd.setTimeout(500);
    httpd.on('error', function(e) {
      emtr.emit('fail', {name: 'httpd', port: 80, message: e.errno});
    });
    httpd.on('timeout', function() {
      httpd.destroy();
      emtr.emit('fail', {name: 'httpd', port: 80, message: "Timeout!"});
    });
    httpd.on('connect', function(connect) {
      console.log('conn good.');
      httpd.end();
    });
    httpd.connect(80);
  }

  function proc() {
    function ensureFile() {
      fs.lstat(pidfile, function(err,stat) {
        if(err) {
          emtr.emit('fail', {name: 'httpd', message: 'pid file missing!'});
          return;
        }
        if(stat.isFile()) {
          readPid();
        }
      });
    }

    function readPid() {
      fs.readFile(pidfile, 'utf-8', function(err,pid) {
        if(err) { console.log('err: ', err); return;}
        checkState(pid.replace(/\s+/g, ''));
      });
    }
    
    function checkState(pid) {
      fs.readFile('/proc/' + pid + '/status', 'utf-8', function(err,data) {
        var datas = data.split('\n')
          ;

        if(err) { 
          emtr.emit('fail', {name: 'httpd', message: 'APACHE CRASHED!'});
          return;
        }

        if(datas[0].indexOf('httpd') == -1) {
          emtr.emit('fail', {name: 'httpd', message: 'pid file incorrect!'});
          return;
        }
        console.log('everything appears fine.');

      });

    }
    ensureFile();
  }

  module.exports.init = init;
  module.exports.emtr = emtr;
}());
