var express = require('express');
var fs = require('fs');
var router = express.Router();

var connection = require('../index.js').connection;


router.post("/show_interest", function (req, res, next) {

    var recv_p_code = req.body.p_code;

    var SQL = 'SELECT * FROM interest WHERE p_code = '+ recv_p_code;

    console.log("API 'interest/show_interest' called");
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

router.post("/modify_interest", function (req, res, next) {

    var recv_p_code = req.body.p_code;
    var recv_Employment_sup = req.body.Employment_sup;
    var recv_Startup_sup = req.body.Startup_sup;	
    var recv_Life_welfare = req.body.Life_welfare;
    var recv_Residential_finance = req.body.Residential_finance;


    var SQL = 'UPDATE interest SET ' + 
    'Employment_sup = ' + recv_Employment_sup + 
    ', Startup_sup = ' + recv_Startup_sup + 
    ', Life_welfare = ' + recv_Life_welfare + 
    ', Residential_finance = ' + recv_Residential_finance + 
    ' WHERE p_code = '+ recv_p_code ;

    console.log("API 'interest/modify_interest' called");
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
