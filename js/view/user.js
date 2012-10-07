define(['text!template/user.html','backbone'], 
  function(html) {
  
  return Backbone.View.extend({
  
    name: "UserView",
    template: _.template(html),
  
    initialize: function() {

      this.model = {};
      var parent = this.attributes.parent.model;

      if(parent.has('owner')) {
        var owner = parent.get('owner');
        this.model.user_id = owner.display_name;
        this.model.reputation = owner.reputation;
        this.model.link = owner.link;
      } else {
        this.model.user_id = parent.get('user_id');
        this.model.reputation = 0;
        this.model.link = null;
      }

    },
  
    render: function() {
      this.executeTemplate();
    }
  
  });


});