
var express = require('express');
var router = express.Router();

var connection = require('../index.js').connection;

router.get('/show_all_users', function (req, res) {

    var SQL = 'SELECT * from user';

    console.log("API 'user/show_all_users' called");
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

router.get('/info', function (req, res) {

    var SQL = 'SELECT id, password from admin_web';

    console.log("API 'user/info' called");
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

router.post("/register", function (req, res, next) {
    // 사용자 ID (type: string)
    var recv_uID = req.body.uID;

    // 사용자 이름 (type: string) - 꼭 필요한 건 아님
    var recv_name = req.body.name;

    // 사용자 사는 지역 (type: string)
    var recv_region_arr = req.body.region;
    var region_arr_len = recv_region_arr.length;
    console.log("region_arr_len: " + region_arr_len);
    var recv_region;

    if (region_arr_len == 2 && recv_region_arr[1] != "") {
        recv_region = recv_region_arr[0] + " " + recv_region_arr[1];
    }
    else if(region_arr_len == 1 || recv_region_arr[1] == "")
    {
        recv_region = recv_region_arr[0];
    }
    else {
        recv_region = "미정";
    }
    // 사용자 나이 (type: integer)
    var recv_age = req.body.age;
    if (recv_age == null || recv_age.length == 0) {
        recv_age = 0;
    }
    // 취업지원에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Employment_sup_priority = req.body.Employment_sup_priority;
    if (recv_Employment_sup_priority == null || recv_Employment_sup_priority.length == 0) {
        recv_Employment_sup_priority = 0;
    }

    // 창업지원에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Startup_sup_priority = req.body.Startup_sup_priority;
    if (recv_Startup_sup_priority == null || recv_Startup_sup_priority.length == 0) {
        recv_Startup_sup_priority = 0;
    }

    // 생활과 복지에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Life_welfare_priority = req.body.Life_welfare_priority;
    if (recv_Life_welfare_priority == null || recv_Life_welfare_priority.length == 0) {
        recv_Life_welfare_priority = 0;
    }

    // 주거와 금융에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Residential_financial_priority = req.body.Residential_financial_priority;
    if (recv_Residential_financial_priority == null || recv_Residential_financial_priority.length == 0) {
        recv_Residential_financial_priority = 0;
    }


    var SQL = 'INSERT INTO user VALUES(' +
        '\'' + recv_uID + '\'' +
        ', \'' + recv_name + '\'' +
        ', \'' + recv_region + '\'' +
        ', ' + recv_age +
        ', ' + recv_Employment_sup_priority +
        ', ' + recv_Startup_sup_priority +
        ', ' + recv_Life_welfare_priority +
        ', ' + recv_Residential_financial_priority + ') ' +
        "ON DUPLICATE KEY UPDATE " +
        "uID = '" + recv_uID + "', " +
        "name = '" + recv_name + "', " +
        "region = '" + recv_region + "', " +
        "age = " + recv_age + ", " +
        "Employment_sup_priority = " + recv_Employment_sup_priority + ", " +
        "Startup_sup_priority = " + recv_Startup_sup_priority + ", " +
        "Life_welfare_priority = " + recv_Life_welfare_priority + ", " +
        "Residential_financial_priority = " + recv_Residential_financial_priority;

    console.log("API 'user/register' called");
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

router.post("/update", function (req, res, next) {

    //파일 형식 테스트 필요함!!
    var recv_uID = req.body.uID;
    var recv_name = req.body.name;
    var recv_region = req.body.region;
    var recv_age = req.body.age;
    var recv_Employment_sup_priority = req.body.Employment_sup_priority;
    var recv_Startup_sup_priority = req.body.Startup_sup_priority;
    var recv_Life_welfare_priority = req.body.Life_welfare_priority;
    var recv_Residential_financial_priority = req.body.Residential_financial_priority;

    var SQL = 'UPDATE user SET ' +
        'name = \'' + recv_name + '\'' +
        ',region = \'' + recv_region + '\'' +
        ',age = ' + recv_age +
        ',Employment_sup_priority = ' + recv_Employment_sup_priority +
        ',Startup_sup_priority = ' + recv_Startup_sup_priority +
        ',Life_welfare_priority = ' + recv_Life_welfare_priority +
        ',Residential_financial_priority = ' + recv_Residential_financial_priority +
        'WHERE uID = \'' + recv_uID + '\'';

    console.log("API 'user/update' called");
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
