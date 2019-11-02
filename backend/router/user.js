
var express=require('express');
var router=express.Router();

var connection=require('../index.js').connection;

router.get('/show_all_users',function(req,res){
    connection.query('SELECT * from user',function(err,data){
        if(!err){
            //console.log(data);
            res.send(data);
        }
        else {
            console.log(err);
            res.send('error');
        }
    });
});

router.get('/info',function(req,res){
    connection.query('SELECT id, password from admin_web',function(err,data){
        if(!err){
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
   
    //파일 형식 테스트 필요함!!
    var recv_uID = req.body.uID;
    var recv_name = req.body.name;	
    var recv_region = req.body.region;	
    var recv_age = req.body.age;	
    var recv_Employment_Sup_priority = req.body.Employment_Sup_priority;
    var recv_Startup_sup_priority = req.body.Startup_sup_priority;	
    var recv_Life_welfare_priority = req.body.Life_welfare_priority;
    var recv_Residential_financial_priority = req.body.Residential_financial_priority;

    var SQL = 'INSERT INTO user VALUES('+
    '\'' + recv_uID + '\''
    ', \''	+ recv_name + '\'' +
    ', \'' + recv_region + '\'' +
    ', ' + recv_age +
    ', ' + recv_Employment_Sup_priority +
    ', ' + recv_Startup_sup_priority +
    ', ' + recv_Life_welfare_priority +
    ', ' + recv_Residential_financial_priority + ')';

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
    var recv_Employment_Sup_priority = req.body.Employment_Sup_priority;
    var recv_Startup_sup_priority = req.body.Startup_sup_priority;	
    var recv_Life_welfare_priority = req.body.Life_welfare_priority;
    var recv_Residential_financial_priority = req.body.Residential_financial_priority;

    var SQL = 'UPDATE user SET '+
    'name = \''	+ recv_name + '\'' +
    ',region = \'' + recv_region + '\'' +
    ',age = ' + recv_age +
    ',Employment_Sup_priority = '	+ recv_Employment_Sup_priority +
    ',Startup_sup_priority = '	+ recv_Startup_sup_priority +
    ',Life_welfare_priority = ' + recv_Life_welfare_priority +
    ',Residential_financial_priority = '	+ recv_Residential_financial_priority +
    'WHERE uID = \''+ recv_uID + '\'';

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

module.exports=router;
