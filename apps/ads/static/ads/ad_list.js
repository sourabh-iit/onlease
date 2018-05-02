var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();
$(document).ready(function () {
    var width = $("body").innerWidth();
    if (width>768){
        $("#sidebarCollapse").css("display","none");
        $("#sidebarCollapse span").text("close filters");
        $("#sidebarCollapse").children().eq(0).remove();
        $("#sidebarCollapse").prepend('<i class="fa fa-angle-double-left" id="navbar-header"></i>');
        $("#sidebarCollapse").click(function(){
            $("#sidebar").toggleClass("active");
            $("#sidebarCollapse").toggleClass("active");
            if($("#sidebarCollapse").children().eq(0).hasClass('fa-angle-double-left')){
                $("#sidebarCollapse span").text("open filters");
                $("#sidebarCollapse").children().eq(0).delay(4000).remove();
                $("#sidebarCollapse").prepend('<i class="fa fa-angle-double-right" id="navbar-header"></i>');
            } else{
                $("#sidebarCollapse span").text("close filters");
                $("#sidebarCollapse").children().eq(0).delay(4000).remove();
                $("#sidebarCollapse").prepend('<i class="fa fa-angle-double-left" id="navbar-header"></i>');
            }
        });
    } else{
        $("#sidebarCollapse").click(function(){
            $("#sidebar").toggleClass("active");
            $("#sidebarCollapse").toggleClass("active");
        });
    }
    $('#id_lower_availability').Zebra_DatePicker({
        default_position: 'below',
        show_icon: false,
        pair: $('#id_upper_availability')
    });
    $('#id_upper_availability').Zebra_DatePicker({
        default_position: 'below',
        show_icon: false,
        direction: [1,15],
    });
 });