$(document).ready(function(){
	showrequest();
});

function showrequest(){
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

				if(content.req_flag == null || content.req_flag == 0){
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox"  unchecked data-toggle="toggle" onclick="modifyflag(this.id)" id="'+"request"+content.req_code+'"></span></li>';
				}
				else {
					
					var flag = '<span class="request_flag" data-sort="request_flag"><input type="checkbox"  checked data-toggle="toggle"  onclick="modifyflag(this.id)" id="'+"request"+content.req_code+'"></span></li>';
				}             
				  
				var element = '<tr>' +
							  '<td>' + content.req_code + '</td>'+
							  '<td>' + content.req_uID + '</td>'+
							  '<td>' + content.req_category + '</td>'+
							  '<td>' + retime + '</td>'+
							  '<td>' + content.req_contents + '</td>'+
							  '<td>' + flag + '</td>'+
							  '</tr>';
		  
				$("tbody").append(element);
		  

			});
			makedatable();


		},
		error: function(){
			alert("데이터베이스 에러");
		}
	});
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