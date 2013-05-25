(function() {
  "use strict";
  var util    = require('util')
    , events  = require('events')
    ;

  function Monitor() {}
  util.inherits(Monitor, events.EventEmitter);

  Monitor.prototype.name      = 'Module Name'      // e.g. Apache
  Monitor.prototype.s_name    = 'service_name'     // e.g. httpd
  Monitor.prototype.period    = 8000   // How often check is run in milliseconds
  Monitor.prototype.intervals = []                 // Array of interval objects
  Monitor.prototype.init      = function(){}       // start periodic checks.
  //Monitor.prototype.check     = function(){}       // the check

  module.exports = Monitor;
}());
