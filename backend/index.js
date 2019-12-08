var express   = require('express');
var createError = require('http-errors');
var path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
var http = require('http');
var fs = require('fs');

// var firebase = require("firebase");
// var firebase_db = require('./config/firebase.js').real;

// 관리자 웹화면

// var aliasList = ["/login", "/member", "/memberinterest", "/policy", "/request"];
// var pathnameList = ["/views/login.html", "/views/member.html", "/views/memberinterest.html", "/views/policy.html", "/views/request.html"];

// function pathname_check(url){

//   console.log("you in pathname_check");

//   for(var i = 0; i < pathnameList.length; i++){
//     if(url == pathnameList[i]){
//       console.log("true!! pathname_check");
//       return true;
//     }
//   }
//   return false;
// }

// var admin_web = http.createServer(function(request,response){
//     var url = request.url;
//     var exist_flag = true;

//     console.log("request.url: " + request.url);
    
//     if(request.url == '/'){
//       url = '/views/login.html';
//     }

//     for(var i = 0; i < aliasList.length; i++){
//       if(request.url == aliasList[i]){
//         url = "/views" + aliasList[i] + ".html";
//       }
//     }

//     console.log("url: " + url);

//     exist_flag = pathname_check(url);

//     if(exist_flag == true)
//     {
//       console.log("true url: " + url + ", flage: " + exist_flag);
//       response.writeHead(200);
//       response.end(fs.readFileSync(__dirname + url));
//     }
//     else
//     {
//       console.log("false url: " + url + ", flage: " + exist_flag);
//       response.writeHead(404);
//       response.write('404 Not found');
//       response.end();
//     }

// });


var pathnameList = ["/views", "/js", "/css", "/fonts", "/image"];

function pathname_check(url){

  for(var i = 0; i < pathnameList.length; i++){
    if(url.indexOf(pathnameList[i]) == 0){
      //console.log("true!! pathname_check");
      return true;
    }
  }
  return false;
}

// 관리자 웹화면
var admin_web = http.createServer(function(request,response){
  var url = request.url;
  var exist_flag = true;

  console.log("url: " + url);

  if(url == '/' || url.indexOf('/login') == 0){
    url = '/views/login.html';
  }
  else if(url.indexOf('/memberinterest') == 0){
    url = '/views/memberinterest.html';
  }
  else if(url.indexOf('/member') == 0){
    url = '/views/member.html';
  }
  else if(url.indexOf('/policy') == 0){
    url = '/views/policy.html';
  }
  else if(url.indexOf('/request') == 0){
    url = '/views/request.html';
  }
  else if(url.indexOf('/header') == 0){
    url = '/views/header.html';
  }

  if(url == '/favicon.ico'){
    return response.writeHead(404);
  }

  exist_flag = pathname_check(url);

  if(exist_flag == true){
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
  }
  else
  {
      //console.log("false url: " + url + ", flag: " + exist_flag);
      response.writeHead(404);
      response.write('404 Not found');
      response.end();
  }

});

admin_web.listen(8000);
console.log('admin web server listening on port 8000');

var app = express();
var fs = require('fs');

// mysql 연동
var mysql_db = require('./db_connection.js');
var connect = mysql_db.mysql_init();
mysql_db.mysql_open(connect);
exports.connection = connect;

app.set('port', process.env.PORT || 3000);

// URL REST-API SERVER
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Router 정의
const policyRouter = require('./router/policy');
const userRouter = require('./router/user');
const tempRouter = require('./router/temp');
const requestRouter = require('./router/request');
const reviewRouter = require('./router/review');
const web_adminRouter = require('./router/web_admin');
const my_listRouter = require('./router/my_list');
const searchRouter = require('./router/search');
const interestRouter = require('./router/interest');
const sortingRouter = require('./router/sorting');

app.use('/policy', policyRouter);
app.use('/user', userRouter);
app.use('/temp', tempRouter);
app.use('/request', requestRouter);
app.use('/review', reviewRouter);
app.use('/web_admin', web_adminRouter);
app.use('/my_list', my_listRouter);
app.use('/search', searchRouter);
app.use('/interest', interestRouter);
app.use('/sorting', sortingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/files', express.static(__dirname + '/files'));

module.exports = app;
module.exports = router;

const gracfulCleanJob = () => new Promise((resolve, reject) => {
  setTimeout(() => {
     console.log("Disconnected from port 3000");
      resolve();
  }, 3000);

  setTimeout(() => {
    console.log("Disconnected from port 8000");
    console.log("Please wait...");
    resolve();
}, 8000);
});

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  gracfulCleanJob().then(() => {
      process.exit();
  })
});
