//Body view - Handles formatting and highlighting within text bodies
define(['prettify','backbone'], 
  function(){
  return Backbone.View.extend({
  	 
    render: function() {
      this.$('pre>code').each(function(i,e) {
        $(e).parent().addClass('prettyprint');
      });
      this.$el.ready(prettyPrint);
      return this;
    }


  });

});