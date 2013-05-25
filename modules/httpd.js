(function() {
  "use strict";

  var Proc    = require('./Proc.js')
    , Net     = require('./Net.js')
    , httpd_p = new Proc()
    , httpd_n = new Net()
    , util    = require('util')
    ;

  httpd_p.name    = 'Apache';
  httpd_p.s_name  = 'httpd';
  httpd_p.pidfile = '/usr/local/apache/logs/httpd.pid';

  httpd_n.name    = 'Apache';
  httpd_n.s_name  = 'httpd';

  module.exports = [httpd_p, httpd_n];
}());
