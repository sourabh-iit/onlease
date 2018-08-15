var set_password = false;
var add_number = false;
var mobile_number = "";
var url="", height=150, width=150;
var ad_mode = false;
var val = 0;
var prefix;
var fileReader = new FileReader();
var filterType = /^(?:image\/gif|image\/jpeg|image\/jpeg|image\/jpeg|image\/png|image\/svg\+xml|image\/x\-icon|image\/x\-rgb)$/i;
var max_width = 2000;
var max_height = 2000;
var file = [];
var upload_image_url;
var regions_url = window.API_PREFIX + 'locations/regions2/';

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
  if(value.toLowerCase()=='search'){
    business=$('#id_business').val();
  } else {
    business='none';
  }
  var plugins=[];
  if(remove_button){
    plugins=['remove_button'];
    render = Object.assign(render,{
      item: function(item,escape){
        return `
        <div class="item active" data-value="${item.id} ">
          ${shortForm(item.region)}
          <a href="javascript:void(0)" class="remove" tabindex="-1" title="Remove">×</a>
        </div>
        `;
      }
    })
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
          business: business,
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
    var ul = document.createElement('ul');
    ul.className = "p-0";
    ul.style.listStyle = 'none';
    for(let error_key in errors){
        for(let error in errors[error_key]){
            var li = document.createElement('li');
            li.className = "alert alert-danger";
            $(li).html(
                errors[error_key] + 
                `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>`
            );
            ul.append(li);
        }
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
                    password: $('#login_password').val()
                }
                let url = window['API_PREFIX']+'account/login/';
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
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5adef5845f7cdf4f05338e80/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
    })();
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
                    confirm_password: $('#register_confirm_password').val()
                }
                var url = API_PREFIX + 'account/register/';
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
                });
            }
        }
    });
}


function property_ad_form_validation(){
  var form =  $('#modalPropertyAdForm');
  form.on('show.bs.modal',function(){
      url = window.roomie_image_url;
      height = 2000;
      width = 2000;
  });
  var propertyAdFormValidator = form.validate({
      rules: {
          title: {
              alphabets_or_digits_only: true,
              maxlength: 70,
              required: true,
          },
          type: {
            required: true,
          },
          flooring: {
            required:true,
          },
          halls: {
            required: true,
          },
          other_rooms: {
            required: true,
          },
          bedrooms: {
            required: true,
          },
          floor_no: {
            required: true,
            // less_than_total_floors: true,
            numbers_only: true,
          },
          total_floors: {
            required: true,
            numbers_only: true,
          },
          bathrooms: {
            required: true,
          },
          balconies: {
            required: true,
          },
          property_type_other: {
            required: {
              depends: function(element){
                return $('#property_type option:selected').text().toLowerCase()=='other';
              }
            }
          },
          rent: {
              required: true,
              numbers_only: true
          },
          // property_image: {
          //   minlength: 3,
          // },
          booking_amount: {
            required: true,
            numbers_only: true,
          },
          additional_details: {
            required: true,
          },
          property_flooring_other: {
            required: {
              depends: function(element){
                return $('#property_flooring option:selected').text().toLowerCase()=='other';
              }
            }
          },
          security_deposit: {
            required: true,
            numbers_only: true,
          },
          area: {
            required: true,
            numbers_only: true,
          },
          available_from: {
            required: true,
          },
          region: {
            required: true,
          },
          address: {
            required: true,
          }
      },
      errorPlacement: function(error, element){
        if(element.prop('nodeName')=='SELECT'){
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
          // propertyAdFormValidator.form();
          if($(form).valid()){
              var data = {
                  'title': $('#property_title').val(),
                  'region': $('#property_region').val(),
                  'lodging_type': $('#property_type').val(),
                  'lodging_type_other': $('#property_type_other').val(),
                  'total_floors': $('#property_total_floors').val(),
                  'floor_no': $('#property_floor_no').val(),
                  'furnishing': $('#property_furnishing').val(),
                  'facilities': getSelectValues('property_facilities'),
                  'rent': $('#property_rent').val(),
                  'available_from': $('#property_available_from').val(),
                  'area': $('#property_area').val(),
                  'area_unit': $('#property_measuring_unit').val(),
                  'bathrooms': $('#property_bathrooms').val(),
                  'other_rooms': $('#property_other_rooms').val(),
                  'bedrooms': $('#property_bedrooms').val(),
                  'balconies': $('#property_balconies').val(),
                  'halls': $('#property_halls').val(),
                  'security_deposit': $('#property_security_deposit').val(),
                  'booking_amount': $('#property_booking_amount').val(),
                  'flooring': $('#property_flooring').val(),
                  'flooring_other': $('#property_other').val(),
                  'additional_details':$('#property_additional_details').val(),
                  'images': getSelectValues('property_images'),
                  'address': $('#property_address').val(),
              }
              $.ajax({
                  'type':'POST',
                  'dataType':'json',
                  'url': window.create_property_url,
                  'data': data,
                  traditional: true,
              }).always((data)=>{
                  if(data.status=='200'){
                    create_and_display_success_message('Post added.')
                  } else {
                    display_errors(data,form);
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
                    confirm_password: $('#set_confirm_password').val()
                }
                var url = API_PREFIX + 'account/reset-password/';
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
                    confirm_password: $('#change_confirm_password').val()
                }
                var url = API_PREFIX + 'account/change-password/';
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
    jQuery.validator.addMethod('numbers_only',function(value,element){
        return this.optional(element) || /^[0-9]*$/.test(value);
    },'Can contain digits only.');
    jQuery.validator.addMethod('alphabets_or_digits_only',function(value,element){
        return this.optional(element) || /^[a-zA-Z0-9 ]*$/.test(value);
    },'Can contain alphabets and digits only.');
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
      return $('#property_floor_no').val()<=$('#property_total_floors').val();
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
        $.ajax({
            type: 'POST',
            url: window['API_PREFIX'] + 'account/logout/',
            data: {},
            dataType: 'JSON'
        }).always((data)=>{
            create_and_display_success_message('Logging out');
            setTimeout(function(){
                window.location.reload();
            },1000);
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

fileReader.onload = function (event) {
    var image = new Image();
    image.onload=function(){
        var canvas=document.createElement("canvas");
        var context=canvas.getContext("2d");
        if(max_width/max_height>image.width/image.height){
            canvas.height = max_height;
            canvas.width = (image.width/image.height)*max_height;
        } else {
            canvas.width = max_width;
            canvas.height = (image.height/image.width)*max_width;
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
        if(url==window.image_url){
          max_height = 1000;
          max_width = 1000;
        }
        $.ajax({
            type:'POST',
            url: upload_image_url,
            data: {
                'image': dataURL
            },
            headers: {
                'X-CSRFToken': window.csrf_token
            }
        }).done(function(res){
            if(upload_image_url==window.image_url){
              $('#profile').trigger('profile-updated',[res.id,res.url]);
            }
            $(file).val("");
            var div = document.createElement('div');
            div.className = 'flex';
            var i = document.createElement('i');
            i.className='fa fa-check-circle right';
            div.appendChild(i);
            $('#text_'+$(file).attr('id')).after(div);
            var option = document.createElement('option');
            $(option).val(res.id);
            $(option).text(res.url_thumbnail);
            $(option).attr('selected',true);
            var image_id='#id_images';
            if(window.prefix){
              image_id='#'+window.prefix+'_images';
            }
            $(image_id).append(option);
            $(image_id).trigger('change');
            $(image_id+'_contain').append(`<img src="${res.url_thumbnail}">`);
        }).fail(function(err){
            console.log(err);
        }).always(function(data){
            // console.log(data);
        });
    }
    image.src=event.target.result;
};

var loadImageFile = function (id,url=window.roomie_image_url) {
    file=document.getElementById(id);
    upload_image_url=url;
    //check and retuns the length of uploded file.
    if (file.files.length === 0) {
        return; 
    }
    
    //Is Used for validate a valid file.
    var uploadFile = document.getElementById(id).files[0];
    if (!filterType.test(uploadFile.type)) {
        alert("Please select a valid image."); 
        return;
    }
    
    fileReader.readAsDataURL(uploadFile);
}

function enable_add_image(){
  $('span').filter(function(){
    return this.id.match(/add_image$/);
  }).click(function(){
      var name = 'image-'+val+'-image';
      var id = "id_"+name;
      var image_input = `
      <div class="uploader">
          <label class="fileContainer pd-1 btn btn-outline-primary btn-sm waves-effect waves-light active">
              Choose files
              <input type="file" id="`+id+`" name=`+name+` onchange="loadImageFile('`+id+`')" class="d-none">
          </label>
          <input type="text" disabled id=text_`+id+` class="form-control" padding-0 placeholder="upload your image">
      </div>`;
      var arr=this.id.split('_');
      prefix=null;
      if(arr.length>2){
        prefix = arr.slice(0,-2).join('_');
      }
      var id_image_container = 'images_container';
      if(prefix){
        id_image_container = prefix+'_'+id_image_container;
      }
      $('#'+id_image_container).append(image_input);
      $("input[id="+id+"]").on('change',function(e){
        $("input[id=text_"+id+"]").attr('placeholder',e.target.files[0].name);
      });
      val++;
  });
}

function formToString(filledForm,select_ids) {
  formObject = new Object;
  filledForm.find("input, select, textarea").each(function() {
    if (this.id) {
      elem = $(this);
      if(select_ids.includes(this.id)){
        list = [];
        $(this).find('option[selected]').each(function(){
          list.push({
            id: $(this).val(),
            region: $(this).text(),
          });
        });
        formObject[this.id] = list;
      } else if(this.id.match(/_images$/)){
        var obj=[];
        $(this).find('option[selected]').each(function(){
          obj.push({
            value: $(this).val(),
            url: $(this).text()
          });
        });
        formObject[this.id]=obj;
      }
      else {
        if (elem.attr("type") == 'checkbox' || elem.attr("type") == 'radio') {
          formObject[this.id] = elem.attr("checked");
        } else {
          formObject[this.id] = elem.val();
        }
      }
    }
  });
  formString = JSON.stringify(formObject);
  create_and_display_success_message('saved')
  return formString;
}

function stringToForm(formString, unfilledForm, select_ids) {
  if(!formString){
    return
  }
  formObject = JSON.parse(formString);
  unfilledForm.find("input, select, textarea").each(function() {
      if (this.id) {
        id = this.id;
        elem = $(this);
        if(select_ids.includes(id)){
          var items = formObject[id];
          for(var i in items){
            $('#'+id).append(`<option value=${items[i].id} selected="selected">${items[i].region}</option>`);
          }
        } else if(id.match(/_images$/)){
          var div = document.createElement('div');
          div.id = id+'_contain';
          div.className = 'images_container';
          for(var i in formObject[id]){
            $(div).append(`<img src="${formObject[id][i].url}">`);
            $(this).append(`<option value="${formObject[id][i].value}" selected="selected">${formObject[id][i].url}</option>`);
          }
          $(this).after(div);
          $(this).after('<div class="w-100 images-added-heading">Images added by you</div>');
        }
        else {
          if (elem.attr("type") == "checkbox" || elem.attr("type") == "radio" ) {
            elem.attr("checked", formObject[id]);
          } else {
            elem.val(formObject[id]).trigger('change');
          }
        }
      }
  });
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

function initialize_form_selectize(){
  $(document).on('initialize_form_selectize',function(){
    $('#roomie_regions').selectize(get_selectize_configurations('roomie'));
    $('#property_region').selectize(get_selectize_configurations('property',false));
    $('#property_facilities').selectize({
      plugins: ['remove_button'],
      copyClassesToDropdown: false,
    })
    $('select:not([hidden=true])').selectize({
      copyClassesToDropdown: false,
    });
  });
}

function display_full_screen_carousel(ad_images,rent,location,type,available_from,title){
  $('#full_screen_carousel_modal').remove();
  var carousel = `
  <div class="modal fade full_screen" id="full_screen_carousel_modal"  tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="full_screen_carousel_modal-title">
          ${title}
          </h5>
          <div class="zoom-container">
            <i class="fa fa-search-plus" id="full_screen_carousel_zoom-in"></i>
            <i class="fa fa-search-minus" id="full_screen_carousel_zoom-out"></i>
            <i class="fa fa-refresh" id="full_screen_carousel_reset"></i>
          </div>
          <button type="button" class="close btn btn-danger" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span> close
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
`
  $('body').append(carousel);
  $('#full_screen_carousel_modal').modal({
    show:true,
  });
  $('#full_screen_carousel').carousel('pause');
  $('#full_screen_carousel').off('slide.bs.carousel');
  $('#full_screen_carousel').on('slide.bs.carousel',function(event){
    var $img = $(event.relatedTarget).children().children('img');
    if($img.attr('data-src')){
      $img.attr('src',$img.attr('data-src'));
    }
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

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$('document').ready(function(){

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
      }
    }
  });

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

    $('#property_available_from').Zebra_DatePicker({
      default_position: 'below',
      show_icon: false,
      open_on_focus: true,
      format: 'd-m-Y',
      direction: [1,15],
      container: $('#datepicker-container'),
      onSelect: function(){
        $('#property_available_from').trigger('change');
      }
    });

    create_options(1,20,$('#property_total_floors'));
    create_options(1,20,$('#property_floor_no'));
    create_options(0,6,$('#property_bathrooms'));
    create_options(0,6,$('#property_bedrooms'));
    create_options(0,6,$('#property_halls'));
    create_options(0,6,$('#property_other_rooms'));
    create_options(0,6,$('#property_balconies'));
    create_options_from_array($('#property_measuring_unit'),
      ['Gaj','Sq. Ft.','Sq. Yds','Sq. Meter','Acre','Marla','Bigha','Kanal','Grounds','Ares','Biswa','Guntha','Hectares'],
      ['G','SF','SY','SM','A','M','B','K','GR','AR','BI','GU','H']
    );
    create_options_from_array($('#property_flooring'),
      ['Marble','Vitrified Tile','Vinyl','Hardwood','Granite','Bamboo','Concrete','Laminate','Linoleum','Tarrazzo','Brick','Other'],
      ['M','VT','V','H','G','B','C','L','LI','T','BR','O']
    );

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

    initialize_auto_save('modalPropertyAdForm',['property_region']);
    initialize_auto_save('modalRoomieAdForm',['roomie_regions']);

    initialize_form_selectize();

    set_carousel();
});
