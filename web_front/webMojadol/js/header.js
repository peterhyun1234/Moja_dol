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