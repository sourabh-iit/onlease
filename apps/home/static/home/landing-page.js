
function AddToggleClassEvent(...args){
    args.forEach(function(v,i){
        $('#'+v).click(function(){
            args.forEach(function(v,i){
                $('#'+v).removeClass('active');
            })
            $(this).toggleClass('active');
            $('#id_business').val($(this).text().toUpperCase());
        })
    })
}
function open_filters(){
    $('.filters').toggleClass('hide');
    $('.filter-arrow-up').toggleClass('hide');
    $('.caret').toggleClass('fa-caret-down fa-caret-up');
}
function close_filters(){
    $('.filters').toggleClass('hide');
    $('.filter-arrow-up').toggleClass('hide');
    $('.caret').toggleClass('fa-caret-up fa-caret-down');
}
var max_rent = 100000;
$(document).ready(function(){
    $('.span2').slider({
        min: 0,
        max: max_rent,
        step: 1000,
        value: [0,max_rent],
    });
    $('.span2').slider('setValue',[$('#id_min_rent').val(),$('#id_max_rent').val()])
    $('.span2').slider().on('slide',function(){
        var val = $('.span2').val().split(',');
        $('#id_min_rent').val(val[0]);
        $('#id_max_rent').val(val[1]);
    })
    $('.slider').css({'width':'95%'});

    $('#id_region').djangoSelect2({
        placeholder:'e.g. mukherjee nagar',
        minimumInputLength: 3,
        minimumResultsForSearch: 10,
        closeOnSelect: false,
        allowClear: true
    });
    $('.select2.select2-container').toggleClass('select-2').addClass('col-7 p-0');
    $('.select2-selection').toggleClass('select-2-search__field');
    $('.select2-selection__rendered').toggleClass('select-2-ul');

    $($('.select-2')[0]).removeClass('col-7').addClass('form-control property-type')
    
    $('.navbar').addClass('transparent-background');
    $(window).on("scroll",function(){
        if ($(window).scrollTop()>=50){
            $('.navbar').removeClass('transparent-background');
        } else {
            $('.navbar').addClass('transparent-background');
        }
    });

    AddToggleClassEvent('mates','dealers','self-deal');
    
    $('form').submit(function(e){
        console.log("SADf",$('#id_region').val());
        e.preventDefault();
        if($('#id_region').val()){
            $('form')[0].submit();
        } else {
            $('.select-2-ul').popover({
                'content': 'Choose location',
                'trigger': 'manual',
                'template': `<div class="popover" role="tooltip">
                    <div class="arrow"></div>
                    <h3 class="popover-header"></h3>
                    <div class="popover-body bg-danger text-white"></div>
                </div>`
            })
            $($('.select-2-ul')[1]).popover({'placement': 'top'});
            $($('.select-2-ul')[1]).popover('show');
        }
    })
    $('#id_region').change(function(){
        $($('.select-2-ul')[1]).popover('hide');
    });

    $('#search-filter').click(function(){
        if($('.filters').hasClass('hide')){
            open_filters();
        }
        else{
            close_filters();
        }
    });
    $('body').click(function(e){
        var filters = $('.filters');
        var filter_button = $('#search-filter');
        if(!filters.is(e.target) && !filter_button.is(e.target) && filters.has(e.target).length==0 && filter_button.has(e.target).length==0 && !$(e.target).hasClass('select2-selection__choice__remove') && !$('.filters').hasClass('hide')){
            close_filters();
        }
    })
});