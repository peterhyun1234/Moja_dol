$(document).ready(function(){
	$.ajax({
		url: "http://49.236.136.213:3000/request/show_all_reqs",
		type: "POST",
		success: function(data){
		   //alert('성공');
			$.each(data, function(idx, content){
				//alert(idx + ":"+content.name);
				var string = '<li class="requestlist">'+
							 '<span class="req_code" data-sort="req_code">'+ content.req_code +'</span>'+
							 '<span class="userID" data-sort="userID">'+ content.req_uID +'</span>'+
							 '<span class="req_category" data-sort="req_category">'+ content.req_category +'</span>'+    
							 '<span class="request_time" data-sort="request_time">'+ content.req_time +'</span>'+   
							 '<span class="request_comment" data-sort="request_comment"><input type="text" value="' +content.req_contents +  '" readonly/></span>'+   
							 '<div class="hover_commentBox"><div class="hover_comment">' +content.req_contents +  '</div></div>';

				if(content.req_flag == null){
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox" checked data-toggle="toggle"></span></li>';
				}
				else {
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox" unchecked data-toggle="toggle"></span></li>';
				}             
				
				string = string + flag;
				$(".list").append(string);

			});
			
		},
		error: function(){
			alert("데이터베이스 에러");
		}
	});


    portfolioPageSetting();
    hover_request_comment();
});
//req_code userID req_category request_time request_comment request_flag
function portfolioPageSetting(){
	// 사용되는 리스트는 무조건 ID 로 선언 
	var options = {
			// 구분조건나열
			valueNames: [
				'req_code','userID','req_category', 'request_time', 'request_comment', 'request_flag'    // 1.검색을 위한 영상의 제목
			],
			page: 6,			 // 한 페이지 출력 영상 개수 
			pagination: true	 // 자동 페이징 여부 
		};
	
		var userList = new List('test-list', options); // 위 옵션에 따라 만들어진 리스트
		
		//list 받아오는 ajax 적기 
}

function hover_request_comment(){
    $(".request_comment").hover(function(){
        $(this).parent().children("div").addClass("active");
    }, function(){
        $(".hover_commentBox").removeClass("active");
    }
    );
}

