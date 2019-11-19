
var express = require('express');
var router = express.Router();

var connection = require('../index.js').connection;

router.post("/send_req", function (req, res, next) {
    
    // 사용자의 ID (type: string)
    var recv_uID = req.body.req_uID;
    
    // request의 유형 (type: string)
    // egg.
    // 서비스 불만
    // 정책 수정
    // 회원탈퇴요청
    var recv_category = req.body.req_category;

    // request의 내용 (type: string)
    var recv_contents = req.body.req_contents;
    
    var SQL = 'INSERT INTO request (req_uID, req_category, req_contents) VALUES(' +
    '\'' + recv_uID + '\'' +
    ', \'' + recv_category + '\'' +
    ', \'' + recv_contents + '\')';

    console.log(SQL);
    //절 차 
    connection.query(SQL, function (err, data) {
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

router.post("/show_all_reqs", function (req, res, next) {
    var SQL = 'SELECT * FROM request';

    console.log(SQL);
    //절 차 
    connection.query(SQL, function (err, data) {
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

router.post("/change_flag", function (req, res, next) {
   
    var recv_code = req.body.req_code;
    var recv_flag = req.body.req_flag;
    //console.log('req_code: '+recv_code + 'req_flag: '+ recv_flag);
    
    var SQL = 'UPDATE request SET req_flag = ' + recv_flag + ' WHERE  req_code = '+ recv_code ;

    console.log(SQL);
    //절 차 
    connection.query(SQL, function (err, data) {
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
