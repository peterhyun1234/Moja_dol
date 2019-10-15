$(document).ready(function(){
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

