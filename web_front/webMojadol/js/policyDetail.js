$(document).ready(function(){
    portfolioPageSetting();
    
  
  });
  

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
  
  
  
  function test() {
    LoadingWithMask('/image/Spinner.gif');
    setTimeout("closeLoadingWithMask()", 3000);
  }
                 
  function LoadingWithMask(gif) {
    //화면의 높이와 너비를 구하기
    var maskHeight = $(document).height();
    var maskWidth  = window.document.body.clientWidth;
     
    //화면에 출력할 마스크
    var mask       ="<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; display:none; left:0; top:0;'><div id='loadingImg'></div></div>";
    var loadingImg ='';
      
    loadingImg +=" <img src='"+ gif +"' style='left:50%; top:50%; transform: translate(-50%, -50%); position: absolute; display: block; margin: 0px auto;'/>";
  
    $('body').append(mask)
  
    $('#mask').css({
            'width' : maskWidth,
            'height': maskHeight,
            'opacity' :'0.3'
    });
  
    //마스크 표시
    $('#mask').show();
  
    //로딩중 이미지 표시
    $('#loadingImg').append(loadingImg);
    $('#loadingImg').show();
  }
  
  function closeLoadingWithMask() {
    $('#mask, #loadingImg').hide();
    $('#mask, #loadingImg').empty(); 
  }
  