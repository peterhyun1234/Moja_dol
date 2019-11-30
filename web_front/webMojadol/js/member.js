$(document).ready(function () {
  Loading(); //스피너 마스크
  firebasetest(); //파이어베이스 연동 
});


function firebasetest(){
  //firestore로 연동해둠
  var firebaseConfig = {
    apiKey: "AIzaSyDo--9OT4OtrahZiX8pO9AzBzfCDJXzhuI",
    authDomain: "mypolicy-d626b.firebaseapp.com",
    databaseURL: "https://mypolicy-d626b.firebaseio.com",
    projectId: "mypolicy-d626b",
    storageBucket: "mypolicy-d626b.appspot.com",
    messagingSenderId: "419848304732",
    appId: "1:419848304732:web:920baedb134498ad02ce99"
  }; 
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore();

  //collection 앞에 컬렉션 이름 맞추기 
  db.collection("user").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, '=>', doc.data(), doc.data().birth);

      var age = doc.data().age;
      var id = doc.id;
      var name = doc.data().name;
      var sex = doc.data().sex;
      var region = doc.data().region;

      //console.log(doc.id + "++" + name + "++" + id + "++" + age);
      if(sex == undefined) sex = "-";
      if(region == undefined) region = "-";

      var element = '<tr>' +
                    '<td>' + id + '</td>'+
                    '<td>' + name + '</td>'+
                    '<td>' + age + '</td>'+
                    '<td>' + sex + '</td>'+
                    '<td>' + region + '</td>'+
                    '</tr>';

      $("tbody").append(element);

    });
    
    makedatable();

  });
}


//로딩 마스크
function Loading() {
  LoadingWithMask('/image/Spinner3.gif');
  setTimeout("closeLoadingWithMask()", 1500);
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
