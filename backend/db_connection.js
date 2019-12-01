var mysql = require('mysql');
var mysql_db = require('./config/mysql.js').local;


module.exports = function () {
  return {
    mysql_init: function () {
      return mysql.createConnection({
        host: mysql_db.host,
        port: mysql_db.port,
        user: mysql_db.user,
        password: mysql_db.password,
        database: mysql_db.database
      })
    },
    mysql_open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      })
    }
  }
}();