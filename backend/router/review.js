
var express = require('express');
var router = express.Router();

var connection = require('../index.js').connection;


router.get('/:id', function (req, res) {
   var policy_params = req.params.id;
   //console.log('selected review is ' + policy_params);
   //CONVERT_TZ(review_time, "+0:00", "+9:00") 
   var SQL = 'SELECT * from review where p_code = ' + policy_params ;

   console.log("API 'review/:id' called");
   console.log(SQL);
   
   connection.query( SQL, function (err, data) {
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

router.post("/selected_review", function (req, res, next) {
   var recv_code = req.body.p_code;
   var SQL = 'SELECT * FROM review WHERE p_code = ' + recv_code;

   console.log("API 'review/selected_review' called");
   console.log(SQL);
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

router.post("/write_review", function (req, res, next) {
   var recv_id = req.body.review_uID;
   var recv_code = req.body.p_code;
   var recv_contents = req.body.contents;
   //var recv_date  = req.body.review_time;
   //var temp_date;

//    if(recv_date != null){
//       temp_date = recv_date;
//       recv_date = '\''+ temp_date +'\'';
//   }

   var SQL = 'INSERT INTO review (p_code, review_uID, contents, review_time)'+
   'VALUES (' +
   recv_code +
   ',\'' + recv_id + '\'' +
   ',\'' + recv_contents + '\'' +
   ',' + 'DATE_SUB(NOW(), INTERVAL -9 HOUR)' + 
   ')';
   console.log("API 'review/write_review' called");
   console.log(SQL);
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

router.post("/delete_review", function (req, res, next) {
    var recv_code = req.body.review_code;
    var SQL = 'DELETE FROM review WHERE review_code = ' + recv_code ;
 
    console.log("API 'review/delete_review' called");
    console.log(SQL);
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

 router.post("/delete_review", function (req, res, next) {
   var recv_code = req.body.review_code;
   var SQL = 'DELETE FROM review WHERE review_code = ' + recv_code ;

   console.log("API 'review/delete_review' called");
   console.log(SQL);
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

router.post("/delete_review_app", function (req, res, next) {
   var recv_code = req.body.review_code;
   var recv_uID = req.body.review_uID;

   var SQL = "DELETE FROM review " +
   "WHERE review_code = " + recv_code + " AND " +
   "review_uID = '" + recv_uID + "'";

   console.log("API 'review/delete_review_app' called");
   console.log(SQL);
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
