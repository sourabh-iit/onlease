$(document).ready(function(){
    $('#upload-image').click(function(e){
        e.preventDefault();
        $('#profile').click();
    });
    $('#upload-image').css({'visibility':'visible'});
    $('#profile').on('profile-updated',function(e,id,url){
        $('#profile-photo').attr('src',url);
        $('#profile-icon').css({'display':'none'});
        $('#profile-photo').css({'display':'block'});
    });
    $('#id_state').change(function(){
        var state_id = $('#id_state').val();
        $.getJSON('/api/locations',{'state':state_id})
        .done(function(data){
            $.each(data.values,function(id,value){
                var option = document.createElement('option');
                option.innerHTML=value.name;
                option.value=value.id;
                $('#id_district').append(option);
            });
        });
    });
});