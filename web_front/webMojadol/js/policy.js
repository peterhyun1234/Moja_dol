$(document).ready(function(){
    listPageSetting();
	click_detail_policy();
});

function listPageSetting(){
	// 사용되는 리스트는 무조건 ID 로 선언 
	var options = {
			// 구분조건나열
			valueNames: [
                'p_code', 'p_title', 'crawling_data', 'expiration_flag'    //검색을 위한 키워드
			],
			page: 6,			 // 한 페이지 출력 영상 개수 
			pagination: true	 // 자동 페이징 여부 
		};
	
		var userList = new List('test-list', options); // 위 옵션에 따라 만들어진 리스트 	
}
function click_detail_policy(){
    $(".policylist").click(function(){
		
        //alert($(this).children(".p_code").text());
        var p_code = $(this).children(".p_code").text();
		$(".detail_p_code").text(p_code);
		console.log(p_code);
    });
}