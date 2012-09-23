define(['jquery'], function() {

  var alert = null;

  $(document).ready(function() {
    alert = $(".alert-container");
    alert.find('.alert button.close,.alert').click(function() {
      alert.fadeOut();
    });
  });

  return {
    error: function(msg) {
      alert.find('.alert .text').html(msg);
      alert.fadeIn();
    }
  };

});