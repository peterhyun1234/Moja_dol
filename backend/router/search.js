var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;



router.post("/test", function (req, res, next) {
   


    //1. 연령 분류(무조건 청년)
    //2. 성별 분류 필요 없음


    //3. 지역
    // 지역 3~4 length의 경우 맨뒤 시, 군만 짤라서 ㄱㄱ
    var recv_location = req.body.location;

    //4. 분야 (4개도 세분화해서 ㄱㄱ)
        //4.0. 상관 없음.
        //4.1. Employment_Sup(취업지원) - 취업지원금, 서류/면접 지원, 취업지원 프로그램
        //4.2. Startup_sup(창업지원) - 시설/공간 제공, 정책 자금, 멘토링/컨설팅, 사업화
        //4.3. Life_welfare(생활, 복지) - 학자금, 대출/이자, 생활보조(금), 결혼/육아, 교통지원
        //4.4. Residential_financial(주거, 금융) - 기숙사/생활관, 주택지원, 주거환경지원, 고용장려금, 기업지원금
    //5. 연령
        //4.1. Employment_Sup(취업지원) - 취업지원금, 서류/면접 지원, 취업지원 프로그램
        //4.2. Startup_sup(창업지원) - 시설/공간 제공, 정책 자금, 멘토링/컨설팅, 사업화
        //4.3. Life_welfare(생활, 복지) - 학자금, 대출/이자, 생활보조(금), 결혼/육아, 교통지원  
    //6. 키워드 기반 검색 - title, contents내에 해당 키워드가 있으면 ㅇㅋ
    var recv_title = req.body.title;
    var recv_contents = req.body.contents;

    var recv_Atarget = req.body.application_target;
    
    if(recv_code.length == 0) recv_code = null;
    if(recv_title.length == 0) recv_title = null;
    else {
        temp_string = recv_title;
        recv_title = '\''+ temp_string +'\''
    };
    if(recv_uri.length == 0) recv_uri = null;
    else {
        temp_string = recv_uri;
        recv_uri = '\''+ temp_string +'\''
    };
    if(recv_Astart.length == 0) recv_Astart = null;
    if(recv_Aend.length == 0) recv_Aend = null;
    if(recv_startA.length == 0) recv_startA = null;
    if(recv_endA.length == 0) recv_endA = null;
    if(recv_contents.length == 0) recv_contents = null;
    else {
        temp_string = recv_contents;
        recv_contents = '\''+ temp_string +'\''
    };
    if(recv_Atarget.length == 0) recv_Atarget = null;
    else {
        temp_string = recv_Atarget;
        recv_Atarget = '\''+ temp_string +'\''
    };
    if(recv_location.length == 0) recv_location = null;
    else {
        temp_string = recv_location;
        recv_location = '\''+ temp_string +'\''
    };
    if(recv_date.length == 0) recv_date = null;
    if(recv_flag.length == 0) recv_flag = null;


    if(recv_Astart != null){
        temp_date = recv_Astart;
        recv_Astart = '\''+ temp_date +'\'';
    }
    if(recv_Aend != null){
        temp_date = recv_Aend;
        recv_Aend = '\''+ temp_date +'\'';
    }
    if(recv_date != null){
        temp_date = recv_date;
        recv_date = '\''+ temp_date +'\'';
    }

    var SQL = 'UPDATE policy SET '+
    'title = ' + recv_title +	
    ',uri = '	+ recv_uri + 
    ',apply_start = ' + recv_Astart + 
    ',apply_end = '	+ recv_Aend + 
    ',start_age = '	+ recv_startA +
    ',end_age = ' + recv_endA +
    ',contents = '+ recv_contents + 
    ',application_target = '+ recv_Atarget + 
    ',location = '+ recv_location + 
    ',crawing_date = '	+ recv_date + 
    ',expiration_flag = ' + recv_flag +
    ' WHERE p_code = ' + recv_code ;

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



module.exports = router;
