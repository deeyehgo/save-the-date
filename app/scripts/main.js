/* jshint devel:true */

(function() {
  'use strict';
  var data = {};
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

  window.addEventListener('resize', handleResize);
  window.dispatchEvent(new Event('resize'));

  var sw,
    sh,
    cw,
    ch;
  function handleResize(event) {
    sw = document.body.scrollWidth + 'px';
    sh = document.body.scrollHeight + 'px';

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

    isFormSubmit = true;

    data = {
      name: $('#mailing_address_name').val(),
      addressLine1: $('#mailing_address_line_1').val(),
      addressLine2: $('#mailing_address_line_2').val(),
      city: $('#mailing_address_city').val(),
      region: $('#mailing_address_region').is(':visible') ? $('#mailing_address_region').val() : '',
      state: $('#mailing_address_state').is(':visible') ? $('#mailing_address_state').val() : '',
      country: $('#mailing_address_country').val(),
      zipcode: $('#mailing_address_zipcode').val(),
    };

    var address = data.addressLine1 + '\n' +
      (data.addressLine2 ? data.addressLine2 + '\n' : '') +
      (data.city ? data.city + ', ' : '') +
      (data.region ? data.region + ' ' : '') +
      (data.state ? data.state + ' ' : '') +
      data.zipcode;

    var timeline = new TimelineMax();
    var tt = 1.2;
    timeline.add([
      TweenMax.fromTo($('.form-name'), tt, {scale: 1, transformPerspective: 600}, {scale: 0.9, ease: Elastic.easeOut, easeParams:[1.2, 1]}),
      TweenMax.fromTo($('.form-address'), tt, {scale: 1, transformPerspective: 600}, {scale: 0.9, ease: Elastic.easeOut, easeParams:[1.2, 1]}),
      TweenMax.fromTo($('.form-inline'), tt, {scale: 1, transformPerspective: 600}, {scale: 0.9, ease: Elastic.easeOut, easeParams:[1.2, 1]}),
      TweenMax.fromTo($('.form-country'), tt, {scale: 1, transformPerspective: 600}, {scale: 0.9, ease: Elastic.easeOut, easeParams:[1.2, 1]}),
      TweenMax.fromTo($('.btn'), tt, {scale: 1, transformPerspective: 600}, {scale: 0.9, ease: Elastic.easeOut, easeParams:[1.2, 1]})
    ], 0, 'sequence', -tt + .1).play();

    $('.btn').addClass('disable');

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
          setTimeout(hideForm, 0);
        }
      }
    });
    
    function hideForm() {
      var ttOut = 1.2;
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
      TweenMax.to(window, 1, {scrollTo: {y: 0}, ease: Expo.easeOut});

      timelineOut.add([
        TweenMax.to($('.form-name'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.form-address'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.form-inline'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.form-country'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.btn'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'})
      ], 0, 'sequence', -ttOut + .1).play();

      TweenMax.fromTo($('.confirmation-container'), 2, {xPercent: 0, scale: 0.5, autoAlpha: 0}, {xPercent: 0, scale: 1, autoAlpha: 1, delay: timelineOut.duration() - .2 , ease: Elastic.easeOut, easeParams:[1.2, 1.9]});
    }

    function validateForm() {
      //check name
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
  }
}());