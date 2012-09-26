define(['text!template/date.html','lib/jquery.timeago','backbone'], 
  function(html) {
  
  return Backbone.View.extend({
  
    name: "DateView",
    template: _.template(html),
  
    initialize: function() {
      this.model = this.attributes.parent.model;
      
      if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function() {
          function pad(n) { return n < 10 ? '0' + n : n }
          return this.getUTCFullYear() + '-'
              + pad(this.getUTCMonth() + 1) + '-'
              + pad(this.getUTCDate()) + 'T'
              + pad(this.getUTCHours()) + ':'
              + pad(this.getUTCMinutes()) + ':'
              + pad(this.getUTCSeconds()) + 'Z';
        };
      }
    },
  
    render: function() {


      this.executeTemplate();
      
      //setup timeagos
      this.$(".timeago").timeago();
    }
  
  });


});