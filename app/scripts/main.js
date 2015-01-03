/* jshint devel:true */

(function() {
  console.log('\'Allo \'Allo!');

  $('#form').submit(function() {
    postToForm();
    return false;
  });

  function postToForm() {
    var data = {
      name: $('#mailing_address_name').val(),
      addressLine1: $('#mailing_address_line_1').val(),
      addressLine2: $('#mailing_address_line_2').val(),
      city: $('#mailing_address_city').val(),
      region: $('#mailing_address_region').val() || '',
      state: $('#mailing_address_state').val() || '',
      country: $('#mailing_address_country').val(),
      zipcode: $('#mailing_address_zipcode').val(),
    };

    $.ajax({
      url: 'https://docs.google.com/forms/d/1fOLyY39SWR9UWBMDSAyUobA96Z6AlKN0AuXVg5I5hm4/formResponse',
      data: {
        'entry.1754132370': data.name,
        'entry.1951772713': data.addressLine1,
        'entry.193959104': data.addressLine2,
        'entry.120961676': data.city,
        'entry.1402498843': data.region,
        'entry.2064690771': data.state,
        'entry.1555058349': data.country,
        'entry.2072668996': data.zipcode
      },
      type: 'POST',
      dataType: 'xml',
      statusCode: {
        0: function() {
          //success
          console.log('scuccess');
        },
        200: function() {
          // success
          console.log('scuccess');
        }
      }
    });
  }
}());