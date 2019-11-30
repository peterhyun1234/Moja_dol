$(document).ready(function () {

  });

  function makedatable(){
      $("#data_table").DataTable({
            // 표시 건수기능 숨기기
            lengthChange: false,
            // 검색 기능 숨기기
            searching: true,
            // 정렬 기능 숨기기
            ordering: true,
            // 정보 표시 숨기기
            info: true,
            // 페이징 기능 숨기기
            paging: true,
    
            lengthMenu: [ 5, 10, 15, 20, 30 ]
      });
    
  };