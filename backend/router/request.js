
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

router.post("/show_all_reqs", function (req, res, next) {
    var SQL = 'SELECT * FROM request';

    //console.log(SQL);
    //절 차 
    connection.query(SQL, function (err, data) {
        console.log(data);
        res.send(data);
    });
});

router.post("/change_flag", function (req, res, next) {
   
    var recv_code = req.body.code;
    var recv_flag = req.body.flag;

    var SQL = 'UPDATE request SET req_flag = \'' + recv_flag + 'WHERE code = \''+ recv_code +'\'';

    //console.log(SQL);
    //절 차 
    connection.query(SQL, function (err, data) {
        console.log(data); //결과 뭐 나오는지 아직 잘 모르겠음
        res.send(data);
    });
});

module.exports = router;
