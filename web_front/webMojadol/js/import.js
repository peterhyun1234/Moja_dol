$(document).ready(function(){
//헤더 include 용
    $(function () { 
        loadHtml();    
    }); 
    function loadHtml() {
        $("[data-include]").each(function(){
            var url = $(this).attr("data-include");
            $(this).load(url);
        });
    }

});