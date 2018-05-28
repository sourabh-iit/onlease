function api_call(data){
    $('#id_state').change(function(){
        $('#progress-bar').css({'display':'flex'});
        var state=$(this).val();
        $.getJSON('/api/locations',{'state':state}).done(function(response){
            $('#id_district').children('option').remove();
            var option = document.createElement('option');
            option.innerHTML='Choose District';
            option.value='';
            $('#id_district').append(option);
            $.each(response.values,function(id,value){
                $('#id_region').children('option').remove();
                var option = document.createElement('option');
                option.innerHTML=value.name;
                option.value=value.id;
                $('#id_district').append(option);
            });
            $('#id_district').change(function(){
                $('#progress-bar').css({'display':'flex'});
                var district = $(this).val();
                $.getJSON('/api/locations',{'state':state,'district':district}).done(function(response){
                    var option = document.createElement('option');
                    option.innerHTML='Choose Region';
                    option.value='';
                    $('#id_region').append(option);
                    $.each(response.values,function(id,value){
                        var option = document.createElement('option');
                        option.innerHTML=value.name;
                        option.value=value.id;
                        $('#id_region').append(option);
                    });
                    $('#progress-bar').css({'display':'none'});
                });
            });
            $('#progress-bar').css({'display':'none'});
        });
    });
}
$(document).ready(function(){
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
    })
    api_call({});
    $('#id_available_from').Zebra_DatePicker({
        default_position: 'below',
        show_icon: false,
        open_on_focus: true,
        format: 'd-m-Y',
        direction: [1,15],
        container: $('#datepicker-container')
    });
});
