var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;



router.post("/test", function (req, res, next) {
   
    //3. 지역
    var recv_location;
    var temp_location = req.body.location;
    var location_length = temp_location.length;
    // 지역 3~4 length의 경우 맨뒤 시, 군만 짤라서 ㄱㄱ 
    if(location_length == 3 || location_length == 4)
    {
        recv_location = temp_location.substring(0, location_length-1);
        //console.log(recv_location);
    }

    //4. 분야 (4개도 세분화해서 ㄱㄱ)
        //4.0. 상관 없음.
        //4.1. Employment_Sup(취업지원) - 취업지원금, 서류/면접 지원, 취업지원 프로그램
        //4.2. Startup_sup(창업지원) - 시설/공간 제공, 정책 자금, 멘토링/컨설팅, 사업화
        //4.3. Life_welfare(생활, 복지) - 학자금, 대출/이자, 생활보조(금), 결혼/육아, 교통지원
        //4.4. Residential_financial(주거, 금융) - 기숙사/생활관, 주택지원, 주거환경지원, 고용장려금, 기업지원금
    
        // 성범아 이거 category에 스트링으로 "01010" 이런 식으로 보내주라
        // 예를 들어서 4.1 이랑 4.4에 관련된 거 찾고 싶으면 "01001"
        // 4.2 이랑 4.4에 관련된 거 찾고 싶으면 "00101"
        // "4.0. 상관없음"이면 "1xxxx" > x는 0이든 1이든 상관없다는 의미
    
    var recv_category = req.body.category; 

    //console.log('category:' + recv_category);

    var recv_Employment_sup = req.body.Employment_sup;
    var recv_Startup_sup = req.body.Startup_sup;
    var recv_Life_welfare = req.body.Life_welfare;
    var recv_Residential_finance = req.body.Residential_finance;

    if(recv_category[0] == 1)
    {   
        recv_Employment_sup = 1;
        recv_Startup_sup = 1;
        recv_Life_welfare = 1;
        recv_Residential_finance = 1;
    }
    else
    {
        recv_Employment_sup = recv_category[1];
        recv_Startup_sup = recv_category[2];
        recv_Life_welfare = recv_category[3];
        recv_Residential_finance = recv_category[4];
    }

    var temp_info = ' ';

    if(recv_Employment_sup == 1)
    {
        //console.log('recv_Employment_sup:' + recv_Employment_sup);
        temp_info = temp_info + 'Employment_sup = 1 OR ';
        //console.log(temp_info);
    }
    if(recv_Startup_sup == 1)
    {
        //console.log('recv_Startup_sup:' + recv_Startup_sup);
        temp_info = temp_info + 'Startup_sup = 1 OR ';
        //console.log(temp_info);
    }
    if(recv_Life_welfare == 1)
    {
        //console.log('recv_Life_welfare:' + recv_Life_welfare);
        temp_info = temp_info + 'Life_welfare = 1 OR ';
        //console.log(temp_info);
    }
    if(recv_Residential_finance == 1)
    {
        //console.log('recv_Residential_finance:' + recv_Residential_finance);
        temp_info = temp_info + 'Residential_finance = 1 OR ';
        //console.log(temp_info);
    }
    //console.log(temp_info);
    var category_info = temp_info.substring(0, temp_info.length-3);

    //console.log('category_info:' + category_info);

    //console.log('recv_Employment_sup:' + recv_Employment_sup);
    //console.log('recv_Startup_sup:' + recv_Startup_sup);
    //console.log('recv_Life_welfare:' + recv_Life_welfare);
    //console.log('recv_Residential_finance:' + recv_Residential_finance);

        
    //5. 연령 - integer
    var recv_age = req.body.age;

    //6. 키워드 기반 검색 - title, contents내에 해당 키워드가 있으면 ㅇㅋ
    var recv_keyword = req.body.keyword;
    
    // 키워드 필터링
    var regex = /[가-힣]+/g; 
    
    var match = recv_keyword.match(regex);

    // for (var i = 0; i < match.length; i++)
    // {
    //     console.log(match[i]);
    // }

    var SQL = 'SELECT policy.* ' +
    'FROM policy NATURAL JOIN interest ' +
    'WHERE' +
    category_info;

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
