//Body view - Handles formatting and highlighting within text bodies
define(['lib/prettify','backbone'], 
  function(){
  return Backbone.View.extend({
  	 
    render: function() {
      this.$('pre>code').each(function(i,e) {
        $(e).parent().addClass('prettyprint');
      });
      this.$el.ready(function() {
        setTimeout(prettyPrint, 250);
      });
      return this;
    }

  });

});