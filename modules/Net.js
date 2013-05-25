(function() {
  "use strict";

  var Monitor = require('./Monitor.js')
    , util = require('util')
    , net   = require('net')
    ;

  util.inherits(Net, Monitor);
  Net.prototype.port    = 80;
  Net.prototype.period  = 2000;
  Net.prototype.init    = init;

  function Net() {}

  function init() {
    var self = this
      ;
    function conn() {
      var sock = new net.Socket()
        ;

      sock.setTimeout(500);
      sock.on('error', function(e) {
        self.emit('crit', {name: self.s_name, port: self.port, message: e.errno});
      });
      sock.on('timeout', function() {
        sock.destroy();
        self.emit('crit', {name: self.s_name, port: self.port, message: "Timeout!"});
      });
      sock.on('connect', function(connect) {
        self.emit('info', {name: self.s_name, message: 'sock is OK.'});
        sock.end();
      });
      sock.connect(self.port);
    }
    this.intervals.push(setInterval(conn, this.period));
  }

  module.exports = Net;
}());
