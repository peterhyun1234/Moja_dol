
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


module.exports=router;
