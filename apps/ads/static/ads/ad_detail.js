function calcRoute() {
  if(navigator.geolocation && window.latlng){
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var latlng = window.latlng.split(',');
    var destination = new google.maps.LatLng(latlng[0],latlng[1]);
    var map = new google.maps.Map(document.getElementById('map'),{zoom: 7, center: destination});
    directionsDisplay.setMap(map);
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var origin = new google.maps.LatLng(lat,lng);
      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
      }, function (result, status) {
        if (status=='OK'){
          directionsDisplay.setDirections(result);
        } else {
          console.log("Directions cannot be rendered")
          console.log(result);
          alert("Cannot open map")
        }
      });
    }, function () {
      console.log("Failed to get current location")
      alert("Cannot open map")
    });
  } else {
    console.log("do not have lat long values or geolocation is not available.")
    alert('Cannot open map')
  }
}

class BookNow{
  constructor($el){
    this.$inner = $el.html();
    $el.on('click',()=>{
      var $agree = $('#agree_to_terms_and_conditions');
      if($agree[0] && !$agree[0].checked){
        alert('Agree to terms and conditions');
        return;
      }
      var loading_icon;
      if(window.booking_in_process) return;
      window.booking_in_process = true;
      $.ajax({
        type: 'POST',
        url: window.book_now_url,
        data: {
          termsandconditions: $agree[0]?$agree[0].checked:true,
        },
        dataType: 'json',
        beforeSend: function(){
          $el.html('Please wait...');
          loading_icon = window.create_inline_loading_element();
          $el.append(loading_icon);
          $el.attr('disabled','disabled');
        }
      }).done(function(res){
        toastr.info('Redirecting to secure payment gateway');
        window.location.href = res.url;
      }).fail(function(res){
        if(res.responseJSON.profile_complete===false || res.responseJSON.profile_complete==='False'){
          $('#modalUserProfileForm').modal('show');
          toastr.error('Please fill your name and email id.','Profile not complete');
        }
        display_global_errors(res);
      }).always(()=>{
        $el.removeAttr('disabled');
        $el.html(this.$inner);
        $(loading_icon).remove();
        window.booking_in_process=false;
      });
    });
  }
}

new BookNow($('#book_now'));

function openMap() {
  var modal = `
    <div class="modal fade" data-backdrop="static" id="mapModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close btn btn-danger" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="map" class="h-100"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  $('body').append(modal);
  $('#mapModal').modal('show');
  $('#mapModal').on('hidden.bs.modal',function () {
    $(this).remove();
  });
  calcRoute();
}

function new_button(icon,text){
  return $(`<div class="p-2 color-2 col text-white text-center cursor-pointer"><i class="fa fa-${icon}"></i>&nbsp;${text}</div>`);
}

$('document').ready(function(){
  var data = window.data;
  var image_carousel = new Carousel('image_carousel',data.images,1);
  var $carousel_container = $('#image_carousel_container').append(image_carousel.$carousel);
  var $buttons_container = $('<div class="row m-0 mb-2"></div>').prependTo($carousel_container);
  var $zoom_button = new_button('search-plus','Zoom').appendTo($buttons_container);
  new FullScreenCarousel($zoom_button,data);
  if(data.virtual_tour_link){
    var $tour_button = new_button('video-camera','Tour').appendTo($buttons_container)
    .css({'border-left':'1px solid white'});
    new VirtualTour($tour_button,data.virtual_tour_link);
  }
  var area_unit = new Select(null,'area_unit','area_unit','Choose unit',null,'fs-1 area_unit',
    false,Area.get_options(),data.unit,false,false,false,data);
  area_unit.$select.next().css({'width':'110px','display':'flex'});
  $('#area_group').append(area_unit.$select.next());
  $(document).trigger('initialize_form_selectize');
  var area = $('#area').text();
  area_unit.$select.on('change',function (event) {
    $('#area').text(Area.convert_unit(data.unit,$(event.target).val(),parseInt(data.area)));
  });
});
