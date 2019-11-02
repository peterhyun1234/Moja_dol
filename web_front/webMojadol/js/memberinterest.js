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
                //alert(idx + ":"+content.name);
                var string = '<li class="interestlist">'+
                            '<span class="userID" data-sort="userID">' + content.uID + '</span>'+
                            '<span class="age" data-sort="age">'+ content.age +'</span>'+
                            '<span class="job interest" data-sorst="job">' + content.Employment_Sup_priority + '</span>'+
                            '<span class="found interest" data-sorst="found">' + content.Startup_sup_priority + '</span>'+
                            '<span class="Life_welfare_priority interest" data-sorst="life">' + content.Life_welfare_priority + '</span>'+
                            '<span class="Residential_financial_priority interest" data-sorst="dwelling">' + content.Residential_financial_priority + '</span>' +
                            '</li>';

                $(".list").append(string);

            });
            listPageSetting();
        },
        error: function(){
            alert("데이터베이스 에러");
        }
    });
}

function listPageSetting(){
	// 사용되는 리스트는 무조건 ID 로 선언 
	var options = {
			// 구분조건나열
			valueNames: [
                'userID'    //검색을 위한 키워드
			],
			page: 6,			 // 한 페이지 출력 영상 개수 
			pagination: true	 // 자동 페이징 여부 
		};
	
		var userList = new List('test-list', options); // 위 옵션에 따라 만들어진 리스트 	
}

