$('document').ready(function(){
    $('.custom-error').delay(10000).fadeOut(1000);
    $('.custom-success').delay(10000).fadeOut(1000);
    $('.custom-warning').delay(10000).fadeOut(1000);
    $('.custom-info').delay(10000).fadeOut(1000);
    var offset = $('footer').offset();
    var windowHeight = $(window).height();
    if(offset.top<windowHeight){
        $('footer').css({'position': 'relative','top':windowHeight-offset.top,'width':'100%'});
    }
})