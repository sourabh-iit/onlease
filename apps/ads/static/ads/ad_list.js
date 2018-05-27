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