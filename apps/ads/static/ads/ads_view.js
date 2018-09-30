var $grid;
var desktopElements = [], mobileElements = [];

function display_sender_profile(sender_name="User",profile_image,detail,type_of_roommate){
	var html = `
  <div class="modal fade" 
    id="modalSenderProfile" 
    tabindex="-1" role="dialog" 
    aria-labelledby="myModalLabel" 
    aria-hidden="true"
		novalidate>
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header text-center">
					<h4 class="modal-title w-100 font-weight-bold">`+sender_name+`'s Profile</h4>
          <button type="button" class="close" 
            data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body mx-3">
          <div class="col-12" id="profile-image-container">`;
	if(profile_image){
		html+=`<img alt="`+sender_name+`'s" src="`+profile_image+`" profile photo" id="profile-photo" >`;
	} else {
		html += `<i class="fa fa-user-circle-o" id="profile-icon"></i>`;
	}
	html+=`		</div>
	
          <div class="md-form col-12 col-md-10">
            <i class="fa fa-user prefix grey-text"></i>
            <input type="text" 
              id="sender_name" 
              class="form-control" 
              value="`+sender_name+`" disabled>
          </div>
	
					<div class="md-form mb-4 col-12 col-md-10">
						<i class="fa fa-pencil prefix grey-text"></i>
            <textarea type="text" 
              class="md-textarea form-control" 
              name="sender_detail" 
              id="sender_detail" 
              disabled>`+detail+`</textarea>
					</div>
	
					<div class="md-form col-12 col-md-10">
						<i class="fa fa-pencil prefix grey-text"></i>
						<textarea type="text" class="md-textarea form-control" name="sender_type_of_roommate"
							id="sender_type_of_roommate" disabled>`+type_of_roommate+`</textarea>
					</div>
	
				</div>
			</div>
		</div>
	</form>`;
	$('body').append(html);
}

function add_options_to_region(){
  for(var i in window.regions_selected){
    $('#id_region')[0].selectize.addOption(window.regions_selected[i]);
    $('#id_region')[0].selectize.addItem(window.regions_selected[i].id);
  }
}

function initialize_selectize(){
  $('#id_region').selectize(get_selectize_configurations('search'));
  $(document).trigger('initialize_form_selectize');
  // $('#id_business')[0].selectize.on('change',function(event){
  //   $('#id_region')[0].selectize.clearOptions();
  // });
}

function initialize_masonry(){
  $grid = $('#ads_wrapper').masonry({
    itemSelector: '.card',
    columnWidth: '.card',
    percentPosition: true,
    gutter: 20,
  });
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
    setTimeout(function(){
      $grid.masonry('layout');
    },2000);
  });
  set_carousel();
}

function set_tooltip(){
  $('[data-toggle="tooltip"]').tooltip();
	$('i.fa.fa-info-circle').click(function(){
		$(this).parent().tooltip('toggle');
  });
}

function resize(){
  var width = $(document).width();
  var padding;
  if(width<600){
    padding=(width-270)/2;
  } else {
    padding='20';
  }
  $('#ads_wrapper').css({'padding-left':padding+'px'});
}

function resetSearchBox(){
  var business_mobile = `
  <select name="business" id="id_business" class="col-12 d-none">
    <option value="PROPERTY" {% if business == 'PROPERTY' %}
      selected{% endif %}>Property</option>
    <option value="MATES" {% if business == 'MATES' %}
      selected{% endif %}>Mates</option>
  </select>
  `;
  var business_desktop = `
  <select name="business" id="id_business" class="col-2 p-0 d-none">
    <option value="PROPERTY" {% if business == 'PROPERTY' %}
      selected{% endif %}>Property</option>
    <option value="MATES" {% if business == 'MATES' %}
      selected{% endif %}>Mates</option>
  </select>
  `;
  var region_element = `
  <select name="regions" id="id_region" 
    multiple="multiple" style='width:100%;border-radius:0;' 
    data-placeholder="Search location..."></select>
  `;
  var windowWidth = $(window).width();
  if(windowWidth<768){
    $('#id_region_mobile').prepend(region_element);
    $('#id_business_mobile').prepend(business_mobile);
  } else {
    $('#id_region_desktop').prepend(region_element);
    $('#id_business_desktop').prepend(business_desktop);
  }
}

$(document).ready(function(){
  resetSearchBox();
  initialize_masonry();
  initialize_selectize();
  add_options_to_region();
  set_tooltip();
  resize();
  $(window).resize(()=>{
    resize();
  });
  $('.carousel').on('slid.bs.carousel', function(){
    $grid.masonry('layout');
  })
});