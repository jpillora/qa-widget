define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "CommentModel",
    defaults: {
      'body'       : '',
      'owner'      : null,
      'user_id'    : -1
    },
    initialize: function() {
      var creation_date = this.get('creation_date');
      if(creation_date) this.set('created_at', creation_date*1000);
    }
  });

});