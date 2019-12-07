$(document).ready(function(){
    IPcheck();
   callinterst();
});

function IPcheck(){

    $.ajax({
        url : "http://49.236.136.213:3000/web_admin/session_certificate",
        type : "post",
        success : function(data) {              
            if(data != 1){
              alert("로그인이 필요합니다.");
              $(location).attr("href", "login.html");
            }              
        },
        error: function(request,status,error){
            alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
        }  
    });
}

function callinterst(){
   $.ajax({
        url: "http://49.236.136.213:3000/user/show_all_users",
        type: "GET",
        success: function(data){
           //alert('성공');
            $.each(data, function(idx, content){
                //console.log(content);
                //alert(idx + ":"+content.name);

                if(content.sex == undefined) content.sex = "-";
                //if(content.region == undefined) content.region = "-";
                //console.log(content.region);
                var element = '<tr>' +
                              '<td>' + content.uID + '</td>'+
                              '<td>' + content.name + '</td>'+
                              '<td>' + content.age + '</td>'+
                              '<td>' + content.sex + '</td>'+
                              '<td>' + content.dor + " " + content.si + '</td>'+
                              '<td>' + content.Employment_sup_priority + '</td>'+
                              '<td>' + content.Startup_sup_priority + '</td>'+
                              '<td>' + content.Life_welfare_priority + '</td>'+
                              '<td>' + content.Residential_financial_priority + '</td>'+
                              '</tr>';
          
                $("tbody").append(element); 
            });

            makedatable();

        },
        error: function(){
            alert("데이터베이스 에러");
        }
    });
}

