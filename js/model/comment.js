define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "CommentModel",
    defaults: {
      'body'       : '',
      'owner'      : null,
      'user_id'    : -1
    },
    initialize: function() {
      this.log("init")
    }
  });

});