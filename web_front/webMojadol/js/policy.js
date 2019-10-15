$(document).ready(function(){
    portfolioPageSetting();
    click_detail_policy();
});

function portfolioPageSetting(){
	// 사용되는 리스트는 무조건 ID 로 선언 
	var options = {
			// 구분조건나열
			valueNames: [
                'p_code', 'p_title', 'crawling_data', 'expiration_flag'    // 1.검색을 위한 영상의 제목
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
    });
}