$(document).ready(function(){
  
  firebasedatacall();
  

});
function firebasedatacall(){
  
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
// Initialize Firebase 초기화
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//test db 연동
var textlist = firebase.database().ref('/texttest/text123');
var index = 0;
textlist.child('text').once('value', function(snapshot){
 snapshot.forEach(function(member) {
     index++;
     var uid = member.key; // uid 받아옴 
     var name = member.val().name;
     var id = member.val().id;
     var birth = member.val().birth;
     console.log(index+ "++" + name+ "++" + id + "++" + birth);

    var element =   '<li class="memberlist">'+ 
                        '<span class="memberId">' + id + '</span>'+
                        '<span class="membername">' + name + '</span>'+
                        '<span class="memberbirth">' + birth + '</span>'+
                    '</li>';        
           


    $(".list").append(element);

  });

  portfolioPageSetting();
});
}
function portfolioPageSetting(){
	// 사용되는 리스트는 무조건 ID 로 선언 
	var options = {
			// 구분조건나열
			valueNames: [
				'memberId','membername','memberbirth'    // 1.검색을 위한 영상의 제목
			],
			page: 5,			 // 한 페이지 출력 영상 개수 
			pagination: true	 // 자동 페이징 여부 
		};
	
		var userList = new List('test-list', options); // 위 옵션에 따라 만들어진 리스트 

	
}