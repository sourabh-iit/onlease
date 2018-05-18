$(document).ready(function(){
    $('.navbar').addClass('transparent-background');
    $(window).on("scroll",function(){
        if ($(window).scrollTop()>=50){
            $('.navbar').removeClass('transparent-background');
        } else {
            $('.navbar').addClass('transparent-background');
        }
    });
});