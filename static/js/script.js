var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/5bfd8cf940105007f379d99f/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();

var set_password = false;
var add_number = false;
var mobile_number = "";
var url="", height=150, width=150;
var ad_mode = false;
var val = 0;
var prefix;
var upload_image_url;
var regions_url = window.API_PREFIX + 'locations/regions2/';
var charge_form_id=1;
var DEBUG = true;

function has_keys(data){
  return Object.keys(data).length>0;
}

function hide_and_delete($modal,$el){
  $modal.modal('hide');
  $modal.on('hidden.bs.modal',()=>{
    $el.remove();
  })
}

class MyProfile{
  constructor($ref,id,user_data,read_only=false){
    this.read_only = read_only;
    this.id=id;
    this.user_data = user_data;
    this.$form = $('<form></form>').appendTo($('body'));
    this.user_changed = true;
    $ref.click(()=>{
      this.render();
    });
    if(!read_only){
      $('document').on('login',()=>{
        this.rerender();
      });
    }
    $(document).on('rerender_myprofile',()=>{
      this.rerender();
    });
    $(document).on('show_profile',(event, _id)=>{
      if(_id==id){
        this.render();
      }
    });
  }

  rerender(){
    this.user_data = window.user_data;
    this.user_changed = true;
    this.render();
  }

  parse_string(value){
    if(typeof value!=='string') return '';
    return value;
  }

  get_name(){
    return $.trim(this.parse_string(this.user_data.first_name)+' '+this.parse_string(this.user_data.last_name));
  }

  render(){
    if(!this.modal){
      var title = "My Profile";
      if(this.read_only) title = "User Profile";
      this.modal = new Modal(this.id,title);
      this.modal.$modal.appendTo(this.$form);
      this.modal.$modal_dialog.addClass('modal-lg');
    }
    if(this.user_changed){
      this.$image_container = $('<div class="col-12 mb-4" id="profile-image-container"></div>')
      .appendTo(this.modal.$modal_body);
      if(this.user_data.profile_image.length>0){
        this.$image = $(`<img src="${this.user_data.profile_image[0].image_mobile}" alt="profile photo" id="profile-photo">`)
        .appendTo(this.$image_container);
      } else {
        this.$image = $(`<img src="" alt="profile photo" id="profile-photo" style="display:none">`)
        .appendTo(this.$image_container);
        this.$icon = $('<i class="fa fa-user-circle-o" id="profile-icon"></i>')
        .appendTo(this.$image_container);
      }
      if(!this.read_only){
        this.$upload_button = $('<a id="upload-image" class="btn bg-one btn-md">Upload photo</a>')
        .appendTo(this.$image_container);
        $('<small>Upload a 270x250 image for best result.</small>').appendTo(this.$image_container);
        $(`<button class="btn bg-one btn-sm" type="button" data-target="#modalChangePasswordForm" 
        data-toggle="modal">Change Password</button>`).appendTo(this.modal.$modal_body);
        new ProfileAddImage(this.$upload_button,window.profile_image_url,1000,1000,this.$image);
      }
      $(`
      <div class="md-form col-12 col-md-10 mb-4">
          <i class="fa fa-user prefix grey-text"></i>
          <input type="text" class="form-control" 
            value="${this.get_name()}"
            ${this.read_only?'disabled="disabled"':''}
            id="profile_name">
          <label for="profile_name" class="${this.get_name()!=""?'active':''}">Full Name</label>
      </div>`).appendTo(this.modal.$modal_body);
      var $mobile_number = $('<div class="row container-fluid"></div>').append(`
        <div class="md-form col-12 col-md-6">
          <i class="fa fa-mobile prefix grey-text active"></i>
          <input type="text" value="${this.user_data.mobile_number}" id="profile_mobile_number" class="form-control" disabled="disabled">
          <label for="profile_mobile_number" class="active">Mobile number</label>
        </div>
      `).appendTo(this.modal.$modal_body);
      var mobile_numbers = this.user_data.mobile_numbers.filter(mobile_number=>mobile_number.is_verified==true);
      if(!this.read_only){
        var $enter_mobile_number = $('#modalEnterNumberForm').find('#enter_mobile_number');
        this.$add_new_number = $(`<button type="button" class="btn bg-one btn-primary btn-sm data-action="add-number" 
          data-target="#modalEnterNumberForm" data-toggle="modal" id="add_new_number">Add new number</button>`);
        $('<div class="col-12 col-md-6 d-flex align-items-center"></div>').append(this.$add_new_number)
        .appendTo($mobile_number).click(function(event){
          event.preventDefault();
          window.add_number = true;
          window.set_password = false;
          mobile_number = $enter_mobile_number.val();
          window.mobile_number=mobile_number;
          $enter_mobile_number.val('');
        });
        if(mobile_numbers.length>=3) this.$add_new_number.attr('disabled','disabled');
      }
      for(var i in mobile_numbers){
        if(mobile_numbers[i].is_verified){
          var $alternate_mobile_number = $(`
          <div class="row container-fluid">
            <div class="md-form col-12 col-md-6">
              <i class="fa fa-mobile prefix grey-text"></i>
              <input type="text" id="profile_alternate_mobile_number_${parseInt(i)+1}"
                ${this.read_only?'disabled="disabled"':''} 
                value="${mobile_numbers[i].value}" class="form-control alternate_mobile_number"
                disabled>
            </div>
          </div>`).appendTo(this.modal.$modal_body);
          if(!this.read_only)
            $(`<div class="col-12 col-md-6 d-flex align-items-center">
              <button class="btn danger-color btn-sm" type="button"
                onclick="delete_number(event,${mobile_numbers[i].value})">Delete</button>
            </div>`).appendTo($alternate_mobile_number);
        }
      }
      $(`
      <div class="md-form mb-4 col-12 col-md-6">
        <i class="fa fa-envelope prefix grey-text"></i>
        <input type="text" id="profile_email"
          ${this.read_only?'disabled="disabled"':''}
          value="${this.user_data.email}" 
          name="email" class="form-control">
        <label for="profile_email" class="${this.user_data.email?'active':''}">Email address</label>
      </div>`).appendTo(this.modal.$modal_body);
      $(`
      <div class="md-form mb-4 col-12 col-md-10">
        <i class="fa fa-pencil prefix grey-text"></i>
        <textarea type="text" class="md-textarea form-control" rows="3"
          ${this.read_only?'disabled="disabled"':''} 
          name="detail" id="profile_detail">${this.user_data.detail?this.user_data.detail:''}</textarea>
        <label for="profile_detail" class="${this.user_data.detail?'active':''}">Your Description</label>
      </div>`).appendTo(this.modal.$modal_body);
      if(!this.read_only)
        $(`
        <div class="modal-footer d-flex justify-content-center">
          <button class="btn color-2" type="submit">Save</button>
        </div>`).appendTo(this.modal.$modal_body);
      this.modal.$modal.on('bs.modal.shown',()=>{
        this.modal.$modal.find('input').trigger('change');
        this.modal.$modal.off('bs.modal.shown');
      });
      this.user_changed = false;
      if(!this.read_only){
        profile_form_validation(this.$form);
      }
    }
    this.modal.$modal.modal('show');
  }
}

class NavItems{
  constructor(){
    this.$navbar = $('#navbar');
    $(document).on('login',()=>{
      this.appendLoggedInItems();
    });
    $(document).on('logout',()=>{
      this.$navbar.empty().append(this.get_logged_out_nav_items());
    });
    $(document).on('rerender_nav_items',()=>{
      this.$navbar.empty();
      this.render_items();
    });
    this.render_items();
  }

  render_items(){
    if(has_keys(window.user_data)){
      this.appendLoggedInItems();
    } else {
      this.$navbar.append(this.get_logged_out_nav_items());
    }
  }

  appendLoggedInItems(){
    this.$navbar.empty().append(this.get_logged_in_nav_items());
    $('#verify-number').click((e)=>{
      e.preventDefault();
      e.stopPropagation();
      window.mobile_number=window.user_data.mobile_number;
      window.add_number=false;
      window.set_password=false;
      show_loading();
      $.ajax({
        url: API_PREFIX+'account/request-otp/',
        data: {
          mobile_number: window.mobile_number
        },
        type: 'POST'
      }).done((data)=>{
        toastr.success('You will receive an OTP shortly')
        $('#modalVerifyNumberForm').modal('show');
        start_timer($('#resend_otp'));
      }).always(()=>{
        remove_loading();
      });
    });
    new MyProfile($("#myProfile"),'modalUserProfileForm',window.user_data);
  }

  get_dropdown(){
    var dropdown = `<li class="nav-item dropdown-md">
      <a class="nav-link dropdown-toggle waves-effect waves-light text-capitalized" 
        id="navbarDropdownMenuLink" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="true">
        <i class="fa fa-user-circle-o fs-4"></i></a>
      <div class="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink">`;
    if (!window.user_data.is_verified){
      dropdown += `<a class="dropdown-item waves-effect waves-light text-capitalized" id="verify-number">Verify your number</a>`;
    }
    dropdown += `<a class="dropdown-item waves-effect waves-light text-capitalized" id="myProfile">
          My Profile</a>
        <a class="dropdown-item waves-effect waves-light text-capitalized"
          onclick="get_my_ads()">
          My Properties</a>
        <a class="dropdown-item waves-effect waves-light text-capitalized"
          onclick="get_my_favorite_properties()">
          My Favorites</a>
        <a class="dropdown-item waves-effect waves-light text-capitalized"
          onclick="get_my_booked_ads()">
          My Bookings</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item text-capitalized waves-effect waves-light" onclick="logout()">
          Log out - ${window.user_data.mobile_number}</a>
      </div>
    </li>`;
    return dropdown;
  }
  
  get_logged_in_nav_items(){
    var logged_in_nav_items = `
    <li class="nav-item dropdown">
      <!-- {% comment %}<a class="nav-link dropdown-toggle waves-effect waves-light btn btn-sm btn-info" id="newAdsLink" data-toggle="dropdown" aria-haspopup="true"
        aria-expanded="true">
        New Ad
      </a>
      <div class="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="newAdsLink">
        {% if user.is_verified %}
        <a class="dropdown-item waves-effect" data-toggle="modal" data-target="#modalPropertyAdForm">
        {% else %}
        <a class="dropdown-item waves-effect" data-toggle="modal" data-target="#modalEnterNumberForm" data-action="verify-number">
        {% endif %} Property
        </a>
        {% if user.is_verified %}
        <a class="dropdown-item waves-effect" data-toggle="modal" data-target="#modalRoomieAdForm">
        {% else %}
        <a class="dropdown-item waves-effect" data-toggle="modal" data-target="#modalEnterNumberForm" data-action="verify-number">
        {% endif %} Mates
        </a>
      </div>{% endcomment %} -->
      <a class="nav-link text-white color-4 waves-effect waves-light btn btn-sm btn-info" 
        onclick="open_property_form('propertyAdform','New Property Form')"
        id="newProperty" 
        aria-haspopup="true"
        aria-expanded="true">
        New Ad
      </a>
    </li>`;
  
    return $(logged_in_nav_items+this.get_dropdown());
  }

  get_logged_out_nav_items(){
    function nav_link(form){
      return $(`<a class="nav-link waves-effect waves-light" data-toggle="modal" data-target="#${form}"></a>`)
    }
    var $nav_item = $(`<li class="nav-item"></li>`);
    if($(window).width()<768){
      $nav_item.append(nav_link('modalLoginForm').append(`<i class="fa fa-sign-in"></i>`).addClass('fs-3-5'))
      .append(nav_link('modalRegisterForm').append(`<i class="fa fa-user-plus"></i>`).addClass('fs-3-5'));
    } else {
      $nav_item.append(nav_link('modalLoginForm').append(`<i class="fa fa-sign-in">&nbsp;Login</i>`))
      .append(nav_link('modalRegisterForm').append(`
        <button class="btn btn-md dark-purple-color">
          <i class="fa fa-user-plus text-white">&nbsp;Register</i>
        </button>`));
    }
    return $nav_item;
  }
}

new NavItems();

function trace(...values){
  if(DEBUG){
    console.log(values);
  }
}

function console_trace(){
  if(DEBUG){
    console.trace();
  }
}

class BaseType{
  constructor(options){
    this.options = options;
  }

  get_options(){
    return this.options;
  }

  get_option(value){
    for(var option of this.options){
      if(option.value==value){
        return option;
      }
    }
    throw('Value not found');
  }
}

class AreaType extends BaseType{
  constructor(){
    super([
      {value: 1, text: 'Sq. Gaj'},
      {value: 2, text: 'Sq. Ft.'},
      {value: 3, text: 'Sq. Yds'},
      {value: 4, text: 'Sq. Meter'},
      {value: 5, text: 'Acre'},
      {value: 6, text: 'Marla'},
      {value: 7, text: 'Kanal'},
      {value: 8, text: 'Ares'},
      {value: 9, text: 'Biswa'},
      {value: 10, text: 'Hectares'},
      // {value:'11',text:'Bigha'},
      // {value:'12',text:'Grounds'},
      // {value:'13',text:'Gunta'},
      // {value:'14',text:''},
    ]);
    this.coversion_dict = {
      '1':1,
      '2':0.112188,
      '3':1.00969,
      '4':1.20758,
      '5':4886.92,
      '6':30.5433,
      '7':610.865,
      '8':120.758,
      '9':150,
      '10':12075.8,
    };
  }

  convert_unit(from_unit,to_unit,value){
    return Math.round((value*this.coversion_dict[from_unit])*100/this.coversion_dict[to_unit])/100;
  }
}

var Area = new AreaType()

var Furnishing = new BaseType([
  {value: 'F', text: 'Fully-Furnished'},
  {value: 'S', text: 'Semi-Furnished'},
  {value: 'U', text: 'Un-Furnished'},
]);

var Type =  new BaseType([
  {value: 'F', text: 'Flat'},
  {value: 'H', text: 'House'},
  {value: 'P', text: 'Paying Guest'},
  {value: 'R', text: 'Room(s)'},
  {value: 'O', text: 'Other'},
]);

var Tag = new BaseType([
  {value: '', text: 'Choose tag'},
  {value:'0',text:'Bedroom'},
  {value:'3',text:'Living Room'},
  {value:'5',text:'Kitchen'},
  {value:'6',text:'Bathroom'},
  {value:'4',text:'Entrance'},
  {value:'1',text:'Hall'},
  {value:'2',text:'Balcony'},
  {value:'7',text:'Building'},
  {value:'8',text:'Floor'},
  {value:'9',text:'Outside View'},
  {value:'11',text:'Dining Room'},
  {value:'10',text:'Other'},
]);

var Facilities = new BaseType([
  {value: 'A', text: 'Air Conditioner'},
  {value: 'P', text: 'Parking'},
  {value: 'K', text: 'Kitchen'},
]);['','','','','',
'','','','','','',''],
['M','VT','V','H','G','B','C','L','LI','T','BR','O']

var Flooring = new BaseType([
  {value:'M',text:'Marble'},
  {value:'VT',text:'Vitrified Tile'},
  {value:'V',text:'Vinyl'},
  {value:'H',text:'Hardwood'},
  {value:'G',text:'Granite'},
  {value:'B',text:'Bamboo'},
  {value:'C',text:'Concrete'},
  {value:'L',text:'Laminate'},
  {value:'LI',text:'Linoleum'},
  {value:'T',text:'Tarrazzo'},
  {value:'BR',text:'Brick'},
  {value:'O',text:'Other'},
])

function type_full_form(value) {
  return 'need to be done';
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function shortForm(str){
  if(str.length<=13){
    return str;
  }
  return str.substr(0,10)+'...';
}

function create_spinner($element){
  $element.append(`
    <div id="spinner-container">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
  `);
}

function remove_spinner($element){
  $element.find('#spinner-container').remove();
}

function remove_loading(form=null){
  if(!form){
    remove_spinner($(document));
  } else{
    remove_spinner($(form));
  }
}

function show_loading(form=null){
  if(!form){
    create_spinner($('body'));
  } else {
    create_spinner($(form).find('.modal-dialog'));
  }
}

class GetCurrentLocation{
  // constructor($el,$location,$latlng){
  constructor($latlng){
    this.loading=false;
    // $el.click((event)=>{
      event.preventDefault();
      if(this.loading) return;
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
          var lat=position.coords.latitude;
          var lng=position.coords.longitude;
          $.ajax({
            url: window.current_location_url,
            method: 'POST',
            data: {
              lat: lat,
              lng: lng,
            },
            beforeSend: ()=>{
              // $el.append("<span id='spinner'>&nbsp;<i class='fa fa-spinner fa-spin'></i></span>");
              this.loading=true;
            }
          }).done((res)=>{
            // $location.val(res.result[0].formatted_address).trigger('change');
            $latlng.val(lat+','+lng);
            $latlng.trigger('change');
          }).fail((res)=>{
            display_form_errors(res,$('#modalPropertyAdForm'));
          }).always((res)=>{
            // $el.children('#spinner').remove();
            this.loading = false;
          });
        });
      } else {
        alert("Cannot access your location");
      }
    // });
  }
}

function remove_parent(event){
  $(event.target).parent().parent().remove();
}

class MdFormInputText{
  constructor(id,label,icon=null,hidden=false){
    if(hidden){
      this.$input = $('<input></input>').addClass('form-control')
      .attr('type','hidden').attr('id',id);
    } else {
      this.$div = $('<div></div>')
      .addClass('md-form');
      this.$input = $('<input></input>').addClass('form-control')
      .attr('type','text').attr('id',id);
      this.$label = $('<label></label>').attr('for',id).text(label);
      this.$div.append(this.$input[0]).append(this.$label[0]);
      if(icon){
        this.$icon = $('<i></i>').addClass('prefix grey-text fa fa-'+icon);
        this.$div.prepend(this.$icon[0]);
      }
    }
  }

  get_element(){
    return this.$div[0];
  }
}

class MdFormCheckbox{
  constructor(id,label){
    this.$div = $('<div></div>')
    .addClass('custom-control custom-checkbox');
    this.$input = $('<input></input>').addClass('custom-control-input')
    .attr('type','checkbox').attr('id',id);
    this.$label = $('<label></label>').attr('for',id).text(label)
    .addClass('custom-control-label');
    this.$div.append(this.$input[0]).append(this.$label[0]);
  }

  get_element(){
    return this.$div[0];
  }
}

class ChargeFormCheckbox extends MdFormCheckbox{
  constructor(id,label,data_name,value){
    super(id,label);
    this.$container = $('<div></div>')
    .addClass('flex-vertical-center d-flex justify-content-center col-10 col-md-3 p-0');
    this.$container.append(this.$div[0]);
    this.$input.attr('data-name',data_name);
    if(value){
      this.$input.prop('checked',true);
    } else {
      this.$input.prop('checked',false);
    }
  }

  get_element(){
    return this.$container[0];
  }
}

class ChargeFormInput extends MdFormInputText{
  constructor(prefix,suffix,form_id,label,icon=null,value){
    super(prefix+suffix+form_id,label,icon);
    this.$div.addClass('col-12 col-md-4 p-1');
    this.$input.attr('name',suffix+form_id)
    .addClass(suffix).attr('data-name',suffix).val(value);
  }
}

class RemoveChargeFormButton{
  constructor(){
    this.$icon = $('<i></i>')
    .addClass('cursor-pointer fa fa-times-circle red-text fa-lg')
    .css({position:"absolute",right:5,top:5})
    .click(function(event){
      $(event.target).trigger('remove');
    });
  }
}

function fill_form($form,data,attr){
  $form.find('input,select,textarea').each(function(){
    var $elem = $(this);
    var key = $(this).attr(attr);
    if ($elem.attr("type") == "checkbox" || $elem.attr("type") == "radio" ) {
      $elem.prop("checked", !!data[key]).trigger('change');
    } else {
      $elem.val(data[key]).trigger('change');
    }
  });
}

class OtherChargeForm{
  constructor($form,prefix,$element,ad){
    this.form_id = 1;
    this.$forms = $([]);
    this.prefix = prefix;
    this.$form = $form;
    this.$ref = $element;
    this.$form.on('reset',()=>{
      this.remove_all();
    });
    this.localStorage_data_key = prefix+'_charges_form_data';
    this.attr = 'data-name';
    if(!ad || (ad && Object.keys(ad).length==0)){
      $(window).on('form_rendered',()=>{
        this.string_to_form();
        $(window).off('form_rendered');
      });
      $form.on('delete_local_storage',()=>{
        localStorage.removeItem(this.localStorage_data_key);
      });
    } else {
      if(ad.charges){
        for(var charge of ad.charges){
          this.add_form
        }
      }
    }
  }

  add_form(data={amount:'',description:'',is_per_month:null}){
    var $new_form = this.create_form(data);
    this.append_form($new_form[0]);
    return $new_form;
  }

  append_form(form){
    this.$ref.parent()
    .before(form);
    this.form_id++;
    this.$forms = this.$forms.add($(form));
    trigger_form_event(this.$forms,'add',this.$form);
    // this.$form.trigger('change');
    this.attach_change_event($(form));
  }

  remove_form($container){
    $container.remove();
    this.$forms = this.$forms.not($container);
    trigger_form_event(this.$forms,'remove',this.$form);
  }

  trigger_form(){
    // this.$form.trigger('change');
  }

  remove_all(){
    var total = this.$forms.length;
    this.$forms.remove();
    this.$forms = $([]);
    localStorage.removeItem(this.localStorage_data_key);
    if(total>0){
      trigger_form_event(this.$forms,'remove',this.$form);
    }
  }

  get_forms_count(){
    return this.$forms.length;
  }

  create_form(data){
    var $container = $('<div></div>')
    .addClass('row col-12 w-100 other_charges_container container-fluid');
    var amount = new ChargeFormInput(this.prefix,'amount',this.form_id,
    'Amount','inr',data.amount);
    var description = new ChargeFormInput(this.prefix,'description',this.form_id,
    'Description','',data.description);
    var is_per_month = new ChargeFormCheckbox(this.prefix+'_charge_is_per_month_'+this.form_id,
    'Is per month?','is_per_month',data.is_per_month);
    var remove_button = new RemoveChargeFormButton();
    remove_button.$icon.on('remove',()=>{
      this.remove_form($container);
      this.form_to_string();
    })
    $container.append(amount.get_element())
    .append(description.get_element())
    .append(is_per_month.get_element())
    .append(remove_button.$icon);
    return $container;
  }

  attach_change_event($form){
    $form.find('input,select,textarea').change(()=>{
      this.form_to_string();
    });
  }

  string_to_form(){
    var data_array = JSON.parse(localStorage.getItem(this.localStorage_data_key));
    if(!Array.isArray(data_array)){
      return
    }
    for(var data of data_array){
      var $new_form = this.add_form();
      fill_form($new_form,data,this.attr);
    }
  }

  get_data(){
    var data_array = [];
    var attr = this.attr;
    this.$forms.each(function(){
      var data = {};
      $(this).find('input,select,textarea').each(function(){
        var $elem = $(this);
        if ($elem.attr("type") == 'checkbox' || $elem.attr("type") == 'radio') {
          data[$(this).attr(attr)] = $elem.is(":checked");
        } else {
          data[$(this).attr(attr)] = $elem.val();
        }
      });
      data_array.push(data);
    });
    return data_array;
  }

  form_to_string(){
    localStorage.setItem(
      this.localStorage_data_key,
      JSON.stringify(this.get_data())
    );
  }
}

function create_charge_form(event,prefix){
  event.preventDefault();
  if(prefix=='property'){
    window.property_charge_form.add_form(event);
  }
}

// return configurations for remote selectize locations
// if remove_button is true then it is multi select
// if value is property then number of properties is shown in results
function get_selectize_configurations(value,remove_button=true){
  var business, items, render={
    option: function (item, escape) {
      var root = `
      <div class="option">
        ${escape(item.region)}, <small class="text-green">${escape(item.state)}</small>`;
      if(item.ads!=undefined && item.ads!=null && item.ads>-1 && value.toLowerCase()=='search'){
        root += `<span class="ads_count badge dark-purple-color">properties: ${escape(item.ads)}</span>`;
      }
      root += '</div>';
      return root;
    }
  };
  var plugins=[];
  if(remove_button){
    plugins=['remove_button'];
    render = Object.assign(render,{
      item: function(item,escape){
        return `
        <div class="item active" data-value="${item.id}" data-state="${item.state}" data-region="${item.region}" data-district="${item.district}">
          ${shortForm(item.region)}
          <a href="javascript:void(0)" class="remove" tabindex="-1" title="Remove">×</a>
        </div>
        `;
      }
    });
  } else {
    render = Object.assign(render,{
      item: function(item,escape){
        return `
        <div class="item active" data-value="${item.id}" data-state="${item.state}" data-region="${item.region}" data-district="${item.district}">
          ${shortForm(item.region)}
        </div>
        `;
      }
    });
  }
  var config = {
    valueField: 'id',
    labelField: 'region',
    searchField: ['region','state','district'],
    create: false,
    copyClassesToDropdown: false,
    render: render,
    load: function(query, callback) {
      if (!query.length) return callback();
      $.ajax({
        url: regions_url,
        type: 'GET',
        dataType: 'json',
        data: {
          q: query,
          business: value.toLowerCase()=='search' ? $('#id_business').val() : 'none',
        },
      }).done((res)=>{
        callback(res.results);
      }).fail(()=>{
        callback();
      });
    },
    onInitialize: function(){
      this.$control.append(`<i class="fa fa-spinner fa-pulse loading-icon"></i>`);
    },
    plugins: plugins,
  }
  if(remove_button){
    return Object.assign(config,{maxItems: 4});
  }
  return config;
}

function remove_all_messages(form){
  if(!form){
    return;
  }
  $(form).find('.modal-body').find('ul').remove();
  $(form).find('.modal-body').find('div.alert').remove();
}

var alert_close_button = `&nbsp; 
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`;

function create_ul(){
  var ul = document.createElement('ul');
  ul.className = "p-0";
  ul.style.listStyle = 'none';
  return ul;
}

function show_form_global_errors(form,globalErrors){
  var ul = create_ul();
  if(globalErrors){
    for(let error of globalErrors){
      var li = document.createElement('li');
      li.className = "alert alert-danger";
      $(li).html(`${error}${alert_close_button}`);
      $(ul).append(li);
    }
  }
  $(form).find('.modal-body').prepend(ul);
}

function redirect_to_ad_detail_view(ad){
  window.location.href = window.get_ad_detail_view_url(ad);
}

function show_form_field_errors(form,errors){
  var validator = $(form).validate();
  validator.showErrors(errors);
}

function isDict(v) {
  return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

function isArray(v){
  return v instanceof Array;
}

function display_global_errors(res){
  if(isDict(res)){
    if(isDict(res.responseJSON) && 'errors' in res.responseJSON){
      var errors = res.responseJSON['errors'];
      var error_string = "";
      for(var key in errors){
        key!='__all__' ? error_string += `${key} - ${errors[key]}<br>`:null;
      }
      error_string!="" ? toastr.error(error_string,'Errors occurred'):null;
    }
  }
}

function display_form_errors(data,form){
  let errors = {};
  if(data.responseJSON){
    errors = data.responseJSON.errors;
    var field_errors = {};
    for(var field in errors){
      if(field!='__all__'){
        field_errors[field] = errors[field];
      }
    }
    if(Object.keys(field_errors).length){
      toastr.error(('Error(s) occurred in form submission.'));
      show_form_field_errors(form,field_errors);
    }
  }
}

function display_message(form,message){
  remove_all_messages(form);
  var div = document.createElement('div');
  div.className = "alert alert-success";
  $(div).html(message+alert_close_button);
  $(form).find('.modal-body').prepend(div);
}

function login_form_validation(){
    var form = $('#modalLoginForm');
    var loginFormValidator = form.validate({
        rules: {
            username: {
                number_or_email: true,
                required: true,
            },
            password: {
                required: true,
                minlength: 8
            }
        },
        messages: {
            username: {
                required: "Please enter your username.",
                number_or_email: 'Enter a valid mobile number or email address.'
            },
            password: {
                required: "Password is required.",
                minlength: "Password should be atleast 8 characters long."
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            loginFormValidator.form();
            if($(form).valid()){
                let data = {
                    username: $('#login_username').val(),
                    password: $('#login_password').val(),
                }
                let url = window['API_PREFIX']+'account/login/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).done((data)=>{
                  window.user_data = data;
                  toastr.success('You are now logged in.');
                  $(document).trigger('rerender_nav_items');
                  $(document).trigger('login');
                  $(form).modal('hide');
                }).fail((data)=>{
                  display_form_errors(data,form);
                }).always((data)=>{
                  remove_loading(form);
                });
            }
        }
    });
    $('#forgot_password_modal').click((e)=>{
        e.preventDefault();
        window.set_password=true;
        window.add_number=false;
    });
    close_and_open_modal('forgot_password_modal','modalLoginForm','modalEnterNumberForm');
    close_and_open_modal('register_modal','modalLoginForm','modalRegisterForm');
}
function close_and_open_modal(button_id,modal_to_hide_id,modal_to_show_id){
    $('#'+button_id).click((e)=>{
        e.preventDefault();
        $('#'+modal_to_hide_id).modal('hide');
        $('#'+modal_to_show_id).modal('show');
    });
}
function add_tawk_to(){
    // var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    // (function(){
    //     var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    //     s1.async=true;
    //     s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
    //     s1.charset='UTF-8';
    //     s1.setAttribute('crossorigin','*');
    //     s0.parentNode.insertBefore(s1,s0);
    // })();
}

function enter_number_form_validation(){
    var form = $('#modalEnterNumberForm');
    var enterNumberFormValidator = form.validate({
        rules: {
            mobile_number: {
                required: true,
                mobile_number: true
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
          e.preventDefault();
          enterNumberFormValidator.form();
          if($(form).valid()){
            var data = {
              mobile_number: $('#enter_mobile_number').val(),
            }
            if(!window.add_number){
              var url = API_PREFIX + 'account/request-otp/';
            } else {
              var url = API_PREFIX + 'account/add-number/add-number';
            }
            show_loading(form);
            $.ajax({
              'type':'POST',
              'dataType':'json',
              'url': url,
              'data': data,
            }).done((data)=>{
              toastr.success('You will get an OTP on your mobile number shortly');
              $(document).trigger('otp_clock_start');
              $('#modalEnterNumberForm').modal('hide');
              var $form = window.set_password?$('#modalSetPasswordForm'):$('#modalVerifyNumberForm');
              $form.modal('show');
              window.mobile_number = data.mobile_number;
            }).fail((data)=>{
              display_form_errors(data,form);
            }).always(()=>{
              remove_loading(form);
            });
          }
        }
    });
}

function create_inline_loading_element(){
  var span = document.createElement('span');
  $(span).append('&nbsp;<i class="fa fa-spinner fa-spin"></i>');
  return span;
}

$.prototype.hasAttr = function(attr){
  var attr = this[0].getAttribute(attr);
  if(typeof attr != undefined && attr != false){
    return true;
  }
  return false;
}

function toggle_add_new_number_button(){
  var num_alternate_numbers = $('.alternate_mobile_number').length;
  var $add_new_number = $('#add_new_number');
  if(num_alternate_numbers<3){
    if(num_alternate_numbers==0){
      $('#alternate_numbers_card').remove();
    }
    $add_new_number.removeAttr('disabled');
    $add_new_number.removeClass('disabled');
  } else {
    $add_new_number.attr('disabled',"");
    $add_new_number.addClass('disabled');
  }
}

function delete_number(event,mobile_number){
  event.preventDefault();
  $.confirm({
    title: 'Delete  '+mobile_number,
    text: 'Are you sure you want to delete this number? <br> This action cannot be undone.',
    confirm: function(){
      var el = event.target;
      var loading_el = create_inline_loading_element();
      $(el).append(loading_el);
      $.ajax({
        url: window.API_PREFIX+'account/add-number/delete-number',
        data: {
          mobile_number: mobile_number
        },
        type: 'POST'
      }).done((data)=>{
        $(el).parent().parent().remove();
        toastr.success('Successfully deleted', 'Delete '+mobile_number);
        window.user_data = data;
        $(document).trigger('rerender_myprofile');
      }).fail((data)=>{
        toastr.error('Cannot delete this number','Delete '+mobile_number);
        display_form_errors(data);
      }).always(()=>{
        $(loading_el).remove();
      });
    }
  });
}

function Input(_id,className,label=null,prefix=null,disabled=false) {
  this.element = document.createElement('input');
  this.$element = $(this.element);
  var updateValue = (value)=>{
    this.$element.val(value);
    this.$element.trigger('change');
  };
  this.element.className = className;
  if(disabled){
    this.$element.attr('disabled','');
  }
  if(label){
    this.label = document.createElement('label');
    $(this.label).attr('for',_id);
    $(this.label).text(label);
  }
  if(prefix){
    this.prefix = document.createElement('i');
    this.prefix.className = 'prefix grey-text fa fa-'+prefix;
  }
}

function verify_number_form_validation(){
    var form = $('#modalVerifyNumberForm');
    var verifyNumberFormValidator = form.validate({
        rules: {
            otp: {
              required: true,
              otp: true
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            verifyNumberFormValidator.form();
            if($(form).valid()){
                var data = {
                    otp: $('#verify_otp').val(),
                    mobile_number: window.mobile_number
                }
                if(!window.add_number){
                    var url = API_PREFIX + 'account/verify-number/';
                } else {
                    var url = API_PREFIX + 'account/add-number/verify-number'
                }
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).done((data)=>{
                  $('#modalVerifyNumberForm').modal('hide');
                  window.user_data.is_verified = true;
                  if (window.add_number) {
                    window.user_data = data;
                    toastr.success('New mobile number added', 'Add '+mobile_number);
                    $(document).trigger('rerender_myprofile');
                  } else {
                    toastr.success('Mobile number verified.');
                    $(document).trigger('rerender_nav_items');
                  }
                }).fail((data)=>{
                  display_form_errors(data,form);
                }).always(()=>{
                  remove_loading(form);
                });
            }
        }
    });
}

function register_form_validation(){
    var form =  $('#modalRegisterForm');
    var registerFormValidator = form.validate({
        rules: {
            mobile_number: {
                required: true,
                mobile_number: true
            },
            email: {
                email: {
                    depends: function(element) {
                        return $(element).val().length>0;
                    }
                }
            },
            password: {
                required: true,
                minlength: 8
            },
            confirm_password: {
                required: {
                    depends: function(element) {
                        return $('#register_password').val().length>0;
                    }
                },
                equalTo: {
                    param: '#register_password',
                    depends: function(element) {
                        return $('#register_password').val().length>0;
                    }
                }
            }
        },
        messages: {
            mobile_number: {
                required: 'Mobile number is required.',
            },
            password: {
                required: "Password is required.",
                minlength: "Password should be atleast 8 characters long."
            },
            confirm_password: {
                required: "Re-enter password",
                equalTo: "Passwords should match."
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            registerFormValidator.form();
            if($(form).valid()){
                var data = {
                    email: $('#register_email').val(),
                    mobile_number: $('#register_mobile_number').val(),
                    password: $('#register_password').val(),
                    confirm_password: $('#register_confirm_password').val(),
                }
                var url = API_PREFIX + 'account/register/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).done((data)=>{
                  window.user_data = data.user;
                  $(document).trigger('rerender_nav_items');
                  set_password=false;
                  toastr.success('Registered successfully')
                  $('#modalRegisterForm').modal('hide');
                  $('#modalVerifyNumberForm').modal('show');
                  window.set_password=false;
                  window.add_number=false;
                }).fail((data)=>{
                  display_form_errors(data,form);
                }).always(()=>{
                  remove_loading(form);
                });
            }
        }
    });

    close_and_open_modal('login_modal','modalRegisterForm','modalLoginForm');
}

function roomie_ad_form_validation(){
    var form =  $('#modalRoomieAdForm');
    form.on('show.bs.modal',function(){
        url = window.roomie_image_url;
        height = 2000;
        width = 2000;
    });
    var roomieAdFormValidator = form.validate({
        rules: {
            'regions': {
                one_value: {
                    depends: function(element){
                        return $('input[name=has_property]:checked').val()=='True';
                    }
                },
                required: true,
            },
            'rent': {
                required: true,
                numbers_only: true
            },
            'types': {
                one_value: {
                    depends: function(element){
                        return $('input[name=has_property]:checked').val()==='True';
                    }
                },
                required: true,
            },
            lodging_description: {
                required: {
                    depends: function(element){
                        return $('input[name=has_property]:checked').val()==='True';
                    }
                }
            },
            share: {
                required: true,
                numbers_only: true
            },
            gender: {
                required: true
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            e.stopPropagation();
            roomieAdFormValidator.form();
            if($(form).valid()){
                var data = {
                    'regions': $('#roomie_regions').val(),
                    'types': $('#roomie_types').val(),
                    'rent': $('#roomie_rent').val(),
                    'lodging_description': $('#roomie_lodging_description').val(),
                    'has_property': $('input[name=has_property]:checked').val(),
                    'share': $('#roomie_share').val(),
                    'gender': $('#roomie_gender').val(),
                    'image_ids': getSelect2Values($('#id_images')),
                }
                var url = API_PREFIX + 'roomie/create/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).always((data)=>{
                    if(data.status=='200'){
                        display_message(form,'Post added.')
                    } else {
                        display_form_errors(data,form);
                    }
                    remove_loading(form);
                });
            }
        }
    });
}

function convert_area_to_gaj(area, no_of_gaj) {
  return parseFloat(area)*parseFloat(no_of_gaj);
}

function convert_to_rqeuested_unit(area, no_in_a_gaj) {
  return +(parseFloat(area)/parseFloat(no_in_a_gaj)).toFixed(3);
}

function get_value_using_selector($form,selector){
  // get value of first element from given form using
  // given seector
  return get_element_using_selector($form,selector).val();
}

function get_value_using_name($form,name){
  return get_value_using_selector($form,'[name='+name+']');
}

function should_validate_other($form,name){
  return $form.find('[name='+name+'] option:selected').first().text().toLowerCase()=='other';
}

class BaseInput{
  constructor($input,id,$form,ad){
    this.id = id;
    this.$input = $input;
    this.current_value = "";
    if(!ad || (ad && Object.keys(ad).length==0)){
      $input.on('change',()=>{
        this.save();
        var prev_value = this.current_value;
        this.current_value = this.$input.val();
        trigger_event(prev_value,this.current_value,$form);
      });
      $(window).on('form_rendered',()=>{
        this.retrieve_from_localStorage();
        $(window).off('form_rendered');
        $input.trigger('change');
      });
      $form.on('reset',()=>{
        this.$input.val('').trigger('change');
      });
      $form.on('delete_local_storage',()=>{
        localStorage.removeItem(id);
      });
    } else {
      $(window).on('form_rendered',()=>{
        $(window).off('form_rendered');
        $input.trigger('change');
      });
    }
  }

  retrieve_from_localStorage(){
    if(localStorage.getItem(this.id)){
      this.$input.val(localStorage.getItem(this.id)).trigger('change');
    }
  }

  save(){
    localStorage.setItem(this.id,this.$input.val());
  }
}

class PropertyInputText extends MdFormInputText{
  // Adds css classes, name, value, length and group heading to base input class
  constructor($form,id,label,icon,classes="",value="",name="",length=null,hidden=false,ad){
    super(id,label,icon,hidden);
    var base_input = new BaseInput(this.$input,id,$form,ad);
    this.retrieve_from_localStorage = base_input.retrieve_from_localStorage;
    this.save = base_input.save;
    this.id = id;
    if(!hidden){
      this.$div.addClass(classes);
      this.$input.attr('name',name).attr('value',value);
      if(length) this.$input.attr('length',length);
    }
  }
}

class Select{
  // Creates a select initialized with selectize with options and selected options
  constructor($form,name,id,placeholder,label,classes,multiple=false,options=[],selected_options=null,region=false, search=false,hidden=false,ad=null){
    this.id = id;
    this.$form = $form;
    this.multiple = multiple;
    this.region = region;
    if(hidden){
      for(var option of selected_options){
        this.add_option(option,true);
        this.$select = $(`<select name="${name}" id="${id}"></select>`);
      }
      this.current_value="";
    } else {
      this.$select = $(`<select name="${name}" id="${id}"></select>`);
      if(placeholder){
        this.add_option({value:'',text:placeholder});
      }
      if(multiple){
        this.$select.attr('multiple','multiple');
      }
      this.$label = $(`<label for="${id}">${label}</label>`);
      this.$div = $('<div></div>').addClass(classes).append(this.$select);
      if(label!=''){
        this.$div.append(this.$label);
      }
      for(var option of options){
        this.add_option(option);
      }
      if(region){
        if(search){
          this.$select.selectize(get_selectize_configurations('search'));
        } else {
          if(multiple){
            this.$select.selectize(get_selectize_configurations('property',true));
          } else {
            this.$select.selectize(get_selectize_configurations('property',false));
          }
        }
      } else {
        if(multiple){
          this.$select.selectize({
            plugins: ['remove_button'],
            copyClassesToDropdown: false,
          });
        } else {
          this.$select.selectize({
            copyClassesToDropdown: false,
          });
        }
      }
    }
    this.selectize = this.$select[0].selectize;
    if(!hidden && selected_options){
      this.add_selected_options(selected_options);
    }
    this.current_value="";
    if(!ad || (ad && Object.keys(ad).length==0)){
      this.selectize.on('change',()=>{
        this.trigger_event();
        $form.trigger('validate',this.$select);
      });
      if(region){
        this.selectize.on('item_add',(value,$item)=>{
          this.save(value,$item,true);
        });
        this.selectize.on('item_remove',(value,$item)=>{
          this.save(value,$item,false);
        })
      } else {
        this.selectize.on('change',(value)=>{
          this.save(value);
        });
      }
      $(window).on('form_rendered',()=>{
        this.retrieve_from_localStorage();
      });
      $form.on('reset',()=>{
        this.selectize.clear();
      });
      $form.on('delete_local_storage',()=>{
        localStorage.removeItem(id);
      });
    }
  }

  trigger_event(){
    var prev_value = this.current_value;
    this.current_value = this.$select.val();
    trigger_event(prev_value,this.current_value,this.$form);
  }

  add_selected_options(items){
    if(this.region){
      for(var item of items){
        item = Object.assign(item,{
          district: item.district.name,
          state: item.state.name,
          region: item.name,
        });
        this.add_item(item);
      }
    } else {
      if(this.multiple){
        this.selectize.setValue(items);
      } else {
        this.selectize.setValue(items);
      }
    }
  }

  add_option(option,selected=false){
    var $option = $(`<option value="${option.value}">${option.text}</option>`);
    if(selected){
      $option.attr('selected','selected');
    }
    this.$select.append($option);
  }

  save(value,$item=null,added=true){
    if(this.region){
      if(added){
        if(!localStorage.getItem(this.id)){
          localStorage.setItem(this.id,JSON.stringify([this.get_data(value,$item)]));
        } else {
          var items = JSON.parse(localStorage.getItem(this.id));
          if(items.filter(obj=>obj.id==value).length>0){
            return
          }
          items.push(this.get_data(value,$item));
          localStorage.setItem(this.id,JSON.stringify(items));
        }
      } else {
        var items = JSON.parse(localStorage.getItem(this.id));
        localStorage.setItem(this.id,JSON.stringify(items.filter(obj=>obj.id!=value)));
      }
    } else {
      if(this.multiple){
        localStorage.setItem(this.id,JSON.stringify(value));
      } else {
        localStorage.setItem(this.id,value);
      }
    }
  }

  get_data(value,$item){
    return {
      id: value,
      region: $item.attr('data-region'),
      state: $item.attr('data-state'),
      district: $item.attr('data-district'),
    };
  }

  add_item(item){
    this.selectize.addOption(item);
    this.selectize.addItem(item.id);
  }

  retrieve_from_localStorage(){
    if(!localStorage.getItem(this.id)){
      return;
    }
    if(this.region){
      var items = JSON.parse(localStorage.getItem(this.id));
      for(var item of items){
        this.add_item(item);
      }
    } else {
      if(this.multiple){
        var items = JSON.parse(localStorage.getItem(this.id));
        this.selectize.setValue(items,true);
      } else {
        this.selectize.setValue(localStorage.getItem(this.id));
      }
    }
  }
}

class PropertyDate extends PropertyInputText{
  // Extends to use datepicker
  constructor($form,id,label,icon,classes,value,name,ad){
    super($form,id,label,icon,classes,value,name,null,false,ad);
    this.$datepicker_container = $('<div></div>')
    .addClass('col-12 col-md-6');
    this.$div.append(this.$datepicker_container);
    this.$input.Zebra_DatePicker({
      default_position: 'below',
      show_icon: false,
      open_on_focus: true,
      format: 'd-m-Y',
      direction: true,
      container: this.$datepicker_container,
      show_clear_date: true,
      show_select_today: 'Today',
      onSelect: ()=>{
        this.$input.trigger('change');
        this.$input.trigger('keyup');
      },
      onClear: ()=>{
        this.$input.trigger('change');
        this.$input.trigger('keyup');
      }
    });
    this.datepicker = this.$input.data('Zebra_DatePicker');
    $form.on('reset',()=>{
      this.datepicker.clear_date();
      setTimeout(this.datepicker.hide,10);
      this.$input.trigger('change');
    });
  }
}

class PropertyRoom extends Select{
  // Common idea for multiple rooms
  constructor($form,name,id,ad){
    super($form,name,id+'_'+name,'Choose total '+name,'Total '+name,'col-12 mb-4 col-md-6 m-5px',
    false,create_options_from_range(0,20),ad.hasOwnProperty(name)?ad[name].toString():null,false,false,false,ad);
  }
}

class PropertyAreaGroup{
  // Area with units to chose from
  constructor($form,name,id,label,id_unit,name_unit,ad){
    this.id=id;
    this.input = new PropertyInputText($form,id,label,'','',
      ad.area,name,null,false,ad);
    this.input.$input.addClass('p-0');
    this.units = new Select($form,name_unit,id_unit,'Choose unit','','w-100',false,
      Area.get_options(),ad.unit,false,false,false,ad);
    this.units.$select.next().css({'width':'100%'});
    this.$input_group_append = $('<span class="input-group-append" style="width:110px"></span>')
    .append(this.units.$div.children());
    this.$div = $(`<div class="input-group md-form mt-0 mb-4 col-12 col-md-6 m-5px"></div>`)
    .append(this.input.$label).append(this.input.$input).append(this.$input_group_append);
  }
}

function empty(value){
  return value=="" || value==[];
}

function not_empty(value){
  return value!="" && value!=[];
}

function trigger_event(prev_value,current_value,$form){
  if(empty(prev_value) && not_empty(current_value)){
    // console.trace();
    $form.trigger('filled');
  } else if(not_empty(prev_value) && empty(current_value)){
    // console.trace();
    $form.trigger('empty');
  }
}

class MdFormTextArea extends BaseInput{
  // Simple text area
  constructor($form,id,name,placeholder,label,classes,length=1000,rows=3,additional_details="",ad={}){
    var $textarea = $(`<textarea rows="${rows}" length="${length}" 
    placeholder="${placeholder}" class="md-textarea form-control" 
    name="${name}" id="${id}">${additional_details}</textarea>`);
    super($textarea,id,$form,ad);
    this.id =id;
    this.$textarea = $textarea;
    this.$label = $(` <label for="${id}">${label}</label>`).addClass('active');
    this.$div = $(`<div class="md-form ${classes}"></div>`)
    .append(this.$label).append(this.$textarea);
  }
}

function create_options_from_range(min,max){
  var options = [];
  for(var i=min;i<=max;i++){
    options.push({
      value: i,
      text: i,
    });
  }
  return options;
}

class MdFormSwitch{
  constructor(left_text,right_text,id,name,value){
    this.$div = $(`
    <div class="mt-3 d-flex align-items-center jusitfy-content-space-between" style="width: 220px;">
      <span class="green-text fw-500">${left_text}</span>
    </div>`);
    this.$label = $(`<label class="bs-switch m-0"></label>`).appendTo(this.$div);
    this.$input = $(`<input type="checkbox" id="${id}" name="${name}">`).appendTo(this.$label);
    if(value) this.$input.prop('checked','true');
    this.$span = $(`<span class="slider round"></span>`).appendTo(this.$label);
    this.$div.append($(`<span class="red-text fw-500">${right_text}</span>`));
  }
}

class PropertyAdForm{
  // Creates a property form to create new property ad. 
  // If ad is given as argument then it will be used to edit already created property ad.
  constructor(id,title,ad={}){
    this.is_new_ad = !ad || (ad && Object.keys(ad).length==0);
    if(this.is_new_ad){
      this.url = window.create_property_url;
      this.method='POST';
    } else {
      this.url = get_property_ad_edit_url(ad);
      this.method='PUT';
    }
    this.id=id;
    this.modal = new Modal(id,title);
    this.modal.$modal_dialog.addClass('modal-lg');
    this.modal.$modal_body.addClass('row')
    .css({'padding':'0', 'padding-left': '2rem','padding-right': '2rem'});
    this.$form = $('<form></form>').attr('novalidate','true').append(this.modal.$modal);
    if(!this.is_new_ad){
      this.is_booked_switch = new MdFormSwitch('Vaccant','Booked',id+'_is_booked','is_booked',ad.is_booked);
      this.is_booked_switch.$div.appendTo(this.modal.$modal_body);
    }
    this.title = new PropertyInputText(this.$form,id+'_title','Title','tag',
      'mb-4 col-12 m-5px',ad.title,'title','70',false,ad);
    this.title.$div.css('margin-top','1rem!important');
    this.location = new Select(this.$form,'region',id+'_region','Start typing...',
      'Choose location','mb-4 col-12 col-lg-10 m-5px',false,[],
      ad.region?[ad.region]:null,true,false,false,ad);
    this.address = new PropertyInputText(this.$form,id+'_address',
      'Property Address',null,'mt-0 mb-4',ad.lodging?ad.lodging.address:null,
      'address',150,false,ad);
    this.room_number = new PropertyInputText(this.$form,id+'_romm_number',
      'Room Number',null,'mt-0 mb-4 col-12 col-md-6',ad.room_number,
      'room_number',null,false,ad);
    if(this.is_new_ad || (ad.lodging_type!='R' && ad.lodging_type!='P'))
      this.room_number.$div.css('display','none');
    this.latlng = new PropertyInputText(this.$form,id+'_latlng',null,
      null,null,ad.latlng,'latlng',null,true,ad);
    // this.$current_location = $(`
    //   <button type="button" class="btn bg-one btn-primary btn-sm">
    //     <i class="fa fa-map-marker mr-1"></i>
    //     Use current location</button>`)
    // .appendTo(this.address.$div);
    // new GetCurrentLocation(this.$current_location,this.address.$input,this.latlng.$input);
    new GetCurrentLocation(this.latlng.$input);
    this.date = new PropertyDate(this.$form,id+'_available_from','Date of availability','calendar',
      'mb-4 col-12 col-md-6 m-5px mt-0',ad.available_from,'available_from',ad);
    this.total_floors = new Select(this.$form,'total_floors',id+'_total_floors',
      'Choose total floors','Total floors','col-12 mb-4 col-md-6 m-5px',false,
      create_options_from_range(1,20),ad.total_floors,false,false,false,ad);
    this.floor_no = new Select(this.$form,'floor_no',id+'_floor_no','Choose floor number',
      'Floor number','col-12 mb-4 col-md-6 m-5px',false,create_options_from_range(1,20),
      ad.floor_no,false,false,false,ad);
    this.type = new Select(this.$form,'lodging_type',id+'_lodging_type','Choose type',
      'Property type','mb-4 col-12 col-md-6 m-5px',false,Type.get_options(),
      ad.lodging_type,false,false,false,ad);
    this.type.$select.change((ev)=>{
      if(ev.target.value==='R' || ev.target.value==='P') {
        this.room_number.$div.css('display','block');
      } else {
        this.room_number.$div.css('display','none');
      }
    });
    this.furnishing = new Select(this.$form,'furnishing',id+'_furnishing','Choose furnishing',
      'Furnishing','mb-4 col-12 col-md-6 m-5px',false,Furnishing.get_options(),ad.furnishing,
      false,false,false,ad);
    this.facilities = new Select(this.$form,'facilities',id+'_facilities','Select facilities',
      'Facilities','mb-4 col-12 col-md-6 m-5px',true,Facilities.get_options(),
      ad.facilities?JSON.parse(ad.facilities.replace(/'/g, '"')):null,false,false,false,ad);
    this.bathrooms = new PropertyRoom(this.$form,'bathrooms',id,ad);
    this.balconies = new PropertyRoom(this.$form,'balconies',id,ad);
    this.rooms = new PropertyRoom(this.$form,'rooms',id,ad);
    this.halls = new PropertyRoom(this.$form,'halls',id,ad);
    this.area_group = new PropertyAreaGroup(this.$form,'area',id+'_area','Area (built up)',
      id+'_unit','measuring_unit',ad);
    this.flooring = new Select(this.$form,'flooring',id+'_flooring',
      'choose flooring type','Flooring type','col-12 mb-4 col-md-6 m-5px',
      false,Flooring.get_options(),ad.flooring,false,false,false,ad);
    this.rent = new PropertyInputText(this.$form,id+'_rent','Rent (per month)','inr',
      'col-12 col-md-6 m-5px mt-0',ad.rent,'rent',null,false,ad);
    this.advance_rent_of_months = new PropertyInputText(this.$form,id+'_advance_rent_of_months',
      'Advance rent of months',null,'col-12 col-md-6 m-5px mt-0',ad.advance_rent_of_months,
      'advance_rent_of_months',null,false,ad);
    this.$charge_form_creator = $(`<button type="button" class="btn btn-primary btn-sm bg-one m-0 mt-3"></button>`)
    .html(`<i class="fa fa-money"></i> Add more charges`).click(()=>{
      this.charges_form_manager.add_form();
    });
    this.$charges_input = $(`<input type="hidden" name="other_charges">`);
    this.$charge_forms_container = $(`<div class="col-12 mb-4 mt-0 p-0"></div>`).append(this.$charge_form_creator)
      .append(this.$charges_input);
    this.details = new MdFormTextArea(this.$form,id+'_additional_details','additional_details',
      'e.g. It has three rooms, two bathrooms, one kitchen. It is fully furnished.','Additional Details',
      'm-5px',null,3,ad.additional_details,ad);
    this.$images_button = $(`<span class='btn btn-sm btn-default text-white ml-0 bg-one'>
      <i class="fa fa-file-image-o"></i> Add image</span>`);
    this.$images_button_container = $(`<div class="col-12"></div>`).append(this.$images_button);
    this.$images_container = $('<div class="form-row mb-4"></div>').append(this.$images_button_container);
    this.$terms_and_condition_ref = $('<div></div>');
    this.modal.$modal_content.append(this.modal.$modal_footer);
    this.$post = $(`<button class="btn color-2" type="submit"></button>`);
    this.$reset = $(`<button class="red white-text btn" type="reset">Reset</button>`);
    this.$delete = $(`<button class="red white-text btn" type="button">Delete</button>`);
    this.virtual_tour_link = new PropertyInputText(this.$form,id+'_virtual_tour_link','Virtual tour link','video',
      'mt-0 mb-4',ad.virtual_tour_link,'virtual_tour_link',null,false,ad);
    this.$buttons_cotnainer = $(`<div class="text-center col-12 mt-4"></div>`)
      .append(this.$post)
    if(this.is_new_ad){
      this.$buttons_cotnainer.append(this.$reset);
      this.$reset.click((event)=>{
        event.preventDefault();
        event.stopPropagation();
        $.confirm({
          title: 'Reset form',
          text: 'Data will be deleted permanently. Are you sure you want to delete it?',
          confirm: ()=>{
            this.$form.trigger('reset');
            this.propertyFormValidator.resetForm();
          }
        });
      });
      this.$post.text('Post');
    } else {
      this.$post.text('Save');
      this.$buttons_cotnainer.append(this.$delete);
      this.$delete.click(()=>{
        $.confirm({
          title: 'Delete - '+ad.title,
          text: 'This will delete it permanently. Are you sure you want to delete it?',
          confirm: ()=>{
            show_loading(this.modal.$modal);
            $.ajax({
              url: window.get_property_ad_edit_url(ad),
              type: 'DELETE',
            }).done(()=>{
              hide_and_delete(this.modal.$modal,this.$form);
              toastr.success('Property successfully deleted');
              $(document).trigger('remove_post',ad);
            }).fail((res)=>{
              toastr.error(res.error,'Error occurred');
            }).always(()=>{
              remove_loading(this.modal.$modal);
            });
          }
        });
      });
    }
    this.modal.$modal_footer.append(this.$buttons_cotnainer);
    this.modal.$modal_body.append(this.title.$div)
    .append(this.create_group_heading('General details')).append(this.location.$div)
    .append(this.type.$div).append(this.room_number.$div).append(this.latlng.$input)
    .append(this.address.$div).append(this.date.$div).append(this.total_floors.$div)
    .append(this.floor_no.$div).append(this.create_group_heading('Property details'))
    .append(this.furnishing.$div).append(this.facilities.$div)
    .append(this.bathrooms.$div).append(this.balconies.$div).append(this.rooms.$div)
    .append(this.halls.$div).append(this.area_group.$div).append(this.flooring.$div)
    .append(this.create_group_heading('Rent details')).append(this.rent.$div)
    .append(this.advance_rent_of_months.$div).append(this.$charge_forms_container)
    .append(this.create_group_heading('Additional details')).append(this.details.$div)
    .append(this.create_group_heading('Images')).append(this.virtual_tour_link.$div)
    .append(this.$images_container).append(this.create_group_heading("Terms & Conditions"))
    .append(this.$terms_and_condition_ref).append($('<div class="mb-3 col-12"></div>'));
    $('body').append(this.$form);
    this.image = new AddImage(this.$form,id,this.$images_button,window.image_upload_url,2000,2000,ad);
    this.charges_form_manager = new OtherChargeForm(this.$form,id,this.$charge_form_creator,ad);
    this.terms_and_conditions = new TermsAndConditions(this.$form,id,this.$terms_and_condition_ref,ad);
    this.modal.$modal.on('shown.bs.modal',()=>{
      $(window).trigger('form_rendered');
    });
    this.initialize_validation();
    if(!ad || (ad && Object.keys(ad).length==0)){
      this.total_filled_values = 0;
      this.$form.on('filled',()=>{
        this.total_filled_values++;
        this.check_to_enable_reset();
      });
      this.$form.on('empty',()=>{
        this.total_filled_values--;
        this.check_to_enable_reset();
      });
      this.check_to_enable_reset();
    }
    this.$form.on('validate',(event,$element)=>{
      this.propertyFormValidator.element($element);
    });
  }

  check_to_enable_reset(){
    if(this.total_filled_values>0){
      this.$reset.removeAttr('disabled');
    } else {
      this.$reset.attr('disabled','disabled');
    }
  }

  create_group_heading(heading){
    return $(`<div class="group-heading mb-4">${heading}</div>`)
  }
  
  initialize_validation(){
    var $form = this.$form;
    url = window.roomie_image_url;
    height = 2000;
    width = 2000;
    this.propertyFormValidator = $form.validate({
      ignore: [],
      rules: {
        title: {
          slug: true,
          maxlength: 70,
          required: true,
        },
        region: {
          required: true,
        },
        address: {
          required: true,
        },
        room_number: {
          required: {
            depends: (element) => {
              return this.type.$select.val()==='P' || this.type.$select.val()==='R'
            }
          },
          digits: true
        },
        available_from: {
          required: true,
          valid_date: [this.is_new_ad,this.id],
        },
        total_floors: {
          required: true,
          digits: true,
        },
        floor_no: {
          required: true,
          less_than_or_equal_to: this.total_floors.$select,
          digits: true,
        },
        lodging_type: {
          required: true,
        },
        property_type_other: {
          required: {
            depends: function (element) {
              return should_validate_other($form,'lodging_type');
            }
          }
        },
        furnishing: {
          required: true,
        },
        facilities: {
          required: false,
        },
        halls: {
          required: true,
        },
        rooms: {
          required: true,
        },
        bathrooms: {
          required: true,
        },
        balconies: {
          required: true,
        },
        area: {
          required: true,
          number: true,
          not_equal_zero: true,
        },
        measuring_unit: {
          required: {
            depends: function(){
              return get_value_using_name($form,'area')!="";
            }
          }
        },
        flooring: {
          required: true,
        },
        property_flooring_other: {
          required: {
            depends: function (element) {
              return should_validate_other($form,'flooring');
            }
          }
        },
        rent: {
          required: true,
          digits: true,
          not_equal_zero: true,
        },
        advance_rent_of_months: {
          required: true,
          digits: true,
          not_equal_zero: true,
        },
        images: {
          minimages: 2,
        },
        virtual_tour_link: {
          remote: window.validate_tour_link_url
        },
      },
      messages: {
        property_images: {
          minlength: jQuery.validator.format('Choose atleast {0} images'),
        },
        measuring_unit: {
          required: 'Measuring unit is required.'
        },
        floor_no: {
          less_than_or_equal_to: 'Floor number may not be greater than total floors'
        },
        virtual_tour_link: {
          remote: 'Please enter a valid kuula link'
        }
      },
      errorPlacement: function(error, element){
        if(element.attr('name')=='measuring_unit'){
          error.css({'margin':'0.5rem 0 0 0','margin-left':'0px',width: '100%'});
          $(element).parent().after(error[0]);
        }
        else if(element.attr('name')=='property_images') {
          error.css({'margin':'0.5rem 0 0 0','margin-left':'0px',width: '100%'});
          element.parent().find('add_image').first().after(error[0]);
        } else if(element.prop('nodeName')=='SELECT'){
          error.css({'margin':'0.5rem 0 0 0','margin-left':'0px'});
          element.next().after(error[0]);
        } else if(element.attr('name')=='area'){
          error.css({'margin':'0.5rem 0 0 0','margin-left':'0px',width: '100%'});
          element.next().after(error[0]);
        } else {
          if(!element.prev() || !element.prev().hasClass('prefix')){
            error.css({'margin':'0.5rem 0 0 0'});
          }
          element.after(error);
        }
      },
      onkeyup: (element,event)=>{
        this.propertyFormValidator.element($(element));
      },
      errorElement: 'div',
      submitHandler: (form,e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.propertyFormValidator.form();
        if ($form.valid()) {
          var data = {
            'title': this.title.$input.val(),
            'region': this.location.selectize.getValue(),
            'address': this.address.$input.val(),
            'latlng': this.latlng.$input.val(),
            'available_from': this.date.$input.val(),
            'total_floors': this.total_floors.selectize.getValue(),
            'floor_no': this.floor_no.selectize.getValue(),
            'lodging_type': this.type.selectize.getValue(),
            'lodging_type_other': '',
            'furnishing': this.furnishing.selectize.getValue(),
            'facilities': this.facilities.selectize.getValue(),
            'bathrooms': this.bathrooms.selectize.getValue(),
            'balconies': this.balconies.selectize.getValue(),
            'rooms': this.rooms.selectize.getValue(),
            'halls': this.halls.selectize.getValue(),
            'area': this.area_group.input.$input.val(), 
            'unit': this.area_group.units.selectize.getValue(),
            'flooring': this.flooring.selectize.getValue(),
            'flooring_other': '',
            'rent': this.rent.$input.val(),
            'advance_rent_of_months': this.advance_rent_of_months.$input.val(),
            'other_charges': JSON.stringify(this.charges_form_manager.get_data()),
            'additional_details': this.details.$input.val(),
            'images': this.image.$images_elem.val(),
            'terms_and_conditions': JSON.stringify(this.terms_and_conditions.get_data()),
            'virtual_tour_link': this.virtual_tour_link.$input.val(),
            'is_booked': this.is_new_ad?false:this.is_booked_switch.$input[0].checked,
            'room_number': this.room_number.$input.val()
          }
          show_loading($form);
          $.ajax({
            'type': this.method,
            'dataType': 'json',
            'url': this.url,
            'data': data,
            traditional: true,
          }).done((res)=>{
            if(this.is_new_ad){
              $(window).trigger('add_post',res.ad);
              toastr.success(res.ad.title,'Post Created');
              $form.trigger('delete_local_storage');
              this.modal.$modal.modal('hide');
              this.modal.$modal.on('hidden.bs.modal',()=>{
                window.property_forms_manger.delete_form(this.id);
              });
            } else {
              toastr.success(res.ad.title,'Post Saved');
              $(window).trigger('update_ad',res.ad);
              this.modal.$modal.modal('hide');
            }
          }).fail((data)=>{
            display_form_errors(data, $form);
          }).always(()=>{
            remove_loading($form);
          })
        }
      }
    });
  }
}

class PropertFormsManager {
  constructor(){
    this.forms = {};
  }
  open_form(id,title,ad){
    if(!this.forms[id]){
      this.forms[id] = new PropertyAdForm(id,title,ad);
    }
    this.forms[id].modal.$modal.modal('show');
  }
  delete_form(id){
    this.forms[id].$form.remove();
    delete this.forms[id];
  }
}

function open_property_form(id,title,ad={}){
  if(!window.property_forms_manger){
    window.property_forms_manger = new PropertFormsManager();
  }
  window.property_forms_manger.open_form(id,title,ad);
}

function set_password_form_validation(){
    var form =  $('#modalSetPasswordForm');
    var setPasswordFormValidator = form.validate({
        rules: {
            otp: {
                required: true,
                minlength: 4
            },
            password: {
                required: true,
                minlength: 8
            },
            confirm_password: {
                required: {
                    depends: function(element) {
                        return $('#set_password').val().length>0;
                    }
                },
                equalTo: {
                    param: '#set_password',
                    depends: function(element) {
                        return $('#set_password').val().length>0;
                    }
                }
            }
        },
        messages: {
            password: {
                required: "Password is required.",
                minlength: "Password should be atleast 8 characters long."
            },
            confirm_password: {
                required: "Re-enter password",
                equalTo: "Passwords should match."
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            setPasswordFormValidator.form();
            if($(form).valid()){
                var data = {
                    password: $('#set_password').val(),
                    confirm_password: $('#set_confirm_password').val(),
                    otp: $('#reset_password_otp').val(),
                    mobile_number: window.mobile_number
                }
                var url = API_PREFIX + 'account/reset-password/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).done((data)=>{
                    toastr.success('Password re-set successfully');
                    setTimeout(()=>{
                        $('#modalSetPasswordForm').modal('hide');
                        $('#modalLoginForm').modal('show');
                    },1000);
                }).fail((data)=>{
                    console.log(data.responseJSON);
                    display_form_errors(data,form);
                }).always(()=>{
                    remove_loading(form);
                });
            }
        }
    });
}

function change_password_form_validation(){
    var form =  $('#modalChangePasswordForm');
    var changePasswordFormValidator = form.validate({
        rules: {
            current_password: {
                required: true
            },
            password: {
                required: true,
                minlength: 8
            },
            confirm_password: {
                required: {
                    depends: function(element) {
                        return $('#change_password').val().length>0;
                    }
                },
                equalTo: {
                    param: '#change_password',
                    depends: function(element) {
                        return $('#change_password').val().length>0;
                    }
                }
            }
        },
        messages: {
            password: {
                required: "Password is required.",
                minlength: "Password should be atleast 8 characters long."
            },
            confirm_password: {
                required: "Re-enter password",
                equalTo: "Passwords should match."
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            changePasswordFormValidator.form();
            if($(form).valid()){
                var data = {
                    current_password: $('#change_current_password').val(),
                    password: $('#change_password').val(),
                    confirm_password: $('#change_confirm_password').val(),
                }
                var url = API_PREFIX + 'account/change-password/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).done((data)=>{
                  toastr.success('Password changed successfully.');
                  setTimeout(()=>{
                    $('#modalSetPasswordForm').modal('hide');
                  },1000);
                  $(form).modal('hide');
                }).fail((data)=>{
                  display_form_errors(data,form);
                }).always((data)=>{
                  remove_loading(form);
                });
            }
        }
    });
}

function profile_form_validation(form){
    form.on('show.bs.modal',function(){
        var url = window.image_url;
        var height = 150;
        var width = 150;
    });
    var profileFormValidator = form.validate({
        rules: {
            email: {
                email: true
            },
            name: {
                alphabets_only: true
            }
        },
        errorElement: 'div',
        submitHandler: function(form,e){
            e.preventDefault();
            profileFormValidator.form();
            var name_arr = $('#profile_name').val().split(" ");
            var first_name = "", last_name="";
            if(name_arr.length>1){
                first_name = name_arr[0];
                last_name = name_arr[1];
            } else {
                first_name = name_arr[0];
            }
            if(name.length>0){
                name_arr = name
            }
            if($(form).valid()){
                var data = {
                    email: $('#profile_email').val(),
                    first_name: first_name,
                    last_name: last_name,
                    detail: $('#profile_detail').val(),
                    // type_of_roommate: $('#profile_type_of_roommate').val(),
                }
                var url = API_PREFIX + 'account/save-profile/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).done((data)=>{
                  window.user_data = data.user;
                  toastr.success('Profile Saved.');
                }).fail((data)=>{
                  display_form_errors(data,form);
                }).always(()=>{
                  remove_loading(form);
                });
            }
        }
    });
}

function custom_validators(){
    jQuery.validator.addMethod('number_or_email',function(value,element){
        return this.optional(element) || /(^[789][0-9]{9}$)|([a-zA-Z][a-zA-Z0-9-\._]+@[a-zA-Z]+\.[a-zA-Z]{1,3})/.test(value);
    },'Please enter a valid value.');
    jQuery.validator.addMethod('mobile_number',function(value,element){
        return this.optional(element) || /^[789][0-9]{9}$/.test(value);
    },'Mobile number is not valid.');
    jQuery.validator.addMethod('email',function(value,element){
        return this.optional(element) || /[a-zA-Z][a-zA-Z0-9-\._]+@[a-zA-Z]+\.[a-zA-Z]{1,3}/.test(value);
    },'Email address is not valid.');
    jQuery.validator.addMethod('otp',function(value,element){
        return this.optional(element) || /^[0-9]{4,6}$/.test(value);
    },'OTP must be of length 4 to 6.');
    jQuery.validator.addMethod('alphabets_only',function(value,element){
        return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
    },'Can contain alphabets only.');
    jQuery.validator.addMethod('slug',function(value,element){
        return this.optional(element) || /^[-a-zA-Z0-9_ ]+$/.test(value);
    },'Can contain alphabets, digits, hyphen, underscore and space only.');
    jQuery.validator.addMethod('one_value',function(value,element){
        if(value.length===1){
            return true;
        } else {
            return false;
        }
    },'Choose one value.');
    jQuery.validator.addMethod('other',function(value,element){
      if($('#'+element.id+' option:selected').text().toLowerCase()=='other'){
        return $('#'+element.id+'_other').val()!='';
      }
      return true;
    },'Type other value.');
    jQuery.validator.addMethod('less_than_or_equal_to',function(value,element,params){
      return $(element).val()<=params.val();
    },'');
    jQuery.validator.addMethod('minimages',function(value,element){
      return $(element).val().length>=2;
    },'Atleast two images are required');
    jQuery.validator.addMethod('not_equal_zero',function(value,element){
      return $(element).val()!=0;
    },'Zero is not a valid value');
    jQuery.validator.addMethod('valid_date',function(value,element,params){
      if(params[0]){
        return true;
      }
      var is_booked = $('#'+params[1]+'_is_booked')[0].checked;
      var val_array = value.split('-');
      var date = new Date(val_array[2],parseInt(val_array[1])-1,val_array[0]);
      var date_today = new Date(Date.now());
      return is_booked || (!is_booked && date.getDate()>=date_today.getDate());
    },'Invalid date. Choose future value.');
}

function write_character_count(this_,length,span){
  var written = $(this_).val().length;
  $(span).text(written+'/'+length);
}

function set_character_count($el){
  $el.focusin(function(){
    var length = $(this).attr('length');
    var span = document.createElement('span');
    $(span).addClass('character-counter');
    span.innerText = $(this).val().length+'/'+length;
    $(this).before(span);
    $(this).keyup(function(){
      write_character_count(this,length,span);
    });
    $(this).change(function(){
      write_character_count(this,length,span);
    });
  });

  $el.focusout(function(){
    $(this).parent().children('.character-counter').remove()
  });
}

function set_custom_alerts(){
    $('.custom-error').delay(10000).fadeOut(function(){
        $(this).remove();
    });
    $('.custom-success').delay(10000).fadeOut(function(){
        $(this).remove();
    });
    $('.custom-warning').delay(10000).fadeOut(function(){
        $(this).remove();
    });
    $('.custom-info').delay(10000).fadeOut(function(){
        $(this).remove();
    });

    $('.custom-error').click(function(){
        $(this).remove();
    });
    $('.custom-success').click(function(){
        $(this).remove();
    });
    $('.custom-warning').click(function(){
        $(this).remove();
    });
    $('.custom-info').click(function(){
        $(this).remove();
    });
}

function logout(){
  show_loading();
  $.ajax({
    type: 'POST',
    url: window['API_PREFIX'] + 'account/logout/',
  }).always((data)=>{
    remove_loading();
    toastr.success('Your are now logged out');
    user_data = {};
    $(document).trigger('logout');
  });
}

class Modal{
  // Creates a simple modal with header and body
  constructor(id,title,close_button=true){
    this.$modal = $('<div></div>')
    .addClass('modal fade')
    .attr('id',id)
    .attr('data-backdrop','static');
    this.$modal_dialog = $('<div></div>')
    .addClass('modal-dialog');
    this.$modal_content = $('<div></div>')
    .addClass('modal-content');
    this.$modal_header = $('<div></div>')
    .addClass('modal-header');
    this.$modal_title = $('<h4></h4>')
    .addClass('modal-title m-auto font-weight-bold')
    .html(title);
    this.$modal_header.append(this.$modal_title);
    if(close_button){
      this.$close_button = $(`<button type="button" class="close" 
      data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>`);
      this.$modal_header.append(this.$close_button);
    }
    this.$modal_body = $('<div></div>').addClass('modal-body minh-500');
    this.$modal_footer = $('<div></div>').addClass('modal-footer');
    this.$modal.append(this.$modal_dialog);
    this.$modal_dialog.append(this.$modal_content);
    this.$modal_content.append(this.$modal_header)
    .append(this.$modal_body);
    $('body').append(this.$modal);
  }

  remove_on_close(){
    this.$modal.remove();
    this.$modal.on('hidden.bs.modal',()=>{
    });
  }
}

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

class Map{
  constructor($el, ad){
    $el.click(()=>{
      if(!this.modal){
        this.modal=new Modal(`address_map_${ad.id}`,'Property Address');
        $('body').append(this.modal.$modal);
        this.modal.$modal_body.removeClass('minh-500');
        this.modal.$modal_dialog.css('max-width','1000px')
        this.modal.$modal_body.append('<div id="map" class="h-100"></div>');
        calcRoute();
      }
      this.modal.$modal.modal('show');
    });
  }
}

class AdLink{
  constructor(text,icon){
    this.$link_container = $('<div></div>').addClass('col');
    this.$link_icon = $('<i></i>').addClass(icon);
    this.$link_container.append(this.$link_icon)
    .append('&nbsp;'+text);
  }

  add_click_event(func,arg) {
    this.$link_container.click(function(){
      func(arg);
    });
  }
}

class VirtualTour{
  // ref and link to create vr view using kuula embed link
  constructor($ref,link){
    var first_time = true;
    $ref.click(()=>{
      if(first_time){
        this.modal = new Modal('vrview','Virtual Tour');
        this.modal.$modal.modal('show').css({'width':'100%'});
        this.modal.$modal_body.css({'margin':'0','padding':'0'});
        this.modal.$modal_dialog.css({'margin':'0'});
        this.modal.$modal.on('shown.bs.modal',()=>{
          show_loading(this.modal.$modal);
          var frame_height = $(window).height()-this.modal.$modal_body[0].offsetTop;
          this.modal.$modal_dialog.css({'max-width':'100%','width':'100%',
            'height':$(window).height(),'max-height':$(window).height()});
          this.modal.$modal_body.css({'height':frame_height});
          this.$iframe = $('<iframe></iframe>').attr('width','100%').attr('height',frame_height)
          .css({'border':'none','max-width':'100%','frameborder':'0'})
          .attr('allow','vr,gyroscope,accelerometer,fullscreen')
          .attr('scrolling','no').attr('allowfullscreen','true')
          .attr('src',link);
          this.$iframe.on('load',()=>{
            remove_loading(this.modal.$modal);
            this.$iframe.off('load');
          });
          this.modal.$modal_body.append(this.$iframe);
          this.modal.$modal.off('shown.bs.modal');
        });
        first_time=false;
      } else {
        this.modal.$modal.modal('show');
      }
    });
  }
}

class AdLinks{
  constructor(ad){
    this.$container = $('<div></div>').addClass('row m-0 links');
    if(ad.images.length>0) {
      this.zoom = new AdLink('Zoom','fa fa-search-plus');
      this.$container.append(this.zoom.$link_container);
      new FullScreenCarousel(this.zoom.$link_container,ad);
    }
    if(ad.virtual_tour_link){
      this.virtual_tour_link = new AdLink('Tour','fa fa-video-camera');
      new VirtualTour(this.virtual_tour_link.$link_container,ad.virtual_tour_link);
      this.$container.append(this.virtual_tour_link.$link_container);
    }
    // this.view_details = new AdLink('Details','fa fa-external-link');
    // this.view_details.add_click_event(redirect_to_ad_detail_view,ad)
    // this.$container.append(this.view_details.$link_container);
  }
}

class AdDetailItem{
  constructor(text,icon,value){
    this.$li = $('<li></li>')
    .addClass('col-4 p-0 white-text');
    this.$text_container = $('<div></div>')
    .addClass('light-brown-text');
    this.$text = $('<small></small>');
    this.$value_container = $('<div></div>');
    this.$value_icon = $('<i></i>')
    .addClass(icon+' pr-1');111
    if(text=='Rent'){
      this.$value_container
      .append(this.$value_icon);
      this.$text.text(text);
    } else {
      this.$text.append(this.$value_icon)
      .append(text);
    }
    this.$value_container.append(value);
    this.$text_container.append(this.$text);
    this.$li.append(this.$text_container)
    .append(this.$value_container);
  }
}

(function($, window, undefined) {
  //is onprogress supported by browser?
  var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

  //If not supported, do nothing
  if (!hasOnProgress) {
      return;
  }
  
  //patch ajax settings to call a progress callback
  var oldXHR = $.ajaxSettings.xhr;
  $.ajaxSettings.xhr = function() {
      var xhr = oldXHR.apply(this, arguments);
      if(xhr instanceof window.XMLHttpRequest) {
          xhr.addEventListener('progress', this.progress, false);
      }
      
      if(xhr.upload) {
          xhr.upload.addEventListener('progress', this.progress, false);
      }
      
      return xhr;
  };
})(jQuery, window);

class AdDetails{
  constructor(ad){
    this.$ul = $('<ul></ul>')
    .addClass('list-unstyled row p-0 ml-0 m-0 font-small');
    this.rent = new AdDetailItem('Rent','fa fa-inr',ad.rent);
    this.rent.$li.removeClass('col-4').addClass('col-3');
    if(ad.lodging_type=='O'){
      this.type = new AdDetailItem('Type','fa fa-home','Other');
    } else {
      this.type = new AdDetailItem('Type','fa fa-home',Type.get_option(ad.lodging_type).text);
    }
    this.available_from = new AdDetailItem('Available from','fa fa-clock-o',ad.available_from);
    this.available_from.$li.addClass('col-5').removeClass('col-4');
    this.$container = $('<div></div>').css('height','fit-content')
    .addClass('rounded-bottom mdb-color lighten-3 text-center pt-3')
    .append(this.$ul).css({'padding-bottom':'0.5rem'});
    this.$ul.append(this.rent.$li)
    .append(this.type.$li)
    .append(this.available_from.$li);
  }
}

class Card{
  constructor(){
    this.$card_body = $('<div class="card-body p-0"></div>');
    this.$card = $('<div class="card mb-3"></div>')
    .append(this.$card_body);
    this.$card_footer = $('<div class="card-footer"></div>');
    this.$card_title = $('<h4 class="card-title"></h4>');
  }

  add_carousel(carousel) {
    if(this.$card.children('img').length>0){
      throw('Card image is already appended.')
    }
    this.$card.prepend(carousel);
  }

  add_image(image) {
    if(this.$card.children('.carousel').length>0){
      throw('Card carousel is already appended.')
    }
    this.$card.prepend(image);
  }
}

class CarouselIndicator{
  constructor(id,slide_to){
    this.$indicator = $('<li></li>').attr('data-target',id)
    .attr('data-slide-to',slide_to);
    if(slide_to==0){
      this.$indicator.addClass('active');
    }
  }
}

class CarouselItem{
  constructor(i,image,type){
    if(type==2){
      this.img_element = new ImageCard(image,image.image,image.tag,i,type);
    } else if(type==0) {
      this.img_element = new ImageCard(image,image.image_thumbnail,image.tag,i,type);
    } else {
      this.img_element = new ImageCard(image,image.image_mobile,image.tag,i,type);
    }
    try{
      this.$caption = $('<div></div>').addClass('carousel-caption')
      .html('<h5 class="h5-responsive">'+Tag.get_option(image.tag).text+'</h5>');
    } catch(e){
      this.$caption = $('<div></div>').addClass('carousel-caption')
      .text('');
    }
    this.$item = $('<div></div>').addClass('w-100 minh-200')
    .css({'text-align':'center'})
    .append(this.img_element.$img).append(this.$caption);
    if(type==2){
      this.$item.addClass('h-100');
    }
    if(i==0){
      this.$item.addClass('carousel-item active view');
    } else {
      this.$item.addClass('carousel-item');
    }
  }
}

class CarouselControl{
  constructor(id){
    this.$icon = $('<span></span>').addClass('carousel-control')
    .attr('aria-hidden','true');
    this.$sr_only = $('<span></span>').addClass('sr-only');
    this.$control = $('<a></a>').attr('href','#'+id)
    .attr('role','button')
    .append(this.$icon)
    .append(this.$sr_only);
  }
}

class CarouselControlNext extends CarouselControl{
  constructor(id){
    super(id);
    this.$control.addClass('carousel-control-next')
    .attr('data-slide','next');
    this.$icon.addClass('fa fa-chevron-right');
    this.$sr_only.text('Next');
  }
}

class CarouselControlPrev extends CarouselControl{
  constructor(id){
    super(id);
    this.$control.addClass('carousel-control-prev')
    .attr('data-slide','prev');
    this.$icon.addClass('fa fa-chevron-left');
    this.$sr_only.text('Prev');
  }
}

// type 0 - ad on all ads page
// 1 - ad on details ad page
// 2 - full screen carousel
class Carousel{
  constructor(id,ad,images=[],type=0){
    this.type = type;
    this.$carousel = $('<div></div>').attr('id',id)
    .attr('data-pause','true').attr('data-ride',"false")
    .addClass("carousel slide carousel-fade");
    this.$carousel_inner = $('<div></div>').addClass('carousel-inner');
    this.$carousel_indicators = $('<ol></ol>').addClass("carousel-indicators");
    this.next_control = new CarouselControlNext(id);
    this.prev_control = new CarouselControlPrev(id);
    this.$carousel.append(this.$carousel_indicators)
    .append(this.$carousel_inner);
    if(images.length>0){
      this.$carousel.append(this.next_control.$control)
      .append(this.prev_control.$control);
    } else {
      this.add_item(0,{});
    }
    for(var i in images){
      this.add_indicator(id,i);
      this.add_item(i,images[i]);
    }
    this.$carousel.on('slide.bs.carousel',()=>{
      this.$carousel.find('.carousel-item.active').removeClass('view');
    });
    this.$carousel.on('slid.bs.carousel',(event)=>{
      $(event.relatedTarget).addClass('view');
    });
    set_carousel(this.$carousel,type,ad);
  }

  add_indicator(id, i) {
    var indicator = new CarouselIndicator(id,i);
    this.$carousel_indicators.append(indicator.$indicator);
  }

  add_item(i, image) {
    this.item = new CarouselItem(i,image,this.type);
    this.$carousel_inner.append(this.item.$item);
  }
}

class Image{
  constructor(src,alt,index=0){
    this.$img = $('<img>').attr('alt',alt).addClass('center-element');
    this.$img.attr('data-src',src)
    .attr('src',window.STATIC_URL+'images/Spinner-1s-51px.gif');
  }
}

class ImageCard extends Image{
  constructor(image,src=null,alt=null,index=null,type){
    if(!src){
      super(window.STATIC_URL+'images/No-image-available.jpg','no image available');
    } else {
      super(src,alt,index);
    }
    // this.$img_cover = $('<div></div>')
    // .addClass('view card-img-top m-auto').append(this.$img)
    // .css({'width':'fit-content','max-width':'100%',
    // 'display':'inline-block','max-height':'100%','vertical-align':'middle'});
    // if(type==2){
    //   this.$img_cover.css({'height':'100%'});
    // }
  }
}

class FavoriteToggler{
  constructor($ref,ad) {
    if(user_data.favorite_properties && user_data.favorite_properties.indexOf(ad.id)>-1)
      $ref.attr('title','Remove from favorites').tooltip();
    else
      $ref.attr('title','Add to favorites').tooltip();
    $ref.click(()=>{
      var action = 'add_to_favorites';
      var success_message = ['Property added to My Favorites'];
      if(user_data.favorite_properties && user_data.favorite_properties.indexOf(ad.id)>-1){
        success_message = ['Property removed from My Favorites'];
        action = 'remove_from_favorites';
      }
      $.ajax({
        url: window.get_favorite_property_url(ad,action),
        type: 'POST'
      }).done((data)=>{
        $ref.tooltip('hide');
        window.user_data=data;
        toastr.success(success_message[0],success_message[1]);
        action = 'favorite';
        if(data.favorite_properties.indexOf(ad.id)>-1){
          $(window).trigger('add_post',[ad, action]);
          $ref.addClass('active');
        } else{
          $(window).trigger('remove_post',[ad, action]);
          $ref.removeClass('active');
        }
        $(window).trigger('update_ad', ad);
      });
    });
    if(user_data.favorite_properties && user_data.favorite_properties.indexOf(ad.id)>-1)
      $ref.addClass('active');
  }
}

class Ad{
  constructor(prefix,ad){
    this.card = new Card();
    this.card.$card.addClass('w-270 p-0');
    if(user_data){
      var $favorite_button = $('<i class="fa fa-heart favorite-button"></i>');
      this.card.$card.append($favorite_button);
      new FavoriteToggler($favorite_button, ad);
    }
    this.carousel = new Carousel(prefix+'_my_ad_'+ad.id,ad,ad.images);
    this.card.add_carousel(this.carousel.$carousel);
    this.ad_details = new AdDetails(ad);
    this.ad_links = new AdLinks(ad);
    this.card.$card_body.append(this.ad_links.$container)
    .append(this.ad_details.$container);
  }
}

class MyAd extends Ad{
  constructor(prefix,ad){
    super(prefix,ad);
    this.$my_links = $(`<div class="row m-0"></div>`);
    this.$edit = $(`<div class="cursor-pointer col color-5 text-center text-white p-2">
      <i class="fa fa-pencil"></i> Edit</div>`).click(()=>{
      open_property_form('edit_form_'+ad.id,'Edit Ad - '+ad.title,ad);
    });
    this.$book_status = $(`<div class="col text-center fw-500 text-white p-2"></div>`);
    if(ad.is_booked)
      this.$book_status.text('Booked').addClass('red');
    else
      this.$book_status.text('Vaccant').addClass('green');
    this.$my_links.append(this.$edit).append(this.$book_status);
    this.card.$card_body.append(this.$my_links);
  }
}

class MyBookedAd extends Ad{
  constructor(prefix,ad){
    super(prefix,ad);
    this.$my_links = $(`<div class="row m-0"></div>`);
    this.$owner_profile = $(`<div class="cursor-pointer col color-5 text-center text-white p-2">
      <i class="fa fa-eye"></i> Owner's Info</div>`);
    new MyProfile(this.$owner_profile,'owner_profile_'+ad.id,ad.lodging.posted_by,true);
    this.$address = $(`<div data-toggle="collapse" data-target="#address_${ad.id}"
      class="col text-center cursor-pointer fw-500 text-white border-left-white p-2"></div>`)
    .text('Address').addClass('color-5');
    this.$my_links.append(this.$owner_profile).append(this.$address);
    this.card.$card_body.append(this.$my_links).append(`
      <div class="collapse p-2" id="address_${ad.id}">
        ${ad.lodging.address}
      </div>`);
  }
}

function region_exists(ad){
  if(window.regions_selected){
    return window.regions_selected.findIndex(obj=>obj.id==ad.region.id)>-1;
  }
  return false;
}

class Ads{
  constructor(prefix,$ref,ads,ad_type){
    this.page = 1;
    this.prefix = prefix;
    this.ad_type = ad_type;
    this.ads = ads;
    this.$ref = $ref;
    this.$ads = $([]);
    $(window).on("add_post",(event, ad, action=null)=>{
      if(ad_type!=2){
        if (ad_type==4 && action=='favorite') {
          this.append_ad(ad);
        } else if(ad_type==1 && !action){
          this.append_ad(ad);
        } else if(region_exists(ad) && !action) {
          this.append_ad(ad);
        }
      }
    });
    $(window).on("remove_post",(event, ad, action=null)=>{
      if(ad_type!=2){
        if(ad_type==1 && !action){
          this.remove_ad(ad);
        } else if(ad_type==4 && action=='favorite'){
          this.remove_ad(ad);
        } else if(region_exists(ad) && !action) {
          this.remove_ad(ad);
        }
      }
    });
    $(window).on('update_ad',(event, ad)=>{
      this.update_ad(ad);
    });
    this.is_more_ads_loading = false;
    if(ad_type==3 && window.has_next_page==='True'){
      this.append_load_more_button();
    }
    $(document).on('login logout', (ev)=>{
      if(ad_type==3)
        this.rerender_ads(this.ads);
    });
    $(document).on('re-render-ads',(ev,ads,has_next_page,_ad_type)=>{
      if(ad_type==_ad_type){
        this.ads = ads;
        this.rerender_ads(ads);
        if(this.$load_more_button_container && (has_next_page==='False' || has_next_page===false)){
          this.$load_more_button_container.remove();
        } else if(!this.$load_more_button_container && (has_next_page==='True' || has_next_page===true)) {
          this.append_load_more_button();
        }
      }
    });
  }

  create_ad(ad){
    if(this.ad_type==1)
      return new MyAd(this.prefix,ad);
    else if(this.ad_type==2)
      return new MyBookedAd(this.prefix,ad);
    return new Ad(this.prefix,ad);
  }

  append_load_more_button(){
    this.$load_more_button = $(`<button type="button" class="btn btn-md color-2">Load more properties...</button>`).click(()=>{
      this.page++;
      if(this.is_more_ads_loading){
        return
      }
      this.is_more_ads_loading=true;
      $.ajax({
        url: window.get_paginated_ads_url(this.page),
        type: 'GET',
        data: {
          regions: $('#id_region').val(),
        }
      }).done((res)=>{
        this.ads = this.ads.concat(res.ads);
        for(var ad of res.ads){
          this.append_ad(ad);
        }
        if(res.has_next_page==='False' || res.has_next_page===false){
          this.$load_more_button_container.remove();
          this.$load_more_button_container = null;
        }
      }).always(()=>{
        this.is_more_ads_loading=false;
      });
    });
    this.$load_more_button_container=$('<div style="text-align: center;"></div>').append(this.$load_more_button);
    this.$ref.after(this.$load_more_button_container);
  }

  render_ads(){
    if(this.$ref.masonry){
      this.$ref.masonry('destroy');
    }
    this.$ads.remove();
    this.$ads = $([]);
    if(this.ads.length===0){
      this.$ref.empty();
      var empty_message = 'No property to show';
      switch(this.ad_type){
        case 1: empty_message='No property posted yet'
        break;
        case 2: empty_message='No property booked yet'
        break;
        case 4: empty_message='No property added yet'
        break;
      }
      this.$no_property_message = $(`<div class="no_property_message btn color-2 btn-sm">${empty_message}</div>`);
      this.$ref.append(this.$no_property_message);
      return;
    } 
    if(this.$no_property_message){
      this.$no_property_message.remove();
    }
    for(var ad of this.ads) {
      var $ad_object = this.create_ad(ad).card.$card;
      this.$ref.append($ad_object);
      this.$ads = this.$ads.add($ad_object);
    }
    show_loading(this.$ref);
    this.$grid = this.$ref.masonry({
      columnWidth: 270,
      gutter: 20,
    });
    this.$ref.children('.card').find('.carousel').each((index,el)=>{
      $(el).on('slid.bs.carousel', ()=>{
        this.$grid.masonry('layout');
      });
    });
    this.$grid.imagesLoaded().progress( () => {
      this.$grid.masonry('layout');
      setTimeout(()=>{
        this.$grid.masonry('layout');
      },2000);
      remove_loading(this.$ref);
    });
  }

  update_ad(ad){
    var ad_index = this.ads.findIndex(obj=>obj.id==ad.id);
    if(ad_index>-1){
      this.ads[ad_index]=ad;
      this.render_ads();
    }
  }

  append_ad(ad){
    var $ad_object = this.create_ad(ad).card.$card;
    this.$ads = this.$ads.add($ad_object);
    this.$grid.append($ad_object)
    .masonry('appended',$ad_object);
    this.ads.push(ad);
  }

  remove_ad(ad){
    this.ads = this.ads.filter(obj=>obj.id!=ad.id);
    this.render_ads();
  }

  reset_masonry(){
  }

  rerender_ads(ads){
    this.page = 1;
    this.ads=ads;
    this.render_ads();
  }
}

function calc_ads_container_width(max_ads=5){
  var window_width = $(window).width();
  var container_width;
  var ad_width = 270;
  while(max_ads>1){
    container_width=max_ads*ad_width+16*2+(max_ads-1)*20;
    if(container_width<window_width){
      return container_width;
    }
    max_ads--;
  }
  return window_width;
}

// 1 for My Properties
// 2 for My Bookings
// 3 for Properties list on search
// 4 for My Favorites
class MyProperties extends Ads{
  constructor(prefix, ads, title, ad_type=1){
    var modal = new Modal(prefix,title);
    super(prefix,modal.$modal_body,ads,ad_type);
    this.user_changed = false;
    this.modal = modal;
    modal.$modal.modal('show').addClass('text-center');
    this.modal.$modal_dialog.addClass('modal-lg')
    .css('max-width',calc_ads_container_width(3));
    $(document).on('login',()=>{
      this.user_changed = true;
    });
    $(document).on('logout',()=>{
      this.user_changed = true;
    });
    modal.$modal.on('shown.bs.modal',()=>{
      this.render_ads();
    });
  }
}

class PropertyAds extends Ads{
  constructor(prefix,ads){
    var $container= $('#ads_wrapper');
    super(prefix,$container,ads,3);
    this.render_ads();
  }
}

function get_my_ads(){
  if(window.myads && !window.myads.user_changed){
    window.myads.modal.$modal.modal('show');
  } else {
    $.ajax({
      url: window.my_ads_url,
      beforeSend: function(){
        show_loading();
      }
    }).done(function(res){
      window.myads = new MyProperties('my_property',JSON.parse(res.data),'My Properties',1);
      window.myads.user_changed = false;
    }).fail(function(){
      toastr.error("Unable to get your ads","Error");
    }).always(function(){
      remove_loading();
    });
  }
}

function get_my_booked_ads(){
  if(window.mybookings && !window.mybookings.user_changed){
    window.mybookings.modal.$modal.modal('show');
  } else {
    $.ajax({
      url: window.my_bookings_url,
      beforeSend: function(){
        show_loading();
      }
    }).done(function(res){
      window.mybookings = new MyProperties('my_bookings',JSON.parse(res.data),'My Bookings',2);
      window.mybookings.user_changed = false;
    }).fail(function(){
      toastr.error("Unable to get your bookings","Error");
    }).always(function(){
      remove_loading();
    });
  }
}

function get_my_favorite_properties(){
  if(window.my_favorite_properties && !window.my_favorite_properties.user_changed){
    window.my_favorite_properties.modal.$modal.modal('show');
  } else {
    $.ajax({
      url: window.my_favorite_properties_url,
      beforeSend: function(){
        show_loading();
      }
    }).done(function(res){
      window.my_favorite_properties = new MyProperties('my_favorite_properties',JSON.parse(res.data),'My Favorites',4);
      window.my_favorite_properties.user_changed = false;
    }).fail(function(){
      toastr.error("Unable to get your favorite properties","Error");
    }).always(function(){
      remove_loading();
    });
  }
}

function initialize_editable(id,_this,obj={},callback=()=>{}){
  var options = {
    type: 'select',
    pk: id,
    url: window.tag_url,
    title: 'Choose tag',
    source: Tag.get_options(),
    mode: 'inline',
    emptytext: 'Add tag',
    showbuttons: false,
    success: (response, newValue)=>{
      if(response===""){
        callback(newValue);
        $(_this).find(`[value=${id}]`).attr('data-tag',newValue);
        $(_this).trigger('change');
      }
    },
    params: {
      csrfmiddlewaretoken: window.getCookie('csrftoken')
    }
  };
  $('#tag_'+id).editable(Object.assign(options,obj));
}

function add_image_to_container(div,obj,$form,select){
  $(div).append(`
  <div class="uploaded_image_tag_container">
    <img src="${obj.url}" id="image_${obj.value}">
    <div>
      <a href="#" id="tag_${obj.value}"></a>
      <a href="#" id="delete_${obj.value}" class="red-text">Delete</a>
    </div>
  </div>
  `);
  $(div).find(`#delete_${obj.value}`).click(function($event){
    delete_image($event,obj.value,$form);
  });
  $(select).append(
    `<option value="${obj.value}" selected="selected" 
    data-tag="${obj.tag}">${obj.url}</option>`
  ).trigger('change');
  if(obj.tag){
    initialize_editable(obj.value,select,{value: obj.tag});
  } else {
    initialize_editable(obj.value,select);
  }
}

function destroy_modal($modal){
  $modal.modal('hide');
  $modal.remove();
}

function create_modal_to_add_tag(res){
  $('body').append(`
    <div class="modal fade" id="add_tag" data-backdrop="static" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Choose appropriate tag</h5>
          </div>
          <div class="modal-body">
            <img src="${res.url_thumbnail}" alt="${res.id}">
          </div>
          <div class="modal-footer">
            <a href="#" id="delete_${res.id}">Delete</a>
            <a href="#" id="tag_${res.id}"></a>
          </div>
        </div>
      </div>
    </div>
  `);
  var $modal_el = $('#add_tag');
  $('#delete_'+res.id).click(function($event){
    delete_image(event, res.id, null, ()=>{
      destroy_modal($modal_el);
      image_uploading=false;
    });
  });
  initialize_editable(res.id,$('#property_images'),{},(tag)=>{
    var obj = {
      value: res.id,
      url: res.url_thumbnail,
      tag: tag,
    }
    var div = $('#property_images_contain')[0];
    if(!div){
      div = create_images_container('property_images');
      $('#property_images').after(div);
    }
    add_image_to_container(div,obj,$('#modalPropertyAdForm'),$('#property_images')[0]);
    destroy_modal($modal_el);
    image_uploading=false;
  });
  $modal_el.modal('show');
  // $('#add_tag').on('show.bs.modal',function(){
  //   $('#add_tag').css('z-index','1052');
  // });
  // $('#add_tag').on('hide.bs.modal',function(){
  //   $('#add_tag').css('z-index','1000');
  // });
  $modal_el.on('hidden.bs.modal',function(){
    destroy_modal($modal_el);
  });
}

function set_prefix(id){
  var arr=id.split('_');
  var prefix=null;
  if(arr.length>2){
    prefix = arr.slice(0,-2).join('_');
  }
  return prefix;
}

var image_uploading = false;

function delete_from_localstorage(image_id,$form){
  if(!$form){
    return
  }
  var key = get_image_id($form).slice(1);
  var form_id = $form[0].id;
  var obj = JSON.parse(localStorage.getItem(form_id));
  if(!obj){
    return
  }
  var index = obj[key].findIndex(element=>element.value==image_id);
  obj[key].splice(index,1);
  localStorage.setItem(form_id, JSON.stringify(obj));
}

function send_image_delete_request(event,image_id,$form,callback=()=>{}){
  $.ajax({
    type: 'POST',
    url: window.delete_image_url,
    data: {
      id: image_id,
    }
  }).done((res)=>{
    toastr.success('Image has been deleted');
    callback();
  }).always((res)=>{
    if(res.status==404 || res.status==200){
      delete_from_localstorage(image_id,$form);
      if($form){
        $(get_image_id($form)).find('option[value='+image_id+']').remove();
        $(get_image_id($form)).trigger('change');
        $('#image_'+image_id).parent().remove();
      }
    }
  });
}

function delete_image(event,image_id,$form=null,callback=()=>{}){
  event.preventDefault();
  $.confirm({
    title: 'Are you sure you want to delete this image?',
    text: 'It will be deleted permanently.',
    confirm: function(){
      send_image_delete_request(event,image_id,$form,callback);
    },
  });
}

function resend_otp(event){
  var form = $('#modalVerifyNumberForm');
  var data = {
    mobile_number: window.user_data.mobile_number,
  }
  var url = API_PREFIX + 'account/request-otp/';
  if(window.add_number)
    url = API_PREFIX + 'account/add-number/add-number';
  show_loading(form);
  $.ajax({
    'type':'POST',
    'dataType':'json',
    'url': url,
    'data': data,
  }).done((data)=>{
    toastr.success('You will get a new OTP shortly');
    start_timer($(event.target));
  }).fail((data)=>{
    display_form_errors(data,form);
  }).always(()=>{
    remove_loading(form);
  });
}

function initialize_auto_save(form_id,select_ids){
  stringToForm(localStorage.getItem(form_id),$('#'+form_id),select_ids);
  $('#'+form_id).find(':input').each(function(){
    $(this).change(function(){
      localStorage.setItem(form_id,formToString($('#'+form_id),select_ids));
    });
  });
}

function get_form(element){
  return $($(element).closest('form')[0]);
}

function trigger_form_event($forms,action,$form){
  var num_forms = $forms.length;
  if(num_forms==1 && action=="add"){
    $form.trigger('filled');
  } else if(num_forms==0 && action=='remove'){
    $form.trigger('empty');
  }
}

class TermsAndConditions{
  constructor($form,prefix,$ref,ad){
    this.ad = ad;
    this.$form = $form;
    this.$button = $('<div class="btn bg-one m-0 btn-sm"></div>')
    .text('New Term and Condition');
    this.$container = $('<div class="col-12 p-0"></div>').append(this.$button);
    $ref.after(this.$container);
    this.$inputs = $([]);
    this.localStorage_key = prefix+'_termsAndConditions';
    this.$button.on('click',()=>{
      this.create_input();
    });
    if(!ad || (ad && Object.keys(ad).length==0)){
      this.$form.on('reset',()=>{
        var total = this.$inputs.length;
        this.reset();
        if(total>0){
          trigger_form_event(this.$inputs,'remove',$form);
        }
      });
      $(window).on('form_rendered',()=>{
        this.string_to_form();
        $(window).off('form_rendered');
      });
      $form.on('delete_local_storage',()=>{
        localStorage.removeItem(this.localStorage_key);
      });
    } else {
      if(ad.termsandconditions){
        for(var data of ad.termsandconditions){
          this.create_input(data.text);
        }
      }
    }
  }

  create_input(data=''){
    var input_count = this.$inputs.length+1;
    var $label = $(`<label for="terms_${input_count}"></label>`)
    .text('Term and Condition '+input_count);
    var $input = $(`<input id="terms_${input_count}" 
      name="term_and_condition_${input_count}"
      type="text" class="col-12 term_and_condition form-control">`);
    if(!this.ad || (this.ad && Object.keys(this.ad).length==0)){
      $input.change(()=>{
        this.form_to_string();
      });
    }
    if(this.$inputs.length>0){
      $(this.$inputs[this.$inputs.length-1]).find('.fa.fa-times-circle').remove();
    }
    var $div = $('<div class="md-form mb-4 mt-0"></div>').append($input)
    .append($label);
    this.add_remove_button($div);
    this.$button.before($div);
    $input.val(data).trigger('change');
    this.$inputs = this.$inputs.add($div);
    if(!this.ad || (this.ad && Object.keys(this.ad).length==0)){
      this.form_to_string();
      trigger_form_event(this.$inputs,'add',this.$form);
    }
  }

  add_remove_button($div){
    var remove_button = new RemoveChargeFormButton();
    remove_button.$icon.on('remove',()=>{
      $div.remove();
      this.$inputs = this.$inputs.not($div);
      if(this.$inputs.length>0){
        this.add_remove_button($(this.$inputs[this.$inputs.length-1]));
      }
      this.form_to_string();
      trigger_form_event(this.$inputs,'remove',this.$form);
      // this.$form.trigger('change');
    });
    $div.append(remove_button.$icon);
  }

  get_data(){
    var values = [];
    this.$inputs.each((index,element)=>{
      values.push($(element).find('input').val());
    });
    return values;
  }

  reset(){
    localStorage.removeItem(this.localStorage_key);
    this.$inputs.remove();
    this.$inputs = $([]);
  }

  form_to_string(){
    localStorage.setItem(this.localStorage_key,JSON.stringify(this.get_data()));
  }

  string_to_form(){
    var elems_data = JSON.parse(localStorage.getItem(this.localStorage_key));
    if(!isArray(elems_data)){
      this.reset();
      return;
    }
    for(var data of elems_data){
      this.create_input(data);
    }
  }
}

function initialize_all_selects($form=null){
  var selector = 'select:not([hidden])';
  if($form){
    $form.find(selector).selectize({
      copyClassesToDropdown: false,
    });
  } else {
    $(selector).selectize({
      copyClassesToDropdown: false,
    });
  }
}
function exitFullScreen(){
  if (document.exitFullscreen)
    document.exitFullscreen();
  else if (document.msExitFullscreen)
    document.msExitFullscreen();
  else if (document.mozCancelFullScreen)
    document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen)
    document.webkitExitFullscreen();
}

class PanzoomIcon{
  constructor(icon_class,callback){
    this.$icon_container = $(`<span><i class="fa fa-${icon_class}"></i></span>`)
    .css({'padding-left':'1rem','padding-right':'1rem','font-size':'1.5rem',
    'cursor':'pointer','border-right':'1px solid white'}).click(callback);
  }
}

function initialize_panzoom($img){
  try {
    $img.panzoom({
      increment: 0.3,
      panOnlyWhenZoomed: true,
      minScale: 1,
      maxScale: 3,
      contain: 'invert',
    });
  } catch (error) {
    console.error(error);
  }
}

class Panzoom{
  constructor($carousel){
    this.zoom_icon = new PanzoomIcon("search-plus",()=>{
      var $img = $carousel.find('.carousel-item.active img')
      $img.panzoom('zoom',{
        maxScale: $img[0].naturalWidth / $img[0].clientWidth
      });
    });
    this.zoom_out_icon = new PanzoomIcon('search-minus',()=>{
      $carousel.find('.carousel-item.active img').panzoom('resetPan').panzoom('zoom',true);
    });
    this.reset_zoom = new PanzoomIcon('refresh',()=>{
      $carousel.find('.carousel-item.active img').panzoom('reset');
    });
    this.reset_zoom.$icon_container.css('border-right','none');
    this.$icons_container = $('<span></span>')
    .append(this.zoom_icon.$icon_container)
    .append(this.zoom_out_icon.$icon_container)
    .append(this.reset_zoom.$icon_container)
    .css({'color':'white','background':'black','opacity':'0.6',
    'display':'inline-block'});
  }
}

class FullScreenCarousel{
  constructor($ref,ad){
    this.ad = ad;
    var first_time = true;
    $ref.click((event)=>{
      if(first_time){
        this.modal = new Modal('full_screen_carousel_modal_'+(ad.id),
          this.get_modal_title(0));
        this.modal.$modal.modal('show').css({'width':'100%','height':'100%'});
        this.modal.$modal_dialog.css({'margin':'0','max-width':'100%','height':'100%','width':'100%'});
        this.modal.$modal.on('shown.bs.modal',()=>{
          this.carousel = new Carousel('full_screen_carousel_'+(ad.id),ad,ad.images,2);
          this.carousel.$carousel.css({'height':this.modal.$modal_body.height()});
          this.carousel.$carousel_inner.css({'height':'100%'});
          this.modal.$modal_body.append(this.carousel.$carousel);
          this.modal.$modal.off('shown.bs.modal');
          this.carousel.$carousel.on('slide.bs.carousel',(event)=>{
            this.modal.$modal_title.html(this.get_modal_title(event.to));
          });
          this.panzoom = new Panzoom(this.carousel.$carousel);
          this.$panzoom_container = $('<div></div>').css({'text-align':'center'})
          .append(this.panzoom.$icons_container)
          .css({'position':'absolute','top':'2rem','width':'100%'});
          this.modal.$modal_body.append(this.$panzoom_container);
        });
        this.modal.$close_button.click(()=>{
          exitFullScreen();
        });
        var on_exit_fullscreen = ()=>{
          if(!document.webkitFullscreenElement && !document.mozFullscreenElement && !document.fullscreenElement && !document.MSFullscreenElement){
            this.modal.$modal.modal('hide');
          }
        }
        document.addEventListener('webkitfullscreenchange', on_exit_fullscreen, false);
        document.addEventListener('mozfullscreenchange', on_exit_fullscreen, false);
        document.addEventListener('fullscreenchange', on_exit_fullscreen, false);
        document.addEventListener('MSFullscreenChange', on_exit_fullscreen, false);
        first_time=false;
      } else {
        this.modal.$modal.modal('show');
      }
      var el = this.modal.$modal_dialog[0],
        rfs = el.requestFullscreen
          || el.webkitRequestFullScreen
          || el.mozRequestFullScreen
          || el.msRequestFullscreen;
      rfs.call(el);
    });
  }

  get_modal_title(index){
    return '<small>'+(index+1)+'/'+(this.ad.images.length)+'</small> '+Tag.get_option(this.ad.images[index].tag).text;
  }
}

function change_src($img,type,ad){
  if($img.attr('data-src')){
    var $img_carrier = $('<img>');
    $img_carrier.on('load',()=>{
      var $div = $('<div></div>').css({'margin':'auto'});
      if(type==0){
        $div.css({'height':'200px'});
      } else if(type==2){
        $div.css({'height':'fit-content','width':'fit-content'})
        .addClass('center-element');
      }
      $img.css('margin','auto').parent().prepend($div);
      $img.appendTo($div).attr('src',$img.attr('data-src'))
      .removeAttr('data-src').removeClass('center-element');
      $img_carrier.remove();
      initialize_panzoom($img);
      $img.click(()=>{
        redirect_to_ad_detail_view(ad);
      });
    });
    $img_carrier.attr('src',$img.attr('data-src'));
  }
}

function set_image($carousel,type,ad){
  var $img = $carousel.find('.carousel-item.active img');
  change_src($img,type,ad);
  $img.css({'max-width':'100%','max-height':'700px'});
}

function set_carousel($carousel,type,ad){
  set_image($carousel,type,ad);
  $carousel.on('slid.bs.carousel',(event)=>{
    set_image($carousel,type,ad);
  });
}

function get_element_using_selector($form,selector){
  return $form.find(selector).first();
}

function initialize_other_select(){
  $('[data-target=other]').change(function(){
    var id = this.id;
    if($('#'+id+' option:selected').text().toLowerCase()=='other'){
      var label = $(this).attr('data-label');
      var el = `
      <div class="md-form mt-0 col-12 col-md-6 mb-4" id="`+id+'_other_container'+`">
        <input type="text" class="form-control" name="`+id+'_other'+`" id=`+id+'_other'+`>
        <label for=`+id+`>`+label+`</label> 
      </div>
      `;
      $(this).parent().after(el);
    } else {
      $('#'+id+'_other_container').remove();
    }
  });
}

function set_validations(){
  custom_validators();
  register_form_validation();
  login_form_validation();
  verify_number_form_validation();
  enter_number_form_validation();
  set_password_form_validation();
  change_password_form_validation();
  // roomie_ad_form_validation();
}

function set_enter_number_form(){
  $('[data-action=verify-number]').click(function(){
      add_number = false;
      if(mobile_number!=""){
        $enter_mobile_number.val(mobile_number);
      }
  });
}

function toggle_buttons(form){
  if($(form).valid()){
    $(form).find('button[type=submit]').each(function(){
      $(this).removeAttr('disabled');
    });
  } else {
    $(form).find('button[type=submit]').each(function(){
      $(this).attr('disabled','');
    });
  }
}

// Toggle disability of button for forms like login, register
// button is enabled only if form is valid
function set_disable_submit_button(){
  $('form.modal').each(function(index,element){
    var form = this;
    $(form).find('button[type=submit]').each(function(){
      $(this).attr('disabled','');
    });
    $(form).find('input,select,textarea').each(function(){
      $(this).change(function(){
        toggle_buttons(form);
      })
    });
    toggle_buttons(form);
    setTimeout(function(){
      $(form).validate().resetForm();
    },2000);
  });
}
var filterType = /^(?:image\/gif|image\/jpeg|image\/jpeg|image\/jpeg|image\/png|image\/svg\+xml|image\/x\-icon|image\/x\-rgb)$/i;

function valid_image(file){
  if(file.files.length == 0){
    return false;
  }
  var uploadFile = file.files[0];
  if (!filterType.test(uploadFile.type)) {
    alert("Please select a valid image.");
    return false;
  }
  return true;
}

class ProgressBar{
  constructor(){
    this.$div=$('<div></div>').addClass('progress');
    this.$progress_bar = $('<div></div>')
    .addClass('progress-bar orange darken-3 progress-bar-striped progress-bar-animated')
    .appendTo(this.$div);
  }

  get_element(){
    return this.$div[0];
  }

  set_progress(pct){
    this.$progress_bar.css('width',pct+'%');
    this.$progress_bar.text(parseInt(pct)+'%');
  }

  remove(){
    this.$div.remove();
  }
}

function resize_image(image,max_height,max_width){
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  if (max_width / max_height > image.width / image.height) {
    canvas.height = max_height;
    canvas.width = (image.width / image.height) * max_height;
  } else {
    canvas.width = max_width;
    canvas.height = (image.height / image.width) * max_width;
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
  return canvas.toDataURL('image/jpeg');
}

function load_image_file($ref,file,url,max_height,max_width) {
  if(!valid_image(file)){
    return;
  }

  var progress_bar = new ProgressBar();
  $(file).after(progress_bar.get_element());

  var fileReader = new FileReader();
  var uploadFile = file.files[0];
  fileReader.readAsDataURL(uploadFile);
  fileReader.onload = function (event) {
    var image = document.createElement('img');
    image.src = event.target.result;
    image.onload = function () {
      var dataURL = resize_image(image,max_height,max_width);
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'image': dataURL,
        },
        progress: function(e){
          if(e.lengthComputable) {
            var pct = (e.loaded / e.total) * 100;
            progress_bar.set_progress(pct);
          } else {
            console.error('Content length not reported');
          }
        }
      }).done(function (res) {
        $ref.trigger('image_uploaded',res);
      }).fail(function (err) {
        $(file).after(`<div class="error">${err}</div>`);
      }).always(function () {
        progress_bar.remove();
        $(file).val('');
      });
    }
  };
}

class InlineTagEditor{
  constructor($ref,image_data){
    this.$elem = $('<span></span>').editable({
      type: 'select',
      pk: image_data.id,
      url: window.tag_url,
      title: 'Choose tag',
      source: Tag.get_options(),
      mode: 'inline',
      emptytext: 'Add tag',
      showbuttons: false,
      success: (response, newValue)=>{
        $ref.trigger('tag_success',newValue)
      },
      value: image_data.tag,
      params: {
        csrfmiddlewaretoken: window.getCookie('csrftoken')
      }
    }).addClass('cursor-pointer');
  }
}

class ImageDelete{
  constructor(image_id,$elem){
    this.$span = $('<span></span>').addClass('red-text')
    .text('Delete').click((event)=>{
      event.preventDefault();
      $.confirm({
        title: 'Delete Image',
        text: 'Are your sure? Image will be deleted permanently.',
        confirm: ()=>{
          $.ajax({
            type: 'POST',
            url: window.delete_image_url,
            data: {
              id: image_id,
            }
          }).done((res)=>{
            toastr.success('Image has been deleted');
            $elem.trigger('delete_success');
          }).fail((res)=>{
            $elem.trigger('delete_error');
            if(res.status==404){
              $elem.trigger('delete_success');
            }
          });
        }
      });
    }).addClass('cursor-pointer');
  }
}

class ImageGroup{
  constructor(_this,image_data,src_key){
    this.$div = $('<div></div>')
    .addClass('uploaded_image_tag_container');
    this.$image = $('<img>').attr('src',image_data[src_key])
    .attr('alt',image_data.tag).css('max-width','180px');
    this.$image_container = $('<div></div>')
    .css('text-align','center')
    .append(this.$image);
    this.tag_inline_editor = new InlineTagEditor(this.$div,image_data);
    this.delete = new ImageDelete(image_data.id,this.$div);
    this.$div.on('delete_success',()=>{
      this.$div.remove();
      _this.remove_image(image_data.id);
    });
    this.$div2 = $('<div></div>').addClass('p-1 d-flex')
    .css({'justify-content':'space-between','min-width':'180px'})
    .append(this.delete.$span).append(this.tag_inline_editor.$elem);
    this.$div.append(this.$image_container).append(this.$div2);
  }
}

class ImageTagModal extends Modal{
  constructor(_this,image_data){
    super('modal_'+image_data.id,'Choose appropriate tag for image',false);
    this.$image = $('<img src="'+image_data.image_thumbnail+'">').attr('alt',image_data.tag);
    this.$modal_body.removeClass('minh-500');
    this.delete = new ImageDelete(image_data.id,this.$modal);
    this.tag = new InlineTagEditor(this.$modal,image_data);
    this.$modal.on('tag_success',(event,new_tag)=>{
      hide_and_delete(this.$modal,this.$modal);
      _this.add_new_image_group(Object.assign(image_data,{tag:new_tag}));
    });
    this.$modal.on('delete_success',()=>{
      this.$modal.remove();
      _this.remove_image(image_data.id);
    });
    this.$modal_body.append(this.$image[0]);
    this.$modal_content.append(this.$modal_footer);
    this.$modal_footer.append(this.delete.$span[0])
    .append(this.tag.$elem[0]);
    this.$modal.modal('show');
  }
}

class AddImage{
  constructor($form,prefix,$el_ref,url,max_height,max_width,ad){
    this.is_new_ad = !ad || (ad && Object.keys(ad).length==0);
    this.$form = $form;
    this.prefix = prefix;
    this.$ref = $el_ref;
    this.$input = $('<input>').attr('type','file')
    .css('display','none');
    this.$images_container = $('<div></div>')
    .addClass('row container-fluid');
    this.$images_elem = $('<select></select>')
    .attr('name','images').css('display','none')
    .attr('hidden','true').attr('multiple','multiple');
    this.$ref.after(this.$input).click(()=>{
      this.$input.click();
    }).after(this.$images_elem);
    this.localStorage_key = this.prefix+'_images';
    this.$ref.before(this.$images_container);
    this.url = url;
    this.$input.change(()=>{
      load_image_file(this.$ref,this.$input[0],url,max_height,max_width);
    });
    this.$ref.on('image_uploaded',(event,res)=>{
      toastr.success('Image Uploaded');
      new ImageTagModal(this,res);
    });
    this.images_data=[];
    if(this.is_new_ad==true){
      $(window).on('form_rendered',()=>{
        this.string_to_form();
        $(window).off('form_rendered');
      });
      this.$form.on('reset',()=>{
        var total = this.images_data.length;
        this.reset();
        if(total>0){
          trigger_form_event(this.images_data,'remove',$form);
        }
      });
      $form.on('delete_local_storage',()=>{
        localStorage.removeItem(this.localStorage_key);
      });
    } else {
      if(ad.images){
        for(var image_data of ad.images){
          this.add_new_image_group(image_data);
        }
      }
    }
  }

  remove_image(image_id){
    var index = this.images_data.findIndex(value=>value==image_id);
    if(index>-1){
      this.images_data.splice(index,1);
      this.form_to_string();
      this.$images_elem.find('option[value="'+image_id+'"]').remove();
      trigger_form_event(this.images_data,'remove',this.$form);
      this.$images_elem.trigger('keyup');
    }
  }

  add_new_image_group(image_data){
    var image_group = new ImageGroup(this,image_data,'image_thumbnail');
    this.$images_container.append(image_group.$div);
    this.add_image(image_data.id);
  }

  add_image(image_id){
    this.images_data.push(image_id);
    this.form_to_string();
    this.add_option(image_id);
  }

  add_option(image_id){
    this.$images_elem.append(`
    <option value="${image_id}" selected="selected"></option>`);
    trigger_form_event(this.images_data,'add',this.$form);
    this.$images_elem.trigger('keyup');
  }

  form_to_string(){
    if(this.is_new_ad){
      localStorage.setItem(this.localStorage_key,JSON.stringify(this.images_data));
    }
  }

  reset(){
    this.images_data=[];
    this.$images_container.children().remove();
    this.$images_elem.children().remove();
    this.form_to_string();
  }

  string_to_form(){
    if(this.is_new_ad){
      try{
        this.images_data = JSON.parse(localStorage.getItem(this.localStorage_key));
      } catch(err){
        this.reset();
        return;
      }
      if(!isArray(this.images_data)){
        this.reset();
        return;
      }
      this.images_data=this.images_data.filter(value=>!isNaN(value) && value!=null);
      if(this.images_data.length==0){
        return;
      }
      this.form_to_string();
      $.ajax({
        url:window.images_url,
        type:'GET',
        data: {
          ids: this.images_data
        },
      }).done((res)=>{
        this.images_data=[];
        for(var image of res.images){
          this.add_new_image_group(image);
        }
      }).fail((res)=>{
        this.reset();
      });
    }
  }

  images_count(){
    return this.images_data.length;
  }
}

class ProfileAddImage{
  constructor($el_ref,url,max_height,max_width,$image){
    this.$ref = $el_ref;
    this.$input = $('<input type="file">').addClass('d-none');
    this.$ref.click(()=>{
      this.$input.click();
    });
    this.$input.change((event)=>{
      load_image_file(this.$ref,event.target,url,max_height,max_width);
    });
    this.$ref.on('image_uploaded',(event,image)=>{
      $image.attr('src',image.image_mobile);
      $('#profile-icon').css({'display':'none'});
      $image.css({'display':'block'});
    });
  }
}

function start_timer($el){
  var start_time = new Date();
  var otp_clock_interval = setInterval(()=>{
    $el.find('#timer').remove();
    var time_gap = Math.round((new Date().getTime() - start_time.getTime())/1000);
    if(time_gap>=60){
      $el.removeAttr('disabled');
      clearInterval(otp_clock_interval);
    } else {
      var time_text = '1:00';
      if(time_gap<60){
        time_text = `0:${60-time_gap}`;
      }
      $el.append(`<span id="timer"> (${time_text})</span>`);
      $el.attr('disabled','disabled');
    }
  },1000);
}

$('document').ready(function(){
  $(document).ajaxError(function ( event, jqxhr, settings, thrownError ) {
    if(jqxhr.status==0){
      toastr.error('Error in connecting to server. Check your internet connection.')
    }
    else if(jqxhr.status==500){
      toastr.error(`${jqxhr.statusText} occurred at ${settings.url} in a ${settings.type} request`,`Error ${jqxhr.status} occurred`);
    } else if(jqxhr.status==403) {
      $('#modalLoginForm').modal('show');
      toastr.error('Please login to book a property','Login requried')
    } else {
      if(!jqxhr.responseJSON){
        toastr.error(`${jqxhr.responseText} occurred at ${settings.url} in a ${settings.type} request`,`${jqxhr.status} ${jqxhr.statusText}`);
      } else if('errors' in jqxhr.responseJSON) {
        // {'errors':{'__all__': ['error1','error2', ...],'field1':['error1', ...], ...}}
        var errors_arr = jqxhr.responseJSON['errors']['__all__'];
        if(!errors_arr || !errors_arr.length) return;
        var errors = "";
        for(var i in jqxhr.responseJSON['errors']['__all__']){
          if(i!=0){
            errors += '<br>';
          }
          errors += errors_arr[i];
        }
        toastr.error(`${errors}`,`${jqxhr.status} ${jqxhr.statusText}`);
      }
    }
  });
  $.validator.addClassRules({
    "charge_amount": {
      required: true,
      not_equal_zero: true,
      digits: true,
    },
    'charge_description': {
      required: true,
    },
    'term_and_condition': {
      required: true,
    },
  });
  $.validator.setDefaults({ 
    ignore: [],
  });
  var window_width = $(window).width();
  if(window_width>768){
    $('.mobile').remove()
  } else {
    $('.desktop').remove();
  }
  
  $(document).ajaxSend(function (event, jqxhr, settings) {
    settings.data += '&csrfmiddlewaretoken=' + window.getCookie('csrftoken');
    if (settings.type == "POST" || settings.type == "PUT" || settings.type == "DELETE") {
      jqxhr.setRequestHeader('X-CSRFToken', window.getCookie('csrftoken'));
    };
  });

  $.ajaxSetup({
    traditional: true
  });

  set_custom_alerts();
  // enable_add_image();
  initialize_other_select();

  $('.modal').on('hidden.bs.modal',function(){
    remove_all_messages($(this));
  });

  $('.modal').on('show.bs.modal',function(){
    var num_visible_modals = $('.modal.show').length;
    $(this).css('z-index',1050+num_visible_modals);
  });
  
  set_validations();
  set_disable_submit_button();
  set_enter_number_form();

  $('#resend_otp').click(function(event){
    resend_otp(event);
  });

  // $('input[name=has_property]').change(function(event){
  //     if(event.target.value=="False"){
  //         $('.has_property').addClass('d-none');
  //         $('.not_has_property').removeClass('d-none');
  //     } else {
  //         $('.not_has_property').addClass('d-none');
  //         $('.has_property').removeClass('d-none');
  //     }
  //     $($('#modalRoomieAdForm .modal-body').children('div')[1]).removeClass('d-none');
  // });

  toastr.options.closeButton = true;
  toastr.options.progressBar = true;
  add_tawk_to();
});
