var express = require('express');
var router = express.Router();
let { PythonShell } = require('python-shell');

var connection = require('../index.js').connection;
var firebase = require("firebase");

router.get('/fire_all_users', function (req, res) {

    var SQL = 'SELECT * from user';

    console.log("API 'user/show_all_users' called");
    console.log(SQL);

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

router.get('/show_all_users', function (req, res) {

    var SQL = 'SELECT * from user';

    console.log("API 'user/show_all_users' called");
    console.log(SQL);

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

router.get('/info', function (req, res) {

    var SQL = 'SELECT id, password from admin_web';

    console.log("API 'user/info' called");
    console.log(SQL);

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

router.post("/my_priority", function (req, res, next) {

    // 사용자 ID (type: string)
    var recv_uID = req.body.uID;

    var SQL = "SELECT Employment_sup_priority, Startup_sup_priority, Life_welfare_priority, Residential_financial_priority " +
        "FROM user " +
        "WHERE " +
        "uID = '" + recv_uID + "'";


    console.log("API 'user/my_priority' called");
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

router.post("/register", function (req, res, next) {
    // 사용자 ID (type: string)
    var recv_uID = req.body.uID;

    // 사용자 이름 (type: string) - 꼭 필요한 건 아님
    var recv_name = req.body.name;

    // 사용자 사는 지역 (type: string)
    var recv_region_arr = req.body.region;
    //console.log("region_arr_len: " + region_arr_len);

    // if (region_arr_len == 2 && recv_region_arr[1] != "") // 
    // {
    //     recv_region = recv_region_arr[0] + " " + recv_region_arr[1];
    // }
    // else if(region_arr_len == 1 || recv_region_arr[1] == "")
    // {
    //     recv_region = recv_region_arr[0];
    // }
    // else {
    //     recv_region = "미정";
    // }

    // 사용자 성별 (type: String)
    var recv_sex = req.body.sex;
    if (recv_sex == null || recv_sex.length == 0) {
        recv_sex = '';
    }
    // 사용자 나이 (type: integer)
    var recv_age = req.body.age;
    if (recv_age == null || recv_age.length == 0) {
        recv_age = 0;
    }
    // 취업지원에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Employment_sup_priority = req.body.Employment_sup_priority;
    if (recv_Employment_sup_priority == null || recv_Employment_sup_priority.length == 0) {
        recv_Employment_sup_priority = 0;
    }

    // 창업지원에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Startup_sup_priority = req.body.Startup_sup_priority;
    if (recv_Startup_sup_priority == null || recv_Startup_sup_priority.length == 0) {
        recv_Startup_sup_priority = 0;
    }

    // 생활과 복지에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Life_welfare_priority = req.body.Life_welfare_priority;
    if (recv_Life_welfare_priority == null || recv_Life_welfare_priority.length == 0) {
        recv_Life_welfare_priority = 0;
    }

    // 주거와 금융에 대한 관심도(type: integer), (최소 1부터 최대 5까지)
    var recv_Residential_financial_priority = req.body.Residential_financial_priority;
    if (recv_Residential_financial_priority == null || recv_Residential_financial_priority.length == 0) {
        recv_Residential_financial_priority = 0;
    }


    var SQL = 'INSERT INTO user VALUES(' +
        '\'' + recv_uID + '\'' +
        ', \'' + recv_name + '\'' +
        ', \'' + recv_region_arr[0] + '\'' +
        ', \'' + recv_region_arr[1] + '\'' +
        ', ' + recv_age +
        ', ' + recv_Employment_sup_priority +
        ', ' + recv_Startup_sup_priority +
        ', ' + recv_Life_welfare_priority +
        ', ' + recv_Residential_financial_priority +
        ', \'' + recv_sex + '\'' + ') ' +
        "ON DUPLICATE KEY UPDATE " +
        "uID = '" + recv_uID + "', " +
        "name = '" + recv_name + "', " +
        "dor = '" + recv_region_arr[0] + "', " +
        "si = '" + recv_region_arr[1] + "', " +
        "age = " + recv_age + ", " +
        "Employment_sup_priority = " + recv_Employment_sup_priority + ", " +
        "Startup_sup_priority = " + recv_Startup_sup_priority + ", " +
        "Life_welfare_priority = " + recv_Life_welfare_priority + ", " +
        "Residential_financial_priority = " + recv_Residential_financial_priority + ", " +
        "sex = '" + recv_sex + "'";

    console.log("API 'user/register' called");
    console.log(SQL);

    //절 차 
    connection.query(SQL, function (err, data) {
        if (!err) {
            res.send(data);
        }
        else {
            console.log(err);
            res.send('error');
        }
    });


    var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python3.7',
        pythonOptions: ['-u'],
        scriptPath: 'KNN',
        args: [recv_uID]
    };

    //python shell test
    PythonShell.run('knn_base_rec.py', options, function (err, results) {
        if (err) {
            throw err;
        }

        console.log("result: " + results);

    });

    // finally
});



router.post("/add_user", function (req, res, next) {

    // 사용자 ID (type: string)
    var recv_uID = req.body.uID;

    // 사용자 이름 (type: string) - 꼭 필요한 건 아님
    var recv_name = req.body.name;

    // 사용자 사는 지역 (type: string)
    var recv_dor = req.body.dor;

    // 사용자 사는 지역 (type: string)
    var recv_si = req.body.si;

    // 사용자 성별 (type: String)
    var recv_sex = req.body.sex;
    if (recv_sex == null || recv_sex.length == 0) {
        recv_sex = '';
    }

    // 사용자 나이 (type: integer)
    var recv_age = req.body.age;
    if (recv_age == null || recv_age.length == 0) {
        recv_age = 0;
    }


    // var firebaseConfig = {
    //     apiKey: "AIzaSyDo--9OT4OtrahZiX8pO9AzBzfCDJXzhuI",
    //     authDomain: "mypolicy-d626b.firebaseapp.com",
    //     databaseURL: "https://mypolicy-d626b.firebaseio.com",
    //     projectId: "mypolicy-d626b",
    //     storageBucket: "mypolicy-d626b.appspot.com",
    //     messagingSenderId: "419848304732",
    //     appId: "1:419848304732:web:920baedb134498ad02ce99"
    // };

    // firebase.initializeApp(firebaseConfig);

    // var db = firebase.firestore();

    // // .equalTo(recv_uID)

    // db.collection("user").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {

    //         if(doc.id = recv_uID){
    //             var age = doc.data().age;
    //             var id = doc.id;
    //             var name = doc.data().name;
    //             var sex = doc.data().sex;
    //             var region = doc.data().region;
                
    //             console.log("age: " + age);
    //             console.log("id: " + id);
    //             console.log("name: " + name);
    //             console.log("sex: " + sex);
    //             console.log("region: " + region);
    //             console.log("");
    //         }
    //     });
    // });

    var SQL = "INSERT INTO user " +
        "(uID, name, dor, si, age, sex) " +
        "VALUES(" +
        '\'' + recv_uID + '\'' +
        ', \'' + recv_name + '\'' +
        ', \'' + recv_dor + '\'' +
        ', \'' + recv_si + '\'' +
        ', ' + recv_age +
        ', \'' + recv_sex + '\'' + ') ' +
        "ON DUPLICATE KEY UPDATE " +
        "uID = '" + recv_uID + "', " +
        "name = '" + recv_name + "', " +
        "dor = '" + recv_dor + "', " +
        "si = '" + recv_si + "', " +
        "age = " + recv_age + ", " +
        "sex = '" + recv_sex + "'";

    console.log("API 'user/add_user' called");
    console.log(SQL);

    //절 차 
    connection.query(SQL, function (err, data) {
        if (!err) {
            res.send(data);
        }
        else {
            console.log(err);
            res.send('error');
        }
    });

});

module.exports = router;
