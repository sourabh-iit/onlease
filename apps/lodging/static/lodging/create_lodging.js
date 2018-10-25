function formToString(filledForm) {
    formObject = new Object
    filledForm.find("input, select, textarea").each(function() {
        if (this.id) {
            elem = $(this);
            if (elem.attr("type") == 'checkbox' || elem.attr("type") == 'radio') {
                formObject[this.id] = elem.attr("checked");
            } else {
                formObject[this.id] = elem.val();
            }
        }
    });
    formString = JSON.stringify(formObject);
    return formString;
}
function stringToForm(formString, unfilledForm) {
    formObject = JSON.parse(formString);
    unfilledForm.find("input, select, textarea").each(function() {
        if (this.id) {
            id = this.id;
            elem = $(this); 
            if (elem.attr("type") == "checkbox" || elem.attr("type") == "radio" ) {
                elem.attr("checked", formObject[id]);
            } else {
                elem.val(formObject[id]);
            }
        }
    });
}
function create_options(val,j_el){
    for(var i=0;i<=val;i++){
        var option = document.createElement('option');
        $(option).val(i);
        $(option).text(i);
        j_el.append(option);
    }
}
$(document).ready(function(){
    $('#id_region').djangoSelect2({
        placeholder:'e.g. mukherjee nagar',
        minimumInputLength: 3,
        minimumResultsForSearch: 10,
        closeOnSelect: false,
        allowClear: true
    });

    stringToForm(localStorage.getItem('form'),$('form'));
    $('select,input,textarea').focusout(function(){
        console.log("trigger");
        localStorage.setItem('form',formToString($('form')));
    })

    $('#id_available_from').Zebra_DatePicker({
        default_position: 'below',
        show_icon: false,
        open_on_focus: true,
        format: 'd-m-Y',
        direction: [1,15],
        container: $('#datepicker-container')
    });

    create_options(10,$('#id_bathrooms'));
    create_options(10,$('#id_bedrooms'));
    create_options(10,$('#id_balconies'));
    create_options(10,$('#id_halls'));
    create_options(10,$('#id_other_rooms'));
    create_options(40,$('#id_total_floors'));
    create_options(40,$('#id_floor_no'));
});
