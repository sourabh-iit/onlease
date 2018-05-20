var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();
function open_sidebar(sidebarCollapseLeft){
    $('#sidebar').css({'left':'0px'});
    $('#sidebarCollapse').css({'left':sidebarCollapseLeft});
    $('#sidebarCollapse span').css({'display':'none'});
}
function close_sidebar(sidebarLeft){
    $('#sidebar').css({'left':sidebarLeft});
    $('#sidebarCollapse').css({'left':'0px'});
    $('#sidebarCollapse span').css({'display':'inline'});
}
$(document).ready(function () {
    var windowWidth = $(window).width();
    var sidebarWidth = $('#sidebar').width();
    if($(window).width()>768){
        $('#ads-wrapper').css({
            'width': windowWidth-sidebarWidth-25,
            'margin-left': sidebarWidth+15,
            'margin-right': 5,
            'margin-top': '0.5rem'
        });
    } else {
        var sidebarLeft = '-'+sidebarWidth+10+'px';
        var sidebarCollapseLeft = sidebarWidth+10+'px';
        $('#sidebar').css({'display':'block','left':sidebarLeft});
        $("#sidebarCollapse").click(function(){
            if($(this).css('left')=='0px'){
                open_sidebar(sidebarCollapseLeft);
            } else {
                close_sidebar(sidebarLeft);
            }
        });
        $('body:not(#sidebar)').click(function(){
            if($("#sidebarCollapse").css('left')!='0px'){
                close_sidebar(sidebarLeft);            
            }
        });
        $('.card-wrapper').css({'margin-top':'0.5rem'});
    }
    $('#id_lower_availability').Zebra_DatePicker({
        default_position: 'above',
        show_icon: false,
        pair: $('#id_upper_availability'),
        open_on_focus: true,
        format: 'd-m-Y',
        container: $('#datepicker-container')
    });
    $('#id_upper_availability').Zebra_DatePicker({
        default_position: 'above',
        show_icon: false,
        direction: [1,15],
        open_on_focus: true,
        format: 'd-m-Y',
        container: $('#datepicker-container')
    });
 });