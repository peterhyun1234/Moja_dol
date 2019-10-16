
var express=require('express');
var router=express.Router();

var connection=require('../index.js').connection;

router.get('/info',function(req,res){
		connection.query('SELECT id, password from admin_user',function(err,data){
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

router.post("/certificate", function(req,res,next){
		var recv_id = req.body.id;
		var recv_password = req.body.password;
		var SQL = 'SELECT 1 FROM admin_user WHERE id = \'' + recv_id + '\' and password = \'' + recv_password + '\'';

		console.log(SQL);
		//console.log(recv_id + ", " + recv_password);
		//절 차 
		connection.query(SQL,function(err,data){
				console.log(data);
				if(data.length == '1'){
				console.log("비밀번호 일치");
				res.send('1');
				}
				else{
				console.log("비밀번호 불일치");
				res.send('-1');
				}
				});
		});

/*
   router.post('/signup',function(req,res){

   var id=req.body.id;
   var name=req.body.name;
   var nickname=req.body.nickname;
   var interest=req.body.interest;
   var address=req.body.address;
   var password=req.body.password;
   var birthday=req.body.birthday;
   var sql='INSERT INTO usertable(id,name,nickname,interest,address,password,birthday) VALUES(?,?,?,?,?,?,?)';
   var params=[id,name,nickname,interest,address,password,birthday];

   for(i of params){
   console.log(i);
   }

   console.log(sql);

   connection.query(sql,params,function(err,data)
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


   router.post('/login',function(req,res){

   var id=req.body.id;
   var password=req.body.password;

   var sql='SELECT id,password,name from usertable WHERE id='+'"'+id+'";';
   console.log(sql);

   connection.query(sql,function(err,data)
   {

   if(!err)
   {


   if(data.length==0)//회원 정보가 없을때
   {

   res.send("no_info");   
   }
   else//회원 정보가 있을때
   {
   if(password==data[0].password)
   {
   res.send(data);

   }
   else{
   res.send("passworderror");
   }

   }
   }
   else{
   console.log(err);
   res.send('error');
}
});
});
router.get('/logincheck',function(req,res){
		connection.query('SELECT * from usertable',function(err,data){
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
*/
module.exports=router;
