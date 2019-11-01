$(document).ready(function(){
	$.ajax({
		url: "http://49.236.136.213:3000/policy/show_all_policies",
		type: "POST",
		success: function(data){
		   //alert('성공');
			$.each(data, function(idx, content){
				//alert(idx + ":"+content.name);
				//timestamp 전처리
 				var beforedate = content.crawing_date;
				var cut = beforedate.split("T");
				var date = cut[0];
				var cut2 = cut[1].split(".000Z");
				var time = cut2[0];
				var retime = date + " " + time;
				//alert(retime);
				var expiration = "진행중";
				if(content.expiration_flag != 0) expiration = "만료";

				var string = '<li class="policylist " onclick="click_detail_policy()">'+
							 '<span class="p_code" data-sort="p_code">'+ content.p_code +'</span>'+
							 '<span class="p_title" data-sort="p_title"><input type="text" value="'+ content.title +'" readonly/></span>'+
							 '<span class="crawling_data" data-sort="crawling_data">'+ retime +'</span>'+   
							  '<span class="expiration_flag" data-sort="expiration_flag">' + expiration +  '</span></li>';

				$(".list").append(string); 
 
				console.log(content);
			});

			listPageSetting();
	
			
		},
		error: function(){
			alert("데이터베이스 에러");
		}
	});

   
	
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

		$(".detail_p_code").text()

		var title;
		var uri;
		var apply_start;
		var apply_end;
		var start_age;
		var end_age;
		var application_target;
		var location;
		var crawing_date;
		var expiration_flag;

		//특정 정책 코드에 대한 내용들 출력하기 
		$.ajax({
			url: "http://49.236.136.213:3000/policy/show_all_policies",
			type: "POST",
			success: function(data){
			//alert('성공');
				$.each(data, function(idx, content){
					if(content.p_code == p_code){
						var beforedate = content.crawing_date;
						var cut = beforedate.split("T");
						var date = cut[0];
						var cut2 = cut[1].split(".000Z");
						var time = cut2[0];
						var retime = date + " " + time;
						//alert(retime);
						expiration_flag = "진행중";
						if(content.expiration_flag != 0) expiration_flag = "만료";

						title = content.title;
						uri = content.uri;
						apply_start = content.apply_start;
						apply_end = content.apply_end;
						start_age = content.start_age;
						end_age = content.end_age;
						application_target = content.application_target;
						location = content.location;
						crawing_date = content.crawing_date;
						//$(".detail_title").text(title);
						$(".uri").text(uri);
						alert(uri + "인뎃스 " + idx);

					}
				});
			},
			error: function(){
				alert("데이터베이스 에러");
			}
		});

	
/*						title
						 uri
						 apply_start
						 apply_end
						 start_age
						 end_age
						 application_target
						 location
						 crawing_date
						 expiration_flag */


	var code = {"p_code" : p_code};
	$.ajax({
		url: "http://49.236.136.213:3000/policy/origin_table",
		type: "POST",
		data: code,
		success: function(data){
		   //alert('성공');
			console.log(data);
							
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}
	});

	$.ajax({
		url: "http://49.236.136.213:3000/review/selected_review",
		type: "POST",
		data: code,
		success: function(data){
		   //alert('성공');
		   $(".review_listBox.bottom").html("");

		   $.each(data, function(idx, content){
					
				var beforedate = content.req_time;
				var cut = beforedate.split("T");
				var date = cut[0];
				var cut2 = cut[1].split(".000Z");
				var time = cut2[0];
				var retime = date + " " + time;
				//alert(retime);

				var string = '<li class="review_list  clearfix">'+
							'<p class="review_code">' + content.review_code + '</p>'+
							'<p class="review_uID">' + content.review_uID + '</p>'+
							'<p class="contents">' + content.contents + '</p>'+
							'<p class="req_time">' + retime + '</p>'+
							'<p class="deletebtn"><input type="button" class="delete_btn" value="삭제"/></p>'+
							'</li>';
				$(".review_listBox.bottom").append(string); 

				console.log(content);

			});
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}

	});



    });
}