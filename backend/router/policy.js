var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;


router.get('/show_all_policies', function (req, res) {

    //console.log('/policy/show_all_policies Processing completed');
    connection.query('SELECT * from policy', function (err, data) {
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

    var SQL = 'SELECT Ucontents FROM origin_policy WHERE p_code = ' + recv_code ;

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

    var SQL = 'UPDATE request SET expiration_flag = ' + recv_flag + ' WHERE p_code = '+ recv_code ;

    //var SQL = 'SELECT Ucontents FROM origin_policy WHERE p_code = \'' + recv_code + '\'';

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
    var recv_title = req.body.title;	
    var recv_uri = req.body.uri;	
    var recv_Astart = req.body.apply_start;	
    var recv_Aend = req.body.apply_end;
    var recv_startA = req.body.start_age;
    var recv_endA = req.body.end_age;	
    var recv_contents = req.body.contents;
    var recv_Atarget = req.body.application_target;
    var recv_location = req.body.location;	
    var recv_date = req.body.crawing_date;
    var recv_flag = req.body.expiration_flag;
    var temp_date;
    

    if(recv_date != null){
        temp_date = recv_Astart;
        recv_Astart = '\''+ temp_date +'\'';
    }
    if(recv_date != null){
        temp_date = recv_Aend;
        recv_Aend = '\''+ temp_date +'\'';
    }
    if(recv_date != null){
        temp_date = recv_date;
        recv_date = '\''+ temp_date +'\'';
    }
    var SQL = 'UPDATE policy SET '+
    'title = \'' + recv_title +	'\'' +
    ',uri = \''	+ recv_uri + '\'' +
    ',apply_start = ' + recv_Astart + 
    ',apply_end = '	+ recv_Aend + 
    ',start_age = '	+ recv_startA +
    ',end_age = ' + recv_endA +
    ',contents = \''+ recv_contents + '\'' +
    ',application_target = \''+ recv_Atarget + '\'' +
    ',location = \''+ recv_location + '\'' +	
    ',crawing_date = '	+ recv_date + 
    ',expiration_flag = '+ recv_flag +
    ' WHERE p_code = '+ recv_code ;

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

    //console.log('/policy/selected_policies Processing completed');
    // 다음에 post로 구현!
    connection.query('SELECT p_code, title, uri, apply_start, apply_end  from policy', function (err, data) {
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
    console.log('selected policy is ' + policy_params);
    connection.query('SELECT * from policy where p_code = ' + policy_params, function (err, data) {
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
