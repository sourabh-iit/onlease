var fileReader = new FileReader();
var filterType = /^(?:image\/gif|image\/jpeg|image\/jpeg|image\/jpeg|image\/png|image\/svg\+xml|image\/x\-icon|image\/x\-rgb)$/i;
var max_width = window.width;
var max_height = window.height;
var file = [];

fileReader.onload = function (event) {
    var image = new Image();
    image.onload=function(){
        var canvas=document.createElement("canvas");
        var context=canvas.getContext("2d");
        if(max_width/max_height>image.width/image.height){
            canvas.height = max_height;
            canvas.width = (image.width/image.height)*max_height;
        } else {
            canvas.width = max_width;
            canvas.height = (image.height/image.width)*max_width;
        }
        context.drawImage(image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
        var dataURL = canvas.toDataURL('image/jpeg');
        $.ajax({
            type:'POST',
            url: window.url,
            data: {
                'image': dataURL
            },
            headers: {
                'X-CSRFToken': window.csrf_token
            }
        }).done(function(res){
            $('#profile').trigger('profile-updated',[res.id,res.url]);
            $(file).val("");
            var div = document.createElement('div');
            div.className = 'flex';
            var i = document.createElement('i');
            i.className='fa fa-check-circle right';
            div.appendChild(i);
            $('#text_'+$(file).attr('id')).after(div);
            var option = document.createElement('option');
            $(option).val(res.id);
            $(option).attr('selected',true); 
            $('#id_images').append(option);
        }).error(function(err){
            console.log(err);
        })
    }
    image.src=event.target.result;
};

var loadImageFile = function (id) {
    file=document.getElementById(id);
    
    //check and retuns the length of uploded file.
    if (file.files.length === 0) {
        return; 
    }
    
    //Is Used for validate a valid file.
    var uploadFile = document.getElementById(id).files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image."); 
        return;
    }
    
    fileReader.readAsDataURL(uploadFile);
}
$(document).ready(function(){
    var options = $('#id_images option:selected');
    if(options.length>0){
        $('#uploaded_images_container').css({'display':'block'});
        $.each(options,function(i,option){
            var img = document.createElement('img');
            img.src = $(option).text();
            $('#uploaded_images_container').append(img);
        })
    }
})