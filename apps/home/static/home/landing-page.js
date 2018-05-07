$(document).ready(function(){
    $('.navbar').addClass('transparent-background');
    $(window).on("scroll",function(){
        console.log($(window).scrollTop())
        if ($(window).scrollTop()>=$('.container').outerHeight()){
            $('.navbar').removeClass('transparent-background');
        } else {
            $('.navbar').addClass('transparent-background');
        }
    });
});