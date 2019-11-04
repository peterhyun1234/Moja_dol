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
							  '<span class="expiration_flag" data-sort="expiration_flag">' + expiration +  "ff" + content.expiration_flag+'</span></li>';

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

/* 		var title;
		var uri;
		var apply_start;
		var apply_end;
		var start_age;
		var end_age;
		var application_target;
		var location;
		var crawing_date;
		var expiration_flag; */

		//특정 정책 코드에 대한 내용들 출력하기 
		$.ajax({
			url: "http://49.236.136.213:3000/policy/show_all_policies",
			type: "POST",
			success: function(data){
			//alert('성공');

			$(".detail_title").text("");
			$(".crawing_date").text(""); // 크롤링 날짜
			$(".policy_contents").text(""); // 내용
			$(".application_target").text(""); // 대상
			$(".location").text(""); // 지역
			$(".uri").text(""); // 링크
			$(".third_line").text(""); 
			$(".expiration_flag2").text("");

				$.each(data, function(idx, content){
					if(content.p_code == p_code){

						var beforedate = content.crawing_date;
						var cut = beforedate.split("T");
						var date = cut[0];
						var cut2 = cut[1].split(".000Z");
						var time = cut2[0];
						var retime = date + " " + time;

						if(content.apply_start != null){
							var apply_start = content.apply_start;
							var cut1 = apply_start.split("T");
							var date1 = cut1[0];
						}else {
							date1 = "";
						}

						if(content.apply_end != null){
							var apply_end = content.apply_end;
							var cut2 = apply_end.split("T");
							var date2 = cut2[0];
						}else {
							date2 = "";
						}

						var string = '<p class="third title">신청기간</p> '+
									 '<div class="apply">'+
									 '<input type="text" class="apply_start" value="'+ date1 +'">'+
									 '<p style="margin:0;">~</p><input type="text" class="apply_end" value="'+  date2 +'"></div>'+
									 '<p class="third title">대상 연령</p><div class="age">'+
									 '<input type="text" class="start_age" value="'+ content.start_age +'">'+
									 '<p style="margin:0;">~</p><input type="text" class="end_age" value="'+ content.end_age +'"></div>';
							
						$(".third_line").append(string); 
						

						
						$(".crawing_date").append(date); // 크롤링 날짜
						$(".detail_title").append(content.title); // 제목
						$(".policy_contents").append(content.contents); // 내용
						
						$(".application_target").append(content.application_target); // 대상
						$(".location").append(content.location); // 지역
						$(".uri").append(content.uri); // 링크
				

						if(content.expiration_flag == 0){
							var string2 = '<input type="checkbox" unchecked="true" data-toggle="toggle" onclick="modifyflag(this.id)" id="expiration'+content.p_code+'"></input>';
						}
						else {
							var string2 = '<input type="checkbox" checked="true" data-toggle="toggle" onclick="modifyflag(this.id)" id="expiration'+content.p_code+'"></input>';
						}  
				
						$(".expiration_flag2").append(string2);
						
						console.log(content);

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

	//특정 정책 코드 오리지널 테이블 가져오기
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


	//특정 정책 코드 댓글 가져오기 
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
							'<p class="deletebtn"><input type="button" id="'+ content.p_code+'" class="delete_btn" value="삭제" onclick="delete_review(this)"/></p>'+
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

// 정책 내용 수정하기
function modifypolicy(){
	alert("수정");
	var title = $(".detail_title").text();
	var contents = $(".policy_contents").text();
	
	var uri = $(".uri").text();


	var apply_start = $(".apply_start").val();
	var apply_end = $(".apply_end").val();
	var start_age = $(".start_age").val();
	var end_age = $(".end_age").val();
	var application_target = $(".application_target").text();
	var location = $(".location").text();

	alert(uri);
	alert(apply_start);
	alert(title+"+"+
		contents + "+"+
		uri+"+"+
		apply_start+"+"+
		apply_end+"+"+
		start_age+"+"+
		end_age+"+"+
		application_target+"+"+
		location);

}

//정책 만료여부 변겅
function modifyflag(me){
	var cut = me.split("expiration");
	var p_code = cut[1];
	var expiration_flag;
	var string = "input:checkbox[id='expiration']";
	

	if($(string).is(":checked") == true)  expiration_flag = 0; //만료 - 원래 노체크였으면 1로해서 보냄(누르는 순간 checked로 되어 true로 출력되는 것임)
	else expiration_flag=1; // 원래 체크였으면 0으로 해서 보냄
	
	var expiration = {"p_code" :  p_code, "expiration_flag" :  expiration_flag};

	//alert(me + "여부" + p_code + "flag : " + $(string).is(":checked"));

	alert(expiration.p_code + "fff" + expiration.expiration_flag);
	console.log("c출력?"+expiration);
 	 $.ajax({
		url : "http://49.236.136.213:3000/request/change_flag",
		type : "post",
		data : expiration,
		success : function(data) {
			alert("수정 성공????????" + data);
			location.reload();

		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}

	});   
}

//댓글삭제
function delete_review(me){
	var p_code = me.id;
	var review_code =  $(me).parent().siblings(".review_code").text();
	//alert(review_code + me.id);
	//review_code

	var data = {"p_code" : p_code, "review_code" : review_code};

	if(confirm("댓글을 삭제하시겠습니까?")){
		$.ajax({
			url : "http://49.236.136.213:3000/review/delete_review",
			type : "post",
			data : data,
			success : function(data) {
				//alert("댓글 삭제 성공");
				location.reload();
			},
			error: function(request,status,error){
				alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			}
	
		}); 
	 }
	 else {
		 alert("댓글 삭제가 취소되었습니다.");
	 }
}