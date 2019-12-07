
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

   const IP = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;

   var SQL = "UPDATE admin_user " +
   "SET id = '" + recv_id + "', password = '" + recv_password + "', login_IP = '" + IP + "'" +
   "WHERE id = '" + recv_id + "' AND password = '" + recv_password + "'";

   console.log(SQL);
   //console.log(recv_id + ", " + recv_password);
   //절 차 
   connection.query(SQL, function (err, data) {
      console.log(data.affectedRows);
      if (data.affectedRows == 1) {
         console.log("비밀번호 일치");
         res.send('1');
      }
      else {
         console.log("비밀번호 불일치");
         res.send('-1');
      }
   });
});

router.post("/session_certificate", function (req, res, next) {


   const IP = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;

   var SQL = "SELECT 1 FROM admin_user WHERE login_IP = '" + IP + "'";

   console.log(SQL);
   //console.log(recv_id + ", " + recv_password);
   //절 차 
   connection.query(SQL, function (err, data) {
      //console.log(data);
      if (data.length != 0) {
        // console.log("성공");
         res.send('1');
      }
      else {
        // console.log("실패");
         res.send('-1');
      }
   });
});

router.post("/logout", function (req, res, next) {


   const IP = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;

   var SQL = "UPDATE admin_user SET login_IP = '0' WHERE login_IP = '" + IP + "'";

   console.log(SQL);
   //console.log(recv_id + ", " + recv_password);
   //절 차 
   connection.query(SQL, function (err, data) {
      //console.log(data);
      if (data.length != 0) {
        // console.log("성공");
         res.send('1');
      }
      else {
        // console.log("실패");
         res.send('-1');
      }
   });
});

module.exports = router;
