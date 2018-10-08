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

function book_now(event){
  if(!$('#agree_to_terms_and_conditions:checked').checked){
    alert('Agree to terms and conditions');
    return;
  }
  var loading_icon;
  $el = $(event.target);
  $.ajax({
    type: 'POST',
    url: window.book_now_url,
    data: {
      termsandconditions: $('#agree_to_terms_and_conditions')[0].checked,
    },
    dataType: 'json',
    beforeSend: function(){
      loading_icon = window.create_inline_loading_element();
      $el.append(loading_icon);
    }
  }).done(function(res){
    toastr.info('Redirecting to secure payment gateway');
    window.location.href = res.url;
  }).fail(function(res){
    display_global_errors(res);
  }).always(function(){
    $(loading_icon).remove();
  });
}

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

$('document').ready(function(){
  window.create_options_from_array($('#area_unit'), area_units, conversion_value);
  $(document).trigger('initialize_form_selectize');
  var area = $('#area').text();
  $('#area_unit').on('change',function () {
    $('#area').text(window.convert_to_rqeuested_unit(area,$(this).val()));
  });
});
