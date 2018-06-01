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
    var height = $('#center').height();
    $('#center').css({'margin-top':(windowHeight/2-height/2-$('body').css('padding-top'))+'px'});
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
    })();
    $('input[length],textarea[length]').focusin(function(){
        var length = $(this).attr('length');
        var div = document.createElement('div');
        $(div).addClass('character-counter');
        var span = document.createElement('span');
        span.innerText = '0/'+length;
        $(div).append(span);
        $(this).before(div);
        $(this).keyup(function(){
            var written = $(this).val().length;
            $(this).prev('.character-counter').children()[0].innerText = written+'/'+length;
        });
    });
    $('input[length],textarea[length]').focusout(function(){
        $(this).prev('.character-counter').remove();
    });
    $('input[type=checkbox]').attr('class','option-input form-check-input');
    $('input[type=radio]').attr('class','option-input form-check-input radio');
})