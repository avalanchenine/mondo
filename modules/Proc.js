(function() {
  "use strict";

  var Monitor = require('./Monitor.js')
    , util = require('util')
    , fs   = require('fs')
    ;

  util.inherits(Proc, Monitor);
  Proc.prototype.pidfile = '';
  Proc.prototype.init  = init;

  function Proc() {}

  function init() {
    var self = this
      ;
    function proc() {
      function ensureFile() {
        fs.lstat(self.pidfile, function(err,stat) {
          if(err) {
            self.emit('warn', {name: self.s_name, message: 'Pid file missing!'});
            return;
          }
          if(stat.isFile()) {
            readPid();
          }
        });
      }

      function readPid() {
        fs.readFile(self.pidfile, 'utf-8', function(err,pid) {
          if(err) { console.log('err: ', err); return;}
          checkState(pid.replace(/\s+/g, ''));
        });
      }
      
      function checkState(pid) {
        fs.readFile('/proc/' + pid + '/status', 'utf-8', function(err,data) {
          var datas
            ;
          if(err || data === undefined) {
            self.emit('crit', {name: self.s_name, message: self.name.toUpperCase() + ' CRASHED!'});
            return;
          } else {
            datas = data.split('\n');
          }

          if(datas[0].indexOf(self.s_name) == -1) {
            self.emit('crit', {name: self.s_name, message: 'Incorrect pid for ' + self.name + '. Probably dead.'});
            return;
          }
          self.emit('info', {name: self.s_name, message: 'Everything fine for ' + self.name + '.'});

        });

      }
      ensureFile();
    }
    this.intervals.push(setInterval(proc, this.period));
  }

  module.exports = Proc;
}());
