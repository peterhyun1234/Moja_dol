$(document).ready(function(){
	$.ajax({
		url: "http://49.236.136.213:3000/request/show_all_reqs",
		type: "POST",
		success: function(data){
		   //alert('성공');
			$.each(data, function(idx, content){
				//alert(idx + ":"+content.name);
				var string = '<li class="requestlist tt">'+
							 '<span class="req_code" data-sort="req_code">'+ content.req_code +'</span>'+
							 '<span class="userID" data-sort="userID">'+ content.req_uID +'</span>'+
							 '<span class="req_category" data-sort="req_category">'+ content.req_category +'</span>'+    
							 '<span class="request_time" data-sort="request_time">'+ content.req_time +'</span>'+   
							 '<span class="request_comment content" data-sort="request_comment"><input type="text" value="' +content.req_contents +  '" readonly/></span>'+   
							 '<div class="hover_commentBox"><div class="hover_comment">' +content.req_contents +  '</div></div>';

				if(content.req_flag == null || content.req_flag == 0){
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox" id="test" unchecked data-toggle="toggle" onclick="modifyflag(this.id)"></span></li>';
				}
				else {
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox" id="test" checked data-toggle="toggle"  onclick="modifyflag(this.id)"></span></li>';
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

}

function modifyflag(me){
	//alert("체크 누름" + me + "여부"+ $(me).is(":checked"));


	var string = "input:checkbox[id='"+me+"']";
	var recode = $(me).parent().html();
	alert(recode + "코드");

	if($(string).is(":checked") == ture){
		// 원래는 false 였음
		/* $.ajax({
			url : "http://49.236.136.213:3000/request/change_flag",
			type : "post",
			data : admin,
			success : function(data) {
				
				if(data == 1){
					alert("관리자 로그인에 성공하였습니다.");
					$(location).attr("href", "member.html");
				}
				else {
					alert("로그인 정보를 확인해주십시오." + data)
				}
				
			},
			error: function(request,status,error){
				alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
			}
	
		});  */
	}
	else {
		//원래는 true 였음
	}

	/*$("input:checkbox[id='ID']").is(":checked") == true : false */
/* 	$.ajax({
		url : "http://49.236.136.213:3000/web_admin/certificate",
		type : "post",
		data : admin,
		success : function(data) {
			
			if(data == 1){
				alert("관리자 로그인에 성공하였습니다.");
				$(location).attr("href", "member.html");
			}
			else {
				alert("로그인 정보를 확인해주십시오." + data)
			}
			
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}

	}); */
}