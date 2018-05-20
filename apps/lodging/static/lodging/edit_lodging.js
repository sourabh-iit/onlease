$(document).ready(function(){
    $("#delete").click(function(){
        var del = confirm("Are you sure?");
        console.log(del);
        if(del==true){
            $("form").prepend('<input type="hidden" name="delete">');
            $("form").submit();
        }
    });
});
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();
