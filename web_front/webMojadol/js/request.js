$(document).ready(function(){
	$.ajax({
		url: "http://49.236.136.213:3000/request/show_all_reqs",
		type: "POST",
		success: function(data){
		   //alert('성공');
			$.each(data, function(idx, content){
				//alert(idx + ":"+content.name);
				//timestamp 전처리
				var beforedate = content.req_time;
				var cut = beforedate.split("T");
				var date = cut[0];
				var cut2 = cut[1].split(".000Z");
				var time = cut2[0];
				var retime = date + " " + time;
				//alert(retime);

				var string = '<li class="requestlist tt">'+
							 '<span class="req_code" data-sort="req_code">'+ content.req_code +'</span>'+
							 '<span class="userID" data-sort="userID">'+ content.req_uID +'</span>'+
							 '<span class="req_category" data-sort="req_category">'+ content.req_category +'</span>'+    
							 '<span class="request_time" data-sort="request_time">'+ retime +'</span>'+   
							 '<span class="request_comment content" data-sort="request_comment"><input type="text" value="' +content.req_contents +  '" readonly/></span>'+   
							 '<div class="hover_commentBox"><div class="hover_comment">' +content.req_contents +  '</div></div>';

				if(content.req_flag == null || content.req_flag == 0){
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+content.req_code+'"></span></li>';
				}
				else {
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+content.req_code+'"></span></li>';
				}             
				
				string = string + flag;
				$(".list").append(string); 

				if(content.req_flag == null || content.req_flag == 0){
					var flag2 = '<span class="request_flag" data-sort="request_flag"><input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+content.req_code+'"></span>';
				}
				else {
					var flag2 = '<span class="request_flag" data-sort="request_flag"><input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+content.req_code+'"></span>';
				}  
				 var string2 = "<tr><td>" + content.req_code + "</td><td>"+content.req_uID + "</td><td>"
								 + content.req_category + "</td><td>"+ retime + "</td><td>"
								 + content.req_contents + "</td><td>"+ flag2 + "</td>"	
				 				+ "</tr>";
				$("tbody").append(string2); 

			});

			portfolioPageSetting();
			$("#foo-table").DataTable();
		},
		error: function(){
			alert("데이터베이스 에러");
		}
	});


	
				
/* 	$("#foo-table").DataTable({
		// 표시 건수기능 숨기기
		lengthChange: true,
		// 검색 기능 숨기기
		searching: true,
		// 정렬 기능 숨기기
		ordering: true,
		// 정보 표시 숨기기
		info: true,
		// 페이징 기능 숨기기
		paging: true
	}); */
			


	//$(document).on('click', '.tt', function(){alert("눌림");}); - ajax받아오고 안먹힐때 

	

});
//req_code userID req_category request_time request_comment request_flag
function portfolioPageSetting(){
	// 사용되는 리스트는 무조건 ID 로 선언 
	var options = {
			// 구분조건나열
			valueNames: [
				'req_code','userID','req_category', 'request_time', 'request_comment', 'request_flag'    // 1.검색을 위한 영상의 제목
			],
			page: 4,			 // 한 페이지 출력 개수 
			pagination: true	 // 자동 페이징 여부 
		};
	
		var userList = new List('test-list', options); // 위 옵션에 따라 만들어진 리스트
	
		//list 받아오는 ajax 적기 
}


function modifyflag(me){
	var cut = me.split("request");
	var req_code = cut[1];
	var req_flag;
	var string = "input:checkbox[id='"+me+"']";
	

	if($(string).is(":checked") == true) req_flag = 1; //원래 노체크였으면 1로해서 보냄(누르는 순간 checked로 되어 true로 출력되는 것임)
	else req_flag=0; // 원래 체크였으면 0으로 해서 보냄
	
	var request = {"req_code" : req_code, "req_flag" : req_flag};

	//alert(me + "여부" + string + "flag : " + $(string).is(":checked"));

	 $.ajax({
		url : "http://49.236.136.213:3000/request/change_flag",
		type : "post",
		data : request,
		success : function(data) {
			alert("수정 성공");
			location.reload();
		},
		error: function(request,status,error){
			alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
		}

	});  

}