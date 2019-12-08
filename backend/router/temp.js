var express = require('express');
var router = express.Router();
let {PythonShell} = require('python-shell');

var connection = require('../index.js').connection;

router.get('/all_users', function (req, res) {

    var SQL = "SELECT uID, name, dor, si, age, sex from user " +
    "WHERE (uID <> 'iwsl1234@naver.com') OR (uID <> '054637@naver.com') OR (uID <> 'aaa@naver.com')";

    console.log("API 'temp/all_users' called");
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

router.get('/users_priority', function (req, res) {

    var SQL = 'SELECT uID, name, Employment_sup_priority, Startup_sup_priority, Life_welfare_priority, Residential_financial_priority from user ' +
    "WHERE (uID <> 'iwsl1234@naver.com') OR (uID <> '054637@naver.com') OR (uID <> 'aaa@naver.com')";

    console.log("API 'temp/users_priority' called");
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

router.get("/show_all_reqs", function (req, res, next) {


    var uID = "peterhyun1234@gmail.com";
    
    var options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: 'router',
        args: [uID]
    };

    //python shell test
    PythonShell.run('test.py', options, function (err, results){
        if(err)
        {
            throw err;
        }
        
        console.log("result: " + results);
        
    });


    var SQL = 'SELECT * FROM request';

    console.log("API 'temp/show_all_reqs' called");
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


//사용자
//1. 정책 키워드 검색 (temp/keyword_search)
router.get("/keyword_search", function (req, res, next) {

    var SQL = "SELECT policy.*, " +
        "(title LIKE '%시%') + (contents LIKE '%시%') + (title LIKE '%여러분%') + (contents LIKE '%여러분%') AS match_score " +
        "FROM policy  " +
        "WHERE (title LIKE '%시%' OR contents LIKE '%시%' OR title LIKE '%여러분%' OR contents LIKE '%여러분%' ) " +
        "ORDER BY match_score DESC, apply_end is null ASC, apply_end ASC";

    console.log("API 'temp/keyword_search' called");
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

//2. 나이 기반 정책 검색 (temp/age_search)
router.get("/age_search", function (req, res, next) {

    var SQL = "SELECT policy.*, " +
        "(title LIKE '%시%') + (contents LIKE '%시%') + (title LIKE '%여러분%') + (contents LIKE '%여러분%') AS match_score " +
        "FROM policy  " +
        "WHERE (title LIKE '%시%' OR contents LIKE '%시%' OR title LIKE '%여러분%' OR contents LIKE '%여러분%' ) " +
        "AND (end_age >= 25 AND start_age <= 25) " +
        "ORDER BY match_score DESC, apply_end is null ASC, apply_end ASC";

    console.log("API 'temp/age_search' called");
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

//3. 거주지 기반 정책 검색 (temp/location_search)
router.get("/location_search", function (req, res, next) {

    var SQL = "SELECT policy.*, " +
        "(title LIKE '%시%') + (contents LIKE '%시%') + (title LIKE '%여러분%') + (contents LIKE '%여러분%') AS match_score " +
        "FROM policy  " +
        "WHERE (title LIKE '%시%' OR contents LIKE '%시%' OR title LIKE '%여러분%' OR contents LIKE '%여러분%' ) " +
        "AND (end_age >= 25 AND start_age <= 25) " +
        "AND ((dor LIKE '경기%')) " +
        "ORDER BY match_score DESC, apply_end is null ASC, apply_end ASC";

    console.log("API 'temp/location_search' called");
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

//4. 지원분야 기반 검색 (temp/category_search)
router.get("/category_search", function (req, res, next) {

    var SQL = "SELECT policy.*, " +
        "concat_ws('', (CASE Employment_sup WHEN '1' THEN '취업지원' END), (CASE Startup_sup WHEN '1' THEN '창업지원' END), (CASE Life_welfare WHEN 1 THEN '생활복지' END), (CASE Residential_finance WHEN 1 THEN '주거금융' END)) AS category, " +
        "(title LIKE '%시%') + (contents LIKE '%시%') + (title LIKE '%여러분%') + (contents LIKE '%여러분%') AS match_score " +
        "FROM policy NATURAL JOIN interest " +
        "WHERE (Startup_sup = 1) " +
        "AND (title LIKE '%시%' OR contents LIKE '%시%' OR title LIKE '%여러분%' OR contents LIKE '%여러분%' ) " +
        "AND (end_age >= 25 AND start_age <= 25) " +
        "AND ((dor LIKE '경기%')) " +
        "ORDER BY match_score DESC, apply_end is null ASC, apply_end ASC";

    console.log("API 'temp/category_search' called");
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

//5. 사용자 맞춤 정책 추천 (temp/referral + temp/user_based_referral)
router.get("/referral", function (req, res, next) {

    var recv_uID = "peterhyun1234@gmail.com";

    var click_weight = 0.5;
    var mylist_weight = 0.5;
    var category_weight = 0.5;
    var age_SQL;
    var order_SQL;

    var SQL = "SELECT p_code, title, uri, policy.dor, policy.si, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, " +
        "(Employment_sup*user.Employment_sup_priority + " +
        "Startup_sup*user.Startup_sup_priority + " +
        "Life_welfare*user.Life_welfare_priority + " +
        "Residential_finance*user.Residential_financial_priority)*" + category_weight + " " +
        "AS cg_priority, " +
        "(Employment_sup*mylist_priority.Employment_sup_priority + " +
        "Startup_sup*mylist_priority.Startup_sup_priority + " +
        "Life_welfare*mylist_priority.Life_welfare_priority + " +
        "Residential_finance*mylist_priority.Residential_financial_priority)*" + mylist_weight + " " +
        "AS ml_priority, " +
        "(Employment_sup*click_priority.Employment_sup_priority + " +
        "Startup_sup*click_priority.Startup_sup_priority + " +
        "Life_welfare*click_priority.Life_welfare_priority + " +
        "Residential_finance*click_priority.Residential_financial_priority)*" + click_weight + " " +
        "AS cl_priority " +
        "FROM policy NATURAL JOIN interest, user, mylist_priority, click_priority " +
        "WHERE (user.uID = mylist_priority.uID) AND " +
        "(user.uID = click_priority.uID) AND " +
        "(mylist_priority.uID = click_priority.uID) AND " +
        "(user.uID = '" + recv_uID + "') AND " +
        "((policy.dor = '전국') OR (policy.dor = user.dor AND policy.si = '전체') OR (policy.dor = user.dor AND policy.si = user.si)) " +
        "ORDER BY (cg_priority + ml_priority + cl_priority) DESC, apply_end ASC " +
        "LIMIT 5";


    console.log("API 'temp/referral' called");
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

router.get("/user_based_referral", function (req, res, next) {

    var recv_uID = "peterhyun1234@gmail.com";
    var age_gap = 10;

    var age_SQL;
    var order_SQL;

    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, " +
        "count(*) AS policy_hits " +
        "FROM user NATURAL JOIN stored_policy, policy " +
        "WHERE " +
        "(p_code = s_p_code) AND " +
        "(age BETWEEN ((SELECT age FROM user WHERE uID = '" + recv_uID + "') - " + age_gap +
        ") AND ((SELECT age FROM user WHERE uID = '" + recv_uID + "') + " + age_gap + ")) AND " +
        "(start_age <= (SELECT age FROM user WHERE uID = '" + recv_uID + "') AND (SELECT age FROM user WHERE uID = '" + recv_uID + "') <= end_age) AND " +
        "((expiration_flag = 2) OR (apply_start <= NOW() AND apply_end >= NOW())) " +
        "GROUP BY p_code " +
        "ORDER BY policy_hits DESC " +
        "LIMIT 5";

    console.log("API 'temp/user_based_referral' called");
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


//6. 건의사항 작성 (temp/send_req)
router.post("/send_req", function (req, res, next) {
    // 사용자의 ID (type: string)
    var recv_uID = "peterhyun1234@gmail.com";

    // request의 유형 (type: string)
    // egg.
    // 서비스 불만
    // 정책 수정
    // 회원탈퇴요청
    var recv_category = "감사";

    // request의 내용 (type: string)
    var recv_contents = "잘썼습니다 감사합니다";

    var SQL = 'INSERT INTO request (req_uID, req_category, req_contents) VALUES(' +
        '\'' + recv_uID + '\'' +
        ', \'' + recv_category + '\'' +
        ', \'' + recv_contents + '\')';

    console.log("API 'temp/send_req' called");
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
