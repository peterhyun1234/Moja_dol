var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;


router.get('/show_all_policies', function (req, res) {

    var SQL = 'SELECT * from policy';

    console.log("API 'policy/show_all_policies' called");
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

router.get('/select_all_policies', function (req, res) {

    var SQL = "SELECT p_code, title, " +
        "DATE_SUB(crawling_date, INTERVAL -9 HOUR) AS crawling_date, " +
        "expiration_flag from policy";

    console.log("API 'policy/select_all_policies' called");
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


router.post("/show_all_policies", function (req, res, next) {

    var SQL = 'SELECT * FROM policy';

    console.log("API 'policy/show_all_policies' called");
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


router.post("/origin_table", function (req, res, next) {

    var recv_code = req.body.p_code;

    var SQL = 'SELECT Ucontents FROM origin_policy WHERE p_code = ' + recv_code;

    console.log("API 'policy/origin_table' called");
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

// 정책별로 평점 기입
router.post("/add_rating", function (req, res, next) {

    var recv_rating = req.body.rating;
    var recv_uID = req.body.uID;
    var recv_p_code = req.body.p_code;

    var SQL = 'INSERT INTO policy_rating (uID, p_code, rating) SELECT ' +
        '\'' + recv_uID + '\'' +
        ', ' + recv_p_code +
        ', ' + recv_rating +
        ' FROM DUAL WHERE (0 = (SELECT count(*) FROM policy_rating WHERE uID = ' +
        '\'' + recv_uID + '\'' + ' AND ' +
        'p_code = ' + recv_p_code + ')) AND (rating != ' +
        recv_rating + ')';

    console.log("API 'policy/add_rating' called");
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


router.post("/change_to_expiration", function (req, res, next) {

    var recv_code = req.body.p_code;
    var recv_flag = req.body.expiration_flag;

    var SQL = 'UPDATE request SET expiration_flag = ' + recv_flag + ' WHERE p_code = ' + recv_code;

    console.log("API 'policy/change_to_expiration' called");
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

router.post("/modify_policy", function (req, res, next) {

    //파일 형식 테스트 필요함!!
    var recv_code = req.body.p_code;
    if (recv_code == null || recv_code.length == 0)
        recv_code = null;

    var recv_title = req.body.title;
    if (recv_title == null || recv_title.length == 0)
        recv_title = null;
    else {
        recv_title = '\'' + recv_title + '\'';
    }

    var recv_uri = req.body.uri;
    if (recv_uri == null || recv_uri.length == 0)
        recv_uri = null;
    else {
        recv_uri = '\'' + recv_uri + '\'';
    }

    var recv_Astart = req.body.apply_start;
    if (recv_Astart == null || recv_Astart.length == 0)
        recv_Astart = null;
    else {
        recv_Astart = '\'' + recv_Astart + '\'';
    }

    var recv_Aend = req.body.apply_end;
    if (recv_Aend == null || recv_Aend.length == 0)
        recv_Aend = null;
    else {
        recv_Aend = '\'' + recv_Aend + '\'';
    }

    var recv_startA = req.body.start_age;
    if (recv_startA == null || recv_startA.length == 0)
        recv_startA = null;

    var recv_endA = req.body.end_age;
    if (recv_endA == null || recv_endA.length == 0)
        recv_endA = null;

    var recv_contents = req.body.contents;
    if (recv_contents == null || recv_contents.length == 0)
        recv_contents = null;
    else {
        recv_contents = '\'' + recv_contents + '\'';
    }

    var recv_Atarget = req.body.application_target;
    if (recv_Atarget == null || recv_Atarget.length == 0)
        recv_Atarget = null;
    else {
        recv_Atarget = '\'' + recv_Atarget + '\'';
    }

    var recv_dor = req.body.dor;
    if (recv_dor == null || recv_dor.length == 0)
        recv_dor = null;
    else {
        recv_dor = '\'' + recv_dor + '\'';
    }

    var recv_si = req.body.si;
    if (recv_si == null || recv_si.length == 0)
        recv_si = null;
    else {
        recv_si = '\'' + recv_si + '\'';
    }

    var recv_flag = req.body.expiration_flag;
    if (recv_flag == null || recv_flag.length == 0)
        recv_flag = null;



    var SQL = 'UPDATE policy SET ' +
        'title = ' + recv_title +
        ',uri = ' + recv_uri +
        ',apply_start = ' + recv_Astart +
        ',apply_end = ' + recv_Aend +
        ',start_age = ' + recv_startA +
        ',end_age = ' + recv_endA +
        ',contents = ' + recv_contents +
        ',application_target = ' + recv_Atarget +
        ',dor = ' + recv_dor +
        ',si = ' + recv_si +
        ',expiration_flag = ' + recv_flag +
        ' WHERE p_code = ' + recv_code;

    console.log("API 'policy/modify_policy' called");
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


//간략하게 보여주는 정책
router.get('/selected_policies', function (req, res) {


    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end " +
        "from policy";

    console.log("API 'policy/selected_policies' called");
    console.log(SQL);
    // 다음에 post로 구현!
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

// 공고 후
router.get('/after_apply_policies', function (req, res) {


    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end " +
        "from policy " +
        "where (apply_end < NOW())";

    console.log("API 'policy/after_apply_policies' called");
    console.log(SQL);
    // 다음에 post로 구현!
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

// 공고 전
router.get('/before_apply_policies', function (req, res) {

    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end " +
        "from policy " +
        "where (apply_start > NOW())";;

    console.log("API 'policy/before_apply_policies' called");
    console.log(SQL);
    // 다음에 post로 구현!
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

// 신청가능
router.get('/possible_apply_policies', function (req, res) {


    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end " +
        "from policy " +
        "where (apply_start <= NOW() AND apply_end >= NOW())";

    console.log("API 'policy/always_apply_policies' called");
    console.log(SQL);
    // 다음에 post로 구현!
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

// 상시
router.get('/always_apply_policies', function (req, res) {


    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end " +
        "from policy " +
        "where (expiration_flag = 2)";

    console.log("API 'policy/always_apply_policies' called");
    console.log(SQL);
    // 다음에 post로 구현!
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

//정책 세부내용
router.get('/:id', function (req, res) {
    var policy_params = req.params.id;
    //console.log('selected policy is ' + policy_params);

    var SQL = "SELECT p_code, title, uri, " +
        "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, " +
        "start_age, end_age, contents, application_target, dor, si, " +
        "crawling_date, expiration_flag " +
        "from policy where p_code = " + policy_params;

    console.log("API 'policy/:id' called");
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

// 정책 세부내용 조회와 동시에 클릭!
router.post("/click", function (req, res, next) {

    var recv_uID = req.body.uID;
    var recv_p_code = req.body.p_code;

    var SQL = 'INSERT INTO click (p_code, uID, click_time)' +
        'VALUES (' +
        recv_p_code +
        ',\'' + recv_uID + '\'' +
        ',' + 'DATE_SUB(NOW(), INTERVAL -9 HOUR)' +
        ")";

    console.log("API 'policy/click' called");
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

router.post("/test", function (req, res, next) {

    var recv_uID = req.body.uID;

    var SQL = "SELECT * " +
        "FROM policy NATURAL JOIN interest, user, mylist_priority, click_priority " +
        "WHERE (user.uID = mylist_priority.uID) AND " +
        "(user.uID = click_priority.uID) AND " +
        "(mylist_priority.uID = click_priority.uID) AND " +
        "(user.uID = '" + recv_uID + "') AND " +
        "(start_age <= user.age AND user.age <= end_age) AND " +
        "expiration_flag <> 1 " +
        "LIMIT 10";

    console.log("API 'policy/test' called");
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

//정책 추천 - 어플리케이션 HOME 화면 1
router.post("/referral", function (req, res, next) {

    var recv_uID = req.body.uID;

    // 1. 카테고리 입력안했으면 암것도 안보내기
    // 2. 클릭, 찜, 카테고리지정에 따른 웨이트 구하기
    // 3. 유저베이스드는 플마 3살의 가장 많이 클릭한 웨이트 + 찜한 웨이트
    // 4. 와이값은 나이와 성별 별로 찜한 리스트

    // • 디비에 성별 추가
    // • 카테고리 분류 추가 이거 약간 노가다
    // • 여러 유저의 데이터 쌓기


    // **** 카테고리 등록안한 user는 못 받는 게 당연하지마 click, my_list의 경우는 받아야 함!!

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
        "((policy.dor = '전국') OR (policy.dor = user.dor AND policy.si = '전체') OR (policy.dor = user.dor AND policy.si = user.si)) "
        "ORDER BY (cg_priority + ml_priority + cl_priority) DESC, apply_end ASC ";

        // var SQL = "SELECT p_code, title, uri, policy.dor, policy.si, " +
        // "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
        // "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, " +
        // "(Employment_sup*user.Employment_sup_priority + " +
        // "Startup_sup*user.Startup_sup_priority + " +
        // "Life_welfare*user.Life_welfare_priority + " +
        // "Residential_finance*user.Residential_financial_priority)*" + category_weight + " " +
        // "AS cg_priority, " +
        // "(Employment_sup*mylist_priority.Employment_sup_priority + " +
        // "Startup_sup*mylist_priority.Startup_sup_priority + " +
        // "Life_welfare*mylist_priority.Life_welfare_priority + " +
        // "Residential_finance*mylist_priority.Residential_financial_priority)*" + mylist_weight + " " +
        // "AS ml_priority, " +
        // "(Employment_sup*click_priority.Employment_sup_priority + " +
        // "Startup_sup*click_priority.Startup_sup_priority + " +
        // "Life_welfare*click_priority.Life_welfare_priority + " +
        // "Residential_finance*click_priority.Residential_financial_priority)*" + click_weight + " " +
        // "AS cl_priority " +
        // "FROM policy NATURAL JOIN interest, user, mylist_priority, click_priority " +
        // "WHERE (user.uID = mylist_priority.uID) AND " +
        // "(user.uID = click_priority.uID) AND " +
        // "(mylist_priority.uID = click_priority.uID) AND " +
        // "(user.uID = '" + recv_uID + "') AND " +
        // "((policy.dor = '전국') OR (policy.dor = user.dor AND policy.si = '전체') OR (policy.dor = user.dor AND policy.si = user.si)) AND " +
        // "(start_age <= user.age AND user.age <= end_age) AND " +
        // "((expiration_flag = 2) OR (apply_start <= NOW() AND apply_end >= NOW())) " +
        // "ORDER BY (cg_priority + ml_priority + cl_priority) DESC, apply_end ASC " +
        // "LIMIT 30";


    console.log("API 'policy/referral' called");
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

//User_based 정책 추천 - 어플리케이션 HOME 화면 2
router.post("/user_based_referral", function (req, res, next) {

    var recv_uID = req.body.uID;
    var age_gap = 10;

    var age_SQL;
    var order_SQL;

    // 지역으로 분류하는 걸 추가해야할지..?

    var SQL = "SELECT p_code, title, uri, " +
    "DATE_SUB(apply_start, INTERVAL -9 HOUR) AS apply_start, " +
    "DATE_SUB(apply_end, INTERVAL -9 HOUR) AS apply_end, " +
    "count(*) AS policy_hits " +
    "FROM user NATURAL JOIN stored_policy, policy " +
    "WHERE " +
    "(p_code = s_p_code) AND " +
    "(age BETWEEN ((SELECT age FROM user WHERE uID = '"+ recv_uID +"') - " + age_gap + 
    ") AND ((SELECT age FROM user WHERE uID = '"+ recv_uID +"') + " + age_gap + ")) AND " +
    "(start_age <= (SELECT age FROM user WHERE uID = '"+ recv_uID +"') AND (SELECT age FROM user WHERE uID = '"+ recv_uID +"') <= end_age) AND " +
    "((expiration_flag = 2) OR (apply_start <= NOW() AND apply_end >= NOW())) " +
    "GROUP BY p_code " +
    "ORDER BY policy_hits DESC " +
    "LIMIT 5";

    console.log("API 'policy/user_based_referral' called");
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

router.get('/pic1', function (req, res) {

    //console.log('/policy/pic1 Processing completed');

    var filename = 'icons/policy_icon1.png';
    fs.readFile(filename, function (err, data) {
        if (!err) {
            // console.log('reafile complete');
            res.writeHead(200, { "Content-Type": "image/png" });
            //res.write(data);
            res.end(data);
            //res.send(data);
        }
        else {
            console.log(err);
            //res.send('error');
        }
    });

});

router.get('/pic2', function (req, res) {

    console.log('/policy/pic2 Processing completed');

    var filename = 'icons/policy_icon2.png';
    fs.readFile(filename, function (err, data) {
        if (!err) {
            res.writeHead(200, { "Content-Type": "text/html" });
            //res.write(data);
            res.end(data);
            //res.send(data);
        }
        else {
            console.log(err);
            //res.send('error');
        }
    });

});

router.get('/pic3', function (req, res) {

    console.log('/policy/pic3 Processing completed');

    var filename = 'icons/policy_icon3.png';
    fs.readFile(filename, function (err, data) {
        if (!err) {
            res.writeHead(200, { "Content-Type": "text/html" });
            //res.write(data);
            //res.send(data);
            res.end(data);
        }
        else {
            console.log(err);
            //res.send('error');
        }
    });

});

module.exports = router;
