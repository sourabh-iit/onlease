// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function api_call(data){
    $.getJSON('/api/locations',data).done(function(response){
        console.log(response);
        $.each(response.values,function(id,value){
            var li = document.createElement('li');
            li.innerHTML='<a href="#">'+value+'</a>';
            li.style.display='none';
            if(!data.hasOwnProperty('state')){
                li.addEventListener('click',function(){
                    $('#progress-bar').css({'display':'flex'});
                    $('#stateInput').val(this.textContent);
                    $('#stateUl li').css({'display':'none'});
                    disableScroll();
                    api_call({'state':this.textContent});
                });
                $('#stateUl').append(li);
            }
            else if(!data.hasOwnProperty('district')){
                li.addEventListener('click',function(){
                    $('#districtInput').val(this.textContent);
                    $('#districtUl li').css({'display':'none'});
                    $('#progress-bar').css({'display':'flex'});
                    disableScroll();
                    api_call({'state':$('#stateInput').val(),'district':this.textContent})
                });
                $('#districtUl').append(li);
            }
            else{
                var li = document.createElement('li');
                li.innerHTML='<a href="#">'+value[1]+'</a>';
                li.style.display='none';
                li.addEventListener('click',function(){
                    $('#regionInput').val(this.textContent);
                    $('#regionUl li').css({'display':'none'});
                    $('#id').val(value[0]);
                });
                $('#regionUl').append(li);
            }
        });
        if(!data.hasOwnProperty('state')){
            $('#state').css({'visibility':'visible'});
        }
        else if(!data.hasOwnProperty('district')){
            $('#district').css({'visibility':'visible'});
        }
        else{
            $('#region').css({'visibility':'visible'});
        }
        $('#progress-bar').css({'display':'none'});
        enableScroll();
    });
}
function myFunction(id1,id2) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(id1);
    filter = input.value.toUpperCase();
    ul = document.getElementById(id2);
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
    if($('#'+id1).val()==''){
        $('#'+id2+' li').css({'display':'none'});
    }
}
$(document).ready(function(){
    disableScroll();
    api_call({});
})
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();
