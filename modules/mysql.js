(function() {
  "use strict";

  var Proc  = require('./Proc.js')
    , Net   = require('./Net.js')
    , mysql_p = new Proc()
    , mysql_n = new Net()
    , util  = require('util')
    ;

  mysql_p.name    = 'MySQL';
  mysql_p.s_name  = 'mysql';
  mysql_p.pidfile = '/var/run/mysqld/mysqld.pid';

  mysql_n.name    = 'MySQL';
  mysql_n.s_name  = 'mysql';
  mysql_n.port    = 3306;  

  module.exports = [mysql_p, mysql_n];
}());
