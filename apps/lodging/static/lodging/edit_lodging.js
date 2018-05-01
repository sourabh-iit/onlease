$(document).ready(function(){
    $("#delete").click(function(){
        $("form").prepend('<input type="hidden" name="delete">');
        $("form").submit();
    });
});