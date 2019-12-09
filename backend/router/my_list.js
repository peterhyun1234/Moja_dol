var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;

let { PythonShell } = require('python-shell');


router.post("/show_all_mylist", function (req, res, next) {

    var recv_uID = req.body.uID;

    var SQL = 'SELECT p_code, title, apply_start, apply_end from policy, stored_policy where p_code = s_p_code AND uID = \'' + recv_uID + '\'';

    console.log("API '/my_list/show_all_mylist' called");
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

router.post("/store_in_mylist", function (req, res, next) {

    var recv_uID = req.body.uID;
    var recv_s_p_code = req.body.s_p_code;


    console.log("API 'my_list/store_in_mylist' called");




    const promise1 = function (recv_uID) {
        return new Promise(function (resolve, reject) {
            if (recv_uID) {
                var SQL = 'INSERT INTO stored_policy (uID, s_p_code, s_p_time) SELECT ' +
                    '\'' + recv_uID + '\'' +
                    ', ' + recv_s_p_code +
                    ', ' + 'DATE_SUB(NOW(), INTERVAL -9 HOUR)' +
                    ' WHERE NOT EXISTS (SELECT s_p_code FROM stored_policy WHERE uID = ' +
                    '\'' + recv_uID + '\'' + ' AND ' +
                    's_p_code = ' + recv_s_p_code + ')';

                console.log(SQL);
                //절 차 
                connection.query(SQL, function (err, data) {
                    if (!err) {
                        // finally
                        res.send(data);
                        resolve("complete");
                    }
                    else {
                        console.log(err);
                        res.send('error');
                    }
                });
            }
            else {
                reject("fail");
            }
        });
    }

    promise1(recv_uID).then(function (result) {

        var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python3.7',
            pythonOptions: ['-u'],
            scriptPath: 'KNN',
            args: [recv_uID]
        };

        PythonShell.run('knn_base_rec.py', options, function (err, results) {
            if (err) {
                throw err;
            }
            console.log("result: " + results);
        });

    }, function (err) {
        console.log(err);
        res.send("fail");
    });


});

router.post("/ordered_mylist", function (req, res, next) {

    var recv_uID = req.body.uID;
    var recv_Sort_by = req.body.Sort_by;
    // my List 정렬 기준 두가지 (type: String)
    // 1. "저장날짜순"
    // 2. "지원날짜순"

    var sortingList = ["저장날짜순", "지원날짜순"];
    var after_sortingList = ["s_p_time DESC", "apply_end is null ASC, apply_end ASC"];

    var ORDER_SQL = 'ORDER BY s_p_time DESC'; //default

    //console.log("sortingList.lenth: " + sortingList.length);

    for (var i = 0; i < sortingList.length; i++) {
        //console.log("recv_Sort_by: " + recv_Sort_by);
        if (recv_Sort_by == sortingList[i]) {
            //console.log("same: " + recv_Sort_by);
            ORDER_SQL = "ORDER BY " + after_sortingList[i];
        }
    }

    var SQL = 'SELECT p_code, title, ' +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end " +
        'from stored_policy, policy ' +
        'where p_code = s_p_code ' +
        'AND uID = \'' + recv_uID + '\' ' +
        ORDER_SQL;

    console.log("API 'my_list/ordered_mylist' called");
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

router.post("/delete", function (req, res, next) {

    var recv_uID = req.body.uID;
    var recv_s_p_code = req.body.s_p_code;


    console.log("API 'my_list/delete' called");


    const promise1 = function (recv_uID) {
        return new Promise(function (resolve, reject) {
            if (recv_uID) {
                var SQL = 'DELETE FROM stored_policy where ' +
                    'uID = \'' + recv_uID + '\' AND ' +
                    's_p_code = ' + recv_s_p_code ;


                console.log(SQL);
                 
                connection.query(SQL, function (err, data) {
                    if (!err) {
                        res.send(data);
                        resolve("complete");
                    }
                    else {
                        console.log(err);
                        res.send('error');
                    }
                });

            }
            else {
                reject("fail");
            }
        });
    }

    promise1(recv_uID).then(function (result) {

        var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python3.7',
            pythonOptions: ['-u'],
            scriptPath: 'KNN',
            args: [recv_uID]
        };

        PythonShell.run('knn_base_rec.py', options, function (err, results) {
            if (err) {
                throw err;
            }
            console.log("result: " + results);
        });

    }, function (err) {
        console.log(err);
        res.send("fail");
    });

});


module.exports = router;
