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
        url: 'submit',
        data: data,
        success: function(msg) {
          if (msg.status && msg.status === 'success') {
            swal({
              title: 'Your payment submitted',
              html: 'Reference code: ' + msg.id,
              type: 'success'
            }).then(function() {
              location.reload();
            });
            return false;
          }

          swal({
            title: 'Payment submit failed',
            type: 'error'
          }).then(function() {
            location.reload();
          });
        },
      });

      return false;
    }
  })
});
