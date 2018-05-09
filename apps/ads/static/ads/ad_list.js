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
    $('#id_regions').multiselect({
        enableHTML: false,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 300,
        buttonWidth: '200px',
        includeResetOption: true,
        resetText: "Reset all",
        onInitialized: function(select, container){
            $("button.multiselect").addClass('btn-sm btn-primary');
            $("button.multiselect").removeClass('btn-default');
            $(".multiselect-reset a").removeClass('btn-default').addClass('btn-sm btn-secondary');
            $('.multiselect-search').removeClass('form-control');
            var i=document.createElement('i');
            i.className='fa fa-times-circle multiselect-clear-filter';
            $('.input-group-btn').append(i);
            $('.glyphicon.glyphicon-search').addClass('fa fa-search');
        }
    });
    $('#filterForm').submit(function(event){
        event.preventDefault();
    })
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