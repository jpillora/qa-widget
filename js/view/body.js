//Body view - Handles formatting and highlighting within text bodies
define(['lib/prettify','backbone'], 
  function(){
  return Backbone.View.extend({
  	 
    render: function() {

      this.$('pre>code').parent().each(function() {
        var code = $(this).html();
        var newCode = prettyPrintOne(code);
        $(this).addClass('prettyprint').html(newCode);
      });
      /*
      this.$el.ready(function() {
        setTimeout(prettyPrint, 250);
      });
      */
      return this;
    }

  });

});