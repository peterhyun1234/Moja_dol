var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;

// 오늘 TOP20 조회수
router.get("/day_views", function (req, res, next) {

    var SQL = 'SELECT p_code, title, apply_start, apply_end from policy, stored_policy where p_code = s_p_code AND uID = \'' + recv_uID + '\'';

    console.log("API '/sorting/today_views' called");
    console.log(SQL);

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

// 이번 주 TOP20 조회수
router.get("/week_views", function (req, res, next) {

    var SQL = 'SELECT p_code, title, apply_start, apply_end from policy, stored_policy where p_code = s_p_code AND uID = \'' + recv_uID + '\'';

    console.log("API '/sorting/week_views' called");
    console.log(SQL);

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

// 이번 달 TOP20 조회수
router.get("/month_views", function (req, res, next) {

    var SQL = 'SELECT p_code, title, apply_start, apply_end from policy, stored_policy where p_code = s_p_code AND uID = \'' + recv_uID + '\'';

    console.log("API '/sorting/month_views' called");
    console.log(SQL);

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
