$(document).ready(function () {
  test();
  firebasedatacall();

  //firebasetest();
});

function firebasetest() {
  /*   const firebase = require("firebase");
    // Required for side-effects
    require("firebase/firestore"); */

  // Initialize Cloud Firestore through Firebase
  var firebaseConfig = {
    apiKey: 'AIzaSyDo--9OT4OtrahZiX8pO9AzBzfCDJXzhuI',
    authDomain: 'mypolicy-d626b.firebaseapp.com',
    projectId: 'mypolicy-d62b'
  };

  var app = firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore(app);

  //alert(app);
  //alert(db);
  console.log(app);
  console.log(db);

   db.collection("texttest").get().then((querySnapshot) => {
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  });


}
function firebasedatacall() {

  // firebase 키 연동 
  var firebaseConfig = {
    apiKey: "AIzaSyCRbCZMGG2Xrxr19e98oHGZAAgAV8nOeCY",
    authDomain: "webtest-b218c.firebaseapp.com",
    databaseURL: "https://webtest-b218c.firebaseio.com",
    projectId: "webtest-b218c",
    storageBucket: "",
    messagingSenderId: "900147712475",
    appId: "1:900147712475:web:a98af2a1f01cf2241317fe",
    measurementId: "G-WTHK97RKWS"
  }; 

  
/*    var firebaseConfig = {
     apiKey: "AIzaSyD9xq1Ouw2kWbkx7ikSlGHeEf9lJFJi-RU",
     authDomain: "fir-20190925.firebaseapp.com",
     databaseURL: "https://fir-20190925.firebaseio.com",
     storageBucket: "",

   }; */

  // Initialize Firebase 초기화
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  //test db 연동
  var textlist = firebase.database().ref('/texttest/text123');
  var index = 0;
  textlist.child('text').once('value', function (snapshot) {
    snapshot.forEach(function (member) {
      index++;
      //alert("데이터 받아오니?" + member);
      var uid = member.key; // uid 받아옴 
      var name = member.val().name;
      var id = member.val().id;
      var birth = member.val().birth;
      console.log(index + "++" + name + "++" + id + "++" + birth);

      var element = '<li class="memberlist">' +
        '<span class="memberId">' + id + '</span>' +
        '<span class="membername">' + name + '</span>' +
        '<span class="memberbirth">' + birth + '</span>' +
        '</li>';



      $(".list").append(element);

    });

    listPageSetting();
  });
}

function listPageSetting() {
  // 사용되는 리스트는 무조건 ID 로 선언 
  var options = {
    // 구분조건나열
    valueNames: [
      'memberId', 'membername', 'memberbirth'    // 1.검색을 위한 값
    ],
    page: 5,			 // 한 페이지 출력 영상 개수 
    pagination: true	 // 자동 페이징 여부 
  };

  var userList = new List('test-list', options); // 위 옵션에 따라 만들어진 리스트 


}



function test() {
  LoadingWithMask('/image/Spinner3.gif');
  setTimeout("closeLoadingWithMask()", 3000);

}

function LoadingWithMask(gif) {
  //화면의 높이와 너비를 구하기
  var maskHeight = $(document).height();
  var maskWidth = window.document.body.clientWidth;

  //화면에 출력할 마스크
  var mask = "<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; display:none; left:0; top:0;'><div id='loadingImg'></div></div>";
  var loadingImg = '';

  loadingImg += " <img src='" + gif + "' style='left:50%; top:50%; transform: translate(-50%, -50%); position: absolute; display: block; margin: 0px auto;'/>";

  $('body').append(mask)

  $('#mask').css({
    'width': maskWidth,
    'height': maskHeight,
    'opacity': '0.3'
  });


  //마스크 표시
  $('#mask').show();

  //   //로딩중 이미지 표시
  $('#loadingImg').append(loadingImg);
  $('#loadingImg').show();
}

function closeLoadingWithMask() {
  $('#mask, #loadingImg').hide();
  $('#mask, #loadingImg').empty();
}
