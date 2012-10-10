define(['text!template/user.html','current-users','model/user','backbone'], 
  function(html,users,UserModel) {
  
  return Backbone.View.extend({
  
    name: "UserView",
    template: _.template(html),
  
    initialize: function() {

      var parent = this.attributes.parent.model;

      if(parent.has('owner')) {
        var owner = parent.get('owner');
        this.model = new UserModel({
          id: owner.display_name,
          reputation: owner.reputation,
          link: owner.link
        });

      } else {

        var id = parent.get('user_id');
        var model = users.get(id);
        if(!model) {
          model = new UserModel({
            id: id
          });
          users.add(model);
        }
        model.on('change', this.render, this);
        this.model = model;
      }

    },
  
    render: function() {
      this.executeTemplate();
    }
  
  });


});