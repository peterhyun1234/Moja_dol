var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;

router.post("/show_all_mylist", function (req, res, next) {

    var recv_uID = req.body.uID;

    //console.log('/policy/show_all_policies Processing completed');
    connection.query('SELECT p_code, title, apply_start, apply_end from policy, stored_policy where p_code = s_p_code AND uID = \'' + recv_uID + '\'', function (err, data) {


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
    //var recv_date = req.body.s_p_time;
    //var temp_date;

    //if (recv_date != null) {
        //temp_date = recv_date;
        //recv_date = '\'' + temp_date + '\'';
    //}

    var SQL = 'INSERT INTO stored_policy (uID, s_p_code, s_p_time) SELECT ' +
        '\'' + recv_uID + '\'' +
        ', ' + recv_s_p_code +
        ', ' + 'DATE_SUB(NOW(), INTERVAL -9 HOUR)' +
	' FROM DUAL WHERE 0 = (SELECT count(*) FROM stored_policy WHERE uID = ' +
        '\'' + recv_uID + '\'' + ' AND '+
	's_p_code = ' + recv_s_p_code + ')';
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

router.post("/ordered_mylist", function (req, res, next) {
    var recv_uID = req.body.uID;

    //console.log('/policy/show_all_policies Processing completed');
    connection.query('SELECT p_code, title, apply_start, apply_end from stored_policy, policy where p_code = s_p_code AND uID = \'' + recv_uID + '\' ' + 'ORDER BY s_p_time DESC', function (err, data) {
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

router.post("/delete", function (req, res, next) {

    var recv_uID = req.body.uID;
    var recv_s_p_code = req.body.s_p_code;

    var SQL = 'DELETE FROM stored_policy where ' +
        'uID = \'' + recv_uID + '\' AND ' +
    's_p_code = ' + recv_s_p_code;

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
