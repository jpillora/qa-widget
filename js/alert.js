define(['util/ga','jquery'], function(ga) {

  var alertContainer = null, alert = null, queue = [];

  $(document).ready(function() {
    alertContainer = $(".alert-container");
    alert = alertContainer.children(".alert");
    alertContainer.find('.alert button.close,.alert').click(hide);
  });

  //add to alerts queue
  function add() {
    queue.push(arguments);
    if(queue.length === 1) show();
  }

  //show the current alert
  function show() {
    if(queue.length === 0) return;
    var args = queue[0];
    //inner helper
    (function(type, attentionMsg, msg, duration) {

      $(document).ready(function() {
        alert.attr('class','alert alert-'+type);
        alert.find('.attention').html(attentionMsg + ' ');
        alert.find('.text').html(msg.replace(/[^\w'\s]/g,''))
        alertContainer.fadeIn();

        if(duration === undefined)
          duration = 5000;
        
        setTimeout(hide,duration);
      });

    }).apply(this, args);
  }

  //hide the current alert, trigger next
  function hide() {
    alertContainer.fadeOut(function() {
      queue.shift();
      if(queue.length > 0) show();
    });
  }

  return {
    error: function(msg,duration) {
      ga.event("error", msg);
      add('error', 'Error!',msg, duration);
    },
    warn: function(msg,duration) {
      add('warning', 'Warning!',msg, duration);
    },
    success: function(msg,duration) {
      add('success', 'Hooray!',msg, duration);
    },
    info: function(msg,duration) {
      add('info','Heads up!', msg, duration);
    }
  };

});