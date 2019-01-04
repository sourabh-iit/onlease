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
        if(res.responseJSON && (res.responseJSON.profile_complete===false || res.responseJSON.profile_complete==='False')){
          $(document).trigger('show_profile','modalUserProfileForm')
          toastr.error('Please fill your name and email id.','Profile is not complete');
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

class ConfirmVaccancy{
  constructor($el){
    $el.on('click', ()=>{
      var loading_icon = window.create_inline_loading_element();
      $.ajax({
        type: 'POST',
        url: window.get_confirm_vaccancy_url(window.data),
        beforeSend: function(){
          $el.append(loading_icon);
          $el.attr('disabled','disabled');
        }
      }).done((res)=>{
        window.data=res;
        toastr.success('Please refresh page after 2 minutes', 'Requested for confirmation successfully');
        render_booking_button();
      }).fail((res)=>{
        display_global_errors(res);
        render_booking_button();
      }).always(()=>{
        $el.removeAttr('disabled');
        $(loading_icon).remove();
      });
    });
  }
}

new BookNow($('#book_now'));
new ConfirmVaccancy($('#confirm_vaccancy'));

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

function render_booking_button(){
  window.$booking_button_ref.next().remove();
  var $div = $('<div class="text-center"></div>');
  if(show_contact_details=="True") return;
  if(window.data.is_confirmed && is_confirmed_recently=="True" && !window.data.is_confirmation_processing){
    var $booking_button = $(`
    <button id="book_now" class="btn color-4">
      Book Now in 
      <span class="h5 text-success">
        <i class="fa fa-inr" style="font-size: 1.25rem;"></i>${window.data.rent}
      </span> 
      only
    </button>`).appendTo($div);
    if(window.data.is_booked || window.data.is_booking){
      $div.append(`
      <div>
        <small class="red-text">
          Already booked or under process of booking
        </small>
      </div>`);
      $booking_button.attr('disabled','disabled');
    }
    new BookNow($booking_button);
  } else {
    var $confirm_vaccancy_button = $(`
      <button id="confirm_vaccancy" class="btn color-4">
        Confirm Vaccancy
      </button>
    `).appendTo($div);
    if(window.data.is_confirmation_processing){
      $div.append(`
      <div>
        <small class="red-text">
          Confirmation is under processing. Please refresh page after two minutes.
        </small>
      </div>`);
      $confirm_vaccancy_button.attr('disabled','disabled');
    }
    new ConfirmVaccancy($confirm_vaccancy_button);
  }
  window.$booking_button_ref.after($div);
}

(function (){
  var data = window.data;
  new FavoriteToggler($('#favorite'),data);
  
  var $ref = $('#basic-details');
  var contact_details_id = 'contact-details';
  window.$booking_button_ref = $('#booking_button');

  function phone_numbers_string(data){
    var mobile_numbers = [data.mobile_number];
    for(var mobile_number of data.mobile_numbers)
      mobile_numbers.push(mobile_number.value);
    return mobile_numbers.join(', ');
  }

  function display_contact_details(data){
    $ref.after(`
    <div class="mb-3 z-depth-1 p-3 details" id="${contact_details_id}">
      <div class="h4">Contact Details</div>
      <div>
        Phone numbers - ${phone_numbers_string(data.posted_by)}
      </div>
      <div>
        Room number - ${window.data.room_number}
      </div>
      <div>
        Address - ${data.address}
        <div>
          <button class="btn color-4 btn-sm ml-0" id="map-button" type="button">
            View on map
          </button>
        </div>
      </div>
    </div>`); 
  }

  $(document).on('login',()=>{
    $.ajax({
      url : window.get_property_details_url(data.id),
    }).done((res)=>{
      if(res.address){
        display_contact_details(res);
        show_contact_details = "True";
      }
      render_booking_button();
    }).fail(()=>{});
  });

  $(document).on('logout',()=>{
    $('#'+contact_details_id).remove();
    show_contact_details="False";
    render_booking_button();
  });
})();

$('document').ready(function(){
  var data = window.data;
  new Map($('#map-button'),data);
  var image_carousel = new Carousel('image_carousel',data,data.images,1);
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
