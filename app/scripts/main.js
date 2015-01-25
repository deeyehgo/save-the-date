/* jshint devel:true */

(function() {
  'use strict';
  var data = {};
  var isFormSubmit = false;

  $('#form').on('submit', function() {
    if(isFormSubmit) {
      return false;
    }
    postToForm();
    isFormSubmit = true;
    return false;
  });

  var stateCopy = document.querySelector('.state-container-select');
  $('#mailing_address_state').change(function(event) {
    // stateCopy.innerHTML = $(this).val();
  }).trigger('change');

  $('#mailing_address_country').change(function() {
    if($(this).val() !== 'United States of America') {
      $('.form-region').show();
      $('.form-state').hide();
      data.state = '';
    } else {
      $('.form-region').hide();
      $('.form-state').show();
      data.region = '';
    }
  }).trigger('change'); 

  var bg = document.querySelector('.bg');
  var decoration = document.querySelector('.decoration');

  window.addEventListener('resize', handleResize);
  window.dispatchEvent(new Event('resize'));

  var cw, ch;
  function handleResize(event) {
    cw = document.documentElement.clientWidth + 'px';
    ch = document.documentElement.clientHeight + 'px';

    bg.style.width = cw;
    bg.style.height = ch;

    decoration.style.width = cw;
    decoration.style.height = ch;
  }

  function postToForm() {
    validateForm();

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
      (data.city ? data.city + ' ' : '') +
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
      url: 'https://docs.google.com/forms/d/1fOLyY39SWR9UWBMDSAyUobA96Z6AlKN0AuXVg5I5hm4/formResponse?formkey=1fOLyY39SWR9UWBMDSAyUobA96Z6AlKN0AuXVg5I5hm4',
      data: {
        'entry.1754132370': data.name,
        'entry.1951772713': address,
        'entry.2034185737': data.country
      },
      type: 'POST',
      dataType: 'xml',
      statusCode: {
        0: function() {
          console.log('fail');
          setTimeout(hideForm, 0);
        },
        200: function() {
          console.log('scuccess');
        }
      }
    });
    
    function hideForm() {
      var ttOut = 1.2;
      var timelineOut = new TimelineMax();
      timelineOut.add([
        TweenMax.to($('.form-name'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.form-address'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.form-inline'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.form-country'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'}),
        TweenMax.to($('.btn'), ttOut, {x: $(window).width(), autoAlpha: 0, ease: Elastic.easeInOut, easeParams:[1.2, .7], rotationY: '-90_short'})
      ], 0, 'sequence', -ttOut + .1).play();
      TweenMax.fromTo($('.confirmation'), 2, {scale: 0.5, autoAlpha: 0}, {scale: 1, autoAlpha: 1, delay: timelineOut.duration() - .2 , ease: Elastic.easeOut, easeParams:[1.2, 1.9]});
    }

    function validateForm() {
      //check name
      //check address
      //check city
      //check state or region (depending on country)
      //check zip
    }
  }
}());