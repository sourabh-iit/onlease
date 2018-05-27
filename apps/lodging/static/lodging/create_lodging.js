$(document).ready(function(){
    $('#id_available_from').Zebra_DatePicker({
        default_position: 'below',
        show_icon: false,
        open_on_focus: true,
        format: 'd-m-Y',
        direction: [1,15],
        container: $('#datepicker-container')
    });
})
