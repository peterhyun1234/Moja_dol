/* var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var connection = mysql.createConnection({ 
  host :'localhost', //db ip address 
  port : 3306, //db port number 
  user : 'root', //db id 
  password : 'root', //db password 
  database:'mojadoltempdb' //db schema name 
}); */
 //    "express": "^4.17.1",

//연결확인
/* connection.connect(function(err) { 
  if (err) { 
    console.error('mysql connection error---'); 
    console.error(err); 
    throw err; 
  }else{ 
    console.log("연결에 성공하였습니다."); 
  } 
});



app.use(express.static('public')); */

//app.use(express.bodyParser());

/* app.use(express.json());

app.use(express.urlencoded());



app.use(app.router); */


/* var app = http.createServer(function(request,response){
  var url = request.url;
  if(request.url == '/'){
    url = '/views/member.html';
  }
  if(request.url == '/favicon.ico'){
    return response.writeHead(404);
  }
  response.writeHead(200/*, {'Content-Type': 'text/html; charset=utf-8'}*//* );
  response.end(fs.readFileSync(__dirname + url));

}); */

 
/* 
app.get('/products', function (request, response) {

  //데이터베이스 요청을 수행합니다.

  client.query('SELECT * FROM products', function (error, data) {

  //response.type('text/xml');

  //response.header("Access-Control-Allow-Origin" , "*");

  response.set('Access-Control-Allow-Origin', '*');

  response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');

  response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  response.send(data);

  });



});



app.listen(3000, function(){
  console.log("connected, 3000 port");
}) */
var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/views/login.html';
    }
    if(request.url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
 
});


app.listen(8000);