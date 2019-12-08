/*설치하기 
npm install express
express-session
cookie-parser
*/
var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var app = express();      //express 서버 객체
var bodyParser_post = require('body-parser');       //post 방식 파서
var fs = require('fs');
app.set('port', 8000);
 
 
//미들웨어들 등록 시작, 아래 미들웨어들은 내부적으로 next() 가실행됨
 
//join은 __dirname : 현재 .js 파일의 path 와 을 합친다
//이렇게 경로를 세팅하면 / 폴더 안에 있는것을 곧바로 쓸 수 있게된다
app.use(serveStatic(path.join(__dirname, '/')));
 
 
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({ extended: false }));            // post 방식 세팅
app.use(bodyParser_post.json());                                     // json 사용 하는 경우의 세팅
//post 방식 일경우 end
 
 
//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());
 
//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(expressSession({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
                                //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized:true
}));
 
 


//라우트를 미들웨어에 등록하기 전에 라우터에 설정할 경로와 함수를 등록한다
//라우터를 사용 (특정 경로로 들어오는 요청에 대하여 함수를 수행 시킬 수가 있는 기능을 express 가 제공해 주는것)
var router = express.Router();
 
 
//http://localhost:8000/ 이 주소로 치면 라우터를 통해 바로 여기로 올 수 있다
router.route('/').get(
    function (req, res)
    {
        console.log('/  라우팅 함수 실행');
 
        //세션정보는 req.session 에 들어 있다
        if (req.session.user)       //세션에 유저가 있다면
        {
            console.log('세션있음');
            res.redirect('views/member.html');
        }
        else
        {   
            console.log('세션없음');
            res.redirect('views/login.html'); 
        }
    }
);
 

router.route('/login').post(                      //설정된 쿠키정보를 본다 로그인
    
    function (req, res) {
        console.log('/login 라우팅 함수호출 됨');
 
        var paramID = req.body.id || req.query.id;
        var pw = req.body.passwords || req.query.passwords;
 
//로그인 요청이라 디비 쿼리문 넣으면 될듯요!
/*         var recv_id = req.body.id;
        var recv_password = req.body.password;
        var SQL = 'SELECT 1 FROM admin_user WHERE id = \'' + recv_id + '\' and password = \'' + recv_password + '\'';

        console.log(SQL);

        var login;
        var msg;

        connection.query(SQL, function (err, data) {
            console.log(data);
            if (data.length == '1') {
                //console.log("비밀번호 일치");
                //res.send('1');
                login = 1;
                if (req.session.user) {
                    console.log('이미 로그인 되어 있음');
                    //res.redirect('../views/member.html');
                    var data = {msg : 1};
                    res.send(data);

                } else {
                    console.log("세션업슈 그래서 만듬");
                    req.session.user =
                        {
                            id: paramID,
                            pw: pw,
                            name: 'UsersNames!!!!!',
                            authorized: true
                        };
                    //var data = 1;
                    var data = {msg : 0};
                    res.send(data);
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
        }); */

//로그인 요청이라 디비 쿼리문 넣으면 될듯요!
        /////////////////////////////////////////////////////

        if (req.session.user) {
            console.log('이미 로그인 되어 있음');
            //res.redirect('../views/member.html');
            var data = {msg : 1};
            res.send(data);
 
        } else {
            console.log("세션업슈 그래서 만듬");
            req.session.user =
                {
                    id: paramID,
                    pw: pw,
                    name: 'UsersNames!!!!!',
                    authorized: true
                };
                //var data = 1;
                var data = {msg : 0};
                res.send(data);
                //res.redirect('../views/member.html');
        }
        
        console.log("/login. 함수끝");
    }
);

router.route('/logout').get(                      //설정된 쿠키정보를 본다
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
router.route('/member').get(
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

router.route('/policy').get(
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


router.route('/request').get(
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

router.route('/memberinterest').get(
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


router.route('/views/member.html').get(

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
router.route('/views/policy.html').get(
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
router.route('/views/request.html').get(
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

router.route('/views/memberinterest.html').get(
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
app.use('/', router);       //라우트 미들웨어를 등록한다
 
//var app = express(); //express서버 객체

app.all('*',
    function (req, res) {
        res.status(404).send('<h1> 요청 페이지 없음 </h1>');
    }
);
 
//웹서버를 app 기반으로 생성
var appServer = http.createServer(app);
appServer.listen(app.get('port'),
    function () {
        console.log('express 웹서버 실행' + app.get('port'));
    }
);
 