$(document).ready(function(){
    var val = 0
    $("#add_image").click(function(){
        var name = 'image-'+val+'-image';
        var id = "id_"+name;
        var image_input = `
        <div class="uploader">
            <label class="fileContainer pd-1 btn btn-default btn-sm waves-effect waves-light active">
                Choose files
                <input type="file" id="`+id+`" name=`+name+` onchange="loadImageFile('`+id+`')" class="display-none">
            </label>
            <input type="text" id=text_`+id+` class="form-control" padding-0 placeholder="upload your image">
        </div>`
        $("#images_container").append(image_input);
        $("input[id="+id+"]").on('change',function(e){
            $("input[id=text_"+id+"]").attr('placeholder',e.target.files[0].name);
        });
        val++;
    });
})
