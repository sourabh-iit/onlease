
function openNav() {
    document.getElementById("mySidenav").style.width = "280px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
function isOpen(){
    if($('#mySidenav').css('width')=='0px'){
        return false;
    }
    return true;
}
$(document).ready(function(){

    $.each($('.sidenav a[data-toggle],.sidenav div[data-toggle]'),function(i,el){
        var i = document.createElement('i');
        i.className = 'fa fa-caret-down float-right';
        $(el).append(i);
        $(el).click(function(){
            $($(this).attr('data-toggle')).toggleClass('toggle');
            var child = $(this).children('.float-right')[0];
            if($(child).hasClass('fa-caret-down')){
                child.className = 'fa fa-caret-up float-right';
            } else {
                child.className = 'fa fa-caret-down float-right';
            }
        });
    });

    $('#mySidenav').click(function(e){
        e.stopPropagation();
    })

    $('body,html').click(function(){
        if(isOpen()){
            closeNav();
        }
    });

});
