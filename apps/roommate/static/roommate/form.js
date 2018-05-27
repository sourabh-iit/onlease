$(document).ready(function(){
    $('#id_has_room1').click(function(){
        $('#rent').css({'display':'inline-block'});
        $('#budget').css({'display':'none'});
    });
    $('#id_has_room2').click(function(){
        $('#rent').css({'display':'none'});
        $('#budget').css({'display':'inline-block'});
    });
    // $('form')[0].validate();

})