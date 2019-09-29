var mysql = require('mysql');
var db = require('./config/database.js').local;

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: db.host,
        port: db.port,
        user: db.user,
        password: db.password,
        database: db.database
      })
    },
    test_open: function (con) {
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