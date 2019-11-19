$(document).ready(function(){
    
});

function logincheck(){
    var id = $(".id").val();
    var pw = $(".pw").val();

    var admin = {"id" : id, "password" : pw};

    //alert(id + "ff" + admin.id + admin.password);

//패스 맞추기
        $.ajax({
            url : "http://49.236.136.213:3000/web_admin/certificate",
            type : "post",
            data : admin,
            success : function(data) {
                
                if(data == 1){
                    alert("관리자 로그인에 성공하였습니다.");
                    $(location).attr("href", "member.html");
                }
                else {
                    alert("로그인 정보를 확인해주십시오.");
                }
                
            },
            error: function(request,status,error){
                alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            }
    
        });

}

   