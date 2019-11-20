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

//정책 추천 - 어플리케이션 HOME 화면
router.post("/referral", function (req, res, next) {

    var recv_uID = req.body.uID;

    var SQL = "SELECT policy.*," +
        "(Employment_sup*Employment_sup_priority + Startup_sup*Startup_sup_priority + Life_welfare*Life_welfare_priority + Residential_finance*Residential_financial_priority) AS total_priority " +
        "FROM policy NATURAL JOIN interest, user " +
        "WHERE (uID = '" + recv_uID + "') AND " +
        "(start_age <= user.age AND user.age <= end_age) AND " +
        "expiration_flag <> 1 " +
        "ORDER BY total_priority DESC, apply_end ASC " +
        "LIMIT 10";

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
