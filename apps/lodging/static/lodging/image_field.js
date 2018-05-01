$(document).ready(function(){
    var val = parseInt($("#id_image-TOTAL_FORMS").val());
    for(var i=0;i<val;i++){
        var image_field_id='id_image-'+i+'-image';
        $("input[id="+image_field_id+"]").on("change",function(e){
            $("input[id=text_"+this.id+"]").attr('placeholder',e.target.files[0].name);
        });
    }
    $("#add_image").click(function(){
        var val = parseInt($("#id_image-TOTAL_FORMS").val());
        var name = 'image-'+val+'-image';
        var id = "id_"+name;
        $("#id_image-TOTAL_FORMS").val(val+1);
        var image_input = `
        <div class="uploader">
            <label class="fileContainer pd-1 btn btn-default btn-sm waves-effect waves-light active">
                Choose files
                <input type="file" id="`+id+`" name=`+name+`>
            </label>
            <input type="text" id=text_`+id+` class="form-control" padding-0 placeholder="upload your image">
        </div>`
        $("#images_container").append(image_input);
        $("input[id="+id+"]").on('change',function(e){
            $("input[id=text_"+id+"]").attr('placeholder',e.target.files[0].name);
        });
    });
})