
var express = require('express');
var router = express.Router();

var connection = require('../index.js').connection;

router.get('/info', function (req, res) {
   connection.query('SELECT id, password from admin_user', function (err, data) {
      if (!err) {
         //console.log(data);
         res.send(data);
      }
      else {
         console.log(err);
         res.send('error');
      }
   });
});

router.post("/certificate", function (req, res, next) {
   var recv_id = req.body.id;
   var recv_password = req.body.password;
   var SQL = 'SELECT 1 FROM admin_user WHERE id = \'' + recv_id + '\' and password = \'' + recv_password + '\'';

   console.log(SQL);
   //console.log(recv_id + ", " + recv_password);
   //절 차 
   connection.query(SQL, function (err, data) {
      console.log(data);
      if (data.length == '1') {
         //console.log("비밀번호 일치");
         res.send('1');
      }
      else {
         console.log("비밀번호 불일치");
         res.send('-1');
      }
   });
});

module.exports = router;
