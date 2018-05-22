$( document ).ready(function() {
  $('#submit').click(function() {
    var data = $('form').serializeArray();
    var valid = true;

    data.forEach((formItem) => {
      if (formItem.value === '') {
        valid = false;
      }
    });

    if (valid) {
      $.ajax({
        type: 'POST',
        url: 'record/submit',
        data: data,
        success: function(msg) {
          if (msg.status && msg.status === 'success') {
            swal({
              title: 'Your record:',
              html: 'Customer Name: ' + msg.data.name + '<br/>' +
                'Customer Phone Number: ' + msg.data.phone + '<br/>' +
                'Currency: ' + msg.data.currency + '<br/>' +
                'Price: ' + msg.data.price + '<br/>',
              type: 'success'
            });
            return false;
          }

          swal({
            title: 'No this record',
            type: 'error'
          });
        },
      });

      return false;
    }
  })
});
