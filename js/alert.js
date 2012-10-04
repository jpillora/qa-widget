define(['util/ga','jquery'], function(ga) {

  var alertContainer = null, alert = null;

  $(document).ready(function() {
    alertContainer = $(".alert-container");
    alert = alertContainer.children(".alert");
    alertContainer.find('.alert button.close,.alert').click(hide);
  });

  function show(type, attentionMsg, msg, duration) {
    $(document).ready(function() {
      alert.attr('class','alert alert-'+type);
      alert.find('.attention').html(attentionMsg + ' ');
      alert.find('.text').html(msg.replace(/[^\w'\s]/g,''))
      alertContainer.fadeIn();

      if(duration === undefined)
        duration = 5000;
      
      setTimeout(hide,duration);
    });
  }

  function hide() {
    alertContainer.fadeOut();
  }

  return {
    error: function(msg,duration) {
      ga.event("error", msg);
      show('error', 'Error!',msg, duration);
    },
    warn: function(msg,duration) {
      show('warning', 'Warning!',msg, duration);
    },
    success: function(msg,duration) {
      show('success', 'Hooray!',msg, duration);
    },
    info: function(msg,duration) {
      show('info','Heads up!', msg, duration);
    }
  };

});