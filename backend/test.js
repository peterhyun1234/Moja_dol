var express   = require('express');
var createError = require('http-errors');
var path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
var http = require('http');
var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var web = express();      //express 서버 객체
web.set('port', 8000);

web.use(serveStatic(path.join(__dirname, '/')));
 
 
web.use(bodyParser.urlencoded({ extended: false }));            // post 방식 세팅
web.use(bodyParser.json());                                     // json 사용 하는 경우의 세팅
 
web.use(cookieParser());
 
web.use(expressSession({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
                                //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized:true
}));

var router1 = express.Router();
 
 
router1.route('/').get(
    function (req, res)
    { 
        if (req.session.user)       //세션에 유저가 있다면
        {
            res.redirect('views/member.html');
        }
        else
        {   
            res.redirect('views/login.html'); 
        }
    }
); 

router1.route('/login').post(     
    
    function (req, res) {
        console.log('/login 라우팅 함수호출 됨');
 
        var paramID = req.body.id || req.query.id;
        var pw = req.body.passwords || req.query.passwords;
 
        var recv_id = req.body.id;
        var recv_password = req.body.password;
        var SQL = 'SELECT 1 FROM admin_user WHERE id = \'' + recv_id + '\' and password = \'' + recv_password + '\'';
        console.log(SQL);

        var login;
        var msg;
        connection.query(SQL, function (err, data) {

            if (data.length == '1') {

                login = 1;
                if (req.session.user) {
                    msg = 1;
                   // res.send(data);
                } else {
                    req.session.user =
                        {
                            id: paramID,
                            pw: pw,
                            name: 'UsersNames!!!!!',
                            authorized: true
                        };
                    //var data = 1;
                    msg = 0;
                    //res.redirect('../views/member.html');
                }
            }
            else {
                console.log("비밀번호 불일치");
                //res.send('-1');
                login = -1;
            }
            var senddata = {"login": login, "msg" : msg};
            res.send(senddata);
        });         
    }
);

router1.route('/logout').get(                      //설정된 쿠키정보를 본다
    function (req, res) {
        console.log('logout 라우팅 함수호출 됨');
 
        if (req.session.user) {
            console.log('로그아웃 처리');
            req.session.destroy(
                function (err) {
                    if (err) {
                        console.log('세션 삭제시 에러');
                        return;
                    }
                    console.log('세션 삭제 성공');
                    //파일 지정시 제일 앞에 / 를 붙여야 root 즉 public 안에서부터 찾게 된다
                    res.redirect('../views/login.html');
                }
            );//세션정보 삭제
 
        } else {
            console.log('로긴 안되어 있음');
            res.redirect('../views/login.html');
        }
    }
);

//세션없을시 페이지 이동 막기
router1.route('/member').get(
    function (req, res)
    {
        console.log('/member  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/member.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    } 
);

router1.route('/policy').get(
    function (req, res)
    {
        console.log('/policy  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/policy.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);


router1.route('/request').get(
    function (req, res)
    {
        console.log('/request  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/request.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);

router1.route('/memberinterest').get(
    function (req, res)
    {
        console.log('/memberinterest  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/memberinterest.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);
 

//////////////////////////////////////////////세션 안먹히는 경로///////////////////////////////////////////
//이게 22번째줄에 경로를 / 으로 설정해서 타진다는건 알겠는데 http://localhost:8000/views/login.html 이케 주소로 들어가는
//경우에는 밑에 router.처럼 세션 적용할려 했는데 아예 저기를 안들어가고 걍 바로 보여지던데 절대경로를 / 로 해놔서 그런거겠죠...?
//근데 그렇다고 절대경로 / 이거 바꿔버리면 각 html css랑 js 경로 수정해야하는뎈ㅋㅋㅋㅋㅋㅋㅋㅋ


router1.route('/views/member.html').get(

    function (req, res)
    {
        console.log('/member ff 라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/member.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);
router1.route('/views/policy.html').get(
    function (req, res)
    {
        console.log('/policy  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/policy.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);
router1.route('/views/request.html').get(
    function (req, res)
    {
        console.log('/policy  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/request.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);

router1.route('/views/memberinterest.html').get(
    function (req, res)
    {
        console.log('/policy  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/memberinterest.html');
        }
        else
        {   
            console.log('들어왔니?');
            res.redirect('views/login.html');
            console.log('나오나');
 
        }
    }
);
//////////////////////////////////////////////세션 안먹히는 경로///////////////////////////////////////////


//라우터 미들웨어 등록하는 구간에서는 라우터를 모두  등록한 이후에 다른 것을 세팅한다
//그렇지 않으면 순서상 라우터 이외에 다른것이 먼저 실행될 수 있다
web.use('/', router);       //라우트 미들웨어를 등록한다

web.all('*',
    function (req, res) {
        res.status(404).send('<h1> 요청 페이지 없음 </h1>');
    }
);
 
//웹서버를 app 기반으로 생성
var web_server = http.createServer(web);
web_server.listen(web.get('port'),
    function () {
        console.log('express 웹서버 실행' + web.get('port'));
    }
);















// // 관리자 웹화면
// var admin_web = http.createServer(function(request,response){
//     var url = request.url;
//     if(request.url == '/'){
//       url = '/views/login.html';
//     }
//     if(request.url == '/favicon.ico'){
//       return response.writeHead(404);
//     }
//     response.writeHead(200);
//     response.end(fs.readFileSync(__dirname + url));
 
// });
// admin_web.listen(8000);















var app = express();

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
