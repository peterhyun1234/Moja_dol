$(document).ready(function(){
    testimgclick();
    hoversubmenu();    
    clicklogo();    
});

function testimgclick(){
    $(".testimg").on("click", function(){
        alert("이미지 클릭");
    });
}

function hoversubmenu(){
    $('.menulist li').mouseover(function(){
        //$('.test').css('font-size:','2em');
        $('.testho:before').css('width','30px');
        $('.test').css('background-color','black');
        $('.test').css('width','100px');
    });
}

function clicklogo(){
    $(".logobox").on("click", function(){
        location.replace('member.html');
    });
}

function logout(){
    $.ajax({
        url : "http://49.236.136.213:3000/web_admin/logout",
        type : "post",
        success : function(data) {              
            if(data == 1){
              alert("로그아웃 되었습니다.");
              $(location).attr("href", "login.html");
            }              
        },
        error: function(request,status,error){
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }  
    });

}