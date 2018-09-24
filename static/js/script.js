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

var area_units = [
  'Sq. Gaj',
  'Sq. Ft.',
  'Sq. Yds',
  'Sq. Meter',
  'Acre',
  'Marla',
  // 'Bigha',
  'Kanal',
  // 'Grounds',
  'Ares',
  'Biswa',
  // 'Gunta',
  'Hectares'
];
var conversion_value = [
  1,
  0.112188,
  1.00969,
  1.20758,
  4886.92,
  30.5433,
  // ,
  610.865,
  // ,
  120.758,
  150,
  // ,
  12075.8
  
];

var Tags = {
  tagList: [
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
  ],
  get_tags: function(){
    return this.tagList;
  },
  get_tag_text: function(value) {
    for(var tag of this.tagList) {
      if(tag.value==value){
        return tag.text;
      }
    }
  }
}

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

var loadingLocation = false;

function getCurrentLocation(ev,input_id){
  var $el=$(ev.target);
  ev.preventDefault();
  if(loadingLocation){
    return
  }
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var lat=position.coords.latitude;
      var lng=position.coords.longitude;
      $.ajax({
        url: window.current_location_url,
        method: 'POST',
        data: {
          lat: lat,
          lng: lng,
        },
        beforeSend: function(){
          $el.append("<span id='spinner'>&nbsp;<i class='fa fa-spinner fa-spin'></i></span>");
          loadingLocation=true;
        }
      }).done((res)=>{
        $('#property_address').val(res.result[0].formatted_address);
        $('#property_latlng').val(lat+','+lng);
        $('#property_latlng').trigger('change');
        toastr.success('Address added successfully');
      }).fail((res)=>{
        if(res.responseJSON && 'errors' in res.responseJSON && '__all__' in res.responseJSON){
          toastr.error(res.responseJSON.errors['__all__'][0]);
        }
        display_errors(res,$('#modalPropertyAdForm'));
      }).always((res)=>{
        $el.children('#spinner').remove();
        loadingLocation = false;
      });
      // var geocoder = new google.maps.Geocoder;
      // geocoder.geocode({location: {lat:parseFloat(lat),lng:parseFloat(lng)}},function(res){
      //   $('#'+input_id).val(res[0].formatted_address);
      //   $('#'+input_id).trigger('change');
      // });
    })
  } else {
    alert("Cannot access your location");
  }
}

function remove_parent(event){
  $(event.target).parent().parent().remove();
}

function create_charge_form(event,prefix){
  event.preventDefault();
  var el=event.target;
  var other_charge_form=`
  <div class="row col-12 w-100 mt-3 other_charges_container container">
    <div class="md-form col-12 col-md-4 p-1">
      <i class="fa fa-inr prefix grey-text"></i>
      <input type="text" 
        id="${prefix}_charge_amount_${charge_form_id}" 
        class="form-control"
        data-name="charge_amount"
        data-id="${prefix}_charge_amount">
      <label for="${prefix}_charge_amount_${charge_form_id}">
        Amount
      </label>
    </div>
    <div class="md-form col-12 col-md-4 p-1">
      <input type="text" 
        id="${prefix}_charge_description_${charge_form_id}" 
        class="form-control" 
        data-name="charge_description"
        data-id="${prefix}_charge_description">
      <label for="${prefix}_charge_description_${charge_form_id}">
        Description
      </label>
    </div>
    <div class="flex-vertical-center d-flex justify-content-center col-10 col-md-3 p-0">
      <div class="custom-control custom-checkbox">
        <input type="checkbox" 
          class="custom-control-input" 
          id="${prefix}_charge_is_per_month_${charge_form_id}"
          data-name="charge_is_per_month" 
          data-id="${prefix}_charge_is_per_month">
        <label class="custom-control-label" 
          for="${prefix}_charge_is_per_month_${charge_form_id}">
          Per month
        </label>
      </div>
    </div>
    <div class="col-2 col-md-1 d-flex align-items-center justify-content-center">
      <i 
        class="cursor-pointer fa fa-times-circle red-text fa-lg"
        onclick="remove_parent(event)">
      </i>
    </div>
  </div>`;
  $(el).parent().before(other_charge_form);
  
  var key=prefix+'_other_charges';
  var data=localStorage.getItem(key);
  var data_to_store;
  if(!data || JSON.parse(data).constructor!=Array){
    data_to_store=[];
  } else {
    data_to_store=JSON.parse(data);
  }
  data_to_store.push(other_charge_form);
  localStorage.setItem(key,JSON.stringify(data_to_store));
  
  key=prefix+'_other_charges_fields';
  $(el).parent().prev().find('input,checkbox').each(function(){
    $(this).change(function(){
      data=localStorage.getItem(key);
      if(!data || JSON.parse(data).constructor!=Object){
        data_to_store={};
      } else {
        data_to_store=JSON.parse(data);
      }
      if ($(this).attr("type") == 'checkbox' || $(this).attr("type") == 'radio') {
        data_to_store[this.id] = $(this).attr("checked");
      } else {
        data_to_store[this.id] = $(this).val();
      }
      localStorage.setItem(key,JSON.stringify(data_to_store));
    });
  });

  get_form(event.target).validate();
  $('#'+prefix+'_charge_amount_'+charge_form_id).rules('add',{
    required: true
  });
  $('#'+prefix+'_charge_description_'+charge_form_id).rules('add',{
    required: {
      depends: function(){
        return $('#'+prefix+'_charge_amount_'+charge_form_id).val()!='';
      }
    }
  });
  
  charge_form_id++;
}

function get_selectize_configurations(value,remove_button=true){
  var business, items, render={
    option: function (item, escape) {
      var root = `
      <div class="option">
        ${escape(item.region)}, <small class="text-green">${escape(item.state)}</small>`;
      if(item.ads!=undefined && item.ads!=null && item.ads>-1 && value.toLowerCase()=='search'){
        root += `<span class="ads_count badge color-4">properties: ${escape(item.ads)}</span>`;
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
        <div class="item active" data-value="${item.id}">
          ${shortForm(item.region)}
          <a href="javascript:void(0)" class="remove" tabindex="-1" title="Remove">×</a>
        </div>
        `;
      }
    });
  }
  return {
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
        error: function () {
          callback();
        },
        success: function (res) {
          callback(res.results);
        }
      });
    },
    onInitialize: function(){
      this.$control.append(`<i class="fa fa-spinner fa-pulse loading-icon"></i>`);
    },
    plugins: plugins,
  }
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
}

function show_form_global_errors(form,globalErrors){
  var ul = create_ul();
  if(globalErrors){
    for(let error of globalErrors){
      var li = document.createElement('li');
      li.className = "alert alert-danger";
      $(li).html(`${error}${alert_close_button}`);
      ul.append(li);
    }
  }
  $(form).find('.modal-body').prepend(ul);
}

function show_form_field_errors(form,errors){
  var validator = $(form).validate();
  validator.showErrors(errors);
}

function isDict(v) {
  return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

function trace(data,key){
  console.log(key+':',data);
}

function isArray(v){
  return v instanceof Array;
}

function show_error(error,key){
  if(key && key!='__all__' && key!='non_field_errors'){
    toastr.error(error,key);
  } else {
    toastr.error(error,'Error');
  }
}

function show_errors_in_list(list_of_errors,key=null){
  for(var error of list_of_errors){
    show_error(error,key);
  }
}

function show_errors(errors,key=null){
  if(isArray(errors)){
    show_errors_in_list(errors,key);
  } else {
    show_error(errors,key);
  }
}

function display_global_errors(res){
  if(isDict(res)){
    if('responseJSON' in res){
      res = res.responseJSON;
    } else {
      res = res.responseText;
    }
    if('errors' in res){
      for(var key in res.errors){
        show_errors_in_list(res.errors[key],key);
      }
    } else {
      show_error('Unknown error');
    }
  } else {
    show_error(res);
  }
}

function display_errors(data,form){
  let errors = {};
  if(data.responseJSON){
    errors = data.responseJSON.errors;
    toastr.error(('Error(s) occurred in form submission.'))
  } else {
    errors['__all__'] = ['unknown error occurred.'];
    toastr.error(data.status+' error occurred.')
  }
  remove_all_messages(form);
  var globalErrors = errors['__all__'];
  delete errors['__all__'];
  show_form_field_errors(form,errors);
  show_form_global_errors(form, globalErrors);
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
                  display_message(form,'Logging in.');
                  if(window.location.pathname=='/account/login'){
                    setTimeout(()=>{
                      window.location.href = "/";
                    },1000);
                  } else {
                    setTimeout(()=>{
                      window.location.reload();
                    },1000);
                  }
                }).fail((data)=>{
                  display_errors(data,form);
                }).always((data)=>{
                  remove_loading(form);
                });
            }
        }
    });
    $('#forgot_password_modal').click((e)=>{
        e.preventDefault();
        set_password = true;
    })
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
            if(!add_number){
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
              $('#modalEnterNumberForm').modal('hide');
              $('#modalVerifyNumberForm').modal('show');
            }).fail((data)=>{
              display_errors(data,form);
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
        toggle_add_new_number_button();
      }).fail((data)=>{
        toastr.error('Cannot delete this number','Delete '+mobile_number);
        display_errors(data);
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

function create_alternate_mobile_number_container(mobile_number,$el){
  var count = $('.alternate_mobile_number').length+1;
  var id = 'profile_alternate_mobile_number_'+count;
  var alternate_mobile_number_container = `
  <div class="container-fluid mb-4 row">
    <div class="md-form col-12 col-md-6">
      <i class="fa fa-mobile prefix grey-text"></i>
      <input type="text" id="${id}" value="${mobile_number}" 
        class="form-control alternate_mobile_number"
        disabled>
      <label for="${id}">Alternate Mobile number ${count}</label>
    </div>
    <div class="col-12 col-md-6 d-flex align-items-center">
      <button class="btn danger-color btn-sm"
        onclick="delete_number(event,${mobile_number})">Delete</button>
    </div>
  </div>`;
  $el.after(alternate_mobile_number_container);
  $('#'+id).trigger('change');
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
                }
                if(!add_number){
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
                  if(set_password){
                    $('#modalSetPasswordForm').modal('show');
                  } else {
                    if (add_number) {
                      toastr.success('New mobile number added', 'Add '+mobile_number);
                      create_alternate_mobile_number_container(data.mobile_number,$('#alternate_mobile_numbers'));
                      toggle_add_new_number_button();
                    } else {
                      display_message(form, 'Registered successfully.');
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }
                  }
                }).fail((data)=>{
                  display_errors(data,form);
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
                }).always((data)=>{
                    if(data.status=='200'){
                        set_password=false;
                        $('#modalRegisterForm').modal('hide');
                        $('#modalVerifyNumberForm').modal('show');
                    } else {
                        display_errors(data,form);
                    }
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
                        display_errors(data,form);
                    }
                    remove_loading(form);
                });
            }
        }
    });
}

function create_charges_data($form){
  var $charges_amount=$form.find('[data-name=charge_amount]')
  var $charges_description=$form.find('[data-name=charge_description]');
  var $charges_is_per_month=$form.find('[data-name=charge_is_per_month]');
  var data=[];
  var i=0;
  $charges_amount.each(function(el){
    data.push({
      amount: $charges_amount[i].value,
      description: $charges_description[i].value,
      is_per_month: $charges_is_per_month[i].checked,
    });
    i++;
  });
  return JSON.stringify(data);
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

function property_form_validation($form){
  $form.on('show.bs.modal',function(){
      url = window.roomie_image_url;
      height = 2000;
      width = 12000;
  });
  var propertyFormValidator = $form.validate({
    ignore: '.ignore',
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
      available_from: {
        required: true,
      },
      total_floors: {
        required: true,
        digits: true,
      },
      floor_no: {
        required: true,
        less_than_total_floors: true,
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
        digits: true
      },
      advance_of_months: {
        required: true,
        digits: true
      },
      property_images: {
        minlength: 3,
      },
    },
    messages: {
      property_images: {
        minlength: jQuery.validator.format('Choose atleast {0} images'),
      },
      measuring_unit: {
        required: 'Measuring unit is required.'
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
        element.after(error[0]);
      }
    },
    errorElement: 'div',
    submitHandler: function(form,e){
      e.preventDefault();
      e.stopPropagation();
      propertyFormValidator.form();
      if ($(form).valid()) {
        var data = {
          'title': get_value_using_name($(form),'title'),
          'region': get_value_using_name($(form),'region'),
          'address': get_value_using_name($(form),'address'),
          'latlng': get_value_using_name($(form),'property_latlng'),
          'available_from': get_value_using_name($(form),'available_from'),
          'total_floors': get_value_using_name($(form),'total_floors'),
          'floor_no': get_value_using_name($(form),'floor_no'),
          'lodging_type': get_value_using_name($(form),'lodging_type'),
          'lodging_type_other': get_value_using_name($(form),'property_type_other'),
          'furnishing': get_value_using_name($(form),'furnishing'),
          'facilities': get_value_using_name($(form),'facilities'),
          'bathrooms': get_value_using_name($(form),'bathrooms'),
          'balconies': get_value_using_name($(form),'balconies'),
          'rooms': get_value_using_name($(form),'rooms'),
          'halls': get_value_using_name($(form),'halls'),
          'area': convert_area_to_gaj(get_value_using_name($(form),'area'), 
                    get_value_using_name($(form),'measuring_unit')),
          'flooring': get_value_using_name($(form),'flooring'),
          'flooring_other': get_value_using_name($(form),'property_flooring_other'),
          'rent': get_value_using_name($(form),'rent'),
          'advance_rent_of_months': get_value_using_name($(form),'advance_rent_of_months'),
          'other_charges': create_charges_data($(form)),
          'additional_details': get_value_using_name($(form),'additional_details'),
          'images': get_value_using_name($(form),'property_images'),
        }
        show_loading($(form));
        $.ajax({
          'type': 'POST',
          'dataType': 'json',
          'url': window.create_property_url,
          'data': data,
          traditional: true,
        }).done((res)=>{
          $(form).trigger('done',res);
        }).fail((data)=>{
          display_errors(data, form);
        }).always(()=>{
          remove_loading(form);
        })
      }
    }
  });
}

function get_property_edit_form_html(data){
  return `
  <form class="modal fade" id="modalPropertyAdEditForm" 
  data-backdrop="static" tabindex="-1" role="dialog" 
  aria-labelledby="myModalLabel" aria-hidden="true"
  novalidate>
    <div class="modal-dialog full-width modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 class="modal-title w-100 font-weight-bold">Rent Your Property</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mx-3 row">
          <div class="md-form mb-4 col-12 m-5px" style="margin-top: 1rem!important">
            <i class="fa fa-tag prefix grey-text"></i>
            <input type="text" name="title"
              value="${data.title}"
              id="edit_property_title" class="form-control" length="70">
            <label for="edit_property_title">Title</label>
          </div>

          <div class="group-heading mb-4">General details</div>
          <div class="mb-4 col-12 col-lg-10 m-5px">
            <select name="region" id="edit_property_region"
            data-placeholder="Search location">
              <option value="${data.region.id}" selected="selected">
                ${data.region.name}
              </option>
            </select>
            <label for="edit_property_region">Location</label>
          </div>
          <div class="md-form mt-0 mb-4" role="group" aria-label="Basic example">
            <input type="text" name="address" 
              id="edit_property_address" 
              class="form-control"
              value="${data.address}"
              id="edit_property_location" 
              placeholder="Type address or use current location" 
              aria-label="location name" 
              aria-describedby="current-location">
            <label for="edit_property_address">Address</label>
            <div>
              <button class="input-group-text btn bg-one btn-primary btn-sm" 
                onclick="getCurrentLocation(event,'edit_property_address')" 
                id="edit-current-location">
                <i class="fa fa-map-marker mr-1"></i>
                Use current location</button>
            </div>
          </div>
          <input type="hidden" name="property_latlng"
            value="${data.latlng}"
            id="edit_property_latlng">
          <div class="md-form mb-4 col-12 col-md-6 m-5px">
            <i class="fa fa-calendar prefix grey-text"></i>
            <input type="text" name="available_from" id="edit_property_available_from" 
            class="form-control" value="${data.available_from}" required>
            <label for="edit_property_available_from">Date of availability</label>
            <div id="edit_datepicker-container"></div>
          </div>
          <div class="col-12 mb-4 col-md-6 m-5px">
            <select name="total_floors" id="edit_property_total_floors">
              <option value="">Choose total floors</option>
            </select>
            <label for="edit_property_total_floors">Total floors</label>
          </div>
          <div class="col-12 mb-4 col-md-6 m-5px">
            <select name="floor_no" id="edit_property_floor_no">
              <option value="">Choose floor number</option>
            </select>
            <label for="edit_property_floor_no">Floor number</label>
          </div>
          
          <div class="group-heading mb-4">Property details</div>
          <div class="mb-4 col-12 col-md-6 m-5px">
            <select name="lodging_type" id="edit_property_type" 
              data-target="other" data-label="Property type">
              <option value="">Choose type</option>
              <option value="F">Flat</option>
              <option value="H">House</option>
              <option value="P">Paying guest</option>
              <option value="R">Room(s)</option>
              <option value="O">Other</option>
            </select>
            <label for="edit_property_type">Type</label>
          </div>
          <div class="mb-4 col-12 col-md-6 m-5px">
            <select name="furnishing" id="edit_property_furnishing">
              <option value="">Choose furnishing</option>
              <option value="F">Fully Furnished</option>
              <option value="S">Semi-Furnished</option>
              <option value="U">UnFurnished</option>
            </select>
            <label for="edit_property_furnishing">Furnishing</label>
          </div>
          <div class="mb-4 col-12 col-md-6 m-5px">
            <select name="facilities" id="edit_property_facilities" 
              multiple="multiple" data-placeholder="Select facilities">
              <option value="A">Air conditioner</option>
              <option value="P">Parking</option>
              <option value="K">Kitchen</option>
            </select>
            <label for="edit_property_facilities">Facilities</label>
          </div>
          <div class="col-12 mb-4 col-md-6 m-5px">
            <select name="bathrooms" id="edit_property_bathrooms">
              <option value="">Choose total bathrooms</option>
            </select>
            <label for="edit_poperty_bathrooms">Total Bathrooms</label>
          </div>
          <div class="col-12 mb-4 col-md-6 m-5px">
            <select name="balconies" id="edit_property_balconies">
              <option value="">Choose total balconies</option>
            </select>
            <label for="edit_property_balconies">Total Balconies</label>
          </div>
          <div class="col-12 mb-4 col-md-6 m-5px">
            <select name="rooms" id="edit_property_rooms">
              <option value="">Choose total rooms</option>
            </select>
            <label for="edit_property_rooms">Total Rooms</label>
          </div>
          <div class="col-12 mb-4 col-md-6 m-5px">
            <select name="halls" id="edit_property_halls">
              <option value="">Choose total halls</option>
            </select>
            <label for="edit_property_halss">Total Halls</label>
          </div>
          <div class="input-group md-form mb-4 col-12 col-md-8 m-5px" 
            role="group" aria-label="Area with unit" required>
            <label for="edit_property_area" style="top: 0">Area (built up)</label>
            <input type="text" 
            value="${data.area}"
            name="area" id="edit_property_area" 
            class="form-control p-0">
            <span class="input-group-append" style="width:110px">
              <select name="measuring_unit" style="width:100%" 
              id="edit_property_measuring_unit">
                <option value="">Choose unit</option>
              </select>
            </span>
          </div>
          <div class="mb-4 col-12 col-md-6 m-5px">
            <select name="flooring" id="edit_property_flooring" 
              data-target="other" data-label="Flooring type">
              <option value="">Choose flooring type</option>
            </select>
            <label for="edit_property_flooring">Flooring</label>
          </div>
          
          <div class="group-heading mb-4">Rent details</div>
          <div class="md-form col-12 col-md-6 m-5px">
              <i class="fa fa-inr prefix grey-text"></i>
              <input type="text" 
              value="${data.rent}"
              name="rent" id="edit_property_rent" 
              class="form-control" required>
              <label for="edit_property_rent">Rent (per month)</label>
          </div>
          <div class="md-form col-12 col-md-6 m-5px">
            <input type="number" name="advance_rent_of_months" 
            value="${data.advance_rent_of_months}"
            id="edit_property_advance_of_months" min="1" 
            class="form-control" required>
            <label for="edit_property_advance_of_months">
              Advance rent of months</label>
          </div>
          <div class="col-12 mb-4 mt-0">
            <button class="btn btn-primary btn-sm bg-one" 
              onclick="create_charge_form(event,'edit_property')" 
              id="edit_other_charges_button">
              Add more charges
            </button>
            <input type="hidden" name="other_charges">
          </div>
          
          <div class="group-heading mb-4">Additional details</div>
          <div class="md-form m-5px" style="margin-top: 1rem!important">
            <i class="fa fa-pencil prefix grey-text"></i>
            <textarea rows="3" length="1000" 
            value="${data.additional_details}"
            placeholder="e.g. It has three rooms, two bathrooms, one kitchen. It is fully furnished."
            class="md-textarea form-control" name="additional_details" 
            id="property_additional_details"></textarea>
            <label for="property_additional_details">Additional details</label>
          </div>
        
          <div class="group-heading">Images</div>
          <select name="property_images" 
          hidden="true" id="property_images" 
          multiple="mutiple"></select>
          <div class="form-row">
            <div class="col-12">
              <span class='btn btn-md btn-default text-white ml-0 mt-3 bg-one'
                name="add_image"
                id="property_add_image">
                <i class="fa fa-file-image-o icon"></i> Add image</span>
            </div>
          </div>
          <input type="hidden" name="images">
          
        </div>
        <div class="modal-footer">
          <div class="text-center col-12 mt-4">
            <button class="btn color-2" type="submit">Post</button>
            <button class="red white-text btn"
            type="delete"
            onclick="delete_form(event)">
            Delete</button>
          </div>
        </div>
      </div>
    </div>
  </form>`;
}

function show_modal(id){
  $(id).modal('show');
}

function show_property_edit_form(data){
  $('body').append(get_property_edit_form_html(data));
  var $form = $('#modalPropertyAdEditForm');
  show_modal('#modalPropertyAdEditForm');
  create_options_for_property_form_fields($form);
  select_option($form,data)
  initialize_region_selectize($form);
  initialize_facilities_selectize($form);
  initialize_all_selects($form);
}

function edit_form_validation(){
  var $form = $('#modalPropertyAdEditForm');
  $form.on('done',function(data){
    toastr.success('Information updated successfully','Saved');
  });
  profile_form_validation($form);
}

function set_reset_button_toggle($form){
  var $reset = $form.find('button[type=reset]').first();
  var filled=$form.find('input:filled,select:filled,textarea:filled').length;
  if(filled==0){
    $reset.attr('disabled','true');
  }
  $form.find('input,select,textarea').each(function(){
    $(this).on('change',function(){
      var filled=$form.find('input:filled,select:filled,textarea:filled').length;
      if(filled==0){
        $reset.attr('disabled','true');
      } else {
        $reset.removeAttr('disabled');
      }
    });
  });
}

function property_ad_form_validation(){
  var $form = $('#modalPropertyAdForm');
  $form.on('done',function(data){
    toastr.success('New post added','Success');
    reset_form($form,true);
  });
  property_form_validation($form);
  set_reset_button_toggle($form);
}

function set_password_form_validation(){
    var form =  $('#modalSetPasswordForm');
    var setPasswordFormValidator = form.validate({
        rules: {
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
                }
                var url = API_PREFIX + 'account/reset-password/';
                show_loading(form);
                $.ajax({
                    'type':'POST',
                    'dataType':'json',
                    'url': url,
                    'data': data,
                }).always((data)=>{
                    if(data.status=='200'){
                        display_message(form,'Password re-set successfully.');
                        setTimeout(()=>{
                            $('#modalSetPasswordForm').modal('hide');
                            $('#modalLoginForm').modal('show');
                        },1000);
                    } else {
                        display_errors(data,form);
                    }
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
                }).always((data)=>{
                    if(data.status=='200'){
                        display_message(form,'Password changed successfully.');
                        setTimeout(()=>{
                            $('#modalSetPasswordForm').modal('hide');
                        },1000);
                    } else {
                        display_errors(data,form);
                    }
                    remove_loading(form);
                });
            }
        }
    });
}

function profile_form_validation(){
    var form =  $('#modalUserProfileForm');
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
                }).always((data)=>{
                    if(data.status=='200'){
                        display_message(form,'Profile Saved.');
                    } else {
                        display_errors(data,form);
                    }
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
    jQuery.validator.addMethod('less_than_total_floors',function(value,element){
      return $(element).val()<=$('#property_total_floors').val();
    },'Floor number cannot be greater than total floors.');
}

function write_character_count(this_,length,span){
  var written = $(this_).val().length;
  $(span).text(written+'/'+length);
}

function set_character_count(){
    $('input[length],textarea[length]').focusin(function(){
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

    $('input[length],textarea[length]').focusout(function(){
      $(this).parent().children('.character-counter').remove()
    });
}

function set_footer(){
    var offset = $('footer').offset();
    var windowHeight = $(window).height();
    if(offset.top<windowHeight){
        $('footer').css({'position': 'relative','top':windowHeight-offset.top,'width':'100%'});
    }
    var height = $('#center').height();
    $('#center').css({'margin-top':(windowHeight/2-height/2-$('body').css('padding-top'))+'px'});
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

function set_logout(){
    $('[data-action=logout]').click(function(){
      show_loading();
      $.ajax({
        type: 'POST',
        url: window['API_PREFIX'] + 'account/logout/',
        data: {
          empty: ''
        }
      }).always((data)=>{
        remove_loading();
        toastr.success('Success!','Logged out');
        setTimeout(function(){
          window.location.reload();
        },0);
      });
    });
}

function create_options(min_val,max_val,j_el){
  for(var i=min_val;i<=max_val;i++){
      var option = document.createElement('option');
      $(option).val(i);
      $(option).text(i);
      j_el.append(option);
  }
}

function create_options_from_array(j_el,text,value){
  for(var i in text){
    var option = document.createElement('option');
    $(option).val(value[i]);
    $(option).text(text[i]);
    j_el.append(option);
  }
}

function Modal(id,title){
  this.modal = document.createElement('div');
  this.modal_dialog = document.createElement('div');
  this. modal_content = document.createElement('div');
  this.modal_header = document.createElement('div');
  this.modal.className = 'modal fade';
  this.modal.id = id;
  $(this.modal).attr('data-backdrop','static')
  this.modal_dialog.className = 'modal-dialog';
  this.modal_content.className = 'modal-content';
  this.modal_header.className = 'modal-header';
  this.modal_title = document.createElement('h5');
  this.modal_title.className = 'modal-title';
  $(this.modal_title).text(title);
  $(this.modal_header).append(this.modal_title);
  $(this.modal_header).append(`
  <button type="button" class="close" 
    data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`);
  this.modal_body = document.createElement('div');
  this.modal_body.className = 'modal-body minh-500';
  this.modal_footer = document.createElement('div');
  this.modal_footer.className = 'modal-footer';
  $(this.modal).append(this.modal_dialog);
  $(this.modal_dialog).append(this.modal_content);
  $(this.modal_content).append(this.modal_header)
  .append(this.modal_body)
  .append(this.modal_footer);
}

Modal.prototype = {
  constructor: Modal,
  replace_title: function (title){
    $(this.modal_title).text(title);
  },
  replace_body: function (body) {
    $(this.modal_body).html(body);
  },
  append_to_body: function (html){
    $(this.modal_body).append(html);
  },
  get_modal: function (){
    return this.modal;
  },
  append_to_footer: function(html){
    $(this.modal_footer).append(html);
  },
  replace_footer: function(footer){
    $(this.modal_footer).html(footer);
  },
  show: function(){
    $(this.modal).modal('show');
  },
  add_class: function(_class){
    $(this.modal).addClass(_class);
  },
  add_class_to_dialog: function(_class){
    $(this.modal_dialog).addClass(_class);
  },
  remove_on_close: function(){
    $(this.modal).on('hidden.bs.modal',()=>{
      $(this.modal).remove();
    });
  }
}

function AdLink(text,icon) {
  this.link_container = this.details = document.createElement('div');
  this.link_container.className = 'col';
  this.link_icon = document.createElement('i');
  this.link_icon.className = icon;
  $(this.link_container).append(this.link_icon).append('&nbsp;'+text);
}

AdLink.prototype = {
  constructor: AdLink,
  get_ad_link: function(){
    return this.link_container;
  },
  add_click_event: function(func,arg){
    $(this.link_container).click(function(){
      func(arg);
    })
  }
}

function AdLinks(ad) {
  this.container = document.createElement('div');
  this.container.className = 'row m-0 links';
  if(ad.images.length>0) {
    this.zoom = new AdLink('Zoom','fa fa-search-plus');
    $(this.container).append(this.zoom.get_ad_link());
  }
  this.view_details = new AdLink('View Details','fa fa-external-link');
  this.view_details.add_click_event(redirect_to_ad_detail_view,ad.id)
  $(this.container).append(this.view_details.get_ad_link());
}

AdLinks.prototype = {
  constructor: AdLinks,
  get_ad_links: function(){
    return this.container;
  }
}

function AdDetailItem(text,icon,value){
  this.li = document.createElement('li');
  this.li.className = 'col p-0 white-text';
  this.text_container = document.createElement('div');
  this.text_container.className = 'light-brown-text';
  this.text = document.createElement('small');
  this.value_container = document.createElement('div');
  this.value_icon = document.createElement('i');
  this.value_icon.className = icon+' pr-1';
  if(text=='Rent'){
    $(this.value_container).append(this.value_icon)
    .append(value);
    this.text.innerText = text;
  } else {
    $(this.value_container).append(value);
    $(this.text).append(this.value_icon)
    .append(text);
  }
  $(this.text_container).append(this.text);
  $(this.li).append(this.text_container)
  .append(this.value_container);
}

AdDetailItem.prototype = {
  constructor: AdDetailItem,
  get_ad_detail_item: function(){
    return this.li;
  }
}

function AdDetails(ad){
  this.container = document.createElement('div');
  this.container.className = 'rounded-bottom mdb-color lighten-3 text-center pt-3';
  $(this.container).css('height','fit-content');
  this.ul = document.createElement('ul');
  this.ul.className='list-unstyled row p-0 ml-0 mr-0 font-small';
  this.rent = new AdDetailItem('Rent','fa fa-inr',ad.rent);
  if(ad.lodging_type=='O'){
    this.type = new AdDetailItem('Type','fa fa-home',ad.lodging_type_other);
  } else {
    this.type = new AdDetailItem('Type','fa fa-home',type_full_form(ad.lodging_type));
  }
  this.available_from = new AdDetailItem('Available from','fa fa-clock-o',ad.available_from);
  $(this.container).append(this.ul);
  $(this.ul).append(this.rent.get_ad_detail_item())
  .append(this.type.get_ad_detail_item())
  .append(this.available_from.get_ad_detail_item());
}

AdDetails.prototype = {
  constructor: AdDetails,
  get_ad_details: function(){
    return this.container;
  }
}

function Card(){
  this.card = document.createElement('div');
  this.card.className = 'card mb-3';
  this.card_body = document.createElement('div');
  this.card_body.className = 'card-body p-0';
  this.card_footer = document.createElement('div');
  this.card_footer.className = 'card-footer';
  this.card_title = document.createElement('h4');
  this.card_title.className = 'card-title';
  $(this.card).append(this.card_body);
  // .append(this.card_footer);
  // $(this.card_body).append(this.card_title);
}

Card.prototype = {
  constructor: Card,
  append_to_title: function(html){
    $(this.card_title).append(html);
  },
  replace_title: function(html){
    $(this.card_title).html(html);
  },
  append_to_body: function(html){
    $(this.card_body).append(html);
  },
  replace_body:function(html){
    $(this.card_body).html(html);
  },
  append_to_footer: function(html){
    $(this.card_footer).append(html);
  },
  replace_footer:function(html){
    $(this.card_footer).html(html);
  },
  add_classes: function(classes){
    $(this.card).addClass(classes);
  },
  add_carousel: function (carousel) {
    if($(this.card).children('img').length>0){
      throw('Card image is already appended.')
    }
    $(this.card).prepend(carousel);
  },
  add_image: function (image){
    if($(this.card).children('.carousel').length>0){
      throw('Card carousel is already appended.')
    }
    $(this.card).prepend(image);
  },
  get_card: function(){
    return this.card;
  }
}

function CarouselIndicator(id,slide_to) {
  this.indicator = document.createElement('li');
  $(this.indicator).attr('data-target',id);
  $(this.indicator).attr('data-slide-to',slide_to);
  if(slide_to==0){
    this.indicator.className='active';
  }
}

CarouselIndicator.prototype = {
  constructor: CarouselIndicator,
  get_indicator: function(){
    return this.indicator;
  }
}

function CarouselItem(i,image){
  this.item = document.createElement('div');
  this.item.className = 'carousel-item';
  if(i==0){
    this.item.className = 'carousel-item active';
  } else {
    this.item.className = 'carousel-item';
  }
  this.img_element = new ImageCard(image.image_thumbnail,image.tag,i);
  this.caption = document.createElement('div');
  this.caption.className = 'carousel-caption';
  $(this.caption).text(Tags.get_tag_text(image.tag));
  $(this.item).append(this.img_element.get_image())
  .append(this.caption);
}

CarouselItem.prototype = {
  constructor: CarouselItem,
  get_item: function(){
    return this.item;
  }
}

function CarouselControl(id){
  this.control = document.createElement('a');
  this.icon = document.createElement('span');
  this.sr_only = document.createElement('span');
  $(this.control).attr('href','#'+id);
  $(this.control).attr('role','button');
  this.icon.className = 'carousel-control';
  $(this.icon).attr('aria-hidden','true');
  this.sr_only.className='sr-only';
  $(this.control).append(this.icon)
  .append(this.sr_only);
}

CarouselControl.prototype = {
  constructor: CarouselControl,
  get_control: function(){
    return this.control;
  }
}

function CarouselControlNext(id){
  CarouselControl.call(this,id);
  this.control.className = 'carousel-control-next';
  $(this.control).attr('data-slide','next');
  $(this.icon).addClass('fa fa-chevron-right');
  $(this.sr_only).text('Next');
}
CarouselControlNext.prototype = Object.create(CarouselControl.prototype);
CarouselControlNext.prototype.constructor = CarouselControlNext;

function CarouselControlPrev(id){
  CarouselControl.call(this,id);
  this.control.className = 'carousel-control-prev';
  $(this.control).attr('data-slide','prev');
  $(this.icon).addClass('fa fa-chevron-left');
  $(this.sr_only).text('Prev');
}
CarouselControlPrev.prototype = Object.create(CarouselControl.prototype);
CarouselControlPrev.prototype.constructor = CarouselControlPrev;

function Carousel(id,images){
  this.carousel = document.createElement('div');
  this.carousel_inner = document.createElement('div');
  this.carousel_indicators = document.createElement('ol');
  this.next_control = new CarouselControlNext(id);
  this.prev_control = new CarouselControlPrev(id);
  $(this.carousel).attr('id',id);
  $(this.carousel).attr('data-pause','true');
  this.carousel.className = "carousel slide carousel-fade";
  $(this.carousel).attr('data-ride',"false");
  this.carousel_indicators.className = "carousel-indicators";
  this.carousel_inner.className = 'carousel-inner';
  $(this.carousel).append(this.carousel_indicators)
  .append(this.carousel_inner)
  if(images.length>0){
    $(this.carousel).append(this.next_control.get_control())
    .append(this.prev_control.get_control());
  }

  for(var i in images){
    this.add_indicator(id,i);
    this.add_item(i,images[i]);
  }

  $(this.carousel).on('slide.bs.carousel',function(event){
    var $img = $(event.relatedTarget).children().children('img');
    if($img.attr('data-src')){
      $img.attr('src',$img.attr('data-src'));
    }
  })
}

Carousel.prototype = {
  constructor: Carousel,
  add_indicator : function(id,i) {
    var indicator = new CarouselIndicator(id,i);
    this.carousel_indicators.append(indicator.get_indicator());
  },
  add_item: function(i,image) {
    this.item = new CarouselItem(i,image);
    this.carousel_inner.append(this.item.get_item());
  },
  get_carousel: function(){
    return this.carousel;
  }
}

function Image(src,alt,index=0){
  this.img = document.createElement('img');
  $(this.img).attr('alt',alt);
  if(index>0){
    $(this.img).attr('data-src',src);
    $(this.img).attr('src',window.STATIC_URL+'images/');
  } else {
    $(this.img).attr('src',src);
  }
}

Image.prototype = {
  constructor: Image,
  get_image: function(){
    return this.img;
  },
  set_src: function(src) {
    $(this.img).attr('src',src);
  },
  set_data_src: function(src) {
    $(this.img).attr('data-src',src);
  },
}

function ImageCard(src=null,alt=null,index=null){
  if(!src){
    Image.call(this,window.STATIC_URL+'images/No-image-available.jpg','no image available');
  } else {
    Image.call(this,src,alt,index);
  }
  $(this.img).addClass('d-block');
  this.img_cover = document.createElement('div');
  this.img_cover.className = 'view card-img-top justify-content-center minh-200 align-items-center d-flex';
  $(this.img_cover).append(this.img);
}
ImageCard.prototype = Object.create(Image.prototype);
ImageCard.prototype.constructor = ImageCard;
ImageCard.prototype.get_image = function(){
  return this.img_cover;
}

function MyAd(ad){
  this.card = new Card();
  this.card.add_classes('w-270 p-0');
  if(ad.images.length==0){
    this.image = new ImageCard();
    this.card.add_image(this.image.get_image());
  } else {
    this.carousel = new Carousel('my_ad_'+ad.id,ad.images);
    this.card.add_carousel(this.carousel.get_carousel());
  }
  this.ad_details = new AdDetails(ad);
  this.ad_links = new AdLinks(ad);
  this.card.append_to_body(this.ad_links.get_ad_links());
  this.card.append_to_body(this.ad_details.get_ad_details());
}

MyAd.prototype = {
  constructor: MyAd,
  get_my_ad: function(){
    return this.card.get_card();
  }
}

function MyAds(ads) {
  this.modal = new Modal('myAdsModal','My Ads');
  this.modal.add_class_to_dialog('modal-lg');
  for(var ad of ads) {
    var ad = new MyAd(ad);
    this.modal.append_to_body(ad.get_my_ad());
  }
  this.modal.show();
  show_loading(this.modal.get_modal());
  this.modal.remove_on_close();
  var $grid = $(this.modal.modal_body).masonry({
    // itemSelector: '',
    columnWidth: 270,
    gutter: 20,
  });
  $grid.imagesLoaded().progress( () => {
    $grid.masonry('layout');
    setTimeout(function(){
      $grid.masonry('layout');
    },2000);
    remove_loading(this.modal.get_modal());
  });
}

function get_my_ads(){
  $.ajax({
    url: window.my_ads_url,
    beforeSend: function(){
      show_loading();
    }
  }).done(function(res){
    var myAds = new MyAds(JSON.parse(res.data));
  }).fail(function(){
    toastr.error("Unable to get your ads","Error");
  }).always(function(){
    remove_loading();
  });
}

function initialize_editable(id,_this,obj={},callback=()=>{}){
  var options = {
    type: 'select',
    pk: id,
    url: window.tag_url,
    title: 'Choose tag',
    source: Tags.get_tags(),
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
  $(select).append(`<option value="${obj.value}" selected="selected" data-tag="${obj.tag}">${obj.url}</option>`);
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

function get_image_id(form=null){
  if(form){
    if(form[0].id=='modalPropertyAdForm'){
      return '#property_images';
    }
  }
  var image_id='#id_images';
  if(window.prefix){
    image_id='#'+window.prefix+'_images';
  }
  return image_id;
}

var loadImageFile = function (event,url=window.roomie_image_url,_type='') {
  var file = event.target;

  //check and retuns the length of uploded file.
  if (file.files.length === 0) {
    return;
  }

  var filterType = /^(?:image\/gif|image\/jpeg|image\/jpeg|image\/jpeg|image\/png|image\/svg\+xml|image\/x\-icon|image\/x\-rgb)$/i;

  //Is Used for validate a valid file.
  var uploadFile = file.files[0];
  if (!filterType.test(uploadFile.type)) {
    alert("Please select a valid image.");
    return;
  }

  var loading_icon = document.createElement('span');
  $(loading_icon).append(`&nbsp;<i class="fa fa-spinner fa-spin"></i>`)
  $(file).prev('span').filter(function(){
    return this.id.match(/add_image$/);
  }).append(loading_icon);

  var div = document.createElement('div');
  div.className="progress";
  var progress_bar = document.createElement('div');
  progress_bar.className="progress-bar orange darken-3 progress-bar-striped progress-bar-animated";
  $(div).append(progress_bar);
  $(file).after(div);

  var fileReader = new FileReader();
  var max_width = 2000;
  var max_height = 2000;

  fileReader.readAsDataURL(uploadFile);

  fileReader.onload = function (event) {
    var image = new Image();
    image.onload = function () {
      setTimeout(()=>{
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
        var dataURL = canvas.toDataURL('image/jpeg');
        if (url == window.image_url) {
          max_height = 1000;
          max_width = 1000;
        }
        $.ajax({
          type: 'POST',
          url: url,
          data: {
            'image': dataURL,
          },
          progress: function(e){
            if(e.lengthComputable) {
              var pct = (e.loaded / e.total) * 100;
              $(progress_bar).css('width',pct+'%');
              $(progress_bar).text(parseInt(pct)+'%');
            } else {
              console.error('Content length not reported');
            }
          }
        }).done(function (res) {
          toastr.success('Success!',"Image Uploaded",);
          if (_type == 'profile') {
            $('#profile').trigger('profile-updated', [res.id, res.url]);
            return;
          } else {
            create_modal_to_add_tag(res);
          }
        }).fail(function (err) {
          $(file).after(`<div class="error">${err}</div>`);
        }).always(function (data) {
          $(loading_icon).remove();
          $(div).remove();
          if(_type!='profile'){
            $(file).remove();
          } else {
            $(file).val('');
          }
          // console.log(data);
        });
      },1);
    }
    image.src = event.target.result;
  };
}

function set_prefix(id){
  var arr=id.split('_');
  var prefix=null;
  if(arr.length>2){
    prefix = arr.slice(0,-2).join('_');
  }
  return prefix;
}

function enable_add_image(){
  $('span').filter(function(){
    return this.id.match(/add_image$/);
  }).click(function(){
    var name = this.id+'_file';
    var id = "id_"+name;
    set_prefix(this.id);
    $('#'+id).remove();
    $(this).after(`<input type="file" id=${id} name=${name} onchange="loadImageFile(event)" class="d-none">`);
    var $file_input = $('#'+id);
    $file_input[0].click();
  });
}

function formToString(filledForm,select_ids) {
  formObject = new Object;
  filledForm.find("input, select, textarea").each(function() {
    var id=this.id;
    if (this.id) {
      $elem = $(this);
      if(select_ids.includes(this.id)){
        list = [];
        $(this).find('option[selected]').each(function(){
          list.push($('#'+id)[0].selectize.options[$(this).val()]);
        });
        formObject[this.id] = list;
      } else if(this.id.match(/_images$/)){
        var obj=[];
        $(this).find('option[selected]').each(function(){
          obj.push({
            value: $(this).val(),
            url: $(this).text(),
            tag: $(this).attr('data-tag'),
          });
        });
        formObject[this.id]=obj;
      }
      else {
        if ($elem.attr("type") == 'checkbox' || $elem.attr("type") == 'radio') {
          formObject[this.id] = $elem.is(":checked");
        } else {
          formObject[this.id] = $elem.val();
        }
      }
    }
  });
  formString = JSON.stringify(formObject);
  toastr.success('Form has been saved');
  return formString;
}

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
  }).fail((res)=>{
    toastr.error('Error!',res);
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

function create_images_container(id) {  
  var div = document.createElement('div');
  div.id = id+'_contain';
  div.className = 'images_container';
  return div;
}

function stringToForm(formString, unfilledForm, select_ids) {
  if(!formString){
    return;
  }
  formObject = JSON.parse(formString);
  unfilledForm.find("input, select, textarea").each(function() {
      if (this.id) {
        var id = this.id;
        var $elem = $(this);
        if(select_ids.includes(id)){
          var items = formObject[id];
          for(var i in items){
            if(items[i]){
              $('#'+id)[0].selectize.addOption(items[i]);
              $('#'+id)[0].selectize.addItem(items[i].id);
            }
          }          
        } else if(id.match(/_images$/)){
          if(formObject[id].length>0){
            var div = create_images_container(id);
            $(this).after(div);
            for(var i in formObject[id]){
              var obj=formObject[id][i];
              try {throw obj}
              catch(newObj){
                add_image_to_container(div,newObj,unfilledForm,this);
              }
            }
            $(this).after('<div class="w-100 images-added-heading">Images added by you</div>');
          }
        }
        else {
          if ($elem.attr("type") == "checkbox" || $elem.attr("type") == "radio" ) {
            $elem.prop("checked", !!formObject[id]);
          } else {
            $elem.val(formObject[id]).trigger('change');
            if($elem[0].selectize){
              if(formObject[id] && formObject[id].constructor === Array){
                for(var i in formObject[id]){
                  $elem[0].selectize.addItem(formObject[id][i]);
                }
              } else {
                $elem[0].selectize.addItem(formObject[id]);
              }
            }
          }
        }
      }
  });

  if(unfilledForm.attr('id')=='modalPropertyAdForm'){
    $el = $('#other_charges_button');
    var htmlString=localStorage.getItem('property_other_charges');
    if(!htmlString){
      return
    }
    var htmlList=JSON.parse(htmlString);
    if(!htmlList || htmlList.constructor!==Array){
      return
    }
    for(var html of htmlList){
      $el.parent().before(html);
      charge_form_id++;
      $el.parent().prev().find('input,checkbox').each(function(){
        if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio" ){
          $(this).prop('checked',!!formObject[this.id]);
        } else {
          $(this).val(formObject[this.id]).trigger('change');
        }
      });
    }
  }
}

function resend_otp(){
  var form = $('#modalVerifyNumberForm');
  var data;
  if(mobile_number!=""){
    data = {
      mobile_number: mobile_number,
    }
  } else {
    data = {
      mobile_number: $('#enter_mobile_number').val(),
    }
  }
  var url = API_PREFIX + 'account/request-otp/';
  show_loading(form);
  $.ajax({
    'type':'POST',
    'dataType':'json',
    'url': url,
    'data': data,
  }).done((data)=>{
    display_message(form,'OTP has been resent.');
  }).fail((data)=>{
    display_errors(data,form);
  }).always((data)=>{
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

function reset_form($form){
  var form_id=$form.attr('id');
  var data=localStorage.getItem(form_id);
  $form.find('input,textarea').each(function(){
    $(this).val('');
  });
  $form.find('select:hidden').each(function(){
    if(this.selectize){
      this.selectize.clear();
    }
  });
  localStorage.removeItem(form_id);
  if(form_id=='modalPropertyAdForm'){
    localStorage.removeItem('property_other_charges');
    localStorage.removeItem('property_other_charges_fields');
  }
  if($form.validate().resetForm){
    $form.validate().resetForm();
  }
  toastr.success('Success!',"Form has been reset");
}

function hard_reset_form(event){
  event.preventDefault();
  var $form=get_form(event.target);
  var form_id=$form.attr('id');
  var data=localStorage.getItem(form_id);
  var imageList;
  if(data && JSON.parse(data).constructor==Object) {
    data=JSON.parse(data);
    if(form_id=='modalPropertyAdForm'){
      imageList=data['property_images'];
    } else {
      imageList=data['id_images'];
    }
    for(var image of imageList){
      send_image_delete_request(event,image.value,$form);
    }
  }
  reset_form($form);
}

function confirm_reset_form(event){
  event.preventDefault();
  $.confirm({
    title: "Are you sure you want to reset form?",
    text: "All data will be deleted permanently.",
    confirm: function(){
      hard_reset_form(event);
    }
  });
}

function initialize_region_selectize($form){
  $form.find('[name=region]').first().selectize(
    get_selectize_configurations('property',false)
  );
}

function initialize_facilities_selectize($form){
  $form.find('[name=facilities]').first().selectize({
    plugins: ['remove_button'],
    copyClassesToDropdown: false,
  });
}

function initialize_all_selects($form=null){
  var selector = 'select:not([hidden=true])';
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

function initialize_form_selectize(){
  $(document).on('initialize_form_selectize',function(){
    $('#roomie_regions').selectize(get_selectize_configurations('roomie'));
    initialize_region_selectize($('#modalPropertyAdForm'));
    initialize_facilities_selectize($('#modalPropertyAdForm'));
    initialize_all_selects();
    initialize_auto_save('modalPropertyAdForm',['property_region']);
    initialize_auto_save('modalRoomieAdForm',['roomie_regions']);
  });
}

function display_full_screen_carousel(ad_images,rent,location,type,available_from,title,images_tag){
  $('#full_screen_carousel_modal').remove();
  var carousel = `
    <div class="modal fade full_screen" id="full_screen_carousel_modal"  tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="full_screen_carousel_modal-title">
            <small>1/${images_tag.length}</small> ${images_tag[0]}
            </h4>
            <div class="zoom-container">
              <i class="fa fa-search-plus" id="full_screen_carousel_zoom-in"></i>
              <i class="fa fa-search-minus" id="full_screen_carousel_zoom-out"></i>
              <i class="fa fa-refresh" id="full_screen_carousel_reset"></i>
            </div>
            <button type="button" class="close btn btn-danger" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="full_screen_carousel" class="carousel slide carousel-fade carousel-thumbnails" data-ride="false">
              <div class="carousel-inner" role="listbox">
                <div class="carousel-item active">
                  <div class="view d-flex align-items-center justify-content-center">
                    <img class="d-block" src="${ad_images[0]}">
                  </div>
                </div>
                `
    for(var i in ad_images){
      if(i>0){
        carousel += `
                <div class="carousel-item">
                  <div class="view d-flex align-items-center justify-content-center minh-800">
                    <img class="d-block" src="${window.loading_icon_big}" data-src="${ad_images[i]}">
                  </div>
                </div>
        `
      }
    }
                `
              </div>
    `
    if(ad_images.length>1){
      carousel += `
            <a class="carousel-control-prev" href="#full_screen_carousel" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#full_screen_carousel" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>`;
    }
    carousel += 
            `<ol class="carousel-indicators">
              <li data-target="#full_screen_carousel" data-slide-to="0" class="active"></li>
              `
    for(var i in ad_images){
      if(i>0){
        carousel += `
              <li data-target="#full_screen_carousel" data-slide-to="0"></li>
        `
      }
    }
              `
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  $('body').append(carousel);
  $('#full_screen_carousel_modal').modal({
    show:true,
  });
  $('#full_screen_carousel').carousel('pause');
  $('#full_screen_carousel').off('slide.bs.carousel');
  var $title = $('#full_screen_carousel_modal').find('.modal-title');
  $('#full_screen_carousel').on('slide.bs.carousel',function(event){
    var $img = $(event.relatedTarget).children().children('img');
    if($img.attr('data-src')){
      $img.attr('src',$img.attr('data-src'));
    }
    $title.html(`<small>${event.to+1}/${images_tag.length}</small> ${images_tag[event.to]}`);
  });
  initialize_panzoom();
}

function initialize_panzoom(){
  var $full_screen_carousel = $('#full_screen_carousel');
  $full_screen_carousel.find('img').panzoom({
    increment: 0.3,
    panOnlyWhenZoomed: true,
    minScale: 1,
    maxScale: 3,
    contain: 'invert',
    // $reset: ,
  });
  $('#full_screen_carousel_zoom-in').click(function(e){
    e.preventDefault();
    $full_screen_carousel.find('.carousel-item.active img').panzoom('zoom');
  });
  $('#full_screen_carousel_zoom-out').click(function(e){
    e.preventDefault();
    var $elem = $full_screen_carousel.find('.carousel-item.active img');
    $elem.panzoom('resetPan');
    $elem.panzoom('zoom',true);
  });
  $('#full_screen_carousel_reset').click(function(e){
    e.preventDefault();
    $full_screen_carousel.find('.carousel-item.active img').panzoom('reset');
  });
}

function set_carousel(){
  $('.carousel').carousel('pause');
  $('.carousel').on('slide.bs.carousel',function(event){
    var $img = $(event.relatedTarget).children().children('img');
    if($img.attr('data-src')){
      $img.attr('src',$img.attr('data-src'));
    }
  });
}

function show_indeterminate_progess(){
  // $(document).ajaxStart(function(){
  //   $('body').append(`
  //     <div id="spinner-container" class="d-flex align-items-center justify-content-center">
  //       <i class="fa fa-spinner fa-spin"></i>
  //     </div>
  //   `);
  //   setTimeout(()=>{},1000);
  // });
  // $(document).ajaxStop(function(){
  //   $('#spinner-container').remove();
  // });
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function select_option($form,data){
  var field_name_list = ['total_floors','floor_no','bathrooms','rooms',
    'halls','balconies','measuring_unit','flooring'];
  for(var name of field_name_list){
    $form.find('[name='+name+']').first().val(data[name]);
  }
}

function get_element_using_selector($form,selector){
  return $form.find(selector).first();
}

function get_element_using_name($form,name){
  return get_element_using_selector($form,'[name='+name+']');
}

function create_options_for_property_form_fields($form){
  create_options(1,20,get_element_using_name($form,'total_floors'));
  create_options(1,20,get_element_using_name($form,'floor_no'));
  create_options(0,6,get_element_using_name($form,'bathrooms'));
  create_options(0,6,get_element_using_name($form,'rooms'));
  create_options(0,6,get_element_using_name($form,'halls'));
  create_options(0,6,get_element_using_name($form,'balconies'));
  create_options_from_array(
    get_element_using_name($form,'measuring_unit'), 
    area_units, conversion_value
  );
  create_options_from_array(get_element_using_name($form,'flooring'),
    ['Marble','Vitrified Tile','Vinyl','Hardwood','Granite',
    'Bamboo','Concrete','Laminate','Linoleum','Tarrazzo','Brick','Other'],
    ['M','VT','V','H','G','B','C','L','LI','T','BR','O']
  );
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
  profile_form_validation();
  roomie_ad_form_validation();
  property_ad_form_validation();
}

function set_enter_number_form(){
  var $enter_mobile_number = $('#modalEnterNumberForm').find('#enter_mobile_number');
  $('[data-action=add-number]').click(function(event){
    event.preventDefault();
    add_number = true;
    mobile_number = $enter_mobile_number.val();
    $enter_mobile_number.val('');
  });
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
    setTimeout(function(){
      $(form).validate().resetForm();
    },2000);
  });
}

$('document').ready(function(){
  
  $(document).ajaxSend(function (event, jqxhr, settings) {
    settings.data += '&csrfmiddlewaretoken=' + window.getCookie('csrftoken');
    if (settings.type == "POST") {
      jqxhr.setRequestHeader('X-CSRFToken', window.getCookie('csrftoken'));
    };
  });

  set_footer();
  $(window).resize(set_footer);

  initialize_form_selectize();
  set_custom_alerts();
  set_character_count();
  set_validations();
  set_disable_submit_button();
  add_tawk_to();
  set_logout();
  set_enter_number_form();
  enable_add_image();

  $('#resend_otp').click(function(){
    resend_otp();
  });

  $('input[name=has_property]').change(function(event){
      if(event.target.value=="False"){
          $('.has_property').addClass('d-none');
          $('.not_has_property').removeClass('d-none');
      } else {
          $('.not_has_property').addClass('d-none');
          $('.has_property').removeClass('d-none');
      }
      $($('#modalRoomieAdForm .modal-body').children('div')[1]).removeClass('d-none');
  });
  initialize_other_select();
  $('#property_available_from').Zebra_DatePicker({
    default_position: 'below',
    show_icon: false,
    open_on_focus: true,
    format: 'd-m-Y',
    direction: [1,30],
    container: $('#datepicker-container'),
    show_clear_date: true,
    show_select_today: true,
    onSelect: function(){
      $('#property_available_from').trigger('change');
    }
  });
  create_options_for_property_form_fields($('#modalPropertyAdForm'));
  $('#upload-image').click(function(e){
    e.preventDefault();
    $('#profile').click();
  });
  $('#upload-image').css({'visibility':'visible'});
  $('#profile').on('profile-updated',function(e,id,url){
    $('#profile-photo').attr('src',url);
    $('#profile-icon').css({'display':'none'});
    $('#profile-photo').css({'display':'block'});
  });
  set_carousel();
  show_indeterminate_progess();

  $('#modalPropertyAdForm').on('hidden.bs.modal',function(){
    $('.modal-backdrop').remove();
  });

  toastr.options.closeButton = true;
  toastr.options.progressBar = true;

  $('.modal').on('hidden.bs.modal',function(){
    remove_all_messages($(this));
  });

  $('.modal').on('show.bs.modal',function(){
    var num_visible_modals = $('.modal.show').length;
    $(this).css('z-index',1050+num_visible_modals);
  });
});
