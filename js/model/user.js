define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "UserModel",
    defaults: {
      'user_id'     : null,
      'reputation'  : 0,
      'link'        : null
    },
    initialize: function() {
    }
    
  });

});