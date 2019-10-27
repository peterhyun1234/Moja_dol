
var express = require('express');
var router = express.Router();

var connection = require('../index.js').connection;

// router.get('/info', function (req, res) {
//    connection.query('SELECT id, password from admin_user', function (err, data) {
//       if (!err) {
//          //console.log(data);
//          res.send(data);
//       }
//       else {
//          console.log(err);
//          res.send('error');
//       }
//    });
// });

router.post("/selected_review", function (req, res, next) {
   var recv_code = req.body.p_code;
   var SQL = 'SELECT * FROM review WHERE p_code = \'' + recv_code + '\'';

   //console.log(SQL);
   //console.log(recv_id + ", " + recv_password);
   //절 차 
   connection.query(SQL, function (err, data) {
      //console.log(data);
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

module.exports = router;
