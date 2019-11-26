var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;

// 오늘 TOP20 조회수
router.get("/day_views", function (req, res, next) {

    var SQL = "SELECT p_code, title, apply_start, apply_end, " +
    "concat_ws('', (CASE Employment_sup WHEN '1' THEN '취업지원' END), " +
    "(CASE Startup_sup WHEN '1' THEN '창업지원' END), " +
    "(CASE Life_welfare WHEN 1 THEN '생활복지' END), " +
    "(CASE Residential_finance WHEN 1 THEN '주거금융' END)) AS category, " +
    "concat_ws(' ', dor, (CASE dor WHEN '전국' THEN '' ELSE si END)) AS region, " +
    "count(*) AS views " +
    "FROM policy NATURAL JOIN interest NATURAL JOIN click " + 
    "WHERE " +
    "click_time BETWEEN DATE_ADD(NOW(), INTERVAL -33 HOUR) AND DATE_SUB(NOW(), INTERVAL -9 HOUR) " +
    "GROUP BY p_code " +
    "ORDER BY views DESC " +
    "LIMIT 20";

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

    var SQL = "SELECT p_code, title, apply_start, apply_end, " +
    "concat_ws('', (CASE Employment_sup WHEN '1' THEN '취업지원' END), " +
    "(CASE Startup_sup WHEN '1' THEN '창업지원' END), " +
    "(CASE Life_welfare WHEN 1 THEN '생활복지' END), " +
    "(CASE Residential_finance WHEN 1 THEN '주거금융' END)) AS category, " +
    "concat_ws(' ', dor, (CASE dor WHEN '전국' THEN '' ELSE si END)) AS region, " +
    "count(*) AS views " +
    "FROM policy NATURAL JOIN interest NATURAL JOIN click " + 
    "WHERE " +
    "click_time BETWEEN DATE_ADD(NOW(), INTERVAL -1 WEEK) AND DATE_SUB(NOW(), INTERVAL -9 HOUR) " +
    "GROUP BY p_code " +
    "ORDER BY views DESC " +
    "LIMIT 20";

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

    var SQL = "SELECT p_code, title, apply_start, apply_end, " +
    "concat_ws('', (CASE Employment_sup WHEN '1' THEN '취업지원' END), " +
    "(CASE Startup_sup WHEN '1' THEN '창업지원' END), " +
    "(CASE Life_welfare WHEN 1 THEN '생활복지' END), " +
    "(CASE Residential_finance WHEN 1 THEN '주거금융' END)) AS category, " +
    "concat_ws(' ', dor, (CASE dor WHEN '전국' THEN '' ELSE si END)) AS region, " +
    "count(*) AS views " +
    "FROM policy NATURAL JOIN interest NATURAL JOIN click " + 
    "WHERE " +
    "click_time BETWEEN DATE_ADD(NOW(), INTERVAL -1 MONTH) AND DATE_SUB(NOW(), INTERVAL -9 HOUR) " +
    "GROUP BY p_code " +
    "ORDER BY views DESC " +
    "LIMIT 20";

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
