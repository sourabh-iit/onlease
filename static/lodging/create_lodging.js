$(document).ready(function(){
    $("#add_image").click(function(){
        var val = parseInt($("#id-image-TOTAL_FORMS").val());
        var name = 'image-'+val+'-image';
        var id = "id_"+name;
        $("#id-image-TOTAL_FORMS").val(val+1);
        var image_input = `
        <div class="uploader">
            <label class="fileContainer btn btn-default pd-1 btn-sm">
                Choose files
                <input type="file" id="`+id+`" name=`+name+`>
            </label>
            <input type="text" id=text_`+id+` class="form-control padding-0" placeholder="upload your image">
        </div>`
        $("#images_container").append(image_input);
        $("input[id="+id+"]").on('change',function(e){
            $("input[id=text_"+id+"]").attr('placeholder',e.target.files[0].name);
        });
    });
    $('#id_available_from').Zebra_DatePicker({
        direction: [1,30],
        default_position: 'below',
        show_icon: false
    });
});