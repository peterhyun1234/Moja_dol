var express=require('express');
var fs = require('fs');
var router=express.Router();

var connection=require('../index.js').connection;

router.get('/show_all_policies',function(req,res){
    
    console.log('/policy/show_all_policies Processing completed');
    connection.query('SELECT * from policy',function(err,data){
        if(!err){
            console.log(data);
            res.send(data);
        }
        else {
            console.log(err);
            res.send('error');
        }
    });
});

router.get('/S_policy/:id',function(req,res){
    var policy_params = req.params.id;
    console.log('selected policy is ' + policy_params);
    connection.query('SELECT * from policy where index = '+ policy_params,function(err,data){
        if(!err){
            console.log(data);
            res.send(data);
        }
        else {
            console.log(err);
            res.send('error');
        }
    });
});

router.get('/pic1',function(req,res){

    console.log('/policy/pic1 Processing completed');

    var filename = 'policy_icon1.png';
    fs.readFile(filename, function(err, data)
    {
        if(!err){
            res.writeHead(200, {"Content-Type": "image/png"});
            res.write(data);
            //res.send(data);
        }
        else {
            console.log(err);
            //res.send('error');
        }
    });
    
});

router.get('/pic2',function(req,res){

    console.log('/policy/pic2 Processing completed');

    var filename = 'policy_icon2.png';
    fs.readFile(filename, function(err, data)
    {
        if(!err){
            res.writeHead(200, {"Content-Type": "image/png"});
            res.write(data);
            //res.send(data);
        }
        else {
            console.log(err);
            //res.send('error');
        }
    });
    
});

router.get('/pic3',function(req,res){

    console.log('/policy/pic3 Processing completed');

    var filename = 'policy_icon3.png';
    fs.readFile(filename, function(err, data)
    {
        if(!err){
            res.writeHead(200, {"Content-Type": "image/png"});
            res.write(data);
            //res.send(data);
        }
        else {
            console.log(err);
            //res.send('error');
        }
    });
    
});

/*
router.post('/buy',function(req,res){
    var buyCode=req.body["buycode"];
    var buyNum=req.body.buynum;
    var buyUser=req.body.buyuser;
    var presql='SELECT productnum from producttable WHERE productcode='+buyCode;
    var sql='INSERT INTO buytable(buydate,buycode,buynum,buyuser) VALUES(default,'+buyCode+','+buyNum+','+'"'+buyUser+'"'+');';

    console.log(sql);
    connection.query(presql,function(err,data)
    {
        if(data.length==0)
        {
            res.send("없어");
        }
    
        else{
            console.log(data[0]);
            console.log(buyNum);
            if(buyNum-data[0].productnum<0)
            {
                console.log(data);
                connection.query(sql,function(err,data2)
                {
                    console.log(data2);
                    res.send("됐어뙜어");

                });
            }
            else{
                res.send("재고수 부족");
            }
        }
        
    });
});

router.post('/add',function(req,res){

    var productName=req.body.productname;
    var productPrice=req.body.productprice;
    var productNum=req.body.productnum;
    var productCode=req.body.productcode;
    var sql='INSERT INTO producttable(productcode,productname,productprice,productnum) VALUES('+productCode+','+'"'+productName+'"'+','+productPrice+','+productNum+');';
    console.log(sql);
    
    connection.query(sql,function(err,data)
    {

        if(!err)
        {
            console.log("success");
            res.send("success");
        }
        else{
            console.log(err);
            res.send('error');
        }
    });
});
*/
module.exports=router;
