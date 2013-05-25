(function() {
  "use strict";

  var net = require('net')
    , ents = require('events')
    , ev  = new ents.EventEmitter()
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
      ev.emit('crit', {name: 'httpd', port: 80, message: e.errno});
    });
    httpd.on('timeout', function() {
      httpd.destroy();
      ev.emit('crit', {name: 'httpd', port: 80, message: "Timeout!"});
    });
    httpd.on('connect', function(connect) {
      ev.emit('info', {name: 'httpd', message: 'httpd is OK.'});
      httpd.end();
    });
    httpd.connect(80);
  }

  function proc() {
    function ensureFile() {
      fs.lstat(pidfile, function(err,stat) {
        if(err) {
          ev.emit('warn', {name: 'httpd', message: 'pid file missing!'});
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
        var datas
          ;
        if(err || data === undefined) {
          ev.emit('crit', {name: 'httpd', message: 'APACHE CRASHED!'});
          return;
        } else {
          datas = data.split('\n');
        }

        if(datas[0].indexOf('httpd') == -1) {
          ev.emit('crit', {name: 'httpd', message: 'pid file incorrect!'});
          return;
        }

      });

    }
    ensureFile();
  }

  module.exports.init = init;
  module.exports.ev = ev;
}());
