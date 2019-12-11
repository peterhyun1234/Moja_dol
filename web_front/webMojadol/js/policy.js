$(document).ready(function(){
	IPcheck();
	showallpolicy();
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

//전체 정책 받아오기
function showallpolicy(){
	$.ajax({
		url: "http://49.236.136.213:3000/policy/select_all_policies",
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

				var element = '<tr onclick="click_detail_policy(this)" class="policylist">'+
							  '<td class="p_code">' + content.p_code + '</td>'+
							  '<td>' + content.title + '</td>'+
							  '<td>' + retime + '</td>'+
							  '<td>' + expiration + '</td>'+
							  '</tr>';

				  $("tbody").append(element);
				  
			});
			makedatable(); //global.js에 있음

		},
		error: function(){
			alert("데이터베이스 에러");
		}
	});
}

var check = 0;
//정책 클릭시 (1)상세정보 받아오기 (2)오리지널 테이블 내용 받아오기 (3)정책별 카테고리 받아오기  (4)정책의 댓글 받아오기
function click_detail_policy(me){

	var p_code = $(me).children(".p_code").text();
	var code = {"p_code" : p_code};
	//alert("누름 " + p_code);
		
	$(".detail_p_code").text(p_code);
	console.log(p_code);
	$(".detail_p_code").text();
	
	getPolicyData(p_code);

}

//(1)정책 상세정보 받아오기
function getPolicyData(p_code){
	var apiurl = "http://49.236.136.213:3000/policy/" + p_code;

	
	//특정 정책 코드에 대한 내용들 출력하기 
	$.ajax({
		url: apiurl,
		type: "GET",
		success: function(data){

			$(".detail_title").text("");
			$(".crawling_date").text(""); // 크롤링 날짜
			$(".policy_contents").text(""); // 내용
			$(".application_target").text(""); // 대상
			$(".dor").text(""); // 지역 도
			$(".si").text(""); // 지역 시
			$(".uri").text(""); // 링크
			$(".third_line").text(""); 
			$(".expiration_flag2").text("");
		
			$(".expiration").text("");

			$.each(data, function(idx, content){
				if(content.p_code == p_code){ 

					var beforedate = content.crawling_date;
					
					var cut = beforedate.split("T");
					var date = cut[0];
					var cut2 = cut[1].split(".000Z");
					var time = cut2[0];
					var retime = date + " " + time;

					if(content.apply_start != null && content.apply_start != undefined && content.apply_start != ""){
						var apply_start = content.apply_start;
						var cut1 = apply_start.split("T");
						var startdate = cut1[0];
						var starttime2 = cut1[1].split(".000Z");
						var starttime = starttime2[0];
						var start = startdate + " " + starttime;
					}else {
						date1 = "";
						start = "-";
					}

					if(content.apply_end != null && content.apply_end != undefined && content.apply_end != ""){
						var apply_end = content.apply_end;
						var cut2 = apply_end.split("T");
						var enddate = cut2[0];
						var endtime2 = cut2[1].split(".000Z");
						var endtime = endtime2[0];
						var end = enddate + " " + endtime;
					}else {
						date2 = "";
						end = "-";
					}

					if(start == "null" || start == "undefined" || start=="") start="-";
					if(end == "null" || end == "undefined" || end =="") end="-";
					if(content.start_age == null || content.start_age == undefined || content.start_age =="" ) content.start_age ="-";
					if(content.end_age == null || content.end_age == undefined || content.end_age=="") content.end_age="-";

					//alert(start + "+" + end + "+" + content.start_age + "+" + content.end_age );

					var string = '<p class="third title">신청기간</p> '+
								 '<div class="apply clearfix">'+
								 '<input type="text" class="apply_start" value="'+ start +'">'+
								 '<p style="margin:0;">~</p><input type="text" class="apply_end" value="'+  end +'"></div>'+
								 '<p class="third title">대상 연령</p><div class="age clearfix">'+
								 '<input type="text" class="start_age" value="'+ content.start_age +'">'+
								 '<p style="margin:0;">~</p><input type="text" class="end_age" value="'+ content.end_age +'"></div>';
						
					$(".third_line").append(string); 
					
					if(content.dor == null || content.dor == undefined || content.dor=="") content.dor="-";
					if(content.si == null || content.si == undefined || content.si=="") content.si="-";
					if(content.application_target == null || content.application_target == undefined || content.application_target=="") content.application_target="-";

					//alert(retime);
					$(".crawling_date").append(retime); // 크롤링 날짜
					$(".detail_title").append(content.title); // 제목
					$(".policy_contents").append(content.contents); // 내용
					
					$(".application_target").append(content.application_target); // 대상
					$(".dor").append(content.dor); // 지역 도
					$(".si").append(content.si); // 지역 시
					$(".uri").append(content.uri); // 링크
					$(".expiration_flag2").append(content.expiration_flag);

					console.log("data" + content);

					if(content.expiration_flag == null || content.expiration_flag == 0){
						var flag1 = '<input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+content.expiration_flag+'">';
					}
					else {
						var flag1 = '<input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+content.expiration_flag+'">';
					}  
					$(".expiration").append(flag1);
					
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


}

// 오리진 테이블 정책 받아오기
function getOriginPolicy(p_code){
		//alert("오리진");

		var code = {"p_code" : p_code};

		//특정 정책 코드 오리지널 테이블 가져오기


		$.ajax({
			url: "http://49.236.136.213:3000/policy/origin_table",
			type: "POST",
			data: code,
			success: function(data){
				$(".origin_policy").text("");
				$.each(data, function(idx, content){
					if(idx == 0){
						console.log(content);
						$(".origin_policy").append(content.Ucontents);	
					}
	
				});		
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
 
	var number = 1;
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
							'<p class="review_code">' + number + '</p>'+
							'<p class="review_uID">' + content.review_uID + '</p>'+
							'<p class="contents">' + content.contents + '</p>'+
							'<p class="req_time">' + retime + '</p>'+
							'<p class="deletebtn"><input type="button" id="'+ content.p_code+'" class="delete_btn" value="삭제" onclick="delete_review(this)"/></p>'+
							'</li>';
				$(".review_listBox.bottom").append(string); 
				number++;
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
			$(".interest1").text("");
			$(".interest2").text("");
			$(".interest3").text("");
			$(".interest4").text("");
			
			$.each(data, function(idx, data){
				console.log("데이터 interest" + idx);
				//console.log("datadata" + data.Startup_sup);
				$(".interest_flag1").text(data.Employment_sup);
				$(".interest_flag2").text(data.Startup_sup);
				$(".interest_flag3").text(data.Life_welfare);
				$(".interest_flag4").text(data.Residential_finance);	
								
				if(data.Employment_sup == null || data.Employment_sup == 0){
					var flag1 = '<input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+data.Employment_sup+'">';
				}
				else {
					var flag1 = '<input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+data.Employment_sup+'">';
				}  
				$(".interest1").append(flag1);


				if(data.Startup_sup == null || data.Startup_sup == 0){
					var flag2 = '<input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+data.Startup_sup+'">';
				}
				else {
					var flag2 = '<input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+data.Startup_sup+'">';
				}  
				$(".interest2").append(flag2);

				if(data.Life_welfare == null || data.Life_welfare == 0){
					var flag3 = '<input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+data.Life_welfare+'">';
				}
				else {
					var flag3 = '<input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+data.Life_welfare+'">';
				}  
				$(".interest3").append(flag3);

				if(data.Residential_finance == null || data.Residential_finance == 0){
					var flag4 = '<input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+data.Residential_finance+'">';
				}
				else {
					var flag4 = '<input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+data.Residential_finance+'">';
				}  
				$(".interest4").append(flag4);
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
	if(application_target == "null" || application_target == "undefined" || application_target == " " || application_target == "" || application_target=="-") application_target=null;
	if(title == "null" || title == "undefined") title=null;
	if(contents == "null" || contents == "undefined") contents=null;
	
	if(uri == "null" || uri == "undefined") uri=null;
	if(dor == "null" || dor == "undefined" || dor==" " || dor=="" || dor=="-") dor=null;
	if(si == "null" || si == "undefined" || si==" " || si=="" || si=="-") si=null;
	if(apply_start == "null" || apply_start == "undefined" || apply_start == "-") apply_start=null;
	if(apply_end == "null" || apply_end == "undefined" || apply_end == "-") apply_end=null;
	if(start_age == "null" || start_age == "undefined" || start_age == "-") start_age=null;
	if(end_age == "null" || end_age == "undefined" || end_age =="-") end_age=null;
	
	if($(".expiration input").is(":checked")) expiration_flag = 1;
	else expiration_flag = 0;	

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
	var Employment_Sup;
	var Startup_sup;
	var Life_welfare;
	var Residential_financial;

	if($(".interest1 input").is(":checked")) Employment_Sup = 1;
	else Employment_Sup = 0;

	if($(".interest2 input").is(":checked")) Startup_sup = 1;
	else Startup_sup = 0;

	if($(".interest3 input").is(":checked")) Life_welfare = 1;
	else Life_welfare = 0;

	if($(".interest4 input").is(":checked")) Residential_financial = 1;
	else Residential_financial = 0;

	var policy_interest = 
	{
		"p_code": p_code,
		"Employment_sup": Employment_Sup,
		"Startup_sup": Startup_sup,
		"Life_welfare": Life_welfare,
		"Residential_finance": Residential_financial
	};	
	
	//console.log(policy_interest);

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

