
var express = require('express');
var router = express.Router();

var connection = require('../index.js').connection;

router.get('/info', function (req, res) {
    connection.query('SELECT id, password from admin_user', function (err, data) {
        if (!err) {
            console.log(data);
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
            console.log(data);
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
    console.log('req_code: '+recv_code + 'req_flag: '+ recv_flag);
    
    var SQL = 'UPDATE request SET req_flag = ' + recv_flag + ' WHERE  req_code = '+ recv_code ;

    console.log(SQL);
    //절 차 
    connection.query(SQL, function (err, data) {
        if (!err) {
            console.log(data);
            res.send(data);
        }
        else {
            console.log(err);
            res.send('error');
        }
    });
});

module.exports = router;
