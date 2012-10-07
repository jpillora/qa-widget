define(['backbone'], function() {

  return Backbone.Model.extend({

    name: "AnswerModel",
    defaults: {
      'score'      : 0,
      'created_at' : null,
      'owner'      : null,
      'user_id'    : -1
    },
    initialize: function() {
      var creation_date = this.get('creation_date');
      if(creation_date) this.set('created_at', creation_date*1000);
    }
  });

});