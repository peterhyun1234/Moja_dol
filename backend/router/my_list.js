var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;


router.get('/show_all_mylist', function (req, res) {

    var recv_uID = req.body.uID;

    //console.log('/policy/show_all_policies Processing completed');
    connection.query('SELECT s_p_code from store_policy where uID = \'' + recv_uID + '\'', function (err, data) {
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


router.post("/store_in_mylist", function (req, res, next) {

    var recv_uID = req.body.uID;
    var recv_s_p_code = req.body.s_p_code;

    var SQL = 'INSERT INTO stored_policy (uID, s_p_code) VALUES(' +
    '\'' + recv_uID + '\''
    ', ' + recv_s_p_code + ')';

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
