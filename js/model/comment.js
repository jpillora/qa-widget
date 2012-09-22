define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "CommentModel",
    defaults: {
      'body'       : '',
      'owner'      : null
    },
    initialize: function() {
      this.log("init")
    }
  });

});