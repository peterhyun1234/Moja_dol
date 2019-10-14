$(document).ready(function(){
    
});

function logincheck(){
    var id = $(".id").val();
    var pw = $(".pw").val();
    if(id == "admin"){

        if(pw == "admin"){
            $(location).attr("href", "member.html");
        }
        else {
            if(pw == ""){
                alert("비밀번호를 입력해주세요");
            }
            else {
                alert("올바른 비밀번호를 입력해주세요");
            }
        }
    }
    else {
        if(id == ""){
            alert("아이디를 입력해주세요");
        }
        else {
            alert("올바른 아이디를 입력해주세요");
        }
    }
}

   