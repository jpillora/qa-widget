define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "CommentModel",
    defaults: {
      'body'       : ''
    },
    initialize: function() {
      this.log("init")
    }
  });

});