$(document).ready(function(){
	$.ajax({
		url: "http://49.236.136.213:3000/policy/show_all_policies",
		type: "GET",
		success: function(data){
		   //alert('성공');
			$.each(data, function(idx, content){
				//alert(idx + ":"+content.name);
				//timestamp 전처리
  				var beforedate = content.crawling_date;
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
							  '<span class="expiration_flag" data-sort="expiration_flag">' + expiration + '</span></li>';

				$(".list").append(string);  
				console.log(idx);
				//console.log(content);
			});

			listPageSetting();
	
			
		},
		error: function(){
			alert("데이터베이스 에러");
		}
	});

	//writepolicy();
   
	
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


//정책 클릭시 (1)상세정보 받아오기 (2)오리지널 테이블 내용 받아오기 (3)정책별 카테고리 받아오기  (4)정책의 댓글 받아오기
function click_detail_policy(){
	//var click_cnt = 0;

    $(".policylist").click(function(){
		//alert("누름1");
		
		//alert($(this).children(".p_code").text());
		var p_code = $(this).children(".p_code").text();
		var code = {"p_code" : p_code};

		$(".detail_p_code").text(p_code);
		console.log(p_code);

		$(".detail_p_code").text();

		var apiurl = "http://49.236.136.213:3000/policy/" + p_code;

		//alert(apiurl);
		//특정 정책 코드에 대한 내용들 출력하기 
		$.ajax({
			url: apiurl,
			type: "GET",
			success: function(data){
			//alert('정책상세성공');
			//console.log(data);
				

			$(".detail_title").text("");
			$(".crawling_date").text(""); // 크롤링 날짜
			$(".policy_contents").text(""); // 내용
			$(".application_target").text(""); // 대상
			$(".dor").text(""); // 지역 도
			$(".si").text(""); // 지역 시
			$(".uri").text(""); // 링크
			$(".third_line").text(""); 
			$(".expiration_flag2").text("");
			
			$.each(data, function(idx, content){
				if(content.p_code == p_code){ 

						var beforedate = content.crawling_date;
						//alert(beforedata + "FF");
						var cut = beforedate.split("T");
						var date = cut[0];
						var cut2 = cut[1].split(".000Z");
						var time = cut2[0];
						var retime = date + " " + time;

						if(content.apply_start != null){
							var apply_start = content.apply_start;
							var cut1 = apply_start.split("T");
							var startdate = cut1[0];
							var starttime2 = cut1[1].split(".000Z");
							var starttime = starttime2[0];
							var start = startdate + " " + starttime;
						}else {
							date1 = "";
						}

						if(content.apply_end != null){
							var apply_end = content.apply_end;
							var cut2 = apply_end.split("T");
							var enddate = cut2[0];
							var endtime2 = cut2[1].split(".000Z");
							var endtime = endtime2[0];
							var end = enddate + " " + endtime;
						}else {
							date2 = "";
						}

						var string = '<p class="third title">신청기간</p> '+
									 '<div class="apply">'+
									 '<input type="text" class="apply_start" value="'+ start +'">'+
									 '<p style="margin:0;">~</p><input type="text" class="apply_end" value="'+  end +'"></div>'+
									 '<p class="third title">대상 연령</p><div class="age">'+
									 '<input type="text" class="start_age" value="'+ content.start_age +'">'+
									 '<p style="margin:0;">~</p><input type="text" class="end_age" value="'+ content.end_age +'"></div>';
							
						$(".third_line").append(string); 
						

						
						$(".crawling_date").append(retime); // 크롤링 날짜
						$(".detail_title").append(content.title); // 제목
						$(".policy_contents").append(content.contents); // 내용
						
						$(".application_target").append(content.application_target); // 대상
						$(".dor").append(content.dor); // 지역 도
						$(".si").append(content.si); // 지역 시
						$(".uri").append(content.uri); // 링크
						$(".expiration_flag2").append(content.expiration_flag);

						console.log(content);
						
				 	}
				 });
			},
			error: function(){
				alert("데이터베이스 에러");
			}
			
		});

		getOriginPolicy(p_code);
		getPolicyComment(p_code);
		getPolicyCategory(p_code);

	});

	
	
}

// 오리진 테이블 정책 받아오기
function getOriginPolicy(p_code){
		//alert("오리진");

		var code = {"p_code" : p_code};

		console.log(p_code);

		//특정 정책 코드 오리지널 테이블 가져오기
		$(".origin_policy").text("");

		$.ajax({
			url: "http://49.236.136.213:3000/policy/origin_table",
			type: "POST",
			data: code,
			success: function(data){
			//alert('성공');
				//console.log(data);
				$(".origin_policy").append(data.Ucontents);				
			},
			error: function(request,status,error){
				alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			}
		});

}

// 정책별 댓글 받아오기
function getPolicyComment(p_code){
	//alert("댓글");
	
	var code = {"p_code" : p_code};

	console.log(p_code);

	//특정 정책 코드 댓글 가져오기 
	$.ajax({
		url: "http://49.236.136.213:3000/review/selected_review",
		type: "POST",
		data: code,
		success: function(data){
			//alert('성공');
			$(".review_listBox.bottom").html("");
		
			$.each(data, function(idx, content){
								
				var beforedate = content.review_time;
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
		
				//console.log(content);
				//alert(content.review_code + retime);
		
			});
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}
		
	});

}

// 정책별 카테고리 받아오기
function getPolicyCategory(p_code){
	//alert("카테고리");
	
	var code = {"p_code" : p_code};

	console.log(p_code);

	//특정 정책 코드 interest 정보 가져오기  카테고리
	$(".interest_flag1").text("");
	$(".interest_flag2").text("");
	$(".interest_flag3").text("");
	$(".interest_flag4").text("");

	$.ajax({
		url: "http://49.236.136.213:3000/interest/show_interest",
		type: "POST",
		data: code,
		success: function(data){
		//alert('성공');
			$.each(data, function(idx, data){
				console.log("데이터 interest" + idx);
				//console.log("datadata" + data.Startup_sup);
				$(".interest_flag1").text(data.Employment_sup);
				$(".interest_flag2").text(data.Startup_sup);
				$(".interest_flag3").text(data.Life_welfare);
				$(".interest_flag4").text(data.Residential_finance);	
				
		});
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}
	});	

}

// 정책 내용 수정하기
function modifypolicy(){
	//alert("수정");
	var p_code = $(".detail_p_code").text();
	var crawling_date = $(".crawling_date").text();

	var expiration_flag = $(".expiration_flag2").val();
	var application_target = $(".application_target").val();
	var title = $(".detail_title").val();
	var contents = $(".policy_contents").val();
	var uri = $(".uri").val();
	var dor = $(".dor").val();
	var si = $(".si").val();

	var apply_start = $(".apply_start").val();
	var apply_end = $(".apply_end").val();
	var start_age = $(".start_age").val();
	var end_age = $(".end_age").val();


		if(p_code == "null" || p_code == "undefined") p_code=null;
		if(crawling_date == "null" || crawling_date == "undefined") crawling_date=null;
		if(expiration_flag == "null" || expiration_flag == "undefined") expiration_flag=null;
		if(application_target == "null" || application_target == "undefined" || application_target == " " || application_target == "") application_target=null;
		if(title == "null" || title == "undefined") title=null;
		if(contents == "null" || contents == "undefined") contents=null;
	
		if(uri == "null" || uri == "undefined") uri=null;
		if(dor == "null" || dor == "undefined" || dor==" " || dor=="") dor=null;
		if(si == "null" || si == "undefined" || si==" " || si=="") si=null;
		if(apply_start == "null" || apply_start == "undefined") apply_start=null;
		if(apply_end == "null" || apply_end == "undefined") apply_end=null;
		if(start_age == "null" || start_age == "undefined") start_age=null;
		if(end_age == "null" || end_age == "undefined") end_age=null;
		
	var policy = 
		{
			"p_code": p_code,
			"title": title,
			"uri": uri,
			"apply_start": apply_start,
			"apply_end": apply_end,
			"start_age": start_age,
			"end_age": end_age,
			"contents": contents,
			"application_target": application_target,
			"dor": dor,
			"si": si,
		//"crawling_date": crawling_date,
			"expiration_flag": expiration_flag
		};

		
	var policy1 = '"p_code":"'+ p_code + '", "title" : "' + title + '"' + ', "uri" : "' + uri +'",'+	
	'"apply_start":"'+ apply_start + '", "apply_end" : "' + apply_end + '"' + ', "start_age" : "' + start_age +'",'+
	'"end_age":"'+ end_age + '", "contents" : "' + contents + '"' + ', "application_target" : "' + application_target +'",'+
	'"dor":"'+ dor + '", "si":"'+ si /* + '", "crawling_date" : "' + crawling_date + '"' */ + ', "expiration_flag" : "' + expiration_flag +'"';
			
	console.log( policy);
	//console.log(policy.title);
 	$.ajax({
		url : "http://49.236.136.213:3000/policy/modify_policy",
		type : "post",
		data : policy,
		success : function(data) {
			alert("정책을 수정하였습니다.");
			
		},
		error: function(request,status,error){
			alert("수정 에러");
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}
	}); 	 



	//정책 interest 수정
	var Employment_Sup = $(".interest_flag1").val();
	var Startup_sup = $(".interest_flag2").val();
	var Life_welfare = $(".interest_flag3").val();
	var Residential_financial = $(".interest_flag4").val();

	if(Employment_Sup == "null" || Employment_Sup == "undefined") Employment_Sup=null;
	if(Startup_sup == "null" || Startup_sup == "undefined") Startup_sup=null;
	if(Life_welfare == "null" || Life_welfare == "undefined") Life_welfare=null;
	if(Residential_financial == "null" || Residential_financial == "undefined") Residential_financial=null;

	var policy_interest = 
	{
		"p_code": p_code,
		"Employment_sup": Employment_Sup,
		"Startup_sup": Startup_sup,
		"Life_welfare": Life_welfare,
		"Residential_finance": Residential_financial
	};	

	$.ajax({
		url : "http://49.236.136.213:3000/interest/modify_interest",
		type : "post",
		data : policy_interest,
		success : function(data) {
			alert("정책 카테고리를 수정하였습니다.");
			
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}
	}); 



	setTimeout('location.reload()',1000); 
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

