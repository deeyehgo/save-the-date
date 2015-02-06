/* jshint devel:true */

(function() {
  'use strict';
  var data = {};
  var address;
  var isFormSubmit = false;
  var stateCopy = document.querySelector('.state-container-select');

  $('#form').on('submit', function() {
    if(isFormSubmit) {
      return false;
    }

    postToForm();
    return false;
  });

  $('#mailing_address_country').change(function() {
    if($(this).val() !== 'United States of America') {
      $('.form-region').show();
      $('.form-state').hide();
      $('.stateText').attr('required', true);
      data.state = '';
    } else {
      $('.form-region').hide();
      $('.form-state').show();
      $('.stateText').attr('required', false);
      data.region = '';
    }
  }).trigger('change'); 

  var bg = document.querySelector('.bg');
  var decoration = document.querySelector('.decoration');

  $(window).on('resize', handleResize);
  $(window).trigger('resize');

  var sw,
    sh,
    cw,
    ch;
  function handleResize(event) {
    sw = document.body.scrollWidth + 'px';
    sh = ($(document).height() + 40) + 'px';

    cw = document.documentElement.clientWidth + 'px';
    ch = document.documentElement.clientHeight + 'px';

    bg.style.width = cw;
    bg.style.height = sh;

    decoration.style.width = cw;
    decoration.style.height = sh;
  }

  function postToForm() {
    if(validateForm() == false) {
      return;
    }

    $('.send-text').hide();
    $('.sending-text').show();

    isFormSubmit = true;

    data = {
      name: $('#mailing_address_fullname').val(),
      addressLine1: $('#mailing_address_line_1').val(),
      addressLine2: $('#mailing_address_line_2').val(),
      city: $('#mailing_address_city').val(),
      region: $('#mailing_address_region').is(':visible') ? $('#mailing_address_region').val() : '',
      state: $('#mailing_address_state').is(':visible') ? $('#mailing_address_state').val() : '',
      country: $('#mailing_address_country').val(),
      zipcode: $('#mailing_address_zipcode').val(),
    };

    address = data.addressLine1 + '\n' +
      (data.addressLine2 ? data.addressLine2 + '\n' : '') +
      (data.city ? data.city + ', ' : '') +
      (data.region ? data.region + ' ' : '') +
      (data.state ? data.state + ' ' : '') +
      data.zipcode;

    var timeline = new TimelineMax({
      onComplete: sendForm
    });

    var tt = 1.2;
    timeline.add([
      TweenMax.to($('.form-name'), tt, {x: "+=100px", autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7]}),
      TweenMax.to($('.form-address'), tt, {x: "+=100px", autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7]}),
      TweenMax.to($('.form-inline'), tt, {x: "+=100px", autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7]}),
      TweenMax.to($('.form-country'), tt, {x: "+=100px", autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7]}),
      TweenMax.to($('.btn'), 1, {y: -$('.save-the-date-container').height() + $('.btn').height() - 20, ease: Expo.easeInOut, delay: .5}),
      TweenMax.to($(window), 1, {scrollTo: {y: 0}, ease: Expo.easeOut, delay: .5})
    ], 0, 'sequence', -tt + .05).play();

    $('.btn').addClass('disable');
  }

  function sendForm() {
    $('.form').addClass('u-hide');
    $.ajax({
      url: $('.save-the-date').attr('action'),
      data: {
        'name': data.name,
        'address': address,
        'country': data.country
      },
      accepts: 'application/javascript',
      type: 'POST',
      statusCode: {
        200: function() {
          hideForm(200);
        },
        0: function() {
          hideForm(0);
        },
        404: function() {
          hideForm(404);
        }
      }
    });
  }

  function hideForm(statusCode) {
    var ttOut = .3;
    var timelineOut = new TimelineMax({
      onComplete: function() {
        $('.form-group').css({
          'display': 'none'
        });

        bg.style.height = ch;
        decoration.style.height = ch;
      }
    });

    $('input').blur();
    TweenMax.to($('.btn'), ttOut, {autoAlpha: 0});

    switch(statusCode) {
      case 200:
      case 0:
        TweenMax.fromTo($('.confirmation-container'), ttOut + .7, {autoAlpha: 0, y: '+= 12'}, {autoAlpha: 1, y: 0, delay: ttOut - .2, ease: Expo.easeOut});
        break;
      case 404:
        TweenMax.fromTo($('.submit-error-container'), ttOut + .7, {autoAlpha: 0, y: '+= 12'}, {autoAlpha: 1, y: 0, delay: ttOut - .2, ease: Expo.easeOut});
        break;
    }
  }

  function validateForm() {
    if(!$('.form-name input').val()) {
      error('.form-name input');
      return false;
    } else if(!$('.form-address input').val()) {
      error('.form-address input');
      return false;
    } else if(!$('.city').val()) {
      error('.city');
      return false;
    }

    if($('#mailing_address_country') !== 'United States of America') {
      if(!$('.state').val()) {
        return false;
      }
    } else {
      if(!$('.region').val()) {
        error('.region');
        return false;
      }
    }

    if(!$('.zipcode').val()) {
      error('.zipcode');
      return false
    }
  }

  function error(selector) {
    TweenMax.to(window, .2, {
      scrollTo: $(selector).offset().top - 50,
      ease: Expo.easeOut,
      onComplete: function() {
        var timeline = new TimelineMax();
        timeline.add([
          TweenMax.to($(selector), .1, {x: 5, ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {x: -5, ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {x: 5, ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {x: -5, ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {x: 0, ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {x: -5, ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {x: 0, ease: Expo.easeOut})
        ], 0, 'sequence', 0).play();

        var pulse = new TimelineMax();
        pulse.add([
          TweenMax.to($(selector), .1, {backgroundColor: '#f8c5c5', ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {backgroundColor: '#FFE4DB', ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {backgroundColor: '#f8c5c5', ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {backgroundColor: '#FFE4DB', ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {backgroundColor: '#f8c5c5', ease: Expo.easeOut}),
          TweenMax.to($(selector), .1, {backgroundColor: '#FFE4DB', ease: Expo.easeOut})
        ], 0, 'sequence', 0).play();
      }
    });
  }

  function errorForm() {
    TweenMax.fromTo($('.confirmation-container'), 2, {autoAlpha: 0}, {autoAlpha: 1, delay: timelineOut.duration() - .2});

  }
}());