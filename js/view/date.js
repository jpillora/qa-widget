define(['text!template/date.html','lib/jquery.timeago'], 
  function(html) {
  
  return Backbone.View.extend({
  
    name: "DateView",
    template: _.template(html),
  
    initialize: function() {
      this.model = this.attributes.parent.model;
    },
  
    render: function() {
      this.executeTemplate();
      
      //setup timeagos
      this.$(".timeago").timeago();
    }
  
  });


});