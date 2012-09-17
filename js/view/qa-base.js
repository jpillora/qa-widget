//Question view
define(['backbone'], 
  function(){

  return Backbone.View.extend({

    name: "QAView",

    toggle: function(btn,selector) {
      this.$(selector).first().toggle('slow', function() {
        var text = btn.html();
        text = text.replace(/hide|show/i, $(this).is(':hidden') ? 'Show' : 'Hide')
        btn.html(text);
      });
    }
    
  });
});
