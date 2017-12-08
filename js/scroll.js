$(document).ready(function(){
	$(window).scroll(function() { 
        var scrollTop = $(this).scrollTop(),
        	scrollHeight = $(document).height(),
        	windowHeight = $(this).height();  
            var positionValue = (scrollTop + windowHeight) - scrollHeight;  
         if (positionValue >= 0) {  
                 //do something 
                 $('.back').css('display','block'); 

          }else{
          	// alert("下拉刷新");
          	$('.back').css('display','none'); 
          }
    });  
})