$(document).ready(function(){
	callinterst();
});

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
                if(content.region == undefined) content.region = "-";
           
                var element = '<tr>' +
                              '<td>' + content.uID + '</td>'+
                              '<td>' + content.name + '</td>'+
                              '<td>' + content.age + '</td>'+
                              '<td>' + content.sex + '</td>'+
                              '<td>' + content.region + '</td>'+
                              '<td>' + content.Employment_sup_priority + '</td>'+
                              '<td>' + content.Startup_sup_priority + '</td>'+
                              '<td>' + content.Life_welfare_priority + '</td>'+
                              '<td>' + content.Residential_financial_priority + '</td>'+
                              '</tr>';
          
                $("tbody").append(element); 
            });

            makedatable();
            listPageSetting();

        },
        error: function(){
            alert("데이터베이스 에러");
        }
    });
}


