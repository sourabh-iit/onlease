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
var tagList=[
  {value: '', text: 'Choose tag'},
  {value:'0',text:'Bedroom'},
  {value:'1',text:'Hall'},
  {value:'2',text:'Balcony'},
  {value:'3',text:'Living room'},
  {value:'4',text:'Entrance'},
  {value:'5',text:'Kitchen'},
  {value:'6',text:'Bathroom'},
  {value:'7',text:'Building'},
  {value:'8',text:'Floor'},
  {value:'9',text:'Outside view'},
  {value:'10',text:'Other'},
];
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
        },
        success: function(res){
          $('#property_address').val(res.result[0].formatted_address);
          $('#property_latlng').val(lat+','+lng);
          $('#property_latlng').trigger('change');
          create_and_display_success_message('Location added');
        },
        error: function(res){
          if(res.responseJSON && errors in res.responseJSON && '__all__' in res.responseJSON){
            create_and_display_error_message(res.responseJSON.errors['__all__'][0]);
          }
          display_errors(res,$('#modalPropertyAdForm'));
        },
        complete: function(){
          $el.children('#spinner').remove();
          loadingLocation = false;
        }
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

function create_charge_form(event,prefix){
  event.preventDefault();
  var el=event.target;
  var other_charge_form=`
  <div class="row col-12 w-100 mt-3 other_charges_container">
    <div class="md-form col-12 col-md-4 p-1">
      <i class="fa fa-inr prefix grey-text"></i>
      <input type="text" id="${prefix}_charge_amount_${charge_form_id}" class="form-control" data-id="${prefix}_charge_amount">
      <label for="${prefix}_charge_amount_${charge_form_id}">Amount</label>
    </div>
    <div class="md-form col-12 col-md-5 p-1">
      <input type="text" id="${prefix}_charge_description_${charge_form_id}" class="form-control" data-id="${prefix}_charge_description">
      <label for="${prefix}_charge_description_${charge_form_id}">Description</label>
    </div>
    <div class="flex-vertical-center col-12 col-md-3 p-0">
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="${prefix}_charge_is_per_month_${charge_form_id}" data-id="${prefix}_charge_is_per_month">
        <label class="custom-control-label" for="${prefix}_charge_is_per_month_${charge_form_id}">Per month</label>
      </div>
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
  $(el).parent().prev().find('input','checkbox').each(function(){
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
  
  charge_form_id++;
}

function get_selectize_configurations(value,remove_button=true){
  var business, items, render={
    option: function (item, escape) {
      var root = `
      <div class="option">
        ${escape(item.region)}, <small class="text-green">${escape(item.state)}</small>`;
      if(item.ads!=undefined && item.ads!=null && item.ads>-1 && value.toLowerCase()=='search'){
        root += `<span class="ads_count badge badge-info">properties: ${escape(item.ads)}</span>`;
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
    plugins: plugins,
  }
}

function remove_all_messages(form){
  $(form).find('.modal-body').find('ul').remove();
  $(form).find('.modal-body').find('div.alert').remove();
}

function display_errors(data,form){
  let errors = {};
  if(data.responseJSON){
    errors = data.responseJSON.errors;
  } else {
    errors['__all__'] = ['unknown error occurred.'];
  }
  remove_all_messages(form);
  create_and_display_error_message(('Error(s) occurred.'))
  var globalErrors = errors['__all__'];
  delete errors['__all__'];
  var validator = $(form).validate();
  validator.showErrors(errors);
  var ul = document.createElement('ul');
  ul.className = "p-0";
  ul.style.listStyle = 'none';
  for(let error of globalErrors){
    var li = document.createElement('li');
    li.className = "alert alert-danger";
    $(li).html(
      `${error} 
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>`
    );
    ul.append(li);
  }
  $(form).find('.modal-body').prepend(ul);
}

function display_message(form,message){
  remove_all_messages(form);
    var div = document.createElement('div');
    div.className = "alert alert-success";
    $(div).html(message+
        `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>`
    );
    $(form).find('.modal-body').prepend(div);
}

function create_and_display_success_message(message){
    var div = document.createElement('div');
    div.className = "alert alert-success alert-body";
    $(div).html(message+`
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `);
    $(div).delay(3000).fadeOut(function(){
        $(this).remove();
    })
    $('body').append(div);
}

function create_and_display_error_message(message){
    var div = document.createElement('div');
    div.className = "alert alert-danger alert-body";
    $(div).html(message+`
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `);
    $(div).delay(3000).fadeOut(function(){
        $(this).remove();
    })
    $('body').append(div);
}

function login_form_validation(){
    var form = $('#modalLoginForm');
    var loginFormValidator = form.validate({
        rules: {
            username: {
                number_or_email: true,
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
                }).always((data)=>{
                    if(data.status=='200'){
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
                    } else {
                        display_errors(data,form);
                    }
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
                }).always((data)=>{
                    if(data.status=='200'){
                        $('#modalEnterNumberForm').modal('hide');
                        $('#modalVerifyNumberForm').modal('show');
                    } else {
                        display_errors(data,form);
                    }
                    remove_loading(form);
                });
                
            }
        }
    });
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
                }).always((data)=>{
                    if(data.status=='200'){
                        $('#modalVerifyNumberForm').modal('hide');
                        if(set_password){
                            $('#modalSetPasswordForm').modal('show');
                        } else {
                            if(add_number){
                                create_and_display_success_message('Mobile number added.')
                            } else {
                                display_message(form,'Registered successfully.');
                                setTimeout(()=>{
                                    window.location.reload();
                                },1000);
                            }
                        }
                    } else {
                        display_errors(data,form);
                    }
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

function create_charges_data(prefix){
  var $charges_amount=$(`[data-id=${prefix}_charge_amount]`);
  var $charges_description=$(`[data-id=${prefix}_charge_description]`);
  var $charges_is_per_month=$(`[data-id=${prefix}_charge_is_per_month]`);
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


function property_ad_form_validation(){
  var form =  $('#modalPropertyAdForm');
  form.on('show.bs.modal',function(){
      url = window.roomie_image_url;
      height = 2000;
      width = 2000;
  });
  var propertyAdFormValidator = form.validate({
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
          date: true,
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
        type: {
          required: true,
        },
        property_type_other: {
          required: {
            depends: function (element) {
              return $('#property_type option:selected').text().toLowerCase() == 'other';
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
        flooring: {
          required: true,
        },
        property_flooring_other: {
          required: {
            depends: function (element) {
              return $('#property_flooring option:selected').text().toLowerCase() == 'other';
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
        }
      },
      errorPlacement: function(error, element){
        if(element.attr('name')=='property_images') {
          error.css({'margin':'0.5rem 0 0 0','margin-left':'0px',width: '100%'});
          $('#property_add_image').after(error);
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
        propertyAdFormValidator.form();
        if ($(form).valid()) {
          var data = {
            'title': $('#property_title').val(),
            'region': $('#property_region').val(),
            'address': $('#property_address').val(),
            'latlng': $('#property_latlng').val(),
            'available_from': $('#property_available_from').val(),
            'total_floors': $('#property_total_floors').val(),
            'floor_no': $('#property_floor_no').val(),
            'lodging_type': $('#property_type').val(),
            'lodging_type_other': $('#property_type_other').val(),
            'furnishing': $('#property_furnishing').val(),
            'facilities': $('#property_facilities').val(),
            'bathrooms': $('#property_bathrooms').val(),
            'balconies': $('#property_balconies').val(),
            'rooms': $('#property_rooms').val(),
            'halls': $('#property_halls').val(),
            'area': convert_area_to_gaj($('#property_area').val(), $('#property_measuring_unit').val()),
            'flooring': $('#property_flooring').val(),
            'flooring_other': $('#property_other').val(),
            'rent': $('#property_rent').val(),
            'advance_rent_of_months': $('#property_advance_of_months').val(),
            'other_charges': create_charges_data('property'),
            'additional_details': $('#property_additional_details').val(),
            'images': $('#property_images').val(),
          }
          show_loading(form);
          $.ajax({
            'type': 'POST',
            'dataType': 'json',
            'url': window.create_property_url,
            'data': data,
            traditional: true,
            success: function (res) {
              console.log("success");
              create_and_display_success_message('Post added.');
              reset_form(e,true);
            },
            error: function (data) {
              console.log("error")
              display_errors(data, form);
            },
            complete: function (res) {  
              remove_loading(form);
            }
          });
        }
      }
  });
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
                    type_of_roommate: $('#profile_type_of_roommate').val(),
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
        $('footer').css({'position': 'relative','top':windowHeight-offset.top-$('#preloader').height,'width':'100%'});
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
        create_and_display_success_message('Logged out');
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

function initialize_editable(id,_this,obj={},callback=()=>{}){
  var options = {
    type: 'select',
    pk: id,
    url: window.tag_url,
    title: 'Choose tag',
    source: tagList,
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
  $modal.modal('dispose');
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
  progress_bar.className="progress-bar";
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
              $(progress_bar).text(pct+'%');
              debugger
            } else {
              console.error('Content length not reported');
            }
          }
        }).done(function (res) {
          create_and_display_success_message("Image Uploaded");
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
  create_and_display_success_message('saved');
  return formString;
}

function delete_from_localstorage(image_id,$form){
  if(!$form){
    return
  }
  var key = get_image_id($form).slice(1);
  var form_id = $form[0].id;
  var obj = JSON.parse(localStorage.getItem(form_id));
  var index = obj[key].findIndex(element=>element.value==image_id);
  obj[key].splice(index,1);
  localStorage.setItem(form_id, JSON.stringify(obj));
}

function delete_image(event,image_id,$form=null,callback=()=>{}){
  event.preventDefault();
  $.confirm({
    text: 'Are you sure you want to delete this image?',
    confirm: function(){
      $.ajax({
        type: 'POST',
        url: window.delete_image_url,
        data: {
          
          id: image_id,
        },
        success: function(res){
          create_and_display_success_message('Image deleted');
          callback();
        },
        error: function(res){
          create_and_display_error_message(res);
        },
        complete: function(res){
          if(res.status==404 || res.status==200){
            delete_from_localstorage(image_id,$form);
            if($form){
              $(event.target).parent().parent().remove();
            }
          }
        }
      });
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
      $el.parent().prev().find('input','checkbox').each(function(){
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
  }).always((data)=>{
    if(data.status=='200'){
      display_message(form,'OTP has been resent.');
    } else {
      display_errors(data,form);
    }
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

function delete_form(data,form_id,event,$form,post=false){
  if(data && JSON.parse(data).constructor==Object){
    if(!post){
      var imageList;
      data=JSON.parse(data);
      if(form_id=='modalPropertyAdForm'){
        imageList=data['property_images'];
      } else {
        imageList=data['id_images'];
      }
      for(var image_id of imageList){
        delete_image(event,image_id);
      }
    }
    localStorage.removeItem(form_id);
    if(form_id=='modalPropertyAdForm'){
      localStorage.removeItem('property_other_charges');
      localStorage.removeItem('property_other_charges_fields');
    }
    create_and_display_success_message("Form has been reset");
    setTimeout(function(){
      window.location.href="/";
    },2000);
  }
}

function reset_form(event,post=false){
  event.preventDefault();
  var $el=$(event.target);
  var $form=$($el.closest('form')[0]);
  var form_id=$form.attr('id');
  var data=localStorage.getItem(form_id);
  if(!post){
    $.confirm({
      title: "Are you sure you want to reset form?",
      text: "All data will be deleted.",
      confirm: function(){
        delete_form(data,form_id,event,$form);
      }
    });
  } else {
    delete_form(data,form_id,event,$form,post);
  }
}

function initialize_form_selectize(){
  $(document).on('initialize_form_selectize',function(){
    $('#roomie_regions').selectize(get_selectize_configurations('roomie'));
    $('#property_region').selectize(get_selectize_configurations('property',false));
    $('#property_facilities').selectize({
      plugins: ['remove_button'],
      copyClassesToDropdown: false,
    });
    $('select:not([hidden=true])').selectize({
      copyClassesToDropdown: false,
    });
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
                  <div class="view">
                    <img class="d-block w-100" src="${ad_images[0]}">
                  </div>
                </div>
                `
    for(var i in ad_images){
      if(i>0){
        carousel += `
                <div class="carousel-item">
                  <div class="view">
                    <img class="d-block" src="" data-src="${ad_images[i]}">
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

function create_options_for_property_form_fields(){
  create_options(1,20,$('#property_total_floors'));
  create_options(1,20,$('#property_floor_no'));
  create_options(0,6,$('#property_bathrooms'));
  create_options(0,6,$('#property_rooms'));
  create_options(0,6,$('#property_halls'));
  create_options(0,6,$('#property_balconies'));
  create_options_from_array($('#property_measuring_unit'), area_units, conversion_value);
  create_options_from_array($('#property_flooring'),
    ['Marble','Vitrified Tile','Vinyl','Hardwood','Granite','Bamboo','Concrete','Laminate','Linoleum','Tarrazzo','Brick','Other'],
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

$('document').ready(function(){
  
  $(document).ajaxSend(function (event, jqxhr, settings) {
    settings.data += '&csrfmiddlewaretoken=' + window.getCookie('csrftoken');
    if (settings.type == "POST") {
      jqxhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
  })

  // $(document).ajaxComplete(function (event, xhr, settings) {
  //   debugger
  // })

  $(window).resize(set_footer);

  custom_validators();

  register_form_validation();

  login_form_validation();

  verify_number_form_validation();

  enter_number_form_validation();

  set_password_form_validation();

  change_password_form_validation();

  set_custom_alerts();

  add_tawk_to();

  set_footer();
  
  set_character_count();

  set_logout();

  profile_form_validation();

  roomie_ad_form_validation();

  property_ad_form_validation();

  var $enter_mobile_number = $('#modalEnterNumberForm').find('#enter_mobile_number');

  $('[data-action=add-number]').click(function(){
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

  $('#resend_otp').click(function(){
    set_resend_otp();
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

  create_options_for_property_form_fields();

  // var options = $('#id_images option:selected');
  // if(options.length>0){
  //     $('#uploaded_images_container').css({'display':'block'});
  //     $.each(options,function(i,option){
  //         var img = document.createElement('img');
  //         img.src = $(option).text();
  //         $('#uploaded_images_container').append(img);
  //     })
  // }

  enable_add_image();

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

  initialize_form_selectize();

  set_carousel();

  show_indeterminate_progess();
});
