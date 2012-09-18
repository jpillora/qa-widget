//Body view - Handles formatting and highlighting within text bodies
define(['lib/prettify','backbone'], 
  function(){
  return Backbone.View.extend({
  	 
    render: function() {

      this.$('pre>code').parent().each(function() {
        var code = $(this).html();
        var newCode = $(prettyPrintOne(code));

        newCode.find('span').each(function() {
          $(this).html( 
            $(this).html().replace(/\n/g,'<br/>').replace(/\ /g,'&nbsp;')
          );
        });
          
        $(this).addClass('prettyprint').html(newCode);
      });

      return this;
    }

  });

});