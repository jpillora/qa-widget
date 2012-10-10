define(['model/user', 'qa-api'], function(UserModel,api) {

  var CurrentUsers = Backbone.Collection.extend({
    name: 'CurrentUsers',
    model: UserModel,
    initialize: function() {
      this.log("created");
      this.on('add',this.refresh,this);
    },
    update: function(model,result) {

      if(!result.changes.score) return;

      var id = model.get('user_id'),
          user = this.get(id);

      if(user) this.refresh(user);
    },
    refresh: function(userModel) {
      userModel.log("refresh");
      api.local.user(userModel.id, this, function(data) {
        userModel.set('reputation',data.reputation);
      });
    }

  });

  return new CurrentUsers;

});